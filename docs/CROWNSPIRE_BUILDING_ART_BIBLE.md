# CROWNSPIRE: BUILDING ART PRODUCTION BIBLE
**Official Art Direction, Volume Guides, and Visual asset specifications**
**Version 1.0.0 (Art Dept / Tech-Art Core) | Confidential - Crownspire Studio Operations**

---

## 🎨 SECTION I: CORE STYLE DICTATES & RENDER GUIDELINES

This document serves as the absolute visual standard for all environment artists, 3D modelers, and technical animators working on **Crownspire**. All assets must be optimized for a **2.5D mobile orthographic camera projection** ($30^\circ$ pitch angle, $45^\circ$ yaw rotation).

```
                             [ CAMERA PERSPECTIVE ]
                             
                                  / \  (Camera Look-at vectors)
                                 /   \
                                /     \
                      +---------+-----+---------+
                      |         | 45° |         |
                      |         |     |         |
                      |  [3D]   +-----+  [3D]   | <-- Camera Tilt: 30°
                      |  Left   |     |  Right  |     Orthographic Projection
                      |  Face   |     |  Face   |     No perspective lines
                      +---------+-----+---------+
```

### 1. Style Pillar A: Pixar-Inspired Volume (Chunky Weight)
- **Bevels & Corners:** Hard, razor-thin edges are strictly forbidden. All structural edges must use thick, rounded bevels (minimum 8-12cm in-world radius equivalent) to catch soft specular highlights. 
- **Ambient Occlusion (AO):** Exaggerate baked-down pocket shadows in the texturing pipeline. Crevices, roof joints, and ground contact pads should have dark, soft-edged ambient occlusion to give models a tactile, toy-like weight.
- **Squash and Stretch Proportions:** Exaggerate scale features. Doors should be chunky and wide, window panes rounded and slightly bulging, and supporting wooden columns slightly flared at the footings. 

### 2. Style Pillar B: Fantasy Realism (Grounded But Magical)
- **Texture Detail Scale:** Avoid micro-noise textures (such as procedural photorealistic granite). Utilize stylized, hand-painted, clean PBR material maps. Emphasize stylized cracks, hand-carved wood grain notches, and chunky stone bricks with subtle variation in color tones.
- **Graphic Contrast:** Ensure high tonal separation between roofs (high specular/color values) and lower wall bases (grounded shadow values). Buildings must instantly pop against the green-gray soil of the world map.

### 3. Styling Category Color-Coding Matrix
To ensure 100% gameplay readability from high zoom-out ranges, city buildings are strictly color-coded:
- **Administrative (Citadel Keep, Warehouse):** Slate blue roofs, limestone walls, royal gold accents.
- **Economic/Gathering (Farm, Lumber Mill, Quarry, Iron Mine):** Deep autumn ochre tile, weathered pine wood, raw copper bands.
- **Support & Diplomatic (Hospital, Sanctuary, Embassy):** Pristine white plaster walls, warm terracotta/lavender roofs, brass embellishments.
- **Research & Heroes (Research Hall, Hall of Heroes):** Gothic sapphire and violet roofs, polished bronze framing, cosmic stellar runes.
- **Commerce (Trading Post):** Striped emerald-and-white canvas tents, sturdy mahogany tables, brass scale balances.
- **Military Units (Barracks, Stables, Towers):** Charcoal iron-capped domes, heavy redwood frames, royal crimson banners.

---

## 🏛️ SECTION II: 16-BUILDING VISUAL SPECIFICATIONS

---

### 1. Citadel Keep (The Monarch's Crown)

*   **Level 1 Appearance:** A compact, double-story stone manor styled with weathered plaster walls, a simple pitched dark slateroof, and small glass-less windows framed with rough spruce planks. A modest iron-banded wooden gate acts as the entrance, surrounded by a low, uneven fieldstone perimeter fence.
*   **Mid-Tier Appearance (Lvl 10-15):** The keep expands into an elegant gothic castle. Featuring multi-tier limestone masonry, a tall central keep tower wrapped in a slate-blue conical roof with a polished copper weather-vane. The gates are upgraded to defensive double-vault wood reinforced with iron latticework, decorated with twin hanging blue velvet banners bearing gold trim.
*   **Max-Tier Appearance (Lvl 20+):** A colossal imperial fortress. It showcases towering white marble bastions, stepped battlements with integrated archer slots, side observatory balconies, and two massive flanking towers linked by a suspension walkway. The central conical dome features glowing star runes, a rotating golden star-sphere, and gold-plated crown crowns around the tower tops.
*   **Materials:** Polished white limestone, dark cobalt slate slabs, hand-carved royal gold trim plates, and solid wrought-iron hinges.
*   **Color Palette:** `#F5F5F0` (Limestone Base), `#2B3E50` (Slate Blue Cones), `#D4AF37` (Imperial Gold Detailing), `#1C1C1C` (Anchor Wrought Iron).
*   **Construction Stages:** 
    *   *Foundation:* A flat, chalked excavation grid with stone piles, a wooden scaffold frame, and hand-wound cranes.
    *   *Framing:* Half-built limestone walls with raw wooden beam structures projecting upward; mortar buckets sit beside ladders.
