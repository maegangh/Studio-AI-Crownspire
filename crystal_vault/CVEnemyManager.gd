# ==========================================
# CROWNSPIRE: THE ASTRAL RELIQUARY (Godot 4.4)
# CVEnemyManager.gd - Custom Godot 4.4 Enemy and Boss Controller
# ==========================================
extends Node
class_name CVEnemyManager

signal enemy_status_applied(status_type: String, duration: int)
signal enemy_status_triggered(status_type: String, damage: int)
signal enemy_defeated(enemy_name: String)

class Enemy:
	var id: String = ""
	var name: String = ""
	var emoji: String = ""
	var max_hp: int = 1000
	var hp: int = 1000
	var attack_power: int = 150
	var max_cooldown: int = 3
	var cooldown: float = 3.0
	var is_boss: bool = false
	var status_effects: Dictionary = {} # e.g. {"burn": 3, "slow": 2, "freeze": 1}

# Generate wave queue based on World Level
func generate_enemies_for_level(world: int, floor_num: int = 1) -> Array[Enemy]:
	var enemies: Array[Enemy] = []
	var scale_factor: float = maxf(1.0, float(floor_num) / 2.0)
	
	if world == 1:
		# Minion
		var golem := Enemy.new()
		golem.id = "crystal_golem"
		golem.name = "Stardust Golem"
		golem.max_hp = int(1200 * scale_factor)
		golem.hp = golem.max_hp
		golem.attack_power = int(150 * scale_factor)
		golem.max_cooldown = 3
		golem.cooldown = 3.0
		enemies.append(golem)
		
		# World 1 Boss
		var chimera := Enemy.new()
		chimera.id = "peak_monarch_boss"
		chimera.name = "Obsidian Chimera [BOSS]"
		chimera.max_hp = int(3500 * scale_factor)
		chimera.hp = chimera.max_hp
		chimera.attack_power = int(260 * scale_factor)
		chimera.max_cooldown = 4
		chimera.cooldown = 4.0
		chimera.is_boss = true
		enemies.append(chimera)
		
	elif world == 2:
		# Minion
		var scorpion := Enemy.new()
		scorpion.id = "sunscorch_scorpion"
		scorpion.name = "Sunscorch Sentinel"
		scorpion.max_hp = int(2400 * scale_factor)
		scorpion.hp = scorpion.max_hp
		scorpion.attack_power = int(190 * scale_factor)
		scorpion.max_cooldown = 3
		scorpion.cooldown = 3.0
		enemies.append(scorpion)
		
		# World 2 Boss
		var drake := Enemy.new()
		drake.id = "scorched_drake_boss"
		drake.name = "Scorched Sunspire Drake [BOSS]"
		drake.max_hp = int(6000 * scale_factor)
		drake.hp = drake.max_hp
		drake.attack_power = int(320 * scale_factor)
		drake.max_cooldown = 4
		drake.cooldown = 4.0
		drake.is_boss = true
		enemies.append(drake)
		
	else:
		# Deep Scaling (Endless columns or World 3)
		var overlord := Enemy.new()
		overlord.id = "abyss_overlord"
		overlord.name = "Aether Overlord"
		overlord.max_hp = int(3000 * scale_factor)
		overlord.hp = overlord.max_hp
		overlord.attack_power = int(200 * scale_factor)
		overlord.max_cooldown = 3
		overlord.cooldown = 3.0
		enemies.append(overlord)
		
		var colossus := Enemy.new()
		colossus.id = "volcanic_colossus"
		colossus.name = "Grand Volcanic Colossus [BOSS]"
		colossus.max_hp = int(8000 * scale_factor)
		colossus.hp = colossus.max_hp
		colossus.attack_power = int(380 * scale_factor)
		colossus.max_cooldown = 4
		colossus.cooldown = 4.0
		colossus.is_boss = true
		enemies.append(colossus)
		
	return enemies

# Apply status ailment to target enemy
func apply_status_effect(enemy: Enemy, type: String, duration: int) -> void:
	enemy.status_effects[type] = duration
	enemy_status_applied.emit(type, duration)

# Process active ticking statuses before turn actions
func process_status_ticks(enemy: Enemy) -> int:
	var total_burn_damage = 0
	var active_effects = enemy.status_effects.duplicate()
	
	for type in active_effects.keys():
		var remaining_duration = active_effects[type]
		
		if type == "burn":
			var dmg = 120
			enemy.hp = clampi(enemy.hp - dmg, 0, enemy.max_hp)
			total_burn_damage += dmg
			enemy_status_triggered.emit("burn", dmg)
			
		remaining_duration -= 1
		if remaining_duration <= 0:
			enemy.status_effects.erase(type)
		else:
			enemy.status_effects[type] = remaining_duration
			
	if enemy.hp <= 0:
		enemy_defeated.emit(enemy.name)
		
	return total_burn_damage
