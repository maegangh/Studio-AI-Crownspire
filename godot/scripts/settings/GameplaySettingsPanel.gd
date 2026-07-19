extends VBoxContainer

# ==========================================
# CROWNSPIRE GAMEPLAY CONFIGURATION PANEL
# ==========================================
# Manages gameplay toggles including camera shakes, screen flashes,
# global coordinate HUD overlays, and auto-translations.

@onready var shake_check: CheckButton = %ShakeCheck
@onready var flash_check: CheckButton = %FlashCheck
@onready var coords_check: CheckButton = %CoordsCheck
@onready var translate_check: CheckButton = %TranslateCheck

func _ready() -> void:
	var gp_conf = SettingsManager.settings["gameplay"]
	shake_check.button_pressed = gp_conf["camera_shake"]
	flash_check.button_pressed = gp_conf["screen_flashes"]
	coords_check.button_pressed = gp_conf["show_coordinates"]
	translate_check.button_pressed = gp_conf["auto_translate"]
	
	shake_check.toggled.connect(_on_shake_toggled)
	flash_check.toggled.connect(_on_flash_toggled)
	coords_check.toggled.connect(_on_coords_toggled)
	translate_check.toggled.connect(_on_translate_toggled)

func _on_shake_toggled(pressed: bool) -> void:
	SettingsManager.settings["gameplay"]["camera_shake"] = pressed
	SettingsManager.save_settings()

func _on_flash_toggled(pressed: bool) -> void:
	SettingsManager.settings["gameplay"]["screen_flashes"] = pressed
	SettingsManager.save_settings()

func _on_coords_toggled(pressed: bool) -> void:
	SettingsManager.settings["gameplay"]["show_coordinates"] = pressed
	SettingsManager.save_settings()

func _on_translate_toggled(pressed: bool) -> void:
	SettingsManager.settings["gameplay"]["auto_translate"] = pressed
	SettingsManager.save_settings()
