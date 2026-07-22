# ==========================================
# CROWNSPIRE ALLIANCE MAIL MANAGER
# ==========================================
extends RefCounted

var ui_manager

func send_alliance_mail(title: String, body: String) -> bool:
	var alliance = ui_manager.get_player_alliance()
	if alliance.is_empty(): return false
	
	var circulars = alliance.get("circulars", []) as Array
	var new_circ = {
		"title": title,
		"sender": ui_manager.player_name,
		"time": "Just Now",
		"message": body
	}
	circulars.insert(0, new_circ)
	ui_manager._save_alliance_databases()
	ui_manager.alliance_updated.emit()
	ui_manager.show_success("Alliance Broadcast dispatched successfully!")
	return true
