extends PanelContainer

# ==========================================
# CROWNSPIRE SHOP ITEM SINGLE CARD CONTROLLER
# ==========================================
# Highlights sales bonuses, item details, price formatting,
# and triggers confirmation triggers.

signal card_pressed(item_data: Dictionary)

@onready var item_name_label: Label = get_node_or_null("%ItemName")
@onready var price_label: Label = get_node_or_null("%PriceLabel")
@onready var bonus_badge: Label = get_node_or_null("%BonusBadge")
@onready var best_seller_badge: PanelContainer = get_node_or_null("%BestSellerBadge")
@onready var buy_button: Button = get_node_or_null("%BuyButton")

var card_data: Dictionary = {}

func _ready() -> void:
	if buy_button:
		buy_button.pressed.connect(_on_buy_pressed)
	if bonus_badge:
		bonus_badge.visible = false
	if best_seller_badge:
		best_seller_badge.visible = false

func init_card(data: Dictionary) -> void:
	card_data = data
	
	if item_name_label:
		item_name_label.text = data.get("name", "Royal Loot")
		
	# Format localized costs
	_format_price(data.get("cost_currency", "USD"), data.get("cost_amount", 0.0))
	
	# Determine if we display sales multipliers
	var bonus = data.get("bonus_percent", 0)
	var discount = data.get("discount_percent", 0)
	
	if bonus_badge:
		if discount > 0:
			bonus_badge.text = "-%d%%" % discount
			bonus_badge.visible = true
			bonus_badge.modulate = Color(0.93, 0.26, 0.26) # Red for discounts
		elif bonus > 0:
			bonus_badge.text = "+%d%% BONUS" % bonus
			bonus_badge.visible = true
			bonus_badge.modulate = Color(0.0, 0.82, 1.0) # Cyan for bonuses
		else:
			bonus_badge.visible = false
			
	if best_seller_badge:
		best_seller_badge.visible = data.get("is_best_seller", false)

func _format_price(currency: String, amount: float) -> void:
	if not price_label:
		return
		
	if currency.to_lower() == "usd":
		price_label.text = "$%.2f" % amount
	elif currency.to_lower() == "crystals":
		price_label.text = "%d Crystals" % int(amount)
	elif currency.to_lower() == "alliance_honor":
		price_label.text = "%d Honor" % int(amount)
	else:
		price_label.text = "%s %d" % [currency.to_upper(), int(amount)]

func _on_buy_pressed() -> void:
	card_pressed.emit(card_data)
