extends PanelContainer

# ==========================================
# CROWNSPIRE HERO SKILLS SUB-PANEL
# ==========================================
# Lists unlocked and passive abilities, allowing players to upgrade them with gold.

@onready var skills_vbox: VBoxContainer = %SkillsVBox

func load_skills(hero_id: String) -> void:
	# Clear previous entries
	for child in skills_vbox.get_children():
		child.queue_free()
		
	var skills = UIManager.get_hero_skills(hero_id)
	var hero = UIManager.get_hero(hero_id)
	var is_unlocked = hero.get("unlocked", false)
	
	if skills.size() == 0:
		var lbl = Label.new()
		lbl.text = "NO SKILLS SPECIFIED FOR THIS LEGION HERO"
		lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		skills_vbox.add_child(lbl)
		return
		
	for s in skills:
		var s_panel = create_skill_row(hero_id, s, is_unlocked)
		skills_vbox.add_child(s_panel)

func create_skill_row(hero_id: String, s_data: Dictionary, hero_unlocked: bool) -> PanelContainer:
	var panel = PanelContainer.new()
	var sb = StyleBoxFlat.new()
	sb.bg_color = Color(0.08, 0.12, 0.18, 0.9)
	sb.border_width_left = 2
	sb.border_color = Color(0.14, 0.22, 0.32, 1)
	sb.corner_radius_top_left = 8
	sb.corner_radius_bottom_left = 8
	panel.add_theme_stylebox_override("panel", sb)
	
	var margin = MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 12)
	margin.add_theme_constant_override("margin_top", 10)
	margin.add_theme_constant_override("margin_right", 12)
	margin.add_theme_constant_override("margin_bottom", 10)
	panel.add_child(margin)
	
	var hbox = HBoxContainer.new()
	hbox.add_theme_constant_override("separation", 12)
	margin.add_child(hbox)
	
	# Skill icon/emoji
	var icon_lbl = Label.new()
	icon_lbl.text = s_data.get("emoji", "🔮")
	icon_lbl.add_theme_font_size_override("font_size", 24)
	icon_lbl.custom_minimum_size = Vector2(40, 40)
	icon_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	icon_lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	hbox.add_child(icon_lbl)
	
	var vbox = VBoxContainer.new()
	vbox.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	vbox.add_theme_constant_override("separation", 4)
	hbox.add_child(vbox)
	
	# Skill header (Name and level)
	var header_hbox = HBoxContainer.new()
	vbox.add_child(header_hbox)
	
	var name_lbl = Label.new()
	name_lbl.text = s_data["name"].to_upper()
	name_lbl.add_theme_color_override("font_color", Color(1, 0.84, 0))
	name_lbl.add_theme_font_size_override("font_size", 12)
	header_hbox.add_child(name_lbl)
	
	var passive_lbl = Label.new()
	passive_lbl.text = " [PASSIVE]" if s_data.get("is_passive", false) else " [ACTIVE]"
	passive_lbl.add_theme_color_override("font_color", Color(1, 1, 1, 0.4))
	passive_lbl.add_theme_font_size_override("font_size", 10)
	header_hbox.add_child(passive_lbl)
	
	var lvl_lbl = Label.new()
	lvl_lbl.text = "  LVL %d/%d" % [s_data["level"], s_data.get("max_level", 5)]
	lvl_lbl.add_theme_color_override("font_color", Color(0.2, 0.8, 0.5))
	lvl_lbl.add_theme_font_size_override("font_size", 10)
	header_hbox.add_child(lvl_lbl)
	
	# Description
	var desc_lbl = Label.new()
	desc_lbl.text = s_data["description"]
	desc_lbl.add_theme_font_size_override("font_size", 10)
	desc_lbl.add_theme_color_override("font_color", Color(1, 1, 1, 0.7))
	desc_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	vbox.add_child(desc_lbl)
	
	# Upgrade Button
	var btn = Button.new()
	var lvl = s_data["level"]
	var max_lvl = s_data.get("max_level", 5)
	
	var gold_cost = lvl * 5000
	btn.text = "UPGRADE\n🪙 %d" % gold_cost
	btn.add_theme_font_size_override("font_size", 9)
	btn.custom_minimum_size = Vector2(100, 42)
	btn.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	
	var btn_sb = StyleBoxFlat.new()
	btn_sb.bg_color = Color(0.12, 0.53, 0.9, 1)
	btn_sb.corner_radius_top_left = 6
	btn_sb.corner_radius_top_right = 6
	btn_sb.corner_radius_bottom_right = 6
	btn_sb.corner_radius_bottom_left = 6
	btn.add_theme_stylebox_override("normal", btn_sb)
	
	if not hero_unlocked:
		btn.disabled = true
		btn.text = "LOCKED"
	elif lvl >= max_lvl:
		btn.disabled = true
		btn.text = "MAX LEVEL"
	elif UIManager.gold < gold_cost:
		btn.disabled = true
		# Redout normal style
		var btn_dis = StyleBoxFlat.new()
		btn_dis.bg_color = Color(0.4, 0.1, 0.1, 0.8)
		btn_dis.corner_radius_top_left = 6
		btn_dis.corner_radius_top_right = 6
		btn_dis.corner_radius_bottom_right = 6
		btn_dis.corner_radius_bottom_left = 6
		btn.add_theme_stylebox_override("disabled", btn_dis)
		
	btn.pressed.connect(func():
		var res = UIManager.upgrade_hero_skill(hero_id, s_data["id"])
		if res["success"]:
			# Visual refresh triggers via signals connected in HeroDetailPanel
			pass
	)
	hbox.add_child(btn)
	
	return panel
