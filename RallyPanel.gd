# ==============================================================================
# Crownspire MMO Strategy Game - Alliance Rally System Controller
# Godot 4 / GDScript 2.0 Client-side persistent alliance rally coordinator
# ==============================================================================
# Manages cooperative rally creation, joining queues, real-time countdowns,
# troop allocations, hero deployments, power checks, and persistent saves.
# ==============================================================================

extends Control

# --- Constant Save Location ---
const SAVE_FILE_PATH = "user://crownspire_rallies_v1.save"

# --- Static Target Profiles ---
const RALLY_TARGETS = [
	{ "id": "infernal_beast", "name": "Infernal Beast [Alliance Raid Boss]", "power": 10000000, "coords": "X: 500, Y: 500" },
	{ "id": "scourge_wyrm", "name": "Ancient Scourge Wyrm [Lv.40]", "power": 6500000, "coords": "X: 425, Y: 890" },
	{ "id": "titan_golem", "name": "Shattered Titan Golem [Lv.35]", "power": 4200000, "coords": "X: 112, Y: 642" },
	{ "id": "bandit_citadel", "name": "Rogue Sovereign Fortress [Lv.30]", "power": 2800000, "coords": "X: 715, Y: 335" },
	{ "id": "abyssal_beast", "name": "Scylla Abyssal Beast [Lv.25]", "power": 1900000, "coords": "X: 904, Y: 120" }
]

const TIMER_OPTIONS = [
	{ "sec": 300, "label": "5 Minutes" },
	{ "sec": 600, "label": "10 Minutes" },
	{ "sec": 1800, "label": "30 Minutes" },
	{ "sec": 3600, "label": "1 Hour" }
]

# --- Onready UI Nodes ---
@onready var btn_create_new: Button = $Layout/Header/Margin/HBox/BtnCreateNew
@onready var btn_close: Button = $Layout/Header/Margin/HBox/CloseButton
@onready var count_badge: Label = $Layout/MainPanel/LeftSection/Margin/HBox/CountBadge
@onready var rally_list: VBoxContainer = $Layout/MainPanel/LeftSection/RalliesScroll/RallyList

# --- Detail View Nodes ---
@onready var detail_container: PanelContainer = $Layout/MainPanel/RightSection/RallyDetailContainer
@onready var no_selection_panel: CenterContainer = $Layout/MainPanel/RightSection/RallyDetailContainer/NoRallySelected
@onready var details_panel: VBoxContainer = $Layout/MainPanel/RightSection/RallyDetailContainer/RallyDetails
@onready var target_name_label: Label = $Layout/MainPanel/RightSection/RallyDetailContainer/RallyDetails/RallyHeader/TargetName
@onready var btn_join_reinforce: Button = $Layout/MainPanel/RightSection/RallyDetailContainer/RallyDetails/RallyHeader/BtnJoin
@onready var march_status_label: Label = $Layout/MainPanel/RightSection/RallyDetailContainer/RallyDetails/MarchPreview/HBox/Status
@onready var march_timer_label: Label = $Layout/MainPanel/RightSection/RallyDetailContainer/RallyDetails/MarchPreview/HBox/Timer
@onready var march_progress_bar: ProgressBar = $Layout/MainPanel/RightSection/RallyDetailContainer/RallyDetails/MarchPreview/ProgressBar
@onready var creator_label: Label = $Layout/MainPanel/RightSection/RallyDetailContainer/RallyDetails/VanguardInfo/Creator
@onready var est_power_label: Label = $Layout/MainPanel/RightSection/RallyDetailContainer/RallyDetails/VanguardInfo/PowerEstimate
@onready var participants_container: VBoxContainer = $Layout/MainPanel/RightSection/RallyDetailContainer/RallyDetails/ParticipantsList/Scroll/List

