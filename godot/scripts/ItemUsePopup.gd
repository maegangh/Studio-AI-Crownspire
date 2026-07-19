extends PanelContainer
class_name ItemUsePopup

# ==========================================
# CROWNSPIRE ITEM USE POPUP
# ==========================================
# Manages final confirmation screens before a valuable item is used.

signal use_confirmed(item_id: String)
signal cancelled()

@onready var title_label: Label = $Margin/VBox/Title
@onready var desc_label: Label = $Margin/VBox/Description
@onready var btn_confirm: Button = $Margin/VBox/Buttons/BtnConfirm
@onready var btn_cancel: Button = $Margin/VBox/Buttons/BtnCancel

var current_item_id := ""

func _ready() -> void:
	btn_confirm.pressed.connect(_on_confirm)
	btn_cancel.pressed.connect(_on_cancel)

func setup_confirmation(item_id: String) -> void:
	current_item_id = item_id
	var item_def = UIManager.get_item_definition(item_id)
	if item_def.is_empty():
		hide()
		return
	
	title_label.text = "CONFIRM ITEM USE"
	desc_label.text = "Are you absolutely sure you want to activate:\n\n[color=gold]%s[/color]\n\nThis will initiate immediate, irreversible alchemical effects on your citadel." % item_def.get("name", "")
	
	show()
	_animate_open()

func _on_confirm() -> void:
	use_confirmed.emit(current_item_id)
	_animate_close()

func _on_cancel() -> void:
	cancelled.emit()
	_animate_close()

func _animate_open() -> void:
	scale = Vector2(0.85, 0.85)
	modulate.a = 0.0
	var tween = create_tween().set_parallel(true)
	tween.tween_property(self, "scale", Vector2(1.0, 1.0), 0.22).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tween.tween_property(self, "modulate:a", 1.0, 0.18)

func _animate_close() -> void:
	var tween = create_tween().set_parallel(true)
	tween.tween_property(self, "scale", Vector2(0.9, 0.9), 0.18).set_trans(Tween.TRANS_SINE)
	tween.tween_property(self, "modulate:a", 0.0, 0.15)
	tween.chain().tween_callback(queue_free)
