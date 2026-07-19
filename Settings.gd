# ==============================================================================
# Crownspire MMO Strategy Game - Modular Settings & System Preferences Controller
# Godot 4 / GDScript 2.0 client-side settings manager
# ==============================================================================

extends Control

# --- Signals ---
signal settings_closed
signal volume_changed(bus, value)
signal language_changed(lang_code)
signal graphics_changed(quality, fps_cap)
signal log_out_triggered

# --- Save Paths ---
const SETTINGS_SAVE_PATH = "user://crownspire_settings_v1.save"

# --- Onready Nodes ---
@onready var close_btn: Button = $Layout/Header/Margin/HBox/CloseButton
@onready var tab_container_list: VBoxContainer = $Layout/Content/HSplit/LeftPanel/Scroll/List

# --- Right-Side Setting Panels ---
@onready var panel_general: ScrollContainer = $Layout/Content/HSplit/RightPanel/GeneralScroll
@onready var panel_graphics: ScrollContainer = $Layout/Content/HSplit/RightPanel/GraphicsScroll
@onready var panel_audio: ScrollContainer = $Layout/Content/HSplit/RightPanel/AudioScroll
@onready var panel_notifications: ScrollContainer = $Layout/Content/HSplit/RightPanel/NotificationsScroll
@onready var panel_language: ScrollContainer = $Layout/Content/HSplit/RightPanel/LanguageScroll
@onready var panel_account: ScrollContainer = $Layout/Content/HSplit/RightPanel/AccountScroll
@onready var panel_privacy: ScrollContainer = $Layout/Content/HSplit/RightPanel/PrivacyScroll
@onready var panel_support: ScrollContainer = $Layout/Content/HSplit/RightPanel/SupportScroll

# --- Interactive General Widgets ---
@onready var gen_coordinate_check: CheckButton = $Layout/Content/HSplit/RightPanel/GeneralScroll/VBox/CoordOverlay/CheckButton
@onready var gen_shake_check: CheckButton = $Layout/Content/HSplit/RightPanel/GeneralScroll/VBox/CamShake/CheckButton
@onready var gen_translate_check: CheckButton = $Layout/Content/HSplit/RightPanel/GeneralScroll/VBox/AutoTranslate/CheckButton
@onready var gen_detailed_tooltips_check: CheckButton = $Layout/Content/HSplit/RightPanel/GeneralScroll/VBox/DetailedTooltips/CheckButton

# --- Interactive Graphics Widgets ---
@onready var quality_low_btn: Button = $Layout/Content/HSplit/RightPanel/GraphicsScroll/VBox/QualitySec/HBox/LowBtn
@onready var quality_med_btn: Button = $Layout/Content/HSplit/RightPanel/GraphicsScroll/VBox/QualitySec/HBox/MedBtn
@onready var quality_high_btn: Button = $Layout/Content/HSplit/RightPanel/GraphicsScroll/VBox/QualitySec/HBox/HighBtn
@onready var quality_ultra_btn: Button = $Layout/Content/HSplit/RightPanel/GraphicsScroll/VBox/QualitySec/HBox/UltraBtn

@onready var fps_30_btn: Button = $Layout/Content/HSplit/RightPanel/GraphicsScroll/VBox/FpsSec/HBox/Fps30Btn
@onready var fps_60_btn: Button = $Layout/Content/HSplit/RightPanel/GraphicsScroll/VBox/FpsSec/HBox/Fps60Btn
@onready var fps_120_btn: Button = $Layout/Content/HSplit/RightPanel/GraphicsScroll/VBox/FpsSec/HBox/Fps120Btn
@onready var fps_uncapped_btn: Button = $Layout/Content/HSplit/RightPanel/GraphicsScroll/VBox/FpsSec/HBox/FpsUncappedBtn

@onready var vsync_check: CheckButton = $Layout/Content/HSplit/RightPanel/GraphicsScroll/VBox/VsyncSec/CheckButton
@onready var aa_check: CheckButton = $Layout/Content/HSplit/RightPanel/GraphicsScroll/VBox/AntiAliasSec/CheckButton
@onready var shadows_check: CheckButton = $Layout/Content/HSplit/RightPanel/GraphicsScroll/VBox/ShadowsSec/CheckButton

# --- Interactive Audio Widgets ---
@onready var slider_master: HSlider = $Layout/Content/HSplit/RightPanel/AudioScroll/VBox/MasterVol/HBox/Slider
@onready var lbl_master: Label = $Layout/Content/HSplit/RightPanel/AudioScroll/VBox/MasterVol/HBox/ValLabel
@onready var slider_music: HSlider = $Layout/Content/HSplit/RightPanel/AudioScroll/VBox/MusicVol/HBox/Slider
@onready var lbl_music: Label = $Layout/Content/HSplit/RightPanel/AudioScroll/VBox/MusicVol/HBox/ValLabel
@onready var slider_sfx: HSlider = $Layout/Content/HSplit/RightPanel/AudioScroll/VBox/SfxVol/HBox/Slider
@onready var lbl_sfx: Label = $Layout/Content/HSplit/RightPanel/AudioScroll/VBox/SfxVol/HBox/ValLabel
@onready var slider_voice: HSlider = $Layout/Content/HSplit/RightPanel/AudioScroll/VBox/VoiceVol/HBox/Slider
@onready var lbl_voice: Label = $Layout/Content/HSplit/RightPanel/AudioScroll/VBox/VoiceVol/HBox/ValLabel
@onready var mute_all_check: CheckButton = $Layout/Content/HSplit/RightPanel/AudioScroll/VBox/MuteAllSec/CheckButton

