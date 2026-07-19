# ==============================================================================
# Crownspire MMO Strategy Game - Citadel Codex Museum & Collector Ledger
# Godot 4 / GDScript 2.0 client-side museum collection manager
# ==============================================================================

extends Control

# --- Signals ---
signal museum_closed
signal entry_discovered(category, entry_id)
signal reward_claimed(category, entry_id, rewards)
signal completion_milestone_reached(percentage)

# --- Save Paths ---
const MUSEUM_SAVE_PATH = "user://crownspire_museum_v1.save"

# --- Onready Nodes ---
@onready var close_btn: Button = $Layout/Header/Margin/HBox/CloseButton
@onready var tab_list: HBoxContainer = $Layout/Header/TabMargin/TabScroll/TabsHBox
@onready var search_input: LineEdit = $Layout/Content/Sidebar/SearchMargin/SearchVBox/SearchInput
@onready var filter_option: OptionButton = $Layout/Content/Sidebar/FilterMargin/FilterVBox/FilterOption
@onready var completion_progress: TextureProgressBar = $Layout/Content/Sidebar/CompletionPanel/Margin/VBox/Progress
@onready var completion_label: Label = $Layout/Content/Sidebar/CompletionPanel/Margin/VBox/PercentLabel
@onready var grid_container: GridContainer = $Layout/Content/MainArea/GridScroll/Margin/Grid

# --- Details Drawer Nodes ---
@onready var details_panel: PanelContainer = $Layout/Content/DetailsPanel
@onready var details_icon: TextureRect = $Layout/Content/DetailsPanel/Margin/VBox/Header/Icon
@onready var details_title: Label = $Layout/Content/DetailsPanel/Margin/VBox/Header/VBox/Title
@onready var details_subtitle: Label = $Layout/Content/DetailsPanel/Margin/VBox/Header/VBox/Subtitle
@onready var details_description: Label = $Layout/Content/DetailsPanel/Margin/VBox/Description
@onready var details_stats: Label = $Layout/Content/DetailsPanel/Margin/VBox/StatsSection/StatsText
@onready var details_lore: Label = $Layout/Content/DetailsPanel/Margin/VBox/LoreSection/LoreText
@onready var claim_reward_btn: Button = $Layout/Content/DetailsPanel/Margin/VBox/RewardSection/ClaimBtn
@onready var reward_status_lbl: Label = $Layout/Content/DetailsPanel/Margin/VBox/RewardSection/StatusLbl

# --- Overlays & Popups ---
@onready var toast_notification: PanelContainer = $ToastNotification
@onready var toast_label: Label = $ToastNotification/ToastLabel

# --- Internal Database State ---
var _museum_progress: Dictionary = {
	"discovered_entries": {}, # "entry_id" -> true/false
	"claimed_rewards": {},    # "entry_id" -> true/false
	"statistics": {
		"total_searches": 0,
		"rewards_claimed_count": 0,
		"last_visited_time": 0
	}
}

var _active_tab: String = "heroes"
var _selected_entry_id: String = ""
var _toast_timer: Timer

