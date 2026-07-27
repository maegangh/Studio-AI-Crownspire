# ==============================================================================
# Crownspire MMO Strategy Game - Alliance Help System
# Godot 4 / GDScript 2.0 Client-side speedup assistance manager
# ==============================================================================

extends Control

# --- Signals ---
signal help_processed
signal add_log_requested(text, type)

# --- Onready Nodes ---
@onready var help_list: VBoxContainer = $Layout/Scroll/List
@onready var help_all_btn: Button = $Layout/Header/HBox/HelpAllBtn
@onready var sim_request_btn: Button = $Layout/Header/HBox/SimRequestBtn

# --- Internal references ---
var _alliance_scene: Control
var _state: Dictionary = {}

func _ready() -> void:
	var parent = get_parent()
	while parent and not parent.has_method("_save_alliance_state"):
		parent = parent.get_parent()
	if parent:
		_alliance_scene = parent
		
	# Connect buttons
	help_all_btn.pressed.connect(_on_help_all_pressed)
	sim_request_btn.pressed.connect(_on_sim_request_pressed)

func init_view(state: Dictionary) -> void:
	_state = state
	_refresh_help_ui()

func _refresh_help_ui() -> void:
	_clear_container(help_list)
	
	var requests = _state.get("help_requests", [])
	if requests.is_empty():
		help_all_btn.disabled = true
		
		var center = CenterContainer.new()
		center.size_flags_vertical = Control.SIZE_EXPAND_FILL
		help_list.add_child(center)
		
		var empty_lbl = Label.new()
		empty_lbl.text = "No active speedup help requests. Your alliance is fully optimized!"
		empty_lbl.add_theme_color_override("font_color", Color(0.4, 0.45, 0.5, 1))
		center.add_child(empty_lbl)
	else:
		help_all_btn.disabled = false
		for req in requests:
			var card = _create_help_card(req)
			help_list.add_child(card)

func _create_help_card(req: Dictionary) -> PanelContainer:
	var card = PanelContainer.new()
	card.custom_minimum_size = Vector2(0, 70)
	
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.098, 0.117, 0.149, 1)
	style.border_width_left = 3
	
	var req_type = req.get("type", "construction_help")
	match req_type:
		"construction_help": style.border_color = Color(0.95, 0.75, 0.15, 1) # Yellow
		"research_help": style.border_color = Color(0.19, 0.48, 0.82, 1) # Blue
		"healing_help": style.border_color = Color(0.15, 0.68, 0.37, 1) # Green
		"training_help": style.border_color = Color(0.7, 0.3, 0.9, 1) # Purple
		_: style.border_color = Color(0.5, 0.55, 0.6, 1)
		
	style.corner_radius_top_left = 6
	style.corner_radius_top_right = 6
	style.corner_radius_bottom_right = 6
	style.corner_radius_bottom_left = 6
	card.add_theme_stylebox_override("panel", style)
	
	var margin = MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 12)
	margin.add_theme_constant_override("margin_top", 8)
	margin.add_theme_constant_override("margin_right", 12)
	margin.add_theme_constant_override("margin_bottom", 8)
	card.add_child(margin)
	
	var hbox = HBoxContainer.new()
	margin.add_child(hbox)
	
	# Icon Representation (Left Side)
	var emoji_lbl = Label.new()
	emoji_lbl.add_theme_font_size_override("font_size", 24)
	emoji_lbl.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	hbox.add_child(emoji_lbl)
	
	match req_type:
		"construction_help": emoji_lbl.text = "🔨"
		"research_help": emoji_lbl.text = "🧪"
		"healing_help": emoji_lbl.text = "🩹"
		"training_help": emoji_lbl.text = "⚔️"
		
	# Details (Middle Column)
	var vbox = VBoxContainer.new()
	vbox.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	hbox.add_child(vbox)
	
	var user_lbl = Label.new()
	user_lbl.text = req.get("sender_name", "Alliance Brother")
	user_lbl.add_theme_color_override("font_color", Color(1, 1, 1, 1))
	user_lbl.add_theme_font_size_override("font_size", 13)
	vbox.add_child(user_lbl)
	
	var details_lbl = Label.new()
	details_lbl.text = "%s - Clicks remaining: %d / %d" % [req.get("task_name", "Keep Upgrade"), req.get("current_clicks", 0), req.get("max_clicks", 30)]
	details_lbl.add_theme_color_override("font_color", Color(0.5, 0.55, 0.6, 1))
	details_lbl.add_theme_font_size_override("font_size", 11)
	vbox.add_child(details_lbl)
	
	# Button (Right Side)
	var action_vbox = VBoxContainer.new()
	action_vbox.alignment = BoxContainer.ALIGNMENT_CENTER
	hbox.add_child(action_vbox)
	
	var help_btn = Button.new()
	help_btn.text = "Help"
	help_btn.custom_minimum_size = Vector2(80, 30)
	help_btn.pressed.connect(func(): _on_help_clicked(req))
	action_vbox.add_child(help_btn)
	
	return card

