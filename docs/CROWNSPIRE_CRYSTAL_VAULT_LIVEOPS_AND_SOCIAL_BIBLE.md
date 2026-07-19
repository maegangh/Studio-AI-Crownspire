# CROWNSPIRE: THE CRYSTAL VAULT LIVEOPS & SOCIAL SYSTEMS BIBLE
**Master Specification for Competitive Tournaments, Social Alliances, Replay Storage, and Yearly Live Operations**
**Version:** 1.0.0 (Master Release)  
**Target Quality Tier:** Premium AAA Mobile Strategy (*Whiteout Survival*, *Call of Dragons*, *Puzzles & Chaos*)

---

## 🏛️ SECTION I: THE COMPETITIVE ARCHITECTURE (GLOBAL & KINGDOM RANKINGS)

To drive long-term player retention and spark natural, healthy rivalries, the **Crystal Vault** (Astral Reliquary) runs on a robust, multi-layered leaderboard engine. Rankings are divided between **Global Leaderboards** (cross-server prestige) and **Kingdom Leaderboards** (localized community circles) to give players of all levels a path to recognition.

```
                         [ THE RANKING PIPELINE ]

  +-----------------------------------------------------------------+
  |                      PLAYER RUN COMPLETED                       |
  | - Cleared stage, scored combo, or finished Arena PvP battle     |
  +-----------------------------------------------------------------+
                                   |
                                   v
  +-----------------------------------------------------------------+
  |                  DETERMINISTIC VALIDATION ENGINE                |
  | - Server processes seed and action log, confirms legitimacy     |
  +-----------------------------------------------------------------+
                   /                               \
                  v                                 v
  +-------------------------------+ +-------------------------------+
  |       GLOBAL LEADERBOARD      | |      KINGDOM LEADERBOARD      |
  | - Real-time Redis ZSET updates| | - Sharded by Kingdom ID       |
  | - Broad bracket sorting       | | - Prominent UI display slots  |
  +-------------------------------+ +-------------------------------+
```

### 1.1 The Six Core Leaderboards
Each leaderboard represents a distinct style of play, targeting speedrunners, puzzle strategists, and competitive PvP combatants:

#### 1. Highest Endless Floor (The Endurance Metric)
*   **Metric:** Maximum stage reached in the Endless Challenge mode.
*   **Tie-Breaker:** 1st: Lowest total moves used; 2nd: Lowest total time elapsed; 3rd: Timestamp of completion (first-come, first-served).
*   **Update Frequency:** Instantly upon level clear.

#### 2. Fastest Puzzle Completion (The Speedrun Metric)
*   **Metric:** Total seconds elapsed to clear specific weekly challenge layouts.
*   **Tie-Breaker:** 1st: Fewest tile selections; 2nd: Highest single combo multiplier; 3rd: Timestamp of completion.
*   **Update Frequency:** Real-time update via database write on stage completion.

#### 3. Highest Combo Multiplier (The Strategy Metric)
*   **Metric:** Maximum consecutive match chain achieved without letting the 2.5-second combo timer expire.
*   **Tie-Breaker:** 1st: Total damage dealt during that specific chain; 2nd: Average match speed; 3rd: Timestamp.
*   **Update Frequency:** Instantly updated.

#### 4. Highest Arena Rating (The PvP Metric)
*   **Metric:** Player’s active Elo matchmaking rating inside the Relic Arena.
*   **Elo Formula:** 
    $$R_{\text{new}} = R_{\text{old}} + K \times (S - E)$$
    Where $K = 32$, $S$ is the match outcome ($1$ for win, $0$ for loss), and $E$ is the expected outcome based on rating differences.
*   **Update Frequency:** Updated instantly upon the completion of each Arena duel.

#### 5. Most Seasonal Points (The Engagement Metric)
*   **Metric:** Total Battle Pass XP gathered during the active 28-day season.
*   **Update Frequency:** Batched update every 5 minutes.

