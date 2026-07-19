# CROWNSPIRE EVENT BIBLE: BATCH 1 (EVENTS 1-10)
## Version 1.0.0 (Master Live Operations Charter)
### Authored by: Senior Live Ops Directorate, Crownspire Studios

This document serves as the definitive structural specification for Live Operations events within **Crownspire**. Every event listed below is detailed to production-grade standards, ensuring that game design, engineering, art, UI/UX, sound, and quality assurance teams can immediately commence development.

---

## 📅 INDEX OF BATCH 1 EVENTS

| # | Event Name | Core Category | Beta Priority | Theme & Primary Goal |
|---|---|---|---|---|
| 1 | **The Stone-Quarry Rush** | Resource Gathering / Daily | Essential for Beta | High-velocity Slate harvesting to speed up early city fortification. |
| 2 | **Wildlands Cleansing** | Wildling Hunt / PvE | Essential for Beta | Coordinated local tactical sweeps of level-appropriate Void Wildlings. |
| 3 | **Sovereign Conquest: Battle for Aethelgard** | Kingdom Conquest / PvP | Essential for Beta | Bi-weekly server-wide siege for control of the central Throne (600,600). |
| 4 | **Void Rift Collapse** | Alliance Cooperative / Dungeon PvE | Recommended After Beta | High-stakes rift sealing requiring coordinated alliance rally formations. |
| 5 | **Star Forge Breakthrough Festival** | Progression / Equipment Upgrading | Essential for Beta | Encourages Crownmark reinforcement with failure pity protections. |
| 6 | **The Crimson Dragon's Awakening** | World Boss / Raid PvE | Recommended After Beta | Massive geographic focal raid requiring tactical spacing and movement. |
| 7 | **Sovereign Keep Festivities** | Construction & Research / Progression | Essential for Beta | Major progression accelerations through kingdom celebration mechanics. |
| 8 | **Legion Muster & Drill** | Troop Training / Weekly Progression | Essential for Beta | Enhances troop composition variety and boosts barracks output. |
| 9 | **The Codex Museum Exhibition** | Collection & Lore / Exploration | Expansion Content | Long-term retention mechanics centered on cataloging legendary Crownmarks. |
| 10| **Capital Border Fort Skirmish** | Alliance PvP / Territory Control | Recommended After Beta | Mid-map checkpoint tug-of-war prior to major capital throne cycles. |

---

## 1. EVENT SPECIFICATION: THE STONE-QUARRY RUSH

### I. Identity, Lore, & Strategic Purpose
*   **Event Name:** The Stone-Quarry Rush
*   **Event Category:** Resource Gathering / Daily Progression
*   **Short Summary:** A kingdom-wide event boosting Slate gathering velocity on the World Map.
*   **Lore:** Deep geologic shifts have triggered a crystal-vein resonance in the southern quarries of Aethelgard. Rich slate deposits have cracked open, allowing Sovereigns to claim vast fortifying building blocks before the corrupting Void corrupts the stone.
*   **Purpose:** Mitigates early-to-mid-game Slate shortages that bottleneck Wall and Keep upgrades. Regulates server Slate velocity.
*   **Player Fantasy:** "Ruler of a booming industrial empire, marshaling mining caravans to reinforce our sovereign borders."
*   **Beta Priority:** Essential for Beta.

### II. Gameplay Mechanics & Progression Loop
*   **Primary Loop:** Marching gathering legions to high-tier Slate Quarries on the world map.
*   **Secondary Loop:** Upgrading resource storage capacity and processing technologies within the city.
*   **Objectives:** Harvest a target quantity of Slate (tracked in cubic units) during the active event window.
*   **Progression Structure:** Standard 3-Tier Milestone progression based on individual gathering milestones.
*   **Difficulty:** Dynamic. Scales based on Player Keep Level (higher Keeps require higher gathering yields to unlock the top milestones).
*   **Duration:** 24 Hours.
*   **Frequency:** Twice weekly (Tuesday and Thursday).

### III. System Requirements & Map Integration
*   **Player Level Requirements:** Keep Level 5+.
*   **Alliance Requirements:** None (Solo event with minor Alliance gathering speed bonuses).
*   **Buildings Used:** Depot (resource protection checks), Research Academy (Gathering Speed techs).
*   **Heroes Used:** Gathering-specialized heroes (e.g., Heroes with the "Industrialist" or "Gatherer" tags).
*   **Troops Used:** Infantry and Cavalry legions (load capacity-based deployment).
*   **Wildlings Used:** Minor world quarry defenders (level 1-5) spawn on pristine nodes; must be cleared before harvesting.
*   **Resources Used:** Food (Wheat) consumed during march deployment; Stamina consumed on combat clearing.
*   **Currencies Used:** Gold Crowns (for march speed-ups), Royal Diamonds (for gathering boosters).

### IV. Economy, Rewards, & Monetization
*   **Reward Structure:** Milestone chests containing Slate Boosters, Construction Speed-ups, and Hero EXP Tomes.
*   **Milestone Values:** 
    *   *Milestone 1 (50,000 Slate):* 5,000 Gold Crowns, 1x 15-Min Construction Speed-Up.
    *   *Milestone 2 (150,000 Slate):* 15,000 Gold Crowns, 3x 15-Min Construction Speed-Up, 1x Common Star Spark.
    *   *Milestone 3 (500,000 Slate):* 50,000 Gold Crowns, 1x 1-Hour Construction Speed-Up, 1x Common Crownmark Chest.
*   **Leaderboards:** Top 100 gatherers on the server.
*   **Ranking Rewards:** 
    *   *Rank 1-3:* 1,500 Royal Diamonds, 10x 1-Hour Speed-Ups, Exclusive "Sovereign Mason" Profile Frame.
    *   *Rank 4-10:* 800 Royal Diamonds, 5x 1-Hour Speed-Ups.
    *   *Rank 11-100:* 200 Royal Diamonds, 2x 1-Hour Speed-Ups.
