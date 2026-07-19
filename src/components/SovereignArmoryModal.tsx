import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Hammer, 
  Shield, 
  Sparkles, 
  Star, 
  ChevronRight, 
  Trash2, 
  Plus, 
  Zap, 
  Info, 
  Flame, 
  Package, 
  Gem, 
  RotateCcw,
  ArrowUp,
  UserCheck,
  Play,
  Volume2,
  BookOpen,
  Award
} from 'lucide-react';
import { Resources, Hero } from '../types';
import { 
  UserEquipment, 
  EquipmentTemplate, 
  SET_BONUSES_DATABASE, 
  EQUIPMENT_TEMPLATES, 
  EQUIPMENT_MATERIALS,
  calculateItemStats,
  getUpgradeCost,
  getAscensionRequirements,
  getForgingRecipe,
  compileHeroEquipmentBonuses
} from '../utils/equipmentProgression';
import { getHeroRecruitedStats } from '../utils/heroDatabase';
import {
  getHeroExtendedDetails,
  getSkillUpgradeCost,
  calculateHeroExpandedPower,
  compileHeroSkillStatsGains
} from '../utils/heroDetailsData';

interface SovereignArmoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Connected State & Reducers
  ownerEquipment: UserEquipment[];
  onEquipmentChange: (next: UserEquipment[]) => void;
  equipmentMaterials: Record<string, number>;
  onMaterialsChange: (next: Record<string, number> | ((p: Record<string, number>) => Record<string, number>)) => void;
  resources: Resources;
  onResourcesChange: (next: Resources | ((p: Resources) => Resources)) => void;
  heroes: Hero[];
  setHeroes?: React.Dispatch<React.SetStateAction<Hero[]>>;
  addLog: (text: string, type: 'info' | 'success' | 'warning' | 'combat') => void;
  initialSelectedHeroId?: string | null;
}

