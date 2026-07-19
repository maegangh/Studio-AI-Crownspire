# CROWNSPIRE: BUILDING ART PRODUCTION GUIDE
**Official Architectural Asset GDD for 2.5D Pixar-Style MMO Renderings**
**Technical Production Blueprint for Godot Coordinate Grid & React Canvas Integration**

---

## 🎨 ART DIRECTION BRIEF: THE "PIXAR-GOTHIC" WORLD
Inside **Crownspire**, the environment merges a heavy medieval-gothic landscape (carved deep-slate granite, weathered iron rivets, swirling spirit mists, and runic glyphs) with the warm, expressive, and tangible aesthetic of three-dimensional animated feature films. 

### Geometric Rules for Asset Artists
1. **Bevel Everything:** Zero razor-sharp computer-generated edges. Stone blocks feel hand-molded with chunky geometric curves. Wooden support logs are stout, slightly curved, with high-relief woodgrain detailing.
2. **Exaggerated Weights:** Columns are thicker at the bottom. Roof slopes are steep and possess concave sag curves to showcase architectural charm. Banners, ropes, and chains have heavy volumetric profiles.
3. **Materials & Surface Shaders:**
   - **Deep Grey Slate:** Dark matte stone with hand-painted highlight edges and deep blue-indigo shadows.
   - **Polished Crownspire Copper:** Stylized metallic orange trims, pipe conduits, and dome crowns casting rich specular glints.
   - **Cedargrain Timber:** Stout, honey-brown or mahogany-grained wooden frames featuring smooth satin specular values.
   - **Fabric & Silks:** Vibrant banners (with double-sided soft sub-surface light) designed in bold heraldic colors.

---

## SECTION I: MUNICIPAL & MILITARY NUCLEUS (6 BUILDINGS)

### 1. Citadel Keep (`castle`)
*   **Grid Coordinates:** $X: 440,\; Y: 270$ | **Bounds:** $240 \times 180\text{px}$ | **Layer:** `z-30`

*   **Visual Description:** 
    An awe-inspiring round castle keep built upon a double-decked limestone platform. The keep is surrounded by dynamic concentric towers with sloped slate-tiled cones, topped with golden-gilded spire needles. A heavy main drawbridge entrance is framed by a magnificent arch displaying glowing sovereign solar sigils.
*   **Materials:** 
    Royal Grey Slate, Polished Sovereign Copper, White Carved Limestone, Velvet Brocade Silks, and Hardened Steel Portcullises.
*   **Color Palette:** 
    - *Sunset Amber* (`#F59E0B`)
    - *Citadel Stone Black* (`#1E293B`)
    - *Polished Copper Gold* (`#F59E0B` / `#D97706`)
    - *Deep Velvet Cobalt* (`#1E3A8A`)
*   **Upgrade Appearance Changes:**
    - **Tier I (Lvl 1-10):** A robust stone tower with simple wooden ramparts and single copper flagpole.
    - **Tier II (Lvl 11-25):** Double concentric towers, fortified steel battlements, and golden sunset banners.
    - **Tier III (Lvl 26-40):** A grand multi-winged palace wing boasting massive floating copper crown spires and fully illuminated orbital sun rings.
*   **Day Appearance:** 
    Bathed in clear, high-contrast golden-hour sunlight. Bright specular glare reflects off copper spires, casting soft warm shadows across the grass.
*   **Night Appearance:** 
    Windows glow with warm, comforting candle fire. Golden sunset embers pulse from the main archway, and ethereal light beams shoot skyward from the apex spire.
*   **Damage Appearance:** 
    Cracked limestone foundations, smoke billowing from collapsed side battlements, and tom banners drifting in the breeze with runic lights flickering erratically.

---

### 2. Vault Warehouse (`warehouse`)
*   **Grid Coordinates:** $X: 495,\; Y: 100$ | **Bounds:** $130 \times 110\text{px}$ | **Layer:** `z-10`

*   **Visual Description:** 
    A low, fortress-like secure treasury vault. Constructed from massive interlocking dark grey granite slabs and wrapped in thick protective copper bands. The main interface features a giant clockwork wheel mechanical combination lock that vents steam during treasury audits.
*   **Materials:** 
    Chunky Dark Granite, Riveted Burnished Copper, Heavy Cast Iron, and Thick Grease-sealed Oak Panels.
