extends Control

# ==========================================
# CROWNSPIRE INTERACTIVE CITY GAMEPLAY SCENE (VISUAL 2D CITY MAP)
# ==========================================
# Provides full-fidelity visual 2D kingdom map navigation including:
# - Smooth drag-panning & center-on-Castle camera constraints
# - High-fidelity multi-touch pinch zoom & mouse wheel zoom
# - Interactive building cards positioned dynamically on 2D plots
# - Elegant floating labels ("Academy Lv.15") styled in dark royal blue + thin gold trim
# - Floating Action Buttons (FABs) container showing custom commands (Info, Upgrade, Research, etc.)
# - Complete reuse of global UIManager APIs and shared popup systems
# - Safe click and pan event isolation to prevent blocking interface events

# Viewport & Camera Map References
@onready var map_viewport: Control = %MapViewport
@onready var city_map: Control = %CityMap
@onready var map_background: ColorRect = %MapBackground
@onready var buildings_container: Control = %BuildingsContainer

# Detail Drawer elements
@onready var detail_drawer: PanelContainer = %DetailDrawer
@onready var empty_hint: Label = %EmptySelectionHint
@onready var drawer_content: VBoxContainer = %DrawerContent

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

# Visual Positions & Configuration
const BUILDING_POSITIONS = {
	"castle": Vector2(800, 600),
	"academy": Vector2(480, 420),
	"barracks": Vector2(1120, 420),
	"warehouse": Vector2(500, 780),
	"farm": Vector2(380, 220),
	"lumber_mill": Vector2(1220, 220),
	"quarry": Vector2(1100, 780),
	"iron_mine": Vector2(800, 880)
}

const BUILDING_ACTIONS = {
	"castle": ["Info", "Upgrade"],
	"academy": ["Info", "Upgrade", "Research"],
	"barracks": ["Info", "Upgrade", "Train"],
	"warehouse": ["Info", "Upgrade"],
	"farm": ["Info", "Upgrade", "Collect"],
	"lumber_mill": ["Info", "Upgrade", "Collect"],
	"quarry": ["Info", "Upgrade", "Collect"],
	"iron_mine": ["Info", "Upgrade", "Collect"]
}

# Navigation & Gesture Camera state
var selected_building_id: String = ""
var current_troop_id: String = ""

var _is_dragging: bool = false
var _drag_start_pos: Vector2 = Vector2.ZERO
var _map_start_pos: Vector2 = Vector2.ZERO
var _zoom_level: float = 1.0
var _min_zoom: float = 0.5
var _max_zoom: float = 1.5

var _touch_positions = {}
var _building_nodes = {}
var _building_labels = {}
var _active_floating_buttons: Control = null

func _ready() -> void:
	# Hide drawer items initially
	detail_drawer.visible = false
	empty_hint.visible = true
	drawer_content.visible = false
	
	# Connect global signals
	if UIManager.has_signal("currency_changed"):
		UIManager.currency_changed.connect(_on_resources_changed)
	if UIManager.has_signal("building_updated"):
		UIManager.building_updated.connect(_on_building_updated)
	if UIManager.has_signal("building_collected"):
		UIManager.building_collected.connect(_on_building_collected)
	if UIManager.has_signal("technology_researched"):
		UIManager.technology_researched.connect(_on_technology_researched)
	
	# Initialize our beautiful interactive 2D City Map!
	rebuild_city_map()
	
	# Connect static button callbacks
	b_upgrade_btn.pressed.connect(_on_upgrade_pressed)
	b_train_btn.pressed.connect(_on_train_pressed)
	train_slider.value_changed.connect(_on_train_slider_changed)
	troop_opt.item_selected.connect(_on_troop_type_selected)
	
	# Connect input handlers for background panning/zooming
	if map_background:
		setup_map_background_inputs(map_background)
		
	# Center the camera on the Citadel Keep initially
	call_deferred("center_on_castle")
	
	# Setup periodic resource generation updates (polling UI indicators)
	var timer = Timer.new()
	timer.wait_time = 0.5
	timer.autostart = true
	timer.timeout.connect(update_resource_accumulations)
	add_child(timer)

# --- MAP GEOMETRY & VIEWPORT NAVIGATION ---
func center_on_castle() -> void:
	var viewport_size = map_viewport.size
	if viewport_size == Vector2.ZERO:
		viewport_size = Vector2(720, 800) # safe mobile fallback
		
	# Center the view on the Castle's relative coordinates
	city_map.position = (viewport_size / 2.0) - (BUILDING_POSITIONS["castle"] * _zoom_level)
	_clamp_map_position()

