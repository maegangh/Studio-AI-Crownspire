import { CROWNSPIRE_HEROES_DATABASE } from './heroDatabase';

export interface MonsterRewards {
  resources: {
    food: number;
    wood: number;
    stone: number;
    iron: number;
    gold: number;
    valor: number;
  };
  heroExperience: number;
  heroShards: {
    heroId: string;
    count: number;
  } | null;
  speedups: string[]; // e.g. ["5m speedup", "1h speedup"]
  equipmentMaterials: string[]; // e.g. ["Dragon Scale", "Mithril Ore"]
  petMaterials: string[]; // e.g. ["Esoteric Treat", "Growth Serum"]
}

export interface Monster {
  id: string;
  name: string;
  level: number;
  rarity: 'Common' | 'Elite' | 'World Boss';
  attack: number;
  defense: number;
  health: number;
  speed: number;
  power: number;
  rewards: MonsterRewards;
  troopWeakness: 'infantry' | 'marksmen' | 'cavalry' | 'none';
  description: string;
  artworkReferenceName: string;
}

/**
 * Baseline templates of different monster species to feed the 100-monster generator.
 */
interface Archetype {
  name: string;
  weakness: 'infantry' | 'marksmen' | 'cavalry';
  description: string;
  art: string;
}

const COMMON_ARCHETYPES: Archetype[] = [
  { name: 'Goblin Pillager', weakness: 'infantry', description: 'A sneaky highway robber wielding jagged daggers.', art: 'goblin_pillager' },
  { name: 'Feral Hog', weakness: 'marksmen', description: 'A massive tusked boar that charges at anything that moves.', art: 'feral_hog' },
  { name: 'Grave Creeper', weakness: 'cavalry', description: 'A skeletal spider crawling out of the catacombs of Crownspire.', art: 'grave_creeper' },
  { name: 'Frostbite Lupine', weakness: 'infantry', description: 'A savage ice wolf roaming northern fields.', art: 'frost_lupine' },
  { name: 'Cinder Spitter', weakness: 'marksmen', description: 'A small elemental reptile spitting searing ash.', art: 'cinder_spitter' },
  { name: 'Mossy Harpy', weakness: 'cavalry', description: 'A cruel avian creature swooping from mountain crevices.', art: 'mossy_harpy' },
  { name: 'Ironwood Golem', weakness: 'infantry', description: 'An animated mass of oak trunk and stone ligaments.', art: 'ironwood_golem' },
  { name: 'Sand Dweller', weakness: 'marksmen', description: 'A burrowing scorpion hiding inside dry silt dunes.', art: 'sand_dweller' },
  { name: 'Crypt Wight', weakness: 'cavalry', description: 'A persistent armored corpse seeking to snuff out life.', art: 'crypt_wight' },
  { name: 'Bog Mire Ooze', weakness: 'infantry', description: 'A giant toxic slime digesting biological components.', art: 'bog_mire_ooze' },
];

const LEVEL_PREFIXES = [
  'Minor', 'Agitated', 'Vicious', 'Raging', 'Frenzied',
  'Wild', 'Hardened', 'Ancient', 'Corrupted', 'Dreaded'
];

/**
 * Generates details for the 100 common monsters scaled logically 
 * across levels 1-50 (exactly 2 monsters per level).
 */
