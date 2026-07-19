extends Node

# ==========================================
# CROWNSPIRE GLOBAL UI, ECONOMY & CAMPAIGN MANAGER (AUTOLOAD)
# ==========================================
# Acts as the central hub for:
# - Player State & Premium Currency tracking
# - JSON Data Loading & Caching (Categories, Items, Bundles, Offers, Campaigns, Quests)
# - Global Signals & Event Bus for Purchases, Quests, and Campaigns
# - Popup Depth Stack Management
# - Godot 4.4.1 Compliant Typed GDScript

# --- SIGNALS ---
signal currency_changed(currency_id: String, new_amount: float)
signal purchase_completed(item_id: String, success: bool, message: String)
signal reward_claimed(items_rewarded: Array[Dictionary]) # Array of {name, quantity, rarity}
signal panel_opened(panel_name: String)
signal panel_closed(panel_name: String)

# --- NEW CAMPAIGN & QUEST SIGNALS ---
signal quest_progress_updated(quest_id: String, progress: int)
signal quest_completed(quest_id: String)
signal quest_reward_claimed(quest_id: String, rewards: Array)
signal campaign_progress_updated(campaign_id: String, points: int)
signal campaign_milestone_claimed(campaign_id: String, milestone_index: int, rewards: Array)

# --- NEW CITY BUILDINGS SIGNALS ---
signal building_updated(building_id: String, new_level: int)
signal building_collected(building_id: String, resource_type: String, amount: int)
signal troops_trained(troop_id: String, quantity: int)
signal technology_researched(tech_id: String, new_level: int)

# --- NEW MARCH SIGNALS ---
signal march_started(march: Dictionary)
signal march_completed(march: Dictionary)
signal march_returned(march: Dictionary)
signal marches_updated()

# --- HERO SIGNALS ---
signal hero_levelled_up(hero_id: String, new_level: int)
signal hero_ascended(hero_id: String, new_stars: int)
signal hero_skill_upgraded(hero_id: String, skill_id: String, new_level: int)
signal hero_equipment_upgraded(hero_id: String, equip_id: String, new_level: int)
signal hero_unlocked(hero_id: String)
signal hero_favorite_toggled(hero_id: String, is_favorite: bool)

# --- BAG / INVENTORY SIGNALS ---
signal inventory_updated()

# --- ALLIANCE SIGNALS ---
signal alliance_updated()
signal alliance_help_updated()
signal alliance_gifts_updated()
signal alliance_chat_updated()
signal alliance_rally_updated()
signal alliance_war_updated()

# --- ECONOMY STATE ---
var royal_crystals: int = 5000:
	set(val):
		royal_crystals = val
		currency_changed.emit("royal_crystal", royal_crystals)
		save_player_state()

var aurora_crystals: int = 2500:
	set(val):
		aurora_crystals = val
		currency_changed.emit("aurora_crystal", aurora_crystals)
		save_player_state()

var gold: int = 100000:
	set(val):
		gold = val
		currency_changed.emit("gold", gold)
		save_player_state()

var alliance_honor: int = 50000:
	set(val):
		alliance_honor = val
		currency_changed.emit("alliance_honor", alliance_honor)
		save_player_state()

var vip_level: int = 4:
	set(val):
		vip_level = val
		currency_changed.emit("vip_level", vip_level)
		save_player_state()

var vip_points: int = 2400:
	set(val):
		vip_points = val
		currency_changed.emit("vip_points", vip_points)
		save_player_state()

var food: int = 500000:
	set(val):
		food = val
		currency_changed.emit("food", food)
		save_player_state()

var wood: int = 450000:
	set(val):
		wood = val
		currency_changed.emit("wood", wood)
		save_player_state()

var stone: int = 250000:
	set(val):
		stone = val
		currency_changed.emit("stone", stone)
		save_player_state()

var iron: int = 120000:
	set(val):
		iron = val
		currency_changed.emit("iron", iron)
		save_player_state()

var power: int = 1254300:
	set(val):
		power = val
		currency_changed.emit("power", power)
		save_player_state()

var player_name: String = "Lord Aurelius":
	set(val):
		player_name = val
		currency_changed.emit("player_name", 0) # Emit change or reload
		save_player_state()

var crystal_vault_coins: int = 3000:
	set(val):
		crystal_vault_coins = val
		currency_changed.emit("crystal_vault_coins", crystal_vault_coins)
		save_player_state()

var hero_tokens: int = 50:
	set(val):
		hero_tokens = val
		currency_changed.emit("hero_tokens", hero_tokens)
		save_player_state()

# --- DATA CACHING ---
var categories: Array = []
var items: Array = []
var bundles: Array = []
var offers: Array = []

var all_bag_items: Array = []
var player_inventory: Array = []
var resources_metadata: Array = []

# --- NEW CAMPAIGN DATA ---
var campaigns: Array = []
var quests: Array = []

# --- NEW CITY BUILDINGS DATA ---
var buildings: Array = []

# --- NEW MARCH DATA ---
var active_marches: Array = []

# --- HERO SYSTEM DATA ---
var heroes: Array = []
var hero_skills: Array = []
var hero_equipment: Array = []
var hero_xp_potions: int = 25

# --- POPUP STACK MANAGER ---
var popup_stack: Array[Control] = []

# --- ALLIANCE STATE ---
var player_alliance_id: String = "alliance_1"
var alliances_db: Array = []
var alliance_research_db: Array = []
var alliance_buildings_db: Array = []
var global_players_db: Array = []
var alliance_chat_messages: Array = [
	{"sender": "Lady Seraphina", "text": "Hail, Lord Aurelius! The Crystallite Spire yields are looking high today.", "time": "10:14 AM"},
	{"sender": "Garrick Ironfist", "text": "Need help on barracks, guys! Please hit help.", "time": "11:02 AM"},
	{"sender": "Valeria Swift", "text": "I'm rallying a Ruined Crystal Keep in 5 minutes. Get ready!", "time": "11:20 AM"}
]

func _ready() -> void:
	load_all_json_data()
	load_player_state()

