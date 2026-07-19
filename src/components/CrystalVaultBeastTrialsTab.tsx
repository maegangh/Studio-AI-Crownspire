import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  Shield, 
  Sparkles, 
  Skull, 
  Target, 
  Sword, 
  Award, 
  Clock, 
  HelpCircle, 
  AlertTriangle, 
  Gift, 
  ChevronRight, 
  ArrowLeft, 
  Play, 
  Heart, 
  Database,
  Search,
  Check,
  Star,
  Users,
  Globe,
  Compass,
  Lock,
  Volume2,
  RefreshCw
} from 'lucide-react';

// ==========================================
// BEAST TRIALS DATA MODELS & DATABASES
// ==========================================

export interface BeastBoss {
  id: string;
  name: string;
  type: 'Wildling' | 'Elite' | 'World' | 'Alliance';
  title: string;
  avatarEmoji: string;
  colorTheme: string; // Tailwind bg/border classes
  accentColor: string; // Tailwind text color
  description: string;
  baseHp: number;
  elementalWeakness: 'solar_fire' | 'glacial_frost' | 'emerald_nature' | 'astral_light' | 'obsidian_core';
  phases: {
    hpThreshold: number; // percentage (e.g. 70, 40)
    name: string;
    description: string;
    abilityName: string;
    modifierEffect: 'frost' | 'decay' | 'chain' | 'none';
  }[];
  activeModifier: {
    name: string;
    desc: string;
    type: 'frost' | 'decay' | 'chain' | 'none';
  };
  baseAttack: number;
}

export interface TrialLeaderboardEntry {
  rank: number;
  name: string;
  guild: string;
  damage: number;
  rating: string;
  isPlayer?: boolean;
}

export interface BeastTrialTile {
  id: string;
  typeId: string;
  x: number;
  y: number;
  z: number;
  isBlocked: boolean;
  modifierState: 'frozen' | 'decayed' | 'chained' | 'none';
}

export interface BeastMilestoneReward {
  damageGoal: number;
  rewardName: string;
  rewardIcon: string;
  rewardDesc: string;
  claimed: boolean;
}

const ELEMENT_DB = [
  { id: 'solar_fire', label: 'VALOR', emoji: '🔥', color: 'text-rose-400' },
  { id: 'glacial_frost', label: 'FROST', emoji: '❄️', color: 'text-cyan-400' },
  { id: 'emerald_nature', label: 'GROWTH', emoji: '🌿', color: 'text-emerald-400' },
  { id: 'astral_light', label: 'ASTRAL', emoji: '⭐', color: 'text-fuchsia-400' },
  { id: 'obsidian_core', label: 'STONE', emoji: '💎', color: 'text-amber-400' },
  { id: 'elixir_pure', label: 'POTION', emoji: '🧪', color: 'text-purple-400' }
];

// Configuration of Bosses supporting Future Additions easily
const BEAST_BOSSES_DATABASE: BeastBoss[] = [
  {
    id: 'fenrir_shadow',
    name: 'Fenrir Shadowfang',
    type: 'Wildling',
    title: 'The Eclipse Wolf of Gloomwood',
    avatarEmoji: '🐺',
    colorTheme: 'border-emerald-500/30 bg-emerald-950/10 hover:border-emerald-500',
    accentColor: 'text-emerald-400',
    description: 'A colossal shadow beast corrupted by fractured altar elements. Strikes swiftly, blinding team actions.',
    baseHp: 15000,
    elementalWeakness: 'solar_fire',
    baseAttack: 180,
    activeModifier: {
      name: 'Decay Spores',
      desc: 'Infests random board tiles. Clicking decayed runes deals 120 rot damage directly to the party.',
      type: 'decay'
    },
    phases: [
      { hpThreshold: 75, name: 'Umbral Berserk', description: 'Fenrir grows shadow claws, increasing attack rating by 30%.', abilityName: 'Howl of Eclipse', modifierEffect: 'none' },
      { hpThreshold: 40, name: 'Savage Rend', description: 'Unleashes chained spikes. Generates heavy iron chains blocking matched triplets.', abilityName: 'Astral Siphon Maw', modifierEffect: 'chain' }
    ]
  },
  {
    id: 'pyre_lord_ignis',
    name: 'Ignis the Pyre-Lord',
    type: 'Elite',
    title: 'Molten Core Colossus',
    avatarEmoji: '🔥',
    colorTheme: 'border-rose-500/30 bg-rose-950/10 hover:border-rose-500',
    accentColor: 'text-rose-400',
    description: 'An elemental sovereign forged from obsidian slag and volcanic magma. Ignites tiles with cinder fury.',
    baseHp: 30000,
    elementalWeakness: 'glacial_frost',
    baseAttack: 280,
    activeModifier: {
      name: 'Molten Ashes',
      desc: 'Covers adjacent tile coordinates with molten debris. Matches require clearing shields first.',
      type: 'none'
    },
    phases: [
      { hpThreshold: 80, name: 'Superheat Aura', description: 'Deals 80 periodic thermal damage every player action turn.', abilityName: 'Eruption Wave', modifierEffect: 'none' },
      { hpThreshold: 45, name: 'Apocalypse Core', description: 'Chains 4 random tiles in fiery rune restraints.', abilityName: 'Volcanic Fallout', modifierEffect: 'chain' }
    ]
  },
  {
    id: 'aurelius_gold_drake',
    name: 'Aurelius the Gold Drake',
    type: 'World',
    title: 'Stellar Crown Protector',
    avatarEmoji: '🐉',
    colorTheme: 'border-amber-500/30 bg-amber-950/10 hover:border-amber-500',
    accentColor: 'text-amber-400',
    description: 'A legendary dragon hovering above Crownspire peaks. Holds impenetrable shields and ancient cosmic seals.',
    baseHp: 75000,
    elementalWeakness: 'obsidian_core',
    baseAttack: 420,
    activeModifier: {
      name: 'Frozen Altar Seals',
      desc: 'Encases 5 board tiles in solid permafrost. You must click adjacent free runes to shatter the ice locks.',
      type: 'frost'
    },
    phases: [
      { hpThreshold: 80, name: 'Nebula Altar Shield', description: 'Aurelius gains 5000 shield points that absorb all inbound matches.', abilityName: 'Solar Flare Breath', modifierEffect: 'none' },
      { hpThreshold: 50, name: 'Stellar Supernova', description: 'Drastically scales boss strike factor by +80% and freezes 3 more tiles.', abilityName: 'Astral Annihilation', modifierEffect: 'frost' },
      { hpThreshold: 25, name: 'Enraged Flight', description: 'Skins additional tiles with decay rot. Fast counterattack rates.', abilityName: 'Final Flare Eclipse', modifierEffect: 'decay' }
    ]
  },
  {
    id: 'goliath_crusher',
    name: 'Goliath Earth-Crusher',
    type: 'Alliance',
    title: 'Runic Altar Mountain Gargant',
    avatarEmoji: '🗿',
    colorTheme: 'border-fuchsia-500/30 bg-fuchsia-950/10 hover:border-fuchsia-500',
    accentColor: 'text-fuchsia-400',
    description: 'A massive titan mobilized by combined alliance beacons. Takes shared guild efforts to sough and crack.',
    baseHp: 150000,
    elementalWeakness: 'astral_light',
    baseAttack: 580,
    activeModifier: {
      name: 'Iron Altar Chains',
      desc: 'Iron bindings wrap around specific high-tier runes, sealing off matched elemental resonance.',
      type: 'chain'
    },
    phases: [
      { hpThreshold: 70, name: 'Earthen Barrier', description: 'Deals massive impact blocks, absorbing 30% elemental damage.', abilityName: 'Tectonic Collapse', modifierEffect: 'none' },
      { hpThreshold: 35, name: 'Furious Rubble', description: 'Scatters decay debris and frozen nodes simultaneously across layers.', abilityName: 'Cataclysmic Shatter', modifierEffect: 'frost' }
    ]
  },
  {
    id: 'void_weaver',
    name: 'The Chrono Weaver',
    type: 'Alliance',
    title: 'Future Cosmic Temporal Threat',
    avatarEmoji: '🕷️',
    colorTheme: 'border-violet-500/30 bg-violet-950/10 hover:border-violet-500',
    accentColor: 'text-violet-400',
    description: 'Future Threat. An ancient cosmic arachnid capable of threading and reversing match-3 history loops.',
    baseHp: 200000,
    elementalWeakness: 'emerald_nature',
    baseAttack: 650,
    activeModifier: {
      name: 'Temporal Lockout',
      desc: 'Lockout elements. Future expansion boss, unlocked during upcoming seasons.',
      type: 'chain'
    },
    phases: [
      { hpThreshold: 50, name: 'Timeline Fracture', description: 'Reverses damage values during extreme counter-strike sequences.', abilityName: 'Chrono Rift Burst', modifierEffect: 'chain' }
    ]
  }
];

