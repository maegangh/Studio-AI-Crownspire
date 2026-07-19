import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Heart, 
  Zap, 
  Flame, 
  Snowflake, 
  Sparkles, 
  Swords, 
  Activity, 
  ShieldAlert, 
  Crosshair, 
  RotateCcw,
  Volume2,
  Sword,
  ShieldCheck,
  PlusCircle,
  HelpCircle
} from 'lucide-react';

// ==========================================
// DATA STRUCTURES & DEFINITIONS
// ==========================================

export interface CombatHero {
  id: string;
  name: string;
  title: string;
  role: 'Infantry' | 'Marksmen' | 'Guardian';
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
  hp: number;
  maxHp: number;
  energy: number;
  maxEnergy: number;
  shield: number;
  attackPower: number;
  status: string;
  ultimateName: string;
  ultimateDesc: string;
  passiveName: string;
  passiveDesc: string;
}

export interface CombatEnemy {
  id: string;
  name: string;
  emoji: string;
  color: string;
  hp: number;
  maxHp: number;
  attackPower: number;
  maxCooldown: number;
  cooldown: number;
  isBoss: boolean;
  statusEffects: { type: 'burn' | 'freeze' | 'slow'; duration: number; value?: number }[];
}

export interface DamagePop {
  id: string;
  value: string;
  type: 'damage' | 'heal' | 'shield' | 'critical' | 'ultimate' | 'burn' | 'freeze';
  x: number;
  y: number;
}

export interface CombatLog {
  id: string;
  text: string;
  type: 'info' | 'player' | 'enemy' | 'system' | 'ultimate' | 'passive';
  timestamp: string;
}

// Initial heroes helper
export const INITIAL_HEROES = (): CombatHero[] => [
  {
    id: 'valen_solar',
    name: 'Valen Solar',
    title: 'The Blazing Blade',
    role: 'Infantry',
    emoji: '⚔️',
    color: 'text-rose-400',
    bgColor: 'bg-rose-950/40',
    borderColor: 'border-rose-500/40',
    glowColor: 'shadow-rose-500/30',
    hp: 1500,
    maxHp: 1500,
    energy: 0,
    maxEnergy: 100,
    shield: 0,
    attackPower: 180,
    status: 'Ready',
    ultimateName: 'Solar Inferno Slash',
    ultimateDesc: 'Deals 650 heavy critical damage & inflicts Burn status for 3 turns.',
    passiveName: 'Valor Radiance',
    passiveDesc: 'Increases active hero damage by 15% for every sword/fire match.'
  },
  {
    id: 'lyra_frost',
    name: 'Lyra Frost',
    title: 'Chrono Marksman',
    role: 'Marksmen',
    emoji: '🏹',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-950/40',
    borderColor: 'border-cyan-500/40',
    glowColor: 'shadow-cyan-500/30',
    hp: 1200,
    maxHp: 1200,
    energy: 0,
    maxEnergy: 100,
    shield: 0,
    attackPower: 160,
    status: 'Ready',
    ultimateName: 'Glacial Time Barrage',
    ultimateDesc: 'Deals 400 frost damage and Freezes target, adding +2 to enemy action cooldowns.',
    passiveName: 'Chill Precision',
    passiveDesc: 'Deals 25% bonus critical damage to enemies currently frozen or slowed.'
  },
  {
    id: 'aethelgard_stone',
    name: 'Aethelgard Bastion',
    title: 'The Obsidian Core',
    role: 'Guardian',
    emoji: '🛡️',
    color: 'text-amber-400',
    bgColor: 'bg-amber-950/40',
    borderColor: 'border-amber-500/40',
    glowColor: 'shadow-amber-500/30',
    hp: 2000,
    maxHp: 2000,
    energy: 0,
    maxEnergy: 100,
    shield: 0,
    attackPower: 120,
    status: 'Ready',
    ultimateName: 'Aegis Prism Sanctuary',
    ultimateDesc: 'Generates a strong 800 HP defensive shield buffer across all heroes.',
    passiveName: 'Fortress Heart',
    passiveDesc: 'Shield/earth matches restore 8% missing health to the lowest HP hero.'
  }
];

