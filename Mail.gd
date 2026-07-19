# ==============================================================================
# Crownspire MMO Strategy Game - Mail System Controller
# Godot 4 / GDScript 2.0 Client-side persistent mailbox
# ==============================================================================
# Handles categories (Inbox, Battle, Alliance, System, Favorites), unread badges,
# full search, custom attachments, claim all, and detail view reporting logic.
# ==============================================================================

extends Control

# --- Constant Save Location ---
const SAVE_FILE_PATH = "user://crownspire_mailbox_v1.save"

# --- Categories ---
const TABS = [
	"Inbox",
	"Battle Reports",
	"Alliance Mail",
	"System Mail",
	"Favorites"
]

# --- Onready Nodes ---
@onready var search_edit: LineEdit = $Layout/Header/MarginContainer/HBoxContainer/SearchEdit
@onready var close_button: Button = $Layout/Header/MarginContainer/HBoxContainer/CloseButton
@onready var tab_box: HBoxContainer = $Layout/TabScroll/TabBox
@onready var mail_list: VBoxContainer = $Layout/MainPanel/HSplit/LeftListContainer/ListScroll/MailList
@onready var delete_read_button: Button = $Layout/MainPanel/HSplit/LeftListContainer/ListFooter/DeleteReadButton
@onready var claim_all_button: Button = $Layout/MainPanel/HSplit/LeftListContainer/ListFooter/ClaimAllButton

# --- Right-Side Details Panel ---
@onready var empty_state: CenterContainer = $Layout/MainPanel/HSplit/RightDetailContainer/EmptyState
@onready var message_detail_view: VBoxContainer = $Layout/MainPanel/HSplit/RightDetailContainer/MessageDetailView
@onready var detail_subject_label: Label = $Layout/MainPanel/HSplit/RightDetailContainer/MessageDetailView/DetailMargin/VBox/MessageHeader/SenderBox/SubjectLabel
@onready var detail_sender_date_label: Label = $Layout/MainPanel/HSplit/RightDetailContainer/MessageDetailView/DetailMargin/VBox/MessageHeader/SenderBox/SenderAndDateLabel
@onready var single_delete_button: Button = $Layout/MainPanel/HSplit/RightDetailContainer/MessageDetailView/DetailMargin/VBox/MessageHeader/SingleDeleteButton
@onready var body_text_label: RichTextLabel = $Layout/MainPanel/HSplit/RightDetailContainer/MessageDetailView/DetailMargin/VBox/DetailScroll/ScrollContent/BodyTextLabel

# --- Battle Report Blocks ---
@onready var battle_report_panel: PanelContainer = $Layout/MainPanel/HSplit/RightDetailContainer/MessageDetailView/DetailMargin/VBox/DetailScroll/ScrollContent/BattleReportPanel
@onready var battle_banner: PanelContainer = $Layout/MainPanel/HSplit/RightDetailContainer/MessageDetailView/DetailMargin/VBox/DetailScroll/ScrollContent/BattleReportPanel/VBox/Banner
@onready var battle_banner_label: Label = $Layout/MainPanel/HSplit/RightDetailContainer/MessageDetailView/DetailMargin/VBox/DetailScroll/ScrollContent/BattleReportPanel/VBox/Banner/BannerLabel
@onready var my_losses_lbl: Label = $Layout/MainPanel/HSplit/RightDetailContainer/MessageDetailView/DetailMargin/VBox/DetailScroll/ScrollContent/BattleReportPanel/VBox/StatsGrid/MyLosses
@onready var enemy_losses_lbl: Label = $Layout/MainPanel/HSplit/RightDetailContainer/MessageDetailView/DetailMargin/VBox/DetailScroll/ScrollContent/BattleReportPanel/VBox/StatsGrid/EnemyLosses
@onready var my_power_lbl: Label = $Layout/MainPanel/HSplit/RightDetailContainer/MessageDetailView/DetailMargin/VBox/DetailScroll/ScrollContent/BattleReportPanel/VBox/StatsGrid/MyPower
@onready var enemy_power_lbl: Label = $Layout/MainPanel/HSplit/RightDetailContainer/MessageDetailView/DetailMargin/VBox/DetailScroll/ScrollContent/BattleReportPanel/VBox/StatsGrid/EnemyPower

