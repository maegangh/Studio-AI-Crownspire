# CROWNSPIRE: THE ASTRAL RELIQUARY COMPLETE ECONOMY BIBLE
**Master Economy Architecture, Drop Tables, Monetization Systems, and Player Progression Balancing**
**Version:** 1.0.0 (Master Release)  
**Target Quality Tier:** Premium AAA Mobile Strategy (*Whiteout Survival*, *Call of Dragons*, *Puzzles & Chaos*)

---

## 🪙 SECTION I: THE CURRENCY MATRIX & MACRO FLOWS

To prevent inflation of Crownspire’s core 4X resources and create clean, high-value spending vectors, the **Astral Reliquary** operates on a dedicated sub-economy. This economy consists of three primary currencies and three secondary items designed to drive the daily play loop and monetize player impatience.

```
                   [ THE ASTRAL RELIQUARY ECONOMY LOOP ]

       [ CONSUMES ]                                      [ EARNS ]
       - Sanctum Stamina   ========================>     - Aether Shards
       - Challenge Keys                                  - Arena Tokens
       - Relic Keys                                      - Aether Sparks
                                                               |
                                                               v
       [ SPENDS IN ]       <========================     [ CONVERTS TO ]
       - The Altar Bazaar                                - Hero Runestones
       - The Arena Shop                                  - Empire Boosts
       - Custom Gacha                                    - Speedups & Resources
```

### 1.1 Core Currencies

#### Aether Shards (Soft Currency)
*   *Purpose:* The primary utility token of the Reliquary. Used to buy mid-tier resources, speedups, and common runestone chests.
*   *Sources:* Idle generation from the physical Reliquary monument, Stage completions in the Puzzle Expedition, Daily Quests.
*   *Sinks:* Spent entirely in the **Portal Bazaar** (Puzzle Shop).

#### Arena Tokens (Competitive Currency)
*   *Purpose:* A high-value prestige currency awarded for competing in PvP match-three duels.
*   *Sources:* Daily Arena matches, End-of-season Arena tier placements, PvP win streaks.
*   *Sinks:* Spent in the **Relic Arena Store** to unlock elite hero shards and legendary cosmetics.

#### Aether Sparks (Core RPG Energy)
*   *Purpose:* A non-tradable progression point used to level up the Reliquary monument's **Attunement level**, which permanently boosts passive 4X empire stats.
*   *Sources:* Awarded directly for completing any match-three chain during puzzle play.

### 1.2 Progression Keys & Stamina

#### Sanctum Stamina (Pacing Mechanism)
*   *Purpose:* Restricts daily progression to prevent rapid content exhaustion and monetize active playtime.
*   *Capacity:* Max `120 Stamina`. Regenerates at $1 \text{ point} / 6 \text{ minutes}$ (full refresh in 12 hours).
*   *Conversion:* Standard Expedition stages consume `10 Stamina` per attempt. Defeats refund `5 Stamina` to reduce player frustration.

#### Challenge Keys (High-End Gate)
*   *Purpose:* Required to enter Extreme Challenge levels and Boss Raids.
*   *Sources:* Awarded upon completing Weekly Quests, purchased via premium Crownmarks, or gifted by Alliance activities.

#### Relic Keys (Summoning Gacha Grains)
*   *Purpose:* Used at the **Reliquary Vault Portal** to summon randomized high-tier relics, rare runestones, and exclusive hero skins.

---

## 📦 SECTION II: PROGRESSION VALUATION & REWARD STRUCTURE

Rewards within the Reliquary are divided into tier-specific values to ensure players feel a steady sense of progression, while locking ultimate high-end bonuses behind major milestones.