# --- Complete Museum Codex Datasets ---
var _codex_database: Dictionary = {
	"heroes": [
		{
			"id": "hero_valkyrie",
			"name": "Sovereign Valkyrie",
			"subtitle": "Angelic Defender of the Spire",
			"description": "The golden-winged warrior who first raised the Spire. Her sacred lance, Spear of Aethelgard, shines with holy light that blinds the frozen undead.",
			"stats": "Buff: +5.0% Infantry Defense, +3.0% Legion March Speed",
			"lore": "Born in the celestial rifts of the outer realm, she was tasked by the High Sages to establish defensive bastions across the northern wastes. She stands as a symbol of hope.",
			"rarity": "Legendary",
			"icon": "res://Art/Icons/Heroes/valkyrie.png",
			"rewards": {"gems": 100, "gold": 5000}
		},
		{
			"id": "hero_lich",
			"name": "Arch-Lich Malakar",
			"subtitle": "Lord of the Frozen Wastes",
			"description": "An ancient monarch corrupted by the shadow crystal. He controls Frost Giants and commands legions of skeletons from his black citadel.",
			"stats": "Buff: +4.0% Archery Attack, +2.5% Siege Damage",
			"lore": "Before his corruption, Malakar was a benevolent lord of Crownspire. His hubris led him to seek forbidden power within the deep rifts, sealing his tragic doom.",
			"rarity": "Legendary",
			"icon": "res://Art/Icons/Heroes/lich.png",
			"rewards": {"gems": 100, "stone": 8000}
		},
		{
			"id": "hero_shadow_assassin",
			"name": "Kage the Shadow",
			"subtitle": "Silent Executioner",
			"description": "A rogue commander trained in the whispering valleys of the south. He strikes from shadows and vanishes before the alarm sounds.",
			"stats": "Buff: +6.0% Cavalry Attack, +4.0% Scout Speed",
			"lore": "Kage belongs to no alliance. He sells his lethal blades to the highest bidder, but his deep loyalty lies with preserving the ancient Spire relics from destruction.",
			"rarity": "Epic",
			"icon": "res://Art/Icons/Heroes/kage.png",
			"rewards": {"gems": 50, "wood": 6000}
		}
	],
	"wildlings": [
		{
			"id": "monster_frost_giant",
			"name": "Colossal Frost Giant",
			"subtitle": "Glacial Titan of the Rifts",
			"description": "A massive beast formed from perpetual winter ice and cursed mountain granite. It hurls boulders at defensive bastions.",
			"stats": "Buff: +3.0% Wall Durability, +2.0% Army Health",
			"lore": "Stirred from centuries of slumber when the Citadel Keep was raised, these giants guard the northern boundaries with ancient territorial ferocity.",
			"rarity": "Epic",
			"icon": "res://Art/Icons/Wildlings/frost_giant.png",
			"rewards": {"gems": 60, "stone": 10000}
		},
		{
			"id": "monster_shadow_hound",
			"name": "Rift Shadow Hound",
			"subtitle": "Stalker of the Plains",
			"description": "A pack hunter spawned from dark energy leaks in the core rifts. It hunts in small groups and feeds on timber glades.",
			"stats": "Buff: +1.5% Cavalry March Speed, +2.0% Wood Yield",
			"lore": "Unstable rifts occasionally fracture the outer limits. These hounds slip through, causing terror until dispatched by regional hero squads.",
			"rarity": "Common",
			"icon": "res://Art/Icons/Wildlings/shadow_hound.png",
			"rewards": {"gems": 20, "food": 5000}
		}
	],
	"buildings": [
		{
			"id": "build_castle",
			"name": "Citadel Keep",
			"subtitle": "High Sovereign Headquarters",
			"description": "The architectural heart of Crownspire. Controls maximum construction limits, chapter progress, and unlocks specialized battle academies.",
			"stats": "Buff: +10.0% Building Speed, +5.0% Maximum Troop Capacity",
			"lore": "Built upon the original foundation stones laid by the High Sages. Its design merges weathered slate, copper conduits, and a pulsing crystalline core.",
			"rarity": "Legendary",
			"icon": "res://Art/Icons/Buildings/keep.png",
			"rewards": {"gems": 150, "gold": 12000}
		},
		{
			"id": "build_warehouse",
			"name": "Vault Warehouse",
			"subtitle": "Secure Resource Treasury",
			"description": "Protects gathered resources from plundering and regulates safe cargo transport across alliance territories.",
			"stats": "Buff: +15.0% Protected Storage Capacity, +3.0% Resource Production",
			"lore": "Secured with heavy ancient timber vault locks and deep iron framing, ensuring not a single grain or slate piece is lost during sieges.",
			"rarity": "Rare",
			"icon": "res://Art/Icons/Buildings/warehouse.png",
			"rewards": {"gems": 40, "wood": 8000}
		}
	],
	"equipment": [
		{
			"id": "equip_crownmark_lance",
			"name": "Aethelgard Crownmark Lance",
			"subtitle": "Divine Piercing Relic",
			"description": "A legendary weapon crafted from sovereign meteor iron and embedded with a pulsing crimson crystalline core.",
			"stats": "Buff: +12.0% Hero Combat Power, +5.0% Infantry Piercing Damage",
			"lore": "The actual lance used by the First Sovereign to turn back the Lich's frozen legion at the Battle of the Searing Plain.",
			"rarity": "Legendary",
			"icon": "res://Art/Icons/Equipment/lance.png",
			"rewards": {"gems": 200, "iron": 10000}
		},
		{
			"id": "equip_slate_shield",
			"name": "Weathered Slate Aegis",
			"subtitle": "Fortified Shielding Plate",
			"description": "Constructed from compressed quarry slate and copper conduits to absorb massive force shocks.",
			"stats": "Buff: +4.0% Shield Guard Rate, +2.5% Legion Health",
			"lore": "A heavy shield issued to elite spire guardians, carved with ancient protective runes that pulsate during night raids.",
			"rarity": "Rare",
			"icon": "res://Art/Icons/Equipment/shield.png",
			"rewards": {"gems": 50, "stone": 6000}
		}
	],
	"lore": [
		{
			"id": "lore_first_spire",
			"name": "The Founding Annals",
			"subtitle": "Chapter I: The First Spire",
			"description": "Historical account detailing the discovery of the pulsing crystalline spires and the birth of the Crownspire realm.",
			"stats": "Buff: +2.0% Research Speed, +1.0% Scholar Production",
			"lore": "In the Year of the Comet, the first pioneers crossed the volcanic rifts and found the crystalline spires humming with immense, clean sovereign energy.",
			"rarity": "Epic",
			"icon": "res://Art/Icons/Lore/annals_1.png",
			"rewards": {"gems": 50, "gold": 3000}
		},
		{
			"id": "lore_lich_war",
			"name": "The Glacial Cataclysm",
			"subtitle": "Chapter II: Cursed Rifts",
			"description": "The tragic chronicle of the Great Frost Cursing, when Malakar's dark magic fractured the northern territories.",
			"stats": "Buff: +3.0% Army Defense vs. Undead, +2.0% Valor Gain",
			"lore": "The rifts cracked open, pouring black ash and freezing mist. It took three hero alliances to seal the breach, at the cost of the grand royal archive.",
			"rarity": "Epic",
			"icon": "res://Art/Icons/Lore/annals_2.png",
			"rewards": {"gems": 50, "gold": 3000}
		}
	],
	"resources": [
		{
			"id": "res_wheat",
			"name": "Sovereign Golden Wheat",
			"subtitle": "The Grain of Empire",
			"description": "Cultivated in fertile fields surrounding the Keeps. Feeds the marching columns and workers alike.",
			"stats": "Buff: +5.0% Food Gathering Speed, +2.0% Farm Yield",
			"lore": "An exceptionally resilient crop engineered by the Sages to withstand the icy frost winds blowing from the Rift wastes.",
			"rarity": "Common",
			"icon": "res://Art/Icons/Resources/wheat.png",
			"rewards": {"gems": 20, "food": 10000}
		},
		{
			"id": "res_slate",
			"name": "Quarried Slate Blocks",
			"subtitle": "Stone of defensive Bastions",
			"description": "Dense slate harvested from deep quarries. Essential for upgrading Keep walls and constructing heavy vaults.",
			"stats": "Buff: +4.0% Stone Gathering Speed, +3.0% Wall Defense",
			"lore": "Mined from the ancient volcanic rifts of Aethelgard, slate holds native resilience against both fire and glacial magic.",
			"rarity": "Common",
			"icon": "res://Art/Icons/Resources/slate.png",
			"rewards": {"gems": 20, "stone": 10000}
		}
	],
	"troops": [
		{
			"id": "troop_infantry_guards",
			"name": "Spire Royal Vanguard",
			"subtitle": "Tier 4 Heavy Infantry",
			"description": "Elite swordsmen clad in slate-forged armor, trained to form unbreakable shield walls at key pass points.",
			"stats": "Buff: +4.0% Infantry Attack, +3.0% Infantry Health",
			"lore": "These guards swear a lifetime oath of silence, speaking only through the heavy clash of their shields in defense of the High Sovereign.",
			"rarity": "Epic",
			"icon": "res://Art/Icons/Troops/infantry.png",
			"rewards": {"gems": 80, "gold": 8000}
		},
		{
			"id": "troop_marksmen_rangers",
			"name": "Rift-Arrow Rangers",
			"subtitle": "Tier 4 Marksmen Units",
			"description": "Surgical archers wielding heavy composite bows strung with shimmering spectral crystal wire.",
			"stats": "Buff: +4.0% Marksmen Attack, +3.0% Marksmen Piercing",
			"lore": "Recruited from the northern wilderness, these rangers can track a shadow hound across miles of solid ice, striking targets with absolute precision.",
			"rarity": "Epic",
			"icon": "res://Art/Icons/Troops/marksmen.png",
			"rewards": {"gems": 80, "gold": 8000}
		}
	],
	"research": [
		{
			"id": "tech_sovereign_law",
			"name": "Sovereign Code of Law",
			"subtitle": "High Dominion Doctrine",
			"description": "Establishes structured regional command and tax systems, boosting resource generation and training speeds.",
			"stats": "Buff: +5.0% Gold Production, +3.0% Troop Training Speed",
			"lore": "The legal foundation of the new alliance age. Ensures fair distribution of chest gains and prevents localized corruption.",
			"rarity": "Rare",
			"icon": "res://Art/Icons/Research/law.png",
			"rewards": {"gems": 50, "gold": 5000}
		},
		{
			"id": "tech_spire_resonance",
			"name": "Crystalline Spire Resonance",
			"subtitle": "Core Magic Attunement",
			"description": "Harnesses the native energy frequency of the spires to boost construction speeds and research efficiency.",
			"stats": "Buff: +6.0% Research Speed, +4.0% Divine Power",
			"lore": "By placing copper conduit nets around the spires, scholars can pipe raw resonance straight into the academy's research vats.",
			"rarity": "Legendary",
			"icon": "res://Art/Icons/Research/resonance.png",
			"rewards": {"gems": 120, "gold": 6000}
		}
	]
}

