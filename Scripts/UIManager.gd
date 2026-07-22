extends Node

# Minimal production-safe UIManager for Crownspire Godot 4.6+
# Handles live building databases, player currency registers, and fallback window actions safely.

signal currency_changed(currency_id: String, new_amount: float)
signal building_updated(building_id: String, new_level: int)

# --- ALLIANCE SIGNALS ---
signal alliance_updated()
signal alliance_help_updated()
signal alliance_gifts_updated()
signal alliance_chat_updated()
signal alliance_rally_updated()
signal alliance_war_updated()

# Active construction timer state
var upgrading_building_id: String = ""
var upgrade_timer_left: float = 0.0
var upgrade_timer_total: float = 0.0

# Player Resources (Reactive states)
var food: int = 500000
var wood: int = 600000
var stone: int = 350000
var iron: int = 150000
var gold: int = 100000
var royal_crystals: int = 2500

# Player Profile and Extra Currency Registers
var player_name: String = "Sovereign Maegan"
var power: int = 750000
var vip_level: int = 3
var vip_points: int = 1200
var alliance_honor: int = 5000
var aurora_crystals: int = 150

# Alliance Database Cache and State Registers
var player_alliance_id: String = "alliance_1"
var alliances_db: Array = []
var alliance_research_db: Array = []
var alliance_buildings_db: Array = []
var global_players_db: Array = []
var alliance_chat_messages: Array = []

# Popup stack tracking
var popup_stack: Array = []
signal panel_opened(panel_name: String)
signal panel_closed(panel_name: String)

# Building data cache
var _buildings_cache: Array = []

func _ready() -> void:
	_load_buildings_data()
	_load_alliance_databases()

# Dynamic loader for buildings database
func _load_buildings_data() -> void:
	var path = "res://data/buildings.json"
	if FileAccess.file_exists(path):
		var file = FileAccess.open(path, FileAccess.READ)
		if file:
			var json = JSON.new()
			if json.parse(file.get_as_text()) == OK:
				var data = json.get_data()
				if data is Array:
					_buildings_cache = data
					print("[Crownspire UIManager] Successfully loaded buildings database.")
					return
	
	# Fail-safe mock data matching standard scheme if file missing
	_buildings_cache = [
		{
			"id": "citadel",
			"name": "Citadel of Emerald Spires",
			"level": 1,
			"max_level": 30,
			"base_power": 10000,
			"power_per_level": 2500,
			"resources_required": {"food": 50000, "wood": 60000, "stone": 30000, "iron": 10000},
			"upgrade_time_seconds": 300,
			"current_bonus": "Max Troop Tier: I",
			"next_bonus": "Max Troop Tier: II"
		},
		{
			"id": "farm",
			"name": "Imperial Wheatlands",
			"level": 1,
			"max_level": 30,
			"base_power": 1000,
			"power_per_level": 200,
			"resources_required": {"food": 10000, "wood": 15000, "stone": 5000},
			"upgrade_time_seconds": 120,
			"current_bonus": "1.5K Food / Hour",
			"next_bonus": "2.2K Food / Hour"
		}
	]
	print("[Crownspire UIManager] Fallback buildings loaded.")

# --- Core Building API ---

func get_building(building_id: String) -> Dictionary:
	for b in _buildings_cache:
		if b is Dictionary and b.get("id", "") == building_id:
			return b
	return {}

func upgrade_building(building_id: String) -> Dictionary:
	var b = get_building(building_id)
	if b.is_empty():
		return {"success": false, "error": "Building not found"}
	
	var lvl = int(b.get("level", 1))
	var max_lvl = int(b.get("max_level", 30))
	if lvl >= max_lvl:
		return {"success": false, "error": "Max level reached"}
	
	# Calculate structural costs
	var reqs = b.get("resources_required", {})
	var multiplier = 1.0 + lvl * 0.15
	
	# Verify and deduct
	for res in reqs.keys():
		var cost = int(reqs[res] * multiplier)
		var current_val = get(res)
		if current_val < cost:
			return {"success": false, "error": "Insufficient " + res}
	
	# Deduct costs
	for res in reqs.keys():
		var cost = int(reqs[res] * multiplier)
		set(res, get(res) - cost)
		currency_changed.emit(res, float(get(res)))
		
	# Upgrade level
	b["level"] = lvl + 1
	print("[Crownspire UIManager] Upgraded %s to level %d!" % [building_id, lvl + 1])
	building_updated.emit(building_id, b["level"])
	_save_buildings_data()
	return {"success": true}

