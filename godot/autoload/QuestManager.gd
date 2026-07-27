extends Node
class_name QuestManager

# ==========================================
# CROWNSPIRE QUEST & PROGRESSION SYSTEM (AUTOLOAD)
# ==========================================

const SAVE_PATH = "user://crownspire_quests_state.save"

# In-memory database of all quests loaded from JSONs
var quests_db: Array = []
var milestone_rewards: Array = []
var sovereigns_journey_config: Dictionary = {}

# Progression states
var daily_activity_points: int = 0
var weekly_activity_points: int = 0
var claimed_daily_milestones: Array = [] # Array of indices
var claimed_weekly_milestones: Array = [] # Array of indices
var claimed_rookie_daily_chests: Array = [] # Array of day numbers (1..7)
var claimed_rookie_overall_milestones: Array = [] # Array of milestone indices (0..4)

# Pinning and resets
var pinned_quest_ids: Array = []
var last_daily_reset: int = 0
var last_weekly_reset: int = 0

var is_initialized: bool = false

# --- SIGNALS ---
signal quest_list_updated()
signal quest_progress_changed(quest_id: String, objective_id: String, current: int, target: int)
signal quest_state_changed(quest_id: String, state_type: String) # "completed", "claimed", "pinned", "unpinned"
signal activity_points_changed(daily_pts: int, weekly_pts: int)
signal reset_triggered(reset_type: String) # "daily", "weekly"
signal milestone_claimed(milestone_type: String, index: int, rewards: Array)

func _ready() -> void:
	# Autoload hook initialization
	initialize_quests()

# Central bootloader
func initialize_quests() -> void:
	if is_initialized:
		return
		
	quests_db.clear()
	pinned_quest_ids.clear()
	claimed_daily_milestones.clear()
	claimed_weekly_milestones.clear()
	
	# Load default config templates from data files
	_load_database_files()
	
	# Load user persistent progression state
	if FileAccess.file_exists(SAVE_PATH):
		_load_save_state()
	else:
		_setup_initial_reset_timestamps()
		_save_state()
		
	is_initialized = true
	
	# Perform safety check for time resets
	_check_and_process_resets()
	
	# Connect to existing UIManager gameplay signals to drive automatic progress
	_connect_to_gameplay_signals()
	
	# Fire initial update
	quest_list_updated.emit()
	activity_points_changed.emit(daily_activity_points, weekly_activity_points)

func _load_database_files() -> void:
	# Load Sovereign's Journey event configuration first
	sovereigns_journey_config = _load_json_dict("res://data/sovereigns_journey_config.json")
	if sovereigns_journey_config.is_empty():
		sovereigns_journey_config = _load_json_dict("res://godot/data/sovereigns_journey_config.json")

	# Categories files
	var main_quests = _load_json_file("res://data/quests/main_story.json")
	var daily_quests = _load_json_file("res://data/quests/daily_quests.json")
	var weekly_quests = _load_json_file("res://data/quests/weekly_quests.json")
	var event_quests = _load_json_file("res://data/quests/event_quests.json")
	var hero_quests = _load_json_file("res://data/quests/hero_quests.json")
	var alliance_quests = _load_json_file("res://data/quests/alliance_quests.json")
	var intel_quests = _load_json_file("res://data/quests/intel_quests.json")
	var wayfinder_quests = _load_json_file("res://data/quests/wayfinder_quests.json")
	var vault_quests = _load_json_file("res://data/quests/crystal_vault_quests.json")
	var rookie_quests = _load_json_file("res://data/quests/rookie_quests.json")
	
	# Append to master quests database
	quests_db.append_array(main_quests)
	quests_db.append_array(daily_quests)
	quests_db.append_array(weekly_quests)
	quests_db.append_array(event_quests)
	quests_db.append_array(hero_quests)
	quests_db.append_array(alliance_quests)
	quests_db.append_array(intel_quests)
	quests_db.append_array(wayfinder_quests)
	quests_db.append_array(vault_quests)
	quests_db.append_array(rookie_quests)
	
	# Ensure basic types on quests
	for q in quests_db:
		if not q.has("is_completed"): q["is_completed"] = false
		if not q.has("is_claimed"): q["is_claimed"] = false
		if not q.has("is_pinned"): q["is_pinned"] = false
		if not q.has("objectives"): q["objectives"] = []
		if not q.has("rewards"): q["rewards"] = []
		
		# Sanitize objectives
		for obj in q["objectives"]:
			if not obj.has("current"): obj["current"] = 0
			if not obj.has("completed"): obj["completed"] = false
			
	# Load milestone activity reward chests configurations
	milestone_rewards = _load_json_file("res://data/quests/quest_rewards.json")

# Dynamic gameplay hooks mapping
func _connect_to_gameplay_signals() -> void:
	if not Engine.has_singleton("UIManager"):
		# Fallback if UIManager is standard autoload Node
		var ui_mgr = get_node_or_null("/root/UIManager")
		if ui_mgr:
			_bind_ui_mgr(ui_mgr)
	else:
		var ui_mgr = Engine.get_singleton("UIManager")
		_bind_ui_mgr(ui_mgr)

