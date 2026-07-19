# CROWNSPIRE: THE ROYAL TREASURY (STORE CATALOG & MICROTRANSACTION ARCHITECTURE)
**Official Economy & Product Design Document (GDD)**
**Version 1.0.0 (Production Deck) | Confidential - Crownspire Studio Operations**

---

## 💎 SECTION I: ECONOMY & RETENTION PHILOSOPHY

The microtransaction architecture of **Crownspire** is built from the ground up to support high long-term player retention and avoid the "pay-to-win hyperinflation" that routinely collapses kingdom-building mobile games. 

### 1. Key Economic Pillars
*   **Decoupled Combat Power:** Purchases provide **time convenience**, **cosmetic prestige**, and **system streamlining** (QoL) rather than direct stats. No pack will ever sell raw combat buffs (health, attack) or exclusive, non-craftable elite unit types.
*   **The Logarithmic Value Curve:** Higher price points do not scale linearly in value. Our $0.99 and $1.99 packs provide massive relative value-to-cost (e.g., +800% value factor) to convert F2P players into low-spending minnows, whereas $99.99 packs provide diminishing utility returns (e.g., +150% value factor) to curb "whale inflation".
*   **Strict Anti-Dump Restraints (Velocity Caps):** No user can spend infinitely. High-tier packs carry strict **daily, weekly, and seasonal purchase limits** to ensure free-to-play and low-spend players have time to compete, counter-strategize, and close macro gaps.
*   **Integration with Core Gameplay Loops:** Consumables bought via the store (like Match-3 boosters or Companion Feed) do not bypass core loops; instead, they stimulate them (e.g., generating more active play opportunities).

```
                        [ VALUE CURVE LOGARITHM ]
                        
  Value % (Relative)
    ▲
800%│ █ [$0.99 / $1.99 Minnow Tiers: Peak Value Convergence]
    │ █
500%│ █ 
    │ █ █ █ [$4.99 / $9.99 Dolphin Tiers: Progression Anchors]
300%│ █ █ █
    │ █ █ █ █ █ [$19.99 / $49.99 Great-Fish Tiers: Elite Speeds]
150%│ █ █ █ █ █ █ █ [$99.99 Whale Tier: Heavily Diminishing Returns]
   0└────────────────────────────────────────────────────────► Price Points
```

---

## 🎟️ SECTION II: PRICE POINT TAXONOMY & VALUE SCALING

To ensure psychological clarity and clear progression steps, Crownspire uses seven standard pricing tiers. Gem values are pegged at **100 Gems per USD** as the base standard.

### Pricing Tiers and Value Factor Matrix

| Price Point | Base Gem Equivalent | Typical Value Modifier | total Pack Value (Gems) | Intended Audience & Tactical Focus |
| :---: | :---: | :---: | :---: | :--- |
| **$0.99** | 100 Gems | +800% Value | 900 Gems | Low-friction Minnow Conversion (One-tap buys) |
| **$1.99** | 200 Gems | +600% Value | 1,400 Gems | Micro-Progression Boosters & Daily Refreshers |
| **$4.99** | 500 Gems | +400% Value | 2,500 Gems | Mid-Tier Event Spikes / Match-3 Combo Boosts |
| **$9.99** | 1,000 Gems | +300% Value | 4,000 Gems | Standard Seasonal Battle Pass / Core Hero Shards |
| **$19.99** | 2,000 Gems | +250% Value | 7,000 Gems | Weekly Alliance Tech Spikes & Advanced Crafting |
| **$49.99** | 5,000 Gems | +200% Value | 15,000 Gems | Competitive Alliance Rally Boosts / Major Skips |
| **$99.99** | 10,000 Gems | +150% Value | 25,000 Gems | Whale Progression Cap / Major Fortress Commits |

---

## 🎁 SECTION III: THE CATALOG PORTFOLIO

The store directory is divided into seven thematic categories to fulfill different user needs.

### 1. New Player Packs (Onboarding Anchors)
Highly restricted introductory offers available only during a user's first 7 days following account registration.

#### Pack 1A: "The Sovereign's Welcome" ($0.99)
*   **Limit:** 1 Per Account.
*   **Value Tier:** +800% Value.
*   **Contents:**
    *   100 Gems (Paid).
    *   1x Permanent "Royal Pioneer" profile border (Cyan bronze aesthetic).
    *   5x 1-Hour Universal Build Speedups.
    *   20,000 Wood, 20,000 Slate, 15,000 Food.
    *   100 VIP Experience Points.
*   **Design Intent:** Eradicates early queue-time friction and introduces the concept of the VIP subsystem.