func _clamp_map_position() -> void:
	var viewport_size = map_viewport.size
	if viewport_size == Vector2.ZERO:
		viewport_size = Vector2(720, 800)
		
	var map_size = city_map.size * _zoom_level
	
	# Allow dragging up to half the viewport height/width past the edges for comfortable panning
	var margin_x = viewport_size.x / 2.0
	var margin_y = viewport_size.y / 2.0
	
	var min_x = -map_size.x + margin_x
	var max_x = margin_x
	var min_y = -map_size.y + margin_y
	var max_y = margin_y
	
	city_map.position.x = clampf(city_map.position.x, min_x, max_x)
	city_map.position.y = clampf(city_map.position.y, min_y, max_y)

func _adjust_zoom(diff: float, focus_point: Vector2) -> void:
	var old_zoom = _zoom_level
	var new_zoom = clampf(_zoom_level + diff, _min_zoom, _max_zoom)
	if is_equal_approx(old_zoom, new_zoom):
		return
		
	# Zoom centered on the player's cursor / finger focus point
	var local_focus = city_map.to_local(focus_point)
	_zoom_level = new_zoom
	city_map.scale = Vector2(_zoom_level, _zoom_level)
	
	# Offset city_map position to prevent panning drift during scaling
	city_map.position -= local_focus * (new_zoom - old_zoom)
	_clamp_map_position()
	
	# Hide labels when zoomed far out to keep the view clean and readable
	var show_labels = _zoom_level >= 0.65
	for label in _building_labels.values():
		if is_instance_valid(label):
			label.visible = show_labels

# --- INTERACTION CONTROLLERS & EVENT CAPTURING ---
func setup_map_background_inputs(bg: ColorRect) -> void:
	bg.gui_input.connect(func(event: InputEvent):
		if event is InputEventMouseButton:
			if event.button_index == MOUSE_BUTTON_LEFT:
				if event.pressed:
					_is_dragging = true
					_drag_start_pos = event.global_position
					_map_start_pos = city_map.position
					accept_event()
				else:
					var drag_dist = event.global_position.distance_to(_drag_start_pos)
					_is_dragging = false
					if drag_dist < 5.0:
						# Empty terrain tapped - deselect and hide controls
						deselect_all()
					accept_event()
			elif event.button_index == MOUSE_BUTTON_WHEEL_UP:
				_adjust_zoom(0.05, event.position)
				accept_event()
			elif event.button_index == MOUSE_BUTTON_WHEEL_DOWN:
				_adjust_zoom(-0.05, event.position)
				accept_event()
				
		elif event is InputEventMouseMotion and _is_dragging:
			var diff = event.global_position - _drag_start_pos
			city_map.position = _map_start_pos + diff
			_clamp_map_position()
			accept_event()
	)

func _unhandled_input(event: InputEvent) -> void:
	# Handle mobile multi-touch pinch to zoom gesture
	if event is InputEventScreenTouch:
		if event.pressed:
			_touch_positions[event.index] = event.position
		else:
			_touch_positions.erase(event.index)
			if _touch_positions.is_empty():
				_is_dragging = false
				
	elif event is InputEventScreenDrag:
		_touch_positions[event.index] = event.position
		if _touch_positions.size() == 2:
			# Pinch gesture detected!
			var keys = _touch_positions.keys()
			var p1 = _touch_positions[keys[0]]
			var p2 = _touch_positions[keys[1]]
			
			var prev_p1 = p1 - event.relative if event.index == keys[0] else p1
			var prev_p2 = p2 - event.relative if event.index == keys[1] else p2
			
			var dist = p1.distance_to(p2)
			var prev_dist = prev_p1.distance_to(prev_p2)
			
			if prev_dist > 0:
				var factor = dist / prev_dist
				var center = (p1 + p2) / 2.0
				_adjust_zoom((factor - 1.0) * 0.5, center)

