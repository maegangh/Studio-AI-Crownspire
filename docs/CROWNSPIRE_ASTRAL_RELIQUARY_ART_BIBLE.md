# CROWNSPIRE: THE ASTRAL RELIQUARY ART PRODUCTION BIBLE
**Master Visual Standards, Rendering Specifications, and Asset Art Direction**
**Version:** 1.0.0 (Master Release)  
**Target Quality Tier:** Premium AAA Mobile Strategy (*Whiteout Survival*, *Call of Dragons*, *Puzzles & Chaos*)

---

## 🏛️ SECTION 1: MASTER ARTISTIC VISION & CORE THEMES

The **Astral Reliquary** represents the convergence of heavy, physical, ancient stonework and ethereal, high-saturation celestial magic. To achieve the premium, tactile feel of top-tier mobile strategy games, all artwork must balance these two contrasting forces:

```
                  [ THE ASTRAL RELIQUARY VISUAL HARMONY ]

     +-----------------------------+     +-----------------------------+
     |   THE TACTILE ANCIENT BASE  |  +  | THE ETHEREAL CELESTIAL GLOW |
     | - Matte White Calacatta     |     | - Vibrant Neon HDR Bloom    |
     | - Beveled Sol-Gold Trims    |     | - Volumetric Star Dust      |
     | - Heavy Pocket Shadows (AO) |     | - Prismatic Light Shafts    |
     +-----------------------------+     +-----------------------------+
```

### 1.1 Toy-Like Tactile Weight
Every object—especially the matchable **Relic Tiles**—must feel like a physical, high-value toy that players want to touch, rotate, and press. This is achieved through exaggerated edge bevels, physically modeled depth, high-fidelity ambient occlusion, and weighted physics-driven animations.

### 1.2 Cosmic Divinity & Mystery
The space must feel ancient and sacred. This is established using deep, dark-slate backings, glowing runes, orbiting astrolabes, and a vast, swirling stellar sky visible in the negative spaces of the background.

---

## 🎨 SECTION 2: PALETTE, MATERIALS & STRUCTURAL RENDER RULES

### 2.1 The Core Color System
To maintain perfect legibility while preserving a premium atmosphere, the color spectrum is locked to strict hex channels:

```
+--------------------+--------------------+--------------------+--------------------+
|   ASTRAL WHITE     |   ABYSSAL BASALT   |   CELESTIAL BLUE   |   AURIC SOL-GOLD   |
|   `#F9F9FB`        |   `#111216`        |   `#1E2C4A`        |   `#E5A93B`        |
|   Main Stonework   |   Deep Occlusions  |   Atmosphere       |   Ornamental Trim  |
+--------------------+--------------------+--------------------+--------------------+
```

*   **Astral White (`#F9F9FB` to `#D9DBE0`):** Used for structural marble blocks and the face of the tiles. It must softly capture the ambient cool blues of the sky.
*   **Abyssal Basalt (`#111216` to `#181A20`):** Used for deep pocket shadows, void backing, and tile base plates.
*   **Celestial Blue (`#1E2C4A` to `#2D3E6B` with peak stellar highlights at `#7A96D6`):** The dominant atmospheric hue. It colors the nebula dust, glass backings, and cosmic leylines.
*   **Auric Sol-Gold (`#FAD054` to `#C88A21` with specular highlights at `#FFF4D1`):** Applied exclusively to beveled trims, locking brackets, engravings, and victory borders. It must look rich, warm, and highly reflective.

### 2.2 Material Definitions & PBR Spec Sheet

All render shaders and texture bakes must follow these physical parameters:

```
[MATERIAL SURFACE SHEET]

(1) Calacatta Marble          (2) Auric Sol-Gold            (3) Nebula Crystal
    _________________             /\________/\                /^\      /^\
   /  /             /            /  \      /  \              /   \____/   \
  /  /  _/\_       /            | ( )      ( ) |            | < >      < > |
 /__/______\______/              \  /______\  /              \   /¯¯¯¯\   /
 [Soft grey veins, matte]       [\#E5A93B bevels, gloss]      \v/      \v/
 [Roughness: 0.50]              [Roughness: 0.18, Metallic]  [Faceted refraction]
```

