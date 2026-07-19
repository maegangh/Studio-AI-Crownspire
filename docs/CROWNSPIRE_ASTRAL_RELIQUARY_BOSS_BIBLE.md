# CROWNSPIRE: THE ASTRAL RELIQUARY BOSS ENCOUNTER BIBLE
**Master Boss Mechanics, Phase Transitions, Grid Obstacles, and Loot Distribution Specs**
**Version:** 1.0.0 (Master Release)  
**Target Quality Tier:** Premium AAA Mobile Strategy (*Whiteout Survival*, *Call of Dragons*, *Puzzles & Chaos*)

---

## 🏛️ SECTION I: THE BOSS-GRID INTERACTION PROTOCOL

In the **Astral Reliquary**, boss encounters are not static stat checks. They are highly dynamic, turn-based puzzle battles where the enemy actively manipulates, corrupts, and blocks the player's 2.5D Mahjong grid. Players must balance clearing tiles to match identical trios with mitigating boss rage timers, breaking environmental shields, and managing phase transitions.

```
                  [ MASTER BOSS-GRID REACTION LOOP ]

   +-----------------------------------------------------------------+
   |                      ACTIVE PUZZLE GRID                         |
   | - Taps decrement Rage Countdown                                 |
   | - Matches generate Hero Mana and deal physical damage           |
   +-----------------------------------------------------------------+
                                   |
                                   v (Rage Counter hits 0)
   +-----------------------------------------------------------------+
   |                         BOSS ACTIONS                            |
   | - Casts Grid Corruptions (Granite Cages, Void Embers)           |
   | - Hits party health bar with Elemental Storms                   |
   | - Initiates Phase Shift (re-stacks board with new layouts)      |
   +-----------------------------------------------------------------+
```

### 1. Core Encounter Rules

#### The Action Point (AP) / Rage Countdown
Every boss possesses an active counter (e.g., "Attacks in 5 Actions").
*   **Decrement Trigger:** Every individual tile selected from the board and placed into the Altar Tray decrements this counter by **1**.
*   **The Ultimate Strike:** When the countdown reaches **0**, the boss plays their signature rage animation, deals massive damage to the squad, casts specific grid obstructions, and resets their counter.
*   **Implication:** Blindly tapping tiles without forming immediate matches accelerates the boss's attack frequency. Efficiency is key.

#### Weak Point Stagger State
Bosses periodically expose an elemental weak point (e.g., "Weakness: Fire").
*   **Trigger:** A glowing element target locks onto a specific region of the board.
*   **Resolution:** Matching three relics of this element within the active turn resets the boss's countdown to max and triggers a **Stagger State**.
*   **Stagger Bonuses:** The boss takes $+100\%$ extra damage from all matches for 3 moves and cannot execute actions or decrement its countdown.

---

## ⚙️ SECTION II: PUZZLE MECHANICS UNIQUE TO BOSSES

To elevate boss fights above normal campaign levels, the grid features active hazard mechanics exclusive to boss battles:

```
[ BOSS-GRID HAZARDS ]

(1) Granite Cage              (2) Void Ember                 (3) Frost Chain
    +---------+                   +---------+                    +---------+
    |  [===]  |                   |  (o.o)  |                    |  / X \  |
    |  [REL]  |                   |  (VOD)  |                    |  [REL]  |
    |  [===]  |                   |  (o.o)  |                    |  \ X /  |
    +---------+                   +---------+                    +---------+
 [Locked in stone;             [Blank tile; takes             [Linked with chains;
  shattered adjacent]           up tray space]                 must match both]
```

### 1. Granite Cages (Physical Obstruction)
*   **Mechanic:** Encases specific tiles in solid basalt stone.
*   **Grid Rules:** Caged tiles are locked and cannot be selected.
*   **Removal:** Completing any match-three immediately adjacent to the cage shatters the stone, returning the tile to its playable active state.

### 2. Void Embers (Altar Tray Corruption)
*   **Mechanic:** Corrupts standard active tiles, turning them into purple, featureless "Void Blanks".
*   **Grid Rules:** When collected, these tiles occupy valuable slot space in your Altar Tray but cannot be matched with normal elements.
*   **Removal:** The player must collect exactly 3 Void Embers in the tray to clear them, or use a Hero skill like Malakor's "Event Horizon" to purge them.

