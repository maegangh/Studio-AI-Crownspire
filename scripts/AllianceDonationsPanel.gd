extends Control

# ==========================================
# CROWNSPIRE ALLIANCE DONATIONS PANEL (POPUP)
# ==========================================

signal closed()

@onready var title_lbl: Label = $Popup/Title
@onready var icon_lbl: Label = $Popup/Icon
@onready var desc_lbl: Label = $Popup/Description
@onready var progress_bar: ProgressBar = $Popup/Progress
@onready var progress_lbl: Label = $Popup/ProgressLabel

@onready var option_1_btn: Button = $Popup/Bundles/Opt1
@onready var option_2_btn: Button = $Popup/Bundles/Opt2
@onready var option_3_btn: Button = $Popup/Bundles/Opt3

@onready var close_btn: Button = $Popup/BtnClose

var active_tech: Dictionary = {}
var req_res: String = ""

func _ready() -> void:
	close_btn.pressed.connect(_on_close_pressed)
	
	option_1_btn.pressed.connect(func(): _execute_donation(10000))
	option_2_btn.pressed.connect(func(): _execute_donation(50000))
	option_3_btn.pressed.connect(func(): _execute_donation(250000))

func _on_close_pressed() -> void:
	closed.emit()
	queue_free()

func setup_donation(tech: Dictionary) -> void:
	active_tech = tech
	req_res = tech.get("req_resource_type", "wood")
	
	title_lbl.text = "🧪 CONTRIBUTE: " + tech.get("name", "")
	icon_lbl.text = tech.get("icon", "⏳")
	desc_lbl.text = tech.get("description", "")
	
	_refresh_data()

func _refresh_data() -> void:
	var current = int(active_tech.get("current_donation", 0))
	var max_don = int(active_tech.get("max_donation", 100))
	
	progress_bar.max_value = float(max_don)
	progress_bar.value = float(current)
	progress_lbl.text = "Contribution: %d / %d" % [current, max_don]
	
	# Stylize buttons based on resource requirement
	var res_symbol = _get_resource_emoji(req_res)
	var player_balance = UIManager.get_resource_value(req_res)
	
	option_1_btn.text = "⚜️ Bronze Gift\nDonate: 10K %s\n(Owns: %s)" % [res_symbol, _format_number(player_balance)]
	option_2_btn.text = "🛡️ Silver Gift\nDonate: 50K %s\n(Owns: %s)" % [res_symbol, _format_number(player_balance)]
	option_3_btn.text = "👑 Golden Gift\nDonate: 250K %s\n(Owns: %s)" % [res_symbol, _format_number(player_balance)]
	
	# Disable buttons if balance is too low
	option_1_btn.disabled = (player_balance < 10000)
	option_2_btn.disabled = (player_balance < 50000)
	option_3_btn.disabled = (player_balance < 250000)

func _execute_donation(amount: int) -> void:
	var success = UIManager.donate_to_alliance_tech(active_tech["id"], amount)
	if success:
		_refresh_data()
	else:
		print("[Crownspire Donations] Failed to complete donation.")

func _get_resource_emoji(res_type: String) -> String:
	match res_type:
		"gold": return "🪙"
		"food": return "🌾"
		"wood": return "🪵"
		"stone": return "🪨"
		"iron": return "⛓️"
		"royal_crystal": return "💎"
		"aurora_crystal": return "🔮"
	return "🪵"

func _format_number(val: int) -> String:
	if val >= 1000000:
		return "%.1fM" % (float(val) / 1000000.0)
	elif val >= 1000:
		return "%.1fK" % (float(val) / 1000.0)
	return str(val)
