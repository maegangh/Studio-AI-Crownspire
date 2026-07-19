extends VBoxContainer

# ==========================================
# CROWNSPIRE NOTIFICATION CONFIGURATION PANEL
# ==========================================
# Governs toggle switches for critical mobile push and overlay alerts:
# peace shield timers, stamina recovery, guild rallies, and inbox arrivals.

@onready var push_master_check: CheckButton = %PushMasterCheck
@onready var energy_check: CheckButton = %EnergyCheck
@onready var shield_check: CheckButton = %ShieldCheck
@onready var rally_check: CheckButton = %RallyCheck
@onready var mail_check: CheckButton = %MailCheck

func _ready() -> void:
	var notif_conf = SettingsManager.settings["notifications"]
	push_master_check.button_pressed = notif_conf["push_enabled"]
	energy_check.button_pressed = notif_conf["energy_full"]
	shield_check.button_pressed = notif_conf["shield_expiry"]
	rally_check.button_pressed = notif_conf["alliance_rallies"]
	mail_check.button_pressed = notif_conf["mail_received"]
	
	push_master_check.toggled.connect(_on_push_master_toggled)
	energy_check.toggled.connect(func(p): _on_toggle_notif("energy_full", p))
	shield_check.toggled.connect(func(p): _on_toggle_notif("shield_expiry", p))
	rally_check.toggled.connect(func(p): _on_toggle_notif("alliance_rallies", p))
	mail_check.toggled.connect(func(p): _on_toggle_notif("mail_received", p))
	
	_update_sub_toggles_state(push_master_check.button_pressed)

func _update_sub_toggles_state(enabled: bool) -> void:
	energy_check.disabled = not enabled
	shield_check.disabled = not enabled
	rally_check.disabled = not enabled
	mail_check.disabled = not enabled

func _on_push_master_toggled(pressed: bool) -> void:
	SettingsManager.settings["notifications"]["push_enabled"] = pressed
	_update_sub_toggles_state(pressed)
	SettingsManager.save_settings()

func _on_toggle_notif(key: String, pressed: bool) -> void:
	SettingsManager.settings["notifications"][key] = pressed
	SettingsManager.save_settings()
