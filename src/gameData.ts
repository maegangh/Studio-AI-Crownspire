import { Hero, MapTile, Resources, ResourceCost } from './types';

export const STARTER_HEROES: Hero[] = [
  { name: "Ivy", type: "Food", level: 1, xp: 0, attack: 15, defense: 15, role: "Resource Hero", bonus: "Food Production", ability: "Harvest Master" },
  { name: "Jack", type: "Wood", level: 1, xp: 0, attack: 16, defense: 14, role: "Resource Hero", bonus: "Wood Production", ability: "Timber Expertise" },
  { name: "Rubble", type: "Stone", level: 1, xp: 0, attack: 14, defense: 16, role: "Resource Hero", bonus: "Stone Production", ability: "Quarry Master" },
  { name: "Tony", type: "Iron", level: 1, xp: 0, attack: 22, defense: 22, role: "Resource Hero", bonus: "Iron Production", ability: "Iron Forging" },
  { name: "Maegan", type: "War", level: 1, xp: 0, attack: 44, defense: 42, role: "War Hero", bonus: "Troop Attack", ability: "Battlefield Commander" }
];

export const INITIAL_RESOURCES: Resources = {
  food: 1000,
  wood: 1000,
  stone: 1000,
  iron: 1000,
  valor: 100,
};

// Power calculation matching Godot formula:
// base = att_inf + att_marks + att_cav
// bonus += min(att_inf, def_marks) * 0.5
// bonus += min(att_marks, def_cav) * 0.5
// bonus += min(att_cav, def_inf) * 0.5
// returns base + bonus
export function calculatePower(
  att_inf: number, att_marks: number, att_cav: number,
  def_inf: number, def_marks: number, def_cav: number
): number {
  const base = att_inf + att_marks + att_cav;
  let bonus = 0;
  
  bonus += Math.min(att_inf, def_marks) * 0.5;
  bonus += Math.min(att_marks, def_cav) * 0.5;
  bonus += Math.min(att_cav, def_inf) * 0.5;
  
  return Math.floor(base + bonus);
}

// Storage limits matching Godot:
export function getFoodStorageLimit(farmLevel: number): number {
  return farmLevel * 1000;
}

export function getWoodStorageLimit(lumberMillLevel: number): number {
  return lumberMillLevel * 1000;
}

export function getStoneStorageLimit(quarryLevel: number): number {
  return quarryLevel * 800;
}

export function getIronStorageLimit(ironMineLevel: number): number {
  return ironMineLevel * 500;
}

export function getWarehouseProtectionLimit(warehouseLevel: number): number {
  return warehouseLevel * 50000;
}

// Format numbers elegantly
export function formatNum(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(2) + 'm';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  if (n < 0) return '0';
  return Math.floor(n).toLocaleString();
}

