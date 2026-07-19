import React, { useState } from 'react';
import { AllianceState, AllianceMember, AllianceApplicant, AllianceTerritoryNode, LeaderboardAlliance, Resources, UnitType, Rally, RallyParticipant } from '../types';
import { formatNum } from '../gameData';
import { TROOP_BY_ID } from '../utils/troopDatabase';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Shield, 
  Crown, 
  Compass, 
  Trophy, 
  Timer, 
  HeartHandshake, 
  UserPlus, 
  Check, 
  X, 
  Globe, 
  MapPin, 
  Sparkles, 
  Map, 
  Flag, 
  Coins, 
  Zap, 
  Edit2,
  Swords,
  Clock,
  Plus,
  ChevronRight
} from 'lucide-react';

interface AllianceTabProps {
  alliance: AllianceState;
  playerPower: number;
  resources: Resources;
  trainingQueue: any[];
  onUpdateAlliance: (updated: Partial<AllianceState>) => void;
  onAllianceHelp: () => void;
  onAddLog: (text: string, type: 'info' | 'success' | 'warning' | 'combat') => void;
  competitors: any[]; 
}

export default function AllianceTab({
  alliance,
  playerPower,
  resources,
  trainingQueue,
  onUpdateAlliance,
  onAllianceHelp,
  onAddLog,
  competitors
}: AllianceTabProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(alliance.name);
  const [crestIndex, setCrestIndex] = useState(0);
  const [selectedNode, setSelectedNode] = useState<AllianceTerritoryNode | null>(null);

  // --- Co-op Alliance Rallies Local State ---
  const [selectedRallyId, setSelectedRallyId] = useState<string | null>("rally_default_boss");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);

  // Create Rally Form State
  const [targetId, setTargetId] = useState('scourge_wyrm');
  const [timerSec, setTimerSec] = useState(30); 
  const [selectedHero, setSelectedHero] = useState('Maegan [Lv.50]');
  const [infantryCount, setInfantryCount] = useState(10000);
  const [marksmenCount, setMarksmenCount] = useState(8000);
  const [cavalryCount, setCavalryCount] = useState(5000);

  // Join Rally Form State
  const [joinHero, setJoinHero] = useState('Godot Sage [Lv.45]');
  const [joinInfantry, setJoinInfantry] = useState(5000);
  const [joinMarksmen, setJoinMarksmen] = useState(4000);
  const [joinCavalry, setJoinCavalry] = useState(2500);

  const RALLY_TARGETS = [
    { id: 'scourge_wyrm', name: 'Ancient Scourge Wyrm [Lv.40]', coords: 'X: 425, Y: 890' },
    { id: 'titan_golem', name: 'Shattered Titan Golem [Lv.35]', coords: 'X: 112, Y: 642' },
    { id: 'bandit_citadel', name: 'Rogue Sovereign Fortress [Lv.30]', coords: 'X: 715, Y: 335' },
    { id: 'abyssal_beast', name: 'Scylla Abyssal Beast [Lv.25]', coords: 'X: 904, Y: 120' }
  ];

  const handleCreateRally = () => {
    const target = RALLY_TARGETS.find(t => t.id === targetId);
    if (!target) return;

    if (infantryCount === 0 && marksmenCount === 0 && cavalryCount === 0) {
      onAddLog("Aborted: Cannot launch a vanguard with zero soldiers!", "warning");
      return;
    }

    const newRally: Rally = {
      id: "rally_" + Date.now(),
      targetId: target.id,
      targetName: target.name,
      targetCoords: target.coords,
      creator: "Sovereign Lord (Player)",
      timeRemainingSec: timerSec,
      totalDurationSec: timerSec,
      status: 'assembling',
      participants: [
        {
          name: "Sovereign Lord (You)",
          heroName: selectedHero,
          infantry: infantryCount,
          marksmen: marksmenCount,
          cavalry: cavalryCount,
          power: (infantryCount * 8) + (marksmenCount * 10) + (cavalryCount * 12)
        }
      ]
    };

    const updatedRallies = [...(alliance.rallies || []), newRally];
    onUpdateAlliance({ rallies: updatedRallies });
    setSelectedRallyId(newRally.id);
    setIsCreateModalOpen(false);
    onAddLog(`⚔️ Co-op Rally launched against ${target.name}! Mobilization timers initiated.`, "success");
  };

  const handleJoinRally = () => {
    if (!selectedRallyId) return;

    if (joinInfantry === 0 && joinMarksmen === 0 && joinCavalry === 0) {
      onAddLog("Aborted: Cannot reinforce with zero soldiers!", "warning");
      return;
    }

    const currentRallies = alliance.rallies || [];
    const targetRally = currentRallies.find(r => r.id === selectedRallyId);
    if (!targetRally) return;

    // Check if player already joined
    if (targetRally.participants.some(p => p.name === "Allied Reinforcement (You)")) {
      onAddLog("Warning: Already reinforcing this active coalition column!", "warning");
      return;
    }

    const nextParticipant: RallyParticipant = {
      name: "Allied Reinforcement (You)",
      heroName: joinHero,
      infantry: joinInfantry,
      marksmen: joinMarksmen,
      cavalry: joinCavalry,
      power: (joinInfantry * 8) + (joinMarksmen * 10) + (joinCavalry * 12)
    };

    const updatedRallies = currentRallies.map(r => {
      if (r.id === selectedRallyId) {
        return {
          ...r,
          participants: [...r.participants, nextParticipant]
        };
      }
      return r;
    });

    onUpdateAlliance({ rallies: updatedRallies });
    setIsJoinModalOpen(false);
    onAddLog(`🛡️ Dispatched reinforce column to join the rally against ${targetRally.targetName}!`, "success");
  };

  const CRESTS = [
    { bg: 'bg-amber-950/45 text-amber-500 border-amber-900', label: 'Golden Griffin' },
    { bg: 'bg-rose-950/45 text-rose-500 border-rose-950', label: 'Scarlet Dragon' },
    { bg: 'bg-emerald-950/45 text-emerald-400 border-emerald-950', label: 'Celestial Serpent' },
    { bg: 'bg-indigo-950/45 text-indigo-400 border-indigo-950', label: 'Eldritch Owl' },
    { bg: 'bg-cyan-950/45 text-cyan-400 border-cyan-955', label: 'Abyssal Trident' }
  ];

  // Dynamically calculate the player's alliance stats
  const memberPower = alliance.members.reduce((sum, m) => sum + m.power, 0);
  const totalAlliancePower = playerPower + memberPower;
  const currentMemberCount = alliance.members.length;

  // Compile the Server's top Alliances leaderboard
  const liveLeaderboard: LeaderboardAlliance[] = [
    ...competitors.map((comp) => ({
      rank: 1, // Will compute sorting ranks after
      name: comp.name,
      level: comp.level,
      totalPower: comp.basePower + (comp.memberCount * 850),
      membersCount: comp.memberCount,
      isPlayerAlliance: false
    })),
    {
      rank: 1,
      name: alliance.name,
      level: alliance.level,
      totalPower: totalAlliancePower,
      membersCount: currentMemberCount,
      isPlayerAlliance: true
    }
  ]
    .sort((a, b) => b.totalPower - a.totalPower)
    .map((item, idx) => ({ ...item, rank: idx + 1 }));

  const playerRank = liveLeaderboard.find(l => l.isPlayerAlliance)?.rank || 5;

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdateAlliance({ name: tempName.trim() });
      setIsEditingName(false);
      onAddLog(`Alliance renamed to [${tempName.trim()}]`, 'info');
    }
  };

  const handleAcceptApplicant = (app: AllianceApplicant) => {
    if (alliance.members.length >= alliance.maxMembers) {
      onAddLog("Recruitment cap reached: Expand Alliance Level to host more lords.", "warning");
      return;
    }

    const newMember: AllianceMember = {
      name: app.name,
      power: app.power,
      rank: 'Lord',
      joinedAt: Date.now()
    };

    const updatedMembers = [...alliance.members, newMember];
    const updatedApplicants = alliance.applicants.filter(a => a.name !== app.name);

    onUpdateAlliance({
      members: updatedMembers,
      applicants: updatedApplicants,
      memberCount: updatedMembers.length
    });

    onAddLog(`🏰 Approved applicant [${app.name}]! Recruited into active service (Alliance Power +${formatNum(app.power)} CR).`, 'success');
  };

  const handleDeclineApplicant = (app: AllianceApplicant) => {
    const updatedApplicants = alliance.applicants.filter(a => a.name !== app.name);
    onUpdateAlliance({ applicants: updatedApplicants });
    onAddLog(`Declined recruitment application from ${app.name}.`, 'info');
  };

  const handleDeployGarrison = (node: AllianceTerritoryNode) => {
    if (playerPower < node.defensePower * 0.4) {
      onAddLog(`Attack aborted: Coordinates at [${node.x}, ${node.y}] require at least ${formatNum(node.defensePower * 0.4)} Player CR to claim.`, 'warning');
      return;
    }

    const updatedNodes = alliance.territoryNodes.map(n => {
      if (n.id === node.id) {
        return { ...n, status: 'claimed' as const };
      }
      return n;
    });

    // Calculate new influence score percentage
    const claimedCount = updatedNodes.filter(n => n.status === 'claimed').length;
    const influencePercentage = Math.round((claimedCount / updatedNodes.length) * 100);

    // Give rewarding XP/level boost to alliance if high control is established
    let finalLevel = alliance.level;
    if (claimedCount > 4 && alliance.level === 1) {
      finalLevel = 2;
      onAddLog("⭐ Alliance Influence crossed 50%! Alliance leveled up to Tier 2!", 'success');
    }

    onUpdateAlliance({
      territoryNodes: updatedNodes,
      territoryInfluence: influencePercentage,
      level: finalLevel
    });

    setSelectedNode({ ...node, status: 'claimed' });
    onAddLog(`⚔️ Conquest victorious! Sovereign troops secured territory node ${node.cityName} [${node.x}, ${node.y}]. ${node.bonusText || ''} activated!`, 'success');
  };

  const handleRelinquishNode = (node: AllianceTerritoryNode) => {
    const updatedNodes = alliance.territoryNodes.map(n => {
      if (n.id === node.id) {
        return { ...n, status: 'unclaimed' as const };
      }
      return n;
    });

    const claimedCount = updatedNodes.filter(n => n.status === 'claimed').length;
    const influencePercentage = Math.round((claimedCount / updatedNodes.length) * 100);

    onUpdateAlliance({
      territoryNodes: updatedNodes,
      territoryInfluence: influencePercentage
    });

    setSelectedNode({ ...node, status: 'unclaimed' });
    onAddLog(`Withdrew defensive garrisons from coordinate node ${node.cityName}.`, 'info');
  };

  const activeTrainingJob = trainingQueue[0];

  return (
    <div id="alliance-tab-view" className="flex-1 flex flex-col h-full bg-[#050608] select-none text-white overflow-y-auto custom-scrollbar p-4 lg:p-6 space-y-6">
      
      {/* SECTION 1: HERO HEADER AND DYNAMIC STATS CARD */}
      <div className="bg-gradient-to-br from-[#0b0f19] to-[#06080d] border border-zinc-900 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        {/* Decorative ambient background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          
          <div className="flex items-center gap-4">
            {/* Crest design selection */}
            <div 
              onClick={() => {
                const next = (crestIndex + 1) % CRESTS.length;
                setCrestIndex(next);
                onAddLog(`Swapped alliance cosmetic banner seal to ${CRESTS[next].label}`, 'info');
              }}
              className={`w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center border transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer shadow-md ${CRESTS[crestIndex].bg}`}
              title="Click to swap crest banner style"
            >
              <Shield className="w-8 h-8 animate-pulse" />
            </div>

            <div>
              {isEditingName ? (
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    maxLength={24}
                    className="bg-zinc-950 border border-amber-500/50 text-white rounded px-2.5 py-1 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-amber-400"
                  />
                  <button 
                    onClick={handleSaveName}
                    className="p-1 px-2.5 bg-amber-550 text-black text-xs font-mono font-bold rounded hover:bg-amber-400 cursor-pointer"
                  >
                    Save
                  </button>
                  <button 
                    onClick={() => { setIsEditingName(false); setTempName(alliance.name); }}
                    className="p-1 px-2.5 bg-zinc-900 text-zinc-400 text-xs font-mono rounded hover:bg-zinc-800"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-lg md:text-xl font-serif font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-zinc-100 uppercase">
                    {alliance.name}
                  </h2>
                  <button 
                    onClick={() => { setTempName(alliance.name); setIsEditingName(true); }}
                    className="text-zinc-500 hover:text-amber-500 transition-colors p-1"
                    title="Change alliance name"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] font-mono text-zinc-400">
                <span className="flex items-center gap-1">
                  <Crown className="w-3 h-3 text-amber-500" />
                  Sovereign Keep League
                </span>
                <span className="text-zinc-700 font-bold">•</span>
                <span className="text-amber-400 font-extrabold bg-amber-955/20 px-1.5 py-0.5 rounded border border-amber-900/30">
                  Level {alliance.level}
                </span>
                <span className="text-zinc-700 font-bold">•</span>
                <span className="text-blue-400 font-medium">
                  Rank {playerRank} On Server
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-3">
            {/* Total Power state visual card */}
            <div className="p-2.5 bg-black/40 border border-zinc-900 rounded-xl min-w-[110px] text-center">
              <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 block">Total Power</span>
              <span className="text-base font-mono font-black text-amber-500">
                {formatNum(totalAlliancePower)} <span className="text-[9px] font-bold text-zinc-400">CR</span>
              </span>
            </div>

            {/* Member count slots */}
            <div className="p-2.5 bg-black/40 border border-zinc-900 rounded-xl min-w-[110px] text-center">
              <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 block">Members</span>
              <span className="text-base font-mono font-black text-zinc-300">
                {currentMemberCount} <span className="text-xs text-zinc-500">/ {alliance.maxMembers}</span>
              </span>
            </div>

            {/* Territory nodes influence */}
            <div className="p-2.5 bg-black/40 border border-zinc-900 rounded-xl min-w-[110px] text-center col-span-2 sm:col-span-1">
              <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 block">Influence</span>
              <span className="text-base font-mono font-black text-indigo-400">
                {alliance.territoryInfluence}% <span className="text-[9px] font-bold text-zinc-500">grid</span>
              </span>
            </div>
          </div>

        </div>

        {/* Member profile overview line */}
        <div className="mt-4 pt-3 border-t border-zinc-900/60 flex flex-wrap gap-2 items-center text-xs justify-between">
          <div className="flex gap-1.5 items-center">
            <Users className="w-3.5 h-3.5 text-zinc-550" />
            <span className="text-zinc-400">Active Lords garrisoned:</span>
            <div className="flex items-center gap-1.5 overflow-hidden">
              <span className="font-mono bg-zinc-950 px-2 py-0.5 rounded text-zinc-300 text-[10px] border border-zinc-900">
                Sovereign Maegan (You)
              </span>
              {alliance.members.map((m) => (
                <span key={m.name} className="font-mono bg-zinc-950 px-2 py-0.5 rounded text-zinc-400 text-[10px] border border-zinc-900">
                  {m.name} ({formatNum(m.power)})
                </span>
              ))}
            </div>
          </div>
          <span className="text-[10px] font-mono text-zinc-550 italic">Accept applicants below to boost Total Power!</span>
        </div>
      </div>

      {/* SECTION 2: TRAINING ASSISTANCE / ALLIANCE HELP & COALITION CONSOLE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* ALLIANCE HELP SYSTEM CARD */}
        <div className="bg-zinc-950/90 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 bg-amber-955/20 border border-amber-900/40 rounded-lg text-amber-500">
                  <HeartHandshake className="w-4 h-4 text-amber-400 animate-pulse" />
                </div>
                <h3 className="font-serif font-black uppercase text-sm text-zinc-100 tracking-wide">
                  Alliance Speedup Assistance
                </h3>
              </div>
              <span className="px-2 py-0.5 bg-indigo-950/50 border border-indigo-900/30 text-indigo-400 font-mono text-[9px] rounded-full uppercase font-bold">
                Single Token
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Dispatched military aids or domestic builders cut current troop training countdowns. Under our server consensus, clicking below shaves **1 minute (60 seconds)** off the queue.
            </p>
          </div>

          {/* Training Queue Helper Dashboard */}
          <div className="bg-[#0b0d14] rounded-xl p-3 border border-zinc-900 space-y-2.5">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">
              Active Server Draft Queue:
            </span>

            {activeTrainingJob ? (
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-xs font-mono font-bold text-zinc-200">
                    Drafting {activeTrainingJob.count}x {TROOP_BY_ID[activeTrainingJob.unitId]?.name || 'Sovereign Troops'}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                    <Timer className="w-3.5 h-3.5 text-amber-500/80" />
                    <span>Time remaining: <span className="text-emerald-400 font-bold font-mono">{activeTrainingJob.timeRemainingSec}s</span></span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/20 px-1.5 py-0.5 rounded border border-emerald-900/30 animate-pulse">
                    Timer Active
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center text-xs font-mono text-zinc-650 italic">
                No active Garrison draft jobs inside the barracks right now. Draft units in the Garrison tab!
              </div>
            )}

            {/* Visual Progress Bar */}
            {activeTrainingJob && (
              <div className="w-full h-1.5 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-300"
                  style={{ width: `${Math.max(5, Math.min(100, (activeTrainingJob.timeRemainingSec / 60) * 100))}%` }}
                />
              </div>
            )}
          </div>

          <button
            onClick={() => {
              if (!activeTrainingJob) {
                onAddLog("Alliance Help deployed! Dispatched domestic labor squads (No training timers active to speed up right now).", "info");
              } else {
                onAllianceHelp();
              }
            }}
            className={`w-full py-2.5 rounded-xl font-mono text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-97 cursor-pointer ${
              activeTrainingJob 
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-550 text-black shadow-lg shadow-amber-500/10' 
                : 'bg-zinc-900/80 text-zinc-500 border border-zinc-850 hover:bg-zinc-800 hover:text-zinc-300'
            }`}
          >
            <Zap className={`w-3.5 h-3.5 fill-current ${activeTrainingJob ? 'animate-bounce' : ''}`} />
            {activeTrainingJob ? "Trigger Alliance Help! (-1 Minute)" : "Keep Aid (Dispatch Patrols)"}
          </button>
        </div>

        {/* RECRUITMENT AND APPLICATIONS COALITION PANEL */}
        <div className="bg-zinc-950/90 border border-zinc-900 rounded-2xl p-4 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="p-1.5 bg-yellow-955/20 border border-yellow-900/40 rounded-lg text-yellow-500">
                  <UserPlus className="w-4 h-4 text-yellow-500" />
                </div>
                <h3 className="font-serif font-black uppercase text-sm text-zinc-100 tracking-wide">
                  Lords Enlist Roster
                </h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 font-bold animate-pulse">
                • LIVE AUTO APPLICATIONS
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Active computer-controlled AI Lords seek strong shields and high Sovereign keeps. Approve applicants to enlist their unique ranks and bolster your total Combat power!
            </p>
          </div>

          {/* Roster of Applicants */}
          <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-1 flex-1">
            <AnimatePresence initial={false}>
              {alliance.applicants.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-6 text-center text-xs font-mono text-zinc-600 italic border border-dashed border-zinc-900 rounded-xl">
                  <span>Awaiting foreign lords caravan...</span>
                  <span className="text-[9px] text-zinc-700 block mt-1">
                    (Candidates apply automatically every 30 seconds!)
                  </span>
                </div>
              ) : (
                alliance.applicants.map((app) => (
                  <motion.div
                    key={app.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-2.5 bg-[#0a0c10] border border-zinc-900/80 rounded-xl flex items-center justify-between gap-3 text-left"
                  >
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold font-serif text-amber-200 block truncate">
                          {app.name}
                        </span>
                        <div className="px-1.5 py-0.5 bg-yellow-950/40 border border-yellow-900/30 text-yellow-500 font-mono text-[8px] rounded-md uppercase font-bold shrink-0">
                          +{formatNum(app.power)} CR
                        </div>
                      </div>
                      <p className="text-[9.5px] text-zinc-400 italic font-sans leading-snug line-clamp-2">
                        "{app.message}"
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleAcceptApplicant(app)}
                        className="p-1 px-1.5 bg-emerald-600 hover:bg-emerald-500 text-black font-mono font-black text-[9px] rounded uppercase cursor-pointer"
                        title="Accept into Alliance"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleDeclineApplicant(app)}
                        className="p-1 text-zinc-500 hover:text-zinc-300 rounded"
                        title="Decline application"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <div className="pt-2 border-t border-zinc-900/50 flex justify-between items-center text-[10px] font-mono text-zinc-500">
            <span>Alliance Capacity</span>
            <span className="font-bold text-zinc-350">{currentMemberCount} / {alliance.maxMembers} Lords</span>
          </div>

        </div>

      </div>

      {/* SECTION 2.5: CO-OP STRATEGIC RALLY STATION */}
      <div className="bg-zinc-950/90 border border-zinc-900 rounded-2xl p-4 md:p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Swords className="w-5 h-5 text-red-500 animate-pulse" />
              <h3 className="font-serif font-black uppercase text-sm md:text-base tracking-wide text-zinc-100">
                Co-op Alliance Rally Station
              </h3>
            </div>
            <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
              Mobilize coalition marches with alliance lords to take down epic world monsters, rogue sovereign castles, and ancient behemoths. Overlapping bonuses and high-coordination troop configs ensure victory!
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-red-650 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer active:scale-97 transition-all shadow-md shadow-red-950/30"
          >
            + Mobilize New Rally
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Campaigns Column */}
          <div className="lg:col-span-1 space-y-3">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black block">
              Active Coalition Campaigns:
            </span>

            <div className="space-y-2 max-h-[350px] overflow-y-auto custom-scrollbar pr-1">
              {(!alliance.rallies || alliance.rallies.length === 0) ? (
                <div className="py-10 text-center text-xs font-mono text-zinc-650 italic border border-dashed border-zinc-900 rounded-xl">
                  No active co-op campaigns in progress. Click Mobilize to start!
                </div>
              ) : (
                alliance.rallies.map((rally) => {
                  const isSelected = selectedRallyId === rally.id;
                  const totalRallyPower = rally.participants.reduce((sum, p) => sum + p.power, 0);

                  return (
                    <div
                      key={rally.id}
                      onClick={() => setSelectedRallyId(rally.id)}
                      className={`p-3 rounded-xl border transition-all duration-350 cursor-pointer text-left ${
                        isSelected
                          ? 'bg-[#1a0e10]/80 border-red-500/50 shadow-md shadow-red-950/25'
                          : 'bg-[#090b0e] border-zinc-900 hover:bg-[#0f1217]'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-bold font-serif text-red-200 block truncate">
                          {rally.targetName}
                        </span>
                        <span className="font-mono text-[9px] text-zinc-500 shrink-0 uppercase">
                          {rally.targetCoords}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mt-2">
                        <span className="text-zinc-550 truncate">Leader: {rally.creator}</span>
                        <span className="text-amber-500 font-bold shrink-0">
                          {formatNum(totalRallyPower)} CR
                        </span>
                      </div>

                      {/* Micro timer and progress */}
                      <div className="mt-3 flex items-center justify-between gap-2">
                        <div className="flex-1 h-1 bg-zinc-950 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-500 transition-all duration-300"
                            style={{ width: `${Math.max(2, Math.min(100, (rally.timeRemainingSec / rally.totalDurationSec) * 100))}%` }}
                          />
                        </div>
                        <div className="flex items-center gap-1 font-mono text-[10px] text-red-400 font-bold shrink-0 animate-pulse">
                          <Clock className="w-3 h-3" />
                          <span>{rally.timeRemainingSec.toFixed(1)}s</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Rally Detailed Preview */}
          <div className="lg:col-span-2 bg-[#090a0d] border border-zinc-900 rounded-xl p-4 flex flex-col justify-between space-y-4">
            {(!selectedRallyId || !alliance.rallies || !alliance.rallies.find(r => r.id === selectedRallyId)) ? (
              <div className="h-full flex flex-col items-center justify-center py-20 text-center text-xs font-mono text-zinc-600 italic">
                <span>Select an active campaign from the list to preview march pathings and reinforcement rosters.</span>
              </div>
            ) : (
              (() => {
                const rally = alliance.rallies.find(r => r.id === selectedRallyId)!;
                const totalRallyPower = rally.participants.reduce((sum, p) => sum + p.power, 0);
                const progressWidth = ((rally.totalDurationSec - rally.timeRemainingSec) / rally.totalDurationSec) * 100;
                const hasJoined = rally.participants.some(p => p.name === "Allied Reinforcement (You)");

                return (
                  <div className="space-y-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Detailed Header */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-zinc-900 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-serif font-black text-red-400 text-sm md:text-base uppercase tracking-wide">
                              {rally.targetName}
                            </h4>
                            <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-[9px] rounded-md uppercase font-bold shrink-0">
                              {rally.targetCoords}
                            </span>
                          </div>
                          <p className="text-[10px] font-mono text-zinc-500 mt-0.5">
                            Campaign Originator: <span className="text-zinc-300 font-bold">{rally.creator}</span>
                          </p>
                        </div>

                        {!hasJoined && (
                          <button
                            onClick={() => setIsJoinModalOpen(true)}
                            className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-red-400 hover:text-red-300 border border-zinc-850 hover:border-red-950/40 rounded-lg text-xs font-mono uppercase font-black tracking-wider transition-all cursor-pointer"
                          >
                            Join Reinforcements
                          </button>
                        )}
                      </div>

                      {/* March Preview Track */}
                      <div className="bg-black/35 rounded-xl p-3 border border-zinc-900 space-y-2 mt-3 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-red-550/5 rounded-full blur-2xl pointer-events-none" />
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block font-bold">
                          March Preview Progress & Collision Timeline:
                        </span>

                        <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                          <span>Assembly coordinates</span>
                          <span className="text-red-400 font-bold animate-pulse">Collision collision in: {rally.timeRemainingSec.toFixed(1)}s</span>
                        </div>

                        {/* Animated March Track Progress */}
                        <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900 relative">
                          <div
                            className="h-full bg-gradient-to-r from-red-650 via-red-500 to-amber-500 transition-all duration-300"
                            style={{ width: `${Math.max(5, Math.min(100, progressWidth))}%` }}
                          />
                        </div>

                        <p className="text-[10px] text-zinc-450 font-sans leading-relaxed">
                          March status: <span className="text-amber-500 font-mono font-bold">IN TRANSIT</span>. Columns are currently moving through coordinate grids, coordinating shield wall overlaps.
                        </p>
                      </div>

                      {/* Participant List Header */}
                      <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-zinc-500 uppercase font-black">
                        <span>Reinforcement Participant Roster:</span>
                        <span className="text-zinc-450 font-bold">Total Strength: <span className="text-emerald-400">{formatNum(totalRallyPower)} CR</span></span>
                      </div>

                      {/* Participants Cards Scroll */}
                      <div className="space-y-2 mt-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-1">
                        {rally.participants.map((part, index) => (
                          <div
                            key={index}
                            className="p-2.5 bg-zinc-950/80 border border-zinc-900 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left"
                          >
                            <div className="space-y-0.5">
                              <span className="text-xs font-bold font-serif text-amber-250 block">
                                {part.name}
                              </span>
                              <div className="flex flex-wrap items-center gap-x-2 text-[10px] text-zinc-450 font-mono">
                                <span>Commander: <span className="text-zinc-300 font-bold">{part.heroName}</span></span>
                                <span>•</span>
                                <span>Infantry: <span className="text-zinc-300 font-bold">{part.infantry.toLocaleString()}</span></span>
                                <span>•</span>
                                <span>Marksmen: <span className="text-zinc-300 font-bold">{part.marksmen.toLocaleString()}</span></span>
                                <span>•</span>
                                <span>Cavalry: <span className="text-zinc-300 font-bold">{part.cavalry.toLocaleString()}</span></span>
                              </div>
                            </div>

                            <div className="font-mono text-xs text-emerald-400 font-black shrink-0 bg-emerald-950/20 px-2.5 py-1 rounded border border-emerald-900/30 text-right sm:text-left self-start sm:self-center">
                              +{formatNum(part.power)} CR
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-900/50 flex justify-between items-center text-[10px] font-mono text-zinc-500 mt-2">
                      <span>Co-op Formation Synergy</span>
                      <span className="text-emerald-400 font-bold bg-emerald-950/10 border border-emerald-900/20 px-1.5 py-0.5 rounded">
                        +10% Formation Buffer Activated
                      </span>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        </div>
      </div>

      {/* CREATE RALLY POPUP/MODAL */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#0b0c10] border border-zinc-900 rounded-2xl w-full max-w-lg p-5 md:p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <div className="flex items-center gap-1.5 text-amber-500">
                  <Swords className="w-5 h-5 text-red-500" />
                  <h4 className="font-serif font-black uppercase tracking-wider text-sm md:text-base text-zinc-100">
                    Mobilize Strategic Rally
                  </h4>
                </div>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="space-y-4 text-left">
                {/* Target Selector */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black block">
                    Choose Target Coordinate Sector:
                  </label>
                  <select
                    value={targetId}
                    onChange={(e) => setTargetId(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-900 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                  >
                    {[
                      { id: 'scourge_wyrm', name: 'Ancient Scourge Wyrm [Lv.40] - Power: 6.5M' },
                      { id: 'titan_golem', name: 'Shattered Titan Golem [Lv.35] - Power: 4.2M' },
                      { id: 'bandit_citadel', name: 'Rogue Sovereign Fortress [Lv.30] - Power: 2.8M' },
                      { id: 'abyssal_beast', name: 'Scylla Abyssal Beast [Lv.25] - Power: 1.9M' }
                    ].map((opt) => (
                      <option key={opt.id} value={opt.id} className="bg-zinc-950 font-mono">
                        {opt.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Timer Options Selector */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black block">
                    Mobilization Assembly Countdown:
                  </label>
                  <select
                    value={timerSec}
                    onChange={(e) => setTimerSec(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-900 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                  >
                    {[
                      { val: 15, label: '15 Seconds (Rapid Coalition Strike)' },
                      { val: 30, label: '30 Seconds (Skirmish Assemble)' },
                      { val: 60, label: '1 Minute (Tactical Regroup)' },
                      { val: 300, label: '5 Minutes (Full Legion Form)' }
                    ].map((opt) => (
                      <option key={opt.val} value={opt.val} className="bg-zinc-950 font-mono">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Hero Selection Selector */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black block">
                    Assign Leader Hero Commander:
                  </label>
                  <select
                    value={selectedHero}
                    onChange={(e) => setSelectedHero(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-900 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                  >
                    {['Maegan [Lv.50]', 'Godot Sage [Lv.45]', 'Kael Vanguard [Lv.40]'].map((hero) => (
                      <option key={hero} value={hero} className="bg-zinc-950 font-mono">
                        {hero}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sliders for Deployed Troops */}
                <div className="bg-black/30 border border-zinc-900 rounded-xl p-3 space-y-3">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-black block">
                    Assign Vanguard Column Troops:
                  </span>

                  {/* Infantry Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-mono text-zinc-400">
                      <span>Infantry Guard (max 45,000)</span>
                      <span className="text-amber-500 font-bold">{infantryCount.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={45000}
                      step={500}
                      value={infantryCount}
                      onChange={(e) => setInfantryCount(Number(e.target.value))}
                      className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  {/* Marksmen Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-mono text-zinc-400">
                      <span>Marksmen Bowmen (max 35,000)</span>
                      <span className="text-amber-500 font-bold">{marksmenCount.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={35000}
                      step={500}
                      value={marksmenCount}
                      onChange={(e) => setMarksmenCount(Number(e.target.value))}
                      className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  {/* Cavalry Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-mono text-zinc-400">
                      <span>Sovereign Cavalry Knights (max 25,000)</span>
                      <span className="text-amber-500 font-bold">{cavalryCount.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={25000}
                      step={500}
                      value={cavalryCount}
                      onChange={(e) => setCavalryCount(Number(e.target.value))}
                      className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                </div>

                {/* Live Power Estimate */}
                <div className="bg-red-950/20 border border-red-900/30 p-3 rounded-xl flex justify-between items-center">
                  <span className="text-[10px] font-mono text-red-400 font-bold uppercase">Estimated vanguard power:</span>
                  <span className="text-emerald-400 font-mono font-black text-sm">
                    {((infantryCount * 8) + (marksmenCount * 10) + (cavalryCount * 12)).toLocaleString()} CR
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 font-mono text-xs uppercase tracking-wider font-bold rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateRally}
                  className="flex-1 py-2.5 bg-gradient-to-r from-red-650 to-red-550 hover:from-red-500 hover:to-red-400 text-white font-mono text-xs uppercase tracking-wider font-black rounded-xl cursor-pointer transition-all active:scale-97"
                >
                  LAUNCH RALLY
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* JOIN RALLY POPUP/MODAL */}
      <AnimatePresence>
        {isJoinModalOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-[#0b0c10] border border-zinc-900 rounded-2xl w-full max-w-md p-5 md:p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <div className="flex items-center gap-1.5 text-red-500">
                  <Shield className="w-5 h-5 text-red-500 animate-pulse" />
                  <h4 className="font-serif font-black uppercase tracking-wider text-sm md:text-base text-zinc-100">
                    Dispatch Reinforcements
                  </h4>
                </div>
                <button
                  onClick={() => setIsJoinModalOpen(false)}
                  className="p-1 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Content */}
              <div className="space-y-4 text-left">
                {/* Hero Selection */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black block">
                    Assign Reinforcement Leader Hero:
                  </label>
                  <select
                    value={joinHero}
                    onChange={(e) => setJoinHero(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-900 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                  >
                    {['Godot Sage [Lv.45]', 'Kael Vanguard [Lv.40]', 'Maegan [Lv.50]'].map((hero) => (
                      <option key={hero} value={hero} className="bg-zinc-950 font-mono">
                        {hero}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sliders for Deployed Troops */}
                <div className="bg-black/30 border border-zinc-900 rounded-xl p-3 space-y-3">
                  <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest font-black block">
                    Assign Reinforcement Column Troops:
                  </span>

                  {/* Infantry Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-mono text-zinc-400">
                      <span>Infantry Guard (max 22,500)</span>
                      <span className="text-amber-500 font-bold">{joinInfantry.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={22500}
                      step={500}
                      value={joinInfantry}
                      onChange={(e) => setJoinInfantry(Number(e.target.value))}
                      className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  {/* Marksmen Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-mono text-zinc-400">
                      <span>Marksmen Bowmen (max 17,500)</span>
                      <span className="text-amber-500 font-bold">{joinMarksmen.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={17500}
                      step={500}
                      value={joinMarksmen}
                      onChange={(e) => setJoinMarksmen(Number(e.target.value))}
                      className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  {/* Cavalry Slider */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[11px] font-mono text-zinc-400">
                      <span>Sovereign Cavalry Knights (max 12,500)</span>
                      <span className="text-amber-500 font-bold">{joinCavalry.toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={12500}
                      step={500}
                      value={joinCavalry}
                      onChange={(e) => setJoinCavalry(Number(e.target.value))}
                      className="w-full h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>
                </div>

                {/* Live Power Estimate */}
                <div className="bg-red-950/20 border border-red-900/30 p-3 rounded-xl flex justify-between items-center">
                  <span className="text-[10px] font-mono text-red-400 font-bold uppercase">Estimated reinforcement power:</span>
                  <span className="text-emerald-400 font-mono font-black text-sm">
                    {((joinInfantry * 8) + (joinMarksmen * 10) + (joinCavalry * 12)).toLocaleString()} CR
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setIsJoinModalOpen(false)}
                  className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 font-mono text-xs uppercase tracking-wider font-bold rounded-xl cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleJoinRally}
                  className="flex-1 py-2.5 bg-gradient-to-r from-red-650 to-red-550 hover:from-red-500 hover:to-red-400 text-white font-mono text-xs uppercase tracking-wider font-black rounded-xl cursor-pointer transition-all active:scale-97"
                >
                  SEND HELP
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SECTION 3: TERRITORY CONTROL COORDINATES RADAR GRID */}
      <div className="bg-gradient-to-r from-[#0b0c10] to-[#07090e] border border-zinc-900 rounded-2xl p-4 space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-zinc-900/60 pb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Map className="w-4 h-4 text-indigo-400" />
              <h3 className="font-serif font-black uppercase text-sm tracking-wide text-zinc-100">
                Alliance Territory Control Grid
              </h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Observe coordinate sector nodes claimed, disputed, or left unclaimed. Command garrisons to increase our global sovereign control mapping.
            </p>
          </div>

          <div className="flex gap-2">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
              <span className="w-2.5 h-2.5 rounded bg-indigo-500 inline-block" />
              <span>Claimed Nodes ({alliance.territoryNodes.filter(n => n.status === 'claimed').length})</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
              <span className="w-2.5 h-2.5 rounded bg-yellow-500 inline-block animate-pulse" />
              <span>Disputed ({alliance.territoryNodes.filter(n => n.status === 'disputed').length})</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
              <span className="w-2.5 h-2.5 rounded bg-zinc-800 inline-block border border-zinc-700" />
              <span>Unclaimed</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Node Coordinates Radar Grid Map */}
          <div className="md:col-span-2 p-3 bg-black/40 border border-zinc-900/80 rounded-xl relative flex justify-center overflow-x-auto">
            {/* Grid display layout */}
            <div className="grid grid-cols-4 gap-2.5 max-w-lg min-w-[340px] w-full py-1">
              {alliance.territoryNodes.map((node) => {
                const isClaimedByMe = node.status === 'claimed';
                const isDisputed = node.status === 'disputed';
                const isSelected = selectedNode?.id === node.id;

                let borderStyle = "border-zinc-850 hover:border-zinc-700";
                let bgStyle = "bg-zinc-950/60 text-zinc-500";
                
                if (isClaimedByMe) {
                  borderStyle = "border-indigo-550/60 hover:border-indigo-400";
                  bgStyle = "bg-indigo-950/20 text-indigo-400";
                } else if (isDisputed) {
                  borderStyle = "border-yellow-600/50 hover:border-yellow-400";
                  bgStyle = "bg-yellow-950/25 text-yellow-500";
                }

                if (isSelected) {
                  borderStyle = "border-amber-500 ring-1 ring-amber-500/40";
                }

                return (
                  <button
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-2.5 rounded-xl border text-center transition-all duration-200 hover:scale-102 flex flex-col items-center justify-center gap-1 cursor-pointer select-none h-[72px] ${bgStyle} ${borderStyle}`}
                  >
                    <span className="text-[10px] font-bold font-serif leading-tight text-white truncate w-full">
                      {node.cityName}
                    </span>
                    <span className="text-[8.5px] font-mono text-zinc-500 uppercase tracking-widest block">
                      Coord: [{node.x}, {node.y}]
                    </span>
                    {isClaimedByMe ? (
                      <span className="text-[8px] font-mono text-indigo-400 font-extrabold tracking-wide uppercase bg-indigo-950/60 p-0.5 px-1.5 rounded border border-indigo-900/40 mt-1">
                        🔒 Secure
                      </span>
                    ) : isDisputed ? (
                      <span className="text-[8px] font-mono text-yellow-400 font-extrabold tracking-wide uppercase bg-yellow-955/60 p-0.5 px-1.5 rounded border border-yellow-900/30 animate-pulse mt-1">
                        ⚠️ Disputed
                      </span>
                    ) : (
                      <span className="text-[8px] font-mono text-zinc-600 uppercase mt-1">
                        Unclaimed
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Node Details Side Console */}
          <div className="bg-[#0a0c12] border border-zinc-900 p-4 rounded-xl space-y-4 min-h-[220px] flex flex-col justify-between">
            {selectedNode ? (
              <>
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-serif font-black uppercase text-zinc-200">
                      Coordinate Detail Room
                    </h4>
                  </div>

                  <div className="space-y-1">
                    <span className="text-sm font-serif font-bold text-white block">
                      {selectedNode.cityName}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-550 block">
                      Grid Coordinate Node: [{selectedNode.x}, {selectedNode.y}]
                    </span>
                  </div>

                  <div className="p-2.5 bg-black/40 border border-zinc-930 rounded-lg text-left space-y-1 font-mono text-[10.5px]">
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Node Standing:</span>
                      <span className={`font-bold ${selectedNode.status === 'claimed' ? 'text-indigo-400' : selectedNode.status === 'disputed' ? 'text-yellow-500' : 'text-zinc-400'}`}>
                        {selectedNode.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-500">Defending Guard CR:</span>
                      <span className="text-amber-500 font-bold">{formatNum(selectedNode.defensePower)} CR</span>
                    </div>
                    {selectedNode.bonusText && (
                      <div className="border-t border-zinc-900/60 pt-1.5 mt-1 text-[10px] text-emerald-400">
                        ⭐ Passive Bonus: {selectedNode.bonusText}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  {selectedNode.status === 'claimed' ? (
                    <button
                      onClick={() => handleRelinquishNode(selectedNode)}
                      className="w-full py-1.5 bg-zinc-905 border border-zinc-900 text-rose-400 hover:bg-rose-950/20 hover:border-rose-900/50 rounded font-mono text-[10.5px] font-bold uppercase cursor-pointer"
                    >
                      Withdraw Defense Garrison
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDeployGarrison(selectedNode)}
                      disabled={playerPower < selectedNode.defensePower * 0.4}
                      className={`w-full py-2 font-mono text-xs font-black uppercase rounded-lg transition-all active:scale-97 cursor-pointer ${
                        playerPower >= selectedNode.defensePower * 0.4
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-lg'
                          : 'bg-zinc-900 text-zinc-650 cursor-not-allowed border border-zinc-900'
                      }`}
                    >
                      {playerPower >= selectedNode.defensePower * 0.4 ? "Deploy Conquest Garrison" : `Insuff. Power (req: ${formatNum(selectedNode.defensePower * 0.4)} CR)`}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-xs font-mono text-zinc-600 italic py-10">
                <Globe className="w-8 h-8 text-zinc-700 mb-2 animate-spin-slow" />
                <span>Click any coordinate sector node on the radar mapping to deploy defensive legions or review tactical buffs.</span>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* SECTION 4: SERVER PUBLIC LEADERBOARD */}
      <div className="bg-[#0b0c11] border border-zinc-900 rounded-2xl p-4 space-y-4">
        
        <div className="flex items-center gap-1.5 border-b border-zinc-900/60 pb-3">
          <Trophy className="w-4 h-4 text-amber-500" />
          <h3 className="font-serif font-black uppercase text-sm tracking-wide text-zinc-100">
            Eternal Server Live Alliance Standings
          </h3>
          <span className="text-[10px] font-mono text-zinc-550 ml-auto select-none uppercase tracking-widest hidden sm:inline-block">
            Single-Server Real-Time Rankings
          </span>
        </div>

        <div className="space-y-2">
          {liveLeaderboard.map((a) => (
            <div
              key={a.name}
              className={`p-2.5 rounded-xl border flex items-center justify-between transition-all duration-200 ${
                a.isPlayerAlliance
                  ? 'bg-amber-950/15 border-amber-500/35 ring-1 ring-amber-500/10'
                  : 'bg-zinc-950 border-zinc-900/70 hover:bg-[#0f1118]/70'
              }`}
            >
              <div className="flex items-center gap-3">
                {/* Ranking Medals color codes */}
                <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-black font-mono shadow-md ${
                  a.rank === 1 ? 'bg-amber-550 text-black' : a.rank === 2 ? 'bg-zinc-300 text-black' : a.rank === 3 ? 'bg-amber-800 text-white' : 'bg-zinc-900 text-zinc-550'
                }`}>
                  {a.rank}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-serif font-black uppercase tracking-wide ${a.isPlayerAlliance ? 'text-amber-300' : 'text-zinc-200'}`}>
                      {a.name} {a.isPlayerAlliance && <span className="text-[9px] font-mono font-bold bg-amber-500 text-black px-1 py-0.5 rounded ml-1">YOURS</span>}
                    </span>
                    <span className="px-1.5 py-0.5 bg-zinc-900 text-zinc-400 border border-zinc-850 font-mono text-[9px] rounded uppercase font-bold shrink-0">
                      Level {a.level}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">
                    Leaderboard Standing • {a.membersCount} Lords Active
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-sm font-mono font-black text-zinc-200 block">
                  {formatNum(a.totalPower)} <span className="text-[9.5px] text-zinc-400 font-bold">CR</span>
                </span>
                <span className="text-[9px] font-mono text-zinc-550">
                  Global power rating
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
