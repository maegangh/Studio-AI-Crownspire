extends PanelContainer

# ==========================================
# CROWNSPIRE ALLIANCE MEMBER ITEM CONTROLLER
# ==========================================
# Manages individual alliance member visual row/card.
# Displays name, rank, power, online status and provides help triggers.

signal help_pressed(member_name: String)

@onready var name_label: Label = get_node_or_null("%MemberNameLabel")
@onready var rank_label: Label = get_node_or_null("%MemberRankLabel")
@onready var power_label: Label = get_node_or_null("%MemberPowerLabel")
@onready var status_label: Label = get_node_or_null("%StatusLabel")
@onready var help_btn: Button = get_node_or_null("%HelpButton")

var member_data: Dictionary = {}

func _ready() -> void:
	if help_btn:
		help_btn.pressed.connect(_on_help_pressed)

func init_item(data: Dictionary) -> void:
	member_data = data
	
	if name_label:
		name_label.text = data.get("name", "Vanguard Knight")
	if rank_label:
		var rank = data.get("rank", "Member")
		if typeof(rank) == TYPE_INT or typeof(rank) == TYPE_FLOAT:
			# Convert rank number to string name
			match int(rank):
				4: rank_label.text = "LEADER"
				3: rank_label.text = "OFFICER"
				2: rank_label.text = "VETERAN"
				_: rank_label.text = "MEMBER"
		else:
			rank_label.text = str(rank).to_upper()
			
	if power_label:
		power_label.text = "PWR %s" % _format_number(int(data.get("power", 0)))
		
	var is_online = data.get("is_online", false)
	if status_label:
		if is_online:
			status_label.text = "● ONLINE"
			status_label.modulate = Color(0.2, 0.9, 0.3) # Lime Green
		else:
			status_label.text = "○ LAST: " + data.get("last_online", "Unknown")
			status_label.modulate = Color(0.6, 0.6, 0.6) # Cool gray
			
	if help_btn:
		help_btn.visible = is_online
		help_btn.text = "🤝 HELP"

func _format_number(val: int) -> String:
	if val >= 1000000:
		return "%.2fM" % (val / 1000000.0)
	elif val >= 1000:
		return "%.1fK" % (val / 1000.0)
	return str(val)

func _on_help_pressed() -> void:
	help_pressed.emit(member_data.get("name", "Unknown"))
	if help_btn:
		help_btn.disabled = true
		help_btn.text = "SENT ✔"
		help_btn.modulate = Color(0.4, 0.8, 1.0) # Light blue sent look
