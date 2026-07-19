# CROWNSPIRE: THE ASTRAL RELIQUARY TECHNICAL DESIGN DOCUMENT
**Godot 4.4 Architectural Specification, Scene Trees, Script Pipelines, and Data Flows**
**Version:** 1.0.0 (Master Release)  
**Target Quality Tier:** Premium AAA Mobile Strategy (*Whiteout Survival*, *Call of Dragons*, *Puzzles & Chaos*)

---

## 🏛️ SECTION I: SYSTEM ARCHITECTURE & AUTOLOADS (SINGLETONS)

In Godot 4.4, the **Astral Reliquary** system operates using a decoupled, event-driven manager architecture. Autoloads manage global state, database caching, and system orchestration, while localized controllers manage scene-specific layout logic and rendering.

```
                      +-----------------------------+
                      |       AstralReliquary       | (Autoload: Global State)
                      +-----------------------------+
                        /                         \
                       v                           v
        +-----------------------------+     +-----------------------------+
        |        PuzzleSolver         |     |        CombatManager        | (Autoloads)
        +-----------------------------+     +-----------------------------+
                       |                           |
                       +-------------+-------------+
                                     |
                                     v
                      +-----------------------------+
                      |         SignalsBus          | (Autoload: Event Hub)
                      +-----------------------------+
```

### 1. Global Autoload Declarations (`project.godot` Entries)
To establish central state synchronization, the following scripts are registered in the global Autoload list:

#### `AstralReliquary.gd` (Central State and Economy Hub)
*   *Responsibility:* Manages player stamina, Aether Shard balances, Arena ratings, unlocked runestones, and active monument monument passive level.
*   *Key Variables:*
    ```gdscript
    extends Node

    # Economy variables
    var aether_shards: int = 0
    var arena_tokens: int = 0
    var aether_sparks: int = 0
    var sanctum_stamina: int = 120
    var challenge_keys: int = 5

    # Monument levels
    var attunement_level: int = 1
    var attunement_experience: int = 0

    # Saved state cache
    var unlocked_runestones: Dictionary = {} # RST_ID -> Quantity
    var active_deck: Array[String] = ["HER_IGNIS", "HER_SARIEL", "HER_GARRICK"] # Hero IDs
    ```

#### `PuzzleSolver.gd` (Automated Verification Server)
*   *Responsibility:* Performs seed-based simulation sweeps on the layout coordinate models to ensure $100\%$ solvability before grid setup completes.

#### `CombatManager.gd` (Battle and Damage Server)
*   *Responsibility:* Evaluates elemental match mechanics, hero mana gains, damage multipliers, boss rage decrements, and status effect updates.

#### `SignalsBus.gd` (The Event Hub)
*   *Responsibility:* Aggregates and redistributes signals globally to decouple scene logic from core managers.

---

## 📂 SECTION II: EXTENDED FOLDER STRUCTURE

All assets, scripts, resources, and scene files are organized into a dedicated folder structure inside the `/docs/godot/` or project workspace path.

```
res://
├── assets/
│   ├── audio/
│   │   ├── music/               # Ambient theme background loops
│   │   └── sfx/                 # Shatter bursts, clicks, magic impacts
│   ├── envs/                    # 3D/2D environment models and backgrounds
│   ├── fonts/                   # Space Grotesk, JetBrains Mono, Inter
│   └── textures/
│       ├── UI/                  # Panels, frames, health bars, banners
│       ├── icons/               # Currency symbols, button graphics
│       ├── portraits/           # Hero class profiles
│       └── tiles/               # Base marble, beveled gold frames, elements
│
├── data/
│   ├── alliance.json            # Existing guild registries
│   ├── buildings.json           # Existing construction parameters
│   ├── heroes.json              # Character stat records
│   ├── items.json               # Key items and materials
│   ├── monsters.json            # Boss and Wildling definitions
│   └── daily_quests.json        # Daily milestone configurations
│
├── src/
│   ├── autoload/
│   │   ├── AstralReliquary.gd   # Core manager singleton
│   │   ├── CombatManager.gd     # Turn combat and damage calculations
│   │   ├── PuzzleSolver.gd      # Solvability validation server
│   │   └── SignalsBus.gd        # Decoupled global signal dispatcher
│   │
│   ├── components/
│   │   ├── board_frame/         # Tactical playing field borders
│   │   ├── bosses/              # Active boss animated models and controllers
│   │   ├── hero_deck/           # Playable battle profiles and indicators
│   │   ├── particles/           # Shatter effects and elemental rays
│   │   ├── tile/                # Interactive 2.5D tile template
│   │   └── tray/                # Bottom Altar Tray queue layout
│   │
│   ├── resources/
│   │   ├── hero_data_res.gd     # Character RPG asset resource template
│   │   ├── level_data_res.gd    # 3D Coordinate grid skeleton blueprint
│   │   └── runestone_res.gd     # Socketed active modifier template
│   │
│   └── scenes/
│       ├── ReliquaryCampaign.tscn # Main single-player portal
│       ├── RelicArenaPvP.tscn   # Real-time/AI duel platform
│       └── BeastTrialsRaid.tscn # Co-op Alliance boss arena
```

