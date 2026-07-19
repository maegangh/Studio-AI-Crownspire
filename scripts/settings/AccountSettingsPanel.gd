extends VBoxContainer

# ==========================================
# CROWNSPIRE ACCOUNT MANAGEMENT PANEL
# ==========================================
# Manages user accounts, platform logins, player ID displays,
# and hosts the security logout trigger.

@onready var player_id_label: Label = %PlayerIdLabel
@onready var gplay_btn: Button = %GplayBtn
@onready var apple_btn: Button = %AppleBtn
@onready var email_btn: Button = %EmailBtn
@onready var logout_btn: Button = %LogoutBtn

var player_id_str: String = "CS-984251"

func _ready() -> void:
	player_id_label.text = "PLAYER ID: " + player_id_str
	
	_update_buttons()
	
	gplay_btn.pressed.connect(func(): _toggle_link("Google Play Games"))
	apple_btn.pressed.connect(func(): _toggle_link("Apple Game Center"))
	email_btn.pressed.connect(func(): _toggle_link("Citadel Email"))
	logout_btn.pressed.connect(_on_logout_pressed)

func _update_buttons() -> void:
	var linked = SettingsManager.settings["profile"]["linked_accounts"]
	
	_style_link_button(gplay_btn, "Google Play", "Google Play Games" in linked)
	_style_link_button(apple_btn, "Apple Center", "Apple Game Center" in linked)
	_style_link_button(email_btn, "Citadel Mail", "Citadel Email" in linked)

func _style_link_button(btn: Button, service_name: String, is_linked: bool) -> void:
	if is_linked:
		btn.text = "🔗 " + service_name + " (LINKED)"
		btn.modulate = Color(0.4, 0.9, 0.65, 1.0) # Emerald
	else:
		btn.text = "➕ Link " + service_name
		btn.modulate = Color(1, 1, 1, 0.7)

func _toggle_link(service: String) -> void:
	var linked = SettingsManager.settings["profile"]["linked_accounts"] as Array
	if service in linked:
		# Unlink flow
		linked.erase(service)
		UIManager.reward_claimed.emit([
			{"name": service + " Severed", "quantity": 1, "rarity": 1}
		])
	else:
		# Link flow
		linked.append(service)
		UIManager.reward_claimed.emit([
			{"name": service + " Bound", "quantity": 1, "rarity": 3}
		])
		
	SettingsManager.save_settings()
	_update_buttons()

func _on_logout_pressed() -> void:
	var logout_popup_scene = load("res://scenes/settings/LogoutPopup.tscn")
	if logout_popup_scene:
		UIManager.open_popup(logout_popup_scene)
