# ==============================================================================
# Crownspire MMO Strategy Game - Master Alliance Hub Controller
# Godot 4 / GDScript 2.0 Client-side persistent alliance manager
# ==============================================================================

extends Control

# --- Constant Paths ---
const SAVE_FILE_PATH = "user://crownspire_alliance_v1.save"
const ALLIANCE_CONFIG_PATH = "res://alliance.json"

# --- Tabs ---
const TABS = [
	"Info",
	"Members",
	"Ranks",
	"Tech",
	"Gifts",
	"Help",
	"Shop",
	"Territory"
]

# --- Onready Nodes ---
@onready var close_button: Button = $Layout/Header/MarginContainer/HBoxContainer/CloseButton
@onready var tab_box: HBoxContainer = $Layout/TabScroll/TabBox

@onready var alliance_title_label: Label = $Layout/ContentMargin/MainPanel/HSplit/LeftListContainer/HeaderBar/AllianceTitleLabel
@onready var alliance_level_label: Label = $Layout/ContentMargin/MainPanel/HSplit/LeftListContainer/HeaderBar/AllianceLevelLabel
@onready var alliance_power_label: Label = $Layout/ContentMargin/MainPanel/HSplit/LeftListContainer/HeaderBar/AlliancePowerLabel
@onready var alliance_member_count_label: Label = $Layout/ContentMargin/MainPanel/HSplit/LeftListContainer/HeaderBar/AllianceMemberCountLabel

@onready var current_tab_container: PanelContainer = $Layout/ContentMargin/MainPanel/HSplit/RightDetailContainer/Margin/VBox/CurrentTabContainer

# --- Chat Hook Nodes ---
@onready var chat_list: VBoxContainer = $Layout/ContentMargin/MainPanel/HSplit/LeftListContainer/ChatBox/Scroll/List
@onready var chat_input: LineEdit = $Layout/ContentMargin/MainPanel/HSplit/LeftListContainer/ChatBox/HBox/ChatEdit
@onready var chat_send_btn: Button = $Layout/ContentMargin/MainPanel/HSplit/LeftListContainer/ChatBox/HBox/SendBtn

# --- Toast System Nodes ---
@onready var toast_notification: PanelContainer = $ToastNotification
@onready var toast_label: Label = $ToastNotification/ToastLabel

# --- Internal State ---
var _alliance_data: Dictionary = {}
var _alliance_config: Dictionary = {}
var _active_tab: String = "Info"
var _toast_timer: Timer

# ==============================================================================
# LIFECYCLE CALLBACKS
# ==============================================================================

func _ready() -> void:
	print("[Alliance] Launching Sovereign Coalition Hub...")
	
	# Load static configurations
	_load_alliance_config()
	
	# Load persistent state
	_load_alliance_data()
	
	# Configure toast auto-dismiss timer
	_toast_timer = Timer.new()
	_toast_timer.one_shot = true
	_toast_timer.wait_time = 2.5
	_toast_timer.timeout.connect(_on_toast_timeout)
	add_child(_toast_timer)
	
	# Connect top-level handlers
	close_button.pressed.connect(_on_close_pressed)
	chat_send_btn.pressed.connect(_on_chat_send_pressed)
	chat_input.text_submitted.connect(func(text): _on_chat_send_pressed())
	
	# Setup Tab system
	_setup_category_tabs()
	
	# Populate initial chat log
	_refresh_chat_ui()
	
	# Initial Render
	_refresh_alliance_ui()

# ==============================================================================
# SAVING & PERSISTENCE
# ==============================================================================

func _load_alliance_config() -> void:
	if not FileAccess.file_exists(ALLIANCE_CONFIG_PATH):
		push_warning("[Alliance] config file not found. Bootstrapping fallback rules.")
		_generate_default_config()
		return
		
	var file = FileAccess.open(ALLIANCE_CONFIG_PATH, FileAccess.READ)
	if not file:
		_generate_default_config()
		return
		
	var content = file.get_as_text()
	file.close()
	
	var json = JSON.new()
	if json.parse(content) == OK:
		var data = json.get_data()
		if typeof(data) == TYPE_DICTIONARY:
			_alliance_config = data
			print("[Alliance] Successfully parsed static game parameters.")
		else:
			_generate_default_config()
	else:
		_generate_default_config()

