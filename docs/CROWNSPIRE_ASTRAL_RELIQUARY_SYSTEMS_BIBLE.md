# CROWNSPIRE: THE ASTRAL RELIQUARY GAMEPLAY SYSTEMS BIBLE
**Comprehensive System Mechanics, Puzzle Formulas, Combat Rules, and Generation Algorithms**
**Version:** 1.0.0 (Master Release)  
**Target Quality Tier:** Premium AAA Mobile Strategy (*Whiteout Survival*, *Call of Dragons*, *Puzzles & Chaos*)

---

## 🀄 SECTION I: PUZZLE CORE & GRID MECHANICS

The foundation of the **Astral Reliquary** is an advanced 2.5D coordinate grid engine. This engine governs how tiles are stacked, overlapping collision checks, and how tiles transition between playable and locked states.

```
                  [ GRID LAYER CO-ORDINATE RELATIONSHIP ]

                 (0, 0, 2)            [ LAYER 2 (Top) ]
                 +-------+
                 |       |
         (0, 0, 1)       (1, 0, 1)    [ LAYER 1 (Mid) ]
         +-------+       +-------+
         |       |       |       |
 (0, 0, 0)       (1, 0, 0)       (2, 0, 0) [ LAYER 0 (Bottom) ]
 +-------+       +-------+       +-------+
 |       |       |       |       |       |
```

### 1. The 3D Coordinate Space
Every tile spawned on the board is represented by a unique integer coordinate tuple:
$$\text{Tile}(x, y, z)$$
Where:
*   $x, y$: The planar coordinates mapping the grid width and height.
*   $z$: The vertical layer (depth), where $z = 0$ is the bottom floor resting on the stone altar, and $z > 0$ represents elevated layers.

### 2. Multi-Layer Overlap Rules (The Raycast Matrix)
A tile is physically $2 \times 2$ units wide. To determine if a lower tile $\text{Tile}_{\text{target}}(x_t, y_t, z_t)$ is **Locked** (cannot be tapped), the system performs an overlap check against all tiles on higher layers ($z_u > z_t$).
An upper tile $\text{Tile}_{\text{upper}}(x_u, y_u, z_u)$ overlaps the target tile if:
$$\left| x_u - x_t \right| < 2 \quad \text{AND} \quad \left| y_u - y_t \right| < 2 \quad \text{AND} \quad z_u > z_t$$

If even one tile satisfies this condition, the target tile's status is set to:
$$\text{State}(\text{Tile}_{\text{target}}) = \text{LOCKED}$$

### 3. Visual & Interactive Behavior States

#### Active State (Playable)
*   **Trigger:** The overlap check returns $0$ overlapping upper tiles.
*   **Visuals:** Full color saturation, active gold border reflections, real-time specularity on gem surfaces.
*   **Interactivity:** Clickable. Tapping triggers the fly-down collect animation.

#### Locked State (Overlapped)
*   **Trigger:** At least one overlapping upper tile is present.
*   **Visuals:** Darkened by $45\%$, desaturated by $40\%$, gold border tinted stone-grey (`#4E5A73`), shadows cast from upper tiles.
*   **Interactivity:** Non-clickable. Tapping triggers a localized grey shield-ripple particle effect, rejecting the collection action.

#### Hidden State
*   **Trigger:** Under the "Fog of the Abyss" levels, tiles on Layer 0 or 1 that are completely covered ($100\%$ footprint overlap) by upper tiles are not rendered.
*   **Reveal Rule:** Once the overlapping upper tiles fly to the tray, the hidden tile below fades in with a magical vapor effect, becoming visible in its active or locked state.

---

## 📥 SECTION II: THE RELIC ALTAR TRAY ENGINE

The **Relic Altar Tray** is the primary player-management zone. It holds active tiles during gameplay and triggers the core match mechanics.

