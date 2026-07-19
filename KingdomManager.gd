# ==============================================================================
# Crownspire MMO - Kingdom Manager Script (Main World Map Coordinator)
# Godot 4.6 / GDScript 2.0 Central orchestrator for maps, events & campaign columns
# ==============================================================================

class_name KingdomManager
extends Node

@export_category("Core Game Balance")
@export var random_seed: int = 423851
@export var player_castle_position: Vector2 = Vector2(-800, 600) # Base starting coordinates
@export var royal_keep_position: Vector2 = Vector2.ZERO          # Map center focal coordinate

@export_category("Sub-Managers Paths")
@export var resource_spawner: ResourceSpawnManager
@export var wildling_spawner: WildlingSpawnManager
@export var march_manager: MarchManager

@export_category("Region Roots")
@export var resource_regions_root: Node2D
@export var wildling_regions_root: Node2D

# Event tracking
signal display_resource_panel(node: ResourceNode)
signal display_wildling_panel(node: WildlingNode)
signal display_castle_panel(node: PlayerCastleNode)
signal display_alliance_building_panel(node: AllianceBuildingNode)
signal display_objective_panel(node: ObjectiveNode)

const PLAYER_CASTLE_SCENE = preload("res://PlayerCastleNode.tscn")
const ALLIANCE_BUILD_SCENE = preload("res://AllianceBuildingNode.tscn")
const OBJECTIVE_SCENE = preload("res://ObjectiveNode.tscn")

var _all_regions: Array[KingdomSpawnRegion] = []
var _is_event_multiplier_active: bool = false
var _active_kingdom_id: int = 1

# Stored World Objectives from ObjectiveLayer
var objectives: Dictionary = {} # Maps unique node name -> global_position Vector2

# Dynamic spawned lists
var _spawned_castles: Array[PlayerCastleNode] = []
var _spawned_alliance_structures: Array[AllianceBuildingNode] = []
var _spawned_objectives: Array[ObjectiveNode] = []

# Terrain color map image cache
var _map_image: Image = null

func _ready() -> void:
	print("[KingdomManager] Initializing Crownspire Realm Maps...")
	_load_map_image()
	_gather_objectives()
	_gather_spawn_regions()
	_validate_and_link_subsystems()
	
	# Launch state initialization
	initialize_kingdom(_active_kingdom_id, random_seed)

func _load_map_image() -> void:
	var tex = load("res://world_map.png")
	if tex is Texture2D:
		_map_image = tex.get_image()
		if _map_image:
			print("[KingdomManager] Loaded map image for terrain color verification: ", _map_image.get_width(), "x", _map_image.get_height())

# Gather and register all Marker2D objectives inside ObjectiveLayer
func _gather_objectives() -> void:
	objectives.clear()
	var parent = get_parent()
	if parent:
		var obj_layer = parent.get_node_or_null("ObjectiveLayer")
		if obj_layer:
			for child in obj_layer.get_children():
				if child is Marker2D:
					objectives[child.name] = child.global_position
					print("[KingdomManager] Registered Objective: ", child.name, " at coordinate ", child.global_position)
		else:
			push_error("[KingdomManager] ObjectiveLayer node not found under parent!")

# Gather collision-defined area spawn regions
func _gather_spawn_regions() -> void:
	_all_regions.clear()
	
	if resource_regions_root:
		for child in resource_regions_root.get_children():
			if child is KingdomSpawnRegion:
				_all_regions.append(child)
				
	if wildling_regions_root:
		for child in wildling_regions_root.get_children():
			if child is KingdomSpawnRegion:
				_all_regions.append(child)
				
	print("[KingdomManager] Total spawn zones registered: ", _all_regions.size())