# --- Alliance Help Blocks ---
@onready var alliance_help_panel: PanelContainer = $Layout/MainPanel/HSplit/RightDetailContainer/MessageDetailView/DetailMargin/VBox/DetailScroll/ScrollContent/AllianceHelpPanel
@onready var alliance_help_desc: Label = $Layout/MainPanel/HSplit/RightDetailContainer/MessageDetailView/DetailMargin/VBox/DetailScroll/ScrollContent/AllianceHelpPanel/VBox/HelpDesc

# --- Attachment UI Blocks ---
@onready var attachment_container: PanelContainer = $Layout/MainPanel/HSplit/RightDetailContainer/MessageDetailView/DetailMargin/VBox/AttachmentContainer
@onready var attachment_grid: HBoxContainer = $Layout/MainPanel/HSplit/RightDetailContainer/MessageDetailView/DetailMargin/VBox/AttachmentContainer/Margin/HBox/VBox/Grid
@onready var claim_button: Button = $Layout/MainPanel/HSplit/RightDetailContainer/MessageDetailView/DetailMargin/VBox/AttachmentContainer/Margin/HBox/ClaimButton

# --- Toast System ---
@onready var toast_notification: PanelContainer = $ToastNotification
@onready var toast_label: Label = $ToastNotification/ToastLabel

# --- Internal State ---
var _mailbox: Array = []           # Array of Dictionary messages
var _active_tab: String = "Inbox"
var _selected_mail_id: String = ""
var _toast_timer: Timer

# ==============================================================================
# LIFECYCLE CALLBACKS
# ==============================================================================

func _ready() -> void:
	print("[Mail] Booting kingdom message boards...")
	
	# Configure toast clock
	_toast_timer = Timer.new()
	_toast_timer.one_shot = true
	_toast_timer.wait_time = 2.5
	_toast_timer.timeout.connect(_on_toast_timeout)
	add_child(_toast_timer)
	
	# Load or bootstrap profile data
	_load_mailbox_from_disk()
	
	# Draw navigation tabs
	_setup_category_tabs()
	
	# Connect search and controls
	search_edit.text_changed.connect(_on_search_changed)
	close_button.pressed.connect(_on_mail_closed)
	delete_read_button.pressed.connect(_on_delete_all_read_pressed)
	claim_all_button.pressed.connect(_on_claim_all_pressed)
	
	# Connect right pane interactions
	single_delete_button.pressed.connect(_on_single_delete_pressed)
	claim_button.pressed.connect(_on_single_claim_pressed)
	
	# Draw active listing
	_refresh_mail_list_ui()

# ==============================================================================
# LOCAL STORAGE PERSISTENCE
# ==============================================================================

func _load_mailbox_from_disk() -> void:
	if not FileAccess.file_exists(SAVE_FILE_PATH):
		_populate_starter_mailbox()
		return
		
	var file = FileAccess.open(SAVE_FILE_PATH, FileAccess.READ)
	if not file:
		_populate_starter_mailbox()
		return
		
	var content = file.get_as_text()
	file.close()
	
	var json = JSON.new()
	var error = json.parse(content)
	if error != OK:
		push_error("[Mail] Mail save state corrupted. Resetting inbox.")
		_populate_starter_mailbox()
		return
		
	var array_data = json.get_data()
	if typeof(array_data) == TYPE_ARRAY:
		_mailbox = array_data
		print("[Mail] Loaded %d communications securely." % _mailbox.size())
	else:
		_populate_starter_mailbox()

func _save_mailbox_to_disk() -> void:
	var file = FileAccess.open(SAVE_FILE_PATH, FileAccess.WRITE)
	if not file:
		push_error("[Mail] Failed to open save location to update mailbox.")
		return
		
	var json_string = JSON.stringify(_mailbox)
	file.store_string(json_string)
	file.close()

