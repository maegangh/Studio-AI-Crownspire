extends Panel
class_name QuestProgressBar

# ==========================================
# CROWNSPIRE PREMIUM QUEST PROGRESS BAR
# ==========================================

@onready var fill: ColorRect = $Fill if has_node("Fill") else get_node_or_null("FillColorRect")
@onready var ratio_label: Label = $RatioLabel if has_node("RatioLabel") else get_node_or_null("Ratio")

@export var fill_color: Color = Color(0.2, 0.6, 0.9, 1.0)
@export var animate_duration: float = 0.4

var current_value: float = 0.0
var max_value: float = 100.0

func _ready() -> void:
	if fill:
		fill.color = fill_color
	_update_visuals(false)

func set_values(current: float, target: float) -> void:
	current_value = current
	max_value = max(target, 1.0) # Avoid division by zero
	_update_visuals(true)

func _update_visuals(animate: bool) -> void:
	if not fill:
		return
		
	var percentage = clamp(current_value / max_value, 0.0, 1.0)
	var target_width = size.x * percentage
	
	# Update labels
	if ratio_label:
		ratio_label.text = "%d / %d" % [int(current_value), int(max_value)]
		
	# Animate bar fill sizing
	if animate:
		var tween = create_tween()
		tween.tween_property(fill, "size:x", target_width, animate_duration)\
			.set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)
	else:
		fill.size.x = target_width
