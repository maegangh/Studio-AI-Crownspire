# ==============================================================================
# Crownspire MMO Strategy Game - Royal Event Center & Battle Pass Controller
# Godot 4 / GDScript 2.0 client-side event manager
# ==============================================================================

extends Control

# --- Signals ---
signal add_log_requested(text, type)
signal events_closed

# --- Save Paths ---
const EVENTS_SAVE_PATH = "user://crownspire_events_v1.save"
const BAG_SAVE_PATH = "user://crownspire_bag_inventory_v1.save"

# --- Onready Nodes ---
@onready var close_btn: Button = $Layout/Header/Margin/HBox/CloseButton
@onready var category_tab_box: HBoxContainer = $Layout/TabScroll/TabBox
@onready var events_list_box: VBoxContainer = $Layout/Content/HSplit/LeftPanel/Scroll/List

# --- Currency Counters ---
@onready var gold_label: Label = $Layout/Header/Margin/HBox/Currencies/GoldBox/Value
@onready var diamonds_label: Label = $Layout/Header/Margin/HBox/Currencies/DiamondBox/Value
@onready var vip_label: Label = $Layout/Header/Margin/HBox/Currencies/VIPBox/Value

# --- Detail View Nodes ---
@onready var right_detail_empty: PanelContainer = $Layout/Content/HSplit/RightPanel/EmptyPrompt
@onready var right_detail_normal: ScrollContainer = $Layout/Content/HSplit/RightPanel/EventDetailsScroll
@onready var right_detail_bp: ScrollContainer = $Layout/Content/HSplit/RightPanel/BPDetailsScroll

# --- Normal Event Detail Nodes ---
@onready var det_type_badge: PanelContainer = $Layout/Content/HSplit/RightPanel/EventDetailsScroll/Content/Header/TypeBadge
@onready var det_type_lbl: Label = $Layout/Content/HSplit/RightPanel/EventDetailsScroll/Content/Header/TypeBadge/Margin/Label
@onready var det_title_lbl: Label = $Layout/Content/HSplit/RightPanel/EventDetailsScroll/Content/Header/Title
@onready var det_timer_lbl: Label = $Layout/Content/HSplit/RightPanel/EventDetailsScroll/Content/Header/Timer
@onready var det_desc_lbl: Label = $Layout/Content/HSplit/RightPanel/EventDetailsScroll/Content/Desc
@onready var det_progress_bar: ProgressBar = $Layout/Content/HSplit/RightPanel/EventDetailsScroll/Content/ProgressSection/Bar
@onready var det_progress_lbl: Label = $Layout/Content/HSplit/RightPanel/EventDetailsScroll/Content/ProgressSection/HBox/Label

# --- Milestone Chest Boxes (Tiered Rewards) ---
@onready var milestone_container: HBoxContainer = $Layout/Content/HSplit/RightPanel/EventDetailsScroll/Content/MilestonesSection/Grid

# --- Simulated Action Interactive Work Panel ---
@onready var quest_container: VBoxContainer = $Layout/Content/HSplit/RightPanel/EventDetailsScroll/Content/ActionsSection/QuestList

# --- Leaderboard Panel ---
@onready var leaderboard_container: VBoxContainer = $Layout/Content/HSplit/RightPanel/EventDetailsScroll/Content/LeaderboardSection/LeaderboardList

# --- Battle Pass Nodes ---
@onready var bp_progress_bar: ProgressBar = $Layout/Content/HSplit/RightPanel/BPDetailsScroll/Content/Header/ProgressBox/Bar
@onready var bp_level_lbl: Label = $Layout/Content/HSplit/RightPanel/BPDetailsScroll/Content/Header/ProgressBox/LevelLbl
@onready var bp_xp_lbl: Label = $Layout/Content/HSplit/RightPanel/BPDetailsScroll/Content/Header/ProgressBox/XpLbl
@onready var bp_unlock_premium_btn: Button = $Layout/Content/HSplit/RightPanel/BPDetailsScroll/Content/Header/UnlockPremiumBtn
@onready var bp_gain_xp_btn: Button = $Layout/Content/HSplit/RightPanel/BPDetailsScroll/Content/Header/GainXpBtn
@onready var bp_list_container: VBoxContainer = $Layout/Content/HSplit/RightPanel/BPDetailsScroll/Content/TiersSection/TiersList

# --- Toast System ---
@onready var toast_notification: PanelContainer = $ToastNotification
@onready var toast_label: Label = $ToastNotification/ToastLabel

# --- Internal State Database ---
var _inventory: Dictionary = {}
var _events_db: Dictionary = {}
var _active_category: String = "All"
var _selected_event_id: String = ""
var _toast_timer: Timer
var _infernal_beast_active_track: String = "personal_contribution"
var _selected_rookie_day: int = 1
var sovereign_detail_scroll: ScrollContainer = null

# --- Master Category Listing ---
const CATEGORIES = ["All", "Server", "Alliance", "Personal", "Season", "Battle Pass"]

# --- Simulated Timer Seconds ---
var _simulated_timers: Dictionary = {
	"server_fortification": 124200.0, # ~34 hours
	"alliance_frontier": 41800.0,     # ~11 hours
	"personal_speedup": 18200.0,      # ~5 hours
	"season_magma": 348200.0          # ~96 hours
}

# --- Event Configurations ---
var _events_catalog: Dictionary = {
	"server_fortification": {
		"id": "server_fortification",
		"type": "server",
		"name": "Crownspire Sovereign Inauguration",
		"desc": "The Celestial Spire prepares to crown its first true king. All Lords in the continent must construct fortress bastions, fortify walls, and expand territory bounds to sustain the realm's ascension.",
		"max_target": 12000,
		"milestones": [
			{"target": 2000, "reward_id": "resource_food_100k", "amount": 5, "desc": "5x 100k Food Packs"},
			{"target": 6000, "reward_id": "speedup_construction_1h", "amount": 8, "desc": "8x 1h Builders"},
			{"target": 12000, "reward_id": "resource_diamond_1000", "amount": 3, "desc": "3,000 Diamonds"}
		],
		"actions": [
			{"id": "sf_wall", "label": "Upgrade City Walls & Bastions", "points": 1500, "desc": "Contribute 250k Wood to erect heavy bastion fortifications."},
			{"id": "sf_guards", "label": "Draft Sovereign Elite Sentinels", "points": 800, "desc": "Train high-tier garrison infantry to defend inner courtyards."}
		],
		"rivals": [
			{"name": "Sovereign Ronald", "alliance": "VALR", "score": 11500},
			{"name": "Queen Maegan", "alliance": "CSTLE", "score": 9800},
			{"name": "Duke Alistair", "alliance": "SVRN", "score": 8200},
			{"name": "Baron Cedric", "alliance": "VNGD", "score": 5400}
		]
	},
	"alliance_frontier": {
		"id": "alliance_frontier",
		"type": "alliance",
		"name": "Wasteland Frontier Alliance Rally",
		"desc": "Coordinate active campaign marches with your alliance brothers. Cleanse peripheral rogue bandit outposts, capture deep obsidian mines, and erect territory towers to dominate the sector.",
		"max_target": 8000,
		"milestones": [
			{"target": 1500, "reward_id": "resource_stone_50k", "amount": 6, "desc": "6x 50k Granite Slates"},
			{"target": 4000, "reward_id": "speedup_training_1h", "amount": 6, "desc": "6x 1h Training Orders"},
			{"target": 8000, "reward_id": "statue_hero_shard", "amount": 6, "desc": "6x Valkyrie Shards"}
		],
		"actions": [
			{"id": "af_outpost", "label": "Launch Coalition Rally on Outpost", "points": 1000, "desc": "Deploy active war march to eliminate high-level rogue fortresses."},
			{"id": "af_funds", "label": "Donate Tech Resources to Treasury", "points": 500, "desc": "Inject raw minerals to speed up active Alliance research."}
		],
		"rivals": [
			{"name": "Lord Brandon", "alliance": "VALR", "score": 7800},
			{"name": "Lady Cassandra", "alliance": "CSTLE", "score": 6200},
			{"name": "Prince Daniel", "alliance": "SVRN", "score": 3900},
			{"name": "Elder Gabriel", "alliance": "VNGD", "score": 2100}
		]
	},
	"personal_speedup": {
		"id": "personal_speedup",
		"type": "personal",
		"name": "Lord's Solo Apex Speed-Up Boost",
		"desc": "Unleash speed boosters and universal construction scrolls. Fast-track your academy tech branches and resource quarries to prove your personal kingdom optimization is the finest in the realm.",
		"max_target": 6000,
		"milestones": [
			{"target": 1000, "reward_id": "resource_iron_25k", "amount": 6, "desc": "6x 25k Iron Ore"},
			{"target": 3000, "reward_id": "speedup_research_1h", "amount": 8, "desc": "8x 1h Research Scrolls"},
			{"target": 6000, "reward_id": "crafting_stardust_gem", "amount": 8, "desc": "8x Forge Crystals"}
		],
		"actions": [
			{"id": "ps_universal", "label": "Trigger 1-Hour Speed Booster", "points": 400, "desc": "Deploy rush scrolls to complete current queue projects instantly."},
			{"id": "ps_academy", "label": "Decrypt High Military Academy Tech", "points": 1000, "desc": "Complete deep tech research to increase army defense ratios."}
		],
		"rivals": [
			{"name": "Lord Michael", "alliance": "SVRN", "score": 5800},
			{"name": "Valkyrie Sarah", "alliance": "VALR", "score": 4200},
			{"name": "Sir Robert", "alliance": "VNGD", "score": 3100},
			{"name": "Earl Arthur", "alliance": "CSTLE", "score": 1500}
		]
	},
	"season_magma": {
		"id": "season_magma",
		"type": "season",
		"name": "Magma Overlord Volcanic Scourge",
		"desc": "Deep magma ruptures have awakened Fire Giant generals. Coordinate Realm defense lines, erect frost-canopies over boundary cities, and banish magma invaders to extract volcanic Obsidian forging plates.",
		"max_target": 15000,
		"milestones": [
			{"target": 3000, "reward_id": "resource_wood_100k", "amount": 10, "desc": "10x 100k Wood Packs"},
			{"target": 8000, "reward_id": "crafting_obsidian", "amount": 5, "desc": "5x Volcanic Obsidian Plates"},
			{"target": 15000, "reward_id": "cosmetic_neon_frame", "amount": 1, "desc": "Neon Cybernetic Frame"}
		],
		"actions": [
			{"id": "sm_giant", "label": "Banish Magma Giant Invader", "points": 1500, "desc": "Simulate heavy defensive tactics against magma siege behemoths."},
			{"id": "sm_shield", "label": "Deploy Frost-Dome Thermic Shields", "points": 600, "desc": "Erect thermal boundary devices adjacent to volcanic fissures."}
		],
		"rivals": [
			{"name": "Emperor Zhao", "alliance": "DRGN", "score": 14200},
			{"name": "Warlord Ragnar", "alliance": "NORSE", "score": 12800},
			{"name": "Grandmaster Luke", "alliance": "VALR", "score": 9500},
			{"name": "Dutchess Helen", "alliance": "CSTLE", "score": 5100}
		]
	},
	"event_infernal_beast": {
		"id": "event_infernal_beast",
		"type": "alliance",
		"name": "Infernal Beast",
		"desc": "An ancient, molten leviathan rises from the Abyssal Core. Defeat Wildlings and Ancient Beast Lairs to earn Infernal Sigils. Donate Sigils to level up the Infernal Altar and unlock up to +20% damage multipliers for your Alliance's 30-minute boss battle!",
		"max_target": 10000,
		"milestones": [
			{"target": 100, "reward_id": "resource_food_100k", "amount": 2, "desc": "2x 100k Food Packs"},
			{"target": 500, "reward_id": "speedup_universal_1h", "amount": 5, "desc": "5x 1h Speedups"},
			{"target": 1000, "reward_id": "resource_diamond_1000", "amount": 1, "desc": "1,000 Diamonds"},
			{"target": 2500, "reward_id": "speedup_universal_1h", "amount": 10, "desc": "10x 1h Speedups"},
			{"target": 5000, "reward_id": "resource_diamond_1000", "amount": 2, "desc": "2,000 Diamonds"}
		],
		"actions": [],
		"rivals": [
			{"name": "VALR Alliance", "alliance": "VALR", "score": 8400},
			{"name": "CSTLE Alliance", "alliance": "CSTLE", "score": 6200},
			{"name": "SVRN Alliance", "alliance": "SVRN", "score": 3900}
		]
	},
	"sovereigns_journey": {
		"id": "sovereigns_journey",
		"type": "personal",
		"name": "SOVEREIGN'S JOURNEY",
		"desc": "A 7-Day Rookie Event guiding new Sovereigns through Crownspire's core systems with progression rewards, resources, speedups, and the exclusive Founding Sovereign Avatar Frame.",
		"max_target": 45,
		"milestones": [
			{"target": 10, "reward_id": "resource_diamond_1000", "amount": 1, "desc": "300 Royal Crystals"},
			{"target": 20, "reward_id": "resource_diamond_1000", "amount": 1, "desc": "500 Royal Crystals"},
			{"target": 30, "reward_id": "resource_diamond_1000", "amount": 1, "desc": "800 Royal Crystals"},
			{"target": 40, "reward_id": "resource_diamond_1000", "amount": 1, "desc": "1200 Royal Crystals"},
			{"target": 45, "reward_id": "founding_sovereign_frame", "amount": 1, "desc": "Founding Sovereign Frame + 2,000 Crystals"}
		],
		"actions": [],
		"rivals": []
	}
}

