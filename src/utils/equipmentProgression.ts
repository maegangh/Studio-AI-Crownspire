// Crownspire Equipment Progression System Engine
// Handles Level 1-100 scales, Ascension tiers (0-5 stars), Set Bonuses, and Forging.

import EQUIPMENT_TEMPLATES_RAW from '../../public/equipment.json';

export interface UserEquipment {
  id: string; // Unique instance ID
  baseId: string; // References template in equipment.json
  name: string;
  slot: 'Weapon' | 'Helmet' | 'Armor' | 'Boots' | 'Ring' | 'Amulet';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  level: number; // 1 to 100 upgrade level
  tier: number; // 0 to 5 Star Ascension tier
  setName: string;
  equippedHeroId?: string | null; // Hero name or ID
}

export interface EquipStatBonuses {
  attack: number;
  defense: number;
  health: number;
}

export interface EquipTroopBonuses {
  infantryAttack: number;
  infantryDefense: number;
  infantryHealth: number;
  cavalryAttack: number;
  cavalryDefense: number;
  cavalryHealth: number;
  marksmenAttack: number;
  marksmenDefense: number;
  marksmenHealth: number;
}

export interface EquipmentTemplate {
  id: string;
  name: string;
  slot: 'Weapon' | 'Helmet' | 'Armor' | 'Boots' | 'Ring' | 'Amulet';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  levelRequirement: number;
  statBonuses: EquipStatBonuses;
  troopBonuses: EquipTroopBonuses;
  setName: string;
  upgradeCost: {
    gold?: number;
    wood?: number;
    iron?: number;
    stone?: number;
  };
  description: string;
}

// Map database materials to details
export interface MaterialItem {
  name: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  description: string;
  emoji: string;
}

