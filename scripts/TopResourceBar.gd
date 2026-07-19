extends PanelContainer

# ==========================================
# CROWNSPIRE TOP RESOURCE BAR CONTROLLER
# ==========================================
# Displays basic strategy building resources (Food, Wood, Stone, Iron)
# and premium gold/crystals dynamically in a compact top bar.
# Utilizes numeric lerping and alert pulses on value updates.

@onready var food_lbl: Label = %FoodLabel
@onready var wood_lbl: Label = %WoodLabel
@onready var stone_lbl: Label = %StoneLabel
@onready var iron_lbl: Label = %IronLabel

# Resource state tracking for lerp
var current_food: float = 0.0
var target_food: float = 0.0

var current_wood: float = 0.0
var target_wood: float = 0.0

var current_stone: float = 0.0
var target_stone: float = 0.0

var current_iron: float = 0.0
var target_iron: float = 0.0

var lerp_speed: float = 8.0

func _ready() -> void:
	UIManager.currency_changed.connect(_on_resource_updated)
	_sync_with_current_balances()

func _process(delta: float) -> void:
	var updated := false
	if current_food != target_food:
		current_food = lerp(current_food, target_food, lerp_speed * delta)
		if abs(current_food - target_food) < 1.0: current_food = target_food
		food_lbl.text = _format_num(current_food)
		updated = true
		
	if current_wood != target_wood:
		current_wood = lerp(current_wood, target_wood, lerp_speed * delta)
		if abs(current_wood - target_wood) < 1.0: current_wood = target_wood
		wood_lbl.text = _format_num(current_wood)
		updated = true

	if current_stone != target_stone:
		current_stone = lerp(current_stone, target_stone, lerp_speed * delta)
		if abs(current_stone - target_stone) < 1.0: current_stone = target_stone
		stone_lbl.text = _format_num(current_stone)
		updated = true

	if current_iron != target_iron:
		current_iron = lerp(current_iron, target_iron, lerp_speed * delta)
		if abs(current_iron - target_iron) < 1.0: current_iron = target_iron
		iron_lbl.text = _format_num(current_iron)
		updated = true

func _sync_with_current_balances() -> void:
	target_food = UIManager.food
	current_food = target_food
	food_lbl.text = _format_num(current_food)

	target_wood = UIManager.wood
	current_wood = target_wood
	wood_lbl.text = _format_num(current_wood)

	target_stone = UIManager.stone
	current_stone = target_stone
	stone_lbl.text = _format_num(current_stone)

	target_iron = UIManager.iron
	current_iron = target_iron
	iron_lbl.text = _format_num(current_iron)

func _format_num(val: float) -> String:
	if val >= 1000000.0:
		return "%.1fM" % (val / 1000000.0)
	elif val >= 1000.0:
		return "%.1fK" % (val / 1000.0)
	return String.num_int64(int(val))

func _on_resource_updated(type: String, new_amount: float) -> void:
	match type:
		"food":
			target_food = new_amount
			_pulse_node(food_lbl)
		"wood":
			target_wood = new_amount
			_pulse_node(wood_lbl)
		"stone":
			target_stone = new_amount
			_pulse_node(stone_lbl)
		"iron":
			target_iron = new_amount
			_pulse_node(iron_lbl)

func _pulse_node(node: Control) -> void:
	var tween = create_tween()
	tween.tween_property(node, "scale", Vector2(1.2, 1.2), 0.15)
	tween.tween_property(node, "scale", Vector2(1.0, 1.0), 0.15)
