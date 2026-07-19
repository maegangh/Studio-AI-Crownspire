import React, { useState, useRef, useEffect } from 'react';
import { Building, BuildingUpgrade, Resources, ResourceCost, Hero, QuestState, ResearchState, UnitType, TroopState } from '../types';
import BuildingDatabaseModal from './BuildingDatabaseModal';
import AcademyResearchScene from './AcademyResearchScene';
import { BUILDING_DATABASE } from '../utils/buildingDatabase';
import { CITY_LAYOUTS } from '../utils/cityLayout';
import { CITY_DECORATIONS } from '../utils/cityDecorations';
import { getRequiredLevelForTier } from '../utils/troopDatabase';
import { CROWNSPIRE_RESEARCH_DATABASE, isResearchUnlocked } from '../utils/researchDatabase';
import { 
  formatNum, 
  getFoodStorageLimit, 
  getWoodStorageLimit, 
  getStoneStorageLimit, 
  getIronStorageLimit, 
  getWarehouseProtectionLimit 
} from '../gameData';
import { motion, AnimatePresence } from 'motion/react';
// @ts-ignore
import citadelCastleImage from '../assets/images/citadel_castle_1781457849643.jpg';
import { 
  Cherry, 
  Trees, 
  Dumbbell, 
  Hammer, 
  Sparkles, 
  ShieldAlert, 
  ArrowUpCircle, 
  ChevronRight,
  Sparkle,
  Tent,
  BookOpen,
  Sword,
  TrendingUp,
  Package,
  Award,
  Shield,
  HelpCircle,
  Coins,
  Compass,
  ArrowBigUp,
  GraduationCap,
  Sparkles as SparklesIcon,
  RotateCcw,
  Sliders,
  Eye,
  Info,
  Layers,
  MapPin,
  Trash,
  Hourglass,
  Plus,
  Minus,
  Lock
} from 'lucide-react';

interface CityTabProps {
  buildings: Building[];
  resources: Resources;
  storedResources: {
    food: number;
    wood: number;
    stone: number;
    iron: number;
  };
  castleLevel: number;
  warehouseLevel: number;
  research: ResearchState;
  setResearch: React.Dispatch<React.SetStateAction<ResearchState>>;
  setResources: React.Dispatch<React.SetStateAction<Resources>>;
  addLog: (text: string, type?: 'success' | 'info' | 'warning' | 'combat') => void;
  heroes: Hero[];
  heroTickets: number;
  quests: QuestState;
  currentHeroIndex: number;
  onUpgradeBuilding: (id: string) => void;
  onGatherAll: () => void;
  onUpgradeCastle: () => void;
  onUpgradeWarehouse: () => void;
  onUpgradeResearch: (branch: string) => void;
  onDrawHero: () => void;
  onLevelUpHero: (name: string) => void;
  onSetActiveHero: (index: number) => void;
  onCommuneHeroScroll: (name: string) => void;
  onClaimQuestReward: (questNum: 1 | 2) => void;
  onCheatResources?: () => void;
  activeUpgrade?: BuildingUpgrade | null;
  // Dynamic Troop Training parameters
  units: UnitType[];
  trainingQueue: any[];
  troops: TroopState;
  onStartTraining: (unitId: string, count: number) => void;
  onCancelTraining: (jobId: string) => void;
  onInstantComplete?: (jobId: string) => void;
  onEnterCrystalVault?: () => void;
}

const IconMap: { [key: string]: React.ComponentType<any> } = {
  Cherry,
  Trees,
  Dumbbell,
  Hammer,
  Sparkles,
  ShieldAlert,
};

const DIAGNOSTIC_BUILDING_IDS = [
  'castle',
  'warehouse',
  'academy',
  'farm',
  'lumber_mill',
  'quarry',
  'iron_mine',
  'shrine',
  'barracks',
  'hospital',
  'sanctuary',
  'embassy',
  'infantry_barracks',
  'marksmen_camp',
  'cavalry_stable',
  'watchtower',
  'trading_post',
  'hall_of_heroes'
];

