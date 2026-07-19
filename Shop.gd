# ==============================================================================
# Crownspire MMO Strategy Game - Premium Royal Shop Controller
# Godot 4 / GDScript 2.0 Client-side persistent premium bazaar
# ==============================================================================

extends Control

# --- Signals ---
signal add_log_requested(text, type)
signal shop_closed

# --- Save Paths ---
const BAG_SAVE_PATH = "user://crownspire_bag_inventory_v1.save"
const SHOP_LIMITS_SAVE_PATH = "user://crownspire_shop_limits_v1.save"

# --- Onready Nodes ---
@onready var close_btn: Button = $Layout/Header/Margin/HBox/CloseButton
@onready var tab_box: HBoxContainer = $Layout/TabScroll/TabBox
@onready var shop_grid: GridContainer = $Layout/Content/Scroll/Grid

# --- Currency Labels ---
@onready var gold_label: Label = $Layout/Header/Margin/HBox/Currencies/GoldBox/Value
@onready var diamonds_label: Label = $Layout/Header/Margin/HBox/Currencies/DiamondBox/Value
@onready var vip_label: Label = $Layout/Header/Margin/HBox/Currencies/VIPBox/Value

# --- Timer Labels ---
@onready var featured_timer_lbl: Label = $Layout/TimerBar/Margin/HBox/FeaturedTimer
@onready var daily_timer_lbl: Label = $Layout/TimerBar/Margin/HBox/DailyTimer

# --- Purchase Quantity Popup Nodes ---
@onready var qty_popup: Control = $QtyPopup
@onready var qty_title: Label = $QtyPopup/Panel/Margin/VBox/ItemHeader/Title
@onready var qty_desc: Label = $QtyPopup/Panel/Margin/VBox/Desc
@onready var qty_emoji: Label = $QtyPopup/Panel/Margin/VBox/ItemHeader/IconBorder/Emoji
@onready var qty_icon_border: PanelContainer = $QtyPopup/Panel/Margin/VBox/ItemHeader/IconBorder
@onready var qty_slider: HSlider = $QtyPopup/Panel/Margin/VBox/QtySelector/Slider
@onready var qty_value_lbl: Label = $QtyPopup/Panel/Margin/VBox/QtySelector/HBox/ValueLabel
@onready var qty_minus_btn: Button = $QtyPopup/Panel/Margin/VBox/QtySelector/HBox/MinusBtn
@onready var qty_plus_btn: Button = $QtyPopup/Panel/Margin/VBox/QtySelector/HBox/PlusBtn
@onready var qty_max_btn: Button = $QtyPopup/Panel/Margin/VBox/QtySelector/HBox/MaxBtn
@onready var qty_cost_lbl: Label = $QtyPopup/Panel/Margin/VBox/CostRow/TotalCost
@onready var qty_confirm_btn: Button = $QtyPopup/Panel/Margin/VBox/Actions/ConfirmBtn
@onready var qty_cancel_btn: Button = $QtyPopup/Panel/Margin/VBox/Actions/CancelBtn

# --- USD Simulated Payment Billing Popup Nodes ---
@onready var billing_popup: Control = $BillingPopup
@onready var bill_item_name: Label = $BillingPopup/Panel/Margin/VBox/Receipt/ItemName
@onready var bill_item_cost: Label = $BillingPopup/Panel/Margin/VBox/Receipt/ItemCost
@onready var bill_item_emoji: Label = $BillingPopup/Panel/Margin/VBox/Receipt/EmojiLabel
@onready var authorize_btn: Button = $BillingPopup/Panel/Margin/VBox/Actions/AuthorizeBtn
@onready var cancel_bill_btn: Button = $BillingPopup/Panel/Margin/VBox/Actions/CancelBtn

# --- Billing Popup Procedural Overlays ---
@onready var processing_overlay: Control = $BillingPopup/ProcessingOverlay
@onready var processing_lbl: Label = $BillingPopup/ProcessingOverlay/Panel/VBox/StatusLabel
@onready var success_overlay: Control = $BillingPopup/SuccessOverlay
@onready var success_grid: GridContainer = $BillingPopup/SuccessOverlay/Panel/VBox/RewardGrid
@onready var success_claim_btn: Button = $BillingPopup/SuccessOverlay/Panel/VBox/ClaimBtn

# --- Toast Nodes ---
@onready var toast_notification: PanelContainer = $ToastNotification
@onready var toast_label: Label = $ToastNotification/ToastLabel

# --- Internal State ---
var _inventory: Dictionary = {}
var _purchased_limits: Dictionary = {}
var _active_tab: String = "Featured"
var _selected_shop_item: Dictionary = {}
var _selected_qty: int = 1
var _toast_timer: Timer

# --- Dynamic Timers State (Simulated reset timers) ---
var _featured_seconds_left: float = 52400.0 # 14h 33m 20s
var _daily_seconds_left: float = 18680.0   # 5h 11m 20s

# --- Categories Catalog ---
const TABS = [
	"Featured",
	"Daily",
	"Bundles",
	"Resources",
	"Speedups",
	"Heroes",
	"Equipment",
	"VIP",
	"Alliance",
	"Cosmetics"
]

