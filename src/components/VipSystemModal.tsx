import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Crown, 
  Gift, 
  Sparkles, 
  Shield, 
  Zap, 
  ChevronRight, 
  Plus, 
  Check, 
  Lock, 
  Clock, 
  Heart,
  TrendingUp,
  Coins,
  Package,
  Award
} from 'lucide-react';
import { Resources } from '../types';
import { 
  VIP_LEVELS_CONFIG, 
  UserVipState, 
  calculateVipLevel, 
  getXpProgress, 
  XP_PURCHASE_CONVERSION,
  VipLevelConfig
} from '../utils/vipSystem';
import { formatNum } from '../gameData';

interface VipSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  // State hook props to update resources/VIP state in main app
  resources: Resources;
  onResourcesChange: (next: Resources | ((p: Resources) => Resources)) => void;
  vipState: UserVipState;
  onVipStateChange: (next: UserVipState | ((p: UserVipState) => UserVipState)) => void;
  addLog: (text: string, type: 'info' | 'success' | 'warning' | 'combat') => void;
}

export default function VipSystemModal({
  isOpen,
  onClose,
  resources,
  onResourcesChange,
  vipState,
  onVipStateChange,
  addLog
}: VipSystemModalProps) {
  
  // Navigation: which VIP level config are we viewing? Defaults to current player's level (or capped to max config level)
  const currentLevelConfig = calculateVipLevel(vipState.xp);
  const [viewLevel, setViewLevel] = useState<number>(currentLevelConfig.level);

  // Sync viewed level when current level increases
  useEffect(() => {
    setViewLevel(currentLevelConfig.level);
  }, [currentLevelConfig.level]);

  // Selected level configuration
  const selectedConfig = VIP_LEVELS_CONFIG.find(c => c.level === viewLevel) || VIP_LEVELS_CONFIG[0];
  const xpProgress = getXpProgress(vipState.xp);

  // Helper to check if daily chest is available
  const isDailyAvailable = () => {
    if (!vipState.lastDailyClaimTimestamp) return true;
    const now = Date.now();
    const lastClaim = new Date(vipState.lastDailyClaimTimestamp);
    const today = new Date(now);
    
    // Check if it's a new calendar day
    return (
      lastClaim.getDate() !== today.getDate() ||
      lastClaim.getMonth() !== today.getMonth() ||
      lastClaim.getFullYear() !== today.getFullYear()
    );
  };

  // Claim Daily VIP Chest
  const handleClaimDailyChest = () => {
    if (!isDailyAvailable()) {
      addLog("Daily chest already claimed today! Check back tomorrow.", "warning");
      return;
    }

    const currentVipConfig = calculateVipLevel(vipState.xp);
    const rewards = currentVipConfig.dailyChest;

    // Award rewards
    onResourcesChange(prev => {
      const next = { ...prev };
      if (rewards.food) next.food += rewards.food;
      if (rewards.wood) next.wood += rewards.wood;
      if (rewards.stone) next.stone += rewards.stone;
      if (rewards.iron) next.iron += rewards.iron;
      if (rewards.valor) next.valor += rewards.valor;
      return next;
    });

    onVipStateChange(prev => ({
      ...prev,
      lastDailyClaimTimestamp: Date.now()
    }));

    // Formulate descriptive log
    const rewardsList = Object.entries(rewards)
      .map(([key, val]) => `+${formatNum(val as number)} ${key.toUpperCase()}`)
      .join(', ');

    addLog(`🎁 Claimed Daily VIP Chest (VIP Level ${currentVipConfig.level}): ${rewardsList}!`, 'success');
  };

  // Claim Level Up One-Time Rewards
  const handleClaimLevelReward = (lvl: number) => {
    if (vipState.claimedLevelRewards.includes(lvl)) {
      addLog(`Level ${lvl} reward chest already claimed!`, 'warning');
      return;
    }

    if (lvl > currentLevelConfig.level) {
      addLog(`You must reach VIP Level ${lvl} to claim this chest!`, 'warning');
      return;
    }

    const config = VIP_LEVELS_CONFIG.find(c => c.level === lvl);
    if (!config) return;

    const rewards = config.oneTimeReward;

    // Award resources
    onResourcesChange(prev => {
      const next = { ...prev };
      if (rewards.food) next.food += rewards.food;
      if (rewards.wood) next.wood += rewards.wood;
      if (rewards.stone) next.stone += rewards.stone;
      if (rewards.iron) next.iron += rewards.iron;
      if (rewards.valor) next.valor += rewards.valor;
      return next;
    });

    onVipStateChange(prev => ({
      ...prev,
      claimedLevelRewards: [...prev.claimedLevelRewards, lvl]
    }));

    const rewardsList = Object.entries(rewards)
      .map(([key, val]) => `+${formatNum(val as number)} ${key.toUpperCase()}`)
      .join(', ');

    addLog(`👑 Claimed VIP Level ${lvl} Coronation Chest: ${rewardsList}!`, 'success');
  };

  // Purchase VIP XP
  const handlePurchaseXp = (xpAmount: number, valorCost: number) => {
    if (resources.valor < valorCost) {
      addLog(`Insufficient Valor to buy ${xpAmount} VIP XP! Requires ${valorCost} Valor.`, 'warning');
      return;
    }

    // Deduct Valor
    onResourcesChange(prev => ({
      ...prev,
      valor: prev.valor - valorCost
    }));

    // Add XP and recalculate level
    onVipStateChange(prev => {
      const nextXp = prev.xp + xpAmount;
      const prevLevel = prev.level;
      const nextLevelConfig = calculateVipLevel(nextXp);
      
      if (nextLevelConfig.level > prevLevel) {
        // Leveled up!
        setTimeout(() => {
          addLog(`✨ SOVEREIGN ASCENSION! Your VIP tier has increased to Level ${nextLevelConfig.level}! New benefits unlocked!`, 'success');
        }, 300);
      }

      return {
        ...prev,
        xp: nextXp,
        level: nextLevelConfig.level
      };
    });

    addLog(`⚡ Purchased +${xpAmount} VIP XP for ${valorCost} Valor!`, 'success');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-lg bg-[#0e1117] border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[90vh] max-h-[760px]"
      >
        {/* Modal Header */}
        <div className="bg-[#0b0c10] px-5 py-4 border-b border-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <Crown className="w-5 h-5 text-yellow-500 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-serif font-black tracking-widest text-zinc-100 uppercase">
                Sovereign Palace VIP
              </h2>
              <p className="text-[10px] font-mono text-zinc-400">
                Enhance your Kingdom with celestial permanent buffs & daily tribute chests
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded hover:bg-zinc-900 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Core Area (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          
          {/* Current VIP level, progress, daily tribute summary card */}
          <div className="bg-gradient-to-br from-[#1b170e]/80 to-[#0e1117]/80 border border-amber-500/20 rounded-xl p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 pointer-events-none opacity-10">
              <Crown className="w-24 h-24 text-amber-500" />
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-[10px] font-mono text-amber-500/80 font-black tracking-widest uppercase">
                  Royal Prestige Tier
                </span>
                <h3 className="text-xl font-serif font-black text-zinc-100 flex items-center gap-1.5">
                  Sovereign VIP Level {currentLevelConfig.level}
                </h3>
              </div>
              <div className="px-2.5 py-1 bg-amber-500/15 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold rounded-full">
                Active Prestige
              </div>
            </div>

            {/* Custom Glowing XP Progress Bar */}
            <div className="space-y-1.5 mt-3">
              <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                <span>XP Progress</span>
                {xpProgress.isMaxLevel ? (
                  <span className="text-amber-400 font-bold">MAX LEVEL REACHED</span>
                ) : (
                  <span>{formatNum(vipState.xp)} / {formatNum(xpProgress.neededXp)} XP</span>
                )}
              </div>
              <div className="w-full bg-zinc-950 rounded-full h-3.5 border border-zinc-800 p-0.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-600 to-yellow-400 h-full rounded-full transition-all duration-500 relative"
                  style={{ width: `${xpProgress.percentage}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Daily VIP Tribute Chest Claim Section */}
          <div className="bg-[#11141e] border border-blue-500/10 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border border-blue-500/20 rounded-xl">
                <Gift className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h4 className="text-xs font-serif font-black text-zinc-100 uppercase tracking-wider">
                  Daily Sovereign Tribute Chest
                </h4>
                <p className="text-[10px] text-zinc-400 mt-0.5">
                  Claim daily supplies matching your active VIP Tier {currentLevelConfig.level}
                </p>
                <div className="flex gap-2 mt-1.5">
                  {Object.entries(currentLevelConfig.dailyChest).map(([key, val]) => (
                    <span key={key} className="text-[9px] font-mono bg-[#090b11] border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-350">
                      {key === 'valor' ? '⚡' : '📦'} {formatNum(val as number)} {key.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <button
              onClick={handleClaimDailyChest}
              disabled={!isDailyAvailable()}
              className={`px-4 py-2 text-[10px] font-mono font-black tracking-wider uppercase rounded-xl transition-all cursor-pointer ${
                isDailyAvailable()
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border border-blue-400 text-white hover:brightness-110 active:scale-95'
                  : 'bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed'
              }`}
            >
              {isDailyAvailable() ? 'CLAIM' : 'CLAIMED'}
            </button>
          </div>

          {/* VIP Level selector slider/dots */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-mono font-black tracking-wider text-zinc-400 uppercase">
              Prestige Tiers Database
            </h4>
            
            {/* Horizontal level select rail */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 no-scrollbar">
              {VIP_LEVELS_CONFIG.map((cfg) => {
                const isCurrent = cfg.level === currentLevelConfig.level;
                const isSelected = cfg.level === viewLevel;
                const isUnlocked = cfg.level <= currentLevelConfig.level;
                
                return (
                  <button
                    key={cfg.level}
                    onClick={() => setViewLevel(cfg.level)}
                    className={`flex-shrink-0 min-w-[50px] px-2 py-1.5 rounded-lg border font-mono text-[10px] font-black tracking-wider transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                        : isCurrent
                        ? 'bg-zinc-950 border-amber-500/50 text-amber-500/80'
                        : isUnlocked
                        ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                        : 'bg-zinc-950/40 border-zinc-900/60 text-zinc-600 cursor-pointer'
                    }`}
                  >
                    <span>Lvl {cfg.level}</span>
                    {isCurrent && <span className="text-[7px] text-amber-400 font-bold font-sans">ACTIVE</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed view of the selected VIP Level's benefits & coronation rewards */}
          <div className="bg-[#111319] border border-zinc-800 rounded-xl overflow-hidden">
            {/* Header tab showing selected level */}
            <div className="bg-[#141822] px-4 py-2.5 border-b border-zinc-800 flex justify-between items-center">
              <span className="text-[11px] font-serif font-black tracking-wider text-zinc-200">
                VIP LEVEL {selectedConfig.level} PERKS & REWARDS
              </span>
              <span className="text-[9px] font-mono text-zinc-400">
                {selectedConfig.level <= currentLevelConfig.level ? '🔓 Tier Unlocked' : '🔒 Tier Locked'}
              </span>
            </div>

            <div className="p-4 space-y-4">
              {/* Permanent Benefits List */}
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono font-black tracking-widest text-zinc-500 uppercase">
                  Permanent Sovereignty Modifiers
                </span>
                <div className="grid grid-cols-1 gap-2">
                  {selectedConfig.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-[#090b0e] border border-zinc-900 rounded-lg text-[10.5px] font-mono text-zinc-350">
                      <Zap className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coronation Level-Up Reward Chest */}
              <div className="border-t border-zinc-900/60 pt-4 space-y-2">
                <span className="text-[9px] font-mono font-black tracking-widest text-zinc-500 uppercase flex items-center justify-between">
                  <span>Coronation Reward Chest</span>
                  {vipState.claimedLevelRewards.includes(selectedConfig.level) && (
                    <span className="text-emerald-500 font-bold">✓ CLAIMED</span>
                  )}
                </span>
                
                <div className="flex items-center justify-between gap-4 bg-[#090b0e] border border-zinc-900 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                      <Award className="w-5 h-5 text-purple-400" />
                    </div>
                    <div>
                      <h5 className="text-[10px] font-serif font-black text-zinc-200 uppercase">
                        VIP Lvl {selectedConfig.level} Royal Package
                      </h5>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {Object.entries(selectedConfig.oneTimeReward).map(([key, val]) => (
                          <span key={key} className="text-[8px] font-mono bg-zinc-950 px-1.5 py-0.5 rounded text-zinc-400 border border-zinc-900">
                            {formatNum(val as number)} {key.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleClaimLevelReward(selectedConfig.level)}
                    disabled={
                      selectedConfig.level > currentLevelConfig.level ||
                      vipState.claimedLevelRewards.includes(selectedConfig.level)
                    }
                    className={`px-3 py-1.5 text-[9px] font-mono font-black rounded-lg transition-all cursor-pointer ${
                      vipState.claimedLevelRewards.includes(selectedConfig.level)
                        ? 'bg-[#090b0e] border border-zinc-800 text-zinc-600 cursor-not-allowed'
                        : selectedConfig.level <= currentLevelConfig.level
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 border border-purple-500 text-white hover:brightness-110 active:scale-95'
                        : 'bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    {vipState.claimedLevelRewards.includes(selectedConfig.level)
                      ? 'CLAIMED'
                      : selectedConfig.level <= currentLevelConfig.level
                      ? 'CLAIM'
                      : 'LOCKED'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* XP Purchase Store Section */}
          <div className="bg-[#111319] border border-zinc-800 rounded-xl overflow-hidden">
            <div className="bg-[#16131c] px-4 py-2.5 border-b border-zinc-800">
              <span className="text-[11px] font-serif font-black tracking-wider text-purple-300">
                🔥 SOVEREIGN PRESTIGE INJECTIONS
              </span>
            </div>
            
            <div className="p-4 space-y-3">
              <p className="text-[10px] text-zinc-400">
                Commit royal Valor points to accelerate VIP progression and immediately raise celestial buff multipliers:
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                {XP_PURCHASE_CONVERSION.costs.map((pkg, idx) => {
                  const canAfford = resources.valor >= pkg.valor;
                  
                  return (
                    <div 
                      key={idx}
                      className="bg-[#090b0e] border border-zinc-900 rounded-xl p-3 flex flex-col justify-between h-[95px] relative overflow-hidden group hover:border-purple-500/30 transition-all"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-black text-white">
                            +{formatNum(pkg.xp)} XP
                          </span>
                          <Sparkles className="w-3 h-3 text-purple-400" />
                        </div>
                        <span className="text-[8px] font-mono text-zinc-500 uppercase mt-0.5 block">
                          Prestige points
                        </span>
                      </div>

                      <button
                        onClick={() => handlePurchaseXp(pkg.xp, pkg.valor)}
                        className={`w-full mt-2 py-1 px-2 rounded-lg text-[9px] font-mono font-black tracking-wider flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          canAfford
                            ? 'bg-purple-900/30 border border-purple-500/40 text-purple-300 hover:bg-purple-500 hover:text-black active:scale-95'
                            : 'bg-zinc-950 border border-zinc-900 text-zinc-600 cursor-not-allowed'
                        }`}
                      >
                        ⚡ {formatNum(pkg.valor)} VALOR
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-[#0b0c10] px-5 py-3 border-t border-zinc-900 flex justify-between items-center text-[10px] font-mono text-zinc-400 shrink-0 select-none">
          <span>Current Account Valor: <strong className="text-yellow-400">{formatNum(resources.valor)}</strong></span>
          <span>Claim Coronation chest for instant bonuses</span>
        </div>
      </motion.div>
    </div>
  );
}
