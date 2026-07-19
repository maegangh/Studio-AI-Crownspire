extends Control

# ==========================================
# CROWNSPIRE ALLIANCE TECHNOLOGY PANEL
# ==========================================

@onready var tab_com_btn: Button = $Header/TabCombat
@onready var tab_dev_btn: Button = $Header/TabDev
@onready var tab_mys_btn: Button = $Header/TabMystic

@onready var scroll_container: ScrollContainer = $ScrollContainer
@onready var tech_list_container: VBoxContainer = $ScrollContainer/TechList

const DONATION_POPUP = preload("res://scenes/AllianceDonationsPanel.tscn")

var active_category: String = "Development"

func _ready() -> void:
	tab_dev_btn.pressed.connect(func(): _set_category("Development"))
	tab_com_btn.pressed.connect(func(): _set_category("Combat"))
	tab_mys_btn.pressed.connect(func(): _set_category("Mystic (Beast)"))
	
	refresh_panel()

func _get_master() -> Control:
	var parent = get_parent()
	while parent and not parent is AllianceScreen:
		parent = parent.get_parent()
	return parent

func _set_category(cat: String) -> void:
	active_category = cat
	refresh_panel()

func refresh_panel() -> void:
	# Clean up list
	for child in tech_list_container.get_children():
		child.queue_free()
		
	# Update active button highlight
	tab_dev_btn.disabled = (active_category == "Development")
	tab_com_btn.disabled = (active_category == "Combat")
	tab_mys_btn.disabled = (active_category == "Mystic (Beast)")
	
	# Fetch matching tech
	for cat in UIManager.alliance_research_db:
		if cat["category"] == active_category:
			var techs = cat["technologies"] as Array
			for tech in techs:
				_build_tech_item(tech)
			break

func _build_tech_item(tech: Dictionary) -> void:
	# Instantiate a clean custom node for tech
	var item_control = PanelContainer.new()
	item_control.custom_minimum_size = Vector2(0, 110)
	
	var margin_con = MarginContainer.new()
	margin_con.add_theme_constant_override("margin_left", 15)
	margin_con.add_theme_constant_override("margin_right", 15)
	margin_con.add_theme_constant_override("margin_top", 10)
	margin_con.add_theme_constant_override("margin_bottom", 10)
	item_control.add_child(margin_con)
	
	var h_layout = HBoxContainer.new()
	h_layout.add_theme_constant_override("separation", 15)
	margin_con.add_child(h_layout)
	
	# Icon
	var icon_lbl = Label.new()
	icon_lbl.text = tech.get("icon", "🧪")
	icon_lbl.add_theme_font_size_override("font_size", 36)
	icon_lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	h_layout.add_child(icon_lbl)
	
	# Title, levels and description
	var v_layout = VBoxContainer.new()
	v_layout.size_flags_horizontal = SIZE_EXPAND_FILL
	v_layout.alignment = BoxContainer.ALIGNMENT_CENTER
	h_layout.add_child(v_layout)
	
	var title_lbl = Label.new()
	title_lbl.text = tech.get("name", "Unnamed Tech") + " (Lvl %d/%d)" % [tech.get("level", 0), tech.get("max_level", 10)]
	title_lbl.add_theme_font_size_override("font_size", 16)
	v_layout.add_child(title_lbl)
	
	var desc_lbl = Label.new()
	desc_lbl.text = tech.get("description", "")
	desc_lbl.add_theme_colors_override("font_color", Color("#a0b0c0"))
	desc_lbl.add_theme_font_size_override("font_size", 13)
	desc_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD
	v_layout.add_child(desc_lbl)
	
	# Progress donation bar
	var prog_bar = ProgressBar.new()
	prog_bar.custom_minimum_size = Vector2(0, 14)
	prog_bar.max_value = float(tech.get("max_donation", 100))
	prog_bar.value = float(tech.get("current_donation", 0))
	prog_bar.show_percentage = false
	v_layout.add_child(prog_bar)
	
	var progress_lbl = Label.new()
	progress_lbl.text = "Donations: %d / %d" % [tech.get("current_donation", 0), tech.get("max_donation", 100)]
	progress_lbl.add_theme_colors_override("font_color", Color("#80c0ff"))
	progress_lbl.add_theme_font_size_override("font_size", 11)
	v_layout.add_child(progress_lbl)
	
	# Action Button
	var action_btn = Button.new()
	action_btn.text = "🧬 Study"
	action_btn.custom_minimum_size = Vector2(80, 44)
	action_btn.size_flags_vertical = SIZE_SHRINK_CENTER
	action_btn.pressed.connect(func(): _open_donation_panel(tech))
	h_layout.add_child(action_btn)
	
	tech_list_container.add_child(item_control)

func _open_donation_panel(tech: Dictionary) -> void:
	var master_screen = _get_master()
	if master_screen:
		var donation_popup = DONATION_POPUP.instantiate()
		master_screen.show_popup(donation_popup)
		if donation_popup.has_method("setup_donation"):
			donation_popup.setup_donation(tech)