1.  **Divine Calacatta Marble (Tile Faces & Columns):**
    *   *Visuals:* Soft, wispy grey-violet veins traveling organically beneath a semi-matte white stone base.
    *   *PBR values:* Roughness: `0.45 - 0.55`. Metallic: `0.0`.
2.  **Auric Sol-Gold (Bevels & Trims):**
    *   *Visuals:* Heavily polished, beveled, and slightly stylized metal trims. It must capture bright, crisp specular light bursts on its outer edges.
    *   *PBR values:* Roughness: `0.15 - 0.22`. Metallic: `1.0`. Specular color: `#FFECA8`.
3.  **Nebula Crystals & Gems (Tile Emblems):**
    *   *Visuals:* Faceted glass structures featuring internal depth. The core of the crystal contains a moving, low-intensity starlight vector shader that drifts organically.
    *   *PBR values:* Roughness: `0.05`. Translucency: `0.85`. Refractive index: `1.45` (simulated).

---

## 🀄 SECTION 3: TILE ANATOMY, STACKING & LOCKED STATES

To make sure players can easily tell playable tiles from locked ones on dense boards, tiles must be structured according to precise geometric layers:

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

### 3.1 Dimensions & Outlines
*   **Proportions:** Strict `4:5` (Width to Height) rectangular card layout.
*   **Gold Bevel Border:** Exact `12%` of the tile width. Features carved geometric notches on the corners.
*   **Outline Style:** The border contains a thin, high-contrast inner dark line (`#111216`) to separate the gold metal from the white marble face, ensuring high visibility under any lighting conditions.

