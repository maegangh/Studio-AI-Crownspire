extends Control

# ==========================================
# CROWNSPIRE MAIL DETAIL PANEL CONTROLLER
# ==========================================
# Displays full text, lists rewards, handles claims,
# and emits delete callbacks.

signal claim_clicked(mail_id: String)
signal delete_clicked(mail_id: String)
signal close_clicked()

@onready var sender_label: Label = get_node_or_null("%SenderLabel")
@onready var title_label: Label = get_node_or_null("%TitleLabel")
@onready var text_body: Label = get_node_or_null("%TextBody")
@onready var expiry_label: Label = get_node_or_null("%ExpiryLabel")
@onready var attachment_container: HBoxContainer = get_node_or_null("%AttachmentContainer")
@onready var attachment_panel: PanelContainer = get_node_or_null("%AttachmentPanel")

@onready var claim_button: Button = get_node_or_null("%ClaimButton")
@onready var delete_button: Button = get_node_or_null("%DeleteButton")
@onready var close_button: Button = get_node_or_null("%CloseButton")

var active_mail_id: String = ""

func _ready() -> void:
	if claim_button:
		claim_button.pressed.connect(_on_claim_pressed)
	if delete_button:
		delete_button.pressed.connect(_on_delete_pressed)
	if close_button:
		close_button.pressed.connect(_on_close_pressed)

func display_mail(mail_data: Dictionary) -> void:
	active_mail_id = mail_data.get("id", "")
	
	if sender_label:
		sender_label.text = "SENDER: " + mail_data.get("sender", "Council").to_upper()
	if title_label:
		title_label.text = mail_data.get("title", "No Title")
	if text_body:
		text_body.text = mail_data.get("body", "")
		
	if expiry_label:
		var days = mail_data.get("expires_in_days", 15)
		expiry_label.text = "Expires in: %d days" % days

	# Populate attachments
	var attachments = mail_data.get("attachments", [])
	var claimed = mail_data.get("claimed", false)
	
	if attachment_container:
		# Clear previous
		for child in attachment_container.get_children():
			child.queue_free()
			
		if attachments.size() > 0:
			if attachment_panel:
				attachment_panel.visible = true
				
			for att in attachments:
				var box = VBoxContainer.new()
				box.custom_minimum_size = Vector2(80, 80)
				box.size_flags_horizontal = SIZE_EXPAND_FILL
				
				var icon_lbl = Label.new()
				icon_lbl.text = att.get("icon", "📦")
				icon_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
				
				var name_lbl = Label.new()
				name_lbl.text = att.get("name", "Item")
				name_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
				
				var qty_lbl = Label.new()
				qty_lbl.text = "x" + String.num_int64(att.get("quantity", 1))
				qty_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
				qty_lbl.modulate = Color(1, 0.84, 0.0)
				
				box.add_child(icon_lbl)
				box.add_child(name_lbl)
				box.add_child(qty_lbl)
				attachment_container.add_child(box)
		else:
			if attachment_panel:
				attachment_panel.visible = false

	# Setup button actions
	if claim_button:
		if attachments.size() > 0:
			claim_button.visible = true
			if claimed:
				claim_button.disabled = true
				claim_button.text = "CLAIMED"
			else:
				claim_button.disabled = false
				claim_button.text = "CLAIM REWARDS"
		else:
			claim_button.visible = false

func _on_claim_pressed() -> void:
	claim_clicked.emit(active_mail_id)

func _on_delete_pressed() -> void:
	delete_clicked.emit(active_mail_id)

func _on_close_pressed() -> void:
	close_clicked.emit()
