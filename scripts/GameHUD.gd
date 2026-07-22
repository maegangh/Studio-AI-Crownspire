extends Control

# ==========================================
# CROWNSPIRE MAIN GAME HUD COORDINATOR
# ==========================================
# Connects the player profile, resource bars, quest trackers, bottom navigation,
# and floating quick-actions into a high-fidelity 720x1280 portrait layout.
# Handles dynamic viewport loading between City and World modes.

@onready var background_panel: Panel = %BackgroundPanel
@onready var view_icon: Label = %ViewIcon
@onready var bottom_nav: PanelContainer = %BottomNavigation
@onready var quest_tracker: PanelContainer = %QuestTracker
@onready var floating_btns: VBoxContainer = %FloatingButtons
@onready var viewport_container: Control = %ViewportContainer

@export var city_view_scene: PackedScene = preload("res://scenes/CityView.tscn")
@export var world_view_scene: PackedScene = preload("res://scenes/WorldMapView.tscn")

var active_view: String = "city"
var active_viewport_node: Node = null

func _ready() -> void:
	# Connect to navigation signal from BottomNavigation
	bottom_nav.navigation_selected.connect(_on_navigation_changed)
	_update_view_viewport()

func _on_navigation_changed(view_name: String) -> void:
	if view_name == "heroes":
		var hero_scene = preload("res://scenes/HeroScreen.tscn")
		UIManager.open_popup(hero_scene)
		return
	elif view_name == "alliance":
		var alliance_scene = preload("res://scenes/AllianceScreen.tscn")
		UIManager.open_popup(alliance_scene)
		return
	elif view_name == "quests" or view_name == "quest":
		var quest_scene = preload("res://scenes/quests/QuestScreen.tscn")
		UIManager.open_popup(quest_scene)
		return
	elif view_name == "mail":
		var mail_scene = preload("res://scenes/mail/MailScreen.tscn")
		UIManager.open_popup(mail_scene)
		return
	elif view_name == "bag" or view_name == "inventory":
		var bag_scene = preload("res://scenes/BagScreen.tscn")
		UIManager.open_popup(bag_scene)
		return

	if active_view == view_name:
		return
		
	active_view = view_name
	
	# Play transition animation
	var tween = create_tween()
	tween.tween_property(background_panel, "modulate:a", 0.0, 0.2)
	tween.chain().perform(func(): _update_view_viewport())
	tween.chain().tween_property(background_panel, "modulate:a", 1.0, 0.2)

func _update_view_viewport() -> void:
	# Clean up previous viewport content
	if active_viewport_node and is_instance_valid(active_viewport_node):
		active_viewport_node.queue_free()
		active_viewport_node = null
		
	if active_view == "city":
		background_panel.self_modulate = Color(0.05, 0.07, 0.11, 1)
		view_icon.text = "🏰"
		_simulate_clouds()
		
		# Instantiate City View
		if city_view_scene:
			active_viewport_node = city_view_scene.instantiate()
			viewport_container.add_child(active_viewport_node)
	else:
		background_panel.self_modulate = Color(0.04, 0.08, 0.06, 1)
		view_icon.text = "🌍"
		
		# Instantiate World Map View
		if world_view_scene:
			active_viewport_node = world_view_scene.instantiate()
			viewport_container.add_child(active_viewport_node)

func _simulate_clouds() -> void:
	var tween = create_tween().set_loops()
	tween.tween_property(view_icon, "position:y", view_icon.position.y - 12, 1.5).set_trans(Tween.TRANS_SINE)
	tween.tween_property(view_icon, "position:y", view_icon.position.y + 12, 1.5).set_trans(Tween.TRANS_SINE)


