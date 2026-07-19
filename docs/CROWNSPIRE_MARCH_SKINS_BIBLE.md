# CROWNSPIRE: MARCH SKIN PRODUCTION BIBLE
**Official Character Movement, Art Direction, and Technical VFX Registry**
**Version 1.0.0 (Character Art / Technical Animation Core) | Confidential - Crownspire Studio Operations**

---

## 🎨 SECTION I: ART DIRECTION & TECHNICAL SPECIFICATIONS

This production document serves as the absolute visual and technical standard for all environment artists, tech-animators, and VFX coordinate designers working on **Crownspire’s March Skins**. 

### 1. Style Guide: 2.5D Pixar-Style MMO
- **Visual Volume (Chunky Outlines):** All marching troops, mounts, and vehicles must have rounded, thick bevels (minimum 10cm virtual radius) to capture clean specular highlights. Thin lines and ultra-detailed realistic grids are strictly forbidden. 
- **The Bounce-and-Step Rigging Rule:** Units on the world map do not glide flatly. Moving legions must ride on a heavy, rhythm-synchronized loop. Mount joints must deform using squash-and-stretch parameters: compress vertical scale ($Y$) to $0.85\times$ on ground contact, stretching to $1.15\times$ upon leap frames.
- **Graphic Readability:** To maintain extreme clarity on high-zoom-out world maps, every march skin is supported by high-contrast trailing footprints (VFX steps), floating dust meshes, or ambient glowing ground glyphs.

```
                            [ MARCH SCREEN COMPOSITION ]
                            
                              / \         / \
                             /   \       /   \     <-- Led by Mounted Commanders or
                            /_____\     /_____\        Over-sized Companion Beasts
                           |       |   |       |
                           | [CMD] |   | [PET] |
                            \_____/     \_____/
                               |           |
                     +---------+-----------+---------+
                     |  _   _   _   _   _   _   _   _| <-- Ranks of Chunky Infantry,
                     | |_| |_| |_| |_| |_| |_| |_| |_|     Cavalry, and Marksmen
                     +-------------------------------+
                       *   *   *   *   *   *   *   *   <-- Saturated Trailing Footprints
                        *   *   *   *   *   *   *   *      (VFX Particle Coordinates)
```

### 2. The Anti-P2W Utility Balance Mandate
To respect the **Anti-Pay-To-Win (Anti-P2W) Mandate** of *Crownspire*, march skins **never** award direct combat modifiers (such as troop health, attack percentage, critical chance, or army size). Instead, stat bonuses are strictly limited to **Time-Utility, Logistics, Macro-Progression, and Exploration Efficiency**:
- **March Speed (General / Monsters / Alliance Rallies):** Reduces physical transition times.
- **Gathering Rates (Wood / Slate / Food / Iron):** Boosts extraction speeds on map nodes.
- **Load Capacity (Transport / Plunder):** Determines raw cargo hauling limits per march.
- **Stamina/Energy Preservation:** Reduces energy consumption rates during world-boss encounters.

---

## 💎 SECTION II: THE 100 MARCH SKINS REGISTRY

---

### GROUP A: ANIMAL RUNNERS (Skins 1 - 10)
Highly organic, cute-but-heroic woodland and mountain creatures fitted with leather saddles.