# --- Interactive Notifications Widgets ---
@onready var push_marches_check: CheckButton = $Layout/Content/HSplit/RightPanel/NotificationsScroll/VBox/AllianceMarches/CheckButton
@onready var push_building_check: CheckButton = $Layout/Content/HSplit/RightPanel/NotificationsScroll/VBox/BuildingComplete/CheckButton
@onready var push_mail_check: CheckButton = $Layout/Content/HSplit/RightPanel/NotificationsScroll/VBox/MailReceived/CheckButton
@onready var push_scout_check: CheckButton = $Layout/Content/HSplit/RightPanel/NotificationsScroll/VBox/ScoutWarning/CheckButton
@onready var push_promos_check: CheckButton = $Layout/Content/HSplit/RightPanel/NotificationsScroll/VBox/Promotions/CheckButton

# --- Interactive Language Widgets ---
@onready var lang_box_container: VBoxContainer = $Layout/Content/HSplit/RightPanel/LanguageScroll/VBox/LangList

# --- Interactive Account Widgets ---
@onready var acc_id_lbl: Label = $Layout/Content/HSplit/RightPanel/AccountScroll/VBox/InfoCard/Margin/VBox/IDRow/Val
@onready var acc_name_lbl: Label = $Layout/Content/HSplit/RightPanel/AccountScroll/VBox/InfoCard/Margin/VBox/NameRow/Val
@onready var acc_email_lbl: Label = $Layout/Content/HSplit/RightPanel/AccountScroll/VBox/InfoCard/Margin/VBox/EmailRow/Val
@onready var acc_server_lbl: Label = $Layout/Content/HSplit/RightPanel/AccountScroll/VBox/InfoCard/Margin/VBox/ServerRow/Val
@onready var acc_bind_status_lbl: Label = $Layout/Content/HSplit/RightPanel/AccountScroll/VBox/BindStatusCard/Margin/HBox/StatusLbl
@onready var acc_bind_btn: Button = $Layout/Content/HSplit/RightPanel/AccountScroll/VBox/BindStatusCard/Margin/HBox/BindBtn
@onready var acc_logout_btn: Button = $Layout/Content/HSplit/RightPanel/AccountScroll/VBox/LogoutBtn
@onready var acc_delete_btn: Button = $Layout/Content/HSplit/RightPanel/AccountScroll/VBox/DeleteBtn

# --- Interactive Privacy Widgets ---
@onready var priv_share_check: CheckButton = $Layout/Content/HSplit/RightPanel/PrivacyScroll/VBox/ShareStats/CheckButton
@onready var priv_analytics_check: CheckButton = $Layout/Content/HSplit/RightPanel/PrivacyScroll/VBox/AllianceAnalytics/CheckButton
@onready var priv_whisper_check: CheckButton = $Layout/Content/HSplit/RightPanel/PrivacyScroll/VBox/BlockWhispers/CheckButton
@onready var priv_online_check: CheckButton = $Layout/Content/HSplit/RightPanel/PrivacyScroll/VBox/ShowOnline/CheckButton
@onready var priv_view_policy_btn: Button = $Layout/Content/HSplit/RightPanel/PrivacyScroll/VBox/PolicySec/ViewPolicyBtn
@onready var priv_view_terms_btn: Button = $Layout/Content/HSplit/RightPanel/PrivacyScroll/VBox/PolicySec/ViewTermsBtn

# --- Interactive Support Widgets ---
@onready var supp_cat_option: OptionButton = $Layout/Content/HSplit/RightPanel/SupportScroll/VBox/TicketCreator/Margin/VBox/CategoryHBox/OptionButton
@onready var supp_msg_input: TextEdit = $Layout/Content/HSplit/RightPanel/SupportScroll/VBox/TicketCreator/Margin/VBox/MessageInput
@onready var supp_submit_btn: Button = $Layout/Content/HSplit/RightPanel/SupportScroll/VBox/TicketCreator/Margin/VBox/SubmitBtn
@onready var supp_tickets_list: VBoxContainer = $Layout/Content/HSplit/RightPanel/SupportScroll/VBox/MyTicketsSection/TicketsList

# --- Overlays & Dialogs ---
@onready var terms_popup: Control = $TermsPopup
@onready var terms_title: Label = $TermsPopup/Panel/Margin/VBox/Title
@onready var terms_text_box: RichTextLabel = $TermsPopup/Panel/Margin/VBox/Scroll/Text
@onready var terms_close_btn: Button = $TermsPopup/Panel/Margin/VBox/CloseBtn

@onready var logout_confirm_popup: Control = $LogoutConfirmPopup
@onready var logout_yes_btn: Button = $LogoutConfirmPopup/Panel/Margin/VBox/Actions/YesBtn
@onready var logout_no_btn: Button = $LogoutConfirmPopup/Panel/Margin/VBox/Actions/NoBtn

@onready var toast_notification: PanelContainer = $ToastNotification
@onready var toast_label: Label = $ToastNotification/ToastLabel

# --- Internal Database State ---
var _settings_data: Dictionary = {}
var _toast_timer: Timer
var _active_tab: String = "general"

# --- Constants & Lists ---
const SETTING_TABS = [
	{"id": "general", "label": "⚙️ General"},
	{"id": "graphics", "label": "🖥️ Graphics"},
	{"id": "audio", "label": "🔊 Audio"},
	{"id": "notifications", "label": "🔔 Notifications"},
	{"id": "language", "label": "🌐 Language"},
	{"id": "account", "label": "👤 Account"},
	{"id": "privacy", "label": "🛡️ Privacy"},
	{"id": "support", "label": "💬 Support"}
]

const LANGUAGES = [
	{"code": "en", "label": "English (US)", "flag": "🇺🇸"},
	{"code": "de", "label": "Deutsch", "flag": "🇩🇪"},
	{"code": "fr", "label": "Français", "flag": "🇫🇷"},
	{"code": "es", "label": "Español", "flag": "🇪🇸"},
	{"code": "ru", "label": "Русский", "flag": "🇷🇺"},
	{"code": "zh", "label": "简体中文", "flag": "🇨🇳"},
	{"code": "ja", "label": "日本語", "flag": "🇯🇵"},
	{"code": "ko", "label": "한국어", "flag": "🇰🇷"}
]