```
  +-------------------------------------------------------------------------+
  |                        REWARD PROGRESSION VALUE TIERS                   |
  |                                                                         |
  | [ COMMON TIER ]      ======> Wood, Iron, 5-Min Speedups, Common Runes   |
  | [ RARE TIER ]        ======> Shard Packs, 1-Hr Speedups, Elite Runestones|
  | [ EPIC TIER ]        ======> Hero Shards, 8-Hr Speedups, Rare Artifacts |
  | [ LEGENDARY TIER ]   ======> Star Runestones, Castle Skins, Hero Skins  |
  +-------------------------------------------------------------------------+
```

### 2.1 Reward Types

#### Core Resources & Speedups
*   *Role:* Keeps the player's 4X construction and research loops running.
*   *Value Alignment:* 5-minute speedups are common, whereas 8-hour and 24-hour speedups are highly coveted rewards reserved for 3-starring major boss milestones.

#### Hero Shards
*   *Role:* Direct integration with Crownspire's character collecting system. Allows players to unlock and evolve high-tier heroes.
*   *Economy Value:* 1 Hero Shard is valued at approximately `200 Crownmarks` ($2.00 USD equivalent).

#### Runestones (The Reliquary Signature progression)
*   *Role:* Socketed directly into Hero profiles to unlock custom passive puzzle modifiers and boost general combat stats.
*   *Tiers:*
    *   *Common (Grey):* Flat health/attack stats.
    *   *Noble (Green):* Minor elemental match damage modifiers ($+5\%$).
    *   *Royal (Blue):* Grants a minor chance ($10\%$) to spawn a wild-card tile upon matching.
    *   *Astral (Gold):* Unlocks advanced mechanics, such as increasing the Altar Tray slot count or adding starting shields.

#### Elite Cosmetics
*   *Role:* Prestige-driven monetization targeting high-spending players (Whales).
*   *Assets:* Custom avatar frames, glowing portrait borders, nameplates, and themed castle skins that grant permanent economic boosts (e.g., $+3\%$ research speed).

---

## 🎲 SECTION III: DETAILED DROP TABLES & SUMMON PROBABILITIES

The **Reliquary Vault Portal** acts as the primary gacha draw mechanic. To maintain a healthy economy, drops use a weighted probability matrix split across standard and premium summoning keys.

```
       [ THE PORTAL SUMMON PIPELINE ]

  [ Standard Summon Key ]   =======>   80% Common, 19% Rare, 1% Epic
  [ Golden Celestial Key ]  =======>   60% Rare, 35% Epic, 5% Legendary
                                       (Guaranteed Epic every 10 summons)
```

### 3.1 Standard Summon Pool (Consumes Silver Relic Keys)
*   *Single Draw Cost:* 1 Silver Key (or 100 Crownmarks).
*   *Pity Mechanism:* None.

| Item ID | Item Name | Grade | Drop Chance | Weight | Quantity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `RES_WOD_01` | Pine Wood Pack | Common | $35.00\%$ | 3500 | 10,000 |
| `RES_IRN_01` | Iron Ore Pack | Common | $30.00\%$ | 3000 | 5,000 |
| `SPD_CON_05` | 5-Min Construction Speedup | Common | $15.00\%$ | 1500 | 3 |
| `RST_COM_01` | Common Grey Runestone | Common | $10.00\%$ | 1000 | 1 |
| `SHD_PK_100` | 100 Aether Shards | Rare | $7.00\%$ | 700 | 1 |
| `RST_NBL_01` | Noble Green Runestone | Rare | $2.50\%$ | 250 | 1 |
| `HER_SHD_EL` | Elysia Shard (Rare Hero) | Epic | $0.50\%$ | 50 | 1 |

---

### 3.2 Golden Celestial Summon Pool (Consumes Gold Relic Keys)
*   *Single Draw Cost:* 1 Gold Key (or 350 Crownmarks).
*   *Pity Mechanism:* Guaranteed Epic drop or higher every **10 consecutive draws**.