*   **Catch-Up Mechanics:** Players joining late receive a $+20\%$ gathering speed modifier if their total gathered value is below the server average.
*   **Free-to-Play Balance:** Active F2P players can easily hit Milestone 3 by keeping all deployment marches occupied throughout the day.
*   **Monetization Opportunities:** In-app sale of "Quarry Master Bundles" containing $+50\%$ Gathering Speed scroll buffs and 8-Hour Gathering Shields.

### V. UI, Art, Audio, & Technical Pipeline
*   **UI Layout:** Single-view tab inside the Event Center. Displays a central progress bar resembling a copper resource pipeline.
*   **HUD Changes:** Displays a small hammer-and-pick icon next to the Slate resource ticker in the top Sovereign Bar, with a pulsing green $+25\%$ gather-boost arrow.
*   **Visual Effects:** Dust particles floating upwards around active quarry nodes on the world map. Mining picks emit a subtle amber sparkle on impact.
*   **Audio Assets:** Rhythmic metallic pickaxe strikes on hard granite. Music switches to a low, booming industrial percussion theme when viewing the event window.
*   **Art Assets Required:** Custom event background (a massive, open alabaster quarry illuminated by purple magic crystals), 3D map tile overlay for "Pristine Slate Veins".
*   **Backend Requirements:** Save state tracking total Slate gathered during the event window. Event reset listener to clear gathered values at server reset.
*   **JSON Configuration Structure:**
    ```json
    {
      "event_id": "stone_quarry_rush",
      "milestones": [
        {"target": 50000, "rewards": [{"item": "gold_crowns", "qty": 5000}, {"item": "speedup_construct_15m", "qty": 1}]},
        {"target": 150000, "rewards": [{"item": "gold_crowns", "qty": 15000}, {"item": "speedup_construct_15m", "qty": 3}]},
        {"target": 500000, "rewards": [{"item": "gold_crowns", "qty": 50000}, {"item": "speedup_construct_1h", "qty": 1}]}
      ]
    }
    ```

---

## 2. EVENT SPECIFICATION: WILDLANDS CLEANSING

### I. Identity, Lore, & Strategic Purpose
*   **Event Name:** Wildlands Cleansing
*   **Event Category:** Wildling Hunt / PvE Progression
*   **Short Summary:** Solo and Alliance-wide clearing of level-appropriate Void Wildlings.
*   **Lore:** The corrupting purple mist has mutated the native beasts of the outer valleys. Dominic’s scouts report organized wildling patrols preparing to raid outer farms. Sovereigns must deploy their legions to cleanse the plains.
*   **Purpose:** Drives engagement with the world map PvE combat system. Encourages players to spend idle Stamina and coordinate with Alliance neighbors.
*   **Player Fantasy:** "The righteous hand of statehood, purging chaotic elements from our sovereign domain."
*   **Beta Priority:** Essential for Beta.

### II. Gameplay Mechanics & Progression Loop
*   **Primary Loop:** Locating, marching toward, and defeating level-appropriate Void Wildlings on the World Map.
*   **Secondary Loop:** Leveling up heroes through battle experience and gathering dropped Wildling Shards.
*   **Objectives:** Defeat at least 20 Wildling camps of Level $X$ or higher.
*   **Progression Structure:** Points earned per wildling kill (higher level = higher points). Point thresholds unlock reward tiers.
*   **Difficulty:** High scalability. Monster level requirements automatically align with the player's Keep Level.
*   **Duration:** 3 Days (Weekend focus).
*   **Frequency:** Weekly (Friday through Sunday).

### III. System Requirements & Map Integration
*   **Player Level Requirements:** Keep Level 6+.
*   **Alliance Requirements:** None (but defeating wildlings near allied outposts grants a $+10\%$ point bonus).
*   **Buildings Used:** Healer's Sanctuary (manages troop recovery), Barracks (replenishes casualties).
*   **Heroes Used:** Combat-specialized heroes (e.g., Dominic, Maegan Pringle).
*   **Troops Used:** Full military compositions (Infantry, Marksmen, Cavalry, Gargoyles).
*   **Wildlings Used:** Level 1-30 Void Wildling camps spawned dynamically on map coordinates.
*   **Resources Used:** Stamina points (mandatory cost per engagement), Wheat (for healing wounded troops).
*   **Currencies Used:** Gold Crowns (healing), Royal Diamonds (Stamina replenishment).

### IV. Economy, Rewards, & Monetization
*   **Reward Structure:** Epic Hero Fragments, Star Sparks (for upgrading Crownmarks), and speed-ups.
*   **Milestone Values:**
    *   *Milestone 1 (1,000 Points):* 2x Epic Star Sparks, 5x Medium EXP Tomes.
    *   *Milestone 2 (5,000 Points):* 5x Epic Star Sparks, 10x Medium EXP Tomes, 1x Epic Hero Fragment.
    *   *Milestone 3 (15,000 Points):* 15x Epic Star Sparks, 1x Celestial Shard, 3x Epic Hero Fragments.
*   **Leaderboards:** Point rankings across the entire server.
*   **Ranking Rewards:** Top 10 players receive 2,000 Royal Diamonds and 10x Legendary Star Sparks.
*   **Catch-Up Mechanics:** Double stamina recovery speed if the player is in the bottom $30\%$ of server power.
*   **Free-to-Play Balance:** Players can easily max out milestones using naturally regenerating daily Stamina.
*   **Monetization Opportunities:** Sale of "Vanguard Cleansing Packs" containing instant Stamina Potions and highly efficient PvE damage-boost scrolls.

### V. UI, Art, Audio, & Technical Pipeline
*   **UI Layout:** Interface styled as a military tactical map inside the Event menu. Represents pinned enemy camps with red skulls.
*   **HUD Changes:** Displays a small glowing sword badge over the world map button indicating high localized combat activity.
*   **Visual Effects:** Slain wildling models dissolve into purple mist that flows toward the player's marching legion, representing captured energy.
*   **Audio Assets:** Steel clangs, beastly death roars, and heavy brass war drums playing in the background of active battles.
*   **Art Assets Required:** Visual icon of a cracked purple wildling skull, 3D camp overlays featuring floating void crystals.
*   **Backend Requirements:** Validation logic to ensure players spend stamina before points are awarded. Logic preventing multiple players from cheesing the same low-level camp.
*   **JSON Configuration Structure:**
    ```json
    {
      "event_id": "wildlands_cleansing",
      "points_per_kill": {
        "level_1_10": 100,
        "level_11_20": 250,
        "level_21_30": 600
      }
    }
    ```

