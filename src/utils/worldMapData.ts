/**
 * Crownspire World Map Data System
 *
 * This file implements the state interfaces, JSON-friendly structures,
 * canonical data databases, and helper business logic for the
 * multiplayer-ready world map system. 
 *
 * Includes complete declarations for:
 *   - Player Castle Nodes
 *   - Resource Nodes
 *   - Monster Nodes
 *   - Elite Monster Nodes
 *   - World Boss Nodes
 *   - Alliance Fortresses
 *   - Alliance Towers
 *   - Alliance Resource Centers
 *   - Kingdom Capitals
 *   - Temples
 *   - Portals
 *   - Crownmarks
 *   - Rally Targets
 *   - Gathering Tiles
 *
 * No UI or graphic assets are built within this file, adhering strictly to constraints.
 */

// --- WORLD MAP CORE TYPES & ENUMS ---

/**
 * All valid mapping object types within the Crownspire world boundaries.
 */
export type WorldMapObjectType =
  | 'player_castle'
  | 'resource_node'
  | 'monster_node'
  | 'elite_monster_node'
  | 'world_boss_node'
  | 'alliance_fortress'
  | 'alliance_tower'
  | 'alliance_resource_center'
  | 'kingdom_capital'
  | 'temple'
  | 'portal'
  | 'crownmark'
  | 'rally_target'
  | 'gathering_tile';

/**
 * Spatial coordinate pairs describing grid location indexes (e.g. 0 to 2000).
 */
export interface MapPosition {
  x: number;
  y: number;
}

/**
 * Describes cost thresholds and requirements to initiate a troop march to this element.
 */
export interface MarchRequirement {
  /** Energy/Stamina/Command points consumed to initiate the march */
  actionPointCost: number;
  /** Minimum required combined Army Combat Power needed to engage */
  minPowerRequired: number;
  /** Minimum required captain level on the March Hero commander */
  minHeroLevelRequired: number;
  /** Key tools or items required to unlock the march interaction (if any) */
  specialItemIdRequired?: string;
  /** Describes march specific flags: e.g. "scout_only", "rally_only", "gathering_gears" */
  travelTypeAllowed: 'normal' | 'scout_only' | 'rally_only' | 'all';
}

/**
 * Fog-of-war and alliance range visibility filters applied by client renderers.
 */
export interface VisibilityRules {
  /** If true, the Fog of War does not obscure this node, being visible at all zoom scopes */
  revealedByDefault: boolean;
  /** Radius around this node in grid points where the fog gets permanently illuminated */
  illuminationRadius: number;
  /** Minimum academy/sensor tower building level required to see the node details */
  minScoutTowerLevelRequired: number;
  /** If defined, only players inside this specific alliance can gather or pinpoint coordinates */
  allianceExclusivityId?: string;
}

/**
 * Resource payloads, material packages, and experience bonuses.
 */
export interface WorldMapRewardItem {
  type: 'food' | 'wood' | 'stone' | 'iron' | 'gold' | 'valor' | 'speed_up' | 'hero_shard' | 'guild_currency' | 'crafting_material';
  id?: string; // e.g. "t1_speedup", "dragon_scale"
  minAmount: number;
  maxAmount: number;
  guaranteed: boolean;
}

/**
 * Combat, gathering, or capture properties defining behavior upon troop ingress.
 */
export interface InteractionRuleSet {
  /** Can players siege, plunder, or conquer this target? */
  canAttack: boolean;
  /** Can multiple alliance slots rally against this coordinate simultaneously? */
  canRallyAgainst: boolean;
  /** Can units execute resource extraction and harvest cargo over time? */
  canGather: boolean;
  /** Can allied divisions reinforce this coordinate? */
  canReinforce: boolean;
  /** Description label detailing combat mechanics (e.g., "PVP Siege", "PVE Slaughter", "Guild Node capture") */
  interactionPhraseDescription: string;
}

/**
 * Standardized mapping model for any physical grid coordinate node in the kingdom.
 */
