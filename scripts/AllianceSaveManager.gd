# ==========================================
# CROWNSPIRE ALLIANCE SAVE MANAGER
# ==========================================
extends RefCounted

var ui_manager

const PLAYER_SAVE_PATH := "user://player_runtime.json"
const ALLIANCE_SAVE_PATH := "user://alliance_runtime.json"
const RESEARCH_SAVE_PATH := "user://alliance_research_runtime.json"
const PLAYERS_SAVE_PATH := "user://players_runtime.json"
const BUILDINGS_SAVE_PATH := "user://buildings_runtime.json"

func load_all() -> void:
	# Load Player Data
	if FileAccess.file_exists(PLAYER_SAVE_PATH):
		var file = FileAccess.open(PLAYER_SAVE_PATH, FileAccess.READ)
		if file:
			var json = JSON.new()
			if json.parse(file.get_as_text()) == OK:
				var data = json.get_data()
				if data is Dictionary:
					ui_manager.player_name = data.get("player_name", "Sovereign Maegan")
					ui_manager.power = data.get("power", 750000)
					ui_manager.vip_level = data.get("vip_level", 3)
					ui_manager.vip_points = data.get("vip_points", 1200)
					ui_manager.alliance_honor = data.get("alliance_honor", 5000)
					ui_manager.aurora_crystals = data.get("aurora_crystals", 150)
					ui_manager.food = data.get("food", 500000)
					ui_manager.wood = data.get("wood", 600000)
					ui_manager.stone = data.get("stone", 350000)
					ui_manager.iron = data.get("iron", 150000)
					ui_manager.gold = data.get("gold", 100000)
					ui_manager.royal_crystals = data.get("royal_crystals", 2500)
					ui_manager.player_alliance_id = data.get("player_alliance_id", "alliance_1")
	
	# Load Alliance DB
	if FileAccess.file_exists(ALLIANCE_SAVE_PATH):
		ui_manager.alliances_db = ui_manager.load_json_file(ALLIANCE_SAVE_PATH)
	else:
		ui_manager.alliances_db = ui_manager.load_json_file("res://data/alliance.json")
		
	# Load Research DB
	if FileAccess.file_exists(RESEARCH_SAVE_PATH):
		ui_manager.alliance_research_db = ui_manager.load_json_file(RESEARCH_SAVE_PATH)
	else:
		ui_manager.alliance_research_db = ui_manager.load_json_file("res://data/alliance_research.json")
		
	# Load Players DB
	if FileAccess.file_exists(PLAYERS_SAVE_PATH):
		ui_manager.global_players_db = ui_manager.load_json_file(PLAYERS_SAVE_PATH)
	else:
		ui_manager.global_players_db = ui_manager.load_json_file("res://data/players.json")
		
	# Load Buildings DB
	if FileAccess.file_exists(BUILDINGS_SAVE_PATH):
		ui_manager._buildings_cache = ui_manager.load_json_file(BUILDINGS_SAVE_PATH)
	else:
		var path = "res://data/buildings.json"
		if FileAccess.file_exists(path):
			ui_manager._buildings_cache = ui_manager.load_json_file(path)

func save_all() -> void:
	# Save Player Data
	var player_data = {
		"player_name": ui_manager.player_name,
		"power": ui_manager.power,
		"vip_level": ui_manager.vip_level,
		"vip_points": ui_manager.vip_points,
		"alliance_honor": ui_manager.alliance_honor,
		"aurora_crystals": ui_manager.aurora_crystals,
		"food": ui_manager.food,
		"wood": ui_manager.wood,
		"stone": ui_manager.stone,
		"iron": ui_manager.iron,
		"gold": ui_manager.gold,
		"royal_crystals": ui_manager.royal_crystals,
		"player_alliance_id": ui_manager.player_alliance_id
	}
	var file = FileAccess.open(PLAYER_SAVE_PATH, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(player_data, "\t"))
		file.close()
		
	# Save Alliance DB
	file = FileAccess.open(ALLIANCE_SAVE_PATH, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(ui_manager.alliances_db, "\t"))
		file.close()
		
	# Save Research DB
	file = FileAccess.open(RESEARCH_SAVE_PATH, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(ui_manager.alliance_research_db, "\t"))
		file.close()
		
	# Save Players DB
	file = FileAccess.open(PLAYERS_SAVE_PATH, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(ui_manager.global_players_db, "\t"))
		file.close()
		
	# Save Buildings DB
	file = FileAccess.open(BUILDINGS_SAVE_PATH, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(ui_manager._buildings_cache, "\t"))
		file.close()
		
	print("[AllianceSaveManager] Successfully saved runtime alliance, buildings, and player files to user://")
