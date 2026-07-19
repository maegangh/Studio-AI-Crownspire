extends Control

# ========================================================
# CROWNSPIRE INTERACTIVE WORLD MAP CONTROLLER
# ========================================================
# Coordinates interactive nodes, coordinate system, real-time
# outward and returning march vectors, visual line paths,
# dynamic scanning/search, and seamless HUD sync.

@onready var search_input: LineEdit = %SearchInput
@onready var node_filter: OptionButton = %NodeFilter
@onready var map_scroll: ScrollContainer = %MapScroll
@onready var map_content: Control = %MapContent
@onready var march_line_draw: Control = %MarchLineDraw
@onready var custom_nodes_container: Control = %CustomNodesContainer

# Drawer selections
@onready var selection_hint: Label = %SelectionHint
@onready var drawer_details: VBoxContainer = %DrawerDetails
@onready var node_title: Label = %NodeTitle
@onready var node_coords: Label = %NodeCoords
@onready var node_desc: Label = %NodeDesc
@onready var node_yield: Label = %NodeYield
@onready var dispatch_btn: Button = %DispatchButton
@onready var scan_success_lbl: Label = %ScanSuccessLabel

# Active queue panel
@onready var active_marches_vbox: VBoxContainer = %ActiveMarchesVBox

# Node coordinates and details database
var map_nodes: Array = []
var selected_node: Dictionary = {}
var citadel_position := Vector2(400, 400) # Grid space coordinates

func _ready() -> void:
	# Populate filter
	node_filter.clear()
	node_filter.add_item("All Wilderness Nodes", 0)
	node_filter.add_item("👹 Wildlings / Enemies", 1)
	node_filter.add_item("💎 Resources / Mines", 2)
	node_filter.add_item("🛡️ Alliance Landmarks", 3)
	node_filter.add_item("🏛️ Kingdom Objectives", 4)
	node_filter.item_selected.connect(_on_filter_changed)
	
	# Connect search button
	%SearchBtn.pressed.connect(_on_search_triggered)
	%ScanHorizonBtn.pressed.connect(_on_scan_horizon_triggered)
	dispatch_btn.pressed.connect(_on_dispatch_triggered)
	
	# Generate base map nodes
	_generate_base_world()
	
	# Connect to UIManager march updates to redraw vectors
	UIManager.marches_updated.connect(_on_marches_updated)
	march_line_draw.draw.connect(_on_march_line_draw)
	_rebuild_active_queues_list()
	
	# Center map scroll onto the player Citadel initially
	_scroll_to_position(citadel_position)

func _process(delta: float) -> void:
	# Force redraw travel vectors and update traveling squad markers
	march_line_draw.queue_redraw()