# --- Battle Pass Levels Config ---
var _bp_catalog: Array = [
	{
		"level": 1,
		"xp_needed": 1000,
		"free_reward": {"id": "resource_food_100k", "amount": 2, "desc": "2x 100k Food Packs"},
		"premium_reward": {"id": "resource_diamond_1000", "amount": 1, "desc": "1,000 Diamonds"}
	},
	{
		"level": 2,
		"xp_needed": 1000,
		"free_reward": {"id": "speedup_universal_5m", "amount": 15, "desc": "15x 5m Speedups"},
		"premium_reward": {"id": "statue_hero_shard", "amount": 3, "desc": "3x Valkyrie Shards"}
	},
	{
		"level": 3,
		"xp_needed": 1000,
		"free_reward": {"id": "resource_stone_50k", "amount": 4, "desc": "4x 50k Stones"},
		"premium_reward": {"id": "crafting_stardust_gem", "amount": 3, "desc": "3x Forge Crystals"}
	},
	{
		"level": 4,
		"xp_needed": 1000,
		"free_reward": {"id": "speedup_construction_1h", "amount": 3, "desc": "3x 1h Builders"},
		"premium_reward": {"id": "crafting_obsidian", "amount": 2, "desc": "2x Volcanic Obsidian"}
	},
	{
		"level": 5,
		"xp_needed": 1000,
		"free_reward": {"id": "resource_diamond_1000", "amount": 1, "desc": "1,000 Diamonds"},
		"premium_reward": {"id": "cosmetic_castle_skin_lava", "amount": 1, "desc": "Volcanic Citadels Skin"}
	}
]

# ==============================================================================
# LIFECYCLE INITIALIZATION
# ==============================================================================

func _ready() -> void:
	print("[Events] Launching Grand Event Center & Battle Pass...")
	
	# Load client saves
	_load_inventory_state()
	_load_events_state()
	
	# Toast timer
	_toast_timer = Timer.new()
	_toast_timer.one_shot = true
	_toast_timer.wait_time = 2.5
	_toast_timer.timeout.connect(_on_toast_timeout)
	add_child(_toast_timer)
	
	# Close signals
	close_btn.pressed.connect(_on_close_pressed)
	
	# Battle pass interactions
	bp_unlock_premium_btn.pressed.connect(_on_unlock_premium_pass_pressed)
	bp_gain_xp_btn.pressed.connect(_on_gain_bp_xp_pressed)
	
	# Layout
	_setup_horizontal_tabs()
	_refresh_overall_ui()
	
	# Auto-select first event card if list is not empty
	_select_default_event()

func _process(delta: float) -> void:
	# Tick event timers down
	for key in _simulated_timers.keys():
		_simulated_timers[key] -= delta
		if _simulated_timers[key] < 0:
			_simulated_timers[key] = 172800.0 # automatic simulated restart loop
			
	# Update active detail timers
	_update_active_timers_display()

# ==============================================================================
# DATA LOADING & PERSISTENCE
# ==============================================================================

func _load_inventory_state() -> void:
	_inventory = {}
	if FileAccess.file_exists(BAG_SAVE_PATH):
		var file = FileAccess.open(BAG_SAVE_PATH, FileAccess.READ)
		if file:
			var content = file.get_as_text()
			file.close()
			var json = JSON.new()
			if json.parse(content) == OK:
				var data = json.get_data()
				if typeof(data) == TYPE_DICTIONARY:
					_inventory = data
					
	# Fallbacks to ensure user starts with a testing balance
	var updated = false
	if not _inventory.has("diamonds"):
		_inventory["diamonds"] = 28500
		updated = true
	if not _inventory.has("gold"):
		_inventory["gold"] = 1250000
		updated = true
	if not _inventory.has("vip_points"):
		_inventory["vip_points"] = 5400
		updated = true
		
	if updated:
		_save_inventory_to_disk()

func _save_inventory_to_disk() -> void:
	var file = FileAccess.open(BAG_SAVE_PATH, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(_inventory))
		file.close()

func _load_events_state() -> void:
	_events_db = {}
	if FileAccess.file_exists(EVENTS_SAVE_PATH):
		var file = FileAccess.open(EVENTS_SAVE_PATH, FileAccess.READ)
		if file:
			var content = file.get_as_text()
			file.close()
			var json = JSON.new()
			if json.parse(content) == OK:
				var data = json.get_data()
				if typeof(data) == TYPE_DICTIONARY:
					_events_db = data
					
	# Bootstrap defaults if empty
	var updated = false
	if not _events_db.has("scores"):
		_events_db["scores"] = {
			"server_fortification": 1500,
			"alliance_frontier": 500,
			"personal_speedup": 2500,
			"season_magma": 0,
			"bp_xp": 1200 # Battle pass starts at level 2 (cumulative 1200 xp)
		}
		updated = true
		
	if not _events_db.has("claimed_milestones"):
		_events_db["claimed_milestones"] = {
			"server_fortification": [], # indices of claimed milestones
			"alliance_frontier": [],
			"personal_speedup": [],
			"season_magma": [],
			"bp_free": [],      # Level numbers of claimed rewards
			"bp_premium": []    # Level numbers of claimed rewards
		}
		updated = true
		
	if not _events_db.has("bp_premium_unlocked"):
		_events_db["bp_premium_unlocked"] = false
		updated = true
		
	if updated:
		_save_events_to_disk()

func _save_events_to_disk() -> void:
	var file = FileAccess.open(EVENTS_SAVE_PATH, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(_events_db))
		file.close()

# ==============================================================================
# UI GENERATOR & STATE REFRESHERS
# ==============================================================================

func _setup_horizontal_tabs() -> void:
	for child in category_tab_box.get_children():
		child.queue_free()
		
	for cat in CATEGORIES:
		var btn = Button.new()
		btn.text = "   " + cat + "   "
		btn.custom_minimum_size = Vector2(90, 36)
		btn.size_flags_vertical = Control.SIZE_SHRINK_CENTER
		btn.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		btn.focus_mode = Control.FOCUS_NONE
		
		var cap_cat = cat
		btn.pressed.connect(func(): _on_category_selected(cap_cat))
		category_tab_box.add_child(btn)
		
	_update_category_decorations()

func _update_category_decorations() -> void:
	var children = category_tab_box.get_children()
	for i in range(children.size()):
		var btn = children[i] as Button
		if not btn: continue
		
		var cat_name = CATEGORIES[i]
		var is_active = (cat_name == _active_category)
		
		var style = StyleBoxFlat.new()
		if is_active:
			style.bg_color = Color(0.90, 0.47, 0.08, 1) # Golden Orange Accent
			btn.add_theme_color_override("font_color", Color(1, 1, 1, 1))
		else:
			style.bg_color = Color(0.10, 0.12, 0.15, 1)
			btn.add_theme_color_override("font_color", Color(0.65, 0.70, 0.75, 1))
			
		style.corner_radius_top_left = 6
		style.corner_radius_top_right = 6
		style.corner_radius_bottom_right = 6
		style.corner_radius_bottom_left = 6
		
		btn.add_theme_stylebox_override("normal", style)
		btn.add_theme_stylebox_override("hover", style)
		btn.add_theme_stylebox_override("pressed", style)
		btn.add_theme_stylebox_override("focus", style)
		
		# Notification Badge dots for unclaimed rewards!
		for c in btn.get_children():
			if c.name == "RedAlertDot":
				c.queue_free()
				
		if _has_category_unclaimed_rewards(cat_name):
			var dot = PanelContainer.new()
			dot.name = "RedAlertDot"
			dot.custom_minimum_size = Vector2(8, 8)
			dot.size_flags_horizontal = Control.SIZE_SHRINK_END
			dot.size_flags_vertical = Control.SIZE_SHRINK_BEGIN
			
			var dot_style = StyleBoxFlat.new()
			dot_style.bg_color = Color(0.9, 0.1, 0.15, 1) # Hot Crimson
			dot_style.corner_radius_top_left = 4
			dot_style.corner_radius_top_right = 4
			dot_style.corner_radius_bottom_right = 4
			dot_style.corner_radius_bottom_left = 4
			dot.add_theme_stylebox_override("panel", dot_style)
			
			btn.add_child(dot)
			dot.set_anchors_preset(Control.PRESET_TOP_RIGHT)
			dot.position = Vector2(btn.size.x - 6, -2)

func _has_category_unclaimed_rewards(category: String) -> bool:
	if category == "All":
		for cat in ["Server", "Alliance", "Personal", "Season", "Battle Pass"]:
			if _has_category_unclaimed_rewards(cat): return true
		return false
		
	if category == "Battle Pass":
		# Check free BP rewards
		var xp = _events_db.get("scores", {}).get("bp_xp", 0)
		var current_lvl = _get_bp_level_from_xp(xp)
		var premium_unlocked = _events_db.get("bp_premium_unlocked", false)
		
		var claimed_free = _events_db.get("claimed_milestones", {}).get("bp_free", [])
		var claimed_prem = _events_db.get("claimed_milestones", {}).get("bp_premium", [])
		
		for level in range(1, current_lvl + 1):
			if level <= 5:
				if not level in claimed_free: return true
				if premium_unlocked and not level in claimed_prem: return true
		return false
		
	# Check standard catalog events
	for ev_id in _events_catalog.keys():
		var event = _events_catalog[ev_id]
		if event.get("type").to_lower() == category.to_lower():
			var score = _events_db.get("scores", {}).get(ev_id, 0)
			var claimed = _events_db.get("claimed_milestones", {}).get(ev_id, [])
			var milestones = event.get("milestones", [])
			for i in range(milestones.size()):
				if score >= milestones[i].get("target") and not i in claimed:
					return true
	return false

func _refresh_overall_ui() -> void:
	# Refresh currency counters
	var gold = _inventory.get("gold", 0)
	var diamonds = _inventory.get("diamonds", 0)
	var vip_pts = _inventory.get("vip_points", 0)
	var vip_lvl = clamp(1 + int(vip_pts / 1000.0), 1, 15)
	
	gold_label.text = "🪙 " + _format_large_number(gold)
	diamonds_label.text = "💎 " + _format_large_number(diamonds)
	vip_label.text = "👑 VIP " + str(vip_lvl)
	
	# Tabs alert dots
	_update_category_decorations()
	
	# Clear & Rebuild left event lists
	_clear_container(events_list_box)
	
	# Generate list of matches
	var matches: Array = []
	
	# Special Battle Pass list entry
	if _active_category == "All" or _active_category == "Battle Pass":
		var bp_entry = {
			"id": "battle_pass",
			"type": "battle pass",
			"name": "Vanguard Valor: Season I",
			"desc": "Advance tier stages to reap exclusive legendary equipment and stardust fragments.",
			"score": _events_db.get("scores", {}).get("bp_xp", 0) % 1000,
			"max_target": 1000,
			"rank": 3,
			"seconds_left": 348200.0 # Synced to season duration
		}
		matches.append(bp_entry)
		
	for ev_id in _events_catalog.keys():
		var cfg = _events_catalog[ev_id]
		if _active_category == "All" or cfg.get("type").to_lower() == _active_category.to_lower():
			var card_data = {
				"id": ev_id,
				"type": cfg.get("type"),
				"name": cfg.get("name"),
				"desc": cfg.get("desc"),
				"score": _events_db.get("scores", {}).get(ev_id, 0),
				"max_target": cfg.get("max_target"),
				"rank": _compute_player_rank(ev_id),
				"seconds_left": _simulated_timers.get(ev_id, 3600.0)
			}
			matches.append(card_data)
			
	for m_data in matches:
		var card_inst = preload("res://EventCard.tscn").instantiate()
		events_list_box.add_child(card_inst)
		card_inst.setup_card(m_data)
		card_inst.view_details_requested.connect(_on_event_card_selected)

