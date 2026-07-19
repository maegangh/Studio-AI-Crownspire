extends Control

# ==========================================
# CROWNSPIRE ALLIANCE MEMBER CARD
# ==========================================

@onready var name_label: Label = %NameLabel
@onready var rank_label: Label = %RankLabel
@onready var power_label: Label = %PowerLabel
@onready var status_label: Label = %StatusLabel

# Management controls
@onready var management_box: HBoxContainer = %ManagementBox
@onready var btn_promote: Button = %BtnPromote
@onready var btn_demote: Button = %BtnDemote
@onready var btn_kick: Button = %BtnKick

var member_name: String = ""

func setup_card(data: Dictionary, viewer_rank: int) -> void:
	member_name = data.get("name", "")
	name_label.text = member_name
	
	# Determine Rank Label & Color
	var rank = int(data.get("rank", 1))
	match rank:
		4:
			rank_label.text = "👑 Leader"
			rank_label.modulate = Color("#ffd700")
		3:
			rank_label.text = "🛡️ Officer"
			rank_label.modulate = Color("#3bf7ad")
		2:
			rank_label.text = "⚔️ Senior"
			rank_label.modulate = Color("#a3c2e0")
		_:
			rank_label.text = "👤 Member"
			rank_label.modulate = Color("#c4d1db")
			
	# Formatting power
	var power_int = int(data.get("power", 0))
	var power_str = ""
	if power_int >= 1000000:
		power_str = "%.2fM" % (float(power_int) / 1000000.0)
	elif power_int >= 1000:
		power_str = "%.1fK" % (float(power_int) / 1000.0)
	else:
		power_str = str(power_int)
		
	power_label.text = "Power: " + power_str
	
	# Status Indicator
	var online = data.get("is_online", false)
	if online:
		status_label.text = "🟢 Online"
		status_label.modulate = Color("#3bf7ad")
	else:
		status_label.text = "🔴 " + data.get("last_online", "Offline")
		status_label.modulate = Color("#a0a0a0")
		
	# Setup administrative controls:
	# Viewer must be higher rank than target, and viewer must be Officer (3) or Leader (4)
	var can_manage = (viewer_rank > rank) and (viewer_rank >= 3) and (member_name != UIManager.player_name)
	management_box.visible = can_manage
	
	if can_manage:
		# Promote button is enabled if target rank is less than Officer (3)
		btn_promote.visible = (rank < 3)
		# Demote button is enabled if target rank is greater than standard Member (1)
		btn_demote.visible = (rank > 1)
		
		# Hook connections (use disconnect first to avoid duplicates in recycled panels)
		if btn_promote.pressed.is_connected(_on_promote): btn_promote.pressed.disconnect(_on_promote)
		if btn_demote.pressed.is_connected(_on_demote): btn_demote.pressed.disconnect(_on_demote)
		if btn_kick.pressed.is_connected(_on_kick): btn_kick.pressed.disconnect(_on_kick)
		
		btn_promote.pressed.connect(_on_promote)
		btn_demote.pressed.connect(_on_demote)
		btn_kick.pressed.connect(_on_kick)

func _on_promote() -> void:
	UIManager.promote_alliance_member(member_name)

func _on_demote() -> void:
	UIManager.demote_alliance_member(member_name)

func _on_kick() -> void:
	UIManager.kick_alliance_member(member_name)