# Secure reference hookups
func _validate_and_link_subsystems() -> void:
	if not resource_spawner:
		resource_spawner = get_node_or_null("../ResourceSpawnManager") as ResourceSpawnManager
	if not wildling_spawner:
		wildling_spawner = get_node_or_null("../WildlingSpawnManager") as WildlingSpawnManager
	if not march_manager:
		march_manager = get_node_or_null("../MarchManager") as MarchManager
		
	if resource_spawner:
		resource_spawner.resource_node_clicked.connect(_on_resource_node_clicked)
	else:
		push_error("[KingdomManager] Fatal: ResourceSpawnManager reference is unassigned!")
		
	if wildling_spawner:
		wildling_spawner.wildling_node_clicked.connect(_on_wildling_node_clicked)
	else:
		push_error("[KingdomManager] Fatal: WildlingSpawnManager reference is unassigned!")
		
	if march_manager:
		march_manager.march_action_completed.connect(_on_march_action_completed)
	else:
		push_error("[KingdomManager] Fatal: MarchManager reference is unassigned!")

# Initiates a specific kingdom grid layout deterministically
func initialize_kingdom(kingdom_id: int, seed_value: int) -> void:
	_active_kingdom_id = kingdom_id
	var kingdom_seed = seed_value + (kingdom_id * 1000)
	
	print("[KingdomManager] Formatting Kingdom Guild Grid #", kingdom_id, " using seed: ", kingdom_seed)
	
	# Clear previous spawned elements
	_clear_previously_spawned()
	
	# Dispatch initialization triggers
	if resource_spawner:
		resource_spawner.initialize_spawning(_all_regions, kingdom_seed)
	if wildling_spawner:
		wildling_spawner.initialize_spawning(_all_regions, kingdom_seed, royal_keep_position)
		
	# Spawn player and alliance castles spread across the kingdom map
	_spawn_players_castles()
	_spawn_alliance_buildings()
	_wrap_world_objectives()

func _clear_previously_spawned() -> void:
	for node in _spawned_castles:
		if is_instance_valid(node): node.queue_free()
	_spawned_castles.clear()
	
	for node in _spawned_alliance_structures:
		if is_instance_valid(node): node.queue_free()
	_spawned_alliance_structures.clear()
	
	for node in _spawned_objectives:
		if is_instance_valid(node): node.queue_free()
	_spawned_objectives.clear()

# Load and parse local JSON file with robust checking
func _load_json_file(file_path: String) -> Variant:
	if not FileAccess.file_exists(file_path):
		print("[KingdomManager] Info: File not found: ", file_path)
		return null
	var file = FileAccess.open(file_path, FileAccess.READ)
	if not file:
		return null
	var content = file.get_as_text()
	file.close()
	var json = JSON.new()
	var error = json.parse(content)
	if error == OK:
		return json.data
	else:
		print("[KingdomManager] JSON parse error: ", json.get_error_message(), " in file ", file_path)
		return null

