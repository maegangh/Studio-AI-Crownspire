#============================================================================
# CrystalVaultBuilding.gd - City Map Building Object (Godot 4.4)
# Attaches to the physical structure node. Detects interaction and entry triggers.
#============================================================================
extends Area2D

signal building_interacted(level: int)

@export_category("Crystal Vault Settings")
@export var building_name: String = "Crystal Vault"
@export var current_level: int = 0
@export var min_keep_level_to_build: int = 1

@onready var sprite: Sprite2D = $Sprite2D
@onready var animation_player: AnimationPlayer = $AnimationPlayer
@onready var light_glow: PointLight2D = $PointLight2D

func _ready() -> void:
	update_visual_state()
	# Connect to save manager to sync level
	if CVSaveManager:
		CVSaveManager.resonance_updated.connect(_on_resonance_updated)

## Updates glowing particles and animation states based on active levels
func update_visual_state() -> void:
	if current_level >= 1:
		# Building is constructed and functional
		modulate = Color(1.0, 1.0, 1.0, 1.0)
		if light_glow:
			light_glow.enabled = true
			light_glow.energy = 1.25 + (current_level * 0.05)
		if animation_player and animation_player.has_animation("float_glow_loop"):
			animation_player.play("float_glow_loop")
	else:
		# Building is locked/unconstructed
		modulate = Color(0.4, 0.4, 0.5, 0.8)
		if light_glow:
			light_glow.enabled = false
		if animation_player:
			animation_player.stop()

## Handles mouse clicks and touch gestures inside Godot physics matrix
func _input_event(_viewport: Viewport, event: InputEvent, _shape_idx: int) -> void:
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.is_pressed():
		print("[CrystalVaultBuilding] Registered direct click on the Crystal Vault building pedestal.")
		building_interacted.emit(current_level)
		
		if current_level < 1:
			trigger_locked_feedback()
		else:
			# Player is authorized to enter
			CrystalVaultManager.enter_crystal_vault(get_tree().root)

## Flashes red warnings if clicked while Level 0 (unconstructed)
func trigger_locked_feedback() -> void:
	print("[CrystalVaultBuilding] Lockout: Building level must be >= 1 to activate.")
	var tween := create_tween()
	tween.tween_property(self, "modulate", Color(1.0, 0.3, 0.3, 1.0), 0.15)
	tween.tween_property(self, "modulate", Color(0.4, 0.4, 0.5, 0.8), 0.15)
	
	if CrystalVaultManager:
		CrystalVaultManager.play_sfx("error_locked_structure")

func _on_resonance_updated(_new_val: int) -> void:
	# Keep rating synced if applicable
	pass

## Interface hook for administrative level forcing
func force_upgrade_level(new_level: int) -> void:
	current_level = new_level
	update_visual_state()
	print("[CrystalVaultBuilding] Level upgraded administratively to Level %d" % current_level)
