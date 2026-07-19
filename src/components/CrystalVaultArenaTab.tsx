import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy as TrophyIcon, 
  User, 
  Swords, 
  ChevronRight, 
  ShoppingBag, 
  History, 
  Award, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  Search, 
  Volume2, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Flame, 
  Shield, 
  Sparkles, 
  ArrowLeft,
  VolumeX,
  HelpCircle,
  Zap,
  Info,
  Gift,
  AlertTriangle,
  Eye,
  Megaphone,
  Heart,
  Smile,
  Maximize2
} from 'lucide-react';

// ==========================================
// ARENA DATA MODELS & DATABASES
// ==========================================

export interface ArenaOpponent {
  id: string;
  name: string;
  title: string;
  rating: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  guild: string;
  emoji: string;
  power: number;
  winRate: number;
  deck: string[];
  avatarColor: string;
  playstyle: string;
}

export interface ArenaHistoryEntry {
  id: string;
  rivalName: string;
  rivalRating: number;
  rivalEmoji: string;
  victory: boolean;
  ratingChange: number;
  turnsSpent: number;
  timestamp: string;
  replayEvents: ReplayEvent[];
}

export interface ReplayEvent {
  stepIndex: number;
  type: 'click' | 'match' | 'rival_attack' | 'ultimate' | 'heal' | 'shield';
  actor: string;
  detail: string;
  playerHpSnapshot: number[];
  rivalHpSnapshot: number[];
  tileEmoji?: string;
}

export interface ArenaMilestone {
  points: number;
  rewardName: string;
  rewardIcon: string;
  rewardDesc: string;
  claimed: boolean;
}

export interface ArenaShopItem {
  id: string;
  name: string;
  cost: number;
  desc: string;
  emoji: string;
  stock: number;
  category: 'skins' | 'potions' | 'resources' | 'titles';
  purchased: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  title: string;
  rating: number;
  guild: string;
  emoji: string;
  isPlayer?: boolean;
}

// 6 Elemental Runes of Crownspire matched
export interface ArenaTile {
  id: string;
  typeId: string;
  x: number;
  y: number;
  z: number;
  isBlocked: boolean;
}

const ARENA_TILES_DB = [
  { id: 'solar_fire', label: 'VALOR', emoji: '🔥', bgColor: 'bg-rose-950/50', border: 'border-rose-500/40' },
  { id: 'glacial_frost', label: 'FROST', emoji: '❄️', bgColor: 'bg-cyan-950/50', border: 'border-cyan-500/40' },
  { id: 'emerald_nature', label: 'GROWTH', emoji: '🌿', bgColor: 'bg-emerald-950/50', border: 'border-emerald-500/40' },
  { id: 'astral_light', label: 'ASTRAL', emoji: '⭐', bgColor: 'bg-fuchsia-950/50', border: 'border-fuchsia-500/40' },
  { id: 'obsidian_core', label: 'STONE', emoji: '💎', bgColor: 'bg-amber-950/50', border: 'border-amber-500/40' },
  { id: 'elixir_pure', label: 'POTION', emoji: '🧪', bgColor: 'bg-purple-950/50', border: 'border-purple-500/40' }
];

const BOT_NAMES = [
  "Aethelgard", "Vespera", "Sylvanas", "Kaelthas", "Lyanna", "Garrick", "Eldrin", 
  "Saurfang", "Ysera", "Theron", "Jaina", "Anduin", "Malfurion", "Tyrande", "Grommash"
];

const BOT_TITLES = [
  "The Blazing Rune", "Chrono Guardian", "Storm Herald", "Obsidian Core", "Prism Tactician", 
  "Abyss Hunter", "Void Weaver", "Crownspire Oracle", "Sunspire Drake Rider", "Lunar Mystic"
];

const GUILD_NAMES = [
  "Iron Altar", "Astral Core", "Shadow Vanguard", "Gilded Shield", "Void Walker", 
  "Solar Radiance", "Crown Shield", "Stellar Runelines", "Rune Syndicate", "Chrono Keepers"
];

// Generate standard static/procedural leaderboards
const INITIAL_LEADERBOARD = (): LeaderboardEntry[] => [
  { rank: 1, name: "Emperor Theron", title: "Crownspire Overlord", rating: 2850, guild: "Astral Core", emoji: "👑" },
  { rank: 2, name: "Lady Vespera", title: "Void Weaver", rating: 2640, guild: "Shadow Vanguard", emoji: "🔮" },
  { rank: 3, name: "Grandmaster Garrick", title: "Obsidian Core", rating: 2480, guild: "Iron Altar", emoji: "🛡️" },
  { rank: 4, name: "Archmage Kaelthas", title: "The Blazing Rune", rating: 2210, guild: "Solar Radiance", emoji: "🔥" },
  { rank: 5, name: "Slayer Lyanna", title: "Abyss Hunter", rating: 1950, guild: "Gilded Shield", emoji: "🏹" },
  { rank: 6, name: "Sovereign Eldrin", title: "Prism Tactician", rating: 1780, guild: "Crown Shield", emoji: "💎" },
  { rank: 7, name: "Oracle Jaina", title: "Crownspire Oracle", rating: 1610, guild: "Chrono Keepers", emoji: "❄️" },
  { rank: 8, name: "Warlord Saurfang", title: "Sunspire Drake Rider", rating: 1420, guild: "Rune Syndicate", emoji: "🐲" },
  { rank: 9, name: "High Priest Anduin", title: "Lunar Mystic", rating: 1250, guild: "Void Walker", emoji: "🌿" },
  { rank: 10, name: "Your Rival Bot", title: "Chrono Guardian", rating: 1100, guild: "Stellar Runelines", emoji: "⚡" }
];

// Generate shop catalog
const INITIAL_SHOP = (): ArenaShopItem[] => [
  { id: 'rune_glow_skin', name: 'Luminous Rune Overlay', cost: 450, desc: 'Replaces standard matched gems with radiant crownspire cosmetics.', emoji: '✨', stock: 1, category: 'skins', purchased: false },
  { id: 'gold_potion_set', name: 'Ambrosia Altar Potion', cost: 150, desc: 'Restores 40% health pool during high-intensity matches.', emoji: '🧪', stock: 5, category: 'potions', purchased: false },
  { id: 'obsidian_core_shield', name: 'Aegis Core Crest', cost: 300, desc: 'Starts Arena battle with a persistent 300 HP shield buffer.', emoji: '🛡️', stock: 2, category: 'potions', purchased: false },
  { id: 'stellar_scroll_pack', name: 'Stellar Shards (x500)', cost: 200, desc: 'Exclusive crafting material to upgrade Reliquary artifacts.', emoji: '💎', stock: 3, category: 'resources', purchased: false },
  { id: 'vanguard_title', name: 'S1 Vanguard Title', cost: 800, desc: 'Exclusive title tag with permanent gold profile borders.', emoji: '👑', stock: 1, category: 'titles', purchased: false }
];

// Matchmaking milestones
const INITIAL_MILESTONES = (): ArenaMilestone[] => [
  { points: 1000, rewardName: 'Bronze Chest', rewardIcon: '📦', rewardDesc: 'Contains 150 Astral Shards & 5000 Gold.', claimed: false },
  { points: 1200, rewardName: 'Silver Shield Sigil', rewardIcon: '🛡️', rewardDesc: 'Provides custom Silver Profile theme overlay.', claimed: false },
  { points: 1400, rewardName: 'Gold Core Trove', rewardIcon: '🎁', rewardDesc: 'Unlocks 250 Arena Medals & 3 Starlight Orbs.', claimed: false },
  { points: 1650, rewardName: 'Platinum Rune Pack', rewardIcon: '⭐', rewardDesc: 'Adds platinum glowing matching particles.', claimed: false },
  { points: 1850, rewardName: 'Diamond Relic Lockbox', rewardIcon: '💎', rewardDesc: 'Contains 1000 Astral Shards & 20000 Gold.', claimed: false },
  { points: 2000, rewardName: 'Crownspire Legend Trophy', rewardIcon: '👑', rewardDesc: 'Unlocks permanent "Crown Altar Champion" badge.', claimed: false }
];

// ==========================================
// COMPONENT MAIN MODULE
// ==========================================

interface CrystalVaultArenaTabProps {
  resources: any;
  addLog: (msg: string, type: 'info' | 'success' | 'warning') => void;
}

