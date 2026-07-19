# ==============================================================================
# Crownspire MMO - Resource Node Script
# Godot 4.6 / GDScript 2.0 Clickable Resource Node for Map Exploration
# ==============================================================================

class_name ResourceNode
extends Node2D

signal clicked(node: ResourceNode)

@export var resource_type: String = "food"
@export var level: int = 1
@export var amount: int = 10000
@export var max_amount: int = 10000

@onready var sprite: Sprite2D = $Sprite2D
@onready var click_area: Area2D = $ClickArea
@onready var collision_shape: CollisionShape2D = $ClickArea/CollisionShape2D

# UI node references
@onready var ui: Control = $UI
@onready var panel: Panel = $UI/Panel
@onready var name_label: Label = $UI/Panel/VBox/NameLabel
@onready var amount_label: Label = $UI/Panel/VBox/AmountLabel
@onready var gathering_progress: ProgressBar = $UI/Panel/VBox/GatheringProgress
@onready var timer_label: Label = $UI/Panel/VBox/TimerLabel

var _hovered: bool = false
var _is_gathering: bool = false
var _gather_time_left: float = 0.0
var _total_gather_time: float = 0.0
var _original_gather_amount: int = 0

func _ready() -> void:
	if click_area:
		click_area.input_event.connect(_on_input_event)
		click_area.mouse_entered.connect(_on_mouse_entered)
		click_area.mouse_exited.connect(_on_mouse_exited)
	
	_setup_screen_notifier()
	reset_gathering()
	queue_redraw()

func _setup_screen_notifier() -> void:
	var notifier = VisibleOnScreenNotifier2D.new()
	notifier.rect = Rect2(-80, -100, 160, 200)
	notifier.screen_entered.connect(_on_screen_entered)
	notifier.screen_exited.connect(_on_screen_exited)
	add_child(notifier)

func _on_screen_entered() -> void:
	if sprite:
		sprite.visible = true
	if ui:
		ui.visible = true
	if click_area:
		click_area.monitoring = true
		click_area.monitorable = true
	queue_redraw()

func _on_screen_exited() -> void:
	if sprite:
		sprite.visible = false
	if ui:
		ui.visible = false
	if click_area:
		click_area.monitoring = false
		click_area.monitorable = false

func _process(delta: float) -> void:
	if _is_gathering:
		_gather_time_left = maxf(0.0, _gather_time_left - delta)
		
		# Decrement remaining amount proportionally
		var progress = 1.0 - (_gather_time_left / _total_gather_time) if _total_gather_time > 0.0 else 1.0
		amount = int(lerp(float(_original_gather_amount), 0.0, progress))
		
		if amount_label:
			amount_label.text = "%s / %s" % [_format_number(amount), _format_number(max_amount)]
			
		if gathering_progress:
			gathering_progress.value = progress * 100.0
			
		if timer_label:
			timer_label.text = "⛏️ Gathering: %.1fs" % _gather_time_left
			
		if _gather_time_left <= 0.0:
			_is_gathering = false
			if gathering_progress:
				gathering_progress.visible = false
			if timer_label:
				timer_label.visible = false
			queue_redraw()

# Set node data and update appearance dynamically
func setup_node(type: String, lvl: int, amt: int, texture: Texture2D) -> void:
	resource_type = type
	level = lvl
	max_amount = amt
	amount = amt
	_is_gathering = false
	_gather_time_left = 0.0
	
	# Compatibility check: if a custom small sprite texture is provided and is NOT the full world_map, use it
	if sprite:
		if texture and texture.resource_path != "res://world_map.png":
			sprite.texture = texture
			sprite.visible = true
		else:
			sprite.texture = null
			sprite.visible = false
			
	# Subtle random scaling for organic variety
	scale = Vector2.ONE * randf_range(0.95, 1.05)
	
	if name_label:
		name_label.text = "[Lvl %d] %s" % [level, _get_resource_name_with_emoji()]
	if amount_label:
		amount_label.text = "%s / %s" % [_format_number(amount), _format_number(max_amount)]
	if gathering_progress:
		gathering_progress.visible = false
	if timer_label:
		timer_label.visible = false
		
	_update_panel_styling()
	queue_redraw()

func reset_gathering() -> void:
	_is_gathering = false
	_gather_time_left = 0.0
	_total_gather_time = 0.0
	_original_gather_amount = amount
	if gathering_progress:
		gathering_progress.visible = false
		gathering_progress.value = 0.0
	if timer_label:
		timer_label.visible = false

