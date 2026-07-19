// Crownspire Hero Details Expansion Database
// Hand-crafted stories, biographies, voice lines, animations, and skill progression configs.

export interface StoryChapter {
  title: string;
  unlockCondition: string;
  isUnlocked: (level: number, ascension: number) => boolean;
  content: string;
}

export interface VoiceLine {
  trigger: string;
  text: string;
  audioDuration: number; // in seconds
}

export interface HeroDetailConfig {
  biography: string;
  faction: 'Sunspire Citadel' | 'Eldergrove Sanctuary' | 'Iron Forge Syndicate' | 'Stonefang Keep' | 'Void Vanguard';
  alignment: string;
  storyChapters: StoryChapter[];
  voiceLines: VoiceLine[];
  animations: {
    name: string;
    description: string;
    effectClass: string;
  }[];
  troopSkills: {
    name: string;
    troopType: 'infantry' | 'marksmen' | 'cavalry' | 'all';
    bonusType: 'Attack' | 'Defense' | 'Speed' | 'Health' | 'Gathering';
    baseValue: number; // e.g., 0.05 for 5%
    scalingPerLevel: number; // e.g., 0.02 for +2% per level
    icon: string;
  }[];
}

// Custom data for the starter heroes
export const HERO_DETAILS_REGISTRY: Record<string, HeroDetailConfig> = {
  maegan: {
    faction: 'Sunspire Citadel',
    alignment: 'Lawful Good / Sovereign Ruler',
    biography: 'Sovereign Marshal of Crownspire, Maegan was appointed supreme field commander at a young age after defending the Golden Bastion during the Scourge of Malakar. Wielding the Sunspire Greatsword, her presence on the battlefield instills unmatched tactical coordination among the foot soldiers.',
    animations: [
      { name: 'Sovereign Idle', description: 'Unyielding breathing pattern with hovering golden embers', effectClass: 'animate-pulse' },
      { name: 'Dawnbreaker Slash', description: 'Rapid physical slash with high-contrast sun flare', effectClass: 'effect-slash' },
      { name: 'Citadel Bastion', description: 'Protective glowing grid dome of light shields', effectClass: 'effect-shield' },
      { name: 'Sovereign Gaze', description: 'Slow dramatic zoom and cosmic eye reflection', effectClass: 'effect-zoom' }
    ],
    troopSkills: [
      { name: 'Vanguard Drills', troopType: 'infantry', bonusType: 'Attack', baseValue: 0.10, scalingPerLevel: 0.03, icon: '⚔️' },
      { name: 'Shieldwall Fortitude', troopType: 'infantry', bonusType: 'Defense', baseValue: 0.08, scalingPerLevel: 0.02, icon: '🛡️' }
    ],
    storyChapters: [
      {
        title: 'Chapter 1: The Golden Vanguard',
        unlockCondition: 'Unlocked at Level 1',
        isUnlocked: (lvl) => lvl >= 1,
        content: 'Born under the celestial convergence of the Twin Suns, Maegan was drafted into the Citadel Guard at age ten. Her talent for defensive formations quickly earned her the admiration of the High Council.'
      },
      {
        title: 'Chapter 2: Trial of Malakar',
        unlockCondition: 'Requires Level 12 or Ascension 1',
        isUnlocked: (lvl, asc) => lvl >= 12 || asc >= 1,
        content: 'When the Orc armies of Malakar breached the deep-iron shafts, Maegan led a contingent of thirty infantry recruits. They held the bottleneck bridge for three days, allowing the city to fortify and repel the attack.'
      },
      {
        title: 'Chapter 3: The Marshal\'s Oath',
        unlockCondition: 'Requires Level 25 or Ascension 2',
        isUnlocked: (lvl, asc) => lvl >= 25 || asc >= 2,
        content: 'Upon receiving the Sovereign Crest, Maegan swore an oath on the Altar of Valor. "My shield is the Citadel walls; my blade is the fire of the Suns. We shall not yield a single acre of the Wilderness to the dark."'
      },
      {
        title: 'Chapter 4: Accord of the Twin Suns',
        unlockCondition: 'Requires Level 40 or Ascension 4',
        isUnlocked: (lvl, asc) => lvl >= 40 || asc >= 4,
        content: 'With the unification of the Eldergrove and Iron Forge factions, Maegan established the Sovereign Coalition. Her command now extends beyond infantry to coordinate the ultimate multi-disciplinary strike force.'
      }
    ],
    voiceLines: [
      { trigger: 'Commanding Gaze', text: '“My blade is sworn to the crown, but my heart is bound to the people.”', audioDuration: 3.5 },
      { trigger: 'Battle Cry', text: '“Citadel Guards! Hold the line! Not one step backward!”', audioDuration: 4.0 },
      { trigger: 'Coronation Blessing', text: '“Prestige is earned on the anvil of battle, not in the luxury of thrones.”', audioDuration: 3.2 },
      { trigger: 'Casual Dialogue', text: '“Do you hear the whispers of the wind in the outer wilderness? The enemy is marching.”', audioDuration: 4.5 }
    ]
  },
  ivy: {
    faction: 'Eldergrove Sanctuary',
    alignment: 'Neutral Good / Forest Sentinel',
    biography: 'Born in the deep Whispering Canopy, Ivy is a high-level elementalist who communes with the ancient spirits of agriculture. Her spells accelerate root growth and shield the base\'s food supplies from severe blights.',
    animations: [
      { name: 'Nature\'s Breathe', description: 'Organic green aura with rising leaf particles', effectClass: 'animate-bounce' },
      { name: 'Overgrowth Cascade', description: 'Sudden burst of thick moss roots around the screen', effectClass: 'effect-moss' },
      { name: 'Harvest Bless', description: 'Glow of gentle golden spores of renewal', effectClass: 'effect-glow' }
    ],
    troopSkills: [
      { name: 'Foraging Legions', troopType: 'all', bonusType: 'Gathering', baseValue: 0.15, scalingPerLevel: 0.04, icon: '🌾' },
      { name: 'Wildwood Vitality', troopType: 'marksmen', bonusType: 'Health', baseValue: 0.05, scalingPerLevel: 0.02, icon: '❤️' }
    ],
    storyChapters: [
      {
        title: 'Chapter 1: Sprout of the Wildwood',
        unlockCondition: 'Unlocked at Level 1',
        isUnlocked: (lvl) => lvl >= 1,
        content: 'Ivy spent her youth talking to trees and learning the ancient seasonal chants of the Sylphs. She discovered she could fertilize entire fields with a single wave of her wooden staff.'
      },
      {
        title: 'Chapter 2: Whispers of Blight',
        unlockCondition: 'Requires Level 12 or Ascension 1',
        isUnlocked: (lvl, asc) => lvl >= 12 || asc >= 1,
        content: 'During the Great Frost, the food storage of Crownspire began to rot. Ivy risked her life to venture into the Cursed Crypt, returning with a glowing sun seed that saved the granaries.'
      },
      {
        title: 'Chapter 3: Eldergrove Accord',
        unlockCondition: 'Requires Level 25 or Ascension 2',
        isUnlocked: (lvl, asc) => lvl >= 25 || asc >= 2,
        content: 'Recognizing her contribution, the forest spirits crowned her Sentinel of the Glade. She now channels the energy of the woods directly into the Citadel\'s primary food production nodes.'
      }
    ],
    voiceLines: [
      { trigger: 'Greeting', text: '“The earth remembers everything. Be kind to the roots, and they shall feed your empire.”', audioDuration: 3.8 },
      { trigger: 'Harvest Cast', text: '“Grow, feed, and flourish! Let the soil burn with green vitality!”', audioDuration: 3.0 },
      { trigger: 'Forest Whisper', text: '“The trees warn us of scouts in the eastern wood. We must warn the guards.”', audioDuration: 4.2 }
    ]
  },
  jack: {
    faction: 'Eldergrove Sanctuary',
    alignment: 'Chaotic Good / Lumber Marshal',
    biography: 'A robust woodlander whose mighty iron axe can fell a massive redwood with three clean strikes. Jack manages the Timber Woodmill with an iron fist and a jolly laugh, ensuring a constant influx of pristine timber.',
    animations: [
      { name: 'Axe Twirl', description: 'Physical axe spin with visual wind trails', effectClass: 'animate-spin' },
      { name: 'Timber Slam', description: 'Ground shake effect with wood shards popping up', effectClass: 'effect-shake' }
    ],
    troopSkills: [
      { name: 'Timber Extraction', troopType: 'all', bonusType: 'Gathering', baseValue: 0.15, scalingPerLevel: 0.04, icon: '🪵' },
      { name: 'Woodland Ambush', troopType: 'marksmen', bonusType: 'Attack', baseValue: 0.06, scalingPerLevel: 0.02, icon: '🏹' }
    ],
    storyChapters: [
      {
        title: 'Chapter 1: Redwood Giant',
        unlockCondition: 'Unlocked at Level 1',
        isUnlocked: (lvl) => lvl >= 1,
        content: 'Jack was raised by a pack of woodland bears before being adopted by a logging crew. He can out-chop any mechanical sawmill in the empire.'
      },
      {
        title: 'Chapter 2: Iron Oak Expedition',
        unlockCondition: 'Requires Level 12 or Ascension 1',
        isUnlocked: (lvl, asc) => lvl >= 12 || asc >= 1,
        content: 'When construction of the main Watchtower stalled due to lack of reinforced lumber, Jack led his scouts deep into territory occupied by slime nests, bringing back the ancient Iron Oak.'
      }
    ],
    voiceLines: [
      { trigger: 'Chop Chop', text: '“A sharp axe and a steady arm can solve any supply problem!”', audioDuration: 3.0 },
      { trigger: 'Jolly Roar', text: '“Ha! Is that what you call a barricade? My grandmother chops wood stronger than that!”', audioDuration: 3.5 }
    ]
  },
  rubble: {
    faction: 'Stonefang Keep',
    alignment: 'Neutral / Mason Vanguard',
    biography: 'Carved out of granite, Rubble is a silent stone-carver whose structural designs have kept Crownspire standing through earthquake spells and bombardment. He knows the resonance of every quarry rock.',
    animations: [
      { name: 'Seismic Grounding', description: 'Deep red earth shockwaves pulsing from base', effectClass: 'animate-pulse' },
      { name: 'Boulder Shield', description: 'Rocky stones revolving around the hero portrait', effectClass: 'effect-rocks' }
    ],
    troopSkills: [
      { name: 'Quarrying Logistics', troopType: 'all', bonusType: 'Gathering', baseValue: 0.15, scalingPerLevel: 0.04, icon: '🪨' },
      { name: 'Stonefort Defense', troopType: 'infantry', bonusType: 'Defense', baseValue: 0.07, scalingPerLevel: 0.02, icon: '🛡️' }
    ],
    storyChapters: [
      {
        title: 'Chapter 1: Mountain Born',
        unlockCondition: 'Unlocked at Level 1',
        isUnlocked: (lvl) => lvl >= 1,
        content: 'Found as an infant in a mountain cave, Rubble possesses skin as tough as granite. He was raised by master stonemasons of the deep empire.'
      },
      {
        title: 'Chapter 2: Fortifying the Citadel',
        unlockCondition: 'Requires Level 12 or Ascension 1',
        isUnlocked: (lvl, asc) => lvl >= 12 || asc >= 1,
        content: 'When dragonfire threatened the outer wall, Rubble designed a thermal-reflecting stone grout that completely neutralized the intense heat, preserving the Citadel.'
      }
    ],
    voiceLines: [
      { trigger: 'Granite Mind', text: '“Patience is stone. The wind will pass, but the mountain remains.”', audioDuration: 3.6 },
      { trigger: 'Defense Stance', text: '“Stand firm as the cliffside! The enemy will break like waves upon us!”', audioDuration: 3.9 }
    ]
  },
  tony: {
    faction: 'Iron Forge Syndicate',
    alignment: 'Chaotic Neutral / Gearsmith',
    biography: 'The master engineer of the deep furnace. Tony combines alchemy with blacksmithing, extracting maximum purity from deep-iron veins. He views warfare as an elaborate machine requiring optimal lubrication.',
    animations: [
      { name: 'Steam Vent', description: 'Hot mechanical steam rising up from beneath portrait', effectClass: 'animate-pulse' },
      { name: 'Overcharge Sparks', description: 'Shower of golden iron sparks bursting out', effectClass: 'effect-sparks' }
    ],
    troopSkills: [
      { name: 'Steel Smelting', troopType: 'all', bonusType: 'Gathering', baseValue: 0.15, scalingPerLevel: 0.04, icon: '🔩' },
      { name: 'Iron-Clad March', troopType: 'cavalry', bonusType: 'Speed', baseValue: 0.05, scalingPerLevel: 0.02, icon: '🐎' }
    ],
    storyChapters: [
      {
        title: 'Chapter 1: Apprentice of Fire',
        unlockCondition: 'Unlocked at Level 1',
        isUnlocked: (lvl) => lvl >= 1,
        content: 'Tony burned off his eyebrows at age six trying to formulate a hotter furnace coal. He was immediately promoted to apprentice gearsmith.'
      },
      {
        title: 'Chapter 2: The Blast Furnace',
        unlockCondition: 'Requires Level 12 or Ascension 1',
        isUnlocked: (lvl, asc) => lvl >= 12 || asc >= 1,
        content: 'Tony designed the pressure-valved blast furnace that increased iron refining speeds by three-fold, triggering a new era of heavy armor manufacturing.'
      }
    ],
    voiceLines: [
      { trigger: 'Grease and Gears', text: '“War is just a calculation. Sharp blades, oiled gears, and plenty of coal!”', audioDuration: 3.8 },
      { trigger: 'Oven Roar', text: '“Is it hot in here, or is my furnace just running at peak efficiency?”', audioDuration: 2.8 }
    ]
  }
};