function generateCommonMonsters(): Monster[] {
  const list: Monster[] = [];
  
  for (let level = 1; level <= 50; level++) {
    // Two monsters per level = 100 common monsters total!
    for (let sub = 1; sub <= 2; sub++) {
      const archIndex = (level * 2 + sub) % COMMON_ARCHETYPES.length;
      const archetype = COMMON_ARCHETYPES[archIndex];
      
      const prefixIndex = Math.min(
        LEVEL_PREFIXES.length - 1,
        Math.floor((level - 1) / 5)
      );
      const prefix = LEVEL_PREFIXES[prefixIndex];
      
      const id = `monster_common_l${level}_s${sub}_${archetype.art}`;
      const name = `${prefix} ${archetype.name} (Lvl ${level})`;
      
      // Dynamic metric scaling factors based on level progression
      const scale = Math.pow(1.12, level - 1);
      const attack = Math.round(50 * level * scale);
      const defense = Math.round(40 * level * scale);
      const health = Math.round(400 * level * scale);
      const speed = 100 + level * 2;
      const power = Math.round((attack + defense) * 8 + health * 0.15);
      
      // Calculate scaled resource rewards
      const food = Math.round(800 * level * (1 + sub * 0.2));
      const wood = Math.round(600 * level * (1 + sub * 0.2));
      const stone = Math.round(400 * level * (1 + sub * 0.1));
      const iron = Math.round(200 * level * (1 + sub * 0.1));
      const gold = Math.round(50 * level);
      const valor = Math.round(15 + level * 0.5);
      
      // Chance of dropping shards for active registry heroes
      const heroId = CROWNSPIRE_HEROES_DATABASE[level % CROWNSPIRE_HEROES_DATABASE.length].id;
      const count = level > 30 ? 2 : 1;
      const heroShards = (level % 5 === 0) ? { heroId, count } : null;

      const rewards: MonsterRewards = {
        resources: { food, wood, stone, iron, gold, valor },
        heroExperience: level * 80,
        heroShards,
        speedups: [level > 25 ? '15m speedup' : '5m speedup'],
        equipmentMaterials: [level > 35 ? 'Obsidian Shard' : 'Copper Wire'],
        petMaterials: [level > 20 ? 'Beast Treats' : 'Earthy Seed']
      };
      
      list.push({
        id,
        name,
        level,
        rarity: 'Common',
        attack,
        defense,
        health,
        speed,
        power,
        rewards,
        troopWeakness: archetype.weakness,
        description: `${archetype.description} Terrifying level ${level} specimen.`,
        artworkReferenceName: archetype.art
      });
    }
  }
  
  return list;
}

/**
 * 10 Handcrafted Elite Monsters appearing in high stakes region tiles
 */
