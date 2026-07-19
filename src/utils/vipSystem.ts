// Crownspire Sovereign VIP System Progression Engine
// Provides levels, rewards, benefits, and local state integrations.

export interface VipReward {
  food?: number;
  wood?: number;
  stone?: number;
  iron?: number;
  valor?: number;
  items?: string[];
}

export interface VipLevelConfig {
  level: number;
  requiredXp: number;
  benefits: string[];
  benefitsMultiplier: {
    productionBonus?: number; // e.g., 0.05 for +5%
    trainingBonus?: number;   // e.g., 0.02 for +2%
    marchBonus?: number;      // e.g., 0.05 for +5%
    militaryBonus?: number;   // e.g., 0.05 for +5%
  };
  oneTimeReward: VipReward;
  dailyChest: VipReward;
}

export const VIP_LEVELS_CONFIG: VipLevelConfig[] = [
  {
    level: 1,
    requiredXp: 0,
    benefits: [
      "🪵 +5% Wood/Timber Production",
      "⚡ +2% Training Speed bonus",
      "🌾 +5% Food/Wheat Production"
    ],
    benefitsMultiplier: {
      productionBonus: 0.05,
      trainingBonus: 0.02,
      marchBonus: 0.0,
      militaryBonus: 0.0
    },
    oneTimeReward: { wood: 2000, food: 2000, valor: 100 },
    dailyChest: { wood: 500, food: 500, valor: 20 }
  },
  {
    level: 2,
    requiredXp: 200,
    benefits: [
      "🪨 +5% Stone/Quarry Production",
      "⚡ +4% Training Speed bonus",
      "🌾 +8% Food/Wheat Production"
    ],
    benefitsMultiplier: {
      productionBonus: 0.08,
      trainingBonus: 0.04,
      marchBonus: 0.0,
      militaryBonus: 0.0
    },
    oneTimeReward: { stone: 3500, food: 3000, valor: 150 },
    dailyChest: { stone: 800, food: 600, valor: 30 }
  },
  {
    level: 3,
    requiredXp: 800,
    benefits: [
      "🔩 +5% Iron/Ingots Production",
      "⚡ +6% Training Speed bonus",
      "🚀 +5% Marching Speed"
    ],
    benefitsMultiplier: {
      productionBonus: 0.10,
      trainingBonus: 0.06,
      marchBonus: 0.05,
      militaryBonus: 0.0
    },
    oneTimeReward: { iron: 4000, wood: 4000, valor: 250 },
    dailyChest: { iron: 1000, wood: 1000, valor: 45 }
  },
  {
    level: 4,
    requiredXp: 2000,
    benefits: [
      "🪵 +10% Wood/Timber Production",
      "🪨 +10% Stone/Quarry Production",
      "⚔️ +3% Total Troop Attack & Defense"
    ],
    benefitsMultiplier: {
      productionBonus: 0.12,
      trainingBonus: 0.08,
      marchBonus: 0.05,
      militaryBonus: 0.03
    },
    oneTimeReward: { wood: 8000, stone: 8000, valor: 400 },
    dailyChest: { wood: 1500, stone: 1500, valor: 60 }
  },
  {
    level: 5,
    requiredXp: 5000,
    benefits: [
      "🔩 +10% Iron/Ingots Production",
      "⚡ +10% Training Speed bonus",
      "🚀 +10% Marching Speed"
    ],
    benefitsMultiplier: {
      productionBonus: 0.15,
      trainingBonus: 0.10,
      marchBonus: 0.10,
      militaryBonus: 0.05
    },
    oneTimeReward: { iron: 12000, valor: 600 },
    dailyChest: { iron: 2500, valor: 85 }
  },
  {
    level: 6,
    requiredXp: 12000,
    benefits: [
      "💎 +15% All Resource Production Rates",
      "⚔️ +5% Total Troop Attack & Defense",
      "🏥 +10% Hospital Capacity"
    ],
    benefitsMultiplier: {
      productionBonus: 0.18,
      trainingBonus: 0.12,
      marchBonus: 0.10,
      militaryBonus: 0.06
    },
    oneTimeReward: { food: 15000, wood: 15000, stone: 15000, valor: 1000 },
    dailyChest: { food: 3000, wood: 3000, stone: 3000, valor: 120 }
  },
  {
    level: 7,
    requiredXp: 25000,
    benefits: [
      "💎 +20% All Resource Production Rates",
      "⚡ +12% Training Speed bonus",
      "⚔️ +8% Total Troop Attack & Defense"
    ],
    benefitsMultiplier: {
      productionBonus: 0.22,
      trainingBonus: 0.15,
      marchBonus: 0.12,
      militaryBonus: 0.08
    },
    oneTimeReward: { wood: 25000, stone: 25000, iron: 10000, valor: 1500 },
    dailyChest: { wood: 4500, stone: 4500, iron: 2000, valor: 180 }
  },
  {
    level: 8,
    requiredXp: 50000,
    benefits: [
      "🚀 +15% Marching Speed bonus",
      "⚔️ +10% Total Troop Attack & Defense",
      "🌾 +25% Food Production Rate"
    ],
    benefitsMultiplier: {
      productionBonus: 0.25,
      trainingBonus: 0.18,
      marchBonus: 0.15,
      militaryBonus: 0.10
    },
    oneTimeReward: { food: 50000, iron: 20000, valor: 2200 },
    dailyChest: { food: 8000, iron: 4000, valor: 250 }
  },
  {
    level: 9,
    requiredXp: 95000,
    benefits: [
      "💎 +30% All Resource Production Rates",
      "⚡ +20% Training Speed bonus",
      "⚔️ +12% Total Troop Attack & Defense"
    ],
    benefitsMultiplier: {
      productionBonus: 0.30,
      trainingBonus: 0.20,
      marchBonus: 0.18,
      militaryBonus: 0.12
    },
    oneTimeReward: { food: 75000, wood: 75000, stone: 75000, iron: 35000, valor: 3500 },
    dailyChest: { food: 12000, wood: 12000, stone: 12000, iron: 6000, valor: 350 }
  },
  {
    level: 10,
    requiredXp: 160000,
    benefits: [
      "👑 +40% All Resource Production Rates",
      "⚡ +25% Training Speed bonus",
      "⚔️ +15% Total Troop Attack, Defense, & Health"
    ],
    benefitsMultiplier: {
      productionBonus: 0.40,
      trainingBonus: 0.25,
      marchBonus: 0.25,
      militaryBonus: 0.15
    },
    oneTimeReward: { food: 150000, wood: 150000, stone: 150000, iron: 80000, valor: 7500 },
    dailyChest: { food: 25000, wood: 25000, stone: 25000, iron: 15000, valor: 700 }
  }
];

