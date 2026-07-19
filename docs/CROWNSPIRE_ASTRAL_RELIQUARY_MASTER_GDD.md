# CROWNSPIRE: SIGNATURE SYSTEM GAME DESIGN DOCUMENT
# THE ASTRAL RELIQUARY (MAHJONG TRIPLE-MATCH SYSTEM)
**Lead Game Designer:** Senior Systems, Economy & Narrative Designer  
**Date:** July 3, 2026  
**Document Classification:** Production-Ready Master Specification  

---

## 📋 SECTION 1: EXECUTIVE SUMMARY & FEATURE OVERVIEW

### 1.1 High-Concept Statement
The **Astral Reliquary** is Crownspire’s signature mid-game progression, puzzle, and combat portal. By combining tactical, tactile, and highly satisfying mobile triple-match puzzle gameplay with RPG hero progression and alliance coordination, it bridges the gap between passive 4X city development and high-engagement tactical decision-making. 

### 1.2 Core Objective
To replace the role of a traditional, uninspired challenge tower or portal with an immersive, lore-aligned, highly repeatable puzzle-RPG hybrid. It provides players with a secondary gameplay loop that is physically distinct from normal 4X marching, consumes its own independent stamina system, acts as the primary source for rare hero runes, and drives long-term retention and high-value monetization through premium booster systems and cosmetic rewards.

### 1.3 Key Experience Pillars
*   **Tactile Satisfaction:** Shattering three beautifully rendered, solid white-marble and gold-trimmed ancient relic tiles into pure elemental magic feels heavy, physical, and immensely rewarding.
*   **Tactical Depth:** It is not a random match-three game; it is a game of spatial awareness, foresight, and risk management where players must calculate layers, reveal underlying relics, and manage their limited 7-slot **Relic Altar** tray.
*   **RPG Synergy:** Heroes are not spectators. Their elemental affinities, passives (such as expanding the tray size), and actives (shuffling boards, shattering blockers) directly alter the state of the puzzle.

---

## 📜 SECTION 2: LORE & NARRATIVE FRAMING

### 2.1 The Cosmic Cataclysm
Eons before the foundation of Crownspire Kingdom 001, the realm was unified by the **Aetheric Concord**—an alliance of celestial gods who channeled raw magic through solid focal crystals known as **Astral Relics**. When the shadow forces shattered the Concord, these relics scattered across the kingdom, sinking into the soil and forming deep, magical leylines.

### 2.2 The Role of the Reliquary
The **Astral Reliquary** is a towering, ancient celestial monument floating directly over the central leylines of the player’s capital city. Under the guidance of the **Astral Oracle**, the Reliquary acts as a metaphysical lens. By placing excavated, corrupted relics onto the sacred **Relic Altar**, players filter out the void rot, shattering the relics into pure **Aether Sparks**. This energy is channeled to resurrect ancient hero powers, summon protective blessings over the kingdom, and fuel the battle against the encroaching wildling hordes.

---

## 🏛️ SECTION 3: BUILDING PURPOSE & CITY INTEGRATION

```
+-------------------------------------------------------------+
|                     [ CITY VIEW MAP ]                       |
|                                                             |
|   +---------------+     ~~~~~~~~~~~~~~~     +-----------+   |
|   |  Royal Keep   |    ~ Celestial Neb ~    | Barracks  |   |
|   +-------+-------+    ~   FOG RIFT    ~    +-----+-----+   |
|           |             ~~~~~~~~~~~~~~~           |         |
|           |                    |                  |         |
|           v                    v                  v         |
|   +---------------+    +---------------+    +-----------+   |
|   |  Wall Gate    |    |ASTRALRELIQUARY|    | Forge     |   |
|   +---------------+    | (LEVEL 10 UNLK|    +-----------+   |
|                        +---------------+                    |
+-------------------------------------------------------------+
```

### 3.1 Architectural Visual Identity
In the main city layout, the **Astral Reliquary** is represented as a majestic, multi-ringed marble tower that floats above a deep, glowing blue fissure in the earth. It is situated on a dedicated plateau between the Treasury and the Oracle's Sanctum. As players upgrade the building, the levitating outer rings spin faster, and the central aether crystal glows with escalating intensity, casting dynamic, volumetric light sweeps over the surrounding capital grid.