| ID | Name | Theme | Rarity | Color Palette | Stat Bonus | Unlock Method |
|:---:|:---|:---|:---|:---|:---|:---|
| **1** | **Spruce Timber-Buck** | Autumn Meadow Deer | Common | `#8D6E63`, `#FFF9C4` | +2% Wood Gather rate | Standard Campaign tutorial |
| **2** | **Great Mountain Boar** | Heavy Plun-Boar | Common | `#5D4037`, `#3E2723` | +5% Load Capacity | Complete 5 Forest patrols |
| **3** | **Frost-Fur Mastiff** | loyal Guardian Dog | Common | `#ECEFF1`, `#78909C` | +3% general March speed | Achieve Level 5 Watchtower |
| **4** | **Alpine Ridge Goat** | Rocky Crag Jumper | Common | `#CFD8DC`, `#90A4AE` | +2% Slate Gather speed | Harvest 50,000 Slate |
| **5** | **Deep-Bay Badger** | Relentless excavator | Uncommon | `#212121`, `#ECEFF1` | +4% Iron Gather speed | Defeat 10 Miner camps on map |
| **6** | **Golden-Grain Fox** | Hyper-active Scout | Uncommon | `#FFB300`, `#FFFFFF` | +5% Scout March Speed | Find 3 Hidden map caches |
| **7** | **Shadow-Talon Owl** | Silent Night-Glider | Uncommon | `#37474F`, `#9575CD` | +4% Night March Speed | Complete 15 Night adventures |
| **8** | **Highland Pack Mule** | Heavy Cargo Donkey | Uncommon | `#A1887F`, `#5D4037` | +10% Iron Load Capacity | Trade 1,000 Cargo bags |
| **9** | **Clover Meadow Otter**| playful Aquatic Otter | Rare | `#4DB6AC`, `#E0F2F1` | +5% Food Gather speed | Cleanse 5 Swamp Grottoes |
| **10**| **Royal Vanguard Wolf**| Majestic armored Wolf | Epic | `#0D47A1`, `#ECEFF1` | +7% Monster March Speed | Purchase Warlord Kit ($9.99) |

*   **Skins 1-10 Visual Descriptions & Animation Behavior:**
    *   *Visuals:* Heavy wooden armor pieces, oversized saddles with dangling metal supply pots, and big expressive eyes.
    *   *Animations:* Heavy waddling steps with soft bounces. The high-tier wolves and boars emit mud splashing particles behind their stumpy paws.

---

### GROUP B: MYTHICAL BEASTS (Skins 11 - 20)
Fanciful creatures of ancient land lore carrying magical dust footprints.

| ID | Name | Theme | Rarity | Color Palette | Stat Bonus | Unlock Method |
|:---:|:---|:---|:---|:---|:---|:---|
| **11** | **Skyward Gryphon Sentry**| Flight Aviator chick | Rare | `#FFB300`, `#FFFFFF` | +6% Aerial March speed | Hatch 1 Uncommon Wind-Egg |
| **12** | **Emerald Kirin** | Forest Spirit stag | Rare | `#2E7D32`, `#A5D6A7` | +5% Wood Gather speed | Plant 100 Alliance Saplings |
| **13** | **Dune Centaur Scout**| Quick-trot Archer | Rare | `#EF6C00`, `#FFF9C4` | +6% Desert March speed | Secure 3 Oasis Coordinate slots |
| **14** | **Basalt Golem Roller**| Tectonic rolling stone | Epic | `#212121`, `#78909C` | +8% Slate Gather speed | Mine 5,000,000 Slate blocks |
| **15** | **Rune-Horn Unicorn** | Majestic holy mount | Epic | `#E0F7FA`, `#F5EEF8` | +7% Alliance Help speed | Help allies 100 times |
| **16** | **Tundra Ice-Warg** | Heavy-furred wolf | Epic | `#80DEEA`, `#FFFFFF` | +8% Tundra March speed | Achieve Level 15 Hospital Wards |
| **17** | **Hippogryph Pride** | Elegant feather horse | Epic | `#ECEFF1`, `#00E5FF` | +8% River crossing speed | Clear 10 River Outpost nodes |
| **18** | **Cinder Cat Lurcher** | Molten lava leopard | Epic | `#D84315`, `#FF8F00` | +8% Monster March speed | Slay 15 Volcanic Hatchlings |
| **19** | **Void Star-Stalker** | levitating dark panther | Legendary | `#4A148C`, `#000000` | +10% Night March Speed | Complete Void Rift events |
| **20** | **Celestial Pegasus** | Shimmering wing-horse | Legendary | `#D4AF37`, `#FFFFFF` | +10% Grand Temple Speed | Sovereign Ascension (VIP Lvl 15) |

