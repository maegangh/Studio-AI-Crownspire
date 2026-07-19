extends Control

# ==========================================
# CROWNSPIRE LIVEOPS CAMPAIGN & QUEST CONTROLLER
# ==========================================
# Coordinates the player's progression, daily quests, and seasonal active campaigns.
# Integrates milestone chests and lists item tasks with smooth transit effects.

@onready var title_label: Label = %DashboardTitle
@onready var close_button: Button = %CloseButton
@onready var quests_tab_btn: Button = %QuestsTabBtn
@onready var campaigns_tab_btn: Button = %CampaignsTabBtn
@onready var content_scroll: ScrollContainer = %ContentScroll
@onready var list_container: VBoxContainer = %ListContainer

# Daily Quest Milestones HUD
@onready var daily_hud: PanelContainer = %DailyProgressHUD
@onready var daily_pts_lbl: Label = %DailyPtsLabel
@onready var daily_bar: ProgressBar = %DailyProgressBar
@onready var daily_chests: HBoxContainer = %DailyChestsContainer

# Resources Bars (Reusing modular state)
@onready var crystals_bar: Control = %CrystalsBar
@onready var honor_bar: Control = %HonorBar

# Loaded Pack Scenes for list cells
@export var quest_item_scene: PackedScene = preload("res://scenes/QuestListItem.tscn")
@export var campaign_card_scene: PackedScene = preload("res://scenes/CampaignCard.tscn")

var active_tab: String = "quests" # "quests" or "campaigns"
var current_daily_points: int = 0
var daily_milestones := [
	{"points": 20, "claimed": false, "rewards": [{"name": "100K Food Provisions", "quantity": 2, "rarity": 1, "icon": ""}]},
	{"points": 50, "claimed": false, "rewards": [{"name": "1-Hour Universal Speedup", "quantity": 2, "rarity": 1, "icon": ""}]},
	{"points": 80, "claimed": false, "rewards": [{"name": "Aurora Crystals", "quantity": 250, "rarity": 2, "icon": ""}]},
	{"points": 100, "claimed": false, "rewards": [{"name": "Ancient Skill Codex", "quantity": 1, "rarity": 2, "icon": ""}, {"name": "Royal Crystals", "quantity": 100, "rarity": 3, "icon": ""}]}
]

func _ready() -> void:
	close_button.pressed.connect(_on_close_pressed)
	quests_tab_btn.pressed.connect(func(): _switch_tab("quests"))
	campaigns_tab_btn.pressed.connect(func(): _switch_tab("campaigns"))
	
	# Listen to quest and currency changes
	UIManager.quest_reward_claimed.connect(_on_quest_reward_claimed)
	UIManager.reward_claimed.connect(_on_rewards_celebration)
	
	_load_saved_daily_points()
	_switch_tab("quests")
	_update_hud_bars()
	
	# Standard introductory animation
	var ap = $AnimationPlayer as AnimationPlayer
	if ap and ap.has_animation("enter_swipe"):
		ap.play("enter_swipe")

func _switch_tab(tab_name: String) -> void:
	active_tab = tab_name
	
	# Stylize active/inactive buttons
	if tab_name == "quests":
		quests_tab_btn.add_theme_color_override("font_color", Color(1.0, 0.84, 0.0)) # Gold active
		campaigns_tab_btn.add_theme_color_override("font_color", Color(1, 1, 1, 0.6))
		daily_hud.visible = true
		title_label.text = "DAILY PROMOTION DEEDS"
		_populate_quests_list()
	else:
		quests_tab_btn.add_theme_color_override("font_color", Color(1, 1, 1, 0.6))
		campaigns_tab_btn.add_theme_color_override("font_color", Color(1.0, 0.84, 0.0))
		daily_hud.visible = false
		title_label.text = "ACTIVE SOVEREIGN CAMPAIGNS"
		_populate_campaigns_list()

func _populate_quests_list() -> void:
	_clear_list()
	var quests = UIManager.get_all_quests()
	for q in quests:
		var inst = quest_item_scene.instantiate()
		list_container.add_child(inst)
		inst.init_quest(q)
		inst.quest_button_pressed.connect(_on_quest_item_action)

