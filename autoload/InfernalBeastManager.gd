# ==============================================================================
# Crownspire MMO - Infernal Beast Alliance Event Manager
# Godot 4.6 / GDScript 2.0 Central logic, state persistence, Altar progression,
# contribution rollover, damage tracking, and reward milestones manager.
# ==============================================================================

extends Node
class_name InfernalBeastManager

# --- Signals ---
signal state_updated()
signal sigils_changed(new_amount: int)
signal fight_started()
signal fight_ended()
signal boss_damaged(player_id: String, damage_dealt: int, remaining_hp: int)
signal milestone_claimed(track: String, index: int, reward_desc: String)
signal infernal_reward_requested(reward_id: String, amount: int, reward_desc: String, track: String, index: int)

# --- Config & Save File Paths ---
const CONFIG_PATH = "res://data/infernal_beast_config.json"
const SAVE_PATH = "user://crownspire_infernal_beast_v1.save"
const BAG_SAVE_PATH = "user://crownspire_bag_inventory_v1.save"

# --- Dynamic Configuration Dictionary ---
var config: Dictionary = {}

# --- Default State Structure ---
var state: Dictionary = {}
var is_initialized: bool = false

func _ready() -> void:
	initialize_manager()

func initialize_manager() -> void:
	if is_initialized:
		return
	
	_load_config()
	_load_save_state()
	is_initialized = true
	_check_status_transitions()

func _process(_delta: float) -> void:
	if not is_initialized:
		return
	
	_check_status_transitions()

# ==============================================================================
# DATA-DRIVEN CONFIGURATION LOADING & GETTERS
# ==============================================================================

func _load_config() -> void:
	config = {}
	if FileAccess.file_exists(CONFIG_PATH):
		var file = FileAccess.open(CONFIG_PATH, FileAccess.READ)
		if file:
			var content = file.get_as_text()
			file.close()
			var json = JSON.new()
			if json.parse(content) == OK:
				var data = json.get_data()
				if typeof(data) == TYPE_DICTIONARY:
					config = data

func get_cooldown_duration() -> float:
	return float(config.get("cooldown_duration_sec", 171000.0))

func get_fight_duration() -> float:
	return float(config.get("fight_duration_sec", 1800.0))

func get_boss_max_hp() -> int:
	return int(config.get("boss_max_hp", 1000000000))

func get_altar_levels() -> Array:
	return config.get("altar_levels", [
		{"level": 1, "threshold": 0, "bonus": 0.00, "name": "Lv.1 Basic Fissure"},
		{"level": 2, "threshold": 1000, "bonus": 0.05, "name": "Lv.2 Ember Hearth"},
		{"level": 3, "threshold": 3000, "bonus": 0.10, "name": "Lv.3 Molten Crucible"},
		{"level": 4, "threshold": 6000, "bonus": 0.15, "name": "Lv.4 Pyre Sanctum"},
		{"level": 5, "threshold": 10000, "bonus": 0.20, "name": "Lv.5 Abyssal Crown"}
	])

func get_milestones() -> Dictionary:
	return config.get("milestones", {
		"personal_contribution": [
			{"target": 100, "reward_id": "resource_food_100k", "amount": 2, "desc": "2x 100k Food Packs"},
			{"target": 500, "reward_id": "speedup_universal_1h", "amount": 5, "desc": "5x 1h Speedups"},
			{"target": 1000, "reward_id": "resource_diamond_1000", "amount": 1, "desc": "1,000 Diamonds"},
			{"target": 2500, "reward_id": "speedup_universal_1h", "amount": 10, "desc": "10x 1h Speedups"},
			{"target": 5000, "reward_id": "resource_diamond_1000", "amount": 2, "desc": "2,000 Diamonds"}
		],
		"personal_damage": [
			{"target": 5000000, "reward_id": "resource_iron_25k", "amount": 4, "desc": "4x 25k Iron Ore"},
			{"target": 10000000, "reward_id": "speedup_training_1h", "amount": 5, "desc": "5x 1h Training Orders"},
			{"target": 25000000, "reward_id": "resource_diamond_1000", "amount": 1, "desc": "1,000 Diamonds"},
			{"target": 50000000, "reward_id": "speedup_research_1h", "amount": 10, "desc": "10x 1h Research Scrolls"},
			{"target": 100000000, "reward_id": "resource_diamond_1000", "amount": 3, "desc": "3,000 Diamonds"},
			{"target": 250000000, "reward_id": "crafting_obsidian", "amount": 5, "desc": "5x Volcanic Obsidian Plates"}
		],
		"alliance_damage": [
			{"target": 100000000, "reward_id": "alliance_guild_points", "amount": 500, "desc": "500 Alliance Guild Points"},
			{"target": 250000000, "reward_id": "alliance_guild_points", "amount": 1000, "desc": "1,000 Alliance Guild Points"},
			{"target": 500000000, "reward_id": "alliance_guild_points", "amount": 2000, "desc": "2,000 Alliance Guild Points"},
			{"target": 1000000000, "reward_id": "resource_diamond_1000", "amount": 1, "desc": "1,000 Diamonds & 5,000 Guild Pts"},
			{"target": 2000000000, "reward_id": "resource_diamond_1000", "amount": 2, "desc": "2,000 Diamonds & 10,000 Guild Pts"},
			{"target": 5000000000, "reward_id": "resource_diamond_1000", "amount": 5, "desc": "5,000 Diamonds & 20,000 Guild Pts"}
		]
	})

