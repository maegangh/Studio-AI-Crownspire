import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Ticket, 
  Shield, 
  Flame, 
  Award, 
  Info, 
  History, 
  Zap, 
  Sparkle,
  BookOpen, 
  ChevronRight,
  RefreshCw,
  TrendingUp,
  RotateCw,
  Eye,
  CheckCircle2,
  Lock,
  Compass
} from 'lucide-react';
import { Resources, Hero } from '../types';
import { CROWNSPIRE_HEROES_DATABASE, getHeroRecruitedStats, RarityType } from '../utils/heroDatabase';

interface SummonSceneModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Dynamic App State
  heroes: Hero[];
  setHeroes: React.Dispatch<React.SetStateAction<Hero[]>>;
  heroTickets: number;
  setHeroTickets: React.Dispatch<React.SetStateAction<number>>;
  resources: Resources;
  setResources: React.Dispatch<React.SetStateAction<Resources>>;
  addLog: (text: string, type: 'info' | 'success' | 'warning' | 'combat') => void;
}

interface DrawResult {
  id: string;
  name: string;
  rarity: RarityType;
  role: string;
  isNew: boolean;
  shardsAwarded: number;
  avatar: string;
  description: string;
  skills: string[];
}

const AVATARS = [
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250", // Elven
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250", // Woodsman
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250", // Warrior
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250", // Blacksmith
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250", // General
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=250", // Noble
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250", // Sorceress
  "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&q=80&w=250", // Squire
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250", // Rogue
  "https://images.unsplash.com/photo-1552058544-f2b08422138a?auto=format&fit=crop&q=80&w=250", // Scholar
  "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=250", // Highlander
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250", // Archer
];

