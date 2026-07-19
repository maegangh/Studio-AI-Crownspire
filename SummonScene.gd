# ==============================================================================
# Crownspire MMO Strategy Game - Sovereign Altar Summon Scene
# Godot 4 / GDScript 2.0 client-side gacha summon manager
# ==============================================================================

extends Control

# --- Signals ---
signal summon_started(is_ten_fold)
signal hero_revealed(hero_data, is_new, shards_awarded)
signal summon_completed(batch_results)
signal close_summon_scene
signal pity_updated(epic_pity, legendary_pity)
signal tickets_changed(new_count)

# --- Save Paths ---
const SUMMON_SAVE_PATH = "user://crownspire_summon_v1.save"

# --- Onready Nodes ---
@onready var close_btn: Button = $UI/Header/CloseButton
@onready var summon_single_btn: Button = $UI/Footer/HBox/SummonSingleBtn
@onready var summon_ten_btn: Button = $UI/Footer/HBox/SummonTenBtn
@onready var skip_btn: Button = $UI/Overlay/SkipButton
@onready var drop_rates_btn: Button = $UI/Header/RatesButton
@onready var history_btn: Button = $UI/Header/HistoryButton

# --- Animation & Visual Nodes ---
@onready var anim_player: AnimationPlayer = $AnimationPlayer
@onready var portal_effect: GPUParticles2D = $Visuals/PortalParticles
@onready var portal_sprite: Sprite2D = $Visuals/PortalSprite
@onready var sound_player: AudioStreamPlayer = $AudioStreamPlayer

# --- UI Containers ---
@onready var reveal_card_overlay: ColorRect = $UI/Overlay/RevealCard
@onready var reveal_title: Label = $UI/Overlay/RevealCard/VBox/Title
@onready var reveal_subtitle: Label = $UI/Overlay/RevealCard/VBox/Subtitle
@onready var reveal_portrait: TextureRect = $UI/Overlay/RevealCard/VBox/Portrait
@onready var reveal_rarity_badge: PanelContainer = $UI/Overlay/RevealCard/VBox/RarityBadge
@onready var reveal_rarity_lbl: Label = $UI/Overlay/RevealCard/VBox/RarityBadge/Label
@onready var reveal_shards_info: Label = $UI/Overlay/RevealCard/VBox/ShardsInfo

@onready var results_grid: GridContainer = $UI/Overlay/ResultsScreen/GridScroll/Grid
@onready var results_overlay: ColorRect = $UI/Overlay/ResultsScreen
@onready var rates_dialog: PanelContainer = $UI/Overlay/RatesDialog
@onready var history_dialog: PanelContainer = $UI/Overlay/HistoryDialog
@onready var history_list: VBoxContainer = $UI/Overlay/HistoryDialog/Scroll/List

@onready var ticket_lbl: Label = $UI/Header/TicketsPanel/HBox/TicketCount
@onready var epic_pity_lbl: Label = $UI/Footer/PityPanel/VBox/EpicPityLabel
@onready var legendary_pity_lbl: Label = $UI/Footer/PityPanel/VBox/LegendaryPityLabel

# --- Gacha Drop Weights ---
const WEIGHT_MYTHIC = 0.015     # 1.5%
const WEIGHT_LEGENDARY = 0.045  # 4.5%
const WEIGHT_EPIC = 0.140       # 14%
const WEIGHT_RARE = 0.350       # 35%
const WEIGHT_COMMON = 0.450     # 45%

# --- State Variables ---
var _tickets: int = 15
var _epic_pity_counter: int = 0      # Guarantees Epic or higher every 10 pulls
var _legendary_pity_counter: int = 0  # Guarantees Legendary/Mythic every 40 pulls
var _is_animating: bool = false
var _skip_requested: bool = false
var _owned_heroes: Array = []        # Array of strings (hero IDs)
var _current_draw_batch: Array = []
var _reveal_index: int = 0
var _summon_history: Array = []