func _is_terrain_blocked(pos: Vector2) -> bool:
	# 1. GEOGRAPHIC MATHEMATICAL BOUNDS & PATHWAY CHECKS (Extremely robust fallbacks)
	
	# Radial center (Royal Keep focal area) & Outer mountain boundary
	var dist_from_center = pos.length()
	if dist_from_center < 150.0: # Protect the central Keep zone
		return true
	if dist_from_center > 1100.0: # Protect the extreme mountainous outer border
		return true
		
	# Mountain peak circles
	# Mountain Range A (North East peaks)
	if pos.distance_to(Vector2(450.0, -450.0)) < 150.0:
		return true
	# Mountain Range B (North West ridges)
	if pos.distance_to(Vector2(-600.0, -300.0)) < 180.0:
		return true
	# Mountain Range C (Southern Crags)
	if pos.distance_to(Vector2(100.0, 750.0)) < 160.0:
		return true
		
	# Rivers (Mathematical Sine curves)
	# River 1 (Northern winding fork)
	var river1_y = -pos.x * 0.4 + sin(pos.x / 90.0) * 45.0 - 250.0
	if abs(pos.y - river1_y) < 45.0:
		return true
	# River 2 (Southern flowing river)
	var river2_y = pos.x * 0.6 + cos(pos.x / 120.0) * 55.0 + 350.0
	if abs(pos.y - river2_y) < 45.0:
		return true
		
	# Roads (Direct arterial paths)
	# Horizontal Highway
	if abs(pos.y) < 35.0:
		return true
	# Vertical Highway
	if abs(pos.x) < 35.0:
		return true
	# Diagonal Trade Path
	if abs(pos.y - pos.x) < 35.0:
		return true
		
	# 2. PIXEL-COLOR SAMPLE CHECKING (Dynamic runtime terrain checking)
	if _map_image:
		# Map from world space (-1200 to 1200) to pixel space (0 to width)
		var img_w = _map_image.get_width()
		var img_h = _map_image.get_height()
		
		var px = int((pos.x + 1200.0) * (img_w / 2400.0))
		var py = int((pos.y + 1200.0) * (img_h / 2400.0))
		
		# Ensure we stay strictly inside image boundaries
		px = clampi(px, 0, img_w - 1)
		py = clampi(py, 0, img_h - 1)
		
		var color = _map_image.get_pixel(px, py)
		
		# A. RIVER/WATER: Saturated blue dominant
		if color.b > 0.42 and color.b > color.r * 1.15 and color.b > color.g * 1.1:
			return true
			
		# B. MOUNTAIN PEAK SNOWCAPS: High intensity white
		if color.r > 0.62 and color.g > 0.62 and color.b > 0.62:
			return true
			
		# C. MOUNTAIN STONE RIDGE: Grayish/slate shades
		if color.r > 0.24 and color.g > 0.22 and color.b > 0.18 and abs(color.r - color.g) < 0.05 and abs(color.g - color.b) < 0.05:
			return true
			
		# D. ROAD/PATHS: Beige/tan trade paths or grey cobble shades
		# Beige/Tan path
		if color.r > 0.52 and color.g > 0.46 and color.b > 0.32 and color.b < 0.52 and abs(color.r - color.g) < 0.08:
			return true
		# Grey path
		if color.r > 0.35 and color.g > 0.35 and color.b > 0.35 and color.r < 0.5 and color.g < 0.5 and color.b < 0.5 and abs(color.r - color.g) < 0.03:
			return true
			
	return false

func is_spawn_position_safe(pos: Vector2, min_dist: float = 110.0) -> bool:
	# 1. Terrain Blocked Check (Never spawn on mountains, rivers, or roads)
	if _is_terrain_blocked(pos):
		return false

	# 2. Check against starting position
	if pos.distance_to(player_castle_position) < min_dist * 1.5:
		return false
		
	# 3. Check against other resource nodes
	if resource_spawner:
		for active_node in resource_spawner._active_nodes:
			if is_instance_valid(active_node) and active_node.global_position.distance_to(pos) < min_dist:
				return false
				
	# 4. Check against other wildlings
	if wildling_spawner:
		for active_node in wildling_spawner._active_nodes:
			if is_instance_valid(active_node) and active_node.global_position.distance_to(pos) < min_dist:
				return false
				
	# 5. Check against spawned player castles
	for castle in _spawned_castles:
		if is_instance_valid(castle) and castle.global_position.distance_to(pos) < min_dist:
			return false
			
	# 6. Check against spawned alliance structures (Never spawn inside alliance territory)
	for struct in _spawned_alliance_structures:
		if is_instance_valid(struct) and struct.global_position.distance_to(pos) < 250.0:
			return false
			
	# 7. Check against static world objectives
	for obj_pos in objectives.values():
		if obj_pos.distance_to(pos) < min_dist * 1.8:
			return false
			
	return true

func _find_random_safe_position(radius: float = 900.0, min_dist: float = 120.0) -> Vector2:
	var pos = Vector2.ZERO
	for attempt in range(50):
		var angle = randf_range(0, TAU)
		var dist = randf_range(200, radius)
		pos = royal_keep_position + Vector2(cos(angle) * dist, sin(angle) * dist)
		if is_spawn_position_safe(pos, min_dist):
			return pos
	return pos # fallback

