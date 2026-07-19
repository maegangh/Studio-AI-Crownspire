# ==============================================================================
# Crownspire MMO Strategy Game - Palace VIP System Controller
# Godot 4 / GDScript 2.0 Client-side persistent VIP Engine
# ==============================================================================
# Fulfills requirements: VIP levels, rewards, claims, benefits list, progress bar,
# XP purchases, permanent bonuses, daily VIP chests, and save/load state.
# ==============================================================================

extends Control

# --- Constant Save Location ---
const SAVE_FILE_PATH = "user://crownspire_vip_v1.save"

# --- Onready Nodes ---
@onready var close_btn: Button = $Layout/Header/Margin/HBox/CloseBtn
@onready var add_valor_btn: Button = $Layout/Header/Margin/HBox/SimValorBtn
@onready var valor_label: Label = $Layout/Header/Margin/HBox/ValorContainer/ValorLabel

# --- Prestige Card ---
@onready var vip_level_title: Label = $Layout/Main/PrestigeCard/VBox/LevelTitle
@onready var progress_label: Label = $Layout/Main/PrestigeCard/VBox/ProgressLabel
@onready var progress_bar: ProgressBar = $Layout/Main/PrestigeCard/VBox/ProgressBar

# --- Daily Tribute Chest ---
@onready var daily_chest_title: Label = $Layout/Main/DailyTribute/VBox/HBox/Title
@onready var daily_chest_desc: Label = $Layout/Main/DailyTribute/VBox/HBox/Desc
@onready var daily_chest_rewards: Label = $Layout/Main/DailyTribute/VBox/RewardsLabel
@onready var daily_claim_btn: Button = $Layout/Main/DailyTribute/VBox/HBox/ClaimBtn

# --- Level Grid Database ---
@onready var level_grid: HBoxContainer = $Layout/Main/PrestigeListScroll/LevelGrid

# --- Details View (Perks & Coronation Chest) ---
@onready var perks_header_lbl: Label = $Layout/Main/DetailsPanel/VBox/HeaderLabel
@onready var perks_list: VBoxContainer = $Layout/Main/DetailsPanel/VBox/PerksList
@onready var coronation_title: Label = $Layout/Main/DetailsPanel/VBox/CoronationBox/Title
@onready var coronation_rewards: Label = $Layout/Main/DetailsPanel/VBox/CoronationBox/RewardsLabel
@onready var coronation_claim_btn: Button = $Layout/Main/DetailsPanel/VBox/CoronationBox/ClaimBtn

# --- Prestige Injections (XP shop buttons) ---
@onready var shop_btn_100: Button = $Layout/Main/ShopBox/Btn100
@onready var shop_btn_500: Button = $Layout/Main/ShopBox/Btn500
@onready var shop_btn_1000: Button = $Layout/Main/ShopBox/Btn1000
@onready var shop_btn_5000: Button = $Layout/Main/ShopBox/Btn5000

# --- Popups & Toast ---
@onready var toast_panel: PanelContainer = $ToastNotification
@onready var toast_label: Label = $ToastNotification/ToastLabel

