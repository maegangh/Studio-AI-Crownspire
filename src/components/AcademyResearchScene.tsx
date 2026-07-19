import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Zap, BookOpen, Crown, Shield, Activity, Clock, 
  Compass, Users, CheckCircle, Lock, ChevronRight, Info, X, 
  HelpCircle, RefreshCw, Star, FastForward, Award
} from 'lucide-react';
import { ResearchState, Resources, ResearchNode } from '../types';
import { CROWNSPIRE_RESEARCH_DATABASE, isResearchUnlocked } from '../utils/researchDatabase';
import { formatNum } from '../gameData';
import { formatDuration } from '../utils/buildingDatabase';

interface AcademyResearchSceneProps {
  research: ResearchState;
  setResearch: React.Dispatch<React.SetStateAction<ResearchState>>;
  resources: Resources;
  setResources: React.Dispatch<React.SetStateAction<Resources>>;
  addLog: (text: string, type?: 'success' | 'info' | 'warning' | 'combat') => void;
  onClose: () => void;
}

export default function AcademyResearchScene({
  research,
  setResearch,
  resources,
  setResources,
  addLog,
  onClose
}: AcademyResearchSceneProps) {
  // Tabs for Research Categories
  const categories: { key: 'economy' | 'military' | 'development' | 'alliance' | 'hero'; label: string; icon: string; color: string }[] = [
    { key: 'economy', label: 'Economy', icon: '🌾', color: 'from-emerald-600 to-teal-700 text-emerald-400' },
    { key: 'military', label: 'Military', icon: '⚔️', color: 'from-rose-600 to-red-700 text-rose-400' },
    { key: 'development', label: 'Development', icon: '🏗️', color: 'from-amber-500 to-yellow-650 text-amber-400' },
    { key: 'alliance', label: 'Alliance', icon: '🛡️', color: 'from-blue-600 to-indigo-700 text-blue-400' },
    { key: 'hero', label: 'Hero Training', icon: '👑', color: 'from-purple-600 to-violet-700 text-purple-400' }
  ];

  const [activeTab, setActiveTab] = useState<'economy' | 'military' | 'development' | 'alliance' | 'hero'>('economy');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 1200, height: 600 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter research nodes in database by current category
  const categoryNodes = useMemo(() => {
    return CROWNSPIRE_RESEARCH_DATABASE.filter(n => n.category === activeTab);
  }, [activeTab]);

  // Map each node to its depth level based on internal prerequisites
  const nodeLevelsAndPositions = useMemo(() => {
    const depthMap: { [id: string]: number } = {};
    const categoryNodeIds = new Set(categoryNodes.map(n => n.id));

    const getDepth = (nodeId: string): number => {
      if (depthMap[nodeId] !== undefined) return depthMap[nodeId];
      
      const node = CROWNSPIRE_RESEARCH_DATABASE.find(n => n.id === nodeId);
      if (!node || node.prerequisites.length === 0) {
        depthMap[nodeId] = 0;
        return 0;
      }

      // Only count prerequisites that are inside the SAME category
      const categoryPrereqs = node.prerequisites.filter(p => categoryNodeIds.has(p.researchId));
      if (categoryPrereqs.length === 0) {
        depthMap[nodeId] = 0;
        return 0;
      }

      const maxPrereqDepth = Math.max(...categoryPrereqs.map(p => getDepth(p.researchId)));
      depthMap[nodeId] = maxPrereqDepth + 1;
      return maxPrereqDepth + 1;
    };

    categoryNodes.forEach(n => getDepth(n.id));

    // Group nodes by depth column
    const columns: { [depth: number]: string[] } = {};
    categoryNodes.forEach(n => {
      const depth = depthMap[n.id] || 0;
      if (!columns[depth]) columns[depth] = [];
      columns[depth].push(n.id);
    });

    const maxDepth = Math.max(...Object.keys(columns).map(Number), 0);
    const posMap: { [id: string]: { x: number; y: number; col: number; row: number; totalInCol: number } } = {};

    // Assign clean visual grid positions (x, y)
    Object.keys(columns).forEach(colStr => {
      const col = Number(colStr);
      const ids = columns[col];
      const totalInCol = ids.length;

      ids.forEach((id, rowIdx) => {
        // Compute x coordinate with spacing
        const xSpacing = 280;
        const x = 80 + col * xSpacing;
        
        // Compute y coordinate with staggered rows for balanced graph layouts
        const ySpacing = 110;
        const totalHeight = Math.max(500, totalInCol * ySpacing);
        const y = (rowIdx + 0.5) * (totalHeight / totalInCol);

        posMap[id] = { x, y, col, row: rowIdx, totalInCol };
      });
    });

    return { posMap, maxDepth };
  }, [categoryNodes]);

  // Find the selected node object
  const selectedNode = useMemo(() => {
    return CROWNSPIRE_RESEARCH_DATABASE.find(n => n.id === selectedNodeId) || null;
  }, [selectedNodeId]);

  // Reset selected node when category tab changes
  useEffect(() => {
    // Select first node in category by default if none selected
    if (categoryNodes.length > 0) {
      setSelectedNodeId(categoryNodes[0].id);
    } else {
      setSelectedNodeId(null);
    }
  }, [activeTab, categoryNodes]);

  // Calculate dynamic dimensions of the SVG connection canvas
  useEffect(() => {
    if (nodeLevelsAndPositions.posMap) {
      const positions = Object.values(nodeLevelsAndPositions.posMap) as { x: number; y: number }[];
      const maxX = Math.max(...positions.map(p => p.x), 800) + 180;
      const maxY = Math.max(...positions.map(p => p.y), 450) + 120;
      setCanvasDimensions({ width: maxX, height: maxY });
    }
  }, [nodeLevelsAndPositions]);

  // Recount cost with state modifiers
  const getResourceDiscount = (): number => {
    let costDiscount = 0;
    if (research.researchLevels) {
      CROWNSPIRE_RESEARCH_DATABASE.forEach((n) => {
        const lvl = research.researchLevels?.[n.id] || 0;
        if (lvl > 0) {
          n.bonuses.forEach((b) => {
            if (b.type === 'Resource Cost Discount') {
              costDiscount += lvl * b.valuePerLevel;
            }
          });
        }
      });
    }
    return Math.max(0, Math.min(0.9, costDiscount)); // Cap discount at 90%
  };

  const costFactor = Math.max(0.1, 1.0 - getResourceDiscount());

  // Determine highlight list (active connections for hovered/selected node)
  const highlightedRelationships = useMemo(() => {
    const targetId = hoveredNodeId || selectedNodeId;
    if (!targetId) return { related: new Set<string>(), isInput: false };

    const related = new Set<string>();
    related.add(targetId);

    const node = CROWNSPIRE_RESEARCH_DATABASE.find(n => n.id === targetId);
    if (node) {
      // Parents
      node.prerequisites.forEach(p => related.add(p.researchId));
      // Children
      CROWNSPIRE_RESEARCH_DATABASE.forEach(n => {
        if (n.prerequisites.some(p => p.researchId === targetId)) {
          related.add(n.id);
        }
      });
    }

    return { related, isInput: !!hoveredNodeId };
  }, [hoveredNodeId, selectedNodeId]);

  // Check if a node is fully affordable & unlocked
  const getNodeStatus = (node: ResearchNode) => {
    const level = research.researchLevels?.[node.id] || 0;
    const isMax = level >= node.maxLevel;
    const nextLvl = level + 1;
    
    const { unlocked, reason } = isResearchUnlocked(node, research.researchLevels, research.research_hall_level);
    
    let isAffordable = false;
    let foodCost = 0, woodCost = 0, stoneCost = 0, ironCost = 0, valorCost = 0;

    if (!isMax) {
      const cost = node.researchCost[nextLvl];
      if (cost) {
        foodCost = Math.round((cost.food || 0) * costFactor);
        woodCost = Math.round((cost.wood || 0) * costFactor);
        stoneCost = Math.round((cost.stone || 0) * costFactor);
        ironCost = Math.round((cost.iron || 0) * costFactor);
        valorCost = Math.round((cost.valor || 0) * costFactor);

        isAffordable = resources.food >= foodCost &&
                        resources.wood >= woodCost &&
                        resources.stone >= stoneCost &&
                        resources.iron >= ironCost &&
                        resources.valor >= valorCost;
      }
    }

    return { level, isMax, unlocked, reason, isAffordable, foodCost, woodCost, stoneCost, ironCost, valorCost };
  };

  // Start research or add to queue
  const handleStartResearch = (node: ResearchNode) => {
    const { level, isMax, unlocked, reason, isAffordable, foodCost, woodCost, stoneCost, ironCost, valorCost } = getNodeStatus(node);

    if (research.research_hall_level < 1) {
      addLog(`Technical block: Require Academy Hall to start "${node.name}".`, 'warning');
      return;
    }

    if (isMax) {
      addLog(`Research complete: "${node.name}" is already at maximum level.`, 'warning');
      return;
    }

    if (!unlocked) {
      addLog(`Locked branch: "${node.name}" requires prerequisites to be completed first: ${reason}`, 'warning');
      return;
    }

    if (!isAffordable) {
      addLog(`Insufficient assets: "${node.name}" requires additional materials.`, 'warning');
      return;
    }

    // Check queue limits (1 active + 4 queued maximum)
    const queue = research.researchQueue ? [...research.researchQueue] : [];
    if (research.activeResearch && queue.length >= 4) {
      addLog(`Scholar chambers full: The Research Queue has reached its maximum capacity (4 items).`, 'warning');
      return;
    }

    // Deduct resources
    setResources(prev => ({
      ...prev,
      food: prev.food - foodCost,
      wood: prev.wood - woodCost,
      stone: prev.stone - stoneCost,
      iron: prev.iron - ironCost,
      valor: prev.valor - valorCost
    }));

    const nextLvl = level + 1;
    const baseDuration = node.researchTimeSec[nextLvl] || 60;
    
    // Apply Research Speed modifier (reduces time)
    let speedBonus = 0;
    if (research.researchLevels) {
      CROWNSPIRE_RESEARCH_DATABASE.forEach((n) => {
        const lvl = research.researchLevels?.[n.id] || 0;
        if (lvl > 0) {
          n.bonuses.forEach((b) => {
            if (b.type === 'Research Speed') {
              speedBonus += lvl * b.valuePerLevel;
            }
          });
        }
      });
    }
    const finalDuration = Math.max(5, Math.round(baseDuration / (1.0 + speedBonus)));

    const job = {
      researchId: node.id,
      level: nextLvl,
      timeRemainingSec: finalDuration,
      totalDurationSec: finalDuration,
      startTime: Date.now(),
      finishTime: Date.now() + (finalDuration * 1000)
    };

    const nextResearch = { ...research };
    if (!nextResearch.activeResearch) {
      nextResearch.activeResearch = job;
      addLog(`🔬 Scholar Assembly: Begun research on "${node.name}" Level ${nextLvl}. Completion in ${formatDuration(finalDuration)}.`, 'success');
    } else {
      const q = nextResearch.researchQueue ? [...nextResearch.researchQueue] : [];
      q.push(job);
      nextResearch.researchQueue = q;
      addLog(`📋 Queue Enlisted: "${node.name}" Level ${nextLvl} has been added to the research queue.`, 'info');
    }

    setResearch(nextResearch);
  };

  // Cancel an active or queued research project
  const handleCancelResearch = (index: number | 'active') => {
    const nextResearch = { ...research };
    let refundFactor = 0.7; // 70% refund rate
    let targetJob = null;

    if (index === 'active') {
      targetJob = nextResearch.activeResearch;
      if (!targetJob) return;

      // Promote next from queue
      const q = nextResearch.researchQueue ? [...nextResearch.researchQueue] : [];
      if (q.length > 0) {
        const nextJob = { ...q.shift()! };
        nextJob.startTime = Date.now();
        nextJob.finishTime = Date.now() + (nextJob.timeRemainingSec * 1000);
        nextResearch.activeResearch = nextJob;
        nextResearch.researchQueue = q;
      } else {
        nextResearch.activeResearch = null;
      }
    } else {
      const q = nextResearch.researchQueue ? [...nextResearch.researchQueue] : [];
      if (index >= 0 && index < q.length) {
        targetJob = q[index];
        q.splice(index, 1);
        nextResearch.researchQueue = q;
      }
    }

    if (targetJob) {
      const node = CROWNSPIRE_RESEARCH_DATABASE.find(n => n.id === targetJob.researchId);
      if (node) {
        const cost = node.researchCost[targetJob.level];
        if (cost) {
          const refundedFood = Math.round((cost.food || 0) * costFactor * refundFactor);
          const refundedWood = Math.round((cost.wood || 0) * costFactor * refundFactor);
          const refundedStone = Math.round((cost.stone || 0) * costFactor * refundFactor);
          const refundedIron = Math.round((cost.iron || 0) * costFactor * refundFactor);
          const refundedValor = Math.round((cost.valor || 0) * costFactor * refundFactor);

          setResources(prev => ({
            ...prev,
            food: prev.food + refundedFood,
            wood: prev.wood + refundedWood,
            stone: prev.stone + refundedStone,
            iron: prev.iron + refundedIron,
            valor: prev.valor + refundedValor
          }));

          addLog(`❌ Cancelled Research: "${node.name}" Level ${targetJob.level}. Refunded 70% of costs: ` + 
            [
              refundedFood ? `${formatNum(refundedFood)} Food` : null,
              refundedWood ? `${formatNum(refundedWood)} Wood` : null,
              refundedStone ? `${formatNum(refundedStone)} Stone` : null,
              refundedIron ? `${formatNum(refundedIron)} Iron` : null,
              refundedValor ? `${formatNum(refundedValor)} Valor` : null
            ].filter(Boolean).join(', '), 
            'warning'
          );
        }
      }
    }

    setResearch(nextResearch);
  };

  // Speed up active research by an amount of seconds
  const handleApplySpeedup = (seconds: number) => {
    if (!research.activeResearch) return;

    const nextResearch = { ...research };
    const active = { ...nextResearch.activeResearch };
    
    active.timeRemainingSec = Math.max(0, active.timeRemainingSec - seconds);
    active.finishTime = Date.now() + (active.timeRemainingSec * 1000);
    nextResearch.activeResearch = active;

    const node = CROWNSPIRE_RESEARCH_DATABASE.find(n => n.id === active.researchId);
    const nodeName = node ? node.name : active.researchId;

    if (active.timeRemainingSec <= 0) {
      // Immediately trigger completion
      const lvls = nextResearch.researchLevels ? { ...nextResearch.researchLevels } : {};
      lvls[active.researchId] = active.level;
      nextResearch.researchLevels = lvls;

      // Handle category level triggers
      if (active.researchId.startsWith('econ_') && active.researchId.includes('prod')) {
        nextResearch.economy_research_level = (nextResearch.economy_research_level || 0) + 1;
      } else if (active.researchId.startsWith('mil_') && active.researchId.includes('attack')) {
        nextResearch.military_research_level = (nextResearch.military_research_level || 0) + 1;
        nextResearch.troop_attack_bonus = (nextResearch.troop_attack_bonus || 0) + 5;
      }

      // Promote next
      const q = nextResearch.researchQueue ? [...nextResearch.researchQueue] : [];
      if (q.length > 0) {
        const nextJob = { ...q.shift()! };
        nextJob.startTime = Date.now();
        nextJob.finishTime = Date.now() + (nextJob.totalDurationSec * 1000);
        nextResearch.activeResearch = nextJob;
        nextResearch.researchQueue = q;
      } else {
        nextResearch.activeResearch = null;
      }

      addLog(`⚡ Sage Speedup: Instantly unlocked breakthrough! "${nodeName}" Level ${active.level} is complete!`, 'success');
    } else {
      addLog(`⚡ Applied research time speedup card (-${formatDuration(seconds)}). Remaining: ${formatDuration(active.timeRemainingSec)}.`, 'info');
    }

    setResearch(nextResearch);
  };

  // Instant research unlock using Valor
  const handleInstantResearchWithValor = () => {
    if (!research.activeResearch) return;
    const active = research.activeResearch;
    const valorCost = Math.round(active.timeRemainingSec * 1.5); // 1.5 Valor per second remaining

    if (resources.valor < valorCost) {
      addLog(`Insufficient Arcane Valor: Requires ${formatNum(valorCost)} Valor for instant breakthrough.`, 'warning');
      return;
    }

    // Deduct valor
    setResources(prev => ({ ...prev, valor: prev.valor - valorCost }));
    
    // Complete active research instantly
    handleApplySpeedup(active.timeRemainingSec);
  };

  // Speedup inventory items card
  const speedupOptions = [
    { label: '1 Min Focus', sec: 60, cost: 'Free Spec' },
    { label: '5 Min Scroll', sec: 300, cost: 'Scholar Tier' },
    { label: '15 Min Tome', sec: 900, cost: 'Sage Ref' },
    { label: '1 Hour Decree', sec: 3600, cost: 'Royal Writ' },
  ];

  // Helper function to render customized icons based on research name/category
  const renderNodeIcon = (node: ResearchNode, sizeClass = "w-5 h-5") => {
    switch (node.iconName) {
      case 'Award': return <Award className={`${sizeClass}`} />;
      case 'Crown': return <Crown className={`${sizeClass}`} />;
      case 'Sparkles': return <Sparkles className={`${sizeClass} text-yellow-450`} />;
      case 'Shield': return <Shield className={`${sizeClass} text-sky-400`} />;
      case 'Activity': return <Activity className={`${sizeClass} text-rose-400`} />;
      case 'Clock': return <Clock className={`${sizeClass} text-amber-400`} />;
      case 'Compass': return <Compass className={`${sizeClass} text-teal-400`} />;
      case 'Users': return <Users className={`${sizeClass} text-indigo-400`} />;
      default: return <BookOpen className={`${sizeClass}`} />;
    }
  };

  return (
    <div 
      id="academy-research-scene-fullscreen" 
      className="fixed inset-0 bg-[#06080e]/98 z-50 overflow-hidden flex flex-col font-sans"
    >
      {/* ================= HEADER PANEL ================= */}
      <div className="bg-[#0b0f19] border-b border-zinc-800/80 px-6 py-4 flex items-center justify-between shadow-lg relative shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-br from-amber-500/10 to-indigo-500/15 rounded-2xl border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.15)] animate-pulse">
            <BookOpen className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-extrabold text-lg text-white uppercase tracking-wider">Technical Grand Academy</h2>
              <span className="text-[10px] font-mono font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-850 px-2 py-0.5 rounded-full">
                Sovereign Lvl {research.research_hall_level}
              </span>
            </div>
            <p className="text-xs text-zinc-400">Manage, inspect, and fund technological breakthrough lineages inside the Crownspire realm.</p>
          </div>
        </div>

        {/* Resources Sub-display */}
        <div className="hidden md:flex items-center gap-4 bg-zinc-950/60 px-4 py-2 rounded-xl border border-zinc-900 text-xs font-mono">
          <div className="flex items-center gap-1">
            <span>🌾</span>
            <span className="text-zinc-400">Food:</span>
            <span className="text-white font-bold">{formatNum(resources.food)}</span>
          </div>
          <div className="flex items-center gap-1 border-l border-zinc-900 pl-3">
            <span>🪵</span>
            <span className="text-zinc-400">Wood:</span>
            <span className="text-white font-bold">{formatNum(resources.wood)}</span>
          </div>
          <div className="flex items-center gap-1 border-l border-zinc-900 pl-3">
            <span>🪨</span>
            <span className="text-zinc-400">Stone:</span>
            <span className="text-white font-bold">{formatNum(resources.stone)}</span>
          </div>
          <div className="flex items-center gap-1 border-l border-zinc-900 pl-3">
            <span>🛡️</span>
            <span className="text-zinc-400">Iron:</span>
            <span className="text-white font-bold">{formatNum(resources.iron)}</span>
          </div>
          <div className="flex items-center gap-1 border-l border-indigo-950 pl-3">
            <span className="text-indigo-400">⚡</span>
            <span className="text-indigo-300">Valor:</span>
            <span className="text-amber-400 font-extrabold">{formatNum(resources.valor)}</span>
          </div>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="p-2 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 hover:border-amber-500/50 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* ================= CATEGORY NAVIGATION ================= */}
      <div className="bg-[#080c14] border-b border-zinc-900/65 p-2 flex items-center justify-between shrink-0 overflow-x-auto no-scrollbar">
        <div className="flex gap-1.5 px-3 min-w-max">
          {categories.map((cat) => {
            const isActive = activeTab === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => {
                  setActiveTab(cat.key);
                }}
                className={`px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-serif font-black uppercase tracking-wider transition-all cursor-pointer border ${
                  isActive 
                    ? `bg-gradient-to-r ${cat.color} text-zinc-100 border-amber-500/50 shadow-md` 
                    : 'bg-zinc-950/45 text-zinc-400 border-zinc-900 hover:text-zinc-200 hover:bg-zinc-900/50'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tree controls */}
        <div className="flex items-center gap-2 px-3 text-xs text-zinc-550 font-mono">
          <button 
            onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.1))} 
            className="px-2 py-1 bg-zinc-900 hover:bg-zinc-850 rounded border border-zinc-800 text-[10px] cursor-pointer"
          >
            Zoom Out
          </button>
          <button 
            onClick={() => setZoomLevel(1)} 
            className="px-2 py-1 bg-zinc-900 hover:bg-zinc-850 rounded border border-zinc-800 text-[10px] cursor-pointer"
          >
            100%
          </button>
          <button 
            onClick={() => setZoomLevel(prev => Math.min(1.5, prev + 0.1))} 
            className="px-2 py-1 bg-zinc-900 hover:bg-zinc-850 rounded border border-zinc-800 text-[10px] cursor-pointer"
          >
            Zoom In
          </button>
        </div>
      </div>

      {/* ================= MAIN INTERFACE: BENTO WORKSPACE ================= */}
      <div className="flex-1 flex overflow-hidden min-h-0 bg-[#04060a] relative">
        
        {/* ================= LEFT SIDE: SCROLLABLE TREE CANVAS ================= */}
        <div 
          ref={containerRef}
          className="flex-1 overflow-auto relative p-6 no-scrollbar cursor-grab active:cursor-grabbing select-none"
          style={{ backgroundImage: 'radial-gradient(#111625 1.5px, transparent 1.5px)', backgroundSize: '24px 24px' }}
        >
          {/* Zoom & Centered Wrapper */}
          <div 
            style={{ 
              transform: `scale(${zoomLevel})`, 
              transformOrigin: 'top left',
              width: `${canvasDimensions.width}px`,
              height: `${canvasDimensions.height}px`
            }}
            className="relative transition-transform duration-200 ease-out"
          >
            {/* SVG Connection Layers */}
            <svg 
              className="absolute inset-0 pointer-events-none z-0"
              style={{ width: '100%', height: '100%' }}
            >
              <defs>
                <linearGradient id="unlocked-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
                </linearGradient>
                <linearGradient id="locked-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#27272a" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#18181b" stopOpacity="0.3" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Draw connectors */}
              {categoryNodes.map((node) => {
                const nodePos = nodeLevelsAndPositions.posMap[node.id];
                if (!nodePos) return null;

                return node.prerequisites.map((prereq) => {
                  const parentPos = nodeLevelsAndPositions.posMap[prereq.researchId];
                  if (!parentPos) return null;

                  // Determine path status
                  const isParentResearched = (research.researchLevels?.[prereq.researchId] || 0) >= prereq.level;
                  const isThisUnlocked = getNodeStatus(node).unlocked;
                  const isConnectionActive = isParentResearched && isThisUnlocked;

                  // Highlight connection line
                  const isRelationshipHighlighted = highlightedRelationships.related.has(node.id) && highlightedRelationships.related.has(prereq.researchId);

                  // SVG Bezier Curve Coordinates
                  const x1 = parentPos.x + 195; // Node horizontal length offset
                  const y1 = parentPos.y + 35;  // Node half vertical height
                  const x2 = nodePos.x - 5;
                  const y2 = nodePos.y + 35;
                  const cp1 = x1 + 100;
                  const cp2 = x2 - 100;

                  const pathD = `M ${x1} ${y1} C ${cp1} ${y1}, ${cp2} ${y2}, ${x2} ${y2}`;

                  return (
                    <g key={`${node.id}-${prereq.researchId}`} className="transition-opacity duration-300">
                      {/* Ambient Shadow/Glow under active curves */}
                      {isConnectionActive && (
                        <path
                          d={pathD}
                          fill="none"
                          stroke={isRelationshipHighlighted ? '#f59e0b' : '#3b82f6'}
                          strokeWidth={isRelationshipHighlighted ? 6 : 3}
                          strokeOpacity={isRelationshipHighlighted ? 0.6 : 0.25}
                          filter="url(#glow)"
                        />
                      )}

                      {/* Main connection line */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke={
                          isConnectionActive 
                            ? (isRelationshipHighlighted ? '#f59e0b' : 'url(#unlocked-grad)') 
                            : 'url(#locked-grad)'
                        }
                        strokeWidth={isRelationshipHighlighted ? 3 : 1.75}
                        strokeDasharray={isConnectionActive ? undefined : '5,5'}
                        className="transition-all duration-350"
                      />

                      {/* Glowing energy flow along connected paths */}
                      {isConnectionActive && (
                        <circle r="3.5" fill={isRelationshipHighlighted ? '#fbbf24' : '#10b981'}>
                          <animateMotion
                            path={pathD}
                            dur={isRelationshipHighlighted ? "3.5s" : "6s"}
                            repeatCount="indefinite"
                          />
                        </circle>
                      )}
                    </g>
                  );
                });
              })}
            </svg>

            {/* Render node Runestones */}
            {categoryNodes.map((node) => {
              const pos = nodeLevelsAndPositions.posMap[node.id];
              if (!pos) return null;

              const { level, isMax, unlocked, isAffordable } = getNodeStatus(node);
              const isSelected = selectedNodeId === node.id;
              const isHovered = hoveredNodeId === node.id;
              
              // Determine if node is highlighted based on relationships
              const isNodeDimmed = highlightedRelationships.related.size > 0 && !highlightedRelationships.related.has(node.id);

              // Active upgrade/queue status for this specific node
              const isCurrentlyResearching = research.activeResearch?.researchId === node.id;
              const isQueued = research.researchQueue?.some(q => q.researchId === node.id);

              return (
                <motion.div
                  key={node.id}
                  style={{ left: pos.x, top: pos.y }}
                  className="absolute z-10 w-[205px] h-[70px] cursor-pointer"
                  onClick={() => setSelectedNodeId(node.id)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                  whileHover={{ scale: 1.03, y: pos.y - 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div 
                    className={`w-full h-full rounded-2xl p-2.5 flex items-center gap-2.5 transition-all duration-300 relative border ${
                      isCurrentlyResearching
                        ? 'bg-indigo-950/80 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.45)]'
                        : isQueued
                        ? 'bg-zinc-900/90 border-dashed border-zinc-650'
                        : isMax
                        ? 'bg-amber-950/20 border-amber-500/80 shadow-[0_0_10px_rgba(245,158,11,0.15)]'
                        : !unlocked
                        ? 'bg-[#080a10]/80 border-zinc-900 text-zinc-500 cursor-not-allowed'
                        : isSelected
                        ? 'bg-zinc-900 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.45)] text-white'
                        : isAffordable
                        ? 'bg-[#0b101c]/95 border-emerald-500/50 hover:border-emerald-400/90'
                        : 'bg-[#0b101c]/95 border-zinc-800 hover:border-zinc-700'
                    } ${isNodeDimmed ? 'opacity-30 saturate-50' : 'opacity-100'}`}
                  >
                    {/* Badge Indicator */}
                    <div className="absolute -top-1.5 -right-1.5 flex gap-1 z-20">
                      {isCurrentlyResearching && (
                        <span className="flex h-3.5 w-3.5 relative">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-indigo-500 text-[8px] items-center justify-center font-mono text-white">🔬</span>
                        </span>
                      )}
                      {isQueued && (
                        <span className="bg-zinc-700 text-zinc-200 text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-zinc-600 font-mono">
                          Q
                        </span>
                      )}
                      {isMax && (
                        <span className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black text-[8px] font-black px-1.5 py-0.5 rounded-md shadow-sm">
                          MAX
                        </span>
                      )}
                    </div>

                    {/* Node Icon Circle */}
                    <div className={`w-11 h-11 rounded-xl shrink-0 flex items-center justify-center border transition-colors ${
                      isCurrentlyResearching
                        ? 'bg-indigo-900/60 text-indigo-300 border-indigo-750'
                        : isMax
                        ? 'bg-amber-900/30 text-amber-400 border-amber-800/60'
                        : !unlocked
                        ? 'bg-zinc-950 text-zinc-750 border-zinc-900'
                        : isSelected
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-zinc-900/60 text-zinc-300 border-zinc-800'
                    }`}>
                      {unlocked ? renderNodeIcon(node, "w-5.5 h-5.5") : <Lock className="w-4 h-4 text-zinc-700" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pr-1.5">
                      <h4 className={`text-[11px] font-serif font-bold truncate leading-tight ${
                        !unlocked ? 'text-zinc-600' : 'text-zinc-150'
                      }`}>
                        {node.name}
                      </h4>
                      
                      {/* Stats row */}
                      <div className="flex items-center gap-1.5 mt-1 font-mono">
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-md ${
                          isMax ? 'bg-amber-950/50 text-amber-400' : 'bg-zinc-950 text-zinc-400'
                        }`}>
                          Lvl {level}/{node.maxLevel}
                        </span>

                        {unlocked && !isMax && !isCurrentlyResearching && !isQueued && (
                          <span className={`text-[9px] font-bold ${isAffordable ? 'text-emerald-450' : 'text-zinc-550'}`}>
                            {isAffordable ? '● Ready' : '● Cost'}
                          </span>
                        )}
                        {isCurrentlyResearching && (
                          <span className="text-[8px] font-bold text-indigo-400 animate-pulse">
                            ● Researching
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Left/Right active connection indicator on selecting */}
                    {isSelected && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-amber-500 rounded-l-full shadow-[0_0_10px_rgba(245,158,11,0.7)]" />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ================= RIGHT SIDE: DETAILS & QUEUE CONTROL PANEL ================= */}
        <div 
          id="academy-control-panel-sidebar"
          className="w-full max-w-[370px] bg-[#070b12] border-l border-zinc-850 flex flex-col min-h-0 shrink-0 select-text"
        >
          {/* ================= SECTION A: ACTIVE RESEARCH QUEUE ================= */}
          <div className="p-4 border-b border-zinc-900 bg-[#0a0e18]/90 relative">
            <h3 className="font-serif font-extrabold text-[11.5px] uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 mb-3">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span>Research Labs Schedule</span>
            </h3>

            {/* Active Research Progress Block */}
            {research.activeResearch ? (() => {
              const active = research.activeResearch;
              const node = CROWNSPIRE_RESEARCH_DATABASE.find(n => n.id === active.researchId);
              const progressPct = active.totalDurationSec > 0 
                ? Math.min(100, Math.round(((active.totalDurationSec - active.timeRemainingSec) / active.totalDurationSec) * 100))
                : 100;

              return (
                <div className="p-3 bg-indigo-950/40 rounded-xl border border-indigo-500/25 relative overflow-hidden mb-3">
                  <div className="absolute top-0 left-0 bottom-0 bg-indigo-500/5 transition-all duration-300" style={{ width: `${progressPct}%` }} />
                  
                  <div className="flex justify-between items-start mb-1.5 relative z-10">
                    <div>
                      <span className="text-[10px] font-mono text-indigo-400 font-bold tracking-wider block uppercase">CURRENT PROJECTS</span>
                      <h4 className="font-serif font-black text-white text-xs tracking-wide leading-tight mt-0.5">
                        {node?.name || active.researchId}
                      </h4>
                      <span className="text-[9px] font-mono text-zinc-450 block">Level {active.level} breakthrough</span>
                    </div>
                    
                    {/* Time remaining */}
                    <div className="text-right font-mono">
                      <span className="text-[10px] font-bold text-indigo-300 block">{formatDuration(active.timeRemainingSec)}</span>
                      <span className="text-[8px] text-zinc-450 block">left</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden relative z-10 border border-zinc-850 my-2">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-amber-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  {/* Speedup and Cancel controls */}
                  <div className="flex gap-1.5 mt-2.5 relative z-10">
                    {/* Instant complete with Valor */}
                    <button
                      onClick={handleInstantResearchWithValor}
                      className="flex-1 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:brightness-110 text-black text-[9px] font-serif font-black uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Zap className="w-3 h-3 fill-current" />
                      <span>Instant ({Math.round(active.timeRemainingSec * 1.5)} V)</span>
                    </button>

                    {/* Cancel action */}
                    <button
                      onClick={() => handleCancelResearch('active')}
                      className="px-2.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-rose-450 hover:text-rose-400 text-[9px] font-serif font-black uppercase tracking-wider rounded-lg border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
                      title="Cancel research and refund 70% of resources"
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Expanded Speedup Cards Submenu */}
                  <div className="mt-2.5 pt-2 border-t border-indigo-950/80 grid grid-cols-2 gap-1.5 relative z-10">
                    {speedupOptions.map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => handleApplySpeedup(opt.sec)}
                        className="py-1 px-1.5 bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-900 hover:border-indigo-500/20 text-zinc-400 hover:text-white rounded text-[8.5px] font-mono flex items-center justify-between transition-colors cursor-pointer"
                      >
                        <span className="truncate">{opt.label}</span>
                        <span className="text-[8px] text-indigo-400 shrink-0 font-bold">-{opt.sec/60}m</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })() : (
              <div className="p-4 bg-zinc-950/65 rounded-xl border border-zinc-900 text-center text-zinc-500 text-xs py-5 mb-3 leading-relaxed">
                <span>🔬 Idle Scholar Assembly.<br />No technology is currently under development.</span>
              </div>
            )}

            {/* Queued research list */}
            {research.researchQueue && research.researchQueue.length > 0 ? (
              <div className="space-y-1.5">
                <span className="text-[9px] font-mono text-zinc-450 uppercase tracking-wider block font-bold">Waiting in queue ({research.researchQueue.length}/4)</span>
                {research.researchQueue.map((job, idx) => {
                  const node = CROWNSPIRE_RESEARCH_DATABASE.find(n => n.id === job.researchId);
                  return (
                    <div key={`${job.researchId}-${idx}`} className="p-2 bg-zinc-950/80 rounded-lg border border-zinc-900 text-[10px] flex justify-between items-center">
                      <div className="min-w-0 pr-2">
                        <span className="font-bold text-zinc-350 block truncate leading-normal">{node?.name || job.researchId}</span>
                        <span className="text-[8.5px] text-zinc-450 block font-mono">Level {job.level} waiting • {formatDuration(job.totalDurationSec)}</span>
                      </div>
                      <button 
                        onClick={() => handleCancelResearch(idx)}
                        className="p-1 px-1.5 text-zinc-550 hover:text-rose-450 transition-colors font-mono cursor-pointer"
                        title="Remove from queue and refund 70%"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : null}
          </div>

          {/* ================= SECTION B: DETAILED NODE INSPECT DOCK ================= */}
          <div className="flex-1 overflow-y-auto p-4 no-scrollbar flex flex-col min-h-0 bg-zinc-950/20">
            {selectedNode ? (() => {
              const node = selectedNode;
              const { level, isMax, unlocked, reason, isAffordable, foodCost, woodCost, stoneCost, ironCost, valorCost } = getNodeStatus(node);
              const nextLvl = level + 1;
              const isCurrentlyActive = research.activeResearch?.researchId === node.id;
              const isCurrentlyQueued = research.researchQueue?.some(q => q.researchId === node.id);

              return (
                <div className="flex-1 flex flex-col gap-4">
                  {/* Title Header Card */}
                  <div className="p-3.5 bg-gradient-to-br from-zinc-900/60 to-zinc-950/80 rounded-xl border border-zinc-850 text-left relative overflow-hidden">
                    <div className="absolute top-3 right-3 text-2xl select-none opacity-20">📜</div>
                    <span className="text-[9.5px] font-mono text-amber-500 font-bold uppercase tracking-wider block">TECH RESEARCH CARD</span>
                    <h3 className="font-serif font-black text-white text-sm uppercase tracking-wide mt-1 leading-tight">{node.name}</h3>
                    <p className="text-[10.5px] text-zinc-400 mt-2 leading-relaxed italic">"{node.description}"</p>
                  </div>

                  {/* Level Bonuses Progress comparison */}
                  <div className="p-3.5 bg-zinc-950/80 rounded-xl border border-zinc-900 text-xs">
                    <h4 className="font-serif text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-2.5">Incremental Level Modifiers</h4>
                    
                    {/* Current modifiers */}
                    <div className="space-y-2 font-mono">
                      <div className="flex justify-between items-center text-[10.5px]">
                        <span className="text-zinc-450">Active Level {level}:</span>
                        <span className={level > 0 ? 'text-amber-400 font-extrabold' : 'text-zinc-600'}>
                          {level > 0 ? node.bonuses.map(b => {
                            const val = b.isPercentage ? `${(b.valuePerLevel * level * 100).toFixed(0)}%` : b.valuePerLevel * level;
                            return `+${val} ${b.type}`;
                          }).join(', ') : 'No active bonus'}
                        </span>
                      </div>

                      {/* Next Level modifiers */}
                      {!isMax ? (
                        <div className="flex justify-between items-center text-[10.5px] pt-1.5 border-t border-zinc-900/50">
                          <span className="text-zinc-350">Next Level {nextLvl}:</span>
                          <span className="text-emerald-400 font-extrabold">
                            {node.bonuses.map(b => {
                              const val = b.isPercentage ? `${(b.valuePerLevel * nextLvl * 100).toFixed(0)}%` : b.valuePerLevel * nextLvl;
                              return `+${val} ${b.type}`;
                            }).join(', ')}
                          </span>
                        </div>
                      ) : (
                        <div className="text-[10px] text-amber-500 font-bold text-center pt-2 select-none">
                          ★ MAXIMUM POTENTIAL ACHIEVED ★
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Prerequisites checklist */}
                  {node.prerequisites.length > 0 && (
                    <div className="p-3.5 bg-zinc-950/80 rounded-xl border border-zinc-900 text-xs text-left">
                      <h4 className="font-serif text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-2.5">Scholastic Prerequisites</h4>
                      <div className="space-y-1.5 font-mono text-[10.5px]">
                        {node.prerequisites.map((p) => {
                          const prereqNode = CROWNSPIRE_RESEARCH_DATABASE.find(n => n.id === p.researchId);
                          const activePrereqLvl = research.researchLevels?.[p.researchId] || 0;
                          const isMet = activePrereqLvl >= p.level;

                          return (
                            <button
                              key={p.researchId}
                              onClick={() => setSelectedNodeId(p.researchId)}
                              className="w-full flex justify-between items-center p-1.5 hover:bg-zinc-900/40 rounded transition-colors text-left cursor-pointer group"
                              title="Click to hop to prerequisite node on the tree"
                            >
                              <span className="text-zinc-400 truncate group-hover:text-amber-450 transition-colors pr-1 flex items-center gap-1">
                                <span className="text-[8px] text-zinc-650 shrink-0">➜</span>
                                {prereqNode ? prereqNode.name : p.researchId}
                              </span>
                              <span className={`shrink-0 font-bold ${isMet ? 'text-emerald-400' : 'text-rose-450 animate-pulse'}`}>
                                Lvl {activePrereqLvl} / {p.level}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Research costs check */}
                  {!isMax && (
                    <div className="p-3.5 bg-zinc-950/80 rounded-xl border border-zinc-900 text-xs text-left">
                      <div className="flex justify-between items-center mb-2.5">
                        <h4 className="font-serif text-[11px] font-black uppercase tracking-wider text-zinc-400">Research Components</h4>
                        {getResourceDiscount() > 0 && (
                          <span className="text-[8.5px] font-mono font-bold text-emerald-450 bg-emerald-950/85 px-1.5 py-0.5 rounded border border-emerald-900">
                            Discount: -{(getResourceDiscount() * 100).toFixed(0)}%
                          </span>
                        )}
                      </div>

                      <div className="space-y-1.5 font-mono text-[10.5px]">
                        {/* Food */}
                        {foodCost > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-zinc-450">🌾 Field Food:</span>
                            <span className={resources.food >= foodCost ? 'text-zinc-350' : 'text-rose-450 font-black'}>
                              {formatNum(foodCost)} / {formatNum(resources.food)}
                            </span>
                          </div>
                        )}

                        {/* Wood */}
                        {woodCost > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-zinc-450">🪵 Spruce Timber:</span>
                            <span className={resources.wood >= woodCost ? 'text-zinc-350' : 'text-rose-450 font-black'}>
                              {formatNum(woodCost)} / {formatNum(resources.wood)}
                            </span>
                          </div>
                        )}

                        {/* Stone */}
                        {stoneCost > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-zinc-450">🪨 Quarry Slate:</span>
                            <span className={resources.stone >= stoneCost ? 'text-zinc-350' : 'text-rose-450 font-black'}>
                              {formatNum(stoneCost)} / {formatNum(resources.stone)}
                            </span>
                          </div>
                        )}

                        {/* Iron */}
                        {ironCost > 0 && (
                          <div className="flex justify-between items-center">
                            <span className="text-zinc-450">🛡️ Smelted Iron:</span>
                            <span className={resources.iron >= ironCost ? 'text-zinc-350' : 'text-rose-450 font-black'}>
                              {formatNum(ironCost)} / {formatNum(resources.iron)}
                            </span>
                          </div>
                        )}

                        {/* Valor */}
                        {valorCost > 0 && (
                          <div className="flex justify-between items-center text-indigo-400">
                            <span className="text-indigo-300">⚡ Arcane Valor:</span>
                            <span className={resources.valor >= valorCost ? 'font-bold' : 'text-rose-450 font-black animate-pulse'}>
                              {formatNum(valorCost)} / {formatNum(resources.valor)}
                            </span>
                          </div>
                        )}

                        {/* Research Time */}
                        <div className="flex justify-between items-center pt-2 mt-1.5 border-t border-zinc-900/50 text-[10px]">
                          <span className="text-zinc-450">⏳ Time Commitment:</span>
                          <span className="text-zinc-300 font-bold flex items-center gap-1">
                            <Clock className="w-3 h-3 text-zinc-500" />
                            {formatDuration(Math.max(5, Math.round((node.researchTimeSec[nextLvl] || 60) / (1.0 + (research.researchLevels ? CROWNSPIRE_RESEARCH_DATABASE.reduce((acc, n) => acc + (research.researchLevels?.[n.id] || 0) * (n.bonuses.find(b => b.type === 'Research Speed')?.valuePerLevel || 0), 0) : 0)))))}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Main Action Trigger */}
                  <div className="mt-auto pt-2">
                    {isCurrentlyActive || isCurrentlyQueued ? (
                      <div className="w-full py-3 bg-zinc-900 border border-zinc-850 rounded-xl text-center text-zinc-450 text-[11px] font-mono">
                        {isCurrentlyActive ? '🔬 Break-through actively under-way' : '📋 Queued in Sovereign archives'}
                      </div>
                    ) : isMax ? (
                      <div className="w-full py-3 bg-zinc-950 border border-amber-900/30 text-amber-500 text-[11px] font-serif font-black uppercase tracking-widest text-center rounded-xl select-none">
                        All milestones achieved
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartResearch(node)}
                        disabled={!isAffordable || !unlocked || research.research_hall_level < 1}
                        className={`w-full py-3 rounded-xl font-serif text-xs font-black uppercase tracking-wider transition-all duration-150 border cursor-pointer ${
                          isAffordable && unlocked && research.research_hall_level >= 1
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-600 hover:brightness-110 text-black border-yellow-450 shadow-[0_0_15px_rgba(245,158,11,0.4)] active:scale-95'
                            : 'bg-zinc-900 border-zinc-850 text-zinc-650 cursor-not-allowed text-center'
                        }`}
                      >
                        {research.research_hall_level < 1 
                          ? 'Require Academy Hall 1+' 
                          : !unlocked 
                          ? 'Resolve Prerequisites' 
                          : !isAffordable 
                          ? 'Insufficient Assets' 
                          : research.activeResearch 
                          ? `Enlist to Queue (Lvl ${nextLvl})` 
                          : `Fund Research (Lvl ${nextLvl})`}
                      </button>
                    )}
                  </div>
                </div>
              );
            })() : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-zinc-500 border border-dashed border-zinc-900 rounded-2xl bg-zinc-950/40">
                <Info className="w-7 h-7 text-zinc-650 mb-2" />
                <span className="text-xs">No technology selected. Select any runestone on the tree to inspect details.</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