### 3.2 Core Functions
*   **The Hub of Trials:** Interacting with the building slides the camera into the **Reliquary Hub View**, transitioning the player from the realistic, high-fidelity 4X city grid into a cosmic, dark-slate bento-styled portal interface.
*   **Idle Attunement:** The building passively generates a tiny hourly stream of **Aether Shards** (the core currency of the Reliquary Shop), with the generation rate scaling directly with the player's highest cleared puzzle stage in the campaign.

---

## 🏷️ SECTION 4: BUILDING NAME OPTIONS & FINAL SELECTION

To capture the balance between physical value and high-fantasy magic, we evaluated several visual-naming configurations:

1.  **The Aether RuneForge** (Rejected: Felt too mechanical, sounding like a basic gear-upgrade station rather than a majestic portal of trials).
2.  **The Crystalline Nexus** (Rejected: Sounded too generic; lacks a strong connection to ancient heritage, heroes, and relics).
3.  **The Oracle’s Sanctum** (Rejected: Placed too much emphasis on a character rather than the physical structure and the gameplay action).
4.  **The Celestial Monolith** (Runner-up: Grand and ancient, but did not emphasize the storage and collection of precious, playable artifacts).
5.  **The Astral Reliquary (RECOMMENDED FINAL NAME)**
    *   *Aesthetic Justification:* Combining "Astral" (celestial, stellar magic) with "Reliquary" (a precious container designed to hold sacred relics) establishes the primary gameplay loop instantly. Players are entering a sacred vault to manipulate and collect ancient, highly valuable relics.

---

## 🔄 SECTION 5: THE CORE GAMEPLAY LOOP

```
                +---------------------------------------+
                |     4X Main Loop Activities           |
                | - Upgrade Buildings / Recruit Troops  |
                | - Clear World Map Wildlings           |
                +-------------------+-------------------+
                                    |
                                    v (Earns Keys & Sanctum Stamina)
                +-------------------+-------------------+
                |     The Astral Reliquary Hub          |
                | - Spends Sanctum Stamina to Enter      |
                | - Select Heroes with Tile Affinities  |
                +-------------------+-------------------+
                                    |
                                    v (Plays Puzzle Board)
                +-------------------+-------------------+
                |     Triple-Match Puzzle Board         |
                | - Click Tiles to place on Altar Tray  |
                | - Match 3 identical relics to Shatter |
                | - Power Hero skills & damage bosses   |
                +-------------------+-------------------+
                                    |
                                    v (Earns Rewards)
                +-------------------+-------------------+
                |     Upgrade & Progression Vault       |
                | - Ascend Heroes via Runestones        |
                | - Spend Shards in exclusive Shop      |
                | - Claim passive 4X empire buffs       |
                +-------------------+-------------------+
```

---

## 🀄 SECTION 6: THE TRIPLE-MATCH PUZZLE ENGINE

At the core of all five gameplay modes is our high-performance **Triple-Match Puzzle Engine**. This engine translates standard Mahjong tile layout rules into a highly polished, interactive experience designed for mobile devices.

```
       [ SAMPLE LAYER LAYOUT: 3D GRID ]
       
         Layer 2 (Top):        [ Tile A ]
                                 /    \ (Overlaps B & C)
         Layer 1 (Mid):    [ Tile B ]  [ Tile C ]
                             /    \      /    \
         Layer 0 (Bot):  [ Tile D ]  [ Tile E ]  [ Tile F ]
```

### 6.1 Tile Stacking & Overlap Rules
*   **The Grid Coordinate Matrix:** Every tile is spawned with a coordinate tuple: `(x, y, z)`, where `x` and `y` represent the 2D planar coordinates, and `z` represents the vertical layer depth (0 is the bottom floor).
*   **The Collision Footprint:** Each tile is represented logically as a `2x2` square on a coordinate grid. A tile `T1` at `(x1, y1, z1)` overlaps a tile `T2` at `(x2, y2, z2)` if:
    *   `z1 > z2` (T1 is on a higher layer than T2)
    *   The absolute difference `|x1 - x2| < 2` AND `|y1 - y2| < 2` (their 2D footprints intersect).
