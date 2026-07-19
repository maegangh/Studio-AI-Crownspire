# ==============================================================================
# Crownspire MMO Strategy Game - Bag Scene Controller
# Godot 4 / GDScript 2.0 Client-side persistent inventory
# ==============================================================================
# This controller handles loading, stacking, sorting, filtering, searching,
# displaying, and saving a user's inventory bags across multiple MMO item categories.
# Fully custom styled components are dynamically built for stability and precision.
# ==============================================================================

extends Control

# --- Constant Node References ---
@onready var search_edit: LineEdit = $Layout/Header/MarginContainer/HBoxContainer/SearchEdit
@onready var sort_select: OptionButton = $Layout/Header/MarginContainer/HBoxContainer/SortSelect
@onready var close_button: Button = $Layout/Header/MarginContainer/HBoxContainer/CloseButton
@onready var tab_box: HBoxContainer = $Layout/TabScroll/TabBox
@onready var item_grid: GridContainer = $Layout/ContentMargin/ScrollContainer/ItemGrid

# --- Popup Modal Node References ---
@onready var details_modal: Control = $DetailsModal
@onready var popup_icon_border: PanelContainer = $DetailsModal/PopupPanel/MarginContainer/VBoxContainer/PopupHeader/IconBorder
@onready var popup_icon_texture: TextureRect = $DetailsModal/PopupPanel/MarginContainer/VBoxContainer/PopupHeader/IconBorder/IconTexture
@onready var popup_name: Label = $DetailsModal/PopupPanel/MarginContainer/VBoxContainer/PopupHeader/PopupNameBox/PopupName
@onready var popup_rarity: Label = $DetailsModal/PopupPanel/MarginContainer/VBoxContainer/PopupHeader/PopupNameBox/PopupRarity
@onready var popup_description: Label = $DetailsModal/PopupPanel/MarginContainer/VBoxContainer/PopupDescription
@onready var popup_quantity: Label = $DetailsModal/PopupPanel/MarginContainer/VBoxContainer/PopupQuantity
@onready var use_button: Button = $DetailsModal/PopupPanel/MarginContainer/VBoxContainer/PopupActions/UseButton
@onready var sell_button: Button = $DetailsModal/PopupPanel/MarginContainer/VBoxContainer/PopupActions/SellButton
@onready var popup_close_button: Button = $DetailsModal/PopupPanel/MarginContainer/VBoxContainer/PopupActions/PopupCloseButton

# --- Toast System ---
@onready var toast_notification: PanelContainer = $ToastNotification
@onready var toast_label: Label = $ToastNotification/ToastLabel

# --- Persistent State Config ---
const SAVE_FILE_PATH = "user://crownspire_bag_inventory_v1.save"

# --- Categories ---
const CATEGORY_TABS = [
	"Resources",
	"Speedups",
	"Hero Items",
	"Equipment",
	"Materials",
	"Alliance",
	"Special"
]

# --- State Variables ---
var _item_database: Dictionary = {}  # Dynamic catalog: { "item_id": Dictionary(Item attributes) }
var _inventory: Dictionary = {}      # User counts: { "item_id": int(quantity) }
var _active_tab: String = "Resources"
var _selected_item_id: String = ""
var _toast_timer: Timer

# ==============================================================================
# LIFECYCLE CALLBACKS
# ==============================================================================

func _ready() -> void:
	print("[Bag] Initializing Crownspire Bag system...")
	
	# Create toast auto-dismiss timer
	_toast_timer = Timer.new()
	_toast_timer.one_shot = true
	_toast_timer.wait_time = 2.5
	_toast_timer.timeout.connect(_on_toast_timeout)
	add_child(_toast_timer)
	
	# Load standard items.json resource database
	_load_item_database()
	
	# Load user saved bag data, or default if missing
	_load_inventory_from_disk()
	
	# Configure sort selector choices
	_setup_sort_dropdown()
	
	# Build tab buttons
	_setup_category_tabs()
	
	# Bind event listeners
	search_edit.text_changed.connect(_on_search_changed)
	sort_select.item_selected.connect(_on_sort_selected)
	close_button.pressed.connect(_on_bag_closed)
	
	# Popup interactions
	use_button.pressed.connect(_on_use_pressed)
	sell_button.pressed.connect(_on_sell_pressed)
	popup_close_button.pressed.connect(_on_popup_closed)
	details_modal.gui_input.connect(_on_modal_overlay_input)
	
	# Initial draw
	_refresh_inventory_ui()