func _generate_base_world() -> void:
	map_nodes = [
		{
			"id": "node_wild_01",
			"name": "👹 Wind-Runner Scouting Party",
			"type": "wildling",
			"level": 12,
			"grid_pos": Vector2(250, 220),
			"description": "Roaming scouts seeking vulnerable caravans. Low danger rating.",
			"rewards": [
				{"name": "Wildling Loot Satchel", "quantity": 1, "rarity": 2, "icon": "res://assets/ui/icons/hero_shard_gold.png"},
				{"name": "Gold Coins", "quantity": 3000, "rarity": 1, "icon": "res://assets/ui/icons/hud_gold.png"}
			]
		},
		{
			"id": "node_wild_02",
			"name": "👹 Ice-Giant Warlord Outpost",
			"type": "wildling",
			"level": 24,
			"grid_pos": Vector2(150, 580),
			"description": "Heavy infantry bunker blocking access to the outer valleys. Severe danger rating.",
			"rewards": [
				{"name": "Glacial Steel Plate", "quantity": 1, "rarity": 3, "icon": "res://assets/ui/icons/hero_skill_book.png"},
				{"name": "Royal Crystals", "quantity": 250, "rarity": 3, "icon": "res://assets/ui/icons/hud_royal_crystal.png"}
			]
		},
		{
			"id": "node_res_01",
			"name": "🌲 Elderwood Oak Canopy",
			"type": "resource",
			"level": 15,
			"grid_pos": Vector2(620, 180),
			"description": "Densely packed ancient lumber forest. Ideal for construction material expansion.",
			"rewards": [
				{"name": "Timber Logs", "quantity": 18000, "rarity": 1, "icon": "res://assets/ui/icons/res_wood.png"}
			]
		},
		{
			"id": "node_res_02",
			"name": "🪙 Auric Geode Outcrop",
			"type": "resource",
			"level": 18,
			"grid_pos": Vector2(680, 520),
			"description": "Rich golden deposits exposed by temporal lightning storms.",
			"rewards": [
				{"name": "Raw Gold Ore", "quantity": 15000, "rarity": 2, "icon": "res://assets/ui/icons/hud_gold.png"}
			]
		},
		{
			"id": "node_all_01",
			"name": "🛡️ Alliance Sovereignty Fortress",
			"type": "alliance",
			"level": 20,
			"grid_pos": Vector2(480, 680),
			"description": "Defensive bastion fort built by allied guilds to project boundary shields.",
			"rewards": [
				{"name": "Alliance Honor Crest", "quantity": 500, "rarity": 2, "icon": "res://assets/ui/icons/spd_univ.png"}
			]
		},
		{
			"id": "node_obj_01",
			"name": "🏛️ Chronos Temporal Obelisk",
			"type": "objective",
			"level": 30,
			"grid_pos": Vector2(210, 820),
			"description": "Sovereign obelisk controlling speedups and construction timers in this sector.",
			"rewards": [
				{"name": "Temporal Chrono Marks", "quantity": 10, "rarity": 3, "icon": "res://assets/ui/icons/spd_univ.png"},
				{"name": "Aurora Crystals", "quantity": 400, "rarity": 3, "icon": "res://assets/ui/icons/hud_aurora_crystal.png"}
			]
		},
		{
			"id": "node_res_03",
			"name": "🪨 Granite Quarry Hub",
			"type": "resource",
			"level": 16,
			"grid_pos": Vector2(740, 780),
			"description": "Vast deposit of stone blocks vital for upgrading advanced keep fortresses.",
			"rewards": [
				{"name": "Granite Stone Blocks", "quantity": 14000, "rarity": 2, "icon": "res://assets/ui/icons/res_stone.png"}
			]
		},
		{
			"id": "node_wild_03",
			"name": "👹 Savage Drake Roost",
			"type": "wildling",
			"level": 35,
			"grid_pos": Vector2(320, 920),
			"description": "Draconic apex predators guarding a chest of ancient alchemical scrolls.",
			"rewards": [
				{"name": "Drake Dragon Scale", "quantity": 2, "rarity": 3, "icon": "res://assets/ui/icons/hero_skill_book.png"},
				{"name": "Food Provisions", "quantity": 25000, "rarity": 2, "icon": "res://assets/ui/icons/res_food.png"}
			]
		}
	]
	
	_rebuild_node_buttons()

func _rebuild_node_buttons() -> void:
	# Clear previous children from the container
	for child in custom_nodes_container.get_children():
		child.queue_free()
		
	# Draw Citadel center point
	_create_map_node_button({
		"id": "player_citadel",
		"name": "🏰 YOUR CITADEL: CROWNSPIRE",
		"type": "citadel",
		"level": 16,
		"grid_pos": citadel_position,
		"description": "The golden heart of your sovereignty. Securely shielded."
	})
	
	# Draw each interactive node
	for n in map_nodes:
		_create_map_node_button(n)