*   **The Locked State (Shading):** If any tile exists on a higher layer that overlaps a tile beneath it, the lower tile is flagged as **Locked**. Its visual state is immediately altered (dimmed, desaturated, specular highlights disabled) and any click inputs on it are rejected.

### 6.2 The Relic Altar Tray Mechanics
*   **The Space Limit:** The tray at the bottom of the screen has exactly **7 slots**.
*   **The Insertion Flow:** When an unlocked tile on the board is tapped, it plays an elastic fly-down animation and occupies the leftmost empty slot in the tray.
*   **Automatic Sorting:** The tray automatically sorts tiles of the same **Relic ID** to sit adjacent to each other.
*   **The Match & Shatter Event:** The moment three tiles with the same Relic ID sit adjacent in the tray, the engine pauses input, triggers a high-velocity physical shatter sequence, and deletes the matching trio, freeing up 3 slots.
*   **The Defeat Condition:** If the tray reaches **7 tiles** without any matches being completed, the Altar overflows. The level ends in defeat unless the player spends premium **Crownmarks** to unlock an 8th slot temporarily, or utilizes an **Undo** booster.

---

## 📈 SECTION 7: PLAYER PROGRESSION & DIFFICULTY CURVE

### 7.1 Progressive Layout Complexity
To keep the puzzle mechanic engaging across hundreds of levels, the puzzle layout changes systematically:

```
[Level 1-10: Flat Layout]    [Level 11-30: Dual Pyramid]   [Level 50+: Dense Monolith]
      +---+---+                   /\        /\                 +---+---+---+
      | T | T |                  /  \      /  \                | T | T | T |
      +---+---+                 +----+    +----+               | T |[T]| T |  <- 8 Layers
      | T | T |                 | T  |    |  T |               | T | T | T |     Deep
      +---+---+                 +----+    +----+               +---+---+---+
```

*   **Tiers 1-10 (Introductory):** Broad, shallow layouts. Maximum of 2 layers deep. Mostly matching basic resources to teach players the fly-down and match mechanics.
*   **Tiers 11-30 (Intermediate):** Dual-pyramids and rings. Up to 4 layers deep. Introducing blocked paths where players must clear the outer edges to reach the central keys.
*   **Tiers 31-100 (Advanced):** High-density monoliths and spirals. Up to 8 layers deep. Introduces negative board modifiers like **Frozen Tiles** (must be matched twice to shatter) and **Iron Chains** (cannot move until a neighboring tile shatters).

### 7.2 Failure Prevention & Premium Boosters
To monetize player frustration and reward preparation, players can purchase three legendary boosters:

```
+--------------------+--------------------+--------------------+
|   UNDO CELESTIAL   |   ASTRAL SHUFFLE   |   CLEAR SPIRIT     |
|   Cost: 50 Crown   |   Cost: 100 Crown  |   Cost: 150 Crown  |
|   Pulls the last   |   Shuffles all     |   Pulls 3 active   |
|   tile back out    |   remaining tiles  |   tiles out of the |
|   to the board.    |   on the board.    |   tray to reserve. |
+--------------------+--------------------+--------------------+
```

---

## 🔓 SECTION 8: UNLOCK REQUIREMENTS & ONBOARDING

### 8.1 The Castle Level 10 Gateway
*   **Why Castle Level 10?** Level 10 is the major operational threshold in Crownspire. At this point, the player has mastered the core loop of building construction, resource gathering, basic troop recruitment, and world-map marches. 
*   **The Retention Injector:** As 4X upgrade timers scale past 4 hours at Castle Level 10, the **Astral Reliquary** unlocks to capture attention during wait times, reducing churn by offering an active, stamina-based gameplay alternative.

### 8.2 The First-Time User Experience (FTUE)
*   **The Narrative Hook:** A cinematic event occurs. A giant comet strikes the city, cracking open the central plateau and exposing the glowing leylines. The Astral Oracle summons the player to construct the Reliquary.
*   **Step-by-Step Tutorial:**
    1.  The Oracle guides the hand of the player to tap the floating building.
    2.  The board loads with only 6 tiles visible (two groups of three).
    3.  A glowing gold outline directs the player to match three Ruby Phoenix relics.
    4.  The relics shatter, dealing a massive visual strike to a practice dummy, completing the stage.
    5.  The player is awarded their first **Runestone** and shown how to socket it into a hero card.

