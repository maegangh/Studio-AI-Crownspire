extends PanelContainer

# ==========================================
# CROWNSPIRE HERO EQUIPMENT COMPONENT
# ==========================================
# Manages four primary gear slots: Weapon, Helmet, Armor, Boots.
# Provides detailed forged level and stats increment options.

@onready var eq_grid: GridContainer = %EquipmentGrid

func load_equipment(hero_id: String) -> void:
	# Clear previous entries
	for child in eq_grid.get_children():
		child.queue_free()
		
	var gear = UIManager.get_hero_equipment(hero_id)
	var hero = UIManager.get_hero(hero_id)
	var is_unlocked = hero.get("unlocked", false)
	
	# Define core slots in case some are empty/not loaded yet
	var slot_types = ["weapon", "helmet", "armor", "boots"]
	var gear_by_slot = {}
	for g in gear:
		gear_by_slot[g["slot"]] = g
		
	for slot in slot_types:
		var card = create_gear_slot_card(hero_id, slot, gear_by_slot.get(slot, {}), is_unlocked)
		eq_grid.add_child(card)

func create_gear_slot_card(hero_id: String, slot_name: String, g_data: Dictionary, hero_unlocked: bool) -> PanelContainer:
	var card = PanelContainer.new()
	var card_sb = StyleBoxFlat.new()
	card_sb.bg_color = Color(0.05, 0.08, 0.12, 0.95)
	card_sb.border_width_bottom = 2
	card_sb.border_color = Color(1, 0.84, 0, 0.1)
	card_sb.corner_radius_top_left = 10
	card_sb.corner_radius_top_right = 10
	card_sb.corner_radius_bottom_right = 10
	card_sb.corner_radius_bottom_left = 10
	card.add_theme_stylebox_override("panel", card_sb)
	
	var margin = MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 10)
	margin.add_theme_constant_override("margin_top", 10)
	margin.add_theme_constant_override("margin_right", 10)
	margin.add_theme_constant_override("margin_bottom", 10)
	card.add_child(margin)
	
	var vbox = VBoxContainer.new()
	vbox.add_theme_constant_override("separation", 6)
	margin.add_child(vbox)
	
	# Slot Type & Name
	var header = HBoxContainer.new()
	vbox.add_child(header)
	
	var slot_badge = Label.new()
	slot_badge.text = "[%s]" % slot_name.to_upper()
	slot_badge.add_theme_font_size_override("font_size", 9)
	slot_badge.add_theme_color_override("font_color", Color(1, 0.84, 0, 0.7))
	header.add_child(slot_badge)
	
	# If there is no gear in slot
	if g_data.is_empty():
		var empty_lbl = Label.new()
		empty_lbl.text = "EMPTY SLOT"
		empty_lbl.add_theme_font_size_override("font_size", 11)
		empty_lbl.add_theme_color_override("font_color", Color(1, 1, 1, 0.3))
		vbox.add_child(empty_lbl)
		return card
		
	# Equipment title
	var name_lbl = Label.new()
	name_lbl.text = g_data["name"].to_upper()
	name_lbl.add_theme_font_size_override("font_size", 10)
	name_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	vbox.add_child(name_lbl)
	
	# Stat values & forging levels
	var stats_hbox = HBoxContainer.new()
	vbox.add_child(stats_hbox)
	
	var stat_lbl = Label.new()
	stat_lbl.text = "%s: +%d" % [g_data["stat_type"], g_data["stat_value"]]
	stat_lbl.add_theme_font_size_override("font_size", 10)
	stat_lbl.add_theme_color_override("font_color", Color(0.2, 0.8, 0.5))
	stats_hbox.add_child(stat_lbl)
	
	var lvl_lbl = Label.new()
	lvl_lbl.text = "   FORGE LVL: %d" % g_data["level"]
	lvl_lbl.add_theme_font_size_override("font_size", 9)
	lvl_lbl.add_theme_color_override("font_color", Color(1, 1, 1, 0.4))
	stats_hbox.add_child(lvl_lbl)
	
	# Colors based on rarity
	var rarity = g_data.get("rarity", "Rare")
	match rarity:
		"Legendary":
			name_lbl.add_theme_color_override("font_color", Color(1, 0.84, 0))
			card_sb.border_color = Color(1, 0.84, 0, 0.4)
		"Epic":
			name_lbl.add_theme_color_override("font_color", Color(0.75, 0.35, 1))
			card_sb.border_color = Color(0.75, 0.35, 1, 0.4)
		_:
			name_lbl.add_theme_color_override("font_color", Color(0.2, 0.6, 1))
			card_sb.border_color = Color(0.2, 0.6, 1, 0.3)
			
	# Costs calculation
	var iron_cost = g_data["level"] * 500
	var gold_cost = g_data["level"] * 1200
	
	# Action row (Button)
	var forge_btn = Button.new()
	forge_btn.text = "FORGE (🪙%d / ⚙️%d)" % [gold_cost, iron_cost]
	forge_btn.add_theme_font_size_override("font_size", 9)
	forge_btn.custom_minimum_size = Vector2(0, 32)
	
	var btn_sb = StyleBoxFlat.new()
	btn_sb.bg_color = Color(0.06, 0.12, 0.1, 1)
	btn_sb.border_width_bottom = 1
	btn_sb.border_color = Color(0.2, 0.8, 0.5, 0.4)
	btn_sb.corner_radius_top_left = 6
	btn_sb.corner_radius_top_right = 6
	btn_sb.corner_radius_bottom_right = 6
	btn_sb.corner_radius_bottom_left = 6
	forge_btn.add_theme_stylebox_override("normal", btn_sb)
	
	# Disable checks
	if not hero_unlocked:
		forge_btn.disabled = true
		forge_btn.text = "LOCKED"
	elif UIManager.gold < gold_cost or UIManager.iron < iron_cost:
		forge_btn.disabled = true
		var btn_dis = StyleBoxFlat.new()
		btn_dis.bg_color = Color(0.4, 0.1, 0.1, 0.8)
		btn_dis.corner_radius_top_left = 6
		btn_dis.corner_radius_top_right = 6
		btn_dis.corner_radius_bottom_right = 6
		btn_dis.corner_radius_bottom_left = 6
		forge_btn.add_theme_stylebox_override("disabled", btn_dis)
		
	forge_btn.pressed.connect(func():
		var res = UIManager.upgrade_hero_equipment(hero_id, g_data["id"])
		if res["success"]:
			# Refreshed automatically by connected global signal in parent panel
			pass
	)
	vbox.add_child(forge_btn)
	
	return card