*   **Skins 11-20 Visual Descriptions & Animation Behavior:**
    *   *Visuals:* Draped in ancient runic rugs, brass or crystal reins, floating tail ribbons, and glowing eyes.
    *   *Animations:* Units glide or gallop in elegant wave patterns. The Kirin leaves trailing neon-green leaf particles, while the Centaur leaves dust cones.

---

### GROUP C: DRAGON MAJESTIES (Skins 21 - 30)
Colossal draconic escorts that fly high above the vanguard units.

| ID | Name | Theme | Rarity | Color Palette | Stat Bonus | Unlock Method |
|:---:|:---|:---|:---|:---|:---|:---|
| **21** | **Ember Drake Fledgling**| fire-spitting whelp | Rare | `#C0392B`, `#E67E22` | +5% Magma-Tile Gathering | Defeat Ignis Baby Boss 5 times |
| **22** | **Stormwind Glider** | Teal lightning drakeling| Rare | `#00F2FE`, `#1A365D` | +6% Wind-Terrain March | Match-3 Spark Event level 50 |
| **23** | **Tenebris Star-Whelp**| Shadow vortex hatchling| Rare | `#0A0314`, `#8E44AD` | +6% Dark-Grid March | Spend 500 Gems in Store |
| **24** | **Cryoshard Runner** | Glacial ice drakeling | Epic | `#CEF0FF`, `#00A3FF` | +8% Ice-Collect speed | Slay 15 Glacial Sprout drakes |
| **25** | **Gaia Vine-Glider** | Forest brentwood drake | Epic | `#4E3629`, `#2E7D32` | +8% Wood Gather rate | Slay 15 Vine-Weaver drakes |
| **26** | **Bronze Scholar-Drake**| heavy brass drake | Epic | `#B87333`, `#F1C40F` | +8% Ruins March speed | Complete 25 Research projects |
| **27** | **Wyvern Pathfinder** | jagged desert wyvern | Epic | `#FF8F00`, `#3E2723` | +8% Desert March speed | Traverse 2,000 Desert coordinate slots |
| **28** | **Gilded Crown-Drake** | Royal parade drake | Legendary | `#FFD54F`, `#0D47A1` | +10% Cargo Load Capacity| Reach Level 25 Citadel Keep |
| **29** | **Ashen Star Leviathan**| Volcanic molten titan | Legendary | `#1B1212`, `#FF3300` | -15% World-Boss Stamina | Slay 30 Volcanic Elder Dragons |
| **30** | **Cosmic Rift Weaver** | Levitating void dragon | Legendary | `#8E44AD`, `#3498DB` | +12% Rift Transit speed | Merge 50 Void Energy stars |

*   **Skins 21-30 Visual Descriptions & Animation Behavior:**
    *   *Visuals:* Saturated skin plates, gold-veined wing canvases, glowing throats, and smoke venting from nasal cavities.
    *   *Animations:* The dragons hover above troops, executing slow wing-strokes. On mouse click, they spin around, breathing colorful sparks.

---

### GROUP D: CELESTIAL ORBITS (Skins 31 - 40)
Stardust-infused stellar entities carrying floating planetary gear systems.

