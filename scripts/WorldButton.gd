extends Button

# ==========================================
# CROWNSPIRE WORLD MAP VIEW BUTTON
# ==========================================
# Swaps camera grid coordinate views to the Outer Wilderness / Hex World Map.

signal view_changed(view_name: String)

func _ready() -> void:
	pressed.connect(_on_pressed)

func _on_pressed() -> void:
	view_changed.emit("world")
	# Simulate quest progress for world adventure
	UIManager.add_quest_progress("quest_pve_victory", 1)
