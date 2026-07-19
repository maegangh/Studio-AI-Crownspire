import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  Trophy, 
  ShoppingBag, 
  Layers, 
  Check, 
  Lock, 
  ChevronRight, 
  User, 
  Users, 
  Sparkle, 
  Award, 
  Gift, 
  Gamepad2, 
  Flame, 
  Zap, 
  Shield, 
  Compass, 
  HelpCircle,
  Undo as UndoIcon,
  Shuffle as ShuffleIcon,
  RefreshCw,
  Crown
} from 'lucide-react';

// ==========================================
// DATA DEFINITIONS & DATABASE SEEDS
// ==========================================

export interface EventMission {
  id: string;
  category: 'daily' | 'weekly' | 'alliance' | 'kingdom';
  title: string;
  description: string;
  target: number;
  current: number;
  signetsReward: number;
  pointsReward: number;
  claimed: boolean;
}

export interface ShopItem {
  id: string;
  name: string;
  type: 'frame' | 'avatar' | 'tileskin' | 'consumable';
  price: number;
  icon: string;
  description: string;
  purchased: boolean;
  equipped?: boolean;
}

export interface MilestoneReward {
  pointsRequired: number;
  name: string;
  icon: string;
  claimed: boolean;
  itemDesc: string;
}

export interface LeaderboardRow {
  rank: number;
  name: string;
  guild: string;
  points: number;
  rating: string;
  isPlayer?: boolean;
}

export interface ConvergenceTile {
  id: string;
  typeId: string;
  x: number;
  y: number;
  z: number;
  isBlocked: boolean;
}

// 3 Exclusive Themes (+1 Default Theme)
export interface TileTheme {
  id: string;
  name: string;
  desc: string;
  elements: {
    solar_fire: { label: string; emoji: string; color: string; bg: string };
    glacial_frost: { label: string; emoji: string; color: string; bg: string };
    emerald_nature: { label: string; emoji: string; color: string; bg: string };
    astral_light: { label: string; emoji: string; color: string; bg: string };
    obsidian_core: { label: string; emoji: string; color: string; bg: string };
    elixir_pure: { label: string; emoji: string; color: string; bg: string };
  };
}

const CONVERGENCE_THEMES: {[key: string]: TileTheme} = {
  default: {
    id: 'default',
    name: 'Citadel Standard',
    desc: 'Classic elements of Crownspire',
    elements: {
      solar_fire: { label: 'VALOR', emoji: '🔥', color: 'text-rose-400', bg: 'bg-rose-950/20' },
      glacial_frost: { label: 'FROST', emoji: '❄️', color: 'text-cyan-400', bg: 'bg-cyan-950/20' },
      emerald_nature: { label: 'GROWTH', emoji: '🌿', color: 'text-emerald-400', bg: 'bg-emerald-950/20' },
      astral_light: { label: 'ASTRAL', emoji: '⭐', color: 'text-fuchsia-400', bg: 'bg-fuchsia-950/20' },
      obsidian_core: { label: 'STONE', emoji: '💎', color: 'text-amber-400', bg: 'bg-amber-950/20' },
      elixir_pure: { label: 'POTION', emoji: '🧪', color: 'text-purple-400', bg: 'bg-purple-950/20' }
    }
  },
  prismatic: {
    id: 'prismatic',
    name: 'Prismatic Crystals',
    desc: 'Crystalline structures glowing with elemental resonance',
    elements: {
      solar_fire: { label: 'RUBY', emoji: '🟥', color: 'text-red-400', bg: 'bg-red-950/30 border-red-500/40' },
      glacial_frost: { label: 'SAPPHIRE', emoji: '🟦', color: 'text-blue-400', bg: 'bg-blue-950/30 border-blue-500/40' },
      emerald_nature: { label: 'EMERALD', emoji: '🟩', color: 'text-green-400', bg: 'bg-green-950/30 border-green-500/40' },
      astral_light: { label: 'AMETHYST', emoji: '🟪', color: 'text-purple-400', bg: 'bg-purple-950/30 border-purple-500/40' },
      obsidian_core: { label: 'AMBER', emoji: '🟨', color: 'text-yellow-400', bg: 'bg-yellow-950/30 border-yellow-500/40' },
      elixir_pure: { label: 'PRISM', emoji: '🔮', color: 'text-fuchsia-300', bg: 'bg-fuchsia-950/30 border-fuchsia-500/40' }
    }
  },
  volcanic: {
    id: 'volcanic',
    name: 'Volcanic Magma',
    desc: 'Slag structures containing burning molten veins',
    elements: {
      solar_fire: { label: 'MAGMA', emoji: '🌋', color: 'text-orange-500', bg: 'bg-orange-950/40 border-orange-600/40' },
      glacial_frost: { label: 'ASH', emoji: '⚫', color: 'text-zinc-400', bg: 'bg-zinc-950/40 border-zinc-700/40' },
      emerald_nature: { label: 'SULPHUR', emoji: '🟡', color: 'text-yellow-500', bg: 'bg-yellow-950/40 border-yellow-600/40' },
      astral_light: { label: 'CINDER', emoji: '💥', color: 'text-red-500', bg: 'bg-red-950/40 border-red-600/40' },
      obsidian_core: { label: 'BRIMSTONE', emoji: '☄️', color: 'text-amber-500', bg: 'bg-amber-950/40 border-amber-600/40' },
      elixir_pure: { label: 'LAVA', emoji: '🔥', color: 'text-rose-500', bg: 'bg-rose-950/40 border-rose-600/40' }
    }
  },
  cybernetic: {
    id: 'cybernetic',
    name: 'Cybernetic Runes',
    desc: 'Holographic matrix projections and neon pathways',
    elements: {
      solar_fire: { label: 'MATRIX', emoji: '🌐', color: 'text-cyan-400', bg: 'bg-cyan-950/30 border-cyan-500/40' },
      glacial_frost: { label: 'LASER', emoji: '⚡', color: 'text-yellow-400', bg: 'bg-yellow-950/30 border-yellow-500/40' },
      emerald_nature: { label: 'NEON', emoji: '🖲️', color: 'text-green-400', bg: 'bg-green-950/30 border-green-500/40' },
      astral_light: { label: 'HOLO', emoji: '🌌', color: 'text-violet-400', bg: 'bg-violet-950/30 border-violet-500/40' },
      obsidian_core: { label: 'QUANT', emoji: '💾', color: 'text-pink-400', bg: 'bg-pink-950/30 border-pink-500/40' },
      elixir_pure: { label: 'BATTERY', emoji: '🔋', color: 'text-emerald-400', bg: 'bg-emerald-950/30 border-emerald-500/40' }
    }
  }
};

// Season Rotations supporting scalable future additions easily
export interface ConvergenceSeason {
  id: string;
  name: string;
  subtitle: string;
  colorTheme: string; // Tailwind accent border/text
  bossId: string;
  activeBoardTheme: string;
}

const SEASONS_DB: ConvergenceSeason[] = [
  {
    id: 's1_genesis',
    name: 'Season I: Altar Genesis',
    subtitle: 'The First Convergence Event of Crownspire',
    colorTheme: 'from-violet-600 to-indigo-600 border-indigo-500 text-indigo-400',
    bossId: 'fenrir_shadow',
    activeBoardTheme: 'prismatic'
  },
  {
    id: 's2_glacial',
    name: 'Season II: Glacial Rift',
    subtitle: 'Subzero elements freeze the Celestial Vault',
    colorTheme: 'from-cyan-600 to-blue-600 border-cyan-500 text-cyan-400',
    bossId: 'aurelius_gold_drake',
    activeBoardTheme: 'default'
  },
  {
    id: 's3_volcanic',
    name: 'Season III: Pyre Colossus',
    subtitle: 'Volcanic magma fractures active layers',
    colorTheme: 'from-rose-600 to-amber-600 border-rose-500 text-rose-400',
    bossId: 'pyre_lord_ignis',
    activeBoardTheme: 'volcanic'
  }
];