## Pre-populates clean MMO style battle, system, and alliance notifications
func _populate_starter_mailbox() -> void:
	print("[Mail] Loading starter letters from Crownspire Citadel.")
	_mailbox = [
		# 1. Rally Battle Report
		{
			"id": "battle_rally_report_01",
			"category": "battle",
			"subcategory": "rally",
			"sender": "Grand Marshal",
			"subject": "Rally Victory: Level 15 Elite Wildling Fort",
			"timestamp": "2 Hours Ago",
			"body": "General, our coordinated Alliance rally was an absolute victory. The Level 15 Wildling Fort has been reduced to rubble! Our frontline vanguard absorbed the impact, allowing the archers to flank their commanders.",
			"is_read": false,
			"is_favorite": false,
			"has_battle_report": true,
			"battle_details": {
				"is_victory": true,
				"report_type": "Rally Operation",
				"my_losses": 145,
				"enemy_losses": 2400,
				"my_power_loss": 725,
				"enemy_power_loss": 12000
			},
			"has_attachments": true,
			"attachments_claimed": false,
			"attachments": [
				{"type": "resource", "id": "food", "amount": 100000, "emoji": "🍖"},
				{"type": "resource", "id": "diamonds", "amount": 250, "emoji": "💎"},
				{"type": "shard", "id": "valkyrie_hero_shard", "amount": 3, "emoji": "🎖️"}
			]
		},
		# 2. Wildling Attack
		{
			"id": "battle_wild_report_02",
			"category": "battle",
			"subcategory": "wildling",
			"sender": "Border Patrol Sentinel",
			"subject": "Scout Report: Giant Patrol Ambush",
			"timestamp": "5 Hours Ago",
			"body": "Sentry unit was ambushed by Wildling Giants near the Southern Pass. We recommend sending a high-level cavalry hero with ranged backlines to clear the area.",
			"is_read": false,
			"is_favorite": false,
			"has_battle_report": true,
			"battle_details": {
				"is_victory": false,
				"report_type": "Skirmish Defense",
				"my_losses": 840,
				"enemy_losses": 150,
				"my_power_loss": 4200,
				"enemy_power_loss": 750
			},
			"has_attachments": false
		},
		# 3. March Report
		{
			"id": "battle_march_report_03",
			"category": "battle",
			"subcategory": "march",
			"sender": "Cavalry Gatherer",
			"subject": "Harvest Complete: Level 5 Lumber Woods",
			"timestamp": "1 Day Ago",
			"body": "Your logistics brigade has returned fully laden with logs from the Level 5 timber forests. No enemy raiders spotted during the shift.",
			"is_read": true,
			"is_favorite": false,
			"has_battle_report": true,
			"battle_details": {
				"is_victory": true,
				"report_type": "Logistics Dispatch",
				"my_losses": 0,
				"enemy_losses": 0,
				"my_power_loss": 0,
				"enemy_power_loss": 0
			},
			"has_attachments": true,
			"attachments_claimed": false,
			"attachments": [
				{"type": "resource", "id": "wood", "amount": 150000, "emoji": "🪵"}
			]
		},
		# 4. System rewards
		{
			"id": "sys_reward_pack_04",
			"category": "system",
			"sender": "Citadel Overseer",
			"subject": "System Maintenance Compensation Update",
			"timestamp": "1 Day Ago",
			"body": "Warm greetings, Sovereign. We have deployed patch v1.2.4 to optimize Alliance gathering speeds. Please accept this supply pack for the momentary disruption of server logs.",
			"is_read": false,
			"is_favorite": true,
			"has_attachments": true,
			"attachments_claimed": false,
			"attachments": [
				{"type": "resource", "id": "diamonds", "amount": 500, "emoji": "💎"},
				{"type": "equipment", "id": "eq_helmet_recruit_s_training", "amount": 1, "emoji": "🪖"},
				{"type": "item", "id": "speedup_research_1h", "amount": 5, "emoji": "⏱️"}
			]
		},
		# 5. Alliance announcement
		{
			"id": "all_ann_05",
			"category": "alliance",
			"sender": "R3 Alliance Officer",
			"subject": "COMMUNICATION: Assemble for the Spire Assault",
			"timestamp": "2 Days Ago",
			"body": "All active forces, please relocate your citadels near the central rift valleys. We are preparing to march against the Spire Citadel at 19:00 UTC tomorrow. Refuel your troops and build resource silos!",
			"is_read": true,
			"is_favorite": false,
			"has_attachments": false
		},
		# 6. Alliance Help log
		{
			"id": "all_help_log_06",
			"category": "alliance",
			"sender": "Alliance Core Engine",
			"subject": "Timer Reduction: Constructing Iron Quarry",
			"timestamp": "3 Days Ago",
			"body": "Your Alliance members have clicked 'Help' on your outstanding building queues. Construction times have been reduced successfully.",
			"is_read": true,
			"is_favorite": false,
			"has_alliance_help": true,
			"alliance_help_details": {
				"member_name": "Maegan",
				"task_name": "Iron Quarry Tier 12",
				"reduction_seconds": 90
			},
			"has_attachments": false
		}
	]
	_save_mailbox_to_disk()

