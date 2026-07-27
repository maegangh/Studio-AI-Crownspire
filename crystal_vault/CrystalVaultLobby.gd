#============================================================================
# CrystalVaultLobby.gd - Lobby Screen Controller (Godot 4.4)
# Operates the Control UI viewport, listing modes, currencies, and exit triggers.
#============================================================================
extends Control

@onready var shard_label: Label = $MarginContainer/VBoxContainer/HeaderBar/HBoxContainer/ShardsLabel
@onready var orb_label: Label = $MarginContainer/VBoxContainer/HeaderBar/HBoxContainer/OrbsLabel
@onready var resonance_label: Label = $MarginContainer/VBoxContainer/HeaderBar/HBoxContainer2/ResonanceLabel
@onready var main_vbox: VBoxContainer = $MarginContainer/VBoxContainer
@onready var design_scroll: ScrollContainer = $MarginContainer/VBoxContainer/ScrollContainer

const BOARD_SCENE := preload("res://crystal_vault/PuzzleBoard.tscn")

var split_container: HSplitContainer = null
var sidebar_container: VBoxContainer = null
var content_panel: PanelContainer = null
var content_vbox: VBoxContainer = null

var current_tab: String = "home"

func _ready() -> void:
	# Hide old scroll mockup container
	if design_scroll:
		design_scroll.visible = false
		
	# Verify and sync UI
	update_currency_displays()
	
	# Listen to updates
	if CVSaveManager:
		CVSaveManager.resonance_updated.connect(_on_resonance_updated)
		CVSaveManager.load_completed.connect(_on_save_load_completed)
		
	setup_tabbed_layout()
	switch_to_tab("home")

## Updates shards, orbs, and resonance strings from CVSaveManager Autoload
func update_currency_displays() -> void:
	if CVSaveManager == null:
		return
		
	if shard_label:
		shard_label.text = "💎 " + str(CVSaveManager.astral_shards)
	if orb_label:
		orb_label.text = "⭐ " + str(CVSaveManager.starlight_orbs)
	if resonance_label:
		resonance_label.text = "Astral Resonance: " + str(CVSaveManager.resonance_rating)

func _on_save_load_completed() -> void:
	update_currency_displays()
	switch_to_tab(current_tab)

## Procedurally constructs a modern tabbed layout
func setup_tabbed_layout() -> void:
	split_container = HSplitContainer.new()
	split_container.size_flags_vertical = Control.SIZE_EXPAND_FILL
	main_vbox.add_child(split_container)
	
	# Left Sidebar
	var sidebar_panel := PanelContainer.new()
	sidebar_panel.custom_minimum_size = Vector2(240, 0)
	split_container.add_child(sidebar_panel)
	
	sidebar_container = VBoxContainer.new()
	sidebar_container.add_theme_constant_override("separation", 10)
	sidebar_panel.add_child(sidebar_container)
	
	# Panel Title
	var sidebar_title := Label.new()
	sidebar_title.text = "🔮 VAULT SYSTEMS"
	sidebar_title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	sidebar_title.add_theme_font_size_override("font_size", 14)
	sidebar_title.modulate = Color(0.7, 0.75, 1.0, 1.0)
	sidebar_container.add_child(sidebar_title)
	
	# Sidebar Navigation Buttons
	add_sidebar_tab_button("home", "🏰 Vault Hub")
	add_sidebar_tab_button("event", "🌟 Event: Astral Convergence")
	add_sidebar_tab_button("expedition", "🗺️ Expedition Levels")
	add_sidebar_tab_button("endless", "⚔️ Endless Vault")
	add_sidebar_tab_button("daily", "🧪 Daily Extreme")
	add_sidebar_tab_button("boosters", "🎒 Booster Inventory")
	add_sidebar_tab_button("settings", "⚙️ Vault Preferences")
	
	# Disabled Coming Soon Categories (Purely descriptive for social, PvP & Arena scope compliance)
	var soon_separator := HSeparator.new()
	sidebar_container.add_child(soon_separator)
	
	var soon_title := Label.new()
	soon_title.text = "🔒 COMING SOON"
	soon_title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	soon_title.add_theme_font_size_override("font_size", 11)
	soon_title.modulate = Color(0.45, 0.45, 0.5, 1.0)
	sidebar_container.add_child(soon_title)
	
	add_disabled_sidebar_button("🏰 Crystal Convergence")
	add_disabled_sidebar_button("⚔️ Beast Trials")
	add_disabled_sidebar_button("🛡️ Tactical Arena")
	add_disabled_sidebar_button("🏆 Season Championships")
	
	# Right Content Area
	var right_scroll := ScrollContainer.new()
	right_scroll.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	right_scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	split_container.add_child(right_scroll)
	
	content_panel = PanelContainer.new()
	content_panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	content_panel.size_flags_vertical = Control.SIZE_EXPAND_FILL
	right_scroll.add_child(content_panel)
	
	content_vbox = VBoxContainer.new()
	content_vbox.add_theme_constant_override("separation", 15)
	content_panel.add_child(content_vbox)

