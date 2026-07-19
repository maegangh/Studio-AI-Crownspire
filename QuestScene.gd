# ==============================================================================
# Crownspire MMO Strategy Game - Quest System Controller
# Godot 4 / GDScript 2.0 Client-side persistent quest engine
# ==============================================================================
# Supports tabs: Main, Daily, Weekly, Achievement, Alliance, Hero.
# Supports objectives: Building, Training, Research, Wildling, Alliance Help.
# Handles custom animations, multiple objectives, progress logs, and claims.
# ==============================================================================

extends Control

# --- Constant Save Location ---
const SAVE_FILE_PATH = "user://crownspire_quests_v1.save"

# --- Categories / Tabs ---
const TABS = [
	"Main",
	"Daily",
	"Weekly",
	"Achievement",
	"Alliance",
	"Hero"
]

# --- Onready Nodes ---
@onready var sim_build_btn: Button = $Layout/Header/MarginContainer/HBoxContainer/ActionSimBox/SimBuildBtn
@onready var sim_train_btn: Button = $Layout/Header/MarginContainer/HBoxContainer/ActionSimBox/SimTrainBtn
@onready var sim_research_btn: Button = $Layout/Header/MarginContainer/HBoxContainer/ActionSimBox/SimResearchBtn
@onready var sim_wildling_btn: Button = $Layout/Header/MarginContainer/HBoxContainer/ActionSimBox/SimWildlingBtn
@onready var reset_btn: Button = $Layout/Header/MarginContainer/HBoxContainer/ActionSimBox/ResetBtn
@onready var close_button: Button = $Layout/Header/MarginContainer/HBoxContainer/CloseButton

@onready var tab_box: HBoxContainer = $Layout/TabScroll/TabBox
@onready var quest_category_label: Label = $Layout/MainPanel/HSplit/LeftListContainer/HeaderBar/QuestCategoryLabel
@onready var claim_all_visible_btn: Button = $Layout/MainPanel/HSplit/LeftListContainer/HeaderBar/ClaimAllVisibleBtn
@onready var quest_list_container: VBoxContainer = $Layout/MainPanel/HSplit/LeftListContainer/ListScroll/QuestList

# --- Right-Side Info Log ---
@onready var completed_label: Label = $Layout/MainPanel/HSplit/RightDetailContainer/Margin/VBox/OverviewContainer/CompletedLabel
@onready var total_claimed_label: Label = $Layout/MainPanel/HSplit/RightDetailContainer/Margin/VBox/OverviewContainer/TotalClaimedLabel

# --- Milestone Outlets ---
@onready var keep_lbl: Label = $Layout/MainPanel/HSplit/RightDetailContainer/Margin/VBox/MilestonesContainer/KeepLevelMilestone/Label
@onready var keep_progress: ProgressBar = $Layout/MainPanel/HSplit/RightDetailContainer/Margin/VBox/MilestonesContainer/KeepLevelMilestone/Progress

@onready var troop_lbl: Label = $Layout/MainPanel/HSplit/RightDetailContainer/Margin/VBox/MilestonesContainer/TrainedTroopsMilestone/Label
@onready var troop_progress: ProgressBar = $Layout/MainPanel/HSplit/RightDetailContainer/Margin/VBox/MilestonesContainer/TrainedTroopsMilestone/Progress

@onready var res_lbl: Label = $Layout/MainPanel/HSplit/RightDetailContainer/Margin/VBox/MilestonesContainer/ResearchMilestone/Label
@onready var res_progress: ProgressBar = $Layout/MainPanel/HSplit/RightDetailContainer/Margin/VBox/MilestonesContainer/ResearchMilestone/Progress

@onready var wild_lbl: Label = $Layout/MainPanel/HSplit/RightDetailContainer/Margin/VBox/MilestonesContainer/SlayWildlingsMilestone/Label
@onready var wild_progress: ProgressBar = $Layout/MainPanel/HSplit/RightDetailContainer/Margin/VBox/MilestonesContainer/SlayWildlingsMilestone/Progress

# --- Popups & Toast ---
@onready var toast_notification: PanelContainer = $ToastNotification
@onready var toast_label: Label = $ToastNotification/ToastLabel
@onready var reward_popup: Control = $QuestRewardPopup

# --- Internal Database State ---
var _quests: Array = []
var _active_tab: String = "Main"
var _toast_timer: Timer