# --- JSON UTILITIES ---
func load_all_json_data() -> void:
	categories = load_json_file("res://data/store_categories.json")
	items = load_json_file("res://data/store_items.json")
	bundles = load_json_file("res://data/bundles.json")
	offers = load_json_file("res://data/offers.json")
	buildings = load_json_file("res://data/buildings.json")
	heroes = load_json_file("res://data/heroes.json")
	hero_skills = load_json_file("res://data/hero_skills.json")
	hero_equipment = load_json_file("res://data/hero_equipment.json")
	
	all_bag_items = load_json_file("res://data/items.json")
	player_inventory = load_json_file("res://data/inventory.json")
	resources_metadata = load_json_file("res://data/resources.json")
	
	alliances_db = load_json_file("res://data/alliance.json")
	alliance_research_db = load_json_file("res://data/alliance_research.json")
	alliance_buildings_db = load_json_file("res://data/alliance_buildings.json")
	global_players_db = load_json_file("res://data/players.json")
	
	# Load Campaigns and Quests from dynamic file
	var raw_camp_quest = load_json_file("res://data/campaigns_and_quests.json")
	campaigns.clear()
	quests.clear()
	for obj in raw_camp_quest:
		if obj.get("type", "") == "campaign":
			campaigns.append(obj)
		elif obj.get("type", "") == "quest":
			quests.append(obj)
			
	print("[Crownspire UIManager] Database loaded.")
	print("  Categories: ", categories.size(), " | Items: ", items.size())
	print("  Bundles: ", bundles.size(), " | Offers: ", offers.size())
	print("  Campaigns: ", campaigns.size(), " | Quests: ", quests.size(), " | Buildings: ", buildings.size())

func load_json_file(path: String) -> Array:
	if not FileAccess.file_exists(path):
		push_error("[Crownspire UIManager] JSON file not found at: " + path)
		return []
		
	var file := FileAccess.open(path, FileAccess.READ)
	if not file:
		push_error("[Crownspire UIManager] Failed to open: " + path)
		return []
		
	var json_text := file.get_as_text()
	file.close()
	
	var json = JSON.new()
	var error = json.parse(json_text)
	if error != OK:
		push_error("[Crownspire UIManager] JSON parse error in %s: %s at line %s" % [path, json.get_error_message(), json.get_error_line()])
		return []
		
	var data = json.get_data()
	if typeof(data) == TYPE_ARRAY:
		return data
	return []

# --- STATE SAVING/LOADING ---
func save_player_state() -> void:
	var quest_state_list := []
	for q in quests:
		quest_state_list.append({
			"id": q["id"],
			"current_progress": q["current_progress"],
			"is_completed": q["is_completed"],
			"is_claimed": q["is_claimed"]
		})
		
	var campaign_state_list := []
	for c in campaigns:
		var milestones_claims := []
		for m in c["milestones"]:
			milestones_claims.append(m["claimed"])
		campaign_state_list.append({
			"id": c["id"],
			"current_points": c["current_points"],
			"milestones_claims": milestones_claims
		})

	var buildings_state := []
	for b in buildings:
		var tech_levels := {}
		if b.has("technologies"):
			for tech in b["technologies"]:
				tech_levels[tech["id"]] = tech["level"]
		buildings_state.append({
			"id": b["id"],
			"level": b["level"],
			"accumulated_resources": b.get("accumulated_resources", 0.0),
			"technologies": tech_levels
		})

	var saved_heroes := []
	for h in heroes:
		saved_heroes.append({
			"id": h["id"],
			"level": h["level"],
			"xp": h["xp"],
			"shards": h["shards"],
			"unlocked": h["unlocked"],
			"favorite": h["favorite"],
			"power": h["power"],
			"rarity_stars": h["rarity_stars"]
		})
	
	var saved_skills := []
	for s in hero_skills:
		saved_skills.append({
			"id": s["id"],
			"level": s["level"]
		})
		
	var saved_equipment := []
	for eq in hero_equipment:
		saved_equipment.append({
			"id": eq["id"],
			"level": eq["level"]
		})

	var state := {
		"royal_crystals": royal_crystals,
		"aurora_crystals": aurora_crystals,
		"gold": gold,
		"alliance_honor": alliance_honor,
		"vip_level": vip_level,
		"vip_points": vip_points,
		"food": food,
		"wood": wood,
		"stone": stone,
		"iron": iron,
		"power": power,
		"player_name": player_name,
		"crystal_vault_coins": crystal_vault_coins,
		"hero_tokens": hero_tokens,
		"quests_progress": quest_state_list,
		"campaigns_progress": campaign_state_list,
		"buildings": buildings_state,
		"active_marches": active_marches,
		"heroes": saved_heroes,
		"hero_skills": saved_skills,
		"hero_equipment": saved_equipment,
		"hero_xp_potions": hero_xp_potions,
		"player_inventory": player_inventory
	}
	var file := FileAccess.open("user://crownspire_player_state.save", FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(state))
		file.close()

