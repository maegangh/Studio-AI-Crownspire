import { Hero, TroopState, ResourceCost } from '../types';
import { CROWNSPIRE_TROOPS, TROOP_BY_ID, CrownspireTroop } from './troopDatabase';
import { getResearchBonus } from './researchDatabase';
import { getHeroRecruitedStats } from './heroDatabase';
import { CROWNSPIRE_MONSTERS_DATABASE } from './monsterDatabase';
import { compileHeroEquipmentBonuses, EQUIPMENT_TEMPLATES } from './equipmentProgression';
import { compileActivePetBonuses } from './petDatabase';

/**
 * Represents a compiled combatant army with all static metadata, 
 * counts, active heroes, and buffs compiled in real-time.
 */
export interface CombatArmyInput {
  name: string;
  // Map of troop ID (e.g. 'infantry_t1', 'cavalry_t3') to count
  troopCounts: { [troopId: string]: number };
  // Active heroes fielded in this march
  heroes: Hero[];
  // Player's or Sovereign's research levels map
  researchLevels: { [id: string]: number };
  // Player's building levels map
  buildingLevels: { [id: string]: number };
  // Base stats buffers (optional override from specific battlefield effects)
  additionalBuffs?: {
    attackMultiplier?: number;
    defenseMultiplier?: number;
    healthMultiplier?: number;
    damageReduction?: number;
    criticalChance?: number;
    criticalDamage?: number;
  };
}

/**
 * Detailed analysis of a specific unit category during a round.
 */
export interface UnitGroupState {
  troopId: string;
  name: string;
  troopType: 'infantry' | 'marksmen' | 'cavalry';
  tier: number;
  initialCount: number;
  currentCount: number;
  basePowerPerUnit: number;
  
  // Fully magnified combat stats per unit
  attack: number;
  defense: number;
  health: number;
}

/**
 * Compiled states for a combatant side.
 */
export interface CompiledArmyState {
  name: string;
  unitGroups: { [troopId: string]: UnitGroupState };
  heroes: Hero[];
  
  // Consolidated multipliers
  globalAttackBonus: number;
  globalDefenseBonus: number;
  globalHealthBonus: number;
  
  // Specific troop multipliers
  infantryAttackBonus: number;
  infantryDefenseBonus: number;
  infantryHealthBonus: number;
  
  marksmenAttackBonus: number;
  marksmenDefenseBonus: number;
  marksmenHealthBonus: number;
  
  cavalryAttackBonus: number;
  cavalryDefenseBonus: number;
  cavalryHealthBonus: number;
  
  // Special combat triggers
  criticalChance: number;
  criticalDamageMult: number; // e.g. 1.50 for 150% damage
  damageReduction: number;    // e.g. 0.05 for 5% flat reduction
  
  // Hospital and sanctuary levels for the aftermath
  hospitalCapacity: number;
  sanctuaryCapacity: number;
  
  initialTotalPower: number;
}

/**
 * Log containing specific events during a round of combat.
 */
export interface CombatRoundLog {
  round: number;
  actions: string[];
  attackerRemainingCount: number;
  defenderRemainingCount: number;
}

/**
 * Casualty breakdown of a specific troop category.
 */
export interface TroopCasualtyBreakdown {
  troopId: string;
  name: string;
  troopType: 'infantry' | 'marksmen' | 'cavalry';
  tier: number;
  initialCount: number;
  survived: number;
  wounded: number;     // Total wounded before caps
  hospitalized: number; // Fit inside Sacred Hospital
  sanctuary: number;    // Overflowed into Sanctuary Field Hospital
  dead: number;         // Outright casualties + hospital/sanctuary overflow
  basePowerPerUnit: number;
}

/**
 * Complete consolidated battle outcome reports.
 */
export interface DetailedBattleResult {
  winner: 'attacker' | 'defender' | 'draw';
  victoryReason: string;
  roundsPlayed: number;
  
  attackerSummary: {
    name: string;
    initialPower: number;
    finalPower: number;
    powerLost: number;
    powerGained: number;
    totalInitialTroops: number;
    totalSurvivingTroops: number;
    totalWoundedTroops: number;
    totalHospitalized: number;
    totalSanctuary: number;
    totalDead: number;
    casualties: TroopCasualtyBreakdown[];
  };
  
  defenderSummary: {
    name: string;
    initialPower: number;
    finalPower: number;
    powerLost: number;
    powerGained: number;
    totalInitialTroops: number;
    totalSurvivingTroops: number;
    totalWoundedTroops: number;
    totalHospitalized: number;
    totalSanctuary: number;
    totalDead: number;
    casualties: TroopCasualtyBreakdown[];
  };
  
  battleLogs: CombatRoundLog[];
}

/**
 * Compiles real-time multipliers, factors in hero modifiers, research buffers, 
 * building bonuses, and individual unit stats dynamically.
 */
