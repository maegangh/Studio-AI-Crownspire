extends Node

# ==========================================
# CROWNSPIRE SETTINGS & PROFILE MANAGER (AUTOLOAD)
# ==========================================
# Manages persistent game configurations, graphic profiles, audio servers,
# localization preferences, profile customizations (portraits, frames, titles, skins),
# redeemable promo codes, statistics, and achievement logs.

signal settings_changed()
signal customization_updated(category: String, item_id: String)
signal profile_name_changed(new_name: String)

const SAVE_PATH = "user://crownspire_settings_state.save"

# --- DEFAULT SETTINGS STATE ---
var settings: Dictionary = {
	"audio": {
		"master_volume": 80.0,
		"music_volume": 70.0,
		"sfx_volume": 85.0,
		"ui_sounds": true
	},
	"graphics": {
		"profile": "High", # "Battery Saver", "Medium", "High"
		"frame_rate": 60,   # 30, 60
		"battery_saver": false,
		"shadows_enabled": true,
		"bloom_enabled": true
	},
	"gameplay": {
		"camera_shake": true,
		"screen_flashes": true,
		"show_coordinates": true,
		"auto_translate": true
	},
	"notifications": {
		"push_enabled": true,
		"energy_full": true,
		"shield_expiry": true,
		"alliance_rallies": true,
		"mail_received": true
	},
	"language": {
		"current": "en", # "en", "es", "fr", "de"
	},
	"privacy": {
		"analytics": true,
		"personalization": true,
		"public_profile": true
	},
	"profile": {
		"account_created_timestamp": 0,
		"active_avatar": "🧙",
		"active_frame": "Royal Filigree",
		"active_title": "Sovereign of Dawn",
		"active_castle_skin": "Default Citadel",
		"active_march_skin": "Royal Cavalry",
		"linked_accounts": ["Google Play Games"],
		"unlocked_avatars": ["🧙", "🦁", "🧝", "🛡️", "👑", "🏹"],
		"unlocked_frames": ["Default Wood", "Royal Filigree", "Crystallite Ring"],
		"unlocked_titles": ["Initiate", "Sovereign of Dawn", "Guild Marshal"],
		"unlocked_castle_skins": ["Default Citadel", "Crystallite Spire"],
		"unlocked_march_skins": ["Royal Cavalry", "Sovereign Pegasi"]
	}
}

# --- STATIC DATA ---
var supported_languages: Array = [
	{"code": "en", "name": "English", "flag": "🇺🇸"},
	{"code": "es", "name": "Español", "flag": "🇪🇸"},
	{"code": "fr", "name": "Français", "flag": "🇫🇷"},
	{"code": "de", "name": "Deutsch", "flag": "🇩🇪"}
]

var graphics_profiles: Array = [
	{"name": "Battery Saver", "fps": 30, "shadows": false, "bloom": false},
	{"name": "Medium", "fps": 60, "shadows": false, "bloom": true},
	{"name": "High", "fps": 60, "shadows": true, "bloom": true}
]

var player_statistics: Array = [
	{"category": "Military", "name": "Kingdoms Conquered", "value": "14"},
	{"category": "Military", "name": "Troops Trained", "value": "124,500"},
	{"category": "Military", "name": "Keeps Cleared", "value": "37"},
	{"category": "Economy", "name": "Wood Gathered", "value": "1.45M"},
	{"category": "Economy", "name": "Gold Produced", "value": "980,000"},
	{"category": "Social", "name": "Alliance Donations", "value": "85,000 Pts"},
	{"category": "Social", "name": "VIP Daily Streak", "value": "12 Days"},
	{"category": "System", "name": "Total Playtime", "value": "48h 15m"}
]

var achievements: Array = [
	{"id": "ach_1", "name": "Sovereign Builder", "desc": "Construct a Level 25 Citadel", "progress": "25 / 25", "completed": true, "reward": "👑 Emperor Title"},
	{"id": "ach_2", "name": "Legion Commander", "desc": "Train 100,000 total troops", "progress": "100K / 100K", "completed": true, "reward": "💎 1,000 Crystals"},
	{"id": "ach_3", "name": "Crystallite Sage", "desc": "Reach VIP Tier 5", "progress": "4 / 5", "completed": false, "reward": "🌟 Star Badge"},
	{"id": "ach_4", "name": "Keeps Crusher", "desc": "Conquer 50 Ruined Spire Keeps", "progress": "37 / 50", "completed": false, "reward": "🛡️ Aegis Frame"},
	{"id": "ach_5", "name": "Guild Shield", "desc": "Donate 50,000 Honor to Alliance", "progress": "85K / 50K", "completed": true, "reward": "🤝 Guild Ring"}
]

