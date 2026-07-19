import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Users, 
  User, 
  Clock, 
  Play, 
  Pause, 
  ChevronRight, 
  Check, 
  Crown, 
  Swords, 
  Award, 
  Tv, 
  MessageSquare, 
  Share2, 
  Flame, 
  ShieldAlert, 
  Sparkle, 
  ChevronLeft, 
  Volume2, 
  Lock, 
  MapPin, 
  Send,
  Sparkles,
  Zap,
  Star,
  Activity,
  UserCheck,
  Undo
} from 'lucide-react';

// ==========================================
// TYPES & MODEL DEFINITIONS
// ==========================================

export interface RankingRow {
  rank: number;
  name: string;
  guild: string;
  kingdom: string;
  score: number;
  detail: string; // e.g. "Floor 45", "1m 12s", "Level 4-5"
  isPlayer?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  current: number;
  target: number;
  points: number;
  badge: string;
  unlocked: boolean;
  claimed: boolean;
}

export interface TournamentMatch {
  id: string;
  player1: string;
  player2: string;
  score1: number;
  score2: number;
  status: 'pending' | 'live' | 'completed';
  round: string;
}

export interface ReplayStep {
  moveNumber: number;
  actionDesc: string;
  matchScore: number;
  boardSnapshot: string[][]; // 5x5 preview
}

export interface AudienceComment {
  id: string;
  username: string;
  comment: string;
  time: string;
  badgeStyle: string;
}

// ==========================================
// SAMPLE DATA SEEDING
// ==========================================

const GLOBAL_RANKINGS: RankingRow[] = [
  { rank: 1, name: "Emperor Theron", guild: "Astral Core", kingdom: "Aethelgard", score: 18500, detail: "Floor 88" },
  { rank: 2, name: "Lady Vespera", guild: "Shadow Vanguard", kingdom: "Ironreach", score: 17200, detail: "Floor 82" },
  { rank: 3, name: "Archmage Kaelthas", guild: "Solar Radiance", kingdom: "Sunspire", score: 16900, detail: "Floor 79" },
  { rank: 4, name: "Oracle Jaina", guild: "Chrono Keepers", kingdom: "Frosthaven", score: 15400, detail: "Floor 74" },
  { rank: 5, name: "Garrick Shield", guild: "Iron Altar", kingdom: "Ironreach", score: 14800, detail: "Floor 70" }
];

const KINGDOM_RANKINGS: RankingRow[] = [
  { rank: 1, name: "Aethelgard Alliance", guild: "High Citadel", kingdom: "Aethelgard", score: 85200, detail: "Regional Sovereignty" },
  { rank: 2, name: "Ironreach Crucible", guild: "Forge Lords", kingdom: "Ironreach", score: 79100, detail: "Regional Sovereignty" },
  { rank: 3, name: "Sunspire Hegemony", guild: "Solar Priests", kingdom: "Sunspire", score: 72400, detail: "Regional Sovereignty" },
  { rank: 4, name: "Frosthaven Council", guild: "Glacial Scribes", kingdom: "Frosthaven", score: 64900, detail: "Regional Sovereignty" }
];

const ALLIANCE_RANKINGS: RankingRow[] = [
  { rank: 1, name: "Astral Core [AST]", guild: "Astral Core", kingdom: "Aethelgard", score: 124500, detail: "Level 15 Citadel" },
  { rank: 2, name: "Shadow Vanguard [SHD]", guild: "Shadow Vanguard", kingdom: "Ironreach", score: 112000, detail: "Level 14 Citadel" },
  { rank: 3, name: "Solar Radiance [SOL]", guild: "Solar Radiance", kingdom: "Sunspire", score: 98400, detail: "Level 13 Citadel" },
  { rank: 4, name: "Chrono Keepers [CLK]", guild: "Chrono Keepers", kingdom: "Frosthaven", score: 85600, detail: "Level 12 Citadel" }
];

const FRIEND_RANKINGS: RankingRow[] = [
  { rank: 1, name: "Guildmate Bryan", guild: "Gilded Sentinels", kingdom: "Aethelgard", score: 4500, detail: "Floor 28" },
  { rank: 2, name: "Paladin Chloe", guild: "Gilded Sentinels", kingdom: "Aethelgard", score: 3950, detail: "Floor 24" },
  { rank: 3, name: "Scout Derrick", guild: "Iron Watch", kingdom: "Ironreach", score: 2800, detail: "Floor 18" }
];

const SPEEDRUN_RANKINGS: RankingRow[] = [
  { rank: 1, name: "Flash Chronos", guild: "Chrono Keepers", kingdom: "Frosthaven", score: 37, detail: "0m 37s (Level 1-5)" },
  { rank: 2, name: "Speedy Rogue", guild: "Shadow Vanguard", kingdom: "Ironreach", score: 44, detail: "0m 44s (Level 1-5)" },
  { rank: 3, name: "Wizard Whiz", guild: "Solar Radiance", kingdom: "Sunspire", score: 52, detail: "0m 52s (Level 1-5)" }
];

const ENDLESS_FLOOR_RANKINGS: RankingRow[] = [
  { rank: 1, name: "Monolith Master", guild: "Iron Altar", kingdom: "Ironreach", score: 92, detail: "Floor 92" },
  { rank: 2, name: "Aethelgard Hero", guild: "High Citadel", kingdom: "Aethelgard", score: 85, detail: "Floor 85" },
  { rank: 3, name: "Nebula Walker", guild: "Astral Core", kingdom: "Aethelgard", score: 81, detail: "Floor 81" }
];

// Replay steps database
const SAMPLE_REPLAY_RUN: ReplayStep[] = [
  {
    moveNumber: 1,
    actionDesc: "Exchanged Glacial Frost (2,3) with Solar Fire (3,3). Activated x2 combo cascade.",
    matchScore: 300,
    boardSnapshot: [
      ['🔥', '❄️', '🌿', '⭐', '💎'],
      ['❄️', '⭐', '🔥', '🌿', '🧪'],
      ['🌿', '🧪', '❄️', '🔥', '⭐'],
      ['🔥', '💎', '🧪', '❄️', '🌿'],
      ['⭐', '🔥', '🌿', '💎', '🧪']
    ]
  },
  {
    moveNumber: 2,
    actionDesc: "Matched 4 Astral Stars horizontally. Triggered Astral shockwave clearing 4 adjacent runes.",
    matchScore: 850,
    boardSnapshot: [
      ['🔥', '❄️', '🌿', '🧪', '💎'],
      ['❄️', '💎', '🔥', '🌿', '🧪'],
      ['🌿', '🧪', '✨', '✨', '✨'],
      ['🔥', '💎', '🧪', '❄️', '🌿'],
      ['⭐', '🔥', '🌿', '💎', '🧪']
    ]
  },
  {
    moveNumber: 3,
    actionDesc: "Cleared Iron Chains from Obsidian Core (4,1). Unlocked hidden cascade of growth vines.",
    matchScore: 1600,
    boardSnapshot: [
      ['🔥', '❄️', '🧪', '⭐', '💎'],
      ['❄️', '⭐', '🔥', '🌿', '🧪'],
      ['🌿', '🧪', '❄️', '🔥', '⭐'],
      ['✨', '✨', '✨', '✨', '✨'],
      ['⭐', '🔥', '🌿', '💎', '🧪']
    ]
  },
  {
    moveNumber: 4,
    actionDesc: "Combo Finish! Swapped Elixir Pure (0,1) with Frost (0,2). Scored final clear sequence.",
    matchScore: 2450,
    boardSnapshot: [
      ['✨', '✨', '✨', '✨', '✨'],
      ['❄️', '⭐', '🔥', '🌿', '🧪'],
      ['🌿', '🧪', '❄️', '🔥', '⭐'],
      ['🔥', '💎', '🧪', '❄️', '🌿'],
      ['⭐', '🔥', '🌿', '💎', '🧪']
    ]
  }
];