### 3. Frost Chains (Layer Links)
*   **Mechanic:** Wraps chains around two tiles on different layers (e.g., Layer 0 and Layer 2).
*   **Grid Rules:** Tapping the upper chained tile moves it to the tray, but it remains "linked" and cannot be matched until the lower chained tile is also collected and placed in the tray.
*   **Removal:** Once both linked tiles are in the tray, the chains dissolve, allowing them to match.

### 4. Elemental Shields (Color Lock Barriers)
*   **Mechanic:** The boss envelopes themselves in an elemental barrier (e.g., Frost Shield).
*   **Grid Rules:** While the shield is active, the boss is immune to all damage except matches of the corresponding element.
*   **Removal:** Complete exactly two match-threes of the target element (Sapphire Eye) to shatter the barrier.

### 5. Gravity Shifts (Dynamic Alignment)
*   **Mechanic:** Periodic shifts that slide all free, unblocked tiles toward one edge of the board.
*   **Grid Rules:** Shifting occurs along the $x$ or $y$ plane, realigning overlaps and instantly changing which tiles are marked as locked or active.

---

## 🐗 SECTION III: WILDLING FOES & SKIRMISHERS (STANDARD COMPANIONS)

Aligned directly with the families of `monsters.json`, Wildlings represent the common enemies encountered in the campaign and as guard units in boss battles. Each family possesses a unique puzzle-disruption behavior.

```
+------------------+------------------+------------------+------------------+
|  WILDLING WOLF   |  WILDLING BEAR   | WILDLING SPIDER  |  WILDLING BOAR   |
|  - Speed: Fast   |  - Power: Heavy  |  - Venom: Poison |  - Charge: Line  |
|  - Steals time   |  - Hardens tiles |  - Webs slots    |  - Crushes altars|
+------------------+------------------+------------------+------------------+
```

### 3.1 Lupine Wolf Family (`wildling_wolf`)
*   *Lore:* Agile, pack-hunting beasts patrolling the frozen outer borders of Crownspire.
*   *Grid Ability:* **Swift Pounce.** Every 8 player actions, a Wolf bites a random active tile on the board, removing it from play and shifting surrounding tiles downward.
*   *Counterplay:* Use Frost-affinity matches to freeze the wolf's action timer.

### 3.2 Armored Bear Family (`wildling_bear`)
*   *Lore:* Massive, stone-clad bears capable of hardening earth forces.
*   *Grid Ability:* **Stonehide Shell.** Every 10 actions, the Bear roars, wrapping 2 active tiles in thick granite bark. These tiles become locked stone blockers until cleared by adjacent matches.
*   *Counterplay:* Use Fire-affinity heroes (Ignis) to melt the stone bark instantly.

### 3.3 Venom Spider Family (`wildling_spider`)
*   *Lore:* Spiders that spin sticky webs in shadowed forest canopies.
*   *Grid Ability:* **Acidic Webbing.** Every 12 actions, the Spider spits silk over 1 slot in the Altar Tray. Any tile placed in the webbed slot is stuck and cannot be shifted, preventing sorting until a Light match is resolved.
*   *Counterplay:* Use Light-affinity heroes (Lysandra) to cleanse the webbing.

### 3.4 Fierce Boar Family (`wildling_boar`)
*   *Lore:* Tusked charging beasts that run headfirst into battle lines.
*   *Grid Ability:* **Rampage Charge.** Every 7 actions, the Boar crashes into the Altar Tray, locking the rightmost slot for 2 turns.
*   *Counterplay:* Complete Nature matches to root the boar and cancel its charge.

### 3.5 Colossal Troll Family (`wildling_troll`)
*   *Lore:* Giant cave trolls wielding uprooted trees.
*   *Grid Ability:* **Grid Slam.** Every 15 actions, the Troll slams the board, flipping 3 random active tiles face down. The player must remember their positions or match adjacent to flip them back.
*   *Counterplay:* High physical damage matches (Earth/Nature) stagger the Troll before they can slam.

