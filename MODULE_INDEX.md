# 🏰 CROWNSPIRE MODULE LIBRARY INDEX

This registry catalogs the fully modular gameplay subsystems designed and optimized for the Crownspire MMORPG framework. Each module is engineered to operate in **Dual-Mode** (fully synchronized when global systems are present, or as a robust standalone prototype using sandbox fallbacks).

---

## 🗺️ Master Table of Modules

| Module Name | Folder Path | Purpose | Primary UI Scene | Status |
| :--- | :--- | :--- | :--- | :--- |
| **HUD / Navigation** | `res://hud/` | Game status tracking, main viewport control, and notification routing. | `GameHUD.tscn` | `PASSED` |
| **Store** | `res://store/` | Real-time premium purchase interfaces, bundles, and transaction flows. | `StorePopup.tscn` | `PASSED` |
| **Mail** | `res://mail/` | Message center, claimable reward envelopes, and combat report parsing. | `MailPopup.tscn` | `PASSED` |
| **Quests** | `res://quests/` | Daily challenges, storyline progression, and reward trackers. | `QuestPopup.tscn` | `PASSED` |
| **Heroes** | `res://heroes/` | Roster management, attributes progression, and skill upgrades. | `HeroPopup.tscn` | `PASSED` |
| **Bag / Inventory** | `res://bag/` | Categorized inventory item grid, detail inspection, and active consumption. | `BagPopup.tscn` | `PASSED` |
| **Alliance** | `res://alliance/` | Alliance help systems, collective technology tree, and gift queues. | `AlliancePopup.tscn` | `PASSED` |
| **Settings & Player Profile** | `res://settings/` | Visual client preferences, audio slider buses, and detailed profile cards. | `SettingsPopup.tscn` | `PASSED` |

---

## 1. 🧭 HUD / Navigation Module
*Coordinates the main viewport top/bottom bar, resource tracking, and dynamic notification badges.*

- **Root Directory:** `res://hud/`
- **Validation Status:** `PASSED` (Godot 4.4.1 Compliant)
- **Module Files:**
  - **Data Structure:**
    - `res://hud/data/navigation_buttons.json` (Custom navigation triggers, labels, and target scenes)
    - `res://hud/data/notification_states.json` (State mappings of pending alert highlights)
  - **Scripts:**
    - `res://hud/scripts/GameHUD.gd` (Central status tracker, resource animator, and slide-out container controller)
    - `res://hud/scripts/NavigationButton.gd` (Unified touch target routing logic)
    - `res://hud/scripts/NotificationBadge.gd` (Dynamic rendering of badge counters/indicator dots)
  - **Scenes:**
    - `res://hud/scenes/GameHUD.tscn` (Unified navigation frame, layout widgets, and stats)
    - `res://hud/scenes/NavigationButton.tscn` (Self-contained modular menu button with hover state)
    - `res://hud/scenes/NotificationBadge.tscn` (Responsive alert badge with custom stylebox overrides)

### Integration & Dependencies
- **Optional Dependencies:** `/root/UIManager` (to stream active Gold, Food, Wood, Stone, Iron, and Crystal changes).
- **Integration Method:** Add `GameHUD.tscn` directly onto the viewport tree or attach it to `WorldRoot.tscn`. The navigation buttons emit standard event routing signals (e.g., `menu_button_pressed(module_id: String)`) allowing developers to toggle popups gracefully.
- **Known Limitations:** In stand-alone mode, resource levels are simulated in memory and do not write to disk.
- **Next Integration Step:** Link HUD notification counters to query local storage or database streams for newly unread mail or unclaimed completed quests.

---

## 2. 💎 Store Module
*Provides a premium purchasing interface supporting bundles, dynamic item offers, and full checkout validation.*

- **Root Directory:** `res://store/`
- **Validation Status:** `PASSED` (Godot 4.4.1 Compliant)
- **Module Files:**
  - **Data Structure:**
    - `res://store/data/store_categories.json` (Store tab definitions, display titles, and filters)
    - `res://store/data/store_items.json` (Premium speedup and currency packs catalog)
    - `res://store/data/bundles.json` (Dynamic high-value package structures)
    - `res://store/data/offers.json` (Time-sensitive discount schemas)
  - **Scripts:**
    - `res://store/scripts/StorePopup.gd` (Popup orchestrator, card populator, and layout filter)
    - `res://store/scripts/StoreItemCard.gd` (Item presentation card with unique layout styling)
    - `res://store/scripts/PurchasePopup.gd` (Modular checkout modal with confirmation and reward visualizers)
  - **Scenes:**
    - `res://store/scenes/StorePopup.tscn` (Main store window with sidebar category picker)
    - `res://store/scenes/StoreItemCard.tscn` (Grid layout item card with pricing/bonus tags)
    - `res://store/scenes/PurchasePopup.tscn` (Checkout panel featuring double-confirm safety)