---

## 3. EVENT SPECIFICATION: SOVEREIGN CONQUEST

### I. Identity, Lore, & Strategic Purpose
*   **Event Name:** Sovereign Conquest: Battle for Aethelgard
*   **Event Category:** Alliance PvP / Capital Throne Control
*   **Short Summary:** Bi-weekly battle for control of the central throne at coordinates $(600,600)$.
*   **Lore:** The ancient barrier around the Crownspire has fallen. The throne of the First King is empty, waiting for a ruler with the power to bind the Spires and control the flow of stardust across the realm.
*   **Purpose:** The ultimate end-game PvP focal point of the server. Drives massive alliance coordination, high-tier resource consumption, and epic battle rivalries.
*   **Player Fantasy:** "Becoming the supreme Emperor of the server, coronating allies, and taxing rivals."
*   **Beta Priority:** Essential for Beta.

### II. Gameplay Mechanics & Progression Loop
*   **Primary Loop:** Formulating mega-rallies with alliance members to occupy the central Capital Castle and its surrounding defense turrets.
*   **Secondary Loop:** Defending marching supply lines and reinforcing occupied defense structures.
*   **Objectives:** Hold the central Capital Throne continuously for 4 hours, or hold it for the longest cumulative duration over an 8-hour window.
*   **Progression Structure:** Alliance scoring based on minutes of continuous occupation.
*   **Difficulty:** Extremely High. Designed exclusively for endgame alliances.
*   **Duration:** 8 Hours active battle window.
*   **Frequency:** Once every 14 days.

### III. System Requirements & Map Integration
*   **Player Level Requirements:** Keep Level 15+.
*   **Alliance Requirements:** Alliance must have occupied at least one Tier 3 Border Outpost to march on the core.
*   **Buildings Used:** Embassy (for massive alliance reinforcements), Healer's Sanctuary (heavily stressed).
*   **Heroes Used:** Legendary military commanders with high rally capacity stats.
*   **Troops Used:** Tier 3 to Tier 5 armies.
*   **Wildlings Used:** Capital automated defense gargoyles (must be defeated to trigger the initial siege).
*   **Resources Used:** Millions of units of Wheat, Wood, and Gold consumed to heal massive casualties.
*   **Currencies Used:** Royal Diamonds (for instant healing, shielding outer bases, and march speed-ups).

### IV. Economy, Rewards, & Monetization
*   **Reward Structure:** The winning Alliance Leader is crowned **Supreme Sovereign of Aethelgard**, unlocking server-wide buffs and custom titles.
*   **Sovereign Perks:**
    *   *Supreme Buffs:* $+15\%$ Research Speed, $+15\%$ Construction Speed server-wide.
    *   *Sovereign Edicts:* Tax target alliances, award resource packages to friendly alliances.
    *   *Sovereign Visual:* Custom crown avatar frame and glowing golden Keep skin.
*   **Milestone Values (Participating Alliances):**
    *   *Milestone 1 (10 Mins Occupation):* 1,000 Royal Diamonds, 10x Celestial Shards.
    *   *Milestone 2 (1 Hour Occupation):* 3,000 Royal Diamonds, 30x Celestial Shards, 10x Legendary Star Sparks.
*   **Free-to-Play Balance:** While whales lead the main rallies, F2P players are essential to reinforce the defense turrets, intercept enemy march lines, and harvest resource pools to fund the war chest.
*   **Monetization Opportunities:** Huge spikes in sales of "Sovereign War Chests" containing massive quantities of instant healing speed-ups, army size capacity boosts, and attack/defense $+20\%$ active buffs.

### V. UI, Art, Audio, & Technical Pipeline
*   **UI Layout:** Crown coronation room layout showing the active sovereign, their selected titles, and active server taxation charts.
*   **HUD Changes:** Displays the active countdown of capital occupation directly at the top of the HUD during the battle.
*   **Visual Effects:** The central capital spire shoots a massive, vertical gold laser beam into the sky box when occupied, casting a light halo over the entire map.
*   **Audio Assets:** Epic choral orchestra playing in the background. Resonant cathedral church bells ring across the server when a new Sovereign takes the throne.
*   **Art Assets Required:** Sovereign Crown Icon, Capital Throne Asset (3D Model and concept portraits), UI layouts for Server Tax controls.
*   **Backend Requirements:** Complex state reconciliation to handle thousands of concurrent troop movements and coordinate battles on a single node without server crashes. Rollback protocols for server desync.
*   **JSON Configuration Structure:**
    ```json
    {
      "event_id": "sovereign_conquest",
      "capital_coordinate": [600, 600],
      "turret_coordinates": [[590, 590], [610, 590], [590, 610], [610, 610]],
      "min_hold_time_seconds": 14400
    }
    ```

---

## 4. EVENT SPECIFICATION: VOID RIFT COLLAPSE

### I. Identity, Lore, & Strategic Purpose
*   **Event Name:** Void Rift Collapse
*   **Event Category:** Alliance Cooperative / Dungeon PvE
*   **Short Summary:** Cooperatively sealing massive, timed Void Rifts spawning in alliance territory.
*   **Lore:** Crystalline cracks are forming in Aethelgard's tectonic plates, spilling high-energy void monsters into the valleys. Alliances must coordinate deep exploratory strikes inside the rifts to seal the core.
*   **Purpose:** Fosters cooperative team play, rewards balanced roster structures, and balances solo-play loops with highly coordinated group achievements.
*   **Player Fantasy:** "Descending into the dark abyss with brothers-in-arms to banish a cosmic threat."
*   **Beta Priority:** Recommended After Beta.

