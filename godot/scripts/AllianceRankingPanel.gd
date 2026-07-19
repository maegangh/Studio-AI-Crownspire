extends Control

# ==========================================
# CROWNSPIRE ALLIANCE RANKING PANEL
# ==========================================

@onready var list_container: VBoxContainer = $ScrollContainer/List

func _ready() -> void:
	refresh_panel()

func refresh_panel() -> void:
	for child in list_container.get_children():
		child.queue_free()
		
	var alliances = UIManager.alliances_db.duplicate() as Array
	
	# Sort by power descending
	alliances.sort_custom(func(a, b):
		return int(a.get("power", 0)) > int(b.get("power", 0))
	)
	
	var placement = 1
	for alliance in alliances:
		_build_ranking_row(placement, alliance)
		placement += 1

func _build_ranking_row(rank: int, alliance: Dictionary) -> void:
	var row = PanelContainer.new()
	row.custom_minimum_size = Vector2(0, 80)
	
	var margin_con = MarginContainer.new()
	margin_con.add_theme_constant_override("margin_left", 15)
	margin_con.add_theme_constant_override("margin_right", 15)
	margin_con.add_theme_constant_override("margin_top", 10)
	margin_con.add_theme_constant_override("margin_bottom", 10)
	row.add_child(margin_con)
	
	var h_layout = HBoxContainer.new()
	h_layout.add_theme_constant_override("separation", 15)
	margin_con.add_child(h_layout)
	
	# Rank Placement Label with unique colors
	var rank_lbl = Label.new()
	rank_lbl.text = "#" + str(rank)
	rank_lbl.custom_minimum_size = Vector2(40, 0)
	rank_lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	
	match rank:
		1:
			rank_lbl.add_theme_color_override("font_color", Color("#ffd700")) # Gold
			rank_lbl.add_theme_font_size_override("font_size", 22)
		2:
			rank_lbl.add_theme_color_override("font_color", Color("#c0c0c0")) # Silver
			rank_lbl.add_theme_font_size_override("font_size", 18)
		3:
			rank_lbl.add_theme_color_override("font_color", Color("#cd7f32")) # Bronze
			rank_lbl.add_theme_font_size_override("font_size", 16)
		_:
			rank_lbl.add_theme_color_override("font_color", Color("#8090a0"))
			rank_lbl.add_theme_font_size_override("font_size", 14)
			
	h_layout.add_child(rank_lbl)
	
	# Banner Icon
	var icon_lbl = Label.new()
	icon_lbl.text = alliance.get("flag_symbol", "🛡️")
	icon_lbl.add_theme_font_size_override("font_size", 32)
	icon_lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	h_layout.add_child(icon_lbl)
	
	# Main details
	var v_layout = VBoxContainer.new()
	v_layout.size_flags_horizontal = SIZE_EXPAND_FILL
	v_layout.alignment = BoxContainer.ALIGNMENT_CENTER
	h_layout.add_child(v_layout)
	
	var title_lbl = Label.new()
	title_lbl.text = alliance.get("name", "") + " [" + alliance.get("tag", "") + "]"
	title_lbl.add_theme_font_size_override("font_size", 16)
	v_layout.add_child(title_lbl)
	
	var leader_lbl = Label.new()
	leader_lbl.text = "Leader: " + alliance.get("leader", "") + " | Members: " + str(alliance.get("member_count", 0)) + "/" + str(alliance.get("max_members", 100))
	leader_lbl.add_theme_colors_override("font_color", Color("#a0b0c0"))
	leader_lbl.add_theme_font_size_override("font_size", 12)
	v_layout.add_child(leader_lbl)
	
	# Power Score
	var p_lbl = Label.new()
	var p_val = int(alliance.get("power", 0))
	var p_str = ""
	if p_val >= 1000000:
		p_str = "%.2fM" % (float(p_val) / 1000000.0)
	elif p_val >= 1000:
		p_str = "%.1fK" % (float(p_val) / 1000.0)
	else:
		p_str = str(p_val)
		
	p_lbl.text = p_str
	p_lbl.add_theme_colors_override("font_color", Color("#3bf7ad"))
	p_lbl.add_theme_font_size_override("font_size", 16)
	p_lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	h_layout.add_child(p_lbl)
	
	list_container.add_child(row)
