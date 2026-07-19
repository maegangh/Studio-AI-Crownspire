/**
 * Crownspire Alliance System Framework
 *
 * This file implements the state interfaces, JSON-friendly structures,
 * static templates, and business logic checkers for the Alliance system.
 * It contains no UI code or multiplayer networking APIs as per directives.
 */

// --- ALLIANCE ROLES & PERMISSIONS ---

/**
 * Standard Alliance Role ratings from lowest (R1) to highest (R5).
 */
export enum AllianceRoleId {
  R1 = 'R1',
  R2 = 'R2',
  R3 = 'R3',
  R4 = 'R4',
  R5 = 'R5',
}

/**
 * Complete Permission mapping for Alliance operations.
 */
export interface AlliancePermissions {
  /** Permission to invite other players to join the alliance */
  invitations: boolean;
  /** Permission to kick lower-ranking members of the alliance */
  kicking: boolean;
  /** Permission to place strategic target mark indicators on the tactical map */
  markers: boolean;
  /** Permission to trigger speciale group gifts, claim crates, or manage distribution chests */
  gifts: boolean;
  /** Permission to spend guild capital to initiate next-level research node upgrades */
  research: boolean;
  /** Permission to construct, relocate, or repair alliance territory structures */
  fortressManagement: boolean;
  /** Permission to initiate co-op world raids or rally summons */
  eventScheduling: boolean;
}

/**
 * Descriptive model for an individual Alliance Role.
 */
export interface AllianceRole {
  id: AllianceRoleId;
  name: string;
  description: string;
  permissions: AlliancePermissions;
}

/**
 * The permanent canonical definition of Alliance Roles and their specific permissions.
 */
export const ALLIANCE_ROLES: { [key in AllianceRoleId]: AllianceRole } = {
  [AllianceRoleId.R1]: {
    id: AllianceRoleId.R1,
    name: 'Recruit',
    description: 'Freshly sworn sword. Can contribute to research and receive help, but holds no executive permissions.',
    permissions: {
      invitations: false,
      kicking: false,
      markers: false,
      gifts: true, // R1 players can claim alliance gifts, but not initiate special giveaways
      research: false, // Can contribute points, but cannot initiate the final level upgrade
      fortressManagement: false,
      eventScheduling: false,
    },
  },
  [AllianceRoleId.R2]: {
    id: AllianceRoleId.R2,
    name: 'Retainer',
    description: 'Trusted soldier of the guild. Permitted to claim standard event rewards and communicate in special councils.',
    permissions: {
      invitations: false,
      kicking: false,
      markers: false,
      gifts: true,
      research: false,
      fortressManagement: false,
      eventScheduling: false,
    },
  },
  [AllianceRoleId.R3]: {
    id: AllianceRoleId.R3,
    name: 'Vanguard',
    description: 'Seasoned battlefield commander. Granted authority to distribute maps or send invitation dispatches.',
    permissions: {
      invitations: true,
      kicking: false,
      markers: true, // Can set map target markers for hunts or rallies
      gifts: true,
      research: false,
      fortressManagement: false,
      eventScheduling: false,
    },
  },
  [AllianceRoleId.R4]: {
    id: AllianceRoleId.R4,
    name: 'Warlord',
    description: 'High officer of the Sovereign Keeps. Holds power to purge insubordinates, direct defense towers, and schedule raid timings.',
    permissions: {
      invitations: true,
      kicking: true, // Can kick R1, R2, and R3 members
      markers: true,
      gifts: true,
      research: true, // Can click 'Upgrade' when research point milestones are fulfilled
      fortressManagement: true, // Can place Towers or activate Fortress shields
      eventScheduling: true, // Can summon World Boss battles or coordinate time-window rallies
    },
  },
  [AllianceRoleId.R5]: {
    id: AllianceRoleId.R5,
    name: 'Lord Paramount',
    description: 'Absolute ruler of the Alliance Pact. Holds absolute executive veto powers on all territorial nodes.',
    permissions: {
      invitations: true,
      kicking: true,
      markers: true,
      gifts: true,
      research: true,
      fortressManagement: true,
      eventScheduling: true,
    },
  },
};

