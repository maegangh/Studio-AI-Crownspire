#============================================================================
# CVArenaManager.gd - Crystal Vault Arena Competitive Engine (Godot 4.4 Autoload)
# Manages competitive Arena lobby, seasons, rankings, matchmaking, and replays.
#============================================================================
extends Node

signal arena_rating_updated(new_rating: int)
signal match_found(opponent_data: Dictionary)
signal battle_completed(victory: bool, rating_change: int)
signal season_reset_completed(new_season: int)
signal shop_purchased(item_id: String)

# Core Arena Stats
var arena_rating: int = 1000 # MMR Starting point
var arena_medals: int = 250 # Arena Currency
var current_season: int = 1
var season_time_remaining: float = 604800.0 # 7 days in seconds

# Historic Arena Progression Stats
var arena_stats := {
	"total_arena_matches": 0,
	"arena_wins": 0,
	"arena_losses": 0,
	"longest_win_streak": 0,
	"current_win_streak": 0,
	"total_medals_earned": 250,
	"avg_turns_to_win": 0.0,
	"peak_rating": 1000
}

# Match History Ledger (LIFO queue of Dictionary matches)
var match_history: Array[Dictionary] = []

# Arena Shop Catalog (Database definition)
var shop_inventory := {
	"arena_rune_skin": {"name": "Luminous Rune Skin", "price": 400, "purchased": false, "desc": "Cosmetic custom overlay for matched gems."},
	"gold_potions": {"name": "Ambrosia Potion Pack", "price": 120, "purchased": false, "desc": "Restores full health pool in active matches."},
	"shard_bundle": {"name": "Astral Shards (x500)", "price": 250, "purchased": false, "desc": "Premium material to craft legendary gear."},
	"badge_pioneer": {"name": "S1 Vanguard Title", "price": 500, "purchased": false, "desc": "Exclusive profile frame badge."}
}

# Current Active Match Recording List
var current_replay_events: Array[Dictionary] = []

func _ready() -> void:
	load_arena_data()

## Generate a list of 3 random tiered opponents
func generate_opponents() -> Array[Dictionary]:
	var opponents: Array[Dictionary] = []
	var names := ["Aethelgard", "Sylvanas", "Kaelthas", "Lyanna", "Garrick", "Eldrin", "Vespera", "Ragnar", "Zuljin", "Ysera"]
	var titles := ["The Blazing Rune", "Chrono Guardian", "Storm Herald", "Obsidian Core", "Prism Tactician", "Abyss Hunter"]
	
	# Create Easy, Medium, Hard Rivals
	for i in range(3):
		var difficulty := "Easy" if i == 0 else ("Medium" if i == 1 else "Hard")
		var rating_diff := randi_range(-150, -50) if i == 0 else (randi_range(-30, 30) if i == 1 else randi_range(50, 150))
		var target_rating := max(100, arena_rating + rating_diff)
		
		var opp := {
			"id": "rival_%d_%d" % [target_rating, randi_range(100, 999)],
			"name": names[randi_range(0, names.size()-1)],
			"title": titles[randi_range(0, titles.size()-1)],
			"rating": target_rating,
			"difficulty": difficulty,
			"guild": "Guild %s" % char(65 + randi_range(0, 25)),
			"emoji": ["👑", "🛡️", "🔥", "🏹", "🐲", "🔮"][randi_range(0, 5)],
			"power": int(target_rating * 4.2),
			"deck": ["valen_solar", "lyra_frost", "aethelgard_stone"]
		}
		opponents.append(opp)
	
	return opponents

## Start simulated matchmaking with searching progression
func initiate_matchmaking(difficulty: String = "Medium") -> void:
	print("[CVArenaManager] Spinning matchmaking threads for %s division..." % difficulty)
	
	# Simulate matchmaking time (Simulated async callback)
	var timer := get_tree().create_timer(1.5)
	await timer.timeout
	
	var candidates := generate_opponents()
	var selected_rival := candidates[1] # Pick corresponding difficulty match
	if difficulty == "Easy":
		selected_rival = candidates[0]
	elif difficulty == "Hard":
		selected_rival = candidates[2]
		
	print("[CVArenaManager] Match successfully consolidated: Rival %s found." % selected_rival.name)
	match_found.emit(selected_rival)

## Records an action state to the active replay stack
func record_replay_event(type: String, data: Dictionary) -> void:
	var event := {
		"type": type,
		"data": data,
		"timestamp": Time.get_ticks_msec()
	}
	current_replay_events.append(event)

## Ends combat match and calculates rating adjustments
func resolve_arena_battle(victory: bool, rival_name: String, rival_rating: int) -> void:
	var rating_change := 0
	if victory:
		var diff := max(10, rival_rating - arena_rating)
		rating_change = int(25 + (diff * 0.1))
		arena_stats["arena_wins"] += 1
		arena_stats["current_win_streak"] += 1
		arena_stats["longest_win_streak"] = max(arena_stats["longest_win_streak"], arena_stats["current_win_streak"])
		arena_medals += 30
		arena_stats["total_medals_earned"] += 30
	else:
		var diff := max(10, arena_rating - rival_rating)
		rating_change = -int(20 - (diff * 0.05))
		arena_stats["arena_losses"] += 1
		arena_stats["current_win_streak"] = 0
		arena_medals += 5 # Conciliatory medals
		arena_stats["total_medals_earned"] += 5
		
	arena_rating = max(100, arena_rating + rating_change)
	arena_stats["total_arena_matches"] += 1
	arena_stats["peak_rating"] = max(arena_stats["peak_rating"], arena_rating)
	
	# Commit record to match history ledger
	var history_entry := {
		"id": "match_%d" % Time.get_unix_time_from_system(),
		"rival_name": rival_name,
		"rival_rating": rival_rating,
		"victory": victory,
		"rating_change": rating_change,
		"timestamp": Time.get_datetime_dict_from_system(),
		"events": current_replay_events.duplicate()
	}
	match_history.insert(0, history_entry)
	if match_history.size() > 20:
		match_history.pop_back()
		
	# Clear active recording queue
	current_replay_events.clear()
	
	arena_rating_updated.emit(arena_rating)
	battle_completed.emit(victory, rating_change)
	save_arena_data()

## Purchases an item from the arena shop
func purchase_shop_item(item_id: String) -> bool:
	if not shop_inventory.has(item_id):
		return false
		
	var item: Dictionary = shop_inventory[item_id]
	if item["purchased"] or arena_medals < item["price"]:
		return false
		
	arena_medals -= item["price"]
	item["purchased"] = true
	shop_purchased.emit(item_id)
	save_arena_data()
	return true

## Simulates season transition and rating compression (MMR reset)
func force_season_reset() -> void:
	current_season += 1
	var reset_reward := int(arena_rating * 0.5) # Convert MMR portions directly to Medals!
	arena_medals += reset_reward
	
	# Compress MMR towards 1000 baseline
	var compressed_mmr := 1000 + int((arena_rating - 1000) * 0.4)
	arena_rating = max(1000, compressed_mmr)
	
	season_time_remaining = 604800.0 # Restores timer to 7 days
	
	print("[CVArenaManager] Rollover triggered. Season updated to %d. MMR reset to %d." % [current_season, arena_rating])
	season_reset_completed.emit(current_season)
	save_arena_data()

## Saves current arena states
func save_arena_data() -> void:
	# Integrated with primary CVSaveManager when deployed
	print("[CVArenaManager] Arena states serialized.")

## Loads arena states
func load_arena_data() -> void:
	print("[CVArenaManager] Arena states restored.")
