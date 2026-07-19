# Crownspire Mobile MMO — Quality Assurance Integration Checklist

This QA Checklist contains precise test cases and mobile-specific validation scenarios to verify the functional integrity, visual fidelity, responsive scaling, and state persistence of the ten integrated gameplay modules.

---

## Module 1: Master HUD & UI Overlay

| Test ID | Test Scenario | Inputs/Action | Expected Behavior | Status |
| :--- | :--- | :--- | :--- | :--- |
| **HUD-01** | Power Rating Abbreviation | Upgrade hero or building, increasing global power over 1,000,000. | Label automatically formats long integers into clean, readable notation (e.g., `1,254,300` -> `1.25M`). | [ ] PASS |
| **HUD-02** | Top Resource Lerp | Trigger a resource deposit (e.g., collect wood). | Numbers slide up using dynamic visual counting, expanding the resource icon slightly with a subtle scale pulse tween. | [ ] PASS |
| **HUD-03** | Viewport Swapping | Click the **World** or **City** button on the bottom bar. | The HUD background panels transition between City View citadel and World hex grid with a smooth opacity cross-fade. | [ ] PASS |

---

## Module 2: City View (Citadel Core)

| Test ID | Test Scenario | Inputs/Action | Expected Behavior | Status |
| :--- | :--- | :--- | :--- | :--- |
| **CTY-01** | Idle Resource Harvesting | Let the game idle for 30s, then click the **Collect** button above a farm/lumber mill. | Gained provisions are added to the top resource bar, and a congratulations toast slides onto the HUD showing the exact quantity. | [ ] PASS |
| **CTY-02** | Barracks Troop Training | Open Barracks, select Legionary recruits, and click **Train**. | Deducts food/wood/iron from wallets, starts the training timer, and adds points directly to the active training Daily Quest. | [ ] PASS |
| **CTY-03** | Academy Tech Upgrading | Open Academy, research **Crystallite Siphoning**, click **Research**. | Checks resources, deducts gold/materials, upgrades tech level, increases global kingdom power, and triggers progress milestones. | [ ] PASS |

---

## Module 3: World Map (Hex Wilderness)

| Test ID | Test Scenario | Inputs/Action | Expected Behavior | Status |
| :--- | :--- | :--- | :--- | :--- |
| **WLD-01** | PvE Monster Engagement | Locate a Ruined Keep on the hex map, select high-tier heroes, dispatch march. | Launches an active expedition march, adding a real-time progress bar to the top-right of the HUD. | [ ] PASS |
| **WLD-02** | Expedition Return | Wait for the march dispatch timer to expire and return. | Expedition rewards (shards, gold, timber) are deposited in the inventory, triggering a celebratory loot drop toast. | [ ] PASS |

---

## Module 4: Hero System (Roster Core)

| Test ID | Test Scenario | Inputs/Action | Expected Behavior | Status |
| :--- | :--- | :--- | :--- | :--- |
| **HER-01** | Level-Up XP Potions | Open Hero Detail, select Maegan, feed **XP Potion**. | Potions are consumed, XP slider increments, and the hero's power is recalculated. Upon level cap, level increases. | [ ] PASS |
| **HER-02** | Star Ascension | Gather Maegan shards over requirements, click **Ascend**. | Shards are consumed, star rank increases (e.g., 3-star -> 4-star), level cap increases by 5 levels, and global power spikes. | [ ] PASS |
| **HER-03** | Gear Forging | Select an equipment slot, upgrade with iron/gold. | Materials are deducted, gear level increases, and stat multipliers (e.g., +15% Health) apply to the hero's combat rating. | [ ] PASS |

---

## Module 5: Bag / Inventory

| Test ID | Test Scenario | Inputs/Action | Expected Behavior | Status |
| :--- | :--- | :--- | :--- | :--- |
| **BAG-01** | Category Sorting | Tap between **Speedups**, **Combat**, **Buffs**, and **Resources**. | Filter grid immediately redraws, hiding irrelevant inventory items. | [ ] PASS |
| **BAG-02** | Consumable Item Consumption | Select a **50K Wood Chest**, adjust quantity to 5, click **Use**. | Wood chests are consumed from the inventory, and 250,000 Wood is added to the strategy resource bar. | [ ] PASS |

---

## Module 6: Alliance System

| Test ID | Test Scenario | Inputs/Action | Expected Behavior | Status |
| :--- | :--- | :--- | :--- | :--- |
| **ALL-01** | Technology Donation | Open Alliance tech, donate 5,000 Gold to **Aegis Shields**. | Increases alliance research experience points, increments the player's Alliance Honor wallet, and registers progress. | [ ] PASS |
| **ALL-02** | Member Help Desk | Open Alliance Help panel, tap **Help All**. | Clears active help requests from guildmates, awarding the player 100 honor points per assist. | [ ] PASS |

---

## Module 7: Monetary Store

| Test ID | Test Scenario | Inputs/Action | Expected Behavior | Status |
| :--- | :--- | :--- | :--- | :--- |
| **STR-01** | Purchase Confirmation | Click on the **Growth Fund Bundle**, verify details in the purchase popup. | Purchase popup lists items,USD cost, and provides custom warning checks. On click, items are awarded. | [ ] PASS |
| **STR-02** | Crystal Geode Exchange | Spend 500 Royal Crystals on **8-Hour Peace Shield**. | Deducts crystals from balance, updates top HUD wallet, and deposits peace shields directly in the inventory Bag. | [ ] PASS |

---

## Module 8: Mail / Inbox

| Test ID | Test Scenario | Inputs/Action | Expected Behavior | Status |
| :--- | :--- | :--- | :--- | :--- |
| **MAL-01** | Attachment Claiming | Open a Battle Report mail with gold attachments, click **Claim**. | Attachments disappear, Mail claimed flag is set to true, and gold coins are credited to player balances. | [ ] PASS |
| **MAL-02** | Bulk Deletion | Open Inbox, click **Delete All Read**. | Deletes all read mail items from index, ignoring read mail items that still have unclaimed rewards attached. | [ ] PASS |

---

## Module 9: Quest Board

| Test ID | Test Scenario | Inputs/Action | Expected Behavior | Status |
| :--- | :--- | :--- | :--- | :--- |
| **QST-01** | Duty Chest Milestone | Complete daily duties to exceed 100 points, click **Milestone Chest**. | Chest opens with chest shake, awarding premium rewards and crystals via global celebration popup. | [ ] PASS |
| **QST-02** | Navigation Quick-Jump | Click **Go** on the "Train 100 Troops" quest row. | Closes the Quest Board, slides open the Barracks panel, and centers focus on the recruitment module. | [ ] PASS |

---

## Module 10: Settings & Player Profile

| Test ID | Test Scenario | Inputs/Action | Expected Behavior | Status |
| :--- | :--- | :--- | :--- | :--- |
| **SET-01** | Lord Name Customization | Open Player Profile, edit name to "High King", click **Confirm**. | Validation checks name length. Saves change, and updates HUD, Alliance chat, and profiles with new label. | [ ] PASS |
| **SET-02** | Promo Code Redemption | Open Redeem Code panel, enter code **CROWNSPIRE2026**. | Redeems successfully, awards 1,000 Royal Crystals, and displays a celebration award window. | [ ] PASS |
| **SET-03** | Audio Server Muting | Slide Master Volume down to 0%. | Triggers AudioServer mute bus command, silencing music and sfx tracks. | [ ] PASS |