#### 6. Crystal Convergence Score (The LiveOps Metric)
*   **Metric:** Total event points accumulated during the bi-weekly Crystal Convergence event.
*   **Update Frequency:** Real-time update.

---

### 1.2 Leaderboard Reset Schedules & Reward Matrices

Rankings run on repeating schedules, creating regular milestone events that keep the community active:

```
+------------------+------------------+------------------+------------------+
|   WEEKLY RESET   |  BI-WEEKLY RESET |  SEASONAL RESET  |  EVENT END RESET |
|  Fastest Clears, |  Endless Floors, |   Arena Ratings  |    Convergence   |
|  Combos, Bounties|  Beast Damage    |  & Battle Passes |      Scores      |
+------------------+------------------+------------------+------------------+
```

#### Weekly Reset Rewards (Sundays at 23:59:59 UTC)
*   **Rank 1 - 3:** `1,500 Aether Shards`, `5 Gold Celestial Keys`, Exclusive **"Flash Matcher" Animated Chat Tag** (7 days).
*   **Rank 4 - 50:** `800 Aether Shards`, `3 Gold Keys`, `500 Arena Tokens`.
*   **Participation (Top 50%):** `300 Aether Shards`, `1 Silver Key`.

#### Seasonal Reset Rewards (Every 28 Days)
*   **Saber-Class (Elo > 2200):** `10,000 Arena Medals`, `20 Gold Keys`, Exclusive **"Saber-Vault Overlord" Permanent Avatar Frame**, Animated Chat Nameplate.
*   **Champion-Class (Elo 1800 - 2199):** `5,000 Arena Medals`, `10 Gold Keys`, **"Champion's Seal" Profile Decoration**.
*   **Gladiator-Class (Elo 1200 - 1799):** `2,000 Arena Medals`, `5 Gold Keys`.

---

### 1.3 Server-Side Anti-Cheat & Score Verification
To prevent players from manipulating memory addresses, speedhacking, or spoofing network packets, leaderboards utilize a **Deterministic Validation Pipeline**:

```
[ DETERMINISTIC VALIDATION PIPELINE ]

(1) Client Input Delta Stream --------> (2) Server Headless Simulation
    - Array of clicks & timestamps          - Re-runs seed with action logs
    - Checksum matching hash                - Confirms matching trios & mana
                                            
                                            (3) Outlier Scanner
                                            - Flag clicks faster than 150ms
                                            - Reject mismatched score calculations
```

1.  **Replay Action Logging:** Clients do not send final scores. Instead, they stream an encrypted, compressed array of click coordinates, tile IDs, and millisecond offsets.
2.  **Headless Simulation:** The server runs a quick, headless simulation of the board using the exact level generation seed and the client's click inputs.
3.  **Outlier & Speedhack Scanners:** If the simulated game board outcome does not match the client's reported score, or if the delay between clicks falls below **150ms** (indicating automated click bots), the score is rejected and the client's account is flagged.

---

### 1.4 Kingdom-Specific Leaderboards & Titles
Within each individual Kingdom server, localized pride is a major driver of engagement. The top players in each region are rewarded with unique, visual recognitions:

*   **The King's Vault Scholar (Top Puzzle Clearer):** Displays the player's avatar in the kingdom's central monument plaza. Grants a minor passive $+2\%$ research speed buff to their alliance for the week.
*   **The Crystalline Gladiator (Top Arena Player):** Awards a golden, glowing crown icon next to their castle on the world map.
*   **The Iron Warden (Top Endless Challenger):** Displays their castle surrounded by a swirling basalt particle effect on the overworld map.

---

## 👥 SECTION II: ALLIANCE & GUILD COMPETITION

Alliances are the structural heart of *Crownspire*. By linking puzzle mechanics directly to cooperative alliance goals, we drive high daily participation through shared guild success.

