extends PanelContainer

# ==========================================
# CROWNSPIRE MAIL LIST CARD CONTROLLER
# ==========================================
# Represents an individual message within the scrolling list.
# Handles read/unread highlight styles and attachment indicators.

signal item_selected(mail_data: Dictionary)

@onready var sender_label: Label = get_node_or_null("%SenderLabel")
@onready var subject_label: Label = get_node_or_null("%SubjectLabel")
@onready var status_indicator: TextureRect = get_node_or_null("%StatusIndicator")
@onready var unread_dot: ColorRect = get_node_or_null("%UnreadDot")
@onready var attachment_icon: Label = get_node_or_null("%AttachmentIcon")
@onready var date_label: Label = get_node_or_null("%DateLabel")
@onready var select_button: Button = get_node_or_null("%SelectButton")

var item_data: Dictionary = {}

func _ready() -> void:
	if select_button:
		select_button.pressed.connect(_on_card_pressed)

func init_item(data: Dictionary) -> void:
	item_data = data
	
	if sender_label:
		sender_label.text = data.get("sender", "System Notification")
	if subject_label:
		subject_label.text = data.get("title", "Incoming Transmission")
		
	# Setup date display from UNIX timestamp
	if date_label:
		var ts = data.get("timestamp", 0)
		if ts > 0:
			var datetime = Time.get_datetime_dict_from_unix_time(ts)
			date_label.text = "%02d/%02d/%04d" % [datetime.month, datetime.day, datetime.year]
		else:
			date_label.text = "Recent"

	# Show unread markers
	var is_read = data.get("read", false)
	if unread_dot:
		unread_dot.visible = not is_read
		
	# Color modulation based on read state
	if is_read:
		modulate = Color(0.7, 0.7, 0.7, 0.9)
	else:
		modulate = Color(1.0, 1.0, 1.0, 1.0)
		
	# Show attachment indicator
	var has_attachments = data.get("attachments", []).size() > 0
	var claimed = data.get("claimed", false)
	
	if attachment_icon:
		if has_attachments:
			attachment_icon.visible = true
			if claimed:
				attachment_icon.text = "📦 Claimed"
				attachment_icon.modulate = Color(0.5, 0.5, 0.5)
			else:
				attachment_icon.text = "🎁 Rewards"
				attachment_icon.modulate = Color(1.0, 0.84, 0.0) # Gold
		else:
			attachment_icon.visible = false

func _on_card_pressed() -> void:
	item_selected.emit(item_data)
