extends PanelContainer

# ==========================================
# CROWNSPIRE QUEST LIST CARD CONTROLLER
# ==========================================
# Manages individual quest progress displays, pin badges, 
# point counters, and status action clicks.

signal item_selected(quest_data: Dictionary)
signal pin_toggled(quest_id: String, is_pinned: bool)
signal claim_clicked(quest_id: String)

@onready var name_label: Label = get_node_or_null("%QuestNameLabel")
@onready var objective_label: Label = get_node_or_null("%ObjectiveLabel")
@onready var progress_bar: ProgressBar = get_node_or_null("%ProgressBar")
@onready var progress_label: Label = get_node_or_null("%ProgressText")
@onready var points_label: Label = get_node_or_null("%PointsLabel")
@onready var pin_button: Button = get_node_or_null("%PinButton")
@onready var claim_button: Button = get_node_or_null("%ClaimButton")
@onready var card_button: Button = get_node_or_null("%SelectButton")

var quest_data: Dictionary = {}

func _ready() -> void:
	if card_button:
		card_button.pressed.connect(_on_card_pressed)
	if pin_button:
		pin_button.pressed.connect(_on_pin_pressed)
	if claim_button:
		claim_button.pressed.connect(_on_claim_pressed)

func init_item(data: Dictionary) -> void:
	quest_data = data
	
	if name_label:
		name_label.text = data.get("name", "Royal Expedition")
	if objective_label:
		objective_label.text = data.get("objective_desc", "Complete objectives")
		
	# Points
	if points_label:
		points_label.text = "+%d PTS" % data.get("quest_points", 10)
		
	# Progress bar and text
	var current = int(data.get("current_progress", 0))
	var target = int(data.get("target_progress", 1))
	if target <= 0:
		target = 1
		
	if progress_bar:
		progress_bar.max_value = target
		progress_bar.value = current
	if progress_label:
		progress_label.text = "%d/%d" % [current, target]
		
	# Check Pin State
	_update_pin_button_state(data.get("is_pinned", false))
	
	# Action/Claim Button Visibility and Status
	var is_completed = data.get("is_completed", false) or (current >= target)
	var is_claimed = data.get("is_claimed", false)
	
	if claim_button:
		if is_completed:
			claim_button.visible = true
			if is_claimed:
				claim_button.disabled = true
				claim_button.text = "CLAIMED"
				modulate = Color(0.6, 0.6, 0.6, 0.8) # Muted state
			else:
				claim_button.disabled = false
				claim_button.text = "CLAIM"
				modulate = Color(1.0, 1.0, 1.0, 1.0) # Highlight completed unclaimed
		else:
			claim_button.visible = false
			modulate = Color(1.0, 1.0, 1.0, 1.0)

func _update_pin_button_state(pinned: bool) -> void:
	if pin_button:
		if pinned:
			pin_button.text = "⭐"
			pin_button.modulate = Color(1.0, 0.84, 0.0) # Golden Pin
		else:
			pin_button.text = "☆"
			pin_button.modulate = Color(0.7, 0.7, 0.7)

func _on_card_pressed() -> void:
	item_selected.emit(quest_data)

func _on_pin_pressed() -> void:
	var current_pin = quest_data.get("is_pinned", false)
	var new_pin = not current_pin
	quest_data["is_pinned"] = new_pin
	_update_pin_button_state(new_pin)
	pin_toggled.emit(quest_data.get("id", ""), new_pin)

func _on_claim_pressed() -> void:
	claim_clicked.emit(quest_data.get("id", ""))