# --- Dialog Windows ---
@onready var popup_create: ColorRect = $Dialogs/CreateRallyPopup
@onready var opt_create_target: OptionButton = $Dialogs/CreateRallyPopup/Center/Panel/Margin/VBox/TargetSelector/Option
@onready var opt_create_timer: OptionButton = $Dialogs/CreateRallyPopup/Center/Panel/Margin/VBox/TimerSelector/Option
@onready var opt_create_hero: OptionButton = $Dialogs/CreateRallyPopup/Center/Panel/Margin/VBox/HeroSelect/Option
@onready var slider_infantry: HSlider = $Dialogs/CreateRallyPopup/Center/Panel/Margin/VBox/Troops/Infantry/Slider
@onready var lbl_inf_val: Label = $Dialogs/CreateRallyPopup/Center/Panel/Margin/VBox/Troops/Infantry/Value
@onready var slider_marksmen: HSlider = $Dialogs/CreateRallyPopup/Center/Panel/Margin/VBox/Troops/Marksmen/Slider
@onready var lbl_mark_val: Label = $Dialogs/CreateRallyPopup/Center/Panel/Margin/VBox/Troops/Marksmen/Value
@onready var slider_cavalry: HSlider = $Dialogs/CreateRallyPopup/Center/Panel/Margin/VBox/Troops/Cavalry/Slider
@onready var lbl_cav_val: Label = $Dialogs/CreateRallyPopup/Center/Panel/Margin/VBox/Troops/Cavalry/Value
@onready var lbl_est_power: Label = $Dialogs/CreateRallyPopup/Center/Panel/Margin/VBox/EstPower
@onready var btn_create_cancel: Button = $Dialogs/CreateRallyPopup/Center/Panel/Margin/VBox/Buttons/BtnCancel
@onready var btn_create_launch: Button = $Dialogs/CreateRallyPopup/Center/Panel/Margin/VBox/Buttons/BtnLaunch

@onready var popup_join: ColorRect = $Dialogs/JoinRallyPopup
@onready var opt_join_hero: OptionButton = $Dialogs/JoinRallyPopup/Center/Panel/Margin/VBox/HeroSelect/Option
@onready var slider_join_infantry: HSlider = $Dialogs/JoinRallyPopup/Center/Panel/Margin/VBox/Troops/Infantry/Slider
@onready var lbl_join_inf: Label = $Dialogs/JoinRallyPopup/Center/Panel/Margin/VBox/Troops/Infantry/Value
@onready var slider_join_marksmen: HSlider = $Dialogs/JoinRallyPopup/Center/Panel/Margin/VBox/Troops/Marksmen/Slider
@onready var lbl_join_mark: Label = $Dialogs/JoinRallyPopup/Center/Panel/Margin/VBox/Troops/Marksmen/Value
@onready var slider_join_cavalry: HSlider = $Dialogs/JoinRallyPopup/Center/Panel/Margin/VBox/Troops/Cavalry/Slider
@onready var lbl_join_cav: Label = $Dialogs/JoinRallyPopup/Center/Panel/Margin/VBox/Troops/Cavalry/Value
@onready var btn_join_cancel: Button = $Dialogs/JoinRallyPopup/Center/Panel/Margin/VBox/Buttons/BtnCancel
@onready var btn_join_submit: Button = $Dialogs/JoinRallyPopup/Center/Panel/Margin/VBox/Buttons/BtnJoin

# --- Internal Database State ---
var _rallies: Array = []
var _selected_rally_id: String = ""
var _player_troops: Dictionary = { "infantry": 45000, "marksmen": 38000, "cavalry": 25000 }
var _player_heroes: Array = ["Maegan [Lv.50]", "Godot Sage [Lv.45]", "Kael Vanguard [Lv.40]"]

# ==============================================================================
# LIFECYCLE CALLBACKS
# ==============================================================================

func _ready() -> void:
	print("[RallyPanel] Launching Co-op Strategic Rally Console...")
	
	_load_rallies_state()
	_init_dropdowns()
	_connect_signals()
	_update_rally_list_ui()
	_show_selected_rally_details()

func _process(delta: float) -> void:
	# Tick timers on active rallies
	var changed = false
	for r in _rallies:
		if r.timeRemainingSec > 0:
			r.timeRemainingSec -= delta
			if r.timeRemainingSec <= 0:
				r.timeRemainingSec = 0
				_execute_combat_completion(r)
			changed = true
	
	if changed:
		_update_rally_list_ui()
		_show_selected_rally_details()

# ==============================================================================
# EVENT CONNECTION & SIGNALS
# ==============================================================================

