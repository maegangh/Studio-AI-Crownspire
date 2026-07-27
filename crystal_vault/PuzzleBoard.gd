#============================================================================
# PuzzleBoard.gd - Mahjong Triple Match Game Engine (Godot 4.4)
# Handles progressive levels, endless scaling, daily extreme challenges, 
# undos, star rating calculations, rewards, and player statistics.
#============================================================================
extends Node2D

# Progression & Victory Signals
signal puzzle_completed(final_score: int, stars: int, rewards: Dictionary)
signal puzzle_failed
signal combo_increased(multiplier: int)
signal board_exited

# UI Elements references
var score_lbl: Label = null
var combo_lbl: Label = null
var toolbar_container: HBoxContainer = null
var victory_overlay: PanelContainer = null
var defeat_overlay: PanelContainer = null

# Custom action limits for game balance
const max_undos: int = 3
const max_shuffles: int = 3
const max_hints: int = 3


# Config constraints
const TILE_SCENE := preload("res://crystal_vault/Tile.tscn")
const LAYOUTS_PATH := "res://crystal_vault/crystal_vault_layouts.json"
const TILE_WIDTH := 56.0
const TILE_HEIGHT := 64.0

# Active nodes & state variables
var active_tiles: Array[Node] = []
var tray_tiles: Array[Node] = []
var undo_stack: Array = [] # History snapshots
var tray_max_capacity: int = 7

var active_mode: String = "expedition" # expedition, endless, daily
var active_level_id: String = "1_1"
var active_endless_floor: int = 1
var active_layout_id: String = "pyramid_peak"

var score: int = 0
var combo: int = 0
var combo_timer: float = 0.0
const COMBO_WINDOW := 5.0 # Seconds before combo resets

var is_game_over: bool = false
var accessibility_enabled: bool = false

# Energy & Out of Energy Overlay
var out_of_energy_overlay: PanelContainer = null

# Statistics gathered inside this single run
var matches_made_this_run: int = 0
var undos_used_this_run: int = 0
var shuffles_used_this_run: int = 0
var hints_used_this_run: int = 0
var peak_combo_this_run: int = 0

@onready var tile_container: Node2D = $TileContainer
@onready var tray_anchors: Node2D = $TrayAnchors

func _ready() -> void:
	if tile_container == null:
		tile_container = Node2D.new()
		tile_container.name = "TileContainer"
		add_child(tile_container)
		
	if tray_anchors == null:
		tray_anchors = Node2D.new()
		tray_anchors.name = "TrayAnchors"
		add_child(tray_anchors)
	
	build_tray_anchors(7)
	setup_board_ui()
	update_ui_displays()

func build_tray_anchors(capacity: int = 7) -> void:
	if tray_anchors == null:
		return
	for child in tray_anchors.get_children():
		child.queue_free()
		
	# Spawn capacity anchor positions representing the Relic Altar Slots
	var start_x := 512.0 - ((float(capacity) / 2.0) * 56.0) + 28.0
	for i in range(capacity):
		var marker := Marker2D.new()
		marker.name = "SlotAnchor_%d" % i
		marker.position = Vector2(start_x + (i * 56.0), 470)
		tray_anchors.add_child(marker)

func _process(delta: float) -> void:
	if combo_timer > 0.0:
		combo_timer -= delta
		if combo_timer <= 0.0:
			combo = 0
			update_ui_displays()