# --- Dynamic Milestones Counter ---
var _keep_level: int = 11
var _trained_troops: int = 450
var _research_level: int = 3
var _wildlings_slain: int = 8
var _total_rewards_claimed_count: int = 0

# ==============================================================================
# LIFECYCLE CALLBACKS
# ==============================================================================

func _ready() -> void:
	print("[Quests] Launching sovereign mission board...")
	
	# Configure toast clock
	_toast_timer = Timer.new()
	_toast_timer.one_shot = true
	_toast_timer.wait_time = 2.0
	_toast_timer.timeout.connect(_on_toast_timeout)
	add_child(_toast_timer)
	
	# Load or bootstrap database
	_load_quests_from_disk()
	
	# Setup Tab System
	_setup_category_tabs()
	
	# Connect top-level controls
	close_button.pressed.connect(_on_close_pressed)
	claim_all_visible_btn.pressed.connect(_on_claim_all_visible_pressed)
	
	# Connect Simulation Helpers
	sim_build_btn.pressed.connect(_on_sim_build_pressed)
	sim_train_btn.pressed.connect(_on_sim_train_pressed)
	sim_research_btn.pressed.connect(_on_sim_research_pressed)
	sim_wildling_btn.pressed.connect(_on_sim_wildling_pressed)
	reset_btn.pressed.connect(_on_reset_pressed)
	
	# Connect popup callback
	reward_popup.connect("claimed_rewards_confirmed", _on_popup_rewards_confirmed)
	
	# Initial Render
	_refresh_quest_ui()

# ==============================================================================
# SAVING & PERSISTENCE
# ==============================================================================

func _load_quests_from_disk() -> void:
	if not FileAccess.file_exists(SAVE_FILE_PATH):
		_populate_default_quest_manifest()
		return
		
	var file = FileAccess.open(SAVE_FILE_PATH, FileAccess.READ)
	if not file:
		_populate_default_quest_manifest()
		return
		
	var content = file.get_as_text()
	file.close()
	
	var json = JSON.new()
	var error = json.parse(content)
	if error != OK:
		push_error("[Quests] Saved missions file corrupted. Clearing to defaults.")
		_populate_default_quest_manifest()
		return
		
	var raw_data = json.get_data()
	if typeof(raw_data) == TYPE_DICTIONARY:
		_quests = raw_data.get("quests", [])
		_keep_level = raw_data.get("keep_level", 11)
		_trained_troops = raw_data.get("trained_troops", 450)
		_research_level = raw_data.get("research_level", 3)
		_wildlings_slain = raw_data.get("wildlings_slain", 8)
		_total_rewards_claimed_count = raw_data.get("claimed_count", 0)
		print("[Quests] Successfully loaded %d royal quests." % _quests.size())
	else:
		_populate_default_quest_manifest()

func _save_quests_to_disk() -> void:
	var file = FileAccess.open(SAVE_FILE_PATH, FileAccess.WRITE)
	if not file:
		push_error("[Quests] Critical: Unable to write quest progress.")
		return
		
	var payload = {
		"quests": _quests,
		"keep_level": _keep_level,
		"trained_troops": _trained_troops,
		"research_level": _research_level,
		"wildlings_slain": _wildlings_slain,
		"claimed_count": _total_rewards_claimed_count
	}
	
	file.store_string(JSON.stringify(payload))
	file.close()

