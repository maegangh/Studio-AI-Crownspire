extends Button

# ==========================================
# CROWNSPIRE MAIL CARD CONTROLLER
# ==========================================

signal card_pressed()

@onready var icon_label: Label = $HBoxContainer/IconContainer/IconLabel
@onready var sender_label: Label = $HBoxContainer/TextContainer/SenderLabel
@onready var title_label: Label = $HBoxContainer/TextContainer/TitleLabel
@onready var date_label: Label = %DateLabel
@onready var expire_warn: Label = %ExpireWarn
@onready var attachment_icon: Label = %AttachmentIcon
@onready var unread_dot: Panel = %UnreadIndicator

var _mail_id: String = ""
var _is_read: bool = false

func _ready() -> void:
	pressed.connect(func(): card_pressed.emit())

func setup_card(mail_data: Dictionary) -> void:
	_mail_id = mail_data.get("id", "")
	_is_read = mail_data.get("read", false)
	
	# Set text and info
	sender_label.text = mail_data.get("sender", "Citadel Courier")
	title_label.text = mail_data.get("title", "No Title")
	
	# Set category icon
	var category_id = mail_data.get("category_id", "system")
	var icon_unicode = "⚙️"
	match category_id:
		"system": icon_unicode = "⚙️"
		"battle":
			# Let's check battle winner
			if mail_data.has("battle_info"):
				var b_info = mail_data["battle_info"] as Dictionary
				if b_info.get("winner", "") == UIManager.player_name:
					icon_unicode = "⚔️" # Golden blade of victory
				else:
					icon_unicode = "💀" # Skull of defeat
			else:
				icon_unicode = "⚔️"
		"alliance": icon_unicode = "🛡️"
		"event": icon_unicode = "🏆"
	icon_label.text = icon_unicode
	
	# Format relative timestamp
	date_label.text = MailManager.format_timestamp(int(mail_data.get("timestamp", 0)))
	
	# Check attachments
	var attachments = mail_data.get("attachments", []) as Array
	if attachments.size() > 0:
		attachment_icon.visible = true
		if mail_data.get("claimed", false):
			attachment_icon.modulate = Color(0.5, 0.5, 0.5, 0.5) # Dimmed paperclip/box
			# Use opened chest icon or standard checkmark
			attachment_icon.self_modulate = Color.DARK_GRAY
		else:
			attachment_icon.modulate = Color(1.0, 1.0, 1.0, 1.0) # Highlighted gift box
			attachment_icon.self_modulate = Color.GOLD
	else:
		attachment_icon.visible = false
		
	# Check expiration warnings (1 day or less)
	var current_time = Time.get_unix_time_from_system()
	var expiry_time = int(mail_data.get("expiry_timestamp", 0))
	var hours_left = (expiry_time - current_time) / 3600.0
	
	if hours_left <= 24.0 and hours_left > 0.0:
		expire_warn.visible = true
		expire_warn.text = "⚠️ " + MailManager.get_expiry_string(expiry_time)
		expire_warn.self_modulate = Color(1.0, 0.35, 0.35, 1.0) # Red warning
	else:
		expire_warn.visible = false
		
	# Setup unread indicator states
	_update_read_state_visuals()

func get_mail_id() -> String:
	return _mail_id

func mark_as_read_visually() -> void:
	if not _is_read:
		_is_read = true
		_update_read_state_visuals()

func _update_read_state_visuals() -> void:
	if _is_read:
		unread_dot.visible = false
		modulate = Color(0.85, 0.85, 0.9, 0.85) # Slightly faded/transparent
		title_label.modulate = Color(0.7, 0.7, 0.75, 1.0) # Dimmed body text style
		sender_label.modulate = Color(0.8, 0.8, 0.8, 1.0)
	else:
		unread_dot.visible = true
		modulate = Color(1.0, 1.0, 1.0, 1.0) # Full brightness
		title_label.modulate = Color(1.1, 1.1, 1.2, 1.0) # Bright crystal-blue text style
		sender_label.modulate = Color(1.0, 0.92, 0.8, 1.0) # Light golden sender
		
		# Slight pulsing scale on unread indicator dot
		var tween = create_tween().set_loops()
		tween.tween_property(unread_dot, "scale", Vector2(1.2, 1.2), 0.6)
		tween.tween_property(unread_dot, "scale", Vector2.ONE, 0.6)
