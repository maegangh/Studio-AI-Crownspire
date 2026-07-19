# CROWNSPIRE: THE ASTRAL RELIQUARY HERO SYSTEM BIBLE
**Complete Hero Integration Specifications, Grid Interactions, Special Tile Behaviors, and Team Synergies**
**Version:** 1.0.0 (Master Release)  
**Target Quality Tier:** Premium AAA Mobile Strategy (*Whiteout Survival*, *Call of Dragons*, *Puzzles & Chaos*)

---

## 🏛️ SECTION I: THE HERO-GRID INTERACTIVE FRAMEWORK

In **Crownspire: The Astral Reliquary**, Heroes are not merely passive combat stats or flat portraits framing the screen. They are deeply integrated into the triple-match Mahjong puzzle board itself. Every decision regarding team composition directly alters the physical layout, tile distribution, mana dynamics, and mechanical rules of the active puzzle.

```
                      [ THE HERO-GRID CYCLE OF POWER ]

     +------------------+      Taps & Matches      +------------------+
     |   MAHJONG GRID   | -----------------------> |    HERO SQUAD    |
     | - Active Tiles   |                          | - Charges Mana   |
     | - Blockers & Ice | <----------------------- | - Triggers Buffs |
     +------------------+     Active Ult Skills    +------------------+
```

### 1. The Interaction Vectors
A Hero’s interaction with the puzzle is structured around four physical vectors:
1.  **Passive Board Manipulation (Pre-Match):** Alters the start state of the board (e.g., expanding the Altar Tray capacity, highlighting matches, or dissolving starter obstacles).
2.  **Mana Collection (Active Play):** Matching tiles corresponding to a Hero's elemental affinity extracts **Aether Sparks** to charge their active skill.
3.  **Active Grid Modification (Ultimate Skills):** Executing an ultimate physically reshapes the board (e.g., shuffling tiles, shattering blockers, converting tile elements, or creating wild-cards).
4.  **Tactical Synergy Links (Combos):** Equipping heroes of complementary elements triggers dual-passive multipliers and chain-reaction matches.

---

## 🎴 SECTION II: ELEMENTAL SPECIAL TILE BEHAVIOR

Heroes manipulate the puzzle board primarily by spawning **Special Tiles**. When a hero's ability activates, standard marble tiles are converted into high-intensity magical units. These special tiles behave according to strict physics rules:

```
[ SPECIAL TILE ANATOMY ]

(1) Elemental Prism (Wild-card)   (2) Celestial Bomb (AoE Clear)
       /¯¯¯¯¯¯¯¯¯¯¯¯¯¯\                   /¯¯¯¯¯¯¯¯¯¯¯¯¯¯\
      /  /           \  \                /  /    _/\_    \  \
     |  |   [PRISM]   |  |              |  |    (BOMB)    |  |
      \  \           /  /                \  \    ¯\/¯    /  /
       \______________/                   \______________/
     [Glows multi-color,                [Features fuse animation,
      matches any adjacent]              shatters 3x3 grid adjacent]
```

### 1. Elemental Prisms (The Multi-Match Wild-Card)
*   *How it Spawns:* Created by high-tier Light and Void hero passives.
*   *Grid Behavior:* The Prism tile does not possess a fixed Relic ID. Instead, it acts as a dynamic wild-card. When placed in the Altar Tray, it automatically adapts its ID to match the majority Relic ID currently in the tray.
*   *Example:* If the tray holds `[A, A, Prism]`, the Prism instantly converts to ID `A`, triggering an immediate match-three and freeing up all three slots.

### 2. Celestial Bomb Tiles (The Row/Column Clearer)
*   *How it Spawns:* Spawned by heavy physical and Fire heroes (e.g., *Ignis*).
*   *Grid Behavior:* A beveled golden bomb tile with a burning fuse. It cannot be collected or sent to the tray.
*   *Activation Rule:* Completing any match-three chain *adjacent* to the bomb detonates it, instantly vaporizing a $3 \times 3$ grid of tiles surrounding it (regardless of whether those tiles are locked or covered on lower layers).

### 3. Chronos Sandglasses (Moves/Timer Booster)
*   *How it Spawns:* Spawned by rare Time and Light affinity heroes during advanced trials.
*   *Grid Behavior:* A physical hourglass carved from white marble, glowing with a soft gold outline.
*   *Activation Rule:* Tapping this tile does not place it in the tray. It is consumed instantly, granting $+3 \text{ extra moves}$ (in move-limited stages) or $+10 \text{ seconds}$ (in Time Attack modes).

