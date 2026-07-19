# CROWNSPIRE: THE ASTRAL RELIQUARY DEVELOPMENT ROADMAP
**Sequential Milestones, Scene Setup, Script Pipelines, and Testing Checklists for a Solo Developer**
**Version:** 1.5.0 (Phase 6 Beast Trials System Integrated)  
**Target Quality Tier:** Premium AAA Mobile Strategy (*Whiteout Survival*, *Call of Dragons*, *Puzzles & Chaos*)

---

## 🚀 PHASE 6 COMPLETION REPORT: BEAST TRIALS & BOSS HUNT INTEGRATED
The comprehensive, multi-phase Beast Trials system has been successfully implemented, verified, and integrated into the Crystal Vault tab!

### 📁 Integrated Workspace Registries:
1. **React Web Beast Trials Module (`/src/components/CrystalVaultBeastTrialsTab.tsx`):**
   - **Trial Hunt Lobby:** Organizes targets across Wildling, Elite, World, and Alliance tiers with details on weak elements, base attack metrics, and custom modifiers.
   - **Difficulty Selector:** Features Easy, Normal, Heroic, and Mythic presets that automatically scale boss HP, enrage attack quotients, and shard payout multipliers.
   - **Board Modifiers:** Populates interactive, layer-aware overlays including *Frozen Seals* (requires melting adjacent layers), *Decay Spores* (triggers rot damage to party), and *Iron Chains* (locks matched triplets).
   - **Phase Shifts:** Real-time health-point observers trigger transitions dynamically (e.g., at 80% and 40% HP) causing dramatic dialog entries, visual shake effects, and increased damage thresholds.
   - **Active Challenger Roster:** Features individual health meters, shield thresholds, and customizable ultimate meters for Valen (Solar Fighter), Lyra (Frost Ranger), and Aethelgard (Stone Guardian).
   - **Milestone Trophy Road:** Tracks overall peak damage across sessions with unlockable chest items.
2. **Godot 4.4 Autoload Managers:**
   - `/crystal_vault/CVBeastTrialsManager.gd` (Centralized server schema backing trial beacons, scaling coefficients, and target databases).

---

## 🚀 PHASE 5 COMPLETION REPORT: COMPETITIVE ARENA SYSTEM INTEGRATED
The full competitive Arena siphoning system has been fully completed, verified, and integrated as a major separate tab of the Crystal Vault!

### 📁 Integrated Workspace Registries:
1. **React Web Arena Module (`/src/components/CrystalVaultArenaTab.tsx`):**
   - **Arena Lobby:** Displays active seasonal indicators, ELO ratings, leagues (Bronze to Legend), win streaks, total metrics, and season timers.
   - **Opponent Generation:** Algorithmically compiles selectable Easy, Medium, Hard rivals featuring custom guilds, playstyles, powers, and defensive configurations.
   - **Matchmaking Engine:** Performs expanding ELO searching simulations with radar loops and animated opponent card disclosures.
   - **PvP Match Altar Duel:** Re-integrates the layered coordinate puzzle board to target friendly team vs enemy team health bars, managing automatic rival turn countdown ticks, potion triggers, and customizable ultimate charges.
   - **Replay System:** Logs all click, match, damage, and ultimate operations in matches, feeding into a fully interactive Playback Cinema containing pause, speed adjustments, and backward/forward stepping.
   - **Spectator Stream Cinema:** Provides automated live streams of high-tier AI battles with cheer interaction meters (flower boosts, warhorn blasts) and spectators crowds logs.
   - **Milestone Trophy Road & Shop Exchange:** Compiles a progression path (milestones 1000 to 2000 MMR) with unlockable chests, paired with a shop bazaar to buy potion packs and decorative titles using Arena medals.
2. **Godot 4.4 Autoload Managers:**
   - `/crystal_vault/CVArenaManager.gd` (Central controller storing competitive ratings, medals, match lists, shop configs, season counters, and replay recorders).

---

## 🚀 PHASE 4 COMPLETION REPORT: CRYSTAL VAULT COMBAT ENGINE INTEGRATED
The full independent Crystal Vault Combat Engine has been built, tested, and fully integrated with the Mahjong Triple Match puzzle layout!

