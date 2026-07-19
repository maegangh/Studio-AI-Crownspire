extends PanelContainer

# ==========================================
# CROWNSPIRE HERO CARD COMPONENT
# ==========================================
# Displays a single hero in the grid, incorporating class icons, level,
# rarity visual tiers, power rating, and notification flags.

signal hero_selected(hero_id: String)

@export var selected_style: StyleBoxFlat
@export var normal_style: StyleBoxFlat

@onready var portrait_lbl: Label = %PortraitEmoji
@onready var name_lbl: Label = %HeroName
@onready var lvl_lbl: Label = %LevelLabel
@onready var power_lbl: Label = %PowerLabel
@onready var stars_lbl: Label = %StarsLabel
@onready var favorite_indicator: Control = %FavoriteIndicator
@onready var notification_badge: Panel = %NotificationBadge
@onready var class_badge: Label = %ClassBadge

var hero_id: String = ""
var is_unlocked: bool = false

func _ready() -> void:
	# Clicking anywhere on the card selects it
	gui_input.connect(_on_gui_input)

func setup(hero_data: Dictionary) -> void:
	hero_id = hero_data["id"]
	is_unlocked = hero_data.get("unlocked", false)
	
	portrait_lbl.text = hero_data.get("emoji", "👤")
	name_lbl.text = hero_data["name"].to_upper()
	lvl_lbl.text = "LVL %d" % hero_data["level"]
	power_lbl.text = "⚡ %d" % hero_data["power"]
	
	# Class indicator
	class_badge.text = hero_data.get("class", "Warrior").to_upper()
	
	# Favorite heart toggle
	favorite_indicator.visible = hero_data.get("favorite", false)
	
	# Shards notification indicator (can level up or can unlock)
	var shards = hero_data.get("shards", 0)
	var req_shards = hero_data.get("shards_required", 100)
	var can_upgrade_or_unlock = shards >= req_shards
	
	# If unlocked and player has XP potions and gold, show upgrade recommedation
	if is_unlocked and UIManager.hero_xp_potions > 0 and hero_data["level"] < hero_data["max_level"]:
		can_upgrade_or_unlock = true
		
	notification_badge.visible = can_upgrade_or_unlock
	
	# Stars
	var star_str = ""
	for i in range(hero_data.get("rarity_stars", 3)):
		star_str += "★"
	stars_lbl.text = star_str
	
	# Theme and modulations based on rarity
	var rarity = hero_data.get("rarity", "Rare")
	match rarity:
		"Legendary":
			stars_lbl.add_theme_color_override("font_color", Color(1, 0.84, 0)) # Golden
			name_lbl.add_theme_color_override("font_color", Color(1, 0.84, 0))
		"Epic":
			stars_lbl.add_theme_color_override("font_color", Color(0.75, 0.35, 1)) # Epic Purple
			name_lbl.add_theme_color_override("font_color", Color(0.75, 0.35, 1))
		_:
			stars_lbl.add_theme_color_override("font_color", Color(0.2, 0.6, 1)) # Rare Blue
			name_lbl.add_theme_color_override("font_color", Color(0.2, 0.6, 1))
			
	# Locked gray-out state
	if not is_unlocked:
		modulate = Color(0.5, 0.5, 0.5, 0.8)
		power_lbl.text = "LOCKED"
		lvl_lbl.text = "SHARDS: %d/%d" % [shards, req_shards]
	else:
		modulate = Color(1, 1, 1, 1)

func set_selected(active: bool) -> void:
	if active:
		if selected_style:
			add_theme_stylebox_override("panel", selected_style)
	else:
		if normal_style:
			add_theme_stylebox_override("panel", normal_style)

func _on_gui_input(event: InputEvent) -> void:
	if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
		hero_selected.emit(hero_id)
		# Satisfying subtle bounce when tapped
		var tween = create_tween()
		tween.tween_property(self, "scale", Vector2(0.95, 0.95), 0.05)
		tween.tween_property(self, "scale", Vector2(1.0, 1.0), 0.1)
