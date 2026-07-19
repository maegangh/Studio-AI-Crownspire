extends Button

# ==========================================
# CROWNSPIRE MAIL BUTTON CONTROLLER
# ==========================================
# Triggers mail reader overlay and handles unread message count badges.

@onready var dot: Panel = $UnreadDot
@onready var count_label: Label = $UnreadDot/CountLabel

var unread_count: int = 3:
	set(val):
		unread_count = val
		_update_badge()

func _ready() -> void:
	pressed.connect(_on_pressed)
	# Initialize mail manager to get actual unread count on start
	MailManager.initialize_manager()
	unread_count = MailManager.get_unread_count("all")
	_update_badge()
	
	# Connect to panel closed signal on UIManager to refresh unread badges when mail is closed
	UIManager.panel_closed.connect(_on_panel_closed)

func _on_panel_closed(panel_name: String) -> void:
	if panel_name == "MailScreen":
		unread_count = MailManager.get_unread_count("all")

func _update_badge() -> void:
	if not is_inside_tree():
		return
	if unread_count > 0:
		dot.visible = true
		count_label.text = str(unread_count)
		_apply_pulse_tween()
	else:
		dot.visible = false

func _apply_pulse_tween() -> void:
	var tween = create_tween().set_loops()
	tween.tween_property(dot, "modulate", Color(1.2, 0.8, 0.8, 1.0), 0.5)
	tween.tween_property(dot, "modulate", Color(1.0, 1.0, 1.0, 1.0), 0.5)

func _on_pressed() -> void:
	# Load and open the new MailScreen scene
	var mail_scene = preload("res://scenes/mail/MailScreen.tscn")
	UIManager.open_popup(mail_scene)
