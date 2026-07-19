import React, { useState, useEffect, useRef } from 'react';
import { Resources } from '../types';
import { X, Sword, Shield, Compass, BookOpen, Scroll, Award, Sparkles, Timer, CheckCircle, AlertTriangle } from 'lucide-react';
import { formatNum } from '../gameData';

// Import databases
import ancientBeasts from '../../data/ancient_beasts.json';
import ancientBeastLairs from '../../data/ancient_beast_lairs.json';
import ancientBeastRewards from '../../data/ancient_beast_rewards.json';
import ancientBeastLevels from '../../data/ancient_beast_levels.json';

interface AncientBeastLairModalProps {
  lairNode: {
    id: string;
    name: string;
    type: string;
    x: number;
    y: number;
    details: string;
    icon: string;
    beast_id?: string;
    level?: number;
  };
  onClose: () => void;
  onAddResources?: (gains: Partial<Resources>) => void;
  addLog?: (message: string, type?: 'info' | 'success' | 'warning' | 'combat') => void;
}

export default function AncientBeastLairModal({
  lairNode,
  onClose,
  onAddResources,
  addLog
}: AncientBeastLairModalProps) {
  // Lair base data setup
  const initialBeastId = lairNode.beast_id || 'dire_wolf_alpha';
  const initialLevel = lairNode.level || 5;

  // Selected state
  const [selectedLevel, setSelectedLevel] = useState<number>(initialLevel);
  const [activeWindow, setActiveWindow] = useState<'main' | 'scout' | 'rally' | 'rewards'>('main');

  // Attempts tracking
  const [attemptsRemaining, setAttemptsRemaining] = useState<number>(3);

  // Active rally status simulator
  const [isRallyActive, setIsRallyActive] = useState<boolean>(false);
  const [isJoinedRally, setIsJoinedRally] = useState<boolean>(false);
  const [rallyTimer, setRallyTimer] = useState<number>(300); // 5 minutes in seconds
  const [rallyMembers, setRallyMembers] = useState<Array<{ name: string; power: number; troops: number; isLeader: boolean }>>([
    { name: 'Lord_Gideon', power: 3400000, troops: 350000, isLeader: true },
    { name: 'Lady_Eldoria', power: 2100000, troops: 180000, isLeader: false },
    { name: 'Sir_Galahad', power: 1850000, troops: 150000, isLeader: false }
  ]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Claimed rewards chest state
  const [isChestOpen, setIsChestOpen] = useState<boolean>(false);
  const [claimedRewards, setClaimedRewards] = useState<Array<{ id: string; name: string; quantity: number; icon: string; quality: string; description?: string; category?: string }>>([]);

  // Fetch current beast and lair config from JSON databases
  const currentBeast = ancientBeasts.find(b => b.id === initialBeastId) || ancientBeasts[0];
  const lairConfig = ancientBeastLairs.find(l => l.landmark_icon === lairNode.icon || l.id.includes(initialBeastId.split('_')[0])) || ancientBeastLairs[0];
  const levelConfig = ancientBeastLevels.find(l => l.level === selectedLevel) || ancientBeastLevels[selectedLevel - 1] || ancientBeastLevels[0];

  // Dynamically calculated properties based on selected level
  const baseBeastPower = currentBeast.power_rating;
  // Scale power exponentially with level
  const scaledPower = Math.round(baseBeastPower * (1 + (selectedLevel - 1) * 0.22));
  const recommendedPower = levelConfig.recommended_power;
  const staminaCost = levelConfig.stamina_cost;
  const rewardMultiplier = levelConfig.reward_multiplier;

  // Handle rally timer ticker
  useEffect(() => {
    if (isRallyActive && rallyTimer > 0) {
      timerIntervalRef.current = setInterval(() => {
        setRallyTimer(prev => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current!);
            setIsRallyActive(false);
            // Auto trigger battle victory screen when timer completes
            triggerBattleCompletion();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isRallyActive]);

  // Actions
  const handleBookmark = () => {
    if (addLog) {
      addLog(`📍 Lair coords [X: ${lairNode.x}, Y: ${lairNode.y}] successfully saved to your Sovereign Codex bookmarks!`, 'success');
    }
  };

  const handleStartRally = () => {
    setIsRallyActive(true);
    setIsJoinedRally(true);
    setRallyTimer(300); // Reset to 5m
    if (addLog) {
      addLog(`🛡️ Rally initiated against Lv. ${selectedLevel} ${currentBeast.name}! Alliance members notified.`, 'info');
    }
    setActiveWindow('rally');
  };

  const handleJoinRallyToggle = () => {
    if (isJoinedRally) {
      setIsJoinedRally(false);
      setRallyMembers(prev => prev.filter(m => m.name !== 'You (Marching)'));
      if (addLog) addLog(`❌ You withdrew your legions from the alliance rally.`, 'warning');
    } else {
      setIsJoinedRally(true);
      setRallyMembers(prev => [
        ...prev,
        { name: 'You (Marching)', power: 2500000, troops: 200000, isLeader: false }
      ]);
      if (addLog) addLog(`⚔️ You joined the alliance rally with 200,000 elite troops!`, 'success');
    }
  };

  // Instant battle completion simulation for high-end playability
  const triggerBattleCompletion = () => {
    if (attemptsRemaining <= 0) return;
    
    setAttemptsRemaining(prev => prev - 1);
    
    // Pick 3 dynamic rewards based on selection and multiplier
    const selectedItems = [...ancientBeastRewards]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)
      .map(item => {
        const baseQty = item.category === 'currency' ? 20 : item.category === 'materials' ? 5 : 50;
        return {
          ...item,
          quantity: Math.round(baseQty * rewardMultiplier)
        };
      });

    setClaimedRewards(selectedItems);
    setActiveWindow('rewards');
    setIsChestOpen(false);

    if (addLog) {
      addLog(`🏆 VICTORY! Alliance rally shattered Lv. ${selectedLevel} ${currentBeast.name}! Claim your victory chest in the lair menu.`, 'success');
    }
  };

  const handleClaimRewards = () => {
    if (onAddResources) {
      // Grant resources & currency simulation
      const resourceGains: Partial<Resources> = {};
      claimedRewards.forEach(item => {
        if (item.id === 'gold_supply') {
          resourceGains.food = (resourceGains.food || 0) + (item.quantity * 10);
        } else if (item.id === 'diamonds') {
          resourceGains.valor = (resourceGains.valor || 0) + item.quantity;
        }
      });
      if (Object.keys(resourceGains).length > 0) {
        onAddResources(resourceGains);
      }
    }

    if (addLog) {
      addLog(`🎁 Claimed rewards from defeated Lv. ${selectedLevel} beast: ` + claimedRewards.map(i => `${i.name} x${i.quantity}`).join(', '), 'success');
    }
    
    // Reset state
    setIsRallyActive(false);
    setIsJoinedRally(false);
    setActiveWindow('main');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto font-sans select-none pointer-events-auto">
      
      {/* 
        =========================================================
        MAIN BEAST LAIR POPUP (White Marble + Sapphire & Gold UI)
        =========================================================
      */}
      {activeWindow === 'main' && (
        <div className="relative w-full max-w-lg bg-gradient-to-b from-[#f8fafc] via-[#ffffff] to-[#e2e8f0] border-4 border-[#b45309] rounded-[2rem] shadow-[0_20px_50px_rgba(168,85,247,0.35)] overflow-hidden flex flex-col">
          
          {/* Top Sapphire Crystal Accent Corner Banner */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-600 via-purple-600 to-sky-600 shadow-md" />
          
          {/* Header Title Bar with Gold Trims */}
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-slate-100 to-slate-200/50 border-b-2 border-amber-600/30">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏆</span>
              <div>
                <h3 className="font-serif font-black text-amber-950 tracking-wider text-sm uppercase">
                  Crownspire Landmark
                </h3>
                <p className="text-[10px] text-amber-800 font-bold uppercase tracking-tight">
                  Ancient Beast Lair Menu
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-1 px-2.5 rounded-full bg-slate-200 hover:bg-red-500 border border-slate-300 hover:border-red-600 text-slate-800 hover:text-white transition-all cursor-pointer font-bold text-xs"
            >
              ✕
            </button>
          </div>

          {/* Lair Visual Banner and Background Lore */}
          <div className="relative h-44 bg-gradient-to-b from-slate-900 to-slate-950 flex flex-col justify-end p-5 overflow-hidden">
            {/* Background Atmosphere Elements */}
            <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-color-dodge" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
            
            {/* Swirling Mist / Particle Rings simulated visually */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-purple-500/10 rounded-full animate-pulse pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 border border-sky-400/5 rounded-full animate-spin pointer-events-none" />

            <div className="relative z-10 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl filter drop-shadow-[0_0_12px_rgba(168,85,247,0.7)] animate-bounce">
                    {lairNode.icon}
                  </span>
                  <div>
                    <h2 className="font-serif font-extrabold text-xl text-white tracking-wide uppercase">
                      {lairConfig.name}
                    </h2>
                    <p className="text-[10px] font-semibold text-sky-300 font-mono flex items-center gap-1 mt-0.5">
                      <Compass className="w-3 h-3 text-sky-400" />
                      Coordinates: X: {lairNode.x}, Y: {lairNode.y}
                    </p>
                  </div>
                </div>
                <p className="mt-2 text-[11px] text-slate-300 leading-relaxed max-w-sm font-medium italic">
                  "{lairConfig.description}"
                </p>
              </div>

              {/* Lair Crest Badge */}
              <div className="bg-amber-500/10 border-2 border-amber-500/35 px-2.5 py-1.5 rounded-2xl text-center shadow-lg">
                <span className="block text-[8.5px] text-amber-400 font-bold tracking-widest uppercase">Lair Boss</span>
                <span className="text-xs text-white font-black">{currentBeast.name}</span>
              </div>
            </div>
          </div>

          {/* Core Interactive Area */}
          <div className="p-6 flex flex-col gap-5 bg-white/40">
            
            {/* Level Selector Slider (Levels 1 to 30) */}
            <div className="bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-600/25 rounded-2xl p-4 flex flex-col gap-2 shadow-inner">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-black uppercase text-amber-950 flex items-center gap-1">
                  <Scroll className="w-3.5 h-3.5 text-amber-700" />
                  Select Lair Boss Level
                </label>
                <div className="bg-[#0f172a] border border-amber-500/50 px-3 py-1 rounded-full text-center font-mono font-black text-xs text-amber-400">
                  Lv. {selectedLevel}
                </div>
              </div>

              <input
                type="range"
                min="1"
                max="30"
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(parseInt(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              
              <div className="flex justify-between text-[9px] text-amber-800 font-black px-1">
                <span>LV 1 (Recruit)</span>
                <span>LV 15 (Veteran)</span>
                <span>LV 30 (Sovereign)</span>
              </div>
            </div>

            {/* Beast Specs & Scaling Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              
              {/* Power Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-sm flex items-center gap-3">
                <div className="bg-red-100 text-red-700 p-2 rounded-lg text-lg">⚔️</div>
                <div>
                  <span className="block text-[9px] text-slate-500 font-bold uppercase">Beast Power</span>
                  <span className="font-mono text-xs font-black text-red-600">{formatNum(scaledPower)}</span>
                </div>
              </div>

              {/* Rec Power Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-sm flex items-center gap-3">
                <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg text-lg">🛡️</div>
                <div>
                  <span className="block text-[9px] text-slate-500 font-bold uppercase">Recommended Power</span>
                  <span className="font-mono text-xs font-black text-emerald-600">{formatNum(recommendedPower)}</span>
                </div>
              </div>

              {/* Stamina Cost Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-sm flex items-center gap-3">
                <div className="bg-sky-100 text-sky-700 p-2 rounded-lg text-lg">⚡</div>
                <div>
                  <span className="block text-[9px] text-slate-500 font-bold uppercase">Stamina Cost</span>
                  <span className="font-mono text-xs font-black text-sky-600">{staminaCost} AP</span>
                </div>
              </div>

              {/* Attempts Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-sm flex items-center gap-3">
                <div className="bg-amber-100 text-amber-700 p-2 rounded-lg text-lg">⏳</div>
                <div>
                  <span className="block text-[9px] text-slate-500 font-bold uppercase">Attempts Left</span>
                  <span className="font-mono text-xs font-black text-amber-700">{attemptsRemaining} / 3</span>
                </div>
              </div>

            </div>

            {/* Possible Loot Section */}
            <div className="border border-slate-200 rounded-xl bg-slate-50 p-4">
              <h4 className="text-[11px] font-black uppercase text-slate-700 flex items-center gap-1.5 mb-2.5">
                <Award className="w-3.5 h-3.5 text-purple-600" />
                Guaranteed Victory Loot Drops (Scaled to Lv.{selectedLevel})
              </h4>
              <div className="flex gap-3 justify-center">
                {ancientBeastRewards.map(item => (
                  <div
                    key={item.id}
                    title={`${item.name}: ${item.description}`}
                    className={`relative p-2.5 rounded-xl border flex flex-col items-center justify-center w-14 h-14 bg-white shadow-sm hover:scale-105 transition-transform ${
                      item.quality === 'Legendary'
                        ? 'border-amber-400 bg-amber-500/5'
                        : item.quality === 'Epic'
                          ? 'border-purple-400 bg-purple-500/5'
                          : 'border-sky-300 bg-sky-500/5'
                    }`}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <span className="absolute -bottom-1 text-[8px] font-black bg-slate-950 text-white px-1.5 rounded-full border border-slate-800 scale-90">
                      x{Math.round((item.category === 'currency' ? 20 : item.category === 'materials' ? 5 : 50) * rewardMultiplier)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Alliance Rally Status Header / Notice */}
            <div className="bg-[#f0f4f8] border border-slate-200 rounded-xl p-3.5 flex items-center justify-between shadow-inner">
              <div className="flex items-center gap-2.5">
                <div className={`w-3 h-3 rounded-full ${isRallyActive ? 'bg-emerald-500 animate-ping' : 'bg-slate-400'}`} />
                <div>
                  <span className="text-[11px] font-black text-slate-800 block">
                    {isRallyActive ? '🛡️ ALLIANCE RALLY ACTIVE' : '💤 NO ACTIVE RALLY'}
                  </span>
                  <p className="text-[9px] text-slate-500 font-bold">
                    {isRallyActive 
                      ? `Rallying in progress. Launching in ${Math.floor(rallyTimer / 60)}m ${rallyTimer % 60}s`
                      : 'Create a new rally banner for your alliance members.'
                    }
                  </p>
                </div>
              </div>

              {isRallyActive && (
                <button
                  onClick={() => setActiveWindow('rally')}
                  className="bg-purple-950 border border-purple-500 text-purple-300 text-[10px] font-bold px-3 py-1 rounded-xl hover:bg-purple-900 active:scale-95 transition-all"
                >
                  Manage
                </button>
              )}
            </div>

          </div>

          {/* Action Button Tray with White Marble Footer */}
          <div className="mt-auto px-6 py-4 bg-gradient-to-b from-slate-50 to-slate-200/80 border-t border-slate-200 flex gap-4">
            
            <button
              onClick={() => setActiveWindow('scout')}
              className="flex-1 bg-gradient-to-b from-[#ffffff] to-[#e2e8f0] hover:to-[#cbd5e1] text-[#0f172a] border-x border-t border-b-4 border-[#94a3b8] px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              Scout Boss
            </button>

            <button
              onClick={handleStartRally}
              disabled={attemptsRemaining <= 0}
              className={`flex-1 bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black border-x border-t border-b-4 border-amber-800 disabled:opacity-50 px-4 py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-[0_4px_12px_rgba(245,158,11,0.2)] flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer`}
            >
              <Sword className="w-4 h-4" />
              Rally Lair
            </button>

            <button
              onClick={handleBookmark}
              className="bg-gradient-to-b from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white border-x border-t border-b-4 border-sky-850 p-3 rounded-xl font-bold transition-all active:scale-95 cursor-pointer flex items-center justify-center"
              title="Bookmark coordinates"
            >
              📍
            </button>

          </div>

        </div>
      )}

      {/* 
        =========================================================
        SCOUT REPORT WINDOW
        =========================================================
      */}
      {activeWindow === 'scout' && (
        <div className="relative w-full max-w-md bg-gradient-to-b from-[#f8fafc] via-[#ffffff] to-[#e2e8f0] border-4 border-[#b45309] rounded-[2rem] shadow-[0_20px_50px_rgba(168,85,247,0.35)] overflow-hidden flex flex-col">
          
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-600 via-sky-600 to-purple-600 shadow-md" />
          
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-slate-100 to-slate-200/50 border-b-2 border-amber-600/30">
            <div className="flex items-center gap-2">
              <span className="text-xl">📜</span>
              <div>
                <h3 className="font-serif font-black text-amber-950 tracking-wider text-sm uppercase">
                  Scout Intelligence
                </h3>
                <p className="text-[10px] text-amber-800 font-bold uppercase tracking-tight">
                  Tactic & Battle Report
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setActiveWindow('main')}
              className="p-1 px-2.5 rounded-full bg-slate-200 hover:bg-slate-300 border border-slate-300 text-slate-800 transition-all cursor-pointer font-bold text-xs"
            >
              ✕
            </button>
          </div>

          <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[70vh]">
            
            {/* Beast Header */}
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-4 rounded-2xl shadow-sm">
              <span className="text-4xl filter drop-shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse">
                {lairNode.icon}
              </span>
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase">Scouted Entity</span>
                <h4 className="text-base font-black text-slate-800">{currentBeast.name} (Lv. {selectedLevel})</h4>
              </div>
            </div>

            {/* Weaknesses Section */}
            <div className="bg-red-50/50 border border-red-200 rounded-xl p-4">
              <h5 className="text-[11px] font-black text-red-800 uppercase flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                Vulnerabilities & Weaknesses
              </h5>
              <ul className="space-y-1.5">
                {currentBeast.weaknesses.map((weak, idx) => (
                  <li key={idx} className="text-[11px] font-bold text-red-900 flex items-center gap-1.5">
                    <span className="text-xs text-red-500">▶</span>
                    {weak}
                  </li>
                ))}
              </ul>
            </div>

            {/* Abilities Section */}
            <div className="bg-purple-50/50 border border-purple-200 rounded-xl p-4">
              <h5 className="text-[11px] font-black text-purple-800 uppercase flex items-center gap-1.5 mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-spin" />
                Legendary Abilities
              </h5>
              <div className="space-y-3">
                {currentBeast.abilities.map((abi, idx) => (
                  <div key={idx} className="bg-white/80 border border-purple-100 p-2.5 rounded-lg shadow-sm">
                    <span className="font-bold text-[11px] text-purple-950 block">⚡ {abi.name}</span>
                    <p className="text-[10px] text-slate-600 leading-normal mt-0.5">{abi.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategy / Advice Section */}
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4">
              <h5 className="text-[11px] font-black text-sky-800 uppercase flex items-center gap-1.5 mb-2">
                <Shield className="w-3.5 h-3.5 text-sky-600" />
                High Council Strategy
              </h5>
              <div className="bg-white/90 border border-sky-100 p-3 rounded-lg flex flex-col gap-2 shadow-sm">
                <div>
                  <span className="block text-[9px] text-slate-400 font-bold uppercase">Optimal Troop Type</span>
                  <span className="text-xs font-black text-amber-600 font-mono">⚔️ {currentBeast.recommended_troop_type} Legions</span>
                </div>
                <div>
                  <span className="block text-[9px] text-slate-400 font-bold uppercase">Strategic Advice</span>
                  <p className="text-[10px] text-slate-700 leading-relaxed font-semibold mt-0.5">
                    {currentBeast.rally_recommendations}
                  </p>
                </div>
              </div>
            </div>

          </div>

          <div className="mt-auto px-6 py-4 bg-slate-50 border-t border-slate-200 flex gap-4">
            <button
              onClick={() => setActiveWindow('main')}
              className="w-full bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black border-x border-t border-b-4 border-amber-800 px-4 py-3 rounded-xl font-black text-xs uppercase tracking-wider text-center shadow-sm cursor-pointer transition-all active:scale-95"
            >
              Return to Lair Menu
            </button>
          </div>

        </div>
      )}

      {/* 
        =========================================================
        ALLIANCE RALLY WINDOW
        =========================================================
      */}
      {activeWindow === 'rally' && (
        <div className="relative w-full max-w-md bg-gradient-to-b from-[#f8fafc] via-[#ffffff] to-[#e2e8f0] border-4 border-[#b45309] rounded-[2rem] shadow-[0_20px_50px_rgba(168,85,247,0.35)] overflow-hidden flex flex-col">
          
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 via-sky-600 to-emerald-600 shadow-md" />
          
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-slate-100 to-slate-200/50 border-b-2 border-amber-600/30">
            <div className="flex items-center gap-2">
              <span className="text-xl">🛡️</span>
              <div>
                <h3 className="font-serif font-black text-amber-950 tracking-wider text-sm uppercase">
                  Alliance Rally Lobby
                </h3>
                <p className="text-[10px] text-amber-800 font-bold uppercase tracking-tight">
                  Coordinated Campaign
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setActiveWindow('main')}
              className="p-1 px-2.5 rounded-full bg-slate-200 hover:bg-slate-300 border border-slate-300 text-slate-800 transition-all cursor-pointer font-bold text-xs"
            >
              ✕
            </button>
          </div>

          <div className="p-6 flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
            
            {/* Rally Header Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-2.5 shadow-sm">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <div>
                  <span className="text-[8.5px] text-slate-400 font-bold uppercase block">Rally Target</span>
                  <h4 className="text-sm font-black text-slate-800">Lv. {selectedLevel} {currentBeast.name}</h4>
                </div>
                <div className="bg-purple-950 text-purple-300 border border-purple-500/50 rounded-full px-3 py-1 text-xs font-bold font-mono flex items-center gap-1.5 animate-pulse">
                  <Timer className="w-3.5 h-3.5" />
                  {Math.floor(rallyTimer / 60)}:{(rallyTimer % 60).toString().padStart(2, '0')}
                </div>
              </div>

              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-slate-500">Rally Leader:</span>
                <span className="text-amber-700">Lord_Gideon</span>
              </div>

              <div className="flex justify-between text-xs font-mono font-bold">
                <span className="text-slate-500">Total Troops:</span>
                <span className="text-purple-700">
                  {formatNum(rallyMembers.reduce((sum, m) => sum + m.troops, 0))} / {formatNum(2000000)}
                </span>
              </div>
            </div>

            {/* Member List Grid */}
            <div className="border border-slate-200 rounded-xl bg-white p-4">
              <h5 className="text-[11px] font-black uppercase text-slate-500 mb-3 tracking-wider">
                Rally Roster ({rallyMembers.length} Joined)
              </h5>
              
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {rallyMembers.map((member, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-2.5 rounded-xl border text-xs font-semibold ${
                      member.name.includes('You')
                        ? 'bg-amber-500/5 border-amber-300 text-amber-950 shadow-sm'
                        : member.isLeader
                          ? 'bg-slate-50 border-slate-300 text-slate-800'
                          : 'bg-slate-50/50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{member.isLeader ? '⭐' : '🛡️'}</span>
                      <div>
                        <span className="font-bold block">{member.name}</span>
                        <span className="text-[9.5px] text-slate-400 font-mono">Power: {formatNum(member.power)}</span>
                      </div>
                    </div>
                    <span className="font-mono font-black text-amber-700">{formatNum(member.troops)} troops</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Launch Instantly Debug Command for testing convenience */}
            <div className="bg-amber-500/10 border border-dashed border-amber-500/40 rounded-xl p-3 text-center">
              <span className="text-[10px] text-amber-900 block font-bold">🛠️ Admin Instabattle Action</span>
              <button
                onClick={triggerBattleCompletion}
                className="mt-2 w-full bg-amber-500 hover:bg-amber-400 text-black font-black text-[10px] py-1.5 rounded-lg border border-amber-600 transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
              >
                Instant Attack Simulation (Bypasses 5m timer)
              </button>
            </div>

          </div>

          <div className="mt-auto px-6 py-4 bg-slate-50 border-t border-slate-200 flex gap-4">
            
            <button
              onClick={handleJoinRallyToggle}
              className={`flex-1 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-center transition-all active:scale-95 cursor-pointer border-x border-t border-b-4 ${
                isJoinedRally
                  ? 'bg-gradient-to-b from-red-500 to-red-600 text-white border-red-800 hover:from-red-400 hover:to-red-500'
                  : 'bg-gradient-to-b from-emerald-500 to-emerald-600 text-white border-emerald-800 hover:from-emerald-400 hover:to-emerald-500'
              }`}
            >
              {isJoinedRally ? 'Leave Rally' : 'Join Rally'}
            </button>

            <button
              onClick={() => setActiveWindow('main')}
              className="flex-1 bg-gradient-to-b from-slate-100 to-slate-200 border-x border-t border-b-4 border-slate-400 px-4 py-3 rounded-xl font-bold text-xs text-slate-800 uppercase tracking-wider text-center cursor-pointer transition-all active:scale-95"
            >
              Close Lobby
            </button>

          </div>

        </div>
      )}

      {/* 
        =========================================================
        REWARDS CHEST CLAIM WINDOW
        =========================================================
      */}
      {activeWindow === 'rewards' && (
        <div className="relative w-full max-w-sm bg-gradient-to-b from-[#f8fafc] via-[#ffffff] to-[#e2e8f0] border-4 border-[#b45309] rounded-[2rem] shadow-[0_20px_50px_rgba(168,85,247,0.35)] overflow-hidden flex flex-col">
          
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-purple-600 to-amber-500 shadow-md" />
          
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-b from-slate-100 to-slate-200/50 border-b-2 border-amber-600/30">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎁</span>
              <div>
                <h3 className="font-serif font-black text-amber-950 tracking-wider text-sm uppercase">
                  Loot Found!
                </h3>
                <p className="text-[10px] text-amber-800 font-bold uppercase tracking-tight">
                  Ancient Relics Unlocked
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setActiveWindow('main')}
              className="p-1 px-2.5 rounded-full bg-slate-200 hover:bg-slate-300 border border-slate-300 text-slate-800 transition-all cursor-pointer font-bold text-xs"
            >
              ✕
            </button>
          </div>

          <div className="p-6 flex flex-col items-center gap-5 text-center">
            
            {/* Defeated Header banner */}
            <div>
              <span className="bg-red-500/10 text-red-600 border border-red-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                Target Eradicated
              </span>
              <h4 className="text-base font-black text-slate-800 mt-2">
                Victory Over Lv.{selectedLevel} {currentBeast.name}
              </h4>
            </div>

            {/* Giant Glowing Chest View */}
            <div className="relative w-full h-36 flex items-center justify-center">
              
              {/* Spinning background magical halos */}
              <div className="absolute w-24 h-24 border border-dashed border-purple-500/25 rounded-full animate-[spin_10s_linear_infinite]" />
              <div className="absolute w-28 h-28 border border-amber-500/15 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
              
              <button
                onClick={() => setIsChestOpen(true)}
                disabled={isChestOpen}
                className={`relative z-10 transition-transform hover:scale-110 active:scale-95 cursor-pointer select-none`}
              >
                <span className="text-7xl filter drop-shadow-[0_0_20px_rgba(245,158,11,0.65)] block">
                  {isChestOpen ? '🔓' : '🔒'}
                </span>
                
                {!isChestOpen && (
                  <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-500 text-black font-black text-[9px] px-2.5 py-0.5 rounded-full shadow-lg border border-amber-600 animate-bounce uppercase tracking-wider whitespace-nowrap">
                    Tap to Open
                  </span>
                )}
              </button>

            </div>

            {/* Loot Reveal List */}
            {isChestOpen ? (
              <div className="w-full border border-slate-200 rounded-xl bg-slate-50 p-4">
                <span className="block text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest">Victory Loot Obtained</span>
                
                <div className="flex justify-center gap-3">
                  {claimedRewards.map((reward, idx) => (
                    <div
                      key={idx}
                      className={`relative p-2.5 rounded-xl border flex flex-col items-center justify-center w-14 h-14 bg-white shadow-sm animate-[bounce_0.3s_ease-out]`}
                      title={reward.description}
                    >
                      <span className="text-2xl">{reward.icon}</span>
                      <span className="absolute -bottom-1 text-[8.5px] font-black bg-slate-950 text-slate-100 px-1.5 rounded-full border border-slate-800 scale-90">
                        x{reward.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-500 font-semibold leading-relaxed max-w-xs">
                Tap the secure seal above to break the Beast Lair core containment shield and claim your alliance rewards!
              </p>
            )}

          </div>

          <div className="mt-auto px-6 py-4 bg-slate-50 border-t border-slate-200 flex gap-4">
            
            <button
              onClick={isChestOpen ? handleClaimRewards : () => setIsChestOpen(true)}
              className="w-full bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black border-x border-t border-b-4 border-amber-800 px-4 py-3 rounded-xl font-black text-xs uppercase tracking-wider text-center shadow-sm cursor-pointer transition-all active:scale-95"
            >
              {isChestOpen ? 'Claim All & Close' : 'Open Victory Chest'}
            </button>

          </div>

        </div>
      )}

    </div>
  );
}
