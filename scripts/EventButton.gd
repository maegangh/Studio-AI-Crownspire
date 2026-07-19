extends Button

# ==========================================
# CROWNSPIRE EVENT BUTTON CONTROLLER
# ==========================================
# Opens the LiveOps Dashboard overlay displaying active campaigns and daily deeds.

@export var dashboard_scene: PackedScene = preload("res://scenes/LiveOpsDashboard.tscn")

@onready var alert_badge: Panel = $AlertBadge

func _ready() -> void:
	pressed.connect(_on_pressed)
	# Check if any quest is completed but unclaimed to highlight badge
	UIManager.quest_progress_updated.connect(func(_qid, _progress): _check_active_alerts())
	UIManager.quest_completed.connect(func(_qid): _check_active_alerts())
	_check_active_alerts()

func _check_active_alerts() -> void:
	var has_alert := false
	for q in UIManager.quests:
		if q.get("is_completed", false) and not q.get("is_claimed", false):
			has_alert = true
			break
	alert_badge.visible = has_alert

func _on_pressed() -> void:
	if dashboard_scene:
		UIManager.open_popup(dashboard_scene)