func _create_map_node_button(n: Dictionary) -> void:
	var btn = Button.new()
	btn.flat = true
	btn.custom_minimum_size = Vector2(80, 80)
	btn.position = n["grid_pos"] - Vector2(40, 40) # Center the button on its coordinate
	
	# Style the node dynamically
	var panel = PanelContainer.new()
	panel.mouse_filter = Control.MOUSE_FILTER_IGNORE
	panel.set_anchors_preset(Control.PRESET_FULL_RECT)
	
	var sb = StyleBoxFlat.new()
	sb.corner_radius_top_left = 40
	sb.corner_radius_top_right = 40
	sb.corner_radius_bottom_right = 40
	sb.corner_radius_bottom_left = 40
	sb.border_width_left = 2
	sb.border_width_top = 2
	sb.border_width_right = 2
	sb.border_width_bottom = 2
	sb.shadow_size = 4
	sb.shadow_color = Color(0,0,0,0.3)
	
	var icon_label = Label.new()
	icon_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	icon_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	icon_label.add_theme_font_size_override("font_size", 20)
	
	# Determine icon & colors based on type
	match n["type"]:
		"citadel":
			sb.bg_color = Color(0.85, 0.65, 0.12, 0.9) # Rich Gold
			sb.border_color = Color(1.0, 1.0, 0.8, 1.0)
			icon_label.text = "🏰"
		"wildling":
			sb.bg_color = Color(0.45, 0.12, 0.12, 0.95) # Dark Blood Red
			sb.border_color = Color(0.8, 0.2, 0.2, 1.0)
			icon_label.text = "👹"
		"resource":
			sb.bg_color = Color(0.12, 0.45, 0.22, 0.95) # Forest Emerald
			sb.border_color = Color(0.2, 0.8, 0.4, 1.0)
			icon_label.text = "💎"
		"alliance":
			sb.bg_color = Color(0.12, 0.25, 0.48, 0.95) # Deep Saphire Blue
			sb.border_color = Color(0.3, 0.6, 1.0, 1.0)
			icon_label.text = "🛡️"
		"objective":
			sb.bg_color = Color(0.32, 0.12, 0.48, 0.95) # Royal Amethyst Purple
			sb.border_color = Color(0.7, 0.3, 1.0, 1.0)
			icon_label.text = "🏛️"
			
	panel.add_theme_stylebox_override("panel", sb)
	panel.add_child(icon_label)
	btn.add_child(panel)
	
	# Display coordinates label below
	var coord_label = Label.new()
	coord_label.text = "%s\n(%d, %d)" % [n["name"].split(" ")[-1], n["grid_pos"].x, n["grid_pos"].y]
	coord_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	coord_label.add_theme_font_size_override("font_size", 9)
	coord_label.add_theme_color_override("font_color", Color(0.9, 0.95, 1.0, 0.9))
	coord_label.position = Vector2(-20, 82)
	coord_label.custom_minimum_size = Vector2(120, 40)
	btn.add_child(coord_label)
	
	# Button connection
	btn.pressed.connect(func(): _on_node_selected(n))
	custom_nodes_container.add_child(btn)

func _on_node_selected(n: Dictionary) -> void:
	selected_node = n
	
	# Update Drawer info
	selection_hint.visible = false
	drawer_details.visible = true
	
	node_title.text = "%s (Lvl %d)" % [n["name"], n["level"]]
	node_coords.text = "COORDINATE AXIS: X = %d | Y = %d" % [n["grid_pos"].x, n["grid_pos"].y]
	node_desc.text = n["description"]
	
	# Determine yield information
	if n.has("rewards"):
		var text = "EXPECTED MARAUDER LOOT:\n" if n["type"] == "wildling" else "ESTIMATED NODE YIELDS:\n"
		for r in n["rewards"]:
			text += "  • %s x %d\n" % [r["name"], r["quantity"]]
		node_yield.text = text
		node_yield.visible = true
	else:
		node_yield.visible = false
		
	# Disable dispatch on the players own Citadel
	if n["type"] == "citadel":
		dispatch_btn.disabled = true
		dispatch_btn.text = "OWN SOVEREIGN CITADEL"
	else:
		dispatch_btn.disabled = false
		
		# Change action verb
		if n["type"] == "wildling":
			dispatch_btn.text = "DISPATCH MILITARY RAID (ATTACK)"
		elif n["type"] == "resource":
			dispatch_btn.text = "DISPATCH CARAVAN (GATHER)"
		else:
			dispatch_btn.text = "DISPATCH MARCH GARRISON"

