# CROWNSPIRE: HERO DESIGN BIBLE
**Sovereign Commander Master Manual & Tactical Roster Blueprint**
**Prepared for Development in Godot Engine**

---

## INTRODUCTION & DOCUMENT OVERVIEW
The **Crownspire Hero Design Bible** serves as the master blueprint for creative lore, mechanical progression, game scripting, and audio files associated with the heroes of Crownspire. 

### Core Design Philosophy
In Crownspire, Heroes are more than basic stat containers—they represent tactical anchors on dynamic battlefield grids and are the social faces of our dark medieval gothic world. When drafting character designs, three concepts are non-negotiable:
1.  **Aesthetic Synergy:** Costume design, visual cues, and runic themes must draw from the primary copper-and-slate, high-contrast visual tone.
2.  **Strategic Differentiation:** Every character must hold unique combat, economy, or gathering traits that ensure even F2P players can form legendary team synergies.
3.  **Cross-Character Relationships:** Shared histories, legendary rivalries, and alliance interactions make the wider universe of Crownspire live and breathe.

---

## SUMMARY OF ROSTER RATINGS & CLASSES

| Hero ID | Name | Rarity | Class (Role) | Troop Type | Kingdom Origin |
|---|---|---|---|---|---|
| **maegan** | Maegan | Mythic | War | Infantry | High Kingdom of Aethelgard |
| **lorelai** | Lorelai | Mythic | Support | None | Frostbound Glacial Spires |
| **myshla** | Myshla | Mythic | Gathering | None | Whisperwind Runic Wilds |
| **shadow** | Shadow | Mythic | War | Cavalry | Gloomveil Shrouded Cloister |
| **rayne** | Rayne | Mythic | Marksmen | Marksmen | Tempest Peaks |
| **rex** | Rex | Mythic | Infantry | Infantry | Obsidian Volcanic Basins |
| **lumi** | Lumi | Mythic | Support | None | Glacial Hermit Valleys |
| **heaven** | Heaven | Mythic | War | Cavalry | High Kingdom of Aethelgard |
| **demon** | Demon | Mythic | War | Infantry | Obsidian Volcanic Basins |
| **allanna** | Allanna | Legendary | Support | None | Starspire Cathedral |
| **savannah** | Savannah | Legendary | Gathering | None | Bountiful Plains of Aethelgard |
| **aria** | Aria | Legendary | Marksmen | Marksmen | Whisperwind Runic Wilds |
| **dominic** | Dominic | Legendary | Infantry | Infantry | Aethelgard Frontlines |
| **skye** | Skye | Legendary | Cavalry | Cavalry | Zephyr Cloudfortress |
| **noxx** | Noxx | Legendary | War | Cavalry | Gloomveil Shrouded Cloister |
| **remi** | Remi | Legendary | Support | None | Masonry Plains |
| **faith** | Faith | Legendary | Support | None | Sovereign Spire Library |
| **volkan** | Volkan | Legendary | War | Infantry | Sovereign Spire Forge |
| **huarung** | Huarung | Legendary | Marksmen | Marksmen | Eastward Jade Spires |
| **violet** | Violet | Legendary | Cavalry | Cavalry | Gloomveil Shrouded Cloister |

---

## SECTION I: MYTHIC HERO ARCHETYPES (THE MASTERS)

---

### 1. MAEGAN — THE SUPREME MARSHAL
*   **ID:** `maegan`
*   **Rarity:** Mythic
*   **Role:** War / Tactician
*   **Preferred Troop Type:** Infantry

#### A. Lore & Origin
Maegan is the Iron Marshall of Aethelgard, known for holding the Great Spire gates during the Siege of the Broken Star. Born to a lineage of fallen military scholars, Maegan watched her childhood estates burn during the volcanic rifts of the Obsidian Spurn. Clad in heavy slate armor layered in runic copper filings, she wields *The Scepter of Decree*, a heavy iron club that hums with kinetic magic.

#### B. Personality
Stoic, analytical, and demanding. She views battles as rigorous mathematical equations where blood is the ultimate currency. She speaks with a gravelly commanding voice and has no patience for political theater.

#### C. Kingdom Origin
*High Kingdom of Aethelgard (Capital Seat)*

#### D. Combat Mechanics
*   **Active Skill 1: Sovereign Decree (Unlocked at ★0):** Consumes 100 tactical energy. Infuses foot soldiers with absolute fury, boosting base Infantry attack damage by 35% for 3 rounds.
*   **Active Skill 2: Bastion Aegis (Unlocked at ★3):** Erects a protective, low-frequency sound dome around allied legions, negating the next 2 physical critical impacts.
*   **Ultimate Ability: Crownspire Vanguard (Unlocked at Max Ascension):** Forces all enemy ranged units to focus fire on Maegan's vanguard infantry for 2 rounds, while applying a massive 50% Thorn Damage reflection shield to her units.
*   **Passive Bonuses:**
    *   *Troop Attack:* +15%
    *   *Infantry Defense:* +12%

#### E. Ascension Progression (★0 to ★5)
*   **★0:** Base Multipliers (1.0x). Skills Unlocked: *Sovereign Decree*.
*   **★1:** Stats +25%. Leadership +25%.
*   **★2:** Stats +55%. Power Factor +75%.
*   **★3:** Stats +90%. Skills Unlocked: *Bastion Aegis*.
*   **★4:** Stats +130%. Troop size limit increased.
*   **★5:** Stats +180%. Skills Unlocked: *Ultimate: Crownspire Vanguard*.