# ==============================================================================
# DATABASE & SAVE ENGINE
# ==============================================================================

## Reads the central JSON items configuration
func _load_item_database() -> void:
	var file_path = "res://items.json"
	
	if not FileAccess.file_exists(file_path):
		push_warning("[Bag] Resource items.json not found in root. Generating on-the-fly metadata fallback.")
		return
		
	var file = FileAccess.open(file_path, FileAccess.READ)
	if not file:
		push_error("[Bag] Unable to open items.json. Fallback fallback templates will be loaded.")
		return
		
	var content = file.get_as_text()
	file.close()
	
	var json = JSON.new()
	var error = json.parse(content)
	if error != OK:
		push_error("[Bag] JSON parser error on items.json: %s (Line: %d)" % [json.get_error_message(), json.get_error_line()])
		return
		
	var array_data = json.get_data()
	if typeof(array_data) == TYPE_ARRAY:
		for item_data in array_data:
			if typeof(item_data) == TYPE_DICTIONARY and item_data.has("id"):
				_item_database[item_data["id"]] = item_data
		print("[Bag] Database loaded successfully. Parsed %d static items." % _item_database.size())
	else:
		push_error("[Bag] Invalid schema inside items.json. Root node is not a JSON Array.")

## Restores player bag state from safe local client storage
func _load_inventory_from_disk() -> void:
	if not FileAccess.file_exists(SAVE_FILE_PATH):
		_populate_starter_inventory()
		return
		
	var file = FileAccess.open(SAVE_FILE_PATH, FileAccess.READ)
	if not file:
		_populate_starter_inventory()
		return
		
	var content = file.get_as_text()
	file.close()
	
	var json = JSON.new()
	var error = json.parse(content)
	if error != OK:
		push_error("[Bag] Saved file corrupted. Loading defaults.")
		_populate_starter_inventory()
		return
		
	var data = json.get_data()
	if typeof(data) == TYPE_DICTIONARY:
		_inventory = data
		# Verify items in saved file are mapped in item_database
		for item_id in _inventory.keys():
			if not _item_database.has(item_id):
				_create_dynamic_item_template(item_id)
		print("[Bag] Successfully loaded player profile containing %d unique item stacks." % _inventory.size())
	else:
		_populate_starter_inventory()

## Populates a highly descriptive starting pack of strategy items if first-launch
func _populate_starter_inventory() -> void:
	print("[Bag] Populating first-time Crownspire starter packs.")
	_inventory = {
		"resource_food_100k": 25,
		"resource_wood_100k": 20,
		"resource_stone_50k": 10,
		"resource_iron_25k": 8,
		"resource_diamond_1000": 3,
		"speedup_research_1h": 12,
		"speedup_construction_1h": 15,
		"speedup_training_1h": 8,
		"speedup_universal_5m": 50,
		"eq_weapon_recruit_s_training": 1,
		"eq_helmet_recruit_s_training": 1,
		"crafting_stardust_gem": 15,
		"crafting_obsidian": 8,
		"alliance_teleport_pack": 2,
		"alliance_help_token": 10,
		"hero_xp_potion_large": 5,
		"vip_points_100": 6,
		"buff_defense_24h": 1,
		"statue_hero_shard": 12
	}
	
	# Construct missing templates in case items.json did not define them
	for item_id in _inventory.keys():
		if not _item_database.has(item_id):
			_create_dynamic_item_template(item_id)
			
	_save_inventory_to_disk()