### II. Gameplay Mechanics & Progression Loop
*   **Primary Loop:** Alliance members coordinating timed, multi-stage PvE rallies to enter and clear high-difficulty Void Rifts.
*   **Secondary Loop:** Purifying corrupted crystal debris found around the sealed rifts.
*   **Objectives:** Destroy the Rift Guardian boss within a 60-minute window from the initial rally.
*   **Progression Structure:** Progression scales with Rift Difficulty Tier (Tier 1-10). Successful seals unlock higher difficulty levels for the alliance.
*   **Difficulty:** High coordination required. Casual, uncoordinated marches will fail the DPS check of high-tier Guardians.
*   **Duration:** 48 Hours (Weekend active).
*   **Frequency:** Monthly.

### III. System Requirements & Map Integration
*   **Player Level Requirements:** Keep Level 10+.
*   **Alliance Requirements:** Must be in an Alliance; rift spawning points are determined by the location of Alliance Outposts.
*   **Buildings Used:** Embassy (coordinates the rally size), Beacon of Hope (provides passive defense buffs).
*   **Heroes Used:** Tank and AoE skill command heroes (e.g., Dominic, Lorelai).
*   **Troops Used:** Balanced armies (Infantry to hold the frontline, Marksmen and Magic Casters for high boss DPS).
*   **Wildlings Used:** Mythic Void Fiends and Void Guardians.
*   **Resources Used:** Food (Wheat) and Iron (Runic Iron) used to reconstruct siege engines deployed inside.
*   **Currencies Used:** Alliance Honor Points (earned by sealing rifts; spent in the Alliance Store).

### IV. Economy, Rewards, & Monetization
*   **Reward Structure:** Mythic and Legendary Crownmark fragments, Alliance chests containing resource packages, and Star Sparks.
*   **Milestone Values (Individual):**
    *   *Tier 3 Seal:* 500 Royal Diamonds, 2x Epic Crownmark Fragments.
    *   *Tier 7 Seal:* 1,500 Royal Diamonds, 5x Legendary Crownmark Fragments, 1x Celestial Shard.
*   **Leaderboards:** Alliance speed-run clear times.
*   **Ranking Rewards:** Top 3 alliances receive exclusive animated march trails (e.g., "Void Comet") and massive alliance reserve resource chests.
*   **Free-to-Play Balance:** Essential. F2P players act as "scouts" and provide defensive line holdings, while spenders provide high-level rally sizes.
*   **Monetization Opportunities:** Sale of "Rift Explorer Bundles" containing double-reward claim keys and instant-cooldown tokens.

### V. UI, Art, Audio, & Technical Pipeline
*   **UI Layout:** Dark-slate dungeon progression tracker with glowing purple veins, showing active boss health pools and alliance DPS ranking charts in real-time.
*   **HUD Changes:** Shows a purple fog filter on the edges of the screen when players are viewing world coordinate areas near active Void Rifts.
*   **Visual Effects:** The world map rift model is a massive, pulsing obsidian crystal crack surrounded by circular glowing gravity rings.
*   **Audio Assets:** Eerie, low-frequency cosmic wind sweeps. Bosses issue deep, echoing growls on engagement.
*   **Art Assets Required:** Rift Guardian Boss 3D Model, Purple Mist Particle Shader, Interface panels for active Alliance DPS tracking.
*   **Backend Requirements:** Dynamic spawning of instanced rift zones on the world map. Active calculation of simultaneous alliance battle damage on a single boss HP pool.
*   **JSON Configuration Structure:**
    ```json
    {
      "event_id": "void_rift_collapse",
      "difficulty_tiers": {
        "1": {"boss_hp": 10000000, "rewards_group": "tier_1_loot"},
        "5": {"boss_hp": 50000000, "rewards_group": "tier_5_loot"},
        "10": {"boss_hp": 250000000, "rewards_group": "tier_10_loot"}
      }
    }
    ```

---

## 5. EVENT SPECIFICATION: STAR FORGE BREAKTHROUGH FESTIVAL

### I. Identity, Lore, & Strategic Purpose
*   **Event Name:** Star Forge Breakthrough Festival
*   **Event Category:** Progression / Equipment Upgrading
*   **Short Summary:** Active boosts to equipment upgrading, with temporary failure protection modifiers.
*   **Lore:** The cosmic alignments have unlocked the full latent energy of Aethelgard's Star Forge. Crystalline star-matter flows smoothly, allowing blacksmiths to reinforce Crownmarks with highly stable energy.
*   **Purpose:** Drives engagement with the core progression system (Crownmark Upgrading). Relieves player frustration associated with failed high-tier upgrades, while acting as a massive soft currency sink.
*   **Player Fantasy:** "A master cosmic blacksmith, binding absolute stellar power to the signature relics of legendary heroes."
*   **Beta Priority:** Essential for Beta.

### II. Gameplay Mechanics & Progression Loop
*   **Primary Loop:** Spending Star Sparks and Gold Crowns to upgrade and break through Crownmark star ratings.
*   **Secondary Loop:** Converting lower-tier Star Sparks into rare high-tier variants at the Citadel Forge.
*   **Objectives:** Accomplish successful star breakthroughs on Weapon, Helmet, Chest, Glove, Boot, Ring, or Necklace slots.
*   **Progression Structure:** Points awarded per upgrade tier completed. Points unlock progressive reward chests.
*   **Difficulty:** None (purely progression and materials-based).
*   **Duration:** 5 Days.
*   **Frequency:** Monthly.

### III. System Requirements & Map Integration
*   **Player Level Requirements:** Keep Level 8+ (Unlocks the Blacksmith Forge).
*   **Alliance Requirements:** None (Solo-focused progression event).
*   **Buildings Used:** Citadel Star Forge (the primary active building).
*   **Heroes Used:** Unlocking signature weapon bonuses boosts point output.
*   **Troops Used:** None.
*   **Wildlings Used:** None.
*   **Resources Used:** Millions of Gold Crowns (soft currency) consumed during breakthrough attempts.
*   **Currencies Used:** Star Sparks (all rarity tiers), Royal Diamonds (for instant forge cools).

