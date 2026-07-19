#============================================================================
# CVDataManager.gd - Crystal Vault JSON Config & Data Loader (Godot 4.4 Autoload)
# Manages reading, validation, and dynamic retrieval of static content templates.
#============================================================================
extends Node

signal config_loaded

const MODES_CONFIG_PATH := "res://crystal_vault/crystal_vault_modes.json"
const MAIN_CONFIG_PATH := "res://crystal_vault/crystal_vault_config.json"

# Memory database cache
var modes_database: Dictionary = {}
var general_config: Dictionary = {}

func _ready() -> void:
	load_all_configuration()

## Triggers parsing for static gameplay blueprints
func load_all_configuration() -> void:
	modes_database = load_json_file(MODES_CONFIG_PATH)
	general_config = load_json_file(MAIN_CONFIG_PATH)
	config_loaded.emit()
	print("[CVDataManager] Static configuration data loading finished.")

## Helper to load and parse json files safely
func load_json_file(file_path: String) -> Dictionary:
	if not FileAccess.file_exists(file_path):
		push_warning("[CVDataManager] Target file not found at: %s. Using blank dictionary fallback." % file_path)
		return {}
		
	var file := FileAccess.open(file_path, FileAccess.READ)
	if file == null:
		push_error("[CVDataManager] Failed to open file: %s" % file_path)
		return {}
		
	var content := file.get_as_text()
	file.close()
	
	var json := JSON.new()
	var err := json.parse(content)
	if err != OK:
		push_error("[CVDataManager] JSON Parsing failed inside %s: %s" % [file_path, json.get_error_message()])
		return {}
		
	return Dictionary(json.data)

## Retrieves metadata for a specific game mode
func get_mode_details(mode_id: String) -> Dictionary:
	if modes_database.has("modes") and modes_database["modes"].has(mode_id):
		return Dictionary(modes_database["modes"][mode_id])
	return {}

## Checks if a mode's requirements are satisfied by the current player level
func is_mode_unlocked_by_level(mode_id: String, castle_lvl: int) -> bool:
	var mode_data := get_mode_details(mode_id)
	if mode_data.is_empty():
		return false
		
	var req_keep_level: int = int(mode_data.get("required_keep_level", 1))
	return castle_lvl >= req_keep_level