## Dynamically constructs clean definitions to prevent runtime missing exceptions
func _create_dynamic_item_template(item_id: String) -> void:
	var item_name = item_id.replace("_", " ").capitalize()
	var category = "special"
	var subcategory = "misc"
	var rarity = "rare"
	var usable = true
	var sellable = true
	var sell_value = 100
	
	if "food" in item_id or "wood" in item_id or "stone" in item_id or "iron" in item_id or "diamond" in item_id:
		category = "resource"
		if "food" in item_id: subcategory = "food"
		elif "wood" in item_id: subcategory = "wood"
		elif "stone" in item_id: subcategory = "stone"
		elif "iron" in item_id: subcategory = "iron"
		elif "diamond" in item_id: subcategory = "diamond"
		sellable = false
		sell_value = 0
	elif "speedup" in item_id:
		category = "speedup"
	elif "eq_" in item_id:
		category = "equipment"
		sell_value = 500
	elif "crafting" in item_id:
		category = "equipment"
		subcategory = "material"
		sell_value = 250
	elif "alliance" in item_id:
		category = "alliance"
	elif "hero" in item_id or "statue" in item_id:
		category = "hero"
		
	# Determine logical rarity by keywords
	if "100k" in item_id or "50k" in item_id or "1h" in item_id:
		rarity = "rare"
	elif "25k" in item_id or "large" in item_id or "shard" in item_id:
		rarity = "epic"
	elif "diamond" in item_id or "gold" in item_id:
		rarity = "legendary"
	elif "recruit" in item_id or "5m" in item_id:
		rarity = "common"
		
	_item_database[item_id] = {
		"id": item_id,
		"name": item_name,
		"description": "Consumable auxiliary item in the Realm of Crownspire. Grants strategic advantage.",
		"category": category,
		"subcategory": subcategory,
		"rarity": rarity,
		"usable": usable,
		"sellable": sellable,
		"value": sell_value,
		"icon": ""
	}

## Writes active dictionary state out to user configuration
func _save_inventory_to_disk() -> void:
	var file = FileAccess.open(SAVE_FILE_PATH, FileAccess.WRITE)
	if not file:
		push_error("[Bag] Failed to save inventory file to user path.")
		return
		
	var json_string = JSON.stringify(_inventory)
	file.store_string(json_string)
	file.close()

# ==============================================================================
# UI SETUP & EVENT BINDINGS
# ==============================================================================

## Configures sorting choices inside the OptionButton selector
func _setup_sort_dropdown() -> void:
	sort_select.clear()
	sort_select.add_item("Sort: Default", 0)
	sort_select.add_item("Name (A-Z)", 1)
	sort_select.add_item("Quantity (High-Low)", 2)
	sort_select.add_item("Rarity (High-Low)", 3)
	sort_select.selected = 0

## Dynamically generates fully custom styled horizontal category tab buttons
func _setup_category_tabs() -> void:
	for child in tab_box.get_children():
		child.queue_free()
		
	for tab_name in CATEGORY_TABS:
		var tab_button = Button.new()
		tab_button.text = "  " + tab_name + "  "
		tab_button.custom_minimum_size = Vector2(100, 40)
		tab_button.size_flags_vertical = Control.SIZE_SHRINK_CENTER
		tab_button.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		
		# Set focus modes and style properties
		tab_button.focus_mode = Control.FOCUS_NONE
		tab_button.pressed.connect(func(): _on_tab_pressed(tab_name))
		
		tab_box.add_child(tab_button)
		
	_update_tab_button_styles()

## Swaps highlight colors of active versus inactive navigation buttons
func _update_tab_button_styles() -> void:
	var children = tab_box.get_children()
	for i in range(children.size()):
		var btn = children[i] as Button
		if btn:
			var is_active = (CATEGORY_TABS[i] == _active_tab)
			
			# StyleBox Overrides
			var style = _get_tab_active_style() if is_active else _get_tab_inactive_style()
			btn.add_theme_stylebox_override("normal", style)
			btn.add_theme_stylebox_override("hover", style)
			btn.add_theme_stylebox_override("pressed", style)
			btn.add_theme_stylebox_override("focus", style)
			
			# Highlight font colors
			btn.add_theme_color_override("font_color", Color(1, 1, 1, 1) if is_active else Color(0.6, 0.65, 0.7, 1))
			btn.add_theme_color_override("font_hover_color", Color(1, 1, 1, 1))

# ==============================================================================
# FILTER & SORT LOGIC
# ==============================================================================

