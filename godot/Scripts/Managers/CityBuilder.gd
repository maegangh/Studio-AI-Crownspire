extends Node2D

class_name CityBuilder

const LAYOUT_PATH = "res://data/city_layout.json"
const UPGRADE_WINDOW_SCENE = preload("res://scenes/BuildingUpgradeWindow.tscn")
const RESEARCH_WINDOW_SCENE = preload("res://scenes/AcademyResearchWindow.tscn")

@export var camera_path: NodePath = "Camera2D"

@onready var camera: Camera2D = get_node_or_null(camera_path)
@onready var buildings_container: Node2D = $Buildings

var buildings_data: Array = []
var building_nodes: Dictionary = {}
var selected_building_id: String = ""

# Floating Action Buttons node reference
var current_fab_menu: Control = null

# Camera Dragging States
var dragging = false
var drag_start = Vector2.ZERO
var cam_start = Vector2.ZERO

# Zoom and visibility thresholds
var zoom_hide_threshold: float = 0.55

func _ready() -> void:
	# Create Buildings node if it doesn't exist
	if not has_node("Buildings"):
		var container = Node2D.new()
		container.name = "Buildings"
		add_child(container)
		buildings_container = container
		
	load_layout()
	spawn_buildings()
	
	# Connect click on empty ground
	var background = get_node_or_null("Background")
	if background:
		if background is Control:
			background.gui_input.connect(_on_background_input)
		elif background is Area2D:
			background.input_event.connect(_on_background_area_input)
			
	set_process_unhandled_input(true)

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
		# Click on empty space closes selection
		deselect_building()

func _input(event: InputEvent) -> void:
	if event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_LEFT:
			if event.pressed:
				dragging = true
				drag_start = event.position
				if camera:
					cam_start = camera.position
			else:
				dragging = false
		elif event.button_index == MOUSE_BUTTON_WHEEL_UP:
			if camera and camera.zoom.x < 2.0:
				var target_zoom = camera.zoom + Vector2(0.08, 0.08)
				camera.zoom = target_zoom.clamp(Vector2(0.3, 2.0), Vector2(2.0, 2.0))
		elif event.button_index == MOUSE_BUTTON_WHEEL_DOWN:
			if camera and camera.zoom.x > 0.3:
				var target_zoom = camera.zoom - Vector2(0.08, 0.08)
				camera.zoom = target_zoom.clamp(Vector2(0.3, 2.0), Vector2(2.0, 2.0))
				
	elif event is InputEventMouseMotion and dragging:
		if camera:
			var diff = event.position - drag_start
			camera.position = cam_start - (diff / camera.zoom.x)

func load_layout() -> void:
	if not FileAccess.file_exists(LAYOUT_PATH):
		push_error("City layout file not found at: " + LAYOUT_PATH)
		return
		
	var file = FileAccess.open(LAYOUT_PATH, FileAccess.READ)
	if file:
		var json = JSON.new()
		if json.parse(file.get_as_text()) == OK:
			var data = json.get_data()
			if data is Dictionary and "buildings" in data:
				buildings_data = data["buildings"]
			elif data is Array:
				buildings_data = data
		file.close()