#### F. Voice Lines & Recruitment Dialogue
*   **Recruitment Quote:** *"The line will not break. Tell me, Sovereign: are you prepared to pay the price of order?"*
*   **Idle Line 1:** *"A quiet front is a dangerous illusion. Keep the marksmen checking the tree lines."*
*   **Idle Line 2:** *"Copper and iron... with enough coordination, even mountains can be hammered into fortresses."*
*   **Battle Cry:** *"For the High Throne! Lock shields, advance!"*
*   **Victory Line:** *"A clean execution. Cleanse the coordinate boundaries and establish resource camps."*
*   **Defeat Line:** *"Fall back... organize the vanguard... the Spire must hold..."*

#### G. Relationship Matrix
*   **Rex (Allied Front):** Highly trusts Rex's heavy dragonscale shielding. Often coordinates defenses around his gate structures.
*   **Demon (Mortal Enemy):** despises Demon's volcanic, bloodthirsty rage. Views him as a dangerous beast that needs to be permanently chained under the spires.

---

### 2. LORELAI — THE ETHEREAL WEAVER
*   **ID:** `lorelai`
*   **Rarity:** Mythic
*   **Role:** Support / Healer
*   **Preferred Troop Type:** None (Global Support)

#### A. Lore & Origin
A silent weaver of celestial star-threads from the high Glacial Spires. Lorelai lost her physical voice as a sacrifice to bind a Cosmic Companion Pet—the Ancient Frost-Owl—to her soul. Her harp, carved from petrified cedar and copper wire, plays tunes that directly manipulate battlefield perception, easing the pain of mortal wounds and allowing troops to march without food or rest.

#### B. Personality
Dreamy, soft-spoken (via telepathic harp vibrations), and deeply connected to nature. She holds a vast sadness for the countless souls lost to the Wildlands rifts.

#### C. Kingdom Origin
*The Frostbound Glacial Spires*

#### D. Combat Mechanics
*   **Active Skill 1: Siren Melody (Unlocked at ★0):** Plays a celestial vibration. Soothes battlefield panic, instantly reducing march combat casualties (Wounded transformation rate to Dead decreased by 25%).
*   **Active Skill 2: Canto of Haste (Unlocked at ★2):** Unlocks a mystical tune extending expeditionary march speeds on the world map by +20%.
*   **Ultimate Ability: Requiem of the Stars:** Freezes time on a single selected 3x3 tactical grid, preventing all units inside from taking actions or receiving damage for 1 round.
*   **Passive Bonuses:**
    *   *Healing Speed:* +20%
    *   *March Speed:* +10%

#### E. Ascension Progression (★0 to ★5)
*   **★0:** Base stats. Unlocks *Siren Melody*.
*   **★1:** Shards check: 20. Stats +25%.
*   **★2:** Shards check: 40. Stats +55%. Unlocks *Canto of Haste*.
*   **★3:** Shards check: 80. Stats +90%.
*   **★4:** Shards check: 160. Stats +130%.
*   **★5:** Shards check: 300. Multiplier 2.8x. Unlocks *Requiem of the Stars*.

#### F. Voice Lines & Recruitment Dialogue
*   **Recruitment Quote:** *"*(My strings... they hum in your presence... I shall sing of your Crownspire's rise.)*"*
*   **Idle Line 1:** *"*(The cold wind holds no secrets. It only carries the echoes of forgotten battles.)*"*
*   **Idle Line 2:** *"*(Do you hear the stars, Commander? They predict an alliance forged in starlight.)*"*
*   **Battle Cry:** *"*(Rest now... the stars have taken your burden!)*"*
*   **Victory Line:** *"*(The song concludes in harmony. Collect the remnants of the fallen...)*"*
*   **Defeat Line:** *"*(The strings... they snap... the darkness...)*"*

#### G. Relationship Matrix
*   **Allanna (Sister-in-Faith):** Share ancient records. Lorelai plays chords that complement Allanna's sanctuary barriers.
*   **Shadow (Tragically Linked):** Shadow was once her protector before he was consumed by twilight corruption. She seeks a way to cleanse his dark horseman form.

---

### 3. MYSHLA — THE GEOMANCER
*   **ID:** `myshla`
*   **Rarity:** Mythic
*   **Role:** Gathering / Infrastructure
*   **Preferred Troop Type:** None

#### A. Lore & Origin
Myshla was born to mineral miners in the slate deposits of the Runic Wilds. She recognized that stones operate with slow, rhythmic heartbeats. By engraving runic characters onto heavy stone amulets, she speeds up the quarrying process and locates deep iron seams hidden beneath standard topsoil.

#### B. Personality
Cheerfully eccentric, down-to-earth, and dirty with stone dust. She carries a pocketful of shiny granite rocks, speaking to them as if they were sleeping companion pets.

#### C. Kingdom Origin
*The Whisperwind Runic Wilds*

#### D. Combat Mechanics
*   **Active Skill 1: Mineral Resonance (Unlocked at ★0):** Whispers to stone deposits. Increases Stone and Iron gather speeds by 30% for the next march.
*   **Active Skill 2: Safe Voyage (Unlocked at ★3):** Surrounds supply caravans with pathfinding wind, increasing carrying capacity by 40% and preventing ambush mechanics.
*   **Ultimate Ability: Tectonic Cradle:** Draws up stone barricades on the map, allowing allied gatherers to mine in temporary "Sheltered State" (immune to tile-hitting PvP attacks).
*   **Passive Bonuses:**
    *   *Stone Production:* +25%
    *   *Gather Speed:* +15%

#### E. Ascension Progression (★0 to ★5)
*   **★0:** Base stats. Unlocks *Mineral Resonance*.
*   **★1:** Shards: 20. Stats +25%.
*   **★2:** Shards: 40. Stats +55%.
*   **★3:** Shards: 80. Stats +90%. Unlocks *Safe Voyage*.
*   **★4:** Shards: 160. Stats +130%.
*   **★5:** Shards: 300. Multipliers 2.8x. Unlocks *Tectonic Cradle*.