### 3.6 Mythical Dragon Family (`wildling_dragon`)
*   *Lore:* Noble, elemental dragons carrying raw cosmic power.
*   *Grid Ability:* **Draconic Eclipse.** Every 18 actions, the Dragon breathes elemental fire across 1 full row, turning all tiles in that row into corrupted Void Blanks.
*   *Counterplay:* Match Light relics to purify the row.

---

## 💀 SECTION IV: ELITE REGION BOSSES (CAMPAIGN FINALE)

Elite Bosses guard the milestone campaign chapters (every 30 stages). They feature massive health pools, voice-acted warnings, and transition across three distinct combat phases.

---

### BOSS 1: THE GOLIATH BEHEMOTH (BASALT CRATER FINALE)

```
=============================================================
                  THE GOLIATH BEHEMOTH (ELITE)
=============================================================
[ ELEMENTS ] Earth / Physical
[ HEALTH ] 450,000 HP
[ ARENA ] Deep volcanic crater filled with falling ash.
[ CORE PASSIVE ] "Basalt Armor"
  Takes 50% reduced damage until his Granite Shield is broken.
=============================================================
```

#### Boss Abilities
*   **Granite Stomp:** The Behemoth slams his stone fists, encasing 3 top-layer tiles in Granite Cages.
*   **Fissure Burst:** Deals high physical damage to your lowest-health hero and locks their mana pool for 2 turns.

#### Battle Phases
*   **Phase 1 (100% - 70% HP):** Standard layout. The Behemoth stomps every 6 moves, casting Granite Cages.
*   **Phase 2 (69% - 30% HP):** The Behemoth enters "Rage State". He summons an Earth Shield. Only Earth/Nature matches can deal damage. He stomps every 4 moves, double-caging tiles.
*   **Phase 3 (HP < 30%):** **Seismic Rifting.** The Behemoth shatters the current board. The remaining tile grid is flattened (all layers collapse to Layer 0). 6 unclickable basalt stone blocks are scattered throughout the board, restricting player pathfinding.

#### Elite Drop Table
*   *Guaranteed:* `1,500 Aether Shards`, `500 Wood`.
*   *Chance-Based:* `Noble Green Runestone (45%)`, `Elysia Hero Shard (12%)`, `Golden Celestial Key (8%)`.

---

### BOSS 2: FENRIR, THE ABYSSAL DIRE (GLACIAL CITADEL FINALE)

```
=============================================================
                  FENRIR, THE ABYSSAL DIRE (ELITE)
=============================================================
[ ELEMENTS ] Frost / Void
[ HEALTH ] 620,000 HP
[ ARENA ] Ancient ice temple surrounded by towering glaciers.
[ CORE PASSIVE ] "Chilled Air"
  Reduces player's match combo timer by 1.0 second.
=============================================================
```

#### Boss Abilities
*   **Frostbite Howl:** Freezes 4 active tiles in thick ice. Freezed tiles must be matched twice to be cleared.
*   **Glacial Spike:** Fires ice shards dealing single-target Frost damage and delaying the target hero's ultimate.

#### Battle Phases
*   **Phase 1 (100% - 60% HP):** Fenrir hunts on a 5-action countdown, freezing tile pathways.
*   **Phase 2 (59% - 25% HP):** **Glacial Blizzard.** Fenrir blurs the board. A thick frost overlay obscures all relic icons, leaving only elemental colors visible. Players must match adjacent tiles to clear the frost fog or use a Light hero's skill to illuminate the board.
*   **Phase 3 (HP < 25%):** **Abyssal Eclipse.** Fenrir fuses Frost and Void. Any tile frozen that is not matched within 3 turns turns into a permanent stone block.

#### Elite Drop Table
*   *Guaranteed:* `2,200 Aether Shards`, `800 Iron`.
*   *Chance-Based:* `Royal Blue Runestone (30%)`, `Sariel Hero Shard (15%)`, `Stamina Potion (25%)`.

---

### BOSS 3: IGNARA, THE ASHEN PHOENIX (ASHEN CALDERA FINALE)