| ID | Name | Theme | Rarity | Color Palette | Stat Bonus | Unlock Method |
|:---:|:---|:---|:---|:---|:---|:---|
| **31** | **Orion Asteroid-Hopper**| crystal-capped goat | Rare | `#3F2B96`, `#00E5FF` | +6% Slate Gather speed | Complete 3 Asteroid Match levels |
| **32** | **Andromeda Feline** | violet space cat | Rare | `#8E44AD`, `#FF80AB` | +6% general March speed | Complete the Autumn Battle Pass |
| **33** | **Nebula Star-Pony**| Levitating starry horse | Epic | `#6A1B9A`, `#E0F7FA` | +8% Alliance Trade speed | Help 50 Allies with resource runs |
| **34** | **Ursa Major Cub** | Glowing blue baby bear | Epic | `#0D47A1`, `#80DEEA` | +8% Iron Gather speed | Harvest 1,000,000 Iron ore |
| **35** | **Solar-Flare Phoenix**| Small solar hawk | Epic | `#FF6D00`, `#FFD54F` | +8% Food Gather speed | Slay 10 Sun-Ember camps |
| **36** | **Comet Tail-Wiggle** | Translucent starry dog | Epic | `#0091EA`, `#FFFFFF` | +8% Scout travel speed | Explore 100 unexplored clouds |
| **37** | **Eclipse Shade-Stray**| Dark purple shadow wolf | Epic | `#1A237E`, `#9575CD` | +8% Night March Speed | Reach Level 15 Sanctuary Temple |
| **38** | **Cassiopeia Swan** | White star-wing bird | Legendary | `#FFF8E1`, `#FFD54F` | +10% Shrine March Speed | Complete Chapter 8 Campaign |
| **39** | **Astral Golem Pacer** | Floating obsidian titan | Legendary | `#121212`, `#00E5FF` | +10% Stone Load Capacity| Level 10 Research Hall |
| **40** | **Sovereign Star-Lion**| Royal gold space lion | Legendary | `#D4AF37`, `#6A1B9A` | +12% General March Speed| Sovereign Ascension (VIP Lvl 18) |

*   **Skins 31-40 Visual Descriptions & Animation Behavior:**
    *   *Visuals:* Semi-transparent glass bodies enclosing swirling galaxies, floating stellar halos, and glowing star markings.
    *   *Animations:* Completely frictionless floating motions. Starry constellations form beneath their track routes and fade after 2 seconds.

---

### GROUP E: SEASONAL WORKERS (Skins 41 - 50)
Themed around world calendar changes, forest blooms, and autumn harvests.

| ID | Name | Theme | Rarity | Color Palette | Stat Bonus | Unlock Method |
|:---:|:---|:---|:---|:---|:---|:---|
| **41** | **Sprout-Snail Caravan**| Huge moss-topped snail | Rare | `#4CAF50`, `#FFF9C4` | +6% Wood Gather rate | Standard Spring Battle Pass |
| **42** | **Blossom Flutter-Deer**| Flower-trailing deer | Rare | `#E1BEE7`, `#FFFFFF` | +6% Food Gather speed | Plant 50 Blossom trees |
| **43** | **Suntan Sand-Crab** | beach-umbrella crab | Rare | `#FF5722`, `#00BCD4` | +6% Water-Terrain March | Summer Beach-Hunt (Level 30) |
| **44** | **Maple Leaf Hedgehog**| Cinnamon spiky hedge-pig | Epic | `#D84315`, `#8D6E63` | +8% Load Capacity | Harvest 50,000 Wood cargo |
| **45** | **Pumpkin Seed-Sack** | hopping pumpkin bag | Epic | `#E65100`, `#4A148C` | +8% Food Load Capacity | Trade 15 Pumpkin Coins |
| **46** | **Yukon Snow-Sledge** | Husky dog-sledge | Epic | `#ECEFF1`, `#37474F` | +8% Winter March Speed | Achieve Level 15 Infantry Barracks |
| **47** | **Spring Tide-Turtle**| Water-spraying turtle | Epic | `#4DB6AC`, `#E0F1F1` | +8% River transit speed | Clear 15 Coastline raids |
| **48** | **Solstice Fire-Flyer**| Glowing firefly horse | Legendary | `#FF9100`, `#3E2723` | -10% Monster Stamina | Slay 25 Solstice Fire-Sprites |
| **49** | **Evergreen Mastodon** | Mossy wood mammoth | Legendary | `#1B5E20`, `#5D4037` | +10% Wood Gather rate | Harvest 10,000,000 Wood blocks |
| **50** | **Monsoon Reed-Walker**| Tall bamboo stilt bird | Legendary | `#006064`, `#8D6E63` | +12% Swamp March Speed | Achieve Level 20 Marksmen Camp |