func spawn_buildings() -> void:
	if not buildings_container:
		buildings_container = self
		
	# Clear existing
	for child in buildings_container.get_children():
		child.queue_free()
		
	for b_data in buildings_data:
		var b_id = b_data["id"]
		var b_name = b_data["name"]
		var x = b_data.get("x", 0)
		var y = b_data.get("y", 0)
		var scale = b_data.get("scale", 1.0)
		
		# Create building Area2D node for click boundaries
		var building_node = Area2D.new()
		building_node.name = b_id
		building_node.position = Vector2(x, y)
		building_node.scale = Vector2(scale, scale)
		
		# Add Sprite
		var sprite = Sprite2D.new()
		sprite.name = "Sprite"
		
		# Load texture via CityImageLoader
		var texture = CityImageLoader.load_building_image(b_id)
		if texture:
			sprite.texture = texture
		else:
			# Draw fallback category icon
			sprite.texture = CityImageLoader.get_fallback_image(b_id)
			
			# Add centered emoji overlay
			var emoji_label = Label.new()
			emoji_label.name = "Emoji"
			emoji_label.text = CityImageLoader.get_fallback_symbol(b_id)
			emoji_label.add_theme_font_size_override("font_size", 42)
			emoji_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
			emoji_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
			emoji_label.mouse_filter = Control.MOUSE_FILTER_IGNORE
			emoji_label.grow_horizontal = Control.GROW_DIRECTION_BOTH
			emoji_label.grow_vertical = Control.GROW_DIRECTION_BOTH
			building_node.add_child(emoji_label)
			
		building_node.add_child(sprite)
		
		# Add CollisionShape2D for tap detection
		var col = CollisionShape2D.new()
		col.name = "Collision"
		var shape = RectangleShape2D.new()
		if sprite.texture:
			shape.size = sprite.texture.get_size()
		else:
			shape.size = Vector2(120, 120)
		col.shape = shape
		building_node.add_child(col)
		
		# Connect input event for selection
		building_node.input_event.connect(func(viewport, event, shape_idx):
			if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
				get_viewport().set_input_as_handled()
				select_building(b_id)
		)
		
		buildings_container.add_child(building_node)
		building_nodes[b_id] = building_node
		
		# Create building label
		create_building_label(building_node, b_id, b_name)

func create_building_label(building_node: Node2D, b_id: String, b_name: String) -> void:
	# Fetch level from global UIManager
	var level = 1
	var db_id = b_id
	if b_id == "research_hall": db_id = "academy"
	elif b_id == "citadel_keep": db_id = "citadel"
	elif b_id == "infantry_barracks": db_id = "barracks"
	
	var ui = get_node_or_null("/root/UIManager")
	if ui and ui.has_method("get_building"):
		var b_db = ui.call("get_building", db_id)
		if not b_db.is_empty():
			level = b_db.get("level", 1)
			
	var label_container = Control.new()
	label_container.name = "LabelContainer"
	label_container.mouse_filter = Control.MOUSE_FILTER_IGNORE
	
	# Position above the building (assume sprite height/2 + padding)
	var sprite = building_node.get_node("Sprite") as Sprite2D
	var offset_y = -70
	if sprite and sprite.texture:
		offset_y = -(sprite.texture.get_size().y / 2) - 25
	label_container.position = Vector2(0, offset_y)
	
	# Compact styled PanelContainer
	var panel = PanelContainer.new()
	panel.name = "Panel"
	panel.mouse_filter = Control.MOUSE_FILTER_IGNORE
	
	var sb = StyleBoxFlat.new()
	sb.bg_color = Color(0.06, 0.13, 0.25, 0.9) # compact dark royal-blue
	sb.border_color = Color(0.85, 0.65, 0.13, 1.0) # thin gold trim
	sb.border_width_left = 1
	sb.border_width_top = 1
	sb.border_width_right = 1
	sb.border_width_bottom = 1
	sb.corner_radius_top_left = 4
	sb.corner_radius_top_right = 4
	sb.corner_radius_bottom_right = 4
	sb.corner_radius_bottom_left = 4
	sb.content_margin_left = 10
	sb.content_margin_right = 10
	sb.content_margin_top = 4
	sb.content_margin_bottom = 4
	panel.add_theme_stylebox_override("panel", sb)
	
	var text_label = Label.new()
	text_label.name = "Label"
	text_label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	
	# Special friendly title names
	var displayName = b_name
	if b_id == "research_hall": displayName = "Academy"
	elif b_id == "citadel_keep": displayName = "Citadel"
	elif b_id == "infantry_barracks": displayName = "Barracks"
	
	text_label.text = "%s Lv.%d" % [displayName, level]
	text_label.add_theme_color_override("font_color", Color.WHITE)
	text_label.add_theme_font_size_override("font_size", 12)
	text_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	text_label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	
	panel.add_child(text_label)
	label_container.add_child(panel)
	
	# Center the panel container
	panel.anchors_preset = Control.PRESET_CENTER
	panel.grow_horizontal = Control.GROW_DIRECTION_BOTH
	panel.grow_vertical = Control.GROW_DIRECTION_BOTH
	
	building_node.add_child(label_container)

