extends Control

# ==========================================
# CROWNSPIRE GAME HUD MASTER CONTROLLER
# ==========================================
# Orchestrates top status bars (economies, power ratings, profile avatars)
# and bottom dynamic navigation decks with safe modular triggers.

signal map_mode_changed(new_mode: String) # "city" or "world"

# Top Bar Labels
@onready var player_name_lbl: Label = get_node_or_null("%PlayerNameLabel")
@onready var power_lbl: Label = get_node_or_null("%PowerValueLabel")
@onready var vip_lbl: Label = get_node_or_null("%VipValueLabel")

@onready var food_lbl: Label = get_node_or_null("%FoodLabel")
@onready var wood_lbl: Label = get_node_or_null("%WoodLabel")
@onready var stone_lbl: Label = get_node_or_null("%StoneLabel")
@onready var iron_lbl: Label = get_node_or_null("%IronLabel")

@onready var gold_lbl: Label = get_node_or_null("%GoldLabel")
@onready var royal_crystals_lbl: Label = get_node_or_null("%RoyalCrystalsLabel")
@onready var aurora_crystals_lbl: Label = get_node_or_null("%AuroraCrystalsLabel")

@onready var profile_btn: Button = get_node_or_null("%ProfileButton")

# Bottom Navigation & Map Toggle
@onready var nav_container: HBoxContainer = get_node_or_null("%NavigationContainer")
@onready var map_toggle_btn: Button = get_node_or_null("%MapToggleButton")

# Preloaded scenes
@export var nav_btn_scene: PackedScene = preload("res://hud/scenes/NavigationButton.tscn")

var navigation_buttons: Array = []
var notifications: Dictionary = {}
var current_map_mode: String = "city" # "city" or "world"

func _ready() -> void:
	# Bind interactive actions
	if map_toggle_btn:
		map_toggle_btn.pressed.connect(_on_map_toggle_pressed)
		_update_map_toggle_ui()
		
	if profile_btn:
		profile_btn.pressed.connect(_on_profile_clicked)

	# Connect global economy signals if UIManager is present
	var ui_mgr = get_node_or_null("/root/UIManager")
	if ui_mgr:
		if ui_mgr.has_signal("currency_changed"):
			ui_mgr.currency_changed.connect(_on_global_currency_changed)
			
	# Load layouts and datasets
	_load_hud_data()
	
	# Initial UI Draw
	update_hud_display()
	_populate_navigation_bar()

func _load_hud_data() -> void:
	navigation_buttons = _load_json_array("res://hud/data/navigation_buttons.json")
	notifications = _load_json_dict("res://hud/data/notification_states.json")

	# Fallbacks
	if navigation_buttons.is_empty():
		navigation_buttons = [
			{"id": "heroes", "name": "HEROES", "icon": "🧙", "scene_path": "res://heroes/scenes/HeroPopup.tscn"},
			{"id": "bag", "name": "BAG", "icon": "🎒", "scene_path": "res://Bag.tscn"},
			{"id": "quests", "name": "QUESTS", "icon": "📜", "scene_path": "res://quests/scenes/QuestPopup.tscn"},
			{"id": "alliance", "name": "ALLIANCE", "icon": "🏰", "scene_path": "res://alliance/scenes/AlliancePopup.tscn"},
			{"id": "store", "name": "STORE", "icon": "💎", "scene_path": "res://store/scenes/StorePopup.tscn"},
			{"id": "mail", "name": "MAIL", "icon": "✉️", "scene_path": "res://mail/scenes/MailPopup.tscn"},
			{"id": "settings", "name": "SETTINGS", "icon": "⚙️", "scene_path": "res://settings/scenes/SettingsPopup.tscn"}
		]
	if notifications.is_empty():
		notifications = {
			"heroes": 0, "bag": 1, "quests": 3, "alliance": 2, "store": 0, "mail": 5, "settings": 0
		}

func _load_json_array(path: String) -> Array:
	if not FileAccess.file_exists(path):
		return []
	var file = FileAccess.open(path, FileAccess.READ)
	var content = file.get_as_text()
	file.close()
	var json = JSON.new()
	if json.parse(content) == OK:
		if typeof(json.data) == TYPE_ARRAY:
			return json.data
	return []

func _load_json_dict(path: String) -> Dictionary:
	if not FileAccess.file_exists(path):
		return {}
	var file = FileAccess.open(path, FileAccess.READ)
	var content = file.get_as_text()
	file.close()
	var json = JSON.new()
	if json.parse(content) == OK:
		if typeof(json.data) == TYPE_DICTIONARY:
			return json.data
	return {}

