import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Search, 
  Award, 
  BookOpen, 
  Shield, 
  Coins, 
  TrendingUp, 
  Heart, 
  Zap, 
  Sparkles, 
  Lock, 
  Unlock, 
  Info, 
  Trophy, 
  Eye, 
  HelpCircle, 
  CheckCircle2,
  Sword,
  GraduationCap,
  Globe,
  Users,
  Boxes
} from 'lucide-react';
import { Resources, Hero, Building, ResearchState, TroopState } from '../types';
import { CROWNSPIRE_HEROES_DATABASE } from '../utils/heroDatabase';
import { getRequiredLevelForTier } from '../utils/troopDatabase';

interface MuseumCodexModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Dynamic application state
  resources?: Resources;
  onResourcesChange?: (next: Resources | ((p: Resources) => Resources)) => void;
  heroes?: Hero[];
  buildings?: Building[];
  research?: ResearchState;
  troops?: TroopState;
  addLog?: (text: string, type: 'info' | 'success' | 'warning' | 'combat') => void;
}

interface CodexItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  stats: string;
  lore: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  category: 'heroes' | 'wildlings' | 'buildings' | 'equipment' | 'lore' | 'resources' | 'troops' | 'research';
  rewards: {
    food?: number;
    wood?: number;
    stone?: number;
    iron?: number;
    valor?: number;
    gems?: number;
  };
  condition: string; // Dynamic unlocking requirement
}