### 📁 Integrated Combat Workspace Registries:
1. **React Web Combat Arena Simulator (`/src/components/CrystalVaultCombatEngine.tsx`):**
   - **Hero Deck Manager:** Tracks 4 legendary guardians (Knight, Marksman, Priest, Dragon Master) with custom Health Points, Energy status, Shield blocks, and active skill timers.
   - **Enemy Squad Manager:** Spawns tactical wave groups matching world stages, featuring complex attack phases, status effect locks, and floating physical damage indices.
   - **Orchestration Matrix:** Listens directly for match-3 rune alignment signals from the main board and converts elemental combos into strategic battlefield actions:
     - *Sword Match*: Knight swings heavy physical blade damage on targets.
     - *Bow Match*: Ranger triggers high-penetration arrow volleys.
     - *Shield Match*: Knight casts robust physical shielding blocks.
     - *Crystal Match*: Dragon Master accumulates explosive elemental charge.
     - *Potion Match*: Priest restores health pools to wounded comrades.
     - *Dragon Match*: Ultimate skills are unleashed with spectacular custom VFX and custom particle blooms.
   - **Battle Outcome Links:** Direct callback pathways report arena outcomes directly to parent level containers.
2. **Godot 4.4 Autoload Managers & Engines:**
   - `/crystal_vault/CVCombatManager.gd` (Central orchestrator translating matched items into specific physical and magical strikes, managing turn queues, status multipliers, and battle triggers).
   - `/crystal_vault/CVHeroManager.gd` (Autoload storing health pools, shields, ultimates, passive state ticks, and energy ratios).
   - `/crystal_vault/CVEnemyManager.gd` (Procedural wave scaler adjusting wave numbers, scaling threat power, and status locks).

---

## 🚀 PHASE 3 COMPLETION REPORT: PERMANENT PROGRESSION SYSTEMS INTEGRATED
The core permanent progression architecture and user loops have been fully implemented, integrated, and verified!

### 📁 Integrated Workspace Registries:
1. **React Web Simulator (`/src/components/CrystalVaultTab.tsx`):**
   - **World Map Expedition:** Connected star-path scrollable level selector with 15 unique strategic layouts across 3 distinct elemental Chapters. Integrates custom lockout requirements, hover cards, and cost validation.
   - **Tactical Star Rating:** Generates 1 to 3 stars upon victory based on tactical precision (undos utilized during a run: 3 stars = 0-1, 2 stars = 2-3, 1 star = 4+).
   - **Endless Vault Lift:** Level-by-level infinite climbing system with procedural coordinate scaling (tiles count scales dynamically from 30 up to 90 runes based on the active floor).
   - **Daily Extreme Challenge:** Boss seal challenge of the day (72-90 massive tile stacks) with countdown clocks, manual testing reset triggers, seasonal win indicators, and heavy grand chests drop rates.
   - **Guardian Profile:** Complete inventory warehouse (Gold, Wood, Stone, Iron, Astral Shards, Starlight Orbs) and statistics charts tracking total wins, defeats, combo peaks, matches made, and rank titles ("Infinite Ascendant", etc.).
   - **Chest Synthesis Interface:** Interactive 3D chest box opening animations that trigger particle explosions, revealing standard and premium resources upon claiming.
2. **Godot 4.4 Autoload Managers & Engines:**
   - `/crystal_vault/CVSaveManager.gd` (Expanded saving/loading serialization storing completed levels, endless maximum records, daily challenge timers, resource inventory, and telemetry logs).
   - `/crystal_vault/PuzzleBoard.gd` (Added spanners for `start_expedition_level`, `start_endless_floor`, `start_daily_extreme` with dynamic tiles, undos counters, star metrics, and custom rewards generators).
   - `/crystal_vault/crystal_vault_layouts.json` (Structured coordinate assets).

### 📈 Progression Alignment:
- **Milestone 1 (2.5D Grid Foundation):** **[COMPLETED & VERIFIED]**
- **Milestone 2 (Altar Tray & Sorting Engine):** **[COMPLETED & VERIFIED]**
- **Milestone 4 (Tactical Power-Ups & Rewind Engine):** **[COMPLETED & VERIFIED]**
- **Milestone 6 (Commerce Bazaars & Save States):** **[COMPLETED & VERIFIED]**

