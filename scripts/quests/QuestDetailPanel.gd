extends Control
class_name QuestDetailPanel

# ==========================================
# CROWNSPIRE QUEST DETAILED BREAKDOWN VIEW
# ==========================================

signal closed()
signal reward_claimed_successfully(quest_id: String)

@onready var title_label: Label = %DetTitleLabel if has_node("%DetTitleLabel") else get_node_or_null("VBox/Header/DetTitleLabel")
@onready var desc_label: Label = %DetDescLabel if has_node("%DetDescLabel") else get_node_or_null("VBox/Scroll/Margin/VBox/DetDescLabel")
@onready var objectives_container: VBoxContainer = %ObjectivesContainer if has_node("%ObjectivesContainer") else get_node_or_null("VBox/Scroll/Margin/VBox/ObjectivesContainer")
@onready var rewards_container: GridContainer = %RewardsContainer if has_node("%RewardsContainer") else get_node_or_null("VBox/Scroll/Margin/VBox/RewardsSection/RewardsContainer")
@onready var detail_action_button: Button = %DetailActionButton if has_node("%DetailActionButton") else get_node_or_null("VBox/Footer/DetailActionButton")
@onready var back_button: Button = %BackButton if has_node("%BackButton") else get_node_or_null("VBox/Header/BackButton")

const OBJECTIVE_PANEL_SCENE = "res://scenes/quests/QuestObjectivePanel.tscn"
const REWARD_CELL_SCENE = "res://scenes/quests/QuestRewardPanel.tscn"

var active_quest_id: String = ""
var quest_data: Dictionary = {}

func _ready() -> void:
	if back_button:
		back_button.pressed.connect(close_panel)
	if detail_action_button:
		detail_action_button.pressed.connect(_on_action_pressed)

func open_for_quest(quest_id: String) -> void:
	active_quest_id = quest_id
	visible = true
	
	# Fetch quest details
	if not QuestManager:
		return
		
	quest_data = QuestManager._find_quest_in_db(quest_id)
	if quest_data.is_empty():
		close_panel()
		return
		
	# Update layout labels
	if title_label:
		title_label.text = quest_data.get("name", "Royal Scroll")
	if desc_label:
		desc_label.text = quest_data.get("description", "")
		
	# Render objectives
	_render_objectives()
	
	# Render rewards
	_render_rewards()
	
	# Update Button States
	_update_action_button()
	
	# Premium slide-in transition
	_animate_open()

func close_panel() -> void:
	_animate_close()

func _render_objectives() -> void:
	if not objectives_container:
		return
		
	# Clear old rows
	for child in objectives_container.get_children():
		child.queue_free()
		
	var obj_scene = load(OBJECTIVE_PANEL_SCENE)
	if not obj_scene:
		push_error("[Crownspire QuestDetail] QuestObjectivePanel.tscn not found!")
		return
		
	var objectives = quest_data.get("objectives", []) as Array
	for obj in objectives:
		var row = obj_scene.instantiate()
		objectives_container.add_child(row)
		if row.has_method("populate_objective"):
			row.populate_objective(obj)

func _render_rewards() -> void:
	if not rewards_container:
		return
		
	# Clear old reward cells
	for child in rewards_container.get_children():
		child.queue_free()
		
	var r_scene = load(REWARD_CELL_SCENE)
	if not r_scene:
		push_error("[Crownspire QuestDetail] QuestRewardPanel.tscn not found!")
		return
		
	var rewards = quest_data.get("rewards", []) as Array
	for reward in rewards:
		var cell = r_scene.instantiate()
		rewards_container.add_child(cell)
		if cell.has_method("populate_reward"):
			cell.populate_reward(reward)

func _update_action_button() -> void:
	if not detail_action_button:
		return
		
	detail_action_button.disabled = false
	detail_action_button.modulate = Color(1, 1, 1, 1)
	
	var is_completed = quest_data.get("is_completed", false)
	var is_claimed = quest_data.get("is_claimed", false)
	
	if is_claimed:
		detail_action_button.text = "REWARD CLAIMED"
		detail_action_button.disabled = true
		detail_action_button.modulate = Color(0.4, 0.4, 0.4, 1.0)
	elif is_completed:
		detail_action_button.text = "CLAIM REWARDS"
		_set_button_glowing_style(true)
	else:
		detail_action_button.text = quest_data.get("action_label", "GO TO TARGET")
		_set_button_glowing_style(false)

