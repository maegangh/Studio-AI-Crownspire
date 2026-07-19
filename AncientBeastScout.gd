# ==============================================================================
# Crownspire MMO - Ancient Beast Scout Window Script
# Godot 4.6 / GDScript 2.0 Royal White Marble UI Panel
# ==============================================================================

class_name AncientBeastScout
extends Control

signal closed()

@onready var title_label: Label = $WhiteMarbleFrame/TitleBar/TitleLabel
@onready var beast_name_label: Label = $WhiteMarbleFrame/MainPanel/Header/BeastNameLabel
@onready var weaknesses_container: VBoxContainer = $WhiteMarbleFrame/MainPanel/WeaknessSection/Container
@onready var abilities_container: VBoxContainer = $WhiteMarbleFrame/MainPanel/AbilitySection/Container
@onready var troop_recommend_label: Label = $WhiteMarbleFrame/MainPanel/StrategySection/TroopLabel
@onready var tactical_advice_label: Label = $WhiteMarbleFrame/MainPanel/StrategySection/AdviceLabel
@onready var close_button: Button = $WhiteMarbleFrame/TitleBar/CloseButton

func _ready() -> void:
	close_button.pressed.connect(_on_close_pressed)

func populate_scout(data: Dictionary) -> void:
	title_label.text = tr("SCOUT_REPORT")
	beast_name_label.text = tr(data.get("name", "Beast Intel"))
	
	# Clear old nodes
	for child in weaknesses_container.get_children():
		child.queue_free()
	for child in abilities_container.get_children():
		child.queue_free()
		
	# Weaknesses
	var weaknesses = data.get("weaknesses", [])
	if weaknesses.is_empty():
		var label = Label.new()
		label.text = tr("NO_KNOWN_WEAKNESSES")
		weaknesses_container.add_child(label)
	else:
		for weak in weaknesses:
			var label = Label.new()
			label.text = "• " + tr(weak)
			label.modulate = Color(0.9, 0.4, 0.4) # Highlighted red
			weaknesses_container.add_child(label)
			
	# Abilities
	var abilities = data.get("abilities", [])
	if abilities.is_empty():
		var label = Label.new()
		label.text = tr("NO_SPECIAL_ABILITIES")
		abilities_container.add_child(label)
	else:
		for abi in abilities:
			var name_lbl = Label.new()
			name_lbl.text = "⚡ " + tr(abi.get("name", ""))
			name_lbl.modulate = Color(0.66, 0.36, 1.0) # Sapphire Purple
			
			var desc_lbl = Label.new()
			desc_lbl.text = tr(abi.get("description", ""))
			desc_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD
			desc_lbl.theme_type_variation = "LabelSmall"
			
			abilities_container.add_child(name_lbl)
			abilities_container.add_child(desc_lbl)
			
	# Strategic Advice
	troop_recommend_label.text = tr("RECOMMENDED_TROOPS") + ": " + tr(data.get("recommended_troop_type", "Balanced"))
	tactical_advice_label.text = tr(data.get("rally_recommendations", "Establish defensive front lines."))

func _on_close_pressed() -> void:
	emit_signal("closed")
	queue_free()