func _process(delta: float) -> void:
	if upgrading_building_id != "":
		upgrade_timer_left -= delta
		if upgrade_timer_left <= 0.0:
			var b_id = upgrading_building_id
			_complete_building_upgrade(b_id)
			show_toast("Upgrade completed for " + b_id.replace("_", " ").capitalize() + "!")

func start_building_upgrade(b_id: String) -> Dictionary:
	if upgrading_building_id != "":
		return { "success": false, "error": "Another construction project is already active!" }
		
	var b = get_building(b_id)
	if b.is_empty():
		return { "success": false, "error": "Building not found" }
		
	var lvl = int(b.get("level", 1))
	var max_lvl = int(b.get("max_level", 30))
	if lvl >= max_lvl:
		return { "success": false, "error": "Max level reached" }
		
	var reqs = b.get("resources_required", {})
	var multiplier = 1.0 + lvl * 0.15
	
	# Verify
	for res in reqs.keys():
		var cost = int(reqs[res] * multiplier)
		var current_val = get(res)
		if current_val < cost:
			return { "success": false, "error": "Insufficient " + res }
			
	# Deduct
	for res in reqs.keys():
		var cost = int(reqs[res] * multiplier)
		set(res, get(res) - cost)
		currency_changed.emit(res, float(get(res)))
		
	# Start construction timer
	upgrading_building_id = b_id
	var total_time = float(b.get("upgrade_time_seconds", 120))
	upgrade_timer_left = total_time
	upgrade_timer_total = total_time
	
	_save_buildings_data()
	return { "success": true }

func instant_finish_building_upgrade(b_id: String, crystal_cost: int) -> Dictionary:
	if royal_crystals < crystal_cost:
		return { "success": false, "error": "Insufficient Royal Crystals!" }
		
	# Deduct crystals
	royal_crystals -= crystal_cost
	currency_changed.emit("royal_crystals", float(royal_crystals))
	
	# Complete construction
	_complete_building_upgrade(b_id)
	return { "success": true }

func _complete_building_upgrade(b_id: String) -> void:
	var b = get_building(b_id)
	if not b.is_empty():
		var lvl = int(b.get("level", 1))
		b["level"] = lvl + 1
		
		# Reset construction state
		if upgrading_building_id == b_id:
			upgrading_building_id = ""
			upgrade_timer_left = 0.0
			upgrade_timer_total = 0.0
			
		# Emit update signal
		building_updated.emit(b_id, b["level"])
		_save_buildings_data()
		print("[Crownspire UIManager] Completed upgrade for %s to level %d" % [b_id, b["level"]])

func _save_buildings_data() -> void:
	var path = "res://data/buildings.json"
	var file = FileAccess.open(path, FileAccess.WRITE)
	if file:
		var json_string = JSON.stringify(_buildings_cache, "\t")
		file.store_string(json_string)
		print("[Crownspire UIManager] Saved buildings database successfully.")

