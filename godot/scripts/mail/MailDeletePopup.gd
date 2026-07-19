extends Control

# ==========================================
# CROWNSPIRE MAIL DELETE CONFIRMATION POPUP
# ==========================================

@onready var container: PanelContainer = %PopupContainer
@onready var title_label: Label = %PopupTitle
@onready var desc_label: Label = %PopupDescription

@onready var confirm_btn: Button = %ConfirmButton
@onready var cancel_btn: Button = %CancelButton

var _on_confirm_callback: Callable

func _ready() -> void:
	cancel_btn.pressed.connect(_on_cancel_pressed)
	confirm_btn.pressed.connect(_on_confirm_pressed)
	
	# Entrance animation
	container.scale = Vector2(0.8, 0.8)
	var tween = create_tween()
	tween.tween_property(container, "scale", Vector2.ONE, 0.2).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)

func setup_for_single(mail_id: String, on_confirm: Callable) -> void:
	title_label.text = "Delete Message"
	desc_label.text = "Are you sure you want to permanently delete this message from your Citadel inbox?\n\nThis action cannot be undone."
	_on_confirm_callback = on_confirm

func setup_for_bulk(category_id: String, on_confirm: Callable) -> void:
	var cat_name = "this category"
	if category_id == "all": cat_name = "your inbox"
	elif category_id == "system": cat_name = "System messages"
	elif category_id == "battle": cat_name = "Battle reports"
	elif category_id == "alliance": cat_name = "Alliance logs"
	elif category_id == "event": cat_name = "Event awards"
	
	title_label.text = "Clear Read Messages"
	desc_label.text = "Are you sure you want to permanently delete ALL READ messages in %s?\n\nMessages with unclaimed attachments will not be deleted." % cat_name
	_on_confirm_callback = on_confirm

func _on_confirm_pressed() -> void:
	if _on_confirm_callback.is_valid():
		_on_confirm_callback.call()
		
	# Quick close tween
	var tween = create_tween()
	tween.tween_property(self, "modulate:a", 0.0, 0.15)
	await tween.finished
	queue_free()

func _on_cancel_pressed() -> void:
	var tween = create_tween()
	tween.tween_property(self, "modulate:a", 0.0, 0.12)
	await tween.finished
	queue_free()
