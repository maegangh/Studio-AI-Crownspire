# Crownspire Sovereign MMO — Comprehensive Centralized Merge Report

This document serves as the master record of the technical integration of the Crownspire module workspace into the core production Godot project. The goal of this merge is to unify the newly developed portrait-oriented MMO sub-modules with the existing Crownspire Crystal Vault system, establishing the central repository as the single source of truth.

---

## 1. Executive Summary & Architecture

The merge was executed with a zero-filesystem-collision strategy. The existing project structure and the new mobile systems co-exist cleanly:
- **Main Project Root (`res://`)**: Contains the original, flat-structure game files (`Alliance.gd`, `Bag.gd`, `Mail.gd`, `Settings.gd`, etc.) and the desktop-oriented `crystal_vault/` module.
- **Unified Modules Directory (`res://scenes/`, `res://scripts/`, `res://data/`, `res://autoload/`, `res://resources/`, `res://assets/`)**: Houses the newly added high-fidelity portrait mobile systems (Master HUD, Store, Quests, modular Alliance Panels, Settings, and Mail sub-modules).

By utilizing distinct paths, both systems are preserved, preventing circular dependency deadlocks and avoiding destructive overwrites.

### Singleton (Autoload) Configuration
The master `project.godot` file has been successfully merged. It now registers both the Crystal Vault backend singletons and the mobile MMO master autoload controllers:

```ini
[autoload]

; --- Existing Crystal Vault Autoloads ---
CrystalVaultManager="*res://crystal_vault/CrystalVaultManager.gd"
CVSaveManager="*res://crystal_vault/CVSaveManager.gd"
CVDataManager="*res://crystal_vault/CVDataManager.gd"
CVAssetLoader="*res://crystal_vault/CVAssetLoader.gd"
CVArenaManager="*res://crystal_vault/CVArenaManager.gd"

; --- New Sovereign MMO Mobile Autoloads ---
UIManager="*res://autoload/ui_manager.gd"
MailManager="*res://autoload/MailManager.gd"
QuestManager="*res://autoload/QuestManager.gd"
SettingsManager="*res://autoload/SettingsManager.gd"
```

---

## 2. Integrated Module Inventory (Added Files)

Six core directories have been integrated from `/godot` to the root namespace of the project:

### A. Autoload Singletons (`res://autoload/`)
- `ui_manager.gd`: Central event bus, player wallets (Gold, Crystal, VIP), HUD view toggling, and JSON static database parsing.
- `MailManager.gd`: Inbox data structure, mail filtering, expiration scheduler, and attachment claims.
- `QuestManager.gd`: Main story, daily, and weekly duty tracker connected to strategy signal triggers (e.g. training barracks, technology research).
- `SettingsManager.gd`: Master sound mixer, lord customization profiles, graphics/framerate selectors, and redeemable code lists.

### B. Dynamic JSON Schemas (`res://data/`)
- `store_categories.json` / `store_items.json` / `bundles.json` / `offers.json` (Premium Store catalog items, rarity tiers, purchase limits, and countdown deal timers)
- `buildings.json` (Current level, resource accumulation rates, capacity limits, and upgrade thresholds for Farms, Timber Mills, Quarries, Iron Mines, Barracks, and Academies)
- `heroes.json` / `hero_skills.json` / `hero_equipment.json` (Visual carousel configurations, leveling, ascension stars, biography cards, story chapters, and equipment levels)
- `items.json` / `inventory.json` / `resources.json` (Category filters, consumable items, inventory item cells, and wallet resource definitions)
- `alliance.json` / `alliance_buildings.json` / `alliance_research.json` (Coalition stats, territory nodes, war rooms, help ticket logs, tech contribution nodes)
- `campaigns_and_quests.json` (Seasonal milestone chests, active LiveOps indicators, task rows, and reward payouts)
- `/quests/` (Subfolder holding distinct duty sets: Daily, Weekly, Alliance, Hero, Wayfinder, Crystal Vault, and Intel)
- `/settings/` (Subfolder holding graphics profiles, notification defaults, master preferences, and language locales)
- `/mail/` (Subfolder with templates, battle report logs, and administrative communications)