func _connect_signals() -> void:
	btn_create_new.pressed.connect(_on_btn_create_new_pressed)
	btn_close.pressed.connect(_on_btn_close_pressed)
	btn_create_cancel.pressed.connect(_on_btn_create_cancel_pressed)
	btn_create_launch.pressed.connect(_on_btn_create_launch_pressed)
	btn_join_reinforce.pressed.connect(_on_btn_join_pressed)
	btn_join_cancel.pressed.connect(_on_btn_join_cancel_pressed)
	btn_join_submit.pressed.connect(_on_btn_join_submit_pressed)
	
	# Sliders values hooks for real-time power updates
	slider_infantry.value_changed.connect(func(v):
		lbl_inf_val.text = str(v)
		_recalc_create_power()
	)
	slider_marksmen.value_changed.connect(func(v):
		lbl_mark_val.text = str(v)
		_recalc_create_power()
	)
	slider_cavalry.value_changed.connect(func(v):
		lbl_cav_val.text = str(v)
		_recalc_create_power()
	)
	
	slider_join_infantry.value_changed.connect(func(v): lbl_join_inf.text = str(v))
	slider_join_marksmen.value_changed.connect(func(v): lbl_join_mark.text = str(v))
	slider_join_cavalry.value_changed.connect(func(v): lbl_join_cav.text = str(v))

func _init_dropdowns() -> void:
	# Populate Targets OptionButton
	opt_create_target.clear()
	for t in RALLY_TARGETS:
		opt_create_target.add_item(t.name)
		
	# Populate Timer OptionButton
	opt_create_timer.clear()
	for opt in TIMER_OPTIONS:
		opt_create_timer.add_item(opt.label)
		
	# Populate Heroes OptionButton
	opt_create_hero.clear()
	opt_join_hero.clear()
	for h in _player_heroes:
		opt_create_hero.add_item(h)
		opt_join_hero.add_item(h)
		
	# Populate Slider Max Bounds
	slider_infantry.max_value = _player_troops.infantry
	slider_marksmen.max_value = _player_troops.marksmen
	slider_cavalry.max_value = _player_troops.cavalry
	
	slider_join_infantry.max_value = _player_troops.infantry / 2
	slider_join_marksmen.max_value = _player_troops.marksmen / 2
	slider_join_cavalry.max_value = _player_troops.cavalry / 2

# ==============================================================================
# DIALOG TRIGGERS
# ==============================================================================

func _on_btn_create_new_pressed() -> void:
	popup_create.visible = true
	_recalc_create_power()

func _on_btn_create_cancel_pressed() -> void:
	popup_create.visible = false

func _on_btn_close_pressed() -> void:
	self.queue_free()

func _on_btn_join_pressed() -> void:
	popup_join.visible = true

func _on_btn_join_cancel_pressed() -> void:
	popup_join.visible = false

# ==============================================================================
# LOGIC CORE: CREATING & JOINING
# ==============================================================================

func _recalc_create_power() -> void:
	var inf = slider_infantry.value
	var mark = slider_marksmen.value
	var cav = slider_cavalry.value
	var total_power = (inf * 8) + (mark * 10) + (cav * 12)
	lbl_est_power.text = "March Power Estimate: " + _format_num(total_power) + " CR"

func _on_btn_create_launch_pressed() -> void:
	var target_idx = opt_create_target.selected
	var timer_idx = opt_create_timer.selected
	var hero_idx = opt_create_hero.selected
	
	var target = RALLY_TARGETS[target_idx]
	var timer = TIMER_OPTIONS[timer_idx]
	var hero = _player_heroes[hero_idx]
	
	var inf = slider_infantry.value
	var mark = slider_marksmen.value
	var cav = slider_cavalry.value
	
	if inf == 0 and mark == 0 and cav == 0:
		print("[Rally] Cannot launch a zero troop march vanguard force!")
		return
		
	var rally_id = "rally_" + str(Time.get_ticks_msec())
	
	var new_rally = {
		"id": rally_id,
		"targetId": target.id,
		"targetName": target.name,
		"targetCoords": target.coords,
		"creator": "Sovereign Lord (Player)",
		"timeRemainingSec": float(timer.sec),
		"totalDurationSec": float(timer.sec),
		"participants": [
			{
				"name": "Sovereign Lord (You)",
				"hero": hero,
				"infantry": int(inf),
				"marksmen": int(mark),
				"cavalry": int(cav),
				"power": int((inf * 8) + (mark * 10) + (cav * 12))
			}
		]
	}
	
	_rallies.push_back(new_rally)
	_selected_rally_id = rally_id
	popup_create.visible = false
	
	# Subtract troops
	_player_troops.infantry -= inf
	_player_troops.marksmen -= mark
	_player_troops.cavalry -= cav
	_init_dropdowns() # reset sliders max
	
	_save_rallies_state()
	_update_rally_list_ui()
	_show_selected_rally_details()
	print("[Rally] Co-op Rally launched successfully against " + target.name)

