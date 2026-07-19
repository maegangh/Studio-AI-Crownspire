# ==============================================================================
# Crownspire MMO Strategy Game - Sovereign Armory Equipment Manager
# Godot 4 / GDScript 2.0 client-side RPG inventory & equipment system
# ==============================================================================

extends Control

# --- Signals ---
signal equipment_equipped(item_id, hero_id, slot)
signal equipment_unequipped(item_id, hero_id, slot)
signal equipment_upgraded(item_id, new_level)
signal equipment_enhanced(item_id, enhancement_stat, enhancement_value)
signal equipment_ascended(item_id, new_tier)
signal equipment_locked_changed(item_id, is_locked)
signal close_equipment_scene

# --- Save Paths ---
const EQUIPMENT_SAVE_PATH = "user://crownspire_equipment_v1.save"

# --- Onready Node Bindings ---
@onready var close_btn: Button = $UI/Header/CloseButton
@onready var hero_list_btn: OptionButton = $UI/Header/HeroSelector

# --- Active Hero Equipment Slot Buttons ---
@onready var slot_weapon: Button = $UI/MainLayout/LeftHeroView/SlotsGrid/WeaponSlot
@onready var slot_helmet: Button = $UI/MainLayout/LeftHeroView/SlotsGrid/HelmetSlot
@onready var slot_armor: Button = $UI/MainLayout/LeftHeroView/SlotsGrid/ArmorSlot
@onready var slot_boots: Button = $UI/MainLayout/LeftHeroView/SlotsGrid/BootsSlot
@onready var slot_accessory: Button = $UI/MainLayout/LeftHeroView/SlotsGrid/AccessorySlot
@onready var slot_ring: Button = $UI/MainLayout/LeftHeroView/SlotsGrid/RingSlot

# --- Hero Stats & Power Labels ---
@onready var hero_name_lbl: Label = $UI/MainLayout/LeftHeroView/HeroName
@onready var hero_power_lbl: Label = $UI/MainLayout/LeftHeroView/HeroPower
@onready var hero_stats_vbox: VBoxContainer = $UI/MainLayout/LeftHeroView/StatsScroll/VBox

# --- Inventory Controls ---
@onready var inv_grid: GridContainer = $UI/MainLayout/MiddleInventory/Scroll/Grid
@onready var filter_slot: OptionButton = $UI/MainLayout/MiddleInventory/Filters/SlotFilter
@onready var filter_rarity: OptionButton = $UI/MainLayout/MiddleInventory/Filters/RarityFilter
@onready var sort_selector: OptionButton = $UI/MainLayout/MiddleInventory/Filters/SortSelector

# --- Details Panel & Comparison ---
@onready var details_panel: PanelContainer = $UI/MainLayout/RightDetails
@onready var details_title: Label = $UI/MainLayout/RightDetails/VBox/Header/Title
@onready var details_slot_rarity: Label = $UI/MainLayout/RightDetails/VBox/Header/SlotRarity
@onready var details_power: Label = $UI/MainLayout/RightDetails/VBox/Header/PowerValue
@onready var details_stats_list: VBoxContainer = $UI/MainLayout/RightDetails/VBox/StatsList
@onready var details_enhance_info: Label = $UI/MainLayout/RightDetails/VBox/EnhanceInfo
@onready var details_set_info: Label = $UI/MainLayout/RightDetails/VBox/SetInfo
@onready var details_description: Label = $UI/MainLayout/RightDetails/VBox/Description

# --- Action Buttons ---
@onready var equip_btn: Button = $UI/MainLayout/RightDetails/VBox/Actions/EquipBtn
@onready var unequip_btn: Button = $UI/MainLayout/RightDetails/VBox/Actions/UnequipBtn
@onready var lock_btn: Button = $UI/MainLayout/RightDetails/VBox/Actions/LockBtn
@onready var upgrade_btn: Button = $UI/MainLayout/RightDetails/VBox/Actions/UpgradeBtn
@onready var enhance_btn: Button = $UI/MainLayout/RightDetails/VBox/Actions/EnhanceBtn
@onready var ascend_btn: Button = $UI/MainLayout/RightDetails/VBox/Actions/AscendBtn

# --- Comparison Panel ---
@onready var comparison_box: VBoxContainer = $UI/MainLayout/RightDetails/VBox/ComparisonBox
@onready var comp_stat_diff: Label = $UI/MainLayout/RightDetails/VBox/ComparisonBox/DiffLabel