# --- Master Data-Driven Shop Catalogue ---
var _shop_items: Dictionary = {
	"Featured": [
		{
			"id": "bundle_emperor_tribute",
			"name": "Emperor's Ascent Chest",
			"desc": "An elite treasury package packed with massive speedups and legendary shards. Insane value!",
			"cost_type": "diamonds",
			"cost": 5000,
			"original_cost": 25000,
			"discount": "-80%",
			"limit_max": 1,
			"emoji": "👑",
			"rarity": "mythic",
			"rewards": {
				"resource_diamond_1000": 5,
				"statue_hero_shard": 30,
				"speedup_research_1h": 24,
				"speedup_construction_1h": 24
			}
		},
		{
			"id": "bundle_sovereign_warpack",
			"name": "Sovereign Warmonger Pack",
			"desc": "Prepare your troops for total wasteland siege. Grants shields, teleportation, and stamina.",
			"cost_type": "diamonds",
			"cost": 2999,
			"original_cost": 9999,
			"discount": "-70%",
			"limit_max": 3,
			"emoji": "⚔️",
			"rarity": "legendary",
			"rewards": {
				"alliance_teleport_pack": 5,
				"buff_defense_24h": 3,
				"potion_stamina_master": 10
			}
		}
	],
	"Daily": [
		{
			"id": "daily_free_claim",
			"name": "Daily Free Provision Chest",
			"desc": "Claim your complimentary daily scout shipment of food and wood to sustain your kingdom's expansion.",
			"cost_type": "free",
			"cost": 0,
			"limit_max": 1,
			"emoji": "🎁",
			"rarity": "common",
			"rewards": {
				"resource_food_100k": 1,
				"resource_wood_100k": 1
			}
		},
		{
			"id": "daily_speedup_deal",
			"name": "Daily Tactical Rush Boost",
			"desc": "A hyper-discounted daily speedup card to fast-track your main academy upgrades.",
			"cost_type": "diamonds",
			"cost": 150,
			"original_cost": 600,
			"discount": "-75%",
			"limit_max": 2,
			"emoji": "⏱️",
			"rarity": "epic",
			"rewards": {
				"speedup_universal_5m": 25
			}
		}
	],
	"Bundles": [
		{
			"id": "bundle_recruit_starter",
			"name": "Recruit's Starter Bounty",
			"desc": "The ultimate starting boost. Instantly unlock initial recruit training gear and raw minerals.",
			"cost_type": "usd",
			"cost": 0.99,
			"original_cost": 9.99,
			"discount": "-90%",
			"limit_max": 1,
			"emoji": "🔰",
			"rarity": "rare",
			"rewards": {
				"eq_weapon_recruit_s_training": 1,
				"eq_helmet_recruit_s_training": 1,
				"resource_food_100k": 10,
				"resource_wood_100k": 10
			}
		},
		{
			"id": "bundle_stardust_hoard",
			"name": "Stardust Overlord Cache",
			"desc": "A luxury reserve chest brimming with celestial stardust gems and raw obsidian.",
			"cost_type": "usd",
			"cost": 4.99,
			"original_cost": 19.99,
			"discount": "-75%",
			"limit_max": 3,
			"emoji": "✨",
			"rarity": "epic",
			"rewards": {
				"crafting_stardust_gem": 50,
				"crafting_obsidian": 20,
				"vip_points_high_decree": 2
			}
		},
		{
			"id": "bundle_mythic_sovereignty",
			"name": "Crownspire Apex Dominance",
			"desc": "Unlock ultimate cosmic tier supplies. Maximum valor, diamond hoards, and high VIP privilege points.",
			"cost_type": "usd",
			"cost": 19.99,
			"original_cost": 99.99,
			"discount": "-80%",
			"limit_max": 5,
			"emoji": "🔥",
			"rarity": "mythic",
			"rewards": {
				"resource_diamond_1000": 30,
				"vip_points_high_decree": 10,
				"statue_hero_shard": 50
			}
		}
	],
	"Resources": [
		{
			"id": "resource_food_100k",
			"name": "100,000 Food Packet",
			"desc": "Tome of grain reserves. Consuming this immediately credits 100,000 Food to your active city granaries.",
			"cost_type": "diamonds",
			"cost": 120,
			"emoji": "🍖",
			"rarity": "rare",
			"rewards": { "resource_food_100k": 1 }
		},
		{
			"id": "resource_wood_100k",
			"name": "100,000 Wood Packet",
			"desc": "A bulk lumber bundle to speed up construction and upgrade fortress bastions.",
			"cost_type": "diamonds",
			"cost": 120,
			"emoji": "🪵",
			"rarity": "rare",
			"rewards": { "resource_wood_100k": 1 }
		},
		{
			"id": "resource_stone_50k",
			"name": "50,000 Granite Slate",
			"desc": "Heavy structural stones mined from remote granite quarries. Crucial for advanced fortifications.",
			"cost_type": "diamonds",
			"cost": 150,
			"emoji": "🧱",
			"rarity": "epic",
			"rewards": { "resource_stone_50k": 1 }
		},
		{
			"id": "resource_iron_25k",
			"name": "25,000 Deep Iron Ore",
			"desc": "Highly refined underground minerals. Crucial for heavy-plated armor smithing and combat cohort draft projects.",
			"cost_type": "diamonds",
			"cost": 200,
			"emoji": "🪙",
			"rarity": "epic",
			"rewards": { "resource_iron_25k": 1 }
		}
	],
	"Speedups": [
		{
			"id": "speedup_universal_5m",
			"name": "Universal Rush Card (5m)",
			"desc": "A micro speed booster that trims 5 minutes off any active queue.",
			"cost_type": "gold",
			"cost": 2500,
			"emoji": "⏱️",
			"rarity": "common",
			"rewards": { "speedup_universal_5m": 1 }
		},
		{
			"id": "speedup_construction_1h",
			"name": "Construction Blueprint (1h)",
			"desc": "Speeds up any active building construct or sentinel defensive outpost upgrade by 1 hour.",
			"cost_type": "diamonds",
			"cost": 250,
			"emoji": "🔨",
			"rarity": "rare",
			"rewards": { "speedup_construction_1h": 1 }
		},
		{
			"id": "speedup_research_1h",
			"name": "Research Decoding Scroll (1h)",
			"desc": "Provides critical insights that expedite academy tech decryptions or military tier scrolls by 1 hour.",
			"cost_type": "diamonds",
			"cost": 250,
			"emoji": "🧪",
			"rarity": "rare",
			"rewards": { "speedup_research_1h": 1 }
		},
		{
			"id": "speedup_training_1h",
			"name": "Tactical Drafting Order (1h)",
			"desc": "Expedites training and draft times for Infantry, Marksmen, or Heavy Cavalry divisions by 1 hour.",
			"cost_type": "diamonds",
			"cost": 250,
			"emoji": "🛡️",
			"rarity": "rare",
			"rewards": { "speedup_training_1h": 1 }
		}
	],
	"Heroes": [
		{
			"id": "statue_hero_shard",
			"name": "Valkyrie Hero Statue Shard",
			"desc": "A legendary golden shard depicting ancient Valkyrie commanders. Essential for high rank ascension.",
			"cost_type": "diamonds",
			"cost": 1000,
			"emoji": "🎖️",
			"rarity": "legendary",
			"rewards": { "statue_hero_shard": 1 }
		},
		{
			"id": "hero_xp_potion_large",
			"name": "Grand Hero Elixir (L)",
			"desc": "Infused with pure stardust essence, this elixir grants +10,000 XP to any selected champion.",
			"cost_type": "diamonds",
			"cost": 300,
			"emoji": "🧪",
			"rarity": "epic",
			"rewards": { "hero_xp_potion_large": 1 }
		}
	],
	"Equipment": [
		{
			"id": "eq_weapon_recruit_s_training",
			"name": "Recruit's Vanguard Sword",
			"desc": "A durable, beautifully weighted practice blade that increases rookie infantry defense stats.",
			"cost_type": "diamonds",
			"cost": 1500,
			"emoji": "⚔️",
			"rarity": "common",
			"rewards": { "eq_weapon_recruit_s_training": 1 }
		},
		{
			"id": "eq_helmet_recruit_s_training",
			"name": "Vanguard Plated Sallet",
			"desc": "Solid steel defensive sallet helmet. Helps deflect basic longbow arrows.",
			"cost_type": "diamonds",
			"cost": 1500,
			"emoji": "🪖",
			"rarity": "common",
			"rewards": { "eq_helmet_recruit_s_training": 1 }
		},
		{
			"id": "crafting_stardust_gem",
			"name": "Stardust Forge Crystal",
			"desc": "A luminescent cosmic crystal used to infuse equipment with unique secondary resonance tiers.",
			"cost_type": "diamonds",
			"cost": 500,
			"emoji": "✨",
			"rarity": "epic",
			"rewards": { "crafting_stardust_gem": 1 }
		},
		{
			"id": "crafting_obsidian",
			"name": "Volcanic Obsidian Plate",
			"desc": "Ultra-hard black volcanic stone used as base core plating for forging high-rank legendary armor.",
			"cost_type": "diamonds",
			"cost": 800,
			"emoji": "🖤",
			"rarity": "legendary",
			"rewards": { "crafting_obsidian": 1 }
		}
	],
	"VIP": [
		{
			"id": "vip_points_100",
			"name": "Prestige VIP Scroll (+100)",
			"desc": "Adds 100 points to your VIP level tracker to unlock persistent resource rate speed-ups.",
			"cost_type": "diamonds",
			"cost": 150,
			"emoji": "👑",
			"rarity": "rare",
			"rewards": { "vip_points_100": 1 }
		},
		{
			"id": "vip_points_high_decree",
			"name": "High Sovereign Decree (+1000)",
			"desc": "Grants 1,000 points toward VIP prestige tiers. Instant level-up capability!",
			"cost_type": "diamonds",
			"cost": 1200,
			"emoji": "📜",
			"rarity": "legendary",
			"rewards": { "vip_points_high_decree": 1 }
		}
	],
	"Alliance": [
		{
			"id": "alliance_teleport_pack",
			"name": "Fortress Teleport Order",
			"desc": "Allows you to relocate your castle city directly adjacent to active coalition coordinates.",
			"cost_type": "diamonds",
			"cost": 1000,
			"emoji": "🌀",
			"rarity": "epic",
			"rewards": { "alliance_teleport_pack": 1 }
		},
		{
			"id": "buff_defense_24h",
			"name": "Sanctuary Ward Canopy (24h)",
			"desc": "Deploy an active 24-hour peace-shield shield that blocks all incoming enemy marches and espionage.",
			"cost_type": "diamonds",
			"cost": 800,
			"emoji": "🛡️",
			"rarity": "epic",
			"rewards": { "buff_defense_24h": 1 }
		}
	],
	"Cosmetics": [
		{
			"id": "cosmetic_neon_frame",
			"name": "Neon Cybernetic Border",
			"desc": "Drape your master avatar icon in a high-end glowing cyan neon border. Pure cosmetic prestige.",
			"cost_type": "diamonds",
			"cost": 3000,
			"limit_max": 1,
			"emoji": "⚡",
			"rarity": "legendary",
			"rewards": { "cosmetic_neon_frame": 1 }
		},
		{
			"id": "cosmetic_castle_skin_lava",
			"name": "Volcanic Citadels Castle Skin",
			"desc": "Transform your world map city node into a magma-drenched volcanic fortress that commands fear.",
			"cost_type": "diamonds",
			"cost": 8000,
			"limit_max": 1,
			"emoji": "🌋",
			"rarity": "mythic",
			"rewards": { "cosmetic_castle_skin_lava": 1 }
		}
	]
}

