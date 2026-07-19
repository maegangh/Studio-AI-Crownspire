extends Control

# ==========================================
# CROWNSPIRE MAIL SEARCH BAR CONTROLLER
# ==========================================

signal search_text_changed(query: String)

@onready var search_input: LineEdit = $LineEdit
@onready var clear_btn: Button = $ClearButton
@onready var debounce_timer: Timer = $DebounceTimer

func _ready() -> void:
	search_input.text_changed.connect(_on_text_changed)
	clear_btn.pressed.connect(_on_clear_pressed)
	clear_btn.visible = false
	
	debounce_timer.timeout.connect(_on_timer_timeout)

func _on_text_changed(new_text: String) -> void:
	clear_btn.visible = new_text != ""
	
	# Reset and start the debounce timer
	debounce_timer.stop()
	debounce_timer.start(0.25) # 250ms delay for premium typing flow

func _on_timer_timeout() -> void:
	search_text_changed.emit(search_input.text.strip_edges())

func _on_clear_pressed() -> void:
	search_input.text = ""
	clear_btn.visible = false
	debounce_timer.stop()
	search_text_changed.emit("")