func setup_board_ui() -> void:
	score_lbl = get_node_or_null("UI_Overlay/ScoreLabel")
	combo_lbl = get_node_or_null("UI_Overlay/ComboLabel")
	
	var overlay = get_node_or_null("UI_Overlay")
	if not overlay:
		overlay = CanvasLayer.new()
		overlay.name = "UI_Overlay"
		add_child(overlay)
		
	# Create bottom toolbar container
	toolbar_container = HBoxContainer.new()
	toolbar_container.alignment = BoxContainer.ALIGNMENT_CENTER
	toolbar_container.add_theme_constant_override("separation", 10)
	toolbar_container.position = Vector2(62, 535) # Beautifully centered at bottom
	toolbar_container.custom_minimum_size = Vector2(900, 45)
	overlay.add_child(toolbar_container)
	
	# 1. Undo Button
	var undo_btn := Button.new()
	undo_btn.name = "UndoButton"
	undo_btn.pressed.connect(_on_undo_pressed)
	toolbar_container.add_child(undo_btn)
	
	# 2. Withdraw Button
	var withdraw_btn := Button.new()
	withdraw_btn.name = "WithdrawButton"
	withdraw_btn.pressed.connect(_on_withdraw_pressed)
	toolbar_container.add_child(withdraw_btn)
	
	# 3. Shuffle Button
	var shuffle_btn := Button.new()
	shuffle_btn.name = "ShuffleButton"
	shuffle_btn.pressed.connect(_on_shuffle_pressed)
	toolbar_container.add_child(shuffle_btn)
	
	# 4. Insight Button
	var hint_btn := Button.new()
	hint_btn.name = "HintButton"
	hint_btn.pressed.connect(_on_hint_pressed)
	toolbar_container.add_child(hint_btn)
	
	# 5. Extra Slot Button
	var slot_btn := Button.new()
	slot_btn.name = "ExtraSlotButton"
	slot_btn.pressed.connect(_on_extra_slot_pressed)
	toolbar_container.add_child(slot_btn)
	
	# Separator
	var sep := VSeparator.new()
	toolbar_container.add_child(sep)
	
	# Restart Button
	var restart_btn := Button.new()
	restart_btn.name = "RestartButton"
	restart_btn.text = "🔄 Restart"
	restart_btn.pressed.connect(_on_restart_pressed)
	toolbar_container.add_child(restart_btn)
	
	# Exit Button
	var exit_btn := Button.new()
	exit_btn.name = "ExitButton"
	exit_btn.text = "🚪 Exit"
	exit_btn.pressed.connect(_on_exit_pressed)
	toolbar_container.add_child(exit_btn)
	
	# Setup Victory Overlay Panel
	victory_overlay = PanelContainer.new()
	victory_overlay.name = "VictoryOverlay"
	victory_overlay.visible = false
	victory_overlay.custom_minimum_size = Vector2(400, 320)
	victory_overlay.position = Vector2(312, 100)
	
	var v_box := VBoxContainer.new()
	v_box.add_theme_constant_override("separation", 12)
	victory_overlay.add_child(v_box)
	
	var v_title := Label.new()
	v_title.text = "👑 VAULT PURIFIED!"
	v_title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	v_title.add_theme_font_size_override("font_size", 22)
	v_title.modulate = Color(1.0, 0.85, 0.2, 1.0) # Radiant Gold
	v_box.add_child(v_title)
	
	var v_stars := Label.new()
	v_stars.name = "StarsLabel"
	v_stars.text = "⭐ ⭐ ⭐"
	v_stars.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	v_stars.add_theme_font_size_override("font_size", 28)
	v_box.add_child(v_stars)
	
	var v_details := Label.new()
	v_details.name = "DetailsLabel"
	v_details.text = ""
	v_details.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	v_box.add_child(v_details)
	
	var v_continue_btn := Button.new()
	v_continue_btn.text = "Claim Rewards & Return"
	v_continue_btn.pressed.connect(_on_exit_pressed)
	v_box.add_child(v_continue_btn)
	
	overlay.add_child(victory_overlay)
	
	# Setup Defeat Overlay Panel
	defeat_overlay = PanelContainer.new()
	defeat_overlay.name = "DefeatOverlay"
	defeat_overlay.visible = false
	defeat_overlay.custom_minimum_size = Vector2(400, 300)
	defeat_overlay.position = Vector2(312, 100)
	
	var d_box := VBoxContainer.new()
	d_box.add_theme_constant_override("separation", 12)
	defeat_overlay.add_child(d_box)
	
	var d_title := Label.new()
	d_title.text = "💀 ALTAR CONGESTED"
	d_title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	d_title.add_theme_font_size_override("font_size", 22)
	d_title.modulate = Color(1.0, 0.3, 0.3, 1.0) # Warning Crimson
	d_box.add_child(d_title)
	
	var d_desc := Label.new()
	d_desc.text = "The Relic Altar tray is fully congested.\nNo further match combinations can be made."
	d_desc.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	d_box.add_child(d_desc)
	
	var d_retry_btn := Button.new()
	d_retry_btn.text = "🔄 Retry Floor"
	d_retry_btn.pressed.connect(_on_restart_pressed)
	d_box.add_child(d_retry_btn)
	
	var d_exit_btn := Button.new()
	d_exit_btn.text = "🚪 Exit to Lobby"
	d_exit_btn.pressed.connect(_on_exit_pressed)
	d_box.add_child(d_exit_btn)
	
	overlay.add_child(defeat_overlay)
	
	# Setup Out of Energy Overlay Panel
	out_of_energy_overlay = PanelContainer.new()
	out_of_energy_overlay.name = "OutOfEnergyOverlay"
	out_of_energy_overlay.visible = false
	out_of_energy_overlay.custom_minimum_size = Vector2(420, 280)
	out_of_energy_overlay.position = Vector2(302, 120)
	
	var e_box := VBoxContainer.new()
	e_box.add_theme_constant_override("separation", 14)
	out_of_energy_overlay.add_child(e_box)
	
	var e_title := Label.new()
	e_title.text = "⚡ ATTEMPTS EXHAUSTED"
	e_title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	e_title.add_theme_font_size_override("font_size", 20)
	e_title.modulate = Color(1.0, 0.6, 0.2, 1.0)
	e_box.add_child(e_title)
	
	var e_desc := Label.new()
	e_desc.text = "You have 0 event attempts remaining.\nNatural recovery generates +1 attempt every 30 minutes.\nPurchase additional attempts to continue playing!"
	e_desc.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	e_box.add_child(e_desc)
	
	var e_buy_btn := Button.new()
	e_buy_btn.text = "💎 Purchase +5 Attempts (100 Shards)"
	e_buy_btn.pressed.connect(func():
		if CrystalVaultManager and CrystalVaultManager.request_purchase_attempts(5, 100):
			out_of_energy_overlay.visible = false
			_on_restart_pressed()
	)
	e_box.add_child(e_buy_btn)
	
	var e_exit_btn := Button.new()
	e_exit_btn.text = "🚪 Return to Lobby"
	e_exit_btn.pressed.connect(_on_exit_pressed)
	e_box.add_child(e_exit_btn)
	
	overlay.add_child(out_of_energy_overlay)

