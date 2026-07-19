# Sovereign Crownmark System — Godot 4 Full Implementation Plan

This technical document outlines the entire software design architecture for implementing the **Sovereign Crownmark system** inside the **Crownspire** game client using **Godot 4** and **GDScript 2.0**.

---

## 🏛️ System Architecture Overview

The system is designed with a **Separation of Concerns (SoC)** approach, matching the existing Crownspire MMO architecture. The layout comprises:
1. **Global Autoloads (Singletons)**: Static data lookups and global event brokers.
2. **State Models**: Safe, instanced, mutable local player states (Inventory & Heroes).
3. **Domain Services**: Formulas, calculators, and validation checkers.
4. **Interactive Views**: Custom UI controllers operating reactively through Signals.

```
       [ CrownmarkGlobals ] (Autoload) <====== Signals ======> [ UI Panels / Screens ]
              ||                                                   ||
              \/                                                   \/
[ CrownmarkDataManager ] (Autoload)                        [ CrownmarkEquipService ]
              ||                                                   ||
              \/                                                   \/
   [ Static Database JSONs ]                                [ CrownmarkInventory ]
```

---

## 1. Global Autoloads (Singletons)

Singletons run globally and provide decoupled, high-performance event bridges.

### `CrownmarkGlobals` (`autoload/crownmark_globals.gd`)
Manages global events, save paths, and anti-cheat passwords.
```gdscript
# autoload/crownmark_globals.gd
extends Node

signal crownmark_equipped(hero_id: String, crownmark_instance_id: String, slot_type: String)
signal crownmark_unequipped(hero_id: String, crownmark_instance_id: String)
signal inventory_updated
signal resonance_state_changed(hero_id: String, active_set_name: String, active_tier: int)

const SAVE_PATH = "user://sovereign_crownmarks_v1.save"
const SAVE_KEY = "Crownspire_AntiCheat_SecKey129"

func _ready() -> void:
    process_mode = Node.PROCESS_MODE_ALWAYS
    print("[CROWNMARK_GLOBALS] Autoload initialized, listening for game lifecycle events.")
```

---

## 2. DataManager Integration

The central loader node that reads Godot-compatible JSON schemas at startup, parses static attributes, and exposes fast query templates.

### `CrownmarkDataManager` (`autoload/crownmark_data_manager.gd`)
```gdscript
# autoload/crownmark_data_manager.gd
extends Node

const PATH_CROWNMARKS = "res://data/crownmarks.json"
const PATH_RESONANCE = "res://data/crownmark_resonance.json"
const PATH_COLLECTIONS = "res://data/crownmark_collections.json"
const PATH_UPGRADES = "res://data/crownmark_upgrade_costs.json"
const PATH_FRAGMENTS = "res://data/crownmark_fragments.json"
const PATH_SIGNATURES = "res://data/hero_signature_crownmarks.json"

var crownmarks: Dictionary = {}
var resonance: Dictionary = {}
var collections: Array = []
var upgrade_costs: Dictionary = {}
var fragments_config: Dictionary = {}
var signatures: Dictionary = {}

func _ready() -> void:
    _load_all_databases()

func _load_all_databases() -> void:
    crownmarks = _load_json_as_dict(PATH_CROWNMARKS).get("crownmarks", {})
    resonance = _load_json_as_dict(PATH_RESONANCE).get("heroes_resonance", {})
    collections = _load_json_as_dict(PATH_COLLECTIONS).get("collections", [])
    upgrade_costs = _load_json_as_dict(PATH_UPGRADES)
    fragments_config = _load_json_as_dict(PATH_FRAGMENTS)
    
    var sig_list = _load_json_as_dict(PATH_SIGNATURES).get("hero_signature_mappings", [])
    for item in sig_list:
        signatures[item.get("hero_id", "")] = item
    
    print("[DATA_MANAGER] Static crownmark data loaded successfully.")

func _load_json_as_dict(path: String) -> Dictionary:
    if not FileAccess.file_exists(path):
        push_error("Missing database schema at " + path)
        return {}
    var file = FileAccess.open(path, FileAccess.READ)
    var json_string = file.get_as_text()
    file.close()
    
    var parsed = JSON.parse_string(json_string)
    if parsed == null or typeof(parsed) != TYPE_DICTIONARY:
        push_error("Failed to parse JSON file at " + path)
        return {}
    return parsed

func get_crownmark_template(crownmark_id: String) -> Dictionary:
    return crownmarks.get(crownmark_id, {})

func get_resonance_config(hero_id: String) -> Dictionary:
    return resonance.get(hero_id, {})

func get_upgrade_level_cost(level: int) -> Dictionary:
    var lv_array = upgrade_costs.get("levels", [])
    if level - 1 < lv_array.size() and level - 1 >= 0:
         return lv_array[level - 1]
    return {}
```

