# CROWNSPIRE: BUILDING CONCEPT ART & VISUAL PRODUCTION GUIDE
**Official Architectural Production Bible for 2.5D Pixar-Gothic MMO Renderings**
**Prepared for Integration with Godot Tilemaps and React Canvas Layout Systems**

---

## 🎨 ART DIRECTION OVERVIEW: THE "PIXAR-GOTHIC" SCHEME
The built environment of **Crownspire** merges a heavy, mysterious dark fantasy realm (volcanic basalt columns, ancient runic slate, spirit mists, and cold cobalt emission lines) with the charming, expressive, and tactile art-direction principles of high-end 3D animated films. 

### Core Visual Directives for Assets
1.  **Chunky, Volumetric Bevels:** All computational sharp edges are strictly outlawed. Stone bricks feel blocky, hand-chiseled, and possess smooth rounded rim highlights. Timber supports are thick and stout, showcasing rich, sculpted woodgrain.
2.  **Exaggerated Structural Weight:** Base coordinates are wider to anchor the buildings onto the grassy tiles. Roof ridges exhibit stylized sag-curves to emphasize whimsical fantasy charm.
3.  **Dynamic Emission Systems:** Windows glow with warm candle-hearth yellow; runic arches pulse with specific mystical frequencies; chimney pipes vent puffy, cartoon cloud-wisps in dynamic clockwork sequences.
4.  **Symmetry & Framing Consistency:** Every structure is authored at a standard $2:1$ Isometric Projection ($26.565^\circ$ View Angle) facing the lower-left or lower-right coordinates.

---

## SECTION I: SOVEREIGN & MUNICIPAL NUCLEUS (6 PRIMARY SECTOR BUILDINGS)

### 1. Citadel Keep (`castle`)
*   **Grid Placement:** Coordinates $X: 440,\; Y: 270$ | **Bounds:** $240 \times 180\text{px}$ | **Layer:** `z-30`

*   **Level 1 Appearance:** 
    A single, squat stone tower constructed from dark grey slate bricks, supported by rough honey-oak beams. Features a sloping conical roof made of weathered blue tiles and a single wooden flagpost carrying a tattered black flag.
*   **Mid-Tier Appearance (Lvl 11-25):** 
    Composed of double concentric towers backed by structured limestone castle walls. The towers are capped with sloped slate cones wrapped in glossy copper crowns. Includes a heavy drawbridge gate displaying glowing amber sun sigils.
*   **Max-Tier Appearance (Lvl 26-40):** 
    A grand three-winged palace. Giant, detached copper crowns float above the tower peaks, suspended by magnetic sun runes. Broad, gold-embroidered velvet banners drift down. Massive gold constellation arcs rotate slowly around the central keep dome.
*   **Construction Stages:** 
    A foundation ring of wood scaffolding with coiled ropes and pulleys. In the center floats a glowing blue architectural blueprint rune, venting warm mist as clockwork hammer hammers sound.
*   **Damage States:** 
    Left tower collapsed into a pile of slate gravel, crumbling limestone brickwork exposing the dark interior, and tom sovereign flags smoldering with embers.
*   **Day/Night Lighting:**
    - *Daytime:* Saturated golden highlight points across copper spire tips; long, clean slate-blue drop shadows casting over map grasslands.
    - *Nighttime:* Royal amber light beams shoot vertically from the central castle spire, and towers glow internally with warm, cozy candle fire.

---

### 2. Vault Warehouse (`warehouse`)
*   **Grid Placement:** Coordinates $X: 495,\; Y: 100$ | **Bounds:** $130 \times 110\text{px}$ | **Layer:** `z-10`

*   **Level 1 Appearance:** 
    A simple underground stone cellar with a slanted wooden trapdoor secured by an oversized, comical rusty iron lock.
*   **Mid-Tier Appearance (Lvl 11-25):** 
    An above-ground bunker built from massive granite blocks, braced with thick, riveted copper structural bands. Features a small bronze smoke chimney venting steam rings.
*   **Max-Tier Appearance (Lvl 26-40):** 
    An impenetrable treasure vault. Multiple connected rotunda safes styled with copper-alloy roofing. The front exhibits a giant revolving clockwork combo lockpad made of brass and bronze gears that puff white steam during storage shifts.
