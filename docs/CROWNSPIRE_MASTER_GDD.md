# CROWNSPIRE: MASTER GAME DESIGN DOCUMENT
**Lead Systems Architecture & Design Outline**
**Prepared for Development in Godot Engine**

---

## EXECUTIVE SUMMARY
*   **Game Title:** Crownspire
*   **Genre:** Fantasy 4X MMO Kingdom Builder
*   **Target Platform:** Mobile-First (Android), iOS, PC Cross-Play Compatibility
*   **Aesthetic & Mood:** Dark medieval gothic fantasy, high-contrast copper and slate hues, runic imagery, celestial magic, and martial grit.

---

## 1. CORE GAMEPLAY LOOP
*   **Purpose:** To define the daily retention drivers and long-term prestige mechanics that engage both free-to-play (F2P) and high-value players.
*   **Unlock Requirements:** Instant access upon game initiation.
*   **Rewards:** Realm-level sovereignty, player experience, material resources, military prestige, and social dominance.
*   **Progression:**
    1.  **Extract & Smelt:** Gather baseline raw materials (Food/Wood/Stone/Iron) to upgrade municipal estates.
    2.  **Train & Build:** Recruit tiered divisions (Infantry, Marksmen, Cavalry) and expand municipal installations.
    3.  **Command & Pair:** Bind recruited Heroes with engineered equipment sets and celestial Companions (Pets).
    4.  **Campaign & Conquer:** March on PvE threats, colonize Wilderness resource tiles, and coordinate massive PvP Alliance Sieges.
*   **Balance Philosophy:** Establish a rock-paper-scissors military balance (Infantry beats Cavalry, Cavalry beats Marksmen, Marksmen beats Infantry) while ensuring economic activities feed directly into martial preparedness.

---

## 2. NEW PLAYER EXPERIENCE (NPE)
*   **Purpose:** To maximize Day-1 retention by providing a cinematic narrative introduction coupled with low-friction structural onboarding.
*   **Unlock Requirements:** Account creation.
*   **Rewards:** Starter Hero (e.g., Captain of the Vanguard), Beginner Shield of Accord (24-hour peace shield), and baseline currency packs.
*   **Progression:**
    *   *Phase I (0-15m):* Runic gate defense sequence against standard monstrous swarms. Introduction to basic building construction and instant-complete mechanics.
    *   *Phase II (15-60m):* Recruitment of first companion pet and binding to vanguard hero. Conquest of first structural province on campaign tracks.
    *   *Phase III (Day 1-3):* Alliance onboarding, wildlands colony scouting, and first tier-1 tower fortification completion.
*   **Balance Philosophy:** Mitigate resource depletion early. Retain 100% troop survival in all introductory PvE milestones.

---

## 3. BUILDINGS
*   **Purpose:** The central container for economic, technological, and tactical operations inside the sanctuary walls.
*   **Unlock Requirements:** Regulated by Keep level and precursor masonry checks.
*   **Rewards:** Production multipliers, training capacity expansions, and unlock vectors for elite systems.
*   **Progression:**
    *   *Keep:* Crownspire's seat of power. Governs maximum level of all secondary structures.
    *   *Sovereign Spire:* Coordinates mystical projects, Companion (Pet) sanctuary, and dragonbound alignment.
    *   *Barbaric Barracks / Marksmen Range / Stable:* Training grounds for military branches.
    *   *Blacksmith Forge:* Production site for heroic war equipment and armory modifications.
*   **Balance Philosophy:** Upgrade timers follow a logarithmic curve. Early levels complete in seconds, whereas late-game Keep levels (Level 30+) scale to weeks, incentivizing Alliance Help clicks and Speed-Up tokens.

---

