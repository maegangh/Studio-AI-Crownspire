# CROWNSPIRE: THE ASTRAL RELIQUARY UI/UX SPECIFICATIONS
**Complete Screen-by-Screen Layout, Panel Systems, Button Callouts, and Interface Transitions**
**Version:** 1.0.0 (Master Release)  
**Platform:** Mobile Portrait (Aspect Ratio 9:16 / 19.5:9)  
**Target Quality Tier:** AAA Mobile (*Whiteout Survival*, *Call of Dragons*, *Puzzles & Chaos*)

---

## 🧭 SECTION I: GLOBAL UI ARCHITECTURE & NAVIGATION FLOW

To ensure a seamless player experience, navigation within the Astral Reliquary is designed around a single, highly integrated hub-and-spoke system. All sub-screens animate relative to the **Main Lobby (The Reliquary Hub)** or are triggered directly from the main 4X city grid via the physical **Building Screen**.

### 1.1 The Master Screen Map & Transition Pipeline

```
[City View Grid: Astral Reliquary Building]
                  |  (Tap Building -> Screen Fade & Zoom Zoom)
                  v
       +------------------------------------+
       |   THE BUILDING DETAIL SCREEN       | <--- Manage Attunement Levels
       +-----------------+------------------+
                         |  (Tap "ENTER PORTAL" -> 3D Concentric Ring Spin)
                         v
       +------------------------------------+
       |     MAIN LOBBY (THE RELIQUARY HUB) | <=== Central Navigation Node
       +--------+--------+--------+--------+
        /       |        |        \        \_______________________
       /        |        |         \                               \
      v         v        v          v                               v
[Expedition] [Arena]  [Beast]  [Challenge]                     [Relic Shop]
    |         |       [Trials]  [ (Vault) ]                         |
    v         v          v          v                               v
[Puzzle Board Base]   [Boss]   [Leaderboard]                    [Inventory]
    |       \         [Arena]       |                               |
    |        \           |          v                               v
    v         v          v     [Rewards Info]                   [Settings]
[Victory]  [Defeat]   [Pause]       |
    |         |          |          v
[Claims]   [Retry]    [Resume] [Power-Ups]
```

### 1.2 Global Transition Standards
*   **The "Aether Vortex" (Enter Transition):** When transitioning from the 4X City view into the Reliquary Hub, the screen dims to `#111216`. Floating rings of cyan particles scale up from the center of the screen, creating a centrifugal warp effect. The city view fades out as the Reliquary Hub slides in vertically from the bottom. Duration: `0.45s`.
*   **Horizontal Swiping (Tab Transitions):** Swiping between sub-modes (Expedition, Arena, Beast Trials) triggers a fast horizontal slide. The active panel slides out in the direction of the swipe while the new panel slides in. The background starfield moves at `25%` speed (parallax depth), creating a high-end sense of space. Duration: `0.30s` using `ease_out_cubic`.
*   **Modal Popups (Bento Slide):** Secondary overlays (Pause, Settings, Power-ups) do not appear instantly. They scale up from `85%` to `100%` with a springy overshoot (`back_ease_out`), while the background board blurs via a real-time Gaussian filter. Duration: `0.20s`.

---

## 🏛️ SECTION II: SCREEN-BY-SCREEN SPECIFICATIONS

---

### SCREEN 1: THE PORTAL BUILDING SCREEN (4X CITY VIEW)

```
+-------------------------------------------------------------+
| [X] CLOSE                                     (i) HELP INFO |
|                                                             |
|                    ASTRAL RELIQUARY                         |
|                     - Portal Lv. 12 -                       |
|                                                             |
|                       [ MONUMENT ]                          |
|                 (Levitating marble rings                    |
|                  with glowing blue crystal                  |
|                  pulsing in the center)                     |
|                                                             |
|   +-----------------------------------------------------+   |
|   |  IDLE ATTUNEMENT METRICS                            |   |
|   |  - Generation Rate: 150 Shards/Hr                    |   |
|   |  - Current Vault Capacity: 1,200 / 3,600            |   |
|   |  [ COLLECT SHARDS ] -> Plays fly-up coin effect     |   |
|   +-----------------------------------------------------+   |
|                                                             |
|                   [ ENTER THE PORTAL ]                      |
|                  (Glows with blue aether)                   |
|                                                             |
+-------------------------------------------------------------+
```

#### 1. Visual Layout
*   **Background:** The active player's city grid, heavily blurred and desaturated.
*   **Centerpiece:** A close-up, high-fidelity 3D model of the levitating Reliquary monument. Golden rings rotate slowly on three independent axes around a massive, glowing Sapphire core.
*   **Bottom Section:** A clean, dark glass bento card displaying idle accumulation stats.