*   **Construction Stages:** 
    A deep dirt excavation pit surrounded by wooden retaining walls and warning posts. Inside, small timber cranes hoisting copper steel sheets.
*   **Damage States:** 
    Fissures split the granite blocks, copper reinforcement bands pop loose from rivets, and loose golden coins spill out from broken vault seams.
*   **Day/Night Lighting:**
    - *Daytime:* Matte stone textures with high-contrast chisel outlines and rich spec-highlights on copper lockpins.
    - *Nighttime:* Hot orange furnace light pulses through metal ventilation grates, painting glowing grid meshes on the surrounding pathways.

---

### 3. Research Hall (`academy`)
*   **Grid Placement:** Coordinates $X: 260,\; Y: 150$ | **Bounds:** $130 \times 110\text{px}$ | **Layer:** `z-20`

*   **Level 1 Appearance:** 
    A small stone dome cottage with a single roof skylight and a simple wooden sundial mounted in the yard.
*   **Mid-Tier Appearance (Lvl 11-25):** 
    A curved obsidian library structure boasting a sloped blue tile roof. On the roof peak rests a bronze telescope pointing skyward.
*   **Max-Tier Appearance (Lvl 26-40):** 
    The celestial observatory. A majestic indigo dome decorated with gold constellation bands. A spinning brass armillary sphere and a colossal copper telescope occupy the roof, surrounded by floating rings of magical stellar mist.
*   **Construction Stages:** 
    Crates of leather-bound parchment and astronomical lenses stacked under canvas tarps. Curved timber arches of the dome being lashed with fat ropes.
*   **Damage States:** 
    Shattered glass panels on the dome, the copper telescope bent downward, and swirling blue magical sparks spilling chaotically onto the ground.
*   **Day/Night Lighting:**
    - *Daytime:* Clear sky-reflections glinting on polished obsidian walls. Armillary brass details cast clean amber highlights.
    - *Nighttime:* Glowing turquoise and sapphire beacon shafts project upward from the telescope lens, tracing magical constellations in the air.

---

### 4. Imperial Embassy (`embassy`)
*   **Grid Placement:** Coordinates $X: 730,\; Y: 150$ | **Bounds:** $130 \times 110\text{px}$ | **Layer:** `z-20`

*   **Level 1 Appearance:** 
    A cozy diplomat tent drafted from blue canvas flags and supported by pinewood posts. Out front is a wooden post with two messenger baskets.
*   **Mid-Tier Appearance (Lvl 11-25):** 
    A classical consulate building with smooth white limestone columns, draped in royal blue alliance banners. The flat timber roof holds tiny messenger pegasus coops.
*   **Max-Tier Appearance (Lvl 26-40):** 
    The Grand Imperial Consulate. Double white marble colonnades with silver carvings. Massive flowing velvet flags wrap the wings, and a giant silver alliance crystal floats above the center terrace, emitting soft white energy pulses.
*   **Construction Stages:** 
    Marble pillars standing half-carved inside wooden braces. Scaffolding towers host workers pulley-hoisting massive rolls of blue fabric.
*   **Damage States:** 
    Toppled white pillars crushing the stone steps, charred and smoking blue flags, and empty pegasus coops hanging broken from support beams.
*   **Day/Night Lighting:**
    - *Daytime:* Pristine white limestone shadows cast cleanly against the landscape. Silver trims sparkle under direct sunlight.
    - *Nighttime:* Hanging white gas lanterns emit comfortable misty light, softly detailing the silver sigils woven into the flags.

---

### 5. Hall of Heroes (`hall_of_heroes`)
*   **Grid Placement:** Coordinates $X: 870,\; Y: 190$ | **Bounds:** $130 \times 110\text{px}$ | **Layer:** `z-20`

*   **Level 1 Appearance:** 
    A basic stone slab altar standing in a mossy ring of ruins, decorated with two sputtering iron braziers.
*   **Mid-Tier Appearance (Lvl 11-25):** 
    An open-air stone pantheon carved into a monolithic granite cliff, featuring a wide grey marble staircase flanked by copper statues holding lances.
