# Crownspire Mobile MMO Store UI - Godot 4.4.1 Production Build

This repository holds the fully configured, dynamic, responsive portrait mobile Store system for **Crownspire**, implemented cleanly for Godot 4.4.1.

## 🌟 Key Highlights

-   **Complete UI Scene Graph**: 12 modular scenes mapping out full resource bars, sliding hero carousels, horizontal sales grids, purchase panels, and celebratory item award triggers.
-   **Fully Dynamic Integration**: Connects to the local JSON database files (`data/store_categories.json`, `data/store_items.json`, `bundles.json`, `offers.json`).
-   **Global Event Bus Autoload**: Unified `ui_manager.gd` singleton tracking premium balances, saving/loading player progression files, and dispatching transaction alerts.
-   **AAA Portrait Fidelity**: Follows the strict visual guidelines of *Whiteout Survival* and *Call of Dragons*, featuring monospaced counting updates and responsive viewport anchors.

---

## 📂 Project Directory Structure

```text
godot/
├── project.godot                  # Engine Project Settings (720x1280, portrait bounds)
├── ui_theme.tres                  # Centralized style templates (StyleBoxTextures / Fonts)
├── assets/                        # Shared visual assets (PNGs, textures, illustrations)
├── resources/                     # Dynamic resource configurations (.tres style files)
├── autoload/                      # Global Autoload managers (Event buses, query engines, state sync)
│   ├── ui_manager.gd             # Core Autoload managing currency wallets, UI states & popups
│   ├── MailManager.gd            # Mail database, filter engines, Battle Report parsers
│   ├── QuestManager.gd           # Main, Daily, Weekly duty progression lists & milestones
│   └── SettingsManager.gd        # Support centers, master volume buses, Lord profile data
├── data/
│   ├── store_categories.json      # Dynamic categories (Featured, Bundles, Crystals, Market)
│   ├── store_items.json          # Individual speedups, shields, chest packs, crystal tiers
│   ├── bundles.json               # Landscape high-value promotions (Growth Funds, Heroes)
│   ├── offers.json                # Expedited expiring flash deals
│   └── campaigns_and_quests.json  # NEW: LiveOps seasonal campaigns and daily quest parameters
├── scripts/
│   ├── Store.gd                  # Root scene coordinator (swipes, currency rail updates)
│   ├── StoreHome.gd              # Catalog content builder (spawns card grids or scroll ribbons)
│   ├── StoreTabBar.gd            # Nav row instantiating category buttons
│   ├── ShopCategoryButton.gd     # Dynamic button showing red notification indicators
│   ├── StoreItemCard.gd          # Grid product cells with rarity bands & limit bounds
│   ├── BundleCard.gd             # Large promo slots showing multiple included items
│   ├── FeaturedBanner.gd         # Hero slider cycling through legendary packages
│   ├── LimitedOfferCard.gd       # Compact countdown cells for hot temporary sales
│   ├── CountdownTimer.gd         # Monospaced jitter-free time ticking labels
│   ├── PurchasePopup.gd          # Confirm transaction overlay detailing cost, wallet balances
│   ├── RewardPopup.gd            # Celebratory claim banner populating acquired drops
│   ├── RewardSlot.gd             # Cells rendering item shards inside rewards or bundles
│   ├── LiveOpsDashboard.gd       # NEW: Master coordinator for quests and active campaign panels
│   ├── CampaignCard.gd           # NEW: Seasonal event panel with dynamic milestone chest controls
│   ├── QuestListItem.gd          # NEW: Quest deed rows with action triggers and reward indicators
│   ├── GameHUD.gd                # NEW: Sovereign master HUD controller with viewport view toggles
│   ├── TopResourceBar.gd         # NEW: Kingdom strategy raw resource ticker (food, wood, stone, iron)
│   ├── BottomNavigation.gd       # NEW: Bottom utility navigation bar coordinating navigation buttons
│   ├── PlayerProfile.gd          # NEW: Ruler stats panel displaying VIP, power rating, avatar borders
│   ├── QuestTracker.gd           # NEW: Active quest pinned widget with interactive jump/claim controls
│   ├── NotificationManager.gd    # NEW: Kinematic queueing toast notification manager for loot drops
│   ├── FloatingButtons.gd        # NEW: Side circular action panels for premium portal shortcuts
│   ├── MailButton.gd             # NEW: Unread mail checker with animated glowing indicator
│   ├── EventButton.gd            # NEW: Completed event deeds notifier linking back to liveops panel
│   ├── AllianceButton.gd         # NEW: Collaborative donate/ embassy button granting honor
│   ├── WorldButton.gd            # NEW: World map wilderness swap control
│   └── CityButton.gd             # NEW: Inner palace camera focus recall trigger
└── scenes/
    ├── Store.tscn
    ├── StoreHome.tscn
    ├── StoreTabBar.tscn
    ├── ShopCategoryButton.tscn
    ├── StoreItemCard.tscn
    ├── BundleCard.tscn
    ├── FeaturedBanner.tscn
    ├── LimitedOfferCard.tscn
    ├── CountdownTimer.tscn
    ├── PurchasePopup.tscn
    ├── RewardPopup.tscn
    ├── RewardSlot.tscn
    ├── LiveOpsDashboard.tscn     # NEW: Active live operations central panel
    ├── CampaignCard.tscn         # NEW: Modular seasonal milestone visualizer
    ├── QuestListItem.tscn        # NEW: Interactive daily task progression layout
    ├── GameHUD.tscn              # NEW: Master 720x1280 gameplay overlay system
    ├── TopResourceBar.tscn       # NEW: Strategy resource bar with numeric update lerps
    ├── BottomNavigation.tscn     # NEW: Modular button strip managing city/world toggles
    ├── PlayerProfile.tscn        # NEW: Circular profile avatar with VIP tier meters
    ├── QuestTracker.tscn         # NEW: Left-side floating shortcut task panel
    ├── NotificationManager.tscn  # NEW: Animated stack container for reward slide alerts
    ├── FloatingButtons.tscn      # NEW: Right-side quick-actions stack
    ├── MailButton.tscn           # NEW: Compact button displaying unread counts
    ├── EventButton.tscn          # NEW: Crown button showing notification dots
    ├── AllianceButton.tscn       # NEW: Shield button offering tech contribution shortcuts
    ├── WorldButton.tscn          # NEW: Circular map trigger
    └── CityButton.tscn           # NEW: Circular palace recall trigger
```

