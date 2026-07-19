# ==============================================================================
# Crownspire MMO Strategy Game - Quest Completion Reward Popup
# Godot 4 / GDScript 2.0 animated modal displaying earned treasures.
# ==============================================================================

extends Control

# --- Signals ---
signal claimed_rewards_confirmed

# --- Node Outlets ---
@onready var popup_panel: PanelContainer = $PopupPanel
@onready var quest_name_label: Label = $PopupPanel/Margin/VBox/QuestNameLabel
@onready var rewards_container: HBoxContainer = $PopupPanel/Margin/VBox/RewardsContainer
@onready var confirm_button: Button = $PopupPanel/Margin/VBox/ActionBox/ConfirmButton

# --- Style Boxes ---
var style_card: StyleBoxFlat

# ==============================================================================
# LIFECYCLE
# ==============================================================================

func _ready() -> void:
	# Build programmatically to ensure assets look stunning and uniform
	style_card = StyleBoxFlat.new()
	style_card.bg_color = Color(0.141, 0.176, 0.227, 1) # #242d3a
	style_card.border_width_left = 1
	style_card.border_width_top = 1
	style_card.border_width_right = 1
	style_card.border_width_bottom = 1
	style_card.border_color = Color(0.247, 0.314, 0.412, 1) # #3f5069
	style_card.corner_radius_top_left = 6
	style_card.corner_radius_top_right = 6
	style_card.corner_radius_bottom_right = 6
	style_card.corner_radius_bottom_left = 6

	confirm_button.pressed.connect(_on_confirm_pressed)
	
	# Start hidden and shrunk
	visible = false
	popup_panel.scale = Vector2(0.8, 0.8)
	popup_panel.pivot_offset = popup_panel.custom_minimum_size / 2.0

# ==============================================================================
# DISPLAY INTERFACE WITH TRANSITION ANIMATIONS
# ==============================================================================

## Display completion screen with dynamic reward contents
func display_rewards(quest_title: String, rewards: Array) -> void:
	quest_name_label.text = quest_title
	
	# Clear prior cards
	for child in rewards_container.get_children():
		child.queue_free()
		
	# Populate reward item cards
	for item in rewards:
		var card = PanelContainer.new()
		card.custom_minimum_size = Vector2(80, 80)
		card.add_theme_stylebox_override("panel", style_card)
		
		var vbox = VBoxContainer.new()
		vbox.alignment = BoxContainer.ALIGNMENT_CENTER
		vbox.add_theme_constant_override("separation", 4)
		card.add_child(vbox)
		
		# Resource or Shard icon
		var emoji_lbl = Label.new()
		emoji_lbl.text = item.get("emoji", "🎁")
		emoji_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		emoji_lbl.add_theme_font_size_override("font_size", 28)
		vbox.add_child(emoji_lbl)
		
		# Resource / Item Count label
		var amt_lbl = Label.new()
		var amount = item.get("amount", 1)
		if amount >= 1000:
			amt_lbl.text = str(amount / 1000) + "K"
		else:
			amt_lbl.text = str(amount)
			
		amt_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		amt_lbl.add_theme_font_size_override("font_size", 12)
		amt_lbl.add_theme_color_override("font_color", Color(0.95, 0.75, 0.15, 1)) # Gold
		vbox.add_child(amt_lbl)
		
		# Small Name Label
		var name_lbl = Label.new()
		name_lbl.text = item.get("name", "Reward").capitalize()
		name_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		name_lbl.add_theme_font_size_override("font_size", 9)
		name_lbl.add_theme_color_override("font_color", Color(0.6, 0.65, 0.7, 1))
		name_lbl.clip_text = true
		vbox.add_child(name_lbl)
		
		rewards_container.add_child(card)
		
	# Play animate-in sequence
	visible = true
	popup_panel.scale = Vector2(0.8, 0.8)
	popup_panel.modulate = Color(1, 1, 1, 0)
	
	var tween = create_tween().set_parallel(true)
	tween.tween_property(popup_panel, "scale", Vector2(1.0, 1.0), 0.3).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tween.tween_property(popup_panel, "modulate:a", 1.0, 0.25)
	
	# Stagger reward card entrances
	_stagger_card_animations()

func _stagger_card_animations() -> void:
	var idx = 0
	for child in rewards_container.get_children():
		var ctrl = child as Control
		if ctrl:
			ctrl.modulate = Color(1, 1, 1, 0)
			ctrl.position.y += 15
			
			var card_tween = create_tween().set_parallel(true)
			card_tween.set_delay(0.1 + (idx * 0.08))
			card_tween.tween_property(ctrl, "modulate:a", 1.0, 0.2)
			card_tween.tween_property(ctrl, "position:y", ctrl.position.y - 15, 0.2).set_trans(Tween.TRANS_SINE)
			idx += 1

# ==============================================================================
# ACTIONS
# ==============================================================================

func _on_confirm_pressed() -> void:
	# Smooth exit fadeout
	var tween = create_tween().set_parallel(true)
	tween.tween_property(popup_panel, "scale", Vector2(0.85, 0.85), 0.2).set_trans(Tween.TRANS_SINE)
	tween.tween_property(popup_panel, "modulate:a", 0.0, 0.18)
	tween.finished.connect(_on_exit_finished)

func _on_exit_finished() -> void:
	visible = false
	emit_signal("claimed_rewards_confirmed")
