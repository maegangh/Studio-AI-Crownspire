# CROWNSPIRE: COMPANION PETS CONCEPT ART & PRODUCTION GUIDE
**Official Companion Art GDD for 2.5D Pixar-Style Renderings**
**Technical Artwork Blueprint for Godot Sprite Sheets, Bone Rigging, and Web Canvas Integration**

---

## ART DIRECTION BRIEF: THE "PIXAR-GOTHIC" COMPANION SCHEME
In the **Crownspire** universe, pets (or "Celestial Hatchlings") are not merely decorative critters—they are magical constructs and wild wards tied directly to the player's sovereigns, commanders, and regional resource circles. 

The visual identity of companions merges a heavy fantasy-gothic atmosphere with the soft, round, chunky, and toy-like styling guidelines of high-end 3D animated films (such as Pixar and DreamWorks).

### Core Companion Design Directives
1. **Chunky, Rounded Volumes:** No sharp edges, thin whiskers, or messy realistic fur shaders. Fur is rendered in stylized, hand-painted planes and blocky clumps. Talons, horns, and spines are simplified into thick, tapered beveled shapes.
2. **Exaggerated "Toy-Like" Proportions:** Large head-to-body ratios, oversized expressive eyes (which glow with custom neon elements), stubby limbs, and fat bellies that squash and stretch playfully during action loops.
3. **Thematic Emission Core:** Every companion has an organic, glowing weakpoint or magical focus (such as floating runes, crackling ember-tails, or liquid stardust bellies) that expands visually with each evolution.
4. **Isometric 2.5D Rigging Grounding:** All pets are animated and rendered in a clean $2.5\text{D}$ isometric projection ($26.565^\circ$ elevation angle, facing towards the lower-left or lower-right quadrants) to match the tile grid of our map sectors.

---

## SECTION I: SOVEREIGN BESTIARY (6 REGISTERED SPECIES)

### 1. Rocky Slime (`pet_slime`)
*   **Base Rarity:** Common (🟢)
*   **Aesthetic & Core Concept:** 
    A bouncy, joyful blob made of translucent, mineral-infused green silica gel. As it grows, it develops a hard slate shell and floating rune crown segments, combining cute pudding-like elasticity with solid mountain defense properties.

#### Visual Specification & Color Palette
*   **Materials:** Translucent Quartz-Gel, Matte Slate-Shand, Polished Bronze Rivet Bands, and Glowing Emerald Runes.
*   **Color Swatches:**
    - *Core Slime Green:* `#10B981` (Bright Jade) / `#059669` (Deep Mint)
    - *Slate Shell Grey:* `#475569` (Slate Dark)
    - *Rune Glow:* `#34D399` (Aquamarine Neon)
    - *Specular Highlight:* `#ECFDF5` (Warm Cream White)

#### Evolution Stages
*   **Stage I: Rocky Slime (Hatchling):** A tiny, soft green jelly drop with two stubby slate stone "horns" poking out from its crown. Its body is completely translucent.
*   **Stage II: Ironbound Slime (Awakened):** A medium-sized, thicker slime wearing a protective copper-banded slate harness around its waist. Small copper gears rotate slowly within its translucent green core.
*   **Stage III: Gravewood Shardking (Mythological Master):** An immense, crowned slime king supporting a floating stone ring of slate columns above its head. Deep-indigo runic glyphs glow within its core, and its base leaves trail green moss-resin across path grids.

#### Animation Concepts
*   **Idle:** Performs a soft, rhythmic breathing squish-and-stretch loop. At the apex, a small bubble of green light expands inside its body and pops silently into a spray of tiny clover sparks.
*   **Walking:** Bounces forward in high, dramatic parabolic leaps. On landing, its gel squashes flat against the ground plane before snapping back into a tall, rigid form.
*   **Combat:** Braces its posture and slams its head down, sending a wave of jagged slate-spikes protruding forwards from the dirt in a $3$-grid radius before quickly retracting them.

#### UI Portrait Guidance
*   **Framing:** Front-facing, centered macro shot. Camera pitched slightly down to emphasize the oversized glowing green eyes and glossy highlights on the top curves.
*   **Backplate Background:** A soft, high-contrast dark forest-black background with a soft chartreuse-teal radial gradient glow radiating from behind the asset.

---

