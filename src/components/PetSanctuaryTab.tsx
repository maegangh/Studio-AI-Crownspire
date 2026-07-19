import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PET_TEMPLATES, 
  EXPEDITIONS_DATABASE, 
  UserPet, 
  PetTemplate, 
  PetExpedition, 
  calculatePetPower, 
  compilePetAbilityStats, 
  getPetUpgradeCost, 
  getPetStarCost, 
  getPetEvolutionRequirement,
  getEvolvedRarity,
  PetRarity
} from '../utils/petDatabase';
import { Resources, Hero } from '../types';
import { 
  Sparkles, 
  Award, 
  ChevronRight, 
  Lock, 
  ShieldAlert, 
  Timer, 
  Utensils, 
  Heart, 
  Shield, 
  Flame, 
  Compass, 
  UserPlus, 
  CheckCircle2, 
  Gift, 
  RefreshCcw, 
  Moon, 
  Wrench,
  Trophy
} from 'lucide-react';
import { formatNum } from '../gameData';

interface PetSanctuaryTabProps {
  ownerPets: UserPet[];
  onPetsChange: (nextPets: UserPet[]) => void;
  petFeed: number;
  onFeedChange: (nextFeed: number) => void;
  petShards: Record<string, number>;
  onShardsChange: (nextShards: Record<string, number>) => void;
  resources: Resources;
  onResourcesChange: (nextRes: Resources) => void;
  heroes: Hero[];
  addLog: (text: string, type?: 'info' | 'success' | 'warning' | 'combat') => void;
}

