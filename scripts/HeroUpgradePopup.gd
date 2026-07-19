extends PanelContainer

# ==========================================
# CROWNSPIRE HERO UPGRADE POPUP CONTROLLER
# ==========================================
# Allows players to consume Experience Potions to level up heroes dynamically,
# reflecting attribute modifications in real-time.

@onready var close_btn: Button = %CloseBtn
@onready var hero_name_lbl: Label = %HeroNameLbl
@onready var hero_emoji_lbl: Label = %HeroEmojiLbl
@onready var potion_count_lbl: Label = %PotionCountLabel
@onready var level_lbl: Label = %LevelLbl
@onready var feed_btn: Button = %FeedBtn
@onready var status_msg: Label = %StatusMsgLabel
@onready var animation_player: AnimationPlayer = %AnimationPlayer if has_node("%AnimationPlayer") else null

var current_hero_id: String = ""

func _ready() -> void:
	close_btn.pressed.connect(_on_close_pressed)
	feed_btn.pressed.connect(_on_feed_pressed)

func init_popup(hero_id: String) -> void:
	current_hero_id = hero_id
	_refresh_ui()
	
	# Entrance animation
	if animation_player and animation_player.has_animation("entrance"):
		animation_player.play("entrance")
	else:
		# Manual tween entrance
		modulate.a = 0.0
		scale = Vector2(0.95, 0.95)
		var tween = create_tween()
		tween.set_parallel(true)
		tween.tween_property(self, "modulate:a", 1.0, 0.25)
		tween.tween_property(self, "scale", Vector2(1.0, 1.0), 0.25).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)

func _refresh_ui() -> void:
	var h = UIManager.get_hero(current_hero_id)
	if h.is_empty():
		return
		
	hero_name_lbl.text = h["name"].to_upper()
	hero_emoji_lbl.text = h.get("emoji", "👤")
	level_lbl.text = "LEVEL %d / %d" % [h["level"], h["max_level"]]
	
	potion_count_lbl.text = "🧪 ELIXIRS HELD: %d" % UIManager.hero_xp_potions
	
	# Action buttons validation
	if h["level"] >= h["max_level"]:
		feed_btn.disabled = true
		feed_btn.text = "MAX LEVEL REACHED"
		status_msg.text = "Ascend this general to raise the level cap further!"
	elif UIManager.hero_xp_potions <= 0:
		feed_btn.disabled = true
		feed_btn.text = "NO POTIONS"
		status_msg.text = "Acquire more elixirs via the Kingdom Store or Campaigns!"
	else:
		feed_btn.disabled = false
		feed_btn.text = "CONSUME ELIXIR (+500 XP)"
		status_msg.text = "Each elixir grants 500 XP."

func _on_feed_pressed() -> void:
	var res = UIManager.upgrade_hero_with_xp(current_hero_id)
	_refresh_ui()
	
	if res["success"]:
		status_msg.text = res["message"]
		
		# Play dynamic pulse effect
		var tween = create_tween()
		feed_btn.scale = Vector2(1.05, 1.05)
		tween.tween_property(feed_btn, "scale", Vector2(1.0, 1.0), 0.15)
		
		if res.get("levelled_up", false):
			status_msg.add_theme_color_override("font_color", Color(0.2, 0.8, 0.5))
			if animation_player and animation_player.has_animation("levelup"):
				animation_player.play("levelup")
		else:
			status_msg.add_theme_color_override("font_color", Color(1, 1, 1, 0.8))
	else:
		status_msg.text = res["message"]
		status_msg.add_theme_color_override("font_color", Color(0.9, 0.2, 0.3))

func _on_close_pressed() -> void:
	# Subtle scale transition out
	var tween = create_tween()
	tween.set_parallel(true)
	tween.tween_property(self, "modulate:a", 0.0, 0.2)
	tween.tween_property(self, "scale", Vector2(0.95, 0.95), 0.2)
	tween.chain().perform(func(): UIManager.close_popup(self))
