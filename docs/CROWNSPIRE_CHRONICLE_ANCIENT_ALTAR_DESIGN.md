# Crownspire: Signature System Design Document
## The Astral Reliquary (Mahjong Triple-Match Engine)
**Lead Designer**: Senior Systems & Gameplay Designer
**Lead Engineer**: Principal Gameplay Engineer (Godot 4.4 Specialists)
**Status**: Revised Proposal - Pending Production Approval

---

## 1. Naming Options for the Portal Building/System
We seek a name that implies ancient, divine magic, high stakes, and a connection to Crownspire’s core lore. Here are the top five candidates:

1. **The Astral Reliquary** (Highly Recommended)
   * *Why it works*: Implies a sacred vault of ancient power. Combining "Astral" (celestial, cosmic magic) and "Reliquary" (a container for sacred relics) fits the mechanic of matching three magical relics to shatter them into pure raw energy.
2. **The Crystalline Nexus**
   * *Why it works*: Evokes imagery of massive energy crystals, leyline structures, and connecting channels. Directly links to the crystals that fuel the puzzle matchboard.
3. **The Oracle's Sanctum**
   * *Why it works*: Gives the building a mystical, narrative-driven focal point. The Oracle guides players through matching relics to uncover ancient prophecies.
4. **The Celestial Monolith**
   * *Why it works*: Sounds grand, imposing, and ancient. It stands as a focal point in the kingdom where ancient runes are synthesized.
5. **The Aether Altar**
   * *Why it works*: Simple and direct, but slightly less grand. Emphasizes the element of "Aether" as a magical catalyst.

---

## 2. Recommended Final Name
### **The Astral Reliquary**
* **Thematic Centerpiece**: Located in the player's capital city, the **Astral Reliquary** is a towering, levitating monument constructed from white marble, celestial bronze, and glowing crystal shards. It acts as a portal into the memories of the old world.
* **Thematic Tray Name**: **The Relic Altar** (The 7-slot holding tray at the bottom of the triple-match board where tiles are placed before matching).
* **Thematic Matching Action**: When three matching relics are placed on the **Relic Altar**, they do not simply disappear; they **Shatter into Aether Sparks**, fueling the central power gauge of your heroes or dealing elemental damage to the target.

---

## 3. Full Gameplay Loop & Strategic Integration
The Astral Reliquary is designed to weave seamlessly into Crownspire's 4X ecosystem, driving engagement, monetization, and hero development:

```
[4X Empire Management] ---> [Earn Relic Keys & Sanctum Stamina]
         ^                                    |
         |                                    v
[Claim Rare Buffs, Cards, &] <--- [Play Astral Reliquary Modes]
[Hero Upgrades from Puzzle]       [ (Expedition / Arena / Boss) ]
```

### Core Integration Points:
1. **Relic Stamina (Aether Essence)**: Playing puzzle levels consumes a special stamina currency that regenerates over time, separating puzzle play from normal world map marches.
2. **Hero Upgrade Tokens (Runestones)**: The only way to ascend specific rare hero talents or unlock unique "Relic slots" on heroes is by completing Reliquary puzzles.
3. **Monetization Hooks**: Relic Altar expansions (temporary 8th slot), Undo/Shuffle/Clear boosters, and level continues priced in premium Crownmarks.

---

## 4. Game Modes Overview
The system runs on a unified, high-performance C++ or optimized GDScript 2.0 triple-match puzzle engine, but wraps it in five distinct experiences:

| Mode | Description | Core Loop | Play Frequency |
| :--- | :--- | :--- | :--- |
| **1. Puzzle Expedition** | Progressive world map of tile-matching challenges. | Match tiles to clear boards, unlocking stories and basic runes. | Infinite (limited by Stamina) |
| **2. Extreme Challenge** | Ultra-dense, multi-layered boards with high failure rates. | Daily leaderboards, ranking points, high-tier loot. | 2 attempts daily |
| **3. Relic Arena** | Turned-based hero skirmishes powered by board matches. | Shattering relics feeds mana; full mana unleashes Hero Skills. | 5 free entries daily |
| **4. Beast Trials** | Boss battles against colossal world wildlings & dragons. | Damage is dealt based on match chains. Boss fights back. | 3 weekly entries |
| **5. Seasonal Events** | Limited-time boards with holiday/lore specific tiles. | Event currency for exclusive hero skins and castle skins. | Active during events |

---

## 5. Mode Focus: Relic Arena (Puzzle PvP/PvE)
*This is a tactical, turn-based hero battle where matches trigger combat actions.*

