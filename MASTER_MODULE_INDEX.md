# 👑 CROWNSPIRE MASTER MODULE INDEX & ARCHITECTURE BIBLE
**Unified Godot 4.6 Engine Catalog & System-by-System Decoupling Guide**

This index is the absolute source of truth for the **Crownspire Godot 4.6** engine structure, UI design standards, data layers, and modular integrations. It lists every active file, identifies deprecated/duplicate systems, and maps how all systems must interface under the centralized core architecture.

---

## 📁 1. Global Autoloads (Singletons)

| File Path | Purpose / Description | Dependencies | Systems Using It | Status | Recommended Action |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/autoload/ui_manager.gd` | Core game state manager, player profile state, resources economy tracker, centralized dialog/popup management, and JSON loader. | JSON data tables | Entire project | **Active (Critical)** | **Keep & Extend** (Integrate beast stats and resource rewards) |
| `/autoload/MailManager.gd` | Manages server mail, player inbox logs, claiming item rewards, and read states. | `UIManager` | All mail modules | **Active** | **Keep** |
| `/autoload/QuestManager.gd` | Tracks state, progression, and claims for Main/Daily/Weekly/Alliance/Intel story quests. | `UIManager` | All quest interfaces | **Active** | **Keep** |
| `/autoload/SettingsManager.gd` | Saves/loads graphics settings, master/music/SFX audio volumes, language configurations. | `UIManager` | Settings menus | **Active** | **Keep** |

---

## 🗺️ 2. Spatial Entities & World Map System (Kingdom View)

| File Path | Purpose / Description | Dependencies | Systems Using It | Status | Recommended Action |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/WorldRoot.tscn`<br>`/WorldRoot.gd` | Absolute coordinate space for Kingdom View. Handles camera panning, zoom limits, touch drag bounds, and child node click dispatch. | `KingdomManager.gd`, `MapCamera2D.gd` | Game HUD routing | **Active (Core)** | **Keep** (Ensure main entry point is aligned) |
| `/KingdomManager.gd` | Controls spatial grid allocation, checking terrain color maps for walkability, and coordinates translation. | `WorldRoot.gd` | World entities spawning | **Active (Core)** | **Keep** (Use to register and instance Lair nodes) |
| `/KingdomSpawnRegion.gd` | Defiles boundary parameters and sector zones for spawning kingdom features. | `KingdomManager.gd` | Spawners | **Active** | **Keep** |
| `/MarchManager.gd` | Handles pathfinding, march velocity calculations, and animation of troop vectors. | `WorldRoot.gd` | All marches | **Active** | **Keep** |
| `/MapCamera2D.gd` | Features inertia scrolling, pinch-to-zoom limits, and smooth focal anchors. | None | `WorldRoot.gd` | **Active** | **Keep** |
| `/MarchIcon.tscn` | 2D visual instance representing active player army moving between coordinates. | `MarchManager.gd` | World Map | **Active** | **Keep** |
| `/PlayerCastleNode.tscn`<br>`/PlayerCastleNode.gd` | Interactive castle node anchoring a player's spatial home and styling skin. | `KingdomManager.gd` | World Map | **Active** | **Keep** |
| `/WildlingNode.tscn`<br>`/WildlingNode.gd` | Coordinate-based SOLO monster patrol anchoring individual level targets. | `WildlingSpawnManager.gd` | World Map | **Active** | **Keep** |
| `/WildlingSpawnManager.gd` | Manages random generation and coord scanning for Solo Wildling nodes. | `KingdomManager.gd` | World Map | **Active** | **Keep** |
| `/ResourceNode.tscn`<br>`/ResourceNode.gd` | Spatial resource veins (Gold, Food, Wood, Stone, Iron) enabling troop harvesting. | `ResourceSpawnManager.gd` | World Map | **Active** | **Keep** |
| `/ResourceSpawnManager.gd` | Coordinates density and tier mapping for spatial resource deposits. | `KingdomManager.gd` | World Map | **Active** | **Keep** |
| `/AllianceBuildingNode.tscn`<br>`/AllianceBuildingNode.gd` | Dynamic spatial fortresses, towers, and resource refineries representing territorial dominance. | `KingdomManager.gd` | World Map | **Active** | **Keep** |
| `/ObjectiveNode.tscn`<br>`/ObjectiveNode.gd` | Ancient world monuments and holy cities triggering scheduled alliance conquest capture cycles. | `KingdomManager.gd` | World Map | **Active** | **Keep** |

---

## 👹 3. Ancient Beast Lair System (Alliance Rallies)