// Generate Local Leaderboard rankings for active boss
const GENERATE_BOSS_LEADERBOARD = (bossId: string): TrialLeaderboardEntry[] => {
  const seeds: {[key: string]: TrialLeaderboardEntry[]} = {
    'fenrir_shadow': [
      { rank: 1, name: "Emperor Theron", guild: "Astral Core", damage: 18500, rating: "SS-Tier" },
      { rank: 2, name: "Lady Vespera", guild: "Shadow Vanguard", damage: 16200, rating: "S-Tier" },
      { rank: 3, name: "Archmage Kaelthas", guild: "Solar Radiance", damage: 14800, rating: "S-Tier" },
      { rank: 4, name: "Grandmaster Garrick", guild: "Iron Altar", damage: 12900, rating: "A-Tier" },
      { rank: 5, name: "Sovereign Eldrin", guild: "Crown Shield", damage: 11200, rating: "A-Tier" }
    ],
    'pyre_lord_ignis': [
      { rank: 1, name: "Archmage Kaelthas", guild: "Solar Radiance", damage: 32000, rating: "SS-Tier" },
      { rank: 2, name: "Sovereign Eldrin", guild: "Crown Shield", damage: 28500, rating: "S-Tier" },
      { rank: 3, name: "Lady Vespera", guild: "Shadow Vanguard", damage: 25400, rating: "S-Tier" },
      { rank: 4, name: "Emperor Theron", guild: "Astral Core", damage: 22100, rating: "A-Tier" },
      { rank: 5, name: "Warlord Saurfang", guild: "Rune Syndicate", damage: 19800, rating: "B-Tier" }
    ],
    'aurelius_gold_drake': [
      { rank: 1, name: "Emperor Theron", guild: "Astral Core", damage: 82000, rating: "SSS-Tier" },
      { rank: 2, name: "Grandmaster Garrick", guild: "Iron Altar", damage: 71500, rating: "SS-Tier" },
      { rank: 3, name: "Oracle Jaina", guild: "Chrono Keepers", damage: 62000, rating: "S-Tier" },
      { rank: 4, name: "Slayer Lyanna", guild: "Gilded Shield", damage: 54000, rating: "S-Tier" },
      { rank: 5, name: "Lady Vespera", guild: "Shadow Vanguard", damage: 45000, rating: "A-Tier" }
    ],
    'goliath_crusher': [
      { rank: 1, name: "Astral Core [ALLIANCE]", guild: "Astral Core", damage: 154000, rating: "SSS-Tier" },
      { rank: 2, name: "Shadow Vanguard [ALLIANCE]", guild: "Shadow Vanguard", damage: 139000, rating: "SS-Tier" },
      { rank: 3, name: "Solar Radiance [ALLIANCE]", guild: "Solar Radiance", damage: 120000, rating: "S-Tier" },
      { rank: 4, name: "Iron Altar [ALLIANCE]", guild: "Iron Altar", damage: 95000, rating: "A-Tier" },
      { rank: 5, name: "Rune Syndicate [ALLIANCE]", guild: "Rune Syndicate", damage: 78000, rating: "B-Tier" }
    ]
  };
  return seeds[bossId] || seeds['fenrir_shadow'];
};

const INITIAL_MILESTONES = (): BeastMilestoneReward[] => [
  { damageGoal: 5000, rewardName: 'Copper Beast Lockbox', rewardIcon: '📦', rewardDesc: 'Contains 200 Astral Shards & 2 Wolf Claws.', claimed: false },
  { damageGoal: 15000, rewardName: 'Chrono Spore Catalyst', rewardIcon: '🧪', rewardDesc: 'Alchemy elixir used to forge premium power runes.', claimed: false },
  { damageGoal: 35000, rewardName: 'Gilded Dragon Chest', rewardIcon: '🎁', rewardDesc: 'Yields 400 Shards & Aurelius Gold Crest.', claimed: false },
  { damageGoal: 65000, rewardName: 'Prism Overlord Sigil', rewardIcon: '⭐', rewardDesc: 'Adds golden glowing crown particles to your player tab.', claimed: false },
  { damageGoal: 100000, rewardName: 'Titan Heart Core', rewardIcon: '💎', rewardDesc: 'Premium material to forge Legendary equipment items.', claimed: false }
];

// ==========================================
// MAIN BEAST TRIALS MODULE
// ==========================================

interface CrystalVaultBeastTrialsTabProps {
  resources: any;
  addLog: (msg: string, type: 'info' | 'success' | 'warning' | 'combat') => void;
}

