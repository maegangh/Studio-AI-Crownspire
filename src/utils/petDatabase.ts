export type PetRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';

export interface PetTemplate {
  id: string;
  baseName: string;
  baseRarity: PetRarity;
  description: string;
  defaultAbility: {
    name: string;
    description: string;
    baseBuffValue: number; // e.g. 0.05 for 5% Infantry Attack
    scalingPerLevel: number; // e.g. 0.001 per level
  };
  secondaryAbility: {
    name: string;
    description: string;
    unlockedAtStars: number;
    baseBuffValue: number;
    scalingPerStar: number;
  };
  evolutionNames: string[]; // [Baby, Adult, Mythological]
  basePower: number;
  emoji: string;
}

export interface UserPet {
  id: string;
  baseId: string;
  name: string; // Dynamic based on evolution or custom naming
  level: number;
  stars: number; // 0 to 5
  evolution: number; // 0, 1, or 2
  shards: number;
  rarity: PetRarity;
  equippedHeroId?: string | null; // Accompanies this Hero
  expeditionId?: string | null; // Mission ID if deployed
  expeditionEndTime?: number | null; // Completion epoch ms
}

export interface PetExpedition {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  requiredPower: number;
  rewardFeed: number;
  rewardResources: {
    food: number;
    wood: number;
    stone: number;
    iron: number;
  };
  rewardShardsChance: number; // 0 to 1
  rewardShardsCount: number;
  allowedRarities?: PetRarity[];
  emoji: string;
}

export const PET_TEMPLATES: PetTemplate[] = [
  {
    id: 'pet_slime',
    baseName: 'Rocky Slime',
    baseRarity: 'Common',
    description: 'A cheerful bouncing silica blob that resonates with mountain earth and fortifications.',
    defaultAbility: {
      name: 'Earthen Resilience',
      description: 'Strengthens infantry defensive formations.',
      baseBuffValue: 0.03, // +3%
      scalingPerLevel: 0.001, // +0.1% per level
    },
    secondaryAbility: {
      name: 'Slate Scavenger',
      description: 'Increases raw Slate production rates across the base.',
      unlockedAtStars: 2,
      baseBuffValue: 0.10, // +10%
      scalingPerStar: 0.04, // +4% per star
    },
    evolutionNames: ['Rocky Slime', 'Ironbound Slime', 'Gravewood Shardking'],
    basePower: 30,
    emoji: '🟢',
  },
  {
    id: 'pet_drake',
    baseName: 'Ember Hatchling',
    baseRarity: 'Rare',
    description: 'A tiny dragonborn hatchling that breathes cinder sparks and fuels the vanguard.',
    defaultAbility: {
      name: 'Cinder Breath',
      description: 'Increases the attack pressure of infantry units.',
      baseBuffValue: 0.05, // +5%
      scalingPerLevel: 0.0015,
    },
    secondaryAbility: {
      name: 'Smelter Fury',
      description: 'Boosts structural Iron Ore smelting speed.',
      unlockedAtStars: 1,
      baseBuffValue: 0.08,
      scalingPerStar: 0.05,
    },
    evolutionNames: ['Ember Hatchling', 'Molten Drake', 'Hellfire Dragonlord'],
    basePower: 80,
    emoji: '🔥',
  },
  {
    id: 'pet_gryphon',
    baseName: 'Windshear Chick',
    baseRarity: 'Epic',
    description: 'A sharp-eyed featherborn hunter of alpine ridges, specializing in tactical speed.',
    defaultAbility: {
      name: 'Zephyr Wing',
      description: 'Enhances cavalry attack multipliers and general speed.',
      baseBuffValue: 0.07, // +7%
      scalingPerLevel: 0.002,
    },
    secondaryAbility: {
      name: 'Gale Barrage',
      description: 'Increases marksmen defense and range accuracy.',
      unlockedAtStars: 2,
      baseBuffValue: 0.06,
      scalingPerStar: 0.03,
    },
    evolutionNames: ['Windshear Chick', 'Zephyr Gryphon', 'Galestrike Skynaut'],
    basePower: 150,
    emoji: '🦅',
  },
  {
    id: 'pet_phoenix',
    baseName: 'Radiant Emberlet',
    baseRarity: 'Legendary',
    description: 'An immortal solar construct of the crown peaks, capable of stitching legion wounds on the run.',
    defaultAbility: {
      name: 'Rebirth Aura',
      description: 'Provides global health buffers to all class-types.',
      baseBuffValue: 0.10, // +10%
      scalingPerLevel: 0.0025,
    },
    secondaryAbility: {
      name: 'Solar Cresting',
      description: 'Boosts building construction speed across all sectors.',
      unlockedAtStars: 1,
      baseBuffValue: 0.12,
      scalingPerStar: 0.06,
    },
    evolutionNames: ['Radiant Emberlet', 'Radiator Phoenix', 'Astraea Sunbringer'],
    basePower: 300,
    emoji: '🐦',
  },
  {
    id: 'pet_wolf',
    baseName: 'Dire Puppy',
    baseRarity: 'Rare',
    description: 'A ferocious wildwood whelp whose pack-howling rallies military divisions.',
    defaultAbility: {
      name: 'Pack Frenzy',
      description: 'Strengthens marksmen attack pressure.',
      baseBuffValue: 0.04, // +4%
      scalingPerLevel: 0.0012,
    },
    secondaryAbility: {
      name: 'Scavenging Pack',
      description: 'Increases Wood gathering yields on the global map.',
      unlockedAtStars: 3,
      baseBuffValue: 0.10,
      scalingPerStar: 0.04,
    },
    evolutionNames: ['Dire Puppy', 'Shadowfang Hunter', 'Sovereign Fenrir'],
    basePower: 75,
    emoji: '🐺',
  },
  {
    id: 'pet_void',
    baseName: 'Rift Larva',
    baseRarity: 'Legendary',
    description: 'An eldritch anomaly retrieved from deep spatial fractures. Eats void dust, breathes shadows.',
    defaultAbility: {
      name: 'Void Gaze',
      description: 'Increases total critical strike chance and general troop attack.',
      baseBuffValue: 0.12, // +12%
      scalingPerLevel: 0.003,
    },
    secondaryAbility: {
      name: 'Interstellar Bounty',
      description: 'Boosts drop rate margins during Campaign sweeps and maps monster hunts.',
      unlockedAtStars: 2,
      baseBuffValue: 0.15,
      scalingPerStar: 0.05,
    },
    evolutionNames: ['Rift Larva', 'Cosmic Stalker', 'Abyssal Void-Eater'],
    basePower: 350,
    emoji: '🟣',
  },
];