func _bind_ui_mgr(ui_mgr: Node) -> void:
	if ui_mgr.has_signal("building_updated"):
		ui_mgr.building_updated.connect(_on_building_updated)
	if ui_mgr.has_signal("technology_researched"):
		ui_mgr.technology_researched.connect(_on_technology_researched)
	if ui_mgr.has_signal("troops_trained"):
		ui_mgr.troops_trained.connect(_on_troops_trained)
	if ui_mgr.has_signal("alliance_updated"):
		ui_mgr.alliance_updated.connect(_on_alliance_updated)
	if ui_mgr.has_signal("reward_claimed"):
		ui_mgr.reward_claimed.connect(_on_reward_claimed)

# --- SAVE & LOAD ENGINGES ---

func _save_state() -> void:
	var quests_progress_states := []
	for q in quests_db:
		var obj_states := []
		for obj in q["objectives"]:
			obj_states.append({
				"id": obj["id"],
				"current": obj["current"],
				"completed": obj["completed"]
			})
		quests_progress_states.append({
			"id": q["id"],
			"is_completed": q["is_completed"],
			"is_claimed": q["is_claimed"],
			"is_pinned": q["is_pinned"],
			"objectives": obj_states
		})
		
	var state := {
		"daily_points": daily_activity_points,
		"weekly_points": weekly_activity_points,
		"claimed_daily_milestones": claimed_daily_milestones,
		"claimed_weekly_milestones": claimed_weekly_milestones,
		"claimed_rookie_daily_chests": claimed_rookie_daily_chests,
		"claimed_rookie_overall_milestones": claimed_rookie_overall_milestones,
		"pinned_quest_ids": pinned_quest_ids,
		"last_daily_reset": last_daily_reset,
		"last_weekly_reset": last_weekly_reset,
		"quests_progress": quests_progress_states
	}
	
	var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(state))
		file.close()

func _load_save_state() -> void:
	var file := FileAccess.open(SAVE_PATH, FileAccess.READ)
	if file:
		var json = JSON.new()
		var error = json.parse(file.get_as_text())
		file.close()
		if error == OK:
			var state = json.get_data()
			if typeof(state) == TYPE_DICTIONARY:
				daily_activity_points = int(state.get("daily_points", 0))
				weekly_activity_points = int(state.get("weekly_points", 0))
				claimed_daily_milestones = state.get("claimed_daily_milestones", [])
				claimed_weekly_milestones = state.get("claimed_weekly_milestones", [])
				claimed_rookie_daily_chests = state.get("claimed_rookie_daily_chests", [])
				claimed_rookie_overall_milestones = state.get("claimed_rookie_overall_milestones", [])
				pinned_quest_ids = state.get("pinned_quest_ids", [])
				last_daily_reset = int(state.get("last_daily_reset", 0))
				last_weekly_reset = int(state.get("last_weekly_reset", 0))
				
				# Restore quests progression
				var progress_list = state.get("quests_progress", []) as Array
				for q_prog in progress_list:
					var q_id = q_prog.get("id", "")
					var master_q = _find_quest_in_db(q_id)
					if master_q:
						master_q["is_completed"] = q_prog.get("is_completed", false)
						master_q["is_claimed"] = q_prog.get("is_claimed", false)
						master_q["is_pinned"] = q_prog.get("is_pinned", false)
						
						# Restore objectives
						var obj_list = q_prog.get("objectives", []) as Array
						for obj_prog in obj_list:
							var obj_id = obj_prog.get("id", "")
							for master_obj in master_q["objectives"]:
								if master_obj["id"] == obj_id:
									master_obj["current"] = int(obj_prog.get("current", 0))
									master_obj["completed"] = obj_prog.get("completed", false)

func _setup_initial_reset_timestamps() -> void:
	var now = int(Time.get_unix_time_from_system())
	last_daily_reset = now
	last_weekly_reset = now

func _check_and_process_resets() -> void:
	var now = int(Time.get_unix_time_from_system())
	
	# Daily Reset: 86400 seconds (24 hours)
	var time_since_daily = now - last_daily_reset
	if time_since_daily >= 86400:
		_perform_daily_reset()
		last_daily_reset = now - (time_since_daily % 86400) # Keep anchor
		_save_state()
		
	# Weekly Reset: 604800 seconds (7 days)
	var time_since_weekly = now - last_weekly_reset
	if time_since_weekly >= 604800:
		_perform_weekly_reset()
		last_weekly_reset = now - (time_since_weekly % 604800) # Keep anchor
		_save_state()

func _perform_daily_reset() -> void:
	print("[Crownspire QuestManager] Performing Daily Reset...")
	daily_activity_points = 0
	claimed_daily_milestones.clear()
	
	# Reset progress on all Daily category quests
	for q in quests_db:
		if q.get("category_id") == "daily":
			q["is_completed"] = false
			q["is_claimed"] = false
			for obj in q["objectives"]:
				obj["current"] = 0
				obj["completed"] = false
				
	reset_triggered.emit("daily")
	quest_list_updated.emit()
	activity_points_changed.emit(daily_activity_points, weekly_activity_points)

