extends Control

# ==========================================
# CROWNSPIRE ALLIANCE HELP PANEL
# ==========================================

@onready var help_all_btn: Button = $HeaderBar/BtnHelpAll
@onready var count_lbl: Label = $HeaderBar/CountLabel
@onready var list_container: VBoxContainer = $ScrollContainer/List

func _ready() -> void:
	if help_all_btn:
		help_all_btn.pressed.connect(_on_help_all_pressed)
	refresh_panel()

func refresh_panel() -> void:
	# Clear previous
	for child in list_container.get_children():
		child.queue_free()
		
	var alliance = UIManager.get_player_alliance()
	if alliance.is_empty():
		help_all_btn.disabled = true
		count_lbl.text = "No pending help requests."
		return
		
	var requests = alliance.get("help_requests", []) as Array
	
	if count_lbl:
		count_lbl.text = "Pending Requests: " + str(requests.size())
		
	if help_all_btn:
		help_all_btn.disabled = requests.is_empty()
		
	for req in requests:
		_build_request_row(req)

func _build_request_row(req: Dictionary) -> void:
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
	
	# Icon representation of help request type
	var type_icon = "⚒️"
	var req_type = req.get("type", "construction")
	match req_type:
		"construction": type_icon = "⚒️"
		"research": type_icon = "🧪"
		"healing": type_icon = "🩹"
		"training": type_icon = "🛡️"
		
	var icon_lbl = Label.new()
	icon_lbl.text = type_icon
	icon_lbl.add_theme_font_size_override("font_size", 32)
	icon_lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	h_layout.add_child(icon_lbl)
	
	# Middle context text
	var v_layout = VBoxContainer.new()
	v_layout.size_flags_horizontal = SIZE_EXPAND_FILL
	v_layout.alignment = BoxContainer.ALIGNMENT_CENTER
	h_layout.add_child(v_layout)
	
	var name_lbl = Label.new()
	name_lbl.text = req.get("player_name", "Ally") + " is asking for help!"
	name_lbl.add_theme_font_size_override("font_size", 16)
	v_layout.add_child(name_lbl)
	
	var desc_lbl = Label.new()
	desc_lbl.text = "Target: " + req.get("target", "")
	desc_lbl.add_theme_colors_override("font_color", Color("#a0b0c0"))
	desc_lbl.add_theme_font_size_override("font_size", 13)
	v_layout.add_child(desc_lbl)
	
	# Progress bar for clicks
	var prog_bar = ProgressBar.new()
	prog_bar.custom_minimum_size = Vector2(0, 10)
	prog_bar.max_value = float(req.get("max", 10))
	prog_bar.value = float(req.get("current", 0))
	prog_bar.show_percentage = false
	v_layout.add_child(prog_bar)
	
	# Help button
	var btn = Button.new()
	btn.text = "🤝 Help"
	btn.custom_minimum_size = Vector2(80, 40)
	btn.size_flags_vertical = SIZE_SHRINK_CENTER
	btn.pressed.connect(func(): _on_help_individual(req))
	h_layout.add_child(btn)
	
	list_container.add_child(row)

func _on_help_individual(req: Dictionary) -> void:
	var alliance = UIManager.get_player_alliance()
	if alliance.is_empty(): return
	var reqs = alliance["help_requests"] as Array
	
	# Reward some minor contribution honor
	UIManager.alliance_honor += 100
	
	reqs.erase(req)
	UIManager.alliance_updated.emit()
	UIManager.alliance_help_updated.emit()

func _on_help_all_pressed() -> void:
	UIManager.help_all_alliance_requests()