func load_player_state() -> void:
	if not FileAccess.file_exists("user://crownspire_player_state.save"):
		return
	var file := FileAccess.open("user://crownspire_player_state.save", FileAccess.READ)
	if file:
		var json = JSON.new()
		var error = json.parse(file.get_as_text())
		file.close()
		if error == OK:
			var state = json.get_data()
			if typeof(state) == TYPE_DICTIONARY:
				if state.has("royal_crystals"): royal_crystals = state["royal_crystals"]
				if state.has("aurora_crystals"): aurora_crystals = state["aurora_crystals"]
				if state.has("gold"): gold = state["gold"]
				if state.has("alliance_honor"): alliance_honor = state["alliance_honor"]
				if state.has("vip_level"): vip_level = state["vip_level"]
				if state.has("vip_points"): vip_points = state["vip_points"]
				if state.has("food"): food = state["food"]
				if state.has("wood"): wood = state["wood"]
				if state.has("stone"): stone = state["stone"]
				if state.has("iron"): iron = state["iron"]
				if state.has("power"): power = state["power"]
				if state.has("player_name"): player_name = state["player_name"]
				if state.has("crystal_vault_coins"): crystal_vault_coins = state["crystal_vault_coins"]
				if state.has("hero_tokens"): hero_tokens = state["hero_tokens"]
				
				# Restore quests progress
				if state.has("quests_progress"):
					var q_saved = state["quests_progress"] as Array
					for q_item in q_saved:
						for q in quests:
							if q["id"] == q_item["id"]:
								q["current_progress"] = q_item["current_progress"]
								q["is_completed"] = q_item["is_completed"]
								q["is_claimed"] = q_item["is_claimed"]
								
				# Restore campaigns progress
				if state.has("campaigns_progress"):
					var c_saved = state["campaigns_progress"] as Array
					for c_item in c_saved:
						for c in campaigns:
							if c["id"] == c_item["id"]:
								c["current_points"] = c_item["current_points"]
								var saved_claims = c_item["milestones_claims"] as Array
								for idx in range(min(saved_claims.size(), c["milestones"].size())):
									c["milestones"][idx]["claimed"] = saved_claims[idx]

				# Restore buildings progress
				if state.has("buildings"):
					var b_saved = state["buildings"] as Array
					for b_item in b_saved:
						for b in buildings:
							if b["id"] == b_item["id"]:
								b["level"] = b_item["level"]
								if b_item.has("accumulated_resources"):
									b["accumulated_resources"] = b_item["accumulated_resources"]
								if b_item.has("technologies") and b.has("technologies"):
									var saved_techs = b_item["technologies"] as Dictionary
									for tech in b["technologies"]:
										if saved_techs.has(tech["id"]):
											tech["level"] = saved_techs[tech["id"]]
											
				# Restore active marches list
				if state.has("active_marches"):
					active_marches = state["active_marches"]

				# Restore hero state
				if state.has("hero_xp_potions"):
					hero_xp_potions = state["hero_xp_potions"]
				
				if state.has("heroes"):
					var h_saved = state["heroes"] as Array
					for h_item in h_saved:
						for h in heroes:
							if h["id"] == h_item["id"]:
								if h_item.has("level"): h["level"] = h_item["level"]
								if h_item.has("xp"): h["xp"] = h_item["xp"]
								if h_item.has("shards"): h["shards"] = h_item["shards"]
								if h_item.has("unlocked"): h["unlocked"] = h_item["unlocked"]
								if h_item.has("favorite"): h["favorite"] = h_item["favorite"]
								if h_item.has("power"): h["power"] = h_item["power"]
								if h_item.has("rarity_stars"): h["rarity_stars"] = h_item["rarity_stars"]
				
				if state.has("hero_skills"):
					var s_saved = state["hero_skills"] as Array
					for s_item in s_saved:
						for s in hero_skills:
							if s["id"] == s_item["id"]:
								s["level"] = s_item["level"]
								
				if state.has("hero_equipment"):
					var eq_saved = state["hero_equipment"] as Array
					for eq_item in eq_saved:
						for eq in hero_equipment:
							if eq["id"] == eq_item["id"]:
								eq["level"] = eq_item["level"]
								
				if state.has("player_inventory"):
					player_inventory = state["player_inventory"]

# --- DYNAMIC GETTERS ---
func get_categories() -> Array:
	return categories

func get_items_by_category(category_id: String) -> Array:
	var filtered: Array = []
	for item in items:
		if item["category_id"] == category_id:
			filtered.append(item)
	return filtered

func get_all_bundles() -> Array:
	var active_bundles: Array = []
	for b in bundles:
		if b.get("active", true):
			active_bundles.append(b)
	return active_bundles

func get_all_offers() -> Array:
	return offers

func get_all_quests() -> Array:
	return quests

func get_active_campaigns() -> Array:
	var active: Array = []
	for c in campaigns:
		if c.get("is_active", true):
			active.append(c)
	return active

# --- QUESTS & CAMPAIGNS GAMEPLAY ENGINE ---

func add_quest_progress(quest_id: String, amount: int) -> void:
	for q in quests:
		if q["id"] == quest_id:
			if q["is_completed"] or q["is_claimed"]:
				return
			
			q["current_progress"] = min(q["current_progress"] + amount, q["target_progress"])
			quest_progress_updated.emit(quest_id, q["current_progress"])
			
			if q["current_progress"] >= q["target_progress"]:
				q["is_completed"] = true
				quest_completed.emit(quest_id)
				
			save_player_state()
			return

func claim_quest_reward(quest_id: String) -> void:
	for q in quests:
		if q["id"] == quest_id:
			if not q["is_completed"] or q["is_claimed"]:
				return
				
			q["is_claimed"] = true
			
			# Add reward payouts to wallets
			var rewards_to_alert: Array[Dictionary] = []
			for reward in q["rewards"]:
				var r_type = reward.get("type", "")
				var qty = reward.get("quantity", 0)
				_add_raw_currency(r_type, qty)
				
				rewards_to_alert.append({
					"name": reward.get("name", "Reward Item"),
					"quantity": qty,
					"rarity": reward.get("rarity", 1),
					"icon": reward.get("icon", "")
				})
				
			# Add quest points to active campaigns!
			var q_points = q.get("quest_points", 0)
			for c in campaigns:
				if c.get("is_active", true):
					c["current_points"] = c["current_points"] + q_points
					campaign_progress_updated.emit(c["id"], c["current_points"])
					
			quest_reward_claimed.emit(quest_id, rewards_to_alert)
			reward_claimed.emit(rewards_to_alert) # Triggers global celebration
			save_player_state()
			return

func claim_campaign_milestone(campaign_id: String, milestone_index: int) -> void:
	for c in campaigns:
		if c["id"] == campaign_id:
			if milestone_index < 0 or milestone_index >= c["milestones"].size():
				return
				
			var milestone = c["milestones"][milestone_index]
			if milestone["claimed"]:
				return
				
			if c["current_points"] < milestone["points_required"]:
				return
				
			milestone["claimed"] = true
			
			# Process milestones awards
			var rewards_to_alert: Array[Dictionary] = []
			for reward in milestone["rewards"]:
				var item_name = reward.get("name", "Royal Loot")
				var qty = reward.get("quantity", 1)
				_add_raw_currency_by_name(item_name, qty)
				
				rewards_to_alert.append({
					"name": item_name,
					"quantity": qty,
					"rarity": reward.get("rarity", 2),
					"icon": reward.get("icon", "")
				})
				
			campaign_milestone_claimed.emit(campaign_id, milestone_index, rewards_to_alert)
			reward_claimed.emit(rewards_to_alert) # Celebrate!
			save_player_state()
			return

func _add_raw_currency(type: String, quantity: int) -> void:
	match type:
		"royal_crystal": royal_crystals += quantity
		"aurora_crystal": aurora_crystals += quantity
		"gold": gold += quantity
		"alliance_honor": alliance_honor += quantity
		_:
			# Non-currency items are tracked abstractly in player storage
			pass