# ==============================================================================
# LIFECYCLE CALLBACKS
# ==============================================================================

func _ready() -> void:
	print("[Shop] Initiating Royal Premium Shop System...")
	
	# Load or bootstrap profile states
	_load_inventory_state()
	_load_purchased_limits()
	
	# Toast timer setup
	_toast_timer = Timer.new()
	_toast_timer.one_shot = true
	_toast_timer.wait_time = 2.5
	_toast_timer.timeout.connect(_on_toast_timeout)
	add_child(_toast_timer)
	
	# Connections
	close_btn.pressed.connect(_on_close_pressed)
	
	# Qty modal connection
	qty_slider.value_changed.connect(_on_qty_slider_changed)
	qty_minus_btn.pressed.connect(func(): _adjust_selected_qty(-1))
	qty_plus_btn.pressed.connect(func(): _adjust_selected_qty(1))
	qty_max_btn.pressed.connect(_on_qty_max_clicked)
	qty_confirm_btn.pressed.connect(_on_qty_confirm_pressed)
	qty_cancel_btn.pressed.connect(_on_qty_closed)
	qty_popup.gui_input.connect(_on_qty_overlay_gui_input)
	
	# Billing modal connection
	authorize_btn.pressed.connect(_on_authorize_payment_pressed)
	cancel_bill_btn.pressed.connect(_on_billing_closed)
	success_claim_btn.pressed.connect(_on_success_claimed_pressed)
	billing_popup.gui_input.connect(_on_billing_overlay_gui_input)
	
	# Build Horizontal navigation tabs
	_setup_horizontal_tabs()
	
	# Redraw
	_refresh_shop_ui()

func _process(delta: float) -> void:
	# Update timers
	_featured_seconds_left -= delta
	_daily_seconds_left -= delta
	
	if _featured_seconds_left < 0: _featured_seconds_left = 86400.0 # reset simulation
	if _daily_seconds_left < 0: _daily_seconds_left = 43200.0
	
	featured_timer_lbl.text = "⏳ Featured resetting in: %s" % _format_timer_str(_featured_seconds_left)
	daily_timer_lbl.text = "⏳ Daily Deals reset in: %s" % _format_timer_str(_daily_seconds_left)

# ==============================================================================
# DATA LOADING & SAVE PIPELINES
# ==============================================================================