export function compileCombatArmy(input: CombatArmyInput): CompiledArmyState {
  const { researchLevels, buildingLevels, heroes, additionalBuffs } = input;
  
  // --- LOAD OWNER EQUIPMENT FOR STAT INJECTION ---
  let ownerEquipment: any[] = [];
  let ownerPets: any[] = [];
  try {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('eternal_realms_godot_state_v2') : null;
    if (saved) {
      const payload = JSON.parse(saved);
      if (payload.ownerEquipment) {
        ownerEquipment = payload.ownerEquipment;
      }
      if (payload.ownerPets) {
        ownerPets = payload.ownerPets;
      }
    }
  } catch (e) {}

  const activeHeroNames = heroes.map(h => h.id || h.name);
  let petMultiplier = {
    infantryAttack: 0,
    infantryDefense: 0,
    marksmenAttack: 0,
    marksmenDefense: 0,
    cavalryAttack: 0,
    cavalryDefense: 0,
  };
  try {
    petMultiplier = compileActivePetBonuses(ownerPets, activeHeroNames);
  } catch (e) {}

  let eqInfAtkSum = petMultiplier.infantryAttack;
  let eqInfDefSum = petMultiplier.infantryDefense;
  let eqInfHpSum = 0;

  let eqMarkAtkSum = petMultiplier.marksmenAttack;
  let eqMarkDefSum = petMultiplier.marksmenDefense;
  let eqMarkHpSum = 0;

  let eqCavAtkSum = petMultiplier.cavalryAttack;
  let eqCavDefSum = petMultiplier.cavalryDefense;
  let eqCavHpSum = 0;

  // --- 1. RESEARCH GENERAL & SPECIFIC MULTIPLIERS ---
  const resTroopAttack = getResearchBonus(researchLevels, 'Troop Attack');
  const resTroopDefense = getResearchBonus(researchLevels, 'Troop Defense');
  
  const resInfAttack = getResearchBonus(researchLevels, 'Infantry Attack');
  const resInfDefense = getResearchBonus(researchLevels, 'Infantry Defense');
  const resInfHealth = getResearchBonus(researchLevels, 'Infantry Health');
  
  const resMarkAttack = getResearchBonus(researchLevels, 'Marksmen Attack');
  const resMarkDefense = getResearchBonus(researchLevels, 'Marksmen Defense');
  const resMarkHealth = getResearchBonus(researchLevels, 'Marksmen Health');
  
  const resCavAttack = getResearchBonus(researchLevels, 'Cavalry Attack');
  const resCavDefense = getResearchBonus(researchLevels, 'Cavalry Defense');
  const resCavHealth = getResearchBonus(researchLevels, 'Cavalry Health');

  // --- 2. HERO ENGAGEMENT BONUS ---
  // Each hero grants military modifiers based on computed base attributes and ascension buffs
  let heroAttackBuff = 0;
  let heroDefenseBuff = 0;
  let heroHealthBuff = 0;
  let heroCritChanceBuff = 0;
  
  const skillPowerBonus = getResearchBonus(researchLevels, 'Hero Skill Power');
  const skillFactor = 1.0 + skillPowerBonus;

  heroes.forEach((h) => {
    // Retrieve dynamic properties that factor in rarity, level, role, and ascension levels
    const stats = getHeroRecruitedStats(h);
    
    // Convert attack/defense stats to percentage buffs
    const individualAtkBuff = ((stats.attack * 0.015) + (h.level * 0.005)) * skillFactor;
    const individualDefBuff = ((stats.defense * 0.015) + (h.level * 0.005)) * skillFactor;

    // Apply equipment bonuses to global multipliers & specific troop classes
    const heroEq = ownerEquipment.filter(eq => eq.equippedHeroId === h.id || eq.equippedHeroId === h.name);
    if (heroEq.length > 0) {
      const eqBonuses = compileHeroEquipmentBonuses(heroEq, EQUIPMENT_TEMPLATES);
      
      // Expand hero attributes (e.g. 100 flat defense is +8% bonus buff on defense)
      heroAttackBuff += eqBonuses.attackFlat * 0.0008 * skillFactor;
      heroDefenseBuff += eqBonuses.defenseFlat * 0.0008 * skillFactor;
      heroHealthBuff += eqBonuses.healthFlat * 0.0004 * skillFactor;

      eqInfAtkSum += eqBonuses.troopBonuses.infantryAttack;
      eqInfDefSum += eqBonuses.troopBonuses.infantryDefense;
      eqInfHpSum += eqBonuses.troopBonuses.infantryHealth;

      eqMarkAtkSum += eqBonuses.troopBonuses.marksmenAttack;
      eqMarkDefSum += eqBonuses.troopBonuses.marksmenDefense;
      eqMarkHpSum += eqBonuses.troopBonuses.marksmenHealth;

      eqCavAtkSum += eqBonuses.troopBonuses.cavalryAttack;
      eqCavDefSum += eqBonuses.troopBonuses.cavalryDefense;
      eqCavHpSum += eqBonuses.troopBonuses.cavalryHealth;
    }
    
    heroAttackBuff += individualAtkBuff;
    heroDefenseBuff += individualDefBuff;
    
    // Factor in hero role passives directly to enhance military capability
    stats.passiveBonuses.forEach((b) => {
      if (b.stat === 'Troop Attack' || b.stat === 'Infantry Attack' || b.stat === 'Marksmen Attack' || b.stat === 'Cavalry Attack') {
        heroAttackBuff += b.value;
      }
      if (b.stat === 'Troop Defense' || b.stat === 'Infantry Defense' || b.stat === 'Marksmen Defense' || b.stat === 'Cavalry Defense') {
        heroDefenseBuff += b.value;
      }
      if (b.stat === 'Critical Chance') {
        heroCritChanceBuff += b.value;
      }
    });

    // Classify using legacy h.type as well as dynamic template roles
    if (h.type === 'War' || stats.role === 'War') {
      heroAttackBuff += 0.05 * skillFactor; 
      heroDefenseBuff += 0.05 * skillFactor;
      heroHealthBuff += (h.level * 0.01) * skillFactor;
      heroCritChanceBuff += 0.02;
    } else {
      heroHealthBuff += (h.level * 0.005) * skillFactor;
    }
    
    // Generic level scaling crit rates
    heroCritChanceBuff += (h.level * 0.0025);
    
    // Specific ascension skill triggers inside the combat matrix
    if (stats.skills.some(s => s.name === 'Shield Wall')) {
      heroDefenseBuff += 0.05;
    }
    if (stats.skills.some(s => s.name === 'Divine Guard')) {
      heroHealthBuff += 0.10;
    }
    if (stats.skills.some(s => s.name === 'Rally Cry')) {
      heroAttackBuff += 0.05;
    }
  });

  // --- 3. BUILDING FORTRESS INFLUENCE ---
  // Castle adds defensive shields (+1% defense and +0.5% hp per level)
  const castleLvl = buildingLevels['castle'] || 0;
  const castleDefBuff = castleLvl * 0.01;
  const castleHpBuff = castleLvl * 0.005;

  // Academy adds coordinate drill limits (+0.5% attack per level)
  const academyLvl = buildingLevels['academy'] || 0;
  const academyAtkBuff = academyLvl * 0.005;

  // Specific barracks training yard extensions (+0.25% attack per level)
  const barracksLvl = buildingLevels['barracks'] || 0;
  const marksmenCampLvl = buildingLevels['marksmen_camp'] || 0;
  const cavalryStableLvl = buildingLevels['cavalry_stable'] || 0;

  // Consolidated global bonuses
  const globalAttackBonus = resTroopAttack + heroAttackBuff + academyAtkBuff + (additionalBuffs?.attackMultiplier || 0);
  const globalDefenseBonus = resTroopDefense + heroDefenseBuff + castleDefBuff + (additionalBuffs?.defenseMultiplier || 0);
  const globalHealthBonus = heroHealthBuff + castleHpBuff + (additionalBuffs?.healthMultiplier || 0);

  // Compile active structures capacities
  const hospitalLvl = buildingLevels['hospital'] || 0;
  const hospitalCapacity = hospitalLvl * 1000;

  const sanctuaryLvl = buildingLevels['sanctuary'] || 0;
  const sanctuaryCapacity = sanctuaryLvl * 1500;

  // Critical formulas
  const baseCritChance = 0.05; // 5% base
  const criticalChance = Math.min(0.50, baseCritChance + heroCritChanceBuff + (additionalBuffs?.criticalChance || 0));
  const criticalDamageMult = 1.50 + (additionalBuffs?.criticalDamage || 0);

  // Damage reduction caps at 50%
  const damageReduction = Math.min(0.50, (additionalBuffs?.damageReduction || 0) + (castleLvl * 0.005));

  // Compile active troop categories
  const unitGroups: { [troopId: string]: UnitGroupState } = {};
  let initialTotalPower = 0;

  Object.entries(input.troopCounts).forEach(([tid, count]) => {
    if (count <= 0) return;
    const troopData: CrownspireTroop | undefined = TROOP_BY_ID[tid];
    if (!troopData) return;

    // Determine type specific bonuses
    let typeAtk = 0;
    let typeDef = 0;
    let typeHp = 0;
    let bldAtkBonus = 0;

    if (troopData.troopType === 'infantry') {
      typeAtk = resInfAttack + eqInfAtkSum;
      typeDef = resInfDefense + eqInfDefSum;
      typeHp = resInfHealth + eqInfHpSum;
      bldAtkBonus = barracksLvl * 0.0025;
    } else if (troopData.troopType === 'marksmen') {
      typeAtk = resMarkAttack + eqMarkAtkSum;
      typeDef = resMarkDefense + eqMarkDefSum;
      typeHp = resMarkHealth + eqMarkHpSum;
      bldAtkBonus = marksmenCampLvl * 0.0025;
    } else if (troopData.troopType === 'cavalry') {
      typeAtk = resCavAttack + eqCavAtkSum;
      typeDef = resCavDefense + eqCavDefSum;
      typeHp = resCavHealth + eqCavHpSum;
      bldAtkBonus = cavalryStableLvl * 0.0025;
    }

    // Multiply base stats by total compounded multipliers
    const finalAtk = Math.max(1, Math.round(troopData.attack * (1.0 + globalAttackBonus + typeAtk + bldAtkBonus)));
    const finalDef = Math.max(1, Math.round(troopData.defense * (1.0 + globalDefenseBonus + typeDef)));
    const finalHp = Math.max(1, Math.round(troopData.health * (1.0 + globalHealthBonus + typeHp)));

    unitGroups[tid] = {
      troopId: tid,
      name: troopData.name,
      troopType: troopData.troopType,
      tier: troopData.tier,
      initialCount: count,
      currentCount: count,
      basePowerPerUnit: troopData.power,
      attack: finalAtk,
      defense: finalDef,
      health: finalHp
    };

    initialTotalPower += count * troopData.power;
  });

  return {
    name: input.name,
    unitGroups,
    heroes,
    globalAttackBonus,
    globalDefenseBonus,
    globalHealthBonus,
    infantryAttackBonus: resInfAttack,
    infantryDefenseBonus: resInfDefense,
    infantryHealthBonus: resInfHealth,
    marksmenAttackBonus: resMarkAttack,
    marksmenDefenseBonus: resMarkDefense,
    marksmenHealthBonus: resMarkHealth,
    cavalryAttackBonus: resCavAttack,
    cavalryDefenseBonus: resCavDefense,
    cavalryHealthBonus: resCavHealth,
    criticalChance,
    criticalDamageMult,
    damageReduction,
    hospitalCapacity,
    sanctuaryCapacity,
    initialTotalPower
  };
}