# --- CITY VISUALS REBUILD ---
func rebuild_city_map() -> void:
	# Clear previous map elements
	for child in buildings_container.get_children():
		child.queue_free()
		
	_building_nodes.clear()
	_building_labels.clear()
	_active_floating_buttons = null
	
	_draw_roads_and_plots()
	
	# Build buildings on the map
	var buildings_list = UIManager.get_all_buildings()
	for b in buildings_list:
		var b_id = b["id"]
		var base_pos = BUILDING_POSITIONS.get(b_id, Vector2(800, 600))
		
		# 1. Instantiate the Building Card
		var card = create_visual_building_card(b)
		card.position = base_pos - Vector2(125, 50) # Centered on coordinate
		buildings_container.add_child(card)
		_building_nodes[b_id] = card
		
		# 2. Instantiate the Building Floating Label
		var label = create_visual_building_label(b)
		label.position = base_pos + Vector2(-60, -85) # Centered above card
		buildings_container.add_child(label)
		_building_labels[b_id] = label
		
		# Auto-realign label once it performs internal container layouts
		label.ready.connect(func():
			if is_instance_valid(label):
				label.position = base_pos + Vector2(-label.size.x / 2.0, -85)
		)
		
	# If there was a selected building, restore its floating buttons
	if selected_building_id != "":
		show_floating_buttons_for(selected_building_id)

func _draw_roads_and_plots() -> void:
	var grid_lines = city_map.get_node_or_null("GridLines")
	if not grid_lines:
		return
	for child in grid_lines.get_children():
		child.queue_free()
		
	# Draw simple blueprints road grid matching the Crownspire theme
	var horizontal_roads = [300, 600, 900]
	var vertical_roads = [400, 800, 1200]
	
	for ry in horizontal_roads:
		var road = ColorRect.new()
		road.color = Color(0.10, 0.14, 0.22, 1.0)
		road.position = Vector2(0, ry - 12)
		road.size = Vector2(1600, 24)
		road.mouse_filter = Control.MOUSE_FILTER_IGNORE
		grid_lines.add_child(road)
		
	for rx in vertical_roads:
		var road = ColorRect.new()
		road.color = Color(0.10, 0.14, 0.22, 1.0)
		road.position = Vector2(rx - 12, 0)
		road.size = Vector2(24, 1200)
		road.mouse_filter = Control.MOUSE_FILTER_IGNORE
		grid_lines.add_child(road)
		
	# Draw solid building foundation plots
	for b_id in BUILDING_POSITIONS:
		var pos = BUILDING_POSITIONS[b_id]
		var plot = PanelContainer.new()
		plot.custom_minimum_size = Vector2(262, 112)
		plot.position = pos - Vector2(131, 56)
		plot.mouse_filter = Control.MOUSE_FILTER_IGNORE
		
		var plot_sb = StyleBoxFlat.new()
		plot_sb.bg_color = Color(0.04, 0.06, 0.09, 0.9)
		plot_sb.border_width_left = 1
		plot_sb.border_width_top = 1
		plot_sb.border_width_right = 1
		plot_sb.border_width_bottom = 1
		plot_sb.border_color = Color(0.14, 0.18, 0.25, 0.3)
		plot_sb.corner_radius_top_left = 14
		plot_sb.corner_radius_top_right = 14
		plot_sb.corner_radius_bottom_right = 14
		plot_sb.corner_radius_bottom_left = 14
		plot.add_theme_stylebox_override("panel", plot_sb)
		
		grid_lines.add_child(plot)

