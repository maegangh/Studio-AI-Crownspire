extends Control
class_name EventQuestPanel

# ==========================================
# CROWNSPIRE EVENT QUEST PANEL WRAPPER
# ==========================================

@onready var event_status_lbl: Label = $Header/EventStatusLabel if has_node("Header/EventStatusLabel") else get_node_or_null("EventStatusLabel")

func _ready() -> void:
	if event_status_lbl:
		event_status_lbl.text = "❄️ Winter Shield Festival: ACTIVE"
