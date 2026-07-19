# Crownspire Mobile MMO — Centralized Modules Merge Report
This report outlines the technical blueprint, singleton configurations, scene graphs, folders, scripts, and data synchronization workflows required to merge the ten core gameplay modules into the central **Crownspire** production engine repository.

---

## 1. Core Architecture & Autoload Singletons

The Crownspire client utilizes four global autoload singletons to decouple data persistence, UI modal orchestration, in-game mail handling, and quests/milestone tracking. These singletons must be registered in the **Project Settings > Autoload** tab prior to merging scene nodes:

| Autoload Name | Script Resource Path | Responsibility |
| :--- | :--- | :--- |
| **UIManager** | `res://autoload/ui_manager.gd` | Central event bus, economy/wallets tracking, HUD transitions, JSON caching, and modular popup stack controls. |
| **SettingsManager** | `res://autoload/SettingsManager.gd` | Persistent user preferences (audio buses, FPS limiting, battery savers, privacy analytics), lord name updates, redeemable gift scrolls, achievements, and ruler statistics. |
| **MailManager** | `res://autoload/MailManager.gd` | Dynamic in-memory mail databases, automatic expiration cron, reward disbursement mapping, filter sorting query engines. |
| **QuestManager** | `res://autoload/QuestManager.gd` | Tracks main-story, daily, and weekly quest targets, connects directly to gameplay signal hooks (e.g. barracks, tech), and manages milestone progression. |

---

## 2. Integrated Module Inventory

The merge covers ten complete, production-ready mobile systems designed for standard 720x1280 portrait mobile viewports:

1. **Master HUD (`GameHUD.tscn`)**: Pinned Ruler Identity, Strategy Resource Strips, live Quest Trackers, and circular floating shortcut containers.
2. **City View (`CityView.tscn`)**: Isometric interactive kingdom camera, resource collector tick buttons (Farm, Lumber Mill, Quarry, Iron Mine), training barracks, and research academy panels.
3. **World Map (`WorldMapView.tscn`)**: Hex wilderness map simulator, expedition dispatch menus, PvE target selectors, and animated march timelines.
4. **Hero System (`HeroScreen.tscn`)**: Grid carousel of rare/epic/legendary rulers, experience potion feeds, ascension level caps, and skill/gear forge panels.
5. **Bag / Inventory (`BagScreen.tscn`)**: Category sorting (Speedups, Combat, Buffs, Resources), quantity adjustment popups, and instant-use consumable triggers.
6. **Alliance System (`AllianceScreen.tscn`)**: Tabbed portal containing Territory control, tech donations, collective rallies, help desks, chat log channels, and rank controls.
7. **Store / Monetary (`Store.tscn`)**: Rotating slideshow banners, ticking limited-flash deals, milestone bundle deals, and crystal geode tiers.
8. **Mail / Inbox (`MailScreen.tscn`)**: Mail category columns, battle report analysis cards, searchable index, and instant reward collection triggers.
9. **Quest Board (`QuestScreen.tscn` / `LiveOpsDashboard.tscn`)**: Comprehensive daily duty tracks, milestone progression chests, and navigation quick-jumps.
10. **Settings & Profile (`SettingsScreen.tscn` / `PlayerProfileScreen.tscn`)**: Dual profile avatar/frame/title sliders, support centers, credits rolling, and precise audio/graphics toggle arrays.

---

## 3. Data-Driven Schema Integrity (JSON)

All game state configurations are driven by local JSON tables located under `res://data/`. These tables are loaded and cached by `UIManager` on boot:

*   **Store Inventory**: `store_categories.json`, `store_items.json`, `bundles.json`, `offers.json`
*   **Kingdom Buildings**: `buildings.json`
*   **Hero Specifications**: `heroes.json`, `hero_skills.json`, `hero_equipment.json`
*   **Core Items**: `items.json`, `inventory.json`, `resources.json`
*   **Social Database**: `alliance.json`, `alliance_buildings.json`, `alliance_research.json`, `players.json`
*   **Missions / Quests**: `campaigns_and_quests.json`
*   **System Mail**: `mail/system_mail.json`, `mail/battle_reports.json`, `mail/event_mail.json`, `mail/mail_templates.json`
*   **System Settings**: `settings/settings_defaults.json`, `settings/supported_languages.json`, `settings/graphics_profiles.json`, `settings/notification_preferences.json`

---

## 4. Signal Binding & Decoupled Communication Flow

To maintain modularity and prevent hard circular references, all communications are routed through event-driven signal buses:

```text
  [Gameplay Events]                        [Event Bus]                       [UI Handlers]
  Barracks -> Troops Trained ------------> UIManager (Signal) -------------> QuestManager / Quest HUD
  Academy -> Tech Researched ------------> UIManager (Signal) -------------> QuestManager / Quest HUD
  Citadel -> Level Up -------------------> UIManager (Signal) -------------> QuestManager / Quest HUD
  Gathering -> Resource Harvest ---------> UIManager (Signal) -------------> Top Resource Rail
  Store -> Purchase Succeeded ------------> UIManager (Signal) -------------> Reward Celebrator Popup
  Mail -> Claims Attachment -------------> MailManager (Signal) -----------> UIManager Wallet Additions
```

---

## 5. Verification Protocol

1. **Theme Adherence**: Check that all newly instanced UI container nodes are bound to `res://ui_theme.tres`.
2. **Nine-Patch Margins**: Confirm any custom textured panel panels or buttons maintain 3-slice or 9-slice coordinates (`Margin Left/Right/Top/Bottom`) to prevent stretching distortion on varying viewport sizes.
3. **No Circular Preloads**: Ensure screens utilize dynamic preloading (`preload(...)` or `load(...)`) only upon explicit button pressed actions to avoid massive loading deadlocks on start.
4. **Strict Thread Safety**: Do not modify state metrics from parallel thread routines; rely exclusively on thread-safe setter properties on the singletons.