*   **Skins 41-50 Visual Descriptions & Animation Behavior:**
    *   *Visuals:* Pine-bough saddles, flowery helmets, harvest baskets, and falling leaf attachments.
    *   *Animations:* The Snail leaves shiny wet green goop tracks. The Mammoth crashes down heavily, leaving leaf storms.

---

### GROUP F: HOLIDAY PARADERS (Skins 51 - 60)
High-spirit event customizers celebrating global holidays with explosive VFXs.

| ID | Name | Theme | Rarity | Color Palette | Stat Bonus | Unlock Method |
|:---:|:---|:---|:---|:---|:---|:---|
| **51** | **Ghostly Broom-Stray**| Levitating witch cat | Rare | `#E65100`, `#4A148C` | +6% Night March Speed | Halloween Store Purchase ($0.99) |
| **52** | **Yuletide Reindeer** | Red-nosed sleigh deer | Rare | `#C62828`, `#2E7D32` | +6% Frost-Terrain March | Reach Level 10 Commerce Post |
| **53** | **Jade Lion-Parader** | Traditional festival lion| Rare | `#D32F2F`, `#00BFA5` | +6% Alliance Help speed | Trade 1,000 Lunar Festival coins|
| **54** | **Confetti Samba Horse**| Ribbon-clad samba horse | Epic | `#FFEB3B`, `#0288D1` | +8% March speed to Guild | Complete 20 Samba Rhythm levels |
| **55** | **Gobble-Wobble** | Pilgrim turkey runner | Epic | `#795548`, `#EF6C00` | +8% Food Gather speed | Gather 5,000,000 Grain |
| **56** | **Cupid's Swift-Dove** | Giant rose-delivery dove| Epic | `#EC407A`, `#FFFFFF` | +8% Alliance Gift speed | Send 30 Chocolate Hampers |
| **57** | **Leprechaun Goat** | Green-hat goat pack | Epic | `#2E7D32`, `#FFF9C4` | +8% Gold Load Capacity | Find 10 Pots of gold on world map |
| **58** | **Gilded Egg-Roller** | Steampunk brass bunny | Legendary | `#B4F8C8`, `#FFAEBC` | +10% Iron Gather speed | Complete Easter Egg search objectives|
| **59** | **Oktoberfest Sledge**| Bavarian beer keg cart | Legendary | `#5C4033`, `#F57C00` | +10% Food Load Capacity | Slay 30 Hop-Monster camps |
| **60** | **Spooky Bat Scurry** | Swarm of purple bats | Legendary | `#4A148C`, `#000000` | +12% Night March Speed | Halloween Special Leaderboard top 5 |

*   **Skins 51-60 Visual Descriptions & Animation Behavior:**
    *   *Visuals:* Heavy ribbons, Santa hats, glowing red lanterns, pink arrow decals, and gold doubloons.
    *   *Animations:* The Samba Horse marches with high-knees, spitting shiny metallic confetti. The Spooky Bat Scurry loops frantically.

---

### GROUP G: ALLIANCE DEFENDERS (Skins 61 - 70)
Cooperative-focused layouts that carry the guild crest proudly on map shields.