### Mechanics:
* **The Setup**: You bring a squad of 3 Heroes (with specific elemental affinities: Fire, Frost, Nature, Light, Void).
* **Tile Affinities**: Relic tiles are color-coded to represent elements (e.g., *Ruby Phoenix* = Fire, *Sapphire Eye* = Frost).
* **Shatter to Power**: Shattering 3 matching tiles of a specific element immediately grants **Mana** to the corresponding hero of that element.
* **Hero Skills**: Once a hero's Mana is full, their card glows. Tap the card to unleash their signature skill (e.g., "Blizzard" freezes the enemy's next tile-move, "Inferno" shatters 3 random tiles on the board).
* **Victory Condition**: Reduce the opponent's hero squad HP to 0. You deal damage whenever matches are completed; the damage scales with the level and tier of the matched relics.

---

## 6. Mode Focus: Extreme Challenge (The Vault of Trials)
*A high-difficulty, pure puzzle-solving mode featuring complex spatial layouts.*

### Mechanics:
* **The Layouts**: High layer-density (up to 8 layers deep) where only 2-3 matching tiles are uncovered at any time.
* **Negative Modifiers**: "Frozen Tiles" (must be matched twice to shatter) and "Stone Traps" (cannot be moved until adjacent tiles are cleared).
* **Leaderboards**: Players are ranked globally based on **Moves Used**, **Clear Time**, and **Shatter Chains**.
* **Rewards**: Legendary *Astral Crests* used to buy top-tier items in the Reliquary Shop.

---

## 7. Mode Focus: Beast Trials
*A cooperative or solo PvE trial where you match tiles to slay legendary beasts.*

### Mechanics:
* **Colossal Health Bar**: The boss (e.g., *Aether Dragon*) sits at the top of the screen with a massive health bar.
* **Rage Timer**: The boss has a turn counter (e.g., "Boss Attacks in 5 moves"). If you do not shatter a certain amount of defense tiles or freeze the beast, it strikes, dealing major damage to your party HP.
* **Weak Point Matches**: The boss periodically targets specific tile types (e.g., "Weakness: Emerald Relics"). Matching those specific relics deals 3x damage and staggers the beast, pausing its rage timer.

---

## 8. Mode Focus: Seasonal Events (e.g., "Solstice Awakening")
*Limited-time themed takeovers with unique skins and boards.*

### Mechanics:
* **Themed Tiles**: Standard relics are visually replaced with event-themed assets (e.g., winter ice crystals, pumpkin lanterns).
* **Event Modifiers**: "Aether Storms" randomly shuffle the board every 10 moves.
* **Progression**: Earn "Solstice Tokens" to redeem rare cosmetics, portraits, and exclusive Relic Altar frame styles.

---

## 9. Reward Structure
To keep players returning daily, rewards are divided into short-term gratification and long-term milestone goals:

* **Short-Term (Every Puzzle Clear)**:
  * *Aether Shards* (Basic currency)
  * *Speedups* and *Resources* (Food, Wood, Stone, Iron) for the main 4X game
* **Mid-Term (Campaign Milestones)**:
  * Hero recruitment scrolls
  * Rare artifact components
* **Long-Term (Relic Shop)**:
  * Exclusive Hero Cards
  * High-tier Runestones for hero ascension
  * Astral Castle Skin (Permanent 1% March Speed buff)

---

## 10. Hero Ability Integration
During puzzle gameplay (especially in Arena and Beast Trials), your equipped heroes provide passive and active skills that affect the board:

* **Hero Passive Examples**:
  * *Garrick, the Stoneguard*: Extends the bottom Relic Altar tray to 8 slots instead of 7 (major safety net).
  * *Elysia, the Windrunner*: Highlights matching tiles currently hidden beneath only one layer.
* **Hero Active Examples (Charged by matching tiles)**:
  * *Ignis, the Firelord*: Instantly shatters 3 selected tiles on the board, ignoring layer status.
  * *Sariel, the Purifier*: Shuffles the active board without consuming a booster item.

---

## 11. Unlock Requirements
* **Unlock Threshold**: Castle Level 10.
* **Reasoning**: By Level 10, players have fully understood the core city-building, harvesting, and basic troop-marching loops. Introducing the **Astral Reliquary** at this point injects fresh gameplay variety, acts as an engagement booster, and provides a new avenue for upgrading heroes right when progression in the main game begins to slow down.

---

## 12. UI Flow Diagram
The interface is designed for premium, highly tactile mobile interactions with clean transitions:

```
[City View: Astral Reliquary Building] 
               |
               v
     [Reliquary Main Hub] 
      /       |        \
     /        |         \
[Expedition] [Arena] [Beast Trials] ---> [Hero Selection Screen]
    |         |          |                     |
    v         v          v                     v
[  Unified Triple-Match Puzzle Board  ] <-------+ (Equipped Hero Cards visible)
    |
    v (On Victory)
[Shatter Victory Reward Screen] ---> [Return to Hub]
```

---

## 13. Godot 4.4 Technical Architecture
To ensure extreme performance on mobile (60 FPS on mid-range Android devices) and robust design, we utilize Godot 4.4’s specific features:

* **Rendering**: Handled via a single multi-mesh instance or optimized `Sprite2D` nodes with custom low-draw-call canvas shaders.
* **Input**: Unified coordinate mapping to support rapid taps and mouse click translations.
* **State Engine**: Separation of Board State (logical 3D grid representation) and Visual State (tweens and falling physics animations).

### Directory Structure:
```text
res://src/modules/astral_reliquary/
├── assets/
│   ├── tiles/           # High-resolution themed PNGs (relics, crystals, gems)
│   ├── sfx/             # High-quality tactile audio (tile click, magic shatter, skill fire)
│   └── shaders/         # Custom mobile-optimized tile outline and shatter shaders
├── data/
│   ├── levels/          # JSON level design data (tile placements, layers)
│   └── relics_db.json   # Relic database (IDs, elements, power scales)
├── scenes/
│   ├── ReliquaryHub.tscn       # Main landing page (Mode Selection)
│   ├── MatchEngine.tscn         # The core game board and Relic Altar tray
│   ├── RelicArena.tscn         # Arena battle view with hero card status indicators
│   ├── BeastTrials.tscn        # Boss trial screen with large boss rendering
│   └── VictoryPopup.tscn       # Rewarding win screen with shatter animations
└── scripts/
    ├── ReliquaryManager.gd      # Main controller, handles saves and 4X integration
    ├── PuzzleCore.gd            # Pure logical grid state (3D coordinates: x, y, z/layer)
    ├── TileNode.gd              # Individual tile logic (depth, overlaps, clicks)
    ├── AltarTray.gd             # Bottom 7-slot collection tray logic and matches
    ├── ArenaCombat.gd           # Turned-based calculations for Arena mode
    └── BossAI.gd                # Boss trial mechanics, rage timer, actions
```

---

## 14. JSON / Data Structure
*Levels are saved in a structured JSON layout that defines precise spatial coordinates of tiles, enabling intricate layouts (pyramids, spirals, dense columns).*

```json
{
  "level_id": 105,
  "theme": "astral_crystal",
  "board_size": { "width": 10, "height": 10 },
  "allowed_relic_ids": [101, 102, 103, 104, 105],
  "requirements": {
    "target_score": 1500,
    "max_moves": 45
  },
  "tiles": [
    { "id": 0, "relic_type_id": 101, "grid_pos": [4, 4, 0] },
    { "id": 1, "relic_type_id": 101, "grid_pos": [5, 4, 0] },
    { "id": 2, "relic_type_id": 101, "grid_pos": [4, 5, 0] },
    { "id": 3, "relic_type_id": 102, "grid_pos": [4, 4, 1] },
    { "id": 4, "relic_type_id": 102, "grid_pos": [5, 4, 1] },
    { "id": 5, "relic_type_id": 102, "grid_pos": [4, 5, 1] }
  ]
}
```

---

## 15. Scene and Script List & Core Class Roles
1. `ReliquaryManager.gd` (Inherits Node): Manages user progress, saves, unlocks, and acts as the bridging API to the main Crownspire database.
2. `PuzzleCore.gd` (Inherits Node2D): Generates, populates, and controls tile states. Calculates whether a tile is "blocked/shaded" by any tile resting above it.
3. `TileNode.gd` (Inherits Area2D): Individual relic item with collision and script. It listens to hover/click states, applies gray-out shading when blocked, and animates into the bottom tray when selected.
4. `AltarTray.gd` (Inherits Node2D): The bottom tray controller. It contains up to 7 slots, sorts incoming tiles by ID, and triggers matches of 3 tiles.

---

## 16. Exact Implementation Order (Proposed)
To ensure absolute stability, we propose the following phased rollout:

1. **Phase 1: Puzzle Core & Logic Engine (Milestone 1)**:
   * Build `PuzzleCore` and basic 3D overlapping calculations.
   * Verify selection logic: unshaded tiles are clickable, shaded tiles are blocked.
2. **Phase 2: Relic Altar Tray & Matching (Milestone 2)**:
   * Build the bottom tray holding mechanics.
   * Implement automatic matching of 3 identical relics and shatter sequence.
3. **Phase 3: Visual Polish & Shaders (Milestone 3)**:
   * Implement high-performance Godot 4.4 Tweens for tiles sliding into the tray.
   * Add particle shatters and visual bloom shaders.
4. **Phase 4: Game Modes & Progression (Milestone 4)**:
   * Implement the main `ReliquaryHub` and link to `Expedition`, `Arena`, and `Beast Trials`.
   * Hook up rewards and database saving.
5. **Phase 5: Crownspire Integration & QA (Milestone 5)**:
   * Add the physical **Astral Reliquary** building inside Crownspire's city grid.
   * Map user's Castle level checks to unlock requirements.
   * Perform extensive mobile optimization tests.

---
*End of Design Document.*
*Please review this updated strategy. Once you give the word of approval, we will begin writing the high-performance core engine code!*
