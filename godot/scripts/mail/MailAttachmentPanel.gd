extends Control

# ==========================================
# CROWNSPIRE MAIL ATTACHMENT PANEL
# ==========================================

@onready var grid_container: GridContainer = $GridContainer
@onready var status_label: Label = $StatusLabel

# We can instantiate a custom small visual row/box for each attachment
# to handle emoji-based icons beautifully
const ATTACHMENT_ITEM_SCENE = preload("res://scenes/mail/MailAttachmentPanelItem.tscn")

func setup_attachments(attachments: Array, is_claimed: bool) -> void:
	# Clear existing children
	for child in grid_container.get_children():
		child.queue_free()
		
	# Populate items
	for item in attachments:
		var item_inst = ATTACHMENT_ITEM_SCENE.instantiate()
		grid_container.add_child(item_inst)
		
		var name_str = item.get("name", "Unknown Material")
		var qty = int(item.get("quantity", 1))
		var rarity = int(item.get("rarity", 2))
		var icon_str = item.get("icon", "📦")
		
		item_inst.setup_item(name_str, qty, rarity, icon_str, is_claimed)
		
	# Update general status text
	if is_claimed:
		status_label.text = "Materials successfully claimed into Citadel storehouses."
		status_label.self_modulate = Color(0.6, 0.65, 0.7, 0.8) # Muted gray
	else:
		status_label.text = "These materials are waiting to be claimed by your legions."
		status_label.self_modulate = Color(1.0, 0.84, 0.0, 1.0) # Radiant golden warning
