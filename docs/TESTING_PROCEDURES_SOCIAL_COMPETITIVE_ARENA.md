# Crownspire Social & Competitive Arena Testing Procedures Manual (V1.0)

This manual provides detailed verification routines and QA checklist operations to validate the **Social & Competitive Arena Hub** added to the Crownspire Crystal Vault.

---

## 1. File and Compilation Verification
Confirm the following files build without compilation or linter warnings:
1. `/src/components/CrystalVaultSocialCompetitiveTab.tsx` (Core social modules, brackets, spectator simulation, and profile managers).
2. `/src/components/CrystalVaultTab.tsx` (Updated tab list routing user click events to the Social Hub).

Verify by running `npm run lint` or compiling with Vite.

---

## 2. Test Cases and Scenarios

### Test Case 1: Multi-Filter Leaderboard Navigation
*   **Objective:** Confirm correct navigation through the six custom score categories.
*   **Procedure:**
    1. Click on the **Social & Tourneys** tab in the main header navigation.
    2. Under the left panel list, toggle through each category:
        *   **Global Standings**
        *   **Kingdom Influence**
        *   **Alliance Citadels**
        *   **Friend Rankings**
        *   **Speedrun Completion**
        *   **Endless Floor Records**
    3. Observe that the right table title, headers, and rows reload instantly.
    4. Confirm that your own Guardian row (`Your Guardian (You)`) remains pinned to the top of each list as `#24`.
*   **Expected Outcome:** Fluent tab-switching with high-contrast, fully aligned data rows reflecting the active category filters.

---

### Test Case 2: Brackets League & Match Simulation
*   **Objective:** Validate that pending bracket matches can be simulated and resolved.
*   **Procedure:**
    1. Click on the **Tournaments & Leagues** tab inside the Social & Tourneys view.
    2. Find the match labeled **Round of Semifinals** showing `Your Guardian (You)` vs. `Archmage Kaelthas` in a pending state.
    3. Click the purple button labeled **⚔️ Simulate Match**.
    4. Verify that:
        *   The button vanishes.
        *   Randomized match scores appear (e.g. `2340` to `1920`).
        *   The left-hand match outcome highlights the winner in bold green text.
        *   The combat ledger in the sidebar prints a log event reflecting your victory!
*   **Expected Outcome:** Successful state update transitioning the match to "completed" and writing record results.

---

### Test Case 3: Interactive Saved Replay Theater
*   **Objective:** Test the playback control sequence of the Match-3 Replay Viewer.
*   **Procedure:**
    1. Select the **Replays & Live Spectating** tab.
    2. Confirm the display defaults to **Interactive Replay Theater**.
    3. View the 5x5 preview board. Inspect the step log below the board.
    4. Click **PLAY REPLAY** to start automated stepping. Observe that every 3.5 seconds:
        *   The board tiles shift in a custom cascading sequence.
        *   The step count increments (e.g., `STEP: 2 / 4`).
        *   The action description updates with technical logs (e.g., "Matched 4 Astral Stars horizontally").
        *   An audit sound cue is registered in the sidebar log.
    5. Click **PAUSE AUTO** to halt the loop. Step through manually using the **Chevron Left** and **Chevron Right** buttons.
*   **Expected Outcome:** Dynamic tile updates and step counters reflecting exact strategic logs.

---

### Test Case 4: Live Spectating & Audience Chat Simulation
*   **Objective:** Verify real-time board updates and comment additions.
*   **Procedure:**
    1. Under the **Replays & Live Spectating** tab, click **Go Spectate Live** in the top right.
    2. Observe the board title transitions to **🔴 LIVE SPECTATING: Sovereign Run**.
    3. Watch the board shuffle automatically every 4 seconds, indicating active play by Emperor Theron.
    4. Look at the **Audience Chat Feed** on the right. Note that simulated viewers (e.g., `Knight_Aethel`, `FoxyPuzzler`) append messages detailing the action.
    5. Type a custom message in the input block (e.g., "Incredible cascade!") and press the **Send** button.
    6. Confirm your message instantly appears at the bottom of the feed highlighted in amber-gold bold text, and a logs record is stored.
*   **Expected Outcome:** Continuous spectator loop with persistent active input validation.

---

### Test Case 5: Achievements Tracking & Reward Claiming
*   **Objective:** Test simulation and redemption of completed milestones.
*   **Procedure:**
    1. Go to the **Guardian Progression & Stats** tab.
    2. Click the button labeled **🧪 Run Achievement Sim** in the top right.
    3. Observe the progress bars of uncompleted achievements incrementing. If any reach `100%`:
        *   A prominent gold **Claim Achievement Rewards** button appears.
    4. Click the claim button on a completed achievement.
    5. Confirm that:
        *   A green checkmark `✓ Claimed & Unlocked` appears.
        *   Your points are added, causing the custom SVG progress chart on the left to scale upwards.
        *   A triumph message prints to the main ledger.
*   **Expected Outcome:** Flawless calculation of points, visual state locked status, and chart growth.

---

### Test Case 6: Title & Badge Equipment Swapping
*   **Objective:** Validate that active cosmetic titles and badge seals can be hot-swapped.
*   **Procedure:**
    1. Under the **Guardian Progression & Stats** tab, find the **Unlocked Titles** and **Unlocked Badges** sections.
    2. Click on **Brimstone Shatterer** in the titles list.
    3. Verify that:
        *   The active title displays as **Brimstone Shatterer** in the top hub status bar.
        *   A success log is registered.
    4. Click on **Temporal Crest** under badges.
    5. Verify that the badge status updates in the top bar to **Temporal Crest** with its corresponding colors.
*   **Expected Outcome:** Instant client cosmetics updates bound to persistent local state.

---

### Test Case 7: Hall of Fame Monuments Viewing
*   **Objective:** Verify historic pedestal displays.
*   **Procedure:**
    1. Select the **Hall of Fame Monuments** tab.
    2. Review the three pedestals for Season I, II, and III. Hover/inspect to verify consistent rendering of character frames and lore inscriptions.
*   **Expected Outcome:** Beautiful, clean medieval-themed visual museum elements aligning perfectly with the Crownspire design language.
