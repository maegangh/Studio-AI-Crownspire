extends Control
class_name HeroQuestPanel

# ==========================================
# CROWNSPIRE HERO QUEST PANEL WRAPPER
# ==========================================

@onready var hero_lbl: Label = $Header/HeroLabel if has_node("Header/HeroLabel") else get_node_or_null("HeroLabel")

func _ready() -> void:
	if hero_lbl:
		hero_lbl.text = "🦁 Legendary Hero Chronicles"
