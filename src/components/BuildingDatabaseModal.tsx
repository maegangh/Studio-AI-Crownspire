import React, { useState, useMemo } from 'react';
import { 
  Building, 
  Resources 
} from '../types';
import { 
  BUILDING_DATABASE, 
  BuildingCatalog, 
  formatDuration 
} from '../utils/buildingDatabase';
import { 
  formatNum 
} from '../gameData';
import { 
  Search, 
  BookOpen, 
  Flame, 
  Clock, 
  Sparkle, 
  Lock, 
  ArrowUp,
  Sliders,
  Award,
  Database,
  Layers,
  Heart,
  ShieldCheck,
  Users,
  Sword,
  Target,
  Shield,
  Eye,
  Coins,
  Crown
} from 'lucide-react';
import { 
  Cherry, 
  Trees, 
  Dumbbell, 
  Hammer, 
  Sparkles, 
  ShieldAlert, 
  Castle, 
  Package, 
  GraduationCap 
} from 'lucide-react';

interface BuildingDatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerBuildings: Building[];
  castleLevel: number;
  warehouseLevel: number;
  researchHallLevel: number;
}

const BuildingIcons: { [key: string]: React.ComponentType<any> } = {
  castle: Castle,
  warehouse: Package,
  academy: GraduationCap,
  farm: Cherry,
  lumber_mill: Trees,
  quarry: Dumbbell,
  iron_mine: Hammer,
  shrine: Sparkles,
  barracks: ShieldAlert,
  hospital: Heart,
  sanctuary: ShieldCheck,
  embassy: Users,
  infantry_barracks: Sword,
  marksmen_camp: Target,
  cavalry_stable: Shield,
  watchtower: Eye,
  trading_post: Coins,
  hall_of_heroes: Crown
};