const ELITE_MONSTERS: Monster[] = [
  {
    id: 'elite_infernal_drake',
    name: 'Infernal Ash Drake',
    level: 15,
    rarity: 'Elite',
    attack: 4500,
    defense: 3800,
    health: 44000,
    speed: 180,
    power: 125000,
    troopWeakness: 'cavalry',
    description: 'A crimson drake breathing sticky magma pools that incinerate infantry ranks.',
    artworkReferenceName: 'infernal_drake',
    rewards: {
      resources: { food: 50000, wood: 40000, stone: 30000, iron: 15000, gold: 5000, valor: 150 },
      heroExperience: 3500,
      heroShards: { heroId: 'captain_aldric', count: 5 },
      speedups: ['1h speedup', '1h speedup'],
      equipmentMaterials: ['Drake Scale', 'Magma Heart'],
      petMaterials: ['Crimson Treats', 'Growth Serum']
    }
  },
  {
    id: 'elite_crypt_lord',
    name: 'Crypt Sovereign Malakor',
    level: 20,
    rarity: 'Elite',
    attack: 6800,
    defense: 5900,
    health: 72000,
    speed: 140,
    power: 210000,
    troopWeakness: 'marksmen',
    description: 'An ancient spectral king whose glowing broadsword strips defender defense ratings.',
    artworkReferenceName: 'crypt_lord',
    rewards: {
      resources: { food: 80000, wood: 65000, stone: 50000, iron: 25000, gold: 8000, valor: 250 },
      heroExperience: 5000,
      heroShards: { heroId: 'ronald_steelbreaker', count: 6 },
      speedups: ['1h speedup', '3h speedup'],
      equipmentMaterials: ['Spectral Steel', 'Prismatic Iron'],
      petMaterials: ['Undead Serum', 'Esoteric Essence']
    }
  },
  {
    id: 'elite_glacier_goliath',
    name: 'Glacier Goliath',
    level: 25,
    rarity: 'Elite',
    attack: 9500,
    defense: 12000,
    health: 120000,
    speed: 95,
    power: 380000,
    troopWeakness: 'infantry',
    description: 'A colossal mountain troll of solid blue packed glacial ice.',
    artworkReferenceName: 'glacier_goliath',
    rewards: {
      resources: { food: 120000, wood: 100000, stone: 80000, iron: 40000, gold: 12000, valor: 350 },
      heroExperience: 8000,
      heroShards: { heroId: 'cedric_earthshaker', count: 8 },
      speedups: ['3h speedup', '3h speedup'],
      equipmentMaterials: ['Glacier Quartz', 'Titanium Plate'],
      petMaterials: ['Frosty Treats', 'Glacial Pith']
    }
  },
  {
    id: 'elite_swamp_terror',
    name: 'Silt Hydra Gorgon',
    level: 30,
    rarity: 'Elite',
    attack: 14000,
    defense: 11000,
    health: 180000,
    speed: 160,
    power: 540000,
    troopWeakness: 'cavalry',
    description: 'A five-headed swamp monstrosity with acidic spittle.',
    artworkReferenceName: 'swamp_terror',
    rewards: {
      resources: { food: 180000, wood: 150000, stone: 120000, iron: 60000, gold: 18000, valor: 500 },
      heroExperience: 12000,
      heroShards: { heroId: 'cassandra_stormeye', count: 10 },
      speedups: ['3h speedup', '8h speedup'],
      equipmentMaterials: ['Hydra Leather', 'Acidic Bile'],
      petMaterials: ['Toxic Treats', 'Silt Sap']
    }
  },
  {
    id: 'elite_phoenix_guardian',
    name: 'Crested Phoenix Vanguard',
    level: 35,
    rarity: 'Elite',
    attack: 21000,
    defense: 16000,
    health: 260000,
    speed: 240,
    power: 780000,
    troopWeakness: 'marksmen',
    description: 'A magnificent burning avian that reincarnates and buffs adjacent minions.',
    artworkReferenceName: 'phoenix_guardian',
    rewards: {
      resources: { food: 250000, wood: 200000, stone: 160000, iron: 80000, gold: 25000, valor: 700 },
      heroExperience: 18000,
      heroShards: { heroId: 'kaelen_phoenix', count: 12 },
      speedups: ['8h speedup', '8h speedup'],
      equipmentMaterials: ['Phoenix Feather', 'Sun Gold Ore'],
      petMaterials: ['Fiery Pet Seed', 'Phoenix Elixir']
    }
  },
  {
    id: 'elite_thunder_ram',
    name: 'Voltaic Thunderhorn',
    level: 40,
    rarity: 'Elite',
    attack: 32000,
    defense: 28000,
    health: 400000,
    speed: 190,
    power: 1200000,
    troopWeakness: 'infantry',
    description: 'A metal-plated dynamic ram gathering lightning arcs to slice defensive formations.',
    artworkReferenceName: 'thunder_ram',
    rewards: {
      resources: { food: 400000, wood: 350000, stone: 280000, iron: 140000, gold: 40000, valor: 1000 },
      heroExperience: 25000,
      heroShards: { heroId: 'arthur_dragonheart', count: 15 },
      speedups: ['8h speedup', '24h speedup'],
      equipmentMaterials: ['Charged Galvanic Plate', 'Voltaic Wire'],
      petMaterials: ['Static Treats', 'Storm core']
    }
  },
  {
    id: 'elite_void_crawler',
    name: 'Shadowrift Archfiend',
    level: 42,
    rarity: 'Elite',
    attack: 45000,
    defense: 35000,
    health: 600000,
    speed: 150,
    power: 1800000,
    troopWeakness: 'cavalry',
    description: 'A multi-limbed nightmare that emerged from the abyssal shadow portal.',
    artworkReferenceName: 'void_crawler',
    rewards: {
      resources: { food: 500000, wood: 450000, stone: 350000, iron: 180000, gold: 50000, valor: 1200 },
      heroExperience: 32000,
      heroShards: { heroId: 'morgana_shadow', count: 15 },
      speedups: ['24h speedup'],
      equipmentMaterials: ['Dark Rift Fabric', 'Void Crystal'],
      petMaterials: ['Abyssal Kibble', 'Void Serum']
    }
  },
  {
    id: 'elite_dread_knight',
    name: 'Dread Sentinel Thran',
    level: 45,
    rarity: 'Elite',
    attack: 62000,
    defense: 58000,
    health: 900000,
    speed: 130,
    power: 2600000,
    troopWeakness: 'marksmen',
    description: 'A fallen champion reanimated into heavy platings that shrugs off small bolts.',
    artworkReferenceName: 'dread_knight',
    rewards: {
      resources: { food: 700000, wood: 600000, stone: 500000, iron: 250000, gold: 75000, valor: 1500 },
      heroExperience: 45000,
      heroShards: { heroId: 'reginald_ironside', count: 20 },
      speedups: ['24h speedup', '24h speedup'],
      equipmentMaterials: ['Dread Steel', 'Cursed Crest'],
      petMaterials: ['Dark Elixir', 'Soul Fragment']
    }
  },
  {
    id: 'elite_magma_lord',
    name: 'Core Fire Golem',
    level: 48,
    rarity: 'Elite',
    attack: 85000,
    defense: 95000,
    health: 1300000,
    speed: 80,
    power: 3800000,
    troopWeakness: 'infantry',
    description: 'Born in subterranean magma chambers, throwing exploding volcanic debris.',
    artworkReferenceName: 'magma_lord',
    rewards: {
      resources: { food: 900000, wood: 800000, stone: 700000, iron: 350000, gold: 100000, valor: 2000 },
      heroExperience: 60000,
      heroShards: { heroId: 'ignis_firebrand', count: 25 },
      speedups: ['24h speedup', '3d speedup'],
      equipmentMaterials: ['Core Fire Obsidian', 'Molten Ingot'],
      petMaterials: ['Molten Snacks', 'Ignis Serum']
    }
  },
  {
    id: 'elite_ancient_phoenix',
    name: 'Ancient Solbird Aurum',
    level: 50,
    rarity: 'Elite',
    attack: 110000,
    defense: 85000,
    health: 2000000,
    speed: 280,
    power: 5000000,
    troopWeakness: 'marksmen',
    description: 'A majestic bird of myth whose bright aureola can blindingly dazzle general armies.',
    artworkReferenceName: 'ancient_phoenix',
    rewards: {
      resources: { food: 1200000, wood: 1000000, stone: 850000, iron: 450000, gold: 150000, valor: 3000 },
      heroExperience: 90000,
      heroShards: { heroId: 'aurelius_sovereign', count: 30 },
      speedups: ['3d speedup', '3d speedup'],
      equipmentMaterials: ['Solar Platinum', 'Phoenix Core Fabric'],
      petMaterials: ['Celestial Kibble', 'True Phoenix Blood']
    }
  }
];