/**
 * Validates whether a specific role rank is authorized to perform a particular action.
 *
 * @param roleId The current role ID of the player
 * @param permission The specific permission string to test
 * @returns Boolean representing authorization status
 */
export function hasAlliancePermission(
  roleId: AllianceRoleId,
  permission: keyof AlliancePermissions
): boolean {
  const role = ALLIANCE_ROLES[roleId];
  if (!role) return false;
  return role.permissions[permission];
}


// --- ALLIANCE BUILDINGS ---

/**
 * Cost requirements for building or upgrading Alliance structures.
 */
export interface AllianceBuildingCost {
  allianceWood: number;
  allianceStone: number;
  allianceIron: number;
  minAllianceLevel: number;
}

/**
 * Level bonuses and progression data for an Alliance structure.
 */
export interface AllianceBuildingLevelData {
  level: number;
  upgradeCost: AllianceBuildingCost;
  constructionTimeSec: number;
  bonuses: {
    type: string;
    value: number;
    description: string;
  }[];
}

/**
 * General Blueprint of a corporate Alliance Building.
 */
export interface AllianceBuilding {
  id: 'alliance_fortress' | 'alliance_tower' | 'alliance_resource_center';
  name: string;
  description: string;
  maxLevel: number;
  levelProgression: { [level: number]: AllianceBuildingLevelData };
}

/**
 * Catalog database of ALL Alliance buildings, structural progression levels, and associated cost templates.
 */