```
=============================================================
                  IGNARA, THE ASHEN PHOENIX (ELITE)
=============================================================
[ ELEMENTS ] Fire / Light
[ HEALTH ] 780,000 HP
[ ARENA ] Sea of molten lava with floating obsidian platforms.
[ CORE PASSIVE ] "Reborn Flame"
  Upon reaching 0 HP, transforms into an Egg with 100,000 HP.
  If not destroyed in 5 moves, revives at 50% HP.
=============================================================
```

#### Boss Abilities
*   **Ashen Rain:** Searing embers fall onto the board, locking 2 random active tiles and burning any hero who matches them.
*   **Supernova:** Deals massive fire damage to the whole team unless a Frost shield is active.

#### Battle Phases
*   **Phase 1 (100% - 50% HP):** Focuses on "Ashen Rain" to lock tiles and burn heroes.
*   **Phase 2 (49% - 0% HP):** Ignara bursts into white fire, spawning 2 Celestial Bombs on the board. The countdown drops to 3 actions, speeding up the battle significantly.
*   **Phase 3 (Egg State):** **Rebirth.** Ignara retreats into an obsidian egg. The board is reshuffled with dense fire relics. The player has exactly 5 moves to match Fire relics to melt the egg before Ignara revives.

#### Elite Drop Table
*   *Guaranteed:* `3,000 Aether Shards`, `1,200 Stone`.
*   *Chance-Based:* `Astral Gold Runestone (15%)`, `Ignis Hero Shard (18%)`, `Gold Summon Key (12%)`.

---

## 🐉 SECTION V: LEGENDARY WORLD BOSSES (SERVER-WIDE CO-OP)

World Bosses are colossal raid targets open to the entire server during weekend events. They feature endless health parameters, requiring players to compete for damage leaderboard brackets.

---

### BOSS 4: THE AETHER DRAGON (CHRONOS VOID CO-OP)

```
=============================================================
                  THE AETHER DRAGON (WORLD BOSS)
=============================================================
[ ELEMENTS ] Void / Prismatic
[ HEALTH ] 15,000,000 HP (Shared Global Pool)
[ ARENA ] Cosmic rift floating in deep interstellar space.
=============================================================
```

#### Unique Grid Mechanics
*   **Cosmic Eclipse:** The Dragon breathes cosmic fire, converting 3 random tiles into corrupted Void Blanks.
*   **Singularity Collapse:** At $30\%$ HP, the Dragon compresses space. The player’s Altar Tray is restricted, locking slots 6 and 7. The player must play with a tight 5-slot constraint.
*   *Counterplay:* Equipping Garrick the Stoneguard is highly recommended, as his passive "Altar Expander" expands the tray back to 6.

#### Battle Phases
*   **Phase 1 (100% - 70% HP):** The Dragon uses "Cosmic Eclipse", casting Void Blanks on the grid.
*   **Phase 2 (69% - 30% HP):** **Reality Distortion.** The Dragon shifts gravity every 5 moves, shuffling tile layers.
*   **Phase 3 (HP < 30%):** **Singularity Collapse.** The Dragon locks slots 6 and 7 in the Altar Tray. The player must speedrun matching to finish the fight before the tray overflows.

#### World Leaderboard Rewards (Bi-Weekly Event)
*   **Rank 1 - 3:** `10,000 Aether Shards`, `20 Gold Celestial Keys`, Exclusive **"Void Conqueror" Portrait Frame**, 10x Hero Shard Selector.
*   **Rank 4 - 50:** `5,000 Aether Shards`, `10 Gold Keys`, **"Void Sentinel" Avatar Frame**.
*   **Participation (Deal >10k damage):** `1,200 Aether Shards`, `2 Challenge Keys`.

---

### BOSS 5: LEVIATHAN, THE TIDAL SOVEREIGN (SUNKEN ABYSSAL TRENCH)

```
=============================================================
                  LEVIATHAN, THE TIDAL SOVEREIGN
=============================================================
[ ELEMENTS ] Frost / Nature
[ HEALTH ] 20,000,000 HP (Shared Global Pool)
[ ARENA ] Sunken ocean ruins surrounded by swirling whirlpools.
=============================================================
```