export default function SummonSceneModal({
  isOpen,
  onClose,
  heroes,
  setHeroes,
  heroTickets,
  setHeroTickets,
  resources,
  setResources,
  addLog
}: SummonSceneModalProps) {
  const [activeTab, setActiveTab] = useState<'portal' | 'rates' | 'history'>('portal');
  
  // Persistent Gacha state tracking
  const [epicPity, setEpicPity] = useState<number>(0);
  const [legendaryPity, setLegendaryPity] = useState<number>(0);
  const [summonHistory, setSummonHistory] = useState<any[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cinematic state
  const [isCinematicActive, setIsCinematicActive] = useState<boolean>(false);
  const [isChargingPortal, setIsChargingPortal] = useState<boolean>(false);
  const [drawBatch, setDrawBatch] = useState<DrawResult[]>([]);
  const [currentRevealIndex, setCurrentRevealIndex] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const [showBatchResults, setShowBatchResults] = useState<boolean>(false);

  // Load state from localStorage
  useEffect(() => {
    try {
      const savedEpic = localStorage.getItem('crownspire_summon_epic_pity');
      const savedLegendary = localStorage.getItem('crownspire_summon_legendary_pity');
      const savedHistory = localStorage.getItem('crownspire_summon_history_v1');
      
      if (savedEpic) setEpicPity(parseInt(savedEpic, 10));
      if (savedLegendary) setLegendaryPity(parseInt(savedLegendary, 10));
      if (savedHistory) setSummonHistory(JSON.parse(savedHistory));
    } catch (e) {
      console.error('Failed to load summon altar storage data:', e);
    }
  }, [isOpen]);

  const saveSummonState = (nextEpic: number, nextLegendary: number, nextHistory: any[]) => {
    setEpicPity(nextEpic);
    setLegendaryPity(nextLegendary);
    setSummonHistory(nextHistory);
    
    localStorage.setItem('crownspire_summon_epic_pity', nextEpic.toString());
    localStorage.setItem('crownspire_summon_legendary_pity', nextLegendary.toString());
    localStorage.setItem('crownspire_summon_history_v1', JSON.stringify(nextHistory));
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!isOpen) return null;

  const getHeroAvatar = (name: string) => {
    const hash = Math.abs(name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0));
    return AVATARS[hash % AVATARS.length];
  };

  // --- Gacha Rolling Core Mechanics ---
  const rollGachaSingle = (
    currentEpic: number,
    currentLegendary: number,
    ownedHeroList: Hero[]
  ): { rolledHero: DrawResult; nextEpic: number; nextLegendary: number } => {
    let nextEpic = currentEpic + 1;
    let nextLegendary = currentLegendary + 1;
    let rolledRarity: RarityType = 'Common';

    // 1. Pity Overrides
    if (nextLegendary >= 40) {
      // Guaranteed Mythic/Legendary
      rolledRarity = Math.random() < 0.25 ? 'Mythic' : 'Legendary';
      nextLegendary = 0;
      nextEpic = 0; // Reset Epic pity on high roll
    } else if (nextEpic >= 10) {
      // Guaranteed Epic (or higher if lucky)
      const luck = Math.random();
      if (luck < 0.05) {
        rolledRarity = 'Mythic';
        nextLegendary = 0;
      } else if (luck < 0.20) {
        rolledRarity = 'Legendary';
        nextLegendary = 0;
      } else {
        rolledRarity = 'Epic';
      }
      nextEpic = 0;
    } else {
      // 2. Standard Probabilities
      const roll = Math.random();
      if (roll < 0.015) { // 1.5% Mythic
        rolledRarity = 'Mythic';
        nextLegendary = 0;
        nextEpic = 0;
      } else if (roll < 0.06) { // 4.5% Legendary
        rolledRarity = 'Legendary';
        nextLegendary = 0;
        nextEpic = 0;
      } else if (roll < 0.20) { // 14% Epic
        rolledRarity = 'Epic';
        nextEpic = 0;
      } else if (roll < 0.55) { // 35% Rare
        rolledRarity = 'Rare';
      } else { // 45% Common
        rolledRarity = 'Common';
      }
    }

    // Filter database for matching rarity
    const matchingTemplates = CROWNSPIRE_HEROES_DATABASE.filter(h => h.rarity === rolledRarity);
    const template = matchingTemplates[Math.floor(Math.random() * matchingTemplates.length)];
    
    // Check if player already owns this hero
    const isOwned = ownedHeroList.some(h => h.name === template.name || h.id === template.id);
    let shardsAwarded = 0;

    if (isOwned) {
      // Melt duplicate into shards based on rarity rules
      switch (rolledRarity) {
        case 'Mythic': shardsAwarded = 100; break;
        case 'Legendary': shardsAwarded = 50; break;
        case 'Epic': shardsAwarded = 20; break;
        case 'Rare': shardsAwarded = 10; break;
        default: shardsAwarded = 5; break;
      }
    }

    const rolledHero: DrawResult = {
      id: template.id,
      name: template.name,
      rarity: template.rarity,
      role: template.role,
      isNew: !isOwned,
      shardsAwarded,
      avatar: getHeroAvatar(template.name),
      description: template.description || 'A grand hero of Crownspire history.',
      skills: template.skills.map(s => s.name)
    };

    return { rolledHero, nextEpic, nextLegendary };
  };

  // --- Start Gacha Session ---
  const handlePerformSummon = (isTenfold: boolean) => {
    const requiredTickets = isTenfold ? 10 : 1;
    const requiredValor = isTenfold ? 500 : 50;

    let useTickets = false;
    let useValor = false;

    if (heroTickets >= requiredTickets) {
      useTickets = true;
    } else if (resources.valor >= requiredValor) {
      useValor = true;
    } else {
      triggerToast('⚠️ Insufficient tickets or Valor stockpile!');
      return;
    }

    // Deduct resources
    if (useTickets) {
      setHeroTickets(prev => prev - requiredTickets);
    } else if (useValor) {
      setResources(prev => ({ ...prev, valor: prev.valor - requiredValor }));
    }

    // Begin Animation Loop
    setIsCinematicActive(true);
    setIsChargingPortal(true);
    setIsCardFlipped(false);
    setShowBatchResults(false);
    setCurrentRevealIndex(0);

    const rollsCount = isTenfold ? 10 : 1;
    let tempEpic = epicPity;
    let tempLegendary = legendaryPity;
    let currentOwnedList = [...heroes];
    const results: DrawResult[] = [];
    const logsAdded: string[] = [];

    for (let i = 0; i < rollsCount; i++) {
      const { rolledHero, nextEpic, nextLegendary } = rollGachaSingle(tempEpic, tempLegendary, currentOwnedList);
      results.push(rolledHero);
      tempEpic = nextEpic;
      tempLegendary = nextLegendary;

      // Update owned hero list in iteration so subsequent rolls don't count same new hero as new
      if (rolledHero.isNew) {
        const typeMap: Record<string, 'Food' | 'Wood' | 'Stone' | 'Iron' | 'War'> = {
          'Food Production': 'Food',
          'Wood Production': 'Wood',
          'Stone Production': 'Stone',
          'Iron Production': 'Iron'
        };
        const template = CROWNSPIRE_HEROES_DATABASE.find(h => h.id === rolledHero.id) || CROWNSPIRE_HEROES_DATABASE[0];
        const passiveStat = template.passiveBonuses[0]?.stat || '';
        const mappedType = typeMap[passiveStat] || 'War';

        const recruitedStats = getHeroRecruitedStats({
          id: rolledHero.id,
          name: rolledHero.name,
          type: mappedType,
          level: 1,
          xp: 0,
          attack: template.baseAttack,
          defense: template.baseDefense,
          shards: 0,
          ascension: 0
        });

        const newHero: Hero = {
          id: rolledHero.id,
          name: rolledHero.name,
          type: mappedType,
          level: 1,
          xp: 0,
          attack: recruitedStats.attack,
          defense: recruitedStats.defense,
          shards: 0,
          ascension: 0,
          role: template.role,
          bonus: template.passiveBonuses[0]?.stat || 'Troop Attack',
          ability: template.skills[0]?.name || 'Special Strike'
        };
        currentOwnedList.push(newHero);
        logsAdded.push(`✨ HERO RECRUITED! '${rolledHero.name}' (${rolledHero.rarity} - ${rolledHero.role}) joined via Portal!`);
      } else {
        // Upgrade shards in list
        currentOwnedList = currentOwnedList.map(h => {
          if (h.id === rolledHero.id || h.name === rolledHero.name) {
            return {
              ...h,
              shards: (h.shards || 0) + rolledHero.shardsAwarded
            };
          }
          return h;
        });
        logsAdded.push(`💎 DUPLICATE SUMMON! Received duplicate for '${rolledHero.name}'. Melted into +${rolledHero.shardsAwarded} shards!`);
      }
    }

    // Apply React State Changes
    setHeroes(currentOwnedList);
    setDrawBatch(results);

    // Save History & Stats
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newHistoryEntries = results.map(r => ({
      name: r.name,
      rarity: r.rarity,
      status: r.isNew ? 'New Recruit' : `Duplicate (+${r.shardsAwarded} Shards)`,
      time: timestamp
    }));

    const updatedHistory = [...newHistoryEntries, ...summonHistory].slice(0, 50);
    saveSummonState(tempEpic, tempLegendary, updatedHistory);

    // Trigger charge time then reveal
    setTimeout(() => {
      setIsChargingPortal(false);
    }, 1800);

    // Stream logs
    logsAdded.forEach(logText => addLog(logText, 'success'));
  };

  const handleSkipAnimation = () => {
    setIsChargingPortal(false);
    setShowBatchResults(true);
  };

  const advanceReveal = () => {
    setIsCardFlipped(false);
    if (currentRevealIndex + 1 < drawBatch.length) {
      setCurrentRevealIndex(prev => prev + 1);
    } else {
      setShowBatchResults(true);
    }
  };

  const getRarityTheme = (rarity: RarityType) => {
    switch (rarity) {
      case 'Mythic':
        return {
          bg: 'from-red-950/85 via-black to-red-950/80',
          border: 'border-red-500/50',
          text: 'text-red-400',
          accentGlow: 'shadow-[0_0_40px_rgba(239,68,68,0.25)]',
          lightEffect: 'bg-red-500/10'
        };
      case 'Legendary':
        return {
          bg: 'from-amber-950/85 via-black to-amber-950/80',
          border: 'border-amber-500/50',
          text: 'text-amber-400',
          accentGlow: 'shadow-[0_0_40px_rgba(245,158,11,0.25)]',
          lightEffect: 'bg-amber-500/10'
        };
      case 'Epic':
        return {
          bg: 'from-purple-950/85 via-black to-purple-950/80',
          border: 'border-purple-500/40',
          text: 'text-purple-400',
          accentGlow: 'shadow-[0_0_35px_rgba(168,85,247,0.2)]',
          lightEffect: 'bg-purple-500/10'
        };
      case 'Rare':
        return {
          bg: 'from-blue-950/85 via-black to-blue-950/80',
          border: 'border-blue-500/40',
          text: 'text-blue-400',
          accentGlow: 'shadow-[0_0_30px_rgba(59,130,246,0.15)]',
          lightEffect: 'bg-blue-500/5'
        };
      default:
        return {
          bg: 'from-zinc-900/90 via-black to-zinc-900/80',
          border: 'border-zinc-700/40',
          text: 'text-zinc-400',
          accentGlow: '',
          lightEffect: 'bg-zinc-500/5'
        };
    }
  };

  const activeRevealHero = drawBatch[currentRevealIndex];
  const activeRevealTheme = activeRevealHero ? getRarityTheme(activeRevealHero.rarity) : null;

  return (
    <div 
      id="summon-portal-overlay-backdrop"
      className="fixed inset-0 bg-[#020306]/98 backdrop-blur-xl z-50 overflow-hidden flex flex-col justify-between"
    >
      {/* Dynamic Ambient Space Particle Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.02)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(245,158,11,0.01)_1px,transparent_1px)] bg-[size:100%_40px] opacity-10 pointer-events-none" />

      {/* Toast Overlay */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-[#12141c] border border-amber-500/40 px-6 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-mono font-bold tracking-wider text-amber-400"
          >
            <Sparkles className="w-4 h-4 animate-spin text-amber-500" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER CONTROLS */}
      {!isCinematicActive && (
        <div className="bg-[#07090e]/90 border-b border-zinc-900/50 p-4 shrink-0 flex flex-col md:flex-row md:items-center md:justify-between gap-4 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
              <Zap className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-serif font-black text-[#f3f4f6] tracking-widest uppercase flex items-center gap-2">
                Sovereign Summon Altar
              </h2>
              <p className="text-[10px] font-mono text-zinc-500 tracking-wide mt-0.5">
                Channel high-leyline currents to summon from 50 unique historical commanders
              </p>
            </div>
          </div>

          {/* ACTIVE BALANCES */}
          <div className="flex items-center gap-3">
            <div className="bg-zinc-950/60 border border-zinc-900/50 px-3 py-1.5 rounded-xl flex items-center gap-2">
              <Ticket className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Tickets</span>
              <span className="text-xs font-black font-mono text-amber-400">{heroTickets}</span>
            </div>
            <div className="bg-zinc-950/60 border border-zinc-900/50 px-3 py-1.5 rounded-xl flex items-center gap-2">
              <Sparkle className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Valor Stock</span>
              <span className="text-xs font-black font-mono text-cyan-400">{Math.floor(resources.valor)}</span>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-zinc-950/50 hover:bg-rose-950/30 border border-zinc-900 hover:border-rose-900/50 text-zinc-500 hover:text-rose-400 transition-all cursor-pointer z-20"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* PORTAL CINEMATIC RENDER CANVAS */}
      {isCinematicActive ? (
        <div className="flex-1 w-full relative flex items-center justify-center bg-black/90 z-40 overflow-hidden">
          
          {/* Skip Button Top-Right */}
          <button
            onClick={handleSkipAnimation}
            className="absolute top-6 right-6 px-4 py-2 bg-black/60 hover:bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 text-zinc-400 hover:text-white text-[10px] font-mono font-bold uppercase rounded-lg tracking-widest cursor-pointer transition-all active:scale-95 z-50 flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" /> Skip Cinematic
          </button>

          {isChargingPortal ? (
            /* LEYLINE CHARGE STAGE */
            <div className="flex flex-col items-center justify-center space-y-6 animate-pulse">
              <div className="relative w-48 h-48 rounded-full border border-amber-500/20 flex items-center justify-center">
                {/* Spinning portal bands */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-amber-500/30"
                />
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                  className="absolute inset-2 rounded-full border border-dashed border-cyan-500/30"
                />
                <motion.div 
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500/20 to-cyan-500/20 blur-xl absolute"
                />
                <Sparkles className="w-10 h-10 text-amber-500 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <div className="text-center">
                <h3 className="text-sm font-mono font-black text-amber-500 tracking-widest uppercase animate-bounce">
                  ⚡ Channeling Astral Spire...
                </h3>
                <p className="text-[9px] font-mono text-zinc-500 mt-1">
                  Synthesizing cosmic leylines into physical general templates
                </p>
              </div>
            </div>
          ) : showBatchResults ? (
            /* TENFOLD GRID RESULTS BOARD */
            <div className="max-w-4xl w-full h-full flex flex-col justify-between p-8 overflow-y-auto no-scrollbar">
              <div className="text-center space-y-1">
                <span className="text-[10px] font-mono font-black text-amber-500 uppercase tracking-widest">
                  Citadel Archives Ledger
                </span>
                <h2 className="text-lg font-serif font-black text-zinc-100 uppercase tracking-wider">
                  Summoning Results
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 my-8">
                {drawBatch.map((hero, index) => {
                  const theme = getRarityTheme(hero.rarity);
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 15, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.08 }}
                      className={`p-3 bg-gradient-to-b ${theme.bg} rounded-2xl border ${theme.border} text-left flex flex-col justify-between relative overflow-hidden h-[160px]`}
                    >
                      {/* New Banner badge */}
                      {hero.isNew && (
                        <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 bg-emerald-500 text-black font-mono font-black text-[8px] tracking-wider rounded">
                          NEW
                        </span>
                      )}

                      <div className="space-y-2">
                        <span className={`text-[8px] font-mono uppercase tracking-wider ${theme.text}`}>
                          {hero.rarity}
                        </span>
                        
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-zinc-800">
                          <img 
                            src={hero.avatar} 
                            alt={hero.name} 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>

                        <h4 className="text-[11px] font-serif font-black text-zinc-100 truncate mt-1">
                          {hero.name}
                        </h4>
                      </div>

                      <div className="border-t border-zinc-900/60 pt-1 text-[8.5px] font-mono text-zinc-500">
                        {hero.isNew ? (
                          <span className="text-emerald-400 font-bold">First Recruit</span>
                        ) : (
                          <span className="text-amber-500 font-bold">+{hero.shardsAwarded} Shards</span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="flex justify-center shrink-0">
                <button
                  onClick={() => setIsCinematicActive(false)}
                  className="px-8 py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:brightness-115 active:scale-98 text-black text-xs font-mono font-black tracking-wider uppercase rounded-xl transition-all cursor-pointer"
                >
                  Confirm and Return to Altar
                </button>
              </div>
            </div>
          ) : (
            /* SINGLE CARD REVEAL MODE */
            <div className="max-w-md w-full p-4 flex flex-col items-center space-y-6">
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentRevealIndex}
                  initial={{ rotateY: 90, opacity: 0 }}
                  animate={{ rotateY: 0, opacity: 1 }}
                  exit={{ rotateY: -90, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setIsCardFlipped(prev => !prev)}
                  className={`w-full max-w-[310px] aspect-[3/4.5] rounded-3xl bg-gradient-to-b ${activeRevealTheme?.bg} border-2 ${activeRevealTheme?.border} ${activeRevealTheme?.accentGlow} p-5 flex flex-col justify-between relative overflow-hidden cursor-pointer select-none`}
                >
                  {/* Holographic light effect */}
                  <div className={`absolute inset-0 ${activeRevealTheme?.lightEffect} mix-blend-overlay opacity-40 pointer-events-none`} />

                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-mono font-black tracking-widest px-2 py-0.5 rounded border border-zinc-800 uppercase ${activeRevealTheme?.text}`}>
                      {activeRevealHero.rarity}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500">
                      Card {currentRevealIndex + 1}/{drawBatch.length}
                    </span>
                  </div>

                  <div className="my-4 flex flex-col items-center">
                    <div className="relative w-36 h-36 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
                      <img 
                        src={activeRevealHero.avatar} 
                        alt={activeRevealHero.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <h3 className="text-base font-serif font-black text-zinc-100 uppercase tracking-widest mt-4">
                      {activeRevealHero.name}
                    </h3>
                    <p className="text-[10px] font-mono text-amber-500/80 tracking-wider">
                      {activeRevealHero.role} Commander
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="bg-[#05060b] border border-zinc-950 p-2.5 rounded-xl text-center min-h-[44px]">
                      <p className="text-[9.5px] font-mono text-zinc-400 leading-tight">
                        {activeRevealHero.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-center">
                      {activeRevealHero.isNew ? (
                        <span className="text-[9px] font-mono font-black text-emerald-400 flex items-center gap-1 bg-emerald-950/40 px-3 py-1 border border-emerald-900/30 rounded-full">
                          ✨ NEW RECRUIT ACQUIRED
                        </span>
                      ) : (
                        <div className="text-center">
                          <span className="text-[9px] font-mono font-black text-amber-500 flex items-center gap-1 bg-amber-950/40 px-3 py-1 border border-amber-900/30 rounded-full justify-center">
                            💎 DUPLICATE CONVERTED
                          </span>
                          <p className="text-[8.5px] font-mono text-zinc-500 mt-1">
                            +{activeRevealHero.shardsAwarded} shards registered to training bank
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <button
                onClick={advanceReveal}
                className="px-6 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-350 text-xs font-mono font-bold tracking-wider uppercase rounded-xl flex items-center gap-1 cursor-pointer"
              >
                Reveal Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      ) : (
        /* ALTAR DASHBOARD BODY */
        <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden z-10">
          
          {/* NAVIGATION TAB TRAY */}
          <div className="w-full md:w-[180px] bg-[#07090e]/50 border-r border-zinc-900/30 p-3 flex flex-col gap-1.5 shrink-0">
            {[
              { id: 'portal', label: '🔮 Altar Portal', desc: 'Channel leylines' },
              { id: 'rates', label: '📊 Drop Odds', desc: 'Check percentages' },
              { id: 'history', label: '📜 Summon Ledger', desc: 'Past epochs' }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`p-3 text-left rounded-xl border flex flex-col gap-0.5 transition-all cursor-pointer whitespace-nowrap active:scale-97 ${
                    isActive
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      : 'bg-zinc-950/20 border-zinc-900/50 hover:border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <span className="text-xs font-mono font-bold tracking-wider">{tab.label}</span>
                  <span className="text-[8.5px] font-mono text-zinc-500">{tab.desc}</span>
                </button>
              );
            })}
          </div>

          {/* ACTIVE CONTENT GRID */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-6">
            
            {activeTab === 'portal' && (
              <div className="h-full flex flex-col justify-between space-y-6">
                
                {/* Visual Leyline Core Centerpiece */}
                <div className="flex-1 flex flex-col items-center justify-center relative py-6">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <div className="w-96 h-96 rounded-full border border-dashed border-amber-500 animate-spin" style={{ animationDuration: '40s' }} />
                    <div className="w-80 h-80 rounded-full border border-dashed border-cyan-500 animate-spin absolute" style={{ animationDuration: '30s', animationDirection: 'reverse' }} />
                  </div>

                  <div className="relative w-56 h-56 rounded-full bg-gradient-to-br from-amber-500/5 to-cyan-500/5 border border-zinc-800 flex items-center justify-center shadow-2xl z-10">
                    <div className="absolute w-44 h-44 rounded-full border-2 border-dashed border-amber-500/25 animate-spin" style={{ animationDuration: '20s' }} />
                    <div className="absolute w-36 h-36 rounded-full border border-dashed border-cyan-500/25 animate-spin" style={{ animationDuration: '10s', animationDirection: 'reverse' }} />
                    <motion.div 
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ repeat: Infinity, duration: 3 }}
                      className="w-20 h-20 rounded-full bg-amber-500/15 flex items-center justify-center border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.1)]"
                    >
                      <Sparkles className="w-8 h-8 text-amber-500/80" />
                    </motion.div>
                  </div>

                  {/* ACTIVE PITY GAUGES */}
                  <div className="mt-6 max-w-sm w-full bg-[#07090e]/60 border border-zinc-900/50 p-4 rounded-2xl space-y-3 z-10">
                    <h4 className="text-[10px] font-mono font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 justify-center">
                      🔮 Active Altar Calibration
                    </h4>

                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-[9px] font-mono">
                          <span className="text-zinc-500">Epic Commander Pity</span>
                          <span className="text-amber-500 font-bold">{10 - (epicPity % 10)} pulls remaining</span>
                        </div>
                        <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-900/60">
                          <div 
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${((epicPity % 10) / 10) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[9px] font-mono">
                          <span className="text-zinc-500">Cosmic Legendary/Mythic Pity</span>
                          <span className="text-cyan-400 font-bold">{40 - legendaryPity} pulls remaining</span>
                        </div>
                        <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-900/60">
                          <div 
                            className="h-full bg-cyan-400 rounded-full"
                            style={{ width: `${(legendaryPity / 40) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOTTOM SUMMON BUTTONS ROW */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 shrink-0">
                  
                  {/* Single summon card */}
                  <div className="bg-[#07090e]/50 border border-zinc-900/50 p-4 rounded-2xl flex flex-col justify-between gap-3 text-center">
                    <div>
                      <h4 className="text-xs font-mono font-black text-zinc-200 uppercase tracking-wider">
                        Single Channel Portal
                      </h4>
                      <p className="text-[9.5px] font-mono text-zinc-500 mt-0.5">
                        Perform a single summon utilizing tickets or 50 Valor
                      </p>
                    </div>
                    <button
                      onClick={() => handlePerformSummon(false)}
                      className="py-3 bg-zinc-900 hover:bg-[#12141c] border border-zinc-800 hover:border-amber-500/50 text-amber-500 hover:text-white font-mono font-black text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer active:scale-97 flex items-center justify-center gap-1.5"
                    >
                      {heroTickets >= 1 ? (
                        <>
                          <Ticket className="w-4 h-4 text-amber-500" />
                          Summon (Spend 1 Ticket)
                        </>
                      ) : (
                        <>
                          <Sparkle className="w-4 h-4 text-cyan-400" />
                          Summon (50 Valor Exchange)
                        </>
                      )}
                    </button>
                  </div>

                  {/* Tenfold summon card */}
                  <div className="bg-[#07090e]/50 border border-zinc-900/50 p-4 rounded-2xl flex flex-col justify-between gap-3 text-center">
                    <div>
                      <h4 className="text-xs font-mono font-black text-zinc-200 uppercase tracking-wider">
                        Tenfold Altar Rally
                      </h4>
                      <p className="text-[9.5px] font-mono text-zinc-500 mt-0.5">
                        Channel massive leyline nodes. Guarantees Epic or higher!
                      </p>
                    </div>
                    <button
                      onClick={() => handlePerformSummon(true)}
                      className="py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:brightness-110 text-black font-mono font-black text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer active:scale-97 flex items-center justify-center gap-1.5"
                    >
                      {heroTickets >= 10 ? (
                        <>
                          <Ticket className="w-4 h-4" />
                          Summon 10x (Spend 10 Tickets)
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Summon 10x (500 Valor Exchange)
                        </>
                      )}
                    </button>
                  </div>

                </div>

              </div>
            )}

            {activeTab === 'rates' && (
              <div className="space-y-6">
                <div className="border-b border-zinc-900/60 pb-3">
                  <h3 className="text-sm font-serif font-black text-zinc-100 uppercase tracking-wider">
                    🔮 Spire Altar Portal Drop Odds
                  </h3>
                  <p className="text-[10px] font-mono text-zinc-500 mt-0.5">
                    Official drop percentages regulated under active leyline calibrations
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                  {[
                    { label: 'Mythic', rate: '1.5%', bg: 'from-red-950/20 to-black text-red-400 border-red-900/30' },
                    { label: 'Legendary', rate: '4.5%', bg: 'from-amber-950/20 to-black text-amber-400 border-amber-900/30' },
                    { label: 'Epic', rate: '14.0%', bg: 'from-purple-950/20 to-black text-purple-400 border-purple-900/30' },
                    { label: 'Rare', rate: '35.0%', bg: 'from-blue-950/20 to-black text-blue-400 border-blue-900/30' },
                    { label: 'Common', rate: '45.0%', bg: 'from-zinc-950/20 to-black text-zinc-400 border-zinc-900/30' }
                  ].map(tier => (
                    <div key={tier.label} className={`p-4 rounded-xl border bg-gradient-to-b ${tier.bg} text-center space-y-1`}>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold">Rarity</span>
                      <h4 className="text-xs font-mono font-black">{tier.label}</h4>
                      <div className="text-sm font-mono font-black mt-2">{tier.rate}</div>
                    </div>
                  ))}
                </div>

                {/* Database Rarity Roster Preview */}
                <div className="bg-[#07090e]/50 border border-zinc-900/50 p-5 rounded-2xl space-y-4">
                  <h4 className="text-[11px] font-mono font-black text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-amber-500" /> Summonable Altar Commander Pool
                  </h4>

                  <div className="space-y-4">
                    {(['Mythic', 'Legendary', 'Epic', 'Rare', 'Common'] as const).map(rarity => {
                      const pool = CROWNSPIRE_HEROES_DATABASE.filter(h => h.rarity === rarity);
                      if (pool.length === 0) return null;
                      return (
                        <div key={rarity} className="space-y-1.5">
                          <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-wider block">
                            {rarity} Pool ({pool.length} Commanders)
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {pool.map(hero => (
                              <span 
                                key={hero.id} 
                                className="px-2.5 py-1 bg-zinc-950/60 border border-zinc-900 text-[10px] font-mono text-zinc-300 rounded-lg flex items-center gap-1"
                              >
                                {hero.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'history' && (
              <div className="space-y-4">
                <div className="border-b border-zinc-900/60 pb-3 flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-serif font-black text-zinc-100 uppercase tracking-wider">
                      📜 Chronological Altar Ledger
                    </h3>
                    <p className="text-[10px] font-mono text-zinc-500 mt-0.5">
                      Your past 50 recorded summoning results in this active epoch
                    </p>
                  </div>
                  {summonHistory.length > 0 && (
                    <button
                      onClick={() => {
                        setSummonHistory([]);
                        localStorage.removeItem('crownspire_summon_history_v1');
                        triggerToast('Altar records cleared!');
                      }}
                      className="px-3 py-1.5 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/40 text-rose-400 text-[10px] font-mono font-bold uppercase rounded-lg transition-all cursor-pointer"
                    >
                      Clear Records
                    </button>
                  )}
                </div>

                {summonHistory.length === 0 ? (
                  <div className="h-48 flex flex-col justify-center items-center text-center p-6 bg-[#07090e]/20 border border-dashed border-zinc-900/50 rounded-2xl">
                    <History className="w-8 h-8 text-zinc-700 animate-pulse mb-2" />
                    <p className="text-xs font-mono text-zinc-500">
                      No recruits recorded in this epoch. Charge the Altar core!
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#07090e]/40 border border-zinc-900/50 rounded-2xl overflow-hidden">
                    <table className="w-full text-left font-mono text-[11px]">
                      <thead>
                        <tr className="bg-zinc-950/80 border-b border-zinc-900 text-zinc-500 uppercase tracking-wider">
                          <th className="p-3">Commander Name</th>
                          <th className="p-3">Rarity</th>
                          <th className="p-3">Status / Yield</th>
                          <th className="p-3 text-right">Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900/40">
                        {summonHistory.map((item, index) => {
                          const isNew = item.status === 'New Recruit';
                          return (
                            <tr key={index} className="hover:bg-zinc-900/20 text-zinc-300">
                              <td className="p-3 font-serif font-black text-zinc-100">{item.name}</td>
                              <td className="p-3">
                                <span className={`font-black uppercase text-[10px] ${
                                  item.rarity === 'Mythic' ? 'text-red-400' :
                                  item.rarity === 'Legendary' ? 'text-amber-500' :
                                  item.rarity === 'Epic' ? 'text-purple-400' :
                                  item.rarity === 'Rare' ? 'text-blue-400' : 'text-zinc-500'
                                }`}>
                                  {item.rarity}
                                </span>
                              </td>
                              <td className="p-3">
                                {isNew ? (
                                  <span className="text-emerald-400 font-bold bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-900/30">
                                    {item.status}
                                  </span>
                                ) : (
                                  <span className="text-amber-500 bg-amber-950/20 px-2 py-0.5 rounded border border-amber-900/20">
                                    {item.status}
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-right text-zinc-500">{item.time}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
}