### C. Scene Graph Components (`res://scenes/`)
- `GameHUD.tscn`: Sovereign master mobile overlay (top-level view).
- `CityView.tscn` / `WorldMapView.tscn`: Active gameplay modes.
- `Store.tscn` / `StoreHome.tscn` / `StoreTabBar.tscn` / `ShopCategoryButton.tscn` / `StoreItemCard.tscn` / `BundleCard.tscn` / `FeaturedBanner.tscn` / `LimitedOfferCard.tscn`: E-Commerce monetization interface.
- `LiveOpsDashboard.tscn` / `CampaignCard.tscn` / `QuestListItem.tscn` / `QuestTracker.tscn`: Duty board and active quest overlays.
- `AllianceScreen.tscn` + 21 specialized sub-scenes (Territory map, Help desk, Donations grids, Live chat lobby, Settings panel, Ranking scrolls).
- `HeroScreen.tscn` + 13 specialized components (Ascension meters, Level sliders, Weapon widgets, Biographies, Skill grids).
- `BagScreen.tscn` + 10 inventory grid pieces (Filter buttons, use panels, sliders).
- `MailScreen.tscn` + 12 inbox slots (Message cards, attachment drawers, battle analysts).
- `SettingsScreen.tscn` / `PlayerProfileScreen.tscn` + 13 sub-screens (Redemption cards, localization wheels, volume controls, avatar borders).

### D. GDScript 2.0 Scripts (`res://scripts/`)
Contains 100% matched typed, warning-free companion scripts mapping perfectly to each of the visual scenes listed above, cleanly separated for scalability.

---

## 3. Conflict Resolution Report

By utilizing isolated subdirectories, we resolved all technical directory collisions without sacrificing existing logic:

| Conflict Domain | Main Project Path | Module Path | Resolution Strategy |
| :--- | :--- | :--- | :--- |
| **Project Settings** | `res://project.godot` | `res://godot/project.godot` | **Merged**: Autoload systems are combined. Viewport width/height is set to portrait (720x1280) for mobile focus. Rendering and environment sections are safely integrated. |
| **Alliance Code** | `res://Alliance.gd` | `res://scripts/AllianceScreen.gd` | **Preserved**: The old single-file monolithic script resides at the root `/`, whereas the new modular screen script is inside `/scripts/`. Both can be executed independently. |
| **Inventory Code** | `res://Bag.gd` | `res://scripts/BagScreen.gd` | **Preserved**: Flat-layout script is kept at root; modular, paginated backpack layout is registered inside `/scripts/`. |
| **Quest Database** | `res://QuestScene.gd` | `res://scripts/quests/QuestScreen.gd` | **Preserved**: Original system continues to point to root, new multi-tier Quest tracker operates via QuestManager inside `/scripts/quests/`. |
| **Database Schemas** | `res://*.json` (Root level) | `res://data/*.json` (Nested) | **Co-exist**: The original systems load from the root (`res://heroes.json` with highly detailed math structures) while the new systems read from nested locations (`res://data/heroes.json` containing live state fields like `level` and `unlocked`). |

---

## 4. Ignored Web Portal Files

Per explicit instructions, all React-Vite web environment files have been completely bypassed and ignored during this merge to protect the web portal's operational status:
- `/package.json` and `/package-lock.json`
- `/tsconfig.json` and `/.eslintrc.json`
- `/vite.config.ts`
- `/tailwind.config.js` and `/postcss.config.js`
- `/index.html`
- `/server.ts`
- `/src/` (All TypeScript React components, contexts, styling, and entry hooks)
- `/dist/` (Production web distribution builds)
- `/node_modules/` (All external web packages)

---

## 5. Manual Review & Integration Checkpoints

When booting this project in Godot or transitioning between gameplay screens, developers should review the following:

1. **Resolution Scale Adaptation**:
   - The Crystal Vault module was designed for widescreen desktop (`1024x600`), whereas the MMO Store & HUD modules are configured for portrait mobile (`720x1280`).
   - If loading Crystal Vault scenes inside the mobile container, UI scaling anchors (`Layout Preset` in Godot) should be set to "Aspect Expand" or placed in centered containers to avoid clip boundaries.
2. **Database State Alignment**:
   - Verify that any runtime writes (such as purchase triggers or building upgrades) write to `user://` directories instead of modifying read-only `res://` schemas. Both systems adhere to this rule.
3. **Sound Bus Registrations**:
   - `SettingsManager.gd` references standard sound channels (`Master`, `Music`, `SFX`). Ensure matching Audio Buses are created in the Godot Editor under the **Bottom Audio Panel** if custom track players are added.