#### Unique Grid Mechanics
*   **Abyssal Grasp (Tentacles):** Leviathan slams 4 tentacles onto the board, locking four quadrants of the grid (cannot tap any tiles in locked zones). 
*   *Resolution:* Completing a match-three directly adjacent to a tentacle deals heavy physical damage, forcing the tentacle to retreat and freeing that quadrant.

#### Battle Phases
*   **Phase 1 (100% - 60% HP):** Grips the grid with 2 tentacles, narrowing the playable field.
*   **Phase 2 (59% - 30% HP):** **Tidal Surge.** A whirlpool covers the lower layers. Any tile on Layer 0 that is not cleared within 5 moves is washed away, reshuffling the board.
*   **Phase 3 (HP < 30%):** **Deep Sea Pressure.** Grips the grid with 4 tentacles, while launching high Frost damage storms at the player's party.

#### World Leaderboard Rewards
*   **Rank 1 - 3:** `10,000 Aether Shards`, `20 Gold Keys`, Exclusive **"Tidal Overlord" Portrait Frame**.
*   **Participation:** `1,200 Aether Shards`, `2 Challenge Keys`.

---

## 🏰 SECTION VI: ALLIANCE RAID BOSSES (MULTI-STAGE DUNGEONS)

Alliance Bosses are summoned within the Alliance Castle territory. Alliance members fight the boss simultaneously, contributing damage to unlock guild-wide chests.

---

### BOSS 6: THE IRON FORTRESS (ALLIANCE CITADEL SUMMON)

```
=============================================================
                  THE IRON FORTRESS (ALLIANCE)
=============================================================
[ ELEMENTS ] Metal / Earth
[ HEALTH ] 45,000,000 HP (Guild Progress Target)
[ ARENA ] Castle inner courtyard fortified with steel spikes.
=============================================================
```

#### Boss Abilities
*   **Iron Barricade:** Covers 4 random top-layer tiles in heavy iron plating. Iron tiles must be cleared by matching them with a Gold Celestial Bomb.
*   **Spike Rain:** Launches steel bolts that deal piercing physical damage to the party's defender.

#### Battle Phases
*   **Phase 1 (100% - 50% HP):** Focuses on "Iron Barricade" to lock the outermost tiles.
*   **Phase 2 (HP < 50%):** **Magma Flood.** Lava covers the bottom row of the board, locking 3 Altar slots. However, all Fire matches deal triple damage during this window, encouraging players to run Fire squads.

#### Alliance Raid Chest Rewards
*   **Guild Victory Chest:** `10,000 Aether Shards`, `1 Gold Celestial Key`, `200 Alliance Coins`.
*   **Top 3 Contributors Chest:** `Astral Gold Runestone`, `5 Ignis Hero Shards`.

---

### BOSS 7: KAEL'THUZAR, THE SOUL WARDEN (NECROTIC CATHEDRAL)

```
=============================================================
                  KAEL'THUZAR, THE SOUL WARDEN
=============================================================
[ ELEMENTS ] Void / Frost
[ HEALTH ] 55,000,000 HP (Guild Progress Target)
[ ARENA ] Gothic cathedral ruins with glowing green spirit urns.
=============================================================
```

#### Unique Grid Mechanics
*   **Grave Tiles:** Kael'Thuzar summons green-glowing "Grave Tiles" into the player's Altar Tray.
*   *Detonation Rule:* If a Grave Tile sits in the tray for 3 turns without being matched, it explodes, dealing damage equal to $30\%$ of the party's max HP and resetting their mana pools.
*   *Counterplay:* Prioritize matching Grave Tiles immediately or use Sariel's freeze shield to stall the detonation countdown.

#### Battle Phases
*   **Phase 1 (100% - 60% HP):** Summons 1 Grave Tile every 5 moves.
*   **Phase 2 (59% - 30% HP):** **Spirit Torment.** Kael'Thuzar spawns chains across the grid, linking 4 pairs of tiles across different layers.
*   **Phase 3 (HP < 30%):** **Death's Embrace.** The boss summons 2 Grave Tiles simultaneously every 4 moves, testing player sorting speed.

