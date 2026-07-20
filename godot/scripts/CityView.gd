extends Control

# ==========================================
# CROWNSPIRE INTERACTIVE CITY GAMEPLAY SCENE
# ==========================================
# Provides full-fidelity kingdom building simulation including:
# - Building grid selection with focus indicators
# - Construction/Upgrade windows with resource check lists
# - Training barracks legions with recruit size controllers
# - Dynamic academy technology research matrix
# - Real-time resource generation & floating collection badges
# - Smart notification alerts for affordable upgrades and collections

@onready var grid_container: GridContainer = %BuildingGrid
@onready var detail_drawer: PanelContainer = %DetailDrawer
@onready var empty_hint: Label = %EmptySelectionHint
@onready var drawer_content: VBoxContainer = %DrawerContent

# Detail Drawer elements
@onready var b_name: Label = %DrawerBuildingName
@onready var b_level: Label = %DrawerBuildingLevel
@onready var b_desc: Label = %DrawerBuildingDesc
@onready var b_power: Label = %DrawerBuildingPower
@onready var b_bonus: Label = %DrawerCurrentBonus
@onready var b_next_bonus: Label = %DrawerNextBonus

# Upgrade Section
@onready var upgrade_box: VBoxContainer = %UpgradeSection
@onready var cost_food_lbl: Label = %CostFood
@onready var cost_wood_lbl: Label = %CostWood
@onready var cost_stone_lbl: Label = %CostStone
@onready var cost_iron_lbl: Label = %CostIron
@onready var b_upgrade_btn: Button = %UpgradeActionButton

# Barracks Section
@onready var barracks_box: VBoxContainer = %BarracksSection
@onready var troop_opt: OptionButton = %TroopTypeSelector
@onready var troop_desc: Label = %TroopSpecsDesc
@onready var troop_cost_lbl: Label = %TroopCostSummary
@onready var train_slider: HSlider = %TrainCountSlider
@onready var train_count_lbl: Label = %TrainCountLabel
@onready var b_train_btn: Button = %TrainActionButton

# Academy Section
@onready var academy_box: VBoxContainer = %AcademySection
@onready var tech_list_container: VBoxContainer = %TechListContainer

# Audio / Tween assets
var selected_building_id: String = ""
var current_troop_id: String = ""
var action_bar: HBoxContainer = null

func _ready() -> void:
	# Hide drawer items initially
	detail_drawer.visible = false
	empty_hint.visible = true
	drawer_content.visible = false
	
	upgrade_box.visible = false
	barracks_box.visible = false
	academy_box.visible = false
	
	action_bar = HBoxContainer.new()
	action_bar.alignment = BoxContainer.ALIGNMENT_CENTER
	action_bar.add_theme_constant_override("separation", 10)
	drawer_content.add_child(action_bar)
	
	# Connect global signals
	UIManager.currency_changed.connect(_on_resources_changed)
	UIManager.building_updated.connect(_on_building_updated)
	UIManager.building_collected.connect(_on_building_collected)
	UIManager.technology_researched.connect(_on_technology_researched)
	
	# Initial draw
	rebuild_grid()
	
	# Connect local signals
	b_upgrade_btn.pressed.connect(_on_upgrade_pressed)
	b_train_btn.pressed.connect(_on_train_pressed)
	train_slider.value_changed.connect(_on_train_slider_changed)
	troop_opt.item_selected.connect(_on_troop_type_selected)
	
	# Auto-refresh resource numbers every 1 second
	var timer = Timer.new()
	timer.wait_time = 0.5
	timer.autostart = true
	timer.timeout.connect(update_resource_accumulations)
	add_child(timer)

# --- GRID RENDERING ---
func rebuild_grid() -> void:
	# Clear existing children
	for child in grid_container.get_children():
		child.queue_free()
		
	var buildings_list = UIManager.get_all_buildings()
	for b in buildings_list:
		var card = create_building_card(b)
		grid_container.add_child(card)