export const ALLIANCE_BUILDINGS: { [key: string]: AllianceBuilding } = {
  alliance_fortress: {
    id: 'alliance_fortress',
    name: 'Alliance Fortress',
    description: 'The supreme command bastion of the coalition. Establishes the core bounds of your alliance territory.',
    maxLevel: 5,
    levelProgression: {
      1: {
        level: 1,
        upgradeCost: { allianceWood: 50000, allianceStone: 50000, allianceIron: 20000, minAllianceLevel: 1 },
        constructionTimeSec: 1800,
        bonuses: [
          { type: 'territory_radius', value: 15, description: 'Sovereign claim boundary extends to a 15-hex grid radius.' },
          { type: 'member_capacity', value: 50, description: 'Increases maximum member capacity limit to 50 lords.' },
        ],
      },
      2: {
        level: 2,
        upgradeCost: { allianceWood: 120000, allianceStone: 120000, allianceIron: 50000, minAllianceLevel: 2 },
        constructionTimeSec: 3600,
        bonuses: [
          { type: 'territory_radius', value: 20, description: 'Sovereign claim boundary extends to a 20-hex grid radius.' },
          { type: 'member_capacity', value: 60, description: 'Increases maximum member capacity limit to 60 lords.' },
          { type: 'fortress_defense_bonus', value: 10, description: 'All armies fighting inside territory receive +10% Defense.' },
        ],
      },
      3: {
        level: 3,
        upgradeCost: { allianceWood: 300000, allianceStone: 300000, allianceIron: 150000, minAllianceLevel: 3 },
        constructionTimeSec: 7200,
        bonuses: [
          { type: 'territory_radius', value: 25, description: 'Sovereign claim boundary extends to a 25-hex grid radius.' },
          { type: 'member_capacity', value: 70, description: 'Increases maximum member capacity limit to 70 lords.' },
          { type: 'fortress_defense_bonus', value: 15, description: 'All armies fighting inside territory receive +15% Defense.' },
        ],
      },
      4: {
        level: 4,
        upgradeCost: { allianceWood: 800000, allianceStone: 800000, allianceIron: 400000, minAllianceLevel: 4 },
        constructionTimeSec: 14400,
        bonuses: [
          { type: 'territory_radius', value: 30, description: 'Sovereign claim boundary extends to a 30-hex grid radius.' },
          { type: 'member_capacity', value: 80, description: 'Increases maximum member capacity limit to 80 lords.' },
          { type: 'fortress_defense_bonus', value: 20, description: 'All armies fighting inside territory receive +20% Defense.' },
          { type: 'reinforce_speed', value: 25, description: 'Speeds up reinforce march times to the Fortress by 25%.' },
        ],
      },
      5: {
        level: 5,
        upgradeCost: { allianceWood: 2000000, allianceStone: 2000000, allianceIron: 1000000, minAllianceLevel: 5 },
        constructionTimeSec: 28800,
        bonuses: [
          { type: 'territory_radius', value: 40, description: 'Sovereign claim boundary extends to a 40-hex grid radius.' },
          { type: 'member_capacity', value: 100, description: 'Increases maximum member capacity limit to 100 lords.' },
          { type: 'fortress_defense_bonus', value: 30, description: 'All armies fighting inside territory receive +30% Defense/Shield.' },
          { type: 'reinforce_speed', value: 50, description: 'Speeds up reinforce march times to the Fortress by 50%.' },
        ],
      },
    },
  },
  alliance_tower: {
    id: 'alliance_tower',
    name: 'Alliance Towers',
    description: 'Frontier outpost turrets that secure connecting nodes, extending sovereignty bounds along standard mineral borders.',
    maxLevel: 5,
    levelProgression: {
      1: {
        level: 1,
        upgradeCost: { allianceWood: 20000, allianceStone: 20000, allianceIron: 5000, minAllianceLevel: 1 },
        constructionTimeSec: 600,
        bonuses: [
          { type: 'max_towers', value: 5, description: 'Permits constructing up to 5 strategic sentinel towers on the grid.' },
          { type: 'tower_sight_range', value: 8, description: 'Unfurls fog of war over an 8-hex radius around active towers.' },
        ],
      },
      2: {
        level: 2,
        upgradeCost: { allianceWood: 50000, allianceStone: 50000, allianceIron: 15000, minAllianceLevel: 2 },
        constructionTimeSec: 1200,
        bonuses: [
          { type: 'max_towers', value: 8, description: 'Permits constructing up to 8 strategic sentinel towers.' },
          { type: 'tower_sight_range', value: 10, description: 'Unfurls fog of war over a 10-hex radius.' },
          { type: 'tower_arrow_damage', value: 5, description: 'Towers automatically strike rogue marching hostiles for 5% of their squad rating.' },
        ],
      },
      3: {
        level: 3,
        upgradeCost: { allianceWood: 120000, allianceStone: 120000, allianceIron: 40000, minAllianceLevel: 3 },
        constructionTimeSec: 2400,
        bonuses: [
          { type: 'max_towers', value: 12, description: 'Permits constructing up to 12 strategic sentinel towers.' },
          { type: 'tower_sight_range', value: 12, description: 'Unfurls fog of war over a 12-hex radius.' },
          { type: 'tower_arrow_damage', value: 10, description: 'Towers strike rogue marching hostiles for 10% of their squad rating.' },
        ],
      },
      4: {
        level: 4,
        upgradeCost: { allianceWood: 350000, allianceStone: 350000, allianceIron: 120000, minAllianceLevel: 4 },
        constructionTimeSec: 4800,
        bonuses: [
          { type: 'max_towers', value: 18, description: 'Permits constructing up to 18 strategic sentinel towers.' },
          { type: 'tower_sight_range', value: 14, description: 'Unfurls fog of war over a 14-hex radius.' },
          { type: 'tower_arrow_damage', value: 15, description: 'Towers strike rogue marching hostiles for 15% of their squad rating.' },
        ],
      },
      5: {
        level: 5,
        upgradeCost: { allianceWood: 1000000, allianceStone: 1000000, allianceIron: 350000, minAllianceLevel: 5 },
        constructionTimeSec: 9600,
        bonuses: [
          { type: 'max_towers', value: 25, description: 'Permits constructing up to 25 strategic sentinel towers.' },
          { type: 'tower_sight_range', value: 18, description: 'Unfurls fog of war over an 18-hex radius.' },
          { type: 'tower_arrow_damage', value: 25, description: 'Towers strike rogue marching hostiles for 25% of their squad rating.' },
        ],
      },
    },
  },
  alliance_resource_center: {
    id: 'alliance_resource_center',
    name: 'Alliance Resource Center',
    description: 'A colossal guild compound harvesting high-volume yields. Members can gather raw cargo here in complete safety from rival lords.',
    maxLevel: 5,
    levelProgression: {
      1: {
        level: 1,
        upgradeCost: { allianceWood: 35000, allianceStone: 35000, allianceIron: 10000, minAllianceLevel: 1 },
        constructionTimeSec: 1200,
        bonuses: [
          { type: 'gather_speed_safety', value: 10, description: 'Increases gathering efficiency inside the Center by +10%.' },
          { type: 'resource_capacity', value: 1000000, description: 'Stores up to 1,000,000 total reserve cargo units inside the nodes.' },
        ],
      },
      2: {
        level: 2,
        upgradeCost: { allianceWood: 80000, allianceStone: 80000, allianceIron: 25000, minAllianceLevel: 2 },
        constructionTimeSec: 2400,
        bonuses: [
          { type: 'gather_speed_safety', value: 15, description: 'Increases gathering efficiency inside the Center by +15%.' },
          { type: 'resource_capacity', value: 2500000, description: 'Stores up to 2,500,000 total reserve cargo units.' },
        ],
      },
      3: {
        level: 3,
        upgradeCost: { allianceWood: 200000, allianceStone: 200000, allianceIron: 75000, minAllianceLevel: 3 },
        constructionTimeSec: 4800,
        bonuses: [
          { type: 'gather_speed_safety', value: 20, description: 'Increases gathering efficiency inside the Center by +20%.' },
          { type: 'resource_capacity', value: 6000000, description: 'Stores up to 6,000,000 total reserve cargo units.' },
        ],
      },
      4: {
        level: 4,
        upgradeCost: { allianceWood: 500000, allianceStone: 500000, allianceIron: 200000, minAllianceLevel: 4 },
        constructionTimeSec: 9600,
        bonuses: [
          { type: 'gather_speed_safety', value: 30, description: 'Increases gathering efficiency inside the Center by +30%.' },
          { type: 'resource_capacity', value: 15000000, description: 'Stores up to 15,000,000 total reserve cargo units.' },
        ],
      },
      5: {
        level: 5,
        upgradeCost: { allianceWood: 1500000, allianceStone: 1500000, allianceIron: 600000, minAllianceLevel: 5 },
        constructionTimeSec: 19200,
        bonuses: [
          { type: 'gather_speed_safety', value: 50, description: 'Increases gathering efficiency inside the Center by +50%.' },
          { type: 'resource_capacity', value: 40000000, description: 'Stores up to 40,000,000 total reserve cargo units.' },
        ],
      },
    },
  },
};