---

## 3. Inventory Manager

A runtime dynamic class instance containing the user's active bag instances.

### `CrownmarkInventory` (`classes/crownmark_inventory.gd`)
```gdscript
class_name CrownmarkInventory
extends RefCounted

# Dynamic items dictionary keyed by UUID string
var items: Dictionary = {}

# Raw persistent currencies
var crownmark_dust: int = 1000
var omni_shards: int = 5

func add_crownmark_instance(crownmark_id: String) -> String:
    var uuid = _generate_uuid()
    items[uuid] = {
        "id": uuid,
        "crownmark_id": crownmark_id,
        "level": 1,
        "star": 1,
        "equipped_hero": ""
    }
    CrownmarkGlobals.inventory_updated.emit()
    return uuid

func delete_crownmark_instance(uuid: String) -> void:
    if items.has(uuid):
        items.erase(uuid)
        CrownmarkGlobals.inventory_updated.emit()

func get_all_unbound_crownmarks() -> Array:
    var results = []
    for uuid in items:
        if items[uuid]["equipped_hero"] == "":
            results.append(items[uuid])
    return results

func _generate_uuid() -> String:
    randomize()
    return str(Time.get_unix_time_from_system()) + "_" + str(randi() % 1000000)
```

---

## 4. Crownmark Manager

Maintains the exact equipped sockets for an individual commander.

### `CrownmarkManager` (`classes/crownmark_manager.gd`)
```gdscript
class_name CrownmarkManager
extends RefCounted

const NUM_SLOTS = 8

# Array storing UUIDs of equipped crownmarks, ordered (0..7)
var equipped_slots: Array = ["", "", "", "", "", "", "", ""]
var owner_hero_id: String = ""

func _init(hero_id: String) -> void:
    owner_hero_id = hero_id

func get_equipped_crownmarks_list(inventory: CrownmarkInventory) -> Array:
    var list = []
    for uuid in equipped_slots:
        if uuid != "" and inventory.items.has(uuid):
            list.append(inventory.items[uuid])
    return list
```

---

## 5. Save System (Security Encrypted)

Saves active player profiles locally using safe 128-bit key hashing to block memory injections or local save cheating.

### `CrownmarkSaveSystem` (`autoload/crownmark_save_system.gd`)
```gdscript
extends Node

func save_profile(inventory: CrownmarkInventory, hero_mappings: Dictionary) -> void:
    var save_dict = {
        "crownmark_dust": inventory.crownmark_dust,
        "omni_shards": inventory.omni_shards,
        "items": inventory.items,
        "hero_mappings": hero_mappings
    }
    
    var file = FileAccess.open_encrypted_with_pass(
        CrownmarkGlobals.SAVE_PATH, 
        FileAccess.WRITE, 
        CrownmarkGlobals.SAVE_KEY
    )
    if file:
        var json_string = JSON.stringify(save_dict)
        file.store_string(json_string)
        file.close()
        print("[SAVE_SYSTEM] Player crownmarks and socket maps saved securely.")

func load_profile(inventory: CrownmarkInventory) -> Dictionary:
    if not FileAccess.file_exists(CrownmarkGlobals.SAVE_PATH):
        return {}
        
    var file = FileAccess.open_encrypted_with_pass(
        CrownmarkGlobals.SAVE_PATH, 
        FileAccess.READ, 
        CrownmarkGlobals.SAVE_KEY
    )
    if not file:
        push_error("[SAVE_SYSTEM] Decryption password match failed.")
        return {}
        
    var json_string = file.get_as_text()
    file.close()
    
    var parsed = JSON.parse_string(json_string)
    if parsed and parsed.has("items"):
        inventory.crownmark_dust = parsed.get("crownmark_dust", 0)
        inventory.omni_shards = parsed.get("omni_shards", 0)
        inventory.items = parsed["items"]
        return parsed.get("hero_mappings", {})
    return {}
```

