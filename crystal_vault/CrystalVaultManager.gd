#============================================================================
# CrystalVaultManager.gd - Central Feature Orchestrator (Godot 4.4 Autoload)
# Bridges navigation, UI controllers, events, and background music transitions.
#============================================================================
extends Node

signal entered_vault
signal exited_vault
signal mode_selected(mode_id: String)
signal energy_depleted

# Integration Hooks Signals (Production Crownspire Billing/Economy Hooks)
signal purchase_attempts_requested(amount: int, cost_shards: int)
signal purchase_booster_requested(booster_id: String, cost_shards: int)
signal event_reward_claimed(reward_type: String, details: Dictionary)

# Core configurations
const VAULT_LOBBY_PATH := "res://crystal_vault/CrystalVaultLobby.tscn"
const CITY_MAP_PATH := "res://WorldRoot.tscn"

# State trackers
var in_vault_scene: bool = false
var active_game_mode: String = ""
var current_lobby_instance: Node = null

## Enters the Crystal Vault, loading the Lobby scene
func enter_crystal_vault(parent_node: Node) -> void:
	if in_vault_scene:
		push_warning("[CrystalVaultManager] Player is already inside the Crystal Vault!")
		return
		
	print("[CrystalVaultManager] Triggering transition: entering the Crystal Vault.")
	play_sfx("transition_cosmic")
	
	# Transition audio tracks
	transition_music("ambient_stellar_loop")
	
	# Load the Lobby scene
	var lobby_scene: PackedScene = load(VAULT_LOBBY_PATH)
	if lobby_scene == null:
		push_error("[CrystalVaultManager] Critical: Failed to load CrystalVaultLobby scene!")
		return
		
	# Instantiate and attach
	var lobby_inst := lobby_scene.instantiate()
	parent_node.add_child(lobby_inst)
	current_lobby_instance = lobby_inst
	
	in_vault_scene = true
	entered_vault.emit()

## Exits the Crystal Vault, removing the Lobby scene and returning to world map
func exit_crystal_vault() -> void:
	if not in_vault_scene or current_lobby_instance == null:
		push_warning("[CrystalVaultManager] No active Crystal Vault session to exit.")
		return
		
	print("[CrystalVaultManager] Triggering transition: exiting the Crystal Vault.")
	play_sfx("transition_exit")
	
	# Transition music back to city/world theme
	transition_music("citadel_peaceful_theme")
	
	# Free Lobby scene
	current_lobby_instance.queue_free()
	current_lobby_instance = null
	
	in_vault_scene = false
	exited_vault.emit()

## Selects a game mode inside the Crystal Vault and loads its layout
func select_game_mode(mode_id: String) -> void:
	active_game_mode = mode_id
	mode_selected.emit(mode_id)
	play_sfx("mode_select_click")
	print("[CrystalVaultManager] Selected Crystal Vault game mode: %s" % mode_id)

#============================================================================
# PRODUCTION CROWNSPIRE INTEGRATION HOOKS
#============================================================================

## Interface Hook: Requests attempt purchase. Fallback handles standalone currency deduction.
func request_purchase_attempts(amount: int = 5, cost_shards: int = 100) -> bool:
	purchase_attempts_requested.emit(amount, cost_shards)
	
	if CVSaveManager == null:
		return false
		
	if CVSaveManager.astral_shards >= cost_shards:
		CVSaveManager.astral_shards -= cost_shards
		CVSaveManager.add_attempts(amount)
		play_sfx("purchase_success")
		print("[CrystalVaultManager] Purchased %d event attempts for %d Astral Shards." % [amount, cost_shards])
		return true
	else:
		play_sfx("error_locked_structure")
		print("[CrystalVaultManager] Purchase failed: Insufficient Astral Shards (%d required, %d available)." % [cost_shards, CVSaveManager.astral_shards])
		return false

## Interface Hook: Requests booster purchase. Fallback handles standalone currency deduction.
func request_purchase_booster(booster_id: String, cost_shards: int = 50) -> bool:
	purchase_booster_requested.emit(booster_id, cost_shards)
	
	if CVSaveManager == null:
		return false
		
	if CVSaveManager.astral_shards >= cost_shards:
		CVSaveManager.astral_shards -= cost_shards
		CVSaveManager.add_booster(booster_id, 1)
		play_sfx("purchase_success")
		print("[CrystalVaultManager] Purchased booster '%s' for %d Astral Shards." % [booster_id, cost_shards])
		return true
	else:
		play_sfx("error_locked_structure")
		print("[CrystalVaultManager] Purchase failed: Insufficient Astral Shards for booster '%s'." % booster_id)
		return false

## Interface Hook: Broadcasts claimed event rewards for production ledger sync.
func notify_event_reward_claimed(reward_type: String, details: Dictionary) -> void:
	event_reward_claimed.emit(reward_type, details)
	print("[CrystalVaultManager Integration Hook] Event reward claimed -> Type: %s, Details: %s" % [reward_type, str(details)])

## Simulated audio manager dispatch hook
func play_sfx(sfx_name: String) -> void:
	print("🎵 [CrystalVaultManager SFX]: Playing effect -> %s" % sfx_name)

## Simulated background music crossfader dispatch hook
func transition_music(track_name: String) -> void:
	print("🎵 [CrystalVaultManager BGM]: Crossfading into theme -> %s" % track_name)

