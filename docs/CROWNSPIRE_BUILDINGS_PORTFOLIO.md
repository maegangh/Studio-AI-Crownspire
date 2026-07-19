# CROWNSPIRE: MUNICIPAL & MILITARY STRUCTURES PORTFOLIO
**Official Building Art Bible & Visual Production Specs for 2.5D Pixar-Style Renderings**
**Prepared for Integration with Godot Engine Isometric View Tilemaps**

---

## ART DIRECTION & THE "PIXAR-GOTHIC" SCHEME FOR STRUCTURES
This document establishes the official visual identity and rendering guidelines for all 16 city buildings in **Crownspire**. 
The goal of the architectural design is to combine the dark, heavy, and mysterious atmosphere of the Crownspire universe (deep slate stone, cold blue/violet runic glows, and dark weathered timbers) with the charming, tactile, and highly legible hallmarks of modern 3D animated feature films (exaggerated geometries, chunky volumetric bevels, and warm copper/bronze mechanical trims).

### Core Architectural Principles
1. **Chunky, Exaggerated Silhouettes:** Avoid razor-thin realistic edges. Every pillar, chimney, banner post, roof tile, and stone block should have an exaggerated thickness, soft rounded bevels, and strong geometric curves to capture the expressive Pixar charm.
2. **Tactile Material Contrasts:** 
   - **Deep Grey Slate:** Heavy, blocky masonry with rough, hand-carved textures and painterly bevel edge highlights.
   - **Polished & Burnished Copper:** Used for trims, pipes, clockwork gear complexes, dome toppers, and structural bands, casting bright orange specular highlights.
   - **Weathered Cedargrain Timber:** Stout wooden pillars and cross-beams with deep, hand-sculpted grain textures and rich honey-brown finishes.
   - **Vibrant Fabric Shaders:** Silky banners and flags (royal gold, velvet cobalt, deep emerald, dark violet) with thick, double-sided soft lighting.
3. **Thematic Magic Glows (Runic Emission):** Buildings utilize distinct glows emanating from runes, torches, windows, or magical focal points (e.g., golden sunset amber for Citadel, ethereal sapphire for Research, crimson lava for Iron Mine, spectral lilac for Sanctuary, and comforting spring mint for Farm).
4. **Isometric 2.5D Layering Consistency:** Every building is rendered in a clean, high-contrast, edge-trimmed isometric projection matching a ground bounding box defined in our `CITY_LAYOUTS` layout coordinates within the 1120px by 720px game canvas.

---

## SECTION I: SOVEREIGN & MUNICIPAL NUCLEUS (6 PRIMARY BUILDINGS)

### 1. Citadel Keep (`castle`)
*   **Grid Layout Spec:**
    - **ID:** `castle`
    - **Ground Coordinates:** $X: 440,\; Y: 270$ (Centerpiece Stage)
    - **Physical Bounds:** Width $240\text{px}$, Height $180\text{px}$
    - **Depth Layer / zIndex:** `z-30` (Apex elevation layered in front of Warehouse)
*   **Mechanical Functionality:** Supreme High Sovereign Headquarters. Dictates overall player kingdom building level caps and campaign chapter unlocked boundaries.
*   **Aesthetic & Visual Concept:**
    An immense Sovereign castle tower resting atop a double-decked, circular stone foundation. The structure features high-pitch gothic conical towers topped with polished copper spire crowns. A massive archway gate is reinforced with thick steel portcullis beams and burnished bronze heraldic sun-crest hinges. Broad gold-and-black Sovereign banners drape down her parapets, waving slowly in a perpetual cathedral sunset breeze.
*   **Lighting & Color Palette:**
    Warm, high-contrast golden-hour amber sunset key light. Deep slate-blue shadows. Bright copper specular gleams on roof ornaments. Golden-orange runes glow along the master archway framework.
*   **Image Generation Prompt:**
    > isometric 2.5D game sprite, Pixar-style Citadel Castle keep building, 3D render, Godot engine assets, cute chunky fantasy style. Large stone towers with conical roofs made of deep slate stone, glossy dark copper trims, heavy bronze gates adorned with glowing amber solar sun runes, oversized royal gold flags draping down, dramatic warm orange sunset rim lighting, soft painterly textures, isolated on black background, game icon quality --ar 4:3

---

### 2. Vault Warehouse (`warehouse`)
*   **Grid Layout Spec:**
    - **ID:** `warehouse`
    - **Ground Coordinates:** $X: 495,\; Y: 100$ (Highest elevation on canvas, positioned behind the Citadel)
    - **Physical Bounds:** Width $130\text{px}$, Height $110\text{px}$
    - **Depth Layer / zIndex:** `z-10` (Highest backdrop placement)