func _on_btn_join_submit_pressed() -> void:
	var rally = _get_rally_by_id(_selected_rally_id)
	if not rally:
		return
		
	var hero_idx = opt_join_hero.selected
	var hero = _player_heroes[hero_idx]
	var inf = slider_join_infantry.value
	var mark = slider_join_marksmen.value
	var cav = slider_join_cavalry.value
	
	if inf == 0 and mark == 0 and cav == 0:
		return
		
	var new_participant = {
		"name": "Allied General Reinforcement",
		"hero": hero,
		"infantry": int(inf),
		"marksmen": int(mark),
		"cavalry": int(cav),
		"power": int((inf * 8) + (mark * 10) + (cav * 12))
	}
	
	rally.participants.push_back(new_participant)
	popup_join.visible = false
	
	# Deduct Reinforcement troops
	_player_troops.infantry -= inf
	_player_troops.marksmen -= mark
	_player_troops.cavalry -= cav
	_init_dropdowns()
	
	_save_rallies_state()
	_update_rally_list_ui()
	_show_selected_rally_details()

# ==============================================================================
# REAL-TIME UI UPDATE HANDLERS
# ==============================================================================

func _update_rally_list_ui() -> void:
	count_badge.text = "[" + str(_rallies.size()) + " Active]"
	
	# Clear previous instances
	for c in rally_list.get_children():
		c.queue_free()
		
	if _rallies.size() == 0:
		var empty_lbl = Label.new()
		empty_lbl.text = "No active coalition campaigns."
		empty_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		rally_list.add_child(empty_lbl)
		return
		
	for r in _rallies:
		var btn = Button.new()
		btn.text = r.targetName + "\nETA: " + _format_time(r.timeRemainingSec)
		btn.custom_minimum_size = Vector2(0, 50)
		btn.pressed.connect(func():
			_selected_rally_id = r.id
			_show_selected_rally_details()
		)
		rally_list.add_child(btn)

func _show_selected_rally_details() -> void:
	var rally = _get_rally_by_id(_selected_rally_id)
	if not rally:
		no_selection_panel.visible = true
		details_panel.visible = false
		return
		
	no_selection_panel.visible = false
	details_panel.visible = true
	
	target_name_label.text = rally.targetName + " [" + rally.targetCoords + "]"
	creator_label.text = "Rally Leader: " + rally.creator
	
	# Calculate total power
	var total_power = 0
	for p in rally.participants:
		total_power += p.power
	est_power_label.text = "Est. Coalition Power: " + _format_num(total_power) + " CR"
	
	# Render march track and countdown progress
	march_timer_label.text = _format_time(rally.timeRemainingSec) + " remaining"
	var percent = ((rally.totalDurationSec - rally.timeRemainingSec) / rally.totalDurationSec) * 100.0
	march_progress_bar.value = percent
	
	if rally.timeRemainingSec <= 0:
		march_status_label.text = "March Strike Status: CONFLICT COLLISION RESOLVED!"
	else:
		march_status_label.text = "March Pathing Status: Assembling allied strike forces..."
		
	# Clear participants roster
	for child in participants_container.get_children():
		child.queue_free()
		
	# Add participant labels
	for p in rally.participants:
		var p_box = HBoxContainer.new()
		var p_label = Label.new()
		p_label.text = "⚔️ " + p.name + " (" + p.hero + ") | Troops: INF " + str(p.infantry) + " | MRK " + str(p.marksmen) + " | CAV " + str(p.cavalry)
		p_box.add_child(p_label)
		participants_container.add_child(p_box)