func _on_dispatch_triggered() -> void:
	if selected_node.is_empty() or selected_node["type"] == "citadel":
		return
		
	var type = "attack"
	if selected_node["type"] == "resource":
		type = "gather"
	elif selected_node["type"] == "alliance":
		type = "alliance"
	elif selected_node["type"] == "objective":
		type = "objective"
		
	# Determine march duration (5 to 12 seconds based on actual grid distance)
	var dist = citadel_position.distance_to(selected_node["grid_pos"])
	var duration = clamp(dist * 0.02, 4.0, 12.0)
	
	# Trigger via global UIManager
	var res = UIManager.start_march(
		type,
		selected_node["id"],
		selected_node["name"],
		int(selected_node["grid_pos"].x),
		int(selected_node["grid_pos"].y),
		duration,
		selected_node.get("rewards", [])
	)
	
	# Show result status message
	scan_success_lbl.text = "⚔️ " + res["message"].to_upper()
	scan_success_lbl.modulate = Color(1.0, 0.85, 0.2, 1.0)
	
	# Hide status after delay
	var t = create_tween()
	t.tween_property(scan_success_lbl, "modulate:a", 1.0, 2.0)
	t.tween_property(scan_success_lbl, "modulate:a", 0.0, 0.5)
	
	# Automatically collapse selection drawer slightly to show active vectors
	selection_hint.visible = true
	drawer_details.visible = false
	
	_rebuild_active_queues_list()

func _on_marches_updated() -> void:
	_rebuild_active_queues_list()

func _rebuild_active_queues_list() -> void:
	# Clear active queues list
	for child in active_marches_vbox.get_children():
		child.queue_free()
		
	var marches = UIManager.get_active_marches()
	if marches.is_empty():
		var lbl = Label.new()
		lbl.text = "NO MILITARY MARCH EXPEDITIONS CURRENTLY ACTIVE"
		lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		lbl.add_theme_font_size_override("font_size", 10)
		lbl.add_theme_color_override("font_color", Color(1,1,1,0.3))
		active_marches_vbox.add_child(lbl)
		return
		
	for m in marches:
		var panel = PanelContainer.new()
		var sb = StyleBoxFlat.new()
		sb.bg_color = Color(0.08, 0.12, 0.1, 0.9) if m["type"] == "gather" else Color(0.15, 0.08, 0.08, 0.9)
		sb.border_width_left = 3
		sb.border_color = Color(0.2, 0.8, 0.4, 0.8) if m["state"] == "returning" else Color(1.0, 0.84, 0.2, 0.8)
		sb.corner_radius_top_right = 6
		sb.corner_radius_bottom_right = 6
		panel.add_theme_stylebox_override("panel", sb)
		
		var margin = MarginContainer.new()
		margin.add_theme_constant_override("margin_left", 8)
		margin.add_theme_constant_override("margin_top", 6)
		margin.add_theme_constant_override("margin_right", 8)
		margin.add_theme_constant_override("margin_bottom", 6)
		panel.add_child(margin)
		
		var vbox = VBoxContainer.new()
		vbox.add_theme_constant_override("separation", 2)
		margin.add_child(vbox)
		
		# Name and state
		var name_lbl = Label.new()
		var state_icon = "⬅️" if m["state"] == "returning" else "➡️"
		name_lbl.text = "%s %s (%d, %d)" % [state_icon, m["target_name"], m["target_x"], m["target_y"]]
		name_lbl.add_theme_font_size_override("font_size", 11)
		name_lbl.add_theme_color_override("font_color", Color(1,1,1,0.9))
		vbox.add_child(name_lbl)
		
		# Timer and Progress Bar
		var progress_hbox = HBoxContainer.new()
		vbox.add_child(progress_hbox)
		
		var progress_bar = ProgressBar.new()
		progress_bar.size_flags_horizontal = SIZE_EXPAND_FILL
		progress_bar.max_value = m["total_time"]
		progress_bar.value = m["elapsed_time"]
		progress_bar.show_percentage = false
		progress_bar.custom_minimum_size = Vector2(0, 6)
		progress_bar.size_flags_vertical = SIZE_SHRINK_CENTER
		progress_hbox.add_child(progress_bar)
		
		var timer_lbl = Label.new()
		var time_left = max(0.0, m["total_time"] - m["elapsed_time"])
		timer_lbl.text = "%.1fs" % time_left
		timer_lbl.add_theme_font_size_override("font_size", 10)
		timer_lbl.add_theme_color_override("font_color", Color(1.0, 0.85, 0.2, 1.0) if m["state"] == "marching" else Color(0.7, 0.8, 1.0, 0.8))
		progress_hbox.add_child(timer_lbl)
		
		active_marches_vbox.add_child(panel)