# --- Game Lifecycle Setup ---
func _ready() -> void:
	# Configure timers
	_toast_timer = Timer.new()
	_toast_timer.one_shot = true
	_toast_timer.wait_time = 2.0
	_toast_timer.connect("timeout", Callable(self, "_on_toast_timeout"))
	add_child(_toast_timer)
	
	# Connect UI buttons
	close_btn.connect("pressed", Callable(self, "_on_close_pressed"))
	search_input.connect("text_changed", Callable(self, "_on_search_changed"))
	filter_option.connect("item_selected", Callable(self, "_on_filter_selected"))
	claim_reward_btn.connect("pressed", Callable(self, "_on_claim_reward_pressed"))
	
	# Load progress
	_load_progress()
	
	# Setup initial lists
	_setup_tabs()
	_setup_filters()
	_update_completion_stats()
	_select_tab("heroes")
	
	# Initial details drawer state
	details_panel.hide()
	toast_notification.hide()
	
	# Play opening slide animation
	_play_panel_animation(true)

# --- Save & Load Engine ---
func _load_progress() -> void:
	if FileAccess.file_exists(MUSEUM_SAVE_PATH):
		var file = FileAccess.open(MUSEUM_SAVE_PATH, FileAccess.READ)
		var json_string = file.get_as_text()
		file.close()
		
		var json = JSON.new()
		var error = json.parse(json_string)
		if error == OK:
			var loaded_data = json.get_data()
			if loaded_data is Dictionary:
				# Merge loaded structures safely
				if loaded_data.has("discovered_entries"):
					_museum_progress.discovered_entries = loaded_data.discovered_entries
				if loaded_data.has("claimed_rewards"):
					_museum_progress.claimed_rewards = loaded_data.claimed_rewards
				if loaded_data.has("statistics"):
					_museum_progress.statistics = loaded_data.statistics
	else:
		# Boot fresh discovery matrix with initial mock unlocks
		_museum_progress.discovered_entries = {
			"hero_valkyrie": true,
			"hero_shadow_assassin": true,
			"monster_shadow_hound": true,
			"build_castle": true,
			"equip_slate_shield": true,
			"lore_first_spire": true,
			"res_wheat": true,
			"troop_infantry_guards": true,
			"tech_sovereign_law": true
		}
		_museum_progress.claimed_rewards = {
			"res_wheat": true
		}
		_save_progress()

