# CROWNSPIRE: COMPANION PET ART PRODUCTION BIBLE
**Official Art Direction, Animation Sheets, and Character Rigging Specifications**
**Version 1.0.0 (Character Art / Hook-Anim Core) | Confidential - Crownspire Studio Operations**

---

## 🎨 SECTION I: COMPANION ART STYLE GUIDELINES

Every creature companion in **Crownspire** is engineered to deliver a cohesive emotional impact: **Cute but Heroic**. We blend the chunky, toy-like volumes of 2.5D Pixar animation with soft, atmospheric fantasy realism. 

```
                          [ IDEAL CREATURE PROPORTIONS ]
                          
                 +---------------------------------------+
                 |               (  o   o  )             | <-- Over-sized Head & Eyes
                 |                  \___/                |     (60% Total Volume)
                 +-------------------+-------------------+
                                     |
                                     |
                       +-------------+-------------+
                       |             #             | <-- Compact, Squat Body
                       |            / \            |     (30% Volume)
                       +-------------+-------------+
                                    / \
                                   (   )             <-- Tiny Feet / Stumpy Outlines
                                                     (10% Volume)
```

### 1. Proportions & Silhouette (The Pixar Silhouette Rule)
-   **Weighted Head-to-Body Ratio:** All baby/tier 1 companions must maintain a $3:2$ or $2:1$ head-to-body ratio. Heads are oversized, with a high, rounded forehead and a stumpy snout.
-   **The "Squishy Volume" Principle:** Joints must never look skeletal or robotic. Feet are represented as thick, stumpy pods or spade paws that deform dynamically upon ground contact. No hard angles on knees or elbows unless wrapped in heavy iron plating.
-   **Oversized Eyes (The Expressive Lens):** Eyes must occupy at least $35\%$ of the face plane. Iris circles should be stylized, oversized, and glass-like, containing high-contrast dual-dot specular stars to reflect the surrounding environment.

### 2. Materials, Texturing, & Styling
-   **Tangible Surfaces:** Avoid flat, paint-bucket fills. Textures must read as hand-sculpted clay with soft, velvet-like felt, smooth leather, or heavy blocky scales.
-   **Lighting Specs:** All textures contain pre-baked, hand-painted ambient occlusion in creases (ears, underbelly, tail-base). Highlights must remain dynamic, soft, and glossy to capture the direction of the rotating world-map sun.
-   **Avoid AI Visual Noise:** Do not utilize procedural noise maps or high-frequency hair/fur textures. Fur must be modeled as discrete, chunky tufts (Pixar clay-tuft style) rather than thin individual fibers.

---

## 💎 SECTION II: RARITY VISUAL CHEATSHEET

To ensure high readability on crowded world maps and busy UI panels, companions employ clear visual tier markers:

```
+---------------------------------------------------------------------------------+
|                               RARITY VISUAL TRAITS                              |
+---------------------------------------------------------------------------------+
| 🟢 COMMON (Green)    - Clay/felt textures. Matte fur, no emission masks.         |
|                                                                                 |
| 🔵 UNCOMMON (Blue)  - Subtle glossy surfaces, small gold bells/leather collars.   |
|                                                                                 |
| 🟣 RARE (Purple)     - High specular rims, metallic armor plates (brass/steel).  |
|                                                                                 |
| 🟡 EPIC (Yellow)     - Trailing motion particles, glowing eyes/horns.            |
|                                                                                 |
| 🟠 LEGENDARY (Gold)  - Levitating jewelry, continuous ambient energy elements.   |
+---------------------------------------------------------------------------------+
```

1.  **Common (Green Frame):** Simple organic materials (clay, wood, felt). No self-illumination or particle attachments. Basic clothing (e.g., small single-stitch canvas bandana).
2.  **Uncommon (Blue Frame):** Slightly glossy scales, simple metal attachments (brass chest buckles or small collars), and expressive animated blinking scripts.
3.  **Rare (Purple Frame):** Outfitted with small, chunky iron or stone armor pieces. Subtle emission masks highlighting glowing energy veins or markings on their joints.
4.  **Epic (Yellow Frame):** Features passive particle emitters (e.g., wind swirls around feet, small fire sparks). Stylized props are standard (e.g., aviator caps, copper goggles, tiny metal satchels).
5.  **Legendary (Orange/Gold Frame):** Floating armor parts suspended by glowing magic, swirling orbital particles, shifting color-lerp shaders (e.g., magma veins, cosmic space dust inside tails), and unique ambient sound layers.

---

