extends Control

# ==========================================
# CROWNSPIRE BAG MODULE: POPUP CONTROLLER
# ==========================================
# Orchestrates categories navigation, dynamic searching/filtering,
# item cards grid, details panel inspection, and persistent safe states.

@onready var search_edit: LineEdit = get_node_or_null("%SearchEdit")
@onready var sort_select: OptionButton = get_node_or_null("%SortSelect")
@onready var close_button: Button = get_node_or_null("%CloseButton")
@onready var tab_container: HBoxContainer = get_node_or_null("%TabContainer")
@onready var item_grid: GridContainer = get_node_or_null("%ItemGrid")
@onready var detail_panel: Control = get_node_or_null("%DetailPanel")

# Toasts
@onready var toast_panel: PanelContainer = get_node_or_null("%ToastPanel")
@onready var toast_label: Label = get_node_or_null("%ToastLabel")

# Preloaded Sub-scenes
@export var card_scene: PackedScene = preload("res://bag/scenes/InventoryItemCard.tscn")

const SAVE_PATH = "user://crownspire_bag_standalone_v1.json"

var categories: Array = []
var items_db: Dictionary = {}
var inventory_db: Dictionary = {} # { "item_id": count }
var active_category: String = "all"
var toast_timer: Timer

func _ready() -> void:
	# Timer setup for dismiss toasts
	toast_timer = Timer.new()
	toast_timer.one_shot = true
	toast_timer.wait_time = 2.5
	toast_timer.timeout.connect(_on_toast_timeout)
	add_child(toast_timer)

	# Setup buttons & interactive nodes
	if close_button:
		close_button.pressed.connect(_on_close_pressed)
	if search_edit:
		search_edit.text_changed.connect(_on_search_changed)
	if sort_select:
		_setup_sort_dropdown()
		sort_select.item_selected.connect(_on_sort_selected)
		
	# Setup Detail Panel connection
	if detail_panel:
		detail_panel.visible = false
		if detail_panel.has_signal("item_used"):
			detail_panel.item_used.connect(_on_item_used)
		if detail_panel.has_signal("chest_opened"):
			detail_panel.chest_opened.connect(_on_chest_opened)
		if detail_panel.has_signal("item_sold"):
			detail_panel.item_sold.connect(_on_item_sold)
		if detail_panel.has_signal("panel_closed"):
			detail_panel.panel_closed.connect(_on_detail_panel_closed)

	# Load Data & Draw UI
	_load_bag_module_data()
	_setup_category_tabs()
	_refresh_inventory_grid()

# ==========================================
# DATA LOADING ENGINE
# ==========================================