```
                  [ ALLIANCE POINT CONVERGENCE FLOW ]

  +-------------------------------+     +-------------------------------+
  |     Alliance Arena Duels      |     |     Beast Trial Damage        |
  +-------------------------------+     +-------------------------------+
                  \                                     /
                   v                                   v
  +-----------------------------------------------------------------+
  |                  ALLIANCE PROGRESS SCOREBOARD                   |
  | - Aggregates points weekly across all active guild members      |
  | - Drives unlock milestones for high-value Alliance Chests       |
  +-----------------------------------------------------------------+
```

### 2.1 The Alliance Progress Scoreboard
All members contribute points to the global guild scoreboard through active play:
*   **Campaign Clear:** $+10\text{ Guild Points}$
*   **Endless Floor Clear:** $+5\text{ Guild Points}$ per floor.
*   **Arena PvP Victory:** $+15\text{ Guild Points}$
*   **Beast Trial Battle:** $+50\text{ Guild Points}$

### 2.2 Weekend Clashes: "Citadel Siege" Event
Every Friday at 12:00 UTC through Sunday at 12:00 UTC, alliances compete in the **Citadel Siege**:
*   **Mechanic:** A giant, shared puzzle grid with 1,000 total tiles is generated. All guild members play simultaneously on the same board, clearing tiles to build massive damage multipliers against an invading enemy fortress.
*   **Social Coordination:** Live chat pins highlight which quadrants are currently locked, encouraging members to coordinate their moves and work together.

### 2.3 Alliance Trophies & Hall Showcases
Winning competitive weekend clashes awards prestigious **Prestige Trophies**:
*   Trophies are displayed in the **Alliance Hall** scene, allowing visiting players to view the guild's achievements.
*   Each trophy active in the hall grants minor, non-combat convenience benefits, such as a $+3\%$ discount on alliance shop items.

---

## 🤝 SECTION III: PEER-TO-PEER SOCIAL SYSTEMS (FRIENDS & GIFTING)

To foster a warm, friendly community alongside competitive modes, the Crystal Vault features robust peer-to-peer social options.

```
       [ FRIEND COMPARISON HUD ]

  +-----------------------------------------------------+
  |  Friend: Alex (Rank 12)  --  Highest Combo: 12x     |
  |  [ WATCH REPLAY ]   [ SEND SPARKS ]   [ DUEL ]     |
  +-----------------------------------------------------+
```

### 3.1 Friend Comparison Bars
When viewing a puzzle stage's entry screen, a dedicated panel displays your friends' completion times and maximum combos on that specific layout, providing a friendly challenge before you begin.

### 3.2 Friendly Relic Duels
*   Players can invite any online friend to a direct PvP Relic Arena duel.
*   **Rules:** Consumes zero stamina, grants no rating points, and can be spectated live by any alliance member.

### 3.3 Daily Friendship Gifts: Aether Sparks
*   Players can send **1 Aether Spark** to up to 10 friends daily.
*   **The Friendship Portal:** Aether Sparks are collected in a social vault. Collecting **100 Sparks** lets players pull from the Social Gacha portal, yielding exclusive vanity frames and profile decorations.

---

## 📹 SECTION IV: REPLAY, SPECTATOR, & DATA STORAGE SYSTEMS

To drive high-fidelity streaming, video sharing, and game learning, the Crystal Vault utilizes a highly optimized, state-based **Action-Delta Replay Engine**.

```
                 [ REPLAY DATA PACKAGING STRUCTURE ]

  +-----------------------+-----------------------+-----------------------+
  |  File Header          |  Level Setup          |  Input Deltas Log     |
  |  - Version: 1.0.4     |  - Seed ID: 41295     |  - Move 1: T=1200,    |
  |  - Hero IDs: [H1, H2] |  - Board Coordinates  |    Click X=3, Y=2     |
  |  - Time: 2026-07-03   |  - Blockers Array     |  - Move 2: T=2450...  |
  +-----------------------+-----------------------+-----------------------+
```

### 4.1 Replay Serialization Schema (JSON Action Log)
Rather than recording video or rendering heavy animations server-side, runs are stored as a highly compressed array of seed configurations and action deltas, keeping files under **5KB** per 5-minute run.

