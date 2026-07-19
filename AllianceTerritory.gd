# ==============================================================================
# Crownspire MMO Strategy Game - Alliance Territory & Buildings Controller
# Godot 4 / GDScript 2.0 Client-side spatial claiming and project manager
# ==============================================================================

extends Control

# --- Signals ---
signal territory_updated
signal add_log_requested(text, type)

# --- Onready Nodes ---
@onready var building_list: VBoxContainer = $Layout/Split/LeftPanel/Scroll/List
@onready var detail_container: VBoxContainer = $Layout/Split/RightPanel/DetailContainer

# --- Detail Fields ---
@onready var selected_bld_name: Label = $Layout/Split/RightPanel/DetailContainer/Margin/VBox/Header/NameLabel
@onready var selected_bld_desc: Label = $Layout/Split/RightPanel/DetailContainer/Margin/VBox/Header/DescLabel
@onready var selected_bld_lvl: Label = $Layout/Split/RightPanel/DetailContainer/Margin/VBox/Header/LevelLabel
@onready var progress_bar: ProgressBar = $Layout/Split/RightPanel/DetailContainer/Margin/VBox/ConstructionBox/Bar
@onready var progress_lbl: Label = $Layout/Split/RightPanel/DetailContainer/Margin/VBox/ConstructionBox/Label
@onready var bld_buffs_lbl: Label = $Layout/Split/RightPanel/DetailContainer/Margin/VBox/BuffsBox/Label

# --- Construction Donation Buttons ---
@onready var const_wood: Button = $Layout/Split/RightPanel/DetailContainer/Margin/VBox/DonationBox/Grid/ConstWood
@onready var const_stone: Button = $Layout/Split/RightPanel/DetailContainer/Margin/VBox/DonationBox/Grid/ConstStone
@onready var const_iron: Button = $Layout/Split/RightPanel/DetailContainer/Margin/VBox/DonationBox/Grid/ConstIron
@onready var const_gems: Button = $Layout/Split/RightPanel/DetailContainer/Margin/VBox/DonationBox/Grid/ConstGems

# --- Grid Mapping Display ---
@onready var grid_container: GridContainer = $Layout/GridSection/GridContainer
@onready var coord_name_lbl: Label = $Layout/GridSection/DetailPanel/Margin/VBox/NameLabel
@onready var coord_pos_lbl: Label = $Layout/GridSection/DetailPanel/Margin/VBox/PosLabel
@onready var coord_status_lbl: Label = $Layout/GridSection/DetailPanel/Margin/VBox/StatusLabel
@onready var deploy_btn: Button = $Layout/GridSection/DetailPanel/Margin/VBox/DeployBtn

# --- Persistent Config Save Location ---
const BAG_SAVE_PATH = "user://crownspire_bag_inventory_v1.save"

# --- Internal references ---
var _alliance_scene: Control
var _state: Dictionary = {}
var _selected_bld_id: String = ""
var _building_database: Array = []
var _selected_node_index: int = -1

func _ready() -> void:
	var parent = get_parent()
	while parent and not parent.has_method("_save_alliance_state"):
		parent = parent.get_parent()
	if parent:
		_alliance_scene = parent
		
	# Connect construction helpers
	const_wood.pressed.connect(func(): _on_build_donate_pressed("wood"))
	const_stone.pressed.connect(func(): _on_build_donate_pressed("stone"))
	const_iron.pressed.connect(func(): _on_build_donate_pressed("iron"))
	const_gems.pressed.connect(func(): _on_build_donate_pressed("gems"))
	
	# Connect map actions
	deploy_btn.pressed.connect(_on_deploy_garrison_pressed)

func init_view(state: Dictionary, building_db: Array) -> void:
	_state = state
	_building_database = building_db
	_initialize_regions_if_needed()
	
	if _selected_bld_id.is_empty() and not _building_database.is_empty():
		_selected_bld_id = _building_database[0].get("id")
		
	_refresh_territory_ui()

