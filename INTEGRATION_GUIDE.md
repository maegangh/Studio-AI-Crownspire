# ⚙️ CROWNSPIRE MODULE INTEGRATION & ENGINEERING MANUAL
**Godot 4.4.1 Production Standards Guide**

This manual serves as the official engineering guide for integrating the validated, standalone, and dual-mode gameplay modules into the active production branch of the **Crownspire MMORPG** project.

---

## 1. PROJECT OVERVIEW

The Crownspire gameplay modules have been designed to serve a dual-purpose:
1. **Isolated Sandbox Prototyping:** Allowing rapid UI testing, visual validation, and independent balancing flows without runtime dependencies.
2. **Synchronized Production Integration:** Merging seamlessly with core gameplay managers, server sync protocols, and localized databases once registered in Godot's Autoload list.

The module library consists of **8 completed game subsystems**:
- 🧭 **HUD / Navigation:** Coordinates main top/bottom frames, tracking resource updates and dispatching modular menu views.
- 💎 **Store Module:** Provides categories filters, dynamic premium offers, and double-confirm checkout dialogs.
- ✉️ **Mail Module:** Inbox center featuring unread status indicators, claimable system reward attachments, and combat reports.
- 📜 **Quests Module:** Handles daily challenge thresholds, storyline progress bars, and activity-tiered chest payouts.
- 🧙 **Heroes Module:** Roster panel showing star tiers, upgrade matrices, item-based level-ups, and skill trees.
- 🎒 **Bag / Inventory Module:** Full grid catalog of active consumable items, chests, weapon slots, and resource pack consumption.
- 🤝 **Alliance Module:** Cooperative help request tables, donation-based research progressions, and collectable gift queues.
- ⚙️ **Settings & Player Profile:** Visual and audio preference toggles, slider system decibel buses, and detailed profile stats cards.

---

## 2. MODULE DIRECTORY MAP

The complete standalone structure is located at the root directory of your workspace. Each module is strictly separated to guarantee file safety:

```
res://
 ├── hud/            # Heads-Up Display & Navigation Mainframe
 ├── store/          # Premium Offer Shop & Purchase Panel
 ├── mail/           # Message, Attachment, and Battle Report Hub
 ├── quests/         # Daily Achievements & Story Milestones
 ├── heroes/         # Hero Progression, Star Upgrades & Skills
 ├── bag/            # Categorized Inventory & Consumable Bag
 ├── alliance/       # Guild Member, Tech Tree, & Reward Help
 └── settings/       # Client Configuration & Lord Statistics
```

### File Breakdown by Module

#### 🧭 HUD / Navigation (`res://hud/`)
- **Data:**
  - `res://hud/data/navigation_buttons.json`
  - `res://hud/data/notification_states.json`
- **Scenes:**
  - `res://hud/scenes/GameHUD.tscn`
  - `res://hud/scenes/NavigationButton.tscn`
  - `res://hud/scenes/NotificationBadge.tscn`
- **Scripts:**
  - `res://hud/scripts/GameHUD.gd`
  - `res://hud/scripts/NavigationButton.gd`
  - `res://hud/scripts/NotificationBadge.gd`

#### 💎 Store (`res://store/`)
- **Data:**
  - `res://store/data/store_categories.json`
  - `res://store/data/store_items.json`
  - `res://store/data/bundles.json`
  - `res://store/data/offers.json`
- **Scenes:**
  - `res://store/scenes/StorePopup.tscn`
  - `res://store/scenes/StoreItemCard.tscn`
  - `res://store/scenes/PurchasePopup.tscn`
- **Scripts:**
  - `res://store/scripts/StorePopup.gd`
  - `res://store/scripts/StoreItemCard.gd`
  - `res://store/scripts/PurchasePopup.gd`

#### 📬 Mail (`res://mail/`)
- **Data:**
  - `res://mail/data/mail_categories.json`
  - `res://mail/data/mail_templates.json`
  - `res://mail/data/sample_mail.json`