*   **Damage States:** 
    *   *Minor:* Scuffed stonework, chipped roof tiles with trailing slate dust particles, and scorched soot marks near windows.
    *   *Major:* Collapsed left tower battlements, cracked wall masonry revealing inner orange glowing embers, and broken hanging banners.
*   **Day Appearance:** Bright, high-contrast lighting; soft warm sunlight reflects off the white limestone, creating deep blue-gray shadows under the steep roof-lines.
*   **Night Appearance:** The windows emit a cozy golden candle glow. Polished blue roof tiles capture moonlit ambient specular dots. Blue-glowing magical courtyard lanterns illuminate the stone stairs.

---

### 2. Farm (The Harvest Hearth)

*   **Level 1 Appearance:** A basic thatched straw-roof cottage next to a small, hand-plowed patch of brown soil with 3 short green rows of wheat sprouted. A simple wooden water bucket sits by a small chicken coop.
*   **Mid-Tier Appearance (Lvl 10-15):** A sturdy timber farmhouse featuring orange terracotta roof tiles, an integrated stone brick chimney venting white smoke rings, and a rotating wooden water wheel feeding water troughs. The plowed soil layout splits into 4 lush quadrants of golden wheat and leafy green rows.
*   **Max-Tier Appearance (Lvl 20+):** A grand agricultural estate. It includes a multi-tier farm mansion draped in creeping green vines, a massive red-domed metal grain silo with automated pipe systems, and an active iron-vaned windmill spinning. The crop fields are segmented by clean stone channels flowing with glowing aqua nutrition fluids.
*   **Materials:** Weathered redwood beams, golden wheat-straw bundles, terracotta roof tiles, and bright copper fluid lines.
*   **Color Palette:** `#228B22` (Leafy Green), `#DAA520` (Golden Wheat), `#D2691E` (Terracotta Roof), `#8B4513` (Weathered Pine).
*   **Construction Stages:** 
    *   *Foundation:* Cleared weed-lines, structural timber piles laid horizontally, and soil till marks.
    *   *Framing:* Unfinished timber roof struts, stacks of gold hay, and a simple water wheel frame without paddles.
*   **Damage States:** 
    *   *Minor:* Broken field fencing, trampled crop rows, and soot-blackened silo pipes.
    *   *Major:* Half-burnt dry roof, water wheel shattered in half, and flooded, muddy crop trenches.
*   **Day Appearance:** Bright and cheerful; volumetric morning sun shafts slice through the spinning windmill blades, lighting up wind-blown field dust particles.
*   **Night Appearance:** Warm orange lamps illuminate the silo pipes and barn windows. Fireflies dance over the glowing aqua fluid channels.

---

### 3. Lumber Mill (The Timber Tracks)

*   **Level 1 Appearance:** A rustic open-air shed built of thick planks over dirt ground. A single horizontal sawing bench is fitted with a manual two-man iron saw, backed by a small stack of rough log rounds.
*   **Mid-Tier Appearance (Lvl 10-15):** An enclosed dual-wing sawmill featuring a stone foundation, a functional dark copper steam pipe chimney venting white steam, and an active water-powered circular saw blade that rotates constantly. Plentiful stacks of planed cedar wood boards surround the yard, organized by sizes.
*   **Max-Tier Appearance (Lvl 20+):** A multi-level automated processing factory. It features heavy iron support columns, a massive crane tower with pulley systems that automatically shifts logs, and two large steam chimneys with spinning fan-grids. A fast-moving conveyor belt system slides tree trunks into circular saw channels under safety shields.
*   **Materials:** Cast iron machine casings, dark heartwood timber trusses, red steel piping, and wet cedar bark textures.
*   **Color Palette:** `#5C4033` (Wet Cedar), `#708090` (Cast Iron Slate), `#FF4500` (Safety Red Accents), `#DFD3C3` (Shaved Wood Planks).
*   **Construction Stages:** 
    *   *Foundation:* Flat slate concrete slabs poured on soil, with circular saw blades stacked on pallets.
    *   *Framing:* Wall pillars raised with high guide rope lines; half-constructed steam chimneys without caps.
