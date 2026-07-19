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
	
	if data.has("stats"):
		var loaded_stats: Dictionary = data["stats"]
		for k in stats.keys():
			if loaded_stats.has(k):
				stats[k] = loaded_stats[k]
	
	load_completed.emit()
	resonance_updated.emit(resonance_rating)
	resources_updated.emit()
	print("[CVSaveManager] Progression save successfully loaded. Active resonance: %d" % resonance_rating)

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