func _select_default_event() -> void:
	if events_list_box.get_child_count() > 0:
		var first_card = events_list_box.get_child(0)
		if first_card:
			_on_event_card_selected(first_card._event_data.get("id"))
	else:
		_hide_all_detail_panels()

func _hide_all_detail_panels() -> void:
	right_detail_empty.visible = true
	right_detail_normal.visible = false
	right_detail_bp.visible = false
	if is_instance_valid(sovereign_detail_scroll):
		sovereign_detail_scroll.visible = false

# ==============================================================================
# DETAIL PANEL CONTROLLERS
# ==============================================================================

func _on_event_card_selected(event_id: String) -> void:
	_selected_event_id = event_id
	
	if event_id == "battle_pass":
		_open_battle_pass_details()
	elif event_id == "event_infernal_beast":
		_open_infernal_beast_details()
	elif event_id == "sovereigns_journey":
		_open_sovereigns_journey_details()
	else:
		_open_standard_event_details(event_id)

func _open_standard_event_details(event_id: String) -> void:
	right_detail_empty.visible = false
	right_detail_bp.visible = false
	right_detail_normal.visible = true
	if is_instance_valid(sovereign_detail_scroll):
		sovereign_detail_scroll.visible = false
	
	var event = _events_catalog.get(event_id)
	if not event: return
	
	det_title_lbl.text = event.get("name")
	det_desc_lbl.text = event.get("desc")
	
	# Type Badge
	var type_str = event.get("type", "personal")
	det_type_lbl.text = type_str.to_upper()
	var type_style = StyleBoxFlat.new()
	type_style.corner_radius_top_left = 4
	type_style.corner_radius_top_right = 4
	type_style.corner_radius_bottom_right = 4
	type_style.corner_radius_bottom_left = 4
	
	var accent_color = Color(0.6, 0.65, 0.7, 1)
	match type_str.to_lower():
		"server": accent_color = Color(0.9, 0.2, 0.2, 1)
		"alliance": accent_color = Color(0.19, 0.48, 0.82, 1)
		"personal": accent_color = Color(0.15, 0.68, 0.37, 1)
		"season": accent_color = Color(0.95, 0.75, 0.15, 1)
	type_style.bg_color = accent_color
	det_type_badge.add_theme_stylebox_override("panel", type_style)
	
	# Progress Math
	var score = _events_db.get("scores", {}).get(event_id, 0)
	var max_target = event.get("max_target", 1000)
	det_progress_bar.max_value = float(max_target)
	det_progress_bar.value = float(score)
	det_progress_lbl.text = "Event Target Progress: %d / %d" % [score, max_target]
	
	# Populate MileStones / Tier Rewards Grid
	_generate_milestone_widgets(event, score)
	
	# Populate Interactive Simulated Quests/Actions
	_generate_action_widgets(event)
	
	# Populate Leaderboard Grid
	_generate_leaderboard_widgets(event, score)
	
	_update_active_timers_display()