func create_building_card(b: Dictionary) -> PanelContainer:
	var card = PanelContainer.new()
	card.name = "Building_" + b["id"]
	card.custom_minimum_size = Vector2(310, 180)
	card.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	
	# Stylebox flat background
	var sb = StyleBoxFlat.new()
	sb.bg_color = Color(0.11, 0.15, 0.22, 1.0)
	sb.border_width_left = 2
	sb.border_width_top = 2
	sb.border_width_right = 2
	sb.border_width_bottom = 2
	sb.border_color = Color(0.18, 0.24, 0.35, 1.0)
	sb.corner_radius_top_left = 12
	sb.corner_radius_top_right = 12
	sb.corner_radius_bottom_right = 12
	sb.corner_radius_bottom_left = 12
	
	# Highlight selected
	if b["id"] == selected_building_id:
		sb.border_color = Color(1.0, 0.84, 0.0, 1.0) # Gold border
		sb.bg_color = Color(0.14, 0.19, 0.28, 1.0)
	card.add_theme_stylebox_override("panel", sb)
	
	# Content layout
	var margin = MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 12)
	margin.add_theme_constant_override("margin_top", 12)
	margin.add_theme_constant_override("margin_right", 12)
	margin.add_theme_constant_override("margin_bottom", 12)
	card.add_child(margin)
	
	var vbox = VBoxContainer.new()
	vbox.add_theme_constant_override("separation", 4)
	margin.add_child(vbox)
	
	# Header Row (Icon + Name)
	var header = HBoxContainer.new()
	header.add_theme_constant_override("separation", 8)
	vbox.add_child(header)
	
	var icon_lbl = Label.new()
	icon_lbl.text = get_building_unicode_icon(b["id"])
	icon_lbl.add_theme_font_size_override("font_size", 28)
	header.add_child(icon_lbl)
	
	var name_vbox = VBoxContainer.new()
	name_vbox.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	header.add_child(name_vbox)
	
	var name_lbl = Label.new()
	name_lbl.text = b["name"].split(" ")[-1] if " " in b["name"] else b["name"] # short name
	name_lbl.add_theme_font_size_override("font_size", 13)
	name_lbl.add_theme_color_override("font_color", Color(1.0, 1.0, 1.0, 1.0))
	name_vbox.add_child(name_lbl)
	
	var level_lbl = Label.new()
	level_lbl.text = "Level %d" % b["level"]
	level_lbl.add_theme_font_size_override("font_size", 11)
	level_lbl.add_theme_color_override("font_color", Color(1.0, 0.84, 0.0, 0.8)) # Gold tint
	name_vbox.add_child(level_lbl)
	
	# Status Indicator (Notification badge)
	var status_lbl = Label.new()
	status_lbl.text = "●"
	status_lbl.add_theme_font_size_override("font_size", 10)
	status_lbl.add_theme_color_override("font_color", Color(0.2, 0.8, 0.4, 1.0)) # green active
	header.add_child(status_lbl)
	
	# Separator
	var sep = ColorRect.new()
	sep.custom_minimum_size = Vector2(0, 1)
	sep.color = Color(0.18, 0.24, 0.35, 0.5)
	vbox.add_child(sep)
	
	# Main Stats Row
	var stats_lbl = Label.new()
	stats_lbl.text = b.get("current_bonus", "Garrison Active")
	stats_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	stats_lbl.add_theme_font_size_override("font_size", 11)
	stats_lbl.add_theme_color_override("font_color", Color(0.7, 0.8, 0.9, 0.8))
	vbox.add_child(stats_lbl)
	
	# Extra spacer
	var spacer = Control.new()
	spacer.size_flags_vertical = Control.SIZE_EXPAND_FILL
	vbox.add_child(spacer)
	
	# Resource Accumulator Bubble or Upgrade Badge
	var action_box = HBoxContainer.new()
	action_box.alignment = BoxContainer.ALIGNMENT_CENTER
	vbox.add_child(action_box)
	
	if b.get("type", "") == "resource":
		var collect_btn = Button.new()
		collect_btn.name = "CollectButton"
		collect_btn.add_theme_font_size_override("font_size", 11)
		
		# Flat button styling
		var btn_sb = StyleBoxFlat.new()
		btn_sb.bg_color = Color(0.06, 0.52, 0.34, 0.9)
		btn_sb.corner_radius_top_left = 8
		btn_sb.corner_radius_top_right = 8
		btn_sb.corner_radius_bottom_right = 8
		btn_sb.corner_radius_bottom_left = 8
		collect_btn.add_theme_stylebox_override("normal", btn_sb)
		
		var amt = int(b.get("accumulated_resources", 0.0))
		collect_btn.text = "🌾 Collect %d" % amt if b["produces"] == "food" else "🪵 Collect %d" % amt
		if b["produces"] == "stone": collect_btn.text = "🪨 Collect %d" % amt
		if b["produces"] == "iron": collect_btn.text = "⛓️ Collect %d" % amt
		
		collect_btn.pressed.connect(func(): _on_collect_clicked(b["id"]))
		collect_btn.disabled = amt <= 0
		if collect_btn.disabled:
			collect_btn.modulate = Color(0.5, 0.5, 0.5, 0.5)
		action_box.add_child(collect_btn)
		
		# Simple hover animation if enabled
		if amt > 1000:
			var pulse_tween = create_tween().set_loops()
			pulse_tween.tween_property(collect_btn, "scale", Vector2(1.03, 1.03), 0.6)
			pulse_tween.tween_property(collect_btn, "scale", Vector2(1.0, 1.0), 0.6)
	else:
		# Infrastructure / Military Upgrade notification arrow
		var can_upgrade = check_upgrade_affordability(b)
		var arrow_lbl = Label.new()
		if can_upgrade:
			arrow_lbl.text = "🟢 READY TO UPGRADE"
			arrow_lbl.add_theme_color_override("font_color", Color(0.2, 0.9, 0.4, 0.9))
		else:
			arrow_lbl.text = "🛡️ Stable"
			arrow_lbl.add_theme_color_override("font_color", Color(0.5, 0.6, 0.7, 0.5))
		arrow_lbl.add_theme_font_size_override("font_size", 10)
		action_box.add_child(arrow_lbl)
		
	# Mouse filter / click logic
	card.gui_input.connect(func(ev):
		if ev is InputEventMouseButton and ev.pressed and ev.button_index == MOUSE_BUTTON_LEFT:
			select_building(b["id"])
	)
	
	return card