# Property wrapper for backward compatibility
var MILESTONES: Dictionary:
	get:
		return get_milestones()

func get_wildling_sigil_drop(wildling_level: int) -> int:
	var drops = config.get("sigil_drops", {})
	var wildling_cfg = drops.get("wildling", {})
	var base = int(wildling_cfg.get("base", 5))
	var per_lvl = int(wildling_cfg.get("per_level", 2))
	return base + (wildling_level * per_lvl)

func get_lair_sigil_drop() -> int:
	var drops = config.get("sigil_drops", {})
	var lair_cfg = drops.get("ancient_beast_lair", {})
	return int(lair_cfg.get("victory_amount", 100))

# ==============================================================================
# STATE INITIALIZATION & SAVING
# ==============================================================================

func _load_save_state() -> void:
	state = {}
	if FileAccess.file_exists(SAVE_PATH):
		var file = FileAccess.open(SAVE_PATH, FileAccess.READ)
		if file:
			var content = file.get_as_text()
			file.close()
			var json = JSON.new()
			if json.parse(content) == OK:
				var data = json.get_data()
				if typeof(data) == TYPE_DICTIONARY:
					state = data

	# Ensure complete schema defaults
	var updated = false
	if not state.has("session_id"): state["session_id"] = "session_1"; updated = true
	if not state.has("altar_id"): state["altar_id"] = "altar_1"; updated = true
	if not state.has("cycle_id"): state["cycle_id"] = 1; updated = true
	if not state.has("status"): state["status"] = "READY"; updated = true # READY / COOLDOWN / ACTIVE / RESULTS
	if not state.has("cooldown_end_timestamp"): state["cooldown_end_timestamp"] = 0; updated = true
	if not state.has("fight_start_timestamp"): state["fight_start_timestamp"] = 0; updated = true
	if not state.has("fight_end_timestamp"): state["fight_end_timestamp"] = 0; updated = true
	if not state.has("current_cycle_contribution"): state["current_cycle_contribution"] = 0; updated = true
	if not state.has("next_cycle_contribution"): state["next_cycle_contribution"] = 0; updated = true
	if not state.has("carryover_unused"): state["carryover_unused"] = 0; updated = true
	if not state.has("altar_level_locked_for_fight"): state["altar_level_locked_for_fight"] = 1; updated = true
	if not state.has("altar_damage_bonus_locked"): state["altar_damage_bonus_locked"] = 0.0; updated = true
	if not state.has("boss_max_hp"): state["boss_max_hp"] = get_boss_max_hp(); updated = true
	if not state.has("boss_current_hp"): state["boss_current_hp"] = get_boss_max_hp(); updated = true
	if not state.has("personal_contributions"): state["personal_contributions"] = {}; updated = true
	if not state.has("personal_damage"): state["personal_damage"] = {}; updated = true
	if not state.has("alliance_damage"): state["alliance_damage"] = 0; updated = true
	if not state.has("player_infernal_sigils"): state["player_infernal_sigils"] = 150; updated = true
	if not state.has("claimed_milestones"):
		state["claimed_milestones"] = {
			"personal_contribution": [],
			"personal_damage": [],
			"alliance_damage": []
		}
		updated = true

	if updated:
		_save_state()

func _save_state() -> void:
	var file = FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(state))
		file.close()

