# ==============================================================================
# Crownspire MMO - Ancient Beast Lair World Map Object Script
# Godot 4.6 / GDScript 2.0 Interactive World Map Landmark (Lair)
# ==============================================================================

class_name AncientBeastLair
extends Node2D

signal clicked(lair: AncientBeastLair)
signal hovered_changed(is_hovered: bool)

@export_category("Lair Config")
@export var lair_id: String = "northern_wolf_den"
@export var lair_type: String = "ancient_wolf_den" # Matches the JSON type
@export var level: int = 1
@export var beast_id: String = "dire_wolf_alpha"

@export_category("Visual Assets")
@export var custom_glow_color: Color = Color(0.23, 0.51, 0.96, 0.45) # Sapphire/Blue glow default
@export var lair_name: String = "Ancient Wolf Den"

var is_scouted: bool = false
var active_rallies_count: int = 0

@onready var sprite: Sprite2D = $Sprite2D
@onready var click_area: Area2D = $ClickArea
@onready var glow_particles: GPUParticles2D = $GlowParticles
@onready var mist_particles: GPUParticles2D = $MistParticles
@onready var hover_ring: Sprite2D = $HoverRing

var _hovered: bool = false

func _ready() -> void:
	if click_area:
		click_area.input_event.connect(_on_input_event)
		click_area.mouse_entered.connect(_on_mouse_entered)
		click_area.mouse_exited.connect(_on_mouse_exited)
	
	if hover_ring:
		hover_ring.visible = false
		
	_initialize_lair_visuals()

func _initialize_lair_visuals() -> void:
	# Configure particle systems and shaders based on the specific Lair Type
	match lair_type:
		"ancient_wolf_den":
			custom_glow_color = Color(0.23, 0.51, 0.96, 0.7) # Royal sapphire blue
		"crystal_spider_nest":
			custom_glow_color = Color(0.66, 0.36, 0.96, 0.8) # Purple magical glow
		"great_bear_cavern":
			custom_glow_color = Color(0.85, 0.47, 0.02, 0.7) # Warm gold/amber
		"stone_troll_stronghold":
			custom_glow_color = Color(0.96, 0.25, 0.37, 0.7) # Volcanic/Crimson glow
		"ancient_dragon_cavern":
			custom_glow_color = Color(0.94, 0.27, 0.27, 0.9) # Pure magma fire glow
			
	if glow_particles:
		var process_material = glow_particles.process_material
		if process_material and "color" in process_material:
			process_material.color = custom_glow_color

func _on_input_event(_viewport: Node, event: InputEvent, _shape_idx: int) -> void:
	if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
		emit_signal("clicked", self)
		_trigger_click_ripple_vfx()

func _on_mouse_entered() -> void:
	_hovered = true
	if hover_ring:
		hover_ring.visible = true
	emit_signal("hovered_changed", true)

func _on_mouse_exited() -> void:
	_hovered = false
	if hover_ring:
		hover_ring.visible = false
	emit_signal("hovered_changed", false)

func _trigger_click_ripple_vfx() -> void:
	# Quick scale visual bounce
	var tween = create_tween().set_ease(Tween.EASE_OUT).set_trans(Tween.TRANS_ELASTIC)
	tween.tween_property(self, "scale", Vector2(1.1, 1.1), 0.1)
	tween.tween_property(self, "scale", Vector2(1.0, 1.0), 0.15)

# Returns detailed data dictionary formatted for UI consumption
func get_lair_data() -> Dictionary:
	return {
		"id": lair_id,
		"type": lair_type,
		"level": level,
		"beast_id": beast_id,
		"name": lair_name,
		"is_scouted": is_scouted,
		"active_rallies": active_rallies_count
	}