```
                         [ RELIC ALTAR TRAY LOGIC ]

                         Tray Space (Max 7 Slots)
            [ Slot 1 ] [ Slot 2 ] [ Slot 3 ] [ Slot 4 ] [  ] [  ] [  ]
                |          |          |          |
            (Relic A)  (Relic A)  (Relic A)  (Relic B)
            \___________ ___________/
                        v
               Match 3 Triggered!
               - Tiles Shatter to Aether Sparks
               - Slot 4 shifts to Slot 1
```

### 1. Tray Constraints & Sorting Rules
*   **Capacity Limit:** The tray contains exactly **7 slots** by default.
*   **The Insertion Queue:** When a playable tile is tapped, it is appended to the tray.
*   **Immediate Sort Filter:** To keep gameplay intuitive, the tray does not maintain insertion order. Instead, it sorts adjacent tiles by **Relic ID** to cluster identical items.
*   *Example:* If the tray contains `[A, B, A, C]`, and the player taps tile `A`, the tray instantly rearranges to `[A, A, A, B, C]`.

### 2. Match-Three Evaluation
Immediately after sorting, the tray scans the queue for three adjacent, identical Relic IDs.
$$\text{If } \text{Slot}_i = \text{Slot}_{i+1} = \text{Slot}_{i+2} = \text{RelicID}$$
The match is validated, and the following actions occur:
1.  **Input Lock:** Interactive taps on the board are paused for $0.15$ seconds.
2.  **Shatter Event:** The matching trio dissolves into elemental particle effects.
3.  **Queue Compaction:** All tiles to the right of the deleted slots shift left to fill the empty spaces.
4.  **Aether Transfer:** The matching relic's raw energy is sent to the target (dealing damage to boss/enemy squads or charging hero mana).

### 3. Overflow Defeat Condition
*   If the tray reaches **7 tiles** and no match-three can be resolved:
    *   The board is locked.
    *   The Oracle warns of an Altar overflow.
    *   The player has $30$ seconds to spend premium Crownmarks to purchase a temporary 8th slot or use an Undo booster, failing which the game transitions to the **Defeat Screen**.

---

## ⚡ SECTION III: TACTICAL POWER-UPS & BOOSTERS

To balance difficulty spikes and monetize progress, four tactical systems are built into the board's interface:

```
+--------------------+--------------------+--------------------+--------------------+
|   UNDO CELESTIAL   |   ASTRAL SHUFFLE   |     ASTRAL HINT    |    SACRED ALTAR    |
|   Pulls the last   |   Regenerates the  |   Highlights the   |   Expends a slot   |
|   tile out of the  |   remaining board  |   easiest match    |   to hold up to 3  |
|   tray back to grid|   with matches.    |   automatically.   |   tiles in reserve.|
+--------------------+--------------------+--------------------+--------------------+
```

### 1. Undo Celestial
*   **Mechanic:** Reverses the last tile selection.
*   **Under-the-Hood:** Pops the rightmost tile from the Relic Altar Tray, moves it back to its original coordinate coordinates $(x, y, z)$, restores its active layer status, and recalculates the locked states of surrounding tiles.

### 2. Astral Shuffle
*   **Mechanic:** Shuffles all remaining tiles on the board.
*   **Under-the-Hood:** Maps the coordinates of all remaining tiles on the board, randomizes their Relic IDs, and ensures that **at least two matchable trios** are placed on the topmost active layers to prevent deadlocks.

### 3. Astral Hint (Celestial Guidance)
*   **Mechanic:** Identifies a valid match-three.
*   **Under-the-Hood:** Scans the active, playable tiles. If three identical Relic IDs are playable, they pulse with a golden halo. If only two are playable, it highlights them along with the closest tile covering the third piece, showing the player the path to clear it.

### 4. Sacred Altar (The Extra Slot)
*   **Mechanic:** Adds a temporary 8th slot.
*   **Under-the-Hood:** Expands the Altar Tray from 7 to 8 slots. In campaigns, this can be purchased mid-game using Crownmarks. In Arena mode, this is a passive ability granted by equipping **Garrick the Stoneguard**.