| File Path | Purpose / Description | Dependencies | Systems Using It | Status | Recommended Action |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/AncientBeastLair.tscn`<br>`/AncientBeast.gd` | Massive coordinates object displaying ancient ruins, glowing runes, and magical mist. Launches detail panel on click. | `KingdomManager.gd`, `/data/ancient_beasts.json` | World Map | **Active (New)** | **Keep** (Integrate directly to `KingdomManager` spawns) |
| `/AncientBeastPanel.tscn`<br>`/AncientBeastPanel.gd` | Lair Details View: presents boss name, portrait, power index, stamina costs, and levels 1-30 slider. | `UIManager`, `/data/ancient_beast_levels.json` | Lair Interaction | **Active (New)** | **Keep** (Align UI theme with White Marble/Royal Gold) |
| `/AncientBeastScoutPanel.tscn`<br>`/AncientBeastScout.gd` | Scout View: breaks down elemental strengths, tactical weaknesses, counters, and estimated drops. | `UIManager`, `/data/ancient_beasts.json` | Lair Panel | **Active (New)** | **Keep** |
| `/AncientBeastRallyPanel.tscn`<br>`/AncientBeastRally.gd` | Rally Coordinator: alliance cooperative lobby displaying countdown timers and joined marches roster. | `UIManager`, `/scenes/AllianceRallyPanel.tscn` | Lair Panel | **Active (New)** | **Keep** |
| `/AncientBeastRewardsPopup.tscn`<br>`/AncientBeastRewards.gd` | Victory Claims Popup: high-fidelity chest unlocker highlighting crafting resources and beast essences. | `UIManager`, `/data/ancient_beast_rewards.json` | Rally Resolution | **Active (New)** | **Keep** |

---

## 🎮 4. Core UI & Reusable Design Standard

| File Path | Purpose / Description | Dependencies | Systems Using It | Status | Recommended Action |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/scenes/BuildingUpgradeWindow.tscn`<br>`/scripts/BuildingUpgradeWindow.gd` | The OFFICIAL Crownspire UI/UX template standard. Houses white marble panels, gold trims, blue crystals, and glowing fonts. | `UIManager` | Reference standard | **Active (Reference)** | **Keep** (Duplicate container structure for all new modals) |
| `/scenes/GameHUD.tscn`<br>`/scripts/GameHUD.gd` | Top screen stats overlay (currencies, VIP indicators) and bottom navigation anchors. | `UIManager` | Core game flow | **Active** | **Keep & Interface** |
| `/scenes/WorldMapView.tscn`<br>`/scripts/WorldMapView.gd` | Primary layout wrapper managing UI menus overlaid upon active World Map coordinates. | `WorldRoot.tscn` | World Map state | **Active** | **Keep** |
| `/scenes/CityView.tscn`<br>`/scripts/CityView.gd` | Inside-the-walls city view coordinator linking individual functional structures (Tavern, Academy). | `UIManager` | City state | **Active** | **Keep** |
| `/scenes/AllianceScreen.tscn`<br>`/scripts/AllianceScreen.gd` | Full-screen Alliance hub linking help logs, technology donations, gifts, and rallies. | `UIManager` | Alliance systems | **Active** | **Keep** |
| `/scenes/HeroScreen.tscn`<br>`/scripts/HeroScreen.gd` | Hero index tracking level-up cards, skill unlocking boards, and gear equipment slots. | `UIManager`, `heroes.json` | Hero collection | **Active** | **Keep** |
| `/scenes/BagScreen.tscn`<br>`/scripts/BagScreen.gd` | Basic persistent inventory card grids. | `UIManager` | Inventory management | **Duplicate** | **Merge** (Deprecate in favor of modular `/bag/`) |
| `/scenes/Store.tscn`<br>`/scripts/Store.gd` | Legacy storefront grid showing shop lists. | `UIManager` | In-app purchases | **Duplicate** | **Merge** (Deprecate in favor of modular `/store/`) |

---

## 🧩 5. Modular Subsystems & Decoupled Packages

### 💎 Crystal Vault Match-3 (Stand-alone Package)
*These modules represent a highly complex, completely isolated gameplay loop. They must not be modified or combined with standard map coordinates except to claim resources.*
* `/crystal_vault/CrystalVaultBuilding.tscn` / `/crystal_vault/CrystalVaultBuilding.gd` - Interlock entry node.
* `/crystal_vault/CrystalVaultLobby.tscn` / `/crystal_vault/CrystalVaultLobby.gd` - Arena, beast trial, and puzzle lobby UI.
* `/crystal_vault/PuzzleBoard.tscn` / `/crystal_vault/PuzzleBoard.gd` - Central match-3 grid containing tile swappers.
* `/crystal_vault/Tile.tscn` / `/crystal_vault/Tile.gd` - Match-3 modular crystals.
* `/crystal_vault/CVArenaManager.gd` / `/crystal_vault/CVCombatManager.gd` - Specialized gameplay logic loop algorithms.
* `/crystal_vault/CVDataManager.gd` / `/crystal_vault/CVSaveManager.gd` - Local storage registers for match-3 puzzle configurations.
* **Status:** **Active (Highly Critical)** | **Action: Maintain Complete Isolation.**

