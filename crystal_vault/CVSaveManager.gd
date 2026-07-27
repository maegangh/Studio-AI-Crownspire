#============================================================================
# CVSaveManager.gd - Crystal Vault Persistent Save System (Godot 4.4 Autoload)
# Handles local storage, encryption patterns, stats, and progression.
#============================================================================
extends Node

signal save_completed
signal load_completed
signal resonance_updated(new_val: int)
signal resources_updated

const SAVE_PATH := "user://crystal_vault_v1_2.save"

# Core Currencies & Resources
var resonance_rating: int = 1240
var starlight_orbs: int = 12
var astral_shards: int = 150

var gold: int = 5000
var wood: int = 10000
var stone: int = 8000
var iron: int = 4000

# Mode Unlocks
var unlocked_modes: Array[String] = ["puzzle_expedition", "endless_vault", "daily_extreme"]

# Event System & Energy / Attempt States
var event_attempts: int = 10
var max_natural_attempts: int = 10
var regen_interval_sec: int = 1800 # 30 minutes
var last_regen_timestamp: int = 0
var event_start_timestamp: int = 0

# Booster Inventory
var booster_inventory: Dictionary = {
	"undo": 3,
	"withdraw": 2,
	"shuffle": 3,
	"insight": 2,
	"extra_slot": 1
}

# Daily Vault Gift Claim Tracker
var claimed_daily_gift_days: Array = []
var last_gift_claim_date_str: String = ""

# Event Stage Progression
var claimed_event_stages: Array = []

# Expedition Progression: level_id -> stars (int)
var completed_levels: Dictionary = {}

# Endless Vault Max floor
var max_endless_floor: int = 0

# Daily Extreme
var daily_completed_today: bool = false
var daily_streak: int = 0
var last_daily_date: String = ""

# Player Profile Statistics
var stats: Dictionary = {
	"total_matches": 0,
	"total_wins": 0,
	"total_defeats": 0,
	"peak_combo": 0,
	"undos_used": 0,
	"shuffles_used": 0,
	"hints_used": 0,
	"seasons_completed": 1,
	"season_points": 0
}

func _ready() -> void:
	load_game_state()

## Saves current state variables to a JSON dictionary
func save_game_state() -> void:
	var save_dict := {
		"resonance_rating": resonance_rating,
		"starlight_orbs": starlight_orbs,
		"astral_shards": astral_shards,
		"gold": gold,
		"wood": wood,
		"stone": stone,
		"iron": iron,
		"unlocked_modes": unlocked_modes,
		"completed_levels": completed_levels,
		"max_endless_floor": max_endless_floor,
		"daily_completed_today": daily_completed_today,
		"daily_streak": daily_streak,
		"last_daily_date": last_daily_date,
		"event_attempts": event_attempts,
		"max_natural_attempts": max_natural_attempts,
		"regen_interval_sec": regen_interval_sec,
		"last_regen_timestamp": last_regen_timestamp,
		"event_start_timestamp": event_start_timestamp,
		"booster_inventory": booster_inventory,
		"claimed_daily_gift_days": claimed_daily_gift_days,
		"last_gift_claim_date_str": last_gift_claim_date_str,
		"claimed_event_stages": claimed_event_stages,
		"stats": stats,
		"last_saved": Time.get_datetime_dict_from_system()
	}
	
	var save_file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if save_file == null:
		var err := FileAccess.get_open_error()
		push_error("[CVSaveManager] Failed to write save file. Error: %d" % err)
		return
		
	var json_string := JSON.stringify(save_dict, "\t")
	save_file.store_string(json_string)
	save_file.close()
	
	save_completed.emit()
	resources_updated.emit()
	print("[CVSaveManager] Progression save successfully synchronized.")