func add_sidebar_tab_button(tab_id: String, tab_label: String) -> void:
	var btn := Button.new()
	btn.text = " " + tab_label
	btn.alignment = HORIZONTAL_ALIGNMENT_LEFT
	btn.pressed.connect(func(): switch_to_tab(tab_id))
	sidebar_container.add_child(btn)

func add_disabled_sidebar_button(tab_label: String) -> void:
	var btn := Button.new()
	btn.text = " " + tab_label
	btn.alignment = HORIZONTAL_ALIGNMENT_LEFT
	btn.disabled = true
	sidebar_container.add_child(btn)

## Core view swapper
func switch_to_tab(tab_id: String) -> void:
	current_tab = tab_id
	
	# Clear previous content
	for child in content_vbox.get_children():
		child.queue_free()
		
	match tab_id:
		"home":
			render_home_hub()
		"event":
			render_event_hub()
		"expedition":
			render_expedition_levels()
		"endless":
			render_endless_vault()
		"daily":
			render_daily_challenge()
		"boosters":
			render_booster_inventory()
		"settings":
			render_settings()

## SCREEN 1: Home Hub Overview
func render_home_hub() -> void:
	var title := Label.new()
	title.text = "🔮 CRYSTAL VAULT CHAMBER"
	title.add_theme_font_size_override("font_size", 22)
	title.modulate = Color(0.8, 0.85, 1.0, 1.0)
	content_vbox.add_child(title)
	
	# Event & Energy Summary Banner
	if CVSaveManager:
		var att_info := CVSaveManager.get_attempts_info()
		var e_panel := PanelContainer.new()
		var e_hbox := HBoxContainer.new()
		e_hbox.add_theme_constant_override("separation", 20)
		e_panel.add_child(e_hbox)
		
		var att_lbl := Label.new()
		att_lbl.text = "⚡ Attempts: %d/%d" % [att_info["attempts"], att_info["max"]]
		att_lbl.add_theme_font_size_override("font_size", 14)
		att_lbl.modulate = Color(1.0, 0.85, 0.3, 1.0)
		e_hbox.add_child(att_lbl)
		
		if att_info["attempts"] < att_info["max"]:
			var regen_mins := int(att_info["next_regen_sec"]) / 60
			var regen_secs := int(att_info["next_regen_sec"]) % 60
			var timer_lbl := Label.new()
			timer_lbl.text = "⏱️ +1 in %02d:%02d" % [regen_mins, regen_secs]
			timer_lbl.modulate = Color(0.7, 0.7, 0.8, 1.0)
			e_hbox.add_child(timer_lbl)
			
		var buy_att_btn := Button.new()
		buy_att_btn.text = "➕ Get More Attempts"
		buy_att_btn.pressed.connect(func():
			if CrystalVaultManager:
				CrystalVaultManager.request_purchase_attempts(5)
				update_currency_displays()
				render_home_hub()
		)
		e_hbox.add_child(buy_att_btn)
		
		content_vbox.add_child(e_panel)
		
	var desc := Label.new()
	desc.text = "Welcome, Software Architect, to Crownspire's sacred Reliquary.\nConsolidate raw stardust elements on the 7-slot tray Altar to purify the crystals.\nMatch triplets to trigger elemental reactions and restore order."
	desc.autowrap_mode = TextServer.AUTOWRAP_WORD
	content_vbox.add_child(desc)
	
	var stat_title := Label.new()
	stat_title.text = "📊 SQUAD STATISTICS"
	stat_title.add_theme_font_size_override("font_size", 14)
	stat_title.modulate = Color(0.9, 0.85, 0.5, 1.0)
	content_vbox.add_child(stat_title)
	
	var grid := GridContainer.new()
	grid.columns = 2
	grid.add_theme_constant_override("h_separation", 40)
	grid.add_theme_constant_override("v_separation", 8)
	content_vbox.add_child(grid)
	
	if CVSaveManager:
		add_stat_row(grid, "Total Victories:", str(CVSaveManager.stats.get("total_wins", 0)))
		add_stat_row(grid, "Total Congestions (Defeats):", str(CVSaveManager.stats.get("total_defeats", 0)))
		add_stat_row(grid, "Matches Consolidated:", str(CVSaveManager.stats.get("total_matches", 0)))
		add_stat_row(grid, "Peak Matching Combo:", "x" + str(CVSaveManager.stats.get("peak_combo", 0)))
		add_stat_row(grid, "Tactical Undos Evoked:", str(CVSaveManager.stats.get("undos_used", 0)))
		add_stat_row(grid, "Tactical Shuffles Evoked:", str(CVSaveManager.stats.get("shuffles_used", 0)))
		add_stat_row(grid, "Tactical Hints Evoked:", str(CVSaveManager.stats.get("hints_used", 0)))
		
		var streak_lbl := Label.new()
		streak_lbl.text = "Daily Purification Streak: %d days 🔥" % CVSaveManager.daily_streak
		streak_lbl.add_theme_font_size_override("font_size", 14)
		streak_lbl.modulate = Color(1.0, 0.55, 0.2, 1.0)
		content_vbox.add_child(streak_lbl)