# Check timer-based status transitions
func _check_status_transitions() -> void:
	var now = Time.get_unix_time_from_system()
	var current_status = state.get("status", "READY")
	
	if current_status == "COOLDOWN":
		var end_time = state.get("cooldown_end_timestamp", 0)
		if end_time > 0 and now >= end_time:
			# Cooldown expired -> READY
			state["status"] = "READY"
			state["cooldown_end_timestamp"] = 0
			_save_state()
			print("[InfernalBeastManager] Cooldown expired. Event is now READY for activation!")
			state_updated.emit()
			
	elif current_status == "ACTIVE":
		var fight_end = state.get("fight_end_timestamp", 0)
		if fight_end > 0 and now >= fight_end:
			# Battle completed!
			_end_fight_cycle()

# ==============================================================================
# ALTAR PROGRESSION & ROLLOVER CALCULATIONS
# ==============================================================================

# Returns information on the Altar level for a given contribution amount
func get_altar_info(contribution: int = -1) -> Dictionary:
	if contribution < 0:
		contribution = state.get("current_cycle_contribution", 0)
		
	var levels = get_altar_levels()
	var active_level = 1
	var active_bonus = 0.0
	var threshold = 0
	var next_threshold = 1000
	var max_level = levels.size()
	
	for i in range(levels.size()):
		var lvl_info = levels[i]
		if contribution >= lvl_info["threshold"]:
			active_level = lvl_info["level"]
			active_bonus = lvl_info["bonus"]
			threshold = lvl_info["threshold"]
			if i + 1 < levels.size():
				next_threshold = levels[i + 1]["threshold"]
			else:
				next_threshold = threshold
				
	var needed_for_next = max(0, next_threshold - contribution) if active_level < max_level else 0
	var altar_name = levels[active_level - 1]["name"] if active_level <= levels.size() else "Lv.1 Basic Fissure"
	
	return {
		"level": active_level,
		"bonus": active_bonus,
		"bonus_pct": int(active_bonus * 100.0),
		"threshold": threshold,
		"next_threshold": next_threshold,
		"needed_for_next": needed_for_next,
		"is_max": active_level >= max_level,
		"name": altar_name
	}

# ==============================================================================
# INFERNAL SIGILS & DONATION LOGIC
# ==============================================================================

func get_player_sigils() -> int:
	return state.get("player_infernal_sigils", 0)

func add_player_sigils(amount: int) -> void:
	if amount <= 0: return
	var current = state.get("player_infernal_sigils", 0)
	state["player_infernal_sigils"] = current + amount
	_save_state()
	sigils_changed.emit(state["player_infernal_sigils"])

func donate_sigils(amount: int, player_id: String = "Sovereign_Player") -> Dictionary:
	var owned = state.get("player_infernal_sigils", 0)
	if amount <= 0 or owned < amount:
		return {"success": false, "message": "Insufficient Infernal Sigils!"}
		
	# Deduct from player
	state["player_infernal_sigils"] = owned - amount
	
	# Track personal contribution
	var p_contribs = state.get("personal_contributions", {})
	p_contribs[player_id] = p_contribs.get(player_id, 0) + amount
	state["personal_contributions"] = p_contribs
	
	var current_status = state.get("status", "READY")
	if current_status == "ACTIVE":
		# CRITICAL RULE: Contributions made during active fight go toward NEXT cycle!
		var next_contrib = state.get("next_cycle_contribution", 0)
		state["next_cycle_contribution"] = next_contrib + amount
	else:
		# Contributions during Cooldown or Ready build current cycle Altar
		var cur_contrib = state.get("current_cycle_contribution", 0)
		state["current_cycle_contribution"] = cur_contrib + amount
		
	_save_state()
	sigils_changed.emit(state["player_infernal_sigils"])
	state_updated.emit()
	
	return {
		"success": true,
		"donated": amount,
		"remaining_sigils": state["player_infernal_sigils"],
		"current_cycle_total": state["current_cycle_contribution"],
		"next_cycle_total": state["next_cycle_contribution"]
	}

# ==============================================================================
# FIGHT ACTIVATION & LEADERSHIP CONTROLS
# ==============================================================================

func can_start_fight(player_rank: String) -> bool:
	var current_status = state.get("status", "READY")
	if current_status != "READY":
		return false
	return player_rank in ["R4", "R5"]