const TERMS_CONTENT = """CROWNSPIRE: PRESTIGE ROYAL BAZAAR & SOVEREIGN CAMPAIGN
END USER LICENSE AGREEMENT & TERMS OF SERVICE

Welcome to the Sovereign Realm of Crownspire. By accessing or playing our game, establishing defensive bastions, marching in alliance legions, or acquiring virtual stardust fragments and diamonds, you agree to comply with and be bound by these Terms of Service.

1. BOUND ACCOUNT RULES
To access premium events, battle pass milestones, and secure billing gateways, you must maintain a secure bound account. Sovereign credit points, gold reserves, and heroic Valkyrie statue fragments are licensed exclusively to your bound device context. Sell, barter, or transfer of alliance coordinates or user credentials is strictly forbidden.

2. FAIR PLAY IN STRATEGY
We maintain a zero-tolerance policy against third-party macros, automations, or cheat engines designed to farm resources, speed up building timers, or execute automated combat rallies. Whales and free players alike must adhere to active combat constraints; tactical resonance and manual activity remain the absolute deciders of continent superiority.

3. VIRTUAL CURRENCIES AND COMMERCE
Diamonds, Gold, and VIP Points are non-refundable digital instruments. Any transaction initiated through the Simulated Secure Billing Gateway represents a sandbox exercise; no real money is charged or cleared. Virtual rewards acquired are non-transferable and possess zero real-world value.

4. SECTOR COMMUNICATION
Keep continental chat and alliance correspondence respectful. Harassment, coordinate scouting threats outside normal combat gameplay, and hate speech will result in immediate isolation by our royal court wardens.
"""

const PRIVACY_CONTENT = """CROWNSPIRE SOVEREIGN REALM PRIVACY POLICY
Effective Date: June 30, 2026

Your privacy as a Lord of Crownspire is sacred to our royal archives. This policy details how we collect, process, and guard your strategic telemetry:

1. INFORMATION WE ARCHIVE
- Bound device identification numbers to maintain game state persistence.
- Analytical telemetry on alliance territory node interactions and combat march ratios.
- Customer Support transcripts to resolve technical issues and ticket requests.
- Optional transaction logs for simulated sandboxed billing credentials.

2. LOGICAL PROCESSING
We utilize your logs strictly to:
- Synchronize your progress with user:// safe states.
- Re-calculate localized leaderboard rankings, crownmarks, and active battle pass levels.
- Deliver localized push notifications regarding completed building upgrades, incoming hostile scouts, or alliance rally assembly.

3. PUBLIC AND GUILD SHARING
By default, your player rank, power rating, and alliance crest display in regional rankings. You may adjust stats sharing, whispering allowances, and active online visibility status via the Privacy settings tab at any time.

4. REALM PROTECTION
We employ industrial-grade administrative measures to guard your digital profiles from hostile intrusion. No credit cards or passwords are ever stored on unsecured server buses.
"""

# ==============================================================================
# LIFECYCLE INITIALIZATION
# ==============================================================================

func _ready() -> void:
	print("[Settings] Booting System Preferences Console...")
	
	# Initial safe loading
	_load_settings()
	
	# Setup toast timer
	_toast_timer = Timer.new()
	_toast_timer.one_shot = true
	_toast_timer.wait_time = 2.0
	_toast_timer.timeout.connect(_on_toast_timeout)
	add_child(_toast_timer)
	
	# Connect general control signals
	close_btn.pressed.connect(_on_close_pressed)
	
	# Connect sub-components
	_connect_general_signals()
	_connect_graphics_signals()
	_connect_audio_signals()
	_connect_notification_signals()
	_connect_privacy_signals()
	_connect_support_signals()
	
	# Account sub-connections
	acc_bind_btn.pressed.connect(_on_bind_account_pressed)
	acc_logout_btn.pressed.connect(_on_logout_pressed)
	acc_delete_btn.pressed.connect(_on_delete_account_pressed)
	
	# Dialog buttons
	terms_close_btn.pressed.connect(func(): terms_popup.visible = false)
	logout_yes_btn.pressed.connect(_on_confirm_logout_action)
	logout_no_btn.pressed.connect(func(): logout_confirm_popup.visible = false)
	
	# Layout setup
	_generate_sidebar_tabs()
	_generate_language_list()
	
	# Refresh visual UI state from database values
	_apply_settings_to_ui()
	_refresh_ticket_list()
	
	# Focus first settings view
	_switch_tab("general")

# ==============================================================================
# DATABASE STATE MANAGEMENTS
# ==============================================================================

func _load_settings() -> void:
	_settings_data = {}
	if FileAccess.file_exists(SETTINGS_SAVE_PATH):
		var file = FileAccess.open(SETTINGS_SAVE_PATH, FileAccess.READ)
		if file:
			var content = file.get_as_text()
			file.close()
			var json = JSON.new()
			if json.parse(content) == OK:
				var data = json.get_data()
				if typeof(data) == TYPE_DICTIONARY:
					_settings_data = data
					
	# Seed default configurations if empty
	var updated = false
	if not _settings_data.has("general"):
		_settings_data["general"] = {
			"coords_overlay": true,
			"cam_shake": true,
			"auto_translate": true,
			"detailed_tooltips": true
		}
		updated = true
		
	if not _settings_data.has("graphics"):
		_settings_data["graphics"] = {
			"quality": "high",
			"fps_cap": 60,
			"vsync": true,
			"anti_aliasing": true,
			"shadows": true
		}
		updated = true
		
	if not _settings_data.has("audio"):
		_settings_data["audio"] = {
			"master": 80.0,
			"music": 70.0,
			"sfx": 90.0,
			"voice": 85.0,
			"mute_all": false
		}
		updated = true
		
	if not _settings_data.has("notifications"):
		_settings_data["notifications"] = {
			"alliance_marches": true,
			"building_complete": true,
			"mail_received": true,
			"scout_warning": true,
			"promotions": false
		}
		updated = true
		
	if not _settings_data.has("language"):
		_settings_data["language"] = "en"
		updated = true
		
	if not _settings_data.has("account"):
		_settings_data["account"] = {
			"id": "CS-88391-M",
			"name": "Sovereign Maegan",
			"email": "maeganpringle93@gmail.com",
			"server_id": "Continent 124",
			"bound": false
		}
		updated = true
		
	if not _settings_data.has("privacy"):
		_settings_data["privacy"] = {
			"share_stats": true,
			"alliance_analytics": true,
			"block_whispers": false,
			"show_online": true
		}
		updated = true
		
	if not _settings_data.has("tickets"):
		_settings_data["tickets"] = [
			{
				"id": "TK-1024",
				"category": "Billing Support",
				"date": "2026-06-28",
				"message": "Simulated purchase of Vanguard Pass successfully tested. Sandbox confirmation received.",
				"status": "Resolved",
				"reply": "Thank you, Lord. The imperial vaults confirm stardust deposits."
			}
		]
		updated = true
		
	if updated:
		_save_settings_to_disk()