---

## 🚀 PHASE 2 COMPLETION REPORT: CORE PUZZLE ENGINE INTEGRATED
The core **Mahjong Triple Match** puzzle engine was successfully implemented and dual-compiled. It remains fully operational in both the **Godot 4.4 Repository Code** and the **Playable React Client Preview**.

---

## 🗺️ EXECUTIVE SUMMARY & PRODUCTION STRATEGY

Building a full-scale puzzle RPG system inside a 4X mobile strategy game is a major undertaking. For a solo developer, success lies in **strict progression and isolated testing**. 

By building the core grid mechanics first, testing them thoroughly in 2D, and then progressively layering on the 3D environments, RPG battle layers, liveops campaigns, and backend integrations, you avoid compiling bugs and maintain a fully playable build throughout the cycle.

```
                  [ SEQUENTIAL PRODUCTION ROADMAP ]

  +-----------------------+      +-----------------------+
  |      MILESTONE 1      | ---> |      MILESTONE 2      | (Core Gameplay)
  | - 2.5D Layer Grid     |      | - Altar Tray Engine   |
  | - Locked/Active State |      | - Sorting & Matching  |
  +-----------------------+      +-----------------------+
                                             |
                                             v
  +-----------------------+      +-----------------------+
  |      MILESTONE 4      | <--- |      MILESTONE 3      | (RPG Integration)
  | - Tactical Power-ups  |      | - Hero Deck & Mana    |
  | - Undo/Shuffle/Hints  |      | - Special Grid Tiles  |
  +-----------------------+      +-----------------------+
              |
              v
  +-----------------------+      +-----------------------+
  |      MILESTONE 5      | ---> |      MILESTONE 6      | (PvE & LiveOps)
  | - Boss Grid Hazards   |      | - Commerce Bazaars    |
  | - 3D Viewport Arenas  |      | - Save States & Gacha |
  +-----------------------+      +-----------------------+
```

---

## 🏆 MILESTONE 1: THE 2.5D GRID FOUNDATION

### 1. Purpose
Establish the core coordinate-based 2.5D layout engine. This milestone ensures that tiles spawn correctly according to 3D skeletons, render layers are calculated accurately, and overlap collision checks determine locked/active states instantly.

### 2. Scene Tree & Architecture
*   **Scene:** `res://src/components/tile/RelicTile.tscn` (Area2D)
    *   *Structure:*
        ```
        RelicTile (Area2D)
        ├── TileTexture (Sprite2D)
        ├── GoldBorder (Sprite2D)
        ├── CollisionShape2D (CollisionShape2D)
        └── AnimationPlayer (AnimationPlayer)
        ```
*   **Scene:** `res://src/components/board_frame/GridBoard.tscn` (Node2D)
    *   *Structure:*
        ```
        GridBoard (Node2D)
        ├── BoardFrame3D (NinePatchRect)
        └── TilesParent (Node2D)
        ```

### 3. Scripts
*   `res://src/components/tile/relic_tile.gd` (Manages individual coordinates and locked opacity overlays).
*   `res://src/components/board_frame/grid_board.gd` (Handles seed configurations, parses level layout coordinates, and triggers update checks for all overlapping tiles).

### 4. Assets & Database
*   **Assets:** Base tile backing texture, gold beveled border texture, test relic element icons (Ruby, Sapphire, Emerald).
*   **JSON Config:** `res://data/levels/test_pyramid_layout.json` (Coordinates representing a standard 3-layer pyramid skeleton).

### 5. Recommended Implementation Order
1.  Create `relic_tile.gd` and define coordinates variables: `grid_x`, `grid_y`, `grid_z`.
2.  Implement the constant-time overlap formula inside `grid_board.gd` using a coordinate dictionary `grid_map[Vector3i(x, y, z)]`.
3.  Implement state styling: darken locked tiles (`#4E5A73`) and keep active tiles bright.
4.  Write a random board generator in `grid_board.gd` that strictly populates tiles in multiples of three.

### 6. Verification & Automated Tests
*   **Unit Test:** Spawn a 2-layer grid where Tile A sits directly on top of Tile B. Verify that Tile B’s click handler is disabled, and clicking Tile A successfully triggers its fly animation.
*   **Performance Check:** Verify that calculating overlaps via `grid_map.has()` takes $<1\text{ms}$ on a 150-tile board.

