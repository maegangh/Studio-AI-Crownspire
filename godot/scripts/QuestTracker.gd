extends PanelContainer

# ==========================================
# CROWNSPIRE AUTO-TRACKING QUEST OVERLAY
# ==========================================
# Dynamically pinpoints the player's primary unfinished mission.
# Guides gameplay by providing inline progress tallies and shortcut actions.

@onready var title_lbl: Label = %QuestTitle
@onready var progress_lbl: Label = %ProgressLabel
@onready var progress_bar: ProgressBar = %ProgressBar
@onready var action_btn: Button = %ActionBtn

var tracking_quest_id: String = ""

func _ready() -> void:
	UIManager.quest_progress_updated.connect(_on_quest_updated)
	UIManager.quest_completed.connect(func(_qid): _refresh_tracker())
	UIManager.quest_reward_claimed.connect(func(_qid, _r): _refresh_tracker())
	_refresh_tracker()
	action_btn.pressed.connect(_on_action_pressed)
	
	# Tap background to open comprehensive Quest Screen overlay
	gui_input.connect(_on_gui_input)

func _on_gui_input(event: InputEvent) -> void:
	if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
		var quest_screen = load("res://scenes/quests/QuestScreen.tscn")
		if quest_screen:
			UIManager.open_popup(quest_screen)

func _refresh_tracker() -> void:
	var quests = UIManager.get_all_quests()
	var active_quest: Dictionary = {}
	
	# Find first incomplete/unclaimed quest
	for q in quests:
		if not q.get("is_claimed", false):
			active_quest = q
			break
			
	if active_quest.is_empty():
		# Fallback if all quests are fully cleared!
		title_lbl.text = "Sovereign Peace"
		progress_lbl.text = "All deeds completed!"
		progress_bar.max_value = 1
		progress_bar.value = 1
		action_btn.text = "COMPLETED"
		action_btn.disabled = true
		tracking_quest_id = ""
		return

	tracking_quest_id = active_quest.get("id", "")
	title_lbl.text = active_quest.get("name", "Royal Deed")
	
	var current = active_quest.get("current_progress", 0)
	var target = active_quest.get("target_progress", 1)
	var completed = active_quest.get("is_completed", false)
	
	progress_bar.max_value = target
	progress_bar.value = current
	progress_lbl.text = "%s/%s" % [_format_num(current), _format_num(target)]
	
	if completed:
		action_btn.text = "CLAIM"
		action_btn.disabled = false
		_apply_glowing_text(action_btn)
	else:
		action_btn.text = active_quest.get("action_label", "GO")
		action_btn.disabled = false
		action_btn.self_modulate = Color(1, 1, 1, 1)

func _format_num(val: float) -> String:
	if val >= 1000000.0:
		return "%.1fM" % (val / 1000000.0)
	elif val >= 1000.0:
		return "%.1fK" % (val / 1000.0)
	return String.num_int64(int(val))

func _apply_glowing_text(node: Control) -> void:
	var tween = create_tween().set_loops()
	tween.tween_property(node, "self_modulate", Color(1.2, 1.2, 0.8), 0.5)
	tween.tween_property(node, "self_modulate", Color(1.0, 1.0, 1.0), 0.5)

func _on_quest_updated(quest_id: String, _new_progress: int) -> void:
	if quest_id == tracking_quest_id:
		_refresh_tracker()

func _on_action_pressed() -> void:
	if tracking_quest_id.is_empty():
		return
		
	var quests = UIManager.get_all_quests()
	var q_data: Dictionary = {}
	for q in quests:
		if q["id"] == tracking_quest_id:
			q_data = q
			break
			
	if q_data.is_empty():
		return
		
	if q_data.get("is_completed", false):
		# Claim directly from the tracker!
		UIManager.claim_quest_reward(tracking_quest_id)
	else:
		# Simulate progress step
		var step = int(q_data.get("target_progress", 1) * 0.25)
		if step < 1: step = 1
		UIManager.add_quest_progress(tracking_quest_id, step)