export const EQUIPMENT_MATERIALS: Record<string, MaterialItem> = {
  // Commons / Basic
  'Copper Wire': { name: 'Copper Wire', rarity: 'Common', description: 'Basic wiring used in standard trainee caps & boots.', emoji: '🔌' },
  'Obsidian Shard': { name: 'Obsidian Shard', rarity: 'Common', description: 'Sharp black fragments used for cheap weapon edgings.', emoji: '🪨' },
  
  // Rare Materials
  'Drake Scale': { name: 'Drake Scale', rarity: 'Rare', description: 'Fireproof overlapping plate scaled from drakes.', emoji: '🐲' },
  'Magma Heart': { name: 'Magma Heart', rarity: 'Rare', description: 'A warm core containing glowing subterranean power.', emoji: '❤️‍🔥' },
  'Spectral Steel': { name: 'Spectral Steel', rarity: 'Rare', description: 'Glows faintly, forged with high ectoplasm content.', emoji: '🥈' },
  'Prismatic Iron': { name: 'Prismatic Iron', rarity: 'Rare', description: 'Reflects rainbow light from its crystalline matrix.', emoji: '🔩' },
  
  // Epic Materials
  'Glacier Quartz': { name: 'Glacier Quartz', rarity: 'Epic', description: 'Chilled cryo crystal that never melts under pressure.', emoji: '❄️' },
  'Titanium Plate': { name: 'Titanium Plate', rarity: 'Epic', description: 'Extremely resilient heavy defense element plate.', emoji: '🛡️' },
  'Hydra Leather': { name: 'Hydra Leather', rarity: 'Epic', description: 'Elastic multi-layered hide that repairs its own scuffs.', emoji: '🦎' },
  'Acidic Bile': { name: 'Acidic Bile', rarity: 'Epic', description: 'Caustic fluid container of high alchemical potency.', emoji: '🧪' },
  'Charged Galvanic Plate': { name: 'Charged Galvanic Plate', rarity: 'Epic', description: 'Holds immense voltage from thunderstorm clouds.', emoji: '🔋' },
  'Voltaic Wire': { name: 'Voltaic Wire', rarity: 'Epic', description: 'Sparks when touched, carries electric current.', emoji: '⚡' },

  // Legendary Materials
  'Phoenix Feather': { name: 'Phoenix Feather', rarity: 'Legendary', description: 'Fiery gold plume of endless sparks and warmth.', emoji: '🪶' },
  'Sun Gold Ore': { name: 'Sun Gold Ore', rarity: 'Legendary', description: 'Glowing metal containing pure concentrated solar energy.', emoji: '☀️' },
  'Dread Steel': { name: 'Dread Steel', rarity: 'Legendary', description: 'Cursed alloy that saps the stamina of combatants.', emoji: '💀' },
  'Cursed Crest': { name: 'Cursed Crest', rarity: 'Legendary', description: 'Warded dark badge that instills absolute terror.', emoji: '🛡️' },
  'Core Fire Obsidian': { name: 'Core Fire Obsidian', rarity: 'Legendary', description: 'Molten-veined stone dug from doomsday rifts.', emoji: '🌋' },
  'Molten Ingot': { name: 'Molten Ingot', rarity: 'Legendary', description: 'Heavy volcanic bar glowing with white-hot metal heat.', emoji: '🧱' },
  'Solar Platinum': { name: 'Solar Platinum', rarity: 'Legendary', description: 'Pristine sovereign gold composite of highest value.', emoji: '✨' },
  'Phoenix Core Fabric': { name: 'Phoenix Core Fabric', rarity: 'Legendary', description: 'Shimmering flame-woven thread that grants rebirth.', emoji: '🧵' },
  'Dark Rift Fabric': { name: 'Dark Rift Fabric', rarity: 'Legendary', description: 'Absorbs ambient lighting, rendering actions quiet.', emoji: '🧥' },
  'Void Crystal': { name: 'Void Crystal', rarity: 'Legendary', description: 'Deep purple gemstone vibrating with celestial void humming.', emoji: '🔮' },

  // Mythic Materials (Raid Boss drops)
  'Chronos Sandglass': { name: 'Chronos Sandglass', rarity: 'Mythic', description: 'Alters temporal flows. S-Tier Mythic material.', emoji: '⏳' },
  'Overlord Plate Armor': { name: 'Overlord Plate Armor', rarity: 'Mythic', description: 'An indestructible plate fragment of total dominion.', emoji: '🧥' },
  'Mythic Ingot': { name: 'Mythic Ingot', rarity: 'Mythic', description: 'Divine celestial steel alloy found in core stars.', emoji: '🔱' },
  'Matriarch Dragon Eye': { name: 'Matriarch Dragon Eye', rarity: 'Mythic', description: 'Glowing draconian organ tracking cosmic weak points.', emoji: '👁️' },
  'Void Core Fabric': { name: 'Void Core Fabric', rarity: 'Mythic', description: 'Fabric extracted from black holes that nullifies blows.', emoji: '🌌' },
  'Black Diamond': { name: 'Black Diamond', rarity: 'Mythic', description: 'Ultra-hard carbon core that amplifies strike ratings.', emoji: '💎' },
  'Typhon Charged Core': { name: 'Typhon Charged Core', rarity: 'Mythic', description: 'Whirling vortex engine of extreme storm magic.', emoji: '🌀' },
  'Weaver Storm Fabric': { name: 'Weaver Storm Fabric', rarity: 'Mythic', description: 'Cords crafted of sky lightnings and cloud layers.', emoji: '🗺️' },
  'Prismatic Metal Shard': { name: 'Prismatic Metal Shard', rarity: 'Mythic', description: 'An infinitely shifting diamond shard of multi-elements.', emoji: '🌈' },
  'God-Slayer Fangs': { name: 'God-Slayer Fangs', rarity: 'Mythic', description: 'Crystalline fangs capable of bypassing cosmic defenses.', emoji: '🦷' },
  'Fenrir Chain Link': { name: 'Fenrir Chain Link', rarity: 'Mythic', description: 'Forged runic link that held the primordial wolf.', emoji: '⛓️' },
  'Titanium Core Block': { name: 'Titanium Core Block', rarity: 'Mythic', description: 'Indestructible block providing infinite armor stability.', emoji: '🧱' },
  'Wavecaller Heart': { name: 'Wavecaller Heart', rarity: 'Mythic', description: 'Envelops the user in oceanic shield forcefields.', emoji: '💙' },
  'Sovereign Pearl Crust': { name: 'Sovereign Pearl Crust', rarity: 'Mythic', description: 'Gilded nacre crust glowing with endless ocean depth.', emoji: '🦪' },
  'True Nether Ingot': { name: 'True Nether Ingot', rarity: 'Mythic', description: 'Indestructible dark substance of the core underworld.', emoji: '⬛' }
};

// Set Bonus configuration
export interface SetBonus {
  setName: string;
  bonus2: string;
  bonus4: string;
  bonus6: string;
}