func _load_alliance_databases() -> void:
	alliances_db = load_json_file("res://data/alliance.json")
	alliance_research_db = load_json_file("res://data/alliance_research.json")
	alliance_buildings_db = load_json_file("res://data/alliance_buildings.json")
	global_players_db = load_json_file("res://data/players.json")
	
	# Fail-safe initialization if files are missing or empty
	if alliances_db.is_empty():
		alliances_db = [
			{
				"id": "alliance_1",
				"name": "Emerald Vanguard",
				"tag": "EMR",
				"leader": "Sovereign Maegan",
				"description": "The spearhead of the Emerald Spires. Loyal, resolute, unconquerable.",
				"power": 25000000,
				"member_count": 4,
				"max_members": 50,
				"flag_symbol": "🛡️",
				"crystallite_cores": 1200,
				"fortress_level": 3,
				"help_requests": [
					{
						"id": "req_1",
						"sender_name": "Vassal Gwydion",
						"type": "construction_help",
						"task_name": "Keep Level 12 Upgrade",
						"current_clicks": 14,
						"max_clicks": 30
					},
					{
						"id": "req_2",
						"sender_name": "Lady Helen",
						"type": "research_help",
						"task_name": "Alchemical Metallurgy V",
						"current_clicks": 5,
						"max_clicks": 20
					}
				],
				"gifts": [
					{
						"id": "gift_1",
						"name": "Amber Wyrm Chest",
						"source": "Coordinated Guild Raid",
						"claimed": false,
						"rewards": [{"name": "Gold", "quantity": 50000}, {"name": "Aurora Crystal", "quantity": 10}]
					}
				],
				"logs": [
					"Vassal Gwydion upgraded Keep Level 11.",
					"Emerald Vanguard secured Alliance Outpost."
				],
				"members": [
					{"name": "Sovereign Maegan", "rank": 4, "power": 750000, "is_online": true, "last_online": "Now"},
					{"name": "Vassal Gwydion", "rank": 3, "power": 520000, "is_online": true, "last_online": "Now"},
					{"name": "Lady Helen", "rank": 2, "power": 410000, "is_online": false, "last_online": "3h ago"},
					{"name": "Sir Cedric", "rank": 1, "power": 320000, "is_online": true, "last_online": "Now"}
				],
				"rallies": [],
				"active_wars": []
			}
		]
	
	if alliance_research_db.is_empty():
		alliance_research_db = [
			{
				"category": "Development",
				"technologies": [
					{
						"id": "tech_dev_1",
						"name": "Alchemical Extraction",
						"icon": "🧪",
						"level": 2,
						"max_level": 10,
						"description": "Increases collective mining yields by 5%.",
						"req_resource_type": "wood",
						"current_donation": 45000,
						"max_donation": 100000
					}
				]
			},
			{
				"category": "Combat",
				"technologies": [
					{
						"id": "tech_combat_1",
						"name": "Frost alloys alloys",
						"icon": "❄️",
						"level": 1,
						"max_level": 10,
						"description": "Increases troop defensive parameters by 3%.",
						"req_resource_type": "iron",
						"current_donation": 12000,
						"max_donation": 150000
					}
				]
			}
		]
		
	# Add mock initial messages
	alliance_chat_messages = [
		{"sender": "Vassal Gwydion", "text": "Hail, Sovereign! Let's conquer the southern resource hubs today.", "time": "2h ago"},
		{"sender": "Lady Helen", "text": "I've started construction on the research wing.", "time": "1h ago"}
	]

func load_json_file(path: String) -> Array:
	if not FileAccess.file_exists(path):
		print("[Crownspire UIManager] JSON file not found at: " + path)
		return []
		
	var file := FileAccess.open(path, FileAccess.READ)
	if not file:
		print("[Crownspire UIManager] Failed to open: " + path)
		return []
		
	var json_text := file.get_as_text()
	file.close()
	
	var json = JSON.new()
	var error = json.parse(json_text)
	if error != OK:
		print("[Crownspire UIManager] JSON parse error in %s: %s" % [path, json.get_error_message()])
		return []
		
	var data = json.get_data()
	if typeof(data) == TYPE_ARRAY:
		return data
	return []

# --- POPUP STACK MANAGER CORES ---
func open_popup(popup_scene: PackedScene) -> Node:
	if not popup_scene:
		push_error("[Crownspire UIManager] Null PackedScene passed to open_popup.")
		return null
		
	var root = get_tree().current_scene
	var inst = popup_scene.instantiate() as Control
	root.add_child(inst)
	
	popup_stack.append(inst)
	panel_opened.emit(inst.name)
	
	if inst.has_node("AnimationPlayer"):
		var ap = inst.get_node("AnimationPlayer") as AnimationPlayer
		if ap.has_animation("open_bounce"):
			ap.play("open_bounce")
		elif ap.has_animation("RESET"):
			ap.play("RESET")
			
	return inst

func close_popup(popup_node: Node = null) -> void:
	if not popup_node:
		return
		
	if popup_stack.has(popup_node):
		popup_stack.erase(popup_node)
		
	panel_closed.emit(popup_node.name)
	
	if popup_node.has_node("AnimationPlayer"):
		var ap = popup_node.get_node("AnimationPlayer") as AnimationPlayer
		if ap.has_animation("close_fade"):
			ap.play("close_fade")
			await ap.animation_finished
			
	popup_node.queue_free()

func close_top_popup() -> void:
	if not popup_stack.is_empty():
		close_popup(popup_stack.back())

# --- ALLIANCE GAMEPLAY SIMULATION ENGINE ---
func get_player_alliance() -> Dictionary:
	if player_alliance_id == "":
		return {}
	for alliance in alliances_db:
		if alliance.get("id", "") == player_alliance_id:
			return alliance
	return {}

func leave_alliance() -> void:
	var alliance = get_player_alliance()
	if not alliance.is_empty():
		var members = alliance["members"] as Array
		var idx = -1
		for i in range(members.size()):
			if members[i]["name"] == player_name:
				idx = i
				break
		if idx != -1:
			members.remove_at(idx)
		alliance["member_count"] = members.size()
		add_alliance_log(player_name + " left the alliance.")
	
	player_alliance_id = ""
	alliance_updated.emit()