func _save_settings_to_disk() -> void:
	var file = FileAccess.open(SETTINGS_SAVE_PATH, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(_settings_data))
		file.close()

# ==============================================================================
# UI GENERATOR FUNCTIONS
# ==============================================================================

func _generate_sidebar_tabs() -> void:
	# Clean existing items
	for child in tab_container_list.get_children():
		child.queue_free()
		
	for tab_cfg in SETTING_TABS:
		var btn = Button.new()
		btn.text = "   " + tab_cfg.get("label")
		btn.alignment = HORIZONTAL_ALIGNMENT_LEFT
		btn.custom_minimum_size = Vector2(0, 42)
		btn.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		btn.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		btn.focus_mode = Control.FOCUS_NONE
		btn.add_theme_font_size_override("font_size", 12)
		
		var tab_id = tab_cfg.get("id")
		btn.pressed.connect(func(): _switch_tab(tab_id))
		tab_container_list.add_child(btn)

func _generate_language_list() -> void:
	# Clear language slots
	for child in lang_box_container.get_children():
		child.queue_free()
		
	for lang in LANGUAGES:
		var panel = PanelContainer.new()
		panel.custom_minimum_size = Vector2(0, 44)
		panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		
		var p_style = StyleBoxFlat.new()
		p_style.bg_color = Color(0.12, 0.15, 0.18, 1)
		p_style.corner_radius_top_left = 6
		p_style.corner_radius_top_right = 6
		p_style.corner_radius_bottom_right = 6
		p_style.corner_radius_bottom_left = 6
		p_style.border_width_left = 1
		p_style.border_color = Color(0.18, 0.22, 0.28, 1)
		panel.add_theme_stylebox_override("panel", p_style)
		
		var margin = MarginContainer.new()
		margin.add_theme_constant_override("margin_left", 12)
		margin.add_theme_constant_override("margin_right", 12)
		panel.add_child(margin)
		
		var hbox = HBoxContainer.new()
		margin.add_child(hbox)
		
		# Flag and Label
		var lbl = Label.new()
		lbl.text = "%s  %s" % [lang.get("flag"), lang.get("label")]
		lbl.add_theme_color_override("font_color", Color(0.9, 0.92, 0.95, 1))
		lbl.add_theme_font_size_override("font_size", 12)
		lbl.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		hbox.add_child(lbl)
		
		# Select Button
		var sel_btn = Button.new()
		sel_btn.custom_minimum_size = Vector2(90, 26)
		sel_btn.size_flags_vertical = Control.SIZE_SHRINK_CENTER
		sel_btn.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		sel_btn.focus_mode = Control.FOCUS_NONE
		sel_btn.add_theme_font_size_override("font_size", 11)
		
		var btn_style = StyleBoxFlat.new()
		btn_style.corner_radius_top_left = 4
		btn_style.corner_radius_top_right = 4
		btn_style.corner_radius_bottom_right = 4
		btn_style.corner_radius_bottom_left = 4
		
		var is_active = _settings_data.get("language") == lang.get("code")
		if is_active:
			sel_btn.text = "Active ✓"
			btn_style.bg_color = Color(0.15, 0.55, 0.30, 1) # Green active
			sel_btn.disabled = true
		else:
			sel_btn.text = "Select"
			btn_style.bg_color = Color(0.20, 0.24, 0.28, 1)
			var lang_code = lang.get("code")
			sel_btn.pressed.connect(func(): _on_language_switched(lang_code))
			
		sel_btn.add_theme_stylebox_override("normal", btn_style)
		sel_btn.add_theme_stylebox_override("disabled", btn_style)
		sel_btn.add_theme_stylebox_override("hover", btn_style)
		sel_btn.add_theme_stylebox_override("pressed", btn_style)
		hbox.add_child(sel_btn)
		
		lang_box_container.add_child(panel)