func _populate_campaigns_list() -> void:
	_clear_list()
	var campaigns = UIManager.get_active_campaigns()
	for c in campaigns:
		var inst = campaign_card_scene.instantiate()
		list_container.add_child(inst)
		inst.init_campaign(c)

func _clear_list() -> void:
	for child in list_container.get_children():
		child.queue_free()

func _load_saved_daily_points() -> void:
	# Sum claimed quest points to find current daily progress
	current_daily_points = 0
	var quests = UIManager.get_all_quests()
	for q in quests:
		if q.get("is_claimed", false):
			current_daily_points += q.get("quest_points", 0)
			
	# Restore saved milestones claimed states from UIManager metadata or user save if needed
	# For simplicity, we also cache them dynamically based on points
	_update_daily_progress_hud()

func _update_daily_progress_hud() -> void:
	daily_pts_lbl.text = "DAILY QUEST POINTS: %d" % current_daily_points
	daily_bar.max_value = 100
	daily_bar.value = current_daily_points
	
	# Rebuild milestone chest buttons
	for child in daily_chests.get_children():
		child.queue_free()
		
	for idx in range(daily_milestones.size()):
		var m = daily_milestones[idx]
		var pts_req = m["points"]
		var claimed = m["claimed"]
		
		var btn := Button.new()
		btn.custom_minimum_size = Vector2(50, 44)
		
		if claimed:
			btn.text = "CLAIMED"
			btn.disabled = true
			btn.add_theme_color_override("font_color", Color(0.5, 0.5, 0.5))
		elif current_daily_points >= pts_req:
			btn.text = "CHEST\n(%d)" % pts_req
			btn.disabled = false
			btn.add_theme_color_override("font_color", Color(1.0, 0.84, 0.0))
			_apply_glow_tween(btn)
		else:
			btn.text = "CHEST\n(%d)" % pts_req
			btn.disabled = true
			btn.add_theme_color_override("font_color", Color(0.7, 0.7, 0.7))
			
		btn.pressed.connect(func(): _on_daily_chest_claimed(idx))
		daily_chests.add_child(btn)

func _apply_glow_tween(node: Control) -> void:
	var tween = create_tween().set_loops()
	tween.tween_property(node, "scale", Vector2(1.1, 1.1), 0.4)
	tween.tween_property(node, "scale", Vector2(1.0, 1.0), 0.4)

func _on_daily_chest_claimed(idx: int) -> void:
	var m = daily_milestones[idx]
	if m["claimed"] or current_daily_points < m["points"]:
		return
		
	m["claimed"] = true
	
	var list: Array[Dictionary] = []
	for reward in m["rewards"]:
		var r_name = reward["name"]
		var qty = reward["quantity"]
		
		# Add to economy wallet
		if "Royal Crystals" in r_name:
			UIManager.royal_crystals += qty
		elif "Aurora Crystals" in r_name:
			UIManager.aurora_crystals += qty
		elif "Food" in r_name:
			UIManager.gold += qty # Or raw resources if available
			
		list.append({
			"name": r_name,
			"quantity": qty,
			"rarity": reward["rarity"],
			"icon": reward["icon"]
		})
		
	UIManager.reward_claimed.emit(list)
	_update_daily_progress_hud()

func _on_quest_item_action(quest_id: String, action: String) -> void:
	if action == "CLAIM":
		_load_saved_daily_points()
		_update_hud_bars()

func _on_quest_reward_claimed(quest_id: String, rewards: Array) -> void:
	_load_saved_daily_points()
	_update_hud_bars()

func _on_rewards_celebration(rewards_list: Array[Dictionary]) -> void:
	_update_hud_bars()

func _update_hud_bars() -> void:
	# Update localized elements if needed
	pass

func _on_close_pressed() -> void:
	var ap = $AnimationPlayer as AnimationPlayer
	if ap and ap.has_animation("exit_swipe"):
		ap.play("exit_swipe")
		await ap.animation_finished
	queue_free()