export default function SovereignArmoryModal({
  isOpen,
  onClose,
  ownerEquipment,
  onEquipmentChange,
  equipmentMaterials,
  onMaterialsChange,
  resources,
  onResourcesChange,
  heroes,
  setHeroes,
  addLog,
  initialSelectedHeroId
}: SovereignArmoryModalProps) {

  const [activeTab, setActiveTab] = useState<'forge' | 'armory' | 'vault'>('forge');
  
  // Forge states
  const [selectedSet, setSelectedSet] = useState<string>("Recruit's Training");
  const [selectedForgeItem, setSelectedForgeItem] = useState<EquipmentTemplate | null>(null);
  const [isForgingAnimation, setIsForgingAnimation] = useState(false);

  // Armory states
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<'Weapon' | 'Helmet' | 'Armor' | 'Boots' | 'Ring' | 'Amulet' | null>('Weapon');
  const [selectedGearInstance, setSelectedGearInstance] = useState<UserEquipment | null>(null);
  const [showEquippingSelector, setShowEquippingSelector] = useState(false);
  const [isUpgradingAnimation, setIsUpgradingAnimation] = useState(false);

  // Expanded Hero Detail States
  const [armorySubTab, setArmorySubTab] = useState<'equipment' | 'skills' | 'lore' | 'animations'>('equipment');
  const [playingVoiceLine, setPlayingVoiceLine] = useState<string | null>(null);
  const [activeAnimationClass, setActiveAnimationClass] = useState<string>('animate-pulse');
  const [activeAnimationName, setActiveAnimationName] = useState<string>('Sovereign Idle');
  const [selectedChapterTitle, setSelectedChapterTitle] = useState<string | null>(null);
  const animationTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Material synthesis / trade states
  const [vaultFocusMaterial, setVaultFocusMaterial] = useState<string | null>(null);

  // Sync initial hero
  useEffect(() => {
    if (initialSelectedHeroId) {
      const found = heroes.find(h => h.id === initialSelectedHeroId || h.name === initialSelectedHeroId);
      if (found) {
        setSelectedHero(found);
        setActiveTab('armory');
      }
    } else if (heroes.length > 0 && !selectedHero) {
      setSelectedHero(heroes[0]);
    }
  }, [initialSelectedHeroId, heroes]);

  if (!isOpen) return null;

  // Curated lists of Sets 
  const AVAILABLE_SETS = [
    "Recruit's Training",
    "Vanguard Warden",
    "Wildwood Hunter",
    "Swiftwind Tempest",
    "Glacial Bulwark",
    "Solar Phoenix",
    "Doomsday Dreadlord",
    "Crownspire Eternal",
    "Abyssal Void"
  ];

  // Group templates by set
  const filteredForgeTemplates = EQUIPMENT_TEMPLATES.filter(t => t.setName === selectedSet);

  const getRarityColor = (rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic') => {
    switch (rarity) {
      case 'Common': return { bg: 'bg-zinc-900', border: 'border-zinc-700', text: 'text-zinc-400', glow: 'shadow-zinc-950/20', gradient: 'from-zinc-950 via-zinc-900 to-zinc-950' };
      case 'Rare': return { bg: 'bg-blue-950/80', border: 'border-blue-800/80', text: 'text-blue-400', glow: 'shadow-blue-900/10', gradient: 'from-blue-950 via-slate-900 to-blue-950' };
      case 'Epic': return { bg: 'bg-purple-950/80', border: 'border-purple-800/80', text: 'text-purple-400', glow: 'shadow-purple-900/20', gradient: 'from-purple-950 via-zinc-900 to-purple-950' };
      case 'Legendary': return { bg: 'bg-amber-950/80', border: 'border-amber-700/80', text: 'text-amber-400', glow: 'shadow-amber-500/10', gradient: 'from-[#1a1205] via-[#0c0803] to-[#120c04]' };
      case 'Mythic': return { bg: 'bg-red-950/80', border: 'border-rose-700/80', text: 'text-rose-450', glow: 'shadow-rose-600/20', gradient: 'from-[#1e070d] via-[#0d0306] to-[#140509]' };
    }
  };

  // ----------------- HANDLERS -----------------

  const playHeroAnimation = (animClass: string, animName: string) => {
    if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
    setActiveAnimationClass(animClass);
    setActiveAnimationName(animName);

    // If it's a transient animation, return back to default pulse pattern
    if (animClass !== 'animate-pulse') {
      animationTimerRef.current = setTimeout(() => {
        setActiveAnimationClass('animate-pulse');
        setActiveAnimationName('Sovereign Idle');
      }, 1500);
    }
  };

  const playVoiceLineTranscript = (text: string) => {
    setPlayingVoiceLine(text);
  };

  const handleUpgradeSkill = (heroName: string, skillName: string) => {
    if (!setHeroes) {
      addLog("Cannot upgrade skills: Heroes registry not configured.", "warning");
      return;
    }

    const currentLvl = selectedHero?.skillLevels?.[skillName] || 1;
    if (currentLvl >= 10) {
      addLog(`Cannot Upgrade: "${skillName}" has reached its maximum Rank (10).`, "warning");
      return;
    }

    const cost = getSkillUpgradeCost(currentLvl, selectedHero?.type || 'War');

    // Check resources
    if (
      resources.food < cost.food ||
      resources.wood < cost.wood ||
      resources.stone < cost.stone ||
      resources.iron < cost.iron ||
      resources.valor < cost.valor
    ) {
      addLog(`Failed Skill Upgrade: Deficient resources for "${skillName}".`, "warning");
      return;
    }

    // Spend resources
    onResourcesChange(prev => ({
      ...prev,
      food: prev.food - cost.food,
      wood: prev.wood - cost.wood,
      stone: prev.stone - cost.stone,
      iron: prev.iron - cost.iron,
      valor: prev.valor - cost.valor
    }));

    // Update hero state
    setHeroes(prev => {
      const nextHeroes = prev.map(h => {
        if (h.name === heroName || h.id === heroName) {
          const nextLevels = { ...(h.skillLevels || {}) };
          nextLevels[skillName] = currentLvl + 1;
          
          const updated = {
            ...h,
            skillLevels: nextLevels
          };

          // Synchronize the active view state instantly
          if (selectedHero && (selectedHero.name === h.name || selectedHero.id === h.id)) {
            setSelectedHero(updated);
          }
          return updated;
        }
        return h;
      });
      return nextHeroes;
    });

    addLog(`✨ Upgraded "${skillName}" to Rank ${currentLvl + 1}! Hero power has been calculated and updated.`, "success");
    
    // Play spell cast animation!
    playHeroAnimation('scale-105 border-purple-500 shadow-2xl ring-4 ring-purple-500/20 duration-500', 'Spell Cast');
  };

  const handleForge = (template: EquipmentTemplate) => {
    const rc = getForgingRecipe(template);
    
    // Check traditional resources
    if (resources.wood < rc.woodCost || resources.stone < rc.stoneCost || resources.iron < rc.ironCost) {
      addLog(`Failed Sovereign Forge: Deficient Raw Materials.`, 'warning');
      return;
    }

    // Check specific monster material components
    for (const reqMat of rc.materials) {
      const invCount = equipmentMaterials[reqMat.name] || 0;
      if (invCount < reqMat.count) {
        addLog(`Failed Sovereign Forge: Deficiency of drops details "${reqMat.name}". Needed: ${reqMat.count}, Owned: ${invCount}`, 'warning');
        return;
      }
    }

    // Spend resources & materials
    onResourcesChange(prev => ({
      ...prev,
      wood: prev.wood - rc.woodCost,
      stone: prev.stone - rc.stoneCost,
      iron: prev.iron - rc.ironCost
    }));

    onMaterialsChange(prev => {
      const nextMap = { ...prev };
      for (const reqMat of rc.materials) {
        nextMap[reqMat.name] = Math.max(0, (nextMap[reqMat.name] || 0) - reqMat.count);
      }
      return nextMap;
    });

    setIsForgingAnimation(true);
    setTimeout(() => {
      setIsForgingAnimation(false);
      
      const nextInstance: UserEquipment = {
        id: `eq_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
        baseId: template.id,
        name: template.name,
        slot: template.slot,
        rarity: template.rarity,
        level: 1,
        tier: 0,
        setName: template.setName
      };

      onEquipmentChange([...ownerEquipment, nextInstance]);
      addLog(`⚒️ BLACKSMITH SUCCESS! Forged "${template.name}" [Lv.1] successfully into the Imperial Reserves room.`, 'success');
    }, 1500);
  };

  const handleEquip = (instance: UserEquipment) => {
    if (!selectedHero) return;

    // First, unequip any existing gear in that slot
    const heroId = selectedHero.id || selectedHero.name;
    const nextArr = ownerEquipment.map(eq => {
      // Unequip item currently on this slot for this hero
      if (eq.equippedHeroId === heroId && eq.slot === instance.slot) {
        return { ...eq, equippedHeroId: null };
      }
      return eq;
    });

    // Equip the new item
    const finalArr = nextArr.map(eq => {
      if (eq.id === instance.id) {
        return { ...eq, equippedHeroId: heroId };
      }
      return eq;
    });

    onEquipmentChange(finalArr);
    setShowEquippingSelector(false);
    setSelectedGearInstance(instance);
    addLog(`🛡️ Equipped "${instance.name}" onto Commander ${selectedHero.name}.`, 'success');
  };

  const handleUnequipItem = (instance: UserEquipment) => {
    const finalArr = ownerEquipment.map(eq => {
      if (eq.id === instance.id) {
        return { ...eq, equippedHeroId: null };
      }
      return eq;
    });
    onEquipmentChange(finalArr);
    addLog(`🎒 Unequipped "${instance.name}" back into the Vault room.`, 'info');
  };

  const handleUpgradeLevel = (instance: UserEquipment) => {
    if (instance.level >= 100) return;

    const cost = getUpgradeCost(instance.rarity, instance.level);
    if (resources.wood < cost.wood || resources.stone < cost.stone || resources.iron < cost.iron) {
      addLog(`Failed Upgrade: Low raw reserves.`, 'warning');
      return;
    }

    onResourcesChange(prev => ({
      ...prev,
      wood: prev.wood - cost.wood,
      stone: prev.stone - cost.stone,
      iron: prev.iron - cost.iron
    }));

    setIsUpgradingAnimation(true);
    setTimeout(() => {
      setIsUpgradingAnimation(false);
      const nextArr = ownerEquipment.map(eq => {
        if (eq.id === instance.id) {
          return { ...eq, level: eq.level + 1 };
        }
        return eq;
      });
      onEquipmentChange(nextArr);
      addLog(`✨ REINFORCED! "${instance.name}" upgraded to Level ${instance.level + 1}. Stats enhanced!`, 'success');
    }, 600);
  };

  const handleAscenceItem = (instance: UserEquipment) => {
    if (instance.tier >= 5) return;

    const nextStar = instance.tier + 1;
    const requirements = getAscensionRequirements(instance.rarity, nextStar);

    if (instance.level < requirements.requiredLevel) {
      addLog(`Ascension Denied: Required level is ${requirements.requiredLevel}. Item is only Lvl ${instance.level}.`, 'warning');
      return;
    }

    if (resources.iron < requirements.ironCost || resources.valor < requirements.valorCost) {
      addLog(`Ascension Denied: Insufficient Iron or Valor.`, 'warning');
      return;
    }

    // Check specific drops
    for (const reqMat of requirements.materials) {
      const owned = equipmentMaterials[reqMat.name] || 0;
      if (owned < reqMat.count) {
        addLog(`Ascension Denied: Deficient drops "${reqMat.name}". Needed: ${reqMat.count}, Owned: ${owned}`, 'warning');
        return;
      }
    }

    // Spend
    onResourcesChange(prev => ({
      ...prev,
      iron: prev.iron - requirements.ironCost,
      valor: prev.valor - requirements.valorCost
    }));

    onMaterialsChange(prev => {
      const nextMap = { ...prev };
      for (const reqMat of requirements.materials) {
        nextMap[reqMat.name] = Math.max(0, (nextMap[reqMat.name] || 0) - reqMat.count);
      }
      return nextMap;
    });

    const nextArr = ownerEquipment.map(eq => {
      if (eq.id === instance.id) {
        return { ...eq, tier: nextStar };
      }
      return eq;
    });
    onEquipmentChange(nextArr);
    addLog(`⭐ ASCENDED! "${instance.name}" ascended to ${nextStar} Star(s)! Ultimate trait scales up!`, 'success');
  };

  const handleDismantle = (instance: UserEquipment) => {
    const t = EQUIPMENT_TEMPLATES.find(tp => tp.id === instance.baseId);
    if (!t) return;

    const recipe = getForgingRecipe(t);
    const refundWood = Math.round(recipe.woodCost * 0.7);
    const refundIron = Math.round(recipe.ironCost * 0.7);
    const refundStone = Math.round(recipe.stoneCost * 0.7);

    onResourcesChange(prev => ({
      ...prev,
      wood: prev.wood + refundWood,
      iron: prev.iron + refundIron,
      stone: prev.stone + refundStone
    }));

    // Grant 70% material recovery
    onMaterialsChange(prev => {
      const nextMap = { ...prev };
      for (const reqMat of recipe.materials) {
        const countToRefund = Math.ceil(reqMat.count * 0.7);
        nextMap[reqMat.name] = (nextMap[reqMat.name] || 0) + countToRefund;
      }
      return nextMap;
    });

    // Remove from array
    onEquipmentChange(ownerEquipment.filter(eq => eq.id !== instance.id));
    setSelectedGearInstance(null);
    addLog(`♻️ DISMANTLED "${instance.name}": Recovered Timber (+${refundWood}), Ingots (+${refundIron}), Quarry (+${refundStone}) alongside 70% of material drops!`, 'info');
  };

  const handleMaterialsSynthesise = (matName: string) => {
    const current = equipmentMaterials[matName] || 0;
    if (current < 3) {
      addLog(`Failed Synthesis: Need 3 units of ${matName} to merge!`, 'warning');
      return;
    }

    const currentMeta = EQUIPMENT_MATERIALS[matName];
    if (!currentMeta || currentMeta.rarity === 'Mythic') {
      addLog(`Denied Synthesis: Mythic artifacts cannot be synthesized further.`, 'warning');
      return;
    }

    // Spend 3
    onMaterialsChange(prev => {
      const nextMap = { ...prev };
      nextMap[matName] = Math.max(0, (nextMap[matName] || 0) - 3);

      // Pick a random material of the next tier
      const nextRarities: Record<'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic', 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic'> = {
        'Common': 'Rare',
        'Rare': 'Epic',
        'Epic': 'Legendary',
        'Legendary': 'Mythic',
        'Mythic': 'Mythic'
      };
      
      const nextRarity = nextRarities[currentMeta.rarity];
      const pool = Object.values(EQUIPMENT_MATERIALS).filter(m => m.rarity === nextRarity);
      if (pool.length > 0) {
        const picked = pool[Math.floor(Math.random() * pool.length)];
        nextMap[picked.name] = (nextMap[picked.name] || 0) + 1;
        addLog(`🧪 SYNTHESIS SUCCESS! Fused 3x "${matName}" into 1x higher tier drop: "${picked.name}" ${picked.emoji}`, 'success');
      }

      return nextMap;
    });
  };

  const handlePurchaseWithValor = (matName: string) => {
    const matMeta = EQUIPMENT_MATERIALS[matName];
    if (!matMeta) return;

    let costValor = 100;
    switch (matMeta.rarity) {
      case 'Common': costValor = 120; break;
      case 'Rare': costValor = 400; break;
      case 'Epic': costValor = 1500; break;
      case 'Legendary': costValor = 6000; break;
      case 'Mythic': costValor = 20000; break;
    }

    if (resources.valor < costValor) {
      addLog(`Failed Market Trade: Insufficient Valor points.`, 'warning');
      return;
    }

    onResourcesChange(prev => ({
      ...prev,
      valor: prev.valor - costValor
    }));

    onMaterialsChange(prev => {
      const nextMap = { ...prev };
      nextMap[matName] = (nextMap[matName] || 0) + 1;
      return nextMap;
    });

    addLog(`🛒 Purchased 1x "${matName}" using ${costValor} Valor points.`, 'success');
  };

  // Compile selected hero's gear and set bonuses
  const heroId = selectedHero ? (selectedHero.id || selectedHero.name) : '';
  const heroEq = ownerEquipment.filter(eq => eq.equippedHeroId === heroId);
  const activeStatsGains = compilingHeroBonusesSafely(heroEq);

  // Expanded computed stats & details
  const recruitedStats = selectedHero ? getHeroRecruitedStats(selectedHero) : { attack: 0, defense: 0, health: 0, power: 0, leadership: 0, skills: [], passiveBonuses: [] };
  const totalHeroPower = selectedHero ? calculateHeroExpandedPower(selectedHero, recruitedStats, ownerEquipment) : 0;
  const extDetails = selectedHero ? getHeroExtendedDetails(selectedHero.name) : null;
  const skillGains = (selectedHero && extDetails) ? compileHeroSkillStatsGains(selectedHero, extDetails) : {
    infantryAttack: 0, infantryDefense: 0, marksmenAttack: 0, marksmenDefense: 0, cavalryAttack: 0, cavalryDefense: 0, gatheringSpeed: 0, healthBonus: 0, speedBonus: 0
  };

  function compilingHeroBonusesSafely(currentEq: UserEquipment[]) {
    try {
      return compileHeroEquipmentBonuses(currentEq, EQUIPMENT_TEMPLATES);
    } catch (e) {
      return { attackFlat: 0, defenseFlat: 0, healthFlat: 0, activeSetEffects: [], troopBonuses: {} as any };
    }
  }

  // Get active gear for chosen slot
  const currentSlotGear = selectedHero ? ownerEquipment.find(eq => eq.equippedHeroId === heroId && eq.slot === selectedSlot) : null;

  // Render Star elements
  const renderStars = (count: number) => {
    return (
      <div className="flex gap-0.5 text-yellow-400">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Star 
            key={idx} 
            className={`w-3 h-3 ${idx < count ? 'fill-yellow-400 text-yellow-500' : 'text-zinc-700'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div 
      id="sovereign-forge-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-5xl h-[88vh] bg-[#07090e] border border-amber-500/25 rounded-3xl overflow-hidden flex flex-col shadow-[0_24px_50px_rgba(0,0,0,0.95)]"
      >
        {/* Header section */}
        <div className="p-4 bg-gradient-to-r from-[#0d121c] via-[#090c13] to-[#0d121c] border-b border-zinc-850 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl">
              <Hammer className="w-5 h-5 text-amber-500 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] text-amber-500 font-bold tracking-[0.2em] font-mono leading-none uppercase">ROYAL FOUNDRY ACCESS</div>
              <h2 className="text-base font-bold font-serif text-white tracking-wide mt-1 uppercase">Sovereign Forge & Hero Armory</h2>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 bg-zinc-950 border border-zinc-900 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Upper HUD resources counters bar */}
        <div className="bg-[#0b0f17]/90 px-5 py-2.5 border-b border-zinc-850/60 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-zinc-550 uppercase tracking-wider font-bold">Reserves:</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[#a1a1aa] font-bold">🪵 Timber:</span>
              <span className="text-white font-extrabold">{resources.wood.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#94a3b8] font-bold">🪨 Quarry:</span>
              <span className="text-white font-extrabold">{resources.stone.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#3b82f6] font-bold">🧱 Ingots:</span>
              <span className="text-white font-extrabold">{resources.iron.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#fbbf24] font-bold">✨ Valor:</span>
              <span className="text-yellow-405 font-extrabold">{resources.valor.toLocaleString()}</span>
            </div>
          </div>

          <span className="text-[10px] font-mono text-zinc-500 bg-zinc-950/80 px-2.5 py-1 border border-zinc-900 rounded-full">
            Inventory Load: <span className="text-zinc-350 font-bold">{ownerEquipment.length}</span> Active Armaments
          </span>
        </div>

        {/* Central Tab dock controller */}
        <div className="flex border-b border-zinc-850 bg-[#090b10] shrink-0 font-mono text-xs">
          {[
            { id: 'forge', label: '⚒️ SOVEREIGN FORGE', desc: 'Craft high-tier set equipment' },
            { id: 'armory', label: '🛡️ HERO ARMORY', desc: 'Equip, Upgrade, and Ascend weapons' },
            { id: 'vault', label: '🎒 MATERIALS VAULT & MARKET', desc: 'Fusions & Valor Trading' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSelectedGearInstance(null);
                }}
                className={`flex-1 py-3 px-4 border-b-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isActive 
                    ? 'border-amber-500 bg-[#121722]/50 text-amber-500 font-extrabold' 
                    : 'border-transparent text-zinc-450 hover:text-white hover:bg-[#121722]/20'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[9px] text-zinc-550 font-medium tracking-tight mt-0.5">{tab.desc}</span>
              </button>
            );
          })}
        </div>

        {/* Primary Screen Area Splitter */}
        <div className="flex-1 overflow-hidden flex min-h-0">
          
          {/* ======================= TAB 1: IMMERSIVE FORGE SYSTEM ======================= */}
          {activeTab === 'forge' && (
            <div className="flex-1 flex overflow-hidden">
              {/* Left sidebar: Sets selector */}
              <div className="w-[200px] border-r border-zinc-850 bg-[#06080b] py-3.5 px-2.5 overflow-y-auto flex flex-col gap-1.5 shrink-0">
                <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-widest pl-2 mb-1 block">AVAILABLE RECIPES</span>
                {AVAILABLE_SETS.map((set) => {
                  const isSelected = selectedSet === set;
                  return (
                    <button
                      key={set}
                      onClick={() => {
                        setSelectedSet(set);
                        setSelectedForgeItem(null);
                      }}
                      className={`text-left text-[11px] p-2.5 rounded-xl font-medium tracking-normal transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-amber-500/10 border border-amber-500/30 text-amber-500 font-bold' 
                          : 'text-zinc-450 border border-transparent hover:text-white hover:bg-zinc-950'
                      }`}
                    >
                      {set}
                    </button>
                  );
                })}
              </div>

              {/* Center recipe board */}
              <div className="flex-1 flex flex-col overflow-y-auto p-5 space-y-4">
                <div className="bg-[#121620]/40 border border-amber-500/10 p-3.5 rounded-2xl relative">
                  <div className="absolute right-3 top-3 text-2xl text-amber-500/5 select-none font-black font-serif">CR-FOUNDRY</div>
                  <h3 className="font-serif font-bold text-white text-sm uppercase">Forge Set: {selectedSet}</h3>
                  <p className="text-[11px] text-zinc-450 mt-1 leading-relaxed">
                    Set Completion Bonus: <span className="text-yellow-500 font-bold">{SET_BONUSES_DATABASE[selectedSet]?.bonus2 || "+10% attributes"}</span> [2pc] | <span className="text-purple-400 font-bold font-mono">{SET_BONUSES_DATABASE[selectedSet]?.bonus4 || "+15% stats"}</span> [4pc]
                  </p>
                </div>

                {/* Templates Grid array */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredForgeTemplates.map((template) => {
                    const rc = getForgingRecipe(template);
                    const rStyle = getRarityColor(template.rarity);
                    const canAffordAll = 
                      resources.wood >= rc.woodCost && 
                      resources.stone >= rc.stoneCost && 
                      resources.iron >= rc.ironCost &&
                      rc.materials.every(m => (equipmentMaterials[m.name] || 0) >= m.count);

                    return (
                      <div 
                        key={template.id}
                        onClick={() => setSelectedForgeItem(template)}
                        className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer hover:-translate-y-1 relative flex flex-col justify-between ${rStyle.bg} ${
                          selectedForgeItem?.id === template.id 
                            ? 'border-amber-505 ring-2 ring-amber-500/30' 
                            : 'border-zinc-800'
                        }`}
                      >
                        <div>
                          <div className="flex justify-between items-start gap-1">
                            <span className={`text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${rStyle.bg} ${rStyle.text} border border-current/25`}>
                              {template.rarity}
                            </span>
                            <div className="flex items-center gap-1.5 font-mono text-[10px]">
                              {canAffordAll ? (
                                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" title="Ready to forge!" />
                              ) : (
                                <span className="inline-block w-2.5 h-2.5 rounded-full bg-zinc-800" title="Missing components" />
                              )}
                              <span className="text-zinc-500">Lvl Req: {template.levelRequirement}</span>
                            </div>
                          </div>

                          <h4 className="font-bold text-xs text-white font-serif tracking-wide mt-2">{template.name}</h4>
                          <span className="text-[10px] text-zinc-450 font-mono italic block mt-0.5">{template.slot}</span>
                        </div>

                        <div className="border-t border-zinc-900/60 pt-2 mt-2 flex items-center justify-between">
                          <span className="text-[9px] text-zinc-500 uppercase font-mono">FORGE STATS:</span>
                          <span className={`text-[10px] font-bold font-mono ${rStyle.text}`}>
                            {template.statBonuses.attack > 0 ? `+${template.statBonuses.attack} Att` : `+${template.statBonuses.defense} Def`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Selected Template recipe and detail drawer */}
                <AnimatePresence mode="wait">
                  {selectedForgeItem && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="bg-[#090b11] border border-zinc-800/80 p-4 rounded-3xl mt-2 flex flex-col md:flex-row gap-5"
                    >
                      <div className="flex-1 space-y-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-600 bg-zinc-950 px-2.5 py-0.5 rounded font-mono text-[9px] tracking-widest border border-zinc-900 uppercase">SPEC_SHEET</span>
                          <span className="text-amber-500 font-mono text-[10px]">{selectedForgeItem.setName} Set</span>
                        </div>
                        <h4 className="font-serif font-black text-white text-base tracking-normal uppercase">{selectedForgeItem.name}</h4>
                        <p className="text-[11px] text-zinc-400 font-serif leading-relaxed italic border-l-2 border-amber-500/20 pl-2.5">
                          "{selectedForgeItem.description}"
                        </p>

                        <div className="border-t border-zinc-900 pt-2 grid grid-cols-2 gap-2 text-xs font-mono">
                          <div>
                            <span className="text-zinc-500 block text-[9px]">BASE ATTRIBUTES:</span>
                            {selectedForgeItem.statBonuses.attack > 0 && <span className="text-emerald-400 font-extrabold">+{selectedForgeItem.statBonuses.attack} Core Strike</span>}
                            {selectedForgeItem.statBonuses.defense > 0 && <span className="text-emerald-400 font-extrabold">+{selectedForgeItem.statBonuses.defense} Warded Defense</span>}
                            {selectedForgeItem.statBonuses.health > 0 && <span className="text-emerald-400 font-extrabold">+{selectedForgeItem.statBonuses.health} Vital HP</span>}
                          </div>

                          <div>
                            <span className="text-zinc-500 block text-[9px]">MILITARY AUGMENT:</span>
                            {selectedForgeItem.troopBonuses.infantryAttack > 0 && <span className="text-amber-400/80 block leading-tight">Infantry ATK +{(selectedForgeItem.troopBonuses.infantryAttack * 100).toFixed(1)}%</span>}
                            {selectedForgeItem.troopBonuses.marksmenAttack > 0 && <span className="text-amber-400/80 block leading-tight">Marksmen ATK +{(selectedForgeItem.troopBonuses.marksmenAttack * 100).toFixed(1)}%</span>}
                            {selectedForgeItem.troopBonuses.cavalryAttack > 0 && <span className="text-amber-400/80 block leading-tight">Cavalry ATK +{(selectedForgeItem.troopBonuses.cavalryAttack * 100).toFixed(1)}%</span>}
                          </div>
                        </div>
                      </div>

                      {/* Required materials details column */}
                      <div className="w-full md:w-[320px] bg-[#0c0f17] border border-zinc-850/60 p-3.5 rounded-2xl flex flex-col justify-between shrink-0">
                        <div>
                          <h5 className="text-[10px] font-bold font-mono text-zinc-550 uppercase mb-2 tracking-widest pl-1 leading-none">CRAFTING REQUIRMENT:</h5>
                          
                          {/* Recipe requirements list */}
                          <div className="space-y-2.5 text-xs font-mono">
                            {/* Material items */}
                            {getForgingRecipe(selectedForgeItem).materials.map((mReq) => {
                              const owned = equipmentMaterials[mReq.name] || 0;
                              const meet = owned >= mReq.count;
                              const meta = EQUIPMENT_MATERIALS[mReq.name];

                              return (
                                <div key={mReq.name} className="flex items-center justify-between bg-zinc-950/70 p-2 rounded-xl border border-zinc-900">
                                  <div className="flex items-center gap-2">
                                    <span className="text-base leading-none shrink-0">{meta?.emoji || '💎'}</span>
                                    <div>
                                      <span className="text-zinc-300 font-bold block text-[11px] leading-tight-1">{mReq.name}</span>
                                      <span className="text-[9px] text-zinc-650 tracking-wider">Drop Category</span>
                                    </div>
                                  </div>

                                  <div className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                                    meet ? 'text-emerald-400 bg-[#0c1c14]/50' : 'text-rose-400 bg-[#1d0c0c]/50'
                                  }`}>
                                    {owned} / {mReq.count}
                                  </div>
                                </div>
                              );
                            })}

                            {/* Raw currencies */}
                            <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-zinc-900">
                              <div className="text-center bg-zinc-950/40 p-1.5 border border-zinc-900 rounded-lg">
                                <span className="text-[8px] text-zinc-550 block">🪵 WOOD</span>
                                <span className={`text-[10px] font-bold ${resources.wood >= getForgingRecipe(selectedForgeItem).woodCost ? 'text-emerald-400' : 'text-rose-400'}`}>
                                  {getForgingRecipe(selectedForgeItem).woodCost}
                                </span>
                              </div>
                              <div className="text-center bg-zinc-950/40 p-1.5 border border-zinc-900 rounded-lg">
                                <span className="text-[8px] text-zinc-550 block">🪨 STONE</span>
                                <span className={`text-[10px] font-bold ${resources.stone >= getForgingRecipe(selectedForgeItem).stoneCost ? 'text-emerald-400' : 'text-rose-400'}`}>
                                  {getForgingRecipe(selectedForgeItem).stoneCost}
                                </span>
                              </div>
                              <div className="text-center bg-zinc-950/40 p-1.5 border border-zinc-900 rounded-lg">
                                <span className="text-[8px] text-zinc-550 block">🧱 IRON</span>
                                <span className={`text-[10px] font-bold ${resources.iron >= getForgingRecipe(selectedForgeItem).ironCost ? 'text-emerald-400' : 'text-rose-400'}`}>
                                  {getForgingRecipe(selectedForgeItem).ironCost}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Execute button */}
                        <div className="pt-4">
                          <button
                            onClick={() => handleForge(selectedForgeItem)}
                            disabled={isForgingAnimation}
                            className={`w-full py-2.5 rounded-xl font-bold font-mono text-xs uppercase cursor-pointer flex items-center justify-center gap-1.5 transition-all ${
                              isForgingAnimation 
                                ? 'bg-amber-600/30 text-amber-500 opacity-60' 
                                : 'bg-gradient-to-r from-amber-600 to-amber-500 text-black border border-amber-400 hover:brightness-110 active:scale-97 hover:shadow-lg hover:shadow-amber-975/20'
                            }`}
                          >
                            <Hammer className={`w-3.5 h-3.5 ${isForgingAnimation ? 'animate-bounce' : ''}`} />
                            <span>{isForgingAnimation ? 'HAMMERING CORE...' : 'FORGE ITEM'}</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

          {/* ======================= TAB 2: ADVANCED HERO ARMORY ======================= */}
          {activeTab === 'armory' && (
            <div className="flex-1 flex overflow-hidden">
              {/* Left sidebar: Recruited Hero Selector */}
              <div className="w-[180px] border-r border-zinc-850 bg-[#06080b] py-3.5 px-2.5 overflow-y-auto flex flex-col gap-1.5 shrink-0">
                <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-widest pl-2 mb-1 block">SELECT LEGION COMMANDER</span>
                {heroes.map((hero) => {
                  const isSelected = selectedHero?.name === hero.name || selectedHero?.id === hero.id;
                  return (
                    <button
                      key={hero.name}
                      onClick={() => {
                        setSelectedHero(hero);
                        setSelectedGearInstance(null);
                        setShowEquippingSelector(false);
                      }}
                      className={`text-left text-[11px] p-2 rounded-xl transition-all font-medium flex items-center justify-between cursor-pointer ${
                        isSelected 
                          ? 'bg-[#121722] border border-amber-500/30 text-amber-500 font-extrabold' 
                          : 'text-zinc-450 hover:text-white hover:bg-zinc-950/60'
                      }`}
                    >
                      <span className="truncate">{hero.name}</span>
                      <span className="text-[9px] font-mono text-zinc-500 bg-zinc-950 px-1.5 py-0.2 rounded-md">Lvl {hero.level}</span>
                    </button>
                  );
                })}
              </div>

              {/* Main Armory Hub layout */}
              {selectedHero ? (
                <div className="flex-1 flex overflow-hidden min-h-0">
                  
                  {/* Left Column: IMMERSIVE HERO VISUAL CARD */}
                  <div className="w-[280px] border-r border-zinc-850 bg-[#07090e] p-4 overflow-y-auto flex flex-col shrink-0 space-y-4">
                    
                    {/* Visual Card Frame */}
                    <div className="relative rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-950 to-zinc-900/60 p-4 flex flex-col items-center justify-center text-center overflow-hidden group shadow-xl">
                      {/* Animation Overlay Effect Background */}
                      <div className={`absolute inset-0 opacity-15 pointer-events-none transition-all duration-750 bg-gradient-to-r ${
                        activeAnimationClass.includes('effect-slash') ? 'from-red-650 via-white to-red-650 opacity-40 animate-pulse' :
                        activeAnimationClass.includes('effect-shield') ? 'from-cyan-500 via-blue-600 to-cyan-500 opacity-35 animate-pulse' :
                        activeAnimationClass.includes('effect-moss') ? 'from-emerald-500 via-green-600 to-emerald-500 opacity-25 animate-pulse' :
                        activeAnimationClass.includes('effect-sparks') ? 'from-amber-400 via-yellow-500 to-amber-500 opacity-30 animate-pulse' :
                        activeAnimationClass.includes('effect-rocks') ? 'from-amber-800 via-zinc-800 to-amber-900 opacity-25 animate-pulse' :
                        'from-amber-500/10 to-transparent'
                      }`} />

                      {/* Floating Voice Line transcript subtitle */}
                      <AnimatePresence>
                        {playingVoiceLine && (
                          <motion.div 
                            initial={{ opacity: 0, y: 15, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -15, scale: 0.95 }}
                            className="absolute bottom-3 left-3 right-3 bg-black/95 border border-amber-500/35 p-2.5 rounded-xl text-[10px] text-amber-200 font-mono tracking-tight shadow-2xl z-20 leading-relaxed italic text-left"
                          >
                            <span className="text-amber-500 font-bold block mb-1 text-[9px] uppercase tracking-widest font-sans flex items-center gap-1">
                              <Volume2 className="w-3 h-3 text-amber-500 animate-bounce" />
                              <span>Hero Voice Log:</span>
                            </span>
                            {playingVoiceLine}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Hero Initials/Portrait Avatar */}
                      <div className={`w-20 h-20 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 flex items-center justify-center text-3xl text-amber-400 font-serif font-black select-none shrink-0 shadow-lg shadow-amber-950/20 relative transition-all duration-300 ${activeAnimationClass}`}>
                        {selectedHero.name[0]}
                        {/* Level overlay badge */}
                        <div className="absolute -bottom-1 -right-1 bg-zinc-950 border border-zinc-800 text-[9px] font-mono font-bold text-zinc-300 px-1.5 py-0.2 rounded-md">
                          L.{selectedHero.level}
                        </div>
                      </div>

                      <h4 className="font-serif font-black text-white text-sm tracking-wide uppercase mt-3.5 leading-none">{selectedHero.name}</h4>
                      <span className="text-[9px] font-mono font-black text-amber-500 bg-amber-975/30 px-2 py-0.5 border border-amber-500/10 rounded-full mt-2 inline-block">
                        {selectedHero.type} Commander
                      </span>

                      {/* Sovereign Combat Power Banner */}
                      <div className="w-full bg-[#15120c] border border-amber-500/20 rounded-xl p-2.5 mt-4 text-center">
                        <span className="text-[8px] text-amber-500/60 uppercase font-mono tracking-widest block font-bold">SOVEREIGN POWER</span>
                        <span className="text-lg font-black font-mono text-amber-400 tracking-wider">
                          ⚔️ {totalHeroPower.toLocaleString()}
                        </span>
                      </div>

                      {/* Active Animation name tracker */}
                      <div className="mt-2.5 text-[8px] font-mono text-zinc-550 flex items-center gap-1.5">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Posture: <span className="text-zinc-300">{activeAnimationName}</span>
                      </div>
                    </div>

                    {/* Sub-Tab Selector Dock */}
                    <div className="flex flex-col gap-1 text-xs font-mono">
                      <span className="text-[8px] text-zinc-550 font-black uppercase tracking-widest pl-2 mb-1 block">NAVIGATION PANEL</span>
                      
                      {[
                        { id: 'equipment', label: '🛡️ ARMAMENTS', desc: 'Inspect & equip items' },
                        { id: 'skills', label: '⚡ SKILLS & TALENTS', desc: 'Upgrades & legion buffs' },
                        { id: 'lore', label: '📖 CHRONICLES & LORE', desc: 'Biography & voice logs' },
                        { id: 'animations', label: '🎬 STANCE ACTION', desc: 'Play physical postures' },
                      ].map((subTab) => {
                        const isSubActive = armorySubTab === subTab.id;
                        return (
                          <button
                            key={subTab.id}
                            onClick={() => {
                              setArmorySubTab(subTab.id as any);
                              // Reset transient play stats when switching tabs
                              if (subTab.id === 'skills') playHeroAnimation('animate-pulse', 'Sovereign Idle');
                              if (subTab.id === 'lore') playHeroAnimation('animate-pulse', 'Sovereign Idle');
                              if (subTab.id === 'equipment') playHeroAnimation('animate-pulse', 'Sovereign Idle');
                            }}
                            className={`text-left p-2.5 rounded-xl transition-all border flex flex-col justify-between cursor-pointer group ${
                              isSubActive 
                                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 font-extrabold' 
                                : 'border-transparent text-zinc-450 hover:text-white hover:bg-zinc-950/60'
                            }`}
                          >
                            <span className="text-[10px] tracking-wide font-black">{subTab.label}</span>
                            <span className="text-[8px] text-zinc-550 font-medium group-hover:text-zinc-400 mt-0.5">{subTab.desc}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Stats Summary quick lookup */}
                    <div className="bg-zinc-950/40 border border-zinc-900 rounded-2xl p-3 text-[10px] font-mono space-y-1.5 text-zinc-450">
                      <span className="text-[8px] text-zinc-550 font-black block tracking-widest uppercase">BASE COMBAT FILE:</span>
                      <div className="flex justify-between">
                        <span>⚔️ Base Attack:</span>
                        <span className="text-zinc-200 font-bold">{recruitedStats.attack}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>🛡️ Base Defense:</span>
                        <span className="text-zinc-200 font-bold">{recruitedStats.defense}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>❤️ Base Health:</span>
                        <span className="text-zinc-200 font-bold">{recruitedStats.health}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>🚩 Leadership:</span>
                        <span className="text-zinc-200 font-bold">{recruitedStats.leadership}</span>
                      </div>
                    </div>

                  </div>

                  {/* Right Column: INTERACTIVE WINDOW CONTAINER */}
                  <div className="flex-1 flex overflow-hidden min-h-0 bg-[#06080c]/50">
                    
                    {/* ======================= SUB-TAB 1: EQUIPMENT MANAGER ======================= */}
                    {armorySubTab === 'equipment' && (
                      <div className="flex-1 flex overflow-hidden min-h-0">
                        {/* 6 Equipment slots + Cumulative panel */}
                        <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
                          {/* Equip slots layout grid diagram */}
                          <div className="space-y-2">
                            <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-widest pl-1">6 EQUIPMENT SLOTS</span>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                              {(['Weapon', 'Helmet', 'Armor', 'Boots', 'Ring', 'Amulet'] as const).map((slotName) => {
                                const eqItem = ownerEquipment.find(eq => eq.equippedHeroId === heroId && eq.slot === slotName);
                                const isSlotSelected = selectedSlot === slotName;

                                let rMeta = eqItem ? getRarityColor(eqItem.rarity) : null;

                                return (
                                  <div
                                    key={slotName}
                                    onClick={() => {
                                      setSelectedSlot(slotName);
                                      setSelectedGearInstance(eqItem || null);
                                      setShowEquippingSelector(false);
                                    }}
                                    className={`p-3.5 rounded-2xl border transition-all duration-150 cursor-pointer flex flex-col justify-between h-[85px] relative ${
                                      isSlotSelected 
                                        ? 'border-amber-500 bg-amber-500/5 shadow-inner' 
                                        : 'border-zinc-850 bg-[#07090d]/80 hover:border-zinc-700'
                                    }`}
                                  >
                                    <div className="flex justify-between items-start leading-none gap-1">
                                      <span className={`text-[9px] tracking-widest uppercase font-mono font-black ${isSlotSelected ? 'text-amber-500' : 'text-zinc-500'}`}>
                                        {slotName}
                                      </span>
                                      
                                      {eqItem ? (
                                        <div className="flex flex-col items-end gap-1 leading-none">
                                          <span className="text-[9px] font-mono text-amber-400 font-bold">★{eqItem.tier}</span>
                                          <span className="text-[9px] font-mono text-zinc-400 bg-zinc-950 px-1 rounded">L.{eqItem.level}</span>
                                        </div>
                                      ) : (
                                        <Plus className="w-3.5 h-3.5 text-zinc-600" />
                                      )}
                                    </div>

                                    {eqItem ? (
                                      <span className={`truncate text-[11px] font-bold font-serif leading-tight ${rMeta?.text} group-hover:scale-102 transition-all`}>
                                        {eqItem.name}
                                      </span>
                                    ) : (
                                      <span className="text-[10px] uppercase font-mono text-zinc-600 block italic leading-none pl-0.5">Empty Slot</span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Passive stats aggregate display panel */}
                          <div className="bg-[#0b0c10] border border-zinc-850 p-4 rounded-2xl space-y-2 font-mono text-xs text-zinc-350">
                            <div className="flex items-center gap-1.5 border-b border-zinc-900 pb-1.5">
                              <Sparkles className="w-4 h-4 text-amber-500" />
                              <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">COMPILED HERO & EQUIPMENT COMMENDS</span>
                            </div>

                            {heroEq.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                                <div className="space-y-1">
                                  <span className="text-[9px] text-zinc-550 block">EQUIPMENT FLAT STAT GAINS:</span>
                                  <div className="flex justify-between">
                                    <span className="text-zinc-500">🛡️ Defensive Armor Flat:</span>
                                    <span className="text-emerald-400 font-bold">+{activeStatsGains.defenseFlat}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-zinc-500">🗡️ Structural Attack Flat:</span>
                                    <span className="text-emerald-400 font-bold">+{activeStatsGains.attackFlat}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-zinc-500">❤️ Heavy Heart HP Flat:</span>
                                    <span className="text-emerald-400 font-bold">+{activeStatsGains.healthFlat}</span>
                                  </div>
                                </div>

                                <div className="space-y-1">
                                  <span className="text-[9px] text-zinc-550 block">CUMULATIVE FIELD MULTIPLIERS:</span>
                                  <div className="flex justify-between">
                                    <span className="text-zinc-500">Infantry Attack:</span>
                                    <span className="text-amber-400 font-bold">
                                      +{(((activeStatsGains.troopBonuses.infantryAttack || 0) + skillGains.infantryAttack) * 100).toFixed(1)}%
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-zinc-500">Marksmen Attack:</span>
                                    <span className="text-amber-400 font-bold">
                                      +{(((activeStatsGains.troopBonuses.marksmenAttack || 0) + skillGains.marksmenAttack) * 100).toFixed(1)}%
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-zinc-500">Cavalry Attack:</span>
                                    <span className="text-amber-400 font-bold">
                                      +{(((activeStatsGains.troopBonuses.cavalryAttack || 0) + skillGains.cavalryAttack) * 100).toFixed(1)}%
                                    </span>
                                  </div>
                                  {skillGains.gatheringSpeed > 0 && (
                                    <div className="flex justify-between">
                                      <span className="text-zinc-500">Gathering Yield:</span>
                                      <span className="text-emerald-400 font-bold">+{((skillGains.gatheringSpeed) * 100).toFixed(1)}%</span>
                                    </div>
                                  )}
                                </div>

                                {/* Set bonuses summary */}
                                {activeStatsGains.activeSetEffects.length > 0 && (
                                  <div className="col-span-1 md:col-span-2 border-t border-zinc-90 w pt-2 mt-1 space-y-1 bg-[#1a140a]/20 p-2.5 rounded-xl border border-amber-950/30">
                                    <span className="text-[9px] text-amber-500 font-bold block uppercase tracking-wider">ACTIVE SET RESONANCES:</span>
                                    {activeStatsGains.activeSetEffects.map((eff, i) => (
                                      <div key={i} className="text-[11px] leading-relaxed flex items-center gap-1.5">
                                        <span className="text-amber-500 leading-none">⚡</span>
                                        <span className="text-zinc-200 font-medium font-serif">{eff.setName} ({eff.pieces}pc):</span>
                                        <span className="text-zinc-400 text-[10px]">{eff.text}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-center py-4 text-zinc-600 font-sans italic">
                                No armaments equipped. Tap any slot above to assign.
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Traditional Equipment Right Drawer (Focus view or equip list selector) */}
                        <div className="w-[340px] border-l border-zinc-850 p-4 overflow-y-auto flex flex-col shrink-0 bg-[#06080c]">
                          <div className="border-b border-zinc-900 pb-3 mb-4">
                            <div className="text-[9px] text-zinc-550 font-bold tracking-widest font-mono uppercase">SLOT FOCUSSED</div>
                            <h4 className="text-base font-black font-serif text-white tracking-wide uppercase mt-1">{selectedSlot} Inspections</h4>
                          </div>

                          {!showEquippingSelector && currentSlotGear ? (
                            (() => {
                              const template = EQUIPMENT_TEMPLATES.find(t => t.id === currentSlotGear.baseId);
                              if (!template) return null;

                              const rStyle = getRarityColor(currentSlotGear.rarity);
                              const scaled = calculateItemStats(template, currentSlotGear.level, currentSlotGear.tier);
                              const upgradeResources = getUpgradeCost(currentSlotGear.rarity, currentSlotGear.level);
                              
                              const nextStar = currentSlotGear.tier + 1;
                              const starRequirements = currentSlotGear.tier < 5 ? getAscensionRequirements(currentSlotGear.rarity, nextStar) : null;

                              return (
                                <div className="space-y-4">
                                  {/* Card Display */}
                                  <div className={`p-4 rounded-3xl border ${rStyle.border} ${rStyle.bg} text-xs font-mono space-y-2`}>
                                    <div className="flex justify-between items-center bg-black/30 p-1.5 rounded-xl border border-white/5">
                                      <span className="font-extrabold text-[10px]">{currentSlotGear.slot}</span>
                                      <span className={`text-[9px] font-extrabold uppercase px-1.5 rounded text-zinc-100 ${rStyle.glow} border border-current/25`}>{currentSlotGear.rarity}</span>
                                    </div>
                                    <h4 className="font-serif font-black text-white text-sm uppercase leading-tight pt-1">{currentSlotGear.name}</h4>
                                    
                                    <div className="flex items-center justify-between pt-1">
                                      <span className="text-[10px] text-zinc-450">Progression Stage:</span>
                                      <span className="text-zinc-200 font-bold">Lvl {currentSlotGear.level} / 100</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <span className="text-[10px] text-zinc-450">Stars Tier:</span>
                                      {renderStars(currentSlotGear.tier)}
                                    </div>
                                  </div>

                                  {/* Dynamic scaled stats listing */}
                                  <div className="space-y-2 bg-[#0c0f17] border border-zinc-900 p-3 rounded-2xl font-mono text-xs">
                                    <span className="text-[9px] text-zinc-550 font-bold tracking-wider uppercase block">CURRENT ATTRIBUTES</span>
                                    <div className="space-y-1">
                                      {scaled.statBonuses.attack > 0 && <div className="flex justify-between"><span className="text-zinc-550">Core Strike:</span><span className="text-emerald-400 font-bold">+{scaled.statBonuses.attack} ATK</span></div>}
                                      {scaled.statBonuses.defense > 0 && <div className="flex justify-between"><span className="text-zinc-550">Warded Shielding:</span><span className="text-emerald-400 font-bold">+{scaled.statBonuses.defense} DEF</span></div>}
                                      {scaled.statBonuses.health > 0 && <div className="flex justify-between"><span className="text-zinc-550">Vital Essence:</span><span className="text-emerald-400 font-bold">+{scaled.statBonuses.health} HP</span></div>}
                                      
                                      {scaled.troopBonuses.infantryAttack > 0 && <div className="flex justify-between"><span className="text-zinc-550">Infantry Attack:</span><span className="text-amber-400">+{((scaled.troopBonuses.infantryAttack) * 100).toFixed(1)}%</span></div>}
                                      {scaled.troopBonuses.marksmenAttack > 0 && <div className="flex justify-between"><span className="text-zinc-550">Marksmen Attack:</span><span className="text-amber-400">+{((scaled.troopBonuses.marksmenAttack) * 100).toFixed(1)}%</span></div>}
                                      {scaled.troopBonuses.cavalryAttack > 0 && <div className="flex justify-between"><span className="text-zinc-550">Cavalry Attack:</span><span className="text-amber-400">+{((scaled.troopBonuses.cavalryAttack) * 100).toFixed(1)}%</span></div>}
                                    </div>
                                  </div>

                                  {/* REINFORCE & UPGRADE CORNER */}
                                  <div className="bg-[#0b0c11] border border-zinc-900 p-3.5 rounded-2xl space-y-3 font-mono text-xs">
                                    <div className="flex justify-between items-center border-b border-zinc-950 pb-1.5">
                                      <span className="font-extrabold text-[10px] text-zinc-400 uppercase">⚒️ LEVEL REINFORCE (L.100)</span>
                                      <span className="text-[9px] text-zinc-500">Max 100</span>
                                    </div>

                                    {currentSlotGear.level < 100 ? (
                                      <>
                                        {/* Costs block */}
                                        <span className="text-[9px] text-zinc-550 block uppercase">SMELTING PRICE:</span>
                                        <div className="grid grid-cols-3 gap-1.5 text-center text-[10px]">
                                          <div className="bg-zinc-950 border border-zinc-900 p-1.5 rounded-lg">
                                            <span className="text-zinc-600 block text-[8px] leading-none mb-1">WOOD</span>
                                            <span className={resources.wood >= upgradeResources.wood ? 'text-zinc-355 font-bold' : 'text-rose-500 font-bold'}>
                                              {upgradeResources.wood.toLocaleString()}
                                            </span>
                                          </div>
                                          <div className="bg-zinc-950 border border-zinc-900 p-1.5 rounded-lg">
                                            <span className="text-zinc-600 block text-[8px] leading-none mb-1">STONE</span>
                                            <span className={resources.stone >= upgradeResources.stone ? 'text-zinc-355 font-bold' : 'text-rose-500 font-bold'}>
                                              {upgradeResources.stone.toLocaleString()}
                                            </span>
                                          </div>
                                          <div className="bg-zinc-950 border border-zinc-900 p-1.5 rounded-lg">
                                            <span className="text-zinc-600 block text-[8px] leading-none mb-1">IRON</span>
                                            <span className={resources.iron >= upgradeResources.iron ? 'text-zinc-355 font-bold' : 'text-rose-500 font-bold'}>
                                              {upgradeResources.iron.toLocaleString()}
                                            </span>
                                          </div>
                                        </div>

                                        <button
                                          onClick={() => handleUpgradeLevel(currentSlotGear)}
                                          disabled={isUpgradingAnimation}
                                          className="w-full py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-black border border-amber-400 text-xs font-bold font-mono rounded-xl cursor-pointer hover:scale-[1.02] flex items-center justify-center gap-1.5 transition-all"
                                        >
                                          <Zap className="w-3 h-3 text-black shrink-0" />
                                          <span>{isUpgradingAnimation ? 'Melt Core...' : 'UPGRADE Lvl'}</span>
                                        </button>
                                      </>
                                    ) : (
                                      <div className="text-center p-2 rounded-xl bg-amber-500/10 text-amber-500 font-extrabold text-[10px]">
                                        ⭐ CORE REINFORCEMENT MAXED OUT [Lvl 100]
                                      </div>
                                    )}
                                  </div>

                                  {/* STAR ASCENSION CORNER */}
                                  <div className="bg-[#0b0c11] border border-zinc-900 p-3.5 rounded-2xl space-y-3 font-mono text-xs">
                                    <span className="font-extrabold text-[10px] text-zinc-400 block uppercase border-b border-zinc-950 pb-1.5">
                                      🌟 ASCEND STAR RATING (MAX ⭐5)
                                    </span>

                                    {currentSlotGear.tier < 5 && starRequirements ? (
                                      <>
                                        <div className="space-y-1.5 text-[11px]">
                                          <div className="flex justify-between">
                                            <span className="text-zinc-550 font-bold">Min Lvl Cap:</span>
                                            <span className={currentSlotGear.level >= starRequirements.requiredLevel ? 'text-emerald-400 font-bold' : 'text-rose-500 font-bold'}>
                                              {starRequirements.requiredLevel} (Owned: {currentSlotGear.level})
                                            </span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-zinc-555 font-bold">Valor Points:</span>
                                            <span className={resources.valor >= starRequirements.valorCost ? 'text-zinc-300' : 'text-rose-500'}>
                                              {starRequirements.valorCost}
                                            </span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span className="text-zinc-555 font-bold">Ingots (Iron):</span>
                                            <span className={resources.iron >= starRequirements.ironCost ? 'text-zinc-300' : 'text-rose-500'}>
                                              {starRequirements.ironCost.toLocaleString()}
                                            </span>
                                          </div>

                                          {/* Material Drops Requirements */}
                                          {starRequirements.materials.map((mReq) => {
                                            const owned = equipmentMaterials[mReq.name] || 0;
                                            const meet = owned >= mReq.count;
                                            return (
                                              <div key={mReq.name} className="flex justify-between bg-zinc-950 p-1.5 border border-zinc-900 rounded-lg text-[10px] mt-1 items-center">
                                                <span className="text-zinc-400 truncate">{mReq.name}:</span>
                                                <span className={meet ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                                                  {owned} / {mReq.count}
                                                </span>
                                              </div>
                                            );
                                          })}
                                        </div>

                                        <button
                                          onClick={() => handleAscenceItem(currentSlotGear)}
                                          className="w-full py-2 bg-gradient-to-r from-purple-700 to-purple-500 text-white rounded-xl text-xs font-bold cursor-pointer hover:scale-102 flex items-center justify-center gap-1"
                                        >
                                          <Star className="w-3.5 h-3.5 fill-current text-yellow-405 shrink-0" />
                                          <span>ASCEND TO STAR {nextStar}</span>
                                        </button>
                                      </>
                                    ) : (
                                      <div className="text-center p-2 rounded-xl bg-purple-500/10 text-purple-400 text-[10px] font-extrabold uppercase">
                                        👑 Primordial Ascension Mastered ⭐⭐⭐⭐⭐
                                      </div>
                                    )}
                                  </div>

                                  {/* Unequip and dismantling controls */}
                                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-90 w">
                                    <button
                                      onClick={() => handleUnequipItem(currentSlotGear)}
                                      className="py-2 border border-zinc-700 text-zinc-300 rounded-xl text-xs cursor-pointer hover:bg-zinc-950 transition-all font-mono"
                                    >
                                      UNEQUIP
                                    </button>
                                    
                                    <button
                                      onClick={() => {
                                        if (confirm(`Melt this item? Reclaims 70% of smelt ingredients and alloy components.`)) {
                                          handleDismantle(currentSlotGear);
                                        }
                                      }}
                                      className="py-2 border border-rose-950 hover:bg-rose-950/20 text-rose-400 rounded-xl text-xs cursor-pointer transition-all font-mono flex items-center justify-center gap-1"
                                    >
                                      <Trash2 className="w-3 h-3 text-red-400" />
                                      <span>DISMANTLE</span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })()
                          ) : showEquippingSelector ? (
                            // Equip Selector Dropdowns List
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold font-mono text-zinc-550 uppercase">ASSIGN ARMAMENT</span>
                                <button 
                                  onClick={() => setShowEquippingSelector(false)} 
                                  className="text-[10px] text-amber-500 font-bold"
                                >
                                  CANCEL
                                </button>
                              </div>

                              {/* List unequipped items for selectedSlot */}
                              {(() => {
                                const candidates = ownerEquipment.filter(eq => eq.slot === selectedSlot && !eq.equippedHeroId);
                                
                                if (candidates.length === 0) {
                                  return (
                                    <div className="text-center py-8 rounded-2xl bg-zinc-950 border border-zinc-900 text-xs text-zinc-600 font-sans space-y-3">
                                      <p>No unassigned {selectedSlot}s in Vault.</p>
                                      <button
                                        onClick={() => setActiveTab('forge')}
                                        className="px-4 py-1.5 bg-amber-500/10 border border-amber-505/30 text-amber-500 text-[10px] font-mono rounded-lg hover:bg-amber-500/20 transition-all"
                                      >
                                        ⚒️ GOTO BLACKSMITHY
                                      </button>
                                    </div>
                                  );
                                }

                                return (
                                  <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                                    {candidates.map((cand) => {
                                      const tp = EQUIPMENT_TEMPLATES.find(t => t.id === cand.baseId);
                                      const stats = tp ? calculateItemStats(tp, cand.level, cand.tier) : null;
                                      const rMeta = getRarityColor(cand.rarity);

                                      return (
                                        <div 
                                          key={cand.id}
                                          onClick={() => handleEquip(cand)}
                                          className={`p-3 rounded-2xl border cursor-pointer hover:border-amber-500 hover:-translate-y-0.5 transition-all flex flex-col justify-between ${rMeta.bg} ${rMeta.border}`}
                                        >
                                          <div className="flex justify-between items-start">
                                            <span className="font-serif font-bold text-[11px] text-white tracking-wide">{cand.name}</span>
                                            <span className="text-[9px] font-mono font-bold text-amber-400 bg-black/20 px-1 rounded">★{cand.tier}</span>
                                          </div>

                                          <div className="border-t border-zinc-900/40 mt-2.5 pt-2 flex items-center justify-between text-[10px] font-mono">
                                            <span className="text-zinc-450">Leveled: L.{cand.level}</span>
                                            {stats && (
                                              <span className={rMeta.text}>
                                                {stats.statBonuses.attack > 0 ? `+${stats.statBonuses.attack} Att` : `+${stats.statBonuses.defense} Def`}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              })()}
                            </div>
                          ) : (
                            // Empty slot - show link to equip
                            <div className="text-center py-12 rounded-3xl bg-[#090b11] border border-zinc-900 p-5 space-y-4">
                              <span className="text-zinc-600 block text-xs italic font-sans">
                                Empty {selectedSlot} Slot on {selectedHero.name}
                              </span>

                              <button
                                onClick={() => setShowEquippingSelector(true)}
                                className="w-full py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-black border border-amber-400 text-xs font-bold font-mono rounded-xl cursor-pointer hover:brightness-115 flex items-center justify-center gap-1.5 transition-all"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                <span>ASSIGN FROM VAULT</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* ======================= SUB-TAB 2: SKILLS & TALENTS PAGE ======================= */}
                    {armorySubTab === 'skills' && (
                      <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
                        <div className="flex flex-col md:flex-row gap-4">
                          
                          {/* Active Skill List Upgrades (Left Panel) */}
                          <div className="flex-1 space-y-3">
                            <span className="text-[9px] text-purple-400 font-bold uppercase tracking-widest block font-mono pl-1">
                              ACTIVE TACTICAL TALENTS
                            </span>

                            {recruitedStats.skills.map((skill) => {
                              const currentLvl = selectedHero.skillLevels?.[skill.name] || 1;
                              const isMaxed = currentLvl >= 10;
                              const upgradeCost = getSkillUpgradeCost(currentLvl, selectedHero.type);

                              // Check if currently locked due to Ascension conditions
                              const isLocked = (skill.requiredAscension || 0) > (selectedHero.ascension || 0);

                              return (
                                <div 
                                  key={skill.name}
                                  className={`p-4 rounded-2xl border transition-all ${
                                    isLocked 
                                      ? 'border-zinc-900 bg-zinc-950/40 opacity-70' 
                                      : 'border-zinc-850 bg-gradient-to-b from-[#13111b] to-zinc-950/80 shadow-md shadow-purple-950/5'
                                  }`}
                                >
                                  {/* Identity row */}
                                  <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                      <span className="text-xl">
                                        {skill.name.includes('Decree') ? '👑' : skill.name.includes('Aegis') ? '🛡️' : '🔥'}
                                      </span>
                                      <div>
                                        <h5 className="font-serif font-bold text-xs text-white uppercase tracking-wide leading-none">{skill.name}</h5>
                                        <span className="text-[8px] font-mono text-purple-400 mt-1 block uppercase tracking-wider">
                                          {isLocked ? 'Locked Skill' : `Rank ${currentLvl} / 10`}
                                        </span>
                                      </div>
                                    </div>

                                    {!isLocked && (
                                      <span className="text-[9px] font-mono text-zinc-500 bg-zinc-950/80 px-2 py-0.5 rounded border border-zinc-900">
                                        Active Trigger
                                      </span>
                                    )}
                                  </div>

                                  {/* Description & effects math */}
                                  <p className="text-[10px] text-zinc-400 mt-2.5 leading-relaxed font-sans">
                                    {skill.description}
                                  </p>

                                  {isLocked ? (
                                    <div className="mt-3.5 bg-rose-950/10 border border-rose-950/30 p-2.5 rounded-xl text-[10px] font-mono text-rose-400 flex items-center gap-1.5">
                                      <Info className="w-3.5 h-3.5 shrink-0" />
                                      <span>Requires Commander Ascension Tier {skill.requiredAscension} to unlock this skill.</span>
                                    </div>
                                  ) : (
                                    <div className="mt-4 border-t border-zinc-900/60 pt-3 space-y-3">
                                      {/* Scaled Value Preview */}
                                      <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                                        <div className="bg-zinc-950 p-1.5 rounded border border-zinc-900">
                                          <span className="text-zinc-550 text-[8px] block uppercase">CURRENT LEVEL BONUS:</span>
                                          <span className="text-white font-bold">
                                            Damage/Effect Coeff: <span className="text-amber-400">{(100 + currentLvl * 15)}%</span>
                                          </span>
                                        </div>
                                        <div className="bg-zinc-950 p-1.5 rounded border border-zinc-900">
                                          <span className="text-zinc-550 text-[8px] block uppercase">NEXT LEVEL PREVIEW:</span>
                                          <span className="text-purple-400 font-bold">
                                            {isMaxed ? 'Max Rank Mastered' : `Damage/Effect Coeff: ${(100 + (currentLvl + 1) * 15)}%`}
                                          </span>
                                        </div>
                                      </div>

                                      {/* Upgrade Cost and button */}
                                      {!isMaxed ? (
                                        <div className="bg-zinc-950/70 border border-zinc-900/60 rounded-xl p-2.5 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                                          <div className="space-y-1 text-[9px] font-mono">
                                            <span className="text-zinc-550 block font-bold leading-none uppercase">UPGRADE INVESTMENT:</span>
                                            <div className="flex flex-wrap gap-2 text-[10px]">
                                              <span className="flex items-center gap-0.5">
                                                💎 <span className={resources.valor >= upgradeCost.valor ? 'text-zinc-300 font-bold' : 'text-rose-500'}>
                                                  {upgradeCost.valor} Valor
                                                </span>
                                              </span>
                                              {upgradeCost.food > 0 && (
                                                <span className="flex items-center gap-0.5">
                                                  🌾 <span className={resources.food >= upgradeCost.food ? 'text-zinc-300' : 'text-rose-500'}>
                                                    {upgradeCost.food.toLocaleString()} Food
                                                  </span>
                                                </span>
                                              )}
                                              {upgradeCost.wood > 0 && (
                                                <span className="flex items-center gap-0.5">
                                                  🪵 <span className={resources.wood >= upgradeCost.wood ? 'text-zinc-300' : 'text-rose-500'}>
                                                    {upgradeCost.wood.toLocaleString()} Wood
                                                  </span>
                                                </span>
                                              )}
                                              {upgradeCost.stone > 0 && (
                                                <span className="flex items-center gap-0.5">
                                                  🪨 <span className={resources.stone >= upgradeCost.stone ? 'text-zinc-300' : 'text-rose-500'}>
                                                    {upgradeCost.stone.toLocaleString()} Stone
                                                  </span>
                                                </span>
                                              )}
                                              {upgradeCost.iron > 0 && (
                                                <span className="flex items-center gap-0.5">
                                                  🔩 <span className={resources.iron >= upgradeCost.iron ? 'text-zinc-300' : 'text-rose-500'}>
                                                    {upgradeCost.iron.toLocaleString()} Iron
                                                  </span>
                                                </span>
                                              )}
                                            </div>
                                          </div>

                                          <button
                                            onClick={() => handleUpgradeSkill(selectedHero.name, skill.name)}
                                            className="px-3.5 py-1.5 bg-purple-650 hover:bg-purple-600 text-white rounded-lg text-[10px] font-black font-mono tracking-wide cursor-pointer transition-all shrink-0 hover:scale-102 flex items-center gap-1 leading-none shadow-md shadow-purple-950/20"
                                          >
                                            <ArrowUp className="w-3 h-3" />
                                            <span>LEVEL UP</span>
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="text-center p-2 rounded-xl bg-purple-500/10 text-purple-400 text-[9px] font-extrabold uppercase">
                                          👑 Max Skill Grade (Rank 10) Mastered
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {/* Troop Specialized Skills & Buffs (Right Panel) */}
                          <div className="w-full md:w-[260px] bg-[#0c0d13] border border-zinc-850 p-4 rounded-2xl flex flex-col justify-between shrink-0 space-y-4">
                            <div>
                              <span className="text-[9px] text-amber-500 font-bold uppercase tracking-widest block font-mono">
                                🛡️ SPECIALIZED TROOP PASSIVES
                              </span>
                              <p className="text-[10px] text-zinc-500 mt-1 leading-relaxed">
                                Commanders possess unique genetic traits that boost entire battalion formations dynamically on the wilderness world map.
                              </p>

                              <div className="mt-4 space-y-3">
                                {extDetails.troopSkills.map((trSkill) => {
                                  const currentLvl = selectedHero.skillLevels?.[trSkill.name] || 1;
                                  const currentVal = trSkill.baseValue + (currentLvl - 1) * trSkill.scalingPerLevel;

                                  return (
                                    <div key={trSkill.name} className="bg-zinc-950/80 border border-zinc-900 p-3 rounded-xl font-mono text-xs">
                                      <div className="flex items-center gap-2">
                                        <span className="text-lg">{trSkill.icon}</span>
                                        <div>
                                          <h6 className="text-[11px] text-white font-serif font-extrabold uppercase">{trSkill.name}</h6>
                                          <span className="text-[8px] text-zinc-550 block font-mono">
                                            Level {currentLvl} • {trSkill.troopType.toUpperCase()} {trSkill.bonusType.toUpperCase()}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="border-t border-zinc-900/80 mt-2.5 pt-2 flex items-center justify-between text-[10px]">
                                        <span className="text-zinc-500">Active Field Bonus:</span>
                                        <span className="text-emerald-400 font-black">+{(currentVal * 100).toFixed(1)}%</span>
                                      </div>

                                      <div className="w-full bg-zinc-900 h-1.5 rounded-full mt-2 overflow-hidden">
                                        <div 
                                          className="bg-emerald-505 h-full rounded-full animate-pulse" 
                                          style={{ width: `${Math.min(100, (currentLvl / 10) * 100)}%` }}
                                        />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="bg-[#1a140a]/25 border border-amber-900/10 p-3 rounded-xl text-[10px] font-mono text-amber-450 leading-relaxed">
                              <span className="text-[8px] text-amber-550 font-bold block uppercase mb-1">SOVEREIGN CALCULATOR GUIDELINE:</span>
                              Each active talent rank increase grants <span className="text-white font-extrabold">+1,500 Base Power</span> and scales the commander's field combat multipliers seamlessly!
                            </div>

                          </div>
                        </div>
                      </div>
                    )}

                    {/* ======================= SUB-TAB 3: CHRONICLES & LORE ======================= */}
                    {armorySubTab === 'lore' && (
                      <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          {/* Biography Card Panel */}
                          <div className="bg-zinc-950/50 border border-zinc-850 p-4 rounded-3xl space-y-3">
                            <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                              <span className="text-[9px] text-amber-500 font-bold font-mono tracking-widest uppercase">COMMANDER DOSSIER</span>
                              <span className="text-[8px] font-mono bg-zinc-900 text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded">FACTION FILE</span>
                            </div>

                            <div className="space-y-1 text-xs font-mono">
                              <div className="flex justify-between">
                                <span className="text-zinc-500">Allegiance Faction:</span>
                                <span className="text-white font-extrabold font-serif text-[11px]">{extDetails.faction}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-zinc-500">Philosophic Alignment:</span>
                                <span className="text-zinc-300 text-[10px]">{extDetails.alignment}</span>
                              </div>
                            </div>

                            <p className="text-[11px] text-zinc-400 font-serif leading-relaxed italic border-l-2 border-amber-500/20 pl-3 pt-1">
                              "{extDetails.biography}"
                            </p>

                            {/* Voice Lines simulation player */}
                            <div className="border-t border-zinc-900 pt-4 mt-2.5 space-y-2">
                              <span className="text-[9px] text-zinc-550 font-black font-mono block tracking-widest uppercase mb-1.5">🔊 IMMERSIVE VOICE LOGS</span>
                              
                              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                                {extDetails.voiceLines.map((line) => {
                                  const isSelectedLog = playingVoiceLine === line.text;

                                  return (
                                    <button
                                      key={line.trigger}
                                      onClick={() => {
                                        playVoiceLineTranscript(line.text);
                                        // Play visual voice ripple animation
                                        playHeroAnimation('ring-4 ring-amber-500/20 scale-102 duration-300', 'Voice Broadcasting');
                                      }}
                                      className={`w-full text-left p-2.5 rounded-xl border transition-all text-xs font-mono cursor-pointer flex items-center justify-between ${
                                        isSelectedLog 
                                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                                          : 'border-zinc-900 bg-zinc-950/70 text-zinc-400 hover:text-white hover:border-zinc-750'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2">
                                        <Play className={`w-3 h-3 shrink-0 ${isSelectedLog ? 'text-amber-500 animate-pulse' : 'text-zinc-500'}`} />
                                        <span className="text-[10px] font-serif font-black uppercase tracking-wide truncate">{line.trigger}</span>
                                      </div>
                                      
                                      {/* Audio visual pulsing wave spectrum */}
                                      {isSelectedLog ? (
                                        <div className="flex gap-0.5 items-end h-3">
                                          <span className="w-0.5 bg-amber-555 rounded animate-voice-bar-1" style={{ height: '100%', animation: 'pulse 0.6s infinite alternate' }} />
                                          <span className="w-0.5 bg-amber-555 rounded animate-voice-bar-2" style={{ height: '70%', animation: 'pulse 0.4s infinite alternate 0.1s' }} />
                                          <span className="w-0.5 bg-amber-555 rounded animate-voice-bar-3" style={{ height: '120%', animation: 'pulse 0.7s infinite alternate 0.2s' }} />
                                          <span className="w-0.5 bg-amber-555 rounded animate-voice-bar-1" style={{ height: '80%', animation: 'pulse 0.5s infinite alternate 0.3s' }} />
                                        </div>
                                      ) : (
                                        <span className="text-[8px] text-zinc-600 font-mono">Simulated</span>
                                      )}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </div>

                          {/* Historical Chronicles (Chapters) Panel */}
                          <div className="space-y-3">
                            <span className="text-[9px] text-zinc-550 font-bold font-mono tracking-widest uppercase pl-1 block">HISTORIC CHRONICLES</span>
                            
                            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                              {extDetails.storyChapters.map((chapter) => {
                                const isChapterUnlocked = chapter.isUnlocked(selectedHero.level, selectedHero.ascension || 0);
                                const isExpanded = selectedChapterTitle === chapter.title;

                                return (
                                  <div 
                                    key={chapter.title}
                                    className={`rounded-2xl border transition-all overflow-hidden ${
                                      isChapterUnlocked 
                                        ? isExpanded 
                                          ? 'border-amber-500/40 bg-[#12100e]' 
                                          : 'border-zinc-850 bg-zinc-950/60 hover:border-zinc-700'
                                        : 'border-zinc-900 bg-zinc-950/20 opacity-60'
                                    }`}
                                  >
                                    <button
                                      disabled={!isChapterUnlocked}
                                      onClick={() => {
                                        setSelectedChapterTitle(isExpanded ? null : chapter.title);
                                        // Play page turn posture
                                        if (!isExpanded) {
                                          playHeroAnimation('scale-98 opacity-90 duration-300', 'Chronicle Archive');
                                        }
                                      }}
                                      className={`w-full text-left p-3.5 flex items-center justify-between text-xs font-serif font-bold ${
                                        isChapterUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'
                                      }`}
                                    >
                                      <div className="flex items-center gap-2.5">
                                        <BookOpen className={`w-4 h-4 shrink-0 ${isChapterUnlocked ? 'text-amber-500' : 'text-zinc-600'}`} />
                                        <div>
                                          <span className="text-white text-xs block font-serif font-bold leading-tight">{chapter.title}</span>
                                          <span className="text-[8px] font-mono text-zinc-550 block mt-0.5 uppercase tracking-wider">{chapter.unlockCondition}</span>
                                        </div>
                                      </div>

                                      <span className={`text-[10px] font-mono uppercase tracking-widest ${isChapterUnlocked ? 'text-amber-500' : 'text-zinc-600 font-bold'}`}>
                                        {isChapterUnlocked ? (isExpanded ? 'Collapse' : 'Expand') : 'LOCKED'}
                                      </span>
                                    </button>

                                    {/* Inline Story Text Expand Animation */}
                                    <AnimatePresence>
                                      {isChapterUnlocked && isExpanded && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: 'auto', opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ duration: 0.3 }}
                                        >
                                          <div className="p-4 border-t border-zinc-900 bg-black/40 text-[11px] text-zinc-300 font-serif leading-relaxed italic border-l-2 border-amber-500/20">
                                            {chapter.content}
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                        </div>
                      </div>
                    )}

                    {/* ======================= SUB-TAB 4: COMBAT POSTURE ANIMATIONS ======================= */}
                    {armorySubTab === 'animations' && (
                      <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
                        <div className="bg-zinc-950/40 border border-zinc-850 p-4 rounded-3xl space-y-4">
                          <div className="border-b border-zinc-900 pb-2">
                            <span className="text-[9px] text-amber-500 font-bold font-mono tracking-widest uppercase">POSTURE CORE SIMULATOR</span>
                            <h4 className="text-base font-serif font-black text-white uppercase tracking-wide mt-1">Stance Actions Player</h4>
                          </div>

                          <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">
                            Interact with the tactical posture engine below. Triggering posture stances executes real-time physical CSS transitions and glow matrices across the primary commander visual frame above.
                          </p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                            {extDetails.animations.map((anim) => {
                              const isActiveStance = activeAnimationName === anim.name;

                              return (
                                <div 
                                  key={anim.name} 
                                  className={`p-3.5 rounded-2xl border transition-all ${
                                    isActiveStance 
                                      ? 'border-amber-500/40 bg-amber-500/5' 
                                      : 'border-zinc-900 bg-zinc-950/70'
                                  }`}
                                >
                                  <div className="flex justify-between items-center">
                                    <div className="space-y-0.5">
                                      <h5 className="font-serif font-bold text-xs text-white uppercase tracking-wide">{anim.name}</h5>
                                      <span className="text-[9px] font-mono text-zinc-500 block">{anim.description}</span>
                                    </div>

                                    <button
                                      onClick={() => {
                                        // Map the customized classes to specific animation triggers
                                        let finalClass = anim.effectClass;
                                        if (anim.name.includes('Slash')) {
                                          finalClass = 'animate-flash scale-102 shadow-2xl border-red-500 rotate-2 duration-150 effect-slash';
                                          addLog(`⚔️ Posture Trigger: "${selectedHero.name}" executes ${anim.name}! Damage simulated at ${totalHeroPower * 4} Strike.`, 'combat');
                                        } else if (anim.name.includes('Shield') || anim.name.includes('Bastion')) {
                                          finalClass = 'scale-95 duration-200 border-cyan-400 shadow-2xl ring-4 ring-cyan-500/10 effect-shield';
                                          addLog(`🛡️ Posture Trigger: "${selectedHero.name}" raises ${anim.name}! Citadel shields calibrated.`, 'info');
                                        } else if (anim.name.includes('Overgrowth') || anim.name.includes('Nature')) {
                                          finalClass = 'scale-102 border-emerald-400 shadow-xl duration-300 effect-moss';
                                          addLog(`🍃 Posture Trigger: "${selectedHero.name}" conjures ${anim.name}.`, 'info');
                                        } else if (anim.name.includes('Sparks') || anim.name.includes('Steam')) {
                                          finalClass = 'animate-bounce border-amber-400 shadow-2xl duration-200 effect-sparks';
                                          addLog(`🔥 Posture Trigger: "${selectedHero.name}" sparks ${anim.name}! Alloys tempered.`, 'success');
                                        } else if (anim.name.includes('Rocks') || anim.name.includes('Seismic')) {
                                          finalClass = 'scale-95 border-amber-800 shadow-2xl duration-300 effect-rocks';
                                          addLog(`🪨 Posture Trigger: "${selectedHero.name}" grounds ${anim.name}! Seismic tremors detected.`, 'info');
                                        } else if (anim.name.includes('Gaze') || anim.name.includes('Command')) {
                                          finalClass = 'scale-110 duration-700 border-yellow-350 shadow-2xl effect-zoom';
                                          addLog(`👁️ Posture Trigger: "${selectedHero.name}" casts ${anim.name}.`, 'info');
                                        }

                                        playHeroAnimation(finalClass, anim.name);
                                      }}
                                      className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-amber-500/40 hover:text-amber-400 text-zinc-350 rounded-xl text-[10px] font-black font-mono tracking-widest cursor-pointer transition-all flex items-center gap-1 leading-none shadow"
                                    >
                                      <span>ACTIVATE</span>
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                </div>
              ) : (
                <div className="text-center py-20 text-zinc-650 italic flex flex-col items-center justify-center gap-2">
                  <span className="text-2xl">🏰</span>
                  <span>Recruit commanders from Tavern Hall to activate armor layouts and skills profiles.</span>
                </div>
              )}
            </div>
          )}

          {/* ======================= TAB 3: MATERIAL VAULT ROOM ======================= */}
          {activeTab === 'vault' && (
            <div className="flex-1 flex overflow-hidden">
              
              {/* Left Column: Grid list of all material types */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="bg-[#121620]/60 border border-zinc-850 p-4 rounded-3xl">
                  <h3 className="font-serif font-black text-white text-base tracking-normal uppercase">Drops Deposit Chamber</h3>
                  <p className="text-[11px] text-zinc-450 mt-1 leading-relaxed">
                    Examine ancient ores, volcanic coals, and draconian scales harvested from world hunt battles. Fusion 3 identical components to compile 1 random higher rarity drop!
                  </p>
                </div>

                {/* Materials Grid list */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {Object.values(EQUIPMENT_MATERIALS).map((material) => {
                    const owned = equipmentMaterials[material.name] || 0;
                    const rStyle = getRarityColor(material.rarity);
                    const isFocus = vaultFocusMaterial === material.name;

                    return (
                      <div
                        key={material.name}
                        onClick={() => setVaultFocusMaterial(material.name)}
                        className={`p-3 rounded-2xl border cursor-pointer hover:border-amber-505 transition-all relative flex flex-col justify-between h-[100px] ${
                          isFocus 
                            ? 'bg-[#121722]/60 border-amber-500 ring-2 ring-amber-500/10' 
                            : 'bg-[#090b10] border-zinc-850 hover:bg-zinc-950'
                        }`}
                      >
                        <div className="flex justify-between items-start leading-none gap-2">
                          <span className="text-2xl leading-none block select-none">{material.emoji || '💎'}</span>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                            owned > 0 ? 'bg-zinc-900 text-zinc-200' : 'bg-transparent text-zinc-650'
                          }`}>
                            {owned} Pcs
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-[11px] text-white font-serif tracking-normal leading-tight mt-2 truncate">{material.name}</h4>
                          <span className={`text-[8px] font-mono font-black tracking-wider uppercase ${rStyle.text} block mt-0.5`}>
                            {material.rarity} Drop
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Mat synthesizer actions / Valor market drawer */}
              <div className="w-[340px] border-l border-zinc-850 p-4 overflow-y-auto flex flex-col shrink-0 bg-[#06080c]">
                <div className="border-b border-zinc-90 w pb-3 mb-4">
                  <span className="text-[9px] text-zinc-550 font-bold tracking-widest font-mono uppercase">VAULT DETAIL</span>
                  <h4 className="text-base font-black font-serif text-white tracking-wide uppercase mt-1">Foundry Alchemist</h4>
                </div>

                {vaultFocusMaterial ? (
                  (() => {
                    const meta = EQUIPMENT_MATERIALS[vaultFocusMaterial];
                    const owned = equipmentMaterials[vaultFocusMaterial] || 0;
                    const rStyle = getRarityColor(meta.rarity);
                    
                    let costValor = 100;
                    switch (meta.rarity) {
                      case 'Common': costValor = 150; break;
                      case 'Rare': costValor = 500; break;
                      case 'Epic': costValor = 1800; break;
                      case 'Legendary': costValor = 7500; break;
                      case 'Mythic': costValor = 25000; break;
                    }

                    return (
                      <div className="space-y-4">
                        {/* Summary Display */}
                        <div className={`p-4 rounded-3xl border text-xs font-mono space-y-2 ${rStyle.bg} ${rStyle.border}`}>
                          <div className="flex justify-between items-center text-zinc-500">
                            <span className="text-2xl leading-none block select-none">{meta.emoji}</span>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border border-current/25 ${rStyle.text}`}>{meta.rarity}</span>
                          </div>
                          <h4 className="font-serif font-black text-white text-sm uppercase leading-tight pt-1">{meta.name}</h4>
                          <div className="text-[10px] text-zinc-400 bg-black/40 p-2 border border-zinc-900 rounded-xl leading-relaxed italic pr-2">
                            "{meta.description}"
                          </div>
                          
                          <div className="flex justify-between items-center pt-2 leading-none">
                            <span className="text-zinc-500">Inventory Ballance:</span>
                            <span className="text-zinc-200 font-extrabold text-sm">{owned} Units</span>
                          </div>
                        </div>

                        {/* FUSION SYSTEM MODULE */}
                        <div className="bg-[#0b0c11] border border-zinc-900 p-3.5 rounded-2xl space-y-3 font-mono text-xs">
                          <span className="font-extrabold text-[10px] text-zinc-400 block border-b border-zinc-950 pb-1.5 uppercase">
                            🧪 FOUNDRY COMPONENT SYNTHESIS
                          </span>

                          {meta.rarity !== 'Mythic' ? (
                            <>
                              <p className="text-[10px] text-zinc-500 leading-relaxed pr-2">
                                Merge 3 identical drops together to synthesize 1 higher tier random drop (Common ➔ Rare ➔ Epic ➔ Legendary ➔ Mythic).
                              </p>
                              
                              <div className="flex items-center justify-between font-bold">
                                <span className="text-zinc-500">Merge Requirement:</span>
                                <span className={owned >= 3 ? 'text-emerald-400 font-extrabold' : 'text-rose-500 font-extrabold'}>
                                  {owned} / 3
                                </span>
                              </div>

                              <button
                                onClick={() => handleMaterialsSynthesise(vaultFocusMaterial)}
                                disabled={owned < 3}
                                className={`w-full py-2.5 rounded-xl text-xs font-bold font-mono uppercase cursor-pointer flex items-center justify-center gap-1 transition-all ${
                                  owned >= 3
                                    ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-black border border-emerald-400 hover:scale-[1.02]'
                                    : 'bg-zinc-900 text-zinc-650 opacity-40 cursor-not-allowed border border-transparent'
                                }`}
                              >
                                <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                                <span>SYNTHESIZE COMPONENT</span>
                              </button>
                            </>
                          ) : (
                            <div className="text-center p-2 rounded-xl bg-orange-500/10 text-orange-400 text-[10px] font-extrabold uppercase">
                              🛡️ CROWNMARK ITEM AT MAXIMUM TIER
                            </div>
                          )}
                        </div>

                        {/* VALOR BOUNTY CONVERTER */}
                        <div className="bg-[#0b0c11] border border-zinc-900 p-3.5 rounded-2xl space-y-3 font-mono text-xs">
                          <span className="font-extrabold text-[10px] text-[#fbbf24] block border-b border-zinc-950 pb-1.5 uppercase">
                            ✨ IMPERIAL VALOR BOUNTIES MARKET
                          </span>

                          <p className="text-[10px] text-zinc-505 leading-relaxed pr-2">
                            Trade Valor medals won in battles or produced at shrines to issue instant material shipments.
                          </p>

                          <div className="flex items-center justify-between font-bold">
                            <span className="text-zinc-550">Shipment cost:</span>
                            <span className={resources.valor >= costValor ? 'text-yellow-405 font-bold' : 'text-rose-500'}>
                              {costValor} Valor Medal(s)
                            </span>
                          </div>

                          <button
                            onClick={() => handlePurchaseWithValor(vaultFocusMaterial)}
                            disabled={resources.valor < costValor}
                            className={`w-full py-2.5 rounded-xl text-xs font-bold font-mono uppercase cursor-pointer flex items-center justify-center gap-1 transition-all ${
                              resources.valor >= costValor
                                ? 'bg-gradient-to-r from-[#e7af15] to-[#f59e0b] text-black border border-[#fbbf24] hover:scale-102'
                                : 'bg-zinc-90 w text-zinc-650 opacity-40 cursor-not-allowed border border-transparent'
                            }`}
                          >
                            <Package className="w-3.5 h-3.5 shrink-0" />
                            <span>BUY 1X SHIPMENT</span>
                          </button>
                        </div>
                      </div>
                    );
                  })()
                ) : (
                  <div className="text-center py-20 text-zinc-650 italic leading-relaxed">
                    Select any mineral or drop item on the left grid to synthesis or buy shipments.
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