*   **Mechanical Functionality:** Primary resource safety vault. Safeguards player food, wood, stone, and iron treasuries from enemy plunders.
*   **Aesthetic & Visual Concept:**
    A squat, fortress-like treasury bunker engineered from massive interlocking granite stone slabs. The building is heavily banded in thick copper ribs and topped with reinforced, moisture-sealed slate roofing. The front features a giant, comical clockwork dial-pad padlock made of brass and bronze gears that occasionally vent small puffs of white steam.
*   **Lighting & Color Palette:**
    Warm hearth lighting pulsing from heavy iron-grate floor ventilation shafts. Burnished ochre, slate-black stone, weathered iron, and gleaming yellow-gold highlights around keyholes.
*   **Image Generation Prompt:**
    > isometric 2.5D game sprite, Pixar style secure stone vault treasury warehouse, 3D render, chunky blocky architecture, dark granite brick wall, thick copper protective bands, massive mechanical bronze gear lockpad, small chimney steam vents, stylized hand-painted textures, dramatic twilight ambient lights, isolated on black background --ar 4:3

---

### 3. Research Hall (`academy`)
*   **Grid Layout Spec:**
    - **ID:** `academy`
    - **Ground Coordinates:** $X: 260,\; Y: 150$ (Upper Left Sector)
    - **Physical Bounds:** Width $130\text{px}$, Height $110\text{px}$
    - **Depth Layer / zIndex:** `z-20` (Upper middle tier)
*   **Mechanical Functionality:** Academic and technological library for unlocking kingdom-wide resource, training speed, and power yield multipliers.
*   **Aesthetic & Visual Concept:**
    An elegant, curved library structure constructed from obsidian bricks, boasting a grandiose blue-domed roof lined with golden constellations. A large rooftop astronomical observatory is equipped with a spinning brass armillary sphere and a comical, oversized copper telescope. Warm scholar candlelight and sparkling turquoise stellar dust escape from leaded glass windows.
*   **Lighting & Color Palette:**
    Intellectual sapphire-blue emission highlights, glowing stellar mist particles, warm paper-yellow candlelight, and rich deep navy shades.
*   **Image Generation Prompt:**
    > isometric 2.5D game sprite, Pixar style ancient library fantasy academy, 3D render, dark obsidian walls, glowing midnight-blue dome roof decorated with gold constellations, a spinning brass armillary telescope on the roof, magical glowing turquoise mist leaking from arched windows, warm soft lighting, whimsical scholar vibes, isolated on black background --ar 4:3

---

### 4. Imperial Embassy (`embassy`)
*   **Grid Layout Spec:**
    - **ID:** `embassy`
    - **Ground Coordinates:** $X: 730,\; Y: 150$ (Upper Right Sector)
    - **Physical Bounds:** Width $130\text{px}$, Height $110\text{px}$
    - **Depth Layer / zIndex:** `z-20` (Upper middle tier)
*   **Mechanical Functionality:** Consulate center handling cooperative allied speed coordinates assistance and reinforcement army cohorts.
*   **Aesthetic & Visual Concept:**
    A noble, classical diplomatic consulate styled with elegant off-white stone pillars, wrapped in plush royal blue velvet banners featuring silver-threaded alliance insignia. On the flat cedar roof rests a picturesque messenger roost with tiny wooden nesting boxes for carrier pegasi and glowing blue avian statues.
*   **Lighting & Color Palette:**
    Pristine silver and royal blue fabric, soft warm ivory stone, glowing white gas-lanters, and cool morning silver-blue shadows.
*   **Image Generation Prompt:**
    > isometric 2.5D game sprite, Pixar style regal fantasy embassy consulate building, white marble stone columns, long flowing royal blue velvet banners with silver embroidery, small pegasus roost nesting boxes on flat wooden roof, cozy glowing white gas lanterns, detailed painterly textures, isolated on black background --ar 4:3

---

### 5. Hall of Heroes (`hall_of_heroes`)
*   **Grid Layout Spec:**
    - **ID:** `hall_of_heroes`
    - **Ground Coordinates:** $X: 870,\; Y: 190$ (Far Upper-Right Wing)
    - **Physical Bounds:** Width $130\text{px}$, Height $110\text{px}$
    - **Depth Layer / zIndex:** `z-20` (Sovereign border flank)
