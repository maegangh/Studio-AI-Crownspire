extends VBoxContainer

# ==========================================
# CROWNSPIRE REWARD SLOT CONTROLLER
# ==========================================
# Modular cell for displaying single item shards inside reward popups.

@onready var icon_rect: TextureRect = %IconRect
@onready var qty_label: Label = %QtyLabel
@onready var name_label: Label = %NameLabel
@onready var border_rect: PanelContainer = %BorderRect

func setup_reward(item_name: String, quantity: int, rarity: int, icon_path: String) -> void:
	name_label.text = item_name
	qty_label.text = "x" + str(quantity)
	
	if not icon_path.is_empty():
		icon_rect.texture = load(icon_path)
		
	_set_rarity_style(rarity)

func _set_rarity_style(rarity: int) -> void:
	var color_val := Color(0.29, 0.33, 0.39) # Gray
	match rarity:
		1: color_val = Color(0.0, 0.82, 1.0)      # Rare blue
		2: color_val = Color(0.82, 0.0, 1.0)      # Epic purple
		3: color_val = Color(1.0, 0.84, 0.0)      # Legendary gold
		4: color_val = Color(0.93, 0.26, 0.26)     # Mythic red
		
	border_rect.modulate = color_val