func _load_bag_module_data() -> void:
	# Load Categories
	categories = _load_json_array("res://bag/data/bag_categories.json")
	if categories.is_empty():
		categories = [
			{ "id": "all", "name": "ALL", "icon": "📦" },
			{ "id": "resources", "name": "RESOURCES", "icon": "🌾" },
			{ "id": "speedups", "name": "SPEEDUPS", "icon": "⚡" },
			{ "id": "hero", "name": "HERO", "icon": "🧙" },
			{ "id": "equipment", "name": "EQUIP", "icon": "🛡️" },
			{ "id": "materials", "name": "MATERIALS", "icon": "🧪" }
		]
		
	# Load Items catalog
	var raw_items = _load_json_array("res://bag/data/items.json")
	if raw_items.is_empty():
		# Critical fallback if files aren't created or readable
		raw_items = [
			{ "id": "resource_food_100k", "name": "100k Food Packet", "category": "resources", "rarity": "rare", "usable": true, "sellable": false },
			{ "id": "resource_wood_100k", "name": "100k Wood Bundles", "category": "resources", "rarity": "rare", "usable": true, "sellable": false },
			{ "id": "resource_stone_50k", "name": "50k Stone Blocks", "category": "resources", "rarity": "epic", "usable": true, "sellable": false },
			{ "id": "resource_iron_25k", "name": "25k Deep Iron Ore", "category": "resources", "rarity": "epic", "usable": true, "sellable": false },
			{ "id": "resource_diamond_1000", "name": "1,000 Royal Diamonds", "category": "resources", "rarity": "legendary", "usable": true, "sellable": false },
			{ "id": "speedup_research_1h", "name": "1h Academy Speedup", "category": "speedups", "rarity": "rare", "usable": true, "sellable": true, "value": 150 },
			{ "id": "speedup_construction_1h", "name": "1h Builder's Guild Blueprint", "category": "speedups", "rarity": "rare", "usable": true, "sellable": true, "value": 150 },
			{ "id": "speedup_universal_5m", "name": "5m Chrono Hourglass", "category": "speedups", "rarity": "common", "usable": true, "sellable": true, "value": 20 },
			{ "id": "hero_xp_potion_large", "name": "Large XP Elixir", "category": "hero", "rarity": "epic", "usable": true, "sellable": true, "value": 500 },
			{ "id": "statue_hero_shard", "name": "Sovereign Oath Shard", "category": "hero", "rarity": "legendary", "usable": false, "sellable": false },
			{ "id": "eq_weapon_recruit_s_training", "name": "Recruit's Broadsword", "category": "equipment", "rarity": "uncommon", "usable": false, "sellable": true, "value": 600 },
			{ "id": "eq_helmet_recruit_s_training", "name": "Recruit's Iron Visor", "category": "equipment", "rarity": "uncommon", "usable": false, "sellable": true, "value": 500 },
			{ "id": "crafting_stardust_gem", "name": "Stardust Crystal Shard", "category": "materials", "rarity": "epic", "usable": false, "sellable": true, "value": 300 },
			{ "id": "chest_golden_crown", "name": "Golden Imperial Chest", "category": "hero", "rarity": "mythic", "usable": true, "sellable": false, "chest_items": [
				{ "item_id": "resource_diamond_1000", "qty": 1 },
				{ "item_id": "hero_xp_potion_large", "qty": 3 }
			]}
		]
		
	for item in raw_items:
		if item.has("id"):
			items_db[item["id"]] = item

	# Load inventory counts
	_load_inventory_state()

func _load_inventory_state() -> void:
	var ui_mgr = get_node_or_null("/root/UIManager")
	if ui_mgr and not ui_mgr.player_inventory.is_empty():
		# Synchronize with active UIManager global database!
		inventory_db.clear()
		for entry in ui_mgr.player_inventory:
			if typeof(entry) == TYPE_DICTIONARY and entry.has("item_id"):
				inventory_db[entry["item_id"]] = entry.get("quantity", 0)
		print("[BagModule] Loaded %d inventory item definitions from UIManager." % inventory_db.size())
	else:
		# Standalone module offline fallback loading
		var local_inv = _load_json_dict("res://bag/data/inventory.json")
		if local_inv.is_empty():
			# Raw hard fallback
			local_inv = {
				"resource_food_100k": 25,
				"resource_wood_100k": 20,
				"resource_stone_50k": 10,
				"resource_iron_25k": 8,
				"resource_diamond_1000": 3,
				"speedup_research_1h": 15,
				"speedup_construction_1h": 12,
				"speedup_universal_5m": 45,
				"hero_xp_potion_large": 6,
				"statue_hero_shard": 15,
				"eq_weapon_recruit_s_training": 1,
				"eq_helmet_recruit_s_training": 1,
				"crafting_stardust_gem": 30,
				"chest_golden_crown": 4
			}
		inventory_db = local_inv
		print("[BagModule] Loaded %d inventory item definitions from offline JSON." % inventory_db.size())

func _save_inventory_state() -> void:
	# Sync back to UIManager if present
	var ui_mgr = get_node_or_null("/root/UIManager")
	if ui_mgr:
		# Update global array
		ui_mgr.player_inventory.clear()
		for key in inventory_db.keys():
			var count = inventory_db[key]
			if count > 0:
				ui_mgr.player_inventory.append({
					"item_id": key,
					"quantity": count,
					"is_favorite": false,
					"is_locked": false,
					"is_new": false
				})
		if ui_mgr.has_method("save_player_state"):
			ui_mgr.save_player_state()
		if ui_mgr.has_signal("inventory_updated"):
			ui_mgr.inventory_updated.emit()
	else:
		# Standalone file writing persistence
		var file = FileAccess.open(SAVE_PATH, FileAccess.WRITE)
		if file:
			file.store_string(JSON.stringify(inventory_db))
			file.close()