```json
{
  "replay_header": {
    "version": "1.0.0",
    "run_id": "run_a892f2c0199e",
    "player_id": "usr_9921a",
    "timestamp": 1783082659,
    "heroes_deck": ["HER_IGNIS", "HER_SARIEL", "HER_GARRICK"],
    "total_score": 145200,
    "max_combo": 12
  },
  "level_configuration": {
    "level_id": 42,
    "generation_seed": 841920583,
    "grid_dimensions": {"width": 8, "height": 10, "layers": 3},
    "custom_blocker_coordinates": [
      {"x": 2, "y": 4, "z": 1, "type": "granite_cage"}
    ]
  },
  "action_deltas": [
    {"tick": 1200, "action": "select_tile", "coords": {"x": 3, "y": 2, "z": 2}},
    {"tick": 2450, "action": "select_tile", "coords": {"x": 3, "y": 3, "z": 2}},
    {"tick": 3100, "action": "trigger_ultimate", "hero_id": "HER_IGNIS"},
    {"tick": 5800, "action": "select_tile", "coords": {"x": 5, "y": 1, "z": 1}}
  ]
}
```

### 4.2 Replay Code Generator
*   Runs can be shared using an automatically generated 12-character alphanumeric **Replay Code** (e.g., `CVP-99A2-FF01`).
*   The server uses a fast Redis lookup table to match the code to the corresponding compressed JSON action file in our database, making sharing runs quick and seamless.

### 4.3 Live Spectator Engine (`SpectatorRoomServer`)
*   Top-tier Arena duels and Alliance Tournament finals can be spectated live by players in real-time.
*   **The Anti-Ghosting Delay:** To prevent screen-cheating or coaching during competitive matches, live matches stream with a **3-second delay** for spectators.
*   **Interactive Spectating:** Spectators can tap quick emoji icons (e.g., thumbs up, fire, crying emoji) to send floating reaction symbols across the screen, adding to the tournament excitement.

---

## 🏆 SECTION V: THE TOURNAMENT MATRIX

Tournaments are organized into four distinct tiers, providing constant competitive events for players of all levels.

```
=============================================================================
                          THE TOURNAMENT CALENDAR

  [DAILY TRIALS]    - 10-player quick bracket. Simple speedrun challenges.
  [WEEKLY CLASH]    - 64-player single elimination grids. Sells rare runestones.
  [MONTHLY CUP]     - Live bracket tournaments for top 128 Elite Arena players.
  [SEASON FINALS]   - Worldwide double-elimination brackets. Crowns the Monarch.
=============================================================================
```

### 5.1 Tournament Tiers

#### Daily Speed Trials
*   *Entry:* Consumes 1 Challenge Ticket.
*   *Mechanic:* 10 players are grouped into a quick bracket. Players race to clear the same puzzle board within 24 hours.
*   *Rewards:* Boosters, Vault Coins, and basic keys.

#### Weekend Single-Elimination Clashes
*   *Entry:* Requires qualifying via Gladiator Arena ratings.
*   *Mechanic:* 64-player knockout brackets. Players compete in live head-to-head Arena duels, with winners moving on to the next round.
*   *Rewards:* Rare runestones, hero shards, and exclusive chat colors.

#### Monthly Championships
*   *Entry:* Exclusive to the top 128 players of the active Arena PvP season.
*   *Mechanic:* Live bracket tournament held over a single weekend. Matches are broadcast live, allowing the entire server to watch and spectate.
*   *Rewards:* Legendary Celestial Keys, massive Aether Shard pools, and the prestigious **"Monthly Champion" Avatar Frame**.

---

## 🌞 SECTION VI: THE BI-WEEKLY EVENT (CRYSTAL CONVERGENCE)

The **Crystal Convergence** is *Crownspire's* flagship bi-weekly LiveOps event, driving high player engagement through themed challenges and exclusive rewards.