#### 2. Component List & Interactive Actions
*   **Close Button `[X]` (Top-Left):** Flat circular button, white icon on a translucent basalt circle. *Action:* Returns instantly to the 4X City Grid view.
*   **Information Button `[(i)]` (Top-Right):** Small golden glyph. *Action:* Displays a scrollable popup explaining the lore and building upgrade bonuses.
*   **Collect Button `[COLLECT SHARDS]` (Center-Bottom Card):** Wide green button with gold trim. Displays the current uncollected shard count. *Action:* Triggers a burst of gold coins that fly toward the player's top bar currency counters.
*   **Primary Action Button `[ENTER THE PORTAL]` (Bottom Anchor):** Massively scaled gold-plated capsule button with a pulsing internal cyan light emission. *Action:* Fires the Aether Vortex transition, loading the **Main Lobby**.

---

### SCREEN 2: THE MAIN LOBBY (THE RELIQUARY HUB)

```
+-------------------------------------------------------------+
| [<-] BACK      [ 120 / 120 STAM ]      [ 15,240 SHARDS ] [+] |
|                                                             |
|                     THE ASTRAL RELIQUARY                    |
|                                                             |
|   +-----------------------------------------------------+   |
|   |             ACTIVE MODE CARD ROTATOR                |   |
|   |                                                     |   |
|   |                  [ BEAST TRIALS ]                   |   |
|   |            (Animated 3D Aether Dragon               |   |
|   |             breathing blue crystal flames)          |   |
|   |                                                     |   |
|   |             - Active Boss: Aether Dragon -          |   |
|   |             - Weakness: Fire Elements -             |   |
|   |             - Tries Left: 3/3 -                     |   |
|   |                                                     |   |
|   |                    [ ENTER TRIAL ]                  |   |
|   +-----------------------------------------------------+   |
|                                                             |
|   [ EXPEDITION ]    [ ARENA ]    [ CHALLENGE ]    [ EVENTS ] |
|   (Interactive bottom tab bar highlighting selected mode)   |
|                                                             |
+-------------------------------------------------------------+
```

#### 1. Visual Layout
*   **Background:** Immersive dark cosmic vault. Slow-moving, deep violet and navy nebulae drift behind floating marble columns. Prismatic light shafts cut diagonally from the top-left.
*   **Top Bar:** Displays the player's current **Sanctum Stamina** (`120/120`) and **Aether Shards** (`15,240`).
*   **Center Stage:** A massive, swipeable bento card system. Each card features rich animated characters or 3D landmarks representing the selected mode.

#### 2. Component List & Interactive Actions
*   **Back Button `[<-]` (Top-Left):** Slides back to the **Building Screen**.
*   **Stamina Panel (Top-Center):** Tapping the stamina icon displays a purchase modal for instant stamina refills.
*   **Shard Add Button `[+]` (Top-Right):** Tapping opens the premium exchange store.
*   **Center Swipeable Mode Cards:**
    *   *Expedition Card:* Displays a path winding through forest steps. Tapping opens the **Expedition Map Screen**.
    *   *Arena Card:* Displays two crossed celestial swords. Tapping opens the **Arena Screen**.
    *   *Beast Trials Card:* Displays a roaring dragon. Tapping opens the **Beast Trials Screen**.
    *   *Extreme Challenge Card:* Displays a frozen obelisk. Tapping opens the **Vault of Trials**.
*   **Mode Action Button (Middle of Active Card):** Custom styled button depending on the card (e.g. `[ENTER TRIAL]`). *Action:* Loads the corresponding gameplay mode.
*   **Bottom Navigation Rail:** 4 equal-width tabs. Selecting a tab triggers a fast slide transition to update the center stage card instantly.

---

### SCREEN 3: PUZZLE EXPEDITION (STAGE SELECT MAP)

```
+-------------------------------------------------------------+
| [<-] BACK                                     [ SHOP ] [INV] |
|                                                             |
|                  REGION II: BASALT CRAGS                    |
|                                                             |
|                     [ ] Stage 15                            |
|                      |                                      |
|                     [ ] Stage 14 (Active)                   |
|                    /                                        |
|                  [X] Stage 13 (Cleared)                     |
|                   |                                         |
|                  [X] Stage 12 (Cleared)                     |
|                                                             |
|   +-----------------------------------------------------+   |
|   |  STAGE 14 PANEL (SLIDES UP ON SELECTION)            |   |
|   |  - Target: Clear 120 Tiles                          |   |
|   |  - Cost: 10 Stamina                                 |   |
|   |  - Rewards: Wood, Iron, Hero Ascend Runes           |   |
|   |  [ SQUAD SETUP ] -> Open Squad Setup Menu           |   |
|   +-----------------------------------------------------+   |
+-------------------------------------------------------------+
```

#### 1. Visual Layout
*   **Background:** An elegant 2D vertical map layout. The pathway crawls upward through rocky basalt canyons with glowing orange magma fractures showing beneath the cracks.
*   **Map Nodes:** Small circular stone markers. Cleared stages are wrapped in gold chains with green checkmarks. The active stage pulses with a bright cyan light wave.