# ==========================================
# UI RENDERING & BUILDERS
# ==========================================

func _setup_sort_dropdown() -> void:
	if not sort_select:
		return
	sort_select.clear()
	sort_select.add_item("Sort: Default", 0)
	sort_select.add_item("Name (A-Z)", 1)
	sort_select.add_item("Quantity (High-Low)", 2)
	sort_select.add_item("Rarity (High-Low)", 3)
	sort_select.selected = 0

func _setup_category_tabs() -> void:
	if not tab_container:
		return
	for child in tab_container.get_children():
		child.queue_free()
		
	for cat in categories:
		var tab_button = Button.new()
		var display_name = cat.get("name", "TAB")
		var icon = cat.get("icon", "⚔️")
		tab_button.text = " " + icon + " " + display_name + " "
		tab_button.custom_minimum_size = Vector2(110, 42)
		tab_button.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		tab_button.focus_mode = Control.FOCUS_NONE
		
		# Hook tab logic
		var cat_id = cat.get("id", "all")
		tab_button.pressed.connect(func(): _on_category_tab_pressed(cat_id))
		
		tab_container.add_child(tab_button)
		
	_update_category_tab_styles()

func _update_category_tab_styles() -> void:
	if not tab_container:
		return
	var children = tab_container.get_children()
	for i in range(min(children.size(), categories.size())):
		var btn = children[i] as Button
		if btn:
			var is_active = (categories[i].get("id", "") == active_category)
			var style = _get_tab_active_style() if is_active else _get_tab_inactive_style()
			
			btn.add_theme_stylebox_override("normal", style)
			btn.add_theme_stylebox_override("hover", style)
			btn.add_theme_stylebox_override("pressed", style)
			btn.add_theme_stylebox_override("focus", style)
			
			btn.add_theme_color_override("font_color", Color(1, 1, 1, 1) if is_active else Color(0.65, 0.7, 0.75, 1))

func _refresh_inventory_grid() -> void:
	if not item_grid:
		return
		
	# Clear previous cards
	for child in item_grid.get_children():
		child.queue_free()
		
	var active_keys = _get_filtered_and_sorted_list()
	
	if active_keys.is_empty():
		_display_empty_grid_label()
		return
		
	for item_id in active_keys:
		var count = inventory_db[item_id]
		var item_data = items_db.get(item_id, {})
		
		if not card_scene:
			continue
			
		var card = card_scene.instantiate()
		item_grid.add_child(card)
		
		if card.has_method("init_card"):
			card.init_card(item_id, item_data, count)
		if card.has_signal("card_clicked"):
			card.card_clicked.connect(_on_item_card_clicked)

func _get_filtered_and_sorted_list() -> Array[String]:
	var result: Array[String] = []
	var query = search_edit.text.strip_edges().to_lower() if search_edit else ""
	
	for item_id in inventory_db.keys():
		var count = inventory_db[item_id]
		if count <= 0:
			continue
			
		var item_data = items_db.get(item_id)
		if not item_data:
			continue
			
		# Category check
		if active_category != "all":
			if item_data.get("category", "").to_lower() != active_category:
				continue
				
		# Search check
		if query != "":
			var name_match = query in item_data.get("name", "").to_lower()
			var desc_match = query in item_data.get("description", "").to_lower()
			if not name_match and not desc_match:
				continue
				
		result.append(item_id)
		
	# Sort logic
	var sort_idx = sort_select.selected if sort_select else 0
	match sort_idx:
		1: # A-Z Alphabetical
			result.sort_custom(func(a, b):
				return items_db[a]["name"].to_lower() < items_db[b]["name"].to_lower()
			)
		2: # Quantity High-Low
			result.sort_custom(func(a, b):
				return inventory_db[a] > inventory_db[b]
			)
		3: # Rarity High-Low
			result.sort_custom(func(a, b):
				var weight_a = _get_rarity_weight(items_db[a].get("rarity", ""))
				var weight_b = _get_rarity_weight(items_db[b].get("rarity", ""))
				if weight_a != weight_b:
					return weight_a > weight_b
				return items_db[a]["name"].to_lower() < items_db[b]["name"].to_lower()
			)
		_: # Default / ID Order
			result.sort()
			
	return result