*   **Mechanical Functionality:** Pantheon altar for recruiting legendary combat commanders, unlocking skill profiles, and tracking hero ascension titles.
*   **Aesthetic & Visual Concept:**
    An epic, columned pantheon carved into a monolithic slate crag. A grand grey marble staircase ascends to an open hall. Flanking the steps are two stylized, oversized copper statues of heroic warriors holding lances aloft. An eternal, glorious golden-amber fire burns bright within a massive bronze brazier perched at the temple's roof peak.
*   **Lighting & Color Palette:**
    Radiant golden light refracting outward. Warm bronze reflective surfaces, high contrast slate-grey rock textures, and soft atmospheric sparks.
*   **Image Generation Prompt:**
    > isometric 2.5D game sprite, Pixar style epic pantheon Hall of Heroes temple, 3D render, carved into a dark slate cliffside, grand marble stairs, large copper statues holding glowing spears, central massive bronze crown brazier with burning golden fire, epic heroic light beams, isolated on black background --ar 4:3

---

### 6. Trading Post (`trading_post`)
*   **Grid Layout Spec:**
    - **ID:** `trading_post`
    - **Ground Coordinates:** $X: 120,\; Y: 190$ (Far Upper-Left Wing)
    - **Physical Bounds:** Width $130\text{px}$, Height $110\text{px}$
    - **Depth Layer / zIndex:** `z-20` (Commercial border flank)
*   **Mechanical Functionality:** Barter marketplace to trade raw regional materials, swap resources, and reduce tax fee multipliers.
*   **Aesthetic & Visual Concept:**
    A bustling, charming merchant bazaar composed of interlinked, colorful canvas tents (gilded orange, emerald, and cream). Robust timber stalls overflow with shiny trade wares: bulging sackcloth bags of grain, glowing pink potion vials, exotic blue spice jars, and a giant brass weighing scale swinging near the porch. Small clockwork wooden toy wagons are parked outside on the brick cobblestones.
*   **Lighting & Color Palette:**
    Vibrant and cheerful color palette. Bright awning stripes, gleaming yellow brass, pink container liquids, and cozy campfire glow.
*   **Image Generation Prompt:**
    > isometric 2.5D game sprite, Pixar style fantasy marketplace bazaar, 3D render, colorful striped canvas tents in orange, emerald green, and gold, wooden crates overflowing with glistening magic potion vials, small clockwork toy carts, large brass weighing scales, playful merchant vibes, warm cheerful lighting, isolated on black background --ar 4:3

---

## SECTION II: RAW AGRICULTURAL & GEOLOGICAL FIELDS (4 RESOURCE SITES)

### 7. Wanderers Farm (`farm`)
*   **Grid Layout Spec:**
    - **ID:** `farm`
    - **Ground Coordinates:** $X: 100,\; Y: 550$ (Far Lower-Left Zone)
    - **Physical Bounds:** Width $130\text{px}$, Height $110\text{px}$
    - **Depth Layer / zIndex:** `z-10` (Low terrain layer)
*   **Mechanical Functionality:** Agricultural zone yielding steady Food resources to support scout units and supply military garrisons.
*   **Aesthetic & Visual Concept:**
    A picturesque timber-frame windmill with spinning, sails made of stretched green-and-white canvas patches. The wooden base is built from warm honey-oak planks. Beside the path are geometric planting furrows filled with cartoonish, oversized orange wheat stalks that glow with soft light. A curved wooden fence with a copper sunflower emblem encloses a resting wheelbarrow.
*   **Lighting & Color Palette:**
    Refreshing morning light. Bright grass-green fields, rich clay-brown soil, glowing saturated orange wheat, and pale mossy timber.
*   **Image Generation Prompt:**
    > isometric 2.5D game sprite, Pixar style charming fantasy windmill farm, 3D render, spinning wooden blades with green stitched canvas, cozy honey-oak plank barn, stylized glowing orange wheat fields, curved rustic wooden fence, bright morning green grass, magical agrarian theme, isolated on black background --ar 4:3

---

### 8. Timber Woodmill (`lumber_mill`)
*   **Grid Layout Spec:**
    - **ID:** `lumber_mill`
    - **Ground Coordinates:** $X: 340,\; Y: 550$ (Lower Left-Center Zone)
    - **Physical Bounds:** Width $130\text{px}$, Height $110\text{px}$
    - **Depth Layer / zIndex:** `z-10` (Low terrain layer)
