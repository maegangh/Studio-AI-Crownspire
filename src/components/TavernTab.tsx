import React, { useState } from 'react';
import { Hero, Resources } from '../types';
import { CROWNSPIRE_HEROES_DATABASE, getHeroRecruitedStats, RarityType } from '../utils/heroDatabase';
import { HERO_LORE_DATABASE } from '../utils/heroLore';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkle, 
  Sparkles, 
  Ticket, 
  Flame, 
  Shield, 
  Scroll,
  Users,
  BookOpen,
  Compass,
  Quote,
  X,
} from 'lucide-react';

interface TavernTabProps {
  heroes: Hero[];
  heroTickets: number;
  resources: Resources;
  currentHeroIndex: number;
  onDrawHero: () => void;
  onCommuneHeroScroll: (heroName: string) => void;
  onSetActiveHero: (index: number) => void;
  onAscendHero: (heroName: string) => void;
  onManageEquipment?: (heroId: string) => void;
}

// Curated stunning high-quality fantasy portraits compatible with the game's medieval palette
const AVATARS = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250", // Elven aura
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250", // Rugged woodsman
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250", // Earthy warrior
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250", // Strong blacksmith
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250", // General of war
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=250", // Noble damsel
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250", // Sorceress gaze
  "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=250", // Young squire
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250", // Rogue hunter
  "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=250", // Wise scholar
  "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=250", // Fierce highlander
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250", // Forest archer
];

