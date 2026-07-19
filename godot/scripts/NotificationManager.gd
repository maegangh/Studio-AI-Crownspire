extends Control

# ==========================================
# CROWNSPIRE NOTIFICATION & TOAST MANAGER
# ==========================================
# Listens to UIManager state gains and streams interactive visual toast alerts.
# Features automated queueing and smooth kinematic Tweens.

@onready var container: VBoxContainer = $Container

var toast_queue: Array[Dictionary] = []
var is_displaying: bool = false

func _ready() -> void:
	UIManager.reward_claimed.connect(_on_reward_received)

func _on_reward_received(rewards: Array) -> void:
	for r in rewards:
		toast_queue.append(r)
	if not is_displaying:
		_process_queue()

func _process_queue() -> void:
	if toast_queue.is_empty():
		is_displaying = false
		return
		
	is_displaying = true
	var current = toast_queue.pop_front()
	
	_create_toast_node(current)
	
	# Wait brief gap before triggering next queue item
	get_tree().create_timer(1.2).timeout.connect(_process_queue)

func _create_toast_node(data: Dictionary) -> void:
	var name_str = data.get("name", "Royal Favor")
	var qty = data.get("quantity", 1)
	var rarity = data.get("rarity", 1)
	
	# Assemble toast panel container dynamically
	var panel := PanelContainer.new()
	panel.custom_minimum_size = Vector2(300, 48)
	panel.size_flags_horizontal = Control.SIZE_SHRINK_CENTER
	
	# Background style based on rarity (Bronze, Silver, Gold, Celestial)
	var sb := StyleBoxFlat.new()
	sb.corner_radius_top_left = 8
	sb.corner_radius_top_right = 8
	sb.corner_radius_bottom_right = 8
	sb.corner_radius_bottom_left = 8
	sb.border_width_left = 3
	sb.shadow_size = 4
	sb.shadow_color = Color(0, 0, 0, 0.3)
	
	match rarity:
		3: # Legendary Gold
			sb.bg_color = Color(0.18, 0.14, 0.05, 0.95)
			sb.border_color = Color(1.0, 0.84, 0.0, 1.0)
		2: # Rare Silver
			sb.bg_color = Color(0.08, 0.11, 0.18, 0.95)
			sb.border_color = Color(0.0, 0.82, 1.0, 1.0)
		_: # Common Bronze
			sb.bg_color = Color(0.10, 0.12, 0.16, 0.95)
			sb.border_color = Color(0.5, 0.5, 0.6, 1.0)
			
	panel.add_theme_stylebox_override("panel", sb)
	
	var margin := MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 12)
	margin.add_theme_constant_override("margin_right", 12)
	margin.add_theme_constant_override("margin_top", 4)
	margin.add_theme_constant_override("margin_bottom", 4)
	panel.add_child(margin)
	
	var hbox := HBoxContainer.new()
	hbox.add_theme_constant_override("separation = ", 8)
	margin.add_child(hbox)
	
	# Add cute fallback emoji based on reward name to make it look premium
	var emoji := Label.new()
	emoji.theme_override_font_sizes/font_size = 18
	emoji.text = _get_name_emoji(name_str)
	emoji.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	hbox.add_child(emoji)
	
	var text_lbl := Label.new()
	text_lbl.text = "%s x%s" % [name_str, String.num_int64(int(qty))]
	text_lbl.theme_override_font_sizes/font_size = 12
	text_lbl.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	text_lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	
	match rarity:
		3: text_lbl.add_theme_color_override("font_color", Color(1.0, 0.84, 0.0))
		2: text_lbl.add_theme_color_override("font_color", Color(0.0, 0.82, 1.0))
		_: text_lbl.add_theme_color_override("font_color", Color(1, 1, 1))
		
	hbox.add_child(text_lbl)
	
	container.add_child(panel)
	
	# Slide-in and Float up Animation using Tweens
	panel.modulate.a = 0.0
	panel.scale = Vector2(0.8, 0.8)
	panel.pivot_offset = Vector2(150, 24)
	
	var tween = create_tween().set_parallel(true)
	tween.tween_property(panel, "modulate:a", 1.0, 0.2)
	tween.tween_property(panel, "scale", Vector2(1.0, 1.0), 0.25).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	
	# Wait 1.5s, then fade out and slide up
	var kill_tween = create_tween().set_delay(1.5).set_parallel(true)
	kill_tween.tween_property(panel, "modulate:a", 0.0, 0.3)
	kill_tween.tween_property(panel, "position:y", panel.position.y - 40, 0.3)
	kill_tween.chain().perform(func(): panel.queue_free())

func _get_name_emoji(name_str: String) -> String:
	var n = name_str.to_lower()
	if "food" in n or "provision" in n: return "🌾"
	if "timber" in n or "wood" in n: return "🪵"
	if "granite" in n or "stone" in n: return "🪨"
	if "iron" in n or "shield" in n: return "🛡"
	if "gold" in n: return "🪙"
	if "crystal" in n: return "💎"
	if "speedup" in n or "chrono" in n: return "⚡"
	if "hero" in n or "shard" in n: return "👑"
	if "codex" in n or "book" in n: return "📜"
	return "🎁"