*   **Mechanical Functionality:** Forestry mill collecting Raw Wood logs to support central building upgrades and craft marksman bows.
*   **Aesthetic & Visual Concept:**
    A cozy, rustic log cabin with an active wooden waterwheel splash-fed by a small clear stream curving along its left. Next to a rugged sorting shack are comically large cedar logs stacked high on wooden sawhorses. Under an pine tree canopy, a giant circular copper buzz-saw is fixed to a stone pedestal, sending stylized yellow woodchip sparks flying.
*   **Lighting & Color Palette:**
    Cool forest shade lit up by yellow timber blade sparks. Warm mahogany bark, fresh pine foliage, glistening water splashes, and pale raw cedar fibers.
*   **Image Generation Prompt:**
    > isometric 2.5D game sprite, Pixar style rustic pine lumber woodmill, 3D render, wooden log cabin with splashy waterwheel, massive timber logs stacked on sawhorse frames, spinning circular copper buzzsaw blade, glowing yellow spark trails, whimsical forest cedar theme, isolated on black background --ar 4:3

---

### 9. Slate Quarry (`quarry`)
*   **Grid Layout Spec:**
    - **ID:** `quarry`
    - **Ground Coordinates:** $X: 650,\; Y: 550$ (Lower Right-Center Zone)
    - **Physical Bounds:** Width $130\text{px}$, Height $110\text{px}$
    - **Depth Layer / zIndex:** `z-20` (Resource border transition layer)
*   **Mechanical Functionality:** Bedrock excavation yard mining heavy Granite Stone blocks for wall fortresses and stone ramparts.
*   **Aesthetic & Visual Concept:**
    A geometric, terraced pit-mine showcasing clean chiseling lines and exposed geologic layers. A sturdy, heavy wooden crane with thick ropes and bronze counterweight levers pivots to hoist a massive, cubical slab of glittering slate grey stone. Wooden scaffolding bridges climb the rock face, and piles of bluish mineral rubble sit next to copper oil lanterns.
*   **Lighting & Color Palette:**
    Cool daylight highlighting crystalline structures. Bluish slate-grey stone, raw pine bridge planks, warm copper torch flame reflections, and dark deep crevices.
*   **Image Generation Prompt:**
    > isometric 2.5D game sprite, Pixar style slate stone quarry mine, 3D render, terraced geometric rock cliffs, chunky wooden crane raising a large blue slate block with thick ropes, timber ladders, small piles of glittering slate rubble, warm copper lanterns, isolated on black background --ar 4:3

---

### 10. Deep-Iron Shaft (`iron_mine`)
*   **Grid Layout Spec:**
    - **ID:** `iron_mine`
    - **Ground Coordinates:** $X: 890,\; Y: 550$ (Far Lower-Right Zone)
    - **Physical Bounds:** Width $130\text{px}$, Height $110\text{px}$
    - **Depth Layer / zIndex:** `z-20` (Flank border layer)
*   **Mechanical Functionality:** subterranean mining tunnels collecting heavy Iron Ore to forge swords, vanguards shields, and military armor plating.
*   **Aesthetic & Visual Concept:**
    A heavy subterranean mine mouth braced by a stout, iron-sheathed timber framework. A wooden rail track exits the cave mouth, supporting a tilting mine cart loaded with glowing, ruby-red iron ore crystals. Lit by glowing magma-crystal lanterns hung from the rafters, a slow drip of cooling geothermal water creates a soft steam trail near the steel gears.
*   **Lighting & Color Palette:**
    High-contrast dark volcanic mood. Hot crimson-red ore glows, weathered black-iron framework, burnt cedar supports, and amber safety lights.
*   **Image Generation Prompt:**
    > isometric 2.5D game sprite, Pixar style underground iron mine shaft, 3D render, dark cave entrance braced with heavy iron-bound timber beams, minecart rail track, wooden mine cart filled with glowing red ruby iron ore crystals, warm lava lantern reflections, volcanic steam smoke wisps, isolated on black background --ar 4:3

---

## SECTION III: SANCTIFIED WARDS & HOSPICES (2 AUXILIARY OUTPOSTS)

### 11. Sacred Hospital (`hospital`)
*   **Grid Layout Spec:**
    - **ID:** `hospital`
    - **Ground Coordinates:** $X: 120,\; Y: 450$ (Middle Left Quadrant)
    - **Physical Bounds:** Width $130\text{px}$, Height $110\text{px}$
    - **Depth Layer / zIndex:** `z-20` (Mid altitude tier)
