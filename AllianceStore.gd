# ==============================================================================
# Crownspire MMO Strategy Game - Alliance Store Controller
# Godot 4 / GDScript 2.0 Client-side guild shop and credit exchange
# ==============================================================================

extends Control

# --- Signals ---
signal store_purchase_completed
signal add_log_requested(text, type)

# --- Onready Nodes ---
@onready var shop_grid: GridContainer = $Layout/Scroll/Grid
@onready var honor_pts_lbl: Label = $Layout/Header/HonorPointsLabel

# --- Persistent State Config ---
const BAG_SAVE_PATH = "user://crownspire_bag_inventory_v1.save"

# --- Internal references ---
var _alliance_scene: Control
var _state: Dictionary = {}

# --- Static Store Catalogue ---
var _shop_items: Array = [
	{
		"id": "alliance_teleport_pack",
		"name": "Alliance Teleport Pack",
		"desc": "Instantly relocate your City adjacent to your Alliance Fortress coordinates.",
		"cost": 1000,
		"bag_key": "alliance_teleport_pack",
		"emoji": "🌀"
	},
	{
		"id": "buff_defense_24h",
		"name": "Sovereign Peace Shield (24h)",
		"desc": "Furls an impenetrable magical canopy over your Keep, blocking all hostile scouting and marches.",
		"cost": 800,
		"bag_key": "buff_defense_24h",
		"emoji": "🛡️"
	},
	{
		"id": "speedup_construction_1h",
		"name": "Construction Speedup (1h)",
		"desc": "Decreases active castle, watchtower, or wall building timers by 1 hour.",
		"cost": 250,
		"bag_key": "speedup_construction_1h",
		"emoji": "🔨"
	},
	{
		"id": "speedup_research_1h",
		"name": "Research Speedup (1h)",
		"desc": "Decreases active academy research or troop tactical scroll decryptions by 1 hour.",
		"cost": 250,
		"bag_key": "speedup_research_1h",
		"emoji": "🧪"
	},
	{
		"id": "statue_hero_shard",
		"name": "Hero Statue Shard",
		"desc": "An epic golden fragment used to recruit or rank up elite Valkyrie champions.",
		"cost": 750,
		"bag_key": "statue_hero_shard",
		"emoji": "🎖️"
	},
	{
		"id": "vip_points_100",
		"name": "VIP Points (100)",
		"desc": "Adds 100 premium prestige score points to unlock faster extraction buffs.",
		"cost": 150,
		"bag_key": "vip_points_100",
		"emoji": "👑"
	}
]

func _ready() -> void:
	var parent = get_parent()
	while parent and not parent.has_method("_save_alliance_state"):
		parent = parent.get_parent()
	if parent:
		_alliance_scene = parent
	refresh_panel()

func refresh_panel() -> void:
	# Pull Honor Points directly from central UIManager
	_state["player_honor_points"] = UIManager.player_honor_points
	_refresh_store_ui()

func init_view(state: Dictionary) -> void:
	_state = state
	_refresh_store_ui()

func _refresh_store_ui() -> void:
	var honor_points = _state.get("player_honor_points", 0)
	honor_pts_lbl.text = "Personal Honor Points: 🏅 %d" % honor_points
	
	_clear_container(shop_grid)
	
	for item in _shop_items:
		var card = _create_store_item_card(item)
		shop_grid.add_child(card)

