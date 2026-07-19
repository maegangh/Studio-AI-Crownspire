extends Control
class_name AllianceScreen

# ==========================================
# CROWNSPIRE ALLIANCE SYSTEM MASTER CONTROLLER
# ==========================================
# Manages the transition between unaligned recruitment and affiliated gameplay.
# Orchestrates navigation, sub-panels, alerts, and ensures complete integration.

signal closed()

@onready var close_btn: Button = %CloseButton
@onready var lobby_container: Control = %LobbyContainer
@onready var hub_container: Control = %HubContainer

# Sub-panels references inside HubContainer
@onready var overview_panel: Control = %AllianceOverviewPanel
@onready var member_list_panel: Control = %AllianceMemberList
@onready var territory_panel: Control = %AllianceTerritoryPanel
@onready var tech_panel: Control = %AllianceTechnologyPanel
@onready var help_panel: Control = %AllianceHelpPanel
@onready var gift_panel: Control = %AllianceGiftPanel
@onready var chat_panel: Control = %AllianceChatPanel
@onready var war_panel: Control = %AllianceWarPanel
@onready var events_panel: Control = %AllianceEventsPanel
@onready var ranking_panel: Control = %AllianceRankingPanel
@onready var settings_panel: Control = %AllianceSettingsPanel
@onready var mail_panel: Control = %AllianceMailPanel

# Lobby triggers
@onready var create_btn: Button = %CreateLobbyButton
@onready var join_btn: Button = %JoinLobbyButton
@onready var search_bar: Control = %LobbySearchBar

# Overlay and Anchor for Popups
@onready var modal_overlay: ColorRect = %ModalOverlay
@onready var popup_anchor: Control = %PopupAnchor

# Preloaded popups
const CREATE_POPUP = preload("res://scenes/AllianceCreatePopup.tscn")
const JOIN_POPUP = preload("res://scenes/AllianceJoinPopup.tscn")
const HELP_INDICATOR = preload("res://scenes/AllianceNotificationPopup.tscn")

var active_panel: Control = null

func _ready() -> void:
	close_btn.pressed.connect(_on_close_pressed)
	
	if create_btn: create_btn.pressed.connect(_on_create_alliance_pressed)
	if join_btn: join_btn.pressed.connect(_on_join_alliance_pressed)
	
	# Hook Navigation Tab Buttons
	var nav_buttons = $MainContainer/HubContainer/NavigationArea/ScrollNav/NavButtons
	if nav_buttons:
		nav_buttons.get_node("BtnOverview").pressed.connect(func(): switch_to_tab("overview"))
		nav_buttons.get_node("BtnMembers").pressed.connect(func(): switch_to_tab("members"))
		nav_buttons.get_node("BtnTech").pressed.connect(func(): switch_to_tab("tech"))
		nav_buttons.get_node("BtnTerritory").pressed.connect(func(): switch_to_tab("territory"))
		nav_buttons.get_node("BtnHelp").pressed.connect(func(): switch_to_tab("help"))
		nav_buttons.get_node("BtnGifts").pressed.connect(func(): switch_to_tab("gifts"))
		nav_buttons.get_node("BtnChat").pressed.connect(func(): switch_to_tab("chat"))
		nav_buttons.get_node("BtnWar").pressed.connect(func(): switch_to_tab("war"))
		nav_buttons.get_node("BtnEvents").pressed.connect(func(): switch_to_tab("events"))
		nav_buttons.get_node("BtnMail").pressed.connect(func(): switch_to_tab("mail"))
		nav_buttons.get_node("BtnRankings").pressed.connect(func(): switch_to_tab("ranking"))
		nav_buttons.get_node("BtnSettings").pressed.connect(func(): switch_to_tab("settings"))
	
	# Connect to Global UIManager Signals
	UIManager.alliance_updated.connect(_refresh_ui)
	UIManager.alliance_help_updated.connect(_on_help_received)
	UIManager.alliance_gifts_updated.connect(_on_gift_claimed)
	UIManager.alliance_war_updated.connect(_on_war_alert)
	
	modal_overlay.visible = false
	
	_refresh_ui()
	_play_entrance_animation()