export const SET_BONUSES_DATABASE: Record<string, SetBonus> = {
  "Recruit's Training": {
    setName: "Recruit's Training",
    bonus2: "+10% General Base Attack",
    bonus4: "+10% General Base Defense",
    bonus6: "+15% Extra Total Health",
  },
  "Vanguard Warden": {
    setName: "Vanguard Warden",
    bonus2: "+20% Infantry Total Attack",
    bonus4: "+25% Infantry Total Defense",
    bonus6: "Heavy Vanguard Shield: Revives 5% Infantry as wounded after battle instead of casualties."
  },
  "Wildwood Hunter": {
    setName: "Wildwood Hunter",
    bonus2: "+20% Marksmen Total Attack",
    bonus4: "+20% Damage vs Wilderness Wilderness Monsters",
    bonus6: "Eagle Sniping: +30% Marksmen Critical Hit Chance."
  },
  "Swiftwind Tempest": {
    setName: "Swiftwind Tempest",
    bonus2: "+25% General Marching speed",
    bonus4: "+20% Cavalry Total Attack",
    bonus6: "Tempest Blitz: +25% Cavalry Combat Impact Power."
  },
  "Glacial Bulwark": {
    setName: "Glacial Bulwark",
    bonus2: "+25% Infantry Defensive Protection",
    bonus4: "+25% General Army Base Health",
    bonus6: "Absolute Zero Frost: Automatically freezes 10% of attacking hostile forces during round 1."
  },
  "Solar Phoenix": {
    setName: "Solar Phoenix",
    bonus2: "+30% All Units Battle Attack",
    bonus4: "+30% All Units Battle Health",
    bonus6: "Celestial Rebirth: Instantly heals 10% of all combat wounded troops per hour passively."
  },
  "Doomsday Dreadlord": {
    setName: "Doomsday Dreadlord",
    bonus2: "+35% Critical strike Damage",
    bonus4: "Morale Sapper: Reduces defending enemy army defense rating by 15%",
    bonus6: "Dread Harvest: Life-steals 8% of damage inflicted to heal vanguard forces in real-time."
  },
  "Crownspire Eternal": {
    setName: "Crownspire Eternal",
    bonus2: "+45% General Armies Defense",
    bonus4: "+45% General Armies Health",
    bonus6: "Imperial Aegis: Blockades the first 2 enemy skills fired in any combat simulation."
  },
  "Abyssal Void": {
    setName: "Abyssal Void",
    bonus2: "+50% All Troops Combat Attack",
    bonus4: "+55% Ultimate strike damage multiplier",
    bonus6: "Warp Singularity: Entire legion ignores 22% of hostile armor ratings throughout battle stages."
  }
};

// ----------------- PHYSICS & MATHEMATICAL SCALING ENGINE -----------------

/**
 * Returns scaling factor for Base Stats (Attack, Defense, Health) which scale 1-100.
 * At level 1, returns 1.0. At level 100, returns 11.0 (Approx +10% linear increase per level)
 */
export function getLevelStatMultiplier(level: number): number {
  return 1 + 0.10 * (level - 1);
}

/**
 * Returns scaling factor for Troop Bonuses (e.g. 0.0015 -> 0.15%).
 * At level 1, returns 1.0. At level 100, returns 6.0 (+5% linear increase per level)
 */
export function getLevelTroopBonusMultiplier(level: number): number {
  return 1 + 0.05 * (level - 1);
}

/**
 * Returns scaling factor for Ascension Star Tiers (0 to 5)
 * Tier 0 = 1.0
 * Tier 1 (1 Star) = 1.25
 * Tier 2 (2 Stars) = 1.60
 * Tier 3 (3 Stars) = 2.10
 * Tier 4 (4 Stars) = 2.80
 * Tier 5 (5 Stars) = 3.80
 */
export function getStarTierMultiplier(tier: number): number {
  switch (tier) {
    case 1: return 1.25;
    case 2: return 1.60;
    case 3: return 2.10;
    case 4: return 2.80;
    case 5: return 3.80;
    default: return 1.0;
  }
}

/**
 * Calculates completely scaled active attributes of an equipment piece 
 */