# --- REUSABLE CARD & LABEL RENDERING ---
func create_visual_building_card(b: Dictionary) -> PanelContainer:
	var card = PanelContainer.new()
	card.name = "Card_" + b["id"]
	card.custom_minimum_size = Vector2(250, 100)
	
	# Design a beautiful high-fidelity container style
	var sb = StyleBoxFlat.new()
	sb.bg_color = Color(0.08, 0.11, 0.18, 0.95)
	sb.border_width_left = 2
	sb.border_width_top = 2
	sb.border_width_right = 2
	sb.border_width_bottom = 2
	sb.border_color = Color(0.18, 0.24, 0.35, 1.0)
	sb.corner_radius_top_left = 12
	sb.corner_radius_top_right = 12
	sb.corner_radius_bottom_right = 12
	sb.corner_radius_bottom_left = 12
	sb.shadow_color = Color(0, 0, 0, 0.4)
	sb.shadow_size = 6
	
	if b["id"] == selected_building_id:
		sb.border_color = Color(1.0, 0.84, 0.0, 1.0) # Radiant Gold Border
		sb.bg_color = Color(0.12, 0.16, 0.26, 0.95)
		
	card.add_theme_stylebox_override("panel", sb)
	
	var margin = MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 12)
	margin.add_theme_constant_override("margin_top", 10)
	margin.add_theme_constant_override("margin_right", 12)
	margin.add_theme_constant_override("margin_bottom", 10)
	card.add_child(margin)
	
	var hbox = HBoxContainer.new()
	hbox.add_theme_constant_override("separation", 12)
	margin.add_child(hbox)
	
	# Left Side: Circular emoji housing icon panel
	var icon_panel = PanelContainer.new()
	icon_panel.custom_minimum_size = Vector2(52, 52)
	icon_panel.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	
	var ip_sb = StyleBoxFlat.new()
	ip_sb.bg_color = Color(0.14, 0.20, 0.32, 1.0)
	ip_sb.border_width_left = 1
	ip_sb.border_width_top = 1
	ip_sb.border_width_right = 1
	ip_sb.border_width_bottom = 1
	ip_sb.border_color = Color(1.0, 0.84, 0.0, 0.6) if b["id"] == selected_building_id else Color(0.24, 0.32, 0.46, 0.6)
	ip_sb.corner_radius_top_left = 26
	ip_sb.corner_radius_top_right = 26
	ip_sb.corner_radius_bottom_right = 26
	ip_sb.corner_radius_bottom_left = 26
	icon_panel.add_theme_stylebox_override("panel", ip_sb)
	
	var icon_lbl = Label.new()
	icon_lbl.text = get_building_unicode_icon(b["id"])
	icon_lbl.add_theme_font_size_override("font_size", 28)
	icon_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	icon_lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	icon_panel.add_child(icon_lbl)
	hbox.add_child(icon_panel)
	
	# Right Side: Text & Level Information
	var v_info = VBoxContainer.new()
	v_info.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	v_info.alignment = BoxContainer.ALIGNMENT_CENTER
	hbox.add_child(v_info)
	
	var name_lbl = Label.new()
	name_lbl.text = b["name"].to_upper()
	name_lbl.add_theme_font_size_override("font_size", 12)
	name_lbl.add_theme_color_override("font_color", Color(1.0, 1.0, 1.0, 1.0))
	name_lbl.text_overrun_behavior = TextOverrunBehavior.OVERRUN_TRIM_ELLIPSIS
	v_info.add_child(name_lbl)
	
	var level_lbl = Label.new()
	level_lbl.text = "Level %d" % b["level"]
	level_lbl.add_theme_font_size_override("font_size", 11)
	level_lbl.add_theme_color_override("font_color", Color(1.0, 0.84, 0.0, 0.9))
	v_info.add_child(level_lbl)
	
	# Status description
	var status_lbl = Label.new()
	status_lbl.name = "StatusLabel"
	if b.get("type", "") == "resource":
		var rate = b.get("production_rate_per_hour", 100)
		var accum = int(b.get("accumulated_resources", 0.0))
		status_lbl.text = "+%d/hr (%d)" % [rate, accum]
		status_lbl.add_theme_color_override("font_color", Color(0.2, 0.8, 0.4, 0.9) if accum > 0 else Color(0.3, 0.8, 0.5, 0.8))
	else:
		var can_up = check_upgrade_affordability(b)
		status_lbl.text = "🟢 Upgrade Ready" if can_up else "🛡️ Stable"
		status_lbl.add_theme_color_override("font_color", Color(0.2, 0.9, 0.4, 0.8) if can_up else Color(0.5, 0.6, 0.7, 0.5))
	status_lbl.add_theme_font_size_override("font_size", 10)
	v_info.add_child(status_lbl)
	
	# Map click handler for this card
	card.gui_input.connect(func(ev):
		if ev is InputEventMouseButton and ev.pressed and ev.button_index == MOUSE_BUTTON_LEFT:
			select_building_on_map(b["id"])
	)
	
	return card

