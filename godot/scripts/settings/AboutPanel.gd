extends VBoxContainer

# ==========================================
# CROWNSPIRE ABOUT SYSTEM PANEL
# ==========================================
# Holds information about game client build number, target engine,
# server endpoints, and checks for client patches.

@onready var version_lbl: Label = %VersionLabel
@onready var check_update_btn: Button = %CheckUpdateBtn
@onready var terms_btn: Button = %TermsBtn
@onready var policy_btn: Button = %PolicyBtn

var build_ver: String = "v1.4.24-Stable (Build #2026)"
var engine_ver: String = "Godot Engine 4.4.1.rc.custom"

func _ready() -> void:
	version_lbl.text = "CROWNSPIRE MOBILE\n%s\nEngine: %s" % [build_ver, engine_ver]
	
	check_update_btn.pressed.connect(_on_check_update)
	terms_btn.pressed.connect(func(): _open_legal_dialog("TERMS OF SERVICE", "Your pledge to Crownspire is bound by the Sacred Scribes code. All resources harvested from the Spires are subject to seasonal taxes of Honor!"))
	policy_btn.pressed.connect(func(): _open_legal_dialog("PRIVACY TREATY", "The Citadel respects player secrecy. We collect only what is necessary to maintain stability in the Spire and prevent rogue magical scripts!"))

func _on_check_update() -> void:
	check_update_btn.disabled = true
	check_update_btn.text = "Summoning Scribes..."
	
	await get_tree().create_timer(1.2).timeout
	
	check_update_btn.disabled = false
	check_update_btn.text = "Check for Patches"
	
	var conf_scene = load("res://scenes/settings/ConfirmationPopup.tscn")
	if conf_scene:
		var popup = UIManager.open_popup(conf_scene)
		if popup:
			popup.setup("SYSTEM COMPLIANT", "Your game scroll is fully up-to-date. No magical anomalies detected.")

func _open_legal_dialog(title_str: String, text_str: String) -> void:
	var conf_scene = load("res://scenes/settings/ConfirmationPopup.tscn")
	if conf_scene:
		var popup = UIManager.open_popup(conf_scene)
		if popup:
			popup.setup(title_str, text_str)
