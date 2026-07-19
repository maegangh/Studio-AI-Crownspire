extends Control
class_name QuestCompletePopup

# ==========================================
# CROWNSPIRE CELEBRATION LOOT POPUP (GACHA CONGRATS)
# ==========================================

@onready var sunburst_ray: TextureRect = $Background/Sunburst if has_node("Background/Sunburst") else get_node_or_null("Sunburst")
@onready var congrats_label: Label = $CongratsLabel if has_node("CongratsLabel") else get_node_or_null("CongratsLabel")
@onready var cards_grid: GridContainer = $CardsGrid if has_node("CardsGrid") else get_node_or_null("CardsGrid")
@onready var dismiss_prompt: Label = $DismissPrompt if has_node("DismissPrompt") else get_node_or_null("DismissPrompt")

const REWARD_CELL_SCENE = "res://scenes/quests/QuestRewardPanel.tscn"

func _ready() -> void:
	# Clicking anywhere closes the popup
	gui_input.connect(_on_gui_input)
	
	# Rotate the backing sunburst ray in the background
	_rotate_sunburst()
	
	# Pulse the "Tap anywhere to continue" prompt
	_pulse_prompt()

func play_celebration(rewards: Array) -> void:
	if not cards_grid:
		return
		
	# Clear old items
	for child in cards_grid.get_children():
		child.queue_free()
		
	# Add cells with a slight stagger scales
	var cell_scene = load(REWARD_CELL_SCENE) as PackedScene
	if not cell_scene:
		return
		
	var idx = 0
	for r_data in rewards:
		var cell = cell_scene.instantiate()
		cards_grid.add_child(cell)
		if cell.has_method("populate_reward"):
			cell.populate_reward(r_data)
			
		# Animate cell scaling up
		cell.pivot_offset = cell.size / 2.0
		cell.scale = Vector2.ZERO
		var cell_tween = create_tween()
		cell_tween.tween_property(cell, "scale", Vector2(1.1, 1.1), 0.3)\
			.set_delay(idx * 0.1)\
			.set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		cell_tween.tween_property(cell, "scale", Vector2(1.0, 1.0), 0.15)\
			.set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)
			
		idx += 1
		
	# Scale whole popup open bounce
	scale = Vector2(0.5, 0.5)
	modulate.a = 0.0
	var tween = create_tween().set_parallel(true)
	tween.tween_property(self, "scale", Vector2(1.0, 1.0), 0.45).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tween.tween_property(self, "modulate:a", 1.0, 0.3)

func _rotate_sunburst() -> void:
	if not sunburst_ray:
		return
	var tween = create_tween().set_loops()
	tween.tween_property(sunburst_ray, "rotation_degrees", 360.0, 12.0).set_trans(Tween.TRANS_LINEAR)

func _pulse_prompt() -> void:
	if not dismiss_prompt:
		return
	var tween = create_tween().set_loops()
	tween.tween_property(dismiss_prompt, "modulate:a", 0.3, 0.8).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN_OUT)
	tween.tween_property(dismiss_prompt, "modulate:a", 1.0, 0.8).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN_OUT)

func _on_gui_input(event: InputEvent) -> void:
	if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
		_close_celebration()

func _close_celebration() -> void:
	var tween = create_tween().set_parallel(true)
	tween.tween_property(self, "scale", Vector2(0.8, 0.8), 0.25).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_IN)
	tween.tween_property(self, "modulate:a", 0.0, 0.2)
	await tween.finished
	
	# Support closing via UIManager if part of standard stack
	if Engine.has_singleton("UIManager"):
		var ui_mgr = Engine.get_singleton("UIManager")
		if ui_mgr.has_method("close_popup"):
			ui_mgr.close_popup(self)
			return
			
	queue_free()