*   **Damage States:** 
    *   *Minor:* Shaved wood piles scattered around the yard, bent ventilation ducts, and grease streaks on stone.
    *   *Major:* Collapsed roof trusses crushing sawing benches, broken saw blades embedded in timber pieces on the ground.
*   **Day Appearance:** High specular shines off the wet spinning circular blades. Sawdust particles fly out and catch the directional sunlight.
*   **Night Appearance:** Intense white spotlights illuminate active conveyor belts. A dull amber boiler door glow is visible through the wall cracks.

---

### 4. Quarry (The Slate Carvers)

*   **Level 1 Appearance:** A shallow excavation pit ringed by a simple wooden rope barricade. A single wooden crane sits atop a bedrock shelf, supporting a small basket of rough grey stones.
*   **Mid-Tier Appearance (Lvl 10-15):** A multi-tiered limestone extraction stepped cut. Sturdier double-braced mechanical crane rigs with metal pulleys lift blocks. A wooden sorting platform holds piles of split slate shingles, complete with chisels and hammers on workbenches.
*   **Max-Tier Appearance (Lvl 20+):** A massive open-cast canyon operation. Steam-driven rock crushers with moving gears stand on concrete pillars. Heavy crane arches extend over deep cuts, lifting pristine giant blue-slate blocks. Steel rail systems wind down into tunnels with active ore carts.
*   **Materials:** Rough basalt stone slabs, dark blue slate tiles, greased bronze ropes, and copper support clamps.
*   **Color Palette:** `#4682B4` (Slate Blue), `#808080` (Rough Bedrock Grey), `#B87333` (Greased Bronze Rope), `#A9A9A9` (Limestone Crags).
*   **Construction Stages:** 
    *   *Foundation:* Pit lines blasted with black powder, wooden safety railings erected, and dry shovel racks.
    *   *Framing:* Halfway carved stone steps with crane guide ropes strung across; wooden platform legs being stabilized.
*   **Damage States:** 
    *   *Minor:* Cracked quarry stone walls, broken mine cart wheels, and snapped safety guide rope lines.
    *   *Major:* Entire quarry cliff face collapsed, burying rock crushing machines under heaps of stony debris.
*   **Day Appearance:** Strong, high-contrast cast shadows fill the deep stepped quarries. Sunlight reveals fine rocky cleavage details on cut blocks.
*   **Night Appearance:** Warm glowing red safety braziers line the quarry steps. Tonal blue spotlights point into deep stone tunnels.

---

### 5. Iron Mine (The Deep Shafts)

*   **Level 1 Appearance:** A simple mine entrance framed by thick, rough oak beam supports. A dirt mound rests next to a single rusty iron pickaxe and a single bucket holding dark grey red-speckled ores.
*   **Mid-Tier Appearance (Lvl 10-15):** A structured timber mine portal built into a rocky hillside. A wooden track exits the tunnel, holding a heavy-duty iron-riveted ore cart. A water-powered bellows forces fresh air into side vents, with tools hanging from brackets.
*   **Max-Tier Appearance (Lvl 20+):** A sprawling industrial mine-mouth. Massive steel headframes tower over the primary lift shaft, with giant spinning cable wheels. An automated smelting furnace vents molten iron slits into cooled channels, generating bright embers. Sturdy concrete arches secure double entries.
*   **Materials:** Forged black steel girders, iron-banded timber shafts, molten slag channels, and raw red-capped hematite stonework.
*   **Color Palette:** `#000000` (Forged Black Steel), `#8B0000` (Red Hematite), `#FF8C00` (Molten Forge Orange), `#C0C0C0` (Polished Iron Ore).
*   **Construction Stages:** 
    *   *Foundation:* Slag debris plowed clear, thick timber posts stacked, and steel lift cage base set.
    *   *Framing:* Lift head tower framing rising, but without cables; mine entry arch half-lined with bricks.
*   **Damage States:** 
    *   *Minor:* Broken structural timber brackets, off-rail mine carts, and minor soot marks around vents.
    *   *Major:* Collapsed main headframe tower, cave-in rocks blocking the entry tunnels, and shattered cooling fluid vats.
*   **Day Appearance:** Black steel lattices draw stark silhouettes against the sky. Drifting gray dust is visible near the primary vents.
*   **Night Appearance:** The molten iron slag channel casts a powerful, dramatic orange under-glow across the structural walls and machinery bases.

---

### 6. Warehouse (The Vault)