#### 2. Component List & Interactive Actions
*   **Back Button `[<-]` (Top-Left):** Returns to the Main Lobby.
*   **Quick Inventory `[INV]` / Shop `[SHOP]` Buttons (Top-Right):** Shortcuts to manage active boosters or buy stamina before playing.
*   **Map Nodes (Stage 1 - 300):** Tapping any node displays a detailed stage popup from the bottom.
*   **Stage Detail Panel (Bottom Slide-Up):**
    *   Displays level modifiers (e.g. "Frozen Obstacles Active").
    *   Lists predicted resource rewards and relic card drops.
    *   Contains the primary button: `[SQUAD SETUP]`. Tapping this opens the **Squad Selection Screen**.

---

### SCREEN 4: UNIFIED PUZZLE ENGINE (CORE GAME BOARD)

```
+-------------------------------------------------------------+
| [||] PAUSE       [ PROGRESS BAR: 60/120 ]       [ 32 MOVES ] |
|                                                             |
|   +-----------------------------------------------------+   |
|   |                 PUZZLE GRID STAGE                   |   |
|   |                                                     |   |
|   |                   [Tile: Ruby]                      |   |
|   |                   (Layer 2)                         |   |
|   |               [Tile: Saph] [Tile: Saph]             |   |
|   |               (Layer 1)    (Layer 1)                |   |
|   |           [Tile: Em]  [Tile: Em]  [Tile: Em]        |   |
|   |           (Layer 0)   (Layer 0)   (Layer 0)         |   |
|   +-----------------------------------------------------+   |
|                                                             |
|   [ UNDO ] (5)           [ SHUFFLE ] (2)         [ CLEAR ] (1) |
|                                                             |
|   +-----------------------------------------------------+   |
|   |  RELIC ALTAR TRAY                                   |   |
|   |  [Slot 1] [Slot 2] [Slot 3] [Slot 4] [ ] [ ] [ ]    |   |
|   |  (7 Slots total, holding active tiles)              |   |
|   +-----------------------------------------------------+   |
+-------------------------------------------------------------+
```

#### 1. Visual Layout
*   **Board Camera:** Fixed 2.5D orthographic camera tilted down at 25 degrees on the X-axis. This reveals the side depth-walls of stacked tiles.
*   **Layout Area (Upper 60%):** Houses the stacked tiles. Placed tiles cast drop shadows downward. Shaded overlapped tiles are dimmed and cold-tinted.
*   **Booster Dock (Middle):** Features three circular icons for Undo, Shuffle, and Clear.
*   **Relic Altar Tray (Bottom 20%):** A heavy, gold-trimmed black glass trough containing exactly 7 physical slots to hold selected tiles.

#### 2. Component List & Interactive Actions
*   **Pause Button `[||]` (Top-Left):** Translucent grey circle. *Action:* Opens the **Pause Screen** modal.
*   **Progress Bar (Top-Center):** Shows how many tiles have been cleared out of the level total.
*   **Moves Counter (Top-Right):** Giant gold text tracking remaining moves. Changes to red when below 5 moves.
*   **Interactive Tiles:** Tapping an active, unshaded tile triggers a squash-and-stretch animation. The tile flies into the **Relic Altar Tray**, automatically sorting itself next to matching IDs.
*   **Booster Buttons (Center Row):**
    *   *Undo Button:* Pulls the last tile from the tray back to its original grid space. Displays remaining count.
    *   *Shuffle Button:* Randomizes all remaining tiles on the board, resolving deadlocks.
    *   *Clear Button:* Selects 3 tiles from the tray and places them in an active temporary holding dock.

---

### SCREEN 5: RELIC ARENA (HERO BATTLE LAYOUT)

```
+-------------------------------------------------------------+
| [||] PAUSE              ROUND 2/3               [ 28 MOVES ] |
|                                                             |
|   +-----------------------------------------------------+   |
|   |  ENEMY TEAM                                         |   |
|   |  [ IGNIS: HP 65% ]  [ SARIEL: HP 100% ] [ GARRICK ] |   |
|   +-----------------------------------------------------+   |
|                                                             |
|   +-----------------------------------------------------+   |
|   |                 PUZZLE GRID STAGE                   |   |
|   |   (Color-Coded Relic Tiles mapping to Hero affinity)|   |
|   +-----------------------------------------------------+   |
|                                                             |
|   +-----------------------------------------------------+   |
|   |  MY TEAM (Tap glowing profile to fire Ultimate)     |   |
|   |  [IGNIS (Fire)]     [SARIEL (Frost)]   [GARRICK ]   |   |
|   |  [ MANA: 100% ] [+] [ MANA: 40%    ]   [ MANA: 0% ] |   |
|   +-----------------------------------------------------+   |
|   |  RELIC ALTAR TRAY                                   |   |
|   |  [Slot 1] [Slot 2] [Slot 3] [Slot 4] [ ] [ ] [ ]    |   |
|   +-----------------------------------------------------+   |
+-------------------------------------------------------------+
```

