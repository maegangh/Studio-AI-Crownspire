# ==============================================================================
# Crownspire MMO - Ancient Beast Lair Detail Window Script
# Godot 4.6 / GDScript 2.0 Royal White Marble UI Panel
# ==============================================================================

class_name AncientBeastPanel
extends Control

signal scout_pressed(beast_id: String, level: int)
signal rally_pressed(beast_id: String, level: int)
signal bookmarked(lair_id: String, x: int, y: int)
signal closed()

@export var white_marble_theme: Theme

# UI Outlets
@onready var title_label: Label = $WhiteMarbleFrame/TitleBar/TitleLabel
@onready var beast_portrait: TextureRect = $WhiteMarbleFrame/MainPanel/BeastBox/Portrait
@onready var beast_name_label: Label = $WhiteMarbleFrame/MainPanel/BeastBox/NameLabel
@onready var level_label: Label = $WhiteMarbleFrame/MainPanel/BeastBox/LevelLabel
@onready var power_value_label: Label = $WhiteMarbleFrame/MainPanel/StatGrid/PowerBox/Value
@onready var rec_power_label: Label = $WhiteMarbleFrame/MainPanel/StatGrid/RecPowerBox/Value
@onready var rally_size_label: Label = $WhiteMarbleFrame/MainPanel/StatGrid/RallySizeBox/Value
@onready var stamina_cost_label: Label = $WhiteMarbleFrame/MainPanel/StatGrid/StaminaBox/Value
@onready var attempts_label: Label = $WhiteMarbleFrame/MainPanel/StatGrid/AttemptsBox/Value

@onready var rewards_container: GridContainer = $WhiteMarbleFrame/MainPanel/RewardsSection/GridContainer
@onready var rally_status_label: Label = $WhiteMarbleFrame/MainPanel/RallyStatusSection/StatusLabel

# Button elements
@onready var scout_button: Button = $WhiteMarbleFrame/ButtonTray/ScoutButton
@onready var rally_button: Button = $WhiteMarbleFrame/ButtonTray/RallyButton
@onready var bookmark_button: Button = $WhiteMarbleFrame/ButtonTray/BookmarkButton
@onready var close_button: Button = $WhiteMarbleFrame/TitleBar/CloseButton

# Data payload
var active_lair_id: String = ""
var active_beast_id: String = ""
var active_level: int = 1
var coords: Vector2i = Vector2i(0, 0)
var stamina_cost: int = 20
var attempts_left: int = 3

func _ready() -> void:
	# Wire up interaction signals cleanly with localization support
	close_button.pressed.connect(_on_close_pressed)
	scout_button.pressed.connect(_on_scout_pressed)
	rally_button.pressed.connect(_on_rally_pressed)
	bookmark_button.pressed.connect(_on_bookmark_pressed)
	
	_apply_visual_glow_effects()

func populate_panel(data: Dictionary) -> void:
	active_lair_id = data.get("id", "")
	active_beast_id = data.get("beast_id", "dire_wolf_alpha")
	active_level = data.get("level", 1)
	coords = data.get("coords", Vector2i(500, 500))
	
	# tr() handles automatic localization lookup
	title_label.text = tr("ANCIENT_BEAST_LAIR")
	beast_name_label.text = tr(data.get("beast_name", "Unknown Titan"))
	level_label.text = tr("LV_SHORT") + " " + str(active_level)
	
	power_value_label.text = str(data.get("power_rating", 45000))
	rec_power_label.text = str(data.get("recommended_power", 50000))
	rally_size_label.text = str(data.get("rally_size", 4)) + " " + tr("LEGIONS_MAX")
	
	stamina_cost = data.get("stamina_cost", 20)
	stamina_cost_label.text = str(stamina_cost) + " " + tr("STAMINA_POINTS")
	
	attempts_left = data.get("attempts_left", 3)
	attempts_label.text = str(attempts_left) + " / 3"
	
	_render_potential_rewards(data.get("rewards", []))
	_update_rally_status_display(data.get("active_rallies", 0))

func _render_potential_rewards(rewards_list: Array) -> void:
	# Safely clear old reward slots
	for child in rewards_container.get_children():
		child.queue_free()
		
	for r_item in rewards_list:
		var slot = TextureRect.new()
		slot.custom_minimum_size = Vector2(64, 64)
		slot.expand_mode = TextureRect.EXPAND_KEEP_SIZE
		slot.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		
		# Apply premium sapphire outline or golden backdrop depending on reward tier
		var quality = r_item.get("quality", "Common")
		if quality == "Legendary":
			slot.modulate = Color(1.0, 0.85, 0.2) # Gold Accent
		elif quality == "Epic":
			slot.modulate = Color(0.66, 0.36, 1.0) # Sapphire Purple Glow
		else:
			slot.modulate = Color(0.4, 0.6, 0.9) # Ice Sapphire Blue
			
		# Placeholder icon loading (localization / resource-path ready)
		slot.tooltip_text = tr(r_item.get("name", "Royal Loot"))
		rewards_container.add_child(slot)

func _update_rally_status_display(rally_count: int) -> void:
	if rally_count > 0:
		rally_status_label.text = tr("ALLIANCE_RALLY_ACTIVE_COUNT").format({"count": rally_count})
		rally_status_label.modulate = Color(0.3, 0.9, 0.3) # Energetic green
	else:
		rally_status_label.text = tr("NO_ACTIVE_RALLY")
		rally_status_label.modulate = Color(0.7, 0.7, 0.7)

func _apply_visual_glow_effects() -> void:
	# Generates the majestic, signature Crownspire magic underglow
	var glow_tween = create_tween().set_loops()
	glow_tween.tween_property(self, "modulate", Color(1.0, 1.0, 1.1), 1.5)
	glow_tween.tween_property(self, "modulate", Color(1.0, 1.0, 1.0), 1.5)

func _on_close_pressed() -> void:
	emit_signal("closed")
	queue_free()

func _on_scout_pressed() -> void:
	emit_signal("scout_pressed", active_beast_id, active_level)

func _on_rally_pressed() -> void:
	if attempts_left <= 0:
		_show_warning(tr("ERR_NO_ATTEMPTS"))
		return
	emit_signal("rally_pressed", active_beast_id, active_level)

func _on_bookmark_pressed() -> void:
	emit_signal("bookmarked", active_lair_id, coords.x, coords.y)
	_show_notification(tr("BOOKMARK_SAVED"))

func _show_warning(msg: String) -> void:
	print_debug("Crownspire Lair Warning: " + msg)

func _show_notification(msg: String) -> void:
	print("Crownspire Alert: " + msg)