export function calculateItemStats(
  template: EquipmentTemplate, 
  level: number, 
  tier: number
) {
  const statMult = getLevelStatMultiplier(level) * getStarTierMultiplier(tier);
  const troopMult = getLevelTroopBonusMultiplier(level) * getStarTierMultiplier(tier);

  return {
    statBonuses: {
      attack: Math.round(template.statBonuses.attack * statMult),
      defense: Math.round(template.statBonuses.defense * statMult),
      health: Math.round(template.statBonuses.health * statMult),
    },
    troopBonuses: {
      infantryAttack: template.troopBonuses.infantryAttack * troopMult,
      infantryDefense: template.troopBonuses.infantryDefense * troopMult,
      infantryHealth: template.troopBonuses.infantryHealth * troopMult,
      cavalryAttack: template.troopBonuses.cavalryAttack * troopMult,
      cavalryDefense: template.troopBonuses.cavalryDefense * troopMult,
      cavalryHealth: template.troopBonuses.cavalryHealth * troopMult,
      marksmenAttack: template.troopBonuses.marksmenAttack * troopMult,
      marksmenDefense: template.troopBonuses.marksmenDefense * troopMult,
      marksmenHealth: template.troopBonuses.marksmenHealth * troopMult,
    }
  };
}

/**
 * Defines upgrading resource costs to progress from LEVEL -> LEVEL + 1
 */
export function getUpgradeCost(
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic', 
  level: number
) {
  // Wood represents "Gold/smelting costs" in the absence of absolute Gold.
  // Iron is the primary structural metal. Stone forms the grinding elements.
  let woodBase = 100;
  let ironBase = 15;
  let stoneBase = 20;

  switch (rarity) {
    case 'Common':
      woodBase = 120; ironBase = 12; stoneBase = 15; break;
    case 'Rare':
      woodBase = 450; ironBase = 50; stoneBase = 65; break;
    case 'Epic':
      woodBase = 1800; ironBase = 250; stoneBase = 320; break;
    case 'Legendary':
      woodBase = 8000; ironBase = 1200; stoneBase = 1600; break;
    case 'Mythic':
      woodBase = 40000; ironBase = 6000; stoneBase = 8000; break;
  }

  const factor = Math.pow(1.085, level - 1);
  return {
    wood: Math.round(woodBase * factor),
    iron: Math.round(ironBase * factor),
    stone: Math.round(stoneBase * factor),
  };
}

/**
 * Defines ascension requirements (Stars activation)
 */
export function getAscensionRequirements(
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic', 
  nextTier: number // 1 to 5
) {
  // Returns required level, resources, and specific materials
  let requiredMinLevel = 10;
  let ironNeeded = 500;
  let valorNeeded = 10;
  let requiredMaterialList: { name: string; count: number }[] = [];

  switch (nextTier) {
    case 1: // 1 Star
      requiredMinLevel = 15;
      ironNeeded = 1000;
      valorNeeded = 50;
      if (rarity === 'Common') {
        requiredMaterialList = [{ name: 'Copper Wire', count: 3 }];
      } else if (rarity === 'Rare') {
        requiredMaterialList = [{ name: 'Drake Scale', count: 4 }];
      } else {
        requiredMaterialList = [{ name: 'Prismatic Iron', count: 5 }];
      }
      break;

    case 2: // 2 Stars
      requiredMinLevel = 30;
      ironNeeded = 5000;
      valorNeeded = 250;
      if (rarity === 'Common') {
        requiredMaterialList = [{ name: 'Copper Wire', count: 10 }, { name: 'Obsidian Shard', count: 5 }];
      } else if (rarity === 'Rare') {
        requiredMaterialList = [{ name: 'Drake Scale', count: 10 }, { name: 'Magma Heart', count: 4 }];
      } else if (rarity === 'Epic') {
        requiredMaterialList = [{ name: 'Glacier Quartz', count: 8 }, { name: 'Titanium Plate', count: 4 }];
      } else {
        requiredMaterialList = [{ name: 'Obsidian Shard', count: 20 }, { name: 'Prismatic Iron', count: 12 }];
      }
      break;

    case 3: // 3 Stars
      requiredMinLevel = 50;
      ironNeeded = 20000;
      valorNeeded = 1000;
      if (rarity === 'Epic') {
        requiredMaterialList = [{ name: 'Glacier Quartz', count: 16 }, { name: 'Hydra Leather', count: 10 }];
      } else if (rarity === 'Legendary') {
        requiredMaterialList = [{ name: 'Phoenix Feather', count: 15 }, { name: 'Core Fire Obsidian', count: 8 }];
      } else if (rarity === 'Mythic') {
        requiredMaterialList = [{ name: 'Mythic Ingot', count: 10 }, { name: 'Chronos Sandglass', count: 3 }];
      } else {
        requiredMaterialList = [{ name: 'Drake Scale', count: 25 }, { name: 'Spectral Steel', count: 15 }];
      }
      break;

    case 4: // 4 Stars
      requiredMinLevel = 70;
      ironNeeded = 100000;
      valorNeeded = 5000;
      if (rarity === 'Legendary') {
        requiredMaterialList = [{ name: 'Phoenix Feather', count: 25 }, { name: 'Void Crystal', count: 12 }];
      } else if (rarity === 'Mythic') {
        requiredMaterialList = [{ name: 'Mythic Ingot', count: 25 }, { name: 'Black Diamond', count: 6 }];
      } else {
        requiredMaterialList = [{ name: 'Charged Galvanic Plate', count: 25 }, { name: 'Titanium Plate', count: 20 }];
      }
      break;

    case 5: // 5 Stars
      requiredMinLevel = 90;
      ironNeeded = 500000;
      valorNeeded = 25000;
      if (rarity === 'Legendary') {
        requiredMaterialList = [
          { name: 'Phoenix Feather', count: 40 }, 
          { name: 'Void Crystal', count: 24 },
          { name: 'Solar Platinum', count: 10 }
        ];
      } else if (rarity === 'Mythic') {
        requiredMaterialList = [
          { name: 'Mythic Ingot', count: 50 }, 
          { name: 'Chronos Sandglass', count: 12 }, 
          { name: 'Overlord Plate Armor', count: 10 }
        ];
      } else {
        requiredMaterialList = [
          { name: 'Titanium Plate', count: 50 },
          { name: 'Glacier Quartz', count: 50 }
        ];
      }
      break;
  }

  return {
    requiredLevel: requiredMinLevel,
    ironCost: ironNeeded,
    valorCost: valorNeeded,
    materials: requiredMaterialList
  };
}

