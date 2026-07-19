import { ResourceCost } from '../types';

export function formatNum(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toLocaleString();
}

export interface BuildingLevelData {
  level: number;
  costs: ResourceCost;
  prerequisites: string[];
  buildTimeSec: number;
  powerGained: number;
  unlocks: string[];
  description: string;
  buildingEffect: string;
}

export interface BuildingCatalog {
  id: string;
  name: string;
  baseDescription: string;
  iconName: string;
  levels: { [lvl: number]: BuildingLevelData };
}

// Format seconds into elegant text string (e.g., 2d 14h 30m 5s)
export function formatDuration(sec: number): string {
  if (sec <= 0) return 'Instant';
  const d = Math.floor(sec / (3600 * 24));
  const h = Math.floor((sec % (3600 * 24)) / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;

  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  if (m > 0) parts.push(`${m}m`);
  if (s > 0 || parts.length === 0) parts.push(`${s}s`);

  return parts.join(' ');
}

// Generate the complete building database levels 1-40 procedurally + milestones
export function generateBuildingLevels(
  id: string,
  baseCosts: { food?: number; wood?: number; stone?: number; iron?: number; valor?: number },
  costMult: number,
  basePower: number,
  descTemplates: string[]
): { [lvl: number]: BuildingLevelData } {
  const levels: { [lvl: number]: BuildingLevelData } = {};

  for (let lvl = 1; lvl <= 40; lvl++) {
    // 1. Calculate costs compounded exponentially matching game formula with nice rounding
    const costs: ResourceCost = {
      food: 0,
      wood: 0,
      stone: 0,
      iron: 0,
      valor: 0
    };
    
    // Explicitly compute food, wood, stone, iron, and valor costs
    const computedFood = baseCosts.food ? Math.round(baseCosts.food * Math.pow(costMult, lvl - 1)) : 0;
    const computedWood = baseCosts.wood ? Math.round(baseCosts.wood * Math.pow(costMult, lvl - 1)) : 0;
    const computedStone = baseCosts.stone ? Math.round(baseCosts.stone * Math.pow(costMult, lvl - 1)) : 0;
    const computedIron = baseCosts.iron ? Math.round(baseCosts.iron * Math.pow(costMult, lvl - 1)) : 0;
    const computedValor = baseCosts.valor ? Math.round(baseCosts.valor * Math.pow(costMult, lvl - 1)) : 0;

    costs.food = computedFood;
    costs.wood = computedWood;
    costs.stone = computedStone;
    costs.iron = computedIron;
    costs.valor = computedValor;

    // 2. Prerequisites matching a balanced strategy progression
    const prerequisites: string[] = [];
    if (lvl > 1) {
      if (id === 'castle') {
        prerequisites.push(`Wanderers Farm Lvl ${lvl - 1}`);
        if (lvl > 10) prerequisites.push(`Slate Quarry Lvl ${lvl - 5}`);
        if (lvl > 20) prerequisites.push(`Deep-Iron Shaft Lvl ${lvl - 10}`);
        if (lvl > 30) prerequisites.push(`Valor Shrine Lvl ${lvl - 15}`);
      } else if (id === 'warehouse') {
        prerequisites.push(`Citadel Keep Lvl ${lvl}`);
      } else if (id === 'academy') {
        prerequisites.push(`Citadel Keep Lvl ${lvl}`);
        if (lvl > 15) prerequisites.push(`Valor Shrine Lvl ${lvl - 10}`);
      } else if (id === 'shrine') {
        prerequisites.push(`Citadel Keep Lvl ${lvl}`);
        prerequisites.push(`Deep-Iron Shaft Lvl ${lvl - 1}`);
      } else if (id === 'barracks' || id === 'infantry_barracks' || id === 'marksmen_camp' || id === 'cavalry_stable') {
        prerequisites.push(`Citadel Keep Lvl ${lvl}`);
        prerequisites.push(`Timber Woodmill Lvl ${lvl - 1}`);
      } else if (id === 'hospital' || id === 'sanctuary' || id === 'embassy') {
        prerequisites.push(`Citadel Keep Lvl ${lvl - 1}`);
      } else if (id === 'watchtower' || id === 'trading_post' || id === 'hall_of_heroes') {
        prerequisites.push(`Citadel Keep Lvl ${lvl - 1}`);
        if (lvl > 12) prerequisites.push(`Vault Warehouse Lvl ${lvl - 8}`);
      } else {
        // Production buildings (farm, lumber, quarry, iron)
        prerequisites.push(`Citadel Keep Lvl ${lvl - 1}`);
        if (id === 'lumber_mill') prerequisites.push(`Wanderers Farm Lvl ${lvl - 1}`);
        if (id === 'quarry') prerequisites.push(`Timber Woodmill Lvl ${lvl - 1}`);
        if (id === 'iron_mine') prerequisites.push(`Slate Quarry Lvl ${lvl - 1}`);
      }
    }

    // 3. Build time scaling elegantly from seconds to hours/days
    const baseSec = id === 'castle' ? 45 : id === 'shrine' ? 35 : id === 'academy' ? 30 : 15;
    const timeMult = id === 'castle' ? 1.22 : 1.16;
    const buildTimeSec = Math.round(baseSec * Math.pow(timeMult, lvl - 1));

    // 4. Power Gained scaling matching Godot / Sandbox metrics
    const powerGained = Math.round(basePower * Math.pow(1.15, lvl - 1));

    // 5. Unique thematic milestone unlocks for levels 1-40
    const unlocks: string[] = [];
    if (lvl === 1) unlocks.push("Initial structure foundation laid.");
    if (lvl === 5) {
      if (id === 'castle') unlocks.push("Campaign Chapter 5 Challenge scope unlocked.");
      if (id === 'farm') unlocks.push("Silt Canal Irrigation (+15% speed bonus).");
      if (id === 'lumber_mill') unlocks.push("Double-toothed steel saws (+15% output).");
      if (id === 'quarry') unlocks.push("Granite extraction bits (+15% speed).");
      if (id === 'iron_mine') unlocks.push("Chilled carbon chisels (+15% load).");
      if (id === 'shrine') unlocks.push("Celestials Blessing Gaze (Summon cost reduction -5%).");
      if (id === 'barracks' || id === 'infantry_barracks') unlocks.push("Garrison recruits training speed bolstered by 10%.");
      if (id === 'warehouse') unlocks.push("High walls protection cap expansion.");
      if (id === 'academy') unlocks.push("Economy Tier 1 research speed boost unlocked.");
      if (id === 'hospital') unlocks.push("Sterilized linen bandages (+10% recovery rate).");
      if (id === 'sanctuary') unlocks.push("Grave keepers blessing (+5% resurrection capacity).");
      if (id === 'embassy') unlocks.push("Joint exercise program (+1 helpful assistance limit).");
      if (id === 'marksmen_camp') unlocks.push("Feathered fletching bays (+10% marksmen speed).");
      if (id === 'cavalry_stable') unlocks.push("Light stirrup saddling rings (+10% cavalry speed).");
      if (id === 'watchtower') unlocks.push("Eagle eye view (+1 scouting visibility scope).");
      if (id === 'trading_post') unlocks.push("Local merchant pacts (-5% tax brokerage fee).");
      if (id === 'hall_of_heroes') unlocks.push("Legendary roll of honor (+5% experience gains).");
    }
    if (lvl === 10) {
      if (id === 'castle') unlocks.push("Expedition Sector scouting radius increased by +1.");
      if (id === 'farm') unlocks.push("Crop rotation fields (+20% food speed).");
      if (id === 'lumber_mill') unlocks.push("Steam-driven hydraulic splitters (+20% yield).");
      if (id === 'quarry') unlocks.push("Bedrock heavy excavation drills.");
      if (id === 'iron_mine') unlocks.push("Magnetite core blasting charges.");
      if (id === 'shrine') unlocks.push("Command celestial stardust draft tickets directly (+1 free ticket).");
      if (id === 'barracks' || id === 'infantry_barracks') unlocks.push("Vanguard Archer cohorts archery practice range unlocked.");
      if (id === 'warehouse') unlocks.push("Heavy timber vault locks protecting up to 500k assets.");
      if (id === 'academy') unlocks.push("Military Combat Tactics Tier 1 unlocked.");
      if (id === 'hospital') unlocks.push("Herbal remedy apothecary rooms built.");
      if (id === 'sanctuary') unlocks.push("Resurrection pool spiritual resonance.");
      if (id === 'embassy') unlocks.push("Allied reinforcement corridors opened.");
      if (id === 'marksmen_camp') unlocks.push("Composite recurve bow workshops opened.");
      if (id === 'cavalry_stable') unlocks.push("Sturdy steel horseshoes blacksmiths.");
      if (id === 'watchtower') unlocks.push("Barricade signal warning fires (+15% scouting bounds).");
      if (id === 'trading_post') unlocks.push("Inter-province trading caravans (-10% tax brokerage fee).");
      if (id === 'hall_of_heroes') unlocks.push("Statue of the First Sovereign erected.");
    }
    if (lvl === 20) {
      if (id === 'castle') unlocks.push("Sovereign Lord title advancement level granted.");
      if (id === 'farm') unlocks.push("Enriched potassium-fertilizer fields (+35% yield).");
      if (id === 'lumber_mill') unlocks.push("Forestry automated timber chutes (+35% yield).");
      if (id === 'quarry') unlocks.push("Open-pit sapphire blasting channels.");
      if (id === 'iron_mine') unlocks.push("Volcanic magma smelting furnaces.");
      if (id === 'shrine') unlocks.push("Spiritual portal gateway to draft Elite commanders.");
      if (id === 'barracks' || id === 'infantry_barracks') unlocks.push("Heavy Armored Knight mount training rings opened.");
      if (id === 'warehouse') unlocks.push("Steel vault doors safeguarding up to 1m resources.");
      if (id === 'academy') unlocks.push("Master Siege Craft and Engineering modules unlocked.");
      if (id === 'hospital') unlocks.push("Advanced diagnostic assessment theatres.");
      if (id === 'sanctuary') unlocks.push("Celestial guardian dome shields loaded.");
      if (id === 'embassy') unlocks.push("Sovereign union conference table (+2 helpful assistance limit).");
      if (id === 'marksmen_camp') unlocks.push("Crosswind calculation sights unlocked.");
      if (id === 'cavalry_stable') unlocks.push("Heavy direct charging cavalry lanes.");
      if (id === 'watchtower') unlocks.push("Vanguard optoelectronic spyglass scopes (+25% scouting bounds).");
      if (id === 'trading_post') unlocks.push("Sovereign Stock Index established (-15% tax brokerage fee).");
      if (id === 'hall_of_heroes') unlocks.push("Ancestral Pantheon of Legends unlocked.");
    }
    if (lvl === 30) {
      if (id === 'castle') unlocks.push("Citadel deep Moat and high stone gate defenses.");
      if (id === 'farm') unlocks.push("Aquaponic dome yields (+50% food boosts).");
      if (id === 'lumber_mill') unlocks.push("Aero-dynamic logging crane lifters.");
      if (id === 'quarry') unlocks.push("Deep slate core quarry chambers.");
      if (id === 'iron_mine') unlocks.push("Titanium drilling nodes.");
      if (id === 'shrine') unlocks.push("Archangel gaze portal blessing.");
      if (id === 'barracks' || id === 'infantry_barracks') unlocks.push("Grand War Champion drafting regiments unlocked.");
      if (id === 'warehouse') unlocks.push("Underground chamber bunkers (saves 1.5m materials from plunder).");
      if (id === 'academy') unlocks.push("Ancient Sage library catalog archives.");
      if (id === 'hospital') unlocks.push("Regenerative celestial spring font.");
      if (id === 'sanctuary') unlocks.push("Celestial resurrection altar of the undying.");
      if (id === 'embassy') unlocks.push("High Alliance Overlord consulate hall.");
      if (id === 'marksmen_camp') unlocks.push("Heavy repeating ballista turrets engineered.");
      if (id === 'cavalry_stable') unlocks.push("Divine Pegasus flying stables opened.");
      if (id === 'watchtower') unlocks.push("Panoptic all-seeing radar matrix.");
      if (id === 'trading_post') unlocks.push("International mercantile guild headquarters (-20% tax fee).");
      if (id === 'hall_of_heroes') unlocks.push("Fountain of Youth constructed (+30% XP).");
    }
    if (lvl === 40) {
      unlocks.push("🏆 ETERNAL DOMINION MAX LEVEL reached! Sovereign status confirmed.");
      if (id === 'castle') unlocks.push("Glorious Golden Aura (All resource gather speeds doubled).");
      if (id === 'farm') unlocks.push("Farming Paradise (Food production +100%).");
      if (id === 'lumber_mill') unlocks.push("Infinite Sylvan Grove (Wood production +100%).");
      if (id === 'quarry') unlocks.push("Adamant Bedrock Masonry (Stone production +100%).");
      if (id === 'iron_mine') unlocks.push("Celestial Core Forge (Iron production +100%).");
      if (id === 'shrine') unlocks.push("Eternal Pantheon of Saints (Gain +200 Valor daily).");
      if (id === 'barracks' || id === 'infantry_barracks') unlocks.push("Undefeated Sovereign Footguards (-50% training time permanently).");
      if (id === 'warehouse') unlocks.push("Invulnerable Treasury (Nullifies all plunder penalty).");
      if (id === 'academy') unlocks.push("Omniscience Hall (+25% global combat bonus).");
      if (id === 'hospital') unlocks.push("Divine Restorations (Recover and heal soldiers with 0 material cost).");
      if (id === 'sanctuary') unlocks.push("Aegis of Eldraine (All fallen resources back instantly).");
      if (id === 'embassy') unlocks.push("Overlord Concordat (Double all helpful assistance timer caps).");
      if (id === 'marksmen_camp') unlocks.push("Supreme Bowmen Command (-50% marksmen training time permanently).");
      if (id === 'cavalry_stable') unlocks.push("Stellar Gryphon stables (-50% cavalry training times).");
      if (id === 'watchtower') unlocks.push("Panoptic Citadel Oracle Eye (+50% base defense triggers).");
      if (id === 'trading_post') unlocks.push("Tax-Free Empire (All Material brokerages tax-free).");
      if (id === 'hall_of_heroes') unlocks.push("Temple of Demi-Gods (+50% active attributes scaling for all Heroes).");
    }

    // 6. Detailed specific descriptions matching templates or level-dependent text
    const templateIndex = Math.min(descTemplates.length - 1, Math.floor((lvl - 1) / 10));
    const customDescription = `${descTemplates[templateIndex]} Level ${lvl} establishes advanced technical safety metrics, adding ${powerGained} overall power to your Citadel realm.`;

    // 7. Building effect mapping
    let buildingEffect = '';
    if (id === 'castle') {
      buildingEffect = `Unlocks overall building level caps to Level ${lvl} and activates Campaign Stage expansions up to Chapter ${Math.min(5 + Math.floor(lvl / 2), 25)}.`;
    } else if (id === 'farm') {
      buildingEffect = `Generates +${(lvl * 2.5).toFixed(1)} Food production per second inside the treasury vault.`;
    } else if (id === 'lumber_mill') {
      buildingEffect = `Produces +${(lvl * 1.8).toFixed(1)} Wood production per second for local expansions.`;
    } else if (id === 'quarry') {
      buildingEffect = `Outputs +${(lvl * 1.5).toFixed(1)} Stone masonry production per second to reinforce defense walls.`;
    } else if (id === 'iron_mine') {
      buildingEffect = `Excavates +${(lvl * 0.8).toFixed(1)} high-grade Iron ore per second for legendary weapons.`;
    } else if (id === 'warehouse') {
      buildingEffect = `Safeguards up to ${formatNum(lvl * 50000)} units of Food, Wood, Stone, and Iron from external plundering.`;
    } else if (id === 'hospital') {
      buildingEffect = `Heals up to ${formatNum(lvl * 1000)} wounded infantry, marksmen, and cavalry recruits inside the sanitarium wards.`;
    } else if (id === 'sanctuary') {
      buildingEffect = `Secures up to ${formatNum(lvl * 1500)} souls of fallen soldiers to resurrect them automatically.`;
    } else if (id === 'embassy') {
      buildingEffect = `Supports up to ${Math.min(10 + lvl, 50)} coalition speed-ups and grants +${lvl * 5}% alliance project support speed.`;
    } else if (id === 'academy') {
      buildingEffect = `Unlocks high-level scientific studies and speeds up research times by +${(lvl * 1.5).toFixed(1)}%.`;
    } else if (id === 'barracks' || id === 'infantry_barracks') {
      buildingEffect = `Bolsters infantry recruiting speed by +${(lvl * 1.5).toFixed(1)}% and enhances default infantry defense bounds.`;
    } else if (id === 'marksmen_camp') {
      buildingEffect = `Accelerates training speed of archer cohorts by +${(lvl * 1.5).toFixed(1)}% and raises archery tactical ranges.`;
    } else if (id === 'cavalry_stable') {
      buildingEffect = `Drafting speed of heavy cavalry, knights, and chargers increased by +${(lvl * 1.5).toFixed(1)}%.`;
    } else if (id === 'watchtower') {
      buildingEffect = `Generates +${(lvl * 2.5).toFixed(1)}% combat scouting defense triggers and extends viewable map limits.`;
    } else if (id === 'trading_post') {
      buildingEffect = `Reduces material brokerage trade tax penalty by ${Math.min(lvl * 0.8, 30).toFixed(1)}%.`;
    } else if (id === 'shrine') {
      buildingEffect = `Gathers +${(lvl * 0.2).toFixed(1)} holy Valor energy points per second of passive celestial gaze.`;
    } else if (id === 'hall_of_heroes') {
      buildingEffect = `Increases total active Hero experience earned by +${lvl * 3}% and active attribute scaling by +${lvl * 2}%.`;
    } else if (id === 'crystal_vault') {
      buildingEffect = `Unlocks epic Crystal Vault game modes and elevates Astral Resonance level by +${lvl}.`;
    }

    levels[lvl] = {
      level: lvl,
      costs,
      prerequisites,
      buildTimeSec,
      powerGained,
      unlocks,
      description: customDescription,
      buildingEffect,
    };
  }

  return levels;
}

export const BUILDING_DATABASE: { [key: string]: BuildingCatalog } = {
  castle: {
    id: 'castle',
    name: 'Citadel Keep',
    baseDescription: 'High Sovereign headquarters ruling over Crownspire. Sets maximum level caps and scopes of available match chapters.',
    iconName: 'Castle',
    levels: generateBuildingLevels(
      'castle',
      { food: 1500, wood: 1500, stone: 1000, iron: 500 },
      1.18,
      250,
      [
        'The foundational Keep of the empire, providing command shelter and establishing basic sovereignty.',
        'An expanded Fortress Keep with deep parapets and a grand feast hall to host regional lords.',
        'A towering Stone Citadel reinforced with defensive archery battlements and steel portcullis gates.',
        'An absolute Imperial Palace, manifesting total military hegemony and glowing with the Golden Sovereign Gaze.'
      ]
    ),
  },
  farm: {
    id: 'farm',
    name: 'Wanderers Farm',
    baseDescription: 'Arable crop zones generating high Food yields to keep military scouts and active garrison cohorts fed.',
    iconName: 'Cherry',
    levels: generateBuildingLevels(
      'farm',
      { wood: 40, stone: 15 },
      1.14,
      50,
      [
        'Basic hand-tilled crop gardens with seasonal berries and wild grain fields.',
        'Structured terrace farms featuring silt irrigation ditches and composting pits.',
        'Advanced windmill-assisted crop fields and massive stone silos.',
        'The blessed Fields of Ceres, producing holy high-yield grains.'
      ]
    ),
  },
  lumber_mill: {
    id: 'lumber_mill',
    name: 'Timber Woodmill',
    baseDescription: 'Pines logging mill harvesting raw wood blocks to support construction mechanics and mechanical bows.',
    iconName: 'Trees',
    levels: generateBuildingLevels(
      'lumber_mill',
      { food: 50, stone: 20 },
      1.14,
      55,
      [
        'A small logging campsite equipped with iron axes and hand carts.',
        'Watermill-powered logging chutes and heavy duty timber seasoning sheds.',
        'Steam-engine log saws and automated transport conveyor belts.',
        'The legendary Sylvan Mill, cutting sacred ironwood pines with magical speed.'
      ]
    ),
  },
  quarry: {
    id: 'quarry',
    name: 'Slate Quarry',
    baseDescription: 'Bedrock stone masonry quarrying heavy granite for wall towers and mechanical military barricades.',
    iconName: 'Dumbbell',
    levels: generateBuildingLevels(
      'quarry',
      { food: 80, wood: 60 },
      1.15,
      70,
      [
        'A surface quarries outpost extracting slate pebbles and foundational granite blocks.',
        'Deep rock blasting sites with leverage pulleys and derrick timber lifters.',
        'Hydraulic steam hammers splitting thick slate veins with absolute precision.',
        'The Unending Bedrock Quarry, extracting magical obsidian ores with celestial vigor.'
      ]
    ),
  },
  iron_mine: {
    id: 'iron_mine',
    name: 'Deep-Iron Shaft',
    baseDescription: 'Metallic mining tunnels excavating rich iron ores to forge steel shields, broadswords, and armaments.',
    iconName: 'Hammer',
    levels: generateBuildingLevels(
      'iron_mine',
      { food: 150, wood: 150, stone: 80 },
      1.16,
      95,
      [
        'Shallow pickaxe dig sites seeking basic rusted ore veins.',
        'Shoring tunnels with heavy timber arches and minecart tracks.',
        'Geothermal blast furnaces and deep machinery elevator lines.',
        'The Core Shaft of Crownspire, delving directly into tectonic stellar iron veins.'
      ]
    ),
  },
  warehouse: {
    id: 'warehouse',
    name: 'Vault Warehouse',
    baseDescription: 'Primary secure warehouse storage safeguarding treasury resources from maximum capacity overspill boundaries.',
    iconName: 'Package',
    levels: generateBuildingLevels(
      'warehouse',
      { wood: 600, stone: 400 },
      1.15,
      120,
      [
        'Basic lockable silos to stow grain, timber blocks, and carved slate slabs.',
        'Fortified stone vaults with moisture seals and steel-enforced lockboxes.',
        'Intricate secure treasury chambers guarded by heavy mechanism locks.',
        'The impenetrable World Vault representing ultimate stockpiling security and shelter.'
      ]
    ),
  },
  hospital: {
    id: 'hospital',
    name: 'Sacred Hospital',
    baseDescription: 'Sanctuary field hospital built to patch wounded cohorts, restoring soldier levels and preventing outright casualty counts.',
    iconName: 'Heart',
    levels: generateBuildingLevels(
      'hospital',
      { food: 300, wood: 300, stone: 200, iron: 100 },
      1.15,
      100,
      [
        'Simple herbal treatment beds staffed by village physical caregivers.',
        'Enclosed masonry sanitarium wards containing clean cotton blankets and hot water washbasins.',
        'High-capacity strategic military hospitals staffed by expert tactical surge wardens.',
        'The holy Sanitarium of Crownspire, invoking celestial regeneration springs.'
      ]
    ),
  },
  sanctuary: {
    id: 'sanctuary',
    name: 'Grave Sanctuary',
    baseDescription: 'Holy ancestral shrine preserving souls of deceased soldiers to allow spiritual resurrection.',
    iconName: 'ShieldCheck',
    levels: generateBuildingLevels(
      'sanctuary',
      { wood: 300, stone: 400, iron: 250 },
      1.16,
      110,
      [
        'A humble cemetery grove marked with protective runes and burning incense bowls.',
        'A towering runic monument reflecting stellar alignments to collect spiritual energies.',
        'A grand cathedral of spires designed to channel life force and safeguard soul repositories.',
        'The Celestial Valhalla Vault, binding names of heroes to the everlasting soul constellation.'
      ]
    ),
  },
  embassy: {
    id: 'embassy',
    name: 'Imperial Embassy',
    baseDescription: 'Consulate offices organizing speed assistance requests and receiving direct allied reinforcements.',
    iconName: 'Users',
    levels: generateBuildingLevels(
      'embassy',
      { food: 150, wood: 200, stone: 150 },
      1.14,
      80,
      [
        'A simple alliance messenger tent dispatching scout pigeons to nearby domains.',
        'A fortified stone conference hall to host delegates and coordinate regional joint safety plans.',
        'Grand tactical consulate blocks allowing swift command updates and diplomatic travel.',
        'The Great Concordat Palace, uniting all confederacies underneath the Sovereign Keep.'
      ]
    ),
  },
  academy: {
    id: 'academy',
    name: 'Research Hall',
    baseDescription: 'The scholarly archives and laboratories where science tech research is funded to gain global yield multipliers.',
    iconName: 'GraduationCap',
    levels: generateBuildingLevels(
      'academy',
      { wood: 800, stone: 650 },
      1.16,
      180,
      [
        'Simple scriptoriums to chart nearby resource coordinate paths and local crops.',
        'Scholarly halls with astronomical mapping systems and tactical blueprint archives.',
        'Grand mechanical test ranges for siege engineering and alloy metallurgy.',
        'The Universal Omniscience Hall, where sages harness ancient magic and stardust formulas.'
      ]
    ),
  },
  infantry_barracks: {
    id: 'infantry_barracks',
    name: 'Infantry Barracks',
    baseDescription: 'Strategic recruit centers specializing in training foot soldiers, heavy shield defense groups, and close-quarters infantry.',
    iconName: 'Sword',
    levels: generateBuildingLevels(
      'infantry_barracks',
      { food: 200, wood: 150, stone: 100 },
      1.15,
      115,
      [
        'An open-air mud yard with straw dummy dummies and basic fencing posts.',
        'Enclosed log barracks with well-stocked armories containing iron spears and leather vests.',
        'Grand marshal campuses hosting tactical mock-skirmish and field drill routines.',
        'The High Sovereign Legion Hall, outputting seasoned, fearless vanguard warriors.'
      ]
    ),
  },
  marksmen_camp: {
    id: 'marksmen_camp',
    name: 'Marksmen Camp',
    baseDescription: 'High precision firing ranges designed to teach bowmen pierces, crosswind compensation, and volley archery.',
    iconName: 'Target',
    levels: generateBuildingLevels(
      'marksmen_camp',
      { food: 250, wood: 200, stone: 120 },
      1.15,
      120,
      [
        'Simple straw targets erected at the forest edge with archery stands.',
        'Fortified wooden watchtowers allowing high-altitude sniper practice sessions.',
        'An advanced crosswind training gallery utilizing high banners and wind socks.',
        'The Imperial Rangers Academy, training silent marksmen who never miss a single target.'
      ]
    ),
  },
  cavalry_stable: {
    id: 'cavalry_stable',
    name: 'Cavalry Stable',
    baseDescription: 'Equestrian paddocks breeding battle-hardened destriers for heavy line raids and fast tactical flanking.',
    iconName: 'Shield',
    levels: generateBuildingLevels(
      'cavalry_stable',
      { food: 400, wood: 300, iron: 200 },
      1.16,
      140,
      [
        'Basic fenced fields and wooden shelters to shield local workhorses.',
        'Cobblestone stables and shoeing stations staffed by skilled military blacksmiths.',
        'Grand equestrian arenas to practice fast lance-charges and horse maneuvers.',
        'The Imperial Pegasus Grounds, breeding heavily armored mounts of divine pedigree.'
      ]
    ),
  },
  watchtower: {
    id: 'watchtower',
    name: 'Sentry Watchtower',
    baseDescription: 'High border scouts warning of enemy scouting attempts and providing deep visibility on sector coordinate maps.',
    iconName: 'Eye',
    levels: generateBuildingLevels(
      'watchtower',
      { wood: 150, stone: 200, iron: 50 },
      1.13,
      75,
      [
        'A single wooden scaffold offering a view above the immediate tree canopies.',
        'A robust stone beacon tower equipped with brass signaling horns and log bonfires.',
        'High sentry outposts utilizing double-magnification spyglass alignment scopes.',
        'The Panpan Sentry Beacon, carrying magic alert crystals projecting real-time map scans.'
      ]
    ),
  },
  trading_post: {
    id: 'trading_post',
    name: 'Trading Post',
    baseDescription: 'Dynamic barter marketplaces to swap regional resources, trade materials, and lower taxation fees.',
    iconName: 'Coins',
    levels: generateBuildingLevels(
      'trading_post',
      { food: 200, wood: 300, stone: 150, iron: 50 },
      1.14,
      85,
      [
        'A clean collection of simple layout canvas tents to trade wood and fruits.',
        'A structured wooden trading house featuring merchant scales and coin storage boxes.',
        'A stone commerce plaza coordinating large-scale horse cart transport logistics.',
        'The Imperial Mercantile Exchange, hosting global transactions with zero taxation loss.'
      ]
    ),
  },
  hall_of_heroes: {
    id: 'hall_of_heroes',
    name: 'Hall of Heroes',
    baseDescription: 'The ancestral castle keep hosting recruited legendary commanders and upgrading active commander attributes.',
    iconName: 'Crown',
    levels: generateBuildingLevels(
      'hall_of_heroes',
      { food: 300, wood: 500, stone: 500, iron: 305 },
      1.18,
      200,
      [
        'A clean circular feast room with log benches and portraits of legendary elders.',
        'A polished marble trophy academy with gilded cabinets for ancestral swords.',
        'A majestic castle cathedral containing runic statues of ancient high kings.',
        'The Eternal Pantheon of Saints, channeling active starlight into the souls of active commanders.'
      ]
    ),
  },
  shrine: {
    id: 'shrine',
    name: 'Valor Shrine',
    baseDescription: 'Celestial sanctuary channeling stardust light to obtain high Valor generation rates for commander level-ups.',
    iconName: 'Sparkles',
    levels: generateBuildingLevels(
      'shrine',
      { wood: 250, stone: 300, iron: 100 },
      1.18,
      150,
      [
        'A humble runic monolith where elders offer prayers and burning cedar resins.',
        'A majestic stone altar crowned by an astral optical prism channeling twilight rays.',
        'A grand cathedral of spires and runic dials mirroring the cosmic orbits.',
        'The Nexus of Celestial Sovereignty, where guardian spirits manifest in bodily form.'
      ]
    ),
  },
  barracks: {
    id: 'barracks',
    name: 'War Academy',
    baseDescription: 'Military training fortress where recruits practice shield defensive formations and reduce drafting times.',
    iconName: 'ShieldAlert',
    levels: generateBuildingLevels(
      'barracks',
      { wood: 100, stone: 100, iron: 30 },
      1.15,
      110,
      [
        'An open-air dirt training grounds with wooden targets and defensive stakes.',
        'Masonry towers housing officer barracks, armories, and practice archery ranges.',
        'Grand tactical war academies featuring battle map tables and armored horse arenas.',
        'The High Legion Citadel, training undefeated troops who ignore fear in battle.'
      ]
    ),
  },
  crystal_vault: {
    id: 'crystal_vault',
    name: 'Crystal Vault',
    baseDescription: 'The ancient stellar reliquary containing the core of the Realm. Access Puzzle Expeditions, Extreme Challenges, the Arena, and Beast Trials.',
    iconName: 'Sparkle',
    levels: generateBuildingLevels(
      'crystal_vault',
      { food: 500, wood: 500, stone: 800, iron: 400, valor: 100 },
      1.18,
      350,
      [
        'An ancient, shimmering crystal node of solid light projecting an defensive containment field.',
        'A hollowed obsidian cathedral built around the stellar reliquary, focusing magical runic power.',
        'A magnificent glowing citadel tower radiating cosmic light, projecting energy lines into the sky.',
        'The Cosmic Vault of the Heavens, channeling the infinite power of Crownspire’s core.'
      ]
    ),
  },
};