func _initialize_regions_if_needed() -> void:
	if not _state.has("territory_regions") or _state["territory_regions"].is_empty():
		var file_path = "res://data/alliance_regions.json"
		if FileAccess.file_exists(file_path):
			var file = FileAccess.open(file_path, FileAccess.READ)
			if file:
				var content = file.get_as_text()
				file.close()
				var json = JSON.new()
				if json.parse(content) == OK:
					_state["territory_regions"] = json.get_data()
					print("[AllianceTerritory] Initialized 28 data-driven territory regions from template.")
					_save_and_sync()

func _refresh_territory_ui() -> void:
	_render_building_list()
	_render_selected_building_details()
	_render_coordinate_grid()
	_render_selected_coordinate_details()

func _render_building_list() -> void:
	_clear_container(building_list)
	
	for bld in _building_database:
		var bld_id = bld.get("id")
		var current_lvl = _get_building_level(bld_id)
		var max_lvl = bld.get("maxLevel", 5)
		
		var bld_btn = Button.new()
		bld_btn.custom_minimum_size = Vector2(0, 50)
		bld_btn.text = "  %s  (Lvl %d/%d)" % [bld.get("name"), current_lvl, max_lvl]
		bld_btn.alignment = HORIZONTAL_ALIGNMENT_LEFT
		
		# Set styling depending on selection
		var style = StyleBoxFlat.new()
		if bld_id == _selected_bld_id:
			style.bg_color = Color(0.12, 0.22, 0.35, 1)
			style.border_width_left = 3
			style.border_color = Color(0.95, 0.75, 0.15, 1)
		else:
			style.bg_color = Color(0.098, 0.117, 0.149, 1)
			style.border_width_left = 1
			style.border_color = Color(0.18, 0.22, 0.28, 1)
			
		style.corner_radius_top_left = 4
		style.corner_radius_top_right = 4
		style.corner_radius_bottom_right = 4
		style.corner_radius_bottom_left = 4
		
		bld_btn.add_theme_stylebox_override("normal", style)
		bld_btn.add_theme_stylebox_override("hover", style)
		bld_btn.add_theme_stylebox_override("pressed", style)
		bld_btn.pressed.connect(func(): _on_building_selected(bld_id))
		
		building_list.add_child(bld_btn)

func _render_selected_building_details() -> void:
	var bld = _get_building_by_id(_selected_bld_id)
	if bld.is_empty():
		detail_container.visible = false
		return
		
	detail_container.visible = true
	selected_bld_name.text = bld.get("name")
	selected_bld_desc.text = bld.get("description")
	
	var current_lvl = _get_building_level(_selected_bld_id)
	var max_lvl = bld.get("maxLevel", 5)
	
	selected_bld_lvl.text = "Structure Level: %d / %d" % [current_lvl, max_lvl]
	
	# Handle progress bar
	if current_lvl >= max_lvl:
		progress_bar.max_value = 1.0
		progress_bar.value = 1.0
		progress_lbl.text = "MAXIMUM LEVEL SECURITY REACHED"
		bld_buffs_lbl.text = "Permanent active territorial buffs:\n" + _get_building_buff_description(bld, current_lvl)
		_set_donation_buttons_disabled(true)
	else:
		var current_progress = _get_building_progress(_selected_bld_id)
		var levels_meta = bld.get("levels", [])
		var target_points = 500000
		if current_lvl < levels_meta.size():
			var lvl_info = levels_meta[current_lvl]
			var costs = lvl_info.get("costs", {})
			# Compute aggregated material target
			target_points = costs.get("allianceWood", 10000) + costs.get("allianceStone", 10000) + costs.get("allianceIron", 5000)
			
		progress_bar.max_value = float(target_points)
		progress_bar.value = float(current_progress)
		progress_lbl.text = "%s / %s Building Supplies" % [_format_num(current_progress), _format_num(target_points)]
		
		var buff_desc = "Current Active Buffs:\n"
		if current_lvl > 0:
			buff_desc += _get_building_buff_description(bld, current_lvl)
		else:
			buff_desc += "No buffs unlocked yet. Erect structure to secure bounds."
			
		buff_desc += "\n\nNext Upgrade Level Grants:\n" + _get_building_level_buffs(bld, current_lvl + 1)
		bld_buffs_lbl.text = buff_desc
		_set_donation_buttons_disabled(false)

