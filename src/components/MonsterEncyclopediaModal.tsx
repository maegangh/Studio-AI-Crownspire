import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { 
  X, 
  Search, 
  Compass, 
  Skull, 
  Swords, 
  ShieldAlert, 
  Sparkles, 
  BookOpen, 
  Crown, 
  Flame, 
  Award, 
  Heart,
  Activity,
  Shield,
  Zap
} from 'lucide-react';
import { MONSTER_LORE_DATABASE, MonsterLore } from '../utils/monsterLore';

interface MonsterEncyclopediaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MonsterEncyclopediaModal({ isOpen, onClose }: MonsterEncyclopediaModalProps) {
  const [activeCategory, setActiveCategory] = useState<'Common' | 'Elite' | 'World Boss'>('Common');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonsterId, setSelectedMonsterId] = useState<string>('goblin_pillager');

  // Group monsters from database
  const monstersList = useMemo(() => {
    return Object.values(MONSTER_LORE_DATABASE);
  }, []);

  // Filter lists based on selected target tab and searches
  const filteredMonsters = useMemo(() => {
    return monstersList.filter(mo => {
      const matchesCategory = mo.rarity === activeCategory;
      const matchesSearch = 
        mo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mo.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mo.habitat.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [monstersList, activeCategory, searchQuery]);

  // Handle active category tab switches (auto-select first item)
  const handleCategoryChange = (category: 'Common' | 'Elite' | 'World Boss') => {
    setActiveCategory(category);
    const defaults: Record<string, string> = {
      'Common': 'goblin_pillager',
      'Elite': 'infernal_drake',
      'World Boss': 'gorgon_emperor'
    };
    setSelectedMonsterId(defaults[category]);
  };

  const selectedMonster = useMemo(() => {
    return MONSTER_LORE_DATABASE[selectedMonsterId] || monstersList[0];
  }, [selectedMonsterId, monstersList]);

  if (!isOpen) return null;

  // Helpers to style colors beautifully
  const getDangerTheme = (danger: string) => {
    switch (danger) {
      case 'Low': 
        return {
          pill: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          glow: 'shadow-[0_0_15px_rgba(16,185,129,0.1)]',
          textColor: 'text-emerald-400',
          gradient: 'from-emerald-900/10 via-zinc-950/20 to-zinc-950/50'
        };
      case 'Minor': 
        return {
          pill: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
          glow: 'shadow-[0_0_15px_rgba(20,184,166,0.1)]',
          textColor: 'text-teal-400',
          gradient: 'from-teal-900/10 via-zinc-950/20 to-zinc-950/50'
        };
      case 'High': 
        return {
          pill: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
          glow: 'shadow-[0_0_15px_rgba(168,85,247,0.15)]',
          textColor: 'text-purple-400',
          gradient: 'from-purple-900/10 via-zinc-950/20 to-zinc-950/50'
        };
      case 'Extreme': 
        return {
          pill: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          glow: 'shadow-[0_0_15px_rgba(245,158,11,0.2)]',
          textColor: 'text-amber-400',
          gradient: 'from-amber-900/15 via-zinc-950/20 to-zinc-950/50'
        };
      case 'Cataclysmic': 
        return {
          pill: 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse',
          glow: 'shadow-[0_0_25px_rgba(239,68,68,0.25)]',
          textColor: 'text-red-500 font-black',
          gradient: 'from-red-950/30 via-zinc-950/20 to-zinc-950/50'
        };
      default:
        return {
          pill: 'bg-zinc-500/10 text-zinc-450 border-zinc-500/20',
          glow: '',
          textColor: 'text-zinc-400',
          gradient: 'from-zinc-900/10 to-zinc-950/50'
        };
    }
  };

  const currentTheme = getDangerTheme(selectedMonster.dangerLevel);

  return (
    <AnimatePresence>
      <motion.div 
        id="beast-encyclopedia-root-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto"
      >
        <motion.div 
          initial={{ scale: 0.95, y: 15 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 15 }}
          className="w-full max-w-5xl h-[94vh] sm:h-[88vh] bg-[#07090f] border border-amber-500/20 rounded-2xl flex flex-col overflow-hidden shadow-2xl relative"
        >
          {/* Ancient Runes Grid Ornament Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />

          {/* Upper Title Header */}
          <div className="bg-gradient-to-r from-[#0d1222] via-[#07090f] to-[#0d1222] px-6 py-4 border-b border-amber-500/10 shrink-0 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400 shadow-md">
                <BookOpen className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-left">
                <span className="text-[9px] font-mono font-black text-amber-500 tracking-[0.25em] uppercase block">Kingdom Chronicles</span>
                <h2 className="text-lg font-bold font-serif text-white tracking-tight flex items-center gap-1.5 leading-none mt-1">
                  Crownspire Bestiary Encyclopedia
                </h2>
              </div>
            </div>

            <button 
              id="close-bestiary-btn"
              onClick={onClose}
              className="text-zinc-550 hover:text-white bg-zinc-950/60 hover:bg-zinc-900 border border-zinc-900 p-2 rounded-xl transition-all cursor-pointer shadow-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sub-Category Navigators */}
          <div className="bg-[#0b0f1a] border-b border-[#12182a] py-2 px-4 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 relative z-10">
            <div className="flex gap-1.5 w-full sm:w-auto">
              {[
                { id: 'Common', icon: '👹', label: 'Common Specimen' },
                { id: 'Elite', icon: '🟣', label: 'Elite Fiends' },
                { id: 'World Boss', icon: '🐉', label: 'Raid World Bosses' }
              ].map(cat => (
                <button
                  id={`cat-bestiary-${cat.id}`}
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id as any)}
                  className={`flex-1 sm:flex-none px-3.5 py-1.5 text-[11px] font-mono font-black uppercase tracking-tight rounded-lg border transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-gradient-to-b from-amber-600 to-amber-500 text-black border-amber-300 font-extrabold shadow-md shadow-amber-950/10'
                      : 'bg-[#101422] border-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-900'
                  }`}
                >
                  <span className="text-xs leading-none">{cat.icon}</span>
                  <span className="hidden xs:inline">{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Quick Live Search bar */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="bestiary-search-input"
                type="text"
                value={searchQuery}
                placeholder="Search beast name or habitat..."
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#05060a] border border-zinc-800 text-xs text-white rounded-lg pl-9 pr-4 py-1.5 outline-none focus:border-amber-500/50 transition-colors"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="text-[10px] text-zinc-400 hover:text-white absolute right-2.5 top-1/2 -translate-y-1/2"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Main Workspace split screen */}
          <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-4 relative">
            
            {/* Sidebar species list container */}
            <div className="md:col-span-1 border-r border-[#12182a] bg-[#05060b] overflow-y-auto flex flex-col p-3 gap-1.5">
              <span className="text-[8px] font-mono text-zinc-550 uppercase tracking-widest font-bold px-1.5 mb-1 block">
                Index ({filteredMonsters.length} Found)
              </span>

              {filteredMonsters.length === 0 ? (
                <div className="text-center py-12 text-zinc-500 font-mono text-xs">
                  No beasts matched query.
                </div>
              ) : (
                filteredMonsters.map(mo => {
                  const isSelected = selectedMonsterId === mo.id;
                  const moTheme = getDangerTheme(mo.dangerLevel);
                  return (
                    <button
                      id={`sidebar-beast-${mo.id}`}
                      key={mo.id}
                      onClick={() => setSelectedMonsterId(mo.id)}
                      className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all duration-150 cursor-pointer ${
                        isSelected 
                          ? 'bg-gradient-to-r from-amber-950/15 via-[#111422] to-zinc-950 border-amber-500/50 shadow-md'
                          : 'bg-zinc-950/40 border-zinc-900/60 hover:bg-[#0c0f1b]'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs shrink-0 select-none">{mo.emoji}</span>
                          <h4 className="font-serif font-black text-white text-xs truncate leading-tight">
                            {mo.name}
                          </h4>
                        </div>
                        <span className="text-[8px] font-mono text-zinc-550 truncate block mt-1 uppercase">
                          {mo.habitat}
                        </span>
                      </div>
                      
                      <div className="shrink-0 flex flex-col items-end">
                        <span className={`text-[8.5px] font-mono font-black ${moTheme.textColor}`}>
                          {mo.dangerLevel}
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Detailed right-side showcase panel */}
            <div className="md:col-span-3 bg-gradient-to-b from-[#080b13] via-[#040608] to-[#010204] overflow-y-auto p-4 sm:p-6 space-y-5">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedMonster.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.18 }}
                  className="space-y-5 text-left"
                >
                  {/* Hero Jumbotron Section */}
                  <div className={`p-4 sm:p-5 rounded-2xl border border-amber-500/10 bg-gradient-to-br ${currentTheme.gradient} ${currentTheme.glow} relative overflow-hidden flex flex-col sm:flex-row gap-5 items-start`}>
                    
                    {/* Visual Art/Emoji representation card */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-black/60 border border-zinc-800/80 flex flex-col items-center justify-center shrink-0 shadow-lg relative relative-element select-none text-red-500/10">
                      {/* Grid overlay inside picture frame */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-1" />
                      <span className="text-4xl sm:text-5xl select-none z-10 transform hover:scale-110 transition-transform duration-300">
                        {selectedMonster.emoji}
                      </span>
                      <span className="text-[8px] font-mono leading-none bg-black/95 text-zinc-400 px-2 py-0.5 rounded border border-zinc-800 absolute -bottom-1.5 z-10 text-center whitespace-nowrap uppercase">
                        Specimen Art
                      </span>
                    </div>

                    {/* Metadata column */}
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-black uppercase border tracking-widest ${currentTheme.pill}`}>
                          {selectedMonster.rarity} WARNING
                        </span>
                        <span className="px-2 py-0.5 rounded text-[8px] font-mono font-black text-amber-400 bg-amber-950/20 border border-amber-900/30 tracking-tight">
                          THREAT rating: {selectedMonster.threatRating}
                        </span>
                      </div>

                      <h3 className="font-serif font-black text-white text-xl sm:text-2xl leading-none">
                        {selectedMonster.name}
                      </h3>

                      <p className="text-xs text-zinc-250 italic leading-relaxed pt-0.5 max-w-2xl bg-black/30 p-2.5 rounded-lg border border-zinc-900/40">
                        "{selectedMonster.description}"
                      </p>
                    </div>
                  </div>

                  {/* Split parameters grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Left Column: Tactician parameters */}
                    <div className="space-y-3.5">
                      
                      {/* Habitat box */}
                      <div className="bg-[#0b0c11] border border-zinc-900 rounded-xl p-4.5 space-y-2">
                        <div className="flex items-center gap-2 text-cyan-400">
                          <Compass className="w-4 h-4 shrink-0" />
                          <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-slate-100">
                            Wilderness Habitat & Terrane
                          </h4>
                        </div>
                        <p className="text-xs text-zinc-300 pl-6 leading-relaxed">
                          {selectedMonster.habitat}
                        </p>
                      </div>

                      {/* Tactical Weakness */}
                      <div className="bg-[#100b0d] border border-red-950/30 rounded-xl p-4.5 space-y-2">
                        <div className="flex items-center gap-2 text-rose-400">
                          <ShieldAlert className="w-4 h-4 shrink-0" />
                          <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-slate-100">
                            Tactical Combat Weakness
                          </h4>
                        </div>
                        <p className="text-xs text-rose-300 font-medium pl-6 leading-relaxed bg-rose-950/20 p-2.5 rounded-lg border border-rose-950/30">
                          {selectedMonster.weakness}
                        </p>
                      </div>

                      {/* General Battle Strategy */}
                      <div className="bg-[#0b1011] border border-teal-950/30 rounded-xl p-4.5 space-y-2">
                        <div className="flex items-center gap-2 text-teal-400">
                          <Swords className="w-4 h-4 shrink-0" />
                          <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-slate-100">
                            Beastmaster Battle Strategy
                          </h4>
                        </div>
                        <p className="text-xs text-zinc-300 pl-6 leading-relaxed">
                          {selectedMonster.strategy}
                        </p>
                      </div>

                    </div>

                    {/* Right Column: Lore & Legends scroll */}
                    <div className="bg-[#0d0a06]/50 border border-amber-900/10 rounded-2xl p-5 space-y-3 flex flex-col justify-between relative">
                      <div className="absolute top-3 right-3 text-amber-500/5 pointer-events-none">
                        <BookOpen className="w-16 h-16 transform rotate-6" />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 text-amber-500 mb-2">
                          <Crown className="w-4 h-4 shrink-0" />
                          <h4 className="font-serif font-black text-xs uppercase tracking-widest">
                            Sovereign Chronicle of Legends
                          </h4>
                        </div>
                        <p className="text-xs text-zinc-300 leading-relaxed indent-4 font-sans max-h-[170px] overflow-y-auto pr-1">
                          {selectedMonster.lore}
                        </p>
                      </div>

                      <div className="border-t border-amber-500/10 pt-3 flex items-center justify-between">
                        <span className="text-[8px] font-mono text-zinc-550 uppercase">AUTHENTIC TEXT ARCHIVES</span>
                        <span className="text-[10px] text-amber-500 font-serif italic text-right">Written in 246 ASE</span>
                      </div>
                    </div>

                  </div>

                  {/* Bottom Block: Claimable Drops and Tributes */}
                  <div className="bg-[#0b0c12] border border-zinc-900 rounded-2xl p-5 space-y-3.5">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Award className="w-4.5 h-4.5" />
                      <h4 className="font-serif font-extrabold text-xs uppercase tracking-wider text-slate-100">
                        Sanctioned Conquest Rewards & Tributes
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 xs:grid-cols-4 gap-2.5">
                      {selectedMonster.rewards.map((reward, idx) => (
                        <div
                          key={idx}
                          className="bg-black/60 border border-zinc-800 hover:border-emerald-500/30 p-3 rounded-xl flex items-center gap-2.5 transition-all hover:bg-zinc-950 text-left cursor-default shadow-sm group"
                        >
                          <div className="p-1 bg-emerald-500/10 rounded border border-emerald-500/20 text-emerald-400 group-hover:scale-115 transition-transform">
                            <Sparkles className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <span className="text-[8px] font-mono text-zinc-500 uppercase block leading-none mb-1">Guaranteed</span>
                            <span className="text-xs text-zinc-200 font-bold leading-tight font-serif block group-hover:text-amber-400 transition-colors">
                              {reward}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-[9.5px] font-mono text-zinc-500 flex justify-between items-center bg-black/30 p-2.5 rounded-lg border border-zinc-950">
                      <span>* Note: Reward items and materials scale proportionally based on active battle region levels.</span>
                      <span className="hidden sm:inline-block text-emerald-500 font-extrabold">STATUS: SECURE 💎</span>
                    </div>

                  </div>

                </motion.div>
              </AnimatePresence>

            </div>

          </div>

          {/* Bottom Footer Section */}
          <div className="bg-[#07090f] p-4 border-t border-amber-500/10 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 relative z-10">
            <span className="text-[10px] font-mono text-amber-500/60 text-center sm:text-left">
              * Conquering beasts requires 10 to 40 stamina per deploy run depending on target monster rarity level.
            </span>
            <button
              id="close-bestiary-footer-btn"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 hover:text-white text-zinc-300 text-xs font-mono font-bold rounded-xl transition-all cursor-pointer shadow-md"
            >
              Close Chronicles
            </button>
          </div>

        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