#============================================================================
# SCREEN 1B: 4-DAY LIMITED EVENT HUB ("ASTRAL CONVERGENCE")
#============================================================================
func render_event_hub() -> void:
	var att_info := CVSaveManager.get_attempts_info() if CVSaveManager else {"attempts": 10, "max": 10, "next_regen_sec": 0, "event_time_remaining": 345600, "current_event_day": 1, "event_active": true}
	var is_event_active: bool = bool(att_info.get("event_active", true))
	
	# Header Banner
	var banner_panel := PanelContainer.new()
	var banner_vbox := VBoxContainer.new()
	banner_vbox.add_theme_constant_override("separation", 6)
	banner_panel.add_child(banner_vbox)
	
	var title := Label.new()
	if is_event_active:
		title.text = "🌟 RECURRING EVENT: ASTRAL CONVERGENCE"
		title.modulate = Color(1.0, 0.85, 0.3, 1.0)
	else:
		title.text = "🛑 EVENT ENDED (INACTIVE)"
		title.modulate = Color(1.0, 0.4, 0.4, 1.0)
	title.add_theme_font_size_override("font_size", 22)
	banner_vbox.add_child(title)
	
	var timer_lbl := Label.new()
	if is_event_active:
		var rem_sec := int(att_info["event_time_remaining"])
		var days_left := rem_sec / 86400
		var hrs_left := (rem_sec % 86400) / 3600
		var mins_left := (rem_sec % 3600) / 60
		timer_lbl.text = "⏳ Event Ends In: %dd %02dh %02dm  |  Event Day: %d of 4" % [days_left, hrs_left, mins_left, att_info["current_event_day"]]
		timer_lbl.modulate = Color(0.8, 0.9, 1.0, 1.0)
	else:
		timer_lbl.text = "⏳ Event Status: INACTIVE (Awaiting next event instance)"
		timer_lbl.modulate = Color(0.8, 0.5, 0.5, 1.0)
	timer_lbl.add_theme_font_size_override("font_size", 13)
	banner_vbox.add_child(timer_lbl)
	
	content_vbox.add_child(banner_panel)
	
	# --- SECTION A: DAILY VAULT GIFTS ---
	var gift_title := Label.new()
	gift_title.text = "🎁 DAILY VAULT GIFTS (FREE EVENT BOOSTERS)"
	gift_title.add_theme_font_size_override("font_size", 15)
	gift_title.modulate = Color(0.5, 0.9, 1.0, 1.0)
	content_vbox.add_child(gift_title)
	
	var gifts_hbox := HBoxContainer.new()
	gifts_hbox.add_theme_constant_override("separation", 10)
	content_vbox.add_child(gifts_hbox)
	
	# Daily Gifts structure - exactly 1 booster per gift total!
	var daily_gifts_data := [
		{"day": 1, "label": "Day 1 Supply", "shards": 100, "boosters": {"undo": 1}},
		{"day": 2, "label": "Day 2 Tactical", "shards": 150, "boosters": {"withdraw": 1}},
		{"day": 3, "label": "Day 3 Sight & Shift", "shards": 200, "boosters": {"shuffle": 1}},
		{"day": 4, "label": "Day 4 Grand Relic", "shards": 300, "boosters": {"insight": 1}}
	]
	
	for gift in daily_gifts_data:
		var g_day: int = gift["day"]
		var g_panel := PanelContainer.new()
		g_panel.custom_minimum_size = Vector2(170, 110)
		
		var g_vbox := VBoxContainer.new()
		g_vbox.add_theme_constant_override("separation", 4)
		g_panel.add_child(g_vbox)
		
		var g_lbl := Label.new()
		g_lbl.text = gift["label"]
		g_lbl.add_theme_font_size_override("font_size", 13)
		g_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		g_vbox.add_child(g_lbl)
		
		var g_desc := Label.new()
		g_desc.text = "💎 %d Shards\n" % gift["shards"]
		var b_dict: Dictionary = gift["boosters"]
		for b_k in b_dict.keys():
			g_desc.text += "+%d %s " % [b_dict[b_k], b_k.capitalize()]
		g_desc.add_theme_font_size_override("font_size", 10)
		g_desc.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		g_desc.modulate = Color(0.8, 0.8, 0.8, 1.0)
		g_vbox.add_child(g_desc)
		
		var is_claimed := not CVSaveManager.can_claim_daily_gift(g_day) if CVSaveManager else false
		var is_available := is_event_active and (g_day <= att_info["current_event_day"]) and not is_claimed
		
		var claim_btn := Button.new()
		if is_claimed:
			claim_btn.text = "✅ Claimed"
			claim_btn.disabled = true
		elif is_available:
			claim_btn.text = "Claim Gift!"
			claim_btn.pressed.connect(func():
				if CVSaveManager and CVSaveManager.claim_daily_gift(g_day, gift):
					if CrystalVaultManager:
						CrystalVaultManager.notify_event_reward_claimed("daily_gift", gift)
					update_currency_displays()
					switch_to_tab("event")
			)
		else:
			claim_btn.text = "Locked (Day %d)" % g_day if is_event_active else "Event Ended"
			claim_btn.disabled = true
			
		g_vbox.add_child(claim_btn)
		gifts_hbox.add_child(g_panel)
		
	# --- SECTION B: EVENT STAGE MILESTONES ---
	var stage_title := Label.new()
	stage_title.text = "🏆 EVENT STAGE PROGRESSION"
	stage_title.add_theme_font_size_override("font_size", 15)
	stage_title.modulate = Color(1.0, 0.7, 0.4, 1.0)
	content_vbox.add_child(stage_title)
	
	# NO premium puzzle boosters awarded from stage rewards!
	var event_stages_data := [
		{"stage": 1, "name": "Stage 1: Pyramid Altar", "layout": "pyramid_peak", "shards": 100, "resources": "1000 Gold"},
		{"stage": 2, "name": "Stage 2: Stellar Bastion", "layout": "stellar_fortress", "shards": 150, "resources": "2000 Stone"},
		{"stage": 3, "name": "Stage 3: Obsidian Core", "layout": "obsidian_obelisk", "shards": 200, "resources": "3000 Wood"},
		{"stage": 4, "name": "Stage 4: Golden Reliquary", "layout": "golden_altar", "shards": 250, "resources": "5 Starlight Orbs"},
		{"stage": 5, "name": "Stage 5: Dragon Apex", "layout": "dragon_spine", "shards": 500, "resources": "10000 Gold + 10 Orbs"}
	]
	
	for s_data in event_stages_data:
		var s_num: int = s_data["stage"]
		var s_panel := PanelContainer.new()
		var s_hbox := HBoxContainer.new()
		s_hbox.add_theme_constant_override("separation", 15)
		s_panel.add_child(s_hbox)
		
		var s_vbox := VBoxContainer.new()
		s_vbox.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		s_hbox.add_child(s_vbox)
		
		var s_lbl := Label.new()
		s_lbl.text = s_data["name"]
		s_lbl.add_theme_font_size_override("font_size", 14)
		s_lbl.modulate = Color(1.0, 0.9, 0.6, 1.0)
		s_vbox.add_child(s_lbl)
		
		var s_rew := Label.new()
		s_rew.text = "Reward: 💎 %d Shards + %s" % [s_data["shards"], s_data["resources"]]
		s_rew.add_theme_font_size_override("font_size", 11)
		s_rew.modulate = Color(0.8, 0.8, 0.8, 1.0)
		s_vbox.add_child(s_rew)
		
		var is_claimed := CVSaveManager.is_stage_claimed(s_num) if CVSaveManager else false
		
		var play_btn := Button.new()
		if is_event_active:
			play_btn.text = " Play Stage "
			play_btn.pressed.connect(func(): launch_puzzle_board("expedition", "stage_%d" % s_num, s_data["layout"]))
		else:
			play_btn.text = "🔒 Event Inactive"
			play_btn.disabled = true
		s_hbox.add_child(play_btn)
		
		var claim_btn := Button.new()
		if is_claimed:
			claim_btn.text = "✅ Cleared"
			claim_btn.disabled = true
		else:
			claim_btn.text = "Claim Reward"
			claim_btn.disabled = not is_event_active
			claim_btn.pressed.connect(func():
				if CVSaveManager and CVSaveManager.claim_stage_reward(s_num, s_data):
					if CrystalVaultManager:
						CrystalVaultManager.notify_event_reward_claimed("stage_reward", s_data)
					update_currency_displays()
					switch_to_tab("event")
			)
		s_hbox.add_child(claim_btn)
		content_vbox.add_child(s_panel)