## Populate pristine Crownspire quest database
func _populate_default_quest_manifest() -> void:
	print("[Quests] Bootstrapping clean quest roster...")
	_keep_level = 11
	_trained_troops = 450
	_research_level = 3
	_wildlings_slain = 8
	_total_rewards_claimed_count = 0
	
	_quests = [
		# --- 1. Main Story Quests (Progressive Building and Power) ---
		{
			"id": "main_keep_12",
			"category": "Main",
			"title": "Establish Kingdom Authority",
			"description": "Construct defensive towers and upgrade your Keep to establish dominion.",
			"is_completed": false,
			"is_claimed": false,
			"objectives": [
				{"desc": "Upgrade Keep to Tier 12", "current": 11, "target": 12, "type": "building"},
				{"desc": "Construct Guard Tower Level 10", "current": 9, "target": 10, "type": "building"}
			],
			"rewards": [
				{"name": "gold", "amount": 100000, "emoji": "🪙"},
				{"name": "wood", "amount": 500000, "emoji": "🪵"},
				{"name": "speedup", "amount": 3, "emoji": "⏱️"}
			]
		},
		{
			"id": "main_academy_05",
			"category": "Main",
			"title": "Expand Academic Horizons",
			"description": "Increase intellectual resources to research advanced offensive tactics.",
			"is_completed": false,
			"is_claimed": false,
			"objectives": [
				{"desc": "Upgrade Academy to Tier 5", "current": 3, "target": 5, "type": "building"},
				{"desc": "Complete Infantry Tactics II", "current": 0, "target": 1, "type": "research"}
			],
			"rewards": [
				{"name": "diamonds", "amount": 300, "emoji": "💎"},
				{"name": "stone", "amount": 200000, "emoji": "🪨"}
			]
		},
		
		# --- 2. Daily Quests (Resets regularly) ---
		{
			"id": "daily_train_troops",
			"category": "Daily",
			"title": "Reinforce the Vanguard",
			"description": "Train fresh recruits at the barracks daily to defend the castle.",
			"is_completed": false,
			"is_claimed": false,
			"objectives": [
				{"desc": "Train Light Cavalry", "current": 0, "target": 150, "type": "training"}
			],
			"rewards": [
				{"name": "food", "amount": 50000, "emoji": "🍖"},
				{"name": "iron", "amount": 15000, "emoji": "⛓️"}
			]
		},
		{
			"id": "daily_hunt_wildlings",
			"category": "Daily",
			"title": "Banish Southern Raiders",
			"description": "Banish rogue wildling bands harassing the farming villages.",
			"is_completed": false,
			"is_claimed": false,
			"objectives": [
				{"desc": "Slay Wildling Patrols", "current": 0, "target": 3, "type": "wildling"}
			],
			"rewards": [
				{"name": "hero_exp", "amount": 500, "emoji": "⚡"},
				{"name": "diamonds", "amount": 50, "emoji": "💎"}
			]
		},
		
		# --- 3. Weekly Quests ---
		{
			"id": "weekly_grand_slayer",
			"category": "Weekly",
			"title": "Banishment Campaign",
			"description": "Exterminate high-danger threats across the outer borders.",
			"is_completed": false,
			"is_claimed": false,
			"objectives": [
				{"desc": "Clear Wildling Camps", "current": 0, "target": 10, "type": "wildling"},
				{"desc": "Train Heavy Infantry Troops", "current": 0, "target": 500, "type": "training"}
			],
			"rewards": [
				{"name": "valkyrie_hero_shard", "amount": 5, "emoji": "🎖️"},
				{"name": "diamonds", "amount": 500, "emoji": "💎"},
				{"name": "speedup_8h", "amount": 2, "emoji": "⏱️"}
			]
		},
		
		# --- 4. Achievements ---
		{
			"id": "achieve_keep_15",
			"category": "Achievement",
			"title": "Crownspire Sovereign",
			"description": "Reach spectacular architectural milestones inside the Citadel.",
			"is_completed": false,
			"is_claimed": false,
			"objectives": [
				{"desc": "Reach Keep Tier 15", "current": 11, "target": 15, "type": "building"}
			],
			"rewards": [
				{"name": "royal_chest", "amount": 1, "emoji": "👑"},
				{"name": "diamonds", "amount": 1000, "emoji": "💎"}
			]
		},
		{
			"id": "achieve_slay_100",
			"category": "Achievement",
			"title": "Scourge of the Borderlands",
			"description": "Establish peace throughout the kingdom by neutralizing all threats.",
			"is_completed": false,
			"is_claimed": false,
			"objectives": [
				{"desc": "Vanquish Wildling Brigands", "current": 8, "target": 100, "type": "wildling"}
			],
			"rewards": [
				{"name": "epic_sword", "amount": 1, "emoji": "⚔️"},
				{"name": "gold", "amount": 250000, "emoji": "🪙"}
			]
		},
		
		# --- 5. Alliance Missions ---
		{
			"id": "alliance_helps_20",
			"category": "Alliance",
			"title": "Comrade Assistance",
			"description": "Assist your alliance brothers with constructing timber forest nodes.",
			"is_completed": false,
			"is_claimed": false,
			"objectives": [
				{"desc": "Help Alliance Members", "current": 12, "target": 20, "type": "alliance"}
			],
			"rewards": [
				{"name": "alliance_points", "amount": 2000, "emoji": "🤝"},
				{"name": "resource_wood", "amount": 100000, "emoji": "🪵"}
			]
		},
		
		# --- 6. Hero Tasks ---
		{
			"id": "hero_training_ground",
			"category": "Hero",
			"title": "Ascend Elite Champions",
			"description": "Conduct deep combat drills to sharpen hero attack strategies.",
			"is_completed": false,
			"is_claimed": false,
			"objectives": [
				{"desc": "Conduct Academy Military Drills", "current": 1, "target": 3, "type": "research"},
				{"desc": "Train Imperial Guards", "current": 0, "target": 300, "type": "training"}
			],
			"rewards": [
				{"name": "legendary_hero_scroll", "amount": 1, "emoji": "📜"},
				{"name": "hero_exp", "amount": 2000, "emoji": "⚡"}
			]
		}
	]
	_save_quests_to_disk()

