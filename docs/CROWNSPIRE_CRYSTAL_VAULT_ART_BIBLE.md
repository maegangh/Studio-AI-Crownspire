# CROWNSPIRE: CRYSTAL VAULT ART PRODUCTION BIBLE
**Official Art Direction, Visual Asset Specifications, and Rendering Standards**
**Version 1.0.0 (Art Dept / Tech-Art Core) | Confidential - Crownspire Studio Operations**

---

## 🏛️ SECTION I: CONCEPTUAL PILLARS & ARTISTIC VISION

The **Crystal Vault** (historically documented as *The Astral Reliquary*) stands as a core architectural and visual centerpiece of **Crownspire**. It is the bridge between physical 4X strategy and ancient, celestial puzzle magic. Every asset, button, effect, and tile inside this feature must convey a sense of high-value, tactile weight, cosmic divinity, and interactive luxury.

Our visual goal is to compete directly with elite mobile tier titles (*Whiteout Survival*, *Call of Dragons*, *Puzzles & Chaos*). This means balancing **weighty, toy-like physically-rendered materials** with **ethereal, high-fidelity glowing magical effects**.

```
                   [ THE CRYSTAL VAULT ARTISTIC EQUILIBRIUM ]
                   
         [ GROUNDED PHYSICAL WEIGHT ]   <--->   [ ETHEREAL CELESTIAL ENERGY ]
         - Massive, veined white marble          - Radiating HDR neon bloom
         - Heavy, filigreed brass & gold bounds  - Floating, levitating architecture
         - Low, pocket-heavy ambient occlusion   - Volumetric, prism-refracted light shafts
```

---

## 🎨 SECTION II: COLOR PALETTE & TONAL SYSTEMS

The color language of the Crystal Vault is divided into **Pristine Structural Bases**, **Luxurious Ornamental Accents**, and **High-Saturation Elemental Affinities** to maximize both gameplay readability and aesthetic cohesion.

```
+--------------------+--------------------+--------------------+--------------------+
|   ASTRAL WHITE     |   ABYSSAL BASALT   |   CELESTIAL BLUE   |   AURIC SOL-GOLD   |
|   `#F9F9FB`        |   `#111216`        |   `#1E2C4A`        |   `#E5A93B`        |
|   Structure Base   |   Shadow Contrast  |   Atmosphere/Glass |   Gold Trims       |
+--------------------+--------------------+--------------------+--------------------+
```

### 1. The Core Palette
*   **Astral White (`#F9F9FB` to `#E3E5EB`):** Used for structural marble, steps, and background columns. Highly reflective, capturing soft blue-violet environmental light.
*   **Abyssal Basalt (`#111216` to `#1B1E24`):** Used for deep pocket shadows, void backing, background voids, and high-contrast tile crevices. Gives UI containers a heavy, premium feel.
*   **Celestial Blue/Slate (`#1A2238` to `#2D3E6B`):** The primary color of the vault's atmosphere. Evokes night-sky leylines, glass backings, and cosmic stardust.
*   **Auric Sol-Gold (`#FAD054` to `#C88A21` with key peak speculars at `#FFF2CC`):** Used for borders, trims, locking clamps, and metallic filigree. Must look rich, polished, and hand-carved.

### 2. Elemental Glow Affinities (Tile & Particle Systems)
To facilitate immediate visual recognition during Triple-Match chains and Arena/Boss targeting, specific elemental hues are locked to strict color channels:

| Element | Hue | Hex Range | Visual Motif |
| :--- | :--- | :--- | :--- |
| **Fire** | Ruby Crimson | `#FF2A54` to `#B30022` | Flaring embers, sharp solar flares |
| **Frost** | Sapphire Cyan | `#00F2FF` to `#005C8A` | Piercing glaciers, geometric frost needles |
| **Nature** | Emerald Jade | `#16FF7A` to `#0A6E33` | Living ivy vines, pulsing vital leaves |
| **Light** | Solar Topaz | `#FFE600` to `#D48800` | Celestial halos, brilliant prismatic beams |
| **Void** | Nebula Violet | `#DF36FF` to `#59008A` | Swirling event horizons, crackling dark lightning |

---

## 💎 SECTION III: MATERIALS & SURFACE STANDARDS

All models, sprites, and shaders must render with clear material separation. We define four signature materials that dictate the Crystal Vault's aesthetic:

```
[MATERIAL RENDER DETAIL SHEET]

(1) white calacatta marble  (2) celestial gold trim     (3) astral crystals
    _________________           /\________/\            /^\      /^\
   /  /             /          /  \      /  \          /   \____/   \
  /  /  _/\_       /          | ( )      ( ) |        | < >      < > |
 /__/______\______/            \  /______\  /          \   /¯¯¯¯\   /
 [Soft grey veins, matte]     [\#E5A93B bevels, high]   \v/      \v/
 [High-diffuse scattering]    [specular metallic gloss] [Faceted, refracts]
```