func _save_progress() -> void:
	var file = FileAccess.open(MUSEUM_SAVE_PATH, FileAccess.WRITE)
	var json_string = JSON.stringify(_museum_progress)
	file.store_string(json_string)
	file.close()

# --- UI Setup Controllers ---
func _setup_tabs() -> void:
	# Clear initial placeholders
	for child in tab_list.get_children():
		child.queue_free()
		
	var tab_names = {
		"heroes": "👤 Heroes",
		"wildlings": "🐺 Wildlings",
		"buildings": "🏛️ Buildings",
		"equipment": "⚔️ Equipment",
		"lore": "📖 Lore",
		"resources": "💎 Resources",
		"troops": "🛡️ Troops",
		"research": "💡 Research"
	}
	
	for tab_id in tab_names.keys():
		var btn = Button.new()
		btn.text = tab_names[tab_id]
		btn.name = tab_id
		btn.custom_minimum_size = Vector2(110, 42)
		btn.toggle_mode = true
		btn.focus_mode = FOCUS_NONE
		btn.connect("pressed", Callable(self, "_on_tab_btn_pressed").bind(tab_id))
		tab_list.add_child(btn)

func _setup_filters() -> void:
	filter_option.clear()
	filter_option.add_item("All Entries", 0)
	filter_option.add_item("Discovered Only", 1)
	filter_option.add_item("Locked Only", 2)
	filter_option.add_item("Legendary Rarity", 3)
	filter_option.add_item("Epic Rarity", 4)
	filter_option.add_item("Rare/Common", 5)