export interface WorldMapObject {
  /** High-value system identity code */
  id: string;
  /** Specific class index of the map object */
  type: WorldMapObjectType;
  /** Difficulty scale or tier rating (e.g. Level 1 Wheat Tile vs Level 5 Wheat Tile) */
  level: number;
  /** Location pair coordinates on the map grid */
  coordinates: MapPosition;
  /** Dimensional bounding footprint (e.g., "1x1", "2x2", "3x3", "4x4") */
  size: '1x1' | '2x2' | '3x3' | '4x4' | '6x6';
  /** Player ID of the ruling Castellan (if any) */
  ownerId?: string;
  /** Alliance tag or coalition key holding territory rights (if any) */
  allianceId?: string;
  /** Potential yields, plunders, and rewards lists */
  rewards: WorldMapRewardItem[];
  /** Standard elapsed timing in seconds before an empty node respawns anew */
  respawnTimeSec: number;
  /** Actionable behavioral rules */
  interactionRules: InteractionRuleSet;
  /** Ingress requirements checking march sizes and hero criteria */
  marchRequirement: MarchRequirement;
  /** Visual sensor boundaries */
  visibilityRules: VisibilityRules;
  /** Custom flavor text description describing the structural visual or entity */
  flavorDescription?: string;
}


// --- CANONICAL WORLD MAP NODE DATABASE (PRE-POPULATED MAP NODES) ---

/**
 * Complete set of pre-configured, JSON-friendly map objects representing Crownspire's geography.
 */
