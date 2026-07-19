extends Button

# ==========================================
# CROWNSPIRE CITY VIEW BUTTON
# ==========================================
# Recalls camera grids to focus on inner palace buildings and resource silos.

signal view_changed(view_name: String)

func _ready() -> void:
	pressed.connect(_on_pressed)

func _on_pressed() -> void:
	view_changed.emit("city")
