# ==============================================================================
# Crownspire MMO - Wildling Monster Node Script
# Godot 4.6 / GDScript 2.0 Clickable Enemy Monster Node for World Map
# ==============================================================================

class_name WildlingNode
extends Node2D

signal clicked(node: WildlingNode)

@export var level: int = 1
@export var power_rating: int = 2500
@export var species: String = "Wolf"
@export var card_texture: Texture2D # Texture for detailed monster profile cards

var metadata: Dictionary = {}

@onready var sprite: Sprite2D = $Sprite2D
@onready var click_area: Area2D = $ClickArea

var _hovered: bool = false

func _ready() -> void:
	if click_area:
		click_area.input_event.connect(_on_input_event)
		click_area.mouse_entered.connect(_on_mouse_entered)
		click_area.mouse_exited.connect(_on_mouse_exited)
	_setup_screen_notifier()

func _setup_screen_notifier() -> void:
	var notifier = VisibleOnScreenNotifier2D.new()
	notifier.rect = Rect2(-48, -48, 96, 96)
	notifier.screen_entered.connect(_on_screen_entered)
	notifier.screen_exited.connect(_on_screen_exited)
	add_child(notifier)

func _on_screen_entered() -> void:
	if sprite:
		sprite.visible = true
	if click_area:
		click_area.monitoring = true
		click_area.monitorable = true

func _on_screen_exited() -> void:
	if sprite:
		sprite.visible = false
	if click_area:
		click_area.monitoring = false
		click_area.monitorable = false

# Dynamic assembly of levels, species, power ratings, and textures
func setup_node(lvl: int, p_species: String, p_power: int, tex: Texture2D, card_tex: Texture2D, p_metadata: Dictionary = {}) -> void:
	level = lvl
	species = p_species
	power_rating = p_power
	card_texture = card_tex
	metadata = p_metadata
	
	if tex:
		sprite.texture = tex
	else:
		push_error("WildlingNode: Null sprite texture supplied for level " + str(lvl) + " species " + species)
		
	# Stagger wildling animations slightly if using an animated sprite, or subtle rotation variations
	rotation = randf_range(-0.05, 0.05)
	scale = Vector2.ONE * randf_range(0.95, 1.1)

func _on_input_event(_viewport: Node, event: InputEvent, _shape_idx: int) -> void:
	# Robust PC and Mobile click checking
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
		_trigger_click()
	elif event is InputEventScreenTouch and event.pressed:
		_trigger_click()

func _trigger_click() -> void:
	# High-feedback visual feedback scaling
	var tween = create_tween()
	tween.set_trans(Tween.TRANS_ELASTIC).set_ease(Tween.EASE_OUT)
	tween.tween_property(self, "scale", scale * 1.2, 0.1)
	tween.tween_property(self, "scale", scale, 0.15)
	
	clicked.emit(self)

func _on_mouse_entered() -> void:
	_hovered = true
	modulate = Color(1.2, 0.9, 0.9, 1.0) # Reddish aggressive highlight

func _on_mouse_exited() -> void:
	_hovered = false
	modulate = Color(1.0, 1.0, 1.0, 1.0)
