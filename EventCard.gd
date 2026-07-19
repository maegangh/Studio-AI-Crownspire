# ==============================================================================
# Crownspire MMO Strategy Game - Modular Event Card Controller
# Godot 4 / GDScript 2.0 client-side event summary card
# ==============================================================================

extends PanelContainer

# --- Signals ---
signal view_details_requested(event_id)

# --- Onready Nodes ---
@onready var type_badge: PanelContainer = $Margin/VBox/Header/TypeBadge
@onready var type_lbl: Label = $Margin/VBox/Header/TypeBadge/Margin/Label
@onready var title_lbl: Label = $Margin/VBox/Header/TitleLabel
@onready var timer_lbl: Label = $Margin/VBox/Header/TimerLabel

@onready var desc_lbl: Label = $Margin/VBox/DescLabel
@onready var progress_bar: ProgressBar = $Margin/VBox/ProgressBox/Bar
@onready var progress_lbl: Label = $Margin/VBox/ProgressBox/Label

@onready var points_lbl: Label = $Margin/VBox/Footer/PointsLabel
@onready var details_btn: Button = $Margin/VBox/Footer/DetailsBtn

# --- Internal Data ---
var _event_data: Dictionary = {}

func _ready() -> void:
	details_btn.pressed.connect(_on_details_pressed)

func setup_card(data: Dictionary) -> void:
	_event_data = data
	_refresh_ui()

func _refresh_ui() -> void:
	title_lbl.text = _event_data.get("name", "Imperial Campaign")
	desc_lbl.text = _event_data.get("desc", "")
	
	# Event type styling
	var type_str = _event_data.get("type", "personal")
	type_lbl.text = type_str.to_upper()
	
	var type_style = StyleBoxFlat.new()
	type_style.corner_radius_top_left = 4
	type_style.corner_radius_top_right = 4
	type_style.corner_radius_bottom_right = 4
	type_style.corner_radius_bottom_left = 4
	
	var accent_color = Color(0.6, 0.65, 0.7, 1)
	match type_str.to_lower():
		"server":
			accent_color = Color(0.9, 0.2, 0.2, 1) # Red Crimson
		"alliance":
			accent_color = Color(0.19, 0.48, 0.82, 1) # Azure Blue
		"personal":
			accent_color = Color(0.15, 0.68, 0.37, 1) # Emerald Green
		"battle pass":
			accent_color = Color(0.7, 0.3, 0.9, 1) # Cosmic Purple
		"season":
			accent_color = Color(0.95, 0.75, 0.15, 1) # Amber Gold
			
	type_style.bg_color = accent_color
	type_badge.add_theme_stylebox_override("panel", type_style)
	
	# Apply card borders using a custom stylebox
	var card_style = StyleBoxFlat.new()
	card_style.bg_color = Color(0.10, 0.12, 0.15, 1)
	card_style.border_width_left = 3
	card_style.border_color = accent_color
	card_style.corner_radius_top_left = 6
	card_style.corner_radius_top_right = 6
	card_style.corner_radius_bottom_right = 6
	card_style.corner_radius_bottom_left = 6
	add_theme_stylebox_override("panel", card_style)
	
	# Progress Math
	var score = _event_data.get("score", 0)
	var max_target = _event_data.get("max_target", 1000)
	progress_bar.max_value = float(max_target)
	progress_bar.value = float(score)
	
	progress_lbl.text = "Points: %d / %d" % [score, max_target]
	points_lbl.text = "🏆 Current Rank: #%d" % _event_data.get("rank", 99)
	
	# Timer text (will be refreshed by parent process)
	update_timer_display(_event_data.get("seconds_left", 3600.0))

func update_timer_display(seconds: float) -> void:
	if seconds <= 0:
		timer_lbl.text = "⏳ Ended"
		timer_lbl.add_theme_color_override("font_color", Color(0.8, 0.2, 0.2, 1))
	else:
		var total_sec = int(seconds)
		var hrs = total_sec / 3600
		var mins = (total_sec % 3600) / 60
		var secs = total_sec % 60
		timer_lbl.text = "⏳ %02dh %02dm %02ds left" % [hrs, mins, secs]
		timer_lbl.add_theme_color_override("font_color", Color(0.95, 0.75, 0.15, 1))

func _on_details_pressed() -> void:
	view_details_requested.emit(_event_data.get("id", ""))