*   **Max-Tier Appearance (Lvl 26-40):** 
    An epic cathedral-gothic sanctuary. Giant, glowing bronze statues of legendary masters frame the grand stairs. A massive bronze crown brazier floats at the peak, containing a towering, roaring solar flame that releases golden ash sparks.
*   **Construction Stages:** 
    Granite slopes being terraced by masons. Statues arrive on heavy wooden rollers, wrapped in scaffolding ropes.
*   **Damage States:** 
    Statues cracked and missing limbs, marble steps shattered, and the central peak brazier tipped over, leaking slow-burning ember paths.
*   **Day/Night Lighting:**
    - *Daytime:* High specular shine on the statues' copper shields; hard, dramatic granite shadows casting deep within the cliff sanctuary.
    - *Nighttime:* The golden-amber solar fire projects towering light beams, flickering dynamic, dramatic silhouettes down the stairs.

---

### 6. Trading Post (`trading_post`)
*   **Grid Placement:** Coordinates $X: 120,\; Y: 190$ | **Bounds:** $130 \times 110\text{px}$ | **Layer:** `z-20`

*   **Level 1 Appearance:** 
    A simple wooden trading stall covered by a tattered beige sailcloth awning, with two barrels of apples out front.
*   **Mid-Tier Appearance (Lvl 11-25):** 
    A bustling bazaar made of interlinked orange, emerald-green, and beige striped canvas tents. Solid redwood decks support baskets of spices and bronze scales.
*   **Max-Tier Appearance (Lvl 26-40):** 
    A multi-tiered mercantile exchange hall featuring a slate-and-timber base and brass roof ventilation cowls. Small clockwork cargo wagons travel along tracks, and neon-glowing potion kiosks line the stone walkways.
*   **Construction Stages:** 
    Timber struts and supports raised on stone pegs, with rolls of striped fabric and packing crates scattered on the grass.
*   **Damage States:** 
    Tents tom open and burning, wooden crates smashed and spilling colorful spices and potion bottles, and bronze scales crushed flat.
*   **Day/Night Lighting:**
    - *Daytime:* Sunlight filters warm and colorful through the semi-translucent orange and green canvas canopies, casting colorful ground highlights.
    - *Nighttime:* Festoon string lights trace the roof contours with cozy warm-white bulbs, while pink and green glow bubbles float from potion carts.

---

## SECTION II: RAW AGRICULTURAL & GEOLOGICAL FIELDS (4 RESOURCE SITES)

### 7. Wanderers Farm (`farm`)
*   **Grid Placement:** Coordinates $X: 100,\; Y: 550$ | **Bounds:** $130 \times 110\text{px}$ | **Layer:** `z-10`

*   **Level 1 Appearance:** 
    A simple thatched country barn next to a muddy vegetable garden enclosed by a wattle fence.
*   **Mid-Tier Appearance (Lvl 11-25):** 
    A warm honey-oak windmill with rotating green-and-white patched sails. Cozy stables sit adjacent, surrounded by fields of glowing orange wheat stalks.
*   **Max-Tier Appearance (Lvl 26-40):** 
    A grand agricultural greenhouse complex of copper glass domes. Levitating silver fertilizer pods spray mist over crops, and giant water tanks feed a network of irrigation pipes.
*   **Construction Stages:** 
    Windmill center-tower being raised with heavy ropes. Timber panels stacked outside while a worker-sign reads "GRAIN SEED INCOMING".
*   **Damage States:** 
    Windmill sails shattered and hanging by ropes, glass domes cracked and dark, and scorched fields covered in smoldering ash.
*   **Day/Night Lighting:**
    - *Daytime:* Saturated emerald fields, rich wet soil colors, and high-specular glare flashing off the windmill's copper crown.
    - *Nighttime:* Cozy light glows from log windows, while luminescent green fireflies trace patterns above the dormant crop fields.

---

### 8. Timber Woodmill (`lumber_mill`)
*   **Grid Placement:** Coordinates $X: 340,\; Y: 550$ | **Bounds:** $130 \times 110\text{px}$ | **Layer:** `z-10`

*   **Level 1 Appearance:** 
    A wooden chopping block next to a two-man hand-saw setup and three stacked mahogany logs.