func update_ui_displays() -> void:
	if score_lbl:
		score_lbl.text = "Score: %d" % score
	if combo_lbl:
		combo_lbl.text = "Combo: x%d" % combo if combo > 0 else ""
		
	var u_count := CVSaveManager.get_booster_count("undo") if CVSaveManager else 0
	var w_count := CVSaveManager.get_booster_count("withdraw") if CVSaveManager else 0
	var s_count := CVSaveManager.get_booster_count("shuffle") if CVSaveManager else 0
	var i_count := CVSaveManager.get_booster_count("insight") if CVSaveManager else 0
	var x_count := CVSaveManager.get_booster_count("extra_slot") if CVSaveManager else 0
	
	var undo_btn = toolbar_container.get_node_or_null("UndoButton") if toolbar_container else null
	if undo_btn:
		undo_btn.text = "↩️ Undo (%d)" % u_count
		undo_btn.disabled = is_game_over
		
	var withdraw_btn = toolbar_container.get_node_or_null("WithdrawButton") if toolbar_container else null
	if withdraw_btn:
		withdraw_btn.text = "📥 Withdraw (%d)" % w_count
		withdraw_btn.disabled = tray_tiles.is_empty() or is_game_over
		
	var shuffle_btn = toolbar_container.get_node_or_null("ShuffleButton") if toolbar_container else null
	if shuffle_btn:
		shuffle_btn.text = "🔀 Shuffle (%d)" % s_count
		shuffle_btn.disabled = active_tiles.is_empty() or is_game_over
		
	var hint_btn = toolbar_container.get_node_or_null("HintButton") if toolbar_container else null
	if hint_btn:
		hint_btn.text = "💡 Insight (%d)" % i_count
		hint_btn.disabled = active_tiles.is_empty() or is_game_over
		
	var slot_btn = toolbar_container.get_node_or_null("ExtraSlotButton") if toolbar_container else null
	if slot_btn:
		if tray_max_capacity >= 8:
			slot_btn.text = "✨ 8 Slots Active"
			slot_btn.disabled = true
		else:
			slot_btn.text = "➕ +1 Slot (%d)" % x_count
			slot_btn.disabled = is_game_over

func _on_undo_pressed() -> void:
	if is_game_over: return
	if CVSaveManager and CVSaveManager.get_booster_count("undo") > 0:
		if CVSaveManager.use_booster("undo"):
			trigger_undo()
	else:
		if CrystalVaultManager and CrystalVaultManager.request_purchase_booster("undo", 40):
			if CVSaveManager and CVSaveManager.use_booster("undo"):
				trigger_undo()
	update_ui_displays()