func update_hud_display() -> void:
	var ui_mgr = get_node_or_null("/root/UIManager")
	
	if ui_mgr:
		# Sync values from global model
		_set_label_text(player_name_lbl, ui_mgr.player_name)
		_set_label_text(power_lbl, "PWR " + _format_number(ui_mgr.power))
		_set_label_text(vip_lbl, "VIP %d" % ui_mgr.vip_level)
		
		_set_label_text(food_lbl, _format_number(ui_mgr.food))
		_set_label_text(wood_lbl, _format_number(ui_mgr.wood))
		_set_label_text(stone_lbl, _format_number(ui_mgr.stone))
		_set_label_text(iron_lbl, _format_number(ui_mgr.iron))
		
		_set_label_text(gold_lbl, _format_number(ui_mgr.gold))
		_set_label_text(royal_crystals_lbl, _format_number(ui_mgr.royal_crystals))
		_set_label_text(aurora_crystals_lbl, _format_number(ui_mgr.aurora_crystals))
	else:
		# Standalone fallbacks
		_set_label_text(player_name_lbl, "Lord Aurelius")
		_set_label_text(power_lbl, "PWR 1.25M")
		_set_label_text(vip_lbl, "VIP 4")
		
		_set_label_text(food_lbl, "500K")
		_set_label_text(wood_lbl, "450K")
		_set_label_text(stone_lbl, "250K")
		_set_label_text(iron_lbl, "120K")
		
		_set_label_text(gold_lbl, "100K")
		_set_label_text(royal_crystals_lbl, "5.0K")
		_set_label_text(aurora_crystals_lbl, "2.5K")

func _populate_navigation_bar() -> void:
	if not nav_container:
		return
		
	# Clear old children
	for child in nav_container.get_children():
		child.queue_free()
		
	for btn_data in navigation_buttons:
		if not nav_btn_scene:
			continue
			
		var id = btn_data.get("id", "")
		var btn_name = btn_data.get("name", "MENU")
		var icon = btn_data.get("icon", "⚔️")
		var path = btn_data.get("scene_path", "")
		var badge_val = int(notifications.get(id, 0))
		
		var btn = nav_btn_scene.instantiate()
		nav_container.add_child(btn)
		
		if btn.has_method("init_button"):
			btn.init_button(id, btn_name, icon, path, badge_val)
			
		if btn.has_signal("navigation_pressed"):
			btn.navigation_pressed.connect(_on_navigation_pressed)

func _on_navigation_pressed(button_id: String, scene_path: String) -> void:
	# Clear notification count locally on press
	if notifications.has(button_id):
		notifications[button_id] = 0
		_update_button_badge_visually(button_id, 0)
		
	# Process popup launch
	_open_scene_safely(scene_path)

func _update_button_badge_visually(button_id: String, count: int) -> void:
	if not nav_container:
		return
	for child in nav_container.get_children():
		if child.get("button_id") == button_id:
			if child.has_method("update_badge"):
				child.update_badge(count)
			break

func _open_scene_safely(scene_path: String) -> void:
	# First check file existence compile-safely
	if not ResourceLoader.exists(scene_path):
		_show_toast("Scene resource not compiled: " + scene_path.get_file())
		return
		
	var scene = load(scene_path)
	if not scene:
		_show_toast("Failed to instantiate scene!")
		return
		
	var ui_mgr = get_node_or_null("/root/UIManager")
	if ui_mgr and ui_mgr.has_method("open_popup"):
		ui_mgr.open_popup(scene)
	else:
		# Manual standalone tree overlay
		var inst = scene.instantiate()
		get_tree().current_scene.add_child(inst)
		_show_toast("Loaded " + inst.name + " Overlay")

func _on_global_currency_changed(currency_id: String, _new_amount: float) -> void:
	# Re-query all economies from source of truth
	update_hud_display()

func _on_map_toggle_pressed() -> void:
	if current_map_mode == "city":
		current_map_mode = "world"
	else:
		current_map_mode = "city"
		
	_update_map_toggle_ui()
	map_mode_changed.emit(current_map_mode)
	
	_show_toast("Switched view to %s map" % current_map_mode.to_upper())

func _update_map_toggle_ui() -> void:
	if map_toggle_btn:
		if current_map_mode == "city":
			map_toggle_btn.text = "⚔️ WORLD MAP"
			map_toggle_btn.modulate = Color(1.0, 0.4, 0.4) # Warm reddish aggressive world map
		else:
			map_toggle_btn.text = "🏰 MY CITY"
			map_toggle_btn.modulate = Color(0.3, 0.85, 1.0) # Serene teal city view

func _on_profile_clicked() -> void:
	_open_scene_safely("res://settings/scenes/SettingsPopup.tscn")

func _set_label_text(lbl: Label, text: String) -> void:
	if lbl:
		lbl.text = text

func _format_number(val: int) -> String:
	if val >= 1000000:
		return "%.1fM" % (val / 1000000.0)
	elif val >= 1000:
		return "%.0fK" % (val / 1000.0)
	return str(val)

func _show_toast(msg: String) -> void:
	var ui_mgr = get_node_or_null("/root/UIManager")
	if ui_mgr and ui_mgr.has_method("show_toast"):
		ui_mgr.show_toast(msg)
	else:
		# Standalone console logger fallback
		print("[HUD Message]: " + msg)