## 🐉 SECTION III: THE SIX COMPANION CLASS BLUEPRINTS

---

### 1. Slime-Pods (The Gelatinous Goops)

*   **Visual Description:** A translucent, plump dome of jelly that acts like a water balloon. Unusually wiggly, with two shiny button eyes floating inside its face. It leaves a glossy, wet trail of colorful dew as it hops across the terrain.
*   **Color Palette:** `#58D68D` (Mint Green), `#F4D03F` (Amber Yellow), `#1F618D` (Cobalt Core), `#E74C3C` (Ember Slime).
*   **Evolution Stages:**
    *   *Stage I (Hatchling):* A simple, round sphere of gel with small stubby antennae.
    *   *Stage II (Adolescent):* Double the size. It wears a small, riveted stone collar and carries small moss leaves growing on its back.
    *   *Stage III (Titan Prime):* Fitted with thick basalt armor bands that float on its sides. Emits colorful internal sparks in its gel-core.
*   **Idle Animations:** 
    *   *Sway-Lurk:* The slime slowly squashes flat, sloshes its inner liquid core, and pops upwards with a tiny squeak.
    *   *Bubble-Pop:* Blaps a single, glowing bubble from its crown that pops into a tiny mist of sparkles.
*   **Walking Animations:**
    *   *Stretch-Leap:* It stretches forward horizontally into an oblong egg-shape, leaps high off the ground, and squashes flat on impact.
*   **Combat Animations:**
    *   *Jelly-Slam:* Jumps extremely high, expands its body by $150\%$ at the peak of the jump, and slams down to create a colorful ripples wave.
*   **Portrait Icon Guidelines:** 
    *   *Angle:* $15^\circ$ three-quarter profile facing right.
    *   *Expression:* Wide, joyful smile with cheeks bulging. 
    *   *Lighting:* Rim light should hit from behind to reveal the inner glowing water cores of the slime.

---

### 2. Windshears (The Sky-Chicks)

*   **Visual Description:** A chubby, round baby gryphon draped in soft, felt-like cloud feathers. It wears a little leather pilot hat with brass goggles pushed up on its forehead. It has stubby wings that are far too small for prolonged flight.
*   **Color Palette:** `#F5F6F5` (Albino Cloud), `#E59866` (Sandy Gryphon Pine), `#85929E` (Steel Wings), `#B4C6E7` (Aviator Goggle Blue).
*   **Evolution Stages:**
    *   *Stage I (Hatchling):* A fluffy ball of downy feathers with an oversized yellow beak and a stumpy tail-tip.
    *   *Stage II (Adolescent):* Sleeker chest feathers, a longer tail, and functional leather aviator harnesses with copper side satchels.
    *   *Stage III (Sky Warden):* Majestic, sweeping wings lined with metallic tip feathers. Fitted with polished brass beak caps.
*   **Idle Animations:**
    *   *Hat-Adjust:* Sits down, uses its hind claw to pull the leather aviator cap lower over its eyes, and lets out a tiny chirping squeak.
    *   *Fluff-Shake:* Shakes its entire body violently, causing loose fluffy downy feathers to flutter out in a small cloud.
*   **Walking Animations:**
    *   *Pudge-Waddle:* Taxis forward with a heavy, left-to-right stumpy waddle, flapping its tiny wings in a frantic attempt to lift off.
*   **Combat Animations:**
    *   *Screech-Dive:* Glides up, dives forward headfirst, and lets out a high-pitched sonic wave that manifests as a spiraling white wind cone.
*   **Portrait Icon Guidelines:**
    *   *Angle:* Right-side profile highlighting the large curved beak and leather ear-flaps.
    *   *Expression:* Alert, cocky, with one eye narrowed slightly.
    *   *Lighting:* High-intensity front-key light to bring out dry feather textures.

---

### 3. Ember-Scales (The Molten Drakes)

*   **Visual Description:** A chubby, big-headed red dragon chick with tiny, stumpy horns made of obsidian glass. Its underbelly comprises glowing, furnace-hot soft plates that glow brighter when it breathes.
*   **Color Palette:** `#C0392B` (Crimson Scale), `#E67E22` (Magma Orange), `#2C3E50` (Basalt Horns), `#FFDD57` (Golden Spark Glow).
*   **Evolution Stages:**
    *   *Stage I (Hatchling):* A wingless red whelp with a rounded tail and a stubby snout that occasionally sneezes soot particles.
    *   *Stage II (Adolescent):* Spouts small, webbed wings lined with glowing yellow veins and a single jagged row of obsidian spikes on its spine.
    *   *Stage III (Dragonlord):* Large leathery wings, smoking basalt shoulder plates, and a tail tip carrying a heavy molten-stone mace.
