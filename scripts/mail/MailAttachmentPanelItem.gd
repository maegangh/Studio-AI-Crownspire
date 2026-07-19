extends PanelContainer

# ==========================================
# CROWNSPIRE MAIL ATTACHMENT ITEM CELL
# ==========================================

@onready var emoji_label: Label = $HBoxContainer/IconContainer/EmojiLabel
@onready var texture_rect: TextureRect = $HBoxContainer/IconContainer/TextureRect
@onready var name_label: Label = $HBoxContainer/TextContainer/NameLabel
@onready var qty_label: Label = $HBoxContainer/TextContainer/QtyLabel
@onready var claimed_overlay: Panel = $ClaimedOverlay

func setup_item(item_name: String, quantity: int, rarity: int, icon_str: String, is_claimed: bool) -> void:
	name_label.text = item_name
	qty_label.text = "x" + str(quantity)
	
	# Determine if icon_str is a file path or an emoji character
	if icon_str.begins_with("res://"):
		emoji_label.visible = false
		texture_rect.visible = true
		texture_rect.texture = load(icon_str)
	else:
		emoji_label.visible = true
		texture_rect.visible = false
		emoji_label.text = icon_str
		
	# Apply rarity bordering
	var border_color := Color(0.25, 0.28, 0.35, 1.0) # Gray/Common
	match rarity:
		1: border_color = Color(0.18, 0.45, 0.72, 1.0) # Blue/Rare
		2: border_color = Color(0.55, 0.22, 0.78, 1.0) # Purple/Epic
		3: border_color = Color(0.88, 0.68, 0.08, 1.0) # Gold/Legendary
		4: border_color = Color(0.85, 0.12, 0.12, 1.0) # Red/Mythic
		
	# Apply border panel colors
	self.self_modulate = border_color
	
	# Visualclaimed overlay settings
	claimed_overlay.visible = is_claimed
	if is_claimed:
		modulate = Color(0.6, 0.6, 0.65, 0.7) # Dimmed
	else:
		modulate = Color(1.0, 1.0, 1.0, 1.0) # Bright