#### 1. Visual Layout
*   **Battle Area (Upper 30%):** Displays the enemy team. When the player completes matches, tiles convert into fireballs or frost bolts, flying upward to strike these targets.
*   **Puzzle Stage (Middle 50%):** Contains the 2.5D layout. Tiles feature elemental colored gems (Ruby Crimson, Sapphire Cyan, Emerald Jade, Nebula Violet).
*   **My Squad Panel (Bottom Row):** Displays cards for your 3 equipped heroes. Includes a portrait, element indicator, health bar, and circular Mana progress ring.

#### 2. Component List & Interactive Actions
*   **Enemy Hero Icons:** Tapping an enemy hero sets them as the primary target, drawing a gold targeting ring around their card. All matched tile attacks will focus on this target.
*   **Hero Mana Indicators:** These rings fill slowly as matches of the same elemental color are completed on the board.
*   **Hero Skill Button `[+]` (Ready State):** When mana is full, the hero card flashes with a gold light border. Tapping the portrait pauses gameplay, dims the screen, and displays a dynamic splash illustration of the hero casting their ultimate skill (e.g. "Inferno Blast" shatters 3 random blocker blocks).

---

### SCREEN 6: BEAST TRIALS (BOSS FIGHTS)

```
+-------------------------------------------------------------+
| [||] PAUSE                                      HP 820K/1.5M |
|                                                             |
|                    AETHER DRAGON (BOSS)                     |
|                   [||||||||||||||||||||  ]                  |
|                   - ATTACKS IN 3 MOVES -                    |
|                                                             |
|                    ( Roaring animated 3D                    |
|                      Dragon breathing wind                  |
|                      particles over board )                 |
|                                                             |
|   +-----------------------------------------------------+   |
|   |                 PUZZLE GRID STAGE                   |   |
|   |   (Contains stone cages, frozen block tiles)        |   |
|   +-----------------------------------------------------+   |
|                                                             |
|   +-----------------------------------------------------+   |
|   |  RELIC ALTAR TRAY                                   |   |
|   |  [Slot 1] [Slot 2] [Slot 3] [Slot 4] [ ] [ ] [ ]    |   |
|   +-----------------------------------------------------+   |
+-------------------------------------------------------------+
```

#### 1. Visual Layout
*   **Boss Showcase (Upper 40%):** The colossal boss sits on a high ledge overlooking the puzzle board. A giant, red, layered health bar spans the screen width. Below it, a bright countdown indicator tracks the boss's actions (e.g., "ATTACKS IN 3 MOVES").
*   **Puzzle Stage (Lower 50%):** Densely stacked layout. Several tiles are trapped inside heavy granite cages.

#### 2. Component List & Interactive Actions
*   **Boss Action Countdown:** Decrements by 1 every time the player picks a tile. When it reaches 0, the boss plays a stomp or claw sweep animation, flashing the screen red and dealing damage to the player's health bar.
*   **Granite Cages:** Special block overlays. Tapping an adjacent tile to complete a match shatters the cage, releasing the tile inside and making it playable.
*   **Weak Point indicator:** Displays a glowing element icon next to the countdown (e.g., "WEAKNESS: FIRE"). Completing a Fire match-three strikes the boss, staggering it and adding +2 moves to the countdown.

---

### SCREEN 7: EXTREME CHALLENGE (VAULT OF TRIALS)

```
+-------------------------------------------------------------+
| [<-] BACK                                     [ RANKS ] (i) |
|                                                             |
|                     THE VAULT OF TRIALS                     |
|                                                             |
|                     [ FROZEN OBELISK ]                      |
|                   (Colossal stone tower                     |
|                    covered in thick glowing                 |
|                    blue runes & sheets of ice)              |
|                                                             |
|                     - Difficulty: EXTREME -                 |
|                     - Active Layers: 8 Deep -               |
|                     - Tries Remaining: 2/2 -                |
|                                                             |
|   +-----------------------------------------------------+   |
|   |  LEADERBOARD PREVIEW                                |   |
|   |  1. GuildMaster_A1 ...... 12,450 pts                 |   |
|   |  2. StormRider .......... 11,200 pts                 |   |
|   +-----------------------------------------------------+   |
|                                                             |
|                      [ ENTER VAULT ]                        |
|                  (Requires Challenge Key)                   |
|                                                             |
+-------------------------------------------------------------+
```

#### 1. Visual Layout
*   **Background:** An icy abyss. Cold blue light rises from the bottom of the screen, creating frost overlays on the borders of the menu.
*   **Centerpiece:** A massive, slowly rotating 3D stone monolith engraved with ancient runes that glow with a cold blue intensity.
*   **Bottom Section:** A miniature, gold-trimmed preview card of the top 3 global ranking players.

#### 2. Component List & Interactive Actions
*   **Ranks Button `[RANKS]` (Top-Right):** Small golden laurels icon. *Action:* Slides horizontally to open the **Leaderboard Screen**.
*   **Enter Vault Button `[ENTER VAULT]` (Bottom):** Heavy stone-textured capsule button wrapped in cyan lightning effects. *Action:* Consumes one Challenge Key and loads the Extreme Puzzle Stage.

---