## 4. RESOURCES
*   **Purpose:** Fuels the economy, building upgrades, troop training, and high-tier blacksmith crafting.
*   **Unlock Requirements:** Basic production starts immediately; high-tier smelt (Iron/Valor) unlocks at Keep Level 10 and 15.
*   **Rewards:** Construction, technological research, and combat readiness.
*   **Progression:**
    *   **Food (Wheat Fields):** Primary upkeep for units and low-tier trades.
    *   **Wood (Timber Mills):** Essential structural framework material.
    *   **Stone (Slate Quarries):** Heavy fortification material.
    *   **Iron (Smelter Furrows):** High-tier armor, weapons, and siege engines.
    *   **Valor Points:** Earned through combat campaigns, capital trials, and events. Used for elite star alignments.
*   **Balance Philosophy:** Maintain strict resource sinks. Ensure high-tier activities (such as troop healing and legendary forging) require multiple resource types to stimulate internal economy and trading.

---

## 5. TROOPS
*   **Purpose:** Crucial components of map projection, fortress defense, gathering volume, and general combat.
*   **Unlock Requirements:** Standard tiers (T1 to T5) unlocked inside respective barracks at Keep levels 1, 6, 12, 18, and 24.
*   **Rewards:** Resource pillaging, world conquest, and power ratings.
*   **Progression:**
    *   *Infantry:* Heavily armored gargoyles/shield-bearers. Exceptional defensive health.
    *   *Marksmen:* Long-range runic archers. Lethal backline pressure.
    *   *Cavalry:* Fast-moving drakeriders. High critical shock velocity.
*   **Balance Philosophy:** Stat distributions ensure T5 units (elite Vanguard) are roughly 400% more effective than T1 units but cost exponentially more iron and food to train and heal.

---

## 6. HEROES
*   **Purpose:** Leaders of marching armies that provide immense tactical skills, battle cry multipliers, and companion slots.
*   **Unlock Requirements:** Summoned using Hero Tickets inside the Hero Hall (TavernTab) or acquired via special event shards.
*   **Rewards:** Force projection, passive base traits, and active combat skill multipliers.
*   **Progression:** Heroes level up from 1 to 60 using Experience Scrolls gathered from monster hunts and campaign sweeps.
*   **Balance Philosophy:** Avoid "one-hero-wins-all" metas. Ensure every tier of player can recruit viable baseline rare heroes, while reserving specialized legendary commanders for master tacticians.

---

## 7. HERO ASCENSION
*   **Purpose:** Promotes duplicate-hero shard recycling to increase maximum level limits and unlock powerful skill nodes.
*   **Unlock Requirements:** Initial Hero recruitment.
*   **Rewards:** Increased level caps, higher star status, and skill mastery.
*   **Progression:** Standard ascension requires 10 to 400 duplicate shards corresponding to Star 1 to Star 5 masteries.
*   **Balance Philosophy:** Prevent paywalls. F2P players can progressively farm generic "Wildcard Hero Shards" over monthly events.

---

## 8. HERO SKILLS
*   **Purpose:** Passive and active command utilities that initiate during tactical grid battles.
*   **Unlock Requirements:** Gradual unlocks at Hero level 1, 10, 20, and 45.
*   **Rewards:** Special combat effects (e.g., poison arrow, tactical shield, cavalry charge).
*   **Progression:** Skills are leveled up using Skill Tomes found in the Campaign stages and Daily Quests.
*   **Balance Philosophy:** Active skills are balanced with cooldown cycles (expressed in battlefield rounds) to allow strategic counterplay.

---

## 9. EQUIPMENT
*   **Purpose:** Modular gear crafted in the Sovereign Forge to directly boost army attack, defense, and march speed.
*   **Unlock Requirements:** Keep Level 8 & Sovereign Forge construction.
*   **Rewards:** Significant percentage-based combat multipliers (+% Infantry Attack, +% Marksmen HP).
*   **Progression:** Common -> Rare -> Epic -> Legendary -> Mythic tiers. Gear is leveled up using materials (Copper, Drake Scale, Void Crystals) and Hammering Sparks.
*   **Balance Philosophy:** Equipment stats are additive to prevent multiplier inflation from causing unkillable units.

