extends PanelContainer
class_name ChestOpeningPopup

# ==========================================
# CROWNSPIRE CHEST OPENING POPUP
# ==========================================
# Executes alchemical rituals to shake and break open reward chests.
# Generates loot distributions and pushes items to player storage.

signal opening_completed(rewards: Array)

@onready var glow_back: ColorRect = $Margin/VBox/VisualsControl/GlowBack
@onready var chest_label: Label = $Margin/VBox/VisualsControl/ChestLabel
@onready var message_label: Label = $Margin/VBox/StatusLabel
@onready var skip_btn: Button = $Margin/VBox/SkipButton
@onready var particles: Label = $Margin/VBox/VisualsControl/ParticlesLabel

var chest_item_id := ""
var quantity_to_open := 1
var rolled_rewards := []

func _ready() -> void:
	skip_btn.pressed.connect(_on_skip_pressed)
	skip_btn.disabled = true

func start_opening(item_id: String, quantity: int = 1) -> void:
	chest_item_id = item_id
	quantity_to_open = quantity
	rolled_rewards.clear()
	
	var item_def = UIManager.get_item_definition(item_id)
	if item_def.is_empty():
		hide()
		return
	
	chest_label.text = item_def.get("icon_emoji", "📦")
	message_label.text = "Unlocking %d x %s..." % [quantity, item_def.get("name", "Chest")]
	
	# Consume the chest from inventory
	UIManager.remove_inventory_item(item_id, quantity)
	
	# Roll loot table
	var use_effect = item_def.get("use_effect", {})
	var loot_table = use_effect.get("loot_table", [])
	
	# Perform loot calculations
	for q in range(quantity):
		for loot in loot_table:
			var rand_val = randf()
			if rand_val <= loot.get("chance", 1.0):
				var min_amt = int(loot.get("min", 1))
				var max_amt = int(loot.get("max", 1))
				var qty = randi_range(min_amt, max_amt)
				
				# Check if already in rolled
				var found = false
				for r in rolled_rewards:
					if r["item_id"] == loot["item_id"]:
						r["quantity"] += qty
						found = true
						break
				if not found:
					rolled_rewards.append({
						"item_id": loot["item_id"],
						"quantity": qty
					})
	
	show()
	_play_opening_ritual()

func _play_opening_ritual() -> void:
	# 1. Start slow background glow rotation & particle pulsing
	var rot_tween = create_tween().set_loops()
	rot_tween.tween_property(glow_back, "rotation_degrees", 360.0, 3.0)
	
	var pulse_tween = create_tween().set_loops()
	pulse_tween.tween_property(particles, "modulate:a", 1.0, 0.3)
	pulse_tween.tween_property(particles, "modulate:a", 0.2, 0.3)
	
	# 2. Shake chest with building intensity
	var shake_tween = create_tween()
	var chest_start_pos = chest_label.position
	
	# Speedups of alchemical vibrations
	for idx in range(12):
		var offset = Vector2(randf_range(-8, 8), randf_range(-8, 8))
		shake_tween.tween_property(chest_label, "position", chest_start_pos + offset, 0.05)
	
	shake_tween.tween_property(chest_label, "position", chest_start_pos, 0.05)
	
	# Scale chest up to squeeze
	shake_tween.tween_property(chest_label, "scale", Vector2(1.3, 1.3), 0.15).set_trans(Tween.TRANS_SINE)
	
	# 3. BURST OPEN callback
	shake_tween.tween_callback(_burst_chest)

func _burst_chest() -> void:
	# Swap visual to cracked chest/open gift emoji
	chest_label.text = "💥"
	glow_back.color = Color(1.0, 0.9, 0.5, 0.8) # Blinding flash
	
	# Add rewards to player inventory and trigger display
	var award_list := []
	for r in rolled_rewards:
		UIManager.add_inventory_item(r["item_id"], r["quantity"])
		var def = UIManager.get_item_definition(r["item_id"])
		award_list.append({
			"name": def.get("name", "Royal Loot"),
			"quantity": r["quantity"],
			"rarity": def.get("rarity", 2),
			"icon": def.get("icon_emoji", "📦")
		})
	
	# Slow fade-in of Skip/Claim button
	skip_btn.text = "CLAIM REWARDS"
	skip_btn.disabled = false
	
	var flash_tween = create_tween()
	flash_tween.tween_property(glow_back, "color", Color(0.85, 0.65, 0.13, 0.15), 0.4)
	
	# Show item count loaded in text
	message_label.text = "Acquired %d distinct items!" % award_list.size()
	
	# Emit event
	opening_completed.emit(award_list)

func _on_skip_pressed() -> void:
	# Show rewards popup or free screen
	var main_hud = get_tree().current_scene
	if main_hud and main_hud.has_method("show_rewards"):
		var award_list := []
		for r in rolled_rewards:
			var def = UIManager.get_item_definition(r["item_id"])
			award_list.append({
				"name": def.get("name", "Royal Loot"),
				"quantity": r["quantity"],
				"rarity": def.get("rarity", 2),
				"icon": def.get("icon_emoji", "📦")
			})
		main_hud.call_deferred("show_rewards", award_list)
	
	_animate_close()

func _animate_close() -> void:
	var tween = create_tween().set_parallel(true)
	tween.tween_property(self, "scale", Vector2(0.9, 0.9), 0.2).set_trans(Tween.TRANS_SINE)
	tween.tween_property(self, "modulate:a", 0.0, 0.15)
	tween.chain().tween_callback(queue_free)
