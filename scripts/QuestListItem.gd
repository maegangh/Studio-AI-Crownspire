extends PanelContainer

# ==========================================
# CROWNSPIRE QUEST LIST ITEM CONTROLLER
# ==========================================
# Modular display of daily missions (Login, Troop training, Resource collection).
# Features custom progress metrics, active action triggers (CLAIM, GO),
# and rewards items visually on completing.

signal quest_button_pressed(quest_id: String, action: String)

@onready var title_label: Label = %QuestTitle
@onready var desc_label: Label = %QuestDesc
@onready var points_badge: Label = %PointsBadge
@onready var progress_bar: ProgressBar = %ProgressBar
@onready var progress_label: Label = %ProgressLabel
@onready var action_button: Button = %ActionButton
@onready var reward_icon: TextureRect = %RewardIcon
@onready var reward_qty: Label = %RewardQty

var quest_data: Dictionary = {}

func _ready() -> void:
	action_button.pressed.connect(_on_action_pressed)
	UIManager.quest_progress_updated.connect(_on_progress_updated)

func init_quest(data: Dictionary) -> void:
	quest_data = data
	
	title_label.text = data.get("name", "Royal Deed")
	desc_label.text = data.get("description", "Serve the empire to earn favor.")
	points_badge.text = "+%d PTS" % data.get("quest_points", 10)
	
	# Display first reward as visual badge
	var rewards = data.get("rewards", [])
	if not rewards.is_empty():
		var first_reward = rewards[0]
		reward_qty.text = "x" + String.num_int64(int(first_reward.get("quantity", 1)))
		# Safely load reward icon
		var icon_path = first_reward.get("icon", "")
		if not icon_path.is_empty():
			reward_icon.texture = load(icon_path)
			
	_update_state_display()

func _update_state_display() -> void:
	if quest_data.is_empty():
		return
		
	var current = quest_data.get("current_progress", 0)
	var target = quest_data.get("target_progress", 1)
	var completed = quest_data.get("is_completed", false)
	var claimed = quest_data.get("is_claimed", false)
	
	progress_bar.max_value = target
	progress_bar.value = current
	progress_label.text = "%s / %s" % [_format_num(current), _format_num(target)]
	
	# Dynamic Button Setup
	if claimed:
		action_button.text = "CLAIMED"
		action_button.disabled = true
		action_button.modulate = Color(1, 1, 1, 0.4)
	elif completed:
		action_button.text = "CLAIM"
		action_button.disabled = false
		action_button.modulate = Color(1.0, 1.0, 1.0, 1.0)
		_apply_pulse_style()
	else:
		action_button.text = quest_data.get("action_label", "GO")
		action_button.disabled = false
		action_button.modulate = Color(1.0, 1.0, 1.0, 1.0)

func _format_num(val: float) -> String:
	if val >= 1000000.0:
		return "%.1fM" % (val / 1000000.0)
	elif val >= 1000.0:
		return "%.1fK" % (val / 1000.0)
	return String.num_int64(int(val))

func _apply_pulse_style() -> void:
	var tween = create_tween().set_loops()
	tween.tween_property(action_button, "self_modulate", Color(1.2, 1.2, 0.8), 0.5)
	tween.tween_property(action_button, "self_modulate", Color(1.0, 1.0, 1.0), 0.5)

func _on_progress_updated(quest_id: String, new_progress: int) -> void:
	if quest_data.get("id", "") == quest_id:
		quest_data["current_progress"] = new_progress
		if new_progress >= quest_data.get("target_progress", 1):
			quest_data["is_completed"] = true
		_update_state_display()

func _on_action_pressed() -> void:
	var quest_id = quest_data.get("id", "")
	var is_completed = quest_data.get("is_completed", false)
	
	if is_completed:
		# Claim rewards!
		UIManager.claim_quest_reward(quest_id)
		quest_data["is_claimed"] = true
		_update_state_display()
		quest_button_pressed.emit(quest_id, "CLAIM")
	else:
		# Simulate progression action!
		var step = int(quest_data.get("target_progress", 1) * 0.25)
		if step < 1:
			step = 1
		UIManager.add_quest_progress(quest_id, step)
		quest_button_pressed.emit(quest_id, "GO")
