extends Control

# ==========================================
# CROWNSPIRE TRANSACTION CONFIRMATION POPUP
# ==========================================
# Dialog for players confirming intent to purchase.
# Disables buttons during flight, and handles success/error reporting.

@onready var title_label: Label = %TitleLabel
@onready var desc_label: Label = %Desc_Label
@onready var item_icon: TextureRect = %ItemIcon
@onready var rarity_backing: PanelContainer = %RarityBacking
@onready var cost_label: Label = %CostLabel
@onready var currency_icon: TextureRect = %CurrencyIcon
@onready var buy_button: Button = %BuyButton
@onready var close_button: TextureButton = %CloseButton
@onready var error_label: Label = %ErrorLabel
@onready var anim_player: AnimationPlayer = $AnimationPlayer

var item_id: String = ""
var cost_currency: String = "royal_crystal"
var cost_amount: float = 0.0

func _ready() -> void:
	# Clean error message initially
	error_label.text = ""
	error_label.visible = false
	
	# Connect local buttons
	buy_button.pressed.connect(_on_buy_pressed)
	close_button.pressed.connect(_on_close_pressed)
	
	# Connect to global transactions feedback
	UIManager.purchase_completed.connect(_on_purchase_completed)

func init_popup(p_item_id: String, p_title: String, p_desc: String, p_icon_path: String, p_cost_currency: String, p_cost_amount: float, p_rarity: int) -> void:
	item_id = p_item_id
	cost_currency = p_cost_currency
	cost_amount = p_cost_amount
	
	title_label.text = p_title
	desc_label.text = p_desc
	
	if not p_icon_path.is_empty():
		item_icon.texture = load(p_icon_path)
		
	_set_rarity_style(p_rarity)
	_set_cost_visual()

func _set_rarity_style(rarity: int) -> void:
	# Define border and glow styling mimicking CSS Rarity borders
	var color_val := Color(0.29, 0.33, 0.39) # Gray common default
	match rarity:
		1: color_val = Color(0.0, 0.82, 1.0)      # Rare blue
		2: color_val = Color(0.82, 0.0, 1.0)      # Epic purple
		3: color_val = Color(1.0, 0.84, 0.0)      # Legendary gold
		4: color_val = Color(0.93, 0.26, 0.26)     # Mythic red
	
	# Apply modulation color onto rarity frame
	rarity_backing.modulate = color_val

func _set_cost_visual() -> void:
	if cost_currency == "usd":
		cost_label.text = "$%.2f" % cost_amount
		currency_icon.visible = false
	else:
		cost_label.text = String.num_int64(int(cost_amount))
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

func _on_buy_pressed() -> void:
	error_label.text = ""
	error_label.visible = false
	buy_button.disabled = true
	
	# Send call to centralized transaction logic
	UIManager.attempt_purchase(item_id, cost_currency, cost_amount)

func _on_purchase_completed(completed_id: String, success: bool, message: String) -> void:
	if completed_id != item_id:
		return
		
	if success:
		# Auto-dismiss on success (UIManager handles reward presentation popup)
		UIManager.close_popup(self)
	else:
		buy_button.disabled = false
		error_label.text = message.to_upper()
		error_label.visible = true
		if anim_player and anim_player.has_animation("error_shake"):
			anim_player.play("error_shake")

func _on_close_pressed() -> void:
	UIManager.close_popup(self)