### IV. Economy, Rewards, & Monetization
*   **Special Protection Rule:** During the event, any failed high-tier Star Breakthrough applies a double pity modifier ($+30\%$ success rate on subsequent attempts, up to a guaranteed $100\%$ upgrade) and refunds $50\%$ of the rare materials.
*   **Milestone Values:**
    *   *Milestone 1 (500 Points):* 10x Rare Star Sparks, 10,000 Gold Crowns.
    *   *Milestone 2 (2,000 Points):* 20x Epic Star Sparks, 50,000 Gold Crowns.
    *   *Milestone 3 (10,000 Points):* 5x Legendary Star Sparks, 1x Mythic Crownmark Fragment, 200,000 Gold Crowns.
*   **Free-to-Play Balance:** Very high value. The failure protection rule allows F2P players to safely upgrade their legendary gear without fearing progression loss.
*   **Monetization Opportunities:** Sells "Forge Master Coffers" containing massive quantities of Star Sparks, Celestial Shards, and Gold Crowns.

### V. UI, Art, Audio, & Technical Pipeline
*   **UI Layout:** Centered around a massive floating anvil surrounded by a glowing stellar rune projector. Points are displayed on an elegant copper vertical gauge on the left.
*   **HUD Changes:** Displays active stellar flare sparks on the Forge building's 3D chimney on the main city screen.
*   **Visual Effects:** Success triggers a screen-wide golden radial flash accompanied by glowing amber crystalline embers floating upward.
*   **Audio Assets:** Deep, resonant metallic anvil strikes accompanied by crystal chimes on success. High-pitched clinking of copper rings on material conversion.
*   **Art Assets Required:** Custom artwork of a stellar anvil radiating amber and purple magic, 3D particles for gold sparks.
*   **Backend Requirements:** Save data listener to track successful forge outcomes, calculate pity values, and prevent exploit attempts (such as rolling back device clocks to bypass failed upgrades).
*   **JSON Configuration Structure:**
    ```json
    {
      "event_id": "star_forge_festival",
      "pity_multiplier": 2.0,
      "points_per_breakthrough": {
        "rare": 10,
        "epic": 50,
        "legendary": 250,
        "mythic": 1000
      }
    }
    ```

---

## 6. EVENT SPECIFICATION: THE CRIMSON DRAGON'S AWAKENING

### I. Identity, Lore, & Strategic Purpose
*   **Event Name:** The Crimson Dragon's Awakening
*   **Event Category:** World Boss / Raid PvE
*   **Short Summary:** Server-wide coordination to defeat a colossal volcanic dragon spawning at coordinates $(500,500)$.
*   **Lore:** Deep beneath the central volcanic peaks, Ignis the Crimson Dragon has woken from his century-long slumber. Enraged by the corrupting void mist, the beast threatens to incinerate adjacent alliance outposts. Sovereigns must organize massive combined marches to seal the dragon.
*   **Purpose:** Builds server community cohesion. Acts as a soft-check of server military strength, while distributing highly valuable progression resources to active alliances.
*   **Player Fantasy:** "Marshaling a massive army of cavalry and gargoyles to battle a screen-shaking, volcano-born beast."
*   **Beta Priority:** Recommended After Beta.

### II. Gameplay Mechanics & Progression Loop
*   **Primary Loop:** Coordinating real-time marches and alliance rallies to attack the colossal World Boss.
*   **Secondary Loop:** Defending marching armies from the dragon's area-of-effect magma strikes (coordinates with red warning circles).
*   **Objectives:** Defeat the Crimson Dragon within the active 4-hour window.
*   **Progression Structure:** Server-wide boss health pool. Rewards scale based on percentage damage dealt by individual alliances.
*   **Difficulty:** Hard. The dragon features mechanical phases (e.g., ground pounds that stun melee legions, and volcanic ash clouds that blind ranged marksmen).
*   **Duration:** 4 Hours active window.
*   **Frequency:** Monthly.

### III. System Requirements & Map Integration
*   **Player Level Requirements:** Keep Level 12+.
*   **Alliance Requirements:** Alliance must have completed the "Tectonic Research" project to march on volcanic terrain.
*   **Buildings Used:** Embassy (for massive alliance rally formations), Healer's Sanctuary (heavily stressed).
*   **Heroes Used:** Ice-element or defensive commanders (e.g., Frost Guardian synergies).
*   **Troops Used:** High-level Cavalry (for fast relocation out of magma zones) and Marksmen (for ranged DPS).
*   **Wildlings Used:** Lava elementals spawned as defense minions around the dragon.
*   **Resources Used:** Millions of Wheat and Slate consumed to heal massive wounded soldier lists.
*   **Currencies Used:** Gold Crowns (healing), Royal Diamonds.

### IV. Economy, Rewards, & Monetization
*   **Reward Structure:** Mythic Dragon Slayer equipment sets, Legendary Star Sparks, huge resource caches.
*   **Milestone Values (Individual Damage):**
    *   *Top 1% Damage:* 3x Legendary Star Sparks, 1x Mythic Dragon Slayer Fragment, 500,000 Gold Crowns.
    *   *Top 10% Damage:* 1x Legendary Star Spark, 3x Epic Star Sparks, 200,000 Gold Crowns.
*   **Alliance Rewards:** The top-ranked alliance receives an exclusive server-wide buff ($+10\%$ March Speed) for 7 days.
*   **Free-to-Play Balance:** F2P players can contribute significantly by clearing the surrounding fire elementals, allowing whales to focus high-tier rallies directly on the dragon's weak points.
*   **Monetization Opportunities:** Sale of "Dragon Slayer Trophies" bundles containing damage amplification scrolls ($+15\%$ damage vs. dragons) and instant troop recovery items.

