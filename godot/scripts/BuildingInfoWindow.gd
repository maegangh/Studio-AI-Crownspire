extends Control

# Reusable lightweight BuildingInfoWindow

@export var building_id: String = ""

@onready var title_label: Label = %TitleLabel
@onready var level_label: Label = %LevelLabel
@onready var desc_label: Label = %DescLabel
@onready var stats_label: Label = %StatsLabel
@onready var icon_label: Label = %IconLabel
@onready var close_button: Button = %CloseButton

func _ready() -> void:
	close_button.pressed.connect(_on_close_pressed)
	load_building_data()

func load_building_data() -> void:
	if building_id == "":
		return
		
	var ui = get_node_or_null("/root/UIManager")
	var b_data = {}
	if ui and ui.has_method("get_building"):
		b_data = ui.call("get_building", building_id)
		
	if b_data.is_empty():
		# Fallback/Friendly display
		title_label.text = building_id.replace("_", " ").capitalize().to_upper()
		level_label.text = "Level 1"
		desc_label.text = "A strategic Royal structure within your kingdom."
		stats_label.text = "Provides kingdom structural rating and power."
		icon_label.text = _get_unicode_icon(building_id)
		return
		
	title_label.text = b_data.get("name", building_id.capitalize()).to_upper()
	level_label.text = "LEVEL %d" % b_data.get("level", 1)
	desc_label.text = b_data.get("description", "Royal Structure")
	
	# Current bonus stats
	stats_label.text = "Current Bonus: %s\nPower Valuation: %d points" % [
		b_data.get("current_bonus", "Active"),
		int(b_data.get("base_power", 0) + b_data.get("level", 1) * b_data.get("power_per_level", 0))
	]
	
	# Icon selection
	icon_label.text = _get_unicode_icon(building_id)

func _get_unicode_icon(b_id: String) -> String:
	match b_id:
		"citadel", "citadel_keep": return "🏰"
		"academy", "research_hall": return "📜"
		"barracks", "infantry_barracks": return "⚔️"
		"marksmen_camp": return "🏹"
		"cavalry_stable": return "🐎"
		"warehouse": return "🪙"
		"farm": return "🌾"
		"lumber_mill": return "🪵"
		"quarry": return "🪨"
		"iron_mine": return "⛓️"
		"hospital": return "💖"
		"sanctuary": return "🌟"
		"watchtower", "watch_tower": return "🔭"
		"rune_forge": return "💎"
		"valor_shine", "valor_shrine": return "🔥"
		"wall": return "🧱"
		"arcane_tower": return "🔮"
		"tavern": return "🍺"
		_: return "🏠"

func _on_close_pressed() -> void:
	var ui = get_node_or_null("/root/UIManager")
	if ui and ui.has_method("close_popup"):
		ui.call("close_popup", self)
	else:
		queue_free()