func _load_inventory_state() -> void:
	_inventory = {}
	if FileAccess.file_exists(BAG_SAVE_PATH):
		var file = FileAccess.open(BAG_SAVE_PATH, FileAccess.READ)
		if file:
			var content = file.get_as_text()
			file.close()
			var json = JSON.new()
			if json.parse(content) == OK:
				var data = json.get_data()
				if typeof(data) == TYPE_DICTIONARY:
					_inventory = data
					
	# Sync standard premium and soft currency fields to inventory to support raw currency purchases
	var updated = false
	if not _inventory.has("diamonds"):
		_inventory["diamonds"] = 28500 # Generous starter Diamonds to test luxury shop!
		updated = true
	if not _inventory.has("gold"):
		_inventory["gold"] = 1250000   # Generous starter Gold Coins
		updated = true
	if not _inventory.has("vip_points"):
		_inventory["vip_points"] = 5400  # Default VIP 5
		updated = true
		
	if updated:
		_save_inventory_to_disk()

func _save_inventory_to_disk() -> void:
	var file = FileAccess.open(BAG_SAVE_PATH, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(_inventory))
		file.close()
		print("[Shop] Successfully flushed player inventory state changes.")

func _load_purchased_limits() -> void:
	_purchased_limits = {}
	if FileAccess.file_exists(SHOP_LIMITS_SAVE_PATH):
		var file = FileAccess.open(SHOP_LIMITS_SAVE_PATH, FileAccess.READ)
		if file:
			var content = file.get_as_text()
			file.close()
			var json = JSON.new()
			if json.parse(content) == OK:
				var data = json.get_data()
				if typeof(data) == TYPE_DICTIONARY:
					_purchased_limits = data

func _save_purchased_limits_to_disk() -> void:
	var file = FileAccess.open(SHOP_LIMITS_SAVE_PATH, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(_purchased_limits))
		file.close()

# ==============================================================================
# UI COMPONENT MANUFACTORY
# ==============================================================================

func _setup_horizontal_tabs() -> void:
	for child in tab_box.get_children():
		child.queue_free()
		
	for tab_name in TABS:
		var tab_btn = Button.new()
		tab_btn.text = "   " + tab_name + "   "
		tab_btn.custom_minimum_size = Vector2(100, 38)
		tab_btn.size_flags_vertical = Control.SIZE_SHRINK_CENTER
		tab_btn.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		tab_btn.focus_mode = Control.FOCUS_NONE
		
		# Closure binding
		var cap_tab = tab_name
		tab_btn.pressed.connect(func(): _on_tab_button_pressed(cap_tab))
		
		tab_box.add_child(tab_btn)
		
	_update_tab_button_decorations()

func _update_tab_button_decorations() -> void:
	var children = tab_box.get_children()
	for i in range(children.size()):
		var btn = children[i] as Button
		if not btn: continue
		
		var tab_name = TABS[i]
		var is_active = (tab_name == _active_tab)
		
		var style = StyleBoxFlat.new()
		if is_active:
			style.bg_color = Color(0.90, 0.47, 0.08, 1) # Premium Orange Accent
			btn.add_theme_color_override("font_color", Color(1, 1, 1, 1))
		else:
			style.bg_color = Color(0.10, 0.12, 0.15, 1)
			btn.add_theme_color_override("font_color", Color(0.65, 0.70, 0.75, 1))
			
		style.corner_radius_top_left = 6
		style.corner_radius_top_right = 6
		style.corner_radius_bottom_right = 6
		style.corner_radius_bottom_left = 6
		
		btn.add_theme_stylebox_override("normal", style)
		btn.add_theme_stylebox_override("hover", style)
		btn.add_theme_stylebox_override("pressed", style)
		btn.add_theme_stylebox_override("focus", style)
		
		# Procedural Red Notification Alert Dots!
		# Let's clean up any previous procedural red dots
		for child in btn.get_children():
			if child.name == "RedAlertDot":
				child.queue_free()
				
		var has_alert = false
		if tab_name == "Daily":
			# Daily has free provision chest unclaimed
			var claimed_free = _purchased_limits.get("daily_free_claim", 0)
			if claimed_free < 1:
				has_alert = true
		elif tab_name == "Featured":
			# High discount items still available
			var b1 = _purchased_limits.get("bundle_emperor_tribute", 0)
			if b1 < 1:
				has_alert = true
		elif tab_name == "Bundles":
			var s1 = _purchased_limits.get("bundle_recruit_starter", 0)
			if s1 < 1:
				has_alert = true
				
		if has_alert:
			var dot = PanelContainer.new()
			dot.name = "RedAlertDot"
			dot.custom_minimum_size = Vector2(10, 10)
			dot.size_flags_horizontal = Control.SIZE_SHRINK_END
			dot.size_flags_vertical = Control.SIZE_SHRINK_BEGIN
			
			var dot_style = StyleBoxFlat.new()
			dot_style.bg_color = Color(0.9, 0.1, 0.15, 1) # Radiant Red
			dot_style.corner_radius_top_left = 5
			dot_style.corner_radius_top_right = 5
			dot_style.corner_radius_bottom_right = 5
			dot_style.corner_radius_bottom_left = 5
			dot.add_theme_stylebox_override("panel", dot_style)
			
			# Position dot overlay on top-right of tab button
			btn.add_child(dot)
			dot.set_anchors_preset(Control.PRESET_TOP_RIGHT)
			dot.position = Vector2(btn.size.x - 8, -2)

func _refresh_shop_ui() -> void:
	# Update top currency counters
	var gold = _inventory.get("gold", 0)
	var diamonds = _inventory.get("diamonds", 0)
	var vip_pts = _inventory.get("vip_points", 0)
	
	# Compute simulated VIP tier from cumulative points
	var vip_lvl = 1 + int(vip_pts / 1000.0)
	vip_lvl = clamp(vip_lvl, 1, 15)
	
	gold_label.text = "🪙 " + _format_large_number(gold)
	diamonds_label.text = "💎 " + _format_large_number(diamonds)
	vip_label.text = "👑 VIP " + str(vip_lvl)
	
	_update_tab_button_decorations()
	
	# Rebuild Shop Grid
	_clear_container(shop_grid)
	
	var active_list = _shop_items.get(_active_tab, [])
	
	for shop_item in active_list:
		var card = _create_shop_card(shop_item)
		shop_grid.add_child(card)
		
		# micro-zoom entrance transition for dynamic rhythm!
		card.modulate.a = 0.0
		card.scale = Vector2(0.95, 0.95)
		card.pivot_offset = card.custom_minimum_size / 2.0
		var tween = create_tween().set_parallel(true).set_ease(Tween.EASE_OUT).set_trans(Tween.TRANS_QUAD)
		tween.tween_property(card, "modulate:a", 1.0, 0.22)
		tween.tween_property(card, "scale", Vector2(1.0, 1.0), 0.22)