/**
 * Defines forging costs to craft Level 1 version of an equipment piece
 */
export function getForgingRecipe(template: EquipmentTemplate) {
  let ironCost = 500;
  let stoneCost = 1000;
  let woodCost = 2500;
  let materials: { name: string; count: number }[] = [];

  const setName = template.setName;

  if (setName === "Recruit's Training") {
    ironCost = 300; stoneCost = 500; woodCost = 1000;
    materials = [{ name: 'Copper Wire', count: 2 }];
  } else if (setName === "Vanguard Warden") {
    ironCost = 1500; stoneCost = 2000; woodCost = 5000;
    materials = [{ name: 'Drake Scale', count: 4 }, { name: 'Copper Wire', count: 5 }];
  } else if (setName === "Wildwood Hunter") {
    ironCost = 3000; stoneCost = 4000; woodCost = 9000;
    materials = [{ name: 'Spectral Steel', count: 5 }, { name: 'Copper Wire', count: 8 }];
  } else if (setName === "Swiftwind Tempest") {
    ironCost = 8000; stoneCost = 10000; woodCost = 20000;
    materials = [{ name: 'Spectral Steel', count: 8 }, { name: 'Prismatic Iron', count: 4 }];
  } else if (setName === "Glacial Bulwark") {
    ironCost = 15000; stoneCost = 20000; woodCost = 40000;
    materials = [{ name: 'Glacier Quartz', count: 6 }, { name: 'Titanium Plate', count: 3 }];
  } else if (setName === "Solar Phoenix") {
    ironCost = 40000; stoneCost = 50000; woodCost = 100000;
    materials = [{ name: 'Phoenix Feather', count: 8 }, { name: 'Sun Gold Ore', count: 5 }];
  } else if (setName === "Doomsday Dreadlord") {
    ironCost = 90000; stoneCost = 120000; woodCost = 250000;
    materials = [{ name: 'Dread Steel', count: 10 }, { name: 'Cursed Crest', count: 4 }];
  } else if (setName === "Crownspire Eternal") {
    ironCost = 250000; stoneCost = 300000; woodCost = 600000;
    materials = [{ name: 'Mythic Ingot', count: 12 }, { name: 'Chronos Sandglass', count: 2 }];
  } else if (setName === "Abyssal Void") {
    ironCost = 800000; stoneCost = 1000000; woodCost = 2000000;
    materials = [{ name: 'Mythic Ingot', count: 20 }, { name: 'Matriarch Dragon Eye', count: 4 }];
  }

  return {
    woodCost,
    ironCost,
    stoneCost,
    materials
  };
}

/**
 * Evaluates currently equipped items for a specific Hero and compiles their active contribution stats, 
 * alongside set complete active bonuses (2pc, 4pc, 6pc)
 */