export default function MuseumCodexModal({
  isOpen,
  onClose,
  resources,
  onResourcesChange,
  heroes = [],
  buildings = [],
  research,
  troops,
  addLog
}: MuseumCodexModalProps) {
  const [activeTab, setActiveTab] = useState<'heroes' | 'wildlings' | 'buildings' | 'equipment' | 'lore' | 'resources' | 'troops' | 'research' | 'statistics'>('heroes');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unlocked' | 'locked' | 'legendary' | 'epic'>('all');
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  
  // Persistent tracking state
  const [claimedRewards, setClaimedRewards] = useState<Record<string, boolean>>({});
  const [unlockedManualEntries, setUnlockedManualEntries] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize and load persistent claims & unlocked statuses
  useEffect(() => {
    try {
      const savedClaims = localStorage.getItem('crownspire_museum_claimed_rewards');
      const savedManuals = localStorage.getItem('crownspire_museum_unlocked_manuals');
      if (savedClaims) setClaimedRewards(JSON.parse(savedClaims));
      if (savedManuals) setUnlockedManualEntries(JSON.parse(savedManuals));
    } catch (e) {
      console.error('Failed to load persistent museum data:', e);
    }
  }, [isOpen]);

  // Save persistent state
  const saveClaims = (nextClaims: Record<string, boolean>) => {
    setClaimedRewards(nextClaims);
    localStorage.setItem('crownspire_museum_claimed_rewards', JSON.stringify(nextClaims));
  };

  const saveManuals = (nextManuals: Record<string, boolean>) => {
    setUnlockedManualEntries(nextManuals);
    localStorage.setItem('crownspire_museum_unlocked_manuals', JSON.stringify(nextManuals));
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  if (!isOpen) return null;

  // --- Complete Curated Museum Codex Database ---
  const CODEX_DATABASE: CodexItem[] = [
    // --- HEROES ---
    {
      id: 'hero_valkyrie',
      name: 'High Sovereign Valkyrie',
      subtitle: 'First Angel of Aethelgard',
      description: 'The golden-winged guardian commander who laid the primary foundation stones of Crownspire. Her lance radiates solar resonance.',
      stats: 'Global Buff: +5% Infantry Attack & +3% Legion March Velocity',
      lore: 'Eons ago, she emerged from the crystalline core of the world rifts, bearing a slate-engraved constitution to command local clans into a defensive alliance.',
      rarity: 'Legendary',
      category: 'heroes',
      rewards: { gems: 150, valor: 200 },
      condition: 'Aquire Sovereign Valkyrie via the Tavern Altar summon pool.'
    },
    {
      id: 'hero_shadow',
      name: 'Kage the Shadow Ranger',
      subtitle: 'Executioner of Cursed Ruins',
      description: 'A rogue scout who specializes in silent ambushes, poisonous darts, and maps tracking.',
      stats: 'Global Buff: +4% Cavalry Attuning Speed & +3% Marksmen Armor Piercing',
      lore: 'Raised in the whispering ash-timber forests of the deep south. He serves the High Sovereign from the safety of night shadows.',
      rarity: 'Epic',
      category: 'heroes',
      rewards: { wood: 10000, gems: 50 },
      condition: 'Recruit Kage the Shadow to level 10+.'
    },
    {
      id: 'hero_malakar',
      name: 'Arch-Lich Malakar',
      subtitle: 'Cursed Lord of Glacial Rifts',
      description: 'The fallen sovereign of Crownspire, corrupted by shadow crystals. He commands giant frost beasts and skeletons.',
      stats: 'Global Buff: +6% Siege Engine Attack & +2% Spell Vampirism',
      lore: 'He was once a wise scholar who tried to harness the Spire energy directly. The crystalline feedback shattered his sanity and bound his soul to cold iron.',
      rarity: 'Mythic',
      category: 'heroes',
      rewards: { gems: 300, stone: 15000 },
      condition: 'Defeat Campaign Chapter 15 Elite Malakar boss.'
    },

    // --- WILDLINGS ---
    {
      id: 'wild_frost_giant',
      name: 'Glacial Rift Frost Giant',
      subtitle: 'Titan of the Frozen Wastes',
      description: 'Massive frozen titans carrying glacial boulders. They patrol deep mountain rifts with fierce territorial rage.',
      stats: 'Global Buff: +4% Keep Wall Durability & +2% Army Health Pool',
      lore: 'Woken from centuries of volcanic hibernation when the Sovereign Keep reached level 10. They treat copper conduits as invasive threats.',
      rarity: 'Epic',
      category: 'wildlings',
      rewards: { stone: 12000, gems: 75 },
      condition: 'Defeat a level 15+ Frost Giant on the World Map.'
    },
    {
      id: 'wild_shadow_hound',
      name: 'Rift Obsidian Hound',
      subtitle: 'Feral Pack Stalker',
      description: 'Beasts forged of shadow stardust that leak from unstable rift portals. They feed on regional timber glades.',
      stats: 'Global Buff: +2% Scout Speed & +1.5% Food Gathering Rate',
      lore: 'Where the barrier between realms grows thin, hounds slip through to plunder grain fields. Dispatching them keeps the territory safe.',
      rarity: 'Common',
      category: 'wildlings',
      rewards: { food: 8000, valor: 50 },
      condition: 'Defeat any level 5+ Hound on the World Map.'
    },
    {
      id: 'wild_scourge_wyrm',
      name: 'Crystalline Scourge Wyrm',
      subtitle: 'Elder World-Boss',
      description: 'A glowing dragon wrapped in copper currents and glowing amethysts. It attacks with absolute glacial beams.',
      stats: 'Global Buff: +5% Overall Troop Combat Rating & +4% Ingot Yield',
      lore: 'An ancient guardian of the deep rifts. It views the Sovereign Lord as an unworthy pretender to the crystalline throne.',
      rarity: 'Legendary',
      category: 'wildlings',
      rewards: { gems: 250, iron: 10000 },
      condition: 'Coordinate an Alliance Rally to slay the World-Boss Scourge Wyrm.'
    },

    // --- BUILDINGS ---
    {
      id: 'build_keep',
      name: 'Citadel Keep Castle',
      subtitle: 'Sovereign Headquarters',
      description: 'The majestic control castle ruling over Crownspire. Determines maximum building levels and chapter expansions.',
      stats: 'Global Buff: +10% Construction Velocity & +5% Maximum Recruitment Space',
      lore: 'Constructed directly above the Leyline core. Its structural columns merge dense weathered slate blocks with humming copper tubes.',
      rarity: 'Legendary',
      category: 'buildings',
      rewards: { valor: 500, gems: 100 },
      condition: 'Upgrade the Citadel Keep to Level 15 or higher.'
    },
    {
      id: 'build_warehouse',
      name: 'Vault Warehouse',
      subtitle: 'Safe Treasury Silos',
      description: 'Fenced storage vault designed to shelter collected assets from external plunder borders.',
      stats: 'Global Buff: +12% Protected Resource Capacity & +3% Wood Yield',
      lore: 'Built with dense cedar lumber beams and iron padlocks. Scholars guard the ledgers with life-binding runic contracts.',
      rarity: 'Rare',
      category: 'buildings',
      rewards: { wood: 12000, stone: 8000 },
      condition: 'Upgrade the Vault Warehouse to Level 10 or higher.'
    },
    {
      id: 'build_shrine',
      name: 'Valor Sovereign Shrine',
      subtitle: 'Divine Altar of Communion',
      description: 'Sacred obelisk where citizens commune to generate passive Valor energy points.',
      stats: 'Global Buff: +5% Valor Production Rate & +4% Hero Spell Damage',
      lore: 'The obelisk hums with the high sovereign frequency. Devoted paladins gather at twilight to clean and polish its copper nodes.',
      rarity: 'Epic',
      category: 'buildings',
      rewards: { valor: 300, gems: 100 },
      condition: 'Establish a Valor Sovereign Shrine in your City.'
    },

    // --- EQUIPMENT ---
    {
      id: 'equip_lance',
      name: 'Aethelgard Star-Lance',
      subtitle: 'Founding General Spear',
      description: 'A glowing celestial spear forged from fallen star meteor iron and wrapped in copper conductors.',
      stats: 'Global Buff: +12% Active Hero Attack Power & +5% Infantry Piercing',
      lore: 'Carried by Valkyrie during the first siege of the Frozen Citadel. It still glows with an eye-safe amber warmth.',
      rarity: 'Legendary',
      category: 'equipment',
      rewards: { gems: 200, iron: 8000 },
      condition: 'Forge any Legendary Spear weapon in the Star Forge.'
    },
    {
      id: 'equip_shield',
      name: 'Weathered Slate Wall-Aegis',
      subtitle: 'Bastion Protection Shield',
      description: 'Heavy tactical wall shielding composed of interlocking slate panels and runic bronze borders.',
      stats: 'Global Buff: +6% Legion Block Defense & +2% Hospital Cure Velocity',
      lore: 'Issued to frontline vanguard champions to absorb the crushing force of frost giant landslide impacts.',
      rarity: 'Rare',
      category: 'equipment',
      rewards: { stone: 15000, food: 10000 },
      condition: 'Acquire and equip any Rare shield item in the sovereign armory.'
    },

    // --- LORE ---
    {
      id: 'lore_first_spire',
      name: 'The Founding Annals',
      subtitle: 'Codex Scroll Chapter I',
      description: 'Parchment records detailing the primary discovery of the pulsing crystal spires in the Year of the Comet.',
      stats: 'Global Buff: +3% Academy Research Speed',
      lore: '"And lo, the pioneers crossed the smoking ash mountains, finding a golden spire humming in the quiet winter mist..."',
      rarity: 'Rare',
      category: 'lore',
      rewards: { gems: 50, valor: 250 },
      condition: 'Unlock Chapter 1 of the Story Campaign mode.'
    },
    {
      id: 'lore_scourge_annals',
      name: 'Cursed Chronicle of Frost',
      subtitle: 'Codex Scroll Chapter II',
      description: 'A study of the dark ice magic that corrupted Malakar and created the glacial wastes.',
      stats: 'Global Buff: +4% Damage Versus Undead Legions',
      lore: '"The crystal turned dark, bleeding a cold oil that poisoned the soil. Malakar wept, but touched the core nonetheless..."',
      rarity: 'Epic',
      category: 'lore',
      rewards: { gems: 75, valor: 150 },
      condition: 'Defeat Campaign Chapter 8 Boss Vanguard.'
    },

    // --- RESOURCES ---
    {
      id: 'res_wheat',
      name: 'Sovereign Golden Wheat',
      subtitle: 'Primary Agrarian Yield',
      description: 'Highly resilient grain engineered by Citadel druids to flourish in frost conditions.',
      stats: 'Global Buff: +5% Farm Production Rate & +2% Maximum Storage Limit',
      lore: 'Bread baked from this grain retains its hot oven aroma for days, filling marching legions with unparalleled valor.',
      rarity: 'Common',
      category: 'resources',
      rewards: { food: 20000 },
      condition: 'Reach 100,000 Total Food in your warehouse treasury.'
    },
    {
      id: 'res_slate',
      name: 'Weathered Slate Blocks',
      subtitle: 'Bastion Foundation Stone',
      description: 'Heavy, dense volcanic slate harvested from mountain quarries, essential for castle fortresses.',
      stats: 'Global Buff: +5% Stone Gathering Velocity & +3% Wall Fortification',
      lore: 'The stone contains natural traces of ancient copper, allowing it to easily conduct protective runic shield frequencies.',
      rarity: 'Common',
      category: 'resources',
      rewards: { stone: 20000 },
      condition: 'Harvest 50,000 Slate units from quarries.'
    },

    // --- TROOPS ---
    {
      id: 'troop_ vanguard',
      name: 'Spire Royal Vanguard',
      subtitle: 'Tier 4 Heavy Infantry',
      description: 'Elites swordsmen clad in heavy slate plate, holding unbreakable block walls.',
      stats: 'Global Buff: +4% Infantry Attack & +4% Infantry Health Pool',
      lore: 'They swear an oath to speak only when battle is joined. The clash of their runic swords acts as their true voice.',
      rarity: 'Epic',
      category: 'troops',
      rewards: { food: 10000, gems: 80 },
      condition: 'Unlock Tier 4 Infantry inside the War Academy.'
    },
    {
      id: 'troop_rangers',
      name: 'Rift-Arrow Marksmen',
      subtitle: 'Tier 4 Precision Archers',
      description: 'Archers equipped with composite ash wood bows strung with pulsing crystal thread.',
      stats: 'Global Buff: +4% Marksmen Attack & +3% Archer Piercing Range',
      lore: 'Can loose an arrow through a shadow hound\'s eye in a blinding blizzard from 300 paces away.',
      rarity: 'Epic',
      category: 'troops',
      rewards: { wood: 10000, gems: 80 },
      condition: 'Unlock Tier 4 Marksmen inside the War Academy.'
    },

    // --- RESEARCH ---
    {
      id: 'tech_resonance',
      name: 'Spire Energy Resonance',
      subtitle: 'Leyline Magic Study',
      description: 'Academic research aimed at safely channeling the raw energy hum of crystal spires directly into workshop ovens.',
      stats: 'Global Buff: +5% Research Speed & +3% Gold Income Rate',
      lore: 'By wrapping the crystalline hubs in copper loops, academy scholars successfully reduced research volatile loops by 40%.',
      rarity: 'Legendary',
      category: 'research',
      rewards: { gems: 120, valor: 200 },
      condition: 'Max out Spire Resonance research branch.'
    },
    {
      id: 'tech_sovereign_law',
      name: 'Sovereign Command Doctrine',
      subtitle: 'Alliance Charter Codification',
      description: 'Legal protocols establishing stable tax rates and security boundaries across shared alliance territories.',
      stats: 'Global Buff: +4% Alliance Gathering Speed & +3% Rally Capacity',
      lore: 'A golden age is forged on clear rules. The Sovereign Law ledger prevents regional disputes over crystal veins.',
      rarity: 'Rare',
      category: 'research',
      rewards: { iron: 2000, wood: 8000 },
      condition: 'Unlock level 5 Sovereign Law research.'
    }
  ];

  // --- Dynamic Unlocking Resolver ---
  const isItemUnlocked = (item: CodexItem): boolean => {
    // If manually unlocked, return true
    if (unlockedManualEntries[item.id]) return true;

    // Check dynamic state variables to see if the user has naturally unlocked it!
    switch (item.id) {
      case 'hero_valkyrie':
        return heroes.some(h => h.name.toLowerCase().includes('valkyrie') || h.type === 'War');
      case 'hero_shadow':
        return heroes.some(h => h.name.toLowerCase().includes('kage') || h.level >= 5 || h.type === 'Food');
      case 'hero_malakar':
        return heroes.length >= 3; // Mocking achievement
      case 'wild_frost_giant':
        return true; // Discovered from initial lore
      case 'wild_shadow_hound':
        return true; // Discovered from initial lore
      case 'wild_scourge_wyrm':
        return heroes.some(h => h.level >= 10); // Mock achievement based on level
      case 'build_keep':
        const castle = buildings.find(b => b.id === 'castle');
        return castle ? castle.level >= 2 : false;
      case 'build_warehouse':
        const warehouse = buildings.find(b => b.id === 'warehouse');
        return warehouse ? warehouse.level >= 2 : false;
      case 'build_shrine':
        return buildings.some(b => b.id === 'shrine' && b.level >= 1);
      case 'equip_lance':
        return true; // Starforge unlocked initially
      case 'equip_shield':
        return true; // Discovered
      case 'lore_first_spire':
        return true; // Initial campaign unlock
      case 'lore_scourge_annals':
        return buildings.some(b => b.id === 'castle' && b.level >= 3);
      case 'res_wheat':
        return resources ? resources.food >= 1000 : false;
      case 'res_slate':
        return resources ? resources.stone >= 500 : false;
      case 'troop_ vanguard':
        return troops ? troops.infantry > 0 : false;
      case 'troop_rangers':
        return troops ? troops.marksmen > 0 : false;
      case 'tech_resonance':
        return research ? research.economy_research_level >= 1 : false;
      case 'tech_sovereign_law':
        return research ? research.military_research_level >= 1 : false;
      default:
        return false;
    }
  };

  // --- Claim Reward Event Handler ---
  const claimDiscoveryReward = (item: CodexItem) => {
    if (claimedRewards[item.id]) {
      triggerToast('Sovereign claim already complete!');
      return;
    }

    // Process actual resource grants if callback is present
    if (onResourcesChange && resources) {
      onResourcesChange(prev => {
        const next = { ...prev };
        if (item.rewards.food) next.food += item.rewards.food;
        if (item.rewards.wood) next.wood += item.rewards.wood;
        if (item.rewards.stone) next.stone += item.rewards.stone;
        if (item.rewards.iron) next.iron += item.rewards.iron;
        if (item.rewards.valor) next.valor += item.rewards.valor;
        // gems are mapped to gold or raw valor boost if no separate gem field in resources
        if (item.rewards.gems) {
          next.valor += item.rewards.gems * 10; // exchange rate
        }
        return next;
      });
    }

    // Update claimed map
    const nextClaims = { ...claimedRewards, [item.id]: true };
    saveClaims(nextClaims);

    if (addLog) {
      addLog(`claimed Discovery Reward for "${item.name}": +${JSON.stringify(item.rewards)}`, 'success');
    }

    triggerToast(`🏛️ Discovery reward claimed! Ledger updated.`);
  };

  // --- Calculated Statistics ---
  const activeCategoryItems = CODEX_DATABASE.filter(item => item.category === activeTab);
  
  const totalItemsCount = CODEX_DATABASE.length;
  const unlockedItemsCount = CODEX_DATABASE.filter(isItemUnlocked).length;
  const overallCompletionRate = Math.round((unlockedItemsCount / totalItemsCount) * 100);

  const getCategoryCompletionRate = (cat: string) => {
    const catItems = CODEX_DATABASE.filter(item => item.category === cat);
    if (catItems.length === 0) return 0;
    const catUnlocked = catItems.filter(isItemUnlocked).length;
    return Math.round((catUnlocked / catItems.length) * 100);
  };

  // --- Search and Filtering Logic ---
  const filteredItems = activeCategoryItems.filter(item => {
    const isUnlocked = isItemUnlocked(item);
    
    // Search
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    // Filter type
    if (filterType === 'unlocked') return isUnlocked;
    if (filterType === 'locked') return !isUnlocked;
    if (filterType === 'legendary') return isUnlocked && item.rarity === 'Legendary';
    if (filterType === 'epic') return isUnlocked && item.rarity === 'Epic';
    return true;
  });

  const selectedItem = selectedItemId ? CODEX_DATABASE.find(item => item.id === selectedItemId) : null;

  // Render dynamic Rarity style
  const getRarityBadgeStyle = (rarity: string) => {
    switch (rarity) {
      case 'Mythic':
        return 'bg-red-500/10 border-red-500/30 text-red-400';
      case 'Legendary':
        return 'bg-amber-500/10 border-amber-500/30 text-amber-500';
      case 'Epic':
        return 'bg-purple-500/10 border-purple-500/30 text-purple-400';
      case 'Rare':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      default:
        return 'bg-zinc-500/10 border-zinc-500/30 text-zinc-400';
    }
  };

  const getTabLabel = (tab: string) => {
    switch (tab) {
      case 'heroes': return '👤 Heroes';
      case 'wildlings': return '🐺 Wildlings';
      case 'buildings': return '🏛️ Buildings';
      case 'equipment': return '⚔️ Equipment';
      case 'lore': return '📖 Lore';
      case 'resources': return '💎 Resources';
      case 'troops': return '🛡️ Troops';
      case 'research': return '💡 Research';
      default: return tab;
    }
  };

  return (
    <div 
      id="museum-codex-overlay-backdrop"
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none pointer-events-auto"
    >
      <motion.div 
        id="museum-codex-modal-card"
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-4xl h-[90vh] md:h-[750px] bg-[#090b10] border border-amber-500/25 rounded-3xl overflow-hidden flex flex-col shadow-[0_24px_50px_rgba(0,0,0,0.9)] relative"
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
        
        {/* Toast Notifier overlay */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="absolute top-6 left-1/2 -translate-x-1/2 z-50 bg-[#141824] border border-amber-500/50 px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-mono font-black tracking-wider text-amber-400"
            >
              <Sparkles className="w-4 h-4 animate-spin text-amber-500" />
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* HEADER SECTION */}
        <div className="bg-[#0c0f17] border-b border-zinc-900/60 p-5 shrink-0 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
              <BookOpen className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-serif font-black text-[#f3f4f6] tracking-widest uppercase flex items-center gap-2">
                Citadel Codex Museum 
              </h2>
              <p className="text-[10px] font-mono text-zinc-500 tracking-wide mt-0.5">
                Register historical relics to trigger permanent account-wide statistics
              </p>
            </div>
          </div>

          {/* OVERALL COMPLETION HUD */}
          <div className="flex items-center gap-4 bg-zinc-950/60 border border-zinc-900/50 px-4 py-2 rounded-2xl">
            <div className="flex flex-col">
              <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-wider">
                Overall Registry Rate
              </span>
              <span className="text-sm font-black font-mono text-amber-400">
                {overallCompletionRate}%
              </span>
            </div>
            <div className="w-32 bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-zinc-800 relative">
              <motion.div 
                className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${overallCompletionRate}%` }}
                transition={{ duration: 0.8 }}
              />
              {/* Sparkle cursor */}
              {overallCompletionRate > 0 && (
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_8px_white]" 
                  style={{ left: `calc(${overallCompletionRate}% - 2px)` }} 
                />
              )}
            </div>
            <div className="text-[10px] font-mono text-zinc-400">
              ({unlockedItemsCount}/{totalItemsCount})
            </div>
          </div>

          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-zinc-950/50 hover:bg-rose-950/30 border border-zinc-900 hover:border-rose-900/50 text-zinc-500 hover:text-rose-400 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CATEGORY TABS CONTAINER */}
        <div className="bg-[#0b0c10] border-b border-zinc-950 px-5 py-2.5 overflow-x-auto no-scrollbar shrink-0 flex items-center gap-1.5">
          {(['heroes', 'wildlings', 'buildings', 'equipment', 'lore', 'resources', 'troops', 'research', 'statistics'] as const).map(tab => {
            const isActive = activeTab === tab;
            const completion = tab !== 'statistics' ? getCategoryCompletionRate(tab) : null;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setSelectedItemId(null);
                }}
                className={`px-3.5 py-2 text-xs font-mono font-bold tracking-wider rounded-xl border flex items-center gap-2 shrink-0 transition-all cursor-pointer active:scale-97 ${
                  isActive 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 shadow-[inset_0_1px_15px_rgba(245,158,11,0.06)]' 
                    : 'bg-zinc-950/30 border-zinc-900/60 hover:border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span>{getTabLabel(tab)}</span>
                {completion !== null && (
                  <span className={`text-[9px] font-mono px-1 py-0.2 rounded-md ${
                    completion === 100 
                      ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/30' 
                      : 'bg-zinc-900 text-zinc-500'
                  }`}>
                    {completion}%
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* BOTTOM CONTENT AREA */}
        <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
          
          {/* STATISTICS SCREEN */}
          {activeTab === 'statistics' ? (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <h3 className="text-xs font-mono font-black text-amber-500 tracking-wider uppercase border-b border-zinc-900 pb-2">
                🏛️ CITADEL HISTORIC LEDGER STATS
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#0b0e14] border border-zinc-900 p-4 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-zinc-500">Unlocks Claimed</div>
                    <div className="text-lg font-black font-mono text-zinc-100">
                      {Object.keys(claimedRewards).length} / {totalItemsCount}
                    </div>
                  </div>
                </div>

                <div className="bg-[#0b0e14] border border-zinc-900 p-4 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
                    <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-zinc-500">Museum Prestige Rating</div>
                    <div className="text-lg font-black font-mono text-amber-400">
                      {unlockedItemsCount * 25} CR
                    </div>
                  </div>
                </div>

                <div className="bg-[#0b0e14] border border-zinc-900 p-4 rounded-2xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-mono text-zinc-500">Discovered Items</div>
                    <div className="text-lg font-black font-mono text-purple-400">
                      {unlockedItemsCount}
                    </div>
                  </div>
                </div>
              </div>

              {/* DYNAMIC PROGRESS ACCORDIONS */}
              <div className="bg-[#0a0d13]/50 border border-zinc-950 p-5 rounded-2xl space-y-4">
                <h4 className="text-[11px] font-mono font-black text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                  <Coins className="w-3.5 h-3.5 text-amber-500" /> Category Breakdown Ledger
                </h4>

                <div className="space-y-3.5">
                  {(['heroes', 'wildlings', 'buildings', 'equipment', 'lore', 'resources', 'troops', 'research'] as const).map(cat => {
                    const comp = getCategoryCompletionRate(cat);
                    const list = CODEX_DATABASE.filter(i => i.category === cat);
                    const unlocked = list.filter(isItemUnlocked).length;
                    
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-zinc-400 capitalize font-bold">{getTabLabel(cat)}</span>
                          <span className="text-zinc-500">({unlocked}/{list.length}) <span className="text-amber-500 font-bold ml-1">{comp}%</span></span>
                        </div>
                        <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden border border-zinc-900">
                          <div 
                            className="h-full bg-amber-500/80 rounded-full" 
                            style={{ width: `${comp}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ACCOUNT WIDE MUSEUM BUFF OVERVIEW */}
              <div className="bg-gradient-to-br from-[#0c101a] to-[#080a10] border border-zinc-900 p-5 rounded-2xl">
                <h4 className="text-[11px] font-mono font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5 mb-3">
                  🛡️ Permanent Ledger Status Buffs
                </h4>
                <p className="text-[10px] font-mono text-zinc-500 leading-relaxed mb-4">
                  These represent passive account-wide buffs unlocked dynamically via discovered and registered relics in the Citadel Codex:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="bg-[#05060b] border border-zinc-950 px-4 py-3 rounded-xl flex items-center gap-3">
                    <Sword className="w-4 h-4 text-rose-400 shrink-0" />
                    <div>
                      <div className="text-[9px] font-mono text-zinc-500">Legion Combat Core</div>
                      <div className="text-xs font-mono font-bold text-rose-300">
                        +{unlockedItemsCount * 0.5}% Base Combat Rating
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#05060b] border border-zinc-950 px-4 py-3 rounded-xl flex items-center gap-3">
                    <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <div className="text-[9px] font-mono text-zinc-500">Sovereign Craft & Build</div>
                      <div className="text-xs font-mono font-bold text-emerald-300">
                        +{unlockedItemsCount * 0.4}% Construction Speed
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#05060b] border border-zinc-950 px-4 py-3 rounded-xl flex items-center gap-3">
                    <GraduationCap className="w-4 h-4 text-blue-400 shrink-0" />
                    <div>
                      <div className="text-[9px] font-mono text-zinc-500">Leyline Resonance</div>
                      <div className="text-xs font-mono font-bold text-blue-300">
                        +{unlockedItemsCount * 0.3}% Research Speed
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#05060b] border border-zinc-950 px-4 py-3 rounded-xl flex items-center gap-3">
                    <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                    <div>
                      <div className="text-[9px] font-mono text-zinc-500">Bastion Defensive Integrity</div>
                      <div className="text-xs font-mono font-bold text-amber-300">
                        +{unlockedItemsCount * 0.5}% Keep Wall HP
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* SIDEBAR FOR SEARCH, FILTER AND CARD GRID */}
              <div className="flex-1 flex flex-col min-h-0 border-r border-zinc-950">
                {/* Search & Filter row */}
                <div className="p-4 bg-[#07090e] border-b border-zinc-950 flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder={`Search ${getTabLabel(activeTab)}...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-900 rounded-xl pl-9 pr-4 py-2 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50"
                    />
                  </div>
                  
                  <select
                    value={filterType}
                    onChange={(e: any) => setFilterType(e.target.value)}
                    className="bg-zinc-950 border border-zinc-900 rounded-xl px-3 py-2 text-xs font-mono text-zinc-400 focus:outline-none focus:border-amber-500/50 cursor-pointer"
                  >
                    <option value="all">All Items</option>
                    <option value="unlocked">Discovered</option>
                    <option value="locked">Locked</option>
                    <option value="legendary">Legendary Rarity</option>
                    <option value="epic">Epic Rarity</option>
                  </select>
                </div>

                {/* GRID OF DISCOVERED/LOCKED CARDS */}
                <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
                  {filteredItems.length === 0 ? (
                    <div className="h-full flex flex-col justify-center items-center text-center p-6">
                      <HelpCircle className="w-10 h-10 text-zinc-700 animate-bounce mb-3" />
                      <p className="text-xs font-mono text-zinc-500">
                        No codex entries found matching query.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                      {filteredItems.map(item => {
                        const isUnlocked = isItemUnlocked(item);
                        const isClaimed = claimedRewards[item.id];
                        const isSelected = selectedItemId === item.id;
                        
                        return (
                          <motion.div
                            id={`codex-item-card-${item.id}`}
                            key={item.id}
                            layoutId={item.id}
                            onClick={() => setSelectedItemId(item.id)}
                            whileHover={{ y: -2, scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden flex flex-col justify-between h-[120px] ${
                              isSelected 
                                ? 'bg-amber-500/5 border-amber-500/40' 
                                : isUnlocked
                                ? 'bg-[#0b0e15] border-zinc-900/60 hover:border-zinc-800'
                                : 'bg-[#06080b]/90 border-zinc-950'
                            }`}
                          >
                            {/* LOCKED SHADOW OVERLAY */}
                            {!isUnlocked && (
                              <div className="absolute inset-0 bg-black/60 pointer-events-none z-10 flex items-center justify-center">
                                <Lock className="w-4 h-4 text-zinc-700" />
                              </div>
                            )}

                            <div>
                              {/* Rarity & Claims */}
                              <div className="flex items-center justify-between">
                                <span className={`text-[8px] font-mono px-2 py-0.5 rounded-full border ${getRarityBadgeStyle(item.rarity)}`}>
                                  {item.rarity}
                                </span>
                                {isUnlocked && (
                                  <span>
                                    {isClaimed ? (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                    ) : (
                                      <Award className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                                    )}
                                  </span>
                                )}
                              </div>

                              {/* Title */}
                              <h4 className={`text-[11px] font-serif font-black tracking-wide mt-2.5 truncate ${
                                isUnlocked ? 'text-zinc-100' : 'text-zinc-650'
                              }`}>
                                {isUnlocked ? item.name : 'Unknown Relic'}
                              </h4>
                              
                              <p className="text-[9px] font-mono text-zinc-500 truncate mt-0.5">
                                {isUnlocked ? item.subtitle : 'Locked Gallery Fragment'}
                              </p>
                            </div>

                            {/* Click status bar */}
                            <div className="flex items-center justify-between text-[8px] font-mono text-zinc-500 border-t border-zinc-900/40 pt-1.5 mt-2">
                              <span>ID: {item.id.slice(0, 10)}</span>
                              <span className="text-amber-500">Details →</span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* DETAILS PARCHMENT DRAWER PANEL (RIGHT) */}
              <div className="w-full md:w-[320px] bg-[#07090e] border-t md:border-t-0 md:border-l border-zinc-950 p-5 flex flex-col justify-between overflow-y-auto no-scrollbar">
                {selectedItem ? (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedItem.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-5"
                    >
                      {/* RELIC HEADER */}
                      <div className="space-y-2">
                        <span className={`text-[9px] font-mono px-2 py-0.5 rounded border ${getRarityBadgeStyle(selectedItem.rarity)}`}>
                          {selectedItem.rarity}
                        </span>
                        
                        <h3 className="text-sm font-serif font-black text-zinc-100 uppercase tracking-wider">
                          {isItemUnlocked(selectedItem) ? selectedItem.name : 'Locked Ancient Relic'}
                        </h3>
                        
                        <p className="text-[10px] font-mono text-amber-500/80 italic">
                          {isItemUnlocked(selectedItem) ? selectedItem.subtitle : 'Classified Vault Artifact'}
                        </p>
                      </div>

                      {/* DESCRIPTION */}
                      <div className="bg-[#05060a] border border-zinc-950 p-3 rounded-xl">
                        <p className="text-xs font-mono text-zinc-400 leading-relaxed">
                          {isItemUnlocked(selectedItem) 
                            ? selectedItem.description 
                            : 'This historical artifact belongs to a locked ledger segment. Complete exploration stages and develop your keep structures to reveal its cosmic profile.'
                          }
                        </p>
                      </div>

                      {/* STATS BUFFS */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono font-bold text-amber-500 tracking-wider uppercase block">
                          🏺 Passive Account-Wide Buff
                        </span>
                        <div className="bg-[#0a0f18] border border-blue-950/40 p-3 rounded-xl flex items-start gap-2">
                          <Zap className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <span className="text-[10px] font-mono text-blue-300 leading-relaxed font-bold">
                            {isItemUnlocked(selectedItem) 
                              ? selectedItem.stats 
                              : 'Unlock entry to activate passive stat boost permanent bonuses.'
                            }
                          </span>
                        </div>
                      </div>

                      {/* LORE BLOCK */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono font-bold text-zinc-500 tracking-wider uppercase block">
                          📖 Chronicles of Aethelgard
                        </span>
                        <p className="text-[10px] font-mono text-zinc-500 leading-relaxed italic bg-zinc-950/20 p-3 rounded-xl border border-zinc-950">
                          {isItemUnlocked(selectedItem) 
                            ? `"${selectedItem.lore}"` 
                            : '"The historic chronicles of this asset are sealed in volcanic vault libraries until the item has been recovered..."'
                          }
                        </p>
                      </div>

                      {/* UNLOCK CONDITION */}
                      <div className="bg-zinc-950/80 border border-zinc-900/60 p-3 rounded-xl space-y-1">
                        <div className="text-[9px] font-mono text-zinc-500 uppercase">Aquisition Condition</div>
                        <p className="text-[10px] font-mono text-zinc-300 leading-relaxed flex items-center gap-1.5">
                          {isItemUnlocked(selectedItem) ? (
                            <span className="text-emerald-400 flex items-center gap-1">✓ Complete</span>
                          ) : (
                            <span className="text-rose-400 flex items-center gap-1">🔒 Unmet</span>
                          )}
                          <span className="text-zinc-400"> - {selectedItem.condition}</span>
                        </p>
                      </div>

                      {/* DISCOVERY REWARDS ACTION */}
                      {isItemUnlocked(selectedItem) && (
                        <div className="pt-2 border-t border-zinc-950">
                          {claimedRewards[selectedItem.id] ? (
                            <div className="bg-zinc-950 border border-zinc-900 text-zinc-500 text-center py-2.5 rounded-xl text-xs font-mono">
                              ✓ Claimed Discovery Reward
                            </div>
                          ) : (
                            <button
                              onClick={() => claimDiscoveryReward(selectedItem)}
                              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 border border-amber-400/20 text-black text-center py-2.5 rounded-xl text-xs font-mono font-black tracking-wider transition-all cursor-pointer shadow-lg active:scale-97"
                            >
                              Claim Discovery Reward (
                              {Object.entries(selectedItem.rewards).map(([key, val]) => `${val} ${key.toUpperCase()}`).join(', ')}
                              )
                            </button>
                          )}
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                ) : (
                  <div className="h-full flex flex-col justify-center items-center text-center text-zinc-600 space-y-3">
                    <Trophy className="w-10 h-10 text-zinc-800 animate-pulse" />
                    <div>
                      <p className="text-xs font-mono font-bold">Select a Relic</p>
                      <p className="text-[10px] font-mono text-zinc-500 mt-1">
                        Select any card inside the active gallery tab to inspect detailed passive bonuses, historical narratives, and claim discovery rewards.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </motion.div>
    </div>
  );
}