*   **Level 1 Appearance:** A small, single-room stone cellar block fitted with a heavy spruce hatch door locked with a simple padlocked iron bracket. Stacks of three flour barrels sit outside on a small wooden deck.
*   **Mid-Tier Appearance (Lvl 10-15):** A long, sturdy brick depot. Featuring a gabled dark-blue tile roof with copper peak caps and reinforced iron doors. A covered side unloading dock is flanked by wooden supply crates, barrels, and grain bags stacked on pallets.
*   **Max-Tier Appearance (Lvl 20+):** A secure triple-vault treasury. Built from dark granite blocks and featuring reinforced bronze outer door panels etched with security runes. It includes automated overhead cranes moving goods, and high guard balconies. Golden chest towers are visible inside through thick glass windows.
*   **Materials:** Polished granite blocks, structural brass sheets, thick treated oak timber, and oiled leather tarps.
*   **Color Palette:** `#2E4053` (Granite Blue-Grey), `#B1907F` (Treated Oak), `#CD7F32` (Structural Bronze), `#F4D03F` (Treasury Gold Specular).
*   **Construction Stages:** 
    *   *Foundation:* Large concrete square slabs poured, wooden supply crates sitting out as storage placeholders.
    *   *Framing:* Halfwaised stone partitions with floor beams installed; brick arch portals are supported by timber braces.
*   **Damage States:** 
    *   *Minor:* Scratched secure doors, ripped leather tarps flapping in the wind, and spilled grain bags.
    *   *Major:* Massive wall breach on the vaults, wood boxes shattered with grain piles exposed, and snapped ceiling cranes.
*   **Day Appearance:** Sleek, sharp reflections off the gabled tile roofs; neat shadows accentuate the heavy stone corners.
*   **Night Appearance:** Soft teal protective runes glow on secure bronze doors. Tall corner searchlights scan the immediate grounds.

---

### 7. Hospital (The Sacred Wards)

*   **Level 1 Appearance:** A cozy single-story plaster cabin trimmed with basic pine columns and displaying a small, painted wooden red cross shield over the entry. An outdoor bench is fitted with clean linen sheets.
*   **Mid-Tier Appearance (Lvl 10-15):** A two-wing brick sanatorium. Features a warm terracotta roof with an inner hospital garden patch of green healing herbs. Sturdy glass sash windows admit light, with neat ranks of white cots visible through the panes.
*   **Max-Tier Appearance (Lvl 20+):** A spectacular marble cathedral-clinic. Boasts tall arched stained-glass windows depicting healing sun-burst designs. A high central apothecary tower vents thin lavender-scented steam. Pristine fountains splash water into deep white marble basins in the entry plaza.
*   **Materials:** White stucco plaster, glazed green glass sheets, pink-shaded marble arches, and aromatic silverwood timber.
*   **Color Palette:** `#FFFFFF` (Pristine White), `#E74C3C` (Sacred Crimson Cross), `#3498DB` (Glazed Sapphire Glass), `#9B59B6` (Apothecary Lavender Steam).
*   **Construction Stages:** 
    *   *Foundation:* Level marble base tiles laid, wooden crate stacks of medicine vials and cot legs waiting.
    *   *Framing:* Tall arched window frames erected without glass panes; structural roof beams draped in tarps.
*   **Damage States:** 
    *   *Minor:* Broken window glass panes, splashed medicine fluid stains on white walls, and torn outer curtains.
    *   *Major:* Apothecary tower tilted at a severe angle, stained-glass windows completely shattered, and collapsed ward roofs.
*   **Day Appearance:** Soft, bright sunlight passes through stained glass, throwing colorful pink and violet patterns onto the plaza stone.
*   **Night Appearance:** The cathedral chambers emit a serene purple glass glow. Water fountains are lit by submerged jade lamps.

---

### 8. Sanctuary (The Shield Temple)

*   **Level 1 Appearance:** A quiet clearing defined by four standing, weathered grey runic stones. In the center sits a low, cracked stone altar table offering a small brass bowl of burning incense.
*   **Mid-Tier Appearance (Lvl 10-15):** An elegant, open-air temple pavilion built from white limestone columns. A peaked lavender tiled roof shelters a glowing, levitating crystal shard over a pool of clear holy water.
*   **Max-Tier Appearance (Lvl 20+):** A magnificent ethereal cathedral. The roof comprises a series of interlocking white limestone domes wrapped in gold-plated sun rings. A giant celestial sapphire shard floats over a cascading water pool, casting a continuous, circular turquoise ripple effect.
*   **Materials:** White translucent marble, gold sun rings, solid floating crystal shards, and clean silver filigree lining.
*   **Color Palette:** `#F5EEF8` (Translucent Marble), `#1ABC9C` (Turquoise Shield Glow), `#D4AF37` (Sun-Gold Rings), `#8E44AD` (Lavender Tiles).
*   **Construction Stages:** 
    *   *Foundation:* Runic circle stones cleared of moss, circular temple floor brick foundation mapped on grass.
    *   *Framing:* Arched column rows erected with support scaffolds; central water base ring under tarps.
