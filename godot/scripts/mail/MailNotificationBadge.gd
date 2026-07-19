extends Panel

# ==========================================
# CROWNSPIRE MAIL NOTIFICATION BADGE
# ==========================================

@onready var count_label: Label = $CountLabel

func set_badge_count(count: int) -> void:
	if count <= 0:
		visible = false
	else:
		visible = true
		if count_label:
			count_label.text = str(count) if count < 100 else "99+"
			
		# Apply nice micro pulse animation
		_apply_badge_pulse()

func _apply_badge_pulse() -> void:
	# Avoid compounding tweens by checking if one is already running
	var tween = create_tween()
	tween.tween_property(self, "scale", Vector2(1.15, 1.15), 0.15).set_trans(Tween.TRANS_SINE)
	tween.tween_property(self, "scale", Vector2.ONE, 0.15).set_trans(Tween.TRANS_SINE)
