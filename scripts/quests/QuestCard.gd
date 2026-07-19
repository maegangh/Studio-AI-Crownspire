extends PanelContainer
class_name QuestCard

# ==========================================
# CROWNSPIRE QUEST CARD SUMMARY LIST ITEM
# ==========================================

signal quest_selected(quest_id: String)
signal quest_action_pressed(quest_id: String, action_type: String)

@onready var title_label: Label = %TitleLabel if has_node("%TitleLabel") else get_node_or_null("Margin/HBox/VBox/TitleLabel")
@onready var desc_label: Label = %DescLabel if has_node("%DescLabel") else get_node_or_null("Margin/HBox/VBox/DescLabel")
@onready var pin_button: Button = %PinButton if has_node("%PinButton") else get_node_or_null("Margin/HBox/PinButton")
@onready var points_label: Label = %PointsLabel if has_node("%PointsLabel") else get_node_or_null("Margin/HBox/VBox/ProgressHBox/PointsLabel")
@onready var progress_bar: ProgressBar = %ProgressBar if has_node("%ProgressBar") else get_node_or_null("Margin/HBox/VBox/ProgressHBox/ProgressBar")
@onready var progress_label: Label = %ProgressLabel if has_node("%ProgressLabel") else get_node_or_null("Margin/HBox/VBox/ProgressHBox/ProgressLabel")
@onready var action_button: Button = %ActionButton if has_node("%ActionButton") else get_node_or_null("Margin/HBox/ActionButton")
@onready var gift_icon: Label = %GiftIcon if has_node("%GiftIcon") else get_node_or_null("Margin/HBox/GiftIcon")

var quest_data: Dictionary = {}

func _ready() -> void:
	if pin_button:
		pin_button.pressed.connect(_on_pin_pressed)
	if action_button:
		action_button.pressed.connect(_on_action_pressed)
		
	# Clicking anywhere on the card opens detailed view
	gui_input.connect(_on_gui_input)

func populate_card(data: Dictionary) -> void:
	quest_data = data
	
	if title_label:
		title_label.text = data.get("name", "Royal Dispatch")
		
	if desc_label:
		# Auto-truncate description if too long
		var d = data.get("description", "")
		if d.length() > 64:
			d = d.substr(0, 60) + "..."
		desc_label.text = d
		
	if points_label:
		points_label.text = "+%d PTS" % int(data.get("quest_points", 15))
		
	# Process pin state
	_update_pin_button_visuals()
	
	# Process progress (consolidating multiple objectives if present)
	var objectives = data.get("objectives", []) as Array
	var total_current = 0
	var total_target = 0
	
	for obj in objectives:
		total_current += int(obj.get("current", 0))
		total_target += int(obj.get("target", 1))
		
	if total_target == 0:
		total_target = 1
		
	if progress_bar:
		progress_bar.max_value = total_target
		progress_bar.value = total_current
		
	if progress_label:
		# If single objective, show description. If multi, show overall count
		if objectives.size() == 1:
			var obj = objectives[0] as Dictionary
			progress_label.text = "%s (%d/%d)" % [obj.get("description", "Progress"), int(obj.get("current", 0)), int(obj.get("target", 1))]
		else:
			progress_label.text = "Objectives: %d/%d completed" % [_get_completed_objectives_count(objectives), objectives.size()]
			
	# Process Action/Claim buttons and states
	_update_state_visuals()

func _get_completed_objectives_count(objs: Array) -> int:
	var count = 0
	for o in objs:
		if o.get("completed", false):
			count += 1
	return count

func _update_pin_button_visuals() -> void:
	if not pin_button:
		return
		
	if quest_data.get("is_pinned", false):
		pin_button.text = "⭐" # Golden star
		pin_button.modulate = Color(1.0, 0.85, 0.3, 1.0)
	else:
		pin_button.text = "☆" # Empty star
		pin_button.modulate = Color(0.6, 0.65, 0.7, 1.0)

func _update_state_visuals() -> void:
	if not action_button:
		return
		
	# Reset connections so they don't stack
	if action_button.pressed.is_connected(_on_action_pressed):
		action_button.pressed.disconnect(_on_action_pressed)
	action_button.pressed.connect(_on_action_pressed)
	
	# Reset styles
	action_button.disabled = false
	action_button.modulate = Color(1, 1, 1, 1)
	
	var is_completed = quest_data.get("is_completed", false)
	var is_claimed = quest_data.get("is_claimed", false)
	
	if gift_icon:
		gift_icon.visible = !is_claimed and quest_data.get("rewards", []).size() > 0
		
	if is_claimed:
		action_button.text = "CLAIMED"
		action_button.disabled = true
		action_button.modulate = Color(0.4, 0.4, 0.4, 1.0)
		modulate = Color(0.6, 0.6, 0.6, 0.8) # Grayed out card
	elif is_completed:
		action_button.text = "CLAIM"
		_set_button_style(action_button, "claim")
		modulate = Color(1, 1, 1, 1)
	else:
		action_button.text = quest_data.get("action_label", "GO")
		_set_button_style(action_button, "go")
		modulate = Color(1, 1, 1, 1)

func _set_button_style(btn: Button, style_type: String) -> void:
	var sb = StyleBoxFlat.new()
	sb.corner_radius_top_left = 6
	sb.corner_radius_top_right = 6
	sb.corner_radius_bottom_right = 6
	sb.corner_radius_bottom_left = 6
	sb.border_width_left = 1
	sb.border_width_right = 1
	sb.border_width_top = 1
	sb.border_width_bottom = 1
	
	if style_type == "claim":
		sb.bg_color = Color(0.12, 0.28, 0.18, 1.0)
		sb.border_color = Color(0.2, 0.6, 0.35, 1.0)
		btn.add_theme_color_override("font_color", Color(0.4, 1.0, 0.6, 1.0))
	else:
		sb.bg_color = Color(0.14, 0.18, 0.26, 1.0)
		sb.border_color = Color(0.25, 0.45, 0.7, 1.0)
		btn.add_theme_color_override("font_color", Color(0.5, 0.85, 1.0, 1.0))
		
	btn.add_theme_stylebox_override("normal", sb)

func _on_pin_pressed() -> void:
	# Avoid triggering click input on card itself
	get_viewport().set_input_as_handled()
	
	if QuestManager:
		var pinned = QuestManager.toggle_pin(quest_data["id"])
		quest_data["is_pinned"] = pinned
		_update_pin_button_visuals()

func _on_action_pressed() -> void:
	get_viewport().set_input_as_handled()
	
	var is_completed = quest_data.get("is_completed", false)
	var is_claimed = quest_data.get("is_claimed", false)
	
	if is_claimed:
		return
		
	if is_completed:
		# Claim rewards instantly!
		if QuestManager:
			var rewards = QuestManager.claim_rewards(quest_data["id"])
			quest_data["is_claimed"] = true
			_update_state_visuals()
	else:
		# Trigger action redirect / helper
		quest_action_pressed.emit(quest_data["id"], quest_data.get("action_label", "GO"))

func _on_gui_input(event: InputEvent) -> void:
	if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
		quest_selected.emit(quest_data["id"])