| Item ID | Item Name | Grade | Drop Chance | Weight | Quantity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `SHD_PK_500` | 500 Aether Shards | Rare | $30.00\%$ | 3000 | 1 |
| `SPD_RES_60` | 1-Hr Research Speedup | Rare | $25.00\%$ | 2500 | 2 |
| `RST_RYL_01` | Royal Blue Runestone | Rare | $15.00\%$ | 1500 | 1 |
| `RST_AST_01` | Astral Gold Runestone | Epic | $15.00\%$ | 1500 | 1 |
| `HER_SHD_IG` | Ignis Shard (Epic Fire Hero) | Epic | $10.00\%$ | 1000 | 2 |
| `SKN_SOL_01` | Solar Monolith Castle Skin | Legendary | $3.50\%$ | 350 | 1 |
| `SKN_SAR_01` | Sariel Solstice Skin | Legendary | $1.50\%$ | 150 | 1 |

---

## 🏪 SECTION IV: COMMERCE BAZAARS & SHOPS

The economy features two highly specialized retail spaces to let players target specific progression goals.

```
+-------------------------------------------------------------------------+
|                         RELIQUARY RETAIL BAZAARS                        |
|                                                                         |
|   THE PORTAL BAZAAR (Puzzle Shop)   |   THE RELIC ARENA STORE (PvP Shop)   |
|   - Currency: Aether Shards         |   - Currency: Arena Tokens           |
|   - Focus: Speedups & Resources     |   - Focus: Hero Shards & Cosmetics   |
|   - Reset: Every 24 hours           |   - Reset: Weekly (Every Sunday)     |
+-------------------------------------------------------------------------+
```

### 4.1 The Portal Bazaar (Puzzle Shop)
The Portal Bazaar sells core progression items. It refreshes automatically every 24 hours, but players can force an instant refresh by spending `50 Crownmarks`.

| Item Slot | Item Name | Cost | Daily Buy Limit | Level Lock |
| :--- | :--- | :--- | :--- | :--- |
| **Slot 1** | Pine Wood Pack (50k) | 500 Shards | 5 | None |
| **Slot 2** | Iron Ore Pack (20k) | 600 Shards | 5 | None |
| **Slot 3** | 1-Hr Construction Speedup | 800 Shards | 3 | Castle Level 12 |
| **Slot 4** | Noble Green Runestone | 1,500 Shards | 2 | Castle Level 14 |
| **Slot 5** | Royal Blue Runestone Chest | 4,000 Shards | 1 | Castle Level 16 |
| **Slot 6** | **Elysia Hero Shard** | 8,000 Shards | 1 (Weekly) | Castle Level 18 |

---

### 4.2 The Relic Arena Store (PvP Shop)
This shop is tailored toward active PvP combatants. It contains higher-tier progression items and prestigious cosmetic rewards. It resets once weekly.

| Item Slot | Item Name | Cost | Weekly Buy Limit | Arena Rank Requirement |
| :--- | :--- | :--- | :--- | :--- |
| **Slot 1** | Astral Gold Runestone | 2,500 Arena Tokens | 1 | Gold Rank or Higher |
| **Slot 2** | **Ignis Hero Shard** | 1,200 Arena Tokens | 5 | Silver Rank or Higher |
| **Slot 3** | **Sariel Hero Shard** | 1,200 Arena Tokens | 5 | Silver Rank or Higher |
| **Slot 4** | Golden Celestial Key | 800 Arena Tokens | 3 | Bronze Rank or Higher |
| **Slot 5** | Solstice Avatar Border | 5,000 Arena Tokens | 1 (Permanent) | Diamond Rank or Higher |
| **Slot 6** | Phoenix Wing March Skin | 15,000 Arena Tokens | 1 (Permanent) | Celestial Crown Rank |

---

## 📅 SECTION V: TIME-PACED PROGRESSION CYCLES

To build robust daily retention habits, rewards are paced across Daily, Weekly, Monthly, and Seasonal reward loops.

```
[ DAILY LOOPS ]     =======> Complete 3 Tasks -> Earn 150 Shards & Stamina
[ WEEKLY LOOPS ]    =======> Clean 20 Stages  -> Earn 1 Gold Key & Challenge Key
[ MONTHLY LOOPS ]   =======> Calendar Login   -> Day 28: Guaranteed Epic Hero Card
[ SEASONAL LOOPS ]  =======> Event Milestones -> Unlock Legendary Castle Skins
```