export const EXPEDITIONS_DATABASE: PetExpedition[] = [
  {
    id: 'exp_gravewood',
    name: 'Gravewood Outpost Patrol',
    description: 'Scout the dense timber borderlands for skeletal ruins and gathering fallen acorns.',
    durationMinutes: 5,
    requiredPower: 50,
    rewardFeed: 45,
    rewardResources: { food: 500, wood: 800, stone: 0, iron: 0 },
    rewardShardsChance: 0.50,
    rewardShardsCount: 3,
    emoji: '🌲',
  },
  {
    id: 'exp_quarry',
    name: 'Slate Mine Excavation',
    description: 'Deconstruct unstable tunnels in search of dense ores and deep crystals.',
    durationMinutes: 15,
    requiredPower: 120,
    rewardFeed: 120,
    rewardResources: { food: 800, wood: 0, stone: 1500, iron: 400 },
    rewardShardsChance: 0.65,
    rewardShardsCount: 5,
    emoji: '⛏️',
  },
  {
    id: 'exp_volcanic',
    name: 'Sulfuric Vent Expedition',
    description: 'Send heat-insulated companions deep into active magna veins to obtain fire core crystals.',
    durationMinutes: 45,
    requiredPower: 250,
    rewardFeed: 300,
    rewardResources: { food: 1200, wood: 600, stone: 800, iron: 2000 },
    rewardShardsChance: 0.75,
    rewardShardsCount: 8,
    emoji: '🌋',
  },
  {
    id: 'exp_skyland',
    name: 'Cloudpiercing Temple Raid',
    description: 'Scale the mystical crown mountains, plundering an ancient astronomical sanctuary.',
    durationMinutes: 120,
    requiredPower: 500,
    rewardFeed: 800,
    rewardResources: { food: 4000, wood: 4000, stone: 4000, iron: 3000 },
    rewardShardsChance: 0.90,
    rewardShardsCount: 15,
    emoji: '🏰',
  },
];

// --- STATS & LOGIC ENGINES ---