// Initial Missions List
const INITIAL_MISSIONS = (): EventMission[] => [
  // Puzzle objectives
  { id: 'm1_solar', category: 'daily', title: 'Solar Core Alignment', description: 'Match 40 Solar Runes in any Altar Match-3 board.', target: 40, current: 15, signetsReward: 25, pointsReward: 50, claimed: false },
  { id: 'm2_combos', category: 'daily', title: 'Combo Master', description: 'Achieve a 4x match-3 combo sequence during standard daily extreme runs.', target: 1, current: 0, signetsReward: 20, pointsReward: 40, claimed: false },
  { id: 'm3_exp', category: 'weekly', title: 'Vault Expeditions', description: 'Successfully solve 5 layered puzzle levels inside the main expedition tab.', target: 5, current: 2, signetsReward: 60, pointsReward: 120, claimed: false },
  
  // Arena objectives
  { id: 'm4_rivals', category: 'daily', title: 'Arena Conquest', description: 'Initiate and complete 3 competitive duels on the Arena Tab.', target: 3, current: 1, signetsReward: 30, pointsReward: 60, claimed: false },
  { id: 'm5_arena_win', category: 'weekly', title: 'Legendary Streak', description: 'Achieve a 3-match winning streak against Elite or Hard tier rivals.', target: 1, current: 0, signetsReward: 80, pointsReward: 150, claimed: false },

  // Beast Trial objectives
  { id: 'm6_beast_dmg', category: 'daily', title: 'Beast Colossus Rend', description: 'Inflict 20,000 Total Damage to Beast Trials Sovereigns.', target: 20000, current: 8500, signetsReward: 45, pointsReward: 90, claimed: false },
  { id: 'm7_beast_kill', category: 'weekly', title: 'Fenrir Shatterer', description: 'Successfully challenge and conquer Fenrir Shadowfang on Heroic difficulty.', target: 1, current: 0, signetsReward: 100, pointsReward: 200, claimed: false },

  // Alliance objectives
  { id: 'm8_alliance', category: 'weekly', title: 'Beacon Contribution', description: 'Contribute 5,000 Alliance match-3 points to the guild altar.', target: 5000, current: 1200, signetsReward: 50, pointsReward: 100, claimed: false },

  // Kingdom objectives
  { id: 'm9_kingdom', category: 'weekly', title: 'Royal Sovereign Tax', description: 'Earn 10,000 Altar points to deposit in the Crownspire Royal Treasury.', target: 10000, current: 3500, signetsReward: 75, pointsReward: 150, claimed: false }
];

// Initial Milestones Road
const INITIAL_MILESTONES = (): MilestoneReward[] => [
  { pointsRequired: 200, name: 'Chrono Convergence Lockbox', icon: '📦', claimed: false, itemDesc: 'Contains 300 Astral Shards & 10 Altar Signets.' },
  { pointsRequired: 500, name: 'Sovereign Catalyst Vial', icon: '🧪', claimed: false, itemDesc: 'Rare brewing compound to craft legendary focus runes.' },
  { pointsRequired: 1000, name: 'Cosmic Nebula Profile Frame', icon: '🖼️', claimed: false, itemDesc: 'Premium profile decoration equipped in your player stats.' },
  { pointsRequired: 1500, name: 'Aurelius Gold Avatar Icon', icon: '👑', claimed: false, itemDesc: 'Unlocks the legendary dragon sovereign profile avatar.' },
  { pointsRequired: 2000, name: 'Exclusive Tile Skin Package', icon: '🎨', claimed: false, itemDesc: 'Unlocks the Cybernetic Runes tile theme permanently!' }
];

// Initial Shop Items
const INITIAL_SHOP_ITEMS = (): ShopItem[] => [
  { id: 'sh_frame_nebula', name: 'Nebula Cosmos Frame', type: 'frame', price: 150, icon: '🌌', description: 'Surrounds your Guardian avatar with swirling purple galaxy clouds.', purchased: false },
  { id: 'sh_frame_chrono', name: 'Chrono Stasis Frame', type: 'frame', price: 150, icon: '⌛', description: 'Tick-tock temporal clock gears that turn slowly in margins.', purchased: false },
  
  { id: 'sh_av_ignis', name: 'Sovereign Ignis Avatar', type: 'avatar', price: 300, icon: '🌋', description: 'Unlocks Ignis the Molten Pyre-Lord portrait.', purchased: false },
  { id: 'sh_av_fenrir', name: 'Shadow Wolf Avatar', type: 'avatar', price: 300, icon: '🐺', description: 'Unlocks Fenrir Shadowfang darkness avatar.', purchased: false },
  
  { id: 'sh_skin_prismatic', name: 'Prismatic Crystals Theme', type: 'tileskin', price: 450, icon: '🔮', description: 'Transforms standard elementals into high-contrast gems.', purchased: false },
  { id: 'sh_skin_magma', name: 'Volcanic Magma Theme', type: 'tileskin', price: 450, icon: '🌋', description: 'Equips fiery ash and brimstone cores onto active matching cells.', purchased: false },
  { id: 'sh_skin_cyber', name: 'Cybernetic Neon Theme', type: 'tileskin', price: 450, icon: '🖲️', description: 'Futuristic lasers and hologram runes with bright neon glows.', purchased: false },
  
  { id: 'sh_beacon_bundle', name: 'Beast Beacon Multi-Pack', type: 'consumable', price: 80, icon: '🧭', description: 'Adds 3 Trial Beacons to challenge sovereigns.', purchased: false }
];

// Leaderboards Seed
const SOLO_LEADERBOARD_SEED: LeaderboardRow[] = [
  { rank: 1, name: "Emperor Theron", guild: "Astral Core", points: 2450, rating: "Grandmaster" },
  { rank: 2, name: "Lady Vespera", guild: "Shadow Vanguard", points: 2180, rating: "Grandmaster" },
  { rank: 3, name: "Archmage Kaelthas", guild: "Solar Radiance", points: 1950, rating: "Champion" },
  { rank: 4, name: "Oracle Jaina", guild: "Chrono Keepers", points: 1820, rating: "Champion" },
  { rank: 5, name: "Grandmaster Garrick", guild: "Iron Altar", points: 1680, rating: "Elite" }
];

const ALLIANCE_LEADERBOARD_SEED: LeaderboardRow[] = [
  { rank: 1, name: "Astral Core", guild: "Kingdom Sovereign", points: 12450, rating: "Giga-Sovereign" },
  { rank: 2, name: "Shadow Vanguard", guild: "Twilight Altar", points: 11200, rating: "Sovereign" },
  { rank: 3, name: "Solar Radiance", guild: "Golden Beacon", points: 9400, rating: "Sovereign" },
  { rank: 4, name: "Chrono Keepers", guild: "Temporal Citadel", points: 8100, rating: "Master" },
  { rank: 5, name: "Iron Altar", guild: "Runic Legion", points: 7200, rating: "Master" }
];

// ==========================================
// MAIN COMPONENT EXPORT
// ==========================================

interface CrystalVaultConvergenceTabProps {
  resources: any;
  addLog: (msg: string, type: 'info' | 'success' | 'warning' | 'combat') => void;
}

