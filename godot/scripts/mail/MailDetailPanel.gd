extends Control

# ==========================================
# CROWNSPIRE MAIL DETAIL EXPANDED VIEWER
# ==========================================

signal mail_action_triggered(action_name: String, mail_id: String)

@onready var title_label: Label = %DetailTitle
@onready var sender_label: Label = %DetailSender
@onready var date_label: Label = %DetailDate
@onready var expiry_label: Label = %DetailExpiry
@onready var body_text: RichTextLabel = %DetailBodyText

# Battle Report custom containers
@onready var battle_report_panel: PanelContainer = %BattleReportPanel
@onready var combat_outcome_label: Label = %CombatOutcomeLabel
@onready var win_decor: Panel = %WinDecor
@onready var lose_decor: Panel = %LoseDecor
@onready var stats_winner_val: Label = %StatsWinnerVal
@onready var stats_loser_val: Label = %StatsLoserVal
@onready var stats_coords_val: Label = %StatsCoordsVal
@onready var stats_my_power_val: Label = %StatsMyPowerVal
@onready var stats_enemy_power_val: Label = %StatsEnemyPowerVal
@onready var stats_my_losses_val: Label = %StatsMyLossesVal
@onready var stats_enemy_losses_val: Label = %StatsEnemyLossesVal
@onready var stats_plunder_val: Label = %StatsPlunderVal

# Attachment controllers
@onready var attachment_container: Control = %MailAttachmentPanel

# Action Buttons
@onready var back_btn: Button = %DetailBackButton
@onready var claim_btn: Button = %DetailClaimButton
@onready var delete_btn: Button = %DetailDeleteButton

var _current_mail_data := {}

func _ready() -> void:
	back_btn.pressed.connect(func(): mail_action_triggered.emit("close", _current_mail_data["id"]))
	delete_btn.pressed.connect(func(): mail_action_triggered.emit("delete", _current_mail_data["id"]))
	claim_btn.pressed.connect(func(): mail_action_triggered.emit("claim", _current_mail_data["id"]))

func display_mail(mail_data: Dictionary) -> void:
	_current_mail_data = mail_data
	
	# Set basic header parameters
	title_label.text = mail_data.get("title", "Crownspire Scroll")
	sender_label.text = "From: " + mail_data.get("sender", "Courier Guild")
	date_label.text = MailManager.format_timestamp(int(mail_data.get("timestamp", 0)))
	expiry_label.text = MailManager.get_expiry_string(int(mail_data.get("expiry_timestamp", 0)))
	
	# Set message text body
	body_text.text = mail_data.get("body", "")
	
	# Handle dynamic attachments display
	var attachments = mail_data.get("attachments", []) as Array
	if attachments.size() > 0:
		attachment_container.visible = true
		attachment_container.setup_attachments(attachments, mail_data.get("claimed", false))
		
		# Only show Claim Button if NOT already claimed!
		claim_btn.visible = true
		claim_btn.disabled = mail_data.get("claimed", false)
		if claim_btn.disabled:
			claim_btn.text = "Claimed ✔"
		else:
			claim_btn.text = "Claim Rewards"
	else:
		attachment_container.visible = false
		claim_btn.visible = false
		
	# Handle rich Battle Report data configurations
	var category_id = mail_data.get("category_id", "")
	if category_id == "battle" and mail_data.has("battle_info") and not mail_data["battle_info"].is_empty():
		battle_report_panel.visible = true
		_populate_battle_details(mail_data["battle_info"] as Dictionary)
	else:
		battle_report_panel.visible = false
		
	# Smooth fade-in presentation of details panel
	modulate.a = 0.0
	var tween = create_tween()
	tween.tween_property(self, "modulate:a", 1.0, 0.15)

func _populate_battle_details(b_info: Dictionary) -> void:
	var b_type = b_info.get("type", "wildling")
	var winner = b_info.get("winner", "")
	var loser = b_info.get("loser", "")
	
	var is_victory = winner == UIManager.player_name
	
	# Outcome label styling
	if is_victory:
		combat_outcome_label.text = "VICTORY"
		combat_outcome_label.self_modulate = Color(0.4, 1.0, 0.5, 1.0) # Radiant lime green
		win_decor.visible = true
		lose_decor.visible = false
	else:
		combat_outcome_label.text = "DEFEAT"
		combat_outcome_label.self_modulate = Color(1.0, 0.35, 0.35, 1.0) # Angry blood red
		win_decor.visible = false
		lose_decor.visible = true
		
	# Populate stats labels
	stats_winner_val.text = winner
	stats_loser_val.text = loser
	stats_coords_val.text = b_info.get("coordinates", "N/A")
	
	stats_my_power_val.text = _format_abbreviated(b_info.get("my_power", 0))
	stats_enemy_power_val.text = _format_abbreviated(b_info.get("enemy_power", 0))
	
	stats_my_losses_val.text = str(b_info.get("my_troop_losses", 0))
	stats_enemy_losses_val.text = str(b_info.get("enemy_troop_losses", 0))
	
	# Populate gathered plundered resources strings
	var plundered = b_info.get("resources_gained", {}) as Dictionary
	if plundered.is_empty():
		stats_plunder_val.text = "No raw resources plundered"
	else:
		var plunder_strings := []
		for key in plundered:
			var qty = plundered[key]
			plunder_strings.append("+%s %s" % [_format_abbreviated(qty), key.capitalize()])
		stats_plunder_val.text = ", ".join(plunder_strings)

func _format_abbreviated(num: float) -> String:
	if num >= 1000000.0:
		return "%.1fM" % (num / 1000000.0)
	elif num >= 1000.0:
		return "%.1fK" % (num / 1000.0)
	else:
		return str(int(num))