func start_fight(player_rank: String) -> Dictionary:
	if not can_start_fight(player_rank):
		return {"success": false, "message": "Only R4/R5 leadership can activate the Infernal Beast when READY."}
		
	var contrib = state.get("current_cycle_contribution", 0)
	var altar_info = get_altar_info(contrib)
	
	# LOCK current Altar level & damage bonus for this fight
	var locked_lvl = altar_info["level"]
	var locked_bonus = altar_info["bonus"]
	var used_contrib = altar_info["threshold"]
	var unused_carryover = contrib - used_contrib
	var fight_duration = get_fight_duration()
	var max_hp = get_boss_max_hp()
	
	state["status"] = "ACTIVE"
	state["altar_level_locked_for_fight"] = locked_lvl
	state["altar_damage_bonus_locked"] = locked_bonus
	state["carryover_unused"] = unused_carryover
	
	var now = Time.get_unix_time_from_system()
	state["fight_start_timestamp"] = now
	state["fight_end_timestamp"] = now + fight_duration
	
	# Initialize persistent boss HP & cycle damage counters
	state["boss_max_hp"] = max_hp
	state["boss_current_hp"] = max_hp
	state["personal_damage"] = {}
	state["alliance_damage"] = 0
	
	_save_state()
	print("[InfernalBeastManager] START INFERNAL BEAST! Locked Altar Lv.", locked_lvl, " (+", int(locked_bonus * 100), "% bonus). Carryover: ", unused_carryover)
	fight_started.emit()
	state_updated.emit()
	
	return {
		"success": true,
		"locked_level": locked_lvl,
		"locked_bonus_pct": int(locked_bonus * 100),
		"used_contribution": used_contrib,
		"carryover_unused": unused_carryover,
		"fight_duration_sec": fight_duration
	}

func _end_fight_cycle() -> void:
	state["status"] = "COOLDOWN"
	
	var now = Time.get_unix_time_from_system()
	var cd_duration = get_cooldown_duration()
	state["cooldown_end_timestamp"] = now + cd_duration
	
	# CONSUMPTION & ROLLOVER LOGIC:
	# Carryover unused contribution + new donations made during active fight
	var unused = state.get("carryover_unused", 0)
	var next_donations = state.get("next_cycle_contribution", 0)
	var rollover = unused + next_donations
	
	state["current_cycle_contribution"] = rollover
	state["next_cycle_contribution"] = 0
	state["carryover_unused"] = 0
	state["altar_level_locked_for_fight"] = 1
	state["altar_damage_bonus_locked"] = 0.0
	state["cycle_id"] = state.get("cycle_id", 1) + 1
	
	_save_state()
	print("[InfernalBeastManager] Fight ended! Cooldown started (", cd_duration, "s). Rollover contribution for next cycle: ", rollover)
	fight_ended.emit()
	state_updated.emit()

# ==============================================================================
# DAMAGE CALCULATION & ATTRIBUTION
# ==============================================================================

func record_boss_damage(player_id: String, base_damage: int, _is_rally: bool = true) -> int:
	if state.get("status", "") != "ACTIVE":
		return 0
		
	var bonus = state.get("altar_damage_bonus_locked", 0.0)
	var final_damage = int(base_damage * (1.0 + bonus))
	
	# Apply to boss HP
	var cur_hp = state.get("boss_current_hp", get_boss_max_hp())
	var new_hp = max(0, cur_hp - final_damage)
	state["boss_current_hp"] = new_hp
	
	# Update personal and alliance damage
	var p_dmg = state.get("personal_damage", {})
	p_dmg[player_id] = p_dmg.get(player_id, 0) + final_damage
	state["personal_damage"] = p_dmg
	
	var total_alliance_dmg = state.get("alliance_damage", 0) + final_damage
	state["alliance_damage"] = total_alliance_dmg
	
	if new_hp == 0:
		# Defeat HP refill logic: reset boss HP for continuous battle scoring if configured
		if config.get("boss_refill_on_defeat", true):
			state["boss_current_hp"] = state.get("boss_max_hp", get_boss_max_hp())
			print("[InfernalBeastManager] Infernal Beast HP depleted! Respawning HP for continuous battle as configured.")
		
	_save_state()
	boss_damaged.emit(player_id, final_damage, state["boss_current_hp"])
	state_updated.emit()
	
	return final_damage

# ==============================================================================
# REWARD CLAIMING & PRODUCTION INTEGRATION HOOK
# ==============================================================================

func is_milestone_claimed(track: String, index: int) -> bool:
	var claimed = state.get("claimed_milestones", {}).get(track, [])
	return index in claimed