### 7. Core Metrics
*   **Estimated Complexity:** Medium-Low  
*   **Dependencies:** None  

---

## 📥 MILESTONE 2: THE ALTAR TRAY & SORTING ENGINE

### 1. Purpose
Build the primary player-management slot queue. This milestone handles collecting playable tiles, sorting identical relics adjacent to each other in real-time, matching groups of three, and triggering smooth fly-down tween transitions.

### 2. Scene Tree & Architecture
*   **Scene:** `res://src/components/tray/AltarTray.tscn` (MarginContainer)
    *   *Structure:*
        ```
        AltarTray (MarginContainer)
        └── AltarSlots (HBoxContainer)
            ├── Slot1 (Control) ... ├── Slot7 (Control)
        ```

### 3. Scripts
*   `res://src/components/tray/altar_tray.gd` (Manages the active collected array, executes the sorting comparator, checks for matching trios, and triggers tray overflow failure screens).

### 4. Assets & Database
*   **Assets:** Tray background banner texture, empty card slot frames.
*   **JSON Config:** None (handled in memory).

### 5. Recommended Implementation Order
1.  Construct the 7-slot `AltarTray.tscn` using a horizontal layout.
2.  Write the click-capture interface linking tiles on the board to `SignalsBus.on_tile_selected`.
3.  Implement the sorting algorithm in `altar_tray.gd` (sorts tiles by `relic_id` while maintaining slot limits).
4.  Write the match-three scanner: scans adjacent slots, deletes identical trios, compacts the remaining array, and frees empty spaces.
5.  Hook up the overflow trigger when 7 slots are occupied and no match can be completed.

### 6. Verification & Automated Tests
*   **Unit Test:** Feed a non-consecutive array of tiles `[A, B, A, C, A]` into the tray. Verify that the tray sorts them into `[A, A, A, B, C]`, instantly shatters the three `A` tiles, and leaves the tray holding `[B, C]` in slots 1 and 2.
*   **Transition Sweep:** Verify that no tile overlaps or jumps paths during sorting, using smooth curve Tweens.

### 7. Core Metrics
*   **Estimated Complexity:** Medium  
*   **Dependencies:** Milestone 1, `SignalsBus.gd` Autoload.

---

## ⚔️ MILESTONE 3: HERO INTEGATION & SPECIAL TILES

### 1. Purpose
Integrate heroes directly into the puzzle grid. This milestone hooks up element-to-mana channels, displays active hero health bars, and spawns special grid assets like Elemental Prisms (wild-cards) and Celestial Bombs.

### 2. Scene Tree & Architecture
*   **Scene:** `res://src/components/hero_deck/HeroSquadPanel.tscn` (MarginContainer)
    *   *Structure:*
        ```
        HeroSquadPanel (MarginContainer)
        └── ActiveCards (HBoxContainer)
            ├── HeroCard1 (Control) ... ├── HeroCard3 (Control)
                ├── Portrait (TextureRect)
                ├── HPBar (ProgressBar)
                └── ManaBar (ProgressBar)
        ```

### 3. Scripts
*   `res://src/components/hero_deck/hero_card_ui.gd` (Alters portrait scales, updates health/mana progress bars, and triggers glowing ultimate ready borders).
*   `res://src/components/tile/prism_tile.gd` (Inherits from `relic_tile.gd`, adapting its ID to match tray priorities).
*   `res://src/components/tile/bomb_tile.gd` (Triggers explosion events that shatter a $3\times3$ grid around it).

### 4. Assets & Database
*   **Assets:** Hero class portraits, glowing portrait borders, liquid progress bar overlays, special tile icons (Prism, Bomb, Sandglass).
*   **JSON Config:** Extends `res://heroes.json` with puzzle metrics (mana requirements, skill definitions).

### 5. Recommended Implementation Order
1.  Integrate the `HeroSquadPanel.tscn` interface into the bottom margin of the screen.
2.  Update `CombatManager.gd` to listen to `SignalsBus.on_match_completed`, routing elemental matches to charge the corresponding hero's mana pool (e.g., Fire matches charge Ignis).
3.  Write the Ultimate Ready interface triggers (glowing halo overlays and portrait click handlers).
4.  Write the Prism and Bomb tile class templates, adding them to the board's dynamic spawn pool.