func _add_raw_currency_by_name(item_name: String, quantity: int) -> void:
	if "Royal Crystals" in item_name:
		royal_crystals += quantity
	elif "Aurora Crystals" in item_name:
		aurora_crystals += quantity
	elif "Gold" in item_name:
		gold += quantity
	elif "Alliance" in item_name or "Honor" in item_name:
		alliance_honor += quantity

# --- BUSINESS LOGIC (STORE PURCHASES) ---
func attempt_purchase(item_id: String, cost_currency: String, cost_amount: float) -> void:
	var has_sufficient: bool = false
	match cost_currency:
		"royal_crystal":
			if royal_crystals >= cost_amount:
				royal_crystals -= int(cost_amount)
				has_sufficient = true
		"aurora_crystal":
			if aurora_crystals >= cost_amount:
				aurora_crystals -= int(cost_amount)
				has_sufficient = true
		"alliance_honor":
			if alliance_honor >= cost_amount:
				alliance_honor -= int(cost_amount)
				has_sufficient = true
		"gold":
			if gold >= cost_amount:
				gold -= int(cost_amount)
				has_sufficient = true
		"usd":
			has_sufficient = true
		_:
			purchase_completed.emit(item_id, false, "Unknown currency type: " + cost_currency)
			return

	if not has_sufficient:
		purchase_completed.emit(item_id, false, "Missing sufficient: " + cost_currency.replace("_", " ").capitalize())
		return

	var items_rewarded: Array[Dictionary] = []
	var found_name := "Mystic Items"
	var found_rarity := 1
	var resolved := false
	
	# 1. Check Store Items
	for item in items:
		if item["id"] == item_id:
			if item.get("purchase_limit", -1) != -1:
				item["current_purchases"] = item.get("current_purchases", 0) + 1
			found_name = item["name"]
			found_rarity = item["rarity"]
			items_rewarded.append({
				"name": found_name,
				"quantity": 1,
				"rarity": found_rarity
			})
			resolved = true
			break

	# 2. Check Bundles
	if not resolved:
		for b in bundles:
			if b["id"] == item_id:
				found_name = b["name"]
				found_rarity = b.get("rarity", 3)
				for bundle_item in b["items"]:
					items_rewarded.append({
						"name": bundle_item["name"],
						"quantity": bundle_item["quantity"],
						"rarity": bundle_item["rarity"]
					})
				resolved = true
				break

	# 3. Check Flash Offers
	if not resolved:
		for o in offers:
			if o["id"] == item_id:
				o["current_claims"] = o.get("current_claims", 0) + 1
				found_name = o["name"]
				found_rarity = o.get("rarity", 3)
				for offer_item in o["items"]:
					items_rewarded.append({
						"name": offer_item["name"],
						"quantity": offer_item["quantity"],
						"rarity": offer_item["rarity"]
					})
				resolved = true
				break

	if not resolved:
		items_rewarded.append({
			"name": "Sovereign Supply Lockbox",
			"quantity": 1,
			"rarity": 2
		})

	# Triggers progression quest trackers for store purchases!
	add_quest_progress("quest_train_troops", 10) # Simulate troop training points when acquiring war chests

	purchase_completed.emit(item_id, true, "Purchase Successful!")
	reward_claimed.emit(items_rewarded)

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

func close_popup(popup_node: Control) -> void:
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

# --- RESOURCE PRODUCTION & TICK SYSTEM ---
var resource_timer: float = 0.0

func _process(delta: float) -> void:
	resource_timer += delta
	if resource_timer >= 1.0:
		resource_timer -= 1.0
		_accumulate_resources_tick()
	_update_marches_tick(delta)

func _update_marches_tick(delta: float) -> void:
	var marches_changed := false
	
	# Loop backward to allow safe removal during tick
	for i in range(active_marches.size() - 1, -1, -1):
		var m = active_marches[i]
		m["elapsed_time"] += delta
		marches_changed = true
		
		if m["elapsed_time"] >= m["total_time"]:
			if m["state"] == "marching":
				m["state"] = "returning"
				m["elapsed_time"] = 0.0
				_process_march_impact(m)
				march_completed.emit(m)
			elif m["state"] == "returning":
				active_marches.remove_at(i)
				march_returned.emit(m)
				
				# Notify player of troop return
				var notify_list: Array[Dictionary] = [{
					"name": "Expedition returned from %s" % m["target_name"],
					"quantity": 1,
					"rarity": 2,
					"icon": "res://assets/ui/icons/hero_shard_gold.png"
				}]
				reward_claimed.emit(notify_list)
	
	if marches_changed:
		marches_updated.emit()

func _process_march_impact(m: Dictionary) -> void:
	var rewards_list: Array[Dictionary] = []
	for r in m.get("rewards", []):
		rewards_list.append(r)
		
		var r_name = r.get("name", "").to_lower()
		var qty = int(r.get("quantity", 0))
		if "food" in r_name: food += qty
		elif "timber" in r_name or "wood" in r_name: wood += qty
		elif "granite" in r_name or "stone" in r_name: stone += qty
		elif "iron" in r_name or "ore" in r_name: iron += qty
		elif "gold" in r_name: gold += qty
		elif "crystal" in r_name: royal_crystals += qty
	
	reward_claimed.emit(rewards_list)
	
	# Quest progress trigger based on dispatch destination type
	if m["type"] == "attack":
		add_quest_progress("quest_pve_victory", 1)
	elif m["type"] == "gather":
		add_quest_progress("quest_gather_wood", 15000)

func start_march(type: String, target_id: String, target_name: String, target_x: int, target_y: int, duration: float, rewards: Array) -> Dictionary:
	var march_id = "march_" + str(Time.get_ticks_msec()) + "_" + str(randi() % 1000)
	var m = {
		"id": march_id,
		"type": type,
		"target_id": target_id,
		"target_name": target_name,
		"target_x": target_x,
		"target_y": target_y,
		"total_time": duration,
		"elapsed_time": 0.0,
		"state": "marching",
		"rewards": rewards
	}
	active_marches.append(m)
	march_started.emit(m)
	marches_updated.emit()
	save_player_state()
	return { "success": true, "message": "Garrison has departed for %s (%d, %d)!" % [target_name, target_x, target_y] }

