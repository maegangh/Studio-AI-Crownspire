extends Control

# ==========================================
# CROWNSPIRE ALLIANCE CHAT PANEL
# ==========================================

@onready var scroll_container: ScrollContainer = $ScrollContainer
@onready var list_container: VBoxContainer = $ScrollContainer/List
@onready var message_input: LineEdit = $InputArea/LineEdit
@onready var send_btn: Button = $InputArea/BtnSend

func _ready() -> void:
	send_btn.pressed.connect(_on_send_pressed)
	message_input.text_submitted.connect(_on_text_submitted)
	
	UIManager.alliance_chat_updated.connect(refresh_panel)
	
	refresh_panel()

func refresh_panel() -> void:
	for child in list_container.get_children():
		child.queue_free()
		
	var messages = UIManager.alliance_chat_messages as Array
	for msg in messages:
		_build_message_row(msg)
		
	# Autoscroll to bottom
	var tween = create_tween()
	tween.tween_callback(func():
		scroll_container.scroll_vertical = int(list_container.size.y)
	).set_delay(0.05)

func _build_message_row(msg: Dictionary) -> void:
	var sender = msg.get("sender", "Ally")
	var text = msg.get("text", "")
	var time = msg.get("time", "Now")
	
	var row = PanelContainer.new()
	row.custom_minimum_size = Vector2(0, 50)
	
	var is_player = (sender == UIManager.player_name)
	
	# Stylize differently for player messages (royal tint)
	var style_box = StyleBoxFlat.new()
	style_box.bg_color = Color(0.08, 0.18, 0.28, 0.6) if is_player else Color(0.04, 0.08, 0.12, 0.5)
	style_box.content_margin_left = 12
	style_box.content_margin_right = 12
	style_box.content_margin_top = 8
	style_box.content_margin_bottom = 8
	style_box.corner_radius_top_left = 8
	style_box.corner_radius_top_right = 8
	style_box.corner_radius_bottom_right = 8
	style_box.corner_radius_bottom_left = 8
	row.add_theme_stylebox_override("panel", style_box)
	
	var v_layout = VBoxContainer.new()
	row.add_child(v_layout)
	
	var h_header = HBoxContainer.new()
	v_layout.add_child(h_header)
	
	var name_lbl = Label.new()
	name_lbl.text = sender
	name_lbl.add_theme_colors_override("font_color", Color("#ffd700") if is_player else Color("#3bf7ad"))
	name_lbl.add_theme_font_size_override("font_size", 13)
	h_header.add_child(name_lbl)
	
	var time_lbl = Label.new()
	time_lbl.text = " (" + time + ")"
	time_lbl.add_theme_colors_override("font_color", Color("#607080"))
	time_lbl.add_theme_font_size_override("font_size", 11)
	h_header.add_child(time_lbl)
	
	var text_lbl = Label.new()
	text_lbl.text = text
	text_lbl.add_theme_font_size_override("font_size", 14)
	text_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD
	v_layout.add_child(text_lbl)
	
	list_container.add_child(row)

func _on_send_pressed() -> void:
	var txt = message_input.text.strip_edges()
	if txt != "":
		UIManager.send_alliance_chat_message(txt)
		message_input.clear()

func _on_text_submitted(txt: String) -> void:
	if txt.strip_edges() != "":
		UIManager.send_alliance_chat_message(txt.strip_edges())
		message_input.clear()