func start_gathering(duration: float) -> void:
	_is_gathering = true
	_gather_time_left = duration
	_total_gather_time = duration
	_original_gather_amount = amount
	
	if gathering_progress:
		gathering_progress.visible = true
		gathering_progress.value = 0.0
	if timer_label:
		timer_label.visible = true
		timer_label.text = "⛏️ Gathering: %.1fs" % duration
	queue_redraw()

func _get_resource_name_with_emoji() -> String:
	match resource_type.to_lower():
		"food": return "🌾 Food Farm"
		"wood": return "🪵 Lumber Camp"
		"stone": return "🪨 Stone Quarry"
		"iron": return "⛓️ Iron Mine"
		"crystal": return "💎 Crystal Mine"
		_: return "📦 Resource deposit"

func _update_panel_styling() -> void:
	if not panel:
		return
		
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.08, 0.09, 0.12, 0.85) # Sleek translucent dark slate
	style.corner_radius_top_left = 6
	style.corner_radius_top_right = 6
	style.corner_radius_bottom_left = 6
	style.corner_radius_bottom_right = 6
	style.border_width_left = 2
	style.border_width_top = 2
	style.border_width_right = 2
	style.border_width_bottom = 2
	
	match resource_type.to_lower():
		"food":
			style.border_color = Color(0.3, 0.75, 0.15, 0.9) # Emerald Green
		"wood":
			style.border_color = Color(0.75, 0.45, 0.15, 0.9) # Amber Wood
		"stone":
			style.border_color = Color(0.55, 0.55, 0.55, 0.9) # Iron Grey
		"iron":
			style.border_color = Color(0.85, 0.25, 0.15, 0.9) # Rust Red
		"crystal":
			style.border_color = Color(0.75, 0.15, 0.95, 0.9) # Mystic Fuchsia
		_:
			style.border_color = Color(0.95, 0.85, 0.15, 0.9) # Golden Yellow
			
	panel.add_theme_stylebox_override("panel", style)

func _on_input_event(_viewport: Node, event: InputEvent, _shape_idx: int) -> void:
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
		_trigger_click()
	elif event is InputEventScreenTouch and event.pressed:
		_trigger_click()

func _trigger_click() -> void:
	var tween = create_tween()
	tween.set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tween.tween_property(self, "scale", scale * 1.15, 0.08)
	tween.tween_property(self, "scale", scale, 0.1)
	
	clicked.emit(self)

func _on_mouse_entered() -> void:
	_hovered = true
	modulate = Color(1.15, 1.15, 1.15, 1.0)
	queue_redraw()

func _on_mouse_exited() -> void:
	_hovered = false
	modulate = Color(1.0, 1.0, 1.0, 1.0)
	queue_redraw()