*   **Color Palette:**
    - *Granite Slate* (`#334155`)
    - *Oxidized Copper Orange* (`#EA580C`)
    - *Steam White* (`#F1F5F9`)
    - *Molten Gold* (`#EAB308`)
*   **Upgrade Appearance Changes:**
    - **Tier I (Lvl 1-10):** A single subterranean stone basement with a wooden padlocked door.
    - **Tier II (Lvl 11-25):** Above-ground granite safe-house with copper reinforcement bands and small steam vents.
    - **Tier III (Lvl 26-40):** An immense, armored vault fortress with giant rotating brass cog systems and gold coin spilling pathways.
*   **Day Appearance:** 
    Clean reflections off flat copper plating, with detailed hand-painted chisel marks visible across the granite blocks.
*   **Night Appearance:** 
    Warm yellow furnace shafts glow from ventilation floor grates, casting hot, geometric ground grid shadows.
*   **Damage Appearance:** 
    Dented copper bands popping loose from rivets, deep fissures slicing the granite masonry, and loose gold coins sparkling in piles of rubble.

---

### 3. Research Hall (`academy`)
*   **Grid Coordinates:** $X: 260,\; Y: 150$ | **Bounds:** $130 \times 110\text{px}$ | **Layer:** `z-20`

*   **Visual Description:** 
    An elegant, curved library and observatory styled from deep indigo obsidian. The peak is dominated by a majestic blue dome painted with gold constellation lines, topped with an active brass armillary sphere and a comical, oversized telescope.
*   **Materials:** 
    Polished Jet Obsidian, Laminated Indigo Glass, Spinning Brass Gears, and Heavy Bound Ancient Vellum.
*   **Color Palette:**
    - *Nebula Indigo* (`#1E1B4B`)
    - *Astrological Cyan* (`#06B6D4`)
    - *Armillary Brass* (`#CA8A04`)
    - *Stardust Silver* (`#E2E8F0`)
*   **Upgrade Appearance Changes:**
    - **Tier I (Lvl 1-10):** A small stone dome housing a simple vertical brass sundial.
    - **Tier II (Lvl 11-25):** Larger observatory with blue-dyed tiled roof layers and rotating telescope.
    - **Tier III (Lvl 26-40):** A floating, multi-ringed mystical academy backed by levitating constellation globes and spiraling magical rings.
*   **Day Appearance:** 
    Sunlight glints brightly off the polished obsidian walls, while the brass armillary reflects clean sky-blue tones.
*   **Night Appearance:** 
    Stellar blue and turquoise magical beams escape glass skylights. Constellation runes glow dynamically across the indigo dome roof.
*   **Damage Appearance:** 
    Shattered glass panels, the astronomical telescope bent and cracked downward, and swirling blue magical sparks leaking wildly onto the slate path.

---

### 4. Imperial Embassy (`embassy`)
*   **Grid Coordinates:** $X: 730,\; Y: 150$ | **Bounds:** $130 \times 110\text{px}$ | **Layer:** `z-20`

*   **Visual Description:** 
    A majestic classical diplomatic building featuring marble pillars wrapped in plush royal-blue velvet flags. The flat cedar roof holds cozy, warm pegasus carrier coops surrounded by carved white avian statuary.
*   **Materials:** 
    Pristine White Marble, Royal Blue Silk Velvet, Warm Redwood Timbers, and Cast Bronze Lanterns.
*   **Color Palette:**
    - *Ivory Alabaster* (`#F8FAFC`)
    - *Alliance Blue* (`#2563EB`)
    - *Bright Silver* (`#CBD5E1`)
    - *Lantern Warm Glow* (`#FEF08A`)
*   **Upgrade Appearance Changes:**
    - **Tier I (Lvl 1-10):** A cozy wooden consulate tent containing basic map tables.
    - **Tier II (Lvl 11-25):** White stone block embassy with alliance shields and elegant wooden pegasus nesting boxes.
    - **Tier III (Lvl 26-40):** A massive marble palace fronted by double marble colonnades, grand silver banners, and floating alliance crystal seals.
*   **Day Appearance:** 
    Crisp white limestone highlights against a clean blue sky view. The red-wood trim casts soft ambient shadow edges.
*   **Night Appearance:** 
    Hanging glass orbs emanate a steady warm-white glow, illuminating the detailed silver embroidery of the hanging alliance emblems.
