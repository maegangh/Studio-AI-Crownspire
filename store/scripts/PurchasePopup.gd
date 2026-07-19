extends Control

# ==========================================
# CROWNSPIRE SHOP PURCHASE CONFIRMATION MODAL
# ==========================================
# Facilitates confirmations, transaction pipelines,
# and displays direct visual logs of purchase success.

@onready var title_label: Label = get_node_or_null("%TitleLabel")
@onready var desc_label: Label = get_node_or_null("%DescLabel")
@onready var cost_label: Label = get_node_or_null("%CostLabel")
@onready var buy_button: Button = get_node_or_null("%BuyButton")
@onready var close_button: Button = get_node_or_null("%CloseButton")
@onready var status_label: Label = get_node_or_null("%StatusLabel")

var item_id: String = ""
var cost_currency: String = "USD"
var cost_amount: float = 0.0

func _ready() -> void:
	if buy_button:
		buy_button.pressed.connect(_on_buy_pressed)
	if close_button:
		close_button.pressed.connect(_on_close_pressed)
		
	if status_label:
		status_label.text = ""
		status_label.visible = false

func init_popup(p_item_id: String, p_title: String, p_desc: String, p_cost_currency: String, p_cost_amount: float) -> void:
	item_id = p_item_id
	cost_currency = p_cost_currency
	cost_amount = p_cost_amount
	
	if title_label:
		title_label.text = p_title
	if desc_label:
		desc_label.text = p_desc
		
	_format_price(p_cost_currency, p_cost_amount)

func _format_price(currency: String, amount: float) -> void:
	if not cost_label:
		return
		
	if currency.to_lower() == "usd":
		cost_label.text = "CONFIRM PURCHASE FOR $%.2f" % amount
	elif currency.to_lower() == "crystals":
		cost_label.text = "CONFIRM PURCHASE FOR %d Crystals" % int(amount)
	elif currency.to_lower() == "alliance_honor":
		cost_label.text = "CONFIRM PURCHASE FOR %d Honor" % int(amount)
	else:
		cost_label.text = "CONFIRM PURCHASE FOR %s %d" % [currency.to_upper(), int(amount)]

func _on_buy_pressed() -> void:
	if buy_button:
		buy_button.disabled = true
		
	if status_label:
		status_label.text = "PROCESSING..."
		status_label.visible = true
		status_label.add_theme_color_override("font_color", Color(1.0, 0.84, 0.0))
		
	# Try to execute through UIManager if active
	var global_ui = get_node_or_null("/root/UIManager")
	if global_ui and global_ui.has_method("attempt_purchase"):
		# Let the manager process state and send global signals
		global_ui.attempt_purchase(item_id, cost_currency, cost_amount)
		await get_tree().create_timer(0.6).timeout
		queue_free()
	else:
		# Standalone sandbox simulation
		await get_tree().create_timer(0.8).timeout
		_simulate_success()

func _simulate_success() -> void:
	if status_label:
		status_label.text = "PURCHASE SUCCESSFUL!"
		status_label.add_theme_color_override("font_color", Color(0.0, 0.82, 1.0))
		
	await get_tree().create_timer(0.8).timeout
	queue_free()

func _on_close_pressed() -> void:
	queue_free()
