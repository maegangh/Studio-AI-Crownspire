extends Control
class_name CrystalVaultQuestPanel

# ==========================================
# CROWNSPIRE CRYSTAL VAULT QUEST PANEL WRAPPER
# ==========================================

@onready var vault_lbl: Label = $Header/VaultLabel if has_node("Header/VaultLabel") else get_node_or_null("VaultLabel")

func _ready() -> void:
	if vault_lbl:
		vault_lbl.text = "🌀 Alchemical Vault Trials"