#### Alliance Raid Chest Rewards
*   **Guild Victory Chest:** `12,000 Aether Shards`, `2 Gold Keys`, `300 Alliance Coins`.
*   **Top 3 Contributors Chest:** `Astral Gold Runestone`, `5 Sariel Hero Shards`.

---

## ⚔️ SECTION VII: RELIC ARENA CHAMPION BOSSES (PvP CHAMPIONS)

In the **Relic Arena**, the "Boss" is a highly optimized squad of 3 AI-controlled Heroes who play with advanced synergy parameters, mimicking real-world tactical players.

```
=============================================================
                  THE CELESTIAL CONCORD TRIAD
=============================================================
[ SQUAD COMPOSITION ]
  - Ignis (Fire / DPS)  - Sariel (Frost / Tank)  - Elysia (Light / Speed)

[ AI DECISION ENGINE ]
  - Turn 1: Focuses on Frost matches to generate defensive shields.
  - Turn 2: Prioritizes Fire matches to charge Ignis's AoE.
  - Turn 3: Elysia shuffles the board if no matches are visible.
=============================================================
```

### 7.1 AI Combat Strategy
The Arena Champion Boss utilizes an advanced decision tree that scans the active Mahjong board:
1.  **Scan Phase:** The AI identifies all playable matching trios on the current layers.
2.  **Priority Filter:**
    *   *Defensive Trigger:* If AI squad HP is $< 40\%$, prioritize matching healing tiles (Nature/Light).
    *   *Control Trigger:* If the player has an ultimate ready, prioritize Frost matches to freeze the player's mana bar.
    *   *Aggro Trigger:* Under standard conditions, prioritize Fire and Void matches to deal maximum direct damage and charge Ignis's ultimate.

### 7.2 The Ultimate Clash Event
When the Champion team charges their mana to full, they trigger full-screen ultimate skill chains:
*   *Combo:* Elysia casts "Aether Shuffle" to re-arrange tiles, instantly followed by Ignis casting "Inferno Blast" to detonate the newly formed bomb tiles, testing the player's defensive setups.

---

## 📈 SECTION VIII: DIFFICULTY SCALING & ENCOUNTER FORMULAS

To ensure bosses remain challenging throughout a player’s lifecycle, stats scale systematically based on the stage level.

### 1. Boss HP and Damage Scaling Formulas
The base health and attack stats of bosses are calculated using exponential scaling models:
$$\text{Boss Health}(L) = \text{Base Health} \times 1.15^{L-1}$$
$$\text{Boss Attack}(L) = \text{Base Attack} \times 1.08^{L-1}$$
Where $L$ represents the Boss Stage Level.

#### Scaling Parameter Reference:

| Boss Level ($L$) | Earth Boss HP | Fire Boss Attack | Blocker Spawn Count | Countdown Moves |
| :--- | :--- | :--- | :--- | :--- |
| **Level 1** | $15,000$ | $850$ | 0 | 6 moves |
| **Level 10** | $52,000$ | $1,700$ | 1 Stone Block | 5 moves |
| **Level 50** | $540,000$ | $6,200$ | 3 Granite Cages | 5 moves |
| **Level 100+** | $2,400,000+$ | $18,500+$ | 5 Cages + 2 Void Blanks | 4 moves |

---

## 🚀 SECTION IX: FUTURE EXPANSIONS & DESIGN HORIZONS

### 1. Dynamic Weather Battlefields
Introducing real-time environmental weather systems that alter tile behaviors:
*   *Blizzard Storms:* Freeze 1 random tile every turn.
*   *Solar Flares:* Automatically complete any active pair on the board.

### 2. Colossal Multi-Screen Raids
Bosses so massive that they span three vertical puzzle boards. Alliances must coordinate across three lanes (Left Wing, Central Core, Right Wing) to destroy specific target limbs before the main body can be staggered.

### 3. Mythic Relic Weapons
Defeating level 100+ World Bosses drops legendary blueprint fragments. Players craft custom Relic Weapons that socket directly onto their puzzle board, granting permanent grid buffs (e.g., automatically melting 1 Frozen Block every match).

---
*End of Boss Encounter Bible.*  
*Ready for integration into development pipelines and character animation asset creation sheets.*