*   **Idle Animations:**
    *   *Tail-Chase:* Plops down on its belly and spins in a circle trying to chew its own smoking tail tip, falling flat on its face.
    *   *Hiccup-Flame:* Lets out a silent hiccup, causing a single, heart-shaped flame bubble to float out of its mouth and pop.
*   **Walking Animations:**
    *   *Scramble-Trot:* A hasty, low-to-the-ground crawl, with small, glowing orange footprints left in its wake.
*   **Combat Animations:**
    *   *Furnace-Blast:* Inhales deeply (causing its chest to expand like a balloon), leans back, and rolls forward to blow a cone of fire.
*   **Portrait Icon Guidelines:**
    *   *Angle:* Front-facing camera tilt, three-quarters looking up.
    *   *Expression:* Playful mischief, smoke venting out of nostrils.
    *   *Lighting:* Under-light key from below to emphasize the glowing flame qualities of its underbelly plates.

---

### 4. Sun-Bringers (The Cosmic Phoenixes)

*   **Visual Description:** A majestic, round golden-amber fire-owl chick with a floating solar sun-halo orbiting behind its head. It stands on stumpy copper talons and is draped in flowing silk tail streamers that trail star dust.
*   **Color Palette:** `#F39C12` (Sun-Gold), `#F5B041` (Amber Glaze), `#E74C3C` (Ruby Tips), `#5DADE2` (Cosmic Blue Halo).
*   **Evolution Stages:**
    *   *Stage I (Hatchling):* A fluffy yellow fire-owl with closed eyes, surrounded by a faint floating ring of gold cosmic rings.
    *   *Stage II (Adolescent):* Sleek, glowing primary feathers, a crown of three floating crystal feathers, and double-ringed solar orbits.
    *   *Stage III (Astraea Solar):* A fully-fledged celestial bird. Star galaxies swirl inside its primary wings, backed by a massive, multi-ringed sun-sphere.
*   **Idle Animations:**
    *   *Halo-Preen:* Uses its beak to clean its trailing gold ribbons, causing the orbiting sun ring to slide horizontally around its neck on a loop.
    *   *Feather-Flare:* Flares its golden wings wide, emitting a warm wave of sparkling solar dust.
*   **Walking Animations:**
    *   *Float-Glide:* hovers $15\text{cm}$ off the grass, bobbing gently up and down, occasionally doing a quick mid-air flip.
*   **Combat Animations:**
    *   *Supernova-Burst:* Hovers high, draws its wings inwards, and explodes outwards in a flash of gold dust and holy sunbeams.
*   **Portrait Icon Guidelines:**
    *   *Angle:* Centered front view, eyes closed with a peaceful, warm expression.
    *   *Expression:* Zen-like tranquility, slight tilt to the left.
    *   *Lighting:* Backlighting from the solar halo to create elegant hair-strand rim illumination.

---

### 5. Shadowfangs (The Frost-Wolves)

*   **Visual Description:** A fluffy, charcoal and light-slate grey wolf pup with oversized ears and cartoonish stumpy paws. It has a tiny broken iron chain collar dangling from its neck, and its tail has small sapphire ice icicles growing on its tip.
*   **Color Palette:** `#34495E` (Slate/Charcoal), `#EAECEE` (Tundra Accent Grey), `#5DADE2` (Icicle Sapphire), `#1C2833` (Chain Wrought Iron).
*   **Evolution Stages:**
    *   *Stage I (Hatchling):* A tiny, tumbling ball of charcoal fur that trips over its own oversized stumpy paws.
    *   *Stage II (Adolescent):* Sleeker joints, deep iron shoulder plates, and a longer tail equipped with clear sapphire spikes.
    *   *Stage III (Dire Monarch):* A monstrous tundra wolf showing glowing blue ice patterns on its skin, fitted with a heavy runic collar.
*   **Idle Animations:**
    *   *Runic-Howl:* Sits down, points its snout straight up, and lets out a high-pitched puppy howl that produces a floating ice runic note.
    *   *Ear-Wiggle:* Turns its left ear then its right ear toward the camera, tilting its head in cute curiosity.
*   **Walking Animations:**
    *   *Wild-Pounce:* A playful boundary-bounce; jumps forward on all fours, throwing its tail wildly.