# ==============================================================================
# UI GENERATION
# ==============================================================================

## Dynamically constructs styled tab switches
func _setup_category_tabs() -> void:
	for child in tab_box.get_children():
		child.queue_free()
		
	for tab_name in TABS:
		var tab_button = Button.new()
		# Add counts in tabs dynamically
		var unread_count = _get_unread_count_by_tab(tab_name)
		var label_suffix = ""
		if unread_count > 0:
			label_suffix = " (%d)" % unread_count
			
		tab_button.text = "  " + tab_name + label_suffix + "  "
		tab_button.custom_minimum_size = Vector2(110, 40)
		tab_button.size_flags_vertical = Control.SIZE_SHRINK_CENTER
		tab_button.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		tab_button.focus_mode = Control.FOCUS_NONE
		tab_button.pressed.connect(func(): _on_tab_pressed(tab_name))
		
		tab_box.add_child(tab_button)
		
	_update_tab_button_styles()

func _update_tab_button_styles() -> void:
	var children = tab_box.get_children()
	for i in range(children.size()):
		var btn = children[i] as Button
		if btn:
			var is_active = (TABS[i] == _active_tab)
			var style = _get_tab_active_style() if is_active else _get_tab_inactive_style()
			
			btn.add_theme_stylebox_override("normal", style)
			btn.add_theme_stylebox_override("hover", style)
			btn.add_theme_stylebox_override("pressed", style)
			btn.add_theme_stylebox_override("focus", style)
			
			# Red text if there are unread items inside
			var unread_count = _get_unread_count_by_tab(TABS[i])
			if unread_count > 0 and not is_active:
				btn.add_theme_color_override("font_color", Color(0.9, 0.7, 0.2, 1)) # Light alert gold
			else:
				btn.add_theme_color_override("font_color", Color(1, 1, 1, 1) if is_active else Color(0.6, 0.65, 0.7, 1))

func _get_unread_count_by_tab(tab_name: String) -> int:
	var cnt = 0
	for m in _mailbox:
		if m.get("is_read", false):
			continue
		var cat = m.get("category", "")
		match tab_name:
			"Inbox":
				if cat == "system" or cat == "alliance" or cat == "battle" or cat == "": cnt += 1
			"Battle Reports":
				if cat == "battle": cnt += 1
			"Alliance Mail":
				if cat == "alliance": cnt += 1
			"System Mail":
				if cat == "system": cnt += 1
			"Favorites":
				# Starred entries can be read/unread, only count unread favorites
				if m.get("is_favorite", false): cnt += 1
	return cnt

# ==============================================================================
# SELECTION & RENDERING ENGINE
# ==============================================================================

## Re-renders the vertical left lists based on active search words and category tab constraints
func _refresh_mail_list_ui() -> void:
	# Clear list
	for child in mail_list.get_children():
		child.queue_free()
		
	var query = search_edit.text.strip_edges().to_lower()
	var filtered_mails = []
	
	for m in _mailbox:
		var cat = m.get("category", "").to_lower()
		var passes_tab = false
		
		match _active_tab:
			"Inbox":
				passes_tab = true # Inbox has all communications
			"Battle Reports":
				passes_tab = (cat == "battle")
			"Alliance Mail":
				passes_tab = (cat == "alliance")
			"System Mail":
				passes_tab = (cat == "system")
			"Favorites":
				passes_tab = m.get("is_favorite", false)
				
		if not passes_tab:
			continue
			
		# Text match criteria
		if query != "":
			var subject_match = query in m.get("subject", "").to_lower()
			var sender_match = query in m.get("sender", "").to_lower()
			var body_match = query in m.get("body", "").to_lower()
			if not subject_match and not sender_match and not body_match:
				continue
				
		filtered_mails.append(m)
		
	if filtered_mails.is_empty():
		_display_empty_list_label()
		# If our currently selected message was filtered out or doesn't belong here, reset detail
		_close_detail_view()
		return
		
	var msg_scene = load("res://MailMessage.tscn")
	if not msg_scene:
		push_error("[Mail] Cannot load MailMessage.tscn component.")
		return
		
	for data in filtered_mails:
		var row = msg_scene.instantiate() as Control
		mail_list.add_child(row)
		
		# Setup data
		row.call("setup_message", data)
		
		# Active highlighted selection match
		if data["id"] == _selected_mail_id:
			row.call("set_selected_active", true)
			
		# Connect signals
		row.connect("selected", _on_mail_row_selected)
		row.connect("favorite_toggled", _on_mail_favorite_toggled)
		row.connect("delete_pressed", _on_mail_row_deleted)
		
	# Refresh badge counts on tabs
	_setup_category_tabs()

