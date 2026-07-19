extends PanelContainer
class_name QuestRewardPanel

# ==========================================
# CROWNSPIRE QUEST DETAIL REWARD CELL
# ==========================================

@onready var icon_label: Label = $Margin/VBox/IconLabel if has_node("Margin/VBox/IconLabel") else get_node_or_null("IconLabel")
@onready var qty_label: Label = $Margin/VBox/QtyLabel if has_node("Margin/VBox/QtyLabel") else get_node_or_null("QtyLabel")
@onready var name_label: Label = $Margin/VBox/NameLabel if has_node("Margin/VBox/NameLabel") else get_node_or_null("NameLabel")

# Custom styled borders for different loot rarities
var rarity_borders: Dictionary = {
	1: Color(0.4, 0.45, 0.5, 0.8),    # Common: Silver/Gray
	2: Color(0.2, 0.45, 0.8, 1.0),    # Rare: Crystal Blue
	3: Color(0.6, 0.2, 0.8, 1.0),     # Epic: Alchemy Purple
	4: Color(1.0, 0.7, 0.15, 1.0)     # Legendary: Sovereign Gold
}

var rarity_bgs: Dictionary = {
	1: Color(0.1, 0.12, 0.16, 0.9),   # Common Dark Gray
	2: Color(0.08, 0.13, 0.22, 0.9),  # Rare Dark Blue
	3: Color(0.12, 0.08, 0.2, 0.9),   # Epic Dark Purple
	4: Color(0.18, 0.13, 0.08, 0.9)   # Legendary Dark Amber
}

func populate_reward(reward_data: Dictionary) -> void:
	if icon_label:
		icon_label.text = reward_data.get("icon", "📦")
		
	if qty_label:
		var qty = int(reward_data.get("quantity", 1))
		if qty >= 1000000:
			qty_label.text = "%.1fM" % (qty / 1000000.0)
		elif qty >= 1000:
			qty_label.text = "%.1fK" % (qty / 1000.0)
		else:
			qty_label.text = "x%d" % qty
			
	if name_label:
		name_label.text = reward_data.get("name", "Prize")
		
	# Apply dynamic rarity outline & background panel styles
	var rarity = int(reward_data.get("rarity", 1))
	_apply_rarity_styles(rarity)

func _apply_rarity_styles(rarity: int) -> void:
	var sb = StyleBoxFlat.new()
	sb.bg_color = rarity_bgs.get(rarity, Color(0.1, 0.12, 0.16, 0.9))
	sb.border_width_left = 2
	sb.border_width_right = 2
	sb.border_width_top = 2
	sb.border_width_bottom = 2
	sb.border_color = rarity_borders.get(rarity, Color(0.4, 0.45, 0.5, 0.8))
	sb.corner_radius_top_left = 6
	sb.corner_radius_top_right = 6
	sb.corner_radius_bottom_right = 6
	sb.corner_radius_bottom_left = 6
	
	add_theme_stylebox_override("panel", sb)