func _create_shop_card(item: Dictionary) -> PanelContainer:
	var card = PanelContainer.new()
	card.custom_minimum_size = Vector2(240, 200)
	card.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	
	# Check persistent purchase limit
	var item_id = item.get("id")
	var purchased_count = _purchased_limits.get(item_id, 0)
	var has_limit = item.has("limit_max")
	var max_limit = item.get("limit_max", 0)
	var is_sold_out = has_limit and purchased_count >= max_limit
	
	# Premium Card Styling
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.10, 0.12, 0.16, 1)
	style.border_width_left = 1
	style.border_width_top = 1
	style.border_width_right = 1
	style.border_width_bottom = 1
	
	# Premium Rarity-Coded Card Accents
	var rarity = item.get("rarity", "common")
	var rarity_color = _get_rarity_color(rarity)
	style.border_color = rarity_color
	style.corner_radius_top_left = 8
	style.corner_radius_top_right = 8
	style.corner_radius_bottom_right = 8
	style.corner_radius_bottom_left = 8
	
	# Card shadow
	style.shadow_size = 4
	style.shadow_color = Color(0, 0, 0, 0.3)
	card.add_theme_stylebox_override("panel", style)
	
	var margin = MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 12)
	margin.add_theme_constant_override("margin_top", 12)
	margin.add_theme_constant_override("margin_right", 12)
	margin.add_theme_constant_override("margin_bottom", 12)
	card.add_child(margin)
	
	var vbox = VBoxContainer.new()
	vbox.add_theme_constant_override("separation", 8)
	margin.add_child(vbox)
	
	# TOP LEVEL: Item Icon & Header Card
	var item_hbox = HBoxContainer.new()
	item_hbox.add_theme_constant_override("separation", 10)
	vbox.add_child(item_hbox)
	
	# Icon Circle Slot
	var icon_slot = PanelContainer.new()
	icon_slot.custom_minimum_size = Vector2(50, 50)
	
	var slot_style = StyleBoxFlat.new()
	slot_style.bg_color = Color(0.06, 0.08, 0.11, 1)
	slot_style.border_width_left = 2
	slot_style.border_width_top = 2
	slot_style.border_width_right = 2
	slot_style.border_width_bottom = 2
	slot_style.border_color = rarity_color
	slot_style.corner_radius_top_left = 25 # circular
	slot_style.corner_radius_top_right = 25
	slot_style.corner_radius_bottom_right = 25
	slot_style.corner_radius_bottom_left = 25
	icon_slot.add_theme_stylebox_override("panel", slot_style)
	item_hbox.add_child(icon_slot)
	
	var emoji_lbl = Label.new()
	emoji_lbl.text = item.get("emoji", "💎")
	emoji_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	emoji_lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	emoji_lbl.add_theme_font_size_override("font_size", 22)
	icon_slot.add_child(emoji_lbl)
	
	# Title & Rarity Tags Column
	var header_vbox = VBoxContainer.new()
	header_vbox.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	header_vbox.add_theme_constant_override("separation", 2)
	item_hbox.add_child(header_vbox)
	
	var title_lbl = Label.new()
	title_lbl.text = item.get("name", "Royal Supply")
	title_lbl.add_theme_color_override("font_color", Color(1, 1, 1, 1))
	title_lbl.add_theme_font_size_override("font_size", 13)
	title_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	header_vbox.add_child(title_lbl)
	
	var rarity_lbl = Label.new()
	rarity_lbl.text = rarity.to_upper()
	rarity_lbl.add_theme_color_override("font_color", rarity_color)
	rarity_lbl.add_theme_font_size_override("font_size", 10)
	header_vbox.add_child(rarity_lbl)
	
	# Item Description
	var desc_lbl = Label.new()
	desc_lbl.text = item.get("desc", "A premium package of imperial resources.")
	desc_lbl.add_theme_color_override("font_color", Color(0.55, 0.60, 0.65, 1))
	desc_lbl.add_theme_font_size_override("font_size", 11)
	desc_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	desc_lbl.size_flags_vertical = Control.SIZE_EXPAND_FILL
	vbox.add_child(desc_lbl)
	
	# FOOTER: Cost row & Action Buy Buttons
	var footer_hbox = HBoxContainer.new()
	footer_hbox.size_flags_vertical = Control.SIZE_SHRINK_END
	vbox.add_child(footer_hbox)
	
	# Price Display Box
	var price_vbox = VBoxContainer.new()
	price_vbox.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	price_vbox.add_theme_constant_override("separation", 2)
	footer_hbox.add_child(price_vbox)
	
	# Discount Strikethrough Row
	if item.has("original_cost") and not is_sold_out:
		var orig_hbox = HBoxContainer.new()
		orig_hbox.add_theme_constant_override("separation", 6)
		price_vbox.add_child(orig_hbox)
		
		var orig_lbl = Label.new()
		orig_lbl.text = _get_price_tag_str(item.get("cost_type"), item.get("original_cost"))
		orig_lbl.add_theme_color_override("font_color", Color(0.45, 0.50, 0.55, 1))
		orig_lbl.add_theme_font_size_override("font_size", 10)
		orig_hbox.add_child(orig_lbl)
		
		# Add strikethrough styling visually by overlapping or appending tag
		var disc_badge = PanelContainer.new()
		var badge_style = StyleBoxFlat.new()
		badge_style.bg_color = Color(0.9, 0.1, 0.15, 1) # Hot Red Discount
		badge_style.corner_radius_top_left = 3
		badge_style.corner_radius_top_right = 3
		badge_style.corner_radius_bottom_right = 3
		badge_style.corner_radius_bottom_left = 3
		disc_badge.add_theme_stylebox_override("panel", badge_style)
		
		var badge_margin = MarginContainer.new()
		badge_margin.add_theme_constant_override("margin_left", 4)
		badge_margin.add_theme_constant_override("margin_right", 4)
		badge_margin.add_theme_constant_override("margin_top", 1)
		badge_margin.add_theme_constant_override("margin_bottom", 1)
		disc_badge.add_child(badge_margin)
		
		var disc_lbl = Label.new()
		disc_lbl.text = item.get("discount")
		disc_lbl.add_theme_color_override("font_color", Color(1, 1, 1, 1))
		disc_lbl.add_theme_font_size_override("font_size", 9)
		badge_margin.add_child(disc_lbl)
		orig_hbox.add_child(disc_badge)
		
	var active_cost_lbl = Label.new()
	if is_sold_out:
		active_cost_lbl.text = "CLAIMED"
		active_cost_lbl.add_theme_color_override("font_color", Color(0.5, 0.5, 0.5, 1))
	else:
		active_cost_lbl.text = _get_price_tag_str(item.get("cost_type"), item.get("cost"))
		if item.get("cost_type") == "free":
			active_cost_lbl.add_theme_color_override("font_color", Color(0.15, 0.68, 0.37, 1)) # Green free
		else:
			active_cost_lbl.add_theme_color_override("font_color", Color(0.95, 0.75, 0.15, 1)) # Gold
			
	active_cost_lbl.add_theme_font_size_override("font_size", 14)
	price_vbox.add_child(active_cost_lbl)
	
	# Limit Counter Info Label
	if has_limit:
		var limit_lbl = Label.new()
		limit_lbl.text = "Limit: %d / %d Left" % [(max_limit - purchased_count), max_limit]
		limit_lbl.add_theme_color_override("font_color", Color(0.4, 0.55, 0.7, 1) if not is_sold_out else Color(0.9, 0.2, 0.2, 1))
		limit_lbl.add_theme_font_size_override("font_size", 10)
		price_vbox.add_child(limit_lbl)
		
	# Buy Action Trigger Button
	var buy_btn = Button.new()
	buy_btn.custom_minimum_size = Vector2(95, 32)
	buy_btn.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	
	var btn_style = StyleBoxFlat.new()
	btn_style.corner_radius_top_left = 6
	btn_style.corner_radius_top_right = 6
	btn_style.corner_radius_bottom_right = 6
	btn_style.corner_radius_bottom_left = 6
	
	if is_sold_out:
		buy_btn.text = "Sold Out"
		buy_btn.disabled = true
		btn_style.bg_color = Color(0.18, 0.20, 0.23, 1)
	else:
		if item.get("cost_type") == "free":
			buy_btn.text = "Claim Free"
			btn_style.bg_color = Color(0.15, 0.55, 0.30, 1) # Green
		else:
			buy_btn.text = "Purchase"
			btn_style.bg_color = Color(0.19, 0.48, 0.82, 1) # Blue
			
		buy_btn.pressed.connect(func(): _on_item_card_checkout_clicked(item))
		
	buy_btn.add_theme_stylebox_override("normal", btn_style)
	buy_btn.add_theme_stylebox_override("hover", btn_style)
	buy_btn.add_theme_stylebox_override("pressed", btn_style)
	buy_btn.add_theme_stylebox_override("disabled", btn_style)
	buy_btn.add_theme_stylebox_override("focus", btn_style)
	
	footer_hbox.add_child(buy_btn)
	
	return card