func _get_rarity_weight(rarity: String) -> int:
	match rarity.to_lower():
		"mythic": return 5
		"legendary": return 4
		"epic": return 3
		"rare": return 2
		"uncommon": return 1
		_: return 0

func _display_empty_grid_label() -> void:
	var center = CenterContainer.new()
	center.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	center.size_flags_vertical = Control.SIZE_EXPAND_FILL
	item_grid.add_child(center)
	
	var label = Label.new()
	label.text = "No matching inventory items found."
	label.add_theme_color_override("font_color", Color(0.5, 0.55, 0.6, 1))
	center.add_child(label)

# ==========================================
# INTERACTIVE OPERATIONS / ACTIONS
# ==========================================

func _on_item_card_clicked(item_id: String) -> void:
	var count = inventory_db.get(item_id, 0)
	var item_data = items_db.get(item_id, {})
	
	if detail_panel and not item_data.is_empty():
		if detail_panel.has_method("show_details"):
			detail_panel.show_details(item_id, item_data, count)

func _on_item_used(item_id: String, use_count: int) -> void:
	var current_qty = inventory_db.get(item_id, 0)
	if current_qty < use_count:
		return
		
	# Deduct item
	_modify_item_count(item_id, -use_count)
	
	# Grant game economy benefits via UIManager integration
	var ui_mgr = get_node_or_null("/root/UIManager")
	var feedback = "Used 1x " + items_db[item_id].get("name", "Item") + "."
	
	if item_id == "resource_food_100k":
		if ui_mgr: ui_mgr.food += 100000
		feedback += " Added +100,000 Food."
	elif item_id == "resource_wood_100k":
		if ui_mgr: ui_mgr.wood += 100000
		feedback += " Added +100,000 Wood."
	elif item_id == "resource_stone_50k":
		if ui_mgr: ui_mgr.stone += 50000
		feedback += " Added +50,000 Stone."
	elif item_id == "resource_iron_25k":
		if ui_mgr: ui_mgr.iron += 25000
		feedback += " Added +25,000 Iron."
	elif item_id == "resource_diamond_1000":
		if ui_mgr: ui_mgr.royal_crystals += 1000
		feedback += " Added +1,000 Royal Crystals."
	elif "speedup" in item_id:
		feedback += " Chrono speed-up applied successfully!"
	elif "xp_potion" in item_id:
		if ui_mgr: ui_mgr.hero_xp_potions += 1
		feedback += " Transferred +1 XP Potion to Hero Deck."
		
	_show_notification_toast(feedback)
	_sync_and_redraw_inspection(item_id)

func _on_chest_opened(item_id: String, rewards: Array) -> void:
	var current_qty = inventory_db.get(item_id, 0)
	if current_qty <= 0:
		return
		
	# Deduct 1 chest
	_modify_item_count(item_id, -1)
	
	# Grant items contained inside chest rewards
	var rewards_feedback = "Opened Chest! Obtained: "
	var item_names = []
	for reward in rewards:
		var reward_item_id = reward.get("item_id", "")
		var qty = int(reward.get("qty", 1))
		
		_modify_item_count(reward_item_id, qty)
		var r_name = items_db.get(reward_item_id, {}).get("name", reward_item_id)
		item_names.append(str(qty) + "x " + r_name)
		
	rewards_feedback += ", ".join(item_names)
	
	_show_notification_toast(rewards_feedback)
	_sync_and_redraw_inspection(item_id)

