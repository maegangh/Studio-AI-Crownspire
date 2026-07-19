extends Node
class_name MailManager

# ==========================================
# CROWNSPIRE MAIL SYSTEM DATA MANAGER
# ==========================================

const SAVE_PATH = "user://crownspire_mail_state.save"

# In-memory mail collection
var mails_db: Array = []
var is_initialized: bool = false

# Signal event bus for the Mail module
signal mail_list_updated()
signal mail_unread_count_changed(count: int)

# Initial loading of the entire mail repository
func initialize_manager() -> void:
	if is_initialized:
		return
		
	mails_db.clear()
	
	# Try to load existing save state first
	if FileAccess.file_exists(SAVE_PATH):
		_load_save_state()
	else:
		_load_default_databases()
		_save_state() # Create initial save file
		
	is_initialized = true
	_check_and_clean_expired_mails()
	mail_unread_count_changed.emit(get_unread_count("all"))

# Loading default databases from JSONs
func _load_default_databases() -> void:
	var system_mails = _load_json_file("res://data/mail/system_mail.json")
	var battle_mails = _load_json_file("res://data/mail/battle_reports.json")
	var event_mails = _load_json_file("res://data/mail/event_mail.json")
	
	# Add system mail
	for mail in system_mails:
		mails_db.append(_sanitize_mail_data(mail))
		
	# Add battle reports
	for mail in battle_mails:
		mails_db.append(_sanitize_mail_data(mail))
		
	# Add event mails
	for mail in event_mails:
		mails_db.append(_sanitize_mail_data(mail))
		
	# Inject a couple of dynamic Alliance mail items from templates as starter data
	_inject_alliance_starter_mails()

func _inject_alliance_starter_mails() -> void:
	var templates = _load_json_file("res://data/mail/mail_templates.json")
	if templates.is_empty():
		return
		
	var gift_template = {}
	var rally_template = {}
	for t in templates:
		if t["id"] == "tpl_alliance_gift":
			gift_template = t
		elif t["id"] == "tpl_alliance_rally":
			rally_template = t
			
	# Generate alliance gift
	if not gift_template.is_empty():
		var mail = gift_template.duplicate(true)
		mail["id"] = "all_gift_101"
		mail["body"] = mail["body"].replace("{level}", "5").replace("{member_name}", "Garrick Ironfist")
		mail["timestamp"] = Time.get_unix_time_from_system() - 3600 * 2 # 2 hours ago
		mail["read"] = false
		mail["claimed"] = false
		mails_db.append(_sanitize_mail_data(mail))
		
	# Generate alliance rally announcement
	if not rally_template.is_empty():
		var mail = rally_template.duplicate(true)
		mail["id"] = "all_rally_102"
		mail["body"] = mail["body"].replace("{coordinates}", "(X: 520, Y: 410)").replace("{time_remaining}", "10 minutes")
		mail["timestamp"] = Time.get_unix_time_from_system() - 600 # 10 mins ago
		mail["read"] = false
		mail["claimed"] = true # No attachments to claim on rally alert
		mails_db.append(_sanitize_mail_data(mail))

func _sanitize_mail_data(mail: Dictionary) -> Dictionary:
	# Enforce type definitions and default keys
	if not mail.has("read"): mail["read"] = false
	if not mail.has("claimed"): mail["claimed"] = false
	if not mail.has("attachments"): mail["attachments"] = []
	if not mail.has("expires_in_days"): mail["expires_in_days"] = 15
	if not mail.has("battle_info"): mail["battle_info"] = {}
	
	# Calculate absolute expiration UNIX timestamp
	# If no timestamp exists, use current UNIX system time
	if not mail.has("timestamp") or mail["timestamp"] == 0:
		mail["timestamp"] = Time.get_unix_time_from_system()
		
	mail["expiry_timestamp"] = int(mail["timestamp"]) + (int(mail["expires_in_days"]) * 86400)
	return mail

# Load JSON helper with fallback paths
func _load_json_file(path: String) -> Array:
	if not FileAccess.file_exists(path):
		print("[Crownspire Mail] JSON DB not found: ", path)
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

# File I/O for state persistence
func _save_state() -> void:
	var file := FileAccess.open(SAVE_PATH, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(mails_db))
		file.close()
	mail_list_updated.emit()
	mail_unread_count_changed.emit(get_unread_count("all"))

func _load_save_state() -> void:
	var file := FileAccess.open(SAVE_PATH, FileAccess.READ)
	if file:
		var json = JSON.new()
		var error = json.parse(file.get_as_text())
		file.close()
		if error == OK:
			var data = json.get_data()
			if typeof(data) == TYPE_ARRAY:
				mails_db = data
				# Make sure expiry timestamps are recalculated/available
				for mail in mails_db:
					if not mail.has("expiry_timestamp"):
						mail["expiry_timestamp"] = int(mail.get("timestamp", Time.get_unix_time_from_system())) + (int(mail.get("expires_in_days", 15)) * 86400)

