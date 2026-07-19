extends Control

# ==========================================
# CROWNSPIRE ALLIANCE EVENTS PANEL
# ==========================================

@onready var list_container: VBoxContainer = $ScrollContainer/List

func _ready() -> void:
	refresh_panel()

func refresh_panel() -> void:
	# Clear
	for child in list_container.get_children():
		child.queue_free()
		
	# Build static simulated events matching Crownspire lore
	_build_event_card(
		"🐲 Crystallite Beast Invasion",
		"ACTIVE CHALLENGE",
		"Slay the crystalline leviathan near the outer borders to harvest Crystallite Cores for the vault.",
		"Time Left: 2d 14h",
		0.68,
		"1.2M / 1.8M HP"
	)
	
	_build_event_card(
		"🔬 Dawn Scientist Cooperation",
		"PREPARING CORES",
		"Provide Crystallite Cores to the Alchemical Research Vault to speed up alchemical technology unlocks.",
		"Ongoing season benefit",
		0.42,
		"420 / 1,000 Cores contributed"
	)

func _build_event_card(title: String, status: String, desc: String, timer: String, progress: float, progress_txt: String) -> void:
	var card = PanelContainer.new()
	card.custom_minimum_size = Vector2(0, 160)
	
	var margin_con = MarginContainer.new()
	margin_con.add_theme_constant_override("margin_left", 20)
	margin_con.add_theme_constant_override("margin_right", 20)
	margin_con.add_theme_constant_override("margin_top", 15)
	margin_con.add_theme_constant_override("margin_bottom", 15)
	card.add_child(margin_con)
	
	var v_layout = VBoxContainer.new()
	v_layout.theme_override_constants_add_constant("separation", 6)
	margin_con.add_child(v_layout)
	
	var h_header = HBoxContainer.new()
	v_layout.add_child(h_header)
	
	var title_lbl = Label.new()
	title_lbl.text = title
	title_lbl.add_theme_font_size_override("font_size", 18)
	h_header.add_child(title_lbl)
	
	var spacer = Control.new()
	spacer.size_flags_horizontal = SIZE_EXPAND_FILL
	h_header.add_child(spacer)
	
	var status_lbl = Label.new()
	status_lbl.text = status
	status_lbl.add_theme_colors_override("font_color", Color("#ffd700") if "ACTIVE" in status else Color("#3bf7ad"))
	status_lbl.add_theme_font_size_override("font_size", 12)
	h_header.add_child(status_lbl)
	
	var desc_lbl = Label.new()
	desc_lbl.text = desc
	desc_lbl.add_theme_colors_override("font_color", Color("#a0b0c0"))
	desc_lbl.add_theme_font_size_override("font_size", 13)
	desc_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD
	v_layout.add_child(desc_lbl)
	
	var prog_bar = ProgressBar.new()
	prog_bar.custom_minimum_size = Vector2(0, 14)
	prog_bar.max_value = 1.0
	prog_bar.value = progress
	prog_bar.show_percentage = false
	v_layout.add_child(prog_bar)
	
	var h_footer = HBoxContainer.new()
	v_layout.add_child(h_footer)
	
	var prog_txt_lbl = Label.new()
	prog_txt_lbl.text = progress_txt
	prog_txt_lbl.add_theme_colors_override("font_color", Color("#80c0ff"))
	prog_txt_lbl.add_theme_font_size_override("font_size", 12)
	h_footer.add_child(prog_txt_lbl)
	
	var spacer2 = Control.new()
	spacer2.size_flags_horizontal = SIZE_EXPAND_FILL
	h_footer.add_child(spacer2)
	
	var timer_lbl = Label.new()
	timer_lbl.text = timer
	timer_lbl.add_theme_colors_override("font_color", Color("#ffd700"))
	timer_lbl.add_theme_font_size_override("font_size", 12)
	h_footer.add_child(timer_lbl)
	
	list_container.add_child(card)