### 6. Verification & Automated Tests
*   **Unit Test:** Trigger a Fire match-three. Verify that the Fire Hero portrait charges by $+30\%$ mana, and reaching $100\%$ mana successfully triggers their ultimate ready state.
*   **Special Tile Test:** Detonate a Celestial Bomb. Verify that all 9 adjacent coordinates are cleared from the grid instantly, and underlying tiles on lower layers are updated to active.

### 7. Core Metrics
*   **Estimated Complexity:** Hard  
*   **Dependencies:** Milestone 1 & 2.

---

## ⚡ MILESTONE 4: TACTICAL POWER-UPS & REWIND ENGINE

### 1. Purpose
Implement the player utility tools (Undo, Shuffle, Hint, Altar Expansion) to manage difficulty spikes, prevent deadlocks, and establish monetizable spending loops.

### 2. Scene Tree & Architecture
*   **Scene:** `res://src/components/board_frame/BoosterToolbar.tscn` (HBoxContainer)
    *   *Structure:*
        ```
        BoosterToolbar (HBoxContainer)
        ├── UndoBtn (Button)
        ├── ShuffleBtn (Button)
        ├── HintBtn (Button)
        └── ExpandBtn (Button)
        ```

### 3. Scripts
*   `res://src/components/board_frame/booster_toolbar.gd` (Tracks currency balances and maps clicks to actions).
*   `res://src/autoload/PuzzleSolver.gd` (Scans active grid layers to identify valid matching trios for the Hint tool).

### 4. Assets & Database
*   **Assets:** Tactile buttons for Undo (curved arrow), Shuffle (crossed swords), and Hint (glowing eye).
*   **JSON Config:** None (uses values from `items.json`).

### 5. Recommended Implementation Order
1.  Add `BoosterToolbar.tscn` to the side margins of the screen.
2.  Write the **Undo** rewind logic: pops the last tile from the tray, returns it to its exact coordinate $(x,y,z)$, and recalculates locks on surrounding coordinates.
3.  Write the **Shuffle** algorithm: maps all remaining grid coordinates, shuffles their relic IDs, and ensures at least one matching trio is placed on the top layer.
4.  Write the **Hint** search logic: scans the topmost layers and highlights a valid match-three with a glowing halo outline.

### 6. Verification & Automated Tests
*   **Rewind Test:** Click three tiles, send them to the tray, and click **Undo**. Verify that the last tile flies back to its original coordinate, and its locked status is updated correctly.
*   **Shuffle Verification:** Verify that shuffling a grid with 6 remaining tiles always places a solvable match-three on the playable layers to prevent deadlocks.

### 7. Core Metrics
*   **Estimated Complexity:** Medium-Hard  
*   **Dependencies:** Milestone 1 & 2.

---

## 🐉 MILESTONE 5: THE BEAST TRIAL & OBSTACLE ENGINES

### 1. Purpose
Implement boss battles and active grid hazards. This milestone integrates the turn-based boss rage counter, spawns physical grid hazards (Granite Cages and Frozen blocks), and renders the 3D cavern backgrounds in a SubViewport.

### 2. Scene Tree & Architecture
*   **Scene:** `res://src/scenes/BeastTrialsRaid.tscn` (Node2D)
    *   *Structure:*
        ```
        BeastTrialsRaid (Node2D)
        ├── SubViewportContainer (3D environment Viewport)
        │   └── VolcanicCavern (3D Cavern Arena)
        │       └── AnimatedBoss (CharacterBody3D)
        └── PlayfieldUI (2D Canvas Layer Overlay)
        ```

### 3. Scripts
*   `res://src/scenes/beast_trials_raid.gd` (Orchestrates battle states, manages the boss action rage counter, and triggers phase transition animations).
*   `res://src/components/bosses/animated_boss.gd` (Handles 3D meshes, plays animations, and manages particle emitters for special attacks).

### 4. Assets & Database
*   **Assets:** 3D boss meshes (Goliath, Fenrir), 3D environment cavern maps, particle effects, hazard overlays.
*   **JSON Config:** Extends `res://monsters.json` to define boss actions and health metrics.

