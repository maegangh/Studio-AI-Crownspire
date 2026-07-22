# ==========================================
# CROWNSPIRE ALLIANCE STORE MANAGER
# ==========================================
extends RefCounted

var ui_manager

const BAG_SAVE_PATH = "user://crownspire_bag_inventory_v1.save"

func can_purchase(item: Dictionary, current_honor: int) -> Dictionary:
	var cost = item.get("cost", 9999)
	if current_honor < cost:
		return {"success": false, "error": "Insufficient personal Honor Points! Donate to technologies to earn honor."}
	
	# Prevent negative balances
	if current_honor - cost < 0:
		return {"success": false, "error": "Purchase would result in negative Honor Points!"}
		
	# Check purchase limit if any
	if item.has("max_purchases") and item.get("max_purchases", 0) > 0:
		var purchase_count = _get_purchase_count(item.get("id"))
		if purchase_count >= item.get("max_purchases"):
			return {"success": false, "error": "Daily purchase limit reached for [%s]!" % item.get("name")}
			
	return {"success": true}

func execute_purchase(item: Dictionary) -> bool:
	var cost = item.get("cost", 9999)
	var check = can_purchase(item, ui_manager.alliance_honor)
	if not check["success"]:
		ui_manager.show_error(check["error"])
		return false
		
	# Deduct cost safely
	ui_manager.alliance_honor -= cost
	
	# Credit to player inventory bag
	var inventory = _load_inventory()
	_add_item_to_inventory(inventory, item)
	_save_inventory(inventory)
	
	# Keep track of purchase counts for limits if specified
	if item.has("max_purchases"):
		_increment_purchase_count(item.get("id"))
		
	ui_manager._save_alliance_databases()
	return true

func _load_inventory() -> Dictionary:
	if not FileAccess.file_exists(BAG_SAVE_PATH):
		return {}
	var file = FileAccess.open(BAG_SAVE_PATH, FileAccess.READ)
	if not file:
		return {}
	var content = file.get_as_text()
	file.close()
	var json = JSON.new()
	if json.parse(content) == OK:
		var data = json.get_data()
		if typeof(data) == TYPE_DICTIONARY:
			return data
	return {}

func _save_inventory(inv: Dictionary) -> void:
	var file = FileAccess.open(BAG_SAVE_PATH, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(inv))
		file.close()

func _add_item_to_inventory(inventory: Dictionary, item: Dictionary) -> void:
	var key = item.get("bag_key", "unknown")
	var name_str = item.get("name", "Unknown Item")
	var emoji = item.get("emoji", "📦")
	
	if not inventory.has(key):
		inventory[key] = {
			"id": key,
			"name": name_str,
			"qty": 0,
			"emoji": emoji,
			"description": item.get("desc", "")
		}
	inventory[key]["qty"] = int(inventory[key]["qty"]) + 1

# Purchase limits tracking
var _purchases_today: Dictionary = {}

func _get_purchase_count(item_id: String) -> int:
	return _purchases_today.get(item_id, 0)

func _increment_purchase_count(item_id: String) -> void:
	_purchases_today[item_id] = _get_purchase_count(item_id) + 1