/**
 * Calculates current active power and buffs provided by a specific pet instance
 */
export function calculatePetPower(pet: UserPet, template?: PetTemplate): number {
  const t = template || PET_TEMPLATES.find(tp => tp.id === pet.baseId);
  if (!t) return 0;

  // Base power
  let power = t.basePower;

  // Level multiplier
  power += pet.level * 10;

  // Rarity modifier multiplier
  const rarityMults: Record<PetRarity, number> = {
    'Common': 1.0,
    'Rare': 1.25,
    'Epic': 1.6,
    'Legendary': 2.2,
    'Mythic': 3.5
  };
  const rMult = rarityMults[pet.rarity];

  // Stars add a flat boost + multiplicative scalar
  const starPct = 1 + (pet.stars * 0.15);

  // Evolution multiplies base
  const evoMult = 1 + (pet.evolution * 0.40);

  return Math.round(power * rMult * starPct * evoMult);
}

/**
 * Compiles custom pet abilities into numerical attributes
 */
export function compilePetAbilityStats(pet: UserPet, template?: PetTemplate) {
  const t = template || PET_TEMPLATES.find(tp => tp.id === pet.baseId);
  if (!t) {
    return {
      primaryValue: 0,
      secondaryValue: 0,
      primaryText: '',
      secondaryText: '',
    };
  }

  // Primary Ability scaling: base + (level * scaling)
  const primaryValue = t.defaultAbility.baseBuffValue + (pet.level * t.defaultAbility.scalingPerLevel);
  const primaryText = `${t.defaultAbility.name}: ${t.defaultAbility.description} (+${(primaryValue * 100).toFixed(1)}%)`;

  // Secondary Ability locked check
  let secondaryValue = 0;
  let secondaryText = '';

  if (pet.stars >= t.secondaryAbility.unlockedAtStars) {
    secondaryValue = t.secondaryAbility.baseBuffValue + (pet.stars * t.secondaryAbility.scalingPerStar);
    secondaryText = `${t.secondaryAbility.name}: ${t.secondaryAbility.description} (+${(secondaryValue * 100).toFixed(1)}%)`;
  } else {
    secondaryText = `🔒 Locked! Unlocks at ★${t.secondaryAbility.unlockedAtStars}. (${t.secondaryAbility.name})`;
  }

  return {
    primaryValue,
    secondaryValue,
    primaryText,
    secondaryText,
  };
}

/**
 * Upgrade Cost Calculator
 */
export function getPetUpgradeCost(pet: UserPet) {
  // Feed cost increases quadratically
  const feedCost = Math.round(15 + Math.pow(pet.level, 1.65) * 4);
  // Gold (Food) cost
  const foodCost = Math.round(50 + Math.pow(pet.level, 1.8) * 8);

  return { feedCost, foodCost };
}

/**
 * Star ascension Cost Calculator
 */
export function getPetStarCost(pet: UserPet) {
  const neededShards = [10, 25, 60, 150, 400][Math.min(pet.stars, 4)];
  // Valor points or Gold cost
  const valorCost = [150, 500, 1500, 4000, 12000][Math.min(pet.stars, 4)];

  return { neededShards, valorCost };
}

/**
 * Evolution Trigger details
 */
export interface EvolutionRequirement {
  requiredLevel: number;
  requiredStars: number;
  valorCost: number;
  ironCost: number;
  desc: string;
}

export function getPetEvolutionRequirement(pet: UserPet): EvolutionRequirement | null {
  if (pet.evolution >= 2) return null; // Fully evolved

  if (pet.evolution === 0) {
    return {
      requiredLevel: 25,
      requiredStars: 2,
      valorCost: 1500,
      ironCost: 5000,
      desc: 'Ascends this pet to Adult form. Unlocks higher level cap and rare visual shifts.',
    };
  } else {
    return {
      requiredLevel: 50,
      requiredStars: 4,
      valorCost: 8000,
      ironCost: 25000,
      desc: 'Magnifies this pet to Cosmic Mythological tier. Drastically scales stats & power curves.',
    };
  }
}

/**
 * Helper to update dynamic rarity bounds as a pet evolves.
 * Leveling common -> Rare -> Epic is represented beautifully.
 */