```
+---------------------------------------------------------------------------------+
|                       CRYSTAL CONVERGENCE PROGRESS TRACK                        |
|                                                                                 |
|   [LEVEL 1]              [LEVEL 10]             [LEVEL 25]           [LEVEL 50] |
|   Event Emblems          Lava Tile Theme        Phoenix Board        Lunar Crown|
|   +-------------------------------------------------------------------------+   |
|   | Daily: Complete 3 Fire Matches || Alliance: Defeat Goliath 3 times      |   |
|   +-------------------------------------------------------------------------+   |
+---------------------------------------------------------------------------------+
```

### 6.1 Event Narrative & modifiers
*   **The Theme:** Solar and Lunar forces collide inside the Vault.
*   **Active Modifiers:** During the event, all Fire and Light element matches deal $+25\%$ damage, while Earth and Frost matches have their mana costs reduced by $-10\%$, shaking up standard team builds and encouraging creative strategy.

### 6.2 Event Missions

#### Daily Missions
*   Complete exactly 5 Fire matches inside the campaign: `100 Event Emblems`.
*   Clear any level without using a single booster utility: `150 Event Emblems`.

#### Cooperative Alliance Milestones
*   Alliance members collectively clear 200 puzzle stages: `1,000 Event Emblems` awarded to all members.
*   Defeat the Goliath Behemoth 5 times in Beast Trials: `2,500 Event Emblems`.

### 6.3 Exclusive Seasonal Rewards
Event Points (Emblems) unlock tier-based milestone rewards on the event board:
*   *Milestone 10:* The limited-edition **"Obsidian Core" tile theme** (changes white tiles to dark basalt with glowing lava lines).
*   *Milestone 25:* The animated **"Phoenix Nest" custom board frame**.
*   *Milestone 50:* The permanent, prestigious **"Concurrence Master" profile title**.

---

## 🎨 SECTION VII: CHAT INTEGRATION, PROFILES, & COLLECTION ALBUMS

To keep social interactions active and rewarding, social systems are integrated directly into the player's profile and alliance hubs:

```
[ RICH EMBEDDED CHAT LINK ]
____________________________________________________________________
[Alliance Chat] Alex: "Check out this crazy 14x match combo!"
+------------------------------------------------------------------+
| 📹 WATCH REPLAY: [CVP-99A2-FF01] | Level: 140 | Hero: Ignis      |
+------------------------------------------------------------------+
```

### 7.1 Rich Chat Embeddings
Players can click a quick share button to embed active links directly into alliance or global chat channels:
*   `[Share Replay]`: Spawns a clickable banner in chat that lets any player view the run with a single tap.
*   `[Showoff Combo]`: Displays a glowing banner showcasing their high score, maximum combo, and team layout.
*   `[Help Request]`: Links to a stage they are currently stuck on, letting other guild members test the layout and share their successful strategies.

### 7.2 Profile Statistics Display
The player profile card includes a dedicated tab for Crystal Vault statistics, showcasing their personal bests:
*   **Career Highlights:** Total stages cleared, maximum endless wave reached, and highest combo chain achieved.
*   **Combat Analytics:** Win/loss ratios in the Arena, most used hero character, and total damage dealt in Beast Trials.
*   **Trophy Cabinet:** Displays all earned tournament badges, competitive titles, and active seasonal pass milestones.

### 7.3 Collection Albums (Sticker Book Format)
*   The **Relic Album** is a visual catalog of all custom tiles, board frames, victory effects, and avatar skins the player has unlocked.
*   Completing specific sets (e.g., unlocking the "Frost Glaze" tile theme, "Frozen Temple" board, and "Glacial Spike" victory effect) awards high-value permanent titles and minor convenience boosts, providing a fun progression path for completionists.

---

## 📅 SECTION VIII: 12-MONTH YEARLY LIVEOPS CALENDAR

To maintain high interest and steady retention throughout the year, the Crystal Vault runs on a structured, 12-month calendar of themed events and holiday challenges.

