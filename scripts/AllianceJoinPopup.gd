extends Control

# ==========================================
# CROWNSPIRE ALLIANCE JOIN/SEARCH POPUP
# ==========================================

signal closed()

@onready var close_btn: Button = $Popup/BtnClose
@onready var list_container: VBoxContainer = $Popup/ScrollContainer/List
@onready var search_input: LineEdit = $Popup/SearchInput

func _ready() -> void:
	close_btn.pressed.connect(_on_close_pressed)
	search_input.text_changed.connect(_on_search_changed)
	refresh_panel()

func _on_close_pressed() -> void:
	closed.emit()
	queue_free()

func _on_search_changed(txt: String) -> void:
	refresh_panel(txt.strip_edges().to_lower())

func refresh_panel(filter_term: String = "") -> void:
	for child in list_container.get_children():
		child.queue_free()
		
	var alliances = UIManager.alliances_db as Array
	for alliance in alliances:
		var name_str = alliance.get("name", "").to_lower()
		var tag_str = alliance.get("tag", "").to_lower()
		
		if filter_term != "" and not filter_term in name_str and not filter_term in tag_str:
			continue
			
		_build_alliance_row(alliance)

func _build_alliance_row(alliance: Dictionary) -> void:
	var row = PanelContainer.new()
	row.custom_minimum_size = Vector2(0, 90)
	
	var margin_con = MarginContainer.new()
	margin_con.add_theme_constant_override("margin_left", 15)
	margin_con.add_theme_constant_override("margin_right", 15)
	margin_con.add_theme_constant_override("margin_top", 10)
	margin_con.add_theme_constant_override("margin_bottom", 10)
	row.add_child(margin_con)
	
	var h_layout = HBoxContainer.new()
	h_layout.add_theme_constant_override("separation", 15)
	margin_con.add_child(h_layout)
	
	# Flag Symbol
	var icon_lbl = Label.new()
	icon_lbl.text = alliance.get("flag_symbol", "🛡️")
	icon_lbl.add_theme_font_size_override("font_size", 32)
	icon_lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	h_layout.add_child(icon_lbl)
	
	# Details
	var v_layout = VBoxContainer.new()
	v_layout.size_flags_horizontal = SIZE_EXPAND_FILL
	v_layout.alignment = BoxContainer.ALIGNMENT_CENTER
	h_layout.add_child(v_layout)
	
	var name_lbl = Label.new()
	name_lbl.text = alliance.get("name", "") + " [" + alliance.get("tag", "") + "]"
	name_lbl.add_theme_font_size_override("font_size", 16)
	v_layout.add_child(name_lbl)
	
	var info_lbl = Label.new()
	info_lbl.text = "Leader: %s | Members: %d/%d" % [
		alliance.get("leader", "Unknown"),
		alliance.get("member_count", 0),
		alliance.get("max_members", 100)
	]
	info_lbl.add_theme_colors_override("font_color", Color("#a0b0c0"))
	info_lbl.add_theme_font_size_override("font_size", 12)
	v_layout.add_child(info_lbl)
	
	# Join Button
	var btn = Button.new()
	btn.text = "🛡️ Join"
	btn.custom_minimum_size = Vector2(80, 40)
	btn.size_flags_vertical = SIZE_SHRINK_CENTER
	btn.pressed.connect(func(): _join_selected(alliance))
	h_layout.add_child(btn)
	
	list_container.add_child(row)

func _join_selected(alliance: Dictionary) -> void:
	var success = UIManager.join_alliance(alliance["id"])
	if success:
		_on_close_pressed()