# Render beautiful vector-graphic representation of the resource node
func _draw() -> void:
	var base_color = Color.WHITE
	var glyph_color = Color.WHITE
	
	match resource_type.to_lower():
		"food":
			base_color = Color(0.1, 0.25, 0.05, 0.8) # Deep Forest
			glyph_color = Color(0.4, 0.85, 0.2, 1.0) # Lime Green
		"wood":
			base_color = Color(0.25, 0.14, 0.04, 0.8) # Deep Wood Brown
			glyph_color = Color(0.85, 0.55, 0.18, 1.0) # Rich Amber
		"stone":
			base_color = Color(0.14, 0.14, 0.18, 0.8) # Dark Slate Grey
			glyph_color = Color(0.65, 0.65, 0.75, 1.0) # Silver Slate
		"iron":
			base_color = Color(0.28, 0.08, 0.04, 0.8) # Rust Iron
			glyph_color = Color(0.9, 0.35, 0.18, 1.0) # Burnished Copper
		"crystal":
			base_color = Color(0.18, 0.04, 0.28, 0.8) # Obsidian Purple
			glyph_color = Color(0.85, 0.18, 0.95, 1.0) # Radiant Fuchsia
			
	# Ambient outline ring
	if _hovered:
		draw_circle(Vector2.ZERO, 38.0, Color(glyph_color.r, glyph_color.g, glyph_color.b, 0.3))
		draw_arc(Vector2.ZERO, 36.0, 0, TAU, 32, glyph_color, 2.5)
	else:
		draw_circle(Vector2.ZERO, 34.0, Color(glyph_color.r, glyph_color.g, glyph_color.b, 0.15))
		draw_arc(Vector2.ZERO, 32.0, 0, TAU, 32, Color(glyph_color.r, glyph_color.g, glyph_color.b, 0.6), 2.0)
		
	# Solid fill core
	draw_circle(Vector2.ZERO, 28.0, base_color)
	draw_arc(Vector2.ZERO, 28.0, 0, TAU, 32, glyph_color, 1.5)
	
	# Procedural central vector design
	match resource_type.to_lower():
		"food":
			# Wheat cluster
			draw_circle(Vector2.ZERO, 8.0, Color(0.95, 0.8, 0.2, 0.9))
			for i in range(8):
				var angle = i * (PI / 4.0)
				var dir = Vector2(cos(angle), sin(angle))
				draw_line(dir * 8.0, dir * 18.0, Color(0.95, 0.85, 0.3), 3.0)
				draw_circle(dir * 16.0, 2.5, Color(0.95, 0.7, 0.1))
		"wood":
			# Forest evergreen tree shape
			var pts1 = PackedVector2Array([Vector2(0, -20), Vector2(-12, -4), Vector2(12, -4)])
			var pts2 = PackedVector2Array([Vector2(0, -8), Vector2(-16, 8), Vector2(16, 8)])
			draw_polygon(pts1, [Color(0.12, 0.55, 0.2)])
			draw_polygon(pts2, [Color(0.08, 0.4, 0.15)])
			# Tree trunk
			draw_rect(Rect2(-3, 8, 6, 10), Color(0.42, 0.25, 0.12))
		"stone":
			# Rocky facets
			var stone_pts = PackedVector2Array([
				Vector2(0, -18), Vector2(14, 4), Vector2(10, 16),
				Vector2(-10, 16), Vector2(-14, 4)
			])
			draw_polygon(stone_pts, [Color(0.48, 0.48, 0.52)])
			# Inner cuts/facets for 3D crystalline-stone look
			draw_line(Vector2(0, -18), Vector2(0, 16), Color(0.68, 0.68, 0.72), 2.0)
			draw_line(Vector2(-14, 4), Vector2(0, 4), Color(0.68, 0.68, 0.72), 1.5)
			draw_line(Vector2(14, 4), Vector2(0, 4), Color(0.68, 0.68, 0.72), 1.5)
		"iron":
			# Crossed picks/mining axes
			draw_line(Vector2(-12, -12), Vector2(12, 12), Color(0.48, 0.32, 0.22), 3.5)
			draw_line(Vector2(12, -12), Vector2(-12, 12), Color(0.48, 0.32, 0.22), 3.5)
			# Curved metallic pick heads
			draw_arc(Vector2(-8, -8), 7, PI, PI * 1.5, 8, Color(0.78, 0.78, 0.82), 3.5)
			draw_arc(Vector2(8, -8), 7, PI * 1.5, TAU, 8, Color(0.78, 0.78, 0.82), 3.5)
			# Mineral core nugget
			draw_circle(Vector2.ZERO, 6.0, Color(0.85, 0.25, 0.15))
		"crystal":
			# Sharp obsidian crystal clusters
			var shard_center = PackedVector2Array([Vector2(0, -20), Vector2(5, 4), Vector2(0, 14), Vector2(-5, 4)])
			var shard_left = PackedVector2Array([Vector2(-10, -8), Vector2(-3, 5), Vector2(-8, 12), Vector2(-14, 3)])
			var shard_right = PackedVector2Array([Vector2(10, -8), Vector2(14, 3), Vector2(8, 12), Vector2(3, 5)])
			
			draw_polygon(shard_left, [Color(0.55, 0.1, 0.65)])
			draw_polygon(shard_right, [Color(0.55, 0.1, 0.65)])
			draw_polygon(shard_center, [Color(0.85, 0.25, 0.95)])
			# Center crystalline reflection line
			draw_line(Vector2(0, -20), Vector2(0, 14), Color(0.98, 0.78, 1.0), 1.5)

# Number abbreviation format helper (e.g. 100,000 -> "100k")
func _format_number(num: float) -> String:
	if num >= 1000000.0:
		return "%.1fM" % (num / 1000000.0)
	elif num >= 1000.0:
		return "%.0fk" % (num / 1000.0)
	return String.num(num)
