# ==============================================================================
# Crownspire MMO - Objective Node Script
# Godot 4.6 / GDScript 2.0 Clickable World Objectives and Temples on the Map
# ==============================================================================

class_name ObjectiveNode
extends Node2D

signal clicked(node: ObjectiveNode)

@export var objective_id: String = ""
@export var objective_name: String = ""
@export var objective_type: String = "temple" # temple, keep, beast_lair, watchkeep
@export var level: int = 50
@export var owner_id: String = ""
@export var rewards: Array = []

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
	notifier.rect = Rect2(-128, -128, 256, 256)
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

func setup_objective(p_id: String, p_name: String, p_type: String, lvl: int, p_owner: String, p_rewards: Array, texture: Texture2D) -> void:
	objective_id = p_id
	objective_name = p_name
	objective_type = p_type
	level = lvl
	owner_id = p_owner
	rewards = p_rewards
	
	if sprite and texture:
		sprite.texture = texture
	
	_update_visuals()

func _update_visuals() -> void:
	if label:
		var owner_text = " [%s]" % owner_id if owner_id != "" else ""
		label.text = "%s\nLvl %d%s" % [objective_name, level, owner_text]
			
	if sprite:
		match objective_type.to_lower():
			"kingdom_capital":
				sprite.modulate = Color(1.0, 0.4, 0.4, 1.0)
				scale = Vector2.ONE * 1.5
			"temple":
				sprite.modulate = Color(0.9, 0.8, 1.1, 1.0)
				scale = Vector2.ONE * 1.25
			"beast_lair":
				sprite.modulate = Color(0.6, 0.9, 0.6, 1.0)
			"watchkeep":
				sprite.modulate = Color(0.7, 0.8, 0.9, 1.0)

func _on_input_event(_viewport: Node, event: InputEvent, _shape_idx: int) -> void:
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
		_trigger_click()
	elif event is InputEventScreenTouch and event.pressed:
		_trigger_click()

func _trigger_click() -> void:
	var tween = create_tween()
	tween.set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tween.tween_property(self, "scale", scale * 1.1, 0.08)
	tween.tween_property(self, "scale", scale, 0.1)
	
	clicked.emit(self)

func _on_mouse_entered() -> void:
	_hovered = true
	modulate = Color(1.1, 1.1, 1.1, 1.0)

func _on_mouse_exited() -> void:
	_hovered = false
	modulate = Color(1.0, 1.0, 1.0, 1.0)
