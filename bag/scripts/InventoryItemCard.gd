extends PanelContainer

# ==========================================
# CROWNSPIRE BAG MODULE: ITEM CARD CONTROLLER
# ==========================================
# Manages the visual card representing an inventory item.
# Leverages custom style overrides to draw professional rarity tiers.

signal card_clicked(item_id: String)

@onready var icon_label: Label = get_node_or_null("%IconLabel")
@onready var quantity_label: Label = get_node_or_null("%QuantityLabel")
@onready var name_label: Label = get_node_or_null("%NameLabel")
@onready var border_panel: PanelContainer = get_node_or_null("%BorderPanel")

var item_id: String = ""
var item_data: Dictionary = {}
var quantity: int = 0

func _ready() -> void:
	gui_input.connect(_on_gui_input)
	mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND

func init_card(p_item_id: String, p_item_data: Dictionary, p_qty: int) -> void:
	item_id = p_item_id
	item_data = p_item_data
	quantity = p_qty
	
	if name_label:
		name_label.text = item_data.get("name", "Unknown Item")
	if quantity_label:
		quantity_label.text = str(quantity)
		
	# Setup icon or fallback emoji
	if icon_label:
		icon_label.text = _get_item_emoji(item_data)
		
	# Setup custom rarity styling dynamically
	var rarity = item_data.get("rarity", "common").to_lower()
	_apply_rarity_border_style(rarity)

func _apply_rarity_border_style(rarity: String) -> void:
	if not border_panel:
		return
		
	var style = StyleBoxFlat.new()
	style.draw_center = false
	style.border_width_left = 2
	style.border_width_top = 2
	style.border_width_right = 2
	style.border_width_bottom = 2
	style.corner_radius_top_left = 6
	style.corner_radius_top_right = 6
	style.corner_radius_bottom_right = 6
	style.corner_radius_bottom_left = 6
	style.border_color = _get_rarity_color(rarity)
	
	border_panel.add_theme_stylebox_override("panel", style)

func _get_rarity_color(rarity: String) -> Color:
	match rarity:
		"uncommon":
			return Color(0.247, 0.705, 0.352, 1) # Green
		"rare":
			return Color(0.192, 0.478, 0.820, 1) # Blue
		"epic":
			return Color(0.584, 0.176, 0.843, 1) # Purple
		"legendary":
			return Color(0.901, 0.470, 0.078, 1) # Orange
		"mythic":
			return Color(0.901, 0.078, 0.117, 1) # Red
		_:
			return Color(0.607, 0.670, 0.737, 1) # Gray Common

func _get_item_emoji(data: Dictionary) -> String:
	var cat = data.get("category", "").to_lower()
	var name_lower = data.get("name", "").to_lower()
	var id_lower = data.get("id", "").to_lower()
	
	if "food" in id_lower or "food" in name_lower:
		return "🍖"
	elif "wood" in id_lower or "wood" in name_lower:
		return "🪵"
	elif "stone" in id_lower or "stone" in name_lower:
		return "🧱"
	elif "iron" in id_lower or "iron" in name_lower:
		return "🪙"
	elif "diamond" in id_lower or "crystal" in id_lower:
		return "💎"
	elif "speedup" in cat or "speedup" in id_lower:
		return "⏱️"
	elif "weapon" in id_lower or "sword" in id_lower or "helmet" in id_lower or "visor" in id_lower:
		return "🛡️"
	elif "potion" in id_lower or "elixir" in id_lower:
		return "🧪"
	elif "chest" in id_lower or "trunk" in id_lower:
		return "📦"
	elif "shard" in id_lower:
		return "🎖️"
	else:
		return "📦"

func _on_gui_input(event: InputEvent) -> void:
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
		card_clicked.emit(item_id)
