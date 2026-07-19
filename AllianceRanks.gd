# ==============================================================================
# Crownspire MMO Strategy Game - Alliance Ranks Controller
# Godot 4 / GDScript 2.0 Client-side role permissions handbook
# ==============================================================================

extends Control

# --- Onready Nodes ---
@onready var ranks_container: VBoxContainer = $Layout/Scroll/List

# --- Static Rank Permissions Book ---
var _ranks_data: Array = [
	{
		"id": "R5",
		"name": "Lord Paramount (Guild Master)",
		"desc": "Ultimate sovereign authority. Complete control over diplomacy, treasury reserves, member banishment, promotions, building placement, and node annexation.",
		"privileges": [
			"Full Administration & Discretionary power",
			"Appoint Elders (R4), Officers (R3), and Veterans (R2)",
			"Deconstruct or Upgrade Landmarks",
			"Banish any alliance member",
			"Accept or decline enlistment applications",
			"Purchase premium Alliance Store stock items"
		]
	},
	{
		"id": "R4",
		"name": "Elder (Vice Leader)",
		"desc": "Esteemed counselors and generals. Manage daily garrison operations, coordinate border defenses, and approve applications.",
		"privileges": [
			"Promote or Demote R1-R3 members",
			"Accept or decline enlistment applications",
			"Settle Construction Supply projects",
			"Garrison border outposts and claim free hex nodes",
			"Purchase standard Alliance Store items"
		]
	},
	{
		"id": "R3",
		"name": "Officer (Battle Marshall)",
		"desc": "Field commanders responsible for organizing rallies, patrolling sovereign sector borders, and assisting recruits.",
		"privileges": [
			"Rally auxiliary attack legions against high-level Wildlings",
			"Coordinate dispatch help calls",
			"Initiate Technology research contributions",
			"Garrison active claimed coordinate sectors"
		]
	},
	{
		"id": "R2",
		"name": "Veteran (Shield-Sworn)",
		"desc": "Loyal knights of the Coalition. Proven in campaigns, they gain access to specialized research speedups and security networks.",
		"privileges": [
			"Contribute wood, food, slate, or iron to science trees",
			"Receive active peace-shield coverage buffs",
			"Help other players speed up timers"
		]
	},
	{
		"id": "R1",
		"name": "Initiate (Recruit)",
		"desc": "Newly enlisted lords. Shelter under the alliance fortress canopy, request construction aid, and purchase beginner items.",
		"privileges": [
			"Request speedup assistance from alliance brothers",
			"Participate in building and technology donations",
			"Earn personal honor points through aid and construction"
		]
	}
]

func _ready() -> void:
	_refresh_ranks_ui()

func init_view(_state: Dictionary) -> void:
	_refresh_ranks_ui()

func _refresh_ranks_ui() -> void:
	_clear_container(ranks_container)
	
	for rank in _ranks_data:
		var card = _create_rank_card(rank)
		ranks_container.add_child(card)

func _create_rank_card(rank: Dictionary) -> PanelContainer:
	var card = PanelContainer.new()
	card.custom_minimum_size = Vector2(0, 110)
	
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.098, 0.117, 0.149, 1)
	style.border_width_left = 3
	
	var r_id = rank.get("id", "R1")
	match r_id:
		"R5": style.border_color = Color(0.95, 0.75, 0.15, 1) # Gold
		"R4": style.border_color = Color(0.7, 0.3, 0.9, 1) # Purple
		"R3": style.border_color = Color(0.19, 0.48, 0.82, 1) # Blue
		"R2": style.border_color = Color(0.15, 0.68, 0.37, 1) # Green
		_: style.border_color = Color(0.5, 0.55, 0.6, 1) # Gray
		
	style.corner_radius_top_left = 6
	style.corner_radius_top_right = 6
	style.corner_radius_bottom_right = 6
	style.corner_radius_bottom_left = 6
	card.add_theme_stylebox_override("panel", style)
	
	var margin = MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 12)
	margin.add_theme_constant_override("margin_top", 10)
	margin.add_theme_constant_override("margin_right", 12)
	margin.add_theme_constant_override("margin_bottom", 10)
	card.add_child(margin)
	
	var vbox = VBoxContainer.new()
	vbox.add_theme_constant_override("separation", 6)
	margin.add_child(vbox)
	
	# Header with rank name
	var title_lbl = Label.new()
	title_lbl.text = "[%s] %s" % [r_id, rank.get("name")]
	title_lbl.add_theme_colors_override("font_color", Color(1, 1, 1, 1))
	title_lbl.add_theme_font_size_override("font_size", 14)
	vbox.add_child(title_lbl)
	
	# Description
	var desc_lbl = Label.new()
	desc_lbl.text = rank.get("desc")
	desc_lbl.add_theme_color_override("font_color", Color(0.6, 0.65, 0.7, 1))
	desc_lbl.add_theme_font_size_override("font_size", 11)
	desc_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	vbox.add_child(desc_lbl)
	
	# Privileges list
	var privileges_box = VBoxContainer.new()
	vbox.add_child(privileges_box)
	
	var privs_title = Label.new()
	privs_title.text = "Authority Privileges:"
	privs_title.add_theme_color_override("font_color", Color(0.19, 0.48, 0.82, 1))
	privs_title.add_theme_font_size_override("font_size", 11)
	privileges_box.add_child(privs_title)
	
	var privs = rank.get("privileges", [])
	for p in privs:
		var p_lbl = Label.new()
		p_lbl.text = "• " + str(p)
		p_lbl.add_theme_color_override("font_color", Color(0.5, 0.55, 0.6, 1))
		p_lbl.add_theme_font_size_override("font_size", 10)
		privileges_box.add_child(p_lbl)
		
	return card

func _clear_container(container: Node) -> void:
	for child in container.get_children():
		child.queue_free()