// World enemies builder helper
export const WORLD_ENEMIES_BUILDER = (world: number, floor: number = 1): CombatEnemy[] => {
  const scaling = Math.max(1, floor / 2);
  if (world === 1) {
    return [
      {
        id: 'crystal_golem',
        name: 'Crystal Golem',
        emoji: '💎',
        color: 'from-blue-600 to-indigo-800',
        hp: 1200,
        maxHp: 1200,
        attackPower: 150,
        maxCooldown: 3,
        cooldown: 3,
        isBoss: false,
        statusEffects: []
      },
      {
        id: 'peak_monarch_boss',
        name: 'Obsidian Chimera [BOSS]',
        emoji: '🦁',
        color: 'from-purple-700 to-fuchsia-900',
        hp: 3500,
        maxHp: 3500,
        attackPower: 260,
        maxCooldown: 4,
        cooldown: 4,
        isBoss: true,
        statusEffects: []
      }
    ];
  } else if (world === 2) {
    return [
      {
        id: 'dune_scorpion',
        name: 'Sunscorch Sentinel',
        emoji: '🦂',
        color: 'from-amber-600 to-red-800',
        hp: 2400,
        maxHp: 2400,
        attackPower: 190,
        maxCooldown: 3,
        cooldown: 3,
        isBoss: false,
        statusEffects: []
      },
      {
        id: 'scorched_drake_boss',
        name: 'Scorched Sunspire Drake [BOSS]',
        emoji: '🐲',
        color: 'from-rose-600 to-orange-500',
        hp: 6000,
        maxHp: 6000,
        attackPower: 320,
        maxCooldown: 4,
        cooldown: 4,
        isBoss: true,
        statusEffects: []
      }
    ];
  } else {
    // World 3 or extreme scaling
    return [
      {
        id: `abyss_overlord_${floor}`,
        name: `Aether Overlord (Floor ${floor})`,
        emoji: '💀',
        color: 'from-violet-700 to-indigo-950',
        hp: Math.round(3000 * scaling),
        maxHp: Math.round(3000 * scaling),
        attackPower: Math.round(200 * scaling),
        maxCooldown: 3,
        cooldown: 3,
        isBoss: false,
        statusEffects: []
      },
      {
        id: `volcanic_colossus_boss_${floor}`,
        name: `Grand Volcanic Colossus [BOSS]`,
        emoji: '🌋',
        color: 'from-red-800 to-zinc-950',
        hp: Math.round(8000 * scaling),
        maxHp: Math.round(8000 * scaling),
        attackPower: Math.round(380 * scaling),
        maxCooldown: 4,
        cooldown: 4,
        isBoss: true,
        statusEffects: []
      }
    ];
  }
};

// ==========================================
// INTERACTIVE COMBAT ARENA COMPONENT
// ==========================================

export interface CombatArenaRef {
  handleMatchEvent: (tileTypeId: string) => void;
  resetBattle: (worldNum: number, floorNum: number) => void;
  triggerPuzzleVictory: () => void;
  triggerPuzzleDefeat: () => void;
}

interface CombatArenaProps {
  world: number;
  floor: number;
  onVictory: () => void;
  onDefeat: () => void;
  onLogMessage: (msg: string, type: 'info' | 'success' | 'warning') => void;
}

