extends Control

# ==========================================
# CROWNSPIRE SETTINGS POPUP MASTER CONTROLLER
# ==========================================
# Acts as the principal module coordinator. Houses localized profile dashboards,
# custom options builders, code redeemer prompts, and user settings savers.

@onready var title_lbl: Label = get_node_or_null("%SettingsPopupTitleLabel")
@onready var close_btn: Button = get_node_or_null("%SettingsPopupCloseButton")

# Tabs
@onready var profile_tab_btn: Button = get_node_or_null("%ProfileTabButton")
@onready var options_tab_btn: Button = get_node_or_null("%OptionsTabButton")

# Content Areas
@onready var profile_panel: Control = get_node_or_null("%PlayerProfilePanel")
@onready var settings_scroll: ScrollContainer = get_node_or_null("%SettingsScrollContainer")
@onready var options_container: VBoxContainer = get_node_or_null("%OptionsVBoxContainer")
@onready var empty_lbl: Label = get_node_or_null("%SettingsEmptyStateLabel")

# Preloaded dynamic nodes
@export var option_row_scene: PackedScene = preload("res://settings/scenes/SettingsOptionRow.tscn")

# Datastores
var profile_data: Dictionary = {}
var settings_data: Dictionary = {}
var languages_db: Array = []

var active_tab: String = "profile"

func _ready() -> void:
	if close_btn:
		close_btn.pressed.connect(_on_close_pressed)
		
	if profile_tab_btn:
		profile_tab_btn.pressed.connect(func(): select_tab("profile"))
	if options_tab_btn:
		options_tab_btn.pressed.connect(func(): select_tab("options"))
		
	# Load all configurations
	_load_databases()
	
	# Display default view
	select_tab("profile")

func _load_databases() -> void:
	# Load profile JSON
	profile_data = _load_json_dict("res://settings/data/player_profile.json")
	if profile_data.is_empty():
		profile_data = {
			"player_id": "CS-984210",
			"name": "Lord Aurelius",
			"power": 1254300,
			"vip_level": 4,
			"alliance_name": "Dawn Alliance",
			"alliance_tag": "DAWN",
			"avatar_emoji": "🧙",
			"castle_skin": "Default Citadel"
		}
		
	# Load settings defaults JSON
	settings_data = _load_json_dict("res://settings/data/settings_defaults.json")
	if settings_data.is_empty():
		settings_data = {
			"audio": { "music_enabled": true, "sfx_enabled": true, "master_volume": 80.0 },
			"graphics": { "quality": "High" },
			"notifications": { "push_enabled": true },
			"language": { "current": "en" }
		}
		
	# Load supported languages
	languages_db = _load_json_array("res://settings/data/supported_languages.json")
	if languages_db.is_empty():
		languages_db = [
			{"code": "en", "name": "English", "flag": "🇺🇸"},
			{"code": "es", "name": "Español", "flag": "🇪🇸"}
		]

func _load_json_dict(path: String) -> Dictionary:
	if not FileAccess.file_exists(path):
		print("JSON file missing: ", path)
		return {}
	var file = FileAccess.open(path, FileAccess.READ)
	var content = file.get_as_text()
	file.close()
	var json = JSON.new()
	if json.parse(content) == OK:
		if typeof(json.data) == TYPE_DICTIONARY:
			return json.data
	return {}

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

func select_tab(tab_name: String) -> void:
	active_tab = tab_name.to_lower()
	
	# Active tab coloring
	var active_color = Color(0.0, 0.85, 1.0)
	var normal_color = Color(1, 1, 1, 1)
	
	if profile_tab_btn:
		profile_tab_btn.modulate = active_color if active_tab == "profile" else normal_color
	if options_tab_btn:
		options_tab_btn.modulate = active_color if active_tab == "options" else normal_color
		
	# Manage visibility
	if active_tab == "profile":
		if profile_panel:
			profile_panel.visible = true
			if profile_panel.has_method("display_profile"):
				profile_panel.display_profile(profile_data)
		if settings_scroll:
			settings_scroll.visible = false
		if empty_lbl:
			empty_lbl.visible = false
			
	elif active_tab == "options":
		if profile_panel:
			profile_panel.visible = false
		if settings_scroll:
			settings_scroll.visible = true
		_populate_settings_rows()

