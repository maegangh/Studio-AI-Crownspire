extends Control

# Reusable lightweight TroopTrainingWindow for Godot 4
# Refactored to support 36 authentic troops, T1-T12, unlock checking,
# owned counts, and Train/Promote modes.

@export var troop_class: String = "infantry" # Set at runtime (infantry, marksmen, cavalry)

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

# Runtime dynamic UI elements
var parent_vbox: VBoxContainer
var tier_selector: OptionButton
var mode_selector: OptionButton
var promote_from_selector: OptionButton
var status_label: Label

# Databases
var all_troops: Array = []
var filtered_troops: Array = [] # 12 troops of selected class

# Current state
var selected_troop_index: int = 0 # Index in filtered_troops (0-11)
var is_promote_mode: bool = false
var promote_from_index: int = 0 # Index of source troop in filtered_troops
var train_count: int = 10

func _ready() -> void:
	close_button.pressed.connect(_on_close_pressed)
	train_button.pressed.connect(_on_train_pressed)
	train_slider.value_changed.connect(_on_slider_changed)
	
	# Load databases
	all_troops = load_troops_db()
	filter_troops_by_class()
	
	# Dynamically insert custom UI selectors in the VBoxContainer
	parent_vbox = get_node("PopupContainer/MarginContainer/VBoxContainer")
	setup_dynamic_ui()
	
	# Initial UI update
	update_selected_troop()

func load_troops_db() -> Array:
	var path = "res://data/troops.json"
	if not FileAccess.file_exists(path):
		push_error("Troops file not found: " + path)
		return []
	var file = FileAccess.open(path, FileAccess.READ)
	if not file:
		return []
	var text = file.get_as_text()
	file.close()
	var json = JSON.new()
	var err = json.parse(text)
	if err == OK:
		var data = json.get_data()
		if typeof(data) == TYPE_ARRAY:
			return data
	return []

func filter_troops_by_class() -> void:
	filtered_troops.clear()
	for t in all_troops:
		var type_val = t.get("troopType", t.get("type", "")).to_lower()
		if type_val == troop_class.to_lower():
			filtered_troops.append(t)
	# Sort by tier ascending
	filtered_troops.sort_custom(func(a, b): return int(a.get("tier", 1)) < int(b.get("tier", 1)))

func setup_dynamic_ui() -> void:
	# Status/Unlock indicator
	status_label = Label.new()
	status_label.horizontal_alignment = HorizontalAlignment.HORIZONTAL_ALIGNMENT_CENTER
	status_label.add_theme_font_size_override("font_size", 12)
	parent_vbox.add_child(status_label)
	parent_vbox.move_child(status_label, 3) # Put below description
	
	# Tier Selection Row
	var tier_box = HBoxContainer.new()
	var tier_lbl = Label.new()
	tier_lbl.text = "Select Tier:"
	tier_lbl.custom_minimum_size = Vector2(100, 0)
	tier_lbl.add_theme_font_size_override("font_size", 12)
	tier_box.add_child(tier_lbl)
	
	tier_selector = OptionButton.new()
	tier_selector.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	tier_selector.item_selected.connect(_on_tier_selected)
	tier_box.add_child(tier_selector)
	
	parent_vbox.add_child(tier_box)
	parent_vbox.move_child(tier_box, 2)
	
	# Mode Selection Row
	var mode_box = HBoxContainer.new()
	var mode_lbl = Label.new()
	mode_lbl.text = "Training Mode:"
	mode_lbl.custom_minimum_size = Vector2(100, 0)
	mode_lbl.add_theme_font_size_override("font_size", 12)
	mode_box.add_child(mode_lbl)
	
	mode_selector = OptionButton.new()
	mode_selector.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	mode_selector.add_item("Recruit (Train New)", 0)
	mode_selector.add_item("Promote (Upgrade Tier)", 1)
	mode_selector.item_selected.connect(_on_mode_selected)
	mode_box.add_child(mode_selector)
	
	parent_vbox.add_child(mode_box)
	parent_vbox.move_child(mode_box, 3)
	
	# Promote From Row (initially hidden)
	var from_box = HBoxContainer.new()
	from_box.name = "PromoteFromBox"
	var from_lbl = Label.new()
	from_lbl.text = "Promote From:"
	from_lbl.custom_minimum_size = Vector2(100, 0)
	from_lbl.add_theme_font_size_override("font_size", 12)
	from_box.add_child(from_lbl)
	
	promote_from_selector = OptionButton.new()
	promote_from_selector.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	promote_from_selector.item_selected.connect(_on_promote_from_selected)
	from_box.add_child(promote_from_selector)
	
	parent_vbox.add_child(from_box)
	parent_vbox.move_child(from_box, 4)
	from_box.visible = false
	
	# Populate Tiers
	rebuild_tier_selector()