func _spawn_players_castles() -> void:
	# Spawn player's own castle first
	var own_castle = PLAYER_CASTLE_SCENE.instantiate() as PlayerCastleNode
	get_parent().add_child.call_deferred(own_castle)
	own_castle.global_position = player_castle_position
	own_castle.setup_castle("My Lord", "DAWN", 30, 2450000, true, load("res://world_map.png"))
	own_castle.clicked.connect(_on_castle_clicked)
	_spawned_castles.append(own_castle)
	
	# Load players list from JSON
	var players_data = _load_json_file("res://data/players.json")
	if players_data is Array:
		for player in players_data:
			var p_name = player.get("name", "Unknown Lord")
			var p_tag = player.get("alliance_tag", "")
			var p_power = player.get("power", 100000)
			var vip = player.get("vip_level", 1)
			
			var spawn_pos = _find_random_safe_position(950.0, 130.0)
			
			var castle = PLAYER_CASTLE_SCENE.instantiate() as PlayerCastleNode
			get_parent().add_child.call_deferred(castle)
			castle.global_position = spawn_pos
			castle.setup_castle(p_name, p_tag, int(vip * 4), int(p_power), false, load("res://world_map.png"))
			castle.clicked.connect(_on_castle_clicked)
			_spawned_castles.append(castle)

func _spawn_alliance_buildings() -> void:
	var alliance_blds_data = _load_json_file("res://data/alliance_buildings.json")
	if alliance_blds_data is Array:
		for bld in alliance_blds_data:
			var bld_id = bld.get("id", "bld_tower")
			var bld_name = bld.get("name", "Alliance Tower")
			var lvl = bld.get("level", 1)
			var status = bld.get("status", "Operational")
			
			# Spawn near an Alliance HQ Marker2D
			var base_pos = royal_keep_position
			for obj_name in objectives.keys():
				if obj_name.begins_with("AllianceHQ"):
					base_pos = objectives[obj_name]
					break
			
			var spawn_pos = base_pos + Vector2(randf_range(-150, 150), randf_range(-150, 150))
			for attempt in range(15):
				if is_spawn_position_safe(spawn_pos, 90.0):
					break
				spawn_pos = base_pos + Vector2(randf_range(-150, 150), randf_range(-150, 150))
				
			var node = ALLIANCE_BUILD_SCENE.instantiate() as AllianceBuildingNode
			get_parent().add_child.call_deferred(node)
			node.global_position = spawn_pos
			node.setup_building(bld_id, bld_name, lvl, "DAWN", status, load("res://world_map.png"))
			node.clicked.connect(_on_alliance_building_clicked)
			_spawned_alliance_structures.append(node)

func _wrap_world_objectives() -> void:
	var spawn_db = _load_json_file("res://public/world_map_spawn_database.json")
	var objective_map = {}
	if spawn_db is Array:
		for item in spawn_db:
			var item_id = item.get("id", "")
			if item_id != "":
				objective_map[item_id] = item
				
	var parent = get_parent()
	if not parent:
		return
		
	var obj_layer = parent.get_node_or_null("ObjectiveLayer")
	if obj_layer:
		for child in obj_layer.get_children():
			if child is Marker2D:
				var name_key = child.name.to_lower()
				var display_name = child.name.replace("_", " ").capitalize()
				var level = 50
				var obj_type = "temple"
				var owner = ""
				var rewards_list = []
				
				var db_match = null
				if name_key.contains("keep") or name_key.contains("throne") or name_key.contains("royal"):
					obj_type = "kingdom_capital" if name_key.contains("royal") else "watchkeep"
					db_match = objective_map.get("cap_crownspire_throne")
				elif name_key.contains("temple"):
					obj_type = "temple"
					if name_key.contains("1"): db_match = objective_map.get("temple_1")
					elif name_key.contains("2"): db_match = objective_map.get("temple_2")
					elif name_key.contains("3"): db_match = objective_map.get("temple_3")
					elif name_key.contains("4"): db_match = objective_map.get("temple_4")
				elif name_key.contains("beast") or name_key.contains("lair"):
					obj_type = "beast_lair"
					
				if db_match:
					display_name = db_match.get("name", display_name)
					level = int(db_match.get("level", level))
					owner = db_match.get("ownerId", owner) if db_match.get("ownerId") != null else ""
					rewards_list = db_match.get("rewards", rewards_list)
				
				var node = OBJECTIVE_SCENE.instantiate() as ObjectiveNode
				parent.add_child.call_deferred(node)
				node.global_position = child.global_position
				node.setup_objective(child.name, display_name, obj_type, level, owner, rewards_list, load("res://world_map.png"))
				node.clicked.connect(_on_objective_clicked)
				_spawned_objectives.append(node)
				child.visible = false