#### F. Voice Lines & Recruitment Dialogue
*   **Recruitment Quote:** *"Ah, the stones told me you'd be coming! Ready to build something that lasts a century?"*
*   **Idle Line 1:** *"Iron blocks aren't just for hammers. They hold memories of the world's deepest core."*
*   **Idle Line 2:** *"If you build a wall, carve a rune of stability. Otherwise, it's just fancy dirt."*
*   **Battle Cry:** *"Hold firm like the mountains! Rise, earth!"*
*   **Victory Line:** *"Look at all these stones! We'll have the Spire upgraded in no time."*
*   **Defeat Line:** *"The earth is shaking... my stones... they're silent..."*

#### G. Relationship Matrix
*   **Savannah (Scholarly Rivals):** Regularly trade charts on resource nodes. Savannah seeks botanical growth, Myshla seeks crystallizing mineral deposits.
*   **Volkan (Industrial Partners):** Myshla sends elite runic smelting iron directly to Volkan's Forge, ensuring legendary armor production has zero material deficits.

---

### 4. SHADOW — THE SPECTRAL CHARGER
*   **ID:** `shadow`
*   **Rarity:** Mythic
*   **Role:** War / Fleet Mobility
*   **Preferred Troop Type:** Cavalry

#### A. Lore & Origin
Once a grand captain of the Royal Guard in Aethelgard, Shadow took a forbidden blade of twilight magic to turn back a monstrous expansion from the Void gates. The sword fused with his soul, binding him and his stallion to the spectral plane. Now, he operates as a phantom horseman, appearing where battles are most critical to deliver lethal cavalry stabs.

#### B. Personality
Brooding, quiet, and burdened. He refers to himself in the plural, speaking with a dual-toned voice that echoes with the whispers of twilight fragments.

#### C. Kingdom Origin
*The Gloomveil Shrouded Cloister*

#### D. Combat Mechanics
*   **Active Skill 1: Eclipse Guillotine (Unlocked at ★0):** Consumes 90 Energy. Launches backline charges, dealing heavy critical damage to enemy marksmen divisions.
*   **Active Skill 2: Phantom Veil (Unlocked at ★4):** Conceals allied cavalry vanguard lanes with dense fog, granting troops 25% Evasion trait modifiers.
*   **Ultimate Ability: Twilight Stampede:** Commands an ethereal stampede that deals damage equal to 450% of Cavalry Attack to all enemy frontlines and stuns them for 1 round.
*   **Passive Bonuses:**
    *   *Cavalry Attack:* +18%
    *   *March Speed:* +12%

#### E. Ascension Progression (★0 to ★5)
*   **★0:** Base. Unlocks *Eclipse Guillotine*.
*   **★1:** Shards: 20. Stats +25%.
*   **★2:** Shards: 40. Stats +55%.
*   **★3:** Shards: 80. Stats +90%.
*   **★4:** Shards: 160. Stats +130%. Unlocks *Phantom Veil*.
*   **★5:** Shards: 300. Multipliers 2.8x. Unlocks *Twilight Stampede*.

#### F. Voice Lines & Recruitment Dialogue
*   **Recruitment Quote:** *"We are the shadows that ride the fringe. Do you wish to command the twilight, Sovereign?"*
*   **Idle Line 1:** *"The light reveals only what it wants you to see. Trust the dark instead."*
*   **Idle Line 2:** *"My stallion smells the ash of volcanic gates... the hunt is soon."*
*   **Battle Cry:** *"Rupture the ranks! Rise from the fog!"*
*   **Victory Line:** *"They did not even see the steel. We return to the mist."*
*   **Defeat Line:** *"Our shadows... are tearing apart... Lorelai... save..."*

#### G. Relationship Matrix
*   **Lorelai (Guilt & Hope):** Lorelai is the last tether to his former human captaincy. He refuses to enter battle close to her, fearing his dark aura might corrupt her song.
*   **Noxx (Dark Apprenticeship):** Shadow teaches Noxx how to phase through coordinate defenses, turning Noxx's military patrols into deadly traps.

---

### 5. RAYNE — THE STORM RANGER
*   **ID:** `rayne`
*   **Rarity:** Mythic
*   **Role:** Marksmen / Field Artillery
*   **Preferred Troop Type:** Marksmen

#### A. Lore & Origin
A nomadic sky-watcher who learned to draw static lightning into her copper-tipped arrow tips. Living on the Tempest Peaks, she is accompanied by a massive Celestial Eagle Pet. Her bow, carved from a fossilized lightning-struck oak, calls down electrical storms when drawn to maximum extension.

#### B. Personality
Fierce, independent, and unpredictable like an alpine squall. She values personal liberty and dislikes the rigid bureaucracy of Crownspire alliances, joining only when demonic forces threaten the skies.

#### C. Kingdom Origin
*The Tempest Peaks (Bordering Whisperwind)*

#### D. Combat Mechanics
*   **Active Skill 1: Tempest Rain (Unlocked at ★0):** Conjures an arrow barrage that strikes adjacent columns, adding a 15% shock damage debuff for 2 rounds.
*   **Active Skill 2: Gale Guidance (Unlocked at ★2):** Wind pressure aligns arrows, ignoring 20% of heavy armor defense modifiers.
*   **Ultimate Ability: Thunderstruck Volley:** Fires a hyper-charged spear-arrow into the sky. It explodes, dropping chain lightning that arcs across up to 3 enemy units, dealing 300% damage to each.
*   **Passive Bonuses:**
    *   *Marksmen Attack:* +16%
    *   *Marksmen Range:* +10%

