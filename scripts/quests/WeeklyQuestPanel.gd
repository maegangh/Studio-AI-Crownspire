extends Control
class_name WeeklyQuestPanel

# ==========================================
# CROWNSPIRE WEEKLY QUEST CATEGORY PANEL WRAPPER
# ==========================================

@onready var title_lbl: Label = $Header/TitleLabel if has_node("Header/TitleLabel") else get_node_or_null("TitleLabel")
@onready var reset_lbl: Label = $Header/ResetLabel if has_node("Header/ResetLabel") else get_node_or_null("ResetLabel")

func _ready() -> void:
	_update_reset_timer()
	
	var timer = Timer.new()
	timer.wait_time = 60.0
	timer.autostart = true
	timer.timeout.connect(_update_reset_timer)
	add_child(timer)

func _update_reset_timer() -> void:
	if not QuestManager or not reset_lbl:
		return
		
	var now = int(Time.get_unix_time_from_system())
	var time_left = 604800 - ((now - QuestManager.last_weekly_reset) % 604800)
	
	var days = time_left / 86400
	var hrs = (time_left % 86400) / 3600
	
	reset_lbl.text = "⏳ Trial ends in: %dd %02dh" % [days, hrs]