## Returns list of keys that pass the active search and tab constraints
func _get_filtered_and_sorted_items() -> Array[String]:
	var result_list: Array[String] = []
	var search_text = search_edit.text.strip_edges().to_lower()
	
	for item_id in _inventory.keys():
		var qty = _inventory[item_id]
		if qty <= 0:
			continue
			
		var item = _item_database.get(item_id)
		if not item:
			continue
			
		# 1. Filter Category Tab Mapping
		var matches_tab = false
		var cat = item.get("category", "").to_lower()
		var subcat = item.get("subcategory", "").to_lower()
		
		match _active_tab:
			"Resources":
				matches_tab = (cat == "resource" or cat == "vip")
			"Speedups":
				matches_tab = (cat == "speedup" or cat == "teleport")
			"Hero Items":
				matches_tab = (cat == "hero" or cat == "statue")
			"Equipment":
				matches_tab = (cat == "equipment" and subcat != "material")
			"Materials":
				matches_tab = (subcat == "material" or subcat == "enhancement" or subcat == "refinement" or cat == "materials" or cat == "material")
			"Alliance":
				matches_tab = (cat == "alliance")
			"Special":
				# Fits in special if not matched anywhere else
				var matches_other = (
					(cat == "resource" or cat == "vip") or
					(cat == "speedup" or cat == "teleport") or
					(cat == "hero" or cat == "statue") or
					(cat == "equipment" and subcat != "material") or
					(subcat == "material" or subcat == "enhancement" or subcat == "refinement" or cat == "materials" or cat == "material") or
					(cat == "alliance")
				)
				matches_tab = not matches_other
				
		if not matches_tab:
			continue
			
		# 2. Filter Search Queries
		if search_text != "":
			var name_match = search_text in item.get("name", "").to_lower()
			var desc_match = search_text in item.get("description", "").to_lower()
			if not name_match and not desc_match:
				continue
				
		result_list.append(item_id)
		
	# 3. Handle Sorting Modes
	var sort_idx = sort_select.selected
	match sort_idx:
		1: # Alphabetical
			result_list.sort_custom(func(a, b):
				return _item_database[a]["name"].to_lower() < _item_database[b]["name"].to_lower()
			)
		2: # Quantity descending
			result_list.sort_custom(func(a, b):
				return _inventory[a] > _inventory[b]
			)
		3: # Rarity descending
			result_list.sort_custom(func(a, b):
				var r_a = _get_rarity_weight(_item_database[a].get("rarity", ""))
				var r_b = _get_rarity_weight(_item_database[b].get("rarity", ""))
				if r_a != r_b:
					return r_a > r_b
				return _item_database[a]["name"].to_lower() < _item_database[b]["name"].to_lower()
			)
		_: # Default / ID Order
			result_list.sort()
			
	return result_list

## Custom weight indicator for tier hierarchy
func _get_rarity_weight(rarity_str: String) -> int:
	var rarity = rarity_str.to_lower()
	match rarity:
		"mythic": return 5
		"legendary": return 4
		"epic": return 3
		"rare": return 2
		"uncommon": return 1
		_: return 0

# ==============================================================================
# UI RENDERING FACTORY
# ==============================================================================

