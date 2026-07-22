# ==========================================
# CROWNSPIRE ALLIANCE LIFE-CYCLE MANAGER
# ==========================================
extends RefCounted

var ui_manager

func create_alliance(alliance_name_str: String, tag_str: String, flag_symbol: String, description: String = "", banner_color: String = "", flag_color: String = "", is_public: bool = true, min_power: int = 10000, language: String = "English") -> bool:
	if ui_manager.royal_crystals < 500:
		ui_manager.show_error("Insufficient Royal Crystals to found an Alliance! Required: 500.")
		return false
		
	# Name & Tag Uniqueness validation
	for a in ui_manager.alliances_db:
		if a.get("name", "").to_lower() == alliance_name_str.to_lower():
			ui_manager.show_error("Alliance name already taken!")
			return false
		if a.get("tag", "").to_lower() == tag_str.to_lower():
			ui_manager.show_error("Alliance tag already in use!")
			return false
			
	ui_manager.royal_crystals -= 500
	ui_manager.currency_changed.emit("royal_crystals", float(ui_manager.royal_crystals))
	
	var new_id = "alliance_" + str(ui_manager.alliances_db.size() + 1)
	var new_alliance = {
		"id": new_id,
		"name": alliance_name_str,
		"tag": tag_str.to_upper(),
		"leader": ui_manager.player_name,
		"leader_power": ui_manager.power,
		"description": description if description != "" else "Welcome to " + alliance_name_str,
		"power": ui_manager.power,
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
		"is_public": is_public,
		"min_power": min_power,
		"language": language,
		"logs": ["Alliance " + alliance_name_str + " was founded by " + ui_manager.player_name + "."],
		"members": [
			{"name": ui_manager.player_name, "rank": 5, "power": ui_manager.power, "is_online": true, "last_online": "Now"}
		],
		"rallies": [],
		"active_wars": [],
		"circulars": [
			{
				"title": "Welcome Sovereign!",
				"sender": ui_manager.player_name,
				"time": "Just Now",
				"message": "Welcome to " + alliance_name_str + "! Please study tech daily to expand our territory."
			}
		],
		"applicants": [],
		"invitations": []
	}
	ui_manager.alliances_db.append(new_alliance)
	ui_manager.player_alliance_id = new_id
	ui_manager._save_alliance_databases()
	ui_manager.alliance_updated.emit()
	return true

func leave_alliance() -> void:
	var alliance = ui_manager.get_player_alliance()
	if not alliance.is_empty():
		var members = alliance["members"] as Array
		var idx = -1
		for i in range(members.size()):
			if members[i]["name"] == ui_manager.player_name:
				idx = i
				break
		if idx != -1:
			members.remove_at(idx)
		alliance["member_count"] = members.size()
		ui_manager.add_alliance_log(ui_manager.player_name + " left the alliance.")
	
	ui_manager.player_alliance_id = ""
	ui_manager._save_alliance_databases()
	ui_manager.alliance_updated.emit()

func join_alliance(alliance_id: String) -> bool:
	var target_alliance: Dictionary = {}
	for a in ui_manager.alliances_db:
		if a.get("id", "") == alliance_id:
			target_alliance = a
			break
			
	if target_alliance.is_empty():
		return false
		
	# Power Check
	var min_p = int(target_alliance.get("min_power", 0))
	if ui_manager.power < min_p:
		ui_manager.show_error("Your power (%d) does not meet the minimum requirement (%d)!" % [ui_manager.power, min_p])
		return false
		
	# Open Join Check
	var is_pub = target_alliance.get("is_public", true)
	if is_pub:
		ui_manager.player_alliance_id = alliance_id
		var members = target_alliance["members"] as Array
		var is_member = false
		for m in members:
			if m["name"] == ui_manager.player_name:
				is_member = true
				break
		if not is_member:
			members.append({
				"name": ui_manager.player_name,
				"rank": 2, # Default Member R2
				"power": ui_manager.power,
				"is_online": true,
				"last_online": "Now"
			})
		target_alliance["member_count"] = members.size()
		ui_manager.add_alliance_log(ui_manager.player_name + " joined the alliance.")
		ui_manager._save_alliance_databases()
		ui_manager.alliance_updated.emit()
		return true
	else:
		# Approval/Application Required Routing
		var apps = target_alliance.get("applicants", []) as Array
		var already_applied = false
		for app in apps:
			if app.get("name", "") == ui_manager.player_name:
				already_applied = true
				break
		if not already_applied:
			apps.append({
				"name": ui_manager.player_name,
				"power": ui_manager.power,
				"level": 10
			})
			target_alliance["applicants"] = apps
			ui_manager.add_alliance_log(ui_manager.player_name + " submitted an admission request.")
			ui_manager._save_alliance_databases()
			ui_manager.alliance_updated.emit()
			ui_manager.show_success("Admission application dispatched! Wait for Officer review.")
		else:
			ui_manager.show_error("You already have a pending admission request with this Alliance!")
		return false

func kick_alliance_member(member_name: String) -> void:
	var alliance = ui_manager.get_player_alliance()
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
		ui_manager.add_alliance_log(member_name + " was kicked from the alliance by " + ui_manager.player_name + ".")
		
		# Update global players DB
		for p in ui_manager.global_players_db:
			if p.get("name", "") == member_name:
				p["alliance_id"] = ""
				break
				
		ui_manager._save_alliance_databases()
		ui_manager.alliance_updated.emit()

func promote_alliance_member(member_name: String) -> void:
	var alliance = ui_manager.get_player_alliance()
	if alliance.is_empty(): return
	var members = alliance["members"] as Array
	for m in members:
		if m["name"] == member_name:
			var old_rank = int(m["rank"])
			if old_rank < 4: # Can promote up to R4 Officer (not R5 Leader)
				m["rank"] = old_rank + 1
				var rank_name = ui_manager.permission_manager.get_rank_name(old_rank + 1)
				ui_manager.add_alliance_log(member_name + " was promoted to " + rank_name + " rank by " + ui_manager.player_name + ".")
				ui_manager._save_alliance_databases()
				ui_manager.alliance_updated.emit()
			break

func demote_alliance_member(member_name: String) -> void:
	var alliance = ui_manager.get_player_alliance()
	if alliance.is_empty(): return
	var members = alliance["members"] as Array
	for m in members:
		if m["name"] == member_name:
			var old_rank = int(m["rank"])
			if old_rank > 1: # Can demote down to R1 Recruit
				m["rank"] = old_rank - 1
				var rank_name = ui_manager.permission_manager.get_rank_name(old_rank - 1)
				ui_manager.add_alliance_log(member_name + " was demoted to " + rank_name + " rank by " + ui_manager.player_name + ".")
				ui_manager._save_alliance_databases()
				ui_manager.alliance_updated.emit()
			break