```
=============================================================================
                           THE 12-MONTH LIVEOPS PLAN

  [JAN] New Year Dawn (Light-themed boards)  [FEB] Valentine's Bond (Duo co-op)
  [MAR] Spring Canopy (Nature multipliers)    [APR] Stellar Equinox (Void challenges)
  [MAY] Volcanic Fire (Boss storm runs)      [JUN] Summer Solstice (Solar key hunt)
  [JUL] Anniversary Feast (Mega drop multipliers) [AUG] Abyssal Trench (Deep sea)
  [SEP] Autumn Harvest (Earth block puzzles)  [OCT] Hallow's Crypt (Grave tile hunt)
  [NOV] Winter Forge (Metal shields active)  [DEC] Glacial Freeze (Blizzard storms)
=============================================================================
```

*   **Pacing Strategy:** Each monthly event features a unique, thematic visual update, custom hazard modifiers, and exclusive cosmetic rewards, keeping the game feeling fresh and engaging.

---

## 🔒 SECTION IX: SYSTEMS INTERACTION, DATABASE SCHEMA & SECURITY

Our database structure and network communications are designed to ensure fast performance and maximum security across all systems.

```
                       [ SYSTEM CONNECTION FLOW ]

   +-----------------------------------------------------------------+
   |                     Redis ZSET Cache (RAM)                      |
   | - Manages real-time, global leaderboard rankings and sorting    |
   +-----------------------------------------------------------------+
                                   ^
                                   | Syncs updates every 15 minutes
                                   v
   +-----------------------------------------------------------------+
   |                    PostgreSQL Database (Disk)                   |
   | - Stores permanent player profiles, inventories, and save files |
   +-----------------------------------------------------------------+
                                   ^
                                   | Refers to active files
                                   v
   +-----------------------------------------------------------------+
   |                 Cloud Object Storage (Blob)                     |
   | - Stores compressed, encrypted JSON files of replay action logs |
   +-----------------------------------------------------------------+
```

### 9.1 Database Schema (Leaderboard Packet)
Leaderboards are managed using fast Redis Sorted Sets (ZSET) to handle real-time scoring, with structural details stored in our core PostgreSQL databases:

```sql
-- PostgreSQL table structure for persistent player ranking profiles
CREATE TABLE player_vault_rankings (
    player_id VARCHAR(64) PRIMARY KEY,
    kingdom_id INT NOT NULL,
    current_arena_rating INT DEFAULT 1000,
    max_endless_floor INT DEFAULT 0,
    fastest_completion_seconds INT,
    highest_combo_chain INT DEFAULT 0,
    seasonal_battle_pass_xp INT DEFAULT 0,
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
);

CREATE INDEX idx_kingdom_arena ON player_vault_rankings (kingdom_id, current_arena_rating DESC);
CREATE INDEX idx_global_endless ON player_vault_rankings (max_endless_floor DESC);
```

### 9.2 Reward Distribution Pipeline
To prevent data loss or network errors when delivering seasonal rewards, we utilize an **Asynchronous Mail Queuing Engine**:

```
[ PLAYER RANK VALIDATED ]
           |
           v
[ GENERATE MAIL ID: "MAIL_SEAS1_USR99A" ] (Prevents duplicate delivers)
           |
           v
[ PUSH TO QUEUE ] --------> [ REDEEMED PACKET WRITE ]
                                 - Inserts keys/shards to user database
                                 - Marks Mail ID as permanently claimed
```

1.  **Idempotent Transaction Keys:** Upon season reset, the server generates a unique reward mail ID for each qualifying player (e.g., `REWARD_SEASON1_ARENA_usr_9921a`).
2.  **State-Locked Delivery:** When the player logs in and taps claim, the server checks if this mail ID is already marked as claimed in our database before adding the resources, protecting the game's economy from double-claiming exploits.

---
*End of LiveOps & Social Systems Specification Bible.*  
*Ready for client UI programming, database setup, and live server configuration.*