### 5. Recommended Implementation Order
1.  Configure the `BeastTrialsRaid.tscn` node tree with a 3D SubViewport and a 2D UI overlay.
2.  Connect the **Rage Counter**: every tile selection decrements the countdown. When it reaches 0, trigger the boss's attack.
3.  Write the **Granite Cage** hazard controller: wraps 3 random active tiles in unclickable stone cages.
4.  Write the phase transition logic: when boss HP falls below specific thresholds, play transitions, reshuffle the grid, and apply new rules (e.g., locking Altar Tray slots).

### 6. Verification & Automated Tests
*   **Combat Loop Test:** Select 5 tiles. Verify that the boss rage counter decrements from 5 to 0, triggers an attack that deals damage to the hero squad, and resets to 5.
*   **Phase Shift Test:** Reduce boss HP below $50\%$. Verify that the board reshuffles automatically and locks slot 7 in the tray.

### 7. Core Metrics
*   **Estimated Complexity:** Very Hard  
*   **Dependencies:** All prior Milestones.

---

## 💎 MILESTONE 6: COMMERCE BAZAARS & GAME SAVE STATES

### 1. Purpose
Connect the puzzle sub-economy to the wider game. This milestone handles writing player states, securing progress with encrypted saves, and implementing the Portal Bazaar (Puzzle Shop) and Relic Arena Store (PvP Shop).

### 2. Scene Tree & Architecture
*   **Scene:** `res://src/scenes/PortalBazaar.tscn` (Control)
    *   *Structure:*
        ```
        PortalBazaar (Control)
        └── ShopGrid (GridContainer)
            ├── ShopItemSlot1 (Control) ...
        ```

### 3. Scripts
*   `res://src/autoload/SaveManager.gd` (Handles Zlib compression and secure disk serialization).
*   `res://src/scenes/portal_bazaar.gd` (Manages daily store inventories, buy locks, and Aether Shard transactions).

### 4. Assets & Database
*   **Assets:** Shop backdrops, item slots, purchase locks, coin and shard icons.
*   **JSON Config:** `res://data/economy/shop_inventories.json` (Price scales and item limits).

### 5. Recommended Implementation Order
1.  Build the encrypted, compressed save interface inside `SaveManager.gd`.
2.  Integrate the `PortalBazaar.tscn` grid interface.
3.  Implement buy-locks: players can purchase items only if they possess sufficient Aether Shards.
4.  Write the daily shop auto-reset timer (triggers refreshes every 24 hours).
5.  Link gacha summons to consume Relic Keys, executing weighted probability checks from the drop tables.

### 6. Verification & Automated Tests
*   **Save Integrity Test:** Earn 500 Aether Shards, close the game, and restart. Verify that balances are loaded correctly, and manually editing the data file throws an integrity warning.
*   **Weighted Drop Check:** Run an automated script to simulate 10,000 gacha summons. Verify that drop percentages match our specification tables (e.g., Golden Key yields exactly $\sim1.5\%$ Legendary skins).

### 7. Core Metrics
*   **Estimated Complexity:** Medium  
*   **Dependencies:** Milestone 2, `AstralReliquary.gd` Autoload.

---

## 🛠️ SOLO-DEVELOPER EFFICIENCY TIPS (THE AAA FEEL)

1.  **Don't write complex shaders from scratch:** Use Godot 4.4’s built-in VisualShader editor to build beautiful, glowing rune effects, lava veins, and ice trails quickly.
2.  **Use Tween templates for standard actions:** Write a global, reusable transition library for animations (e.g., standard button bounces, tile slides, card flips) to ensure a polished feel across all screens.
3.  **Optimize the Tile Mesh:** Set tiles as simple `Sprite2D` nodes with a `CollisionShape2D` instead of heavy 3D elements. This keeps draw calls low and maintains smooth performance, even on budget mobile screens.
4.  **Embrace automated testing:** Write a simple script that plays the game board randomly. Let it run in the background for a few hours to catch any edge-case memory leaks or sorting lockups early.

---
*End of Development Roadmap.*  
*Review these milestones. Once approved, you can begin constructing the core scenes in your Godot workspace.*