---

## 6. Equip Logic & Slot Validation

Validates constraints, affinities, and unlocks before swapping slots.

### `CrownmarkEquipService` (`services/crownmark_equip_service.gd`)
```gdscript
class_name CrownmarkEquipService
extends RefCounted

static func equip_crownmark(
    hero_id: String,
    crownmark_uuid: String,
    slot_idx: int,
    inventory: CrownmarkInventory,
    hero_equipments: Dictionary
) -> bool:
    if not inventory.items.has(crownmark_uuid):
        return false
        
    var crownmark_inst = inventory.items[crownmark_uuid]
    var template_id = crownmark_inst["crownmark_id"]
    var template = CrownmarkDataManager.get_crownmark_template(template_id)
    
    # Validation: Affinity Gate
    var affinity = template.get("hero_affinity", "")
    if affinity != "" and affinity != hero_id:
        print("[EQUIP_REJECTED] Incompatible hero affinity: ", affinity)
        return false
        
    if not hero_equipments.has(hero_id):
        hero_equipments[hero_id] = ["", "", "", "", "", "", "", ""]
        
    var active_slots: Array = hero_equipments[hero_id]
    
    # Unbind previously bound crownmark
    var old_crownmark_uuid = active_slots[slot_idx]
    if old_crownmark_uuid != "":
        inventory.items[old_crownmark_uuid]["equipped_hero"] = ""
        
    # Strip this crownmark from other heroes if previously equipped
    var prev_hero = crownmark_inst["equipped_hero"]
    if prev_hero != "" and hero_equipments.has(prev_hero):
        var prev_slots: Array = hero_equipments[prev_hero]
        var old_idx = prev_slots.find(crownmark_uuid)
        if old_idx != -1:
            prev_slots[old_idx] = ""
            
    # Bind new crownmark
    active_slots[slot_idx] = crownmark_uuid
    crownmark_inst["equipped_hero"] = hero_id
    
    CrownmarkGlobals.crownmark_equipped.emit(hero_id, crownmark_uuid, template.get("slot", "generic"))
    CrownmarkGlobals.inventory_updated.emit()
    return true
```

---

## 7. Stat Calculations

Combines standard base template values with progression scaling.

### `CrownmarkCalculator` (`formulas/crownmark_calculator.gd`)
```gdscript
class_name CrownmarkCalculator
extends RefCounted

static func get_crownmark_stats(crownmark_instance: Dictionary) -> Dictionary:
    var template_id = crownmark_instance["crownmark_id"]
    var template = CrownmarkDataManager.get_crownmark_template(template_id)
    var level = crownmark_instance.get("level", 1)
    var star = crownmark_instance.get("star", 1)
    
    var final_stats = {}
    var base_stats: Dictionary = template.get("base_stats", {})
    var growth: Dictionary = template.get("growth_per_level", {})
    
    # 15% bonus multiplier per awakening star
    var star_multiplier = 1.0 + ((star - 1) * 0.15)
    
    for stat_key in base_stats:
        var base_val = base_stats[stat_key]
        var growth_val = growth.get(stat_key, 0.0)
        
        # Standard Formula: (Base + Growth * (Level - 1)) * Star Multiplier
        var calculated = (base_val + growth_val * (level - 1)) * star_multiplier
        final_stats[stat_key] = calculated
        
    return final_stats
```