# ==============================================================================
# SHOP NAVIGATION & INTERACTIONS
# ==============================================================================

func _on_tab_button_pressed(tab_name: String) -> void:
	if _active_tab == tab_name:
		return
	_active_tab = tab_name
	_refresh_shop_ui()

func _on_item_card_checkout_clicked(item: Dictionary) -> void:
	_selected_shop_item = item
	_selected_qty = 1
	
	var cost_type = item.get("cost_type")
	
	if cost_type == "usd":
		# Real-money premium simulation gateway popup!
		_open_billing_modal(item)
	else:
		# Quantity picker popup confirmation
		_open_quantity_picker_modal(item)

# ==============================================================================
# QUANTITY PICKER POPUP ENGINE
# ==============================================================================

func _open_quantity_picker_modal(item: Dictionary) -> void:
	qty_title.text = item.get("name")
	qty_desc.text = item.get("desc")
	qty_emoji.text = item.get("emoji")
	
	# Style node borders by rarity
	var r_color = _get_rarity_color(item.get("rarity", "common"))
	var r_style = StyleBoxFlat.new()
	r_style.bg_color = Color(0.06, 0.08, 0.11, 1)
	r_style.border_width_left = 2
	r_style.border_width_top = 2
	r_style.border_width_right = 2
	r_style.border_width_bottom = 2
	r_style.border_color = r_color
	r_style.corner_radius_top_left = 6
	r_style.corner_radius_top_right = 6
	r_style.corner_radius_bottom_right = 6
	r_style.corner_radius_bottom_left = 6
	qty_icon_border.add_theme_stylebox_override("panel", r_style)
	
	# Calculate maximum affordable based on current currency
	var max_affordable = 99
	var cost_type = item.get("cost_type")
	var cost = item.get("cost", 0)
	
	if cost_type == "diamonds":
		var diam = _inventory.get("diamonds", 0)
		if cost > 0: max_affordable = int(diam / float(cost))
	elif cost_type == "gold":
		var gold = _inventory.get("gold", 0)
		if cost > 0: max_affordable = int(gold / float(cost))
	elif cost_type == "free":
		max_affordable = 1
		
	# Cap by remaining limit if applicable
	var item_id = item.get("id")
	if item.has("limit_max"):
		var remaining_limit = item.get("limit_max", 0) - _purchased_limits.get(item_id, 0)
		max_affordable = min(max_affordable, remaining_limit)
		
	max_affordable = max(max_affordable, 1)
	
	qty_slider.min_value = 1
	qty_slider.max_value = float(max_affordable)
	qty_slider.value = 1
	_selected_qty = 1
	
	_update_quantity_popup_math()
	
	# Procedural entrance animation
	qty_popup.visible = true
	var popup_panel = qty_popup.get_node("Panel") as Control
	popup_panel.scale = Vector2(0.9, 0.9)
	popup_panel.pivot_offset = popup_panel.size / 2.0
	var tween = create_tween().set_ease(Tween.EASE_OUT).set_trans(Tween.TRANS_BACK)
	tween.tween_property(popup_panel, "scale", Vector2(1.0, 1.0), 0.18)