func _on_withdraw_pressed() -> void:
	if is_game_over: return
	if CVSaveManager and CVSaveManager.get_booster_count("withdraw") > 0:
		if CVSaveManager.use_booster("withdraw"):
			trigger_withdraw()
	else:
		if CrystalVaultManager and CrystalVaultManager.request_purchase_booster("withdraw", 60):
			if CVSaveManager and CVSaveManager.use_booster("withdraw"):
				trigger_withdraw()
	update_ui_displays()

func _on_shuffle_pressed() -> void:
	if is_game_over: return
	if CVSaveManager and CVSaveManager.get_booster_count("shuffle") > 0:
		if CVSaveManager.use_booster("shuffle"):
			trigger_shuffle()
	else:
		if CrystalVaultManager and CrystalVaultManager.request_purchase_booster("shuffle", 50):
			if CVSaveManager and CVSaveManager.use_booster("shuffle"):
				trigger_shuffle()
	update_ui_displays()

func _on_hint_pressed() -> void:
	if is_game_over: return
	if CVSaveManager and CVSaveManager.get_booster_count("insight") > 0:
		if CVSaveManager.use_booster("insight"):
			trigger_hint()
	else:
		if CrystalVaultManager and CrystalVaultManager.request_purchase_booster("insight", 50):
			if CVSaveManager and CVSaveManager.use_booster("insight"):
				trigger_hint()
	update_ui_displays()

func _on_extra_slot_pressed() -> void:
	if is_game_over or tray_max_capacity >= 8: return
	if CVSaveManager and CVSaveManager.get_booster_count("extra_slot") > 0:
		if CVSaveManager.use_booster("extra_slot"):
			trigger_extra_slot()
	else:
		if CrystalVaultManager and CrystalVaultManager.request_purchase_booster("extra_slot", 75):
			if CVSaveManager and CVSaveManager.use_booster("extra_slot"):
				trigger_extra_slot()
	update_ui_displays()

func trigger_withdraw() -> void:
	if tray_tiles.is_empty() or is_game_over:
		return
		
	save_undo_state()
	
	# Moves up to 3 tiles from tray back to board
	var count_to_remove := min(3, tray_tiles.size())
	var tiles_to_return: Array[Node] = []
	for i in range(count_to_remove):
		tiles_to_return.append(tray_tiles.pop_back())
		
	for tile in tiles_to_return:
		tile.grid_x = randf_range(2.0, 5.0)
		tile.grid_y = randf_range(2.0, 5.0)
		tile.layer_z = 4 # Highest layer so unblocked
		var screen_x := tile.grid_x * (TILE_WIDTH * 0.9) + 120.0
		var screen_y := tile.grid_y * (TILE_HEIGHT * 0.72) + 80.0
		tile.position = Vector2(screen_x, screen_y)
		active_tiles.append(tile)
		
	evaluate_blocking_states()
	realign_tray_slots_physically()

func trigger_extra_slot() -> void:
	if tray_max_capacity >= 8 or is_game_over:
		return
	tray_max_capacity = 8
	build_tray_anchors(8)
	realign_tray_slots_physically()
	
func _on_restart_pressed() -> void:
	if victory_overlay: victory_overlay.visible = false
	if defeat_overlay: defeat_overlay.visible = false
	if active_mode == "expedition":
		start_expedition_level(active_level_id, active_layout_id)
	elif active_mode == "endless":
		start_endless_floor(active_endless_floor)
	elif active_mode == "daily":
		start_daily_extreme()
	update_ui_displays()
	
func _on_exit_pressed() -> void:
	board_exited.emit()
	queue_free()


## PROCEDURAL COORDINATES GENERATOR (ENDLESS & EXPANSION SCALING)
## Generates layered pyramid coordinates ensuring a balanced stack for arbitrary tile counts.
func generate_procedural_coords(count: int) -> Array:
	var coords := []
	
	# Layer 0 (base): up to 48 slots
	for y in range(1, 7):
		for x in range(1, 7):
			coords.append({"x": float(x), "y": float(y), "z": 0})
			
	# Layer 1: up to 25 slots
	var y_val := 1.5
	while y_val <= 5.5:
		var x_val := 1.5
		while x_val <= 5.5:
			coords.append({"x": x_val, "y": y_val, "z": 1})
			x_val += 1.0
		y_val += 1.0
		
	# Layer 2: up to 16 slots
	for y in range(2, 6):
		for x in range(2, 6):
			coords.append({"x": float(x), "y": float(y), "z": 2})
			
	# Layer 3: up to 4 slots
	y_val = 2.5
	while y_val <= 3.5:
		var x_val := 2.5
		while x_val <= 3.5:
			coords.append({"x": x_val, "y": y_val, "z": 3})
			x_val += 1.0
		y_val += 1.0
		
	# Sort to ensure higher layers and central slots are populated first for visual beauty
	coords.sort_custom(func(a, b):
		if a["z"] != b["z"]:
			return b["z"] < a["z"] # Higher layers first
		var dist_a := pow(a["x"] - 3.5, 2) + pow(a["y"] - 3.5, 2)
		var dist_b := pow(b["x"] - 3.5, 2) + pow(b["y"] - 3.5, 2)
		return dist_a < dist_b # Closer to center first
	)
	
	return coords.slice(0, count)