func _perform_weekly_reset() -> void:
	print("[Crownspire QuestManager] Performing Weekly Reset...")
	weekly_activity_points = 0
	claimed_weekly_milestones.clear()
	
	# Reset progress on all Weekly category quests
	for q in quests_db:
		if q.get("category_id") == "weekly":
			q["is_completed"] = false
			q["is_claimed"] = false
			for obj in q["objectives"]:
				obj["current"] = 0
				obj["completed"] = false
				
	reset_triggered.emit("weekly")
	quest_list_updated.emit()
	activity_points_changed.emit(daily_activity_points, weekly_activity_points)

# --- TRIGGER ACTIONS / GAMEPLAY PROGRESSION MAP ---

func trigger_progress(objective_type: String, target_id: String, amount: int) -> void:
	var updated := false
	_check_and_process_resets()
	
	var settings_mgr = get_node_or_null("/root/SettingsManager")
	var rookie_day = settings_mgr.get_rookie_event_day() if (settings_mgr and settings_mgr.has_method("get_rookie_event_day")) else 1
	var rookie_expired = is_rookie_event_expired()
	var rookie_unlocked_day = min(7, rookie_day)
	
	for q in quests_db:
		if q["is_completed"] or q["is_claimed"]:
			continue
			
		if q.get("category_id") == "rookie":
			if rookie_expired:
				continue # Event ENDED: no Rookie objective progression
			if int(q.get("day", 1)) > rookie_unlocked_day:
				continue # Future day objective group not unlocked yet
			
		var quest_updated_this_turn = false
		for obj in q["objectives"]:
			if obj["completed"]:
				continue
				
			var matches_type = obj.get("type", "") == objective_type
			var matches_target = target_id == "" or obj.get("target_id", "") == "" or obj.get("target_id", "") == target_id
			
			if matches_type and matches_target:
				var prev = int(obj["current"])
				obj["current"] = min(prev + amount, int(obj["target"]))
				
				if obj["current"] >= int(obj["target"]):
					obj["completed"] = true
					
				quest_progress_changed.emit(q["id"], obj["id"], obj["current"], int(obj["target"]))
				quest_updated_this_turn = true
				updated = true
				
		if quest_updated_this_turn:
			# Check if ALL objectives under this quest are now complete
			var all_done = true
			for obj in q["objectives"]:
				if not obj["completed"]:
					all_done = false
					break
			if all_done:
				q["is_completed"] = true
				quest_state_changed.emit(q["id"], "completed")
				
				# Push trigger notifications via Game NotificationManager if available
				_send_quest_completed_notification(q["name"])
				
	if updated:
		_save_state()
		quest_list_updated.emit()

func trigger_progress_general(objective_type: String, amount: int) -> void:
	trigger_progress(objective_type, "", amount)

# --- UIManager SIGNAL HANDLER CALBACKS ---

func _on_building_updated(building_id: String, new_level: int) -> void:
	# Trigger upgrades progress (amount = 1 or new level based on requirements)
	# Some quests ask for "Reach Keep level 5" which requires absolute checking
	_check_absolute_quest_conditions("building_upgrade", building_id, new_level)
	trigger_progress("building_upgrade", building_id, 1)

func _on_technology_researched(tech_id: String, new_level: int) -> void:
	_check_absolute_quest_conditions("research_tech", tech_id, new_level)
	trigger_progress("research_tech", tech_id, 1)

func _on_troops_trained(troop_id: String, quantity: int) -> void:
	trigger_progress("troop_train", troop_id, quantity)

func _on_alliance_updated() -> void:
	# Check if alliance metrics trigger any co-op goals
	trigger_progress("alliance_activity", "", 1)

func _on_reward_claimed(items_rewarded: Array) -> void:
	# Loop and trigger resources gathers, chest opens etc.
	for item in items_rewarded:
		var name_str = item.get("name", "").to_lower()
		var qty = int(item.get("quantity", 1))
		
		if "wood" in name_str or "timber" in name_str:
			trigger_progress("gather_res", "wood", qty)
		elif "food" in name_str or "provision" in name_str:
			trigger_progress("gather_res", "food", qty)
		elif "stone" in name_str or "granite" in name_str:
			trigger_progress("gather_res", "stone", qty)
		elif "iron" in name_str or "ore" in name_str:
			trigger_progress("gather_res", "iron", qty)
		elif "crystallite" in name_str:
			trigger_progress("gather_res", "crystallite", qty)

func _check_absolute_quest_conditions(type: String, target_id: String, absolute_val: int) -> void:
	var updated := false
	var settings_mgr = get_node_or_null("/root/SettingsManager")
	var rookie_day = settings_mgr.get_rookie_event_day() if (settings_mgr and settings_mgr.has_method("get_rookie_event_day")) else 1
	var rookie_expired = is_rookie_event_expired()
	var rookie_unlocked_day = min(7, rookie_day)

	for q in quests_db:
		if q["is_completed"] or q["is_claimed"]:
			continue
		if q.get("category_id") == "rookie":
			if rookie_expired:
				continue
			if int(q.get("day", 1)) > rookie_unlocked_day:
				continue
		for obj in q["objectives"]:
			if obj.get("type", "") == type and obj.get("target_id", "") == target_id:
				if absolute_val >= int(obj["target"]):
					obj["current"] = int(obj["target"])
					obj["completed"] = true
					updated = true
					
					quest_progress_changed.emit(q["id"], obj["id"], obj["current"], int(obj["target"]))
					
		if updated:
			var all_done = true
			for obj in q["objectives"]:
				if not obj["completed"]:
					all_done = false
					break
			if all_done:
				q["is_completed"] = true
				quest_state_changed.emit(q["id"], "completed")
				_send_quest_completed_notification(q["name"])
				
	if updated:
		_save_state()
		quest_list_updated.emit()