#### E. Ascension Progression (★0 to ★5)
*   **★0:** Base. Unlocks *Tempest Rain*.
*   **★1:** Shards: 20. Stats +25%.
*   **★2:** Shards: 40. Stats +55%. Unlocks *Gale Guidance*.
*   **★3:** Shards: 80. Stats +90%.
*   **★4:** Shards: 160. Stats +130%.
*   **★5:** Shards: 300. Multipliers 2.8x. Unlocks *Thunderstruck Volley*.

#### F. Voice Lines & Recruitment Dialogue
*   **Recruitment Quote:** *"The clouds are gathered and lightning is on my tongue. Lead me to the targets."*
*   **Idle Line 1:** *"High coordinate hunting is best. Archers see everything from a ridge."*
*   **Idle Line 2:** *"Don't keep me inside your castle walls too long. The stone suffocates my storms."*
*   **Battle Cry:** *"Hear the thunder! Pierce their skies!"*
*   **Victory Line:** *"Like water after a storm, they washed away. Collect the quiver shards."*
*   **Defeat Line:** *"The wind... has died... the clouds... leave me..."*

#### G. Relationship Matrix
*   **Aria (Ranger Sisterhood):** Aria is her primary scout. When Aria locates a hidden nest of elite drakes, Rayne prepares the long-range lightning arrays.
*   **Skye (Aerodynamic Partners):** Sky and Rayne coordinate aerial maneuvers, pegasus riders pushing targets into Rayne's lightning grids.

---

### 6. REX — THE BURNING SHIELD
*   **ID:** `rex`
*   **Rarity:** Mythic
*   **Role:** Infantry / Main Tank
*   **Preferred Troop Type:** Infantry

#### A. Lore & Origin
Rex is a mountain of volcanic scale, a warden chosen by raw drakes at birth. His skin is covered in hardened ash plating and runic engravings. He stands at the frontlines carrying *The Obsidian Gate*, a legendary towering shield crafted from cooled volcanic glass that absorbing incoming siege attacks.

#### B. Personality
Immense, protective, and slow to speak. He values loyalty above all else, considering himself the physical shield protecting the entire Sovereign alliance network.

#### C. Kingdom Origin
*The Obsidian Volcanic Basins*

#### D. Combat Mechanics
*   **Active Skill 1: Indomitable Stance (Unlocked at ★0):** Locks shield, reducing incoming physical damage by 40% while active.
*   **Active Skill 2: Dragon Vanguard (Unlocked at ★3):** Adds thorns damage. Attackers hit by physical attacks take 20% of their own damage back as retaliation.
*   **Ultimate Ability: Obsidian Bastion (Unlocked at Max Ascension):** Plants his shield, creating a block lane. All allied troops behind his vanguard receive +50% Defense, while Rex heals for 8% of damage taken.
*   **Passive Bonuses:**
    *   *Infantry Defense:* +20%
    *   *Infantry HP:* +15%

#### E. Ascension Progression (★0 to ★5)
*   **★0:** Base. Unlocks *Indomitable Stance*.
*   **★1:** Shards: 20. Stats +25%.
*   **★2:** Shards: 40. Stats +55%.
*   **★3:** Shards: 80. Stats +90%. Unlocks *Dragon Vanguard*.
*   **★4:** Shards: 160. Stats +130%.
*   **★5:** Shards: 300. Multipliers 2.8x. Unlocks *Obsidian Bastion*.

#### F. Voice Lines & Recruitment Dialogue
*   **Recruitment Quote:** *"None shall pass the Obsidian Gate. I am your wall, Sovereign."*
*   **Idle Line 1:** *"Let the arrows rain. They only tickle my volcanic scale armor."*
*   **Idle Line 2:** *"A true warrior doesn't fight for glory. They fight so the young can sleep."*
*   **Battle Cry:** *"Stand behind me! I am the mountain!"*
*   **Victory Line:** *"Our shield held. Clear the battlefield, secure the resources."*
*   **Defeat Line:** *"My gate... has cracked... the vanguard... has fallen..."*

#### G. Relationship Matrix
*   **Maegan (Military Bonds):** They are the ultimate dual-defenders. Maegan directs the field tactical coordinates, Rex ensures those coordinate locations never surrender.
*   **Demon (Tense Alliance):** Rex despises Demon's lack of discipline but respects his destructive fury when invading enemy fortress gates.

---

### 7. LUMI — THE GLACIAL SHAMAN
*   **ID:** `lumi`
*   **Rarity:** Mythic
*   **Role:** Support / Medic
*   **Preferred Troop Type:** None

#### A. Lore & Origin
A hermit shaman from the frozen frost-borders of Crownspire. Lumi spends winters harvesting *Frozen Dew*, a sacred material that crystalizes celestial moonlight. Her healing poultices stabilize units mortally wounded on high-level expeditions, keeping the army's casualty ranks low.

#### B. Personality
Gentle, quiet, and deeply spiritual. She refers to the winter wind as her grandfather and has a deep maternal protection over all wounded recruits.

#### C. Kingdom Origin
*Glacial Hermit Valleys*

#### D. Combat Mechanics
*   **Active Skill 1: Glacial Rejuvenation (Unlocked at ★0):** Consumes 80 Energy. Uses frozen herbs, instantly healing the most damaged allied column by 250% of Lumi's basic healing stat.
*   **Active Skill 2: Blizzard Ward (Unlocked at ★2):** Creates a hail storm, reducing incoming enemy ranged damage by 15%.
*   **Ultimate Ability: Aurora Frost-Gate:** Conjures a brilliant light that grants all allied troops the "Grave Ward" trait for 2 rounds: any unit that would take fatal damage survives with 1 HP.
*   **Passive Bonuses:**
    *   *Healing Cost Reduction:* +15%
    *   *Troop Health:* +10%

