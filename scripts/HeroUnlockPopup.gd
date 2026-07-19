extends PanelContainer

# ==========================================
# CROWNSPIRE HERO SUMMON/UNLOCK CELEBRATION
# ==========================================
# Triggers full-screen visual effects, particles, and dramatic scaling
# when a legendary or epic general is summoned for the first time.

@onready var close_btn: Button = %CloseBtn
@onready var flare_glow: Panel = %FlareGlow
@onready var hero_name_lbl: Label = %HeroNameLbl
@onready var hero_emoji_lbl: Label = %HeroEmojiLbl
@onready var title_lbl: Label = %TitleLbl
@onready var stars_lbl: Label = %StarsLabel
@onready var animation_player: AnimationPlayer = %AnimationPlayer if has_node("%AnimationPlayer") else null

func _ready() -> void:
	close_btn.pressed.connect(_on_close_pressed)

func animate_summon(hero_id: String) -> void:
	var h = UIManager.get_hero(hero_id)
	if h.is_empty():
		return
		
	hero_name_lbl.text = h["name"].to_upper()
	hero_emoji_lbl.text = h.get("emoji", "👤")
	title_lbl.text = h.get("title", "").to_upper()
	
	# Generate stars text
	var star_str = ""
	for i in range(h.get("rarity_stars", 3)):
		star_str += "★"
	stars_lbl.text = star_str
	
	# Rarity themeing
	var rarity = h.get("rarity", "Rare")
	match rarity:
		"Legendary":
			hero_name_lbl.add_theme_color_override("font_color", Color(1, 0.84, 0))
			flare_glow.self_modulate = Color(1.0, 0.84, 0, 0.6)
		"Epic":
			hero_name_lbl.add_theme_color_override("font_color", Color(0.75, 0.35, 1))
			flare_glow.self_modulate = Color(0.75, 0.35, 1, 0.6)
		_:
			hero_name_lbl.add_theme_color_override("font_color", Color(0.2, 0.6, 1))
			flare_glow.self_modulate = Color(0.2, 0.6, 1, 0.4)
			
	# Celebration animations
	if animation_player and animation_player.has_animation("summon"):
		animation_player.play("summon")
	else:
		# Satisfying camera/canvas zoom & flash manual tweens
		hero_emoji_lbl.scale = Vector2(0.2, 0.2)
		hero_emoji_lbl.modulate.a = 0.0
		flare_glow.modulate.a = 0.0
		
		var tween = create_tween()
		tween.set_parallel(true)
		tween.tween_property(hero_emoji_lbl, "scale", Vector2(1.2, 1.2), 0.6).set_trans(Tween.TRANS_ELASTIC).set_ease(Tween.EASE_OUT)
		tween.tween_property(hero_emoji_lbl, "modulate:a", 1.0, 0.4)
		tween.tween_property(flare_glow, "modulate:a", 1.0, 0.5)
		
		var pulse_tween = create_tween().set_loops()
		pulse_tween.tween_property(flare_glow, "rotation_degrees", 360, 8.0)

func _on_close_pressed() -> void:
	var tween = create_tween()
	tween.tween_property(self, "modulate:a", 0.0, 0.2)
	tween.chain().perform(func(): UIManager.close_popup(self))
