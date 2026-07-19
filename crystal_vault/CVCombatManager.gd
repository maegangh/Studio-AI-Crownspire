# ==========================================
# CROWNSPIRE: THE ASTRAL RELIQUARY (Godot 4.4)
# CVCombatManager.gd - Central Combat Orchestration Hub
# ==========================================
extends Node
class_name CVCombatManager

signal combat_victory
signal combat_defeat
signal combat_log_updated(log_text: String, log_type: String)

var hero_manager: CVHeroManager
var enemy_manager: CVEnemyManager

var enemy_queue: Array[CVEnemyManager.Enemy] = []
var active_enemy: CVEnemyManager.Enemy = null
var current_wave: int = 1
var total_waves: int = 2
var is_combat_active: bool = false
var turns_spent: int = 0

func _ready() -> void:
	# Autoload or internal node instantiations
	hero_manager = CVHeroManager.new()
	enemy_manager = CVEnemyManager.new()
	add_child(hero_manager)
	add_child(enemy_manager)
	
	# Event linkages
	enemy_manager.enemy_defeated.connect(_on_enemy_defeated)
	enemy_manager.enemy_status_triggered.connect(_on_enemy_status_triggered)
	hero_manager.hero_ultimate_charged.connect(_on_hero_ultimate_charged)

# Arena Interaction API: Setup and configure a new battle simulation
func start_combat_arena(world: int, floor_num: int) -> void:
	hero_manager.setup_default_heroes()
	enemy_queue = enemy_manager.generate_enemies_for_level(world, floor_num)
	
	active_enemy = enemy_queue.pop_front()
	current_wave = 1
	total_waves = enemy_queue.size() + 1
	turns_spent = 0
	is_combat_active = true
	
	_log("⚔️ COMBAT HUB INITIATED: Guardians stand ready to defend the Altar. Hostile force: %s!" % active_enemy.name, "system")

# Puzzle Event API: Interprets incoming match events from Mahjong Board
func interpret_puzzle_match(tile_type_id: String) -> void:
	if not is_combat_active or active_enemy == null:
		return
		
	turns_spent += 1
	
	# 1. Process status ticks on active enemy
	var status_dmg = enemy_manager.process_status_ticks(active_enemy)
	if active_enemy.hp <= 0:
		return # Defeated by status burn
		
	# 2. Map match elements to combat commands
	match tile_type_id:
		"solar_fire":
			# Sword Match -> Infantry attack
			hero_manager.add_energy_to_hero("valen_solar", 25)
			var valen = hero_manager.active_heroes[0]
			var dmg = valen.attack_power
			active_enemy.hp = clampi(active_enemy.hp - dmg, 0, active_enemy.max_hp)
			
			_log("⚔️ VALEN SOLAR performs Blazing Strike! Deals %d damage to %s." % [dmg, active_enemy.name], "player")
			_log("✨ PASSIVE [Valor Radiance] sparks!", "passive")
			
		"glacial_frost":
			# Bow Match -> Marksmen Attack
			hero_manager.add_energy_to_hero("lyra_frost", 25)
			var lyra = hero_manager.active_heroes[1]
			
			var is_slowed = active_enemy.status_effects.has("slow")
			var mult = 1.25 if is_slowed else 1.0
			var dmg = int(lyra.attack_power * mult)
			active_enemy.hp = clampi(active_enemy.hp - dmg, 0, active_enemy.max_hp)
			
			# Apply Slow (delays cooldowns)
			enemy_manager.apply_status_effect(active_enemy, "slow", 2)
			
			_log("🏹 LYRA FROST fires a Glacial Bolt dealing %d frost damage & Slows target." % dmg, "player")
			if is_slowed:
				_log("🎯 PASSIVE [Chill Precision]: Deals extra critical damage on slowed foe!", "passive")
				
		"amber_earth":
			# Shield Match -> Guardian Barrier
			hero_manager.add_energy_to_hero("aethelgard_stone", 25)
			hero_manager.apply_shield_squad(250)
			_log("🛡️ AETHELGARD Bastion deploys defensive stone shielding (+250 armor)!", "player")
			
			# Passive Fortress Heart
			hero_manager.trigger_fortress_heart_passive()
			
		"astral_light":
			# Crystal Match -> Energy boost
			hero_manager.charge_all_energy(35)
			_log("⭐ CRYSTAL MATCH: Relic mana feeds guardian arrays! Squad energy +35.", "player")
			
		"emerald_nature":
			# Potion Match -> Health restoration
			hero_manager.heal_squad(300)
			_log("🌿 POTION MATCH: Synthesis restores +300 vitality points to the squad.", "player")
			
		"runic_compass":
			# Dragon Crest Match -> Free ultimate charge
			var r_idx = randi() % hero_manager.active_heroes.size()
			hero_manager.active_heroes[r_idx].energy = 100
			_log("🌀 DRAGON CREST: Ancient vortex fully charges %s Ultimate meter!" % hero_manager.active_heroes[r_idx].name, "player")

	# Check if Enemy is dead
	if active_enemy.hp <= 0:
		_on_enemy_defeated(active_enemy.name)
		return
		
	# 3. Handle Enemy Cooldown decrements and Strikes
	if active_enemy.status_effects.has("freeze"):
		_log("❄️ FROZEN: Enemy is frozen solid and skips turn countdown!", "system")
	else:
		var cooldown_reduction = 0.5 if active_enemy.status_effects.has("slow") else 1.0
		active_enemy.cooldown = maxf(0.0, active_enemy.cooldown - cooldown_reduction)
		
		if active_enemy.cooldown <= 0.0:
			_execute_enemy_strike()
			active_enemy.cooldown = active_enemy.max_cooldown