---

## ⚔️ SECTION IV: RELIC ARENA HERO SYSTEMS (TACTICAL PvP/PvE)

In the **Relic Arena**, matches translate into active combat commands for your hero squad.

```
=============================================================
                [ TURN COMBAT DAMAGE SEQUENCE ]

   [ Match 3 Ruby Fire Relics ] ---> [ Charge Ignis Mana +30% ]
                                             |
                                             v
   [ Ignis Mana Reaches 100% ]  ---> [ Glows and Activates Ultimate ]
                                             |
                                             v
   [ Tap Ignis Card ]           ---> [ Casts Inferno Blast: ]
                                     - Deals 12,000 Fire Damage
                                     - Shatters 2 Blockers
=============================================================
```

### 1. Element Affinities & Mana Mapping
Each hero in your 3-member team corresponds to an elemental affinity, mapping directly to specific tile designs:

| Relic Tile | Element | Mana Charged | Battle Effect |
| :--- | :--- | :--- | :--- |
| **Ruby Phoenix** | Fire | +30% to Fire Hero | High-damage burning strikes |
| **Sapphire Eye** | Frost | +30% to Frost Hero | Defensive shields, freezes enemy mana |
| **Emerald Claw** | Nature | +30% to Nature Hero | Party healing, cleanses status debuffs |
| **Solar Topaz** | Light | +40% to Light Hero | Armor piercing, blinds enemy targets |
| **Nebula Void** | Void | +15% to ALL heroes | Typeless armor-shattering damage |

### 2. Turn-Based Combat Flow
*   **The Player Turn:** The player receives **3 tile moves** per turn.
*   **Executing Attacks:** Every match-three completed on the board converts into an energy beam, which flies up to strike the designated enemy target, dealing damage calculated as:
    $$\text{Damage} = (\text{Hero Attack} \times \text{Match Multiplier}) \times (1 + \text{Elemental Advantage})$$
*   **Elemental Advantages:** 
    *   *Fire* deals $+50\%$ damage to *Nature*.
    *   *Nature* deals $+50\%$ damage to *Frost*.
    *   *Frost* deals $+50\%$ damage to *Fire*.
    *   *Light* and *Void* deal $+100\%$ extra damage to each other.

### 3. Ultimate Skill Triggers
*   When a hero's Mana reaches $100\%$, they enter the **Ultimate Ready State**.
*   Tapping the glowing hero portrait activates their ultimate, pausing the board to execute a tactical skill:
    *   *Ignis (Fire):* "Inferno Blast" — Deals heavy AoE damage to the enemy team and melts 2 Frozen Blockers on the board.
    *   *Sariel (Frost):* "Glacial Mirror" — Grants a damage-absorbing shield and locks the enemy team's countdown timer for 1 turn.
    *   *Elysia (Nature):* "Ivy Roots" — Heals the squad for $25\%$ max HP and highlights all matching tile groups currently on the board.

---

## 🐉 SECTION V: BEAST TRIALS (BOSS RAID SYSTEMS)

Boss battles represent cooperative or solo challenges where the board becomes a battlefield against massive, active legendary beasts.

```
=============================================================
               [ BEAST TRIAL TURN COOLDOWN SYSTEM ]

  [ Player Selects a Tile ] ---> [ Boss Action Counter -1 ]
                                         |
                                         v (Counter Reaches 0)
  [ Boss Attacks! ]         <--- [ Plays Roar & Strike Animation ]
                                 - Deals 15% Max HP Damage
                                 - Casts Granite Cages over 3 tiles
=============================================================
```