// Audience comments feed
const INITIAL_COMMENTS: AudienceComment[] = [
  { id: "c1", username: "Knight_Aethel", comment: "Sovereign Lord is playing out of his mind!", time: "12:15 PM", badgeStyle: "text-amber-400 bg-amber-950/40 border-amber-900" },
  { id: "c2", username: "FoxyPuzzler", comment: "That diagonal match was insane foresight.", time: "12:16 PM", badgeStyle: "text-indigo-400 bg-indigo-950/40 border-indigo-900" },
  { id: "c3", username: "GuildScribe", comment: "Wait, look at his multiplier cascade! x5 incoming!", time: "12:16 PM", badgeStyle: "text-emerald-400 bg-emerald-950/40 border-emerald-900" },
  { id: "c4", username: "VoidVoyager", comment: "Does anyone know his focus research level? 40+?", time: "12:17 PM", badgeStyle: "text-zinc-400 bg-zinc-900/40 border-zinc-800" }
];

// Tournament Seeds
const WEEKLY_TOURNAMENT_MATCHES: TournamentMatch[] = [
  { id: "tm1", player1: "Your Guardian (You)", player2: "Paladin Chloe", score1: 1850, score2: 1320, status: 'completed', round: 'Quarterfinals' },
  { id: "tm2", player1: "Archmage Kaelthas", player2: "Garrick Shield", score1: 2400, score2: 2150, status: 'completed', round: 'Quarterfinals' },
  { id: "tm3", player1: "Your Guardian (You)", player2: "Archmage Kaelthas", score1: 0, score2: 0, status: 'pending', round: 'Semifinals' },
  { id: "tm4", player1: "Emperor Theron", player2: "Lady Vespera", score1: 0, score2: 0, status: 'live', round: 'Semifinals' }
];

// Achievements Seeds
const INITIAL_ACHIEVEMENTS = (): Achievement[] => [
  { id: "ac_combo", title: "Combo Mastermind", description: "Reach a peak match multiplier of x4 in standard levels.", current: 2, target: 4, points: 50, badge: "⚡ Multiplier Core", unlocked: false, claimed: false },
  { id: "ac_endless", title: "Endless Crusader", description: "Reach Endless Vault Floor 25.", current: 12, target: 25, points: 100, badge: "🏰 Monolith Plate", unlocked: false, claimed: false },
  { id: "ac_arena", title: "Vanguard Gladiator", description: "Conquer 10 different Arena AI Rivals.", current: 4, target: 10, points: 75, badge: "🛡️ Golden Shield", unlocked: false, claimed: false },
  { id: "ac_beast", title: "Sovereign Hunter", description: "Dealt 30,000 cumulative damage in Beast Trials.", current: 15400, target: 30000, points: 150, badge: "🐉 Drake Claw", unlocked: false, claimed: false },
  { id: "ac_signets", title: "Wealthy Purifier", description: "Amass a total of 500 Altar Signets.", current: 280, target: 500, points: 60, badge: "⭐ Signet Gilt", unlocked: false, claimed: false }
];

// Unlocked cosmetic titles
interface ProfileTitle {
  title: string;
  rarity: 'common' | 'rare' | 'legendary';
  style: string;
  requirement: string;
}

const PROFILE_TITLES: ProfileTitle[] = [
  { title: "Vault Sentinel", rarity: 'common', style: "text-zinc-400 bg-zinc-950 border-zinc-900", requirement: "Unlocked by default" },
  { title: "Chronological Prodigy", rarity: 'rare', style: "text-cyan-400 bg-cyan-950/20 border-cyan-800", requirement: "Achieve a x4 Combo cascade" },
  { title: "Brimstone Shatterer", rarity: 'legendary', style: "text-rose-400 bg-rose-950/30 border-rose-800 animate-pulse", requirement: "Defeat Pyre-Lord Ignis on Heroic" },
  { title: "Citadel Grandmaster", rarity: 'legendary', style: "text-amber-400 bg-amber-950/30 border-amber-800 animate-bounce", requirement: "Unlock all achievements" }
];

// Badges list
interface ProfileBadge {
  id: string;
  name: string;
  icon: string;
  desc: string;
  color: string;
}

const PROFILE_BADGES: ProfileBadge[] = [
  { id: "b_valor", name: "Valor Seal", icon: "🔥", desc: "For extreme aggressive play", color: "border-red-900 text-red-400 bg-red-950/20" },
  { id: "b_chrono", name: "Temporal Crest", icon: "⌛", desc: "Exquisite undo foresight", color: "border-cyan-900 text-cyan-400 bg-cyan-950/20" },
  { id: "b_sage", name: "Siphon Scholar", icon: "🌿", desc: "Matched 5,000 total tiles", color: "border-emerald-900 text-emerald-400 bg-emerald-950/20" },
  { id: "b_champion", name: "Crown Champion", icon: "👑", desc: "Completed S1 Convergence Tab", color: "border-amber-900 text-amber-400 bg-amber-950/20" }
];

interface CrystalVaultSocialCompetitiveTabProps {
  resources: any;
  addLog: (msg: string, type: 'info' | 'success' | 'warning' | 'combat') => void;
}