- **Scenes:**
  - `res://mail/scenes/MailPopup.tscn`
  - `res://mail/scenes/MailListItem.tscn`
  - `res://mail/scenes/MailDetailPanel.tscn`
- **Scripts:**
  - `res://mail/scripts/MailPopup.gd`
  - `res://mail/scripts/MailListItem.gd`
  - `res://mail/scripts/MailDetailPanel.gd`

#### 📜 Quests (`res://quests/`)
- **Data:**
  - `res://quests/data/quest_categories.json`
  - `res://quests/data/quests.json`
  - `res://quests/data/quest_rewards.json`
- **Scenes:**
  - `res://quests/scenes/QuestPopup.tscn`
  - `res://quests/scenes/QuestListItem.tscn`
  - `res://quests/scenes/QuestDetailPanel.tscn`
- **Scripts:**
  - `res://quests/scripts/QuestPopup.gd`
  - `res://quests/scripts/QuestListItem.gd`
  - `res://quests/scripts/QuestDetailPanel.gd`

#### 🧙 Heroes (`res://heroes/`)
- **Data:**
  - `res://heroes/data/heroes.json`
  - `res://heroes/data/hero_categories.json`
  - `res://heroes/data/hero_rarities.json`
  - `res://heroes/data/hero_skills.json`
- **Scenes:**
  - `res://heroes/scenes/HeroPopup.tscn`
  - `res://heroes/scenes/HeroListItem.tscn`
  - `res://heroes/scenes/HeroDetailPanel.tscn`
  - `res://heroes/scenes/HeroSkillPanel.tscn`
- **Scripts:**
  - `res://heroes/scripts/HeroPopup.gd`
  - `res://heroes/scripts/HeroListItem.gd`
  - `res://heroes/scripts/HeroDetailPanel.gd`
  - `res://heroes/scripts/HeroSkillPanel.gd`

#### 🎒 Bag / Inventory (`res://bag/`)
- **Data:**
  - `res://bag/data/bag_categories.json`
  - `res://bag/data/items.json`
  - `res://bag/data/inventory.json`
- **Scenes:**
  - `res://bag/scenes/BagPopup.tscn`
  - `res://bag/scenes/InventoryItemCard.tscn`
  - `res://bag/scenes/ItemDetailPanel.tscn`
- **Scripts:**
  - `res://bag/scripts/BagPopup.gd`
  - `res://bag/scripts/InventoryItemCard.gd`
  - `res://bag/scripts/ItemDetailPanel.gd`

#### 🤝 Alliance (`res://alliance/`)
- **Data:**
  - `res://alliance/data/alliance_overview.json`
  - `res://alliance/data/alliance_members.json`
  - `res://alliance/data/alliance_research.json`
  - `res://alliance/data/alliance_gifts.json`
- **Scenes:**
  - `res://alliance/scenes/AlliancePopup.tscn`
  - `res://alliance/scenes/AllianceMemberItem.tscn`
  - `res://alliance/scenes/AllianceDetailPanel.tscn`
  - `res://alliance/scenes/AllianceGiftPanel.tscn`
- **Scripts:**
  - `res://alliance/scripts/AlliancePopup.gd`
  - `res://alliance/scripts/AllianceMemberItem.gd`
  - `res://alliance/scripts/AllianceDetailPanel.gd`
  - `res://alliance/scripts/AllianceGiftPanel.gd`

#### ⚙️ Settings & Player Profile (`res://settings/`)
- **Data:**
  - `res://settings/data/settings_defaults.json`
  - `res://settings/data/player_profile.json`
  - `res://settings/data/supported_languages.json`
- **Scenes:**
  - `res://settings/scenes/SettingsPopup.tscn`
  - `res://settings/scenes/SettingsOptionRow.tscn`
  - `res://settings/scenes/PlayerProfilePanel.tscn`
- **Scripts:**
  - `res://settings/scripts/SettingsPopup.gd`
  - `res://settings/scripts/SettingsOptionRow.gd`
  - `res://settings/scripts/PlayerProfilePanel.gd`