func _update_quantity_popup_math() -> void:
	qty_value_lbl.text = str(_selected_qty)
	
	var cost_type = _selected_shop_item.get("cost_type")
	var unit_cost = _selected_shop_item.get("cost", 0)
	var total_cost = unit_cost * _selected_qty
	
	qty_cost_lbl.text = "Total Price: " + _get_price_tag_str(cost_type, total_cost)
	
	# Verify checkout checks
	var user_currency_bal = 0
	if cost_type == "diamonds":
		user_currency_bal = _inventory.get("diamonds", 0)
	elif cost_type == "gold":
		user_currency_bal = _inventory.get("gold", 0)
	elif cost_type == "free":
		user_currency_bal = 999999
		
	if user_currency_bal < total_cost:
		qty_confirm_btn.text = "INSUFFICIENT BALANCE"
		qty_confirm_btn.disabled = true
	else:
		qty_confirm_btn.text = "Confirm Checkout"
		qty_confirm_btn.disabled = false

func _on_qty_slider_changed(value: float) -> void:
	_selected_qty = int(value)
	_update_quantity_popup_math()

func _adjust_selected_qty(amount: int) -> void:
	var new_val = clamp(_selected_qty + amount, qty_slider.min_value, qty_slider.max_value)
	qty_slider.value = float(new_val)
	_selected_qty = int(new_val)
	_update_quantity_popup_math()

func _on_qty_max_clicked() -> void:
	qty_slider.value = qty_slider.max_value
	_selected_qty = int(qty_slider.max_value)
	_update_quantity_popup_math()

func _on_qty_confirm_pressed() -> void:
	var cost_type = _selected_shop_item.get("cost_type")
	var unit_cost = _selected_shop_item.get("cost", 0)
	var total_cost = unit_cost * _selected_qty
	
	# Verify final checkout safety
	if cost_type == "diamonds":
		var diam = _inventory.get("diamonds", 0)
		if diam < total_cost:
			_show_toast("Insufficient Diamonds balance!")
			return
		_inventory["diamonds"] = diam - total_cost
	elif cost_type == "gold":
		var gold = _inventory.get("gold", 0)
		if gold < total_cost:
			_show_toast("Insufficient Gold Coins balance!")
			return
		_inventory["gold"] = gold - total_cost
		
	# Add limits
	var item_id = _selected_shop_item.get("id")
	if _selected_shop_item.has("limit_max"):
		_purchased_limits[item_id] = _purchased_limits.get(item_id, 0) + _selected_qty
		_save_purchased_limits_to_disk()
		
	# Credit Rewards to active inventory
	_deliver_item_rewards(_selected_shop_item, _selected_qty)
	
	# Save changes
	_save_inventory_to_disk()
	
	# Notify
	var bought_text = "Purchased %dx [%s] successfully!" % [_selected_qty, _selected_shop_item.get("name")]
	_show_toast(bought_text)
	add_log_requested.emit(bought_text + " Items delivered to inventory bag.", "success")
	
	# Close and refresh
	_on_qty_closed()
	_refresh_shop_ui()

func _on_qty_closed() -> void:
	_selected_shop_item = {}
	var popup_panel = qty_popup.get_node("Panel") as Control
	var tween = create_tween()
	tween.tween_property(popup_panel, "scale", Vector2(0.85, 0.85), 0.12)
	tween.finished.connect(func(): qty_popup.visible = false)

func _on_qty_overlay_gui_input(event: InputEvent) -> void:
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
		var panel = qty_popup.get_node("Panel") as PanelContainer
		if not panel.get_global_rect().has_point(event.global_position):
			_on_qty_closed()

# ==============================================================================
# USD BUNDLES FUTURISTIC PAYMENT GATEWAY SIMULATOR
# ==============================================================================

func _open_billing_modal(item: Dictionary) -> void:
	_selected_shop_item = item
	bill_item_name.text = item.get("name")
	bill_item_cost.text = "Invoice Amount: $%.2f USD" % item.get("cost")
	bill_item_emoji.text = item.get("emoji")
	
	processing_overlay.visible = false
	success_overlay.visible = false
	billing_popup.visible = true
	
	var panel = billing_popup.get_node("Panel") as Control
	panel.scale = Vector2(0.9, 0.9)
	panel.pivot_offset = panel.size / 2.0
	var tween = create_tween().set_ease(Tween.EASE_OUT).set_trans(Tween.TRANS_BACK)
	tween.tween_property(panel, "scale", Vector2(1.0, 1.0), 0.18)

func _on_authorize_payment_pressed() -> void:
	# Trigger secure gateway simulations steps!
	processing_overlay.visible = true
	
	_simulate_routing_step("Establishing encrypted handshake...", 0.6)
	get_tree().create_timer(0.6).timeout.connect(func():
		_simulate_routing_step("Authorizing merchant token key...", 1.2)
	)
	get_tree().create_timer(1.2).timeout.connect(func():
		_simulate_routing_step("Synchronizing vaults ledger block...", 1.8)
	)
	get_tree().create_timer(1.8).timeout.connect(_on_payment_authorization_success)

func _simulate_routing_step(text: String, time: float) -> void:
	processing_lbl.text = text
	var progress_bar = processing_overlay.get_node("Panel/VBox/ProgressBar") as ProgressBar
	var target = float((time / 1.8) * 100.0)
	var tween = create_tween()
	tween.tween_property(progress_bar, "value", target, 0.4)