## RESET BOARD RUN STATS
func reset_run_stats() -> void:
	score = 0
	combo = 0
	combo_timer = 0.0
	is_game_over = false
	matches_made_this_run = 0
	undos_used_this_run = 0
	shuffles_used_this_run = 0
	hints_used_this_run = 0
	peak_combo_this_run = 0
	
	# Clear active elements
	for tile in active_tiles:
		tile.queue_free()
	active_tiles.clear()
	
	for tile in tray_tiles:
		tile.queue_free()
	tray_tiles.clear()
	undo_stack.clear()

## 1. EXPEDITION LEVEL SPANNER
func start_expedition_level(level_id: String, layout_id: String) -> void:
	if CVSaveManager and not CVSaveManager.consume_attempt():
		if out_of_energy_overlay: out_of_energy_overlay.visible = true
		return
		
	print("[PuzzleBoard] Starting Expedition Level %s (Layout: %s)" % [level_id, layout_id])
	active_mode = "expedition"
	active_level_id = level_id
	active_layout_id = layout_id
	reset_run_stats()
	
	var layouts_db := load_json_config(LAYOUTS_PATH)
	var coords_array := []
	var target_count := 36
	
	if layouts_db.has("layouts") and layouts_db["layouts"].has(layout_id):
		var layout_data: Dictionary = layouts_db["layouts"][layout_id]
		coords_array = layout_data["coords"]
		target_count = int(layout_data["tiles_count"])
	else:
		# Fallback to procedural layout
		coords_array = generate_procedural_coords(36)
		target_count = 36
		
	populate_runes_on_coords(coords_array, target_count)

## 2. ENDLESS VAULT SPANNER (DIFFICULTY SCALING BASED ON FLOOR)
func start_endless_floor(floor_num: int) -> void:
	if CVSaveManager and not CVSaveManager.consume_attempt():
		if out_of_energy_overlay: out_of_energy_overlay.visible = true
		return
		
	print("[PuzzleBoard] Initializing Endless Vault Floor: %d" % floor_num)
	active_mode = "endless"
	active_endless_floor = floor_num
	reset_run_stats()
	
	# Endless Scaling: Increase tile count with floor number, clamped at 30 to 90
	# Tile counts must remain divisible by 3!
	var raw_tiles := 30 + (floor_num * 3)
	var target_count := int(clamp(raw_tiles - (raw_tiles % 3), 30, 90))
	
	print("[PuzzleBoard] Scaling Endless difficulty. Floor: %d, Tiles count: %d" % [floor_num, target_count])
	var coords_array := generate_procedural_coords(target_count)
	populate_runes_on_coords(coords_array, target_count)

## 3. DAILY EXTREME CHALLENGE SPANNER (90 TILE EXTREME MATRIX)
func start_daily_extreme() -> void:
	if CVSaveManager and not CVSaveManager.consume_attempt():
		if out_of_energy_overlay: out_of_energy_overlay.visible = true
		return
		
	print("[PuzzleBoard] Spawning Daily Extreme Challenge...")
	active_mode = "daily"
	reset_run_stats()
	
	var target_count := 72 # Extreme multi-layered layout
	var coords_array := generate_procedural_coords(target_count)
	populate_runes_on_coords(coords_array, target_count)