func _open_sovereigns_journey_details() -> void:
	right_detail_empty.visible = false
	right_detail_normal.visible = false
	right_detail_bp.visible = false
	
	var right_panel = $Layout/Content/HSplit/RightPanel
	if not is_instance_valid(sovereign_detail_scroll):
		sovereign_detail_scroll = ScrollContainer.new()
		sovereign_detail_scroll.name = "SovereignsJourneyScroll"
		sovereign_detail_scroll.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		sovereign_detail_scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
		right_panel.add_child(sovereign_detail_scroll)
		
	sovereign_detail_scroll.visible = true
	_clear_container(sovereign_detail_scroll)
	
	var settings_mgr = get_node_or_null("/root/SettingsManager")
	var quest_mgr = get_node_or_null("/root/QuestManager")
	if not quest_mgr:
		return
		
	# Evaluate current state objectives
	quest_mgr.check_rookie_current_state_objectives()
	
	var current_rookie_day = settings_mgr.get_rookie_event_day() if settings_mgr else 1
	var age_seconds = settings_mgr.get_account_age_seconds() if settings_mgr else 0
	
	if _selected_rookie_day > min(7, current_rookie_day):
		_selected_rookie_day = min(7, current_rookie_day)
	if _selected_rookie_day < 1:
		_selected_rookie_day = 1
		
	var main_vbox = VBoxContainer.new()
	main_vbox.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	main_vbox.add_theme_constant_override("separation", 12)
	sovereign_detail_scroll.add_child(main_vbox)
	
	# ==========================================
	# 1. HEADER BANNER CARD
	# ==========================================
	var header_panel = PanelContainer.new()
	var h_style = StyleBoxFlat.new()
	h_style.bg_color = Color(0.1, 0.12, 0.18, 0.95)
	h_style.set_corner_radius_all(8)
	h_style.border_width_top = 3
	h_style.border_color = Color(0.95, 0.75, 0.15)
	header_panel.add_theme_stylebox_override("panel", h_style)
	
	var h_margin = MarginContainer.new()
	h_margin.add_theme_constant_override("margin_left", 14)
	h_margin.add_theme_constant_override("margin_right", 14)
	h_margin.add_theme_constant_override("margin_top", 12)
	h_margin.add_theme_constant_override("margin_bottom", 12)
	header_panel.add_child(h_margin)
	
	var h_vbox = VBoxContainer.new()
	h_vbox.add_theme_constant_override("separation", 6)
	h_margin.add_child(h_vbox)
	
	# Top bar with Badge and Lifecycle Timer
	var top_bar = HBoxContainer.new()
	
	var badge_panel = PanelContainer.new()
	var b_style = StyleBoxFlat.new()
	b_style.bg_color = Color(0.15, 0.45, 0.25, 0.8)
	b_style.set_corner_radius_all(4)
	badge_panel.add_theme_stylebox_override("panel", b_style)
	var b_lbl = Label.new()
	b_lbl.text = " 👑 F2P ROOKIE EVENT "
	b_lbl.add_theme_font_size_override("font_size", 11)
	b_lbl.add_theme_color_override("font_color", Color(0.8, 1.0, 0.8))
	badge_panel.add_child(b_lbl)
	top_bar.add_child(badge_panel)
	
	var spacer = Control.new()
	spacer.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	top_bar.add_child(spacer)
	
	var timer_lbl = Label.new()
	timer_lbl.add_theme_font_size_override("font_size", 12)
	
	if age_seconds < 7 * 86400:
		var rem_sec = 7 * 86400 - age_seconds
		var d = rem_sec / 86400
		var h = (rem_sec % 86400) / 3600
		var m = (rem_sec % 3600) / 60
		timer_lbl.text = "⏳ Day Unlocks End In: %dd %02dh %02dm" % [d, h, m]
		timer_lbl.add_theme_color_override("font_color", Color(0.95, 0.75, 0.15))
	elif age_seconds < 9 * 86400:
		var rem_sec = 9 * 86400 - age_seconds
		var d = rem_sec / 86400
		var h = (rem_sec % 86400) / 3600
		var m = (rem_sec % 3600) / 60
		timer_lbl.text = "🏁 GRACE PERIOD (All Days Open): %dd %02dh %02dm" % [d, h, m]
		timer_lbl.add_theme_color_override("font_color", Color(0.3, 0.85, 1.0))
	else:
		timer_lbl.text = "❌ SOVEREIGN'S JOURNEY ENDED"
		timer_lbl.add_theme_color_override("font_color", Color(0.8, 0.3, 0.3))
		
	top_bar.add_child(timer_lbl)
	h_vbox.add_child(top_bar)
	
	var title_lbl = Label.new()
	title_lbl.text = "SOVEREIGN'S JOURNEY"
	title_lbl.add_theme_font_size_override("font_size", 20)
	title_lbl.add_theme_color_override("font_color", Color(0.98, 0.85, 0.35))
	h_vbox.add_child(title_lbl)
	
	var desc_lbl = Label.new()
	desc_lbl.text = "Complete daily progression objectives over your first 7 days to earn vital resources, speedups, hero tokens, and the exclusive Founding Sovereign Avatar Frame."
	desc_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	desc_lbl.add_theme_font_size_override("font_size", 12)
	desc_lbl.add_theme_color_override("font_color", Color(0.85, 0.85, 0.88))
	h_vbox.add_child(desc_lbl)
	
	main_vbox.add_child(header_panel)
	
	# ==========================================
	# 2. OVERALL JOURNEY TRACK & MILESTONE CHESTS
	# ==========================================
	var track_panel = PanelContainer.new()
	var t_style = StyleBoxFlat.new()
	t_style.bg_color = Color(0.08, 0.1, 0.15, 0.9)
	t_style.set_corner_radius_all(6)
	track_panel.add_theme_stylebox_override("panel", t_style)
	
	var t_margin = MarginContainer.new()
	t_margin.add_theme_constant_override("margin_left", 12)
	t_margin.add_theme_constant_override("margin_right", 12)
	t_margin.add_theme_constant_override("margin_top", 10)
	t_margin.add_theme_constant_override("margin_bottom", 10)
	track_panel.add_child(t_margin)
	
	var t_vbox = VBoxContainer.new()
	t_vbox.add_theme_constant_override("separation", 8)
	t_margin.add_child(t_vbox)
	
	var total_completed = quest_mgr.get_rookie_total_completed_count()
	
	var track_top = HBoxContainer.new()
	var track_title = Label.new()
	track_title.text = "🏆 OVERALL JOURNEY MILESTONES"
	track_title.add_theme_font_size_override("font_size", 13)
	track_title.add_theme_color_override("font_color", Color(0.95, 0.8, 0.2))
	track_top.add_child(track_title)
	
	var t_spacer = Control.new()
	t_spacer.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	track_top.add_child(t_spacer)
	
	var track_prog_lbl = Label.new()
	track_prog_lbl.text = "%d / 45 Objectives Completed" % total_completed
	track_prog_lbl.add_theme_font_size_override("font_size", 12)
	track_prog_lbl.add_theme_color_override("font_color", Color(0.9, 0.9, 0.9))
	track_top.add_child(track_prog_lbl)
	t_vbox.add_child(track_top)
	
	var p_bar = ProgressBar.new()
	p_bar.min_value = 0
	p_bar.max_value = 45
	p_bar.value = total_completed
	p_bar.custom_minimum_size.y = 14
	p_bar.show_percentage = false
	t_vbox.add_child(p_bar)
	
	# Overall Milestones Grid / Row
	var milestones_row = HBoxContainer.new()
	milestones_row.add_theme_constant_override("separation", 6)
	
	var milestones = quest_mgr.get_rookie_overall_milestones()
	for m in milestones:
		var m_box = PanelContainer.new()
		m_box.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		
		var m_style = StyleBoxFlat.new()
		m_style.set_corner_radius_all(4)
		if m["claimed"]:
			m_style.bg_color = Color(0.08, 0.18, 0.12, 0.9)
			m_style.border_width_left = 1
			m_style.border_width_top = 1
			m_style.border_width_right = 1
			m_style.border_width_bottom = 1
			m_style.border_color = Color(0.2, 0.6, 0.3)
		elif m["completed"]:
			m_style.bg_color = Color(0.22, 0.18, 0.08, 0.95)
			m_style.border_width_left = 2
			m_style.border_width_top = 2
			m_style.border_width_right = 2
			m_style.border_width_bottom = 2
			m_style.border_color = Color(0.95, 0.75, 0.15)
		else:
			m_style.bg_color = Color(0.1, 0.1, 0.12, 0.7)
			m_style.border_width_left = 1
			m_style.border_width_top = 1
			m_style.border_width_right = 1
			m_style.border_width_bottom = 1
			m_style.border_color = Color(0.25, 0.25, 0.28)
			
		m_box.add_theme_stylebox_override("panel", m_style)
		
		var mm = MarginContainer.new()
		mm.add_theme_constant_override("margin_left", 6)
		mm.add_theme_constant_override("margin_right", 6)
		mm.add_theme_constant_override("margin_top", 6)
		mm.add_theme_constant_override("margin_bottom", 6)
		m_box.add_child(mm)
		
		var mv = VBoxContainer.new()
		mv.add_theme_constant_override("separation", 4)
		mm.add_child(mv)
		
		var m_target_lbl = Label.new()
		m_target_lbl.text = "🎯 %d Obj" % int(m["target"])
		m_target_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		m_target_lbl.add_theme_font_size_override("font_size", 11)
		m_target_lbl.add_theme_color_override("font_color", Color(0.95, 0.8, 0.2) if m["completed"] else Color(0.7, 0.7, 0.7))
		mv.add_child(m_target_lbl)
		
		var m_reward_lbl = Label.new()
		if int(m["target"]) == 45:
			m_reward_lbl.text = "🖼️ Frame + 💎 2k"
			m_reward_lbl.add_theme_color_override("font_color", Color(1.0, 0.85, 0.3))
		else:
			var first_r = m["rewards"][0]
			m_reward_lbl.text = "%s %s" % [first_r.get("icon", "🎁"), first_r.get("name", "Reward")]
			m_reward_lbl.add_theme_color_override("font_color", Color(0.85, 0.85, 0.85))
		m_reward_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		m_reward_lbl.add_theme_font_size_override("font_size", 10)
		mv.add_child(m_reward_lbl)
		
		var m_btn = Button.new()
		m_btn.custom_minimum_size.y = 22
		m_btn.add_theme_font_size_override("font_size", 10)
		
		var m_idx = int(m["index"])
		if m["claimed"]:
			m_btn.text = "✓ CLAIMED"
			m_btn.disabled = true
		elif m["completed"]:
			m_btn.text = "CLAIM!"
			m_btn.pressed.connect(func():
				var rewards = quest_mgr.claim_rookie_overall_milestone(m_idx)
				if rewards.size() > 0:
					_show_toast("🏆 Overall Milestone Claimed!")
				_open_sovereigns_journey_details()
			)
		else:
			m_btn.text = "LOCKED"
			m_btn.disabled = true
			
		mv.add_child(m_btn)
		milestones_row.add_child(m_box)
		
	t_vbox.add_child(milestones_row)
	main_vbox.add_child(track_panel)
	
	# ==========================================
	# 3. DAY SELECTION TABS BAR (DAYS 1 - 7)
	# ==========================================
	var day_tabs_box = HBoxContainer.new()
	day_tabs_box.add_theme_constant_override("separation", 4)
	
	for d in range(1, 8):
		var d_btn = Button.new()
		d_btn.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		d_btn.custom_minimum_size.y = 36
		
		var is_unlocked = d <= current_rookie_day
		var comp_count = quest_mgr.get_rookie_daily_completion_count(d) if is_unlocked else 0
		
		if is_unlocked:
			d_btn.text = "DAY %d\n(%d/7)" % [d, comp_count]
			d_btn.add_theme_font_size_override("font_size", 11)
			
			if d == _selected_rookie_day:
				d_btn.add_theme_color_override("font_color", Color(1.0, 0.9, 0.3))
			else:
				d_btn.add_theme_color_override("font_color", Color(0.9, 0.9, 0.9))
				
			var d_num = d
			d_btn.pressed.connect(func():
				_selected_rookie_day = d_num
				_open_sovereigns_journey_details()
			)
		else:
			d_btn.text = "🔒 DAY %d\nLocked" % d
			d_btn.add_theme_font_size_override("font_size", 10)
			d_btn.add_theme_color_override("font_color", Color(0.5, 0.5, 0.5))
			d_btn.disabled = true
			
		day_tabs_box.add_child(d_btn)
		
	main_vbox.add_child(day_tabs_box)
	
	# ==========================================
	# 4. SELECTED DAY HEADER & DAILY CHEST
	# ==========================================
	var day_header_panel = PanelContainer.new()
	var dh_style = StyleBoxFlat.new()
	dh_style.bg_color = Color(0.12, 0.14, 0.2, 0.9)
	dh_style.set_corner_radius_all(6)
	day_header_panel.add_theme_stylebox_override("panel", dh_style)
	
	var dh_margin = MarginContainer.new()
	dh_margin.add_theme_constant_override("margin_left", 12)
	dh_margin.add_theme_constant_override("margin_right", 12)
	dh_margin.add_theme_constant_override("margin_top", 8)
	dh_margin.add_theme_constant_override("margin_bottom", 8)
	day_header_panel.add_child(dh_margin)
	
	var dh_hbox = HBoxContainer.new()
	dh_margin.add_child(dh_hbox)
	
	var day_theme_titles = [
		"",
		"DAY 1 — FOUNDATIONS OF THE CROWN",
		"DAY 2 — KNOWLEDGE & PROSPERITY",
		"DAY 3 — LEGION RISING",
		"DAY 4 — HEROES OF THE REALM",
		"DAY 5 — BEYOND THE WALLS",
		"DAY 6 — STRENGTH IN UNITY",
		"DAY 7 — RISE OF THE SOVEREIGN"
	]
	
	var dh_title = Label.new()
	dh_title.text = day_theme_titles[_selected_rookie_day] if _selected_rookie_day <= 7 else "DAY " + str(_selected_rookie_day)
	dh_title.add_theme_font_size_override("font_size", 13)
	dh_title.add_theme_color_override("font_color", Color(0.95, 0.85, 0.3))
	dh_hbox.add_child(dh_title)
	
	var dh_spacer = Control.new()
	dh_spacer.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	dh_hbox.add_child(dh_spacer)
	
	# Daily Chest Button
	var day_comp = quest_mgr.get_rookie_daily_completion_count(_selected_rookie_day)
	var chest_claimed = quest_mgr.is_rookie_daily_chest_claimed(_selected_rookie_day)
	
	var chest_btn = Button.new()
	chest_btn.custom_minimum_size.y = 28
	chest_btn.add_theme_font_size_override("font_size", 11)
	
	var target_d = _selected_rookie_day
	if chest_claimed:
		chest_btn.text = "🎁 DAY %d CHEST: CLAIMED ✓" % target_d
		chest_btn.disabled = true
	elif day_comp >= 5:
		chest_btn.text = "🎁 CLAIM DAY %d CHEST (5/5 Completed)!" % target_d
		chest_btn.pressed.connect(func():
			var r = quest_mgr.claim_rookie_daily_chest(target_d)
			if r.size() > 0:
				_show_toast("🎁 Day %d Chest Claimed!" % target_d)
			_open_sovereigns_journey_details()
		)
	else:
		chest_btn.text = "🎁 DAY %d CHEST (%d/5 Objectives)" % [target_d, day_comp]
		chest_btn.disabled = true
		
	dh_hbox.add_child(chest_btn)
	main_vbox.add_child(day_header_panel)
	
	# ==========================================
	# 5. SELECTED DAY OBJECTIVES LIST
	# ==========================================
	var day_quests = quest_mgr.get_rookie_quests_for_day(_selected_rookie_day)
	
	for q in day_quests:
		var q_card = PanelContainer.new()
		var qc_style = StyleBoxFlat.new()
		qc_style.bg_color = Color(0.1, 0.11, 0.15, 0.85)
		qc_style.set_corner_radius_all(6)
		qc_style.border_width_left = 1
		qc_style.border_width_top = 1
		qc_style.border_width_right = 1
		qc_style.border_width_bottom = 1
		
		if q["is_claimed"]:
			qc_style.border_color = Color(0.2, 0.25, 0.22)
		elif q["is_completed"]:
			qc_style.border_color = Color(0.95, 0.75, 0.15)
		else:
			qc_style.border_color = Color(0.2, 0.22, 0.28)
			
		q_card.add_theme_stylebox_override("panel", qc_style)
		
		var q_margin = MarginContainer.new()
		q_margin.add_theme_constant_override("margin_left", 12)
		q_margin.add_theme_constant_override("margin_right", 12)
		q_margin.add_theme_constant_override("margin_top", 10)
		q_margin.add_theme_constant_override("margin_bottom", 10)
		q_card.add_child(q_margin)
		
		var q_hbox = HBoxContainer.new()
		q_margin.add_child(q_hbox)
		
		var left_vbox = VBoxContainer.new()
		left_vbox.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		left_vbox.add_theme_constant_override("separation", 4)
		q_hbox.add_child(left_vbox)
		
		var q_title = Label.new()
		q_title.text = q.get("name", "Objective")
		q_title.add_theme_font_size_override("font_size", 13)
		q_title.add_theme_color_override("font_color", Color(0.95, 0.9, 0.8) if not q["is_claimed"] else Color(0.6, 0.6, 0.6))
		left_vbox.add_child(q_title)
		
		var q_desc = Label.new()
		q_desc.text = q.get("description", "")
		q_desc.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		q_desc.add_theme_font_size_override("font_size", 11)
		q_desc.add_theme_color_override("font_color", Color(0.75, 0.75, 0.78))
		left_vbox.add_child(q_desc)
		
		# Objective progress
		var objectives = q.get("objectives", []) as Array
		if objectives.size() > 0:
			var obj = objectives[0]
			var obj_curr = int(obj.get("current", 0))
			var obj_target = int(obj.get("target", 1))
			
			var obj_hbox = HBoxContainer.new()
			var obj_bar = ProgressBar.new()
			obj_bar.size_flags_horizontal = Control.SIZE_EXPAND_FILL
			obj_bar.min_value = 0
			obj_bar.max_value = obj_target
			obj_bar.value = obj_curr
			obj_bar.custom_minimum_size.y = 12
			obj_bar.show_percentage = false
			obj_hbox.add_child(obj_bar)
			
			var obj_lbl = Label.new()
			obj_lbl.text = " %d / %d" % [obj_curr, obj_target]
			obj_lbl.add_theme_font_size_override("font_size", 11)
			obj_lbl.add_theme_color_override("font_color", Color(0.85, 0.85, 0.85))
			obj_hbox.add_child(obj_lbl)
			
			left_vbox.add_child(obj_hbox)
			
		# Rewards list
		var r_hbox = HBoxContainer.new()
		r_hbox.add_theme_constant_override("separation", 8)
		for r in q.get("rewards", []):
			var r_lbl = Label.new()
			r_lbl.text = "%s %s" % [r.get("icon", "🎁"), _format_large_number(int(r.get("quantity", 1)))]
			r_lbl.add_theme_font_size_override("font_size", 10)
			r_lbl.add_theme_color_override("font_color", Color(0.9, 0.8, 0.3))
			r_hbox.add_child(r_lbl)
		left_vbox.add_child(r_hbox)
		
		# Claim Button
		var q_btn = Button.new()
		q_btn.custom_minimum_size = Vector2(100, 32)
		q_btn.add_theme_font_size_override("font_size", 11)
		
		var q_id = q["id"]
		if q["is_claimed"]:
			q_btn.text = "✓ CLAIMED"
			q_btn.disabled = true
		elif q["is_completed"]:
			q_btn.text = "CLAIM REWARD"
			q_btn.pressed.connect(func():
				var rewards = quest_mgr.claim_rewards(q_id)
				if rewards.size() > 0:
					_show_toast("✨ Objective Reward Claimed!")
				_open_sovereigns_journey_details()
			)
		else:
			q_btn.text = "IN PROGRESS"
			q_btn.disabled = true
			
		q_hbox.add_child(q_btn)
		main_vbox.add_child(q_card)
		
	# ==========================================
	# 6. DEBUG TESTING TOOLBAR
	# ==========================================
	if OS.is_debug_build():
		var debug_panel = PanelContainer.new()
		var dbg_style = StyleBoxFlat.new()
		dbg_style.bg_color = Color(0.18, 0.12, 0.08, 0.95)
		dbg_style.set_corner_radius_all(6)
		dbg_style.border_width_left = 1
		dbg_style.border_width_top = 1
		dbg_style.border_width_right = 1
		dbg_style.border_width_bottom = 1
		dbg_style.border_color = Color(0.85, 0.5, 0.15)
		debug_panel.add_theme_stylebox_override("panel", dbg_style)
		
		var dbg_margin = MarginContainer.new()
		dbg_margin.add_theme_constant_override("margin_left", 10)
		dbg_margin.add_theme_constant_override("margin_right", 10)
		dbg_margin.add_theme_constant_override("margin_top", 8)
		dbg_margin.add_theme_constant_override("margin_bottom", 8)
		debug_panel.add_child(dbg_margin)
		
		var dbg_vbox = VBoxContainer.new()
		dbg_vbox.add_theme_constant_override("separation", 6)
		dbg_margin.add_child(dbg_vbox)
		
		var dbg_title = Label.new()
		dbg_title.text = "🛠️ ROOKIE EVENT DEBUG & TESTING TOOLBAR"
		dbg_title.add_theme_font_size_override("font_size", 11)
		dbg_title.add_theme_color_override("font_color", Color(0.95, 0.65, 0.2))
		dbg_vbox.add_child(dbg_title)
		
		# Day Jump Buttons
		var row1 = HBoxContainer.new()
		row1.add_theme_constant_override("separation", 4)
		for d in range(1, 8):
			var btn = Button.new()
			btn.text = "Day %d" % d
			btn.add_theme_font_size_override("font_size", 10)
			var target_d = d
			btn.pressed.connect(func():
				if settings_mgr: settings_mgr.debug_set_rookie_day(target_d)
				_selected_rookie_day = target_d
				_open_sovereigns_journey_details()
			)
			row1.add_child(btn)
		dbg_vbox.add_child(row1)
		
		# Special Controls
		var row2 = HBoxContainer.new()
		row2.add_theme_constant_override("separation", 4)
		
		var grace_btn = Button.new()
		grace_btn.text = "Grace Period (Day 8)"
		grace_btn.add_theme_font_size_override("font_size", 10)
		grace_btn.pressed.connect(func():
			if settings_mgr: settings_mgr.debug_set_rookie_grace_period()
			_open_sovereigns_journey_details()
		)
		row2.add_child(grace_btn)
		
		var end_btn = Button.new()
		end_btn.text = "Expire Event (Day 10)"
		end_btn.add_theme_font_size_override("font_size", 10)
		end_btn.pressed.connect(func():
			if settings_mgr: settings_mgr.debug_expire_rookie_event()
			_open_sovereigns_journey_details()
		)
		row2.add_child(end_btn)
		
		var reset_btn = Button.new()
		reset_btn.text = "Reset Age Override"
		reset_btn.add_theme_font_size_override("font_size", 10)
		reset_btn.pressed.connect(func():
			if settings_mgr: settings_mgr.debug_reset_rookie_age_override()
			_open_sovereigns_journey_details()
		)
		row2.add_child(reset_btn)
		
		var auto_comp_btn = Button.new()
		auto_comp_btn.text = "Auto-Complete Current Day Obj"
		auto_comp_btn.add_theme_font_size_override("font_size", 10)
		auto_comp_btn.pressed.connect(func():
			for dq in day_quests:
				for obj in dq.get("objectives", []):
					obj["current"] = int(obj.get("target", 1))
					obj["completed"] = true
				dq["is_completed"] = true
			_open_sovereigns_journey_details()
		)
		row2.add_child(auto_comp_btn)
		
		dbg_vbox.add_child(row2)
		main_vbox.add_child(debug_panel)