func join_alliance(alliance_id: String) -> bool:
	player_alliance_id = alliance_id
	var alliance = get_player_alliance()
	if not alliance.is_empty():
		var members = alliance["members"] as Array
		var is_member = false
		for m in members:
			if m["name"] == player_name:
				is_member = true
				break
		if not is_member:
			members.append({
				"name": player_name,
				"rank": 1,
				"power": power,
				"is_online": true,
				"last_online": "Now"
			})
		alliance["member_count"] = members.size()
		add_alliance_log(player_name + " joined the alliance.")
		alliance_updated.emit()
		return true
	return false

func create_alliance(alliance_name_str: String, tag_str: String, flag_symbol: String, description: String = "", banner_color: String = "", flag_color: String = "") -> bool:
	if royal_crystals < 500:
		return false
	royal_crystals -= 500
	currency_changed.emit("royal_crystals", float(royal_crystals))
	
	var new_id = "alliance_" + str(alliances_db.size() + 1)
	var new_alliance = {
		"id": new_id,
		"name": alliance_name_str,
		"tag": tag_str.to_upper(),
		"leader": player_name,
		"leader_power": power,
		"description": description if description != "" else "Welcome to " + alliance_name_str,
		"power": power,
		"member_count": 1,
		"max_members": 50,
		"banner_color": banner_color if banner_color != "" else "#1a1a1a",
		"flag_symbol": flag_symbol if flag_symbol != "" else "🛡️",
		"flag_color": flag_color if flag_color != "" else "#ffffff",
		"crystallite_cores": 500,
		"fortress_level": 1,
		"towers_placed": 0,
		"max_towers": 15,
		"help_requests": [],
		"gifts": [],
		"logs": ["Alliance " + alliance_name_str + " was founded by " + player_name + "."],
		"members": [
			{"name": player_name, "rank": 4, "power": power, "is_online": true, "last_online": "Now"}
		],
		"rallies": [],
		"active_wars": []
	}
	alliances_db.append(new_alliance)
	player_alliance_id = new_id
	alliance_updated.emit()
	return true

func kick_alliance_member(member_name: String) -> void:
	var alliance = get_player_alliance()
	if alliance.is_empty(): return
	var members = alliance["members"] as Array
	var idx = -1
	for i in range(members.size()):
		if members[i]["name"] == member_name:
			idx = i
			break
	if idx != -1:
		members.remove_at(idx)
		alliance["member_count"] = members.size()
		add_alliance_log(member_name + " was kicked from the alliance by " + player_name + ".")
		alliance_updated.emit()

func promote_alliance_member(member_name: String) -> void:
	var alliance = get_player_alliance()
	if alliance.is_empty(): return
	var members = alliance["members"] as Array
	for m in members:
		if m["name"] == member_name:
			var old_rank = int(m["rank"])
			if old_rank < 3:
				m["rank"] = old_rank + 1
				add_alliance_log(member_name + " was promoted to Officer rank by " + player_name + ".")
				alliance_updated.emit()
			break

func demote_alliance_member(member_name: String) -> void:
	var alliance = get_player_alliance()
	if alliance.is_empty(): return
	var members = alliance["members"] as Array
	for m in members:
		if m["name"] == member_name:
			var old_rank = int(m["rank"])
			if old_rank > 1:
				m["rank"] = old_rank - 1
				add_alliance_log(member_name + " was demoted by " + player_name + ".")
				alliance_updated.emit()
			break

func donate_to_alliance_tech(tech_id: String, amount: int) -> bool:
	var target_tech: Dictionary = {}
	for cat in alliance_research_db:
		for tech in cat["technologies"]:
			if tech["id"] == tech_id:
				target_tech = tech
				break
	
	if target_tech.is_empty():
		return false
		
	var req_res = target_tech["req_resource_type"]
	var available_res = get_resource_value(req_res)
	
	if available_res < amount:
		return false
		
	match req_res:
		"gold": gold -= amount
		"food": food -= amount
		"wood": wood -= amount
		"stone": stone -= amount
		"iron": iron -= amount
		"royal_crystal": royal_crystals -= amount
		"aurora_crystal": aurora_crystals -= amount
	currency_changed.emit(req_res, float(get_resource_value(req_res)))
	
	target_tech["current_donation"] += amount
	var max_don = int(target_tech["max_donation"])
	if target_tech["current_donation"] >= max_don:
		var extra = target_tech["current_donation"] - max_don
		target_tech["level"] += 1
		target_tech["current_donation"] = extra
		target_tech["max_donation"] = int(max_don * 1.5)
		add_alliance_log("Alliance completed Alchemical research for: " + target_tech["name"] + " Level " + str(target_tech["level"]) + "!")
	
	alliance_honor += int(amount * 0.1)
	alliance_updated.emit()
	return true

