# ==========================================
# CROWNSPIRE REUSABLE POPUP BASE ARCHITECTURE
# ==========================================
# Filename: res://hud/scripts/BasePopup.gd
# Extends: Control
# 
# Provides a uniform visual frame matching the Crownspire premium style:
# - Semi-translucent darkened background click-shield
# - White Marble and Gold filigree bevel container
# - Animated scaling in/out with bounce curves
# - Unified signals for integration into UIManager and event logs.

class_name BasePopup
extends Control

# --- SIGNALS ---
signal opened
signal closed
signal action_triggered(action_id: String, payload: Dictionary)

# --- NODES & COMPONENTS ---
@onready var background_dim: ColorRect = get_node_or_null("BackgroundDim")
@onready var window_frame: PanelContainer = get_node_or_null("WindowFrame")
@onready var close_btn: Button = get_node_or_null("%CloseButton")
@onready var title_lbl: Label = get_node_or_null("%TitleLabel")
@onready var animation_player: AnimationPlayer = get_node_or_null("AnimationPlayer")

# --- CUSTOMIZATION PROPERTIES ---
@export var popup_title: String = "Sovereign Scroll"
@export var is_modal: bool = true
@export var close_on_dim_click: bool = true

func _ready() -> void:
	# Initial style setup and signal binds
	set_process(false)
	
	if title_lbl:
		title_lbl.text = popup_title.to_upper()
		
	if close_btn:
		close_btn.pressed.connect(close)
		
	if background_dim and close_on_dim_click:
		# Add gui_input to handle background dismissals
		background_dim.gui_input.connect(_on_background_dim_gui_input)

	# Trigger opening animation
	open()

# --- PUBLIC INTERFACE ---
func open() -> void:
	visible = true
	opened.emit()
	
	# Register in central UIManager popup depth stack if present
	var ui_mgr = get_node_or_null("/root/UIManager")
	if ui_mgr and ui_mgr.has_method("register_active_popup"):
		ui_mgr.register_active_popup(self)

	if animation_player:
		if animation_player.has_animation("open_bounce"):
			animation_player.play("open_bounce")
		else:
			_fallback_fade_in()
	else:
		_fallback_fade_in()

func close() -> void:
	closed.emit()
	
	var ui_mgr = get_node_or_null("/root/UIManager")
	if ui_mgr and ui_mgr.has_method("unregister_active_popup"):
		ui_mgr.unregister_active_popup(self)

	if animation_player:
		if animation_player.has_animation("close_fade"):
			animation_player.play("close_fade")
			await animation_player.animation_finished
		else:
			await _fallback_fade_out()
	else:
		await _fallback_fade_out()
		
	queue_free()

func set_title(new_title: String) -> void:
	popup_title = new_title
	if title_lbl:
		title_lbl.text = new_title.to_upper()

func emit_popup_action(action_name: String, details: Dictionary = {}) -> void:
	action_triggered.emit(action_name, details)
	
	# Bubble up to central UIManager
	var ui_mgr = get_node_or_null("/root/UIManager")
	if ui_mgr and ui_mgr.has_signal("popup_action_broadcasted"):
		ui_mgr.popup_action_broadcasted.emit(self.name, action_name, details)

# --- PRIVATE HELPERS ---
func _on_background_dim_gui_input(event: InputEvent) -> void:
	if event is InputEventMouseButton and event.pressed:
		if event.button_index == MOUSE_BUTTON_LEFT:
			close()

func _fallback_fade_in() -> void:
	modulate.a = 0.0
	scale = Vector2(0.9, 0.9)
	pivot_offset = size / 2.0
	
	var tween = create_tween().set_parallel(true).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tween.tween_property(self, "modulate:a", 1.0, 0.25)
	tween.tween_property(self, "scale", Vector2.ONE, 0.3)

func _fallback_fade_out() -> Signal:
	var tween = create_tween().set_parallel(true).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN)
	tween.tween_property(self, "modulate:a", 0.0, 0.2)
	tween.tween_property(self, "scale", Vector2(0.9, 0.9), 0.2)
	return tween.finished