### SCREEN 8: LEADERBOARD

```
+-------------------------------------------------------------+
| [<-] BACK                                              (i)  |
|                                                             |
|                   VALIANT HALL OF RANKINGS                  |
|                                                             |
|   [ WEEKLY CAMPAIGN ]     [ ARENA ]     [ EXTREME TRIAL ]   |
|   (Underlines selected sorting category with golden line)   |
|                                                             |
|   +-----------------------------------------------------+   |
|   | 1. GuildMaster_A1  [CLAN]  12,450 pts  (Gold Star)  |   |
|   | 2. StormRider      [CLAN]  11,200 pts  (Silver Star)|   |
|   | 3. DarkKnight_93   [CLAN]   9,800 pts  (Bronze Star)|   |
|   | 4. FrostBite       [CLAN]   8,500 pts               |   |
|   | 5. ShadowWolf      [CLAN]   7,200 pts               |   |
|   +-----------------------------------------------------+   |
|                                                             |
|   +-----------------------------------------------------+   |
|   | YOUR RANK: 142nd           840 pts     [CLAIM REW]  |   |
|   +-----------------------------------------------------+   |
+-------------------------------------------------------------+
```

#### 1. Visual Layout
*   **Background:** High-contrast obsidian glass panels over a deep navy nebula. Golden laurel columns wrap the left and right margins of the ranking list.
*   **Category Toggles:** 3 horizontal tabs beneath the title. Tapping switches categories with a fast fade-slide animation.
*   **Leaderboard List:** Scrollable list. The top 3 rows feature custom gold, silver, and bronze background plates.

#### 2. Component List & Interactive Actions
*   **Ranking Rows:** Tapping any player's name opens a mini-profile card showing their equipped hero squad and active kingdom level.
*   **Bottom Player Row (Sticky):** A floating panel pinned to the bottom, displaying the active player's rank, score, and a quick-claim button `[CLAIM REW]` for weekly rewards.

---

### SCREEN 9: REWARDS & CLAIMS POPUP

```
+-------------------------------------------------------------+
|                                                             |
|                     STAGE COMPLETED!                        |
|                                                             |
|                      [ GOLD SHIELD ]                        |
|                    (Animated 3D crest                       |
|                     spinning with light                      |
|                     burst emissions)                         |
|                                                             |
|                     REWARDS ACQUIRED:                       |
|                                                             |
|               [ 500 WOOD ]     [ 100 GEMS ]                 |
|               (Icon Card)      (Icon Card)                  |
|                                                             |
|               [ 5 RUNESTONES ] [ 1 HERO COIN ]              |
|               (Icon Card)      (Icon Card)                  |
|                                                             |
|                                                             |
|                        [ TAP TO CLAIM ]                     |
|                                                             |
+-------------------------------------------------------------+
```

#### 1. Visual Layout
*   **Background:** Complete dark-screen overlay with `75%` black opacity.
*   **Centerpiece:** A glowing gold shield crest wrapped in rotating magical light bands. Below it, the reward icons are laid out in a clean, high-contrast grid.
*   **Animations:** On open, the rewards bounce in one by one with a slight stagger, playing a soft "chime" sound effect.

#### 2. Component List & Interactive Actions
*   **Reward Icon Cards:** Tapping any individual item displays a tooltip showing the item name and description.
*   **Claim Button `[TAP TO CLAIM]` (Full-Screen Action):** Tapping anywhere on the screen triggers a visual particle burst. The icons scale down, fly toward the player's top bar inventory counters, and close the screen.

---

### SCREEN 10: PORTAL INVENTORY

```
+-------------------------------------------------------------+
| [<-] BACK                                             [+]   |
|                                                             |
|                     RELIC VAULT INVENTORY                   |
|                                                             |
|   [ ALL ITEMS ]     [ PUZZLE BOOSTERS ]     [ RUNESTONES ]  |
|                                                             |
|   +-----------------------------------------------------+   |
|   |  [UNDO KEY]  [SHUFFLE]   [CLEAR TRAY]  [STAMINA]    |   |
|   |  Qty: 12     Qty: 5      Qty: 3        Qty: 14      |   |
|   |                                                     |   |
|   |  [RUNESTONE] [RUNESTONE] [FIRE COIN]   [CHALL_KEY]  |   |
|   |  Qty: 45     Qty: 12     Qty: 2        Qty: 8       |   |
|   +-----------------------------------------------------+   |
|                                                             |
|   +-----------------------------------------------------+   |
|   |  SELECTED ITEM: ASTRAL SHUFFLE                      |   |
|   |  - Use: Shuffles active board tiles during matches  |   |
|   |  [ USE ITEM ]                  [ BUY MORE: 100 CM ] |   |
|   +-----------------------------------------------------+   |
+-------------------------------------------------------------+
```

#### 1. Visual Layout
*   **Background:** Deep obsidian glass panels trimmed in warm gold leaf.
*   **Layout Grid:** A high-contrast grid displaying item icons wrapped in stone borders. Current quantities are shown in a clean font in the bottom-right corner of each cell.
*   **Detail Panel (Bottom 25%):** Displays detail stats, item usage rules, and active action triggers.