#============================================================================
# SCREEN 1C: BOOSTER INVENTORY & PRESERVED CONSUMABLES SHOP
#============================================================================
func render_booster_inventory() -> void:
	var title := Label.new()
	title.text = "🎒 TACTICAL BOOSTER INVENTORY"
	title.add_theme_font_size_override("font_size", 20)
	title.modulate = Color(0.4, 0.8, 1.0, 1.0)
	content_vbox.add_child(title)
	
	var desc := Label.new()
	desc.text = "Boosters enhance board manipulation during runs. Unused boosters persist safely across event cycles and sessions."
	desc.autowrap_mode = TextServer.AUTOWRAP_WORD
	content_vbox.add_child(desc)
	
	var boosters_data := [
		{"id": "undo", "name": "↩️ Undo Booster", "desc": "Reverses tile selection and restores board/tray positioning."},
		{"id": "withdraw", "name": "📥 Withdraw Booster", "desc": "Returns up to 3 tiles from congested tray back to active board."},
		{"id": "shuffle", "name": "🔀 Shuffle Booster", "desc": "Rearranges all remaining active board tile elements."},
		{"id": "insight", "name": "💡 Insight Booster", "desc": "Highlights available unblocked tile triplet pairs on the board."},
		{"id": "extra_slot", "name": "➕ Extra Slot Booster", "desc": "Expands Relic Altar tray capacity from 7 to 8 slots for a run."}
	]
	
	for b in boosters_data:
		var b_id: String = b["id"]
		var count := CVSaveManager.get_booster_count(b_id) if CVSaveManager else 0
		
		var panel := PanelContainer.new()
		var hbox := HBoxContainer.new()
		hbox.add_theme_constant_override("separation", 15)
		panel.add_child(hbox)
		
		var vbox := VBoxContainer.new()
		vbox.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		hbox.add_child(vbox)
		
		var name_lbl := Label.new()
		name_lbl.text = b["name"] + "  (In Inventory: x%d)" % count
		name_lbl.add_theme_font_size_override("font_size", 14)
		name_lbl.modulate = Color(1.0, 0.9, 0.5, 1.0)
		vbox.add_child(name_lbl)
		
		var desc_lbl := Label.new()
		desc_lbl.text = b["desc"]
		desc_lbl.add_theme_font_size_override("font_size", 11)
		desc_lbl.modulate = Color(0.75, 0.75, 0.75, 1.0)
		vbox.add_child(desc_lbl)
		
		var buy_btn := Button.new()
		buy_btn.text = "Get More Booster"
		buy_btn.pressed.connect(func():
			if CrystalVaultManager:
				CrystalVaultManager.request_purchase_booster(b_id)
				update_currency_displays()
				switch_to_tab("boosters")
		)
		hbox.add_child(buy_btn)
		
		content_vbox.add_child(panel)