---

## 🔄 SECTION 9: DAILY & WEEKLY GAMEPLAY ROUTINES

To maximize Daily Active Users (DAU) and establish a healthy rhythm of play, activities are paced across structured limits:

```
+-------------------------------------------------------------+
|               [ DAILY & WEEKLY PLAYER AGENDA ]              |
|                                                             |
|   DAILY TASKS:                                              |
|   [ ] Burn Sanctum Stamina in Campaign (Puzzle Expedition)  |
|   [ ] Execute 2 Extreme Challenge runs (Leaderboard push)   |
|   [ ] Play 5 Arena skirmishes (Arena rating tokens)         |
|                                                             |
|   WEEKLY TASKS:                                             |
|   [ ] Coordinate with Alliance to fight 3 Beast Bosses      |
|   [ ] Complete Seasonal Event Milestones                    |
+-------------------------------------------------------------+
```

### 9.1 Stamina Economy: Sanctum Stamina
*   Entering normal **Puzzle Expedition** stages consumes **10 Sanctum Stamina**.
*   Stamina Cap: **120 Max Stamina**, regenerating at a rate of 1 point every 6 minutes.
*   Monetization: Players can purchase a complete stamina refill twice daily using Crownmarks or by watching sponsored rewards.

### 9.2 Daily Progression Quests
Clearing puzzle stages contributes directly to the player’s overall Crownspire **Daily Quest points**. For example:
*   "Clear 3 Reliquary stages" -> +10 Daily Quest Points
*   "Shatter 50 relics of Fire Affinity" -> +15 Daily Quest Points

---

## 🎮 SECTION 10: FIVE CRITICAL GAME MODES

The magic of the Astral Reliquary lies in its versatility. One single, highly optimized Triple-Match Puzzle Engine powers five distinct, high-value game modes.

---

### MODE A: PUZZLE EXPEDITION (THE CORE CAMPAIGN)

```
[Stage 1-1: Forest] ---> [Stage 1-2: Mountain] ---> [Stage 1-3: Swamp]
      |                                                   |
      v (Reward: Basic Wood)                              v (Reward: Hero Scroll)
```

#### 1. Progression Structure
A linear campaign map containing **300 progressive stages** spread across 10 distinct thematic regions of the Crownspire world atlas (e.g., *Whispering Woods*, *Basalt Crags*, *Abyssal Sunder*). Each stage features a unique tile layout, tile set, and completion requirement.

#### 2. Key Objectives & Win Conditions
*   **Clear All Tiles:** The standard mode. The player must empty the entire board before the moves limit or the timer runs out.
*   **Acquire Ancient Seals:** Specific tiles are wrapped in heavy gold chains. These "Seal Tiles" must be matched and shattered to complete the level, even if other normal tiles remain on the board.
*   **Time Attack:** Clear a densely stacked board of 150 tiles in under 90 seconds.

#### 3. Scaling Parameters
*   **Layer Depth Scaling:** Starts at 2 layers deep (Stage 1) and scales up to 8 layers deep (Stage 100+).
*   **Relic Variety Scaling:** Starts with only 4 different relic types (guaranteeing easy matches) and scales up to 12 different relic types on the board at once, drastically increasing the risk of overflowing the Altar Tray.

---

### MODE B: EXTREME CHALLENGE (THE VAULT OF TRIALS)

```
+-------------------------------------------------------------+
|                 [ THE VAULT OF TRIALS HUB ]                 |
|                                                             |
|   ACTIVE TRIAL: "The Frozen Obelisk"                        |
|   - Modifier: [Frozen Tiles] (Tiles must be matched TWICE)   |
|   - Limit: 45 Total Moves                                   |
|                                                             |
|   LEADERBOARD RANKINGS:                                     |
|   1. GuildMaster_A1 ... 12,450 pts (Clear Time: 42s)         |
|   2. StormRider     ... 11,200 pts (Clear Time: 58s)         |
|   3. [ YOU ]        ... 9,800 pts  (Clear Time: 1m 12s)      |
+-------------------------------------------------------------+
```

