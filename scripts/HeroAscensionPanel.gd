extends PanelContainer

# ==========================================
# CROWNSPIRE HERO ASCENSION TAB CONTROLLER
# ==========================================
# Coordinates consuming hero shards to increase star rank, level limits,
# and multiplier attributes.

@onready var shard_progress_lbl: Label = %ShardProgressLabel
@onready var shard_bar: ProgressBar = %ShardProgressBar
@onready var star_evolution_lbl: Label = %StarEvolutionLabel
@onready var benefits_desc_lbl: Label = %BenefitsDescLabel
@onready var ascend_btn: Button = %AscendBtn

var current_hero_id: String = ""

func load_ascension_details(hero_id: String) -> void:
	current_hero_id = hero_id
	var h = UIManager.get_hero(hero_id)
	if h.is_empty():
		return
		
	var shards = h.get("shards", 0)
	var shards_req = h.get("shards_required", 100)
	var current_stars = h.get("rarity_stars", 3)
	
	# Shard fraction progress
	shard_progress_lbl.text = "SOVEREIGN SHARDS OBLIGED: %d / %d" % [shards, shards_req]
	shard_bar.max_value = shards_req
	shard_bar.value = shards
	
	# Stars evolution display
	var star_current_str = ""
	for i in range(current_stars):
		star_current_str += "★"
	var star_next_str = ""
	for i in range(min(current_stars + 1, 6)):
		star_next_str += "★"
		
	if current_stars >= 6:
		star_evolution_lbl.text = "SUPREME ASCENSION CAP ACHIEVED: %s" % star_current_str
		benefits_desc_lbl.text = "Your legion general has reached the ultimate zenith rank. Base multipliers are maximized."
		ascend_btn.disabled = true
		ascend_btn.text = "ZENITH ACHIEVED"
	else:
		star_evolution_lbl.text = "EVOLUTION: %s ➔ %s" % [star_current_str, star_next_str]
		
		# Describe benefits
		var next_cap = h["max_level"] + 5
		benefits_desc_lbl.text = "ASCENSION BOUNTIES:\n  • Increases maximum level cap: %d ➔ %d\n  • Boosts global base power rating multiplier by +15%%\n  • Unlocks advanced combat bonuses and abilities" % [h["max_level"], next_cap]
		
		# Set button states
		var is_unlocked = h.get("unlocked", false)
		if not is_unlocked:
			ascend_btn.disabled = true
			ascend_btn.text = "HERO LOCKED"
		elif shards >= shards_req:
			ascend_btn.disabled = false
			ascend_btn.text = "ASCEND SOVEREIGN GENERAL"
			ascend_btn.add_theme_color_override("font_color", Color(0, 0, 0))
		else:
			ascend_btn.disabled = true
			ascend_btn.text = "INSUFFICIENT SHARDS"
			ascend_btn.add_theme_color_override("font_color", Color(1, 1, 1, 0.4))
			
	# Connect button press
	if not ascend_btn.pressed.is_connected(_on_ascend_pressed):
		ascend_btn.pressed.connect(_on_ascend_pressed)

func _on_ascend_pressed() -> void:
	var res = UIManager.ascend_hero(current_hero_id)
	if res["success"]:
		# Celebration triggers globally via signals, parent panel will refresh automatically
		pass