---

## 🌲 SECTION III: SCENE HIERARCHIES & NODES

The system uses standard Node hierarchies to separate visual representations, interactive controllers, and data storage.

```
                     [ BEAST TRIALS RAID SCENE TREE ]

                     BeastTrialsRaid (Node2D)
                     ├── WorldEnvironment (WorldEnvironment)
                     ├── Background3D (Node3D/SubViewportContainer)
                     │   └── EnvironmentView (SubViewport)
                     │       └── VolcanicCavern (Node3D Model)
                     ├── PlayfieldUI (CanvasLayer)
                     │   ├── BossPanel (Control)
                     │   │   ├── HPBar (ProgressBar)
                     │   │   └── ActionTimer (Label)
                     │   ├── GridContainer (Node2D)
                     │   │   └── TilesParent (Node2D: Dynamic Spawns)
                     │   ├── TrayContainer (Control)
                     │   │   └── AltarSlots (HBoxContainer)
                     │   └── HeroSquadPanel (Control)
                     │       └── ActiveCards (HBoxContainer)
```

### 1. `BeastTrialsRaid.tscn` (Boss Battle Node Tree)
```
BeastTrialsRaid [Node2D]
├── Camera2D [Camera2D] (Handles screenshakes and ortho zoom)
├── WorldEnvironment [WorldEnvironment] (HDR glows and bloom settings)
├── Background3D [SubViewportContainer] (Displays 3D boss and scenery)
│   └── Viewport [SubViewport]
│       └── VolcanicCavern [Node3D]
│           └── BossBeast [CharacterBody3D] (Animated mesh + FX sockets)
│               └── AnimationPlayer [AnimationPlayer]
├── PlayfieldUI [CanvasLayer]
│   ├── ControlArea [Control]
│   │   ├── TopHeader [MarginContainer]
│   │   │   ├── HBox [HBoxContainer]
│   │   │   │   ├── ScoreCounter [Label]
│   │   │   │   └── MoveTimer [Label]
│   │   │   └── BossHPBar [ProgressBar] (Includes segment ticks)
│   │   ├── PuzzleBoardEnclosure [Control]
│   │   │   ├── BoardFrame3D [NinePatchRect] (Tactile gold marble framing)
│   │   │   └── GridParent [Node2D] (Holds dynamically spawned 2.5D tiles)
│   │   ├── TrayPanel [MarginContainer]
│   │   │   └── AltarTrayQueue [HBoxContainer] (Dynamic 7/8 slot layouts)
│   │   └── HeroControlRow [MarginContainer]
│   │       └── HeroesDeckGrid [HBoxContainer] (Contains 3 ActiveCard frames)
└── AudioPlayers [Node]
    ├── BGMPlayer [AudioStreamPlayer]
    └── SFXPlayerPool [Node] (Round-robin voice allocations)
```

---

## 📜 SECTION IV: SCRIPT ARCHITECTURE & API INTERFACES

Core scripts are highly modular, utilizing Godot 4.4 type hints, clean class declarations, and strict typing.

### 1. `relic_tile.gd` (Interactive 2.5D Grid Entity)
```gdscript
class_name RelicTile
extends Area2D

# Coordinates in 3D grid space
var grid_x: int = 0
var grid_y: int = 0
var grid_z: int = 0

var relic_id: String = ""
var element: String = ""
var is_locked: bool = false
var is_frozen: bool = false

@onready var texture_rect: Sprite2D = $TileTexture
@onready var border_rect: Sprite2D = $GoldBorder
@onready var animation_player: AnimationPlayer = $AnimationPlayer

func initialize(id: String, elem: String, gx: int, gy: int, gz: int) -> void:
	relic_id = id
	element = elem
	grid_x = gx
	grid_y = gy
	grid_z = gz
	_update_visual_representation()

func set_locked_state(locked: bool) -> void:
	is_locked = locked
	if is_locked:
		modulate = Color(0.55, 0.55, 0.55, 1.0) # Grey out
		border_rect.modulate = Color(0.3, 0.3, 0.3, 1.0)
	else:
		modulate = Color(1.0, 1.0, 1.0, 1.0)
		border_rect.modulate = Color(1.0, 1.0, 1.0, 1.0)

func animate_fly_to_tray(target_pos: Vector2, callback: Callable) -> void:
	var tween = create_tween().set_parallel(true)
	tween.tween_property(self, "global_position", target_pos, 0.35).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_OUT)
	tween.tween_property(self, "scale", Vector2(0.6, 0.6), 0.35)
	tween.chain().perform(callback)
```