# --- Mock Hero Database for Standalone Godot Preview ---
var _hero_db: Dictionary = {
	"maegan": {
		"id": "maegan",
		"name": "Maegan",
		"rarity": "Mythic",
		"role": "War",
		"lore": "The supreme marshal of Crownspire, wielding an unyielding aura.",
		"skills": ["Sovereign Decree", "Bastion Aegis"],
		"portrait": "res://assets/portraits/maegan.png"
	},
	"lorelai": {
		"id": "lorelai",
		"name": "Lorelai",
		"rarity": "Mythic",
		"role": "Support",
		"lore": "A mystical seer attuned to deep leyline energy streams.",
		"skills": ["Chronos Ward", "Astral Clarity"],
		"portrait": "res://assets/portraits/lorelai.png"
	},
	"valkyrie": {
		"id": "valkyrie",
		"name": "Sovereign Valkyrie",
		"rarity": "Legendary",
		"role": "War",
		"lore": "First Defender of Aethelgard. Her solar spear radiates purity.",
		"skills": ["Solar Flare", "Celestial Aegis"],
		"portrait": "res://assets/portraits/valkyrie.png"
	},
	"malakar": {
		"id": "malakar",
		"name": "Arch-Lich Malakar",
		"rarity": "Legendary",
		"role": "War",
		"lore": "Corrupted ruler of the northern wastes, commanding glacial frost.",
		"skills": ["Glacial Siphon", "Cursed Rebirth"],
		"portrait": "res://assets/portraits/malakar.png"
	},
	"kage": {
		"id": "kage",
		"name": "Kage the Shadow",
		"rarity": "Epic",
		"role": "Gathering",
		"lore": "The shadow assassin of Cursed Ruins who strikes in silence.",
		"skills": ["Shuriken Ambush", "Ghost Walk"],
		"portrait": "res://assets/portraits/kage.png"
	},
	"thorgar": {
		"id": "thorgar",
		"name": "Thorgar Ironfist",
		"rarity": "Epic",
		"role": "War",
		"lore": "A battle-hardened highlander smith who crushes shields easily.",
		"skills": ["Anvil Strike", "Unbreakable Resolve"],
		"portrait": "res://assets/portraits/thorgar.png"
	},
	"elena": {
		"id": "elena",
		"name": "Elena of Eldervale",
		"rarity": "Rare",
		"role": "Support",
		"lore": "A druidic ranger who commands forest creatures and mends wounds.",
		"skills": ["Forest Canopy", "Verdant Mend"],
		"portrait": "res://assets/portraits/elena.png"
	},
	"garrick": {
		"id": "garrick",
		"name": "Garrick Stonegaze",
		"rarity": "Rare",
		"role": "Gathering",
		"lore": "A sturdy vanguard quarryman who speeds up masonry construction.",
		"skills": ["Sledge Slam", "Masonry Rhythm"],
		"portrait": "res://assets/portraits/garrick.png"
	},
	"squire_will": {
		"id": "squire_will",
		"name": "Squire William",
		"rarity": "Common",
		"role": "Gathering",
		"lore": "An enthusiastic young squire eager to prove himself.",
		"skills": ["Squire Rush"],
		"portrait": "res://assets/portraits/william.png"
	},
	"scout_lyra": {
		"id": "scout_lyra",
		"name": "Lyra the Scout",
		"rarity": "Common",
		"role": "Support",
		"lore": "A swift runner who delivers reports across high-risk borders.",
		"skills": ["Swift Strides"],
		"portrait": "res://assets/portraits/lyra.png"
	}
}