export const CROWNSPIRE_WORLD_MAP_OBJECTS: WorldMapObject[] = [
  // 1. Player Castles
  {
    id: 'castle_active_001',
    type: 'player_castle',
    level: 15,
    coordinates: { x: 1200, y: 1200 },
    size: '2x2',
    ownerId: 'player_user_01',
    allianceId: 'alliance_blood_oath',
    flavorDescription: 'Sovereign stronghold of the ruling Lord Castellan. Walls built of heavy granite blocks, reinforced with state level ballistas.',
    respawnTimeSec: 0, // Castle nodes do not randomly respawn on timers
    rewards: [
      { type: 'gold', minAmount: 1000, maxAmount: 5000, guaranteed: false },
      { type: 'food', minAmount: 5000, maxAmount: 25000, guaranteed: false },
    ],
    interactionRules: {
      canAttack: true,
      canRallyAgainst: true,
      canGather: false,
      canReinforce: true,
      interactionPhraseDescription: 'Launch an offensive raid or coordinate a massive rally to pillage stockpiles and force relocation.',
    },
    marchRequirement: {
      actionPointCost: 10,
      minPowerRequired: 5000,
      minHeroLevelRequired: 1,
      travelTypeAllowed: 'all',
    },
    visibilityRules: {
      revealedByDefault: false,
      illuminationRadius: 4,
      minScoutTowerLevelRequired: 1,
    },
  },
  {
    id: 'castle_competitor_002',
    type: 'player_castle',
    level: 12,
    coordinates: { x: 1450, y: 1100 },
    size: '2x2',
    ownerId: 'competitor_kyle_02',
    allianceId: 'alliance_sentry_garrison',
    flavorDescription: 'The fortified base camp of competition Warden Kyle. Hostile standards fly high.',
    respawnTimeSec: 0,
    rewards: [
      { type: 'stone', minAmount: 3000, maxAmount: 15000, guaranteed: false },
      { type: 'iron', minAmount: 1500, maxAmount: 7500, guaranteed: false },
    ],
    interactionRules: {
      canAttack: true,
      canRallyAgainst: true,
      canGather: false,
      canReinforce: false,
      interactionPhraseDescription: 'Attack competitor strongholds to gain massive valor resources.',
    },
    marchRequirement: {
      actionPointCost: 15,
      minPowerRequired: 15050,
      minHeroLevelRequired: 5,
      travelTypeAllowed: 'all',
    },
    visibilityRules: {
      revealedByDefault: false,
      illuminationRadius: 2,
      minScoutTowerLevelRequired: 1,
    },
  },

  // 2. Resource Nodes
  {
    id: 'resource_wood_l5',
    type: 'resource_node',
    level: 5,
    coordinates: { x: 850, y: 920 },
    size: '1x1',
    flavorDescription: 'Grand Crimson Sequoia Grove. Colossal ancient pine arrays that harvest wood with excellent efficiency multipliers.',
    respawnTimeSec: 1800,
    rewards: [
      { type: 'wood', minAmount: 150000, maxAmount: 150000, guaranteed: true },
      { type: 'speed_up', id: 'construction_speed_5m', minAmount: 1, maxAmount: 3, guaranteed: false },
    ],
    interactionRules: {
      canAttack: false,
      canRallyAgainst: false,
      canGather: true,
      canReinforce: false,
      interactionPhraseDescription: 'Send load-heavy baggage trains led by gatherer wood managers to harvest high efficiency lumber.',
    },
    marchRequirement: {
      actionPointCost: 5,
      minPowerRequired: 1000,
      minHeroLevelRequired: 1,
      travelTypeAllowed: 'normal',
    },
    visibilityRules: {
      revealedByDefault: true,
      illuminationRadius: 0,
      minScoutTowerLevelRequired: 1,
    },
  },
  {
    id: 'resource_iron_l3',
    type: 'resource_node',
    level: 3,
    coordinates: { x: 1900, y: 1540 },
    size: '1x1',
    flavorDescription: 'Basalt Obsidian Cavern. Plentiful iron vein structures holding heavy chunks of black magnetic ores.',
    respawnTimeSec: 1200,
    rewards: [
      { type: 'iron', minAmount: 60000, maxAmount: 60000, guaranteed: true },
    ],
    interactionRules: {
      canAttack: false,
      canRallyAgainst: false,
      canGather: true,
      canReinforce: false,
      interactionPhraseDescription: 'Deploy high durability miner corps to mine strategic iron resources.',
    },
    marchRequirement: {
      actionPointCost: 5,
      minPowerRequired: 2000,
      minHeroLevelRequired: 1,
      travelTypeAllowed: 'normal',
    },
    visibilityRules: {
      revealedByDefault: true,
      illuminationRadius: 0,
      minScoutTowerLevelRequired: 1,
    },
  },

  // 3. Monster Nodes
  {
    id: 'monster_hound_l12',
    type: 'monster_node',
    level: 12,
    coordinates: { x: 1020, y: 1150 },
    size: '1x1',
    flavorDescription: 'Vicious Shadowhound Stalker. A multi-headed rogue direwolf corrupted by deep underdark residual mana.',
    respawnTimeSec: 900,
    rewards: [
      { type: 'valor', minAmount: 120, maxAmount: 300, guaranteed: true },
      { type: 'food', minAmount: 2000, maxAmount: 10000, guaranteed: true },
      { type: 'hero_shard', id: 'shard_kyle', minAmount: 1, maxAmount: 1, guaranteed: false },
    ],
    interactionRules: {
      canAttack: true,
      canRallyAgainst: false,
      canGather: false,
      canReinforce: false,
      interactionPhraseDescription: 'Engage in swift tactical single-march PvE combat. Yields hero ascension materials on defeat.',
    },
    marchRequirement: {
      actionPointCost: 15,
      minPowerRequired: 8000,
      minHeroLevelRequired: 5,
      travelTypeAllowed: 'normal',
    },
    visibilityRules: {
      revealedByDefault: true,
      illuminationRadius: 1,
      minScoutTowerLevelRequired: 2,
    },
  },

  // 4. Elite Monster Nodes
  {
    id: 'monster_elite_basilisk_l30',
    type: 'elite_monster_node',
    level: 30,
    coordinates: { x: 600, y: 1650 },
    size: '2x2',
    flavorDescription: 'Gorgon Obsidian Basilisk. Petrifying scale serpent whose acid venom corrodes full iron plated cavalry squadrons instantly.',
    respawnTimeSec: 3600,
    rewards: [
      { type: 'valor', minAmount: 450, maxAmount: 1000, guaranteed: true },
      { type: 'guild_currency', minAmount: 100, maxAmount: 250, guaranteed: true },
      { type: 'crafting_material', id: 'basilisk_eye', minAmount: 1, maxAmount: 2, guaranteed: false },
    ],
    interactionRules: {
      canAttack: true,
      canRallyAgainst: true,
      canGather: false,
      canReinforce: false,
      interactionPhraseDescription: 'Elite threat level. Heavy troop casualties expected. Coordination of three-member rallies is highly recommended.',
    },
    marchRequirement: {
      actionPointCost: 20,
      minPowerRequired: 45000,
      minHeroLevelRequired: 15,
      travelTypeAllowed: 'all',
    },
    visibilityRules: {
      revealedByDefault: true,
      illuminationRadius: 2,
      minScoutTowerLevelRequired: 6,
    },
  },

  // 5. World Boss Nodes
  {
    id: 'boss_dragon_ignis',
    type: 'world_boss_node',
    level: 50,
    coordinates: { x: 1500, y: 1500 },
    size: '4x4',
    flavorDescription: 'Balefire Devastator Ignis. Prehistoric volcanic leviathan dragon whose breaths incinerate map districts entirely.',
    respawnTimeSec: 86400, // 24 Hours respawn
    rewards: [
      { type: 'valor', minAmount: 2500, maxAmount: 5000, guaranteed: true },
      { type: 'hero_shard', id: 'legendary_shard_crate', minAmount: 5, maxAmount: 15, guaranteed: true },
      { type: 'crafting_material', id: 'pure_balefire_scale', minAmount: 1, maxAmount: 3, guaranteed: true },
    ],
    interactionRules: {
      canAttack: false, // Normal single targets fail completely
      canRallyAgainst: true, // Requires monumental group mobilization
      canGather: false,
      canReinforce: false,
      interactionPhraseDescription: 'Co-op World Boss event. Must coordinate a maximum capacity rally squad with 4+ allied direct marshals.',
    },
    marchRequirement: {
      actionPointCost: 40,
      minPowerRequired: 250000,
      minHeroLevelRequired: 30,
      travelTypeAllowed: 'rally_only',
    },
    visibilityRules: {
      revealedByDefault: true,
      illuminationRadius: 6,
      minScoutTowerLevelRequired: 1,
    },
  },

  // 6. Alliance Fortresses
  {
    id: 'alliance_fortress_01',
    type: 'alliance_fortress',
    level: 2,
    coordinates: { x: 1150, y: 1150 },
    size: '3x3',
    allianceId: 'alliance_blood_oath',
    flavorDescription: 'Main Command Citadel of BLOOD OATH Guild. Commands safe sanctuary fields and defensive wall shield buffers for all neighboring members.',
    respawnTimeSec: 0,
    rewards: [
      { type: 'guild_currency', minAmount: 10, maxAmount: 10, guaranteed: true },
    ],
    interactionRules: {
      canAttack: true, // Enemy alliances can lay siege to destroy territorial influence
      canRallyAgainst: true,
      canGather: false,
      canReinforce: true, // Guild members can reinforce with massive defense columns
      interactionPhraseDescription: 'The tactical heart of alliance presence. Reinforce to defend guild sovereign borders.',
    },
    marchRequirement: {
      actionPointCost: 0,
      minPowerRequired: 5000,
      minHeroLevelRequired: 1,
      travelTypeAllowed: 'all',
    },
    visibilityRules: {
      revealedByDefault: true,
      illuminationRadius: 10, // Illuminates wide grids for all members
      minScoutTowerLevelRequired: 1,
    },
  },

  // 7. Alliance Towers
  {
    id: 'alliance_tower_104',
    type: 'alliance_tower',
    level: 1,
    coordinates: { x: 1090, y: 1150 },
    size: '1x1',
    allianceId: 'alliance_blood_oath',
    flavorDescription: 'Alliance Border Watch Tower. Protects regional wood collectors and fires automatic stone-weighted arrow bursts on roaming hostiles.',
    respawnTimeSec: 0,
    rewards: [],
    interactionRules: {
      canAttack: true,
      canRallyAgainst: false,
      canGather: false,
      canReinforce: true,
      interactionPhraseDescription: 'Sentinel towers expand territories. Relieve wounded guards to prevent tower collapse.',
    },
    marchRequirement: {
      actionPointCost: 0,
      minPowerRequired: 2000,
      minHeroLevelRequired: 1,
      travelTypeAllowed: 'all',
    },
    visibilityRules: {
      revealedByDefault: true,
      illuminationRadius: 5,
      minScoutTowerLevelRequired: 1,
    },
  },

  // 8. Alliance Resource Centers
  {
    id: 'alliance_vault_food',
    type: 'alliance_resource_center',
    level: 3,
    coordinates: { x: 1150, y: 1210 },
    size: '2x2',
    allianceId: 'alliance_blood_oath',
    flavorDescription: 'Gigantic Imperial Granary Project. Safe collection nodes streaming wheat loads in completely guard-protected territorial centers.',
    respawnTimeSec: 0,
    rewards: [
      { type: 'food', minAmount: 1200000, maxAmount: 1200000, guaranteed: true },
    ],
    interactionRules: {
      canAttack: false, // Cannot be plundered by rival forces
      canRallyAgainst: false,
      canGather: true, // Alliance members only
      canReinforce: false,
      interactionPhraseDescription: 'High storage safe zone. Alliance members gather huge amounts of food here without risk of competitive assault.',
    },
    marchRequirement: {
      actionPointCost: 0,
      minPowerRequired: 1000,
      minHeroLevelRequired: 1,
      travelTypeAllowed: 'normal',
    },
    visibilityRules: {
      revealedByDefault: true,
      illuminationRadius: 3,
      minAllianceLevelRequired: 2, // Requires proper coordination
    } as any,
  },

  // 9. Kingdom Capitals
  {
    id: 'kingdom_capital_center',
    type: 'kingdom_capital',
    level: 100,
    coordinates: { x: 1500, y: 1500 }, // Placed precisely at the absolute focal geographical coordinates
    size: '6x6',
    allianceId: 'alliance_blood_oath', // ruling guild holding King title
    flavorDescription: 'The Crownspire Throne Imperial Palace. Whichever Paramount Warden captures this colossal monolith appoints the Realm Sovereign King!',
    respawnTimeSec: 0,
    rewards: [
      { type: 'gold', minAmount: 25000, maxAmount: 100000, guaranteed: true },
      { type: 'valor', minAmount: 10000, maxAmount: 25000, guaranteed: true },
    ],
    interactionRules: {
      canAttack: true,
      canRallyAgainst: true,
      canGather: false,
      canReinforce: true,
      interactionPhraseDescription: 'The sovereign center of the entire server. Hold command over the core throne to secure tax margins over all kingdoms.',
    },
    marchRequirement: {
      actionPointCost: 50,
      minPowerRequired: 500000,
      minHeroLevelRequired: 40,
      travelTypeAllowed: 'rally_only', // Only accessible via massive high-level tactical coordination
    },
    visibilityRules: {
      revealedByDefault: true,
      illuminationRadius: 15, // Globally visible mapping element
      minScoutTowerLevelRequired: 1,
    },
  },

  // 10. Temples
  {
    id: 'ruin_temple_solaris',
    type: 'temple',
    level: 80,
    coordinates: { x: 1800, y: 800 },
    size: '3x3',
    flavorDescription: 'Mystic Cathedral of Solaris. Sun sanctuary which grants all ruling alliance members a permanent +10% Training Speed speed multiplier.',
    respawnTimeSec: 0,
    rewards: [
      { type: 'guild_currency', minAmount: 500, maxAmount: 1200, guaranteed: true },
      { type: 'valor', minAmount: 1500, maxAmount: 2500, guaranteed: true },
    ],
    interactionRules: {
      canAttack: true,
      canRallyAgainst: true,
      canGather: false,
      canReinforce: true,
      interactionPhraseDescription: 'Occupy the holy altar nodes to unlock permanent faction combat training buff enhancements across the server.',
    },
    marchRequirement: {
      actionPointCost: 35,
      minPowerRequired: 150000,
      minHeroLevelRequired: 25,
      travelTypeAllowed: 'all',
    },
    visibilityRules: {
      revealedByDefault: true,
      illuminationRadius: 8,
      minScoutTowerLevelRequired: 1,
    },
  },

  // 11. Portals
  {
    id: 'chaos_gate_portal_01',
    type: 'portal',
    level: 1,
    coordinates: { x: 800, y: 2200 },
    size: '2x2',
    flavorDescription: 'Abyssal Chaos Gate. Void vortex routing. Lords can pay gold tolls to teleport their entire Castles instantly across districts.',
    respawnTimeSec: 0,
    rewards: [],
    interactionRules: {
      canAttack: false,
      canRallyAgainst: false,
      canGather: false,
      canReinforce: false,
      interactionPhraseDescription: 'Pay magic crystal tolls or portal stones to blink march columns directly across map borders without march transit time.',
    },
    marchRequirement: {
      actionPointCost: 0,
      minPowerRequired: 0,
      minHeroLevelRequired: 1,
      travelTypeAllowed: 'normal',
    },
    visibilityRules: {
      revealedByDefault: true,
      illuminationRadius: 4,
      minScoutTowerLevelRequired: 1,
    },
  },

  // 12. Crownmarks
  {
    id: 'crownmark_excalibur_shard',
    type: 'crownmark',
    level: 40,
    coordinates: { x: 2300, y: 1100 },
    size: '1x1',
    flavorDescription: 'Unclaimed Imperial Runestone Monument. Holds ancient crownmarks which need slow, heavily protected channeling processes to excavate.',
    respawnTimeSec: 14400, // 4 hours respawn
    rewards: [
      { type: 'crafting_material', id: 'excalibur_hilt_shard', minAmount: 1, maxAmount: 1, guaranteed: true },
      { type: 'valor', minAmount: 800, maxAmount: 1500, guaranteed: true },
    ],
    interactionRules: {
      canAttack: true, // Rival lords can execute attack orders to wipe out the excavation squad
      canRallyAgainst: false,
      canGather: true, // Manifested as channels/gathers
      canReinforce: true,
      interactionPhraseDescription: 'Channel the runic altar energy to claim legendary weapons. Rival players will attempt to wipe your squads during harvesting.',
    },
    marchRequirement: {
      actionPointCost: 20,
      minPowerRequired: 30000,
      minHeroLevelRequired: 20,
      travelTypeAllowed: 'normal',
    },
    visibilityRules: {
      revealedByDefault: true,
      illuminationRadius: 3,
      minScoutTowerLevelRequired: 4,
    },
  },

  // 13. Rally Targets
  {
    id: 'rally_bandit_hive_l4',
    type: 'rally_target',
    level: 4,
    coordinates: { x: 1350, y: 1350 },
    size: '2x2',
    flavorDescription: 'Slayer Bandit Stronghold Haven. Master pirate fort housing tons of plundered merchant crates and gold cargo bags.',
    respawnTimeSec: 3600,
    rewards: [
      { type: 'gold', minAmount: 20000, maxAmount: 50000, guaranteed: true },
      { type: 'speed_up', id: 'training_speed_15m', minAmount: 2, maxAmount: 5, guaranteed: true },
      { type: 'guild_currency', minAmount: 50, maxAmount: 100, guaranteed: false },
    ],
    interactionRules: {
      canAttack: false, // Solitary attacks are bounced instantly of high fortress walls
      canRallyAgainst: true, // Mandatory coalition rally operation required
      canGather: false,
      canReinforce: false,
      interactionPhraseDescription: 'Sovereign bandit outposts require strict alliance coordination. Dispatch your vanguard forces inside an active rally.',
    },
    marchRequirement: {
      actionPointCost: 20,
      minPowerRequired: 50000,
      minHeroLevelRequired: 10,
      travelTypeAllowed: 'rally_only',
    },
    visibilityRules: {
      revealedByDefault: true,
      illuminationRadius: 2,
      minScoutTowerLevelRequired: 3,
    },
  },

  // 14. Gathering Tiles
  {
    id: 'gathering_tile_gold_l4',
    type: 'gathering_tile',
    level: 4,
    coordinates: { x: 1000, y: 1400 },
    size: '1x1',
    flavorDescription: 'Golden Pyrite Ore Riverbed. Silted mountain streams holding beautiful glittering gold flakes that can be gathered safely.',
    respawnTimeSec: 1800,
    rewards: [
      { type: 'gold', minAmount: 40000, maxAmount: 40000, guaranteed: true },
    ],
    interactionRules: {
      canAttack: true, // Players can perform competitive plundering attacks on active gatherers
      canRallyAgainst: false,
      canGather: true,
      canReinforce: false,
      interactionPhraseDescription: 'Send cavalry or specialized load divisions to extract raw gold supplies directly from the map grid.',
    },
    marchRequirement: {
      actionPointCost: 5,
      minPowerRequired: 1500,
      minHeroLevelRequired: 1,
      travelTypeAllowed: 'normal',
    },
    visibilityRules: {
      revealedByDefault: true,
      illuminationRadius: 0,
      minScoutTowerLevelRequired: 1,
    },
  },
];


