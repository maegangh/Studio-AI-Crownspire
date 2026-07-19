extends Control

# ==========================================
# CROWNSPIRE ALLIANCE WAR PANEL
# ==========================================

@onready var list_container: VBoxContainer = $ScrollContainer/List
@onready var stats_lbl: Label = $HeaderBar/StatsLabel
@onready var btn_launch_rally: Button = $HeaderBar/BtnLaunchRally

const RALLY_POPUP = preload("res://scenes/AllianceRallyPanel.tscn")

func _ready() -> void:
	if btn_launch_rally:
		btn_launch_rally.pressed.connect(_on_launch_pressed)
	
	UIManager.alliance_rally_updated.connect(refresh_panel)
	UIManager.alliance_updated.connect(refresh_panel)
	
	refresh_panel()

func _get_master() -> Control:
	var parent = get_parent()
	while parent and not parent is AllianceScreen:
		parent = parent.get_parent()
	return parent

func refresh_panel() -> void:
	for child in list_container.get_children():
		child.queue_free()
		
	var alliance = UIManager.get_player_alliance()
	if alliance.is_empty():
		stats_lbl.text = "No current engagements."
		btn_launch_rally.disabled = true
		return
		
	btn_launch_rally.disabled = false
	var rallies = alliance.get("rallies", []) as Array
	
	if stats_lbl:
		stats_lbl.text = "Active Rallies & Engagements: " + str(rallies.size())
		
	for rally in rallies:
		_build_rally_row(rally)

func _build_rally_row(rally: Dictionary) -> void:
	var card = PanelContainer.new()
	card.custom_minimum_size = Vector2(0, 110)
	
	var style_box = StyleBoxFlat.new()
	style_box.bg_color = Color(0.06, 0.04, 0.04, 0.8) # Reddish combat tint
	style_box.border_width_left = 2
	style_box.border_width_top = 2
	style_box.border_width_right = 2
	style_box.border_width_bottom = 2
	style_box.border_color = Color("#b32e2e")
	style_box.corner_radius_top_left = 12
	style_box.corner_radius_top_right = 12
	style_box.corner_radius_bottom_right = 12
	style_box.corner_radius_bottom_left = 12
	card.add_theme_stylebox_override("panel", style_box)
	
	var margin_con = MarginContainer.new()
	margin_con.add_theme_constant_override("margin_left", 15)
	margin_con.add_theme_constant_override("margin_right", 15)
	margin_con.add_theme_constant_override("margin_top", 10)
	margin_con.add_theme_constant_override("margin_bottom", 10)
	card.add_child(margin_con)
	
	var h_layout = HBoxContainer.new()
	h_layout.add_theme_constant_override("separation", 15)
	margin_con.add_child(h_layout)
	
	# Icon Representation
	var icon_lbl = Label.new()
	icon_lbl.text = "⚔️"
	icon_lbl.add_theme_font_size_override("font_size", 38)
	icon_lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	h_layout.add_child(icon_lbl)
	
	# Details layout
	var v_layout = VBoxContainer.new()
	v_layout.size_flags_horizontal = SIZE_EXPAND_FILL
	v_layout.alignment = BoxContainer.ALIGNMENT_CENTER
	h_layout.add_child(v_layout)
	
	var title_lbl = Label.new()
	title_lbl.text = "TARGET: " + rally.get("target_name", "Enemy City")
	title_lbl.add_theme_font_size_override("font_size", 16)
	v_layout.add_child(title_lbl)
	
	var leader_lbl = Label.new()
	leader_lbl.text = "Organized by: " + rally.get("leader", "Commander") + " | " + rally.get("time_left", "5m 00s")
	leader_lbl.add_theme_colors_override("font_color", Color("#ffa5a5"))
	leader_lbl.add_theme_font_size_override("font_size", 12)
	v_layout.add_child(leader_lbl)
	
	# Members joined
	var members = rally.get("members", []) as Array
	var m_list_str = "Joined forces: "
	for i in range(members.size()):
		m_list_str += members[i]
		if i < members.size() - 1:
			m_list_str += ", "
	var members_lbl = Label.new()
	members_lbl.text = m_list_str
	members_lbl.add_theme_colors_override("font_color", Color("#c4d1db"))
	members_lbl.add_theme_font_size_override("font_size", 11)
	v_layout.add_child(members_lbl)
	
	# Join Rally Button
	var btn = Button.new()
	btn.custom_minimum_size = Vector2(100, 40)
	btn.size_flags_vertical = SIZE_SHRINK_CENTER
	
	var has_joined = UIManager.player_name in members
	if has_joined:
		btn.text = "Joined"
		btn.disabled = true
	else:
		btn.text = "⚔️ Join"
		btn.pressed.connect(func(): _on_join_rally(rally))
		
	h_layout.add_child(btn)
	
	list_container.add_child(card)

func _on_join_rally(rally: Dictionary) -> void:
	var members = rally.get("members", []) as Array
	if not UIManager.player_name in members:
		members.append(UIManager.player_name)
		UIManager.add_alliance_log("Player " + UIManager.player_name + " joined " + rally.get("leader", "Commander") + "'s rally.")
		UIManager.alliance_updated.emit()
		UIManager.alliance_rally_updated.emit()

func _on_launch_pressed() -> void:
	var master_screen = _get_master()
	if master_screen:
		master_screen.show_popup(RALLY_POPUP.instantiate())