# --- Initialization ---
func _ready() -> void {
	# Setup UI visibility
	reveal_card_overlay.visible = false
	results_overlay.visible = false
	rates_dialog.visible = false
	history_dialog.visible = false
	skip_btn.visible = false
	
	# Load persisted gacha state
	_load_summon_state()
	_update_pity_ui()
	_update_tickets_ui()
	
	# Connect buttons
	summon_single_btn.pressed.connect(_on_summon_single_pressed)
	summon_ten_btn.pressed.connect(_on_summon_ten_pressed)
	close_btn.pressed.connect(_on_close_pressed)
	skip_btn.pressed.connect(_on_skip_pressed)
	drop_rates_btn.pressed.connect(_on_rates_pressed)
	history_btn.pressed.connect(_on_history_pressed)
	
	# Close dialog buttons if they exist in templates
	if has_node("UI/Overlay/RatesDialog/CloseRates"):
		$UI/Overlay/RatesDialog/CloseRates.pressed.connect(func(): rates_dialog.visible = false)
	if has_node("UI/Overlay/HistoryDialog/CloseHistory"):
		$UI/Overlay/HistoryDialog/CloseHistory.pressed.connect(func(): history_dialog.visible = false)
	if has_node("UI/Overlay/ResultsScreen/CloseBtn"):
		$UI/Overlay/ResultsScreen/CloseBtn.pressed.connect(_on_results_closed)
		
	# Setup random seed
	randomize()

# --- Public Interface Methods ---
func add_tickets(count: int) -> void {
	_tickets += count
	_update_tickets_ui()
	_save_summon_state()
	tickets_changed.emit(_tickets)

func get_tickets() -> int {
	return _tickets
}

# --- Summon Handlers ---
func _on_summon_single_pressed() -> void {
	if _is_animating: return
	if _tickets < 1:
		_show_toast("Not enough Summon Tickets! Complete Quests or Map encounters.")
		return
		
	_tickets -= 1
	_update_tickets_ui()
	
	# Prepare results
	_current_draw_batch.clear()
	_current_draw_batch.append(_roll_single_gacha())
	
	summon_started.emit(false)
	_start_summoning_cinematic()

func _on_summon_ten_pressed() -> void {
	if _is_animating: return
	if _tickets < 10:
		_show_toast("Requires 10 Tickets for an Altar Rally!")
		return
		
	_tickets -= 10
	_update_tickets_ui()
	
	_current_draw_batch.clear()
	for i in range(10):
		_current_draw_batch.append(_roll_single_gacha())
		
	summon_started.emit(true)
	_start_summoning_cinematic()

# --- Gacha Core Rolling Logic ---
func _roll_single_gacha() -> Dictionary:
	_epic_pity_counter += 1
	_legendary_pity_counter += 1
	
	var rolled_rarity = "Common"
	
	# Check Pity Overrides first
	if _legendary_pity_counter >= 40:
		# Guaranteed Mythic or Legendary
		var roll = randf()
		rolled_rarity = "Mythic" if roll < 0.25 else "Legendary"
		_legendary_pity_counter = 0
		_epic_pity_counter = 0 # Reset Epic pity too since we got a higher rarity
	elif _epic_pity_counter >= 10:
		# Guaranteed Epic (or higher if lucky)
		var roll = randf()
		if roll < 0.05:
			rolled_rarity = "Mythic"
			_legendary_pity_counter = 0
		elif roll < 0.20:
			rolled_rarity = "Legendary"
			_legendary_pity_counter = 0
		else:
			rolled_rarity = "Epic"
		_epic_pity_counter = 0
	else:
		# Standard probabilities
		var roll = randf()
		if roll < WEIGHT_MYTHIC:
			rolled_rarity = "Mythic"
			_legendary_pity_counter = 0
			_epic_pity_counter = 0
		elif roll < (WEIGHT_MYTHIC + WEIGHT_LEGENDARY):
			rolled_rarity = "Legendary"
			_legendary_pity_counter = 0
			_epic_pity_counter = 0
		elif roll < (WEIGHT_MYTHIC + WEIGHT_LEGENDARY + WEIGHT_EPIC):
			rolled_rarity = "Epic"
			_epic_pity_counter = 0
		elif roll < (WEIGHT_MYTHIC + WEIGHT_LEGENDARY + WEIGHT_EPIC + WEIGHT_RARE):
			rolled_rarity = "Rare"
		else:
			rolled_rarity = "Common"
			
	# Update pity visual signals
	pity_updated.emit(_epic_pity_counter, _legendary_pity_counter)
	_update_pity_ui()
	
	# Select a hero of the selected rarity
	var matching_heroes = []
	for hero_key in _hero_db.keys():
		if _hero_db[hero_key]["rarity"] == rolled_rarity:
			matching_heroes.append(_hero_db[hero_key])
			
	var selected_hero = matching_heroes[randi() % matching_heroes.size()].duplicate()
	
	# Check duplicate state
	var is_new = not _owned_heroes.has(selected_hero["id"])
	var shards_awarded = 0
	if not is_new:
		# Convert duplicate to shards based on rarity
		match rolled_rarity:
			"Mythic": shards_awarded = 100
			"Legendary": shards_awarded = 50
			"Epic": shards_awarded = 20
			"Rare": shards_awarded = 10
			"Common": shards_awarded = 5
	else:
		_owned_heroes.append(selected_hero["id"])
		
	# Package draw output details
	selected_hero["is_new"] = is_new
	selected_hero["shards_awarded"] = shards_awarded
	selected_hero["timestamp"] = Time.get_unix_time_from_system()
	
	# Log in history list
	_add_to_history(selected_hero)
	_save_summon_state()
	
	return selected_hero

# --- Cinematic & Presentation flow ---
func _start_summoning_cinematic() -> void {
	_is_animating = true
	_skip_requested = false
	skip_btn.visible = true
	_reveal_index = 0
	
	# Visual Altar Charging Effects
	portal_sprite.visible = true
	portal_effect.emitting = true
	
	# Play full charge soundtrack
	if sound_player:
		sound_player.play()
		
	# Trigger Charging animation timeline
	anim_player.play("summon_altar_charge")
	await anim_player.animation_finished
	
	if _skip_requested:
		_show_results_grid()
	else:
		_reveal_next_hero()

func _reveal_next_hero() -> void {
	if _reveal_index >= _current_draw_batch.size():
		_show_results_grid()
		return
		
	var hero = _current_draw_batch[_reveal_index]
	_reveal_index += 1
	
	# Setup card UI metadata
	reveal_title.text = hero["name"]
	reveal_subtitle.text = hero["role"] + " Commander"
	reveal_rarity_lbl.text = hero["rarity"].to_upper()
	
	# Rarity theme style profiles
	_apply_rarity_card_styling(hero["rarity"])
	
	if hero["is_new"]:
		reveal_shards_info.text = "★ NEW COMMANDER RECRUITED!"
		reveal_shards_info.add_theme_color_override("font_color", Color.GREEN)
	else:
		reveal_shards_info.text = "DUPLICATE SUMMON! Melted into: +" + str(hero["shards_awarded"]) + " " + hero["name"] + " Shards"
		reveal_shards_info.add_theme_color_override("font_color", Color.GOLD)
		
	# Display Reveal Card panel
	reveal_card_overlay.visible = true
	
	# Emit signal
	hero_revealed.emit(hero, hero["is_new"], hero["shards_awarded"])
	
	# Animation for card opening
	anim_player.play("card_reveal_fade")
	
	# Wait for click or timer to advance
	var timer = get_tree().create_timer(2.5)
	await timer.timeout
	
	if _is_animating and not _skip_requested:
		_reveal_next_hero()

func _apply_rarity_card_styling(rarity: String) -> void {
	# Inject themed backgrounds & text effects on the reveal card
	var card_theme: StyleBoxFlat = reveal_rarity_badge.get_theme_stylebox("panel").duplicate()
	match rarity:
		"Mythic":
			card_theme.bg_color = Color(0.8, 0.1, 0.1, 0.2)
			card_theme.border_color = Color(0.9, 0.2, 0.2, 0.6)
			reveal_rarity_lbl.add_theme_color_override("font_color", Color.RED)
		"Legendary":
			card_theme.bg_color = Color(0.7, 0.5, 0.1, 0.2)
			card_theme.border_color = Color(0.9, 0.7, 0.2, 0.6)
			reveal_rarity_lbl.add_theme_color_override("font_color", Color.GOLD)
		"Epic":
			card_theme.bg_color = Color(0.5, 0.1, 0.6, 0.2)
			card_theme.border_color = Color(0.7, 0.2, 0.8, 0.6)
			reveal_rarity_lbl.add_theme_color_override("font_color", Color.PURPLE)
		"Rare":
			card_theme.bg_color = Color(0.1, 0.3, 0.6, 0.2)
			card_theme.border_color = Color(0.2, 0.5, 0.9, 0.6)
			reveal_rarity_lbl.add_theme_color_override("font_color", Color.DEEP_SKY_BLUE)
		_:
			card_theme.bg_color = Color(0.3, 0.3, 0.3, 0.2)
			card_theme.border_color = Color(0.5, 0.5, 0.5, 0.4)
			reveal_rarity_lbl.add_theme_color_override("font_color", Color.LIGHT_GRAY)
			
	reveal_rarity_badge.add_theme_stylebox_override("panel", card_theme)

func _on_skip_pressed() -> void {
	_skip_requested = true
	skip_btn.visible = false
	_show_results_grid()

func _show_results_grid() -> void {
	reveal_card_overlay.visible = false
	skip_btn.visible = false
	portal_effect.emitting = false
	
	# Clear out old results grid items
	for child in results_grid.get_children():
		child.queue_free()
		
	# Populate results grid items
	for hero in _current_draw_batch:
		var item = PanelContainer.new()
		item.custom_minimum_size = Vector2(100, 140)
		
		var vbox = VBoxContainer.new()
		item.add_child(vbox)
		
		# Name Label
		var name_lbl = Label.new()
		name_lbl.text = hero["name"]
		name_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		vbox.add_child(name_lbl)
		
		# Rarity Label
		var rarity_lbl = Label.new()
		rarity_lbl.text = hero["rarity"]
		rarity_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		vbox.add_child(rarity_lbl)
		
		# Duplicate status
		var status_lbl = Label.new()
		if hero["is_new"]:
			status_lbl.text = "[NEW]"
		else:
			status_lbl.text = "+" + str(hero["shards_awarded"]) + " Shards"
		status_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		vbox.add_child(status_lbl)
		
		results_grid.add_child(item)
		
	results_overlay.visible = true
	summon_completed.emit(_current_draw_batch)

func _on_results_closed() -> void {
	results_overlay.visible = false
	_is_animating = false
	_current_draw_batch.clear()

func _on_close_pressed() -> void {
	if _is_animating: return
	close_summon_scene.emit()

# --- Dialog Overlays ---
func _on_rates_pressed() -> void {
	rates_dialog.visible = !rates_dialog.visible
	history_dialog.visible = false

func _on_history_pressed() -> void {
	history_dialog.visible = !history_dialog.visible
	rates_dialog.visible = false
	if history_dialog.visible:
		_populate_history_ui()

# --- History Tracker Logic ---
func _add_to_history(hero: Dictionary) -> void {
	var entry = {
		"name": hero["name"],
		"rarity": hero["rarity"],
		"is_new": hero["is_new"],
		"shards": hero["shards_awarded"],
		"timestamp": hero["timestamp"]
	}
	_summon_history.insert(0, entry)
	if _summon_history.size() > 50:
		_summon_history.pop_back()

func _populate_history_ui() -> void {
	for child in history_list.get_children():
		child.queue_free()
		
	if _summon_history.size() == 0:
		var empty_lbl = Label.new()
		empty_lbl.text = "No recruits recorded in this epoch."
		empty_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		history_list.add_child(empty_lbl)
		return
		
	for entry in _summon_history:
		var hbox = HBoxContainer.new()
		
		var name_lbl = Label.new()
		name_lbl.text = entry["name"]
		hbox.add_child(name_lbl)
		
		var rarity_lbl = Label.new()
		rarity_lbl.text = " (" + entry["rarity"] + ") "
		hbox.add_child(rarity_lbl)
		
		var status_lbl = Label.new()
		if entry["is_new"]:
			status_lbl.text = " [NEWLY ACQUIRED]"
		else:
			status_lbl.text = " [DUPLICATE: +" + str(entry["shards"]) + " Shards]"
		hbox.add_child(status_lbl)
		
		history_list.add_child(hbox)

# --- UI Updates ---
func _update_pity_ui() -> void {
	epic_pity_lbl.text = "Guaranteed Epic Altar General in: " + str(10 - _epic_pity_counter) + " pulls"
	legendary_pity_lbl.text = "Guaranteed Cosmic Mythic/Legendary in: " + str(40 - _legendary_pity_counter) + " pulls"

func _update_tickets_ui() -> void {
	ticket_lbl.text = str(_tickets)

# --- Toast System ---
func _show_toast(message: String) -> void {
	toast_label.text = message
	toast_notification.visible = true
	
	if _toast_timer:
		_toast_timer.stop()
		_toast_timer.queue_free()
		
	_toast_timer = Timer.new()
	_toast_timer.wait_time = 3.0
	_toast_timer.one_shot = true
	_toast_timer.timeout.connect(func(): toast_notification.visible = false)
	add_child(_toast_timer)
	_toast_timer.start()

# --- State Serialization ---
func _save_summon_state() -> void {
	var file = FileAccess.open(SUMMON_SAVE_PATH, FileAccess.WRITE)
	if file:
		var state = {
			"tickets": _tickets,
			"epic_pity": _epic_pity_counter,
			"legendary_pity": _legendary_pity_counter,
			"owned_heroes": _owned_heroes,
			"history": _summon_history
		}
		file.store_var(state)
		file.close()

func _load_summon_state() -> void {
	if FileAccess.file_exists(SUMMON_SAVE_PATH):
		var file = FileAccess.open(SUMMON_SAVE_PATH, FileAccess.READ)
		if file:
			var state = file.get_var()
			if state is Dictionary:
				_tickets = state.get("tickets", 15)
				_epic_pity_counter = state.get("epic_pity", 0)
				_legendary_pity_counter = state.get("legendary_pity", 0)
				_owned_heroes = state.get("owned_heroes", [])
				_summon_history = state.get("history", [])
			file.close()