## Rebuilds the grid based on active search states, sort settings, and tabs
func _refresh_inventory_ui() -> void:
	# Clear out current grid
	for child in item_grid.get_children():
		child.queue_free()
		
	var filtered_keys = _get_filtered_and_sorted_items()
	
	if filtered_keys.is_empty():
		_display_empty_state_label()
		return
		
	for item_id in filtered_keys:
		var quantity = _inventory[item_id]
		var item_data = _item_database[item_id]
		
		# Build a beautiful, customized, responsive card layout
		var card = PanelContainer.new()
		card.custom_minimum_size = Vector2(105, 125)
		card.size_flags_horizontal = Control.SIZE_SHRINK_CENTER
		card.size_flags_vertical = Control.SIZE_SHRINK_CENTER
		card.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		card.add_theme_stylebox_override("panel", _get_card_style())
		
		# Connect click signals using gui_input
		card.gui_input.connect(func(event: InputEvent):
			if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
				_on_card_clicked(item_id)
		)
		
		# Nest margins
		var margin = MarginContainer.new()
		margin.add_theme_constant_override("margin_left", 6)
		margin.add_theme_constant_override("margin_top", 6)
		margin.add_theme_constant_override("margin_right", 6)
		margin.add_theme_constant_override("margin_bottom", 6)
		card.add_child(margin)
		
		var vbox = VBoxContainer.new()
		vbox.add_theme_constant_override("separation", 4)
		margin.add_child(vbox)
		
		# Icon frame with colored rarity border
		var icon_slot = PanelContainer.new()
		icon_slot.custom_minimum_size = Vector2(80, 80)
		icon_slot.size_flags_horizontal = Control.SIZE_SHRINK_CENTER
		icon_slot.add_theme_stylebox_override("panel", _get_rarity_style(item_data.get("rarity", "common")))
		vbox.add_child(icon_slot)
		
		# Icon image
		var icon_tex = TextureRect.new()
		icon_tex.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		icon_tex.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		icon_slot.add_child(icon_tex)
		
		var icon_loaded = false
		var icon_path = item_data.get("icon", "")
		if icon_path != "" and ResourceLoader.exists(icon_path):
			var tex = load(icon_path)
			if tex:
				icon_tex.texture = tex
				icon_loaded = true
				
		if not icon_loaded:
			# If no graphics found, draw a beautiful fallback emoji representation
			var emoji_label = Label.new()
			emoji_label.text = _get_item_emoji(item_data)
			emoji_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
			emoji_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
			emoji_label.add_theme_font_size_override("font_size", 32)
			icon_slot.add_child(emoji_label)
			
		# Quantity label overlays the slot bottom-right
		var qty_margin = MarginContainer.new()
		qty_margin.set_anchors_preset(Control.PRESET_FULL_RECT)
		icon_slot.add_child(qty_margin)
		
		var qty_label = Label.new()
		qty_label.text = str(quantity)
		qty_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
		qty_label.vertical_alignment = VERTICAL_ALIGNMENT_BOTTOM
		qty_label.add_theme_font_size_override("font_size", 12)
		qty_label.add_theme_color_override("font_outline_color", Color(0, 0, 0, 1))
		qty_label.add_theme_constant_override("outline_size", 4)
		qty_margin.add_child(qty_label)
		
		# Compact wrap-around label for Item Name
		var name_lbl = Label.new()
		name_lbl.text = item_data.get("name", "Unknown Item")
		name_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		name_lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		name_lbl.add_theme_font_size_override("font_size", 10)
		name_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		name_lbl.clip_text = true
		name_lbl.custom_minimum_size = Vector2(80, 26)
		vbox.add_child(name_lbl)
		
		item_grid.add_child(card)

## Spawns a clean placeholder when search or tab results are empty
func _display_empty_state_label() -> void:
	var empty_box = CenterContainer.new()
	empty_box.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	empty_box.size_flags_vertical = Control.SIZE_EXPAND_FILL
	item_grid.add_child(empty_box)
	
	var label = Label.new()
	label.text = "No items found in this section."
	label.add_theme_color_override("font_color", Color(0.5, 0.55, 0.6, 1))
	label.add_theme_font_size_override("font_size", 16)
	empty_box.add_child(label)

# ==============================================================================
# TOAST FEEDBACK NOTIFICATIONS
# ==============================================================================

## Pops up a visual micro-notification that auto-dismisses smoothly
func _show_toast(message: String) -> void:
	toast_label.text = message
	toast_notification.visible = true
	toast_notification.modulate = Color(1, 1, 1, 0)
	
	# Small procedural fade-in animation
	var tween = create_tween()
	tween.tween_property(toast_notification, "modulate:a", 1.0, 0.25)
	
	# Reset dismiss timer
	_toast_timer.start()

func _on_toast_timeout() -> void:
	var tween = create_tween()
	tween.tween_property(toast_notification, "modulate:a", 0.0, 0.3)
	tween.finished.connect(func(): toast_notification.visible = false)

# ==============================================================================
# MODAL DETAIL SYSTEM
# ==============================================================================