func _play_entrance_animation() -> void:
	modulate.a = 0.0
	var tween = create_tween().set_ease(Tween.EASE_OUT).set_trans(Tween.TRANS_CUBIC)
	tween.tween_property(self, "modulate:a", 1.0, 0.35)

func _on_close_pressed() -> void:
	var tween = create_tween().set_ease(Tween.EASE_IN).set_trans(Tween.TRANS_CUBIC)
	tween.tween_property(self, "modulate:a", 0.0, 0.25)
	tween.tween_callback(func():
		closed.emit()
		queue_free()
	)

func _refresh_ui() -> void:
	var has_alliance = UIManager.player_alliance_id != ""
	lobby_container.visible = not has_alliance
	hub_container.visible = has_alliance
	
	if has_alliance:
		var alliance = UIManager.get_player_alliance()
		if alliance.is_empty():
			UIManager.player_alliance_id = ""
			_refresh_ui()
			return
			
		# Open overview by default if nothing is selected yet
		if active_panel == null:
			switch_to_tab("overview")
		else:
			# Update the current active tab dynamically
			if active_panel.has_method("refresh_panel"):
				active_panel.refresh_panel()
	else:
		active_panel = null

# --- TAB SWITCHING MACHINERY ---
func switch_to_tab(tab_name: String) -> void:
	# Hide all
	overview_panel.visible = false
	member_list_panel.visible = false
	territory_panel.visible = false
	tech_panel.visible = false
	help_panel.visible = false
	gift_panel.visible = false
	chat_panel.visible = false
	war_panel.visible = false
	events_panel.visible = false
	ranking_panel.visible = false
	settings_panel.visible = false
	mail_panel.visible = false
	
	match tab_name.to_lower():
		"overview":
			active_panel = overview_panel
		"members":
			active_panel = member_list_panel
		"territory":
			active_panel = territory_panel
		"tech":
			active_panel = tech_panel
		"help":
			active_panel = help_panel
		"gifts":
			active_panel = gift_panel
		"chat":
			active_panel = chat_panel
		"war":
			active_panel = war_panel
		"events":
			active_panel = events_panel
		"ranking":
			active_panel = ranking_panel
		"settings":
			active_panel = settings_panel
		"mail":
			active_panel = mail_panel
		_:
			active_panel = overview_panel
			
	if active_panel:
		active_panel.visible = true
		if active_panel.has_method("refresh_panel"):
			active_panel.refresh_panel()
		
		# Micro-transition fade-in
		active_panel.modulate.a = 0.0
		var tween = create_tween()
		tween.tween_property(active_panel, "modulate:a", 1.0, 0.2)

# --- RECRUITMENT HANDLERS ---
func _on_create_alliance_pressed() -> void:
	show_popup(CREATE_POPUP.instantiate())

func _on_join_alliance_pressed() -> void:
	show_popup(JOIN_POPUP.instantiate())

# --- POPUP HELPER ---
func show_popup(popup_node: Control) -> void:
	modal_overlay.show()
	popup_anchor.add_child(popup_node)
	
	if popup_node.has_signal("closed"):
		popup_node.connect("closed", func():
			modal_overlay.hide()
			_refresh_ui()
		)

# --- NOTIFICATION & FX SIGNALS ---
func _on_help_received() -> void:
	show_floating_toast("🤝 Rallied help successfully completed!", Color("#3bf7ad"))

func _on_gift_claimed() -> void:
	show_floating_toast("🎁 Amber Gift Claimed! Rewards deposited in Bag.", Color("#ffbd2f"))

func _on_war_alert() -> void:
	show_floating_toast("🚨 WAR ALERT! Active rally initiated by member!", Color("#ff5252"))

func show_floating_toast(msg: String, text_color: Color) -> void:
	var toast = HELP_INDICATOR.instantiate()
	popup_anchor.add_child(toast)
	if toast.has_method("setup_notification"):
		toast.setup_notification(msg, text_color)