### 4. Elemental Links (The Element Convertor)
*   *How it Spawns:* Created by high-synergy teams (e.g., running two Fire Heroes).
*   *Grid Behavior:* Displays a glowing chain connecting 3 or more scattered tiles of different elements.
*   *Activation Rule:* Tapping any single linked tile instantly converts all other linked tiles to match its elemental affinity, setting up a massive, multi-tiered combo cascade.

---

## 👤 SECTION III: SIGNATURE HERO SPECIFICATION MATRIX

Here, we define eight legendary heroes designed from the ground up to integrate perfectly with the triple-match Mahjong system.

---

### HERO 1: IGNIS, THE INFERNO LORD (LEGENDARY FIRE HERO)

```
=============================================================
                  IGNIS, THE INFERNO LORD
=============================================================
[ PASSIVE ] "Ember Eyes"
- Highlights all playable Fire tiles with glowing lava cracks.
- Fire match damage increases by 15%.

[ ULTIMATE ] "Inferno Blast" (Cost: 100 Fire Mana)
- Triggers a full-screen shockwave.
- Instantly melts up to 3 Ice Blockers on the active board.
- Spawns 1 [Celestial Bomb Tile] on the top layer.
=============================================================
```

#### 1. Passive: Ember Eyes
*   *Visuals:* Fire-affinity relic tiles (Ruby Phoenixes) glow with deep red lava veins.
*   *Mechanic:* Highlights matching active Fire tiles. If three matching Fire tiles are playable, they softly pulse in unison, reducing cognitive fatigue and speeding up play.

#### 2. Ultimate: Inferno Blast
*   *Visuals:* Ignis swings his massive war hammer. The screen shakes as a wave of flame ripples across the puzzle board from bottom to top.
*   *Mechanics:* Instantly destroys up to 3 ice blockers, freeing frozen tiles below. Spawns one Celestial Bomb on the top layer.

#### 3. Special Arena & Boss Modifiers
*   *Arena:* Dealing damage via Fire matches applies a "Burn" debuff to the target enemy, dealing $5\%$ damage of Ignis's attack stat every turn for 3 turns.
*   *Boss Trials:* Inferno Blast deals $+100\%$ extra damage if the boss is in a Staggered state.

---

### HERO 2: SARIEL, THE CRYSTAL SENTINEL (LEGENDARY FROST HERO)

```
=============================================================
                  SARIEL, THE CRYSTAL SENTINEL
=============================================================
[ PASSIVE ] "Glacial Mirror"
- Reduces the moves countdown of Bosses by slowing time.
- Standard match-threes grant a shield absorbing 5% Max HP.

[ ULTIMATE ] "Glacial Shield" (Cost: 100 Frost Mana)
- Freezes the active board.
- Blocks the enemy team from attacking or regenerating mana for 1 turn.
- Spawns 2 [Frost Shields] over the two lowest-health allies.
=============================================================
```

#### 1. Passive: Glacial Mirror
*   *Visuals:* Cool, blue hexagonal snowflake rings pulse outward from the Altar Tray whenever a match is completed.
*   *Mechanic:* Standard matches generate a frost barrier around your squad's HP bar, absorbing damage equal to $5\%$ of Sariel's max HP (stacks up to $25\%$).

#### 2. Ultimate: Glacial Shield
*   *Visuals:* Sariel raises his ice staff. A layer of frost covers the screen margins, accompanied by the sound of cracking glaciers.
*   *Mechanics:* Temporarily freezes the game loop. The boss's attack countdown is paused for 1 round of player turns, granting safe moves to set up combos.

#### 3. Special Arena & Boss Modifiers
*   *Arena:* Frost matches deplete the target enemy's mana pool by $15\%$, delaying their ultimate abilities.
*   *Boss Trials:* While the boss is frozen by Sariel's shield, any tile matched deals double physical shatter damage.

---

### HERO 3: GARRICK, THE STONEGUARD (EPIC NATURE HERO)

```
=============================================================
                  GARRICK, THE STONEGUARD
=============================================================
[ PASSIVE ] "Altar Expander"
- Physically expands the bottom Altar Tray to 8 slots.
- Reduces the failure risk of dense monolith levels.

[ ULTIMATE ] "Stone Fortress" (Cost: 90 Nature Mana)
- Pulls up to 2 Stone Blockers from the grid and shatters them.
- Restores 15% Max HP to all party members.
=============================================================
```

#### 1. Passive: Altar Expander
*   *Visuals:* The physical Altar Tray at the bottom of the screen expands outward, adding a detailed 8th slot framed in carved oak roots.
*   *Mechanic:* Increases the tray capacity from 7 to 8 slots permanently while Garrick is in the squad. This drastically lowers the risk of overflowing the tray in complex levels.

#### 2. Ultimate: Stone Fortress
*   *Visuals:* Massive stone pillars rise from the bottom of the screen, crushing target blocks and sending dust particles flying.
*   *Mechanics:* Target blocker destruction. Garrick selects up to 2 unclickable Stone Blockers on the grid, shatters them instantly, and heals the party for $15\%$ of their max HP.