---

## 8. Resonance Calculation

Calculates equipped slots to see if matching affinities activate 2, 3, 4, or 5 piece resonance bonus tiers.

### `CrownmarkResonanceScanner` (`formulas/crownmark_resonance_scanner.gd`)
```gdscript
class_name CrownmarkResonanceScanner
extends RefCounted

static func get_active_resonance_tier(hero_id: String, hero_slots: Array, inventory: CrownmarkInventory) -> Dictionary:
    var resonance_data = CrownmarkDataManager.get_resonance_config(hero_id)
    if resonance_data.is_empty():
        return {"active_tier_idx": -1, "match_count": 0, "unlocked_tiers": []}
        
    var set_name = resonance_data.get("set_name", "")
    var match_count = 0
    
    for uuid in hero_slots:
        if uuid != "" and inventory.items.has(uuid):
            var item = inventory.items[uuid]
            var template = CrownmarkDataManager.get_crownmark_template(item["crownmark_id"])
            var affinity = template.get("hero_affinity", "")
            
            if affinity == hero_id:
                match_count += 1
                
    var active_tiers = []
    var max_idx = -1
    var tiers_list: Array = resonance_data.get("tiers", [])
    
    for i in range(tiers_list.size()):
        var tier = tiers_list[i]
        var count_req = tier.get("count_required", 0)
        if match_count >= count_req:
            active_tiers.append(tier)
            max_idx = i
            
    return {
        "set_name": set_name,
        "match_count": match_count,
        "active_tier_idx": max_idx,
        "unlocked_tiers": active_tiers
    }
```

---

## 9. Passive Skills System

Integrates active resonance modifiers into the client combat simulation engine.

### `CrownmarkCombatHooks` (`combat/crownmark_combat_hooks.gd`)
```gdscript
class_name CrownmarkCombatHooks
extends RefCounted

static func apply_resonance_modifiers(commander_node: Node, resonance_state: Dictionary) -> void:
    var active_tiers: Array = resonance_state.get("unlocked_tiers", [])
    for tier in active_tiers:
        var stats: Dictionary = tier.get("stat_modifiers", {})
        for key in stats:
            var value = stats[key]
            if commander_node.has_method("apply_stat_multiplier"):
                commander_node.apply_stat_multiplier(key, value)
                
    var idx = resonance_state.get("active_tier_idx", -1)
    if idx >= 0:
        CrownmarkGlobals.resonance_state_changed.emit(
            commander_node.hero_id, 
            resonance_state.get("set_name", ""),
            idx + 1
        )
```

---

## 10. Hero Screen UI Node

Exhibits the selected hero flanked by circular orbital slots.

### `CrownmarkHeroScreen` (`ui/crownmark_hero_screen.gd`)
```gdscript
extends Control

@onready var slot_nodes: Array[Button] = [
    $Slots/Weapon, $Slots/Crown, $Slots/Armor, $Slots/Banner,
    $Slots/Accessory, $Slots/Ring, $Slots/Goggles, $Slots/Crucible
]
@onready var aura_particles := $MainPedestal/AuraParticles

var selected_hero_id: String = "maegan"
var inventory: CrownmarkInventory
var hero_equip_maps: Dictionary = {}

func _ready() -> void:
    CrownmarkGlobals.crownmark_equipped.connect(_on_crownmark_equipped)
    _refresh_slots_wheel()

func _refresh_slots_wheel() -> void:
    var active_slots = hero_equip_maps.get(selected_hero_id, ["", "", "", "", "", "", "", ""])
    
    for idx in range(8):
        var btn = slot_nodes[idx]
        var uuid = active_slots[idx]
        
        if uuid == "":
            btn.text = "EMPTY"
            btn.modulate = Color(0.3, 0.3, 0.3)
        else:
            var inst = inventory.items[uuid]
            var template = CrownmarkDataManager.get_crownmark_template(inst["crownmark_id"])
            btn.text = template.get("name", "Crownmark")
            btn.modulate = Color(1.0, 1.0, 1.0)
            
    _update_resonance_glowing_aura()

func _update_resonance_glowing_aura() -> void:
    var active_slots = hero_equip_maps.get(selected_hero_id, ["", "", "", "", "", "", "", ""])
    var res_result = CrownmarkResonanceScanner.get_active_resonance_tier(selected_hero_id, active_slots, inventory)
    var active_tier = res_result.get("active_tier_idx", -1)
    
    if active_tier >= 2: # At least Tier 3 (diadem/mantle/bow matching)
        aura_particles.emitting = true
        var aura_color = CrownmarkDataManager.get_resonance_config(selected_hero_id).get("visual_effects", {}).get("aura_color", "#ffffff")
        aura_particles.color = Color.from_string(aura_color, Color.WHITE)
    else:
        aura_particles.emitting = false

func _on_crownmark_equipped(hero: String, _uuid: String, _slot: String) -> void:
    if hero == selected_hero_id:
        _refresh_slots_wheel()
```