/**
 * Core battle runner simulating round-by-round strategy board conflicts.
 * Evaluates troop counters, crits, defenses, and produces clean reports.
 */
export function executeCombatSimulation(
  attackerInput: CombatArmyInput,
  defenderInput: CombatArmyInput,
  mode: 'campaign' | 'monster_hunt' | 'pvp' | 'rally' | 'alliance_war' | 'world_boss' = 'pvp'
): DetailedBattleResult {
  
  // Compile the two participant armies
  const att = compileCombatArmy(attackerInput);
  const def = compileCombatArmy(defenderInput);
  
  const battleLogs: CombatRoundLog[] = [];
  let roundNum = 1;
  const maxRounds = 15;
  
  // Loop through rounds of engagement
  while (roundNum <= maxRounds) {
    const roundActions: string[] = [];
    
    const attLiving = Object.values(att.unitGroups).filter(g => g.currentCount > 0);
    const defLiving = Object.values(def.unitGroups).filter(g => g.currentCount > 0);
    
    if (attLiving.length === 0 || defLiving.length === 0) {
      break;
    }
    
    // --- STEP 1: Attacker attacks Defender ---
    compilePhaseStriking(roundNum, att, def, roundActions);
    
    // --- STEP 2: Defender attacks Attacker (simultaneous block response) ---
    compilePhaseStriking(roundNum, def, att, roundActions);
    
    // Gather counts after both phases resolve
    const attCount = Object.values(att.unitGroups).reduce((acc, curr) => acc + curr.currentCount, 0);
    const defCount = Object.values(def.unitGroups).reduce((acc, curr) => acc + curr.currentCount, 0);
    
    battleLogs.push({
      round: roundNum,
      actions: roundActions,
      attackerRemainingCount: attCount,
      defenderRemainingCount: defCount
    });
    
    if (attCount === 0 || defCount === 0) {
      break;
    }
    
    roundNum++;
  }
  
  // Let's determine winner
  const attFinalCount = Object.values(att.unitGroups).reduce((acc, curr) => acc + curr.currentCount, 0);
  const defFinalCount = Object.values(def.unitGroups).reduce((acc, curr) => acc + curr.currentCount, 0);
  
  let winner: 'attacker' | 'defender' | 'draw' = 'draw';
  let victoryReason = '';
  
  if (attFinalCount > 0 && defFinalCount === 0) {
    winner = 'attacker';
    victoryReason = `${att.name} has completely annihilated all defender forces.`;
  } else if (defFinalCount > 0 && attFinalCount === 0) {
    winner = 'defender';
    victoryReason = `${def.name} has successfully defended and eliminated all attacking forces.`;
  } else if (attFinalCount > 0 && defFinalCount > 0) {
    // Draw by round limit, evaluate who has highest remaining troops power percentage
    let attFinalPower = 0;
    Object.values(att.unitGroups).forEach(g => {
      attFinalPower += g.currentCount * g.basePowerPerUnit;
    });
    
    let defFinalPower = 0;
    Object.values(def.unitGroups).forEach(g => {
      defFinalPower += g.currentCount * g.basePowerPerUnit;
    });
    
    const attRatio = att.initialTotalPower > 0 ? (attFinalPower / att.initialTotalPower) : 0;
    const defRatio = def.initialTotalPower > 0 ? (defFinalPower / def.initialTotalPower) : 0;
    
    if (attRatio > defRatio) {
      winner = 'attacker';
      victoryReason = `${att.name} wins by strategy points (Round limit reached: ${attRatio * 100}% surviving power vs ${defRatio * 100}%).`;
    } else if (defRatio > attRatio) {
      winner = 'defender';
      victoryReason = `${def.name} wins by strategy points (Round limit reached: ${defRatio * 100}% surviving power vs ${attRatio * 100}%).`;
    } else {
      winner = 'draw';
      victoryReason = `Absolute stalemate after ${maxRounds} rounds of intense trench warfare.`;
    }
  } else {
    winner = 'draw';
    victoryReason = 'Both armies collapsed simultaneously under the final cross-fire.';
  }
  
  // --- AFTERMATH: CASUALTY BREAKDOWNS ---
  // Depending on battle mode, determine casualty properties
  // Campaign battles have lower permanent dead rates (e.g. 10% dead, 90% wounded)
  // PvP has higher rates (e.g. 40% dead, 60% wounded)
  let baseWoundedRate = 0.60; 
  if (mode === 'campaign' || mode === 'monster_hunt' || mode === 'world_boss') {
    baseWoundedRate = 0.90; // High survivability in PvE
  }
  
  const attackerCasualties = computeAftermath(att, baseWoundedRate);
  const defenderCasualties = computeAftermath(def, baseWoundedRate);
  
  // Power stats
  let attFinalPower = 0;
  attackerCasualties.forEach(c => {
    attFinalPower += c.survived * c.basePowerPerUnit;
  });
  
  let defFinalPower = 0;
  defenderCasualties.forEach(c => {
    defFinalPower += c.survived * c.basePowerPerUnit;
  });
  
  const attPowerLost = Math.max(0, att.initialTotalPower - attFinalPower);
  const defPowerLost = Math.max(0, def.initialTotalPower - defFinalPower);
  
  // Battle power gained is some faction of the dead enemy troops power + a base gain for victor
  let attGained = 0;
  let defGained = 0;
  
  if (winner === 'attacker') {
    attGained = Math.round(defPowerLost * 0.15) + 500;
    defGained = Math.round(attPowerLost * 0.05);
  } else if (winner === 'defender') {
    defGained = Math.round(attPowerLost * 0.15) + 500;
    attGained = Math.round(defPowerLost * 0.05);
  } else {
    attGained = Math.round(defPowerLost * 0.08);
    defGained = Math.round(attPowerLost * 0.08);
  }

  return {
    winner,
    victoryReason,
    roundsPlayed: Math.min(maxRounds, roundNum),
    attackerSummary: {
      name: att.name,
      initialPower: att.initialTotalPower,
      finalPower: attFinalPower,
      powerLost: attPowerLost,
      powerGained: attGained,
      totalInitialTroops: Object.values(att.unitGroups).reduce((acc, curr) => acc + curr.initialCount, 0),
      totalSurvivingTroops: attackerCasualties.reduce((acc, curr) => acc + curr.survived, 0),
      totalWoundedTroops: attackerCasualties.reduce((acc, curr) => acc + curr.wounded, 0),
      totalHospitalized: attackerCasualties.reduce((acc, curr) => acc + curr.hospitalized, 0),
      totalSanctuary: attackerCasualties.reduce((acc, curr) => acc + curr.sanctuary, 0),
      totalDead: attackerCasualties.reduce((acc, curr) => acc + curr.dead, 0),
      casualties: attackerCasualties
    },
    defenderSummary: {
      name: def.name,
      initialPower: def.initialTotalPower,
      finalPower: defFinalPower,
      powerLost: defPowerLost,
      powerGained: defGained,
      totalInitialTroops: Object.values(def.unitGroups).reduce((acc, curr) => acc + curr.initialCount, 0),
      totalSurvivingTroops: defenderCasualties.reduce((acc, curr) => acc + curr.survived, 0),
      totalWoundedTroops: defenderCasualties.reduce((acc, curr) => acc + curr.wounded, 0),
      totalHospitalized: defenderCasualties.reduce((acc, curr) => acc + curr.hospitalized, 0),
      totalSanctuary: defenderCasualties.reduce((acc, curr) => acc + curr.sanctuary, 0),
      totalDead: defenderCasualties.reduce((acc, curr) => acc + curr.dead, 0),
      casualties: defenderCasualties
    },
    battleLogs
  };
}