#### 3. Special Arena & Boss Modifiers
*   *Arena:* Garrick absorbs $10\%$ of all damage dealt to his teammates, redirecting it to his high-armor health pool.
*   *Boss Trials:* Stone Fortress instantly cleanses any "Void Corruptions" cast by the boss, turning corrupted tiles back into playable, healthy relics.

---

### HERO 4: ELYSIA, THE WINDRUNNER (EPIC LIGHT HERO)

```
=============================================================
                  ELYSIA, THE WINDRUNNER
=============================================================
[ PASSIVE ] "Auric Highlight"
- Highlights matching tiles that are covered by only one layer.
- Increases tile fly-down velocity by 20% (Tactile feel).

[ ULTIMATE ] "Aether Shuffle" (Cost: 80 Light Mana)
- Shuffles the active board without consuming inventory items.
- Spawns 1 [Elemental Prism (Wild-card)] on the top layer.
=============================================================
```

#### 1. Passive: Auric Highlight
*   *Visuals:* Semi-obscured matching tiles on Layer 1 shine with a faint golden halo, visible through the transparency of the Layer 2 tiles covering them.
*   *Mechanic:* Provides foresight, showing the player which tiles are immediately available once the top layer is cleared.

#### 2. Ultimate: Aether Shuffle
*   *Visuals:* Elysia spins in a whirlwind of green leaves and golden light. The tiles on the board detach, rotate in a circular storm, and land in new positions.
*   *Mechanics:* Shuffles the board to resolve deadlocks while placing an Elemental Prism (Wild-card) on the top layer to guarantee a match.

#### 3. Special Arena & Boss Modifiers
*   *Arena:* Elysia increases the squad's dodge chance by $10\%$, allowing allies to completely evade incoming enemy ultimate attacks.
*   *Boss Trials:* Every combo match of 3x or higher triggers a gale attack from Elysia, dealing flat armor-piercing damage directly to the boss.

---

### HERO 5: MALAKOR, THE VOID REAPER (LEGENDARY VOID HERO)

```
=============================================================
                  MALAKOR, THE VOID REAPER
=============================================================
[ PASSIVE ] "Nebula Vacuum"
- Void matches charge ALL heroes' mana bars by an extra 10%.
- Enemies take 15% increased damage from all matches.

[ ULTIMATE ] "Event Horizon" (Cost: 110 Void Mana)
- Instantly consumes up to 3 non-matching tiles from the tray.
- Fires a piercing black laser beam at the enemy squad.
- Deals massive single-target damage (250% of Attack).
=============================================================
```

#### 1. Passive: Nebula Vacuum
*   *Visuals:* Swirling purple cosmic vortexes open behind matched Void tiles, drawing starlight particles inward.
*   *Mechanic:* Converts the typeless Void match damage into a catalyst that charges the mana of all equipped heroes, speeding up skill rotations.

#### 2. Ultimate: Event Horizon
*   *Visuals:* A miniature black hole opens at the center of the Altar Tray, sucking up target tiles before firing a high-intensity violet laser beam at the enemy team.
*   *Mechanics:* Board rescue and damage. Cleanses up to 3 non-matching tiles currently taking up space in your tray, and converts them into massive single-target damage.

#### 3. Special Arena & Boss Modifiers
*   *Arena:* If Malakor defeats an enemy, his passive instantly refills his mana pool by $50\%$.
*   *Boss Trials:* Event Horizon deals $+200\%$ damage if the boss is preparing a heavy rage attack, staggering them instantly.

---

### HERO 6: LYSANDRA, THE SUN ORACLE (EPIC LIGHT HERO)

```
=============================================================
                  LYSANDRA, THE SUN ORACLE
=============================================================
[ PASSIVE ] "Solar Radiance"
- Light matches restore 5% of party health.
- Reveals all hidden tiles on Layer 0 at the start of the match.

[ ULTIMATE ] "Daybreak" (Cost: 95 Light Mana)
- Instantly matches and shatters any selected active pair.
- Cleanses all poison and burn debuffs from allies.
=============================================================
```

#### 1. Passive: Solar Radiance
*   *Visuals:* Warm, golden sunbeams sweep across the board, illuminating the lower layers.
*   *Mechanic:* Dissolves the "Fog of the Abyss" on hidden tiles instantly, keeping the entire board skeleton visible from the start.

#### 2. Ultimate: Daybreak
*   *Visuals:* A bright beam of sunlight pierces down from the heavens, striking the board and dissolving two selected tiles in a shower of golden stardust.
*   *Mechanics:* Force-pair shatter. If the player has two matching tiles in the tray but the third is locked deep in the layout, Daybreak instantly matches and shatters the pair, clearing them from the tray.

