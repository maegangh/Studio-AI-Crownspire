extends VBoxContainer

# ==========================================
# CROWNSPIRE REDEEM PROMO CODE PANEL
# ==========================================
# Allows users to input promotional vouchers, processes rewards,
# and plays congratulations events.

@onready var code_input: LineEdit = %CodeInput
@onready var redeem_btn: Button = %RedeemBtn
@onready var result_lbl: Label = %ResultLabel

func _ready() -> void:
	result_lbl.text = ""
	redeem_btn.pressed.connect(_on_redeem_pressed)

func _on_redeem_pressed() -> void:
	var code = code_input.text.strip_edges()
	if code.is_empty():
		_set_result("Sovereign Scribes: Please enter a scroll code first!", false)
		return
		
	var res = SettingsManager.redeem_code(code)
	if res["success"]:
		_set_result(res["message"], true)
		code_input.text = ""
		
		# Open Celebration Popup or general alert
		var conf_scene = load("res://scenes/settings/ConfirmationPopup.tscn")
		if conf_scene:
			var popup = UIManager.open_popup(conf_scene)
			if popup:
				popup.setup("REDEEM SUCCESSFUL", res["message"])
	else:
		_set_result(res["message"], false)

func _set_result(msg: String, is_success: bool) -> void:
	result_lbl.text = msg
	if is_success:
		result_lbl.modulate = Color(0.4, 0.9, 0.65, 1.0) # Green
	else:
		result_lbl.modulate = Color(0.95, 0.35, 0.35, 1.0) # Red
		
	# Trigger slight screen shake/ui feedback
	var tween = create_tween()
	tween.tween_property(result_lbl, "scale", Vector2(1.1, 1.1), 0.1)
	tween.chain().tween_property(result_lbl, "scale", Vector2(1.0, 1.0), 0.1)