/**
 * Executes a round strike: attacker units deal damage to defender units.
 */
function compilePhaseStriking(
  round: number,
  striker: CompiledArmyState,
  receiver: CompiledArmyState,
  actions: string[]
): void {
  const receivingGroups = Object.values(receiver.unitGroups).filter(g => g.currentCount > 0);
  if (receivingGroups.length === 0) return;
  
  // Process attack for each striker group
  Object.values(striker.unitGroups).forEach((strGroup) => {
    if (strGroup.currentCount <= 0) return;
    
    // Choose optimal target based on Rock-Paper-Scissors:
    // Infantry counters Cavalry; Cavalry counters Marksmen; Marksmen counters Infantry
    let idealType: 'infantry' | 'marksmen' | 'cavalry' = 'infantry';
    if (strGroup.troopType === 'infantry') {
      idealType = 'cavalry';
    } else if (strGroup.troopType === 'cavalry') {
      idealType = 'marksmen';
    } else if (strGroup.troopType === 'marksmen') {
      idealType = 'infantry';
    }
    
    // Prioritize living targets matching class
    let target = receivingGroups.find(g => g.troopType === idealType);
    let isCountering = false;
    
    if (target) {
      isCountering = true;
    } else {
      // Find generic target from other living groups (lowest HP first to eliminate them)
      receivingGroups.sort((a, b) => (a.currentCount * a.health) - (b.currentCount * b.health));
      target = receivingGroups[0];
    }
    
    if (!target) return;
    
    // Calculate Raw Attack Damage
    let damageFactor = 0.95 + (Math.random() * 0.10); // small random noise [0.95 - 1.05]
    let baseDamage = strGroup.currentCount * strGroup.attack * damageFactor;
    
    // Apply Counter Boosts
    if (isCountering) {
      baseDamage *= 1.50; // Deal +50% counter damage
    }
    
    // Critical Hit Check
    const isCrit = Math.random() < striker.criticalChance;
    if (isCrit) {
      baseDamage *= striker.criticalDamageMult;
    }
    
    // Apply Receiver Defense damage reduction
    // Damage factor reduced by Target DEF: Def / (Def + 400) up to 85% reduction max
    const defReduction = target.defense / (target.defense + 400);
    const totalReduction = Math.min(0.85, defReduction) * (1.0 - receiver.damageReduction);
    
    let finalDamage = Math.max(1, Math.round(baseDamage * (1.0 - totalReduction)));
    
    // Apply casualties against defender's health pool
    const targetAlivePre = target.currentCount;
    const casualtiesCount = Math.min(target.currentCount, Math.floor(finalDamage / target.health));
    target.currentCount = Math.max(0, target.currentCount - casualtiesCount);
    
    if (casualtiesCount > 0) {
      let actionStr = `🗡️ Round ${round}: ${striker.name}'s ${strGroup.currentCount}x ${strGroup.name} (T${strGroup.tier})`;
      if (isCrit) {
        actionStr += ` LANDS A DEVISTATING CRITICAL STRIKE against`;
      } else {
        actionStr += ` attacks`;
      }
      actionStr += ` ${receiver.name}'s ${targetAlivePre}x ${target.name} (T${target.tier}), dealing ${finalDamage.toLocaleString()} damage and slating ${casualtiesCount}x units.`;
      
      if (isCountering) {
        actionStr += ` (Flank Counter Bonus applied)`;
      }
      actions.push(actionStr);
    }
  });
}