*   **Damage States:** 
    *   *Minor:* Moss and dark grime growing over marble, chipped altar stone bases, and extinguished incense bowls.
    *   *Major:* Floating central crystal shattered, water basin dry and cracked, and columns fallen sideways across the tiles.
*   **Day Appearance:** White marble domes glow with a pearlescent sheen; soft turquoise light pulses from the central crystal pools.
*   **Night Appearance:** A powerful vertical beam of soft cyan light shoots into the sky from the temple dome, illuminating drifting stardust particles.

---

### 9. Embassy (The Imperial Consulate)

*   **Level 1 Appearance:** A modest, single-room office built of dark oak planks, showcasing a simple wooden desk, a blank parchment map on the wall, and a single blue alliance flag hanging over the door.
*   **Mid-Tier Appearance (Lvl 10-15):** A stately consular building. Features two-story red-brick architecture, a high central arched entryway, and two polished brass eagle statues flanking the entrance steps. Multiple alliance banner poles stand proud in the front courtyard.
*   **Max-Tier Appearance (Lvl 20+):** A grand grand palatial embassy dome. Built of royal white-and-gold flagstone, with high central domed glass halls. Large, moving brass state alignment rings spin around central flagpoles. Clean fountains splash water onto white marble plazas.
*   **Materials:** Polished gold-veined marble slabs, brass alignment rings, heavy navy velvet draperies, and cherrywood desks.
*   **Color Palette:** `#002060` (Consular Navy Blue), `#D4AF37` (Polished Brass Gold), `#F2F4F4` (White flagstone), `#E74C3C` (Imperial Crimson Sealing Wax).
*   **Construction Stages:** 
    *   *Foundation:* Rectangular marble plaza tiles laid out, with packing crate piles of alliance flags stacked nearby.
    *   *Framing:* Dual-story brick walls half-poured with timber scaffolding; window frameworks empty.
*   **Damage States:** 
    *   *Minor:* Scuffed white walls, torn alliance banners flapping, and fallen paperwork piles in the yard.
    *   *Major:* Central embassy dome collapsed, brass eagle statues shattered on plaza, and burnt document soot marks.
*   **Day Appearance:** Bright, formal lighting; the brass eagles and window frames capture crisp sun flares that match mouse hover states.
*   **Night Appearance:** Elegant tall brass candelabras burn with warm light behind heavy glass bays. Alignment rings project thin blue laser lines.

---

### 10. Research Hall (The Celestial Observatory)

*   **Level 1 Appearance:** A cozy stone library tower featuring a steep blue-slate roof, a small wooden desk under a single glowing glass lantern, and a simple telescope pointing out a round window.
*   **Mid-Tier Appearance (Lvl 10-15):** A structured two-story observatory. Features a rotating bronze dome with a long brass refracting telescope sliding on a tracks. Floor chambers are crammed with tall bookshelves and rolling chart boards.
*   **Max-Tier Appearance (Lvl 20+):** A magnificent cosmic academy. Features three interlocking violet starglass domes with massive gold ring alignments. The central telescope projects glowing blue celestial charts onto the outdoor domes. Floating sapphire runic spheres spin above the entries.
*   **Materials:** Violet starglass panels, orbital brass rings, dark aged redwood cabinetry, and glowing neon-blue fluid vials.
*   **Color Palette:** `#4B0082` (Indigo Starglass), `#8A2BE2` (Violet Alchemy Blue), `#7B241C` (Aged Redwood), `#F1C40F` (Astronomy Brass Gold).
*   **Construction Stages:** 
    *   *Foundation:* Hexagonal obsidian base outline set, crate stacks of star scrolls and glass lenses under plastic tarps.
    *   *Framing:* Astronomy gear tracks laid without telescope installation; stone wall pillars supported by wooden stays.
*   **Damage States:** 
    *   *Minor:* Cracked violet starglass panes, oil spills from machinery gears, and burnt parchment files.
    *   *Major:* Starglass domes shattered in half, central refracting telescope bent and broken, and burnt scroll shelves.
*   **Day Appearance:** Starglass domes capture deep cosmic reflections from the sky. Shimmering purple and cobalt tones play off the metal trims.
*   **Night Appearance:** The starglass glows with an inner cosmic constellation graphic. The floating spheres emit small violet lightning arcs.