func _send_quest_completed_notification(quest_name: String) -> void:
	var notify_mgr = get_node_or_null("/root/NotificationManager")
	if notify_mgr and notify_mgr.has_method("show_banner"):
		notify_mgr.show_banner("Quest Completed!", quest_name, "🏆")

# --- MUTATOR TRANSATIONS (CLAIM REWARDS / PIN) ---

func claim_rewards(quest_id: String) -> Array:
	var quest = _find_quest_in_db(quest_id)
	if not quest or not quest["is_completed"] or quest["is_claimed"]:
		return []
		
	quest["is_claimed"] = true
	var rewards = quest["rewards"] as Array
	
	# Award resources using UIManager
	var ui_mgr = get_node_or_null("/root/UIManager")
	if ui_mgr:
		for reward in rewards:
			var r_type = reward.get("type", "")
			var qty = int(reward.get("quantity", 1))
			
			match r_type:
				"gold": ui_mgr.gold += qty
				"royal_crystal": ui_mgr.royal_crystals += qty
				"aurora_crystal": ui_mgr.aurora_crystals += qty
				"alliance_honor": ui_mgr.alliance_honor += qty
				"food": ui_mgr.food += qty
				"wood": ui_mgr.wood += qty
				"stone": ui_mgr.stone += qty
				"iron": ui_mgr.iron += qty
				"hero_tokens": ui_mgr.hero_tokens += qty
				"crystal_vault_coins": ui_mgr.crystal_vault_coins += qty
				"speedup_15m": ui_mgr.add_inventory_item("item_speedup_15m", qty)
				"speedup_1h": ui_mgr.add_inventory_item("item_speedup_1h", qty)
				"speedup_3h": ui_mgr.add_inventory_item("item_speedup_3h", qty)
				"shield_8h": ui_mgr.add_inventory_item("item_shield_8h", qty)
				"alliance_teleport": ui_mgr.add_inventory_item("item_teleport_alliance", qty)
				"crystallite_cores":
					# Deliver crystallite cores to player alliance if active
					var alliance_id = ui_mgr.player_alliance_id
					var alliance = ui_mgr.alliances_db.find(func(a): return a["id"] == alliance_id)
					if alliance != -1:
						var al_dict = ui_mgr.alliances_db[alliance] as Dictionary
						al_dict["crystallite_cores"] = int(al_dict.get("crystallite_cores", 500)) + qty
						ui_mgr.alliance_updated.emit()
				"hero_shard":
					var hero_id = reward.get("hero_id", "maegan")
					_grant_hero_shard_fallback(ui_mgr, hero_id, qty)
				_:
					var item_id = reward.get("id", "")
					if item_id != "" and ui_mgr.has_method("add_inventory_item"):
						ui_mgr.add_inventory_item(item_id, qty)
						
	# Add quest points to Daily/Weekly Activity meters
	var points = int(quest.get("quest_points", 15))
	if quest.get("category_id") == "daily":
		daily_activity_points = min(daily_activity_points + points, 150)
	elif quest.get("category_id") == "weekly":
		weekly_activity_points = min(weekly_activity_points + points, 500)
		
	# Also deliver to active campaigns in UIManager
	if ui_mgr and ui_mgr.has_method("add_quest_progress"):
		ui_mgr.add_quest_progress(quest_id, points)
		
	# Unpin automatically on claim
	if quest["is_pinned"]:
		toggle_pin(quest_id)
		
	_save_state()
	
	quest_state_changed.emit(quest_id, "claimed")
	activity_points_changed.emit(daily_activity_points, weekly_activity_points)
	quest_list_updated.emit()
	
	# Celebrate!
	if ui_mgr and ui_mgr.has_signal("reward_claimed"):
		var notify_list: Array[Dictionary] = []
		for r in rewards:
			notify_list.append({
				"name": r.get("name", "Royal Gift"),
				"quantity": int(r.get("quantity", 1)),
				"rarity": int(r.get("rarity", 2)),
				"icon": r.get("icon", "📦")
			})
		ui_mgr.reward_claimed.emit(notify_list)
		
	return rewards

func claim_all_completed_rewards(category_id: String) -> Array:
	var total_claimed_rewards := []
	var ids_to_claim: Array[String] = []
	
	for q in quests_db:
		if category_id == "all" or q.get("category_id") == category_id:
			if q["is_completed"] and not q["is_claimed"]:
				ids_to_claim.append(q["id"])
				
	for q_id in ids_to_claim:
		var single_rewards = claim_rewards(q_id)
		total_claimed_rewards.append_array(single_rewards)
		
	return total_claimed_rewards