func get_building_unicode_icon(b_id: String) -> String:
	match b_id:
		"citadel": return "🏰"
		"farm": return "🌾"
		"lumber_mill": return "🪵"
		"quarry": return "🪨"
		"iron_mine": return "⛓️"
		"barracks": return "🛡️"
		"academy": return "📜"
		_: return "🏠"

# --- RESOURCE COUNT REFRESH (POLLED TIMER) ---
func update_resource_accumulations() -> void:
	for b in UIManager.get_all_buildings():
		var card_node = grid_container.get_node_or_null("Building_" + b["id"])
		if card_node:
			var collect_btn = card_node.find_child("CollectButton", true, false) as Button
			if collect_btn:
				var amt = int(b.get("accumulated_resources", 0.0))
				var prefix = "🌾"
				if b["produces"] == "wood": prefix = "🪵"
				elif b["produces"] == "stone": prefix = "🪨"
				elif b["produces"] == "iron": prefix = "⛓️"
				
				collect_btn.text = "%s Collect %d" % [prefix, amt]
				collect_btn.disabled = amt <= 0
				if collect_btn.disabled:
					collect_btn.modulate = Color(0.5, 0.5, 0.5, 0.5)
				else:
					collect_btn.modulate = Color(1, 1, 1, 1)

# --- SELECTION & DETAILS ---
func select_building(b_id: String) -> void:
	selected_building_id = b_id
	
	# Visual update of all cards
	for child in grid_container.get_children():
		var child_b_id = child.name.replace("Building_", "")
		var sb = child.get_theme_stylebox("panel") as StyleBoxFlat
		if sb:
			if child_b_id == selected_building_id:
				sb.border_color = Color(1.0, 0.84, 0.0, 1.0) # Gold
				sb.bg_color = Color(0.14, 0.19, 0.28, 1.0)
			else:
				sb.border_color = Color(0.18, 0.24, 0.35, 1.0) # Muted blue
				sb.bg_color = Color(0.11, 0.15, 0.22, 1.0)
				
	# Show Drawer
	var b_data = UIManager.get_building(b_id)
	if not b_data.is_empty():
		empty_hint.visible = false
		drawer_content.visible = true
		detail_drawer.visible = true
		
		# Animate slide up of drawer
		var drawer_tween = create_tween()
		detail_drawer.modulate.a = 0.0
		drawer_tween.tween_property(detail_drawer, "modulate:a", 1.0, 0.25)
		
		# Basic metadata
		b_name.text = b_data["name"].to_upper()
		b_level.text = "LEVEL %d STRUCTURE" % b_data["level"]
		b_desc.text = b_data["description"]
		b_power.text = "Base power valuation: %d rating points" % int(b_data["base_power"] + b_data["level"] * b_data["power_per_level"])
		b_bonus.text = "Current: %s" % b_data.get("current_bonus", "Active")
		b_next_bonus.text = "Next: %s" % b_data.get("next_bonus", "Boosted stats")
		
		# Toggle Sections
		barracks_box.visible = false
		academy_box.visible = false
		upgrade_box.visible = false
		
		if b_id == "academy":
			populate_academy(b_data)
			
		update_action_bar(b_data)