#### 3. Special Arena & Boss Modifiers
*   *Arena:* Ultimate attacks from Lysandra apply a "Blind" debuff to enemies, causing their next attack to have a $50\%$ chance to miss.
*   *Boss Trials:* Daybreak shatters the boss's shields, exposing their weak points instantly.

---

### HERO 7: TARKAN, THE STEELBREAKER (RARE PHYSICAL HERO)

```
=============================================================
                  TARKAN, THE STEELBREAKER
=============================================================
[ PASSIVE ] "Heavy Striker"
- Normal matches deal 10% increased base physical damage.
- Increases the critical strike chance of all matches by 15%.

[ ULTIMATE ] "Shield Breaker" (Cost: 85 Mana)
- Instantly shatters 1 Stone Blocker.
- Deals moderate physical damage to the primary target.
=============================================================
```

#### 1. Passive: Heavy Striker
*   *Visuals:* Heavy metallic sparks fly outward from matching tiles, accompanied by a deep, resonant clang.
*   *Mechanic:* Boosts raw match damage, making Tarkan highly effective in early-game campaigns.

#### 2. Ultimate: Shield Breaker
*   *Visuals:* Tarkan lunges forward, smashing his steel shield into the board.
*   *Mechanics:* A simple, low-cost utility skill that shatters a targeted stone blocker and deals direct physical damage to the enemy.

---

### HERO 8: VALERIA, THE WINDSOARER (RARE NATURE HERO)

```
=============================================================
                  VALERIA, THE WINDSOARER
=============================================================
[ PASSIVE ] "Zephyr Breeze"
- Increases match combo timer duration by 1.0 second.
- Helps players maintain high combo chains.

[ ULTIMATE ] "Tailwind" (Cost: 75 Mana)
- Restores 10 Sanctum Stamina upon a successful victory.
- Spawns 1 [Chronos Sandglass] on the active board.
=============================================================
```

#### 1. Passive: Zephyr Breeze
*   *Visuals:* Soft green wind trails swirl around the combo counter on the UI.
*   *Mechanic:* Extends the combo window from $2.5\text{s}$ to $3.5\text{s}$, making it much easier to sustain high multipliers and deal maximum damage.

#### 2. Ultimate: Tailwind
*   *Visuals:* Feathers drift across the screen as Valeria plays a soaring flight animation.
*   *Mechanics:* Pacing accelerator. Spawns an hourglass tile to add moves to the board, and rewards the player with bonus stamina upon clearing the level.

---

## 🔗 SECTION IV: TEAM SYNERGY & COMBO SYSTEMS

To encourage deep tactical planning, equipping specific hero combinations unlocks **Synergy Links** that grant powerful passive bonuses:

```
+-------------------------------------------------------------+
|                 [ TEAM SYNERGY OPTIONS ]                    |
|                                                             |
|   (FIRE + LIGHT) -> "SOLAR FLARE"                           |
|   - Fire matches trigger a light blast dealing AoE damage.  |
|                                                             |
|   (FROST + NATURE) -> "FROST GROWTH"                        |
|   - Nature healing skills freeze enemy mana for 1 turn.     |
|                                                             |
|   (TRIPLE ELEMENT MATCH) -> "ELEMENTAL HARMONY"             |
|   - Increases global match damage by 20%.                   |
+-------------------------------------------------------------+
```

### 1. Dual-Element Synergies

#### Solar Flare (Fire + Light)
*   *Trigger:* Equip at least 1 Fire Hero and 1 Light Hero.
*   *Effect:* Completing a Fire match-three triggers a localized solar blast, dealing $25\%$ splash damage to adjacent enemies and melting nearby Frozen Blockers on the grid.

#### Deep Freeze (Frost + Void)
*   *Trigger:* Equip at least 1 Frost Hero and 1 Void Hero.
*   *Effect:* Enemies struck by Frost matches have their attack timers delayed by an extra move, giving the player more time to set up match chains.

#### Frost Growth (Frost + Nature)
*   *Trigger:* Equip at least 1 Frost Hero and 1 Nature Hero.
*   *Effect:* Any party healing skill cast by your Nature Hero also grants a frost shield equal to $10\%$ of the heal value to all allies.

### 2. Triple-Element Synergy: Elemental Harmony
*   *Trigger:* Equip three heroes of different elements (e.g., Fire, Frost, Nature).
*   *Effect:* Promotes balanced team building. Grants a permanent $+20\%$ boost to all match-three damage, and increases mana generation rates by $+15\%$ across all elements.

---
*End of Hero System Bible.*  
*Ready for integration into active development phases and character asset sheets.*