---

## 11. Crownmark Screen Detail Inspector

Inspects and renders detailed attributes, stats, level curves, and lore text.

### `CrownmarkDetailInspector` (`ui/crownmark_detail_inspector.gd`)
```gdscript
extends PanelContainer

@onready var name_label := $VBoxContainer/Header/Name
@onready var stats_container := $VBoxContainer/StatsBody/StatsList
@onready var lore_label := $VBoxContainer/LoreFooter/LoreText
@onready var level_lbl := $VBoxContainer/StatsBody/Level

func display_crownmark_details(crownmark_instance: Dictionary) -> void:
    var template_id = crownmark_instance["crownmark_id"]
    var template = CrownmarkDataManager.get_crownmark_template(template_id)
    
    name_label.text = template.get("name", "Sovereign Crownmark")
    level_lbl.text = "Level " + str(crownmark_instance.get("level", 1)) + " / Star " + str(crownmark_instance.get("star", 1))
    
    # Clear old list elements
    for child in stats_container.get_children():
        child.queue_free()
        
    var current_stats = CrownmarkCalculator.get_crownmark_stats(crownmark_instance)
    for stat_key in current_stats:
        var lbl = Label.new()
        lbl.text = stat_key.capitalize() + ": +" + str(current_stats[stat_key])
        stats_container.add_child(lbl)
        
    var lore_aff = CrownmarkDataManager.signatures.get(template.get("hero_affinity", ""), {})
    var level_str = "level_" + str(crownmark_instance.get("star", 1))
    lore_label.text = lore_aff.get("affinity_lore_unlocked", {}).get(level_str, "Historical artifact preserved from the first Eclipse battle.")
```

---

## 12. Inventory Screen

Renders dynamic cards in a standard responsive layout.

### `CrownmarkInventoryGrid` (`ui/crownmark_inventory_grid.gd`)
```gdscript
extends Control

@export var card_scene: PackedScene
@onready var grid_container := $ScrollContainer/GridContainer

func populate_inventory_grid(items_list: Array) -> void:
    for child in grid_container.get_children():
        child.queue_free()
        
    for item_data in items_list:
        var card_node = card_scene.instantiate()
        grid_container.add_child(card_node)
        card_node.setup_card(item_data)
```

---

## 13. Collection Screen (Codex Museum)

Fulfills museum collection volumes by calculating completed collection volumes.

### `CrownmarkCollectionScreen` (`ui/crownmark_collection_screen.gd`)
```gdscript
extends Control

@onready var list_container := $ScrollContainer/VBoxContainer

func refresh_codex_achievements(inventory: CrownmarkInventory) -> void:
    for child in list_container.get_children():
        child.queue_free()
        
    for collection in CrownmarkDataManager.collections:
        var name = collection["name"]
        var required_ids: Array = collection["required_crownmarks"]
        var match_count = 0
        
        for req_id in required_ids:
            var owned = false
            for uuid in inventory.items:
                if inventory.items[uuid]["crownmark_id"] == req_id:
                    owned = true
                    break
            if owned:
                match_count += 1
                
        var is_complete = (match_count == required_ids.size())
        var item_row = Label.new()
        item_row.text = "[ " + ("✓ COMPLETE" if is_complete else "INCOMPLETE") + " ] " + name + " (" + str(match_count) + "/" + str(required_ids.size()) + ")"
        list_container.add_child(item_row)
```