## POPULATE TILES FROM GENERATED COORDINATE ARRAYS
func populate_runes_on_coords(coords_array: Array, target_count: int) -> void:
	var num_triplets := target_count / 3
	var type_pool: Array[String] = []
	var available_types := ["solar_fire", "glacial_frost", "emerald_nature", "astral_light", "amber_earth", "runic_compass"]
	
	for i in range(num_triplets):
		var rand_type: String = available_types[randi() % available_types.size()]
		type_pool.append(rand_type)
		type_pool.append(rand_type)
		type_pool.append(rand_type)
		
	type_pool.shuffle()
	
	for i in range(target_count):
		if i >= coords_array.size():
			break
			
		var coord: Dictionary = coords_array[i]
		var new_tile := TILE_SCENE.instantiate()
		new_tile.type_id = type_pool[i]
		new_tile.grid_x = float(coord["x"])
		new_tile.grid_y = float(coord["y"])
		new_tile.layer_z = int(coord["z"])
		
		# Set screen coordinates
		var screen_x := new_tile.grid_x * (TILE_WIDTH * 0.9) + 120.0
		var screen_y := new_tile.grid_y * (TILE_HEIGHT * 0.72) + 80.0
		new_tile.position = Vector2(screen_x, screen_y)
		
		new_tile.tile_clicked.connect(_on_tile_selected)
		tile_container.add_child(new_tile)
		active_tiles.append(new_tile)
		
	evaluate_blocking_states()

## SCANNING OVERLAPS & BLOCKING STATES
func evaluate_blocking_states() -> void:
	for tile in active_tiles:
		var overlapped: bool = false
		for other in active_tiles:
			if other == tile:
				continue
			if other.layer_z <= tile.layer_z:
				continue
				
			var x_dist := absf(other.grid_x - tile.grid_x)
			var y_dist := absf(other.grid_y - tile.grid_y)
			
			if x_dist < 0.85 and y_dist < 0.85:
				overlapped = true
				break
				
		tile.is_blocked = overlapped
		tile.update_appearance()

## TILE SELECTION HANDLER
func _on_tile_selected(tile: Node) -> void:
	if is_game_over or tile.is_blocked:
		return
		
	if tray_tiles.size() >= tray_max_capacity:
		return
		
	save_undo_state()
	active_tiles.erase(tile)
	evaluate_blocking_states()
	
	var insert_idx := -1
	for i in range(tray_tiles.size()):
		if tray_tiles[i].type_id == tile.type_id:
			insert_idx = i
			break
			
	if insert_idx != -1:
		tray_tiles.insert(insert_idx, tile)
	else:
		tray_tiles.append(tile)
		
	realign_tray_slots_physically()
	update_ui_displays()


## Physical Tray alignments
func realign_tray_slots_physically() -> void:
	for i in range(tray_tiles.size()):
		var tile := tray_tiles[i]
		var anchor: Node = tray_anchors.get_child(i)
		var target_pos := anchor.global_position
		
		tile.animate_fly_to_target(target_pos, func():
			if i == tray_tiles.size() - 1:
				check_tray_matching_triplets()
		)

## RESOLVES TRIPLET ELIMINATIONS
func check_tray_matching_triplets() -> void:
	var counts: Dictionary = {}
	for tile in tray_tiles:
		counts[tile.type_id] = counts.get(tile.type_id, 0) + 1
		
	var matched_type := ""
	for type_id in counts.keys():
		if counts[type_id] >= 3:
			matched_type = type_id
			break
			
	if matched_type != "":
		var remaining: Array[Node] = []
		var match_count := 0
		
		for tile in tray_tiles:
			if tile.type_id == matched_type and match_count < 3:
				match_count += 1
				tile.queue_free()
			else:
				remaining.append(tile)
				
		tray_tiles = remaining
		
		# Match tracking
		matches_made_this_run += 1
		combo += 1
		if combo > peak_combo_this_run:
			peak_combo_this_run = combo
			
		combo_timer = COMBO_WINDOW
		var calculated_score := 150 * clamp(combo, 1, 5)
		score += calculated_score
		combo_increased.emit(combo)
		
		realign_tray_slots_physically()
		update_ui_displays()
		
		if active_tiles.is_empty() and tray_tiles.is_empty():
			trigger_victory()
	else:
		if tray_tiles.size() >= tray_max_capacity:
			trigger_defeat()
		else:
			update_ui_displays()