# Sends a standard gathering/war march column
func dispatch_march_to_node(target: Node2D) -> void:
	if not march_manager:
		push_error("[KingdomManager] MarchManager unavailable to send column.")
		return
		
	var speed = 350.0
	var action_time = 3.0
	
	if target is ResourceNode:
		speed = 400.0
		action_time = 4.0
	elif target is WildlingNode:
		speed = 320.0
		action_time = 1.5
	elif target is PlayerCastleNode:
		speed = 380.0
		action_time = 3.5
	elif target is AllianceBuildingNode:
		speed = 360.0
		action_time = 3.0
	elif target is ObjectiveNode:
		speed = 340.0
		action_time = 5.0
		
	march_manager.dispatch_march(player_castle_position, target, speed, action_time)

# ---------------------------------------------------------
# Event Handlers & Core Callbacks
# ---------------------------------------------------------

func _on_resource_node_clicked(node: ResourceNode) -> void:
	print("[KingdomManager] Input registered on resource: Lvl ", node.level, " ", node.resource_type, " with ", node.amount, " capacity.")
	display_resource_panel.emit(node)

func _on_wildling_node_clicked(node: WildlingNode) -> void:
	print("[KingdomManager] Input registered on monster: Lvl ", node.level, " Species: ", node.species, " Strength: ", node.power_rating, " CR")
	display_wildling_panel.emit(node)

func _on_castle_clicked(node: PlayerCastleNode) -> void:
	display_castle_panel.emit(node)

func _on_alliance_building_clicked(node: AllianceBuildingNode) -> void:
	display_alliance_building_panel.emit(node)

func _on_objective_clicked(node: ObjectiveNode) -> void:
	display_objective_panel.emit(node)

