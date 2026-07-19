extends Control
class_name InventorySearchBar

# ==========================================
# CROWNSPIRE INVENTORY SEARCH BAR
# ==========================================
# Dispatches real-time text filter queries to the grid.

signal search_text_changed(text: String)

@onready var line_edit: LineEdit = $HBox/LineEdit
@onready var clear_btn: Button = $HBox/ClearButton

func _ready() -> void:
	line_edit.text_changed.connect(_on_text_changed)
	clear_btn.pressed.connect(_on_clear_pressed)
	clear_btn.visible = false

func _on_text_changed(new_text: String) -> void:
	clear_btn.visible = new_text.length() > 0
	search_text_changed.emit(new_text.strip_edges().to_lower())

func _on_clear_pressed() -> void:
	line_edit.text = ""
	clear_btn.visible = false
	search_text_changed.emit("")
