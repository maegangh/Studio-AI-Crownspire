extends Control

# ==========================================
# CROWNSPIRE ALLIANCE ACTIVITY LOGS POPUP
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
		
	var alliance = UIManager.get_player_alliance()
	if alliance.is_empty():
		return
		
	var logs = alliance.get("logs", []) as Array
	
	# Display reverse chronological order (newest logs first)
	var reversed_logs = logs.duplicate()
	reversed_logs.reverse()
	
	for entry in reversed_logs:
		_build_log_row(entry)

func _build_log_row(entry: Dictionary) -> void:
	var row = PanelContainer.new()
	row.custom_minimum_size = Vector2(0, 50)
	
	var style_box = StyleBoxFlat.new()
	style_box.bg_color = Color(0.04, 0.08, 0.12, 0.4)
	style_box.content_margin_left = 12
	style_box.content_margin_right = 12
	style_box.content_margin_top = 8
	style_box.content_margin_bottom = 8
	style_box.corner_radius_top_left = 6
	style_box.corner_radius_top_right = 6
	style_box.corner_radius_bottom_right = 6
	style_box.corner_radius_bottom_left = 6
	row.add_theme_stylebox_override("panel", style_box)
	
	var h_layout = HBoxContainer.new()
	row.add_child(h_layout)
	
	var icon_lbl = Label.new()
	icon_lbl.text = "📜"
	icon_lbl.add_theme_font_size_override("font_size", 14)
	icon_lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	h_layout.add_child(icon_lbl)
	
	var v_layout = VBoxContainer.new()
	v_layout.size_flags_horizontal = SIZE_EXPAND_FILL
	h_layout.add_child(v_layout)
	
	var text_lbl = Label.new()
	text_lbl.text = entry.get("action", "")
	text_lbl.add_theme_font_size_override("font_size", 13)
	text_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD
	v_layout.add_child(text_lbl)
	
	var time_lbl = Label.new()
	time_lbl.text = entry.get("time", "Recently")
	time_lbl.add_theme_colors_override("font_color", Color("#607080"))
	time_lbl.add_theme_font_size_override("font_size", 11)
	v_layout.add_child(time_lbl)
	
	list_container.add_child(row)