// --- ALLIANCE RESEARCH ---

export interface AllianceResearchLevelDetail {
  level: number;
  pointsRequired: number; // accumulated via member daily contribution points
  bonusMultiplier: number; // e.g. 0.05 for 5%
}

export interface AllianceResearchNode {
  id: 'gathering_speed' | 'construction_help' | 'training_help' | 'rally_size' | 'alliance_resource_production';
  name: string;
  category: 'economy' | 'support' | 'military';
  description: string;
  maxLevel: number;
  levelProgression: { [level: number]: AllianceResearchLevelDetail };
  bonusDescriptionTemplate: string;
}

/**
 * Technical database mapping of the five requested unique Alliance Researches.
 */
export const ALLIANCE_RESEARCH_TREE: { [key: string]: AllianceResearchNode } = {
  gathering_speed: {
    id: 'gathering_speed',
    name: 'Harvesting Caravan',
    category: 'economy',
    description: 'Improves gathering wheels and pack mule training across world tiles.',
    maxLevel: 5,
    bonusDescriptionTemplate: 'Increases gather speed on standard resources by +{percent}%.',
    levelProgression: {
      1: { level: 1, pointsRequired: 1000, bonusMultiplier: 0.04 },
      2: { level: 2, pointsRequired: 3000, bonusMultiplier: 0.08 },
      3: { level: 3, pointsRequired: 8000, bonusMultiplier: 0.12 },
      4: { level: 4, pointsRequired: 20000, bonusMultiplier: 0.18 },
      5: { level: 5, pointsRequired: 50000, bonusMultiplier: 0.25 },
    },
  },
  construction_help: {
    id: 'construction_help',
    name: 'Sentry Logistics',
    category: 'support',
    description: 'Ensures construction helpers can shave off greater durations on castle upgrades.',
    maxLevel: 5,
    bonusDescriptionTemplate: 'Increases alliance help duration reduction on Construction by +{percent}%.',
    levelProgression: {
      1: { level: 1, pointsRequired: 1500, bonusMultiplier: 0.05 },
      2: { level: 2, pointsRequired: 4500, bonusMultiplier: 0.10 },
      3: { level: 3, pointsRequired: 12000, bonusMultiplier: 0.15 },
      4: { level: 4, pointsRequired: 30000, bonusMultiplier: 0.22 },
      5: { level: 5, pointsRequired: 75000, bonusMultiplier: 0.30 },
    },
  },
  training_help: {
    id: 'training_help',
    name: 'Drill Instructors',
    category: 'support',
    description: 'Enables quick guidance on drill routines when alliance members offer barracks speedups.',
    maxLevel: 5,
    bonusDescriptionTemplate: 'Increases alliance help duration reduction on Troop Training by +{percent}%.',
    levelProgression: {
      1: { level: 1, pointsRequired: 1500, bonusMultiplier: 0.05 },
      2: { level: 2, pointsRequired: 4500, bonusMultiplier: 0.10 },
      3: { level: 3, pointsRequired: 12000, bonusMultiplier: 0.15 },
      4: { level: 4, pointsRequired: 30000, bonusMultiplier: 0.22 },
      5: { level: 5, pointsRequired: 75000, bonusMultiplier: 0.30 },
    },
  },
  rally_size: {
    id: 'rally_size',
    name: 'Command Coordination',
    category: 'military',
    description: 'Forges tighter war council communication pathways to support immense co-op battle arrays.',
    maxLevel: 5,
    bonusDescriptionTemplate: 'Increases the maximum available combined march capacity of Alliance Rallies by +{percent}%.',
    levelProgression: {
      1: { level: 1, pointsRequired: 2500, bonusMultiplier: 0.10 },
      2: { level: 2, pointsRequired: 7500, bonusMultiplier: 0.20 },
      3: { level: 3, pointsRequired: 20000, bonusMultiplier: 0.30 },
      4: { level: 4, pointsRequired: 50000, bonusMultiplier: 0.45 },
      5: { level: 5, pointsRequired: 120000, bonusMultiplier: 0.60 },
    },
  },
  alliance_resource_production: {
    id: 'alliance_resource_production',
    name: 'State Guild Taxation',
    category: 'economy',
    description: 'Optimizes passive extraction mills that stream income vectors directly into the collective treasury.',
    maxLevel: 5,
    bonusDescriptionTemplate: 'Increases passive collection rates of all alliance resources inside territory nodes by +{percent}%.',
    levelProgression: {
      1: { level: 1, pointsRequired: 1200, bonusMultiplier: 0.05 },
      2: { level: 2, pointsRequired: 3600, bonusMultiplier: 0.10 },
      3: { level: 3, pointsRequired: 10000, bonusMultiplier: 0.15 },
      4: { level: 4, pointsRequired: 25000, bonusMultiplier: 0.20 },
      5: { level: 5, pointsRequired: 60000, bonusMultiplier: 0.30 },
    },
  },
};