export default function CrystalVaultArenaTab({ resources, addLog }: CrystalVaultArenaTabProps) {
  // Navigation Screens
  // 'lobby' | 'matchmaking' | 'combat' | 'replay' | 'spectator'
  const [screen, setScreen] = useState<'lobby' | 'matchmaking' | 'combat' | 'replay' | 'spectator'>('lobby');
  
  // Core Currencies and Stats
  const [arenaRating, setArenaRating] = useState<number>(1000);
  const [arenaMedals, setArenaMedals] = useState<number>(350);
  const [arenaSeason, setArenaSeason] = useState<number>(1);
  const [seasonCountdown, setSeasonCountdown] = useState<string>("5d 14h 22m");
  
  // Local Data Stores
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [history, setHistory] = useState<ArenaHistoryEntry[]>([]);
  const [shopItems, setShopItems] = useState<ArenaShopItem[]>([]);
  const [milestones, setMilestones] = useState<ArenaMilestone[]>([]);
  
  // Stats
  const [totalMatches, setTotalMatches] = useState<number>(0);
  const [wins, setWins] = useState<number>(0);
  const [losses, setLosses] = useState<number>(0);
  const [winStreak, setWinStreak] = useState<number>(0);
  const [peakRating, setPeakRating] = useState<number>(1000);
  
  // Matchmaking State
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [matchedOpponent, setMatchedOpponent] = useState<ArenaOpponent | null>(null);
  const [searchTimer, setSearchTimer] = useState<number>(0);
  const [searchEloRange, setSearchEloRange] = useState<number>(50);
  
  // Combat Gameplay States
  const [playerHp, setPlayerHp] = useState<number[]>([1500, 1200, 2000]); // Valen, Lyra, Aethelgard
  const [playerMaxHp] = useState<number[]>([1500, 1200, 2000]);
  const [playerShield, setPlayerShield] = useState<number[]>([0, 0, 0]);
  const [playerEnergy, setPlayerEnergy] = useState<number[]>([0, 0, 0]);
  const [playerMaxEnergy] = useState<number[]>([100, 100, 100]);
  
  const [rivalHp, setRivalHp] = useState<number[]>([1600, 1100, 1800]); // Rival Front, Marks, Support
  const [rivalMaxHp, setRivalMaxHp] = useState<number[]>([1600, 1100, 1800]);
  const [rivalShield, setRivalShield] = useState<number[]>([0, 0, 0]);
  const [rivalTimer, setRivalTimer] = useState<number>(4); // Decrements on moves. Spells cast at 0.
  
  const [combatBoard, setCombatBoard] = useState<ArenaTile[]>([]);
  const [combatTray, setCombatTray] = useState<ArenaTile[]>([]);
  const [activeCombatLogs, setActiveCombatLogs] = useState<string[]>([]);
  const [matchTurnCount, setMatchTurnCount] = useState<number>(0);
  const [battleVerdict, setBattleVerdict] = useState<'playing' | 'victory' | 'defeat'>('playing');
  
  // Replay Recording Variables
  const [activeReplayEvents, setActiveReplayEvents] = useState<ReplayEvent[]>([]);
  
  // Replay Playback States
  const [selectedReplay, setSelectedReplay] = useState<ArenaHistoryEntry | null>(null);
  const [playbackIndex, setPlaybackIndex] = useState<number>(0);
  const [isPlaybackPlaying, setIsPlaybackPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1); // 1x, 2x, 4x
  const [playbackLogs, setPlaybackLogs] = useState<string[]>([]);
  const [playbackPlayerHp, setPlaybackPlayerHp] = useState<number[]>([1500, 1200, 2000]);
  const [playbackRivalHp, setPlaybackRivalHp] = useState<number[]>([1600, 1100, 1800]);
  
  // Spectator Simulation States
  const [specHomeOpponent, setSpecHomeOpponent] = useState<ArenaOpponent | null>(null);
  const [specAwayOpponent, setSpecAwayOpponent] = useState<ArenaOpponent | null>(null);
  const [specHomeHp, setSpecHomeHp] = useState<number[]>([1800, 1500, 2200]);
  const [specAwayHp, setSpecAwayHp] = useState<number[]>([1900, 1400, 2100]);
  const [specTimer, setSpecTimer] = useState<number>(3);
  const [specLogs, setSpecLogs] = useState<string[]>([]);
  const [specCheerMeter, setSpecCheerMeter] = useState<number>(50); // 0 (Away) to 100 (Home)
  const [isSpectating, setIsSpectating] = useState<boolean>(false);
  const [specActiveStep, setSpecActiveStep] = useState<number>(0);

  // Sound cue
  const playArenaSound = (cue: string) => {
    addLog(`🔊 Arena Sound Dispatch: "${cue}"`, "info");
  };

  // Load Arena States from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('crownspire_vault_arena');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setArenaRating(parsed.rating ?? 1000);
        setArenaMedals(parsed.medals ?? 350);
        setArenaSeason(parsed.season ?? 1);
        setHistory(parsed.history ?? []);
        setShopItems(parsed.shop ?? INITIAL_SHOP());
        setMilestones(parsed.milestones ?? INITIAL_MILESTONES());
        setTotalMatches(parsed.totalMatches ?? 0);
        setWins(parsed.wins ?? 0);
        setLosses(parsed.losses ?? 0);
        setWinStreak(parsed.winStreak ?? 0);
        setPeakRating(parsed.peakRating ?? 1000);
      } catch (e) {
        // Fallbacks
        initializeFreshStates();
      }
    } else {
      initializeFreshStates();
    }
  }, []);

  const initializeFreshStates = () => {
    setArenaRating(1000);
    setArenaMedals(350);
    setArenaSeason(1);
    setHistory([]);
    setShopItems(INITIAL_SHOP());
    setMilestones(INITIAL_MILESTONES());
    setTotalMatches(0);
    setWins(0);
    setLosses(0);
    setWinStreak(0);
    setPeakRating(1000);
  };

  // Save changes helper
  const commitArenaChanges = (updates: any) => {
    const data = {
      rating: updates.rating ?? arenaRating,
      medals: updates.medals ?? arenaMedals,
      season: updates.season ?? arenaSeason,
      history: updates.history ?? history,
      shop: updates.shop ?? shopItems,
      milestones: updates.milestones ?? milestones,
      totalMatches: updates.totalMatches ?? totalMatches,
      wins: updates.wins ?? wins,
      losses: updates.losses ?? losses,
      winStreak: updates.winStreak ?? winStreak,
      peakRating: updates.peakRating ?? peakRating
    };
    localStorage.setItem('crownspire_vault_arena', JSON.stringify(data));
  };

  // Build Leaderboard around current player rating
  useEffect(() => {
    const defaultBoard = INITIAL_LEADERBOARD();
    // Inject player
    const playerEntry: LeaderboardEntry = {
      rank: 11, // Computed below
      name: "Your Guardian",
      title: "Active Altar Siphoner",
      rating: arenaRating,
      guild: "Your Citadel",
      emoji: "🛡️",
      isPlayer: true
    };
    
    const combined = [...defaultBoard, playerEntry];
    // Sort descending by rating
    combined.sort((a, b) => b.rating - a.rating);
    // Assign proper ranks
    const reRanked = combined.map((entry, idx) => ({
      ...entry,
      rank: idx + 1
    }));
    setLeaderboard(reRanked);
  }, [arenaRating]);

  // Generate single bot opponent based on tier
  const createRival = (diff: 'Easy' | 'Medium' | 'Hard'): ArenaOpponent => {
    const name = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
    const title = BOT_TITLES[Math.floor(Math.random() * BOT_TITLES.length)];
    const guild = GUILD_NAMES[Math.floor(Math.random() * GUILD_NAMES.length)];
    const emojis = ["🔥", "❄️", "🌿", "⚡", "🔮", "👑", "🏹"];
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    let ratingDiff = 0;
    let playstyle = "Balanced Tactician";
    if (diff === 'Easy') {
      ratingDiff = -Math.floor(Math.random() * 80) - 50;
      playstyle = "Defensive Defender";
    } else if (diff === 'Medium') {
      ratingDiff = Math.floor(Math.random() * 60) - 30;
      playstyle = "Cautious Retaliator";
    } else {
      ratingDiff = Math.floor(Math.random() * 100) + 70;
      playstyle = "Aggressive Elemental Burster";
    }

    const rating = Math.max(100, arenaRating + ratingDiff);
    return {
      id: `bot_${Date.now()}_${Math.floor(Math.random() * 100)}`,
      name,
      title,
      rating,
      difficulty: diff,
      guild,
      emoji,
      power: Math.round(rating * 4.3 + Math.random() * 500),
      winRate: Math.round(45 + Math.random() * 20),
      deck: ["valen_solar", "lyra_frost", "aethelgard_stone"],
      avatarColor: diff === 'Easy' ? 'border-emerald-500 text-emerald-400' : diff === 'Medium' ? 'border-indigo-500 text-indigo-400' : 'border-rose-500 text-rose-400',
      playstyle
    };
  };

  // ==========================================
  // MATCHMAKING SIMULATION
  // ==========================================
  const startMatchmakingFlow = () => {
    setScreen('matchmaking');
    setSearchTimer(0);
    setSearchEloRange(50);
    playArenaSound("arena_matchmaking_start");
  };

  useEffect(() => {
    let interval: any;
    if (screen === 'matchmaking') {
      interval = setInterval(() => {
        setSearchTimer(prev => {
          const next = prev + 1;
          // Increase search criteria ELO window
          setSearchEloRange(50 + next * 40);
          
          if (next >= 4) {
            clearInterval(interval);
            // Match found!
            const rival = createRival(selectedDifficulty);
            setMatchedOpponent(rival);
            playArenaSound("arena_match_found");
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [screen, selectedDifficulty]);

  // ==========================================
  // GAMEPLAY ENGINE - BUILD ARENA PUZZLE BOARD
  // ==========================================
  const initializeArenaMatch = () => {
    if (!matchedOpponent) return;

    // Build 30 customized tiles layered
    const tiles: ArenaTile[] = [];
    const elements = ['solar_fire', 'glacial_frost', 'emerald_nature', 'astral_light', 'obsidian_core', 'elixir_pure'];
    
    // Create symmetrical matching patterns to ensure high solve rates
    let idCounter = 0;
    const layers = 3;
    const rows = 4;
    const cols = 5;

    for (let z = 0; z < layers; z++) {
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          // Stagger overlap
          if (z === 1 && (x === 0 || x === cols - 1)) continue;
          if (z === 2 && (y === 0 || y === rows - 1)) continue;

          // Align type elements in multiples of 3 to guarantee solvable alignments
          const randomType = elements[(x + y + z) % elements.length];
          tiles.push({
            id: `tile_${z}_${y}_${x}_${idCounter++}`,
            typeId: randomType,
            x: x + z * 0.15,
            y: y + z * 0.15,
            z,
            isBlocked: false
          });
        }
      }
    }

    // Refresh blocked states
    updateTileBlockingState(tiles);

    setCombatBoard(tiles);
    setCombatTray([]);
    setPlayerHp([1500, 1200, 2000]);
    setPlayerShield([0, 0, 0]);
    setPlayerEnergy([0, 0, 0]);
    
    // Scaling rival stats according to difficulty
    const scale = selectedDifficulty === 'Easy' ? 0.8 : selectedDifficulty === 'Medium' ? 1.0 : 1.3;
    const baseRivalHp = [1600, 1100, 1800].map(h => Math.round(h * scale));
    setRivalHp(baseRivalHp);
    setRivalMaxHp(baseRivalHp);
    setRivalShield([0, 0, 0]);
    setRivalTimer(4);
    
    setMatchTurnCount(0);
    setBattleVerdict('playing');
    setActiveCombatLogs(["⚔️ The Duel Begins! Match-3 Altar activated."]);
    
    // Initialize Replay Logging Stack
    const initialLog: ReplayEvent = {
      stepIndex: 0,
      type: 'click',
      actor: 'system',
      detail: 'Match Initialized',
      playerHpSnapshot: [1500, 1200, 2000],
      rivalHpSnapshot: baseRivalHp
    };
    setActiveReplayEvents([initialLog]);

    setScreen('combat');
    playArenaSound("arena_battle_enter");
  };

  const updateTileBlockingState = (tiles: ArenaTile[]) => {
    // A tile is blocked if there's another tile on top (z + 1) overlapping its boundaries
    for (let i = 0; i < tiles.length; i++) {
      let blocked = false;
      const t1 = tiles[i];
      for (let j = 0; j < tiles.length; j++) {
        const t2 = tiles[j];
        if (t2.z > t1.z) {
          const xOverlap = Math.abs(t2.x - t1.x) < 0.8;
          const yOverlap = Math.abs(t2.y - t1.y) < 0.8;
          if (xOverlap && yOverlap) {
            blocked = true;
            break;
          }
        }
      }
      t1.isBlocked = blocked;
    }
  };

  // Player clicks a tile on the competitive board
  const clickBoardTile = (tile: ArenaTile) => {
    if (tile.isBlocked || combatTray.length >= 7 || battleVerdict !== 'playing') {
      playArenaSound("tile_locked_error");
      return;
    }

    // Add to tray
    const newBoard = combatBoard.filter(t => t.id !== tile.id);
    updateTileBlockingState(newBoard);
    setCombatBoard(newBoard);

    const newTray = [...combatTray, tile];
    // Record click event
    const eventLog: ReplayEvent = {
      stepIndex: activeReplayEvents.length,
      type: 'click',
      actor: 'Player',
      detail: `Selected ${tile.typeId.replace('_', ' ')}`,
      playerHpSnapshot: [...playerHp],
      rivalHpSnapshot: [...rivalHp],
      tileEmoji: ARENA_TILES_DB.find(db => db.id === tile.typeId)?.emoji
    };
    const updatedEvents = [...activeReplayEvents, eventLog];
    setActiveReplayEvents(updatedEvents);

    // Look for triplets match inside the Altar Tray
    const grouped = newTray.reduce((acc: {[key: string]: ArenaTile[]}, item) => {
      acc[item.typeId] = acc[item.typeId] || [];
      acc[item.typeId].push(item);
      return acc;
    }, {});

    let matchedType: string | null = null;
    for (const typeId in grouped) {
      if (grouped[typeId].length >= 3) {
        matchedType = typeId;
        break;
      }
    }

    if (matchedType) {
      // Handle alignment match triplet
      playArenaSound("triple_match_resonance");
      const filteredTray = newTray.filter(t => t.typeId !== matchedType);
      setCombatTray(filteredTray);

      executeMatchEffects(matchedType, updatedEvents);
    } else {
      setCombatTray(newTray);
      // Only advance rival turn/countdown if no matches occurred
      tickRivalTimer(updatedEvents);
    }
  };

  // Perform Match damage effects on Rival Heroes
  const executeMatchEffects = (typeId: string, currentEvents: ReplayEvent[]) => {
    let damage = 0;
    let targetIdx = 0;
    let logMessage = "";
    let matchType: 'match' | 'heal' | 'shield' = 'match';

    // Find active target (lowest index with hp > 0)
    const findRivalTarget = (hpArr: number[]): number => {
      for (let i = 0; i < hpArr.length; i++) {
        if (hpArr[i] > 0) return i;
      }
      return 0;
    };

    targetIdx = findRivalTarget(rivalHp);
    const updatedRivalHp = [...rivalHp];
    const updatedPlayerHp = [...playerHp];
    const updatedPlayerShield = [...playerShield];
    const updatedPlayerEnergy = [...playerEnergy];

    if (typeId === 'solar_fire') {
      damage = 380;
      updatedRivalHp[targetIdx] = Math.max(0, updatedRivalHp[targetIdx] - damage);
      logMessage = `🔥 SOLAR RESIDUE: Valen fires heavy Inferno Strike! Dealt ${damage} damage to Rival ${targetIdx === 0 ? 'Fighter' : targetIdx === 1 ? 'Ranger' : 'Support'}.`;
      // Gain energy
      updatedPlayerEnergy[0] = Math.min(100, updatedPlayerEnergy[0] + 30);
    } else if (typeId === 'glacial_frost') {
      damage = 180;
      updatedRivalHp[targetIdx] = Math.max(0, updatedRivalHp[targetIdx] - damage);
      // Freeze timer delay!
      setRivalTimer(prev => prev + 1);
      logMessage = `❄️ GLACIAL CHILL: Lyra launches Chrono arrow! Dealt ${damage} damage and delayed rival turn timer by +1 move.`;
      updatedPlayerEnergy[1] = Math.min(100, updatedPlayerEnergy[1] + 30);
    } else if (typeId === 'emerald_nature') {
      // Heal lowest health player hero
      let lowestHpIdx = 0;
      let minHp = 99999;
      for (let i = 0; i < playerHp.length; i++) {
        if (playerHp[i] > 0 && playerHp[i] < minHp) {
          minHp = playerHp[i];
          lowestHpIdx = i;
        }
      }
      const healAmount = 300;
      updatedPlayerHp[lowestHpIdx] = Math.min(playerMaxHp[lowestHpIdx], updatedPlayerHp[lowestHpIdx] + healAmount);
      logMessage = `🌿 WILD REGROWTH: Priest restores +${healAmount} HP to wounded comrades.`;
      updatedPlayerEnergy[2] = Math.min(100, updatedPlayerEnergy[2] + 40);
      matchType = 'heal';
    } else if (typeId === 'obsidian_core') {
      // Shield party
      updatedPlayerShield[2] = updatedPlayerShield[2] + 250;
      logMessage = `🛡️ OBSIDIAN BARRICADE: Aethelgard generates +250 shield energy across friendly core.`;
      matchType = 'shield';
    } else if (typeId === 'astral_light') {
      // Splash damage across all opponents
      damage = 180;
      for (let i = 0; i < updatedRivalHp.length; i++) {
        if (updatedRivalHp[i] > 0) {
          updatedRivalHp[i] = Math.max(0, updatedRivalHp[i] - damage);
        }
      }
      logMessage = `⭐ ASTRAL FLASH: Stellar storm Deals ${damage} splash damage across all rival ranks!`;
    } else {
      // Pure potions
      // Restore health and energy
      for (let i = 0; i < updatedPlayerHp.length; i++) {
        if (updatedPlayerHp[i] > 0) {
          updatedPlayerHp[i] = Math.min(playerMaxHp[i], updatedPlayerHp[i] + 150);
          updatedPlayerEnergy[i] = Math.min(playerMaxEnergy[i], updatedPlayerEnergy[i] + 15);
        }
      }
      logMessage = `🧪 ALCHEMY ELIXIR: Restored +150 health and gathered active ultimate energy.`;
      matchType = 'heal';
    }

    setRivalHp(updatedRivalHp);
    setPlayerHp(updatedPlayerHp);
    setPlayerShield(updatedPlayerShield);
    setPlayerEnergy(updatedPlayerEnergy);

    setActiveCombatLogs(prev => [logMessage, ...prev]);

    // Record match to replay
    const matchLog: ReplayEvent = {
      stepIndex: currentEvents.length,
      type: matchType,
      actor: 'Player Match-3',
      detail: logMessage,
      playerHpSnapshot: updatedPlayerHp,
      rivalHpSnapshot: updatedRivalHp,
      tileEmoji: ARENA_TILES_DB.find(db => db.id === typeId)?.emoji
    };
    const nextEvents = [...currentEvents, matchLog];
    setActiveReplayEvents(nextEvents);

    // Verify if opponent is entirely wiped
    const opponentDefeated = updatedRivalHp.every(hp => hp <= 0);
    if (opponentDefeated) {
      triggerArenaVerdict(true, nextEvents);
    } else {
      // If we match, we also tick the rival timer slightly
      tickRivalTimer(nextEvents);
    }
  };

  // Enemy timer ticking down
  const tickRivalTimer = (currentEvents: ReplayEvent[]) => {
    setRivalTimer(prev => {
      const next = prev - 1;
      if (next <= 0) {
        // Opponent executes heavy counter-strike!
        executeRivalStrike(currentEvents);
        return 4; // Reset countdown
      }
      return next;
    });
  };

  const executeRivalStrike = (currentEvents: ReplayEvent[]) => {
    // Find active rival attacker
    let activeRivalIdx = 0;
    for (let i = 0; i < rivalHp.length; i++) {
      if (rivalHp[i] > 0) {
        activeRivalIdx = i;
        break;
      }
    }

    // Decide attack strength
    const baseDmg = activeRivalIdx === 0 ? 250 : activeRivalIdx === 1 ? 350 : 200;
    const skills = [
      "Void Siphon strike",
      "Vanguard Blade Cleave",
      "Spell Piercer shot"
    ];
    const skillName = skills[activeRivalIdx];

    // Strike random player hero who has health remaining
    const livingHeroes = playerHp.map((hp, idx) => (hp > 0 ? idx : -1)).filter(idx => idx !== -1);
    if (livingHeroes.length === 0) return;
    const targetHeroIdx = livingHeroes[Math.floor(Math.random() * livingHeroes.length)];

    const updatedPlayerHp = [...playerHp];
    const updatedPlayerShield = [...playerShield];
    
    // Calculate shield absorption
    let remainingDmg = baseDmg;
    const activeShield = updatedPlayerShield[2]; // Guardian holds aggregate shield
    if (activeShield > 0) {
      if (activeShield >= remainingDmg) {
        updatedPlayerShield[2] = activeShield - remainingDmg;
        remainingDmg = 0;
      } else {
        remainingDmg -= activeShield;
        updatedPlayerShield[2] = 0;
      }
    }

    updatedPlayerHp[targetHeroIdx] = Math.max(0, updatedPlayerHp[targetHeroIdx] - remainingDmg);
    
    setPlayerHp(updatedPlayerHp);
    setPlayerShield(updatedPlayerShield);

    const strikeMsg = `⚠️ RIVAL CONTRA: Rival cast "${skillName}"! Dealt ${baseDmg} damage to ${targetHeroIdx === 0 ? 'Valen' : targetHeroIdx === 1 ? 'Lyra' : 'Aethelgard'} (Shield absorbed ${baseDmg - remainingDmg} HP).`;
    setActiveCombatLogs(prev => [strikeMsg, ...prev]);
    playArenaSound("enemy_damage_burst");

    const rivalLog: ReplayEvent = {
      stepIndex: currentEvents.length,
      type: 'rival_attack',
      actor: 'Rival AI',
      detail: strikeMsg,
      playerHpSnapshot: updatedPlayerHp,
      rivalHpSnapshot: [...rivalHp]
    };
    const nextEvents = [...currentEvents, rivalLog];
    setActiveReplayEvents(nextEvents);

    // Verify if player team is fully wiped
    const playerDefeated = updatedPlayerHp.every(hp => hp <= 0);
    if (playerDefeated) {
      triggerArenaVerdict(false, nextEvents);
    }
  };

  // Triggering Ultimate abilities manually when Energy is 100%
  const triggerHeroUltimate = (heroIdx: number) => {
    if (playerEnergy[heroIdx] < 100 || battleVerdict !== 'playing') return;

    // Reset energy
    const updatedPlayerEnergy = [...playerEnergy];
    updatedPlayerEnergy[heroIdx] = 0;
    setPlayerEnergy(updatedPlayerEnergy);

    const updatedRivalHp = [...rivalHp];
    const updatedPlayerHp = [...playerHp];
    let damage = 0;
    let logMsg = "";

    // Find active target
    let targetRivalIdx = 0;
    for (let i = 0; i < rivalHp.length; i++) {
      if (rivalHp[i] > 0) {
        targetRivalIdx = i;
        break;
      }
    }

    if (heroIdx === 0) {
      // Valen Ultimate
      damage = 650;
      updatedRivalHp[targetRivalIdx] = Math.max(0, updatedRivalHp[targetRivalIdx] - damage);
      logMsg = `🔥 ULTIMATE: Valen Solar unleashes "Solar Inferno Slash"! Dealt ${damage} crit damage to Rival ${targetRivalIdx === 0 ? 'Fighter' : targetRivalIdx === 1 ? 'Ranger' : 'Support'}.`;
    } else if (heroIdx === 1) {
      // Lyra Ultimate
      damage = 450;
      updatedRivalHp[targetRivalIdx] = Math.max(0, updatedRivalHp[targetRivalIdx] - damage);
      setRivalTimer(prev => prev + 2); // Heavy freeze
      logMsg = `❄️ ULTIMATE: Lyra Frost triggers "Glacial Time Barrage"! Dealt ${damage} damage and froze Rival (Delay +2 moves).`;
    } else {
      // Aethelgard Ultimate
      // Restore all health pools by 400
      for (let i = 0; i < updatedPlayerHp.length; i++) {
        if (updatedPlayerHp[i] > 0) {
          updatedPlayerHp[i] = Math.min(playerMaxHp[i], updatedPlayerHp[i] + 400);
        }
      }
      logMsg = `🛡️ ULTIMATE: Aethelgard invokes "Aegis Prism Sanctuary"! Re-shielded party and restored +400 HP to all active allies.`;
    }

    setRivalHp(updatedRivalHp);
    setPlayerHp(updatedPlayerHp);
    setActiveCombatLogs(prev => [logMsg, ...prev]);
    playArenaSound("ultimate_ability_fx");

    const ultLog: ReplayEvent = {
      stepIndex: activeReplayEvents.length,
      type: 'ultimate',
      actor: heroIdx === 0 ? 'Valen' : heroIdx === 1 ? 'Lyra' : 'Aethelgard',
      detail: logMsg,
      playerHpSnapshot: updatedPlayerHp,
      rivalHpSnapshot: updatedRivalHp
    };
    const nextEvents = [...activeReplayEvents, ultLog];
    setActiveReplayEvents(nextEvents);

    const opponentDefeated = updatedRivalHp.every(hp => hp <= 0);
    if (opponentDefeated) {
      triggerArenaVerdict(true, nextEvents);
    }
  };

  // Force concede / exit
  const concedeBattle = () => {
    if (confirm("Concede the competitive match? This counts as a Defeat and decreases Arena ELO.")) {
      triggerArenaVerdict(false, activeReplayEvents);
    }
  };

  // Final match result resolution
  const triggerArenaVerdict = (victory: boolean, finalEvents: ReplayEvent[]) => {
    setBattleVerdict(victory ? 'victory' : 'defeat');
    playArenaSound(victory ? "arena_victory" : "arena_defeat");

    let ratingDiff = 0;
    let earnedMedals = 0;

    if (victory) {
      const eloFactor = selectedDifficulty === 'Easy' ? 12 : selectedDifficulty === 'Medium' ? 24 : 36;
      ratingDiff = eloFactor + Math.floor(Math.random() * 5);
      earnedMedals = selectedDifficulty === 'Easy' ? 15 : selectedDifficulty === 'Medium' ? 30 : 50;

      addLog(`👑 ARENA VICTORY: Defeated Rival ${matchedOpponent?.name}! Rating +${ratingDiff}, Arena Medals +${earnedMedals}.`, 'success');
      
      // Streak updates
      setWins(prev => prev + 1);
      setWinStreak(prev => prev + 1);
    } else {
      ratingDiff = selectedDifficulty === 'Easy' ? -10 : selectedDifficulty === 'Medium' ? -18 : -25;
      earnedMedals = 5; // Defeat consolation

      addLog(`💀 ARENA DEFEAT: Rival outmatched your squad! Rating ${ratingDiff}, Arena Medals +${earnedMedals}.`, 'warning');
      
      setLosses(prev => prev + 1);
      setWinStreak(0);
    }

    const nextRating = Math.max(100, arenaRating + ratingDiff);
    const nextMedals = arenaMedals + earnedMedals;
    
    setArenaRating(nextRating);
    setArenaMedals(nextMedals);
    setTotalMatches(prev => prev + 1);
    if (nextRating > peakRating) setPeakRating(nextRating);

    // Append to Match History ledger
    const newEntry: ArenaHistoryEntry = {
      id: `match_${Date.now()}`,
      rivalName: matchedOpponent?.name || "Rival Siphoner",
      rivalRating: matchedOpponent?.rating || 1000,
      rivalEmoji: matchedOpponent?.emoji || "🔮",
      victory,
      ratingChange: ratingDiff,
      turnsSpent: finalEvents.length,
      timestamp: new Date().toLocaleTimeString(),
      replayEvents: finalEvents
    };

    const nextHistory = [newEntry, ...history].slice(0, 20);
    setHistory(nextHistory);

    // Save
    commitArenaChanges({
      rating: nextRating,
      medals: nextMedals,
      history: nextHistory,
      totalMatches: totalMatches + 1,
      wins: victory ? wins + 1 : wins,
      losses: !victory ? losses + 1 : losses,
      winStreak: victory ? winStreak + 1 : 0,
      peakRating: nextRating > peakRating ? nextRating : peakRating
    });
  };

  // ==========================================
  // PLAYBACK REPLAY CONTROLS
  // ==========================================
  const launchReplayViewer = (entry: ArenaHistoryEntry) => {
    setSelectedReplay(entry);
    setPlaybackIndex(0);
    setIsPlaybackPlaying(false);
    setPlaybackSpeed(1);
    
    if (entry.replayEvents && entry.replayEvents.length > 0) {
      const initial = entry.replayEvents[0];
      setPlaybackPlayerHp(initial.playerHpSnapshot);
      setPlaybackRivalHp(initial.rivalHpSnapshot);
      setPlaybackLogs([`📺 LOADING REPLAY: Player vs ${entry.rivalName}`]);
    }
    setScreen('replay');
    playArenaSound("replay_launch");
  };

  useEffect(() => {
    let timer: any;
    if (isPlaybackPlaying && selectedReplay) {
      const intervalDelay = 1800 / playbackSpeed;
      timer = setInterval(() => {
        setPlaybackIndex(prev => {
          const next = prev + 1;
          if (next >= selectedReplay.replayEvents.length) {
            clearInterval(timer);
            setIsPlaybackPlaying(false);
            addLog("📺 Replay simulation concluded successfully.", "info");
            return prev;
          }

          const currentEv = selectedReplay.replayEvents[next];
          setPlaybackPlayerHp(currentEv.playerHpSnapshot);
          setPlaybackRivalHp(currentEv.rivalHpSnapshot);
          setPlaybackLogs(prevLogs => [currentEv.detail, ...prevLogs]);

          return next;
        });
      }, intervalDelay);
    }
    return () => clearInterval(timer);
  }, [isPlaybackPlaying, selectedReplay, playbackIndex, playbackSpeed]);

  const stepReplayBackward = () => {
    if (!selectedReplay || playbackIndex <= 0) return;
    const prevIdx = playbackIndex - 1;
    const prevEv = selectedReplay.replayEvents[prevIdx];
    setPlaybackIndex(prevIdx);
    setPlaybackPlayerHp(prevEv.playerHpSnapshot);
    setPlaybackRivalHp(prevEv.rivalHpSnapshot);
    setPlaybackLogs(prevLogs => [`◀️ Stepped back: ${prevEv.detail}`, ...prevLogs]);
  };

  const stepReplayForward = () => {
    if (!selectedReplay || playbackIndex >= selectedReplay.replayEvents.length - 1) return;
    const nextIdx = playbackIndex + 1;
    const nextEv = selectedReplay.replayEvents[nextIdx];
    setPlaybackIndex(nextIdx);
    setPlaybackPlayerHp(nextEv.playerHpSnapshot);
    setPlaybackRivalHp(nextEv.rivalHpSnapshot);
    setPlaybackLogs(prevLogs => [`▶️ Stepped forward: ${nextEv.detail}`, ...prevLogs]);
  };

  // ==========================================
  // SPECTATOR SUPPORT ARENA SIMULATION
  // ==========================================
  const launchSpectatorArena = () => {
    const home = createRival('Medium');
    const away = createRival('Hard');
    setSpecHomeOpponent(home);
    setSpecAwayOpponent(away);
    
    setSpecHomeHp([1800, 1500, 2200]);
    setSpecAwayHp([1900, 1400, 2100]);
    setSpecTimer(3);
    setSpecCheerMeter(50);
    setSpecActiveStep(0);
    setSpecLogs(["📣 WELCOME: Live Featured Arena Stream loading...", "👀 Arena audience assembling in stands."]);
    
    setIsSpectating(true);
    setScreen('spectator');
    playArenaSound("spectator_crowd_roar");
  };

  // Auto Tick spectator match
  useEffect(() => {
    let interval: any;
    if (screen === 'spectator' && isSpectating) {
      interval = setInterval(() => {
        setSpecActiveStep(prevStep => {
          const nextStep = prevStep + 1;
          
          // Check terminal conditions
          const homeWiped = specHomeHp.every(hp => hp <= 0);
          const awayWiped = specAwayHp.every(hp => hp <= 0);

          if (homeWiped || awayWiped) {
            setIsSpectating(false);
            clearInterval(interval);
            setSpecLogs(prev => [
              `🏆 STREAM OVER: ${homeWiped ? specAwayOpponent?.name : specHomeOpponent?.name} has triumphed in the colossus arena!`,
              ...prev
            ]);
            return prevStep;
          }

          // Random turn simulation
          const homeTurn = nextStep % 2 === 1;
          const randomDmg = 150 + Math.floor(Math.random() * 200);
          const updatedHomeHp = [...specHomeHp];
          const updatedAwayHp = [...specAwayHp];

          let actionDesc = "";

          if (homeTurn) {
            // Home attacks Away
            const livingAway = updatedAwayHp.map((hp, idx) => (hp > 0 ? idx : -1)).filter(idx => idx !== -1);
            if (livingAway.length > 0) {
              const target = livingAway[Math.floor(Math.random() * livingAway.length)];
              updatedAwayHp[target] = Math.max(0, updatedAwayHp[target] - randomDmg);
              actionDesc = `⚔️ [HOME] ${specHomeOpponent?.name} matched elements and launched crit strike! Deals ${randomDmg} damage to Away roster.`;
              setSpecCheerMeter(prev => Math.min(100, prev + 12));
            }
          } else {
            // Away attacks Home
            const livingHome = updatedHomeHp.map((hp, idx) => (hp > 0 ? idx : -1)).filter(idx => idx !== -1);
            if (livingHome.length > 0) {
              const target = livingHome[Math.floor(Math.random() * livingHome.length)];
              updatedHomeHp[target] = Math.max(0, updatedHomeHp[target] - randomDmg);
              actionDesc = `⚡ [AWAY] ${specAwayOpponent?.name} aligned a triplet and fired a spell! Deals ${randomDmg} damage to Home squad.`;
              setSpecCheerMeter(prev => Math.max(0, prev - 12));
            }
          }

          setSpecHomeHp(updatedHomeHp);
          setSpecAwayHp(updatedAwayHp);
          setSpecLogs(prev => [actionDesc, ...prev]);

          return nextStep;
        });
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [screen, isSpectating, specHomeHp, specAwayHp]);

  // Crowd cheerleader interactives
  const cheerForTeam = (team: 'home' | 'away') => {
    if (team === 'home') {
      setSpecCheerMeter(prev => Math.min(100, prev + 15));
      setSpecLogs(prev => ["🙌 Audience throws Flowers: Friendly team attack power boosts!", ...prev]);
      playArenaSound("crowd_cheer");
    } else {
      setSpecCheerMeter(prev => Math.max(0, prev - 15));
      setSpecLogs(prev => ["🎺 Warhorns sounded: Away team defense buffer increases!", ...prev]);
      playArenaSound("warhorn_blast");
    }
  };

  // ==========================================
  // ARENA SHOP SYSTEM
  // ==========================================
  const buyArenaShopItem = (item: ArenaShopItem) => {
    if (arenaMedals < item.cost) {
      alert("❌ Insufficient Arena Medals! Compete in matches to accumulate tokens.");
      return;
    }

    const updatedShop = shopItems.map(si => {
      if (si.id === item.id) {
        return { ...si, stock: si.stock - 1, purchased: si.stock <= 1 };
      }
      return si;
    });

    const nextMedals = arenaMedals - item.cost;
    setArenaMedals(nextMedals);
    setShopItems(updatedShop);
    addLog(`🛒 SHOP PURCHASE: Bought "${item.name}" for ${item.cost} Arena Medals.`, 'success');
    playArenaSound("shop_buy_success");

    commitArenaChanges({
      medals: nextMedals,
      shop: updatedShop
    });
  };

  // ==========================================
  // MANUAL SEASON RESET
  // ==========================================
  const triggerSeasonReset = () => {
    if (confirm("⚠️ FORCE SEASON ROLLOVER? This will reset ELO ratings toward the 1000 MMR baseline, claim seasonal rewards, and advance to the next competitive calendar season.")) {
      const nextSeason = arenaSeason + 1;
      const seasonalRewardMedals = Math.round(arenaRating * 0.4);
      const nextMedals = arenaMedals + seasonalRewardMedals;
      // Compress ELO
      const nextRating = 1000 + Math.round((arenaRating - 1000) * 0.4);

      setArenaSeason(nextSeason);
      setArenaRating(nextRating);
      setArenaMedals(nextMedals);
      setSeasonCountdown("7d 0h 0m");
      addLog(`📅 SEASON ROLLOVER COMPLETE: Welcome to Season ${nextSeason}! Claimed ${seasonalRewardMedals} medals based on your rating performance. ELO compressed to ${nextRating}.`, 'success');
      playArenaSound("season_rollover_ceremony");

      commitArenaChanges({
        season: nextSeason,
        rating: nextRating,
        medals: nextMedals
      });
    }
  };

  // Claim milestones
  const claimMilestone = (idx: number) => {
    const target = milestones[idx];
    if (arenaRating < target.points || target.claimed) return;

    const updatedMilestones = [...milestones];
    updatedMilestones[idx].claimed = true;
    setMilestones(updatedMilestones);

    // Give some simulation materials
    setArenaMedals(prev => prev + 50);
    addLog(`🎁 CLAIMED REWARD: ${target.rewardName} has been claimed!`, 'success');
    playArenaSound("milestone_claim");

    commitArenaChanges({
      milestones: updatedMilestones,
      medals: arenaMedals + 50
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#06060c] text-zinc-100 p-1 md:p-3 relative font-sans">
      
      {/* HEADER HUD BAR */}
      <div className="bg-zinc-950/80 border border-purple-950/30 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 mb-4 select-none">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-950/40 border border-purple-500/30 rounded-xl flex items-center justify-center shadow-lg relative">
            <TrophyIcon className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div className="text-left">
            <span className="text-[8.5px] font-mono uppercase tracking-wider text-purple-400 font-extrabold block">Altar League Competitive Hub</span>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-serif font-black uppercase text-zinc-100 tracking-wider">Crystal Vault Arena</h3>
              <span className="text-[8.5px] font-mono px-1.5 py-0.5 bg-purple-950 border border-purple-800 text-purple-300 rounded font-black">SEASON {arenaSeason}</span>
            </div>
          </div>
        </div>

        {/* STATS CURRENCY DISPATCH */}
        <div className="flex items-center gap-6 font-mono text-xs">
          <div className="text-left">
            <span className="text-[7.5px] text-zinc-550 block uppercase font-bold">COMPETITIVE ELO</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="font-black text-white text-sm">{arenaRating} MMR</span>
              <span className="text-[8px] text-zinc-500 uppercase">
                ({arenaRating >= 2000 ? 'Legend' : arenaRating >= 1650 ? 'Diamond' : arenaRating >= 1400 ? 'Gold' : arenaRating >= 1200 ? 'Silver' : 'Bronze'})
              </span>
            </div>
          </div>

          <div className="text-left">
            <span className="text-[7.5px] text-zinc-550 block uppercase font-bold">ARENA MEDALS</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <ShoppingBag className="w-4 h-4 text-purple-400" />
              <span className="font-black text-purple-300 text-sm">{arenaMedals} Medals</span>
            </div>
          </div>

          <div className="text-left hidden sm:block">
            <span className="text-[7.5px] text-zinc-550 block uppercase font-bold">SEASON TIMER</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span className="text-zinc-350">{seasonCountdown}</span>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* ==========================================
            SCREEN 1: THE ARENA LOBBY (MAIN)
            ========================================== */}
        {screen === 'lobby' && (
          <motion.div
            key="lobby"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0 overflow-y-auto"
          >
            {/* LEFT PANEL: MATCH PANEL & OPPONENT SELECTION (7/12) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              
              {/* DIVISION MATCHMAKING SELECTOR CONTAINER */}
              <div className="bg-gradient-to-r from-zinc-950 to-[#0e0920]/40 border border-purple-950/40 rounded-2xl p-5 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 blur-[80px] rounded-full pointer-events-none" />
                
                <h4 className="text-xs font-serif font-black uppercase text-amber-100 tracking-wider mb-1">Engage Competitive Duel</h4>
                <p className="text-[10.5px] text-zinc-400 leading-normal max-w-xl">
                  Deploy your legendary squad into the Altar Arena. Choose a rival caliber and sough matches. Wins grant ELO, claim medals, and advance your ladder division.
                </p>

                {/* SELECT RIVAL CALIBER */}
                <div className="grid grid-cols-3 gap-3 my-4">
                  {[
                    { id: 'Easy', color: 'border-emerald-500/20 text-emerald-400 hover:border-emerald-500', bg: 'bg-emerald-950/10', desc: 'Slightly lower ELO', reward: '+15 Medals' },
                    { id: 'Medium', color: 'border-indigo-500/20 text-indigo-400 hover:border-indigo-500', bg: 'bg-indigo-950/10', desc: 'Even Match Elo', reward: '+30 Medals' },
                    { id: 'Hard', color: 'border-rose-500/20 text-rose-400 hover:border-rose-500', bg: 'bg-rose-950/10', desc: 'Superior Elite caliber', reward: '+50 Medals' }
                  ].map(lvl => (
                    <button
                      key={lvl.id}
                      onClick={() => { setSelectedDifficulty(lvl.id as any); playArenaSound("mode_select_click"); }}
                      className={`p-3 rounded-xl border flex flex-col text-left transition-all relative ${lvl.bg} ${lvl.color} ${
                        selectedDifficulty === lvl.id ? 'ring-2 ring-purple-500 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.15)] bg-purple-950/10' : 'hover:bg-zinc-900/30 cursor-pointer'
                      }`}
                    >
                      <span className="text-[10.5px] font-black uppercase tracking-wide">{lvl.id} Caliber</span>
                      <span className="text-[7.5px] text-zinc-500 mt-1 font-mono">{lvl.desc}</span>
                      <span className="text-[8.5px] text-amber-400/80 mt-2 font-mono font-bold block">{lvl.reward}</span>
                    </button>
                  ))}
                </div>

                {/* DEPLOY BUTTONS */}
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={startMatchmakingFlow}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white font-mono text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/10"
                  >
                    <Swords className="w-4 h-4 animate-bounce" />
                    <span>Initiate Matchmaking Search</span>
                  </button>

                  <button
                    onClick={launchSpectatorArena}
                    className="px-4 py-3 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 font-mono text-xs font-bold uppercase rounded-xl cursor-pointer transition-all flex items-center gap-1.5"
                    title="Watch automated live featured matches"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Spectate Stream</span>
                  </button>
                </div>
              </div>

              {/* PROGRESSION ROAD MILESTONES */}
              <div className="bg-zinc-950/40 border border-zinc-900/60 rounded-2xl p-4 text-left">
                <span className="text-[8.5px] font-mono text-zinc-550 uppercase tracking-wider font-extrabold block mb-3">Trophy Milestone Ladder</span>
                <div className="flex items-center gap-4 overflow-x-auto pb-2 min-w-0">
                  {milestones.map((m, idx) => {
                    const isUnlocked = arenaRating >= m.points;
                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-left shrink-0 w-36 relative ${
                          m.claimed
                            ? 'bg-zinc-950 border-zinc-900 text-zinc-500 opacity-60'
                            : isUnlocked
                              ? 'bg-purple-950/20 border-purple-500/50 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.1)]'
                              : 'bg-zinc-900/40 border-zinc-850 text-zinc-400'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[9px] font-mono font-bold text-zinc-500">{m.points} MMR</span>
                          <span className="text-xs">{m.rewardIcon}</span>
                        </div>
                        <h5 className="text-[10px] font-black uppercase truncate text-zinc-200">{m.rewardName}</h5>
                        <p className="text-[7px] text-zinc-500 leading-normal mt-1 block truncate">{m.rewardDesc}</p>
                        
                        {isUnlocked && !m.claimed && (
                          <button
                            onClick={() => claimMilestone(idx)}
                            className="mt-2 w-full py-1 text-[8.5px] font-mono font-black bg-purple-600 hover:bg-purple-500 text-white rounded cursor-pointer transition-all uppercase"
                          >
                            Claim Box
                          </button>
                        )}
                        {m.claimed && (
                          <span className="mt-2 text-[8px] font-mono text-emerald-400 block text-center uppercase font-bold">Claimed ✓</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* RECENT MATCH HISTORY & HISTORY LEDGER */}
              <div className="bg-[#020204] border border-zinc-900 rounded-2xl p-4 text-left flex-1 min-h-[180px] flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-zinc-400" />
                      <span className="text-[9.5px] font-mono text-zinc-350 uppercase tracking-wider font-extrabold">Competitive Match Ledger</span>
                    </div>
                    <span className="text-[8px] font-mono text-zinc-550">Last 20 duels</span>
                  </div>

                  {history.length === 0 ? (
                    <div className="text-center py-8 text-zinc-650 font-mono text-[10px]">
                      <span>No competitive match records discovered in local ledger.</span>
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                      {history.map(entry => (
                        <div key={entry.id} className="p-2 bg-zinc-950 border border-zinc-900/50 rounded-lg flex items-center justify-between font-mono text-[9px]">
                          <div className="flex items-center gap-2">
                            <span className="text-xs">{entry.rivalEmoji}</span>
                            <div>
                              <span className="text-zinc-350 font-black block">{entry.rivalName}</span>
                              <span className="text-[7.5px] text-zinc-550 block">Rival ELO: {entry.rivalRating} • {entry.turnsSpent} Turns</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className={`font-black ${entry.victory ? 'text-emerald-400' : 'text-rose-500'}`}>
                              {entry.victory ? 'VICTORY' : 'DEFEAT'} ({entry.ratingChange > 0 ? `+${entry.ratingChange}` : entry.ratingChange})
                            </span>
                            <button
                              onClick={() => launchReplayViewer(entry)}
                              className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-zinc-400 text-[8px] flex items-center gap-1 cursor-pointer transition-all"
                            >
                              <Play className="w-2.5 h-2.5" />
                              <span>Replay</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center border-t border-zinc-900/60 pt-3 text-[9.5px] text-zinc-550 font-mono">
                  <span>DUEL DECK: [Valen, Lyra, Aethelgard]</span>
                  <button
                    onClick={() => {
                      if (confirm("Reset local Arena competitive statistics to baseline ELO?")) {
                        initializeFreshStates();
                        addLog("🧹 Arena statistics reset complete.", "warning");
                      }
                    }}
                    className="text-zinc-650 hover:text-zinc-400 text-[8.5px] cursor-pointer"
                  >
                    Reset Statistics
                  </button>
                </div>
              </div>

            </div>

            {/* RIGHT PANEL: LEADERBOARD, STATISTICS, SHOP (5/12) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              
              {/* LEADERBOARD VIEW */}
              <div className="bg-[#020204] border border-zinc-900 rounded-2xl p-4 text-left flex flex-col justify-between min-h-[220px]">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[9.5px] font-mono text-zinc-350 uppercase tracking-wider font-extrabold">Global Leaderboard (S1)</span>
                    <button
                      onClick={triggerSeasonReset}
                      className="px-2 py-0.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 font-mono text-[7.5px] rounded uppercase cursor-pointer"
                      title="End Season & claim ranking multiplier"
                    >
                      Bypass Rollover
                    </button>
                  </div>

                  <div className="space-y-1 max-h-[180px] overflow-y-auto pr-1">
                    {leaderboard.map(entry => (
                      <div
                        key={entry.rank}
                        className={`p-2 rounded-lg border font-mono text-[9px] flex items-center justify-between ${
                          entry.isPlayer
                            ? 'bg-purple-950/20 border-purple-500/50 text-purple-300'
                            : 'bg-zinc-950 border-zinc-900/20 text-zinc-400'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`text-[8.5px] font-bold w-4 text-center ${entry.rank === 1 ? 'text-amber-400' : entry.rank === 2 ? 'text-zinc-300' : 'text-zinc-550'}`}>
                            #{entry.rank}
                          </span>
                          <span className="text-xs">{entry.emoji}</span>
                          <div>
                            <span className={`font-black ${entry.isPlayer ? 'text-purple-300' : 'text-zinc-300'}`}>{entry.name}</span>
                            <span className="text-[7.5px] text-zinc-550 block">{entry.guild}</span>
                          </div>
                        </div>

                        <span className="font-bold text-zinc-200">{entry.rating} MMR</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ARENA STATISTICS */}
              <div className="bg-[#020204] border border-zinc-900 rounded-2xl p-4 text-left font-mono text-[10px]">
                <span className="text-[9.5px] text-zinc-350 uppercase tracking-wider font-extrabold block mb-3">Historic Competitions</span>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-2.5">
                    <span className="text-zinc-550 block text-[7.5px]">TOTAL DUELS</span>
                    <span className="font-black text-sm text-zinc-200 block mt-1">{totalMatches} duels</span>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-2.5">
                    <span className="text-zinc-550 block text-[7.5px]">WIN RATIO</span>
                    <span className="font-black text-sm text-emerald-400 block mt-1">
                      {totalMatches > 0 ? `${Math.round((wins / totalMatches) * 100)}%` : '0%'}
                    </span>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-2.5">
                    <span className="text-zinc-550 block text-[7.5px]">WIN STREAK</span>
                    <span className="font-black text-sm text-purple-400 block mt-1">{winStreak} streak</span>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-2.5">
                    <span className="text-zinc-550 block text-[7.5px]">PEAK RATIO</span>
                    <span className="font-black text-sm text-amber-400 block mt-1">{peakRating} MMR</span>
                  </div>
                </div>
              </div>

              {/* ARENA SHOP */}
              <div className="bg-zinc-950/40 border border-zinc-900/60 rounded-2xl p-4 text-left">
                <span className="text-[9.5px] font-mono text-zinc-350 uppercase tracking-wider font-extrabold block mb-3">Arena Shop Exchange</span>
                
                <div className="space-y-2">
                  {shopItems.slice(0, 3).map(item => (
                    <div key={item.id} className="p-2.5 bg-black/45 border border-zinc-900 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5 text-left">
                        <span className="text-lg">{item.emoji}</span>
                        <div>
                          <h6 className="font-bold text-[10.5px] text-zinc-200 leading-tight">{item.name}</h6>
                          <p className="text-[8px] text-zinc-500 leading-normal max-w-[150px]">{item.desc}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => buyArenaShopItem(item)}
                        disabled={item.purchased || arenaMedals < item.cost}
                        className={`px-3 py-1.5 rounded-lg font-mono text-[9px] font-black uppercase transition-all shrink-0 ${
                          item.purchased
                            ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
                            : arenaMedals >= item.cost
                              ? 'bg-purple-600 hover:bg-purple-500 text-white cursor-pointer active:scale-95'
                              : 'bg-zinc-950 border border-zinc-900 text-zinc-600 cursor-not-allowed'
                        }`}
                      >
                        {item.purchased ? 'Claimed' : `${item.cost} Med`}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* ==========================================
            SCREEN 2: MATCHMAKING SEARCH SCREEN
            ========================================== */}
        {screen === 'matchmaking' && (
          <motion.div
            key="matchmaking"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center p-6 text-center select-none min-h-[400px] bg-zinc-950/90 rounded-2xl border border-zinc-900"
          >
            <div className="relative w-24 h-24 mb-6">
              {/* Spinning visual radar scopes */}
              <div className="absolute inset-0 border border-purple-500 border-dashed rounded-full animate-spin" style={{ animationDuration: '6s' }} />
              <div className="absolute inset-2 border border-indigo-400/30 rounded-full animate-ping" />
              <div className="absolute inset-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Search className="w-8 h-8 text-purple-400" />
              </div>
            </div>

            <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-extrabold block">Altar Matchmaking Registry</span>
            <h4 className="text-md font-serif font-black uppercase text-white mt-1 tracking-wider">Scanning Competitors Ledger</h4>
            
            <p className="text-xs text-zinc-400 max-w-sm mt-2.5 leading-relaxed">
              Expanding Elo query parameter window: <strong className="text-zinc-250">+/- {searchEloRange} MMR</strong>
            </p>

            <div className="bg-[#020204] border border-zinc-900 rounded-xl p-3 my-5 w-64 font-mono text-[10px] text-left">
              <div className="flex justify-between mb-1.5">
                <span className="text-zinc-550">Target Caliber:</span>
                <span className="text-indigo-400 font-bold">{selectedDifficulty} division</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-550">Active MMR:</span>
                <span className="text-white font-bold">{arenaRating} Elo</span>
              </div>
            </div>

            <AnimatePresence>
              {matchedOpponent && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-purple-950/20 border border-purple-500/40 rounded-2xl p-5 w-full max-w-sm flex flex-col items-center shadow-lg"
                >
                  <span className="text-[8px] font-mono text-amber-400 font-black tracking-widest uppercase block mb-1">Rival Match Confirmed!</span>
                  <div className="flex items-center gap-3 my-2 text-left w-full">
                    <div className="w-12 h-12 rounded-xl border border-zinc-800 bg-zinc-950 flex items-center justify-center text-xl shrink-0">
                      {matchedOpponent.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-serif font-black text-white text-sm tracking-wide truncate">{matchedOpponent.name}</h5>
                      <span className="text-[9.5px] font-mono text-zinc-400 block mt-0.5">{matchedOpponent.title}</span>
                      <span className="text-[8px] font-mono text-zinc-550 block">GUILD: {matchedOpponent.guild}</span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-amber-400 font-mono font-black block text-xs">{matchedOpponent.rating} MMR</span>
                      <span className="text-[7.5px] text-zinc-500 font-mono uppercase block">{matchedOpponent.difficulty} rival</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 w-full mt-4 font-mono text-[9px] text-zinc-400 border-t border-purple-950/40 pt-3">
                    <div className="flex-1 text-center">
                      <span className="text-zinc-550 block">SQUAD POWER</span>
                      <span className="text-zinc-200 font-bold">{matchedOpponent.power}</span>
                    </div>
                    <div className="flex-1 text-center border-l border-purple-950/30">
                      <span className="text-zinc-550 block">WIN RATIO</span>
                      <span className="text-zinc-200 font-bold">{matchedOpponent.winRate}%</span>
                    </div>
                    <div className="flex-1 text-center border-l border-purple-950/30">
                      <span className="text-zinc-550 block">PLAYSTYLE</span>
                      <span className="text-zinc-200 font-bold truncate block max-w-[80px]">{matchedOpponent.playstyle}</span>
                    </div>
                  </div>

                  <button
                    onClick={initializeArenaMatch}
                    className="mt-5 w-full py-2.5 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:brightness-110 text-white font-mono text-xs font-black uppercase rounded-xl cursor-pointer transition-all uppercase shadow-lg shadow-emerald-500/5"
                  >
                    Enter Altar Duel Arena
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {!matchedOpponent && (
              <button
                onClick={() => setScreen('lobby')}
                className="mt-6 text-[10.5px] font-mono text-zinc-500 hover:text-zinc-300 underline cursor-pointer"
              >
                Cancel Searching Queue
              </button>
            )}
          </motion.div>
        )}

        {/* ==========================================
            SCREEN 3: ACTIVE COMBAT BOARD & ALIGNER
            ========================================== */}
        {screen === 'combat' && (
          <motion.div
            key="combat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col justify-between min-h-0"
          >
            {/* SUB HEADER BACK BUTTON */}
            <div className="flex justify-between items-center mb-3 select-none">
              <button
                onClick={concedeBattle}
                className="px-3 py-1.5 bg-zinc-950 border border-zinc-900 rounded-lg hover:text-white hover:bg-zinc-900 text-zinc-400 font-mono text-[9px] uppercase font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Concede Match (Concede)</span>
              </button>

              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                <span>ACTIVE MATCH: VS <strong className="text-indigo-400">{matchedOpponent?.name?.toUpperCase()}</strong></span>
                <span className="text-zinc-550">•</span>
                <span>RIVAL TIMER: <strong className="text-rose-400">{rivalTimer} moves left</strong></span>
              </div>
            </div>

            {/* MAIN INTERACTIVE SPLIT SCREEN AREA */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0 items-stretch">
              
              {/* LEFT COLUMN: THE COMBAT ARENA HUD - BOTH TEAMS (5/12) */}
              <div className="lg:col-span-5 bg-zinc-950/40 border border-zinc-900/60 rounded-2xl p-4 flex flex-col justify-between h-full min-h-[380px] text-left">
                
                {/* RIVAL SQUAD ROSTER (TOP) */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[8.5px] font-mono text-rose-400 font-black uppercase tracking-wider">Rival Active Core</span>
                    <span className="text-[7.5px] font-mono text-zinc-550">RATING: {matchedOpponent?.rating} MMR</span>
                  </div>

                  <div className="space-y-2">
                    {[
                      { id: 0, name: 'Rival Fighter', emoji: '⚔️', maxHp: rivalMaxHp[0] },
                      { id: 1, name: 'Rival Ranger', emoji: '🏹', maxHp: rivalMaxHp[1] },
                      { id: 2, name: 'Rival Cleric', emoji: '🧪', maxHp: rivalMaxHp[2] }
                    ].map((riv, i) => {
                      const hp = rivalHp[i];
                      const pct = (hp / riv.maxHp) * 100;
                      return (
                        <div key={riv.id} className="p-2 bg-zinc-950 border border-zinc-900 rounded-xl relative overflow-hidden flex items-center gap-3">
                          <div className={`w-8 h-8 rounded bg-zinc-900 border border-zinc-850 flex items-center justify-center text-md shrink-0 ${hp <= 0 ? 'opacity-30' : ''}`}>
                            {hp <= 0 ? '💀' : riv.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center text-[9px] font-mono">
                              <span className="font-bold text-zinc-350">{riv.name}</span>
                              <span className="text-zinc-400 font-bold">{hp} / {riv.maxHp} HP</span>
                            </div>
                            
                            {/* Health progress bar */}
                            <div className="w-full h-1.5 bg-zinc-900 rounded-full mt-1.5 overflow-hidden">
                              <div
                                style={{ width: `${pct}%` }}
                                className={`h-full transition-all duration-300 ${pct > 50 ? 'bg-rose-500' : pct > 20 ? 'bg-orange-500' : 'bg-red-600'}`}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* LOGS CONSOLE (CENTER) */}
                <div className="flex-1 my-3 bg-[#030306] border border-zinc-900 rounded-xl p-3 font-mono text-[8.5px] overflow-y-auto max-h-[120px] space-y-1">
                  {activeCombatLogs.map((log, idx) => (
                    <div key={idx} className={log.startsWith('🔥') || log.startsWith('❄️') || log.startsWith('🌿') || log.startsWith('🛡️') ? 'text-indigo-300' : log.startsWith('⚠️') ? 'text-rose-400' : 'text-zinc-500'}>
                      {log}
                    </div>
                  ))}
                </div>

                {/* FRIENDLY SQUAD ROSTER (BOTTOM) */}
                <div>
                  <span className="text-[8.5px] font-mono text-emerald-400 font-black uppercase tracking-wider block mb-2">Friendly Guardians</span>
                  
                  <div className="space-y-2">
                    {[
                      { idx: 0, name: 'Valen Solar', title: 'Infantry', color: 'bg-rose-500' },
                      { idx: 1, name: 'Lyra Frost', title: 'Marksmen', color: 'bg-cyan-500' },
                      { idx: 2, name: 'Aethelgard Bastion', title: 'Guardian', color: 'bg-amber-500' }
                    ].map(hero => {
                      const hp = playerHp[hero.idx];
                      const max = playerMaxHp[hero.idx];
                      const pct = (hp / max) * 100;
                      const energy = playerEnergy[hero.idx];
                      
                      return (
                        <div key={hero.idx} className="p-2 bg-zinc-950 border border-zinc-900 rounded-xl flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center text-[9px] font-mono">
                              <span className="font-bold text-zinc-350">{hero.name} ({hero.title})</span>
                              <span className="text-zinc-400 font-bold">{hp} / {max} HP</span>
                            </div>

                            {/* HP bar */}
                            <div className="w-full h-1.5 bg-zinc-900 rounded-full mt-1.5 overflow-hidden relative">
                              <div
                                style={{ width: `${pct}%` }}
                                className={`h-full transition-all duration-300 ${hero.color}`}
                              />
                            </div>
                          </div>

                          {/* Triggerable Ultimate button */}
                          <button
                            onClick={() => triggerHeroUltimate(hero.idx)}
                            disabled={energy < 100 || hp <= 0 || battleVerdict !== 'playing'}
                            className={`w-14 py-1 rounded font-mono text-[8px] uppercase tracking-tighter shrink-0 transition-all font-black ${
                              energy >= 100 && hp > 0 && battleVerdict === 'playing'
                                ? 'bg-amber-500 animate-pulse text-black cursor-pointer shadow-[0_0_10px_#f59e0b]'
                                : 'bg-zinc-900 border border-zinc-850 text-zinc-600 cursor-not-allowed'
                            }`}
                          >
                            {energy >= 100 ? 'ULT ACTIVE' : `${energy}% NRG`}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN: MAHJONG PUZZLE ALIGNER BOARD (7/12) */}
              <div className="lg:col-span-7 flex flex-col justify-between h-full min-h-0">
                
                {/* INTERACTIVE ALIGNER MAT */}
                <div className="flex-1 flex items-center justify-center min-h-[340px] p-2 overflow-hidden relative bg-[#040408]/40 border border-zinc-900/30 rounded-2xl mb-4">
                  
                  {/* VICTORY OVERLAYS */}
                  <AnimatePresence>
                    {battleVerdict !== 'playing' && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-[#030306]/95 flex flex-col items-center justify-center z-40 p-6 text-center select-none"
                      >
                        {battleVerdict === 'victory' ? (
                          <CheckCircle className="w-12 h-12 text-emerald-500 mb-3 animate-bounce" />
                        ) : (
                          <XCircle className="w-12 h-12 text-rose-500 mb-3 animate-pulse" />
                        )}
                        <h3 className="font-serif font-black text-lg text-white uppercase tracking-widest">
                          {battleVerdict === 'victory' ? 'Duel Triumph!' : 'Defeated in Arena'}
                        </h3>
                        <p className="text-xs text-zinc-400 max-w-sm mt-1.5 leading-relaxed">
                          {battleVerdict === 'victory' 
                            ? 'You have successfully alignment-matched elemental sigils to obliterate opposing rival siphoner squad.' 
                            : 'The rival heroes have fully collapsed your front ranks. Better luck on the next alignment matching.'}
                        </p>

                        <button
                          onClick={() => setScreen('lobby')}
                          className="mt-6 px-6 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-white font-mono text-xs font-bold uppercase rounded-full cursor-pointer border border-zinc-800 transition-all active:scale-95"
                        >
                          Return to Arena Lobby
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ACTIVE BOARD TILE LAYOUT GRID */}
                  <div className="relative w-full max-w-[500px] h-[300px] select-none">
                    {combatBoard.map((tile) => {
                      const type = ARENA_TILES_DB.find(t => t.id === tile.typeId) || ARENA_TILES_DB[0];
                      
                      const topPos = tile.y * 55 + 10;
                      const leftPos = tile.x * 75 + 20;
                      const zIndexValue = 10 + tile.z;
                      const shadowOffset = tile.z * 3;

                      return (
                        <div
                          key={tile.id}
                          onClick={() => clickBoardTile(tile)}
                          style={{
                            position: 'absolute',
                            top: `${topPos}px`,
                            left: `${leftPos}px`,
                            zIndex: zIndexValue,
                            width: '70px',
                            height: '52px'
                          }}
                          className="group cursor-pointer transition-all duration-200"
                        >
                          <div
                            style={{
                              transform: tile.isBlocked ? 'none' : `translate(${-tile.z * 2}px, ${-tile.z * 2}px)`,
                              boxShadow: tile.isBlocked 
                                ? 'none' 
                                : `${shadowOffset}px ${shadowOffset}px 8px rgba(0, 0, 0, 0.75)`
                            }}
                            className={`w-full h-full rounded-lg border flex flex-col justify-between p-1 transition-all relative ${
                              tile.isBlocked
                                ? 'bg-zinc-950/90 border-zinc-900/60 text-zinc-650 filter brightness-40 pointer-events-none'
                                : `${type.bgColor} ${type.border} text-white hover:brightness-110 active:scale-95`
                            }`}
                          >
                            <span className="text-[6.5px] font-mono opacity-40">L{tile.z}</span>
                            <div className="text-center text-xs -mt-1">{type.emoji}</div>
                            <span className="text-[6.5px] font-mono opacity-50 block text-right">{type.label}</span>
                          </div>
                        </div>
                      );
                    })}

                    {combatBoard.length === 0 && battleVerdict === 'playing' && (
                      <div className="absolute inset-0 flex items-center justify-center text-zinc-500 font-mono text-xs">
                        <span>Re-populating board elements...</span>
                      </div>
                    )}
                  </div>

                </div>

                {/* RELIC ALTAR TRAY */}
                <div className="bg-[#050508] border border-purple-950/40 rounded-2xl p-3 relative overflow-hidden shadow-[inset_0_4px_24px_rgba(0,0,0,0.8)]">
                  <div className="absolute inset-x-3.5 top-3.5 bottom-3.5 flex justify-between pointer-events-none">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div key={i} className="flex-1 max-w-[42px] mx-1 rounded-lg border border-dashed border-zinc-900/50 bg-[#020204]/20" />
                    ))}
                  </div>

                  <div className="relative flex justify-center items-center min-h-[52px] gap-1 select-none">
                    {combatTray.map((tile, index) => {
                      const type = ARENA_TILES_DB.find(t => t.id === tile.typeId) || ARENA_TILES_DB[0];
                      return (
                        <div
                          key={`${tile.id}_tray_${index}`}
                          className={`w-9 h-11 rounded-md border ${type.bgColor} ${type.border} flex flex-col justify-between p-1 z-10`}
                        >
                          <span className="text-[5.5px] font-mono opacity-40">Alt</span>
                          <div className="text-center text-[10px]">{type.emoji}</div>
                          <div className="w-1 h-1 rounded-full bg-purple-400 self-end" />
                        </div>
                      );
                    })}

                    {combatTray.length === 0 && (
                      <span className="text-[8.5px] uppercase font-mono tracking-widest text-zinc-550 z-10 pointer-events-none">
                        🔮 PLACE RUNES INSIDE THE MATCH ALTAR
                      </span>
                    )}
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* ==========================================
            SCREEN 4: REPLAY PLAYBACK CONTROLS
            ========================================== */}
        {screen === 'replay' && selectedReplay && (
          <motion.div
            key="replay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col justify-between min-h-0"
          >
            {/* SUB-HEADER */}
            <div className="flex justify-between items-center mb-3 select-none">
              <button
                onClick={() => { setIsPlaybackPlaying(false); setScreen('lobby'); }}
                className="px-3 py-1.5 bg-zinc-950 border border-zinc-900 rounded-lg hover:text-white hover:bg-zinc-900 text-zinc-400 font-mono text-[9px] uppercase font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Exit Replay</span>
              </button>

              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                <span>REPLAY: VS <strong className="text-indigo-400">{selectedReplay.rivalName.toUpperCase()}</strong></span>
                <span className="text-zinc-550">•</span>
                <span>STEP: <strong className="text-purple-400">{playbackIndex + 1} / {selectedReplay.replayEvents.length}</strong></span>
              </div>
            </div>

            {/* REPLAY CINEMATIC SCENE */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0 items-stretch">
              
              {/* REPLAY ROSTER SNAPSHOTS (5/12) */}
              <div className="lg:col-span-5 bg-zinc-950/40 border border-zinc-900/60 rounded-2xl p-4 flex flex-col justify-between h-full text-left font-mono">
                
                {/* RIVAL REMAINDERS */}
                <div>
                  <span className="text-[8px] text-zinc-550 uppercase tracking-wider block mb-2 font-black">Rival Health Snapshot</span>
                  <div className="space-y-2">
                    {playbackRivalHp.map((hp, idx) => {
                      const max = [1600, 1100, 1800][idx];
                      const pct = (hp / max) * 100;
                      return (
                        <div key={idx} className="p-2 bg-zinc-950 border border-zinc-900 rounded-lg flex items-center justify-between text-[9px]">
                          <span>Rival hero #{idx + 1}</span>
                          <div className="flex-1 mx-3 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                            <div style={{ width: `${pct}%` }} className="h-full bg-rose-500" />
                          </div>
                          <span className="font-bold">{hp} HP</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* PLAYBACK EVENTS SCROLLER (CENTER) */}
                <div className="flex-1 my-4 bg-black border border-zinc-900 rounded-xl p-3 text-[8.5px] overflow-y-auto max-h-[140px] space-y-1">
                  {playbackLogs.map((log, i) => (
                    <div key={i} className="text-indigo-300">
                      {log}
                    </div>
                  ))}
                </div>

                {/* PLAYER HP REMAINDERS */}
                <div>
                  <span className="text-[8px] text-zinc-550 uppercase tracking-wider block mb-2 font-black">Friendly Health Snapshot</span>
                  <div className="space-y-2">
                    {playbackPlayerHp.map((hp, idx) => {
                      const max = [1500, 1200, 2000][idx];
                      const pct = (hp / max) * 100;
                      return (
                        <div key={idx} className="p-2 bg-zinc-950 border border-zinc-900 rounded-lg flex items-center justify-between text-[9px]">
                          <span>{[ 'Valen Solar', 'Lyra Frost', 'Aethelgard' ][idx]}</span>
                          <div className="flex-1 mx-3 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                            <div style={{ width: `${pct}%` }} className="h-full bg-emerald-500" />
                          </div>
                          <span className="font-bold">{hp} HP</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* REPLAY VIRTUAL BOARD CONSOLE (7/12) */}
              <div className="lg:col-span-7 bg-[#020204] border border-zinc-900 rounded-2xl p-5 flex flex-col justify-between items-center text-center">
                
                <div>
                  <Award className="w-8 h-8 text-amber-400 mx-auto animate-pulse mb-2" />
                  <span className="text-[8.5px] font-mono text-zinc-500 uppercase block tracking-wider">Cinematic Replay Stream</span>
                  <h4 className="text-sm font-serif font-black text-white mt-0.5 uppercase tracking-wide">MATCH RE-CONSTITUTION ACTION</h4>
                </div>

                {/* ACTIVE STEP CARDS DISPLAY */}
                {selectedReplay.replayEvents[playbackIndex] && (
                  <div className="p-5 bg-zinc-950 border border-purple-950/40 rounded-2xl max-w-sm w-full my-5 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-1 font-mono text-[7px] text-zinc-650">ACTION #{playbackIndex + 1}</div>
                    
                    <span className="text-[8.5px] font-mono uppercase text-purple-400 font-extrabold block">
                      Actor: {selectedReplay.replayEvents[playbackIndex].actor}
                    </span>
                    <h5 className="text-xs font-serif font-bold text-white mt-1">
                      {selectedReplay.replayEvents[playbackIndex].type.toUpperCase()} ACTION
                    </h5>
                    
                    {selectedReplay.replayEvents[playbackIndex].tileEmoji && (
                      <div className="text-2xl my-3 animate-bounce">{selectedReplay.replayEvents[playbackIndex].tileEmoji}</div>
                    )}

                    <p className="text-[10px] text-zinc-400 mt-2 font-mono leading-relaxed bg-[#030306] p-2.5 rounded border border-zinc-900">
                      {selectedReplay.replayEvents[playbackIndex].detail}
                    </p>
                  </div>
                )}

                {/* PLAYBACK MEDIA CONTROLS BAR */}
                <div className="flex items-center gap-4 border-t border-zinc-900 pt-4 w-full select-none">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={stepReplayBackward}
                      disabled={playbackIndex <= 0}
                      className="p-2 bg-zinc-900 hover:bg-zinc-850 rounded-lg text-zinc-400 cursor-pointer disabled:opacity-40"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setIsPlaybackPlaying(!isPlaybackPlaying)}
                      className="p-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg cursor-pointer"
                    >
                      {isPlaybackPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                    </button>

                    <button
                      onClick={stepReplayForward}
                      disabled={playbackIndex >= selectedReplay.replayEvents.length - 1}
                      className="p-2 bg-zinc-900 hover:bg-zinc-850 rounded-lg text-zinc-400 cursor-pointer disabled:opacity-40"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Playback progress slider */}
                  <div className="flex-1 min-w-0">
                    <input
                      type="range"
                      min={0}
                      max={selectedReplay.replayEvents.length - 1}
                      value={playbackIndex}
                      onChange={(e) => {
                        const idx = parseInt(e.target.value);
                        setPlaybackIndex(idx);
                        const ev = selectedReplay.replayEvents[idx];
                        setPlaybackPlayerHp(ev.playerHpSnapshot);
                        setPlaybackRivalHp(ev.rivalHpSnapshot);
                      }}
                      className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>

                  {/* Speed button selector */}
                  <div className="flex items-center gap-1 font-mono text-[9px]">
                    {[1, 2, 4].map(s => (
                      <button
                        key={s}
                        onClick={() => setPlaybackSpeed(s)}
                        className={`px-1.5 py-1 rounded border uppercase ${
                          playbackSpeed === s
                            ? 'bg-purple-950 border-purple-500 text-purple-300 font-bold'
                            : 'bg-zinc-900 border-zinc-850 text-zinc-500 cursor-pointer'
                        }`}
                      >
                        {s}x
                      </button>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* ==========================================
            SCREEN 5: SPECTATOR STREAM CINEMA
            ========================================== */}
        {screen === 'spectator' && specHomeOpponent && specAwayOpponent && (
          <motion.div
            key="spectator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col justify-between min-h-0"
          >
            {/* SUB HEADER BACK BUTTON */}
            <div className="flex justify-between items-center mb-3 select-none">
              <button
                onClick={() => { setIsSpectating(false); setScreen('lobby'); }}
                className="px-3 py-1.5 bg-zinc-950 border border-zinc-900 rounded-lg hover:text-white hover:bg-zinc-900 text-zinc-400 font-mono text-[9px] uppercase font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Exit Spectator Stream</span>
              </button>

              <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                <span>SPECTATING FEATURED: <strong className="text-amber-400">LIVE COLOSEUM</strong></span>
                <span className="text-zinc-550">•</span>
                <span className="animate-pulse text-red-500 font-black flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>LIVE TRANSMISSION</span>
                </span>
              </div>
            </div>

            {/* LIVE STREAM SPLIT SCREEN */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0 items-stretch">
              
              {/* HOME TEAM ROSTER (LEFT - 3/12) */}
              <div className="lg:col-span-3 bg-zinc-950/40 border border-zinc-900/60 rounded-2xl p-4 text-left font-mono">
                <div className="text-center pb-3 border-b border-zinc-900">
                  <span className="text-lg mb-1 block">{specHomeOpponent.emoji}</span>
                  <span className="text-[10px] text-zinc-250 font-black block">{specHomeOpponent.name} (HOME)</span>
                  <span className="text-[7.5px] text-zinc-500 block">RATING: {specHomeOpponent.rating} MMR</span>
                </div>

                <div className="space-y-3 mt-4">
                  {specHomeHp.map((hp, idx) => {
                    const max = 2000;
                    const pct = (hp / max) * 100;
                    return (
                      <div key={idx} className="p-2 bg-zinc-950 border border-zinc-900 rounded-lg text-[9.5px]">
                        <div className="flex justify-between font-bold text-zinc-400">
                          <span>Gladiator #{idx + 1}</span>
                          <span>{hp} HP</span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-900 rounded-full mt-1.5 overflow-hidden">
                          <div style={{ width: `${pct}%` }} className="h-full bg-emerald-500" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* LIVE PLAY SCENE CONSOLE (CENTER - 6/12) */}
              <div className="lg:col-span-6 bg-[#020204] border border-zinc-900 rounded-2xl p-5 flex flex-col justify-between items-center text-center">
                
                <div>
                  <Megaphone className="w-8 h-8 text-indigo-400 mx-auto animate-bounce mb-2" />
                  <span className="text-[8.5px] font-mono text-zinc-550 uppercase tracking-wider block">Colosseum Arena Crowds</span>
                  <h4 className="text-sm font-serif font-black text-white uppercase tracking-wider">LIVE SPECTATING BROADCAST</h4>
                </div>

                {/* CHEER METER BAR */}
                <div className="w-full my-4 font-mono text-[9px] text-zinc-400 select-none">
                  <div className="flex justify-between items-center mb-1.5">
                    <span>HOME FAVOR ({Math.round(specCheerMeter)}%)</span>
                    <span>AWAY FAVOR ({Math.round(100 - specCheerMeter)}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-rose-950 rounded-full overflow-hidden flex">
                    <div style={{ width: `${specCheerMeter}%` }} className="h-full bg-emerald-500 transition-all duration-300" />
                  </div>
                </div>

                {/* LIVE LOG STREAM */}
                <div className="w-full flex-1 bg-black border border-zinc-900 rounded-xl p-4 font-mono text-[8.5px] text-left overflow-y-auto max-h-[160px] space-y-1">
                  {specLogs.map((log, idx) => (
                    <div key={idx} className={log.includes('[HOME]') ? 'text-emerald-400' : log.includes('[AWAY]') ? 'text-rose-400' : 'text-zinc-500'}>
                      {log}
                    </div>
                  ))}
                </div>

                {/* INTERACTIVE CROWD INTERACTIVE ACTIONS */}
                <div className="grid grid-cols-2 gap-3 mt-4 w-full select-none">
                  <button
                    onClick={() => cheerForTeam('home')}
                    className="py-2 bg-emerald-950/40 hover:bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-mono text-[9.5px] font-black uppercase rounded-xl cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Heart className="w-3.5 h-3.5 fill-current" />
                    <span>Throw Home Flowers</span>
                  </button>

                  <button
                    onClick={() => cheerForTeam('away')}
                    className="py-2 bg-rose-950/40 hover:bg-rose-950/60 border border-rose-500/40 text-rose-400 font-mono text-[9.5px] font-black uppercase rounded-xl cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Smile className="w-3.5 h-3.5" />
                    <span>Blast Away Warhorns</span>
                  </button>
                </div>

              </div>

              {/* AWAY TEAM ROSTER (RIGHT - 3/12) */}
              <div className="lg:col-span-3 bg-zinc-950/40 border border-zinc-900/60 rounded-2xl p-4 text-left font-mono">
                <div className="text-center pb-3 border-b border-zinc-900">
                  <span className="text-lg mb-1 block">{specAwayOpponent.emoji}</span>
                  <span className="text-[10px] text-zinc-250 font-black block">{specAwayOpponent.name} (AWAY)</span>
                  <span className="text-[7.5px] text-zinc-550 block">RATING: {specAwayOpponent.rating} MMR</span>
                </div>

                <div className="space-y-3 mt-4">
                  {specAwayHp.map((hp, idx) => {
                    const max = 2000;
                    const pct = (hp / max) * 100;
                    return (
                      <div key={idx} className="p-2 bg-zinc-950 border border-zinc-900 rounded-lg text-[9.5px]">
                        <div className="flex justify-between font-bold text-zinc-400">
                          <span>Gladiator #{idx + 1}</span>
                          <span>{hp} HP</span>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-900 rounded-full mt-1.5 overflow-hidden">
                          <div style={{ width: `${pct}%` }} className="h-full bg-rose-500" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