func toggle_pin(quest_id: String) -> bool:
	var quest = _find_quest_in_db(quest_id)
	if not quest:
		return false
		
	quest["is_pinned"] = !quest["is_pinned"]
	if quest["is_pinned"]:
		if not pinned_quest_ids.has(quest_id):
			pinned_quest_ids.append(quest_id)
		quest_state_changed.emit(quest_id, "pinned")
	else:
		pinned_quest_ids.erase(quest_id)
		quest_state_changed.emit(quest_id, "unpinned")
		
	_save_state()
	quest_list_updated.emit()
	return quest["is_pinned"]

# Helper to support hero unlock fallback
func _grant_hero_shard_fallback(ui_mgr: Node, hero_id: String, amount: int) -> void:
	if ui_mgr.has_method("add_inventory_item"):
		ui_mgr.add_inventory_item("hero_shard_" + hero_id, amount)
		
	var heroes = ui_mgr.get("heroes") as Array
	if heroes:
		var found = false
		for h in heroes:
			if h["id"] == hero_id:
				found = true
				h["shards"] = int(h.get("shards", 0)) + amount
				if not h.get("unlocked", false):
					h["unlocked"] = true
				break
				
		if not found:
			var new_hero = {
				"id": hero_id,
				"name": hero_id.capitalize(),
				"unlocked": true,
				"level": 1,
				"max_level": 60,
				"xp": 0,
				"xp_required": 1000,
				"rarity_stars": 1,
				"shards": amount,
				"shards_required": 10,
				"power": 5000,
				"role": "Defender",
				"icon": "🦁"
			}
			heroes.append(new_hero)

# --- QUERY & GETTER ENGINES ---

func get_all_quests() -> Array:
	_check_and_process_resets()
	return quests_db

func get_quests_by_category(category_id: String) -> Array:
	_check_and_process_resets()
	if category_id == "all":
		return quests_db
		
	var filtered: Array = []
	for q in quests_db:
		if q.get("category_id") == category_id:
			filtered.append(q)
	return filtered

func get_filtered_quests(category_id: String, filter_type: String, search_query: String = "", sort_mode: String = "default") -> Array:
	var source = get_quests_by_category(category_id)
	var filtered: Array = []
	
	for q in source:
		var keep = true
		
		match filter_type:
			"completed":
				keep = q["is_completed"] and not q["is_claimed"]
			"uncompleted":
				keep = not q["is_completed"]
			"pinned":
				keep = q["is_pinned"] and not q["is_claimed"]
			"claimed":
				keep = q["is_claimed"]
				
		if keep and search_query != "":
			var sq = search_query.to_lower()
			var name_str = q.get("name", "").to_lower()
			var desc_str = q.get("description", "").to_lower()
			if not (sq in name_str or sq in desc_str):
				keep = false
				
		if keep:
			filtered.append(q)
			
	# Apply sorting
	if sort_mode == "pinned":
		filtered.sort_custom(func(a, b):
			var pin_a = 1 if a["is_pinned"] else 0
			var pin_b = 1 if b["is_pinned"] else 0
			if pin_a != pin_b: return pin_a > pin_b
			return int(a.get("quest_points", 0)) > int(b.get("quest_points", 0))
		)
	elif sort_mode == "points":
		filtered.sort_custom(func(a, b): return int(a.get("quest_points", 0)) > int(b.get("quest_points", 0)))
	else:
		# Default sorting: Pinned first, then completed but unclaimed first, then normal progression
		filtered.sort_custom(func(a, b):
			# Claimed go to bottom
			var claim_a = 1 if a["is_claimed"] else 0
			var claim_b = 1 if b["is_claimed"] else 0
			if claim_a != claim_b: return claim_a < claim_b
			
			# Pinned go to top
			var pin_a = 1 if a["is_pinned"] else 0
			var pin_b = 1 if b["is_pinned"] else 0
			if pin_a != pin_b: return pin_a > pin_b
			
			# Completed but unclaimed go high
			var comp_a = 1 if (a["is_completed"] and not a["is_claimed"]) else 0
			var comp_b = 1 if (b["is_completed"] and not b["is_claimed"]) else 0
			if comp_a != comp_b: return comp_a > comp_b
			
			return int(a.get("quest_points", 0)) > int(b.get("quest_points", 0))
		)
		
	return filtered

func get_unread_completed_quests_count(category_id: String = "all") -> int:
	var count = 0
	for q in quests_db:
		if category_id == "all" or q.get("category_id") == category_id:
			if q["is_completed"] and not q["is_claimed"]:
				count += 1
	return count

func get_activity_milestones(type_str: String) -> Array:
	for m_group in milestone_rewards:
		if m_group.get("type") == type_str:
			var list = m_group.get("milestones", []) as Array
			# Sync claimed state with our state array
			var claimed_arr = claimed_daily_milestones if type_str == "daily_activity" else claimed_weekly_milestones
			for i in range(list.size()):
				list[i]["claimed"] = claimed_arr.has(i)
			return list
	return []