# --- VIP Database Config ---
var _vip_levels: Array = [
	{
		"level": 1,
		"required_xp": 0,
		"benefits": [
			"🪵 +5% Wood/Timber Production Speed",
			"⚡ +2% Troop Training Speed bonus",
			"🌾 +5% Food/Wheat Production multiplier"
		],
		"one_time_reward": "2,000 Wood, 2,000 Food, 100 Valor",
		"daily_chest": "500 Wood, 500 Food, 20 Valor"
	},
	{
		"level": 2,
		"required_xp": 200,
		"benefits": [
			"🪨 +5% Stone/Quarry Production Speed",
			"⚡ +4% Troop Training Speed bonus",
			"🌾 +8% Food/Wheat Production multiplier"
		],
		"one_time_reward": "3,500 Stone, 3,000 Food, 150 Valor",
		"daily_chest": "800 Stone, 600 Food, 30 Valor"
	},
	{
		"level": 3,
		"required_xp": 800,
		"benefits": [
			"🔩 +5% Iron/Ingots Production Speed",
			"⚡ +6% Troop Training Speed bonus",
			"🚀 +5% Marching Speed boost"
		],
		"one_time_reward": "4,000 Iron, 4,000 Wood, 250 Valor",
		"daily_chest": "1,000 Iron, 1,000 Wood, 45 Valor"
	},
	{
		"level": 4,
		"required_xp": 2000,
		"benefits": [
			"🪵 +10% Wood/Timber Production Speed",
			"🪨 +10% Stone/Quarry Production Speed",
			"⚔️ +3% Total Troop Attack & Defense"
		],
		"one_time_reward": "8,000 Wood, 8,000 Stone, 400 Valor",
		"daily_chest": "1,500 Wood, 1,500 Stone, 60 Valor"
	},
	{
		"level": 5,
		"required_xp": 5000,
		"benefits": [
			"🔩 +10% Iron/Ingots Production Speed",
			"⚡ +10% Troop Training Speed bonus",
			"🚀 +10% Marching Speed boost"
		],
		"one_time_reward": "12,000 Iron, 600 Valor points",
		"daily_chest": "2,500 Iron, 85 Valor points"
	},
	{
		"level": 6,
		"required_xp": 12000,
		"benefits": [
			"💎 +15% All Resource Production Speed",
			"⚔️ +5% Total Troop Attack & Defense",
			"🏥 +10% Hospital Care Capacity"
		],
		"one_time_reward": "15,000 All Resources, 1,000 Valor",
		"daily_chest": "3,000 All Resources, 120 Valor"
	},
	{
		"level": 7,
		"required_xp": 25000,
		"benefits": [
			"💎 +20% All Resource Production Speed",
			"⚡ +12% Troop Training Speed bonus",
			"⚔️ +8% Total Troop Attack & Defense"
		],
		"one_time_reward": "25,000 Wood & Stone, 1,500 Valor",
		"daily_chest": "4,500 Wood & Stone, 180 Valor"
	},
	{
		"level": 8,
		"required_xp": 50000,
		"benefits": [
			"🚀 +15% Marching Speed boost",
			"⚔️ +10% Total Troop Attack & Defense",
			"🌾 +25% Food Production multiplier"
		],
		"one_time_reward": "50,000 Food, 20,000 Iron, 2,200 Valor",
		"daily_chest": "8,000 Food, 4,000 Iron, 250 Valor"
	},
	{
		"level": 9,
		"required_xp": 95000,
		"benefits": [
			"💎 +30% All Resource Production Speed",
			"⚡ +20% Troop Training Speed bonus",
			"⚔️ +12% Total Troop Attack & Defense"
		],
		"one_time_reward": "75,000 All resources, 3,500 Valor",
		"daily_chest": "12,000 All resources, 350 Valor"
	},
	{
		"level": 10,
		"required_xp": 160000,
		"benefits": [
			"👑 +40% All Resource Production Speed",
			"⚡ +25% Troop Training Speed bonus",
			"⚔️ +15% Total Troop Attack, Defense, & HP"
		],
		"one_time_reward": "150,000 All resources, 7,500 Valor",
		"daily_chest": "25,000 All resources, 700 Valor"
	}
]

# --- Live Persistent State ---
var _current_xp: int = 0
var _current_level: int = 1
var _claimed_level_rewards: Array = [] # List of claimed levels
var _last_daily_claim_time: int = 0   # Unix timestamp
var _valor_balance: int = 1500        # Sim premium resource

# --- UI State ---
var _view_level: int = 1
var _toast_timer: Timer

# ==============================================================================
# LIFECYCLE
# ==============================================================================

func _ready() -> void:
	print("[VIP Scene] Initiating sovereign VIP system...")
	
	# Setup helper clock for toast notices
	_toast_timer = Timer.new()
	_toast_timer.one_shot = true
	_toast_timer.wait_time = 2.0
	_toast_timer.timeout.connect(_on_toast_timeout)
	add_child(_toast_timer)
	
	# Load or bootstrap data
	_load_vip_state()
	_view_level = _current_level
	
	# Bind Buttons
	close_btn.pressed.connect(_on_close_pressed)
	add_valor_btn.pressed.connect(_on_sim_valor_pressed)
	daily_claim_btn.pressed.connect(_on_daily_claim_pressed)
	coronation_claim_btn.pressed.connect(_on_coronation_claim_pressed)
	
	shop_btn_100.pressed.connect(func(): _buy_xp(100, 50))
	shop_btn_500.pressed.connect(func(): _buy_xp(500, 220))
	shop_btn_1000.pressed.connect(func(): _buy_xp(1000, 400))
	shop_btn_5000.pressed.connect(func(): _buy_xp(5000, 1800))
	
	# Fill Level Navigation Selection Button Database
	_populate_level_grid()
	
	# Render Layout
	_update_ui()