func _update_completion_stats() -> void:
	var total_entries = 0
	var discovered_count = 0
	
	for category in _codex_database.keys():
		for entry in _codex_database[category]:
			total_entries += 1
			if _museum_progress.discovered_entries.get(entry.id, false):
				discovered_count += 1
				
	var percent = 0
	if total_entries > 0:
		percent = int((float(discovered_count) / float(total_entries)) * 100)
		
	completion_progress.value = percent
	completion_label.text = str(percent) + "%"
	
	# Emit signal if milestone crossed
	if percent >= 100:
		emit_signal("completion_milestone_reached", 100)
	elif percent >= 50:
		emit_signal("completion_milestone_reached", 50)

# --- Navigation and Selection Loops ---
func _select_tab(tab_id: String) -> void:
	_active_tab = tab_id
	
	# Update toggle buttons in top bar
	for child in tab_list.get_children():
		if child is Button:
			child.button_pressed = (child.name == tab_id)
			
	_render_grid()

func _render_grid() -> void:
	# Clear existing children
	for child in grid_container.get_children():
		child.queue_free()
		
	var query = search_input.text.to_lower()
	var filter_idx = filter_option.selected
	var entries = _codex_database.get(_active_tab, [])
	
	for entry in entries:
		var is_discovered = _museum_progress.discovered_entries.get(entry.id, false)
		var matches_search = query.is_empty() or entry.name.to_lower().contains(query) or entry.subtitle.to_lower().contains(query)
		
		var matches_filter = true
		match filter_idx:
			1: matches_filter = is_discovered
			2: matches_filter = not is_discovered
			3: matches_filter = entry.rarity == "Legendary"
			4: matches_filter = entry.rarity == "Epic"
			5: matches_filter = (entry.rarity == "Rare" or entry.rarity == "Common")
			
		if matches_search and matches_filter:
			_create_grid_card(entry, is_discovered)