func _open_infernal_beast_details() -> void:
	right_detail_empty.visible = false
	right_detail_bp.visible = false
	right_detail_normal.visible = true
	if is_instance_valid(sovereign_detail_scroll):
		sovereign_detail_scroll.visible = false
	
	var mgr = get_node_or_null("/root/InfernalBeastManager")
	if not mgr:
		return
		
	var state = mgr.state
	var status = state.get("status", "READY")
	
	det_title_lbl.text = "Infernal Beast Alliance Event"
	det_desc_lbl.text = "An ancient, molten leviathan rises from the Abyssal Core. Defeat Wildlings and Ancient Beast Lairs to earn Infernal Sigils. Donate Sigils to level up the Infernal Altar and unlock up to +20% damage multipliers for your Alliance's 30-minute boss battle!"
	det_type_lbl.text = "ALLIANCE PVE RAID"
	
	var type_style = StyleBoxFlat.new()
	type_style.bg_color = Color(0.85, 0.25, 0.15, 1.0) # Flame Red
	type_style.corner_radius_top_left = 4
	type_style.corner_radius_top_right = 4
	type_style.corner_radius_bottom_right = 4
	type_style.corner_radius_bottom_left = 4
	det_type_badge.add_theme_stylebox_override("panel", type_style)
	
	var now = Time.get_unix_time_from_system()
	if status == "COOLDOWN":
		var rem = max(0, state.get("cooldown_end_timestamp", 0) - now)
		var hrs = int(rem / 3600.0)
		var mins = int(fmod(rem, 3600.0) / 60.0)
		var secs = int(fmod(rem, 60.0))
		det_timer_lbl.text = "⏳ Cooldown: %02dh %02dm %02ds left" % [hrs, mins, secs]
	elif status == "READY":
		det_timer_lbl.text = "🔥 Status: READY TO ACTIVATE"
	elif status == "ACTIVE":
		var rem = max(0, state.get("fight_end_timestamp", 0) - now)
		var mins = int(rem / 60.0)
		var secs = int(fmod(rem, 60.0))
		det_timer_lbl.text = "⚔️ BATTLE ACTIVE: %02dm %02ds remaining" % [mins, secs]
		
	var cur_contrib = state.get("current_cycle_contribution", 0)
	var altar_info = mgr.get_altar_info(cur_contrib)
	
	det_progress_bar.max_value = float(altar_info["next_threshold"])
	det_progress_bar.value = float(cur_contrib)
	det_progress_lbl.text = "Infernal Altar: %s (Level %d) | Bonus: +%d%% | Sigils Donated: %d / %d" % [
		altar_info["name"], altar_info["level"], altar_info["bonus_pct"], cur_contrib, altar_info["next_threshold"]
	]
	
	# Populate Custom Infernal Altar Actions & Widgets
	_generate_infernal_beast_actions(mgr)
	_generate_infernal_beast_milestones(mgr)
	_generate_leaderboard_widgets(_events_catalog["event_infernal_beast"], cur_contrib)

func _generate_infernal_beast_actions(mgr: InfernalBeastManager) -> void:
	_clear_container(quest_container)
	var state = mgr.state
	var status = state.get("status", "READY")
	var cur_contrib = state.get("current_cycle_contribution", 0)
	var altar_info = mgr.get_altar_info(cur_contrib)
	var sigils = mgr.get_player_sigils()
	
	# CARD 1: INFERNAL ALTAR & MANUAL DONATIONS
	var card1 = _create_event_card_frame("🔥 INFERNAL ALTAR DONATIONS")
	var vbox1 = card1.get_child(0).get_child(0) # Margin -> VBox
	
	var info_lbl = Label.new()
	info_lbl.text = "Current Altar: %s (Lv.%d) | Current Multiplier: +%d%% Damage Bonus\nOwned Infernal Sigils: %d (Earn from Wildlings & Beast Lairs)" % [
		altar_info["name"], altar_info["level"], altar_info["bonus_pct"], sigils
	]
	info_lbl.add_theme_font_size_override("font_size", 12)
	info_lbl.add_theme_color_override("font_color", Color(0.9, 0.8, 0.6, 1))
	vbox1.add_child(info_lbl)
	
	var btn_hbox = HBoxContainer.new()
	btn_hbox.add_theme_constant_override("separation", 8)
	vbox1.add_child(btn_hbox)
	
	var amounts = [1, 10, 100, sigils]
	var labels = ["DONATE 1", "DONATE 10", "DONATE 100", "DONATE ALL (%d)" % sigils]
	
	for i in range(amounts.size()):
		var amt = amounts[i]
		if amt <= 0: continue
		var btn = Button.new()
		btn.text = labels[i]
		btn.custom_minimum_size = Vector2(110, 32)
		btn.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		btn.disabled = (sigils < amt or amt <= 0)
		btn.pressed.connect(func():
			var res = mgr.donate_sigils(amt)
			if res["success"]:
				_show_toast("Donated %d Infernal Sigils to Altar!" % amt)
				_open_infernal_beast_details()
			else:
				_show_toast(res["message"])
		)
		btn_hbox.add_child(btn)
		
	quest_container.add_child(card1)
	
	# CARD 2: LEADERSHIP ACTIVATION (If status == READY)
	if status == "READY":
		var card2 = _create_event_card_frame("⚡ ALLIANCE LEADERSHIP CONTROL")
		var vbox2 = card2.get_child(0).get_child(0)
		
		var ready_lbl = Label.new()
		ready_lbl.text = "Status: READY FOR ACTIVATION\nStarting the fight now will lock the current Altar Lv.%d (+%d%% Damage Bonus) for the 30-minute battle.\nUnused contribution beyond Lv.%d will automatically carry forward to the next cycle." % [
			altar_info["level"], altar_info["bonus_pct"], altar_info["level"]
		]
		ready_lbl.add_theme_font_size_override("font_size", 12)
		ready_lbl.add_theme_color_override("font_color", Color(0.2, 0.9, 0.4, 1))
		vbox2.add_child(ready_lbl)
		
		var start_btn = Button.new()
		start_btn.text = "🔥 START INFERNAL BEAST (R4/R5) 🔥"
		start_btn.custom_minimum_size = Vector2(240, 38)
		start_btn.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		start_btn.pressed.connect(func():
			_show_start_confirmation_dialog(mgr, altar_info)
		)
		vbox2.add_child(start_btn)
		quest_container.add_child(card2)
		
	# CARD 3: ACTIVE BATTLE PANEL (If status == ACTIVE)
	if status == "ACTIVE":
		var card3 = _create_event_card_frame("⚔️ ACTIVE INFERNAL BEAST BATTLE")
		var vbox3 = card3.get_child(0).get_child(0)
		
		var locked_lvl = state.get("altar_level_locked_for_fight", 1)
		var locked_pct = int(state.get("altar_damage_bonus_locked", 0.0) * 100.0)
		var cur_hp = state.get("boss_current_hp", 1000000000)
		var max_hp = state.get("boss_max_hp", 1000000000)
		
		var hp_bar = ProgressBar.new()
		hp_bar.max_value = float(max_hp)
		hp_bar.value = float(cur_hp)
		hp_bar.custom_minimum_size = Vector2(0, 24)
		vbox3.add_child(hp_bar)
		
		var hp_lbl = Label.new()
		hp_lbl.text = "Boss HP: %s / %s | Locked Altar Lv.%d (+%d%% Bonus)" % [
			_format_num(cur_hp), _format_num(max_hp), locked_lvl, locked_pct
		]
		hp_lbl.add_theme_font_size_override("font_size", 12)
		hp_lbl.add_theme_color_override("font_color", Color(1, 0.85, 0.3, 1))
		vbox3.add_child(hp_lbl)
		
		var p_dmg = state.get("personal_damage", {}).get("Sovereign_Player", 0)
		var a_dmg = state.get("alliance_damage", 0)
		
		var dmg_lbl = Label.new()
		dmg_lbl.text = "Your Personal Damage: %s | Alliance Total Damage: %s" % [
			_format_num(p_dmg), _format_num(a_dmg)
		]
		dmg_lbl.add_theme_font_size_override("font_size", 12)
		vbox3.add_child(dmg_lbl)
		
		var act_hbox = HBoxContainer.new()
		act_hbox.add_theme_constant_override("separation", 10)
		vbox3.add_child(act_hbox)
		
		var rally_btn = Button.new()
		rally_btn.text = "🛡️ LAUNCH / JOIN ALLIANCE RALLY"
		rally_btn.custom_minimum_size = Vector2(220, 34)
		rally_btn.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		rally_btn.pressed.connect(func():
			var rally_scene = load("res://RallyPanel.tscn")
			if rally_scene:
				var inst = rally_scene.instantiate()
				add_child(inst)
			else:
				_show_toast("Rally Panel opened for Infernal Beast!")
		)
		act_hbox.add_child(rally_btn)
		
		var atk_btn = Button.new()
		atk_btn.text = "⚔️ ATTACK BOSS (+10M DAMAGE)"
		atk_btn.custom_minimum_size = Vector2(220, 34)
		atk_btn.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		atk_btn.pressed.connect(func():
			var dealt = mgr.record_boss_damage("Sovereign_Player", 10000000, true)
			_show_toast("Dealt %s Damage to Infernal Beast (+%d%% Altar Bonus applied)!" % [_format_num(dealt), locked_pct])
			_open_infernal_beast_details()
		)
		act_hbox.add_child(atk_btn)
		
		quest_container.add_child(card3)

	# CARD 4: DEBUG TOOLKIT (If OS.is_debug_build())
	if OS.is_debug_build():
		var card_dbg = _create_event_card_frame("🛠️ DEBUG TESTING PANEL")
		var vbox_dbg = card_dbg.get_child(0).get_child(0)
		
		var dbg_grid = GridContainer.new()
		dbg_grid.columns = 3
		dbg_grid.add_theme_constant_override("h_separation", 8)
		dbg_grid.add_theme_constant_override("v_separation", 8)
		vbox_dbg.add_child(dbg_grid)
		
		var dbg_actions = [
			{"name": "+100 Sigils", "fn": func(): mgr.debug_add_sigils(100)},
			{"name": "+1,000 Sigils", "fn": func(): mgr.debug_add_sigils(1000)},
			{"name": "Donate Next Level", "fn": func(): mgr.debug_donate_next_level()},
			{"name": "Set READY State", "fn": func(): mgr.debug_set_ready()},
			{"name": "Force Start Fight", "fn": func(): mgr.debug_start_fight()},
			{"name": "+50M Boss Damage", "fn": func(): mgr.debug_add_boss_damage(50000000)},
			{"name": "End Fight (Cooldown)", "fn": func(): mgr.debug_end_fight()},
			{"name": "Complete Full Cycle", "fn": func(): mgr.debug_complete_cycle()},
			{"name": "Reset Cycle Progress", "fn": func(): mgr.debug_new_cycle()}
		]
		
		for act in dbg_actions:
			var btn = Button.new()
			btn.text = act["name"]
			btn.custom_minimum_size = Vector2(130, 28)
			btn.pressed.connect(func():
				act["fn"].call()
				_open_infernal_beast_details()
			)
			dbg_grid.add_child(btn)
			
		quest_container.add_child(card_dbg)