/**
 * 5 End-Game Server World Bosses
 */
const WORLD_BOSSES: Monster[] = [
  {
    id: 'wb_gorgon_emperor',
    name: 'Gorgon Overlord Chronos',
    level: 55,
    rarity: 'World Boss',
    attack: 350000,
    defense: 300000,
    health: 8000000,
    speed: 120,
    power: 25000000,
    troopWeakness: 'infantry',
    description: 'The supreme commander of the deep void rift. Threatens to turn Crownspire structures to dry ash.',
    artworkReferenceName: 'gorgon_emperor',
    rewards: {
      resources: { food: 5000000, wood: 4000000, stone: 3000000, iron: 1500000, gold: 500000, valor: 10000 },
      heroExperience: 250000,
      heroShards: { heroId: 'aurelius_sovereign', count: 50 },
      speedups: ['3d speedup', '7d speedup'],
      equipmentMaterials: ['Chronos Sandglass', 'Overlord Plate Armor', 'Mythic Ingot'],
      petMaterials: ['Cosmic Biscuit', 'Time Crystals']
    }
  },
  {
    id: 'wb_tiamat_darkness',
    name: 'Tiamat, Void Mother',
    level: 60,
    rarity: 'World Boss',
    attack: 500000,
    defense: 450000,
    health: 12000000,
    speed: 150,
    power: 45000000,
    troopWeakness: 'cavalry',
    description: 'An ancient dark dragon matriarch wrapping continents in terrifying twilight shadow shields.',
    artworkReferenceName: 'wb_tiamat',
    rewards: {
      resources: { food: 8000000, wood: 7000000, stone: 5000000, iron: 2500000, gold: 800000, valor: 15000 },
      heroExperience: 400000,
      heroShards: { heroId: 'lilith_queen', count: 60 },
      speedups: ['7d speedup', '7d speedup'],
      equipmentMaterials: ['Matriarch Dragon Eye', 'Void Core Fabric', 'Black Diamond'],
      petMaterials: ['Abyssal Nectar', 'Void Infused Serum']
    }
  },
  {
    id: 'wb_typhon_colossus',
    name: 'Typhon, Storm Weaver',
    level: 65,
    rarity: 'World Boss',
    attack: 680000,
    defense: 600000,
    health: 20000000,
    speed: 250,
    power: 75000000,
    troopWeakness: 'marksmen',
    description: 'An colossal elemental cloud titan casting lightning bolts that bypass active garrison gates.',
    artworkReferenceName: 'wb_typhon',
    rewards: {
      resources: { food: 12000000, wood: 10000000, stone: 8000000, iron: 4000000, gold: 1200000, valor: 25000 },
      heroExperience: 600000,
      heroShards: { heroId: 'zephyrus_lord', count: 80 },
      speedups: ['7d speedup', '14d speedup'],
      equipmentMaterials: ['Typhon Charged Core', 'Weaver Storm Fabric', 'Prismatic Metal Shard'],
      petMaterials: ['Thundercloud Meal', 'Anemone Extract']
    }
  },
  {
    id: 'wb_fenrir_unleashed',
    name: 'Fenrir, the Moonslayer',
    level: 70,
    rarity: 'World Boss',
    attack: 900000,
    defense: 800000,
    health: 35000000,
    speed: 300,
    power: 120000000,
    troopWeakness: 'infantry',
    description: 'An colossal god-wolf that broke free of subterranean titanium bonds to feast upon stars.',
    artworkReferenceName: 'wb_fenrir',
    rewards: {
      resources: { food: 20000000, wood: 18000000, stone: 15000000, iron: 8000000, gold: 2000000, valor: 40000 },
      heroExperience: 1000000,
      heroShards: { heroId: 'alexander_war', count: 100 },
      speedups: ['14d speedup', '14d speedup'],
      equipmentMaterials: ['God-Slayer Fangs', 'Fenrir Chain Link', 'Titanium Core Block'],
      petMaterials: ['Sovereign Kibble', 'Heart of Astral Glands']
    }
  },
  {
    id: 'wb_leviathan_deep',
    name: 'Leviathan, Lord of Tides',
    level: 80,
    rarity: 'World Boss',
    attack: 1200000,
    defense: 1100000,
    health: 60000000,
    speed: 110,
    power: 200000000,
    troopWeakness: 'cavalry',
    description: 'A terrifying gargantuan leviathan from the deepest waters that can drown entire legions with tidal surges.',
    artworkReferenceName: 'wb_leviathan',
    rewards: {
      resources: { food: 35000000, wood: 30000000, stone: 25000000, iron: 12000000, gold: 3500000, valor: 60000 },
      heroExperience: 1600000,
      heroShards: { heroId: 'serena_celestial', count: 120 },
      speedups: ['30d speedup'],
      equipmentMaterials: ['Wavecaller Heart', 'Sovereign Pearl Crust', 'True Nether Ingot'],
      petMaterials: ['Tidal Serum', 'Ocean Dew']
    }
  }
];

export const CROWNSPIRE_MONSTERS_DATABASE: Monster[] = [
  ...generateCommonMonsters(),
  ...ELITE_MONSTERS,
  ...WORLD_BOSSES
];

export const MONSTER_TEMPLATES: Record<string, Monster> = CROWNSPIRE_MONSTERS_DATABASE.reduce((acc, m) => {
  acc[m.id] = m;
  acc[m.name] = m;
  acc[m.name.toLowerCase()] = m;
  return acc;
}, {} as Record<string, Monster>);