# --- Dialogs ---
@onready var action_dialog: PanelContainer = $UI/Overlay/ActionDialog
@onready var action_dialog_title: Label = $UI/Overlay/ActionDialog/VBox/Title
@onready var action_dialog_desc: Label = $UI/Overlay/ActionDialog/VBox/Desc
@onready var action_dialog_cost: Label = $UI/Overlay/ActionDialog/VBox/Cost
@onready var action_dialog_confirm: Button = $UI/Overlay/ActionDialog/VBox/HBox/Confirm
@onready var action_dialog_close: Button = $UI/Overlay/ActionDialog/VBox/HBox/Cancel

@onready var toast_notification: PanelContainer = $ToastNotification
@onready var toast_label: Label = $ToastNotification/ToastLabel

# --- Sound Streams & Visual Feedback Players ---
@onready var audio_player: AudioStreamPlayer = $AudioStreamPlayer

# --- In-memory State ---
var _heroes: Array = []
var _user_equipment: Array = []
var _materials: Dictionary = {
	"Copper Wire": 15,
	"Obsidian Shard": 12,
	"Drake Scale": 8,
	"Magma Heart": 5,
	"Prismatic Iron": 6,
	"Glacier Quartz": 4,
	"Titanium Plate": 5,
	"Phoenix Feather": 2,
	"Mythic Ingot": 1,
	"iron": 12500,
	"wood": 35000,
	"stone": 20000,
	"valor": 1200
}

var _selected_hero_id: String = ""
var _selected_item_instance_id: String = ""
var _active_dialog_mode: String = "" # "upgrade", "enhance", "ascend"
var _toast_timer: Timer = null

# --- Local Copy of Templates for standalone execution ---
var _equipment_templates: Dictionary = {}

# --- Set Bonuses Definition ---
const SET_BONUSES = {
	"Recruit's Training": {
		"bonus2": "+10% General Base Attack",
		"bonus4": "+10% General Base Defense",
		"bonus6": "+15% Extra Total Health",
	},
	"Vanguard Warden": {
		"bonus2": "+20% Infantry Total Attack",
		"bonus4": "+25% Infantry Total Defense",
		"bonus6": "Heavy Vanguard Shield: Revives 5% Infantry as wounded."
	},
	"Wildwood Hunter": {
		"bonus2": "+20% Marksmen Total Attack",
		"bonus4": "+20% Damage vs Wilderness Monsters",
		"bonus6": "Eagle Sniping: +30% Marksmen Critical Hit."
	},
	"Swiftwind Tempest": {
		"bonus2": "+25% General Marching Speed",
		"bonus4": "+20% Cavalry Total Attack",
		"bonus6": "Tempest Blitz: +25% Cavalry Impact."
	}
}

