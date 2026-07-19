extends Control
class_name IntelQuestPanel

# ==========================================
# CROWNSPIRE INTEL QUEST PANEL WRAPPER
# ==========================================

@onready var scout_lbl: Label = $Header/ScoutLabel if has_node("Header/ScoutLabel") else get_node_or_null("ScoutLabel")

func _ready() -> void:
	if scout_lbl:
		scout_lbl.text = "🦅 Scout Reconnaissance Logs"