### 🎒 Modular Inventory Package
* `/bag/scenes/BagPopup.tscn` / `/bag/scripts/BagPopup.gd` - Fully styled, responsive inventory screen showing categories, filters, and use-item buttons.
* `/bag/scenes/InventoryItemCard.tscn` - Grid slot item with rarity backgrounds and quantity badges.
* `/bag/scenes/ItemDetailPanel.tscn` - Right-side detailed description window matching the White Marble standard.
* **Status:** **Active (Modular Standard)** | **Action: Keep & Link standard item uses here.**

### 🛒 Modular Storefront Package
* `/store/scenes/StorePopup.tscn` / `/store/scripts/StorePopup.gd` - High-fidelity storefront hosting daily free claims, limited-time discount cards, and currency packages.
* `/store/scenes/StoreItemCard.tscn` - Interactive shop card rendering coin costs and reward bundles.
* `/store/scenes/PurchasePopup.tscn` - Secure checkout verification pane.
* **Status:** **Active (Modular Standard)** | **Action: Keep & Anchor standard shop routing here.**

### 📬 Modular Mailbox Package
* `/mail/scenes/MailPopup.tscn` / `/mail/scripts/MailPopup.gd` - High-fidelity mailbox tab separating system messages, combat coordinate logs, and alliance updates.
* `/mail/scenes/MailDetailPanel.tscn` - Expanded message visualizer with claim attachments lists.
* `/mail/scenes/MailListItem.tscn` - Card representing individual mail with read/unread visual styles.
* **Status:** **Active (Modular Standard)** | **Action: Keep & Route rally reports here.**

### 🤝 Modular Alliance Package
* `/alliance/scenes/AlliancePopup.tscn` / `/alliance/scenes/AllianceDetailPanel.tscn` - High-fidelity collaborative hub with active roster rosters, ranks, help-click trackers, and gift boxes.
* **Status:** **Active (Modular Standard)** | **Action: Keep & Route Beast Rallies here.**

---

## 🚫 6. Deprecated & Redundant Root duplicates
*The following root-level duplicate files exist from parallel implementations and must be safely bypassed or ignored during system-to-system integrations:*
* `Bag.tscn` / `Bag.gd` *(Duplicate of `/bag/scenes/BagPopup.tscn`)* - **Duplicate / Ignore.**
* `Shop.tscn` / `Shop.gd` *(Duplicate of `/store/scenes/StorePopup.tscn`)* - **Duplicate / Ignore.**
* `Alliance.tscn` / `Alliance.gd` *(Duplicate of `/alliance/scenes/AlliancePopup.tscn`)* - **Duplicate / Ignore.**
* `Settings.tscn` / `Settings.gd` *(Duplicate of `/scenes/settings/SettingsScreen.tscn`)* - **Duplicate / Ignore.**
* `SummonScene.tscn` / `SummonScene.gd` *(Duplicate of `/src/components/SummonSceneModal.tsx` / Obsolete)* - **Ignore.**
* `EquipmentScene.tscn` / `EquipmentScene.gd` *(Duplicate of `/scenes/HeroEquipmentPanel.tscn`)* - **Ignore.**
* `VipScene.tscn` / `VipScene.gd` *(Duplicate of `/src/components/VipSystemModal.tsx` / Obsolete)* - **Ignore.**
* `Museum.tscn` / `Museum.gd` *(Duplicate of `/src/components/MuseumCodexModal.tsx` / Obsolete)* - **Ignore.**

---

## 🗄️ 7. Core JSON Database Mapping

All JSON databases reside under `/data/` and dictate properties fed into `UIManager` for in-engine state tracking:

1. **`ancient_beasts.json`** - Roster parameters containing portrait graphics, weaknesses, counters, and base powers for Beta Beasts.
2. **`ancient_beast_lairs.json`** - Coordinate nodes visual mappings, naming types, and particle layouts.
3. **`ancient_beast_levels.json`** - Boss level metrics (Levels 1 to 30) driving health scalars, power indices, and stamina costs.
4. **`ancient_beast_rewards.json`** - Drop probability grids, loot bundles, speedup items, and hero shards.
5. **`ancient_beast_spawn_locations.json`** - Spatially locked locations mapped on the World Map canvas.
6. **`heroes.json`** & **`hero_skills.json`** - Stats, level configurations, bio sheets, and unlocked paths for hero leveling.
7. **`items.json`** - Comprehensive item index for standard inventory operations.
8. **`buildings.json`** - Cost coefficients, building times, and power ratings mapped to City layouts.

---

## ⚖️ 8. Architecture Rules of Engagement

1. **No Duplicate Singletons:** There must only be **one** core global UI controller: `/autoload/ui_manager.gd`. Any state updates must pipe through this script.
2. **Strict Folder Division:** 
   * Global managers live in `/autoload/`.
   * Spatial/map scripts live in the root directory alongside their world objects.
   * Modals and pop-up interfaces live in their respective subfolders (`/bag/`, `/store/`, `/mail/`, `/alliance/`).
3. **Theme Integrity:** Never bundle raw fonts, hex code colors, or borders inline inside newly authored scripts. Reference existing UI controls and mimic the layout metrics verified within `/scenes/BuildingUpgradeWindow.tscn`.