# --- Initialization ---
func _ready() -> void {
	action_dialog.visible = false
	toast_notification.visible = false
	details_panel.visible = false
	comparison_box.visible = false
	
	# Create fallbacks for templates if no file exists
	_load_equipment_json()
	_initialize_mock_state()
	_load_persisted_state()
	
	# Hook up top UI Close action
	close_btn.pressed.connect(_on_close_pressed)
	
	# Hook up interactive filters and selectors
	filter_slot.item_selected.connect(func(idx): _refresh_inventory_grid())
	filter_rarity.item_selected.connect(func(idx): _refresh_inventory_grid())
	sort_selector.item_selected.connect(func(idx): _refresh_inventory_grid())
	hero_list_btn.item_selected.connect(_on_hero_switched)
	
	# Hook up button action operations
	equip_btn.pressed.connect(_on_equip_pressed)
	unequip_btn.pressed.connect(_on_unequip_pressed)
	lock_btn.pressed.connect(_on_lock_pressed)
	upgrade_btn.pressed.connect(func(): _open_action_dialog("upgrade"))
	enhance_btn.pressed.connect(func(): _open_action_dialog("enhance"))
	ascend_btn.pressed.connect(func(): _open_action_dialog("ascend"))
	
	action_dialog_confirm.pressed.connect(_on_dialog_confirmed)
	action_dialog_close.pressed.connect(func(): action_dialog.visible = false)
	
	# Hook up Slot Selection elements
	slot_weapon.pressed.connect(func(): _on_equipped_slot_clicked("Weapon"))
	slot_helmet.pressed.connect(func(): _on_equipped_slot_clicked("Helmet"))
	slot_armor.pressed.connect(func(): _on_equipped_slot_clicked("Armor"))
	slot_boots.pressed.connect(func(): _on_equipped_slot_clicked("Boots"))
	slot_accessory.pressed.connect(func(): _on_equipped_slot_clicked("Amulet")) # "Accessory"
	slot_ring.pressed.connect(func(): _on_equipped_slot_clicked("Ring"))
	
	_populate_hero_dropdown()
	_on_hero_switched(0)

# --- Template Loading ---
func _load_equipment_json() -> void {
	# Try to fetch `/public/equipment.json` or standard locations
	var paths = ["res://public/equipment.json", "res://equipment.json"]
	var parsed = false
	
	for path in paths:
		if FileAccess.file_exists(path):
			var file = FileAccess.open(path, FileAccess.READ)
			if file:
				var test_json_string = file.get_as_text()
				var json = JSON.new()
				var error = json.parse(test_json_string)
				if error == OK:
					var data = json.get_data()
					if data is Array:
						for item in data:
							_equipment_templates[item["id"]] = item
						parsed = true
						break
	
	if not parsed:
		# Build a comprehensive programmatic fallback dataset for local previewing
		var slots = ["Weapon", "Helmet", "Armor", "Boots", "Amulet", "Ring"]
		var rarities = ["Common", "Rare", "Epic", "Legendary"]
		var sets = ["Recruit's Training", "Vanguard Warden", "Wildwood Hunter", "Swiftwind Tempest"]
		
		for set_name in sets:
			for slot in slots:
				for rarity in rarities:
					var base_id = "eq_" + slot.to_lower() + "_" + rarity.to_lower() + "_" + set_name.to_lower().replace(" ", "_").replace("'", "")
					_equipment_templates[base_id] = {
						"id": base_id,
						"name": rarity + " " + set_name + " " + slot,
						"slot": slot,
						"rarity": rarity,
						"levelRequirement": 1,
						"statBonuses": {
							"attack": 20 if slot == "Weapon" or slot == "Ring" else 5,
							"defense": 15 if slot == "Armor" or slot == "Helmet" else 3,
							"health": 100 if slot == "Boots" or slot == "Amulet" else 20
						},
						"troopBonuses": {
							"infantryAttack": 0.02 if rarity == "Epic" else 0.005,
							"infantryDefense": 0.02 if rarity == "Epic" else 0.005,
							"infantryHealth": 0.01 if rarity == "Epic" else 0.005,
							"cavalryAttack": 0.01 if rarity == "Epic" else 0.005,
							"cavalryDefense": 0.01,
							"cavalryHealth": 0.01,
							"marksmenAttack": 0.01,
							"marksmenDefense": 0.01,
							"marksmenHealth": 0.01
						},
						"setName": set_name,
						"description": "Premium gear constructed using Crownspire alloys. Grants great battle attributes."
					}

# --- Mock State Initialization ---
func _initialize_mock_state() -> void {
	# Setup sample hero catalog
	_heroes = [
		{"id": "maegan", "name": "Marshal Maegan", "power": 45000},
		{"id": "lorelai", "name": "Seer Lorelai", "power": 38000},
		{"id": "valkyrie", "name": "Valkyrie General", "power": 31000},
		{"id": "malakar", "name": "Lich Malakar", "power": 29000}
	]
	
	# Generate some initial equipment inside User inventory
	_user_equipment = [
		{
			"id": "inst_w1",
			"baseId": "eq_weapon_common_recruits_training",
			"name": "Recruit's Training Greatsword",
			"slot": "Weapon",
			"rarity": "Common",
			"level": 5,
			"tier": 0,
			"setName": "Recruit's Training",
			"equippedHeroId": "maegan",
			"locked": false,
			"enhancement": {"stat": "Critical Strike Chance", "value": 3.5}
		},
		{
			"id": "inst_h1",
			"baseId": "eq_helmet_common_recruits_training",
			"name": "Recruit's Training Cap",
			"slot": "Helmet",
			"rarity": "Common",
			"level": 3,
			"tier": 1,
			"setName": "Recruit's Training",
			"equippedHeroId": "maegan",
			"locked": false,
			"enhancement": null
		},
		{
			"id": "inst_a1",
			"baseId": "eq_armor_epic_vanguard_warden",
			"name": "Warden Plate Mail",
			"slot": "Armor",
			"rarity": "Epic",
			"level": 12,
			"tier": 2,
			"setName": "Vanguard Warden",
			"equippedHeroId": "maegan",
			"locked": true,
			"enhancement": {"stat": "Infantry Penetration", "value": 5.0}
		},
		{
			"id": "inst_b1",
			"baseId": "eq_boots_rare_wildwood_hunter",
			"name": "Wildwood Leather Treads",
			"slot": "Boots",
			"rarity": "Rare",
			"level": 8,
			"tier": 0,
			"setName": "Wildwood Hunter",
			"equippedHeroId": "",
			"locked": false,
			"enhancement": null
		},
		{
			"id": "inst_r1",
			"baseId": "eq_ring_legendary_swiftwind_tempest",
			"name": "Ring of Hurricane Gales",
			"slot": "Ring",
			"rarity": "Legendary",
			"level": 25,
			"tier": 3,
			"setName": "Swiftwind Tempest",
			"equippedHeroId": "",
			"locked": false,
			"enhancement": {"stat": "March Speed Boost", "value": 12.0}
		},
		{
			"id": "inst_ac1",
			"baseId": "eq_amulet_common_recruits_training",
			"name": "Trainee Solar Locket",
			"slot": "Amulet",
			"rarity": "Common",
			"level": 1,
			"tier": 0,
			"setName": "Recruit's Training",
			"equippedHeroId": "",
			"locked": false,
			"enhancement": null
		}
	]

# --- UI Updates & Navigation ---
func _populate_hero_dropdown() -> void {
	hero_list_btn.clear()
	for hero in _heroes:
		hero_list_btn.add_item(hero["name"])

func _on_hero_switched(index: int) -> void {
	if index < 0 or index >= _heroes.size(): return
	var hero = _heroes[index]
	_selected_hero_id = hero["id"]
	
	hero_name_lbl.text = hero["name"]
	_refresh_equipped_slots()
	_refresh_inventory_grid()
	_update_hero_stats_display()
	
	if details_panel.visible:
		_refresh_details_panel()

func _refresh_equipped_slots() -> void {
	# Clear previous text/styles
	var slots = {
		"Weapon": slot_weapon,
		"Helmet": slot_helmet,
		"Armor": slot_armor,
		"Boots": slot_boots,
		"Amulet": slot_accessory,
		"Ring": slot_ring
	}
	
	for slot_name in slots.keys():
		var slot_btn = slots[slot_name]
		slot_btn.text = slot_name + "\n(Empty)"
		# Find item equipped by selected hero in this slot
		var item = _find_equipped_item(_selected_hero_id, slot_name)
		if item:
			var stars = ""
			for s in range(item["tier"]):
				stars += "★"
			slot_btn.text = item["name"] + " +" + str(item["level"]) + "\n" + stars + " [" + item["rarity"] + "]"

func _find_equipped_item(hero_id: String, slot_name: String) -> Dictionary:
	for item in _user_equipment:
		if item["equippedHeroId"] == hero_id and item["slot"] == slot_name:
			return item
	return {}

func _on_equipped_slot_clicked(slot_name: String) -> void {
	var item = _find_equipped_item(_selected_hero_id, slot_name)
	if item:
		_selected_item_instance_id = item["id"]
		_refresh_details_panel()
	else:
		_show_toast("No equipment in " + slot_name + " slot. Select an item in inventory to equip!")

# --- Stat & Power Mathematics ---
func get_level_stat_multiplier(level: int) -> float:
	return 1.0 + 0.10 * (level - 1)

func get_level_troop_bonus_multiplier(level: int) -> float:
	return 1.0 + 0.05 * (level - 1)

func get_star_tier_multiplier(tier: int) -> float:
	match tier:
		1: return 1.25
		2: return 1.60
		3: return 2.10
		4: return 2.80
		5: return 3.80
		_: return 1.0

func calculate_item_power(item: Dictionary) -> int:
	var template = _equipment_templates.get(item["baseId"], {})
	if not template: return 0
	
	var stat_mult = get_level_stat_multiplier(item["level"]) * get_star_tier_multiplier(item["tier"])
	var base_attack = template.get("statBonuses", {}).get("attack", 0) * stat_mult
	var base_defense = template.get("statBonuses", {}).get("defense", 0) * stat_mult
	var base_health = template.get("statBonuses", {}).get("health", 0) * stat_mult
	
	var base_power = (base_attack * 4) + (base_defense * 3) + (base_health * 0.4)
	
	# Add enhancement bonus if active
	if item.get("enhancement"):
		base_power += 250
		
	# Level power boost
	base_power += item["level"] * 15
	
	return int(base_power)

func get_scaled_item_stats(item: Dictionary) -> Dictionary:
	var template = _equipment_templates.get(item["baseId"], {})
	if not template: return {}
	
	var stat_mult = get_level_stat_multiplier(item["level"]) * get_star_tier_multiplier(item["tier"])
	var troop_mult = get_level_troop_bonus_multiplier(item["level"]) * get_star_tier_multiplier(item["tier"])
	
	var template_stat = template.get("statBonuses", {})
	var template_troop = template.get("troopBonuses", {})
	
	return {
		"attack": int(template_stat.get("attack", 0) * stat_mult),
		"defense": int(template_stat.get("defense", 0) * stat_mult),
		"health": int(template_stat.get("health", 0) * stat_mult),
		"infantryAttack": template_troop.get("infantryAttack", 0) * troop_mult * 100,
		"infantryDefense": template_troop.get("infantryDefense", 0) * troop_mult * 100,
		"marksmenAttack": template_troop.get("marksmenAttack", 0) * troop_mult * 100,
		"cavalryAttack": template_troop.get("cavalryAttack", 0) * troop_mult * 100
	}

# --- Upgrade Cost Formulas ---
func get_upgrade_cost(rarity: String, level: int) -> Dictionary:
	var wood_base = 100
	var iron_base = 15
	var stone_base = 20
	match rarity:
		"Common":
			wood_base = 120; iron_base = 12; stone_base = 15
		"Rare":
			wood_base = 450; iron_base = 50; stone_base = 65
		"Epic":
			wood_base = 1800; iron_base = 250; stone_base = 320
		"Legendary":
			wood_base = 8000; iron_base = 1200; stone_base = 1600
		"Mythic":
			wood_base = 40000; iron_base = 6000; stone_base = 8000
	var factor = pow(1.085, level - 1)
	return {
		"wood": int(wood_base * factor),
		"iron": int(iron_base * factor),
		"stone": int(stone_base * factor)
	}

# --- Ascension Requirements Formulas ---
func get_ascension_requirements(rarity: String, next_tier: int) -> Dictionary:
	var required_level = 10
	var iron_needed = 500
	var valor_needed = 10
	var materials = []
	
	match next_tier:
		1:
			required_level = 15
			iron_needed = 1000
			valor_needed = 50
			materials.append({"name": "Copper Wire", "count": 3})
		2:
			required_level = 30
			iron_needed = 5000
			valor_needed = 250
			materials.append({"name": "Obsidian Shard", "count": 5})
		3:
			required_level = 50
			iron_needed = 20000
			valor_needed = 1000
			materials.append({"name": "Drake Scale", "count": 5})
		4:
			required_level = 70
			iron_needed = 100000
			valor_needed = 5000
			materials.append({"name": "Prismatic Iron", "count": 8})
		5:
			required_level = 90
			iron_needed = 500000
			valor_needed = 25000
			materials.append({"name": "Mythic Ingot", "count": 3})
				
	return {
		"required_level": required_level,
		"iron_cost": iron_needed,
		"valor_cost": valor_needed,
		"materials": materials
	}

# --- Inventory Render Grid ---
func _refresh_inventory_grid() -> void {
	# Clear Grid
	for child in inv_grid.get_children():
		child.queue_free()
		
	var active_slot_idx = filter_slot.selected
	var active_rarity_idx = filter_rarity.selected
	var active_sort_idx = sort_selector.selected
	
	var slots_map = ["All", "Weapon", "Helmet", "Armor", "Boots", "Amulet", "Ring"]
	var rarity_map = ["All", "Common", "Rare", "Epic", "Legendary", "Mythic"]
	
	var target_slot = slots_map[active_slot_idx] if active_slot_idx >= 0 else "All"
	var target_rarity = rarity_map[active_rarity_idx] if active_rarity_idx >= 0 else "All"
	
	# Apply Filtering
	var filtered_list = []
	for item in _user_equipment:
		if target_slot != "All" and item["slot"] != target_slot:
			continue
		if target_rarity != "All" and item["rarity"] != target_rarity:
			continue
		filtered_list.append(item)
		
	# Apply Sorting
	if active_sort_idx == 0: # Power
		filtered_list.sort_custom(func(a, b): return calculate_item_power(b) < calculate_item_power(a))
	elif active_sort_idx == 1: # Level
		filtered_list.sort_custom(func(a, b): return b["level"] < a["level"])
	elif active_sort_idx == 2: # Rarity (Common to Legendary/Mythic)
		var r_weights = {"Common": 1, "Rare": 2, "Epic": 3, "Legendary": 4, "Mythic": 5}
		filtered_list.sort_custom(func(a, b): return r_weights.get(b["rarity"], 0) < r_weights.get(a["rarity"], 0))
	elif active_sort_idx == 3: # Name Alphabetical
		filtered_list.sort_custom(func(a, b): return a["name"] < b["name"])
		
	# Generate Items
	for item in filtered_list:
		var card = PanelContainer.new()
		card.custom_minimum_size = Vector2(90, 110)
		card.add_theme_stylebox_override("panel", _get_rarity_stylebox(item["rarity"]))
		
		var vbox = VBoxContainer.new()
		card.add_child(vbox)
		
		var name_lbl = Label.new()
		name_lbl.text = item["name"]
		name_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		name_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
		vbox.add_child(name_lbl)
		
		var level_lbl = Label.new()
		level_lbl.text = "Lvl " + str(item["level"])
		level_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		vbox.add_child(level_lbl)
		
		# Show Equip State
		if item.get("equippedHeroId") != "":
			var owner_name = ""
			for h in _heroes:
				if h["id"] == item["equippedHeroId"]:
					owner_name = h["name"]
					break
			var owner_lbl = Label.new()
			owner_lbl.text = "[" + owner_name + "]"
			owner_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
			vbox.add_child(owner_lbl)
			
		var select_btn = Button.new()
		select_btn.text = "View"
		select_btn.pressed.connect(func():
			_selected_item_instance_id = item["id"]
			_refresh_details_panel()
		)
		vbox.add_child(select_btn)
		
		inv_grid.add_child(card)

func _get_rarity_stylebox(rarity: String) -> StyleBoxFlat:
	var style = StyleBoxFlat.new()
	style.border_width_bottom = 2
	style.border_width_top = 2
	style.border_width_left = 2
	style.border_width_right = 2
	style.corner_radius_top_left = 6
	style.corner_radius_top_right = 6
	style.corner_radius_bottom_left = 6
	style.corner_radius_bottom_right = 6
	
	match rarity:
		"Mythic":
			style.bg_color = Color(0.15, 0.02, 0.02)
			style.border_color = Color(0.8, 0.1, 0.1)
		"Legendary":
			style.bg_color = Color(0.12, 0.08, 0.02)
			style.border_color = Color(0.9, 0.6, 0.1)
		"Epic":
			style.bg_color = Color(0.08, 0.02, 0.1)
			style.border_color = Color(0.6, 0.1, 0.8)
		"Rare":
			style.bg_color = Color(0.02, 0.05, 0.1)
			style.border_color = Color(0.1, 0.4, 0.8)
		_:
			style.bg_color = Color(0.05, 0.05, 0.05)
			style.border_color = Color(0.4, 0.4, 0.4)
	return style

# --- Equipment Details Panel & Real-time Comparison ---
func _refresh_details_panel() -> void {
	var item = _find_item_by_id(_selected_item_instance_id)
	if not item:
		details_panel.visible = false
		return
		
	details_panel.visible = true
	
	var power = calculate_item_power(item)
	details_title.text = item["name"] + " +" + str(item["level"])
	
	var stars = ""
	for i in range(item["tier"]):
		stars += "★"
	details_slot_rarity.text = stars + " " + item["slot"] + " (" + item["rarity"] + ")"
	details_power.text = "Combat Power: " + str(power)
	
	# Clear Stat VBox
	for child in details_stats_list.get_children():
		child.queue_free()
		
	var stats = get_scaled_item_stats(item)
	for stat_key in stats.keys():
		var val = stats[stat_key]
		if val > 0:
			var label = Label.new()
			if stat_key in ["attack", "defense", "health"]:
				label.text = "🛡️ " + stat_key.capitalize() + ": +" + str(val)
			else:
				label.text = "⚔️ " + stat_key.capitalize() + ": +" + str(val) + "%"
			details_stats_list.add_child(label)
			
	# Enhancement Display
	if item.get("enhancement"):
		details_enhance_info.text = "🌟 Custom Enhancement: +" + str(item["enhancement"]["value"]) + "% " + item["enhancement"]["stat"]
		details_enhance_info.visible = true
	else:
		details_enhance_info.visible = false
		
	# Set Bonus info
	var set_name = item.get("setName", "")
	if SET_BONUSES.has(set_name):
		details_set_info.text = "💠 Set: " + set_name + "\n" + "2pc: " + SET_BONUSES[set_name]["bonus2"] + "\n4pc: " + SET_BONUSES[set_name]["bonus4"]
		details_set_info.visible = true
	else:
		details_set_info.visible = false
		
	var template = _equipment_templates.get(item["baseId"], {})
	details_description.text = template.get("description", "Reliable strategy equipment forged for war.")
	
	# Action buttons validation
	var is_currently_equipped = (item["equippedHeroId"] != "")
	var is_this_hero_equipped = (item["equippedHeroId"] == _selected_hero_id)
	
	equip_btn.visible = not is_currently_equipped
	unequip_btn.visible = is_this_hero_equipped
	lock_btn.text = "🔓 Unlock Gear" if item.get("locked") else "🔒 Lock Gear"
	
	# Comparsion Module activation
	var currently_equipped = _find_equipped_item(_selected_hero_id, item["slot"])
	if currently_equipped and currently_equipped["id"] != item["id"]:
		comparison_box.visible = true
		var current_power = calculate_item_power(currently_equipped)
		var power_diff = power - current_power
		if power_diff > 0:
			comp_stat_diff.text = "Power change if equipped: +" + str(power_diff) + " (UPGRADE)"
			comp_stat_diff.add_theme_color_override("font_color", Color.GREEN)
		else:
			comp_stat_diff.text = "Power change if equipped: " + str(power_diff) + " (DOWNGRADE)"
			comp_stat_diff.add_theme_color_override("font_color", Color.RED)
	else:
		comparison_box.visible = false

func _find_item_by_id(item_id: String) -> Dictionary:
	for item in _user_equipment:
		if item["id"] == item_id:
			return item
	return {}

# --- Equipped Bonus Stats Accumulation UI ---
func _update_hero_stats_display() -> void {
	for child in hero_stats_vbox.get_children():
		child.queue_free()
		
	var att_flat = 0
	var def_flat = 0
	var hp_flat = 0
	var total_hero_power = 0
	
	for item in _user_equipment:
		if item["equippedHeroId"] == _selected_hero_id:
			var stats = get_scaled_item_stats(item)
			att_flat += stats.get("attack", 0)
			def_flat += stats.get("defense", 0)
			hp_flat += stats.get("health", 0)
			total_hero_power += calculate_item_power(item)
			
	for h in _heroes:
		if h["id"] == _selected_hero_id:
			total_hero_power += h["power"]
			break
			
	hero_power_lbl.text = "Total CP: " + str(total_hero_power)
	
	var label_att = Label.new()
	label_att.text = "Total Attack: +" + str(att_flat)
	hero_stats_vbox.add_child(label_att)
	
	var label_def = Label.new()
	label_def.text = "Total Defense: +" + str(def_flat)
	hero_stats_vbox.add_child(label_def)
	
	var label_hp = Label.new()
	label_hp.text = "Total Health: +" + str(hp_flat)
	hero_stats_vbox.add_child(label_hp)

# --- Button Handlers ---
func _on_equip_pressed() -> void {
	var item = _find_item_by_id(_selected_item_instance_id)
	if not item: return
	
	# Unequip whatever was in that slot first
	var currently_equipped = _find_equipped_item(_selected_hero_id, item["slot"])
	if currently_equipped:
		currently_equipped["equippedHeroId"] = ""
		
	item["equippedHeroId"] = _selected_hero_id
	_save_equipment_state()
	_refresh_equipped_slots()
	_refresh_inventory_grid()
	_refresh_details_panel()
	_update_hero_stats_display()
	
	equipment_equipped.emit(item["id"], _selected_hero_id, item["slot"])
	_show_toast("Equipped " + item["name"] + " onto " + _selected_hero_id)

func _on_unequip_pressed() -> void {
	var item = _find_item_by_id(_selected_item_instance_id)
	if not item: return
	
	var slot = item["slot"]
	item["equippedHeroId"] = ""
	_save_equipment_state()
	_refresh_equipped_slots()
	_refresh_inventory_grid()
	_refresh_details_panel()
	_update_hero_stats_display()
	
	equipment_unequipped.emit(item["id"], _selected_hero_id, slot)
	_show_toast("Unequipped " + item["name"])

func _on_lock_pressed() -> void {
	var item = _find_item_by_id(_selected_item_instance_id)
	if not item: return
	
	item["locked"] = !item.get("locked", false)
	_save_equipment_state()
	_refresh_details_panel()
	equipment_locked_changed.emit(item["id"], item["locked"])
	_show_toast("Equipment lock state updated!")

# --- Action Operation Dialog (Upgrade, Enhance, Ascend) ---
func _open_action_dialog(mode: String) -> void {
	var item = _find_item_by_id(_selected_item_instance_id)
	if not item: return
	
	_active_dialog_mode = mode
	action_dialog.visible = true
	
	match mode:
		"upgrade":
			action_dialog_title.text = "UPGRADE LEVEL (Lvl " + str(item["level"]) + " -> " + str(item["level"] + 1) + ")"
			var cost = get_upgrade_cost(item["rarity"], item["level"])
			action_dialog_desc.text = "Upgrades primary base stats linearly by +10%."
			action_dialog_cost.text = "Cost Required:\n🪵 Wood: " + str(cost["wood"]) + " / " + str(_materials["wood"]) + "\n🪨 Stone: " + str(cost["stone"]) + " / " + str(_materials["stone"]) + "\n🔩 Iron: " + str(cost["iron"]) + " / " + str(_materials["iron"])
		"enhance":
			action_dialog_title.text = "ENHANCE SUBSTATS"
			action_dialog_desc.text = "Consumes Obsidian Shards and Drake Scales to unlock/reroll sub-affixes."
			action_dialog_cost.text = "Requires:\n✨ Obsidian Shards: 2 / " + str(_materials["Obsidian Shard"]) + "\n🐉 Drake Scales: 1 / " + str(_materials["Drake Scale"])
		"ascend":
			var next_tier = item["tier"] + 1
			if next_tier > 5:
				_show_toast("Max Star Ascension reached!")
				action_dialog.visible = false
				return
			action_dialog_title.text = "STAR ASCENSION (" + str(item["tier"]) + " Star -> " + str(next_tier) + " Star)"
			var reqs = get_ascension_requirements(item["rarity"], next_tier)
			action_dialog_desc.text = "Increases star tier and scales up ALL attributes by 25% to 50%!"
			var mats_str = ""
			for m in reqs["materials"]:
				mats_str += "\n💎 " + m["name"] + ": " + str(m["count"]) + " / " + str(_materials.get(m["name"], 0))
			action_dialog_cost.text = "Requirements:\n⚡ Hero level required: " + str(reqs["required_level"]) + "\n🔩 Iron cost: " + str(reqs["iron_cost"]) + " / " + str(_materials["iron"]) + mats_str

func _on_dialog_confirmed() -> void {
	action_dialog.visible = false
	var item = _find_item_by_id(_selected_item_instance_id)
	if not item: return
	
	match _active_dialog_mode:
		"upgrade":
			var cost = get_upgrade_cost(item["rarity"], item["level"])
			if _materials["wood"] >= cost["wood"] and _materials["stone"] >= cost["stone"] and _materials["iron"] >= cost["iron"]:
				_materials["wood"] -= cost["wood"]
				_materials["stone"] -= cost["stone"]
				_materials["iron"] -= cost["iron"]
				item["level"] += 1
				
				# Play Tween bounce visual on details power
				_trigger_visual_bump()
				
				_save_equipment_state()
				_refresh_equipped_slots()
				_refresh_inventory_grid()
				_refresh_details_panel()
				_update_hero_stats_display()
				
				equipment_upgraded.emit(item["id"], item["level"])
				_show_toast("Success! " + item["name"] + " upgraded to Lvl " + str(item["level"]))
			else:
				_show_toast("Insufficient resources to execute upgrade!")
				
		"enhance":
			if _materials["Obsidian Shard"] >= 2 and _materials["Drake Scale"] >= 1:
				_materials["Obsidian Shard"] -= 2
				_materials["Drake Scale"] -= 1
				
				# Generate random enhancement sub affix
				var stats_pool = ["Critical Strike", "Piercing Attack", "Tactical Dodge", "Gold Harvest Speed", "March Speed Boost"]
				var chosen_stat = stats_pool[randi() % stats_pool.size()]
				var val = randf_range(2.0, 8.5)
				
				item["enhancement"] = {"stat": chosen_stat, "value": snapped(val, 0.1)}
				
				_trigger_visual_bump()
				
				_save_equipment_state()
				_refresh_equipped_slots()
				_refresh_inventory_grid()
				_refresh_details_panel()
				_update_hero_stats_display()
				
				equipment_enhanced.emit(item["id"], chosen_stat, val)
				_show_toast("Success! Enhanced " + item["name"] + " with: +" + str(snapped(val, 0.1)) + "% " + chosen_stat)
			else:
				_show_toast("Insufficient materials to craft enhancement!")
				
		"ascend":
			var next_tier = item["tier"] + 1
			var reqs = get_ascension_requirements(item["rarity"], next_tier)
			
			# Check requirements
			var has_mats = true
			for m in reqs["materials"]:
				if _materials.get(m["name"], 0) < m["count"]:
					has_mats = false
					break
					
			if _materials["iron"] >= reqs["iron_cost"] and has_mats:
				_materials["iron"] -= reqs["iron_cost"]
				for m in reqs["materials"]:
					_materials[m["name"]] -= m["count"]
					
				item["tier"] = next_tier
				
				_trigger_visual_bump()
				
				_save_equipment_state()
				_refresh_equipped_slots()
				_refresh_inventory_grid()
				_refresh_details_panel()
				_update_hero_stats_display()
				
				equipment_ascended.emit(item["id"], item["tier"])
				_show_toast("Glorious! " + item["name"] + " ascended to " + str(item["tier"]) + " Star Tier!")
			else:
				_show_toast("Requirements/Materials not satisfied for ascension!")

# --- Visual Effects & Animation Helpers ---
func _trigger_visual_bump() -> void {
	var tween = create_tween()
	tween.tween_property(details_power, "scale", Vector2(1.2, 1.2), 0.15)
	tween.tween_property(details_power, "scale", Vector2(1.0, 1.0), 0.15)

# --- Toast Notification System ---
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

func _on_close_pressed() -> void {
	close_equipment_scene.emit()

# --- State Serialization ---
func _save_equipment_state() -> void {
	var file = FileAccess.open(EQUIPMENT_SAVE_PATH, FileAccess.WRITE)
	if file:
		var state = {
			"user_equipment": _user_equipment,
			"materials": _materials
		}
		file.store_var(state)
		file.close()

func _load_persisted_state() -> void {
	if FileAccess.file_exists(EQUIPMENT_SAVE_PATH):
		var file = FileAccess.open(EQUIPMENT_SAVE_PATH, FileAccess.READ)
		if file:
			var state = file.get_var()
			if state is Dictionary:
				_user_equipment = state.get("user_equipment", _user_equipment)
				_materials = state.get("materials", _materials)
			file.close()