### 1. Calacatta Divine Marble (White Base Structure)
*   **Description:** An ancient, semi-matte structural stone used for all architectural elements, vault portals, and the primary tile backings.
*   **Texture Specs:** Subdued, soft-edged grey veins (`#D1D5DB`) crawling organically beneath a high-diffuse white base. No micro-grain sandstone noise.
*   **PBR Values:** Roughness: `0.45` to `0.55` (soft, broad specular highlights). Metallic: `0.0`. Ambient Occlusion: High-intensity, wide radius (soft edge padding) to make stone pieces look physically weighty and thick.

### 2. Celestial Auric Trim (The Gold Filigree)
*   **Description:** Beveled, heavy gold framing that wraps tiles, columns, and UI borders.
*   **Visual Style:** Heavy, hand-carved, slightly stylized bevels. Avoid sharp modern machine-cut lines. It must feel solid and ancient, featuring floral, bird-wing, or celestial compass engravings.
*   **PBR Values:** Roughness: `0.15` to `0.22` (extremely sharp specular highlights). Metallic: `1.0`. Specular tint: Warm golden yellow (`#FFE8A3`).

### 3. Astral crystals & Gems (Tile Insets and Relics)
*   **Description:** The crystalline elements embedded within the relic tiles that shatter when matched.
*   **Visual Style:** Faceted, emerald-cut, or diamond-cut geometry with sharp, crisp edges. The inside of the crystal contains a moving, low-intensity stellar nebula shader that drifts slowly.
*   **Rendering Specs:** Requires custom refraction mapping or simulated local depth. When tapped, the crystal must fire an internal specular burst.

### 4. Obsidian Glass Panels (UI & Altar Tray Backgrounds)
*   **Description:** Deep, translucent black glass with gold veins, used as the background backing for the board and the Relic Altar tray.
*   **Visual Style:** Highly polished black mirror with subtle dark-violet nebulae visible through the depth layers.
*   **PBR Values:** Roughness: `0.08` (mirror-smooth reflections of overhead particles). Metallic: `0.1`.

---

## 📷 SECTION IV: CAMERA, PERSPECTIVE & SPACE

The Crystal Vault uses two distinct camera profiles depending on the sub-screen:

```
       [ 2.5D BOARD CAMERA ]                      [ CLOSE-UP DETAIL / HUB ]
       
            /|\  Camera Pitch: 25°                     | | Camera Pitch: 0° (Flat)
           / | \ Camera Yaw: 0°                        | | Orthographic Panel View
          /  |  \ (Top-Down Ortho-Shift)               | | Focus: Individual Tile/Hero
         +---+---+---+                                 +---+  (Zero Perspective Distortion)
         | T | T | T | Tile Grid                       | T |  Large, centered 3D scale
         +---+---+---+                                 +---+
```

### 1. The Puzzle Board Camera (2.5D Top-Down Ortho-Shift)
*   **Perspective:** Orthographic projection (no perspective vanishing points). This prevents tile distortion at the edges of the mobile screen, allowing perfect alignment.
*   **Angle:** 25-degree tilt on the X-axis (Pitch), 0-degree rotation on the Y-axis (Yaw). This creates a subtle sense of physical height and depth (showing the golden side-walls of stacked tiles) while maintaining a clean, highly readable gameplay matrix.
*   **Camera Zoom & Boundary:** Fixed bounding box centered on the puzzle layout, automatically scaling up or down based on level width (JSON configuration) to fit portrait mobile displays.

### 2. The Hub and Showcase Camera (Flat Orthographic)
*   **Angle:** 0-degree tilt (perfectly flat frontal camera).
*   **Use Cases:** Relic Arena Hero cards, Beast Trial colossal monster models, and active popups. Focuses visual gravity onto the detailed character artwork and stylized menus.

---

## 🀄 SECTION V: TILE ANATOMY, PROPORTIONS & BORDERS

To ensure players can easily identify which tiles are playable versus which are locked, the design of the **Relic Tiles** is strictly standardized:

```
                          [ TILE VISUAL ANATOMY ]
                          
                     |<------- Tile Width (100%) ------->|
                 +---+-----------------------------------+---+  ---
                 |   |        GOLDEN OUTLINE FLUSH       |   |   | Border
                 | +-+-----------------------------------+-+ |   | Thickness
                 | |                                       | |   | (12% Width)
                 | |   +-------------------------------+   | |  ---
                 | |   |                               |   | |
                 | |   |      EMBEDDED RELIC ICON      |   | |
                 | |   |                               |   | |
                 | |   |    (Stylized Vector Art,      |   | |
                 | |   |     Heavy Outer Contour)      |   | |
                 | |   |                               |   | |
                 | |   +-------------------------------+   | |
                 | |                                       | |
                 | +-+-----------------------------------+-+ |
                 |   |      CHUNKY WHITE MARBLE BASE     |   |
                 +---+-----------------------------------+---+
                 \_____________________ _____________________/
                                       v
                             3D Extrusion Side Wall
                           (Soft Grey Granite Shadow)
```

### 1. Dimensions & Proportions
*   **Aspect Ratio:** `4:5` (Width to Height) rectangular card structure. Perfect balance for vertical mobile layouts, maximizing tile grid density without compromising artwork visibility.
*   **Tile Border Thickness:** Exact `12%` of the tile's total width. Built of beveled Celestial Auric Gold to frame the interior emblem and protect it visually from background clutter.
*   **Relic Emblem Scale:** The central icon must fill `65%` of the inner viewport, leaving a clean `17.5%` breathing margin of white marble background on all sides.

### 2. Physical Depth & Extrusion
*   **The 3D Side-Wall:** Each tile features a physically modeled side-wall projecting downwards. This side-wall represents a dark grey granite shadow layer, giving the tile a physical depth of `15%` of the tile height.
*   **Stacking Visuals:** When tiles are stacked on top of each other, the bottom tile's top border receives a cast shadow from the overlapping tile, created via a soft multi-pass drop-shadow sprite offset.

### 3. Playable vs. Locked (Overlapped) States
*   **Playable (Active):** Rendered at 100% brightness, sharp golden borders with a subtle rim reflection, and active particle outlines on hover/tap.
*   **Locked (Overlapped/Shaded):** The tile is darkened using a custom canvas shader:
    *   Brightness reduced by `45%`.
    *   Saturation reduced by `30%`.
    *   Golden borders tinted with a cold, stone-like blue hue.
    *   Refractions disabled.

---

## 💥 SECTION VI: PARTICLES, SHADERS & GLOW SPECIFICATIONS

Visual feedback in the Crystal Vault must be highly explosive and deeply satisfying, rewarding players for completing matches.

```
                  [ SHATTER VICTORY EFFECT PIPELINE ]
                  
   [ MATCH 3 RELICS ] ---> [ RELICS PULSE GOLD ] ---> [ MASSIVE IMPLOSION ]
                                                             |
                                                             v
   [ GLOWING BEAM ]  <--- [ SHARDS EXPELLED ]  <--- [ ELEMENTAL SPARKS ]
   (Deals Damage)
```

### 1. The Glow Standard (HDR Bloom)
*   **Bloom Threshold:** Set to `1.2` in Godot’s environment configuration. Only peak magical emission channels (runes, crystal veins, lightning arcs) bypass the threshold.
*   **Intensity:** Soft, localized glow. Glowing elements must never wash out the silhouette of the relic icon or text indicators. It must look like clean, focused neon lines, not a blurry fog.

### 2. Shatter Sequence Particle Physics
When three relics match on the Relic Altar, they dissolve through a multi-tiered particle burst:
*   **Stage 1: The Implosion (0.0s - 0.15s):** The three tiles instantly pull together, compressing inward. A vacuum wind ring sprite scales down to zero size.
*   **Stage 2: The Shatter Burst (0.15s - 0.4s):**
    *   **3D Rigid Shards:** 12 to 16 physical, solid marble fragments are expelled outwards in random radial arcs, bouncing on the screen edges with simulated physical gravity.
    *   **Elemental Sparks:** 30 to 45 high-velocity glowing trail particles colored after the relic's affinity (e.g., Ruby Crimson for Fire) shoot out like fireworks.
*   **Stage 3: Energy Beam (0.4s - 0.8s):** A thick, glowing elemental energy laser gathers at the altar tray, shoots upward to strike the enemy model (in Arena or Beast Trials), and dissolves into soft floating stardust.

### 3. Custom Shaders Sheet
*   **Refractive Gem Shader:** A lightweight mobile fragment shader that distorts screen coordinates beneath the gem surface, simulating real-world glass light-bending.
*   **Aether Dissolve Shader:** Used to transition matching tiles. A burning noise texture dissolves the tile from the center outwards, glowing white-hot along the disintegration border.
*   **Shading/Overlay Shadow Shader:** Multiplies a soft-radial black gradient over tiles currently nested beneath upper layers.

---

## 🏃 SECTION VII: ANIMATION STYLE & TACTILE FEEL

Animations must feel incredibly responsive, juicy, and physically satisfying (often referred to as the "Toy-Like Elasticity" standard).