# Execute ultimate manual calls
func cast_hero_ultimate(hero_id: String) -> void:
	if not is_combat_active or active_enemy == null:
		return
		
	var target_hero: CVHeroManager.Hero = null
	for hero in hero_manager.active_heroes:
		if hero.id == hero_id:
			target_hero = hero
			break
			
	if target_hero == null or target_hero.energy < 100:
		return # Not fully charged
		
	target_hero.energy = 0 # Consume mana
	
	if hero_id == "valen_solar":
		var dmg = 850
		active_enemy.hp = clampi(active_enemy.hp - dmg, 0, active_enemy.max_hp)
		enemy_manager.apply_status_effect(active_enemy, "burn", 3)
		_log("🔥 ULTIMATE [Solar Inferno Slash]: Valen deals %d critical damage and BURNS target!" % dmg, "ultimate")
		
	elif hero_id == "lyra_frost":
		var dmg = 500
		active_enemy.hp = clampi(active_enemy.hp - dmg, 0, active_enemy.max_hp)
		active_enemy.cooldown += 2.0
		enemy_manager.apply_status_effect(active_enemy, "freeze", 1)
		_log("❄️ ULTIMATE [Glacial Time Barrage]: Lyra strikes for %d & FREEZES hostile action!" % dmg, "ultimate")
		
	elif hero_id == "aethelgard_stone":
		var shield = 900
		hero_manager.apply_shield_squad(shield)
		_log("🛡️ ULTIMATE [Aegis Prism Sanctuary]: Aethelgard generates a massive +%d barrier!" % shield, "ultimate")

	# Check Enemy Vitality
	if active_enemy.hp <= 0:
		_on_enemy_defeated(active_enemy.name)

# Hostile strike execution
func _execute_enemy_strike() -> void:
	var dmg = active_enemy.attack_power
	_log("👹 HOSTILE ACTION: %s unleashes a heavy physical strike dealing %d damage!" % [active_enemy.name, dmg], "enemy")
	
	var penetrates = hero_manager.take_squad_damage(dmg)
	
	if hero_manager.is_squad_defeated():
		is_combat_active = false
		combat_defeat.emit()
		_log("💀 TEAM WIPE: All guardians defeated. Relic altar structures fractured.", "system")

# Enemy defeated callback
func _on_enemy_defeated(enemy_name: String) -> void:
	_log("💀 HOSTILE VAPORIZED: %s is slain by match synergies!" % enemy_name, "system")
	
	if enemy_queue.size() > 0:
		active_enemy = enemy_queue.pop_front()
		current_wave += 1
		_log("👾 WAVE INBOUND: %s emerges to defend the altar crystal arrays." % active_enemy.name, "system")
	else:
		# No enemies left in stage queue
		is_combat_active = false
		active_enemy = null
		combat_victory.emit()
		_log("👑 ARENA PURIFIED: All waves vanquished! Directing celestial light to harvest Relic Chests.", "system")

# Logging proxy
func _log(text: String, log_type: String) -> void:
	combat_log_updated.emit(text, log_type)
	print("[Godot Combat Engine][%s] %s" % [log_type.to_upper(), text])

# Signal bridges
func _on_enemy_status_triggered(type: String, dmg: int) -> void:
	_log("🔥 STATUS EFFECT: Burn triggers dealing %d damage!" % dmg, "system")
func _on_hero_ultimate_charged(hero_name: String) -> void:
	_log("⭐ ULTIMATE READY: %s's Ultimate gauge is fully charged!" % hero_name, "ultimate")