// --- ALLIANCE GIFTS ---

/**
 * Type criteria of active gifts obtainable by members.
 */
export type AllianceGiftCategory = 'boss_gifts' | 'purchase_gifts' | 'event_gifts';

export interface AllianceGiftRewardTemplate {
  resourceType: 'food' | 'wood' | 'stone' | 'iron' | 'gold' | 'valor' | 'speedups';
  amount: number;
  guaranteed: boolean;
  dropChance: number; // 0 to 1
}

export interface AllianceGiftTemplate {
  id: AllianceGiftCategory;
  name: string;
  description: string;
  basePointsAwarded: number; // contribution towards Alliance Gift level
  rewards: AllianceGiftRewardTemplate[];
}

/**
 * Defined gift drop tables triggered by Boss vanquishing, purchases, or events.
 */
export const ALLIANCE_GIFTS_DATABASE: { [key in AllianceGiftCategory]: AllianceGiftTemplate } = {
  boss_gifts: {
    id: 'boss_gifts',
    name: 'Slayer\'s Reliquary Box',
    description: 'Triggered when a member successfully conquers a Wilderness Monster or World Boss.',
    basePointsAwarded: 150,
    rewards: [
      { resourceType: 'valor', amount: 350, guaranteed: true, dropChance: 1.0 },
      { resourceType: 'gold', amount: 5000, guaranteed: false, dropChance: 0.4 },
      { resourceType: 'speedups', amount: 15, guaranteed: false, dropChance: 0.5 }, // Minutes
    ],
  },
  purchase_gifts: {
    id: 'purchase_gifts',
    name: 'Emperor\'s Tribute chest',
    description: 'Triggered when a fellow alliance pack purchases key resource expansions in credit cycles.',
    basePointsAwarded: 500,
    rewards: [
      { resourceType: 'gold', amount: 12000, guaranteed: true, dropChance: 1.0 },
      { resourceType: 'iron', amount: 15000, guaranteed: true, dropChance: 1.0 },
      { resourceType: 'valor', amount: 600, guaranteed: false, dropChance: 0.6 },
    ],
  },
  event_gifts: {
    id: 'event_gifts',
    name: 'Sovereign Guild Triumph Box',
    description: 'Commissioned based on completing high-score milestones during scheduled Event campaigns.',
    basePointsAwarded: 250,
    rewards: [
      { resourceType: 'food', amount: 25000, guaranteed: true, dropChance: 1.0 },
      { resourceType: 'wood', amount: 25000, guaranteed: true, dropChance: 1.0 },
      { resourceType: 'stone', amount: 20000, guaranteed: true, dropChance: 1.0 },
      { resourceType: 'speedups', amount: 30, guaranteed: false, dropChance: 0.7 },
    ],
  },
};