---

## 10. PETS (CELESTIAL COMPANIONS)
*   **Purpose:** Loyal companions bound to individual Heroes that add severe dynamic tactical benefits and perform independent Aviary Expeditions.
*   **Unlock Requirements:** Keep Level 10 & Companion Sanctuary construction.
*   **Rewards:** Heavy primary active skills, background base production buffs, and resource loot drops.
*   **Progression:**
    *   *Leveling:* Feed-activated training (Protein feed) scaling capped per evolution block.
    *   *Ascension:* Star upgrades using duplicate pet shards (★1 to ★5).
    *   *Evolution:* Three phases (Baby Hatchling -> Adult Form -> Cosmic Mythic Master).
*   **Balance Philosophy:** Idle pets yield 30% background buffs, while actively assigned companion pets yield 100% of their dynamic abilities to the hero they escort in battles.

---

## 11. DRAGONS
*   **Purpose:** The ultimate end-game tactical force representing the server's peak militarization.
*   **Unlock Requirements:** Keep Level 20 & Dragon Spire activation.
*   **Rewards:** Global destruction abilities, dramatic castle skin aura, and siege modifiers.
*   **Progression:** Fed with Dragonblood Rubies (PvP event drops) to mature from Egg, Wyrm, to sovereign Skybreaker.
*   **Balance Philosophy:** High deployment cost: Dragons require dragonfire oil to march, limiting their usage to major defensive wars and server-wide capital sieges.

---

## 12. RESEARCH
*   **Purpose:** Global permanent passive stat boosts divided into municipal economy, offensive combat tactics, and companion taming.
*   **Unlock Requirements:** Builder's Academe construction (Keep Level 3).
*   **Rewards:** Faster gathering speeds, higher defense ranks, and improved forge critical bounds.
*   **Progression:** Linear tree hierarchies progressing through Slate Smelting, Pack Marching, and Runic Iron plating.
*   **Balance Philosophy:** Avoid early-game technology blockades while demanding long-term specializations in end-game categories.

---

## 13. ALLIANCE SYSTEM
*   **Purpose:** The central social construct of the server, orchestrating territory control, defensive rallies, and mutual economic aid.
*   **Unlock Requirements:** Keep Level 4.
*   **Rewards:** Mutual assistance check-clicks, shared alliance gift chest drops, and access to territory production nodes.
*   **Progression:** Alliances level up through daily member contributions, increasing member caps and territory boundaries.
*   **Balance Philosophy:** Encourage cooperative networks by awarding active alliances with high-quality daily chests.

---

## 14. ALLIANCE RESEARCH
*   **Purpose:** Cooperative tech trees where all alliance members donate baseline resources to unlock global alliance-wide combat buffs.
*   **Unlock Requirements:** Active Alliance participation.
*   **Rewards:** Massive group health boosts during rallies, faster alliance building speeds, and increased march capacities.
*   **Progression:** Interactive group skill nodes (e.g., "Phalanx Unity Tier IV").
*   **Balance Philosophy:** Donation cooldowns prevent standard pay-to-win players from instant completion.

---

## 15. WORLD MAP
*   **Purpose:** A tile-based global field where players gather, track resource nodes, hunt monsters, and wage territory wars.
*   **Unlock Requirements:** Access unlocked post-tutorial.
*   **Rewards:** Live material assets, strategic outpost territory, and tactical coordinate controls.
*   **Progression:** Map centers around high-level capital zones, gradually scaling monster tiers and resource node density from Level 1 (edges) to Level 8 (core).
*   **Balance Philosophy:** Dense resources at the server core trigger constant regional friction and coordinate strategic skirmishes.

---

## 16. MARCHING
*   **Purpose:** The mechanical displacement of armies on the map to interact with wilderness nodes.
*   **Unlock Requirements:** Initial army training.
*   **Rewards:** Conquest execution and dynamic loot retrieval.
*   **Progression:** March queues scale from 1 queue to 5 queues through Keeps and Research progression.
*   **Balance Philosophy:** March time scales proportionally with coordinates distance. Speed-Up items are heavily valued commodity items.