*   **Damage Appearance:** 
    Toppled marble columns, charred and tattered blue flags, and empty pegasus coops hanging loose from split wooden rafters.

---

### 5. Hall of Heroes (`hall_of_heroes`)
*   **Grid Coordinates:** $X: 870,\; Y: 190$ | **Bounds:** $130 \times 110\text{px}$ | **Layer:** `z-20`

*   **Visual Description:** 
    An split-level pantheon temple carved directly into a granite cliffside, reached by a wide staircase flanked by two giant copper warrior statues holding long spears. A bronze fire brazier at the peak burns with constant divine flame.
*   **Materials:** 
    Monolithic Granite Rock, Gilded Bronze Brazier, Cast Copper Sculpture, and Clean White Terrazzo.
*   **Color Palette:**
    - *Deep Cavern Grey* (`#475569`)
    - *Heroic Bronze* (`#B45309`)
    - *Ethereal Gold* (`#FBBF24`)
    - *Sacred White* (`#FFFFFF`)
*   **Upgrade Appearance Changes:**
    - **Tier I (Lvl 1-10):** A simple stone altar stone with two bronze standard torches.
    - **Tier II (Lvl 11-25):** Stone temple cutout featuring marble steps and flanking copper warrior shields.
    - **Tier III (Lvl 26-40):** An immense, open-air Greek-gothic cathedral framed by giant glowing warrior statues and sweeping waterfalls of golden light.
*   **Day Appearance:** 
    Strong specular reflections on the copper statues' shields. Dark stone crevices contrast cleanly with the white marble steps.
*   **Night Appearance:** 
    The peak brazier projects a tall, roaring golden pillar of flame, casting flickering orange shadows down the temple slopes.
*   **Damage Appearance:** 
    Statues shattered and missing limbs, cracked marble stairs littered with boulder chunks, and the central brazier tipped over, leaking slow-burning ember trail graphics.

---

### 6. Trading Post (`trading_post`)
*   **Grid Coordinates:** $X: 120,\; Y: 190$ | **Bounds:** $130 \times 110\text{px}$ | **Layer:** `z-20`

*   **Visual Description:** 
    A lovely, bustling trade market constructed of connected orange, emerald-green, and beige striped canvas tents. Baskets of exotic goods and heavy bronze balancing scales rest on the surrounding cobblestone brick porch.
*   **Materials:** 
    Stretched Heavy Sailcloth, Raw Mahogany Burlap, Cast-Metal Scales, and Glazed Keramos Jars.
*   **Color Palette:**
    - *Bazaar Orange* (`#F97316`)
    - *Emerald Jade* (`#059669`)
    - *Autumn Ochre* (`#D97706`)
    - *Clay Terracotta* (`#C2410C`)
*   **Upgrade Appearance Changes:**
    - **Tier I (Lvl 1-10):** A single tattered canvas stand with fruit barrels and a basic balance scale.
    - **Tier II (Lvl 11-25):** Multiple linked merchant tents with a wooden deck and colorful flags.
    - **Tier III (Lvl 26-40):** A multi-tiered stone bazaar hall featuring brass roof vents, merchant wagons, and glowing potion display towers.
*   **Day Appearance:** 
    Soft light filters through the semi-translucent colored canvas roofs, giving the interior stalls a warm, inviting glow.
*   **Night Appearance:** 
    Festooned string lights trace the awnings with safe amber dots, while green and pink light shines outwards from magical potion boxes.
*   **Damage Appearance:** 
    Torn and smoking fabric structures, crushed wooden crates spilling spices and grain, and brass scales bent flat against the ground.

---

## SECTION II: RAW AGRICULTURAL & GEOLOGICAL FIELDS (4 LANDS)

### 7. Wanderers Farm (`farm`)
*   **Grid Coordinates:** $X: 100,\; Y: 550$ | **Bounds:** $130 \times 110\text{px}$ | **Layer:** `z-10`

*   **Visual Description:** 
    A charming country windmill built of rich honey oak, with spinning sails of green and white linen patches. Surrounding fields feature oversized, stylized orange grain stalks that sway as if alive.
*   **Materials:** 
    Spun Honey-Oak Planks, Green Stitched Sailcloth, Rustic Woven Fences, and Glowing Organic Seeds.
