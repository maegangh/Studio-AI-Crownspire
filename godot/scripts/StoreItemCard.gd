extends PanelContainer

# ==========================================
# CROWNSPIRE SINGLE ITEM SHOP CARD CONTROLLER
# ==========================================
# Modular card displaying standard resources, speedups, or currency packs.
# Controls purchase limits, rarity borders, and opens confirming panels.

signal card_pressed(item_data: Dictionary)

@onready var item_name_label: Label = %ItemName
@onready var icon_rect: TextureRect = %IconRect
@onready var limit_label: Label = %LimitLabel
@onready var price_label: Label = %PriceLabel
@onready var currency_icon: TextureRect = %CurrencyIcon
@onready var border_rect: PanelContainer = %BorderRect
@onready var buy_button: Button = %BuyButton

var item_data: Dictionary = {}

func _ready() -> void:
	buy_button.pressed.connect(_on_buy_pressed)
	_update_limit_display()

func init_card(data: Dictionary) -> void:
	item_data = data
	
	item_name_label.text = data.get("name", "Royal Loot")
	
	var icon_path: String = data.get("icon_path", "")
	if not icon_path.is_empty():
		icon_rect.texture = load(icon_path)
		
	_set_rarity_style(data.get("rarity", 0))
	_set_price_style(data.get("cost_currency", "royal_crystal"), data.get("cost_amount", 0.0))
	_update_limit_display()

func _set_rarity_style(rarity: int) -> void:
	var color_val := Color(0.29, 0.33, 0.39) # Gray
	match rarity:
		1: color_val = Color(0.0, 0.82, 1.0)      # Rare blue
		2: color_val = Color(0.82, 0.0, 1.0)      # Epic purple
		3: color_val = Color(1.0, 0.84, 0.0)      # Legendary gold
		4: color_val = Color(0.93, 0.26, 0.26)     # Mythic red
		
	border_rect.modulate = color_val

func _set_price_style(cost_currency: String, cost_amount: float) -> void:
	if cost_currency == "usd":
		price_label.text = "$%.2f" % cost_amount
		currency_icon.visible = false
	else:
		price_label.text = String.num_int64(int(cost_amount))
		currency_icon.visible = true
		match cost_currency:
			"royal_crystal":
				currency_icon.texture = load("res://assets/ui/icons/hud_royal_crystal.png")
			"aurora_crystal":
				currency_icon.texture = load("res://assets/ui/icons/hud_aurora_crystal.png")
			"alliance_honor":
				currency_icon.texture = load("res://assets/ui/icons/hud_alliance.png")
			"gold":
				currency_icon.texture = load("res://assets/ui/icons/hud_gold.png")

func _update_limit_display() -> void:
	if item_data.is_empty():
		return
		
	var limit = item_data.get("purchase_limit", -1)
	if limit == -1:
		limit_label.text = "UNLIMITED"
		buy_button.disabled = false
	else:
		var current = item_data.get("current_purchases", 0)
		limit_label.text = "LIMIT: %d/%d" % [current, limit]
		if current >= limit:
			buy_button.disabled = true
			buy_button.text = "SOLD OUT"
		else:
			buy_button.disabled = false

func _on_buy_pressed() -> void:
	card_pressed.emit(item_data)