# Scans and deletes expired mail items
func _check_and_clean_expired_mails() -> void:
	var current_time = Time.get_unix_time_from_system()
	var size_before = mails_db.size()
	
	for i in range(mails_db.size() - 1, -1, -1):
		var mail = mails_db[i]
		# Mails with unclaimed attachments won't expire unless they exceed double the duration
		var grace_factor = 2 if (mail.get("attachments", []).size() > 0 and not mail.get("claimed", false)) else 1
		var expiry = int(mail.get("timestamp", current_time)) + (int(mail.get("expires_in_days", 15)) * 86400 * grace_factor)
		
		if current_time >= expiry:
			mails_db.remove_at(i)
			
	if mails_db.size() != size_before:
		_save_state()

# --- QUERY & GETTER ENGINES ---

func get_all_mails() -> Array:
	_check_and_clean_expired_mails()
	return mails_db

func get_mails_by_category(category_id: String) -> Array:
	_check_and_clean_expired_mails()
	if category_id == "all":
		return mails_db
		
	var filtered: Array = []
	for mail in mails_db:
		if mail.get("category_id") == category_id:
			filtered.append(mail)
	return filtered

func get_filtered_mails(category_id: String, filter_type: String, search_query: String = "", sort_mode: String = "newest") -> Array:
	var source = get_mails_by_category(category_id)
	var filtered: Array = []
	
	# Apply Filters (all, unread, rewards, battle_wins, battle_losses)
	for mail in source:
		var keep = true
		
		match filter_type:
			"unread":
				keep = !mail.get("read", false)
			"rewards":
				keep = mail.get("attachments", []).size() > 0 and !mail.get("claimed", false)
			"battle_wins":
				if mail.get("category_id") == "battle" and mail.has("battle_info"):
					var b_info = mail["battle_info"] as Dictionary
					keep = b_info.get("winner", "") == UIManager.player_name
				else:
					keep = false
			"battle_losses":
				if mail.get("category_id") == "battle" and mail.has("battle_info"):
					var b_info = mail["battle_info"] as Dictionary
					keep = b_info.get("loser", "") == UIManager.player_name
				else:
					keep = false
					
		# Apply Search Query (compares title, body, and sender)
		if keep and search_query != "":
			var q = search_query.to_lower()
			var t = mail.get("title", "").to_lower()
			var b = mail.get("body", "").to_lower()
			var s = mail.get("sender", "").to_lower()
			if not (q in t or q in b or q in s):
				keep = false
				
		if keep:
			filtered.append(mail)
			
	# Apply Sorting
	if sort_mode == "newest":
		filtered.sort_custom(func(a, b): return int(a.get("timestamp", 0)) > int(b.get("timestamp", 0)))
	elif sort_mode == "oldest":
		filtered.sort_custom(func(a, b): return int(a.get("timestamp", 0)) < int(b.get("timestamp", 0)))
	elif sort_mode == "expiring":
		filtered.sort_custom(func(a, b): return int(a.get("expiry_timestamp", 0)) < int(b.get("expiry_timestamp", 0)))
		
	return filtered

func get_unread_count(category_id: String = "all") -> int:
	var count = 0
	for mail in mails_db:
		if category_id == "all" or mail.get("category_id") == category_id:
			if not mail.get("read", false):
				count += 1
	return count

func get_unclaimed_rewards_count() -> int:
	var count = 0
	for mail in mails_db:
		if mail.get("attachments", []).size() > 0 and not mail.get("claimed", false):
			count += 1
	return count

# --- TRANSACTION & MUTATOR ENGINE ---

func mark_as_read(mail_id: String) -> void:
	for mail in mails_db:
		if mail["id"] == mail_id:
			if not mail["read"]:
				mail["read"] = true
				_save_state()
			break

func delete_mail(mail_id: String) -> void:
	for i in range(mails_db.size()):
		if mails_db[i]["id"] == mail_id:
			mails_db.remove_at(i)
			_save_state()
			break

func delete_all_read_in_category(category_id: String) -> void:
	var removed := false
	for i in range(mails_db.size() - 1, -1, -1):
		var mail = mails_db[i]
		if category_id == "all" or mail.get("category_id") == category_id:
			# Only delete if read, AND has either no attachments OR attachments are already claimed!
			var has_attachments = mail.get("attachments", []).size() > 0
			var claimed = mail.get("claimed", false)
			
			if mail.get("read", false) and (not has_attachments or claimed):
				mails_db.remove_at(i)
				removed = true
				
	if removed:
		_save_state()

func claim_mail_rewards(mail_id: String) -> Array:
	var rewarded_items := []
	for mail in mails_db:
		if mail["id"] == mail_id:
			if mail.get("attachments", []).size() > 0 and not mail.get("claimed", false):
				mail["claimed"] = true
				mail["read"] = true # Auto mark read on claim
				rewarded_items = mail["attachments"] as Array
				
				# Physically deliver items to UIManager wallets
				_deliver_rewards_to_player(rewarded_items)
				_save_state()
			break
	return rewarded_items