*   **Color Palette:**
    - *Meadow Green* (`#16A34A`)
    - *Honey Oak* (`#B45309`)
    - *Wheat Gold* (`#F59E0B`)
    - *Soil Sienna* (`#78350F`)
*   **Upgrade Appearance Changes:**
    - **Tier I (Lvl 1-10):** A simple thatch barn next to some loose dirt patches.
    - **Tier II (Lvl 11-25):** Beautiful wooden windmill with rotating sails and fenced grain lanes.
    - **Tier III (Lvl 26-40):** Multiple connected glass greenhouses, mechanical copper grain sifters, and levitating golden fertilizer pods.
*   **Day Appearance:** 
    Lush, saturated greens. Field soil textures look rich and damp, reflecting soft morning ambient highlights.
*   **Night Appearance:** 
    Dormant sails lock in a cross, with fireflies encircling the crop lanes and quiet lanterns illuminating the windmill's small glass windows.
*   **Damage Appearance:** 
    Shattered windmill blades hanging by splintered ropes, charred soil beds, and broken fences trampled into the ground.

---

### 8. Timber Woodmill (`lumber_mill`)
*   **Grid Coordinates:** $X: 340,\; Y: 550$ | **Bounds:** $130 \times 110\text{px}$ | **Layer:** `z-10`

*   **Visual Description:** 
    A cozy log cabin fitted with an active wooden waterwheel fed by a splashing mountain stream. A large copper buzz-saw sits on a stone base, sending stylized yellow wooden sparks flying.
*   **Materials:** 
    Bark Mahogany Pine, Wet Cedar Wheels, Heavy Bronze Chains, and Tempered Copper Buzzblades.
*   **Color Palette:**
    - *Pine Forest Bark* (`#451A03`)
    - *Wet Timber Amber* (`#92400E`)
    - *Splashing Blue Teal* (`#0D9488`)
    - *Burnished Bronze* (`#9A3412`)
*   **Upgrade Appearance Changes:**
    - **Tier I (Lvl 1-10):** A simple stone hearth with two hand saws and loose wood logs.
    - **Tier II (Lvl 11-25):** Log mill equipped with active waterwheel, log cranes, and stacked lumber blocks.
    - **Tier III (Lvl 26-40):** Steam-powered heavy industrial sawmill featuring double iron blades and copper exhaust chimneys venting white rings.
*   **Day Appearance:** 
    Spume water spray glows with soft white mist shaders. Sunlight highlights the clean cut timber grain rings.
*   **Night Appearance:** 
    Yellow sparks fly from the blade pedestal, casting transient golden rim-lighting across dark pine tree silhouettes.
*   **Damage Appearance:** 
    Waterwheel jammed and splintered in half, steam boilers venting dark grey soot plumes, and scattered pine logs rolling down into the terrain.

---

### 9. Slate Quarry (`quarry`)
*   **Grid Coordinates:** $X: 650,\; Y: 550$ | **Bounds:** $130 \times 110\text{px}$ | **Layer:** `z-20`

*   **Visual Description:** 
    A clean-cut terraced geologic quarry showcasing perfect chiseling lines. A heavy pine crane fitted with bronze gears pivots to hoist a massive, cubical slab of glistening slate stone.
*   **Materials:** 
    Crystalline Quartz Slate, Rough-barked Fir Logs, Braided Hemp Rope, and Sandblown Copper Lanterns.
*   **Color Palette:**
    - *Deep Blue Slate* (`#475569`)
    - *Exposed Clay Red* (`#9A3412`)
    - *Reticulated Granite* (`#64748B`)
    - *Warm Hemp* (`#D97706`)
*   **Upgrade Appearance Changes:**
    - **Tier I (Lvl 1-10):** A muddy pit mine with a pair of simple iron shovels.
    - **Tier II (Lvl 11-25):** Terraced stone quarry with ladders, wooden scaffolding, and hoisting ropes.
    - **Tier III (Lvl 26-40):** Massive bedrock dig-site with steam excavators, mine tracks, and hanging blue power crystals.
*   **Day Appearance:** 
    Crisp shadows define the geometric terrace ledge lines. Blue crystalline inclusions spark in the rock faces.
*   **Night Appearance:** 
    Sconce fires and copper lanterns throw long, sharp shadows along the cliff terraces, illuminating deep blue rock faces.