export default function PetSanctuaryTab({
  ownerPets,
  onPetsChange,
  petFeed,
  onFeedChange,
  petShards,
  onShardsChange,
  resources,
  onResourcesChange,
  heroes,
  addLog,
}: PetSanctuaryTabProps) {

  const [selectedPetId, setSelectedPetId] = useState<string | null>(
    ownerPets.length > 0 ? ownerPets[0].id : null
  );
  
  // Shop and hatching states
  const [hatchLoading, setHatchLoading] = useState(false);
  const [hatchedPet, setHatchedPet] = useState<UserPet | null>(null);
  const [rewardsStoreOpen, setRewardsStoreOpen] = useState(false);
  
  // Real-time ticking for active expeditions
  const [currentTime, setCurrentTime] = useState(Date.now());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Guarantee selected pet ID stays valid if list changes
  useEffect(() => {
    if (ownerPets.length > 0 && (!selectedPetId || !ownerPets.some(p => p.id === selectedPetId))) {
      setSelectedPetId(ownerPets[0].id);
    }
  }, [ownerPets, selectedPetId]);

  const selectedPet = ownerPets.find(p => p.id === selectedPetId);
  const selectedTemplate = selectedPet 
    ? PET_TEMPLATES.find(t => t.id === selectedPet.baseId) 
    : undefined;

  // Render variables for total power
  const totalPetPowerSum = ownerPets.reduce((acc, p) => acc + calculatePetPower(p), 0);

  // --- ACTIONS HANDLERS ---

  /**
   * Action: Hatch a Random Pet Egg!
   */
  const handleHatchEgg = () => {
    // Egg hatching costs 250 Valor points or 4,000 Food. Let's spend 150 Valor.
    if (resources.valor < 150) {
      addLog("❌ Insufficient Valor! Hatching a Mystic Sanctum Egg requires 150 Valor points.", "warning");
      return;
    }

    setHatchLoading(true);
    
    // Spend resource
    onResourcesChange({
      ...resources,
      valor: resources.valor - 150
    });

    setTimeout(() => {
      // Roll random pet template
      const randIdx = Math.floor(Math.random() * PET_TEMPLATES.length);
      const chosenTemplate = PET_TEMPLATES[randIdx];
      
      // Check if player already owns this pet
      const existingPet = ownerPets.find(p => p.baseId === chosenTemplate.id);
      
      if (existingPet) {
        // Player already has it! Give them shards instead
        const incomingShards = 35;
        onShardsChange({
          ...petShards,
          [chosenTemplate.id]: (petShards[chosenTemplate.id] || 0) + incomingShards
        });
        
        // Setup mock hatched entity for display popup
        const mockPet: UserPet = {
          id: 'duplicate_conversion',
          baseId: chosenTemplate.id,
          name: chosenTemplate.baseName,
          level: 1,
          stars: 0,
          evolution: 0,
          shards: incomingShards,
          rarity: chosenTemplate.baseRarity
        };
        
        setHatchedPet(mockPet);
        addLog(`🥚 Hatched duplicate Egg: Converted to +${incomingShards} "${chosenTemplate.baseName}" Shards!`, "success");
      } else {
        // Instantiate a beautiful new pet
        const newPetId = `pet_${chosenTemplate.id}_${Date.now()}`;
        const newPet: UserPet = {
          id: newPetId,
          baseId: chosenTemplate.id,
          name: chosenTemplate.baseName,
          level: 1,
          stars: 0,
          evolution: 0,
          shards: 0,
          rarity: chosenTemplate.baseRarity,
          equippedHeroId: null,
          expeditionId: null,
          expeditionEndTime: null
        };
        
        const nextPets = [...ownerPets, newPet];
        onPetsChange(nextPets);
        setSelectedPetId(newPetId);
        setHatchedPet(newPet);
        addLog(`✨ Sovereign Awakening! A brand new "${chosenTemplate.baseName}" has successfully hatched and bound to your Sanctum!`, "success");
      }

      setHatchLoading(false);
    }, 1200);
  };

  /**
   * Action: Level Up Pet
   */
  const handleLevelUp = (petId: string) => {
    const pet = ownerPets.find(p => p.id === petId);
    if (!pet) return;

    if (pet.level >= (pet.evolution === 0 ? 25 : pet.evolution === 1 ? 50 : 100)) {
      addLog(`⚠️ Level capped! Evolve this pet to break properties limits.`, "warning");
      return;
    }

    const { feedCost, foodCost } = getPetUpgradeCost(pet);

    if (petFeed < feedCost) {
      addLog(`❌ Insufficient feed! Blacksmith stores sell feed, or gather inside the expedition boards.`, "warning");
      return;
    }
    if (resources.food < foodCost) {
      addLog(`❌ Insufficient food resources to perform training exercises.`, "warning");
      return;
    }

    // Deduct
    onFeedChange(petFeed - feedCost);
    onResourcesChange({
      ...resources,
      food: resources.food - foodCost
    });

    // Update level
    const nextPets = ownerPets.map(p => {
      if (p.id === petId) {
        return {
          ...p,
          level: p.level + 1
        };
      }
      return p;
    });

    onPetsChange(nextPets);
    addLog(`🍖 Level Up! ${pet.name} is now Level ${pet.level + 1}! Combat multipliers expanded.`, "success");
  };

  /**
   * Action: Star Upgrade / Ascension
   */
  const handleStarUpgrade = (petId: string) => {
    const pet = ownerPets.find(p => p.id === petId);
    if (!pet) return;

    if (pet.stars >= 5) {
      addLog("⭐ This companion is already fully ascended at 5 Stars Mastered!", "warning");
      return;
    }

    const { neededShards, valorCost } = getPetStarCost(pet);
    const playerShards = petShards[pet.baseId] || 0;

    if (playerShards < neededShards) {
      addLog(`❌ Shards missing! You need ${neededShards} shards; currently hold ${playerShards}.`, "warning");
      return;
    }
    if (resources.valor < valorCost) {
      addLog(`❌ Insufficient Valor points to catalyze star alignment.`, "warning");
      return;
    }

    // Deduct
    const nextShards = { ...petShards };
    nextShards[pet.baseId] = playerShards - neededShards;
    onShardsChange(nextShards);

    onResourcesChange({
      ...resources,
      valor: resources.valor - valorCost
    });

    // Update stars
    const nextPets = ownerPets.map(p => {
      if (p.id === petId) {
        return {
          ...p,
          stars: p.stars + 1
        };
      }
      return p;
    });

    onPetsChange(nextPets);
    addLog(`⭐ Constellation Spark! ${pet.name} has ascended to Rank ★${pet.stars + 1}! Secondary perks unlocked/advanced.`, "success");
  };

  /**
   * Action: Evolve Pet
   */
  const handleEvolve = (petId: string) => {
    const pet = ownerPets.find(p => p.id === petId);
    if (!pet) return;

    const req = getPetEvolutionRequirement(pet);
    if (!req) return;

    if (pet.level < req.requiredLevel) {
      addLog(`⚠️ Requirement fail: Level ${req.requiredLevel} required. Currently Level ${pet.level}.`, "warning");
      return;
    }
    if (pet.stars < req.requiredStars) {
      addLog(`⚠️ Requirement fail: Star Rank ★${req.requiredStars} required. Currently Rank ★${pet.stars}.`, "warning");
      return;
    }
    if (resources.valor < req.valorCost) {
      addLog(`❌ Insufficient Valor! Needs ${formatNum(req.valorCost)} Valor.`, "warning");
      return;
    }
    if (resources.iron < req.ironCost) {
      addLog(`❌ Insufficient Iron blocks to hammer evolution charms! Needs ${formatNum(req.ironCost)} Iron.`, "warning");
      return;
    }

    // Deduct
    onResourcesChange({
      ...resources,
      valor: resources.valor - req.valorCost,
      iron: resources.iron - req.ironCost
    });

    // Update pet attributes
    const t = PET_TEMPLATES.find(tp => tp.id === pet.baseId)!;
    const nextEvo = pet.evolution + 1;
    const evolvedName = t.evolutionNames[nextEvo] || pet.name;
    const nextRarity = getEvolvedRarity(t.baseRarity, nextEvo);

    const nextPets = ownerPets.map(p => {
      if (p.id === petId) {
        return {
          ...p,
          evolution: nextEvo,
          name: evolvedName,
          rarity: nextRarity
        };
      }
      return p;
    });

    onPetsChange(nextPets);
    addLog(`🧬 MAGNIFICENT EVOLUTION! ${pet.name} evolved into an elite "${evolvedName}"! Rarity upgraded to high-tier [${nextRarity}]!`, "success");
  };

  /**
   * Action: Assign Companionship to recuited Hero
   */
  const handleAssignCompanion = (petId: string, heroId: string | null) => {
    const nextPets = ownerPets.map(p => {
      // Clear hero if already assigned on other pet
      if (heroId && p.equippedHeroId === heroId) {
        return { ...p, equippedHeroId: null };
      }
      // Set to selected pet
      if (p.id === petId) {
        return { ...p, equippedHeroId: heroId };
      }
      return p;
    });

    onPetsChange(nextPets);
    
    if (heroId) {
      const hero = heroes.find(h => (h.id || h.name) === heroId);
      addLog(`🔗 Companion Bound! This companion pet is now fielded alongside commander "${hero?.name || heroId}"!`, "info");
    } else {
      addLog(`🔗 Companion released into general Sanctuary fields.`, "info");
    }
  };

  /**
   * Action: Deploy Pet on Expedition
   */
  const handleDeployExpedition = (missionId: string, deployedPetIds: string[]) => {
    const mission = EXPEDITIONS_DATABASE.find(m => m.id === missionId);
    if (!mission || deployedPetIds.length === 0) return;

    // Check combined power
    const activeMisfits = ownerPets.filter(p => deployedPetIds.includes(p.id));
    const combinedPower = activeMisfits.reduce((acc, p) => acc + calculatePetPower(p), 0);

    if (combinedPower < mission.requiredPower) {
      addLog(`❌ Misaligned dispatch! Combined power of ${combinedPower} falls below required ${mission.requiredPower}.`, "warning");
      return;
    }

    // Deploy: set expeditionId and endTime
    const endEpoch = Date.now() + mission.durationMinutes * 60 * 1000;

    const nextPets = ownerPets.map(p => {
      if (deployedPetIds.includes(p.id)) {
        return {
          ...p,
          expeditionId: missionId,
          expeditionEndTime: endEpoch
        };
      }
      return p;
    });

    onPetsChange(nextPets);
    addLog(`⚔️ Expedition Dispatched! Deployed ${deployedPetIds.length} pets on ${mission.name}. Return expected in ${mission.durationMinutes}m!`, "info");
  };

  /**
   * Action: Claim Finished Expedition Payouts
   */
  const handleClaimExpedition = (missionId: string) => {
    const mission = EXPEDITIONS_DATABASE.find(m => m.id === missionId);
    if (!mission) return;

    const assignedPets = ownerPets.filter(p => p.expeditionId === missionId);
    if (assignedPets.length === 0) return;

    // Ready to claim check
    const isReady = assignedPets.every(p => p.expeditionEndTime && currentTime >= p.expeditionEndTime);
    if (!isReady) return;

    // Aggregate rewards
    let gainedFeed = mission.rewardFeed;
    let gainedGold = mission.rewardResources.food;
    let gainedWood = mission.rewardResources.wood;
    let gainedStone = mission.rewardResources.stone;
    let gainedIron = mission.rewardResources.iron;

    // Evaluate roll for random shards
    let shardRewardText = '';
    const shardRoll = Math.random() <= mission.rewardShardsChance;
    if (shardRoll) {
      // Pick random template to drop Shards
      const randTemplate = PET_TEMPLATES[Math.floor(Math.random() * PET_TEMPLATES.length)];
      onShardsChange({
        ...petShards,
        [randTemplate.id]: (petShards[randTemplate.id] || 0) + mission.rewardShardsCount
      });
      shardRewardText = `, and dropped +${mission.rewardShardsCount} "${randTemplate.baseName}" Shards!`;
    }

    // Discard expedition flags on pets
    const nextPets = ownerPets.map(p => {
      if (p.expeditionId === missionId) {
        return {
          ...p,
          expeditionId: null,
          expeditionEndTime: null
        };
      }
      return p;
    });

    // Commit resources
    onPetsChange(nextPets);
    onFeedChange(petFeed + gainedFeed);
    onResourcesChange({
      ...resources,
      food: resources.food + gainedGold,
      wood: resources.wood + gainedWood,
      stone: resources.stone + gainedStone,
      iron: resources.iron + gainedIron
    });

    addLog(`🎁 MISSION RESOLVED! Returned from "${mission.name}": Acquired +${gainedFeed} Pet Feed, +${formatNum(gainedGold)} Food, +${formatNum(gainedWood)} Timber, +${formatNum(gainedStone)} Slate${shardRewardText}`, "success");
  };

  // --- MOCK VAULT SUPPLIER SHOP ---
  const handleBuyStoreItem = (itemType: 'feed' | 'shards', costValorRef: number, text: string) => {
    if (resources.valor < costValorRef) {
      addLog("❌ Insufficient Valor points to purchase this exchange block.", "warning");
      return;
    }

    onResourcesChange({
      ...resources,
      valor: resources.valor - costValorRef
    });

    if (itemType === 'feed') {
      onFeedChange(petFeed + 150);
      addLog(`✨ Purchased Sanctuary Bundle: Received +150 Pet Feed packets!`, "success");
    } else {
      // Random shards roll
      const t = PET_TEMPLATES[Math.floor(Math.random() * PET_TEMPLATES.length)];
      onShardsChange({
        ...petShards,
        [t.id]: (petShards[t.id] || 0) + 10
      });
      addLog(`✨ Purchased Shard Case: Received +10 Shards for "${t.baseName}"!`, "success");
    }
  };

  // Rarity color borders logic
  const getRarityBadgeColor = (rarity: PetRarity) => {
    switch(rarity) {
      case 'Mythic': return 'from-purple-600 to-red-600 text-purple-100 border-purple-500 shadow-purple-500/25';
      case 'Legendary': return 'from-amber-600 to-yellow-500 text-amber-50 border-amber-500 shadow-amber-500/10';
      case 'Epic': return 'from-teal-600 to-indigo-600 text-teal-50 border-teal-500';
      case 'Rare': return 'from-blue-600 to-cyan-500 text-blue-5 border-blue-500';
      default: return 'from-zinc-700 to-zinc-900 border-zinc-600 text-zinc-300';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#050608] text-[#f5f5f5] overflow-y-auto" id="pet-sanctuary">
      
      {/* 1. Header Board summary */}
      <div className="bg-gradient-to-b from-[#10131a] to-[#040608] border-b border-zinc-900/60 p-4 select-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-gradient-to-tr from-amber-900/50 via-zinc-950 to-amber-900/10 border border-amber-500/35 relative">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            </div>
            <div>
              <h1 className="text-base font-serif font-black tracking-widest text-amber-400 uppercase">
                Pet Sanctuary & Aviary
              </h1>
              <p className="text-[10px] font-mono text-zinc-500 leading-tight">
                Align celestial hatchlings to field companion passives, boost economic yield, and command automated wilderness campaigns.
              </p>
            </div>
          </div>

          {/* Quick interactive parameters */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Feed indicators */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950/90 border border-zinc-800 rounded">
              <Utensils className="w-3.5 h-3.5 text-amber-400" />
              <div>
                <div className="text-[8px] font-mono text-zinc-500 leading-none">PET FEED</div>
                <div className="text-xs font-mono font-black text-amber-300 leading-tight">{petFeed} pack</div>
              </div>
            </div>

            {/* Total passive power contribution */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0f2d3a]/15 border border-[#153e50]/40 rounded">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <div>
                <div className="text-[8px] font-mono text-zinc-500 leading-none">SANCTUM POWER</div>
                <div className="text-xs font-mono font-black text-cyan-400 leading-tight">+{formatNum(totalPetPowerSum)}</div>
              </div>
            </div>

            {/* Hatchery egg summon trigger */}
            <button
              onClick={handleHatchEgg}
              disabled={hatchLoading || resources.valor < 150}
              className={`flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-900/40 via-emerald-950/20 to-emerald-900/40 border ${
                resources.valor >= 150 ? 'border-emerald-500/40 hover:border-emerald-400 text-emerald-400 hover:text-white cursor-pointer hover:bg-emerald-500/15' : 'border-emerald-500/10 text-zinc-600 cursor-not-allowed'
              } rounded text-2xs font-mono font-black uppercase transition-all select-none`}
            >
              🥚 {hatchLoading ? 'HATCHING...' : `Hatch Egg (150 Valor)`}
            </button>

            {/* Vault supplier exchange open button */}
            <button
              onClick={() => setRewardsStoreOpen(!rewardsStoreOpen)}
              className="px-2.5 py-1.5 bg-zinc-900/95 hover:bg-zinc-850 border border-zinc-800 text-zinc-400 hover:text-white rounded text-2xs font-mono font-black transition-all cursor-pointer"
            >
              🏪 REWARDS STORE
            </button>
          </div>
        </div>

        {/* VAULT SHOP DRAWER */}
        <AnimatePresence>
          {rewardsStoreOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 overflow-hidden bg-[#0d0f14] border border-amber-500/20 rounded p-3 text-zinc-300"
            >
              <div className="flex items-center justify-between border-b border-zinc-800/60 pb-1.5 mb-2.5">
                <span className="text-[10px] font-serif font-bold text-amber-500 tracking-wider">🏪 Blackmarket Feed & Gene Supplier</span>
                <span className="text-[9px] font-mono text-zinc-500">VALOR CODES EXCHANGE</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-zinc-950/70 border border-zinc-900 rounded p-2 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-[11px] font-mono font-bold text-[#fafafa] flex items-center gap-1">🍗 Royal Feed Pack [M]</h4>
                    <p className="text-[9px] font-mono text-zinc-500">Acquire +150 nutritional feeds for training levels.</p>
                  </div>
                  <button
                    onClick={() => handleBuyStoreItem('feed', 400, 'Feed Pack')}
                    className="flex flex-col items-center justify-center px-4 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-400 rounded text-amber-400 hover:text-white transition-all cursor-pointer font-mono font-black text-2xs uppercase"
                  >
                    <span>BUY FOR</span>
                    <span>400 Valor</span>
                  </button>
                </div>

                <div className="bg-zinc-950/70 border border-zinc-900 rounded p-2 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="text-[11px] font-mono font-bold text-[#fafafa] flex items-center gap-1">🎒 Mystical Shards Box [S]</h4>
                    <p className="text-[9px] font-mono text-zinc-500">Unlocks +10 random shards of gathered species instantly.</p>
                  </div>
                  <button
                    onClick={() => handleBuyStoreItem('shards', 600, 'Shards Box')}
                    className="flex flex-col items-center justify-center px-4 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-400 rounded text-amber-400 hover:text-white transition-all cursor-pointer font-mono font-black text-2xs uppercase"
                  >
                    <span>BUY FOR</span>
                    <span>600 Valor</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* HATCH POPUP OVERLAY */}
        <AnimatePresence>
          {hatchedPet && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mt-3 bg-zinc-950/95 border border-emerald-500/40 rounded p-3 flex flex-col items-center justify-center bg-gradient-to-r from-zinc-950 via-emerald-950/15 to-zinc-950"
            >
              <div className="absolute top-2 right-2 text-zinc-500 hover:text-zinc-300 text-xs cursor-pointer font-extrabold" onClick={() => setHatchedPet(null)}>✕</div>
              <div className="text-3xl mb-1.5 animate-bounce">🥚✨ {hatchedPet.id === 'duplicate_conversion' ? '💎' : PET_TEMPLATES.find(t => t.id === hatchedPet.baseId)?.emoji}</div>
              <h3 className="text-xs font-serif font-black tracking-widest text-emerald-400 uppercase leading-none mb-1 text-center">
                {hatchedPet.id === 'duplicate_conversion' ? 'SHARDS CONVERTED' : 'NEW COMPANION AWAKENED!'}
              </h3>
              <p className="text-[10px] font-mono text-center text-zinc-300">
                {hatchedPet.id === 'duplicate_conversion' 
                  ? `You already foster this species! Obtained +35 Shards of "${hatchedPet.name}" for master star leveling!`
                  : `Hatched a brand new pristine ${hatchedPet.rarity} pet: "${hatchedPet.name}"!`
                }
              </p>
              <button
                onClick={() => setHatchedPet(null)}
                className="mt-2.5 px-6 py-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded text-[9px] font-mono font-black tracking-wider cursor-pointer hover:bg-emerald-500/30 transition-all uppercase"
              >
                Let It Feed
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. core dashboard split layout */}
      <div className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 shrink-0">
        
        {/* LEFT COLUMN: THE BESTIARY SANCTUM - lg:span-5 */}
        <div className="lg:col-span-5 flex flex-col gap-3 min-h-[400px]">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-1">
            <h2 className="text-2xs font-mono font-bold tracking-widest text-zinc-500 uppercase flex items-center gap-1">
              🧬 Sanctum Bestiary ({ownerPets.length})
            </h2>
            <span className="text-[9px] font-mono text-zinc-600">IDLE COHORT</span>
          </div>

          {ownerPets.length === 0 ? (
            <div className="h-44 flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded bg-zinc-950/40 p-4">
              <span className="text-2xl mb-1 text-zinc-700">🥚</span>
              <p className="text-[10px] font-mono text-zinc-500 text-center">
                No pets reside in your sanctuary! Summon a hatchling using 150 Valor points above.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-1">
              {ownerPets.map((pet) => {
                const t = PET_TEMPLATES.find(tp => tp.id === pet.baseId);
                if (!t) return null;

                const isSelected = pet.id === selectedPetId;
                const petPower = calculatePetPower(pet, t);
                const isDeployed = !!pet.expeditionId;

                return (
                  <button
                    key={pet.id}
                    onClick={() => setSelectedPetId(pet.id)}
                    className={`text-left w-full rounded p-2.5 border transition-all cursor-pointer flex items-center justify-between relative overflow-hidden ${
                      isSelected 
                        ? 'bg-gradient-to-r from-amber-500/10 to-zinc-950 border-amber-500/50 shadow-md shadow-amber-500/5' 
                        : 'bg-zinc-950/60 border-zinc-900 hover:border-zinc-800 hover:bg-zinc-950/90'
                    }`}
                  >
                    {/* Visual left colored glow */}
                    <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${getRarityBadgeColor(pet.rarity)}`} />

                    <div className="flex items-center gap-2.5 pl-1.5">
                      <span className="text-xl">{t.emoji}</span>
                      <div>
                        <div className="flex items-center gap-1.5 leading-none mb-0.5">
                          <span className="text-[11px] font-mono font-bold text-zinc-100">{pet.name}</span>
                          <span className={`text-[8px] font-mono font-semibold uppercase px-1 border rounded leading-none ${getRarityBadgeColor(pet.rarity)}`}>
                            {pet.rarity}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-[9px] font-mono text-zinc-500">
                          <span>Level {pet.level}</span>
                          <span>•</span>
                          <span className="text-amber-500 leading-none">{'★'.repeat(pet.stars)}{'☆'.repeat(5 - pet.stars)}</span>
                        </div>

                        {/* Equp/Expedition Flags */}
                        <div className="flex items-center gap-1.5 mt-1">
                          {pet.equippedHeroId ? (
                            <span className="text-[8px] font-mono px-1 py-0.5 bg-cyan-950/40 border border-cyan-500/20 text-cyan-400 rounded">
                              🛡️ Attached to: {heroes.find(h => (h.id || h.name) === pet.equippedHeroId)?.name || 'Hero'}
                            </span>
                          ) : (
                            <span className="text-[8px] font-mono px-1 py-0.5 bg-zinc-900 text-zinc-500 rounded">
                              💤 Sitting Idle
                            </span>
                          )}

                          {isDeployed && (
                            <span className="text-[8px] font-mono px-1 py-0.5 bg-red-950/40 border border-red-500/25 text-red-400 rounded flex items-center gap-1 animate-pulse">
                              <Timer className="w-2 h-2 text-red-400" />
                              Expedition Deployed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[8px] font-mono text-zinc-500">POWER</div>
                      <div className="text-xs font-mono font-black text-cyan-400">{formatNum(petPower)}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: TRAINING GROUNDS (SELECTED PET DETAIL) - lg:span-7 */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-zinc-900 pb-1">
            <h2 className="text-2xs font-mono font-bold tracking-widest text-[#fafafa] uppercase flex items-center gap-1">
              ⚔️ companion training quarters
            </h2>
            <span className="text-[9px] font-mono text-zinc-600">STATIONS OVERVIEW</span>
          </div>

          {!selectedPet || !selectedTemplate ? (
            <div className="h-64 flex flex-col items-center justify-center border border-dashed border-zinc-800 rounded bg-zinc-950/30 p-8 text-center text-zinc-500">
              <span className="text-2xl mb-1">🏺</span>
              <p className="text-xs font-mono">Select a celestial pet companion from the bestiary to initialize training rituals.</p>
            </div>
          ) : (
            <div className="bg-zinc-950/80 border border-zinc-900 rounded p-4 relative overflow-hidden bg-gradient-to-b from-[#0e1015]/80 to-zinc-950">
              
              {/* Pet Showcase portrait header */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 border-b border-zinc-800/60 pb-4 mb-4 select-none">
                <div className="flex items-center gap-3">
                  <div className="text-4xl p-3 rounded bg-zinc-900 border border-zinc-800 shadow-inner flex items-center justify-center">
                    {selectedTemplate.emoji}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-serif font-black tracking-widest text-zinc-100">{selectedPet.name}</h3>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 border rounded leading-none ${getRarityBadgeColor(selectedPet.rarity)}`}>
                        {selectedPet.rarity}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-zinc-500 max-w-sm leading-tight italic">
                      "{selectedTemplate.description}"
                    </p>
                  </div>
                </div>

                <div className="text-center sm:text-right bg-zinc-950 border border-zinc-900 px-3 py-1 rounded">
                  <div className="text-[8px] font-mono text-zinc-500">DUE POWER RATING</div>
                  <div className="text-base font-mono font-black text-[#f5f5f5]">{formatNum(calculatePetPower(selectedPet, selectedTemplate))}</div>
                  <div className="text-[8px] font-mono text-amber-500">
                    {'★'.repeat(selectedPet.stars)}{'☆'.repeat(5 - selectedPet.stars)}
                  </div>
                </div>
              </div>

              {/* STATS & ABILITIES GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 select-none">
                
                {/* Level Up & Attributes */}
                <div className="bg-zinc-950 border border-zinc-900 rounded p-3">
                  <span className="text-[9px] font-mono text-zinc-500 font-bold tracking-wider block border-b border-zinc-900 pb-1 mb-2">ABSOLUTE INFLUENCE VALUES</span>
                  
                  <div className="grid grid-cols-2 gap-2 text-center text-xs font-mono">
                    <div className="bg-zinc-900/50 p-2 rounded border border-zinc-900">
                      <div className="text-[8px] text-zinc-500 leading-none">LEVEL CAP</div>
                      <div className="font-extrabold text-[#fafafa] mt-0.5">
                        {selectedPet.level} / {selectedPet.evolution === 0 ? 25 : selectedPet.evolution === 1 ? 50 : 100}
                      </div>
                    </div>
                    <div className="bg-zinc-900/50 p-2 rounded border border-zinc-900">
                      <div className="text-[8px] text-zinc-500 leading-none">EVOLUTION TIER</div>
                      <div className="font-extrabold text-amber-500 mt-0.5">
                        {selectedPet.evolution === 0 ? 'Hatchling' : selectedPet.evolution === 1 ? 'Awakened' : 'Mythological Master'}
                      </div>
                    </div>
                  </div>

                  {/* Equipped commander widget */}
                  <div className="mt-3">
                    <div className="text-[8px] font-mono text-zinc-500 lowercase pr-1 mb-1 tracking-widest uppercase font-bold">BIND COMPANION COMMANDER</div>
                    <select
                      value={selectedPet.equippedHeroId || ''}
                      onChange={(e) => handleAssignCompanion(selectedPet.id, e.target.value === '' ? null : e.target.value)}
                      className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[10px] text-zinc-100 font-mono focus:outline-none focus:border-amber-500 w-full cursor-pointer"
                    >
                      <option value="">-- Let loose on Sanctuary --</option>
                      {heroes.map(hero => (
                        <option key={hero.id || hero.name} value={hero.id || hero.name}>
                          ⚔️ Field with: {hero.name} (Level {hero.level})
                        </option>
                      ))}
                    </select>
                    <div className="text-[8px] font-mono text-zinc-500 mt-1 italic leading-tight">
                      * Fielded companion buffs apply in full combat metrics when that hero participates in battle stage wars! Idle pets of sanctuary yield base 30% background efficacy.
                    </div>
                  </div>
                </div>

                {/* Pet Abilities Display */}
                <div className="bg-zinc-950 border border-zinc-900 rounded p-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono text-zinc-500 font-bold tracking-wider block border-b border-zinc-900 pb-1 mb-2">PASSIVE & ACTIVE PERKS</span>
                    
                    {(() => {
                      const stats = compilePetAbilityStats(selectedPet, selectedTemplate);
                      return (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-start gap-2 bg-emerald-950/15 border border-emerald-500/20 p-2 rounded">
                            <Flame className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5 animate-pulse" />
                            <div>
                              <div className="text-[9px] font-mono font-black text-emerald-400 uppercase leading-none mb-0.5">PRIMARY ABILITY</div>
                              <p className="text-[10px] font-mono text-zinc-350 leading-tight">
                                {stats.primaryText}
                              </p>
                            </div>
                          </div>

                          <div className={`flex items-start gap-2 p-2 rounded border ${
                            selectedPet.stars >= selectedTemplate.secondaryAbility.unlockedAtStars
                              ? 'bg-blue-950/15 border-blue-500/25'
                              : 'bg-zinc-900/60 border-zinc-800'
                          }`}>
                            {selectedPet.stars >= selectedTemplate.secondaryAbility.unlockedAtStars ? (
                              <Award className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5 animate-spin" style={{ animationDuration: '6s' }} />
                            ) : (
                              <Lock className="w-3.5 h-3.5 text-zinc-600 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <div className={`text-[9px] font-mono font-black uppercase leading-none mb-0.5 ${
                                selectedPet.stars >= selectedTemplate.secondaryAbility.unlockedAtStars ? 'text-blue-400' : 'text-zinc-500'
                              }`}>
                                SECONDARY ABILITY
                              </div>
                              <p className="text-[10px] font-mono text-zinc-350 leading-tight">
                                {stats.secondaryText}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                  
                  <span className="text-[8px] font-mono text-zinc-600 text-right italic block mt-2">
                    Abilities scale dynamically with Training Level and Star rankings!
                  </span>
                </div>
              </div>

              {/* RITUAL ACTIONS (LEVEL / STAR / EVOLUTION) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 select-none">
                
                {/* 1. Level Up Button */}
                {(() => {
                  const maxLvl = selectedPet.evolution === 0 ? 25 : selectedPet.evolution === 1 ? 50 : 100;
                  const isCapped = selectedPet.level >= maxLvl;
                  const { feedCost, foodCost } = getPetUpgradeCost(selectedPet);
                  const canAfford = petFeed >= feedCost && resources.food >= foodCost;

                  return (
                    <div className="bg-zinc-950 border border-zinc-900 rounded p-2 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] font-mono text-zinc-500 font-bold block mb-1">CORE TRAINING</span>
                        <div className="text-[10px] font-mono text-zinc-400 mb-1.5 leading-tight">
                          Feed core proteins to raise training stats. Caps at {maxLvl}.
                        </div>
                        
                        {!isCapped && (
                          <div className="bg-zinc-900 px-1.5 py-1 rounded border border-zinc-900 text-[9px] font-mono text-zinc-400 mb-2 leading-none">
                            <div className="flex justify-between mb-1">
                              <span>Feed:</span>
                              <span className={petFeed >= feedCost ? 'text-[#fafafa]' : 'text-red-500'}>{feedCost} / {petFeed}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Food:</span>
                              <span className={resources.food >= foodCost ? 'text-[#fafafa]' : 'text-red-500'}>{formatNum(foodCost)} / {formatNum(resources.food)}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleLevelUp(selectedPet.id)}
                        disabled={isCapped || !canAfford}
                        className={`w-full py-1.5 rounded text-[10px] font-mono font-black uppercase text-center cursor-pointer select-none transition-all ${
                          isCapped 
                            ? 'bg-zinc-900 text-zinc-600 border border-zinc-800' 
                            : canAfford
                              ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 hover:text-white border border-amber-500/30'
                              : 'bg-zinc-950 text-zinc-500 border border-zinc-900 cursor-not-allowed'
                        }`}
                      >
                        {isCapped ? '⛔ LEVEL CAPPED' : '🍖 train level'}
                      </button>
                    </div>
                  );
                })()}

                {/* 2. Star Up Button */}
                {(() => {
                  const isCapped = selectedPet.stars >= 5;
                  const { neededShards, valorCost } = getPetStarCost(selectedPet);
                  const currentInventoryShards = petShards[selectedPet.baseId] || 0;
                  const canAfford = currentInventoryShards >= neededShards && resources.valor >= valorCost;

                  return (
                    <div className="bg-zinc-950 border border-zinc-900 rounded p-2 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] font-mono text-zinc-500 font-bold block mb-1">CONSTELLATION STAR</span>
                        <div className="text-[10px] font-mono text-zinc-400 mb-1.5 leading-tight">
                          Catalyze specific animal genes to alignment multipliers.
                        </div>

                        {!isCapped && (
                          <div className="bg-zinc-900 px-1.5 py-1 rounded border border-zinc-900 text-[9px] font-mono text-zinc-400 mb-2 leading-none">
                            <div className="flex justify-between mb-1">
                              <span>Shards:</span>
                              <span className={currentInventoryShards >= neededShards ? 'text-[#fafafa]' : 'text-red-500'}>
                                {neededShards} / {currentInventoryShards}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Valor:</span>
                              <span className={resources.valor >= valorCost ? 'text-[#fafafa]' : 'text-red-500'}>
                                {valorCost} / {resources.valor}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleStarUpgrade(selectedPet.id)}
                        disabled={isCapped || !canAfford}
                        className={`w-full py-1.5 rounded text-[10px] font-mono font-black uppercase text-center cursor-pointer select-none transition-all ${
                          isCapped 
                            ? 'bg-zinc-900 text-zinc-600 border border-zinc-800'
                            : canAfford
                              ? 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 hover:text-white border border-cyan-500/30'
                              : 'bg-zinc-950 text-zinc-500 border border-zinc-900 cursor-not-allowed'
                        }`}
                      >
                        {isCapped ? '⭐ RANK MAXED' : '⭐ Ascend Star'}
                      </button>
                    </div>
                  );
                })()}

                {/* 3. Evolution Button */}
                {(() => {
                  const req = getPetEvolutionRequirement(selectedPet);
                  const isCapped = !req;
                  const canAfford = req && selectedPet.level >= req.requiredLevel && selectedPet.stars >= req.requiredStars && resources.valor >= req.valorCost && resources.iron >= req.ironCost;

                  return (
                    <div className="bg-zinc-950 border border-[#b249f8]/10 rounded p-2 flex flex-col justify-between">
                      <div>
                        <span className="text-[9px] font-mono text-[#b249f8] font-bold block mb-1">METAMORPHOSE EVOLVE</span>
                        <div className="text-[10px] font-mono text-zinc-400 mb-1.5 leading-tight">
                          {isCapped ? 'Companion reached the maximum astronomical sovereign form.' : req.desc}
                        </div>

                        {req && (
                          <div className="bg-zinc-900/45 px-1.5 py-1 rounded border border-[#b249f8]/15 text-[9px] font-mono text-zinc-400 mb-2 leading-none">
                            <div className="flex justify-between mb-1">
                              <span>Level:</span>
                              <span className={selectedPet.level >= req.requiredLevel ? 'text-emerald-400' : 'text-red-500'}>
                                {req.requiredLevel} ({selectedPet.level})
                              </span>
                            </div>
                            <div className="flex justify-between mb-1">
                              <span>Stars:</span>
                              <span className={selectedPet.stars >= req.requiredStars ? 'text-emerald-400' : 'text-red-500'}>
                                {req.requiredStars} ({selectedPet.stars})
                              </span>
                            </div>
                            <div className="flex justify-between mb-1">
                              <span>Iron:</span>
                              <span className={resources.iron >= req.ironCost ? 'text-[#fafafa]' : 'text-red-500'}>
                                {formatNum(req.ironCost)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Valor:</span>
                              <span className={resources.valor >= req.valorCost ? 'text-[#fafafa]' : 'text-red-500'}>
                                {req.valorCost}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleEvolve(selectedPet.id)}
                        disabled={isCapped || !canAfford}
                        className={`w-full py-1.5 rounded text-[10px] font-mono font-black uppercase text-center cursor-pointer select-none transition-all ${
                          isCapped 
                            ? 'bg-zinc-900 text-zinc-600 border border-zinc-800'
                            : canAfford
                              ? 'bg-gradient-to-r from-purple-900/30 via-purple-950 to-purple-900/30 text-purple-400 border border-purple-500/40 hover:border-purple-300 hover:text-white'
                              : 'bg-zinc-950 text-zinc-500 border border-zinc-900 cursor-not-allowed'
                        }`}
                      >
                        {isCapped ? '🎭 SUPREME ARCH-FORM' : '🧬 METAMORPHOSE'}
                      </button>
                    </div>
                  );
                })()}

              </div>

            </div>
          )}
        </div>

      </div>

      {/* 3. BOTTOM PANEL: EXPEDITIONS TAB GRID */}
      <div className="p-4 pt-0 shrink-0">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-1 mb-3">
          <h2 className="text-2xs font-mono font-bold tracking-widest text-amber-500 uppercase flex items-center gap-1">
            🗺️ Guild of Sovereign Aviary Expeditions
          </h2>
          <span className="text-[9px] font-mono text-zinc-500">REALTIME DISPATCH</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {EXPEDITIONS_DATABASE.map((mission) => {
            // Find which pets are deployed on this specific expedition
            const activeMissionPets = ownerPets.filter(p => p.expeditionId === mission.id);
            const isDeployed = activeMissionPets.length > 0;
            
            // Check timer
            const firstPetWithEndTime = activeMissionPets.find(p => p.expeditionEndTime);
            const endTime = firstPetWithEndTime?.expeditionEndTime || 0;
            const isFinished = endTime > 0 && currentTime >= endTime;
            
            const remainingMs = Math.max(0, endTime - currentTime);
            const remainingSec = Math.ceil(remainingMs / 1000);
            
            const min = Math.floor(remainingSec / 60);
            const sec = remainingSec % 60;
            const countdownStr = `${min}m ${sec}s`;

            // Setup select box for dispatching if IDLE
            // Filter pets that are NOT on any expedition
            const idlePets = ownerPets.filter(p => !p.expeditionId);
            
            // We'll manage local states for each dispatch checkbox inside of local memory
            return (
              <ExpeditionCard
                key={mission.id}
                mission={mission}
                idlePets={idlePets}
                activePets={activeMissionPets}
                isDeployed={isDeployed}
                isFinished={isFinished}
                countdownStr={countdownStr}
                onDeploy={(petIds) => handleDeployExpedition(mission.id, petIds)}
                onClaim={() => handleClaimExpedition(mission.id)}
              />
            );
          })}
        </div>
      </div>

    </div>
  );
}

// Sub-component to encapsulate local state of check-selected pets to dispatch
interface ExpeditionCardProps {
  key?: string | number;
  mission: PetExpedition;
  idlePets: UserPet[];
  activePets: UserPet[];
  isDeployed: boolean;
  isFinished: boolean;
  countdownStr: string;
  onDeploy: (ids: string[]) => void;
  onClaim: () => void;
}

function ExpeditionCard({
  mission,
  idlePets,
  activePets,
  isDeployed,
  isFinished,
  countdownStr,
  onDeploy,
  onClaim
}: ExpeditionCardProps) {
  
  const [selectedPetIds, setSelectedPetIds] = useState<string[]>([]);

  // Clear selections on deploy
  useEffect(() => {
    if (!isDeployed) {
      setSelectedPetIds([]);
    }
  }, [isDeployed]);

  // Combined power calculation
  const currentSelectedPets = idlePets.filter(p => selectedPetIds.includes(p.id));
  const combinedPowerSelected = currentSelectedPets.reduce((acc, p) => acc + calculatePetPower(p), 0);
  const percentFilled = Math.min(100, (combinedPowerSelected / mission.requiredPower) * 100);

  const toggleSelectPet = (id: string) => {
    setSelectedPetIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  return (
    <div className={`rounded p-3 border select-none transition-all flex flex-col justify-between h-72 ${
      isDeployed 
        ? isFinished
          ? 'bg-gradient-to-tr from-emerald-950/20 via-zinc-950 to-emerald-950/10 border-emerald-500/40 shadow shadow-emerald-500/10'
          : 'bg-gradient-to-tr from-[#121319] via-[#0b0c10] to-[#121319] border-cyan-500/15'
        : 'bg-[#0a0a0f] border-zinc-900 hover:border-zinc-800'
    }`}>
      <div>
        
        {/* Header Title */}
        <div className="flex items-start justify-between border-b border-zinc-900/60 pb-1.5 mb-2">
          <div>
            <div className="flex items-center gap-1 leading-none mb-0.5">
              <span className="text-sm">{mission.emoji}</span>
              <span className="text-2xs font-mono font-black text-[#fafafa] uppercase leading-none">{mission.name}</span>
            </div>
            <span className="text-[8px] font-mono text-zinc-500 tracking-wide">
              ⏱️ Duration: {mission.durationMinutes} minutes
            </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-amber-500">★{formatNum(mission.requiredPower)} Pwr</span>
        </div>

        {/* Mission Desc */}
        <p className="text-[9px] font-mono text-zinc-400 leading-tight mb-2.5">
          {mission.description}
        </p>

        {/* Loot Preview */}
        <div className="bg-zinc-950 rounded p-1.5 border border-zinc-900 mb-3 text-[9px] font-mono text-zinc-400">
          <div className="text-[8px] text-zinc-500 font-bold lowercase tracking-widest uppercase mb-1">EXPECTED PAYOUTS</div>
          <div className="grid grid-cols-2 gap-y-1 text-[8px] leading-none">
            <span>🍗 Feed: <span className="text-[#fafafa]">+{mission.rewardFeed}</span></span>
            {mission.rewardResources.food > 0 && <span>🌾 Food: <span className="text-[#fafafa]">+{formatNum(mission.rewardResources.food)}</span></span>}
            {mission.rewardResources.wood > 0 && <span>🪵 Wood: <span className="text-[#fafafa]">+{formatNum(mission.rewardResources.wood)}</span></span>}
            {mission.rewardResources.stone > 0 && <span>🪨 Stone: <span className="text-[#fafafa]">+{formatNum(mission.rewardResources.stone)}</span></span>}
            {mission.rewardResources.iron > 0 && <span>🛡️ Iron: <span className="text-[#fafafa]">+{formatNum(mission.rewardResources.iron)}</span></span>}
            <span>🧬 Shard Roll: <span className="text-cyan-400">{(mission.rewardShardsChance * 100).toFixed(0)}%</span></span>
          </div>
        </div>
      </div>

      {/* FOOTER ACTIONS AREA */}
      <div>
        {isDeployed ? (
          /* Active Deployed State */
          <div className="text-center font-mono select-none">
            {isFinished ? (
              <div className="flex flex-col gap-1.5">
                <div className="text-[10px] font-black text-emerald-400 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                  EXPEDITION RESOLVED
                </div>
                <button
                  onClick={onClaim}
                  className="w-full py-1.5 bg-emerald-500/20 hover:bg-emerald-500/35 border border-emerald-500 text-emerald-100 rounded text-xs font-black uppercase cursor-pointer select-none transition-all flex items-center justify-center gap-1"
                >
                  <Gift className="w-4 h-4 text-emerald-300" />
                  CLAIM VALOR LOOT
                </button>
              </div>
            ) : (
              <div className="bg-zinc-950 p-2.5 rounded border border-zinc-900 flex flex-col items-center justify-center">
                <Timer className="w-4 h-4 text-cyan-400 animate-spin mb-1" style={{ animationDuration: '4s' }} />
                <div className="text-[8px] text-zinc-500 tracking-wide uppercase">PETS MARCHING IN EXCURSION</div>
                <div className="text-xs text-[#fafafa] font-bold mt-0.5">{countdownStr} remaining</div>
                <div className="text-[7px] text-zinc-600 mt-1 italic leading-none">
                  Deployed: {activePets.map(p => p.name).join(', ')}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* IDLE DISPATCH STATE */
          <div className="flex flex-col gap-2 font-mono">
            
            {/* Deploy checklists toggle drawer */}
            {idlePets.length === 0 ? (
              <div className="text-center text-[8px] text-zinc-600 italic py-2 leading-tight">
                No idle pets reside in bestiary tracks! Evolve or hatch them.
              </div>
            ) : (
              <div>
                <div className="text-[8px] text-zinc-500 font-bold select-none mb-1 lowercase tracking-widest uppercase">DISPATCH COMPANIONS</div>
                <div className="flex flex-wrap gap-1 max-h-12 overflow-y-auto pr-1">
                  {idlePets.map(p => {
                    const isChecked = selectedPetIds.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        onClick={() => toggleSelectPet(p.id)}
                        className={`px-1.5 py-0.5 rounded border text-[8px] flex items-center gap-1 cursor-pointer transition-all ${
                          isChecked 
                            ? 'bg-amber-500/10 border-amber-500/40 text-[#fafafa]' 
                            : 'bg-zinc-900 border-zinc-900 text-zinc-400 hover:border-zinc-800'
                        }`}
                      >
                        {PET_TEMPLATES.find(tp => tp.id === p.baseId)?.emoji} {p.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Combined Power status */}
            <div className="mt-1">
              <div className="flex justify-between items-center text-[7.5px] text-zinc-500 mb-0.5">
                <span>COMBINED MARGIN POWER:</span>
                <span className={combinedPowerSelected >= mission.requiredPower ? 'text-emerald-400 font-black' : 'text-amber-500 font-semibold'}>
                  {combinedPowerSelected} / {mission.requiredPower}
                </span>
              </div>
              <div className="w-full bg-zinc-950 rounded-full h-1 relative overflow-hidden border border-zinc-900">
                <div 
                  className={`h-full rounded-full transition-all duration-350 ${
                    combinedPowerSelected >= mission.requiredPower ? 'bg-emerald-500' : 'bg-amber-500'
                  }`} 
                  style={{ width: `${percentFilled}%` }} 
                />
              </div>
            </div>

            <button
              onClick={() => onDeploy(selectedPetIds)}
              disabled={selectedPetIds.length === 0 || combinedPowerSelected < mission.requiredPower}
              className={`w-full py-1 rounded text-2xs font-extrabold uppercase text-center transition-all cursor-pointer ${
                selectedPetIds.length > 0 && combinedPowerSelected >= mission.requiredPower
                  ? 'bg-amber-500 text-zinc-950 font-black hover:bg-amber-400'
                  : 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-900'
              }`}
            >
              🚀 Launch March dispatch
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
