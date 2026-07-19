extends PanelContainer

# ==========================================
# CROWNSPIRE HERO POWER DISPLAY COMPONENT
# ==========================================
# Highlights the tactical legion power rating with counting visual rolling numbers.

@onready var power_lbl: Label = %PowerLabel
@onready var sparks_emissions: GPUParticles2D = %SparksParticles if has_node("%SparksParticles") else null

var current_val: int = 0

func setup(power_val: int, animate: bool = false) -> void:
	if not animate or current_val == 0:
		current_val = power_val
		power_lbl.text = "⚡ LEGION POWER: %d" % current_val
	else:
		# Rolling count tween
		var old_val = current_val
		current_val = power_val
		
		var tween = create_tween()
		tween.tween_method(
			func(val: int): power_lbl.text = "⚡ LEGION POWER: %d" % val,
			old_val,
			current_val,
			0.5
		).set_trans(Tween.TRANS_QUART).set_ease(Tween.EASE_OUT)
		
		# Play a satisfying scale pulse on the text
		var p_tween = create_tween()
		p_tween.tween_property(power_lbl, "scale", Vector2(1.1, 1.1), 0.25)
		p_tween.tween_property(power_lbl, "scale", Vector2(1.0, 1.0), 0.25)
		
		# Trigger spark particles if available
		if sparks_emissions:
			sparks_emissions.restart()