# ==============================================================================
# UI GENERATION
# ==============================================================================

## Sets up high-contrast category tabs with unread status indicators
func _setup_category_tabs() -> void:
	for child in tab_box.get_children():
		child.queue_free()
		
	for tab_name in TABS:
		var tab_button = Button.new()
		var count_ready = _get_claimable_count_by_tab(tab_name)
		var text_suffix = ""
		if count_ready > 0:
			text_suffix = " (%d Ready)" % count_ready
			
		tab_button.text = "  " + tab_name + text_suffix + "  "
		tab_button.custom_minimum_size = Vector2(100, 40)
		tab_button.size_flags_vertical = Control.SIZE_SHRINK_CENTER
		tab_button.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		tab_button.focus_mode = Control.FOCUS_NONE
		tab_button.pressed.connect(func(): _on_tab_pressed(tab_name))
		
		tab_box.add_child(tab_button)
		
	_update_tab_button_styles()

func _update_tab_button_styles() -> void:
	var children = tab_box.get_children()
	for i in range(children.size()):
		var btn = children[i] as Button
		if btn:
			var is_active = (TABS[i] == _active_tab)
			var style = _get_tab_active_style() if is_active else _get_tab_inactive_style()
			
			btn.add_theme_stylebox_override("normal", style)
			btn.add_theme_stylebox_override("hover", style)
			btn.add_theme_stylebox_override("pressed", style)
			btn.add_theme_stylebox_override("focus", style)
			
			var count_ready = _get_claimable_count_by_tab(TABS[i])
			if count_ready > 0 and not is_active:
				btn.add_theme_color_override("font_color", Color(0.95, 0.75, 0.15, 1)) # Gold
			else:
				btn.add_theme_color_override("font_color", Color(1, 1, 1, 1) if is_active else Color(0.6, 0.65, 0.7, 1))

func _get_claimable_count_by_tab(tab_name: String) -> int:
	var count = 0
	for q in _quests:
		if q.get("category", "") == tab_name:
			if q.get("is_completed", false) and not q.get("is_claimed", false):
				count += 1
	return count

# ==============================================================================
# MAIN RENDER & LAYOUT ENGINE
# ==============================================================================

func _refresh_quest_ui() -> void:
	# 1. Update list title
	quest_category_label.text = _active_tab + " Quests"
	
	# 2. Re-render lists
	for child in quest_list_container.get_children():
		child.queue_free()
		
	var active_list = _quests.filter(func(q): return q.get("category", "") == _active_tab)
	
	# Sort completed and unclaimed quests to the top!
	active_list.sort_custom(_sort_quests_logic)
	
	if active_list.is_empty():
		_display_empty_state()
	else:
		for q_data in active_list:
			var card = _create_quest_card(q_data)
			quest_list_container.add_child(card)
			
	# 3. Update overview counters
	var completed_total = _quests.filter(func(q): return q.get("is_completed", false)).size()
	completed_label.text = "Completed Quests: %d / %d" % [completed_total, _quests.size()]
	total_claimed_label.text = "Rewards Handed Out: %d Items" % _total_rewards_claimed_count
	
	# 4. Update milestones
	_render_milestones()
	
	# 5. Refresh tab alert markers
	_setup_category_tabs()