func _on_march_action_completed(target: Node2D, success: bool) -> void:
	if not success:
		print("[KingdomManager] March action failed/recalled.")
		return
		
	if target is ResourceNode:
		var reward_multiplier = 1.5 if _is_event_multiplier_active else 1.0
		var collected = int(target.amount * reward_multiplier)
		print("[KingdomManager] Resource collected successfully! Earned: +", collected, " ", target.resource_type)
		
		# Persistent integration: write directly into CVSaveManager
		var save_mgr = get_node_or_null("/root/CVSaveManager")
		if save_mgr:
			match target.resource_type.to_lower():
				"gold": save_mgr.gold += collected
				"wood": save_mgr.wood += collected
				"stone": save_mgr.stone += collected
				"iron": save_mgr.iron += collected
			save_mgr.save_game_state()
			
		if resource_spawner:
			resource_spawner.recycle_node(target)
			
	elif target is WildlingNode:
		print("[KingdomManager] Wildling vanquished! Species: ", target.species, " Level: ", target.level, ". Victory rewards dispatched to Vault!")
		
		# Generate level-scaled rewards and save to CVSaveManager
		var save_mgr = get_node_or_null("/root/CVSaveManager")
		if save_mgr:
			var gold_val = target.level * 1000
			var wood_val = target.level * 800
			var stone_val = target.level * 600
			var iron_val = target.level * 300
			
			if not target.metadata.is_empty() and target.metadata.has("rewards"):
				var r_meta = target.metadata["rewards"]
				if r_meta.has("resources"):
					var res = r_meta["resources"]
					gold_val = int(res.get("gold", 0))
					wood_val = int(res.get("wood", 0))
					stone_val = int(res.get("stone", 0))
					iron_val = int(res.get("iron", 0))
					
					# Convert food rewards to half gold and half wood to align with CVSaveManager resource vaults
					var food_val = int(res.get("food", 0))
					if food_val > 0:
						gold_val += int(food_val * 0.5)
						wood_val += int(food_val * 0.5)
			
			save_mgr.gold += gold_val
			save_mgr.wood += wood_val
			save_mgr.stone += stone_val
			save_mgr.iron += iron_val
			save_mgr.save_game_state()
			print("[KingdomManager] Dispatched rewards: Gold/Food: +", gold_val, " Wood: +", wood_val, " Stone: +", stone_val, " Iron: +", iron_val)
			
		if wildling_spawner:
			wildling_spawner.recycle_node(target)

	elif target is PlayerCastleNode:
		print("[KingdomManager] Expedition to Player Castle ", target.player_name, " complete.")
		if not target.is_player_own:
			var loot = target.level * 2500
			var save_mgr = get_node_or_null("/root/CVSaveManager")
			if save_mgr:
				save_mgr.gold += loot
				save_mgr.wood += loot
				save_mgr.save_game_state()
				print("[KingdomManager] Plundered +", loot, " gold and wood from ", target.player_name)

	elif target is AllianceBuildingNode:
		print("[KingdomManager] Support garrison stationed inside ", target.building_name)

	elif target is ObjectiveNode:
		print("[KingdomManager] Expedition completed at ", target.objective_name)
		var save_mgr = get_node_or_null("/root/CVSaveManager")
		if save_mgr and not target.rewards.is_empty():
			for reward in target.rewards:
				var r_type = reward.get("type", "gold")
				var min_amt = reward.get("minAmount", 5000)
				var max_amt = reward.get("maxAmount", 10000)
				var actual = randi_range(min_amt, max_amt)
				match r_type.to_lower():
					"gold": save_mgr.gold += actual
					"wood": save_mgr.wood += actual
					"stone": save_mgr.stone += actual
					"iron": save_mgr.iron += actual
				print("[KingdomManager] Claimed sacred reward: +", actual, " ", r_type)
			save_mgr.save_game_state()

# Supports Server/Event hooks for server-wide dynamic scaling
func activate_event_boost(active: bool) -> void:
	_is_event_multiplier_active = active
	print("[KingdomManager] Event resource harvesting multiplier toggled to: ", active)

# ==============================================================================
# --- DYNAMIC TELEPORTATION & KINGDOM MIGRATION SYSTEM ---
# ==============================================================================
signal player_castle_relocated(new_position: Vector2)
signal kingdom_migrated(new_kingdom_id: int)

func is_teleport_position_safe(pos: Vector2, min_dist: float = 120.0) -> bool:
	# 1. Terrain Blocked Check (Never spawn on mountains, rivers, or roads)
	if _is_terrain_blocked(pos):
		return false

	# 2. Check against other resource nodes
	if resource_spawner:
		for active_node in resource_spawner._active_nodes:
			if is_instance_valid(active_node) and active_node.global_position.distance_to(pos) < min_dist:
				return false
				
	# 3. Check against other wildlings
	if wildling_spawner:
		for active_node in wildling_spawner._active_nodes:
			if is_instance_valid(active_node) and active_node.global_position.distance_to(pos) < min_dist:
				return false
				
	# 4. Check against spawned player castles (excluding player's own castle!)
	for castle in _spawned_castles:
		if is_instance_valid(castle) and not castle.is_player_own:
			if castle.global_position.distance_to(pos) < min_dist:
				return false
			
	# 5. Check against spawned alliance structures (Never spawn inside alliance territory)
	for struct in _spawned_alliance_structures:
		if is_instance_valid(struct) and struct.global_position.distance_to(pos) < 250.0:
			return false
			
	# 6. Check against static world objectives
	for obj_pos in objectives.values():
		if obj_pos.distance_to(pos) < min_dist * 1.8:
			return false
			
	return true

