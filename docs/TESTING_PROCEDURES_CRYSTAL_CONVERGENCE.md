# Crystal Convergence Testing Procedures Manual (V1.0)

This manual provides detailed verification routines and QA checklist operations to validate the **Crystal Convergence Flagship Event** module added to the Crownspire Crystal Vault.

---

## 1. Environment Verification
Ensure the following files are compiled without errors:
1. `/src/components/CrystalVaultConvergenceTab.tsx` (Core Event UI and Altar puzzle board).
2. `/src/components/CrystalVaultTab.tsx` (Main tab navigator referencing the event).

Verify that running `npm run lint` or `npm run build` succeeds seamlessly before initiating user testing.

---

## 2. Test Cases and Scenarios

### Test Case 1: Active 14-Day Timeline Schedule
*   **Objective:** Confirm the visual representation of the bi-weekly schedule and live timers.
*   **Procedure:**
    1. Click on the **Crystal Convergence** tab on the main navigation panel.
    2. Inspect the horizontal timeline grid. Verify that days 1 to 4 are marked with green tick indicators (completed history), Day 5 is marked as **LIVE** with a glowing radar ring, and Days 6–14 are shown as upcoming.
    3. Look at the top right of the event header. Verify that the countdown timer reads `9d 4h 15m` remaining.
*   **Expected Outcome:** High-contrast responsive layout showing an elegant two-week progression matching current live status.

---

### Test Case 2: Seasonal Dynamic Rotation
*   **Objective:** Validate that selecting different event seasons dynamically rotates active metadata (boss and themes).
*   **Procedure:**
    1. Locate the **Season Timeline** selector row.
    2. Click on **S1** (Season I: Altar Genesis). Check that the active raid boss reads `Fenrir Shadowfang` and the theme equips `Prismatic Crystals`.
    3. Click on **S2** (Season II: Glacial Rift). Check that the active raid boss updates to `Aurelius Gold Drake` and the theme changes to `Citadel Standard`.
    4. Click on **S3** (Season III: Pyre Colossus). Check that the active raid boss updates to `Ignis Pyre-Lord` and the theme swaps to `Volcanic Magma`.
*   **Expected Outcome:** Smooth state shifting with console sound simulations logged as success actions in the sidebar ledger.

---

### Test Case 3: Interactive Altar Match-3 Puzzle Board
*   **Objective:** Validate that the overlay tiles can be selected, matched, and yield points and signets correctly.
*   **Procedure:**
    1. Click on **Convergence Altar** subtab.
    2. If the canvas shows dormant, click **Activate Altar Canvas** to load the 3D overlapping layout.
    3. Select unblocked tiles (fully lit, Z1 or non-overlapping cells) and watch them drop into the **Resonance Vessel (Tray)**.
    4. Match three identical runes. Check that:
        *   They vanish from the tray.
        *   Your combo multiplier increases (e.g. `x1` to `x2`).
        *   Your **Signets** (⭐) and **Convergence Points** (👑) increment.
        *   The event log ledger posts the alignment success message.
    5. Test board controls: Click **Scramble Coordinates** to shuffle active layout or **Re-align Board Layers** to start over.
*   **Expected Outcome:** Full gameplay feedback loop including combo multiplier rewards and real-time ledger announcements.

---

### Test Case 4: Mission Actions Simulation
*   **Objective:** Check that all types of objectives (Puzzle, Arena, Beast, Alliance, Kingdom) register progress, and complete successfully.
*   **Procedure:**
    1. Switch to the **Event Missions** subtab or use the fast simulation buttons on the **Dashboard**.
    2. Click **🧪 Run Puzzle Sim**, **⚔️ Run Arena Sim**, **⚔️ Run Beast Sim**, or **🏰 Run Guild Sim**.
    3. Observe the progress bars updating on the corresponding missions (e.g. Solar Core alignment jumps from `15/40` to `25/40`).
    4. Once progress reaches `100%`, verify that the mission displays a bright **Claim Rewards** button.
    5. Click **Claim Rewards**. Check that your total **Signets** and **Convergence Points** balances update on the top bar in real-time, and the mission turns into a static "Claimed ✓" state.
*   **Expected Outcome:** All objectives correctly track mathematical increments and deliver rewards upon user action.

---

### Test Case 5: Milestone Box Redemptions
*   **Objective:** Verify that the Ascendance Progress highway unlocks chest rewards at appropriate point bounds.
*   **Procedure:**
    1. Check your total points (starts at 350).
    2. Verify that the first milestone (200 Pts: Chrono Convergence Lockbox) has a clickable icon or shows unlocked.
    3. Click the chest icon. Inspect that:
        *   The icon is replaced by a green checkmark `✓`.
        *   The ledger outputs "MILESTONE UNLOCKED: Opened Chrono Convergence Lockbox!".
        *   Your signets balance receives the award.
    4. Check that higher milestones (e.g., 1000 Pts, 2000 Pts) remain locked until points are earned through matching or simulation.
*   **Expected Outcome:** Progression-locked reward milestones prevent early claims but reward valid achievements cleanly.

---

### Test Case 6: Cosmetics Shop Bazaar and Skins Swapping
*   **Objective:** Confirm purchasing custom tile-skins or profile frames works and updates tile themes.
*   **Procedure:**
    1. Switch to the **Cosmetic Shop** subtab.
    2. Find the **Prismatic Crystals Theme** or **Volcanic Magma Theme**.
    3. Ensure you have enough signets (complete a few missions to earn more if needed).
    4. Click **Acquire Cosmetic**. Verify that:
        *   Your signets balance is deducted.
        *   The button transitions to **Equip Skin**.
        *   The canvas theme shifts.
    5. Click **Equip Skin**. Check the dashboard tile skins row or reload the **Convergence Altar** board to verify that the tile face emojis and labels updated to the newly acquired visual skin!
*   **Expected Outcome:** Real-time skin swapping that immediately takes effect on the match-3 gameplay canvas.

---

### Test Case 7: Standing Placements (Leaderboards)
*   **Objective:** Check that the player's rankings standings update dynamically on the rankings ledger as points are accumulated.
*   **Procedure:**
    1. Switch to the **Leaderboard** subtab.
    2. Toggle between **Solo Guardians** and **Alliance Citadels**.
    3. Note your ranking position (e.g. `#5 Your Guardian`).
    4. Run a mission simulation or solve altar matches to increase your **Convergence Points** by 500.
    5. Re-check the leaderboard. Verify that your row has jumped up positions, with your points and rank dynamically recalculated!
*   **Expected Outcome:** Standings recalculate in real-time on the rankings board based on earned Points.