func _refresh_ticket_list() -> void:
	for child in supp_tickets_list.get_children():
		child.queue_free()
		
	var tickets = _settings_data.get("tickets", [])
	if tickets.size() == 0:
		var empty_lbl = Label.new()
		empty_lbl.text = "No open or resolved support tickets found."
		empty_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		empty_lbl.add_theme_font_size_override("font_size", 11)
		empty_lbl.add_theme_color_override("font_color", Color(0.5, 0.55, 0.6, 1))
		supp_tickets_list.add_child(empty_lbl)
		return
		
	# Reverse to show newest ticket first
	var rev_list = tickets.duplicate()
	rev_list.reverse()
	
	for tk in rev_list:
		var panel = PanelContainer.new()
		panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		
		var p_style = StyleBoxFlat.new()
		p_style.bg_color = Color(0.10, 0.12, 0.15, 1)
		p_style.corner_radius_top_left = 6
		p_style.corner_radius_top_right = 6
		p_style.corner_radius_bottom_right = 6
		p_style.corner_radius_bottom_left = 6
		p_style.border_width_left = 2
		
		var status = tk.get("status", "Pending")
		var status_color = Color(0.9, 0.6, 0.1, 1) # Yellow pending
		if status == "Resolved":
			status_color = Color(0.15, 0.68, 0.37, 1) # Green
			
		p_style.border_color = status_color
		panel.add_theme_stylebox_override("panel", p_style)
		
		var margin = MarginContainer.new()
		margin.add_theme_constant_override("margin_left", 12)
		margin.add_theme_constant_override("margin_right", 12)
		margin.add_theme_constant_override("margin_top", 10)
		margin.add_theme_constant_override("margin_bottom", 10)
		panel.add_child(margin)
		
		var vbox = VBoxContainer.new()
		vbox.add_theme_constant_override("separation", 6)
		margin.add_child(vbox)
		
		# Row 1: Header
		var row_hdr = HBoxContainer.new()
		vbox.add_child(row_hdr)
		
		var id_lbl = Label.new()
		id_lbl.text = "%s - [%s]" % [tk.get("id"), tk.get("category")]
		id_lbl.add_theme_color_override("font_color", Color(0.94, 0.76, 0.05, 1))
		id_lbl.add_theme_font_size_override("font_size", 11)
		id_lbl.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		row_hdr.add_child(id_lbl)
		
		var date_lbl = Label.new()
		date_lbl.text = tk.get("date")
		date_lbl.add_theme_color_override("font_color", Color(0.5, 0.55, 0.6, 1))
		date_lbl.add_theme_font_size_override("font_size", 10)
		row_hdr.add_child(date_lbl)
		
		var st_lbl = Label.new()
		st_lbl.text = status.to_upper()
		st_lbl.add_theme_color_override("font_color", status_color)
		st_lbl.add_theme_font_size_override("font_size", 10)
		row_hdr.add_child(st_lbl)
		
		# Row 2: User Msg
		var msg_lbl = Label.new()
		msg_lbl.text = "Issue: " + tk.get("message")
		msg_lbl.add_theme_color_override("font_color", Color(0.8, 0.82, 0.85, 1))
		msg_lbl.add_theme_font_size_override("font_size", 11)
		msg_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		vbox.add_child(msg_lbl)
		
		# Row 3: Reply if exists
		if tk.has("reply") and tk.get("reply") != "":
			var r_panel = PanelContainer.new()
			var rp_style = StyleBoxFlat.new()
			rp_style.bg_color = Color(0.06, 0.08, 0.10, 1)
			rp_style.corner_radius_top_left = 4
			rp_style.corner_radius_top_right = 4
			rp_style.corner_radius_bottom_right = 4
			rp_style.corner_radius_bottom_left = 4
			r_panel.add_theme_stylebox_override("panel", rp_style)
			
			var r_margin = MarginContainer.new()
			r_margin.add_theme_constant_override("margin_left", 8)
			r_margin.add_theme_constant_override("margin_right", 8)
			r_margin.add_theme_constant_override("margin_top", 6)
			r_margin.add_theme_constant_override("margin_bottom", 6)
			r_panel.add_child(r_margin)
			
			var r_lbl = Label.new()
			r_lbl.text = "👑 Grand Warden Reply: " + tk.get("reply")
			r_lbl.add_theme_color_override("font_color", Color(0.4, 0.8, 0.9, 1))
			r_lbl.add_theme_font_size_override("font_size", 10)
			r_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
			r_margin.add_child(r_lbl)
			
			vbox.add_child(r_panel)
			
		supp_tickets_list.add_child(panel)

# ==============================================================================
# VIEW TAB CONTROLLERS
# ==============================================================================

func _switch_tab(tab_id: String) -> void:
	if _active_tab == tab_id and tab_container_list.get_child_count() > 0:
		# Just apply styles if first time
		pass
		
	_active_tab = tab_id
	
	# Apply styling updates to sidebar buttons
	var tab_idx = -1
	for i in range(SETTING_TABS.size()):
		if SETTING_TABS[i].get("id") == tab_id:
			tab_idx = i
			break
			
	var children = tab_container_list.get_children()
	for i in range(children.size()):
		var btn = children[i] as Button
		if btn:
			var style = StyleBoxFlat.new()
			style.corner_radius_top_left = 6
			style.corner_radius_top_right = 6
			style.corner_radius_bottom_right = 6
			style.corner_radius_bottom_left = 6
			
			if i == tab_idx:
				style.bg_color = Color(0.90, 0.47, 0.08, 1) # Imperial Orange Gold Accent
				btn.add_theme_color_override("font_color", Color(1, 1, 1, 1))
			else:
				style.bg_color = Color(0.10, 0.12, 0.15, 1)
				btn.add_theme_color_override("font_color", Color(0.65, 0.70, 0.75, 1))
				
			btn.add_theme_stylebox_override("normal", style)
			btn.add_theme_stylebox_override("hover", style)
			btn.add_theme_stylebox_override("pressed", style)
			btn.add_theme_stylebox_override("focus", style)
			
	# Update active panel scroll view visibility
	panel_general.visible = (tab_id == "general")
	panel_graphics.visible = (tab_id == "graphics")
	panel_audio.visible = (tab_id == "audio")
	panel_notifications.visible = (tab_id == "notifications")
	panel_language.visible = (tab_id == "language")
	panel_account.visible = (tab_id == "account")
	panel_privacy.visible = (tab_id == "privacy")
	panel_support.visible = (tab_id == "support")

# ==============================================================================
# VALUE APPLICATION ENGINE
# ==============================================================================

