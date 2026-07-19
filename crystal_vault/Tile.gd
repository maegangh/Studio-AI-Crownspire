#============================================================================
# Tile.gd - Individual puzzle tile node controller (Godot 4.4)
# Handles selection, hovering state highlights, blocking shading, and fly-to animations.
#============================================================================
extends Area2D

signal tile_clicked(tile_instance: Node)

@export var type_id: String = ""
@export var grid_x: float = 0.0
@export var grid_y: float = 0.0
@export var layer_z: int = 0

var is_blocked: bool = false
var is_hinted: bool = false

@onready var sprite: Sprite2D = $Sprite2D
@onready var label_symbol: Label = $Label2D # Custom text layer for accessibility symbols
@onready var border_highlight: Line2D = $Line2D

func _ready() -> void:
	update_appearance()

## Adjusts color modulate, transparency, and outline scales based on active states
func update_appearance() -> void:
	# Configure visual indicators and colors procedurally based on type_id
	var symbol := "?"
	var bg_color := Color(0.18, 0.18, 0.24, 1.0) # Slate default
	
	match type_id:
		"solar_fire":
			symbol = "🔥"
			bg_color = Color(0.4, 0.15, 0.1, 1.0) # Fiery Crimson/Orange
		"glacial_frost":
			symbol = "❄️"
			bg_color = Color(0.1, 0.25, 0.45, 1.0) # Icy Blue
		"emerald_nature":
			symbol = "🌿"
			bg_color = Color(0.1, 0.35, 0.18, 1.0) # Forest Green
		"astral_light":
			symbol = "⭐"
			bg_color = Color(0.45, 0.38, 0.1, 1.0) # Cosmic Gold
		"amber_earth":
			symbol = "💎"
			bg_color = Color(0.3, 0.15, 0.4, 1.0) # Amethyst Purple
		"runic_compass":
			symbol = "🌀"
			bg_color = Color(0.1, 0.35, 0.35, 1.0) # Runic Cyan
			
	if label_symbol:
		label_symbol.text = symbol
		
	var bg = get_node_or_null("Background")
	if bg and bg is ColorRect:
		bg.color = bg_color

	if is_blocked:
		# Blocked (unselectable) tiles are shaded, desaturated, and darkened
		modulate = Color(0.35, 0.35, 0.4, 0.65)
		if border_highlight:
			border_highlight.visible = false
	else:
		# Unblocked interactive tiles
		modulate = Color(1.0, 1.0, 1.0, 1.0)
		if border_highlight:
			border_highlight.visible = is_hinted
			if is_hinted:
				border_highlight.default_color = Color(0.8, 0.5, 1.0, 1.0) # Pulsing violet hint outline

## Handles Area2D touch and hover mouse bindings in physics pipeline
func _input_event(_viewport: Viewport, event: InputEvent, _shape_idx: int) -> void:
	if is_blocked:
		return
		
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.is_pressed():
		tile_clicked.emit(self)
		play_selection_pop_animation()

## Applies hover indicators for cursor guidance
func _mouse_enter() -> void:
	if not is_blocked and border_highlight:
		border_highlight.visible = true
		border_highlight.default_color = Color(1.0, 1.0, 1.0, 0.8)

func _mouse_exit() -> void:
	if not is_blocked and not is_hinted and border_highlight:
		border_highlight.visible = false

## Plays tiny responsive elastic bounce scale tween when clicked
func play_selection_pop_animation() -> void:
	var tween := create_tween().set_ease(Tween.EASE_OUT).set_trans(Tween.TRANS_ELASTIC)
	tween.tween_property(self, "scale", Vector2(1.15, 1.15), 0.1)
	tween.tween_property(self, "scale", Vector2(1.0, 1.0), 0.15)

## Smoothly translates tile coordinate node into the tray slot
func animate_fly_to_target(target_global_position: Vector2, completion_callback: Callable) -> void:
	# Disable collisions during translation
	$CollisionShape2D.disabled = true
	z_index = 100 # Put on top of entire board depth stack
	
	var tween := create_tween().set_parallel(true).set_ease(Tween.EASE_IN_OUT).set_trans(Tween.TRANS_CUBIC)
	tween.tween_property(self, "global_position", target_global_position, 0.35)
	tween.tween_property(self, "scale", Vector2(0.75, 0.75), 0.35) # shrink slightly to fit tray scale
	
	# Trigger cleanup callback upon arrival
	tween.chain().tween_callback(completion_callback)

## Interfaces for high contrast overlays and shape accessibility settings
func set_accessibility_symbol(symbol_char: String) -> void:
	if label_symbol:
		label_symbol.text = symbol_char