func can_claim_milestone(track: String, index: int, player_id: String = "Sovereign_Player") -> bool:
	if is_milestone_claimed(track, index):
		return false
		
	var track_list = get_milestones().get(track, [])
	if index < 0 or index >= track_list.size():
		return false
		
	var target = track_list[index]["target"]
	var score = 0
	
	if track == "personal_contribution":
		score = state.get("personal_contributions", {}).get(player_id, 0)
	elif track == "personal_damage":
		score = state.get("personal_damage", {}).get(player_id, 0)
	elif track == "alliance_damage":
		score = state.get("alliance_damage", 0)
		
	return score >= target

func claim_milestone(track: String, index: int, player_id: String = "Sovereign_Player") -> Dictionary:
	if not can_claim_milestone(track, index, player_id):
		return {"success": false, "message": "Milestone condition not met or already claimed."}
		
	var track_list = get_milestones().get(track, [])
	var milestone = track_list[index]
	
	var claimed_dict = state.get("claimed_milestones", {})
	var list = claimed_dict.get(track, [])
	if not index in list:
		list.append(index)
		claimed_dict[track] = list
		state["claimed_milestones"] = claimed_dict
		
	var reward_id = milestone["reward_id"]
	var amount = milestone["amount"]
	var desc = milestone["desc"]
	
	_save_state()
	
	# Primary Integration Boundary: Emit signal for production inventory/resource services
	infernal_reward_requested.emit(reward_id, amount, desc, track, index)
	
	# Standalone AI Studio test fallback (DEBUG BUILDS ONLY)
	if OS.is_debug_build():
		_debug_fallback_credit_bag_reward(reward_id, amount)
	
	milestone_claimed.emit(track, index, desc)
	state_updated.emit()
	
	return {"success": true, "reward_desc": desc}

func _debug_fallback_credit_bag_reward(reward_id: String, amount: int) -> void:
	if not OS.is_debug_build():
		return
	var inventory = {}
	if FileAccess.file_exists(BAG_SAVE_PATH):
		var file = FileAccess.open(BAG_SAVE_PATH, FileAccess.READ)
		if file:
			var text = file.get_as_text()
			file.close()
			var json = JSON.new()
			if json.parse(text) == OK and typeof(json.get_data()) == TYPE_DICTIONARY:
				inventory = json.get_data()
				
	if reward_id == "resource_diamond_1000":
		inventory["diamonds"] = inventory.get("diamonds", 0) + (amount * 1000)
	else:
		inventory[reward_id] = inventory.get(reward_id, 0) + amount
		
	var save_file = FileAccess.open(BAG_SAVE_PATH, FileAccess.WRITE)
	if save_file:
		save_file.store_string(JSON.stringify(inventory))
		save_file.close()

# ==============================================================================
# DEBUG / TESTING TOOLS (OS.is_debug_build() Protected)
# ==============================================================================

func debug_add_sigils(amount: int) -> void:
	if not OS.is_debug_build(): return
	add_player_sigils(amount)

func debug_donate_next_level() -> void:
	if not OS.is_debug_build(): return
	var cur_contrib = state.get("current_cycle_contribution", 0)
	var info = get_altar_info(cur_contrib)
	var needed = info["needed_for_next"]
	if needed <= 0: needed = 1000
	add_player_sigils(needed)
	donate_sigils(needed)

func debug_set_ready() -> void:
	if not OS.is_debug_build(): return
	state["status"] = "READY"
	state["cooldown_end_timestamp"] = 0
	_save_state()
	state_updated.emit()

func debug_start_fight() -> void:
	if not OS.is_debug_build(): return
	state["status"] = "READY"
	start_fight("R5")

func debug_add_boss_damage(amount: int) -> void:
	if not OS.is_debug_build(): return
	record_boss_damage("Sovereign_Player", amount, true)

func debug_end_fight() -> void:
	if not OS.is_debug_build(): return
	_end_fight_cycle()

func debug_complete_cycle() -> void:
	if not OS.is_debug_build(): return
	debug_set_ready()
	start_fight("R5")
	record_boss_damage("Sovereign_Player", 500000000, true)
	_end_fight_cycle()

func debug_new_cycle() -> void:
	if not OS.is_debug_build(): return
	state["status"] = "READY"
	state["current_cycle_contribution"] = 0
	state["next_cycle_contribution"] = 0
	state["carryover_unused"] = 0
	state["personal_damage"] = {}
	state["alliance_damage"] = 0
	state["claimed_milestones"] = {
		"personal_contribution": [],
		"personal_damage": [],
		"alliance_damage": []
	}
	_save_state()
	state_updated.emit()