---

## 3. AUTOLOADS

To link modules to your core project engine, register the following scripts inside Godot's Autoload tabs:

### 1. `UIManager` (`res://autoload/ui_manager.gd`) - *Required*
- **Role:** Central coordination hub and model source-of-truth.
- **Attributes Exposed:** 
  - Player metrics: `player_name`, `power`, `vip_level`, `level`
  - Resources: `food`, `wood`, `stone`, `iron`, `gold`, `royal_crystals`, `aurora_crystals`
  - Databases: `player_inventory` (Array of items), `unclaimed_mail`, `completed_quests`, `unlocked_heroes`
- **Signals emitted:** `currency_changed(id, value)`, `inventory_updated()`, `profile_updated()`
- **Expectation:** Modules leverage `get_node_or_null("/root/UIManager")` on initialization. If found, they pull active real numbers instead of mock fallbacks.

### 2. `QuestManager` (`res://autoload/QuestManager.gd`) - *Optional*
- **Role:** Keeps active check on quest milestones (e.g. tracking troop trainings, resource node gathering speeds).
- **Expectation:** Feeds active quests array to `QuestPopup.gd` and parses progression values.

### 3. `MailManager` (`res://autoload/MailManager.gd`) - *Optional*
- **Role:** Connects combat reports and guild announcements to the database.
- **Expectation:** Fires alerts to HUD notification badges and returns parsed text details.

### 4. `SettingsManager` (`res://autoload/SettingsManager.gd`) - *Optional*
- **Role:** Serializes display, sound levels, and audio bus frequencies to standard configurations.
- **Expectation:** Connects Settings slider changes directly to decibel formulas.

---

## 4. HUD BUTTON CONNECTIONS

`res://hud/scenes/GameHUD.tscn` serves as the game overlay mainframe. Bottom bar triggers map directly to respective standalone scenes:

```
[HEROES]   Button ──► Opens: res://heroes/scenes/HeroPopup.tscn
[BAG]      Button ──► Opens: res://bag/scenes/BagPopup.tscn
[QUESTS]   Button ──► Opens: res://quests/scenes/QuestPopup.tscn
[ALLIANCE] Button ──► Opens: res://alliance/scenes/AlliancePopup.tscn
[STORE]    Button ──► Opens: res://store/scenes/StorePopup.tscn
[MAIL]     Button ──► Opens: res://mail/scenes/MailPopup.tscn
[SETTINGS] Button ──► Opens: res://settings/scenes/SettingsPopup.tscn
[PROFILE]  Button ──► Opens: res://settings/scenes/SettingsPopup.tscn (triggers profile panel)
```

- When clicked, buttons clear their local notification badges visually.
- Each button emits `navigation_pressed(button_id, scene_path)`.
- The central controller handles dynamic instantiation via:
  ```gdscript
  var target = load(scene_path).instantiate()
  UIManager.open_popup(target) # or add_child(target)
  ```

---

## 5. JSON DATABASES

Each module utilizes specialized JSON catalogs to avoid hardcoded databases:

| Database File | Loaded By | Description / Contents |
| :--- | :--- | :--- |
| `bag_categories.json` | `BagPopup.gd` | Display labels, icons, and IDs for inventory category navigation. |
| `items.json` | `BagPopup.gd` | Attributes, rarities, names, descriptions, and chest reward tables for items. |
| `inventory.json` | `BagPopup.gd` | Saved quantity states of active items owned by the player. |
| `navigation_buttons.json`| `GameHUD.gd` | Array of path configurations, icons, and IDs for bottom deck buttons. |
| `notification_states.json`| `GameHUD.gd` | Mappings of unread alert counts per navigation item. |
| `store_categories.json`| `StorePopup.gd` | Sidebar categories (Hot, Crystals, Resources, Speedups). |
| `store_items.json` | `StorePopup.gd` | Catalog of items with pricing tiers, discounts, and item icons. |
| `bundles.json` | `StorePopup.gd` | Direct-purchase real money packs with item arrays inside. |
| `offers.json` | `StorePopup.gd` | Flash deals with countdown timings and bundle references. |
| `mail_categories.json`| `MailPopup.gd` | Tab definitions: System, Alliance, Reports. |
| `mail_templates.json` | `MailPopup.gd` | Formatting structures for claimable server mails. |
| `sample_mail.json` | `MailPopup.gd` | Initial set of inbox items for players when they first start the client. |
| `quest_categories.json`| `QuestPopup.gd` | Story, Daily, and Weekly quest dividers. |
| `quests.json` | `QuestPopup.gd` | Active quest indexes, targets, progress values, and rewards. |
| `quest_rewards.json` | `QuestPopup.gd` | Threshold requirements for daily activity chests (e.g. 100 XP chests). |
| `heroes.json` | `HeroPopup.gd` | Full list of heroes, baseline statistics, rarity weights, and skills. |
| `hero_categories.json`| `HeroPopup.gd` | Tab identifiers mapping character class/role filters. |
| `hero_rarities.json` | `HeroPopup.gd` | Limits, star parameters, and scaling coefficients by level. |
| `hero_skills.json` | `HeroSkillPanel.gd` | Available actions, level requirements, and enhancement points. |
| `alliance_overview.json`| `AlliancePopup.gd` | Dynamic alliance statistics (name, tag, member counts, language, power). |
| `alliance_members.json`| `AlliancePopup.gd` | Complete grid rosters with ranks, offline timers, and power contribution levels. |
| `alliance_research.json`| `AlliancePopup.gd` | Multi-tier research tracks with total required donation logs. |
| `alliance_gifts.json` | `AlliancePopup.gd` | Collective bonus items gained from members making bundle checkouts. |
| `settings_defaults.json`| `SettingsPopup.gd` | Initial bus configs, graphic levels, language codes, and notifications. |
| `player_profile.json` | `PlayerProfilePanel.gd`| Stats card values: power level, kills log, resources gathered, coordinates. |
| `supported_languages.json`| `SettingsPopup.gd` | Dynamic list of languages, displaying native glyph translations. |

---

## 6. SIGNALS

Integrate these signals to orchestrate modules and dispatch events:

### Currency & Roster Upgrades
- `currency_changed(currency_id: String, new_amount: float)` (emitted by `UIManager` to update HUD displays instantly)
- `inventory_updated()` (forces bag grid cards to rebuild quantities)
- `hero_levelled_up(hero_id: String, new_level: int)` (fired when XP Potions are consumed successfully)
- `hero_promoted(hero_id: String, new_star_rating: int)` (emitted upon high-star promotions)
- `skill_upgraded(hero_id: String, skill_id: String, new_level: int)` (emitted upon allocating skill points)

### Transactions & Loot
- `store_purchase_completed(item_id: String, price_deducted: int)` (broadcasts successful checkout events)
- `chest_opened(item_id: String, gained_rewards: Array)` (dispatches visual claim overlays)
- `mail_claimed(mail_id: String)` (dispatched on reward collection)
- `quest_completed(quest_id: String)` (notifies central game engines)

### Alliance & Client Settings
- `alliance_help_requested(target_timer_id: String)` (notifies active teammates)
- `alliance_donation_made(tech_id: String, point_value: int)` (updates collective guild pools)
- `settings_changed(section: String, key: String, new_value: Variant)` (triggers graphic presets, audio sliders, or translations)

---

## 7. SAVE SYSTEM

Persistent records are split between **cloud registries** and **local file systems**:

1. **Local Preferences (Local Files):**
   - Save client settings, audio sliders, and visual preferences to `user://settings_save.json` (via `SettingsPopup.gd`).
2. **Player States (Cloud Synced):**
   - Dynamic states such as inventory quantities, quest completion matrices, alliance status, and mail statuses are routed through `UIManager`.
   - The UIManager saves states systematically using `user://crownspire_bag_standalone_v1.json` or syncs directly with remote database backends.

