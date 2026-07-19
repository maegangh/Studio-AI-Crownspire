import React, { useState } from 'react';
import { QuestState, Resources, UnitType } from '../types';
import { formatNum } from '../gameData';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  CheckCircle2, 
  Compass, 
  Hammer, 
  Sword, 
  Trophy, 
  BookOpen, 
  Zap,
  ChevronRight,
  ChevronLeft,
  Scroll,
  Sparkles
} from 'lucide-react';

interface QuestLogSidebarProps {
  quests: QuestState;
  castleLevel: number;
  units: UnitType[];
  resources: Resources;
  heroTickets: number;
}

export default function QuestLogSidebar({
  quests,
  castleLevel,
  units,
  resources,
  heroTickets
}: QuestLogSidebarProps) {
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);

  const totalTroopsCount = units.reduce((acc, u) => acc + u.count, 0);

  // Quest 1 calculations
  const q1Percent = Math.min(100, (castleLevel / quests.quest1_target) * 100);
  const q1Completed = castleLevel >= quests.quest1_target;

  // Quest 2 calculations
  const q2Percent = Math.min(100, (totalTroopsCount / quests.quest2_target) * 100);
  const q2Completed = totalTroopsCount >= quests.quest2_target;

  const questList = [
    {
      id: 1,
      title: "Sovereign Keep Expansion",
      desc: `Expand your primary Command Citadel to level ${quests.quest1_target} to validate your dominion.`,
      icon: <Hammer className="w-4 h-4 text-emerald-400" />,
      progress: castleLevel,
      target: quests.quest1_target,
      percent: q1Percent,
      completed: q1Completed,
      rewards: "🌾 +1,500, 🪵 +1,500, 🪨 +1,000, 🪙 +400, 💎 +100"
    },
    {
      id: 2,
      title: "Citadel Garrison Mobilization",
      desc: `Recruit and marshal training pipelines to reach ${quests.quest2_target} aggregate troops.`,
      icon: <Sword className="w-4 h-4 text-amber-500" />,
      progress: totalTroopsCount,
      target: quests.quest2_target,
      percent: q2Percent,
      completed: q2Completed,
      rewards: "🌾 +1,000, 🪵 +1,000, 💎 +150, 🎫 +2 Gacha Draft Tickets"
    }
  ];

  return (
    <>
      {/* Floating trigger button only visible on mobile (below lg) */}
      <button
        id="quest-log-floating-trigger"
        onClick={() => setIsOpenMobile(true)}
        className="lg:hidden fixed bottom-18 right-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black px-3.5 py-2 rounded-full font-bold text-xs uppercase tracking-wider shadow-2xl flex items-center gap-1.5 z-40 border border-amber-400/30 scale-100 active:scale-95 transition-all duration-200"
      >
        <Scroll className="w-3.5 h-3.5" />
        <span>Quest Ledger ({questList.filter(q => q.completed).length})</span>
      </button>

      {/* Main Sidebar Wrapper / overlay */}
      <div 
        className={`lg:w-[320px] lg:h-[820px] shrink-0 lg:flex flex-col bg-[#0b0c10] border border-zinc-900 rounded-[2rem] overflow-hidden shadow-2xl relative transition-all duration-300 ${
          isOpenMobile 
            ? 'fixed inset-x-4 top-[10vh] bottom-[10vh] z-50 flex' 
            : 'hidden lg:flex'
        }`}
      >
        {/* Mobile Header indicator */}
        <div className="bg-[#101217] p-4 border-b border-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Scroll className="w-4 h-4 text-amber-500" />
            <h3 className="font-serif font-black text-sm text-zinc-100 uppercase tracking-widest flex items-center gap-1">
              Sovereign Quest Ledger
            </h3>
          </div>
          
          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 text-[8.5px] font-mono rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 font-bold uppercase tracking-wide flex items-center gap-1">
              <Zap className="w-2.5 h-2.5 fill-current animate-pulse text-emerald-400" /> Auto-Claim Active
            </span>
            {isOpenMobile && (
              <button 
                onClick={() => setIsOpenMobile(false)}
                className="p-1 text-zinc-500 hover:text-white hover:bg-zinc-900 rounded font-mono text-xs ml-1"
              >
                ✕ Close
              </button>
            )}
          </div>
        </div>

        {/* Ledger Scroll body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          <p className="text-[10px] text-zinc-500 leading-relaxed italic">
            "By decree of the Arch-Mage, milestones cleared are automatically claimed, sending reinforcements and materials directly to the Vault."
          </p>

          <div className="space-y-3">
            {questList.map((q) => (
              <div 
                key={q.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  q.completed 
                    ? 'bg-emerald-950/15 border-emerald-500/20 shadow-sm shadow-emerald-950/5' 
                    : 'bg-zinc-950/60 border-zinc-900'
                }`}
              >
                <div className="flex justify-between items-start gap-1">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${q.completed ? 'bg-emerald-950/40 text-emerald-400' : 'bg-zinc-900 text-zinc-400'}`}>
                      {q.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : q.icon}
                    </div>
                    <div>
                      <h4 className="text-[11.5px] font-extrabold text-white leading-tight font-serif">{q.title}</h4>
                      <span className="text-[9px] font-mono text-zinc-500 block">Quest #{q.id} • Active Objective</span>
                    </div>
                  </div>

                  {q.completed ? (
                    <span className="text-[8.5px] font-mono font-bold bg-emerald-500 text-black px-1.5 py-0.5 rounded uppercase animate-pulse">
                      Completed
                    </span>
                  ) : (
                    <span className="text-[8.5px] font-mono text-zinc-400 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-850">
                      In Progress
                    </span>
                  )}
                </div>

                <p className="text-[10px] text-zinc-400 mt-2 leading-relaxed">
                  {q.desc}
                </p>

                {/* Progress bar */}
                <div className="mt-3.5 space-y-1">
                  <div className="flex justify-between text-[9px] font-mono text-zinc-500">
                    <span>Dominion Status</span>
                    <span className={q.completed ? 'text-emerald-400 font-bold' : 'text-zinc-400'}>
                      {q.progress} / {q.target} ({Math.round(q.percent)}%)
                    </span>
                  </div>
                  <div className="w-full bg-zinc-900/60 rounded-full h-1.5 border border-zinc-900 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${q.completed ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${q.percent}%` }}
                    />
                  </div>
                </div>

                {/* Rewards Drawer */}
                <div className="mt-3 p-2 bg-[#08090d] border border-zinc-900/40 rounded-lg">
                  <span className="text-[8.5px] uppercase font-mono text-zinc-550 block mb-1">Instant Completion Spoils:</span>
                  <div className="text-[9.5px] font-mono text-yellow-500/90 font-bold leading-relaxed">
                    {q.rewards}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Stats or Legends section in Sidebar */}
          <div className="bg-[#12141c]/50 border border-zinc-900 rounded-xl p-3 space-y-2">
            <h4 className="text-[10px] font-mono text-zinc-450 uppercase tracking-widest">REALM RECORD SUMMARY</h4>
            <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono text-zinc-400">
              <div className="flex flex-col bg-zinc-950/60 p-1.5 rounded border border-zinc-900">
                <span className="text-zinc-550 text-[8.5px]">KEEP CAP</span>
                <span className="text-white font-bold text-xs mt-0.5">Lvl {castleLevel}</span>
              </div>
              <div className="flex flex-col bg-zinc-950/60 p-1.5 rounded border border-zinc-900">
                <span className="text-zinc-550 text-[8.5px]">TROOP FORCE</span>
                <span className="text-white font-bold text-xs mt-0.5">{totalTroopsCount} soldiers</span>
              </div>
              <div className="flex flex-col bg-zinc-950/60 p-1.5 rounded border border-zinc-900">
                <span className="text-zinc-550 text-[8.5px]">SUMMON TICKETS</span>
                <span className="text-amber-500 font-extrabold text-xs mt-0.5">🎫 {heroTickets}</span>
              </div>
              <div className="flex flex-col bg-zinc-950/60 p-1.5 rounded border border-zinc-900">
                <span className="text-zinc-550 text-[8.5px]">SOVEREIGN POWER</span>
                <span className="text-emerald-400 font-bold text-xs mt-0.5">{formatNum(resources.valor)} Valor</span>
              </div>
            </div>
          </div>
        </div>

        {/* Backdrop overlay only for mobile */}
        {isOpenMobile && (
          <div 
            onClick={() => setIsOpenMobile(false)}
            className="lg:hidden fixed inset-0 bg-black/80 z-30 pointer-events-auto"
          />
        )}
      </div>
    </>
  );
}
