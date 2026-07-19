import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkle, 
  ArrowLeft, 
  Layers, 
  Zap, 
  Flame, 
  Compass, 
  Cpu, 
  Volume2, 
  RefreshCw, 
  Eye, 
  Undo as UndoIcon, 
  HelpCircle, 
  Shuffle as ShuffleIcon, 
  Play, 
  CheckCircle2, 
  AlertTriangle, 
  Award as TrophyIcon, 
  Info, 
  Shield, 
  Search, 
  Check, 
  EyeOff,
  Lock,
  MapPin,
  Calendar,
  Clock,
  BarChart3,
  User,
  Trash2,
  Gift,
  Swords,
  Skull
} from 'lucide-react';
import { formatNum } from '../gameData';
import { CrystalVaultCombatArena, CombatArenaRef } from './CrystalVaultCombatEngine';
import CrystalVaultArenaTab from './CrystalVaultArenaTab';
import CrystalVaultBeastTrialsTab from './CrystalVaultBeastTrialsTab';
import CrystalVaultConvergenceTab from './CrystalVaultConvergenceTab';
import CrystalVaultSocialCompetitiveTab from './CrystalVaultSocialCompetitiveTab';

// Unique Tile Types - The 6 Elemental Runes of Crownspire
interface TileType {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  textGlow: string;
  symbol: string;
  label: string;
  emoji: string;
  shapeDescription: string;
}

const TILE_TYPES: TileType[] = [
  {
    id: 'solar_fire',
    name: 'Solar Fire Rune',
    color: 'text-rose-400',
    bgColor: 'bg-rose-950/40',
    borderColor: 'border-rose-500/40 hover:border-rose-400',
    textGlow: 'shadow-rose-500/30',
    symbol: '▲',
    label: 'VALOR',
    emoji: '🔥',
    shapeDescription: 'Peak Triangle Bevel'
  },
  {
    id: 'glacial_frost',
    name: 'Glacial Frost Rune',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-950/40',
    borderColor: 'border-cyan-500/40 hover:border-cyan-400',
    textGlow: 'shadow-cyan-500/30',
    symbol: '◆',
    label: 'FROST',
    emoji: '❄️',
    shapeDescription: 'Diamond Shield Bevel'
  },
  {
    id: 'emerald_nature',
    name: 'Wildling Emerald Rune',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-950/40',
    borderColor: 'border-emerald-500/40 hover:border-emerald-400',
    textGlow: 'shadow-emerald-500/30',
    symbol: '⬢',
    label: 'GROWTH',
    emoji: '🌿',
    shapeDescription: 'Hexagon Crown Bevel'
  },
  {
    id: 'astral_light',
    name: 'Astral Light Sigil',
    color: 'text-fuchsia-400',
    bgColor: 'bg-fuchsia-950/40',
    borderColor: 'border-fuchsia-500/40 hover:border-fuchsia-400',
    textGlow: 'shadow-fuchsia-500/30',
    symbol: '★',
    label: 'ASTRAL',
    emoji: '⭐',
    shapeDescription: '8-Point Star Bevel'
  },
  {
    id: 'amber_earth',
    name: 'Crownspire Amber Rune',
    color: 'text-amber-400',
    bgColor: 'bg-amber-950/40',
    borderColor: 'border-amber-500/40 hover:border-amber-400',
    textGlow: 'shadow-amber-500/30',
    symbol: '◼',
    label: 'EARTH',
    emoji: '⛰️',
    shapeDescription: 'Octagonal Block Bevel'
  },
  {
    id: 'runic_compass',
    name: 'Aether Vortex Rune',
    color: 'text-violet-400',
    bgColor: 'bg-violet-950/40',
    borderColor: 'border-violet-500/40 hover:border-violet-400',
    textGlow: 'shadow-violet-500/30',
    symbol: '●',
    label: 'VORTEX',
    emoji: '🌀',
    shapeDescription: 'Circular Ring Bevel'
  }
];

// Fixed dimensions for layout rendering
const TILE_WIDTH = 56;
const TILE_HEIGHT = 64;

interface BoardTile {
  id: string;
  typeId: string;
  x: number;
  y: number;
  z: number;
  isBlocked: boolean;
  isHinted?: boolean;
}

interface Particle {
  id: string;
  x: number;
  y: number;
  color: string;
  angle: number;
  speed: number;
  size: number;
  emoji?: string;
}

// Expedition Level Structure
interface LevelConfig {
  id: string;
  world: number;
  level: number;
  name: string;
  layoutId: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  description: string;
  tilesCount: number;
}

const EXPEDITION_LEVELS: LevelConfig[] = [
  // World 1: Whispering Peaks
  { id: '1_1', world: 1, level: 1, name: 'Whispering Steppes', layoutId: 'pyramid_peak', difficulty: 'Easy', description: 'Align the basic pyramid of stones to break the seals.', tilesCount: 30 },
  { id: '1_2', world: 1, level: 2, name: 'Crystal Outcrop', layoutId: 'pyramid_peak', difficulty: 'Easy', description: 'The crystal clusters stack tighter. Beware of overlay overlaps.', tilesCount: 36 },
  { id: '1_3', world: 1, level: 3, name: 'Glimmering Grotto', layoutId: 'stellar_fortress', difficulty: 'Medium', description: 'A medium bastion tower layout guarding deep runic cores.', tilesCount: 45 },
  { id: '1_4', world: 1, level: 4, name: 'Runic Threshold', layoutId: 'stellar_fortress', difficulty: 'Medium', description: 'The gateway is guarded by complex multi-tiered barriers.', tilesCount: 54 },
  { id: '1_5', world: 1, level: 5, name: 'Peak of Alignment', layoutId: 'obsidian_obelisk', difficulty: 'Hard', description: 'Confront the towering Obsidian Obelisk pinnacle to complete World 1.', tilesCount: 72 },
  
  // World 2: Solar Oasis
  { id: '2_1', world: 2, level: 1, name: 'Solar Dunes', layoutId: 'pyramid_peak', difficulty: 'Easy', description: 'Searing heat flows through the dunes. Re-align the warm runes.', tilesCount: 36 },
  { id: '2_2', world: 2, level: 2, name: 'Mirage Oasis', layoutId: 'stellar_fortress', difficulty: 'Medium', description: 'A shimmering oasis fortress layout guarding precious waters.', tilesCount: 54 },
  { id: '2_3', world: 2, level: 3, name: 'Solar Forge', layoutId: 'stellar_fortress', difficulty: 'Medium', description: 'The forge stacks runes with high heat intensity.', tilesCount: 54 },
  { id: '2_4', world: 2, level: 4, name: 'Scorched Sanctum', layoutId: 'obsidian_obelisk', difficulty: 'Hard', description: 'Deep within the sanctuary sits a towering layered puzzle.', tilesCount: 72 },
  { id: '2_5', world: 2, level: 5, name: 'Sunspire Apex', layoutId: 'obsidian_obelisk', difficulty: 'Hard', description: 'Purify the sun-charged relic core of the desert.', tilesCount: 72 },
  
  // World 3: Obsidian Core
  { id: '3_1', world: 3, level: 1, name: 'Volcanic Rift', layoutId: 'stellar_fortress', difficulty: 'Medium', description: 'Molten lava cracks open the runic chambers.', tilesCount: 54 },
  { id: '3_2', world: 3, level: 2, name: 'Obsidian Crags', layoutId: 'obsidian_obelisk', difficulty: 'Hard', description: 'Tough volcanic stones overlay each other in high density.', tilesCount: 72 },
  { id: '3_3', world: 3, level: 3, name: 'Magma Reservoir', layoutId: 'obsidian_obelisk', difficulty: 'Hard', description: 'Foretactical planning is crucial. Do not rush alignments.', tilesCount: 72 },
  { id: '3_4', world: 3, level: 4, name: 'Cinder Citadel', layoutId: 'obsidian_obelisk', difficulty: 'Hard', description: 'A massive volcanic citadel stack of 72 runes.', tilesCount: 72 },
  { id: '3_5', world: 3, level: 5, name: 'Heart of the Colossus', layoutId: 'obsidian_obelisk', difficulty: 'Hard', description: 'Synthesize the ultimate runic alignment at the volcanic heart.', tilesCount: 72 }
];

interface PlayerProgression {
  resonance: number;
  shards: number;
  orbs: number;
  gold: number;
  wood: number;
  stone: number;
  iron: number;
  
  unlockedWorld: number;
  unlockedLevel: number;
  completedLevels: { [levelId: string]: { stars: number; highScore: number } };
  
  maxEndlessFloor: number;
  currentEndlessFloor: number;
  
  dailyCompletedToday: boolean;
  dailyStreak: number;
  lastDailyDate: string;
  
  totalMatches: number;
  totalWins: number;
  totalDefeats: number;
  peakCombo: number;
  undosUsed: number;
  shufflesUsed: number;
  hintsUsed: number;
  
  completedSeasons: number;
  seasonPoints: number;
}

const DEFAULT_PROG: PlayerProgression = {
  resonance: 1240,
  shards: 150,
  orbs: 12,
  gold: 5000,
  wood: 10000,
  stone: 8000,
  iron: 4000,
  unlockedWorld: 1,
  unlockedLevel: 1,
  completedLevels: {},
  maxEndlessFloor: 0,
  currentEndlessFloor: 1,
  dailyCompletedToday: false,
  dailyStreak: 0,
  lastDailyDate: '',
  totalMatches: 0,
  totalWins: 0,
  totalDefeats: 0,
  peakCombo: 0,
  undosUsed: 0,
  shufflesUsed: 0,
  hintsUsed: 0,
  completedSeasons: 1,
  seasonPoints: 0
};

interface CrystalVaultTabProps {
  onExit: () => void;
  resources: any;
  addLog: (text: string, type?: 'success' | 'info' | 'warning' | 'combat') => void;
}