func _apply_settings_to_ui() -> void:
	# General settings UI mapping
	var gen = _settings_data.get("general", {})
	gen_coordinate_check.button_pressed = gen.get("coords_overlay", true)
	gen_shake_check.button_pressed = gen.get("cam_shake", true)
	gen_translate_check.button_pressed = gen.get("auto_translate", true)
	gen_detailed_tooltips_check.button_pressed = gen.get("detailed_tooltips", true)
	
	# Graphics settings UI mapping
	var gfx = _settings_data.get("graphics", {})
	_highlight_quality_buttons(gfx.get("quality", "high"))
	_highlight_fps_buttons(gfx.get("fps_cap", 60))
	vsync_check.button_pressed = gfx.get("vsync", true)
	aa_check.button_pressed = gfx.get("anti_aliasing", true)
	shadows_check.button_pressed = gfx.get("shadows", true)
	
	# Audio settings UI mapping
	var audio = _settings_data.get("audio", {})
	slider_master.value = audio.get("master", 80.0)
	lbl_master.text = str(int(slider_master.value)) + "%"
	
	slider_music.value = audio.get("music", 70.0)
	lbl_music.text = str(int(slider_music.value)) + "%"
	
	slider_sfx.value = audio.get("sfx", 90.0)
	lbl_sfx.text = str(int(slider_sfx.value)) + "%"
	
	slider_voice.value = audio.get("voice", 85.0)
	lbl_voice.text = str(int(slider_voice.value)) + "%"
	
	mute_all_check.button_pressed = audio.get("mute_all", false)
	_apply_audio_mute_state(mute_all_check.button_pressed)
	
	# Notifications settings UI mapping
	var push = _settings_data.get("notifications", {})
	push_marches_check.button_pressed = push.get("alliance_marches", true)
	push_building_check.button_pressed = push.get("building_complete", true)
	push_mail_check.button_pressed = push.get("mail_received", true)
	push_scout_check.button_pressed = push.get("scout_warning", true)
	push_promos_check.button_pressed = push.get("promotions", false)
	
	# Account stats mapping
	var acc = _settings_data.get("account", {})
	acc_id_lbl.text = acc.get("id", "CS-88391-M")
	acc_name_lbl.text = acc.get("name", "Sovereign Maegan")
	acc_email_lbl.text = acc.get("email", "maeganpringle93@gmail.com")
	acc_server_lbl.text = acc.get("server_id", "Continent 124")
	_refresh_account_bind_ui(acc.get("bound", false))
	
	# Privacy settings UI mapping
	var priv = _settings_data.get("privacy", {})
	priv_share_check.button_pressed = priv.get("share_stats", true)
	priv_analytics_check.button_pressed = priv.get("alliance_analytics", true)
	priv_whisper_check.button_pressed = priv.get("block_whispers", false)
	priv_online_check.button_pressed = priv.get("show_online", true)

# ==============================================================================
# INTERACTIVE SIGNAL CONNECTIONS
# ==============================================================================

# --- GENERAL preference triggers ---
func _connect_general_signals() -> void:
	gen_coordinate_check.toggled.connect(func(pressed):
		_settings_data["general"]["coords_overlay"] = pressed
		_save_settings_to_disk()
		_show_toast("Coordinates overlay preference updated.")
	)
	gen_shake_check.toggled.connect(func(pressed):
		_settings_data["general"]["cam_shake"] = pressed
		_save_settings_to_disk()
		_show_toast("Camera shake options modified.")
	)
	gen_translate_check.toggled.connect(func(pressed):
		_settings_data["general"]["auto_translate"] = pressed
		_save_settings_to_disk()
		_show_toast("Auto-translate chat preference saved.")
	)
	gen_detailed_tooltips_check.toggled.connect(func(pressed):
		_settings_data["general"]["detailed_tooltips"] = pressed
		_save_settings_to_disk()
		_show_toast("Detailed info tooltips updated.")
	)

# --- GRAPHICS preference triggers ---
func _connect_graphics_signals() -> void:
	quality_low_btn.pressed.connect(func(): _on_quality_button_pressed("low"))
	quality_med_btn.pressed.connect(func(): _on_quality_button_pressed("medium"))
	quality_high_btn.pressed.connect(func(): _on_quality_button_pressed("high"))
	quality_ultra_btn.pressed.connect(func(): _on_quality_button_pressed("ultra"))
	
	fps_30_btn.pressed.connect(func(): _on_fps_button_pressed(30))
	fps_60_btn.pressed.connect(func(): _on_fps_button_pressed(60))
	fps_120_btn.pressed.connect(func(): _on_fps_button_pressed(120))
	fps_uncapped_btn.pressed.connect(func(): _on_fps_button_pressed(999))
	
	vsync_check.toggled.connect(func(pressed):
		_settings_data["graphics"]["vsync"] = pressed
		_save_settings_to_disk()
		DisplayServer.window_set_vsync_mode(DisplayServer.VSYNC_ENABLED if pressed else DisplayServer.VSYNC_DISABLED)
		_show_toast("VSync configured to " + ("Enabled" if pressed else "Disabled"))
	)
	
	aa_check.toggled.connect(func(pressed):
		_settings_data["graphics"]["anti_aliasing"] = pressed
		_save_settings_to_disk()
		_show_toast("Anti-Aliasing filter updated.")
	)
	
	shadows_check.toggled.connect(func(pressed):
		_settings_data["graphics"]["shadows"] = pressed
		_save_settings_to_disk()
		_show_toast("Dynamic shadows mapping turned " + ("On" if pressed else "Off"))
	)

func _on_quality_button_pressed(level: String) -> void:
	_settings_data["graphics"]["quality"] = level
	_save_settings_to_disk()
	_highlight_quality_buttons(level)
	_show_toast("Visual Graphics preset changed to: " + level.to_upper())
	graphics_changed.emit(level, _settings_data["graphics"].get("fps_cap", 60))

func _highlight_quality_buttons(active_lvl: String) -> void:
	var list = [
		{"btn": quality_low_btn, "id": "low"},
		{"btn": quality_med_btn, "id": "medium"},
		{"btn": quality_high_btn, "id": "high"},
		{"btn": quality_ultra_btn, "id": "ultra"}
	]
	for item in list:
		var btn = item.get("btn") as Button
		if btn:
			var style = StyleBoxFlat.new()
			style.corner_radius_top_left = 4
			style.corner_radius_top_right = 4
			style.corner_radius_bottom_right = 4
			style.corner_radius_bottom_left = 4
			
			if item.get("id") == active_lvl:
				style.bg_color = Color(0.90, 0.47, 0.08, 1) # Amber
				btn.add_theme_color_override("font_color", Color(1, 1, 1, 1))
			else:
				style.bg_color = Color(0.12, 0.15, 0.18, 1)
				btn.add_theme_color_override("font_color", Color(0.65, 0.70, 0.75, 1))
				
			btn.add_theme_stylebox_override("normal", style)
			btn.add_theme_stylebox_override("hover", style)
			btn.add_theme_stylebox_override("pressed", style)