export default function CrystalVaultBeastTrialsTab({ resources, addLog }: CrystalVaultBeastTrialsTabProps) {
  // Navigation Screens
  // 'lobby' | 'combat' | 'summary'
  const [screen, setScreen] = useState<'lobby' | 'combat' | 'summary'>('lobby');
  
  // Selection States
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Wildling' | 'Elite' | 'World' | 'Alliance'>('All');
  const [selectedBoss, setSelectedBoss] = useState<BeastBoss>(BEAST_BOSSES_DATABASE[0]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'Easy' | 'Normal' | 'Heroic' | 'Mythic'>('Normal');
  
  // Local Stats & Records
  const [beastKeys, setBeastKeys] = useState<number>(5);
  const [bestDamageRecord, setBestDamageRecord] = useState<{[key: string]: number}>({
    'fenrir_shadow': 4200,
    'pyre_lord_ignis': 0,
    'aurelius_gold_drake': 0,
    'goliath_crusher': 0
  });
  const [activeLeaderboard, setActiveLeaderboard] = useState<TrialLeaderboardEntry[]>([]);
  const [milestones, setMilestones] = useState<BeastMilestoneReward[]>([]);

  // Sound Cue simulated
  const playBeastSound = (cue: string) => {
    addLog(`🔊 Beast Trial Dispatch: "${cue}"`, "info");
  };

  // Load persistence from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('crownspire_beast_trials');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setBestDamageRecord(parsed.bestRecord ?? {
          'fenrir_shadow': 4200,
          'pyre_lord_ignis': 0,
          'aurelius_gold_drake': 0,
          'goliath_crusher': 0
        });
        setBeastKeys(parsed.keys ?? 5);
        setMilestones(parsed.milestones ?? INITIAL_MILESTONES());
      } catch (e) {
        setMilestones(INITIAL_MILESTONES());
      }
    } else {
      setMilestones(INITIAL_MILESTONES());
    }
  }, []);

  // Update rankings whenever boss changes
  useEffect(() => {
    const board = GENERATE_BOSS_LEADERBOARD(selectedBoss.id);
    const personalBest = bestDamageRecord[selectedBoss.id] || 0;
    
    // Inject player if they have dealt damage
    let finalBoard = [...board];
    if (personalBest > 0) {
      const playerEntry: TrialLeaderboardEntry = {
        rank: 99,
        name: "Your Guardian",
        guild: "Your Citadel",
        damage: personalBest,
        rating: personalBest >= 100000 ? 'SSS-Tier' : personalBest >= 65000 ? 'SS-Tier' : personalBest >= 35000 ? 'S-Tier' : personalBest >= 15000 ? 'A-Tier' : 'B-Tier',
        isPlayer: true
      };
      finalBoard.push(playerEntry);
      finalBoard.sort((a, b) => b.damage - a.damage);
      finalBoard = finalBoard.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
    }
    setActiveLeaderboard(finalBoard);
  }, [selectedBoss, bestDamageRecord]);

  const commitBeastChanges = (updates: any) => {
    const data = {
      bestRecord: updates.bestRecord ?? bestDamageRecord,
      keys: updates.keys ?? beastKeys,
      milestones: updates.milestones ?? milestones
    };
    localStorage.setItem('crownspire_beast_trials', JSON.stringify(data));
  };

  // ==========================================
  // GAMEPLAY ENGINE - COMBAT VARIABLES & BOARD
  // ==========================================
  const [board, setBoard] = useState<BeastTrialTile[]>([]);
  const [tray, setTray] = useState<BeastTrialTile[]>([]);
  
  // Boss state
  const [bossHp, setBossHp] = useState<number>(10000);
  const [bossMaxHp, setBossMaxHp] = useState<number>(10000);
  const [bossPhaseIdx, setBossPhaseIdx] = useState<number>(0); // Active index of phase
  const [bossShield, setBossShield] = useState<number>(0);
  const [bossTimer, setBossTimer] = useState<number>(4); // decrementing turn moves
  const [enrageLevel, setEnrageLevel] = useState<number>(0); // turns elapsed
  const [totalDamageDealt, setTotalDamageDealt] = useState<number>(0);

  // Player state
  const [playerHp, setPlayerHp] = useState<number[]>([1500, 1200, 2000]); // Valen, Lyra, Aethelgard
  const [playerMaxHp] = useState<number[]>([1500, 1200, 2000]);
  const [playerShield, setPlayerShield] = useState<number[]>([0, 0, 0]);
  const [playerEnergy, setPlayerEnergy] = useState<number[]>([0, 0, 0]);

  // Display logs
  const [combatLogs, setCombatLogs] = useState<string[]>([]);
  const [trialVerdict, setTrialVerdict] = useState<'playing' | 'escaped' | 'defeated'>('playing');

  // Trigger setup
  const launchBeastCombat = () => {
    if (selectedBoss.id === 'void_weaver') {
      alert("⚠️ This boss is a future seasonal Temporal threat! Challenge the active Wildling, Elite, or World sovereigns.");
      return;
    }
    if (beastKeys <= 0) {
      alert("❌ Out of Trial Beacons! Wait for seasonal reset or buy beacons in the Arena Shop.");
      return;
    }

    // Spend Key
    const nextKeys = beastKeys - 1;
    setBeastKeys(nextKeys);
    commitBeastChanges({ keys: nextKeys });

    // Build standard tiered elements board
    const tiles: BeastTrialTile[] = [];
    const elements = ['solar_fire', 'glacial_frost', 'emerald_nature', 'astral_light', 'obsidian_core', 'elixir_pure'];
    
    let idCounter = 0;
    const layers = 3;
    const rows = 4;
    const cols = 5;

    // Boss Phase HP calibration based on selected difficulty
    let diffFactor = 1.0;
    if (selectedDifficulty === 'Easy') diffFactor = 0.6;
    if (selectedDifficulty === 'Heroic') diffFactor = 2.2;
    if (selectedDifficulty === 'Mythic') diffFactor = 5.0;

    const scaledMaxHp = Math.round(selectedBoss.baseHp * diffFactor);

    // Populate layered cards with custom MODIFIERS!
    for (let z = 0; z < layers; z++) {
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          if (z === 1 && (x === 0 || x === cols - 1)) continue;
          if (z === 2 && (y === 0 || y === rows - 1)) continue;

          const randomType = elements[(x + y + z) % elements.length];
          
          // Inject custom modifier state randomly based on boss attributes
          let modifier: any = 'none';
          if (Math.random() < 0.25) {
            modifier = selectedBoss.activeModifier.type;
          }

          tiles.push({
            id: `bt_tile_${z}_${y}_${x}_${idCounter++}`,
            typeId: randomType,
            x: x + z * 0.15,
            y: y + z * 0.15,
            z,
            isBlocked: false,
            modifierState: modifier
          });
        }
      }
    }

    updateBeastBlockingState(tiles);

    setBoard(tiles);
    setTray([]);
    
    // Core game state setup
    setBossHp(scaledMaxHp);
    setBossMaxHp(scaledMaxHp);
    setBossPhaseIdx(0);
    setBossShield(0);
    setBossTimer(3);
    setEnrageLevel(0);
    setTotalDamageDealt(0);

    setPlayerHp([1600, 1300, 2200]);
    setPlayerShield([0, 0, 0]);
    setPlayerEnergy([0, 0, 0]);

    setTrialVerdict('playing');
    setCombatLogs([`⚔️ BEAST ENCOUNTER: Challenging ${selectedBoss.name} (${selectedDifficulty})!`]);

    setScreen('combat');
    playBeastSound("boss_battle_start");
  };

  const updateBeastBlockingState = (tiles: BeastTrialTile[]) => {
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

  // Player interacts with a tile
  const selectBeastTile = (tile: BeastTrialTile) => {
    if (tile.isBlocked || tray.length >= 7 || trialVerdict !== 'playing') {
      playBeastSound("tile_locked");
      return;
    }

    // Process modifiers if clicked
    let applyPenalty = false;
    let penaltyMessage = "";

    if (tile.modifierState === 'decayed') {
      // Rot spouts deal party 150 damage directly!
      applyPenalty = true;
      penaltyMessage = `⚠️ DECAY INFESTATION: Rotary decay spore burst! Clicked tile dealt 120 rot damage to party.`;
      const updatedHp = playerHp.map((h, i) => Math.max(10, h - 120));
      setPlayerHp(updatedHp);
      playBeastSound("decay_spore_detonation");
    } else if (tile.modifierState === 'frozen') {
      // Frozen seal takes 2 clicks to break!
      // Convert to chained or none
      playBeastSound("ice_crack");
      const updatedBoard = board.map(t => {
        if (t.id === tile.id) {
          return { ...t, modifierState: 'chained' as any };
        }
        return t;
      });
      setBoard(updatedBoard);
      addLog("❄️ FROZEN SEAL: Rupture adjacent runes or tap again to melt permafrost.", "info");
      return;
    } else if (tile.modifierState === 'chained') {
      // Requires unlocking with other elements
      playBeastSound("chain_clank");
      addLog("⛓️ RUNE CHAINS: Match adjacent identical runes to shatter iron restraint locks.", "info");
      // Reduce health slightly
    }

    // Filter board
    const newBoard = board.filter(t => t.id !== tile.id);
    updateBeastBlockingState(newBoard);
    setBoard(newBoard);

    const newTray = [...tray, tile];

    if (applyPenalty) {
      setCombatLogs(prev => [penaltyMessage, ...prev]);
    }

    // Look for triplet match-3
    const grouped = newTray.reduce((acc: {[key: string]: BeastTrialTile[]}, item) => {
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
      playBeastSound("triple_match");
      const filteredTray = newTray.filter(t => t.typeId !== matchedType);
      setTray(filteredTray);

      executeBeastMatchDamage(matchedType);
    } else {
      setTray(newTray);
      tickBossCountdownTimer();
    }
  };

  // Convert Elemental Match to damage pools
  const executeBeastMatchDamage = (typeId: string) => {
    let damage = 0;
    let logMsg = "";
    
    // Scale damage if elements match boss weakness (+100% damage!)
    const isWeakness = selectedBoss.elementalWeakness === typeId;
    const multiplier = isWeakness ? 2.2 : 1.0;

    const updatedPlayerHp = [...playerHp];
    const updatedPlayerShield = [...playerShield];
    const updatedPlayerEnergy = [...playerEnergy];

    if (typeId === 'solar_fire') {
      damage = Math.round(520 * multiplier);
      logMsg = `🔥 SOLAR RESIDUE: Valen releases Flare Burst dealing ${damage} ${isWeakness ? 'CRITICAL WEAKNESS' : ''} damage.`;
      updatedPlayerEnergy[0] = Math.min(100, updatedPlayerEnergy[0] + 35);
    } else if (typeId === 'glacial_frost') {
      damage = Math.round(380 * multiplier);
      logMsg = `❄️ GLACIAL CHILL: Lyra lands frost arrow dealing ${damage} damage. Delays boss counterstrike!`;
      setBossTimer(prev => prev + 1);
      updatedPlayerEnergy[1] = Math.min(100, updatedPlayerEnergy[1] + 35);
    } else if (typeId === 'emerald_nature') {
      damage = Math.round(280 * multiplier);
      // Restore +250 HP
      const lowestHpIdx = playerHp.indexOf(Math.min(...playerHp));
      updatedPlayerHp[lowestHpIdx] = Math.min(playerMaxHp[lowestHpIdx], updatedPlayerHp[lowestHpIdx] + 250);
      logMsg = `🌿 WILD REGROWTH: Restored lowest party member health by +250. Dealt ${damage} strike damage.`;
      updatedPlayerEnergy[2] = Math.min(100, updatedPlayerEnergy[2] + 45);
    } else if (typeId === 'obsidian_core') {
      damage = Math.round(350 * multiplier);
      updatedPlayerShield[2] = updatedPlayerShield[2] + 300; // Altar Shield
      logMsg = `🛡️ OBSIDIAN BARRICADE: Gathered +300 protection shield. Dealt ${damage} core damage.`;
    } else if (typeId === 'astral_light') {
      damage = Math.round(480 * multiplier);
      logMsg = `⭐ ASTRAL STRIKE: Star blast fractures boss skin dealing ${damage} damage.`;
    } else {
      // Potion match
      damage = 150;
      for (let i = 0; i < updatedPlayerHp.length; i++) {
        if (updatedPlayerHp[i] > 0) {
          updatedPlayerHp[i] = Math.min(playerMaxHp[i], updatedPlayerHp[i] + 180);
          updatedPlayerEnergy[i] = Math.min(100, updatedPlayerEnergy[i] + 15);
        }
      }
      logMsg = `🧪 ALCHEMY ELIXIR: Restored party vigor pools by +180 health and +15 Ultimate Charge.`;
    }

    // Check boss shield first
    let finalDmg = damage;
    let updatedBossHp = bossHp;
    if (bossShield > 0) {
      if (bossShield >= finalDmg) {
        setBossShield(prev => prev - finalDmg);
        finalDmg = 0;
      } else {
        finalDmg -= bossShield;
        setBossShield(0);
      }
    }

    updatedBossHp = Math.max(0, updatedBossHp - finalDmg);
    
    setBossHp(updatedBossHp);
    setTotalDamageDealt(prev => prev + damage);
    setPlayerHp(updatedPlayerHp);
    setPlayerShield(updatedPlayerShield);
    setPlayerEnergy(updatedPlayerEnergy);

    setCombatLogs(prev => [logMsg, ...prev]);

    // Check Phase Shift triggers
    evaluateBossPhaseShifts(updatedBossHp);

    if (updatedBossHp <= 0) {
      resolveBeastVerdict(true);
    } else {
      tickBossCountdownTimer();
    }
  };

  // Evaluate Boss Health percentage to trigger Phase Transitions dynamically
  const evaluateBossPhaseShifts = (hpValue: number) => {
    const currentPercent = (hpValue / bossMaxHp) * 100;
    
    // We have phases in the boss database
    for (let i = 0; i < selectedBoss.phases.length; i++) {
      const phase = selectedBoss.phases[i];
      if (currentPercent <= phase.hpThreshold && bossPhaseIdx <= i) {
        setBossPhaseIdx(i + 1);
        
        // Trigger visual/text impact
        const phaseLog = `🚨 BOSS PHASE SHIFT: ${selectedBoss.name} reaches ${phase.hpThreshold}% HP and enters [${phase.name}]! Enacts "${phase.abilityName}".`;
        setCombatLogs(prev => [phaseLog, ...prev]);
        playBeastSound("boss_phase_transition");
        
        // Apply phase modifier effect to board
        if (phase.modifierEffect !== 'none') {
          const updatedBoard = board.map((t, idx) => {
            if (idx % 3 === 0) {
              return { ...t, modifierState: phase.modifierEffect };
            }
            return t;
          });
          setBoard(updatedBoard as any);
          addLog(`💥 BOARD MODIFIER EXPANSION: Boss scatters ${phase.modifierEffect} seals across active layers!`, "warning");
        }
        
        // Grant Boss temporary Shield buffer during phase shifts
        setBossShield(prev => prev + Math.round(bossMaxHp * 0.15));
      }
    }
  };

  // Ticks boss combat timer
  const tickBossCountdownTimer = () => {
    setBossTimer(prev => {
      const next = prev - 1;
      if (next <= 0) {
        executeBossTurnStrike();
        return 3; // Reset timer
      }
      return next;
    });
  };

  const executeBossTurnStrike = () => {
    // Each elapsed boss turn scales damage up by 15% (Enrage Mechanics)
    const enrageFactor = 1.0 + enrageLevel * 0.15;
    
    // Check difficulty modifier
    let diffDmgFactor = 1.0;
    if (selectedDifficulty === 'Easy') diffDmgFactor = 0.5;
    if (selectedDifficulty === 'Heroic') diffDmgFactor = 1.8;
    if (selectedDifficulty === 'Mythic') diffDmgFactor = 3.5;

    const finalBossAttack = Math.round(selectedBoss.baseAttack * enrageFactor * diffDmgFactor);

    // Determine target hero
    const living = playerHp.map((h, i) => (h > 0 ? i : -1)).filter(i => i !== -1);
    if (living.length === 0) return;
    const targetIdx = living[Math.floor(Math.random() * living.length)];

    const updatedPlayerHp = [...playerHp];
    const updatedPlayerShield = [...playerShield];

    let dmgApplied = finalBossAttack;
    const shieldValue = updatedPlayerShield[2];
    if (shieldValue > 0) {
      if (shieldValue >= dmgApplied) {
        updatedPlayerShield[2] = shieldValue - dmgApplied;
        dmgApplied = 0;
      } else {
        dmgApplied -= shieldValue;
        updatedPlayerShield[2] = 0;
      }
    }

    updatedPlayerHp[targetIdx] = Math.max(0, updatedPlayerHp[targetIdx] - dmgApplied);

    setPlayerHp(updatedPlayerHp);
    setPlayerShield(updatedPlayerShield);
    setEnrageLevel(prev => prev + 1);

    const attackLog = `⚠️ BOSS STRIKE: ${selectedBoss.name} sweeps with fierce rage! Deals ${finalBossAttack} damage to ${targetIdx === 0 ? 'Valen' : targetIdx === 1 ? 'Lyra' : 'Aethelgard'} (Enrage level: ${enrageLevel + 1}).`;
    setCombatLogs(prev => [attackLog, ...prev]);
    playBeastSound("boss_damage_burst");

    // Evaluate lose condition
    const partyDefeated = updatedPlayerHp.every(h => h <= 0);
    if (partyDefeated) {
      resolveBeastVerdict(false);
    }
  };

  // Trigger manually charged character ultimate skill
  const launchBeastUltimate = (heroIdx: number) => {
    if (playerEnergy[heroIdx] < 100 || trialVerdict !== 'playing') return;

    const updatedPlayerEnergy = [...playerEnergy];
    updatedPlayerEnergy[heroIdx] = 0;
    setPlayerEnergy(updatedPlayerEnergy);

    let damage = 0;
    let logMsg = "";
    const updatedPlayerHp = [...playerHp];

    if (heroIdx === 0) {
      damage = 1800;
      logMsg = `🔥 SOLAR ULTIMATE: Valen unleashes "Solar Flare Eclipse"! Deals ${damage} armor-shredding damage directly to ${selectedBoss.name}.`;
    } else if (heroIdx === 1) {
      damage = 1200;
      setBossTimer(prev => prev + 2); // Heavy Chrono Stasis
      logMsg = `❄️ FROST ULTIMATE: Lyra fires "Temporal Frost Freeze"! Deals ${damage} damage and freezes boss move counter by +2.`;
    } else {
      // Heal party
      for (let i = 0; i < updatedPlayerHp.length; i++) {
        if (updatedPlayerHp[i] > 0) {
          updatedPlayerHp[i] = Math.min(playerMaxHp[i], updatedPlayerHp[i] + 700);
        }
      }
      logMsg = `🛡️ STONE ULTIMATE: Aethelgard casts "Divine Altar Siphoner Sanctuary"! Restores +700 HP to all active allies.`;
    }

    let updatedBossHp = bossHp;
    if (damage > 0) {
      let finalDmg = damage;
      if (bossShield > 0) {
        if (bossShield >= finalDmg) {
          setBossShield(prev => prev - finalDmg);
          finalDmg = 0;
        } else {
          finalDmg -= bossShield;
          setBossShield(0);
        }
      }
      updatedBossHp = Math.max(0, updatedBossHp - finalDmg);
    }

    setBossHp(updatedBossHp);
    setTotalDamageDealt(prev => prev + damage);
    setPlayerHp(updatedPlayerHp);

    setCombatLogs(prev => [logMsg, ...prev]);
    playBeastSound("ultimate_activation");

    evaluateBossPhaseShifts(updatedBossHp);

    if (updatedBossHp <= 0) {
      resolveBeastVerdict(true);
    }
  };

  // Force Exit / Flee
  const fleeTrial = () => {
    if (confirm("Flee from the Beast Trial? You will escape with your active Damage metrics, but fail to conquer the boss crown.")) {
      resolveBeastVerdict(false);
    }
  };

  // Combat Outcome Verdict Calculation
  const resolveBeastVerdict = (victory: boolean) => {
    setTrialVerdict(victory ? 'defeated' : 'escaped');
    playBeastSound(victory ? "victory_orchestra" : "defeat_orchestra");

    // Update records
    const previousRecord = bestDamageRecord[selectedBoss.id] || 0;
    const finalScore = victory ? bossMaxHp : totalDamageDealt;

    let rewardCoins = 50;
    if (victory) {
      rewardCoins = selectedDifficulty === 'Easy' ? 120 : selectedDifficulty === 'Normal' ? 250 : selectedDifficulty === 'Heroic' ? 500 : 1000;
      addLog(`🏆 BEAST TRIUMPH: Successfully conquered ${selectedBoss.name}! Received ${rewardCoins} Altar Coins.`, 'success');
    } else {
      rewardCoins = Math.round(finalScore * 0.01);
      addLog(`⚠️ TRIAL CONCLUDED: Party escaped with ${finalScore} Damage metric against ${selectedBoss.name}.`, 'warning');
    }

    const updatedRecords = {
      ...bestDamageRecord,
      [selectedBoss.id]: Math.max(previousRecord, finalScore)
    };

    setBestDamageRecord(updatedRecords);

    commitBeastChanges({
      bestRecord: updatedRecords,
      keys: beastKeys
    });

    setScreen('summary');
  };

  // Claim milestones rewards
  const claimBeastMilestone = (idx: number) => {
    const milestone = milestones[idx];
    const personalBestMax = Math.max(...Object.values(bestDamageRecord) as number[]);

    if (personalBestMax < milestone.damageGoal || milestone.claimed) return;

    const updatedMilestones = [...milestones];
    updatedMilestones[idx].claimed = true;
    setMilestones(updatedMilestones);

    // Reward materials simulation
    addLog(`🎁 CLAIMED REWARD: ${milestone.rewardName} unlocked! Contains premium crafting components.`, 'success');
    playBeastSound("milestone_reward_claim");

    commitBeastChanges({
      milestones: updatedMilestones
    });
  };

  // Filtered list of bosses
  const filteredBosses = BEAST_BOSSES_DATABASE.filter(boss => {
    if (selectedCategory === 'All') return true;
    return boss.type === selectedCategory;
  });

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#040409] text-zinc-100 p-1 md:p-3 relative font-sans select-none">
      
      {/* HEADER SECTION METRICS */}
      <div className="bg-zinc-950/80 border border-emerald-950/40 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-950/40 border border-emerald-500/30 rounded-xl flex items-center justify-center shadow-lg">
            <Skull className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
          <div className="text-left">
            <span className="text-[8.5px] font-mono uppercase tracking-wider text-emerald-400 font-extrabold block">Altar Sovereigns Hunt Road</span>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-serif font-black uppercase text-zinc-100 tracking-wider">Beast Trials Arena</h3>
              <span className="text-[8.5px] font-mono px-1.5 py-0.5 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded font-black">BOSS TRIALS</span>
            </div>
          </div>
        </div>

        {/* BEAST TRIALS CURRENCY KEYS */}
        <div className="flex items-center gap-6 font-mono text-xs">
          <div className="text-left">
            <span className="text-[7.5px] text-zinc-550 block uppercase font-bold">PEAK DAMAGE RECORD</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Award className="w-4 h-4 text-emerald-500" />
              <span className="font-black text-white text-sm">
                {Math.max(...Object.values(bestDamageRecord) as number[]).toLocaleString()} DMG
              </span>
            </div>
          </div>

          <div className="text-left">
            <span className="text-[7.5px] text-zinc-550 block uppercase font-bold">TRIAL BEACONS</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Compass className="w-4 h-4 text-emerald-400" />
              <span className="font-black text-emerald-300 text-sm">{beastKeys} / 5 Beacons</span>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* ==========================================
            SCREEN 1: THE BEAST TRIALS LOBBY
            ========================================== */}
        {screen === 'lobby' && (
          <motion.div
            key="lobby"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0 overflow-y-auto"
          >
            {/* LEFT COLUMN: CATEGORIES & BOSS CATALOGUE (5/12) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              
              {/* FILTER HORIZONTAL BAR */}
              <div className="flex items-center justify-between gap-1 bg-zinc-950/80 border border-zinc-900 rounded-xl p-1">
                {(['All', 'Wildling', 'Elite', 'World', 'Alliance'] as const).map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); playBeastSound("category_select"); }}
                    className={`flex-1 py-1.5 px-1 rounded-lg font-mono text-[9px] font-bold uppercase transition-all cursor-pointer ${
                      selectedCategory === cat 
                        ? 'bg-emerald-950/50 border border-emerald-500/40 text-emerald-400' 
                        : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/30'
                    }`}
                  >
                    {cat}s
                  </button>
                ))}
              </div>

              {/* SCROLLABLE BOSS CATALOG */}
              <div className="flex-1 flex flex-col gap-3 min-h-[300px] overflow-y-auto pr-1">
                {filteredBosses.map(boss => {
                  const isSelected = selectedBoss.id === boss.id;
                  const isFuture = boss.id === 'void_weaver';
                  
                  return (
                    <button
                      key={boss.id}
                      onClick={() => { setSelectedBoss(boss); playBeastSound("boss_card_click"); }}
                      className={`p-3 rounded-xl border text-left transition-all relative flex gap-3 cursor-pointer ${
                        isSelected 
                          ? 'border-emerald-500 bg-emerald-950/10 ring-1 ring-emerald-500/20' 
                          : 'border-zinc-900 bg-zinc-950/50 hover:bg-zinc-900/20'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-2xl shadow-md">
                        {boss.avatarEmoji}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[8px] font-mono font-bold uppercase text-emerald-400 bg-emerald-950/50 px-1 rounded">
                            {boss.type} Boss
                          </span>
                          {isFuture && (
                            <span className="text-[7.5px] font-mono font-bold uppercase text-rose-400 bg-rose-950/50 px-1 rounded flex items-center gap-0.5">
                              <Lock className="w-2 h-2" /> Future
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-serif font-extrabold uppercase tracking-wide text-zinc-100 mt-1 truncate">
                          {boss.name}
                        </h4>
                        <p className="text-[9px] text-zinc-400 truncate mt-0.5">
                          {boss.title}
                        </p>
                      </div>

                      <ChevronRight className={`w-4 h-4 self-center text-zinc-500 transition-all ${isSelected ? 'translate-x-1 text-emerald-400' : ''}`} />
                    </button>
                  );
                })}
              </div>

            </div>

            {/* RIGHT COLUMN: BOSS DETAIL VIEW, RATINGS, LEADERS (7/12) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              
              {/* ACTIVE BOSS SHEET DETAIL */}
              <div className="bg-gradient-to-r from-zinc-950 to-zinc-900/30 border border-emerald-950/30 rounded-2xl p-5 text-left relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />
                
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[8.5px] font-mono uppercase tracking-wider text-emerald-400 font-extrabold block">Selected Hunt Target</span>
                    <h2 className="text-lg font-serif font-black uppercase text-zinc-100 tracking-wide mt-1">
                      {selectedBoss.name}
                    </h2>
                    <p className="text-[10px] font-mono text-zinc-400 italic">
                      "{selectedBoss.title}"
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-3xl shadow-xl">
                    {selectedBoss.avatarEmoji}
                  </div>
                </div>

                <p className="text-[10.5px] text-zinc-400 leading-relaxed mt-3 bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-900">
                  {selectedBoss.description}
                </p>

                {/* ELEMENT DETAILS */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
                  <div className="bg-zinc-950 border border-zinc-900 p-2 rounded-xl">
                    <span className="text-[7.5px] text-zinc-550 uppercase font-bold block">Base Hp Pool</span>
                    <span className="text-xs font-mono font-black text-zinc-200 mt-1 block">
                      {selectedBoss.baseHp.toLocaleString()} HP
                    </span>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-900 p-2 rounded-xl">
                    <span className="text-[7.5px] text-zinc-550 uppercase font-bold block">Weakness Aspect</span>
                    <span className="text-xs font-mono font-black text-rose-400 mt-1 flex items-center gap-1">
                      {ELEMENT_DB.find(e => e.id === selectedBoss.elementalWeakness)?.emoji || '⚡'}
                      <span className="uppercase text-[9.5px]">
                        {ELEMENT_DB.find(e => e.id === selectedBoss.elementalWeakness)?.label || 'None'}
                      </span>
                    </span>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-900 p-2 rounded-xl">
                    <span className="text-[7.5px] text-zinc-550 uppercase font-bold block">Active Modifier</span>
                    <span className="text-xs font-mono font-black text-amber-400 mt-1 block truncate" title={selectedBoss.activeModifier.desc}>
                      {selectedBoss.activeModifier.name}
                    </span>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-900 p-2 rounded-xl">
                    <span className="text-[7.5px] text-zinc-550 uppercase font-bold block">Enrage Threshold</span>
                    <span className="text-xs font-mono font-black text-red-400 mt-1 block">
                      +15% Dmg / Turn
                    </span>
                  </div>
                </div>

                {/* DIFFICULTIES SELECTOR */}
                <div className="border-t border-zinc-900 pt-4 mt-4">
                  <span className="text-[8.5px] font-mono text-zinc-500 uppercase tracking-wider block mb-2">Select Trial Danger Caliber</span>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'Easy', multi: 'x0.6 hp / x0.5 dmg', reward: 'Loot Box' },
                      { id: 'Normal', multi: 'x1.0 hp / x1.0 dmg', reward: 'Runic Catalyst' },
                      { id: 'Heroic', multi: 'x2.2 hp / x1.8 dmg', reward: 'Gilded Chest' },
                      { id: 'Mythic', multi: 'x5.0 hp / x3.5 dmg', reward: 'Legendary Shard' }
                    ].map(diff => (
                      <button
                        key={diff.id}
                        disabled={selectedBoss.id === 'void_weaver'}
                        onClick={() => { setSelectedDifficulty(diff.id as any); playBeastSound("difficulty_click"); }}
                        className={`p-2 rounded-xl border flex flex-col text-left transition-all ${
                          selectedDifficulty === diff.id 
                            ? 'bg-emerald-950/20 border-emerald-500 ring-1 ring-emerald-500/20 text-emerald-300' 
                            : 'bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-zinc-300'
                        }`}
                      >
                        <span className="text-[9.5px] font-black uppercase tracking-wide">{diff.id}</span>
                        <span className="text-[7px] text-zinc-500 font-mono mt-0.5">{diff.multi}</span>
                        <span className="text-[7.5px] text-amber-500 mt-1 block font-mono font-bold truncate">{diff.reward}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* LAUNCH BUTTON */}
                <button
                  onClick={launchBeastCombat}
                  disabled={selectedBoss.id === 'void_weaver'}
                  className="w-full mt-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 disabled:opacity-50 text-white font-mono text-xs font-black uppercase tracking-wider rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10 active:scale-95"
                >
                  <Sword className="w-4 h-4 animate-bounce" />
                  <span>Expend Beacon & Engage Altar Sovereign</span>
                </button>
              </div>

              {/* SECTIONS B: LOCAL BOSS HUND LEADERBOARD & PROGRESS ROAD */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* RANKINGS SHEET */}
                <div className="bg-zinc-950/80 border border-zinc-900 rounded-xl p-4 text-left">
                  <div className="flex items-center gap-2 mb-3 border-b border-zinc-900 pb-2">
                    <Award className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-serif font-black uppercase text-zinc-200 tracking-wider">Top Altar Cleansers</span>
                  </div>

                  <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
                    {activeLeaderboard.map((entry, idx) => (
                      <div 
                        key={idx} 
                        className={`p-2 rounded-lg border flex items-center justify-between text-xs font-mono ${
                          entry.isPlayer 
                            ? 'bg-emerald-950/20 border-emerald-500/30' 
                            : 'bg-zinc-950 border-zinc-900'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-emerald-400 w-4">#{entry.rank}</span>
                          <div className="text-left">
                            <span className="text-[10px] font-bold text-zinc-100 block">{entry.name}</span>
                            <span className="text-[7.5px] text-zinc-500">{entry.guild}</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[10.5px] text-zinc-200 font-extrabold block">{entry.damage.toLocaleString()} DMG</span>
                          <span className="text-[8px] text-emerald-400/80 font-bold uppercase">{entry.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* PROGRESS CHESTS ROAD */}
                <div className="bg-zinc-950/80 border border-zinc-900 rounded-xl p-4 text-left flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3 border-b border-zinc-900 pb-2">
                      <Gift className="w-4 h-4 text-amber-400" />
                      <span className="text-[10px] font-serif font-black uppercase text-zinc-200 tracking-wider">Beast Milestones Road</span>
                    </div>

                    <p className="text-[9.5px] text-zinc-400 mb-3">
                      Deal maximum damage across any single challenge session to unlock permanent progression materials.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-1">
                    {milestones.map((mil, idx) => {
                      const maxRecord = Math.max(...Object.values(bestDamageRecord) as number[]);
                      const isUnlocked = maxRecord >= mil.damageGoal;
                      
                      return (
                        <div 
                          key={idx} 
                          className="p-1.5 rounded-lg border border-zinc-900 bg-zinc-950 flex items-center justify-between text-[10px] font-mono"
                        >
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm">{mil.rewardIcon}</span>
                            <div className="text-left">
                              <span className="text-[9px] font-black text-zinc-100 block">{mil.rewardName}</span>
                              <span className="text-[7.5px] text-zinc-500 block">Goal: {mil.damageGoal.toLocaleString()} DMG</span>
                            </div>
                          </div>

                          <button
                            disabled={!isUnlocked || mil.claimed}
                            onClick={() => claimBeastMilestone(idx)}
                            className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-wider cursor-pointer ${
                              mil.claimed 
                                ? 'bg-zinc-900 border border-zinc-800 text-zinc-650' 
                                : isUnlocked 
                                  ? 'bg-amber-600 hover:bg-amber-500 text-white font-black' 
                                  : 'bg-zinc-950 border border-zinc-900 text-zinc-500 cursor-not-allowed'
                            }`}
                          >
                            {mil.claimed ? 'Claimed' : 'Unlock'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          </motion.div>
        )}

        {/* ==========================================
            SCREEN 2: TRIAL COMBAT ARENA (MAHJONG)
            ========================================== */}
        {screen === 'combat' && (
          <motion.div
            key="combat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col md:flex-row gap-4 min-h-0 relative select-none"
          >
            {/* LEFT AREA: ELEM ALIGNED MAHJONG BOARD (7/12 desktop scale) */}
            <div className="flex-1 md:flex-[7] bg-zinc-950/80 border border-emerald-950/20 rounded-2xl p-4 flex flex-col justify-between min-h-0 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/5 blur-[90px] rounded-full pointer-events-none" />

              {/* HEADER: ENRAGE TRACKER & BOSS STATUS */}
              <div className="flex items-center justify-between gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-900">
                <div className="text-left">
                  <span className="text-[7px] text-zinc-500 font-mono uppercase block">Boss Attack Factor</span>
                  <div className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-red-500" />
                    <span className="font-mono text-[10.5px] font-bold text-red-400">
                      Enraged: +{Math.round(enrageLevel * 15)}% Dmg
                    </span>
                  </div>
                </div>

                <div className="text-center font-serif text-[11px] font-extrabold text-zinc-300">
                  <span>Match Runes To Shatter Sovereign Shell</span>
                </div>

                <div className="text-right">
                  <span className="text-[7px] text-zinc-500 font-mono uppercase block">Move Countdown</span>
                  <div className="flex items-center justify-end gap-1 font-mono text-[10.5px] font-bold text-amber-400">
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    <span>{bossTimer} Turns</span>
                  </div>
                </div>
              </div>

              {/* THE PUZZLE MAHJONG TILES ROW */}
              <div className="flex-1 flex items-center justify-center relative min-h-[340px] max-h-[460px] overflow-hidden my-4">
                {board.length === 0 ? (
                  <div className="text-center">
                    <Compass className="w-10 h-10 text-emerald-500 mx-auto mb-2 animate-spin" />
                    <span className="text-xs font-mono text-zinc-500">Altar board reshuffling and alignment...</span>
                  </div>
                ) : (
                  <div className="relative w-[360px] h-[340px] scale-[0.95] md:scale-100 transition-transform">
                    {board.map(tile => {
                      const db = ELEMENT_DB.find(e => e.id === tile.typeId);
                      const isLocked = tile.isBlocked;
                      
                      // Calculate layered absolute screen offsets
                      const topPx = tile.y * 70 - tile.z * 10;
                      const leftPx = tile.x * 64 + tile.z * 10;
                      
                      // Custom borders based on modifiers
                      let modBorder = "border-zinc-800";
                      let overlayGlow = "";
                      let modLabel = "";
                      
                      if (tile.modifierState === 'frozen') {
                        modBorder = "border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.4)]";
                        overlayGlow = "bg-cyan-900/60";
                        modLabel = "❄️ FROST";
                      } else if (tile.modifierState === 'decayed') {
                        modBorder = "border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]";
                        overlayGlow = "bg-emerald-950/60";
                        modLabel = "🧪 ROT";
                      } else if (tile.modifierState === 'chained') {
                        modBorder = "border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]";
                        overlayGlow = "bg-amber-950/60";
                        modLabel = "⛓️ CHAIN";
                      }

                      return (
                        <button
                          key={tile.id}
                          onClick={() => selectBeastTile(tile)}
                          style={{ top: `${topPx}px`, left: `${leftPx}px`, zIndex: tile.z * 10 }}
                          className={`absolute w-[56px] h-[64px] rounded-xl border flex flex-col items-center justify-between p-1 select-none transition-all ${
                            isLocked 
                              ? 'bg-zinc-950/90 border-zinc-900 text-zinc-700 cursor-not-allowed opacity-40' 
                              : `bg-zinc-900 hover:bg-zinc-850 cursor-pointer ${modBorder}`
                          }`}
                        >
                          <span className="text-[7.5px] font-mono text-zinc-500 font-extrabold uppercase truncate max-w-full">
                            {modLabel || db?.label || 'RUNE'}
                          </span>
                          <span className={`text-2xl my-0.5 filter drop-shadow ${isLocked ? 'grayscale' : ''}`}>
                            {db?.emoji || '💎'}
                          </span>
                          <span className="text-[6.5px] font-mono text-zinc-550 block">
                            L-{tile.z}
                          </span>

                          {/* Frozen/decayed/chains visual color mask overlay */}
                          {tile.modifierState !== 'none' && !isLocked && (
                            <div className={`absolute inset-0 rounded-xl ${overlayGlow} opacity-30 pointer-events-none`} />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* COMPRESSED TRIPLE MATCH ALTAR TRAY (MAX 7 SLOT CONTAINER) */}
              <div className="bg-zinc-950 border border-zinc-900 p-3 rounded-2xl flex flex-col gap-1 select-none">
                <span className="text-[8px] font-mono text-emerald-400 font-bold uppercase block text-left">Altar Resonance Tray (Max 7 slots)</span>
                <div className="grid grid-cols-7 gap-2 h-14 items-center">
                  {Array.from({ length: 7 }).map((_, idx) => {
                    const activeTile = tray[idx];
                    const db = activeTile ? ELEMENT_DB.find(e => e.id === activeTile.typeId) : null;
                    
                    return (
                      <div
                        key={idx}
                        className={`h-11 rounded-lg border border-zinc-900/60 flex flex-col items-center justify-center relative overflow-hidden transition-all ${
                          activeTile 
                            ? 'bg-zinc-900 border-emerald-500/30' 
                            : 'bg-zinc-950/80 border-dashed border-zinc-900'
                        }`}
                      >
                        {activeTile ? (
                          <>
                            <span className="text-[6.5px] font-mono text-zinc-500">{db?.label}</span>
                            <span className="text-xl">{db?.emoji}</span>
                          </>
                        ) : (
                          <span className="text-[9px] font-mono text-zinc-800">{idx+1}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* RIGHT AREA: BOSS HP INDEX, PHASES, PLAYER HERO SLOTS (5/12) */}
            <div className="flex-1 md:flex-[5] flex flex-col gap-4 min-h-0 select-none text-left">
              
              {/* LARGE ACTIVE BOSS HEADS-UP DISPLAY BAR */}
              <div className="bg-zinc-950/90 border border-emerald-950/20 p-4 rounded-2xl">
                <div className="flex items-center gap-3 border-b border-zinc-900 pb-3 mb-3">
                  <div className="text-3xl">{selectedBoss.avatarEmoji}</div>
                  <div>
                    <h3 className="text-xs font-serif font-black uppercase text-zinc-200 tracking-wider">
                      {selectedBoss.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5 font-mono text-[9px]">
                      <span className="px-1 py-0.5 bg-red-950 border border-red-800 text-red-400 font-bold rounded">
                        PHASE {bossPhaseIdx + 1} / {selectedBoss.phases.length + 1}
                      </span>
                      <span className="text-zinc-500">
                        {selectedBoss.phases[bossPhaseIdx]?.name || 'Berserk Siphoner'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* BOSS HP PROGRESS BAR */}
                <div className="mb-2">
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="text-zinc-500 uppercase font-bold">SOVEREIGN VITALITY</span>
                    <span className="text-red-400 font-black">{bossHp.toLocaleString()} / {bossMaxHp.toLocaleString()}</span>
                  </div>
                  <div className="h-3 bg-zinc-900 rounded-full border border-zinc-800 p-0.5 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all duration-300"
                      style={{ width: `${(bossHp / bossMaxHp) * 100}%` }}
                    />
                  </div>
                </div>

                {/* BOSS SHIELD STATUS */}
                {bossShield > 0 && (
                  <div className="bg-blue-950/40 border border-blue-500/30 p-2 rounded-xl flex items-center justify-between text-xs font-mono mb-2">
                    <div className="flex items-center gap-1 text-blue-400">
                      <Shield className="w-3.5 h-3.5" />
                      <span>Runic Protection Shield active:</span>
                    </div>
                    <span className="font-black text-blue-300">{bossShield} HP</span>
                  </div>
                )}

                {/* ACCUMULATED COMBAT SCORE */}
                <div className="bg-emerald-950/20 border border-emerald-950/30 p-2.5 rounded-xl flex items-center justify-between text-xs font-mono">
                  <span className="text-zinc-400">SESSION DAMAGE DEALT</span>
                  <span className="text-emerald-400 font-black text-sm">
                    {totalDamageDealt.toLocaleString()} DMG
                  </span>
                </div>
              </div>

              {/* THREE ACTIVE SQUAD GUARDIANS FOR COMBAT TARGET */}
              <div className="bg-zinc-950/80 border border-zinc-900 p-4 rounded-xl flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider block mb-3 border-b border-zinc-900 pb-1.5">Active Challenger Roster</span>
                  <div className="flex flex-col gap-3">
                    {[
                      { idx: 0, name: 'Valen Solar', label: 'Fighter', color: 'from-amber-600 to-rose-600', icon: '⚔️' },
                      { idx: 1, name: 'Lyra Frost', label: 'Ranger', color: 'from-cyan-600 to-blue-600', icon: '🏹' },
                      { idx: 2, name: 'Aethelgard Stone', label: 'Guardian', color: 'from-fuchsia-600 to-indigo-600', icon: '🛡️' }
                    ].map(h => {
                      const hp = playerHp[h.idx];
                      const maxHp = playerMaxHp[h.idx];
                      const pct = (hp / maxHp) * 100;
                      const energy = playerEnergy[h.idx];
                      const isDead = hp <= 0;

                      return (
                        <div 
                          key={h.idx}
                          className={`p-2 rounded-xl border flex items-center justify-between gap-3 ${
                            isDead 
                              ? 'bg-zinc-950 border-red-950/40 opacity-30' 
                              : 'bg-zinc-900/60 border-zinc-800'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{h.icon}</span>
                            <div className="text-left">
                              <span className="text-[10px] font-extrabold text-zinc-100 block">{h.name}</span>
                              <span className="text-[7.5px] font-mono text-zinc-500 uppercase block">{h.label}</span>
                            </div>
                          </div>

                          {/* HP BAR & ULTIMATE */}
                          <div className="flex-1 max-w-[120px] font-mono">
                            <div className="flex justify-between text-[7.5px] text-zinc-400 mb-0.5">
                              <span>HP: {hp}</span>
                            </div>
                            <div className="h-1.5 bg-zinc-950 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${isDead ? 'bg-red-900' : 'bg-emerald-500'}`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>

                          {/* ULTIMATE TRIGGER */}
                          <button
                            disabled={energy < 100 || isDead || trialVerdict !== 'playing'}
                            onClick={() => launchBeastUltimate(h.idx)}
                            className={`p-1.5 rounded-lg text-[8.5px] font-mono font-black uppercase tracking-wider cursor-pointer active:scale-95 transition-all ${
                              energy >= 100 && !isDead
                                ? 'bg-amber-500 animate-pulse text-white font-black hover:bg-amber-400'
                                : 'bg-zinc-950 border border-zinc-900 text-zinc-650 cursor-not-allowed'
                            }`}
                            title={energy >= 100 ? "CLICK TO RELEASE ULTIMATE SKILL" : `${energy}% energy gathered`}
                          >
                            Ult ({energy}%)
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* FLEE BUTTON */}
                <button
                  onClick={fleeTrial}
                  className="w-full mt-4 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-zinc-200 font-mono text-[10px] font-bold uppercase rounded-lg cursor-pointer transition-all"
                >
                  Flee / Escape Trial
                </button>
              </div>

              {/* SCROLLABLE LOGS CONSOLE */}
              <div className="bg-zinc-950 border border-zinc-900 p-3 rounded-xl h-28 flex flex-col justify-between text-xs font-mono">
                <span className="text-[8px] font-bold text-zinc-500 uppercase block border-b border-zinc-900 pb-1 mb-1">Combat Actions Log</span>
                <div className="flex-1 overflow-y-auto flex flex-col gap-1 text-[9.5px]">
                  {combatLogs.map((log, index) => (
                    <div key={index} className="text-zinc-400 leading-normal border-l border-zinc-800 pl-1.5">
                      {log}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}

        {/* ==========================================
            SCREEN 3: TRIAL SUMMARY RESOLUTION
            ========================================== */}
        {screen === 'summary' && (
          <motion.div
            key="summary"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-xl mx-auto bg-zinc-950 border border-zinc-900 rounded-3xl p-6 text-center select-none"
          >
            <div className="w-16 h-16 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
              {trialVerdict === 'defeated' ? '🏆' : '🏃'}
            </div>

            <h3 className="text-sm font-mono text-emerald-400 font-black uppercase tracking-wider">
              {trialVerdict === 'defeated' ? 'Sovereign Conquered' : 'Trial Concluded'}
            </h3>
            <h2 className="text-xl font-serif font-black uppercase text-zinc-100 tracking-wide mt-1">
              {selectedBoss.name} Hunt Ledger
            </h2>

            <p className="text-[10.5px] text-zinc-400 leading-relaxed max-w-md mx-auto mt-2">
              The resonance frequencies of the siphoning altar have successfully catalogued your team metrics. Materials are allocated directly to progression storage.
            </p>

            <div className="grid grid-cols-2 gap-4 my-6 font-mono text-left max-w-sm mx-auto">
              <div className="bg-zinc-900/60 border border-zinc-850 p-3 rounded-xl">
                <span className="text-[8px] text-zinc-550 block uppercase font-bold">Total Damage Dealt</span>
                <span className="text-sm font-black text-zinc-100 mt-1 block">
                  {totalDamageDealt.toLocaleString()} DMG
                </span>
              </div>

              <div className="bg-zinc-900/60 border border-zinc-850 p-3 rounded-xl">
                <span className="text-[8px] text-zinc-550 block uppercase font-bold">Survival Rating</span>
                <span className="text-sm font-black text-emerald-400 mt-1 block">
                  {totalDamageDealt >= 100000 ? 'SSS-Tier' : totalDamageDealt >= 50000 ? 'SS-Tier' : totalDamageDealt >= 25000 ? 'S-Tier' : 'A-Tier'}
                </span>
              </div>
            </div>

            {/* REWARDS SCALED COLUMN */}
            <div className="bg-zinc-900 border border-zinc-850 rounded-2xl p-4 text-left mb-6 max-w-sm mx-auto font-mono text-xs">
              <span className="text-[8.5px] text-zinc-500 uppercase tracking-wider block mb-2 font-black">Loot Acquired:</span>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center bg-zinc-950 p-2 rounded-lg">
                  <span className="text-zinc-400">Astral Shard Bundles</span>
                  <span className="text-emerald-400 font-black">
                    +{selectedDifficulty === 'Easy' ? '120' : selectedDifficulty === 'Normal' ? '250' : selectedDifficulty === 'Heroic' ? '500' : '1000'} Shards
                  </span>
                </div>

                <div className="flex justify-between items-center bg-zinc-950 p-2 rounded-lg">
                  <span className="text-zinc-400">Runic Altar Coins</span>
                  <span className="text-amber-400 font-black">
                    +{selectedDifficulty === 'Easy' ? '50' : selectedDifficulty === 'Normal' ? '100' : selectedDifficulty === 'Heroic' ? '200' : '450'} Coins
                  </span>
                </div>

                <div className="flex justify-between items-center bg-zinc-950 p-2 rounded-lg">
                  <span className="text-zinc-400">Beast Core Materials</span>
                  <span className="text-fuchsia-400 font-black">
                    +{selectedDifficulty === 'Normal' || selectedDifficulty === 'Easy' ? '1' : '3'} Core Catalyst
                  </span>
                </div>
              </div>
            </div>

            {/* BUTTON TO EXIT */}
            <button
              onClick={() => { setScreen('lobby'); playBeastSound("lobby_exit"); }}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-mono text-xs font-black uppercase tracking-widest rounded-xl cursor-pointer transition-all shadow-md active:scale-95"
            >
              Return to Hunt lobby
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