func _get_building_buff_description(bld: Dictionary, lvl: int) -> String:
	var levels_meta = bld.get("levels", [])
	var desc = ""
	for i in range(lvl):
		if i < levels_meta.size():
			var bonuses = levels_meta[i].get("bonuses", [])
			for b in bonuses:
				desc += "- " + b.get("description", "Territory Buff active.") + "\n"
	return desc

func _get_building_level_buffs(bld: Dictionary, lvl: int) -> String:
	var levels_meta = bld.get("levels", [])
	var index = lvl - 1
	if index >= 0 and index < levels_meta.size():
		var bonuses = levels_meta[index].get("bonuses", [])
		var desc = ""
		for b in bonuses:
			desc += "🏠 " + b.get("description", "Next upgrade bonus") + "\n"
		return desc
	return "No further upgrade bonuses."

func _set_donation_buttons_disabled(disabled: bool) -> void:
	const_wood.disabled = disabled
	const_stone.disabled = disabled
	const_iron.disabled = disabled
	const_gems.disabled = disabled

# ==============================================================================
# SPATIAL RADAR GRID MAPPING
# ==============================================================================

func _render_coordinate_grid() -> void:
	_clear_container(grid_container)
	
	var regions = _state.get("territory_regions", [])
	if regions.is_empty():
		return
		
	for i in range(regions.size()):
		var reg = regions[i]
		var cell_btn = Button.new()
		cell_btn.custom_minimum_size = Vector2(65, 55)
		cell_btn.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		
		var name_parts = reg.get("name", "Region").split(" ")
		var name_short = name_parts[0] if name_parts.size() > 0 else "Sector"
		var label_text = "%s\n" % name_short
		var fog = reg.get("fog_status", "revealed")
		var ownership = reg.get("ownership", "unclaimed")
		
		if fog == "shrouded":
			label_text += "🌫️ FOG"
		elif ownership == "claimed":
			label_text += "🔒 OWNED"
		elif ownership == "disputed":
			label_text += "⚠️ DISP"
		else:
			label_text += "FREE"
			
		cell_btn.text = label_text
		
		# Stylize grid cell
		var style = StyleBoxFlat.new()
		if i == _selected_node_index:
			style.bg_color = Color(0.9, 0.7, 0.1, 0.7) # Selected highlight
			style.border_width_left = 3
			style.border_width_top = 3
			style.border_width_right = 3
			style.border_width_bottom = 3
			style.border_color = Color(0.95, 0.75, 0.15, 1)
		else:
			if fog == "shrouded":
				style.bg_color = Color(0.18, 0.20, 0.22, 0.5) # Grey Fog
			elif ownership == "claimed":
				style.bg_color = Color(0.12, 0.35, 0.18, 0.8) # Claimed Green
			elif ownership == "disputed":
				style.bg_color = Color(0.45, 0.15, 0.15, 0.8) # Disputed Red
			else:
				style.bg_color = Color(0.08, 0.11, 0.15, 1) # Dark Slate Blue
				
			style.border_width_left = 1
			style.border_width_top = 1
			style.border_width_right = 1
			style.border_width_bottom = 1
			style.border_color = Color(0.18, 0.22, 0.28, 1)
			
		style.corner_radius_top_left = 6
		style.corner_radius_top_right = 6
		style.corner_radius_bottom_right = 6
		style.corner_radius_bottom_left = 6
		
		cell_btn.add_theme_stylebox_override("normal", style)
		cell_btn.add_theme_stylebox_override("hover", style)
		cell_btn.add_theme_stylebox_override("pressed", style)
		
		var cap_idx = i
		cell_btn.pressed.connect(func(): _on_node_selected(cap_idx))
		grid_container.add_child(cell_btn)