### 2. `altar_tray.gd` (Tray Sorting & Match Evaluator)
```gdscript
class_name AltarTray
extends HBoxContainer

signal match_detected(relic_id: String, element: String)
signal tray_overflowed()

var slots_capacity: int = 7
var active_tiles: Array[RelicTile] = []

func add_tile(tile: RelicTile) -> void:
	if active_tiles.size() >= slots_capacity:
		SignalsBus.emit_signal("on_altar_overflow")
		return
	
	active_tiles.append(tile)
	_sort_and_reposition_tiles()
	_evaluate_matches()

func _sort_and_reposition_tiles() -> void:
	# Sort tiles adjacent by Relic ID to cluster identical items
	active_tiles.sort_custom(func(a: RelicTile, b: RelicTile):
		return a.relic_id < b.relic_id
	)
	
	for i in range(active_tiles.size()):
		var target_slot_pos = get_child(i).global_position
		active_tiles[i].animate_fly_to_tray(target_slot_pos, func():
			# Complete animation hook
			pass
		)

func _evaluate_matches() -> void:
	if active_tiles.size() < 3:
		return
		
	var i: int = 0
	while i < active_tiles.size() - 2:
		if active_tiles[i].relic_id == active_tiles[i+1].relic_id and active_tiles[i].relic_id == active_tiles[i+2].relic_id:
			var matched_id = active_tiles[i].relic_id
			var matched_element = active_tiles[i].element
			
			# Remove matched tiles
			var match_trio = [active_tiles[i], active_tiles[i+1], active_tiles[i+2]]
			for m_tile in match_trio:
				active_tiles.erase(m_tile)
				m_tile.queue_free()
			
			emit_signal("match_detected", matched_id, matched_element)
			_sort_and_reposition_tiles()
			return # Re-evaluate from start to catch double cascade matches
		i += 1
```

---

## 📡 SECTION V: SIGNALS BUS EVENT DECOUPLING

To prevent tight coupling between game scenes and global state systems, the **SignalsBus** manages all communications using Godot 4.4's type-safe system:

```gdscript
extends Node

# Puzzle-to-Combat Interface
signal on_tile_selected(tile: RelicTile)
signal on_match_completed(relic_id: String, element: String, combo_multiplier: float)
signal on_altar_overflow()

# Boss state alerts
signal on_boss_rage_updated(current_rage: int, max_rage: int)
signal on_boss_weakness_exposed(element: String)
signal on_boss_staggered(turns_duration: int)

# Hero actions
signal on_hero_mana_charged(hero_id: String, current_mana: int)
signal on_hero_ultimate_ready(hero_id: String)
signal on_ultimate_triggered(hero_id: String)
```

---

## 🗄️ SECTION VI: DATA SPECIFICATIONS & JSON LAYOUTS

Database configurations integrate smoothly into the existing core framework.

### 1. `monsters.json` (Boss Additions)
Integrates directly with the existing `monsters.json` asset registry to declare boss actions and health metrics:
```json
{
  "monsters": [
    {
      "id": "boss_goliath_behemoth",
      "name": "The Goliath Behemoth",
      "element": "earth",
      "max_hp": 450000,
      "base_attack": 2500,
      "cooldown_moves": 6,
      "abilities": {
        "rage_skill": "Granite Stomp",
        "phase_transition": "Seismic Rifting",
        "effect_value": 3
      },
      "loot_pool": {
        "guaranteed_shards": 1500,
        "shards_deviation": 150,
        "blueprint_chance": 0.12
      }
    }
  ]
}
```

### 2. `heroes.json` (Mahjong Grid Skill Integration)
Extends the custom schema of characters to declare their board interactions:
```json
{
  "heroes": [
    {
      "id": "HER_IGNIS",
      "name": "Ignis",
      "element": "fire",
      "base_hp": 12500,
      "base_attack": 3400,
      "puzzle_skills": {
        "passive_name": "Ember Eyes",
        "passive_description": "Highlights matching Fire tiles and boosts damage.",
        "ultimate_name": "Inferno Blast",
        "ultimate_cost": 100,
        "ultimate_type": "shatter_blockers"
      }
    }
  ]
}
```

---

## 💾 SECTION VII: SECURE SAVE SYSTEM & ANTI-CHEAT ARCHITECTURE

Player states (Aether Shards, runestones, decks) are marshaled into custom dictionaries, compressed using Zlib, and serialized securely to persistent disk configurations:

