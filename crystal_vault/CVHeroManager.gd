# ==========================================
# CROWNSPIRE: THE ASTRAL RELIQUARY (Godot 4.4)
# CVHeroManager.gd - Custom Godot 4.4 Hero Controller
# ==========================================
extends Node
class_name CVHeroManager

signal hero_ultimate_charged(hero_name: String)
signal hero_damaged(hero_name: String, amount: int, current_hp: int)
signal hero_healed(hero_name: String, amount: int, current_hp: int)

# Hero State Structure
class Hero:
	var id: String = ""
	var name: String = ""
	var role: String = "" # Infantry, Marksmen, Guardian
	var max_hp: int = 1000
	var hp: int = 1000
	var energy: int = 0
	var max_energy: int = 100
	var shield: int = 0
	var attack_power: int = 100
	var ultimate_name: String = ""
	var passive_name: String = ""

var active_heroes: Array[Hero] = []

func _ready() -> void:
	setup_default_heroes()

# Initialize the 3 guardian heroes
func setup_default_heroes() -> void:
	active_heroes.clear()
	
	# Hero 1: Valen (Infantry / Solar Fire)
	var valen := Hero.new()
	valen.id = "valen_solar"
	valen.name = "Valen Solar"
	valen.role = "Infantry"
	valen.max_hp = 1500
	valen.hp = 1500
	valen.attack_power = 180
	valen.ultimate_name = "Solar Inferno Slash"
	valen.passive_name = "Valor Radiance"
	active_heroes.append(valen)
	
	# Hero 2: Lyra (Marksmen / Glacial Frost)
	var lyra := Hero.new()
	lyra.id = "lyra_frost"
	lyra.name = "Lyra Frost"
	lyra.role = "Marksmen"
	lyra.max_hp = 1200
	lyra.hp = 1200
	lyra.attack_power = 160
	lyra.ultimate_name = "Glacial Time Barrage"
	lyra.passive_name = "Chill Precision"
	active_heroes.append(lyra)
	
	# Hero 3: Aethelgard (Guardian / Amber Earth)
	var aethelgard := Hero.new()
	aethelgard.id = "aethelgard_stone"
	aethelgard.name = "Aethelgard Bastion"
	aethelgard.role = "Guardian"
	aethelgard.max_hp = 2000
	aethelgard.hp = 2000
	aethelgard.attack_power = 120
	aethelgard.ultimate_name = "Aegis Prism Sanctuary"
	aethelgard.passive_name = "Fortress Heart"
	active_heroes.append(aethelgard)

# Charge energy for individual hero
func add_energy_to_hero(hero_id: String, amount: int) -> void:
	for hero in active_heroes:
		if hero.id == hero_id:
			var prev_energy = hero.energy
			hero.energy = clampi(hero.energy + amount, 0, hero.max_energy)
			if hero.energy >= 100 and prev_energy < 100:
				hero_ultimate_charged.emit(hero.name)

# Charge energy for the whole squad (Crystal matches)
func charge_all_energy(amount: int) -> void:
	for hero in active_heroes:
		add_energy_to_hero(hero.id, amount)

# Heal the whole team
func heal_squad(amount: int) -> void:
	for hero in active_heroes:
		hero.hp = clampi(hero.hp + amount, 0, hero.max_hp)
		hero_healed.emit(hero.name, amount, hero.hp)

# Apply shielding buffer
func apply_shield_squad(amount: int) -> void:
	for hero in active_heroes:
		hero.shield += amount

# Damage calculation from enemy strikes (shields reduce damage)
func take_squad_damage(amount: int) -> int:
	var total_damage_taken = amount
	
	# Shields absorb first
	for hero in active_heroes:
		if hero.shield > 0 and total_damage_taken > 0:
			var absorbed = clampi(hero.shield, 0, total_damage_taken)
			hero.shield -= absorbed
			total_damage_taken -= absorbed
			
	if total_damage_taken <= 0:
		return 0 # Shields fully absorbed
		
	# Distribute remaining damage across heroes
	var damage_per_hero = int(ceil(float(total_damage_taken) / float(active_heroes.size())))
	for hero in active_heroes:
		hero.hp = clampi(hero.hp - damage_per_hero, 0, hero.max_hp)
		hero_damaged.emit(hero.name, damage_per_hero, hero.hp)
		
	return total_damage_taken

# Check if team is defeated
func is_squad_defeated() -> bool:
	var total_hp = 0
	for hero in active_heroes:
		total_hp += hero.hp
	return total_hp <= 0

# Passive Skill Activation: Fortress Heart (Heals lowest HP hero)
func trigger_fortress_heart_passive() -> void:
	var lowest_hero: Hero = null
	var lowest_pct: float = 1.0
	
	for hero in active_heroes:
		var pct = float(hero.hp) / float(hero.max_hp)
		if pct < lowest_pct:
			lowest_pct = pct
			lowest_hero = hero
			
	if lowest_hero != null:
		var heal_amount = int((lowest_hero.max_hp - lowest_hero.hp) * 0.08)
		if heal_amount > 0:
			lowest_hero.hp = clampi(lowest_hero.hp + heal_amount, 0, lowest_hero.max_hp)
			hero_healed.emit(lowest_hero.name, heal_amount, lowest_hero.hp)