func create_visual_building_label(b: Dictionary) -> PanelContainer:
	var label_container = PanelContainer.new()
	label_container.name = "Label_" + b["id"]
	label_container.mouse_filter = Control.MOUSE_FILTER_IGNORE
	
	# Premium dark royal-blue background with a gorgeous thin gold trim!
	var sb = StyleBoxFlat.new()
	sb.bg_color = Color(0.047, 0.106, 0.25, 0.95) # #0c1b40
	sb.border_width_left = 1
	sb.border_width_top = 1
	sb.border_width_right = 1
	sb.border_width_bottom = 1
	sb.border_color = Color(0.855, 0.647, 0.125, 0.8) # Gold border
	sb.corner_radius_top_left = 6
	sb.corner_radius_top_right = 6
	sb.corner_radius_bottom_right = 6
	sb.corner_radius_bottom_left = 6
	label_container.add_theme_stylebox_override("panel", sb)
	
	var margin = MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 10)
	margin.add_theme_constant_override("margin_top", 4)
	margin.add_theme_constant_override("margin_right", 10)
	margin.add_theme_constant_override("margin_bottom", 4)
	margin.mouse_filter = Control.MOUSE_FILTER_IGNORE
	label_container.add_child(margin)
	
	var lbl = Label.new()
	var b_short_name = b["name"].split(" ")[-1] if " " in b["name"] else b["name"]
	# "Academy Lv.15" representation format
	lbl.text = "%s Lv.%d" % [b_short_name, b["level"]]
	lbl.add_theme_font_size_override("font_size", 11)
	lbl.add_theme_color_override("font_color", Color(1.0, 1.0, 1.0, 1.0)) # Crisp white text
	lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	lbl.mouse_filter = Control.MOUSE_FILTER_IGNORE
	margin.add_child(lbl)
	
	return label_container

func get_building_unicode_icon(b_id: String) -> String:
	match b_id:
		"castle": return "🏰"
		"farm": return "🌾"
		"lumber_mill": return "🪵"
		"quarry": return "🪨"
		"iron_mine": return "⛓️"
		"barracks": return "🛡️"
		"academy": return "📜"
		_: return "🏠"

# --- FLOATING ACTION BUTTON SYSTEM (FABS) ---
func select_building_on_map(b_id: String) -> void:
	if selected_building_id == b_id:
		return
		
	selected_building_id = b_id
	
	# Update visual highlights on all map cards
	for other_id in _building_nodes:
		var other_node = _building_nodes[other_id]
		if is_instance_valid(other_node):
			var sb = other_node.get_theme_stylebox("panel") as StyleBoxFlat
			if sb:
				if other_id == selected_building_id:
					sb.border_color = Color(1.0, 0.84, 0.0, 1.0)
					sb.bg_color = Color(0.12, 0.16, 0.26, 0.95)
				else:
					sb.border_color = Color(0.18, 0.24, 0.35, 1.0)
					sb.bg_color = Color(0.08, 0.11, 0.18, 0.95)
					
	# Clear out old drawer details & trigger slide up animations of FABs
	show_floating_buttons_for(b_id)