## TACTICAL CONTROLS: UNDO
func trigger_undo() -> void:
	if undo_stack.is_empty() or is_game_over:
		return
		
	undos_used_this_run += 1
	var snapshot: Dictionary = undo_stack.pop_back()
	
	for tile in active_tiles:
		tile.queue_free()
	active_tiles.clear()
	
	for tile in tray_tiles:
		tile.queue_free()
	tray_tiles.clear()
	
	# Restore
	for data in snapshot["board"]:
		var restored_tile := TILE_SCENE.instantiate()
		restored_tile.type_id = data["type_id"]
		restored_tile.grid_x = data["grid_x"]
		restored_tile.grid_y = data["grid_y"]
		restored_tile.layer_z = data["layer_z"]
		restored_tile.position = data["position"]
		restored_tile.tile_clicked.connect(_on_tile_selected)
		tile_container.add_child(restored_tile)
		active_tiles.append(restored_tile)
		
	for data in snapshot["tray"]:
		var restored_tile := TILE_SCENE.instantiate()
		restored_tile.type_id = data["type_id"]
		restored_tile.grid_x = data["grid_x"]
		restored_tile.grid_y = data["grid_y"]
		restored_tile.layer_z = data["layer_z"]
		restored_tile.position = data["position"]
		restored_tile.tile_clicked.connect(_on_tile_selected)
		tile_container.add_child(restored_tile)
		tray_tiles.append(restored_tile)
		
	evaluate_blocking_states()
	realign_tray_slots_physically()

## TACTICAL CONTROLS: SHUFFLE
func trigger_shuffle() -> void:
	if active_tiles.is_empty() or is_game_over:
		return
		
	shuffles_used_this_run += 1
	var types: Array[String] = []
	for tile in active_tiles:
		types.append(tile.type_id)
		
	types.shuffle()
	
	for i in range(active_tiles.size()):
		active_tiles[i].type_id = types[i]
		
	evaluate_blocking_states()
	undo_stack.clear()

## TACTICAL CONTROLS: HINT
func trigger_hint() -> void:
	if active_tiles.is_empty() or is_game_over:
		return
		
	hints_used_this_run += 1
	var unblocked_tiles: Array[Node] = []
	for tile in active_tiles:
		if not tile.is_blocked:
			unblocked_tiles.append(tile)
			
	if unblocked_tiles.is_empty():
		return
		
	if not tray_tiles.is_empty():
		for tray_tile in tray_tiles:
			for b_tile in unblocked_tiles:
				if b_tile.type_id == tray_tile.type_id:
					flash_hint_on_tile(b_tile)
					return
					
	var counts: Dictionary = {}
	for b_tile in unblocked_tiles:
		counts[b_tile.type_id] = counts.get(b_tile.type_id, 0) + 1
		
	for type_id in counts.keys():
		if counts[type_id] >= 2:
			for b_tile in unblocked_tiles:
				if b_tile.type_id == type_id:
					flash_hint_on_tile(b_tile)
					return
					
	flash_hint_on_tile(unblocked_tiles[0])

func flash_hint_on_tile(tile: Node) -> void:
	tile.is_hinted = true
	tile.update_appearance()
	await get_tree().create_timer(2.0).timeout
	if is_instance_valid(tile):
		tile.is_hinted = false
		tile.update_appearance()

func save_undo_state() -> void:
	var b_snap := []
	for tile in active_tiles:
		b_snap.append({
			"type_id": tile.type_id,
			"grid_x": tile.grid_x,
			"grid_y": tile.grid_y,
			"layer_z": tile.layer_z,
			"position": tile.position
		})
		
	var t_snap := []
	for tile in tray_tiles:
		t_snap.append({
			"type_id": tile.type_id,
			"grid_x": tile.grid_x,
			"grid_y": tile.grid_y,
			"layer_z": tile.layer_z,
			"position": tile.position
		})
		
	undo_stack.append({
		"board": b_snap,
		"tray": t_snap
	})

## CALCULATE TACTICAL STAR RATING BASED ON UNDOS USED
func calculate_stars_earned() -> int:
	if undos_used_this_run <= 1:
		return 3
	elif undos_used_this_run <= 3:
		return 2
	return 1