### 2. Ember Hatchling (`pet_drake`)
*   **Base Rarity:** Rare (🔥)
*   **Aesthetic & Core Concept:** 
    A chubby, small draconic whelp with too-small wings and a stove-heater oven belly. It constantly sneezes tiny sparks and represents molten ironwork smelting and vanguard battlefield strength.

#### Visual Specification & Color Palette
*   **Materials:** Velvety Ash-Grey Dragon Scales, Scorched Mahogany Leathers, Liquid Molten Lava, and Burnished Copper Sconces.
*   **Color Swatches:**
    - *Molten Lava Belly:* `#EF4444` (Furnace Red) / `#F97316` (Hot Tangerine)
    - *Scale Charcoal Black:* `#1E1B4B` (Midnight Obsidian)
    - *Spit Flame Yellow:* `#FBBF24` (Sunburst Amber)
    - *Warm Ash Smoke:* `#64748B` (Cool Vapor Slate)

#### Evolution Stages
*   **Stage I: Ember Hatchling:** A fat, reddish-black lizard with tiny, stubby bat wings that flutter fruitlessly. Its jaw has a prominent underbite, and its tail ends in a single glowing charcoal ember.
*   **Stage II: Molten Drake:** A quadrupedal juvenile drake with solid copper scales running along its chest. Liquid orange magma veins run under its wings, and it vents subtle white steam circles from its nostrils.
*   **Stage III: Hellfire Dragonlord:** A massive, bipod dragon warrior with an armor shell of black volcanic basalt plates. It holds a constantly smoldering charcoal rod, and a towering crown of pure fire floats behind its horns.

#### Animation Concepts
*   **Idle:** Sits on its haunches, heavy eyelids blinking lazily. Every few seconds, it hiccups, causing its belly to flare bright lemon-yellow before a small puff of dark smoke escapes its nose.
*   **Walking:** Runs with a comical, waddling toddler waddle, throwing its wide paws forward, while its heavy tail drags behind, leaving behind brief spark-particle trails.
*   **Combat:** Swings its chest backward to draw breath, its belly turning glowing hot, then sweeps forward to spit a stream of bouncy magma fireballs that bounce twice before dissipating.

#### UI Portrait Guidance
*   **Framing:** Sleek right-profile three-quarters shot highlighting the glowing belly cavity and the warm orange rim light outlining its horns.
*   **Backplate Background:** Cosmic dark brick background with a rich crimson and amber-black sunset haze focus.

---

### 3. Windshear Chick (`pet_gryphon`)
*   **Base Rarity:** Epic (🦅)
*   **Aesthetic & Core Concept:** 
    A fluffy, oversized bird-mammal hybrid of high mountain ridges. It possesses massive owl-eyes and thick, snow-dusted, wind-blown feathers, specializing in rapid marksman coordination and cavalry charge speeds.

#### Visual Specification & Color Palette
*   **Materials:** Silky Arctic White Down, Sage Green Feather Quilts, Golden-gilded Beaks, and Ethereal Cyan wind streaks.
*   **Color Swatches:**
    - *Feather Sage Green:* `#115E59` (Teal Forest) / `#0D9488` (Glacial Mint)
    - *Snow Down White:* `#F8FAFC` (Pure Ice-Cloud)
    - *Beak Gold:* `#EAB308` (Sovereign Brass)
    - *Wind Stream Cyan:* `#22D3EE` (Neon Electric Turquoise)

#### Evolution Stages
*   **Stage I: Windshear Chick:** A round fluff-ball with a beak far too big for its body, wearing a single tiny green leather aviator skullcap. It has giant dark eyes with cyan lightning shapes inside.
*   **Stage II: Zephyr Gryphon:** A sleek, four-limbed griffin with powerful hind claws. Its wings are fully developed with sharp, blade-like mint green feathers, and its tail is a beautiful, wind-borne long silk pendant.
*   **Stage III: Galestrike Skynaut:** An majestic storm-eagle king carrying twin copper-plated aerodynamic wind canisters on its shoulders. Levitating cyan wind currents circle its wings, lifting it slightly above the ground tile.

#### Animation Concepts
*   **Idle:** Perches alerts, its head cocking dynamically in rapid, clockwork bird-like movements. It rustles its chest feathers, releasing several glowing cyan leaf-shaped wind particles in a gentle upward drift.
*   **Walking:** Gallops with extremely light, gliding strides, flap-gliding over small gaps in the terrain with soft, responsive micro-boost wind trails under its paws.
*   **Combat:** Flaps its wings violently, throwing two crescent-shaped wind blades that rotate forwards to pierce through target grids, backed by sharp, whistling wind sound cues.

