extends PanelContainer
class_name ItemTooltip

# ==========================================
# CROWNSPIRE ITEM TOOLTIP CONTROLLER
# ==========================================
# Shows a quick-hover layout with title, category, rarity, and brief description.

@onready var name_label: Label = $Margin/VBox/NameLabel
@onready var category_label: Label = $Margin/VBox/CategoryLabel
@onready var desc_label: Label = $Margin/VBox/DescLabel
@onready var rarity_frame: ItemRarityFrame = $ItemRarityFrame

func _ready() -> void:
	modulate.a = 0.0

func display_item(item_id: String) -> void:
	var item_def = UIManager.get_item_definition(item_id)
	if item_def.is_empty():
		hide()
		return
	
	name_label.text = item_def.get("name", "Unknown Item")
	var category_id = item_def.get("category_id", "General")
	category_label.text = category_id.replace("_", " ").capitalize()
	desc_label.text = item_def.get("description", "")
	
	var rarity = int(item_def.get("rarity", 1))
	rarity_frame.set_rarity(rarity)
	
	# Apply visual flavor colors to the name based on rarity
	var colors = [
		Color(0.8, 0.8, 0.8), # Common
		Color(0.2, 0.9, 0.4), # Uncommon
		Color(0.2, 0.6, 1.0), # Rare
		Color(0.7, 0.3, 1.0), # Epic
		Color(1.0, 0.8, 0.1)  # Legendary
	]
	name_label.add_theme_color_override("font_color", colors[clampi(rarity - 1, 0, 4)])
	
	show()
	fade_in()

func fade_in() -> void:
	var tween = create_tween()
	tween.tween_property(self, "modulate:a", 1.0, 0.25).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)

func fade_out() -> void:
	var tween = create_tween()
	tween.tween_property(self, "modulate:a", 0.0, 0.2).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN)
	tween.tween_callback(queue_free)