// Procedural visual map setup supporting resource rate increases
export function generateDefaultMap(): MapTile[] {
  const tiles: MapTile[] = [];
  const width = 5;
  const height = 5;

  const NamesByCoord: { [key: string]: { name: string; type: MapTile['type']; status: MapTile['status']; bonus?: MapTile['bonus']; combatPower?: number; reward?: ResourceCost } } = {
    '2,2': { name: 'Citadel Plaza', type: 'fortress', status: 'claimed' },
    '1,2': { name: 'Eldergrove Foothills', type: 'forest', status: 'revealed', bonus: { resource: 'wood', amount: 5 } },
    '3,2': { name: 'Wasteland Plains', type: 'plains', status: 'revealed', bonus: { resource: 'food', amount: 8 } },
    '2,1': { name: 'Silt Creek Farms', type: 'plains', status: 'revealed', bonus: { resource: 'food', amount: 10 } },
    '2,3': { name: 'Shallow Quarry Bend', type: 'hills', status: 'revealed', bonus: { resource: 'stone', amount: 4 } },
    
    '1,1': { name: 'Bandit Outpost', type: 'bandit_camp', status: 'revealed', combatPower: 30, reward: { wood: 500, food: 500 } },
    '3,3': { name: 'Ruined Monument', type: 'ruins', status: 'revealed', combatPower: 70, reward: { stone: 600, valor: 25 } },
    
    '0,2': { name: 'Darkwood Canopy', type: 'forest', status: 'fogged', bonus: { resource: 'wood', amount: 12 }, combatPower: 120, reward: { wood: 1000 } },
    '4,2': { name: 'Crimson Mine Shafts', type: 'mountain', status: 'fogged', bonus: { resource: 'iron', amount: 6 }, combatPower: 250, reward: { iron: 600, stone: 400 } },
    '2,0': { name: 'Overgrown Orchards', type: 'plains', status: 'fogged', bonus: { resource: 'food', amount: 15 }, combatPower: 90, reward: { food: 1000 } },
    '2,4': { name: 'Obsidian Steppes', type: 'hills', status: 'fogged', bonus: { resource: 'stone', amount: 10 }, combatPower: 220, reward: { stone: 1200, valor: 40 } },

    '0,0': { name: 'Cursed Crypt', type: 'ruins', status: 'fogged', bonus: { resource: 'valor', amount: 2 }, combatPower: 500, reward: { valor: 80, iron: 500 } },
    '4,4': { name: 'Orc Stronghold', type: 'bandit_camp', status: 'fogged', bonus: { resource: 'iron', amount: 15 }, combatPower: 800, reward: { iron: 1200, valor: 100 } },
    '0,4': { name: 'Ancient Grove Temple', type: 'ruins', status: 'fogged', bonus: { resource: 'valor', amount: 3 }, combatPower: 1300, reward: { valor: 150, food: 2000 } },
    '4,0': { name: 'Dragon Peak Lair', type: 'mountain', status: 'fogged', bonus: { resource: 'valor', amount: 5 }, combatPower: 3000, reward: { valor: 300, iron: 2500 } }
  };

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const coordKey = `${x},${y}`;
      if (NamesByCoord[coordKey]) {
        const item = NamesByCoord[coordKey];
        tiles.push({
          id: `tile_${x}_${y}`,
          x,
          y,
          type: item.type,
          status: item.status,
          name: item.name,
          bonus: item.bonus,
          combatPower: item.combatPower,
          reward: item.reward,
          explorationCost: { food: Math.max(50, (Math.abs(x - 2) + Math.abs(y - 2)) * 150) }
        });
      } else {
        const dist = Math.abs(x - 2) + Math.abs(y - 2);
        const randType = dist > 2 ? 'mountain' : (Math.random() > 0.5 ? 'forest' : 'plains');
        tiles.push({
          id: `tile_${x}_${y}`,
          x,
          y,
          type: randType as MapTile['type'],
          status: 'fogged',
          name: `Sector ${String.fromCharCode(65 + x)}${y + 1}`,
          bonus: randType === 'forest' ? { resource: 'wood', amount: 4 } : (randType === 'mountain' ? { resource: 'stone', amount: 3 } : undefined),
          explorationCost: { food: 120 * dist }
        });
      }
    }
  }

  return tiles;
}

export function getBuildingCost(building: any): ResourceCost {
  const cost: ResourceCost = {};
  Object.keys(building.baseCost).forEach((r) => {
    const res = r as keyof ResourceCost;
    const base = building.baseCost[res] || 0;
    cost[res] = Math.round(base * Math.pow(building.costMultiplier, building.level));
  });
  return cost;
}

// --- Simulated LIVE Server Alliance Engine Helpers ---

export interface AIDevelopingAlliance {
  name: string;
  basePower: number;
  level: number;
  memberCount: number;
  maxMembers: number;
  growthFactor: number; // power added per tick
}

