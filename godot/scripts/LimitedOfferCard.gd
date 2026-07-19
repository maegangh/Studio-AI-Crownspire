extends PanelContainer

# ==========================================
# CROWNSPIRE LIMITED TIME FLASH OFFER CELL CONTROLLER
# ==========================================
# Highlights highly discounted, expiring offers (e.g. 85% OFF).
# Features integrated Monospaced countdown trackers.

signal offer_pressed(offer_data: Dictionary)

@onready var title_label: Label = %OfferTitle
@onready var discount_label: Label = %DiscountLabel
@onready var price_label: Label = %PriceLabel
@onready var currency_icon: TextureRect = %CurrencyIcon
@onready var countdown: Label = %CountdownTimer
@onready var icon_rect: TextureRect = %IconRect
@onready var buy_button: Button = %BuyButton

var offer_data: Dictionary = {}

func _ready() -> void:
	buy_button.pressed.connect(_on_buy_pressed)
	if countdown and countdown.has_signal("timer_expired"):
		countdown.timer_expired.connect(_on_timer_expired)

func init_offer(data: Dictionary) -> void:
	offer_data = data
	
	title_label.text = data.get("name", "Flash Sale")
	discount_label.text = "-%d%%" % data.get("discount_percent", 80)
	
	# Set icon if exists
	var icon_p = data.get("icon", "")
	if not icon_p.is_empty():
		icon_rect.texture = load(icon_p)
		
	# Setup countdown duration
	var duration = data.get("duration_seconds", 3600.0)
	if countdown:
		countdown.remaining_seconds = duration
		
	# Set price display
	var cost_amount = data.get("cost_amount", 0.0)
	price_label.text = String.num_int64(int(cost_amount))
	
	var cost_currency = data.get("cost_currency", "royal_crystal")
	match cost_currency:
		"royal_crystal":
			currency_icon.texture = load("res://assets/ui/icons/hud_royal_crystal.png")
		"aurora_crystal":
			currency_icon.texture = load("res://assets/ui/icons/hud_aurora_crystal.png")
		"alliance_honor":
			currency_icon.texture = load("res://assets/ui/icons/hud_alliance.png")
		"gold":
			currency_icon.texture = load("res://assets/ui/icons/hud_gold.png")

func _on_buy_pressed() -> void:
	offer_pressed.emit(offer_data)

func _on_timer_expired() -> void:
	buy_button.disabled = true
	buy_button.text = "EXPIRED"