#### E. Ascension Progression (★0 to ★5)
*   **★0:** Base. Unlocks *Glacial Rejuvenation*.
*   **★1:** Shards: 20. Stats +25%.
*   **★2:** Shards: 40. Stats +55%. Unlocks *Blizzard Ward*.
*   **★3:** Shards: 80. Stats +90%.
*   **★4:** Shards: 160. Stats +130%.
*   **★5:** Shards: 300. Multipliers 2.8x. Unlocks *Aurora Frost-Gate*.

#### F. Voice Lines & Recruitment Dialogue
*   **Recruitment Quote:** *"The storm is cold, but my hearth is warm. Let me heal the wounds of your kingdom."*
*   **Idle Line 1:** *"Freeze-dried herbs keep their magical qualities longer than standard dried leaves."*
*   **Idle Line 2:** *"A warrior healed is another sword to defend the spire. We must waste no life."*
*   **Battle Cry:** *"Let the frost protect you! Scurry, dark winds!"*
*   **Victory Line:** *"Our bodies are whole. We rest now around the sovereign fire."*
*   **Defeat Line:** *"I can't... freeze the bleeding... it is... too cold..."*

#### G. Relationship Matrix
*   **Lorelai (Soul Sisters):** Work in perfect healing unison. Lorelai calms the mind while Lumi mends the flesh, making their joint hospital camps highly efficient.
*   **Dominic (Respect):** Dominic brings his injured vanguards to Lumi first, knowing she treats veteran soldiers with supreme care.

---

### 8. HEAVEN — THE CELESTIAL LANCE
*   **ID:** `heaven`
*   **Rarity:** Mythic
*   **Role:** War / Cavalry Burst
*   **Preferred Troop Type:** Cavalry

#### A. Lore & Origin
Heaven is a heavy paladin of the Solar Order, riding a massive, copper-plated celestial unicorn companion. Born to high nobility in Aethelgard, he swore the Oath of the Celestial Spire. Wielding *The Seraphic Lance*, a long runic lance illuminated by white starfire, he leads direct charges to puncture elite defensive lines.

#### B. Personality
Bold, righteous, and charismatic. He speaks of honor, justice, and the inevitable triumph of light. He lacks subtlety, preferring direct frontal charges over stealth tactics.

#### C. Kingdom Origin
*High Kingdom of Aethelgard (Solar Cathedral)*

#### D. Combat Mechanics
*   **Active Skill 1: Seraphic Lance (Unlocked at ★0):** Consumes 100 Energy. Charges at the center-most enemy column, dealing heavy lance damage and reducing their counter-attack rating by 30%.
*   **Active Skill 2: Aura of Sanctity (Unlocked at ★4):** Radiates holy courage. Boosts the critical hit strike rate of all allied cavalry divisions by 15%.
*   **Ultimate Ability: Sword of the Heavens:** Summons a massive blade of pure starfire from the sky, striking the highest-power enemy target for 600% physical-magic damage.
*   **Passive Bonuses:**
    *   *Cavalry Defense:* +18%
    *   *Troop Attack:* +12%

#### E. Ascension Progression (★0 to ★5)
*   **★0:** Base. Unlocks *Seraphic Lance*.
*   **★1:** Shards: 20. Stats +25%.
*   **★2:** Shards: 40. Stats +55%.
*   **★3:** Shards: 80. Stats +90%.
*   **★4:** Shards: 160. Stats +130%. Unlocks *Aura of Sanctity*.
*   **★5:** Shards: 300. Multipliers 2.8x. Unlocks *Sword of the Heavens*.

#### F. Voice Lines & Recruitment Dialogue
*   **Recruitment Quote:** *"The light guides my charge! Where shall my lance strike, Sovereign?"*
*   **Idle Line 1:** *"A sword of honor never rusts. Keep your armor polished, recruits."*
*   **Idle Line 2:** *"The darkness in the Gloomveil grows... we must prepare of holy marches."*
*   **Battle Cry:** *"For justice and the Spire! Charge!"*
*   **Victory Line:** *"A glorious triumph! The darkness stands no chance against our combined steel!"*
*   **Defeat Line:** *"My lance... shattered... the starfire... has faded..."*

#### G. Relationship Matrix
*   **Maegan (Military Alliance):** Fully respects Maegan's strategic command but sometimes takes unauthorized early charges, frustrating her meticulous siege schedules.
*   **Demon (Absolute Nemesis):** Seeks to permanently purge Demon back to the deepest magma chasms, declaring court battles against his infernal lineage.

---

### 9. DEMON — THE VOLCANIC BERSERKER
*   **ID:** `demon`
*   **Rarity:** Mythic
*   **Role:** War / High DPS
*   **Preferred Troop Type:** Infantry

#### A. Lore & Origin
A demonic champion born from the volcanic rifts of the Obsidian Spurn. After eating a burning Dragonblood Ruby as a child, his blood turned to roaring magma. He carries *The Brimstone Blade*, a broad sword that constantly drips thick liquid lava, melting defensive equipment and burning hostile armies from within.

#### B. Personality
Savage, hot-tempered, and chaotic. He lives for the rush of battlefield bloodshed, laughing maniacally as volcanic fissures rip apart defense coordinates.

#### C. Kingdom Origin
*The Obsidian Volcanic Basins*

