extends Control

# ==========================================
# CROWNSPIRE ALLIANCE DETAIL & RESEARCH PANEL
# ==========================================
# Houses general alliance info stats and active alliance research technologies.
# Provides a fully functioning donation simulation.

signal alliance_info_updated(info_data: Dictionary)
signal donation_made(tech_id: String, amount: int)

@onready var alliance_name_lbl: Label = get_node_or_null("%AllianceNameLabel")
@onready var alliance_tag_lbl: Label = get_node_or_null("%AllianceTagLabel")
@onready var leader_lbl: Label = get_node_or_null("%LeaderNameLabel")
@onready var power_lbl: Label = get_node_or_null("%AlliancePowerLabel")
@onready var members_count_lbl: Label = get_node_or_null("%MemberCountLabel")
@onready var desc_lbl: Label = get_node_or_null("%AllianceDescLabel")
@onready var fortress_lvl_lbl: Label = get_node_or_null("%FortressLevelLabel")
@onready var towers_placed_lbl: Label = get_node_or_null("%TowersPlacedLabel")
@onready var cores_lbl: Label = get_node_or_null("%CoresLabel")

# Research UI Elements
@onready var research_container: VBoxContainer = get_node_or_null("%ResearchContainer")
@onready var tech_prefab: PanelContainer = get_node_or_null("%TechPrefabContainer")

var alliance_info: Dictionary = {}
var research_db: Array = []

func _ready() -> void:
	if tech_prefab:
		tech_prefab.visible = false

func display_alliance(info: Dictionary, research: Array) -> void:
	alliance_info = info
	research_db = research
	
	_update_general_ui()
	_populate_research()

func _update_general_ui() -> void:
	if alliance_name_lbl:
		alliance_name_lbl.text = alliance_info.get("name", "Royal Sentry Alliance")
	if alliance_tag_lbl:
		alliance_tag_lbl.text = "[%s]" % alliance_info.get("tag", "SLY")
	if leader_lbl:
		leader_lbl.text = "Leader: " + alliance_info.get("leader", "Lord Commander")
	if power_lbl:
		power_lbl.text = "Alliance Power: %s" % _format_number(int(alliance_info.get("power", 0)))
	if members_count_lbl:
		var current = int(alliance_info.get("member_count", 1))
		var max_m = int(alliance_info.get("max_members", 100))
		members_count_lbl.text = "Members: %d / %d" % [current, max_m]
	if desc_lbl:
		desc_lbl.text = alliance_info.get("description", "A noble brotherhood sworn to defend Crownspire against darkness.")
	if fortress_lvl_lbl:
		fortress_lvl_lbl.text = "FORTRESS LVL: %d" % alliance_info.get("fortress_level", 1)
	if towers_placed_lbl:
		var placed = alliance_info.get("towers_placed", 0)
		var max_t = alliance_info.get("max_towers", 10)
		towers_placed_lbl.text = "TOWERS: %d / %d" % [placed, max_t]
	if cores_lbl:
		cores_lbl.text = "⚡ CORES: %d" % alliance_info.get("crystallite_cores", 0)

func _populate_research() -> void:
	if not research_container:
		return
		
	# Clear previous
	for child in research_container.get_children():
		if child != tech_prefab:
			child.queue_free()
			
	for tech in research_db:
		var row = _create_tech_row(tech)
		research_container.add_child(row)