## Loads persistent Crystal Vault variables from local storage
func load_game_state() -> void:
	if not FileAccess.file_exists(SAVE_PATH):
		print("[CVSaveManager] No prior save file discovered. Initializing clean default progression.")
		var now := int(Time.get_unix_time_from_system())
		last_regen_timestamp = now
		event_start_timestamp = now
		return
		
	var save_file := FileAccess.open(SAVE_PATH, FileAccess.READ)
	if save_file == null:
		var err := FileAccess.get_open_error()
		push_error("[CVSaveManager] Failed to read save file. Error: %d" % err)
		return
		
	var json_string := save_file.get_as_text()
	save_file.close()
	
	var json := JSON.new()
	var error := json.parse(json_string)
	if error != OK:
		push_error("[CVSaveManager] JSON Parse Error: %s in save string" % json.get_error_message())
		return
		
	var data: Dictionary = json.data
	
	# Safe parsing with defaults
	if data.has("resonance_rating"): resonance_rating = int(data["resonance_rating"])
	if data.has("starlight_orbs"): starlight_orbs = int(data["starlight_orbs"])
	if data.has("astral_shards"): astral_shards = int(data["astral_shards"])
	
	if data.has("gold"): gold = int(data["gold"])
	if data.has("wood"): wood = int(data["wood"])
	if data.has("stone"): stone = int(data["stone"])
	if data.has("iron"): iron = int(data["iron"])
	
	if data.has("unlocked_modes"): 
		unlocked_modes.clear()
		for val in data["unlocked_modes"]:
			unlocked_modes.append(str(val))
			
	if data.has("completed_levels"): completed_levels = Dictionary(data["completed_levels"])
	if data.has("max_endless_floor"): max_endless_floor = int(data["max_endless_floor"])
	if data.has("daily_completed_today"): daily_completed_today = bool(data["daily_completed_today"])
	if data.has("daily_streak"): daily_streak = int(data["daily_streak"])
	if data.has("last_daily_date"): last_daily_date = str(data["last_daily_date"])
	
	if data.has("event_attempts"): event_attempts = int(data["event_attempts"])
	if data.has("max_natural_attempts"): max_natural_attempts = int(data["max_natural_attempts"])
	if data.has("regen_interval_sec"): regen_interval_sec = int(data["regen_interval_sec"])
	if data.has("last_regen_timestamp"): last_regen_timestamp = int(data["last_regen_timestamp"])
	if data.has("event_start_timestamp"): event_start_timestamp = int(data["event_start_timestamp"])
	
	if data.has("booster_inventory"): booster_inventory = Dictionary(data["booster_inventory"])
	if data.has("claimed_daily_gift_days"): claimed_daily_gift_days = Array(data["claimed_daily_gift_days"])
	if data.has("last_gift_claim_date_str"): last_gift_claim_date_str = str(data["last_gift_claim_date_str"])
	if data.has("claimed_event_stages"): claimed_event_stages = Array(data["claimed_event_stages"])
	
	var now := int(Time.get_unix_time_from_system())
	if last_regen_timestamp <= 0: last_regen_timestamp = now
	if event_start_timestamp <= 0: event_start_timestamp = now
	
	update_attempt_regen()
	
	if data.has("stats"):
		var loaded_stats: Dictionary = data["stats"]
		for k in stats.keys():
			if loaded_stats.has(k):
				stats[k] = loaded_stats[k]
	
	load_completed.emit()
	resonance_updated.emit(resonance_rating)
	resources_updated.emit()
	print("[CVSaveManager] Progression save successfully loaded. Active attempts: %d/%d" % [event_attempts, max_natural_attempts])

## Complete profile wipe
func reset_save_data() -> void:
	resonance_rating = 1240
	starlight_orbs = 12
	astral_shards = 150
	gold = 5000
	wood = 10000
	stone = 8000
	iron = 4000
	completed_levels.clear()
	max_endless_floor = 0
	daily_completed_today = false
	daily_streak = 0
	last_daily_date = ""
	
	event_attempts = 10
	max_natural_attempts = 10
	var now := int(Time.get_unix_time_from_system())
	last_regen_timestamp = now
	event_start_timestamp = now
	
	booster_inventory = {
		"undo": 3,
		"withdraw": 2,
		"shuffle": 3,
		"insight": 2,
		"extra_slot": 1
	}
	claimed_daily_gift_days.clear()
	last_gift_claim_date_str = ""
	claimed_event_stages.clear()
	
	stats = {
		"total_matches": 0,
		"total_wins": 0,
		"total_defeats": 0,
		"peak_combo": 0,
		"undos_used": 0,
		"shuffles_used": 0,
		"hints_used": 0,
		"seasons_completed": 1,
		"season_points": 0
	}
	
	save_game_state()
	print("[CVSaveManager] Clean state profile reset completed.")

#============================================================================
# EVENT ENERGY / ATTEMPT REGENERATION & BOOSTER LOGIC
#============================================================================