#### D. Combat Mechanics
*   **Active Skill 1: Hellfire Frenzy (Unlocked at ★0):** Consumes 110 Energy. Consumes 10% of Current Infantry HP, but raises basic infantry attack speed by 60% and attack rating by 40% for 3 rounds.
*   **Active Skill 2: Obsidian Rupture (Unlocked at ★3):** Slams blade down, opening a fissure. Stuns the opposing vanguard column for 1 round.
*   **Ultimate Ability: Magma Awakening:** Enters a volcanic state for 2 rounds. Every basic hit deals splash damage to adjacent grids and applies a "Burning Dot" that deals 50% damage per round.
*   **Passive Bonuses:**
    *   *Infantry Attack:* +22%
    *   *Troop Defense:* +8%

#### E. Ascension Progression (★0 to ★5)
*   **★0:** Base. Unlocks *Hellfire Frenzy*.
*   **★1:** Shards: 20. Stats +25%.
*   **★2:** Shards: 40. Stats +55%.
*   **★3:** Shards: 80. Stats +90%. Unlocks *Obsidian Rupture*.
*   **★4:** Shards: 160. Stats +130%.
*   **★5:** Shards: 300. Multipliers 2.8x. Unlocks *Magma Awakening*.

#### F. Voice Lines & Recruitment Dialogue
*   **Recruitment Quote:** *"Aha! More blood for the forge! Direct me to where the soft meat hides, weakling!"*
*   **Idle Line 1:** *"The sound of crushing bones is far better than Lorelai's annoying little harp songs."*
*   **Idle Line 2:** *"I don't need a shield. My skin was tempered in the deepest rift of the Spurn."*
*   **Battle Cry:** *"Burn! Melt! Crush them all!"*
*   **Victory Line:** *"Ahahaha! Look at their melted armor! We pillage their copper stockpiles!"*
*   **Defeat Line:** *"The ashes... are cooling... my blood... is freezing..."*

#### G. Relationship Matrix
*   **Heaven (Blood Feud):** They exchange insults whenever they meet, requiring the Sovereign to physically separate their coordinate positions inside general camps.
*   **Volkan (Industrial Rivalry):** Volkan attempts to hammer Demon's volcanic rage into strategic weapons, while Demon tries to steal Volkan's smelting fuels.

---

## SECTION II: LEGENDARY HERO ARCHETYPES (THE MASTERS OF WAR)

---

### 10. ALLANNA — THE HIGH PRIESTESS
*   **ID:** `allanna`
*   **Rarity:** Legendary
*   **Role:** Support / Protection
*   **Preferred Troop Type:** None

#### A. Lore & Origin
The premier keeper of the Starspire Cathedral. Allanna wields light magics to establish defensive protective shields over young soldiers, minimizing hospital casualties during alliance operations.

#### B. Personality
Compassionate, serene, and deeply loyal to the coalition. She speaks in tranquil whisperings.

#### C. Kingdom Origin
*Starspire Cathedral (High Kingdom border)*

#### D. Combat Mechanics
*   **Active Skill: Sanctuary Dome (Unlocked at ★0):** Consumes 80 Energy. Erects a spiritual barrier around ally ranks, absorbing physical shockwaves.
*   **Ultimate Ability: Divine Intervention:** Heals all friendly units for 150% of her support value and raises army-wide defense ratings by 20% for 2 rounds.
*   **Passive Bonuses:**
    *   *Medic Capacity:* +25%
    *   *Troop Defense:* +10%

#### E. Ascension Progression
Standard Legendary curves (15 -> 30 -> 60 -> 120 -> 220 shards) unlocking stat multipliers from 1.0x to 2.5x.

#### F. Dialogue
*   **Recruitment:** *"Under the light of the Spire, we shall defend this realm in perfect unity."*
*   **Battle Cry:** *"The light of stars shall not fade!"*

---

### 11. SAVANNAH — THE PLAINS SCHOLAR
*   **ID:** `savannah`
*   **Rarity:** Legendary
*   **Role:** Gathering / Production
*   **Preferred Troop Type:** None

#### A. Lore & Origin
An agronomist from Aethelgard's agricultural sectors. She studies weather sequences and crop rotations, ensuring the city stockpiles food to sustain high-tier recruitment.

#### B. Personality
Studious, dry, and highly practical. She carries books of seed catalogs.

#### C. Kingdom Origin
*Bountiful Plains of Aethelgard*

#### D. Combat Mechanics
*   **Active Skill: Bountiful Plains (Unlocked at ★0):** Organizes sweeps on wheat fields, boosting food extraction volume.
*   **Ultimate Ability: Harvest Crown:** Instantly finishes the current gathering march queue if it is within 5 minutes of coordinate completion.
*   **Passive Bonuses:**
    *   *Food Production:* +25%
    *   *Gather Speed:* +12%

#### E. Ascension Progression
Standard Legendary curves scale her food multipliers and speed factors.

#### F. Dialogue
*   **Recruitment:** *"Wars are won in the silos, not just on the siege battlefield. Let us count the stores."*
*   **Battle Cry:** *"Protect the fields! Secure our harvest!"*

---

### 12. ARIA — THE SCOUT BOW
*   **ID:** `aria`
*   **Rarity:** Legendary
*   **Role:** Marksmen / Single-Target Damage
*   **Preferred Troop Type:** Marksmen

#### A. Lore & Origin
A mute forest ranger who tracks targets via bird patterns. Her copper-backed bow shoots silent projectiles that alert allied marksmen to hostile coordinate weaknesses.

#### B. Personality
Sly, alert, and comfortable with isolation.

#### C. Kingdom Origin
*Whisperwind Runic Wilds*

#### D. Combat Mechanics
*   **Active Skill: Vibrato Bolt (Unlocked at ★0):** Consumes 90 Energy. Launches rapid copper arrows on targeted enemy squads.
*   **Ultimate Ability: Silent Requiem:** Fires a tracking beacon arrow. The targeted enemy unit is "Marked": takes 30% more damage from all allied archers for 2 rounds.
*   **Passive Bonuses:**
    *   *Marksmen Attack:* +14%
    *   *Marksmen HP:* +8%