### V. UI, Art, Audio, & Technical Pipeline
*   **UI Layout:** Heavy, volcanic-slate frame featuring a live health bar of the dragon, countdown clock, and real-time alliance DPS leaderboard.
*   **HUD Changes:** Displays a burning lava filter on the margins of the screen when players zoom their camera onto coordinates within 50 tiles of the boss.
*   **Visual Effects:** Red warning circles indicating upcoming magma strikes. The dragon's model scales up on the map, breathing massive cone fire trails.
*   **Audio Assets:** Colossal beastly roars, erupting volcanic explosions, and deep, menacing orchestral scores with heavy brass instrumentation.
*   **Art Assets Required:** Volcanic Dragon 3D Model, Fire and Magma Particle Shaders, UI graphic panels for localized DPS tracking.
*   **Backend Requirements:** Synchronization of real-time coordinate movements for up to 5,000 concurrent legions on a single node. Event state replication across all active players.
*   **JSON Configuration Structure:**
    ```json
    {
      "event_id": "crimson_dragon_awakening",
      "boss_coordinates": [500, 500],
      "max_hp": 1000000000,
      "phases": [
        {"hp_pct": 75, "skill": "magma_rain"},
        {"hp_pct": 50, "skill": "ash_cloud_blind"},
        {"hp_pct": 25, "skill": "enrage_mode"}
      ]
    }
    ```

---

## 7. EVENT SPECIFICATION: SOVEREIGN KEEP FESTIVITIES

### I. Identity, Lore, & Strategic Purpose
*   **Event Name:** Sovereign Keep Festivities
*   **Event Category:** Construction & Research / Progression
*   **Short Summary:** Encourages municipal development through special speed-up multipliers and milestone rewards.
*   **Lore:** A season of peace and unification has arrived in Aethelgard. Sovereigns organize grand grand-keep feasts, bringing artisans and architects from across the realm to construct towering symbols of statehood.
*   **Purpose:** Incentivizes players to complete pending high-level buildings and academy research nodes, serving as a massive resource drain while boosting overall server progression.
*   **Player Fantasy:** "An absolute sovereign ruler, constructing a sprawling, majestic alabaster metropolis."
*   **Beta Priority:** Essential for Beta.

### II. Gameplay Mechanics & Progression Loop
*   **Primary Loop:** Upgrading municipal buildings (Keep, Wall, Barracks, Spire) and completing Research Academy nodes.
*   **Secondary Loop:** Exchanging municipal raw resources (Wheat, Timber, Slate, Runic Iron) for festival favor tickets.
*   **Objectives:** Accumulate Power Rating increases from construction and research milestones.
*   **Progression Structure:** Point scoring systems. Point milestones unlock high-tier building materials and speed-ups.
*   **Difficulty:** Scaled based on Player Keep Level (ensures beginners and veterans have fair progression gates).
*   **Duration:** 7 Days.
*   **Frequency:** Monthly.

### III. System Requirements & Map Integration
*   **Player Level Requirements:** Keep Level 5+.
*   **Alliance Requirements:** None (but helping allies speed up buildings grants event points).
*   **Buildings Used:** All municipal buildings (Keep, Academy, Depot, etc.).
*   **Heroes Used:** Production and economic heroes.
*   **Troops Used:** None.
*   **Wildlings Used:** None.
*   **Resources Used:** Millions of units of Wheat, Wood, Slate, and Iron consumed during building queues.
*   **Currencies Used:** Gold Crowns (speed-up costs), Royal Diamonds (instant completions).

### IV. Economy, Rewards, & Monetization
*   **Reward Structure:** Custom Castle Skin (e.g., "Alabaster Palace"), Construction/Research Speed-ups, and legendary Crownmark dust.
*   **Milestone Values:**
    *   *Milestone 1 (1,000 Points):* 5x 1-Hour Construction Speed-Ups, 50,000 Timber.
    *   *Milestone 2 (5,000 Points):* 10x 1-Hour Research Speed-Ups, 100,000 Slate.
    *   *Milestone 3 (20,000 Points):* 1x 24-Hour Universal Speed-Up, Epic Castle Skin (7 Days), 200,000 Gold Crowns.
*   **Leaderboards:** Power Rating Gain during the active event window.
*   **Ranking Rewards:** Top 10 players receive a Permanent Legendary "Alabaster Palace" Keep Skin, granting $+5\%$ overall research speed passively.
*   **Free-to-Play Balance:** Players can easily reach Milestone 3 by saving up their speed-ups and resources in the weeks leading up to the event.
*   **Monetization Opportunities:** Sale of "Architect's Masterplans" containing high-tier speed-up packages, exclusive construction queue expansions, and massive resource bundles.

### V. UI, Art, Audio, & Technical Pipeline
*   **UI Layout:** Bright, festive alabaster-framed event panel. Displays a colorful, glowing progress path lined with virtual paper lanterns.
*   **HUD Changes:** Displays falling white confetti particles on the player's primary city screen.
*   **Visual Effects:** Completed building upgrades trigger virtual fireworks bursting over the building model.
*   **Audio Assets:** Uplifting orchestral celebratory music. Completed speed-ups trigger chime sounds.
*   **Art Assets Required:** Festive Castle Skin concept, Lantern Icons, UI celebration banner artwork.
*   **Backend Requirements:** Save state listener tracking overall Power Rating change. Dynamic calculation of point bonuses derived from construction queues.
*   **JSON Configuration Structure:**
    ```json
    {
      "event_id": "sovereign_keep_festivities",
      "points_per_power_point": {
        "construction": 1,
        "research": 1.5
      }
    }
    ```

---

## 8. EVENT SPECIFICATION: LEGION MUSTER & DRILL

### I. Identity, Lore, & Strategic Purpose
*   **Event Name:** Legion Muster & Drill
*   **Event Category:** Troop Training / Weekly Progression
*   **Short Summary:** Boosts military troop output and rewards players for training large legions.
*   **Lore:** Tensions on the border outposts demand high troop readiness. Sovereigns order their military commanders to muster fresh recruits, drilling them in spear combat, horse charging, and aerial maneuvering.
*   **Purpose:** Boosts total army size across the server, preparing the player base for upcoming PvP capital wars. Serves as a primary food (Wheat) consumer.
*   **Player Fantasy:** "An ironbrand military general, looking over rows of thousands of perfectly trained, high-tier legions."
*   **Beta Priority:** Essential for Beta.