func _create_event_card_frame(title: String) -> PanelContainer:
	var panel = PanelContainer.new()
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.12, 0.15, 0.18, 1.0)
	style.border_width_left = 1
	style.border_width_top = 1
	style.border_width_right = 1
	style.border_width_bottom = 1
	style.border_color = Color(0.25, 0.3, 0.35, 1.0)
	style.corner_radius_top_left = 6
	style.corner_radius_top_right = 6
	style.corner_radius_bottom_right = 6
	style.corner_radius_bottom_left = 6
	panel.add_theme_stylebox_override("panel", style)
	
	var margin = MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 12)
	margin.add_theme_constant_override("margin_top", 10)
	margin.add_theme_constant_override("margin_right", 12)
	margin.add_theme_constant_override("margin_bottom", 10)
	panel.add_child(margin)
	
	var vbox = VBoxContainer.new()
	vbox.add_theme_constant_override("separation", 8)
	margin.add_child(vbox)
	
	var title_lbl = Label.new()
	title_lbl.text = title
	title_lbl.add_theme_font_size_override("font_size", 14)
	title_lbl.add_theme_color_override("font_color", Color(0.95, 0.75, 0.15, 1))
	vbox.add_child(title_lbl)
	
	return panel

func _show_start_confirmation_dialog(mgr: InfernalBeastManager, altar_info: Dictionary) -> void:
	var cur = mgr.state.get("current_cycle_contribution", 0)
	var used = altar_info["threshold"]
	var carry = max(0, cur - used)
	
	var msg = "CONFIRM INFERNAL BEAST ACTIVATION\n\n" + \
		"Current Altar: %s (Lv.%d)\n" % [altar_info["name"], altar_info["level"]] + \
		"Locked Damage Multiplier: +%d%%\n" % altar_info["bonus_pct"] + \
		"Current Contribution: %d Sigils\n" % cur + \
		"Contribution Consumed: %d Sigils\n" % used + \
		"Carryover to Next Cycle: %d Sigils\n" % carry + \
		"Fight Duration: 30 Minutes\n\n" + \
		"Are you sure you want to activate the Infernal Beast fight now?"
		
	var confirm_popup = ConfirmationDialog.new()
	confirm_popup.title = "Activate Infernal Beast"
	confirm_popup.dialog_text = msg
	add_child(confirm_popup)
	confirm_popup.popup_centered()
	
	confirm_popup.confirmed.connect(func():
		var res = mgr.start_fight("R5")
		if res["success"]:
			_show_toast("Infernal Beast Activated! 30-minute fight started.")
			_open_infernal_beast_details()
		else:
			_show_toast(res["message"])
		confirm_popup.queue_free()
	)
	confirm_popup.canceled.connect(func():
		confirm_popup.queue_free()
	)

func _generate_infernal_beast_milestones(mgr: InfernalBeastManager) -> void:
	_clear_container(milestone_container)
	
	# Track Selector Tabs HBox
	var track_names = ["personal_contribution", "personal_damage", "alliance_damage"]
	var track_labels = ["Personal Contribution", "Personal Damage", "Alliance Damage"]
	
	var track_hbox = HBoxContainer.new()
	track_hbox.add_theme_constant_override("separation", 8)
	
	for i in range(track_names.size()):
		var t_name = track_names[i]
		var btn = Button.new()
		btn.text = track_labels[i]
		btn.custom_minimum_size = Vector2(140, 28)
		if t_name == _infernal_beast_active_track:
			btn.add_theme_color_override("font_color", Color(0.95, 0.75, 0.15, 1))
		btn.pressed.connect(func():
			_infernal_beast_active_track = t_name
			_generate_infernal_beast_milestones(mgr)
		)
		track_hbox.add_child(btn)
		
	milestone_container.add_child(track_hbox)
	
	var list = mgr.MILESTONES.get(_infernal_beast_active_track, [])
	for idx in range(list.size()):
		var m = list[idx]
		var target = m["target"]
		var desc = m["desc"]
		var claimed = mgr.is_milestone_claimed(_infernal_beast_active_track, idx)
		var can_claim = mgr.can_claim_milestone(_infernal_beast_active_track, idx)
		
		var cell = PanelContainer.new()
		cell.custom_minimum_size = Vector2(130, 110)
		
		var style = StyleBoxFlat.new()
		style.bg_color = Color(0.12, 0.15, 0.18, 1.0)
		style.corner_radius_top_left = 6
		style.corner_radius_top_right = 6
		style.corner_radius_bottom_right = 6
		style.corner_radius_bottom_left = 6
		style.border_width_left = 1; style.border_width_top = 1; style.border_width_right = 1; style.border_width_bottom = 1
		
		if claimed: style.border_color = Color(0.3, 0.35, 0.4, 1)
		elif can_claim: style.border_color = Color(0.95, 0.75, 0.15, 1)
		else: style.border_color = Color(0.2, 0.25, 0.3, 1)
		cell.add_theme_stylebox_override("panel", style)
		
		var vbox = VBoxContainer.new()
		vbox.add_theme_constant_override("separation", 4)
		vbox.alignment = BoxContainer.ALIGNMENT_CENTER
		cell.add_child(vbox)
		
		var t_lbl = Label.new()
		t_lbl.text = "TIER %d\n%s" % [idx + 1, _format_num(target)]
		t_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		t_lbl.add_theme_font_size_override("font_size", 10)
		vbox.add_child(t_lbl)
		
		var d_lbl = Label.new()
		d_lbl.text = desc
		d_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		d_lbl.add_theme_font_size_override("font_size", 9)
		d_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		vbox.add_child(d_lbl)
		
		var c_btn = Button.new()
		c_btn.custom_minimum_size = Vector2(100, 24)
		c_btn.focus_mode = Control.FOCUS_NONE
		
		if claimed:
			c_btn.text = "CLAIMED"
			c_btn.disabled = true
		elif can_claim:
			c_btn.text = "CLAIM"
			c_btn.add_theme_color_override("font_color", Color(0.15, 0.9, 0.3, 1))
			c_btn.pressed.connect(func():
				var res = mgr.claim_milestone(_infernal_beast_active_track, idx)
				if res["success"]:
					_show_toast("Claimed: " + res["reward_desc"])
					_generate_infernal_beast_milestones(mgr)
				else:
					_show_toast(res["message"])
			)
		else:
			c_btn.text = "LOCKED"
			c_btn.disabled = true
			
		vbox.add_child(c_btn)
		milestone_container.add_child(cell)

func _generate_milestone_widgets(event: Dictionary, current_score: int) -> void:
	_clear_container(milestone_container)
	
	var event_id = event.get("id")
	var milestones = event.get("milestones", [])
	var claimed_list = _events_db.get("claimed_milestones", {}).get(event_id, [])
	
	for idx in range(milestones.size()):
		var m = milestones[idx]
		var target = m.get("target")
		var reached = current_score >= target
		var claimed = idx in claimed_list
		
		var cell = PanelContainer.new()
		cell.custom_minimum_size = Vector2(160, 110)
		cell.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		
		# Styling cell
		var cell_style = StyleBoxFlat.new()
		cell_style.corner_radius_top_left = 8
		cell_style.corner_radius_top_right = 8
		cell_style.corner_radius_bottom_right = 8
		cell_style.corner_radius_bottom_left = 8
		cell_style.bg_color = Color(0.12, 0.15, 0.18, 1)
		
		if claimed:
			cell_style.border_width_left = 1
			cell_style.border_width_top = 1
			cell_style.border_width_right = 1
			cell_style.border_width_bottom = 1
			cell_style.border_color = Color(0.25, 0.3, 0.35, 1)
		elif reached:
			cell_style.border_width_left = 1
			cell_style.border_width_top = 1
			cell_style.border_width_right = 1
			cell_style.border_width_bottom = 1
			cell_style.border_color = Color(0.95, 0.75, 0.15, 1) # Gold glow
		else:
			cell_style.border_width_left = 1
			cell_style.border_width_top = 1
			cell_style.border_width_right = 1
			cell_style.border_width_bottom = 1
			cell_style.border_color = Color(0.18, 0.22, 0.28, 1)
			
		cell.add_theme_stylebox_override("panel", cell_style)
		
		var cell_vbox = VBoxContainer.new()
		cell_vbox.add_theme_constant_override("separation", 4)
		cell_vbox.alignment = BoxContainer.ALIGNMENT_CENTER
		cell.add_child(cell_vbox)
		
		var tier_lbl = Label.new()
		tier_lbl.text = "TIER %d - %d Pts" % [idx + 1, target]
		tier_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		tier_lbl.add_theme_font_size_override("font_size", 10)
		tier_lbl.add_theme_color_override("font_color", Color(0.95, 0.75, 0.15, 1) if reached else Color(0.55, 0.60, 0.65, 1))
		cell_vbox.add_child(tier_lbl)
		
		# Emoji chest icon
		var emoji_lbl = Label.new()
		if claimed:
			emoji_lbl.text = "📭" # opened
		elif reached:
			emoji_lbl.text = "🎁" # shiny gift
		else:
			emoji_lbl.text = "🔒" # locked
		emoji_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		emoji_lbl.add_theme_font_size_override("font_size", 22)
		cell_vbox.add_child(emoji_lbl)
		
		var reward_lbl = Label.new()
		reward_lbl.text = m.get("desc")
		reward_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		reward_lbl.add_theme_font_size_override("font_size", 10)
		reward_lbl.add_theme_color_override("font_color", Color(0.8, 0.85, 0.9, 1))
		reward_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		cell_vbox.add_child(reward_lbl)
		
		# Claim button
		var claim_btn = Button.new()
		claim_btn.custom_minimum_size = Vector2(100, 24)
		claim_btn.size_flags_horizontal = Control.SIZE_SHRINK_CENTER
		claim_btn.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		claim_btn.focus_mode = Control.FOCUS_NONE
		claim_btn.add_theme_font_size_override("font_size", 10)
		
		var btn_style = StyleBoxFlat.new()
		btn_style.corner_radius_top_left = 4
		btn_style.corner_radius_top_right = 4
		btn_style.corner_radius_bottom_right = 4
		btn_style.corner_radius_bottom_left = 4
		
		if claimed:
			claim_btn.text = "Claimed"
			claim_btn.disabled = true
			btn_style.bg_color = Color(0.18, 0.20, 0.23, 1)
		elif reached:
			claim_btn.text = "Claim Reward"
			btn_style.bg_color = Color(0.15, 0.55, 0.30, 1) # Green claimable
			claim_btn.pressed.connect(func(): _claim_milestone_reward(event_id, idx))
		else:
			claim_btn.text = "Locked"
			claim_btn.disabled = true
			btn_style.bg_color = Color(0.20, 0.24, 0.28, 1)
			
		claim_btn.add_theme_stylebox_override("normal", btn_style)
		claim_btn.add_theme_stylebox_override("disabled", btn_style)
		claim_btn.add_theme_stylebox_override("hover", btn_style)
		claim_btn.add_theme_stylebox_override("pressed", btn_style)
		
		cell_vbox.add_child(claim_btn)
		milestone_container.add_child(cell)

func _claim_milestone_reward(event_id: String, milestone_idx: int) -> void:
	var event = _events_catalog.get(event_id)
	if not event: return
	
	var milestone = event.get("milestones")[milestone_idx]
	var reward_id = milestone.get("reward_id")
	var amount = milestone.get("amount")
	
	# Add index to claimed lists
	var claimed = _events_db.get("claimed_milestones", {}).get(event_id, [])
	if not milestone_idx in claimed:
		claimed.append(milestone_idx)
		
	# Flush to Bag inventory state
	_credit_reward_item_to_bag(reward_id, amount)
	_save_events_to_disk()
	
	var reward_msg = "Milestone tier claimed! Obtained %d [%s]." % [amount, milestone.get("desc")]
	_show_toast(reward_msg)
	add_log_requested.emit(reward_msg, "success")
	
	# Rebuild Details & Left panel list
	_open_standard_event_details(event_id)
	_refresh_overall_ui()