func _on_payment_authorization_success() -> void:
	processing_overlay.visible = false
	success_overlay.visible = true
	
	# Populate triumph reward grid with icons of the bundle contents!
	_clear_container(success_grid)
	
	var rewards = _selected_shop_item.get("rewards", {})
	for reward_key in rewards.keys():
		var qty = rewards.get(reward_key)
		var r_card = PanelContainer.new()
		r_card.custom_minimum_size = Vector2(90, 90)
		
		var r_style = StyleBoxFlat.new()
		r_style.bg_color = Color(0.12, 0.15, 0.20, 1)
		r_style.border_width_left = 1
		r_style.border_width_top = 1
		r_style.border_width_right = 1
		r_style.border_width_bottom = 1
		r_style.border_color = Color(0.90, 0.47, 0.08, 1) # gold border
		r_style.corner_radius_top_left = 6
		r_style.corner_radius_top_right = 6
		r_style.corner_radius_bottom_right = 6
		r_style.corner_radius_bottom_left = 6
		r_card.add_theme_stylebox_override("panel", r_style)
		
		var r_vbox = VBoxContainer.new()
		r_vbox.alignment = BoxContainer.ALIGNMENT_CENTER
		r_card.add_child(r_vbox)
		
		var r_emoji = Label.new()
		r_emoji.text = _get_item_emoji_fallback(reward_key)
		r_emoji.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		r_emoji.add_theme_font_size_override("font_size", 24)
		r_vbox.add_child(r_emoji)
		
		var r_qty = Label.new()
		r_qty.text = "+" + str(qty)
		r_qty.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		r_qty.add_theme_color_override("font_color", Color(1, 1, 1, 1))
		r_qty.add_theme_font_size_override("font_size", 11)
		r_vbox.add_child(r_qty)
		
		var r_name = Label.new()
		r_name.text = reward_key.replace("resource_", "").replace("_100k", "").replace("_25k", "").replace("_50k", "").replace("_1000", "").replace("_", " ").capitalize()
		r_name.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		r_name.add_theme_color_override("font_color", Color(0.55, 0.60, 0.65, 1))
		r_name.add_theme_font_size_override("font_size", 9)
		r_name.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		r_name.clip_text = true
		r_name.custom_minimum_size = Vector2(80, 20)
		r_vbox.add_child(r_name)
		
		success_grid.add_child(r_card)
		
		# float animation entrance
		r_card.position.y += 10
		r_card.modulate.a = 0.0
		var r_tween = create_tween().set_parallel(true).set_ease(Tween.EASE_OUT)
		r_tween.tween_property(r_card, "modulate:a", 1.0, 0.3)
		r_tween.tween_property(r_card, "position:y", r_card.position.y - 10, 0.3)

func _on_success_claimed_pressed() -> void:
	# Actually deliver rewards and deduct limit!
	var item_id = _selected_shop_item.get("id")
	_deliver_item_rewards(_selected_shop_item, 1)
	
	if _selected_shop_item.has("limit_max"):
		_purchased_limits[item_id] = _purchased_limits.get(item_id, 0) + 1
		_save_purchased_limits_to_disk()
		
	_save_inventory_to_disk()
	
	# Notify
	var m = "Premium bundle [%s] unlocked successfully! Glory to the Realm!" % _selected_shop_item.get("name")
	_show_toast(m)
	add_log_requested.emit(m, "success")
	
	_on_billing_closed()
	_refresh_shop_ui()

func _on_billing_closed() -> void:
	_selected_shop_item = {}
	var panel = billing_popup.get_node("Panel") as Control
	var tween = create_tween()
	tween.tween_property(panel, "scale", Vector2(0.85, 0.85), 0.12)
	tween.finished.connect(func(): billing_popup.visible = false)

func _on_billing_overlay_gui_input(event: InputEvent) -> void:
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
		# If user is in payment processed screen, they must click "Claim" to ensure items saved properly
		if success_overlay.visible:
			return
		var panel = billing_popup.get_node("Panel") as PanelContainer
		if not panel.get_global_rect().has_point(event.global_position):
			_on_billing_closed()

# ==============================================================================
# LOOT EXCHANGES & REWARDS CARRIERS
# ==============================================================================

func _deliver_item_rewards(shop_item: Dictionary, qty_multiplier: int) -> void:
	var rewards = shop_item.get("rewards", {})
	for reward_key in rewards.keys():
		var amount = rewards.get(reward_key, 0) * qty_multiplier
		
		if reward_key == "resource_diamond_1000":
			# Adding diamonds directly to spending currency pool
			_inventory["diamonds"] = _inventory.get("diamonds", 0) + (amount * 1000)
		elif "vip_points_100" in reward_key:
			_inventory["vip_points"] = _inventory.get("vip_points", 0) + (amount * 100)
		elif "vip_points_high_decree" in reward_key:
			_inventory["vip_points"] = _inventory.get("vip_points", 0) + (amount * 1000)
		else:
			# Standard item stack inside Bag
			_inventory[reward_key] = _inventory.get(reward_key, 0) + amount

# ==============================================================================
# GENERAL HELPER UTILS
# ==============================================================================

func _on_close_pressed() -> void:
	print("[Shop] Closing Prestige Royal Shop...")
	visible = false
	shop_closed.emit()

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

func _clear_container(container: Node) -> void:
	for child in container.get_children():
		child.queue_free()

func _format_large_number(num: int) -> String:
	if num >= 1000000:
		return "%.2fM" % (num / 1000000.0)
	elif num >= 1000:
		return "%.1fk" % (num / 1000.0)
	return str(num)

func _format_timer_str(seconds_val: float) -> String:
	var total_sec = int(seconds_val)
	var hrs = total_sec / 3600
	var mins = (total_sec % 3600) / 60
	var secs = total_sec % 60
	return "%02dh %02dm %02ds" % [hrs, mins, secs]

func _get_price_tag_str(cost_type: String, val: float) -> String:
	match cost_type:
		"diamonds":
			return "💎 %d" % int(val)
		"gold":
			return "🪙 %s" % _format_large_number(int(val))
		"free":
			return "FREE"
		_:
			return "$%.2f USD" % val

func _get_rarity_color(rarity_str: String) -> Color:
	match rarity_str.to_lower():
		"uncommon": return Color(0.25, 0.70, 0.35, 1) # Green
		"rare": return Color(0.19, 0.48, 0.82, 1) # Blue
		"epic": return Color(0.58, 0.18, 0.84, 1) # Purple
		"legendary": return Color(0.90, 0.47, 0.08, 1) # Orange
		"mythic": return Color(0.90, 0.08, 0.12, 1) # Crimson Red
		_: return Color(0.60, 0.65, 0.70, 1) # Gray Common

func _get_item_emoji_fallback(item_id: String) -> String:
	if "food" in item_id: return "🍖"
	elif "wood" in item_id: return "🪵"
	elif "stone" in item_id: return "🧱"
	elif "iron" in item_id: return "🪙"
	elif "diamond" in item_id: return "💎"
	elif "speedup" in item_id: return "⏱️"
	elif "helmet" in item_id: return "🪖"
	elif "weapon" in item_id or "sword" in item_id: return "⚔️"
	elif "vip" in item_id: return "👑"
	elif "shard" in item_id or "statue" in item_id: return "🎖️"
	elif "potion" in item_id: return "🧪"
	elif "teleport" in item_id: return "🌀"
	elif "shield" in item_id: return "🛡️"
	elif "stardust" in item_id: return "✨"
	elif "obsidian" in item_id: return "🖤"
	else: return "🎁"
