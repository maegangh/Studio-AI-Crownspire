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
	add_sidebar_tab_button("expedition", "🗺️ Expedition Levels")
	add_sidebar_tab_button("endless", "⚔️ Endless Vault")
	add_sidebar_tab_button("daily", "🧪 Daily Extreme")
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
		"expedition":
			render_expedition_levels()
		"endless":
			render_endless_vault()
		"daily":
			render_daily_challenge()
		"settings":
			render_settings()

## SCREEN 1: Home Hub Overview
func render_home_hub() -> void:
	var title := Label.new()
	title.text = "🔮 CRYSTAL VAULT CHAMBER"
	title.add_theme_font_size_override("font_size", 22)
	title.modulate = Color(0.8, 0.85, 1.0, 1.0)
	content_vbox.add_child(title)
	
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
