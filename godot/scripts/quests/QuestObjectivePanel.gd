extends Panel
class_name QuestObjectivePanel

# ==========================================
# CROWNSPIRE QUEST DETAIL OBJECTIVE ROW RENDERER
# ==========================================

@onready var desc_label: Label = $HBox/DescLabel if has_node("HBox/DescLabel") else get_node_or_null("DescLabel")
@onready var progress_label: Label = $HBox/ProgressLabel if has_node("HBox/ProgressLabel") else get_node_or_null("ProgressLabel")
@onready var checkmark: Label = $HBox/Checkmark if has_node("HBox/Checkmark") else get_node_or_null("Checkmark")

func populate_objective(obj_data: Dictionary) -> void:
	if desc_label:
		desc_label.text = obj_data.get("description", "Royal Mandate")
		
	var cur = int(obj_data.get("current", 0))
	var tar = int(obj_data.get("target", 1))
	var completed = obj_data.get("completed", false) or (cur >= tar)
	
	if progress_label:
		progress_label.text = "%d / %d" % [cur, tar]
		if completed:
			progress_label.add_theme_color_override("font_color", Color(0.4, 0.95, 0.55, 1.0))
		else:
			progress_label.add_theme_color_override("font_color", Color(0.6, 0.7, 0.8, 1.0))
			
	if checkmark:
		if completed:
			checkmark.text = "✅"
			checkmark.modulate = Color(0.4, 0.95, 0.55, 1.0)
		else:
			checkmark.text = "⭕"
			checkmark.modulate = Color(0.4, 0.5, 0.6, 1.0)