var debug_account_age_override_sec: int = -1

func _ready() -> void:
	load_settings()
	_ensure_account_created_timestamp()
	apply_all_settings()

# --- SAVE & LOAD ---
func save_settings() -> void:
	var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(settings))
		file.close()
		print("[SettingsManager] Saved preferences successfully.")

func load_settings() -> void:
	if not FileAccess.file_exists(SAVE_PATH):
		print("[SettingsManager] No saved preferences found, using defaults.")
		_ensure_account_created_timestamp()
		return
		
	var file := FileAccess.open(SAVE_PATH, FileAccess.READ)
	if file:
		var json = JSON.new()
		var error = json.parse(file.get_as_text())
		file.close()
		if error == OK:
			var loaded_settings = json.get_data()
			if typeof(loaded_settings) == TYPE_DICTIONARY:
				_merge_dictionaries(settings, loaded_settings)
				print("[SettingsManager] Loaded preferences successfully.")
	_ensure_account_created_timestamp()

func _ensure_account_created_timestamp() -> void:
	if not settings.has("profile"):
		settings["profile"] = {}
	var prof: Dictionary = settings["profile"]
	if not prof.has("account_created_timestamp") or int(prof["account_created_timestamp"]) <= 0:
		prof["account_created_timestamp"] = int(Time.get_unix_time_from_system())
		save_settings()
		print("[SettingsManager] Initialized account_created_timestamp: ", prof["account_created_timestamp"])

func get_account_created_timestamp() -> int:
	_ensure_account_created_timestamp()
	return int(settings["profile"]["account_created_timestamp"])

func get_account_age_seconds() -> int:
	if OS.is_debug_build() and debug_account_age_override_sec >= 0:
		return debug_account_age_override_sec
	var created_ts = get_account_created_timestamp()
	var now = int(Time.get_unix_time_from_system())
	return max(0, now - created_ts)

func get_account_age_days() -> float:
	return float(get_account_age_seconds()) / 86400.0

func get_rookie_event_day() -> int:
	var sec = get_account_age_seconds()
	var day_num = int(sec / 86400) + 1
	return day_num

# --- DEBUG TESTING TOOLS FOR ROOKIE EVENT ---
func debug_set_rookie_day(day_num: int) -> void:
	if not OS.is_debug_build(): return
	var target_day = clamp(day_num, 1, 7)
	debug_account_age_override_sec = (target_day - 1) * 86400 + 3600
	print("[SettingsManager DEBUG] Set rookie account age override to Day ", target_day, " (", debug_account_age_override_sec, "s)")

func debug_set_rookie_grace_period() -> void:
	if not OS.is_debug_build(): return
	debug_account_age_override_sec = 7 * 86400 + 3600 # Day 8
	print("[SettingsManager DEBUG] Set rookie account age override to Grace Period (Day 8)")

func debug_expire_rookie_event() -> void:
	if not OS.is_debug_build(): return
	debug_account_age_override_sec = 9 * 86400 + 3600 # Day 10 (expired)
	print("[SettingsManager DEBUG] Set rookie account age override to Expired")

func debug_reset_rookie_age_override() -> void:
	if not OS.is_debug_build(): return
	debug_account_age_override_sec = -1
	print("[SettingsManager DEBUG] Reset account age override to real timestamp")

func _merge_dictionaries(target: Dictionary, source: Dictionary) -> void:
	for key in source.keys():
		if target.has(key):
			if typeof(target[key]) == TYPE_DICTIONARY and typeof(source[key]) == TYPE_DICTIONARY:
				_merge_dictionaries(target[key], source[key])
			else:
				target[key] = source[key]

# --- APPLICATIONS OF PREFERENCES ---
func apply_all_settings() -> void:
	apply_audio_settings()
	apply_graphics_settings()
	settings_changed.emit()

func apply_audio_settings() -> void:
	var audio_conf = settings["audio"]
	
	# Map values to Decibels: 0 to 100 -> -40dB to 0dB, with 0 volume being muted
	var master_db = -40.0 + (audio_conf["master_volume"] / 100.0) * 40.0 if audio_conf["master_volume"] > 0 else -80.0
	var music_db = -40.0 + (audio_conf["music_volume"] / 100.0) * 40.0 if audio_conf["music_volume"] > 0 else -80.0
	var sfx_db = -40.0 + (audio_conf["sfx_volume"] / 100.0) * 40.0 if audio_conf["sfx_volume"] > 0 else -80.0
	
	# Apply to standard Godot Audio Buses if they exist
	for bus_name in ["Master", "Music", "SFX"]:
		var bus_index = AudioServer.get_bus_index(bus_name)
		if bus_index != -1:
			var db_val = master_db
			if bus_name == "Music": db_val = music_db
			elif bus_name == "SFX": db_val = sfx_db
			AudioServer.set_bus_volume_db(bus_index, db_val)
			AudioServer.set_bus_mute(bus_index, db_val <= -79.0)

