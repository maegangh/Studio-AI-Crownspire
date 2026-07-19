extends Control

# ==========================================
# CROWNSPIRE CONGRATULATIONS / REWARD CELEBRATION POPUP
# ==========================================
# Celebrating successful purchases or claim activities.
# Populates items dynamically and handles burst entrance animations.

@onready var items_container: HBoxContainer = %ItemsContainer
@onready var claim_button: Button = %ClaimButton
@onready var anim_player: AnimationPlayer = $AnimationPlayer

# Small sub-scene to represent reward item blocks inside the popup
@export var reward_slot_scene: PackedScene

func _ready() -> void:
	claim_button.pressed.connect(_on_claim_pressed)
	
	if anim_player and anim_player.has_animation("reward_celebration"):
		anim_player.play("reward_celebration")

func init_rewards(items_list: Array) -> void:
	# Clear existing
	for child in items_container.get_children():
		child.queue_free()
		
	# Spawn each reward slot
	for reward in items_list:
		var name_str = reward.get("name", "Royal Loot")
		var qty = reward.get("quantity", 1)
		var rarity = reward.get("rarity", 0)
		var icon_p = reward.get("icon", "res://assets/ui/icons/chest_royal_gold.png")
		
		if reward_slot_scene:
			var inst = reward_slot_scene.instantiate()
			items_container.add_child(inst)
			if inst.has_method("setup_reward"):
				inst.setup_reward(name_str, qty, rarity, icon_p)

func _on_claim_pressed() -> void:
	if anim_player and anim_player.has_animation("close_fade"):
		anim_player.play("close_fade")
		await anim_player.animation_finished
	queue_free()