# ==============================================================================
# LOGIC & CALCULATIONS
# ==============================================================================

func _calculate_level_from_xp(xp: int) -> int:
	var calculated = 1
	for cfg in _vip_levels:
		if xp >= cfg["required_xp"]:
			calculated = cfg["level"]
		else:
			break
	return calculated

func _get_xp_needed_for_level(lvl: int) -> int:
	for cfg in _vip_levels:
		if cfg["level"] == lvl:
			return cfg["required_xp"]
	return 9999999

func _is_daily_available() -> bool:
	if _last_daily_claim_time == 0:
		return true
	var current_time = Time.get_unix_time_from_system()
	# Check if 24 hours have elapsed
	return (current_time - _last_daily_claim_time) >= 86400

# ==============================================================================
# ACTIONS
# ==============================================================================

func _buy_xp(xp_amount: int, cost_valor: int) -> void:
	if _valor_balance < cost_valor:
		_show_toast("Insufficient Sim Valor balance! Click '+ Valor' to gather resources.")
		return
		
	_valor_balance -= cost_valor
	_current_xp += xp_amount
	
	var old_level = _current_level
	_current_level = _calculate_level_from_xp(_current_xp)
	
	if _current_level > old_level:
		_show_toast("✨ SOVEREIGN LEVEL-UP! Reached VIP Level " + str(_current_level) + "!")
		_view_level = _current_level
		
	else:
		_show_toast("⚡ Acquired +" + str(xp_amount) + " VIP Prestige XP!")
		
	_save_vip_state()
	_update_ui()
	_populate_level_grid()

func _on_daily_claim_pressed() -> void:
	if not _is_daily_available():
		_show_toast("Daily tribute already claimed! Resets in 24 hours.")
		return
		
	var active_cfg = _vip_levels[_current_level - 1]
	_last_daily_claim_time = int(Time.get_unix_time_from_system())
	
	# Give extra Valor as simulator reward
	_valor_balance += 50
	
	_show_toast("🎁 Daily Tribute Chest Claimed! Obtained: " + active_cfg["daily_chest"])
	_save_vip_state()
	_update_ui()

func _on_coronation_claim_pressed() -> void:
	if _view_level > _current_level:
		_show_toast("Prestige tier locked! Requires VIP Level " + str(_view_level))
		return
		
	if _view_level in _claimed_level_rewards:
		_show_toast("Coronation rewards already claimed for VIP Level " + str(_view_level))
		return
		
	_claimed_level_rewards.append(_view_level)
	
	# Give nice simulator reward
	_valor_balance += 200
	
	var target_cfg = _vip_levels[_view_level - 1]
	_show_toast("👑 Coronation Chest Claimed! Gained: " + target_cfg["one_time_reward"])
	_save_vip_state()
	_update_ui()

func _on_sim_valor_pressed() -> void:
	_valor_balance += 500
	_show_toast("👑 Sim Valor Injected! +500 Valor points added.")
	_save_vip_state()
	_update_ui()

func _on_close_pressed() -> void:
	print("[VIP Scene] Shutting down VIP view...")
	queue_free()

# ==============================================================================
# UI DRAWING
# ==============================================================================