### 1. The Active Boss Rage Counter
Unlike the static campaign levels, Bosses do not wait for you to run out of moves. They attack on a **Rage Counter**:
*   The Boss starts with a counter of **5 Actions**.
*   Every single tile selected from the board and sent to the tray decrements the counter by **1**.
*   When the counter reaches **0**, the boss unleashes a devastating skill, dealing damage to your squad's HP bar and casting board obstacles, after which the counter resets to 5.

### 2. Defensive Obstacles (The Boss's Counterplay)
To disrupt your matching strategies, Boss skills spawn physical obstacles on the puzzle grid:
*   **Granite Cages:** The boss wraps 3 random active tiles in heavy stone cages. These tiles cannot be tapped. To break a cage, the player must complete a match-three immediately adjacent to the caged tile, or use a Hero ultimate skill.
*   **Void Corruptions:** The boss turns 2 random tiles purple. Tapping these tiles adds them to your Altar Tray as corrupted blanks that do not match with anything unless 3 corrupted tiles are collected, taking up valuable slot space.

### 3. Weak Point Stagger System
*   Every 10 moves, the boss exposes a specific elemental weakness (e.g., "WEAKNESS: FROST").
*   A glowing target appears over the boss model.
*   If the player shatters a Sapphire Frost match-three within the next 3 moves, the boss is **Staggered**:
    *   Its Rage Counter is frozen for 3 moves.
    *   The boss takes $+150\%$ damage from all subsequent matches during the stagger window.

---

## 📊 SECTION VI: PUZZLE GENERATION & DIFFICULTY SCALING

The Reliquary uses a sophisticated, seed-based generation engine to ensure every puzzle level is mathematically solvable while scaling in difficulty.

### 1. The Seed-Based Generation Pipeline

```
  [ Level Config: Seed ] ---> [ Define Coordinate Skeleton Layout ]
                                             |
                                             v
  [ Check Tile count ]   <--- [ Distribute Relic IDs in multiples of 3 ]
         |
         v (Solver Pass)
  [ Execute AI Simulation solver to verify 100% solvability ]
         |
         v
  [ Solve Validated? ]  ---(Yes)---> [ Save Level Data to JSON ]
         |
       (No)
         v
  [ Regenerate & Reseed ]
```

### 2. Level Design Blueprint Specs
Levels are defined in structural JSON files specifying the layout grid:
*   **Planar Skeletons:** Presets like "Pyramid," "Helix," or "Twin Walls" map the coordinate footprint.
*   **Multiples-of-Three Rule:** The generator strictly populates the board with tile types in multiples of 3. If a board has a capacity of 120 slots, it will distribute 40 sets of 3 identical Relic IDs. No leftover tiles can ever exist.

### 3. The Solvability Verification Pass
Before any level is compiled and pushed to live, an automated AI solver validates the layout:
1.  **Logical Simulation:** The AI solver scans the board, identifies all active (unblocked) tiles, and pushes them to a simulated Altar Tray.
2.  **Backtracking Evaluation:** If the simulated tray fills up without matches, the solver backtracks up to 10 moves, testing alternative collection orders.
3.  **Validation:** If a layout has no path to complete, the seed is flagged as failed. The generator adjusts tile distributions or moves layers, regenerating until a $100\%$ solvable pass is achieved.

---

## 🏆 SECTION VII: COMBO SYSTEMS, SCORING, & REWARD FORMULAS

To reward fast, precise play and maintain a healthy game economy, scores and resource payouts are calculated using strict mathematical models:

```
                      [ COMBO MULTIPLIER PIPELINE ]

   [ Match 1 Trio ] ---> [ Combo 1x ] ---> [ No Timer Reset ]
                                |
                                v (Match 2nd Trio within 2.5s)
   [ Match 2nd Trio ] ---> [ Combo 2x ] ---> [ Plays Screen Sparkle ]
                                |
                                v (Match 3rd Trio within 2.5s)
   [ Match 3rd Trio ] ---> [ Combo 3x ] ---> [ Boosts Damage & Scores! ]
```