export default function BuildingDatabaseModal({
  isOpen,
  onClose,
  playerBuildings,
  castleLevel,
  warehouseLevel,
  researchHallLevel
}: BuildingDatabaseModalProps) {
  const [selectedBuildingId, setSelectedBuildingId] = useState<string>('castle');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTierFilter, setActiveTierFilter] = useState<'all' | 'milestones' | 'my-level'>('all');

  const selectedCatalog: BuildingCatalog | undefined = BUILDING_DATABASE[selectedBuildingId];

  // Helper to match the player's active level for each building type
  const getPlayerCurrentLevel = (id: string): number => {
    if (id === 'castle') return castleLevel;
    if (id === 'warehouse') return warehouseLevel;
    if (id === 'academy') return researchHallLevel;
    const b = playerBuildings.find(item => item.id === id);
    return b ? b.level : 0;
  };

  const currentPlayerLevel = getPlayerCurrentLevel(selectedBuildingId);

  // Compute filtered levels based on search and selected tier filter
  const processedLevels = useMemo(() => {
    if (!selectedCatalog) return [];

    const list = Object.values(selectedCatalog.levels);

    return list.filter((lvlData) => {
      // 1. Search filter: matches level number, prereqs, unlocks text, effects, or descriptions
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesLvl = lvlData.level.toString() === query || `lvl ${lvlData.level}`.includes(query);
        const matchesUnlocks = lvlData.unlocks.some(u => u.toLowerCase().includes(query));
        const matchesDesc = lvlData.description.toLowerCase().includes(query);
        const matchesEffect = lvlData.buildingEffect?.toLowerCase().includes(query);
        const matchesPrereqs = lvlData.prerequisites.some(p => p.toLowerCase().includes(query));
        
        if (!matchesLvl && !matchesUnlocks && !matchesDesc && !matchesPrereqs && !matchesEffect) {
          return false;
        }
      }

      // 2. Tier filter
      if (activeTierFilter === 'milestones') {
        // Milestone levels are multiples of 5 or maximum level 40
        return lvlData.level % 5 === 0 || lvlData.level === 40 || lvlData.level === 1;
      }
      if (activeTierFilter === 'my-level') {
        return lvlData.level === currentPlayerLevel;
      }

      return true;
    });
  }, [selectedCatalog, searchQuery, activeTierFilter, currentPlayerLevel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-5 text-zinc-100 font-sans select-none overflow-hidden">
      <div 
        className="w-full max-w-xl bg-[#090b10] border-2 border-amber-500/40 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.25)] flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-amber-500/10 bg-[#0c0f17] flex justify-between items-center bg-gradient-to-r from-amber-500/5 to-transparent">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <Database className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <div className="text-[9px] font-black font-mono uppercase tracking-[0.25em] text-amber-400 leading-none">
                Crownspire Archive
              </div>
              <h2 className="text-base font-serif font-black tracking-wider text-amber-100 uppercase mt-1">
                🏰 Imperial Structure Catalog
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 px-3 py-1.5 rounded-full bg-zinc-950 border border-zinc-800 hover:border-amber-400 text-xs font-mono font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer active:scale-95"
          >
            ✕ Close
          </button>
        </div>

        {/* Horizontal Navigation List of Structures */}
        <div className="px-3 py-2 bg-[#05060a] border-b border-zinc-900/60 overflow-x-auto no-scrollbar flex items-center gap-2 shrink-0">
          {Object.values(BUILDING_DATABASE).map((catalog) => {
            const Icon = BuildingIcons[catalog.id] || Castle;
            const isSelected = selectedBuildingId === catalog.id;
            const currentLvl = getPlayerCurrentLevel(catalog.id);

            return (
              <button
                key={catalog.id}
                onClick={() => {
                  setSelectedBuildingId(catalog.id);
                  setSearchQuery('');
                }}
                className={`py-1.5 px-3 rounded-2xl flex items-center gap-2 shrink-0 border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-black border-amber-300 font-black shadow-lg shadow-amber-950/40 text-xs'
                    : 'bg-zinc-950 hover:bg-zinc-900 border-zinc-900 text-zinc-400 hover:text-zinc-200 text-[11px]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'stroke-[2.5]' : ''}`} />
                <span className="font-serif leading-none uppercase tracking-wide">{catalog.name}</span>
                <span className={`text-[9px] px-1 rounded-md font-mono ${isSelected ? 'bg-black/30 text-amber-300 font-black' : 'bg-zinc-900 text-zinc-500 font-bold'}`}>
                  Lvl {currentLvl}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Building Static Meta overview card */}
        {selectedCatalog && (
          <div className="p-3 bg-gradient-to-b from-[#0a0f1d]/90 to-[#07090e]/95 border-b border-zinc-900 flex flex-col sm:flex-row items-center gap-3 shrink-0">
            {(() => {
              const Icon = BuildingIcons[selectedCatalog.id] || Castle;
              return (
                <div className="relative p-3 rounded-2xl bg-[#030508] border border-amber-500/20 shadow-xl overflow-hidden shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 to-transparent pointer-events-none" />
                  <Icon className="w-10 h-10 text-amber-500" />
                </div>
              );
            })()}
            <div className="text-center sm:text-left flex-1 leading-none">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <h3 className="text-sm font-serif font-black text-amber-300 uppercase tracking-widest leading-none">
                  {selectedCatalog.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-zinc-950 border border-zinc-850 font-mono text-[9px] text-zinc-500 leading-none inline-block w-fit mx-auto sm:mx-0">
                  Total Capacity: Level 1 - 40 Database
                </span>
              </div>
              <p className="text-[11px] text-zinc-440 mt-1.5 leading-relaxed">
                {selectedCatalog.baseDescription}
              </p>
            </div>
            
            {/* Player's current progress gauge widget */}
            <div className="p-2 bg-black/60 border border-zinc-900 rounded-2xl text-center shrink-0 min-w-[70px]">
              <span className="text-[8px] font-mono text-zinc-500 block uppercase font-bold">Your Realm</span>
              <span className="text-base font-serif font-black text-emerald-400 mt-0.5 block leading-none">
                Lvl {currentPlayerLevel}
              </span>
              <span className="text-[8px] font-mono text-zinc-600 block mt-1">/ Max 40</span>
            </div>
          </div>
        )}

        {/* Filters and Search Bar Container */}
        <div className="p-2 px-3 bg-[#07080c] border-b border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          {/* Custom Search field input with lucide icon */}
          <div className="relative w-full sm:w-48">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search level, prereq, effect, unlocks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 text-xs border border-zinc-900 rounded-xl py-1.5 pl-8 pr-3 outline-none text-zinc-200 placeholder:text-zinc-650 focus:border-amber-450 focus:ring-1 focus:ring-amber-500/20"
            />
          </div>

          {/* Quick filter mode toggles */}
          <div className="p-0.5 bg-black/90 border border-zinc-850 rounded-xl flex items-center font-mono text-[9px] text-zinc-400">
            <button
              onClick={() => setActiveTierFilter('all')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                activeTierFilter === 'all'
                  ? 'bg-amber-500/10 text-amber-400 font-black border border-amber-500/20'
                  : 'hover:text-white'
              }`}
            >
              All Levels
            </button>
            <button
              onClick={() => setActiveTierFilter('milestones')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-0.5 ${
                activeTierFilter === 'milestones'
                  ? 'bg-amber-500/10 text-amber-400 font-black border border-amber-500/20'
                  : 'hover:text-white'
              }`}
            >
              <Award className="w-2.5 h-2.5" /> Milestones
            </button>
            <button
              onClick={() => setActiveTierFilter('my-level')}
              className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                activeTierFilter === 'my-level'
                  ? 'bg-[#142318] text-emerald-400 font-black border border-emerald-500/20'
                  : 'hover:text-white'
              }`}
              disabled={currentPlayerLevel === 0}
            >
              Current Active Level ({currentPlayerLevel})
            </button>
          </div>
        </div>

        {/* Database Levels 1-40 Core scroll area */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 no-scrollbar bg-[#050609]">
          
          {processedLevels.length === 0 ? (
            <div className="text-center py-12 border border-zinc-900 bg-black/40 rounded-3xl italic text-xs text-zinc-650 font-mono flex flex-col items-center justify-center gap-2">
              <Sliders className="w-8 h-8 text-zinc-800 animate-spin" />
              <span>No levels match your query " {searchQuery} " in this structure tier.</span>
              <button 
                onClick={() => { setSearchQuery(''); setActiveTierFilter('all'); }}
                className="text-[10px] text-amber-400 underline font-semibold mt-2 cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            processedLevels.map((lvl) => {
              const isCurrent = lvl.level === currentPlayerLevel;
              const isNext = lvl.level === currentPlayerLevel + 1;

              return (
                <div
                  key={lvl.level}
                  className={`border rounded-2xl flex flex-col overflow-hidden transition-all duration-300 ${
                    isCurrent
                      ? 'border-emerald-555 bg-[#0e1b12]/30 ring-1 ring-emerald-500/20 shadow-[0_4px_16px_rgba(16,185,129,0.1)]'
                      : isNext
                        ? 'border-amber-500/40 bg-[#161208]/30 shadow-[0_4px_16px_rgba(245,158,11,0.05)]'
                        : 'border-zinc-900 bg-black/40 hover:border-zinc-800'
                  }`}
                >
                  {/* Card Title Header with Level Indicator */}
                  <div className={`p-2.5 px-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 ${
                    isCurrent
                      ? 'bg-emerald-950/40 text-emerald-300'
                      : isNext
                        ? 'bg-amber-950/30 text-amber-300'
                        : 'bg-[#080a0f]'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-lg font-mono font-black text-[11px] flex items-center justify-center leading-none ${
                        isCurrent
                          ? 'bg-emerald-400 text-black'
                          : isNext
                            ? 'bg-amber-500 text-black'
                            : 'bg-zinc-850 text-zinc-300 border border-zinc-750'
                      }`}>
                        {lvl.level}
                      </span>
                      <div>
                        <span className="text-[11.5px] font-bold font-serif uppercase tracking-widest leading-none">
                          Level {lvl.level} Upgrade
                        </span>
                        {isCurrent && (
                          <span className="text-[8px] font-mono bg-emerald-950 text-emerald-400 font-extrabold border border-emerald-900 p-0.5 px-1.5 rounded-md ml-2 inline-block">
                            ACTIVE CURRENT REALM LEVEL
                          </span>
                        )}
                        {isNext && (
                          <span className="text-[8px] font-mono bg-amber-950 text-amber-400 font-extrabold border border-amber-900 p-0.5 px-1.5 rounded-md ml-2 inline-block">
                            NEXT AVAILABLE UPGRADE
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Timing & Power Gains Details */}
                    <div className="flex items-center gap-3 font-mono text-[10px] text-zinc-450">
                      <div className="flex items-center gap-1" title="Build Duration Time">
                        <Clock className="w-3 h-3 text-zinc-500" />
                        <span>{formatDuration(lvl.buildTimeSec)}</span>
                      </div>
                      <div className="flex items-center gap-1" title="Combat Power Contribution">
                        <Flame className="w-3 h-3 text-orange-400" />
                        <span className="font-bold text-zinc-350">+{formatNum(lvl.powerGained)} Power</span>
                      </div>
                    </div>
                  </div>

                  {/* Complete Costs Grid */}
                  <div className="p-3 bg-black/20 border-t border-zinc-900 grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                    {[
                      { l: 'Food', v: lvl.costs.food, color: 'text-amber-500' },
                      { l: 'Wood', v: lvl.costs.wood, color: 'text-emerald-500' },
                      { l: 'Stone', v: lvl.costs.stone, color: 'text-stone-300' },
                      { l: 'Iron', v: lvl.costs.iron, color: 'text-blue-400' },
                      { l: 'Valor', v: lvl.costs.valor, color: 'text-amber-400' }
                    ].map((material) => (
                      <div 
                        key={material.l}
                        className="bg-black/60 p-1.5 rounded-xl border border-zinc-900 flex justify-between items-center sm:flex-col sm:items-start"
                      >
                        <span className="text-[8.5px] font-mono text-zinc-550 block leading-none font-bold">
                          {material.l}
                        </span>
                        <span className={`text-[10px] font-mono font-black mt-0.5 sm:mt-1 leading-none ${material.v ? material.color : 'text-zinc-650'}`}>
                          {material.v ? formatNum(material.v) : '—'}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Prerequisites, Milestones and Detailed Description */}
                  <div className="p-3 text-xs leading-relaxed space-y-2.5 bg-black/10 border-t border-zinc-920">
                    
                    {/* Prerequisites */}
                    {lvl.prerequisites.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 font-mono text-[9.5px]">
                        <span className="text-zinc-550 font-bold uppercase tracking-wider text-[8px] flex items-center gap-0.5 shrink-0">
                          <Lock className="w-2.5 h-2.5" /> Prerequisites:
                        </span>
                        {lvl.prerequisites.map((p, idx) => (
                          <span key={idx} className="bg-zinc-950 border border-zinc-850 text-zinc-400 px-2 py-0.5 rounded-md font-bold">
                            {p}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Active dynamic level effect */}
                    {lvl.buildingEffect && (
                      <div className="bg-emerald-950/20 border border-emerald-500/20 p-2 rounded-xl flex flex-col gap-0.5 text-emerald-300">
                        <div className="flex items-center gap-1 font-serif text-[10px] font-black uppercase text-emerald-400 tracking-wider">
                          <Sliders className="w-3 h-3 text-emerald-400" />
                          <span>Active Level Special Effect:</span>
                        </div>
                        <p className="font-mono text-[10px] text-zinc-300 leading-normal pl-0.5">
                          {lvl.buildingEffect}
                        </p>
                      </div>
                    )}

                    {/* Milestone/Unlocks rewards */}
                    {lvl.unlocks.length > 0 && (
                      <div className="bg-amber-500/5 border border-amber-500/20 p-2 rounded-xl flex flex-col gap-1 text-[11px] text-amber-200">
                        <div className="flex items-center gap-1 font-serif text-[10px] font-black uppercase text-amber-400 tracking-wider">
                          <Sparkle className="w-3 h-3 text-amber-400 animate-pulse fill-current" />
                          <span>Special Milestone Unlock:</span>
                        </div>
                        {lvl.unlocks.map((u, idx) => (
                          <div key={idx} className="flex items-start gap-1 font-mono text-[10px] text-zinc-400 leading-normal pl-0.5">
                            <span className="text-amber-500 font-bold select-none">•</span>
                            <span>{u}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-[11px] text-zinc-455 italic leading-relaxed">
                      "{lvl.description}"
                    </p>
                  </div>
                </div>
              );
            })
          )}

        </div>

        {/* Modal Footer status */}
        <div className="p-3 border-t border-zinc-900 bg-[#07090e] flex items-center justify-between text-[10px] font-mono text-zinc-550 shrink-0 select-none">
          <div className="flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-amber-500" />
            <span>Levels 1 - 40 mapped perfectly with exact exponential scaling.</span>
          </div>
          <span>Total Database Row Items: 640</span>
        </div>
      </div>
    </div>
  );
}
