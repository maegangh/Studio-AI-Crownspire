extends PanelContainer

# ==========================================
# CROWNSPIRE BAG MODULE: DETAIL PANEL CONTROLLER
# ==========================================
# Manages the full inspection of an inventory item.
# Includes actions for USING, SELLING, or OPENING CHESTS.

signal item_used(item_id: String, count: int)
signal chest_opened(item_id: String, rewards: Array)
signal item_sold(item_id: String, gold_earned: int)
signal panel_closed

@onready var popup_name: Label = get_node_or_null("%PopupName")
@onready var popup_rarity: Label = get_node_or_null("%PopupRarity")
@onready var popup_description: Label = get_node_or_null("%PopupDescription")
@onready var popup_quantity: Label = get_node_or_null("%PopupQuantity")
@onready var icon_label: Label = get_node_or_null("%DetailIconLabel")
@onready var icon_border: PanelContainer = get_node_or_null("%IconBorder")

# Action Buttons
@onready var use_button: Button = get_node_or_null("%UseButton")
@onready var open_chest_button: Button = get_node_or_null("%OpenChestButton")
@onready var sell_button: Button = get_node_or_null("%SellButton")
@onready var close_button: Button = get_node_or_null("%DetailCloseButton")

var item_id: String = ""
var item_data: Dictionary = {}
var quantity: int = 0

func _ready() -> void:
	if use_button:
		use_button.pressed.connect(_on_use_pressed)
	if open_chest_button:
		open_chest_button.pressed.connect(_on_open_chest_pressed)
	if sell_button:
		sell_button.pressed.connect(_on_sell_pressed)
	if close_button:
		close_button.pressed.connect(_on_close_pressed)

func show_details(p_item_id: String, p_item_data: Dictionary, p_qty: int) -> void:
	item_id = p_item_id
	item_data = p_item_data
	quantity = p_qty
	
	visible = true
	
	if popup_name:
		popup_name.text = item_data.get("name", "Unknown Item")
	if popup_rarity:
		var rarity = item_data.get("rarity", "common").to_upper()
		popup_rarity.text = "RARITY: " + rarity
		popup_rarity.add_theme_color_override("font_color", _get_rarity_color(rarity.to_lower()))
	if popup_description:
		popup_description.text = item_data.get("description", "")
	if popup_quantity:
		popup_quantity.text = "Quantity Owned: " + str(quantity)
	if icon_label:
		icon_label.text = _get_item_emoji(item_data)
		
	# Setup icon border color
	if icon_border:
		var rarity_style = StyleBoxFlat.new()
		rarity_style.draw_center = true
		rarity_style.bg_color = Color(0.12, 0.14, 0.18, 1)
		rarity_style.border_width_left = 3
		rarity_style.border_width_top = 3
		rarity_style.border_width_right = 3
		rarity_style.border_width_bottom = 3
		rarity_style.corner_radius_top_left = 12
		rarity_style.corner_radius_top_right = 12
		rarity_style.corner_radius_bottom_right = 12
		rarity_style.corner_radius_bottom_left = 12
		rarity_style.border_color = _get_rarity_color(item_data.get("rarity", "common"))
		icon_border.add_theme_stylebox_override("panel", rarity_style)
		
	# Dynamic buttons based on item state
	var is_usable = item_data.get("usable", false)
	var is_chest = not item_data.get("chest_items", []).is_empty()
	var is_sellable = item_data.get("sellable", false)
	
	if use_button:
		use_button.visible = is_usable and not is_chest
	if open_chest_button:
		open_chest_button.visible = is_chest
	if sell_button:
		sell_button.visible = is_sellable

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

func _on_use_pressed() -> void:
	if quantity > 0:
		item_used.emit(item_id, 1)

func _on_open_chest_pressed() -> void:
	if quantity > 0:
		var rewards = item_data.get("chest_items", [])
		chest_opened.emit(item_id, rewards)

func _on_sell_pressed() -> void:
	if quantity > 0:
		var gold_val = int(item_data.get("value", 50))
		item_sold.emit(item_id, gold_val)

func _on_close_pressed() -> void:
	visible = false
	panel_closed.emit()