## Recalculates passive offline attempt recovery based on real elapsed time
func update_attempt_regen() -> void:
	var now := int(Time.get_unix_time_from_system())
	if last_regen_timestamp <= 0:
		last_regen_timestamp = now
		return
		
	if event_attempts < max_natural_attempts:
		var elapsed := now - last_regen_timestamp
		if elapsed >= regen_interval_sec:
			var gained := elapsed / regen_interval_sec
			event_attempts = min(max_natural_attempts, event_attempts + gained)
			last_regen_timestamp += gained * regen_interval_sec
			save_game_state()
	else:
		# Keep timestamp updated if at or above cap
		last_regen_timestamp = now

## Returns a details dictionary for current event attempt status & countdown timers
func get_attempts_info() -> Dictionary:
	update_attempt_regen()
	var now := int(Time.get_unix_time_from_system())
	var next_sec := 0
	if event_attempts < max_natural_attempts:
		next_sec = max(0, regen_interval_sec - (now - last_regen_timestamp))
		
	var event_elapsed := max(0, now - event_start_timestamp)
	var event_time_remaining := max(0, 345600 - (event_elapsed % 345600)) # 4-day loop (345600s)
	var current_event_day := min(4, 1 + int((event_elapsed % 345600) / 86400))
	
	return {
		"attempts": event_attempts,
		"max": max_natural_attempts,
		"next_regen_sec": next_sec,
		"event_time_remaining": event_time_remaining,
		"current_event_day": current_event_day
	}

## Attempts to spend 1 entry attempt for a board run
func consume_attempt() -> bool:
	update_attempt_regen()
	if event_attempts > 0:
		if event_attempts == max_natural_attempts:
			last_regen_timestamp = int(Time.get_unix_time_from_system())
		event_attempts -= 1
		save_game_state()
		resources_updated.emit()
		return true
	return false

## Adds purchased/rewarded attempts (can exceed natural cap of 10)
func add_attempts(amount: int) -> void:
	event_attempts += amount
	save_game_state()
	resources_updated.emit()

## Booster Inventory query
func get_booster_count(booster_id: String) -> int:
	return int(booster_inventory.get(booster_id, 0))

## Booster consumption
func use_booster(booster_id: String) -> bool:
	var count := get_booster_count(booster_id)
	if count > 0:
		booster_inventory[booster_id] = count - 1
		save_game_state()
		resources_updated.emit()
		return true
	return false

## Booster addition
func add_booster(booster_id: String, amount: int = 1) -> void:
	booster_inventory[booster_id] = get_booster_count(booster_id) + amount
	save_game_state()
	resources_updated.emit()

## Daily Vault Gift check
func can_claim_daily_gift(event_day: int) -> bool:
	return not claimed_daily_gift_days.has(event_day)

## Daily Vault Gift claim
func claim_daily_gift(event_day: int, rewards: Dictionary) -> bool:
	if not can_claim_daily_gift(event_day):
		return false
		
	claimed_daily_gift_days.append(event_day)
	if rewards.has("shards"):
		astral_shards += int(rewards["shards"])
	if rewards.has("boosters"):
		var b_dict: Dictionary = rewards["boosters"]
		for b_id in b_dict.keys():
			add_booster(b_id, int(b_dict[b_id]))
			
	save_game_state()
	resources_updated.emit()
	return true

## Event Stage completion check
func is_stage_claimed(stage_num: int) -> bool:
	return claimed_event_stages.has(stage_num)

## Event Stage reward claim
func claim_stage_reward(stage_num: int, rewards: Dictionary) -> bool:
	if is_stage_claimed(stage_num):
		return false
		
	claimed_event_stages.append(stage_num)
	if rewards.has("shards"):
		astral_shards += int(rewards["shards"])
	if rewards.has("boosters"):
		var b_dict: Dictionary = rewards["boosters"]
		for b_id in b_dict.keys():
			add_booster(b_id, int(b_dict[b_id]))
			
	save_game_state()
	resources_updated.emit()
	return true

## Awards generic resources and triggers sync
func award_reliquary_rewards(shards: int, orbs: int, gold_val: int, wood_val: int, stone_val: int, iron_val: int) -> void:
	astral_shards += shards
	starlight_orbs += orbs
	gold += gold_val
	wood += wood_val
	stone += stone_val
	iron += iron_val
	
	# Passively increase resonance rating based on rewards
	var resonance_earned := shards / 5 + orbs * 10
	resonance_rating += resonance_earned
	
	resonance_updated.emit(resonance_rating)
	save_game_state()
	print("[CVSaveManager] Claimed rewards: +%d Shards, +%d Orbs, +%d Wood. Resonance ascended by %d." % [shards, orbs, wood_val, resonance_earned])