func update_upgrade_cost_display(b: Dictionary) -> void:
	var lvl = b["level"]
	var reqs = b.get("resources_required", {})
	
	var req_food = int(reqs.get("food", 0) * (1.0 + lvl * 0.15))
	var req_wood = int(reqs.get("wood", 0) * (1.0 + lvl * 0.15))
	var req_stone = int(reqs.get("stone", 0) * (1.0 + lvl * 0.15))
	var req_iron = int(reqs.get("iron", 0) * (1.0 + lvl * 0.15))
	
	style_resource_cost_label(cost_food_lbl, UIManager.food, req_food, "Food")
	style_resource_cost_label(cost_wood_lbl, UIManager.wood, req_wood, "Wood")
	style_resource_cost_label(cost_stone_lbl, UIManager.stone, req_stone, "Stone")
	style_resource_cost_label(cost_iron_lbl, UIManager.iron, req_iron, "Iron")
	
	b_upgrade_btn.text = "UPGRADE TO LEVEL %d" % [lvl + 1]

func style_resource_cost_label(lbl: Label, player_amt: int, req_amt: int, res_name: String) -> void:
	if req_amt <= 0:
		lbl.text = "• %s Cost: None required" % res_name
		lbl.add_theme_color_override("font_color", Color(0.7, 0.8, 0.9, 0.6))
	else:
		var raw_lbl = "• %s: %s / %s" % [res_name, format_large_number(player_amt), format_large_number(req_amt)]
		lbl.text = raw_lbl
		if player_amt >= req_amt:
			lbl.add_theme_color_override("font_color", Color(0.3, 0.85, 0.45, 1.0)) # emerald
		else:
			lbl.add_theme_color_override("font_color", Color(0.9, 0.3, 0.3, 1.0)) # crimson

func format_large_number(n: int) -> String:
	if n >= 1000000:
		return "%.1fM" % (float(n) / 1000000.0)
	elif n >= 1000:
		return "%.1fK" % (float(n) / 1000.0)
	return str(n)

# --- BARRACKS CONTROLLER ---
func populate_barracks(b_data: Dictionary) -> void:
	troop_opt.clear()
	var troop_types = b_data.get("troop_types", [])
	for idx in range(troop_types.size()):
		var troop = troop_types[idx]
		troop_opt.add_item(troop["name"], idx)
		
	if troop_types.size() > 0:
		_on_troop_type_selected(0)

func _on_troop_type_selected(index: int) -> void:
	var b_data = UIManager.get_building("barracks")
	var troop_types = b_data.get("troop_types", [])
	if index < 0 or index >= troop_types.size():
		return
		
	var troop = troop_types[index]
	current_troop_id = troop["id"]
	
	troop_desc.text = troop["description"]
	
	# Reset Slider
	train_slider.min_value = 1
	train_slider.max_value = 250
	train_slider.value = 50
	
	_on_train_slider_changed(50)

func _on_train_slider_changed(val: float) -> void:
	var count = int(val)
	train_count_lbl.text = "RECRUIT BATCH QUANTITY: %d" % count
	
	var b_data = UIManager.get_building("barracks")
	var troop = {}
	for t in b_data.get("troop_types", []):
		if t["id"] == current_troop_id:
			troop = t
			break
			
	if not troop.is_empty():
		var total_food = int(troop.get("cost_food", 0)) * count
		var total_wood = int(troop.get("cost_wood", 0)) * count
		var total_iron = int(troop.get("cost_iron", 0)) * count
		
		var out_str = "Required recruitment assets:\n"
		out_str += "  🌾 Food: %s   🪵 Wood: %s   ⛓️ Iron: %s\n" % [
			format_large_number(total_food),
			format_large_number(total_wood),
			format_large_number(total_iron)
		]
		out_str += "  ⚔️ Total Army Power gain: +%d points" % [int(troop.get("power_rating", 1)) * count]
		troop_cost_lbl.text = out_str