*   **Combat Animations:**
    *   *Frost-Bite:* Snaps forward into a heavy lunge, manifesting a giant jaws graphic made of ice crystals around the target coordinates.
*   **Portrait Icon Guidelines:**
    *   *Angle:* Three-quarter left face looking directly at the viewer.
    *   *Expression:* Playful snarl, with one tooth showing over its lip.
    *   *Lighting:* Side-key lighting to emphasize fluffy hair clumps and metallic steel collar details.

---

### 6. Rift-Crawlers (The Void Larva)

*   **Visual Description:** An adorable, single-eyed purple void caterpillar with a round, gelatinous body. Its primary eye is a shining glass marble, and it has a row of small, glowing sapphire spikes along its back that bounce when it moves.
*   **Color Palette:** `#8E44AD` (Amethyst Purple), `#9B59B6` (Gloom Lavender), `#2E4053` (Abyssal Grey), `#3498DB` (Runic Blue Light).
*   **Evolution Stages:**
    *   *Stage I (Hatchling):* A tiny purple worm that squiggles, with double pink bow-tie feelers on its forehead.
    *   *Stage II (Adolescent):* Grown side-shoulders, two levitating amethyst shards following on its wings, and a glossy hard shell tail.
    *   *Stage III (Cosmic Stalker):* A sleek, four-limbed panther-like void beast with floating crystals and trailing cosmic dust lines.
*   **Idle Animations:**
    *   *Eye-Roll:* Rolls its giant purple eye around in circles, blinking a sparkling drop of pink moisture from its corner.
    *   *Tail-Wiggle:* Rolls onto its back, wiggling its stumpy caterpillar feed legs in the air on a cute display loop.
*   **Walking Animations:**
    *   *Inchworm-Squiggle:* Gathers its database rear segments, arches its back high, and pops forward horizontally.
*   **Combat Animations:**
    *   *Gravity-Pulse:* Siphons power internally (glowing neon pink), then drops its core down to produce a vertical, circular black-hole shockwave.
*   **Portrait Icon Guidelines:**
    *   *Angle:* Wide angle front shot highlighting its single, massive expressive eye.
    *   *Expression:* Wide-eyed innocent wonder.
    *   *Lighting:* Internally lit; glowing sapphire back lines provide a rim highlight.

---

## ⚙️ SECTION IV: RIGGING, SHADERS, & CODE SPECIFICATIONS

To bring these cute creatures to life inside our React, WebGL, and Godot runtime interfaces:

### 1. The Squash and Stretch Rigging Rule (Keyframes)
-   All rig models must have a **Deformation Scale Modifier** on the root bone. 
-   **Impact Compression:** When a creature lands after jumping, compress its vertical scale ($Y$) to $0.65\times$ while expanding its horizontal scale ($X, Z$) to $1.25\times$ for exactly two frame steps to convey weight.
-   **Launch Stretch:** During takeoff, stretch its vertical scale ($Y$) to $1.35\times$ and narrow its width to $0.80\times$ for three frame steps.

### 2. Time-of-Day Specular Lighting Shader (GLSL)
Companions must transition smoothly under the global clock environment, picking up glowing ambient effects during night hours:

```glsl
// GLSL fragment shader preview for Crownspire WebGL companion engine
shader_type spatial;

uniform sampler2D albedo_map : source_color;
uniform sampler2D rma_map; // Red: Roughness, Green: Metallic, Blue: AO
uniform sampler2D emission_glow : hint_default_black;
uniform float world_time_night : hint_range(0.0, 1.0); // 0.0 Day, 1.0 Night
uniform vec3 night_sky_tint = vec3(0.12, 0.15, 0.35);

void fragment() {
    vec4 base_color = texture(albedo_map, UV);
    vec3 rma_data = texture(rma_map, UV).rgb;
    vec3 emission_color = texture(emission_glow, UV).rgb;
    
    // Mix day albedo with dark evening ambient tones
    vec3 local_albedo = mix(base_color.rgb, base_color.rgb * night_sky_tint, world_time_night * 0.45);
    
    // Boost emission masks during evening hours (e.g., slime cores, fire dragon furnace vents, cosmic star tails)
    vec3 dynamic_emission = emission_color * mix(1.0, 3.5, world_time_night);
    
    ALBEDO = local_albedo;
    METALLIC = rma_data.g;
    ROUGHNESS = rma_data.r * 0.85; // Exaggerate soft Pixar glossy highlights
    EMISSION = dynamic_emission;
}
```

This companion art production handbook ensures consistent, gorgeous visuals across the complete creature roster. Let's build the applet to confirm integration!