export default function CrystalVaultTab({ onExit, resources, addLog }: CrystalVaultTabProps) {
  // Navigation & Screen Modes
  const [activeScreen, setActiveScreen] = useState<'selection' | 'puzzle'>('selection');
  const [activeTab, setActiveTab] = useState<'expedition' | 'endless' | 'daily' | 'arena' | 'beasts' | 'convergence' | 'social' | 'profile'>('expedition');
  const [selectedWorld, setSelectedWorld] = useState<number>(1);
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);
  
  // Progression Storage state
  const [prog, setProg] = useState<PlayerProgression>(DEFAULT_PROG);
  
  // Game Play Engine States
  const [boardTiles, setBoardTiles] = useState<BoardTile[]>([]);
  const [tray, setTray] = useState<BoardTile[]>([]);
  const [undoStack, setUndoStack] = useState<{ board: BoardTile[], tray: BoardTile[] }[]>([]);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [comboExpiry, setComboExpiry] = useState<number>(0);
  const [victoryState, setVictoryState] = useState<boolean>(false);
  const [defeatState, setDefeatState] = useState<boolean>(false);
  
  // Active Game Meta
  const [gameMode, setGameMode] = useState<'expedition' | 'endless' | 'daily'>('expedition');
  const [currentLevelRun, setCurrentLevelRun] = useState<LevelConfig | null>(null);
  const [currentEndlessFloorRun, setCurrentEndlessFloorRun] = useState<number>(1);
  const [undosUsedThisRun, setUndosUsedThisRun] = useState<number>(0);
  const [shufflesUsedThisRun, setShufflesUsedThisRun] = useState<number>(0);
  const [hintsUsedThisRun, setHintsUsedThisRun] = useState<number>(0);
  const [matchesThisRun, setMatchesThisRun] = useState<number>(0);
  const [maxComboThisRun, setMaxComboThisRun] = useState<number>(0);
  
  // Chest Reward Synthesis Screen
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false);
  const [chestOpenState, setChestOpenState] = useState<'idle' | 'opening' | 'revealed'>('idle');
  const [earnedStars, setEarnedStars] = useState<number>(0);
  const [earnedRewards, setEarnedRewards] = useState<{
    shards: number; orbs: number; gold: number; wood: number; stone: number; iron: number;
  }>({ shards: 0, orbs: 0, gold: 0, wood: 0, stone: 0, iron: 0 });
  
  // Settings & Toggles
  const [accessibilityMode, setAccessibilityMode] = useState<boolean>(false);
  const [soundVolume, setSoundVolume] = useState<number>(0.5);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [godotLogs, setGodotLogs] = useState<string[]>([]);
  
  // Animation/Particle ticking
  const requestRef = useRef<number | null>(null);
  const combatArenaRef = useRef<CombatArenaRef>(null);

  // Load state from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('crownspire_vault_progression');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProg({ ...DEFAULT_PROG, ...parsed });
        addLog("💾 Loaded permanent reliquary progression save successfully.", "info");
      } catch (e) {
        setProg(DEFAULT_PROG);
      }
    } else {
      setProg(DEFAULT_PROG);
    }
  }, []);

  // Save progression state wrapper
  const saveProgression = (updated: PlayerProgression) => {
    setProg(updated);
    localStorage.setItem('crownspire_vault_progression', JSON.stringify(updated));
    addGodotSignalLog("save_completed", `true`);
  };

  const handleResetProfile = () => {
    if (confirm("⚠️ Are you sure you want to completely wipe your Crystal Vault progression data? This will lock all levels and reset resource counts.")) {
      saveProgression(DEFAULT_PROG);
      addLog("🧹 Progression save cleared. Clean start initialized.", "warning");
      triggerAudioPlayback("toggle_setting");
    }
  };

  // Emit a clean debug log representing real Godot signal broadcasts
  const addGodotSignalLog = (signalName: string, args: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setGodotLogs(prev => [`[${timestamp}] SIGNAL: emit_signal("${signalName}", ${args})`, ...prev.slice(0, 30)]);
  };

  // Sound Dispatch Simulated Hook
  const triggerAudioPlayback = (cue: string) => {
    addLog(`🔊 Playback Sound Cue: "${cue}"`, 'info');
    addGodotSignalLog("sound_played", `"${cue}", ${soundVolume}`);
  };

  // Match Combo tick down
  useEffect(() => {
    const interval = setInterval(() => {
      if (combo > 0 && Date.now() > comboExpiry) {
        setCombo(0);
        addGodotSignalLog("combo_expired", "");
      }
    }, 100);
    return () => clearInterval(interval);
  }, [combo, comboExpiry]);

  // Particle tick/updater loop
  useEffect(() => {
    const updateParticles = () => {
      setParticles(prev => {
        if (prev.length === 0) return prev;
        return prev
          .map(p => ({
            ...p,
            x: p.x + Math.cos(p.angle) * p.speed,
            y: p.y + Math.sin(p.angle) * p.speed + 0.1, // slight gravity
            size: p.size * 0.94 // shrink
          }))
          .filter(p => p.size > 0.5);
      });
      requestRef.current = requestAnimationFrame(updateParticles);
    };
    requestRef.current = requestAnimationFrame(updateParticles);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  // Spawn visual sparkle burst on matching or clicking
  const spawnVisualBurst = (x: number, y: number, color: string, emoji?: string) => {
    const newParticles: Particle[] = [];
    const count = emoji ? 6 : 16;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      newParticles.push({
        id: Math.random().toString(36).substring(2, 9),
        x,
        y,
        color,
        angle,
        speed: emoji ? 1 + Math.random() * 2 : 2 + Math.random() * 3,
        size: emoji ? 12 : 3 + Math.random() * 4,
        emoji
      });
    }
    setParticles(prev => [...prev, ...newParticles]);
  };

  // OVERLAP & BLOCKING DETECTION ALGORITHM
  // A tile is blocked if any tile in a higher layer (Z+1) overlaps it.
  const checkBlockingStates = (tiles: BoardTile[]): BoardTile[] => {
    return tiles.map(tile => {
      const isOverlapped = tiles.some(other => {
        if (other.id === tile.id) return false;
        if (other.z <= tile.z) return false; // Must be higher layer to block
        
        const xDiff = Math.abs(other.x - tile.x);
        const yDiff = Math.abs(other.y - tile.y);
        
        return xDiff < 0.85 && yDiff < 0.85;
      });
      
      return {
        ...tile,
        isBlocked: isOverlapped
      };
    });
  };

  // ORGANIC PYRAMID COORDINATE GENERATOR (DYNAMIC DIFFICULTY SCALING)
  // Generates custom stacked layouts centered around center coordinate of (3.5, 3.5).
  const generateProceduralCoords = (count: number): { x: number; y: number; z: number }[] => {
    const coords: { x: number; y: number; z: number }[] = [];
    
    // Layer 0 (base): up to 48 slots
    for (let y = 1; y <= 6; y++) {
      for (let x = 1; x <= 6; x++) {
        coords.push({ x, y, z: 0 });
      }
    }
    // Layer 1: up to 25 slots
    for (let y = 1.5; y <= 5.5; y += 1) {
      for (let x = 1.5; x <= 5.5; x += 1) {
        coords.push({ x, y, z: 1 });
      }
    }
    // Layer 2: up to 16 slots
    for (let y = 2; y <= 5; y++) {
      for (let x = 2; x <= 5; x++) {
        coords.push({ x, y, z: 2 });
      }
    }
    // Layer 3: up to 4 slots
    for (let y = 2.5; y <= 3.5; y += 1) {
      for (let x = 2.5; x <= 3.5; x += 1) {
        coords.push({ x, y, z: 3 });
      }
    }
    
    // Sort coords: Higher layers sit centrally. Closer to center (3.5, 3.5) prioritised.
    coords.sort((a, b) => {
      if (a.z !== b.z) return b.z - a.z; // Higher layers first
      const distA = Math.pow(a.x - 3.5, 2) + Math.pow(a.y - 3.5, 2);
      const distB = Math.pow(b.x - 3.5, 2) + Math.pow(b.y - 3.5, 2);
      return distA - distB; // Closer to center first
    });
    
    return coords.slice(0, count);
  };

  // GUARANTEED SOLVABLE BOARD GENERATOR
  const generateSolvableBoard = (tilesCount: number) => {
    addLog(`🔮 Synthesizing aligned grid matrix for ${tilesCount} tiles...`, 'info');
    addGodotSignalLog("engine_initializing", `${tilesCount}_tiles`);

    // 1. Generate procedural pyramided coordinate offsets
    const slots = generateProceduralCoords(tilesCount);
    
    // 2. Pair elements into triplets
    const numTriplets = tilesCount / 3;
    const tilePool: string[] = [];
    for (let i = 0; i < numTriplets; i++) {
      const randomType = TILE_TYPES[Math.floor(Math.random() * TILE_TYPES.length)].id;
      tilePool.push(randomType, randomType, randomType);
    }

    // 3. Shuffle elements pool
    for (let i = tilePool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tilePool[i], tilePool[j]] = [tilePool[j], tilePool[i]];
    }

    // 4. Map elements to coordinates
    const generatedTiles: BoardTile[] = slots.map((slot, index) => ({
      id: `tile_${index}_${Math.random().toString(36).substring(2, 5)}`,
      typeId: tilePool[index],
      x: slot.x,
      y: slot.y,
      z: slot.z,
      isBlocked: false
    }));

    // 5. Evaluate blocking states
    const processedTiles = checkBlockingStates(generatedTiles);
    
    setBoardTiles(processedTiles);
    setTray([]);
    setUndoStack([]);
    setScore(0);
    setCombo(0);
    setVictoryState(false);
    setDefeatState(false);
    
    // Reset run tracking
    setUndosUsedThisRun(0);
    setShufflesUsedThisRun(0);
    setHintsUsedThisRun(0);
    setMatchesThisRun(0);
    setMaxComboThisRun(0);

    triggerAudioPlayback("board_shuffle_cosmic");
    addGodotSignalLog("board_generated", `true, ${processedTiles.length}_tiles`);
  };

  // Deploy puzzle triggers
  const startExpeditionGame = (lvl: LevelConfig) => {
    setGameMode('expedition');
    setCurrentLevelRun(lvl);
    setSelectedLevel(null);
    setActiveScreen('puzzle');
    generateSolvableBoard(lvl.tilesCount);
  };

  const startEndlessGame = () => {
    setGameMode('endless');
    setCurrentEndlessFloorRun(prog.currentEndlessFloor);
    setActiveScreen('puzzle');
    // Endless scales tiles count divisibly by 3: Floor 1 is 30, Floor 2 is 36, floor 10 is 60... max 90.
    const tilesCount = Math.min(90, 30 + Math.floor((prog.currentEndlessFloor - 1) / 2) * 6);
    generateSolvableBoard(tilesCount);
  };

  const startDailyExtremeGame = () => {
    if (prog.dailyCompletedToday) {
      if (!confirm("⚙️ Developer Bypass: You already completed today's Extreme challenge. Force re-run for testing?")) {
        return;
      }
    }
    setGameMode('daily');
    setActiveScreen('puzzle');
    generateSolvableBoard(72); // Massive heavy stacking challenge!
  };

  // TILE INTERACTION & SELECTION
  const selectTile = (clickedTile: BoardTile, e: React.MouseEvent<HTMLDivElement>) => {
    if (clickedTile.isBlocked || victoryState || defeatState) {
      triggerAudioPlayback("tile_locked_error");
      return;
    }

    if (tray.length >= 7) {
      triggerAudioPlayback("tray_full_warning");
      addLog("⚠️ The Relic Altar matching slot is fully congested!", "warning");
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const parentRect = e.currentTarget.parentElement?.getBoundingClientRect();
    const burstX = rect.left - (parentRect?.left || 0) + rect.width / 2;
    const burstY = rect.top - (parentRect?.top || 0) + rect.height / 2;

    const snapBoard = boardTiles.map(t => ({ ...t }));
    const snapTray = tray.map(t => ({ ...t }));
    setUndoStack(prev => [...prev, { board: snapBoard, tray: snapTray }]);

    const nextBoard = boardTiles.filter(t => t.id !== clickedTile.id);
    const updatedBoard = checkBlockingStates(nextBoard);

    const matchingTypeIndex = tray.findIndex(t => t.typeId === clickedTile.typeId);
    let nextTray = [...tray];
    
    if (matchingTypeIndex !== -1) {
      nextTray.splice(matchingTypeIndex, 0, clickedTile);
    } else {
      nextTray.push(clickedTile);
    }

    setBoardTiles(updatedBoard);
    setTray(nextTray);
    
    triggerAudioPlayback("tile_fly_altar");
    spawnVisualBurst(burstX, burstY, '#c084fc');
    addGodotSignalLog("tile_selected", `"${clickedTile.id}", "${clickedTile.typeId}"`);

    evaluateTrayMatching(nextTray, updatedBoard);
  };

  // TRIPLE MATCH CHECKER
  const evaluateTrayMatching = (currentTray: BoardTile[], currentBoard: BoardTile[]) => {
    const counts: { [key: string]: number } = {};
    currentTray.forEach(tile => {
      counts[tile.typeId] = (counts[tile.typeId] || 0) + 1;
    });

    const matchedTypeId = Object.keys(counts).find(typeId => counts[typeId] >= 3);

    if (matchedTypeId) {
      setTimeout(() => {
        setTray(prev => {
          let removedCount = 0;
          const filteredTray = prev.filter(tile => {
            if (tile.typeId === matchedTypeId && removedCount < 3) {
              removedCount++;
              return false;
            }
            return true;
          });

          // Match scoring
          const matchPoints = 150;
          const currentCombo = combo + 1;
          const comboMultiplier = Math.min(5, currentCombo);
          const calculatedPoints = matchPoints * comboMultiplier;

          setScore(s => s + calculatedPoints);
          setCombo(currentCombo);
          setComboExpiry(Date.now() + 5000);
          
          setMatchesThisRun(m => m + 1);
          if (currentCombo > maxComboThisRun) {
            setMaxComboThisRun(currentCombo);
          }

          const rune = TILE_TYPES.find(t => t.id === matchedTypeId);
          addLog(`✨ MATCH TRIPLE: Synthesized ${rune?.name || 'Ancient Rune'} x3! (+${calculatedPoints} score, Combo x${comboMultiplier})`, 'success');
          triggerAudioPlayback("triple_match_resonance");
          addGodotSignalLog("triple_matched", `"${matchedTypeId}", ${calculatedPoints}, ${currentCombo}`);

          // Forward event to the Combat Engine
          if (combatArenaRef.current) {
            combatArenaRef.current.handleMatchEvent(matchedTypeId);
          }

          spawnVisualBurst(250, 480, '#e9d5ff', rune?.emoji);

          // Check Victory
          if (currentBoard.length === 0 && filteredTray.length === 0) {
            handleVictoryOutcome(currentCombo);
          }

          return filteredTray;
        });
      }, 350);
    } else {
      // Check Defeat State
      if (currentTray.length >= 7) {
        handleDefeatOutcome();
      }
    }
  };

  // SUCCESS OUTCOME & REWARD GENERATION ENGINE
  const handleVictoryOutcome = (finalCombo: number) => {
    setVictoryState(true);
    triggerAudioPlayback("victory_fanfare");
    addLog("👑 VICTORY: You have fully purified the Crownspire Altar!", "success");
    addGodotSignalLog("puzzle_victory", "true");

    if (combatArenaRef.current) {
      combatArenaRef.current.triggerPuzzleVictory();
    }

    // Evaluate Stars based on Undos used (Highly strategic!)
    let stars = 3;
    if (undosUsedThisRun > 1 && undosUsedThisRun <= 3) stars = 2;
    else if (undosUsedThisRun > 3) stars = 1;
    setEarnedStars(stars);

    // Calculate Reward synthesis
    let shardReward = 0;
    let orbReward = 0;
    let goldReward = 0;
    let woodReward = 0;
    let stoneReward = 0;
    let ironReward = 0;

    const baseMult = 1.0 + (stars - 1) * 0.25;

    if (gameMode === 'expedition' && currentLevelRun) {
      shardReward = Math.round(30 * baseMult);
      orbReward = stars === 3 ? 1 : 0;
      goldReward = Math.round(1000 * baseMult);
      woodReward = Math.round(2000 * baseMult);
      stoneReward = Math.round(1500 * baseMult);
      ironReward = Math.round(800 * baseMult);
    } else if (gameMode === 'endless') {
      shardReward = Math.round((20 + currentEndlessFloorRun * 2) * baseMult);
      orbReward = currentEndlessFloorRun % 5 === 0 ? 1 : 0;
      goldReward = Math.round((800 + currentEndlessFloorRun * 100) * baseMult);
      woodReward = Math.round((1500 + currentEndlessFloorRun * 200) * baseMult);
      stoneReward = Math.round((1200 + currentEndlessFloorRun * 150) * baseMult);
      ironReward = Math.round((600 + currentEndlessFloorRun * 100) * baseMult);
    } else if (gameMode === 'daily') {
      shardReward = 120;
      orbReward = 3;
      goldReward = 5000;
      woodReward = 10000;
      stoneReward = 8000;
      ironReward = 4000;
    }

    setEarnedRewards({
      shards: shardReward,
      orbs: orbReward,
      gold: goldReward,
      wood: woodReward,
      stone: stoneReward,
      iron: ironReward
    });

    // Save state progression
    const updatedProg = { ...prog };
    
    // Update player currency registers
    updatedProg.shards += shardReward;
    updatedProg.orbs += orbReward;
    updatedProg.gold += goldReward;
    updatedProg.wood += woodReward;
    updatedProg.stone += stoneReward;
    updatedProg.iron += ironReward;

    // Passively increase resonance rating
    const resonanceEarned = Math.round(shardReward / 5 + orbReward * 10);
    updatedProg.resonance += resonanceEarned;

    // Update statistics
    updatedProg.totalWins += 1;
    updatedProg.totalMatches += (matchesThisRun + 1); // + last match
    updatedProg.undosUsed += undosUsedThisRun;
    updatedProg.shufflesUsed += shufflesUsedThisRun;
    updatedProg.hintsUsed += hintsUsedThisRun;
    if (finalCombo > updatedProg.peakCombo) {
      updatedProg.peakCombo = finalCombo;
    }

    if (gameMode === 'expedition' && currentLevelRun) {
      // Star rating update
      const oldStars = updatedProg.completedLevels[currentLevelRun.id]?.stars || 0;
      if (stars > oldStars) {
        updatedProg.completedLevels[currentLevelRun.id] = {
          stars,
          highScore: Math.max(score + 150, updatedProg.completedLevels[currentLevelRun.id]?.highScore || 0)
        };
      }
      
      // Unlock next level logic
      if (currentLevelRun.world === updatedProg.unlockedWorld && currentLevelRun.level === updatedProg.unlockedLevel) {
        const nextLevelIndex = EXPEDITION_LEVELS.findIndex(l => l.id === currentLevelRun.id) + 1;
        if (nextLevelIndex < EXPEDITION_LEVELS.length) {
          const nextLevel = EXPEDITION_LEVELS[nextLevelIndex];
          updatedProg.unlockedWorld = nextLevel.world;
          updatedProg.unlockedLevel = nextLevel.level;
        }
      }
    } else if (gameMode === 'endless') {
      if (currentEndlessFloorRun > updatedProg.maxEndlessFloor) {
        updatedProg.maxEndlessFloor = currentEndlessFloorRun;
      }
      updatedProg.currentEndlessFloor = currentEndlessFloorRun + 1;
    } else if (gameMode === 'daily') {
      updatedProg.dailyCompletedToday = true;
      updatedProg.dailyStreak += 1;
      updatedProg.seasonPoints += 100;
    }

    saveProgression(updatedProg);

    // Launch chest reward screen after 1.5 seconds
    setTimeout(() => {
      setShowRewardModal(true);
      setChestOpenState('idle');
    }, 1200);
  };

  const handleDefeatOutcome = () => {
    setDefeatState(true);
    triggerAudioPlayback("defeat_chord");
    addLog("💀 DEFEAT: Relic Altar fully congested. No moves remaining.", "warning");
    addGodotSignalLog("puzzle_defeat", "true");

    if (combatArenaRef.current) {
      combatArenaRef.current.triggerPuzzleDefeat();
    }

    // Update losses statistics
    const updatedProg = {
      ...prog,
      totalDefeats: prog.totalDefeats + 1,
      totalMatches: prog.totalMatches + matchesThisRun
    };
    saveProgression(updatedProg);
  };

  const claimChestRewards = () => {
    setShowRewardModal(false);
    setActiveScreen('selection');
    triggerAudioPlayback("toggle_setting");
  };

  // HELPER INTERACTION: UNDO
  const triggerUndo = () => {
    if (undoStack.length === 0 || victoryState || defeatState) {
      triggerAudioPlayback("interaction_invalid");
      return;
    }

    const previousState = undoStack[undoStack.length - 1];
    setBoardTiles(previousState.board);
    setTray(previousState.tray);
    setUndoStack(prev => prev.slice(0, prev.length - 1));
    setUndosUsedThisRun(u => u + 1);

    triggerAudioPlayback("undo_activated");
    addLog("↩️ Rewound Cosmic Chronology: Reversed last selection.", "info");
    addGodotSignalLog("undo_used", `true`);
  };

  // HELPER INTERACTION: SHUFFLE
  const triggerShuffle = () => {
    if (boardTiles.length === 0 || victoryState || defeatState) {
      triggerAudioPlayback("interaction_invalid");
      return;
    }

    const currentTypes = boardTiles.map(t => t.typeId);

    for (let i = currentTypes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [currentTypes[i], currentTypes[j]] = [currentTypes[j], currentTypes[i]];
    }

    const shuffledTiles = boardTiles.map((tile, index) => ({
      ...tile,
      typeId: currentTypes[index]
    }));

    const updatedShuffled = checkBlockingStates(shuffledTiles);
    setBoardTiles(updatedShuffled);
    setUndoStack([]);
    setShufflesUsedThisRun(s => s + 1);

    triggerAudioPlayback("board_shuffle_cosmic");
    addLog("🔀 Cosmic Vortex: Shuffled all remaining board elements.", "info");
    addGodotSignalLog("board_shuffled", `${shuffledTiles.length}_tiles`);
  };

  // HELPER INTERACTION: HINT
  const triggerHint = () => {
    if (boardTiles.length === 0 || victoryState || defeatState) {
      triggerAudioPlayback("interaction_invalid");
      return;
    }

    const unblocked = boardTiles.filter(t => !t.isBlocked);
    if (unblocked.length === 0) return;

    setHintsUsedThisRun(h => h + 1);

    if (tray.length > 0) {
      for (const trayItem of tray) {
        const matchOnBoard = unblocked.find(t => t.typeId === trayItem.typeId);
        if (matchOnBoard) {
          highlightTile(matchOnBoard.id);
          return;
        }
      }
    }

    const typeGroups: { [key: string]: BoardTile[] } = {};
    unblocked.forEach(t => {
      typeGroups[t.typeId] = typeGroups[t.typeId] || [];
      typeGroups[t.typeId].push(t);
    });

    const pairType = Object.keys(typeGroups).find(typeId => typeGroups[typeId].length >= 2);
    if (pairType) {
      highlightTile(typeGroups[pairType][0].id);
      return;
    }

    highlightTile(unblocked[0].id);
  };

  const highlightTile = (tileId: string) => {
    setBoardTiles(prev => prev.map(t => t.id === tileId ? { ...t, isHinted: true } : t));
    triggerAudioPlayback("hint_acquired");
    addLog("🔮 Chrono Sight: Highlighted an accessible matching rune path.", "info");
    addGodotSignalLog("hint_used", `"${tileId}"`);

    setTimeout(() => {
      setBoardTiles(prev => prev.map(t => t.id === tileId ? { ...t, isHinted: false } : t));
    }, 2500);
  };

  // Profile Badges evaluator
  const evaluatePlayerTitle = () => {
    let totalStars = 0;
    Object.keys(prog.completedLevels).forEach(key => {
      totalStars += prog.completedLevels[key].stars;
    });

    if (totalStars >= 35) return { title: "Infinite Ascendant", style: "text-amber-400 border-amber-500 bg-amber-950/20" };
    if (totalStars >= 20) return { title: "Stellar Purifier", style: "text-purple-400 border-purple-500 bg-purple-950/20" };
    if (totalStars >= 8) return { title: "Chrono Weaver", style: "text-cyan-400 border-cyan-500 bg-cyan-950/20" };
    return { title: "Runic Novice", style: "text-zinc-400 border-zinc-700 bg-zinc-900/40" };
  };

  const currentBadge = evaluatePlayerTitle();

  return (
    <div id="crystal-vault-lobby" className="flex-1 flex flex-col lg:flex-row h-full bg-[#030306] text-zinc-100 overflow-hidden relative">
      
      {/* Visual Canvas Particle Overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute select-none pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: p.x,
              top: p.y,
              color: p.color,
              fontSize: p.emoji ? `${p.size}px` : undefined,
              width: p.emoji ? undefined : `${p.size}px`,
              height: p.emoji ? undefined : `${p.size}px`,
              borderRadius: p.emoji ? undefined : '50%',
              backgroundColor: p.emoji ? undefined : p.color,
              boxShadow: p.emoji ? undefined : `0 0 10px ${p.color}`,
              opacity: p.size / 10
            }}
          >
            {p.emoji || ''}
          </div>
        ))}
      </div>

      {/* Main Core Frame */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto no-scrollbar relative p-4 border-r border-zinc-900/50">
        
        {/* Stellar Background Ambient Blurs */}
        <div className="absolute top-10 left-1/3 -translate-x-1/2 w-80 h-80 bg-purple-600/5 blur-[120px] rounded-full pointer-events-none z-0" />
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-cyan-600/5 blur-[100px] rounded-full pointer-events-none z-0" />

        {/* TOP STATUS HEADER BAR */}
        <div className="flex items-center justify-between border-b border-zinc-900/80 pb-3 mb-4 shrink-0 z-10 relative">
          <button
            onClick={activeScreen === 'selection' ? onExit : () => setActiveScreen('selection')}
            className="flex items-center gap-1.5 text-[10px] font-mono font-black uppercase text-zinc-400 hover:text-white bg-zinc-950 border border-zinc-850 px-3 py-1.5 rounded-xl cursor-pointer active:scale-95 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{activeScreen === 'selection' ? 'Exit Vault' : 'Lobby Selection'}</span>
          </button>

          <div className="flex items-center gap-1.5">
            <Sparkle className="w-4 h-4 text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />
            <h2 className="text-xs font-serif font-black tracking-widest text-zinc-100 uppercase">
              Crownspire Crystal Vault
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Accessibility Mode Toggle */}
            <button
              onClick={() => {
                setAccessibilityMode(prev => !prev);
                addLog(`⚙️ Accessibility Outlines: ${!accessibilityMode ? 'Enabled' : 'Disabled'}.`, 'info');
                triggerAudioPlayback("toggle_setting");
              }}
              className={`p-1.5 rounded-lg border text-[9px] font-mono font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                accessibilityMode 
                  ? 'bg-purple-950/50 border-purple-500 text-purple-300' 
                  : 'bg-zinc-950 border-zinc-850 text-zinc-550 hover:text-zinc-350'
              }`}
              title="Toggle symbols & heavy outlines for color-blind accessibility"
            >
              {accessibilityMode ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
              <span>{accessibilityMode ? 'Eye-Safe ON' : 'Eye-Safe'}</span>
            </button>

            <div className="hidden sm:flex items-center gap-1 text-[9px] font-mono bg-purple-950/40 border border-purple-500/30 text-purple-300 px-2.5 py-1 rounded-full">
              <span>Active Resonance:</span>
              <span className="font-bold text-white">{prog.resonance}</span>
            </div>
          </div>
        </div>

        {/* SCREEN 1: PROGRESSION & STATS HUB */}
        {activeScreen === 'selection' && (
          <div className="flex-1 flex flex-col h-full z-10 relative">
            
            {/* CORE STATUS CARD WITH BALANCES */}
            <div className="mb-4 bg-gradient-to-b from-[#0a0a0f] to-[#040407] border border-purple-950/50 rounded-2xl p-4 shadow-xl select-none">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="text-left">
                  <span className="text-[9px] uppercase font-mono tracking-widest font-black text-purple-400">Crownspire Treasury</span>
                  <h3 className="text-sm font-serif font-black text-zinc-100 mt-0.5 uppercase tracking-wider">Reliquary Siphon Grid</h3>
                  <p className="text-[10px] text-zinc-400 mt-1 max-w-md leading-relaxed">
                    Convert ancient runic elements to synthesize premium and standard 4X resources inside the vault's core.
                  </p>
                </div>
                
                {/* Standard and Premium Inventory Balances */}
                <div className="flex flex-wrap gap-2 items-center font-mono">
                  <div className="bg-[#020204] border border-zinc-900 px-2.5 py-1 rounded-lg flex items-center gap-1.5 min-w-[70px]">
                    <span className="text-[10px]">💎</span>
                    <div className="text-left">
                      <span className="text-[7px] text-zinc-500 block uppercase font-extrabold">Shards</span>
                      <span className="text-[10px] font-black text-cyan-400">{prog.shards}</span>
                    </div>
                  </div>
                  <div className="bg-[#020204] border border-zinc-900 px-2.5 py-1 rounded-lg flex items-center gap-1.5 min-w-[70px]">
                    <span className="text-[10px]">⭐</span>
                    <div className="text-left">
                      <span className="text-[7px] text-zinc-500 block uppercase font-extrabold">Orbs</span>
                      <span className="text-[10px] font-black text-amber-400">{prog.orbs}</span>
                    </div>
                  </div>
                  <div className="bg-[#020204] border border-zinc-900 px-2.5 py-1 rounded-lg flex items-center gap-1.5 min-w-[70px]">
                    <span className="text-[10px]">🪙</span>
                    <div className="text-left">
                      <span className="text-[7px] text-zinc-500 block uppercase font-extrabold">Gold</span>
                      <span className="text-[10px] font-black text-yellow-500">{formatNum(prog.gold)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* standard resource nodes overview */}
              <div className="grid grid-cols-3 gap-2 mt-3.5 border-t border-zinc-900/60 pt-3 text-[9px] font-mono text-zinc-400">
                <div className="flex items-center gap-1 bg-black/45 px-2 py-1.5 rounded-lg border border-zinc-900">
                  <span className="text-yellow-600">🪵</span>
                  <span>Wood: <strong className="text-zinc-200">{formatNum(prog.wood)}</strong></span>
                </div>
                <div className="flex items-center gap-1 bg-black/45 px-2 py-1.5 rounded-lg border border-zinc-900">
                  <span className="text-zinc-400">🪨</span>
                  <span>Stone: <strong className="text-zinc-200">{formatNum(prog.stone)}</strong></span>
                </div>
                <div className="flex items-center gap-1 bg-black/45 px-2 py-1.5 rounded-lg border border-zinc-900">
                  <span className="text-zinc-500">⛓️</span>
                  <span>Iron: <strong className="text-zinc-200">{formatNum(prog.iron)}</strong></span>
                </div>
              </div>
            </div>

            {/* TAB SYSTEM NAVIGATION BAR */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4 shrink-0 select-none">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => { setActiveTab('expedition'); triggerAudioPlayback("mode_select_click"); }}
                  className={`px-3 py-1.5 rounded-xl border font-mono text-[10px] font-black uppercase cursor-pointer active:scale-95 transition-all flex items-center gap-1 ${
                    activeTab === 'expedition' 
                      ? 'bg-purple-950/40 border-purple-500 text-purple-300' 
                      : 'bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Compass className="w-3 h-3" />
                  <span>Expedition Map</span>
                </button>

                <button
                  onClick={() => { setActiveTab('endless'); triggerAudioPlayback("mode_select_click"); }}
                  className={`px-3 py-1.5 rounded-xl border font-mono text-[10px] font-black uppercase cursor-pointer active:scale-95 transition-all flex items-center gap-1 ${
                    activeTab === 'endless' 
                      ? 'bg-purple-950/40 border-purple-500 text-purple-300' 
                      : 'bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Layers className="w-3 h-3" />
                  <span>Endless Vault</span>
                </button>

                <button
                  onClick={() => { setActiveTab('daily'); triggerAudioPlayback("mode_select_click"); }}
                  className={`px-3 py-1.5 rounded-xl border font-mono text-[10px] font-black uppercase cursor-pointer active:scale-95 transition-all flex items-center gap-1 ${
                    activeTab === 'daily' 
                      ? 'bg-purple-950/40 border-purple-500 text-purple-300' 
                      : 'bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Zap className="w-3 h-3 animate-pulse" />
                  <span>Daily Extreme</span>
                </button>

                <button
                  onClick={() => { setActiveTab('arena'); triggerAudioPlayback("mode_select_click"); }}
                  className={`px-3 py-1.5 rounded-xl border font-mono text-[10px] font-black uppercase cursor-pointer active:scale-95 transition-all flex items-center gap-1 ${
                    activeTab === 'arena' 
                      ? 'bg-purple-950/40 border-purple-500 text-purple-300' 
                      : 'bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Swords className="w-3 h-3 text-purple-400" />
                  <span>Arena Duels</span>
                </button>

                <button
                  onClick={() => { setActiveTab('beasts'); triggerAudioPlayback("mode_select_click"); }}
                  className={`px-3 py-1.5 rounded-xl border font-mono text-[10px] font-black uppercase cursor-pointer active:scale-95 transition-all flex items-center gap-1 ${
                    activeTab === 'beasts' 
                      ? 'bg-emerald-950/40 border-emerald-500 text-emerald-300' 
                      : 'bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Skull className="w-3 h-3 text-emerald-400" />
                  <span>Beast Trials</span>
                </button>

                <button
                  onClick={() => { setActiveTab('convergence'); triggerAudioPlayback("mode_select_click"); }}
                  className={`px-3 py-1.5 rounded-xl border font-mono text-[10px] font-black uppercase cursor-pointer active:scale-95 transition-all flex items-center gap-1 ${
                    activeTab === 'convergence' 
                      ? 'bg-indigo-950/40 border-indigo-500 text-indigo-300 animate-pulse' 
                      : 'bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Sparkle className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Crystal Convergence</span>
                </button>

                <button
                  onClick={() => { setActiveTab('social'); triggerAudioPlayback("mode_select_click"); }}
                  className={`px-3 py-1.5 rounded-xl border font-mono text-[10px] font-black uppercase cursor-pointer active:scale-95 transition-all flex items-center gap-1 ${
                    activeTab === 'social' 
                      ? 'bg-purple-950/40 border-purple-500 text-purple-300' 
                      : 'bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <TrophyIcon className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Social & Tourneys</span>
                </button>

                <button
                  onClick={() => { setActiveTab('profile'); triggerAudioPlayback("mode_select_click"); }}
                  className={`px-3 py-1.5 rounded-xl border font-mono text-[10px] font-black uppercase cursor-pointer active:scale-95 transition-all flex items-center gap-1 ${
                    activeTab === 'profile' 
                      ? 'bg-purple-950/40 border-purple-500 text-purple-300' 
                      : 'bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <User className="w-3 h-3" />
                  <span>Guardian Stats</span>
                </button>
              </div>

              <span className="text-[8.5px] font-mono text-zinc-550 uppercase font-bold bg-zinc-950 border border-zinc-900 px-2 py-0.5 rounded">
                Version: 1.2.0-Progression
              </span>
            </div>

            {/* TAB CONTENTS 1: WORLD MAP EXPEDITION */}
            {activeTab === 'expedition' && (
              <div className="flex-1 flex flex-col justify-between select-none">
                
                {/* CHAPTER SELECTION HEADER CAROUSEL */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-left">
                    <span className="text-[8.5px] font-mono uppercase tracking-wider text-zinc-500 font-extrabold">Progression Chapters</span>
                    <h4 className="text-xs font-serif font-black uppercase text-amber-100 tracking-wider">Stellar Runelines Paths</h4>
                  </div>
                  
                  {/* Switch worlds tabs */}
                  <div className="flex items-center gap-1 font-mono text-[10px]">
                    {[1, 2, 3].map(w => (
                      <button
                        key={w}
                        onClick={() => { setSelectedWorld(w); triggerAudioPlayback("mode_select_click"); }}
                        className={`px-2.5 py-1 rounded-lg border font-black uppercase transition-all ${
                          selectedWorld === w 
                            ? 'bg-purple-950/50 border-purple-500 text-purple-300' 
                            : 'bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-zinc-300 cursor-pointer'
                        }`}
                      >
                        World {w}
                      </button>
                    ))}
                  </div>
                </div>

                {/* THE STAR MAP INTERACTIVE SCROLLABLE PATH */}
                <div className="bg-[#040408]/60 border border-zinc-900/60 rounded-2xl p-4 min-h-[220px] flex items-center justify-center overflow-x-auto relative mb-4">
                  
                  {/* Connecting horizontal line under nodes */}
                  <div className="absolute left-10 right-10 h-0.5 border-t border-dashed border-zinc-800 z-0 top-1/2 -translate-y-1/2" />

                  <div className="flex items-center justify-between w-full max-w-3xl px-6 relative z-10 gap-4 min-w-[600px]">
                    {EXPEDITION_LEVELS.filter(l => l.world === selectedWorld).map((lvl) => {
                      const isCompleted = prog.completedLevels[lvl.id] !== undefined;
                      const starsEarned = prog.completedLevels[lvl.id]?.stars || 0;
                      
                      // Check lock status
                      let isLocked = false;
                      const currentIdx = EXPEDITION_LEVELS.findIndex(item => item.id === lvl.id);
                      if (currentIdx > 0) {
                        const prevLevel = EXPEDITION_LEVELS[currentIdx - 1];
                        if (prog.completedLevels[prevLevel.id] === undefined && (lvl.world > 1 || lvl.level > 1)) {
                          isLocked = true;
                        }
                      }

                      // Is current active path node (first unlocked level not yet completed)
                      const isActiveNode = !isLocked && !isCompleted;

                      return (
                        <div key={lvl.id} className="flex flex-col items-center">
                          <button
                            onClick={() => {
                              if (!isLocked) {
                                setSelectedLevel(lvl);
                                triggerAudioPlayback("mode_select_click");
                              } else {
                                triggerAudioPlayback("tile_locked_error");
                              }
                            }}
                            className={`w-14 h-14 rounded-full border-2 flex flex-col items-center justify-center relative cursor-pointer active:scale-95 transition-all ${
                              isLocked 
                                ? 'bg-zinc-950 border-zinc-900 text-zinc-700 hover:border-zinc-850'
                                : isCompleted 
                                  ? 'bg-purple-950/40 border-purple-500 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                                  : isActiveNode
                                    ? 'bg-zinc-900 border-amber-500 text-amber-300 ring-2 ring-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                                    : 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                            }`}
                          >
                            {isLocked ? (
                              <Lock className="w-4 h-4" />
                            ) : (
                              <div className="flex flex-col items-center">
                                <span className="text-[10px] font-mono font-black">{lvl.world}-{lvl.level}</span>
                                {isCompleted && (
                                  <div className="flex items-center justify-center gap-0.5 text-amber-400 scale-75 mt-0.5">
                                    {Array.from({ length: 3 }).map((_, i) => (
                                      <span key={i} className="text-[8px]">{i < starsEarned ? '★' : '☆'}</span>
                                    ))}
                                  </div>
                                )}
                                {isActiveNode && (
                                  <span className="text-[7px] font-mono text-amber-400 font-extrabold tracking-tight animate-pulse uppercase">Active</span>
                                )}
                              </div>
                            )}

                            {/* Halo effect for active target */}
                            {isActiveNode && (
                              <div className="absolute inset-0 border border-amber-400 rounded-full animate-ping scale-110 pointer-events-none opacity-40" />
                            )}
                          </button>
                          
                          <span className="text-[9px] font-mono font-bold text-zinc-400 mt-2 tracking-tight truncate max-w-[100px] text-center">
                            {lvl.name}
                          </span>
                          <span className="text-[7.5px] font-mono text-zinc-650 mt-0.5">
                            {isLocked ? 'Locked' : `${lvl.tilesCount} Runes`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-zinc-950/40 border border-zinc-900/60 rounded-xl p-3.5 text-center mt-2.5">
                  <span className="text-[8px] uppercase font-mono tracking-widest text-zinc-550 font-black block mb-1">Chapter Navigation Manual</span>
                  <p className="text-[10px] text-zinc-400 max-w-md mx-auto leading-normal">
                    Complete levels sequentially to open the stellar paths. Earn up to 3 Stars on each challenge. <strong>Star ratings scale directly with fewer undos utilized</strong>, forcing high strategic alignment.
                  </p>
                </div>
              </div>
            )}

            {/* TAB CONTENTS 2: ENDLESS VAULT */}
            {activeTab === 'endless' && (
              <div className="flex-1 flex flex-col justify-between select-none">
                <div className="bg-gradient-to-r from-zinc-950 to-zinc-900/60 border border-zinc-900 rounded-xl p-4 mb-4 flex flex-col sm:flex-row items-center gap-5">
                  <div className="w-16 h-16 bg-purple-950/50 border border-purple-500/30 rounded-2xl flex items-center justify-center relative shrink-0 shadow-lg">
                    <Layers className="w-8 h-8 text-purple-400 animate-pulse" />
                    <div className="absolute inset-1 border border-dashed border-purple-500/10 rounded-xl pointer-events-none" />
                  </div>

                  <div className="text-left flex-1">
                    <span className="text-[8.5px] font-mono uppercase tracking-wider text-purple-400 font-extrabold block">Endless Ascent Lift</span>
                    <h4 className="text-sm font-serif font-black uppercase text-zinc-100 tracking-wider">Infinite Relic Columns</h4>
                    <p className="text-[10.5px] text-zinc-400 mt-1 max-w-lg leading-relaxed">
                      Siphon infinite levels of crystal stacks that dynamically scale to extreme layouts as you climb. Rewards expand proportionally with the depth ascended.
                    </p>
                  </div>
                </div>

                {/* ENDLESS STATUS ENGINE PANEL */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 font-mono text-xs">
                  <div className="bg-[#020204] border border-zinc-900 rounded-xl p-4 text-left flex flex-col justify-between h-36">
                    <div>
                      <span className="text-[8px] text-zinc-550 uppercase font-black tracking-wider block">Vault Records</span>
                      <h5 className="text-zinc-200 font-bold uppercase mt-1">Sovereign Lord Height</h5>
                    </div>
                    
                    <div className="flex items-end justify-between mt-4">
                      <div className="text-left">
                        <span className="text-[7.5px] text-zinc-550 block">MAX FLOOR CLIMBED</span>
                        <span className="text-lg font-black text-purple-400">Floor {prog.maxEndlessFloor}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[7.5px] text-zinc-550 block">PENDING DEPLOY</span>
                        <span className="text-lg font-black text-zinc-200">Floor {prog.currentEndlessFloor}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#020204] border border-zinc-900 rounded-xl p-4 text-left flex flex-col justify-between h-36">
                    <div>
                      <span className="text-[8px] text-zinc-550 uppercase font-black tracking-wider block">Endless Scaling</span>
                      <h5 className="text-zinc-200 font-bold uppercase mt-1">Active Column Properties</h5>
                    </div>

                    <div className="text-[9.5px] text-zinc-400 space-y-1 mt-2.5">
                      <div className="flex justify-between">
                        <span>Target Density:</span>
                        <span className="text-zinc-300 font-bold">{Math.min(90, 30 + Math.floor((prog.currentEndlessFloor - 1) / 2) * 6)} Runes</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Layers Stacking:</span>
                        <span className="text-zinc-300 font-bold">{prog.currentEndlessFloor > 10 ? 'Level 4 Max' : 'Level 3 Max'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Loot Multiplier:</span>
                        <span className="text-emerald-400 font-bold">x{(1.0 + (prog.currentEndlessFloor - 1) * 0.05).toFixed(2)} Base</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-2 select-none">
                  <button
                    onClick={startEndlessGame}
                    className="px-8 py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white font-mono text-xs font-black uppercase tracking-widest rounded-xl cursor-pointer active:scale-95 transition-all flex items-center gap-2 shadow-[0_4px_24px_rgba(147,51,234,0.3)]"
                  >
                    <Layers className="w-4 h-4" />
                    <span>ASCEND CHAMBER FLOOR {prog.currentEndlessFloor}</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENTS 3: DAILY EXTREME CHALLENGE */}
            {activeTab === 'daily' && (
              <div className="flex-1 flex flex-col justify-between select-none">
                
                {/* HERO CHALLENGE BOARD */}
                <div className="bg-gradient-to-b from-[#0a0614] to-[#040208] border border-purple-900/30 rounded-2xl p-5 text-center relative overflow-hidden mb-4">
                  
                  {/* S1 Banner */}
                  <div className="absolute top-3 right-3 bg-fuchsia-950 border border-fuchsia-800 text-fuchsia-300 px-2 py-0.5 text-[8.5px] rounded font-mono uppercase font-black tracking-wider">
                    Season 1 Active
                  </div>

                  <Zap className="w-10 h-10 text-amber-400 mx-auto animate-bounce mb-2" />
                  
                  <span className="text-[8.5px] uppercase font-mono tracking-widest text-zinc-500 font-black block">BOSS SEAL OF THE DAY</span>
                  <h4 className="text-sm font-serif font-black uppercase text-zinc-100 mt-1 tracking-wider">
                    Tomb of the Obsidian Colossus
                  </h4>
                  <p className="text-[10px] text-zinc-400 max-w-md mx-auto mt-1.5 leading-relaxed">
                    A heavy 72-tile stacked monolithic layout. Requires extreme chronological foresight. <strong>Zero hint assistance</strong> permitted on this seal challenge!
                  </p>

                  <div className="bg-black/45 border border-zinc-900/60 rounded-xl p-3 my-4 max-w-sm mx-auto grid grid-cols-2 gap-4 font-mono text-[9px] text-left">
                    <div>
                      <span className="text-zinc-550 block">TODAY'S LOCK OUT:</span>
                      <span className={`font-bold block text-xs ${prog.dailyCompletedToday ? 'text-emerald-400' : 'text-amber-500'}`}>
                        {prog.dailyCompletedToday ? '👑 PURIFIED (Claimed)' : '⚠️ UNRESOLVED'}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-550 block">SEASONAL STREAK:</span>
                      <span className="font-bold block text-xs text-zinc-200">
                        {prog.dailyStreak} Days
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-4 text-[9.5px] font-mono text-zinc-550">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Next Seal Refresh in: <strong className="text-zinc-350">14h 32m</strong></span>
                    </div>
                    
                    {/* Developer bypass button */}
                    <button
                      onClick={() => {
                        saveProgression({ ...prog, dailyCompletedToday: false });
                        addLog("⚙️ Developer Bypass: Daily extreme challenge has been reset.", "info");
                        triggerAudioPlayback("toggle_setting");
                      }}
                      className="text-[8px] bg-zinc-900 hover:bg-zinc-850 px-2 py-0.5 rounded border border-zinc-800 text-zinc-400"
                      title="Simulate daily timer expiration to play again"
                    >
                      Bypass Refresh
                    </button>
                  </div>
                </div>

                <div className="flex justify-center select-none">
                  <button
                    onClick={startDailyExtremeGame}
                    className="px-8 py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:brightness-110 text-white font-mono text-xs font-black uppercase tracking-widest rounded-xl cursor-pointer active:scale-95 transition-all flex items-center gap-2 shadow-[0_4px_24px_rgba(245,158,11,0.25)]"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>LAUNCH EXTREME SEAL PUZZLE</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB CONTENTS 4: PLAYER PROFILE STATISTICS */}
            {activeTab === 'profile' && (
              <div className="flex-1 flex flex-col justify-between select-none">
                
                {/* PROFILE HEADER NODES */}
                <div className="bg-[#020204] border border-zinc-900 rounded-2xl p-4 flex items-center gap-4 text-left mb-4 select-none">
                  <div className="w-12 h-12 rounded-full border-2 border-purple-500/40 bg-purple-950/40 flex items-center justify-center shadow-md relative">
                    <TrophyIcon className="w-5 h-5 text-purple-400 animate-pulse" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif font-black uppercase text-zinc-100 text-xs tracking-wider">Guardian Profile</h4>
                      <span className={`px-2 py-0.5 text-[8px] font-mono font-black border rounded-md uppercase tracking-tight ${currentBadge.style}`}>
                        {currentBadge.title}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 block mt-0.5">Siphon Tier: 4X Sovereign Lord</span>
                  </div>
                </div>

                {/* GRAPHICAL STATISTICS CONTAINER */}
                <div className="bg-[#040408]/60 border border-zinc-900/60 rounded-xl p-4 font-mono text-[10.5px] space-y-2 mb-4 text-left">
                  <span className="text-[8px] text-zinc-550 uppercase font-black tracking-wider block mb-2 select-none">Historic Reliquary Stats</span>
                  
                  <div className="grid grid-cols-2 gap-4 border-b border-zinc-900 pb-2.5">
                    <div>
                      <span className="text-zinc-550 block">TOTAL SOLVES</span>
                      <strong className="text-zinc-200 text-sm font-black">{prog.totalWins} Completed</strong>
                    </div>
                    <div>
                      <span className="text-zinc-550 block">DEFEAT SEALS</span>
                      <strong className="text-zinc-250 text-sm font-black">{prog.totalDefeats} Failed</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-b border-zinc-900 pb-2.5">
                    <div>
                      <span className="text-zinc-550 block">RUNE MATCHESMADE</span>
                      <strong className="text-zinc-200 text-sm font-black">{prog.totalMatches} Triplets</strong>
                    </div>
                    <div>
                      <span className="text-zinc-550 block">PEAK COMBO MULTIPLIER</span>
                      <strong className="text-purple-400 text-sm font-black">x{prog.peakCombo || 1} Streak</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-zinc-550 block">CHRONO UNDOS REWOUND</span>
                      <strong className="text-zinc-250 text-[11px] font-bold">{prog.undosUsed} Times</strong>
                    </div>
                    <div>
                      <span className="text-zinc-550 block">DAILY EXTREME STREAK</span>
                      <strong className="text-amber-400 text-[11px] font-bold">{prog.dailyStreak} Daily Seals</strong>
                    </div>
                  </div>
                </div>

                {/* GENERAL UTILITIES */}
                <div className="bg-zinc-950/40 border border-zinc-900/60 rounded-xl p-3 flex items-center justify-between">
                  <div className="text-left font-mono text-[9px] text-zinc-550">
                    <span>Active Profile save version: v1.2</span>
                  </div>

                  <button
                    onClick={handleResetProfile}
                    className="text-[9.5px] font-mono font-black text-rose-500 hover:text-rose-400 uppercase tracking-widest flex items-center gap-1 bg-rose-950/10 hover:bg-rose-950/20 px-3 py-1.5 rounded-lg border border-rose-950 cursor-pointer active:scale-95 transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Wipe Profile</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'arena' && (
              <CrystalVaultArenaTab resources={resources} addLog={addLog} />
            )}

            {activeTab === 'beasts' && (
              <CrystalVaultBeastTrialsTab resources={resources} addLog={addLog} />
            )}

            {activeTab === 'convergence' && (
              <CrystalVaultConvergenceTab resources={resources} addLog={addLog} />
            )}

            {activeTab === 'social' && (
              <CrystalVaultSocialCompetitiveTab resources={resources} addLog={addLog} />
            )}

          </div>
        )}

        {/* SCREEN 2: ACTIVE PUZZLE GAMEPLAY */}
        {activeScreen === 'puzzle' && (
          <div className="flex-1 flex flex-col justify-between h-full z-10 relative">
            
            {/* IN-GAME PANEL METRICS */}
            <div className="flex items-center justify-between bg-zinc-950/60 border border-zinc-900 rounded-xl p-3 mb-4 font-mono select-none">
              <div className="text-left">
                <span className="text-[8.5px] text-zinc-550 uppercase font-black block">Active Board</span>
                <span className="text-xs text-zinc-200 font-bold uppercase">
                  {gameMode === 'expedition' && currentLevelRun ? `Expedition ${currentLevelRun.world}-${currentLevelRun.level}` :
                   gameMode === 'endless' ? `Endless Floor ${currentEndlessFloorRun}` : 'Daily Extreme Seal'}
                </span>
              </div>

              <div className="text-center">
                <span className="text-[8.5px] text-zinc-550 uppercase font-black block">Purification Score</span>
                <span className="text-sm font-black text-amber-400">{score}</span>
              </div>

              <div className="text-right">
                <span className="text-[8.5px] text-zinc-550 uppercase font-black block">Multiplier Streak</span>
                <div className="flex items-center justify-end gap-1.5">
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${
                    combo > 0 ? 'bg-purple-950 border border-purple-800 text-purple-300 animate-pulse' : 'bg-zinc-900 text-zinc-500'
                  }`}>
                    x{combo > 0 ? Math.min(5, combo) : 1}
                  </span>
                  {combo > 0 && (
                    <div className="w-12 h-1 bg-zinc-900 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-purple-500"
                        initial={{ width: '100%' }}
                        animate={{ width: '0%' }}
                        transition={{ duration: (comboExpiry - Date.now()) / 1000, ease: 'linear' }}
                        key={comboExpiry}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0 items-stretch">
              
              {/* LEFT COLUMN: THE COMBAT ARENA ENGINE (5/12) */}
              <div className="lg:col-span-5 h-full">
                <CrystalVaultCombatArena
                  ref={combatArenaRef}
                  key={`combat_${gameMode}_${gameMode === 'expedition' ? currentLevelRun?.id : (gameMode === 'endless' ? currentEndlessFloorRun : 'daily')}`}
                  world={gameMode === 'expedition' && currentLevelRun ? currentLevelRun.world : 3}
                  floor={gameMode === 'endless' ? currentEndlessFloorRun : 1}
                  onVictory={() => {
                    addLog("⚔️ ARENA REPORT: Guardian victory achieved!", "success");
                  }}
                  onDefeat={() => {
                    addLog("⚠️ ARENA REPORT: Guardians have collapsed under fire!", "warning");
                  }}
                  onLogMessage={(msg, type) => {
                    addLog(`[COMBAT] ${msg}`, type === 'success' ? 'success' : (type === 'warning' ? 'warning' : 'info'));
                  }}
                />
              </div>

              {/* RIGHT COLUMN: MAHJONG PUZZLE ALIGNER (7/12) */}
              <div className="lg:col-span-7 flex flex-col justify-between h-full min-h-0">
                
                {/* MAIN INTERACTIVE BOARD MATRIX */}
                <div className="flex-1 flex items-center justify-center min-h-[380px] p-2 overflow-hidden relative bg-[#040408]/40 border border-zinc-900/30 rounded-2xl mb-4">
                  
                  <AnimatePresence>
                    {defeatState && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-[#030306]/95 flex flex-col items-center justify-center z-40 p-6 text-center select-none"
                      >
                        <AlertTriangle className="w-12 h-12 text-rose-500 mb-3 animate-pulse" />
                        <h3 className="font-serif font-black text-lg text-white uppercase tracking-widest">Altar Congested</h3>
                        <p className="text-xs text-zinc-400 max-w-sm mt-1.5 leading-relaxed">
                          The Relic Altar matching tray contains too many divergent runes. No space remains to orchestrate alignment.
                        </p>

                        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-3 my-4 w-52 font-mono text-xs">
                          <div className="flex justify-between mb-1.5">
                            <span className="text-zinc-550">Unresolved Runes:</span>
                            <span className="text-rose-400 font-bold">{boardTiles.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-zinc-550">Final Score:</span>
                            <span className="text-white font-bold">{score}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              if (gameMode === 'expedition' && currentLevelRun) startExpeditionGame(currentLevelRun);
                              else if (gameMode === 'endless') startEndlessGame();
                              else if (gameMode === 'daily') startDailyExtremeGame();
                            }}
                            className="px-5 py-2 bg-gradient-to-r from-rose-600 to-orange-600 hover:brightness-110 text-white font-mono text-xs font-black uppercase rounded-full cursor-pointer transition-all active:scale-95"
                          >
                            Retry Challenge
                          </button>
                          <button
                            onClick={() => setActiveScreen('selection')}
                            className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-xs font-bold uppercase rounded-full cursor-pointer border border-zinc-850"
                          >
                            Lobby Exit
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ACTIVE BOARD TILE LAYOUT GRID */}
                  <div className="relative w-full max-w-[500px] h-[320px] select-none">
                    
                    {boardTiles.map((tile) => {
                      const type = TILE_TYPES.find(t => t.id === tile.typeId) || TILE_TYPES[0];
                      
                      // Coordinate conversions with centering adjustments
                      const topPos = tile.y * (TILE_HEIGHT * 0.72) + 20;
                      const leftPos = tile.x * (TILE_WIDTH * 0.9) + 40;
                      const zIndexValue = 10 + tile.z;
                      const shadowOffset = tile.z * 3;

                      return (
                        <div
                          key={tile.id}
                          onClick={(e) => selectTile(tile, e)}
                          style={{
                            position: 'absolute',
                            top: `${topPos}px`,
                            left: `${leftPos}px`,
                            zIndex: zIndexValue,
                            width: `${TILE_WIDTH}px`,
                            height: `${TILE_HEIGHT}px`
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
                            className={`w-full h-full rounded-lg border-2 flex flex-col justify-between p-1.5 transition-all relative ${
                              tile.isBlocked
                                ? 'bg-zinc-950/90 border-zinc-900/60 text-zinc-650 filter brightness-40 pointer-events-none'
                                : `${type.bgColor} ${type.borderColor} text-white hover:brightness-110 active:scale-95`
                            } ${
                              tile.isHinted ? 'ring-2 ring-purple-400 border-purple-400 shadow-[0_0_12px_#a855f7]' : ''
                            } ${
                              accessibilityMode && !tile.isBlocked ? 'border-zinc-300 border-3' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[7.5px] font-mono opacity-40 font-bold">L{tile.z}</span>
                              {accessibilityMode && !tile.isBlocked && (
                                <span className="text-[7px] font-mono bg-white text-black px-0.5 rounded font-bold scale-90">
                                  {type.label}
                                </span>
                              )}
                            </div>

                            <div className="flex-1 flex items-center justify-center">
                              <span className={`text-sm ${tile.isBlocked ? 'opacity-30' : 'animate-pulse'}`} style={{ animationDuration: '4s' }}>
                                {type.emoji}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-[9px] leading-none opacity-80">{type.symbol}</span>
                              {!tile.isBlocked && (
                                <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                              )}
                            </div>

                            {!tile.isBlocked && tile.z > 0 && (
                              <div 
                                style={{
                                  width: `${TILE_WIDTH}px`,
                                  height: `${TILE_HEIGHT}px`,
                                  transform: `translate(${tile.z * 1.5}px, ${tile.z * 1.5}px)`,
                                }}
                                className="absolute -right-[2px] -bottom-[2px] rounded-lg border border-purple-950/20 pointer-events-none border-t-0 border-l-0 -z-10" 
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {boardTiles.length === 0 && !victoryState && !defeatState && (
                      <div className="absolute inset-0 flex items-center justify-center text-zinc-500 font-mono text-xs">
                        <span>Constructing Stacks...</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* HELPER CONTROLS ACTION RAIL */}
                <div className="grid grid-cols-3 gap-2.5 mb-4 select-none">
                  <button
                    onClick={triggerUndo}
                    disabled={undoStack.length === 0 || victoryState || defeatState}
                    className={`py-2 px-3 rounded-xl border flex items-center justify-center gap-1.5 font-mono text-[10px] font-bold uppercase transition-all ${
                      undoStack.length > 0 
                        ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900 cursor-pointer active:scale-95' 
                        : 'bg-zinc-950/40 border-zinc-950 text-zinc-650 cursor-not-allowed'
                    }`}
                    title="Undo last action"
                  >
                    <UndoIcon className="w-3.5 h-3.5" />
                    <span>Undo ({undoStack.length})</span>
                  </button>

                  <button
                    onClick={triggerShuffle}
                    disabled={boardTiles.length === 0 || victoryState || defeatState}
                    className="py-2 px-3 bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-xl flex items-center justify-center gap-1.5 font-mono text-[10px] font-bold uppercase cursor-pointer active:scale-95 transition-all"
                    title="Shuffle board tiles"
                  >
                    <ShuffleIcon className="w-3.5 h-3.5" />
                    <span>Shuffle</span>
                  </button>

                  <button
                    onClick={triggerHint}
                    disabled={boardTiles.length === 0 || victoryState || defeatState || gameMode === 'daily'}
                    className="py-2 px-3 bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900 rounded-xl flex items-center justify-center gap-1.5 font-mono text-[10px] font-bold uppercase cursor-pointer active:scale-95 transition-all"
                    title={gameMode === 'daily' ? 'Hints disabled for daily extreme' : 'Reveal hint'}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Hint</span>
                  </button>
                </div>

                {/* RELIC ALTAR Tray (HOLDING AND MATCHING SLOTS) */}
                <div className="bg-[#050508] border border-purple-950/40 rounded-2xl p-3.5 relative overflow-hidden shadow-[inset_0_4px_24px_rgba(0,0,0,0.8)]">
                  <div className="absolute inset-x-3.5 top-3.5 bottom-3.5 flex justify-between pointer-events-none">
                    {Array.from({ length: 7 }).map((_, i) => (
                      <div key={i} className="flex-1 max-w-[42px] mx-1 rounded-lg border border-dashed border-zinc-900/50 bg-[#020204]/20" />
                    ))}
                  </div>

                  <div className="relative flex justify-center items-center min-h-[58px] gap-2 select-none">
                    <AnimatePresence>
                      {tray.map((tile, index) => {
                        const type = TILE_TYPES.find(t => t.id === tile.typeId) || TILE_TYPES[0];
                        return (
                          <motion.div
                            key={`${tile.id}_tray_${index}`}
                            layoutId={tile.id}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                            className={`w-10 h-12 rounded-md border-2 ${type.bgColor} ${type.borderColor} flex flex-col justify-between p-1.5 z-10`}
                          >
                            <div className="flex justify-between items-center text-[6px] font-mono opacity-55">
                              <span>Alt</span>
                              {accessibilityMode && (
                                <span className="bg-white text-black px-0.5 rounded scale-75 origin-right">{type.label}</span>
                              )}
                            </div>
                            <div className="text-center text-xs">{type.emoji}</div>
                            <div className="flex justify-between items-center text-[7px] leading-none opacity-50">
                              <span>{type.symbol}</span>
                              <div className="w-1 h-1 rounded-full bg-purple-400" />
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>

                    {tray.length === 0 && (
                      <span className="text-[9.5px] uppercase font-mono tracking-widest text-zinc-550 z-10 pointer-events-none">
                        🔮 Place runes inside the Altar
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2.5 px-1 relative z-10 select-none">
                    <span className="text-[8px] font-mono text-zinc-550">Relic Altar Slot tray ({tray.length}/7 occupied)</span>
                    <span className="text-[8px] font-mono text-zinc-550">Auto-aligns matching triplets</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>

      {/* SIDEBAR: TECHNICAL MONITOR & SPECIFICATION */}
      <div className="w-full lg:w-80 h-80 lg:h-full bg-zinc-950 p-4 border-t lg:border-t-0 border-zinc-900 overflow-y-auto no-scrollbar font-mono flex flex-col justify-between shrink-0 relative">
        <div>
          <div className="flex items-center gap-2 border-b border-zinc-900 pb-2.5 mb-3 select-none">
            <Cpu className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-[10px] uppercase font-black tracking-widest text-zinc-400">
              Godot 4.4 Engine Hub
            </span>
          </div>

          <p className="text-[10px] text-zinc-500 leading-relaxed mb-4 text-left select-none">
            The active view perfectly simulates a bound Godot 4.4 autoload thread, writing real-time event signals and syncing progress directly back to local save dictionaries.
          </p>

          <span className="text-[8px] uppercase tracking-wider text-zinc-650 font-black mb-1.5 block text-left select-none">ACTIVE TELEMETRY LOGS</span>
          <div className="bg-[#020204] p-2 rounded-xl border border-zinc-900 text-left overflow-y-auto h-40 max-h-40 no-scrollbar select-all">
            {godotLogs.length === 0 ? (
              <span className="text-[9px] text-zinc-600">No signals dispatched yet. Select a tile to trigger hooks...</span>
            ) : (
              godotLogs.map((log, index) => (
                <div key={index} className="text-[8.5px] leading-relaxed text-zinc-400 font-mono select-text truncate">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dynamic State Properties visualizer representing Godot components */}
        <div className="mt-4 border-t border-zinc-900 pt-3 select-none">
          <div className="grid grid-cols-2 gap-2 text-[9px] text-zinc-500 text-left">
            <div className="bg-black/35 p-2 rounded-lg border border-zinc-900 flex flex-col gap-1">
              <span className="text-zinc-450 uppercase font-bold text-[8px] tracking-wide">🧩 Save Registry</span>
              <span className="text-zinc-350">Status: Synced & Saved</span>
              <span className="text-emerald-400 font-bold">STORAGE: OK</span>
            </div>

            <div className="bg-black/35 p-2 rounded-lg border border-zinc-900 flex flex-col gap-1">
              <span className="text-zinc-450 uppercase font-bold text-[8px] tracking-wide">📦 Layout Parser</span>
              <span className="text-zinc-350">Method: Procedural Pyramid</span>
              <span className="text-emerald-400 font-bold">SCALING: TRUE</span>
            </div>
          </div>
        </div>

      </div>

      {/* OVERLAY MODAL 1: LEVEL MISSION DEPLOY BOARD */}
      {selectedLevel && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-zinc-950 border border-zinc-850 rounded-2xl p-5 text-left font-mono text-zinc-300 shadow-2xl relative"
          >
            <div className="flex justify-between items-start border-b border-zinc-900 pb-3 mb-3">
              <div>
                <span className="text-[8px] bg-purple-950 text-purple-300 border border-purple-800 px-2 py-0.5 rounded uppercase font-black">
                  World {selectedWorld} - Level {selectedLevel.level}
                </span>
                <h3 className="text-sm font-serif font-black text-white uppercase tracking-wider mt-1.5">{selectedLevel.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedLevel(null)}
                className="text-zinc-500 hover:text-white font-black text-xs px-2 py-1 rounded-md bg-zinc-900/60 hover:bg-zinc-900 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-[10.5px] text-zinc-400 leading-relaxed mb-4">
              {selectedLevel.description}
            </p>

            <div className="bg-black/45 border border-zinc-900 rounded-xl p-3 space-y-2 mb-4 text-[10px]">
              <div className="flex justify-between">
                <span className="text-zinc-550">Level Difficulty:</span>
                <span className={`font-bold uppercase ${
                  selectedLevel.difficulty === 'Easy' ? 'text-emerald-400' :
                  selectedLevel.difficulty === 'Medium' ? 'text-blue-400' : 'text-rose-400'
                }`}>{selectedLevel.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-550">Structure Density:</span>
                <span className="text-zinc-200 font-bold">{selectedLevel.tilesCount} Runes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-550">Recommended Keep:</span>
                <span className="text-zinc-200 font-bold">Level {selectedWorld * 4 - 3}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-550">Energy Cost:</span>
                <span className="text-cyan-400 font-bold">5 Energy</span>
              </div>
            </div>

            <span className="text-[8px] text-zinc-550 uppercase font-black tracking-wider block mb-2">POSSIBLE MISSION REWARDS</span>
            <div className="grid grid-cols-3 gap-2 text-[9px] mb-5">
              <div className="bg-zinc-900/40 p-2 rounded-lg border border-zinc-900 flex flex-col items-center gap-1">
                <span>💎 Shards</span>
                <span className="text-cyan-400 font-bold">~{Math.round(30 * (selectedLevel.difficulty === 'Easy' ? 1 : selectedLevel.difficulty === 'Medium' ? 1.25 : 1.5))}</span>
              </div>
              <div className="bg-zinc-900/40 p-2 rounded-lg border border-zinc-900 flex flex-col items-center gap-1">
                <span>🪙 Gold</span>
                <span className="text-yellow-500 font-bold">~1,200</span>
              </div>
              <div className="bg-zinc-900/40 p-2 rounded-lg border border-zinc-900 flex flex-col items-center gap-1">
                <span>🪵 Wood</span>
                <span className="text-zinc-300 font-bold">~2,400</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedLevel(null)}
                className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 text-xs font-black uppercase rounded-xl border border-zinc-800 cursor-pointer active:scale-95 transition-all text-center"
              >
                Cancel
              </button>
              
              <button
                onClick={() => startExpeditionGame(selectedLevel)}
                className="flex-1 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white text-xs font-black uppercase rounded-xl cursor-pointer active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(147,51,234,0.2)]"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>DEPLOY UNIT</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* OVERLAY MODAL 2: INTERACTIVE REWARD SYNTHESIS SYSTEM CHEST */}
      {showRewardModal && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-zinc-950 border border-zinc-850 rounded-3xl p-6 text-center font-mono shadow-2xl relative"
          >
            {/* Glowing burst behind */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

            <span className="text-[9px] uppercase font-mono tracking-widest text-purple-400 font-black block">
              Altar Synthesis Completed
            </span>
            <h3 className="text-base font-serif font-black text-white uppercase mt-1 tracking-wider">
              {gameMode === 'expedition' ? 'Expedition Chest Synthesized' :
               gameMode === 'endless' ? 'Endless Ascent Loot' : 'Grand Obsidian Reliquary Chest'}
            </h3>

            {/* INTERACTIVE CHEST RENDERING */}
            <div className="my-6 relative flex flex-col items-center justify-center min-h-[160px] select-none">
              
              {chestOpenState === 'idle' && (
                <div 
                  onClick={() => {
                    setChestOpenState('opening');
                    triggerAudioPlayback("chest_unlocked");
                    spawnVisualBurst(200, 250, '#e9d5ff');
                    setTimeout(() => {
                      setChestOpenState('revealed');
                      triggerAudioPlayback("reward_claimed_fanfare");
                      spawnVisualBurst(200, 250, '#facc15', '⭐');
                      spawnVisualBurst(200, 250, '#22d3ee', '💎');
                    }, 1400);
                  }}
                  className="group cursor-pointer flex flex-col items-center animate-pulse"
                >
                  {/* Closed Chest representation */}
                  <div className="text-6xl filter drop-shadow-[0_0_15px_rgba(168,85,247,0.4)] group-hover:scale-105 transition-transform duration-200">
                    {gameMode === 'expedition' ? '📦' : gameMode === 'endless' ? '🔮' : '🔒'}
                  </div>
                  <span className="text-[9px] text-amber-400 font-black tracking-widest mt-4 uppercase bg-amber-950/40 border border-amber-900 px-3 py-1 rounded-full animate-bounce">
                    Tap to Synthesize Element
                  </span>
                </div>
              )}

              {chestOpenState === 'opening' && (
                <div className="flex flex-col items-center justify-center">
                  <span className="text-5xl animate-spin" style={{ animationDuration: '3s' }}>🌀</span>
                  <span className="text-[10px] text-zinc-500 mt-4 animate-pulse">Siphoning cosmic energies...</span>
                </div>
              )}

              {chestOpenState === 'revealed' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full space-y-4"
                >
                  <div className="flex items-center justify-center gap-1.5 text-amber-400 text-lg mb-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <span key={i} className="animate-bounce" style={{ animationDelay: `${i * 150}ms` }}>
                        {i < earnedStars ? '★' : '☆'}
                      </span>
                    ))}
                  </div>

                  {/* Rewards Reveal Grid */}
                  <div className="grid grid-cols-3 gap-2.5 text-xs text-left max-w-sm mx-auto">
                    {earnedRewards.shards > 0 && (
                      <div className="bg-zinc-900/60 p-2 border border-zinc-900 rounded-xl flex flex-col gap-0.5">
                        <span className="text-[10px] text-zinc-500">💎 Shards</span>
                        <strong className="text-cyan-400 font-bold">+{earnedRewards.shards}</strong>
                      </div>
                    )}
                    {earnedRewards.orbs > 0 && (
                      <div className="bg-zinc-900/60 p-2 border border-zinc-900 rounded-xl flex flex-col gap-0.5">
                        <span className="text-[10px] text-zinc-500">⭐ Orbs</span>
                        <strong className="text-amber-400 font-bold">+{earnedRewards.orbs}</strong>
                      </div>
                    )}
                    {earnedRewards.gold > 0 && (
                      <div className="bg-zinc-900/60 p-2 border border-zinc-900 rounded-xl flex flex-col gap-0.5">
                        <span className="text-[10px] text-zinc-500">🪙 Gold</span>
                        <strong className="text-yellow-500 font-bold">+{formatNum(earnedRewards.gold)}</strong>
                      </div>
                    )}
                    {earnedRewards.wood > 0 && (
                      <div className="bg-zinc-900/60 p-2 border border-zinc-900 rounded-xl flex flex-col gap-0.5">
                        <span className="text-[10px] text-zinc-500">🪵 Wood</span>
                        <strong className="text-zinc-200 font-bold">+{formatNum(earnedRewards.wood)}</strong>
                      </div>
                    )}
                    {earnedRewards.stone > 0 && (
                      <div className="bg-zinc-900/60 p-2 border border-zinc-900 rounded-xl flex flex-col gap-0.5">
                        <span className="text-[10px] text-zinc-500">🪨 Stone</span>
                        <strong className="text-zinc-200 font-bold">+{formatNum(earnedRewards.stone)}</strong>
                      </div>
                    )}
                    {earnedRewards.iron > 0 && (
                      <div className="bg-zinc-900/60 p-2 border border-zinc-900 rounded-xl flex flex-col gap-0.5">
                        <span className="text-[10px] text-zinc-500">⛓️ Iron</span>
                        <strong className="text-zinc-200 font-bold">+{formatNum(earnedRewards.iron)}</strong>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

            </div>

            {/* Run summary stats */}
            <div className="bg-black/45 border border-zinc-900 rounded-2xl p-3 mb-5 max-w-sm mx-auto text-[10px] text-zinc-500 text-left">
              <div className="flex justify-between">
                <span>Chrono Undos Rewound:</span>
                <span className="text-zinc-300 font-bold">{undosUsedThisRun} times</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Peak Multiplier Combo:</span>
                <span className="text-purple-400 font-bold">x{maxComboThisRun || 1} Streak</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={claimChestRewards}
                disabled={chestOpenState !== 'revealed'}
                className={`w-full py-3 text-xs font-black uppercase tracking-widest rounded-xl cursor-pointer active:scale-95 transition-all text-center ${
                  chestOpenState === 'revealed'
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_4px_16px_rgba(147,51,234,0.3)] hover:brightness-110'
                    : 'bg-zinc-900 text-zinc-500 cursor-not-allowed border border-zinc-850'
                }`}
              >
                Claim & Return to Vault
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
