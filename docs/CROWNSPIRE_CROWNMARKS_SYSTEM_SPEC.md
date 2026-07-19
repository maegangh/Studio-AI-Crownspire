# 🏆 Crownspire Game Design Document (GDD)
## System Specification: Sovereign Crownmarks Progression System
**Author:** Lead Systems Designer, Crownspire Core Systems Team  
**Status:** Approved for Production  
**Target Platform:** Mobile (iOS/Android)  
**Game Style:** Premium Live-Service Mobile MMO Strategy (inspired by *Whiteout Survival*, *Call of Dragons*, *Rise of Kingdoms*)  

---

## 🏛️ 1. Executive Summary & System Overview

### What are Crownmarks?
Sovereign Crownmarks represent the premier end-game progression loop in **Crownspire**. They are powerful, soul-bound physical artifacts, weapons, seals, royal regalia, banners, and instruments of power. Historically associated with ancient lords, heroes, and legendary entities, each Crownmark carries a unique "magical imprint."

### Core Philosophy
To create an elite metagame experience that respects player effort while establishing a multi-year retention mechanism. 

### Equippability & Affinity Mechanics
*   **Universal Utility:** Any hero in the roster can equip any Crownmark, gaining immediate access to its primary base stats (Health, Attack, and Defense) to prevent low-utility pull frustration.
*   **Signature Hero Affinity (Full Awakening):** When a Crownmark is equipped by its **Signature Hero** (the character of historical affinity), the magical seal breaks, unlocking **Signature Resonance Bonuses**, **Unique Passive Abilities**, custom **Visual Upgrades/Auras**, and maximum multiplier effectiveness.
*   **Reduced Effectiveness:** Non-signature heroes can equip the item, but receive flat stat modifications with a **-40% penalty** to all base stats and cannot activate any tier of signature passive skills or resonance visual flares.

---

## 💰 2. Core System Metrics & Mathematical Formulas

The progression curves inside Crownspire are calibrated using non-linear exponential curves. This ensures that the early game is fast and highly rewarding (dopamine delivery), while the end game (Levels 80-100 and Stars 4★-5★) requires strategic guild activity, live-ops event participation, and targeted monetization.

### I. Level-Up Cost Formulas
Each Crownmark level upgrade requires **Crownmark Dust** (base experience material) and **Gold Crowns** (soft currency).

$$\text{Dust Cost}(L) = \max\left(120, \text{round}\left(L \times 140 \times 1.05^L \times M_R\right)\right)$$
$$\text{Gold Cost}(L) = \max\left(150, \text{round}\left(L \times 180 \times 1.04^L \times M_R\right)\right)$$

Where $L$ represents the *current level* of the Crownmark, and $M_R$ is the **Rarity Multiplier**:
*   **Rare:** $M_R = 1.0$
*   **Epic:** $M_R = 1.5$
*   **Legendary:** $M_R = 2.2$
*   **Mythic:** $M_R = 3.5$

#### Why this math exists:
*   The $1.05^L$ (dust) and $1.04^L$ (gold) compounding interest variables ensure that leveling acts as a soft-gate. Upgrading an item from Level 1 to 20 takes less than a day of passive play, whereas Level 99 to 100 demands active tactical grinding. This maintains value for years of service.

---

## 🛡️ 3. Progression Materials Flow & Farming Economy

To support a healthy live-service mobile MMO economy, resources are distributed across solo, guild (alliance), and premium channels, ensuring free-to-play players have consistent, predictable horizontal progression while monetized players can accelerate breakthroughs.

### Material Catalog & Design Rationale

| Material Name | Rarity | Primary Farming Channel | System Function | Why It Exists (Design Intent) |
| :--- | :--- | :--- | :--- | :--- |
| **Crownmark Dust** | Common | Solo Wildlings (PvE), Daily Patrol Chests, Quarry Nodes | Micro-level upgrades (Levels 1-100) | Delivers a daily, predictable sense of micro-progress; prevents the metagame from feeling static. |
| **Star Sparks** | Uncommon | Wildling Fort Nests (Rally), Sanctum Raids | Low-tier Breakthroughs (1★ - 3★) | Direct incentive for active Kingdom Chat coordination and cooperative alliance play. |
| **Celestial Shards** | Epic | High-Level Boss Nests, Guild Events | High-tier Breakthroughs (4★ - 5★) | Mid-game gatekeeper; rewards structured alliance play and competitive territory milestones. |
| **Fire Crystals** | Mythic | Alliance Capitals, Elite Arena, Capital Sieges | Final Breakthroughs (5★ Overdrive) | Sovereign-class progression cap; establishes territory coordinates on the world map as highly-valued assets. |

---

## 📈 4. Detailed Progression Curves (Levels 1-100)

The following matrix represents the standard design lookup reference for a **Legendary** Rarity Crownmark upgrade cost across milestone tiers:

| Level Tier | Dust Cost (Per Level) | Gold Cost (Per Level) | Cumulative Dust | Cumulative Gold | Level Cap Constraint |
| :---: | :---: | :---: | :---: | :---: | :---: |
| **Level 1** | 308 | 301 | 308 | 301 | Unlocked at 0★ |
| **Level 10** | 3,554 | 2,836 | 16,840 | 13,290 | Unlocked at 0★ |
| **Level 20** | 16,334 | 11,288 | 98,124 | 70,410 | **0★ Ceiling (Requires 1★)** |
| **Level 30** | 62,568 | 39,268 | 454,232 | 301,450 | Unlocked at 1★ |
| **Level 40** | 218,655 | 125,765 | 1,720,110 | 1,024,310 | **1★ Ceiling (Requires 2★)** |
| **Level 50** | 719,985 | 377,215 | 5,910,240 | 3,340,110 | Unlocked at 2★ |
| **Level 60** | 2,246,845 | 1,078,550 | 18,212,500 | 9,840,410 | **2★ Ceiling (Requires 3★)** |
| **Level 80** | 19,340,420 | 7,725,120 | 112,410,200 | 51,410,230 | **3★ Ceiling (Requires 4★)** |
| **Level 90** | 63,122,250 | 22,810,120 | 440,210,000 | 185,210,000 | **4★ Ceiling (Requires 5★)** |
| **Level 100** | 205,241,120 | 67,410,230 | 1,480,210,000 | 580,210,000 | **5★ Ultimate Sovereign Cap** |

---

## 🌟 5. Awakening Stars, Breakthroughs, and Pity Mechanics

### The Breakthrough Concept
Leveling up provides linear, daily stat buffs. Star Breakthroughs, however, act as **major milestones** that lift the Level Cap, significantly boost scaling, and enhance the unique Signature Passive values.

### Star Tier Mechanics & Materials Requirements

| Star Transition | Success Rate | Fragment Cost | Star Sparks Cost | Celestial Shards | Fire Crystals | Level Cap Lift |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **0★ ➔ 1★** | 100% | 10 | 40 | 0 | 0 | 20 ➔ 40 |
| **1★ ➔ 2★** | 100% | 20 | 80 | 0 | 0 | 40 ➔ 60 |
| **2★ ➔ 3★** | 85% | 45 | 150 | 5 | 0 | 60 ➔ 80 |
| **3★ ➔ 4★** | 60% | 90 | 300 | 15 | 25 | 80 ➔ 90 |
| **4★ ➔ 5★** | 40% | 180 | 600 | 40 | 100 | 90 ➔ 100 |

### Anti-Frustration & Pity Mechanics (The "Sovereign Fortune" Engine)
In standard mobile MMOs, failure during item modification leads to player churn or guild abandonment. Crownspire introduces a user-friendly safety protocol:
1.  **Zero-Loss Guarantee:** Failing a star breakthrough **never destroys the item** and **automatically refunds 100% of the rare materials** (Duplicate Fragments, Celestial Shards, and Fire Crystals). Only the common Gold and Star Sparks are lost.
2.  **Breakthrough Compassion Factor:** Each failure on an item adds a permanent **+15% cumulative success chance** to that specific item's next breakthrough attempt. If a 4★ ➔ 5★ attempt (40% base) fails, the next attempt operates at 55%, then 70%, then 85%, culminating in 100% guaranteed success.

---

## 🧩 6. Fragments, Duplicates, and Synthesis Engine

### Duplicate Conversion
When a player pulls a duplicate Crownmark from the Tavern Gacha or earns one in an alliance crusade event, the duplicate is instantly converted into **Duplicate Fragments** based on rarity:
*   **Rare Duplicate:** Converted into 10 Common Fragments.
*   **Epic Duplicate:** Converted into 25 Uncommon Fragments.
*   **Legendary Duplicate:** Converted into 60 Elite Fragments.
*   **Mythic Duplicate:** Converted into 120 Sovereign Fragments.

### Dismantling (The "Melt Yield" Protocol)
Excess or unused duplicates can be dismantled inside the Citadel Forge to salvage valuable resources:
*   **Legendary Dismantle Return:** Yields 1,500 Crownmark Dust and **1 Omni-Shard** (a generic legendary fragment).
*   **Epic Dismantle Return:** Yields 400 Crownmark Dust and 3 Epic Fragments.

### The Omni-Shard Exchange (Free-to-Play Safeguard)
To prevent players from hitting progression dead-ends when they cannot pull the exact duplicate they need, Crownspire implements an **Omni-Shard Exchange Matrix**:
*   **Rate Omni to Legendary:** 3 Omni-Shards ➔ 1 Specific Legendary Fragment.
*   **Rate Omni to Epic:** 1 Omni-Shard ➔ 1 Specific Epic Fragment.
*   **Requirement:** Players can only exchange Omni-Shards for a specific hero's Crownmark if they have already unlocked/discovered the base Crownmark at least once. This preserves the monetization value of initial pulls while allowing F2P players to grind stars horizontially.

---

## 🔮 7. Resonance Levels & Signature Synergies

Each hero's armory features **5 equipment slots** designed specifically for Crownmarks. Each slot represents a unique focal point of power.