func show_floating_buttons_for(b_id: String) -> void:
	if _active_floating_buttons and is_instance_valid(_active_floating_buttons):
		_active_floating_buttons.queue_free()
		_active_floating_buttons = null
		
	var base_pos = BUILDING_POSITIONS.get(b_id, Vector2(800, 600))
	var actions = BUILDING_ACTIONS.get(b_id, ["Info", "Upgrade"])
	
	# Capsule background container for our actions
	var container = PanelContainer.new()
	container.name = "FAB_Capsule_" + b_id
	
	var c_sb = StyleBoxFlat.new()
	c_sb.bg_color = Color(0.047, 0.078, 0.137, 0.92) # solid slate dark
	c_sb.border_width_left = 1
	c_sb.border_width_top = 1
	c_sb.border_width_right = 1
	c_sb.border_width_bottom = 1
	c_sb.border_color = Color(1.0, 0.84, 0.0, 0.4) # thin gold highlight
	c_sb.corner_radius_top_left = 22
	c_sb.corner_radius_top_right = 22
	c_sb.corner_radius_bottom_right = 22
	c_sb.corner_radius_bottom_left = 22
	c_sb.shadow_color = Color(0, 0, 0, 0.5)
	c_sb.shadow_size = 8
	container.add_theme_stylebox_override("panel", c_sb)
	
	var margin = MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 10)
	margin.add_theme_constant_override("margin_top", 4)
	margin.add_theme_constant_override("margin_right", 10)
	margin.add_theme_constant_override("margin_bottom", 4)
	container.add_child(margin)
	
	var hbox = HBoxContainer.new()
	hbox.name = "HBoxContainer"
	hbox.alignment = BoxContainer.ALIGNMENT_CENTER
	hbox.add_theme_constant_override("separation", 8)
	margin.add_child(hbox)
	
	# Initial position offset below card
	container.position = base_pos + Vector2(-150, 55)
	container.custom_minimum_size = Vector2(240, 42)
	
	# Dynamically instantiate floating action buttons
	for action in actions:
		var btn = Button.new()
		btn.add_theme_font_size_override("font_size", 11)
		btn.custom_minimum_size = Vector2(85, 30)
		
		var btn_sb = StyleBoxFlat.new()
		btn_sb.corner_radius_top_left = 15
		btn_sb.corner_radius_top_right = 15
		btn_sb.corner_radius_bottom_right = 15
		btn_sb.corner_radius_bottom_left = 15
		
		# Stylize individual actions beautifully
		match action:
			"Upgrade":
				btn.text = "⚡ Upgrade"
				btn_sb.bg_color = Color(0.85, 0.65, 0.12, 1.0) # Gold
				btn.add_theme_color_override("font_color", Color(0, 0, 0, 1)) # Black text on gold
			"Research":
				btn.text = "🧪 Research"
				btn_sb.bg_color = Color(0.18, 0.44, 0.72, 1.0) # Sapphire Blue
				btn.add_theme_color_override("font_color", Color(1, 1, 1, 1))
			"Collect":
				var b_data = UIManager.get_building(b_id)
				var amt = int(b_data.get("accumulated_resources", 0.0))
				var prefix = "🌾"
				if b_data.get("produces", "") == "wood": prefix = "🪵"
				elif b_data.get("produces", "") == "stone": prefix = "🪨"
				elif b_data.get("produces", "") == "iron": prefix = "⛓️"
				btn.text = "%s Collect (%d)" % [prefix, amt]
				btn_sb.bg_color = Color(0.06, 0.52, 0.34, 1.0) # Emerald Green
				btn.add_theme_color_override("font_color", Color(1, 1, 1, 1))
				btn.disabled = amt <= 0
				if btn.disabled:
					btn.modulate = Color(0.5, 0.5, 0.5, 0.5)
			"Train":
				btn.text = "⚔️ Train"
				btn_sb.bg_color = Color(0.13, 0.55, 0.13, 1.0) # Forest Green
				btn.add_theme_color_override("font_color", Color(1, 1, 1, 1))
			_: # "Info" or other
				btn.text = "ℹ️ Info"
				btn_sb.bg_color = Color(0.15, 0.22, 0.35, 1.0) # Sleek Slate Blue
				btn.add_theme_color_override("font_color", Color(1, 1, 1, 1))
				
		btn.add_theme_stylebox_override("normal", btn_sb)
		
		# Connect the reusable dispatch callback
		btn.pressed.connect(func():
			_on_action_button_pressed(action, b_id)
		)
		hbox.add_child(btn)
		
	# Spawn floating capsule inside Map canvas
	buildings_container.add_child(container)
	_active_floating_buttons = container
	
	# Centering update once layouts calculate actual width
	container.ready.connect(func():
		if is_instance_valid(container):
			container.position = base_pos + Vector2(-container.size.x / 2.0, 55)
	)
	
	# Clean micro-fade/slide entrance animation
	var target_y = base_pos.y + 55
	container.position.y = target_y + 12
	container.modulate.a = 0.0
	var tween = create_tween().set_parallel(true)
	tween.tween_property(container, "position:y", target_y, 0.18).set_ease(Tween.EASE_OUT).set_trans(Tween.TRANS_CUBIC)
	tween.tween_property(container, "modulate:a", 1.0, 0.15)

func deselect_all() -> void:
	selected_building_id = ""
	
	# Reset highlights
	for b_id in _building_nodes:
		var node = _building_nodes[b_id]
		if is_instance_valid(node):
			var sb = node.get_theme_stylebox("panel") as StyleBoxFlat
			if sb:
				sb.border_color = Color(0.18, 0.24, 0.35, 1.0)
				sb.bg_color = Color(0.08, 0.11, 0.18, 0.95)
				
	# Clear active buttons
	if _active_floating_buttons and is_instance_valid(_active_floating_buttons):
		_active_floating_buttons.queue_free()
		_active_floating_buttons = null
		
	# Slide out detail drawer smoothly
	var drawer_tween = create_tween()
	drawer_tween.tween_property(detail_drawer, "modulate:a", 0.0, 0.18)
	await drawer_tween.finished
	
	# Only keep hidden if still deselected
	if selected_building_id == "":
		detail_drawer.visible = false
		empty_hint.visible = true
		drawer_content.visible = false