---

## 14. Upgrade Screen (Star Forge Terminal)

Uses starlight dust or duplicates to trigger promos and awakens.

### `StarForgeService` (`services/star_forge_service.gd`)
```gdscript
class_name StarForgeService
extends RefCounted

static func level_up_crownmark(crownmark_uuid: String, inventory: CrownmarkInventory) -> bool:
    if not inventory.items.has(crownmark_uuid):
        return false
        
    var crownmark = inventory.items[crownmark_uuid]
    var current_level = crownmark.get("level", 1)
    
    var cost_data = CrownmarkDataManager.get_upgrade_level_cost(current_level)
    if cost_data.is_empty():
        return false # Max level reached
        
    var dust_required = cost_data.get("dust_cost", 100)
    if inventory.crownmark_dust >= dust_required:
        inventory.crownmark_dust -= dust_required
        crownmark["level"] = current_level + 1
        CrownmarkGlobals.inventory_updated.emit()
        return true
    return false
```

---

## 15. Sort Filters

Provides custom insertion hooks for ordering crownmarks.

### `CrownmarkSortingService` (`services/crownmark_sorting_service.gd`)
```gdscript
class_name CrownmarkSortingService
extends RefCounted

static func sort_crownmarks(crownmarks_list: Array, criteria: String) -> Array:
    var sorted = crownmarks_list.duplicate()
    
    if criteria == "level":
        sorted.sort_custom(func(a, b): return a["level"] > b["level"])
    elif criteria == "rarity":
        sorted.sort_custom(func(a, b):
            var temp_a = CrownmarkDataManager.get_crownmark_template(a["crownmark_id"])
            var temp_b = CrownmarkDataManager.get_crownmark_template(b["crownmark_id"])
            return temp_a.get("rarity", "") > temp_b.get("rarity", "")
        )
    return sorted
```

---

## 16. Search Filters

Dynamic fuzzy name searches avoiding frame dropouts.

### `CrownmarkSearchController` (`ui/crownmark_search_controller.gd`)
```gdscript
extends Node

static func filter_by_search(crownmarks_list: Array, search_query: String) -> Array:
    if search_query == "":
        return crownmarks_list
        
    var query = search_query.to_lower()
    var matched = []
    
    for item in crownmarks_list:
        var template = CrownmarkDataManager.get_crownmark_template(item["crownmark_id"])
        var name = template.get("name", "").to_lower()
        var slot = template.get("slot", "").to_lower()
        
        if query in name or query in slot:
            matched.append(item)
            
    return matched
```

---

## 17. Animations (Shaders & VFX)

Updates shader parameters dynamically when milestones are achieved.

### `CrownmarkAuras` (`shaders/crownmark_auras.gd`)
```gdscript
extends Node

static func update_shader_uniforms(sprite_node: Sprite2D, resonance_tier: int, aura_color: Color) -> void:
    var material = sprite_node.material as ShaderMaterial
    if not material:
        return
        
    material.set_shader_parameter("tier_threshold", float(resonance_tier))
    material.set_shader_parameter("glow_intensity", 1.2 if resonance_tier >= 3 else 0.4)
    material.set_shader_parameter("spectral_tint", aura_color)
```

---

## 18. Performance Considerations