export interface UserVipState {
  xp: number;
  level: number;
  claimedLevelRewards: number[]; // VIP levels where the one-time reward was claimed
  lastDailyClaimTimestamp: number; // timestamp
}

export function calculateVipLevel(xp: number): VipLevelConfig {
  let activeLevel = VIP_LEVELS_CONFIG[0];
  for (const config of VIP_LEVELS_CONFIG) {
    if (xp >= config.requiredXp) {
      activeLevel = config;
    } else {
      break;
    }
  }
  return activeLevel;
}

export function compileVipBonuses(xp: number) {
  const currentLevel = calculateVipLevel(xp);
  return currentLevel.benefitsMultiplier;
}

export function getXpProgress(xp: number): { currentXp: number; neededXp: number; percentage: number; isMaxLevel: boolean } {
  const currentLevel = calculateVipLevel(xp);
  const nextLevel = VIP_LEVELS_CONFIG.find(c => c.level === currentLevel.level + 1);

  if (!nextLevel) {
    return {
      currentXp: xp,
      neededXp: currentLevel.requiredXp,
      percentage: 100,
      isMaxLevel: true
    };
  }

  const levelBaseXp = currentLevel.requiredXp;
  const targetXp = nextLevel.requiredXp;
  const currentProgress = xp - levelBaseXp;
  const levelTotalNeeded = targetXp - levelBaseXp;
  const percentage = Math.min(100, Math.max(0, (currentProgress / levelTotalNeeded) * 100));

  return {
    currentXp: xp,
    neededXp: targetXp,
    percentage,
    isMaxLevel: false
  };
}

export const XP_PURCHASE_CONVERSION = {
  // Buy XP with Valor
  costs: [
    { xp: 100, valor: 50 },
    { xp: 500, valor: 220 },
    { xp: 1000, valor: 400 },
    { xp: 5000, valor: 1800 }
  ]
};
