extends Control
class_name MainQuestPanel

# ==========================================
# CROWNSPIRE MAIN QUEST STORY PANEL WRAPPER
# ==========================================

@onready var chapter_lbl: Label = $Header/ChapterLabel if has_node("Header/ChapterLabel") else get_node_or_null("ChapterLabel")

func _ready() -> void:
	if chapter_lbl:
		chapter_lbl.text = "👑 Chapter I: Citadel Reborn"
