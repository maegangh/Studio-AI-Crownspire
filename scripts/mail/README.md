# Crownspire Mail System Module

A complete, production-ready, highly stylized portrait (720x1280) Mail module built specifically for **Crownspire**.

## Core Features

- **Data-Driven Architecture**: Fully integrated with custom JSON databases. No mail, battle, or rewards logic is hardcoded.
- **Dynamic Category Separation**: Support for standard inbox filters: All Mail, System Announcements, Combat Logs, Alliance Communications, and Event Placements.
- **Rich Battle Reports**: Custom styling and layout logic parsing PvP, PvE Wildlings, resource gathering expeditions, scout alerts, and Crystal Vault trial completions. Features interactive stat grids (Winner/Loser, coordinates, power levels, troop losses, plundered resources).
- **Celebratory Reward Systems**: Multi-item secure claiming. Programmatically delivers gold, crystals, alliance coins, VIP points, equipment, speedups, and hero shards straight into player containers via `UIManager` hooks. Displays a premium, gacha-style rewards collection popup with stagger entrance scale animations.
- **Advanced Searching, Filtering & Sorting**: Text search queries debounced automatically at 250ms for performance, paired with filter menus (Unread, Claimable, Wins, Losses) and date sorting (Newest, Oldest, Expiring).
- **State Persistence & Saving**: Read/unread states, claimed status, deleted logs, and active expiration timers are saved to JSON format at `user://crownspire_mail_state.save` surviving restarts.
- **Responsive Portrait Design**: Fully touch-friendly with modular, nested sub-panels. Optimized layout matching the dark crystal royal slate theme.

---

## File Manifest

All of the following files are crafted to plug-and-play directly with the main Godot project.

### Scenes (`res://scenes/mail/`)
1. `MailScreen.tscn` - Main screen overlay frame.
2. `MailCategoryTabs.tscn` - Highlighted tab selection buttons.
3. `MailListPanel.tscn` - Scrollable item layout container.
4. `MailCard.tscn` - Summary mail list item with status dots, expiration warners, and gifts.
5. `MailDetailPanel.tscn` - Expanded mail text and rich combat log panels.
6. `MailAttachmentPanel.tscn` - Item attachment cell matrix.
7. `MailAttachmentPanelItem.tscn` - Cell layout rendering emoji or TextureRect paths with claim overlays.
8. `MailRewardPopup.tscn` - Gacha celebratory claim popup.
9. `MailNotificationBadge.tscn` - Red unread circular counts.
10. `MailDeletePopup.tscn` - Multi-action single/bulk deletion modals.
11. `MailFilterMenu.tscn` - Dropdown drawer selectors.
12. `MailEmptyState.tscn` - Dynamic zero-match graphics and context descriptors.

### Scripts (`res://scripts/mail/`)
1. `MailManager.gd` - Engine, queries, file I/O, state persistence, reward delivery (Now updated as an Autoload Node).
2. `MailScreen.gd` - Panel coordinator and bulk actions driver.
3. `MailCategoryTabs.gd` - Tab toggle logic and unread indicators.
4. `MailSearchBar.gd` - Input handler and typing debouncer.
5. `MailFilterMenu.gd` - Dropdown toggle and input capture.
6. `MailListPanel.gd` - Card manager and stagger entrance animator.
7. `MailCard.gd` - Summary metadata card renderer.
8. `MailDetailPanel.gd` - Message reader and combat log statistics parser.
9. `MailAttachmentPanel.gd` - Attachments grid builder.
10. `MailAttachmentPanelItem.gd` - Individual cell handler (supporting emojis & graphics).
11. `MailRewardPopup.gd` - Celebratory animations player.
12. `MailNotificationBadge.gd` - Unread pulse animator.
13. `MailDeletePopup.gd` - Modal callback binder.
14. `MailEmptyState.gd` - Empty description formatter.
15. `README.md` - Integration and merge instructions.

### Data (`res://data/mail/`)
1. `mail_categories.json` - Folder metadata.
2. `mail_templates.json` - Dynamic alliance rally, gifts, and scout hawk templates.
3. `system_mail.json` - Default Council dispatches, maintenance rewards, support replies.
4. `event_mail.json` - Default live tournament logs.
5. `battle_reports.json` - Default PvP, Wildling, gathering, and vault logs.

### Modified Existing Files
- `res://scripts/MailButton.gd` - Hooked up to query `MailManager.get_unread_count("all")`, updates unread dot on panel closes, and opens `MailScreen.tscn`.

---

## Integration Guide

To merge this Mail Module into the main Crownspire project, follow these simple integration steps:

### 1. File Setup
Extract the clean ZIP package directly into your Godot project's root folder (`res://`). This will populate:
* `res://scenes/mail/`
* `res://scripts/mail/`
* `res://data/mail/`
* `res://scripts/MailButton.gd` (Overwriting the old placeholder button script)

### 2. Register Autoload Singleton (Crucial)
Because `MailManager` functions as the persistent state engine, saves player configurations, and broadcasts global events, it **MUST** be registered as a Godot Autoload:

1. Open your project in **Godot 4.4.1**.
2. Go to the top menu: **Project -> Project Settings**.
3. Select the **Autoload** tab.
4. In the **Path** input field, click the folder icon and select: `res://scripts/mail/MailManager.gd`.
5. The **Node Name** will auto-populate as `MailManager`.
6. Click the **Add** button.
7. Ensure the **Enabled** checkbox is checked next to `MailManager`.
8. Click **Close** to save settings.

### 3. Usage
* The HUD's `MailButton` is already pre-configured to initialize the database and update unread indicators.
* When pressed, the button opens the main `MailScreen.tscn` using your project's custom `UIManager.open_popup(...)` system.
* Mails, unread counts, claims, and deletions automatically persist in real-time to `user://crownspire_mail_state.save`.