#### E. Dialogue
*   **Recruitment:** *"*(An arrow is knocked, then pointed forward. No words are spoken, only a deep nod of service.)*"*
*   **Battle Cry:** *"*(Silent releases of the string.)*"*

---

### 13. DOMINIC — THE PIKE DRUM
*   **ID:** `dominic`
*   **Rarity:** Legendary
*   **Role:** Infantry / Formations
*   **Preferred Troop Type:** Infantry

#### A. Lore & Origin
A decorated sergeant of the infantry corps. Wielding a heavy war-pike and carrying a runic drum, he maintains marching rhythm during massive castle defensive maneuvers.

#### B. Personality
Gravelly, protective, and traditional. He treats every fresh recruit as his personal ward.

#### C. Kingdom Origin
*Aethelgard Frontlines*

#### D. Combat Mechanics
*   **Active Skill: Phalanx Wall (Unlocked at ★0):** Consumes 100 Energy. Fortifies infantry coordination, doubling shield capacity and reducing flanking cavalry damage by 25%.
*   **Ultimate Ability: Sergeant's Beat:** Beats the runic drum. All infantry units gain 20% Health and retaliate with 25% increased physical damage for 3 rounds.
*   **Passive Bonuses:**
    *   *Infantry Defense:* +15%
    *   *Infantry Attack:* +10%

#### E. Dialogue
*   **Recruitment:** *"Hold your spears straight! Form up! Let us see if your spine is tempered, Sovereign!"*
*   **Battle Cry:** *"Form Phalanx! Hold the line!"*

---

### 14. SKYE — THE ZEPHYR RIDER
*   **ID:** `skye`
*   **Rarity:** Legendary
*   **Role:** Cavalry / Fast Strike
*   **Preferred Troop Type:** Cavalry

#### A. Lore & Origin
A pegasus commander from Aethelgard's high cloudfortresses. She guides aerial divisions to bypass enemy vanguard shields, striking high-value target marksmen.

#### B. Personality
Daring, enthusiastic, and highly expressive.

#### C. Kingdom Origin
*Zephyr Cloudfortress*

#### D. Combat Mechanics
*   **Active Skill: Zephyr Strike (Unlocked at ★0):** Consumes 100 Energy. Swoops down, creating wind gusts that scatter enemy archer columns.
*   **Ultimate Ability: Skyborne Dive:** Coordinates a fast pegasus charge that deals 400% cavalry damage and decreases enemy marching speeds by 30%.
*   **Passive Bonuses:**
    *   *Cavalry Attack:* +15%
    *   *March Speed:* +10%

#### E. Dialogue
*   **Recruitment:** *"The skies are clear, the wind is at our wing. Ready for deployment from above!"*
*   **Battle Cry:** *"Justice hits from the sun!"*

---

### 15. NOXX — THE PLAGUE KNIGHT
*   **ID:** `noxx`
*   **Rarity:** Legendary
*   **Role:** War / Combat Debuff
*   **Preferred Troop Type:** Cavalry

#### A. Lore & Origin
A rogue horseman wearing a copper beak mask. Following coordinate experiments on decaying rifts, he carries plague canisters containing toxins that corrupt enemy attack formations.

#### B. Personality
Sarcastic, clinical, and obsessive.

#### C. Kingdom Origin
*Gloomveil Shrouded Cloister*

#### D. Combat Mechanics
*   **Active Skill: Plague Blade (Unlocked at ★0):** Consumes 100 Energy. Strikes, applying "Decay": drains enemy power and reduces attack values by 20% for 2 rounds.
*   **Ultimate Ability: Toxic Rot:** Splashes acidic blight onto a 3x3 tactical grid, dealing 120% magic poison damage over 3 consecutive turns.
*   **Passive Bonuses:**
    *   *Troop Attack:* +12%
    *   *Cavalry Defense:* +12%

#### E. Dialogue
*   **Recruitment:** *"An interesting specimen... your kingdom holds strong genes. Shall we infect their lines?"*
*   **Battle Cry:** *"Let decay consume your strength!"*

---

### 16. REMI — THE CROWN ARCHITECT
*   **ID:** `remi`
*   **Rarity:** Legendary
*   **Role:** Support / Municipal Development
*   **Preferred Troop Type:** None

#### A. Lore & Origin
Crownspire's premier urban architect. Carrying extensive copper charts, Remi coordinates the alignment of stone towers, saving resources during castle expansion.

#### B. Personality
Pragmatic, detail-oriented, and perpetually anxious about budget calculations.

#### C. Kingdom Origin
*The Masonry Valleys (Sovereign seat)*

#### D. Combat Mechanics
*   **Active Skill: Master Masonry (Unlocked at ★0):** Consumes 80 Energy. Provides progress boosts on municipal structures inside sanctuary walls.
*   **Ultimate Ability: Structural Reinforcement:** Casts structural wards. Allied castle gates receive 40% increased physical HP during defense sieges.
*   **Passive Bonuses:**
    *   *Construction Speed:* +12%
    *   *Wood Production:* +15%

#### E. Dialogue
*   **Recruitment:** *"A proper angle prevents structural collapse under dragonfire. Let's draft your Spire."*
*   **Battle Cry:** *"Reinforce the foundation poles!"*

---

### 17. FAITH — THE SACRED CODEX
*   **ID:** `faith`
*   **Rarity:** Legendary
*   **Role:** Support / Technological Research
*   **Preferred Troop Type:** None

