import React, { useState } from 'react';
import { UnitType, Resources, ResourceCost, TroopState } from '../types';
import { formatNum } from '../gameData';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Sword, 
  Target, 
  User, 
  Flame, 
  Hourglass, 
  Plus, 
  Star,
  Trash,
  Cross,
  Award,
  Crown,
  ShieldAlert,
  Sparkles,
  Wind,
  Hammer,
  Compass
} from 'lucide-react';

interface TrainingQueueItem {
  id: string;
  unitId: string;
  count: number;
  timeRemainingSec: number;
  totalTimeSec: number;
}

interface MilitaryTabProps {
  units: UnitType[];
  resources: Resources;
  trainingQueue: TrainingQueueItem[];
  recruitSpeedMultiplier: number; 
  troops: TroopState;
  onStartTraining: (unitId: string, count: number) => void;
  onCancelTraining: (jobId: string) => void;
  onInstantComplete?: (jobId: string) => void; 
  onHealWounded: (type: 'infantry' | 'marksmen' | 'cavalry', count: number) => void;
  playerPower: number;
}

const IconMap: { [key: string]: React.ComponentType<any> } = {
  User,
  Target,
  Sword,
  Shield,
  Award,
  Crown,
  ShieldAlert,
  Sparkles,
  Wind,
  Hammer,
  Compass
};