## Opens the details view for the selected item
func _on_card_clicked(item_id: String) -> void:
	_selected_item_id = item_id
	var quantity = _inventory.get(item_id, 0)
	var item = _item_database.get(item_id)
	
	if not item:
		return
		
	# Update dialog details
	popup_name.text = item.get("name", "Unknown Item")
	popup_rarity.text = "Rarity: " + item.get("rarity", "common").capitalize()
	popup_description.text = item.get("description", "A special inventory item.")
	popup_quantity.text = "Quantity Owned: " + str(quantity)
	
	# Dynamic Text colors for Rarity Status
	var r_color = _get_rarity_color(item.get("rarity", "common"))
	popup_rarity.add_theme_color_override("font_color", r_color)
	
	# Rarity border of the popup icon
	popup_icon_border.add_theme_stylebox_override("panel", _get_rarity_style(item.get("rarity", "common")))
	
	# Load image or display emoji fallback inside detail popup
	var icon_loaded = false
	var icon_path = item.get("icon", "")
	if icon_path != "" and ResourceLoader.exists(icon_path):
		var tex = load(icon_path)
		if tex:
			popup_icon_texture.texture = tex
			popup_icon_texture.visible = true
			icon_loaded = true
			
	if not icon_loaded:
		popup_icon_texture.visible = false
		# Check if fallback emoji already exists, remove previous if so
		for child in popup_icon_border.get_children():
			if child != popup_icon_texture:
				child.queue_free()
				
		var emoji_label = Label.new()
		emoji_label.text = _get_item_emoji(item)
		emoji_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		emoji_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		emoji_label.add_theme_font_size_override("font_size", 28)
		popup_icon_border.add_child(emoji_label)
	else:
		# Remove fallbacks if native graphic loaded
		for child in popup_icon_border.get_children():
			if child != popup_icon_texture:
				child.queue_free()
				
	# Enable/Disable Use & Sell based on item schema
	use_button.visible = item.get("usable", true)
	sell_button.visible = item.get("sellable", false)
	
	# Display popup modal with micro-zoom entrance
	details_modal.visible = true
	var p_panel = details_modal.get_node("PopupPanel") as Control
	p_panel.scale = Vector2(0.9, 0.9)
	p_panel.pivot_offset = p_panel.size / 2.0
	var tween = create_tween().set_ease(Tween.EASE_OUT).set_trans(Tween.TRANS_BACK)
	tween.tween_property(p_panel, "scale", Vector2(1.0, 1.0), 0.18)

## Deducts item count and triggers logical simulation rewards or actions
func _on_use_pressed() -> void:
	if _selected_item_id == "":
		return
		
	var quantity = _inventory.get(_selected_item_id, 0)
	if quantity <= 0:
		_on_popup_closed()
		return
		
	var item = _item_database[_selected_item_id]
	
	# Apply item consume logic
	_inventory[_selected_item_id] = quantity - 1
	_save_inventory_to_disk()
	
	# Show clean feedback based on consumed rewards
	var mmo_result = "Consumed 1x %s!" % item.get("name", "Item")
	var subcat = item.get("subcategory", "").to_lower()
	if subcat == "food":
		mmo_result += " Recieved +100,000 Food."
	elif subcat == "wood":
		mmo_result += " Recieved +100,000 Wood."
	elif subcat == "stone":
		mmo_result += " Recieved +50,000 Stone."
	elif subcat == "iron":
		mmo_result += " Recieved +25,000 Deep Iron."
	elif subcat == "diamond":
		mmo_result += " Gained +1,000 Diamonds!"
	elif item.get("category", "").to_lower() == "teleport":
		mmo_result += " Activated! Return to the WORLD MAP and click your CITADEL (or any empty sector) to choose your target!"
		
	_show_toast(mmo_result)
	
	# Re-render UI
	_refresh_inventory_ui()
	
	# Keep details updated or close if spent
	if _inventory[_selected_item_id] <= 0:
		_inventory.erase(_selected_item_id)
		_save_inventory_to_disk()
		_on_popup_closed()
	else:
		popup_quantity.text = "Quantity Owned: " + str(_inventory[_selected_item_id])

## Sells item for standard strategy base currencies
func _on_sell_pressed() -> void:
	if _selected_item_id == "":
		return
		
	var quantity = _inventory.get(_selected_item_id, 0)
	if quantity <= 0:
		_on_popup_closed()
		return
		
	var item = _item_database[_selected_item_id]
	var value = item.get("value", 50)
	
	_inventory[_selected_item_id] = quantity - 1
	_save_inventory_to_disk()
	
	_show_toast("Sold 1x %s. Recieved +%d Gold Coins." % [item.get("name", "Item"), value])
	
	_refresh_inventory_ui()
	
	if _inventory[_selected_item_id] <= 0:
		_inventory.erase(_selected_item_id)
		_save_inventory_to_disk()
		_on_popup_closed()
	else:
		popup_quantity.text = "Quantity Owned: " + str(_inventory[_selected_item_id])

func _on_popup_closed() -> void:
	_selected_item_id = ""
	var p_panel = details_modal.get_node("PopupPanel") as Control
	var tween = create_tween()
	tween.tween_property(p_panel, "scale", Vector2(0.85, 0.85), 0.12)
	tween.finished.connect(func(): details_modal.visible = false)

