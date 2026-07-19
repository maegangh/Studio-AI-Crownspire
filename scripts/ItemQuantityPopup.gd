extends PanelContainer
class_name ItemQuantityPopup

# ==========================================
# CROWNSPIRE ITEM QUANTITY SELECTOR POPUP
# ==========================================
# Configures a slider with step actions, min/max overrides, and emission callbacks.

signal quantity_confirmed(item_id: String, quantity: int)
signal cancelled()

@onready var title_label: Label = $Margin/VBox/TitleLabel
@onready var item_name_label: Label = $Margin/VBox/ItemNameLabel
@onready var slider: HSlider = $Margin/VBox/SliderHBox/HSlider
@onready var qty_label: Label = $Margin/VBox/QtyDisplayLabel
@onready var btn_minus: Button = $Margin/VBox/SliderHBox/BtnMinus
@onready var btn_plus: Button = $Margin/VBox/SliderHBox/BtnPlus
@onready var btn_max: Button = $Margin/VBox/BtnMax
@onready var btn_confirm: Button = $Margin/VBox/ActionsHBox/BtnConfirm
@onready var btn_cancel: Button = $Margin/VBox/ActionsHBox/BtnCancel

var current_item_id := ""
var max_quantity := 1
var current_selected := 1

func _ready() -> void:
	btn_minus.pressed.connect(_on_minus_pressed)
	btn_plus.pressed.connect(_on_plus_pressed)
	btn_max.pressed.connect(_on_max_pressed)
	btn_confirm.pressed.connect(_on_confirm_pressed)
	btn_cancel.pressed.connect(_on_cancel_pressed)
	slider.value_changed.connect(_on_slider_changed)

func setup_popup(item_id: String) -> void:
	current_item_id = item_id
	var item_def = UIManager.get_item_definition(item_id)
	if item_def.is_empty():
		hide()
		return
	
	item_name_label.text = item_def.get("name", "")
	max_quantity = UIManager.get_item_quantity(item_id)
	
	# Clamp slider limits
	slider.min_value = 1
	slider.max_value = max_quantity
	slider.step = 1
	
	# Initial value configuration
	current_selected = 1
	slider.value = 1
	_update_label()
	
	show()
	_animate_open()

func _on_slider_changed(val: float) -> void:
	current_selected = int(val)
	_update_label()

func _on_minus_pressed() -> void:
	if current_selected > 1:
		slider.value = current_selected - 1

func _on_plus_pressed() -> void:
	if current_selected < max_quantity:
		slider.value = current_selected + 1

func _on_max_pressed() -> void:
	slider.value = max_quantity

func _update_label() -> void:
	qty_label.text = "%d / %d" % [current_selected, max_quantity]

func _on_confirm_pressed() -> void:
	quantity_confirmed.emit(current_item_id, current_selected)
	_animate_close()

func _on_cancel_pressed() -> void:
	cancelled.emit()
	_animate_close()

func _animate_open() -> void:
	scale = Vector2(0.8, 0.8)
	modulate.a = 0.0
	var tween = create_tween().set_parallel(true)
	tween.tween_property(self, "scale", Vector2(1.0, 1.0), 0.25).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tween.tween_property(self, "modulate:a", 1.0, 0.2)

func _animate_close() -> void:
	var tween = create_tween().set_parallel(true)
	tween.tween_property(self, "scale", Vector2(0.85, 0.85), 0.2).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN)
	tween.tween_property(self, "modulate:a", 0.0, 0.15)
	tween.chain().tween_callback(hide)
