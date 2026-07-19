extends PanelContainer
class_name ItemNotificationBadge

# ==========================================
# CROWNSPIRE NOTIFICATION BADGE CONTROLLER
# ==========================================
# Handles pulsing scale-and-fade animation for newly collected items.

func _ready() -> void:
	play_pulse_animation()

func play_pulse_animation() -> void:
	var tween = create_tween().set_loops()
	tween.tween_property(self, "scale", Vector2(1.15, 1.15), 0.6).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)
	tween.tween_property(self, "scale", Vector2(0.9, 0.9), 0.6).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN)