---

## 🧭 Master HUD Navigation Systems

Crownspire features a comprehensive head-up-display designed exclusively for responsive mobile views:
1. **Ruler Identity**: Pinned left-hand `PlayerProfile` displaying VIP rank ascension progression and live-calculating formatted power (e.g., `1.25M`).
2. **Strategy Resource Strip**: Dynamic lerp counting for Raw Materials (Food, Wood, Stone, Iron) with pulse expansion tweens on collection.
3. **Primary Direct Tracker**: Pinned left-hand `QuestTracker` showcasing the active uncompleted mission. Includes responsive inline "Claim" or "Go" simulation.
4. **Toast Notification Stack**: Dynamic, queue-based modular alert box sliding in whenever drops are acquired. Includes automated emoji mapping for gold, crystals, timber, and items.
5. **Interactive View Toggling**: Bottom bar toggling seamlessly switches background camera vectors from the inner *City of Emerald Spires* (citadel tracking) to outer hex *Aurora Wilderness* with elegant tween transitions.

---

## 🛠️ Direct Godot Import Guide

1.  **Open Godot Engine 4.4+**.
2.  Click **Import** and select the `/godot/project.godot` file in this directory.
3.  Once the editor loads, hit **F5** or click **Play** (the main scene is preset to `Store.tscn`).
4.  Verify that `UIManager` is declared in your **Project Settings** under the **Autoload** tab pointing to `res://autoload/ui_manager.gd`.

---

## 💎 Customizing Core Asset Textures

To replace placeholder paths with final AAA hand-painted art frames, assign your PNG textures inside the Inspector panels or create a matching folder in `res://assets/ui/...` structure:
-   **Borders**: Left/Right 24px and Top/Bottom 24px Nine-Patch Margins.
-   **Buttons**: L/R 16px, T/B 18px Nine-Patch Margins.
-   **Icons**: Center perfectly with 85% maximum width padding inside `frame_rarity_x` boundaries.