### 5.1 Daily Challenge Milestones
Players complete three randomized daily objectives (e.g., "Shatter 30 Fire Relics", "Defeat 2 Arena Opponents") to accumulate progression points:
*   *Milestone 1 (30 Points):* Awarded `50 Aether Shards` + `20 Sanctum Stamina`.
*   *Milestone 2 (60 Points):* Awarded `100 Aether Shards` + `30 Sanctum Stamina`.
*   *Milestone 3 (100 Points):* Awarded `1 Silver Key` + `1 Challenge Key`.

### 5.2 Weekly Challenge Milestones
Resets every Sunday at 00:00 UTC. Tracks total matches completed throughout the week:
*   *Milestone 1 (50 Matches):* Awarded `500 Aether Shards`.
*   *Milestone 2 (150 Matches):* Awarded `1,000 Aether Shards` + `2 Challenge Keys`.
*   *Milestone 3 (300 Matches):* Awarded `1 Gold Key` + `Astral Rune Chest`.

### 5.3 Monthly Calendar Login Matrix
A 28-day reward grid. Day 7, 14, and 21 are "Major Milestones", while Day 28 grants the ultimate reward.
*   *Day 7:* `3 Gold Keys`.
*   *Day 14:* `2,500 Aether Shards`.
*   *Day 21:* `Astral Rune Chest`.
*   *Day 28:* **Guaranteed Epic Hero Card Selection Box**.

### 5.4 Seasonal Milestone Sagas
During the bi-weekly seasons, points earned in any of the 5 game modes accumulate toward a global seasonal reward track:
*   *Tier 10:* Exclusive seasonal chat bubble.
*   *Tier 20:* `5 Gold Keys`.
*   *Tier 30:* **Seasonal Hero Skin (Permanent)**.

---

## 🎫 SECTION VI: THE ASTRAL CONCORD BATTLE PASS

The Battle Pass is the primary monetization driver, providing a highly rewarding progression track that converts free-to-play players into paid subscribers.

```
=============================================================
             [ THE ASTRAL CONCORD BATTLE PASS ]

  LEVEL 1:   [FREE] 100 Shards          || [PREMIUM] 1 Gold Key
  LEVEL 2:   [FREE] 5-Min Speedup (x3)  || [PREMIUM] 1-Hr Speedup (x5)
  ...
  LEVEL 50:  [FREE] 1 Silver Key        || [PREMIUM] Phoenix Castle Skin
=============================================================
```

### 6.1 XP & Leveling Balance
*   **Total Levels:** 50 Levels per Season.
*   **XP per Level:** Exactly `1,000 XP` to level up.
*   **Sources of XP:**
    *   Daily Reliquary Quest: $+100\text{ XP}$ per task.
    *   Weekly Reliquary Quest: $+500\text{ XP}$ per task.
    *   Seasonal Milestone Quest: $+1,500\text{ XP}$ per task.
*   **Pacing:** Completing all daily and weekly tasks allows a Free-to-Play player to hit Level 50 by Day 22 of the 28-day season.

### 6.2 Free vs. Premium Reward Comparison

| Battle Pass Level | Free-to-Play Reward Track | Premium Reward Track ($9.99 USD) | Ultimate Premium Bundle ($19.99 USD) |
| :--- | :--- | :--- | :--- |
| **Level 1** | `100 Aether Shards` | `1 Gold Celestial Key` | Instantly skips to **Level 15** |
| **Level 10** | `5-Min Construction Speedup (x3)`| `1-Hr Construction Speedup (x5)` | Unlocks exclusive Golden Profile Nameplate |
| **Level 20** | `Noble Green Runestone` | `Royal Blue Runestone` | Grants $+10\%$ permanent XP boost for season |
| **Level 30** | `200 Aether Shards` | `Ignis Shard (x5)` | -- |
| **Level 40** | `1 Silver Key` | `Astral Gold Runestone` | -- |
| **Level 50** | `1 Gold Key` | **Phoenix Wing March Skin** | -- |

