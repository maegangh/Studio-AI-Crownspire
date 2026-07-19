extends Control

# ==========================================
# CROWNSPIRE ALLIANCE RECRUIT/INVITE POPUP
# ==========================================

signal closed()

@onready var close_btn: Button = $Popup/BtnClose
@onready var list_container: VBoxContainer = $Popup/ScrollContainer/List

func _ready() -> void:
	close_btn.pressed.connect(_on_close_pressed)
	refresh_panel()

func _on_close_pressed() -> void:
	closed.emit()
	queue_free()

func refresh_panel() -> void:
	for child in list_container.get_children():
		child.queue_free()
		
	var players = UIManager.global_players_db as Array
	
	# Fetch matching unaligned players
	var unaligned_players = []
	for p in players:
		if p.get("alliance_id", "") == "" and p.get("name", "") != UIManager.player_name:
			unaligned_players.append(p)
			
	for player in unaligned_players:
		_build_player_row(player)

func _build_player_row(player: Dictionary) -> void:
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
	
	# Icon
	var icon_lbl = Label.new()
	icon_lbl.text = "👤"
	icon_lbl.add_theme_font_size_override("font_size", 28)
	icon_lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	h_layout.add_child(icon_lbl)
	
	# Profile details
	var v_layout = VBoxContainer.new()
	v_layout.size_flags_horizontal = SIZE_EXPAND_FILL
	v_layout.alignment = BoxContainer.ALIGNMENT_CENTER
	h_layout.add_child(v_layout)
	
	var name_lbl = Label.new()
	name_lbl.text = player.get("name", "Unaligned Player")
	name_lbl.add_theme_font_size_override("font_size", 16)
	v_layout.add_child(name_lbl)
	
	# Format power
	var power_int = int(player.get("power", 0))
	var power_str = ""
	if power_int >= 1000000:
		power_str = "%.2fM" % (float(power_int) / 1000000.0)
	elif power_int >= 1000:
		power_str = "%.1fK" % (float(power_int) / 1000.0)
	else:
		power_str = str(power_int)
		
	var power_lbl = Label.new()
	power_lbl.text = "Power: " + power_str + " | Lvl: " + str(player.get("level", 1))
	power_lbl.add_theme_colors_override("font_color", Color("#a0b0c0"))
	power_lbl.add_theme_font_size_override("font_size", 12)
	v_layout.add_child(power_lbl)
	
	# Invite button
	var btn = Button.new()
	btn.text = "✉️ Invite"
	btn.custom_minimum_size = Vector2(90, 40)
	btn.size_flags_vertical = SIZE_SHRINK_CENTER
	btn.pressed.connect(func(): _invite_player(player, btn))
	h_layout.add_child(btn)
	
	list_container.add_child(row)

func _invite_player(player: Dictionary, btn: Button) -> void:
	# Simulate sending invitation
	btn.text = "Sent"
	btn.disabled = true
	
	UIManager.add_alliance_log("Recruitment invitation dispatched to player " + player.get("name", "Ally") + ".")
	UIManager.alliance_updated.emit()
