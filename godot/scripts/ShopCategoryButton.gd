@tool
extends MarginContainer

# ==========================================
# CROWNSPIRE SHOP CATEGORY TAB BUTTON CONTROLLER
# ==========================================
# Individual vertical/horizontal tab button.
# Features active scaling overlays, crystal highlights, and red notifications.

signal category_selected(category_id: String)

@export var category_id: String = "featured":
	set(val):
		category_id = val
		_update_labels()

@export var category_name: String = "Featured":
	set(val):
		category_name = val
		_update_labels()

@export var icon_texture: Texture2D:
	set(val):
		icon_texture = val
		if is_node_ready() and %IconRect:
			%IconRect.texture = icon_texture

@export var is_selected: bool = false:
	set(val):
		is_selected = val
		_update_selection_visual()

@export var show_badge: bool = false:
	set(val):
		show_badge = val
		if is_node_ready() and %BadgeRect:
			%BadgeRect.visible = show_badge

@onready var label: Label = %LabelName
@onready var button: TextureButton = %BaseButton
@onready var active_glow: TextureRect = %ActiveGlowRect
@onready var anim_player: AnimationPlayer = $AnimationPlayer

func _ready() -> void:
	_update_labels()
	_update_selection_visual()
	
	if not Engine.is_editor_hint():
		button.pressed.connect(_on_button_pressed)
		button.mouse_entered.connect(_on_mouse_entered)
		button.mouse_exited.connect(_on_mouse_exited)

func _update_labels() -> void:
	if is_node_ready():
		if label: label.text = category_name.to_upper()
		if %IconRect and icon_texture: %IconRect.texture = icon_texture

func _update_selection_visual() -> void:
	if not is_node_ready():
		return
		
	# Adjust textures and tints for chosen state
	if is_selected:
		if active_glow: active_glow.visible = true
		if label: label.add_theme_color_override("font_color", Color(1.0, 0.84, 0.0)) # Sovereign gold
		if anim_player and anim_player.has_animation("select_pulse") and not Engine.is_editor_hint():
			anim_player.play("select_pulse")
	else:
		if active_glow: active_glow.visible = false
		if label: label.add_theme_color_override("font_color", Color(0.77, 0.82, 0.90)) # Royal Silver

func _on_button_pressed() -> void:
	if not is_selected:
		category_selected.emit(category_id)
		if anim_player and anim_player.has_animation("click_scale"):
			anim_player.play("click_scale")

func _on_mouse_entered() -> void:
	if not is_selected and anim_player and anim_player.has_animation("hover_scale"):
		anim_player.play("hover_scale")

func _on_mouse_exited() -> void:
	if not is_selected and anim_player:
		anim_player.play("RESET")