// Generates beautiful default details for any new or unmapped heroes dynamically!
export function getHeroExtendedDetails(heroName: string): HeroDetailConfig {
  const normalized = heroName.toLowerCase();
  if (HERO_DETAILS_REGISTRY[normalized]) {
    return HERO_DETAILS_REGISTRY[normalized];
  }

  // Beautiful fallback generator for other heroes (e.g. Lorelai, Sir Balin, Lady Gwendolyn, etc.)
  return {
    faction: 'Void Vanguard',
    alignment: 'True Neutral / Sovereign Wanderer',
    biography: `A legendary commander of the Crownspire realm. ${heroName} has crossed the borderlands of the fogged wilderness, mapping out resource reserves and defending caravans from chaotic incursions.`,
    animations: [
      { name: 'Standard Idle', description: 'Gentle hovering aura of prestige power', effectClass: 'animate-pulse' },
      { name: 'Tactical Command', description: 'Glowing target pointer flash across the portrait', effectClass: 'effect-shield' }
    ],
    troopSkills: [
      { name: 'Legion Drills', troopType: 'all', bonusType: 'Attack', baseValue: 0.05, scalingPerLevel: 0.015, icon: '⚔️' },
      { name: 'Wilderness Survival', troopType: 'all', bonusType: 'Speed', baseValue: 0.04, scalingPerLevel: 0.01, icon: '🚀' }
    ],
    storyChapters: [
      {
        title: 'Chapter 1: The Outland Scout',
        unlockCondition: 'Unlocked at Level 1',
        isUnlocked: (lvl) => lvl >= 1,
        content: `${heroName} began their journey in the outermost frontier camps. Their quick thinking saved dozens of border families from bandit raids.`
      },
      {
        title: 'Chapter 2: Sovereign Alliance',
        unlockCondition: 'Requires Level 15 or Ascension 1',
        isUnlocked: (lvl, asc) => lvl >= 15 || asc >= 1,
        content: `Impressed by their loyalty, the High Council invited ${heroName} to lead deeper mapping expeditions into the dark corners of the world map.`
      }
    ],
    voiceLines: [
      { trigger: 'Outpost Call', text: `“I walk the borders so the Citadel can sleep in peace.”`, audioDuration: 3.5 },
      { trigger: 'Rally Crypt', text: `“Stand together, champions! The light of the spire is with us!”`, audioDuration: 3.2 }
    ]
  };
}