func _sort_quests_logic(a: Dictionary, b: Dictionary) -> bool:
	var a_ready = a.get("is_completed", false) and not a.get("is_claimed", false)
	var b_ready = b.get("is_completed", false) and not b.get("is_claimed", false)
	
	if a_ready and not b_ready:
		return true
	if not a_ready and b_ready:
		return false
		
	var a_claimed = a.get("is_claimed", false)
	var b_claimed = b.get("is_claimed", false)
	
	if not a_claimed and b_claimed:
		return true
	if a_claimed and not b_claimed:
		return false
		
	return false

func _display_empty_state() -> void:
	var center = CenterContainer.new()
	center.size_flags_vertical = Control.SIZE_EXPAND_FILL
	center.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	quest_list_container.add_child(center)
	
	var lbl = Label.new()
	lbl.text = "All quests cleared in this category!"
	lbl.add_theme_color_override("font_color", Color(0.5, 0.55, 0.6, 1))
	center.add_child(lbl)

# ==============================================================================
# COMPONENT BUILDERS (CARDS & PROGRESS)
# ==============================================================================

func _create_quest_card(q: Dictionary) -> PanelContainer:
	var card = PanelContainer.new()
	card.custom_minimum_size = Vector2(0, 100)
	
	# Card highlights if ready to claim
	var is_ready = q.get("is_completed", false) and not q.get("is_claimed", false)
	card.add_theme_stylebox_override("panel", _get_card_ready_style() if is_ready else _get_card_normal_style())
	
	var margin = MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 14)
	margin.add_theme_constant_override("margin_top", 12)
	margin.add_theme_constant_override("margin_right", 14)
	margin.add_theme_constant_override("margin_bottom", 12)
	card.add_child(margin)
	
	var hbox = HBoxContainer.new()
	hbox.add_theme_constant_override("separation", 16)
	margin.add_child(hbox)
	
	# Icon Representation (Left Side)
	var icon_lbl = Label.new()
	icon_lbl.text = "🎯"
	if q.get("is_claimed", false):
		icon_lbl.text = "✅"
	elif is_ready:
		icon_lbl.text = "🎁"
	icon_lbl.add_theme_font_size_override("font_size", 28)
	icon_lbl.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	hbox.add_child(icon_lbl)
	
	# Details (Middle column)
	var vbox_details = VBoxContainer.new()
	vbox_details.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	vbox_details.add_theme_constant_override("separation", 6)
	hbox.add_child(vbox_details)
	
	# Quest Title
	var title_lbl = Label.new()
	title_lbl.text = q.get("title", "")
	title_lbl.add_theme_color_override("font_color", Color(1, 1, 1, 1))
	title_lbl.add_theme_font_size_override("font_size", 14)
	vbox_details.add_child(title_lbl)
	
	# Description text
	var desc_lbl = Label.new()
	desc_lbl.text = q.get("description", "")
	desc_lbl.add_theme_color_override("font_color", Color(0.6, 0.65, 0.7, 1))
	desc_lbl.add_theme_font_size_override("font_size", 11)
	desc_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	vbox_details.add_child(desc_lbl)
	
	# Render Objectives (Multiple Objectives Supported)
	var obj_box = VBoxContainer.new()
	obj_box.add_theme_constant_override("separation", 4)
	vbox_details.add_child(obj_box)
	
	for obj in q.get("objectives", []):
		var obj_hbox = HBoxContainer.new()
		obj_box.add_child(obj_hbox)
		
		# Objective title
		var obj_lbl = Label.new()
		obj_lbl.text = "- " + obj.get("desc", "")
		obj_lbl.add_theme_font_size_override("font_size", 12)
		obj_lbl.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		if obj.get("current", 0) >= obj.get("target", 1):
			obj_lbl.add_theme_color_override("font_color", Color(0.3, 0.75, 0.4, 1)) # Light green
		else:
			obj_lbl.add_theme_color_override("font_color", Color(0.8, 0.8, 0.8, 1))
		obj_hbox.add_child(obj_lbl)
		
		# Objective progression indicator text
		var progress_lbl = Label.new()
		progress_lbl.text = "[%d / %d]" % [obj.get("current", 0), obj.get("target", 1)]
		progress_lbl.add_theme_font_size_override("font_size", 11)
		progress_lbl.add_theme_color_override("font_color", Color(0.5, 0.55, 0.6, 1))
		obj_hbox.add_child(progress_lbl)
		
		# Objective progress bar
		var pbar = ProgressBar.new()
		pbar.custom_minimum_size = Vector2(0, 6)
		pbar.add_theme_stylebox_override("background", _get_pbar_bg_style())
		pbar.add_theme_stylebox_override("fill", _get_pbar_fill_style())
		pbar.show_percentage = false
		pbar.max_value = float(obj.get("target", 1))
		pbar.value = float(obj.get("current", 0))
		obj_box.add_child(pbar)
		
	# Rewards list layout
	var rewards_hbox = HBoxContainer.new()
	rewards_hbox.add_theme_constant_override("separation", 8)
	vbox_details.add_child(rewards_hbox)
	
	var r_label = Label.new()
	r_label.text = "Rewards: "
	r_label.add_theme_font_size_override("font_size", 10)
	r_label.add_theme_color_override("font_color", Color(0.5, 0.55, 0.6, 1))
	rewards_hbox.add_child(r_label)
	
	for reward in q.get("rewards", []):
		var r_item_lbl = Label.new()
		r_item_lbl.text = "%s %d" % [reward.get("emoji", ""), reward.get("amount", 0)]
		r_item_lbl.add_theme_font_size_override("font_size", 11)
		r_item_lbl.add_theme_color_override("font_color", Color(0.95, 0.75, 0.15, 1))
		rewards_hbox.add_child(r_item_lbl)
		
	# Action Button (Right Side)
	var btn_vbox = VBoxContainer.new()
	btn_vbox.alignment = BoxContainer.ALIGNMENT_CENTER
	hbox.add_child(btn_vbox)
	
	if q.get("is_claimed", false):
		var claimed_lbl = Label.new()
		claimed_lbl.text = "Claimed"
		claimed_lbl.add_theme_color_override("font_color", Color(0.4, 0.45, 0.5, 1))
		claimed_lbl.add_theme_font_size_override("font_size", 13)
		btn_vbox.add_child(claimed_lbl)
	else:
		var claim_btn = Button.new()
		claim_btn.custom_minimum_size = Vector2(100, 36)
		claim_btn.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		claim_btn.focus_mode = Control.FOCUS_NONE
		
		if is_ready:
			claim_btn.text = "Claim"
			claim_btn.add_theme_color_override("font_color", Color(0.08, 0.1, 0.13, 1))
			claim_btn.add_theme_stylebox_override("normal", _get_claim_btn_style())
			claim_btn.add_theme_stylebox_override("hover", _get_claim_btn_style())
			claim_btn.pressed.connect(func(): _on_claim_pressed(q))
		else:
			claim_btn.text = "Active"
			claim_btn.disabled = true
			claim_btn.add_theme_color_override("font_color", Color(0.5, 0.55, 0.6, 1))
			
		btn_vbox.add_child(claim_btn)
		
	return card