export default function MilitaryTab({ 
  units, 
  resources, 
  trainingQueue, 
  recruitSpeedMultiplier,
  troops,
  onStartTraining,
  onCancelTraining,
  onInstantComplete,
  onHealWounded,
  playerPower
}: MilitaryTabProps) {
  const [selectedBatchSize, setSelectedBatchSize] = useState<{ [key: string]: number }>(() => {
    const initial: { [key: string]: number } = {};
    units.forEach(u => {
      initial[u.id] = 1;
    });
    return initial;
  });

  const getBatchCost = (cost: ResourceCost, count: number): ResourceCost => {
    const batchCost: ResourceCost = {};
    (Object.keys(cost) as Array<keyof ResourceCost>).forEach((res) => {
      batchCost[res] = (cost[res] || 0) * count;
    });
    return batchCost;
  };

  const canAffordBatch = (cost: ResourceCost, count: number): boolean => {
    const batchCost = getBatchCost(cost, count);
    return (Object.keys(batchCost) as Array<keyof ResourceCost>).every((res) => {
      const needed = batchCost[res] || 0;
      const current = resources[res] || 0;
      return current >= needed;
    });
  };

  const totalUpkeep = units.reduce((acc, unit) => acc + (unit.count * unit.upkeepFood), 0);

  const incrementBatch = (unitId: string, maxLimit = 100) => {
    setSelectedBatchSize(prev => ({
      ...prev,
      [unitId]: Math.min(maxLimit, prev[unitId] + 1)
    }));
  };

  const decrementBatch = (unitId: string) => {
    setSelectedBatchSize(prev => ({
      ...prev,
      [unitId]: Math.max(1, prev[unitId] - 1)
    }));
  };

  const setBatchQuantity = (unitId: string, qty: number) => {
    setSelectedBatchSize(prev => ({
      ...prev,
      [unitId]: Math.max(1, qty)
    }));
  };

  const renderCostList = (cost: ResourceCost, count: number) => {
    const batchCost = getBatchCost(cost, count);
    return (
      <div className="flex flex-wrap gap-1 mt-1">
        {(Object.keys(batchCost) as Array<keyof ResourceCost>).map((res) => {
          const needed = batchCost[res] || 0;
          if (needed === 0) return null;
          const current = resources[res] || 0;
          const OK = current >= needed;
          
          let color = 'text-zinc-400 border-zinc-800 bg-zinc-950';
          if (!OK) color = 'text-rose-400 border-rose-950 bg-rose-950/20';

          return (
            <span key={res} className={`text-[9px] font-mono px-1 rounded border ${color}`}>
              {res.toUpperCase()}: {formatNum(needed)}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div id="military-tab-view" className="flex-1 overflow-y-auto px-4 py-3 space-y-3 pb-24">
      
      {/* 1. Combat Power Overview */}
      <div className="grid grid-cols-2 gap-2 bg-[#12141c]/80 border border-zinc-900 p-3 rounded-xl shadow-lg relative overflow-hidden">
        <div className="flex flex-col">
          <span className="text-[9.5px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1">
            <Sword className="w-3 h-3 text-red-500" /> Battalion Rating
          </span>
          <span className="text-lg font-bold font-mono text-zinc-100 flex items-baseline gap-1 mt-0.5">
            {formatNum(playerPower)}
            <span className="text-[10px] text-amber-500 font-normal">CR SCORE</span>
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9.5px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-1">
            <Flame className="w-3 h-3 text-emerald-400" /> Standing Food Upkeep
          </span>
          <span className="text-lg font-bold font-mono text-rose-400 flex items-baseline gap-1 mt-0.5">
            -{totalUpkeep.toFixed(1)}
            <span className="text-[10px] text-zinc-500 font-normal">/sec</span>
          </span>
        </div>
      </div>

      {/* 2. Command Staff Console (Godot TroopState Variable Monitor) */}
      <div id="general-command-console" className="bg-[#101217] border border-amber-500/10 p-3 rounded-xl space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-zinc-950">
          <h3 className="text-xs font-semibold text-amber-500 flex items-center gap-1.5 font-mono uppercase tracking-wider">
            <span>⚔️ General Staff Command Console</span>
          </h3>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${troops.is_training ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-650'}`} />
            <span className="text-[9px] font-mono text-zinc-400">
              {troops.is_training ? 'DRAFT_ACTIVE' : 'IDLE'}
            </span>
          </div>
        </div>

        {troops.is_training ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] font-mono">
              <span className="text-zinc-400">{troops.training_label_text}</span>
              <span className="text-amber-400 font-bold">{troops.training_time_left.toFixed(1)}s</span>
            </div>
            
            {/* Real-time sub-timers for individual squads */}
            <div className="grid grid-cols-3 gap-2 pt-1.5 border-t border-zinc-950">
              <div>
                <span className="text-[8px] font-mono text-zinc-550 block uppercase">Infantry Queue</span>
                <span className={`text-[10px] font-mono font-bold block ${troops.infantry_training_active ? 'text-amber-400' : 'text-zinc-600'}`}>
                  {troops.infantry_training_active ? `${troops.infantry_training_time_left.toFixed(1)}s` : 'IDLE'}
                </span>
              </div>
              <div>
                <span className="text-[8px] font-mono text-zinc-550 block uppercase">Marksmen Queue</span>
                <span className={`text-[10px] font-mono font-bold block ${troops.marksmen_training_active ? 'text-amber-450' : 'text-zinc-600'}`}>
                  {troops.marksmen_training_active ? `${troops.marksmen_training_time_left.toFixed(1)}s` : 'IDLE'}
                </span>
              </div>
              <div>
                <span className="text-[8px] font-mono text-zinc-550 block uppercase">Cavalry Queue</span>
                <span className={`text-[10px] font-mono font-bold block ${troops.cavalry_training_active ? 'text-amber-450' : 'text-zinc-600'}`}>
                  {troops.cavalry_training_active ? `${troops.cavalry_training_time_left.toFixed(1)}s` : 'IDLE'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-[10.5px] text-zinc-555 leading-normal italic text-center py-1 font-mono">
            No active drafts. Enlist cohorts in the roster below to reinforce the Sovereign Realm.
          </p>
        )}

        {/* Sanctuary Storage Stats matching sanctuary_capacity & sanctuary_troops */}
        <div className="pt-2 border-t border-zinc-950 flex items-center justify-between text-[9px] font-mono text-zinc-500">
          <span>Sanctuary Haven Capacity:</span>
          <span className="text-zinc-300 font-bold">{troops.sanctuary_troops} / {troops.sanctuary_capacity} Sanctuary Rooms</span>
        </div>
      </div>

      {/* 3. Field Hospital Sanctuary (Wounded recovery system) */}
      <div className="bg-[#101217] border border-red-950/30 p-3 rounded-xl">
        <div className="flex items-center justify-between mb-2 pb-1 border-b border-zinc-950">
          <h3 className="text-xs font-semibold text-rose-400 flex items-center gap-1.5 font-mono uppercase tracking-wider">
            <span>🏥 Sanctuary Recovery Hospital</span>
          </h3>
          <span className="text-[9px] font-mono text-zinc-500">
            Field Table capacity: {troops.hospital_capacity} Max
          </span>
        </div>

        <p className="text-[10.5px] text-zinc-400 mb-2.5 leading-relaxed">
          Wounded units from map conquests retreat to Hospital. Treat survivors at 30% standard recruitment cost!
        </p>

        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: 'infantry', name: 'Infantry', count: troops.wounded_infantry, food: Math.ceil(60 * 0.3), wood: Math.ceil(10 * 0.3) },
            { id: 'marksmen', name: 'Marksmen', count: troops.wounded_marksmen, food: Math.ceil(100 * 0.3), wood: Math.ceil(45 * 0.3) },
            { id: 'cavalry', name: 'Cavalry', count: troops.wounded_cavalry, food: Math.ceil(180 * 0.3), iron: Math.ceil(55 * 0.3) }
          ].map((item) => {
            const hasWounded = item.count > 0;
            return (
              <div key={item.id} className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-900 flex flex-col justify-between items-center text-center">
                <div>
                  <span className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-wider">{item.name}</span>
                  <span className={`text-sm font-extrabold font-mono block mt-1 ${hasWounded ? 'text-rose-450 animate-pulse' : 'text-zinc-650'}`}>
                    {item.count} Wounded
                  </span>
                </div>

                <button
                  onClick={() => onHealWounded(item.id as any, item.count)}
                  disabled={!hasWounded}
                  className={`w-full py-1 mt-2 font-mono text-[9.5px] rounded border transition-all ${
                    hasWounded 
                      ? 'bg-rose-950/40 border-rose-900/40 text-rose-300 hover:bg-rose-900 hover:text-white cursor-pointer font-bold' 
                      : 'bg-zinc-905 border-zinc-900 text-zinc-600 cursor-not-allowed'
                  }`}
                >
                  Treat Ward
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Training Queue */}
      {trainingQueue.length > 0 && (
        <div className="bg-amber-950/10 border border-amber-900/30 p-2.5 rounded-xl">
          <h3 className="text-xs font-semibold text-amber-500 mb-2 flex items-center gap-1.5 font-mono uppercase tracking-wider">
            <Hourglass className="w-3.5 h-3.5 animate-spin text-amber-500" /> Interactive Draft Schedules
          </h3>
          <div className="space-y-1.5">
            {trainingQueue.map((job) => {
              const unitDetails = units.find(u => u.id === job.unitId);
              const progressPct = ((job.totalTimeSec - job.timeRemainingSec) / job.totalTimeSec) * 100;

              return (
                <div key={job.id} className="bg-zinc-950 p-2 rounded-lg border border-zinc-90 w-full flex flex-col gap-1.5 relative overflow-hidden">
                  <div className="flex items-center justify-between text-[11px] z-10">
                    <span className="font-bold text-white">
                      Enlisting {job.count}x {unitDetails?.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-yellow-500 font-bold">
                        {job.timeRemainingSec}s remaining
                      </span>
                      <button 
                        onClick={() => onCancelTraining(job.id)}
                        className="text-zinc-500 hover:text-rose-400 cursor-pointer"
                        title="Cancel for full refund"
                      >
                        <Trash className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden border border-zinc-900 relative">
                    <div 
                      className="bg-amber-600 h-full rounded-full" 
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  {onInstantComplete && resources.valor >= 5 && (
                    <button
                      onClick={() => onInstantComplete(job.id)}
                      className="text-[9.5px] text-yellow-400 font-mono flex items-center gap-1 justify-end w-full"
                    >
                      <Star className="w-2.5 h-2.5 fill-current" /> Fast finish: 5 Valor
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Roster List */}
      <div className="space-y-3">
        {units
          .sort((a, b) => (a.tier || 1) - (b.tier || 1))
          .map((unit) => {
            const IconComp = IconMap[unit.iconName] || Sword;
            const batchCount = selectedBatchSize[unit.id] || 1;
            const affordable = canAffordBatch(unit.cost, batchCount);
            const rawDuration = unit.trainingTimeSec * recruitSpeedMultiplier;
            const totalDuration = Math.max(1, Math.round(rawDuration * batchCount));

          return (
            <div
              id={`unit-card-${unit.id}`}
              key={unit.id}
              className="p-3 bg-zinc-900/40 border border-zinc-800 rounded-2xl relative transition-all duration-300 hover:border-zinc-700"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex gap-2.5">
                  <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-900 text-amber-500 flex items-center justify-center">
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                      {unit.name}
                      <span className="font-mono text-zinc-500 text-[10px] font-normal">
                        ({unit.count} active)
                      </span>
                    </h4>
                    <p className="text-[10px] text-zinc-400 leading-normal mt-0.5">
                      {unit.description}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1 items-center">
                  <div className="bg-zinc-950 px-2 py-0.5 rounded text-center border border-zinc-900">
                    <span className="text-[8px] text-zinc-500 font-mono block">TIER</span>
                    <span className="text-[10px] font-extrabold font-mono text-amber-500">T{unit.tier || 1}</span>
                  </div>
                  <div className="bg-zinc-950 px-2 py-0.5 rounded text-right border border-zinc-900">
                    <span className="text-[8px] text-zinc-550 font-mono block">RATING</span>
                    <span className="text-[10px] font-extrabold font-mono text-emerald-400">+{unit.power} CR</span>
                  </div>
                </div>
              </div>

              {/* Upkeep info */}
              <div className="grid grid-cols-2 gap-2 mt-2.5 bg-zinc-950/60 p-2 rounded-lg text-[10.5px] font-mono text-zinc-400">
                <div className="flex justify-between">
                  <span className="text-zinc-550">Food upkeep:</span>
                  <span>-{unit.upkeepFood.toFixed(2)}/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-550">Draft timer:</span>
                  <span>{(unit.trainingTimeSec * recruitSpeedMultiplier).toFixed(1)}s</span>
                </div>
              </div>

              {/* Cost specifications */}
              <div className="mt-2 text-[10px]">
                <span className="text-[8px] font-mono uppercase tracking-wider text-zinc-500 block">Required material cost multiplier:</span>
                {renderCostList(unit.cost, batchCount)}
              </div>

              {/* Batch slider & Action */}
              <div className="mt-3 pt-2 border-t border-zinc-950 flex items-center justify-between gap-3">
                <div className="flex items-center bg-zinc-950 p-1 rounded-lg border border-zinc-900">
                  <button 
                    onClick={() => decrementBatch(unit.id)}
                    className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-zinc-900 rounded font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={batchCount}
                    onChange={(e) => setBatchQuantity(unit.id, parseInt(e.target.value) || 1)}
                    className="w-8 text-center font-mono text-xs text-white bg-transparent outline-none border-none font-semibold"
                  />
                  <button 
                    onClick={() => incrementBatch(unit.id)}
                    className="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-zinc-900 rounded font-bold cursor-pointer"
                  >
                    +
                  </button>

                  {/* fast selector */}
                  <button 
                    onClick={() => setBatchQuantity(unit.id, 10)}
                    className={`ml-1 px-1.5 py-0.5 text-[8.5px] font-mono rounded ${batchCount === 10 ? 'bg-amber-600 text-black font-bold' : 'text-zinc-400 bg-zinc-900'}`}
                  >
                    10x
                  </button>
                </div>

                <button
                  id={`train-unit-btn-${unit.id}`}
                  onClick={() => onStartTraining(unit.id, batchCount)}
                  disabled={!affordable}
                  className={`px-3 py-1.5 rounded-lg text-[10.5px] font-bold font-mono uppercase shadow-md flex items-center gap-1 transition-all ${
                    affordable
                      ? 'bg-amber-500 hover:bg-amber-400 text-black cursor-pointer'
                      : 'bg-zinc-905 text-zinc-550 border border-zinc-805 cursor-not-allowed'
                  }`}
                >
                  <Plus className="w-3 h-3" /> Draft ({totalDuration}s)
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