func _on_train_pressed() -> void:
	if current_troop_id == "":
		return
		
	var count = int(train_slider.value)
	var res = UIManager.train_barracks_troops(current_troop_id, count)
	if res["success"]:
		# Animate Barracks card
		animate_building_success("barracks")
		# Reload display
		_on_train_slider_changed(train_slider.value)
		_on_resources_changed("", 0)
	else:
		show_hud_warning(res["message"])

# --- ACADEMY TECHNOLOGY MATRIX ---
func populate_academy(b_data: Dictionary) -> void:
	# Clear previous technologies
	for child in tech_list_container.get_children():
		child.queue_free()
		
	var techs = b_data.get("technologies", [])
	for tech in techs:
		var t_panel = PanelContainer.new()
		
		var t_sb = StyleBoxFlat.new()
		t_sb.bg_color = Color(0.14, 0.18, 0.27, 0.9)
		t_sb.corner_radius_top_left = 8
		t_sb.corner_radius_top_right = 8
		t_sb.corner_radius_bottom_right = 8
		t_sb.corner_radius_bottom_left = 8
		t_panel.add_theme_stylebox_override("panel", t_sb)
		
		var t_margin = MarginContainer.new()
		t_margin.add_theme_constant_override("margin_left", 8)
		t_margin.add_theme_constant_override("margin_top", 8)
		t_margin.add_theme_constant_override("margin_right", 8)
		t_margin.add_theme_constant_override("margin_bottom", 8)
		t_panel.add_child(t_margin)
		
		var t_hbox = HBoxContainer.new()
		t_hbox.add_theme_constant_override("separation", 10)
		t_margin.add_child(t_hbox)
		
		var t_icon = Label.new()
		t_icon.text = "🧪" if tech["id"] == "taxation" else "📦" if tech["id"] == "logistics" else "🛡️"
		t_icon.add_theme_font_size_override("font_size", 22)
		t_hbox.add_child(t_icon)
		
		var t_vbox = VBoxContainer.new()
		t_vbox.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		t_hbox.add_child(t_vbox)
		
		var t_title = Label.new()
		t_title.text = "%s (Lv. %d/%d)" % [tech["name"], tech["level"], tech["max_level"]]
		t_title.add_theme_font_size_override("font_size", 12)
		t_title.add_theme_color_override("font_color", Color(1.0, 1.0, 1.0, 1.0))
		t_vbox.add_child(t_title)
		
		var t_desc = Label.new()
		t_desc.text = "%s\nBenefit: %s" % [tech["description"], tech["bonus_description"]]
		t_desc.add_theme_font_size_override("font_size", 10)
		t_desc.add_theme_color_override("font_color", Color(0.7, 0.8, 0.9, 0.8))
		t_desc.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		t_vbox.add_child(t_desc)
		
		# Show costs inline
		var lvl = tech["level"]
		var cost_food = int(tech.get("cost_food", 0) * (1.0 + lvl * 0.25))
		var cost_gold = int(tech.get("cost_gold", 0) * (1.0 + lvl * 0.25))
		
		var t_cost = Label.new()
		t_cost.text = "🌾 Food: %s  🪙 Gold: %s" % [format_large_number(cost_food), format_large_number(cost_gold)]
		t_cost.add_theme_font_size_override("font_size", 10)
		t_vbox.add_child(t_cost)
		
		# Research Button
		var r_btn = Button.new()
		r_btn.text = "RESEARCH"
		r_btn.add_theme_font_size_override("font_size", 10)
		r_btn.size_flags_vertical = Control.SIZE_SHRINK_CENTER
		
		var btn_sb = StyleBoxFlat.new()
		btn_sb.bg_color = Color(0.18, 0.44, 0.72, 1.0) # blue research
		btn_sb.corner_radius_top_left = 6
		btn_sb.corner_radius_top_right = 6
		btn_sb.corner_radius_bottom_right = 6
		btn_sb.corner_radius_bottom_left = 6
		r_btn.add_theme_stylebox_override("normal", btn_sb)
		
		# Affordability check
		var can_research = UIManager.food >= cost_food and UIManager.gold >= cost_gold and lvl < tech["max_level"]
		r_btn.disabled = not can_research
		if r_btn.disabled:
			r_btn.modulate = Color(0.5, 0.5, 0.5, 0.5)
			
		var t_id = tech["id"]
		r_btn.pressed.connect(func(): _on_research_clicked(t_id))
		t_hbox.add_child(r_btn)
		
		tech_list_container.add_child(t_panel)

