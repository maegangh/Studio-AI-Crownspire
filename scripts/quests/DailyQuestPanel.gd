extends Control
class_name DailyQuestPanel

# ==========================================
# CROWNSPIRE DAILY QUEST CATEGORY PANEL WRAPPER
# ==========================================

@onready var title_lbl: Label = $Header/TitleLabel if has_node("Header/TitleLabel") else get_node_or_null("TitleLabel")
@onready var reset_lbl: Label = $Header/ResetLabel if has_node("Header/ResetLabel") else get_node_or_null("ResetLabel")

func _ready() -> void:
	_update_reset_timer()
	
	# Keep timer ticking for real-time countdown to daily reset
	var timer = Timer.new()
	timer.wait_time = 30.0
	timer.autostart = true
	timer.timeout.connect(_update_reset_timer)
	add_child(timer)

func _update_reset_timer() -> void:
	if not QuestManager or not reset_lbl:
		return
		
	var now = int(Time.get_unix_time_from_system())
	var time_left = 86400 - ((now - QuestManager.last_daily_reset) % 86400)
	
	var hrs = time_left / 3600
	var mins = (time_left % 3600) / 60
	
	reset_lbl.text = "⏱️ Resets in: %02dh %02dm" % [hrs, mins]