# ==============================================================================
# ACTIONS & LOGIC
# ==============================================================================

func _on_help_clicked(req: Dictionary) -> void:
	var requests = _state.get("help_requests", [])
	var index = requests.find(req)
	if index == -1:
		return
		
	var clicks = req.get("current_clicks", 0) + 1
	var max_clicks = req.get("max_clicks", 30)
	
	var honor_granted = 10
	var treasury_granted = 20
	_state["player_honor_points"] = _state.get("player_honor_points", 0) + honor_granted
	_state["alliance_treasury"] = _state.get("alliance_treasury", 0) + treasury_granted
	
	if clicks >= max_clicks:
		requests.remove_at(index)
		add_log_requested.emit("Helped %s with their %s! Earned 🏅%d Honor and upgraded active speedup bounds." % [req.get("sender_name"), req.get("task_name"), honor_granted], "success")
	else:
		req["current_clicks"] = clicks
		add_log_requested.emit("Speed assistance provided to %s. Earned 🏅%d Honor." % [req.get("sender_name"), honor_granted], "success")
		
	_save_and_sync()
	
	var q_mgr = get_node_or_null("/root/QuestManager")
	if q_mgr:
		q_mgr.trigger_progress("alliance_help", "", 1)
		q_mgr.trigger_progress("alliance_honor", "", honor_granted)
		q_mgr.trigger_progress("alliance_activity", "", 1)
		
	_refresh_help_ui()

func _on_help_all_pressed() -> void:
	var requests = _state.get("help_requests", [])
	if requests.is_empty():
		return
		
	var count = requests.size()
	var honor_granted = count * 10
	var treasury_granted = count * 20
	
	_state["player_honor_points"] = _state.get("player_honor_points", 0) + honor_granted
	_state["alliance_treasury"] = _state.get("alliance_treasury", 0) + treasury_granted
	
	# Empty the help queue
	requests.clear()
	
	_save_and_sync()
	
	var q_mgr_all = get_node_or_null("/root/QuestManager")
	if q_mgr_all:
		q_mgr_all.trigger_progress("alliance_help", "", count)
		q_mgr_all.trigger_progress("alliance_honor", "", honor_granted)
		q_mgr_all.trigger_progress("alliance_activity", "", count)
		
	_refresh_help_ui()
	
	add_log_requested.emit("🏰 Mass logistics deployed! Assisted %d alliance brothers. Earned 🏅%d Honor Points and expanded collective treasury." % [count, honor_granted], "success")

func _on_sim_request_pressed() -> void:
	var senders = ["Lord Brandon", "Lady Helen", "Vassal Gwydion", "Baron Oakhaven", "Commander Stark", "Sovereign Freya", "Lady Elspeth"]
	var types = ["construction_help", "research_help", "healing_help", "training_help"]
	var tasks = {
		"construction_help": ["Watchtower Upgrade Tier 8", "Keep Repair & Fortification", "Wall Expansion", "Consular Embassy Level 10"],
		"research_help": ["Cavalry Drills", "Frost Wyrm Alloys Research", "Infantry Tactics V", "Medical Science charts"],
		"healing_help": ["Garrison Healing Ward Expansion", "Hospital Sanitization", "Vanguard Recruits treatment"],
		"training_help": ["Archers Long-Range Fletching", "Heavy Cavalry Training drills", "Sentinels drill routines"]
	}
	
	var rand_sender = senders[randi() % senders.size()]
	var rand_type = types[randi() % types.size()]
	var rand_task_list = tasks.get(rand_type, ["Garrison upgrade"])
	var rand_task = rand_task_list[randi() % rand_task_list.size()]
	
	var requests = _state.get("help_requests", [])
	
	# Verify not duplicate
	for r in requests:
		if r.get("sender_name") == rand_sender and r.get("task_name") == rand_task:
			return
			
	requests.append({
		"sender_name": rand_sender,
		"type": rand_type,
		"task_name": rand_task,
		"current_clicks": randi_range(0, 10),
		"max_clicks": randi_range(20, 30)
	})
	
	_save_and_sync()
	_refresh_help_ui()
	add_log_requested.emit("%s is requesting speedup assistance on %s!" % [rand_sender, rand_task], "info")

# ==============================================================================
# HELPERS
# ==============================================================================

func _clear_container(container: Node) -> void:
	for child in container.get_children():
		child.queue_free()

func _save_and_sync() -> void:
	if _alliance_scene and _alliance_scene.has_method("_save_alliance_state"):
		_alliance_scene._save_alliance_state()
	help_processed.emit()