func select_building(b_id: String) -> void:
	if selected_building_id == b_id:
		return
		
	deselect_building()
	selected_building_id = b_id
	
	var node = building_nodes.get(b_id)
	if node:
		var tween = create_tween()
		tween.tween_property(node, "scale", node.scale * 1.05, 0.15).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
		
		# Show Selection Outline (draw gold ring)
		var selection_ring = Line2D.new()
		selection_ring.name = "SelectionRing"
		selection_ring.width = 2
		selection_ring.default_color = Color(1.0, 0.84, 0.0, 1.0)
		
		var sprite = node.get_node("Sprite") as Sprite2D
		var size = Vector2(120, 120)
		if sprite and sprite.texture:
			size = sprite.texture.get_size()
			
		var half_w = size.x / 2 + 5
		var half_h = size.y / 2 + 5
		selection_ring.points = [
			Vector2(-half_w, -half_h),
			Vector2(half_w, -half_h),
			Vector2(half_w, half_h),
			Vector2(-half_w, half_h),
			Vector2(-half_w, -half_h)
		]
		node.add_child(selection_ring)
		
		# Pulse animation
		var ring_tween = create_tween().set_loops()
		ring_tween.tween_property(selection_ring, "default_color:a", 0.3, 0.6)
		ring_tween.tween_property(selection_ring, "default_color:a", 1.0, 0.6)
		
		# Create FAB near building
		show_fab_menu(node, b_id)

func deselect_building() -> void:
	if selected_building_id == "":
		return
		
	var node = building_nodes.get(selected_building_id)
	if node:
		var layout_b_data = null
		for b in buildings_data:
			if b["id"] == selected_building_id:
				layout_b_data = b
				break
		var original_scale = layout_b_data.get("scale", 1.0) if layout_b_data else 1.0
		var tween = create_tween()
		tween.tween_property(node, "scale", Vector2(original_scale, original_scale), 0.12)
		
		var ring = node.get_node_or_null("SelectionRing")
		if ring:
			ring.queue_free()
			
	hide_fab_menu()
	selected_building_id = ""

