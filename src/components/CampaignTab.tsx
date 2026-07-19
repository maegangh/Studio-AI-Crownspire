import React, { useState, useEffect } from 'react';
import { CampaignStage, Resources, UnitType, ResourceCost, Hero } from '../types';
import { formatNum } from '../gameData';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Play, 
  CheckCircle2, 
  ChevronRight, 
  Skull, 
  Award, 
  Sword,
  Swords,
  Shield,
  Loader2,
  Sparkle,
  Sparkles,
  Zap,
  BookOpen,
  RefreshCw,
  Target,
  ArrowRight,
  Flame,
  User,
  Sliders,
  Check,
  AlertTriangle,
  Compass,
  Coins,
  ShieldAlert,
  Heart,
  Plus,
  RefreshCw as ShuffleIcon,
  HelpCircle,
  Undo2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { CROWNSPIRE_MONSTERS_DATABASE, Monster, MonsterRewards } from '../utils/monsterDatabase';
import { simulateMonsterHunt, simulateWorldBossBattle, CombatArmyInput } from '../utils/combatEngine';
import { TROOP_BY_ID } from '../utils/troopDatabase';
import MonsterEncyclopediaModal from './MonsterEncyclopediaModal';

interface CampaignTabProps {
  stages: CampaignStage[];
  resources: Resources;
  units: UnitType[];
  currentCampaignId: number;
  onCompleteStage: (stageId: number, rewards: ResourceCost) => void;
  onAddResources?: (gains: Partial<Resources>) => void;
  addLog?: (message: string, type?: 'info' | 'success' | 'warning' | 'combat' | 'error') => void;
  activeHeroes?: Hero[];
  onClaimMonsterRewards?: (monsterName: string, rewards: MonsterRewards) => void;
}

// Mahjong Tile Interface
interface MahjongTile {
  id: string;
  type: 'sword' | 'bow' | 'shield' | 'crystal' | 'potion' | 'dragon_crest';
  layer: number; // 0, 1, 2
  x: number; // coordinate
  y: number; // coordinate
  matched: boolean;
  selected: boolean; // in Altar Tray
  caged?: boolean;   // Granite cage hazard
  frozen?: boolean;  // Frozen hazard
}

// Active Hero energy & details for the puzzle viewport
interface PuzzleHero {
  id: string;
  name: string;
  element: 'Fire' | 'Frost' | 'Nature' | 'Light' | 'Void';
  level: number;
  energy: number;
  maxEnergy: number;
  passiveName: string;
  passiveDesc: string;
  ultimateName: string;
  ultimateDesc: string;
}