### Integration & Dependencies
- **Optional Dependencies:** `/root/UIManager` (to process and persist currency deductions and transaction records).
- **Integration Method:** Connect the "Buy" trigger inside `StoreItemCard` to a generic transactional API endpoint. When a purchase resolves, deduct corresponding Crystals/Coins and add assets straight into the player inventory collection.
- **Known Limitations:** Does not include third-party API payment gateways (Google Play Billing, iOS IAP, or Stripe); transactions are simulated securely using in-game currencies.
- **Next Integration Step:** Wire purchase items to push directly into the `Bag / Inventory` module database upon checkout success.

---

## 📬 3. Mail Module
*Manages player communications, combat battle reports, and claimable system rewards.*

- **Root Directory:** `res://mail/`
- **Validation Status:** `PASSED` (Godot 4.4.1 Compliant)
- **Module Files:**
  - **Data Structure:**
    - `res://mail/data/mail_categories.json` (Categories mapping: System, Alliance, Reports)
    - `res://mail/data/mail_templates.json` (Pre-formatted layout templates for custom system events)
    - `res://mail/data/sample_mail.json` (Template models for mock inboxes)
  - **Scripts:**
    - `res://mail/scripts/MailPopup.gd` (List orchestrator, mass claim coordinator, and tab filtering)
    - `res://mail/scripts/MailListItem.gd` (Individual message list entry controller)
    - `res://mail/scripts/MailDetailPanel.gd` (Full message display, attachment renderer, and claiming triggers)
  - **Scenes:**
    - `res://mail/scenes/MailPopup.tscn` (Primary list popup layout with sidebar categories)
    - `res://mail/scenes/MailListItem.tscn` (Compact list item panel with read/unread statuses)
    - `res://mail/scenes/MailDetailPanel.tscn` (Popup container for full message inspection)

### Integration & Dependencies
- **Optional Dependencies:** `/root/UIManager` (used to claim items, update notification badges, and broadcast counts).
- **Integration Method:** Load message lists dynamically from server-driven APIs or local caches. When a user clicks "Claim Rewards", emit the rewarded dictionary and update player statistics.
- **Known Limitations:** Dynamic text wrap requires precise font configuration to prevent truncation on extremely long server reports.
- **Next Integration Step:** Hook up the combat simulation engine to automatically output a rich Battle Report JSON structure into the player's Inbox under the "Reports" category.

---

## 📜 4. Quests Module
*Maintains player game loops via Daily Objectives, Story Quests, and reward tracking progress meters.*

- **Root Directory:** `res://quests/`
- **Validation Status:** `PASSED` (Godot 4.4.1 Compliant)
- **Module Files:**
  - **Data Structure:**
    - `res://quests/data/quest_categories.json` (Storyline, Daily, Weekly trackers)
    - `res://quests/data/quests.json` (Quests library database, objective values, and states)
    - `res://quests/data/quest_rewards.json` (Category chest structures for daily activity level targets)
  - **Scripts:**
    - `res://quests/scripts/QuestPopup.gd` (Tracker coordinator, progress bar builder, and tab switcher)
    - `res://quests/scripts/QuestListItem.gd` (Individual progress item controller with dynamic claim button)
    - `res://quests/scripts/QuestDetailPanel.gd` (Details inspection overlay displaying target descriptions and payouts)
  - **Scenes:**
    - `res://quests/scenes/QuestPopup.tscn` (Master window panel featuring top progress bars and grid lists)
    - `res://quests/scenes/QuestListItem.tscn` (Flexible list panel showing completion checkboxes and bars)
    - `res://quests/scenes/QuestDetailPanel.tscn` (Details dialog displaying items and description text)

