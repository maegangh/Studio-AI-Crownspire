extends VBoxContainer

# ==========================================
# CROWNSPIRE GRAPHICS SETTINGS PANEL
# ==========================================
# Manages visual profile settings (Battery Saver, Medium, High), target frame rate
# (30 vs 60 fps), shadows, bloom, and battery saving configurations.

@onready var profile_options: OptionButton = %ProfileOptions
@onready var fps_30_btn: Button = %Fps30Btn
@onready var fps_60_btn: Button = %Fps60Btn
@onready var battery_check: CheckButton = %BatteryCheck
@onready var shadows_check: CheckButton = %ShadowsCheck
@onready var bloom_check: CheckButton = %BloomCheck

func _ready() -> void:
	var graph_conf = SettingsManager.settings["graphics"]
	
	# Load profile options
	profile_options.clear()
	for i in range(SettingsManager.graphics_profiles.size()):
		var p = SettingsManager.graphics_profiles[i]
		profile_options.add_item(p["name"], i)
		if p["name"] == graph_conf["profile"]:
			profile_options.select(i)
			
	# Update FPS Buttons
	_update_fps_buttons(graph_conf["frame_rate"])
	
	# Load check buttons
	battery_check.button_pressed = graph_conf["battery_saver"]
	shadows_check.button_pressed = graph_conf["shadows_enabled"]
	bloom_check.button_pressed = graph_conf["bloom_enabled"]
	
	# Connect signals
	profile_options.item_selected.connect(_on_profile_selected)
	fps_30_btn.pressed.connect(func(): _on_fps_changed(30))
	fps_60_btn.pressed.connect(func(): _on_fps_changed(60))
	battery_check.toggled.connect(_on_battery_toggled)
	shadows_check.toggled.connect(_on_shadows_toggled)
	bloom_check.toggled.connect(_on_bloom_toggled)

func _update_fps_buttons(rate: int) -> void:
	if rate == 30:
		fps_30_btn.modulate = Color(1.0, 0.85, 0.3, 1.0) # Active Gold
		fps_60_btn.modulate = Color(1, 1, 1, 0.5)
	else:
		fps_30_btn.modulate = Color(1, 1, 1, 0.5)
		fps_60_btn.modulate = Color(1.0, 0.85, 0.3, 1.0) # Active Gold

func _on_profile_selected(index: int) -> void:
	var prof = SettingsManager.graphics_profiles[index]
	var graph_conf = SettingsManager.settings["graphics"]
	
	graph_conf["profile"] = prof["name"]
	graph_conf["frame_rate"] = prof["fps"]
	graph_conf["shadows_enabled"] = prof["shadows"]
	graph_conf["bloom_enabled"] = prof["bloom"]
	
	_update_fps_buttons(prof["fps"])
	shadows_check.button_pressed = prof["shadows"]
	bloom_check.button_pressed = prof["bloom"]
	
	SettingsManager.apply_graphics_settings()
	SettingsManager.save_settings()

func _on_fps_changed(rate: int) -> void:
	SettingsManager.settings["graphics"]["frame_rate"] = rate
	_update_fps_buttons(rate)
	SettingsManager.apply_graphics_settings()
	SettingsManager.save_settings()

func _on_battery_toggled(pressed: bool) -> void:
	SettingsManager.settings["graphics"]["battery_saver"] = pressed
	if pressed:
		_update_fps_buttons(30)
		SettingsManager.settings["graphics"]["frame_rate"] = 30
	SettingsManager.apply_graphics_settings()
	SettingsManager.save_settings()

func _on_shadows_toggled(pressed: bool) -> void:
	SettingsManager.settings["graphics"]["shadows_enabled"] = pressed
	SettingsManager.save_settings()

func _on_bloom_toggled(pressed: bool) -> void:
	SettingsManager.settings["graphics"]["bloom_enabled"] = pressed
	SettingsManager.save_settings()