func _set_button_glowing_style(glowing: bool) -> void:
	var sb = StyleBoxFlat.new()
	sb.corner_radius_top_left = 6
	sb.corner_radius_top_right = 6
	sb.corner_radius_bottom_right = 6
	sb.corner_radius_bottom_left = 6
	sb.border_width_left = 1
	sb.border_width_right = 1
	sb.border_width_top = 1
	sb.border_width_bottom = 1
	
	if glowing:
		sb.bg_color = Color(0.18, 0.35, 0.22, 1.0)
		sb.border_color = Color(0.3, 0.8, 0.45, 1.0)
		sb.shadow_color = Color(0.2, 0.8, 0.4, 0.25)
		sb.shadow_size = 8
		detail_action_button.add_theme_color_override("font_color", Color(0.5, 1.0, 0.7, 1.0))
	else:
		sb.bg_color = Color(0.12, 0.16, 0.24, 1.0)
		sb.border_color = Color(0.2, 0.4, 0.65, 1.0)
		sb.shadow_size = 0
		detail_action_button.add_theme_color_override("font_color", Color(0.6, 0.85, 1.0, 1.0))
		
	detail_action_button.add_theme_stylebox_override("normal", sb)

func _on_action_pressed() -> void:
	var is_completed = quest_data.get("is_completed", false)
	var is_claimed = quest_data.get("is_claimed", false)
	
	if is_claimed:
		return
		
	if is_completed:
		# Claim rewards!
		if QuestManager:
			var rewards = QuestManager.claim_rewards(active_quest_id)
			quest_data["is_claimed"] = true
			_update_action_button()
			reward_claimed_successfully.emit(active_quest_id)
			
			# Visual gacha celebratory popup!
			var popup_scene = load("res://scenes/quests/QuestCompletePopup.tscn")
			if popup_scene and Engine.has_singleton("UIManager"):
				var ui_mgr = Engine.get_singleton("UIManager")
				ui_mgr.open_popup(popup_scene)
			elif popup_scene:
				# Standard fallback
				var root = get_tree().current_scene
				var pop = popup_scene.instantiate()
				root.add_child(pop)
				if pop.has_method("play_celebration"):
					pop.play_celebration(rewards)
	else:
		# Dynamic redirect triggers depending on button keyword!
		var action_label = quest_data.get("action_label", "GO")
		_trigger_nav_shortcut(action_label)

func _trigger_nav_shortcut(label: String) -> void:
	print("[Crownspire Quests] Activating Navigation Shortcut: ", label)
	
	# Simulate trigger shortcuts
	var ui_mgr = get_node_or_null("/root/UIManager")
	match label:
		"TRAIN":
			if ui_mgr: ui_mgr.troops_trained.emit("infantry", 100) # Simulate progress
		"BUILD", "UPGRADE":
			if ui_mgr: ui_mgr.building_updated.emit("keep", 5) # Simulate keep level completed
		"HELP":
			if ui_mgr and ui_mgr.has_method("help_all_alliance_requests"):
				ui_mgr.help_all_alliance_requests()
		"GATHER":
			if ui_mgr and ui_mgr.has_signal("reward_claimed"):
				ui_mgr.reward_claimed.emit([{"name": "Wood cutter haul", "quantity": 10000, "rarity": 1}])
				
	# Close self upon shortcut activation
	close_panel()

func _animate_open() -> void:
	modulate.a = 0.0
	position.x = size.x # Start outside right
	var tween = create_tween().set_parallel(true)
	tween.tween_property(self, "modulate:a", 1.0, 0.25)
	tween.tween_property(self, "position:x", 0.0, 0.3).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)

func _animate_close() -> void:
	var tween = create_tween().set_parallel(true)
	tween.tween_property(self, "modulate:a", 0.0, 0.25)
	tween.tween_property(self, "position:x", size.x, 0.3).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_IN)
	await tween.finished
	visible = false
	closed.emit()