### Integration & Dependencies
- **Optional Dependencies:** `/root/UIManager` (to check active game states like kingdom level, current research, or total power).
- **Integration Method:** The quest panel queries game indicators via global registries. When progress ticks, completion state advances. Emits signals on reward claims to trigger particle systems.
- **Known Limitations:** Standing validators require manual triggers in code for gameplay milestones (like building levels).
- **Next Integration Step:** Create a global event dispatcher (`EventBus`) where game systems (e.g. building upgraded, units trained) broadcast accomplishments, and the Quest system dynamically updates progress logs.

---

## 🧙 5. Heroes Module
*Operates characters progress charts, attributes upgrades, equip slots, and active combat skill trees.*

- **Root Directory:** `res://heroes/`
- **Validation Status:** `PASSED` (Godot 4.4.1 Compliant)
- **Module Files:**
  - **Data Structure:**
    - `res://heroes/data/heroes.json` (Central database containing base attributes, progression curves, and descriptions)
    - `res://heroes/data/hero_categories.json` (Role categories: Vanguard, Support, Marksman, Mage)
    - `res://heroes/data/hero_rarities.json` (Rarities and star capping schemas)
    - `res://heroes/data/hero_skills.json` (Combat skill nodes details and level-up requirements)
  - **Scripts:**
    - `res://heroes/scripts/HeroPopup.gd` (Main UI, character grid listing, and filter toggle)
    - `res://heroes/scripts/HeroListItem.gd` (Compact thumbnail avatar cell showing levels and star ratings)
    - `res://heroes/scripts/HeroDetailPanel.gd` (Interactive dashboard for attribute levelling, promotion, and skill tabs)
    - `res://heroes/scripts/HeroSkillPanel.gd` (Displays skill info blocks and skill points contribution)
  - **Scenes:**
    - `res://heroes/scenes/HeroPopup.tscn` (Main popup with hero list scroll container and side-deck selection)
    - `res://heroes/scenes/HeroListItem.tscn` (Deck slot grid card displaying hero status/attributes)
    - `res://heroes/scenes/HeroDetailPanel.tscn` (Large inspector layout showing visual equipment and tabs)
    - `res://heroes/scenes/HeroSkillPanel.tscn` (Modular floating panel showing skill detail cards)

### Integration & Dependencies
- **Optional Dependencies:** `/root/UIManager` (to deduct upgrade items like XP Potions or Shards and sync back character levels).
- **Integration Method:** Renders hero rosters from memory database. Handles equipping gear by modifying item reference keys and updates general stats like power rating, applying them to global combat formulas.
- **Known Limitations:** Displays 2D portraits and icons; does not bundle animated 3D meshes inside this layout.
- **Next Integration Step:** Connect hero configurations to the World Map March panel so that players can select heroes to lead their marching armies.

---

## 🎒 6. Bag / Inventory Module
*Aggregates inventory item grids, categorized item filters, item detail inspection modals, consumption, and item sales.*

- **Root Directory:** `res://bag/`
- **Validation Status:** `PASSED` (Godot 4.4.1 Compliant)
- **Module Files:**
  - **Data Structure:**
    - `res://bag/data/bag_categories.json` (Tab definitions: Resources, Speedups, Equip, Chests)
    - `res://bag/data/items.json` (Item catalogs with categorizations, rarity coefficients, and usability tags)
    - `res://bag/data/inventory.json` (Default fallback templates for local offline testing)
  - **Scripts:**
    - `res://bag/scripts/BagPopup.gd` (Grid container orchestrator, tab selector, search filters, and detail connections)
    - `res://bag/scripts/InventoryItemCard.gd` (Individually styled grid items rendering rarity colors and quantities)
    - `res://bag/scripts/ItemDetailPanel.gd` (Modal inspector managing action buttons for USE, OPEN, and SELL)
  - **Scenes:**
    - `res://bag/scenes/BagPopup.tscn` (Main overlay window featuring search edit, sort select, and scrollable grids)
    - `res://bag/scenes/InventoryItemCard.tscn` (Thumbnail container card with a custom color rarity outline)
    - `res://bag/scenes/ItemDetailPanel.tscn` (Inspect layout overlay centering actions over a background dim overlay)

