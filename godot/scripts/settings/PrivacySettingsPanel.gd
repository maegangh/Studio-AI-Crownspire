extends VBoxContainer

# ==========================================
# CROWNSPIRE PRIVACY PREFERENCES PANEL
# ==========================================
# Controls personalization permissions, analytic statistics telemetry tracking,
# and public player ranking profile visibility.

@onready var analytics_check: CheckButton = %AnalyticsCheck
@onready var personalization_check: CheckButton = %PersonalizationCheck
@onready var public_profile_check: CheckButton = %PublicProfileCheck

func _ready() -> void:
	var priv_conf = SettingsManager.settings["privacy"]
	analytics_check.button_pressed = priv_conf["analytics"]
	personalization_check.button_pressed = priv_conf["personalization"]
	public_profile_check.button_pressed = priv_conf["public_profile"]
	
	analytics_check.toggled.connect(_on_analytics_toggled)
	personalization_check.toggled.connect(_on_personalization_toggled)
	public_profile_check.toggled.connect(_on_public_profile_toggled)

func _on_analytics_toggled(pressed: bool) -> void:
	SettingsManager.settings["privacy"]["analytics"] = pressed
	SettingsManager.save_settings()

func _on_personalization_toggled(pressed: bool) -> void:
	SettingsManager.settings["privacy"]["personalization"] = pressed
	SettingsManager.save_settings()

func _on_public_profile_toggled(pressed: bool) -> void:
	SettingsManager.settings["privacy"]["public_profile"] = pressed
	SettingsManager.save_settings()