# ==============================================================================
# MILESTONES PROGRESS LOG
# ==============================================================================

func _render_milestones() -> void:
	# Keep
	keep_lbl.text = "Keep Level: %d / 15" % _keep_level
	keep_progress.max_value = 15.0
	keep_progress.value = float(_keep_level)
	
	# Troops
	troop_lbl.text = "Trained Recruits: %d / 1,000" % _trained_troops
	troop_progress.max_value = 1000.0
	troop_progress.value = float(_trained_troops)
	
	# Research
	res_lbl.text = "Academy Research: Level %d / 10" % _research_level
	res_progress.max_value = 10.0
	res_progress.value = float(_research_level)
	
	# Wildlings
	wild_lbl.text = "Wildlings Banished: %d / 100" % _wildlings_slain
	wild_progress.max_value = 100.0
	wild_progress.value = float(_wildlings_slain)

# ==============================================================================
# SIMULATION HANDLERS
# ==============================================================================

func _on_sim_build_pressed() -> void:
	# Increment building metrics
	_keep_level = clamp(_keep_level + 1, 1, 15)
	
	_update_objective_progress("building", 1)
	_save_quests_to_disk()
	_refresh_quest_ui()
	_show_toast("Constructed fortifications! Keep level advanced to %d!" % _keep_level)