export const CrystalVaultCombatArena = forwardRef<CombatArenaRef, CombatArenaProps>(
  ({ world, floor, onVictory, onDefeat, onLogMessage }, ref) => {
    // Combat Game State variables
    const [heroes, setHeroes] = useState<CombatHero[]>(INITIAL_HEROES());
    const [enemyQueue, setEnemyQueue] = useState<CombatEnemy[]>([]);
    const [activeEnemy, setActiveEnemy] = useState<CombatEnemy | null>(null);
    const [combatLogs, setCombatLogs] = useState<CombatLog[]>([]);
    const [floatingPops, setFloatingPops] = useState<DamagePop[]>([]);
    
    // Animation/State indicators
    const [arenaVfx, setArenaVfx] = useState<string | null>(null);
    const [shakeScreen, setShakeScreen] = useState<boolean>(false);
    const [activeWave, setActiveWave] = useState<number>(1);
    const [totalWaves, setTotalWaves] = useState<number>(2);
    const [isBattleActive, setIsBattleActive] = useState<boolean>(true);
    const [turnsSpent, setTurnsSpent] = useState<number>(0);

    // Audio Playback Hook Placeholder
    const playCombatAudio = (type: string) => {
      // Direct logs simulation for premium sound feedback
      console.log(`[SFX PLAYBACK]: ${type}`);
    };

    // Initialize battlefield state
    const initializeBattleState = (worldNum: number, floorNum: number) => {
      const h = INITIAL_HEROES();
      const eq = WORLD_ENEMIES_BUILDER(worldNum, floorNum);
      
      setHeroes(h);
      setEnemyQueue(eq.slice(1));
      setActiveEnemy(eq[0]);
      setActiveWave(1);
      setTotalWaves(eq.length);
      setTurnsSpent(0);
      setFloatingPops([]);
      setArenaVfx(null);
      setShakeScreen(false);
      setIsBattleActive(true);

      const introLog: CombatLog = {
        id: Math.random().toString(),
        text: `⚔️ BATTLE INITIATED: Floor ${floorNum} (World ${worldNum}). Face the ${eq[0].name}!`,
        type: 'system',
        timestamp: new Date().toLocaleTimeString()
      };
      setCombatLogs([introLog]);
      onLogMessage(`Combat arena initialized for World ${worldNum} - Floor ${floorNum}`, 'info');
    };

    // Setup initial battle on mount
    useEffect(() => {
      initializeBattleState(world, floor);
    }, [world, floor]);

    // Handle incoming external API requests via Ref handles
    useImperativeHandle(ref, () => ({
      handleMatchEvent(tileTypeId: string) {
        if (!isBattleActive || !activeEnemy) return;
        processMatchEvent(tileTypeId);
      },
      resetBattle(worldNum: number, floorNum: number) {
        initializeBattleState(worldNum, floorNum);
      },
      triggerPuzzleVictory() {
        if (!isBattleActive) return;
        handleFinalVictorySurge();
      },
      triggerPuzzleDefeat() {
        if (!isBattleActive) return;
        handleTeamWipe();
      }
    }));

    // Add floating number popups
    const spawnDamagePop = (value: string, type: DamagePop['type'], x: number, y: number) => {
      const id = Math.random().toString();
      const newPop: DamagePop = { id, value, type, x, y };
      setFloatingPops(prev => [...prev, newPop]);
      setTimeout(() => {
        setFloatingPops(prev => prev.filter(p => p.id !== id));
      }, 1000);
    };

    // Local logging engine
    const addCombatLog = (text: string, type: CombatLog['type']) => {
      const newLog: CombatLog = {
        id: Math.random().toString(),
        text,
        type,
        timestamp: new Date().toLocaleTimeString()
      };
      setCombatLogs(prev => [newLog, ...prev.slice(0, 49)]);
    };

    // ==========================================
    // COMBAT ENGINE ENGINE RESOLUTION (MATCH)
    // ==========================================
    const processMatchEvent = (tileTypeId: string) => {
      if (!activeEnemy || !isBattleActive) return;

      // Increment turn counter
      setTurnsSpent(prev => prev + 1);

      // Deep copy variables
      let updatedEnemy = { ...activeEnemy };
      let updatedHeroes = heroes.map(h => ({ ...h }));
      let logsToAdd: { text: string; type: CombatLog['type'] }[] = [];

      // Determine match-type details
      let attackPowerMult = 1.0;
      let burnTick = false;
      let freezeApplied = false;

      // 1. Evaluate Status effects on Enemy BEFORE action
      updatedEnemy.statusEffects = updatedEnemy.statusEffects
        .map(eff => {
          if (eff.type === 'burn') {
            const burnDamage = 120;
            updatedEnemy.hp = Math.max(0, updatedEnemy.hp - burnDamage);
            spawnDamagePop(`-${burnDamage} Burn`, 'burn', 60 + Math.random() * 20, 30);
            logsToAdd.push({ text: `🔥 BURN ACTIVE: ${updatedEnemy.name} takes ${burnDamage} flame tick!`, type: 'info' });
            burnTick = true;
          }
          return { ...eff, duration: eff.duration - 1 };
        })
        .filter(eff => eff.duration > 0);

      // 2. Map Runes to Hero Attacks and Actions
      switch (tileTypeId) {
        case 'solar_fire': {
          // SWORD MATCH -> Infantry Assault
          const valen = updatedHeroes.find(h => h.id === 'valen_solar')!;
          valen.energy = Math.min(valen.maxEnergy, valen.energy + 25);
          
          // Attack calculation
          const dmg = Math.round(valen.attackPower * attackPowerMult);
          updatedEnemy.hp = Math.max(0, updatedEnemy.hp - dmg);
          
          setArenaVfx('slash_fire');
          playCombatAudio('slash');
          spawnDamagePop(`-${dmg} Slashing`, 'damage', 50, 40);
          logsToAdd.push({ 
            text: `⚔️ SWORD RES_MATCH: Valen performs Infantry Strike! Inflicts ${dmg} damage to ${updatedEnemy.name}. Energy +25!`, 
            type: 'player' 
          });

          // Passive Trigger: Valor Radiance
          logsToAdd.push({ 
            text: `✨ PASSIVE [Valor Radiance]: Solar blade flares, boosting next Infantry Attack stats!`, 
            type: 'passive' 
          });
          break;
        }

        case 'glacial_frost': {
          // BOW MATCH -> Marksmen Frost Shot
          const lyra = updatedHeroes.find(h => h.id === 'lyra_frost')!;
          lyra.energy = Math.min(lyra.maxEnergy, lyra.energy + 25);

          const isSlowed = updatedEnemy.statusEffects.some(e => e.type === 'slow');
          const dmgMult = isSlowed ? 1.25 : 1.0; // Chill Precision passive
          const dmg = Math.round(lyra.attackPower * dmgMult);
          updatedEnemy.hp = Math.max(0, updatedEnemy.hp - dmg);

          // Apply Slow condition (adds to cooldown delay)
          if (!updatedEnemy.statusEffects.some(e => e.type === 'slow')) {
            updatedEnemy.statusEffects.push({ type: 'slow', duration: 2 });
          }

          setArenaVfx('frost_arrow');
          playCombatAudio('bow');
          spawnDamagePop(`-${dmg} Frost`, isSlowed ? 'critical' : 'damage', 60, 45);
          logsToAdd.push({ 
            text: `🏹 BOW RES_MATCH: Lyra fires a Glacial Bolt dealing ${dmg} damage and Slows target. Energy +25!`, 
            type: 'player' 
          });

          if (isSlowed) {
            logsToAdd.push({ 
              text: `🎯 PASSIVE [Chill Precision]: Lyra triggers critical precision bonus on frozen/slow target!`, 
              type: 'passive' 
            });
          }
          break;
        }

        case 'amber_earth': {
          // SHIELD MATCH -> Guardian Fortress Buff
          const aethelgard = updatedHeroes.find(h => h.id === 'aethelgard_stone')!;
          aethelgard.energy = Math.min(aethelgard.maxEnergy, aethelgard.energy + 25);

          const shieldStrength = 250;
          updatedHeroes = updatedHeroes.map(hero => ({
            ...hero,
            shield: hero.shield + shieldStrength
          }));

          setArenaVfx('shield_up');
          playCombatAudio('shield');
          spawnDamagePop(`+${shieldStrength} Shield`, 'shield', 20, 60);
          logsToAdd.push({ 
            text: `🛡️ SHIELD RES_MATCH: Aethelgard generates a +${shieldStrength} armor barrier for the squad! Energy +25!`, 
            type: 'player' 
          });

          // Passive Trigger: Fortress Heart
          // Heal the lowest hp hero
          let lowestHPIndex = 0;
          let lowestPercent = 1.0;
          updatedHeroes.forEach((hero, index) => {
            const percent = hero.hp / hero.maxHp;
            if (percent < lowestPercent) {
              lowestPercent = percent;
              lowestHPIndex = index;
            }
          });

          const healAmount = Math.round((updatedHeroes[lowestHPIndex].maxHp - updatedHeroes[lowestHPIndex].hp) * 0.08);
          if (healAmount > 0) {
            updatedHeroes[lowestHPIndex].hp = Math.min(updatedHeroes[lowestHPIndex].maxHp, updatedHeroes[lowestHPIndex].hp + healAmount);
            spawnDamagePop(`+${healAmount} HP`, 'heal', 20 + lowestHPIndex * 30, 80);
            logsToAdd.push({
              text: `💚 PASSIVE [Fortress Heart]: Restores +${healAmount} health to lowest HP hero (${updatedHeroes[lowestHPIndex].name})!`,
              type: 'passive'
            });
          }
          break;
        }

        case 'astral_light': {
          // CRYSTAL MATCH -> Cosmic Mana Charge
          updatedHeroes = updatedHeroes.map(hero => ({
            ...hero,
            energy: Math.min(hero.maxEnergy, hero.energy + 35)
          }));

          setArenaVfx('mana_charge');
          playCombatAudio('mana');
          spawnDamagePop(`+35 Energy`, 'heal', 40, 50);
          logsToAdd.push({ 
            text: `⭐ CRYSTAL RES_MATCH: Relic light charges ALL Heroes with +35 Cosmic Energy!`, 
            type: 'player' 
          });
          break;
        }

        case 'emerald_nature': {
          // POTION MATCH -> Team Heals
          const healStrength = 300;
          updatedHeroes = updatedHeroes.map(hero => ({
            ...hero,
            hp: Math.min(hero.maxHp, hero.hp + healStrength)
          }));

          setArenaVfx('heal_aura');
          playCombatAudio('heal');
          spawnDamagePop(`+300 Healed`, 'heal', 50, 70);
          logsToAdd.push({ 
            text: `🌿 POTION RES_MATCH: Synthesized Emerald Potion restores +${healStrength} health to all team members!`, 
            type: 'player' 
          });
          break;
        }

        case 'runic_compass': {
          // DRAGON CREST -> Free Ultimate charge
          // Pick a random hero and set energy to 100%!
          const targetIdx = Math.floor(Math.random() * updatedHeroes.length);
          updatedHeroes[targetIdx].energy = 100;

          setArenaVfx('dragon_crest_spark');
          playCombatAudio('spark');
          spawnDamagePop(`ULT CHARGED!`, 'heal', 30 + targetIdx * 30, 40);
          logsToAdd.push({ 
            text: `🌀 DRAGON CREST: Ancient Vortex surges! ${updatedHeroes[targetIdx].name}'s Ultimate meter is fully charged!`, 
            type: 'player' 
          });
          break;
        }

        default:
          break;
      }

      // Add accumulated logs
      logsToAdd.forEach(l => addCombatLog(l.text, l.type));

      // 3. Clear VFX indicator shortly
      setTimeout(() => setArenaVfx(null), 800);

      // 4. Verify Enemy State (Defeated?)
      if (updatedEnemy.hp <= 0) {
        setHeroes(updatedHeroes);
        handleEnemyDefeat(updatedEnemy);
        return;
      }

      // 5. Enemy Cooldown Tick & counter actions
      const activeEffects = updatedEnemy.statusEffects;
      const isFrozen = activeEffects.some(e => e.type === 'freeze');

      if (isFrozen) {
        addCombatLog(`❄️ FROZEN SHIELD: ${updatedEnemy.name} remains frozen and skips countdown decrement!`, 'info');
      } else {
        // Decrease attack countdown cooldown
        const isSlowed = activeEffects.some(e => e.type === 'slow');
        updatedEnemy.cooldown = Math.max(0, updatedEnemy.cooldown - (isSlowed ? 0.5 : 1));

        if (updatedEnemy.cooldown <= 0) {
          // Enemy attacks the team!
          triggerEnemyAttack(updatedEnemy, updatedHeroes);
          // Reset cooldown
          updatedEnemy.cooldown = updatedEnemy.maxCooldown;
        }
      }

      // Sync local updates
      setActiveEnemy(updatedEnemy);
      setHeroes(updatedHeroes);
    };

    // Enemy strike algorithm
    const triggerEnemyAttack = (enemy: CombatEnemy, currentHeroes: CombatHero[]) => {
      setShakeScreen(true);
      setTimeout(() => setShakeScreen(false), 500);
      playCombatAudio('impact');

      let attackDmg = enemy.attackPower;
      addCombatLog(`👹 ENEMY ACTION: ${enemy.name} prepares a heavy strike! Force: ${attackDmg} HP.`, 'enemy');

      // Deduct armor shields first, then health pools evenly
      const heroesWithShield = currentHeroes.filter(h => h.shield > 0);
      if (heroesWithShield.length > 0) {
        // Absorbed partially by shields
        const totalShieldVal = currentHeroes.reduce((acc, h) => acc + h.shield, 0);
        const shieldAbsorption = Math.min(totalShieldVal, attackDmg);
        
        attackDmg -= shieldAbsorption;
        addCombatLog(`🛡️ ABS_SHIELD: protective shields absorbed -${shieldAbsorption} armor points!`, 'info');

        // Deduct from shields
        let remainingShieldToStrip = shieldAbsorption;
        currentHeroes.forEach(h => {
          if (h.shield >= remainingShieldToStrip) {
            h.shield -= remainingShieldToStrip;
            remainingShieldToStrip = 0;
          } else {
            remainingShieldToStrip -= h.shield;
            h.shield = 0;
          }
        });
      }

      if (attackDmg > 0) {
        // Distribute damage amongst active heroes
        const damagePerHero = Math.round(attackDmg / currentHeroes.length);
        currentHeroes.forEach((h, idx) => {
          h.hp = Math.max(0, h.hp - damagePerHero);
          spawnDamagePop(`-${damagePerHero}`, 'damage', 15 + idx * 30, 75);
        });
        addCombatLog(`💥 CRIT STRIKE: The strike penetrates, dealing -${damagePerHero} damage to each Hero.`, 'enemy');
      }

      // Check for Team Wipe out
      const totalHP = currentHeroes.reduce((acc, h) => acc + h.hp, 0);
      if (totalHP <= 0) {
        handleTeamWipe();
      }
    };

    // Enemy defeated logic
    const handleEnemyDefeat = (defeated: CombatEnemy) => {
      addCombatLog(`💀 VICTORY: ${defeated.name} has been vaporized by elemental match synergies!`, 'system');
      spawnDamagePop(`VAPORIZED!`, 'ultimate', 50, 30);
      onLogMessage(`Enemy ${defeated.name} defeated in active combat wave!`, 'success');

      if (enemyQueue.length > 0) {
        // Pull next enemy in wave queue
        const nextEnemy = enemyQueue[0];
        setEnemyQueue(prev => prev.slice(1));
        setActiveEnemy(nextEnemy);
        setActiveWave(prev => prev + 1);
        addCombatLog(`👾 WAVE ADVANCEMENT: A wild ${nextEnemy.name} appears to guard the altar!`, 'system');
      } else {
        // No enemies remaining -> Battle Over!
        handleFinalVictorySurge();
      }
    };

    // Player ultimate activations
    const triggerHeroUltimate = (heroId: string) => {
      if (!activeEnemy || !isBattleActive) return;

      const heroIdx = heroes.findIndex(h => h.id === heroId);
      if (heroIdx === -1) return;

      const hero = heroes[heroIdx];
      if (hero.energy < 100) return; // Not enough energy

      let updatedEnemy = { ...activeEnemy };
      let updatedHeroes = heroes.map(h => ({ ...h }));

      // Consume full energy
      updatedHeroes[heroIdx].energy = 0;

      // Execute unique Ultimate parameters
      if (heroId === 'valen_solar') {
        const dmg = 850;
        updatedEnemy.hp = Math.max(0, updatedEnemy.hp - dmg);
        
        // Apply Burn status
        if (!updatedEnemy.statusEffects.some(e => e.type === 'burn')) {
          updatedEnemy.statusEffects.push({ type: 'burn', duration: 3 });
        }

        setArenaVfx('ultimate_solar');
        playCombatAudio('ultimate_fire');
        spawnDamagePop(`-${dmg} CRIT!`, 'ultimate', 55, 25);
        addCombatLog(`🔥 ULTIMATE: Valen unleashes [${hero.ultimateName}]! Slashes for ${dmg} and Burns enemy!`, 'ultimate');
      } 
      else if (heroId === 'lyra_frost') {
        const dmg = 500;
        updatedEnemy.hp = Math.max(0, updatedEnemy.hp - dmg);
        
        // Freeze target, delaying their action counter
        updatedEnemy.cooldown += 2;
        if (!updatedEnemy.statusEffects.some(e => e.type === 'freeze')) {
          updatedEnemy.statusEffects.push({ type: 'freeze', duration: 1 });
        }

        setArenaVfx('ultimate_frost');
        playCombatAudio('ultimate_ice');
        spawnDamagePop(`-${dmg} Freeze`, 'ultimate', 65, 30);
        addCombatLog(`❄️ ULTIMATE: Lyra activates [${hero.ultimateName}]! Shocks for ${dmg} and freezes action cooldown!`, 'ultimate');
      } 
      else if (heroId === 'aethelgard_stone') {
        const shieldVal = 900;
        updatedHeroes = updatedHeroes.map(h => ({
          ...h,
          shield: h.shield + shieldVal
        }));

        setArenaVfx('ultimate_stone');
        playCombatAudio('ultimate_shield');
        spawnDamagePop(`+${shieldVal} Aegis`, 'shield', 25, 45);
        addCombatLog(`🛡️ ULTIMATE: Aethelgard channel [${hero.ultimateName}]! Emplaces a giant ${shieldVal} HP fortress barrier!`, 'ultimate');
      }

      // Check Enemy HP
      if (updatedEnemy.hp <= 0) {
        setHeroes(updatedHeroes);
        handleEnemyDefeat(updatedEnemy);
      } else {
        setActiveEnemy(updatedEnemy);
        setHeroes(updatedHeroes);
      }
    };

    // Final massive ultimate blast (called automatically upon puzzle victory)
    const handleFinalVictorySurge = () => {
      setIsBattleActive(false);
      setArenaVfx('celestial_explosion');
      playCombatAudio('victory_blast');
      
      if (activeEnemy) {
        const overkillDmg = activeEnemy.hp;
        spawnDamagePop(`-${overkillDmg} COSMIC BLAST`, 'ultimate', 50, 20);
        setActiveEnemy(prev => prev ? { ...prev, hp: 0 } : null);
      }
      
      addCombatLog(`👑 CELESTIAL SURGE: Relic altar purified! Direct light blasts the enemies to stardust!`, 'system');
      setTimeout(() => {
        onVictory();
      }, 1500);
    };

    // Hero squad defeat logic
    const handleTeamWipe = () => {
      setIsBattleActive(false);
      addCombatLog(`💀 DEFEAT: The guardian squad has fallen! Altar crystal resonance decayed.`, 'system');
      onDefeat();
    };


    // ==========================================
    // RENDER INTERFACES
    // ==========================================
    return (
      <div className="bg-[#030306] border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between h-full select-none relative overflow-hidden">
        
        {/* Vfx Screen flashes */}
        <AnimatePresence>
          {arenaVfx && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute inset-0 z-30 pointer-events-none flex items-center justify-center ${
                arenaVfx === 'slash_fire' ? 'bg-rose-500/15' :
                arenaVfx === 'frost_arrow' ? 'bg-cyan-500/15' :
                arenaVfx === 'shield_up' ? 'bg-amber-500/10' :
                arenaVfx === 'heal_aura' ? 'bg-emerald-500/15' :
                arenaVfx === 'ultimate_solar' ? 'bg-red-500/25 ring-8 ring-red-500/30' :
                arenaVfx === 'ultimate_frost' ? 'bg-cyan-400/25 ring-8 ring-cyan-400/30' :
                arenaVfx === 'ultimate_stone' ? 'bg-yellow-500/20' :
                'bg-purple-500/20'
              }`}
            >
              {/* Custom Spell Animation Overlays */}
              <motion.div 
                initial={{ scale: 0.5, rotate: -45 }}
                animate={{ scale: 1.1, rotate: 0 }}
                className="text-5xl"
              >
                {arenaVfx === 'slash_fire' && '🔥⚔️'}
                {arenaVfx === 'frost_arrow' && '🏹❄️'}
                {arenaVfx === 'shield_up' && '🛡️⛰️'}
                {arenaVfx === 'heal_aura' && '🌿💖'}
                {arenaVfx === 'ultimate_solar' && '☄️🔥🗡️'}
                {arenaVfx === 'ultimate_frost' && '🌀❄️🏹'}
                {arenaVfx === 'ultimate_stone' && '🧱🏰🛡️'}
                {arenaVfx === 'celestial_explosion' && '✨🌌💥'}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Pops */}
        <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
          {floatingPops.map(pop => (
            <motion.div
              key={pop.id}
              initial={{ opacity: 1, y: `${pop.y}%`, x: `${pop.x}%`, scale: 0.8 }}
              animate={{ opacity: 0, y: `${pop.y - 25}%`, scale: 1.2 }}
              transition={{ duration: 0.85, ease: 'easeOut' }}
              className={`absolute font-mono font-extrabold text-base drop-shadow-[0_2px_4px_rgba(0,0,0,1)] ${
                pop.type === 'damage' ? 'text-rose-500' :
                pop.type === 'heal' ? 'text-emerald-400' :
                pop.type === 'shield' ? 'text-amber-400' :
                pop.type === 'critical' ? 'text-orange-400 font-black' :
                pop.type === 'ultimate' ? 'text-fuchsia-400 text-lg font-black tracking-widest' :
                pop.type === 'burn' ? 'text-amber-500' :
                'text-cyan-300'
              }`}
            >
              {pop.value}
            </motion.div>
          ))}
        </div>

        {/* COMBAT HEADER CARD */}
        <div className="flex items-center justify-between border-b border-zinc-900/60 pb-2.5 mb-3">
          <div className="flex items-center gap-1.5 font-mono">
            <Swords className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-wider text-zinc-200">
              Stellar Arena
            </span>
          </div>

          <div className="flex items-center gap-2 bg-zinc-950 px-2 py-0.5 rounded-md border border-zinc-900 font-mono text-[9.5px]">
            <span className="text-zinc-550 uppercase">Wave Status</span>
            <span className="text-purple-400 font-bold">{activeWave} / {totalWaves}</span>
          </div>
        </div>

        {/* BATTLE STAGE (ENEMY SHOWDOWN CARD) */}
        <div className={`bg-[#05050a]/80 border border-zinc-900 rounded-xl p-4 flex flex-col justify-between items-center relative mb-4 h-44 overflow-hidden ${shakeScreen ? 'animate-bounce' : ''}`}>
          
          <div className="absolute top-2 left-3 flex gap-1 items-center">
            {activeEnemy?.isBoss && (
              <span className="bg-rose-950/80 border border-rose-800 text-rose-300 text-[7px] font-mono font-black uppercase px-1.5 py-0.5 rounded tracking-wide">
                Level Boss
              </span>
            )}
            {activeEnemy?.statusEffects.map((eff, i) => (
              <span 
                key={i} 
                className={`text-[8.5px] px-1 py-0.5 rounded border font-mono font-bold flex items-center gap-0.5 uppercase ${
                  eff.type === 'burn' ? 'bg-orange-950/80 border-orange-700 text-orange-400' :
                  eff.type === 'slow' ? 'bg-cyan-950/80 border-cyan-800 text-cyan-400' :
                  'bg-purple-950/80 border-purple-800 text-purple-400'
                }`}
              >
                {eff.type === 'burn' ? '🔥' : '❄️'} {eff.type} ({eff.duration}t)
              </span>
            ))}
          </div>

          {/* Action Strike counter */}
          <div className="absolute top-2 right-3 font-mono text-[9px] text-zinc-500 flex items-center gap-1 bg-zinc-950/60 px-1.5 py-0.5 rounded border border-zinc-900">
            <span className="text-zinc-400">STRIKE IN:</span>
            <span className="text-rose-400 font-black tracking-wider text-xs">
              {activeEnemy ? Math.ceil(activeEnemy.cooldown) : '0'}
            </span>
            <span className="text-[7.5px] text-zinc-650 font-medium">MATCHES</span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center pt-2">
            <motion.div 
              animate={{ 
                y: [0, -4, 0],
                scale: activeEnemy?.isBoss ? [1.02, 1.05, 1.02] : 1
              }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="text-5xl filter drop-shadow-[0_4px_16px_rgba(168,85,247,0.2)]"
            >
              {activeEnemy?.emoji || '❔'}
            </motion.div>
            <h4 className="font-serif font-black text-sm text-zinc-100 uppercase tracking-widest mt-2">
              {activeEnemy?.name || 'Aether Entity'}
            </h4>
          </div>

          {/* Enemy HP BAR */}
          <div className="w-full font-mono mt-1">
            <div className="flex justify-between text-[8px] text-zinc-550 uppercase mb-1">
              <span>Hostile Vitality Gauge</span>
              <span className="text-rose-400 font-bold">
                {activeEnemy ? `${activeEnemy.hp} / ${activeEnemy.maxHp}` : '0 / 0'}
              </span>
            </div>
            <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900 relative">
              <motion.div 
                className={`h-full bg-gradient-to-r ${activeEnemy?.isBoss ? 'from-rose-600 to-red-800' : 'from-indigo-600 to-blue-500'}`}
                initial={{ width: '100%' }}
                animate={{ width: activeEnemy ? `${(activeEnemy.hp / activeEnemy.maxHp) * 100}%` : '0%' }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>

        {/* HERO CARDS SQUAD */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          {heroes.map(hero => {
            const hasUltimate = hero.energy >= 100;
            return (
              <div 
                key={hero.id}
                className={`relative flex flex-col justify-between rounded-xl p-2.5 border transition-all h-[115px] select-none ${hero.bgColor} ${hero.borderColor} ${
                  hasUltimate ? 'ring-2 ring-yellow-400/40 border-yellow-400/50 shadow-lg scale-102 bg-[#1a150a]/40' : ''
                }`}
              >
                {/* Shield Indicator */}
                {hero.shield > 0 && (
                  <div className="absolute -top-1.5 -right-1 bg-amber-400 text-black rounded-md px-1.5 py-0.5 border border-amber-500 font-mono text-[7px] font-black flex items-center gap-0.5 shadow-md">
                    <Shield className="w-2 h-2 fill-current" />
                    <span>+{hero.shield}</span>
                  </div>
                )}

                <div className="flex justify-between items-start">
                  <span className="text-xl">{hero.emoji}</span>
                  <span className="text-[7px] font-mono uppercase bg-zinc-950 px-1 py-0.5 rounded text-zinc-400 font-bold border border-zinc-900">
                    {hero.role}
                  </span>
                </div>

                <div className="text-left font-mono mt-2">
                  <h5 className="text-[9.5px] font-bold text-zinc-100 truncate">{hero.name}</h5>
                  
                  {/* Hero Health */}
                  <div className="w-full mt-1.5">
                    <div className="w-full h-1 bg-zinc-950 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500" 
                        style={{ width: `${(hero.hp / hero.maxHp) * 100}%` }}
                      />
                    </div>
                    <span className="text-[7.5px] text-zinc-400 block text-right mt-0.5">
                      {hero.hp} HP
                    </span>
                  </div>

                  {/* Energy/Ultimate Gauge */}
                  <div className="w-full mt-1">
                    <div className="w-full h-1 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
                      <motion.div 
                        className={`h-full ${hasUltimate ? 'bg-yellow-400 animate-pulse' : 'bg-purple-500'}`}
                        animate={{ width: `${hero.energy}%` }}
                      />
                    </div>
                    <span className="text-[7px] text-zinc-500 block text-right mt-0.5">
                      {hero.energy}/100 MP
                    </span>
                  </div>
                </div>

                {/* Ultimate trigger overlay button */}
                <AnimatePresence>
                  {hasUltimate && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => triggerHeroUltimate(hero.id)}
                      className="absolute inset-0 bg-black/90 rounded-xl flex flex-col items-center justify-center p-1 cursor-pointer border border-yellow-500"
                    >
                      <Sparkles className="w-4 h-4 text-yellow-400 animate-spin mb-1" style={{ animationDuration: '6s' }} />
                      <span className="text-[8px] font-mono text-yellow-400 uppercase font-black tracking-wide text-center leading-tight">
                        Cast Ultimate
                      </span>
                      <span className="text-[6px] font-mono text-zinc-400 text-center leading-none mt-0.5 truncate w-full px-1">
                        {hero.ultimateName}
                      </span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* RECENT COMBAT LOGS TIMELINE */}
        <div className="bg-[#010103] border border-zinc-950 rounded-xl p-3 flex-1 flex flex-col justify-between max-h-[140px] overflow-hidden text-left font-mono">
          <div className="text-[8px] text-zinc-650 uppercase font-bold tracking-widest mb-1.5 border-b border-zinc-950 pb-1">
            Arena Combat Signals
          </div>

          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1.5 scrollbar-thin scrollbar-thumb-zinc-900 text-[8.5px] leading-relaxed">
            {combatLogs.map(log => (
              <div 
                key={log.id} 
                className={`pl-1.5 border-l-2 ${
                  log.type === 'player' ? 'border-sky-800 text-sky-300/90' :
                  log.type === 'enemy' ? 'border-rose-900 text-rose-300/90' :
                  log.type === 'ultimate' ? 'border-yellow-600 text-yellow-400 font-bold' :
                  log.type === 'passive' ? 'border-purple-600 text-purple-400 italic' :
                  log.type === 'system' ? 'border-violet-800 text-violet-300 font-bold' :
                  'border-zinc-800 text-zinc-400'
                }`}
              >
                <span className="text-zinc-600 mr-1">[{log.timestamp}]</span>
                {log.text}
              </div>
            ))}
            
            {combatLogs.length === 0 && (
              <span className="text-zinc-650 italic text-[8.5px] block text-center pt-4">
                No telemetry signatures registered yet. Synthesize matches on the Relic Altar below to spark combat commands.
              </span>
            )}
          </div>
        </div>

        {/* BRIEF TACTICAL MANUAL */}
        <div className="mt-3 bg-zinc-950/60 border border-zinc-900 rounded-lg p-2 flex items-center justify-between text-left font-mono text-[8px] text-zinc-550 leading-normal">
          <div className="flex-1 max-w-[85%] pr-2">
            <strong>Combo Synergy Tips:</strong> 🔥 Valor Slashing inflicts high DPS. ❄️ Frost slowing stalls enemy counters. ⛰️ Earth shields mitigate strikes. ⭐ Star and 🌀 Compass match triggers maximize Ultimate speed.
          </div>
          <button 
            onClick={() => initializeBattleState(world, floor)}
            className="px-2 py-1 bg-zinc-900 hover:bg-zinc-850 hover:text-zinc-300 border border-zinc-800 rounded text-[7.5px] uppercase font-bold text-zinc-500 cursor-pointer flex items-center gap-0.5 active:scale-95 transition-all shrink-0"
            title="Reset active battle arena"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Reset</span>
          </button>
        </div>

      </div>
    );
  }
);

CrystalVaultCombatArena.displayName = 'CrystalVaultCombatArena';
