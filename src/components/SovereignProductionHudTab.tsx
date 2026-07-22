import { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Download, 
  Mail, 
  Settings, 
  TrendingUp, 
  Shield, 
  Coins, 
  Compass, 
  Search, 
  MessageSquare, 
  Send, 
  CheckCircle, 
  Clock, 
  Package, 
  Lock, 
  Unlock, 
  UserCheck, 
  ChevronRight, 
  Plus, 
  X, 
  Code, 
  RefreshCw, 
  FileText, 
  ChevronDown, 
  Folder 
} from 'lucide-react';

// Define the resources structure
interface ResourceState {
  food: number;
  wood: number;
  stone: number;
  iron: number;
  gold: number;
  crystals: number;
}

// Define the hero structure
interface Hero {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rarity: 'Legendary' | 'Epic' | 'Rare';
  level: number;
  maxLevel: number;
  xp: number;
  xpRequired: number;
  shards: number;
  shardsRequired: number;
  stars: number;
  unlocked: boolean;
  power: number;
  type: string;
  equipment: {
    weapon: number;
    helmet: number;
    armor: number;
    ring: number;
  };
}

// Define the item structure
interface BagItem {
  id: string;
  name: string;
  icon: string;
  quantity: number;
  type: 'resource' | 'speedup' | 'chest';
  desc: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  useAmount: number;
  resourceType?: keyof ResourceState | 'xpPotions';
}