---

## 17. GATHERING
*   **Purpose:** F2P players' secondary engine for raw material farming outside base resource structures.
*   **Unlock Requirements:** Free access on the World Map.
*   **Rewards:** Timber, Slate, Wheat, and Runic Iron.
*   **Progression:** Higher node tiers (LV1 to LV8) hold larger resource volumes and yield faster exploitation rates.
*   **Balance Philosophy:** Gathering armies are vulnerable to "tile-hitting" PvP attacks, requiring players to choose between high-tier risks and safe farm borders.

---

## 18. MONSTER HUNTS
*   **Purpose:** Sequential PvE boss progression on the World Map to harvest companion feed, blacksmith materials, and experience.
*   **Unlock Requirements:** Keep Level 5.
*   **Rewards:** Companion Feed packets, Hero experience, and forge components (Copper, Zinc, Shards).
*   **Progression:** Monsters range from Tier 1 (e.g., Rabid Skeletal Hound) up to Tier 10 (e.g., Alpha Drake Wyrm).
*   **Balance Philosophy:** Stamina limitations restrict consecutive hunts. Players must optimize high-level efficiency versus low-level farming.

---

## 19. RALLY SYSTEM
*   **Purpose:** Allows multiple Alliance members to merge their armies into a single colossal fist to defeat strongholds or massive PvP targets.
*   **Unlock Requirements:** Embassy construction (Keep Level 8).
*   **Rewards:** High-yield group achievements, legendary alliance components, and fortress occupation.
*   **Progression:** Embassy levels increase the maximum rally army capacity.
*   **Balance Philosophy:** Rally leader's research and equipment multipliers apply to the merged army, making highly coordinated, specialized commanders critical focal points.

---

## 20. WORLD BOSSES
*   **Purpose:** Occasional server-wide epic events requiring large-scale cooperative damage tracking.
*   **Unlock Requirements:** Server age thresholds.
*   **Rewards:** Server-wide rank charts yielding rare materials, premium gems, and legendary sovereign vanity markers.
*   **Progression:** Scaling difficulty parameters according to server tier age.
*   **Balance Philosophy:** Damage contribution tiers ensure even low-tier participants receive reasonable rewards to maximize event engagement.

---

## 21. KINGDOM CAPITALS
*   **Purpose:** Strongholds located at coordinate 0,0 that dictate control over the entire Realm.
*   **Unlock Requirements:** Post-day 45 server launch schedule countdown events.
*   **Rewards:** Ultimate political authority, taxes control, and naming rights of the Realm.
*   **Progression:** Occurs once every 14 days post-unlock schedule.
*   **Balance Philosophy:** Requires massive coalition coordination, turning into an intensive 8-hour occupation endurance battle.

---

## 22. THRONE SYSTEM
*   **Purpose:** The central terminal inside the Kingdom Capital. The winning Alliance Leader assumes the role of "Realm Sovereign."
*   **Unlock Requirements:** Alliance victory in the Capital Siege.
*   **Rewards:** Custom Titles (Sovereign, High Hand, Traitor, Court Fool) to distribute, dynamic tax collection, and worldwide player status modifiers.
*   **Progression:** Persistent across sovereign tenure.
*   **Balance Philosophy:** Power to distribute negative traits creates an active social, political ecosystem and natural political alliances.

---

## 23. KINGDOM CONQUEST (SVK)
*   **Purpose:** Hyper-optimized cross-server war where individual old servers invade adjacent realms to capture opponent thrones.
*   **Unlock Requirements:** Server age > 90 days.
*   **Rewards:** Massive resource bounties, double server exp multipliers, and exclusive Mythic materials.
*   **Progression:** Monthly cycles.
*   **Balance Philosophy:** Temporary coordinates migration, keeping baseline defensive shields active inside home realms to protect passive players.