func _on_sim_train_pressed() -> void:
	_trained_troops = clamp(_trained_troops + 150, 0, 1000)
	
	_update_objective_progress("training", 150)
	_save_quests_to_disk()
	_refresh_quest_ui()
	_show_toast("Barracks completed cavalry drills! Recruits reinforced (+150)!")

func _on_sim_research_pressed() -> void:
	_research_level = clamp(_research_level + 1, 1, 10)
	
	_update_objective_progress("research", 1)
	_save_quests_to_disk()
	_refresh_quest_ui()
	_show_toast("Academy finished tactical research! Infantry skills enhanced!")

func _on_sim_wildling_pressed() -> void:
	_wildlings_slain = clamp(_wildlings_slain + 3, 0, 100)
	
	_update_objective_progress("wildling", 3)
	_save_quests_to_disk()
	_refresh_quest_ui()
	_show_toast("Southern borders fortified! Banished wildling brigands (+3)!")

func _update_objective_progress(obj_type: String, amount: int) -> void:
	for q in _quests:
		if q.get("is_claimed", false):
			continue
			
		var objectives = q.get("objectives", [])
		var changed = false
		for obj in objectives:
			if obj.get("type", "") == obj_type:
				var prev = obj.get("current", 0)
				var target = obj.get("target", 1)
				obj["current"] = clamp(prev + amount, 0, target)
				changed = true
				
		# Evaluate if completed
		if changed:
			var all_done = true
			for obj in objectives:
				if obj.get("current", 0) < obj.get("target", 1):
					all_done = false
					break
			q["is_completed"] = all_done

func _on_reset_pressed() -> void:
	_populate_default_quest_manifest()
	_refresh_quest_ui()
	_show_toast("Missions database reset to Crownspire defaults.")

# ==============================================================================
# CLAIM REWARDS SYSTEM
# ==============================================================================

var _quest_currently_claiming: Dictionary = {}

func _on_claim_pressed(q: Dictionary) -> void:
	_quest_currently_claiming = q
	
	# Bring up animated popup
	reward_popup.call("display_rewards", q.get("title", "Task Finished"), q.get("rewards", []))

func _on_popup_rewards_confirmed() -> void:
	if not _quest_currently_claiming.is_empty():
		var q_id = _quest_currently_claiming.get("id", "")
		for q in _quests:
			if q.get("id", "") == q_id:
				q["is_claimed"] = true
				var rewards_list = q.get("rewards", [])
				_total_rewards_claimed_count += rewards_list.size()
				
				# Integrate directly with Bag's user save slot so inventory gets credited!
				_credit_rewards_to_bag_inventory(rewards_list)
				break
				
		_save_quests_to_disk()
		_quest_currently_claiming = {}
		_refresh_quest_ui()
		_show_toast("Rewards successfully claimed!")

func _on_claim_all_visible_pressed() -> void:
	var claimable_visible_quests = _quests.filter(func(q):
		return q.get("category", "") == _active_tab and q.get("is_completed", false) and not q.get("is_claimed", false)
	)
	
	if claimable_visible_quests.is_empty():
		_show_toast("No ready-to-claim rewards in this section.")
		return
		
	var aggregated_rewards = []
	for q in claimable_visible_quests:
		q["is_claimed"] = true
		for r in q.get("rewards", []):
			aggregated_rewards.append(r)
			
	_total_rewards_claimed_count += aggregated_rewards.size()
	
	# Credit everything to inventory
	_credit_rewards_to_bag_inventory(aggregated_rewards)
	
	_save_quests_to_disk()
	_refresh_quest_ui()
	
	# Present first quest completion popup as visual treat
	reward_popup.call("display_rewards", "Bulk Claim Successful!", aggregated_rewards)