func _on_fps_button_pressed(fps: int) -> void:
	_settings_data["graphics"]["fps_cap"] = fps
	_save_settings_to_disk()
	_highlight_fps_buttons(fps)
	
	if fps == 999:
		_show_toast("FPS Cap set to: Uncapped")
		Engine.max_fps = 0
	else:
		_show_toast("FPS Cap set to: " + str(fps) + " FPS")
		Engine.max_fps = fps
		
	graphics_changed.emit(_settings_data["graphics"].get("quality", "high"), fps)

func _highlight_fps_buttons(active_fps: int) -> void:
	var list = [
		{"btn": fps_30_btn, "val": 30},
		{"btn": fps_60_btn, "val": 60},
		{"btn": fps_120_btn, "val": 120},
		{"btn": fps_uncapped_btn, "val": 999}
	]
	for item in list:
		var btn = item.get("btn") as Button
		if btn:
			var style = StyleBoxFlat.new()
			style.corner_radius_top_left = 4
			style.corner_radius_top_right = 4
			style.corner_radius_bottom_right = 4
			style.corner_radius_bottom_left = 4
			
			if item.get("val") == active_fps:
				style.bg_color = Color(0, 0.75, 1.0, 1) # Sky Blue highlight
				btn.add_theme_color_override("font_color", Color(1, 1, 1, 1))
			else:
				style.bg_color = Color(0.12, 0.15, 0.18, 1)
				btn.add_theme_color_override("font_color", Color(0.65, 0.70, 0.75, 1))
				
			btn.add_theme_stylebox_override("normal", style)
			btn.add_theme_stylebox_override("hover", style)
			btn.add_theme_stylebox_override("pressed", style)

# --- AUDIO preference triggers ---
func _connect_audio_signals() -> void:
	slider_master.value_changed.connect(func(val):
		lbl_master.text = str(int(val)) + "%"
		_settings_data["audio"]["master"] = val
		_save_settings_to_disk()
		volume_changed.emit("Master", val)
	)
	slider_music.value_changed.connect(func(val):
		lbl_music.text = str(int(val)) + "%"
		_settings_data["audio"]["music"] = val
		_save_settings_to_disk()
		volume_changed.emit("Music", val)
	)
	slider_sfx.value_changed.connect(func(val):
		lbl_sfx.text = str(int(val)) + "%"
		_settings_data["audio"]["sfx"] = val
		_save_settings_to_disk()
		volume_changed.emit("SFX", val)
	)
	slider_voice.value_changed.connect(func(val):
		lbl_voice.text = str(int(val)) + "%"
		_settings_data["audio"]["voice"] = val
		_save_settings_to_disk()
		volume_changed.emit("Voice", val)
	)
	mute_all_check.toggled.connect(func(pressed):
		_settings_data["audio"]["mute_all"] = pressed
		_save_settings_to_disk()
		_apply_audio_mute_state(pressed)
		_show_toast("Mute Master Bus: " + ("On" if pressed else "Off"))
	)

func _apply_audio_mute_state(is_muted: bool) -> void:
	# Disable volume sliders if muted is true
	slider_master.editable = not is_muted
	slider_music.editable = not is_muted
	slider_sfx.editable = not is_muted
	slider_voice.editable = not is_muted
	
	var op = 0.5 if is_muted else 1.0
	slider_master.modulate.a = op
	slider_music.modulate.a = op
	slider_sfx.modulate.a = op
	slider_voice.modulate.a = op

# --- NOTIFICATION preference triggers ---
func _connect_notification_signals() -> void:
	push_marches_check.toggled.connect(func(pressed):
		_settings_data["notifications"]["alliance_marches"] = pressed
		_save_settings_to_disk()
		_show_toast("Alliance march notifications " + ("allowed" if pressed else "muted"))
	)
	push_building_check.toggled.connect(func(pressed):
		_settings_data["notifications"]["building_complete"] = pressed
		_save_settings_to_disk()
		_show_toast("Building completed push logs updated.")
	)
	push_mail_check.toggled.connect(func(pressed):
		_settings_data["notifications"]["mail_received"] = pressed
		_save_settings_to_disk()
		_show_toast("Mail alert notifications modified.")
	)
	push_scout_check.toggled.connect(func(pressed):
		_settings_data["notifications"]["scout_warning"] = pressed
		_save_settings_to_disk()
		_show_toast("Scout warning critical alerts " + ("fully active" if pressed else "silenced"))
	)
	push_promos_check.toggled.connect(func(pressed):
		_settings_data["notifications"]["promotions"] = pressed
		_save_settings_to_disk()
		_show_toast("Royal promotion bulletins modified.")
	)

# --- LANGUAGE switches ---
func _on_language_switched(lang_code: String) -> void:
	_settings_data["language"] = lang_code
	_save_settings_to_disk()
	_generate_language_list()
	language_changed.emit(lang_code)
	
	# Simulated translation response
	var toast_msg = "Language updated. Reloading localization catalog..."
	match lang_code:
		"de": toast_msg = "Sprache aktualisiert. Lokalisierungskatalog wird neu geladen..."
		"fr": toast_msg = "Langue mise à jour. Rechargement du catalogue de localisation..."
		"es": toast_msg = "Idioma actualizado. Recargando catálogo de localización..."
		"zh": toast_msg = "语言已更新。正在重新加载本地化目录..."
		"ja": toast_msg = "言語が更新されました。ローカリゼーション情報を再読み込み中..."
		"ko": toast_msg = "언어가 업데이트되었습니다. 로컬라이제이션 카탈로그를 다시 불러오는 중..."
		
	_show_toast(toast_msg)