export default function CrystalVaultConvergenceTab({ resources, addLog }: CrystalVaultConvergenceTabProps) {
  // Navigation: 'lobby' | 'missions' | 'shop' | 'altar' | 'rankings'
  const [activeSubTab, setActiveSubTab] = useState<'lobby' | 'missions' | 'shop' | 'altar' | 'rankings'>('lobby');
  
  // Seasonal support
  const [activeSeason, setActiveSeason] = useState<ConvergenceSeason>(SEASONS_DB[0]);

  // Event Stats persistence
  const [signets, setSignets] = useState<number>(120);
  const [convergencePoints, setConvergencePoints] = useState<number>(350);
  const [missions, setMissions] = useState<EventMission[]>([]);
  const [milestones, setMilestones] = useState<MilestoneReward[]>([]);
  const [shopItems, setShopItems] = useState<ShopItem[]>([]);
  const [equippedTheme, setEquippedTheme] = useState<string>('default');

  // Interactive Leaderboards
  const [soloLeaderboard, setSoloLeaderboard] = useState<LeaderboardRow[]>(SOLO_LEADERBOARD_SEED);
  const [allianceLeaderboard, setAllianceLeaderboard] = useState<LeaderboardRow[]>(ALLIANCE_LEADERBOARD_SEED);
  const [rankingsTab, setRankingsTab] = useState<'solo' | 'alliance'>('solo');

  // Special Board state variables
  const [altarBoard, setAltarBoard] = useState<ConvergenceTile[]>([]);
  const [altarTray, setAltarTray] = useState<ConvergenceTile[]>([]);
  const [altarScore, setAltarScore] = useState<number>(0);
  const [altarCombo, setAltarCombo] = useState<number>(0);
  const [boardSolved, setBoardSolved] = useState<boolean>(false);

  // Sound Cue simulation
  const triggerAudioEffect = (cue: string) => {
    addLog(`🔊 Convergence Sound: "${cue}"`, 'info');
  };

  // On mount: read or build state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('crownspire_convergence_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSignets(parsed.signets ?? 120);
        setConvergencePoints(parsed.convergencePoints ?? 350);
        setMissions(parsed.missions ?? INITIAL_MISSIONS());
        setMilestones(parsed.milestones ?? INITIAL_MILESTONES());
        setShopItems(parsed.shopItems ?? INITIAL_SHOP_ITEMS());
        setEquippedTheme(parsed.equippedTheme ?? 'default');
      } catch (e) {
        // Fallback
        initDefaultStates();
      }
    } else {
      initDefaultStates();
    }
  }, []);

  const initDefaultStates = () => {
    setMissions(INITIAL_MISSIONS());
    setMilestones(INITIAL_MILESTONES());
    setShopItems(INITIAL_SHOP_ITEMS());
    setEquippedTheme('default');
  };

  const commitChanges = (updates: any) => {
    const payload = {
      signets: updates.signets ?? signets,
      convergencePoints: updates.convergencePoints ?? convergencePoints,
      missions: updates.missions ?? missions,
      milestones: updates.milestones ?? milestones,
      shopItems: updates.shopItems ?? shopItems,
      equippedTheme: updates.equippedTheme ?? equippedTheme
    };
    localStorage.setItem('crownspire_convergence_v1', JSON.stringify(payload));
  };

  // Inject or update player in Leaderboard depending on current points
  useEffect(() => {
    let baseSolo = [...SOLO_LEADERBOARD_SEED];
    const playerEntry: LeaderboardRow = {
      rank: 99,
      name: "Your Guardian (You)",
      guild: "Gilded Sentinel",
      points: convergencePoints,
      rating: convergencePoints >= 1800 ? "Grandmaster" : convergencePoints >= 1200 ? "Champion" : "Elite",
      isPlayer: true
    };
    baseSolo.push(playerEntry);
    baseSolo.sort((a, b) => b.points - a.points);
    baseSolo = baseSolo.map((row, idx) => ({ ...row, rank: idx + 1 }));
    setSoloLeaderboard(baseSolo);

    let baseAlliance = [...ALLIANCE_LEADERBOARD_SEED];
    const allianceTotal = 4200 + convergencePoints * 3.5; // Simulate guild cooperation points
    const guildEntry: LeaderboardRow = {
      rank: 99,
      name: "Gilded Sentinel [ALLIANCE]",
      guild: "Your Core",
      points: Math.round(allianceTotal),
      rating: allianceTotal >= 10000 ? "Giga-Sovereign" : "Sovereign",
      isPlayer: true
    };
    baseAlliance.push(guildEntry);
    baseAlliance.sort((a, b) => b.points - a.points);
    baseAlliance = baseAlliance.map((row, idx) => ({ ...row, rank: idx + 1 }));
    setAllianceLeaderboard(baseAlliance);
  }, [convergencePoints]);

  // Dynamic Rotate Season
  const rotateSeason = (season: ConvergenceSeason) => {
    setActiveSeason(season);
    // Rotate equipped board theme matching season settings to offer premium presets
    setEquippedTheme(season.activeBoardTheme);
    triggerAudioEffect("season_shift_warp");
    addLog(`🌀 SEASON SHIFT: Moved to ${season.name}! The Vault has re-aligned tile parameters.`, 'info');
  };

  // Complete & Claim Missions
  const claimMissionReward = (missionId: string) => {
    const idx = missions.findIndex(m => m.id === missionId);
    if (idx === -1 || missions[idx].claimed || missions[idx].current < missions[idx].target) return;

    const updatedMissions = [...missions];
    updatedMissions[idx].claimed = true;
    setMissions(updatedMissions);

    const newSignets = signets + updatedMissions[idx].signetsReward;
    const newPoints = convergencePoints + updatedMissions[idx].pointsReward;

    setSignets(newSignets);
    setConvergencePoints(newPoints);

    addLog(`🌟 MISSION COMPLETED: "${updatedMissions[idx].title}" claimed! Received +${updatedMissions[idx].signetsReward} Signets and +${updatedMissions[idx].pointsReward} Convergence Points.`, 'success');
    triggerAudioEffect("mission_claim_sound");

    commitChanges({
      missions: updatedMissions,
      signets: newSignets,
      convergencePoints: newPoints
    });
  };

  // Simulate doing activities to ease testing procedures
  const simulateActivity = (type: 'puzzle' | 'arena' | 'beast' | 'alliance') => {
    const updatedMissions = [...missions];
    let count = 0;
    
    updatedMissions.forEach(m => {
      if (!m.claimed) {
        if (type === 'puzzle' && (m.id === 'm1_solar' || m.id === 'm2_combos' || m.id === 'm3_exp' || m.id === 'm9_kingdom')) {
          if (m.id === 'm1_solar') m.current = Math.min(m.target, m.current + 10);
          if (m.id === 'm2_combos') m.current = Math.min(m.target, m.current + 1);
          if (m.id === 'm3_exp') m.current = Math.min(m.target, m.current + 1);
          if (m.id === 'm9_kingdom') m.current = Math.min(m.target, m.current + 1500);
          count++;
        }
        if (type === 'arena' && (m.id === 'm4_rivals' || m.id === 'm5_arena_win')) {
          m.current = Math.min(m.target, m.current + 1);
          count++;
        }
        if (type === 'beast' && (m.id === 'm6_beast_dmg' || m.id === 'm7_beast_kill')) {
          if (m.id === 'm6_beast_dmg') m.current = Math.min(m.target, m.current + 6000);
          if (m.id === 'm7_beast_kill') m.current = Math.min(m.target, m.current + 1);
          count++;
        }
        if (type === 'alliance' && m.id === 'm8_alliance') {
          m.current = Math.min(m.target, m.current + 1500);
          count++;
        }
      }
    });

    setMissions(updatedMissions);
    addLog(`⚡ SIMULATION TRIGGERED: Generated progression updates on ${count} active missions.`, 'info');
    triggerAudioEffect("simulation_spark");
    commitChanges({ missions: updatedMissions });
  };

  // Claim Milestones
  const claimMilestoneChest = (pointsGoal: number) => {
    const idx = milestones.findIndex(mil => mil.pointsRequired === pointsGoal);
    if (idx === -1 || milestones[idx].claimed || convergencePoints < pointsGoal) return;

    const updatedMilestones = [...milestones];
    updatedMilestones[idx].claimed = true;
    setMilestones(updatedMilestones);

    // Simulate item rewards & currency bonuses
    let extraSignets = 0;
    if (pointsGoal === 200) extraSignets = 10;
    if (pointsGoal === 1000) {
      // Unlock Nebula cosmetic frame immediately
      const updatedShop = shopItems.map(item => {
        if (item.id === 'sh_frame_nebula') return { ...item, purchased: true };
        return item;
      });
      setShopItems(updatedShop);
    }
    if (pointsGoal === 2000) {
      // Unlock cybernetic tile skin
      const updatedShop = shopItems.map(item => {
        if (item.id === 'sh_skin_cyber') return { ...item, purchased: true };
        return item;
      });
      setShopItems(updatedShop);
    }

    const newSignets = signets + extraSignets;
    setSignets(newSignets);

    addLog(`🎁 MILESTONE UNLOCKED: Opened standard ${milestones[idx].name}! ${milestones[idx].itemDesc}`, 'success');
    triggerAudioEffect("chest_open_resonance");

    commitChanges({
      milestones: updatedMilestones,
      signets: newSignets
    });
  };

  // Buy Shop Items
  const buyShopItem = (itemId: string) => {
    const itemIdx = shopItems.findIndex(i => i.id === itemId);
    if (itemIdx === -1 || shopItems[itemIdx].purchased || signets < shopItems[itemIdx].price) {
      triggerAudioEffect("error_denial");
      return;
    }

    const updatedShop = [...shopItems];
    updatedShop[itemIdx].purchased = true;
    
    // Equip right away if tile skin
    let nextEquipped = equippedTheme;
    if (updatedShop[itemIdx].type === 'tileskin') {
      nextEquipped = updatedShop[itemIdx].id.replace('sh_skin_', '');
      updatedShop.forEach(it => {
        if (it.type === 'tileskin') it.equipped = it.id === itemId;
      });
    }

    const nextSignets = signets - updatedShop[itemIdx].price;

    setSignets(nextSignets);
    setShopItems(updatedShop);
    setEquippedTheme(nextEquipped);

    addLog(`🛒 SHOP PURCHASE SUCCESS: Bought "${updatedShop[itemIdx].name}" for ${updatedShop[itemIdx].price} Signets!`, 'success');
    triggerAudioEffect("shop_cash_register");

    commitChanges({
      shopItems: updatedShop,
      signets: nextSignets,
      equippedTheme: nextEquipped
    });
  };

  // Equip unlocked cosmetic or tileskin
  const equipItemTheme = (itemId: string) => {
    const item = shopItems.find(i => i.id === itemId);
    if (!item || !item.purchased) return;

    let nextEquipped = equippedTheme;
    const updatedShop = shopItems.map(it => {
      if (it.type === item.type) {
        const isTarget = it.id === itemId;
        if (isTarget && it.type === 'tileskin') {
          nextEquipped = it.id.replace('sh_skin_', '');
        }
        return { ...it, equipped: isTarget };
      }
      return it;
    });

    setShopItems(updatedShop);
    setEquippedTheme(nextEquipped);
    addLog(`🎨 COSMETIC EQUIPPED: Active theme swapped to "${item.name}".`, 'info');
    triggerAudioEffect("outfit_swap");

    commitChanges({
      shopItems: updatedShop,
      equippedTheme: nextEquipped
    });
  };

  // ==========================================
  // CONVERGENCE ALTAR PLAYABLE MINI BOARD
  // ==========================================
  const startConvergenceAltarBoard = () => {
    const elements = ['solar_fire', 'glacial_frost', 'emerald_nature', 'astral_light', 'obsidian_core', 'elixir_pure'];
    const tiles: ConvergenceTile[] = [];
    let idCounter = 0;
    
    // Create a unique layered structure (2 layers, 18 tiles total)
    // Layer 0: 3x4 grid, Layer 1: 2x3 grid
    for (let z = 0; z < 2; z++) {
      const rows = z === 0 ? 3 : 2;
      const cols = z === 0 ? 4 : 3;
      const offset = z === 0 ? 0 : 0.5;

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const randomType = elements[(x + y + z * 3) % elements.length];
          tiles.push({
            id: `conv_altar_${z}_${y}_${x}_${idCounter++}`,
            typeId: randomType,
            x: x + offset,
            y: y + offset,
            z,
            isBlocked: false
          });
        }
      }
    }

    evalBlockState(tiles);
    setAltarBoard(tiles);
    setAltarTray([]);
    setAltarScore(0);
    setAltarCombo(0);
    setBoardSolved(false);
    triggerAudioEffect("board_shuffling_noise");
    addLog("🔮 ALTAR LOADED: Convergence Altar activated! Solve coordinates to secure points.", "info");
  };

  const evalBlockState = (tiles: ConvergenceTile[]) => {
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

  const selectAltarTile = (tile: ConvergenceTile) => {
    if (tile.isBlocked || altarTray.length >= 7 || boardSolved) {
      triggerAudioEffect("tile_locked_clank");
      return;
    }

    // Filter board
    const nextBoard = altarBoard.filter(t => t.id !== tile.id);
    evalBlockState(nextBoard);
    setAltarBoard(nextBoard);

    const nextTray = [...altarTray, tile];

    // Check triplet match
    const grouped = nextTray.reduce((acc: {[key: string]: ConvergenceTile[]}, item) => {
      acc[item.typeId] = acc[item.typeId] || [];
      acc[item.typeId].push(item);
      return acc;
    }, {});

    let matchedType: string | null = null;
    for (const key in grouped) {
      if (grouped[key].length >= 3) {
        matchedType = key;
        break;
      }
    }

    if (matchedType) {
      const filteredTray = nextTray.filter(t => t.typeId !== matchedType);
      setAltarTray(filteredTray);

      // Score points
      const comboBonus = altarCombo + 1;
      setAltarCombo(comboBonus);
      
      const scoredPts = 100 * comboBonus;
      setAltarScore(prev => prev + scoredPts);

      // Add to event metrics!
      const pointGains = Math.round(5 * comboBonus);
      const signetGains = Math.round(2 * comboBonus);
      
      setConvergencePoints(prev => prev + pointGains);
      setSignets(prev => prev + signetGains);

      // Record solar rune matches to event missions!
      const nextMissions = m_matchProgress(matchedType);

      triggerAudioEffect("elemental_shatter");
      addLog(`✨ ALTAR MATCH: Alignment of standard elements unlocked! Scored +${pointGains} Convergence Points, +${signetGains} Signets (Combo x${comboBonus}).`, 'success');

      // Check if board solved
      if (nextBoard.length === 0 && filteredTray.length === 0) {
        setBoardSolved(true);
        addLog("🏆 CELESTIAL ALIGNMENT: Altar fully solved! Bonus +50 Convergence points awarded.", "success");
        setConvergencePoints(prev => prev + 50);
        setSignets(prev => prev + 20);
        triggerAudioEffect("victory_orchestra");
      }

      commitChanges({
        convergencePoints: convergencePoints + pointGains,
        signets: signets + signetGains,
        missions: nextMissions
      });
    } else {
      setAltarTray(nextTray);
      triggerAudioEffect("tile_slot_impact");

      // Check failure
      if (nextTray.length >= 7) {
        addLog("❌ ALTAR BLOCKED: The tray has filled up with mismatching elemental structures! Resetting.", "warning");
        triggerAudioEffect("defeat_orchestra");
        startConvergenceAltarBoard();
      }
    }
  };

  // Progress mission tracking upon matching runes
  const m_matchProgress = (typeId: string): EventMission[] => {
    const nextMissions = [...missions];
    nextMissions.forEach(m => {
      if (!m.claimed) {
        if (typeId === 'solar_fire' && m.id === 'm1_solar') {
          m.current = Math.min(m.target, m.current + 3);
        }
      }
    });
    setMissions(nextMissions);
    return nextMissions;
  };

  const getThemeConfig = (): TileTheme => {
    return CONVERGENCE_THEMES[equippedTheme] || CONVERGENCE_THEMES.default;
  };

  const themeConfig = getThemeConfig();

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#020205] text-zinc-100 p-1 md:p-3 relative select-none font-sans">
      
      {/* HEADER SECTION WITH TIMELINE SCHEDULE */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-indigo-950/20 border border-indigo-950/40 rounded-2xl p-4 flex flex-col xl:flex-row items-center justify-between gap-4 mb-4">
        
        {/* Left Stats Indicator */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-950/40 border border-indigo-500/40 rounded-2xl flex items-center justify-center text-indigo-400 shadow-xl relative animate-pulse">
            <Sparkles className="w-6 h-6 text-indigo-300" />
            <div className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-rose-500 rounded-full flex items-center justify-center text-[8px] font-black font-mono text-white">
              LIVE
            </div>
          </div>
          <div className="text-left">
            <span className="text-[8.5px] font-mono uppercase tracking-wider text-indigo-400 font-black block">Citadel Flagship Event</span>
            <h2 className="text-base font-serif font-black uppercase text-zinc-100 tracking-wider">Crystal Convergence</h2>
            <p className="text-[9.5px] font-mono text-zinc-400 mt-0.5 max-w-sm leading-tight">
              Solve layered match-3 nodes inside the Convergence Altar to harvest elite cosmos rewards.
            </p>
          </div>
        </div>

        {/* 2-Week Schedule Timeline */}
        <div className="flex items-center gap-1 bg-zinc-950/80 border border-zinc-900 rounded-xl p-1 max-w-full overflow-x-auto">
          {Array.from({ length: 14 }).map((_, idx) => {
            const dayNum = idx + 1;
            const isToday = dayNum === 5; // Highlight Day 5 as active
            const isCompleted = dayNum < 5;
            
            return (
              <div 
                key={dayNum} 
                className={`w-7 h-8 rounded-lg flex flex-col items-center justify-center font-mono border text-[8px] transition-all relative shrink-0 ${
                  isToday 
                    ? 'bg-indigo-950/60 border-indigo-500 text-indigo-300 scale-105 ring-1 ring-indigo-500/20 font-black' 
                    : isCompleted 
                      ? 'bg-zinc-950 border-emerald-950/50 text-emerald-500/60' 
                      : 'bg-zinc-950/40 border-zinc-900 text-zinc-600'
                }`}
                title={`Day ${dayNum} of Convergence`}
              >
                <span>D{dayNum}</span>
                {isCompleted && <div className="w-1 h-1 bg-emerald-500 rounded-full mt-0.5" />}
                {isToday && <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full mt-0.5 animate-ping" />}
              </div>
            );
          })}
        </div>

        {/* Timer & Currencies */}
        <div className="flex items-center gap-4 font-mono text-xs">
          <div className="text-right hidden sm:block">
            <span className="text-[8px] text-zinc-550 block uppercase font-bold">TIME REMAINING</span>
            <div className="flex items-center gap-1 justify-end text-rose-400 mt-0.5 font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>9d 4h 15m</span>
            </div>
          </div>

          <div className="h-8 w-[1px] bg-zinc-900 hidden sm:block" />

          {/* Currencies Indicators */}
          <div className="flex items-center gap-4 bg-zinc-950/80 border border-zinc-900 p-1.5 rounded-xl">
            <div className="text-left px-2 border-r border-zinc-900/50">
              <span className="text-[7.5px] text-indigo-400 block uppercase font-black">SIGNETS</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-indigo-300">⭐</span>
                <span className="font-mono font-black text-white text-sm">{signets}</span>
              </div>
            </div>

            <div className="text-left px-2">
              <span className="text-[7.5px] text-emerald-400 block uppercase font-black">POINTS</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-emerald-400">👑</span>
                <span className="font-mono font-black text-white text-sm">{convergencePoints}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* MILESTONE REWARD TRACK ROAD */}
      <div className="bg-zinc-950/80 border border-indigo-950/30 rounded-2xl p-4 text-left mb-4 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3 border-b border-zinc-900 pb-1.5">
          <div className="flex items-center gap-1.5">
            <Gift className="w-4 h-4 text-emerald-400 animate-bounce" />
            <span className="text-[10px] font-serif font-black uppercase text-zinc-100 tracking-wider">Ascendance Milestone Highroad</span>
          </div>
          <span className="text-[8px] font-mono bg-emerald-950/40 border border-emerald-900 text-emerald-300 px-1.5 py-0.5 rounded uppercase font-bold">
            PROGRESS: {convergencePoints} / 2000 PTS
          </span>
        </div>

        {/* PROGRESS HIGHWAY TRACK BAR */}
        <div className="relative my-6 px-4">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-zinc-900 -translate-y-1/2 rounded-full" />
          <div 
            className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-emerald-500 to-indigo-500 -translate-y-1/2 rounded-full transition-all duration-500" 
            style={{ width: `${Math.min(100, (convergencePoints / 2000) * 100)}%` }}
          />

          {/* CHEST CHEVRONS */}
          <div className="flex justify-between relative">
            {milestones.map((mil, idx) => {
              const isUnlocked = convergencePoints >= mil.pointsRequired;
              const isClaimed = mil.claimed;
              
              return (
                <div key={idx} className="flex flex-col items-center relative -translate-y-2 select-none">
                  <button
                    disabled={!isUnlocked || isClaimed}
                    onClick={() => claimMilestoneChest(mil.pointsRequired)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-base border-2 transition-all relative ${
                      isClaimed 
                        ? 'bg-zinc-950 border-emerald-500 text-emerald-500 scale-95 opacity-50' 
                        : isUnlocked 
                          ? 'bg-indigo-950/50 border-indigo-400 text-indigo-300 scale-110 shadow-lg shadow-indigo-500/20 cursor-pointer hover:scale-125' 
                          : 'bg-zinc-950 border-zinc-800 text-zinc-600 cursor-not-allowed'
                    }`}
                    title={mil.name}
                  >
                    <span>{isClaimed ? '✓' : mil.icon}</span>
                  </button>
                  <span className="text-[8px] font-mono font-black mt-2 text-zinc-400">{mil.pointsRequired} Pts</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* REVOLUTIONARY SEASON SUPPORT SELECTOR AND SUBTABS */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4 bg-zinc-950/50 p-2 border border-zinc-900 rounded-xl">
        {/* Season support */}
        <div className="flex items-center gap-2">
          <span className="text-[8px] font-mono uppercase font-black text-zinc-500 block">Season Timeline:</span>
          <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-900 rounded-lg p-0.5">
            {SEASONS_DB.map(season => {
              const isActive = activeSeason.id === season.id;
              return (
                <button
                  key={season.id}
                  onClick={() => rotateSeason(season)}
                  className={`px-2 py-1 rounded font-mono text-[8.5px] uppercase font-black transition-all cursor-pointer ${
                    isActive 
                      ? `bg-indigo-950/50 border border-indigo-500/30 text-indigo-300` 
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {season.id.replace('s', 'S')}
                </button>
              );
            })}
          </div>
        </div>

        {/* SUB NAVIGATION TABS */}
        <div className="flex items-center gap-1.5 max-w-full overflow-x-auto">
          {[
            { id: 'lobby', label: 'Dashboard', icon: Layers },
            { id: 'altar', label: 'Convergence Altar', icon: Gamepad2 },
            { id: 'missions', label: 'Event Missions', icon: Sparkle },
            { id: 'shop', label: 'Cosmetic Shop', icon: ShoppingBag },
            { id: 'rankings', label: 'Leaderboard', icon: Trophy }
          ].map(tab => {
            const IconComponent = tab.icon;
            const isTabActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveSubTab(tab.id as any); triggerAudioEffect("nav_click"); }}
                className={`px-3 py-1.5 rounded-xl border font-mono text-[9.5px] font-black uppercase cursor-pointer active:scale-95 transition-all flex items-center gap-1 shrink-0 ${
                  isTabActive 
                    ? 'bg-indigo-950/50 border-indigo-500 text-indigo-300' 
                    : 'bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <IconComponent className="w-3 h-3 text-indigo-400" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* CORE DISPLAY WINDOW */}
      <div className="flex-1 min-h-0 relative">
        <AnimatePresence mode="wait">
          
          {/* ==========================================
              SUB-SCREEN 1: THE EVENT LOBBY HOME
              ========================================== */}
          {activeSubTab === 'lobby' && (
            <motion.div
              key="lobby"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute inset-0 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-y-auto"
            >
              {/* LEFT COLUMN (7/12): SPECIAL CONVERGENCE SUMMARY & ROTATION */}
              <div className="lg:col-span-7 flex flex-col gap-4 text-left">
                
                {/* SEASON PRESENTATION CARD */}
                <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-indigo-950/10 border border-indigo-950/30 rounded-2xl p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[80px] rounded-full" />
                  
                  <span className="text-[8.5px] font-mono bg-indigo-950/60 border border-indigo-900 text-indigo-300 px-1.5 py-0.5 rounded uppercase font-black">
                    Active Rotation
                  </span>
                  
                  <h3 className="text-lg font-serif font-black uppercase text-zinc-100 mt-2 tracking-wide">
                    {activeSeason.name}
                  </h3>
                  <p className="text-[10px] text-zinc-400 italic">
                    "{activeSeason.subtitle}"
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="bg-zinc-950/80 border border-zinc-900 p-3 rounded-xl flex gap-3">
                      <div className="w-10 h-10 bg-indigo-950/40 rounded-lg flex items-center justify-center text-lg shadow-md border border-indigo-800/30">
                        👾
                      </div>
                      <div className="text-left">
                        <span className="text-[8px] text-zinc-550 uppercase block font-bold">SEASON RAID BEAST</span>
                        <span className="text-xs font-mono font-black text-indigo-300 block mt-0.5">
                          {activeSeason.bossId === 'fenrir_shadow' ? 'Fenrir Shadowfang' : activeSeason.bossId === 'pyre_lord_ignis' ? 'Ignis Pyre-Lord' : 'Aurelius Gold Drake'}
                        </span>
                      </div>
                    </div>

                    <div className="bg-zinc-950/80 border border-zinc-900 p-3 rounded-xl flex gap-3">
                      <div className="w-10 h-10 bg-indigo-950/40 rounded-lg flex items-center justify-center text-lg shadow-md border border-indigo-800/30">
                        🎨
                      </div>
                      <div className="text-left">
                        <span className="text-[8px] text-zinc-550 uppercase block font-bold">EXCLUSIVE THEME</span>
                        <span className="text-xs font-mono font-black text-indigo-300 block mt-0.5 uppercase">
                          {activeSeason.activeBoardTheme} CRYSTALS
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-zinc-400 mt-4 leading-relaxed">
                    Completing goals during the recurring Convergence schedule contributes Points directly to the Ascendance Milestone Highroad. Higher milestones unlock permanent Cosmetics, Frames, and Custom Themes!
                  </p>

                  <div className="mt-4 pt-4 border-t border-zinc-900 flex flex-wrap gap-2">
                    <button
                      onClick={() => simulateActivity('puzzle')}
                      className="px-2.5 py-1.5 rounded-lg border border-indigo-900/40 hover:border-indigo-500 bg-indigo-950/20 text-indigo-400 font-mono text-[9px] font-black uppercase cursor-pointer"
                    >
                      🧪 Run Puzzle Sim
                    </button>
                    <button
                      onClick={() => simulateActivity('arena')}
                      className="px-2.5 py-1.5 rounded-lg border border-purple-900/40 hover:border-purple-500 bg-purple-950/20 text-purple-400 font-mono text-[9px] font-black uppercase cursor-pointer"
                    >
                      ⚔️ Run Arena Sim
                    </button>
                    <button
                      onClick={() => simulateActivity('beast')}
                      className="px-2.5 py-1.5 rounded-lg border border-emerald-900/40 hover:border-emerald-500 bg-emerald-950/20 text-emerald-400 font-mono text-[9px] font-black uppercase cursor-pointer"
                    >
                      🐺 Run Beast Sim
                    </button>
                    <button
                      onClick={() => simulateActivity('alliance')}
                      className="px-2.5 py-1.5 rounded-lg border border-amber-900/40 hover:border-amber-500 bg-amber-950/20 text-amber-400 font-mono text-[9px] font-black uppercase cursor-pointer"
                    >
                      🏰 Run Guild Sim
                    </button>
                  </div>
                </div>

                {/* THEME SELECTOR INTERFACE */}
                <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3 border-b border-zinc-900 pb-2">
                    <Crown className="w-4 h-4 text-amber-400 animate-pulse" />
                    <span className="text-xs font-serif font-black uppercase tracking-wider text-zinc-100">Equippable Puzzle Tile Skins</span>
                  </div>

                  <p className="text-[10px] text-zinc-400 mb-4">
                    Purchased exclusive themes modify the visual layer cells inside the special Convergence Altar Match-3 board instantly!
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.values(CONVERGENCE_THEMES).map(theme => {
                      const isEquipped = equippedTheme === theme.id;
                      const isDefault = theme.id === 'default';
                      
                      const associatedShop = shopItems.find(it => it.id === `sh_skin_${theme.id}`);
                      const isPurchased = isDefault || (associatedShop ? associatedShop.purchased : false);

                      return (
                        <div 
                          key={theme.id}
                          className={`p-3 rounded-xl border flex flex-col justify-between transition-all relative ${
                            isEquipped 
                              ? 'bg-indigo-950/10 border-indigo-500 ring-1 ring-indigo-500/20' 
                              : isPurchased 
                                ? 'bg-zinc-950 border-zinc-800' 
                                : 'bg-zinc-950 border-zinc-900 opacity-60'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="text-left">
                              <h4 className="text-xs font-serif font-bold text-zinc-100">{theme.name}</h4>
                              <p className="text-[8.5px] text-zinc-550 font-mono mt-0.5">{theme.desc}</p>
                            </div>

                            {isEquipped && (
                              <span className="text-[7.5px] font-mono font-black uppercase text-indigo-400 bg-indigo-950/50 px-1 rounded border border-indigo-800/30">
                                Equipped
                              </span>
                            )}
                          </div>

                          {/* Preview elements */}
                          <div className="flex items-center gap-1.5 my-3 bg-zinc-900/30 p-1.5 rounded-lg border border-zinc-900 justify-around">
                            {Object.values(theme.elements).slice(0, 5).map((el, i) => (
                              <span key={i} className="text-xs" title={el.label}>
                                {el.emoji}
                              </span>
                            ))}
                          </div>

                          {isPurchased ? (
                            <button
                              disabled={isEquipped}
                              onClick={() => {
                                const matchedId = isDefault ? 'default' : `sh_skin_${theme.id}`;
                                if (isDefault) {
                                  setEquippedTheme('default');
                                  addLog("🎨 COSMETIC EQUIPPED: Swapped to Citadel Standard tiles.", "info");
                                  triggerAudioEffect("outfit_swap");
                                  commitChanges({ equippedTheme: 'default' });
                                } else {
                                  equipItemTheme(matchedId);
                                }
                              }}
                              className="w-full py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded font-mono text-[8px] font-bold uppercase transition-all cursor-pointer"
                            >
                              {isEquipped ? 'Active' : 'Equip Theme'}
                            </button>
                          ) : (
                            <div className="flex items-center gap-1 justify-center text-[7.5px] text-zinc-550 font-mono uppercase bg-zinc-950 border border-zinc-900 py-1 rounded">
                              <Lock className="w-2.5 h-2.5 text-zinc-650" /> Locked (Buy in shop)
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* RIGHT COLUMN (5/12): RECENT LOGS, FAST MISSIONS PREVIEW */}
              <div className="lg:col-span-5 flex flex-col gap-4 text-left">
                
                {/* MISSIONS FAST PANEL */}
                <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3 border-b border-zinc-900 pb-1.5">
                      <span className="text-[10px] font-serif font-black uppercase text-zinc-100 tracking-wider">Fast Mission Alignment</span>
                      <button 
                        onClick={() => setActiveSubTab('missions')}
                        className="text-[8px] font-mono text-indigo-400 uppercase font-black hover:underline cursor-pointer"
                      >
                        All Missions
                      </button>
                    </div>

                    <div className="flex flex-col gap-2.5 max-h-[280px] overflow-y-auto pr-1">
                      {missions.slice(0, 4).map((m) => {
                        const isDone = m.current >= m.target;
                        const percent = Math.min(100, (m.current / m.target) * 100);
                        
                        return (
                          <div key={m.id} className="p-2 bg-zinc-950 border border-zinc-900 rounded-xl relative overflow-hidden">
                            <div className="flex items-start justify-between gap-3 text-xs">
                              <div className="text-left">
                                <span className={`text-[7px] font-mono px-1 rounded uppercase font-black ${
                                  m.category === 'daily' ? 'bg-indigo-950/40 text-indigo-400' : 'bg-purple-950/40 text-purple-400'
                                }`}>
                                  {m.category} Goal
                                </span>
                                <h4 className="font-serif font-extrabold text-zinc-200 mt-1 uppercase tracking-wide text-[9.5px]">
                                  {m.title}
                                </h4>
                              </div>

                              <span className="font-mono text-[9px] text-zinc-500 font-extrabold">
                                {m.current.toLocaleString()} / {m.target.toLocaleString()}
                              </span>
                            </div>

                            {/* PROGRESS MINI BAR */}
                            <div className="w-full h-1 bg-zinc-900 rounded-full mt-2 relative">
                              <div 
                                className="absolute top-0 left-0 h-1 bg-indigo-500 rounded-full" 
                                style={{ width: `${percent}%` }}
                              />
                            </div>

                            {isDone && !m.claimed && (
                              <button
                                onClick={() => claimMissionReward(m.id)}
                                className="w-full mt-2 py-1 bg-emerald-600/30 hover:bg-emerald-600 border border-emerald-500/40 text-emerald-300 rounded font-mono text-[8px] font-bold uppercase cursor-pointer"
                              >
                                Claim rewards
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="border-t border-zinc-900 pt-3 mt-3">
                    <p className="text-[8.5px] text-zinc-550 leading-tight">
                      *Note: Event progression and milestones are reset at season end. Ensure you expend Altar signets in the Cosmetics Shop prior to timers fading out.
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ==========================================
              SUB-SCREEN 2: CONVERGENCE ALTAR PLAYABLE BOARD
              ========================================== */}
          {activeSubTab === 'altar' && (
            <motion.div
              key="altar"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute inset-0 flex flex-col xl:flex-row gap-5 overflow-y-auto"
            >
              {/* LEFT BOARD STAGE VIEW (7/12) */}
              <div className="flex-1 flex flex-col gap-4 bg-zinc-950/80 border border-indigo-950/30 rounded-2xl p-4 min-h-[450px]">
                
                {/* Header of Altar Board */}
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                  <div className="text-left">
                    <span className="text-[8px] font-mono text-indigo-400 uppercase font-black">Active Special Canvas</span>
                    <h3 className="text-sm font-serif font-black uppercase text-zinc-200 tracking-wide">
                      The Convergence Altar Board
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="text-right">
                      <span className="text-[7.5px] text-zinc-550 block uppercase font-bold">ALTAR SCORE</span>
                      <span className="font-mono font-black text-white">{altarScore} pts</span>
                    </div>

                    <div className="text-right">
                      <span className="text-[7.5px] text-zinc-550 block uppercase font-bold">ACTIVE COMBO</span>
                      <span className="font-mono font-black text-rose-400">x{altarCombo}</span>
                    </div>
                  </div>
                </div>

                {/* GAMEPLAY CANVAS INTERACTION AREA */}
                <div className="flex-1 flex items-center justify-center relative bg-gradient-to-b from-[#030307] to-zinc-950 rounded-xl overflow-hidden min-h-[300px] border border-zinc-900">
                  <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

                  {altarBoard.length > 0 ? (
                    <div className="relative w-[340px] h-[280px] select-none">
                      {altarBoard.map((tile) => {
                        const itemType = themeConfig.elements[tile.typeId as keyof typeof themeConfig.elements] || themeConfig.elements.solar_fire;
                        
                        // Layout positions based on 3D layers
                        const leftPos = tile.x * 74 + tile.z * 14 + 18;
                        const topPos = tile.y * 82 - tile.z * 16 + 28;

                        return (
                          <button
                            key={tile.id}
                            disabled={tile.isBlocked}
                            onClick={() => selectAltarTile(tile)}
                            className={`absolute w-15 h-18 rounded-xl border flex flex-col items-center justify-between p-1.5 transition-all duration-300 shadow-md select-none cursor-pointer ${
                              tile.isBlocked 
                                ? 'bg-zinc-950/90 border-zinc-950 text-zinc-600 scale-95 opacity-40 cursor-not-allowed' 
                                : `${itemType.bg} border-indigo-500/40 hover:scale-105 active:scale-95`
                            }`}
                            style={{
                              left: `${leftPos}px`,
                              top: `${topPos}px`,
                              zIndex: tile.z * 10 + 2
                            }}
                          >
                            <span className="text-[7.5px] font-mono font-bold tracking-tight text-zinc-500">
                              Z{tile.z}
                            </span>
                            
                            <span className={`text-xl transition-transform ${tile.isBlocked ? '' : 'animate-pulse'}`}>
                              {itemType.emoji}
                            </span>

                            <span className={`text-[7.5px] font-mono font-extrabold uppercase ${itemType.color}`}>
                              {itemType.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <span className="text-4xl mb-3">🔮</span>
                      <h4 className="text-sm font-serif font-bold uppercase text-zinc-200">ALTAR POWER DORMANT</h4>
                      <p className="text-[10px] text-zinc-500 max-w-xs mt-1">
                        Charge the alignment beacons. Re-trigger a fresh special match-3 puzzle layer to earn Signets and Points!
                      </p>
                      <button
                        onClick={startConvergenceAltarBoard}
                        className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer shadow-lg active:scale-95 transition-all"
                      >
                        Activate Altar Canvas
                      </button>
                    </div>
                  )}
                </div>

                {/* THE TRAY */}
                <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[8.5px] font-mono uppercase tracking-wider text-zinc-500 font-extrabold">Altar Resonance Vessel (Tray)</span>
                    <span className="text-[8.5px] font-mono text-zinc-550">{altarTray.length} / 7 items</span>
                  </div>

                  <div className="h-14 bg-zinc-950 border border-zinc-900/50 rounded-xl flex items-center justify-start gap-1 px-2.5 overflow-x-auto">
                    {altarTray.map((tile, idx) => {
                      const itemType = themeConfig.elements[tile.typeId as keyof typeof themeConfig.elements];
                      return (
                        <div 
                          key={tile.id || idx} 
                          className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-lg relative group animate-bounce-short"
                        >
                          <span>{itemType?.emoji || '❓'}</span>
                        </div>
                      );
                    })}

                    {altarTray.length === 0 && (
                      <span className="text-[9.5px] font-mono text-zinc-600 italic block mx-auto">Vessel empty. Click free overlay tiles to select.</span>
                    )}
                  </div>
                </div>

              </div>

              {/* RIGHT SIDEBAR (5/12): HOW TO SCORE, RE-SHUFFLES */}
              <div className="w-full xl:w-80 flex flex-col gap-4 text-left">
                
                {/* TOOLBOX ACTIONS */}
                <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-4">
                  <div className="flex items-center gap-1.5 mb-3 border-b border-zinc-900 pb-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="text-[10px] font-serif font-black uppercase text-zinc-200 tracking-wider">Canvas Altar Control</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        if (altarBoard.length === 0) return;
                        // Simple shuffle logic
                        const types = altarBoard.map(t => t.typeId);
                        const shuffledTypes = [...types].sort(() => Math.random() - 0.5);
                        const updated = altarBoard.map((tile, i) => ({
                          ...tile,
                          typeId: shuffledTypes[i]
                        }));
                        setAltarBoard(updated);
                        triggerAudioEffect("shuffle_scramble");
                        addLog("🌀 CANVAS SCRAMBLE: Shuffled elemental positioning coordinates.", "info");
                      }}
                      className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-[9px] font-black uppercase rounded-lg border border-zinc-850 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ShuffleIcon className="w-3.5 h-3.5" />
                      <span>Scramble Coordinates</span>
                    </button>

                    <button
                      onClick={() => {
                        // Reset board
                        startConvergenceAltarBoard();
                      }}
                      className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-mono text-[9px] font-black uppercase rounded-lg border border-zinc-850 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Re-align Board Layers</span>
                    </button>
                  </div>
                </div>

                {/* THEME DETAILS GUIDE */}
                <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-4">
                  <span className="text-[8.5px] font-mono text-zinc-550 uppercase tracking-wider block mb-2">Equipped Theme Details</span>
                  
                  <div className="bg-zinc-950 border border-zinc-900 p-2.5 rounded-xl flex items-center gap-3">
                    <span className="text-xl">🎨</span>
                    <div>
                      <span className="text-[9.5px] font-black text-indigo-300 block font-mono uppercase">{themeConfig.name}</span>
                      <span className="text-[8px] text-zinc-500 block leading-tight">{themeConfig.desc}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-3">
                    {Object.entries(themeConfig.elements).map(([key, item]) => (
                      <div key={key} className="flex items-center justify-between text-[10px] font-mono bg-zinc-950 p-1 px-2 rounded border border-zinc-900">
                        <span className="text-zinc-400 block">{key.replace('_', ' ').toUpperCase()}</span>
                        <div className="flex items-center gap-1.5">
                          <span className={item.color}>{item.label}</span>
                          <span>{item.emoji}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ==========================================
              SUB-SCREEN 3: ALL EVENT MISSIONS LIST
              ========================================== */}
          {activeSubTab === 'missions' && (
            <motion.div
              key="missions"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute inset-0 bg-zinc-950/80 border border-indigo-950/30 rounded-2xl p-5 overflow-y-auto text-left"
            >
              <div className="flex items-center justify-between mb-4 border-b border-zinc-900 pb-2">
                <div className="flex items-center gap-2">
                  <Sparkle className="w-4 h-4 text-indigo-400 animate-spin" />
                  <span className="text-sm font-serif font-black uppercase text-zinc-100 tracking-wider">Ascendance Task Registries</span>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => simulateActivity('puzzle')}
                    className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[8.5px] font-mono text-indigo-300 rounded uppercase font-black cursor-pointer"
                  >
                    ⚡ Sim Activities
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {missions.map((mission) => {
                  const isDone = mission.current >= mission.target;
                  const percent = Math.min(100, (mission.current / mission.target) * 100);

                  return (
                    <div 
                      key={mission.id} 
                      className={`p-3.5 rounded-xl border transition-all relative flex flex-col justify-between ${
                        mission.claimed 
                          ? 'bg-zinc-950/40 border-zinc-950 opacity-50' 
                          : isDone 
                            ? 'bg-indigo-950/10 border-indigo-500/40' 
                            : 'bg-zinc-950 border-zinc-900 hover:border-zinc-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-3">
                          <span className={`text-[7.5px] font-mono font-black uppercase px-1.5 py-0.5 rounded ${
                            mission.category === 'daily' 
                              ? 'bg-indigo-950 text-indigo-400 border border-indigo-900' 
                              : 'bg-purple-950 text-purple-400 border border-purple-900'
                          }`}>
                            {mission.category} target
                          </span>

                          <span className="font-mono text-xs text-zinc-300 font-extrabold">
                            {mission.current.toLocaleString()} / {mission.target.toLocaleString()}
                          </span>
                        </div>

                        <h4 className="text-xs font-serif font-extrabold uppercase text-zinc-100 tracking-wide mt-2">
                          {mission.title}
                        </h4>
                        
                        <p className="text-[10px] text-zinc-400 mt-1 leading-snug">
                          {mission.description}
                        </p>
                      </div>

                      <div className="border-t border-zinc-900/50 pt-3 mt-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 text-[9px] font-mono">
                          <div className="text-left">
                            <span className="text-[7.5px] text-zinc-550 uppercase font-bold block">SIGNETS</span>
                            <span className="font-bold text-indigo-300">+{mission.signetsReward} ⭐</span>
                          </div>
                          
                          <div className="text-left">
                            <span className="text-[7.5px] text-zinc-550 uppercase font-bold block">POINTS</span>
                            <span className="font-bold text-emerald-400">+{mission.pointsReward} 👑</span>
                          </div>
                        </div>

                        {mission.claimed ? (
                          <span className="text-[8.5px] font-mono font-black uppercase text-emerald-500 flex items-center gap-1 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/30">
                            Claimed ✓
                          </span>
                        ) : isDone ? (
                          <button
                            onClick={() => claimMissionReward(mission.id)}
                            className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-mono text-[8px] font-black uppercase tracking-wider rounded-lg shadow-md cursor-pointer transition-all active:scale-95"
                          >
                            Claim Rewards
                          </button>
                        ) : (
                          <div className="w-24 bg-zinc-950 border border-zinc-900 rounded-full h-1 relative self-center">
                            <div 
                              className="absolute top-0 left-0 h-1 bg-indigo-500 rounded-full" 
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ==========================================
              SUB-SCREEN 4: COSMETICS SHOP BAZAAR
              ========================================== */}
          {activeSubTab === 'shop' && (
            <motion.div
              key="shop"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute inset-0 bg-zinc-950/80 border border-indigo-950/30 rounded-2xl p-5 overflow-y-auto text-left"
            >
              <div className="flex items-center justify-between mb-4 border-b border-zinc-900 pb-2">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-indigo-400 animate-pulse" />
                  <span className="text-sm font-serif font-black uppercase text-zinc-100 tracking-wider">Exclusive Cosmetics Shop Bazaar</span>
                </div>

                <div className="flex items-center gap-1 bg-zinc-950 px-2.5 py-1 rounded-xl border border-zinc-900 text-xs font-mono">
                  <span className="text-indigo-400 font-bold">MY BAL:</span>
                  <span className="font-black text-white">{signets} ⭐</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {shopItems.map((item) => {
                  const isPurchased = item.purchased;
                  const canBuy = signets >= item.price;
                  
                  // For tile skins, check if equipped
                  let isEquipped = false;
                  if (item.type === 'tileskin') {
                    isEquipped = equippedTheme === item.id.replace('sh_skin_', '');
                  }

                  return (
                    <div 
                      key={item.id} 
                      className={`p-4 bg-zinc-950 border rounded-xl flex flex-col justify-between transition-all relative ${
                        isEquipped 
                          ? 'border-indigo-500' 
                          : isPurchased 
                            ? 'border-zinc-800' 
                            : 'border-zinc-900 hover:border-zinc-800'
                      }`}
                    >
                      <div className="text-left">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-[7px] font-mono uppercase bg-zinc-900 border border-zinc-800 text-zinc-500 px-1 rounded font-black">
                            {item.type} Item
                          </span>
                          
                          {!isPurchased && (
                            <span className="text-[9.5px] font-mono text-indigo-400 font-black flex items-center gap-0.5">
                              {item.price} ⭐
                            </span>
                          )}
                        </div>

                        {/* Large icon box */}
                        <div className="w-full h-24 bg-gradient-to-b from-[#030307] to-zinc-950 border border-zinc-900 rounded-xl flex items-center justify-center text-4xl shadow-md mb-3 select-none">
                          {item.icon}
                        </div>

                        <h4 className="text-xs font-serif font-extrabold uppercase text-zinc-200 tracking-wide">
                          {item.name}
                        </h4>
                        
                        <p className="text-[9px] text-zinc-500 mt-1 leading-snug">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-zinc-900 flex gap-2">
                        {isPurchased ? (
                          item.type === 'tileskin' ? (
                            <button
                              disabled={isEquipped}
                              onClick={() => equipItemTheme(item.id)}
                              className={`w-full py-1.5 rounded font-mono text-[8.5px] font-black uppercase transition-all cursor-pointer ${
                                isEquipped 
                                  ? 'bg-indigo-950/20 text-indigo-400 border border-indigo-900/40 cursor-not-allowed' 
                                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300'
                              }`}
                            >
                              {isEquipped ? 'Equipped' : 'Equip Skin'}
                            </button>
                          ) : (
                            <div className="w-full text-center py-1.5 text-[8.5px] font-mono font-black uppercase text-emerald-500 bg-emerald-950/20 rounded border border-emerald-900/30">
                              Unlocked ✓
                            </div>
                          )
                        ) : (
                          <button
                            disabled={!canBuy}
                            onClick={() => buyShopItem(item.id)}
                            className={`w-full py-1.5 font-mono text-[8.5px] font-black uppercase rounded transition-all cursor-pointer ${
                              canBuy 
                                ? 'bg-indigo-600 hover:bg-indigo-500 text-white' 
                                : 'bg-zinc-900 text-zinc-600 border border-zinc-950 cursor-not-allowed'
                            }`}
                          >
                            {canBuy ? 'Acquire Cosmetic' : 'Insufficient Bal'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ==========================================
              SUB-SCREEN 5: GLOBAL EVENT LEADERBOARDS
              ========================================== */}
          {activeSubTab === 'rankings' && (
            <motion.div
              key="rankings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute inset-0 bg-zinc-950/80 border border-indigo-950/30 rounded-2xl p-5 overflow-y-auto text-left"
            >
              <div className="flex items-center justify-between mb-4 border-b border-zinc-900 pb-2">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-serif font-black uppercase text-zinc-100 tracking-wider">Convergence Ascendance Standings</span>
                </div>

                {/* Leaderboard toggle */}
                <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-900 rounded-lg p-0.5">
                  <button
                    onClick={() => { setRankingsTab('solo'); triggerAudioEffect("nav_click"); }}
                    className={`px-2 py-1 rounded font-mono text-[9px] uppercase font-black transition-all cursor-pointer ${
                      rankingsTab === 'solo' 
                        ? 'bg-indigo-950/50 border border-indigo-500/30 text-indigo-300' 
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    Solo Guardians
                  </button>
                  <button
                    onClick={() => { setRankingsTab('alliance'); triggerAudioEffect("nav_click"); }}
                    className={`px-2 py-1 rounded font-mono text-[9px] uppercase font-black transition-all cursor-pointer ${
                      rankingsTab === 'alliance' 
                        ? 'bg-indigo-950/50 border-indigo-500/30 text-indigo-300' 
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    Alliance Citadels
                  </button>
                </div>
              </div>

              {/* Leaderboard rows */}
              <div className="flex flex-col gap-2.5 max-w-2xl mx-auto">
                {(rankingsTab === 'solo' ? soloLeaderboard : allianceLeaderboard).map((row) => (
                  <div 
                    key={row.rank} 
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs font-mono transition-all ${
                      row.isPlayer 
                        ? 'bg-indigo-950/20 border-indigo-500/40 shadow-md shadow-indigo-500/5' 
                        : 'bg-zinc-950 border-zinc-900'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank number or Crown */}
                      <div className="w-6 text-center">
                        {row.rank === 1 ? (
                          <span className="text-lg" title="1st Place Champion">👑</span>
                        ) : row.rank === 2 ? (
                          <span className="text-lg" title="2nd Place Elite">🥈</span>
                        ) : row.rank === 3 ? (
                          <span className="text-lg" title="3rd Place Valiant">🥉</span>
                        ) : (
                          <span className="text-[11px] font-black text-indigo-400 w-5 block">#{row.rank}</span>
                        )}
                      </div>

                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-zinc-100 text-sm block">
                            {row.name}
                          </span>
                          {row.isPlayer && (
                            <span className="text-[7px] font-mono font-black uppercase text-rose-400 bg-rose-950/40 px-1 rounded border border-rose-900/30">
                              YOU
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] text-zinc-500">{row.guild}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm text-zinc-100 font-black block">
                        {row.points.toLocaleString()} PTS
                      </span>
                      <span className="text-[8.5px] text-indigo-400 uppercase font-black tracking-wide">
                        {row.rating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="max-w-2xl mx-auto mt-4 text-center">
                <p className="text-[9px] text-zinc-500">
                  Leaderboard placements refresh automatically every 10 minutes. Matching elemental nodes on the Convergence Altar directly feeds points into your standings in real-time!
                </p>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
