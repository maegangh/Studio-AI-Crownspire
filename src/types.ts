export interface Resources {
  food: number;
  wood: number;
  stone: number;
  iron: number;
  valor: number;
}

export interface ResourceRates {
  food: number;
  wood: number;
  stone: number;
  iron: number;
  valor: number;
}

export type ResourceType = keyof Resources;

export interface ResourceCost {
  food?: number;
  wood?: number;
  stone?: number;
  iron?: number;
  valor?: number;
}

export interface BuildingUpgrade {
  buildingId: string;
  startTime: number;     // Date.now() timestamp
  finishTime: number;    // Date.now() timestamp
}

export interface Building {
  id: string;
  name: string;
  description: string;
  level: number;
  baseCost: ResourceCost;
  costMultiplier: number;
  baseProduction: { [key in ResourceType]?: number };
  productionMultiplier: number;
  iconName: string; 
}

export interface UnitType {
  id: string;
  name: string;
  description: string;
  cost: ResourceCost;
  power: number;
  count: number;
  trainingTimeSec: number;
  iconName: string;
  upkeepFood: number;
  troopType?: 'infantry' | 'marksmen' | 'cavalry';
  tier?: number;
  attack?: number;
  defense?: number;
  health?: number;
  speed?: number;
  load?: number;
  unlockRequirement?: string;
}

export interface MapTile {
  id: string;
  x: number;
  y: number;
  type: 'fortress' | 'forest' | 'plains' | 'hills' | 'mountain' | 'bandit_camp' | 'ruins';
  status: 'fogged' | 'revealed' | 'claimed';
  name: string;
  bonus?: {
    resource: 'food' | 'wood' | 'stone' | 'iron' | 'valor';
    amount: number;
  };
  combatPower?: number;
  reward?: ResourceCost;
  explorationCost?: ResourceCost;
}

export interface CampaignStage {
  id: number;
  name: string;
  story: string;
  enemy: string;
  recommendedPower: number;
  rewards: ResourceCost;
  completed: boolean;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
}

export interface Hero {
  name: string;
  type: 'Food' | 'Wood' | 'Stone' | 'Iron' | 'War';
  level: number;
  xp: number;
  attack: number;
  defense: number;
  role?: string;
  bonus?: string;
  ability?: string;
  id?: string;
  shards?: number;
  ascension?: number;
  skillLevels?: Record<string, number>;
}

export interface QuestState {
  quest1_progress: number;
  quest1_target: number;
  quest1_completed: boolean;
  quest2_progress: number;
  quest2_target: number;
  quest2_completed: boolean;
}

export interface HealingJob {
  troopType: 'infantry' | 'marksmen' | 'cavalry';
  count: number;
  timeRemainingSec: number;
  totalDurationSec: number;
  startTime: number;
  finishTime: number;
}

export interface TroopState {
  infantry: number;
  marksmen: number;
  cavalry: number;
  wounded_infantry: number;
  wounded_marksmen: number;
  wounded_cavalry: number;
  hospital_capacity: number;
  sanctuary_capacity: number;
  sanctuary_troops: number;
  is_training: boolean;
  training_time_left: number;
  training_type: string;
  training_label_text: string;
  infantry_training_active: boolean;
  marksmen_training_active: boolean;
  cavalry_training_active: boolean;
  infantry_training_time_left: number;
  marksmen_training_time_left: number;
  cavalry_training_time_left: number;
  activeHealing?: HealingJob | null;
  healingQueue?: HealingJob[];
}

export interface ResearchJob {
  researchId: string;
  level: number;
  timeRemainingSec: number;
  totalDurationSec: number;
  startTime: number;
  finishTime: number;
}

export interface ResearchState {
  research_hall_level: number;
  economy_research_level: number;
  military_research_level: number;
  troop_attack_bonus: number;
  researchLevels?: { [id: string]: number };
  activeResearch?: ResearchJob | null;
  researchQueue?: ResearchJob[];
}

export interface ResearchPrerequisite {
  researchId: string;
  level: number;
}

export interface ResearchBonus {
  type: string;
  valuePerLevel: number;
  isPercentage: boolean;
}

export interface ResearchNode {
  id: string;
  name: string;
  category: 'economy' | 'military' | 'development' | 'alliance' | 'hero';
  description: string;
  maxLevel: number;
  researchCost: { [level: number]: ResourceCost };
  researchTimeSec: { [level: number]: number };
  prerequisites: ResearchPrerequisite[];
  bonuses: ResearchBonus[];
  iconName?: string;
}

export interface CampaignState {
  campaign_chapter: number;
  campaign_stage: number;
  campaign_progress: number;
  enemy_level: number;
  enemy_infantry: number;
  enemy_marksmen: number;
  enemy_cavalry: number;
  player_power: number;
  enemy_power: number;
}

export interface AllianceMember {
  name: string;
  power: number;
  rank: 'Leader' | 'Quartermaster' | 'Vanguard' | 'Lord';
  joinedAt: number;
}

export interface AllianceApplicant {
  name: string;
  power: number;
  message: string;
}

export interface AllianceTerritoryNode {
  id: string;
  x: number;
  y: number;
  cityName: string;
  status: 'claimed' | 'disputed' | 'unclaimed';
  defensePower: number;
  bonusText?: string;
}

export interface RallyParticipant {
  name: string;
  heroName: string;
  infantry: number;
  marksmen: number;
  cavalry: number;
  power: number;
}

export interface Rally {
  id: string;
  targetId: string;
  targetName: string;
  targetCoords: string;
  creator: string;
  timeRemainingSec: number;
  totalDurationSec: number;
  participants: RallyParticipant[];
  status: 'assembling' | 'marching' | 'completed';
}

export interface AllianceState {
  joined: boolean;
  name: string;
  level: number;
  memberCount: number;
  maxMembers: number;
  totalPower: number;
  members: AllianceMember[];
  applicants: AllianceApplicant[];
  helpRequestsCount: number;
  territoryInfluence: number;
  territoryNodes: AllianceTerritoryNode[];
  rallies?: Rally[];
}

export interface LeaderboardAlliance {
  rank: number;
  name: string;
  level: number;
  totalPower: number;
  membersCount: number;
  isPlayerAlliance?: boolean;
}

export interface LogMessage {
  id: string;
  timestamp: string;
  text: string;
  type: 'info' | 'success' | 'warning' | 'combat';
}

export interface GameState {
  castle_level: number;
  warehouse_level: number;
  resources: Resources;
  storedResources: {
    food: number;
    wood: number;
    stone: number;
    iron: number;
  };
  buildings: Building[];
  units: UnitType[];
  mapTiles: MapTile[];
  campaignStages: CampaignStage[];
  heroes: Hero[];
  heroTickets: number;
  currentHeroIndex: number;
  currentCampaignId: number;
  quests: QuestState;
  troops: TroopState;
  research: ResearchState;
  campaign: CampaignState;
  activeTab: 'city' | 'military' | 'map' | 'campaign' | 'alliance';
  logs: LogMessage[];
  lastSaved: number;
  alliance?: AllianceState;
  activeUpgrade?: BuildingUpgrade | null;
}

export interface HeroLore {
  origin: string;
  biography: string;
  personality: string;
  relationships: string;
  quote: string;
  recruitment: string;
}