func _on_filter_changed(index: int) -> void:
	# Filter nodes
	var filter_type := ""
	match index:
		1: filter_type = "wildling"
		2: filter_type = "resource"
		3: filter_type = "alliance"
		4: filter_type = "objective"
		
	for child in custom_nodes_container.get_children():
		child.queue_free()
		
	# Citadel always displays
	_create_map_node_button({
		"id": "player_citadel",
		"name": "🏰 YOUR CITADEL: CROWNSPIRE",
		"type": "citadel",
		"level": 16,
		"grid_pos": citadel_position,
		"description": "The golden heart of your sovereignty."
	})
	
	for n in map_nodes:
		if filter_type == "" or n["type"] == filter_type:
			_create_map_node_button(n)

func _on_search_triggered() -> void:
	var query = search_input.text.strip_edges()
	if query == "":
		return
		
	# Try coordinates search (e.g., "250, 220")
	if "," in query:
		var parts = query.split(",")
		if parts.size() == 2:
			var search_x = parts[0].to_int()
			var search_y = parts[1].to_int()
			var target_pos := Vector2(search_x, search_y)
			
			# Find closest node or scroll to coordinate
			var closest_node: Dictionary = {}
			var min_dist := 99999.0
			for n in map_nodes:
				var dist = n["grid_pos"].distance_to(target_pos)
				if dist < min_dist:
					min_dist = dist
					closest_node = n
					
			if min_dist < 60.0 and not closest_node.is_empty():
				_on_node_selected(closest_node)
				_scroll_to_position(closest_node["grid_pos"])
				return
			else:
				# Just center the camera on coordinate
				_scroll_to_position(target_pos)
				scan_success_lbl.text = "🎯 SNAPPED TO AXIS COORDINATES (%d, %d)" % [search_x, search_y]
				scan_success_lbl.modulate = Color(0.2, 0.8, 0.5, 1.0)
				return
				
	# Search by keyword
	for n in map_nodes:
		if query.to_lower() in n["name"].to_lower() or query.to_lower() in n["type"].to_lower():
			_on_node_selected(n)
			_scroll_to_position(n["grid_pos"])
			scan_success_lbl.text = "🔍 LOCATED TARGET SECURED ON THE GRID"
			scan_success_lbl.modulate = Color(0.2, 0.8, 0.5, 1.0)
			return
			
	scan_success_lbl.text = "⚠️ NO COORDINATE OR NODE IDENTIFIED FOR MATCH"
	scan_success_lbl.modulate = Color(1.0, 0.3, 0.3, 1.0)