func claim_activity_milestone(type_str: String, index: int) -> Array:
	var milestones = get_activity_milestones(type_str)
	if index < 0 or index >= milestones.size():
		return []
		
	var milestone = milestones[index]
	var current_pts = daily_activity_points if type_str == "daily_activity" else weekly_activity_points
	var req_pts = int(milestone.get("points_required", 100))
	
	if current_pts < req_pts:
		return [] # Insufficient points
		
	var claimed_arr = claimed_daily_milestones if type_str == "daily_activity" else claimed_weekly_milestones
	if claimed_arr.has(index):
		return [] # Already claimed
		
	claimed_arr.append(index)
	var rewards = milestone["rewards"] as Array
	
	# Deliver via UIManager
	var ui_mgr = get_node_or_null("/root/UIManager")
	if ui_mgr:
		for reward in rewards:
			var r_type = reward.get("type", "")
			var qty = int(reward.get("quantity", 1))
			
			match r_type:
				"gold": ui_mgr.gold += qty
				"royal_crystal": ui_mgr.royal_crystals += qty
				"aurora_crystal": ui_mgr.aurora_crystals += qty
				"alliance_honor": ui_mgr.alliance_honor += qty
				"food": ui_mgr.food += qty
				"wood": ui_mgr.wood += qty
				"stone": ui_mgr.stone += qty
				"iron": ui_mgr.iron += qty
				"hero_tokens": ui_mgr.hero_tokens += qty
				"crystal_vault_coins": ui_mgr.crystal_vault_coins += qty
				"speedup_15m": ui_mgr.add_inventory_item("item_speedup_15m", qty)
				"speedup_1h": ui_mgr.add_inventory_item("item_speedup_1h", qty)
				_:
					var item_id = reward.get("id", "")
					if item_id != "" and ui_mgr.has_method("add_inventory_item"):
						ui_mgr.add_inventory_item(item_id, qty)
						
	_save_state()
	
	milestone_claimed.emit(type_str, index, rewards)
	activity_points_changed.emit(daily_activity_points, weekly_activity_points)
	quest_list_updated.emit()
	
	# Celebrate!
	if ui_mgr and ui_mgr.has_signal("reward_claimed"):
		var notify_list: Array[Dictionary] = []
		for r in rewards:
			notify_list.append({
				"name": r.get("name", "Chest Loot"),
				"quantity": int(r.get("quantity", 1)),
				"rarity": int(r.get("rarity", 3)),
				"icon": r.get("icon", "📦")
			})
		ui_mgr.reward_claimed.emit(notify_list)
		
	return rewards

# --- PRIVATE HELPERS ---

func _find_quest_in_db(quest_id: String) -> Dictionary:
	for q in quests_db:
		if q["id"] == quest_id:
			return q
	return {}

func _load_json_file(path: String) -> Array:
	if not FileAccess.file_exists(path):
		print("[Crownspire QuestManager] JSON db not found: ", path)
		return []
		
	var file := FileAccess.open(path, FileAccess.READ)
	if file:
		var json = JSON.new()
		var error = json.parse(file.get_as_text())
		file.close()
		if error == OK:
			var data = json.get_data()
			if typeof(data) == TYPE_ARRAY:
				return data
	return []

func _load_json_dict(path: String) -> Dictionary:
	if not FileAccess.file_exists(path):
		print("[Crownspire QuestManager] JSON db not found: ", path)
		return {}
		
	var file := FileAccess.open(path, FileAccess.READ)
	if file:
		var json = JSON.new()
		var error = json.parse(file.get_as_text())
		file.close()
		if error == OK:
			var data = json.get_data()
			if typeof(data) == TYPE_DICTIONARY:
				return data
	return {}

# --- ROOKIE EVENT CONFIG & LIFECYCLE API ---

func get_sovereigns_journey_config() -> Dictionary:
	return sovereigns_journey_config

func get_rookie_lifecycle_config() -> Dictionary:
	return sovereigns_journey_config.get("lifecycle", {
		"unlock_days": 7,
		"active_duration_days": 7,
		"grace_period_days": 2,
		"total_event_days": 9
	})

func is_rookie_event_active() -> bool:
	var settings_mgr = get_node_or_null("/root/SettingsManager")
	if not settings_mgr or not settings_mgr.has_method("get_account_age_days"):
		return true
	var age_days = settings_mgr.get_account_age_days()
	var total_days = int(get_rookie_lifecycle_config().get("total_event_days", 9))
	return age_days < float(total_days)

func is_rookie_event_expired() -> bool:
	return not is_rookie_event_active()

func is_rookie_in_grace_period() -> bool:
	var settings_mgr = get_node_or_null("/root/SettingsManager")
	if not settings_mgr or not settings_mgr.has_method("get_account_age_days"):
		return false
	var age_days = settings_mgr.get_account_age_days()
	var lc = get_rookie_lifecycle_config()
	var active_days = float(lc.get("active_duration_days", 7))
	var total_days = float(lc.get("total_event_days", 9))
	return age_days >= active_days and age_days < total_days