func _generate_default_config() -> void:
	_alliance_config = {
		"allianceRoles": {
			"R5": {"title": "Lord Paramount", "canKick": true, "canInvite": true},
			"R4": {"title": "Elder", "canKick": true, "canInvite": true},
			"R3": {"title": "Officer", "canKick": false, "canInvite": true},
			"R2": {"title": "Veteran", "canKick": false, "canInvite": false},
			"R1": {"title": "Initiate", "canKick": false, "canInvite": false}
		}
	}

func _load_alliance_data() -> void:
	if not FileAccess.file_exists(SAVE_FILE_PATH):
		_bootstrap_default_alliance()
		return
		
	var file = FileAccess.open(SAVE_FILE_PATH, FileAccess.READ)
	if not file:
		_bootstrap_default_alliance()
		return
		
	var content = file.get_as_text()
	file.close()
	
	var json = JSON.new()
	if json.parse(content) == OK:
		var raw = json.get_data()
		if typeof(raw) == TYPE_DICTIONARY:
			_alliance_data = raw
			print("[Alliance] Restored persistent coalition progress from client disk.")
		else:
			_bootstrap_default_alliance()
	else:
		_bootstrap_default_alliance()

func _save_alliance_state() -> void:
	var file = FileAccess.open(SAVE_FILE_PATH, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(_alliance_data))
		file.close()
		print("[Alliance] State flushed to client disk.")

func _bootstrap_default_alliance() -> void:
	print("[Alliance] Setting up first-launch Sovereign Coalition...")
	_alliance_data = {
		"id": "crownspire_vanguard_all_1",
		"name": "The Crown's Vanguard",
		"description": "We stand as the vanguard of Crownspire. To arms, comrades!",
		"level": 1,
		"xp": 150,
		"max_xp": 1000,
		"member_count": 5,
		"max_members": 50,
		"player_honor_points": 2000, # Starter Honor for exchange
		"alliance_treasury": 8500,
		"territory_influence": 12,
		"crest_index": 0,
		"members": [
			{"name": "Sovereign Maegan", "power": 450000, "rank": "R5", "joined_at": Time.get_unix_time_from_system() - 172800},
			{"name": "Lord Ronald", "power": 320000, "rank": "R4", "joined_at": Time.get_unix_time_from_system() - 86400},
			{"name": "Lady Catherine", "power": 210000, "rank": "R3", "joined_at": Time.get_unix_time_from_system() - 43200},
			{"name": "Knight Robert", "power": 115000, "rank": "R2", "joined_at": Time.get_unix_time_from_system() - 3600},
			{"name": "Vassal Galahad", "power": 85000, "rank": "R1", "joined_at": Time.get_unix_time_from_system() - 1800}
		],
		"applicants": [
			{"name": "Squire Alistair #554", "power": 64000, "message": "I will donate wood daily to erect Sentinel outposts."}
		],
		"tech_levels": {
			"gathering_speed": 1,
			"alliance_resource_production": 1,
			"construction_help": 1,
			"training_help": 1,
			"rally_size": 1
		},
		"tech_progress": {
			"gathering_speed": 250,
			"alliance_resource_production": 120
		},
		"building_levels": {
			"alliance_fortress": 1,
			"alliance_tower": 1,
			"alliance_resource_center": 1
		},
		"building_progress": {
			"alliance_fortress": 15000
		},
		"gifts": [
			{
				"name": "Slayer's Bounty Chest",
				"source": "Defeated level-appropriate wildlings on volcanic path",
				"rarity": "rare",
				"rewards": {"resource_food_100k": 1, "resource_wood_100k": 1, "speedup_universal_5m": 5}
			}
		],
		"help_requests": [
			{
				"sender_name": "Lord Ronald",
				"type": "construction_help",
				"task_name": "Citadel Tower level 12",
				"current_clicks": 14,
				"max_clicks": 30
			},
			{
				"sender_name": "Lady Catherine",
				"type": "research_help",
				"task_name": "Longbow archery decryptions",
				"current_clicks": 4,
				"max_clicks": 25
			}
		],
		"territory_nodes": [
			{"id": "node_1", "cityName": "Imperial Frontier Outpost", "x": 100, "y": 100, "status": "claimed", "defensePower": 150000, "bonusText": "+10% Slate Quarry extraction speed"},
			{"id": "node_2", "cityName": "Ironclad Keep sector", "x": 101, "y": 100, "status": "unclaimed", "defensePower": 240000, "bonusText": "+5% Infantry cohort military health"},
			{"id": "node_3", "cityName": "Pine Mill Forest Grove", "x": 100, "y": 101, "status": "unclaimed", "defensePower": 85000, "bonusText": "+15% Lumber Mill caravan yield"},
			{"id": "node_4", "cityName": "Ethereal Spirit Mana Dew", "x": 101, "y": 101, "status": "disputed", "defensePower": 450000, "bonusText": "+10% Academy Research speed multiplier"}
		],
		"chat_log": [
			{"sender": "Lord Ronald", "rank": "R4", "text": "We need more Timber groves in sector coordinate 100!"},
			{"sender": "Lady Catherine", "rank": "R3", "text": "I can deploy a heavy Cavalry brigade to protect coordinates [100,101]."},
			{"sender": "Knight Robert", "rank": "R2", "text": "Helped with the Citadel speedup request!"}
		]
	}
	_save_alliance_state()