func add_stat_row(grid: GridContainer, label_text: String, val_text: String) -> void:
	var lbl := Label.new()
	lbl.text = label_text
	grid.add_child(lbl)
	
	var val := Label.new()
	val.text = val_text
	val.modulate = Color(0.7, 0.9, 0.7, 1.0)
	grid.add_child(val)

## SCREEN 2: Expedition Levels Grid (1-1 to 1-5 with Stars)
func render_expedition_levels() -> void:
	var title := Label.new()
	title.text = "🗺️ HANDCRAFTED EXPEDITIONS"
	title.add_theme_font_size_override("font_size", 20)
	title.modulate = Color(0.5, 0.85, 1.0, 1.0)
	content_vbox.add_child(title)
	
	var levels_grid := GridContainer.new()
	levels_grid.columns = 1
	levels_grid.add_theme_constant_override("v_separation", 15)
	content_vbox.add_child(levels_grid)
	
	var levels_data := [
		{"id": "1_1", "layout": "pyramid_peak", "name": "Level 1-1: Pyramid Peak", "desc": "Symmetrical base matching. Ideal for beginners.", "tiles": 36, "diff": "Easy"},
		{"id": "1_2", "layout": "stellar_fortress", "name": "Level 1-2: Stellar Fortress", "desc": "Double-cross layout with blocked wings.", "tiles": 54, "diff": "Medium"},
		{"id": "1_3", "layout": "obsidian_obelisk", "name": "Level 1-3: Obsidian Obelisk", "desc": "Deep vertical stacks. High planning required.", "tiles": 72, "diff": "Hard"},
		{"id": "1_4", "layout": "golden_altar", "name": "Level 1-4: Golden Altar", "desc": "Bento grid distribution with central blocking.", "tiles": 54, "diff": "Medium"},
		{"id": "1_5", "layout": "dragon_spine", "name": "Level 1-5: Dragon Spine", "desc": "Intricate overlapping wings of high difficulty.", "tiles": 72, "diff": "Hard"}
	]
	
	for lvl in levels_data:
		var panel := PanelContainer.new()
		panel.custom_minimum_size = Vector2(500, 80)
		
		var hbox := HBoxContainer.new()
		hbox.add_theme_constant_override("separation", 20)
		panel.add_child(hbox)
		
		# Info Box
		var info_vbox := VBoxContainer.new()
		info_vbox.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		hbox.add_child(info_vbox)
		
		var name_lbl := Label.new()
		name_lbl.text = lvl["name"] + "  (" + lvl["diff"] + ")"
		name_lbl.add_theme_font_size_override("font_size", 14)
		name_lbl.modulate = Color(1.0, 1.0, 0.8, 1.0) if lvl["diff"] == "Easy" else (Color(1.0, 0.8, 0.4, 1.0) if lvl["diff"] == "Medium" else Color(1.0, 0.4, 0.4, 1.0))
		info_vbox.add_child(name_lbl)
		
		var desc_lbl := Label.new()
		desc_lbl.text = lvl["desc"] + " [%d Crystals]" % lvl["tiles"]
		desc_lbl.add_theme_font_size_override("font_size", 11)
		desc_lbl.modulate = Color(0.7, 0.7, 0.7, 1.0)
		info_vbox.add_child(desc_lbl)
		
		# Star rating displays
		var stars_lbl := Label.new()
		var stars_earned: int = CVSaveManager.completed_levels.get(lvl["id"], 0) if CVSaveManager else 0
		stars_lbl.text = ""
		for i in range(3):
			if i < stars_earned:
				stars_lbl.text += "⭐ "
			else:
				stars_lbl.text += "☆ "
		stars_lbl.add_theme_font_size_override("font_size", 16)
		stars_lbl.modulate = Color(1.0, 0.85, 0.2, 1.0)
		info_vbox.add_child(stars_lbl)
		
		# Button trigger
		var btn := Button.new()
		btn.text = " Confront "
		btn.pressed.connect(func(): launch_puzzle_board("expedition", lvl["id"], lvl["layout"]))
		hbox.add_child(btn)
		
		levels_grid.add_child(panel)