/**
 * Computes casualty categorization and filters wounded cohorts into
 * Sacred Hospital beds or Sanctuary chambers, with remainder as Dead.
 */
function computeAftermath(
  army: CompiledArmyState,
  baseWoundedRate: number
): TroopCasualtyBreakdown[] {
  let remainingHospital = army.hospitalCapacity;
  let remainingSanctuary = army.sanctuaryCapacity;
  
  return Object.values(army.unitGroups).map((g) => {
    const casualties = g.initialCount - g.currentCount;
    
    if (casualties <= 0) {
      return {
        troopId: g.troopId,
        name: g.name,
        troopType: g.troopType,
        tier: g.tier,
        initialCount: g.initialCount,
        survived: g.initialCount,
        wounded: 0,
        hospitalized: 0,
        sanctuary: 0,
        dead: 0,
        basePowerPerUnit: g.basePowerPerUnit
      } as any;
    }
    
    // 1. Determine base wounded pool
    const totalWounded = Math.round(casualties * baseWoundedRate);
    const outrightKilled = casualties - totalWounded;
    
    // 2. Draft troops into Sacred Hospital up to capacity limit boundaries
    const hospitalized = Math.min(totalWounded, remainingHospital);
    remainingHospital -= hospitalized;
    
    // 3. Overflow goes to Sanctuary Sanctuary Chambers
    const remainingWounded = totalWounded - hospitalized;
    const sanctuarySlots = Math.min(remainingWounded, remainingSanctuary);
    remainingSanctuary -= sanctuarySlots;
    
    // 4. Excess wounded who couldn't fit are lost as permanent Dead
    const overflowDead = remainingWounded - sanctuarySlots;
    const totalDead = outrightKilled + overflowDead;
    
    return {
      troopId: g.troopId,
      name: g.name,
      troopType: g.troopType,
      tier: g.tier,
      initialCount: g.initialCount,
      survived: g.currentCount,
      wounded: totalWounded,
      hospitalized,
      sanctuary: sanctuarySlots,
      dead: totalDead,
      basePowerPerUnit: g.basePowerPerUnit
    };
  });
}

