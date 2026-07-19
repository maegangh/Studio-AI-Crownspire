# Crownspire Mobile MMO — Module Dependency Report

This report outlines the comprehensive structural, script-level, and asset-level dependency maps across all ten integrated modules. Use this map to trace connections, verify asset packaging, and avoid broken references during deployment.

---

## 1. Scene-to-Scene Dependency Tree (UI Hierarchy)

Below is the instancing and preloading tree showing which master scenes orchestrate secondary popups or sub-views:

```text
GameHUD.tscn (Master Canvas Layer)
├── PlayerProfile.tscn (Instanced HUD Widget)
│   └── PlayerProfileScreen.tscn (Popup - Preloaded on Profile Click)
├── TopResourceBar.tscn (Instanced HUD Widget)
├── QuestTracker.tscn (Instanced HUD Widget)
│   └── QuestScreen.tscn (Popup - Preloaded on Tracker Click)
├── NotificationManager.tscn (Instanced HUD Widget)
├── FloatingButtons.tscn (Instanced HUD Widget)
│   ├── Store.tscn (Popup - Preloaded on Shop Click)
│   │   ├── CurrencyBar.tscn (Instanced Sub-component)
│   │   ├── StoreTabBar.tscn (Instanced Sub-component)
│   │   ├── StoreHome.tscn (Instanced Sub-component)
│   │   │   ├── FeaturedBanner.tscn (Instanced Card)
│   │   │   ├── LimitedOfferCard.tscn (Instanced Card)
│   │   │   └── BundleCard.tscn (Instanced Card)
│   │   └── PurchasePopup.tscn (Popup - Preloaded on Item Purchase)
│   └── SettingsScreen.tscn (Popup - Preloaded on Settings Click)
│       ├── AudioSettingsPanel.tscn (Instanced Panel)
│       ├── GraphicsSettingsPanel.tscn (Instanced Panel)
│       ├── GameplaySettingsPanel.tscn (Instanced Panel)
│       ├── NotificationSettingsPanel.tscn (Instanced Panel)
│       ├── LanguageSettingsPanel.tscn (Instanced Panel)
│       ├── AccountSettingsPanel.tscn (Instanced Panel)
│       ├── PrivacySettingsPanel.tscn (Instanced Panel)
│       ├── SupportPanel.tscn (Instanced Panel)
│       ├── RedeemCodePanel.tscn (Instanced Panel)
│       ├── CreditsPanel.tscn (Instanced Panel)
│       └── AboutPanel.tscn (Instanced Panel)
└── BottomNavigation.tscn (Instanced HUD Widget)
    ├── CityButton.tscn (Instanced Component) -> CityView.tscn (Swapped into viewport)
    ├── WorldButton.tscn (Instanced Component) -> WorldMapView.tscn (Swapped into viewport)
    ├── HeroesButton.tscn (Instanced Component) -> HeroScreen.tscn (Popup - Preloaded)
    ├── AllianceButton.tscn (Instanced Component) -> AllianceScreen.tscn (Popup - Preloaded)
    ├── EventButton.tscn (Instanced Component) -> LiveOpsDashboard.tscn (Popup - Preloaded)
    └── MailButton.tscn (Instanced Component) -> MailScreen.tscn (Popup - Preloaded)
```

---

## 2. Script-to-Script Cross-References

Modular boundaries are strictly enforced. Scripts rely on global autoloads and signals to communicate. Hard-coded preloads are strictly confined to instancing sub-panels:

*   **`GameHUD.gd`**:
    *   Preloads `res://scenes/CityView.tscn` (City Mode)
    *   Preloads `res://scenes/WorldMapView.tscn` (Wilderness Mode)
    *   Preloads `res://scenes/HeroScreen.tscn` (Hero Roster popup)
*   **`FloatingButtons.gd`**:
    *   Preloads `res://scenes/Store.tscn`
    *   Preloads `res://scenes/settings/SettingsScreen.tscn`
*   **`BottomNavigation.gd`**:
    *   Communicates entirely via `signal navigation_selected(view_name)` to decouple HUD viewport routing.
*   **`AllianceButton.gd`**:
    *   Preloads `res://scenes/AllianceScreen.tscn`
*   **`MailButton.gd`**:
    *   Preloads `res://scenes/mail/MailScreen.tscn`
*   **`EventButton.gd`**:
    *   Preloads `res://scenes/LiveOpsDashboard.tscn`
*   **`PlayerProfile.gd`**:
    *   Preloads `res://scenes/settings/PlayerProfileScreen.tscn`

---

## 3. Core Theme & Shared Resource Dependencies

Centralized aesthetic parameters ensure UI consistency:

1.  **Central Style Theme**: `res://ui_theme.tres`
    *   Used by *every* container panel, scrollbar, tab, and label class.
    *   Defines default margins, corner roundness, flat gradients, and font colors.
2.  **Typography**:
    *   Display Headings: *Inter* and *Space Grotesk*
    *   Status Badges and Timers: *JetBrains Mono* (monospaced to avoid ticking jitter)
3.  **Required Assets (Textures/Frames)**:
    *   Panel Slices: `res://assets/ui/containers/bg_base_dark.png`
    *   Back Buttons: `res://assets/ui/buttons/btn_back_normal.png`
    *   Rarity Bands (Rarity 1 to 5):
        *   Common: `res://assets/ui/frames/frame_rarity_common.png`
        *   Uncommon: `res://assets/ui/frames/frame_rarity_uncommon.png`
        *   Rare: `res://assets/ui/frames/frame_rarity_rare.png`
        *   Epic: `res://assets/ui/frames/frame_rarity_epic.png`
        *   Legendary: `res://assets/ui/frames/frame_rarity_legendary.png`
    *   Currency Badges:
        *   Royal Crystals: `res://assets/ui/icons/currency_royal.png`
        *   Aurora Crystals: `res://assets/ui/icons/currency_aurora.png`
        *   Gold Coins: `res://assets/ui/icons/currency_gold.png`
        *   Alliance Honor: `res://assets/ui/icons/currency_alliance.png`

---

## 4. Save/Load File Path Handlers

The game modules persist active state inside standard sandbox locations using JSON strings:

*   **Ruler Wallets, Bag Inventory, Hero Levels, City Buildings, Active Marches, Campaign/Quest Milestone Claims**:
    *   Saves to: `user://crownspire_player_state.save`
*   **User Preferences, Graphic Scales, Master Audio Decibels, Active Customization Equips (Avatar, Frame, Titles)**:
    *   Saves to: `user://crownspire_settings_state.save`
*   **Mail Inbox, Read/Unread flags, Claimed attachments, System updates**:
    *   Saves to: `user://crownspire_mail_state.save`
*   **Completed Quest Archives & Progress History Logs**:
    *   Managed by `QuestManager` directly in `user://crownspire_quests_state.save` (or bridged with player state).