export function compileHeroEquipmentBonuses(
  equippedItems: UserEquipment[],
  templates: EquipmentTemplate[]
) {
  let attackFlat = 0;
  let defenseFlat = 0;
  let healthFlat = 0;

  // Percentage set bonuses accumulators
  let setCounts: Record<string, number> = {};

  const troopSum: EquipTroopBonuses = {
    infantryAttack: 0,
    infantryDefense: 0,
    infantryHealth: 0,
    cavalryAttack: 0,
    cavalryDefense: 0,
    cavalryHealth: 0,
    marksmenAttack: 0,
    marksmenDefense: 0,
    marksmenHealth: 0
  };

  // 1. Accumulate individual gear stats (Level + Star Tier amplified)
  for (const item of equippedItems) {
    const t = templates.find(tp => tp.id === item.baseId);
    if (!t) continue;

    // Track active set names count
    setCounts[t.setName] = (setCounts[t.setName] || 0) + 1;

    const scaled = calculateItemStats(t, item.level, item.tier);
    attackFlat += scaled.statBonuses.attack;
    defenseFlat += scaled.statBonuses.defense;
    healthFlat += scaled.statBonuses.health;

    // Sum up troop ratios
    troopSum.infantryAttack += scaled.troopBonuses.infantryAttack;
    troopSum.infantryDefense += scaled.troopBonuses.infantryDefense;
    troopSum.infantryHealth += scaled.troopBonuses.infantryHealth;
    troopSum.cavalryAttack += scaled.troopBonuses.cavalryAttack;
    troopSum.cavalryDefense += scaled.troopBonuses.cavalryDefense;
    troopSum.cavalryHealth += scaled.troopBonuses.cavalryHealth;
    troopSum.marksmenAttack += scaled.troopBonuses.marksmenAttack;
    troopSum.marksmenDefense += scaled.troopBonuses.marksmenDefense;
    troopSum.marksmenHealth += scaled.troopBonuses.marksmenHealth;
  }

  // 2. Identify and compile Set Bonuses triggered
  const activeSetEffects: { setName: string; pieces: number; text: string }[] = [];
  
  for (const [setName, count] of Object.entries(setCounts)) {
    const sBonusDef = SET_BONUSES_DATABASE[setName];
    if (!sBonusDef) continue;

    if (count >= 2) {
      activeSetEffects.push({ setName, pieces: 2, text: sBonusDef.bonus2 });
      // Apply numerical bonuses if detectable
      applyBonusString(sBonusDef.bonus2, troopSum, percent => {
        attackFlat += Math.round(attackFlat * percent);
      });
    }
    if (count >= 4) {
      activeSetEffects.push({ setName, pieces: 4, text: sBonusDef.bonus4 });
      applyBonusString(sBonusDef.bonus4, troopSum, percent => {
        defenseFlat += Math.round(defenseFlat * percent);
      });
    }
    if (count >= 6) {
      activeSetEffects.push({ setName, pieces: 6, text: sBonusDef.bonus6 });
      applyBonusString(sBonusDef.bonus6, troopSum, percent => {
        healthFlat += Math.round(healthFlat * percent);
      });
    }
  }

  return {
    attackFlat,
    defenseFlat,
    healthFlat,
    troopBonuses: troopSum,
    activeSetEffects
  };
}

/**
 * Micro helper parses bonus descriptions to apply multipliers on troop statistics
 */
function applyBonusString(bonusStr: string, sums: EquipTroopBonuses, genericPercentCb: (val: number) => void) {
  const clean = bonusStr.toLowerCase();
  
  // Try to parse percentage
  const match = clean.match(/\+(\d+)%/);
  if (!match) return;

  const pct = parseInt(match[1], 10) / 100;

  if (clean.includes('infantry')) {
    if (clean.includes('attack')) sums.infantryAttack += pct;
    if (clean.includes('defense')) sums.infantryDefense += pct;
  } else if (clean.includes('marksmen') || clean.includes('marksman')) {
    if (clean.includes('attack')) sums.marksmenAttack += pct;
    if (clean.includes('defense')) sums.marksmenDefense += pct;
  } else if (clean.includes('cavalry')) {
    if (clean.includes('attack')) sums.cavalryAttack += pct;
    if (clean.includes('defense')) sums.cavalryDefense += pct;
  } else {
    // General Base stat percentage multiplier
    genericPercentCb(pct);
  }
}

export const EQUIPMENT_TEMPLATES = EQUIPMENT_TEMPLATES_RAW as EquipmentTemplate[];

