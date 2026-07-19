extends Control
class_name WayfinderQuestPanel

# ==========================================
# CROWNSPIRE WAYFINDER QUEST PANEL WRAPPER
# ==========================================

@onready var nav_lbl: Label = $Header/NavLabel if has_node("Header/NavLabel") else get_node_or_null("NavLabel")

func _ready() -> void:
	if nav_lbl:
		nav_lbl.text = "🧭 Sovereign Highway Mapping"