func _accumulate_resources_tick() -> void:
	var state_dirty := false
	for b in buildings:
		if b.get("type", "") == "resource" and b.has("production_rate_per_hour"):
			var rate = float(b["production_rate_per_hour"])
			var cap = float(b.get("max_capacity", 10000.0))
			var current = float(b.get("accumulated_resources", 0.0))
			
			if current < cap:
				var prod = rate / 3600.0
				var new_amt = min(current + prod, cap)
				b["accumulated_resources"] = new_amt
				state_dirty = true
	if state_dirty:
		# Save progress occasionally
		pass

# --- BUILDINGS GAMEPLAY API ---
func get_all_buildings() -> Array:
	return buildings

func get_building(b_id: String) -> Dictionary:
	for b in buildings:
		if b["id"] == b_id:
			return b
	return {}

func upgrade_building(b_id: String) -> Dictionary:
	for b in buildings:
		if b["id"] == b_id:
			var lvl = b["level"]
			var max_lvl = b.get("max_level", 30)
			if lvl >= max_lvl:
				return { "success": false, "message": "Building already at maximum level!" }
				
			var reqs = b.get("resources_required", {})
			
			# Check enough resources
			var req_food = int(reqs.get("food", 0) * (1.0 + lvl * 0.15))
			var req_wood = int(reqs.get("wood", 0) * (1.0 + lvl * 0.15))
			var req_stone = int(reqs.get("stone", 0) * (1.0 + lvl * 0.15))
			var req_iron = int(reqs.get("iron", 0) * (1.0 + lvl * 0.15))
			
			if food < req_food: return { "success": false, "message": "Insufficient Food!" }
			if wood < req_wood: return { "success": false, "message": "Insufficient Wood!" }
			if stone < req_stone: return { "success": false, "message": "Insufficient Stone!" }
			if iron < req_iron: return { "success": false, "message": "Insufficient Iron!" }
			
			# Deduct materials
			food -= req_food
			wood -= req_wood
			stone -= req_stone
			iron -= req_iron
			
			# Increment Level
			b["level"] = lvl + 1
			
			# Power boost!
			var power_gain = int(b.get("power_per_level", 100) * (1.0 + lvl * 0.1))
			power += power_gain
			
			# Update bonuses
			if b.get("type", "") == "resource":
				b["production_rate_per_hour"] = int(b["production_rate_per_hour"] * 1.15)
				b["max_capacity"] = int(b["max_capacity"] * 1.15)
				b["current_bonus"] = "%.1fK %s / Hour" % [float(b["production_rate_per_hour"]) / 1000.0, b["produces"].capitalize()]
				b["next_bonus"] = "%.1fK %s / Hour" % [float(b["production_rate_per_hour"] * 1.15) / 1000.0, b["produces"].capitalize()]
			
			building_updated.emit(b_id, b["level"])
			
			# Progress general build quests
			add_quest_progress("quest_train_troops", 15) # Feed progress or custom markers
			
			# Trigger rewards list for visual appreciation
			var rewards_list: Array[Dictionary] = [{
				"name": "Level %d %s Upgrade" % [b["level"], b["name"]],
				"quantity": 1,
				"rarity": 3,
				"icon": "res://assets/ui/icons/category_featured.png"
			}]
			reward_claimed.emit(rewards_list)
			
			save_player_state()
			return { "success": true, "message": "Successfully upgraded %s to Level %d!" % [b["name"], b["level"]] }
			
	return { "success": false, "message": "Building not found." }

func collect_building_resources(b_id: String) -> Dictionary:
	for b in buildings:
		if b["id"] == b_id:
			var amt = int(b.get("accumulated_resources", 0.0))
			if amt <= 0:
				return { "success": false, "message": "No resources gathered yet!" }
				
			var type = b.get("produces", "")
			match type:
				"food": food += amt
				"wood": wood += amt
				"stone": stone += amt
				"iron": iron += amt
				_: return { "success": false, "message": "Invalid resource generator type." }
				
			b["accumulated_resources"] = 0.0
			building_collected.emit(b_id, type, amt)
			
			# Progress gathering quest if appropriate
			if type == "wood":
				add_quest_progress("quest_gather_wood", amt)
			
			# Trigger a rewarding loot toast / celebration
			var rarity_grade = 1
			if amt > 15000: rarity_grade = 2
			if amt > 30000: rarity_grade = 3
			
			var rewards_list: Array[Dictionary] = [{
				"name": "%s Provisions" % [type.capitalize()],
				"quantity": amt,
				"rarity": rarity_grade,
				"icon": "res://assets/ui/icons/res_%s.png" % [type]
			}]
			reward_claimed.emit(rewards_list)
			
			save_player_state()
			return { "success": true, "message": "Collected %d %s!" % [amt, type.capitalize()] }
			
	return { "success": false, "message": "Building not found." }

func train_barracks_troops(troop_id: String, count: int) -> Dictionary:
	var barracks_ref = get_building("barracks")
	if barracks_ref.is_empty():
		return { "success": false, "message": "Barracks building data not loaded." }
		
	var found_troop = {}
	for troop in barracks_ref.get("troop_types", []):
		if troop["id"] == troop_id:
			found_troop = troop
			break
			
	if found_troop.is_empty():
		return { "success": false, "message": "Troop design specifications not found." }
		
	# Check train cost totals
	var cost_food = int(found_troop.get("cost_food", 0)) * count
	var cost_wood = int(found_troop.get("cost_wood", 0)) * count
	var cost_iron = int(found_troop.get("cost_iron", 0)) * count
	
	if food < cost_food: return { "success": false, "message": "Insufficient Food for this recruitment batch!" }
	if wood < cost_wood: return { "success": false, "message": "Insufficient Wood for this recruitment batch!" }
	if iron < cost_iron: return { "success": false, "message": "Insufficient Iron for this recruitment batch!" }
	
	# Pay resource costs
	food -= cost_food
	wood -= cost_wood
	iron -= cost_iron
	
	# Gain Power rating
	var power_bonus = int(found_troop.get("power_rating", 1)) * count
	power += power_bonus
	
	# Trigger signal
	troops_trained.emit(troop_id, count)
	
	# Update Quest progress
	add_quest_progress("quest_train_troops", count)
	
	# Trigger celebration toast
	var rewards_list: Array[Dictionary] = [{
		"name": found_troop["name"],
		"quantity": count,
		"rarity": 2,
		"icon": "res://assets/ui/icons/hero_shard_gold.png" # Represent legion recruits
	}]
	reward_claimed.emit(rewards_list)
	
	save_player_state()
	return { "success": true, "message": "Recruited %d %s into your defensive legion!" % [count, found_troop["name"]] }