func _render_selected_coordinate_details() -> void:
	var regions = _state.get("territory_regions", [])
	var v_box = $Layout/GridSection/DetailPanel/Margin/VBox
	
	# Hide default deploy button
	deploy_btn.visible = false
	
	# Find or create ActionBox
	var action_box = v_box.get_node_or_null("ActionBox") as VBoxContainer
	if not action_box:
		action_box = VBoxContainer.new()
		action_box.name = "ActionBox"
		action_box.add_theme_constant_override("separation", 6)
		v_box.add_child(action_box)
	else:
		_clear_container(action_box)
		
	if _selected_node_index == -1 or _selected_node_index >= regions.size():
		coord_name_lbl.text = "Coordinate Radar Panel"
		coord_pos_lbl.text = "Grid coordinate: [X, Y]"
		coord_status_lbl.text = "Garrison Status: Select a hex coordinate grid above to dispatch defensive garrison units."
		return
		
	var reg = regions[_selected_node_index]
	coord_name_lbl.text = "🗺️ " + reg.get("name", "Sovereign Sector")
	coord_pos_lbl.text = "Grid Coord: [%d, %d] | World: (%.1f, %.1f)" % [
		reg.get("grid_x", 0), reg.get("grid_y", 0), reg.get("x", 0.0), reg.get("y", 0.0)
	]
	
	var fog = reg.get("fog_status", "revealed")
	var ownership = reg.get("ownership", "unclaimed")
	var enemy = reg.get("enemy_alliance", "")
	var g_power = reg.get("garrison_power", 150000)
	var bonus = reg.get("bonus_text", "None")
	var borders = reg.get("border_radius", 0)
	var restriction = reg.get("restriction", "None")
	
	var desc = ""
	if fog == "shrouded":
		desc += "Fog of War: 🌫️ SHROUDED\n"
		desc += "Terrain is obscured by thick magical fog. Scouts must be dispatched to survey resource veins and constructible slots.\n\n"
		desc += "⚠️ Build Restrictions:\n- %s" % restriction
	else:
		desc += "Fog of War: 🟢 REVEALED\n"
		if ownership == "claimed":
			desc += "Ownership: 🔒 SECURED BY ALLIANCE\n"
		elif ownership == "disputed":
			desc += "Ownership: ⚠️ DISPUTED BY %s\n" % enemy.to_upper()
		else:
			desc += "Ownership: ⚪ UNCLAIMED WILDLANDS\n"
			
		desc += "Garrison Power: %s CR\n" % _format_num(g_power)
		desc += "Territory Border Radius: %d miles\n" % borders
		desc += "Passive Yield Buff: ✨ %s\n\n" % bonus
		
		# Structures Status
		desc += "🏰 CONSTRUCTED STRUCTURES:\n"
		var structs = reg.get("structures", {})
		
		var hq = structs.get("hq", {})
		if hq.get("built", false):
			desc += " • Alliance HQ: Lvl %d / %d\n" % [hq.get("level", 1), hq.get("max_level", 5)]
		else:
			desc += " • Alliance HQ: Not Constructed\n"
			
		var tw = structs.get("tower", {})
		desc += " • Alliance Towers: %d / %d Active\n" % [tw.get("count", 0), tw.get("max_count", 4)]
		
		var ft = structs.get("fortress", {})
		if ft.get("built", false):
			desc += " • Alliance Fortress: Lvl %d / %d\n" % [ft.get("level", 1), ft.get("max_level", 3)]
		else:
			desc += " • Alliance Fortress: Not Constructed\n"
			
		var rc = structs.get("resource_center", {})
		if rc.get("built", false):
			desc += " • Resource Center: Lvl %d / %d (%s)\n" % [rc.get("level", 1), rc.get("max_level", 3), rc.get("type", "crystallite").capitalize()]
		else:
			desc += " • Resource Center: Not Constructed\n"
			
	coord_status_lbl.text = desc
	
	# Action buttons rendering inside ActionBox
	var treasury = _state.get("alliance_treasury", 0)
	
	if fog == "shrouded":
		# Action: Scout fog
		var btn = Button.new()
		btn.text = "🌫️ Send Scout Team (Cost: 200 Treasury)"
		btn.custom_minimum_size = Vector2(0, 36)
		btn.pressed.connect(func(): _scout_fog(reg))
		if treasury < 200:
			btn.disabled = true
			btn.add_theme_color_override("font_color", Color(1.0, 0.3, 0.3, 1.0))
		action_box.add_child(btn)
	else:
		if ownership != "claimed":
			# Action: Campaign to capture
			var btn = Button.new()
			btn.text = "⚔️ Dispatch Conquest Garrison (CR %s)" % _format_num(g_power)
			btn.custom_minimum_size = Vector2(0, 36)
			btn.pressed.connect(func(): _conquest_region(reg))
			btn.add_theme_color_override("font_color", Color(0.95, 0.75, 0.15, 1))
			action_box.add_child(btn)
		else:
			# Withdraw/Relinquish action
			var btn_ret = Button.new()
			btn_ret.text = "🛡️ Relinquish Domain"
			btn_ret.custom_minimum_size = Vector2(0, 24)
			btn_ret.pressed.connect(func(): _relinquish_region(reg))
			btn_ret.add_theme_color_override("font_color", Color(1.0, 0.4, 0.4, 1.0))
			action_box.add_child(btn_ret)
			
			# Build slots container
			var grid = GridContainer.new()
			grid.columns = 2
			grid.add_theme_constant_override("h_separation", 6)
			grid.add_theme_constant_override("v_separation", 6)
			action_box.add_child(grid)
			
			var structs = reg.get("structures", {})
			var hq = structs.get("hq", {})
			var tw = structs.get("tower", {})
			var ft = structs.get("fortress", {})
			var rc = structs.get("resource_center", {})
			
			# 1. HQ button
			var btn_hq = Button.new()
			btn_hq.custom_minimum_size = Vector2(0, 30)
			btn_hq.size_flags_horizontal = Control.SIZE_EXPAND_FILL
			if not hq.get("built", false):
				btn_hq.text = "Build HQ (2k)"
				btn_hq.pressed.connect(func(): _build_structure(reg, "hq"))
				if treasury < 2000:
					btn_hq.disabled = true
			else:
				var lvl = hq.get("level", 1)
				if lvl >= hq.get("max_level", 5):
					btn_hq.text = "HQ Level Max"
					btn_hq.disabled = true
				else:
					btn_hq.text = "Upgrade HQ (Lvl %d) (1k)" % (lvl + 1)
					btn_hq.pressed.connect(func(): _upgrade_structure(reg, "hq"))
					if treasury < 1000:
						btn_hq.disabled = true
			grid.add_child(btn_hq)
			
			# Build restrictions checks
			var has_hq = hq.get("built", false)
			
			# 2. Towers button
			var btn_tw = Button.new()
			btn_tw.custom_minimum_size = Vector2(0, 30)
			btn_tw.size_flags_horizontal = Control.SIZE_EXPAND_FILL
			var tw_count = tw.get("count", 0)
			var tw_max = tw.get("max_count", 4)
			if tw_count < tw_max:
				btn_tw.text = "Erect Tower (%d/%d) (400)" % [tw_count + 1, tw_max]
				btn_tw.pressed.connect(func(): _build_structure(reg, "tower"))
				if treasury < 400 or not has_hq:
					btn_tw.disabled = true
				if not has_hq:
					btn_tw.tooltip_text = "Requires Alliance HQ"
			else:
				btn_tw.text = "Towers Maxed (%d/%d)" % [tw_count, tw_max]
				btn_tw.disabled = true
			grid.add_child(btn_tw)
			
			# 3. Fortress button
			var btn_ft = Button.new()
			btn_ft.custom_minimum_size = Vector2(0, 30)
			btn_ft.size_flags_horizontal = Control.SIZE_EXPAND_FILL
			if not ft.get("built", false):
				btn_ft.text = "Build Fortress (1.2k)"
				btn_ft.pressed.connect(func(): _build_structure(reg, "fortress"))
				if treasury < 1200 or not has_hq:
					btn_ft.disabled = true
				if not has_hq:
					btn_ft.tooltip_text = "Requires Alliance HQ"
			else:
				var lvl = ft.get("level", 1)
				if lvl >= ft.get("max_level", 3):
					btn_ft.text = "Fortress Max Lvl"
					btn_ft.disabled = true
				else:
					btn_ft.text = "Upgrade Fort (Lvl %d) (600)" % (lvl + 1)
					btn_ft.pressed.connect(func(): _upgrade_structure(reg, "fortress"))
					if treasury < 600:
						btn_ft.disabled = true
			grid.add_child(btn_ft)
			
			# 4. Resource center button
			var btn_rc = Button.new()
			btn_rc.custom_minimum_size = Vector2(0, 30)
			btn_rc.size_flags_horizontal = Control.SIZE_EXPAND_FILL
			if not rc.get("built", false):
				var type = rc.get("type", "crystallite")
				btn_rc.text = "Build RC (%s) (800)" % type.capitalize()
				btn_rc.pressed.connect(func(): _build_structure(reg, "resource_center"))
				if treasury < 800 or not has_hq:
					btn_rc.disabled = true
				if not has_hq:
					btn_rc.tooltip_text = "Requires Alliance HQ"
			else:
				var lvl = rc.get("level", 1)
				if lvl >= rc.get("max_level", 3):
					btn_rc.text = "RC Max Lvl"
					btn_rc.disabled = true
				else:
					btn_rc.text = "Upgrade RC (Lvl %d) (400)" % (lvl + 1)
					btn_rc.pressed.connect(func(): _upgrade_structure(reg, "resource_center"))
					if treasury < 400:
						btn_rc.disabled = true
			grid.add_child(btn_rc)