## SCREEN 3: Endless Vault Climbing
func render_endless_vault() -> void:
	var title := Label.new()
	title.text = "⚔️ ENDLESS CRYPT DESCENT"
	title.add_theme_font_size_override("font_size", 20)
	title.modulate = Color(0.9, 0.4, 1.0, 1.0)
	content_vbox.add_child(title)
	
	var max_floor := CVSaveManager.max_endless_floor if CVSaveManager else 0
	var next_floor := max_floor + 1
	
	var desc := Label.new()
	desc.text = "Confront procedurally generated, layered coordinate stacks.\nEach subsequent floor adds unique, unpredictable layouts. Your progression increases with every victory."
	desc.autowrap_mode = TextServer.AUTOWRAP_WORD
	content_vbox.add_child(desc)
	
	var progress_lbl := Label.new()
	progress_lbl.text = "Current Depth: Floor %d" % next_floor
	progress_lbl.add_theme_font_size_override("font_size", 16)
	progress_lbl.modulate = Color(0.5, 1.0, 0.5, 1.0)
	content_vbox.add_child(progress_lbl)
	
	var btn := Button.new()
	btn.text = " ⚔️ Descend Into Floor %d " % next_floor
	btn.custom_minimum_size = Vector2(250, 50)
	btn.pressed.connect(func(): launch_puzzle_board("endless", str(next_floor), "procedural"))
	content_vbox.add_child(btn)