func _on_modal_overlay_input(event: InputEvent) -> void:
	# Click outside the box dismisses the modal
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
		var p_panel = details_modal.get_node("PopupPanel") as PanelContainer
		if not p_panel.get_global_rect().has_point(event.global_position):
			_on_popup_closed()

# ==============================================================================
# STYLE & COMPONENT FALLBACK BUILDERS
# ==============================================================================

func _get_card_style() -> StyleBoxFlat:
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.117, 0.141, 0.180, 1) # #1e242e
	style.border_width_left = 1
	style.border_width_top = 1
	style.border_width_right = 1
	style.border_width_bottom = 1
	style.border_color = Color(0.176, 0.220, 0.286, 1) # #2d3849
	style.corner_radius_top_left = 8
	style.corner_radius_top_right = 8
	style.corner_radius_bottom_right = 8
	style.corner_radius_bottom_left = 8
	return style

func _get_tab_active_style() -> StyleBoxFlat:
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.192, 0.478, 0.820, 1) # Blue
	style.corner_radius_top_left = 6
	style.corner_radius_top_right = 6
	style.expand_margin_bottom = 2.0
	return style

func _get_tab_inactive_style() -> StyleBoxFlat:
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.117, 0.141, 0.180, 1)
	style.border_width_left = 1
	style.border_width_top = 1
	style.border_width_right = 1
	style.border_color = Color(0.176, 0.220, 0.286, 1)
	style.corner_radius_top_left = 6
	style.corner_radius_top_right = 6
	return style

func _get_rarity_style(rarity_str: String) -> StyleBoxFlat:
	var r_color = _get_rarity_color(rarity_str)
	var style = StyleBoxFlat.new()
	style.draw_center = false
	style.border_width_left = 2
	style.border_width_top = 2
	style.border_width_right = 2
	style.border_width_bottom = 2
	style.border_color = r_color
	style.corner_radius_top_left = 6
	style.corner_radius_top_right = 6
	style.corner_radius_bottom_right = 6
	style.corner_radius_bottom_left = 6
	return style

func _get_rarity_color(rarity_str: String) -> Color:
	var rarity = rarity_str.to_lower()
	match rarity:
		"uncommon":
			return Color(0.247, 0.705, 0.352, 1) # Green
		"rare":
			return Color(0.192, 0.478, 0.820, 1) # Blue
		"epic":
			return Color(0.584, 0.176, 0.843, 1) # Purple
		"legendary":
			return Color(0.901, 0.470, 0.078, 1) # Orange
		"mythic":
			return Color(0.901, 0.078, 0.117, 1) # Red
		_:
			return Color(0.607, 0.670, 0.737, 1) # Gray Common

## Maps items to a descriptive high-end graphical unicode emoji
func _get_item_emoji(item: Dictionary) -> String:
	var cat = item.get("category", "").to_lower()
	var subcat = item.get("subcategory", "").to_lower()
	var item_id = item.get("id", "").to_lower()
	
	if "food" in item_id or subcat == "food":
		return "🍖"
	elif "wood" in item_id or subcat == "wood":
		return "🪵"
	elif "stone" in item_id or subcat == "stone":
		return "🧱"
	elif "iron" in item_id or subcat == "iron":
		return "🪙"
	elif "diamond" in item_id or subcat == "diamond":
		return "💎"
	elif "speedup" in cat or "speedup" in item_id:
		return "⏱️"
	elif "equipment" in cat or "shield" in item_id or "weapon" in item_id:
		return "🛡️"
	elif "hero" in cat or "hero" in item_id:
		return "🎖️"
	elif "alliance" in cat or "alliance" in item_id:
		return "🤝"
	elif "material" in cat or "material" in subcat:
		return "🧪"
	else:
		return "📦"

# ==============================================================================
# COMPONENT HANDLERS
# ==============================================================================

func _on_tab_pressed(tab_name: String) -> void:
	if _active_tab == tab_name:
		return
	_active_tab = tab_name
	_update_tab_button_styles()
	_refresh_inventory_ui()

func _on_search_changed(_new_text: String) -> void:
	_refresh_inventory_ui()

func _on_sort_selected(_idx: int) -> void:
	_refresh_inventory_ui()

func _on_bag_closed() -> void:
	print("[Bag] Closing Bag scene...")
	# Standard Godot closing/hiding routine
	visible = false