func _credit_reward_item_to_bag(reward_id: String, amount: int) -> void:
	if reward_id == "resource_diamond_1000":
		_inventory["diamonds"] = _inventory.get("diamonds", 0) + (amount * 1000)
	elif "vip_points_high_decree" in reward_id:
		_inventory["vip_points"] = _inventory.get("vip_points", 0) + (amount * 1000)
	elif "vip_points_100" in reward_id:
		_inventory["vip_points"] = _inventory.get("vip_points", 0) + (amount * 100)
	elif "vip_points" in reward_id:
		_inventory["vip_points"] = _inventory.get("vip_points", 0) + amount
	else:
		_inventory[reward_id] = _inventory.get(reward_id, 0) + amount
		
	_save_inventory_to_disk()

func _generate_action_widgets(event: Dictionary) -> void:
	_clear_container(quest_container)
	
	var actions = event.get("actions", [])
	for act in actions:
		var panel = PanelContainer.new()
		var p_style = StyleBoxFlat.new()
		p_style.bg_color = Color(0.12, 0.14, 0.18, 1)
		p_style.corner_radius_top_left = 6
		p_style.corner_radius_top_right = 6
		p_style.corner_radius_bottom_right = 6
		p_style.corner_radius_bottom_left = 6
		p_style.border_width_left = 2
		p_style.border_color = Color(0.2, 0.25, 0.32, 1)
		panel.add_theme_stylebox_override("panel", p_style)
		
		var margin = MarginContainer.new()
		margin.add_theme_constant_override("margin_left", 12)
		margin.add_theme_constant_override("margin_right", 12)
		margin.add_theme_constant_override("margin_top = ", 8) # Wait, simple syntax
		margin.add_theme_constant_override("margin_top", 8)
		margin.add_theme_constant_override("margin_bottom", 8)
		panel.add_child(margin)
		
		var hbox = HBoxContainer.new()
		hbox.add_theme_constant_override("separation", 10)
		margin.add_child(hbox)
		
		var vbox = VBoxContainer.new()
		vbox.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		vbox.add_theme_constant_override("separation", 2)
		hbox.add_child(vbox)
		
		var title_lbl = Label.new()
		title_lbl.text = act.get("label")
		title_lbl.add_theme_color_override("font_color", Color(1, 1, 1, 1))
		title_lbl.add_theme_font_size_override("font_size", 12)
		vbox.add_child(title_lbl)
		
		var desc_lbl = Label.new()
		desc_lbl.text = act.get("desc")
		desc_lbl.add_theme_color_override("font_color", Color(0.55, 0.60, 0.65, 1))
		desc_lbl.add_theme_font_size_override("font_size", 11)
		desc_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		vbox.add_child(desc_lbl)
		
		var points_btn = Button.new()
		points_btn.text = "+%d Points" % act.get("points")
		points_btn.custom_minimum_size = Vector2(110, 28)
		points_btn.size_flags_vertical = Control.SIZE_SHRINK_CENTER
		points_btn.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		points_btn.focus_mode = Control.FOCUS_NONE
		points_btn.add_theme_font_size_override("font_size", 11)
		
		var btn_style = StyleBoxFlat.new()
		btn_style.bg_color = Color(0.19, 0.48, 0.82, 1) # Royal blue
		btn_style.corner_radius_top_left = 5
		btn_style.corner_radius_top_right = 5
		btn_style.corner_radius_bottom_right = 5
		btn_style.corner_radius_bottom_left = 5
		points_btn.add_theme_stylebox_override("normal", btn_style)
		points_btn.add_theme_stylebox_override("hover", btn_style)
		
		var pts = act.get("points")
		var act_lbl = act.get("label")
		var ev_id = event.get("id")
		points_btn.pressed.connect(func(): _on_quest_action_simulated(ev_id, act_lbl, pts))
		
		hbox.add_child(points_btn)
		quest_container.add_child(panel)

func _on_quest_action_simulated(event_id: String, action_label: String, points: int) -> void:
	var scores = _events_db.get("scores", {})
	var current = scores.get(event_id, 0)
	var cfg = _events_catalog.get(event_id)
	if not cfg: return
	
	var max_target = cfg.get("max_target")
	var newly_added = current + points
	
	# Cap at maximum event target bounds
	newly_added = min(newly_added, max_target)
	scores[event_id] = newly_added
	
	_save_events_to_disk()
	
	var log_str = "Simulated action [%s] completed! Earned +%d points towards event." % [action_label, points]
	_show_toast(log_str)
	add_log_requested.emit(log_str, "info")
	
	# Refresh layout details & lists
	_open_standard_event_details(event_id)
	_refresh_overall_ui()

func _generate_leaderboard_widgets(event: Dictionary, current_score: int) -> void:
	_clear_container(leaderboard_container)
	
	# Assemble dynamic list including user
	var list: Array = []
	var user_node = {
		"name": "Sovereign Maegan (You)",
		"alliance": _get_alliance_tag(),
		"score": current_score,
		"is_player": true
	}
	list.append(user_node)
	
	var rivals = event.get("rivals", [])
	for r in rivals:
		list.append({
			"name": r.get("name"),
			"alliance": r.get("alliance"),
			"score": r.get("score"),
			"is_player": false
		})
		
	# Sort by score descending
	list.sort_custom(func(a, b): return a.get("score") > b.get("score"))
	
	# Render top entries
	for idx in range(list.size()):
		var entry = list[idx]
		var rank = idx + 1
		
		var panel = PanelContainer.new()
		var p_style = StyleBoxFlat.new()
		
		if entry.get("is_player"):
			p_style.bg_color = Color(0.18, 0.22, 0.28, 1) # Highlight player line
			p_style.border_width_left = 2
			p_style.border_color = Color(0.95, 0.75, 0.15, 1) # Gold highlight border
		else:
			p_style.bg_color = Color(0.08, 0.10, 0.12, 1)
			
		p_style.corner_radius_top_left = 4
		p_style.corner_radius_top_right = 4
		p_style.corner_radius_bottom_right = 4
		p_style.corner_radius_bottom_left = 4
		panel.add_theme_stylebox_override("panel", p_style)
		
		var margin = MarginContainer.new()
		margin.add_theme_constant_override("margin_left", 12)
		margin.add_theme_constant_override("margin_right", 12)
		margin.add_theme_constant_override("margin_top", 4)
		margin.add_theme_constant_override("margin_bottom", 4)
		panel.add_child(margin)
		
		var hbox = HBoxContainer.new()
		margin.add_child(hbox)
		
		# Rank number tag
		var rank_lbl = Label.new()
		rank_lbl.custom_minimum_size = Vector2(30, 0)
		if rank == 1: rank_lbl.text = "🥇"
		elif rank == 2: rank_lbl.text = "🥈"
		elif rank == 3: rank_lbl.text = "🥉"
		else: rank_lbl.text = "#" + str(rank)
		rank_lbl.add_theme_font_size_override("font_size", 11)
		rank_lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		hbox.add_child(rank_lbl)
		
		# Player name
		var name_lbl = Label.new()
		name_lbl.text = "[%s] %s" % [entry.get("alliance"), entry.get("name")]
		name_lbl.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		name_lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		name_lbl.add_theme_font_size_override("font_size", 11)
		if entry.get("is_player"):
			name_lbl.add_theme_color_override("font_color", Color(0.95, 0.75, 0.15, 1))
		else:
			name_lbl.add_theme_color_override("font_color", Color(0.85, 0.90, 0.95, 1))
		hbox.add_child(name_lbl)
		
		# Score value
		var score_lbl = Label.new()
		score_lbl.text = "%s Pts" % _format_large_number(entry.get("score"))
		score_lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		score_lbl.add_theme_font_size_override("font_size", 11)
		score_lbl.add_theme_color_override("font_color", Color(0.18, 0.8, 0.44, 1))
		hbox.add_child(score_lbl)
		
		leaderboard_container.add_child(panel)

func _get_alliance_tag() -> String:
	# Try to check if alliance save file exists to fetch actual tag
	if FileAccess.file_exists("user://crownspire_alliance_v1.save"):
		var f = FileAccess.open("user://crownspire_alliance_v1.save", FileAccess.READ)
		if f:
			var text = f.get_as_text()
			f.close()
			var json = JSON.new()
			if json.parse(text) == OK:
				var data = json.get_data()
				if typeof(data) == TYPE_DICTIONARY and data.has("tag"):
					return data.get("tag")
	return "VALR" # Default coalition fallback

func _compute_player_rank(event_id: String) -> int:
	var event = _events_catalog.get(event_id)
	if not event: return 99
	
	var current_score = _events_db.get("scores", {}).get(event_id, 0)
	var list: Array = [current_score]
	for r in event.get("rivals", []):
		list.append(r.get("score"))
		
	list.sort_custom(func(a, b): return a > b)
	
	var r = list.find(current_score) + 1
	return max(r, 1)

# ==============================================================================
# BATTLE PASS ENGINE CONTROLLERS
# ==============================================================================

func _open_battle_pass_details() -> void:
	right_detail_empty.visible = false
	right_detail_normal.visible = false
	right_detail_bp.visible = true
	if is_instance_valid(sovereign_detail_scroll):
		sovereign_detail_scroll.visible = false
	
	# Current battle pass XP status
	var total_xp = _events_db.get("scores", {}).get("bp_xp", 0)
	
	# Deduce Level and remainder XP from cumulative XP pool
	# e.g., Level 1 starts at 0 XP. Needs 1000 to hit Level 2.
	var current_lvl = _get_bp_level_from_xp(total_xp)
	var xp_in_level = total_xp % 1000
	
	bp_level_lbl.text = "👑 Vanguard Battle Pass Level: %d" % current_lvl
	bp_xp_lbl.text = "XP Tracker: %d / 1000" % xp_in_level
	bp_progress_bar.max_value = 1000.0
	bp_progress_bar.value = float(xp_in_level)
	
	# Check premium unlock status
	var premium_unlocked = _events_db.get("bp_premium_unlocked", false)
	if premium_unlocked:
		bp_unlock_premium_btn.text = "✓ ELITE PREMIUM ACTIVATED"
		bp_unlock_premium_btn.disabled = true
	else:
		bp_unlock_premium_btn.text = "🔒 Unlock Elite Pass (💎 1,500)"
		bp_unlock_premium_btn.disabled = false
		
	# Populate Battle Pass Level rewards tracks
	_generate_battle_pass_tracks(current_lvl, premium_unlocked)

func _get_bp_level_from_xp(xp: int) -> int:
	var lvl = 1 + int(xp / 1000.0)
	return clamp(lvl, 1, 5)

