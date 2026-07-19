extends PanelContainer

# ==========================================
# CROWNSPIRE HERO SINGLE SKILL CARD CONTROLLER
# ==========================================
# Displays a single skill's name, emoji, level, passive/active tags, and description.
# Handles upgrade workflows and triggers local/global API updates.

signal skill_upgrade_requested(skill_id: String)

@onready var skill_icon: Label = get_node_or_null("%SkillIcon")
@onready var skill_name: Label = get_node_or_null("%SkillNameLabel")
@onready var skill_lvl: Label = get_node_or_null("%SkillLevelLabel")
@onready var skill_desc: Label = get_node_or_null("%SkillDescLabel")
@onready var type_tag: Label = get_node_or_null("%TypeTagLabel")
@onready var upgrade_btn: Button = get_node_or_null("%UpgradeSkillButton")

var skill_data: Dictionary = {}

func _ready() -> void:
	if upgrade_btn:
		upgrade_btn.pressed.connect(_on_upgrade_pressed)

func init_skill(data: Dictionary, hero_unlocked: bool) -> void:
	skill_data = data
	
	if skill_icon:
		skill_icon.text = data.get("emoji", "🌀")
	if skill_name:
		skill_name.text = data.get("name", "Royal Talent")
		
	var lvl = int(data.get("level", 1))
	var max_lvl = int(data.get("max_level", 5))
	if skill_lvl:
		skill_lvl.text = "LVL %d/%d" % [lvl, max_lvl]
		
	if skill_desc:
		skill_desc.text = data.get("description", "An elite magical or passive ability.")
		
	var is_passive = data.get("is_passive", false)
	if type_tag:
		if is_passive:
			type_tag.text = "PASSIVE"
			type_tag.modulate = Color(0.3, 0.8, 1.0) # Light blue passive
		else:
			type_tag.text = "ACTIVE"
			type_tag.modulate = Color(1.0, 0.4, 0.2) # Orange active

	if upgrade_btn:
		if not hero_unlocked:
			upgrade_btn.visible = false
		elif lvl >= max_lvl:
			upgrade_btn.text = "MAX LEVEL"
			upgrade_btn.disabled = true
			upgrade_btn.visible = true
		else:
			var gold_cost = lvl * 5000
			upgrade_btn.text = "UPGRADE (%d 🪙)" % gold_cost
			upgrade_btn.disabled = false
			upgrade_btn.visible = true

func _on_upgrade_pressed() -> void:
	skill_upgrade_requested.emit(skill_data.get("id", ""))