### II. Gameplay Mechanics & Progression Loop
*   **Primary Loop:** Training Infantry, Marksmen, Cavalry, and Gargoyles inside the city barracks.
*   **Secondary Loop:** Upgrading low-tier troops to high-tier troops (e.g., converting Tier 1 to Tier 3).
*   **Objectives:** Train at least 10,000 tier-appropriate troops during the event window.
*   **Progression Structure:** Points awarded per troop trained (points scale exponentially with troop Tier, e.g., Tier 1 = 1 Point, Tier 4 = 10 Points).
*   **Difficulty:** Low. Accessible to all active players.
*   **Duration:** 3 Days (Tuesday through Thursday).
*   **Frequency:** Bi-weekly.

### III. System Requirements & Map Integration
*   **Player Level Requirements:** Keep Level 6+.
*   **Alliance Requirements:** None (Solo-focused troop progression).
*   **Buildings Used:** Barracks (Infantry, Marksmen, Cavalry, Gargoyle variants).
*   **Heroes Used:** Heroes with "Trainer" or "Command" specializations (granting training speed buffs).
*   **Troops Used:** All combat tiers.
*   **Wildlings Used:** None.
*   **Resources Used:** Millions of units of Wheat (primary troop cost), Wood, and Gold Crowns.
*   **Currencies Used:** Training Speed-Ups, Royal Diamonds.

### IV. Economy, Rewards, & Monetization
*   **Reward Structure:** Training Speed-Ups, Rare Hero Shards, and troop recovery scrolls.
*   **Milestone Values:**
    *   *Milestone 1 (5,000 Points):* 5x 15-Min Training Speed-Ups, 10,000 Wheat.
    *   *Milestone 2 (20,000 Points):* 10x 15-Min Training Speed-Ups, 50,000 Wheat.
    *   *Milestone 3 (100,000 Points):* 5x 1-Hour Training Speed-Ups, 1x Rare Hero Shard, 100,000 Gold Crowns.
*   **Free-to-Play Balance:** Players can maximize points efficiently by prioritizing low-to-high tier troop promotions, which cost significantly less resources than training raw high-tier troops from scratch.
*   **Monetization Opportunities:** Sale of "Muster Chests" containing $+50\%$ Training Speed buffs, Barracks Capacity Expanders, and millions of units of Wheat.

### V. UI, Art, Audio, & Technical Pipeline
*   **UI Layout:** Dark slate and weathered iron framing, displaying marching army banners and tactical military schedules.
*   **HUD Changes:** Displays small cross-sword badges over active barracks structures indicating accelerated training drills.
*   **Visual Effects:** Marching troop columns on the city streets carry bright, glowing standard banners.
*   **Audio Assets:** Heavy marching boots, metal armors clanking, and commanding drill whistle sound effects.
*   **Art Assets Required:** Custom artwork of rows of alabaster knights standing at attention, Training speed-up coupon icons.
*   **Backend Requirements:** Save listener tracking troop training logs and point progression validation. Preventing exploits from canceling training queues repeatedly to milk points.
*   **JSON Configuration Structure:**
    ```json
    {
      "event_id": "legion_muster_drill",
      "points_per_tier": {
        "t1": 1,
        "t2": 3,
        "t3": 6,
        "t4": 10,
        "t5": 20
      }
    }
    ```

---

## 9. EVENT SPECIFICATION: THE CODEX MUSEUM EXHIBITION

### I. Identity, Lore, & Strategic Purpose
*   **Event Name:** The Codex Museum Exhibition
*   **Event Category:** Collection & Lore / Exploration
*   **Short Summary:** Collecting and cataloging rare Crownmarks to display in the Citadel Museum.
*   **Lore:** The Royal Antiquarian Society has organized a grand exhibition. Sovereigns are invited to retrieve legendary ancient Crownmarks from across Aethelgard's forgotten vaults, restoring their luster to unlock deep historical insights.
*   **Purpose:** Promotes retention through completionist "Museum Collection" mechanics, elevating the narrative and lore elements of individual equipment sets.
*   **Player Fantasy:** "An intellectual archaeologist-ruler, recovering lost mythical relics to glorify their nation's history."
*   **Beta Priority:** Expansion Content.

### II. Gameplay Mechanics & Progression Loop
*   **Primary Loop:** Recovering specific historical Crownmark fragments from world rifts and displaying completed items in the Codex Museum.
*   **Secondary Loop:** Leveling up Crownmarks to unlock custom visual relic glows and reading their historical logs.
*   **Objectives:** Complete three designated historical relic collections (e.g., "The Founder's Regalia").
*   **Progression Structure:** Museum rating metric based on total unique relics cataloged and their star levels.
*   **Difficulty:** High (demands continuous long-term progression).
*   **Duration:** Seasonal (30-day active windows).
*   **Frequency:** Quarterly.

### III. System Requirements & Map Integration
*   **Player Level Requirements:** Keep Level 10+ (Citadel Museum building unlocked).
*   **Alliance Requirements:** None (Solo archive and exploration loop).
*   **Buildings Used:** Citadel Codex Museum (primary interaction hub).
*   **Heroes Used:** Heroes bound to signature Crownmarks receive large point boosts.
*   **Troops Used:** None.
*   **Wildlings Used:** Mythic world bosses must be cleared to drop rare relic maps.
*   **Resources Used:** Runic Iron (used to polish and restore rusted relics).
*   **Currencies Used:** Collector Coins (earned during rifts, spent on relic polishes).

### IV. Economy, Rewards, & Monetization
*   **Reward Structure:** Custom visual weapon glow shaders, Legendary Hero portraits, and passive non-combat progression buffs ($+3\%$ overall collection efficiency).
*   **Milestone Values:**
    *   *Exhibition Tier 1:* 5x Universal Epic Shards, "Antiquarian" Chat Title.
    *   *Exhibition Tier 3:* 15x Universal Epic Shards, 1x Celestial Shard, Custom "Museum Pedestal" Keep Avatar.