*   **Mechanical Functionality:** Medical triage camp. Heals and restores injured army soldiers, preventing outright casualties during massive siege attacks.
*   **Aesthetic & Visual Concept:**
    A cozy, gothic sanatorium built from pristine white stone blocks, sporting a lavender tiled roof and comforting glowing stained-glass rose windows. Polished copper censers swing lazily from a wooden beam above its arched medical entrance door, dispersing therapeutic, lavender-colored smoke swirls into the twilight evening.
*   **Lighting & Color Palette:**
    Comforting and warm. Healing lavender and rose gas window emissions, gold and ivory brick masonry, and soft purple fog.
*   **Image Generation Prompt:**
    > isometric 2.5D game sprite, Pixar style gothic healing sanatorium hospital, 3D render, white stone brickwork, lavender tiled sloped roofs, large glowing stained-glass rose-windows with soft rose-pink light, swinging copper censers dispersing purple mist curls, peaceful spiritual comfort style, isolated on black background --ar 4:3

---

### 12. Grave Sanctuary (`sanctuary`)
*   **Grid Layout Spec:**
    - **ID:** `sanctuary`
    - **Ground Coordinates:** $X: 870,\; Y: 450$ (Middle Right Quadrant)
    - **Physical Bounds:** Width $130\text{px}$, Height $110\text{px}$
    - **Depth Layer / zIndex:** `z-20` (Mid altitude tier)
*   **Mechanical Functionality:** Holy ancestral crypt. Safely stores the stray souls of fallen troops to allow for ritual resurrection and soul shards.
*   **Aesthetic & Visual Concept:**
    A mysterious, floating ancestral mausoleum. Flanking the entrance are floating obsidian monoliths carved with spiraling blue runes. In the center yard rests an open baptismal pool overflowing with glowing azure fluid (the Pool of Souls). Soft weeping willow trees of violet silk foliage bend over the pool, and ethereal sapphire sparks drift like fireflies.
*   **Lighting & Color Palette:**
    Hauntingly beautiful celestial moonlit palette. Bioluminescent azure pool water glow, dark amethyst tree leaves, and cool blue rune mist.
*   **Image Generation Prompt:**
    > isometric 2.5D game sprite, Pixar style mystical ancestral Grave Sanctuary mausoleum, 3D render, floating basalt stone monoliths carved with glowing blue runes, glowing azure pool of water in a tiled stone courtyard, weeping violet-leaf willow trees, soft magical blue fireflies blinking, ethereal wonderland style, isolated on black background --ar 4:3

---

## SECTION IV: MILITARY ENCLAVES & WATCH POSTS (4 GARRISON STATIONS)

### 13. Infantry Barracks (`infantry_barracks`)
*   **Grid Layout Spec:**
    - **ID:** `infantry_barracks`
    - **Ground Coordinates:** $X: 180,\; Y: 310$ (Middle-Left Flank)
    - **Physical Bounds:** Width $135\text{px}$, Height $115\text{px}$
    - **Depth Layer / zIndex:** `z-20` (Training quadrant transition zone)
*   **Mechanical Functionality:** Tactical recruitment hub training foot soldiers, heavy shield-bearers, spearmen, and vanguard legion groups.
*   **Aesthetic & Visual Concept:**
    A solid, low-slung, heavy combat garrison crafted from ash wood and stone blocks, protected by thick boundary spikes. In the front courtyard of fine golden sand are training targets wearing comical, oversized steel bucket helmets, and a heavy wooden weapon rack displaying massive, chunky copper shields and spearheads.
*   **Lighting & Color Palette:**
    Aggressively warm and alert. Crackling orange braziers casting dynamic shadows, dark steel, bright copper shield sheen, and dusty tan soil.
*   **Image Generation Prompt:**
    > isometric 2.5D game sprite, Pixar style medieval Infantry Barracks training camp, 3D render, low-slung dark stone structure, defensive spiked wooden walls, weapons rack showing oversized round copper shields and thick spears, comical training dummies with bucket heads, dirt courtyard, warm cozy torches, isolated on black background --ar 4:3

---

### 14. Marksmen Camp (`marksmen_camp`)
*   **Grid Layout Spec:**
    - **ID:** `marksmen_camp`
    - **Ground Coordinates:** $X: 300,\; Y: 410$ (Center-Left Lower Quadrant)
    - **Physical Bounds:** Width $135\text{px}$, Height $115\text{px}$
    - **Depth Layer / zIndex:** `z-20` (Frontline defender tier)
