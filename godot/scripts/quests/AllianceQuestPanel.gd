extends Control
class_name AllianceQuestPanel

# ==========================================
# CROWNSPIRE ALLIANCE QUEST PANEL WRAPPER
# ==========================================

@onready var alliance_info_lbl: Label = $Header/AllianceInfoLabel if has_node("Header/AllianceInfoLabel") else get_node_or_null("AllianceInfoLabel")

func _ready() -> void:
	if alliance_info_lbl:
		alliance_info_lbl.text = "🛡️ Co-op Guild Bounties"
