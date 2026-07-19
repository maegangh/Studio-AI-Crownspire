extends Button

# ==========================================
# CROWNSPIRE HUD NAVIGATION BUTTON
# ==========================================
# Represents an individual modular navigation button in the bottom bar.
# Supports dynamic icon, label, and notification badge coordination.

signal navigation_pressed(button_id: String, scene_path: String)

@onready var icon_label: Label = get_node_or_null("%IconLabel")
@onready var text_label: Label = get_node_or_null("%TextLabel")
@onready var badge_container: Control = get_node_or_null("%BadgeContainer")

var button_id: String = ""
var target_scene_path: String = ""

func _ready() -> void:
	pressed.connect(_on_pressed)

func init_button(id: String, btn_name: String, icon: String, scene_path: String, initial_count: int = 0) -> void:
	button_id = id
	target_scene_path = scene_path
	
	if icon_label:
		icon_label.text = icon
	if text_label:
		text_label.text = btn_name
		
	update_badge(initial_count)

func update_badge(count: int) -> void:
	if badge_container and badge_container.has_method("update_badge"):
		badge_container.update_badge(count)

func _on_pressed() -> void:
	navigation_pressed.emit(button_id, target_scene_path)