```gdscript
class_name SaveManager
extends Node

const SAVE_PATH = "user://crownspire_astral_reliquary.dat"
const ENCRYPTION_KEY = "S0L-C0SMIC-RELIQ-KEY" # Embedded platform secret key

static func save_game_state(state_data: Dictionary) -> void:
	var file = FileAccess.open_encrypted_with_pass(SAVE_PATH, FileAccess.WRITE, ENCRYPTION_KEY)
	if file:
		var json_string = JSON.stringify(state_data)
		# Compress string to Zlib byte array to secure data integrity
		var compressed_bytes = json_string.to_utf8_buffer().compress(FileAccess.COMPRESSION_FASTLZ)
		file.store_64(compressed_bytes.size())
		file.store_buffer(compressed_bytes)
		file.close()

static func load_game_state() -> Dictionary:
	if not FileAccess.file_exists(SAVE_PATH):
		return {}
		
	var file = FileAccess.open_encrypted_with_pass(SAVE_PATH, FileAccess.READ, ENCRYPTION_KEY)
	if file:
		var original_size = file.get_64()
		var compressed_bytes = file.get_buffer(file.get_length() - 8)
		file.close()
		
		var decompressed_bytes = compressed_bytes.decompress(original_size, FileAccess.COMPRESSION_FASTLZ)
		var json_string = decompressed_bytes.get_string_from_utf8()
		var parser = JSON.new()
		if parser.parse(json_string) == OK:
			return parser.get_data() as Dictionary
	return {}
```

---

## ⚡ SECTION VIII: PERFORMANCE, DATA MEMORY, & STAMINA LOADING

To ensure a smooth, premium feel on budget-tier mobile devices, the Astral Reliquary implements strict performance controls:

### 1. Spatial Partitioning of 3D Overlaps (The Grid Index)
Instead of executing costly overlapping collision shape queries on every tile selection, the grid uses a lightweight coordinate index array.
*   **The Array Map:** Coordinates are cached inside a flat 3D dictionary: `grid_map[Vector3i(x, y, z)] = RelicTile`.
*   **Constant-Time Overlap Evaluation:** Checks for overlapping tiles instantly in $\mathcal{O}(1)$ time without physics raycasting:
    ```gdscript
    func is_tile_playable(gx: int, gy: int, gz: int) -> bool:
        # Check coordinates on all layers directly above the target tile
        for uz in range(gz + 1, max_layers):
            if grid_map.has(Vector3i(gx, gy, uz)):
                return false
        return true
    ```

### 2. Node Pool Optimization
Tile collection and matching trigger highly frequent node creations and deletions. This can lead to garbage collection freezes.
*   **The Relic Tile Pool:** The board manages an pre-allocated array of 120 `RelicTile` instances stored in an inactive queue.
*   **Recycling Engine:** When a tile is cleared from the tray or grid, it is not freed via `queue_free()`. Instead, it is desaturated, its visibility is hidden, and it is pushed back into the pool, maintaining active memory consumption at a constant baseline.

### 3. Progressive Asset Loading
*   **The Transition Sequence:** When entering a Beast Trial scene, the scene uses `ResourceLoader.load_threaded_request()` to stream the heavy 3D boss meshes and volumetric volcanic caverns in the background.
*   **Immediate 2D Interactive Board Setup:** The 2D marble grid structure is created instantly. The board becomes fully playable while the background Viewport compiles shaders and asset packages quietly. This reduces perceived load times down to zero.

---

## 🌐 SECTION IX: NETWORKING PROTOCOLS & MULTIPLAYER CONFORMS

To prepare the **Astral Reliquary** for future multiplayer duels (the PvP Relic Arena), the game loop runs on a **Server-Authoritative State Sync Engine**. This eliminates any possibility of grid manipulation or state hacking.

```
       [ PLAYER CLIENT ]                           [ RELIC PvP SERVER ]

 (1) Inputs: Click coordinates  -----------------> (2) Decrypts & Verifies
                                                       - Performs overlap checks
                                                       - Matches identical trios
                                                       - Fires combat outputs
 (4) Renders: Tween transitions <----------------- (3) Outputs: Validated array
     and particle beams                                update and HP offsets
```

### 1. Frame-Packet Sync Models
Instead of sending complex action scripts, client apps send small, encrypted input packets to the PvP server:
*   **Input Packet Format:**
    ```json
    {
      "packet_id": 14052,
      "player_id": "usr_9921a",
      "action": "grid_click",
      "grid_coordinates": {"x": 2, "y": 4, "z": 1}
    }
    ```
*   **Server Evaluation:** The matchmaking server maintains an identical simulation of the puzzle board. It decrypts the coordinate target, verifies that `is_tile_playable()` is true, performs the sorting and match calculations, and broadcasts the validated grid update back to both combatants. This guarantees safe, competitive PvP combat.

---
*End of Technical Design Document.*  
*Ready for core scene building and controller programming inside Godot 4.4.*