func _create_tech_row(tech: Dictionary) -> PanelContainer:
	# Instantiates a clean, modular panel for each technology
	var panel = PanelContainer.new()
	panel.custom_minimum_size = Vector2(0, 90)
	
	var margin = MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 12)
	margin.add_theme_constant_override("margin_top", 8)
	margin.add_theme_constant_override("margin_right", 12)
	margin.add_theme_constant_override("margin_bottom", 8)
	panel.add_child(margin)
	
	var hbox = HBoxContainer.new()
	hbox.add_theme_constant_override("separation", 12)
	margin.add_child(hbox)
	
	# Icon Label
	var icon_lbl = Label.new()
	icon_lbl.text = tech.get("icon", "🧪")
	icon_lbl.custom_minimum_size = Vector2(36, 36)
	icon_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	icon_lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	hbox.add_child(icon_lbl)
	
	# Text Layout
	var vbox = VBoxContainer.new()
	vbox.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	hbox.add_child(vbox)
	
	# Name & Level
	var name_hbox = HBoxContainer.new()
	vbox.add_child(name_hbox)
	
	var name_lbl = Label.new()
	name_lbl.text = tech.get("name", "Alliance Research")
	name_lbl.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	name_hbox.add_child(name_lbl)
	
	var lvl_lbl = Label.new()
	var level = int(tech.get("level", 1))
	var max_lvl = int(tech.get("max_level", 10))
	lvl_lbl.text = "LVL %d/%d" % [level, max_lvl]
	lvl_lbl.modulate = Color(0.3, 0.85, 1.0)
	name_hbox.add_child(lvl_lbl)
	
	# Description
	var desc_lbl = Label.new()
	desc_lbl.text = tech.get("description", "Reduces building construction timelines.")
	desc_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	desc_lbl.add_theme_font_size_override("font_size", 12)
	desc_lbl.modulate = Color(0.7, 0.7, 0.7)
	vbox.add_child(desc_lbl)
	
	# Donation Bar & Text
	var donation_hbox = HBoxContainer.new()
	donation_hbox.add_theme_constant_override("separation", 10)
	vbox.add_child(donation_hbox)
	
	var progress = ProgressBar.new()
	var cur_donate = int(tech.get("current_donation", 0))
	var max_donate = int(tech.get("max_donation", 100000))
	progress.max_value = max_donate
	progress.value = cur_donate
	progress.show_percentage = false
	progress.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	progress.custom_minimum_size = Vector2(0, 8)
	donation_hbox.add_child(progress)
	
	var progress_lbl = Label.new()
	progress_lbl.text = "%s/%s" % [_format_number(cur_donate), _format_number(max_donate)]
	progress_lbl.add_theme_font_size_override("font_size", 11)
	progress_lbl.modulate = Color(0.8, 0.8, 0.8)
	donation_hbox.add_child(progress_lbl)
	
	# Donate Button Placeholder
	var donate_btn = Button.new()
	donate_btn.custom_minimum_size = Vector2(100, 32)
	donate_btn.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	
	var req_resource = tech.get("req_resource_type", "gold").to_upper()
	if level >= max_lvl:
		donate_btn.text = "MAXED"
		donate_btn.disabled = true
	else:
		donate_btn.text = "DONATE %s" % req_resource
		donate_btn.pressed.connect(func(): _on_donate_pressed(tech, progress, progress_lbl, donate_btn, lvl_lbl))
		
	hbox.add_child(donate_btn)
	
	return panel

func _on_donate_pressed(tech: Dictionary, progress: ProgressBar, progress_lbl: Label, donate_btn: Button, lvl_lbl: Label) -> void:
	var donation_amount = 10000
	var cur = int(tech.get("current_donation", 0)) + donation_amount
	var max_donate = int(tech.get("max_donation", 100000))
	var level = int(tech.get("level", 1))
	var max_lvl = int(tech.get("max_level", 10))
	
	if cur >= max_donate:
		if level < max_lvl:
			level += 1
			cur = cur - max_donate
			max_donate = int(max_donate * 1.5)
			tech["level"] = level
			tech["max_donation"] = max_donate
			
			# Modulate visual feedback for level up
			var tween = create_tween()
			tween.tween_property(lvl_lbl, "modulate", Color(1.0, 0.85, 0.1), 0.15)
			tween.tween_property(lvl_lbl, "modulate", Color(0.3, 0.85, 1.0), 0.3)
	
	tech["current_donation"] = cur
	
	# Update UI nodes
	progress.max_value = max_donate
	progress.value = cur
	progress_lbl.text = "%s/%s" % [_format_number(cur), _format_number(max_donate)]
	lvl_lbl.text = "LVL %d/%d" % [level, max_lvl]
	
	if level >= max_lvl:
		donate_btn.text = "MAXED"
		donate_btn.disabled = true
		
	# Trigger sound or local simulation indicators
	var global_ui = get_node_or_null("/root/UIManager")
	if global_ui and global_ui.has_method("play_click_sound"):
		global_ui.play_click_sound()
		
	# Emit donation signals
	donation_made.emit(tech.get("id", ""), donation_amount)

func _format_number(val: int) -> String:
	if val >= 1000000:
		return "%.1fM" % (val / 1000000.0)
	elif val >= 1000:
		return "%.0fK" % (val / 1000.0)
	return str(val)