export default function CrystalVaultSocialCompetitiveTab({ resources, addLog }: CrystalVaultSocialCompetitiveTabProps) {
  // Navigation tabs: 'rankings' | 'tournaments' | 'theater' | 'profile' | 'fame'
  const [activeTab, setActiveTab] = useState<'rankings' | 'tournaments' | 'theater' | 'profile' | 'fame'>('rankings');

  // Audio Cue Simulation
  const triggerAudioEffect = (cue: string) => {
    addLog(`🔊 Competitive Sound Cue: "${cue}"`, 'info');
  };

  // State Management
  const [rankingFilter, setRankingFilter] = useState<'global' | 'kingdom' | 'alliance' | 'friends' | 'speedrun' | 'endless'>('global');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [currentTitle, setCurrentTitle] = useState<string>("Vault Sentinel");
  const [currentBadge, setCurrentBadge] = useState<string>("b_valor");
  const [bracketMatches, setBracketMatches] = useState<TournamentMatch[]>(WEEKLY_TOURNAMENT_MATCHES);
  
  // Replay Theater States
  const [isPlayingReplay, setIsPlayingReplay] = useState<boolean>(false);
  const [replayStepIndex, setReplayStepIndex] = useState<number>(0);
  const [activeReplayStep, setActiveReplayStep] = useState<ReplayStep>(SAMPLE_REPLAY_RUN[0]);

  // Spectator mode live-running States
  const [isSpectating, setIsSpectating] = useState<boolean>(false);
  const [spectatorBoard, setSpectatorBoard] = useState<string[][]>(SAMPLE_REPLAY_RUN[0].boardSnapshot);
  const [spectatorComments, setSpectatorComments] = useState<AudienceComment[]>(INITIAL_COMMENTS);
  const [chatMessage, setChatMessage] = useState<string>("");
  const spectatorTimerRef = useRef<any>(null);

  // Stats for custom SVG visualization
  const [historicMonthlyPoints, setHistoricMonthlyPoints] = useState<number[]>([210, 450, 780, 1100, 1540, 2450]);

  // Load / Save Persistent profiles
  useEffect(() => {
    const saved = localStorage.getItem('crownspire_social_competitive_v1');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAchievements(parsed.achievements ?? INITIAL_ACHIEVEMENTS());
        setCurrentTitle(parsed.currentTitle ?? "Vault Sentinel");
        setCurrentBadge(parsed.currentBadge ?? "b_valor");
        setBracketMatches(parsed.bracketMatches ?? WEEKLY_TOURNAMENT_MATCHES);
        setHistoricMonthlyPoints(parsed.historicMonthlyPoints ?? [210, 450, 780, 1100, 1540, 2450]);
      } catch (e) {
        initDefaultStates();
      }
    } else {
      initDefaultStates();
    }
  }, []);

  const initDefaultStates = () => {
    setAchievements(INITIAL_ACHIEVEMENTS());
    setCurrentTitle("Vault Sentinel");
    setCurrentBadge("b_valor");
    setBracketMatches(WEEKLY_TOURNAMENT_MATCHES);
    setHistoricMonthlyPoints([210, 450, 780, 1100, 1540, 2450]);
  };

  const commitChanges = (updates: any) => {
    const payload = {
      achievements: updates.achievements ?? achievements,
      currentTitle: updates.currentTitle ?? currentTitle,
      currentBadge: updates.currentBadge ?? currentBadge,
      bracketMatches: updates.bracketMatches ?? bracketMatches,
      historicMonthlyPoints: updates.historicMonthlyPoints ?? historicMonthlyPoints
    };
    localStorage.setItem('crownspire_social_competitive_v1', JSON.stringify(payload));
  };

  // Replay Auto Player Engine
  useEffect(() => {
    let interval: any = null;
    if (isPlayingReplay) {
      interval = setInterval(() => {
        setReplayStepIndex(prev => {
          const next = (prev + 1) % SAMPLE_REPLAY_RUN.length;
          setActiveReplayStep(SAMPLE_REPLAY_RUN[next]);
          triggerAudioEffect("replay_tick_cascade");
          return next;
        });
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isPlayingReplay]);

  // Spectator Simulation Tick
  useEffect(() => {
    if (isSpectating) {
      spectatorTimerRef.current = setInterval(() => {
        // Randomly rearrange the spectator board to simulate live play
        const emojis = ['🔥', '❄️', '🌿', '⭐', '💎', '🧪', '✨'];
        const newBoard = Array.from({ length: 5 }, () => 
          Array.from({ length: 5 }, () => emojis[Math.floor(Math.random() * emojis.length)])
        );
        setSpectatorBoard(newBoard);
        triggerAudioEffect("spectator_cascade_boom");

        // Append a random live audience comment
        const users = ["Xenon_Sage", "Valorous_Knight", "PuzzlePrincess", "CrownSpireGamer", "AethelgardLegend"];
        const texts = [
          "WOAH! Did you see that clean clear?",
          "He's aiming for a full sweep on layer 2!",
          "Unreal. This is definitely going in the weekly highlights.",
          "Let's goooo! Gilded Sentinel team represent!",
          "Calculated cascade. Incredible skill."
        ];
        const commentsStyles = [
          "text-rose-400 bg-rose-950/40 border-rose-900",
          "text-cyan-400 bg-cyan-950/20 border-cyan-800",
          "text-amber-400 bg-amber-950/30 border-amber-800",
          "text-violet-400 bg-violet-950/30 border-violet-800",
          "text-emerald-400 bg-emerald-950/40 border-emerald-900"
        ];
        const idx = Math.floor(Math.random() * users.length);
        const newComment: AudienceComment = {
          id: `comment_sim_${Date.now()}`,
          username: users[idx],
          comment: texts[Math.floor(Math.random() * texts.length)],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          badgeStyle: commentsStyles[idx]
        };

        setSpectatorComments(prev => [...prev.slice(-8), newComment]);
      }, 4000);
    } else {
      clearInterval(spectatorTimerRef.current);
    }
    return () => clearInterval(spectatorTimerRef.current);
  }, [isSpectating]);

  // Submit live spectator chat message
  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userComment: AudienceComment = {
      id: `user_comment_${Date.now()}`,
      username: "Your Guardian (You)",
      comment: chatMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      badgeStyle: "text-amber-300 bg-amber-950/60 border-amber-500 font-bold"
    };

    setSpectatorComments(prev => [...prev, userComment]);
    setChatMessage("");
    triggerAudioEffect("chat_sent");
    addLog(`💬 Spectator Chat Sent: "${chatMessage}"`, 'info');
  };

  // Simulating Bracket Completion
  const simulateMyBracketMatch = (matchId: string) => {
    const nextMatches = bracketMatches.map(match => {
      if (match.id === matchId && match.status === 'pending') {
        const myScore = 2100 + Math.floor(Math.random() * 500);
        const oppScore = 1800 + Math.floor(Math.random() * 400);
        addLog(`⚔️ WEEKLY CHAMPIONSHIP MATCH RESOLVED: You deal ${myScore} damage against Archmage Kaelthas (${oppScore})!`, 'success');
        triggerAudioEffect("bracket_match_victory");
        return {
          ...match,
          score1: myScore,
          score2: oppScore,
          status: 'completed' as const
        };
      }
      return match;
    });

    setBracketMatches(nextMatches);
    commitChanges({ bracketMatches: nextMatches });
  };

  // Claim Achievement Points & Rewards
  const claimAchievementReward = (acId: string) => {
    const idx = achievements.findIndex(a => a.id === acId);
    if (idx === -1 || achievements[idx].claimed || achievements[idx].current < achievements[idx].target) return;

    const updated = [...achievements];
    updated[idx].claimed = true;
    setAchievements(updated);

    // Increase stats
    const updatedPoints = [...historicMonthlyPoints];
    updatedPoints[updatedPoints.length - 1] += updated[idx].points;
    setHistoricMonthlyPoints(updatedPoints);

    addLog(`🏆 ACHIEVEMENT SECURED: "${updated[idx].title}" claimed! Earned +${updated[idx].points} points & unlocked: ${updated[idx].badge}`, 'success');
    triggerAudioEffect("achievement_shatter_fanfare");

    commitChanges({
      achievements: updated,
      historicMonthlyPoints: updatedPoints
    });
  };

  // Progress achievements for testing
  const simProgressAchievements = () => {
    const updated = achievements.map(ac => {
      if (!ac.claimed) {
        const increment = Math.ceil((ac.target - ac.current) / 2);
        const nextVal = Math.min(ac.target, ac.current + increment);
        const unlocked = nextVal >= ac.target;
        return {
          ...ac,
          current: nextVal,
          unlocked
        };
      }
      return ac;
    });
    setAchievements(updated);
    addLog("⚙️ Achievements development progress simulation completed.", "success");
    triggerAudioEffect("simulation_spark");
    commitChanges({ achievements: updated });
  };

  // Selected filter list generator
  const getSelectedRankings = (): RankingRow[] => {
    switch (rankingFilter) {
      case 'global': return GLOBAL_RANKINGS;
      case 'kingdom': return KINGDOM_RANKINGS;
      case 'alliance': return ALLIANCE_RANKINGS;
      case 'friends': return FRIEND_RANKINGS;
      case 'speedrun': return SPEEDRUN_RANKINGS;
      case 'endless': return ENDLESS_FLOOR_RANKINGS;
      default: return GLOBAL_RANKINGS;
    }
  };

  const getRarityBadgeColor = (rarity: string) => {
    if (rarity === 'legendary') return 'border-amber-500/40 text-amber-400 bg-amber-950/20';
    if (rarity === 'rare') return 'border-cyan-500/40 text-cyan-400 bg-cyan-950/20';
    return 'border-zinc-800 text-zinc-400 bg-zinc-950';
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#020204] text-zinc-100 p-1 md:p-3 select-none">
      
      {/* SOCIAL COMPETITIVE HUB HEADER */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-purple-950/20 border border-purple-950/40 rounded-2xl p-4 flex flex-col xl:flex-row items-center justify-between gap-4 mb-4 select-none">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-purple-950/40 border border-purple-500/40 rounded-2xl flex items-center justify-center text-purple-400 shadow-xl relative animate-pulse">
            <Trophy className="w-6 h-6 text-purple-300" />
            <div className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 bg-yellow-500 rounded-full flex items-center justify-center text-[8px] font-black font-mono text-black">
              LIVE
            </div>
          </div>
          <div className="text-left">
            <span className="text-[8.5px] font-mono uppercase tracking-wider text-purple-400 font-black block">Citadel Arena League</span>
            <h2 className="text-base font-serif font-black uppercase text-zinc-100 tracking-wider">Social & Competitive Arena</h2>
            <p className="text-[9.5px] font-mono text-zinc-400 mt-0.5 max-w-sm leading-tight">
              Review global leaderboards, spectate active matches, play saved replays, or claim milestone achievements.
            </p>
          </div>
        </div>

        {/* Dynamic player status stats overview */}
        <div className="flex items-center gap-4 bg-zinc-950/80 border border-zinc-900 p-1.5 rounded-xl">
          <div className="text-left px-3 border-r border-zinc-900/50">
            <span className="text-[7.5px] text-zinc-550 block uppercase font-black">ACTIVE TITLE</span>
            <span className="text-[10px] font-mono font-bold text-amber-400 block truncate max-w-[120px]">{currentTitle}</span>
          </div>
          <div className="text-left px-3 border-r border-zinc-900/50">
            <span className="text-[7.5px] text-zinc-550 block uppercase font-black">BADGE</span>
            <span className="text-[10px] font-mono font-bold text-indigo-400 block">
              {PROFILE_BADGES.find(b => b.id === currentBadge)?.name || "Valor Seal"}
            </span>
          </div>
          <div className="text-left px-3">
            <span className="text-[7.5px] text-zinc-550 block uppercase font-black">SOLO POWER</span>
            <span className="text-[10px] font-mono font-black text-emerald-400 block">3,450 PTS</span>
          </div>
        </div>
      </div>

      {/* CORE NAVIGATION TABS */}
      <div className="flex items-center gap-1.5 overflow-x-auto bg-zinc-950/50 p-1.5 border border-zinc-900/80 rounded-xl mb-4">
        {[
          { id: 'rankings', label: 'Leaderboard Hub', icon: Trophy },
          { id: 'tournaments', label: 'Tournaments & Leagues', icon: Swords },
          { id: 'theater', label: 'Replays & Live Spectating', icon: Tv },
          { id: 'profile', label: 'Guardian Progression & Stats', icon: User },
          { id: 'fame', label: 'Hall of Fame Monuments', icon: Crown }
        ].map(tab => {
          const IconComponent = tab.icon;
          const isTabActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); triggerAudioEffect("nav_click"); }}
              className={`px-3 py-1.5 rounded-lg border font-mono text-[9px] font-black uppercase cursor-pointer active:scale-95 transition-all flex items-center gap-1 shrink-0 ${
                isTabActive 
                  ? 'bg-purple-950/40 border-purple-500 text-purple-300' 
                  : 'bg-zinc-950 border-zinc-900/60 text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <IconComponent className="w-3.5 h-3.5 text-purple-400" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TABS WINDOW CONTAINER */}
      <div className="flex-1 min-h-0 relative">
        <AnimatePresence mode="wait">
          
          {/* ==========================================
              SUB-SCREEN 1: THE LEADERBOARD HUB
              ========================================== */}
          {activeTab === 'rankings' && (
            <motion.div
              key="rankings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute inset-0 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-y-auto pr-1"
            >
              {/* FILTER BAR ON LEFT GRID (3/12) */}
              <div className="lg:col-span-3 flex flex-col gap-2 text-left">
                <span className="text-[8px] text-zinc-550 uppercase font-black tracking-wider block mb-1">Rankings Category</span>
                
                {[
                  { id: 'global', label: '🌐 Global Standings', desc: 'Top individual scores' },
                  { id: 'kingdom', label: '🏰 Kingdom Influence', desc: 'Regional power centers' },
                  { id: 'alliance', label: '🛡️ Alliance Citadels', desc: 'Total guild performance' },
                  { id: 'friends', label: '👥 Friend Rankings', desc: 'Your custom social group' },
                  { id: 'speedrun', label: '⚡ Speedrun Completion', desc: 'Fastest puzzle clears' },
                  { id: 'endless', label: '🗼 Endless Floor records', desc: 'Deepest floor reach' }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => { setRankingFilter(filter.id as any); triggerAudioEffect("filter_change"); }}
                    className={`p-2.5 rounded-xl border text-left font-mono transition-all cursor-pointer ${
                      rankingFilter === filter.id 
                        ? 'bg-purple-950/30 border-purple-500 text-purple-300' 
                        : 'bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-zinc-400'
                    }`}
                  >
                    <span className="text-[10px] font-black block uppercase tracking-wider">{filter.label}</span>
                    <span className="text-[8px] text-zinc-550 block mt-0.5 font-normal">{filter.desc}</span>
                  </button>
                ))}
              </div>

              {/* DYNAMIC LEADERBOARD TABLES (9/12) */}
              <div className="lg:col-span-9 bg-zinc-950/60 border border-zinc-900 rounded-2xl p-4 text-left flex flex-col">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Trophy className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-serif font-black uppercase text-zinc-100 tracking-wider">
                      {rankingFilter.toUpperCase()} LEADERBOARD
                    </span>
                  </div>
                  <span className="text-[8px] font-mono bg-purple-950/40 border border-purple-900 text-purple-300 px-1.5 py-0.5 rounded">
                    REFRESHED LIVE: SECS AGO
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 max-h-[400px]">
                  {/* Player Row inserted dynamically */}
                  <div className="p-3 bg-indigo-950/15 border border-indigo-500/30 rounded-xl flex items-center justify-between font-mono text-[10px] shadow-sm relative">
                    <div className="absolute top-0 right-0 w-2 h-2 bg-indigo-500 rounded-full m-1.5 animate-ping" />
                    <div className="flex items-center gap-3">
                      <span className="text-indigo-400 font-black text-sm">#24</span>
                      <div>
                        <span className="text-zinc-100 font-bold block">Your Guardian (You)</span>
                        <span className="text-[8.5px] text-zinc-500 block uppercase">Guild: Gilded Sentinels | Kingdom: Aethelgard</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-zinc-100 font-black text-xs block">3,450 PTS</span>
                      <span className="text-[8px] text-indigo-400 block font-bold uppercase">
                        {rankingFilter === 'speedrun' ? '0m 58s' : rankingFilter === 'endless' ? 'Floor 28' : 'Elite Class'}
                      </span>
                    </div>
                  </div>

                  <div className="h-[1px] bg-zinc-900 my-2" />

                  {getSelectedRankings().map((row, idx) => (
                    <div 
                      key={idx}
                      className="p-2.5 bg-zinc-950 border border-zinc-900 rounded-xl flex items-center justify-between font-mono text-[9.5px] hover:border-zinc-800 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-6 text-center font-black text-sm ${
                          row.rank === 1 ? 'text-amber-400' : row.rank === 2 ? 'text-zinc-300' : row.rank === 3 ? 'text-amber-600' : 'text-zinc-550'
                        }`}>
                          #{row.rank}
                        </span>
                        <div>
                          <span className="text-zinc-100 font-bold block">{row.name}</span>
                          <span className="text-[8px] text-zinc-550 block uppercase">
                            Guild: {row.guild} | Kingdom: {row.kingdom}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-zinc-100 font-black block">{row.score.toLocaleString()} PTS</span>
                        <span className="text-[8px] text-zinc-550 block uppercase">{row.detail}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ==========================================
              SUB-SCREEN 2: TOURNAMENTS & CHAMPIONSHIPS
              ========================================== */}
          {activeTab === 'tournaments' && (
            <motion.div
              key="tournaments"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute inset-0 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-y-auto pr-1"
            >
              {/* TOURNAMENT BRACKETS LEFT GRID (7/12) */}
              <div className="lg:col-span-7 flex flex-col gap-4 text-left">
                
                <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-4">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Swords className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-serif font-black uppercase text-zinc-100 tracking-wider">Weekly Arena Bracket</span>
                    </div>
                    <span className="text-[8px] font-mono bg-purple-950/40 border border-purple-900 text-purple-300 px-1.5 py-0.5 rounded uppercase">
                      Round of 8 Active
                    </span>
                  </div>

                  <p className="text-[10px] text-zinc-400 mb-4">
                    Clash inside the weekly tournament to claim ultimate crystal prizes. Click "Simulate Match" to resolve pending bracket trials dynamically.
                  </p>

                  <div className="space-y-3">
                    {bracketMatches.map((match) => (
                      <div 
                        key={match.id}
                        className={`p-3 rounded-xl border font-mono text-[9.5px] flex items-center justify-between transition-all ${
                          match.status === 'live' 
                            ? 'bg-purple-950/10 border-purple-500 animate-pulse' 
                            : match.status === 'completed'
                              ? 'bg-zinc-950 border-zinc-900 opacity-85'
                              : 'bg-zinc-950 border-zinc-900 border-dashed'
                        }`}
                      >
                        <div className="text-left space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[8px] text-zinc-550 uppercase font-black tracking-tight">{match.round}</span>
                            {match.status === 'live' && (
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
                            )}
                          </div>
                          
                          {/* Players names and scores */}
                          <div className="space-y-1.5 mt-1">
                            <div className="flex items-center gap-2">
                              <span className="text-zinc-400 w-32 truncate">{match.player1}</span>
                              {match.status === 'completed' && (
                                <strong className={`font-mono font-black ${match.score1 > match.score2 ? 'text-emerald-400' : 'text-zinc-600'}`}>
                                  {match.score1}
                                </strong>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-zinc-400 w-32 truncate">{match.player2}</span>
                              {match.status === 'completed' && (
                                <strong className={`font-mono font-black ${match.score2 > match.score1 ? 'text-emerald-400' : 'text-zinc-600'}`}>
                                  {match.score2}
                                </strong>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Button action */}
                        <div>
                          {match.status === 'pending' ? (
                            <button
                              onClick={() => simulateMyBracketMatch(match.id)}
                              className="px-2.5 py-1.5 bg-purple-900 hover:bg-purple-800 text-white rounded font-mono text-[8px] font-black uppercase cursor-pointer"
                            >
                              ⚔️ Simulate Match
                            </button>
                          ) : match.status === 'live' ? (
                            <span className="text-[8.5px] font-mono font-bold text-red-400 bg-red-950/20 border border-red-900 px-2 py-0.5 rounded">
                              LIVE SPECTATING
                            </span>
                          ) : (
                            <span className="text-[8px] font-mono text-zinc-500 uppercase">
                              Concluded
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* OTHER LEAGUES RIGHT GRID (5/12) */}
              <div className="lg:col-span-5 flex flex-col gap-4 text-left">
                
                {/* TOURNAMENT CLASSIFICATION PANEL */}
                <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3 border-b border-zinc-900 pb-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-serif font-black uppercase tracking-wider text-zinc-100">Leagues & Championships schedule</span>
                  </div>

                  <p className="text-[10px] text-zinc-400 mb-4 leading-relaxed">
                    Siphon crowns are distributed at the conclusion of monthly and season championship cycles. Top guilds secure permanent bragging rights in the Hall of Fame.
                  </p>

                  <div className="space-y-2 font-mono text-[9.5px]">
                    <div className="p-2.5 bg-zinc-950 border border-zinc-900 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-zinc-200 font-bold block">Weekly Crownspire Cup</span>
                        <span className="text-[8px] text-zinc-550">Runs every Monday - Sunday</span>
                      </div>
                      <span className="text-amber-400 font-black uppercase">ACTIVE</span>
                    </div>

                    <div className="p-2.5 bg-zinc-950 border border-zinc-900 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-zinc-200 font-bold block">Monthly Siphon Championship</span>
                        <span className="text-[8px] text-zinc-550">Starts in: 12 days</span>
                      </div>
                      <span className="text-zinc-500 font-bold uppercase">REGISTERED</span>
                    </div>

                    <div className="p-2.5 bg-zinc-950 border border-zinc-900 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-zinc-200 font-bold block">Season I: Altar Genesis Finals</span>
                        <span className="text-[8px] text-zinc-550">August 2026 Season End</span>
                      </div>
                      <span className="text-zinc-500 font-bold uppercase">PRE-QUALIFIED</span>
                    </div>

                    <div className="p-2.5 bg-zinc-950 border border-zinc-900 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-zinc-200 font-bold block">Alliance Guild Cup</span>
                        <span className="text-[8px] text-zinc-550">Cooperative guild score race</span>
                      </div>
                      <span className="text-emerald-400 font-black uppercase">ACTIVE</span>
                    </div>
                  </div>
                </div>

                {/* ALLIANCE COMPETITION BOX */}
                <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-indigo-950/10 border border-indigo-950/30 rounded-2xl p-4">
                  <span className="text-[8px] font-mono bg-indigo-950/50 border border-indigo-900 text-indigo-300 px-1.5 py-0.5 rounded uppercase font-bold">
                    Alliance Competition Live
                  </span>
                  <h4 className="text-sm font-serif font-black uppercase text-zinc-100 mt-2">GILDED SENTINEL CLAN RAID</h4>
                  <p className="text-[9.5px] font-mono text-zinc-400 mt-1 leading-relaxed">
                    Our alliance currently ranks **#4** in the weekly Citadel cooperation event. Contribute points inside the Convergence Altar to push the guild past the "Shadow Vanguard" barrier.
                  </p>
                  
                  <div className="w-full bg-zinc-950 border border-zinc-900 rounded-lg p-2.5 mt-3 text-[9px] font-mono">
                    <div className="flex justify-between text-zinc-550 mb-1">
                      <span>GUILD COOPERATIVE PROGRESS:</span>
                      <span className="text-indigo-400">7,400 / 10,000 PTS</span>
                    </div>
                    <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: '74%' }} />
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* ==========================================
              SUB-SCREEN 3: REPLAYS & SPECTATOR MODE
              ========================================== */}
          {activeTab === 'theater' && (
            <motion.div
              key="theater"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute inset-0 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-y-auto pr-1"
            >
              {/* REPLAY VIEWER LEFT GRID (7/12) */}
              <div className="lg:col-span-7 flex flex-col gap-4 text-left">
                
                <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-4">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Tv className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-serif font-black uppercase text-zinc-100 tracking-wider">
                        {isSpectating ? '🔴 LIVE SPECTATING: Sovereign Run' : '🎬 INTERACTIVE REPLAY THEATER'}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => {
                        setIsSpectating(!isSpectating);
                        setIsPlayingReplay(false);
                        triggerAudioEffect("mode_toggle");
                        addLog(isSpectating ? "🎬 Exited spectator mode, loading replay viewer." : "🔴 Entered live spectating arena.", "info");
                      }}
                      className="px-2 py-0.5 border border-cyan-900 hover:border-cyan-500 text-cyan-400 rounded font-mono text-[8px] font-bold uppercase transition-all cursor-pointer"
                    >
                      {isSpectating ? 'Switch to Replay' : 'Go Spectate Live'}
                    </button>
                  </div>

                  <p className="text-[10px] text-zinc-400 mb-4">
                    {isSpectating 
                      ? 'Watching Emperor Theron clear simulated layers in real-time. Feel free to join the live spectator chat!' 
                      : 'Step through an exclusive saved high-score match-3 run. Study tile placements and multiplier triggers.'
                    }
                  </p>

                  {/* VISUAL GAME BOARD SNAPSHOT */}
                  <div className="flex flex-col items-center justify-center p-4 bg-black/60 border border-zinc-900 rounded-xl mb-4 relative overflow-hidden">
                    
                    <div className="grid grid-cols-5 gap-1.5 bg-zinc-950 p-2 rounded-xl border border-zinc-900 relative">
                      {(isSpectating ? spectatorBoard : activeReplayStep.boardSnapshot).map((row, rIdx) => 
                        row.map((cell, cIdx) => (
                          <div 
                            key={`${rIdx}-${cIdx}`}
                            className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-center justify-center text-lg shadow-inner relative group select-none hover:border-zinc-500 transition-all"
                          >
                            <span>{cell}</span>
                            <span className="absolute bottom-0.5 right-0.5 text-[6.5px] font-mono text-zinc-650">
                              {rIdx},{cIdx}
                            </span>
                          </div>
                        ))
                      )}
                    </div>

                    {!isSpectating && (
                      <div className="mt-3 w-full max-w-md font-mono text-[9px] bg-zinc-950 p-2.5 rounded-xl border border-zinc-900 space-y-1">
                        <div className="flex justify-between font-bold text-zinc-200">
                          <span>STEP: {replayStepIndex + 1} / {SAMPLE_REPLAY_RUN.length}</span>
                          <span className="text-cyan-400">REPLAY SCORE: {activeReplayStep.matchScore} PTS</span>
                        </div>
                        <p className="text-zinc-400 italic mt-1 leading-relaxed">
                          "{activeReplayStep.actionDesc}"
                        </p>
                      </div>
                    )}
                  </div>

                  {/* CONTROLS BAR */}
                  {!isSpectating ? (
                    <div className="flex items-center justify-between font-mono text-[9.5px]">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setReplayStepIndex(prev => {
                              const next = prev === 0 ? SAMPLE_REPLAY_RUN.length - 1 : prev - 1;
                              setActiveReplayStep(SAMPLE_REPLAY_RUN[next]);
                              triggerAudioEffect("replay_tick_cascade");
                              return next;
                            });
                          }}
                          className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-350 rounded border border-zinc-800 cursor-pointer"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => {
                            setIsPlayingReplay(!isPlayingReplay);
                            triggerAudioEffect("playback_toggle");
                          }}
                          className="px-3 py-1.5 bg-cyan-950/20 hover:bg-cyan-950/40 border border-cyan-800 hover:border-cyan-500 text-cyan-300 rounded font-black uppercase flex items-center gap-1 cursor-pointer"
                        >
                          {isPlayingReplay ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
                          <span>{isPlayingReplay ? 'PAUSE AUTO' : 'PLAY REPLAY'}</span>
                        </button>

                        <button
                          onClick={() => {
                            setReplayStepIndex(prev => {
                              const next = (prev + 1) % SAMPLE_REPLAY_RUN.length;
                              setActiveReplayStep(SAMPLE_REPLAY_RUN[next]);
                              triggerAudioEffect("replay_tick_cascade");
                              return next;
                            });
                          }}
                          className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-350 rounded border border-zinc-800 cursor-pointer"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Share Replay Button */}
                      <button
                        onClick={() => {
                          addLog("📤 REPLAY SHARER: Your high-score layout has been shared with Alliance members!", "success");
                          triggerAudioEffect("share_click");
                        }}
                        className="px-2.5 py-1.5 bg-indigo-950/20 hover:bg-indigo-950/40 border border-indigo-850 hover:border-indigo-500 text-indigo-300 rounded font-black uppercase flex items-center gap-1 cursor-pointer"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>SHARE REPLAY</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center bg-red-950/15 border border-red-950 text-red-400 p-2 rounded-xl font-mono text-[9px]">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                        <span>SPECTATING EMPEROR THERON</span>
                      </div>
                      <span>SCORE: 8,450 PTS | TIME: 1m 45s</span>
                    </div>
                  )}

                </div>

              </div>

              {/* SPECTATOR COMMENTS RIGHT GRID (5/12) */}
              <div className="lg:col-span-5 flex flex-col gap-4 text-left">
                
                {/* LIVE AUDIENCE CHAT FEED */}
                <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-4 flex-1 flex flex-col justify-between max-h-[440px]">
                  <div>
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-serif font-black uppercase text-zinc-100 tracking-wider">Audience Chat Feed</span>
                      </div>
                      <span className="text-[7.5px] font-mono text-zinc-500">
                        {spectatorComments.length} CHATTER ACTIONS
                      </span>
                    </div>

                    {/* Scrolling comments */}
                    <div className="space-y-2 h-[260px] overflow-y-auto pr-1">
                      {spectatorComments.map((comment) => (
                        <div key={comment.id} className="font-mono text-[9px] p-2 bg-zinc-900/30 border border-zinc-900 rounded-lg">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className={`text-[8px] font-black uppercase px-1 rounded border ${comment.badgeStyle}`}>
                              {comment.username}
                            </span>
                            <span className="text-[7px] text-zinc-650">{comment.time}</span>
                          </div>
                          <p className="text-zinc-300 mt-1 leading-snug">
                            {comment.comment}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Input form */}
                  <form onSubmit={handleSendChatMessage} className="flex gap-1.5 border-t border-zinc-900 pt-3 mt-3">
                    <input
                      type="text"
                      placeholder={isSpectating ? "Type comments here..." : "Select spectator mode to join chat!"}
                      disabled={!isSpectating}
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      className="flex-1 bg-black border border-zinc-850 hover:border-zinc-700 focus:border-purple-500 focus:outline-none p-2 rounded-lg font-mono text-[10px] text-zinc-200"
                    />
                    <button
                      type="submit"
                      disabled={!isSpectating}
                      className="p-2 bg-purple-900 text-white rounded-lg disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </form>
                </div>

              </div>
            </motion.div>
          )}

          {/* ==========================================
              SUB-SCREEN 4: GUARDIAN STATS & PROGRESSION
              ========================================== */}
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute inset-0 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-y-auto pr-1"
            >
              {/* COMPREHENSIVE STATS & SVG GRAPHS LEFT GRID (6/12) */}
              <div className="lg:col-span-6 flex flex-col gap-4 text-left">
                
                {/* DYNAMIC PLAYER SUMMARY */}
                <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-4 flex gap-4">
                  <div className="w-14 h-14 rounded-2xl border-2 border-purple-500/40 bg-purple-950/40 flex items-center justify-center shadow-lg relative">
                    <span className="text-2xl">🛡️</span>
                    <div className="absolute -bottom-1 -right-1 bg-amber-500 text-black font-mono text-[8px] font-black px-1 rounded">
                      LV 24
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-serif font-black uppercase text-zinc-100 text-sm tracking-wider">Your Guardian Profile</h3>
                      <span className="text-[7.5px] font-mono font-black uppercase bg-purple-950/60 text-purple-400 border border-purple-800 px-1 rounded">
                        PRO
                      </span>
                    </div>
                    <span className="text-[8.5px] font-mono text-zinc-500 block mt-1">Siphon Class: 4X Sovereign Commander</span>
                    
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {PROFILE_BADGES.filter(b => b.id === currentBadge).map(b => (
                        <span key={b.id} className={`text-[8px] font-mono font-bold px-2 py-0.5 border rounded-md uppercase ${b.color}`}>
                          {b.icon} {b.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SVG GRAPHS HISTORIC CHART CONTAINER */}
                <div className="bg-[#030306] border border-zinc-900 rounded-2xl p-4">
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Activity className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-serif font-black uppercase text-zinc-100 tracking-wider">Monthly Progress Siphon Points</span>
                    </div>
                    <span className="text-[7.5px] font-mono text-zinc-550">S1 ACCUMULATIVE</span>
                  </div>

                  {/* CUSTOM SVG GRAPH */}
                  <div className="w-full h-40 bg-black/40 border border-zinc-900 p-2 rounded-xl flex items-end justify-between relative mt-1">
                    <div className="absolute inset-x-2 top-2 h-[1px] bg-zinc-900/60" />
                    <div className="absolute inset-x-2 top-1/2 h-[1px] bg-zinc-900/40" />
                    
                    {historicMonthlyPoints.map((val, idx) => {
                      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
                      const maxVal = Math.max(...historicMonthlyPoints);
                      const heightPercent = maxVal > 0 ? (val / maxVal) * 85 : 10;
                      return (
                        <div key={idx} className="flex flex-col items-center flex-1 group">
                          <div className="text-[8px] font-mono font-bold text-emerald-400 mb-1 scale-0 group-hover:scale-100 transition-all">
                            {val}
                          </div>
                          
                          <div 
                            className="w-4 bg-gradient-to-t from-emerald-950 to-emerald-500 border border-emerald-500/40 rounded-t-md hover:brightness-125 transition-all"
                            style={{ height: `${heightPercent}%` }}
                          />
                          
                          <span className="text-[7.5px] font-mono text-zinc-550 mt-1.5">
                            {months[idx]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* PROFILE COSMETICS EQUIPPERS */}
                <div className="bg-zinc-950/80 border border-zinc-900 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3 border-b border-zinc-900 pb-2">
                    <Award className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-serif font-black uppercase tracking-wider text-zinc-100">Equip earned titles & badges</span>
                  </div>

                  {/* TITLES GRID */}
                  <span className="text-[8px] text-zinc-550 uppercase font-black block mb-2">Unlocked Titles:</span>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {PROFILE_TITLES.map((title) => (
                      <button
                        key={title.title}
                        onClick={() => {
                          setCurrentTitle(title.title);
                          addLog(`🏅 TITLE EQUIPPED: Swapped active profile title to "${title.title}".`, "info");
                          triggerAudioEffect("outfit_swap");
                          commitChanges({ currentTitle: title.title });
                        }}
                        className={`p-2 rounded-xl text-left border font-mono transition-all cursor-pointer ${
                          currentTitle === title.title 
                            ? 'bg-purple-950/20 border-purple-500 text-purple-300' 
                            : 'bg-zinc-950 border-zinc-900 hover:border-zinc-800'
                        }`}
                      >
                        <span className="text-[9.5px] font-bold block">{title.title}</span>
                        <span className="text-[7px] text-zinc-550 block mt-0.5 italic">{title.requirement}</span>
                      </button>
                    ))}
                  </div>

                  {/* BADGES GRID */}
                  <span className="text-[8px] text-zinc-550 uppercase font-black block mb-2">Unlocked Badges:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {PROFILE_BADGES.map((badge) => (
                      <button
                        key={badge.id}
                        onClick={() => {
                          setCurrentBadge(badge.id);
                          addLog(`🎖️ BADGE EQUIPPED: Active crest is now "${badge.name}".`, "info");
                          triggerAudioEffect("outfit_swap");
                          commitChanges({ currentBadge: badge.id });
                        }}
                        className={`p-2 rounded-xl text-left border font-mono transition-all flex items-center gap-2 cursor-pointer ${
                          currentBadge === badge.id 
                            ? 'bg-indigo-950/20 border-indigo-500 text-indigo-300' 
                            : 'bg-zinc-950 border-zinc-900 hover:border-zinc-800'
                        }`}
                      >
                        <span className="text-base">{badge.icon}</span>
                        <div className="text-left">
                          <span className="text-[9.5px] font-bold block">{badge.name}</span>
                          <span className="text-[7px] text-zinc-550 block">{badge.desc}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>

              {/* INTERACTIVE ACHIEVEMENTS LIST RIGHT GRID (6/12) */}
              <div className="lg:col-span-6 bg-zinc-950/80 border border-zinc-900 rounded-2xl p-4 text-left flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-2 mb-3">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-400 animate-pulse" />
                      <span className="text-xs font-serif font-black uppercase text-zinc-100 tracking-wider">Guardian Achievements</span>
                    </div>
                    
                    <button
                      onClick={simProgressAchievements}
                      className="px-2 py-0.5 border border-zinc-800 hover:border-zinc-600 text-zinc-400 rounded font-mono text-[8px] font-bold uppercase transition-all cursor-pointer"
                    >
                      🧪 Run Achievement Sim
                    </button>
                  </div>

                  <p className="text-[10px] text-zinc-400 mb-4">
                    Complete specified tasks in active reliquary sectors to secure reward points and legendary badges.
                  </p>

                  <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                    {achievements.map((ac) => {
                      const isCompleted = ac.current >= ac.target;
                      return (
                        <div 
                          key={ac.id}
                          className={`p-3 bg-zinc-950 border rounded-xl font-mono text-[9.5px] relative overflow-hidden transition-all ${
                            ac.claimed 
                              ? 'border-zinc-950 opacity-60' 
                              : isCompleted 
                                ? 'border-amber-500/40 shadow-md bg-amber-950/5' 
                                : 'border-zinc-900'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div className="text-left">
                              <h4 className="font-bold text-zinc-100">{ac.title}</h4>
                              <p className="text-[8px] text-zinc-450 mt-0.5">{ac.description}</p>
                            </div>
                            
                            <span className="text-[8px] font-bold text-amber-400 bg-amber-950/20 px-1 py-0.5 rounded border border-amber-900">
                              +{ac.points} PTS
                            </span>
                          </div>

                          {/* Progress indicator */}
                          <div className="flex items-center justify-between text-[8px] text-zinc-550 mb-1">
                            <span>PROGRESS: {ac.current.toLocaleString()} / {ac.target.toLocaleString()}</span>
                            <span>{ac.badge}</span>
                          </div>
                          
                          <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden mb-2">
                            <div 
                              className={`h-full rounded-full ${isCompleted ? 'bg-amber-500' : 'bg-purple-500'}`} 
                              style={{ width: `${Math.min(100, (ac.current / ac.target) * 100)}%` }}
                            />
                          </div>

                          {/* Claim button */}
                          {isCompleted && !ac.claimed && (
                            <button
                              onClick={() => claimAchievementReward(ac.id)}
                              className="w-full mt-1 py-1 bg-amber-950 border border-amber-500/40 hover:border-amber-500 text-amber-400 rounded font-bold uppercase text-[8px] transition-all cursor-pointer"
                            >
                              Claim Achievement Rewards
                            </button>
                          )}

                          {ac.claimed && (
                            <div className="text-center text-[8.5px] text-emerald-400 font-bold uppercase mt-1">
                              ✓ Claimed & Unlocked
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4 text-[8px] font-mono text-zinc-550 text-center border-t border-zinc-900 pt-3">
                  Wiping profile or reset statistics resets achievement boards permanently.
                </div>
              </div>
            </motion.div>
          )}

          {/* ==========================================
              SUB-SCREEN 5: HALL OF FAME MONUMENTS
              ========================================== */}
          {activeTab === 'fame' && (
            <motion.div
              key="fame"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute inset-0 flex flex-col gap-4 overflow-y-auto pr-1 text-left select-none"
            >
              <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-amber-950/10 border border-amber-950/40 rounded-2xl p-5 text-center max-w-3xl mx-auto">
                <span className="text-3xl animate-bounce inline-block">🏛️</span>
                <h3 className="text-base font-serif font-black uppercase text-zinc-100 mt-2 tracking-widest">The Sanctuary Hall of Fame</h3>
                <p className="text-[10px] font-mono text-zinc-400 mt-1 max-w-lg mx-auto leading-relaxed">
                  Welcome, Guardian, to the ancient repository of high-tier legends. Only champions who secured top standings in flagship tournament cycles are memorialized forever on these crystal pedestals.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  
                  {/* PEDESTAL 1 */}
                  <div className="bg-zinc-950 border border-amber-500/30 rounded-2xl p-4 flex flex-col items-center text-center relative group hover:border-amber-500 transition-all">
                    <div className="absolute -top-3 w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500 flex items-center justify-center text-[10px] font-bold text-amber-400 font-mono shadow-md">
                      I
                    </div>
                    <span className="text-2xl mt-2">👑</span>
                    <h4 className="text-xs font-serif font-bold text-zinc-100 mt-2">Emperor Theron</h4>
                    <span className="text-[8px] font-mono text-zinc-550 block uppercase">Guild: Astral Core</span>
                    <p className="text-[8.5px] font-mono text-zinc-400 mt-3 italic leading-relaxed">
                      "Champion of the Inaugural Altar Genesis flagship event. First to conquer the monolithic 72-tile stacked daily extreme challenge without assistance."
                    </p>
                    <span className="text-[7.5px] font-mono bg-amber-950/50 border border-amber-900 text-amber-300 px-1.5 py-0.5 rounded uppercase font-black mt-4">
                      S1 Champion
                    </span>
                  </div>

                  {/* PEDESTAL 2 */}
                  <div className="bg-zinc-950 border border-cyan-500/30 rounded-2xl p-4 flex flex-col items-center text-center relative group hover:border-cyan-500 transition-all">
                    <div className="absolute -top-3 w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500 flex items-center justify-center text-[10px] font-bold text-cyan-400 font-mono shadow-md">
                      II
                    </div>
                    <span className="text-2xl mt-2">🔮</span>
                    <h4 className="text-xs font-serif font-bold text-zinc-100 mt-2">Lady Vespera</h4>
                    <span className="text-[8px] font-mono text-zinc-550 block uppercase">Guild: Shadow Vanguard</span>
                    <p className="text-[8.5px] font-mono text-zinc-400 mt-3 italic leading-relaxed">
                      "Conquered Aurelius the Gold Drake with a record-shattering 45,200 single-match damage sequence during the Glacial Rift season."
                    </p>
                    <span className="text-[7.5px] font-mono bg-cyan-950/50 border border-cyan-900 text-cyan-300 px-1.5 py-0.5 rounded uppercase font-black mt-4">
                      S2 Champion
                    </span>
                  </div>

                  {/* PEDESTAL 3 */}
                  <div className="bg-zinc-950 border border-purple-500/30 rounded-2xl p-4 flex flex-col items-center text-center relative group hover:border-purple-500 transition-all">
                    <div className="absolute -top-3 w-6 h-6 rounded-full bg-purple-500/10 border border-purple-500 flex items-center justify-center text-[10px] font-bold text-purple-400 font-mono shadow-md">
                      III
                    </div>
                    <span className="text-2xl mt-2">🌋</span>
                    <h4 className="text-xs font-serif font-bold text-zinc-100 mt-2">Archmage Kaelthas</h4>
                    <span className="text-[8px] font-mono text-zinc-550 block uppercase">Guild: Solar Radiance</span>
                    <p className="text-[8.5px] font-mono text-zinc-400 mt-3 italic leading-relaxed">
                      "Demonstrated unmatched strategic depth during the Pyre Colossus championships, setting a peak combo multiplier of x8."
                    </p>
                    <span className="text-[7.5px] font-mono bg-purple-950/50 border border-purple-900 text-purple-300 px-1.5 py-0.5 rounded uppercase font-black mt-4">
                      S3 Champion
                    </span>
                  </div>

                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