// Calculations for skill upgrades
export interface SkillUpgradeCost {
  valor: number;
  food: number;
  wood: number;
  stone: number;
  iron: number;
}

export function getSkillUpgradeCost(currentSkillLevel: number, heroType: string): SkillUpgradeCost {
  const baseFactor = Math.pow(currentSkillLevel, 1.8);
  
  // Base valor and resource costs
  const valor = Math.round(50 * baseFactor);
  let food = 0;
  let wood = 0;
  let stone = 0;
  let iron = 0;

  // Scale raw resource cost based on hero primary type!
  const resAmount = Math.round(1500 * baseFactor);
  if (heroType === 'Food') food = resAmount;
  else if (heroType === 'Wood') wood = resAmount;
  else if (heroType === 'Stone') stone = resAmount;
  else if (heroType === 'Iron') iron = resAmount;
  else {
    // War hero: splits cost across multiple resources
    food = Math.round(resAmount * 0.4);
    wood = Math.round(resAmount * 0.4);
    stone = Math.round(resAmount * 0.4);
    iron = Math.round(resAmount * 0.4);
  }

  return { valor, food, wood, stone, iron };
}

// Evaluates the total combat power of a hero including equipment AND skill upgrades
export function calculateHeroExpandedPower(
  hero: any, 
  recruitedStats: { power: number },
  ownerEquipment: any[]
): number {
  let power = recruitedStats.power;

  // 1. Add skill level bonuses: +1500 power per total skill level upgrade above 1!
  if (hero.skillLevels) {
    Object.values(hero.skillLevels).forEach((lvl) => {
      const upgradeLvl = (lvl as number) - 1;
      if (upgradeLvl > 0) {
        power += upgradeLvl * 1500;
      }
    });
  }

  // 2. Add equipment specific direct power!
  const heroEquipment = ownerEquipment.filter(eq => eq.equippedHeroId === (hero.id || hero.name));
  heroEquipment.forEach((eq) => {
    // Add raw stats power of items: level * 80 + tier * 250 + rarity multiplier
    let rarityFactor = 1;
    if (eq.rarity === 'Rare') rarityFactor = 1.3;
    if (eq.rarity === 'Epic') rarityFactor = 1.8;
    if (eq.rarity === 'Legendary') rarityFactor = 2.5;
    if (eq.rarity === 'Mythic') rarityFactor = 3.5;

    const gearPower = Math.round((eq.level * 95 + eq.tier * 350) * rarityFactor);
    power += gearPower;
  });

  return power;
}

