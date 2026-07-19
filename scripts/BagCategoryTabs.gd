extends ScrollContainer
class_name BagCategoryTabs

# ==========================================
# CROWNSPIRE BAG CATEGORY TABS
# ==========================================
# Manages dynamic categories horizontally. Automatically handles overflow with scrolling.

signal category_selected(category_id: String)

const CATEGORIES = [
	{"id": "all", "name": "🎒 All"},
	{"id": "resources", "name": "🪙 Resources"},
	{"id": "consumables", "name": "🧪 Consumables"},
	{"id": "speedups", "name": "⏳ Speedups"},
	{"id": "boosts", "name": "🚩 Boosts"},
	{"id": "chests", "name": "📦 Chests"},
	{"id": "hero_shards", "name": "👤 Hero Shards"},
	{"id": "hero_xp", "name": "🧪 Hero XP"},
	{"id": "equipment", "name": "⚔️ Equipment"},
	{"id": "ascension_materials", "name": "🌟 Ascension"},
	{"id": "teleport_items", "name": "🌀 Teleports"},
	{"id": "shields", "name": "🛡️ Shields"},
	{"id": "cosmetics", "name": "🏰 Cosmetics"}
]

@onready var hbox: HBoxContainer = $HBox

var active_category := "all"
var buttons: Dictionary = {}

func _ready() -> void:
	# Clear old tabs
	for child in hbox.get_children():
		child.queue_free()
	
	# Create tabs dynamically
	for cat in CATEGORIES:
		var btn = Button.new()
		btn.text = cat["name"]
		btn.name = cat["id"]
		btn.flat = true
		btn.theme_type_variation = "FlatButton"
		btn.add_theme_font_size_override("font_size", 12)
		
		# Event binding
		btn.pressed.connect(func(): _on_tab_pressed(cat["id"]))
		
		hbox.add_child(btn)
		buttons[cat["id"]] = btn
	
	_update_active_styles()

func _on_tab_pressed(cat_id: String) -> void:
	active_category = cat_id
	_update_active_styles()
	category_selected.emit(cat_id)

func _update_active_styles() -> void:
	for cat_id in buttons.keys():
		var btn: Button = buttons[cat_id]
		var is_active = (cat_id == active_category)
		
		var style = StyleBoxFlat.new()
		style.corner_radius_top_left = 6
		style.corner_radius_top_right = 6
		style.border_width_bottom = 3 if is_active else 0
		style.border_color = Color(0.85, 0.65, 0.13, 1.0) # Golden border
		style.content_margin_left = 14
		style.content_margin_right = 14
		style.content_margin_top = 8
		style.content_margin_bottom = 8
		
		if is_active:
			style.bg_color = Color(0.12, 0.16, 0.24, 0.9)
			btn.add_theme_color_override("font_color", Color(1.0, 0.84, 0.0))
		else:
			style.bg_color = Color(0, 0, 0, 0)
			btn.add_theme_color_override("font_color", Color(0.7, 0.75, 0.82))
			
		btn.add_theme_stylebox_override("normal", style)
		btn.add_theme_stylebox_override("hover", style)
		btn.add_theme_stylebox_override("pressed", style)
		btn.add_theme_stylebox_override("focus", style)