func find_nearest_safe_teleport_position(target_pos: Vector2) -> Vector2:
	if is_teleport_position_safe(target_pos):
		return target_pos
	
	# Search in concentric circles with growing radius
	for r in [40.0, 80.0, 120.0, 160.0, 200.0, 250.0]:
		for angle_step in range(16):
			var angle = (angle_step / 16.0) * TAU
			var test_pos = target_pos + Vector2(cos(angle) * r, sin(angle) * r)
			if is_teleport_position_safe(test_pos):
				return test_pos
	return Vector2.ZERO

func perform_random_teleport() -> Vector2:
	# Find a random safe position within range [200, 950] from center
	for attempt in range(200):
		var angle = randf_range(0, TAU)
		var dist = randf_range(200, 950)
		var test_pos = royal_keep_position + Vector2(cos(angle) * dist, sin(angle) * dist)
		if is_teleport_position_safe(test_pos):
			return test_pos
	return Vector2.ZERO

func perform_alliance_teleport() -> Vector2:
	var base_pos := Vector2.ZERO
	# Try finding an active alliance structure first
	for struct in _spawned_alliance_structures:
		if is_instance_valid(struct):
			base_pos = struct.global_position
			break
	
	# Fallback to AllianceHQ objective if no built structure
	if base_pos == Vector2.ZERO:
		for obj_name in objectives.keys():
			if obj_name.to_lower().contains("alliance") or obj_name.to_lower().contains("hq"):
				base_pos = objectives[obj_name]
				break
	
	# Fallback to center if nothing else
	if base_pos == Vector2.ZERO:
		base_pos = royal_keep_position
		
	# Find a safe spot near base_pos (between 140 and 220 units away)
	for attempt in range(150):
		var angle = randf_range(0, TAU)
		var dist = randf_range(140.0, 220.0)
		var test_pos = base_pos + Vector2(cos(angle) * dist, sin(angle) * dist)
		if is_teleport_position_safe(test_pos):
			return test_pos
			
	# Fallback to random teleport if no close safe spots
	return perform_random_teleport()

func relocate_castle_to(target_pos: Vector2) -> bool:
	# Check if the target position is safe
	if not is_teleport_position_safe(target_pos):
		# Try to find the nearest safe spot
		var nearest_safe = find_nearest_safe_teleport_position(target_pos)
		if nearest_safe != Vector2.ZERO:
			target_pos = nearest_safe
		else:
			return false
			
	# Update position
	player_castle_position = target_pos
	
	# Find own castle instance
	var own_castle: PlayerCastleNode = null
	for castle in _spawned_castles:
		if is_instance_valid(castle) and castle.is_player_own:
			own_castle = castle
			break
			
	if own_castle:
		# Visual Tween on relocation
		own_castle.global_position = target_pos
		own_castle.scale = Vector2(0.1, 0.1)
		var tween = create_tween().set_parallel(true)
		tween.tween_property(own_castle, "scale", Vector2(1.0, 1.0), 0.45).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		
		# Modulate flash
		own_castle.modulate = Color(1.8, 1.8, 2.5) # Flash celestial blue-white
		create_tween().tween_property(own_castle, "modulate", Color.WHITE, 0.6)
		
		player_castle_relocated.emit(target_pos)
		print("[KingdomManager] Player Citadel successfully relocated to: ", target_pos)
		return true
	return false

func migrate_to_new_kingdom(new_id: int) -> void:
	# Keep track of active kingdom ID
	_active_kingdom_id = new_id
	
	# Randomize seed for the new land configuration
	random_seed = randi_range(100, 999999)
	
	# Temporarily clear layout
	_clear_previously_spawned()
	
	# In the new kingdom, select a safe starting position first
	var fresh_spot = _find_random_safe_position(900.0, 130.0)
	if fresh_spot == Vector2.ZERO or _is_terrain_blocked(fresh_spot):
		fresh_spot = Vector2(-800, 600) # reliable fallback
	player_castle_position = fresh_spot
	
	# Initialize the entire kingdom with the new ID and fresh randomized seed
	initialize_kingdom(new_id, random_seed)
	
	kingdom_migrated.emit(new_id)
	player_castle_relocated.emit(player_castle_position)
	print("[KingdomManager] Lord migrated to Kingdom #", new_id, " at spot: ", player_castle_position)

