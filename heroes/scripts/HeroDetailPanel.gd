extends Control

# ==========================================
# CROWNSPIRE HERO DETAIL PANEL CONTROLLER
# ==========================================
# Houses full backstory, level/experience metrics, ascension ranks, 
# and dynamically instantiates individual Skill Cards.

signal hero_data_updated(hero_data: Dictionary)
signal close_clicked()

@onready var title_label: Label = get_node_or_null("%DetailTitleLabel")
@onready var name_label: Label = get_node_or_null("%DetailNameLabel")
@onready var desc_label: Label = get_node_or_null("%DetailBiographyLabel")
@onready var power_lbl: Label = get_node_or_null("%DetailPowerLabel")
@onready var class_lbl: Label = get_node_or_null("%DetailClassLabel")
@onready var portrait_lbl: Label = get_node_or_null("%DetailPortraitLabel")
@onready var stars_lbl: Label = get_node_or_null("%DetailStarsLabel")

# XP Elements
@onready var xp_bar: ProgressBar = get_node_or_null("%XPProgressBar")
@onready var xp_lbl: Label = get_node_or_null("%XPProgressText")
@onready var level_lbl: Label = get_node_or_null("%DetailLevelLabel")
@onready var upgrade_btn: Button = get_node_or_null("%LevelUpgradeButton")

# Ascension Elements
@onready var shards_bar: ProgressBar = get_node_or_null("%ShardsProgressBar")
@onready var shards_lbl: Label = get_node_or_null("%ShardsProgressText")
@onready var ascend_btn: Button = get_node_or_null("%AscendButton")

# Container for Skills
@onready var skills_container: VBoxContainer = get_node_or_null("%SkillsContainer")
@onready var skill_panel_prefab: PanelContainer = get_node_or_null("%SkillPrefabContainer")

@onready var close_btn: Button = get_node_or_null("%DetailCloseButton")

@export var skill_card_scene: PackedScene = preload("res://heroes/scenes/HeroSkillPanel.tscn")

var active_hero: Dictionary = {}
var fallback_skills_db: Array = []

func _ready() -> void:
	if close_btn:
		close_btn.pressed.connect(_on_close_pressed)
	if upgrade_btn:
		upgrade_btn.pressed.connect(_on_level_upgrade_pressed)
	if ascend_btn:
		ascend_btn.pressed.connect(_on_ascend_pressed)
		
	# Hide prefab container if it exists
	if skill_panel_prefab:
		skill_panel_prefab.visible = false

func display_hero(hero_data: Dictionary, skills_db: Array) -> void:
	active_hero = hero_data
	fallback_skills_db = skills_db
	
	var is_unlocked = hero_data.get("unlocked", true)
	
	# Basic descriptive labels
	if name_label:
		name_label.text = hero_data.get("name", "Unknown Officer")
	if title_label:
		title_label.text = hero_data.get("title", "High Citadel General")
	if desc_label:
		desc_label.text = hero_data.get("biography", "A battle-hardened commander sworn to safeguard the gates of Crownspire.")
	if class_lbl:
		class_lbl.text = "CLASS: " + hero_data.get("class", "Defender").to_upper()
	if portrait_lbl:
		portrait_lbl.text = hero_data.get("emoji", "🛡️")
		
	_update_stats_display()
	_populate_skills()

func _update_stats_display() -> void:
	var is_unlocked = active_hero.get("unlocked", true)
	var lvl = int(active_hero.get("level", 1))
	var max_lvl = int(active_hero.get("max_level", 40))
	var pwr = int(active_hero.get("power", 0))
	
	# Level & Power
	if level_lbl:
		level_lbl.text = "LEVEL %d / %d" % [lvl, max_lvl]
	if power_lbl:
		power_lbl.text = "POWER: %d" % pwr
		
	# Stars/Stars Label
	if stars_lbl:
		var stars_count = int(active_hero.get("rarity_stars", 1))
		var stars_str = ""
		for i in range(stars_count):
			stars_str += "★"
		stars_lbl.text = stars_str
		
	# XP Progress
	var current_xp = int(active_hero.get("xp", 0))
	var required_xp = int(active_hero.get("xp_required", 1000))
	if required_xp <= 0: required_xp = 1000
	
	if xp_bar:
		xp_bar.max_value = required_xp
		xp_bar.value = current_xp
		xp_bar.visible = is_unlocked
	if xp_lbl:
		xp_lbl.text = "%d / %d XP" % [current_xp, required_xp]
		xp_lbl.visible = is_unlocked
		
	# Level Up Button
	if upgrade_btn:
		if not is_unlocked:
			upgrade_btn.text = "LOCKED"
			upgrade_btn.disabled = true
		elif lvl >= max_lvl:
			upgrade_btn.text = "MAX LEVEL REACHED"
			upgrade_btn.disabled = true
		else:
			upgrade_btn.text = "USE XP POTION (+500 XP)"
			upgrade_btn.disabled = false
			
	# Shards Progress (Ascension)
	var current_shards = int(active_hero.get("shards", 0))
	var required_shards = int(active_hero.get("shards_required", 30))
	if required_shards <= 0: required_shards = 30
	
	if shards_bar:
		shards_bar.max_value = required_shards
		shards_bar.value = current_shards
	if shards_lbl:
		shards_lbl.text = "%d / %d Shards" % [current_shards, required_shards]
		
	# Ascend Button
	if ascend_btn:
		var star_count = int(active_hero.get("rarity_stars", 1))
		if star_count >= 6:
			ascend_btn.text = "MAX ASCENSION"
			ascend_btn.disabled = true
		elif current_shards < required_shards:
			ascend_btn.text = "NEED SHARDS TO ASCEND"
			ascend_btn.disabled = true
		else:
			ascend_btn.text = "ASCEND (+1 STAR)"
			ascend_btn.disabled = false