# ==============================================================================
# ACTIONS & DISPATCHES
# ==============================================================================

func _on_building_selected(bld_id: String) -> void:
	_selected_bld_id = bld_id
	_refresh_territory_ui()

func _on_node_selected(idx: int) -> void:
	_selected_node_index = idx
	_refresh_territory_ui()

func _scout_fog(reg: Dictionary) -> void:
	var cost = 200
	var treasury = _state.get("alliance_treasury", 0)
	if treasury < cost:
		add_log_requested.emit("Insufficient funds in Alliance Treasury to fund scouting campaign!", "warning")
		return
		
	_state["alliance_treasury"] = treasury - cost
	reg["fog_status"] = "revealed"
	reg["border_radius"] = 5 # Small exploration border footprint
	
	add_log_requested.emit("🌫️ Scouts successfully mapped '%s'! Fog of War dissipated. Construction slots discovered!" % reg.get("name"), "success")
	_save_and_sync()
	_refresh_territory_ui()

func _conquest_region(reg: Dictionary) -> void:
	var rating = reg.get("garrison_power", 150000)
	reg["ownership"] = "claimed"
	reg["enemy_alliance"] = ""
	reg["garrison_power"] = 0
	
	_recalculate_region_borders(reg)
	_recalculate_global_influence()
	
	add_log_requested.emit("⚔️ Conquest Complete! Defeated hostile garrisons in '%s'! Region claimed under guild canopy. Passive Buff activated!" % reg.get("name"), "success")
	_save_and_sync()
	_refresh_territory_ui()

