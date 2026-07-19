extends PanelContainer

@onready var stat_icon: TextureRect = %StatIcon
@onready var stat_name_label: Label = %StatNameLabel
@onready var current_value_label: Label = %CurrentValueLabel
@onready var arrow_label: Label = %ArrowLabel
@onready var next_value_label: Label = %NextValueLabel
@onready var increase_label: Label = %IncreaseLabel

# Set up the bonus row values dynamically
func setup(stat_name: String, icon_path: String, current_val: String, new_val: String, increase_val: String) -> void:
	if stat_name_label:
		stat_name_label.text = stat_name
	
	if stat_icon:
		if icon_path != "" and ResourceLoader.exists(icon_path):
			stat_icon.texture = load(icon_path)
			stat_icon.visible = true
		else:
			# If no custom icon exists, hide or use default elegant glyph
			stat_icon.visible = false
			
	if current_value_label:
		current_value_label.text = current_val
		
	if next_value_label:
		next_value_label.text = new_val
		
	if arrow_label:
		arrow_label.text = "➜"
		arrow_label.add_theme_color_override("font_color", Color(0.2, 0.6, 0.9, 1.0)) # Sapphire Blue Glow
		
	if increase_label:
		if increase_val != "" and increase_val != "0":
			increase_label.text = " (+" + increase_val + ")"
			increase_label.add_theme_color_override("font_color", Color(0.18, 0.8, 0.44, 1.0)) # Emerald Green
			increase_label.visible = true
		else:
			increase_label.visible = false
