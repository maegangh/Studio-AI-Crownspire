# ==========================================
# CROWNSPIRE ALLIANCE RESEARCH MANAGER
# ==========================================
extends RefCounted

var ui_manager

func donate_to_alliance_tech(tech_id: String, amount: int) -> bool:
	var target_tech: Dictionary = {}
	for cat in ui_manager.alliance_research_db:
		for tech in cat["technologies"]:
			if tech["id"] == tech_id:
				target_tech = tech
				break
	
	if target_tech.is_empty():
		return false
		
	var req_res = target_tech["req_resource_type"]
	var available_res = ui_manager.get_resource_value(req_res)
	
	if available_res < amount:
		return false
		
	match req_res:
		"gold": ui_manager.gold -= amount
		"food": ui_manager.food -= amount
		"wood": ui_manager.wood -= amount
		"stone": ui_manager.stone -= amount
		"iron": ui_manager.iron -= amount
		"royal_crystal": ui_manager.royal_crystals -= amount
		"aurora_crystal": ui_manager.aurora_crystals -= amount
	ui_manager.currency_changed.emit(req_res, float(ui_manager.get_resource_value(req_res)))
	
	target_tech["current_donation"] += amount
	var max_don = int(target_tech["max_donation"])
	if target_tech["current_donation"] >= max_don:
		var extra = target_tech["current_donation"] - max_don
		target_tech["level"] += 1
		target_tech["current_donation"] = extra
		target_tech["max_donation"] = int(max_don * 1.5)
		ui_manager.add_alliance_log("Alliance completed Alchemical research for: " + target_tech["name"] + " Level " + str(target_tech["level"]) + "!")
	
	ui_manager.alliance_honor += int(amount * 0.1)
	ui_manager._save_alliance_databases()
	ui_manager.alliance_updated.emit()
	return true