func _on_research_clicked(tech_id: String) -> void:
	var res = UIManager.research_technology(tech_id)
	if res["success"]:
		animate_building_success("academy")
		# reload displays
		var academy_ref = UIManager.get_building("academy")
		populate_academy(academy_ref)
		_on_resources_changed("", 0)
	else:
		show_hud_warning(res["message"])

# --- CORE ACTIONS CALLBACKS ---
func _on_upgrade_pressed() -> void:
	if selected_building_id == "":
		return
		
	var res = UIManager.upgrade_building(selected_building_id)
	if res["success"]:
		# Play gorgeous success animation on card
		animate_building_success(selected_building_id)
		# Update Selection pane details
		select_building(selected_building_id)
	else:
		show_hud_warning(res["message"])

func _on_collect_clicked(b_id: String) -> void:
	var res = UIManager.collect_building_resources(b_id)
	if res["success"]:
		animate_building_success(b_id)
		# update grid card
		var b_data = UIManager.get_building(b_id)
		var card_node = grid_container.get_node_or_null("Building_" + b_id)
		if card_node:
			var collect_btn = card_node.find_child("CollectButton", true, false) as Button
			if collect_btn:
				collect_btn.disabled = true
				collect_btn.text = "🌾 Empty"
				
		if selected_building_id == b_id:
			select_building(b_id)
	else:
		show_hud_warning(res["message"])

# --- SIGNALS DISPATCH & AMBIENT ANIMATIONS ---
func _on_resources_changed(_p: String, _v: float) -> void:
	if selected_building_id != "":
		var b_data = UIManager.get_building(selected_building_id)
		if not b_data.is_empty():
			update_upgrade_cost_display(b_data)
			if selected_building_id == "academy":
				populate_academy(b_data)
			elif selected_building_id == "barracks":
				_on_train_slider_changed(train_slider.value)
	
	# Update ready upgrade notification badges across ALL panels
	for child in grid_container.get_children():
		var child_b_id = child.name.replace("Building_", "")
		var b = UIManager.get_building(child_b_id)
		if not b.is_empty() and b.get("type", "") != "resource":
			var badge = child.find_child("ReadyToUpgradeLabel", true, false) as Label
			var can_up = check_upgrade_affordability(b)
			if badge:
				badge.visible = can_up

func _on_building_updated(b_id: String, new_level: int) -> void:
	rebuild_grid()
	if selected_building_id == b_id:
		select_building(b_id)

func _on_building_collected(b_id: String, _type: String, _amount: int) -> void:
	# Small card shake animation
	var card = grid_container.get_node_or_null("Building_" + b_id)
	if card:
		var tween = create_tween()
		tween.tween_property(card, "position:y", card.position.y - 10, 0.1).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
		tween.tween_property(card, "position:y", card.position.y, 0.1).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN)

func _on_technology_researched(_tech_id: String, _lvl: int) -> void:
	if selected_building_id == "academy":
		var b_data = UIManager.get_building("academy")
		populate_academy(b_data)

func check_upgrade_affordability(b: Dictionary) -> bool:
	var lvl = b["level"]
	if lvl >= b.get("max_level", 30):
		return false
	var reqs = b.get("resources_required", {})
	
	var req_food = int(reqs.get("food", 0) * (1.0 + lvl * 0.15))
	var req_wood = int(reqs.get("wood", 0) * (1.0 + lvl * 0.15))
	var req_stone = int(reqs.get("stone", 0) * (1.0 + lvl * 0.15))
	var req_iron = int(reqs.get("iron", 0) * (1.0 + lvl * 0.15))
	
	return UIManager.food >= req_food and UIManager.wood >= req_wood and UIManager.stone >= req_stone and UIManager.iron >= req_iron

func animate_building_success(b_id: String) -> void:
	var card = grid_container.get_node_or_null("Building_" + b_id)
	if card:
		var tween = create_tween()
		tween.tween_property(card, "scale", Vector2(1.06, 1.06), 0.12).set_trans(Tween.TRANS_BOUNCE)
		tween.tween_property(card, "scale", Vector2(1.0, 1.0), 0.12).set_trans(Tween.TRANS_BOUNCE)

func show_hud_warning(msg: String) -> void:
	# Broadcast rewards alert format representing general error/warning alerts
	UIManager.reward_claimed.emit([
		{"name": "COMMAND: %s" % msg, "quantity": 1, "rarity": 1, "icon": ""}
	])