func _populate_skills() -> void:
	if not skills_container:
		return
		
	for child in skills_container.get_children():
		if child != skill_panel_prefab:
			child.queue_free()
			
	var hero_skills = _get_active_hero_skills()
	var is_unlocked = active_hero.get("unlocked", true)
	
	for skill in hero_skills:
		if not skill_card_scene:
			continue
			
		var card = skill_card_scene.instantiate()
		skills_container.add_child(card)
		card.init_skill(skill, is_unlocked)
		
		if card.has_signal("skill_upgrade_requested"):
			card.connect("skill_upgrade_requested", _on_skill_upgrade_triggered)

func _get_active_hero_skills() -> Array:
	var hero_id = active_hero.get("id", "")
	var global_ui = get_node_or_null("/root/UIManager")
	if global_ui and global_ui.has_method("get_hero_skills"):
		return global_ui.get_hero_skills(hero_id)
		
	# Fallback database filtering
	var results = []
	for s in fallback_skills_db:
		if s.get("hero_id") == hero_id:
			results.append(s)
	return results

# --- GAMEPLAY LOGIC PIPELINES ---

func _on_level_upgrade_pressed() -> void:
	var hero_id = active_hero.get("id", "")
	var global_ui = get_node_or_null("/root/UIManager")
	
	if global_ui and global_ui.has_method("upgrade_hero_with_xp"):
		var response = global_ui.upgrade_hero_with_xp(hero_id)
		# Update active hero snapshot reference
		active_hero = global_ui.get_hero(hero_id)
	else:
		# Fallback simulation
		_perform_local_xp_upgrade()
		
	_update_stats_display()
	hero_data_updated.emit(active_hero)

func _perform_local_xp_upgrade() -> void:
	var lvl = int(active_hero.get("level", 1))
	var max_lvl = int(active_hero.get("max_level", 40))
	if lvl >= max_lvl:
		return
		
	var xp = int(active_hero.get("xp", 0)) + 500
	var req_xp = int(active_hero.get("xp_required", 1000))
	
	while xp >= req_xp and lvl < max_lvl:
		xp -= req_xp
		lvl += 1
		req_xp = int(req_xp * 1.25)
		
	active_hero["level"] = lvl
	active_hero["xp"] = xp
	active_hero["xp_required"] = req_xp
	
	# Recalculate power
	var power = int(active_hero.get("power", 1000)) + (lvl * 150)
	active_hero["power"] = power

func _on_ascend_pressed() -> void:
	var hero_id = active_hero.get("id", "")
	var global_ui = get_node_or_null("/root/UIManager")
	
	if global_ui and global_ui.has_method("ascend_hero"):
		var response = global_ui.ascend_hero(hero_id)
		active_hero = global_ui.get_hero(hero_id)
	else:
		_perform_local_ascension()
		
	_update_stats_display()
	hero_data_updated.emit(active_hero)

func _perform_local_ascension() -> void:
	var stars = int(active_hero.get("rarity_stars", 1))
	if stars >= 6:
		return
		
	var shards = int(active_hero.get("shards", 0))
	var req_shards = int(active_hero.get("shards_required", 30))
	if shards < req_shards:
		return
		
	shards -= req_shards
	stars += 1
	req_shards = int(req_shards * 1.5)
	
	active_hero["rarity_stars"] = stars
	active_hero["shards"] = shards
	active_hero["shards_required"] = req_shards
	active_hero["max_level"] += 5
	active_hero["power"] = int(active_hero.get("power", 1000)) + 3000

func _on_skill_upgrade_triggered(skill_id: String) -> void:
	var hero_id = active_hero.get("id", "")
	var global_ui = get_node_or_null("/root/UIManager")
	
	if global_ui and global_ui.has_method("upgrade_hero_skill"):
		var response = global_ui.upgrade_hero_skill(hero_id, skill_id)
		active_hero = global_ui.get_hero(hero_id)
	else:
		_perform_local_skill_upgrade(skill_id)
		
	_update_stats_display()
	_populate_skills()
	hero_data_updated.emit(active_hero)

func _perform_local_skill_upgrade(skill_id: String) -> void:
	for s in fallback_skills_db:
		if s.get("id") == skill_id:
			var lvl = int(s.get("level", 1))
			var max_lvl = int(s.get("max_level", 5))
			if lvl < max_lvl:
				s["level"] = lvl + 1
				active_hero["power"] = int(active_hero.get("power", 1000)) + 800
			break

func _on_close_pressed() -> void:
	close_clicked.emit()