func _create_store_item_card(item: Dictionary) -> PanelContainer:
	var card = PanelContainer.new()
	card.custom_minimum_size = Vector2(200, 160)
	card.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.098, 0.117, 0.149, 1)
	style.border_width_left = 1
	style.border_width_top = 1
	style.border_width_right = 1
	style.border_width_bottom = 1
	style.border_color = Color(0.18, 0.22, 0.28, 1)
	style.corner_radius_top_left = 6
	style.corner_radius_top_right = 6
	style.corner_radius_bottom_right = 6
	style.corner_radius_bottom_left = 6
	card.add_theme_stylebox_override("panel", style)
	
	var margin = MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 12)
	margin.add_theme_constant_override("margin_top", 10)
	margin.add_theme_constant_override("margin_right", 12)
	margin.add_theme_constant_override("margin_bottom", 10)
	card.add_child(margin)
	
	var vbox = VBoxContainer.new()
	vbox.add_theme_constant_override("separation", 6)
	margin.add_child(vbox)
	
	# Icon & Name HBox
	var header_hbox = HBoxContainer.new()
	header_hbox.add_theme_constant_override("separation", 8)
	vbox.add_child(header_hbox)
	
	var emoji_lbl = Label.new()
	emoji_lbl.text = item.get("emoji", "🎁")
	emoji_lbl.add_theme_font_size_override("font_size", 24)
	header_hbox.add_child(emoji_lbl)
	
	var title_lbl = Label.new()
	title_lbl.text = item.get("name")
	title_lbl.add_theme_color_override("font_color", Color(1, 1, 1, 1))
	title_lbl.add_theme_font_size_override("font_size", 13)
	title_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	title_lbl.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	header_hbox.add_child(title_lbl)
	
	# Description
	var desc_lbl = Label.new()
	desc_lbl.text = item.get("desc")
	desc_lbl.add_theme_color_override("font_color", Color(0.5, 0.55, 0.6, 1))
	desc_lbl.add_theme_font_size_override("font_size", 11)
	desc_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	desc_lbl.size_flags_vertical = Control.SIZE_EXPAND_FILL
	vbox.add_child(desc_lbl)
	
	# Cost & Buy Button
	var footer_hbox = HBoxContainer.new()
	vbox.add_child(footer_hbox)
	
	var cost_lbl = Label.new()
	cost_lbl.text = "🏅 %d" % item.get("cost")
	cost_lbl.add_theme_color_override("font_color", Color(0.95, 0.75, 0.15, 1))
	cost_lbl.add_theme_font_size_override("font_size", 13)
	cost_lbl.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	footer_hbox.add_child(cost_lbl)
	
	var buy_btn = Button.new()
	buy_btn.text = "Exchange"
	buy_btn.custom_minimum_size = Vector2(90, 30)
	buy_btn.pressed.connect(func(): _on_purchase_pressed(item))
	footer_hbox.add_child(buy_btn)
	
	return card

# ==============================================================================
# INTERACTIONS
# ==============================================================================

func _on_purchase_pressed(item: Dictionary) -> void:
	if UIManager.store_manager:
		var success = UIManager.store_manager.execute_purchase(item)
		if success:
			# Refresh and notify
			_state["player_honor_points"] = UIManager.player_honor_points
			_refresh_store_ui()
			UIManager.show_success("Exchange successful! Purchased [%s] for %d Honor. Item sent to bag." % [item.get("name"), item.get("cost", 0)])
	else:
		var honor_points = UIManager.player_honor_points
		var cost = item.get("cost", 9999)
		
		if honor_points < cost:
			UIManager.show_error("Insufficient personal Honor Points! Donate to technologies to earn honor.")
			return
			
		# Deduct cost
		UIManager.player_honor_points = honor_points - cost
		_state["player_honor_points"] = UIManager.player_honor_points
		
		# Credit to player inventory bag
		var inventory = _load_inventory()
		var bag_key = item.get("bag_key")
		inventory[bag_key] = inventory.get(bag_key, 0) + 1
		_save_inventory(inventory)
		
		# Save alliance state
		UIManager._save_alliance_databases()
		
		# Refresh and notify
		_refresh_store_ui()
		UIManager.show_success("Exchange successful! Purchased [%s] for %d Honor. Item sent to bag." % [item.get("name"), cost])

# ==============================================================================
# PERSISTENCE HELPERS
# ==============================================================================

func _load_inventory() -> Dictionary:
	if not FileAccess.file_exists(BAG_SAVE_PATH):
		return {}
	var file = FileAccess.open(BAG_SAVE_PATH, FileAccess.READ)
	if not file:
		return {}
	var content = file.get_as_text()
	file.close()
	var json = JSON.new()
	if json.parse(content) == OK:
		var data = json.get_data()
		if typeof(data) == TYPE_DICTIONARY:
			return data
	return {}

func _save_inventory(inv: Dictionary) -> void:
	var file = FileAccess.open(BAG_SAVE_PATH, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(inv))
		file.close()

func _clear_container(container: Node) -> void:
	for child in container.get_children():
		child.queue_free()

func _save_and_sync() -> void:
	if _alliance_scene and _alliance_scene.has_method("_save_alliance_state"):
		_alliance_scene._save_alliance_state()
	store_purchase_completed.emit()