# --- PRIVACY preference triggers ---
func _connect_privacy_signals() -> void:
	priv_share_check.toggled.connect(func(pressed):
		_settings_data["privacy"]["share_stats"] = pressed
		_save_settings_to_disk()
		_show_toast("Sovereign power stats sharing configured.")
	)
	priv_analytics_check.toggled.connect(func(pressed):
		_settings_data["privacy"]["alliance_analytics"] = pressed
		_save_settings_to_disk()
		_show_toast("Alliance analytics logs updated.")
	)
	priv_whisper_check.toggled.connect(func(pressed):
		_settings_data["privacy"]["block_whispers"] = pressed
		_save_settings_to_disk()
		_show_toast("Block incoming whisper chat: " + ("Enabled" if pressed else "Disabled"))
	)
	priv_online_check.toggled.connect(func(pressed):
		_settings_data["privacy"]["show_online"] = pressed
		_save_settings_to_disk()
		_show_toast("Active online presence visibility adjusted.")
	)
	priv_view_terms_btn.pressed.connect(func(): _open_terms_modal("Terms of Service", TERMS_CONTENT))
	priv_view_policy_btn.pressed.connect(func(): _open_terms_modal("Privacy Policy", PRIVACY_CONTENT))

func _open_terms_modal(title_text: String, raw_content: String) -> void:
	terms_title.text = "📜 " + title_text.to_upper()
	terms_text_box.text = raw_content
	terms_popup.visible = true

# --- ACCOUNT mechanisms ---
func _refresh_account_bind_ui(is_bound: bool) -> void:
	if is_bound:
		acc_bind_status_lbl.text = "✓ Account Linked to Imperial Vault"
		acc_bind_status_lbl.add_theme_color_override("font_color", Color(0.15, 0.68, 0.37, 1)) # Green
		acc_bind_btn.text = "Unlink Account"
	else:
		acc_bind_status_lbl.text = "⚠️ Guest Account - Danger of Loss"
		acc_bind_status_lbl.add_theme_color_override("font_color", Color(0.9, 0.2, 0.2, 1)) # Red
		acc_bind_btn.text = "Bind Vault Account"

func _on_bind_account_pressed() -> void:
	var bound = _settings_data["account"].get("bound", false)
	if bound:
		# Simulate unlinking
		_settings_data["account"]["bound"] = false
		_save_settings_to_disk()
		_refresh_account_bind_ui(false)
		_show_toast("Account unlinked successfully.")
	else:
		# Simulate linking
		_settings_data["account"]["bound"] = true
		_settings_data["account"]["email"] = "maeganpringle93@gmail.com"
		_save_settings_to_disk()
		_refresh_account_bind_ui(true)
		_show_toast("Account bound to maeganpringle93@gmail.com!")

func _on_logout_pressed() -> void:
	logout_confirm_popup.visible = true

func _on_confirm_logout_action() -> void:
	logout_confirm_popup.visible = false
	_show_toast("Logging out of Continent 124... Redirecting...")
	log_out_triggered.emit()

func _on_delete_account_pressed() -> void:
	_show_toast("Account deletion requests require standard 14-day court delay. ticket submitted.")
	_submit_automated_ticket("Account Services", "Requesting account deletion. Sovereign realm metadata reset requested.")

# --- SUPPORT ticket system ---
func _connect_support_signals() -> void:
	# Add predefined items to category selector
	supp_cat_option.clear()
	supp_cat_option.add_item("Game Bug / Glitch")
	supp_cat_option.add_item("Billing & Purchases")
	supp_cat_option.add_item("Alliance Coordinates Dispute")
	supp_cat_option.add_item("Account Recovery")
	supp_cat_option.add_item("Other Inquiries")
	
	supp_submit_btn.pressed.connect(_on_submit_support_ticket_pressed)

func _on_submit_support_ticket_pressed() -> void:
	var msg = supp_msg_input.text.strip_edges()
	if msg == "":
		_show_toast("Please write a message explaining your issue.")
		return
		
	var cat_idx = supp_cat_option.selected
	var category = supp_cat_option.get_item_text(cat_idx)
	
	_submit_automated_ticket(category, msg)
	supp_msg_input.text = ""

func _submit_automated_ticket(category: String, message_text: String) -> void:
	var tickets = _settings_data.get("tickets", [])
	
	var rng = RandomNumberGenerator.new()
	rng.randomize()
	var tk_id = "TK-" + str(rng.randi_range(1000, 9999))
	
	var date_str = "2026-06-30" # local current simulated time block
	
	var ticket = {
		"id": tk_id,
		"category": category,
		"date": date_str,
		"message": message_text,
		"status": "Pending",
		"reply": ""
	}
	
	# Simulate an instant auto-reply for testing billing coordinates, etc.
	if "Billing" in category:
		ticket["status"] = "Resolved"
		ticket["reply"] = "The Royal Ledger has received your coordinate query. All sandboxed charges successfully reconciled!"
	elif "Glitch" in category:
		ticket["status"] = "Resolved"
		ticket["reply"] = "Greetings, Lord. We verified construction timelines. Please restart the developer container if visuals flicker."
		
	tickets.append(ticket)
	_settings_data["tickets"] = tickets
	_save_settings_to_disk()
	
	_show_toast("Ticket " + tk_id + " submitted successfully!")
	_refresh_ticket_list()

# ==============================================================================
# VIEW CLOSING & GENERAL UTILS
# ==============================================================================

func _on_close_pressed() -> void:
	print("[Settings] Exiting Preferences Panel...")
	visible = false
	settings_closed.emit()

func _show_toast(message: String) -> void:
	toast_label.text = message
	toast_notification.visible = true
	toast_notification.modulate = Color(1, 1, 1, 0)
	
	var tween = create_tween()
	tween.tween_property(toast_notification, "modulate:a", 1.0, 0.2)
	
	_toast_timer.start()

func _on_toast_timeout() -> void:
	var tween = create_tween()
	tween.tween_property(toast_notification, "modulate:a", 0.0, 0.25)
	tween.finished.connect(func(): toast_notification.visible = false)
