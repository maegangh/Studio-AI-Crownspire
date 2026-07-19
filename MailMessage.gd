# ==============================================================================
# Crownspire MMO Strategy Game - Mail List Entry Row Controller
# Godot 4 / GDScript 2.0 Client-side mail entry item
# ==============================================================================

extends PanelContainer

# --- Signals ---
signal selected(mail_id: String)
signal favorite_toggled(mail_id: String, state: bool)
signal delete_pressed(mail_id: String)

# --- Constant UI Colors / Styling Keys ---
const STYLE_READ = preload("res://MailMessage.tscn") # Loaded from SubResource
var style_read: StyleBoxFlat
var style_unread: StyleBoxFlat
var style_selected: StyleBoxFlat

# --- Node Outlets ---
@onready var unread_indicator: Panel = $Margin/HBox/UnreadIndicator
@onready var category_icon: Label = $Margin/HBox/CategoryIcon
@onready var subject_label: Label = $Margin/HBox/VBox/SubjectLabel
@onready var sender_label: Label = $Margin/HBox/VBox/SenderLabel
@onready var timestamp_label: Label = $Margin/HBox/VBox/TimestampLabel
@onready var attachment_icon: Label = $Margin/HBox/AttachmentIcon
@onready var fav_button: Button = $Margin/HBox/ActionBox/FavButton
@onready var delete_button: Button = $Margin/HBox/ActionBox/DeleteButton

# --- Row State Data ---
var mail_id: String = ""
var is_read: bool = false
var is_favorite: bool = false
var has_unclaimed_attachments: bool = false

# ==============================================================================
# LIFECYCLE
# ==============================================================================

func _ready() -> void:
	# Construct styleboxes programmatically to prevent resource file dependency failures
	_setup_styles()
	
	# Connect local button click handlers
	fav_button.pressed.connect(_on_fav_button_pressed)
	delete_button.pressed.connect(_on_delete_button_pressed)
	
	# Setup interactive hover feedback
	mouse_entered.connect(_on_hover_entered)
	mouse_exited.connect(_on_hover_exited)

func _setup_styles() -> void:
	# Read StyleBox
	style_read = StyleBoxFlat.new()
	style_read.bg_color = Color(0.098, 0.117, 0.149, 1) # #191e26
	style_read.border_width_left = 1
	style_read.border_width_top = 1
	style_read.border_width_right = 1
	style_read.border_width_bottom = 1
	style_read.border_color = Color(0.141, 0.172, 0.219, 1) # #242c38
	style_read.corner_radius_top_left = 4
	style_read.corner_radius_top_right = 4
	style_read.corner_radius_bottom_right = 4
	style_read.corner_radius_bottom_left = 4

	# Unread StyleBox (Bold left highlight accent)
	style_unread = StyleBoxFlat.new()
	style_unread.bg_color = Color(0.141, 0.176, 0.227, 1) # #242d3a
	style_unread.border_width_left = 3
	style_unread.border_color = Color(0.192, 0.478, 0.820, 1) # #317ad1
	style_unread.corner_radius_top_left = 4
	style_unread.corner_radius_top_right = 4
	style_unread.corner_radius_bottom_right = 4
	style_unread.corner_radius_bottom_left = 4

	# Selected Highlight StyleBox
	style_selected = StyleBoxFlat.new()
	style_selected.bg_color = Color(0.160, 0.211, 0.282, 1) # #293648
	style_selected.border_width_left = 3
	style_selected.border_color = Color(0.192, 0.478, 0.820, 1)
	style_selected.corner_radius_top_left = 4
	style_selected.corner_radius_top_right = 4
	style_selected.corner_radius_bottom_right = 4
	style_selected.corner_radius_bottom_left = 4

# ==============================================================================
# DATA INITIALIZATION INTERFACE
# ==============================================================================

## populates the row entry with message state
func setup_message(p_data: Dictionary) -> void:
	mail_id = p_data.get("id", "")
	is_read = p_data.get("is_read", false)
	is_favorite = p_data.get("is_favorite", false)
	has_unclaimed_attachments = p_data.get("has_attachments", false) and not p_data.get("attachments_claimed", false)
	
	subject_label.text = p_data.get("subject", "Notification")
	sender_label.text = "Sender: " + p_data.get("sender", "System Core")
	timestamp_label.text = p_data.get("timestamp", "Just Now")
	
	# Category-specific display icons (Emojis)
	var cat = p_data.get("category", "system")
	match cat:
		"battle":
			category_icon.text = "⚔️"
			category_icon.add_theme_color_override("font_color", Color(0.9, 0.2, 0.2, 1)) # Red
		"alliance":
			category_icon.text = "🤝"
			category_icon.add_theme_color_override("font_color", Color(0.2, 0.7, 0.9, 1)) # Light blue
		"system":
			category_icon.text = "⚙️"
			category_icon.add_theme_color_override("font_color", Color(0.6, 0.65, 0.7, 1)) # System grey
		_:
			category_icon.text = "✉️"
			category_icon.add_theme_color_override("font_color", Color(1, 1, 1, 1))
			
	# Update visual states
	_update_visual_state(false)

## Updates background panels, unread dots, and favorite stars
func _update_visual_state(p_selected: bool) -> void:
	# 1. Background style box override
	if p_selected:
		add_theme_stylebox_override("panel", style_selected)
	else:
		add_theme_stylebox_override("panel", style_unread if not is_read else style_read)
		
	# 2. Unread indicator dot visibility
	unread_indicator.visible = not is_read
	
	# 3. Attachment chest visibility
	attachment_icon.visible = has_unclaimed_attachments
	
	# 4. Favorite star indicator state
	fav_button.text = "★" if is_favorite else "☆"
	if is_favorite:
		fav_button.add_theme_color_override("font_color", Color(0.95, 0.75, 0.15, 1)) # Gold
	else:
		fav_button.add_theme_color_override("font_color", Color(0.5, 0.55, 0.6, 1)) # Gray

## Call from parent view to highlight the currently active selected row
func set_selected_active(p_active: bool) -> void:
	_update_visual_state(p_active)

# ==============================================================================
# INTERACTIVE HOVER ACTIONS
# ==============================================================================

func _on_hover_entered() -> void:
	if not is_read:
		return # Already highlighted
	var style_hover = style_read.duplicate() as StyleBoxFlat
	style_hover.bg_color = Color(0.12, 0.14, 0.18, 1)
	add_theme_stylebox_override("panel", style_hover)

func _on_hover_exited() -> void:
	_update_visual_state(false)

# Handles row click to trigger selection
func _gui_input(event: InputEvent) -> void:
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
		# Check if the click wasn't consumed by action buttons
		var local_pos = event.position
		var fav_rect = fav_button.get_rect()
		var del_rect = delete_button.get_rect()
		
		# Offset to layout container margins if needed, but simple check works:
		if not fav_rect.has_point(fav_button.get_parent().to_local(to_global(local_pos))) and \
		   not del_rect.has_point(delete_button.get_parent().to_local(to_global(local_pos))):
			emit_signal("selected", mail_id)

# ==============================================================================
# ACTION EMITTERS
# ==============================================================================

func _on_fav_button_pressed() -> void:
	is_favorite = not is_favorite
	_update_visual_state(false)
	emit_signal("favorite_toggled", mail_id, is_favorite)

func _on_delete_button_pressed() -> void:
	emit_signal("delete_pressed", mail_id)