# --- ACTION CALL DISPATCHER (REUSABLE SYSTEM) ---
func _on_action_button_pressed(action_name: String, b_id: String) -> void:
	match action_name:
		"Info":
			# Opens the existing detailed drawers and selectors
			open_details_drawer_for(b_id)
		"Upgrade":
			# Opens the existing shared building upgrade window
			var upg_scene = load("res://scenes/BuildingUpgradeWindow.tscn")
			var inst = UIManager.open_popup(upg_scene)
			if inst:
				inst.building_id = b_id
				inst.load_building_data()
		"Research":
			# Opens the prebuilt AcademyResearchWindow.tscn
			var res_scene = load("res://scenes/AcademyResearchWindow.tscn")
			UIManager.open_popup(res_scene)
		"Train":
			open_details_drawer_for(b_id)
		"Collect":
			_on_collect_clicked(b_id)
		_:
			UIManager.show_toast("Action '%s' performed on %s" % [action_name, b_id])

func open_details_drawer_for(b_id: String) -> void:
	var b_data = UIManager.get_building(b_id)
	if not b_data.is_empty():
		empty_hint.visible = false
		drawer_content.visible = true
		detail_drawer.visible = true
		
		# Slide up details pane
		var drawer_tween = create_tween()
		detail_drawer.modulate.a = 0.0
		drawer_tween.tween_property(detail_drawer, "modulate:a", 1.0, 0.22)
		
		# Fill headers
		b_name.text = b_data["name"].to_upper()
		b_level.text = "LEVEL %d STRUCTURE" % b_data["level"]
		b_desc.text = b_data["description"]
		b_power.text = "Base power valuation: %d rating points" % int(b_data["base_power"] + b_data["level"] * b_data["power_per_level"])
		b_bonus.text = "Current: %s" % b_data.get("current_bonus", "Active")
		b_next_bonus.text = "Next: %s" % b_data.get("next_bonus", "Boosted stats")
		
		# Open special sections
		barracks_box.visible = (b_id == "barracks")
		academy_box.visible = (b_id == "academy")
		
		if b_id == "barracks":
			populate_barracks(b_data)
		elif b_id == "academy":
			populate_academy(b_data)
			
		update_upgrade_cost_display(b_data)

# --- REUSED BACKEND DETAILS FILLING ---
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
		lbl.text = "• %s: %s / %s" % [res_name, format_large_number(player_amt), format_large_number(req_amt)]
		if player_amt >= req_amt:
			lbl.add_theme_color_override("font_color", Color(0.3, 0.85, 0.45, 1.0))
		else:
			lbl.add_theme_color_override("font_color", Color(0.9, 0.3, 0.3, 1.0))

func format_large_number(n: int) -> String:
	if n >= 1000000:
		return "%.1fM" % (float(n) / 1000000.0)
	elif n >= 1000:
		return "%.1fK" % (float(n) / 1000.0)
	return str(n)

# --- BARRACKS ---
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
		animate_building_success("barracks")
		_on_train_slider_changed(train_slider.value)
		_on_resources_changed("", 0)
	else:
		show_hud_warning(res["message"])

# --- ACADEMY MATRIX ---
func populate_academy(b_data: Dictionary) -> void:
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
		
		var lvl = tech["level"]
		var cost_food = int(tech.get("cost_food", 0) * (1.0 + lvl * 0.25))
		var cost_gold = int(tech.get("cost_gold", 0) * (1.0 + lvl * 0.25))
		
		var t_cost = Label.new()
		t_cost.text = "🌾 Food: %s  🪙 Gold: %s" % [format_large_number(cost_food), format_large_number(cost_gold)]
		t_cost.add_theme_font_size_override("font_size", 10)
		t_vbox.add_child(t_cost)
		
		var r_btn = Button.new()
		r_btn.text = "RESEARCH"
		r_btn.add_theme_font_size_override("font_size", 10)
		r_btn.size_flags_vertical = Control.SIZE_SHRINK_CENTER
		
		var btn_sb = StyleBoxFlat.new()
		btn_sb.bg_color = Color(0.18, 0.44, 0.72, 1.0)
		btn_sb.corner_radius_top_left = 6
		btn_sb.corner_radius_top_right = 6
		btn_sb.corner_radius_bottom_right = 6
		btn_sb.corner_radius_bottom_left = 6
		r_btn.add_theme_stylebox_override("normal", btn_sb)
		
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
		var academy_ref = UIManager.get_building("academy")
		populate_academy(academy_ref)
		_on_resources_changed("", 0)
	else:
		show_hud_warning(res["message"])

