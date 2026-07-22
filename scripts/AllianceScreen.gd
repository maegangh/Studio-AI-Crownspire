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
var shop_panel: Control = null

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
		
		# Dynamically spawn Alliance Store Tab Button
		var btn_shop = Button.new()
		btn_shop.name = "BtnShop"
		btn_shop.text = "🏪 Store"
		btn_shop.custom_minimum_size = Vector2(100, 40)
		btn_shop.size_flags_horizontal = SIZE_EXPAND_FILL
		nav_buttons.add_child(btn_shop)
		btn_shop.pressed.connect(func(): switch_to_tab("shop"))
		
	# Dynamically instantiate and register the Alliance Store panel
	var store_scene = load("res://AllianceStore.tscn")
	if store_scene:
		shop_panel = store_scene.instantiate()
		shop_panel.name = "AllianceShopPanel"
		shop_panel.visible = false
		$MainContainer/HubContainer/TabContent.add_child(shop_panel)
	
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
		_refresh_lobby_invitations()

func _refresh_lobby_invitations() -> void:
	var lobby_content = $MainContainer/LobbyContainer/LobbyContent
	if not lobby_content: return
	
	# Clear any previous invitation rows
	for child in lobby_content.get_children():
		if child.name.begins_with("InviteRow_") or child.name == "InviteHeaderLabel":
			child.queue_free()
			
	# Scan for alliances inviting us
	var invites = []
	for alliance in UIManager.alliances_db:
		var inv_list = alliance.get("invitations", []) as Array
		if UIManager.player_name in inv_list:
			invites.append(alliance)
			
	if invites.size() > 0:
		var header = Label.new()
		header.name = "InviteHeaderLabel"
		header.text = "\n📩 PENDING ALLIANCE INVITATIONS"
		header.add_theme_font_size_override("font_size", 14)
		header.add_theme_color_override("font_color", Color("#ffd700")) # Gold color
		header.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		lobby_content.add_child(header)
		
		for alliance in invites:
			var row = PanelContainer.new()
			row.name = "InviteRow_" + alliance["id"]
			row.custom_minimum_size = Vector2(0, 65)
			
			var sb = StyleBoxFlat.new()
			sb.bg_color = Color("#0b121c")
			sb.border_width_left = 3
			sb.border_color = Color("#4193f5") # Blue accent for invitations
			sb.corner_radius_top_right = 6
			sb.corner_radius_bottom_right = 6
			row.add_theme_stylebox_override("panel", sb)
			
			var margin = MarginContainer.new()
			margin.add_theme_constant_override("margin_left", 12)
			margin.add_theme_constant_override("margin_right", 12)
			margin.add_theme_constant_override("margin_top", 8)
			margin.add_theme_constant_override("margin_bottom", 8)
			row.add_child(margin)
			
			var h_layout = HBoxContainer.new()
			h_layout.add_theme_constant_override("separation", 10)
			margin.add_child(h_layout)
			
			var flag = Label.new()
			flag.text = alliance.get("flag_symbol", "🛡️")
			flag.add_theme_font_size_override("font_size", 24)
			flag.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
			h_layout.add_child(flag)
			
			var lbl = Label.new()
			lbl.text = alliance["name"] + " [" + alliance["tag"] + "] invites you!"
			lbl.size_flags_horizontal = SIZE_EXPAND_FILL
			lbl.add_theme_font_size_override("font_size", 13)
			lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
			h_layout.add_child(lbl)
			
			var btn_acc = Button.new()
			btn_acc.text = "Join"
			btn_acc.custom_minimum_size = Vector2(70, 32)
			btn_acc.add_theme_color_override("font_color", Color("#5cd65c"))
			btn_acc.add_theme_font_size_override("font_size", 12)
			btn_acc.pressed.connect(func():
				var invs = alliance["invitations"] as Array
				invs.erase(UIManager.player_name)
				UIManager.join_alliance(alliance["id"])
			)
			h_layout.add_child(btn_acc)
			
			var btn_dec = Button.new()
			btn_dec.text = "Decline"
			btn_dec.custom_minimum_size = Vector2(70, 32)
			btn_dec.add_theme_color_override("font_color", Color("#ff4d4d"))
			btn_dec.add_theme_font_size_override("font_size", 12)
			btn_dec.pressed.connect(func():
				var invs = alliance["invitations"] as Array
				invs.erase(UIManager.player_name)
				UIManager._save_alliance_databases()
				_refresh_ui()
			)
			h_layout.add_child(btn_dec)
			
			lobby_content.add_child(row)

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
	if shop_panel:
		shop_panel.visible = false
	
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
		"shop":
			active_panel = shop_panel
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
