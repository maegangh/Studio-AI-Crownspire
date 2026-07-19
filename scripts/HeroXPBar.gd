extends PanelContainer

# ==========================================
# CROWNSPIRE HERO EXPERIENCE BAR COMPONENT
# ==========================================
# Manages smooth animation of experience point ratios and progression labels.

@onready var fill_bar: ProgressBar = %ProgressBar
@onready var ratio_label: Label = %RatioLabel
@onready var max_lvl_lbl: Label = %MaxLevelLabel

func setup(hero_data: Dictionary) -> void:
	var xp = hero_data.get("xp", 0)
	var xp_req = hero_data.get("xp_required", 1000)
	var lvl = hero_data.get("level", 1)
	var max_lvl = hero_data.get("max_level", 60)
	
	if lvl >= max_lvl:
		fill_bar.value = 100.0
		ratio_label.text = "MAX LEVEL REACHED"
		max_lvl_lbl.text = "LEVEL CAP: %d" % max_lvl
	else:
		fill_bar.max_value = xp_req
		fill_bar.value = xp
		ratio_label.text = "%d / %d XP" % [xp, xp_req]
		max_lvl_lbl.text = "LIMIT: LVL %d" % max_lvl

func animate_xp_increase(old_xp: float, new_xp: float, xp_req: float, levels_gained: int) -> void:
	var tween = create_tween()
	if levels_gained == 0:
		tween.tween_property(fill_bar, "value", new_xp, 0.4).set_trans(Tween.TRANS_SINE)
		ratio_label.text = "%d / %d XP" % [int(new_xp), int(xp_req)]
	else:
		# If levels gained, animate bar filling completely, then resetting and moving up
		tween.tween_property(fill_bar, "value", xp_req, 0.3)
		tween.chain().perform(func(): fill_bar.value = 0)
		# Just set final value to simplify multiple level jump animations
		tween.chain().tween_property(fill_bar, "value", new_xp, 0.3)
		ratio_label.text = "%d / %d XP" % [int(new_xp), int(xp_req)]