export default function TavernTab({
  heroes,
  heroTickets,
  resources,
  currentHeroIndex,
  onDrawHero,
  onCommuneHeroScroll,
  onSetActiveHero,
  onAscendHero,
  onManageEquipment,
}: TavernTabProps) {

  const [rarityFilter, setRarityFilter] = useState<string>('All');
  const [selectedLoreHero, setSelectedLoreHero] = useState<any | null>(null);
  const [activeLoreTab, setActiveLoreTab] = useState<'bio' | 'personality' | 'recruitment'>('bio');

  // Helper check if recruited
  const isRecruited = (name: string) => {
    return heroes.some((h) => h.name === name);
  };

  // Helper returns recruited state or template definitions
  const getHeroData = (starterHero: any): Hero => {
    const recruited = heroes.find((h) => h.name === starterHero.name || h.id === starterHero.id);
    return recruited || {
      ...starterHero,
      level: 1,
      xp: 0,
      attack: starterHero.baseAttack,
      defense: starterHero.baseDefense,
      shards: 0,
      ascension: 0
    };
  };

  // Get consistent beautiful portraits using a character code hash loop
  const getHeroAvatar = (name: string) => {
    const hash = Math.abs(name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
    return AVATARS[hash % AVATARS.length];
  };

  const getRarityTheme = (rarity: RarityType) => {
    switch (rarity) {
      case 'Common': return 'from-zinc-500/20 to-zinc-950/40 text-zinc-400 border-zinc-700/30';
      case 'Rare': return 'from-blue-500/20 to-blue-950/40 text-blue-400 border-blue-500/30';
      case 'Epic': return 'from-purple-500/25 to-purple-950/40 text-purple-400 border-purple-500/35';
      case 'Legendary': return 'from-amber-600/25 to-amber-975/40 text-amber-400 border-amber-500/40';
      case 'Mythic': return 'from-red-600/25 to-red-975/40 text-red-400 border-red-500/40 animate-pulse';
      default: return 'from-zinc-700/20 to-zinc-950 text-zinc-300 border-zinc-800';
    }
  };

  // Filter 50 heroes database
  const filteredHeroes = CROWNSPIRE_HEROES_DATABASE.filter(h => {
    if (rarityFilter === 'Recruited') return isRecruited(h.name);
    if (rarityFilter === 'All') return true;
    return h.rarity === rarityFilter;
  });

  return (
    <div id="hero-tavern-tab" className="flex-1 overflow-y-auto px-4 py-3 space-y-4 pb-24 flex flex-col h-full bg-gradient-to-b from-[#090b0f] via-[#050608] to-[#040406]">
      
      {/* Tavern Intro Header */}
      <div className="bg-[#12141d]/90 border border-amber-500/20 p-3.5 rounded-2xl relative shadow-lg">
        <div className="absolute top-0 right-0 p-3 text-amber-500/10 pointer-events-none">
          <Users className="w-16 h-16 transform rotate-6" />
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-serif">Sovereign Hero Hall</h2>
        </div>
        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
          Summon from <span className="text-white font-extrabold font-mono">50 unique historical commanders</span>. Pulling duplicated scrolls melts them into Ascension Shards. Consume Shards to perform ascension (+0 to +5), unlocking massive stat multipliers, bonus power ratings, and special skill capabilities!
        </p>

        {/* Floating Ticket Counter */}
        <div className="mt-2.5 flex items-center justify-between bg-[#08090d] border border-zinc-900 px-3 py-1.5 rounded-xl">
          <div className="flex items-center gap-1.5 text-xs">
            <Ticket className="w-4 h-4 text-amber-500" />
            <span className="text-zinc-300">Summon Tickets:</span>
            <span className="text-amber-400 font-extrabold font-mono text-sm leading-none">{heroTickets}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs">
            <Sparkle className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-zinc-300">Valor Stockpile:</span>
            <span className="text-cyan-400 font-extrabold font-mono text-sm leading-none">{Math.floor(resources.valor)}</span>
          </div>
        </div>
      </div>

      {/* Primary Summoning Gacha Board Button */}
      <div className="shrink-0 flex gap-2">
        <button
          id="gacha-summon-btn"
          onClick={onDrawHero}
          className="flex-1 py-3 bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:brightness-110 active:scale-98 text-black font-extrabold rounded-xl text-xs tracking-wider uppercase shadow-xl transition-all font-mono border border-yellow-300 flex items-center justify-center gap-2"
        >
          {heroTickets > 0 ? (
            <>
              <Ticket className="w-4 h-4" />
              Summon Hero (Spend 1 Ticket)
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Summon (Exchange 50 Valor)
            </>
          )}
        </button>
      </div>

      {/* Rarity & Recruited Tabs Filters */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 px-0.5 scrollbar-thin scrollbar-thumb-zinc-800 shrink-0">
        {['All', 'Recruited', 'Mythic', 'Legendary', 'Epic', 'Rare', 'Common'].map((filter) => {
          const count = filter === 'All' 
            ? CROWNSPIRE_HEROES_DATABASE.length 
            : filter === 'Recruited'
            ? heroes.length
            : CROWNSPIRE_HEROES_DATABASE.filter(h => h.rarity === filter).length;
            
          return (
            <button
              key={filter}
              onClick={() => setRarityFilter(filter)}
              className={`px-3 py-1.5 text-[10px] font-mono tracking-wider rounded-lg border uppercase transition-all duration-150 cursor-pointer whitespace-nowrap ${
                rarityFilter === filter
                  ? 'bg-amber-500 text-black border-amber-400 font-extrabold shadow shadow-amber-500/10'
                  : 'bg-[#111319]/80 text-zinc-400 border-zinc-900/80 hover:text-white'
              }`}
            >
              {filter} ({count})
            </button>
          );
        })}
      </div>

      {/* Showcase Profile Menu Grid */}
      <div className="space-y-4 flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-8">
          {filteredHeroes.map((template) => {
            const activeRecruit = isRecruited(template.name);
            const data = getHeroData(template);
            const avatar = getHeroAvatar(template.name);
            const isGovernor = heroes.some((h, index) => h.name === template.name && index === currentHeroIndex);
            const rarityTheme = getRarityTheme(template.rarity);
            const resolvedStats = getHeroRecruitedStats(data);
            const maxLevel = data.level >= 10;
            const nextLvlXp = data.level * 100;

            return (
              <div
                key={template.id}
                id={`hero-card-${template.id}`}
                className={`relative rounded-2xl border bg-gradient-to-b overflow-hidden transition-all duration-300 p-3.5 flex flex-col justify-between ${
                  activeRecruit 
                    ? 'border-zinc-800/80 from-[#111319] to-[#0a0c0f] shadow-lg shadow-black/40 hover:border-amber-500/25' 
                    : 'border-zinc-950/60 from-zinc-950/40 to-zinc-950/20 opacity-45 grayscale select-none'
                }`}
              >
                {/* Hero Rarity & Role Badges */}
                <div className="absolute top-2.5 right-2 flex gap-1">
                  <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-mono font-extrabold uppercase border bg-black/60 ${rarityTheme}`}>
                    {template.rarity}
                  </span>
                  <span className="px-1.5 py-0.5 rounded-md text-[8px] font-mono font-extrabold uppercase border border-zinc-700/30 bg-black/60 text-zinc-400">
                    {template.role}
                  </span>
                </div>

                <div className="flex gap-3">
                  {/* Portrait avatar */}
                  <div className="relative shrink-0">
                    <img 
                      src={avatar} 
                      alt={template.name} 
                      referrerPolicy="no-referrer"
                      className="w-14 h-14 object-cover rounded-xl border border-zinc-800/60 shadow-md"
                    />
                    {activeRecruit && (data.ascension || 0) > 0 && (
                      <span className="absolute -bottom-1.5 -right-1 px-1.5 py-0.5 bg-cyan-400 text-black border border-cyan-200 font-mono text-[9px] font-black rounded-lg leading-none shadow">
                        +{data.ascension}
                      </span>
                    )}
                    {!activeRecruit && (
                      <div className="absolute inset-0 bg-black/80 rounded-xl flex items-center justify-center">
                        <span className="text-[10px] font-bold text-zinc-500">LOCKED</span>
                      </div>
                    )}
                  </div>

                  {/* Descriptions block */}
                  <div className="text-left flex-1 min-w-0">
                    <h4 className="font-serif font-black text-white text-xs leading-none flex items-center gap-1.5 truncate">
                      {template.name}
                      {activeRecruit && isGovernor && (
                        <span className="shrink-0 text-[7.5px] font-mono font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/35 px-1 rounded uppercase">Active Gov</span>
                      )}
                    </h4>
                    <span className="text-[9px] font-mono text-zinc-500 block mt-1 truncate">Ability: {template.skills[0]?.name}</span>
                    <span className="text-[9px] font-mono text-zinc-400 block mt-0.5 leading-tight italic line-clamp-1">"{template.description}"</span>
                    
                    <button
                      onClick={() => {
                        setSelectedLoreHero(template);
                        setActiveLoreTab('bio');
                      }}
                      className="mt-1 flex items-center gap-1 text-[8.5px] font-mono text-amber-500 hover:text-amber-400 border border-amber-500/20 hover:border-amber-500/40 bg-amber-500/5 hover:bg-amber-500/10 px-1.5 py-0.5 rounded cursor-pointer transition-all w-fit"
                    >
                      <Scroll className="w-2.5 h-2.5 text-amber-500" /> Lore Chronicles
                    </button>
                    
                    {activeRecruit ? (
                      <span className="text-[10px] font-mono text-zinc-400 block mt-1">
                        Shards: <span className="text-cyan-400 font-bold">{data.shards || 0}</span> / {template.ascensionLevels[(data.ascension || 0) + 1]?.shardsRequired ?? 'MAX'}
                      </span>
                    ) : (
                      <span className="text-[9.5px] font-mono text-zinc-500 block mt-1">
                        Unlocks with: <span className="text-zinc-400 font-bold">{template.shardRequirement} Shards</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Level indicators / action row if summoned */}
                {activeRecruit ? (
                  <div className="mt-3 pt-2.5 border-t border-zinc-900/60 space-y-2.5">
                    {/* Stats & Power indicators */}
                    <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
                      <div className="flex items-center gap-1 text-zinc-400 bg-black/45 px-1.5 py-0.5 rounded border border-zinc-900/50">
                        <Flame className="w-3.5 h-3.5 text-red-500" />
                        <span>ATK: <span className="text-white font-bold">{resolvedStats.attack}</span></span>
                      </div>
                      <div className="flex items-center gap-1 text-zinc-400 bg-black/45 px-1.5 py-0.5 rounded border border-zinc-900/50">
                        <Shield className="w-3.5 h-3.5 text-blue-500" />
                        <span>DEF: <span className="text-white font-bold">{resolvedStats.defense}</span></span>
                      </div>
                      <div className="flex items-center justify-center text-zinc-400 bg-black/45 px-1 rounded border border-zinc-900/50">
                        <span>PWR: <span className="text-yellow-400 font-bold">{resolvedStats.power}</span></span>
                      </div>
                    </div>

                    {/* Progress slider bar */}
                    <div className="flex items-center justify-between text-[8px] font-mono text-zinc-500">
                      <span>Level {data.level} / 10</span>
                      <span>{maxLevel ? 'MAX' : `${data.xp} / ${nextLvlXp} EXP`}</span>
                    </div>
                    {!maxLevel && (
                      <div className="w-full bg-zinc-950 rounded-full h-1 overflow-hidden">
                        <div 
                          className="h-full bg-amber-500 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (data.xp / nextLvlXp) * 100)}%` }}
                        />
                      </div>
                    )}

                    {/* Level Up & Deploy controllers */}
                    <div className="flex flex-col gap-1.5 pt-0.5">
                      <div className="flex gap-2">
                        {!maxLevel ? (
                          <button
                            onClick={() => onCommuneHeroScroll(template.name)}
                            className="flex-1 py-1 bg-[#1a150c] hover:bg-[#282012] border border-amber-900/40 text-amber-500 rounded text-[9.5px] font-mono flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Scroll className="w-3 h-3 text-amber-500" /> Train (+100 XP)
                          </button>
                        ) : (
                          <div className="flex-1 py-1 bg-zinc-950 border border-zinc-900 text-zinc-500 rounded text-[9px] font-mono text-center">
                            Max Level
                          </div>
                        )}

                        {!isGovernor && (
                          <button
                            onClick={() => {
                              const actualIdx = heroes.findIndex((h) => h.name === template.name);
                              if (actualIdx !== -1) {
                                onSetActiveHero(actualIdx);
                              }
                            }}
                            className="flex-1 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-850 text-zinc-350 rounded text-[9.5px] font-mono font-bold cursor-pointer"
                          >
                            Deploy Gov
                          </button>
                        )}
                      </div>

                      {/* Ascension trigger button */}
                      {(data.ascension || 0) < 5 ? (() => {
                        const nextAsc = (data.ascension || 0) + 1;
                        const reqShards = template.ascensionLevels[nextAsc]?.shardsRequired || 0;
                        const canAscend = (data.shards || 0) >= reqShards;
                        return (
                          <button
                            onClick={() => onAscendHero(template.name)}
                            disabled={!canAscend}
                            className={`py-1.5 rounded text-[9.5px] font-mono font-extrabold flex items-center justify-center gap-1.5 cursor-pointer transition-all border ${
                              canAscend
                                ? 'bg-[#0f2d3a] hover:bg-[#153e50] border-cyan-500/50 text-cyan-400'
                                : 'bg-[#111319]/20 border-zinc-900 text-zinc-600 cursor-not-allowed'
                            }`}
                          >
                            <Sparkle className="w-3.5 h-3.5" />
                            Ascend to +{nextAsc} ({data.shards || 0} / {reqShards} Shards)
                          </button>
                        );
                      })() : (
                        <div className="py-1 bg-cyan-950/20 border border-cyan-900/30 text-cyan-500 text-center text-[9px] font-mono rounded font-black max-w-full">
                          ★ Complete Ascension Mastered (+5)
                        </div>
                      )}

                      {/* Forge and manage gear button */}
                      <button
                        onClick={() => {
                          if (onManageEquipment) {
                            onManageEquipment(data.id || data.name);
                          }
                        }}
                        className="mt-1.5 py-1.5 bg-gradient-to-r from-amber-900/10 via-[#1a1309]/30 to-amber-900/10 border border-amber-500/20 hover:border-amber-500/45 text-amber-500 hover:text-white rounded text-[10px] font-mono font-black cursor-pointer flex items-center justify-center gap-1.5 transition-all w-full"
                      >
                        🛡️ Forge & Equip Legions
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 bg-black/25 p-2 rounded-xl text-center text-[9.5px] font-mono text-zinc-600 border border-zinc-950/60 italic">
                    Unsummoned. Spend tickets above to acquire and draft onto active columns!
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Lore Chronicles Modal Detail popup */}
      <AnimatePresence>
        {selectedLoreHero && (() => {
          const heroIdKey = selectedLoreHero.id.toLowerCase();
          const lore = HERO_LORE_DATABASE[heroIdKey] || {
            origin: "Unknown Territory",
            biography: selectedLoreHero.lore || "A mystery of the ancient records of Crownspire.",
            personality: "A soldier of discipline, trained in professional maneuvers.",
            relationships: "Maintains formal military coordination across the border outposts.",
            quote: "I fight for the crown of the spire.",
            recruitment: "Enlisted in the Active Sovereign ranks under standard commission."
          };
          const avatar = getHeroAvatar(selectedLoreHero.name);
          const rarityTheme = getRarityTheme(selectedLoreHero.rarity);

          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLoreHero(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto"
            >
              <motion.div
                initial={{ scale: 0.95, y: 15 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 15 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg bg-gradient-to-b from-[#11141e] via-[#0b0c11] to-[#06070a] border border-amber-500/20 rounded-2xl overflow-hidden shadow-2xl relative"
              >
                {/* Close Button top-right */}
                <button
                  onClick={() => setSelectedLoreHero(null)}
                  className="absolute top-4 right-4 text-zinc-500 hover:text-white bg-black/40 p-1.5 rounded-full border border-zinc-900 cursor-pointer hover:bg-zinc-900 transition-all z-10"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Hero Header Jumbotron */}
                <div className="bg-gradient-to-b from-[#1a1c24] to-[#0b0c11] p-5 pb-4 border-b border-zinc-900/40 flex gap-4 items-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 text-amber-500/5 pointer-events-none">
                    <BookOpen className="w-24 h-24 transform rotate-12" />
                  </div>
                  
                  {/* Portrait of Selected Hero */}
                  <div className="relative shrink-0">
                    <img 
                      src={avatar} 
                      alt={selectedLoreHero.name} 
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 object-cover rounded-2xl border border-zinc-700/40 shadow-lg"
                    />
                    <div className="absolute -bottom-1.5 left-1/2 transform -translate-x-1/2">
                      <span className={`px-2 py-0.5 rounded-md text-[8px] font-mono font-extrabold uppercase border bg-black/80 whitespace-nowrap shadow-md ${rarityTheme}`}>
                        {selectedLoreHero.rarity}
                      </span>
                    </div>
                  </div>

                  <div className="text-left flex-1 min-w-0">
                    <span className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-wider block">Hero Archives</span>
                    <h3 className="font-serif font-black text-white text-xl leading-none mt-1">{selectedLoreHero.name}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-900">
                        Role: {selectedLoreHero.role}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400 bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-900 capitalize">
                        Troop: {selectedLoreHero.troopType || 'None'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Styled Quote row */}
                <div className="px-5 py-3.5 bg-amber-500/[0.02] border-b border-zinc-950/70 flex gap-3 text-left items-start">
                  <Quote className="w-8 h-8 text-amber-500/15 shrink-0 transform scale-x-[-1]" />
                  <p className="text-xs font-mono italic text-amber-400/90 leading-relaxed mt-0.5">
                    "{lore.quote}"
                  </p>
                </div>

                {/* Tab layout controllers */}
                <div className="flex border-b border-zinc-950 bg-[#07080b]">
                  {[
                    { id: 'bio', label: 'Biography', icon: BookOpen },
                    { id: 'personality', label: 'Personality', icon: Users },
                    { id: 'recruitment', label: 'Chronicle', icon: Compass }
                  ].map((tab) => {
                    const TabIcon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveLoreTab(tab.id as any)}
                        className={`flex-1 py-3 text-xs font-mono font-bold tracking-wide uppercase border-b-2 flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          activeLoreTab === tab.id
                            ? 'text-amber-500 border-amber-500 bg-[#0f1118]'
                            : 'text-zinc-500 border-transparent hover:text-zinc-350'
                        }`}
                      >
                        <TabIcon className="w-3.5 h-3.5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>

                {/* Tab contents block */}
                <div className="p-6 text-left min-h-48 space-y-4">
                  {activeLoreTab === 'bio' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div>
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Kingdom Origin</span>
                        <div className="text-xs font-mono font-bold text-white bg-zinc-950 p-2.5 rounded-xl border border-zinc-900 flex items-center gap-2">
                          <Compass className="w-4 h-4 text-cyan-400" />
                          {lore.origin}
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Military Biography</span>
                        <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/20 p-3 rounded-xl border border-zinc-900/30">
                          {lore.biography}
                        </p>
                      </div>
                    </div>
                  )}

                  {activeLoreTab === 'personality' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div>
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Demeanor & Temperament</span>
                        <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-950/20 p-3 rounded-xl border border-zinc-900/30">
                          {lore.personality}
                        </p>
                      </div>
                      <div>
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Combat Relationships</span>
                        <p className="text-xs text-zinc-400 leading-relaxed bg-zinc-950/40 p-3 rounded-xl border border-zinc-900/40">
                          {lore.relationships}
                        </p>
                      </div>
                    </div>
                  )}

                  {activeLoreTab === 'recruitment' && (
                    <div className="space-y-4 animate-fadeIn">
                      <div>
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block mb-1">Sovereign Recruitment Story</span>
                        <p className="text-xs text-zinc-300 leading-relaxed bg-gradient-to-r from-amber-500/[0.04] to-transparent p-3.5 rounded-xl border border-amber-500/10 relative">
                          <span className="absolute top-2 right-2 text-amber-500/20 font-serif font-bold text-xl leading-none">C</span>
                          {lore.recruitment}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Close Bottom Row */}
                <div className="bg-[#07080b] px-5 py-3 border-t border-zinc-950 text-right">
                  <button
                    onClick={() => setSelectedLoreHero(null)}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 text-xs font-mono font-bold rounded-lg border border-zinc-800 transition-all cursor-pointer"
                  >
                    Close Archives
                  </button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