### Integration & Dependencies
- **Optional Dependencies:** `/root/UIManager` (reads, modifies, and saves inventory states, updating resource totals directly).
- **Integration Method:** Integrates natively by connecting the `item_used`, `chest_opened`, and `item_sold` signals. Inside handlers, update global resources (e.g. `UIManager.gold += X`) and update quantities.
- **Known Limitations:** Rarity colors are determined by flat string matches; items must specify valid category tags.
- **Next Integration Step:** Link speedup items within the builder queues so clicking speedup automatically opens the Bag filtered to the "speedups" category.

---

## 🤝 7. Alliance Module
*Unifies collaborative gameplay: help speedups, technology contributions, gifts claim, and roster management.*

- **Root Directory:** `res://alliance/`
- **Validation Status:** `PASSED` (Godot 4.4.1 Compliant)
- **Module Files:**
  - **Data Structure:**
    - `res://alliance/data/alliance_overview.json` (General statistics and details of the current alliance)
    - `res://alliance/data/alliance_members.json` (Member list, ranks, power statistics, and login status)
    - `res://alliance/data/alliance_research.json` (Technology upgrades, donation tiers, and contribution progress)
    - `res://alliance/data/alliance_gifts.json` (Alliance gift queue and claiming templates)
  - **Scripts:**
    - `res://alliance/scripts/AlliancePopup.gd` (Tab panel manager, members grid, and tech donation parser)
    - `res://alliance/scripts/AllianceMemberItem.gd` (Detailed member roster row controller)
    - `res://alliance/scripts/AllianceDetailPanel.gd` (Details card displaying research tiers and upgrades)
    - `res://alliance/scripts/AllianceGiftPanel.gd` (Gift collection item box layout and claims validator)
  - **Scenes:**
    - `res://alliance/scenes/AlliancePopup.tscn` (Main portal panel displaying members list, gifts, and tech)
    - `res://alliance/scenes/AllianceMemberItem.tscn` (Row panel with status and power score layouts)
    - `res://alliance/scenes/AllianceDetailPanel.tscn` (Popup card with progression sliders for tech donations)
    - `res://alliance/scenes/AllianceGiftPanel.tscn` (Gift box container cell displaying claim status)

### Integration & Dependencies
- **Optional Dependencies:** `/root/UIManager` (checks alliance membership, credits items from claimed chests, and manages active help requests).
- **Integration Method:** Incorporates tech donation to track points progress, help panels to clear timers, and gift claims to reward cooperative tasks.
- **Known Limitations:** In-memory standalone fallback replicates member rosters; multiplayer requires backend web socket synchronization.
- **Next Integration Step:** Bind help signals to active builder timers so upgrading buildings immediately pushes a help card onto the alliance board.

---

## ⚙️ 8. Settings & Player Profile Module
*Powers player configuration preferences, volume slider buses, and detailed profile credentials.*

- **Root Directory:** `res://settings/`
- **Validation Status:** `PASSED` (Godot 4.4.1 Compliant)
- **Module Files:**
  - **Data Structure:**
    - `res://settings/data/settings_defaults.json` (Default graphics presets, audio values, and languages)
    - `res://settings/data/player_profile.json` (Player power ratings, kill logs, level milestones)
    - `res://settings/data/supported_languages.json` (Language display keys and codes mapping)
  - **Scripts:**
    - `res://settings/scripts/SettingsPopup.gd` (Dropdown selection router, slider audio hook, and sub-panel trigger)
    - `res://settings/scripts/SettingsOptionRow.gd` (Config control row template for custom parameters)
    - `res://settings/scripts/PlayerProfilePanel.gd` (Statistics inspector layout showing ranks and power details)
  - **Scenes:**
    - `res://settings/scenes/SettingsPopup.tscn` (Main dashboard showing preferences grid and Profile button)
    - `res://settings/scenes/SettingsOptionRow.tscn` (General control container for settings lists)
    - `res://settings/scenes/PlayerProfilePanel.tscn` (Elegant inspect modal displaying player details)

### Integration & Dependencies
- **Optional Dependencies:** `/root/UIManager` (supplies actual level coordinates, username profiles, VIP rankings, and settings data).
- **Integration Method:** Connect sliders directly to Godot's `AudioServer` buses (e.g. Master, BGM, SFX). Updates language settings, writes configs to standard disk files (`user://`), and displays profile sheets.
- **Known Limitations:** Standard settings are preserved locally; language switching relies on Godot's built-in translation system (`TranslationServer`).
- **Next Integration Step:** Link the Avatar picker to allow players to select unlocked hero icons from their collected Heroes roster.