| ID | Name | Theme | Rarity | Color Palette | Stat Bonus | Unlock Method |
|:---:|:---|:---|:---|:---|:---|:---|
| **61** | **Concord Peace-Dove** | White banner-winged dove| Rare | `#FBFCFC`, `#80D8FF` | +6% Scout March Speed | Alliance Level 5 Unlock |
| **62** | **Sentry Shield-Ram** | Heavy brick-armored ram | Rare | `#37474F`, `#B71C1C` | +6% Slate Gather speed | Harvest 1,000,000 Slate in Guild |
| **63** | **Guardsman Cavalier** | Banner-carrying horse | Rare | `#0D47A1`, `#ECEFF1` | +6% Rally March Speed | Complete 5 Co-op Alliance rallies |
| **64** | **Iron-Grip Siege-Ox**| Massive steel-rimmed ox | Epic | `#455A64`, `#CFD8DC` | +8% Cargo Load Capacity| Hand in 50 Iron Tech boxes |
| **65** | **Bazaar Pack-Camel** | Silk-draped trade camel | Epic | `#EF6C00`, `#00796B` | +8% Trade Caravan Speed | Conduct 20 Caravan runs |
| **66** | **Clan Fire-Falcon** | Red hunting hawk | Epic | `#D50000`, `#FFD54F` | +8% Rally March Speed | Win 10 Fortress Skirmishes |
| **67** | **Emperor Guard Stallion**| Royal velvet horse | Epic | `#D4AF37`, `#002060` | +8% Gold Load Capacity | Achieve Level 15 Embassy Dome |
| **68** | **Mercenary War-Hound**| Spiked armor hound | Legendary | `#8D6E63`, `#2E7D32` | +10% Monster March Speed| Complete 150 Guild Bounty missions|
| **69** | **Imperial Convoy Team**| Heavy draft-horse team | Legendary | `#5D4037`, `#FFFFD2` | +10% Transport Capacity| Unlocked at Alliance level 20 |
| **70** | **Sovereign Keep-Elephant**| Royal double-deck elephant| Legendary | `#F2F4F4`, `#D4AF37` | +12% Resource Load Cap | Complete 50 Capital Shield tasks |

*   **Skins 61-70 Visual Descriptions & Animation Behavior:**
    *   *Visuals:* High-back sedan chairs, shiny bronze crest-shields, royal purple velvet saddle covers, and floating blue guidons.
    *   *Animations:* Highly uniform, marching in flawless rows. Elephants leave wide, heavy dust cloud prints while trumpeting on click.

---

### GROUP H: ELEMENTAL SHIFTERS (Skins 71 - 80)
Creatures composed of raw elemental fluids (Lava, Glaciers, Gale Winds, Void Crystals).

| ID | Name | Theme | Rarity | Color Palette | Stat Bonus | Unlock Method |
|:---:|:---|:---|:---|:---|:---|:---|
| **71** | **Lava Slug Hopper** | Volcanic fluid slug | Rare | `#212121`, `#D84315` | +6% Slate Gather speed | Slay 10 Volcanic Slug Camps |
| **72** | **Icicle Spire Stag** | Ice crystal stag | Rare | `#E0F7FA`, `#4FC3F7` | +6% Winter March Speed | Unlock Glacial Map Coordinates |
| **73** | **Breeze Sprinter** | Swirling teal wind wolf | Rare | `#E8F5E9`, `#81D4FA` | +6% River-Terrain Speed | Clear 10 Wind-Rifts on the map |
| **74** | **Rift-Quartz Larva** | Purple crystal crawler | Epic | `#4A148C`, `#E040FB` | +8% Iron Gather speed | Slay 15 Rift Crawler mini-bosses|
| **75** | **Mud-Slide Behemoth** | Walking swamp sediment | Epic | `#5D4037`, `#BEEF9E` | +8% Content-Terrain Speed| Achieve Level 20 Quarry Zone |
| **76** | **Deep-Ocean Hippocampus**| Sea foam wave stallion | Epic | `#006064`, `#00E5FF` | +8% Sea-Terrain Speed | Clear 15 Kraken Grotto raids |
| **77** | **Solar Flare Raptor**| Sun-beam hawk | Epic | `#FFF8E1`, `#FF6D00` | +8% Food Gather speed | Trade 15 Sun embers in shop |
| **78** | **Vesper Shadow-Bat** | Dark violet twilight bat | Legendary | `#1A237E`, `#9575CD` | +10% Night March Speed | Slay 30 Eclipse Bat swarms |
| **79** | **Fulminating Sparks** | Ball lightning rabbit | Legendary | `#37474F`, `#FFF59D` | +10% Scout March Speed | Slay 30 Spark-Hares on world map|
| **80** | **Tectonic Slate Titan**| Walking obsidian mountain| Legendary | `#212121`, `#03A9F4` | +12% Resource Load Cap | Complete Tectonic Rift campaign |