#### A. Lore & Origin
A researcher of historic tablets residing inside the Sovereign Spire. She translates slate engravings to optimize alliance-wide tech research curves.

#### B. Personality
Scholarly, introverted, and holds a vast database repository mind.

#### C. Kingdom Origin
*Sovereign Spire Library*

#### D. Combat Mechanics
*   **Active Skill: Enlightenment (Unlocked at ★0):** Channels focus, reducing active research timelines on specific celestial runes.
*   **Ultimate Ability: Runic Revelation:** Instantly grants all allied legions in the same grid 10% boosted magic resistance for 3 rounds.
*   **Passive Bonuses:**
    *   *Research Speed:* +12%
    *   *Iron Production:* +15%

#### E. Dialogue
*   **Recruitment:** *"History holds all answers to modern rifts. Let us decipher the ancient scripts."*
*   **Battle Cry:** *"The old scrolls speak of your demise!"*

---

### 18. VOLKAN — THE FORGE MASTER
*   **ID:** `volkan`
*   **Rarity:** Legendary
*   **Role:** War / Defense Shred
*   **Preferred Troop Type:** Infantry

#### A. Lore & Origin
Sovereign Forge's master ironworker. His muscular arms hold scars from copper sparks. Swinging *The Sledge of Melting*, he cracks defensive plates in melee combat.

#### B. Personality
Gruff, loud, and works with extreme dedication. He defines true quality by the strike of the hammer.

#### C. Kingdom Origin
*Sovereign Spire Forge*

#### D. Combat Mechanics
*   **Active Skill: Sledge Smash (Unlocked at ★0):** Consumes 100 Energy. Smashes shields, reducing targeted enemy defense ratings by 25% for 3 rounds.
*   **Ultimate Ability: Molten Hammer:** Volkan strikes the ground, creating a wall of heat. Striken enemies lose their defensive gear stats for 2 rounds.
*   **Passive Bonuses:**
    *   *Infantry Attack:* +16%
    *   *Troop HP:* +8%

#### E. Dialogue
*   **Recruitment:** *"If your blade is weak, your kingdom is hollow. Let us put your copper in the fire!"*
*   **Battle Cry:** *"CRACK THE METAL!"*

---

### 19. HUARUNG — THE JADE EYE
*   **ID:** `huarung`
*   **Rarity:** Legendary
*   **Role:** Marksmen / Focus Fire
*   **Preferred Troop Type:** Marksmen

#### A. Lore & Origin
An archer from the Eastward Jade Spires. He trains his eyes by watching wind movements and can split single willow leaves from miles away.

#### B. Personality
Disciplined, quiet, and operates with absolute precision.

#### C. Kingdom Origin
*Eastward Jade Spires*

#### D. Combat Mechanics
*   **Active Skill: Grounded Sight (Unlocked at ★0):** Consumes 90 Energy. Focuses posture, increasing archer crit rating by 20% for 2 rounds.
*   **Ultimate Ability: Wind-Piercer Star:** Fires a heavy iron bolt that bypasses physical defense obstacles, dealing 450% damage to the backmost enemy commander.
*   **Passive Bonuses:**
    *   *Marksmen Attack:* +18%
    *   *Marksmen Defense:* +8%

#### E. Dialogue
*   **Recruitment:** *"The wind breathes the target locations in my ear. Ready, Sovereign."*
*   **Battle Cry:** *"One shoot, one stars alignment!"*

---

### 20. VIOLET — THE TOXIN SHIV
*   **ID:** `violet`
*   **Rarity:** Legendary
*   **Role:** Cavalry / Fast Infiltration
*   **Preferred Troop Type:** Cavalry

#### A. Lore & Origin
An assassin of the Shadow Cloister. Using violet-dyed daggers coated in venomous forest mushrooms, she enters battle ahead of the main cavalry lines.

#### B. Personality
Playful, dangerous, and likes to mock targets before striking.

#### C. Kingdom Origin
*Gloomveil Shrouded Cloister*

#### D. Combat Mechanics
*   **Active Skill: Viper Slash (Unlocked at ★0):** Consumes 90 Energy. Launches double dagger strikes on flanking archer divisions.
*   **Ultimate Ability: Midnight Mirage:** Teleports her horse division to a flank spot, dealing 380% mechanical attack damage and applying silence metrics to targeted skills.
*   **Passive Bonuses:**
    *   *Cavalry Attack:* +16%
    *   *March Speed:* +8%

#### E. Dialogue
*   **Recruitment:** *"You have a pretty neck, Sovereign. Let's make sure nobody cuts it but me."*
*   **Battle Cry:** *"Time to prick your bubble!"*

---

## SECTION III: EPIC RETINUE SPECIALISTS (MUTUAL TEMPLATE ENGINE)
Epic specialists (including **Sebastian, Josh, Paul, Tony, Chase, Everest, Jayden, Karlie, Makenzi, Jazzy, Jose, Lindsey, Lisa, Dana, Jamie**) operate as structural legion commanders under regional divisions.

*   **Active Skill Model:** *[Name]'s Gambit* — Activates localized battlefield alignments, boosting combat variables by +15% on nearby grids.
*   **Unlock Method:** Tavern recruiters using Standard Gacha.
*   **Role & Function:** F2P foundational commanders to staff outposts, garrison alliance warehouses, and coordinate regional daily gathering coordinates.

---

## SECTION IV: COMPLETE SYSTEM INTEGRATION & COMPILATION MATRIX
This Hero Design Bible coordinates directly with `/src/utils/heroDatabase.ts` and `/heroes.json` inside our Godot and web build folders. All voice cues, character files, and animation matrices must load directly using the keys (`id` fields) defined within. Any expansion of the roster must follow these strict runic terminology standards.
