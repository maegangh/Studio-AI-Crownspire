extends Control

# ==========================================
# CROWNSPIRE ALLIANCE MAIL & ANNOUNCEMENTS
# ==========================================

@onready var broadcast_form: VBoxContainer = $BroadcastForm
@onready var broadcast_title: LineEdit = $BroadcastForm/TitleInput
@onready var broadcast_body: TextEdit = $BroadcastForm/BodyInput
@onready var broadcast_send: Button = $BroadcastForm/BtnSend

@onready var list_container: VBoxContainer = $ScrollContainer/List

func _ready() -> void:
	broadcast_send.pressed.connect(_on_send_broadcast)
	refresh_panel()

func refresh_panel() -> void:
	# Clear list
	for child in list_container.get_children():
		child.queue_free()
		
	var alliance = UIManager.get_player_alliance()
	if alliance.is_empty():
		broadcast_form.visible = false
		return
		
	# Check rank of current player
	var player_rank = 1
	var members = alliance.get("members", []) as Array
	for m in members:
		if m["name"] == UIManager.player_name:
			player_rank = int(m.get("rank", 1))
			break
			
	# Show broadcast input form if they have permission to send mail
	broadcast_form.visible = UIManager.permission_manager.has_permission(player_rank, "send_mail")
	
	# Populate circular history
	var circulars = alliance.get("circulars", []) as Array
	for circular in circulars:
		_build_circular_row(circular)

func _build_circular_row(circular: Dictionary) -> void:
	var card = PanelContainer.new()
	card.custom_minimum_size = Vector2(0, 100)
	
	var margin_con = MarginContainer.new()
	margin_con.add_theme_constant_override("margin_left", 15)
	margin_con.add_theme_constant_override("margin_right", 15)
	margin_con.add_theme_constant_override("margin_top", 10)
	margin_con.add_theme_constant_override("margin_bottom", 10)
	card.add_child(margin_con)
	
	var v_layout = VBoxContainer.new()
	margin_con.add_child(v_layout)
	
	var title_lbl = Label.new()
	title_lbl.text = "✉️ " + circular.get("title", "Alliance Bulletin")
	title_lbl.add_theme_font_size_override("font_size", 16)
	v_layout.add_child(title_lbl)
	
	var author_lbl = Label.new()
	author_lbl.text = "Issued by %s (%s)" % [circular.get("sender", "Leader"), circular.get("time", "Recently")]
	author_lbl.add_theme_colors_override("font_color", Color("#ffd700"))
	author_lbl.add_theme_font_size_override("font_size", 11)
	v_layout.add_child(author_lbl)
	
	var body_lbl = Label.new()
	body_lbl.text = circular.get("message", "")
	body_lbl.add_theme_colors_override("font_color", Color("#d5e5f5"))
	body_lbl.add_theme_font_size_override("font_size", 14)
	body_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD
	v_layout.add_child(body_lbl)
	
	list_container.add_child(card)

func _on_send_broadcast() -> void:
	var title = broadcast_title.text.strip_edges()
	var body = broadcast_body.text.strip_edges()
	
	if title == "" or body == "":
		return
		
	var alliance = UIManager.get_player_alliance()
	if alliance.is_empty(): return
	
	var circulars = alliance["circulars"] as Array
	
	var new_circ = {
		"title": title,
		"sender": UIManager.player_name,
		"time": "Just Now",
		"message": body
	}
	
	circulars.insert(0, new_circ)
	UIManager._save_alliance_databases()
	
	# Notify with a toast notification
	UIManager.alliance_updated.emit()
	
	broadcast_title.clear()
	broadcast_body.clear()
	
	refresh_panel()