### 1. The Cascade Combo Multiplier
When players complete matches back-to-back, a combo timer of **2.5 seconds** activates. Matching another set within this window escalates the multiplier:
$$\text{Combo Multiplier} = 1 + (\text{Combo Count} \times 0.25) \quad [ \text{Max Multiplier} = 2.5\text{x} ]$$

This multiplier scales both the **Damage Dealt** in combat modes and the **Points Earned** in Extreme Challenges.

### 2. Point Calculations (Extreme Challenge)
Your performance score is computed at the level's completion:
$$\text{Final Score} = (\text{Total Tiles Cleared} \times 100) + (\text{Remaining Moves} \times 350) + \max(0, 300 - \text{Clear Time Seconds}) \times 12$$

*   **Ratings Breakdown:**
    *   $\text{Score} \ge 25,000$: **3 Stars (Astral Master)** — Unlocks premium reward chests.
    *   $15,000 \le \text{Score} < 25,000$: **2 Stars (Portal Adept)** — Standard stage clearance.
    *   $\text{Score} < 15,000$: **1 Star (Survivor)** — Minimum clearance rewards.

### 3. Resource & Drop-Rate Calculations
Rewards are dynamically generated upon a successful run, using a pool system that references the player's current Castle Level:
$$\text{Base Gold/Wood Payout} = \text{Castle Level} \times (\text{Stage ID} \times 150) \times \text{Star Multiplier}$$

#### Loot Drop Probability Table:

| Item Type | 1 Star Rate | 2 Star Rate | 3 Star Rate | Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Aether Shards** | $100\%$ (Base 50) | $100\%$ (Base 120) | $100\%$ (Base 250) | Core bazaar currency |
| **Basic Runestones** | $35\%$ | $65\%$ | $100\%$ (Guaranteed 1) | Hero talent upgrades |
| **Rare Artifact Chest** | $2\%$ | $8\%$ | $18\%$ | Rare gear blueprints |
| **Stamina Potion** | $5\%$ | $12\%$ | $25\%$ | Retain play loops |

---

## 📅 SECTION VIII: LIVEOPS & GAME MODE CYCLES

To ensure high long-term retention and support monetization, the **Astral Reliquary** runs on a highly structured weekly event calendar:

```
+-------------------------------------------------------------+
|                     [ WEEKLY EVENT SCHEDULE ]               |
|                                                             |
|   MONDAY - TUESDAY:     [ ARENA CLASH ]                      |
|                         - Double rating tokens awarded.     |
|                                                             |
|   WEDNESDAY - THURSDAY: [ BEAST CONVERGENCE ]                |
|                         - Double drops from world bosses.    |
|                                                             |
|   FRIDAY - SUNDAY:      [ SEASONAL SOLSTICE ]                |
|                         - Limited-time boards & exclusive    |
|                           cosmetic skin shop open.           |
+-------------------------------------------------------------+
```

### 1. Arena Seasons
*   **Rotation:** Bi-weekly seasons.
*   **The Loop:** Players climb the ranks from Bronze to Celestial Crown by competing in puzzle PvP matches. At the end of each season, players are awarded premium runestones, shards, and rank badges based on their standing.

### 2. Beast Trials Convergence
*   **Rotation:** Mid-week event (Wednesday – Thursday).
*   **The Loop:** Cooperation is highlighted as Alliances face off against a colossal world-class boss. Every point of damage dealt by individual alliance members on the board is aggregated to unlock global reward tiers for the entire guild.

### 3. Seasonal takeovers
*   **Rotation:** 3-day weekend events.
*   **The Loop:** A thematic storyline opens (e.g., "The Void Surge"). The standard tile assets are swapped out for event-specific, high-contrast skins, and exclusive, high-value cosmetic castle skins are added to the event bazaar.

---
*End of Systems Specification Document.*  
*Review this complete specification. Once approved, the team will begin writing the core game scripts in Godot 4.4.*