*   **Skins 71-80 Visual Descriptions & Animation Behavior:**
    *   *Visuals:* Bodies comprising liquid lava shaders, solid ice prisms, howling electric storms, and levitating crystal shards.
    *   *Animations:* Fluid deforming loops. The Lava Slug leaves burning paths that scorch grass; the Wind Wolf dissolves into teal breeze vectors.

---

### GROUP I: LEGENDARY COMMANDERS (Skins 81 - 90)
High-tier specialized combat companion mounts that carry heavy metal armor coats.

| ID | Name | Theme | Rarity | Color Palette | Stat Bonus | Unlock Method |
|:---:|:---|:---|:---|:---|:---|:---|
| **81** | **Elena's Crest-Steed**| Heavy armored white geldrin| Epic | `#FFFFFF`, `#C62828` | +8% Vanguard March Speed| Unlock 3-Star Elena Commander |
| **82** | **Kaelen's Storm-Falcon**| Teal hunting thunderbird | Epic | `#00E5FF`, `#1A365D` | +8% Scout March Speed | Unlock 3-Star Kaelen Commander |
| **83** | **Elara's Sylvan Stalker**| Leafy moss-panther | Epic | `#2E7D32`, `#FB8C00` | +8% Wood Gather rate | Unlock 3-Star Elara Commander |
| **84** | **Brandon's Obsidian Ram**| Volcanic flame ram | Epic | `#1B1212`, `#FF3300` | -8% Boss Stamina cost | Unlock 3-Star Brandon Commander |
| **85** | **Abyssal Leviathan Crab**| Giant teal coral crab | Epic | `#006064`, `#FF4081` | +8% Swamp Gather speed | Unlock 3-Star Abyss Commander |
| **86** | **Gothic plague Raven** | Black beak plague bird | Epic | `#3E2723`, `#4A148C` | +8% Medical gather runs | Slay 30 plague doctor camps |
| **87** | **Sandship Caravan Camel**| Royal dome carriage camel| Epic | `#EF6C00`, `#00796B` | +8% Gold Load Capacity | Spend 5,000 Bazaar points |
| **88** | **Dwarven Tunnel Grinder**| Bedrock-mining drill cart| Legendary | `#5D4037`, `#FF3D00` | +10% Slate Gather speed | Complete Dwarven tunnel levels |
| **89** | **Chronos Gear Horse**| Mechanical clockwork horse| Legendary | `#B87333`, `#0D47A1` | +10% Time-Skip Travel rate| Use 500 Hours of March skips |
| **90** | **Royal Sun-Guard Lion**| Star-armored golden lion | Legendary | `#FFD54F`, `#C2185B` | +12% Capital march speed | Earn 50 Throne Victory points |

*   **Skins 81-90 Visual Descriptions & Animation Behavior:**
    *   *Visuals:* Customized armor sets matching specific commander styles (e.g., Brandon's mount has dark basalt plating; Elara's has woven wood).
    *   *Animations:* Powerful, stately movements. White geldrin horses rear back high and whinny; falcon mounts zoom down in razor slips.

---

### GROUP J: MYTHIC LEGIONS (Skins 91 - 100)
Ultimate, levitating artifacts and divine creatures derived from high sovereign lore.