func _update_ui() -> void:
	valor_label.text = str(_valor_balance) + " VALOR"
	
	# Card
	var active_cfg = _vip_levels[_current_level - 1]
	vip_level_title.text = "Sovereign VIP Level " + str(_current_level)
	
	var next_level = _current_level + 1
	if next_level <= 10:
		var target_xp = _get_xp_needed_for_level(next_level)
		progress_label.text = str(_current_xp) + " / " + str(target_xp) + " XP"
		progress_bar.max_value = target_xp
		progress_bar.value = _current_xp
	else:
		progress_label.text = "MAX PRESTIGE REACHED"
		progress_bar.max_value = 100
		progress_bar.value = 100
		
	# Daily Chest
	daily_chest_title.text = "VIP Level " + str(_current_level) + " Tribute Chest"
	daily_chest_rewards.text = "Contains: " + active_cfg["daily_chest"]
	if _is_daily_available():
		daily_claim_btn.disabled = false
		daily_claim_btn.text = "CLAIM TRIBUTE"
	else:
		daily_claim_btn.disabled = true
		daily_claim_btn.text = "CLAIMED"
		
	# Selected Details
	var sel_cfg = _vip_levels[_view_level - 1]
	perks_header_lbl.text = "PRESTIGE BENEFIT FILE: LEVEL " + str(_view_level)
	
	# Clear and repopulate perks list
	for child in perks_list.get_children():
		child.queue_free()
		
	for perk in sel_cfg["benefits"]:
		var lbl = Label.new()
		lbl.text = perk
		lbl.add_theme_font_size_override("font_size", 12)
		lbl.add_theme_color_override("font_color", Color(0.85, 0.85, 0.9))
		perks_list.add_child(lbl)
		
	# Coronation
	coronation_title.text = "VIP Level " + str(_view_level) + " Royal Coronation Chest"
	coronation_rewards.text = "Contains: " + sel_cfg["one_time_reward"]
	
	if _view_level in _claimed_level_rewards:
		coronation_claim_btn.disabled = true
		coronation_claim_btn.text = "CLAIMED"
	elif _view_level <= _current_level:
		coronation_claim_btn.disabled = false
		coronation_claim_btn.text = "CLAIM REWARDS"
	else:
		coronation_claim_btn.disabled = true
		coronation_claim_btn.text = "LOCKED"

func _populate_level_grid() -> void:
	for child in level_grid.get_children():
		child.queue_free()
		
	for cfg in _vip_levels:
		var lvl = cfg["level"]
		var btn = Button.new()
		btn.text = "Lvl " + str(lvl)
		btn.custom_minimum_size = Vector2(65, 35)
		
		# Stylings based on unlocked / selected states
		if lvl == _view_level:
			btn.add_theme_color_override("font_color", Color(1.0, 0.84, 0.0)) # Golden
		elif lvl == _current_level:
			btn.add_theme_color_override("font_color", Color(0.1, 0.8, 0.2)) # Green
		elif lvl < _current_level:
			btn.add_theme_color_override("font_color", Color(0.9, 0.9, 0.9))
		else:
			btn.add_theme_color_override("font_color", Color(0.4, 0.4, 0.45))
			
		btn.pressed.connect(func():
			_view_level = lvl
			_update_ui()
			_populate_level_grid()
		)
		level_grid.add_child(btn)

# ==============================================================================
# TOAST NOTIFICATIONS
# ==============================================================================

func _show_toast(msg: String) -> void:
	toast_label.text = msg
	toast_panel.visible = true
	_toast_timer.start()

func _on_toast_timeout() -> void:
	toast_panel.visible = false

# ==============================================================================
# PERSISTENCE
# ==============================================================================

func _save_vip_state() -> void:
	var file = FileAccess.open(SAVE_FILE_PATH, FileAccess.WRITE)
	if file:
		var data = {
			"xp": _current_xp,
			"level": _current_level,
			"claimed_level_rewards": _claimed_level_rewards,
			"last_daily_claim_time": _last_daily_claim_time,
			"valor_balance": _valor_balance
		}
		file.store_line(JSON.stringify(data))
		file.close()

func _load_vip_state() -> void:
	if not FileAccess.file_exists(SAVE_FILE_PATH):
		return # Bootstrap initial defaults
		
	var file = FileAccess.open(SAVE_FILE_PATH, FileAccess.READ)
	if file:
		var content = file.get_as_text()
		file.close()
		
		var json = JSON.new()
		if json.parse(content) == OK:
			var data = json.get_data()
			if data is Dictionary:
				if "xp" in data: _current_xp = int(data["xp"])
				if "level" in data: _current_level = int(data["level"])
				if "claimed_level_rewards" in data: _claimed_level_rewards = data["claimed_level_rewards"]
				if "last_daily_claim_time" in data: _last_daily_claim_time = int(data["last_daily_claim_time"])
				if "valor_balance" in data: _valor_balance = int(data["valor_balance"])