export function getEvolvedRarity(baseRarity: PetRarity, targetEvolution: number): PetRarity {
  const raritiesOrder: PetRarity[] = ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic'];
  const baseIdx = raritiesOrder.indexOf(baseRarity);
  const nextIdx = Math.min(baseIdx + targetEvolution, raritiesOrder.length - 1);
  return raritiesOrder[nextIdx];
}

/**
 * Calculates compiled global army and production buffs from the general pet list.
 * Can be used dynamically by the combat engines and production collectors!
 */
export function compileActivePetBonuses(
  userPets: UserPet[], 
  fieldedHeroNames: string[] = [] // Optional heroes deployed
) {
  let infantryAttackBonus = 0;
  let infantryDefenseBonus = 0;
  let marksmenAttackBonus = 0;
  let marksmenDefenseBonus = 0;
  let cavalryAttackBonus = 0;
  let cavalryDefenseBonus = 0;
  
  let productionStoneMultiplier = 0;
  let productionIronMultiplier = 0;
  let productionWoodMultiplier = 0;
  let speedConstructionMultiplier = 0;
  let bonusLootMultiplier = 0;

  userPets.forEach(pet => {
    // If the pet accompanies any of the active combat heroes, it triggers its power in full!
    // Or we provide a baseline portion (e.g., 40%) of passives even if the companion's hero isn't active on the march.
    const isHeroActive = pet.equippedHeroId ? fieldedHeroNames.includes(pet.equippedHeroId) : false;
    const efficiency = pet.equippedHeroId ? (isHeroActive ? 1.0 : 0.40) : 0.30; 
    // If not equipped on a hero but sitting in active sanctuary, gives a passive background 0.30 efficiency.

    const t = PET_TEMPLATES.find(tp => tp.id === pet.baseId);
    if (!t) return;

    const stats = compilePetAbilityStats(pet, t);

    // Primary abilities mappings
    if (t.id === 'pet_slime') {
      infantryDefenseBonus += stats.primaryValue * efficiency;
    } else if (t.id === 'pet_drake') {
      infantryAttackBonus += stats.primaryValue * efficiency;
    } else if (t.id === 'pet_gryphon') {
      cavalryAttackBonus += stats.primaryValue * efficiency;
    } else if (t.id === 'pet_phoenix') {
      // Global health
      infantryDefenseBonus += (stats.primaryValue * 0.5) * efficiency;
      marksmenDefenseBonus += (stats.primaryValue * 0.5) * efficiency;
      cavalryDefenseBonus += (stats.primaryValue * 0.5) * efficiency;
    } else if (t.id === 'pet_wolf') {
      marksmenAttackBonus += stats.primaryValue * efficiency;
    } else if (t.id === 'pet_void') {
      // Void Gaze: global attack boost & crit triggers
      infantryAttackBonus += (stats.primaryValue * 0.8) * efficiency;
      marksmenAttackBonus += (stats.primaryValue * 0.8) * efficiency;
      cavalryAttackBonus += (stats.primaryValue * 0.8) * efficiency;
    }

    // Secondary abilities mappings (when unlocked)
    if (pet.stars >= t.secondaryAbility.unlockedAtStars) {
      if (t.id === 'pet_slime') {
        productionStoneMultiplier += stats.secondaryValue;
      } else if (t.id === 'pet_drake') {
        productionIronMultiplier += stats.secondaryValue;
      } else if (t.id === 'pet_gryphon') {
        marksmenDefenseBonus += stats.secondaryValue * efficiency;
      } else if (t.id === 'pet_phoenix') {
        speedConstructionMultiplier += stats.secondaryValue;
      } else if (t.id === 'pet_wolf') {
        productionWoodMultiplier += stats.secondaryValue;
      } else if (t.id === 'pet_void') {
        bonusLootMultiplier += stats.secondaryValue;
      }
    }
  });

  return {
    infantryAttack: infantryAttackBonus,
    infantryDefense: infantryDefenseBonus,
    marksmenAttack: marksmenAttackBonus,
    marksmenDefense: marksmenDefenseBonus,
    cavalryAttack: cavalryAttackBonus,
    cavalryDefense: cavalryDefenseBonus,
    stoneProduceBonus: productionStoneMultiplier,
    ironProduceBonus: productionIronMultiplier,
    woodProduceBonus: productionWoodMultiplier,
    constructionSpeedBonus: speedConstructionMultiplier,
    bonusLootChance: bonusLootMultiplier,
  };
}
