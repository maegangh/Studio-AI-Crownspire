# ==============================================================================
# Crownspire MMO - Resource Spawn Manager Script
# Godot 4.6 / GDScript 2.0 Deterministic resource spawn coordinator with object pooling
# ==============================================================================

class_name ResourceSpawnManager
extends Node

signal resource_node_clicked(node: ResourceNode)

@export_category("Asset Configs")
@export var resource_node_scene: PackedScene

@export_group("Textures")
@export var food_texture: Texture2D
@export var wood_texture: Texture2D
@export var stone_texture: Texture2D
@export var iron_texture: Texture2D
@export var crystal_texture: Texture2D

@export_category("Spawning Balance")
@export var respawn_interval_sec: float = 35.0
@export var initial_spawn_fill_ratio: float = 0.55 # Fill 55% of max limits on startup

# AAA Resource levels to quantity maps (Levels 1-10)
const QUANTITY_BY_LEVEL = {
	1: 10000,
	2: 25000,
	3: 50000,
	4: 100000,
	5: 180000,
	6: 350000,
	7: 650000,
	8: 1200000,
	9: 2500000,
	10: 5000000
}

# Object Pool structures
var _pool: Array[ResourceNode] = []
var _active_nodes: Array[ResourceNode] = []
var _regions: Array[KingdomSpawnRegion] = []
var _respawn_timer: Timer
var _spawns_container: Node2D

func _ready() -> void:
	_respawn_timer = Timer.new()
	_respawn_timer.wait_time = respawn_interval_sec
	_respawn_timer.autostart = true
	_respawn_timer.timeout.connect(_on_respawn_timeout)
	add_child(_respawn_timer)
	
	# Try to locate the ResourceSpawns Node2D container for holding active nodes
	var parent = get_parent()
	if parent:
		_spawns_container = parent.get_node_or_null("ResourceSpawns") as Node2D

# Initializes deterministic region-based spawning
func initialize_spawning(regions: Array[KingdomSpawnRegion], random_seed: int) -> void:
	seed(random_seed) # Seed RNG for determinism
	_regions = regions
	
	# Pre-populate object pool with initial cache of nodes to prevent frame drops on mobile
	_warm_pool(150)
	
	# Initial spawn pass to make map feel alive instantly
	for region in _regions:
		if region.region_type != "Resource":
			continue
		var target_count = clampi(int(region.max_active_spawns * initial_spawn_fill_ratio), 1, region.max_active_spawns)
		for i in range(target_count):
			spawn_resource_in_region(region)

# Pool warmer
func _warm_pool(size: int) -> void:
	if not resource_node_scene:
		push_error("ResourceSpawnManager: ResourceNode scene asset is NOT assigned!")
		return
		
	for i in range(size):
		var node = resource_node_scene.instantiate() as ResourceNode
		node.visible = false
		node.clicked.connect(_on_node_clicked)
		
		# Add to the dedicated visual container if available, otherwise fallback to the parent
		if _spawns_container:
			_spawns_container.add_child(node)
		else:
			var parent = get_parent()
			if parent:
				parent.add_child.call_deferred(node)
				
		_pool.append(node)

# Get node from pool or instantiate if exhausted
func _get_pooled_node() -> ResourceNode:
	for node in _pool:
		if not node.visible:
			node.visible = true
			return node
			
	# Exhausted pool, scale dynamically
	var node = resource_node_scene.instantiate() as ResourceNode
	node.clicked.connect(_on_node_clicked)
	if _spawns_container:
		_spawns_container.add_child(node)
	else:
		var parent = get_parent()
		if parent:
			parent.add_child(node)
	_pool.append(node)
	node.visible = true
	return node

# Cleanses and recycles a resource node
func recycle_node(node: ResourceNode) -> void:
	var node_region: KingdomSpawnRegion = null
	for region in _regions:
		if region.active_spawns.has(node):
			node_region = region
			region.active_spawns.erase(node)
			break
			
	if _active_nodes.has(node):
		_active_nodes.erase(node)
		
	node.reset_gathering() # Fully reset gathering states
	node.visible = false
	# Relocate offsite safely
	node.global_position = Vector2(-99999, -99999)
	
	# AAA Respawn trigger: schedule a replacement in the same region after a brief aesthetic delay!
	if node_region:
		get_tree().create_timer(randf_range(1.5, 3.5)).timeout.connect(func():
			if is_instance_valid(node_region):
				spawn_resource_in_region(node_region)
		)

# Core Spawn Calculation
func spawn_resource_in_region(region: KingdomSpawnRegion) -> void:
	if not region.can_spawn_more():
		return
		
	var allowed_types = region.allowed_spawn_types
	if allowed_types.is_empty():
		allowed_types = ["food", "wood", "stone", "iron", "crystal"]
		
	var type = allowed_types[randi() % allowed_types.size()]
	
	# Determine level (1-10 scale)
	var level = randi_range(region.min_level, region.max_level)
	level = clampi(level, 1, 10)
	var amount = QUANTITY_BY_LEVEL.get(level, 10000)
	
	var tex: Texture2D = null
	match type.to_lower():
		"food": tex = food_texture
		"wood": tex = wood_texture
		"stone": tex = stone_texture
		"iron": tex = iron_texture
		"crystal": tex = crystal_texture
		_: tex = food_texture
		
	# AAA Verification loop: find a safe coordinate in the spawn region
	var spawn_pos = Vector2.ZERO
	var found_safe = false
	var kingdom_mgr = get_node_or_null("../KingdomManager")
	
	for attempt in range(60):
		var test_pos = region.get_random_spawn_point()
		if kingdom_mgr:
			if kingdom_mgr.is_spawn_position_safe(test_pos, 110.0):
				spawn_pos = test_pos
				found_safe = true
				break
		else:
			spawn_pos = test_pos
			found_safe = true
			break
			
	if not found_safe:
		# Skipped to strictly respect collision guidelines (prevent overlap/mountain/river/road spawning)
		return
		
	var node = _get_pooled_node()
	node.global_position = spawn_pos
	node.setup_node(type, level, amount, tex)
	_active_nodes.append(node)
	region.register_spawn(node)

func _on_node_clicked(node: ResourceNode) -> void:
	resource_node_clicked.emit(node)

func _on_respawn_timeout() -> void:
	# Keep the kingdom alive with a steady influx of nodes
	for region in _regions:
		if region.region_type == "Resource" and region.can_spawn_more():
			# Chance based on spawn weight
			if randf() <= region.spawn_weight * 0.4:
				spawn_resource_in_region(region)