func help_all_alliance_requests() -> void:
	var alliance = get_player_alliance()
	if alliance.is_empty(): return
	var reqs = alliance["help_requests"] as Array
	if reqs.is_empty(): return
	
	alliance_honor += reqs.size() * 100
	reqs.clear()
	add_alliance_log(player_name + " helped all outstanding construction & research requests.")
	alliance_updated.emit()
	alliance_help_updated.emit()

func claim_alliance_gift(gift_id: String) -> void:
	var alliance = get_player_alliance()
	if alliance.is_empty(): return
	var gifts = alliance["gifts"] as Array
	for g in gifts:
		if g["id"] == gift_id and not g["claimed"]:
			g["claimed"] = true
			var rewards = g["rewards"] as Array
			for r in rewards:
				var name_str = r["name"]
				var qty = int(r["quantity"])
				match name_str:
					"Gold": gold += qty
					"Food": food += qty
					"Wood": wood += qty
					"Stone": stone += qty
					"Iron": iron += qty
					"Aurora Crystal": aurora_crystals += qty
					"Royal Crystal": royal_crystals += qty
			
			alliance_updated.emit()
			alliance_gifts_updated.emit()
			break

func add_alliance_log(log_text: String) -> void:
	var alliance = get_player_alliance()
	if alliance.is_empty(): return
	var logs = alliance["logs"] as Array
	logs.insert(0, log_text)
	if logs.size() > 50:
		logs.remove_at(logs.size() - 1)

func send_alliance_chat_message(text: String) -> void:
	if text.strip_edges() == "": return
	alliance_chat_messages.append({
		"sender": player_name,
		"text": text,
		"time": "Now"
	})
	if alliance_chat_messages.size() > 100:
		alliance_chat_messages.remove_at(0)
	alliance_chat_updated.emit()

func create_alliance_rally(target_name: String, duration_str: String) -> bool:
	var alliance = get_player_alliance()
	if alliance.is_empty(): return false
	
	var rally_id = "rally_" + str(Time.get_ticks_msec())
	var new_rally = {
		"id": rally_id,
		"creator": player_name,
		"target": target_name,
		"target_level": 5,
		"time_left_secs": 300,
		"max_capacity": 2000000,
		"current_troops": 150000,
		"members_joined": [
			{"name": player_name, "troops": 150000, "hero_icon": "🦁"}
		]
	}
	
	var rallies = alliance["rallies"] as Array
	rallies.append(new_rally)
	
	var new_war = {
		"id": "war_" + str(Time.get_ticks_msec()),
		"enemy_alliance_name": "Rogue Hive",
		"enemy_tag": "ROG",
		"type": "offense",
		"target": target_name + " Lvl 5",
		"time_left_secs": 300,
		"rally_id": rally_id
	}
	var wars = alliance["active_wars"] as Array
	wars.append(new_war)
	
	add_alliance_log(player_name + " initiated a tactical war rally against " + target_name + " (Duration: " + duration_str + ").")
	alliance_updated.emit()
	alliance_rally_updated.emit()
	alliance_war_updated.emit()
	return true

func get_resource_value(res_id: String) -> int:
	match res_id:
		"gold": return gold
		"food": return food
		"wood": return wood
		"stone": return stone
		"iron": return iron
		"royal_crystal", "royal_crystals": return royal_crystals
		"aurora_crystal", "aurora_crystals": return aurora_crystals
		"alliance_honor": return alliance_honor
	return 0

# --- Required Behavior and Helper Methods (Godot 4.6 compliant) ---
func show_toast(message: String) -> void:
	print("[Crownspire UIManager - TOAST] %s" % message)

func open_shop() -> void:
	print("[Crownspire UIManager] Opening Royal Treasury Shop.")

func open_building(building_id: String) -> void:
	print("[Crownspire UIManager] Opening window for building: %s" % building_id)

func close_window(window: Node) -> void:
	if is_instance_valid(window):
		window.queue_free()
		print("[Crownspire UIManager] Window closed.")

func open_window(window: Node) -> void:
	if is_instance_valid(window):
		print("[Crownspire UIManager] Displaying window: %s" % window.name)

func show_success(message: String) -> void:
	print("[Crownspire UIManager - SUCCESS] %s" % message)

func show_error(message: String) -> void:
	print("[Crownspire UIManager - ERROR] %s" % message)