```
                      [ INTERACTIVE SQUASH & STRETCH ]
                      
       [ NATURAL TILE ]       [ CLICK / TAP STATE ]       [ SLIDE TO TRAY ]
           +-------+               +-----------+              +-----+
           |       |               |           |             /     /
           |       |  =======>     +-----------+  =======>  /     /
           |       |             (Squash: -15% Y,           +-----+
           +-------+              Stretch: +10% X)     (Shear & Scale Down)
```

### 1. Tap & Fly Elasticity (Tile Collection)
*   **The Click Response:** When a player taps an active tile, the tile instantly squashes on the Y-axis by `15%` and stretches on the X-axis by `10%` for `0.05` seconds, giving immediate tactile confirmation of the tap.
*   **The Flight Path:** The tile then lifts off, shearing slightly in the direction of travel, and slides to the bottom Relic Altar tray.
*   **Tween Curve:** Handled via Godot’s `Tween.TRANS_ELASTIC` or a custom cubic-bezier ease-out curve (`ease_out(0.25, 1.0, 0.5, 1.0)`).
*   **The Arrival:** Upon landing in the Altar Tray, the tile impacts the neighboring tiles, triggering a tiny radial physical nudge that ripples outward across the tray.

### 2. UI Transitions (Bento Card Expansion)
*   Menu transitions do not use boring instant visibility toggles.
*   **The Pop-In:** Window backings scale up from `85%` to `100%` using `Tween.TRANS_BACK` with a slight overshoot (`elastic overshoot = 1.15`), accompanied by a soft blur-in fade.
*   **The Parallax Depth:** Background cosmic layers scroll slowly at `15%` of the foreground menu speed as the player swipes between tabs (Expedition, Arena, Beast Trials).

---

## 🌳 SECTION VIII: ENVIRONMENTAL ARCHITECTURE & MOTIFS

The Vault is not just a board; it is an physical temple of cosmic origin.

```
                    [ CRYSTAL VAULT TEMPLE ARCHITECTURE ]
                    
                      _|\_  [ Central Orbital Sphere ]
                     /    \  - Rotating brass rings
                    |  ()  | - Glowing star runes
                 ___ \____/ ___
                /             \
               /               \  <-- Soaring white marble pillars
              /  +-----------+  \     engraved with golden laurels
             /   |           |   \
            /    |   GRID    |    \
           /     |   ZONE    |     \
          /      +-----------+      \
  =======+===========================+=======  <--- Floating circular steps
```

### 1. Architectural Style
*   **Structure:** Floating, nested concentric rings of white marble and gold leaf. Massive columns rise from the celestial fog in the background, engraved with laurels, constellation paths, and phoenix wings.
*   **The Central Apparatus:** Positioned directly behind the puzzle grid is the *Astral Astrolabe*—a massive, slowly rotating mechanism of brass rings and glowing crystal cores. It reacts to matches: the faster the player matches, the faster the astrolabe spins, casting dynamic light sweeps across the board.
*   **Motifs & Iconography:**
    *   **The Solar Phoenix:** Embodies rebirth and matches (shattering to rise as energy).
    *   **The Celestial Compass:** Represents the path of Expedition and mapping stars.
    *   **Dual Winged Crests:** Framing the UI panels to emphasize military honor and hero prestige.

### 2. Background Rendering Limits
To maintain high frame rates on low-end mobile devices, background elements (the temple columns, stairs, and astrolabe) must be pre-rendered or baked into a single high-quality parallax layer with depth-of-field blur, leaving only the interactive tiles, heroes, and boss models as active drawing passes.

---

## 👑 SECTION IX: VISUAL QUALITY COMPARISON MATRIX

| Feature / Element | Standard Mobile Match-3 | **Crownspire: Crystal Vault Standard (AAA)** |
| :--- | :--- | :--- |
| **Tile Bases** | Plain plastic colored squares. | Chunk veined white marble with gold bevels and 3D granite depth. |
| **Locked Tiles** | Flat grey overlay color block. | Sophisticated blue desaturation, disabled speculars, cast-shadow drop-shadows. |
| **Match Feedback** | Simple sprite pop and text label. | Heavy physical shard explosions, radial screen shake, localized HDR emission trails. |
| **UI Windows** | Flat solid color shapes. | Frosted dark-glass bento panels, gold filigree trim, and parallax star backdrops. |
| **Hero Presence** | Tiny 2D portraits in corner. | Animated hero cards that glow, pulse with mana, and trigger full-screen splash skills. |

---
*End of Visual Specification Document.*
*Use this guide as the absolute authority when creating concept art, 3D models, UI layouts, and particle shaders for the Crystal Vault feature.*