*Recommendation:* For offline development sandbox environments, read/write player profiles locally utilizing `user://` data streams. In multi-device setups, serialize JSON trees and transmit them to server database endpoints.

---

## 8. RECOMMENDED INTEGRATION SEQUENCE

Integrate modules into your main Godot project in this specific order to preserve dependencies:

```
[1. HUD Mainframe] ──► [2. Store Checkout] ──► [3. Mail Inbox] ──► [4. Quests Objectives]
                                                                          │
[8. Settings Panel] ◄── [7. Alliance Guild] ◄── [6. Inventory Bag] ◄── [5. Heroes Roster]
```

### Module Integration Steps

#### 1. HUD / Navigation Module
- **Action:** Copy folder `res://hud/` into the working tree. Instantiate `res://hud/scenes/GameHUD.tscn` as a permanent canvas overlay.
- **Connections:** Listen to `map_mode_changed(mode)` to transition background cameras between city views and world map layers.
- **Signals Required:** Connect `UIManager.currency_changed` to dynamically animate resource values in the top header panel.

#### 2. Store Module
- **Action:** Copy folder `res://store/` into the working tree. Preload `res://store/scenes/StorePopup.tscn` inside the HUD or popup viewport.
- **Connections:** Link checkout events inside `PurchasePopup` to execute `UIManager.food += X`, `wood += X` or inventory reward updates.

#### 3. Mail Module
- **Action:** Copy folder `res://mail/` into the working tree.
- **Connections:** Hook mass claim triggers in `MailPopup.gd` to credit items and trigger global item notifications.

#### 4. Quests Module
- **Action:** Copy folder `res://quests/` into the working tree.
- **Connections:** Connect Daily Quest chests to feed items directly into the player's inventory list.

#### 5. Heroes Module
- **Action:** Copy folder `res://heroes/` into the working tree.
- **Connections:** Hook item upgrades to check and deduct XP potion items from `Bag / Inventory` stocks.

#### 6. Bag / Inventory Module
- **Action:** Copy folder `res://bag/` into the working tree.
- **Connections:** Connect `item_used`, `chest_opened`, and `item_sold` to deduct quantities and add in-game assets securely.

#### 7. Alliance Module
- **Action:** Copy folder `res://alliance/` into the working tree.
- **Connections:** Connect donation inputs to trigger progress tracking events.

#### 8. Settings & Player Profile Module
- **Action:** Copy folder `res://settings/` into the working tree.
- **Connections:** Route audio levels to corresponding standard decibel buses.

---

## 9. TESTING CHECKLIST (QA PROCEDURES)

Prior to releasing build updates, perform these operational checks on all 8 modules:

### 🧭 HUD / Navigation
- [ ] Frame loads cleanly over active gameplay scene without mouse-blocking filters.
- [ ] Dynamic values auto-format large integers cleanly (e.g. `500,000` is rendered as `500K`).
- [ ] Map toggle swaps text correctly between city view and world map modes.

### 💎 Store
- [ ] Side tabs filter the active grid layout instantly.
- [ ] Clicking checkout opens `PurchasePopup` detailing item values.
- [ ] Confirming checkout deducts funds and grants items safely.

### 📬 Mail
- [ ] Unread badges hide correctly once a message has been clicked.
- [ ] Mass clear buttons safely delete read, reward-claimed envelopes.
- [ ] Reports tab properly renders multi-page layouts.

### 📜 Quests
- [ ] Story milestone list items scroll cleanly on mobile dimensions.
- [ ] Daily activity bar correctly highlights and unlocks tiered chests.
- [ ] Claims updates objective states correctly.

### 🧙 Heroes
- [ ] Hero list populates thumbnail panels.
- [ ] Detail card transitions tabs (Attributes, Skills, Bio) seamlessly.
- [ ] Clicking skill items displays descriptions correctly.

### 🎒 Bag / Inventory
- [ ] Category tabs correctly filter item groups.
- [ ] Confirming item usage grants expected resources or currencies.
- [ ] Detail panels close when tapping outside the modal.

