extends Button

# ==========================================
# CROWNSPIRE ALLIANCE BUTTON CONTROLLER
# ==========================================
# Triggers the alliance embassy and simulates alliance tech donations.

@onready var help_icon: Panel = $HelpIndicator

func _ready() -> void:
	pressed.connect(_on_pressed)
	# Simulate alliance active help requests
	help_icon.visible = true
	_pulse_help()

func _pulse_help() -> void:
	var tween = create_tween().set_loops()
	tween.tween_property(help_icon, "scale", Vector2(1.15, 1.15), 0.4)
	tween.tween_property(help_icon, "scale", Vector2(1.0, 1.0), 0.4)

func _on_pressed() -> void:
	help_icon.visible = false
	var alliance_scene = preload("res://scenes/AllianceScreen.tscn")
	if alliance_scene:
		UIManager.open_popup(alliance_scene)

