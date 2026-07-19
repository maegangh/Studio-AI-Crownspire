extends PanelContainer

# ==========================================
# CROWNSPIRE BOTTOM NAVIGATION CONTROLLER
# ==========================================
# Coordinates the central command row of modular shortcut buttons.
# Emits navigation signals to switch active cameras and grids.

signal navigation_selected(view_name: String)

@onready var city_btn: Button = %CityButton
@onready var alliance_btn: Button = %AllianceButton
@onready var heroes_btn: Button = %HeroesButton
@onready var world_btn: Button = %WorldButton
@onready var event_btn: Button = %EventButton
@onready var mail_btn: Button = %MailButton

var current_active_view: String = "city"

func _ready() -> void:
	# Connect to custom view transition events from buttons
	city_btn.pressed.connect(func(): _on_view_pressed("city"))
	world_btn.pressed.connect(func(): _on_view_pressed("world"))
	heroes_btn.pressed.connect(func(): navigation_selected.emit("heroes"))
	
	_update_active_visuals()

func _on_view_pressed(view_name: String) -> void:
	current_active_view = view_name
	navigation_selected.emit(view_name)
	_update_active_visuals()

func _update_active_visuals() -> void:
	if current_active_view == "city":
		# Highlight City Button with golden/blue outline, dim World
		city_btn.modulate = Color(1.1, 1.1, 1.1, 1.0)
		world_btn.modulate = Color(0.7, 0.7, 0.8, 0.8)
	else:
		# Highlight World Button, dim City
		city_btn.modulate = Color(0.7, 0.7, 0.8, 0.8)
		world_btn.modulate = Color(1.1, 1.1, 1.1, 1.0)