*   **Free-to-Play Balance:** Essential. All historical lore and basic museum entries are accessible without spending. Rare visual glows are grindable over long seasonal windows.
*   **Monetization Opportunities:** Sale of "Archaeological Expedition Maps" that pinpoint coordinate caches containing guaranteed legendary gear fragments.

### V. UI, Art, Audio, & Technical Pipeline
*   **UI Layout:** Immaculate, physical museum showroom with marble pedestals displaying rotating 3D models of the Crownmarks (e.g., Amethyst Scepter, Crimson Ironbrand) with hovering parchment scrolls.
*   **HUD Changes:** Displays an elegant, gold book icon on the main screen that glows soft blue when a new relic log is unlocked.
*   **Visual Effects:** Restoring a relic triggers a gentle blue water-ripple wave that cleanses dust from the 3D model, revealing glowing gold and copper linings.
*   **Audio Assets:** Soft, mysterious harps and violins playing in the museum. Turning pages emits a tactile leather and parchment rustle.
*   **Art Assets Required:** UI assets for Museum pedestal displays, Custom historical sketches of Aethelgard's founding heroes.
*   **Backend Requirements:** Museum inventory state persistence, linking item unlock dates with server histories.
*   **JSON Configuration Structure:**
    ```json
    {
      "event_id": "codex_museum_exhibition",
      "required_sets": ["iron_vanguard", "royal_sentinel", "crystal_sovereign"],
      "completion_multiplier": 1.25
    }
    ```

---

## 10. EVENT SPECIFICATION: CAPITAL BORDER FORT SKIRMISH

### I. Identity, Lore, & Strategic Purpose
*   **Event Name:** Capital Border Fort Skirmish
*   **Event Category:** Alliance PvP / Territory Control
*   **Short Summary:** High-stakes capture of mid-map defensive border forts to secure choke points prior to Throne battles.
*   **Lore:** As the central spire's energy approaches peak capacity, adjacent border fort barricades have powered up. Alliances must rush to claim these stone choke points, locking down marching highways to the central volcanic core.
*   **Purpose:** Orchestrates mid-level PvP conflicts. Establishes tactical territory frontlines, giving alliances defensive buffers or offensive launchpads for upcoming capital sieges.
*   **Player Fantasy:** "Leading a highly organized military vanguard, securing deep fort positions to protect allied armies."
*   **Beta Priority:** Recommended After Beta.

### II. Gameplay Mechanics & Progression Loop
*   **Primary Loop:** Coordinating pincer marches and rallies to siege and occupy targeted Border Fort neutral structures on the map.
*   **Secondary Loop:** Erecting territorial walls and outposts extending from the captured forts.
*   **Objectives:** Capture and maintain continuous control of at least two Border Fort choke points.
*   **Progression Structure:** Score points based on minutes of fort occupation.
*   **Difficulty:** High. Requires coordinated troop distribution across multiple map targets.
*   **Duration:** 24 Hours.
*   **Frequency:** Once every 14 days (occurring 48 hours prior to Capital Throne Battles).

### III. System Requirements & Map Integration
*   **Player Level Requirements:** Keep Level 12+.
*   **Alliance Requirements:** Alliance must have occupied at least five Tier 1/2 Outposts.
*   **Buildings Used:** Embassy (governs rally size), Healer's Sanctuary (handles combat wounded).
*   **Heroes Used:** High defense and speed commanders.
*   **Troops Used:** Full military compositions (Infantry tanks to block doorways, Cavalry to flank reinforcements).
*   **Wildlings Used:** Neutral fort defenders (level 15) must be defeated to unlock the building.
*   **Resources Used:** Food (Wheat), Wood, and Gold consumed to heal armies.
*   **Currencies Used:** Royal Diamonds (for rapid march speed-ups and healing).

### IV. Economy, Rewards, & Monetization
*   **Reward Structure:** Border Fort Occupation buffs ($+15\%$ overall march speed to central coordinates, $+10\%$ rally size caps), massive alliance chests.
*   **Milestone Values (Individual Score):**
    *   *Milestone 1 (500 Skirmish Points):* 2x Epic Star Sparks, 50,000 Wheat.
    *   *Milestone 2 (2,000 Skirmish Points):* 5x Epic Star Sparks, 1x Celestial Shard, 100,000 Gold Crowns.
*   **Free-to-Play Balance:** Essential. F2P players are critical for defending surrounding pass coordinates and warning rally leaders of incoming flanking forces.
*   **Monetization Opportunities:** Sale of "Tactical Border Chests" containing $+10\%$ PvP Defense scrolls, accelerated March Speed items, and massive troop food provisions.

### V. UI, Art, Audio, & Technical Pipeline
*   **UI Layout:** Dark slate and weathered copper military board, showing live status of the four map fort choke points and real-time alliance coordinate boundaries.
*   **HUD Changes:** Displays small status shield indicators next to fort icons on the map HUD indicating alliance ownership.
*   **Visual Effects:** Captured forts light up with the occupying alliance’s custom colors and sigils, emitting a circular defense perimeter bubble.
*   **Audio Assets:** Heavy cannon fire, crashing steel walls, and atmospheric war horns echoing across map corridors.
*   **Art Assets Required:** 3D model overlays for Fort structures, alliance banner icons, tactical map UI.
*   **Backend Requirements:** Dynamic structure locking/unlocking states based on global event clocks. Live verification of alliance coordinate boundaries.
*   **JSON Configuration Structure:**
    ```json
    {
      "event_id": "border_fort_skirmish",
      "border_fort_nodes": [
        {"id": "fort_north", "coords": [450, 600]},
        {"id": "fort_south", "coords": [750, 600]},
        {"id": "fort_east", "coords": [600, 750]},
        {"id": "fort_west", "coords": [600, 450]}
      ]
    }
    ```

---

*End of Batch 1. Standardizing system integrations and code models.*