### 🤝 Alliance
- [ ] Member list ranks players by status and contribution points.
- [ ] Tech upgrade progress scales correctly upon making donations.
- [ ] Claim buttons collect gifts and clear indicators seamlessly.

### ⚙️ Settings & Player Profile
- [ ] Sound slider adjustments map to decibel volumes.
- [ ] Settings save automatically upon closing.
- [ ] Stats card loads coordinates and stats logs accurately.

---

## 10. KNOWN LIMITATIONS

These modules are optimized to run **offline** or **online**. In standalone mode, the following systems run on simulated memory states:
- **Real-Time Database Persistence:** Multi-player guild syncing and mailbox sync states are managed locally inside memory tables (`inventory_db`, `unclaimed_mail`). Connecting to online APIs will require hooking up WebSocket or REST endpoints.
- **Asset Swapping:** Textures and profile avatars are simulated using high-quality SVG characters and standardized emojis. You can replace these icons with custom sprite graphics assets.
- **Direct Currency Checkout:** Real-money microtransactions are simulated. Checkout confirm buttons directly invoke simulated asset-granting functions.

---

## 11. FUTURE IMPLEMENTATION ROADMAP

Upon finishing the integration of the UI modules, we recommend building the game mechanics in this order:

```
1. BUILDINGS ──► 2. RESEARCH ──► 3. SOLDIER TRAINING ──► 4. MARCHES ──► 5. WORLD WILDLINGS
                                                                                 │
                                                                       6. COMBAT SIMULATIONS
```

1. **City Buildings Layer:** Build resource production ticks (farmland woodcutter yards) and store capacities.
2. **Academy Research:** Wire stat upgrades (e.g. Training Speed Up) to alter army stats.
3. **Barracks & Troops:** Track army numbers and food maintenance levels.
4. **Army Marches Map:** Plot paths across coordinates on the map.
5. **Wildlings Spawning:** Spawn targets across coordinates for marching armies.
6. **Combat Simulations:** Resolve battle results dynamically and send battle logs directly to the player's mailbox.

---

## 11.5. INTEGRATING THE DYNAMIC BUILDING UPGRADE WINDOW

The official Crownspire building upgrade window utilizes the caching system loaded inside `UIManager.gd` under `/root/UIManager`. Follow these parameters to wire it to physical world map structures:

### A. How to open the window dynamically
Preload the scene inside your central viewport controller or `WorldRoot.gd`:
```gdscript
const UPGRADE_WINDOW_SCENE = preload("res://scenes/BuildingUpgradeWindow.tscn")

# Triggered when clicking any town hall, timber mill, or warehouse structure
func open_building_upgrade(building_id: String) -> void:
    var win = UIManager.open_popup(UPGRADE_WINDOW_SCENE)
    if win:
        win.building_id = building_id
        win.load_building_data()
```

### B. Modifying default upgrade costs
All default cost coefficients, descriptions, current/next bonuses, and levels are read from `/data/buildings.json`. You can modify the starting balances or add custom custom structures directly into that file.

### C. Resource Conversion Rates
In case a user is lacking resources, the window automatically calculates the missing amounts and converts them to premium gem costs under this formula:
- **Food:** 1,000 units per 1 💎
- **Wood:** 1,000 units per 1 💎
- **Stone:** 500 units per 1 💎
- **Iron:** 250 units per 1 💎

Clicking "Finish Now" deducts the required gems from `UIManager.royal_crystals`, fills the player's inventory, upgrades the structure, and displays the celebratory rewards modal.

---

## 12. FINAL SUMMARY

These verified, standalone gameplay modules are engineered to **integrate directly into your existing Crownspire Godot project**. 
- **Do NOT replace the main working codebase.**
- **Do NOT rewrite existing core systems.**
- **Do NOT modify your existing starting main scene.**

Copy the corresponding directory folders (`bag`, `heroes`, `quests`, `mail`, `store`, `alliance`, `settings`, `hud`) into your working repository, link their button click events to your central viewport controllers, and registers autoload arrays within the project manager to unlock full production capabilities.