---

## 24. FORTRESS SIEGE
*   **Purpose:** Bi-weekly localized territory wars for structural outposts that yield permanent alliance-wide production buffs.
*   **Unlock Requirements:** Keep Level 12.
*   **Rewards:** Passive alliance resource income and permanent secondary combat multipliers.
*   **Progression:** Five regional fortresses spread evenly across intermediate concentric world rings.
*   **Balance Philosophy:** Spreading multiple fortresses ensures Tier 2 and Tier 3 Alliances can secure lesser fortresses while elite Alliances dispute the main center.

---

## 25. OBLIVION WAR
*   **Purpose:** A week-long cooperative defense wave mode inside alliance territory.
*   **Unlock Requirements:** Alliance level 3.
*   **Rewards:** Massive quantities of Runestones and Equipment Materials.
*   **Progression:** 20 waves of increasingly brutal robotic/skeletal siege armies marching directly on member bases.
*   **Balance Philosophy:** High-tier players must actively deploy reinforcements to lower-tier teammates' keeps to survive the late waves, fostering internal alliance bonds.

---

## 26. INFERNAL BEAST
*   **Purpose:** An Alliance-summoned mega boss designed to test unified combat DPS output.
*   **Unlock Requirements:** Alliance contribution milestones.
*   **Rewards:** Massive alliance-wide chest keys, hero expansion slots, and premium resources.
*   **Progression:** Summoning level can be configured, scaling with alliance performance.
*   **Balance Philosophy:** Demands synchronized rally arrivals to prevent single player focus-fire failure.

---

## 27. GUARDIAN ASSAULT
*   **Purpose:** A highly strategic, stationary defense mechanism map mode utilizing player heroes as tower guardians.
*   **Unlock Requirements:** Keep Level 9.
*   **Rewards:** Blacksmith Forge catalyst dust and Companion experience.
*   **Progression:** Staged campaigns with tactical pathing.
*   **Balance Philosophy:** Focuses entirely on companion matching and hero skill compositions over absolute troop strength, giving F2P players a viable strategic progression path.

---

## 28. ALLIANCE FEAST
*   **Purpose:** A social interaction event hosted inside alliance cities where members share roasted meats and toast flags for passive buffs.
*   **Unlock Requirements:** Daily alliance active triggers.
*   **Rewards:** 24-hour construction velocity boosts and hero fatigue recovery.
*   **Progression:** Upgraded using cooked meats contributed globally.
*   **Balance Philosophy:** Zero risks, purely focused on cooperative bonding and retention.

---

## 29. REALM HUNT
*   **Purpose:** Occasional 3-day server race of specialized wildlife tags on the map.
*   **Unlock Requirements:** Post-Day 10 Server Age.
*   **Rewards:** Extensive packs of Pet Feed and rare monster scrolls.
*   **Progression:** Tiered contribution leaderboard charts.
*   **Balance Philosophy:** Score is based on stamina efficiency, ensuring clever hunters can outperform raw spending.

---

## 30. CRYSTAL CARAVAN
*   **Purpose:** Escort or ambush moving logistics wagons on the world map to test transit-line defense.
*   **Unlock Requirements:** Keep Level 14.
*   **Rewards:** Sovereign crystal chests and massive gold multipliers.
*   **Progression:** Configurable dispatch values (Low, Medium, Legendary).
*   **Balance Philosophy:** Ambushing caravans yields resources to the attacker without permanently destroying the merchant's base, minimizing extreme toxic fallout.

---

## 31. CROWNSPIRE TRIALS
*   **Purpose:** End-game individual player tactical gauntlet pushing military units through complex tactical layers.
*   **Unlock Requirements:** Keep Level 18.
*   **Rewards:** Tier 5 special division blueprint shards and Dragonblood shards.
*   **Progression:** 500 floors of combat tests.
*   **Balance Philosophy:** Weekly rank resets with progressive floor rewards to maintain long-term progression.