export const COMPETITOR_ALLIANCES: AIDevelopingAlliance[] = [
  { name: "Royal Dawn", basePower: 65000, level: 6, memberCount: 50, maxMembers: 50, growthFactor: 1.2 },
  { name: "Iron Legion", basePower: 48000, level: 5, memberCount: 46, maxMembers: 50, growthFactor: 1.0 },
  { name: "Shadow Blades", basePower: 31000, level: 4, memberCount: 38, maxMembers: 50, growthFactor: 0.8 },
  { name: "Storm Wardens", basePower: 18000, level: 3, memberCount: 29, maxMembers: 50, growthFactor: 0.5 },
  { name: "Wild Wolves", basePower: 8500, level: 2, memberCount: 16, maxMembers: 50, growthFactor: 0.3 }
];

export const AI_LORD_NAMES = [
  "Lord Cedric", "Lady Gwendolyn", "Archmage Kaelen", "Sir Balin", "Valkyrie Brynhild",
  "High Priestess Elara", "Baron Von Draven", "Ranger Thorne", "Paladin Justin", "Warden Kyle",
  "Countess Sarah", "Commander Jaxon", "Duchess Martha", "Templar Tristan", "Grandmaster Aaron",
  "Lancer Roland", "Wizard Vance", "Sorceress Lyra", "Champion Silas", "Sentinel Bruce"
];

export const AI_LORD_MESSAGES = [
  "I bring a heavy cavalry division to fortify our coordinate boundaries. Permit me to pledge loyalty!",
  "My primary food fields yield 5% surplus. I wish to merge my estate with the Sovereignty league.",
  "Seeking defense shelter from the Royal Dawn raiders. My garrison stands ready to defend our territory nodes.",
  "Rallying under your glorious banners, Command Sovereign. Grant me entry and I shall slay your enemies.",
  "A dedicated strategist ready to trade stones and ores for defensive pacts. Requesting joining access.",
  "Honorable alliance needed. Let's claim more mountain quarry sectors on the world grid!",
  "A humble lord with a company of 20 vanguard rangers. We offer swift scout eyes for coordinates."
];

export function generateRandomApplicant(playerPower: number): { name: string; power: number; message: string } {
  const name = AI_LORD_NAMES[Math.floor(Math.random() * AI_LORD_NAMES.length)];
  const power = Math.floor(playerPower * (0.15 + Math.random() * 0.45)) + Math.floor(Math.random() * 200) + 120;
  const message = AI_LORD_MESSAGES[Math.floor(Math.random() * AI_LORD_MESSAGES.length)];
  return { name, power, message };
}

export function getInitialTerritoryNodes() {
  return [
    { id: "node_1", x: 1, y: 1, cityName: "Eldergrove Foothills", status: "claimed" as const, defensePower: 1200, bonusText: "+5% Wood Draft speed" },
    { id: "node_2", x: 3, y: 2, cityName: "Wasteland Plains", status: "claimed" as const, defensePower: 1800, bonusText: "+8% Food Production" },
    { id: "node_3", x: 2, y: 1, cityName: "Silt Creek Farms", status: "unclaimed" as const, defensePower: 1500, bonusText: "+10% Food Production" },
    { id: "node_4", x: 2, y: 3, cityName: "Shallow Quarry Bend", status: "unclaimed" as const, defensePower: 1600, bonusText: "+4% Stone Yield" },
    { id: "node_5", x: 1, y: 1, cityName: "Bandit Outpost", status: "unclaimed" as const, defensePower: 2500, bonusText: "+50 Recruit Garrison Power" },
    { id: "node_6", x: 3, y: 3, cityName: "Ruined Monument", status: "unclaimed" as const, defensePower: 3000, bonusText: "+12% Valor Gathering rate" },
    { id: "node_7", x: 4, y: 2, cityName: "Crimson Mine Shafts", status: "disputed" as const, defensePower: 4500, bonusText: "+15% Iron Ore Forging speed" },
    { id: "node_8", x: 0, y: 0, cityName: "Cursed Crypt", status: "unclaimed" as const, defensePower: 6000, bonusText: "+20% Shrine Valor Gaze" }
  ];
}