func _display_empty_list_label() -> void:
	var center = CenterContainer.new()
	center.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	center.size_flags_vertical = Control.SIZE_EXPAND_FILL
	mail_list.add_child(center)
	
	var lbl = Label.new()
	lbl.text = "No mail in this section."
	lbl.add_theme_color_override("font_color", Color(0.5, 0.55, 0.6, 1))
	center.add_child(lbl)

# ==============================================================================
# DETAILED READER ACTIONS
# ==============================================================================

func _on_mail_row_selected(mail_id: String) -> void:
	_selected_mail_id = mail_id
	
	# Mark as read immediately on click
	for m in _mailbox:
		if m["id"] == mail_id:
			m["is_read"] = true
			break
			
	_save_mailbox_to_disk()
	
	# Render the detailed fields on the right side
	_render_mail_details(mail_id)
	
	# Redraw left-hand lists to clear unread badges
	_refresh_mail_list_ui()

func _render_mail_details(mail_id: String) -> void:
	var mail_data = null
	for m in _mailbox:
		if m["id"] == mail_id:
			mail_data = m
			break
			
	if not mail_data:
		_close_detail_view()
		return
		
	# Show panels
	empty_state.visible = false
	message_detail_view.visible = true
	
	# Populate generic fields
	detail_subject_label.text = mail_data.get("subject", "No Subject")
	detail_sender_date_label.text = "From: %s  |  Received: %s" % [mail_data.get("sender", "Unknown"), mail_data.get("timestamp", "Just Now")]
	body_text_label.text = mail_data.get("body", "")
	
	# 1. Combat report details mapping
	if mail_data.get("has_battle_report", false):
		battle_report_panel.visible = true
		var battle = mail_data.get("battle_details", {})
		var is_victory = battle.get("is_victory", true)
		
		# Banner styling
		battle_banner_label.text = "VICTORY" if is_victory else "DEFEAT"
		battle_banner.add_theme_stylebox_override("panel", _get_victory_style() if is_victory else _get_defeat_style())
		
		# Quantities
		my_losses_lbl.text = "My Forces Lost: %d Troops" % battle.get("my_losses", 0)
		enemy_losses_lbl.text = "Enemy Troops Slain: %d Troops" % battle.get("enemy_losses", 0)
		my_power_lbl.text = "Power Alteration: -%d Power" % battle.get("my_power_loss", 0)
		enemy_power_lbl.text = "Enemy Power Demolished: -%d Power" % battle.get("enemy_power_loss", 0)
	else:
		battle_report_panel.visible = false
		
	# 2. Alliance help assistance mapping
	if mail_data.get("has_alliance_help", false):
		alliance_help_panel.visible = true
		var help = mail_data.get("alliance_help_details", {})
		alliance_help_desc.text = "Your Alliance comrade '%s' assisted with your '%s' project queue. Remaining wait timers have been successfully abbreviated by %d seconds." % [
			help.get("member_name", "Comrade"),
			help.get("task_name", "Construction Work"),
			help.get("reduction_seconds", 60)
		]
	else:
		alliance_help_panel.visible = false
		
	# 3. Custom item attachment boxes
	if mail_data.get("has_attachments", false) and not mail_data.get("attachments_claimed", false):
		attachment_container.visible = true
		_render_attachment_preview_cards(mail_data.get("attachments", []))
	else:
		attachment_container.visible = false