#### 2. Component List & Interactive Actions
*   **Inventory Grid Cells:** Tapping any item updates the bottom detail panel instantly, highlighting the selected slot with a glowing gold border.
*   **Action Button `[USE ITEM]`:** Activates the item if applicable (e.g. consuming a Stamina Potion to instantly add +50 Stamina).
*   **Quick Purchase `[BUY MORE]`:** Opens a mini-purchase dialogue to buy more boosters using premium Crownmarks.

---

### SCREEN 11: RELIQUARY SHOP

```
+-------------------------------------------------------------+
| [<-] BACK                                     [ 15,240 SHD ]|
|                                                             |
|                      THE ASTRAL BAZAAR                      |
|                                                             |
|   +-----------------------------------------------------+   |
|   |  FEATURED ITEM                                      |   |
|   |  [ SARIEL ASCENSION CHEST ]                         |   |
|   |  - Rare drops for top Frost Heroes                  |   |
|   |  - Price: 5,000 Shards (20% OFF!)                   |   |
|   |  [ PURCHASE ]                                       |   |
|   +-----------------------------------------------------+   |
|                                                             |
|   [ RUNESTONE LVM ]   [ BOOST POTIONS ]   [ GOLD KEYS ]     |
|   Cost: 1,500 Shards  Cost: 800 Shards    Cost: 1,200 Shards|
|   [ BUY ]             [ BUY ]             [ BUY ]           |
|                                                             |
+-------------------------------------------------------------+
```

#### 1. Visual Layout
*   **Background:** Cozy, mystical tavern backdrop. Warm ambient light pools from the center, casting a soft orange glow on the floating bento cards.
*   **Featured Section (Upper 40%):** A large showcase banner featuring a glowing chest with spinning light shafts. Includes a high-contrast discount tag ("20% OFF!").
*   **Retail Rows (Bottom 50%):** A dual-column layout of square item cards.

#### 2. Component List & Interactive Actions
*   **Purchase Button `[PURCHASE]` (Featured Card):** Heavy gold capsule button. *Action:* Opens a confirmation modal, subtracts Shards, and plays an item reveal animation.
*   **Standard Buy Buttons `[BUY]`:** Simple green buttons showing the cost in shards. *Action:* Instantly purchases the item if the player has sufficient funds.

---

### SCREEN 12: FIRST-TIME USER TUTORIAL (FTUE)

```
+-------------------------------------------------------------+
|                                                   [ SKIP ]  |
|                                                             |
|   +-----------------------------------------------------+   |
|   |                 PUZZLE GRID STAGE                   |   |
|   |                                                     |   |
|   |               [ TILE: ruby ]  (Glows Gold)          |   |
|   |               [ TILE: ruby ]  (Glows Gold)          |   |
|   |               [ TILE: ruby ]  (Glows Gold)          |   |
|   |                                                     |   |
|   +-----------------------------------------------------+   |
|                                                             |
|     ( Animated gold hand finger pointing to the tile )      |
|                                                             |
|   +-----------------------------------------------------+   |
|   |  ASTRAL ORACLE                                      |   |
|   |  "Behold, Commander! Match three matching relics    |   |
|   |   on the Relic Altar to shatter their corruption    |   |
|   |   and unleash pure magic!"                          |   |
|   +-----------------------------------------------------+   |
+-------------------------------------------------------------+
```

#### 1. Visual Layout
*   **Background:** The active gameplay board, darkened by a `60%` black overlay. Only the specific tutorial tiles are cut out of the overlay, shining with high-intensity gold borders.
*   **Instructor Panel (Bottom 30%):** A clean, dark-glass panel featuring a 2D portrait of the **Astral Oracle** on the left and a scrolling text box on the right.
*   **Visual Guides:** An animated, semi-translucent golden hand hovers over the target tile, performing a tap motion.

#### 2. Component List & Interactive Actions
*   **Skip Button `[SKIP]` (Top-Right):** Translucent button to skip the tutorial. Warns the player on tap.
*   **Interactive Tutorial Target Tile:** Clicking the indicated tile flies it into the tray. Clicking any other darkened area is blocked and triggers a soft shield ripple effect, preventing input errors.

---

### SCREEN 13: VICTORY SCREEN

```
+-------------------------------------------------------------+
|                                                             |
|                     VICTORY UNLEASHED!                      |
|                                                             |
|                     [ SHATTER CREST ]                       |
|                    (Animated 3D medallion                   |
|                     spinning while emitting                 |
|                     golden light bursts)                    |
|                                                             |
|                     STAGE 14 CLEAR TIME: 1:12               |
|                     SCORE: 11,250 PTS                       |
|                                                             |
|   REWARDS:                                                  |
|   [ 500 WOOD ]  [ 120 SHARDS ]  [ 3 RUNESTONES ]            |
|                                                             |
|       [ REPLAY STAGE ]              [ NEXT STAGE ]          |
|       (Translucent Grey)            (Glowing Gold Capsule)  |
|                                                             |
+-------------------------------------------------------------+
```

