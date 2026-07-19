# ==============================================================================
# Crownspire MMO - Ancient Beast Rewards claim Window Script
# Godot 4.6 / GDScript 2.0 Royal White Marble UI Panel
# ==============================================================================

class_name AncientBeastRewards
extends Control

signal rewards_claimed(loot_items: Array)
signal closed()

@onready var title_label: Label = $WhiteMarbleFrame/TitleBar/TitleLabel
@onready var chest_animation: TextureRect = $WhiteMarbleFrame/MainPanel/ChestView/AnimationRect
@onready var loot_grid: GridContainer = $WhiteMarbleFrame/MainPanel/LootSection/GridContainer
@onready var claim_button: Button = $WhiteMarbleFrame/ButtonTray/ClaimButton
@onready var close_button: Button = $WhiteMarbleFrame/TitleBar/CloseButton

var claimable_items: Array = []
var is_chest_opened: bool = false

func _ready() -> void:
	close_button.pressed.connect(_on_close_pressed)
	claim_button.pressed.connect(_on_claim_pressed)
	
	_play_chest_idle_glow()

func setup_rewards(loot: Array) -> void:
	claimable_items = loot
	is_chest_opened = false
	
	title_label.text = tr("BEAST_DEFEATED_REWARDS")
	claim_button.text = tr("OPEN_CHEST")
	
	# Clear previous loot icons
	for child in loot_grid.get_children():
		child.queue_free()

func _play_chest_idle_glow() -> void:
	var tween = create_tween().set_loops()
	tween.tween_property(chest_animation, "scale", Vector2(1.05, 1.05), 1.0)
	tween.tween_property(chest_animation, "scale", Vector2(0.95, 0.95), 1.0)

func _on_claim_pressed() -> void:
	if not is_chest_opened:
		_reveal_loot_items()
	else:
		emit_signal("rewards_claimed", claimable_items)
		emit_signal("closed")
		queue_free()

func _reveal_loot_items() -> void:
	is_chest_opened = true
	claim_button.text = tr("CLAIM_ALL")
	
	# Animate the chest springing open
	var bounce = create_tween().set_ease(Tween.EASE_OUT).set_trans(Tween.TRANS_BOUNCE)
	bounce.tween_property(chest_animation, "scale", Vector2(1.3, 1.3), 0.15)
	bounce.tween_property(chest_animation, "scale", Vector2(1.0, 1.0), 0.25)
	
	# Animate individual loot slots popping up
	for idx in range(claimable_items.size()):
		var item = claimable_items[idx]
		var item_node = TextureRect.new()
		item_node.custom_minimum_size = Vector2(56, 56)
		item_node.expand_mode = TextureRect.EXPAND_KEEP_SIZE
		item_node.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		
		var label = Label.new()
		label.text = "x" + str(item.get("quantity", 1))
		label.size_flags_vertical = Control.SIZE_SHRINK_END
		label.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
		item_node.add_child(label)
		
		# Set tooltip for details
		item_node.tooltip_text = tr(item.get("name", "Artifact Piece"))
		
		# Animate reveal scale
		item_node.scale = Vector2(0, 0)
		loot_grid.add_child(item_node)
		
		var reveal_tween = create_tween().set_delay(idx * 0.08)
		reveal_tween.tween_property(item_node, "scale", Vector2(1.0, 1.0), 0.2)

func _on_close_pressed() -> void:
	emit_signal("closed")
	queue_free()
