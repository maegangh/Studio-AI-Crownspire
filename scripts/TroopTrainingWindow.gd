extends Control

# Reusable lightweight TroopTrainingWindow for Godot 4

@export var troop_id: String = "legionary" # legionary, bowman, or cataphract

@onready var title_label: Label = %TitleLabel
@onready var troop_desc_label: Label = %TroopDescLabel
@onready var troop_icon: Label = %TroopIcon
@onready var cost_food_lbl: Label = %CostFood
@onready var cost_wood_lbl: Label = %CostWood
@onready var cost_iron_lbl: Label = %CostIron
@onready var train_slider: HSlider = %TrainSlider
@onready var count_label: Label = %CountLabel
@onready var train_button: Button = %TrainButton
@onready var close_button: Button = %CloseButton

var troop_data: Dictionary = {}
var train_count: int = 10

func _ready() -> void:
	close_button.pressed.connect(_on_close_pressed)
	train_button.pressed.connect(_on_train_pressed)
	train_slider.value_changed.connect(_on_slider_changed)
	
	load_troop_data()

func load_troop_data() -> void:
	var ui = get_node_or_null("/root/UIManager")
	if not ui:
		return
		
	var barracks_ref = ui.call("get_building", "barracks")
	for t in barracks_ref.get("troop_types", []):
		if t["id"] == troop_id:
			troop_data = t
			break
			
	if troop_data.is_empty():
		# Fallback
		var name_val = "Emerald Legionary"
		var desc_val = "Heavy shield-bearing line-infantry trained for iron wall battle formations."
		var food_val = 80
		var wood_val = 20
		var iron_val = 0
		
		if troop_id == "bowman":
			name_val = "Wind-Runner Bowman"
			desc_val = "Agile marksmen capable of striking targets from castle turrets with composite longbows."
			food_val = 50
			wood_val = 50
		elif troop_id == "cataphract":
			name_val = "Gilded Cataphract"
			desc_val = "Heavy cavalrymen clad in segmented plate armor capable of devastating charges."
			food_val = 150
			wood_val = 80
			iron_val = 50
			
		troop_data = {
			"id": troop_id,
			"name": name_val,
			"description": desc_val,
			"cost_food": food_val,
			"cost_wood": wood_val,
			"cost_iron": iron_val,
			"power_rating": 4
		}
		
	title_label.text = "TRAIN %s" % troop_data["name"].to_upper()
	troop_desc_label.text = troop_data["description"]
	troop_icon.text = _get_troop_icon(troop_id)
	
	train_slider.min_value = 1
	train_slider.max_value = 200
	train_slider.value = train_count
	
	_update_costs()

func _get_troop_icon(t_id: String) -> String:
	match t_id:
		"legionary": return "🛡️"
		"bowman": return "🏹"
		"cataphract": return "🐎"
		_: return "⚔️"

func _update_costs() -> void:
	count_label.text = str(train_count)
	
	var ui = get_node_or_null("/root/UIManager")
	if not ui:
		return
		
	var cost_food = int(troop_data.get("cost_food", 0)) * train_count
	var cost_wood = int(troop_data.get("cost_wood", 0)) * train_count
	var cost_iron = int(troop_data.get("cost_iron", 0)) * train_count
	
	_style_cost_label(cost_food_lbl, ui.food, cost_food, "Food")
	_style_cost_label(cost_wood_lbl, ui.wood, cost_wood, "Wood")
	_style_cost_label(cost_iron_lbl, ui.iron, cost_iron, "Iron")
	
	# Enable/Disable train button
	var can_afford = ui.food >= cost_food and ui.wood >= cost_wood and ui.iron >= cost_iron
	train_button.disabled = not can_afford

func _style_cost_label(lbl: Label, player_amt: int, req_amt: int, res_name: String) -> void:
	if req_amt <= 0:
		lbl.text = "• %s Cost: None" % res_name
		lbl.add_theme_color_override("font_color", Color(0.7, 0.8, 0.9, 0.6))
	else:
		lbl.text = "• %s: %s / %s" % [res_name, _format_large_number(player_amt), _format_large_number(req_amt)]
		if player_amt >= req_amt:
			lbl.add_theme_color_override("font_color", Color(0.3, 0.85, 0.45, 1.0))
		else:
			lbl.add_theme_color_override("font_color", Color(0.9, 0.3, 0.3, 1.0))

func _format_large_number(n: int) -> String:
	if n >= 1000000:
		return "%.1fM" % (float(n) / 1000000.0)
	elif n >= 1000:
		return "%.1fK" % (float(n) / 1000.0)
	return str(n)

func _on_slider_changed(value: float) -> void:
	train_count = int(value)
	_update_costs()

func _on_train_pressed() -> void:
	var ui = get_node_or_null("/root/UIManager")
	if ui and ui.has_method("train_barracks_troops"):
		var res = ui.call("train_barracks_troops", troop_id, train_count)
		if res.get("success", false):
			ui.call("show_toast", res.get("message", "Recruitment complete!"))
			_on_close_pressed()
		else:
			ui.call("show_toast", res.get("message", "Recruitment failed."))

func _on_close_pressed() -> void:
	var ui = get_node_or_null("/root/UIManager")
	if ui and ui.has_method("close_popup"):
		ui.call("close_popup", self)
	else:
		queue_free()
