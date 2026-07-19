@tool
extends Label

# ==========================================
# CROWNSPIRE MONOSPACED COUNTDOWN TIMER
# ==========================================
# Avoids text jittering by utilizing monospaced spacing where possible.
# Emits timer_expired signal and shows positive active green colors until expired.

signal timer_expired

@export var remaining_seconds: float = 3600.0:
	set(val):
		remaining_seconds = max(0.0, val)
		_update_text()

@export var format_days: bool = false
@export var active_color: Color = Color(0.0627, 0.7255, 0.5059) # Success green
@export var expired_color: Color = Color(0.9373, 0.2667, 0.2667) # Danger red

var is_running: bool = true

func _ready() -> void:
	_update_text()
	if Engine.is_editor_hint():
		is_running = false

func _process(delta: float) -> void:
	if is_running and remaining_seconds > 0.0:
		remaining_seconds -= delta
		if remaining_seconds <= 0.0:
			remaining_seconds = 0.0
			is_running = false
			_on_timer_expired()
		else:
			_update_text()

func _update_text() -> void:
	var total_secs: int = int(ceil(remaining_seconds))
	
	if total_secs <= 0:
		text = "00:00:00"
		add_theme_color_override("font_color", expired_color)
		return
		
	add_theme_color_override("font_color", active_color)
	
	var secs: int = total_secs % 60
	var mins: int = (total_secs / 60) % 60
	var hrs: int = (total_secs / 3600) % 24
	var days: int = total_secs / 86400

	if format_days and days > 0:
		text = "%dd %02dh %02dm" % [days, hrs, mins]
	else:
		var grand_hrs: int = total_secs / 3600
		text = "%02d:%02d:%02d" % [grand_hrs, mins, secs]

func _on_timer_expired() -> void:
	_update_text()
	timer_expired.emit()