// =========================================================================
//            REUSABLE TACTICAL COMBAT HANDLERS FOR SPECIFIC SERVICES
// =========================================================================

/**
 * REUSABLE 1: Campaign Battle Simulation
 * Integrates directly with selected campaign parameters.
 */
export function simulateCampaignBattle(
  playerInput: CombatArmyInput,
  enemyUnits: { [troopId: string]: number },
  bossStrengthOffset: number = 0
): DetailedBattleResult {
  const enemyInput: CombatArmyInput = {
    name: 'Gorgon Overlord Vanguard',
    troopCounts: enemyUnits,
    heroes: [],
    researchLevels: {},
    buildingLevels: {},
    additionalBuffs: {
      attackMultiplier: 0.10 + bossStrengthOffset,
      defenseMultiplier: 0.10 + bossStrengthOffset,
      healthMultiplier: 0.10
    }
  };
  
  return executeCombatSimulation(playerInput, enemyInput, 'campaign');
}

/**
 * REUSABLE 2: Monster Hunt Simulation
 * Engages a single massive beast or crypt warden.
 */
export function simulateMonsterHunt(
  playerInput: CombatArmyInput,
  monsterName: string,
  monsterLevel: number
): DetailedBattleResult {
  // Try to locate the monster inside the central Crownspire Monster Database
  const monsterKey = monsterName.toLowerCase();
  const monster = CROWNSPIRE_MONSTERS_DATABASE.find(
    m => m.id === monsterName || m.name.toLowerCase() === monsterKey || m.name.toLowerCase().includes(monsterKey)
  );

  let monsterHP: number;
  let monsterATK: number;
  let monsterDEF: number;
  let power: number;
  let weaknessBonus = 0;

  if (monster) {
    monsterHP = monster.health;
    monsterATK = monster.attack;
    monsterDEF = monster.defense;
    power = monster.power;

    const weakness = monster.troopWeakness;
    if (weakness && weakness !== 'none') {
      let totalCount = 0;
      let weakCount = 0;
      Object.entries(playerInput.troopCounts).forEach(([tid, count]) => {
        totalCount += count;
        const troop = TROOP_BY_ID[tid];
        if (troop && troop.troopType === weakness) {
          weakCount += count;
        }
      });
      const ratio = totalCount > 0 ? (weakCount / totalCount) : 0;
      // Grant player up to 40% defense/attack modifier if composition exploits monster weakness
      weaknessBonus = ratio * 0.40;
    }
  } else {
    // A single monster acts as a heavy elite unit group with colossal stats
    monsterHP = 50000 * Math.pow(1.8, monsterLevel - 1);
    monsterATK = 1200 * Math.pow(1.6, monsterLevel - 1);
    monsterDEF = 1500 * Math.pow(1.5, monsterLevel - 1);
    power = Math.round(5000 * Math.pow(2.0, monsterLevel - 1));
  }

  // Inject computed tactical weakness multiplier benefits
  const adjustedPlayerInput: CombatArmyInput = {
    ...playerInput,
    additionalBuffs: {
      ...playerInput.additionalBuffs,
      attackMultiplier: (playerInput.additionalBuffs?.attackMultiplier || 0) + weaknessBonus,
      defenseMultiplier: (playerInput.additionalBuffs?.defenseMultiplier || 0) + weaknessBonus
    }
  };

  const monsterInput: CombatArmyInput = {
    name: monster ? monster.name : `Lvl ${monsterLevel} ${monsterName}`,
    // Set troop counts as a single customized heavy monster unit
    troopCounts: {
      'infantry_t12': 1 // Use an arbitrary high tier placeholder for engine
    },
    heroes: [],
    researchLevels: {},
    buildingLevels: {},
    additionalBuffs: {
      // Scale attributes explicitly to mock the beast's giant pool
      attackMultiplier: (monsterATK / 5200) - 1.0, // scale relative to T12 baseline
      defenseMultiplier: (monsterDEF / 5500) - 1.0,
      healthMultiplier: (monsterHP / 28000) - 1.0
    }
  };
  
  return executeCombatSimulation(adjustedPlayerInput, monsterInput, 'monster_hunt');
}