func research_technology(tech_id: String) -> Dictionary:
	var academy_ref = get_building("academy")
	if academy_ref.is_empty():
		return { "success": false, "message": "Academy building data not loaded." }
		
	var found_tech = {}
	for tech in academy_ref.get("technologies", []):
		if tech["id"] == tech_id:
			found_tech = tech
			break
			
	if found_tech.is_empty():
		return { "success": false, "message": "Technology details not found." }
		
	var current_lvl = found_tech["level"]
	var max_lvl = found_tech.get("max_level", 10)
	if current_lvl >= max_lvl:
		return { "success": false, "message": "Technology is already researched to maximum level!" }
		
	var cost_food = int(found_tech.get("cost_food", 0) * (1.0 + current_lvl * 0.25))
	var cost_wood = int(found_tech.get("cost_wood", 0) * (1.0 + current_lvl * 0.25))
	var cost_iron = int(found_tech.get("cost_iron", 0) * (1.0 + current_lvl * 0.25))
	var cost_gold = int(found_tech.get("cost_gold", 0) * (1.0 + current_lvl * 0.25))
	
	if food < cost_food: return { "success": false, "message": "Insufficient Food for researching!" }
	if wood < cost_wood: return { "success": false, "message": "Insufficient Wood for researching!" }
	if iron < cost_iron: return { "success": false, "message": "Insufficient Iron for researching!" }
	if gold < cost_gold: return { "success": false, "message": "Insufficient Gold for researching!" }
	
	# Pay resources
	food -= cost_food
	wood -= cost_wood
	iron -= cost_iron
	gold -= cost_gold
	
	found_tech["level"] = current_lvl + 1
	
	# Power boost
	power += 500 * (current_lvl + 1)
	
	# Emit signal
	technology_researched.emit(tech_id, found_tech["level"])
	
	# Trigger celebration toast
	var rewards_list: Array[Dictionary] = [{
		"name": "Level %d %s Academy Research" % [found_tech["level"], found_tech["name"]],
		"quantity": 1,
		"rarity": 3,
		"icon": "res://assets/ui/icons/spd_research.png"
	}]
	reward_claimed.emit(rewards_list)
	
	save_player_state()
	return { "success": true, "message": "Successfully researched %s to Level %d!" % [found_tech["name"], found_tech["level"]] }


# ==========================================
# CROWNSPIRE HERO SYSTEM GAMEPLAY API
# ==========================================

func get_heroes() -> Array:
	return heroes

func get_hero(hero_id: String) -> Dictionary:
	for h in heroes:
		if h["id"] == hero_id:
			return h
	return {}

func get_hero_skills(hero_id: String) -> Array:
	var list := []
	for s in hero_skills:
		if s["hero_id"] == hero_id:
			list.append(s)
	return list

func get_hero_equipment(hero_id: String) -> Array:
	var list := []
	for eq in hero_equipment:
		if eq["hero_id"] == hero_id:
			list.append(eq)
	return list

func toggle_hero_favorite(hero_id: String) -> void:
	for h in heroes:
		if h["id"] == hero_id:
			h["favorite"] = not h.get("favorite", false)
			hero_favorite_toggled.emit(hero_id, h["favorite"])
			save_player_state()
			break

func upgrade_hero_with_xp(hero_id: String) -> Dictionary:
	var h = get_hero(hero_id)
	if h.is_empty():
		return {"success": false, "message": "Hero not found."}
	if not h.get("unlocked", false):
		return {"success": false, "message": "Hero is not unlocked yet."}
	if h["level"] >= h["max_level"]:
		return {"success": false, "message": "Hero is already at maximum level!"}
	if hero_xp_potions <= 0:
		return {"success": false, "message": "No experience potions remaining!"}
		
	# Consume one potion, add 500 XP
	hero_xp_potions -= 1
	var xp_gain = 500
	h["xp"] += xp_gain
	
	var levelled_up := false
	while h["xp"] >= h["xp_required"] and h["level"] < h["max_level"]:
		h["xp"] -= h["xp_required"]
		h["level"] += 1
		# Scale next level requirements
		h["xp_required"] = int(h["xp_required"] * 1.25)
		levelled_up = true
		
	# Re-calculate power
	h["power"] = calculate_hero_power(hero_id)
	
	if levelled_up:
		hero_levelled_up.emit(hero_id, h["level"])
		power += 1500 # Global kingdom power boost
		save_player_state()
		return {"success": true, "message": "Hero Levelled Up to Level %d!" % h["level"], "levelled_up": true}
	else:
		save_player_state()
		return {"success": true, "message": "Gained 500 XP. Current: %d/%d" % [h["xp"], h["xp_required"]], "levelled_up": false}

func ascend_hero(hero_id: String) -> Dictionary:
	var h = get_hero(hero_id)
	if h.is_empty():
		return {"success": false, "message": "Hero not found."}
	if h["rarity_stars"] >= 6:
		return {"success": false, "message": "Hero already at maximum 6-star ascension!"}
	if h["shards"] < h["shards_required"]:
		return {"success": false, "message": "Insufficient shards! Need %d." % h["shards_required"]}
		
	# Consume shards
	h["shards"] -= h["shards_required"]
	h["rarity_stars"] += 1
	# Scale next shard requirements
	h["shards_required"] = int(h["shards_required"] * 1.5)
	h["max_level"] += 5
	
	h["power"] = calculate_hero_power(hero_id)
	hero_ascended.emit(hero_id, h["rarity_stars"])
	power += 3000 # Large global power boost
	save_player_state()
	return {"success": true, "message": "Hero ascended to %d Stars!" % h["rarity_stars"]}