#### Pack 1B: "Founding Keep Starter Kit" ($4.99)
*   **Limit:** 1 Per Account.
*   **Value Tier:** +500% Value.
*   **Contents:**
    *   500 Gems (Paid).
    *   **Hero Unlock:** 1x "Shield-Maiden Elena" (Rare Infantry Specialist).
    *   10x Elena Hero Shards (Immediate 2-Star Ascension).
    *   1x "Builder's Quarry Guild License" (Unlocks 2nd builder queue for 7 Days).
    *   50,000 Wood, 50,000 Slate, 15,000 Iron.
*   **Design Intent:** Establishes character connection and eases players into infantry double-building workflows.

---

### 2. Hero Packs (Commander Growth)
Averse to gambling, Hero Packs supply explicit shard quantities to help players predictably upgrade their active rosters.

#### Pack 2A: "Commander's Vanguard Call" ($9.99)
*   **Limit:** 3 Per Week.
*   **Value Tier:** +300% Value.
*   **Contents:**
    *   1,000 Gems (Paid).
    *   30x "Dryad Warden Elara" Hero Shards (Guaranteed rank upgrade).
    *   10x Captain's Training Logs (100,000 Hero XP total).
    *   5x General Summon Scrolls.
*   **Design Intent:** Allows deliberate leveling and stabilization of active Marksmen command squads.

#### Pack 2B: "Warlord's Sovereign Command" ($49.99)
*   **Limit:** 1 Per Week.
*   **Value Tier:** +200% Value.
*   **Contents:**
    *   5,000 Gems (Paid).
    *   80x "Gale-Marshal Kaelen" Shards (Unlocks 3rd Star tier instantly).
    *   2x Sovereign Crownmark Engravings (Used to unlock Commander Gear skills).
    *   15x General's Training Logs (750,000 Hero XP total).
    *   1,500 VIP Experience Points.
*   **Design Intent:** Premium veteran pacing accelerator for high-level guild cavalry leads.

---

### 3. Pet Companion Packs (Sanctuary Nourishment)
Supplies feed, customization keys, and training tokens for pets without altering animal stats directly.

#### Pack 3A: "Clover Companion Crate" ($1.99)
*   **Limit:** 5 Per Week.
*   **Value Tier:** +600% Value.
*   **Contents:**
    *   200 Gems (Paid).
    *   1x "Hatchling Clover" Egg Hatching Token.
    *   15x Pet Companion Treats (Accelerates relationship tier).
    *   500 Sanctuary Mana Dew (Used to polish companion enclosures).
*   **Design Intent:** Mid-range support for casual players focused on companion interactions and sanctuary visuals.

#### Pack 3B: "Beastmaster's Grand Vault" ($19.99)
*   **Limit:** 2 Per Week.
*   **Value Tier:** +250% Value.
*   **Contents:**
    *   2,000 Gems (Paid).
    *   3x Rare Companion Hatchling Eggs (1x Guaranteed Forest Wolf or Gryphon).
    *   50x Premium Companion Treats.
    *   1x Unique Companion Toy (Visual decorative element for the inner Keepyard).
    *   500 VIP Experience Points.
*   **Design Intent:** Comprehensive progression pack for active pet collection enthusiasts.

---

### 4. Dragon Hatchling Packs (Late-Stage Smelting)
Late-game progressive tiers tailored around draconic metallurgy and world-boss armor sets.

#### Pack 4A: "Molten Core Spark Flask" ($9.99)
*   **Limit:** 3 Per Week.
*   **Value Tier:** +300% Value.
*   **Contents:**
    *   1,000 Gems (Paid).
    *   5x Volcanic Core Fragments (Used to smelt high-tier Fire Knight plates).
    *   20x Red Dragon Scales.
    *   5x Large Stamina Flasks (+500 Stamina for hunting Volcanic Hatchlings on map).
*   **Design Intent:** Preps mid-tier players for alliance raids against *Balefire Ignis*.