#### UI Portrait Guidance
*   **Framing:** High-profile angle shot centered on the massive gilded beak and the detailed feather strokes on the cheek.
*   **Backplate Background:** A swirling, sky-blue atmospheric backdrop with pale silver clouds and neon turquoise light rays poking through.

---

### 4. Radiant Emberlet (`pet_phoenix`)
*   **Base Rarity:** Legendary (🐦)
*   **Aesthetic & Core Concept:** 
    An immortal solar phoenix displaying blocky gold-plated feathers and comfortable warm sun rays, specialized in construction speed multipliers and continuous battlefield troop healing.

#### Visual Specification & Color Palette
*   **Materials:** Burnished Rose Gold Plates, Solar Fire Shaders, White Luminescent Silks, and Comforting Amber Halos.
*   **Color Swatches:**
    - *Golden Sol-Fire:* `#F59E0B` (Amber Peak) / `#D97706` (Ochre Gold)
    - *Rose Gold Feather:* `#E11D48` (Sunlight Ruby)
    - *Holy Crest White:* `#FFFFFF` (Ethereal Alabaster)
    - *Solar Aura:* `#FEF08A` (Bright Sunset Yellow)

#### Evolution Stages
*   **Stage I: Radiant Emberlet:** A charming, plump chick that resembles a cozy fire owl. It wears a miniature, floating brass sun crest behind its head, and its feet are tiny copper claws.
*   **Stage II: Radiator Phoenix:** An elegant peafowl-like bird with elegant, flowing tail lace made of golden-red sun rays. Its chest is plated in beautiful white porcelain stone shields.
*   **Stage III: Astraea Sunbringer:** A majestic, high-crested sun sovereign bird. It has four massive phoenix wings that trail bright golden sunset beams, carrying a glowing solar orb above its crown that pulsates with eternal day.

#### Animation Concepts
*   **Idle:** Floats gently in place, wings beating slowly. It tucks its beak to groom its shoulder plates, causing warm yellow solar sparks to rain down and vanish on the grass.
*   **Walking:** Glides smoothly across the ground, leaving a trail of glowing, golden feather steps that burn brightly for half a second before dissolving into stardust.
*   **Combat:** Ascends slightly, spreading its four wings to issue a dazzling pulse of golden-white holy morning light, curing nearby allies and blinding adjacent enemies.

#### UI Portrait Guidance
*   **Framing:** Front three-quarter view with the camera angled up, capturing the majestic neck curves and the warm, backlighting corona cast by its solar crown.
*   **Backplate Background:** Deep royal-indigo twilight background to make the glowing golden and rose phoenix silhouette pop with divine contrast.

---

### 5. Dire Puppy (`pet_wolf`)
*   **Base Rarity:** Rare (🐺)
*   **Aesthetic & Core Concept:** 
    A fluffy, broad-pawed wilderness whelp whose fierce, comical howls rally tactical marksmen armies and increase Wood gathering capacities.

#### Visual Specification & Color Palette
*   **Materials:** Thick Charcoal-grey Wool, Forest-lichen Moss, Broken Steel Chains, and Ice-blue Runic Eyes.
*   **Color Swatches:**
    - *Charcoal Coat:* `#334155` (Slate Wolf Blue) / `#1E293B` (Wolf Black)
    - *Rune Glow Winter:* `#3B82F6` (Neon Frost-blue)
    - *Lichen Accent:* `#84CC16` (Forest Lime Green)
    - *Insignia Silver:* `#CBD5E1` (Muted Steel Silver)

#### Evolution Stages
*   **Stage I: Dire Puppy:** A clumsy, fluffy charcoal puppy with massive paws and a collar that is far too big for its neck. Its chest is decorated with a small glowing blue runic symbol.
*   **Stage II: Shadowfang Hunter:** A sleek, agile hunting wolf with sharp, hand-painted slate-blue claws. A heavy iron collar binds its neck with snap-broken chains dangling beneath, and its runic eyes leave trails as it runs.
*   **Stage III: Sovereign Fenrir:** An immense, star-coated winter wolf. Glowing sky-blue celestial glaciers erupt from its shoulders, and its tail is a magnificent swirling galaxy of indigo and turquoise stardust.

