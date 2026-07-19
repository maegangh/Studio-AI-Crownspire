import React from 'react';
import { Resources, ResourceRates } from '../types';
import { formatNum } from '../gameData';
import { 
  Cherry, 
  Trees, 
  Dumbbell, 
  Hammer, 
  Sparkles, 
  TrendingUp, 
  TrendingDown,
  Shield,
  Coins
} from 'lucide-react';

interface HeaderDashboardProps {
  resources: Resources;
  rates: ResourceRates;
  upkeeps: number; // Food upkeep cost
}

export default function HeaderDashboard({ resources, rates, upkeeps }: HeaderDashboardProps) {
  // Food net rate is base + building prod + map bonus - upkeep
  const netFoodRate = rates.food - upkeeps;

  const resourceConfig = [
    {
      id: 'food',
      name: 'Wheat',
      shortName: 'F',
      value: resources.food,
      rate: netFoodRate,
      icon: Cherry,
      iconColor: 'text-emerald-400',
      pillColor: 'bg-[#0f1d19]/80 border-emerald-950/60',
      tooltip: `Base & Buildings: +${rates.food.toFixed(1)}/s | Upkeep: -${upkeeps.toFixed(1)}/s`,
    },
    {
      id: 'wood',
      name: 'Timber',
      shortName: 'W',
      value: resources.wood,
      rate: rates.wood,
      icon: Trees,
      iconColor: 'text-amber-500',
      pillColor: 'bg-[#20160d]/80 border-amber-950/60',
      tooltip: `Base & Buildings: +${rates.wood.toFixed(1)}/s`,
    },
    {
      id: 'stone',
      name: 'Quarry',
      shortName: 'S',
      value: resources.stone,
      rate: rates.stone,
      icon: Dumbbell,
      iconColor: 'text-slate-300',
      pillColor: 'bg-[#18191d]/80 border-slate-900/60',
      tooltip: `Base & Buildings: +${rates.stone.toFixed(1)}/s`,
    },
    {
      id: 'iron',
      name: 'Ingots',
      shortName: 'I',
      value: resources.iron,
      rate: rates.iron,
      icon: Hammer,
      iconColor: 'text-blue-400',
      pillColor: 'bg-[#0f172a]/80 border-blue-950/60',
      tooltip: `Base & Buildings: +${rates.iron.toFixed(1)}/s`,
    },
    {
      id: 'valor',
      name: 'Valor',
      shortName: 'V',
      value: resources.valor,
      rate: rates.valor,
      icon: Sparkles,
      iconColor: 'text-yellow-400',
      pillColor: 'bg-[#261f0a]/80 border-yellow-950/60',
      tooltip: `Acquired through Shrines & Campaigns. Rate: +${rates.valor.toFixed(2)}/s`,
    },
  ];

  return (
    <div 
      id="header-floating-hud" 
      className="absolute top-14 left-1/2 -translate-x-1/2 w-[95%] z-30 select-none pointer-events-auto"
    >
      <div className="bg-[#0b0d13]/90 border border-amber-500/25 backdrop-blur-md px-2.5 py-1.5 rounded-2xl flex items-center justify-between gap-1 shadow-[0_12px_30px_rgba(0,0,0,0.85)] ring-1 ring-black/50">
        
        {/* Sleek status indicators row */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full">
          {resourceConfig.map((res) => {
            const isNegative = res.id === 'food' && netFoodRate < 0;
            const Icon = res.icon;
            
            return (
              <div
                id={`floating-hud-${res.id}`}
                key={res.id}
                title={res.tooltip}
                className={`flex-1 min-w-[65px] px-2 py-1 max-w-[90px] rounded-xl border flex flex-col items-center justify-center relative overflow-hidden transition-all duration-200 hover:scale-105 ${res.pillColor} ${
                  isNegative ? 'ring-1 ring-rose-500/50 animate-pulse' : ''
                }`}
              >
                {/* Background decorative shine */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-white/[0.03] pointer-events-none" />

                {/* Resource Pill top label */}
                <div className="flex items-center gap-1 justify-center">
                  <Icon className={`w-3 h-3 ${res.iconColor} shrink-0`} />
                  <span className="text-[8px] font-bold font-mono tracking-wider text-zinc-400 uppercase">
                    {res.shortName}
                  </span>
                </div>

                {/* Quantitive Amount */}
                <span className="text-[10px] font-black tracking-tight font-mono mt-0.5 text-zinc-100">
                  {formatNum(res.value)}
                </span>

                {/* Micro Yield indicators */}
                <div className="flex items-center gap-0.5 leading-none">
                  {res.rate !== 0 ? (
                    <span
                      className={`text-[7px] font-mono font-bold leading-none ${
                        isNegative
                          ? 'text-rose-400 animate-pulse'
                          : res.id === 'valor'
                          ? 'text-yellow-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {res.rate > 0 ? '+' : ''}
                      {res.rate.toFixed(1)}/s
                    </span>
                  ) : (
                    <span className="text-[7px] font-mono text-zinc-650 leading-none">-</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