*   **Damage Appearance:** 
    Collapsed quarry terraces, split wooden scaffolds buried in rock piles, and the heavy crane broken at its main arm pivot.

---

### 10. Deep-Iron Shaft (`iron_mine`)
*   **Grid Coordinates:** $X: 890,\; Y: 550$ | **Bounds:** $130 \times 110\text{px}$ | **Layer:** `z-20`

*   **Visual Description:** 
    A heavy tunnel braced with stout, iron-sheathed beam supports. A rustic rail track exits the black cavern mouth, holding a minecart loaded with brilliant red iron ore crystals.
*   **Materials:** 
    Burnt Oak Framing, Ribbed Steel Straps, Flawless Ruby Quartz, and Cast-Iron Rails.
*   **Color Palette:**
    - *Geothermal Red* (`#DC2626`)
    - *Charred Oak Wood* (`#1E1B4B`)
    - *Iron Grey Metal* (`#475569`)
    - *Volcanic Amber* (`#F97316`)
*   **Upgrade Appearance Changes:**
    - **Tier I (Lvl 1-10):** A dark hole in the dirt with a single wooden support beam.
    - **Tier II (Lvl 11-25):** Solid mine opening braced with iron-bound logs, complete with minecart tracks and tools.
    - **Tier III (Lvl 26-40):** An automated iron smelter mouth featuring double tracks, furnace vents, and raw iron casting vats.
*   **Day Appearance:** 
    High contrast dark cave interior framing bright, glowing clusters of red ore crystals catching the daylight.
*   **Night Appearance:** 
    Glowing magma vents and safety lamps illuminate active steam drifts. Red crystalline pulses project warm scarlet ground lighting.
*   **Damage Appearance:** 
    Cave mouth completely collapsed under rubble layers, twisted steel rails, and spilled molten ore pooling on the grass tiles.

---

## SECTION III: SANCTIFIED WARDS & HOSPICES (2 HOSPITALS)

### 11. Sacred Hospital (`hospital`)
*   **Grid Coordinates:** $X: 120,\; Y: 450$ | **Bounds:** $130 \times 110\text{px}$ | **Layer:** `z-20`

*   **Visual Description:** 
    A warm, gothic sanctuary built of beautiful ivory stones, supporting sloped lavender roofs. Hanging stained-glass windows filter comforting pink-rose light, and massive copper censers swing from timber arches to release herbal mist.
*   **Materials:** 
    Dolomite Alabaster, Glazed Lavender Ceramics, Lead Stained Glass, and Polished Cast Copper.
*   **Color Palette:**
    - *Healing Rose* (`#EC4899`)
    - *Lavender Violet* (`#8B5CF6`)
    - *Dolomite White* (`#F1F5F9`)
    - *Lapis Shadow* (`#312E81`)
*   **Upgrade Appearance Changes:**
    - **Tier I (Lvl 1-10):** A simple medical tent marked by red cross apothecary flags.
    - **Tier II (Lvl 11-25):** White stone sanatorium with sloped lavender roof and copper incense kettles.
    - **Tier III (Lvl 26-40):** A multi-winged cathedral center boasting massive angel-gilded glass rose windows and magical spring fountains.
*   **Day Appearance:** 
    Lavender roof tiles reflect clean violet tones. Sunlight catches the textured brushstrokes of the white mortar masonry.
*   **Night Appearance:** 
    Stained glass windows cast a warm rose and lilac glow on the surrounding paths. Swinging censers emit thick, glowing pinkish twilight fog.
*   **Damage Appearance:** 
    Shattered rose-glass windows, cracked tiled roofs, and copper censers smashed and spilling cold violet powders.

---

### 12. Grave Sanctuary (`sanctuary`)
*   **Grid Coordinates:** $X: 870,\; Y: 450$ | **Bounds:** $130 \times 110\text{px}$ | **Layer:** `z-20`

*   **Visual Description:** 
    A mystical mausoleum surrounded by levitating obsidian monoliths inscribed with glowing neon-blue runes. A central stone courtyard houses an open basin bubbling with ethereal blue spirit mana.
*   **Materials:** 
    Polished Basalt Rock, Glowing Ethereal Crystals, Floating Granite Segments, and Violet Leaf Silks.
*   **Color Palette:**
    - *Ethereal Sapphire* (`#3B82F6`)
    - *Basalt Black* (`#020617`)
    - *Mystic Wisteria* (`#C084FC`)
    - *Runestream Teal* (`#14B8A6`)