# ==============================================================================
# CATEGORY TABS Setup
# ==============================================================================

func _setup_category_tabs() -> void:
	for child in tab_box.get_children():
		child.queue_free()
		
	for name in TABS:
		var tab_btn = Button.new()
		tab_btn.text = "   %s   " % name
		tab_btn.custom_minimum_size = Vector2(90, 36)
		tab_btn.size_flags_vertical = Control.SIZE_SHRINK_CENTER
		tab_btn.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		tab_btn.focus_mode = Control.FOCUS_NONE
		
		# Set custom capture connection
		var cap_name = name
		tab_btn.pressed.connect(func(): _on_tab_pressed(cap_name))
		tab_box.add_child(tab_btn)
		
	_update_tab_button_styles()

func _update_tab_button_styles() -> void:
	var children = tab_box.get_children()
	for i in range(children.size()):
		var btn = children[i] as Button
		if btn:
			var active = (TABS[i] == _active_tab)
			var style = StyleBoxFlat.new()
			if active:
				style.bg_color = Color(0.192, 0.478, 0.820, 1) # Blue Accent
				btn.add_theme_color_override("font_color", Color(1, 1, 1, 1))
			else:
				style.bg_color = Color(0.098, 0.117, 0.149, 1) # Card Bg
				btn.add_theme_color_override("font_color", Color(0.6, 0.65, 0.7, 1))
				
			style.corner_radius_top_left = 6
			style.corner_radius_top_right = 6
			style.corner_radius_bottom_right = 6
			style.corner_radius_bottom_left = 6
			
			btn.add_theme_stylebox_override("normal", style)
			btn.add_theme_stylebox_override("hover", style)
			btn.add_theme_stylebox_override("pressed", style)
			btn.add_theme_stylebox_override("focus", style)
			
			# Add subtle badges or highlight colors
			if TABS[i] == "Gifts" and _alliance_data.get("gifts", []).size() > 0:
				btn.add_theme_color_override("font_color", Color(0.95, 0.75, 0.15, 1))
			elif TABS[i] == "Help" and _alliance_data.get("help_requests", []).size() > 0:
				btn.add_theme_color_override("font_color", Color(0.15, 0.68, 0.37, 1))

func _on_tab_pressed(tab_name: String) -> void:
	if _active_tab == tab_name:
		return
	_active_tab = tab_name
	_refresh_alliance_ui()

# ==============================================================================
# CORE REFRESH ENGINE
# ==============================================================================