func apply_graphics_settings() -> void:
	var graph_conf = settings["graphics"]
	
	# Apply Max Frame Rate
	Engine.max_fps = graph_conf["frame_rate"]
	
	# Battery saver dynamic quality tweaks
	if graph_conf["battery_saver"]:
		Engine.max_fps = 30
		# Apply sub-viewport resolutions scale if supported
		get_viewport().scaling_3d_scale = 0.75
	else:
		get_viewport().scaling_3d_scale = 1.0

# --- PROFILE CUSTOMIZATIONS ---
func update_customization(category: String, item_id: String) -> void:
	var prof = settings["profile"]
	match category:
		"avatar":
			if item_id in prof["unlocked_avatars"]:
				prof["active_avatar"] = item_id
		"frame":
			if item_id in prof["unlocked_frames"]:
				prof["active_frame"] = item_id
		"title":
			if item_id in prof["unlocked_titles"]:
				prof["active_title"] = item_id
		"castle":
			if item_id in prof["unlocked_castle_skins"]:
				prof["active_castle_skin"] = item_id
		"march":
			if item_id in prof["unlocked_march_skins"]:
				prof["active_march_skin"] = item_id
				
	customization_updated.emit(category, item_id)
	save_settings()

func change_player_name(new_name: String) -> Dictionary:
	if new_name.strip_edges().is_empty():
		return {"success": false, "message": "Royal Decree: Name cannot be empty!"}
	if new_name.length() > 24:
		return {"success": false, "message": "Royal Decree: Name is too lengthy!"}
		
	UIManager.player_name = new_name
	profile_name_changed.emit(new_name)
	save_settings()
	return {"success": true, "message": "Lord name changed successfully!"}

# --- REDEEM PROMO CODES ---
func redeem_code(code: String) -> Dictionary:
	var clean_code = code.strip_edges().to_upper()
	if clean_code.is_empty():
		return {"success": false, "message": "Redemption scroll is blank!"}
		
	var rewards: Array[Dictionary] = []
	var success_msg = ""
	
	match clean_code:
		"CROWNSPIRE2026":
			rewards = [
				{"name": "Royal Crystals", "quantity": 1000, "rarity": 3},
				{"name": "Gold Coins", "quantity": 50000, "rarity": 2}
			]
			success_msg = "Sovereign Welcomes! 1,000 Royal Crystals granted."
		"AURELIUS":
			rewards = [
				{"name": "VIP Prestige Favors", "quantity": 1200, "rarity": 3},
				{"name": "Aurora Crystals", "quantity": 500, "rarity": 3}
			]
			success_msg = "Heir of Aurelius: 1,200 VIP points and 500 Aurora Crystals!"
		"ROYALTY":
			rewards = [
				{"name": "Timber Provisions", "quantity": 100000, "rarity": 2},
				{"name": "Granite Provisions", "quantity": 50000, "rarity": 2}
			]
			success_msg = "Citadel Reborn package: 100,000 Wood and 50,000 Stone!"
		_:
			return {"success": false, "message": "Royal Scribes: Invalid or expired redeem code!"}
			
	# Disburse currency and notify UIManager
	for r in rewards:
		if "Crystals" in r["name"]:
			if "Royal" in r["name"]:
				UIManager.royal_crystals += r["quantity"]
			else:
				UIManager.aurora_crystals += r["quantity"]
		elif "Gold" in r["name"]:
			UIManager.gold += r["quantity"]
		elif "Provisions" in r["name"]:
			if "Timber" in r["name"]:
				UIManager.wood += r["quantity"]
			elif "Granite" in r["name"]:
				UIManager.stone += r["quantity"]
		elif "VIP" in r["name"]:
			UIManager.vip_points += r["quantity"]
			if UIManager.vip_points >= UIManager.vip_level * 1000:
				UIManager.vip_points -= UIManager.vip_level * 1000
				UIManager.vip_level += 1
				
	# Emit global reward signal to trigger HUD congratulations popup
	UIManager.reward_claimed.emit(rewards)
	
	# Save changes
	UIManager.save_player_state()
	
	return {
		"success": true,
		"message": success_msg,
		"rewards": rewards
	}