To keep Crownspire running smoothly at 60 FPS:
1. **Thread-Safe Loader**: Load massive asset icons using `ResourceLoader.load_threaded_request()` to prevent screen freezes on low-tier mobile devices.
2. **Dynamic UI Pooling**: Recycle particle nodes (`CPUParticles2D`) instead of constantly instantiating and freeing nodes.
3. **Lazy-Loading Panels**: Instantiate heavy collection codexes and upgrade panels on-demand when clicked, instead of booting them at startup.
4. **Input Debouncing**: Wait for 150ms on search bars before executing filter checks on massive player list structures.

---

## 19. Networking & Server Sync

Handles client-server synchronization, server-authoritative verification, and optimistic UI rollback mechanics.

### `CrownmarkNetworkSync` (`autoload/crownmark_network_sync.gd`)
```gdscript
# autoload/crownmark_network_sync.gd
extends Node

signal sync_completed(success: bool, error_message: String)

const API_SERVER_URL = "https://api.crownspire.com/v1/crownmarks"
var pending_actions: Dictionary = {}

func sync_equip_to_server(hero_id: String, slot_idx: int, crownmark_uuid: String, rollback_uuid: String) -> void:
    var action_id = str(Time.get_ticks_msec()) + "_" + str(randi() % 1000)
    pending_actions[action_id] = {
        "type": "equip",
        "hero_id": hero_id,
        "slot_idx": slot_idx,
        "rollback_uuid": rollback_uuid
    }
    
    var http_request = HTTPRequest.new()
    add_child(http_request)
    http_request.request_completed.connect(self._on_request_completed.bind(action_id, http_request))
    
    var payload = {
        "hero_id": hero_id,
        "slot_idx": slot_idx,
        "crownmark_uuid": crownmark_uuid
    }
    var headers = ["Content-Type: application/json", "Authorization: Bearer example_token"]
    http_request.request(API_SERVER_URL + "/equip", headers, HTTPClient.METHOD_POST, JSON.stringify(payload))

func _on_request_completed(result: int, response_code: int, headers: PackedStringArray, body: PackedByteArray, action_id: String, http_node: HTTPRequest) -> void:
    http_node.queue_free()
    if response_code == 200:
        pending_actions.erase(action_id)
        sync_completed.emit(true, "")
    else:
        _handle_network_failure(action_id, "Server validation failed")

func _handle_network_failure(action_id: String, error_msg: String) -> void:
    if not pending_actions.has(action_id): return
    var action = pending_actions[action_id]
    if action["type"] == "equip":
        CrownmarkGlobals.crownmark_equipped.emit(action["hero_id"], action["rollback_uuid"], "rollback")
    pending_actions.erase(action_id)
    sync_completed.emit(false, error_msg)
```

---

## 20. Future Expansion Hub

Provides runtime adapters to allow modular system scaling, dynamic slot registration, and custom multiplier curves without modifying core systems.

### `CrownmarkExpansionAdapter` (`classes/crownmark_expansion_adapter.gd`)
```gdscript
# classes/crownmark_expansion_adapter.gd
class_name CrownmarkExpansionAdapter
extends RefCounted

static var custom_slots: Dictionary = {}
static var expansion_multipliers: Dictionary = {}

static func register_custom_slot(slot_name: String, icon_path: String, restrictions: Dictionary) -> void:
    custom_slots[slot_name] = {
        "icon": icon_path,
        "rules": restrictions
    }
    print("[EXPANSION] Registered new equipment slot: ", slot_name)

static func register_level_multiplier(expansion_id: String, multiplier: float) -> void:
    expansion_multipliers[expansion_id] = multiplier
    print("[EXPANSION] Registered dynamic stat scaling multiplier: ", multiplier)

static func get_slot_validity(slot_name: String, crownmark_id: String) -> bool:
    if CrownmarkDataManager.crownmarks.has(crownmark_id):
        var template = CrownmarkDataManager.crownmarks[crownmark_id]
        var original_slot = template.get("slot", "")
        if original_slot == slot_name:
            return true
            
    if custom_slots.has(slot_name):
        var rule = custom_slots[slot_name]["rules"]
        if rule.get("allowed_crownmarks", []).has(crownmark_id):
            return true
    return false
```