## SCREEN 4: Daily Extreme Challenge
func render_daily_challenge() -> void:
	var title := Label.new()
	title.text = "🧪 DAILY EXTREME CRUCIBLE"
	title.add_theme_font_size_override("font_size", 20)
	title.modulate = Color(1.0, 0.5, 0.2, 1.0)
	content_vbox.add_child(title)
	
	var desc := Label.new()
	desc.text = "Daily Extreme features an extremely dense layout of 72 tiles with a quick combo decay.\nCompleting it awards massive currency and starlight bonuses, raising your global stats."
	desc.autowrap_mode = TextServer.AUTOWRAP_WORD
	content_vbox.add_child(desc)
	
	var streak_lbl := Label.new()
	var streak: int = CVSaveManager.daily_streak if CVSaveManager else 0
	streak_lbl.text = "Purification Streak: %d days" % streak
	streak_lbl.add_theme_font_size_override("font_size", 14)
	streak_lbl.modulate = Color(1.0, 0.85, 0.2, 1.0)
	content_vbox.add_child(streak_lbl)
	
	var completed := CVSaveManager.daily_completed_today if CVSaveManager else false
	
	var status_lbl := Label.new()
	status_lbl.text = "Status: " + ("✅ COMPLETED FOR TODAY" if completed else "🔴 READY FOR DEPLOYMENT")
	status_lbl.modulate = Color(0.5, 1.0, 0.5, 1.0) if completed else Color(1.0, 0.4, 0.4, 1.0)
	content_vbox.add_child(status_lbl)
	
	var btn := Button.new()
	btn.text = " Play Daily Extreme "
	btn.custom_minimum_size = Vector2(250, 50)
	btn.disabled = completed
	btn.pressed.connect(func(): launch_puzzle_board("daily", "daily_extreme", "extreme"))
	content_vbox.add_child(btn)