### 3.2 Visual Separation of Stacked Layers
*   **The 3D Side-Wall:** Each tile has a physically extruded bottom side-wall (equivalent to `15%` of the tile's total thickness) rendered in a darker granite grey.
*   **Drop Shadows:** Tiles resting on higher layers cast soft, multi-pass radial drop shadows on the tiles immediately beneath them.
*   **Locked (Overlapped) States:** Tiles that are partially or fully covered by a tile on a higher layer are automatically shaded:
    *   Brightness is reduced by `45%`.
    *   Color saturation of the central emblem is desaturated by `40%`.
    *   Golden borders lose their bright gold color and turn a cold, stony grey-blue (`#4E5A73`).
    *   All reflective specular glints are disabled.

---

## 🎥 SECTION 4: CAMERA, PERSPECTIVE & SPACE

```
       [ 2.5D BOARD CAMERA ]                      [ CLOSE-UP DETAIL / HUB ]
       
            /|\  Camera Pitch: 25°                     | | Camera Pitch: 0° (Flat)
           / | \ Camera Yaw: 0°                        | | Orthographic Panel View
          /  |  \ (Top-Down Ortho-Shift)               | | Focus: Individual Tile/Hero
         +---+---+---+                                 +---+  (Zero Perspective Distortion)
         | T | T | T | Tile Grid                       | T |  Large, centered 3D scale
         +---+---+---+                                 +---+
```

### 4.1 The Puzzle Board Camera (2.5D Orthographic)
*   **Perspective:** Perfect orthographic projection. Perspective distortion is strictly forbidden on the puzzle board to keep tile selections and alignment clean at the edges of the mobile screen.
*   **Angle (The 3D Illusion):** Camera is pitched at exactly `25 degrees` on the X-axis (looking down) and rotated `0 degrees` on the Y-axis. This reveals the beveled golden side-walls and drop-shadows of stacked tiles, creating a rich 3D layout while keeping the selection grid perfectly flat.

### 4.2 The Hub and Details Camera (Flat Frontal)
*   **Angle:** `0 degrees` (completely flat orthographic view). Used for hero displays, reward popups, and select event menus to maximize the impact of detailed 2D/3D character panels.

---

## 🏛️ SECTION 5: ENVIRONMENTAL ARCHITECTURE & STORYTELLING

The **Astral Reliquary** is an ancient, floating temple, and its background environment must tell a story of cosmic power and forgotten history.

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

### 5.1 Architectural Motifs
*   **Floating Columns:** Columns of Calacatta Marble trimmed in beveled gold float in the background, bound together by rotating rings of celestial light.
*   **The Astral Astrolabe:** A massive, multi-ringed mechanical stellar astrolabe floats directly behind the puzzle board. As matches are made, it rotates faster, casting sweeping light reflections across the game board.
*   **Environmental Storytelling:** Soft stardust falls from the sky, drifting past the camera to suggest a space suspended in a pocket dimension beneath the clouds of Crownspire.

---

## ✨ SECTION 6: PARTICLES, SHADERS & EFFECTS (GLOW SPECIFICATION)

High-value feedback is what makes mobile triple-match games feel rewarding. The effects must feel explosive and magical, utilizing real-time rendering layers:

```
                  [ SHATTER VICTORY EFFECT PIPELINE ]
                  
   [ MATCH 3 RELICS ] ---> [ RELICS PULSE GOLD ] ---> [ MASSIVE IMPLOSION ]
                                                             |
                                                             v
   [ GLOWING BEAM ]  <--- [ SHARDS EXPELLED ]  <--- [ ELEMENTAL SPARKS ]
   (Deals Damage)
```

### 6.1 The Glow Standard (HDR Bloom)
*   **Peak Intensity:** Glow shaders must use an HDR emission threshold of `1.2`. Only the glowing runes on the relics, active lasers, and magic sparks are allowed to bloom.
*   **No Foggy Overlays:** Glowing elements must remain razor-sharp. Large, blurry glow halos are forbidden as they look cheap and reduce visual clarity.

### 6.2 The Shatter Sequence
When three matching tiles land on the **Relic Altar**, they trigger a three-stage sequence:
1.  **Stage 1: Implosion (0.15s):** The three tiles pull inward, shrinking and flattening slightly, compressing all magical energy into a single central point.
2.  **Stage 2: Particle Burst (0.35s):**
    *   *Solid Shards:* 8 to 12 physical shards of white marble shoot outward in parabolic arcs, bouncing off the edges of the UI container with simulated gravity.
    *   *Elemental Trails:* 25 to 30 glowing trail particles colored by elemental affinity (e.g., Ruby Crimson for Fire) shoot outward.
3.  **Stage 3: Celestial Beam (0.30s):** A localized vertical beam of light gathers from the shards and travels toward the hero cards (or the boss model) to trigger action events.

---

## 🏃 SECTION 7: ANIMATION STYLE & JUICINESS

Animations must feature custom squash-and-stretch parameters to make interactions feel fluid and satisfying:

```
                      [ INTERACTIVE SQUASH & STRETCH ]
                      
       [ NATURAL TILE ]       [ CLICK / TAP STATE ]       [ SLIDE TO TRAY ]
           +-------+               +-----------+              +-----+
           |       |               |           |             /     /
           |       |  =======>     +-----------+  =======>  /     /
           |       |             (Squash: -15% Y,           +-----+
           +-------+              Stretch: +10% X)     (Shear & Scale Down)
```

### 7.1 Tap and Fly Response
*   **The Tap Bounce:** The instant an active tile is clicked, it squashes on the Y-axis by `15%` and stretches on the X-axis by `10%` for `0.06` seconds.
*   **The Flight Path:** The tile then lifts off, shearing slightly in the direction of travel, and slides to the bottom tray.
*   **The Arrival Ripple:** On hitting the tray slot, the tile impacts neighbor tiles, causing a tiny, physical, springy horizontal nudge that ripples through the rest of the tray.

### 7.2 UI Transitions
*   All menus must open with a springy overshoot (`back ease-out`) scaling from `0.85` to `1.0` in `0.25` seconds.
*   Tapping background tabs must trigger a slow parallax shift of the background starfields and nebulae in the opposite direction.

---

## ❄️ SECTION 8: SEASONAL ART OVERLAYS

To support LiveOps events, the standard asset packs can be swapped for themed variants while maintaining strict gameplay readability:

```
+--------------------+--------------------+--------------------+
|   SOLSTICE SNOW    |   SUMMER EMBER     |   HARVEST JADE     |
|   Standard tiles   |   Tiles framed by  |   Engraved with    |
|   covered in gold- |   magma cracks,    |   autumn leaves,   |
|   beveled frost.   |   fiery runes.     |   warm amber tones.|
+--------------------+--------------------+--------------------+
```

*   **Rule of Consistency:** Even under seasonal themes, the tile size, the `12%` border thickness, the 2.5D orthographic camera, and the dark-slate background backing must remain completely unchanged to ensure muscle memory and gameplay speed are preserved.

---
*End of Art Production Bible.*  
*All visual asset developers must adhere strictly to these parameters when delivering materials, models, and effects for the Astral Reliquary.*