// --- TACTICAL MATHEMATICAL CALCULATORS & SIMULATORS ---

/**
 * Calculates the exact Euclidean pixel/grid distance between two coordinates on the global map.
 */
export function calculateCoordinatesDistance(pos1: MapPosition, pos2: MapPosition): number {
  const dx = pos1.x - pos2.x;
  const dy = pos1.y - pos2.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Estimates exact march arrival duration in seconds based on travel speed, distance, and troop attributes.
 *
 * @param pos1 Origin coordinate
 * @param pos2 Target coordinate
 * @param movementSpeedStat Base speed stat of the quickest/slowest unit on the march (e.g. Cavalry vs Infantry)
 * @param academySpeedMultiplier Tech research multiplier (e.g., 0.15 represents +15% Travel Speed)
 */
export function estimateMarchDurationSec(
  pos1: MapPosition,
  pos2: MapPosition,
  movementSpeedStat: number = 100,
  academySpeedMultiplier: number = 0
): number {
  const distance = calculateCoordinatesDistance(pos1, pos2);
  
  // Base configuration: distance units divided by speed metric
  // Standard travel: 1 distance unit takes 10 seconds at speed 100
  const baseSeconds = (distance * 1000) / movementSpeedStat;
  
  // Apply research speedups
  const finalSeconds = baseSeconds / (1.0 + academySpeedMultiplier);
  
  // Guarantee a minimum travel time to load coordinates (e.g., 5 seconds)
  return Math.max(5, Math.round(finalSeconds));
}

/**
 * Simulates extraction yields and time needed to fully exhaust a Resource or Gathering Tile.
 *
 * @param node The targeted resource map object
 * @param totalLoadCapacity Combined carry weight capacity of the deployed march army
 * @param hourlyGatherRate Base harvest rate units/hour of the army
 * @param researchMultiplier Tech bonus decimal (e.g., 0.25 adding +25% gathering rate)
 */
export function simulateHarvestingTime(
  node: WorldMapObject,
  totalLoadCapacity: number,
  hourlyGatherRate: number = 20000,
  researchMultiplier: number = 0
): {
  harvestGains: number;
  durationSecondsNeeded: number;
  isResourceFullyExhausted: boolean;
} {
  // Find resource reward item in node database
  const resourceReward = node.rewards.find(r => r.type === 'food' || r.type === 'wood' || r.type === 'stone' || r.type === 'iron' || r.type === 'gold');
  if (!resourceReward) {
    return { harvestGains: 0, durationSecondsNeeded: 0, isResourceFullyExhausted: false };
  }

  const baseCapacity = resourceReward.maxAmount;
  const effectiveGatherRateSec = (hourlyGatherRate * (1.0 + researchMultiplier)) / 3600;

  // Maximum gatherable amount is bounded by what the army can carry vs what is left in the node
  const harvestGains = Math.min(totalLoadCapacity, baseCapacity);
  const durationSecondsNeeded = Math.round(harvestGains / effectiveGatherRateSec);
  const isResourceFullyExhausted = harvestGains >= baseCapacity;

  return {
    harvestGains,
    durationSecondsNeeded,
    isResourceFullyExhausted,
  };
}

/**
 * Parses nodes on the grid that fall inside a specific coordinate radius range.
 */
export function getMapObjectsInRadius(
  center: MapPosition,
  radius: number,
  filterType?: WorldMapObjectType
): WorldMapObject[] {
  return CROWNSPIRE_WORLD_MAP_OBJECTS.filter(node => {
    if (filterType && node.type !== filterType) return false;
    const dist = calculateCoordinatesDistance(center, node.coordinates);
    return dist <= radius;
  });
}