---

### 11. Hall of Heroes (The Pantheon)

*   **Level 1 Appearance:** A quiet stone courtyard housing a single, weathered grey stone statue of an ancient paladin warrior flanked by two small, burning flame torches on iron poles.
*   **Mid-Tier Appearance (Lvl 10-15):** A stately stone memorial temple featuring tall stone steps, a peaked blue roof, and a semi-circular arcade holding three polished bronze statues of legendary commanders on dark granite pedestals.
*   **Max-Tier Appearance (Lvl 20+):** A breathtaking golden pantheon. Clad in ivory marble and displaying towering gold-clad statues of legendary heroes holding aloft glowing jewel swords. A central glass dome exposes a golden hero altar pulsing with majestic light trails.
*   **Materials:** Smooth ivory marble blocks, gold-foil clad statue components, polished black granite floor plates, and silk banners.
*   **Color Palette:** `#FBFCFC` (Ivory Marble), `#FFD700` (Pantheon Statue Gold), `#E74C3C` (Valorous Crimson Banners), `#2C3E50` (Black Granite Base).
*   **Construction Stages:** 
    *   *Foundation:* Wide temple steps laid out, with uncarved marble blocks sitting on heavy crane pallets.
    *   *Framing:* Tall column arches raised but lack headers; un-finished plaster statues sit under grey protective drop-cloths.
*   **Damage States:** 
    *   *Minor:* Cracked statue bases, torn crimson banners, and minor soot lines around flame grates.
    *   *Major:* Headless hero statues tumbled onto the pavement, altar dome collapsed, and columns snapped like chalk.
*   **Day Appearance:** High-contrast sunlight dances off polished gold statues, casting stark, heroic shapes across the white marble floor.
*   **Night Appearance:** The golden altar casts a powerful yellow-and-magenta volumetric beam of light straight up through the glass dome into the night.

---

### 12. Trading Post (The Bazaar)

*   **Level 1 Appearance:** A simple wooden trestle table on bare dirt, covered by a striped green canvas umbrella. A set of hand-held balance scales sits next to a small wooden coin box.
*   **Mid-Tier Appearance (Lvl 10-15):** A lively open-air market pavilion. Features a sturdy timber frame holding green-and-white canvas tents. Tables are piled high with red silk bags, foreign pottery plates, spice boxes, and copper scales. A camel parking post stands to the side.
*   **Max-Tier Appearance (Lvl 20+):** A grand mercantile exchange. Includes an arched stone bazaar hall with multiple inner kiosks, a high glass ceiling, and a large copper clockwork trade tracker panel on the front wall. Active trade wagons and caravans crowd the brick courtyard.
*   **Materials:** Emerald green canvas fabric, dark cherrywood furniture frames, sheet copper dials, and brass decorative medallions.
*   **Color Palette:** `#008080` (Emerald Canvas), `#D2691E` (foreign pottery ochre), `#D4AF37` (Brass Medallions), `#F5F5DC` (Camel Sand beige).
*   **Construction Stages:** 
    *   *Foundation:* Cobbled merchant courtyard mapped, wood crate boxes of spice jars and carpets stacked around.
    *   *Framing:* Wooden market stalls framed without fabric covers; central scale clockwork dial bracket blank.
*   **Damage States:** 
    *   *Minor:* Torn canvas sails flapping, tipped fruit and pottery boxes scattered, and spilled coins on the stones.
    *   *Major:* Entire bazaar tent frame collapsed in a heap of broken timber, canvas charred, and trade scales crushed.
*   **Day Appearance:** Bright, bustling lighting; sunlight catches dust motes floating over spice piles and gleams off brass coins.
*   **Night Appearance:** Strings of warm colorful fairy lights swing between the tent poles, casting soft green-yellow loops on the tables.

---

### 13. Infantry Barracks (The Vanguard Yards)

*   **Level 1 Appearance:** A simple dirt drill yard enclosed by a low wooden picket fence. Includes 2 basic sleeping tents made of tan canvas and a single wooden target dummy padded with straw.
*   **Mid-Tier Appearance (Lvl 10-15):** A stone-lined parade ground. Includes double-story timber barracks buildings with red tiled roofs, deep iron armor stands holding breastplates, and a row of 4 weapon training dummies with sword-scratched shields. Crimson flags fly from poles.
*   **Max-Tier Appearance (Lvl 20+):** A massive fortified training compound. Features high brick walls, dual iron gate entries, and a heavy central iron-capped citadel hall. Columns of heavy iron targets with mechanical swinging axes flank a paved, chalk-coded parade yard.
*   **Materials:** Forged cast iron plates, heavy redwood timbers, rough slate bricks, and blood-red canvas textiles.
*   **Color Palette:** `#8B0000` (Vanguard Crimson), `#555555` (Slate Brick Grey), `#000000` (Iron Black Armor), `#CD7F32` (Splintered Wood).
*   **Construction Stages:** 
    *   *Foundation:* Dirt grounds cleared, wooden training dummies stacked on pallets, and mortar barrels sitting in rows.
    *   *Framing:* Barrack barracks building framing raised; weapon racks empty with wood shavings under worktables.