*   **Mid-Tier Appearance (Lvl 11-25):** 
    A cozy log cabin fitted with an active wooden waterwheel fueled by a splashing stream. Includes log cranes and a copper circular buzz-saw.
*   **Max-Tier Appearance (Lvl 26-40):** 
    A massive steam sawmill boasting double iron blades on tracks, an overhead log sorting system, and copper exhaust smokestacks releasing white smoke rings.
*   **Construction Stages:** 
    The stream-path cleared with wood retaining boards. Scaffolding supports the heavy timber wheel assembly.
*   **Damage States:** 
    Splintered waterwheel blades jammed in the stream, steam pipes collapsed and venting grey clouds, and random logs rolling down the banks.
*   **Day/Night Lighting:**
    - *Daytime:* Sunlight catches mist spray off the waterwheel; detailed high-resolution cedar ring grain texture highlights.
    - *Nighttime:* Golden timber-cutting sparks fly from the circular saw, lighting up the dark green pine tree foliage.

---

### 9. Slate Quarry (`quarry`)
*   **Grid Placement:** Coordinates $X: 650,\; Y: 550$ | **Bounds:** $130 \times 110\text{px}$ | **Layer:** `z-20`

*   **Level 1 Appearance:** 
    A simple dirt excavation pit with two shovels, a wooden ladder, and piles of bluish mineral rubble.
*   **Mid-Tier Appearance (Lvl 11-25):** 
    A terraced stone quarry showing clean geomorphic layers. A heavy pine crane fitted with thick ropes pivots to hoist massive slate blocks.
*   **Max-Tier Appearance (Lvl 26-40):** 
    An immense bedrock basin with automated steam excavators on iron rails. Floating power crystals lift huge granite chunks, and high spotlights illuminate the deep digs.
*   **Construction Stages:** 
    Terrace layers outlined with paint lines. Raw wooden supports being braced with heavy iron brackets.
*   **Damage States:** 
    Terraces collapsed in landslides, the giant wooden crane snapped at its pivot, and stone debris burying the crane tracks.
*   **Day/Night Lighting:**
    - *Daytime:* Crisp geometric shadows lining the quarry steps. Glistening quartz reflections trace the dark grey slate walls.
    - *Nighttime:* Warm copper oil torches cast dynamic flickering lights across the deep bluish stone crevices.

---

### 10. Deep-Iron Shaft (`iron_mine`)
*   **Grid Placement:** Coordinates $X: 890,\; Y: 550$ | **Bounds:** $130 \times 110\text{px}$ | **Layer:** `z-20`

*   **Level 1 Appearance:** 
    A shallow Mine cave entrance braced with single raw spruce logs, with a wooden wheelbarrow outside.
*   **Mid-Tier Appearance (Lvl 11-25):** 
    A solid mine mouth braced with heavy iron-bound oak beams, supporting a track rail with a minecart filled with glowing red ore crystals.
*   **Max-Tier Appearance (Lvl 26-40):** 
    A heavy iron foundry mouth featuring a double-track rail system. Huge active smelter vats vent red geothermal steam, and mechanical steel gates regulate entrance access.
*   **Construction Stages:** 
    Mine mouth being reinforced with thick timbers, and rail spikes being hammered into the gravel path.
*   **Damage States:** 
    Cave mouth completely caved in under massive boulders, twisted metal rails, and spilled molten ore pooling on the grass tiles.
*   **Day/Night Lighting:**
    - *Daytime:* High-contrast black cavern mouth emphasizing bright, glowing red quartz clusters near the cart beams.
    - *Nighttime:* Liquid heat ripples. Magma shafts cast high-intensity orange bottom-lights across the dark steel frameworks.

---

## SECTION III: SANCTIFIED WARDS & HOSPICES (2 OUTPOSTS)

### 11. Sacred Hospital (`hospital`)
*   **Grid Placement:** Coordinates $X: 120,\; Y: 450$ | **Bounds:** $130 \times 110\text{px}$ | **Layer:** `z-20`

*   **Level 1 Appearance:** 
    A simple healing tent marked by red cross apothecary flags, with two wooden cots out front.
*   **Mid-Tier Appearance (Lvl 11-25):** 
    A beautiful white-marble gothic sanatorium capped with lavender tile roofs and glowing stained-glass rose windows. Copper incense pots release calming purple mist.