func upgrade_hero_skill(hero_id: String, skill_id: String) -> Dictionary:
	var s_found = {}
	for s in hero_skills:
		if s["id"] == skill_id and s["hero_id"] == hero_id:
			s_found = s
			break
	if s_found.is_empty():
		return {"success": false, "message": "Skill not found."}
	if s_found["level"] >= s_found.get("max_level", 5):
		return {"success": false, "message": "Skill already at maximum level!"}
		
	# Gold cost to upgrade skill
	var gold_cost = s_found["level"] * 5000
	if gold < gold_cost:
		return {"success": false, "message": "Insufficient Gold! Need %d." % gold_cost}
		
	gold -= gold_cost
	s_found["level"] += 1
	
	# Update hero power
	var h = get_hero(hero_id)
	if not h.is_empty():
		h["power"] = calculate_hero_power(hero_id)
		
	hero_skill_upgraded.emit(hero_id, skill_id, s_found["level"])
	power += 800
	save_player_state()
	return {"success": true, "message": "Skill %s upgraded to Level %d!" % [s_found["name"], s_found["level"]]}

func upgrade_hero_equipment(hero_id: String, equip_id: String) -> Dictionary:
	var eq_found = {}
	for eq in hero_equipment:
		if eq["id"] == equip_id and eq["hero_id"] == hero_id:
			eq_found = eq
			break
	if eq_found.is_empty():
		return {"success": false, "message": "Equipment item not found."}
		
	# Iron and gold cost to forge/upgrade gear
	var iron_cost = eq_found["level"] * 500
	var gold_cost = eq_found["level"] * 1200
	if iron < iron_cost:
		return {"success": false, "message": "Insufficient Iron! Need %d." % iron_cost}
	if gold < gold_cost:
		return {"success": false, "message": "Insufficient Gold! Need %d." % gold_cost}
		
	iron -= iron_cost
	gold -= gold_cost
	eq_found["level"] += 1
	eq_found["stat_value"] = int(eq_found["stat_value"] * 1.15)
	
	# Update hero power
	var h = get_hero(hero_id)
	if not h.is_empty():
		h["power"] = calculate_hero_power(hero_id)
		
	hero_equipment_upgraded.emit(hero_id, equip_id, eq_found["level"])
	power += 1000
	save_player_state()
	return {"success": true, "message": "Forged equipment %s to Level %d!" % [eq_found["name"], eq_found["level"]]}

func unlock_hero(hero_id: String) -> Dictionary:
	var h = get_hero(hero_id)
	if h.is_empty():
		return {"success": false, "message": "Hero not found."}
	if h.get("unlocked", false):
		return {"success": false, "message": "Hero is already unlocked."}
	if h["shards"] < h["shards_required"]:
		return {"success": false, "message": "Insufficient shards to summon this hero!"}
		
	h["shards"] -= h["shards_required"]
	h["unlocked"] = true
	h["level"] = 1
	h["power"] = calculate_hero_power(hero_id)
	
	hero_unlocked.emit(hero_id)
	power += 5000 # Massive summon power boost
	save_player_state()
	return {"success": true, "message": "Successfully Summoned %s!" % h["name"]}

func calculate_hero_power(hero_id: String) -> int:
	var h = get_hero(hero_id)
	if h.is_empty() or not h.get("unlocked", false):
		return 0
		
	var base = h["level"] * 200 + h["rarity_stars"] * 1000
	# Add skills level impact
	for s in get_hero_skills(hero_id):
		base += s["level"] * 400
	# Add equipment impact
	for eq in get_hero_equipment(hero_id):
		base += eq["level"] * 150 + eq["stat_value"]
		
	# Epic/Legendary multiplier
	var mult = 1.0
	match h.get("rarity", ""):
		"Epic": mult = 1.25
		"Legendary": mult = 1.6
		"Rare": mult = 1.0
	return int(base * mult)

# ==============================================================================
# --- BAG / INVENTORY MANAGER UTILITIES ---
# ==============================================================================

func get_item_definition(item_id: String) -> Dictionary:
	for item in all_bag_items:
		if item["id"] == item_id:
			return item
	return {}

func get_item_quantity(item_id: String) -> int:
	for entry in player_inventory:
		if entry["item_id"] == item_id:
			return entry["quantity"]
	return 0

func add_inventory_item(item_id: String, quantity: int) -> void:
	if quantity <= 0: return
	var found = false
	for entry in player_inventory:
		if entry["item_id"] == item_id:
			entry["quantity"] += quantity
			entry["is_new"] = true
			found = true
			break
	if not found:
		player_inventory.append({
			"item_id": item_id,
			"quantity": quantity,
			"is_favorite": false,
			"is_locked": false,
			"is_new": true
		})
	inventory_updated.emit()
	save_player_state()

func remove_inventory_item(item_id: String, quantity: int) -> bool:
	if quantity <= 0: return true
	for i in range(player_inventory.size()):
		var entry = player_inventory[i]
		if entry["item_id"] == item_id:
			if entry["quantity"] >= quantity:
				entry["quantity"] -= quantity
				if entry["quantity"] == 0:
					player_inventory.remove_at(i)
				inventory_updated.emit()
				save_player_state()
				return true
			else:
				return false
	return false

func use_inventory_item(item_id: String, quantity: int) -> bool:
	var item_def = get_item_definition(item_id)
	if item_def.is_empty() or not item_def.get("can_use", false):
		return false
	
	if get_item_quantity(item_id) < quantity:
		return false
	
	# Execute the use effect
	var use_effect = item_def.get("use_effect", {})
	if not use_effect.is_empty():
		_execute_item_use_effect(use_effect, quantity)
	
	# Consume from inventory
	var success = remove_inventory_item(item_id, quantity)
	return success

func _execute_item_use_effect(effect: Dictionary, quantity: int) -> void:
	var type = effect.get("type", "")
	match type:
		"grant_resource":
			var resource = effect.get("resource", "")
			var base_amount = int(effect.get("amount", 0))
			var total_amount = base_amount * quantity
			
			match resource:
				"gold": gold += total_amount
				"food": food += total_amount
				"wood": wood += total_amount
				"stone": stone += total_amount
				"iron": iron += total_amount
				"royal_crystal": royal_crystals += total_amount
				"aurora_crystal": aurora_crystals += total_amount
				"alliance_honor": alliance_honor += total_amount
			
			# Emit currency changed to notify HUD
			currency_changed.emit(resource, get_resource_value(resource))
			
		"restore_stamina":
			# Handled as abstract, but let's notify
			print("[Crownspire Inventory] Restored ", effect.get("amount", 0) * quantity, " stamina.")
			
		"restore_hp":
			print("[Crownspire Inventory] Restored ", effect.get("amount", 0) * quantity, " Hero HP.")
			
		"speedup":
			print("[Crownspire Inventory] Speeded up queues by ", effect.get("minutes", 0) * quantity, " minutes.")
			
		"apply_shield":
			print("[Crownspire Inventory] Applied Citadel Shield for ", effect.get("duration_hours", 0) * quantity, " hours.")
			
		"apply_buff":
			print("[Crownspire Inventory] Applied combat buff: ", effect.get("buff_id", ""), " for ", effect.get("duration_hours", 0) * quantity, " hours.")
			
		"grant_hero_xp":
			# Hero XP potion added/used directly
			hero_xp_potions += quantity
			currency_changed.emit("hero_xp_potions", hero_xp_potions)
			
		"open_chest":
			# Chest looting is handled directly inside the ChestOpeningPopup UI for immersive animation
			pass

