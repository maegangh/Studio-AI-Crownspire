extends PanelContainer

# ==========================================
# CROWNSPIRE HERO LIST ITEM CONTROLLER
# ==========================================
# Manages individual hero row/card previews in the selection list.
# Supports favorites toggle, rarity colors, lock overlays, and level/power stats.

signal hero_selected(hero_data: Dictionary)
signal favorite_toggled(hero_id: String, is_favorite: bool)

@onready var name_label: Label = get_node_or_null("%HeroNameLabel")
@onready var title_label: Label = get_node_or_null("%HeroTitleLabel")
@onready var level_label: Label = get_node_or_null("%LevelLabel")
@onready var power_label: Label = get_node_or_null("%PowerLabel")
@onready var class_label: Label = get_node_or_null("%ClassLabel")
@onready var portrait_lbl: Label = get_node_or_null("%PortraitLabel")
@onready var stars_lbl: Label = get_node_or_null("%StarsLabel")

@onready var favorite_btn: Button = get_node_or_null("%FavoriteButton")
@onready var click_btn: Button = get_node_or_null("%SelectButton")

var hero_data: Dictionary = {}

func _ready() -> void:
	if click_btn:
		click_btn.pressed.connect(_on_card_pressed)
	if favorite_btn:
		favorite_btn.pressed.connect(_on_favorite_pressed)

func init_item(data: Dictionary) -> void:
	hero_data = data
	
	# Basic textual information
	if name_label:
		name_label.text = data.get("name", "Unknown Vanguard")
	if title_label:
		title_label.text = data.get("title", "Hero Title")
	if level_label:
		level_label.text = "LVL %d" % data.get("level", 1)
	if power_label:
		power_label.text = "PWR %d" % data.get("power", 0)
	if class_label:
		class_label.text = data.get("class", "Warrior").to_upper()
	if portrait_lbl:
		portrait_lbl.text = data.get("emoji", "🎖️")
		
	# Stars
	if stars_lbl:
		var star_count = int(data.get("rarity_stars", 1))
		var stars_str = ""
		for i in range(star_count):
			stars_str += "★"
		stars_lbl.text = stars_str
		
	# Rarity color mapping
	var rarity = data.get("rarity", "Common").to_lower()
	var border_color = Color(0.7, 0.7, 0.7) # Fallback gray
	match rarity:
		"legendary":
			border_color = Color(1.0, 0.67, 0.0) # Gold
		"epic":
			border_color = Color(0.67, 0.0, 1.0) # Purple
		"rare":
			border_color = Color(0.0, 0.67, 1.0) # Blue
			
	# Apply slight colored theme glow if possible
	if name_label:
		name_label.modulate = border_color
		
	# Check Unlocked State
	var unlocked = data.get("unlocked", true)
	if not unlocked:
		modulate = Color(0.5, 0.5, 0.5, 0.8) # Grayed out lock look
		if power_label:
			power_label.text = "LOCKED"
	else:
		modulate = Color(1, 1, 1, 1)

	_update_favorite_button(data.get("favorite", false))

func _update_favorite_button(is_fav: bool) -> void:
	if favorite_btn:
		if is_fav:
			favorite_btn.text = "❤️"
			favorite_btn.modulate = Color(1.0, 0.3, 0.3)
		else:
			favorite_btn.text = "🖤"
			favorite_btn.modulate = Color(0.7, 0.7, 0.7)

func _on_card_pressed() -> void:
	hero_selected.emit(hero_data)

func _on_favorite_pressed() -> void:
	var current_fav = hero_data.get("favorite", false)
	var new_fav = not current_fav
	hero_data["favorite"] = new_fav
	_update_favorite_button(new_fav)
	favorite_toggled.emit(hero_data.get("id", ""), new_fav)