func _relinquish_region(reg: Dictionary) -> void:
	reg["ownership"] = "unclaimed"
	reg["garrison_power"] = 150000 + (randi() % 100000)
	reg["border_radius"] = 0
	
	# Reset structures
	var structs = reg.get("structures", {})
	if structs.has("hq"):
		structs["hq"] = {"built": false, "level": 0, "progress": 0, "max_level": 5}
	if structs.has("tower"):
		structs["tower"] = {"count": 0, "max_count": 4, "progress": 0}
	if structs.has("fortress"):
		structs["fortress"] = {"built": false, "level": 0, "progress": 0, "max_level": 3}
	if structs.has("resource_center"):
		structs["resource_center"] = {"built": false, "type": "crystallite", "level": 0, "progress": 0, "max_level": 3}
		
	_recalculate_global_influence()
	
	add_log_requested.emit("🛡️ Relinquished claim over '%s'. Garrison withdrawn, structures dismantled." % reg.get("name"), "info")
	_save_and_sync()
	_refresh_territory_ui()

func _build_structure(reg: Dictionary, type: String) -> void:
	var cost = 0
	var name_str = ""
	match type:
		"hq":
			cost = 2000
			name_str = "Alliance HQ"
		"tower":
			cost = 400
			name_str = "Sentinel Tower"
		"fortress":
			cost = 1200
			name_str = "Alliance Fortress"
		"resource_center":
			cost = 800
			name_str = "Alliance Resource Center"
			
	var treasury = _state.get("alliance_treasury", 0)
	if treasury < cost:
		add_log_requested.emit("Insufficient Treasury to build %s!" % name_str, "warning")
		return
		
	_state["alliance_treasury"] = treasury - cost
	
	var structs = reg.get("structures", {})
	if type == "tower":
		var tw = structs.get("tower", {})
		tw["count"] = tw.get("count", 0) + 1
	else:
		var st = structs.get(type, {})
		st["built"] = true
		st["level"] = 1
		
	_recalculate_region_borders(reg)
	
	add_log_requested.emit("🧱 Erected %s inside '%s'! Sovereign territory boundary expanded!" % [name_str, reg.get("name")], "success")
	_save_and_sync()
	_refresh_territory_ui()