func _on_scan_horizon_triggered() -> void:
	# Spawn a random scouting target somewhere on the coordinates grid
	var spawned_types = ["wildling", "resource"]
	var type = spawned_types[randi() % spawned_types.size()]
	
	var rand_x = randi_range(100, 900)
	var rand_y = randi_range(100, 900)
	
	var new_node := {}
	if type == "wildling":
		var level = randi_range(10, 30)
		new_node = {
			"id": "spawned_wild_" + str(Time.get_ticks_msec()),
			"name": "👹 Wildling Scout (Level %d)" % level,
			"type": "wildling",
			"level": level,
			"grid_pos": Vector2(rand_x, rand_y),
			"description": "Horizon scanning located active Wildling camp. Deserters from northern tundra.",
			"rewards": [
				{"name": "Wildling Loot Satchel", "quantity": 1, "rarity": 2, "icon": "res://assets/ui/icons/hero_shard_gold.png"},
				{"name": "Food Provisions", "quantity": 8000, "rarity": 1, "icon": "res://assets/ui/icons/res_food.png"}
			]
		}
	else:
		var level = randi_range(10, 25)
		new_node = {
			"id": "spawned_res_" + str(Time.get_ticks_msec()),
			"name": "💎 Golden Outcrop (Level %d)" % level,
			"type": "resource",
			"level": level,
			"grid_pos": Vector2(rand_x, rand_y),
			"description": "Scouts report massive rich deposits of mineral resources ready for harvesting.",
			"rewards": [
				{"name": "Raw Gold Ore", "quantity": 12000, "rarity": 2, "icon": "res://assets/ui/icons/hud_gold.png"}
			]
		}
		
	map_nodes.append(new_node)
	_rebuild_node_buttons()
	
	# Scroll and select
	_on_node_selected(new_node)
	_scroll_to_position(new_node["grid_pos"])
	
	scan_success_lbl.text = "🛸 HORIZON SCAN DISCOVERED UNCHARTED COORDINATES!"
	scan_success_lbl.modulate = Color(0.2, 0.8, 0.5, 1.0)

func _scroll_to_position(grid_pos: Vector2) -> void:
	# Calculate centered scroll position
	var view_size = map_scroll.size
	var target_scroll_x = clamp(grid_pos.x - (view_size.x / 2), 0.0, map_content.custom_minimum_size.x - view_size.x)
	var target_scroll_y = clamp(grid_pos.y - (view_size.y / 2), 0.0, map_content.custom_minimum_size.y - view_size.y)
	
	var tween = create_tween()
	tween.tween_property(map_scroll, "scroll_horizontal", int(target_scroll_x), 0.5).set_trans(Tween.TRANS_QUAD)
	tween.parallel().tween_property(map_scroll, "scroll_vertical", int(target_scroll_y), 0.5).set_trans(Tween.TRANS_QUAD)

# Dedicated travel line and marching indicator drawer
func draw_march_vectors() -> void:
	var marches = UIManager.get_active_marches()
	for m in marches:
		# Draw vector path
		var origin = citadel_position
		
		# Find the target grid position
		var target_pos := Vector2(m["target_x"], m["target_y"])
		
		# Outward path color (gold) vs Returning path color (grey/silver)
		var line_color = Color(1.0, 0.84, 0.0, 0.7) if m["state"] == "marching" else Color(0.6, 0.7, 0.8, 0.45)
		
		# Draw the primary trajectory line
		march_line_draw.draw_line(origin, target_pos, line_color, 2.5)
		
		# Calculate travel position interpolation
		var t = float(m["elapsed_time"]) / float(m["total_time"])
		t = clamp(t, 0.0, 1.0)
		
		var travel_pos : Vector2
		if m["state"] == "marching":
			travel_pos = origin.lerp(target_pos, t)
		else:
			travel_pos = target_pos.lerp(origin, t)
			
		# Draw active squad indicator emoji
		var emoji = "🐎" if m["type"] == "attack" else "🐫"
		if m["state"] == "returning":
			emoji = "🛡️"
			
		march_line_draw.draw_circle(travel_pos, 16.0, Color(0, 0, 0, 0.6))
		march_line_draw.draw_circle(travel_pos, 14.0, line_color)
		
		# Draw a small indicator circle representing the moving squad
		var char_size := 16
		var offset := Vector2(-8, 6)
		# Draw travel marker on screen
		# We can't easily draw custom text inside _draw of Control without font.
		# Instead, we'll draw a nice high-contrast dot with a crosshair, which looks extremely professional and militaristic!
		march_line_draw.draw_circle(travel_pos, 6.0, Color(1, 1, 1, 1))
		march_line_draw.draw_circle(travel_pos, 4.0, Color(0, 0, 0, 1) if m["state"] == "marching" else Color(0.2, 0.5, 0.3, 1))

func _on_march_line_draw() -> void:
	draw_march_vectors()

