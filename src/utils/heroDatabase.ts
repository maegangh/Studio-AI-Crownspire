import { Hero } from '../types';
import heroesJson from '../../heroes.json';

export type RarityType = 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
export type HeroRoleType = 'Infantry' | 'Marksmen' | 'Cavalry' | 'War' | 'Gathering' | 'Support';

export interface HeroSkill {
  name: string;
  description: string;
  requiredAscension: number;
}

export interface PassiveBonus {
  stat: string;
  value: number; // e.g., 0.05 for +5%
}

export interface AscensionLevelDetail {
  shardsRequired: number;
  statMultiplier: number;
  skillUnlocks: string[];
  bonusPower: number;
  attackMultiplier: number;
  defenseMultiplier: number;
  healthMultiplier: number;
  leadershipMultiplier: number;
  powerMultiplier: number;
}

export interface HeroBaseTemplate {
  id: string;
  name: string;
  rarity: RarityType;
  role: HeroRoleType;
  troopType: 'infantry' | 'marksmen' | 'cavalry' | 'none';
  baseAttack: number;
  baseDefense: number;
  baseHealth: number;
  leadership: number;
  skills: HeroSkill[];
  passiveBonuses: PassiveBonus[];
  shardRequirement: number;
  unlockMethod: string;
  description: string;
  ascensionLevels: AscensionLevelDetail[];
}

export const CROWNSPIRE_HEROES_DATABASE: HeroBaseTemplate[] = (heroesJson as any[]).map((item: any) => {
  const ascensionLevels: AscensionLevelDetail[] = [0, 1, 2, 3, 4, 5].map(idx => {
    const asc = item[`ascension${idx}`] || {};
    return {
      shardsRequired: asc.shardRequirement ?? 0,
      statMultiplier: asc.attackMultiplier ?? 1.0,
      skillUnlocks: asc.unlockedSkills ?? [],
      bonusPower: Math.round((asc.powerMultiplier ?? 1.0) * 1000) - 1000,
      attackMultiplier: asc.attackMultiplier ?? 1.0,
      defenseMultiplier: asc.defenseMultiplier ?? 1.0,
      healthMultiplier: asc.healthMultiplier ?? 1.0,
      leadershipMultiplier: asc.leadershipMultiplier ?? 1.0,
      powerMultiplier: asc.powerMultiplier ?? 1.0,
    };
  });

  return {
    id: item.id,
    name: item.name,
    rarity: item.rarity as RarityType,
    role: item.role as HeroRoleType,
    troopType: item.troopType as 'infantry' | 'marksmen' | 'cavalry' | 'none',
    baseAttack: item.baseAttack,
    baseDefense: item.baseDefense,
    baseHealth: item.baseHealth,
    leadership: item.leadership,
    skills: (item.activeSkills || []).map((s: any) => ({
      name: s.name,
      description: s.description,
      requiredAscension: s.requiredAscension ?? 0
    })),
    passiveBonuses: (item.passiveBonuses || []).map((p: any) => ({
      stat: p.stat,
      value: p.value
    })),
    shardRequirement: item.ascension1?.shardRequirement ?? 10,
    unlockMethod: item.unlockMethod || 'Standard Gacha',
    description: item.lore || '',
    ascensionLevels
  };
});

/**
 * Global registry map for quick key queries.
 */
export const HERO_TEMPLATES: Record<string, HeroBaseTemplate> = CROWNSPIRE_HEROES_DATABASE.reduce((acc, h) => {
  acc[h.id] = h;
  acc[h.name] = h;
  acc[h.name.toLowerCase()] = h;
  return acc;
}, {} as Record<string, HeroBaseTemplate>);

/**
 * Returns dynamic attributes of a recruited hero, calculating ascension 
 * multipliers and additional power levels.
 */
export function getHeroRecruitedStats(hero: Hero): {
  attack: number;
  defense: number;
  health: number;
  power: number;
  role: string;
  rarity: RarityType;
  skills: HeroSkill[];
  passiveBonuses: PassiveBonus[];
  leadership: number;
} {
  // Try to find in the database templates
  const templateName = hero.id || hero.name.toLowerCase().replace(' ', '_');
  const template = HERO_TEMPLATES[templateName] || CROWNSPIRE_HEROES_DATABASE.find(item => item.id === hero.id || item.name === hero.name) || CROWNSPIRE_HEROES_DATABASE[0];
  
  const lvl = hero.level || 1;
  const ascension = hero.ascension || 0; // +0 to +5
  
  // Base values
  const baseAtk = template.baseAttack;
  const baseDef = template.baseDefense;
  const baseHp = template.baseHealth;
  const baseLdr = template.leadership;
  
  // Level multiplier: +25% per level above level 1
  const levelFactor = 1.0 + (lvl - 1) * 0.25;
  
  // Ascension multiplier details from mapped ascensionLevels
  const ascDetail = template.ascensionLevels[ascension] || template.ascensionLevels[0];
  
  // Extract individual multipliers with default fallbacks
  const attackMultiplier = ascDetail.attackMultiplier ?? ascDetail.statMultiplier ?? 1.0;
  const defenseMultiplier = ascDetail.defenseMultiplier ?? ascDetail.statMultiplier ?? 1.0;
  const healthMultiplier = ascDetail.healthMultiplier ?? ascDetail.statMultiplier ?? 1.0;
  const leadershipMultiplier = ascDetail.leadershipMultiplier ?? 1.0;
  const powerMultiplier = ascDetail.powerMultiplier ?? 1.0;

  const finalAtk = Math.max(1, Math.round(baseAtk * levelFactor * attackMultiplier));
  const finalDef = Math.max(1, Math.round(baseDef * levelFactor * defenseMultiplier));
  const finalHp = Math.max(1, Math.round(baseHp * levelFactor * healthMultiplier));
  const finalLeadership = Math.max(1, Math.round(baseLdr * levelFactor * leadershipMultiplier));
  
  // Calculate power: based on stats + level + ascension bonus power
  const statsPower = (finalAtk + finalDef) * 12 + Math.round(finalHp * 0.5);
  const totalPower = Math.round(statsPower * powerMultiplier);
  
  // List of unlocked skills based on current ascension level
  const unlockedSkills = template.skills.filter(s => s.requiredAscension <= ascension);

  return {
    attack: finalAtk,
    defense: finalDef,
    health: finalHp,
    power: totalPower,
    role: template.role,
    rarity: template.rarity,
    skills: unlockedSkills,
    passiveBonuses: template.passiveBonuses,
    leadership: finalLeadership,
  };
}