*   **Max-Tier Appearance (Lvl 26-40):** 
    A grand three-winged cathedral sanctuary. Levitating angel statue water-fountains cascade with sparkling green healing water. Giant rose windows glow with complex sacred geometric designs.
*   **Construction Stages:** 
    White stone walls being aligned within wooden frames. Hanging scaffolds support stained-glass artists installing colorful panels.
*   **Damage States:** 
    Shattered stained-glass rose plates, cracked lavender roof tiles sliding down, and copper pots smashed on the path, spilling cold indigo powder.
*   **Day/Night Lighting:**
    - *Daytime:* Soft watercolor reflections bouncing off lavender roofing. Stone walls glisten with clean limestone detail.
    - *Nighttime:* Windows glow with warm rose and lilac light, projecting beautiful kaleidoscope patterns onto the adjacent dark stone roads.

---

### 12. Grave Sanctuary (`sanctuary`)
*   **Grid Placement:** Coordinates $X: 870,\; Y: 450$ | **Bounds:** $130 \times 110\text{px}$ | **Layer:** `z-20`

*   **Level 1 Appearance:** 
    A single ancient headstone resting beneath a bent, gnarled birch tree branch.
*   **Mid-Tier Appearance (Lvl 11-25):** 
    A basalt block mausoleum. Features glowing stone basins bubbling with turquoise spirit fluid and floating runic obelisks.
*   **Max-Tier Appearance (Lvl 26-40):** 
    An immense ethereal tomb complex. Towering black obsidian arches float above a central baptismal pool overflowing with glowing sapphire spiritual mana. Weeping violet-silk willow trees wrap the courtyard.
*   **Construction Stages:** 
    Monolithic stone slabs laying flat, wrapped in heavy chains. A blue floating containment rune circle holds the construction site stable.
*   **Damage States:** 
    Floating basalt obelisks collapsed and broken, the spiritual pool cracked dry and dark, and spectral blue light-orbs escaping into the air.
*   **Day/Night Lighting:**
    - *Daytime:* Silky obsidian reflections. High-contrast white and indigo highlights detailing the weep willow silk foliage.
    - *Nighttime:* The spirit pool projects rich turquoise bioluminescent light glows. Floating runes orbit the spires in neon blue trails.

---

## SECTION IV: MILITARY ENCLAVES & WATCH POSTS (4 GARRISON STATIONS)

### 13. Infantry Barracks (`infantry_barracks`)
*   **Grid Placement:** Coordinates $X: 180,\; Y: 310$ | **Bounds:** $135 \times 115\text{px}$ | **Layer:** `z-20`

*   **Level 1 Appearance:** 
    A small dirt sparring circle enclosed by a low rope fence, with two straw targets and a wooden sword box.
*   **Mid-Tier Appearance (Lvl 11-25):** 
    A solid stone sparring hall protected by spiked timber barricades. In the sand courtyard are targets carrying comically oversized steel helmets and shields.
*   **Max-Tier Appearance (Lvl 26-40):** 
    An immense, metal-plated military bastion featuring iron-sheathed defense walls, burning flame beacons, and giant stone vanguard shield monuments.
*   **Construction Stages:** 
    Logs being sharpened into spikes by woodworkers. Racked shield plates being polished in preparation for deployment.
*   **Damage States:** 
    Defense spikes snapped flat, target dummies smoldering with black smoke, and steel fortress walls split open in deep fissures.
*   **Day/Night Lighting:**
    - *Daytime:* Saturated arena sand details. High-specular light glinting off copper shield rims and steel standard lances.
    - *Nighttime:* Sconce fires and floor-braziers crackle with high orange flames, painting dynamic combat shadows against log boundaries.

---

### 14. Marksmen Camp (`marksmen_camp`)
*   **Grid Placement:** Coordinates $X: 300,\; Y: 410$ | **Bounds:** $135 \times 115\text{px}$ | **Layer:** `z-20`

*   **Level 1 Appearance:** 
    A simple wooden shooting line with three basic hay targets wearing small hand-drawn copper circles.
*   **Mid-Tier Appearance (Lvl 11-25):** 
    A whimsical wooden archery lodge topped with sloped woven thatch grass roofs. Features target bales struck with oversized wooden arrows.