### Slot Classification
1.  **Slot 1 (Weapon):** Focuses on Raw Attack, Critical Strike Chance, and Army-wide Armor Piercing.
2.  **Slot 2 (Regalia/Crown):** Focuses on Troop Health, March Speed, and Counterattack Damage.
3.  **Slot 3 (Armor/Shield):** Focuses on Raw Defense, Garrison Shielding, and Knockback Immunity.
4.  **Slot 4 (Banner/Standard):** Focuses on Morale Generation, Rally Size Boosts, and Control Effects Resistance.
5.  **Slot 5 (Accessory/Tome):** Focuses on Skill Damage Multipliers, Resource Harvesting Speeds, and Energy Recharge.

### Sovereign Set Resonance Tiers
Equipping multiple matching historical artifacts on a hero triggers profound synergy bonds, visualized in-game by shimmering, faction-colored magic auras:

*   **Tier I: Dual Resonance (2/5 Equips):** Increases all basic flat stats of equipped items by **+15%**.
*   **Tier II: Triumvirate Echo (3/5 Equips):** Increases troop march damage rating by **+10%** and increases movement speed on the map by **+8%**.
*   **Tier III: Sovereign Concord (4/5 Equips):** Grants full tactical silence immunity to the hero's legion and neutralizes opponent's critical damage modifiers by **25%**.
*   **Tier IV: Absolute Sovereign (5/5 Equips):** Activates a faction-colored swirling active shader on the battlefield. When the hero casts their primary active skill, it deals an additional **+30% damage** as true area-of-effect elemental burst.
*   **Tier V: Celestial Awakening Overdrive (5/5 Equips + 4★ Average Star Level):** Elevates active skill multipliers by a massive **+45%** and shields allied legions in a 3-coordinates radius for **8% of their maximum health** for 5 seconds upon casting.

---

## 📖 8. Codex Museum & Account-Wide Collection System

The **Citadel Codex Museum** is a dedicated collector's gallery where players register newly unlocked historical artifacts. This feature turns a "terrible pull" into a triumph.

### Design Rationale: Eliminating "Trash Pools"
In classic RPG and strategy gachas, pulling an item for a commander you don't use or like feels awful. In Crownspire, registering any completed artifact collection in the Museum grants **permanent, account-wide global stats**. 

### Example Museum Galleries & Buffs:
*   **The Dawnchaser Saga (Scepter + Shield):** Grants +1.5% Timber Woodmill Production and +1.0% Infantry Defense.
*   **Tomb of the Frost Giants (Daggers + Tomes):** Grants +2.0% Army Attack against PvE monsters and +2.0% Slate Quarry Gather Speed.
*   **Prestige Crowns Assembly:** Grants +5.0% Alliance Coordinates rally marching speeds.

---

## 💎 9. Monetization Philosophy & Free-to-Play Balance

Crownspire operates under a **"Fast-Slowing-Soft" Monetization Curve**. This prevents pay-to-win backlash while giving paying users highly valued convenience skips.

### Free-To-Play Integrity
1.  **100% Farmable Upgrades:** Upgrading levels only requires Gold and Dust, which are 100% grindable on the world map via active PvE farming. Raw level power cannot be purchased directly with real money.
2.  **No Core Stat Destruction:** Even if a breakthrough fails, the rare fragments are refunded. Every F2P player can guarantee a 5★ Crownmark over time through patience and the +15% pity factor.
3.  **Dismantling Freedom:** F2P players can safely "melt" useless duplicate epic or legendary items to synthesize exactly the items their primary core lineup requires.

### Premium Monetization Drivers
1.  **Key Packs:** Purchase Tavern Chest Keys to accelerate the rate of initial pulls.
2.  **Breakthrough Materials (Celestial Shards / Crystals):** Spenders can purchase weekly limited bundles containing Fire Crystals, bypassing the need to wait for bi-weekly guild territory rewards.
3.  **Cosmic Shader Skins:** Premium-only visual effects, weapon trails, and glowing neon runes that offer high bragging rights without inflating core game balance.

---

## 🔄 10. Long-Term Retention & Live-Ops Integration

A successful progression system must keep players engaged across several years. Crownspire achieves this via structured horizontal expansion:

1.  **Seasonal Artifact Swaps:** At the start of a new Arena Season (every 90 days), 3 new Signature Crownmarks are introduced into the pool. This resets the "best-in-slot" theorycrafting without invalidating the value of previous items.
2.  **Horizontal Affinity Transference:** A special seasonal consumable called the "Affinity Flask" allows players to swap the signature hero assigned to a Crownmark for 30 days, opening up wacky and creative squad configurations for competitive league matchdays.
3.  **Godot 4 Shader Prestige:** High-tier players gain custom material skins and special troop-marching trail shaders which declare their sovereign status across coordinates to all surrounding castle keeps, amplifying player identity and status.

---

### GDD Conclusion & System Status
The Crownmark progression system effectively bridges the gap between active casual play (farming micro-materials) and high-level competitive investment (set collections, breakthrough coordination). All values are locked for balance simulation inside the in-game developer sandbox.

**Approved by:** Lead Systems Designer, Crownspire  
**Date:** June 26, 2026
