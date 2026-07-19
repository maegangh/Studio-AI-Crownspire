extends Panel
class_name QuestNotificationBadge

# ==========================================
# CROWNSPIRE QUEST NOTIFICATION BADGE (PULSING)
# ==========================================

@onready var count_label: Label = $CountLabel as Label

func _ready() -> void:
	# Make it pulse gently
	_start_pulse()

func _start_pulse() -> void:
	pivot_offset = size / 2.0
	var tween = create_tween().set_loops()
	tween.tween_property(self, "scale", Vector2(1.15, 1.15), 0.8)\
		.set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN_OUT)
	tween.tween_property(self, "scale", Vector2(0.9, 0.9), 0.8)\
		.set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN_OUT)

func set_count(count: int) -> void:
	if count_label:
		count_label.text = str(count)
	visible = count > 0