---

## 🏰 9. Building Upgrade Window Module
*An official, reusable, production-ready building upgrade window supporting any building configuration with dynamic data structures and premium monetization options.*

- **Root Directory:** `res://scenes/` & `res://scripts/`
- **Validation Status:** `PASSED` (Godot 4.4.1 Compliant)
- **Module Files:**
  - **Scripts:**
    - `res://scripts/BuildingUpgradeWindow.gd` (Dynamic building controller: cost validations, premium conversions, animations, and upgrade triggers)
    - `res://scripts/BonusRow.gd` (Handles dynamic binding of stat metrics)
    - `res://scripts/RequirementRow.gd` (Orchestrates requirement check marks, missing totals, and go-to target shortcuts)
  - **Scenes:**
    - `res://scenes/BuildingUpgradeWindow.tscn` (Main popup frame with artwork container, styled scrollbox, and action footers)
    - `res://scenes/BonusRow.tscn` (Statistic bonus row template with sapphire blue borders)
    - `res://scenes/RequirementRow.tscn` (Requirement check layout featuring quick-obtain buttons)

### Integration & Dependencies
- **Optional Dependencies:** `/root/UIManager` (queries the loaded `buildings.json` states, compares cost records, and processes upgrade transactions).
- **Integration Method:** Preload `BuildingUpgradeWindow.tscn` and open it via the standard popup manager: `UIManager.open_popup(BuildingUpgradeWindow)`. Pass a target `building_id` property (e.g. `"citadel"`, `"farm"`, `"lumber_mill"`) to dynamically load details.
- **Known Limitations:** Sandbox mode provides a built-in fallback resource-granting flow on the "Obtain" button, permitting immediate testing of upgrades.
- **Next Integration Step:** Link the world map building touch callbacks to directly trigger this window with the touched structure's ID.

---

## 🚦 Recommended Integration Order Into Main Crownspire Project

To ensure zero dependencies conflicts and maintain compile-safe progression, modules should be integrated into the central Crownspire game loop in this precise sequence:

```
                  ┌─────────────────────────┐
                  │ 1. HUD / NAVIGATION     │ ◄─── (Central Frame & Viewports)
                  └────────────┬────────────┘
                               │
                  ┌────────────▼────────────┐
                  │ 2. STORE                │ ◄─── (Currency Deductions & Checkout)
                  └────────────┬────────────┘
                               │
                  ┌────────────▼────────────┐
                  │ 3. MAIL                 │ ◄─── (Inbox Center & Inbox Alerts)
                  └────────────┬────────────┘
                               │
                  ┌────────────▼────────────┐
                  │ 4. QUESTS               │ ◄─── (Objectives & Progress Bars)
                  └────────────┬────────────┘
                               │
                  ┌────────────▼────────────┐
                  │ 5. HEROES               │ ◄─── (Roster Management & Attribute progression)
                  └────────────┬────────────┘
                               │
                  ┌────────────▼────────────┐
                  │ 6. BAG / INVENTORY      │ ◄─── (Consumables, Chests & Item Systems)
                  └────────────┬────────────┘
                               │
                  ┌────────────▼────────────┐
                  │ 7. ALLIANCE             │ ◄─── (Cooperative Help & Upgrades)
                  └────────────┬────────────┘
                               │
                  ┌────────────▼────────────┐
                  │ 8. SETTINGS & PROFILE   │ ◄─── (User Preferences & Preferences Save)
                  └─────────────────────────┘
```

### Integration Workflow Checklist
1. **Load Global Autoloads:** Mount `res://autoload/ui_manager.gd` to Godot's Autoload tab as `/root/UIManager`.
2. **Mount HUD Layout:** Instance `GameHUD.tscn` inside your main gameplay scene container.
3. **Register Popup Preloads:** Register all 7 sub-popups (`StorePopup`, `MailPopup`, `QuestPopup`, `HeroPopup`, `BagPopup`, `AlliancePopup`, `SettingsPopup`) inside your HUD or main Viewport manager.
4. **Hook Menu Intercepts:** Wire HUD navigation signals to instantiate or toggle the respective overlay modal scenes.
5. **Set Save Schedules:** Connect global triggers to invoke `UIManager.save_player_state()` to persist data automatically across all modules.