/**
 * Represents an active, unclaimed gift entry inside an alliance.
 */
export interface ActiveAllianceGiftInstance {
  id: string; // unique instance identity
  category: AllianceGiftCategory;
  triggeredByPlayer: string;
  createdAt: number;
  expiresAt: number;
  isClaimed: boolean;
}


// --- ALLIANCE HELP SYSTEM ---

/**
 * Valid categorization types of alliance assistance requests.
 */
export type AllianceHelpCategory = 'construction_help' | 'research_help' | 'healing_help' | 'training_help';

export interface AllianceHelpParameters {
  id: AllianceHelpCategory;
  name: string;
  description: string;
  /** Reduction base duration per help click */
  reductionPercentPerClick: number; // e.g. 0.01 for 1% of total remaining time
  /** Minimum guaranteed seconds subtracted per click */
  minSecondsReduction: number;
  /** Maximum help limit clicks allowed on a single dispatch queue */
  maxHelpCapacity: number;
}

/**
 * Defined helper properties on assistance metrics.
 */
export const ALLIANCE_HELP_DATABASE: { [key in AllianceHelpCategory]: AllianceHelpParameters } = {
  construction_help: {
    id: 'construction_help',
    name: 'Construction Assistance',
    description: 'Shave durations off building raises or Sovereign level enhancements.',
    reductionPercentPerClick: 0.01, // 1% of total length
    minSecondsReduction: 60, // Minimum 1 minute
    maxHelpCapacity: 30,
  },
  research_help: {
    id: 'research_help',
    name: 'Sage Collaboration',
    description: 'Rally academy scribes to speed up critical military or economic research.',
    reductionPercentPerClick: 0.01,
    minSecondsReduction: 60,
    maxHelpCapacity: 30,
  },
  healing_help: {
    id: 'healing_help',
    name: 'Medical Aid Command',
    description: 'Speed up recovery indices inside the sovereign hospital structures.',
    reductionPercentPerClick: 0.015, // 1.5% of total recovery time
    minSecondsReduction: 45,
    maxHelpCapacity: 25,
  },
  training_help: {
    id: 'training_help',
    name: 'Recruitment Drill support',
    description: 'Assist in drafting bulk battalions, speeding up trainer guidelines.',
    reductionPercentPerClick: 0.008, // 0.8% of total training time
    minSecondsReduction: 30,
    maxHelpCapacity: 20,
  },
};