| ID | Name | Theme | Rarity | Color Palette | Stat Bonus | Unlock Method |
|:---:|:---|:---|:---|:---|:---|:---|
| **91** | **Asgardian war-Sledge**| Hammer-capped ram sleigh | Epic | `#5D4037`, `#D4AF37` | +8% Lumber Load Capacity| Achieve top 20 in Clan wars |
| **92** | **Valkyrie Wings** | Ring-locked spear glider | Epic | `#FFFFFF`, `#C2185B` | +8% Scout travel speed | Reach Rank 10 Arena league |
| **93** | **Atlantis Pearl Shell**| Pearl carriage water snail| Epic | `#006064`, `#ECEFF1` | +8% Water Gather Speed | Defeat Oceanic Baron 20 times |
| **94** | **Hydra Core Serpent** | Toxic green swamp serpent | Epic | `#004D40`, `#AA00FF` | +8% Venom swamp speed | Slay 50 Swamp Hydras |
| **95** | **Yggdrasil Root Moose**| Oak-bark mossy elder deer | Epic | `#D84315`, `#5D4037` | +8% Food Gather speed | Level up Alliance Tree to maximum |
| **96** | **Celestial Star-Sphere**| Levitating galaxy glyph | Legendary | `#FFF8E1`, `#80DEEA` | +10% Celestial Speed | Sovereign Ascension (VIP Lvl 19) |
| **97** | **Gargoyle Mausoleum** | Flying basalt gargoyle | Legendary | `#212121`, `#00E676` | +10% Night March Speed | Complete Necropolis campaign level|
| **98** | **Elysian Sun Chariot** | Golden solar fire chariot | Legendary | `#F5EEF8`, `#FFD54F` | +10% General March Speed| Achieve Level 25 Cathedral clinic|
| **99** | **Chronos Key Roller** | Dual brass clock wheel | Legendary | `#B87333`, `#D4AF37` | +10% Speedup travel rate | Time-skip standard achievements |
| **100**| **Sun-Crown Constellation**| Levitating golden solar star| Legendary | `#FFD54F`, `#6A1B9A` | +12% General March Speed| Sovereign Ascension (VIP Lvl 20) |

*   **Skins 91-100 Visual Descriptions & Animation Behavior:**
    *   *Visuals:* Complete glowing ring systems, floating stars, ivory spears, and crystalline scales that shift color based on viewing angles.
    *   *Animations:* The Sun-Crown Constellation is a levitating starry solar halo that floats smoothly above the marching legion, projecting vertical beams of holy gold starlight onto units below. Constellations shift colors on a beautiful 10-second loop.

---

## ⚙️ SECTION III: TECH-ART SHADER CONFIGURATION

To render trailing footprints and ground-glow trails dynamically across the 2.5D world map, we utilize our WebGL footprint shader:

```glsl
// GLSL fragment shader for Crownspire world map march footsteps
shader_type spatial;

uniform sampler2D footprint_mask : hint_default_black;
uniform vec3 footprint_color : source_color = vec3(0.0, 0.95, 1.0);
uniform float trail_decay_time : hint_range(0.0, 5.0) = 2.5;

void fragment() {
    // Dynamic aging of footstep trail based on coordinate passage timestamps
    float age_factor = clamp(UV.y * trail_decay_time, 0.0, 1.0);
    vec4 mask_val = texture(footprint_mask, UV);
    
    // Core glow fading out at the end of the trail
    vec3 local_glow = footprint_color * mask_val.r * (1.0 - age_factor) * 4.5;
    
    ALBEDO = vec3(0.1, 0.12, 0.2) * (1.0 - mask_val.r); // Blend with map soil
    EMISSION = local_glow;
    ROUGHNESS = 0.55;
    METALLIC = 0.1;
}
```

This structural march skin production catalog conforms perfectly with Crownspire's microtransaction and gameplay loop framework. Let's run a final build test to ensure compilation is flawless!