func _render_attachment_preview_cards(attachments_list: Array) -> void:
	# Clear prior preview icons
	for child in attachment_grid.get_children():
		child.queue_free()
		
	for att in attachments_list:
		var panel = PanelContainer.new()
		panel.custom_minimum_size = Vector2(56, 56)
		panel.add_theme_stylebox_override("panel", _get_attachment_card_style())
		
		var vbox = VBoxContainer.new()
		vbox.alignment = BoxContainer.ALIGNMENT_CENTER
		vbox.add_theme_constant_override("separation", 2)
		panel.add_child(vbox)
		
		# Label Emoji representation
		var icon_label = Label.new()
		icon_label.text = att.get("emoji", "🎁")
		icon_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		icon_label.add_theme_font_size_override("font_size", 20)
		vbox.add_child(icon_label)
		
		# Count
		var count_label = Label.new()
		var amt = att.get("amount", 1)
		if amt >= 1000:
			count_label.text = str(amt / 1000) + "k"
		else:
			count_label.text = str(amt)
		count_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		count_label.add_theme_font_size_override("font_size", 10)
		count_label.add_theme_color_override("font_color", Color(0.9, 0.75, 0.1, 1))
		vbox.add_child(count_label)
		
		attachment_grid.add_child(panel)

func _close_detail_view() -> void:
	_selected_mail_id = ""
	empty_state.visible = true
	message_detail_view.visible = false

# ==============================================================================
# TOAST & CUSTOM NOTIFICATIONS
# ==============================================================================

func _show_toast(message: String) -> void:
	toast_label.text = message
	toast_notification.visible = true
	toast_notification.modulate = Color(1, 1, 1, 0)
	
	var tween = create_tween()
	tween.tween_property(toast_notification, "modulate:a", 1.0, 0.25)
	
	_toast_timer.start()

func _on_toast_timeout() -> void:
	var tween = create_tween()
	tween.tween_property(toast_notification, "modulate:a", 0.0, 0.3)
	tween.finished.connect(func(): toast_notification.visible = false)

# ==============================================================================
# CLICK ACTION EVENT HANDLERS
# ==============================================================================

func _on_tab_pressed(tab_name: String) -> void:
	if _active_tab == tab_name:
		return
	_active_tab = tab_name
	_update_tab_button_styles()
	_refresh_mail_list_ui()

func _on_search_changed(_new_text: String) -> void:
	_refresh_mail_list_ui()

func _on_mail_favorite_toggled(mail_id: String, state: bool) -> void:
	for m in _mailbox:
		if m["id"] == mail_id:
			m["is_favorite"] = state
			break
	_save_mailbox_to_disk()
	_refresh_mail_list_ui()

func _on_mail_row_deleted(mail_id: String) -> void:
	_delete_mail_by_id(mail_id)

func _on_single_delete_pressed() -> void:
	if _selected_mail_id != "":
		_delete_mail_by_id(_selected_mail_id)

func _delete_mail_by_id(mail_id: String) -> void:
	for i in range(_mailbox.size()):
		if _mailbox[i]["id"] == mail_id:
			_mailbox.remove_at(i)
			break
			
	_save_mailbox_to_disk()
	
	if _selected_mail_id == mail_id:
		_close_detail_view()
		
	_show_toast("Message deleted.")
	_refresh_mail_list_ui()

func _on_delete_all_read_pressed() -> void:
	var original_count = _mailbox.size()
	# Keep unread messages OR starred favorites
	_mailbox = _mailbox.filter(func(m):
		return not m.get("is_read", false) or m.get("is_favorite", false)
	)
	var removed = original_count - _mailbox.size()
	_save_mailbox_to_disk()
	
	# Verify current selection still exists
	var selected_exists = false
	for m in _mailbox:
		if m["id"] == _selected_mail_id:
			selected_exists = true
			break
			
	if not selected_exists:
		_close_detail_view()
		
	_show_toast("Deleted %d read messages from mailbox." % removed)
	_refresh_mail_list_ui()

func _on_single_claim_pressed() -> void:
	if _selected_mail_id == "":
		return
		
	for m in _mailbox:
		if m["id"] == _selected_mail_id:
			if m.get("has_attachments", false) and not m.get("attachments_claimed", false):
				m["attachments_claimed"] = true
				_claim_attachments_logic(m.get("attachments", []))
			break
			
	_save_mailbox_to_disk()
	attachment_container.visible = false
	_refresh_mail_list_ui()

func _on_claim_all_pressed() -> void:
	var claimed_count = 0
	var all_rewards = []
	
	for m in _mailbox:
		if m.get("has_attachments", false) and not m.get("attachments_claimed", false):
			m["attachments_claimed"] = true
			claimed_count += 1
			for r in m.get("attachments", []):
				all_rewards.append(r)
				
	if claimed_count > 0:
		_save_mailbox_to_disk()
		_claim_attachments_logic(all_rewards)
		_refresh_mail_list_ui()
		if _selected_mail_id != "":
			_render_mail_details(_selected_mail_id)
	else:
		_show_toast("No unclaimed attachments found in mailbox.")