func _on_item_sold(item_id: String, gold_earned: int) -> void:
	var current_qty = inventory_db.get(item_id, 0)
	if current_qty <= 0:
		return
		
	# Deduct item
	_modify_item_count(item_id, -1)
	
	# Grant gold
	var ui_mgr = get_node_or_null("/root/UIManager")
	if ui_mgr:
		ui_mgr.gold += gold_earned
		
	_show_notification_toast("Sold item. Received +" + str(gold_earned) + " Gold Coins.")
	_sync_and_redraw_inspection(item_id)

func _modify_item_count(target_id: String, delta: int) -> void:
	var current = inventory_db.get(target_id, 0)
	var new_qty = current + delta
	if new_qty <= 0:
		inventory_db.erase(target_id)
	else:
		inventory_db[target_id] = new_qty
		
	_save_inventory_state()

func _sync_and_redraw_inspection(item_id: String) -> void:
	# Redraw active cards
	_refresh_inventory_grid()
	
	# Update or close inspection detail panel
	var remaining = inventory_db.get(item_id, 0)
	if remaining <= 0:
		if detail_panel:
			detail_panel.visible = false
	else:
		if detail_panel and detail_panel.has_method("show_details"):
			detail_panel.show_details(item_id, items_db[item_id], remaining)

func _on_detail_panel_closed() -> void:
	_refresh_inventory_grid()

# ==========================================
# CATEGORY TABS CONTROL
# ==========================================

func _on_category_tab_pressed(cat_id: String) -> void:
	if active_category == cat_id:
		return
	active_category = cat_id
	_update_category_tab_styles()
	_refresh_inventory_grid()

func _on_search_changed(_text: String) -> void:
	_refresh_inventory_grid()

func _on_sort_selected(_idx: int) -> void:
	_refresh_inventory_grid()

func _on_close_pressed() -> void:
	visible = false

# ==========================================
# NOTIFICATION TOASTS
# ==========================================

func _show_notification_toast(message: String) -> void:
	if not toast_panel or not toast_label:
		# Fallback to standard console logger
		print("[Bag Toast]: " + message)
		return
		
	toast_label.text = message
	toast_panel.visible = true
	toast_panel.modulate = Color(1, 1, 1, 0)
	
	var tween = create_tween()
	tween.tween_property(toast_panel, "modulate:a", 1.0, 0.22)
	
	toast_timer.start()

func _on_toast_timeout() -> void:
	if not toast_panel:
		return
	var tween = create_tween()
	tween.tween_property(toast_panel, "modulate:a", 0.0, 0.3)
	tween.finished.connect(func(): toast_panel.visible = false)

# ==========================================
# HELPER PARSER AND STYLE OVERRIDES
# ==========================================

func _get_tab_active_style() -> StyleBoxFlat:
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.192, 0.478, 0.820, 1) # Royal blue active highlight
	style.corner_radius_top_left = 6
	style.corner_radius_top_right = 6
	style.corner_radius_bottom_right = 6
	style.corner_radius_bottom_left = 6
	return style

func _get_tab_inactive_style() -> StyleBoxFlat:
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.117, 0.141, 0.180, 1) # Standard background
	style.border_width_left = 1
	style.border_width_top = 1
	style.border_width_right = 1
	style.border_width_bottom = 1
	style.border_color = Color(0.176, 0.220, 0.286, 1)
	style.corner_radius_top_left = 6
	style.corner_radius_top_right = 6
	style.corner_radius_bottom_right = 6
	style.corner_radius_bottom_left = 6
	return style

func _load_json_array(path: String) -> Array:
	if not FileAccess.file_exists(path):
		return []
	var file = FileAccess.open(path, FileAccess.READ)
	if not file:
		return []
	var json = JSON.new()
	if json.parse(file.get_as_text()) == OK:
		if typeof(json.data) == TYPE_ARRAY:
			return json.data
	return []

func _load_json_dict(path: String) -> Dictionary:
	if not FileAccess.file_exists(path):
		return {}
	var file = FileAccess.open(path, FileAccess.READ)
	if not file:
		return {}
	var json = JSON.new()
	if json.parse(file.get_as_text()) == OK:
		if typeof(json.data) == TYPE_DICTIONARY:
			return json.data
	return {}