func get_resource_value(resource_id: String) -> int:
	match resource_id:
		"gold": return gold
		"food": return food
		"wood": return wood
		"stone": return stone
		"iron": return iron
		"royal_crystal", "diamonds": return royal_crystals
		"aurora_crystal": return aurora_crystals
		"alliance_honor", "alliance_coins": return alliance_honor
		"crystal_vault_coins": return crystal_vault_coins
		"hero_tokens": return hero_tokens
		"vip_points": return vip_points
	return 0

# ==========================================
# ALLIANCE GAMEPLAY SIMULATION ENGINE
# ==========================================
func get_player_alliance() -> Dictionary:
	if player_alliance_id == "":
		return {}
	for alliance in alliances_db:
		if alliance["id"] == player_alliance_id:
			return alliance
	return {}

func leave_alliance() -> void:
	var alliance = get_player_alliance()
	if not alliance.is_empty():
		# Remove player from members list if present
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

func join_alliance(alliance_id: String) -> void:
	player_alliance_id = alliance_id
	var alliance = get_player_alliance()
	if not alliance.is_empty():
		var members = alliance["members"] as Array
		# Check if already a member
		var is_member = false
		for m in members:
			if m["name"] == player_name:
				is_member = true
				break
		if not is_member:
			members.append({
				"name": player_name,
				"rank": 1, # Start as standard member
				"power": power,
				"is_online": true,
				"last_online": "Now"
			})
		alliance["member_count"] = members.size()
		add_alliance_log(player_name + " joined the alliance.")
	
	alliance_updated.emit()

func create_alliance(alliance_name_str: String, tag: String, description: String, banner_color: String, flag_symbol: String, flag_color: String) -> void:
	var new_id = "alliance_" + str(alliances_db.size() + 1)
	var new_alliance = {
		"id": new_id,
		"name": alliance_name_str,
		"tag": tag.to_upper(),
		"leader": player_name,
		"leader_power": power,
		"description": description if description != "" else "Welcome to " + alliance_name_str,
		"power": power,
		"member_count": 1,
		"max_members": 100,
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
			if old_rank < 3: # Can promote up to Officer (rank 3)
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
			if old_rank > 1: # Can demote down to Member (rank 1)
				m["rank"] = old_rank - 1
				add_alliance_log(member_name + " was demoted by " + player_name + ".")
				alliance_updated.emit()
			break

func donate_to_alliance_tech(tech_id: String, amount: int) -> bool:
	# Find technology node in database
	var target_tech: Dictionary = {}
	var category_name = ""
	for cat in alliance_research_db:
		for tech in cat["technologies"]:
			if tech["id"] == tech_id:
				target_tech = tech
				category_name = cat["category"]
				break
	
	if target_tech.is_empty():
		return false
		
	var req_res = target_tech["req_resource_type"]
	
	# Check cost
	var available_res = 0
	match req_res:
		"gold": available_res = gold
		"food": available_res = food
		"wood": available_res = wood
		"stone": available_res = stone
		"iron": available_res = iron
		"royal_crystal": available_res = royal_crystals
		"aurora_crystal": available_res = aurora_crystals
	
	if available_res < amount:
		return false
		
	# Deduct resource
	match req_res:
		"gold": gold -= amount
		"food": food -= amount
		"wood": wood -= amount
		"stone": stone -= amount
		"iron": iron -= amount
		"royal_crystal": royal_crystals -= amount
		"aurora_crystal": aurora_crystals -= amount
	
	# Add donation progress
	target_tech["current_donation"] += amount
	var max_don = int(target_tech["max_donation"])
	if target_tech["current_donation"] >= max_don:
		var extra = target_tech["current_donation"] - max_don
		target_tech["level"] += 1
		target_tech["current_donation"] = extra
		target_tech["max_donation"] = int(max_don * 1.5)
		add_alliance_log("Alliance completed Alchemical research for: " + target_tech["name"] + " Level " + str(target_tech["level"]) + "!")
	
	# Award alliance honor to player as contribution points
	alliance_honor += int(amount * 0.1)
	
	alliance_updated.emit()
	return true

func help_all_alliance_requests() -> void:
	var alliance = get_player_alliance()
	if alliance.is_empty(): return
	var reqs = alliance["help_requests"] as Array
	if reqs.is_empty(): return
	
	# Give player some alliance honor for helping
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
			
			# Process rewards
			var rewards = g["rewards"] as Array
			for r in rewards:
				var name_str = r["name"]
				var qty = int(r["quantity"])
				match name_str:
					"Gold": gold += qty
					"Aurora Crystal": aurora_crystals += qty
					"Hero XP Potion (Large)": hero_xp_potions += qty
			
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

func create_alliance_rally(target_name: String, target_lvl: int, time_left: int) -> void:
	var alliance = get_player_alliance()
	if alliance.is_empty(): return
	
	var rally_id = "rally_" + str(Time.get_ticks_msec())
	var new_rally = {
		"id": rally_id,
		"creator": player_name,
		"target": target_name,
		"target_level": target_lvl,
		"time_left_secs": time_left,
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
		"target": target_name + " Lvl " + str(target_lvl),
		"time_left_secs": time_left,
		"rally_id": rally_id
	}
	var wars = alliance["active_wars"] as Array
	wars.append(new_war)
	
	add_alliance_log(player_name + " initiated a tactical war rally against " + target_name + ".")
	alliance_updated.emit()
	alliance_rally_updated.emit()
	alliance_war_updated.emit()