func rebuild_tier_selector() -> void:
	tier_selector.clear()
	var ui = get_node_or_null("/root/UIManager")
	for idx in range(filtered_troops.size()):
		var t = filtered_troops[idx]
		var owned_count = 0
		if ui:
			owned_count = ui.call("get_owned_troop_count", t["id"])
		var locked_str = ""
		if not is_troop_unlocked(t):
			locked_str = " 🔒"
		tier_selector.add_item("T%d: %s (Owned: %d)%s" % [t["tier"], t["name"], owned_count, locked_str], idx)

func rebuild_promote_from_selector() -> void:
	promote_from_selector.clear()
	var ui = get_node_or_null("/root/UIManager")
	for idx in range(selected_troop_index):
		var t = filtered_troops[idx]
		if is_troop_unlocked(t):
			var owned_count = 0
			if ui:
				owned_count = ui.call("get_owned_troop_count", t["id"])
			promote_from_selector.add_item("T%d: %s (Owned: %d)" % [t["tier"], t["name"], owned_count], idx)

func is_troop_unlocked(troop: Dictionary) -> bool:
	var req = troop.get("unlockRequirement", "")
	if req == "":
		return true
		
	var b_id = ""
	if "Infantry Barracks" in req:
		b_id = "barracks"
	elif "Marksmen Camp" in req:
		b_id = "marksmen_camp"
	elif "Cavalry Stable" in req:
		b_id = "cavalry_stable"
		
	if b_id == "":
		return true
		
	var parts = req.split("Lv. ")
	if parts.size() < 2:
		return true
		
	var req_level = int(parts[1])
	var ui = get_node_or_null("/root/UIManager")
	if ui:
		var b_data = ui.call("get_building", b_id)
		if not b_data.is_empty():
			return int(b_data.get("level", 0)) >= req_level
			
	return false

func update_selected_troop() -> void:
	if filtered_troops.size() == 0:
		title_label.text = "NO TROOPS AVAILABLE"
		return
		
	var t = filtered_troops[selected_troop_index]
	title_label.text = ("%s (%s)" % [t["name"], troop_class]).to_upper()
	troop_desc_label.text = t["description"]
	troop_icon.text = _get_troop_icon(troop_class)
	
	var is_unlocked = is_troop_unlocked(t)
	if is_unlocked:
		status_label.text = "🟢 UNLOCKED (Requires: %s)" % t["unlockRequirement"]
		status_label.add_theme_color_override("font_color", Color(0.3, 0.85, 0.45, 1.0))
	else:
		status_label.text = "❌ LOCKED (Requires: %s)" % t["unlockRequirement"]
		status_label.add_theme_color_override("font_color", Color(0.9, 0.3, 0.3, 1.0))
		
	# Adjust slider based on mode
	var ui = get_node_or_null("/root/UIManager")
	if is_promote_mode:
		var from_box = parent_vbox.get_node("PromoteFromBox")
		from_box.visible = true
		rebuild_promote_from_selector()
		
		# Max promote is owned count of source troop
		if promote_from_selector.item_count > 0:
			var source_idx = promote_from_selector.selected
			if source_idx < 0: source_idx = 0
			var source_troop = filtered_troops[source_idx]
			var owned_source = 0
			if ui:
				owned_source = ui.call("get_owned_troop_count", source_source_id(source_idx))
			train_slider.min_value = 1
			train_slider.max_value = max(1, owned_source)
			train_slider.value = min(train_count, owned_source)
			train_slider.disabled = owned_source <= 0
		else:
			train_slider.max_value = 1
			train_slider.value = 1
			train_slider.disabled = true
	else:
		var from_box = parent_vbox.get_node("PromoteFromBox")
		from_box.visible = false
		train_slider.min_value = 1
		train_slider.max_value = 200
		train_slider.value = train_count
		train_slider.disabled = not is_unlocked
		
	_update_costs()

func source_source_id(selector_index: int) -> String:
	if selector_index >= 0 and selector_index < selected_troop_index:
		return filtered_troops[selector_index]["id"]
	return filtered_troops[0]["id"]