## SCREEN 5: Preferenced Settings & Themes
func render_settings() -> void:
	var title := Label.new()
	title.text = "⚙️ CRYPTIC PREFERENCES"
	title.add_theme_font_size_override("font_size", 20)
	title.modulate = Color(0.8, 0.8, 0.8, 1.0)
	content_vbox.add_child(title)
	
	# Master Vol
	var master_lbl := Label.new()
	master_lbl.text = "Master Volume: 80%"
	content_vbox.add_child(master_lbl)
	
	var master_slider := HSlider.new()
	master_slider.value = 80
	master_slider.value_changed.connect(func(v): master_lbl.text = "Master Volume: %d%%" % int(v))
	content_vbox.add_child(master_slider)
	
	# Accessibility Symbols Checkbox
	var acc_btn := CheckButton.new()
	acc_btn.text = "Enable High-Contrast Accessibility Symbols"
	acc_btn.button_pressed = true
	content_vbox.add_child(acc_btn)
	
	# Spacing
	var spacer := Control.new()
	spacer.custom_minimum_size = Vector2(0, 20)
	content_vbox.add_child(spacer)
	
	# Delete save button
	var reset_title := Label.new()
	reset_title.text = "⚠️ profile WIPE ACTIONS (IRREVERSIBLE)"
	reset_title.add_theme_font_size_override("font_size", 12)
	reset_title.modulate = Color(1.0, 0.3, 0.3, 1.0)
	content_vbox.add_child(reset_title)
	
	var reset_btn := Button.new()
	reset_btn.text = "⚠️ RESET PROFILE PROGRESSION ⚠️"
	reset_btn.modulate = Color(1.0, 0.5, 0.5, 1.0)
	
	var feedback_lbl := Label.new()
	feedback_lbl.text = ""
	feedback_lbl.modulate = Color(1.0, 0.8, 0.2, 1.0)
	
	reset_btn.pressed.connect(func():
		if CVSaveManager:
			CVSaveManager.reset_save_data()
			update_currency_displays()
			feedback_lbl.text = "Success: Progress and currencies wiped to default."
	)
	
	content_vbox.add_child(reset_btn)
	content_vbox.add_child(feedback_lbl)

## Gameplay board instantiation manager
func launch_puzzle_board(mode_id: String, level_id: String, layout_id: String) -> void:
	# Consume entry attempt for event stages
	if level_id.begins_with("stage_"):
		if CVSaveManager:
			if not CVSaveManager.consume_attempt():
				print("[CrystalVaultLobby] Cannot launch event stage: 0 attempts or event inactive.")
				if CrystalVaultManager:
					CrystalVaultManager.request_purchase_attempts(5)
				return

	# Hide Lobby's primary visual elements
	$MarginContainer.visible = false
	
	# Instantiate and mount PuzzleBoard
	var board := BOARD_SCENE.instantiate()
	add_child(board)
	
	# Register and load board mode
	board.active_mode = mode_id
	board.active_level_id = level_id
	board.active_layout_id = layout_id
	
	if mode_id == "expedition":
		board.start_expedition_level(level_id, layout_id)
	elif mode_id == "endless":
		board.start_endless_floor(int(level_id))
	elif mode_id == "daily":
		board.start_daily_extreme()
		
	# Connect cleanup return handlers
	board.board_exited.connect(func():
		$MarginContainer.visible = true
		update_currency_displays()
		switch_to_tab(current_tab)
	)

## Triggered when player requests exiting back to the main city map
func _on_exit_button_pressed() -> void:
	if CrystalVaultManager:
		CrystalVaultManager.exit_crystal_vault()
	else:
		get_tree().quit() # Graceful exit if running standalone!

func _on_resonance_updated(_new_val: int) -> void:
	update_currency_displays()
