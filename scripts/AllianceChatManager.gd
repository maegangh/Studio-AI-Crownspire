# ==========================================
# CROWNSPIRE ALLIANCE CHAT MANAGER
# ==========================================
extends RefCounted

var ui_manager

func send_chat_message(text: String) -> void:
	if text.strip_edges() == "": return
	ui_manager.alliance_chat_messages.append({
		"sender": ui_manager.player_name,
		"text": text,
		"time": "Now"
	})
	if ui_manager.alliance_chat_messages.size() > 100:
		ui_manager.alliance_chat_messages.remove_at(0)
	ui_manager.alliance_chat_updated.emit()