*   **Damage States:** 
    *   *Minor:* Splintered wooden fences, broken training dummies with stuffing showing, and oil burns on the yard.
    *   *Major:* Main barracks hall collapsing, heavy iron target gates snapped flat, and smoking weapon armor racks.
*   **Day Appearance:** High shadow definition off the weapon racks; military banners snap vigorously back and forth in the wind.
*   **Night Appearance:** Tall corner iron fire baskets hold roaring orange wood fires, lighting the yard with dynamic flickering shadows.

---

### 14. Marksmen Camp (The Archer Ranges)

*   **Level 1 Appearance:** A simple grassy archery range containing 2 straw target rounds, a single wooden bow rack holding two basic hunting bows, and a small canvas shelter on sticks.
*   **Mid-Tier Appearance (Lvl 10-15):** A cozy, organized camp. Features a timber lodge trimmed with feather decorations, a flag-lined shooting gallery with 4 target lanes, and an active bow-stringing workbench complete with raw feather piles and glue jars.
*   **Max-Tier Appearance (Lvl 20+):** A spectacular marksman pavilion. Includes double-tier wooden watchtowers, target ranges with wind vane flags showing current breezes, and automated moving target boards on guide tracks. High green banners hang from tall birchwood pillars.
*   **Materials:** White silverwood birch columns, mint-green linen banners, woven goose feathers, and dark spruce targets.
*   **Color Palette:** `#2E8B57` (Mint Green Linen), `#FDFEFE` (Birchwood White), `#C0392B` (Target Crimson Rings), `#D35400` (Bow String Amber).
*   **Construction Stages:** 
    *   *Foundation:* Grassy target lanes staked with chalk lines, wooden boxes of arrows and bow planks stacked.
    *   *Framing:* Range target track slots dug out without metal wheels; watchtower legs rising with support stays.
*   **Damage States:** 
    *   *Minor:* Pierced target boards broken in half, scattered arrows in the grass, and torn camp curtains.
    *   *Major:* Both watchtowers crashed down across target lanes, camp fire spreading to timber huts, and bow racks snapped.
*   **Day Appearance:** Soft, bright glints from arrowheads resting on racks. Emerald green grass highlights are rich and saturated.
*   **Night Appearance:** Cozy green camp fire circles cast warm flickering lights onto white birch bark columns and target rings.

---

### 15. Cavalry Stable (The Dragoon Paddocks)

*   **Level 1 Appearance:** A simple wooden horse pen with a dirt floor, a single straw feeding manger, and a small lean-to roof sheltering a pile of riding saddles.
*   **Mid-Tier Appearance (Lvl 10-15):** A sturdy two-wing timber stable complex. Features a warm reddish-brown clay tile roof, neat rows of stalls with horse horses visible inside, and clean wash bays with water buckets. A small circular exercise track sits to the side.
*   **Max-Tier Appearance (Lvl 20+):** A grand cavalry academy. Built from deep-red brick and finished with white marble trim. It includes grand gated arched entry portals, multiple exercise arenas, and an integrated blacksmith forge venting sparks for cavalry horse-shoeing.
*   **Materials:** Glazed red bricks, wrought iron stable gates, clean yellow straw bedding, and polished saddle leather.
*   **Color Palette:** `#A0522D` (Sienna Clay Tile), `#F4F6F7` (Trim Plaster), `#E59866` (Yellow Straw Bedding), `#1F1F1F` (Wrought Stable Iron).
*   **Construction Stages:** 
    *   *Foundation:* Soil ground leveled and graveled, wooden boxes of horse shoes and harnesses stacked around.
    *   *Framing:* Main stable barn frames rising; exercise paddock fence half-anchored into post holes.
*   **Damage States:** 
    *   *Minor:* Broken paddock fences, scattered straw bundles across paths, and grease stains near forge slots.
    *   *Major:* stable roofs completely caved in, paddock enclosures smashed open with loose horse tracks, and forge chimney collapsed.
*   **Day Appearance:** Clear morning lighting; sunbeams cut through barn doors to illuminate dust particles floating over golden straw rows.
*   **Night Appearance:** Warm yellow oil lanterns hang from stable eaves. The mini-shodding forge glows with deep pulsing red embers.