*   **Upgrade Appearance Changes:**
    - **Tier I (Lvl 1-10):** A single granite headstone shaded by a bent cedar branch.
    - **Tier II (Lvl 11-25):** Basalt sanctuary mausoleum framed by glowing pool basins and floating stones.
    - **Tier III (Lvl 26-40):** A majestic celestial tomb complex with towering floating arches, glowing soul geysers, and ancient spirits drifting.
*   **Day Appearance:** 
    Clean specular gleam on the dark floating basalt rocks. The pool water exhibits smooth, cartoon sea-green refractive surfaces.
*   **Night Appearance:** 
    The soul pool glows with deep turquoise bioluminescence. Floating runes orbit the spires like a halo of digital neon blue.
*   **Damage Appearance:** 
    Obsidian monoliths collapsed and broken on the ground, the spiritual pool mud-choked and cracked dry, and lingering blue sparks flickering weakly before fading.

---

## SECTION IV: MILITARY ENCLAVES & WATCH POSTS (4 GARRISONS)

### 13. Infantry Barracks (`infantry_barracks`)
*   **Grid Coordinates:** $X: 180,\; Y: 310$ | **Bounds:** $135 \times 115\text{px}$ | **Layer:** `z-20`

*   **Visual Description:** 
    A low, defensive combat training enclave with defensive spikes. The central sandy courtyard contains sword racks carrying oversized copper-trimmed shields and training targets topped with funny round iron bucket helmets.
*   **Materials:** 
    Splintered Alder Logs, Oxidized Copper Sheets, Braided Steel Ropes, and Sifted Dune Sands.
*   **Color Palette:**
    - *Crimson Shield* (`#DC2626`)
    - *Arena Sand* (`#F59E0B`)
    - *Weathered Steel* (`#475569`)
    - *Rivet Bronze* (`#78350F`)
*   **Upgrade Appearance Changes:**
    - **Tier I (Lvl 1-10):** A basic training yard with a log fence and target sacks.
    - **Tier II (Lvl 11-25):** Heavy training cabin wrapped in metal sheeting, complete with weapon racks.
    - **Tier III (Lvl 26-40):** A grand fortress yard with towering steel defensive gates, stone shield monuments, and burning flame beacons.
*   **Day Appearance:** 
    The warm golden arena sand highlights the heavy, cartoon-like proportions of the copper shields and training dummies.
*   **Night Appearance:** 
    High-contrast orange flames crackle inside iron floor-braziers, casting intense combat-training shadows along the log walls.
*   **Damage Appearance:** 
    Wooden defensive spikes snapped flat, target dummies burning with dark soot, and metal-clad shield walls split open.

---

### 14. Marksmen Camp (`marksmen_camp`)
*   **Grid Coordinates:** $X: 300,\; Y: 410$ | **Bounds:** $135 \times 115\text{px}$ | **Layer:** `z-20`

*   **Visual Description:** 
    A whimsical archery academy featuring sloped, thatch grass roofs over red-wood posts. Targets stuffed with gold straw showcase painted copper bullseyes struck with oversized wooden arrows.
*   **Materials:** 
    Woven Reed Thatch, Sliced Red Alder, Green Wax-bound Feathers, and Braided Linen Linestrings.
*   **Color Palette:**
    - *Lodge Thatch Yellow* (`#EAB308`)
    - *Red Alder Wood* (`#7C2D12`)
    - *Arrow Feather Mint* (`#10B981`)
    - *Bullseye Bronze* (`#B45309`)
*   **Upgrade Appearance Changes:**
    - **Tier I (Lvl 1-10):** Two basic archery bales sitting under a simple canvas awning.
    - **Tier II (Lvl 11-25):** Thatch firing lodge with cedar lanes, targets, and a leather bow stand.
    - **Tier III (Lvl 26-40):** Multi-level stone firing tower housing massive mechanical repeating crossbows and revolving arrow boxes.
*   **Day Appearance:** 
    Golden thatch reflects bright sunlight. Fine straw fibers and painted targets showcase charming, thick painted highlights.
*   **Night Appearance:** 
    Cozy oil-flame wall sconces light the firing lanes, while wind socks drift under cool dark-violet evening shadows.