func show_fab_menu(building_node: Node2D, b_id: String) -> void:
	hide_fab_menu()
	
	var fab_menu = HBoxContainer.new()
	fab_menu.name = "FABMenu"
	fab_menu.add_theme_constant_override("separation", 10)
	
	var db_id = b_id
	if b_id == "research_hall" or b_id == "academy": db_id = "academy"
	elif b_id == "citadel_keep" or b_id == "citadel": db_id = "citadel"
	elif b_id == "infantry_barracks" or b_id == "barracks": db_id = "barracks"
	elif b_id == "watch_tower": db_id = "watchtower"
	elif b_id == "valor_shrine": db_id = "valor_shine"
	
	var displayName = b_id.replace("_", " ").capitalize()
	if db_id == "academy": displayName = "Academy"
	elif db_id == "citadel": displayName = "Citadel"
	elif db_id == "barracks": displayName = "Infantry Barracks"
	elif db_id == "marksmen_camp": displayName = "Marksmen Camp"
	elif db_id == "cavalry_stable": displayName = "Cavalry Stable"
	elif db_id == "watchtower": displayName = "Watch Tower"
	elif db_id == "rune_forge": displayName = "Rune Forge"
	elif db_id == "valor_shine": displayName = "Valor Shrine"
	elif db_id == "wall": displayName = "City Wall"
	elif db_id == "arcane_tower": displayName = "Arcane Tower"
	elif db_id == "tavern": displayName = "Royal Tavern"
	
	# Determine actions list
	var buttons = ["Info", "Upgrade"]
	if db_id == "academy":
		buttons = ["Info", "Upgrade", "Research"]
	elif db_id == "barracks":
		buttons = ["Info", "Upgrade", "Train"]
	elif db_id == "marksmen_camp":
		buttons = ["Info", "Upgrade", "Train"]
	elif db_id == "cavalry_stable":
		buttons = ["Info", "Upgrade", "Train"]
	elif db_id == "watchtower":
		buttons = ["Info", "Upgrade", "Scout"]
	elif db_id == "rune_forge":
		buttons = ["Info", "Upgrade", "Forge"]
	elif db_id == "valor_shine":
		buttons = ["Info", "Upgrade", "Commune"]
	elif db_id == "wall":
		buttons = ["Info", "Upgrade", "Fortify"]
	elif db_id == "arcane_tower":
		buttons = ["Info", "Upgrade", "Spellfire"]
	elif db_id == "tavern":
		buttons = ["Info", "Upgrade", "Quests"]
		
	for btn_name in buttons:
		var btn = Button.new()
		
		# Stylized action prefixes
		if btn_name == "Info":
			btn.text = "ℹ️ Info"
		elif btn_name == "Upgrade":
			btn.text = "⭐ Upgrade"
		elif btn_name == "Research":
			btn.text = "🧪 Research"
		elif btn_name == "Train":
			btn.text = "⚔️ Train"
		elif btn_name == "Scout":
			btn.text = "🔭 Scout"
		elif btn_name == "Forge":
			btn.text = "💎 Forge"
		elif btn_name == "Commune":
			btn.text = "🔥 Commune"
		elif btn_name == "Fortify":
			btn.text = "🧱 Fortify"
		elif btn_name == "Spellfire":
			btn.text = "🔮 Spellfire"
		elif btn_name == "Quests":
			btn.text = "🍺 Quests"
		else:
			btn.text = btn_name
			
		btn.custom_minimum_size = Vector2(95, 34)
		
		var sb_norm = StyleBoxFlat.new()
		# Use compact dark royal-blue bg with thin gold trim
		sb_norm.bg_color = Color(0.08, 0.12, 0.22, 0.95)
		sb_norm.border_width_left = 1
		sb_norm.border_width_top = 1
		sb_norm.border_width_right = 1
		sb_norm.border_width_bottom = 2
		sb_norm.border_color = Color(0.85, 0.68, 0.25, 0.8) # Gold trim
		sb_norm.corner_radius_top_left = 6
		sb_norm.corner_radius_top_right = 6
		sb_norm.corner_radius_bottom_right = 6
		sb_norm.corner_radius_bottom_left = 6
		sb_norm.content_margin_left = 8
		sb_norm.content_margin_right = 8
		
		# Unique background accent colors for core actions to stand out elegantly
		if btn_name == "Research":
			sb_norm.bg_color = Color(0.05, 0.22, 0.2, 0.95) # Emerald
		elif btn_name == "Train":
			sb_norm.bg_color = Color(0.25, 0.05, 0.05, 0.95) # Crimson
		elif btn_name == "Upgrade":
			sb_norm.bg_color = Color(0.35, 0.22, 0.05, 0.95) # Amber
			
		btn.add_theme_stylebox_override("normal", sb_norm)
		btn.add_theme_color_override("font_color", Color.WHITE)
		btn.add_theme_font_size_override("font_size", 11)
		btn.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		
		# Connect action handler
		var local_btn_name = btn_name
		btn.pressed.connect(func(): _on_fab_action_pressed(local_btn_name, db_id, displayName))
			
		fab_menu.add_child(btn)
		
	var label_container = building_node.get_node_or_null("LabelContainer")
	var fab_y = 50
	if label_container:
		fab_y = label_container.position.y - 45
		
	var fab_anchor = Control.new()
	fab_anchor.name = "FABAnchor"
	fab_anchor.position = Vector2(0, fab_y)
	building_node.add_child(fab_anchor)
	
	fab_anchor.add_child(fab_menu)
	fab_menu.anchors_preset = Control.PRESET_CENTER
	fab_menu.grow_horizontal = Control.GROW_DIRECTION_BOTH
	fab_menu.grow_vertical = Control.GROW_DIRECTION_BOTH
	
	current_fab_menu = fab_anchor
	
	# Animate pop-in
	fab_menu.scale = Vector2.ZERO
	var pop_tween = create_tween()
	pop_tween.tween_property(fab_menu, "scale", Vector2.ONE, 0.2).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)

