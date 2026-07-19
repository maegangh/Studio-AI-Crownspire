extends PanelContainer

# ==========================================
# CROWNSPIRE HERO DETAIL MODULE CONTROLLER
# ==========================================
# Integrates specialized panels (Portrait, XP bar, power tracker) and toggles
# sub-tabs (Skills, Equipment, Ascension, Biography).

signal hero_state_changed()

@export var upgrade_popup_scene: PackedScene = preload("res://scenes/HeroUpgradePopup.tscn")
@export var unlock_popup_scene: PackedScene = preload("res://scenes/HeroUnlockPopup.tscn")

@onready var portrait_frame: Control = %HeroPortraitFrame
@onready var hero_name_lbl: Label = %HeroNameLbl
@onready var hero_title_lbl: Label = %HeroTitleLbl
@onready var power_display: Control = %HeroPowerDisplay
@onready var xp_bar: Control = %HeroXPBar

# Action buttons
@onready var favorite_btn: Button = %FavoriteBtn
@onready var action_btn: Button = %ActionBtn # "UPGRADE LEVEL" or "SUMMON HERO"
@onready var action_cost_lbl: Label = %ActionCostLabel

# Tab controls
@onready var tab_details: Button = %TabDetailsBtn
@onready var tab_skills: Button = %TabSkillsBtn
@onready var tab_equip: Button = %TabEquipBtn
@onready var tab_ascend: Button = %TabAscendBtn
@onready var tab_bio: Button = %TabBioBtn

# Tab panels
@onready var panel_details_box: VBoxContainer = %DetailsTabBox
@onready var skill_panel: Control = %HeroSkillPanel
@onready var equipment_panel: Control = %HeroEquipmentPanel
@onready var ascension_panel: Control = %HeroAscensionPanel
@onready var biography_panel: Control = %HeroBiographyPanel

var current_hero_id: String = ""
var active_tab: String = "details"

func _ready() -> void:
	# Wire tab selections
	tab_details.pressed.connect(func(): _switch_tab("details"))
	tab_skills.pressed.connect(func(): _switch_tab("skills"))
	tab_equip.pressed.connect(func(): _switch_tab("equip"))
	tab_ascend.pressed.connect(func(): _switch_tab("ascend"))
	tab_bio.pressed.connect(func(): _switch_tab("bio"))
	
	favorite_btn.pressed.connect(_on_favorite_pressed)
	action_btn.pressed.connect(_on_action_pressed)
	
	# Connect global updates to refresh panel
	UIManager.hero_levelled_up.connect(_on_global_hero_update)
	UIManager.hero_ascended.connect(_on_global_hero_update)
	UIManager.hero_skill_upgraded.connect(_on_global_hero_update)
	UIManager.hero_equipment_upgraded.connect(_on_global_hero_update)
	UIManager.hero_unlocked.connect(_on_global_hero_update)

func load_hero_details(hero_id: String) -> void:
	current_hero_id = hero_id
	var h = UIManager.get_hero(hero_id)
	if h.is_empty():
		visible = false
		return
		
	visible = true
	
	# Primary identity header
	hero_name_lbl.text = h["name"].to_upper()
	hero_title_lbl.text = h.get("title", "").to_upper()
	
	# Rarity styling for title label
	var rarity = h.get("rarity", "Rare")
	match rarity:
		"Legendary": hero_name_lbl.add_theme_color_override("font_color", Color(1, 0.84, 0))
		"Epic": hero_name_lbl.add_theme_color_override("font_color", Color(0.75, 0.35, 1))
		_: hero_name_lbl.add_theme_color_override("font_color", Color(0.2, 0.6, 1))
		
	# Setup composite subcomponents
	portrait_frame.setup(h)
	power_display.setup(h["power"], true)
	xp_bar.setup(h)
	
	# Update favorite toggle icon
	favorite_btn.text = "❤️ FAVORITE" if h.get("favorite", false) else "🖤 FAVORITE"
	
	# Handle primary button (Upgrade or Summon)
	var is_unlocked = h.get("unlocked", false)
	if is_unlocked:
		action_btn.text = "✨ FORTIFY LEVEL (USE XP)"
		action_btn.add_theme_color_override("font_color", Color(0, 0, 0))
		
		var shards = h.get("shards", 0)
		var shards_req = h.get("shards_required", 100)
		
		# Show recommendation notice
		if shards >= shards_req and h.get("rarity_stars", 3) < 6:
			action_cost_lbl.text = "⭐ RECOMMENDATION: HERO READY TO ASCEND IN ASCENSION TAB"
			action_cost_lbl.add_theme_color_override("font_color", Color(0.2, 0.8, 0.5))
		else:
			action_cost_lbl.text = "AVAILABLE POTIONS: %d | LVL CAP: %d" % [UIManager.hero_xp_potions, h["max_level"]]
			action_cost_lbl.add_theme_color_override("font_color", Color(1, 1, 1, 0.6))
	else:
		action_btn.text = "🔮 SUMMON LEGIONARY"
		action_btn.add_theme_color_override("font_color", Color(1, 1, 1))
		
		var shards = h.get("shards", 0)
		var shards_req = h.get("shards_required", 100)
		action_cost_lbl.text = "REQUIRED SHARDS TO SUMMON: %d / %d" % [shards, shards_req]
		
		if shards >= shards_req:
			action_cost_lbl.add_theme_color_override("font_color", Color(0.2, 0.8, 0.5))
			action_btn.disabled = false
		else:
			action_cost_lbl.add_theme_color_override("font_color", Color(0.9, 0.2, 0.3))
			action_btn.disabled = true
			
	# Load into sub-panels
	_refresh_active_tab()