/**
 * Blueprint representing a living Help Request instance in the queue.
 */
export interface ActiveAllianceHelpRequest {
  id: string; // unique dispatch queue ID
  category: AllianceHelpCategory;
  requesterName: string;
  targetItemName: string; // e.g. "Castle Level 12"
  originalSecondsTotal: number;
  remainingSeconds: number;
  currentHelpClickCount: number;
  helpersWhoClicked: string[]; // List of helper player names to prevent double helping
  isFullyCompleted: boolean;
}


// --- DOMAIN FRAMEWORK COMPILER STRUCT ---

/**
 * Comprehensive central struct containing the living state of the entire Crownspire Alliance Session.
 * Useful for state parsing, JSON storage serializing, and state tracking.
 */
export interface CompleteAllianceSystemState {
  allianceId: string;
  allianceName: string;
  allianceLevel: number;
  allianceLeaderName: string;
  
  // Structures
  fortressLevel: number;
  towersBuiltCount: number;
  resourceCenterLevel: number;

  // Active Research Progress (current levels in state)
  researchLevels: {
    gathering_speed: number;
    construction_help: number;
    training_help: number;
    rally_size: number;
    alliance_resource_production: number;
  };
  
  // Accumulated research investment points for next level tracking
  researchPointsAccumulated: {
    gathering_speed: number;
    construction_help: number;
    training_help: number;
    rally_size: number;
    alliance_resource_production: number;
  };

  // Lists of active elements
  helpRequests: ActiveAllianceHelpRequest[];
  receivedGifts: ActiveAllianceGiftInstance[];
  
  // Combined alliance reserve treasury resources (used for upgrading Alliance Buildings)
  treasury: {
    allianceWood: number;
    allianceStone: number;
    allianceIron: number;
  };
}

/**
 * Instantiates a clean template of the complete alliance state structure.
 * Useful for restoring standard starts when a player joins or creates a guild.
 */
