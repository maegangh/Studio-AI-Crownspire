# ==============================================================================
# Crownspire MMO Strategy Game - Alliance Info Controller
# Godot 4 / GDScript 2.0 Client-side alliance profile card
# ==============================================================================

extends Control

# --- Signals ---
signal info_updated
signal add_log_requested(text, type)

# --- Onready Nodes ---
@onready var name_lbl: Label = $Layout/MainCard/Margin/VBox/Header/NameLabel
@onready var rank_lbl: Label = $Layout/MainCard/Margin/VBox/Header/RankLabel
@onready var level_bar: ProgressBar = $Layout/MainCard/Margin/VBox/LevelBox/Bar
@onready var level_lbl: Label = $Layout/MainCard/Margin/VBox/LevelBox/LevelLabel
@onready var xp_lbl: Label = $Layout/MainCard/Margin/VBox/LevelBox/XPLabel

@onready var leader_lbl: Label = $Layout/MainCard/Margin/VBox/StatsGrid/LeaderValue
@onready var power_lbl: Label = $Layout/MainCard/Margin/VBox/StatsGrid/PowerValue
@onready var members_lbl: Label = $Layout/MainCard/Margin/VBox/StatsGrid/MembersValue
@onready var influence_lbl: Label = $Layout/MainCard/Margin/VBox/StatsGrid/InfluenceValue

@onready var announcement_edit: TextEdit = $Layout/MainCard/Margin/VBox/AnnouncementBox/AnnText
@onready var save_ann_btn: Button = $Layout/MainCard/Margin/VBox/AnnouncementBox/SaveBtn
@onready var simulate_xp_btn: Button = $Layout/MainCard/Margin/VBox/Actions/SimXPBtn

# --- Internal references ---
var _alliance_scene: Control
var _state: Dictionary = {}

func _ready() -> void:
	var parent = get_parent()
	while parent and not parent.has_method("_save_alliance_state"):
		parent = parent.get_parent()
	if parent:
		_alliance_scene = parent
		
	save_ann_btn.pressed.connect(_on_save_ann_pressed)
	simulate_xp_btn.pressed.connect(_on_simulate_xp_pressed)

func init_view(state: Dictionary) -> void:
	_state = state
	_refresh_info_ui()

func _refresh_info_ui() -> void:
	name_lbl.text = _state.get("name", "The Sovereign Coalition")
	
	var level = _state.get("level", 1)
	level_lbl.text = "Alliance Tier: Level %d" % level
	
	var xp = _state.get("xp", 120)
	var max_xp = _state.get("max_xp", 1000)
	level_bar.max_value = float(max_xp)
	level_bar.value = float(xp)
	xp_lbl.text = "%d / %d XP to next Tier" % [xp, max_xp]
	
	var members = _state.get("members", [])
	var max_members = _state.get("max_members", 50)
	members_lbl.text = "%d / %d Lords" % [members.size(), max_members]
	
	var total_power = 0
	var leader_name = "None"
	for m in members:
		total_power += m.get("power", 0)
		if m.get("rank") == "R5":
			leader_name = m.get("name")
			
	leader_lbl.text = leader_name
	power_lbl.text = "%s CR" % _format_num(total_power)
	influence_lbl.text = "%d%% Boundary Control" % _state.get("territory_influence", 0)
	
	# Announcements
	announcement_edit.text = _state.get("description", "We stand as the vanguard of Crownspire. To arms, comrades!")
	
	# Display simulated leaderboard rank based on level and power
	var rank = 100 - (level * 8) - int(total_power / 1000000.0)
	rank = clamp(rank, 1, 100)
	rank_lbl.text = "🏆 Server Rank: #%d" % rank

func _on_save_ann_pressed() -> void:
	var new_desc = announcement_edit.text
	_state["description"] = new_desc
	_save_and_sync()
	add_log_requested.emit("Alliance proclamation updated successfully!", "success")

func _on_simulate_xp_pressed() -> void:
	var xp = _state.get("xp", 0) + 150
	var max_xp = _state.get("max_xp", 1000)
	var level = _state.get("level", 1)
	
	if xp >= max_xp:
		level += 1
		xp = xp - max_xp
		max_xp = level * 1000
		_state["level"] = level
		_state["xp"] = xp
		_state["max_xp"] = max_xp
		add_log_requested.emit("⭐ GUILD MILESTONE! Alliance leveled up to Tier %d! Roster limits expanded." % level, "success")
	else:
		_state["xp"] = xp
		add_log_requested.emit("Earned +150 Alliance XP through simulated campaigns!", "success")
		
	_save_and_sync()
	_refresh_info_ui()

# ==============================================================================
# HELPERS
# ==============================================================================

func _save_and_sync() -> void:
	if _alliance_scene and _alliance_scene.has_method("_save_alliance_state"):
		_alliance_scene._save_alliance_state()
	info_updated.emit()

func _format_num(num: int) -> String:
	if num >= 1000000:
		return "%.1fM" % (num / 1000000.0)
	elif num >= 1000:
		return "%.1fk" % (num / 1000.0)
	return str(num)
