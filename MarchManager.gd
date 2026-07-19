# ==============================================================================
# Crownspire MMO - March Manager Script
# Godot 4.6 / GDScript 2.0 Real-time campaign/march outbound & inbound logistics
# Optimized with Godot's native Tween engine for low overhead & mobile performance.
# ==============================================================================

class_name MarchManager
extends Node2D

signal march_action_completed(target: Node2D, success: bool)
signal march_returned_home()

@export_category("Assets")
@export var march_icon_scene: PackedScene # PackedScene containing Sprite2D representing a troop march

# Pool/Track list of active marches
var active_march_count: int = 0

# Dispatches a new march sequence across map coordinate pathways using optimized Tweens
func dispatch_march(from_pos: Vector2, target: Node2D, speed: float = 300.0, action_dur: float = 2.5) -> void:
	if not march_icon_scene:
		push_error("MarchManager: march_icon_scene asset is NULL!")
		return
		
	if not is_instance_valid(target):
		push_error("MarchManager: Attempted to march to an invalid or deleted target!")
		return
		
	var target_pos = target.global_position
	var icon_inst = march_icon_scene.instantiate() as Node2D
	icon_inst.global_position = from_pos
	
	# Add march to the Marches container if it exists, otherwise add to self
	var marches_container = get_parent().get_node_or_null("Marches")
	if marches_container:
		marches_container.add_child(icon_inst)
	else:
		# Fallback: find it relative to WorldRoot parent
		var world_root = get_parent()
		var alt_marches = world_root.get_node_or_null("Marches") if world_root else null
		if alt_marches:
			alt_marches.add_child(icon_inst)
		else:
			add_child(icon_inst)
		
	active_march_count += 1
	print("[MarchManager] Dispatching march #", active_march_count, " toward target: ", target.name)
	
	# 1. OUTBOUND PHASE
	var distance = from_pos.distance_to(target_pos)
	var travel_time = distance / speed
	
	# Look at target
	icon_inst.look_at(target_pos)
	
	var tween = create_tween()
	tween.tween_property(icon_inst, "global_position", target_pos, travel_time).set_trans(Tween.TRANS_LINEAR)
	
	# Connect finish of outbound using callable
	tween.finished.connect(func():
		_on_reach_target(icon_inst, target, from_pos, speed, action_dur)
	)

func _on_reach_target(icon: Node2D, target: Node2D, start_pos: Vector2, speed: float, action_dur: float) -> void:
	if not is_instance_valid(icon):
		return
		
	# Check if target is still valid before performing action
	if not is_instance_valid(target) or not target.visible:
		print("[MarchManager] Target was destroyed, harvested, or removed before arrival! Recalling march.")
		_return_march(icon, start_pos, speed)
		return
		
	print("[MarchManager] March reached ", target.name, ". Commencing action (", action_dur, "s)...")
	
	if target is ResourceNode:
		target.start_gathering(action_dur)
	
	# 2. ACTION PHASE (Gathering or Combat)
	var action_tween = create_tween().set_loops(clampi(int(action_dur * 2.0), 1, 10))
	# Pulse scale animation to show gathering/combat action
	action_tween.tween_property(icon, "scale", Vector2(1.25, 1.25), 0.25).set_trans(Tween.TRANS_SINE)
	action_tween.tween_property(icon, "scale", Vector2(1.0, 1.0), 0.25).set_trans(Tween.TRANS_SINE)
	
	# Use scene tree timer for precise action duration
	get_tree().create_timer(action_dur).timeout.connect(func():
		if is_instance_valid(action_tween):
			action_tween.kill()
		if is_instance_valid(icon):
			icon.scale = Vector2.ONE
			_on_action_completed(icon, target, start_pos, speed)
	)

func _on_action_completed(icon: Node2D, target: Node2D, start_pos: Vector2, speed: float) -> void:
	if not is_instance_valid(icon):
		return
		
	var success = is_instance_valid(target) and target.visible
	print("[MarchManager] Action finished. Success: ", success, ". Returning home.")
	
	# Notify kingdom manager to update resource storage / process victory rewards
	march_action_completed.emit(target, success)
	
	# 3. RETURN PHASE
	_return_march(icon, start_pos, speed)

func _return_march(icon: Node2D, start_pos: Vector2, speed: float) -> void:
	if not is_instance_valid(icon):
		return
		
	var current_pos = icon.global_position
	var distance = current_pos.distance_to(start_pos)
	var travel_time = distance / speed
	
	# Look at home position
	icon.look_at(start_pos)
	
	var return_tween = create_tween()
	return_tween.tween_property(icon, "global_position", start_pos, travel_time).set_trans(Tween.TRANS_LINEAR)
	return_tween.finished.connect(func():
		if is_instance_valid(icon):
			icon.queue_free()
		active_march_count -= 1
		march_returned_home.emit()
		print("[MarchManager] March returned safely to Castle. Active marches left: ", active_march_count)
	)