func _upgrade_structure(reg: Dictionary, type: String) -> void:
	var cost = 0
	var name_str = ""
	match type:
		"hq":
			cost = 1000
			name_str = "Alliance HQ"
		"fortress":
			cost = 600
			name_str = "Alliance Fortress"
		"resource_center":
			cost = 400
			name_str = "Alliance Resource Center"
			
	var treasury = _state.get("alliance_treasury", 0)
	if treasury < cost:
		add_log_requested.emit("Insufficient Treasury to upgrade %s!" % name_str, "warning")
		return
		
	_state["alliance_treasury"] = treasury - cost
	
	var structs = reg.get("structures", {})
	var st = structs.get(type, {})
	st["level"] = st.get("level", 1) + 1
	
	_recalculate_region_borders(reg)
	
	add_log_requested.emit("⭐ Upgraded %s to Level %d inside '%s'!" % [name_str, st.get("level"), reg.get("name")], "success")
	_save_and_sync()
	_refresh_territory_ui()

func _recalculate_region_borders(reg: Dictionary) -> void:
	if reg.get("ownership") != "claimed":
		reg["border_radius"] = 0
		return
		
	var base_radius = 5
	var structs = reg.get("structures", {})
	
	var hq = structs.get("hq", {})
	if hq.get("built", false):
		base_radius += 10 * hq.get("level", 1)
		
	var tw = structs.get("tower", {})
	base_radius += 3 * tw.get("count", 0)
	
	var ft = structs.get("fortress", {})
	if ft.get("built", false):
		base_radius += 8 * ft.get("level", 1)
		
	var rc = structs.get("resource_center", {})
	if rc.get("built", false):
		base_radius += 4 * rc.get("level", 1)
		
	reg["border_radius"] = base_radius

func _recalculate_global_influence() -> void:
	var regions = _state.get("territory_regions", [])
	if regions.is_empty():
		return
	var claimed_count = 0
	for r in regions:
		if r.get("ownership") == "claimed":
			claimed_count += 1
	var influence = int((float(claimed_count) / regions.size()) * 100)
	_state["territory_influence"] = influence

func _on_deploy_garrison_pressed() -> void:
	# Retained for signal connection safety
	pass

