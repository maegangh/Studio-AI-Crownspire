extends Control

# ==========================================
# CROWNSPIRE HERO PORTRAIT FRAME
# ==========================================
# Manages the royal ornamental frame surrounding the main hero portrait,
# updating neon borders and stars based on rarity.

@onready var glow_border: Panel = %GlowBorder
@onready var portrait_lbl: Label = %PortraitEmoji
@onready var stars_lbl: Label = %StarsLabel
@onready var class_lbl: Label = %ClassLabel
@onready var rarity_banner: Label = %RarityBanner

func setup(hero_data: Dictionary) -> void:
	portrait_lbl.text = hero_data.get("emoji", "👤")
	
	# Set class badge
	class_lbl.text = hero_data.get("class", "Warrior").to_upper()
	
	# Star string
	var star_str = ""
	for i in range(hero_data.get("rarity_stars", 3)):
		star_str += "★"
	stars_lbl.text = star_str
	
	# Setup rarity labels & glow effects
	var rarity = hero_data.get("rarity", "Rare")
	rarity_banner.text = " %s " % rarity.to_upper()
	
	var sb := StyleBoxFlat.new()
	sb.bg_color = Color(0, 0, 0, 0)
	sb.border_width_left = 3
	sb.border_width_top = 3
	sb.border_width_right = 3
	sb.border_width_bottom = 3
	sb.corner_radius_top_left = 16
	sb.corner_radius_top_right = 16
	sb.corner_radius_bottom_right = 16
	sb.corner_radius_bottom_left = 16
	sb.shadow_size = 12
	
	match rarity:
		"Legendary":
			sb.border_color = Color(1.0, 0.84, 0.0) # Golden yellow border
			sb.shadow_color = Color(1.0, 0.84, 0.0, 0.4)
			stars_lbl.add_theme_color_override("font_color", Color(1, 0.84, 0))
			rarity_banner.add_theme_color_override("font_color", Color(0, 0, 0))
			# Yellow-gold background banner style
			var b_sb = StyleBoxFlat.new()
			b_sb.bg_color = Color(1.0, 0.84, 0.0)
			b_sb.corner_radius_top_left = 4
			b_sb.corner_radius_bottom_right = 4
			rarity_banner.add_theme_stylebox_override("normal", b_sb)
		"Epic":
			sb.border_color = Color(0.75, 0.35, 1.0) # Epic violet-magenta border
			sb.shadow_color = Color(0.75, 0.35, 1.0, 0.4)
			stars_lbl.add_theme_color_override("font_color", Color(0.75, 0.35, 1.0))
			rarity_banner.add_theme_color_override("font_color", Color(1, 1, 1))
			var b_sb = StyleBoxFlat.new()
			b_sb.bg_color = Color(0.6, 0.2, 0.8)
			b_sb.corner_radius_top_left = 4
			b_sb.corner_radius_bottom_right = 4
			rarity_banner.add_theme_stylebox_override("normal", b_sb)
		_:
			sb.border_color = Color(0.12, 0.53, 0.9) # Rare oceanic blue border
			sb.shadow_color = Color(0.12, 0.53, 0.9, 0.3)
			stars_lbl.add_theme_color_override("font_color", Color(0.12, 0.53, 0.9))
			rarity_banner.add_theme_color_override("font_color", Color(1, 1, 1))
			var b_sb = StyleBoxFlat.new()
			b_sb.bg_color = Color(0.1, 0.4, 0.8)
			b_sb.corner_radius_top_left = 4
			b_sb.corner_radius_bottom_right = 4
			rarity_banner.add_theme_stylebox_override("normal", b_sb)
			
	glow_border.add_theme_stylebox_override("panel", sb)

func play_transition_effect() -> void:
	# Satisfying scale-flash zoom on load
	var tween = create_tween()
	modulate.a = 0.0
	scale = Vector2(0.9, 0.9)
	tween.set_parallel(true)
	tween.tween_property(self, "modulate:a", 1.0, 0.3)
	tween.tween_property(self, "scale", Vector2(1.0, 1.0), 0.3).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