func _update_costs() -> void:
	train_count = int(train_slider.value)
	count_label.text = str(train_count)
	
	var ui = get_node_or_null("/root/UIManager")
	if not ui:
		return
		
	var t = filtered_troops[selected_troop_index]
	var is_unlocked = is_troop_unlocked(t)
	
	if is_promote_mode:
		if promote_from_selector.item_count == 0:
			cost_food_lbl.text = "• Cannot promote: no lower tier troops available."
			cost_wood_lbl.text = ""
			cost_iron_lbl.text = ""
			train_button.disabled = true
			return
			
		var source_idx = promote_from_selector.selected
		if source_idx < 0:
			source_idx = 0
		var source_troop = filtered_troops[source_idx]
		
		# Promotion costs = cost(target) - cost(source)
		var cost_target = t.get("trainingCost", {})
		var cost_source = source_troop.get("trainingCost", {})
		
		var diff_food = max(0, int(cost_target.get("food", 0)) - int(cost_source.get("food", 0))) * train_count
		var diff_wood = max(0, int(cost_target.get("wood", 0)) - int(cost_source.get("wood", 0))) * train_count
		var diff_iron = max(0, int(cost_target.get("iron", 0)) - int(cost_source.get("iron", 0))) * train_count
		
		_style_cost_label(cost_food_lbl, ui.food, diff_food, "Food")
		_style_cost_label(cost_wood_lbl, ui.wood, diff_wood, "Wood")
		_style_cost_label(cost_iron_lbl, ui.iron, diff_iron, "Iron")
		
		var owned_source = ui.call("get_owned_troop_count", source_troop["id"])
		var can_afford = ui.food >= diff_food and ui.wood >= diff_wood and ui.iron >= diff_iron and owned_source >= train_count and is_unlocked
		train_button.disabled = not can_afford
	else:
		var cost = t.get("trainingCost", {})
		var cost_food = int(cost.get("food", 0)) * train_count
		var cost_wood = int(cost.get("wood", 0)) * train_count
		var cost_iron = int(cost.get("iron", 0)) * train_count
		
		_style_cost_label(cost_food_lbl, ui.food, cost_food, "Food")
		_style_cost_label(cost_wood_lbl, ui.wood, cost_wood, "Wood")
		_style_cost_label(cost_iron_lbl, ui.iron, cost_iron, "Iron")
		
		var can_afford = ui.food >= cost_food and ui.wood >= cost_wood and ui.iron >= cost_iron and is_unlocked
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

func _on_tier_selected(index: int) -> void:
	selected_troop_index = index
	# If selected T1, disable promote mode
	if selected_troop_index == 0:
		is_promote_mode = false
		mode_selector.selected = 0
		mode_selector.disabled = true
	else:
		mode_selector.disabled = false
	update_selected_troop()

func _on_mode_selected(index: int) -> void:
	is_promote_mode = (index == 1)
	update_selected_troop()

func _on_promote_from_selected(index: int) -> void:
	promote_from_index = index
	_update_costs()

func _on_train_pressed() -> void:
	var ui = get_node_or_null("/root/UIManager")
	if not ui:
		return
		
	var t = filtered_troops[selected_troop_index]
	
	if is_promote_mode:
		var source_idx = promote_from_selector.selected
		if source_idx < 0:
			source_idx = 0
		var source_troop = filtered_troops[source_idx]
		
		# Diff cost
		var cost_target = t.get("trainingCost", {})
		var cost_source = source_troop.get("trainingCost", {})
		var diff_cost = {
			"food": max(0, int(cost_target.get("food", 0)) - int(cost_source.get("food", 0))),
			"wood": max(0, int(cost_target.get("wood", 0)) - int(cost_source.get("wood", 0))),
			"stone": max(0, int(cost_target.get("stone", 0)) - int(cost_source.get("stone", 0))),
			"iron": max(0, int(cost_target.get("iron", 0)) - int(cost_source.get("iron", 0)))
		}
		var power_diff = max(0, int(t.get("power", 0)) - int(source_troop.get("power", 0)))
		
		var res = ui.call("promote_authentic_troops", source_troop["id"], t["id"], train_count, diff_cost, power_diff, t["name"])
		if res.get("success", false):
			ui.call("show_toast", res.get("message", "Promotion complete!"))
			rebuild_tier_selector()
			_on_close_pressed()
		else:
			ui.call("show_toast", res.get("message", "Promotion failed: " + res.get("message", "")))
	else:
		var res = ui.call("train_authentic_troops", t["id"], train_count, t.get("trainingCost", {}), int(t.get("power", 1)), t["name"])
		if res.get("success", false):
			ui.call("show_toast", res.get("message", "Recruitment complete!"))
			rebuild_tier_selector()
			_on_close_pressed()
		else:
			ui.call("show_toast", res.get("message", "Recruitment failed: " + res.get("message", "")))

func _on_close_pressed() -> void:
	var ui = get_node_or_null("/root/UIManager")
	if ui and ui.has_method("close_popup"):
		ui.call("close_popup", self)
	else:
		queue_free()