func hide_fab_menu() -> void:
	if current_fab_menu and is_instance_valid(current_fab_menu):
		current_fab_menu.queue_free()
	current_fab_menu = null

func _process(delta: float) -> void:
	if camera:
		var current_zoom = camera.zoom.x
		var visible_state = current_zoom >= zoom_hide_threshold
		
		for b_id in building_nodes.keys():
			var node = building_nodes[b_id]
			if is_instance_valid(node):
				var lbl = node.get_node_or_null("LabelContainer")
				if lbl:
					lbl.visible = visible_state
				var ring = node.get_node_or_null("SelectionRing")
				if ring:
					ring.visible = visible_state
				var fab = node.get_node_or_null("FABAnchor")
				if fab:
					fab.visible = visible_state

func _on_fab_action_pressed(action_name: String, db_id: String, displayName: String) -> void:
	var ui = get_node_or_null("/root/UIManager")
	
	var info_window_scene = load("res://scenes/BuildingInfoWindow.tscn")
	var upgrade_window_scene = load("res://scenes/BuildingUpgradeWindow.tscn")
	var research_window_scene = load("res://scenes/AcademyResearchWindow.tscn")
	var train_window_scene = load("res://scenes/TroopTrainingWindow.tscn")
	
	match action_name:
		"Info":
			if ui and ui.has_method("open_popup"):
				var popup = ui.call("open_popup", info_window_scene)
				if popup:
					popup.building_id = db_id
					if popup.has_method("load_building_data"):
						popup.call("load_building_data")
			else:
				var inst = info_window_scene.instantiate()
				get_tree().current_scene.add_child(inst)
				inst.building_id = db_id
				if inst.has_method("load_building_data"):
					inst.call("load_building_data")
					
		"Upgrade":
			if ui and ui.has_method("open_popup"):
				var popup = ui.call("open_popup", upgrade_window_scene)
				if popup:
					popup.building_id = db_id
					if popup.has_method("load_building_data"):
						popup.call("load_building_data")
			else:
				var inst = upgrade_window_scene.instantiate()
				get_tree().current_scene.add_child(inst)
				inst.building_id = db_id
				if inst.has_method("load_building_data"):
					inst.call("load_building_data")
					
		"Research":
			if ui and ui.has_method("open_popup"):
				ui.call("open_popup", research_window_scene)
			else:
				var inst = research_window_scene.instantiate()
				get_tree().current_scene.add_child(inst)
				
		"Train":
			var troop_to_train = "legionary"
			if db_id == "marksmen_camp":
				troop_to_train = "bowman"
			elif db_id == "cavalry_stable":
				troop_to_train = "cataphract"
				
			if ui and ui.has_method("open_popup"):
				var popup = ui.call("open_popup", train_window_scene)
				if popup:
					popup.troop_id = troop_to_train
					if popup.has_method("load_troop_data"):
						popup.call("load_troop_data")
			else:
				var inst = train_window_scene.instantiate()
				get_tree().current_scene.add_child(inst)
				inst.troop_id = troop_to_train
				if inst.has_method("load_troop_data"):
					inst.call("load_troop_data")
					
		_:
			var msg = "Coming Soon: %s action for %s." % [action_name, displayName]
			if ui and ui.has_method("show_toast"):
				ui.call("show_toast", msg)
			else:
				push_warning(msg)

func _on_background_input(event: InputEvent) -> void:
	if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
		deselect_building()

func _on_background_area_input(viewport: Node, event: InputEvent, shape_idx: int) -> void:
	if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
		deselect_building()
