extends Control

# ==========================================
# CROWNSPIRE ALLIANCE MEMBER LIST PANEL
# ==========================================

@onready var scroll_container: ScrollContainer = $ScrollContainer
@onready var members_list: VBoxContainer = $ScrollContainer/List
@onready var count_label: Label = $HeaderBar/CountLabel
@onready var invite_btn: Button = $HeaderBar/BtnInvite

const MEMBER_CARD_SCENE = preload("res://scenes/AllianceMemberCard.tscn")
const INVITE_POPUP = preload("res://scenes/AllianceInvitePopup.tscn")

func _ready() -> void:
	if invite_btn:
		invite_btn.pressed.connect(_on_invite_pressed)
	refresh_panel()

func _get_master() -> Control:
	var parent = get_parent()
	while parent and not parent is AllianceScreen:
		parent = parent.get_parent()
	return parent

func refresh_panel() -> void:
	# Clear list
	for child in members_list.get_children():
		child.queue_free()
		
	var alliance = UIManager.get_player_alliance()
	if alliance.is_empty():
		return
		
	var members = alliance.get("members", []) as Array
	if count_label:
		count_label.text = "Roster: " + str(members.size()) + " / " + str(alliance.get("max_members", 100))
		
	# Sort members: Leader (4) -> Officers (3) -> Members (1-2)
	var sorted_members = members.duplicate()
	sorted_members.sort_custom(func(a, b):
		return int(a.get("rank", 1)) > int(b.get("rank", 1))
	)
	
	# Check player rank
	var player_rank = 1
	for m in members:
		if m["name"] == UIManager.player_name:
			player_rank = int(m.get("rank", 1))
			break
			
	if invite_btn:
		invite_btn.visible = UIManager.permission_manager.has_permission(player_rank, "invite")
			
	for m_data in sorted_members:
		var card = MEMBER_CARD_SCENE.instantiate()
		members_list.add_child(card)
		if card.has_method("setup_card"):
			card.setup_card(m_data, player_rank)
			
	# Render Pending Applications for Officers and Leaders
	if UIManager.permission_manager.has_permission(player_rank, "accept_applications"):
		var applicants = alliance.get("applicants", []) as Array
		if applicants.size() > 0:
			var separator = Label.new()
			separator.text = "\n📋 PENDING ADMISSION APPLICATIONS (%d)" % applicants.size()
			separator.add_theme_font_size_override("font_size", 14)
			separator.add_theme_color_override("font_color", Color("#ffd700")) # Gold theme
			members_list.add_child(separator)
			
			for app in applicants:
				_build_applicant_row(app)

func _build_applicant_row(app: Dictionary) -> void:
	var card = PanelContainer.new()
	card.name = "ApplicantRow_" + app["name"]
	card.custom_minimum_size = Vector2(0, 70)
	
	var sb = StyleBoxFlat.new()
	sb.bg_color = Color("#0c1622")
	sb.border_width_left = 3
	sb.border_color = Color("#d4af37") # Gold accent
	sb.corner_radius_top_right = 8
	sb.corner_radius_bottom_right = 8
	card.add_theme_stylebox_override("panel", sb)
	
	var margin_con = MarginContainer.new()
	margin_con.add_theme_constant_override("margin_left", 15)
	margin_con.add_theme_constant_override("margin_right", 15)
	margin_con.add_theme_constant_override("margin_top", 10)
	margin_con.add_theme_constant_override("margin_bottom", 10)
	card.add_child(margin_con)
	
	var h_layout = HBoxContainer.new()
	h_layout.add_theme_constant_override("separation", 15)
	margin_con.add_child(h_layout)
	
	var v_layout = VBoxContainer.new()
	v_layout.size_flags_horizontal = SIZE_EXPAND_FILL
	v_layout.alignment = BoxContainer.ALIGNMENT_CENTER
	h_layout.add_child(v_layout)
	
	var name_lbl = Label.new()
	name_lbl.text = app["name"]
	name_lbl.add_theme_font_size_override("font_size", 15)
	v_layout.add_child(name_lbl)
	
	var power_lbl = Label.new()
	power_lbl.text = "Power: " + str(app["power"]) + " | Keep Level: " + str(app.get("level", 10))
	power_lbl.add_theme_color_override("font_color", Color("#a0b0c0"))
	power_lbl.add_theme_font_size_override("font_size", 12)
	v_layout.add_child(power_lbl)
	
	var btn_layout = HBoxContainer.new()
	btn_layout.add_theme_constant_override("separation", 10)
	h_layout.add_child(btn_layout)
	
	var btn_accept = Button.new()
	btn_accept.text = "✔️ Accept"
	btn_accept.custom_minimum_size = Vector2(90, 36)
	btn_accept.add_theme_color_override("font_color", Color("#5cd65c"))
	btn_accept.add_theme_font_size_override("font_size", 13)
	btn_accept.pressed.connect(func():
		UIManager.accept_application(app["name"])
		refresh_panel()
	)
	btn_layout.add_child(btn_accept)
	
	var btn_reject = Button.new()
	btn_reject.text = "❌ Decline"
	btn_reject.custom_minimum_size = Vector2(90, 36)
	btn_reject.add_theme_color_override("font_color", Color("#ff4d4d"))
	btn_reject.add_theme_font_size_override("font_size", 13)
	btn_reject.pressed.connect(func():
		UIManager.reject_application(app["name"])
		refresh_panel()
	)
	btn_layout.add_child(btn_reject)
	
	members_list.add_child(card)

func _on_invite_pressed() -> void:
	var master_screen = _get_master()
	if master_screen:
		master_screen.show_popup(INVITE_POPUP.instantiate())