## Credits rewards dynamically into the bag inventory file
func _credit_rewards_to_bag_inventory(rewards: Array) -> void:
	var bag_save_path = "user://crownspire_bag_inventory_v1.save"
	var current_bag = {}
	
	if FileAccess.file_exists(bag_save_path):
		var file = FileAccess.open(bag_save_path, FileAccess.READ)
		if file:
			var content = file.get_as_text()
			file.close()
			var json = JSON.new()
			if json.parse(content) == OK:
				var data = json.get_data()
				if typeof(data) == TYPE_DICTIONARY:
					current_bag = data
					
	for r in rewards:
		var name = r.get("name", "item")
		var amount = r.get("amount", 1)
		
		# Map typical resource types to the standardized key format expected by standard inventory bags
		var bag_key = name
		if name == "food" or name == "wood" or name == "iron" or name == "stone" or name == "diamonds":
			bag_key = "resource_" + name + "_" + str(amount)
		elif name == "speedup":
			bag_key = "speedup_research_1h"
		elif name == "valkyrie_hero_shard":
			bag_key = "statue_hero_shard"
		elif name == "royal_chest":
			bag_key = "gift_box_alliance_gold"
			
		current_bag[bag_key] = current_bag.get(bag_key, 0) + amount
		
	var file = FileAccess.open(bag_save_path, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(current_bag))
		file.close()
		print("[Quests] Inter-scene synchronizer successfully credited rewards to player's inventory bag!")

# ==============================================================================
# TOAST SYSTEMS
# ==============================================================================

func _show_toast(message: String) -> void:
	toast_label.text = message
	toast_notification.visible = true
	toast_notification.modulate = Color(1, 1, 1, 0)
	
	var tween = create_tween()
	tween.tween_property(toast_notification, "modulate:a", 1.0, 0.2)
	
	_toast_timer.start()

func _on_toast_timeout() -> void:
	var tween = create_tween()
	tween.tween_property(toast_notification, "modulate:a", 0.0, 0.25)
	tween.finished.connect(func(): toast_notification.visible = false)

# ==============================================================================
# TAB ACTIONS & NAVIGATION
# ==============================================================================

func _on_tab_pressed(tab_name: String) -> void:
	if _active_tab == tab_name:
		return
	_active_tab = tab_name
	_update_tab_button_styles()
	_refresh_quest_ui()

# ==============================================================================
# STYLING METHODS
# ==============================================================================

func _get_tab_active_style() -> StyleBoxFlat:
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.192, 0.478, 0.820, 1) # Blue Accent
	style.corner_radius_top_left = 6
	style.corner_radius_top_right = 6
	style.expand_margin_bottom = 2.0
	return style

func _get_tab_inactive_style() -> StyleBoxFlat:
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.117, 0.141, 0.180, 1)
	style.border_width_left = 1
	style.border_width_top = 1
	style.border_width_right = 1
	style.border_color = Color(0.176, 0.220, 0.286, 1)
	style.corner_radius_top_left = 6
	style.corner_radius_top_right = 6
	return style

func _get_card_normal_style() -> StyleBoxFlat:
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.098, 0.117, 0.149, 1)
	style.border_width_left = 1
	style.border_width_top = 1
	style.border_width_right = 1
	style.border_width_bottom = 1
	style.border_color = Color(0.141, 0.172, 0.219, 1)
	style.corner_radius_top_left = 6
	style.corner_radius_top_right = 6
	style.corner_radius_bottom_right = 6
	style.corner_radius_bottom_left = 6
	return style

func _get_card_ready_style() -> StyleBoxFlat:
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.121, 0.160, 0.211, 1)
	style.border_width_left = 3
	style.border_width_top = 1
	style.border_width_right = 1
	style.border_width_bottom = 1
	style.border_color = Color(0.95, 0.75, 0.15, 1) # Yellow highlight border
	style.corner_radius_top_left = 6
	style.corner_radius_top_right = 6
	style.corner_radius_bottom_right = 6
	style.corner_radius_bottom_left = 6
	return style

func _get_claim_btn_style() -> StyleBoxFlat:
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.95, 0.75, 0.15, 1)
	style.corner_radius_top_left = 4
	style.corner_radius_top_right = 4
	style.corner_radius_bottom_right = 4
	style.corner_radius_bottom_left = 4
	return style

func _get_pbar_bg_style() -> StyleBoxFlat:
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.141, 0.176, 0.227, 1)
	style.corner_radius_top_left = 4
	style.corner_radius_top_right = 4
	style.corner_radius_bottom_right = 4
	style.corner_radius_bottom_left = 4
	return style

func _get_pbar_fill_style() -> StyleBoxFlat:
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.192, 0.478, 0.820, 1)
	style.corner_radius_top_left = 4
	style.corner_radius_top_right = 4
	style.corner_radius_bottom_right = 4
	style.corner_radius_bottom_left = 4
	return style

func _on_close_pressed() -> void:
	print("[Quests] Closing sovereign mission board...")
	visible = false