#### Animation Concepts
*   **Idle:** Sits on its rear and sits under a playful dog stretch, then throws its head back to let out a tiny, high-pitched howl that releases a blue runic shockwave ripple.
*   **Walking:** Trots forward with high-energy bounding leaps, paws kicking up stylized dirt puffs and blue frost sparks on each stride cycle.
*   **Combat:** Lonches forward in a blinding lunge, executing dual bite attacks that leave behind neon-cyan slash marks in the air.

#### UI Portrait Guidance
*   **Framing:** Side profile shot focusing on the expressive glowing blue eyes, the thick fluffy chin coat, and the silver rivet marks on its collar.
*   **Backplate Background:** A dark, moonlit winter pine forest background with a cold blue aurora borealis trail crossing the frame.

---

### 6. Rift Larva (`pet_void`)
*   **Base Rarity:** Legendary (🟣)
*   **Aesthetic & Core Concept:** 
    An adorable but unsettling void void-creature retrieved from space fractures. It eats stardust, breathes amethyst shadow mist, and expands campaign sweep drop-multipliers.

#### Visual Specification & Color Palette
*   **Materials:** Glossy Midnight Purple Obside, Cosmic Void Dust, Floating Magenta Magic shards, and Hot Pink Sensor Eyes.
*   **Color Swatches:**
    - *Void Body Obsidian:* `#1E1B4B` (Night Violet)
    - *Eldritch Magenta:* `#D946EF` (Neon Amethyst Pink)
    - *Gravity Pearl Cyan:* `#06B6D4` (Supernova Teal)
    - *Shadow Fog Grey:* `#0B0F19` (Void Pitch Black)

#### Evolution Stages
*   **Stage I: Rift Larva:** A soft, round slug-insect made of dark amethyst gel. It has six tiny, stubby legs and a single big, beautiful, blinking neon-magenta eye in the center of its face.
*   **Stage II: Cosmic Stalker:** A cat-like void creature with floating shoulder claws made of solid dark purple obside crystals. It moves on four legs and leaves void-mist footprints behind.
*   **Stage III: Abyssal Void-Eater:** A magnificent multi-winged space beast. It possesses a stellar vortex in its ribcage, with floating basalt armor plates and trailing magenta lightning strings orbiting its head.

#### Animation Concepts
*   **Idle:** Float-levitates slightly above its anchor point. Its single eye blinks curiously as small, sparkling purple space bubbles escape its core and float upward like tiny balloons.
*   **Walking:** Skims the ground using supernatural levitation, drifting smoothly like a hockey puck, leaving behind a trails of violet nebular dust and floating star shapes.
*   **Combat:** Its central eye flashes fiercely as it summons a miniature, spinning void black hole in front of its target grid, pulling in debris and dealing high gravitational burst damage.

#### UI Portrait Guidance
*   **Framing:** Direct front-on portrait showcasing the colossal center magenta eye with fine, spiral-galaxy refractive lines inside the iris.
*   **Backplate Background:** A deep space void theme decorated with distant floating purple asteroid chunks and glowing pink nebula rifts.

---

## SECTION II: ANIMATION SPECIFICATIONS & RIGGING METRICS
To support smooth performance in both our Godot isometric tilemaps and the React web dashboard:

1.  **Skeletal Bone Rigging (Spine/Godot):** 
    Companions must use a standard 2D deformation bone hierarchy. Squash-and-stretch controls must be applied to the primary root hub (the "belly factor") to allow the weight of the pets to feel tactile and bouncy, capturing the signature Pixar weight distribution.
2.  **Sprite Sheet Compilation Sheets:**
    - **Idle State:** $24\text{ frames}$ looping at $30\text{ fps}$ (8-directional if on map grid).
    - **Walking State:** $16\text{ frames}$ looping at $30\text{ fps}$ (8-directional).
    - **Combat State:** $32\text{ frames}$ playing once, featuring distinct windup, release, and wind-down recovery frames.
3.  **Visual Particle Integration:**
    Do not bake heavy glowing auras, lightning sparks, or dust puffs directly into the frame sprites. Instead, use Godot/React particle layers pinned to the companion's bone points (e.g., `emitter_tail`, `emitter_eyes`, `emitter_base`). This keeps the sprite sheet sizes light and allows the magic particles to scale dynamically with graphic quality options.

All assets correspond directly to properties declared in `src/utils/petDatabase.ts`. Let's test the applet compilation!