*   **Mechanical Functionality:** Archery firing ranges training basic bowmen, crosswind arrow volleys, and heavy ballistas.
*   **Aesthetic & Visual Concept:**
    A light-timber firing lodge topped with a rustic thatched grass roof. Several long firing lanes are marked by targets stuffed with yellow wheat straws, featuring comic copper bullseye targets struck with oversized arrows. Polished timber longbow recurves rest in curved leather racks next to bundles of bright green feathered arrows.
*   **Lighting & Color Palette:**
    Warm afternoon sunbeams. Pale yellow thatch grass, rich reddish cedargrain wood, mint green arrows, and bronze rings.
*   **Image Generation Prompt:**
    > isometric 2.5D game sprite, Pixar style Archery Marksmen Camp lodge, 3D render, cozy thatched grass sloped roof, cedar wood posts, target archery straw bales with painted copper bullseyes and cartoon wooden arrows sticking out, timber longbow rack, bright sunny day, isolated on black background --ar 4:3

---

### 15. Cavalry Stable (`cavalry_stable`)
*   **Grid Layout Spec:**
    - **ID:** `cavalry_stable`
    - **Ground Coordinates:** $X: 805,\; Y: 310$ (Middle-Right Flank)
    - **Physical Bounds:** Width $135\text{px}$, Height $115\text{px}$
    - **Depth Layer / zIndex:** `z-20` (Equine training zone)
*   **Mechanical Functionality:** Equestrian paddocks breading battle-ready armored destriers for fast cavalry line maneuvers.
*   **Aesthetic & Visual Concept:**
    A picturesque, multi-winged wooden horse barn painted deep barn red, complete with sliding timber doors overflowing with gold straw. An outdoor training pen is bordered by a robust copper paddock fence, featuring active hurdle jumping obstacles and polished copper feed troughs reflecting the clear sky.
*   **Lighting & Color Palette:**
    Pleasant rustic daylight. Rich barn red paint, golden straw, glossy honey-colored paddock wood, and soft turquoise horse blankets.
*   **Image Generation Prompt:**
    > isometric 2.5D game sprite, Pixar style cozy Cavalry Stables barn, 3D render, stylized deep-red wooden stables, gold straw spilling from barn doors, rounded copper paddock fence surrounding a training circle, jump hurdles, whimsical agriculture theme, isolated on black background --ar 4:3

---

### 16. Sentry Watchtower (`watchtower`)
*   **Grid Layout Spec:**
    - **ID:** `watchtower`
    - **Ground Coordinates:** $X: 685,\; Y: 410$ (Center-Right Lower Quadrant)
    - **Physical Bounds:** Width $135\text{px}$, Height $115\text{px}$
    - **Depth Layer / zIndex:** `z-20` (Frontline defense outpost)
*   **Mechanical Functionality:** Outer defense radar. Detects incoming coordinate threats, enemy scout attempts, and player battle marches.
*   **Aesthetic & Visual Concept:**
    A tall and slender watch spire constructed from interlocking slate stone at the base, merging into robust braced timber shafts. At the high crow's nest summit, a colossal brass surveillance spyglass lazily rotates under a tiled copper hood, illuminated from behind by a turning oil candle fire-lantern that acts as a cozy, rotating lighthouse beam.
*   **Lighting & Color Palette:**
    Vigilant warning lighting. A piercing golden lighthouse beam cutting through dark violet twilight mist. Polished brass highlights and slate gray stone.
*   **Image Generation Prompt:**
    > isometric 2.5D game sprite, Pixar style Sentry Watchtower building, 3D render, tall slender stone and timber lookout spire, brass telescope reflecting twilight, spinning warm yellow flame beacon lamp at the top under a copper slate hood, cute adventurous style, isolated on black background --ar 4:3

---

## SECTION V: GENERAL ISOMETRIC PRODUCTION RULES (FOR TECHNICAL COMPILING)
When exporting assets or generating sprites for the `TavernTab` and `CityTab` components:
1. **Flat Isometric Floor Planes:** Ensure the underside of each building sprite conforms to a flat diamond base projection, allowing seamless blending over our emerald grass terrain floor.
2. **Padding and Framing Boundaries:** Maintain a uniform $10\%$ empty alpha pixel padding border in every extracted `.png` texture card. This preserves the bounds, preventing clip-off slices in Vite scales.
3. **No Embedded Shadows:** Do not bake solid black hardcast floor shadows into the building sprites themselves; instead, let our Godot/React engine render soft overlay layout filters natively, keeping the sprites clean and adaptable to dynamic game times.