export function createDefaultAllianceSystemState(
  allianceId: string,
  allianceName: string,
  leaderName: string
): CompleteAllianceSystemState {
  return {
    allianceId,
    allianceName,
    allianceLevel: 1,
    allianceLeaderName: leaderName,
    fortressLevel: 1,
    towersBuiltCount: 0,
    resourceCenterLevel: 0,
    researchLevels: {
      gathering_speed: 0,
      construction_help: 0,
      training_help: 0,
      rally_size: 0,
      alliance_resource_production: 0,
    },
    researchPointsAccumulated: {
      gathering_speed: 0,
      construction_help: 0,
      training_help: 0,
      rally_size: 0,
      alliance_resource_production: 0,
    },
    helpRequests: [],
    receivedGifts: [],
    treasury: {
      allianceWood: 10000,
      allianceStone: 10000,
      allianceIron: 5000,
    },
  };
}


// --- BUSINESS LOGIC HELPERS ---

/**
 * Calculates the exact remaining duration after applying a series of click helps,
 * factoring in any active Alliance Research buffers.
 *
 * @param request The current active help request
 * @param assistanceResearchLevel The player's active alliance research level for support help
 * @returns Number representing updated remaining seconds
 */
export function calculateHelpReductionSeconds(
  request: ActiveAllianceHelpRequest,
  assistanceResearchLevel: number
): number {
  const config = ALLIANCE_HELP_DATABASE[request.category];
  if (!config) return 0;

  // Fetch the basic percent reduction per help click
  let basePercent = config.reductionPercentPerClick;
  
  // Apply research bonus multiplier if applicable
  const helpResearch = ALLIANCE_RESEARCH_TREE['construction_help']; // Or whichever matches
  if (helpResearch && assistanceResearchLevel > 0) {
    const detail = helpResearch.levelProgression[assistanceResearchLevel];
    if (detail) {
      basePercent *= (1.0 + detail.bonusMultiplier);
    }
  }

  // Calculate the reduction magnitude
  const percentageReduction = Math.round(request.originalSecondsTotal * basePercent);
  
  // Guarantee the minimum bounds is respected
  return Math.max(percentageReduction, config.minSecondsReduction);
}

/**
 * Triggers a claim click on a specific help request, returning updated metrics and time saved.
 */
export function processHelpClick(
  request: ActiveAllianceHelpRequest,
  helperPlayerName: string,
  researchLevel: number
): { request: ActiveAllianceHelpRequest; secondReductionOffsetCount: number } {
  // If request is completed, already maximum clicked, or already helped by this player, bypass
  const config = ALLIANCE_HELP_DATABASE[request.category];
  if (
    request.isFullyCompleted || 
    request.currentHelpClickCount >= config.maxHelpCapacity ||
    request.helpersWhoClicked.includes(helperPlayerName)
  ) {
    return { request, secondReductionOffsetCount: 0 };
  }

  const reduction = calculateHelpReductionSeconds(request, researchLevel);
  const nextRemaining = Math.max(0, request.remainingSeconds - reduction);
  const isNowCompleted = nextRemaining <= 0;

  const updatedRequest: ActiveAllianceHelpRequest = {
    ...request,
    remainingSeconds: nextRemaining,
    currentHelpClickCount: request.currentHelpClickCount + 1,
    helpersWhoClicked: [...request.helpersWhoClicked, helperPlayerName],
    isFullyCompleted: isNowCompleted || (request.currentHelpClickCount + 1 >= config.maxHelpCapacity),
  };

  return { request: updatedRequest, secondReductionOffsetCount: reduction };
}

/**
 * Generates claim rewards for a gift instance based on its drop chances.
 */
export function rollAllianceGiftClaim(category: AllianceGiftCategory): {
  itemsClaimed: { type: string; amount: number }[];
} {
  const template = ALLIANCE_GIFTS_DATABASE[category];
  if (!template) return { itemsClaimed: [] };

  const claims: { type: string; amount: number }[] = [];

  for (const reward of template.rewards) {
    if (reward.guaranteed) {
      claims.push({ type: reward.resourceType, amount: reward.amount });
    } else {
      const roll = Math.random();
      if (roll <= reward.dropChance) {
        claims.push({ type: reward.resourceType, amount: reward.amount });
      }
    }
  }

  return { itemsClaimed: claims };
}