#### 1. High-Density Layout Patterns
The layouts are designed to test the mental limits of veteran players. Utilizing interlocking layouts like the "Basalt Fortress" where layers are staggered diagonally, a player cannot reveal any tile on Layer 0 without clearing at least 4 overlapping tiles on the surrounding Layer 1 edges.

#### 2. Negative Environmental Modifiers (Obstacles)
*   **Frozen Tiles:** These tiles are covered in a thick layer of ice. The first time they are matched, the ice shatters, turning them into normal tiles that remain on the board. They must be matched a second time to be fully cleared.
*   **Stone Blocks:** Solid blockers that sit on the board. They cannot be clicked or placed in the Altar Tray. They can only be destroyed when an adjacent tile is matched, or by utilizing an active hero skill.

#### 3. Global Leaderboards & Ranking Calculations
*   **Attempt Limits:** Players receive exactly **2 free attempts daily**. Additional entries can be purchased for 100 Crownmarks.
*   **The Point Formula:**
    $$\text{Score} = (\text{Tiles Cleared} \times 100) + (\text{Remaining Moves} \times 250) + \max(0, 300 - \text{Time Spent Seconds}) \times 5$$
*   **Weekly Resets:** Every Sunday, global rankings reset. The Top 10 players are awarded exclusive gold-plated chat frames, legendary runestone chests, and a massive cache of Alliance points.

---

### MODE C: RELIC ARENA (PUZZLE HERO COMBAT)

```
=============================================================
[ ENEMY SQUAD: HP [||||||||||||||||] 100% ]
      (Fire Mage)      (Frost Knight)      (Nature Druid)
=============================================================
                 [ THE MAHJONG ARENA BOARD ]
                 Match Fire Tiles -> Charges Ignis Mana!
                 Match Frost Tiles -> Charges Sariel Mana!
=============================================================
[ MY SQUAD:    HP [||||||||||||||||] 100% ]
     (Ignis - Fire)    (Sariel - Frost)    (Garrick - Nature)
=============================================================
```

#### 1. Turn-Based Tactical Combat Rules
In the **Relic Arena**, players face off against an opponent's squad of 3 Heroes. This is a tactical turn-based battle where the player has a set number of moves (e.g., 3 moves per turn) to manipulate the puzzle board and deal damage.

#### 2. Elemental Tiles & Mana Allocation
*   Relic tiles represent specific elemental schools:
    *   **Fire Relics (Ruby Crimson):** Charges the Fire Hero's Mana.
    *   **Frost Relics (Sapphire Cyan):** Charges the Frost Hero's Mana.
    *   **Nature Relics (Emerald Jade):** Charges the Nature Hero's Mana.
    *   **Void Relics (Nebula Violet):** Universal wild-card tile (deals typeless damage, charges 15% mana for all active heroes).
*   **Energy Transfer:** Completing a match-three chain of Fire Relics immediately charges the Mana bar of your equipped Fire Hero. 

#### 3. Direct Combat Actions
*   **Normal Damage:** Every match-three completed on the board triggers an attack. The matched relics fly toward the enemy squad, dealing physical damage scaled by the matched relic's level and the hero’s attack stat.
*   **Active Hero Skills:** When a hero's Mana bar reaches 100%, their hero portrait at the bottom of the screen glows. Tapping the portrait pauses combat to execute a cinematic ultimate:
    *   *Ignis (Ultimate: Inferno Blast):* Deals massive fire damage to all enemies and shatters 3 random ice blockers on the active board.
    *   *Sariel (Ultimate: Glacial Shield):* Grants your squad a shield absorbing 30% of incoming damage and freezes the opponent's mana regeneration for 1 turn.

---

### MODE D: BEAST TRIALS (MASSIVE PvE BOSS ENCOUNTERS)

```
=============================================================
             [ BOSS: AETHER DRAGON - HP: 1,500,000 ]
             [ BOSS TIMER: ATTACKS IN 3 MOVES      ]
=============================================================
             
                 [ THE MAHJONG TRIAL BOARD ]
                 - Weakness: Fire (Deals 3x Damage)
                 - Defensive Runes scattered on board
                 
=============================================================
[ HERO PARTY: HP [|||||||||||      ] 65% ]
=============================================================
```