/**
 * REUSABLE 3: PvP Battle Simulation
 * A direct dual between two Sovereigns.
 */
export function simulatePvPBattle(
  attacker: CombatArmyInput,
  defender: CombatArmyInput
): DetailedBattleResult {
  return executeCombatSimulation(attacker, defender, 'pvp');
}

/**
 * REUSABLE 4: Rally Battles Simulation
 * Simulates multiple players joining a rally to attack a massive defense coordinate.
 */
export function simulateRallyBattle(
  challengers: CombatArmyInput[],
  defender: CombatArmyInput
): DetailedBattleResult {
  // Merge multiple challenger armies into a single consolidated, allied army
  const consolidatedCounts: { [tid: string]: number } = {};
  const consolidatedHeroes: Hero[] = [];
  const bestResearchLevels: { [id: string]: number } = {};
  const bestBuildingLevels: { [id: string]: number } = {};
  
  challengers.forEach((c) => {
    // Add troops
    Object.entries(c.troopCounts).forEach(([tid, count]) => {
      consolidatedCounts[tid] = (consolidatedCounts[tid] || 0) + count;
    });
    
    // Gather unique heroes (up to max strategic army limits of 5)
    c.heroes.forEach((h) => {
      if (consolidatedHeroes.length < 5 && !consolidatedHeroes.find(ch => ch.name === h.name)) {
        consolidatedHeroes.push(h);
      }
    });

    // Rally borrows the highest research and building levels among its contributors!
    Object.entries(c.researchLevels).forEach(([rid, lvl]) => {
      bestResearchLevels[rid] = Math.max(bestResearchLevels[rid] || 0, lvl);
    });
    Object.entries(c.buildingLevels).forEach(([bid, lvl]) => {
      bestBuildingLevels[bid] = Math.max(bestBuildingLevels[bid] || 0, lvl);
    });
  });

  const aggregateAttacker: CombatArmyInput = {
    name: `${challengers[0]?.name || 'Allied'} Coalition Force`,
    troopCounts: consolidatedCounts,
    heroes: consolidatedHeroes,
    researchLevels: bestResearchLevels,
    buildingLevels: bestBuildingLevels,
    additionalBuffs: {
      // Rally marches gain standard formation co-op damage buffers (+10%)
      attackMultiplier: 0.10,
      defenseMultiplier: 0.10
    }
  };

  return executeCombatSimulation(aggregateAttacker, defender, 'rally');
}

/**
 * REUSABLE 5: Alliance Wars Simulation
 * Simulates a large-scale war between multiple members of two separate alliances.
 */
export function simulateAllianceWar(
  coalitionA: CombatArmyInput[],
  coalitionB: CombatArmyInput[]
): DetailedBattleResult {
  // Consolidate both coalitions separately
  const compileCoalition = (marchList: CombatArmyInput[], sideName: string): CombatArmyInput => {
    const counts: { [tid: string]: number } = {};
    const heroes: Hero[] = [];
    const bestResearch: { [id: string]: number } = {};
    const bestBuildings: { [id: string]: number } = {};
    
    marchList.forEach((march) => {
      Object.entries(march.troopCounts).forEach(([tid, val]) => {
        counts[tid] = (counts[tid] || 0) + val;
      });
      march.heroes.forEach((h) => {
        if (heroes.length < 8 && !heroes.find(ch => ch.name === h.name)) {
          heroes.push(h);
        }
      });
      Object.entries(march.researchLevels).forEach(([rid, lvl]) => {
        bestResearch[rid] = Math.max(bestResearch[rid] || 0, lvl);
      });
      Object.entries(march.buildingLevels).forEach(([bid, lvl]) => {
        bestBuildings[bid] = Math.max(bestBuildings[bid] || 0, lvl);
      });
    });

    return {
      name: sideName,
      troopCounts: counts,
      heroes,
      researchLevels: bestResearch,
      buildingLevels: bestBuildings,
      additionalBuffs: {
        attackMultiplier: 0.15, // Grand tactical co-op scaling
        defenseMultiplier: 0.15,
        damageReduction: 0.05
      }
    };
  };

  const armyA = compileCoalition(coalitionA, 'Alliance Legions Alfa');
  const armyB = compileCoalition(coalitionB, 'Alliance Legions Omega');

  return executeCombatSimulation(armyA, armyB, 'alliance_war');
}