# ==============================================================================
# COMBAT & LOOT SIMULATOR RESOLUTION
# ==============================================================================

func _execute_combat_completion(rally: Dictionary) -> void:
	print("[Rally] Timer reached 0! Coordinating joint strike against " + rally.targetName)
	# Roll random battlefield casualties or win outcomes
	var win_chance = 0.85
	var result = "VICTORIOUS" if randf() < win_chance else "DEFEATED"
	
	if result == "VICTORIOUS":
		print("[Rally] SUCCESS! " + rally.targetName + " slain! Loot distributed to participants.")
		
		var ib_mgr = get_node_or_null("/root/InfernalBeastManager")
		if ib_mgr:
			if rally.get("targetId") == "infernal_beast":
				var base_dmg = 15000000
				var dealt = ib_mgr.record_boss_damage("Sovereign_Player", base_dmg, true)
				print("[Rally] Infernal Beast rally strike dealt ", dealt, " damage to boss!")
			else:
				# General lair / beast rally victory awards Infernal Sigils from config
				var lair_sigils = ib_mgr.get_lair_sigil_drop()
				ib_mgr.add_player_sigils(lair_sigils)
				print("[Rally] Awarded +", lair_sigils, " Infernal Sigils for victorious Ancient Lair raid!")
	else:
		print("[Rally] DEFEATED. Troops retreated to sovereign hospital beds.")
		
	# Remove resolved rally
	_rallies.erase(rally)
	if _selected_rally_id == rally.id:
		_selected_rally_id = ""
		
	_save_rallies_state()
	_update_rally_list_ui()
	_show_selected_rally_details()

# ==============================================================================
# PERSISTENCE ENGINE: SAVE & LOAD
# ==============================================================================

func _save_rallies_state() -> void:
	var file = FileAccess.open(SAVE_FILE_PATH, FileAccess.WRITE)
	if file:
		var json_string = JSON.stringify(_rallies)
		file.store_string(json_string)
		file.close()
		print("[Rally] Saved " + str(_rallies.size()) + " active campaigns persistently.")

func _load_rallies_state() -> void:
	if not FileAccess.file_exists(SAVE_FILE_PATH):
		# Default fallback setups
		_rallies = [
			{
				"id": "rally_default_boss",
				"targetId": "scourge_wyrm",
				"targetName": "Ancient Scourge Wyrm [Lv.40]",
				"targetCoords": "X: 425, Y: 890",
				"creator": "Grand Marshal Guild Lord",
				"timeRemainingSec": 150.0,
				"totalDurationSec": 300.0,
				"participants": [
					{
						"name": "Sovereign Lord Kael",
						"hero": "Maegan [Lv.50]",
						"infantry": 12000,
						"marksmen": 15000,
						"cavalry": 8000,
						"power": 342000
					}
				]
			}
		]
		_selected_rally_id = "rally_default_boss"
		return
		
	var file = FileAccess.open(SAVE_FILE_PATH, FileAccess.READ)
	if file:
		var content = file.get_as_text()
		file.close()
		var json = JSON.new()
		var parse_err = json.parse(content)
		if parse_err == OK:
			if typeof(json.get_data()) == TYPE_ARRAY:
				_rallies = json.get_data()
				if _rallies.size() > 0:
					_selected_rally_id = _rallies[0].id
				print("[Rally] Restored " + str(_rallies.size()) + " saved campaigns.")

# ==============================================================================
# HELPER UTILITY MODULES
# ==============================================================================

func _get_rally_by_id(rid: String) -> Variant:
	for r in _rallies:
		if r.id == rid:
			return r
	return null

func _format_time(time_sec: float) -> String:
	var minutes = int(time_sec) / 60
	var seconds = int(time_sec) % 60
	return "%02d:%02d" % [minutes, seconds]

func _format_num(val: int) -> String:
	if val >= 1000000:
		return "%.2fM" % (float(val) / 1000000.0)
	elif val >= 1000:
		return "%.1fK" % (float(val) / 1000.0)
	return str(val)