// Compiles additional field bonuses granted by hero skill levels
export function compileHeroSkillStatsGains(hero: any, detailConfig: HeroDetailConfig) {
  const gains = {
    infantryAttack: 0,
    infantryDefense: 0,
    marksmenAttack: 0,
    marksmenDefense: 0,
    cavalryAttack: 0,
    cavalryDefense: 0,
    gatheringSpeed: 0,
    healthBonus: 0,
    speedBonus: 0
  };

  // Iterate over troopSkills
  detailConfig.troopSkills.forEach((skill) => {
    // Retrieve level (default to 1)
    const currentLvl = hero.skillLevels?.[skill.name] || 1;
    const value = skill.baseValue + (currentLvl - 1) * skill.scalingPerLevel;

    if (skill.troopType === 'infantry') {
      if (skill.bonusType === 'Attack') gains.infantryAttack += value;
      if (skill.bonusType === 'Defense') gains.infantryDefense += value;
    } else if (skill.troopType === 'marksmen') {
      if (skill.bonusType === 'Attack') gains.marksmenAttack += value;
      if (skill.bonusType === 'Defense') gains.marksmenDefense += value;
    } else if (skill.troopType === 'cavalry') {
      if (skill.bonusType === 'Attack') gains.cavalryAttack += value;
      if (skill.bonusType === 'Defense') gains.cavalryDefense += value;
      if (skill.bonusType === 'Speed') gains.speedBonus += value;
    } else if (skill.troopType === 'all') {
      if (skill.bonusType === 'Gathering') gains.gatheringSpeed += value;
      if (skill.bonusType === 'Attack') {
        gains.infantryAttack += value;
        gains.marksmenAttack += value;
        gains.cavalryAttack += value;
      }
      if (skill.bonusType === 'Health') gains.healthBonus += value;
    }
  });

  return gains;
}