---

## ⚖️ SECTION VII: ECONOMY BALANCING & MONETIZATION TIERS

To ensure long-term stability and high profitability, the economy is balanced across three distinct spending tiers:

```
[ FREE-TO-PLAY ]    =======> Focuses on high engagement and DAU loops
[ MINNOWS / DOLPHINS ] =====> Conversions via high-value $0.99 - $9.99 bundles
[ WHALES ]          =======> High-stakes leaderboards and prestige cosmetic skins
```

### 7.1 Free-to-Play Balance (Retention Vectors)
*   **The Baseline Experience:** Free-to-Play players are guaranteed enough free Sanctum Stamina to clear up to 10 Campaign stages daily.
*   **The Power Catchup:** F2P players can fully unlock and maximize at least one Epic Hero within 3 months of active, daily play simply by purchasing shards with Aether Shards in the Portal Bazaar.
*   **Engagement Loops:** High haptic feedback, social alliance features, and generous milestone rewards keep F2P players active, maintaining a vibrant community that serves as the content for paying players.

### 7.2 Mid-Tier Spenders (Dolphins / Minnows)
*   **Monetization Target:** $0.99 to $9.99 USD micro-transactions.
*   **Core Offerings:**
    *   *The Daily Stamina Pass ($2.99):* Grants $+50$ extra Sanctum Stamina daily for 30 days.
    *   *The Weekly Booster Bundle ($4.99):* Provides 5 Undos, 5 Shuffles, and 2 Gold Keys.
    *   *The Premium Battle Pass ($9.99):* The highest-value purchase in the game, yielding a $10\text{x}$ return on investment.

### 7.3 High-End Spenders (Whales)
*   **Monetization Target:** $99.99 USD purchases and repetitive gacha pulls.
*   **Core Offerings:**
    *   *The Celestial Overlord Bundle ($99.99):* Instantly provides `25,000 Crownmarks`, `50 Gold Keys`, and a Legendary Astral Rune selector.
    *   *Prestige Progression:* Whales spend heavily to maximize their Hero Runestone slots, aiming for a full set of level 10 Astral Runes. This grants them dominance in global PvP Leaderboards.
    *   *Cosmetic Flexing:* High-tier cosmetic skins (e.g., *The Solar Monolith Castle Skin*) require hundreds of Portal summons, serving as a prestigious status symbol in kingdom chats.

---

## 🏛️ SECTION VIII: CORE ECONOMY SINK & SOURCE BALANCING

To maintain a healthy macro economy and prevent players from accumulating excessive resources, the sinks and sources of the sub-economy are balanced as follows:

```
+-------------------------------------------------------------------------+
|                        MACRO SINK & SOURCE BALANCE                      |
|                                                                         |
|   AETHER SHARDS:                                                        |
|   - Inputs: Idle Reliquary + Campaign + Daily Quests (~2,500/day)       |
|   - Outputs: Bazaar Speedups + Shards (~2,800/day if fully active)       |
|   - Result: Slight deficit, driving engagement and bazaar refreshes.    |
|                                                                         |
|   SANCTUM STAMINA:                                                      |
|   - Inputs: Passive regen (240/day) + Daily rewards (50/day)            |
|   - Outputs: Campaign stages (10/stage) + Arena skirmishes (10/skirmish)  |
|   - Result: Paced gameplay, preventing content consumption spikes.      |
+-------------------------------------------------------------------------+
```

*   **Refinement Controls:** If players are progressing too quickly, developers can adjust the daily purchase limits in the Portal Bazaar or increase the difficulty scaling of higher-layer tiles.

---
*End of Economy Bible.*  
*Ready for integration into active development phases and financial projection matrices.*