func _switch_tab(tab_name: String) -> void:
	active_tab = tab_name
	
	# Visual highlight on selected button
	tab_details.modulate = Color(1, 1, 1, 1) if active_tab == "details" else Color(0.6, 0.6, 0.7, 0.8)
	tab_skills.modulate = Color(1, 1, 1, 1) if active_tab == "skills" else Color(0.6, 0.6, 0.7, 0.8)
	tab_equip.modulate = Color(1, 1, 1, 1) if active_tab == "equip" else Color(0.6, 0.6, 0.7, 0.8)
	tab_ascend.modulate = Color(1, 1, 1, 1) if active_tab == "ascend" else Color(0.6, 0.6, 0.7, 0.8)
	tab_bio.modulate = Color(1, 1, 1, 1) if active_tab == "bio" else Color(0.6, 0.6, 0.7, 0.8)
	
	_refresh_active_tab()

func _refresh_active_tab() -> void:
	panel_details_box.visible = (active_tab == "details")
	skill_panel.visible = (active_tab == "skills")
	equipment_panel.visible = (active_tab == "equip")
	ascension_panel.visible = (active_tab == "ascend")
	biography_panel.visible = (active_tab == "bio")
	
	match active_tab:
		"skills":
			skill_panel.load_skills(current_hero_id)
		"equip":
			equipment_panel.load_equipment(current_hero_id)
		"ascend":
			ascension_panel.load_ascension_details(current_hero_id)
		"bio":
			biography_panel.load_biography(current_hero_id)

func _on_favorite_pressed() -> void:
	UIManager.toggle_hero_favorite(current_hero_id)
	var h = UIManager.get_hero(current_hero_id)
	favorite_btn.text = "❤️ FAVORITE" if h.get("favorite", false) else "🖤 FAVORITE"
	hero_state_changed.emit()

func _on_action_pressed() -> void:
	var h = UIManager.get_hero(current_hero_id)
	var is_unlocked = h.get("unlocked", false)
	
	if is_unlocked:
		# Open Upgrade Popup to let them feed potions continuously
		if upgrade_popup_scene:
			var popup = UIManager.open_popup(upgrade_popup_scene)
			if popup:
				popup.init_popup(current_hero_id)
	else:
		# Summon/Unlock Hero
		var shards = h.get("shards", 0)
		var shards_req = h.get("shards_required", 100)
		if shards >= shards_req:
			var res = UIManager.unlock_hero(current_hero_id)
			if res["success"]:
				# Launch full unlock animation celebrate screen!
				if unlock_popup_scene:
					var summon_popup = UIManager.open_popup(unlock_popup_scene)
					if summon_popup:
						summon_popup.animate_summon(current_hero_id)
				hero_state_changed.emit()

func _on_global_hero_update(_id: String, _extra = null, _lvl = null) -> void:
	if _id == current_hero_id:
		load_hero_details(current_hero_id)
		hero_state_changed.emit()