func _refresh_alliance_ui() -> void:
	# Compute summary stats
	var name = _alliance_data.get("name", "Unnamed Alliance")
	var level = _alliance_data.get("level", 1)
	var members = _alliance_data.get("members", [])
	var max_members = _alliance_data.get("max_members", 50)
	
	var total_power = 0
	for m in members:
		total_power += m.get("power", 0)
		
	alliance_title_label.text = name
	alliance_level_label.text = "Alliance Tier: Level %d" % level
	alliance_power_label.text = "Combat Rating: %s CR" % _format_num(total_power)
	alliance_member_count_label.text = "Lords Capacity: %d / %d" % [members.size(), max_members]
	
	_update_tab_button_styles()
	
	# Clear active tab
	for child in current_tab_container.get_children():
		child.queue_free()
		
	# Instance and embed correct sub-scene
	var sub_scene_path = ""
	match _active_tab:
		"Info": sub_scene_path = "res://AllianceInfo.tscn"
		"Members": sub_scene_path = "res://AllianceMembers.tscn"
		"Ranks": sub_scene_path = "res://res://AllianceRanks.tscn" # Wait, is it res://AllianceRanks.tscn or res://res://...? Let's use res://AllianceRanks.tscn
		"Tech": sub_scene_path = "res://AllianceTech.tscn"
		"Gifts": sub_scene_path = "res://AllianceGifts.tscn"
		"Help": sub_scene_path = "res://AllianceHelp.tscn"
		"Shop": sub_scene_path = "res://AllianceStore.tscn"
		"Territory": sub_scene_path = "res://AllianceTerritory.tscn"
		_: return
		
	# Fix path to Ranks
	if _active_tab == "Ranks":
		sub_scene_path = "res://AllianceRanks.tscn"
		
	if not ResourceLoader.exists(sub_scene_path):
		push_error("[Alliance] Scene path %s does not exist on resource registry." % sub_scene_path)
		return
		
	var sub_scene = load(sub_scene_path)
	if sub_scene:
		var instance = sub_scene.instantiate()
		current_tab_container.add_child(instance)
		
		# Connect signals for status logs
		if instance.has_signal("add_log_requested"):
			instance.add_log_requested.connect(_on_add_log_received)
			
		# Initialize view
		if _active_tab == "Info":
			instance.init_view(_alliance_data)
			instance.info_updated.connect(_on_child_scene_updated)
		elif _active_tab == "Members":
			instance.init_view(_alliance_data)
			instance.member_list_updated.connect(_on_child_scene_updated)
		elif _active_tab == "Ranks":
			instance.init_view(_alliance_data)
		elif _active_tab == "Tech":
			# Load tech DB from config
			var tech_db = _alliance_config.get("allianceResearch", _get_tech_meta_fallbacks())
			instance.init_view(_alliance_data, tech_db)
			instance.tech_updated.connect(_on_child_scene_updated)
		elif _active_tab == "Gifts":
			instance.init_view(_alliance_data)
			instance.gifts_updated.connect(_on_child_scene_updated)
		elif _active_tab == "Help":
			instance.init_view(_alliance_data)
			instance.help_processed.connect(_on_child_scene_updated)
		elif _active_tab == "Shop":
			instance.init_view(_alliance_data)
			instance.store_purchase_completed.connect(_on_child_scene_updated)
		elif _active_tab == "Territory":
			var bld_db = _alliance_config.get("allianceBuildings", _get_building_meta_fallbacks())
			instance.init_view(_alliance_data, bld_db)
			instance.territory_updated.connect(_on_child_scene_updated)
	else:
		push_error("[Alliance] Failed to load %s" % sub_scene_path)

func _on_child_scene_updated() -> void:
	_refresh_alliance_ui()

func _on_add_log_received(text: String, type: String) -> void:
	_show_toast(text, type)

# ==============================================================================
# ALLIANCE LIVE CHAT SYSTEM
# ==============================================================================

func _refresh_chat_ui() -> void:
	_clear_container(chat_list)
	
	var logs = _alliance_data.get("chat_log", [])
	for msg in logs:
		var item = PanelContainer.new()
		var style = StyleBoxFlat.new()
		style.bg_color = Color(0.08, 0.1, 0.12, 0.6)
		style.corner_radius_top_left = 4
		style.corner_radius_top_right = 4
		style.corner_radius_bottom_right = 4
		style.corner_radius_bottom_left = 4
		item.add_theme_stylebox_override("panel", style)
		
		var margin = MarginContainer.new()
		margin.add_theme_constant_override("margin_left", 6)
		margin.add_theme_constant_override("margin_top", 4)
		margin.add_theme_constant_override("margin_right", 6)
		margin.add_theme_constant_override("margin_bottom", 4)
		item.add_child(margin)
		
		var lbl = Label.new()
		var rank_lbl = "[%s] " % msg.get("rank", "R1")
		lbl.text = rank_lbl + msg.get("sender", "Guild Mate") + ": " + msg.get("text", "")
		lbl.add_theme_font_size_override("font_size", 11)
		lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		margin.add_child(lbl)
		
		chat_list.add_child(item)