func _on_build_donate_pressed(res_type: String) -> void:
	var inventory = _load_inventory()
	
	# Determine material items and credit awards
	var cost_key = ""
	var cost_qty = 0
	var points_granted = 0
	var honor_granted = 0
	var treasury_granted = 0
	
	match res_type:
		"wood":
			cost_key = "resource_wood_100k"
			cost_qty = 1
			points_granted = 2000
			honor_granted = 100
			treasury_granted = 500
		"food":
			cost_key = "resource_food_100k"
			cost_qty = 1
			points_granted = 2000
			honor_granted = 100
			treasury_granted = 500
		"stone":
			cost_key = "resource_stone_50k"
			cost_qty = 1
			points_granted = 3000
			honor_granted = 150
			treasury_granted = 800
		"iron":
			cost_key = "resource_iron_25k"
			cost_qty = 1
			points_granted = 4000
			honor_granted = 200
			treasury_granted = 1200
			
	var current_qty = inventory.get(cost_key, 0)
	if current_qty < cost_qty:
		add_log_requested.emit("Insufficient cargo in personal vaults! Cannot donate supplies to active construct project.", "warning")
		return
		
	# Deduct from player bag inventory
	inventory[cost_key] = current_qty - cost_qty
	_save_inventory(inventory)
	
	# Credit honor and treasury points
	_state["player_honor_points"] = _state.get("player_honor_points", 0) + honor_granted
	_state["alliance_treasury"] = _state.get("alliance_treasury", 0) + treasury_granted
	
	# Compute building upgrade
	var current_progress = _get_building_progress(_selected_bld_id)
	var current_lvl = _get_building_level(_selected_bld_id)
	
	var bld_meta = _get_building_by_id(_selected_bld_id)
	var levels_meta = bld_meta.get("levels", [])
	var target_points = 500000
	if current_lvl < levels_meta.size():
		var costs = levels_meta[current_lvl].get("costs", {})
		target_points = costs.get("allianceWood", 10000) + costs.get("allianceStone", 10000) + costs.get("allianceIron", 5000)
		
	var new_pts = current_progress + points_granted
	
	if new_pts >= target_points:
		# Level Up Building!
		var bld_levels = _get_building_levels_dict()
		var new_lvl = clamp(current_lvl + 1, 0, bld_meta.get("maxLevel", 5))
		bld_levels[_selected_bld_id] = new_lvl
		
		# Apply level-up updates to garrison capacity, etc.
		if _selected_bld_id == "alliance_fortress":
			# Fortress increases max members limit
			var member_cap = 50
			if new_lvl == 2: member_cap = 60
			elif new_lvl == 3: member_cap = 70
			elif new_lvl == 4: member_cap = 80
			elif new_lvl == 5: member_cap = 100
			_state["max_members"] = member_cap
			
		var bld_progress_dict = _get_building_progress_dict()
		bld_progress_dict[_selected_bld_id] = 0
		
		add_log_requested.emit("⭐ ROYAL EVENT! Alliance Monument [%s] leveled up to Tier %d! Massive bonuses unlocked!" % [bld_meta.get("name"), new_lvl], "success")
	else:
		var bld_progress_dict = _get_building_progress_dict()
		bld_progress_dict[_selected_bld_id] = new_pts
		add_log_requested.emit("Building supplies donated! Contributed +%d materials to %s project." % [points_granted, bld_meta.get("name")], "success")
		
	_save_and_sync()
	_refresh_territory_ui()

# ==============================================================================
# DATABASE RETRIEVALS & STORAGE HELPERS
# ==============================================================================

func _get_building_by_id(bld_id: String) -> Dictionary:
	for b in _building_database:
		if b.get("id") == bld_id:
			return b
	return {}

func _get_building_levels_dict() -> Dictionary:
	if not _state.has("building_levels"):
		_state["building_levels"] = {}
	return _state["building_levels"]

func _get_building_progress_dict() -> Dictionary:
	if not _state.has("building_progress"):
		_state["building_progress"] = {}
	return _state["building_progress"]

func _get_building_level(bld_id: String) -> int:
	var lvls = _get_building_levels_dict()
	return lvls.get(bld_id, 1)

func _get_building_progress(bld_id: String) -> int:
	var progress = _get_building_progress_dict()
	return progress.get(bld_id, 0)

func _load_inventory() -> Dictionary:
	if not FileAccess.file_exists(BAG_SAVE_PATH):
		return {}
	var file = FileAccess.open(BAG_SAVE_PATH, FileAccess.READ)
	if not file:
		return {}
	var content = file.get_as_text()
	file.close()
	var json = JSON.new()
	if json.parse(content) == OK:
		var data = json.get_data()
		if typeof(data) == TYPE_DICTIONARY:
			return data
	return {}

func _save_inventory(inv: Dictionary) -> void:
	var file = FileAccess.open(BAG_SAVE_PATH, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(inv))
		file.close()

func _clear_container(container: Node) -> void:
	for child in container.get_children():
		child.queue_free()

func _save_and_sync() -> void:
	if _alliance_scene and _alliance_scene.has_method("_save_alliance_state"):
		_alliance_scene._save_alliance_state()
	territory_updated.emit()

func _format_num(num: int) -> String:
	if num >= 1000000:
		return "%.1fM" % (num / 1000000.0)
	elif num >= 1000:
		return "%.1fk" % (num / 1000.0)
	return str(num)
