extends Control

# ==========================================
# CROWNSPIRE ALLIANCE BUILDINGS PANEL
# ==========================================

signal closed()

@onready var close_btn: Button = $Popup/BtnClose
@onready var title_lbl: Label = $Popup/Title

@onready var list_container: VBoxContainer = $Popup/ScrollContainer/List

func _ready() -> void:
	close_btn.pressed.connect(_on_close_pressed)
	refresh_panel()

func _on_close_pressed() -> void:
	closed.emit()
	queue_free()

func focus_building(bld_id: String) -> void:
	# Utility to autoscroll or highlight a target building ID
	pass

func refresh_panel() -> void:
	for child in list_container.get_children():
		child.queue_free()
		
	var alliance = UIManager.get_player_alliance()
	if alliance.is_empty():
		return
		
	var buildings = UIManager.alliance_buildings_db as Array
	for bld in buildings:
		_build_building_row(bld, alliance)

func _build_building_row(bld: Dictionary, alliance: Dictionary) -> void:
	var row = PanelContainer.new()
	row.custom_minimum_size = Vector2(0, 110)
	
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
	icon_lbl.text = bld.get("icon", "🏰")
	icon_lbl.add_theme_font_size_override("font_size", 36)
	icon_lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	h_layout.add_child(icon_lbl)
	
	# Details
	var v_layout = VBoxContainer.new()
	v_layout.size_flags_horizontal = SIZE_EXPAND_FILL
	v_layout.alignment = BoxContainer.ALIGNMENT_CENTER
	h_layout.add_child(v_layout)
	
	var current_level = 1
	if bld["id"] == "bld_fortress":
		current_level = int(alliance.get("fortress_level", 1))
	else:
		current_level = int(alliance.get("towers_placed", 1))
		
	var name_lbl = Label.new()
	name_lbl.text = bld.get("name", "") + " (Lvl " + str(current_level) + ")"
	name_lbl.add_theme_font_size_override("font_size", 16)
	v_layout.add_child(name_lbl)
	
	var desc_lbl = Label.new()
	desc_lbl.text = bld.get("description", "")
	desc_lbl.add_theme_colors_override("font_color", Color("#a0b0c0"))
	desc_lbl.add_theme_font_size_override("font_size", 13)
	desc_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD
	v_layout.add_child(desc_lbl)
	
	# Upgrade cost / requirements
	var cost = int(bld.get("upgrade_cost_cores", 500)) * current_level
	var alliance_cores = int(alliance.get("crystallite_cores", 0))
	
	var cost_lbl = Label.new()
	cost_lbl.text = "Cost: %d / %d Cores" % [alliance_cores, cost]
	cost_lbl.add_theme_colors_override("font_color", Color("#ffd700") if alliance_cores >= cost else Color("#ff6060"))
	cost_lbl.add_theme_font_size_override("font_size", 12)
	v_layout.add_child(cost_lbl)
	
	# Upgrade Button
	var btn = Button.new()
	btn.text = "🏰 Level Up"
	btn.custom_minimum_size = Vector2(100, 44)
	btn.size_flags_vertical = SIZE_SHRINK_CENTER
	btn.disabled = (alliance_cores < cost)
	btn.pressed.connect(func(): _upgrade_building(bld, cost))
	h_layout.add_child(btn)
	
	list_container.add_child(row)

func _upgrade_building(bld: Dictionary, cost: int) -> void:
	var alliance = UIManager.get_player_alliance()
	if alliance.is_empty(): return
	
	alliance["crystallite_cores"] = int(alliance.get("crystallite_cores", 0)) - cost
	
	if bld["id"] == "bld_fortress":
		alliance["fortress_level"] = int(alliance.get("fortress_level", 1)) + 1
		UIManager.add_alliance_log("Alliance Fortress upgraded to Level " + str(alliance["fortress_level"]) + " by " + UIManager.player_name + ".")
	else:
		alliance["towers_placed"] = int(alliance.get("towers_placed", 0)) + 1
		UIManager.add_alliance_log("New Alliance Tower deployed by " + UIManager.player_name + ".")
		
	UIManager.alliance_updated.emit()
	refresh_panel()