*   **Damage Appearance:** 
    Thatch roofs burning with bright yellow embers, wood lanes splintered, and giant target bales rolled and crushed.

---

### 15. Cavalry Stable (`cavalry_stable`)
*   **Grid Coordinates:** $X: 805,\; Y: 310$ | **Bounds:** $135 \times 115\text{px}$ | **Layer:** `z-20`

*   **Visual Description:** 
    A cozy, stylized equine barn painted dark barn-red with gold straw spilling from sliding loft doors. The outdoor paddock is bordered by an elegant, curved honey-colored copper fence with jumping hurdles.
*   **Materials:** 
    Lacquered Red-Oak, Polished Copper Castings, Bound Golden Straw, and Cozy Soft Teal Woolen blankets.
*   **Color Palette:**
    - *Barn Red* (`#B91C1C`)
    - *Paddock Wood* (`#D97706`)
    - *Blanket Teal* (`#14B8A6`)
    - *Straw Ochre* (`#FEF08A`)
*   **Upgrade Appearance Changes:**
    - **Tier I (Lvl 1-10):** A basic wooden horse pen with a single horse trough.
    - **Tier II (Lvl 11-25):** Red wooden stables barn, paddock fences, and straw hay-bales.
    - **Tier III (Lvl 26-40):** An expansive equestrian stone courtyard with copper-gilded weather vanes, water wells, and grand training tracks.
*   **Day Appearance:** 
    The rich barn-red siding pops brilliantly against green turf. Copper accessories catch bright, warm specular points.
*   **Night Appearance:** 
    Stable windows issue warm, lantern-lit ambient light. Soft steam drifts from the copper horse tubs inside the stalls.
*   **Damage Appearance:** 
    Paddock rails broken and scattered on the mud, sliding stable doors ripped off track, and haystacks smoking and smoldering with embers.

---

### 16. Sentry Watchtower (`watchtower`)
*   **Grid Coordinates:** $X: 685,\; Y: 410$ | **Bounds:** $135 \times 115\text{px}$ | **Layer:** `z-20`

*   **Visual Description:** 
    A tall watchtower constructed of dark grey base stones merging into thick braced timber support beams. At the crows-nest peak, a massive brass surveillance spyglass rotates beneath a sloped copper canopy.
*   **Materials:** 
    Dressed Slate Granite, Hardened Pine Timbers, Polished Telescope Brass, and Heavy Cast-Iron Hoods.
*   **Color Palette:**
    - *Watchtower Brass* (`#CA8A04`)
    - *Heavy Slate* (`#334155`)
    - *Weathered Bark* (`#5C2D12`)
    - *Beacon Yellow* (`#EAB308`)
*   **Upgrade Appearance Changes:**
    - **Tier I (Lvl 1-10):** A tall wood ladder ending in a simple rope lookout cage.
    - **Tier II (Lvl 11-25):** Solid stone base, timber support logs, and brass telescope system.
    - **Tier III (Lvl 26-40):** An armored sentinel keep boasting multiple scanning spyglasses, revolving oil beacons, and crystal focus towers.
*   **Day Appearance:** 
    The polished brass surface of the massive spyglass reflects bright sky highlights. Watchtower shadows extend long and sharp across coordinate panels.
*   **Night Appearance:** 
    A warm, yellow, rotating lighthouse beacon cuts cleanly through purple evening mist, scanning adjacent map coordinates at fixed rates.
*   **Damage Appearance:** 
    Telescope shattered on the ground below, timber scaffolding columns snapped, and the stone tower base fractured with deep, smoky chasms.

---

## SECTION V: RENDER SETTINGS & HUD COMPILING SPECIFICATIONS
1.  **Isometric Target Aspect Ratio:** All assets are authored in standard $2:1$ Isometric Projection ($26.565^\circ$ Camera Angle) with uniform top lighting.
2.  **Specular Maps (Gloss Value):** Apply satin/clay textures for structural slate ($15\%$ gloss), semi-gloss for wood planks ($40\%$ gloss), and ultra-reflective sharp highlights on copper domes and brass gears ($90\%$ gloss).
3.  **Alpha Transparency Layering:** Maintain $10\%$ empty border space around each sprite sheet. This safeguards pixels from edge bleed during tile grid panning in Godot or mobile view scales.

All variables align with layouts defined in `src/utils/cityLayout.ts`. Let's verify compilation!