# --- UPGRADE & RESOURCE GAIN SIGNALS ---
func _on_upgrade_pressed() -> void:
	if selected_building_id == "":
		return
		
	var res = UIManager.upgrade_building(selected_building_id)
	if res["success"]:
		animate_building_success(selected_building_id)
		# Reload details
		open_details_drawer_for(selected_building_id)
	else:
		show_hud_warning(res["message"])

func _on_collect_clicked(b_id: String) -> void:
	var res = UIManager.collect_building_resources(b_id)
	if res["success"]:
		animate_building_success(b_id)
		# Re-render floating actions to update counts
		if selected_building_id == b_id:
			show_floating_buttons_for(b_id)
	else:
		show_hud_warning(res["message"])

func _on_resources_changed(_p: String, _v: float) -> void:
	if selected_building_id != "":
		var b_data = UIManager.get_building(selected_building_id)
		if not b_data.is_empty():
			update_upgrade_cost_display(b_data)
			if selected_building_id == "academy":
				populate_academy(b_data)
			elif selected_building_id == "barracks":
				_on_train_slider_changed(train_slider.value)

func _on_building_updated(b_id: String, _new_level: int) -> void:
	rebuild_city_map()
	if selected_building_id == b_id:
		# Keep highlight & slide-up details
		select_building_on_map(b_id)

func _on_building_collected(b_id: String, _type: String, _amount: int) -> void:
	# Clean micro shake animation when collecting
	var card = _building_nodes.get(b_id)
	if is_instance_valid(card):
		var orig_y = card.position.y
		var tween = create_tween()
		tween.tween_property(card, "position:y", orig_y - 8, 0.08).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
		tween.tween_property(card, "position:y", orig_y, 0.08).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN)

func _on_technology_researched(_tech_id: String, _lvl: int) -> void:
	if selected_building_id == "academy":
		var b_data = UIManager.get_building("academy")
		populate_academy(b_data)

func update_resource_accumulations() -> void:
	for b in UIManager.get_all_buildings():
		var b_id = b["id"]
		var card_node = _building_nodes.get(b_id)
		if is_instance_valid(card_node):
			var status_lbl = card_node.find_child("StatusLabel", true, false) as Label
			if status_lbl and b.get("type", "") == "resource":
				var amt = int(b.get("accumulated_resources", 0.0))
				status_lbl.text = "+%d/hr (%d)" % [int(b.get("production_rate_per_hour", 100)), amt]
				status_lbl.add_theme_color_override("font_color", Color(0.2, 0.8, 0.4, 0.9) if amt > 0 else Color(0.3, 0.8, 0.5, 0.8))

	# Re-evaluates collect button state in our dynamic capsule
	if selected_building_id != "" and _active_floating_buttons and is_instance_valid(_active_floating_buttons):
		var b_data = UIManager.get_building(selected_building_id)
		if not b_data.is_empty() and b_data.get("type", "") == "resource":
			var collect_btn = null
			for btn in _active_floating_buttons.find_child("HBoxContainer", true, false).get_children():
				if btn is Button and (btn.text.begins_with("🌾") or btn.text.begins_with("🪵") or btn.text.begins_with("🪨") or btn.text.begins_with("⛓️")):
					collect_btn = btn
					break
			if collect_btn:
				var amt = int(b_data.get("accumulated_resources", 0.0))
				var prefix = "🌾"
				if b_data.get("produces", "") == "wood": prefix = "🪵"
				elif b_data.get("produces", "") == "stone": prefix = "🪨"
				elif b_data.get("produces", "") == "iron": prefix = "⛓️"
				collect_btn.text = "%s Collect (%d)" % [prefix, amt]
				collect_btn.disabled = amt <= 0
				if collect_btn.disabled:
					collect_btn.modulate = Color(0.5, 0.5, 0.5, 0.5)
				else:
					collect_btn.modulate = Color(1, 1, 1, 1)

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
	var card = _building_nodes.get(b_id)
	if is_instance_valid(card):
		var tween = create_tween()
		tween.tween_property(card, "scale", Vector2(1.05, 1.05), 0.1).set_trans(Tween.TRANS_BOUNCE)
		tween.tween_property(card, "scale", Vector2(1.0, 1.0), 0.1).set_trans(Tween.TRANS_BOUNCE)

func show_hud_warning(msg: String) -> void:
	if UIManager.has_signal("reward_claimed"):
		UIManager.reward_claimed.emit([
			{"name": "COMMAND: %s" % msg, "quantity": 1, "rarity": 1, "icon": ""}
		])