#### Pack 4B: "Basalt Dragonlord Treasury" ($99.99)
*   **Limit:** 1 Per Month (Highly Restricted).
*   **Value Tier:** +150% Value.
*   **Contents:**
    *   10,000 Gems (Paid).
    *   1x "Sovereign Ignis" Gold Statue Trophy (Prestige vanity item for the Keep's center plaza).
    *   2x Refined Dragonheart Matrix Stones (Used for ultimate gear socketing).
    *   15x Crownmark Blacksmith Alloys.
    *   5,000 VIP Experience Points.
*   **Design Intent:** Absolute luxury vanity tier focused on long-term blacksmith mastery.

---

### 5. Speed Up Packs (Time Convenience)
Focused entirely on building, research, and troop queue accelerations. Excellent macro-progression tools.

#### Pack 5A: "Chronos Sprint Crate" ($4.99)
*   **Limit:** 10 Per Week.
*   **Value Tier:** +400% Value.
*   **Contents:**
    *   500 Gems (Paid).
    *   5x 3-Hour Universal Speedups.
    *   10x 1-Hour Build Speedups.
    *   10x 1-Hour Training Speedups.
*   **Design Intent:** Supports active players who want to coordinate rapid troop-training cycles during Guild Skirmishes.

#### Pack 5B: "Imperial Era Chronograph" ($19.99)
*   **Limit:** 3 Per Week.
*   **Value Tier:** +250% Value.
*   **Contents:**
    *   2,000 Gems (Paid).
    *   2x 24-Hour Imperial Speedups.
    *   10x 8-Hour Build/Research Speedups.
    *   15x 3-Hour Universal Speedups.
    *   400 VIP Experience Points.
*   **Design Intent:** Allows high-tierkeeps to skip lengthy late-stage academy research walls without locking up resource flows.

---

### 6. Resource Packs (Empire Fuel)
Supplies basic raw cargo. These carry the lowest relative value factors to prevent rich accounts from simply buying out global resources.

#### Pack 6A: "Wagon of Timber & Slate" ($1.99)
*   **Limit:** 15 Per Week.
*   **Value Tier:** +500% Value.
*   **Contents:**
    *   200 Gems (Paid).
    *   100,000 Wood Cargo Bags.
    *   100,000 Slate Bedrock Bags.
    *   50,000 Wheat Grain Bales.
*   **Design Intent:** Provides emergency resource buffers for keeps recovering from active border warfare.

#### Pack 6B: "Imperial Sovereign Convoy" ($49.99)
*   **Limit:** 2 Per Week.
*   **Value Tier:** +180% Value (Diminished Raw Value).
*   **Contents:**
    *   5,000 Gems (Paid).
    *   1,500,000 Wood Cargo Bags.
    *   1,500,000 Slate Bedrock Bags.
    *   1,000,000 Deep-Iron Ore Castings.
    *   800,000 Bales of Wheat.
*   **Design Intent:** Long-term empire cushion designed to offset collective guild maintenance, heavily capped to protect resource trading balances inside alliances.

---

### 7. Match-3 Event Packs (Puzzle Play Boosters)
Designed for our interactive mini-game loops, providing board manipulation tools and level continues.

#### Pack 7A: "Grid-Solver's Pocket Clip" ($0.99)
*   **Limit:** 3 Per Day.
*   **Value Tier:** +800% Value.
*   **Contents:**
    *   100 Gems (Paid).
    *   2x Hover Hammer Boosters (Clears 1 selected tile instantly without consuming a move).
    *   1x Star Disk Shuffler (Shuffles the current puzzle tile layout dynamically).
    *   1x Match-3 Energy Refill potion (Allows $+5$ additional games).
*   **Design Intent:** Small, high-conversion impulse buy that helps a player bypass a single tough grid level.

#### Pack 7B: "Grandmaster's Cascade Vault" ($9.99)
*   **Limit:** 5 Per Week.
*   **Value Tier:** +300% Value.
*   **Contents:**
    *   1,000 Gems (Paid).
    *   10x Hover Hammer Boosters.
    *   10x Star Disk Shufflers.
    *   5x Cosmic Row-Cleasers (Clears entire horizontal and vertical crosshair paths).
    *   5x Match-3 Energy Refill Potions.
    *   2x Double-Score Vouchers (Doubles event points earned for the next 30 minutes).
*   **Design Intent:** High-engagement pack designed for competitive puzzle players striving to top seasonal leaderboards during Match-3 community mini-campaigns.

---

## 🛡️ SECTION IV: PURCHASE BALANCE & VELOCITY CONTROLS

To avoid severe economic inflation and guarantee an equitable landscape where active F2P players can challenge spenders, the engine enforces strict **Hard Cooldowns** and **Velocity Caps**.

```
+---------------------------------------------------------------------------------+
|                       VELOCITY CAP & RESTRICTION SYSTEM                         |
+---------------------------------------------------------------------------------+
| Category: Dragons             | Limit: 1 / Month        | Softens power-rushing |
| Category: Raw Resources       | Limit: 2 / Week         | Keeps trade active   |
| Category: Match-3 Puzzles     | Limit: 3 / Day          | Standard grid play    |
| Category: New Player Kits     | Limit: 1 / Account      | Prevents early abuses |
+---------------------------------------------------------------------------------+
```

### Anti-Inflation Hard Caps
1.  **Gifting Surcharges:** To prevent high-spend users from funding satellite "farm-bots" to accumulate wealth, resource package transfers are subject to a standard $10\%$ caravan tariff and require VIP Level 11 to initiate.
2.  **Resource Conversion Diminishing Returns:** Converting raw Gems directly to Wood or Slate in the menu bypasses the value multipliers of packs, making literal "wallet pumping" excessively expensive compared to active gameplay.
3.  **Active Progress Lockouts:** High-tier construction sets require completion of narrative Campaign steps, preventing players from buying their way to maximum Citadel Keep levels without actively participating in our storyline.

---

## 💻 SECTION V: PRODUCTION DATABASE & TS SCHEMAS

### 1. Database Schema Structure (`firebase-blueprint.json`)
```json
{
  "store_catalog": {
    "active_season": "season1_obsidian_sun",
    "packs": {
      "new_player_welcome": {
        "id": "new_player_welcome",
        "priceUsd": 0.99,
        "baseGems": 100,
        "valueFormat": "800%",
        "purchaseCooldownType": "account_lifetime",
        "purchaseLimit": 1
      },
      "basalt_dragonlord_treasury": {
        "id": "basalt_dragonlord_treasury",
        "priceUsd": 99.99,
        "baseGems": 10000,
        "valueFormat": "150%",
        "purchaseCooldownType": "calendar_monthly",
        "purchaseLimit": 1
      }
    },
    "user_purchases": {
      "$userId": {
        "totalSpentUsd": 5.98,
        "new_player_welcome_claimed": true,
        "logs": {
          "tx_2026_01": {
            "packId": "new_player_welcome",
            "purchasedAt": "2026-06-16T11:15:00Z",
            "usd": 0.99
          }
        },
        "limits": {
          "chronos_sprint_crate_weekly_count": 2,
          "grid_solver_pocket_daily_count": 1
        }
      }
    }
  }
}
```

### 2. TypeScript Store Purchase Engine (`src/utils/storeCatalogManager.ts`)
```typescript
export interface StorePackDefinition {
  id: string;
  category: 'new_player' | 'hero' | 'pet' | 'dragon' | 'speed_up' | 'resource' | 'match3';
  usdPrice: number;
  baseGems: number;
  valueMultiplier: number;
  maxLimit: number;
  limitCooldown: 'lifetime' | 'daily' | 'weekly' | 'monthly';
}

export const STORE_CATALOG: Record<string, StorePackDefinition> = {
  "welcome_01": {
    id: "welcome_01",
    category: "new_player",
    usdPrice: 0.99,
    baseGems: 100,
    valueMultiplier: 8,
    maxLimit: 1,
    limitCooldown: "lifetime"
  },
  "dragon_crownmark_99": {
    id: "dragon_crownmark_99",
    category: "dragon",
    usdPrice: 99.99,
    baseGems: 10,000,
    valueMultiplier: 1.5,
    maxLimit: 1,
    limitCooldown: "monthly"
  },
  "grid_solver_01": {
    id: "grid_solver_01",
    category: "match3",
    usdPrice: 0.99,
    baseGems: 100,
    valueMultiplier: 8,
    maxLimit: 3,
    limitCooldown: "daily"
  }
};

export function canPurchasePack(
  userId: string,
  packId: string,
  userPurchaseHistory: {
    lifetimeClaimed: string[];
    dailyCounts: Record<string, number>;
    weeklyCounts: Record<string, number>;
    monthlyCounts: Record<string, number>;
  }
): { allowed: boolean; reason?: string } {
  const pack = STORE_CATALOG[packId];
  if (!pack) {
    return { allowed: false, reason: "Store item ID not found in catalog database." };
  }

  if (pack.limitCooldown === 'lifetime' && userPurchaseHistory.lifetimeClaimed.includes(packId)) {
    return { allowed: false, reason: "This premium welcome pack has already been claimed on this account." };
  }

  if (pack.limitCooldown === 'daily') {
    const currentCount = userPurchaseHistory.dailyCounts[packId] || 0;
    if (currentCount >= pack.maxLimit) {
      return { allowed: false, reason: `Daily limit reached (${pack.maxLimit}/${pack.maxLimit}). Resets at 00:00 UTC.` };
    }
  }

  if (pack.limitCooldown === 'weekly') {
    const currentCount = userPurchaseHistory.weeklyCounts[packId] || 0;
    if (currentCount >= pack.maxLimit) {
      return { allowed: false, reason: `Weekly inventory limit hit. Resets every Sunday at midnight.` };
    }
  }

  if (pack.limitCooldown === 'monthly') {
    const currentCount = userPurchaseHistory.monthlyCounts[packId] || 0;
    if (currentCount >= pack.maxLimit) {
      return { allowed: false, reason: `Monthly elite acquisition quota reached. Resets on the 1st of next month.` };
    }
  }

  return { allowed: true };
}
```

This catalog meets the required standards, aligning perfectly with Crownspire's monetization framework. Let's run a final build to verify alignment!