func _create_grid_card(entry: Dictionary, is_discovered: bool) -> void:
	var panel = PanelContainer.new()
	panel.custom_minimum_size = Vector2(130, 160)
	panel.name = entry.id
	
	# Layout
	var vbox = VBoxContainer.new()
	vbox.alignment = BoxContainer.ALIGNMENT_CENTER
	panel.add_child(vbox)
	
	# Icon setup
	var icon_rect = TextureRect.new()
	icon_rect.custom_minimum_size = Vector2(64, 64)
	icon_rect.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	icon_rect.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	
	if is_discovered:
		# Use default icon if path not loaded properly
		icon_rect.texture = load("res://icon.svg") 
		icon_rect.modulate = Color(1.0, 1.0, 1.0, 1.0)
	else:
		icon_rect.texture = load("res://icon.svg")
		icon_rect.modulate = Color(0.2, 0.2, 0.2, 0.6) # Cursed greyed-out overlay
		
	vbox.add_child(icon_rect)
	
	# Name Label
	var lbl_name = Label.new()
	lbl_name.text = entry.name if is_discovered else "???"
	lbl_name.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	lbl_name.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	lbl_name.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	lbl_name.theme_override_font_sizes/font_size = 11
	
	if is_discovered:
		match entry.rarity:
			"Legendary": lbl_name.modulate = Color(1.0, 0.73, 0.2) # Gold
			"Epic": lbl_name.modulate = Color(0.78, 0.4, 1.0) # Purple
			"Rare": lbl_name.modulate = Color(0.2, 0.6, 1.0) # Blue
			_: lbl_name.modulate = Color(0.8, 0.8, 0.8) # Plain gray
	else:
		lbl_name.modulate = Color(0.4, 0.4, 0.4)
		
	vbox.add_child(lbl_name)
	
	# Rarity Pill
	var lbl_rarity = Label.new()
	lbl_rarity.text = entry.rarity if is_discovered else "LOCKED"
	lbl_rarity.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	lbl_rarity.theme_override_font_sizes/font_size = 9
	lbl_rarity.modulate = Color(0.5, 0.5, 0.5) if not is_discovered else Color(1.0, 1.0, 1.0)
	vbox.add_child(lbl_rarity)
	
	# Transparent Clicker Button
	var click_btn = Button.new()
	click_btn.flat = true
	click_btn.custom_minimum_size = panel.custom_minimum_size
	click_btn.focus_mode = FOCUS_NONE
	click_btn.connect("pressed", Callable(self, "_on_card_selected").bind(entry.id))
	panel.add_child(click_btn)
	
	grid_container.add_child(panel)

# --- Selection & Drawer Updates ---
func _on_card_selected(entry_id: String) -> void:
	_selected_entry_id = entry_id
	var entry = _find_entry_by_id(entry_id)
	if entry.is_empty():
		return
		
	var is_discovered = _museum_progress.discovered_entries.get(entry_id, false)
	
	# Slide Drawer open
	details_panel.show()
	_play_drawer_animation(true)
	
	# Render details text
	details_title.text = entry.name if is_discovered else "Unknown Relic"
	details_subtitle.text = entry.subtitle if is_discovered else "Locked Gallery Fragment"
	details_description.text = entry.description if is_discovered else "Explore the volcanic rifts, advance your Citadel buildings, and defeat outer scouts to discover this historical catalog ledger entry."
	
	if is_discovered:
		details_stats.text = entry.stats
		details_lore.text = entry.lore
		
		# Check claim rewards status
		var already_claimed = _museum_progress.claimed_rewards.get(entry_id, false)
		if already_claimed:
			claim_reward_btn.hide()
			reward_status_lbl.show()
			reward_status_lbl.text = "✓ Discovery Reward Claimed"
			reward_status_lbl.modulate = Color(0.2, 0.8, 0.2)
		else:
			claim_reward_btn.show()
			reward_status_lbl.hide()
			
			# Build reward label
			var reward_str = "Claim: "
			for key in entry.rewards.keys():
				reward_str += str(entry.rewards[key]) + " " + key.to_upper() + " "
			claim_reward_btn.text = reward_str
	else:
		details_stats.text = "Unlock first to trigger permanent account-wide bonuses."
		details_lore.text = "The records of Aethelgard are sealed."
		claim_reward_btn.hide()
		reward_status_lbl.show()
		reward_status_lbl.text = "🔒 Unlock entry to claim Sovereign rewards"
		reward_status_lbl.modulate = Color(0.7, 0.3, 0.3)