func _on_chat_send_pressed() -> void:
	var txt = chat_input.text.strip_edges()
	if txt.is_empty():
		return
		
	var logs = _alliance_data.get("chat_log", [])
	
	# Add player message
	logs.append({
		"sender": "Sovereign Maegan",
		"rank": "R5",
		"text": txt
	})
	
	chat_input.text = ""
	
	# Keep log bounded
	if logs.size() > 30:
		logs.remove_at(0)
		
	_save_alliance_state()
	_refresh_chat_ui()
	
	# Scroll to bottom
	var parent_scroll = chat_list.get_parent() as ScrollContainer
	if parent_scroll:
		# Call deferred to allow new list items to render first
		parent_scroll.call_deferred("set_v_scroll", 99999)
		
	# Trigger simulated response after short delay to make chat feel responsive and alive!
	get_tree().create_timer(1.2).timeout.connect(_simulate_guild_reply)

func _simulate_guild_reply() -> void:
	var replies = [
		{"sender": "Lord Ronald", "rank": "R4", "text": "Understood, Lord Paramount! I am deploying scouts to scan the borders."},
		{"sender": "Lady Catherine", "rank": "R3", "text": "Excellent tactical layout. My cavalry divisions are fully aligned."},
		{"sender": "Knight Robert", "rank": "R2", "text": "I am working on wood donations for the Fortress expansion right now!"},
		{"sender": "Vassal Galahad", "rank": "R1", "text": "Thanks for help on my Academy timer! You guys are fast!"}
	]
	
	var r = replies[randi() % replies.size()]
	var logs = _alliance_data.get("chat_log", [])
	logs.append(r)
	
	if logs.size() > 30:
		logs.remove_at(0)
		
	_save_alliance_state()
	_refresh_chat_ui()
	
	var parent_scroll = chat_list.get_parent() as ScrollContainer
	if parent_scroll:
		parent_scroll.call_deferred("set_v_scroll", 99999)

# ==============================================================================
# TOAST FEEDBACK NOTIFIER
# ==============================================================================

func _show_toast(message: String, type: String = "info") -> void:
	toast_label.text = message
	
	var style = StyleBoxFlat.new()
	style.corner_radius_top_left = 6
	style.corner_radius_top_right = 6
	style.corner_radius_bottom_right = 6
	style.corner_radius_bottom_left = 6
	
	match type:
		"success":
			style.bg_color = Color(0.12, 0.35, 0.22, 0.95)
			style.border_width_left = 1
			style.border_color = Color(0.15, 0.68, 0.37, 1)
		"warning":
			style.bg_color = Color(0.39, 0.22, 0.12, 0.95)
			style.border_width_left = 1
			style.border_color = Color(0.8, 0.45, 0.1, 1)
		"error":
			style.bg_color = Color(0.39, 0.12, 0.12, 0.95)
			style.border_width_left = 1
			style.border_color = Color(1, 0.3, 0.3, 1)
		_:
			style.bg_color = Color(0.1, 0.15, 0.25, 0.95)
			style.border_width_left = 1
			style.border_color = Color(0.19, 0.48, 0.82, 1)
			
	toast_notification.add_theme_stylebox_override("panel", style)
	toast_notification.visible = true
	
	_toast_timer.start()

func _on_toast_timeout() -> void:
	toast_notification.visible = false

# ==============================================================================
# STATIC META FALLBACKS (If alliance.json fails)
# ==============================================================================

func _get_tech_meta_fallbacks() -> Array:
	return [
		{
			"id": "gathering_speed",
			"name": "Caravan Speed Optimization",
			"description": "Upgrades wheels and pack mule structures to expedite resource caravans.",
			"category": "Economy",
			"maxLevel": 5,
			"levels": [
				{"costs": {"pointsRequired": 1000}, "effects": ["+5% Gathering Velocity"]},
				{"costs": {"pointsRequired": 2500}, "effects": ["+10% Gathering Velocity"]},
				{"costs": {"pointsRequired": 5000}, "effects": ["+15% Gathering Velocity"]},
				{"costs": {"pointsRequired": 10000}, "effects": ["+20% Gathering Velocity"]},
				{"costs": {"pointsRequired": 20000}, "effects": ["+30% Gathering Velocity"]}
			]
		},
		{
			"id": "alliance_resource_production",
			"name": "State Guild Taxation",
			"description": "Appoints regional tax collectors to expand safe territory extraction yields.",
			"category": "Economy",
			"maxLevel": 5,
			"levels": [
				{"costs": {"pointsRequired": 1500}, "effects": ["+5% Collective Output"]},
				{"costs": {"pointsRequired": 3000}, "effects": ["+10% Collective Output"]},
				{"costs": {"pointsRequired": 6000}, "effects": ["+15% Collective Output"]},
				{"costs": {"pointsRequired": 12000}, "effects": ["+20% Collective Output"]},
				{"costs": {"pointsRequired": 25000}, "effects": ["+35% Collective Output"]}
			]
		},
		{
			"id": "construction_help",
			"name": "Sentry Logistics Coordination",
			"description": "Increases construction speedups by improving builder supply delivery lines.",
			"category": "Support",
			"maxLevel": 5,
			"levels": [
				{"costs": {"pointsRequired": 1000}, "effects": ["+1 Minute Help Reduction"]},
				{"costs": {"pointsRequired": 2000}, "effects": ["+2 Minutes Help Reduction"]},
				{"costs": {"pointsRequired": 4000}, "effects": ["+3 Minutes Help Reduction"]},
				{"costs": {"pointsRequired": 8000}, "effects": ["+4 Minutes Help Reduction"]},
				{"costs": {"pointsRequired": 15000}, "effects": ["+6 Minutes Help Reduction"]}
			]
		}
	]