func check_rookie_current_state_objectives() -> void:
	if is_rookie_event_expired():
		return # Event ENDED at Day 10+: no objective progression
		
	var settings_mgr = get_node_or_null("/root/SettingsManager")
	if not settings_mgr or not settings_mgr.has_method("get_rookie_event_day"):
		return
		
	var unlocked_day = min(7, settings_mgr.get_rookie_event_day())
	var ui_mgr = get_node_or_null("/root/UIManager")
	if not ui_mgr:
		return
		
	var updated := false
	
	# Gather current absolute state metrics
	var citadel_lvl = int(ui_mgr.get_building("citadel").get("level", 1))
	var player_power = int(ui_mgr.get("power")) if ui_mgr.get("power") != null else 10000
	var alliance_joined = 1 if ui_mgr.player_alliance_id != "" else 0
	
	var hero_count = 0
	var max_hero_level = 1
	var heroes_list = ui_mgr.get("heroes") as Array
	if heroes_list:
		for h in heroes_list:
			if h is Dictionary and h.get("unlocked", false):
				hero_count += 1
				var lvl = int(h.get("level", 1))
				if lvl > max_hero_level:
					max_hero_level = lvl
					
	for q in quests_db:
		if q.get("category_id") != "rookie":
			continue
		if q.get("day", 1) > unlocked_day:
			continue
		if q["is_completed"] or q["is_claimed"]:
			continue
			
		var progress_mode = q.get("progress_mode", "accumulated")
		if progress_mode != "current_state":
			continue
			
		var quest_updated := false
		for obj in q["objectives"]:
			if obj["completed"]:
				continue
				
			var o_type = obj.get("type", "")
			var target_val = int(obj.get("target", 1))
			var target_id = obj.get("target_id", "")
			var current_metric = 0
			
			match o_type:
				"building_upgrade":
					if target_id == "citadel" or target_id == "":
						current_metric = citadel_lvl
					else:
						var b = ui_mgr.get_building(target_id)
						current_metric = int(b.get("level", 1))
				"power_milestone":
					current_metric = player_power
				"hero_recruit":
					current_metric = hero_count
				"hero_level":
					current_metric = max_hero_level
				"alliance_join":
					current_metric = alliance_joined
					
			if current_metric >= target_val:
				obj["current"] = target_val
				obj["completed"] = true
				quest_updated = true
				updated = true
				quest_progress_changed.emit(q["id"], obj["id"], obj["current"], target_val)
				
		if quest_updated:
			var all_done = true
			for obj in q["objectives"]:
				if not obj["completed"]:
					all_done = false
					break
			if all_done:
				q["is_completed"] = true
				quest_state_changed.emit(q["id"], "completed")
				_send_quest_completed_notification(q["name"])
				
	if updated:
		_save_state()
		quest_list_updated.emit()

func get_rookie_quests_for_day(day_num: int) -> Array:
	check_rookie_current_state_objectives()
	var res: Array = []
	for q in quests_db:
		if q.get("category_id") == "rookie" and int(q.get("day", 1)) == day_num:
			res.append(q)
	return res

func get_rookie_daily_completion_count(day_num: int) -> int:
	var count = 0
	var day_quests = get_rookie_quests_for_day(day_num)
	for q in day_quests:
		if q["is_completed"]:
			count += 1
	return count

func is_rookie_daily_chest_claimed(day_num: int) -> bool:
	return claimed_rookie_daily_chests.has(day_num)

func get_rookie_daily_chest_config(day_num: int) -> Dictionary:
	var chests = sovereigns_journey_config.get("daily_chests", []) as Array
	for c in chests:
		if int(c.get("day", 0)) == day_num:
			return c
	return {
		"day": day_num,
		"required_completed_objectives": 5,
		"title": "Day %d Chest" % day_num,
		"rewards": [
			{"type": "royal_crystal", "quantity": 300, "name": "Royal Crystals", "icon": "💎"},
			{"type": "hero_tokens", "quantity": 3, "name": "Hero Tokens", "icon": "🎖️"},
			{"type": "speedup_1h", "quantity": 3, "name": "1h Speedups", "icon": "⏳"}
		]
	}

func claim_rookie_daily_chest(day_num: int) -> Array:
	if is_rookie_daily_chest_claimed(day_num):
		return []
		
	if is_rookie_event_expired():
		return [] # No new reward earning when event is ENDED at Day 10+
		
	var chest_cfg = get_rookie_daily_chest_config(day_num)
	var req_count = int(chest_cfg.get("required_completed_objectives", 5))
	var comp_count = get_rookie_daily_completion_count(day_num)
	if comp_count < req_count:
		return []
		
	claimed_rookie_daily_chests.append(day_num)
	_save_state()
	
	var rewards = chest_cfg.get("rewards", []) as Array
	var ui_mgr = get_node_or_null("/root/UIManager")
	var settings_mgr = get_node_or_null("/root/SettingsManager")
	
	if ui_mgr:
		for r in rewards:
			var r_type = r.get("type", "")
			var qty = int(r.get("quantity", 1))
			match r_type:
				"royal_crystal": ui_mgr.royal_crystals += qty
				"gold": ui_mgr.gold += qty
				"hero_tokens": ui_mgr.hero_tokens += qty
				"speedup_15m":
					if ui_mgr.has_method("add_inventory_item"): ui_mgr.add_inventory_item("item_speedup_15m", qty)
				"speedup_1h":
					if ui_mgr.has_method("add_inventory_item"): ui_mgr.add_inventory_item("item_speedup_1h", qty)
				"speedup_3h":
					if ui_mgr.has_method("add_inventory_item"): ui_mgr.add_inventory_item("item_speedup_3h", qty)
				"avatar_frame":
					var frame_id = r.get("id", "")
					if settings_mgr and frame_id != "":
						var prof = settings_mgr.settings.get("profile", {})
						var frames = prof.get("unlocked_frames", []) as Array
						if not frames.has(frame_id):
							frames.append(frame_id)
							prof["unlocked_frames"] = frames
							settings_mgr.save_settings()
				_:
					var item_id = r.get("id", "")
					if item_id != "" and ui_mgr.has_method("add_inventory_item"):
						ui_mgr.add_inventory_item(item_id, qty)
						
		if ui_mgr.has_signal("reward_claimed"):
			var notify_list: Array[Dictionary] = []
			for r in rewards:
				notify_list.append({
					"name": r.get("name", "Daily Chest Reward"),
					"quantity": int(r.get("quantity", 1)),
					"rarity": 3,
					"icon": r.get("icon", "🎁")
				})
			ui_mgr.reward_claimed.emit(notify_list)
			
	quest_list_updated.emit()
	return rewards