func claim_all_available_rewards(category_id: String) -> Array:
	var total_claimed_rewards := []
	var modified := false
	
	for mail in mails_db:
		if category_id == "all" or mail.get("category_id") == category_id:
			if mail.get("attachments", []).size() > 0 and not mail.get("claimed", false):
				mail["claimed"] = true
				mail["read"] = true # Auto mark read
				var attachments = mail["attachments"] as Array
				total_claimed_rewards.append_array(attachments)
				modified = true
				
	if modified:
		# Consolidation: sum duplicate items for the reward claim popup
		var consolidated := []
		var sums := {}
		for item in total_claimed_rewards:
			var id = item.get("id", "item")
			if sums.has(id):
				sums[id]["quantity"] += int(item.get("quantity", 1))
			else:
				sums[id] = item.duplicate(true)
				sums[id]["quantity"] = int(item.get("quantity", 1))
				consolidated.append(sums[id])
				
		_deliver_rewards_to_player(consolidated)
		_save_state()
		return consolidated
		
	return []

# Dynamic reward delivery mapping
func _deliver_rewards_to_player(rewards: Array) -> void:
	var items_to_notify: Array[Dictionary] = []
	for reward in rewards:
		var r_id = reward.get("id", "")
		var r_type = reward.get("type", "")
		var qty = int(reward.get("quantity", 1))
		var r_name = reward.get("name", "Royal Material")
		
		# Map reward to UIManager resources or inventory
		match r_type:
			"gold": UIManager.gold += qty
			"food": UIManager.food += qty
			"wood": UIManager.wood += qty
			"stone": UIManager.stone += qty
			"iron": UIManager.iron += qty
			"diamonds": UIManager.royal_crystals += qty
			"alliance_coins": UIManager.alliance_honor += qty
			"vip_points": UIManager.vip_points += qty
			"crystal_vault_coins": UIManager.crystal_vault_coins += qty
			"hero_tokens": UIManager.hero_tokens += qty
			"crystallite_cores":
				# Deliver crystallite cores to player alliance if active
				var alliance = UIManager.alliances_db.find(func(a): return a["id"] == UIManager.player_alliance_id)
				if alliance != -1:
					var al_dict = UIManager.alliances_db[alliance] as Dictionary
					al_dict["crystallite_cores"] = int(al_dict.get("crystallite_cores", 500)) + qty
					UIManager.alliance_updated.emit()
			"hero_shard":
				var hero_id = reward.get("hero_id", "maegan")
				_grant_hero_shard(hero_id, qty)
			"speedup_15m": UIManager.add_inventory_item("item_speedup_15m", qty)
			"speedup_1h": UIManager.add_inventory_item("item_speedup_1h", qty)
			"speedup_3h": UIManager.add_inventory_item("item_speedup_3h", qty)
			"shield_8h": UIManager.add_inventory_item("item_shield_8h", qty)
			"alliance_teleport": UIManager.add_inventory_item("item_teleport_alliance", qty)
			"vault_artifact": UIManager.add_inventory_item("item_vault_artifact", qty)
			"war_scroll_buff": UIManager.add_inventory_item("item_event_war_scroll", qty)
			"seasonal_skin": UIManager.add_inventory_item("item_seasonal_winter_shield", qty)
			_:
				# Generic inventory addition
				if r_id != "":
					UIManager.add_inventory_item(r_id, qty)
					
		items_to_notify.append({
			"name": r_name,
			"quantity": qty,
			"rarity": int(reward.get("rarity", 2)),
			"icon": reward.get("icon", "📦")
		})
		
	# Trigger celebration across HUD/notification system
	if items_to_notify.size() > 0:
		UIManager.reward_claimed.emit(items_to_notify)

func _grant_hero_shard(hero_id: String, amount: int) -> void:
	var heroes = UIManager.heroes as Array
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

# Formats Unix timestamps as readable relative string
func format_timestamp(unix_time: int) -> String:
	var current_time = Time.get_unix_time_from_system()
	var diff = current_time - unix_time
	
	if diff < 60:
		return "Just now"
	elif diff < 3600:
		return str(int(diff / 60)) + "m ago"
	elif diff < 86400:
		return str(int(diff / 3600)) + "h ago"
	elif diff < 604800:
		return str(int(diff / 86400)) + "d ago"
	else:
		var date = Time.get_date_dict_from_unix_time(unix_time)
		return "%02d/%02d/%d" % [date["month"], date["day"], date["year"]]

# Calculates expiry string details (e.g. "Expires in: 3 days")
func get_expiry_string(expiry_timestamp: int) -> String:
	var current_time = Time.get_unix_time_from_system()
	var diff = expiry_timestamp - current_time
	
	if diff <= 0:
		return "Expired"
	elif diff < 3600:
		return "Expires in: %dm" % int(diff / 60)
	elif diff < 86400:
		return "Expires in: %dh" % int(diff / 3600)
	else:
		return "Expires in: %dd" % int(diff / 86400)