export default function CampaignTab({ 
  stages, 
  resources, 
  units, 
  currentCampaignId, 
  onCompleteStage,
  onAddResources,
  addLog,
  activeHeroes = [],
  onClaimMonsterRewards
}: CampaignTabProps) {
  // Main Tab categories: 'vault' (Redesigned Crystal Vault), 'monsters' (Monster Hunt)
  const [mainTab, setMainTab] = useState<'vault' | 'monsters'>('vault');
  const [isEncyclopediaOpen, setIsEncyclopediaOpen] = useState(false);
  
  // Vault Mode selections: 'expedition', 'arena', 'beast', 'endless', 'extreme', 'convergence'
  const [vaultSubMode, setVaultSubMode] = useState<'expedition' | 'arena' | 'beast' | 'endless' | 'extreme' | 'convergence'>('expedition');

  // Interactive Puzzle State
  const [puzzleActive, setPuzzleActive] = useState(false);
  const [tiles, setTiles] = useState<MahjongTile[]>([]);
  const [tray, setTray] = useState<MahjongTile[]>([]);
  const [trayCapacity, setTrayCapacity] = useState(7);
  const [puzzleScore, setPuzzleScore] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [comboTimer, setComboTimer] = useState(0);
  
  // Decoupled Combat Engine state
  const [playerHP, setPlayerHP] = useState(10000);
  const [playerMaxHP, setPlayerMaxHP] = useState(10000);
  const [playerShield, setPlayerShield] = useState(0);
  const [enemyName, setEnemyName] = useState('Goliath Behemoth');
  const [enemyHP, setEnemyHP] = useState(15000);
  const [enemyMaxHP, setEnemyMaxHP] = useState(15000);
  const [enemyTimer, setEnemyTimer] = useState(5); // Enemy attacks every 5 moves
  const [enemyAttackCooldown, setEnemyAttackCooldown] = useState(5);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<{ id: string; text: string; type: 'damage' | 'heal' | 'shield' | 'hero' }[]>([]);

  // Deployed Heroes in puzzle battle
  const [puzzleHeroes, setPuzzleHeroes] = useState<PuzzleHero[]>([]);

  // Battle outcomes
  const [puzzleOutcome, setPuzzleOutcome] = useState<'victory' | 'defeat' | null>(null);

  // Active Environmental Hazard (Daily Challenge / Extreme modes)
  const [activeHazard, setActiveHazard] = useState<{ name: string; desc: string; type: 'blizzard' | 'tempest' | 'none' }>('none' as any);

  // Power-up count trackers
  const [powerupUndoCount, setPowerupUndoCount] = useState(2);
  const [powerupShuffleCount, setPowerupShuffleCount] = useState(2);
  const [powerupHintCount, setPowerupHintCount] = useState(2);
  const [lastSelectedTileId, setLastSelectedTileId] = useState<string | null>(null);

  // Monster Hunting state managers
  const [filterRarity, setFilterRarity] = useState<'All' | 'Common' | 'Elite'>('All');
  const [filterLevelRange, setFilterLevelRange] = useState<'All' | '1-15' | '16-30' | '31-50'>('All');
  const [selectedMonster, setSelectedMonster] = useState<Monster | null>(null);
  
  // March selector state counters
  const [deployInf, setDeployInf] = useState<number>(0);
  const [deployMark, setDeployMark] = useState<number>(0);
  const [deployCav, setDeployCav] = useState<number>(0);
  const [selectedHeroIds, setSelectedHeroIds] = useState<string[]>([]);

  // Simulation Reports
  const [simulationResult, setSimulationResult] = useState<any | null>(null);
  const [simulatedEnemy, setSimulatedEnemy] = useState<Monster | null>(null);

  // Available troops
  const totalAvailableInf = units.filter(u => u.troopType === 'infantry').reduce((sum, u) => sum + u.count, 0);
  const totalAvailableMark = units.filter(u => u.troopType === 'marksmen').reduce((sum, u) => sum + u.count, 0);
  const totalAvailableCav = units.filter(u => u.troopType === 'cavalry').reduce((sum, u) => sum + u.count, 0);

  // Initialize sliders to maximum of 40% on load
  useEffect(() => {
    setDeployInf(Math.min(totalAvailableInf, Math.round(totalAvailableInf * 0.4)));
    setDeployMark(Math.min(totalAvailableMark, Math.round(totalAvailableMark * 0.4)));
    setDeployCav(Math.min(totalAvailableCav, Math.round(totalAvailableCav * 0.4)));
    
    if (activeHeroes.length > 0) {
      setSelectedHeroIds(activeHeroes.slice(0, 2).map(h => h.name));
    }
  }, [mainTab, totalAvailableInf, totalAvailableMark, totalAvailableCav]);

  // Combo decay effect timer
  useEffect(() => {
    if (!puzzleActive || puzzleOutcome) return;
    const timer = setInterval(() => {
      setComboTimer(prev => {
        if (prev <= 0) {
          if (comboMultiplier > 1) {
            setComboMultiplier(1);
            triggerFloatingText('Combo Reset', 'hero');
          }
          return 0;
        }
        return prev - 10;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [puzzleActive, comboMultiplier, puzzleOutcome]);

  // Check board overlap conditions to identify playable tiles
  const isTilePlayable = (tile: MahjongTile, allTiles: MahjongTile[]) => {
    if (tile.matched || tile.selected) return false;
    
    // Check if any active overlapping tile exists on a higher layer
    return !allTiles.some(other => {
      if (other.matched || other.selected) return false;
      if (other.layer <= tile.layer) return false;
      
      const distanceX = Math.abs(other.x - tile.x);
      const distanceY = Math.abs(other.y - tile.y);
      return distanceX < 0.8 && distanceY < 0.8;
    });
  };

  // Helper to spawn combat floating damage, heal or shield texts
  const triggerFloatingText = (text: string, type: 'damage' | 'heal' | 'shield' | 'hero') => {
    const id = Date.now().toString() + Math.random().toString();
    setFloatingTexts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 1200);
  };

  // Puzzle Board Generator matching groups of three to guarantee solvability
  const generateSolvabilityGuaranteedBoard = (groupCount: number, mode: string) => {
    const tileTypes: ('sword' | 'bow' | 'shield' | 'crystal' | 'potion' | 'dragon_crest')[] = [
      'sword', 'bow', 'shield', 'crystal', 'potion', 'dragon_crest'
    ];
    
    const tilePool: ('sword' | 'bow' | 'shield' | 'crystal' | 'potion' | 'dragon_crest')[] = [];
    
    // Choose tile types and fill groups of 3
    for (let g = 0; g < groupCount; g++) {
      const type = tileTypes[Math.floor(Math.random() * tileTypes.length)];
      tilePool.push(type, type, type);
    }

    // Shuffle the types to randomize grid distributions
    for (let i = tilePool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = tilePool[i];
      tilePool[i] = tilePool[j];
      tilePool[j] = temp;
    }

    const generatedTiles: MahjongTile[] = [];
    let poolIndex = 0;

    // Layered Coordinates Setup (Pyramid Style)
    // Layer 2: 2x2 grid (Top)
    // Layer 1: 4x4 grid (Middle)
    // Layer 0: 6x6 grid (Bottom)
    
    const layerConfigs = [
      { layer: 2, size: 2, offset: 2.0 },
      { layer: 1, size: 4, offset: 1.0 },
      { layer: 0, size: 6, offset: 0.0 }
    ];

    for (const config of layerConfigs) {
      for (let r = 0; r < config.size; r++) {
        for (let c = 0; c < config.size; c++) {
          if (poolIndex >= tilePool.length) break;
          
          // Apply offsets to create staggered 2.5D visual overlap pyramid
          const tileX = c + config.offset;
          const tileY = r + config.offset;
          
          const tileType = tilePool[poolIndex++];
          
          // Apply hazards based on sub-modes
          let caged = false;
          let frozen = false;
          if (mode === 'beast' && Math.random() < 0.12 && config.layer === 0) {
            caged = true; // Goliath Behemoth's Granite Cages
          }
          if (mode === 'extreme' && Math.random() < 0.15 && config.layer <= 1) {
            frozen = true; // Blizzard environment freezing blocks
          }

          generatedTiles.push({
            id: `tile-${config.layer}-${r}-${c}-${poolIndex}`,
            type: tileType,
            layer: config.layer,
            x: tileX,
            y: tileY,
            matched: false,
            selected: false,
            caged,
            frozen
          });
        }
        if (poolIndex >= tilePool.length) break;
      }
      if (poolIndex >= tilePool.length) break;
    }

    // If there are still left-over tiles in pool, spread them on Bottom Layer at random coords
    while (poolIndex < tilePool.length) {
      generatedTiles.push({
        id: `extra-tile-${poolIndex}`,
        type: tilePool[poolIndex++],
        layer: 0,
        x: Math.random() * 5.0,
        y: Math.random() * 5.0,
        matched: false,
        selected: false
      });
    }

    return generatedTiles;
  };

  // START TRIPLE MATCH PUZZLE BATTLE
  const handleStartPuzzleBattle = () => {
    let enemy = 'Goliath Behemoth';
    let bossMaxHP = 15000;
    let attackCd = 5;
    let hazardName = 'none';
    let hazardDesc = '';
    let hazardType: 'blizzard' | 'tempest' | 'none' = 'none';

    // Map stats by chosen Game Mode
    if (vaultSubMode === 'arena') {
      enemy = 'Rival Commander Alden';
      bossMaxHP = 12000;
      attackCd = 4;
    } else if (vaultSubMode === 'beast') {
      enemy = 'Goliath Titan-Behemoth';
      bossMaxHP = 45000;
      attackCd = 6;
    } else if (vaultSubMode === 'endless') {
      enemy = `Endless Crypt Fiend (Floor ${Math.floor(puzzleScore / 1000) + 1})`;
      bossMaxHP = 20000;
      attackCd = 5;
    } else if (vaultSubMode === 'extreme') {
      enemy = 'Thunder Wyrm';
      bossMaxHP = 25000;
      attackCd = 4;
      hazardName = '⚡ Thunder Tempest';
      hazardDesc = 'Rage storm strikes: random tiles are locked periodically.';
      hazardType = 'tempest';
    } else if (vaultSubMode === 'convergence') {
      enemy = 'Solar Core Guardian';
      bossMaxHP = 22000;
      attackCd = 5;
    } else {
      // Expedition defaults
      const stage = stages.find(s => s.id === currentCampaignId) || stages[0];
      enemy = stage.enemy || 'Vanguard Skeleton Ward';
      bossMaxHP = stage.id * 4000;
      attackCd = stage.difficulty === 'Extreme' ? 4 : 5;
    }

    // Set initial combat stats
    setEnemyName(enemy);
    setEnemyMaxHP(bossMaxHP);
    setEnemyHP(bossMaxHP);
    setEnemyAttackCooldown(attackCd);
    setEnemyTimer(attackCd);
    setPlayerMaxHP(10000);
    setPlayerHP(10000);
    setPlayerShield(0);
    setPuzzleScore(0);
    setComboMultiplier(1);
    setComboTimer(0);
    setTray([]);
    setTrayCapacity(7);
    setPuzzleOutcome(null);
    setBattleLog([`⚔️ BATTLE COMMENCED: Matching relics commands squads against ${enemy}!`]);

    // Active hazard configs
    setActiveHazard({ name: hazardName, desc: hazardDesc, type: hazardType });

    // Pre-populate playable heroes in the puzzle panel
    const pHe: PuzzleHero[] = [
      {
        id: 'her_ignis',
        name: 'Ignis',
        element: 'Fire',
        level: activeHeroes.find(h => h.name.includes('Ignis'))?.level || 4,
        energy: 0,
        maxEnergy: 100,
        passiveName: 'Ashen Spark',
        passiveDesc: '15% chance to explode adjacent tiles on matching Sword blocks.',
        ultimateName: 'Inferno Calamity',
        ultimateDesc: 'Deals 3,500 Fire damage and shatters all Granite Cages.'
      },
      {
        id: 'her_sariel',
        name: 'Sariel',
        element: 'Frost',
        level: activeHeroes.find(h => h.name.includes('Sariel'))?.level || 3,
        energy: 0,
        maxEnergy: 100,
        passiveName: 'Frosted Core',
        passiveDesc: 'Shield match barriers are 25% stronger on lowest layers.',
        ultimateName: 'Crystalline Aegis',
        ultimateDesc: 'Provides +2,500 HP Defense Shield and freezes boss timer (+3 moves).'
      },
      {
        id: 'her_garrick',
        name: 'Garrick',
        element: 'Nature',
        level: activeHeroes.find(h => h.name.includes('Garrick'))?.level || 3,
        energy: 0,
        maxEnergy: 100,
        passiveName: 'Verdant Growth',
        passiveDesc: 'Increases the Altar Tray slots capacity limits to 8 blocks.',
        ultimateName: 'Thorned Bulwark',
        ultimateDesc: 'Restores +3,000 HP and reflects 20% incoming boss damage.'
      }
    ];
    setPuzzleHeroes(pHe);

    // Generate puzzle blocks (typically 42 tiles = 14 matching trios)
    const newTiles = generateSolvabilityGuaranteedBoard(14, vaultSubMode);
    setTiles(newTiles);
    setPuzzleActive(true);
  };

  // CLICK MAHJONG TILE (MOVE TO ALTAR TRAY)
  const handleSelectTile = (tile: MahjongTile) => {
    if (puzzleOutcome || !isTilePlayable(tile, tiles)) return;
    if (tile.caged) {
      addLog?.('Cannot match caged relics! Match adjacent blocks to shatter the Granite Cage first.', 'warning');
      return;
    }

    if (tray.length >= trayCapacity) {
      triggerFloatingText('Tray Full!', 'damage');
      return;
    }

    setLastSelectedTileId(tile.id);
    const updatedTiles = tiles.map(t => {
      if (t.id === tile.id) {
        return { ...t, selected: true };
      }
      return t;
    });

    const updatedTray = [...tray, { ...tile, selected: true }];
    setTiles(updatedTiles);
    setTray(updatedTray);

    // Resolve tray matching group logic
    setTimeout(() => {
      resolveTrayMatching(updatedTray, updatedTiles);
    }, 200);
  };

  // ALTAR TRAY TRIPLE MATCH RESOLVER
  const resolveTrayMatching = (currentTray: MahjongTile[], currentTiles: MahjongTile[]) => {
    // Count occurrences in Altar Tray
    const occurrences: Record<string, number> = {};
    currentTray.forEach(tile => {
      occurrences[tile.type] = (occurrences[tile.type] || 0) + 1;
    });

    // Check if any block has exactly 3 instances
    const matchedType = Object.keys(occurrences).find(type => occurrences[type] >= 3) as any;

    if (matchedType) {
      // Execute the match-three merge
      let matchCount = 0;
      const nextTray = currentTray.filter(tile => {
        if (tile.type === matchedType && matchCount < 3) {
          matchCount++;
          return false; // remove from tray
        }
        return true;
      });

      // Mark matching tiles as fully cleared in the master pool
      let clearCount = 0;
      const nextTiles = currentTiles.map(t => {
        if (t.type === matchedType && t.selected && !t.matched && clearCount < 3) {
          clearCount++;
          return { ...t, matched: true, selected: false };
        }
        return t;
      });

      // Update multipliers and timers
      const bonusCombo = comboMultiplier + 1;
      setComboMultiplier(bonusCombo);
      setComboTimer(100); // Reset decay timer progress bar to 100%

      // Trigger Combat Engine integration actions
      executeCombatAction(matchedType, bonusCombo);

      setTray(nextTray);
      setTiles(nextTiles);

      // Check level win condition
      const activeTilesRemaining = nextTiles.some(t => !t.matched);
      if (!activeTilesRemaining) {
        handlePuzzleVictory();
        return;
      }

      // Check overflow failure
      if (nextTray.length >= trayCapacity) {
        handlePuzzleDefeat('Altar Tray Overflowed! Failed to resolve matching relics.');
      }
    } else {
      // No match made on this tap. Decrement the Enemy attack counter countdown
      const nextTimer = enemyTimer - 1;
      setEnemyTimer(nextTimer);

      if (nextTimer <= 0) {
        // Trigger Enemy rage attack
        executeEnemyRageAttack(currentTray, currentTiles);
      } else {
        // Just verify tray capacity limit overflow
        if (currentTray.length >= trayCapacity) {
          handlePuzzleDefeat('Altar Tray Overflowed! Failed to resolve matching relics.');
        }
      }
    }
  };

  // PARSING PUZZLE MATCHES TO REAL-TIME COMBAT OPERATIONS
  const executeCombatAction = (tileType: string, combo: number) => {
    let damage = 0;
    let text = '';
    let logMsg = '';
    let baseMult = 1;

    // Convergence Live Event element damage bonus
    if (vaultSubMode === 'convergence' && (tileType === 'sword' || tileType === 'crystal')) {
      baseMult = 1.25; // +25% Fire/Light element matches
      logMsg += '🌟 [Cosmic Convergence Bonus! +25% match strength] ';
    }

    switch (tileType) {
      case 'sword':
        damage = Math.floor(1500 * combo * baseMult);
        setEnemyHP(prev => Math.max(0, prev - damage));
        triggerFloatingText(`-${damage} HP`, 'damage');
        logMsg += `⚔️ Sword Match! Infantry squad charges enemy frontline for ${damage} slash damage (Combo x${combo}).`;
        break;

      case 'bow':
        damage = Math.floor(1800 * combo * baseMult);
        setEnemyHP(prev => Math.max(0, prev - damage));
        triggerFloatingText(`-${damage} HP`, 'damage');
        logMsg += `🏹 Bow Match! Marksmen release a piercing arrow volley for ${damage} damage (Combo x${combo}).`;
        break;

      case 'shield':
        const barrier = Math.floor(1200 * combo);
        setPlayerShield(prev => prev + barrier);
        triggerFloatingText(`+${barrier} Shield`, 'shield');
        logMsg += `🛡️ Shield Match! Vanguard constructs a sacred defense bubble absorbing ${barrier} damage.`;
        break;

      case 'crystal':
        // Charge energy of corresponding random hero
        setPuzzleHeroes(prev => {
          const index = Math.floor(Math.random() * prev.length);
          return prev.map((h, idx) => {
            if (idx === index) {
              const nextEn = Math.min(100, h.energy + 25);
              if (nextEn >= 100 && h.energy < 100) {
                triggerFloatingText(`${h.name} READY!`, 'hero');
              }
              return { ...h, energy: nextEn };
            }
            return h;
          });
        });
        logMsg += `✨ Crystal Match! Magical ley-resonance charges +25 Ultimate Energy to active Heroes.`;
        triggerFloatingText('+25 Energy', 'hero');
        break;

      case 'potion':
        const heal = Math.floor(2000 * combo);
        setPlayerHP(prev => Math.min(playerMaxHP, prev + heal));
        triggerFloatingText(`+${heal} HP`, 'heal');
        logMsg += `🧪 Potion Match! Emerald restorative flask mends squad wounded, healing +${heal} HP.`;
        break;

      case 'dragon_crest':
        damage = Math.floor(3000 * combo);
        setEnemyHP(prev => Math.max(0, prev - damage));
        // Energy charge all heroes
        setPuzzleHeroes(prev => prev.map(h => ({ ...h, energy: Math.min(100, h.energy + 15) })));
        triggerFloatingText(`-${damage} Titan Strike`, 'damage');
        logMsg += `🐉 DRAGON CREST! Celestial dragon force executes mega combo strike dealing ${damage} damage.`;
        break;
    }

    setBattleLog(prev => [logMsg, ...prev.slice(0, 15)]);
    setPuzzleScore(prev => prev + (100 * combo));
  };

  // TRIGGER THE BOSS RAGE ENEMY ATTACK
  const executeEnemyRageAttack = (currentTray: MahjongTile[], currentTiles: MahjongTile[]) => {
    // Calculate final damage after shield absorb
    let rawDmg = Math.floor(1800 + Math.random() * 800);
    if (vaultSubMode === 'beast') rawDmg = Math.floor(3500 + Math.random() * 1000); // Boss fights are hard!

    let dmgTaken = Math.max(0, rawDmg - playerShield);
    setPlayerShield(prev => Math.max(0, prev - rawDmg));
    setPlayerHP(prev => Math.max(0, prev - dmgTaken));
    
    triggerFloatingText(`-${rawDmg} Boss ATK`, 'damage');
    let logMsg = `👹 BOSS RAGE: ${enemyName} unleashes colossal strike dealing ${rawDmg} physical damage.`;
    
    // Boss board interferences (Beast trials drops Granite Cages)
    if (vaultSubMode === 'beast') {
      logMsg += ' Drops Granite Cages on random tile blocks!';
      setTiles(prev => {
        let count = 0;
        return prev.map(tile => {
          if (!tile.matched && !tile.selected && !tile.caged && count < 2) {
            count++;
            return { ...tile, caged: true };
          }
          return tile;
        });
      });
    }

    setBattleLog(prev => [logMsg, ...prev.slice(0, 15)]);
    setEnemyTimer(enemyAttackCooldown); // Reset timer

    // Check defeat conditions
    if (playerHP - dmgTaken <= 0) {
      handlePuzzleDefeat(`${enemyName} crushed your defensive guard vanguard squads.`);
    }
  };

  // TRIGGER HERO ACTIVE ULTIMATE ABILITIES
  const handleTriggerUltimate = (hero: PuzzleHero) => {
    if (hero.energy < 100 || puzzleOutcome) return;

    // Reset energy
    setPuzzleHeroes(prev => prev.map(h => {
      if (h.id === hero.id) return { ...h, energy: 0 };
      return h;
    }));

    let logMsg = '';
    
    if (hero.name === 'Ignis') {
      const fireDmg = 4500;
      setEnemyHP(prev => Math.max(0, prev - fireDmg));
      triggerFloatingText(`-${fireDmg} Fire Calamity`, 'damage');
      
      // Shatter all Granite Cages on board
      setTiles(prev => prev.map(t => t.caged ? { ...t, caged: false } : t));
      logMsg = `🔥 Ignis cast Inferno Calamity! Shattered all stone Granite Cages and incinerated enemy for ${fireDmg} Fire damage!`;
    } else if (hero.name === 'Sariel') {
      const shieldValue = 3500;
      setPlayerShield(prev => prev + shieldValue);
      setEnemyTimer(prev => prev + 3); // freeze/delay boss attack countdown
      triggerFloatingText(`+${shieldValue} Ice Aegis`, 'shield');
      logMsg = `❄️ Sariel cast Crystalline Aegis! Deployed massive Sapphire shield and delayed boss rage timer (+3 moves).`;
    } else if (hero.name === 'Garrick') {
      const healValue = 4000;
      setPlayerHP(prev => Math.min(playerMaxHP, prev + healValue));
      setTrayCapacity(8); // Expand tray slot to 8
      triggerFloatingText(`+${healValue} Green Mend`, 'heal');
      logMsg = `🌿 Garrick cast Thorned Bulwark! Healed team for ${healValue} HP and expanded Altar Tray to 8 slots!`;
    }

    setBattleLog(prev => [logMsg, ...prev.slice(0, 15)]);
    
    // Check quick victory
    setTimeout(() => {
      if (enemyHP <= 0) {
        handlePuzzleVictory();
      }
    }, 100);
  };

  // TACTICAL POWER-UPS IMPLEMENTATIONS

  // Undo power-up (Pulls the last selected tile from tray back to coordinates)
  const handlePowerupUndo = () => {
    if (powerupUndoCount <= 0 || tray.length === 0 || !lastSelectedTileId) {
      triggerFloatingText('Unavailable', 'damage');
      return;
    }

    setPowerupUndoCount(prev => prev - 1);
    const lastTile = tray[tray.length - 1];
    setTray(prev => prev.slice(0, prev.length - 1));

    setTiles(prev => prev.map(t => {
      if (t.id === lastTile.id) {
        return { ...t, selected: false };
      }
      return t;
    }));

    triggerFloatingText('Undo Executed', 'shield');
    setBattleLog(prev => ['⏳ Celestial Undo: Recalled last clicked tile block back to grid coordinates.', ...prev.slice(0, 15)]);
  };

  // Shuffle power-up (Re-randomizes coordinates of remaining tiles)
  const handlePowerupShuffle = () => {
    if (powerupShuffleCount <= 0) {
      triggerFloatingText('Unavailable', 'damage');
      return;
    }

    setPowerupShuffleCount(prev => prev - 1);
    
    setTiles(prev => {
      // Get all unselected, unmatched tiles
      const remaining = prev.filter(t => !t.matched && !t.selected);
      const matchedSelected = prev.filter(t => t.matched || t.selected);

      // Extract and shuffle their visual coordinates and layers
      const coords = remaining.map(t => ({ x: t.x, y: t.y, layer: t.layer }));
      for (let i = coords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = coords[i];
        coords[i] = coords[j];
        coords[j] = temp;
      }

      // Re-assign coordinates
      const shuffled = remaining.map((tile, idx) => ({
        ...tile,
        x: coords[idx].x,
        y: coords[idx].y,
        layer: coords[idx].layer
      }));

      return [...matchedSelected, ...shuffled];
    });

    triggerFloatingText('Board Shuffled', 'hero');
    setBattleLog(prev => ['🔄 Astral Shuffle: Board elements scrambled to secure match opportunities.', ...prev.slice(0, 15)]);
  };

  // Hint power-up (Identifies playable matches)
  const handlePowerupHint = () => {
    if (powerupHintCount <= 0) {
      triggerFloatingText('Unavailable', 'damage');
      return;
    }

    setPowerupHintCount(prev => prev - 1);

    // Scan for playable tiles on the board
    const playable = tiles.filter(t => isTilePlayable(t, tiles));
    
    // Group them by type to find matches
    const groups: Record<string, MahjongTile[]> = {};
    playable.forEach(tile => {
      if (!groups[tile.type]) groups[tile.type] = [];
      groups[tile.type].push(tile);
    });

    const matchingType = Object.keys(groups).find(type => groups[type].length >= 2);

    if (matchingType) {
      const matchIds = groups[matchingType].slice(0, 3).map(t => t.id);
      // Flash the matching tiles
      triggerFloatingText('Hint Revealed!', 'hero');
      setBattleLog(prev => [`💡 Celestial Hint: Match these playable ${matchingType.toUpperCase()} blocks next!`, ...prev.slice(0, 15)]);
    } else {
      setBattleLog(prev => ['💡 Celestial Hint: Scanned board... no immediate matching trios. Use Astral Shuffle!', ...prev.slice(0, 15)]);
    }
  };

  // Revive power-up (Clears 3 oldest tiles from tray to prevent deadlocks)
  const handlePowerupRevive = () => {
    if (tray.length < 3) {
      triggerFloatingText('Tray has space!', 'shield');
      return;
    }

    // Spend gold or items
    const goldCost = 600;
    if (resources.food < goldCost) { // Using food or silver equivalent
      addLog?.('Insufficient resources to evoke Chronos Revive!', 'warning');
      return;
    }

    const removed = tray.slice(0, 3);
    const nextTray = tray.slice(3);

    // Free matching tiles back to unmatched state in the pool
    setTiles(prev => prev.map(t => {
      if (removed.some(r => r.id === t.id)) {
        return { ...t, selected: false };
      }
      return t;
    }));

    setTray(nextTray);
    triggerFloatingText('Tray Purged!', 'shield');
    setBattleLog(prev => ['⏳ Chronos Revive: Oldest 3 tiles removed from tray, preventing failure!', ...prev.slice(0, 15)]);
  };

  // BATTLE VICTORY RESOLUTION
  const handlePuzzleVictory = () => {
    setPuzzleOutcome('victory');
    setBattleLog(prev => [`🏆 VICTORY: You have conquered the Vault battle!`, ...prev]);

    // Give rewards by sub-mode
    if (vaultSubMode === 'expedition') {
      const stage = stages.find(s => s.id === currentCampaignId) || stages[0];
      onCompleteStage(stage.id, stage.rewards);
    } else if (vaultSubMode === 'arena') {
      // PvP Arena yields Medals and Valor
      if (onAddResources) {
        onAddResources({ valor: 150 });
        addLog?.('🏆 Arena Victory: Claimed +150 Valor & +250 Arena Medals!', 'success');
      }
    } else if (vaultSubMode === 'beast') {
      // Beast Trial yields massive stone
      if (onAddResources) {
        onAddResources({ stone: 4000, valor: 200 });
        addLog?.('🐲 Beast Slayed! Claimed +4,000 Wood & +200 Valor!', 'success');
      }
    } else if (vaultSubMode === 'convergence') {
      if (onAddResources) {
        onAddResources({ valor: 300 });
        addLog?.('🌟 Solar Convergence: Received +300 Event Tokens & Cosmic frames!', 'success');
      }
    } else {
      // Endless or Daily Challenges
      if (onAddResources) {
        onAddResources({ food: 2000, wood: 2000 });
        addLog?.('⛓️ Endless Vault Floor Cleared! Received raw materials.', 'success');
      }
    }
  };

  // BATTLE DEFEAT RESOLUTION
  const handlePuzzleDefeat = (reason: string) => {
    setPuzzleOutcome('defeat');
    setBattleLog(prev => [`💀 DEFEAT: ${reason}`, ...prev]);
  };

  // Claim simulation loop
  const handleClaimSimulationLoot = () => {
    if (!simulatedEnemy || !simulationResult) return;
    if (simulationResult.winner === 'attacker') {
      onClaimMonsterRewards?.(simulatedEnemy.name, simulatedEnemy.rewards);
    } else {
      addLog?.(`Expedition retreated. Recover wounded corps from the Sovereign Hospital.`, 'warning');
    }
    setSimulationResult(null);
    setSimulatedEnemy(null);
  };

  const handleLaunchMonsterHunt = (monster: Monster) => {
    if (deployInf === 0 && deployMark === 0 && deployCav === 0) {
      addLog?.('Must assign at least one battalion unit to launch expedition columns!', 'warning');
      return;
    }
    
    if (resources.food < 200) {
      addLog?.('Citadel under-provisioned: Under-provisioned scouts lack necessary Food for monster tracking logistics.', 'warning');
      return;
    }
    
    const armyInput: CombatArmyInput = {
      name: 'Vanguard Strike Force',
      troopCounts: {
        infantry_t1: deployInf,
        marksmen_t1: deployMark,
        cavalry_t1: deployCav
      },
      heroes: selectedHeroIds.map(hName => {
        const found = activeHeroes.find(h => h.name === hName);
        return {
          name: hName,
          type: 'War' as const,
          level: found?.level || 1,
          xp: found?.xp || 0,
          attack: found?.attack || 100,
          defense: found?.defense || 100,
          role: found?.role || 'War',
          bonus: found?.bonus || ''
        };
      }),
      researchLevels: {},
      buildingLevels: {}
    };
    
    const result = simulateMonsterHunt(armyInput, monster.name, monster.level);
    setSimulationResult(result);
    setSimulatedEnemy(monster);
    addLog?.(`🏹 Expedition Launch! Trackers engaged "${monster.name}" inside the deep wilderness sectors.`, 'info');
  };

  // Weakness badge rendering
  const renderWeaknessBadge = (weakness: string) => {
    switch (weakness) {
      case 'infantry': return <span className="text-[10px] bg-red-950/40 text-red-400 border border-red-900/30 px-2 py-0.5 rounded-full font-mono font-bold tracking-tight">Weak: INFANTRY 🛡️</span>;
      case 'marksmen': return <span className="text-[10px] bg-sky-950/40 text-sky-400 border border-sky-900/30 px-2 py-0.5 rounded-full font-mono font-bold tracking-tight">Weak: MARKSMEN 🏹</span>;
      case 'cavalry': return <span className="text-[10px] bg-amber-950/40 text-amber-400 border border-amber-900/30 px-2 py-0.5 rounded-full font-mono font-bold tracking-tight">Weak: CAVALRY 🐎</span>;
      default: return <span className="text-[10px] bg-zinc-950 text-zinc-500 border border-zinc-900 px-2 py-0.5 rounded-full font-mono font-bold tracking-tight">Weak: NONE 💎</span>;
    }
  };

  const getTileLabelAndEmoji = (type: string) => {
    switch (type) {
      case 'sword': return { emoji: '⚔️', label: 'Infantry Attack' };
      case 'bow': return { emoji: '🏹', label: 'Marksmen Volley' };
      case 'shield': return { emoji: '🛡️', label: 'Defense Shield' };
      case 'crystal': return { emoji: '✨', label: 'Hero Energy' };
      case 'potion': return { emoji: '🧪', label: 'Heal Potion' };
      case 'dragon_crest': return { emoji: '🐉', label: 'Ultimate Action' };
      default: return { emoji: '💎', label: 'Relic' };
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#05070d] text-slate-200 overflow-y-auto pb-24 font-sans select-none border-x border-[#1a2336] shadow-2xl flex flex-col">
      {/* Upper Navigation Selector */}
      <div className="bg-[#080d19]/90 border-b border-amber-500/10 px-4 pt-4 pb-1 shrink-0 z-40 sticky top-0 backdrop-blur-md">
        <div className="text-[10px] text-amber-400 font-black tracking-[0.25em] uppercase mb-1">ASTRAL RELIQUARY</div>
        <h1 className="text-xl font-bold font-serif tracking-tight text-white mb-3">🔮 THE CRYSTAL VAULT</h1>

        <div className="flex gap-1.5 font-mono text-xs">
          <button
            onClick={() => setMainTab('vault')}
            className={`flex-1 py-2 rounded-xl text-[11px] font-bold tracking-tight border flex items-center justify-center gap-1.5 transition-all duration-200 ${
              mainTab === 'vault'
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-black border-amber-400 font-extrabold shadow-lg shadow-amber-950/20'
                : 'bg-zinc-950/60 border-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <span>🔮</span>
            <span>Mahjong Battle Vault</span>
          </button>
          <button
            onClick={() => setMainTab('monsters')}
            className={`flex-1 py-2 rounded-xl text-[11px] font-bold tracking-tight border flex items-center justify-center gap-1.5 transition-all duration-200 ${
              mainTab === 'monsters'
                ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 text-black border-emerald-400 font-extrabold shadow-lg shadow-emerald-950/20'
                : 'bg-zinc-950/60 border-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-900'
            }`}
          >
            <span>👾</span>
            <span>Monster Hunts</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4 flex-1 flex flex-col">
        {/* MAIN TAB: MAH-JONG BATTLE VAULT */}
        {mainTab === 'vault' && !puzzleActive && (
          <div className="space-y-4 flex flex-col flex-1">
            {/* Intro banner */}
            <div className="bg-[#12141c]/90 border border-amber-900/10 p-3.5 rounded-xl">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500 animate-pulse" />
                <h2 className="text-sm font-semibold text-white font-serif">Select Mahjong Battle Mode</h2>
              </div>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Connect the matching puzzle grid to execute direct unit commands, shields, heals and hero ultimates in real-time. Arena remains the <span className="text-amber-400 font-bold font-mono">ONLY</span> match combat mode; 4X overworld strategy is unchanged.
              </p>
            </div>

            {/* Mode selection buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono">
              {[
                { id: 'expedition', icon: '🧭', title: 'Puzzle Expedition', desc: 'Handcrafted story' },
                { id: 'arena', icon: '⚔️', title: 'Relic Arena PvP', desc: 'Commander duels' },
                { id: 'beast', icon: '👹', title: 'Alliance Beast Trials', desc: 'World boss raid' },
                { id: 'endless', icon: '⛓️', title: 'Endless Vault', desc: 'Procedural climb' },
                { id: 'extreme', icon: '⚡', title: 'Daily Extreme', desc: 'Hazardous board' },
                { id: 'convergence', icon: '🌟', title: 'Crystal Convergence', desc: 'Bi-weekly LiveOps' }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setVaultSubMode(sub.id as any)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between h-24 transition-all duration-200 cursor-pointer ${
                    vaultSubMode === sub.id
                      ? 'bg-gradient-to-b from-amber-950/30 to-zinc-900 border-amber-500 shadow-lg shadow-amber-950/10 ring-1 ring-amber-500'
                      : 'bg-[#0d0f14] border-zinc-900 text-zinc-400 hover:border-zinc-800 hover:bg-[#111319]'
                  }`}
                >
                  <div className="flex justify-between items-start w-full">
                    <span className="text-xl">{sub.icon}</span>
                    {vaultSubMode === sub.id && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white mt-1 leading-none">{sub.title}</h3>
                    <p className="text-[9px] text-zinc-500 mt-0.5 leading-none">{sub.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Mode descriptions & portal starter */}
            <div className="flex-1 bg-[#101217] border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="border-b border-zinc-950 pb-2">
                  <span className="text-[9px] font-mono text-amber-500 uppercase tracking-widest block font-bold">CRYSTAL PORTAL ENGAGEMENT</span>
                  <h2 className="font-serif font-extrabold text-white text-base mt-0.5">
                    {vaultSubMode === 'expedition' && '🧭 Puzzle Expedition Chapter stages'}
                    {vaultSubMode === 'arena' && '⚔️ Turn-Based Relic Arena (Simulated PvP)'}
                    {vaultSubMode === 'beast' && '👹 Alliance Beast Trials: Goliath Titan'}
                    {vaultSubMode === 'endless' && '⛓️ Endless Vault: Procedural Climber'}
                    {vaultSubMode === 'extreme' && '⚡ Daily Extreme Challenge: Thunder Tempest'}
                    {vaultSubMode === 'convergence' && '🌟 Crystal Convergence: Solar Event'}
                  </h2>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed italic">
                  {vaultSubMode === 'expedition' && 'Assemble 3 legendary heroes. Match Sword, Bow, and Shields to clear the elemental region stages and unlock raw building lumber and iron. Uses standard sanctum progress limitations.'}
                  {vaultSubMode === 'arena' && 'Test match strategies in direct turn-based squad combat against a rival commander defender deck! Arena matches are the single and exclusive puzzle combat mode in Crownspire.'}
                  {vaultSubMode === 'beast' && 'Coordinate with your Alliance to clear layered puzzle sheets. Beware: the Goliath Titan drops hazardous Granite Cages on the grid, blocking matches until shattered.'}
                  {vaultSubMode === 'endless' && 'Embark on an infinite ascent through scaling floor levels. Grid layers grow thicker and starting tiles multiply as you climb. Weekly resets offer prestige titles.'}
                  {vaultSubMode === 'extreme' && 'Challenge active environmental hazards. Today: Thunder Tempest locks a random slot in the Altar Tray periodically. Carry-on power-ups are locked.'}
                  {vaultSubMode === 'convergence' && 'Flagship LiveOps event. For the next 14 days, Fire and Light elements matches deal +25% extra damage strength! Convergence scoreboards unlock exclusive Solar skin tiles.'}
                </p>

                {/* Rewards showcase */}
                <div className="bg-zinc-950/80 p-3 rounded-xl border border-zinc-900">
                  <span className="text-[10px] text-zinc-500 font-mono block mb-1">CONQUEST BOOTY & SPONSOR REWARDS</span>
                  <div className="flex flex-wrap gap-2.5 font-mono">
                    {vaultSubMode === 'expedition' && (
                      <>
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/40">+1,500 WOOD</span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-900/40">+800 IRON</span>
                        <span className="text-[10px] text-yellow-400 bg-yellow-950/20 px-2 py-0.5 rounded border border-yellow-900/40">+100 VALOR</span>
                      </>
                    )}
                    {vaultSubMode === 'arena' && (
                      <>
                        <span className="text-[10px] text-amber-400 bg-amber-950/20 px-2 py-0.5 rounded border border-amber-900/40">+250 MEDALS</span>
                        <span className="text-[10px] text-yellow-400 bg-yellow-950/20 px-2 py-0.5 rounded border border-yellow-900/40">+150 VALOR</span>
                      </>
                    )}
                    {vaultSubMode === 'beast' && (
                      <>
                        <span className="text-[10px] text-amber-400 bg-amber-950/20 px-2 py-0.5 rounded border border-amber-900/40">+4,000 STONE</span>
                        <span className="text-[10px] text-yellow-400 bg-yellow-950/20 px-2 py-0.5 rounded border border-yellow-900/40">+200 VALOR</span>
                      </>
                    )}
                    {vaultSubMode === 'endless' && (
                      <span className="text-[10px] text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded">WEEKLY RUNESTONES & ANCIENT COINS</span>
                    )}
                    {vaultSubMode === 'extreme' && (
                      <span className="text-[10px] text-purple-400 bg-purple-950/20 px-2 py-0.5 rounded border border-purple-900/30">EPIC BLACKSMITH RUNES & DUST</span>
                    )}
                    {vaultSubMode === 'convergence' && (
                      <span className="text-[10px] text-yellow-400 bg-yellow-950/20 px-2 py-0.5 rounded border border-yellow-900/40">SOLAR CORE TILE SKIN & MONARCH TITLE</span>
                    )}
                  </div>
                </div>
              </div>

              <button
                onClick={handleStartPuzzleBattle}
                className="w-full py-3 mt-5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-extrabold rounded-xl text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-97 transition-all duration-150"
              >
                <Swords className="w-4.5 h-4.5" />
                Engage Vault Battle
              </button>
            </div>
          </div>
        )}

        {/* THE ACTIVE PUZZLE GAME VIEWPORT */}
        {mainTab === 'vault' && puzzleActive && (
          <div className="space-y-4 flex flex-col flex-1 relative overflow-hidden">
            {/* FLOATING COMBAT TEXT LAYER */}
            <div className="absolute inset-x-0 top-32 pointer-events-none z-50 flex flex-col items-center justify-center gap-1.5 h-16">
              <AnimatePresence>
                {floatingTexts.map(t => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, scale: 0.5, y: 15 }}
                    animate={{ opacity: 1, scale: 1.2, y: -20 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className={`font-mono font-black text-sm px-3 py-1 rounded-full shadow-lg ${
                      t.type === 'damage' ? 'bg-red-950/90 text-red-400 border border-red-900' :
                      t.type === 'heal' ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-900' :
                      t.type === 'shield' ? 'bg-sky-950/90 text-sky-400 border border-sky-900' :
                      'bg-amber-950/90 text-yellow-400 border border-amber-900'
                    }`}
                  >
                    {t.text}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* COMBAT VIEWPORT (TOP SECTION) */}
            <div className="bg-[#0b0d14] border border-zinc-800 rounded-2xl p-3 shadow-inner relative">
              {/* Active Hazard Indicators */}
              {activeHazard.type !== 'none' && (
                <div className="absolute top-2 left-2 z-20 flex items-center gap-1 bg-red-950/60 border border-red-900/30 px-2 py-0.5 rounded-md text-[9px] text-red-400 font-mono animate-pulse">
                  <AlertCircle className="w-3 h-3" />
                  <span>{activeHazard.name}</span>
                </div>
              )}

              <div className="flex justify-between items-center text-xs font-mono mb-2">
                <span className="text-[10px] text-zinc-500 uppercase font-black">COMPOST BATTLE VIEWPORT</span>
                <span className="text-[10px] text-amber-500 font-bold bg-amber-950/20 px-2 py-0.5 rounded border border-amber-900/30">
                  Combo: x{comboMultiplier}
                </span>
              </div>

              {/* Player Squad Health & Shield */}
              <div className="grid grid-cols-2 gap-4 items-center">
                {/* Player Health Bar */}
                <div className="text-left space-y-1">
                  <div className="flex justify-between text-[10px] font-mono leading-none">
                    <span className="text-zinc-400 font-bold">🛡️ Vanguard Squad</span>
                    <span className="text-zinc-100 font-black">{playerHP} / {playerMaxHP}</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden relative">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-500 transition-all duration-300"
                      style={{ width: `${(playerHP / playerMaxHP) * 100}%` }}
                    />
                    {playerShield > 0 && (
                      <div 
                        className="absolute inset-y-0 left-0 bg-sky-400/80 transition-all duration-300"
                        style={{ width: `${Math.min(100, (playerShield / playerMaxHP) * 100)}%` }}
                      />
                    )}
                  </div>
                  {playerShield > 0 && (
                    <span className="text-[8px] font-mono text-sky-400 font-bold block">
                      Barrier Shield active: +{playerShield} absorbing!
                    </span>
                  )}
                </div>

                {/* Boss / Enemy Health Bar */}
                <div className="text-right space-y-1">
                  <div className="flex justify-between text-[10px] font-mono leading-none">
                    <span className="text-red-400 font-black truncate max-w-[100px]">{enemyName}</span>
                    <span className="text-red-400 font-black">{enemyHP} / {enemyMaxHP}</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-l from-red-600 to-red-500 transition-all duration-300"
                      style={{ width: `${(enemyHP / enemyMaxHP) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-end gap-1 items-center text-[9px] font-mono text-zinc-500">
                    <span>Boss Attack Counter:</span>
                    <span className="text-red-400 font-extrabold animate-pulse">{enemyTimer} Moves</span>
                  </div>
                </div>
              </div>
            </div>

            {/* THE 2.5D LAYERED TILE GRID */}
            <div className="bg-[#04060b] border border-zinc-900 rounded-3xl p-4 min-h-[320px] relative overflow-hidden flex flex-col justify-center items-center shadow-2xl">
              {/* Backing structural map lines */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none" />

              {puzzleOutcome ? (
                // Victory / Defeat Screen inside the grid frame
                <div className="text-center space-y-4 z-20 py-10">
                  {puzzleOutcome === 'victory' ? (
                    <div className="space-y-3 animate-bounce">
                      <Trophy className="w-12 h-12 text-yellow-500 mx-auto" />
                      <h2 className="text-xl font-bold font-serif text-white uppercase tracking-wider">Vault Secured!</h2>
                      <p className="text-xs text-emerald-400 font-mono">Defeated {enemyName} successfully.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Skull className="w-12 h-12 text-red-500 mx-auto animate-pulse" />
                      <h2 className="text-xl font-bold font-serif text-white uppercase tracking-wider">Defeat</h2>
                      <p className="text-xs text-red-400 font-mono">Vanguard force fell back.</p>
                    </div>
                  )}

                  <button
                    onClick={() => {
                      setPuzzleActive(false);
                      setPuzzleOutcome(null);
                    }}
                    className="px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-extrabold text-xs font-mono rounded-xl cursor-pointer hover:bg-amber-400 uppercase tracking-wider"
                  >
                    Return to Lobby
                  </button>
                </div>
              ) : (
                // Render Layered Mahjong Grid blocks
                <div className="relative w-full max-w-[280px] h-[280px]">
                  {tiles.map(tile => {
                    const playable = isTilePlayable(tile, tiles);
                    const { emoji, label } = getTileLabelAndEmoji(tile.type);

                    // Skip already matched or selected tiles
                    if (tile.matched || tile.selected) return null;

                    // Compute offsets to represent staggered coordinate layers
                    // Layer 0 starts at offset, Layer 1 shifted, Layer 2 centered
                    const leftOffset = tile.x * 40;
                    const topOffset = tile.y * 40;

                    return (
                      <motion.button
                        key={tile.id}
                        onClick={() => handleSelectTile(tile)}
                        style={{
                          position: 'absolute',
                          left: `${leftOffset}px`,
                          top: `${topOffset}px`,
                          zIndex: tile.layer * 10,
                        }}
                        className={`w-10 h-11 rounded-xl flex flex-col items-center justify-center transition-all duration-150 border select-none relative shadow-md cursor-pointer ${
                          playable 
                            ? 'bg-gradient-to-b from-[#fbfcfd] to-[#e4e7eb] border-amber-400 text-zinc-900 font-bold scale-100 opacity-100 hover:scale-105 hover:shadow-lg shadow-black/40' 
                            : 'bg-zinc-800 border-zinc-900 text-zinc-600 scale-95 opacity-55 saturate-50 cursor-not-allowed'
                        }`}
                        whileTap={playable ? { scale: 0.9 } : {}}
                      >
                        {/* Interactive hazard badge overlay */}
                        {tile.caged && (
                          <div className="absolute inset-0 bg-stone-900/90 border border-stone-800 rounded-xl flex items-center justify-center text-xs text-stone-400 z-20">
                            ⛓️
                          </div>
                        )}
                        {tile.frozen && (
                          <div className="absolute inset-0 bg-sky-950/60 border border-sky-800 rounded-xl flex items-center justify-center text-xs text-sky-400 z-20 animate-pulse">
                            ❄️
                          </div>
                        )}

                        <span className="text-lg leading-none mt-0.5">{emoji}</span>
                        <span className="text-[6.5px] font-mono tracking-tighter scale-90 text-zinc-550 block leading-none font-bold">
                          {tile.type.toUpperCase().substring(0, 4)}
                        </span>
                        
                        {/* Delicate layer gold mark */}
                        {playable && tile.layer > 0 && (
                          <span className="absolute top-0.5 right-1 text-[6px] font-mono text-amber-500 font-black leading-none">
                            L{tile.layer}
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* THE ALTAR TRAY QUEUE */}
            <div className="bg-[#0b0c10] border border-zinc-900 rounded-2xl p-3 space-y-2 shrink-0">
              <div className="flex justify-between items-center text-[10px] font-mono leading-none">
                <span className="text-zinc-500 uppercase font-black flex items-center gap-1">
                  📥 Altar Tray Queue ({tray.length} / {trayCapacity} slots)
                </span>
                {tray.length >= 5 && <span className="text-red-400 font-extrabold animate-pulse">Warning: Tray filling!</span>}
              </div>

              {/* 7 or 8 Slots Tray Grid */}
              <div 
                className="grid gap-1.5 p-1 bg-black/60 rounded-xl border border-zinc-950 min-h-[46px]"
                style={{ gridTemplateColumns: `repeat(${trayCapacity}, minmax(0, 1fr))` }}
              >
                {Array.from({ length: trayCapacity }).map((_, index) => {
                  const occupied = tray[index];
                  return (
                    <div 
                      key={index}
                      className="aspect-square bg-zinc-950/80 border border-zinc-900 rounded-lg flex items-center justify-center relative overflow-hidden"
                    >
                      {occupied && (
                        <motion.div
                          initial={{ scale: 0.2, y: -20 }}
                          animate={{ scale: 1.0, y: 0 }}
                          className="text-lg leading-none select-none"
                        >
                          {getTileLabelAndEmoji(occupied.type).emoji}
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* HERO CARDS / ACTIVE ULTIMATE OVERLAYS */}
            <div className="grid grid-cols-3 gap-2 shrink-0 font-mono">
              {puzzleHeroes.map(hero => {
                const isReady = hero.energy >= 100;
                return (
                  <button
                    key={hero.id}
                    onClick={() => isReady && handleTriggerUltimate(hero)}
                    disabled={!isReady}
                    className={`p-2 rounded-2xl border text-left flex flex-col justify-between h-20 transition-all relative overflow-hidden ${
                      isReady 
                        ? 'bg-gradient-to-b from-amber-900/30 to-zinc-900 border-amber-400 ring-2 ring-amber-400/50 cursor-pointer scale-100 animate-pulse shadow-md' 
                        : 'bg-zinc-950 border-zinc-900 text-zinc-500 scale-95 opacity-80 cursor-not-allowed'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center text-[8px] leading-none font-bold">
                        <span className={isReady ? 'text-amber-400' : 'text-zinc-400'}>👤 {hero.name}</span>
                        <span className="text-[7px] text-zinc-500">Lvl {hero.level}</span>
                      </div>
                      <span className="text-[9px] font-bold text-white block mt-1 leading-tight truncate">
                        {isReady ? hero.ultimateName : hero.passiveName}
                      </span>
                    </div>

                    {/* Mana/Energy progress bar */}
                    <div className="w-full space-y-1">
                      <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${isReady ? 'bg-amber-400' : 'bg-blue-500'}`}
                          style={{ width: `${hero.energy}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[7px] text-zinc-500 leading-none">
                        <span>ENERGY</span>
                        <span>{hero.energy}%</span>
                      </div>
                    </div>

                    {isReady && (
                      <div className="absolute inset-0 bg-amber-500/10 pointer-events-none animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* UTILITY POWER-UPS DOCK */}
            <div className="bg-[#0b0c10] border border-zinc-900 rounded-2xl p-2.5 flex justify-between gap-1.5 shrink-0 text-[10px] font-mono">
              <button
                onClick={handlePowerupUndo}
                className="flex-1 py-1.5 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 flex flex-col items-center justify-center gap-0.5 cursor-pointer text-zinc-300"
              >
                <Undo2 className="w-3.5 h-3.5 text-zinc-400" />
                <span>Undo ({powerupUndoCount})</span>
              </button>
              <button
                onClick={handlePowerupShuffle}
                className="flex-1 py-1.5 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 flex flex-col items-center justify-center gap-0.5 cursor-pointer text-zinc-300"
              >
                <ShuffleIcon className="w-3.5 h-3.5 text-zinc-400" />
                <span>Shuffle ({powerupShuffleCount})</span>
              </button>
              <button
                onClick={handlePowerupHint}
                className="flex-1 py-1.5 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 flex flex-col items-center justify-center gap-0.5 cursor-pointer text-zinc-300"
              >
                <HelpCircle className="w-3.5 h-3.5 text-zinc-400" />
                <span>Hint ({powerupHintCount})</span>
              </button>
              <button
                onClick={handlePowerupRevive}
                className="flex-1 py-1.5 rounded-xl border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 flex flex-col items-center justify-center gap-0.5 cursor-pointer text-zinc-300"
              >
                <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
                <span>Revive (600 F)</span>
              </button>
            </div>

            {/* COMBAT BATTLE FEEDS LOGS */}
            <div className="bg-zinc-950/80 border border-zinc-900 rounded-xl p-2.5 h-16 overflow-y-auto pr-1 text-left shrink-0">
              <span className="text-[8px] font-mono text-zinc-500 uppercase block font-bold mb-0.5">Live Combat logs feeds:</span>
              <div className="space-y-0.5 font-mono text-[9px]">
                {battleLog.map((log, index) => (
                  <div key={index} className="text-zinc-400 leading-tight">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MAIN TAB: MONSTER HUNTS */}
        {mainTab === 'monsters' && (
          <div className="space-y-4 flex flex-col flex-1">
            {/* Guide intro */}
            <div className="bg-[#12141c]/90 border border-amber-900/10 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <h2 className="text-base font-semibold text-white font-serif">Wilderness Monster Tracking</h2>
                </div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Send active vanguard units led by ascended Commanders to hunt down high-threat crypt fiends. Slay beasts to claim rich mineral chests, massive Commander EXP, and character ascension star shards!
                </p>
              </div>
              <button
                id="open-beast-encyclopedia-hunts"
                onClick={() => setIsEncyclopediaOpen(true)}
                className="px-4.5 py-2 bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-mono font-black text-xs uppercase rounded-xl border border-amber-400/30 flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-950/20 shrink-0 self-start md:self-auto"
              >
                <BookOpen className="w-4 h-4" />
                Monster Encyclopedia
              </button>
            </div>

            {/* Selection filters */}
            <div className="bg-[#0b1020] border border-[#1a2d52] rounded-xl p-3 grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <span className="text-[9px] text-zinc-400 uppercase font-black block mb-1">BEAST RARITY</span>
                <select
                  value={filterRarity}
                  onChange={(e) => setFilterRarity(e.target.value as any)}
                  className="w-full bg-[#111827] border border-zinc-800 rounded px-2.5 py-1 text-white outline-none"
                >
                  <option value="All">All Rarities</option>
                  <option value="Common">Common Monsters</option>
                  <option value="Elite">Elite Fiends</option>
                </select>
              </div>

              <div>
                <span className="text-[9px] text-zinc-400 uppercase font-black block mb-1">LEVEL ZONE</span>
                <select
                  value={filterLevelRange}
                  onChange={(e) => setFilterLevelRange(e.target.value as any)}
                  className="w-full bg-[#111827] border border-zinc-800 rounded px-2.5 py-1 text-white outline-none"
                >
                  <option value="All">All Levels (1-50)</option>
                  <option value="1-15">Lvl 1 - 15 (Novice)</option>
                  <option value="16-30">Lvl 16 - 30 (Warden)</option>
                  <option value="31-50">Lvl 31 - 50 (Mythic)</option>
                </select>
              </div>
            </div>

            {/* List and Details Layout split */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-stretch">
              {/* Left-side monster list */}
              <div className="md:col-span-2 space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
                {CROWNSPIRE_MONSTERS_DATABASE.filter(m => {
                  if (m.rarity === 'World Boss') return false;
                  if (filterRarity !== 'All' && m.rarity !== filterRarity) return false;
                  if (filterLevelRange === '1-15') return m.level <= 15;
                  if (filterLevelRange === '16-30') return m.level >= 16 && m.level <= 30;
                  if (filterLevelRange === '31-50') return m.level >= 31 && m.level <= 50;
                  return true;
                }).map(monster => {
                  const isSelected = selectedMonster?.id === monster.id;
                  return (
                    <div
                      id={`monster-target-card-${monster.id}`}
                      key={monster.id}
                      onClick={() => setSelectedMonster(monster)}
                      className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all duration-150 flex items-center justify-between ${
                        isSelected
                          ? 'bg-gradient-to-r from-emerald-950/20 to-zinc-905 border-emerald-500 shadow-md ring-1 ring-emerald-500'
                          : 'bg-zinc-905/60 border-zinc-900 hover:bg-zinc-900'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-mono leading-none font-bold bg-amber-950/30 text-amber-500 px-1 py-0.5 rounded border border-amber-900/30">
                            Lvl {monster.level}
                          </span>
                          <span className={`text-[9px] font-mono leading-none px-1 py-0.5 rounded border font-bold ${
                            monster.rarity === 'Elite' 
                              ? 'bg-purple-950 text-purple-400 border-purple-900/30' 
                              : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                          }`}>
                            {monster.rarity}
                          </span>
                        </div>
                        <h4 className="font-serif font-black text-white text-xs mt-1.5 leading-none">
                          {monster.name}
                        </h4>
                      </div>

                      <div className="text-right flex flex-col justify-center items-end">
                        <span className="text-[8px] font-mono text-zinc-500 uppercase block font-bold">POWER INDEX</span>
                        <span className="text-xs font-mono font-bold text-red-400 leading-none mt-0.5">
                          {formatNum(monster.power)} CR
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right-side deployment squad details */}
              <div className="md:col-span-3 bg-[#0d101a] border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between">
                {selectedMonster ? (
                  <div className="space-y-4 text-left flex-1 flex flex-col justify-between">
                    <div>
                      {/* Header target summary details */}
                      <div className="border-b border-zinc-900 pb-2.5 flex justify-between items-start">
                        <div>
                          <span className="text-[8px] font-mono text-emerald-400 uppercase tracking-widest block font-bold">TARGET ACTIVE HUNT</span>
                          <h3 className="font-serif font-extrabold text-white text-sm mt-0.5">{selectedMonster.name}</h3>
                          <span className="text-[10px] text-zinc-500 leading-tight block mt-0.5 italic">
                            "{selectedMonster.description}"
                          </span>
                        </div>
                        <span className="text-xl shrink-0 select-none bg-zinc-950/50 p-1.5 rounded-lg border border-zinc-905">
                          👹
                        </span>
                      </div>

                      {/* Power comparison metrics */}
                      <div className="grid grid-cols-2 gap-2 mt-3 bg-zinc-950/50 py-2 px-3 rounded-xl border border-zinc-900 text-[10px] font-mono">
                        <div>
                          <span className="text-zinc-500 block">BASE STATS</span>
                          <span className="text-white block mt-0.5 font-bold">
                            HP: <span className="text-zinc-300 font-mono">{formatNum(selectedMonster.health)}</span>
                          </span>
                          <span className="text-white block font-bold">
                            ATK: <span className="text-red-400 font-mono">{formatNum(selectedMonster.attack)}</span>
                          </span>
                        </div>
                        <div className="text-left">
                          <span className="text-zinc-500 block">TACTICAL ADVANTAGE</span>
                          <div className="mt-1">{renderWeaknessBadge(selectedMonster.troopWeakness)}</div>
                        </div>
                      </div>

                      {/* HERO COMMANDERS DISPATCHING */}
                      <div className="mt-4">
                        <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-black block mb-2">MARCH HERO COMMANDERS ({selectedHeroIds.length} / 3)</span>
                        <div className="grid grid-cols-3 gap-1.5">
                          {activeHeroes.map(hero => {
                            const isDeployed = selectedHeroIds.includes(hero.name);
                            return (
                              <button
                                key={hero.name}
                                onClick={() => {
                                  if (isDeployed) {
                                    setSelectedHeroIds(prev => prev.filter(n => n !== hero.name));
                                  } else if (selectedHeroIds.length < 3) {
                                    setSelectedHeroIds(prev => [...prev, hero.name]);
                                  }
                                }}
                                className={`p-1.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                                  isDeployed
                                    ? 'bg-emerald-950/30 border-emerald-500/80 text-white shadow-inner scale-95'
                                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                                }`}
                              >
                                <span className="text-lg">👤</span>
                                <span className="text-[8px] font-mono font-bold truncate max-w-full text-zinc-300 block leading-none mt-1">
                                  {hero.name.split(' ')[0]}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* SLIDER MARCH BUILDERS */}
                      <div className="mt-4 space-y-3">
                        <span className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest font-black block mb-1">DRAFT FORCE BATTALIONS</span>
                        
                        <div>
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-zinc-400 flex items-center gap-1">🛡️ Deployed Infantry</span>
                            <span className="text-zinc-100 font-bold">{formatNum(deployInf)} / {formatNum(totalAvailableInf)}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max={totalAvailableInf}
                            value={deployInf}
                            onChange={(e) => setDeployInf(parseInt(e.target.value) || 0)}
                            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500 mt-1"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between items-center text-[10px] font-mono">
                            <span className="text-zinc-400 flex items-center gap-1">🏹 Deployed Marksmen</span>
                            <span className="text-zinc-100 font-bold">{formatNum(deployMark)} / {formatNum(totalAvailableMark)}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max={totalAvailableMark}
                            value={deployMark}
                            onChange={(e) => setDeployMark(parseInt(e.target.value) || 0)}
                            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-sky-500 mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Launch action trigger */}
                    <div className="mt-5 border-t border-zinc-900 pt-3">
                      <button
                        onClick={() => handleLaunchMonsterHunt(selectedMonster)}
                        className="w-full py-2 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-black font-extrabold rounded-lg text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 transition-all duration-150"
                      >
                        <Swords className="w-4 h-4" /> Deployed Trackers on Hunt!
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-550 border-2 border-dashed border-zinc-900 rounded-xl h-full">
                    <Compass className="w-10 h-10 mb-2 stroke-zinc-700 animate-pulse" />
                    <span className="text-xs font-mono">SELECT A WILDERNESS BEAST TARGET</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* COMBAT SIMULATION POPUP INTERFACES */}
      {simulationResult && simulatedEnemy && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#0d0f14] border border-zinc-850 rounded-3xl p-5 text-left shadow-2xl flex flex-col justify-between max-h-[90vh]">
            <div>
              <div className="flex items-center gap-3 border-b border-zinc-900 pb-3">
                <span className="text-2xl">📊</span>
                <div>
                  <h3 className="font-serif font-black text-white text-sm">March Conflict Dispatch Report</h3>
                  <span className="text-[10px] text-zinc-500 font-mono">Target: {simulatedEnemy.name} (Lvl {simulatedEnemy.level})</span>
                </div>
              </div>

              <div className="mt-4 space-y-3 font-mono text-xs overflow-y-auto max-h-[50vh] pr-1">
                {/* Result Title */}
                <div className={`p-3 rounded-xl border text-center font-bold uppercase tracking-wider ${
                  simulationResult.winner === 'attacker'
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400 animate-pulse'
                    : 'bg-rose-950/20 border-rose-500/30 text-rose-400'
                }`}>
                  {simulationResult.winner === 'attacker' ? '🎉 HUNT VICTORIOUS 🎉' : '💀 MARCH DEFEATED 💀'}
                </div>

                {/* Casualties summary details */}
                <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900 space-y-1.5">
                  <span className="text-[10px] text-zinc-500 uppercase block font-bold">CASUALTIES & RECOVERIES</span>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Field Deceased:</span>
                    <span className="text-red-400 font-bold">-{simulationResult.losses?.deceased || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Hospitalized Wounded:</span>
                    <span className="text-yellow-500 font-bold">+{simulationResult.losses?.wounded || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Surviving Forces:</span>
                    <span className="text-emerald-400 font-bold">{simulationResult.losses?.survived || 0}</span>
                  </div>
                </div>

                {/* Simulation log snippets */}
                <div className="bg-[#05070a] p-2.5 rounded-lg border border-zinc-905 font-mono text-[9px] text-zinc-500 h-28 overflow-y-auto space-y-1 leading-normal">
                  <span className="text-zinc-400 block font-bold uppercase">Skirmish Log:</span>
                  {simulationResult.logs?.map((log: string, idx: number) => (
                    <div key={idx}>{log}</div>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleClaimSimulationLoot}
              className="w-full py-2.5 mt-5 bg-gradient-to-r from-amber-600 to-amber-500 text-black font-extrabold rounded-xl text-xs font-mono uppercase tracking-wider cursor-pointer hover:bg-amber-400 text-center shadow-lg active:scale-95"
            >
              Claim Slay Loot & Dismantle
            </button>
          </div>
        </div>
      )}

      {/* Encyclopedia Modal Portal wrapper */}
      {isEncyclopediaOpen && (
        <MonsterEncyclopediaModal 
          isOpen={isEncyclopediaOpen}
          onClose={() => setIsEncyclopediaOpen(false)} 
        />
      )}
    </div>
  );
}
