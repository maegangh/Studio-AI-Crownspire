extends PanelContainer

# ==========================================
# CROWNSPIRE SETTINGS SCREEN OVERLAY
# ==========================================
# Manages the primary settings menu hub. Links category buttons to their
# respective panels, handles smooth back-and-forth slide animations,
# and integrates directly with the UIManager stack.

@onready var close_btn: Button = %CloseButton
@onready var sub_panel_container: PanelContainer = %SubPanelContainer
@onready var main_list_scroll: ScrollContainer = %MainListScroll
@onready var back_btn: Button = %BackButton
@onready var title_label: Label = %TitleLabel

# Preload settings sub-panels
@export var audio_panel_scene: PackedScene = preload("res://scenes/settings/AudioSettingsPanel.tscn")
@export var graphics_panel_scene: PackedScene = preload("res://scenes/settings/GraphicsSettingsPanel.tscn")
@export var gameplay_panel_scene: PackedScene = preload("res://scenes/settings/GameplaySettingsPanel.tscn")
@export var notification_panel_scene: PackedScene = preload("res://scenes/settings/NotificationSettingsPanel.tscn")
@export var language_panel_scene: PackedScene = preload("res://scenes/settings/LanguageSettingsPanel.tscn")
@export var account_panel_scene: PackedScene = preload("res://scenes/settings/AccountSettingsPanel.tscn")
@export var privacy_panel_scene: PackedScene = preload("res://scenes/settings/PrivacySettingsPanel.tscn")
@export var support_panel_scene: PackedScene = preload("res://scenes/settings/SupportPanel.tscn")
@export var redeem_panel_scene: PackedScene = preload("res://scenes/settings/RedeemCodePanel.tscn")
@export var credits_panel_scene: PackedScene = preload("res://scenes/settings/CreditsPanel.tscn")
@export var about_panel_scene: PackedScene = preload("res://scenes/settings/AboutPanel.tscn")

var active_sub_panel: Control = null

func _ready() -> void:
	close_btn.pressed.connect(_on_close_pressed)
	back_btn.pressed.connect(_on_back_pressed)
	back_btn.visible = false
	sub_panel_container.visible = false
	
	# Connect category buttons
	%AudioBtn.pressed.connect(func(): _open_sub_panel(audio_panel_scene, "AUDIO PREFERENCES"))
	%GraphicsBtn.pressed.connect(func(): _open_sub_panel(graphics_panel_scene, "GRAPHICS SETTINGS"))
	%GameplayBtn.pressed.connect(func(): _open_sub_panel(gameplay_panel_scene, "GAMEPLAY CONFIG"))
	%NotificationsBtn.pressed.connect(func(): _open_sub_panel(notification_panel_scene, "NOTIFICATIONS"))
	%LanguageBtn.pressed.connect(func(): _open_sub_panel(language_panel_scene, "LANGUAGE SELECTION"))
	%AccountBtn.pressed.connect(func(): _open_sub_panel(account_panel_scene, "ACCOUNT LINKING"))
	%PrivacyBtn.pressed.connect(func(): _open_sub_panel(privacy_panel_scene, "PRIVACY OPTIONS"))
	%SupportBtn.pressed.connect(func(): _open_sub_panel(support_panel_scene, "HELP & SUPPORT"))
	%RedeemBtn.pressed.connect(func(): _open_sub_panel(redeem_panel_scene, "REDEEM PROMO CODE"))
	%CreditsBtn.pressed.connect(func(): _open_sub_panel(credits_panel_scene, "SCROLL OF CREDITS"))
	%AboutBtn.pressed.connect(func(): _open_sub_panel(about_panel_scene, "ABOUT CROWNSPIRE"))

func _on_close_pressed() -> void:
	UIManager.close_popup(self)

func _open_sub_panel(panel_scene: PackedScene, title_text: String) -> void:
	if not panel_scene:
		push_error("[SettingsScreen] Null PackedScene loaded.")
		return
		
	# Clean up current panel if any
	if active_sub_panel and is_instance_valid(active_sub_panel):
		active_sub_panel.queue_free()
		active_sub_panel = null
		
	# Instantiate and add to sub_panel_container
	active_sub_panel = panel_scene.instantiate() as Control
	sub_panel_container.add_child(active_sub_panel)
	
	title_label.text = title_text
	back_btn.visible = true
	close_btn.visible = false
	
	# Slide main list out, slide sub panel in
	sub_panel_container.visible = true
	sub_panel_container.modulate.a = 0.0
	sub_panel_container.position.x = 200 # Offset right
	
	var tween = create_tween().set_parallel(true)
	tween.tween_property(main_list_scroll, "position:x", -200.0, 0.25).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	tween.tween_property(main_list_scroll, "modulate:a", 0.0, 0.25)
	tween.tween_property(sub_panel_container, "position:x", 0.0, 0.25).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	tween.tween_property(sub_panel_container, "modulate:a", 1.0, 0.25)
	
	await tween.finished
	main_list_scroll.visible = false

func _on_back_pressed() -> void:
	if not active_sub_panel:
		return
		
	title_label.text = "⚙️ SOVEREIGN SETTINGS"
	back_btn.visible = false
	close_btn.visible = true
	main_list_scroll.visible = true
	
	# Slide main list back in, slide sub panel out
	var tween = create_tween().set_parallel(true)
	tween.tween_property(main_list_scroll, "position:x", 0.0, 0.25).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	tween.tween_property(main_list_scroll, "modulate:a", 1.0, 0.25)
	tween.tween_property(sub_panel_container, "position:x", 200.0, 0.25).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	tween.tween_property(sub_panel_container, "modulate:a", 0.0, 0.25)
	
	await tween.finished
	sub_panel_container.visible = false
	if active_sub_panel and is_instance_valid(active_sub_panel):
		active_sub_panel.queue_free()
		active_sub_panel = null
