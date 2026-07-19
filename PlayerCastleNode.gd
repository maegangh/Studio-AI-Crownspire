# ==============================================================================
# Crownspire MMO - Player Castle Node Script
# Godot 4.6 / GDScript 2.0 Clickable Player Castle on the World Map
# ==============================================================================

class_name PlayerCastleNode
extends Node2D

signal clicked(node: PlayerCastleNode)

@export var player_name: String = "Lord Aurelius"
@export var alliance_tag: String = "DAWN"
@export var level: int = 15
@export var power: int = 250000
@export var is_player_own: bool = false

@onready var sprite: Sprite2D = $Sprite2D
@onready var click_area: Area2D = $ClickArea
@onready var label: Label = $Label

var _hovered: bool = false

func _ready() -> void:
	if click_area:
		click_area.input_event.connect(_on_input_event)
		click_area.mouse_entered.connect(_on_mouse_entered)
		click_area.mouse_exited.connect(_on_mouse_exited)
	
	_update_visuals()
	_setup_screen_notifier()

func _setup_screen_notifier() -> void:
	var notifier = VisibleOnScreenNotifier2D.new()
	notifier.rect = Rect2(-64, -64, 128, 128)
	notifier.screen_entered.connect(_on_screen_entered)
	notifier.screen_exited.connect(_on_screen_exited)
	add_child(notifier)

func _on_screen_entered() -> void:
	if sprite: sprite.visible = true
	if label: label.visible = true
	if click_area:
		click_area.monitoring = true
		click_area.monitorable = true

func _on_screen_exited() -> void:
	if sprite: sprite.visible = false
	if label: label.visible = false
	if click_area:
		click_area.monitoring = false
		click_area.monitorable = false

func setup_castle(p_name: String, p_tag: String, lvl: int, p_power: int, own: bool, texture: Texture2D) -> void:
	player_name = p_name
	alliance_tag = p_tag
	level = lvl
	power = p_power
	is_player_own = own
	
	if sprite and texture:
		sprite.texture = texture
	
	_update_visuals()

func _update_visuals() -> void:
	if label:
		if alliance_tag != "":
			label.text = "[%s] %s\nLvl %d" % [alliance_tag, player_name, level]
		else:
			label.text = "%s\nLvl %d" % [player_name, level]
			
	if sprite:
		if is_player_own:
			sprite.modulate = Color(0.4, 0.7, 1.0, 1.0) # Vibrant sapphire highlight
		else:
			sprite.modulate = Color(1.0, 0.85, 0.5, 1.0) # Royal gold highlights

func _on_input_event(_viewport: Node, event: InputEvent, _shape_idx: int) -> void:
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
		_trigger_click()
	elif event is InputEventScreenTouch and event.pressed:
		_trigger_click()

func _trigger_click() -> void:
	var tween = create_tween()
	tween.set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tween.tween_property(self, "scale", Vector2(1.15, 1.15), 0.08)
	tween.tween_property(self, "scale", Vector2(1.0, 1.0), 0.1)
	
	clicked.emit(self)

func _on_mouse_entered() -> void:
	_hovered = true
	if is_player_own:
		modulate = Color(1.1, 1.2, 1.3, 1.0)
	else:
		modulate = Color(1.2, 1.1, 0.9, 1.0)

func _on_mouse_exited() -> void:
	_hovered = false
	modulate = Color(1.0, 1.0, 1.0, 1.0)