func _find_entry_by_id(entry_id: String) -> Dictionary:
	for category in _codex_database.keys():
		for entry in _codex_database[category]:
			if entry.id == entry_id:
				return entry
	return {}

# --- Claiming Rewards System ---
func _on_claim_reward_pressed() -> void:
	if _selected_entry_id.is_empty():
		return
		
	var entry = _find_entry_by_id(_selected_entry_id)
	if entry.is_empty():
		return
		
	if _museum_progress.claimed_rewards.get(_selected_entry_id, false):
		_show_toast("Reward already claimed!")
		return
		
	# Claim rewards
	_museum_progress.claimed_rewards[_selected_entry_id] = true
	_museum_progress.statistics.rewards_claimed_count += 1
	_save_progress()
	
	# Emit claiming signals
	emit_signal("reward_claimed", _active_tab, _selected_entry_id, entry.rewards)
	
	# Visual updates
	claim_reward_btn.hide()
	reward_status_lbl.show()
	reward_status_lbl.text = "✓ Discovery Reward Claimed"
	reward_status_lbl.modulate = Color(0.2, 0.8, 0.2)
	
	_show_toast("Sovereign claim successful! Rewards dispatched.")
	_update_completion_stats()

# --- Toast System ---
func _show_toast(msg: String) -> void:
	toast_label.text = msg
	toast_notification.show()
	
	# Reset fade timer
	_toast_timer.stop()
	_toast_timer.start()

func _on_toast_timeout() -> void:
	var tween = create_tween()
	tween.tween_property(toast_notification, "modulate:a", 0.0, 0.3)
	tween.connect("finished", Callable(self, "_hide_toast_completely"))

func _hide_toast_completely() -> void:
	toast_notification.hide()
	toast_notification.modulate.a = 1.0

# --- Interactive Signals handlers ---
func _on_tab_btn_pressed(tab_id: String) -> void:
	_select_tab(tab_id)

func _on_search_changed(_new_text: String) -> void:
	_museum_progress.statistics.total_searches += 1
	_render_grid()

func _on_filter_selected(_index: int) -> void:
	_render_grid()

func _on_close_pressed() -> void:
	# Slide close panel
	_play_panel_animation(false)

# --- Smooth Animations Engine ---
func _play_panel_animation(opening: bool) -> void:
	var final_pos = Vector2(0, 0)
	var start_pos = Vector2(0, size.y) if opening else Vector2(0, 0)
	var target_pos = final_pos if opening else Vector2(0, size.y)
	
	position = start_pos
	var tween = create_tween().set_trans(Tween.TRANS_QUINT).set_ease(Tween.EASE_OUT)
	tween.tween_property(self, "position", target_pos, 0.4)
	
	if not opening:
		tween.connect("finished", Callable(self, "_on_close_animation_finished"))

func _on_close_animation_finished() -> void:
	emit_signal("museum_closed")
	hide()

func _play_drawer_animation(opening: bool) -> void:
	# Smoothly scale or slide details panel
	var target_scale = Vector2(1, 1) if opening else Vector2(0.8, 0.8)
	var target_alpha = 1.0 if opening else 0.0
	
	details_panel.scale = Vector2(0.8, 0.8) if opening else Vector2(1, 1)
	details_panel.modulate.a = 0.0 if opening else 1.0
	
	var tween = create_tween().set_parallel(true).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)
	tween.tween_property(details_panel, "scale", target_scale, 0.25)
	tween.tween_property(details_panel, "modulate:a", target_alpha, 0.25)
