# ==========================================
# CROWNSPIRE ALLIANCE APPLICATION MANAGER
# ==========================================
extends RefCounted

var ui_manager

func accept_application(applicant_name: String) -> void:
	var alliance = ui_manager.get_player_alliance()
	if alliance.is_empty(): return
	var apps = alliance.get("applicants", []) as Array
	var app_data: Dictionary = {}
	for a in apps:
		if a.get("name", "") == applicant_name:
			app_data = a
			apps.erase(a)
			break
			
	if not app_data.is_empty():
		var members = alliance["members"] as Array
		members.append({
			"name": applicant_name,
			"rank": 2, # Default Member R2
			"power": app_data.get("power", 10000),
			"is_online": false,
			"last_online": "Just Now"
		})
		alliance["member_count"] = members.size()
		ui_manager.add_alliance_log(applicant_name + "'s admission request was approved by " + ui_manager.player_name + ".")
		
		# Update global player DB to link alliance
		for p in ui_manager.global_players_db:
			if p.get("name", "") == applicant_name:
				p["alliance_id"] = alliance["id"]
				break
				
		ui_manager._save_alliance_databases()
		ui_manager.alliance_updated.emit()
		ui_manager.show_success("Approved application for " + applicant_name + "!")

func reject_application(applicant_name: String) -> void:
	var alliance = ui_manager.get_player_alliance()
	if alliance.is_empty(): return
	var apps = alliance.get("applicants", []) as Array
	for a in apps:
		if a.get("name", "") == applicant_name:
			apps.erase(a)
			break
	ui_manager.add_alliance_log(applicant_name + "'s admission request was declined by " + ui_manager.player_name + ".")
	ui_manager._save_alliance_databases()
	ui_manager.alliance_updated.emit()
	ui_manager.show_success("Declined application for " + applicant_name + ".")