#### 1. Visual Layout
*   **Background:** Deep cosmic background. Gold and white particle trails rise from the bottom, accompanied by high-intensity star dust.
*   **Centerpiece:** A giant, gold-plated victory medallion that drops from the top of the screen, squashing and bouncing on impact. It displays a green checkmark surrounded by laurels.
*   **Stats Panel:** Centered, clear typography displaying the completion time and final score.

#### 2. Component List & Interactive Actions
*   **Replay Button `[REPLAY STAGE]` (Bottom-Left):** Semi-matte grey button. *Action:* Restarts the same stage instantly, consuming stamina.
*   **Next Stage Button `[NEXT STAGE]` (Bottom-Right):** Large gold button. *Action:* Loads the next stage map or launches the next stage puzzle instantly.

---

### SCREEN 14: DEFEAT SCREEN

```
+-------------------------------------------------------------+
|                                                             |
|                     ALTAR OVERFLOWED!                       |
|                                                             |
|                      [ CRACKED ALTAR ]                      |
|                     (Shattered stone                        |
|                      icon glowing with                      |
|                      faint red ash smoke)                   |
|                                                             |
|                     STAGE 14 FAILED                         |
|                     - Remaining Tiles: 12                   |
|                                                             |
|   STUCK? BUY AN EXTRA SLOT:                                 |
|   [ +1 ALTAR SLOT (8th SLOT) ]  - Cost: 100 Crownmarks      |
|                                                             |
|       [ EXIT PORTAL ]               [ TRY AGAIN ]           |
|       (Translucent Grey)            (Glowing Gold Capsule)  |
|                                                             |
+-------------------------------------------------------------+
```

#### 1. Visual Layout
*   **Background:** The active board, heavily dimmed and covered in a dark red vignette.
*   **Centerpiece:** A cracked, stone altar icon wrapped in faint red smoke and ash particles.
*   **Monetization Area (Middle):** A featured purchase card offering a safety net (e.g. buying an 8th tray slot or a shuffle booster to revive the run).

#### 2. Component List & Interactive Actions
*   **Save Button `[+1 ALTAR SLOT]` (Center Card):** High-contrast purple button. *Action:* Deducts 100 Crownmarks, expands the tray, and resumes gameplay.
*   **Exit Button `[EXIT PORTAL]` (Bottom-Left):** Flat gray button. *Action:* Closes the level and returns to the Map Screen.
*   **Try Again Button `[TRY AGAIN]` (Bottom-Right):** Bright gold button. *Action:* Restarts the level, consuming stamina.

---

### SCREEN 15: PAUSE OVERLAY MODAL

```
+-------------------------------------------------------------+
|                                                             |
|                     PAUSE PORTAL VIEW                       |
|                                                             |
|   +-----------------------------------------------------+   |
|   |  LEVEL OBJECTIVES                                   |   |
|   |  - Target: Clear 120 Tiles                          |   |
|   |  - Progress: 45 / 120                               |   |
|   +-----------------------------------------------------+   |
|                                                             |
|                     [ RESUME LEVEL ]                        |
|                     (Glowing Green)                         |
|                                                             |
|                     [ RESTART LEVEL ]                       |
|                     (Translucent Grey)                      |
|                                                             |
|                     [ RETREAT TO MAP ]                      |
|                     (Translucent Red)                       |
|                                                             |
+-------------------------------------------------------------+
```

#### 1. Visual Layout
*   **Background:** Gaussian blur overlay over the active game board.
*   **Structure:** A centered, vertical slate panel wrapped in a gold border.
*   **Buttons:** Stacked vertically, with clear color differentiation to prevent misclicks.

#### 2. Component List & Interactive Actions
*   **Resume Button `[RESUME LEVEL]` (Green):** Closes the modal and resumes active gameplay.
*   **Restart Button `[RESTART LEVEL]` (Grey):** Prompts a secondary confirmation dialogue before restarting the level.
*   **Retreat Button `[RETREAT TO MAP]` (Red):** Exits the level, returning the player to the Map Screen.

---

### SCREEN 16: SYSTEM SETTINGS OVERLAY

```
+-------------------------------------------------------------+
| [X] CLOSE                                                   |
|                                                             |
|                    RELIC SYSTEM OPTIONS                     |
|                                                             |
|   +-----------------------------------------------------+   |
|   |  AUDIO OPTIONS                                      |   |
|   |  - Music Volume:     [========O------] (Slider)     |   |
|   |  - Sound Effects:    [==============O] (Slider)     |   |
|   |  - Tactile Vibration: [ ON ]  [ OFF ] (Toggles)      |   |
|   +-----------------------------------------------------+   |
|                                                             |
|   +-----------------------------------------------------+   |
|   |  GRAPHICS TARGET                                    |   |
|   |  - Resolution:   [ LOW ]  [ MED ]  [ HIGH ]         |   |
|   |  - Shaders:      [ ECO ]  [ BAL ]  [ ULTRA ]        |   |
|   +-----------------------------------------------------+   |
|                                                             |
+-------------------------------------------------------------+
```