## Integrates with local persistent state to update resources or add speedups
func _claim_attachments_logic(attachments: Array) -> void:
	# Keep a record of claimed resource counts
	var claimed_summary = {}
	
	# In a live MMO, this writes straight into ResourceManager and HeroState.
	# We can also sync directly with the Bag save file so that the inventory system receives them!
	_add_claims_to_bag_save(attachments)
	
	for att in attachments:
		var raw_id = att.get("id", "item")
		var amount = att.get("amount", 1)
		claimed_summary[raw_id] = claimed_summary.get(raw_id, 0) + amount
		
	# Compile text toast
	var details = []
	for raw_id in claimed_summary.keys():
		details.append("+%d %s" % [claimed_summary[raw_id], raw_id.capitalize()])
		
	var summary_text = "Claimed Rewards: " + ", ".join(details)
	_show_toast(summary_text)

## Cross-synchronization logic that pushes items into the player's Bag persistence
func _add_claims_to_bag_save(attachments: Array) -> void:
	var bag_save_path = "user://crownspire_bag_inventory_v1.save"
	var current_bag = {}
	
	if FileAccess.file_exists(bag_save_path):
		var file = FileAccess.open(bag_save_path, FileAccess.READ)
		if file:
			var content = file.get_as_text()
			file.close()
			var json = JSON.new()
			if json.parse(content) == OK:
				var data = json.get_data()
				if typeof(data) == TYPE_DICTIONARY:
					current_bag = data
					
	for att in attachments:
		var att_type = att.get("type", "item")
		var att_id = att.get("id", "")
		var amount = att.get("amount", 1)
		
		# Map reward references to valid standard item slots inside the Bag database
		var bag_item_id = ""
		if att_type == "resource":
			bag_item_id = "resource_" + att_id + "_" + str(amount)
		elif att_type == "equipment":
			bag_item_id = att_id
		elif att_type == "shard":
			bag_item_id = "statue_hero_shard"
		else:
			bag_item_id = att_id
			
		if bag_item_id != "":
			current_bag[bag_item_id] = current_bag.get(bag_item_id, 0) + amount
			
	# Save bag inventory state back
	var write_file = FileAccess.open(bag_save_path, FileAccess.WRITE)
	if write_file:
		write_file.store_string(JSON.stringify(current_bag))
		write_file.close()
		print("[Mail] Inter-scene synchronizer successfully credited rewards to Bag inventory!")

# ==============================================================================
# STYLE GETTERS
# ==============================================================================

func _get_tab_active_style() -> StyleBoxFlat:
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.192, 0.478, 0.820, 1) # Blue
	style.corner_radius_top_left = 6
	style.corner_radius_top_right = 6
	style.expand_margin_bottom = 2.0
	return style

func _get_tab_inactive_style() -> StyleBoxFlat:
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.117, 0.141, 0.180, 1)
	style.border_width_left = 1
	style.border_width_top = 1
	style.border_width_right = 1
	style.border_color = Color(0.176, 0.220, 0.286, 1)
	style.corner_radius_top_left = 6
	style.corner_radius_top_right = 6
	return style

func _get_victory_style() -> StyleBoxFlat:
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.133, 0.313, 0.184, 0.9)
	style.corner_radius_top_left = 6
	style.corner_radius_top_right = 6
	style.corner_radius_bottom_right = 6
	style.corner_radius_bottom_left = 6
	return style

func _get_defeat_style() -> StyleBoxFlat:
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.392, 0.117, 0.117, 0.9)
	style.corner_radius_top_left = 6
	style.corner_radius_top_right = 6
	style.corner_radius_bottom_right = 6
	style.corner_radius_bottom_left = 6
	return style

func _get_attachment_card_style() -> StyleBoxFlat:
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.101, 0.125, 0.160, 1)
	style.border_width_left = 1
	style.border_width_top = 1
	style.border_width_right = 1
	style.border_width_bottom = 1
	style.border_color = Color(0.176, 0.220, 0.286, 1)
	style.corner_radius_top_left = 4
	style.corner_radius_top_right = 4
	style.corner_radius_bottom_right = 4
	style.corner_radius_bottom_left = 4
	return style

func _on_mail_closed() -> void:
	print("[Mail] Closing mailbox...")
	visible = false