func _populate_settings_rows() -> void:
	if not options_container:
		return
		
	# Clear existing children
	for child in options_container.get_children():
		child.queue_free()
		
	if not option_row_scene:
		if empty_lbl:
			empty_lbl.text = "Failed to load option prefab."
			empty_lbl.visible = true
		return
		
	if empty_lbl:
		empty_lbl.visible = false
		
	# --- SECTION 1: AUDIO SETTINGS ---
	_add_header_label("AUDIO SETTINGS")
	
	var audio_conf = settings_data.get("audio", {})
	_create_toggle_row("music_enabled", "Background Music", audio_conf.get("music_enabled", true))
	_create_toggle_row("sfx_enabled", "Sound Effects", audio_conf.get("sfx_enabled", true))
	_create_slider_row("master_volume", "Master Volume Slider", 0.0, 100.0, audio_conf.get("master_volume", 80.0))
	
	# --- SECTION 2: SYSTEM CONFIGURATION ---
	_add_header_label("SYSTEM OPTIONS")
	
	var graphics_conf = settings_data.get("graphics", {})
	var graphics_options = ["Low", "Medium", "High", "Ultra"]
	_create_dropdown_row("graphics_quality", "Graphics Quality", graphics_options, graphics_conf.get("quality", "High"))
	
	var notif_conf = settings_data.get("notifications", {})
	_create_toggle_row("push_enabled", "Push Notifications Toggles", notif_conf.get("push_enabled", true))
	
	var lang_conf = settings_data.get("language", {})
	_create_dropdown_row("language_code", "Language (Selector)", languages_db, lang_conf.get("current", "en"))
	
	# --- SECTION 3: UTILITY ACTIONS ---
	_add_header_label("SUPPORT & COMMUNITY")
	_create_button_row("redeem_code", "Redeem Promo/Gift Code", "ENTER CODE")
	_create_button_row("support_ticket", "Help & Support Tickets", "CONTACT SUPPORT")
	_create_button_row("logout", "Account Sign Out / Reset", "LOGOUT")

func _add_header_label(text: String) -> void:
	var lbl = Label.new()
	lbl.text = "\n" + text.to_upper()
	lbl.modulate = Color(0.4, 0.6, 0.8) # Muted blue header
	lbl.add_theme_font_size_override("font_size", 13)
	options_container.add_child(lbl)

func _create_toggle_row(key: String, label: String, default_val: bool) -> void:
	var row = option_row_scene.instantiate()
	options_container.add_child(row)
	row.init_toggle(key, label, default_val)
	row.value_changed.connect(_on_settings_value_changed)

func _create_dropdown_row(key: String, label: String, options: Array, default_val: String) -> void:
	var row = option_row_scene.instantiate()
	options_container.add_child(row)
	row.init_dropdown(key, label, options, default_val)
	row.value_changed.connect(_on_settings_value_changed)

func _create_slider_row(key: String, label: String, min_v: float, max_v: float, cur_v: float) -> void:
	var row = option_row_scene.instantiate()
	options_container.add_child(row)
	row.init_slider(key, label, min_v, max_v, cur_v)
	row.value_changed.connect(_on_settings_value_changed)

func _create_button_row(key: String, label: String, btn_text: String) -> void:
	var row = option_row_scene.instantiate()
	options_container.add_child(row)
	row.init_button(key, label, btn_text)
	row.action_triggered.connect(_on_settings_action_triggered)

# --- SAVE & APPLY LOGIC ---

func _on_settings_value_changed(key: String, value: Variant) -> void:
	var toast = get_node_or_null("/root/UIManager")
	
	if key == "music_enabled" or key == "sfx_enabled" or key == "master_volume":
		var audio_conf = settings_data.get("audio", {})
		audio_conf[key] = value
		settings_data["audio"] = audio_conf
		
		# If SettingsManager exists, we can call save/sync APIs
		var settings_mgr = get_node_or_null("/root/SettingsManager")
		if settings_mgr and settings_mgr.has_method("update_audio_setting"):
			settings_mgr.update_audio_setting(key, value)
			
		if toast and toast.has_method("show_toast"):
			toast.show_toast("Audio setting applied: %s" % str(value))
			
	elif key == "graphics_quality":
		var graphics_conf = settings_data.get("graphics", {})
		graphics_conf["quality"] = value
		settings_data["graphics"] = graphics_conf
		
		if toast and toast.has_method("show_toast"):
			toast.show_toast("Graphics profile set to: " + str(value))
			
	elif key == "push_enabled":
		var notif_conf = settings_data.get("notifications", {})
		notif_conf["push_enabled"] = value
		settings_data["notifications"] = notif_conf
		
		if toast and toast.has_method("show_toast"):
			toast.show_toast("Push notifications %s" % ("enabled" if value else "disabled"))
			
	elif key == "language_code":
		var lang_conf = settings_data.get("language", {})
		lang_conf["current"] = value
		settings_data["language"] = lang_conf
		
		if toast and toast.has_method("show_toast"):
			toast.show_toast("Language preference set. Restart needed.")

func _on_settings_action_triggered(key: String) -> void:
	var toast = get_node_or_null("/root/UIManager")
	
	if key == "redeem_code":
		if toast and toast.has_method("show_toast"):
			toast.show_toast("Redeemer system active! Code PROMO2026 redeemed.")
		else:
			print("Redeem Code trigger processed.")
			
	elif key == "support_ticket":
		if toast and toast.has_method("show_toast"):
			toast.show_toast("Support portal loaded in background.")
		else:
			print("Contact Support portal triggered.")
			
	elif key == "logout":
		if toast and toast.has_method("show_toast"):
			toast.show_toast("Returning to Citadel Gate screen...")
		else:
			print("Signout instruction processed.")
			
		# Optional UIManager reload
		if toast and toast.has_method("reload_game_gate"):
			toast.reload_game_gate()

func _on_close_pressed() -> void:
	# Clean popup dismissal animation
	var tween = create_tween()
	tween.tween_property(self, "modulate:a", 0.0, 0.18)
	tween.tween_callback(queue_free)
