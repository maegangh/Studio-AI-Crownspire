extends ScrollContainer
class_name InventoryFilterBar

# ==========================================
# CROWNSPIRE INVENTORY FILTER BAR
# ==========================================
# Handles visual toggles for state filtering: All, Favorites, Usable, Locked.

signal filter_selected(filter_type: String)

@onready var btn_all: Button = %BtnAll
@onready var btn_fav: Button = %BtnFav
@onready var btn_use: Button = %BtnUse
@onready var btn_lock: Button = %BtnLock

var active_filter := "all"

func _ready() -> void:
	btn_all.pressed.connect(func(): _on_filter_pressed("all", btn_all))
	btn_fav.pressed.connect(func(): _on_filter_pressed("favorites", btn_fav))
	btn_use.pressed.connect(func(): _on_filter_pressed("usable", btn_use))
	btn_lock.pressed.connect(func(): _on_filter_pressed("locked", btn_lock))
	
	_update_visuals()

func _on_filter_pressed(filter_type: String, button: Button) -> void:
	active_filter = filter_type
	_update_visuals()
	filter_selected.emit(filter_type)

func _update_visuals() -> void:
	var active_style = _create_button_style(true)
	var inactive_style = _create_button_style(false)
	
	btn_all.add_theme_stylebox_override("normal", active_style if active_filter == "all" else inactive_style)
	btn_fav.add_theme_stylebox_override("normal", active_style if active_filter == "favorites" else inactive_style)
	btn_use.add_theme_stylebox_override("normal", active_style if active_filter == "usable" else inactive_style)
	btn_lock.add_theme_stylebox_override("normal", active_style if active_filter == "locked" else inactive_style)

func _create_button_style(active: bool) -> StyleBoxFlat:
	var style = StyleBoxFlat.new()
	style.corner_radius_top_left = 12
	style.corner_radius_top_right = 12
	style.corner_radius_bottom_right = 12
	style.corner_radius_bottom_left = 12
	style.border_width_left = 1
	style.border_width_top = 1
	style.border_width_right = 1
	style.border_width_bottom = 1
	style.content_margin_left = 12
	style.content_margin_right = 12
	style.content_margin_top = 6
	style.content_margin_bottom = 6
	
	if active:
		style.bg_color = Color(0.85, 0.65, 0.13, 0.25)
		style.border_color = Color(0.85, 0.65, 0.13, 0.9)
	else:
		style.bg_color = Color(0.08, 0.11, 0.17, 0.8)
		style.border_color = Color(0.18, 0.24, 0.35, 0.8)
		
	return style