func _get_building_meta_fallbacks() -> Array:
	return [
		{
			"id": "alliance_fortress",
			"name": "Imperial Coalition Fortress",
			"description": "The central anchor of your alliance borders. Extends sovereign claim bounds.",
			"maxLevel": 5,
			"levels": [
				{"costs": {"allianceWood": 10000, "allianceStone": 10000, "allianceIron": 5000}, "bonuses": [{"description": "Sovereign claims extend to a 10-hex boundary radius. Roster capacity +50"}]},
				{"costs": {"allianceWood": 30000, "allianceStone": 30000, "allianceIron": 15000}, "bonuses": [{"description": "Sovereign claims extend to a 15-hex boundary radius. Roster capacity +60"}]},
				{"costs": {"allianceWood": 80000, "allianceStone": 80000, "allianceIron": 40000}, "bonuses": [{"description": "Sovereign claims extend to a 20-hex boundary radius. Roster capacity +70"}]},
				{"costs": {"allianceWood": 200000, "allianceStone": 200000, "allianceIron": 100000}, "bonuses": [{"description": "Sovereign claims extend to a 25-hex boundary radius. Roster capacity +80"}]},
				{"costs": {"allianceWood": 500000, "allianceStone": 500000, "allianceIron": 250000}, "bonuses": [{"description": "Sovereign claims extend to a 30-hex boundary radius. Roster capacity +100"}]}
			]
		},
		{
			"id": "alliance_tower",
			"name": "Sentinel Watchtower",
			"description": "Strategic border watchtowers that secure boundary tiles and fire arrows.",
			"maxLevel": 5,
			"levels": [
				{"costs": {"allianceWood": 5000, "allianceStone": 5000, "allianceIron": 2000}, "bonuses": [{"description": "Sentry visibility 8 hexes. Arrows deal 100 damage"}]},
				{"costs": {"allianceWood": 15000, "allianceStone": 15000, "allianceIron": 6000}, "bonuses": [{"description": "Sentry visibility 10 hexes. Arrows deal 200 damage"}]},
				{"costs": {"allianceWood": 45000, "allianceStone": 45000, "allianceIron": 18000}, "bonuses": [{"description": "Sentry visibility 12 hexes. Arrows deal 350 damage"}]},
				{"costs": {"allianceWood": 100000, "allianceStone": 100000, "allianceIron": 450000}, "bonuses": [{"description": "Sentry visibility 14 hexes. Arrows deal 500 damage"}]},
				{"costs": {"allianceWood": 300000, "allianceStone": 300000, "allianceIron": 120000}, "bonuses": [{"description": "Sentry visibility 18 hexes. Arrows deal 800 damage"}]}
			]
		}
	]

# ==============================================================================
# GENERAL CONVERSION UTILS
# ==============================================================================

func _on_close_pressed() -> void:
	print("[Alliance] Bidding farewell to Sovereign Coalition Hub...")
	visible = false

func _clear_container(container: Node) -> void:
	for child in container.get_children():
		child.queue_free()

func _format_num(num: int) -> String:
	if num >= 1000000:
		return "%.1fM" % (num / 1000000.0)
	elif num >= 1000:
		return "%.1fk" % (num / 1000.0)
	return str(num)