func _generate_battle_pass_tracks(active_level: int, premium_unlocked: bool) -> void:
	_clear_container(bp_list_container)
	
	var claimed_free = _events_db.get("claimed_milestones", {}).get("bp_free", [])
	var claimed_premium = _events_db.get("claimed_milestones", {}).get("bp_premium", [])
	
	for idx in range(_bp_catalog.size()):
		var stage = _bp_catalog[idx]
		var stage_lvl = stage.get("level")
		var unlocked = active_level >= stage_lvl
		
		# Stage Box flat panel container
		var stage_panel = PanelContainer.new()
		var stage_style = StyleBoxFlat.new()
		stage_style.bg_color = Color(0.12, 0.15, 0.19, 1)
		
		# Highlights current targeted level block boundary
		if stage_lvl == active_level:
			stage_style.border_width_left = 3
			stage_style.border_width_top = 1
			stage_style.border_width_right = 1
			stage_style.border_width_bottom = 1
			stage_style.border_color = Color(0.9, 0.47, 0.08, 1) # gold highlights
		else:
			stage_style.border_width_bottom = 1
			stage_style.border_color = Color(0.18, 0.22, 0.28, 1)
			
		stage_style.corner_radius_top_left = 8
		stage_style.corner_radius_top_right = 8
		stage_style.corner_radius_bottom_right = 8
		stage_style.corner_radius_bottom_left = 8
		stage_panel.add_theme_stylebox_override("panel", stage_style)
		
		var margin = MarginContainer.new()
		margin.add_theme_constant_override("margin_left", 12)
		margin.add_theme_constant_override("margin_right", 12)
		margin.add_theme_constant_override("margin_top", 10)
		margin.add_theme_constant_override("margin_bottom", 10)
		stage_panel.add_child(margin)
		
		var layout_hbox = HBoxContainer.new()
		layout_hbox.add_theme_constant_override("separation", 14)
		margin.add_child(layout_hbox)
		
		# LEVEL TEXT INDICATOR
		var lvl_lbl_box = VBoxContainer.new()
		lvl_lbl_box.custom_minimum_size = Vector2(70, 0)
		lvl_lbl_box.alignment = BoxContainer.ALIGNMENT_CENTER
		layout_hbox.add_child(lvl_lbl_box)
		
		var lvl_num = Label.new()
		lvl_num.text = "STAGE %d" % stage_lvl
		lvl_num.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		lvl_num.add_theme_font_size_override("font_size", 13)
		lvl_num.add_theme_color_override("font_color", Color(1, 1, 1, 1) if unlocked else Color(0.5, 0.55, 0.6, 1))
		lvl_lbl_box.add_child(lvl_num)
		
		var status_text = Label.new()
		status_text.text = "Unlocked" if unlocked else "Locked"
		status_text.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		status_text.add_theme_font_size_override("font_size", 9)
		status_text.add_theme_color_override("font_color", Color(0.15, 0.68, 0.37, 1) if unlocked else Color(0.9, 0.2, 0.2, 1))
		lvl_lbl_box.add_child(status_text)
		
		# SPLIT tracks (Free Box vs Premium Box)
		# Track 1: Free rewards
		var free_box = _create_bp_reward_slot(
			stage_lvl,
			unlocked,
			stage.get("free_reward"),
			stage_lvl in claimed_free,
			false,
			premium_unlocked
		)
		layout_hbox.add_child(free_box)
		
		# Track 2: Premium rewards
		var prem_box = _create_bp_reward_slot(
			stage_lvl,
			unlocked,
			stage.get("premium_reward"),
			stage_lvl in claimed_premium,
			true,
			premium_unlocked
		)
		layout_hbox.add_child(prem_box)
		
		bp_list_container.add_child(stage_panel)

func _create_bp_reward_slot(stage_lvl: int, unlocked: bool, reward_cfg: Dictionary, claimed: bool, is_premium: bool, premium_active: bool) -> PanelContainer:
	var slot = PanelContainer.new()
	slot.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	
	var style = StyleBoxFlat.new()
	style.corner_radius_top_left = 6
	style.corner_radius_top_right = 6
	style.corner_radius_bottom_right = 6
	style.corner_radius_bottom_left = 6
	
	if is_premium:
		style.bg_color = Color(0.18, 0.14, 0.22, 1) # Royal dark violet theme
		style.border_width_left = 1
		style.border_color = Color(0.7, 0.3, 0.9, 1) if premium_active else Color(0.35, 0.25, 0.45, 1)
	else:
		style.bg_color = Color(0.08, 0.10, 0.12, 1)
		style.border_width_left = 1
		style.border_color = Color(0.2, 0.25, 0.3, 1)
		
	slot.add_theme_stylebox_override("panel", style)
	
	var margin = MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 8)
	margin.add_theme_constant_override("margin_right", 8)
	margin.add_theme_constant_override("margin_top", 8)
	margin.add_theme_constant_override("margin_bottom", 8)
	slot.add_child(margin)
	
	var hbox = HBoxContainer.new()
	hbox.add_theme_constant_override("separation", 8)
	margin.add_child(hbox)
	
	# Emoji / Badge icon visual slot
	var icon_slot = PanelContainer.new()
	icon_slot.custom_minimum_size = Vector2(36, 36)
	icon_slot.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	
	var is_slot_style = StyleBoxFlat.new()
	is_slot_style.bg_color = Color(0.04, 0.05, 0.06, 1)
	is_slot_style.corner_radius_top_left = 18
	is_slot_style.corner_radius_top_right = 18
	is_slot_style.corner_radius_bottom_right = 18
	is_slot_style.corner_radius_bottom_left = 18
	icon_slot.add_theme_stylebox_override("panel", is_slot_style)
	hbox.add_child(icon_slot)
	
	var emoji_lbl = Label.new()
	if claimed:
		emoji_lbl.text = "📭"
	elif is_premium and not premium_active:
		emoji_lbl.text = "🔒"
	else:
		emoji_lbl.text = _get_item_emoji_fallback(reward_cfg.get("id"))
	emoji_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	emoji_lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	emoji_lbl.add_theme_font_size_override("font_size", 16)
	icon_slot.add_child(emoji_lbl)
	
	var text_vbox = VBoxContainer.new()
	text_vbox.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	text_vbox.alignment = BoxContainer.ALIGNMENT_CENTER
	text_vbox.add_theme_constant_override("separation", 1)
	hbox.add_child(text_vbox)
	
	var title_lbl = Label.new()
	title_lbl.text = "Premium Reward" if is_premium else "Free Provision"
	title_lbl.add_theme_color_override("font_color", Color(0.7, 0.3, 0.9, 1) if is_premium else Color(0.55, 0.60, 0.65, 1))
	title_lbl.add_theme_font_size_override("font_size", 9)
	text_vbox.add_child(title_lbl)
	
	var rew_desc = Label.new()
	rew_desc.text = "%dx %s" % [reward_cfg.get("amount"), reward_cfg.get("desc")]
	rew_desc.add_theme_color_override("font_color", Color(1, 1, 1, 1) if unlocked else Color(0.45, 0.50, 0.55, 1))
	rew_desc.add_theme_font_size_override("font_size", 10)
	rew_desc.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	text_vbox.add_child(rew_desc)
	
	# Trigger Claim Button
	var btn = Button.new()
	btn.custom_minimum_size = Vector2(65, 24)
	btn.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	btn.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	btn.focus_mode = Control.FOCUS_NONE
	btn.add_theme_font_size_override("font_size", 10)
	
	var btn_style = StyleBoxFlat.new()
	btn_style.corner_radius_top_left = 4
	btn_style.corner_radius_top_right = 4
	btn_style.corner_radius_bottom_right = 4
	btn_style.corner_radius_bottom_left = 4
	
	var can_claim = unlocked and (not claimed)
	if is_premium and not premium_active:
		can_claim = false
		
	if claimed:
		btn.text = "Claimed"
		btn.disabled = true
		btn_style.bg_color = Color(0.18, 0.20, 0.23, 1)
	elif can_claim:
		btn.text = "Claim"
		btn_style.bg_color = Color(0.15, 0.55, 0.30, 1)
		btn.pressed.connect(func(): _claim_bp_tier_reward(stage_lvl, is_premium, reward_cfg))
	else:
		btn.text = "Locked"
		btn.disabled = true
		btn_style.bg_color = Color(0.20, 0.24, 0.28, 1)
		
	btn.add_theme_stylebox_override("normal", btn_style)
	btn.add_theme_stylebox_override("disabled", btn_style)
	btn.add_theme_stylebox_override("hover", btn_style)
	btn.add_theme_stylebox_override("pressed", btn_style)
	hbox.add_child(btn)
	
	return slot

func _claim_bp_tier_reward(level_num: int, is_premium: bool, reward_cfg: Dictionary) -> void:
	var reward_id = reward_cfg.get("id")
	var amount = reward_cfg.get("amount")
	
	# Add level to correct claimed track arrays
	var milestones_claimed = _events_db.get("claimed_milestones", {})
	
	if is_premium:
		var prem_list = milestones_claimed.get("bp_premium", [])
		if not level_num in prem_list:
			prem_list.append(level_num)
			milestones_claimed["bp_premium"] = prem_list
	else:
		var free_list = milestones_claimed.get("bp_free", [])
		if not level_num in free_list:
			free_list.append(level_num)
			milestones_claimed["bp_free"] = free_list
			
	# Update database and apply items to Bag inventory
	_credit_reward_item_to_bag(reward_id, amount)
	_save_events_to_disk()
	
	# Success UI alerts
	var m = "Battle Pass Stage %d reward claimed! Obtained %s." % [level_num, reward_cfg.get("desc")]
	_show_toast(m)
	add_log_requested.emit(m, "success")
	
	# Redraw Battle pass views
	_open_battle_pass_details()
	_refresh_overall_ui()

func _on_unlock_premium_pass_pressed() -> void:
	var premium_unlocked = _events_db.get("bp_premium_unlocked", false)
	if premium_unlocked: return
	
	var diamonds = _inventory.get("diamonds", 0)
	if diamonds < 1500:
		_show_toast("Insufficient Diamonds! Elite Pass costs 💎 1,500.")
		return
		
	# Deduct diamonds and persist
	_inventory["diamonds"] = diamonds - 1500
	_save_inventory_to_disk()
	
	_events_db["bp_premium_unlocked"] = true
	_save_events_to_disk()
	
	_show_toast("Vanguard Elite Premium Pass unlocked successfully!")
	add_log_requested.emit("Unlocked Vanguard Elite Battle Pass for 1500 Diamonds. Triple-A tier rewards unlocked!", "success")
	
	_open_battle_pass_details()
	_refresh_overall_ui()

func _on_gain_bp_xp_pressed() -> void:
	var scores = _events_db.get("scores", {})
	var xp = scores.get("bp_xp", 0)
	
	# Add +500 XP to Battle pass tracker
	var cap_max = 5000 # Max Level 5 caps out at cumulative 5000 XP
	var newly_added = xp + 500
	newly_added = min(newly_added, cap_max)
	
	scores["bp_xp"] = newly_added
	_save_events_to_disk()
	
	var m_str = "Completed daily Vanguard battle challenge! Earned +500 Battle Pass XP."
	_show_toast(m_str)
	add_log_requested.emit(m_str, "info")
	
	_open_battle_pass_details()
	_refresh_overall_ui()

# ==============================================================================
# GENERAL SYSTEM HELPER METHODS
# ==============================================================================

func _on_category_selected(category: String) -> void:
	if _active_category == category: return
	_active_category = category
	_refresh_overall_ui()
	_select_default_event()

func _update_active_timers_display() -> void:
	# Update active detail view timers if visible
	if right_detail_normal.visible and _selected_event_id != "":
		var sec = _simulated_timers.get(_selected_event_id, 3600.0)
		if sec <= 0:
			det_timer_lbl.text = "⏳ Event Has Ended"
			det_timer_lbl.add_theme_color_override("font_color", Color(0.8, 0.2, 0.2, 1))
		else:
			var total_sec = int(sec)
			var hrs = total_sec / 3600
			var mins = (total_sec % 3600) / 60
			var secs = total_sec % 60
			det_timer_lbl.text = "⏳ Countdown: %02dh %02dm %02ds left" % [hrs, mins, secs]
			det_timer_lbl.add_theme_color_override("font_color", Color(0.95, 0.75, 0.15, 1))

func _on_close_pressed() -> void:
	print("[Events] Closing Event Center...")
	visible = false
	events_closed.emit()

func _show_toast(message: String) -> void:
	toast_label.text = message
	toast_notification.visible = true
	toast_notification.modulate = Color(1, 1, 1, 0)
	
	var tween = create_tween()
	tween.tween_property(toast_notification, "modulate:a", 1.0, 0.25)
	
	_toast_timer.start()

func _on_toast_timeout() -> void:
	var tween = create_tween()
	tween.tween_property(toast_notification, "modulate:a", 0.0, 0.3)
	tween.finished.connect(func(): toast_notification.visible = false)

func _clear_container(container: Node) -> void:
	for child in container.get_children():
		child.queue_free()

func _format_large_number(num: int) -> String:
	if num >= 1000000:
		return "%.2fM" % (num / 1000000.0)
	elif num >= 1000:
		return "%.1fk" % (num / 1000.0)
	return str(num)

func _get_item_emoji_fallback(item_id: String) -> String:
	if "food" in item_id: return "🍖"
	elif "wood" in item_id: return "🪵"
	elif "stone" in item_id: return "🧱"
	elif "iron" in item_id: return "🪙"
	elif "diamond" in item_id: return "💎"
	elif "speedup" in item_id: return "⏱️"
	elif "helmet" in item_id: return "🪖"
	elif "weapon" in item_id or "sword" in item_id: return "⚔️"
	elif "vip" in item_id: return "👑"
	elif "shard" in item_id or "statue" in item_id: return "🎖️"
	elif "potion" in item_id: return "🧪"
	elif "teleport" in item_id: return "🌀"
	elif "shield" in item_id: return "🛡️"
	elif "stardust" in item_id: return "✨"
	elif "obsidian" in item_id: return "🖤"
	elif "castle" in item_id: return "🌋"
	else: return "🎁"
