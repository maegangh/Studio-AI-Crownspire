extends PanelContainer

# ==========================================
# CROWNSPIRE PLAYER PROFILE CONTROLLER
# ==========================================
# Displays the ruler's name, military/kingdom power, VIP tier, and profile avatar.
# Uses rich color themes (royal gold, imperial blue) matching the game style guide.

@onready var avatar_rect: TextureRect = %AvatarRect
@onready var label_name: Label = %LabelName
@onready var label_power: Label = %LabelPower
@onready var vip_badge: Label = %VipBadge
@onready var vip_progress: ProgressBar = %VipProgress
@onready var vip_pts_label: Label = %VipPtsLabel

func _ready() -> void:
	# Connect to currency/state changes from UIManager
	UIManager.currency_changed.connect(_on_state_updated)
	_update_all_displays()
	
	# Connect touch/mouse clicks to open Player Profile Screen overlay
	gui_input.connect(_on_gui_input)

func _on_gui_input(event: InputEvent) -> void:
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
		var profile_scene = preload("res://scenes/settings/PlayerProfileScreen.tscn")
		UIManager.open_popup(profile_scene)

func _update_all_displays() -> void:
	label_name.text = UIManager.player_name
	label_power.text = "PWR: %s" % _format_num(UIManager.power)
	vip_badge.text = "VIP %d" % UIManager.vip_level
	
	# VIP Level Progress calculations (each VIP level requires level * 1000 points as example)
	var points_required = UIManager.vip_level * 1000
	vip_progress.max_value = points_required
	vip_progress.value = UIManager.vip_points
	vip_pts_label.text = "%d/%d" % [UIManager.vip_points, points_required]

func _format_num(val: float) -> String:
	if val >= 1000000.0:
		return "%.2fM" % (val / 1000000.0)
	elif val >= 1000.0:
		return "%.1fK" % (val / 1000.0)
	return String.num_int64(int(val))

func _on_state_updated(property: String, _new_val) -> void:
	if property in ["power", "vip_level", "vip_points", "player_name"]:
		_update_all_displays()