## DYNAMIC REWARD GENERATION (SCALABLE RESOURCES)
func generate_rewards(stars: int) -> Dictionary:
	var base_multiplier: float = 1.0 + (stars - 1) * 0.25
	
	var shards := 0
	var orbs := 0
	var gold_val := 0
	var wood_val := 0
	var stone_val := 0
	var iron_val := 0
	
	match active_mode:
		"expedition":
			shards = int(30 * base_multiplier)
			orbs = int(1 * (1 if stars == 3 else 0))
			gold_val = int(1000 * base_multiplier)
			wood_val = int(2000 * base_multiplier)
			stone_val = int(1500 * base_multiplier)
			iron_val = int(800 * base_multiplier)
		"endless":
			shards = int((20 + active_endless_floor * 2) * base_multiplier)
			orbs = int(1 if active_endless_floor % 5 == 0 else 0)
			gold_val = int((800 + active_endless_floor * 100) * base_multiplier)
			wood_val = int((1500 + active_endless_floor * 200) * base_multiplier)
			stone_val = int((1200 + active_endless_floor * 150) * base_multiplier)
			iron_val = int((600 + active_endless_floor * 100) * base_multiplier)
		"daily":
			shards = 120 # Heavy shards reward
			orbs = 3 # High orbs
			gold_val = 5000
			wood_val = 10000
			stone_val = 8000
			iron_val = 4000
			
	return {
		"shards": shards,
		"orbs": orbs,
		"gold": gold_val,
		"wood": wood_val,
		"stone": stone_val,
		"iron": iron_val
	}

## VICTORY & DEFEAT OUTCOMES (SYNCS BACK TO CVSAVEMANAGER AUTO-LOADS)
func trigger_victory() -> void:
	is_game_over = true
	var stars := calculate_stars_earned()
	var rewards := generate_rewards(stars)
	
	# Persist in CVSaveManager
	if CVSaveManager:
		# Update Profile Statistics
		CVSaveManager.stats["total_wins"] += 1
		CVSaveManager.stats["total_matches"] += matches_made_this_run
		CVSaveManager.stats["undos_used"] += undos_used_this_run
		CVSaveManager.stats["shuffles_used"] += shuffles_used_this_run
		CVSaveManager.stats["hints_used"] += hints_used_this_run
		
		if peak_combo_this_run > CVSaveManager.stats["peak_combo"]:
			CVSaveManager.stats["peak_combo"] = peak_combo_this_run
			
		match active_mode:
			"expedition":
				# Record highest star score
				var old_stars: int = CVSaveManager.completed_levels.get(active_level_id, 0)
				if stars > old_stars:
					CVSaveManager.completed_levels[active_level_id] = stars
			"endless":
				if active_endless_floor > CVSaveManager.max_endless_floor:
					CVSaveManager.max_endless_floor = active_endless_floor
			"daily":
				CVSaveManager.daily_completed_today = true
				CVSaveManager.daily_streak += 1
				CVSaveManager.stats["season_points"] += 100
				
		# Synchronize inventory gains
		CVSaveManager.award_reliquary_rewards(
			rewards["shards"], rewards["orbs"], rewards["gold"],
			rewards["wood"], rewards["stone"], rewards["iron"]
		)
		
	# Populate Victory Overlay details
	if victory_overlay:
		victory_overlay.visible = true
		var stars_lbl = victory_overlay.get_node_or_null("StarsLabel")
		if stars_lbl:
			stars_lbl.text = ""
			for i in range(stars):
				stars_lbl.text += "⭐ "
		var details_lbl = victory_overlay.get_node_or_null("DetailsLabel")
		if details_lbl:
			details_lbl.text = "Final Score: %d\n\nRewards Claimed:\n💎 +%d Astral Shards   ⭐ +%d Starlight Orbs\n🪙 +%d Gold   🪵 +%d Wood" % [
				score, rewards.get("shards", 0), rewards.get("orbs", 0), rewards.get("gold", 0), rewards.get("wood", 0)
			]
			
	update_ui_displays()
	puzzle_completed.emit(score, stars, rewards)
	print("[PuzzleBoard] Victory Resolved. Stars: %d, Rewards: %s" % [stars, str(rewards)])

func trigger_defeat() -> void:
	is_game_over = true
	if CVSaveManager:
		CVSaveManager.stats["total_defeats"] += 1
		CVSaveManager.stats["total_matches"] += matches_made_this_run
		CVSaveManager.save_game_state()
		
	if defeat_overlay:
		defeat_overlay.visible = true
		
	update_ui_displays()
	puzzle_failed.emit()
	print("[PuzzleBoard] Defeat resolved: reliquary fully congested.")

## Dynamic File Loader
func load_json_config(file_path: String) -> Dictionary:
	if not FileAccess.file_exists(file_path):
		return {}
	var file := FileAccess.open(file_path, FileAccess.READ)
	var content := file.get_as_text()
	file.close()
	var json := JSON.new()
	var err := json.parse(content)
	if err == OK:
		return Dictionary(json.data)
	return {}