func update_action_bar(b_data: Dictionary) -> void:
	if not action_bar:
		return
		
	# Clear old buttons
	for child in action_bar.get_children():
		child.queue_free()
		
	var b_id = b_data.get("id", "")
	if b_id == "":
		return
		
	# 1. INFO Button (Always available!)
	var info_btn = Button.new()
	info_btn.text = "ℹ️ INFO"
	info_btn.add_theme_font_size_override("font_size", 12)
	info_btn.custom_minimum_size = Vector2(90, 36)
	_style_drawer_button(info_btn, Color(0.18, 0.24, 0.35, 1.0)) # Muted slate blue
	info_btn.pressed.connect(func(): _on_info_action_pressed(b_id))
	action_bar.add_child(info_btn)
	
	# 2. UPGRADE Button (Always available!)
	var upgrade_btn = Button.new()
	upgrade_btn.text = "⚡ UPGRADE"
	upgrade_btn.add_theme_font_size_override("font_size", 12)
	upgrade_btn.custom_minimum_size = Vector2(100, 36)
	_style_drawer_button(upgrade_btn, Color(0.72, 0.55, 0.12, 1.0)) # Gold / Amber
	upgrade_btn.pressed.connect(func(): _on_upgrade_action_pressed(b_id))
	action_bar.add_child(upgrade_btn)
	
	# 3. TRAIN Button (Only for military structures: barracks, marksmen_camp, cavalry_stable)
	if b_id in ["barracks", "marksmen_camp", "cavalry_stable"]:
		var train_btn = Button.new()
		train_btn.text = "⚔️ TRAIN"
		train_btn.add_theme_font_size_override("font_size", 12)
		train_btn.custom_minimum_size = Vector2(90, 36)
		_style_drawer_button(train_btn, Color(0.12, 0.55, 0.12, 1.0)) # Emerald Green
		var t_class = "infantry"
		if b_id == "marksmen_camp": t_class = "marksmen"
		elif b_id == "cavalry_stable": t_class = "cavalry"
		var final_class = t_class
		train_btn.pressed.connect(func(): _on_train_action_pressed(final_class))
		action_bar.add_child(train_btn)
		
	# 4. RESEARCH Button (Only for academy)
	if b_id == "academy":
		var research_btn = Button.new()
		research_btn.text = "🧪 RESEARCH"
		research_btn.add_theme_font_size_override("font_size", 12)
		research_btn.custom_minimum_size = Vector2(100, 36)
		_style_drawer_button(research_btn, Color(0.15, 0.45, 0.75, 1.0)) # Sapphire Blue
		research_btn.pressed.connect(func(): _on_research_action_pressed())
		action_bar.add_child(research_btn)

func _style_drawer_button(btn: Button, bg_color: Color) -> void:
	var sb = StyleBoxFlat.new()
	sb.bg_color = bg_color
	sb.border_width_left = 1
	sb.border_width_top = 1
	sb.border_width_right = 1
	sb.border_width_bottom = 2
	sb.border_color = Color(1.0, 1.0, 1.0, 0.15)
	sb.corner_radius_top_left = 6
	sb.corner_radius_top_right = 6
	sb.corner_radius_bottom_right = 6
	sb.corner_radius_bottom_left = 6
	btn.add_theme_stylebox_override("normal", sb)
	btn.add_theme_stylebox_override("hover", sb)
	btn.add_theme_stylebox_override("pressed", sb)

func _on_info_action_pressed(b_id: String) -> void:
	var info_scene = load("res://scenes/BuildingInfoWindow.tscn")
	if info_scene:
		var window = info_scene.instantiate()
		window.set("building_id", b_id)
		UIManager.call("open_popup", window)

func _on_upgrade_action_pressed(b_id: String) -> void:
	var upgrade_scene = load("res://scenes/BuildingUpgradeWindow.tscn")
	if upgrade_scene:
		var window = upgrade_scene.instantiate()
		window.set("building_id", b_id)
		UIManager.call("open_popup", window)

func _on_train_action_pressed(t_class: String) -> void:
	var train_scene = load("res://scenes/TroopTrainingWindow.tscn")
	if train_scene:
		var window = train_scene.instantiate()
		window.set("troop_class", t_class)
		UIManager.call("open_popup", window)

func _on_research_action_pressed() -> void:
	academy_box.visible = not academy_box.visible