/**
 * REUSABLE 6: World Boss Battle Simulation
 * A persistent server-heavy raid encounter where players make dent strikes.
 */
export function simulateWorldBossBattle(
  worldBossName: string,
  bossBaseHP: number,
  bossRemainingHP: number,
  bossAttackRating: number,
  playerArmies: CombatArmyInput[]
): DetailedBattleResult {
  // Check central Crownspire Monster Database for world boss profiles
  const boss = CROWNSPIRE_MONSTERS_DATABASE.find(
    m => m.id === worldBossName || m.name.toLowerCase() === worldBossName.toLowerCase() || m.name.toLowerCase().includes(worldBossName.toLowerCase())
  );

  let weaknessBonus = 0;
  if (boss && boss.troopWeakness && boss.troopWeakness !== 'none') {
    // Calculate weakness ratio across all player armies' combined counts
    let totalCount = 0;
    let weakCount = 0;
    playerArmies.forEach(army => {
      Object.entries(army.troopCounts).forEach(([tid, count]) => {
        totalCount += count;
        const troop = TROOP_BY_ID[tid];
        if (troop && troop.troopType === boss.troopWeakness) {
          weakCount += count;
        }
      });
    });
    const ratio = totalCount > 0 ? (weakCount / totalCount) : 0;
    // Up to 45% attack multiplier bonus for exploiting world boss weaknesses in crossfire
    weaknessBonus = ratio * 0.45;
  }

  // Consolidate player armies
  const combinedPlayerInputs = playerArmies.map((army, idx) => {
    return {
      ...army,
      additionalBuffs: {
        ...army.additionalBuffs,
        // Small critical hit chance synergy from multi-march crossfire
        criticalChance: (army.additionalBuffs?.criticalChance || 0) + 0.05
      }
    };
  });

  // Turn into a Coalition march setup
  const consolidatedPlayersCounts: { [tid: string]: number } = {};
  const consolidatedHeroes: Hero[] = [];
  const bestResearchLevels: { [id: string]: number } = {};
  const bestBuildingLevels: { [id: string]: number } = {};
  
  combinedPlayerInputs.forEach((p) => {
    Object.entries(p.troopCounts).forEach(([tid, count]) => {
      consolidatedPlayersCounts[tid] = (consolidatedPlayersCounts[tid] || 0) + count;
    });
    p.heroes.forEach((h) => {
      if (consolidatedHeroes.length < 5 && !consolidatedHeroes.find(ch => ch.name === h.name)) {
        consolidatedHeroes.push(h);
      }
    });
    Object.entries(p.researchLevels).forEach(([rid, lvl]) => {
      bestResearchLevels[rid] = Math.max(bestResearchLevels[rid] || 0, lvl);
    });
    Object.entries(p.buildingLevels).forEach(([bid, lvl]) => {
      bestBuildingLevels[bid] = Math.max(bestBuildingLevels[bid] || 0, lvl);
    });
  });

  const playersCoalition: CombatArmyInput = {
    name: 'Sovereign Raid Alliance',
    troopCounts: consolidatedPlayersCounts,
    heroes: consolidatedHeroes,
    researchLevels: bestResearchLevels,
    buildingLevels: bestBuildingLevels,
    additionalBuffs: {
      attackMultiplier: 0.20 + weaknessBonus, // Grand battle focus Co-op bonus + weakness exploit
      defenseMultiplier: 0.10 + weaknessBonus
    }
  };

  // Adjust boss attributes based on database or inputs
  const resolvedRemainingHP = boss ? Math.min(boss.health, bossRemainingHP) : bossRemainingHP;
  const resolvedAttackRating = boss ? boss.attack : bossAttackRating;
  const resolvedDefenseArmor = boss ? boss.defense : 5500;

  // Model the boss as an army with a single colossal unit representing its HP
  const bossInput: CombatArmyInput = {
    name: boss ? boss.name : worldBossName,
    troopCounts: {
      'infantry_t12': 1 // mock core
    },
    heroes: [],
    researchLevels: {},
    buildingLevels: {},
    additionalBuffs: {
      // Scale boss hp relative to T12 values
      healthMultiplier: (resolvedRemainingHP / 28000) - 1.0, 
      attackMultiplier: (resolvedAttackRating / 5200) - 1.0,
      defenseMultiplier: (resolvedDefenseArmor / 5500) - 1.0 + 1.50 // Boss has massive scaling armor
    }
  };

  return executeCombatSimulation(playersCoalition, bossInput, 'world_boss');
}