---

## 32. MATCH-3 FESTIVAL
*   **Purpose:** A casual, addictive mini-game alternative that lets players earn resources and boosts by completing board puzzles.
*   **Unlock Requirements:** Keep Level 5.
*   **Rewards:** Stamina vials, Speed-up tokens, and basic pet feed.
*   **Progression:** 100 level-grid maps.
*   **Balance Philosophy:** Serves as a tension-breaker, allowing actively engaged players to acquire crucial progression materials without relying on microtransactions.

---

## 33. DAILY QUESTS
*   **Purpose:** Routine player checklist that drives high daily active user (DAU) loops.
*   **Unlock Requirements:** Tutorial completion.
*   **Rewards:** Speed-Up tokens, VIP experience points, and Summoning Scrolls.
*   **Progression:** Static daily resets based on player Keep Level.
*   **Balance Philosophy:** Quick 15-minute daily commitments to achieve maximum chest levels, maintaining accessible play for busy players.

---

## 34. WEEKLY QUESTS
*   **Purpose:** Medium-term meta objectives to structure weekly active patterns.
*   **Unlock Requirements:** Keep Level 8.
*   **Rewards:** Blacksmith Forge shards, elite tickets, and major resource tokens.
*   **Progression:** Cumulative weekly score meters (0 to 1000 contribution score).
*   **Balance Philosophy:** Demands weekly cooperative activities (like rallies and alliance help clicks) to foster group mechanics.

---

## 35. SEASONAL EVENTS
*   **Purpose:** Cyclic major transformations of the Realm that drop limited-edition collectibles and keep the endgame fresh.
*   **Unlock Requirements:** Determined by active live operations calendars.
*   **Rewards:** Holiday-exclusive Keep skins, special drakerider custom auras, and high-tier companion selectors.
*   **Progression:** Staged battle passes and event store networks.
*   **Balance Philosophy:** High-value payouts are tuned to ensure high participation across the community.

---

## 36. VIP SYSTEM
*   **Purpose:** Progressive privilege levels rewards dedicated players and high-spending customers with permanent QoL modifications.
*   **Unlock Requirements:** Account initiation.
*   **Rewards:** Extra construction queues, increased resource gathering speed, and stamina recovery bonuses.
*   **Progression:** Advanced via daily login streaks and direct purchase gems packages.
*   **Balance Philosophy:** VIP levels are designed purely as convenience and production multipliers rather than direct, game-breaking combat advantages.

---

## 37. MONETIZATION
*   **Purpose:** The business layer driving long-term revenue and project maintenance.
*   **Unlock Requirements:** Active Store access.
*   **Rewards:** Gems, high-value premium bundles, and progression accelerations.
*   **Progression:** Tailored microtransactions (from $0.99 starter packs to high-tier sovereign master bins up to $99.99).
*   **Balance Philosophy:** Maximize value packages around QoL, visual skins, and speed assets, preventing direct paywalls on military access.

---

## 38. CASTLE SKINS (KEEP SKINS)
*   **Purpose:** Visual prestige items that alter the structural assets of a player's capital on the global map.
*   **Unlock Requirements:** Earned premium event achievements or direct purchase.
*   **Rewards:** +3% Infantry attack passives and striking world map graphics.
*   **Progression:** Purely cosmetic variants (e.g., Icecrown Citadel, Obsidian Fortress).
*   **Balance Philosophy:** Minor stat increments avoid game distortion while delivering high aesthetic reward to collectors.

---

## 39. MARCH SKINS
*   **Purpose:** Animates moving divisions with distinct visuals on the map (e.g., moving under runic dragon fire).
*   **Unlock Requirements:** VIP rewards, Seasonal milestones, or direct purchase.
*   **Rewards:** +2% March Speed and distinctive battlefield presence.
*   **Progression:** Dynamic graphical trails.
*   **Balance Philosophy:** Strictly visual prestige with minimal tactical impact.

