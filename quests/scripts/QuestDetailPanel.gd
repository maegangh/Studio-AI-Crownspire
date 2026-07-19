extends Control

# ==========================================
# CROWNSPIRE QUEST DETAILED DETAIL PANEL
# ==========================================
# Displays full backstory/narrative description, 
# dynamic list of rewards, progress details, and claim handlers.

signal claim_clicked(quest_id: String)
signal close_clicked()

@onready var title_label: Label = get_node_or_null("%TitleLabel")
@onready var desc_label: Label = get_node_or_null("%DescLabel")
@onready var progress_label: Label = get_node_or_null("%ProgressLabel")
@onready var objective_label: Label = get_node_or_null("%ObjectiveLabel")
@onready var rewards_container: HBoxContainer = get_node_or_null("%RewardsContainer")
@onready var reward_panel: PanelContainer = get_node_or_null("%RewardPanel")

@onready var claim_button: Button = get_node_or_null("%ClaimButton")
@onready var close_button: Button = get_node_or_null("%CloseButton")

var active_quest_id: String = ""

func _ready() -> void:
	if claim_button:
		claim_button.pressed.connect(_on_claim_pressed)
	if close_button:
		close_button.pressed.connect(_on_close_pressed)

func display_quest(quest_data: Dictionary) -> void:
	active_quest_id = quest_data.get("id", "")
	
	if title_label:
		title_label.text = quest_data.get("name", "Royal Proclamation")
	if desc_label:
		desc_label.text = quest_data.get("description", "A crucial request from the High Council of Crownspire Citadel.")
	if objective_label:
		objective_label.text = "Objective: " + quest_data.get("objective_desc", "Perform duties")
		
	var current = int(quest_data.get("current_progress", 0))
	var target = int(quest_data.get("target_progress", 1))
	if progress_label:
		progress_label.text = "PROGRESS: %d / %d" % [current, target]
		
	# Display rewards
	var rewards = quest_data.get("rewards", [])
	var claimed = quest_data.get("is_claimed", false)
	var completed = quest_data.get("is_completed", false) or (current >= target)
	
	if rewards_container:
		# Clear existing nodes
		for child in rewards_container.get_children():
			child.queue_free()
			
		if rewards.size() > 0:
			if reward_panel:
				reward_panel.visible = true
				
			for reward in rewards:
				var box = VBoxContainer.new()
				box.custom_minimum_size = Vector2(80, 80)
				box.size_flags_horizontal = SIZE_EXPAND_FILL
				
				var icon_lbl = Label.new()
				icon_lbl.text = reward.get("icon", "📦")
				icon_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
				
				var name_lbl = Label.new()
				name_lbl.text = reward.get("name", "Resource")
				name_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
				
				var qty_lbl = Label.new()
				qty_lbl.text = "x" + String.num_int64(reward.get("quantity", 1))
				qty_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
				qty_lbl.modulate = Color(1.0, 0.84, 0.0) # Gold
				
				box.add_child(icon_lbl)
				box.add_child(name_lbl)
				box.add_child(qty_lbl)
				rewards_container.add_child(box)
		else:
			if reward_panel:
				reward_panel.visible = false

	# State of claim button
	if claim_button:
		if completed:
			claim_button.visible = true
			if claimed:
				claim_button.disabled = true
				claim_button.text = "REWARD CLAIMED"
			else:
				claim_button.disabled = false
				claim_button.text = "CLAIM REWARDS"
		else:
			claim_button.visible = false # Not completed yet, can't claim

func _on_claim_pressed() -> void:
	claim_clicked.emit(active_quest_id)

func _on_close_pressed() -> void:
	close_clicked.emit()