export default function CityTab({ 
  buildings, 
  resources, 
  storedResources,
  castleLevel,
  warehouseLevel,
  research,
  setResearch,
  setResources,
  addLog,
  heroes,
  heroTickets,
  quests,
  currentHeroIndex,
  onUpgradeBuilding,
  onGatherAll,
  onUpgradeCastle,
  onUpgradeWarehouse,
  onUpgradeResearch,
  onDrawHero,
  onLevelUpHero,
  onSetActiveHero,
  onCommuneHeroScroll,
  onClaimQuestReward,
  onCheatResources,
  activeUpgrade,
  units,
  trainingQueue,
  troops,
  onStartTraining,
  onCancelTraining,
  onInstantComplete,
  onEnterCrystalVault
}: CityTabProps) {
  
  // Overlay modal state trackers
  const [activeModal, setActiveModal] = useState<'castle' | 'warehouse' | 'tavern' | 'academy' | string | null>(null);
  const [activeResearchTab, setActiveResearchTab] = useState<'academy' | 'economy' | 'military' | 'development' | 'alliance' | 'hero'>('academy');
  const [isAlmanacOpen, setIsAlmanacOpen] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const [selectedBatchSize, setSelectedBatchSize] = useState<{ [key: string]: number }>({
    recruit: 10,
    archer: 10,
    knight: 5,
    paladin: 1,
  });

  const getBuildingLevelByNameOrId = (name: string): number => {
    const lowercase = name.toLowerCase();
    if (lowercase.includes('citadel') || lowercase.includes('keep') || lowercase.includes('castle')) {
      return castleLevel;
    }
    if (lowercase.includes('warehouse') || lowercase.includes('vault')) {
      return warehouseLevel;
    }
    if (lowercase.includes('research') || lowercase.includes('academy') || lowercase.includes('science')) {
      return research.research_hall_level;
    }
    const found = buildings.find(b => {
      const bName = b.name.toLowerCase();
      const bId = b.id.toLowerCase();
      return (
        lowercase.includes(bId) || 
        bId.includes(lowercase) ||
        lowercase.includes(bName) || 
        bName.includes(lowercase)
      );
    });
    return found ? found.level : 0;
  };

  const checkDiagPrerequisites = (prereqs: string[]): { satisfied: boolean; details: { name: string; req: number; current: number; met: boolean }[] } => {
    const details = prereqs.map(p => {
      const match = p.match(/Lvl\s+(\d+)/i);
      const reqLvl = match ? parseInt(match[1]) : 1;
      const namePart = p.replace(/Lvl\s+\d+/i, '').trim();
      const currentLvl = getBuildingLevelByNameOrId(namePart);
      return {
        name: namePart,
        req: reqLvl,
        current: currentLvl,
        met: currentLvl >= reqLvl
      };
    });
    const satisfied = details.every(d => d.met);
    return { satisfied, details };
  };

  const getPlayerCurrentLevel = (id: string): number => {
    if (id === 'castle') return castleLevel;
    if (id === 'warehouse') return warehouseLevel;
    if (id === 'academy') return research.research_hall_level;
    const b = buildings.find(item => item.id === id);
    return b ? b.level : 0;
  };

  const getBuildingsTotalPower = (): number => {
    let powerSum = 0;
    if (castleLevel > 0) {
      powerSum += BUILDING_DATABASE['castle']?.levels[castleLevel]?.powerGained || 0;
    }
    if (warehouseLevel > 0) {
      powerSum += BUILDING_DATABASE['warehouse']?.levels[warehouseLevel]?.powerGained || 0;
    }
    if (research.research_hall_level > 0) {
      powerSum += BUILDING_DATABASE['academy']?.levels[research.research_hall_level]?.powerGained || 0;
    }
    buildings.forEach(b => {
      if (b.level > 0) {
        powerSum += BUILDING_DATABASE[b.id]?.levels[b.level]?.powerGained || 0;
      }
    });
    return powerSum;
  };

  const handleDiagUpgrade = (id: string) => {
    if (id === 'castle') {
      onUpgradeCastle();
    } else if (id === 'warehouse') {
      onUpgradeWarehouse();
    } else if (id === 'academy') {
      onUpgradeResearch('hall');
    } else {
      onUpgradeBuilding(id);
    }
  };
  
  // High usability map setting toggles
  const [filterMode, setFilterMode] = useState<'all' | 'collectable' | 'upgradable'>('all');
  const [showRoads, setShowRoads] = useState<boolean>(true);
  const [showDetails, setShowDetails] = useState<boolean>(true);

  // Map Grabbing & Dragging Engine state
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const canAfford = (cost: ResourceCost): boolean => {
    return (Object.keys(cost) as Array<keyof ResourceCost>).every((res) => {
      const needed = cost[res] || 0;
      const current = resources[res] || 0;
      return current >= needed;
    });
  };

  const currentWarehouseCap = getWarehouseProtectionLimit(warehouseLevel);

  // Helper calculation for custom compounded building cost
  const getCompoundedCost = (building: Building): ResourceCost => {
    const nextLvl = building.level + 1;
    const data = BUILDING_DATABASE[building.id]?.levels[nextLvl];
    return data ? data.costs : {};
  };

  const getUpgradeCostCastle = (): ResourceCost => {
    const nextLvl = castleLevel + 1;
    const data = BUILDING_DATABASE['castle']?.levels[nextLvl];
    return data ? data.costs : {};
  };

  const getUpgradeCostWarehouse = (): ResourceCost => {
    const nextLvl = warehouseLevel + 1;
    const data = BUILDING_DATABASE['warehouse']?.levels[nextLvl];
    return data ? data.costs : {};
  };

  const getUpgradeCostResearchHall = (): ResourceCost => {
    const nextLvl = research.research_hall_level + 1;
    const data = BUILDING_DATABASE['academy']?.levels[nextLvl];
    return data ? data.costs : {};
  };

  const getUpgradeCostEconomyResearch = (): ResourceCost => {
    return {
      food: (research.economy_research_level + 1) * 400,
      wood: (research.economy_research_level + 1) * 400,
    };
  };

  const getUpgradeCostMilitaryResearch = (): ResourceCost => {
    return {
      stone: (research.military_research_level + 1) * 500,
      iron: (research.military_research_level + 1) * 500,
    };
  };

  const hasPendingStorage = storedResources.food > 0 || storedResources.wood > 0 || storedResources.stone > 0 || storedResources.iron > 0;

  // Handle Drag / Grabbing Physics
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    // Check if the user is clicking an interactive card or button to avoid stealing focused events
    if ((e.target as HTMLElement).closest('.clickable-building-card') || (e.target as HTMLElement).closest('button')) {
      return;
    }
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setStartY(e.pageY - containerRef.current.offsetTop);
    setScrollLeft(containerRef.current.scrollLeft);
    setScrollTop(containerRef.current.scrollTop);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const y = e.pageY - containerRef.current.offsetTop;
    const walkX = (x - startX) * 1.5; // Drag speed modifier
    const walkY = (y - startY) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walkX;
    containerRef.current.scrollTop = scrollTop - walkY;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Center the view on Citadel Keep
  const centerOnCitadel = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const containerHeight = containerRef.current.clientHeight;
      // Dimensions of the 2D canvas are 1120px by 720px
      containerRef.current.scrollLeft = (1120 - containerWidth) / 2;
      containerRef.current.scrollTop = (720 - containerHeight) / 2;
    }
  };

  // Run on mount to center the view
  useEffect(() => {
    setTimeout(() => {
      centerOnCitadel();
    }, 100);
  }, []);

  // Structural coordinate map arrays loaded dynamically from layout configuration file
  const allMasterStructures = CITY_LAYOUTS.map((layout) => {
    let level = 0;
    let bName = layout.name;
    let subtext = '';
    let isAffordable = false;
    let pendingGather = 0;
    let gatherIcon: string | undefined = undefined;

    if (layout.id === 'castle') {
      level = castleLevel;
      subtext = 'Supreme Sovereign Command';
      isAffordable = canAfford(getUpgradeCostCastle());
    } else if (layout.id === 'warehouse') {
      level = warehouseLevel;
      subtext = 'Resource Protection Vault';
      isAffordable = canAfford(getUpgradeCostWarehouse());
    } else if (layout.id === 'academy') {
      level = research.research_hall_level;
      subtext = 'Technical Science Hall';
      isAffordable = canAfford(getUpgradeCostResearchHall());
    } else {
      const b = buildings.find(item => item.id === layout.id);
      if (b) {
        level = b.level;
        bName = b.name;
        subtext = b.description.length > 50 ? b.description.slice(0, 47) + '...' : b.description;
        isAffordable = canAfford(getCompoundedCost(b));
        
        // Setup pending gather status
        if (b.id === 'farm') {
          pendingGather = storedResources.food;
          gatherIcon = '🌾';
        } else if (b.id === 'lumber_mill') {
          pendingGather = storedResources.wood;
          gatherIcon = '🪵';
        } else if (b.id === 'quarry') {
          pendingGather = storedResources.stone;
          gatherIcon = '🪨';
        } else if (b.id === 'iron_mine') {
          pendingGather = storedResources.iron;
          gatherIcon = '🪙';
        }
      }
    }

    return {
      id: layout.id,
      name: bName,
      subtext,
      level,
      graphic: layout.imagePath,
      tag: `Lvl ${level}`,
      left: `${layout.x}px`,
      top: `${layout.y}px`,
      width: `${layout.width}px`,
      height: `${layout.height}px`,
      zIndex: layout.zIndex || 'z-20',
      badgeColor: 
        layout.id === 'castle' ? 'bg-amber-500 text-black border-amber-300' :
        layout.id === 'academy' ? 'bg-blue-950/90 text-blue-400 border-blue-900' :
        ['farm', 'lumber_mill', 'quarry', 'iron_mine'].includes(layout.id) ? 'bg-emerald-950/90 text-emerald-400 border-emerald-900' :
        ['infantry_barracks', 'marksmen_camp', 'cavalry_stable'].includes(layout.id) ? 'bg-rose-950/90 text-rose-455 border-rose-900' :
        'bg-zinc-950 text-zinc-300 border-zinc-800',
      glowColor: 'group-hover:border-amber-400 group-hover:shadow-amber-500/30' + (layout.id === 'castle' ? ' shadow-amber-950/45' : ''),
      isAffordable,
      pendingGather,
      gatherIcon,
    };
  });

  // Filter logic depending on active strategic HUD toggle
  const filteredStructures = allMasterStructures.filter((struct) => {
    if (filterMode === 'collectable') {
      return struct.pendingGather > 0;
    }
    if (filterMode === 'upgradable') {
      return struct.isAffordable;
    }
    return true;
  });

  return (
    <div id="city-tab-view" className="flex-1 flex flex-col h-full bg-[#030602] lg:h-[750px] overflow-hidden select-none text-white relative">
      
      {/* Builders Active Queue HUD */}
      {activeUpgrade && (() => {
        const catalog = BUILDING_DATABASE[activeUpgrade.buildingId];
        const bName = catalog?.name || activeUpgrade.buildingId;
        const secondsLeft = Math.max(0, Math.round((activeUpgrade.finishTime - Date.now()) / 1000));
        return (
          <div className="absolute top-14 left-1/2 transform -translate-x-1/2 z-30 pointer-events-auto bg-black/90 border border-amber-500/50 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-[0_0_20px_rgba(245,158,11,0.15)] backdrop-blur-md max-w-sm w-max animate-pulse">
            <Hammer className="w-4 h-4 text-amber-500 animate-bounce" />
            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-amber-400 leading-none">Construction Underway</span>
              <span className="text-[11px] font-sans font-bold text-zinc-200 mt-1">Upgrading {bName} ...</span>
            </div>
            <div className="bg-amber-950/40 px-2 py-1 rounded-lg border border-amber-500/20 text-center font-mono font-black text-xs text-amber-400 min-w-[50px]">
              {secondsLeft}s
            </div>
          </div>
        );
      })()}

      {/* 1. Sleek Floating Tactical HUD Control overlays (instead of bulky rigid block headers) */}
      <div className="absolute top-2 left-3 right-3 flex items-center justify-between pointer-events-none z-30 gap-2">
        
        {/* Kingdom Level badge widget (transparent glassy, floating) */}
        <div className="bg-black/85 border border-amber-500/35 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-2 pointer-events-auto shadow-2xl">
          <div className="w-5 h-5 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center font-serif font-black text-black text-[10px]">
            {castleLevel}
          </div>
          <div className="flex flex-col text-left leading-none">
            <span className="text-[9px] font-serif font-extrabold tracking-wide text-amber-400 uppercase">Sovereign Domain</span>
            <span className="text-[7.5px] font-mono text-zinc-400 font-bold">Vault: {formatNum(currentWarehouseCap)}</span>
          </div>
        </div>

        {/* Tactical filter state controls (transparent glass, floating) */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Quick Filter Selection */}
          <div className="bg-black/90 border border-zinc-800/80 p-0.5 rounded-xl flex items-center font-mono text-[8.5px] text-zinc-400 shadow-2xl">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2 py-1 rounded-lg transition-colors ${filterMode === 'all' ? 'bg-[#1a2e1d] text-emerald-400 font-bold border border-emerald-500/20' : 'hover:text-white'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterMode('collectable')}
              className={`px-2 py-1 rounded-lg transition-colors flex items-center gap-0.5 ${filterMode === 'collectable' ? 'bg-[#1a2e1d] text-emerald-400 font-bold border border-emerald-500/20' : 'hover:text-white'}`}
            >
              Collect
            </button>
            <button
              onClick={() => setFilterMode('upgradable')}
              className={`px-2 py-1 rounded-lg transition-colors flex items-center gap-0.5 ${filterMode === 'upgradable' ? 'bg-[#2a2415] text-amber-400 font-bold border border-amber-500/20' : 'hover:text-white'}`}
            >
              Upgrades
            </button>
          </div>

          <button
            onClick={centerOnCitadel}
            className="p-1.5 bg-black/95 hover:bg-zinc-900 text-amber-500/90 rounded-xl border border-zinc-800/80 transition-colors shadow-2xl pointer-events-auto active:scale-95"
            title="Center Camera on Citadel Keep"
          >
            <RotateCcw className="w-3 h-3" />
          </button>

          <button
            onClick={() => setIsAlmanacOpen(true)}
            className="p-1.5 bg-black/95 hover:bg-zinc-900 text-amber-400 font-mono text-[9px] font-black uppercase tracking-wider rounded-xl border border-zinc-800/80 transition-colors shadow-2xl pointer-events-auto active:scale-95 flex items-center gap-1"
            title="Open levels 1-40 Building Database Almanac"
          >
            <BookOpen className="w-3 text-amber-400" />
            <span>Almanac</span>
          </button>

          <button
            onClick={() => setShowDiagnostics(prev => !prev)}
            className={`p-1.5 ${showDiagnostics ? 'bg-amber-500 text-black border-amber-400' : 'bg-black/95 hover:bg-zinc-900 text-zinc-300'} font-mono text-[9px] font-black uppercase tracking-wider rounded-xl border border-zinc-800/80 transition-all shadow-2xl pointer-events-auto active:scale-95 flex items-center gap-1`}
            title="Toggle the Upgrade Diagnostics Panel"
          >
            <Sliders className="w-3 h-3 text-amber-400" />
            <span>Diagnostics</span>
          </button>

          {/* GATHER RESOURCE BUTTON */}
          <button
            onClick={onGatherAll}
            className={`px-2.5 py-1.5 text-[9px] font-mono font-black uppercase rounded-xl cursor-pointer transition-all duration-150 flex items-center gap-1 shadow-2xl ${
              hasPendingStorage 
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-black font-extrabold active:scale-95 border border-emerald-300 animate-pulse' 
                : 'bg-black/90 text-zinc-650 border border-zinc-850 cursor-not-allowed'
            }`}
          >
            <Sparkle className={`w-2.5 h-2.5 fill-current ${hasPendingStorage ? 'animate-bounce text-yellow-300' : ''}`} />
            Gather
          </button>
        </div>
      </div>

      {/* 2. Interactive scrollable pseudo-isometric map canvas - No custom scrollbars visible! */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className="flex-1 w-full overflow-auto p-4 no-scrollbar bg-[#091508] flex items-center justify-center relative cursor-grab active:cursor-grabbing select-none"
      >
        <div className="absolute top-16 left-4 bg-black/90 border border-emerald-900/30 px-2.5 py-1 rounded-full font-mono text-[8px] tracking-wide text-zinc-400 flex items-center gap-1 z-10 pointer-events-none shadow-xl">
          <Layers className="w-2.5 h-2.5 text-emerald-400" />
          <span>↔️ Drag the grassy viewport canvas to explore domains</span>
        </div>

        {/* 2D Map Canvas Plane centered inside viewport */}
        <div 
          id="medieval-city-canvas" 
          className="w-[1120px] h-[720px] shadow-[0_20px_50px_rgba(0,0,0,0.9)] rounded-[2.5rem] relative overflow-hidden border-2 border-emerald-950 shrink-0 select-none"
          style={{
            backgroundImage: `
              radial-gradient(circle at center, transparent 35%, rgba(3,7,5,0.94) 100%),
              repeating-conic-gradient(from 0deg, #122815 0deg 90deg, #18331b 90deg 180deg)
            `,
            backgroundSize: '100% 100%, 56px 56px'
          }}
        >
          {/* 1. Background image layer */}
          <div 
            id="background-image-layer" 
            className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
          >
            {/* Base Terrain Color Field - Grassy dark kingdom canvas */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0c1a11] via-[#08120b] to-[#030704]" />
            
            {/* Gilded Cartographer Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(245,158,11,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(245,158,11,0.015)_1px,transparent_1px)] bg-[size:56px_56px] opacity-40" />
            
            {/* Atmospheric radial center illumination (Sun glade) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.07)_0%,transparent_70%)]" />
          </div>

          {/* 2. Roads layer (renders below buildings) */}
          <div 
            id="roads-layer" 
            className="absolute inset-0 pointer-events-none z-10"
          >
            {showRoads && (
              <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="roadPatternGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#451a03" stopOpacity="0.45" />
                    <stop offset="50%" stopColor="#78350f" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#451a03" stopOpacity="0.45" />
                  </linearGradient>
                </defs>

                {/* Outer pavement dust outline - Broad paths connecting high-traffic structures */}
                <g stroke="rgba(245,158,11,0.05)" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 560 155 L 560 270 M 325 205 L 560 155 M 795 205 L 560 155 M 185 245 L 325 205 M 935 245 L 795 205 M 247 367 L 440 360 M 872 367 L 680 360 M 367 467 L 560 450 M 752 467 L 560 450 M 185 505 L 247 367 M 935 505 L 872 367 M 165 605 L 185 505 M 405 605 L 367 467 M 715 605 L 752 467 M 955 605 L 935 505" />
                </g>

                {/* Central Cobblestone paved paths */}
                <g stroke="url(#roadPatternGrad)" strokeWidth="4" fill="none" strokeDasharray="6 8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 560 155 L 560 270 M 325 205 L 560 155 M 795 205 L 560 155 M 185 245 L 325 205 M 935 245 L 795 205 M 247 367 L 440 360 M 872 367 L 680 360 M 367 467 L 560 450 M 752 467 L 560 450 M 185 505 L 247 367 M 935 505 L 872 367 M 165 605 L 185 505 M 405 605 L 367 467 M 715 605 L 752 467 M 955 605 L 935 505" />
                </g>

                {/* Inner Gilded Core sparkles representing high-energy pathways */}
                <g stroke="rgba(245,158,11,0.25)" strokeWidth="1.5" fill="none" strokeDasharray="2 15" strokeLinecap="round">
                  <path d="M 560 155 L 560 270 M 325 205 L 560 155 M 795 205 L 560 155 M 185 245 L 325 205 M 935 245 L 795 205 M 247 367 L 440 360 M 872 367 L 680 360 M 367 467 L 560 450 M 752 467 L 560 450 M 185 505 L 247 367 M 935 505 L 872 367 M 165 605 L 185 505 M 405 605 L 367 467 M 715 605 L 752 467 M 955 605 L 935 505" />
                </g>
              </svg>
            )}
          </div>

          {/* 3. Decoration layer (rivers, waterfalls, trees, statues, flowers, banners) */}
          <div 
            id="decoration-layer" 
            className="absolute inset-0 pointer-events-none z-20 overflow-hidden"
          >
            {/* Flowing background river (Pseudo-isometric flow) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#102e21" stopOpacity="0.85" />
                  <stop offset="50%" stopColor="#1b4d3e" stopOpacity="0.75" />
                  <stop offset="100%" stopColor="#0a2016" stopOpacity="0.85" />
                </linearGradient>
              </defs>
              {/* Main River curving down to bottom left */}
              <path 
                d="M 560 0 C 500 150, 420 220, 360 380 Q 300 500, 0 540" 
                stroke="url(#riverGrad)" 
                strokeWidth="28" 
                fill="none" 
                strokeLinecap="round" 
                className="opacity-95"
              />
              {/* Inner stream lines of flowing water waves (STATIC support for flow) */}
              <path 
                d="M 560 4 C 500 154, 420 224, 360 384 Q 300 504, 0 544" 
                stroke="rgba(52,211,153,0.25)" 
                strokeWidth="3.5" 
                fill="none" 
                strokeDasharray="16 24" 
                strokeLinecap="round"
              />
            </svg>

            {/* Rendering all items in CITY_DECORATIONS */}
            {CITY_DECORATIONS.map((decor) => (
              <div
                key={decor.id}
                id={`decor-${decor.id}`}
                className={`absolute pointer-events-none flex flex-col items-center justify-center select-none group ${decor.zIndex || 'z-10'} ${decor.extraStyles || ''}`}
                style={{
                  left: decor.x,
                  top: decor.y,
                  width: decor.width,
                  height: decor.height,
                }}
                title={`${decor.name}: ${decor.description || ''}`}
              >
                <div className="relative w-full h-full flex items-center justify-center rounded-xl overflow-hidden shadow-emerald-950/20 shadow-md">
                  {decor.type === 'waterfall' && (
                    <div className="absolute inset-0 bg-cyan-950/20 border border-cyan-500/20 flex flex-col items-center justify-end p-1">
                      <span className="text-3xl filter drop-shadow pb-1">{decor.emojiFallback}</span>
                      <span className="text-[7.5px] uppercase font-mono text-cyan-400 font-bold bg-black/50 px-1 rounded truncate max-w-full">{decor.name}</span>
                    </div>
                  )}

                  {decor.type === 'river' && (
                    <div className="absolute inset-0 bg-emerald-950/20 flex items-center justify-center p-1 rounded-full border border-emerald-500/10">
                      <span className="text-xl filter drop-shadow">{decor.emojiFallback}</span>
                    </div>
                  )}

                  {decor.type === 'tree' && (
                    <div className="relative flex flex-col items-center">
                      <span className="text-3xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">{decor.emojiFallback}</span>
                    </div>
                  )}

                  {decor.type === 'statue' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900/60 rounded-xl border border-zinc-800/60 p-1 shadow-lg">
                      <span className="text-2xl filter drop-shadow">{decor.emojiFallback}</span>
                      <span className="text-[6.5px] uppercase font-mono text-zinc-400 text-center font-bold mt-0.5 max-w-full truncate">{decor.name}</span>
                    </div>
                  )}

                  {(decor.type === 'flower' || decor.type === 'flowers') && (
                    <div className="relative flex items-center justify-center text-center">
                      <span className="text-lg filter drop-shadow">{decor.emojiFallback}</span>
                    </div>
                  )}

                  {decor.type === 'banner' && (
                    <div className="flex flex-col items-center justify-start h-full">
                      <div className="h-7 w-2 bg-zinc-800 rounded-t-full border border-zinc-700 flex items-center justify-center">
                        <span className="text-[10px] transform -translate-y-1">{decor.emojiFallback}</span>
                      </div>
                      <div className="w-0.5 h-full bg-zinc-700/80" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 4. Building layer (contains all interactive buildings level widgets) */}
          <div 
            id="building-layer" 
            className="absolute inset-0 z-30 pointer-events-none"
          >
            <AnimatePresence>
              {filteredStructures.map((struct) => {
                const isSelected = activeModal === struct.id;
                
                return (
                  <div 
                    key={struct.id}
                    id={`building-slot-${struct.id}`}
                    className={`absolute clickable-building-card flex flex-col items-center group cursor-pointer select-none transition-all duration-300 hover:-translate-y-2.5 pointer-events-auto ${struct.zIndex}`}
                    style={{
                      left: struct.left,
                      top: struct.top,
                      width: struct.width,
                    }}
                    onClick={() => setActiveModal(struct.id)}
                  >
                    <div className="relative w-full text-center flex flex-col items-center justify-center">
                      
                      {/* ISOMETRIC SPRITE PLATFORM SLOT - Styled using the layout's width and height */}
                      <div 
                        className={`relative w-full rounded-2xl border-2 transition-all duration-300 p-0.5 bg-gradient-to-b from-[#111622] to-[#040812] shadow-[0_12px_28px_rgba(0,0,0,0.85)] overflow-hidden hover:scale-[1.05] ${
                          isSelected 
                            ? 'border-amber-400 shadow-[0_0_24px_rgba(245,158,11,0.6)] ring-2 ring-amber-500/30' 
                            : 'border-zinc-800/80 hover:border-amber-500/40'
                        }`}
                        style={{ height: struct.height }}
                      >
                        {/* Dark atmospheric radial mask overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none z-10" />

                        {/* Display artwork strictly from the configuration */}
                        <img 
                          src={struct.graphic} 
                          alt={struct.name} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover rounded-xl pointer-events-none transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      {/* Level Ribbon Badge inside the card */}
                      <div className="absolute top-1 right-1 sm:right-2 z-25">
                        <div className={`px-2 py-0.5 rounded-md shadow-lg border font-mono font-black text-[8px] flex items-center gap-0.5 uppercase tracking-wide opacity-95 ${struct.badgeColor}`}>
                          <span>Lvl {struct.level}</span>
                        </div>
                      </div>

                      {/* Floating Gatherable bubble representing raw yield ready */}
                      {struct.pendingGather > 0 && (
                        <div 
                          onClick={(e) => {
                            e.stopPropagation(); // Avoid modal popup
                            onGatherAll();
                          }}
                          className="absolute -top-6 left-1/2 -translate-x-1/2 z-25 bg-emerald-400 text-black px-2 py-0.5 rounded-full font-mono text-[9px] font-black animate-bounce shadow-xl flex items-center gap-1 cursor-pointer border border-emerald-250"
                          title="Collect raw yields immediately!"
                        >
                          <span>{struct.gatherIcon}</span>
                          <span>{formatNum(struct.pendingGather)}</span>
                        </div>
                      )}

                      {/* Upgrade Alert Arrow blinking if user can afford upgrades */}
                      {struct.isAffordable && (
                        <div className="absolute -top-2 left-2 z-20 flex items-center justify-center">
                          <span className="flex h-3 w-3 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border border-black shadow flex items-center justify-center font-mono text-[7px] text-black font-black">
                              ▲
                            </span>
                          </span>
                        </div>
                      )}

                    </div>

                    {/* Clean Visual Sprite Slot Floating label beneath the pedestal */}
                    {showDetails && (
                      <div className="mt-2 text-center pointer-events-none">
                        <h4 className="text-[10px] font-serif font-black tracking-widest text-amber-200 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,1)] group-hover:text-amber-400 transition-colors">
                          {struct.name}
                        </h4>
                        <span className="text-[8px] font-mono text-zinc-400 block tracking-widest uppercase drop-shadow-[0_1.5px_2.5px_rgba(0,0,0,1)] mt-0.5 font-bold">
                          {struct.id === 'castle' ? 'citadel keep' : struct.subtext}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </AnimatePresence>
          </div>

        </div>
      </div>

      {/* 3. Immersive minimal tactical objectives status bottom HUD */}
      <div className="px-4 py-2.5 bg-[#090b10] border-t border-zinc-900/85 shrink-0 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 gap-2.5 z-10 shadow-inner">
        <div className="flex items-center gap-2 font-mono text-[10px]">
          <Award className="w-4 h-4 text-amber-500 animate-bounce" />
          <span className="text-zinc-400 font-extrabold uppercase tracking-widest text-[9.5px]">Sovereign Target:</span>
          <span className="text-zinc-300">Keep Level <span className="text-amber-400 font-black">Lvl {castleLevel}</span> / {quests.quest1_target}</span>
          {castleLevel >= quests.quest1_target ? (
            <span className="text-emerald-400 font-bold bg-[#142318] px-1.5 py-0.5 rounded-md border border-emerald-900/30 uppercase text-[8px]">Completed</span>
          ) : (
            <span className="text-zinc-600 bg-zinc-950 px-1.5 py-0.5 rounded-md uppercase text-[8px]">Active</span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-500">
          <Info className="w-3.5 h-3.5 text-zinc-650" />
          <span>Click on circular platforms to upgrade, summon, or research.</span>
        </div>
      </div>

      {/* ================= ROYAL OVERLAY STATS INTERACTIVE MODALS ================= */}
      <AnimatePresence>
        {activeModal === 'academy' ? (
          <AcademyResearchScene
            research={research}
            setResearch={setResearch}
            resources={resources}
            setResources={setResources}
            addLog={addLog}
            onClose={() => setActiveModal(null)}
          />
        ) : activeModal && (
          <motion.div 
            id="city-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-[2.5px] z-50 flex items-end justify-center cursor-pointer"
            onClick={() => setActiveModal(null)}
          >
            {/* Modal Body */}
            <motion.div 
              id="city-structure-modal"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 24, stiffness: 210 }}
              className="bg-[#0b0c10] border-t-4 border-x border-amber-500/80 p-5 rounded-t-[2.5rem] w-full max-w-md flex flex-col gap-4 shadow-[0_-12px_40px_rgba(0,0,0,0.95)] relative max-h-[85vh] overflow-y-auto no-scrollbar pb-10 cursor-default"
              onClick={(e) => e.stopPropagation()} // Prevent bubble close
            >
              {/* Premium Drag Pill Handle */}
              <div 
                className="w-12 h-1 bg-zinc-805/90 hover:bg-amber-500/50 rounded-full mx-auto mb-2 cursor-pointer transition-colors" 
                onClick={() => setActiveModal(null)}
              />

              {/* Close Button X */}
              <button 
                onClick={() => setActiveModal(null)}
                className="absolute top-4 right-5 p-1 px-2.5 rounded-full bg-zinc-950 border border-zinc-850 hover:border-amber-500/50 text-zinc-400 hover:text-amber-400 transition-colors font-mono text-[9px] uppercase tracking-wider cursor-pointer"
              >
                ✕ Close
              </button>

              {/* ----------------- UNIFIED LAYOUT-DRIVEN BUILDING DETAILS MODAL ----------------- */}
              {(() => {
                const layout = CITY_LAYOUTS.find(l => l.id === activeModal);
                if (!layout) return <div className="text-center py-4 font-mono text-xs text-rose-455">Structure not found.</div>;

                let currentLevel = 0;
                let bName = layout.name;
                let description = '';
                let costs: ResourceCost = {};
                let rateString = '';
                let handleUpgrade = () => {};

                if (activeModal === 'castle') {
                  currentLevel = castleLevel;
                  bName = "Citadel";
                  description = 'High Sovereign headquarters ruling over Crownspire. Sets maximum level caps and scopes of available match chapters.';
                  costs = getUpgradeCostCastle();
                  handleUpgrade = onUpgradeCastle;
                } else if (activeModal === 'warehouse') {
                  currentLevel = warehouseLevel;
                  bName = "Warehouse";
                  description = 'Primary secure warehouse storage safeguarding treasury resources from maximum capacity overspill boundaries.';
                  costs = getUpgradeCostWarehouse();
                  handleUpgrade = onUpgradeWarehouse;
                } else if (activeModal === 'academy') {
                  currentLevel = research.research_hall_level;
                  bName = "Research Hall";
                  description = 'The scholarly archives and laboratories where science tech research is funded to gain global yield multipliers.';
                  costs = getUpgradeCostResearchHall();
                  handleUpgrade = () => onUpgradeResearch('hall');
                } else {
                  const b = buildings.find(item => item.id === activeModal);
                  if (b) {
                    currentLevel = b.level;
                    bName = b.name;
                    description = b.description;
                    costs = getCompoundedCost(b);
                    handleUpgrade = () => onUpgradeBuilding(b.id);
                    
                    // Setup rates
                    if (b.id === 'farm') {
                      rateString = `+${(b.level * 2.0 * Math.pow(1.35, Math.max(0, b.level - 1))).toFixed(1)}/s Food`;
                    } else if (b.id === 'lumber_mill') {
                      rateString = `+${(b.level * 1.5 * Math.pow(1.35, Math.max(0, b.level - 1))).toFixed(1)}/s Wood`;
                    } else if (b.id === 'quarry') {
                      rateString = `+${(b.level * 1.2 * Math.pow(1.4, Math.max(0, b.level - 1))).toFixed(1)}/s Stone`;
                    } else if (b.id === 'iron_mine') {
                      rateString = `+${(b.level * 0.6 * Math.pow(1.4, Math.max(0, b.level - 1))).toFixed(1)}/s Iron`;
                    } else if (b.id === 'shrine') {
                      rateString = `+${(b.level * 0.2 * Math.pow(1.5, Math.max(0, b.level - 1))).toFixed(2)}/s Valor`;
                    } else if (b.id === 'barracks') {
                      rateString = `Reduces recruits training times (-10%/level)`;
                    }
                  } else {
                    // Fallback descriptor for future additions
                    currentLevel = 0;
                    bName = layout.name;
                    description = `Primary structural unit inside the kingdom of Crownspire. Reaching higher tiers unlocks extra passive capabilities.`;
                    costs = { food: 50, wood: 50 };
                    handleUpgrade = () => {};
                  }
                }

                const isUpgradingThis = activeUpgrade && activeUpgrade.buildingId === activeModal;
                const secondsLeft = isUpgradingThis ? Math.max(0, Math.round((activeUpgrade.finishTime - Date.now()) / 1000)) : 0;
                const affordable = canAfford(costs);

                return (
                  <>
                    <div className="text-center">
                      {/* Image Frame featuring layout image path display */}
                      <div className="relative w-28 h-28 mx-auto rounded-3xl border border-zinc-800/80 mb-3 bg-[#0c0f16] flex items-center justify-center overflow-hidden shadow-md">
                        <img 
                          src={layout.imagePath} 
                          alt={bName} 
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover rounded-3xl pointer-events-none"
                        />
                      </div>
                      <h3 className="font-serif font-black text-white text-lg uppercase tracking-wider text-amber-500">{bName}</h3>
                      <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-3 py-1 rounded-full border border-zinc-900 inline-block mt-1 font-bold">
                        REGAL LEVEL: Lvl {currentLevel}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-400 text-center leading-relaxed italic px-2">
                      "{description}"
                    </p>

                    {/* Active Upgrade Timer display */}
                    {isUpgradingThis && (
                      <div className="bg-[#1c130c] border border-amber-600/30 p-3 rounded-2xl text-center font-mono text-[11px] text-amber-500 animate-pulse my-1">
                        🏗️ Upgrade under construction: <span className="font-bold text-amber-400">{secondsLeft} seconds</span> remaining
                      </div>
                    )}

                    {rateString && (
                      <div className="bg-[#051c0d]/35 border border-emerald-950/50 p-2.5 rounded-xl text-center font-mono text-[11px] text-emerald-400 mt-1">
                        ✨ Production stats: <span className="font-bold">{rateString}</span>
                      </div>
                    )}

                    {/* Pricing matrix block */}
                    <div className="space-y-1.5 p-3.5 bg-zinc-950/60 rounded-2xl border border-zinc-900/60">
                      <span className="text-[9.5px] uppercase font-mono text-zinc-500 block font-black tracking-wider">Required Tribute:</span>
                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-400">
                        {Object.keys(costs).length === 0 ? (
                          <div className="col-span-2 text-center text-zinc-650 py-1 font-semibold">Maximum level reached.</div>
                        ) : (
                          Object.keys(costs).map((res) => {
                            const amt = costs[res as keyof ResourceCost] || 0;
                            const hasPlenty = (resources[res as keyof Resources] || 0) >= amt;
                            return (
                              <div key={res} className="flex justify-between items-center bg-black/45 p-1 px-2 rounded-lg border border-zinc-900">
                                <span className={hasPlenty ? 'text-zinc-550' : 'text-rose-450'}>{res.toUpperCase()}</span>
                                <span className={hasPlenty ? 'text-zinc-300' : 'text-rose-400 font-bold'}>{formatNum(amt)}</span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                    {/* Upgrade action button */}
                    <button
                      onClick={() => {
                        handleUpgrade();
                        setActiveModal(null);
                      }}
                      disabled={!!activeUpgrade || !affordable || Object.keys(costs).length === 0}
                      className={`w-full py-4 rounded-full font-serif text-xs font-black uppercase tracking-widest transition-all duration-200 border ${
                        !activeUpgrade && affordable && Object.keys(costs).length > 0
                          ? 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 hover:shadow-[0_0_24px_rgba(245,158,11,0.55)] text-black border-yellow-350 active:scale-95 cursor-pointer font-extrabold'
                          : 'bg-zinc-950 border-zinc-900 text-zinc-650 cursor-not-allowed font-medium'
                      }`}
                    >
                      {activeUpgrade ? (isUpgradingThis ? 'Under Construction...' : 'Queue Full: Builders Busy') : (Object.keys(costs).length === 0 ? 'Max Level' : `Upgrade to Level ${currentLevel + 1}`)}
                    </button>

                    {activeModal === 'crystal_vault' && (
                      <button
                        onClick={() => {
                          if (currentLevel >= 1) {
                            onEnterCrystalVault?.();
                            setActiveModal(null);
                          }
                        }}
                        disabled={currentLevel < 1}
                        className={`w-full mt-3 py-4 rounded-full font-serif text-xs font-black uppercase tracking-widest transition-all duration-200 border ${
                          currentLevel >= 1
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 hover:shadow-[0_0_24px_rgba(147,51,234,0.55)] text-white border-purple-400 active:scale-95 cursor-pointer font-extrabold'
                            : 'bg-zinc-950 border-zinc-900 text-zinc-650 cursor-not-allowed font-medium'
                        }`}
                      >
                        {currentLevel >= 1 ? '🔮 ENTER CRYSTAL VAULT' : '🔒 REQUIRES VAULT LEVEL 1'}
                      </button>
                    )}
                  </>
                );
              })()}

              {/* Bypassed legacy modal conditions */}
              {false && activeModal === 'castle' && (
                <>
                  <div className="text-center">
                    <img 
                      src="https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&q=80&w=250" 
                      alt="Citadel Keep" 
                      referrerPolicy="no-referrer"
                      className="w-24 h-24 object-cover mx-auto rounded-3xl border border-amber-500/30 mb-2.5"
                    />
                    <h3 className="font-serif font-black text-white text-base uppercase tracking-wider text-amber-500">Citadel Keep Command</h3>
                    <span className="text-[10px] font-mono text-zinc-400 bg-[#1e1b4b]/50 px-2 py-0.5 rounded-full border border-indigo-900/50 inline-block mt-0.5">Primary Royal Headquarters</span>
                  </div>

                  <p className="text-[11.5px] text-zinc-400 text-center leading-relaxed italic px-2">
                    "Increases global command scope and validates territorial claims. Upgrading your Keep unlocks higher single-player Match-3 chapters."
                  </p>

                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-900 text-xs font-mono space-y-1 text-zinc-300">
                    <div className="flex justify-between border-b border-zinc-930 pb-1 text-[11px] font-bold">
                      <span className="text-zinc-400">CURRENT REGAL LEVEL:</span>
                      <span className="text-amber-400 font-serif font-black tracking-widest text-xs uppercase">Lvl {castleLevel}</span>
                    </div>
                    <div className="flex justify-between pt-1 text-[11px]">
                      <span>Match-3 Challenge Scope:</span>
                      <span className="text-emerald-400 font-extrabold tracking-wide">Chapter {castleLevel} Unlocked</span>
                    </div>
                  </div>

                  {/* Pricing cost matrix */}
                  <div className="space-y-1.5 p-3 mx-0.5 bg-zinc-900/60 rounded-xl border border-zinc-900">
                    <span className="text-[9.5px] uppercase font-mono text-zinc-500 block font-bold">Royal Expansion Tribute:</span>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-400">
                      {(() => {
                        const nextCost = getUpgradeCostCastle();
                        return [
                          { name: 'Food', key: 'food', value: nextCost.food || 0 },
                          { name: 'Wood', key: 'wood', value: nextCost.wood || 0 },
                          { name: 'Stone', key: 'stone', value: nextCost.stone || 0 },
                          { name: 'Iron', key: 'iron', value: nextCost.iron || 0 },
                          { name: 'Valor', key: 'valor', value: nextCost.valor || 0 }
                        ].filter(r => r.value > 0).map(r => {
                          const hasPlenty = (resources[r.key as keyof Resources] || 0) >= r.value;
                          return (
                            <div key={r.key} className="flex justify-between items-center bg-black/45 p-1 px-2 rounded border border-zinc-900">
                              <span className={hasPlenty ? 'text-zinc-500' : 'text-rose-400 font-bold'}>{r.name}</span>
                              <span className={hasPlenty ? 'text-zinc-300' : 'text-rose-400 font-bold'}>{formatNum(r.value)}</span>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onUpgradeCastle();
                      setActiveModal(null);
                    }}
                    disabled={!!activeUpgrade || !canAfford(getUpgradeCostCastle())}
                    className={`w-full py-3.5 rounded-full font-serif text-xs font-black uppercase tracking-widest transition-all duration-200 border ${
                      !activeUpgrade && canAfford(getUpgradeCostCastle())
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 text-black border-yellow-350 shadow-[0_0_20px_rgba(245,158,11,0.55)] animate-pulse active:scale-95 cursor-pointer'
                        : 'bg-zinc-900 border-zinc-850 text-zinc-650 cursor-not-allowed'
                    }`}
                  >
                    {activeUpgrade ? (activeUpgrade.buildingId === 'castle' ? 'Keep Upgrading...' : 'Queue Full: Builders Busy') : `Upgrade Keep to Level ${castleLevel + 1}`}
                  </button>
                </>
              )}


              {/* ----------------- SUB-VIEW: B. Warehouse Modal ----------------- */}
              {activeModal === 'warehouse' && (
                <>
                  <div className="text-center">
                    <img 
                      src="https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&q=80&w=250" 
                      alt="Vault Warehouse" 
                      referrerPolicy="no-referrer"
                      className="w-24 h-24 object-cover mx-auto rounded-3xl border border-zinc-800 mb-2.5"
                    />
                    <h3 className="font-serif font-black text-white text-base uppercase tracking-wider text-zinc-200">Vault Warehouse</h3>
                    <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-2.5 py-0.5 rounded-full border border-zinc-850 inline-block mt-0.5">Storage Limits Security Vault</span>
                  </div>

                  <p className="text-[11.5px] text-zinc-400 text-center leading-relaxed italic px-2">
                    "Fortifies the primary Kingdom storerooms to protect resources from overspilling maximum limits."
                  </p>

                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-900 text-xs font-mono space-y-1 text-zinc-300">
                    <div className="flex justify-between border-b border-zinc-900 pb-1 text-[11px] font-bold">
                      <span className="text-zinc-400">CURRENT VAULT LEVEL:</span>
                      <span className="text-amber-400 font-serif font-black tracking-widest text-xs uppercase">Lvl {warehouseLevel}</span>
                    </div>
                    <div className="flex justify-between pt-1 text-[11px]">
                      <span>Resource protection scope:</span>
                      <span className="text-emerald-400 font-bold">{formatNum(currentWarehouseCap)} capacity cap</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 p-3 bg-zinc-900/60 rounded-xl border border-zinc-900">
                    <span className="text-[9.5px] uppercase font-mono text-zinc-550 block font-bold">Expansion materials required:</span>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-400">
                      {(() => {
                        const nextCost = getUpgradeCostWarehouse();
                        return [
                          { name: 'Food', key: 'food', value: nextCost.food || 0 },
                          { name: 'Wood', key: 'wood', value: nextCost.wood || 0 },
                          { name: 'Stone', key: 'stone', value: nextCost.stone || 0 },
                          { name: 'Iron', key: 'iron', value: nextCost.iron || 0 },
                          { name: 'Valor', key: 'valor', value: nextCost.valor || 0 }
                        ].filter(r => r.value > 0).map(r => {
                          const hasPlenty = (resources[r.key as keyof Resources] || 0) >= r.value;
                          return (
                            <div key={r.key} className="flex justify-between items-center bg-black/45 p-1 px-2 rounded border border-zinc-900">
                              <span className={hasPlenty ? 'text-zinc-500' : 'text-rose-400 font-bold'}>{r.name}</span>
                              <span className={hasPlenty ? 'text-zinc-300' : 'text-rose-450 font-bold'}>{formatNum(r.value)}</span>
                            </div>
                          );
                        });
                      })()}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onUpgradeWarehouse();
                      setActiveModal(null);
                    }}
                    disabled={!!activeUpgrade || !canAfford(getUpgradeCostWarehouse())}
                    className={`w-full py-3.5 rounded-full font-serif text-xs font-black uppercase tracking-widest transition-all duration-200 border ${
                      !activeUpgrade && canAfford(getUpgradeCostWarehouse())
                        ? 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 text-black border-yellow-350 shadow-[0_0_20px_rgba(245,158,11,0.55)] animate-pulse active:scale-95 cursor-pointer'
                        : 'bg-zinc-900 border-zinc-850 text-zinc-650 cursor-not-allowed'
                    }`}
                  >
                    {activeUpgrade ? (activeUpgrade.buildingId === 'warehouse' ? 'Warehouse Upgrading...' : 'Queue Full: Builders Busy') : `Upgrade Vault to Level ${warehouseLevel + 1}`}
                  </button>
                </>
              )}

              {/* ----------------- SUB-VIEW: C. Technical Academy (RESEARCH) Modal ----------------- */}
              {activeModal === 'academy' && (
                <div className="text-center py-4 font-mono text-xs text-zinc-450">
                  Opening Scholar Archives...
                </div>
              )}


              {/* ----------------- SUB-VIEW: D. Grand Tavern Hero Hall Modal ----------------- */}
              {activeModal === 'tavern' && (
                <>
                  <div className="text-center">
                    <img 
                      src="https://images.unsplash.com/photo-1572116469696-31de0f17cc34?auto=format&fit=crop&q=80&w=250" 
                      alt="Hero Tavern" 
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 object-cover mx-auto rounded-3xl border border-yellow-500/20 mb-2"
                    />
                    <h3 className="font-serif font-black text-white text-base uppercase tracking-wider text-yellow-500">Grand Tavern Hall</h3>
                    <span className="text-[10px] font-mono text-zinc-300 bg-[#161208] px-3 py-1 rounded-full border border-amber-500/30 inline-block font-extrabold mt-1">
                      🎫 Tickets: <span className="text-amber-400 font-black">{heroTickets}</span>
                    </span>
                  </div>

                  <p className="text-[11px] text-zinc-400 text-center leading-normal italic px-1">
                    "Recruit Legendary Commanders to act as governors over agriculture sectors or deploy them as Active Commanders to double their auras."
                  </p>

                  {/* Tavern list of recruited commanders */}
                  <div className="space-y-2 h-[210px] overflow-y-auto pr-1 no-scrollbar">
                    {heroes.length === 0 ? (
                      <div className="text-[10.5px] font-mono text-zinc-650 italic text-center py-6 bg-zinc-950 rounded-xl border border-zinc-900">
                        No additional Heroes summoned. Gather scroll tickets to draw recruits!
                      </div>
                    ) : (
                      heroes.map((hero, idx) => {
                        const isActiveCommander = idx === currentHeroIndex;
                        const xpNeeded = hero.level * 100;
                        const xpPercent = Math.min(100, (hero.xp / xpNeeded) * 100);
                        const maxLevel = hero.level >= 10;

                        return (
                          <div 
                            key={hero.name} 
                            className={`p-2.5 rounded-xl border text-left text-xs ${
                              isActiveCommander 
                                ? 'bg-amber-950/15 border-amber-500/35 ring-1 ring-amber-500/10' 
                                : 'bg-zinc-950 border-zinc-900'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-serif font-extrabold text-white text-xs">{hero.name}</h4>
                                <span className="text-[9px] text-zinc-500">Lvl {hero.level} • Role: {hero.role}</span>
                                <span className="text-[9px] text-emerald-400 text-semibold block mt-0.5 font-mono">
                                  Bonus: +{hero.level * (isActiveCommander ? 10 : 5)}% {hero.bonus}
                                </span>
                              </div>

                              <button
                                onClick={() => onSetActiveHero(idx)}
                                disabled={isActiveCommander}
                                className={`px-2 py-0.5 text-[8.5px] font-mono rounded cursor-pointer transition-all ${
                                  isActiveCommander 
                                    ? 'bg-emerald-950 text-emerald-400 font-black border border-emerald-900/30 cursor-default' 
                                    : 'bg-zinc-905 text-zinc-300 border border-zinc-800 hover:bg-zinc-800'
                                }`}
                              >
                                {isActiveCommander ? 'Active Gov' : 'Deploy'}
                              </button>
                            </div>

                            {/* Experience bar and train button */}
                            <div className="mt-2 pt-2 border-t border-zinc-900/40 flex justify-between items-center bg-[#07080b] p-1.5 rounded">
                              <span className="text-[8px] font-mono text-zinc-500">
                                {maxLevel ? 'MAX LEVEL' : `${hero.xp}/${xpNeeded} XP`}
                              </span>
                              {!maxLevel && (
                                <button
                                  onClick={() => onCommuneHeroScroll(hero.name)}
                                  className="text-[8.5px] font-mono text-yellow-500 hover:text-white bg-zinc-950 border border-yellow-900/30 rounded px-1.5 py-0.5 cursor-pointer"
                                  title="Consumes 20 Valor for immediate +100 EXP training"
                                >
                                  📖 Scroll (20 Valor)
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <button
                    onClick={onDrawHero}
                    className="w-full py-3.5 rounded-full font-serif text-xs font-black uppercase tracking-widest bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 text-black border border-yellow-350 shadow-[0_0_20px_rgba(245,158,11,0.55)] animate-pulse active:scale-95 cursor-pointer"
                  >
                    {heroTickets > 0 ? `🎫 Summon Commander (1x Ticket)` : `🎫 Buy Ticket (Exchange 50 Valor)`}
                  </button>
                </>
              )}


              {/* ----------------- SUB-VIEW: GENERIC BUILDING MODAL (Farms, Lumber, Shrine, etc.) ----------------- */}
              {!(activeModal === 'castle' || activeModal === 'warehouse' || activeModal === 'tavern' || activeModal === 'academy' || activeModal === null) && (
                (() => {
                  const bId = activeModal;
                  const building = buildings.find(b => b.id === bId);
                  if (!building) return <div className="text-center py-4 font-mono text-xs text-rose-450">Structure not found.</div>;

                  const IconComponent = IconMap[building.iconName] || Cherry;
                  const nextCost = getCompoundedCost(building);
                  const affordable = canAfford(nextCost);

                  let rateString = '';
                  let graphic = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=250';
                  
                  if (building.id === 'farm') {
                    rateString = `+${(building.level * 2.0 * Math.pow(1.35, Math.max(0, building.level - 1))).toFixed(1)}/s Food`;
                    graphic = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=250';
                  } else if (building.id === 'lumber_mill') {
                    rateString = `+${(building.level * 1.5 * Math.pow(1.35, Math.max(0, building.level - 1))).toFixed(1)}/s Wood`;
                    graphic = 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=250';
                  } else if (building.id === 'quarry') {
                    rateString = `+${(building.level * 1.2 * Math.pow(1.4, Math.max(0, building.level - 1))).toFixed(1)}/s Stone`;
                    graphic = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=250';
                  } else if (building.id === 'iron_mine') {
                    rateString = `+${(building.level * 0.6 * Math.pow(1.4, Math.max(0, building.level - 1))).toFixed(1)}/s Iron`;
                    graphic = 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=250';
                  } else if (building.id === 'shrine') {
                    rateString = `+${(building.level * 0.2 * Math.pow(1.5, Math.max(0, building.level - 1))).toFixed(2)}/s Valor`;
                    graphic = 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=250';
                  } else if (building.id === 'barracks') {
                    rateString = `Reduces recruits training times (-10%/level)`;
                    graphic = 'https://images.unsplash.com/photo-1599727495394-4d20365778ef?auto=format&fit=crop&q=80&w=250';
                  } else if (building.id === 'infantry_barracks') {
                    rateString = `Bolsters infantry training speed by +1.5%/level`;
                    graphic = 'https://images.unsplash.com/photo-1599727495394-4d20365778ef?auto=format&fit=crop&q=80&w=250';
                  } else if (building.id === 'marksmen_camp') {
                    rateString = `Accelerates training speed of archer cohorts by +1.5%/level`;
                    graphic = 'https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&q=80&w=250';
                  } else if (building.id === 'cavalry_stable') {
                    rateString = `Drafting speed of heavy cavalry, knights, and chargers increased by +1.5%/level`;
                    graphic = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=250';
                  }

                  return (
                    <>
                      <div className="text-center">
                        <img 
                          src={graphic} 
                          alt={building.name} 
                          referrerPolicy="no-referrer"
                          className="w-24 h-24 object-cover mx-auto rounded-3xl border border-zinc-800 mb-2.5"
                        />
                        <div className="flex items-center justify-center gap-1.5">
                          <IconComponent className="w-4 h-4 text-amber-500" />
                          <h3 className="font-serif font-black text-white text-base uppercase tracking-wider">{building.name}</h3>
                        </div>
                        <span className="px-2.5 py-0.5 mt-1 bg-zinc-950 border border-zinc-850 rounded font-mono text-[9px] text-zinc-450 inline-block uppercase">
                          Lvl {building.level} Sector Block
                        </span>
                      </div>

                      <p className="text-[11.5px] text-zinc-400 text-center leading-relaxed italic px-1">
                        "{building.description}"
                      </p>

                      <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-900 text-xs font-mono space-y-1.5 text-zinc-300">
                        <div className="flex justify-between border-b border-zinc-900 pb-1 text-[11px] font-bold">
                          <span className="text-zinc-400">CURRENT REGAL LEVEL:</span>
                          <span className="text-amber-400 font-serif font-black tracking-widest text-xs uppercase">Lvl {building.level}</span>
                        </div>
                        <div className="flex justify-between pt-1">
                          <span>Yield capacity:</span>
                          <span className="text-emerald-400 font-extrabold">{rateString}</span>
                        </div>
                      </div>

                      {/* Pricing matrix */}
                      <div className="space-y-1.5 p-3 bg-zinc-900/60 rounded-xl border border-zinc-900">
                        <span className="text-[9.5px] uppercase font-mono text-zinc-550 block font-bold">Materials required:</span>
                        <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-zinc-400">
                          {Object.keys(nextCost).map((res) => {
                            const amt = nextCost[res as keyof ResourceCost] || 0;
                            const hasPlenty = (resources[res as keyof Resources] || 0) >= amt;
                            return (
                              <div key={res} className="flex justify-between items-center bg-black/45 p-1 px-2 rounded border border-zinc-900">
                                <span className={hasPlenty ? 'text-zinc-500' : 'text-rose-400 font-bold'}>{res.toUpperCase()}</span>
                                <span className={hasPlenty ? 'text-zinc-300' : 'text-rose-450 font-bold'}>{formatNum(amt)}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onUpgradeBuilding(building.id);
                          setActiveModal(null);
                        }}
                        disabled={!!activeUpgrade || !affordable}
                        className={`w-full py-3.5 rounded-full font-serif text-xs font-black uppercase tracking-widest transition-all duration-200 border ${
                          !activeUpgrade && affordable
                            ? 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 text-black border-yellow-350 shadow-[0_0_20px_rgba(245,158,11,0.55)] animate-pulse active:scale-95 cursor-pointer'
                            : 'bg-zinc-902 border-zinc-850 text-zinc-650 cursor-not-allowed'
                        }`}
                      >
                        {activeUpgrade ? (activeUpgrade.buildingId === building.id ? 'Under Construction...' : 'builders busy') : `Upgrade Sector to Level ${building.level + 1}`}
                      </button>

                      {/* --- TROOP TRAINING DIVISION --- */}
                      {['barracks', 'infantry_barracks', 'marksmen_camp', 'cavalry_stable'].includes(building.id) && (
                        <div className="mt-5 pt-5 border-t border-zinc-850 space-y-4 text-left">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-serif font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                              <Sword className="w-3.5 h-3.5 text-amber-500" /> Draft Forces Division
                            </span>
                            <span className="text-[8px] font-mono text-zinc-450 uppercase tracking-widest bg-zinc-950 px-2 py-0.5 rounded border border-zinc-900">
                              Cohort Queues: {troops.is_training ? 'ENGAGED' : 'IDLE'}
                            </span>
                          </div>

                          <p className="text-[10.5px] text-zinc-400 leading-relaxed italic">
                            Mobilize cohorts to protect your Realm or sweep aggressive rival encampments on active Battle Stages.
                          </p>

                          <div className="space-y-3">
                            {units
                              .filter((u) => {
                                if (building.id === 'barracks' || building.id === 'infantry_barracks') return u.troopType === 'infantry';
                                if (building.id === 'marksmen_camp') return u.troopType === 'marksmen';
                                if (building.id === 'cavalry_stable') return u.troopType === 'cavalry';
                                return false;
                              })
                              .sort((a, b) => (a.tier || 1) - (b.tier || 1))
                              .map((unit) => {
                                const currentBatch = selectedBatchSize[unit.id] || 10;
                                const cost = unit.cost;
                                const reqLevel = getRequiredLevelForTier(unit.tier || 1);
                                const isUnlocked = building.level >= reqLevel;

                                const barracksBuilding = buildings.find(b => b.id === 'barracks');
                                const recruitSpeedMultiplier = !barracksBuilding || barracksBuilding.level === 0 ? 1.0 : Math.max(0.4, 1.0 - (barracksBuilding.level * 0.08));
                                const totalDurationSec = Math.max(1, Math.round(unit.trainingTimeSec * recruitSpeedMultiplier * currentBatch));

                                // Calculate batch cost
                                const batchCost: ResourceCost = {};
                                Object.keys(cost).forEach((res) => {
                                  const key = res as keyof ResourceCost;
                                  batchCost[key] = (cost[key] || 0) * currentBatch;
                                });

                                const canAffordBatch = isUnlocked && Object.keys(batchCost).every((res) => {
                                  const needed = batchCost[res as keyof ResourceCost] || 0;
                                  const current = resources[res as keyof Resources] || 0;
                                  return current >= needed;
                                });

                                return (
                                  <div 
                                    key={unit.id} 
                                    className={`bg-zinc-950 border rounded-xl p-3.5 space-y-3.5 transition-all ${
                                      isUnlocked 
                                        ? 'border-zinc-900 hover:border-zinc-800' 
                                        : 'border-rose-955/20 bg-zinc-950/40 opacity-70'
                                    }`}
                                  >
                                    <div className="flex justify-between items-start gap-1">
                                      <div className="w-full">
                                        <div className="flex justify-between items-center gap-2">
                                          <h4 className="text-xs font-bold font-serif text-white uppercase tracking-wide flex items-center gap-1.5">
                                            {unit.name}
                                            <span className="text-[9.5px] font-mono text-zinc-500 font-normal normal-case">
                                              ({unit.count} active)
                                            </span>
                                          </h4>
                                          <span className="text-[9px] font-mono font-black px-1.5 py-0.5 rounded bg-zinc-900 text-amber-500 border border-zinc-800/85">
                                            Tier {unit.tier}
                                          </span>
                                        </div>
                                        <p className="text-[10.5px] text-zinc-400 leading-relaxed mt-1">
                                          {unit.description}
                                        </p>

                                        {/* Combat Statistics Details Row */}
                                        <div className="grid grid-cols-5 gap-1.5 text-[9px] font-mono text-zinc-400 bg-zinc-950/70 p-2 rounded-lg border border-zinc-900/90 mt-2.5">
                                          <div className="text-center">⚔️ ATK <div className="text-zinc-200 mt-0.5 font-bold">{unit.attack}</div></div>
                                          <div className="text-center">🛡️ DEF <div className="text-zinc-200 mt-0.5 font-bold">{unit.defense}</div></div>
                                          <div className="text-center">❤️ HP <div className="text-zinc-200 mt-0.5 font-bold">{unit.health}</div></div>
                                          <div className="text-center">⚡ SPD <div className="text-zinc-200 mt-0.5 font-bold">{unit.speed}</div></div>
                                          <div className="text-center">🎒 CAP <div className="text-zinc-200 mt-0.5 font-bold">{unit.load}</div></div>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                                          <span className="text-[8.5px] font-mono font-bold text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/30">
                                            +{unit.power} CR Rating / unit
                                          </span>
                                          <span className="text-[8.5px] font-mono font-bold text-rose-455 bg-rose-950/20 px-2 py-0.5 rounded border border-rose-905/30">
                                            Upkeep: {unit.upkeepFood.toFixed(1)}/s Wheat
                                          </span>
                                        </div>

                                        {!isUnlocked && (
                                          <div className="flex items-center gap-1.5 mt-2.5 text-[9.5px] leading-relaxed text-rose-400 font-mono bg-rose-950/20 border border-rose-900/30 rounded py-1.5 px-3">
                                            <Lock className="w-3.5 h-3.5" /> Requires {building.name} Level {reqLevel} to Unlock
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* Batch Control Selector */}
                                    {isUnlocked && (
                                      <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-zinc-900/50">
                                        <span className="text-[9px] uppercase font-mono font-bold text-zinc-400">
                                          Cohort size:
                                        </span>
                                        <div className="flex items-center gap-1">
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setSelectedBatchSize(prev => ({
                                                ...prev,
                                                [unit.id]: Math.max(1, currentBatch - 10)
                                              }));
                                            }}
                                            className="w-7 h-7 flex items-center justify-center bg-zinc-902 hover:bg-zinc-800 text-zinc-350 border border-zinc-800 rounded-lg active:scale-90 transition-transform cursor-pointer"
                                          >
                                            <Minus className="w-3.5 h-3.5" />
                                          </button>
                                          
                                          <input
                                            type="number"
                                            min={1}
                                            max={250}
                                            value={currentBatch}
                                            onChange={(e) => {
                                              const val = Math.max(1, parseInt(e.target.value) || 1);
                                              setSelectedBatchSize(prev => ({ ...prev, [unit.id]: val }));
                                            }}
                                            className="w-14 h-7 bg-zinc-902 border border-zinc-850 text-center font-mono font-bold text-xs text-amber-400 rounded-lg outline-none"
                                          />

                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setSelectedBatchSize(prev => ({
                                                ...prev,
                                                [unit.id]: Math.min(250, currentBatch + 10)
                                              }));
                                            }}
                                            className="w-7 h-7 flex items-center justify-center bg-zinc-902 hover:bg-zinc-800 text-zinc-350 border border-zinc-800 rounded-lg active:scale-90 transition-transform cursor-pointer"
                                          >
                                            <Plus className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>
                                    )}

                                    {/* Cost breakdown for batch */}
                                    {isUnlocked && (
                                      <div className="p-2.5 bg-[#0e0f14] rounded-lg border border-zinc-900/80 space-y-1">
                                        <span className="text-[8.5px] uppercase font-mono text-zinc-550 block">Draft cost matrix:</span>
                                        <div className="flex flex-wrap gap-1">
                                          {Object.keys(batchCost).map((res) => {
                                            const needed = batchCost[res as keyof ResourceCost] || 0;
                                            if (needed === 0) return null;
                                            const current = resources[res as keyof Resources] || 0;
                                            const hasCost = current >= needed;
                                            return (
                                              <span 
                                                key={res} 
                                                className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                                                  hasCost 
                                                    ? 'text-zinc-400 border-zinc-800 bg-zinc-950/40' 
                                                    : 'text-rose-455 border-rose-955/30 bg-rose-950/10'
                                                }`}
                                              >
                                                {res.toUpperCase()}: {formatNum(needed)}
                                              </span>
                                            );
                                          })}
                                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded border text-amber-500 border-amber-950/40 bg-amber-950/10">
                                            ⌛ DURATION: {totalDurationSec}s
                                          </span>
                                        </div>
                                      </div>
                                    )}

                                    {/* Action button */}
                                    {isUnlocked ? (
                                      <button
                                        type="button"
                                        disabled={!canAffordBatch}
                                        onClick={() => {
                                          onStartTraining(unit.id, currentBatch);
                                        }}
                                        className={`w-full py-2.5 rounded-xl font-mono text-[10px] font-black uppercase tracking-wider border transition-all ${
                                          canAffordBatch
                                            ? 'bg-gradient-to-r from-emerald-600 to-[#10b981] hover:brightness-110 text-white border-emerald-500/20 font-extrabold cursor-pointer active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                                            : 'bg-zinc-902 border-zinc-850 text-zinc-550 cursor-not-allowed'
                                        }`}
                                      >
                                        {canAffordBatch ? `Commence Training (${currentBatch}x Units)` : 'INSUFFICIENT STOCKPILE'}
                                      </button>
                                    ) : (
                                      <button
                                        type="button"
                                        disabled
                                        className="w-full py-2.5 rounded-xl font-mono text-[10px] font-black uppercase tracking-wider border border-zinc-850 bg-zinc-902 text-zinc-650 cursor-not-allowed text-center"
                                      >
                                        LOCKED: REACH LV. {reqLevel}
                                      </button>
                                    )}
                                  </div>
                                );
                              })}
                          </div>

                          {/* Active jobs lists inside modal */}
                          {trainingQueue.some((job) => {
                            const jobUnit = units.find(u => u.id === job.unitId);
                            if (!jobUnit) return false;
                            if (building.id === 'barracks' || building.id === 'infantry_barracks') return jobUnit.troopType === 'infantry';
                            if (building.id === 'marksmen_camp') return jobUnit.troopType === 'marksmen';
                            if (building.id === 'cavalry_stable') return jobUnit.troopType === 'cavalry';
                            return false;
                          }) && (
                            <div className="bg-amber-950/5 border border-amber-900/30 p-3 rounded-xl space-y-2 mt-3 text-[11px]">
                              <span className="text-[10px] font-serif font-black text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                                <Hourglass className="w-3.5 h-3.5 animate-spin text-amber-500" /> Active Draft Progress
                              </span>
                              <div className="space-y-2">
                                {trainingQueue
                                  .filter((job) => {
                                    const jobUnit = units.find(u => u.id === job.unitId);
                                    if (!jobUnit) return false;
                                    if (building.id === 'barracks' || building.id === 'infantry_barracks') return jobUnit.troopType === 'infantry';
                                    if (building.id === 'marksmen_camp') return jobUnit.troopType === 'marksmen';
                                    if (building.id === 'cavalry_stable') return jobUnit.troopType === 'cavalry';
                                    return false;
                                  })
                                  .map((job) => {
                                    const unitDetails = units.find(u => u.id === job.unitId);
                                    const progressPct = ((job.totalTimeSec - job.timeRemainingSec) / job.totalTimeSec) * 100;

                                    return (
                                      <div key={job.id} className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-900 w-full flex flex-col gap-1.5 relative overflow-hidden">
                                        <div className="flex items-center justify-between text-[10.5px] z-10 font-bold">
                                          <span className="text-white">
                                            Training {job.count}x {unitDetails?.name}
                                          </span>
                                          <div className="flex items-center gap-2">
                                            <span className="font-mono text-yellow-500 font-extrabold">
                                              {job.timeRemainingSec}s
                                            </span>
                                            <button 
                                              type="button"
                                              onClick={() => onCancelTraining(job.id)}
                                              className="text-zinc-500 hover:text-rose-455 cursor-pointer"
                                              title="Cancel for full refund"
                                            >
                                              <Trash className="w-3 h-3" />
                                            </button>
                                          </div>
                                        </div>
                                        
                                        <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-900 relative">
                                          <div 
                                            className="bg-amber-600 h-full rounded-full" 
                                            style={{ width: `${progressPct}%` }}
                                          />
                                        </div>

                                        {onInstantComplete && resources.valor >= 5 && (
                                          <button
                                            type="button"
                                            onClick={() => onInstantComplete(job.id)}
                                            className="text-[9.5px] text-yellow-400 font-mono flex items-center gap-1 justify-end w-full cursor-pointer hover:brightness-110 font-extrabold bg-transparent border-0"
                                          >
                                            <Sparkle className="w-2.5 h-2.5 fill-current text-yellow-400" /> Fast finish: 5 Valor
                                          </button>
                                        )}
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  );
                })()
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Complete Upgrade Diagnostics Panel Modal */}
      <AnimatePresence>
        {showDiagnostics && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#0b0c10] border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
              {/* Header */}
              <div className="p-4 bg-zinc-950/80 border-b border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-amber-500 animate-pulse" />
                  <div className="text-left">
                    <h3 className="font-serif text-sm font-bold text-amber-400 tracking-wider uppercase">Sovereign Construction Diagnostics & Upgrade Testing</h3>
                    <p className="text-[10px] text-zinc-405 font-mono">Real-time state validation, material subtraction triggers, and structural dependency checklist.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {onCheatResources && (
                    <button
                      onClick={onCheatResources}
                      className="px-3 py-1 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 hover:from-emerald-500/20 hover:to-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-mono rounded-lg transition-all font-black uppercase tracking-wider cursor-pointer"
                      title="Add +500K of all resources to easily test upgrades and prerequisites"
                    >
                      🎁 Cheat +500k
                    </button>
                  )}
                  <button
                    onClick={() => setShowDiagnostics(false)}
                    className="p-1 px-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg border border-zinc-800 font-mono text-[9px] transition-colors cursor-pointer"
                  >
                    CLOSE
                  </button>
                </div>
              </div>

              {/* Grid content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                
                {/* Visual statistics / summary cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
                  <div className="p-2.5 bg-black/40 border border-zinc-800/60 rounded-xl flex flex-col items-start">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase">Total Power Rating</span>
                    <span className="text-sm font-serif font-bold text-amber-500 text-left">+{formatNum(getBuildingsTotalPower())} CR (Buildings)</span>
                  </div>
                  <div className="p-2.5 bg-black/40 border border-zinc-800/60 rounded-xl flex flex-col items-start">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase">Total Structures Loaded</span>
                    <span className="text-sm font-serif font-bold text-zinc-300 text-left">18 / 18 In Database</span>
                  </div>
                  <div className="p-2.5 bg-black/40 border border-zinc-800/60 rounded-xl flex flex-col items-start">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase">Max Structure Level</span>
                    <span className="text-sm font-serif font-bold text-zinc-300 text-left">Level 40 (All Buildings)</span>
                  </div>
                  <div className="p-2.5 bg-black/40 border border-zinc-800/60 rounded-xl flex flex-col items-start">
                    <span className="text-[8px] font-mono text-zinc-500 uppercase">Interactive Testing</span>
                    <span className="text-xs font-mono text-emerald-400 text-left">Subtraction Engine Linked</span>
                  </div>
                </div>

                {/* Diagnostics Table */}
                <div className="border border-zinc-900 rounded-xl overflow-hidden bg-black/20 text-left">
                  <div className="grid grid-cols-12 gap-1 px-3 py-2 bg-zinc-950 font-mono text-[8.5px] uppercase tracking-wider text-zinc-500 border-b border-zinc-900 font-black">
                    <div className="col-span-3">Building / Sector</div>
                    <div className="col-span-1 text-center">Lvl</div>
                    <div className="col-span-4">Next Cost Requirements</div>
                    <div className="col-span-2">Unlocking Prerequisites</div>
                    <div className="col-span-1 text-center">Status</div>
                    <div className="col-span-1 text-right">Action</div>
                  </div>

                  <div className="divide-y divide-zinc-900 font-mono text-[10px]">
                    {DIAGNOSTIC_BUILDING_IDS.map(id => {
                      const currentLvl = getPlayerCurrentLevel(id);
                      const nextLvl = currentLvl + 1;
                      const isMax = currentLvl >= 40;
                      const catalog = BUILDING_DATABASE[id];
                      const name = catalog?.name || id;
                      const nextLevelData = catalog?.levels[nextLvl];
                      const costs = nextLevelData?.costs || { food: 0, wood: 0, stone: 0, iron: 0, valor: 0 };
                      const prereqs = nextLevelData?.prerequisites || [];

                      const costEntries = [
                        { label: 'F', value: costs.food, has: resources.food >= (costs.food || 0) },
                        { label: 'W', value: costs.wood, has: resources.wood >= (costs.wood || 0) },
                        { label: 'S', value: costs.stone, has: resources.stone >= (costs.stone || 0) },
                        { label: 'I', value: costs.iron, has: resources.iron >= (costs.iron || 0) },
                        { label: 'V', value: costs.valor, has: (resources.valor !== undefined) ? (resources.valor >= (costs.valor || 0)) : true }
                      ].filter(c => c.value);

                      const prereqStatus = checkDiagPrerequisites(prereqs);
                      const hasCost = costEntries.every(c => c.has);
                      const isUpgradingThis = activeUpgrade && activeUpgrade.buildingId === id;
                      const hasAnyUpgrade = !!activeUpgrade;
                      const canUpgrade = !isMax && hasCost && prereqStatus.satisfied && !hasAnyUpgrade;

                      return (
                        <div key={id} className="grid grid-cols-12 gap-1 px-3 py-2.5 items-center hover:bg-zinc-950/45 transition-colors">
                          
                          {/* Name / ID */}
                          <div className="col-span-3 flex flex-col">
                            <span className="font-serif font-bold text-zinc-200 text-[11px] leading-tight text-left">{name}</span>
                            <span className="text-[7.5px] text-zinc-550 lowercase text-left">id: {id}</span>
                          </div>

                          {/* Current Level */}
                          <div className="col-span-1 text-center font-bold">
                            <span className={`px-1.5 py-0.5 rounded text-[9.5px] ${currentLvl > 0 ? 'bg-amber-950/20 text-amber-400 border border-amber-900/10' : 'bg-zinc-900 text-zinc-500'}`}>
                              Lvl {currentLvl}
                            </span>
                          </div>

                          {/* Next Cost Requirements */}
                          <div className="col-span-4 flex flex-wrap gap-1">
                            {isMax ? (
                              <span className="text-[8.5px] text-zinc-500 font-bold tracking-widest uppercase">Max Level Reached</span>
                            ) : costEntries.length === 0 ? (
                              <span className="text-[8.5px] text-emerald-400">Free Upgrade</span>
                            ) : (
                              costEntries.map(c => (
                                <span
                                  key={c.label}
                                  className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                                    c.has ? 'bg-emerald-950/15 text-emerald-400 border border-emerald-900/10' : 'bg-red-950/20 text-red-500 border border-red-900/10'
                                  }`}
                                  title={`${c.label === 'F' ? 'Food' : c.label === 'W' ? 'Wood' : c.label === 'S' ? 'Stone' : c.label === 'I' ? 'Iron' : 'Valor'}: ${formatNum(c.value || 0)}`}
                                >
                                  {c.label}: <span className="font-mono">{formatNum(c.value || 0)}</span>
                                </span>
                              ))
                            )}
                          </div>

                          {/* Prerequisites */}
                          <div className="col-span-2 flex flex-col gap-0.5">
                            {isMax ? (
                              <span className="text-[8.5px] text-zinc-500">—</span>
                            ) : prereqStatus.details.length === 0 ? (
                              <span className="text-[8.5px] text-emerald-400/80">None Required</span>
                            ) : (
                              prereqStatus.details.map((p, pIndex) => (
                                <span
                                  key={pIndex}
                                  className={`text-[8px] leading-tight font-sans font-bold flex items-center gap-0.5 ${
                                    p.met ? 'text-zinc-400' : 'text-yellow-500'
                                  }`}
                                >
                                  <span className={p.met ? 'text-emerald-500' : 'text-rose-500 font-extrabold'}>
                                    {p.met ? '✓' : '✗'}
                                  </span>
                                  {p.name} (Lvl {p.req})
                                </span>
                              ))
                            )}
                          </div>

                          {/* Status */}
                          <div className="col-span-1 text-center flex flex-col justify-center items-center">
                            {isMax ? (
                              <span className="text-[8px] text-zinc-550 font-black uppercase tracking-wider">COMPLETED</span>
                            ) : isUpgradingThis ? (
                              <span className="text-[8.5px] text-amber-400 font-black tracking-widest uppercase animate-pulse">UPGRADING</span>
                            ) : canUpgrade ? (
                              <span className="text-[8.5px] text-emerald-400 font-black tracking-widest uppercase animate-pulse">READY</span>
                            ) : !prereqStatus.satisfied ? (
                              <span className="text-[8.5px] text-yellow-550 font-black tracking-wider uppercase">LOCKED</span>
                            ) : hasAnyUpgrade ? (
                              <span className="text-[8.5px] text-zinc-500 font-black tracking-wider uppercase">LOCKED</span>
                            ) : (
                              <span className="text-[8.5px] text-rose-500 font-black tracking-wider uppercase">DEFICIENT</span>
                            )}
                          </div>

                          {/* Action Button */}
                          <div className="col-span-1 text-right">
                            {isUpgradingThis ? (
                              <div className="text-[9px] font-black text-amber-500 font-mono text-center animate-pulse">
                                {Math.max(0, Math.round((activeUpgrade.finishTime - Date.now()) / 1000))}s left
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  if (!canUpgrade) return;
                                  handleDiagUpgrade(id);
                                }}
                                disabled={!canUpgrade}
                                className={`px-2 py-1 rounded text-[8px] font-black uppercase font-mono tracking-widest border transition-all ${
                                  canUpgrade
                                    ? 'bg-gradient-to-r from-amber-450 to-amber-500 hover:brightness-110 active:scale-95 text-black border-amber-300 cursor-pointer shadow-lg shadow-amber-950/20'
                                    : 'bg-zinc-902 border-zinc-850 text-zinc-600 cursor-not-allowed'
                                }`}
                                title={canUpgrade ? `Trigger Instant ${name} Subtraction Upgrade` : 'Requirements not met'}
                              >
                                🏗️ Build
                              </button>
                            )}
                          </div>

                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="p-3 bg-zinc-950 text-right text-[8.5px] text-zinc-550 border-t border-zinc-900 font-mono">
                COGNITIVE DIAGNOSTIC CONSOLE v2.0.0 // REAL-TIME PERSISTENCE TO LOCALSTORAGE SYNCED AUTOMATICALLY
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <BuildingDatabaseModal
        isOpen={isAlmanacOpen}
        onClose={() => setIsAlmanacOpen(false)}
        playerBuildings={buildings}
        castleLevel={castleLevel}
        warehouseLevel={warehouseLevel}
        researchHallLevel={research.research_hall_level}
      />

    </div>
  );
}