export default function SovereignProductionHudTab() {
  // Global simulated wallets
  const [resources, setResources] = useState<ResourceState>({
    food: 580000,
    wood: 490000,
    stone: 310000,
    iron: 155000,
    gold: 85000,
    crystals: 14500
  });

  const [powerRating, setPowerRating] = useState<number>(3452900);
  const [vipLevel, setVipLevel] = useState<number>(12);
  const [lordName, setLordName] = useState<string>('Lord Aurelius');
  const [xpPotions, setXpPotions] = useState<number>(24);
  const [isCityView, setIsCityView] = useState<boolean>(true);
  
  // HUD state overrides
  const [btnStateOverride, setBtnStateOverride] = useState<'normal' | 'hover' | 'pressed' | 'disabled' | null>(null);
  const [disabledButtons, setDisabledButtons] = useState<Record<string, boolean>>({
    'wayfinder': false,
    'bag': false,
  });

  // UI Navigation states
  const [activePopup, setActivePopup] = useState<'shop' | 'heroes' | 'bag' | 'quest' | 'alliance' | 'mail' | 'settings' | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [rewardClaimOverlay, setRewardClaimOverlay] = useState<{ name: string; quantity: number; icon: string; rarity: string } | null>(null);

  // Floating text array for resource count ups
  const [floatingTexts, setFloatingTexts] = useState<{ id: number; text: string; x: number; y: number }[]>([]);

  // Sub-states: Shop
  const [dailyChestClaimed, setDailyChestClaimed] = useState<boolean>(false);

  // Sub-states: Heroes
  const [heroes, setHeroes] = useState<Hero[]>([
    {
      id: 'h_01',
      name: 'Eldrin Sunstrider',
      title: 'Grand Mage of the Citadel',
      avatar: '🧙‍♂️',
      rarity: 'Legendary',
      level: 42,
      maxLevel: 60,
      xp: 2400,
      xpRequired: 5000,
      shards: 15,
      shardsRequired: 30,
      stars: 4,
      unlocked: true,
      power: 74200,
      type: 'Magic Support',
      equipment: { weapon: 4, helmet: 3, armor: 3, ring: 5 }
    },
    {
      id: 'h_02',
      name: 'Garrick Ironfist',
      title: 'Vanguard Commander of legions',
      avatar: '🛡️',
      rarity: 'Epic',
      level: 35,
      maxLevel: 50,
      xp: 4100,
      xpRequired: 4500,
      shards: 24,
      shardsRequired: 20,
      stars: 3,
      unlocked: true,
      power: 48900,
      type: 'Infantry Defense',
      equipment: { weapon: 3, helmet: 4, armor: 4, ring: 2 }
    },
    {
      id: 'h_03',
      name: 'Lady Seraphina',
      title: 'Goddess of the Crystallite',
      avatar: '🧚‍♀️',
      rarity: 'Legendary',
      level: 1,
      maxLevel: 60,
      xp: 0,
      xpRequired: 1000,
      shards: 8,
      shardsRequired: 10,
      stars: 1,
      unlocked: false,
      power: 12500,
      type: 'Cavalry Offense',
      equipment: { weapon: 1, helmet: 1, armor: 1, ring: 1 }
    }
  ]);
  const [selectedHeroId, setSelectedHeroId] = useState<string>('h_01');

  // Sub-states: Bag / Inventory
  const [activeBagTab, setActiveBagTab] = useState<'resource' | 'speedup' | 'chest'>('resource');
  const [selectedBagItem, setSelectedBagItem] = useState<string | null>('item_01');
  const [inventoryItems, setInventoryItems] = useState<BagItem[]>([
    { id: 'item_01', name: 'Grain Token (100K)', icon: '🌾', quantity: 8, type: 'resource', desc: 'Adds 100,000 Wheat grain directly into your Citadel granaries.', rarity: 'common', useAmount: 100000, resourceType: 'food' },
    { id: 'item_02', name: 'Timber Load (100K)', icon: '🪵', quantity: 5, type: 'resource', desc: 'Adds 100,000 Timber into your warehouse yards.', rarity: 'common', useAmount: 100000, resourceType: 'wood' },
    { id: 'item_03', name: 'Quarry Granite (50K)', icon: '🪨', quantity: 12, type: 'resource', desc: 'Adds 50,000 processed granite stone blocks for castle upgrades.', rarity: 'rare', useAmount: 50000, resourceType: 'stone' },
    { id: 'item_04', name: 'Iron Ore Box (50K)', icon: '🔩', quantity: 4, type: 'resource', desc: 'Adds 50,000 refined iron ores for troop armament forging.', rarity: 'epic', useAmount: 50000, resourceType: 'iron' },
    { id: 'item_05', name: 'Commander XP potion', icon: '🧪', quantity: 24, type: 'resource', desc: 'Consumable potion. Grants 500 XP points to any selected commander.', rarity: 'rare', useAmount: 1, resourceType: 'xpPotions' },
    { id: 'item_06', name: '1-Hr Build Speedup', icon: '⚡', quantity: 15, type: 'speedup', desc: 'Speeds up any active building construct or upgrade queue by 60 minutes.', rarity: 'rare', useAmount: 60 },
    { id: 'item_07', name: '8-Hr Guard Shield', icon: '🛡️', quantity: 2, type: 'speedup', desc: 'Encases your entire Citadel in an absolute magical boundary. Immune to all scouts and attacks.', rarity: 'legendary', useAmount: 480 },
    { id: 'item_08', name: 'Sovereign Chest', icon: '🎁', quantity: 3, type: 'chest', desc: 'Contains a royal bounty. Guaranteed to yield crystals, gold, and XP potions.', rarity: 'epic', useAmount: 1 }
  ]);

  // Sub-states: Quest
  const [quests, setQuests] = useState([
    { id: 'q_01', title: 'Collect Grain yield', desc: 'Collect provisions from Windmill Farms.', progress: 1, target: 1, claimed: false, reward: { name: 'Food Bundle', qty: 50000, type: 'food', icon: '🌾' } },
    { id: 'q_02', title: 'Construct Legion Arms', desc: 'Train new infantry units at the Barracks.', progress: 3500, target: 5000, claimed: false, reward: { name: 'Refined Iron', qty: 25000, type: 'iron', icon: '🔩' } },
    { id: 'q_03', title: 'Lumber Mill Boost', desc: 'Consume speedup items on logging facilities.', progress: 0, target: 3, claimed: false, reward: { name: 'Timber Pile', qty: 40000, type: 'wood', icon: '🪵' } }
  ]);

  // Sub-states: Alliance
  const [allianceChat, setAllianceChat] = useState([
    { sender: 'Lady Seraphina', text: 'All legion members, construct more quarries! Stone is needed.', time: '10:14 AM' },
    { sender: 'Garrick Ironfist', text: 'Need help on active training queues. Hit help buttons!', time: '11:02 AM' },
    { sender: 'Vanguard Cadet', text: 'Rally starting on level 90 Dragon in 3 minutes! Dispatch paladins.', time: '11:15 AM' }
  ]);
  const [typedMessage, setTypedMessage] = useState<string>('');
  const [helpRequestList, setHelpRequestList] = useState([
    { id: 'h_req_01', sender: 'Garrick Ironfist', type: 'Citadel level 26 upgrade', progress: 12, target: 15 },
    { id: 'h_req_02', sender: 'Valeria Swift', type: 'Legion recruitment level 12', progress: 3, target: 8 }
  ]);

  // Sub-states: Mail
  const [mails, setMails] = useState([
    { id: 'm_01', sender: 'Citadel Treasury', subject: 'Crownspire Launch Bounty', body: 'Greetings Lord Sovereign! To celebrate the deployment of the Godot MMO Modules, the High Council sends this bounty.', claimed: false, reward: { name: 'Crystals Chest', qty: 2500, type: 'crystals', icon: '💎' }, date: 'July 20' },
    { id: 'm_02', sender: 'Battle Report Log', subject: 'VICTORY at Wildling Outpost', body: 'Your marching legion defeated Level 42 Wildlings. Scavenged local timber and gold reserves with minimal casualties.', claimed: true, date: 'July 19' }
  ]);

  // Sub-states: Settings
  const [promoCode, setPromoCode] = useState<string>('');
  const [redeemedCodes, setRedeemedCodes] = useState<string[]>([]);

  // Sub-states: Code view
  const [selectedCodeFile, setSelectedCodeFile] = useState<'BasePopup.gd' | 'BasePopup.tscn' | 'GameHUD.gd'>('BasePopup.gd');

  // Building levels state
  const [buildingLevels, setBuildingLevels] = useState({
    windmill: 12,
    sawmill: 11,
    ironMine: 8,
    arcaneSpire: 5,
    citadel: 25
  });

  // Selected Upgrade Building popup state
  const [selectedUpgradeBuilding, setSelectedUpgradeBuilding] = useState<{
    key: 'windmill' | 'sawmill' | 'ironMine' | 'arcaneSpire' | 'citadel';
    name: string;
    currentLevel: number;
    icon: string;
    cost: { food: number; wood: number; stone: number; iron: number };
    crystalCost: number;
  } | null>(null);

  // Active Building upgrade progress tracking
  const [activeUpgrade, setActiveUpgrade] = useState<{
    buildingKey: 'windmill' | 'sawmill' | 'ironMine' | 'arcaneSpire' | 'citadel';
    timer: number;
    total: number;
  } | null>(null);

  // Wildling state
  const [activeWildling, setActiveWildling] = useState<{
    level: number;
    species: string;
    power: number;
    staminaCost: number;
    weakness: string;
    rarity: string;
    description: string;
    rewards: string;
  } | null>(null);

  // Active Outlands Wildling March state
  const [activeMarch, setActiveMarch] = useState<{
    timer: number;
    total: number;
    targetName: string;
    targetIcon: string;
  } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Decr active march
      setActiveMarch(prev => {
        if (!prev) return null;
        if (prev.timer <= 1) {
          // March complete! Give rewards and show victory!
          setResources(r => ({
            ...r,
            gold: r.gold + 50000,
            food: r.food + 50000,
            wood: r.wood + 30000,
            stone: r.stone + 15000,
            iron: r.iron + 10000
          }));
          setXpPotions(xp => xp + 3);
          setInventoryItems(inv => inv.map(item => item.id === 'item_05' ? { ...item, quantity: item.quantity + 3 } : item));
          setPowerRating(p => p + 5000);
          triggerCelebration('Wolf Patrol Defeated', 1, '🐺', 'rare');
          triggerToast("VICTORY! Your forces vanquished the Lvl 15 Wolf Patrol! (+50K Gold, +50K Grain, +3 XP Potions)");
          return null;
        }
        return { ...prev, timer: prev.timer - 1 };
      });

      // 2. Decr active building upgrade
      setActiveUpgrade(prev => {
        if (!prev) return null;
        if (prev.timer <= 1) {
          // Upgrade complete!
          setBuildingLevels(levels => {
            const currentLvl = levels[prev.buildingKey];
            const nextLvl = currentLvl + 1;
            
            // If it was the windmill (farm), train troops progress or gather progress
            if (prev.buildingKey === 'windmill') {
              setQuests(qList => qList.map(q => q.id === 'q_01' ? { ...q, progress: Math.min(q.progress + 1, q.target) } : q));
            }
            return {
              ...levels,
              [prev.buildingKey]: nextLvl
            };
          });
          setPowerRating(p => p + 12000);
          
          let displayName = 'Structure';
          if (prev.buildingKey === 'windmill') displayName = 'Imperial Windmill';
          else if (prev.buildingKey === 'sawmill') displayName = 'Imperial Sawmill';
          else if (prev.buildingKey === 'ironMine') displayName = 'Sovereign Iron Mine';
          else if (prev.buildingKey === 'arcaneSpire') displayName = 'Arcane Spire';
          else if (prev.buildingKey === 'citadel') displayName = 'Citadel Tower';

          triggerCelebration(`${displayName} Upgraded`, 1, '🏗️', 'legendary');
          triggerToast(`CONSTRUCTION COMPLETE: ${displayName} has been upgraded successfully! (+12,000 Global Power)`);
          return null;
        }
        return { ...prev, timer: prev.timer - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleStartBuildingUpgrade = (buildingKey: 'windmill' | 'sawmill' | 'ironMine' | 'arcaneSpire' | 'citadel', cost: { food: number; wood: number; stone: number; iron: number }) => {
    // Check if player has enough resources
    if (resources.food < cost.food || resources.wood < cost.wood || resources.stone < cost.stone || resources.iron < cost.iron) {
      triggerToast("Insufficient resources to upgrade! Claim some tokens in your Bag or collect yield.");
      return;
    }

    // Deduct resources
    setResources(prev => ({
      ...prev,
      food: prev.food - cost.food,
      wood: prev.wood - cost.wood,
      stone: prev.stone - cost.stone,
      iron: prev.iron - cost.iron
    }));

    // Close upgrade window
    setSelectedUpgradeBuilding(null);

    // Set active upgrade (5 second construct time for snappy demo feedback!)
    setActiveUpgrade({
      buildingKey,
      timer: 5,
      total: 5
    });

    triggerToast(`Constructing upgrade... 5s remaining.`);
  };

  const handleInstantBuildingUpgrade = (buildingKey: 'windmill' | 'sawmill' | 'ironMine' | 'arcaneSpire' | 'citadel', crystalCost: number) => {
    if (resources.crystals < crystalCost) {
      triggerToast("Insufficient Royal Crystals! Add more via Control Deck.");
      return;
    }

    // Deduct crystals
    setResources(prev => ({
      ...prev,
      crystals: prev.crystals - crystalCost
    }));

    // Close upgrade window
    setSelectedUpgradeBuilding(null);

    // Upgrade immediately
    setBuildingLevels(levels => ({
      ...levels,
      [buildingKey]: levels[buildingKey] + 1
    }));
    setPowerRating(p => p + 15000);
    
    let displayName = 'Structure';
    if (buildingKey === 'windmill') displayName = 'Imperial Windmill';
    else if (buildingKey === 'sawmill') displayName = 'Imperial Sawmill';
    else if (buildingKey === 'ironMine') displayName = 'Sovereign Iron Mine';
    else if (buildingKey === 'arcaneSpire') displayName = 'Arcane Spire';
    else if (buildingKey === 'citadel') displayName = 'Citadel Tower';

    triggerCelebration(`${displayName} Instant Finished`, 1, '⚡', 'legendary');
    triggerToast(`CONSTRUCTION COMPLETE: ${displayName} has been upgraded instantly! (+15,000 Global Power)`);
  };

  const handleStartWildlingAttack = () => {
    if (!activeWildling) return;
    
    // Close wildling popup
    setActiveWildling(null);
    
    // Trigger active march (5 seconds for high-engagement snappy feedback!)
    setActiveMarch({
      timer: 5,
      total: 5,
      targetName: "Level 15 Wolf Patrol",
      targetIcon: "🐺"
    });
    
    triggerToast("DISPATCHED EXPEDITION: Legion marching towards target Wolf Patrol (Hex 260, 480)...");
  };

  // Trigger Toast notifications
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((curr) => curr === msg ? null : curr);
    }, 2500);
  };

  // Trigger celebration overlay
  const triggerCelebration = (name: string, quantity: number, icon: string, rarity: string) => {
    setRewardClaimOverlay({ name, quantity, icon, rarity });
  };

  // Float text spawner helper
  const spawnFloatText = (text: string, x: number = 100, y: number = 120) => {
    const id = Date.now() + Math.random();
    setFloatingTexts(prev => [...prev, { id, text, x, y }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 1100);
  };

  // Wallet Add Helpers with Animation Triggers
  const addResource = (type: keyof ResourceState, amount: number, label: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    // Spawn float text at click coordinates or default center
    const x = e ? e.clientX - e.currentTarget.getBoundingClientRect().left + 10 : 150;
    const y = e ? e.clientY - e.currentTarget.getBoundingClientRect().top - 20 : 120;
    
    setResources(prev => ({
      ...prev,
      [type]: prev[type] + amount
    }));
    setPowerRating(p => p + Math.floor(amount * 0.15));
    
    const formattedAmount = amount >= 1000000 ? `${(amount/1000000).toFixed(1)}M` : `${(amount/1000).toFixed(0)}K`;
    spawnFloatText(`+${formattedAmount} ${label}`, x, y);
    triggerToast(`Gained +${formattedAmount} ${label}! (+${Math.floor(amount * 0.15).toLocaleString()} Power)`);
  };

  // Collect from building in city view
  const collectBuildingYield = (type: keyof ResourceState, amount: number, label: string, e: React.MouseEvent) => {
    addResource(type, amount, label, e);
  };

  // Open popups with unified framework
  const openPopupWithFramework = (popupId: typeof activePopup) => {
    if (btnStateOverride === 'disabled') {
      triggerToast("All interactive shortcuts are disabled via Control Deck!");
      return;
    }
    setActivePopup(popupId);
    triggerToast(`Fired Crownspire BasePopup Animation: Opened ${popupId?.toUpperCase()} Panel`);
  };

  // Close popup
  const closeActivePopup = () => {
    setActivePopup(null);
    triggerToast("Fired BasePopup Animation: close_fade complete!");
  };

  // Redeem Promo Codes
  const handleRedeemPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) return;
    
    if (redeemedCodes.includes(code)) {
      triggerToast("This code has already been redeemed!");
      return;
    }

    if (code === 'CROWNSPIRE2026') {
      setResources(prev => ({ ...prev, crystals: prev.crystals + 5000, gold: prev.gold + 500000 }));
      setPowerRating(p => p + 150000);
      setVipLevel(prev => Math.min(prev + 1, 15));
      setRedeemedCodes(prev => [...prev, code]);
      setPromoCode('');
      
      triggerCelebration('Sovereign Launch Chest', 1, '🎁', 'legendary');
      triggerToast("PROMO UNLOCKED! VIP Rank +1, +5K Crystals, +500K Gold!");
    } else {
      triggerToast("Invalid promo code! Try CROWNSPIRE2026.");
    }
  };

  // Purchase packages in shop
  const handlePurchasePack = (packName: string, costCrystals: number, rewards: { type: keyof ResourceState | 'xpPotions'; qty: number; name: string; icon: string }[]) => {
    if (resources.crystals < costCrystals) {
      triggerToast("Insufficient Royal Crystals! Spawn some more in the Control Deck.");
      return;
    }

    // Deduct Crystals
    setResources(prev => ({ ...prev, crystals: prev.crystals - costCrystals }));
    
    // Apply Rewards
    rewards.forEach(r => {
      if (r.type === 'xpPotions') {
        setXpPotions(p => p + r.qty);
        // Also update bag items array to maintain sync
        setInventoryItems(prev => prev.map(item => item.id === 'item_05' ? { ...item, quantity: item.quantity + r.qty } : item));
      } else {
        setResources(prev => ({ ...prev, [r.type]: prev[r.type] + r.qty }));
      }
    });

    setPowerRating(p => p + costCrystals * 5);
    triggerCelebration(packName, 1, '📦', 'epic');
    triggerToast(`Purchase Successful! Spent ${costCrystals} Crystals.`);
  };

  // Level Up Hero
  const handleLevelUpHero = (heroId: string) => {
    if (xpPotions <= 0) {
      triggerToast("No Commander XP Potions remaining! Open Sovereign Chests or buy packs.");
      return;
    }

    setXpPotions(p => p - 1);
    setInventoryItems(prev => prev.map(item => item.id === 'item_05' ? { ...item, quantity: item.quantity - 1 } : item));

    setHeroes(prev => prev.map(hero => {
      if (hero.id === heroId) {
        if (hero.level >= hero.maxLevel) {
          triggerToast(`${hero.name} has hit max level limit! Ascend stars to unlock.`);
          return hero;
        }

        const newXp = hero.xp + 500;
        let newLevel = hero.level;
        let newXpReq = hero.xpRequired;
        let leveled = false;

        if (newXp >= hero.xpRequired) {
          newLevel += 1;
          newXpReq = Math.floor(hero.xpRequired * 1.2);
          leveled = true;
          setPowerRating(p => p + 3500);
          triggerToast(`${hero.name} Leveled Up to ${newLevel}! (+3,500 Global Power)`);
        } else {
          triggerToast(`Injected 500 XP into ${hero.name}.`);
        }

        return {
          ...hero,
          level: newLevel,
          xp: newXp >= hero.xpRequired ? newXp - hero.xpRequired : newXp,
          xpRequired: newXpReq,
          power: hero.power + (leveled ? 1800 : 200)
        };
      }
      return hero;
    }));
  };

  // Ascend Hero Stars
  const handleAscendHero = (heroId: string) => {
    setHeroes(prev => prev.map(hero => {
      if (hero.id === heroId) {
        if (hero.stars >= 6) {
          triggerToast(`${hero.name} is already at maximum 6-Star ascension!`);
          return hero;
        }

        if (hero.shards < hero.shardsRequired) {
          triggerToast(`Insufficient shards! Need ${hero.shardsRequired} (Has ${hero.shards}). Buy some from the Shop!`);
          return hero;
        }

        const newStars = hero.stars + 1;
        setPowerRating(p => p + 15000);
        triggerToast(`${hero.name} Ascended to ${newStars}-Star Commander! Max Level limit increased by +5!`);
        
        return {
          ...hero,
          stars: newStars,
          shards: hero.shards - hero.shardsRequired,
          shardsRequired: Math.floor(hero.shardsRequired * 1.5),
          maxLevel: hero.maxLevel + 5,
          power: hero.power + 8500
        };
      }
      return hero;
    }));
  };

  // Consume items in Inventory Bag
  const handleUseBagItem = (itemId: string) => {
    const item = inventoryItems.find(i => i.id === itemId);
    if (!item || item.quantity <= 0) return;

    // Use effects
    if (item.type === 'resource' && item.resourceType) {
      if (item.resourceType === 'xpPotions') {
        setXpPotions(p => p + 1);
        triggerToast("Transferred 1x XP Potion to commander training inventory!");
      } else {
        const rType = item.resourceType as keyof ResourceState;
        setResources(prev => ({ ...prev, [rType]: prev[rType] + item.useAmount }));
        setPowerRating(p => p + Math.floor(item.useAmount * 0.1));
        triggerToast(`Used token: Gained +${item.useAmount.toLocaleString()} ${item.resourceType.toUpperCase()}!`);
      }
    } else if (item.type === 'chest') {
      // Sovereign Chest open bounty
      setResources(prev => ({
        ...prev,
        crystals: prev.crystals + 350,
        gold: prev.gold + 25000,
        food: prev.food + 50000
      }));
      setPowerRating(p => p + 2500);
      setXpPotions(p => p + 3);
      setInventoryItems(prevItems => prevItems.map(invItem => invItem.id === 'item_05' ? { ...invItem, quantity: invItem.quantity + 3 } : invItem));
      triggerCelebration('Sovereign Chest Bounty', 1, '🎁', 'epic');
      triggerToast("Opened Sovereign Chest! Gained +350 Crystals, +25K Gold, +50K Grain, +3x XP Potions!");
    } else if (item.type === 'speedup') {
      triggerToast(`Activated speedup: ${item.name}! Time queue reduced instantly.`);
    }

    // Deduct quantity
    setInventoryItems(prev => prev.map(i => {
      if (i.id === itemId) {
        return { ...i, quantity: i.quantity - 1 };
      }
      return i;
    }).filter(i => i.quantity > 0));

    setSelectedBagItem(null);
  };

  // Claim Quest Reward
  const handleClaimQuest = (questId: string) => {
    setQuests(prev => prev.map(q => {
      if (q.id === questId) {
        if (q.progress < q.target || q.claimed) return q;

        // Pay out rewards
        const r = q.reward;
        if (r.type === 'food') setResources(p => ({ ...prevResources => ({ ...prevResources, food: prevResources.food + r.qty }) } as any));
        else if (r.type === 'wood') setResources(p => ({ ...prevResources => ({ ...prevResources, wood: prevResources.wood + r.qty }) } as any));
        else if (r.type === 'iron') setResources(p => ({ ...prevResources => ({ ...prevResources, iron: prevResources.iron + r.qty }) } as any));

        setPowerRating(p => p + 5000);
        triggerCelebration(r.name, r.qty, r.icon, 'rare');
        triggerToast(`Quest Complete! Claimed ${r.name}. (+5,000 Kingdom Power)`);
        return { ...q, claimed: true };
      }
      return q;
    }));
  };

  // Claim Mail Rewards
  const handleClaimMail = (mailId: string) => {
    setMails(prev => prev.map(m => {
      if (m.id === mailId) {
        if (m.claimed || !m.reward) return m;

        const r = m.reward;
        if (r.type === 'crystals') setResources(prevRes => ({ ...prevRes, crystals: prevRes.crystals + r.qty }));
        setPowerRating(p => p + 10000);
        triggerCelebration(r.name, r.qty, r.icon, 'epic');
        triggerToast(`Claimed Attachments: Gained +${r.qty} Crystals!`);
        return { ...m, claimed: true };
      }
      return m;
    }));
  };

  // Send Alliance Chat Message
  const handleSendAllianceChat = () => {
    if (!typedMessage.trim()) return;
    setAllianceChat(prev => [...prev, {
      sender: lordName,
      text: typedMessage,
      time: '11:21 AM'
    }]);
    setTypedMessage('');
    triggerToast("Dispatched text frame to Alliance Chat Server!");
  };

  // Help Alliance Members
  const handleHelpAllianceMember = (reqId: string) => {
    setHelpRequestList(prev => prev.map(req => {
      if (req.id === reqId) {
        const nextProgress = Math.min(req.progress + 1, req.target);
        if (nextProgress >= req.target) {
          triggerToast(`Alliance queue complete! Speeds up ${req.sender}'s project.`);
        } else {
          triggerToast(`Assisted ${req.sender}. Sent -10% build reduction time!`);
        }
        return { ...req, progress: nextProgress };
      }
      return req;
    }).filter(req => req.progress < req.target));
    
    // Earn alliance honor currency as reward
    triggerToast("Earned +500 Alliance Honor points for assisting!");
  };

  // Help All
  const handleHelpAll = () => {
    if (helpRequestList.length === 0) {
      triggerToast("No active help requests on board.");
      return;
    }
    setHelpRequestList([]);
    triggerToast(`Assisted all alliance members! Dispatched speed assistance frames, earned +1,500 Honor!`);
  };

  // Resource display strings
  const formatNum = (val: number) => {
    if (val >= 1000000) return `${(val/1000000).toFixed(2)}M`;
    if (val >= 1000) return `${(val/1000).toFixed(0)}K`;
    return val.toString();
  };

  // Active Hero Helper
  const activeHero = heroes.find(h => h.id === selectedHeroId) || heroes[0];

  return (
    <div className="flex flex-col gap-6" id="crownspire_hud_tab">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" /> Crownspire Sovereign HUD &amp; Popup Studio
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Explore and interact with the complete production HUD, fully implemented in a dual-column design. Experience active resource incrementation, click-harvest indicators, and click to inspect the real **Crownspire White Marble, Royal Gold, &amp; Sapphire Blue Popup Framework**.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Device viewport containing HUD & active simulator */}
        <div className="xl:col-span-5 flex flex-col items-center gap-4">
          <div className="flex items-center justify-between w-full max-w-[340px]">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-semibold">Active Godot Canvas Simulator</span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Rendering
            </span>
          </div>
          
          {/* Mobile Screen Simulator */}
          <div className="w-[340px] h-[600px] rounded-[38px] bg-[#05070e] border-[8px] border-slate-800 shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col justify-between select-none ring-1 ring-slate-700/50">
            
            {/* -------------------- 1. TOP HUD CONTAINER -------------------- */}
            <div className="absolute top-0 left-0 w-full z-40 bg-gradient-to-b from-[#0e1220] via-[#090b14]/95 to-transparent pt-3 px-2.5 pb-2">
              
              {/* Upper Section: Profile, Power, Crystals */}
              <div className="flex items-center justify-between gap-1 w-full">
                
                {/* Profile Card */}
                <div 
                  onClick={() => openPopupWithFramework('settings')}
                  className="flex items-center gap-1.5 bg-[#090e1a]/80 hover:bg-[#141b30] border border-[#d97706]/30 hover:border-[#f59e0b] rounded px-1.5 py-0.5 cursor-pointer transition-all active:scale-95 shrink-0"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-md bg-[#1d1430] border border-[#f59e0b]/50 flex items-center justify-center text-sm">
                      🧝‍♀️
                    </div>
                    <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-yellow-500 to-amber-600 text-slate-950 text-[7px] font-black px-1 rounded-sm border border-yellow-200 font-mono scale-90">
                      VIP{vipLevel}
                    </span>
                  </div>
                  <div className="flex flex-col ml-0.5">
                    <span className="text-[9px] font-bold text-slate-100 tracking-wide truncate max-w-[45px]">{lordName}</span>
                    <span className="text-[7px] text-[#f59e0b] font-mono leading-none">Kingdom #1</span>
                  </div>
                </div>

                {/* Power Rating Badge */}
                <div className="flex items-center gap-1 bg-gradient-to-r from-[#1e152d] to-[#120e20] border border-[#a855f7]/40 rounded-full px-2 py-0.5 shadow-inner shrink-0">
                  <span className="text-[10px] animate-pulse">⚔️</span>
                  <div className="flex flex-col">
                    <span className="text-[6.5px] text-[#d8b4fe] font-bold leading-none uppercase">Power</span>
                    <span className="text-[9px] text-white font-mono font-bold leading-none mt-0.5">{powerRating.toLocaleString()}</span>
                  </div>
                </div>

                {/* Crystal Vault Wallet */}
                <div className="flex items-center justify-between bg-[#0b1c30]/90 border border-[#06b6d4]/40 rounded px-1.5 py-0.5 min-w-[70px] shrink-0">
                  <div className="flex items-center gap-0.5">
                    <span className="text-[10px]">💎</span>
                    <span className="text-[9px] font-mono font-bold text-cyan-400">{formatNum(resources.crystals)}</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setResources(p => ({ ...p, crystals: p.crystals + 1000 })); setPowerRating(p => p + 3000); spawnFloatText("+1.0K Crystals", 250, 40); triggerToast("Spawned Crystals!"); }}
                    className="w-3 h-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[8px] font-extrabold flex items-center justify-center rounded border border-cyan-300 ml-1.5 active:scale-90 transition-transform"
                  >
                    +
                  </button>
                </div>

              </div>

              {/* Lower Section: 5 Economy Capsules, Mail, Settings */}
              <div className="grid grid-cols-12 gap-1 mt-1.5 items-center w-full">
                
                {/* 1. Grain */}
                <div className="col-span-2.5 flex items-center justify-between bg-[#111625]/90 border border-slate-700/50 rounded-md p-0.5 relative">
                  <div className="flex flex-col pl-0.5">
                    <span className="text-[6px] text-slate-400 font-bold leading-none">GRAIN</span>
                    <span className="text-[8.5px] font-mono font-bold text-emerald-400 leading-none mt-0.5">🌾{formatNum(resources.food)}</span>
                  </div>
                  <button 
                    onClick={(e) => addResource('food', 50000, 'Grain', e)}
                    className="w-3.5 h-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[9px] font-bold flex items-center justify-center rounded border border-emerald-300 active:scale-90 scale-90"
                  >
                    +
                  </button>
                </div>

                {/* 2. Wood */}
                <div className="col-span-2.5 flex items-center justify-between bg-[#111625]/90 border border-slate-700/50 rounded-md p-0.5 relative">
                  <div className="flex flex-col pl-0.5">
                    <span className="text-[6px] text-slate-400 font-bold leading-none">WOOD</span>
                    <span className="text-[8.5px] font-mono font-bold text-amber-500 leading-none mt-0.5">🪵{formatNum(resources.wood)}</span>
                  </div>
                  <button 
                    onClick={(e) => addResource('wood', 40000, 'Timber', e)}
                    className="w-3.5 h-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[9px] font-bold flex items-center justify-center rounded border border-amber-300 active:scale-90 scale-90"
                  >
                    +
                  </button>
                </div>

                {/* 3. Stone */}
                <div className="col-span-2.5 flex items-center justify-between bg-[#111625]/90 border border-slate-700/50 rounded-md p-0.5 relative">
                  <div className="flex flex-col pl-0.5">
                    <span className="text-[6px] text-slate-400 font-bold leading-none">STONE</span>
                    <span className="text-[8.5px] font-mono font-bold text-slate-300 leading-none mt-0.5">🪨{formatNum(resources.stone)}</span>
                  </div>
                  <button 
                    onClick={(e) => addResource('stone', 25000, 'Granite', e)}
                    className="w-3.5 h-3.5 bg-slate-500 hover:bg-slate-400 text-slate-950 text-[9px] font-bold flex items-center justify-center rounded border border-slate-300 active:scale-90 scale-90"
                  >
                    +
                  </button>
                </div>

                {/* 4. Iron */}
                <div className="col-span-2.5 flex items-center justify-between bg-[#111625]/90 border border-slate-700/50 rounded-md p-0.5 relative">
                  <div className="flex flex-col pl-0.5">
                    <span className="text-[6px] text-slate-400 font-bold leading-none">IRON</span>
                    <span className="text-[8.5px] font-mono font-bold text-blue-400 leading-none mt-0.5">🔩{formatNum(resources.iron)}</span>
                  </div>
                  <button 
                    onClick={(e) => addResource('iron', 15000, 'Iron Ore', e)}
                    className="w-3.5 h-3.5 bg-blue-500 hover:bg-blue-400 text-slate-950 text-[9px] font-bold flex items-center justify-center rounded border border-blue-300 active:scale-90 scale-90"
                  >
                    +
                  </button>
                </div>

                {/* 5. Gold */}
                <div className="col-span-2 flex items-center justify-between bg-[#111625]/90 border border-slate-700/50 rounded-md p-0.5 relative">
                  <div className="flex flex-col pl-0.5">
                    <span className="text-[6px] text-slate-400 font-bold leading-none">GOLD</span>
                    <span className="text-[8.5px] font-mono font-bold text-yellow-400 leading-none mt-0.5">🪙{formatNum(resources.gold)}</span>
                  </div>
                  <button 
                    onClick={(e) => addResource('gold', 10000, 'Gold Coins', e)}
                    className="w-3.5 h-3.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-[9px] font-bold flex items-center justify-center rounded border border-yellow-300 active:scale-90 scale-90"
                  >
                    +
                  </button>
                </div>

              </div>

              {/* Auxiliary Quick Links: Mail & Settings with badges */}
              <div className="flex items-center justify-end gap-2 mt-1.5 pr-1">
                {/* Mail shortcut */}
                <button 
                  onClick={() => openPopupWithFramework('mail')}
                  className="relative p-1 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/40 rounded-full text-slate-300 hover:text-white transition-all"
                  title="Mail Inbox"
                >
                  <Mail className="w-3.5 h-3.5" />
                  {mails.filter(m => !m.claimed).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[7px] font-extrabold w-3 h-3 rounded-full flex items-center justify-center border border-slate-950 animate-pulse">
                      {mails.filter(m => !m.claimed).length}
                    </span>
                  )}
                </button>
                {/* Settings shortcut */}
                <button 
                  onClick={() => openPopupWithFramework('settings')}
                  className="p-1 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/40 rounded-full text-slate-300 hover:text-white transition-all"
                  title="Settings & Redemption"
                >
                  <Settings className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

            {/* -------------------- 2. MIDDLE VIEWPORT ENGINE -------------------- */}
            <div className="flex-1 w-full relative pt-[115px] pb-[85px] overflow-hidden flex flex-col justify-between">
              
              {/* Floating Yield Indicator text frames */}
              {floatingTexts.map(t => (
                <div 
                  key={t.id}
                  className="absolute z-50 bg-gradient-to-r from-yellow-400 to-amber-500 text-slate-950 font-black font-mono text-[9px] px-1.5 py-0.5 rounded-full border border-yellow-200 shadow-md animate-float-up pointer-events-none"
                  style={{ top: t.y, left: t.x }}
                >
                  {t.text}
                </div>
              ))}

              {isCityView ? (
                /* CITADEL REALM CITY VIEW */
                <div className="absolute inset-0 bg-[#0f1d13] flex flex-col justify-between p-3 pt-[120px] pb-[90px] z-10 overflow-hidden">
                  
                  {/* Grass layout grid textures */}
                  <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#a3e635 15%, transparent 16%), radial-gradient(#a3e635 15%, transparent 16%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 10px 10px' }}></div>
                  
                  {/* Building 1: Grain Windmill */}
                  <div 
                    className="absolute w-[85px] h-[75px] bg-[#0c1610]/95 border border-emerald-500/30 rounded-lg flex flex-col items-center justify-between p-1.5 shadow-lg group hover:border-emerald-400 transition-all"
                    style={{ top: '130px', left: '125px' }}
                  >
                    <div className="flex items-center justify-between w-full relative">
                      <span className="bg-emerald-600 border border-emerald-300 text-white text-[6px] font-mono px-1 rounded">Lvl {buildingLevels.windmill}</span>
                      <span className="text-sm animate-spin" style={{ animationDuration: '10s' }}>🌾</span>
                    </div>
                    <span className="text-[7.5px] font-bold text-emerald-400">Windmill</span>
                    
                    {activeUpgrade?.buildingKey === 'windmill' ? (
                      <div className="w-full mt-0.5">
                        <div className="flex justify-between items-center text-[5.5px] text-yellow-400 font-mono leading-none">
                          <span>UPGRADING...</span>
                          <span>{activeUpgrade.timer}s</span>
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                          <div 
                            className="h-full bg-yellow-500 transition-all duration-1000"
                            style={{ width: `${((activeUpgrade.total - activeUpgrade.timer) / activeUpgrade.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 w-full mt-1">
                        <button 
                          onClick={(e) => collectBuildingYield('food', 12000, 'Grain Yield', e)}
                          className="flex-1 bg-emerald-700 hover:bg-emerald-600 text-white text-[6.5px] py-0.5 rounded font-bold shadow-sm transition-all"
                        >
                          Harvest
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUpgradeBuilding({
                              key: 'windmill',
                              name: 'Imperial Windmill',
                              currentLevel: buildingLevels.windmill,
                              icon: '🌾',
                              cost: { food: 40000, wood: 35000, stone: 15000, iron: 5000 },
                              crystalCost: 150
                            });
                          }}
                          className="p-0.5 bg-slate-800 hover:bg-slate-700 text-yellow-400 border border-yellow-600/30 rounded text-[6.5px]"
                          title="Upgrade Windmill"
                        >
                          🔧
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Building 2: Sawmill */}
                  <div 
                    className="absolute w-[85px] h-[75px] bg-[#0c1610]/95 border border-amber-500/30 rounded-lg flex flex-col items-center justify-between p-1.5 shadow-lg group hover:border-amber-400 transition-all"
                    style={{ top: '190px', left: '20px' }}
                  >
                    <div className="flex items-center justify-between w-full relative">
                      <span className="bg-amber-600 border border-amber-300 text-white text-[6px] font-mono px-1 rounded">Lvl {buildingLevels.sawmill}</span>
                      <span className="text-sm group-hover:scale-110 transition-transform">🪵</span>
                    </div>
                    <span className="text-[7.5px] font-bold text-amber-400">Sawmill</span>
                    
                    {activeUpgrade?.buildingKey === 'sawmill' ? (
                      <div className="w-full mt-0.5">
                        <div className="flex justify-between items-center text-[5.5px] text-yellow-400 font-mono leading-none">
                          <span>UPGRADING...</span>
                          <span>{activeUpgrade.timer}s</span>
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                          <div 
                            className="h-full bg-yellow-500 transition-all duration-1000"
                            style={{ width: `${((activeUpgrade.total - activeUpgrade.timer) / activeUpgrade.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 w-full mt-1">
                        <button 
                          onClick={(e) => collectBuildingYield('wood', 10000, 'Lumber Yield', e)}
                          className="flex-1 bg-amber-700 hover:bg-amber-600 text-white text-[6.5px] py-0.5 rounded font-bold shadow-sm transition-all"
                        >
                          Lumber
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUpgradeBuilding({
                              key: 'sawmill',
                              name: 'Imperial Sawmill',
                              currentLevel: buildingLevels.sawmill,
                              icon: '🪵',
                              cost: { food: 35000, wood: 40000, stone: 20000, iron: 8000 },
                              crystalCost: 150
                            });
                          }}
                          className="p-0.5 bg-slate-800 hover:bg-slate-700 text-yellow-400 border border-yellow-600/30 rounded text-[6.5px]"
                          title="Upgrade Sawmill"
                        >
                          🔧
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Building 3: Iron Foundry */}
                  <div 
                    className="absolute w-[85px] h-[75px] bg-[#0c1610]/95 border border-blue-500/30 rounded-lg flex flex-col items-center justify-between p-1.5 shadow-lg group hover:border-blue-400 transition-all"
                    style={{ top: '210px', left: '230px' }}
                  >
                    <div className="flex items-center justify-between w-full relative">
                      <span className="bg-blue-600 border border-blue-300 text-white text-[6px] font-mono px-1 rounded">Lvl {buildingLevels.ironMine}</span>
                      <span className="text-sm group-hover:scale-110 transition-transform">🔩</span>
                    </div>
                    <span className="text-[7.5px] font-bold text-blue-400">Iron Mine</span>
                    
                    {activeUpgrade?.buildingKey === 'ironMine' ? (
                      <div className="w-full mt-0.5">
                        <div className="flex justify-between items-center text-[5.5px] text-yellow-400 font-mono leading-none">
                          <span>UPGRADING...</span>
                          <span>{activeUpgrade.timer}s</span>
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                          <div 
                            className="h-full bg-yellow-500 transition-all duration-1000"
                            style={{ width: `${((activeUpgrade.total - activeUpgrade.timer) / activeUpgrade.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 w-full mt-1">
                        <button 
                          onClick={(e) => collectBuildingYield('iron', 6000, 'Refined Iron', e)}
                          className="flex-1 bg-blue-700 hover:bg-blue-600 text-white text-[6.5px] py-0.5 rounded font-bold shadow-sm transition-all"
                        >
                          Mine Iron
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUpgradeBuilding({
                              key: 'ironMine',
                              name: 'Sovereign Iron Mine',
                              currentLevel: buildingLevels.ironMine,
                              icon: '🔩',
                              cost: { food: 45000, wood: 45000, stone: 30000, iron: 15000 },
                              crystalCost: 200
                            });
                          }}
                          className="p-0.5 bg-slate-800 hover:bg-slate-700 text-yellow-400 border border-yellow-600/30 rounded text-[6.5px]"
                          title="Upgrade Iron Mine"
                        >
                          🔧
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Building 4: Royal Spire */}
                  <div 
                    className="absolute w-[85px] h-[75px] bg-[#140b2a]/95 border border-purple-500/30 rounded-lg flex flex-col items-center justify-between p-1.5 shadow-lg group hover:border-purple-400 transition-all"
                    style={{ top: '280px', left: '25px' }}
                  >
                    <div className="flex items-center justify-between w-full relative">
                      <span className="bg-purple-600 border border-purple-300 text-white text-[6px] font-mono px-1 rounded">Lvl {buildingLevels.arcaneSpire}</span>
                      <span className="text-sm">🔮</span>
                    </div>
                    <span className="text-[7.5px] font-bold text-purple-400">Arcane Spire</span>
                    
                    {activeUpgrade?.buildingKey === 'arcaneSpire' ? (
                      <div className="w-full mt-0.5">
                        <div className="flex justify-between items-center text-[5.5px] text-yellow-400 font-mono leading-none">
                          <span>UPGRADING...</span>
                          <span>{activeUpgrade.timer}s</span>
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                          <div 
                            className="h-full bg-yellow-500 transition-all duration-1000"
                            style={{ width: `${((activeUpgrade.total - activeUpgrade.timer) / activeUpgrade.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 w-full mt-1">
                        <button 
                          onClick={() => { setResources(p => ({ ...p, crystals: p.crystals + 150 })); setPowerRating(p => p + 500); spawnFloatText("+150 Crystals", 160, 275); triggerToast("Royal Spire yielded +150 Crystals!"); }}
                          className="flex-1 bg-purple-700 hover:bg-purple-600 text-white text-[6.5px] py-0.5 rounded font-bold shadow-sm transition-all"
                        >
                          Harvest
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUpgradeBuilding({
                              key: 'arcaneSpire',
                              name: 'Arcane Spire',
                              currentLevel: buildingLevels.arcaneSpire,
                              icon: '🔮',
                              cost: { food: 60000, wood: 60000, stone: 40000, iron: 25000 },
                              crystalCost: 250
                            });
                          }}
                          className="p-0.5 bg-slate-800 hover:bg-slate-700 text-yellow-400 border border-yellow-600/30 rounded text-[6.5px]"
                          title="Upgrade Spire"
                        >
                          🔧
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Building 5: Main Citadel Center */}
                  <div 
                    className="absolute w-[125px] h-[85px] bg-[#1b0d35]/95 border border-[#fbbf24] rounded-xl flex flex-col items-center justify-between p-2 shadow-[0_8px_20px_rgba(245,158,11,0.25)] hover:border-yellow-300 transition-all hover:shadow-[0_8px_24px_rgba(245,158,11,0.4)]"
                    style={{ top: '350px', left: '100px' }}
                  >
                    <div className="flex items-center justify-between w-full relative">
                      <span className="bg-yellow-500 border border-yellow-200 text-slate-950 text-[7px] font-black px-1.5 rounded shadow">Lvl {buildingLevels.citadel}</span>
                      <span className="text-xl block animate-bounce" style={{ animationDuration: '4s' }}>🏰</span>
                    </div>
                    <span className="text-[9px] font-bold text-yellow-300 tracking-wide">Citadel Tower</span>
                    
                    {activeUpgrade?.buildingKey === 'citadel' ? (
                      <div className="w-full mt-0.5">
                        <div className="flex justify-between items-center text-[5.5px] text-yellow-400 font-mono leading-none">
                          <span>CONSTRUCTING...</span>
                          <span>{activeUpgrade.timer}s</span>
                        </div>
                        <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mt-0.5">
                          <div 
                            className="h-full bg-yellow-500 transition-all duration-1000"
                            style={{ width: `${((activeUpgrade.total - activeUpgrade.timer) / activeUpgrade.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 w-full mt-1">
                        <button 
                          onClick={() => triggerToast("Welcome Sovereign! The High Council chamber is at maximum operational security.")}
                          className="flex-1 bg-amber-600 hover:bg-amber-500 text-slate-950 text-[7px] py-0.5 rounded font-black shadow-sm transition-all"
                        >
                          Inspect Council
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUpgradeBuilding({
                              key: 'citadel',
                              name: 'Citadel Tower',
                              currentLevel: buildingLevels.citadel,
                              icon: '🏰',
                              cost: { food: 150000, wood: 150000, stone: 100000, iron: 50000 },
                              crystalCost: 500
                            });
                          }}
                          className="p-1 bg-slate-800 hover:bg-slate-700 text-yellow-400 border border-yellow-500 rounded text-[7px]"
                          title="Upgrade Citadel"
                        >
                          🔧
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                /* OUTLANDS WILDERNESS HEX VIEW */
                <div className="absolute inset-0 bg-[#060911] flex flex-col justify-between p-3 pt-[120px] pb-[90px] z-10 overflow-hidden">
                  
                  {/* Hex outline styles */}
                  <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #38bdf8 8%, transparent 9%), radial-gradient(circle, #38bdf8 8%, transparent 9%)', backgroundSize: '30px 30px', backgroundPosition: '0 0, 15px 15px' }}></div>

                  {/* Citadel Hex hub */}
                  <div className="absolute w-[100px] h-[70px] bg-[#0c1122]/95 border-2 border-slate-600 rounded-lg flex flex-col items-center justify-center p-1 cursor-pointer hover:border-yellow-400 transition-all shadow-md" style={{ top: '230px', left: '110px' }}>
                    <span className="text-2xl">🏰</span>
                    <span className="text-[7px] text-slate-300 font-bold tracking-wider leading-none mt-1">YOUR CITY</span>
                    <span className="text-[6px] text-slate-500 font-mono leading-none mt-0.5">[Hex 240, 510]</span>
                  </div>

                  {/* Fire Dragon Elite boss */}
                  <div 
                    onClick={() => triggerToast("Wilderness Dragon Boss lvl 90. High rewards available for coordinated rally attacks!")}
                    className="absolute w-[75px] h-[60px] bg-red-950/80 border border-red-500/30 rounded-lg flex flex-col items-center justify-center p-1 cursor-pointer hover:border-red-400 transition-colors"
                    style={{ top: '135px', left: '200px' }}
                  >
                    <span className="text-xl block animate-pulse">🐉</span>
                    <span className="text-[7.5px] text-red-400 font-bold leading-none mt-0.5">Fire Dragon</span>
                    <span className="text-[6px] text-slate-400 font-mono leading-none">Lvl 90 Boss</span>
                  </div>

                  {/* Wood Resource Node */}
                  <div 
                    onClick={() => { setResources(prev => ({ ...prev, wood: prev.wood + 15000 })); setPowerRating(p => p + 300); spawnFloatText("+15K Wood", 50, 310); triggerToast("Legions harvested 15,000 Wood from Wilderness Node!"); }}
                    className="absolute w-[70px] h-[55px] bg-[#11241a]/90 border border-emerald-500/30 rounded-lg flex flex-col items-center justify-center p-1 cursor-pointer hover:border-emerald-400 transition-colors"
                    style={{ top: '300px', left: '15px' }}
                  >
                    <span className="text-lg">🌲</span>
                    <span className="text-[7px] text-emerald-400 font-bold mt-0.5">Forest [Lvl 5]</span>
                  </div>

                  {/* Wolf Patrol Wildling Node */}
                  <div 
                    onClick={() => setActiveWildling({
                      level: 15,
                      species: "Wolf Patrol",
                      power: 4500,
                      staminaCost: 10,
                      weakness: "Cavalry Troops (Lady Seraphina's specialty!)",
                      rarity: "Elite",
                      description: "Fierce predator wolves patrolling the Citadel outskirts. Defeat them to secure local trading trails.",
                      rewards: "Grain +50K, Gold +50K, Wood +30K, Stone +15K, Iron +10K, +3 XP Potions, +5,000 Global Power"
                    })}
                    className="absolute w-[75px] h-[60px] bg-[#221c11]/90 border border-amber-500/30 rounded-lg flex flex-col items-center justify-center p-1 cursor-pointer hover:border-amber-400 transition-all active:scale-95 group"
                    style={{ top: '150px', left: '30px' }}
                  >
                    <div className="relative">
                      <span className="text-xl block animate-bounce" style={{ animationDuration: '3s' }}>🐺</span>
                      <div className="absolute -top-3 -right-2 bg-red-600 text-white font-black text-[6px] px-1 rounded border border-red-300">
                        Lv.15
                      </div>
                    </div>
                    <span className="text-[7.5px] font-bold text-amber-400 mt-0.5">Wolf Patrol</span>
                    <span className="text-[6px] text-slate-400 font-mono leading-none">[Hex 260, 480]</span>
                  </div>

                  {/* Active March indicators */}
                  <div className="absolute top-[205px] left-[150px] w-14 h-6 border-b border-dashed border-sky-400 rotate-[35deg] animate-pulse pointer-events-none">
                    <span className="absolute right-0 top-1 text-[7px] text-sky-400">▶</span>
                  </div>
                  
                  {activeMarch && (
                    <>
                      {/* Dashed line to Wildling node */}
                      <div className="absolute top-[180px] left-[65px] w-14 h-6 border-b border-dashed border-red-500 rotate-[-30deg] animate-pulse pointer-events-none">
                        <span className="absolute left-0 bottom-0 text-[7px] text-red-500">◀</span>
                      </div>
                      
                      {/* Top floating countdown for the attack */}
                      <div className="absolute top-[105px] left-1/2 -translate-x-1/2 bg-slate-950/95 border border-red-500/60 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-lg max-w-[280px] z-30">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping shrink-0" />
                        <span className="text-[6px] text-slate-100 font-mono whitespace-nowrap">
                          ATTACK EXPEDITION DEPLOYED: {activeMarch.timer}s remaining
                        </span>
                      </div>
                    </>
                  )}

                  <div className="absolute left-1/2 -translate-x-1/2 bottom-[100px] bg-slate-950/90 border border-sky-500/40 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg max-w-[280px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping shrink-0" />
                    <span className="text-[6.5px] text-slate-200 font-mono whitespace-nowrap">Gathering expedition: 40K Infantry returning in 00:45</span>
                  </div>

                </div>
              )}

              {/* Float-over Quests Tracker HUD Overlay */}
              <div className="absolute left-2.5 bottom-[95px] z-20 bg-[#080d1a]/95 border border-slate-700/60 p-2 rounded-lg max-w-[125px] shadow-2xl">
                <span className="text-[6px] text-[#fbbf24] uppercase tracking-widest font-bold block leading-none">Royal Mandate</span>
                <h5 className="text-[8px] text-white font-bold leading-tight mt-1">🌾 Harvest Grain yield</h5>
                <p className="text-[6.5px] text-slate-400 leading-none mt-0.5">Provisions: 100%</p>
                
                {quests[0].claimed ? (
                  <span className="text-[6.5px] text-slate-500 font-mono block mt-1">Claimed ✓</span>
                ) : (
                  <button 
                    onClick={() => handleClaimQuest('q_01')}
                    className="w-full mt-1.5 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-[7px] font-black rounded active:scale-95"
                  >
                    Claim +50K Wheat
                  </button>
                )}
              </div>

              {/* Right Float-over Speedup boosts */}
              <div className="absolute right-2.5 bottom-[95px] z-20 flex flex-col gap-1">
                <button 
                  onClick={() => openPopupWithFramework('shop')}
                  className="w-6 h-6 rounded-full bg-slate-950/90 hover:bg-[#1a0e30] border border-yellow-500/40 hover:border-yellow-400 flex items-center justify-center text-xs shadow-lg active:scale-90 transition-all"
                  title="Sovereign Shop"
                >
                  🛒
                </button>
                <button 
                  onClick={() => openPopupWithFramework('bag')}
                  className="w-6 h-6 rounded-full bg-slate-950/90 hover:bg-[#1a0e30] border border-amber-500/40 hover:border-amber-400 flex items-center justify-center text-xs shadow-lg active:scale-90 transition-all"
                  title="Citadel Bag Inventory"
                >
                  🎒
                </button>
              </div>

            </div>

            {/* -------------------- 3. BOTTOM NAVIGATION DECK -------------------- */}
            <div className="absolute bottom-0 left-0 w-full z-40 bg-[#0a0d17]/95 border-t border-slate-800/80 pt-1 pb-2 px-1 flex flex-col justify-end">
              <div className="grid grid-cols-6 items-center justify-items-center h-[52px] relative w-full">
                
                {/* Tab 1: HEROES */}
                <button 
                  onClick={() => openPopupWithFramework('heroes')}
                  className={`flex flex-col items-center justify-center w-full h-full relative group transition-transform active:scale-95 ${
                    activePopup === 'heroes' ? 'scale-105' : ''
                  }`}
                >
                  <span className={`text-lg transition-transform ${activePopup === 'heroes' ? 'scale-115 filter drop-shadow-[0_0_3px_#c084fc]' : ''}`}>🧙‍♂️</span>
                  <span className={`text-[7px] uppercase tracking-wide mt-1 font-bold ${
                    activePopup === 'heroes' ? 'text-purple-300 font-extrabold' : 'text-slate-400'
                  }`}>
                    Heroes
                  </span>
                  <div className="absolute right-0 top-[20%] h-[60%] w-[1px] bg-gradient-to-b from-transparent via-[#2b254a] to-transparent flex items-center justify-center">
                    <div className="w-[3px] h-[3px] rotate-45 bg-[#7c5dfa]/50" />
                  </div>
                </button>

                {/* Tab 2: WAYFINDER (Simulate Outlands search) */}
                <button 
                  onClick={() => { triggerToast("Wayfinder radar search: Scanning adjacent sectors for wildling hubs..."); }}
                  className="flex flex-col items-center justify-center w-full h-full relative group transition-transform active:scale-95"
                >
                  <span className="text-lg">🧭</span>
                  <span className="text-[7px] uppercase tracking-wide mt-1 font-bold text-slate-400">
                    Wayfinder
                  </span>
                  <div className="absolute right-0 top-[20%] h-[60%] w-[1px] bg-gradient-to-b from-transparent via-[#2b254a] to-transparent flex items-center justify-center">
                    <div className="w-[3px] h-[3px] rotate-45 bg-[#7c5dfa]/50" />
                  </div>
                </button>

                {/* Tab 3: BAG */}
                <button 
                  onClick={() => openPopupWithFramework('bag')}
                  className={`flex flex-col items-center justify-center w-full h-full relative group transition-transform active:scale-95 ${
                    activePopup === 'bag' ? 'scale-105' : ''
                  }`}
                >
                  <span className={`text-lg transition-transform ${activePopup === 'bag' ? 'scale-115 filter drop-shadow-[0_0_3px_#f59e0b]' : ''}`}>🎒</span>
                  <span className={`text-[7px] uppercase tracking-wide mt-1 font-bold ${
                    activePopup === 'bag' ? 'text-amber-300 font-extrabold' : 'text-slate-400'
                  }`}>
                    Bag
                  </span>
                  <div className="absolute right-0 top-[20%] h-[60%] w-[1px] bg-gradient-to-b from-transparent via-[#2b254a] to-transparent flex items-center justify-center">
                    <div className="w-[3px] h-[3px] rotate-45 bg-[#7c5dfa]/50" />
                  </div>
                </button>

                {/* Tab 4: QUEST */}
                <button 
                  onClick={() => openPopupWithFramework('quest')}
                  className={`flex flex-col items-center justify-center w-full h-full relative group transition-transform active:scale-95 ${
                    activePopup === 'quest' ? 'scale-105' : ''
                  }`}
                >
                  <span className="text-lg relative">
                    📜
                    {quests.filter(q => q.progress >= q.target && !q.claimed).length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-amber-500 w-1.5 h-1.5 rounded-full" />
                    )}
                  </span>
                  <span className={`text-[7px] uppercase tracking-wide mt-1 font-bold ${
                    activePopup === 'quest' ? 'text-yellow-300 font-extrabold' : 'text-slate-400'
                  }`}>
                    Quest
                  </span>
                  <div className="absolute right-0 top-[20%] h-[60%] w-[1px] bg-gradient-to-b from-transparent via-[#2b254a] to-transparent flex items-center justify-center">
                    <div className="w-[3px] h-[3px] rotate-45 bg-[#7c5dfa]/50" />
                  </div>
                </button>

                {/* Tab 5: ALLIANCE */}
                <button 
                  onClick={() => openPopupWithFramework('alliance')}
                  className={`flex flex-col items-center justify-center w-full h-full relative group transition-transform active:scale-95 ${
                    activePopup === 'alliance' ? 'scale-105' : ''
                  }`}
                >
                  <span className="text-lg relative">
                    🛡️
                    {helpRequestList.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[6px] font-black w-2.5 h-2.5 rounded-full flex items-center justify-center">
                        {helpRequestList.length}
                      </span>
                    )}
                  </span>
                  <span className={`text-[7px] uppercase tracking-wide mt-1 font-bold ${
                    activePopup === 'alliance' ? 'text-blue-300 font-extrabold' : 'text-slate-400'
                  }`}>
                    Alliance
                  </span>
                  <div className="absolute right-0 top-[20%] h-[60%] w-[1px] bg-gradient-to-b from-transparent via-[#2b254a] to-transparent flex items-center justify-center">
                    <div className="w-[3px] h-[3px] rotate-45 bg-[#7c5dfa]/50" />
                  </div>
                </button>

                {/* Tab 6: WORLD TOGGLE (PORTED BADGE) */}
                <button 
                  onClick={() => { setIsCityView(!isCityView); triggerToast(isCityView ? "Switched to Outlands Wilderness Map!" : "Returned to your sovereign Citadel!"); }}
                  className="flex flex-col items-center justify-center w-full h-full relative transition-transform duration-75 active:scale-95"
                >
                  <span className="text-xl -mt-1.5 animate-pulse">🌍</span>
                  <span className="text-[7px] uppercase tracking-wide mt-0.5 text-sky-400 font-extrabold">
                    {isCityView ? 'World' : 'City'}
                  </span>
                </button>

              </div>
            </div>

            {/* Simulated Toasts overlay */}
            {toastMsg && (
              <div className="absolute top-[130px] left-1/2 -translate-x-1/2 bg-[#020617]/95 border border-amber-500/40 px-3 py-1.5 rounded-lg shadow-2xl text-center text-[9px] text-amber-200 backdrop-blur-md w-[280px] z-50 ring-1 ring-amber-500/20 font-semibold font-mono animate-fade-in">
                {toastMsg}
              </div>
            )}

            {/* -------------------- REUSABLE POPUP FRAMEWORK OVERLAY -------------------- */}
            {activePopup && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 animate-fade-in">
                
                {/* Crownspire Premium Window: White Marble Background & Royal Gold Bevel borders */}
                <div 
                  className="w-full max-h-[500px] flex flex-col rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 text-slate-900 border-4 border-yellow-500 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative overflow-hidden animate-scale-up"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.95)), url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'4\' height=\'4\' viewBox=\'0 0 4 4\'%3E%3Cpath fill=\'%23000000\' fill-opacity=\'.04\' d=\'M1 3h1v1H1V3zm2-2h1v1H3V1z\'%3E%3C/path%3E%3C/svg%3E")'
                  }}
                >
                  {/* Decorative golden filigree header frame */}
                  <div className="bg-[#0f172a] text-yellow-100 p-3 flex items-center justify-between border-b-2 border-yellow-500 shadow-inner">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">👑</span>
                      <h3 className="text-[11px] font-black uppercase tracking-widest text-[#f59e0b] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        {activePopup === 'shop' && 'Sovereign Emporium'}
                        {activePopup === 'heroes' && 'Commanders Guild'}
                        {activePopup === 'bag' && 'Citadel Vault (Bag)'}
                        {activePopup === 'quest' && 'Grand Quest Board'}
                        {activePopup === 'alliance' && 'Alliance Embassy'}
                        {activePopup === 'mail' && 'Sovereign Inbox'}
                        {activePopup === 'settings' && 'Citadel Settings'}
                      </h3>
                    </div>
                    {/* Ruby circular close button */}
                    <button 
                      onClick={closeActivePopup}
                      className="w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-xs hover:bg-red-500 border border-yellow-400 active:scale-90 transition-all shadow-md shrink-0"
                    >
                      ×
                    </button>
                  </div>

                  {/* Scrollable Popup Content */}
                  <div className="flex-1 overflow-y-auto p-3.5 space-y-4 text-xs select-text">
                    
                    {/* POPUP A: SOVEREIGN EMPORIUM (SHOP) */}
                    {activePopup === 'shop' && (
                      <div className="space-y-3.5">
                        <div className="bg-gradient-to-br from-[#1e1b4b] to-[#111827] text-white p-3 rounded-xl border border-yellow-500/30 relative overflow-hidden">
                          <span className="absolute -right-2 -bottom-2 text-6xl opacity-10">💎</span>
                          <h4 className="text-[10px] text-yellow-400 font-extrabold uppercase">Daily Free Chest</h4>
                          <p className="text-[9px] text-slate-300 mt-1 leading-relaxed">Claim your daily allowance sponsored by the crown lords.</p>
                          
                          <button
                            disabled={dailyChestClaimed}
                            onClick={() => {
                              setDailyChestClaimed(true);
                              setResources(p => ({ ...p, gold: p.gold + 50000, food: p.food + 50000 }));
                              setPowerRating(p => p + 10000);
                              triggerCelebration('Crown Lords Daily Chest', 1, '🌾', 'rare');
                              triggerToast("Claimed Daily Free Chest: +50K Gold, +50K Grain, +10K Power!");
                            }}
                            className={`mt-2 px-3 py-1 rounded-md text-[10px] font-black uppercase border transition-all active:scale-95 ${
                              dailyChestClaimed 
                                ? 'bg-slate-700/50 text-slate-400 border-slate-600 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 border-yellow-200 font-black'
                            }`}
                          >
                            {dailyChestClaimed ? 'Claimed ✓' : 'Claim Free Chest'}
                          </button>
                        </div>

                        <h4 className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Premium Geode Offers</h4>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-white p-2 rounded-lg border border-slate-300 flex flex-col justify-between items-center text-center">
                            <span className="text-2xl mt-1">🏺</span>
                            <span className="text-[9.5px] font-extrabold text-slate-800 mt-1">Legion War Chest</span>
                            <span className="text-[8px] text-slate-500 mt-0.5">3x Potions, 250K Grain</span>
                            <button
                              onClick={() => handlePurchasePack('Legion War Chest', 1200, [
                                { type: 'xpPotions', qty: 3, name: 'XP Potion', icon: '🧪' },
                                { type: 'food', qty: 250000, name: 'Grain Bundle', icon: '🌾' }
                              ])}
                              className="mt-2 w-full py-1 bg-[#1e293b] hover:bg-[#334155] text-yellow-400 text-[8.5px] font-bold rounded border border-yellow-500/40 flex items-center justify-center gap-1"
                            >
                              💎 1,200 Buy
                            </button>
                          </div>

                          <div className="bg-white p-2 rounded-lg border border-slate-300 flex flex-col justify-between items-center text-center">
                            <span className="text-2xl mt-1">🛡️</span>
                            <span className="text-[9.5px] font-extrabold text-slate-800 mt-1">Citadel Aegis Pack</span>
                            <span className="text-[8px] text-slate-500 mt-0.5">1x Guard, 50K Gold</span>
                            <button
                              onClick={() => handlePurchasePack('Citadel Aegis Pack', 800, [
                                { type: 'gold', qty: 50000, name: 'Gold Pile', icon: '🪙' }
                              ])}
                              className="mt-2 w-full py-1 bg-[#1e293b] hover:bg-[#334155] text-yellow-400 text-[8.5px] font-bold rounded border border-yellow-500/40 flex items-center justify-center gap-1"
                            >
                              💎 800 Buy
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* POPUP B: COMMANDERS GUILD (HEROES) */}
                    {activePopup === 'heroes' && (
                      <div className="space-y-3.5">
                        {/* Hero List picker */}
                        <div className="flex gap-2.5 overflow-x-auto pb-1.5">
                          {heroes.map(h => (
                            <button
                              key={h.id}
                              onClick={() => setSelectedHeroId(h.id)}
                              className={`flex-shrink-0 p-1.5 rounded-lg border flex flex-col items-center justify-center w-[75px] transition-all relative ${
                                selectedHeroId === h.id 
                                  ? 'bg-[#1e1b4b] border-[#eab308] text-white shadow-md' 
                                  : 'bg-white border-slate-300 text-slate-800 hover:border-slate-400'
                              }`}
                            >
                              <span className="text-2xl">{h.avatar}</span>
                              <span className="text-[8.5px] font-black truncate max-w-[65px] mt-1">{h.name.split(' ')[0]}</span>
                              <span className="text-[7px] text-yellow-500 font-mono">{'★'.repeat(h.stars)}</span>
                              {!h.unlocked && (
                                <div className="absolute inset-0 bg-slate-900/60 rounded-lg flex items-center justify-center">
                                  <Lock className="w-3 h-3 text-white" />
                                </div>
                              )}
                            </button>
                          ))}
                        </div>

                        {/* Selected Hero details */}
                        <div className="bg-white p-3 rounded-xl border border-slate-300 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <span className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded ${
                                activeHero.rarity === 'Legendary' ? 'bg-amber-100 text-amber-700 border border-amber-300' : 'bg-purple-100 text-purple-700'
                              }`}>
                                {activeHero.rarity} Commander
                              </span>
                              <h4 className="text-sm font-black text-slate-800 mt-1">{activeHero.name}</h4>
                              <p className="text-[8.5px] text-slate-500 italic leading-none">{activeHero.title}</p>
                            </div>
                            <div className="text-right">
                              <span className="text-[7.5px] text-slate-400 uppercase font-bold leading-none">Power Rating</span>
                              <p className="text-xs font-mono font-black text-[#7c5dfa]">{activeHero.power.toLocaleString()}</p>
                            </div>
                          </div>

                          {/* Stats and Level */}
                          <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                            <div>
                              <span className="text-[8px] text-slate-400 font-bold uppercase">Combat Class</span>
                              <p className="text-[9.5px] font-bold text-slate-700 mt-0.5">{activeHero.type}</p>
                            </div>
                            <div>
                              <span className="text-[8px] text-slate-400 font-bold uppercase">Level Progress</span>
                              <p className="text-[9.5px] font-mono font-bold text-slate-700 mt-0.5">
                                Lvl {activeHero.level}/{activeHero.maxLevel} <span className="text-[8px] text-slate-400">({activeHero.xp}/{activeHero.xpRequired})</span>
                              </p>
                            </div>
                          </div>

                          {/* Equipment Sockets */}
                          <div>
                            <span className="text-[8px] text-slate-400 font-bold uppercase">Orbital Equipment Sockets</span>
                            <div className="grid grid-cols-4 gap-2.5 mt-1.5">
                              {[
                                { name: 'Sword', icon: '🗡️', val: activeHero.equipment.weapon },
                                { name: 'Helmet', icon: '🪖', val: activeHero.equipment.helmet },
                                { name: 'Armor', icon: '🛡️', val: activeHero.equipment.armor },
                                { name: 'Ring', icon: '💍', val: activeHero.equipment.ring }
                              ].map(eq => (
                                <div key={eq.name} className="bg-slate-50 border border-slate-200 p-1 rounded flex flex-col items-center text-center relative group">
                                  <span className="text-lg">{eq.icon}</span>
                                  <span className="text-[7.5px] text-slate-600 font-semibold mt-0.5">Lvl {eq.val}</span>
                                  <button
                                    onClick={() => {
                                      if (resources.gold < eq.val * 3000) {
                                        triggerToast("Insufficient gold for equipment upgrade!");
                                        return;
                                      }
                                      setResources(p => ({ ...p, gold: p.gold - eq.val * 3000 }));
                                      setHeroes(prev => prev.map(hero => {
                                        if (hero.id === activeHero.id) {
                                          return {
                                            ...hero,
                                            equipment: {
                                              ...hero.equipment,
                                              [eq.name === 'Sword' ? 'weapon' : eq.name === 'Helmet' ? 'helmet' : eq.name === 'Armor' ? 'armor' : 'ring']: eq.val + 1
                                            },
                                            power: hero.power + 800
                                          };
                                        }
                                        return hero;
                                      }));
                                      setPowerRating(p => p + 1200);
                                      triggerToast(`Successfully forged and upgraded selected ${eq.name}! (+1,200 Power)`);
                                    }}
                                    className="absolute -top-1 -right-1 bg-yellow-500 hover:bg-yellow-400 text-[7px] text-slate-950 font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border border-yellow-200 shadow active:scale-90"
                                    title={`Upgrade for ${eq.val * 3}K Gold`}
                                  >
                                    +
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Level Up and Ascend Buttons */}
                          <div className="grid grid-cols-2 gap-2 pt-1.5">
                            <button
                              onClick={() => handleLevelUpHero(activeHero.id)}
                              className="py-1.5 bg-[#7c5dfa] hover:bg-[#6d28d9] text-white rounded-lg text-[9.5px] font-black uppercase flex items-center justify-center gap-1 shadow border border-[#a78bfa]/40 active:scale-95"
                            >
                              🧪 Drink XP Potion ({xpPotions})
                            </button>
                            <button
                              onClick={() => handleAscendHero(activeHero.id)}
                              className="py-1.5 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 rounded-lg text-[9.5px] font-black uppercase flex items-center justify-center gap-1 shadow border border-yellow-200 active:scale-95"
                            >
                              ★ Ascend Shards ({activeHero.shards}/{activeHero.shardsRequired})
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* POPUP C: CITADEL VAULT (BAG) */}
                    {activePopup === 'bag' && (
                      <div className="space-y-3.5">
                        {/* Tab Selector */}
                        <div className="flex bg-slate-200 p-1 rounded-lg">
                          {[
                            { id: 'resource', label: 'Resources' },
                            { id: 'speedup', label: 'Speedups' },
                            { id: 'chest', label: 'Loot Boxes' }
                          ].map(t => (
                            <button
                              key={t.id}
                              onClick={() => { setActiveBagTab(t.id as any); setSelectedBagItem(null); }}
                              className={`flex-1 py-1 text-[9.5px] font-black uppercase rounded-md transition-all ${
                                activeBagTab === t.id 
                                  ? 'bg-[#0f172a] text-[#fbbf24] shadow' 
                                  : 'text-slate-600 hover:text-slate-800'
                              }`}
                            >
                              {t.label}
                            </button>
                          ))}
                        </div>

                        {/* Grid list of category items */}
                        <div className="grid grid-cols-4 gap-2 max-h-[140px] overflow-y-auto pr-1">
                          {inventoryItems.filter(i => i.type === activeBagTab).map(i => (
                            <button
                              key={i.id}
                              onClick={() => setSelectedBagItem(i.id)}
                              className={`p-1.5 rounded-lg border flex flex-col items-center justify-between text-center min-h-[60px] relative transition-all ${
                                selectedBagItem === i.id 
                                  ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-400/50' 
                                  : 'bg-white border-slate-300 hover:border-slate-400'
                              }`}
                            >
                              <span className="text-xl">{i.icon}</span>
                              <span className="text-[8px] font-semibold truncate max-w-[60px] mt-1">{i.name.split(' (')[0]}</span>
                              <span className="absolute bottom-0.5 right-0.5 bg-slate-800/80 text-white font-mono text-[7px] px-1 rounded-sm">
                                x{i.quantity}
                              </span>
                            </button>
                          ))}
                        </div>

                        {/* Selected Item inspector description panel */}
                        {selectedBagItem ? (
                          (() => {
                            const activeItem = inventoryItems.find(i => i.id === selectedBagItem);
                            if (!activeItem) return null;
                            return (
                              <div className="bg-white p-2.5 rounded-xl border border-slate-300 space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl p-1 bg-slate-100 rounded-lg">{activeItem.icon}</span>
                                  <div>
                                    <h5 className="text-[10px] font-black text-slate-800">{activeItem.name}</h5>
                                    <span className={`text-[6.5px] uppercase font-black px-1 rounded ${
                                      activeItem.rarity === 'common' ? 'bg-slate-100 text-slate-500' :
                                      activeItem.rarity === 'rare' ? 'bg-blue-100 text-blue-600' :
                                      activeItem.rarity === 'epic' ? 'bg-purple-100 text-purple-600' : 'bg-amber-100 text-amber-600'
                                    }`}>
                                      {activeItem.rarity} Grade
                                    </span>
                                  </div>
                                </div>
                                <p className="text-[8.5px] text-slate-600 leading-relaxed">{activeItem.desc}</p>
                                <button
                                  onClick={() => handleUseBagItem(activeItem.id)}
                                  className="w-full py-1.5 bg-[#0f172a] hover:bg-[#1e293b] text-[#fbbf24] font-black uppercase rounded-lg text-[9px] border border-[#fbbf24]/50 active:scale-95"
                                >
                                  Use Item Token
                                </button>
                              </div>
                            );
                          })()
                        ) : (
                          <div className="text-center p-4 bg-slate-50 border border-dashed border-slate-300 rounded-lg text-slate-400 font-medium text-[9px]">
                            Select any item above to view description and execute use scripts.
                          </div>
                        )}
                      </div>
                    )}

                    {/* POPUP D: GRAND QUEST BOARD */}
                    {activePopup === 'quest' && (
                      <div className="space-y-3.5">
                        <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-start gap-2 text-slate-700">
                          <span className="text-lg">📢</span>
                          <p className="text-[8.5px] leading-tight">
                            Complete Citadel mandates to earn kingdom gold reserves, grain sacks, and speedup boosts! Claim completed quests below.
                          </p>
                        </div>

                        <div className="space-y-2">
                          {quests.map(q => {
                            const percent = Math.min((q.progress / q.target) * 100, 100);
                            return (
                              <div key={q.id} className="bg-white p-2.5 rounded-xl border border-slate-300 space-y-1.5">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h5 className="text-[9.5px] font-black text-slate-800 leading-tight">{q.title}</h5>
                                    <p className="text-[8px] text-slate-500 leading-none">{q.desc}</p>
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <span className="text-[7.5px] font-mono font-bold text-slate-600">
                                      {q.progress.toLocaleString()} / {q.target.toLocaleString()}
                                    </span>
                                  </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-yellow-500 to-amber-500 transition-all duration-300"
                                    style={{ width: `${percent}%` }}
                                  />
                                </div>

                                {/* Reward & Button */}
                                <div className="flex items-center justify-between pt-1">
                                  <div className="flex items-center gap-1 text-[8.5px] font-mono text-slate-600">
                                    <span>Reward:</span>
                                    <span>{q.reward.icon}</span>
                                    <span className="font-bold text-slate-800">+{formatNum(q.reward.qty)}</span>
                                  </div>

                                  {q.claimed ? (
                                    <span className="text-[8.5px] text-emerald-600 font-bold font-mono">Claimed ✓</span>
                                  ) : (
                                    <button
                                      disabled={q.progress < q.target}
                                      onClick={() => handleClaimQuest(q.id)}
                                      className={`px-2.5 py-1 rounded-md text-[8.5px] font-black uppercase border active:scale-95 transition-all ${
                                        q.progress < q.target 
                                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' 
                                          : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 border-emerald-300'
                                      }`}
                                    >
                                      Claim Loot
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* POPUP E: ALLIANCE EMBASSY */}
                    {activePopup === 'alliance' && (
                      <div className="space-y-3.5">
                        {/* Tab selections */}
                        <div className="bg-white p-2.5 rounded-xl border border-slate-300 space-y-2.5">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                            <span className="text-[9.5px] font-black text-slate-700 uppercase">Active Help Desk</span>
                            <button 
                              onClick={handleHelpAll}
                              className="px-2 py-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-[8px] font-bold uppercase active:scale-95"
                            >
                              Help All
                            </button>
                          </div>

                          {helpRequestList.length > 0 ? (
                            <div className="space-y-1.5 max-h-[85px] overflow-y-auto pr-1">
                              {helpRequestList.map(req => {
                                const percent = (req.progress / req.target) * 100;
                                return (
                                  <div key={req.id} className="bg-slate-50 p-1.5 rounded-md border border-slate-200 flex items-center justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                      <div className="flex justify-between items-center text-[7.5px] text-slate-500 font-semibold leading-none">
                                        <span className="truncate">{req.sender}</span>
                                        <span className="font-mono">{req.progress}/{req.target}</span>
                                      </div>
                                      <p className="text-[8px] font-bold text-slate-700 truncate leading-tight mt-0.5">{req.type}</p>
                                    </div>
                                    <button
                                      onClick={() => handleHelpAllianceMember(req.id)}
                                      className="p-1 bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-400 text-white rounded text-[7.5px] font-extrabold active:scale-95"
                                    >
                                      Assist
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-center p-3 text-slate-400 text-[8px] italic border border-dashed border-slate-200 rounded-md">
                              No active help requests! Your alliances are running at maximum dispatch speeds.
                            </div>
                          )}
                        </div>

                        {/* Live chat logs */}
                        <div className="bg-white p-2.5 rounded-xl border border-slate-300 flex flex-col h-[140px] justify-between">
                          <span className="text-[9.5px] font-black text-slate-700 uppercase border-b border-slate-200 pb-1 flex items-center gap-1">
                            <MessageSquare className="w-3 h-3 text-blue-500" /> Sector #4 Chat dispatch
                          </span>
                          
                          <div className="flex-1 overflow-y-auto space-y-1.5 py-1.5 max-h-[90px] pr-1">
                            {allianceChat.map((msg, idx) => (
                              <div key={idx} className="text-[8px] leading-tight">
                                <span className={`font-black uppercase mr-1 ${msg.sender === lordName ? 'text-blue-600' : 'text-slate-600'}`}>
                                  {msg.sender}:
                                </span>
                                <span className="text-slate-700 font-medium">{msg.text}</span>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-1 border-t border-slate-200 pt-1.5">
                            <input 
                              type="text" 
                              value={typedMessage}
                              onChange={(e) => setTypedMessage(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSendAllianceChat()}
                              placeholder="Message alliance lords..." 
                              className="flex-1 p-1 border border-slate-300 rounded text-[8px] bg-slate-50 focus:outline-none focus:border-blue-500 font-medium"
                            />
                            <button 
                              onClick={handleSendAllianceChat}
                              className="p-1 bg-blue-600 text-white rounded hover:bg-blue-500 active:scale-95"
                            >
                              <Send className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* POPUP F: SOVEREIGN INBOX (MAIL) */}
                    {activePopup === 'mail' && (
                      <div className="space-y-3.5">
                        <div className="space-y-2">
                          {mails.map(m => (
                            <div key={m.id} className={`bg-white p-2.5 rounded-xl border space-y-1.5 relative ${
                              m.claimed ? 'border-slate-200 opacity-80' : 'border-yellow-500/40'
                            }`}>
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <h5 className="text-[9.5px] font-black text-slate-800 leading-tight flex items-center gap-1">
                                    <Mail className="w-2.5 h-2.5 text-[#fbbf24]" /> {m.subject}
                                  </h5>
                                  <p className="text-[7.5px] text-slate-400 font-mono leading-none mt-0.5">From: {m.sender} | {m.date}</p>
                                </div>
                              </div>
                              <p className="text-[8.5px] text-slate-600 leading-relaxed">{m.body}</p>
                              
                              {m.reward && (
                                <div className="flex justify-between items-center pt-1 border-t border-slate-100 mt-1">
                                  <div className="flex items-center gap-1 text-[8px] font-mono text-slate-600">
                                    <span>Attachment:</span>
                                    <span className="text-base">{m.reward.icon}</span>
                                    <span className="font-extrabold text-slate-800">+{m.reward.qty}</span>
                                  </div>

                                  {m.claimed ? (
                                    <span className="text-[8px] text-slate-500 font-bold uppercase">Claimed</span>
                                  ) : (
                                    <button
                                      onClick={() => handleClaimMail(m.id)}
                                      className="px-2.5 py-0.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 font-black rounded text-[8px] uppercase border border-yellow-300"
                                    >
                                      Claim Attachment
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* POPUP G: CITADEL SETTINGS (SETTINGS) */}
                    {activePopup === 'settings' && (
                      <div className="space-y-3.5">
                        <div className="bg-white p-3 rounded-xl border border-slate-300 space-y-2.5">
                          <span className="text-[9.5px] font-black text-slate-700 uppercase tracking-wider block">Redeem Promo Code</span>
                          <p className="text-[8.5px] text-slate-500 leading-tight">
                            Enter any verified promo key sponsored by the developers to gain premium resources and VIP boosts instantly. Try: <strong className="text-[#fbbf24] bg-[#0f172a] px-1 rounded font-mono">CROWNSPIRE2026</strong>.
                          </p>

                          <div className="flex gap-2.5">
                            <input 
                              type="text" 
                              value={promoCode}
                              onChange={(e) => setPromoCode(e.target.value)}
                              placeholder="Enter promo key..." 
                              className="flex-1 p-1.5 border border-slate-300 rounded text-[9.5px] uppercase font-mono bg-slate-50 focus:outline-none focus:border-yellow-500 font-bold text-center"
                            />
                            <button
                              onClick={handleRedeemPromo}
                              className="px-3 bg-[#0f172a] hover:bg-[#1e293b] text-[#fbbf24] font-black rounded text-[9px] uppercase border border-[#fbbf24]/50 active:scale-95"
                            >
                              Redeem
                            </button>
                          </div>

                          {redeemedCodes.length > 0 && (
                            <div className="pt-2 border-t border-slate-200">
                              <span className="text-[7.5px] text-slate-400 font-bold uppercase">Redeemed Keys</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {redeemedCodes.map(code => (
                                  <span key={code} className="bg-emerald-50 text-emerald-600 font-mono text-[7px] px-1.5 py-0.5 rounded border border-emerald-200">
                                    {code} CLAIMED ✓
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="bg-white p-3 rounded-xl border border-slate-300 space-y-2">
                          <span className="text-[9.5px] font-black text-slate-700 uppercase tracking-wider block">Change Lord Alias</span>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              value={lordName}
                              onChange={(e) => setLordName(e.target.value)}
                              className="flex-1 p-1.5 border border-slate-300 rounded text-[9.5px] bg-slate-50 focus:outline-none font-bold text-center"
                            />
                            <button 
                              onClick={() => triggerToast(`Alias updated to: ${lordName}!`)}
                              className="px-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded text-[9px] font-bold active:scale-95"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Window gold trim footer bar */}
                  <div className="bg-slate-200/90 text-center py-2 border-t border-yellow-500/30 text-[7.5px] font-mono text-slate-500 font-bold tracking-widest uppercase">
                    Crownspire modular core v1.0
                  </div>

                </div>
              </div>
            )}

            {/* -------------------- NEW BUILDING UPGRADE MODAL -------------------- */}
            {selectedUpgradeBuilding && (
              <div className="absolute inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-3 animate-fade-in">
                <div className="w-[280px] bg-slate-50 rounded-2xl border-[3px] border-yellow-500 shadow-2xl overflow-hidden flex flex-col justify-between">
                  
                  {/* Top Crownspire Window gold bevel bar */}
                  <div className="bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 px-3 py-1.5 flex items-center justify-between border-b border-yellow-400">
                    <span className="text-[9px] font-black text-slate-950 uppercase tracking-wider flex items-center gap-1">
                      🔨 Structure Upgrade: Level {selectedUpgradeBuilding.currentLevel}
                    </span>
                    <button 
                      onClick={() => setSelectedUpgradeBuilding(null)}
                      className="text-slate-950 hover:text-white transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Window Content */}
                  <div className="p-3.5 space-y-3 flex-1 overflow-y-auto max-h-[350px]">
                    <div className="flex items-center gap-2.5 bg-slate-100 p-2 rounded-xl border border-slate-200">
                      <span className="text-3xl">{selectedUpgradeBuilding.icon}</span>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-800 leading-tight">{selectedUpgradeBuilding.name}</h4>
                        <p className="text-[7.5px] text-slate-500 leading-none mt-0.5">Sovereign Realm Property</p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[7.5px] font-extrabold uppercase text-slate-400 block tracking-wider font-sans">Upgrade Requirements</span>
                      
                      <div className="grid grid-cols-2 gap-1.5 font-mono text-[8px]">
                        <div className={`p-1.5 rounded-lg border flex items-center justify-between ${
                          resources.food >= selectedUpgradeBuilding.cost.food ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                          <span>🌾 Food:</span>
                          <span className="font-bold">{formatNum(selectedUpgradeBuilding.cost.food)}</span>
                        </div>

                        <div className={`p-1.5 rounded-lg border flex items-center justify-between ${
                          resources.wood >= selectedUpgradeBuilding.cost.wood ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                          <span>🪵 Wood:</span>
                          <span className="font-bold">{formatNum(selectedUpgradeBuilding.cost.wood)}</span>
                        </div>

                        <div className={`p-1.5 rounded-lg border flex items-center justify-between ${
                          resources.stone >= selectedUpgradeBuilding.cost.stone ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                          <span>🪨 Stone:</span>
                          <span className="font-bold">{formatNum(selectedUpgradeBuilding.cost.stone)}</span>
                        </div>

                        <div className={`p-1.5 rounded-lg border flex items-center justify-between ${
                          resources.iron >= selectedUpgradeBuilding.cost.iron ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'
                        }`}>
                          <span>🔩 Iron:</span>
                          <span className="font-bold">{formatNum(selectedUpgradeBuilding.cost.iron)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 p-2 rounded-lg text-slate-700 text-[8px] leading-tight font-sans">
                      🔨 <strong>Level {selectedUpgradeBuilding.currentLevel + 1} Benefit:</strong> Increased base production capacity &amp; resource accumulation rates. (+12,000 Global Power)
                    </div>
                  </div>

                  {/* Footer Action row with Gold and Marble buttons */}
                  <div className="bg-slate-100 p-2.5 border-t border-slate-200 flex gap-2">
                    <button
                      onClick={() => handleStartBuildingUpgrade(selectedUpgradeBuilding.key, selectedUpgradeBuilding.cost)}
                      className="flex-1 py-1.5 bg-[#0f172a] text-yellow-400 hover:text-yellow-300 font-extrabold text-[8.5px] uppercase border border-yellow-600 rounded-lg active:scale-95 shadow-sm transition-all"
                    >
                      Start Construct (5s)
                    </button>
                    <button
                      onClick={() => handleInstantBuildingUpgrade(selectedUpgradeBuilding.key, selectedUpgradeBuilding.crystalCost)}
                      className="flex-1 py-1.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 font-black text-[8.5px] uppercase border border-yellow-300 rounded-lg active:scale-95 shadow-md transition-all flex items-center justify-center gap-1"
                    >
                      Instant ⚡ (💎{selectedUpgradeBuilding.crystalCost})
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* -------------------- NEW WILDLING TARGET DETAILS MODAL -------------------- */}
            {activeWildling && (
              <div className="absolute inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-3 animate-fade-in">
                <div className="w-[280px] bg-slate-50 rounded-2xl border-[3px] border-red-500 shadow-2xl overflow-hidden flex flex-col justify-between">
                  
                  {/* Top Header */}
                  <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 px-3 py-1.5 flex items-center justify-between border-b border-red-400">
                    <span className="text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-1">
                      ⚔️ Wildling Target: Lv.{activeWildling.level}
                    </span>
                    <button 
                      onClick={() => setActiveWildling(null)}
                      className="text-white hover:text-slate-200 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-3.5 space-y-3 flex-1 overflow-y-auto max-h-[350px]">
                    <div className="flex items-center gap-2.5 bg-red-50 p-2 rounded-xl border border-red-100">
                      <span className="text-3xl">🐺</span>
                      <div>
                        <h4 className="text-[11px] font-black text-slate-800 leading-tight">{activeWildling.species}</h4>
                        <p className="text-[7.5px] text-red-500 font-extrabold leading-none mt-0.5">{activeWildling.rarity} Target</p>
                      </div>
                    </div>

                    <div className="space-y-1 text-[8.5px] text-slate-700 leading-normal font-sans">
                      <p><strong>Description:</strong> {activeWildling.description}</p>
                      <p><strong>Weakness:</strong> <span className="text-red-600 font-bold">{activeWildling.weakness}</span></p>
                      <p><strong>Target Power Rating:</strong> <span className="font-mono text-slate-900 font-bold">{activeWildling.power.toLocaleString()}</span></p>
                      <p><strong>Expedition Cost:</strong> <span className="font-mono text-red-600 font-bold">-{activeWildling.staminaCost} Stamina</span></p>
                    </div>

                    <div className="p-2.5 bg-yellow-500/10 border border-yellow-500/20 rounded-xl space-y-1 font-sans">
                      <span className="text-[7.5px] font-black uppercase text-amber-600 block tracking-wider">Defeat Loot Rewards</span>
                      <p className="text-[8px] font-semibold text-slate-800 leading-tight">
                        {activeWildling.rewards}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="bg-slate-100 p-2.5 border-t border-[#fca5a5] flex gap-2">
                    <button
                      onClick={() => setActiveWildling(null)}
                      className="flex-1 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-[8.5px] uppercase rounded-lg active:scale-95 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleStartWildlingAttack}
                      className="flex-1 py-1.5 bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-500 text-white font-black text-[8.5px] uppercase border border-red-400 rounded-lg active:scale-95 shadow-md transition-all flex items-center justify-center gap-1"
                    >
                      ⚔️ Attack Target
                    </button>
                  </div>

                </div>
              </div>
            )}

            {/* -------------------- REWARD CELEBRATION OVERLAY -------------------- */}
            {rewardClaimOverlay && (
              <div 
                onClick={() => setRewardClaimOverlay(null)}
                className="absolute inset-0 bg-slate-950/90 z-55 flex flex-col items-center justify-center p-4 animate-fade-in cursor-pointer"
              >
                {/* Ray rays of light animation backdrop */}
                <div className="absolute w-44 h-44 rounded-full bg-yellow-400/10 blur-3xl animate-pulse pointer-events-none" />
                
                <span className="text-xs font-black uppercase text-[#eab308] tracking-widest">Victory Loot Vault</span>
                <h4 className="text-base font-black text-white text-center mt-1 leading-tight">Bounty Claim Successful!</h4>
                
                {/* Glowing reward item card */}
                <div className="my-6 bg-gradient-to-br from-[#1e1b4b] to-[#0f172a] p-4 rounded-2xl border-2 border-[#eab308] flex flex-col items-center justify-center text-center shadow-[0_0_25px_rgba(234,179,8,0.4)] min-w-[130px] animate-scale-up">
                  <span className="text-5xl animate-bounce" style={{ animationDuration: '2.5s' }}>{rewardClaimOverlay.icon}</span>
                  <span className="text-[12px] font-black text-white mt-3 block">{rewardClaimOverlay.name}</span>
                  <span className="text-[9.5px] font-mono text-[#eab308] font-extrabold mt-1">x{rewardClaimOverlay.quantity.toLocaleString()}</span>
                  <span className={`text-[7px] font-bold uppercase mt-1 px-1.5 py-0.5 rounded ${
                    rewardClaimOverlay.rarity === 'legendary' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' :
                    rewardClaimOverlay.rarity === 'epic' ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30' : 'bg-slate-500/15 text-slate-400 border border-slate-500/30'
                  }`}>
                    {rewardClaimOverlay.rarity} Grade
                  </span>
                </div>

                <span className="text-[7.5px] font-mono text-slate-400 uppercase tracking-widest animate-pulse">Tap anywhere to return to Citadel</span>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT COLUMN: Control Deck, Code inspector & map documentation */}
        <div className="xl:col-span-7 flex flex-col gap-6">
          
          {/* 1. Control Deck */}
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 shadow-lg space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 border-b border-slate-800 pb-2">
              <span>🎛️ HUD Command Deck &amp; Resource Injector</span>
            </h3>

            {/* Simulated Resource Spawners */}
            <div className="space-y-2">
              <label className="text-xs text-slate-400 font-semibold">Inject Resources directly into Citadel wallets (count-up simulation):</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                <button 
                  onClick={() => { setResources(p => ({ ...p, food: p.food + 200000 })); setPowerRating(p => p + 3000); spawnFloatText("+200K Grain"); triggerToast("Injected +200K Grain into Granaries!"); }} 
                  className="py-1.5 px-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/20 text-[10px] font-mono font-bold flex flex-col items-center active:scale-95 transition-all"
                >
                  <span>🌾 Grain</span>
                  <span className="text-white mt-0.5">+200K</span>
                </button>
                <button 
                  onClick={() => { setResources(p => ({ ...p, wood: p.wood + 200000 })); setPowerRating(p => p + 3000); spawnFloatText("+200K Wood"); triggerToast("Injected +200K Wood into Warehouse!"); }} 
                  className="py-1.5 px-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded border border-amber-500/20 text-[10px] font-mono font-bold flex flex-col items-center active:scale-95 transition-all"
                >
                  <span>🪵 Wood</span>
                  <span className="text-white mt-0.5">+200K</span>
                </button>
                <button 
                  onClick={() => { setResources(p => ({ ...p, stone: p.stone + 100000 })); setPowerRating(p => p + 2000); spawnFloatText("+100K Stone"); triggerToast("Injected +100K Stone blocks into Quarry!"); }} 
                  className="py-1.5 px-1 bg-slate-400/10 hover:bg-slate-400/20 text-slate-300 rounded border border-slate-500/20 text-[10px] font-mono font-bold flex flex-col items-center active:scale-95 transition-all"
                >
                  <span>🪨 Stone</span>
                  <span className="text-white mt-0.5">+100K</span>
                </button>
                <button 
                  onClick={() => { setResources(p => ({ ...p, iron: p.iron + 100000 })); setPowerRating(p => p + 2000); spawnFloatText("+100K Iron"); triggerToast("Injected +100K Ore blocks into foundry!"); }} 
                  className="py-1.5 px-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded border border-blue-500/20 text-[10px] font-mono font-bold flex flex-col items-center active:scale-95 transition-all"
                >
                  <span>🔩 Iron</span>
                  <span className="text-white mt-0.5">+100K</span>
                </button>
                <button 
                  onClick={() => { setResources(p => ({ ...p, gold: p.gold + 50000 })); setPowerRating(p => p + 1000); spawnFloatText("+50K Gold"); triggerToast("Injected +50K gold coins into vaults!"); }} 
                  className="py-1.5 px-1 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 rounded border border-yellow-500/20 text-[10px] font-mono font-bold flex flex-col items-center active:scale-95 transition-all"
                >
                  <span>🪙 Gold</span>
                  <span className="text-white mt-0.5">+50K</span>
                </button>
                <button 
                  onClick={() => { setResources(p => ({ ...p, crystals: p.crystals + 5000 })); setPowerRating(p => p + 15000); spawnFloatText("+5.0K Crystals"); triggerToast("Spawned 5,000 Premium Crystals!"); }} 
                  className="py-1.5 px-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded border border-cyan-500/20 text-[10px] font-mono font-bold flex flex-col items-center active:scale-95 transition-all"
                >
                  <span>💎 Crystals</span>
                  <span className="text-white mt-0.5">+5K</span>
                </button>
              </div>
            </div>

            {/* Quick configuration overrides */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold text-white">Active Camera View</span>
                  <span className="text-[9px] text-slate-400">Toggles active viewport map</span>
                </div>
                <button 
                  onClick={() => { setIsCityView(!isCityView); triggerToast(`Toggled camera rendering to ${!isCityView ? 'Citadel City' : 'Wilderness Hex Grid'}`); }}
                  className="bg-slate-900 hover:bg-slate-850 text-[#f59e0b] text-[10px] font-black py-1 px-2.5 rounded-lg border border-[#f59e0b]/30 active:scale-95"
                >
                  {isCityView ? '🏰 Kingdom City' : '🌍 Hex Map'}
                </button>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[11px] font-semibold text-white">Button State Mocking</span>
                  <span className="text-[9px] text-slate-400">Force specific button states</span>
                </div>
                <select
                  value={btnStateOverride || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    setBtnStateOverride(val ? val as any : null);
                    triggerToast(`Set HUD force state to: ${val || 'Default dynamic'}`);
                  }}
                  className="bg-slate-900 text-[#f59e0b] border border-slate-800 rounded px-2 py-1 text-[10px] focus:outline-none"
                >
                  <option value="">Dynamic</option>
                  <option value="normal">Normal</option>
                  <option value="hover">Hover</option>
                  <option value="pressed">Pressed</option>
                  <option value="disabled">Disabled</option>
                </select>
              </div>
            </div>

          </div>

          {/* 2. Godot Code Inspector Panel */}
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 shadow-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Code className="w-4 h-4 text-teal-400" />
                <span>Godot 4.4+ Ready Production Source Code</span>
              </h3>
              <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono px-2 py-0.5 rounded">Compiled</span>
            </div>

            <p className="text-[11px] text-slate-400">
              The HUD and popup widgets are fully structured in clean GDScript and scene formats. Select the file below to inspect the source written to the project workspace:
            </p>

            {/* Code Selector Tabs */}
            <div className="flex gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
              {[
                { id: 'BasePopup.gd', label: 'BasePopup.gd' },
                { id: 'BasePopup.tscn', label: 'BasePopup.tscn' },
                { id: 'GameHUD.gd', label: 'GameHUD.gd' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedCodeFile(f.id as any)}
                  className={`flex-1 py-1.5 text-xs font-mono rounded transition-all text-center ${
                    selectedCodeFile === f.id 
                      ? 'bg-slate-800 text-teal-400 font-bold border border-slate-700' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Code View Frame */}
            <div className="relative">
              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-850 font-mono text-[10px] text-slate-300 overflow-x-auto max-h-[180px] custom-scrollbar select-text">
                {selectedCodeFile === 'BasePopup.gd' && (
                  `# res://hud/scripts/BasePopup.gd
class_name BasePopup
extends Control

signal opened
signal closed
signal action_triggered(action_id: String, payload: Dictionary)

@onready var background_dim: ColorRect = get_node_or_null("BackgroundDim")
@onready var window_frame: PanelContainer = get_node_or_null("WindowFrame")
@onready var close_btn: Button = get_node_or_null("%CloseButton")
@onready var title_lbl: Label = get_node_or_null("%TitleLabel")
@onready var animation_player: AnimationPlayer = get_node_or_null("AnimationPlayer")

@export var popup_title: String = "Sovereign Scroll"
@export var is_modal: bool = true
@export var close_on_dim_click: bool = true

func _ready() -> void:
    if title_lbl:
        title_lbl.text = popup_title.to_upper()
    if close_btn:
        close_btn.pressed.connect(close)
    if background_dim and close_on_dim_click:
        background_dim.gui_input.connect(_on_background_dim_gui_input)
    open()

func open() -> void:
    visible = true
    opened.emit()
    if animation_player and animation_player.has_animation("open_bounce"):
        animation_player.play("open_bounce")
    else:
        _fallback_fade_in()

func close() -> void:
    closed.emit()
    if animation_player and animation_player.has_animation("close_fade"):
        animation_player.play("close_fade")
        await animation_player.animation_finished
    else:
        await _fallback_fade_out()
    queue_free()`
                )}
                {selectedCodeFile === 'BasePopup.tscn' && (
                  `[gd_scene load_steps=5 format=3 uid="uid://c6bpq6b1x7r2e"]
[ext_resource type="Script" path="res://hud/scripts/BasePopup.gd" id="1_popup"]

[sub_resource type="StyleBoxFlat" id="StyleBoxFlat_dim"]
bg_color = Color(0.04, 0.07, 0.11, 0.68)

[sub_resource type="StyleBoxFlat" id="StyleBoxFlat_marble"]
bg_color = Color(0.96, 0.96, 0.94, 1)
border_width_left = 6
border_width_top = 6
border_width_right = 6
border_width_bottom = 6
border_color = Color(0.85, 0.64, 0.12, 1)
corner_radius_top_left = 16
corner_radius_top_right = 16

[node name="BasePopup" type="Control"]
layout_mode = 3
anchors_preset = 15
anchor_right = 1.0
anchor_bottom = 1.0
grow_horizontal = 2
grow_vertical = 2
script = ExtResource("1_popup")

[node name="BackgroundDim" type="ColorRect" parent="."]
layout_mode = 1
anchors_preset = 15`
                )}
                {selectedCodeFile === 'GameHUD.gd' && (
                  `# res://hud/scripts/GameHUD.gd
extends Control

signal map_mode_changed(new_mode: String)

@onready var player_name_lbl: Label = get_node_or_null("%PlayerNameLabel")
@onready var power_lbl: Label = get_node_or_null("%PowerValueLabel")
@onready var vip_lbl: Label = get_node_or_null("%VipValueLabel")

@onready var food_lbl: Label = get_node_or_null("%FoodLabel")
@onready var wood_lbl: Label = get_node_or_null("%WoodLabel")
@onready var stone_lbl: Label = get_node_or_null("%StoneLabel")
@onready var iron_lbl: Label = get_node_or_null("%IronLabel")
@onready var gold_lbl: Label = get_node_or_null("%GoldLabel")
@onready var royal_crystals_lbl: Label = get_node_or_null("%RoyalCrystalsLabel")

@onready var nav_container: HBoxContainer = get_node_or_null("%NavigationContainer")
@onready var map_toggle_btn: Button = get_node_or_null("%MapToggleButton")

func _ready() -> void:
    if map_toggle_btn:
        map_toggle_btn.pressed.connect(_on_map_toggle_pressed)
    _load_hud_data()
    update_hud_display()
    _populate_navigation_bar()

func update_hud_display() -> void:
    var ui_mgr = get_node_or_null("/root/UIManager")
    if ui_mgr:
        _set_label_text(player_name_lbl, ui_mgr.player_name)
        _set_label_text(power_lbl, "PWR " + _format_number(ui_mgr.power))
        _set_label_text(vip_lbl, "VIP %d" % ui_mgr.vip_level)`
                )}
              </pre>
            </div>
            
            <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium">
              <span>Path: <code className="text-slate-400">/hud/{selectedCodeFile.includes('.gd') ? 'scripts/' : 'scenes/'}{selectedCodeFile}</code></span>
              <span className="text-emerald-500 font-semibold font-mono">Status: Verified Compile-Ready ✓</span>
            </div>
          </div>

          {/* 3. Navigation System Architecture */}
          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 shadow-lg space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>📐 Navigation Flow &amp; Hierarchy Blueprint</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Below is the structured, modular navigation blueprint we established for the game. Every menu triggers a specialized event through the Autoload `UIManager` event-bus.
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-[11px] space-y-2 font-mono">
              <div className="flex items-center gap-1.5 text-white">
                <span className="text-emerald-400">City Realm (Citadel Core)</span>
                <span className="text-slate-500">⇄</span>
                <span className="text-amber-400">Outlands Wilderness Map (Hex Grid)</span>
              </div>
              <div className="text-slate-500 pl-4 border-l border-slate-800 space-y-1 mt-1 font-sans">
                <p>• <strong>Top HUD Buttons</strong>: Launch settings overlay or mail reader securely via <code className="text-slate-300 font-mono text-[10px]">UIManager.open_popup()</code>.</p>
                <p>• <strong>Bottom HUD Sockets</strong>: Instantiate sub-popups dynamically, registering them onto the central popup stack to maintain backward closing escape bounds.</p>
                <p>• <strong>World Toggle Hex Badge</strong>: Animates spatial coordinate translations cleanly without requiring scene resets.</p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