---

## 40. NAMEPLATES
*   **Purpose:** Chat visual borders and avatar frames that distinguish community champions, diplomats, and capital victors.
*   **Unlock Requirements:** Arena leaderboards, Guild master roles, or exclusive tier events.
*   **Rewards:** Visual aesthetic supremacy in regional chats.
*   **Progression:** Level tiers linked to seasonal achievements.
*   **Balance Philosophy:** Pure vanity-driven item, holding zero functional combat stats.

---

## 41. PROGRESSION CURVE
*   **Purpose:** Structural economic math governing player resource-to-timer progression curves.
*   **Unlock Requirements:** System engine architecture.
*   **Rewards:** Smooth development trajectory and predictable game life cycle.
*   **Progression:** Upgrades follow an exponential curve ($y = a \cdot e^{bx}$). Early levels (1-10) demand hour-scale values, while mid-tier (11-20) ranges in days, and end-game Keep levels (21-30) require weeks.
*   **Balance Philosophy:** Introduce "speed-up catch-up packs" for newer servers to match regional power averages.

---

## 42. ENDGAME SYSTEMS
*   **Purpose:** Long-term engagement systems for mature accounts, maintaining active communities through continuous, high-stakes competition.
*   **Unlock Requirements:** Keep Level 25+.
*   **Rewards:** Celestial Mythic weapon scrolls, Realm migration tokens, and cosmic companion alignment stones.
*   **Progression:** Infinite level prestige trees and inter-realm alliances.
*   **Balance Philosophy:** Shift focuses from basic structure building to competitive territory mastery and resource-dynamic map wars.

---

## 43. SERVER LIFECYCLE
*   **Purpose:** Governs the phases of a server, from initial opening protections to eventual cross-realm merges to keep server populations healthy.
*   **Unlock Requirements:** Chronological age since server genesis.
*   **Rewards:** Healthy map density and active PvP matches.
*   **Progression:**
    *   *Phase A (Days 1-15):* Shielded growth. No inter-realm migration permitted.
    *   *Phase B (Days 16-60):* Capital Siege unlock. Outposts war.
    *   *Phase C (Days 61-120):* First Kingdom Conquest (SVK) events.
    *   *Phase D (Days 120+):* Cross-Realm merges to re-concentrate power.
*   **Balance Philosophy:** Automatic merges trigger when active weekly login rates fall below pre-defined targets, protecting community vitality.

---

## 44. NEW REALM LAUNCH PLAN
*   **Purpose:** The marketing and live ops blueprint for opening new worlds to capture rising sign-up cohorts.
*   **Unlock Requirements:** Live operations schedule.
*   **Rewards:** High day-1 conversion, balanced starting fields, and immediate community engagement.
*   **Progression:** Staggered openings every 72 hours alongside targeted marketing campaigns.
*   **Balance Philosophy:** Implement strict cross-realm migration filters to prevent high-level players from destroying newly established realms early on.

---

## 45. LIVE OPERATIONS (LIVE-OPS) ROADMAP
*   **Purpose:** Continuous content, events, and balance updates to maintain high player lifetime value (LTV).
*   **Unlock Requirements:** Dev studio execution calendar.
*   **Rewards:** Sustainable, long-term project viability and content stream for players.
*   **Progression:** Continuous 3-week update cycles:
    *   *Week 1:* Minor balancing patch + Match-3 Festival.
    *   *Week 2:* Bi-weekly Fortress Siege + Hero summon boost events.
    *   *Week 3:* Major endgame content release (new companion classes, map additions).
*   **Balance Philosophy:** Active community surveys and telemetry guide balancing decisions to avoid heavy-handed nerfs.

---
**DEVELOPER IMPLEMENTATION NOTE:** This Master GDD document is fully synchronized with the existing data structures and React components implemented in the Crownspire engine workspace, serving as a functional, scalable design system.