func get_rookie_total_completed_count() -> int:
	check_rookie_current_state_objectives()
	var total = 0
	for q in quests_db:
		if q.get("category_id") == "rookie" and q["is_completed"]:
			total += 1
	return total

func get_rookie_overall_milestones() -> Array:
	check_rookie_current_state_objectives()
	var total_comp = get_rookie_total_completed_count()
	var config_milestones = sovereigns_journey_config.get("overall_milestones", []) as Array
	
	if config_milestones.is_empty():
		config_milestones = [
			{"index": 0, "target": 10, "title": "Beginner Sovereign", "rewards": [{"type": "royal_crystal", "quantity": 300, "name": "Royal Crystals", "icon": "💎"}]},
			{"index": 1, "target": 20, "title": "Realm Defender", "rewards": [{"type": "royal_crystal", "quantity": 500, "name": "Royal Crystals", "icon": "💎"}]},
			{"index": 2, "target": 30, "title": "Crown Marshal", "rewards": [{"type": "royal_crystal", "quantity": 800, "name": "Royal Crystals", "icon": "💎"}]},
			{"index": 3, "target": 40, "title": "Grand Monarch", "rewards": [{"type": "royal_crystal", "quantity": 1200, "name": "Royal Crystals", "icon": "💎"}]},
			{"index": 4, "target": 45, "title": "Founding Sovereign", "is_final_cosmetic": true, "rewards": [{"type": "avatar_frame", "id": "Founding Sovereign", "name": "Founding Sovereign Avatar Frame", "icon": "🖼️"}]}
		]
		
	var result: Array = []
	for m in config_milestones:
		var m_copy = m.duplicate(true)
		var target_val = int(m_copy.get("target", 10))
		var idx = int(m_copy.get("index", 0))
		m_copy["completed"] = total_comp >= target_val
		m_copy["claimed"] = claimed_rookie_overall_milestones.has(idx)
		result.append(m_copy)
		
	return result

func claim_rookie_overall_milestone(index: int) -> Array:
	if claimed_rookie_overall_milestones.has(index):
		return []
		
	if is_rookie_event_expired():
		return [] # No new reward earning when event is ENDED at Day 10+
		
	var milestones = get_rookie_overall_milestones()
	var m: Dictionary = {}
	for candidate in milestones:
		if int(candidate.get("index", -1)) == index:
			m = candidate
			break
			
	if m.is_empty() or not m.get("completed", false):
		return []
		
	claimed_rookie_overall_milestones.append(index)
	_save_state()
	
	var rewards = m.get("rewards", []) as Array
	var ui_mgr = get_node_or_null("/root/UIManager")
	var settings_mgr = get_node_or_null("/root/SettingsManager")
	
	if ui_mgr:
		for r in rewards:
			var r_type = r.get("type", "")
			var qty = int(r.get("quantity", 1))
			match r_type:
				"royal_crystal": ui_mgr.royal_crystals += qty
				"gold": ui_mgr.gold += qty
				"hero_tokens": ui_mgr.hero_tokens += qty
				"speedup_1h":
					if ui_mgr.has_method("add_inventory_item"): ui_mgr.add_inventory_item("item_speedup_1h", qty)
				"speedup_3h":
					if ui_mgr.has_method("add_inventory_item"): ui_mgr.add_inventory_item("item_speedup_3h", qty)
				"avatar_frame":
					var frame_id = r.get("id", "")
					if settings_mgr and frame_id != "":
						var prof = settings_mgr.settings.get("profile", {})
						var frames = prof.get("unlocked_frames", []) as Array
						if not frames.has(frame_id):
							frames.append(frame_id)
							prof["unlocked_frames"] = frames
							settings_mgr.save_settings()
							print("[QuestManager] Unlocked Avatar Frame: ", frame_id)
				_:
					var item_id = r.get("id", "")
					if item_id != "" and ui_mgr.has_method("add_inventory_item"):
						ui_mgr.add_inventory_item(item_id, qty)
						
		if ui_mgr.has_signal("reward_claimed"):
			var notify_list: Array[Dictionary] = []
			for r in rewards:
				notify_list.append({
					"name": r.get("name", "Milestone Reward"),
					"quantity": int(r.get("quantity", 1)),
					"rarity": 4,
					"icon": r.get("icon", "👑")
				})
			ui_mgr.reward_claimed.emit(notify_list)
			
	quest_list_updated.emit()
	return rewards