*   **Max-Tier Appearance (Lvl 26-40):** 
    A multi-level stone shooting castle. Houses heavy mechanical rotating ballistas on turrets and scrolling targets on pulleys. Bright mint-green feathers fill arrow crates.
*   **Construction Stages:** 
    Wooden lane posts raised and tied. Workers weave straw bales, while stacks of cedar timbers await installation.
*   **Damage States:** 
    Thatch roofs burning with bright embers, shooting platforms split in half, and giant target bales rolled and crushed.
*   **Day/Night Lighting:**
    - *Daytime:* Rich, warm yellow highlight values across the thatch grass. Red cedar columns display clean morning shadows.
    - *Nighttime:* Cozy yellow wall lamps illuminate the lanes, and target circles reflect warning orange points under the moon.

---

### 15. Cavalry Stable (`cavalry_stable`)
*   **Grid Placement:** Coordinates $X: 805,\; Y: 310$ | **Bounds:** $135 \times 115\text{px}$ | **Layer:** `z-20`

*   **Level 1 Appearance:** 
    A simple fenced dirt paddock with a single horse halter post and a bucket of water.
*   **Mid-Tier Appearance (Lvl 11-25):** 
    A picturesque barn painted deep red, with golden straw spilling from loft doors. Surrounded by a curved copper paddock fence.
*   **Max-Tier Appearance (Lvl 26-40):** 
    A major equestrian courtyard. Features stone stable wings with copper horse weather vanes and mechanical horse water wheels. Stalls feature soft teal blankets.
*   **Construction Stages:** 
    Stable frames raised with supporting guidewires. Piles of fresh golden straw stacked neatly in boxes out front.
*   **Damage States:** 
    Paddock rails broken, stable doors ripped off track, and hay bales burning, drifting ashes across the terrain.
*   **Day/Night Lighting:**
    - *Daytime:* Saturated barn-red paint stands out cleanly from emerald grass. Copper trims glint under the sun.
    - *Nighttime:* Cozy yellow lantern glow escapes stable windows, casting warm square highlights across paddock dirt lanes.

---

### 16. Sentry Watchtower (`watchtower`)
*   **Grid Placement:** Coordinates $X: 685,\; Y: 410$ | **Bounds:** $135 \times 115\text{px}$ | **Layer:** `z-20`

*   **Level 1 Appearance:** 
    A tall wooden ladder ending in a simple rope lookout platform covered by a tiny round tattered awning.
*   **Mid-Tier Appearance (Lvl 11-25):** 
    A sturdy stone watch spires capped with timber lookout decks. Features a giant brass telescope rotating beneath a slope copper hood.
*   **Max-Tier Appearance (Lvl 26-40):** 
    An armored fortress tower. Features triple telescoping surveillance lenses and rotating yellow focus crystals. A roaring beacon light spins at the summit.
*   **Construction Stages:** 
    The stone watch base raised on limestone blocks, surrounded by scaffolding poles lashing with long ropes.
*   **Damage States:** 
    Telescopes shattered on the rocks below, timber platform supports snapped, and deep cracks running down the stone base.
*   **Day/Night Lighting:**
    - *Daytime:* The massive brass body of the telescope reflects brilliant solar highlights, casting long, sharp tower shadows across coordinate lanes.
    - *Nighttime:* A vibrant yellow lighthouse beacon rotates continuously, cutting through dark twilight mist to sweep adjacent map coordinates.

---

## SECTION V: TECHNICAL COMPILING SPEC FOR DEVS (GODOT / VITE)
1.  **Isometric Ground Anchor:** All assets must be centered with their coordinate pivot on their bottom-most pixel row to allow proper depth-sorting within game layouts.
2.  **Gloss values:** Configure $80\%$ specular gloss for polished copper and brass, $40\%$ for varnished timber log frames, and $10\%$ matte detail for slate walls.
3.  **Boundary Buffer:** Maintain a $10\%$ empty alpha pixel padding border in all exported `.png` sheets to prevent pixel truncation during responsive Web scales.

Coordinate frameworks sync directly with configurations inside `/src/utils/cityLayout.ts`. Let's run a final code validation build!