---

### 16. Watchtower (The Sentry Telescope)

*   **Level 1 Appearance:** A tall, simple four-legged wooden tower holding a small guard deck covered by a simple thatched roof, fitted with a single bronze alarm bell on a rope.
*   **Mid-Tier Appearance (Lvl 10-15):** A strong stone-and-wood tower. Built of gray brick, featuring an enclosed watch chamber with slit windows, a copper alarm trumpet, and a large metal search mirror capturing light. A red pennant flag flies from the top.
*   **Max-Tier Appearance (Lvl 20+):** An elite fortified telescope tower. Boasts monumental ashlar stone blocks, a heavy metal dome roof, and a massive rotating mechanical telescope with glowing cyan energy lenses. Corner lightning rod strips capture cloud storms.
*   **Materials:** Dark ashlar basalt stones, copper framing, large cyan focal glass lenses, and heavy rope ties.
*   **Color Palette:** `#2C3E50` (Basalt Stone), `#73C6B6` (Cyan-Teal Glass Glow), `#D35400` (Copper Framing), `#F1C40F` (Search Mirror Brass).
*   **Construction Stages:** 
    *   *Foundation:* Square concrete footings laid in bedrock, with raw steel bolts projecting upward near toolboxes.
    *   *Framing:* Stone tower column rising in stairs with a pulley lift; wooden platform deck half-built on top scaffold.
*   **Damage States:** 
    *   *Minor:* Cracked watch slit windows, snapped copper lightning rod lines, and frayed climbing ladders.
    *   *Major:* Upper tower section sheared off completely, collapsing debris around the base, and cracked telescope lenses.
*   **Day Appearance:** Highlights gleam off glass lenses and brass search mirrors. The tower projects a long, thin shadow across city zones.
*   **Night Appearance:** The telescope projects a thick cone of soft cyan searchlight that slowly sweeps over external city pathways on a loop.

---

## 💻 SECTION III: TECH-ART SHADER & CODE SPECIFICATIONS

To implement these environmental assets inside our React container dev system and Godot engine:

### 1. Unified PBR Material Channel Definitions (Godot / WebGL)
All building models must map their texture outputs exactly under these five channels for maximum mobile efficiency:
- **Albedo / Base Color (RGBA):** RGB maps the base color with pre-baked soft ambient occlusion in dark areas. Alpha defines the translucent glass/ice mask.
- **Normal Map (RGB):** Tangent-space normal coordinates ($Y+$ up/Green) to catch 3D bevel specular highlights under rotating sun environments.
- **Roughness / Metallic / AO (RMA Map):**
    - Red Channel ($R$): Grayscale Roughness ($0.0$ polished, $1.0$ chalky).
    - Green Channel ($G$): Grayscale Metallic ($0.0$ dielectric, $1.0$ raw metal).
    - Blue Channel ($B$): Pre-baked ambient occlusion factor.
- **Emission (RGB):** Dark base color with active glowing values (glowing star runes, molten iron channels, magical sanctuary water, night windows).

### 2. Time-of-Day Transition Shader (GLSL Sketch)
This shader controls the smooth material lerping between Day and Night appearances inside the WebGL container:

```glsl
// GLSL fragment shader preview for Crownspire WebGL container
shader_type spatial;

uniform sampler2D albedo_day : source_color;
uniform sampler2D albedo_night : source_color;
uniform sampler2D emission_mask : hint_default_black;
uniform float time_of_day : hint_range(0.0, 1.0); // 0.0 Day, 1.0 Night
uniform vec3 night_window_color : source_color = vec3(1.0, 0.55, 0.0);

void fragment() {
    // Smoothly lerp base color textures based on world map calendar hours
    vec4 color_day = texture(albedo_day, UV);
    vec4 color_night = texture(albedo_night, UV);
    vec4 base_mixed = mix(color_day, color_night, time_of_day);
    
    // Extract glowing masks for magical pools and windows
    float glow_strength = texture(emission_mask, UV).r;
    vec3 emission_glow = glow_strength * mix(vec3(0.0), night_window_color, time_of_day * 1.5);
    
    ALBEDO = base_mixed.rgb;
    EMISSION = emission_glow * 2.5; // Exaggerated Pixar glow multiplier
    METALLIC = 0.1; // Toy-like soft dielectric standard
    ROUGHNESS = 0.45; // Soft specular reflection capture
}
```

This building art production bible guarantees consistent world layout visuals and beautiful aesthetic standards. Let's compile the applet to confirm visual setup!