#### 1. Visual Layout
*   **Background:** Translucent black overlay (`50%` opacity).
*   **Structure:** Clean, structured panel. Options are divided into bento cards. Horizontal sliders feature gold circular handles.

#### 2. Component List & Interactive Actions
*   **Volume Sliders:** Dragging the handle adjusts local volume instantly and plays a test sound.
*   **Tactile Vibration Toggle:** Enables haptic feedback on tile taps.
*   **Graphics Quality Toggles:** Switches resolution and particle draw limits to preserve battery life on older mobile devices.

---

### SCREEN 17: BOOSTER DETAILS POPUP

```
+-------------------------------------------------------------+
|                                                             |
|                     ASTRAL SHUFFLE                         |
|                                                             |
|                      [ SHUFFLE ICON ]                       |
|                     (Glowing gold vortex                    |
|                      with rotating arrows)                  |
|                                                             |
|   "Instantly shuffles all active tiles on the board.       |
|    Guarantees at least 2 matchable trios are placed        |
|    on the upper layer upon execution."                      |
|                                                             |
|                     Current Quantity: 5                     |
|                                                             |
|                     [ BUY & EQUIP: 100 CM ]                 |
|                                                             |
+-------------------------------------------------------------+
```

#### 1. Visual Layout
*   **Background:** Soft, blurred overlay.
*   **Structure:** A vertical rectangular card centering the booster icon. A large description is rendered below in a clean, legible font.

#### 2. Component List & Interactive Actions
*   **Buy Button `[BUY & EQUIP]` (Bottom):** Gold-beveled button. Deducts Crownmarks, increases booster inventory, and displays a glowing sparkle effect.

---

### SCREEN 18: DAILY PROGRESSION CHALLENGES

```
+-------------------------------------------------------------+
| [<-] BACK                                              (i)  |
|                                                             |
|                     DAILY PORTAL TASKS                      |
|                                                             |
|   +-----------------------------------------------------+   |
|   |  CHALLENGE 1: SHATTER 50 FIRE RELICS                |   |
|   |  Progress: [==========O------] 35/50                 |   |
|   |  Reward: 100 Shards                        [ GO ]   |   |
|   +-----------------------------------------------------+   |
|   |  CHALLENGE 2: COMPLETE 5 ARENA FIGHTS               |   |
|   |  Progress: [-----------------] 0/5                  |   |
|   |  Reward: 2 Challenge Keys                  [ GO ]   |   |
|   +-----------------------------------------------------+   |
|                                                             |
|   +-----------------------------------------------------+   |
|   |  DAILY BONUS CREST                                  |   |
|   |  - Clear all 3 Daily Tasks to unlock the Sun Chest!  |   |
|   |  [ UNLOCK SUN CHEST ]  (Locked)                      |   |
|   +-----------------------------------------------------+   |
+-------------------------------------------------------------+
```

#### 1. Visual Layout
*   **Background:** Warm sunset gradient casting light onto the basalt paneling.
*   **List Rows:** Distinct task containers. Progress is tracked via a circular or horizontal gold status bar.

#### 2. Component List & Interactive Actions
*   **Go Buttons `[GO]`:** Flat cyan buttons. *Action:* Automatically closes the panel and navigates the player to the required screen (e.g. clicking "GO" on the Arena task opens the Arena Lobby instantly).
*   **Sun Chest Button:** Flashes gold when tasks are complete. Tapping triggers a chest opening sequence.

---

## 🚀 SECTION III: CRITICAL UI CONTROLS & REUSABLE ASSETS

To ensure consistency and ease of implementation in Godot 4.4, several reusable UI control standards are defined:

### 3.1 Standard Reusable Button Specs

```
[ GOLD CAPSULE BUTTON ]
- Border: 4px Beveled Sol-Gold (#E5A93B)
- Face: Linear Gradient (#FAD054 to #C88A21)
- Font: Inter-Bold, size 16pt, dark basalt color (#111216)
- Shadow: Soft-edge multi-pass offset drop shadow (#000000 at 45% opacity)

[ GREY MODAL BUTTON ]
- Border: 2px Slate-Blue (#4E5A73)
- Face: Solid Translucent Grey (#2D323E at 85% opacity)
- Font: Inter-Medium, size 14pt, white color (#FFFFFF)
```

### 3.2 Font Configurations
*   **Title Typography:** Space Grotesk, Bold, letter spacing `-0.02em` for headings and stage results.
*   **Numeric Status Data:** JetBrains Mono, Medium for moves remaining, scores, timers, and resource counts.
*   **Body Narrative Text:** Inter, Regular, line height `1.4` for story details and oracle instructions.

---
*End of UI/UX Specifications.*  
*Review this document. Once approved, we will begin writing the clean, highly modular Godot 4.4 GDScript files!*