#### 1. Massive Health Pool Scaling
The boss (e.g., *The Aether Dragon* or *The Basalt Behemoth*) possesses a massive health pool that cannot be depleted through simple tile matching alone. Players must survive the boss's attacks while maximizing match damage.

#### 2. Boss Rage Timers & Stagger Mechanics
*   **The Attack Countdown:** The boss has a permanent countdown display (e.g., "Boss Attacks in 4 moves"). Every card selected from the board decrements the countdown by 1.
*   **The Boss Strike:** When the counter reaches 0, the boss strikes, dealing heavy damage to the player’s global party health bar.
*   **The Weak Point Stagger:** The boss will periodically expose a weak point (e.g., "Weak Point exposed: Emerald Jade"). If the player completes a Nature match-three within 3 moves, the boss is **Staggered**. Its countdown resets to max, and it takes 200% increased damage for the next 5 moves.

#### 3. Defensive Tile Barriers
The boss casts defensive wards on the board, corrupting specific tiles and locking them in stone cages. Players must direct their matches adjacent to these stone cages to break the wards before they can click the locked tiles beneath them.

---

### MODE E: SEASONAL EVENTS (TEMPORARY CELESTIAL ACTIVATIONS)

```
+-------------------------------------------------------------+
|                 [ SOLSTICE AWAKENING EVENT ]                |
|                                                             |
|   EXCLUSIVE TILES:                                          |
|   [❄️] Frost Lily   [☀️] Solar Dial   [🍃] Autumn Leaf       |
|                                                             |
|   EVENT MILESTONES:                                         |
|   - Match 150 Solar Dials: Unlocks Solstice Avatar Frame     |
|   - Clear Stage 25 Event:  Unlocks Sariel Solstice Skin     |
|                                                             |
|   SHOP: Exchange Event Tokens for rare Castle Skins!         |
+-------------------------------------------------------------+
```

#### 1. Limited-Time Art Overlays
During events (e.g., "Solstice Awakening", "Harvest Convergence"), the visual assets of the puzzle board undergo a complete aesthetic overhaul. Standard relics are replaced with gorgeous themed assets (e.g., Frost Lilies, Solar Dials, and Autumn Leaves).

#### 2. Unique Level Modifiers
*   **Solar Flares:** Randomly charges one hero’s mana bar to full every 15 moves.
*   **Blizzard Storms:** Shuffles the remaining tiles on the board every 10 seconds, forcing fast, reactive thinking.

#### 3. Exclusive Event Progression & Shops
Clearing event stages awards players **Event Tokens** which can be exchanged in the limited-time Event Shop for extremely rare, high-value cosmetics:
*   *Sariel’s Solstice Gown* (Hero Skin - increases squad HP by 2% globally).
*   *The Solar Monolith Skin* (Castle Skin - permanent +2% wood production).

---

## 🛡️ SECTION 11: HERO SYSTEM INTEGRATION

To tie the Astral Reliquary directly to Crownspire's hero collecting system, every hero in the player's roster is assigned a unique **Reliquary Profile** containing passive board modifiers and active puzzle skills:

```
[ HERO CARD SUMMARY: PASSIVES & ACTIVES ]

GARRICK, THE STONEGUARD (Nature Element)
- Reliquary Passive: "altar expander"
  Increases the capacity of the bottom Relic Altar tray to 8 slots.
- Reliquary Active (Mana Charged): "blocker break"
  Instantly shatters up to 2 Stone Blockers on the active board.

ELYSIA, THE WINDRUNNER (Light Element)
- Reliquary Passive: "auric highlight"
  Highlights matching tiles currently obscured by only one layer.
- Reliquary Active (Mana Charged): "relic shuffle"
  Shuffles the active board without consuming any inventory boosters.
```

---

## 🤝 SECTION 12: ALLIANCE & SOCIAL INTEGRATION

The Astral Reliquary is not just a solo experience; it features robust multiplayer mechanics to drive community retention and organic engagement:

```
+-------------------------------------------------------------+
|               [ ALLIANCE SANCTUM BOARD ]                    |
|                                                             |
|   ACTIVE REQUESTS:                                          |
|   [User: StormRider] Needs Help! Stalked on Stage 84.       |
|   >> Action: [SEND UNDO BOOSTER] (Costs 0, earns 50 points) |
|                                                             |
|   COOPERATIVE BEAST RAID:                                   |
|   Current Boss: [Basalt Behemoth] HP: 4,500,000 / 10,000,000|
|   >> Action: [DISPATCH PUZZLE MARCH]                        |
+-------------------------------------------------------------+
```

### 12.1 Cooperative Alliance Boss Trials
*   Every week, Alliances can summon a massive **Cooperative Beast Raid**.
*   Instead of standard 4X war marches, Alliance members spend their special **Beast Keys** to enter the puzzle battle.
*   Every point of damage dealt by individual members on the triple-match board accumulates against the global Alliance Boss health pool.
*   When the beast falls, all participating members are awarded massive chests of Alliance speedups, gems, and exclusive relic keys.

### 12.2 Social Tile Requests & Assistance
*   **Stuck on a Level?** Players can post their active layout directly to the Alliance Chat, requesting assistance.
*   Alliance members can tap the request to send free **Stamina Refills** or **Undo Boosters**, earning **Alliance Tokens** in return and helping low-level members bypass difficult stages.

---

## 💰 SECTION 13: ECONOMY & LIVEOPS ROADMAP

The feature features an independent, carefully structured sub-economy designed to integrate cleanly into Crownspire's main economy without causing inflation:

```
                                  [ THE VAULT SHOP ]
                                  
+--------------------------------+--------------------------------+--------------------------------+
|       HERO RUNESTONE BOX       |       ASTRAL CASTLE SKIN       |       GOLD EXPEDITION KEY      |
|   Cost: 5,000 Aether Shards    |   Cost: 50,000 Aether Shards   |    Cost: 1,200 Aether Shards   |
|   Limit: 3 weekly              |   Limit: 1 (Permanent Buff)    |    Limit: 5 daily              |
+--------------------------------+--------------------------------+--------------------------------+
```

### 13.1 Economy Sink & Source Table

| Currency | Core Source | Core Sink | Impact on 4X Main Game |
| :--- | :--- | :--- | :--- |
| **Aether Shards** | Clears stages, idle generation from Reliquary monument. | Purchasing Hero Runestones, Speedups, and resources in Shop. | Direct accelerator for city construction and tech research. |
| **Relic Keys** | Main world map daily quests, Alliance gift boxes, events. | Opening rare relic summon chests (unlocks elite relic designs). | Unlocks high-tier hero passives and elemental battle card buffs. |
| **Sanctum Stamina** | Automated passive generation, daily logins, purchases. | Spending to enter Puzzle Expedition stages. | Keeps puzzle play pacing healthy, preventing content exhaustion. |

### 13.2 Live Operations & Events Roadmap
To ensure the feature remains a fresh, high-retention signature system, a standard 4-week LiveOps rotation is established:
*   **Week 1 (Arena Season Launch):** Global Relic Arena ranking resets, offering double rating tokens and competitive leaderboards.
*   **Week 2 (Beast Trial Convergence):** Colossal bosses receive seasonal variants with unique tile weaknesses and massive reward drop rates.
*   **Week 3 (Solstice Seasonal Event):** Thematic boards and event shops activate, driving cosmetic skin engagement.
*   **Week 4 (Triple-Match Speedrun):** Time attack levels open globally, offering daily speedrun rewards and cosmetic portrait frames.

---

## 🛠️ SECTION 14: FUTURE EXPANSIONS & ROADMAP

1.  **Real-Time Co-Op Puzzle Matches (Co-Op Arena):** Allowing two players to take turns on a single, shared, high-density puzzle board to defeat a boss, with shared mana pools and coordinated hero skills.
2.  **Custom Tile Workshop:** Letting alliances craft and upgrade their own custom relic tiles, socketing them into the alliance board to grant passive harvesting and defense buffs to all members.
3.  **Cross-Kingdom World Cup (KVK Arena):** Champion players from different kingdoms compete in high-stakes Arena brackets powered by the Mahjong Engine to crown the ultimate Crownspire Tactician.

---
*End of Game Design Document.*  
*Ready for engineering and art team review. Please verify and approve to transition into active phase rollout and technical execution.*
