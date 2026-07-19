extends Control

# ==========================================
# CROWNSPIRE MAIL REWARD CLAIM POPUP
# ==========================================

@onready var container: PanelContainer = %PopupContainer
@onready var items_grid: GridContainer = %ItemsGrid
@onready var collect_btn: Button = %CollectButton
@onready var anim_player: AnimationPlayer = $AnimationPlayer

const REWARD_SLOT_SCENE = preload("res://scenes/RewardSlot.tscn")

func _ready() -> void:
	collect_btn.pressed.connect(_on_collect_pressed)
	
	# Initial structural scale bounce
	container.scale = Vector2(0.5, 0.5)
	container.pivot_offset = container.size / 2.0
	
	var tween = create_tween()
	tween.tween_property(container, "scale", Vector2(1.05, 1.05), 0.25).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tween.tween_property(container, "scale", Vector2.ONE, 0.1)

func display_rewards(rewards: Array) -> void:
	# Clear grid
	for child in items_grid.get_children():
		child.queue_free()
		
	# Populate claimed resources/items
	for i in range(rewards.size()):
		var item = rewards[i]
		var slot = REWARD_SLOT_SCENE.instantiate()
		items_grid.add_child(slot)
		
		var name_str = item.get("name", "Royal Gift")
		var qty = int(item.get("quantity", 1))
		var rarity = int(item.get("rarity", 2))
		var icon_path = item.get("icon", "")
		
		# If icon is an emoji, use it, or fallback. Since RewardSlot.gd expects a texture path,
		# let's make sure we safely handle emoji icons if needed!
		# Actually, since RewardSlot might fail to load an emoji as a texture, let's wrap it!
		# If the icon_path doesn't begin with "res://", we don't pass it to load()
		var resolved_icon = ""
		if icon_path.begins_with("res://"):
			resolved_icon = icon_path
			
		slot.setup_reward(name_str, qty, rarity, resolved_icon)
		
		# If it's an emoji and we have no texture, let's add a dynamic Label on top of slot's icon rect!
		if resolved_icon == "" and icon_path != "":
			var emoji_lbl = Label.new()
			emoji_lbl.text = icon_path
			emoji_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
			emoji_lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
			emoji_lbl.add_theme_font_size_override("font_size", 36)
			emoji_lbl.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
			slot.get_node("%IconRect").add_child(emoji_lbl)
			
		# Play delayed stagger animation for each reward slot
		slot.modulate.a = 0.0
		slot.scale = Vector2.ZERO
		var slot_tween = create_tween().set_parallel(true)
		slot_tween.tween_property(slot, "modulate:a", 1.0, 0.2).set_delay(0.15 + i * 0.05)
		slot_tween.tween_property(slot, "scale", Vector2.ONE, 0.25).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT).set_delay(0.15 + i * 0.05)

func _on_collect_pressed() -> void:
	if anim_player and anim_player.has_animation("close_fade"):
		anim_player.play("close_fade")
		await anim_player.animation_finished
	else:
		var tween = create_tween()
		tween.tween_property(self, "modulate:a", 0.0, 0.15)
		await tween.finished
	queue_free()
