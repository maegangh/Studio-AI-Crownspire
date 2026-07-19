extends Control

# ==========================================
# CROWNSPIRE ALLIANCE RALLY CREATION POPUP
# ==========================================

signal closed()

@onready var close_btn: Button = $Popup/BtnClose
@onready var create_btn: Button = $Popup/BtnCreate
@onready var target_input: LineEdit = $Popup/TargetInput
@onready var timer_options: OptionButton = $Popup/TimerOptions

func _ready() -> void:
	close_btn.pressed.connect(_on_close_pressed)
	create_btn.pressed.connect(_on_create_pressed)
	
	# Pre-populate dropdown
	if timer_options:
		timer_options.clear()
		timer_options.add_item("⏳ 5 Minutes Preparation", 5)
		timer_options.add_item("⏳ 10 Minutes Preparation", 10)
		timer_options.add_item("⏳ 30 Minutes Preparation", 30)
		timer_options.add_item("⏳ 60 Minutes Preparation", 60)
		timer_options.selected = 0

func _on_close_pressed() -> void:
	closed.emit()
	queue_free()

func _on_create_pressed() -> void:
	var target = target_input.text.strip_edges()
	if target == "":
		target = "Savage Crystallite Titan" # Default epic target
		
	var selected_id = timer_options.get_selected_id()
	var duration_str = str(selected_id) + "m 00s"
	
	var success = UIManager.create_alliance_rally(target, duration_str)
	if success:
		_on_close_pressed()
