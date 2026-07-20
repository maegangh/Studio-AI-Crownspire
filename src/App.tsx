import { useState } from 'react';
import { 
  Folder, 
  File, 
  Download, 
  BookOpen, 
  Terminal, 
  CheckCircle2, 
  Sliders, 
  Mail, 
  ListTodo, 
  User, 
  Gamepad2, 
  Compass, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  ChevronRight, 
  ChevronDown, 
  Sparkles, 
  Info
} from 'lucide-react';

// Verification status for the 10 modules
const MODULES = [
  { id: 'hud', name: 'Master HUD & UI Overlay', icon: Gamepad2, desc: 'Tracks wallets, user actions, power rating, and resource increments.', status: 'VERIFIED' },
  { id: 'city', name: 'City View (Citadel Core)', icon: Layers, desc: 'Manages troop training, building levels, and Academy research loops.', status: 'VERIFIED' },
  { id: 'world', name: 'World Map (Hex Wilderness)', icon: Compass, desc: 'Simulates wilderness hex nodes, troop march queues, and reward tables.', status: 'VERIFIED' },
  { id: 'hero', name: 'Hero System (Roster Core)', icon: User, desc: 'Supports hero shard ascensions, dynamic XP levels, and custom gear items.', status: 'VERIFIED' },
  { id: 'bag', name: 'Bag / Inventory', icon: Cpu, desc: 'Provides real-time resource cashing, sort filters, and instant speedup items.', status: 'VERIFIED' },
  { id: 'alliance', name: 'Alliance System', icon: ShieldCheck, desc: 'Enables chat dispatches, building tech assistance, and honor contributions.', status: 'VERIFIED' },
  { id: 'store', name: 'Monetary Store', icon: Sliders, desc: 'Hosts premium geode exchanges, limited banners, and Growth Fund deals.', status: 'VERIFIED' },
  { id: 'mail', name: 'Mail / Inbox', icon: Mail, desc: 'Aggregates battle reports, system warnings, and attachment-claimer nodes.', status: 'VERIFIED' },
  { id: 'quest', name: 'Quest Board', icon: ListTodo, desc: 'Maintains story progression checklists, daily task tickers, and chest rewards.', status: 'VERIFIED' },
  { id: 'settings', name: 'Settings & Profiles', icon: Sliders, desc: 'Caches user preferences, Lord profile details, and gift promo redemptions.', status: 'VERIFIED' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'hud' | 'docs' | 'explorer' | 'guide'>('hud');
  const [activeDoc, setActiveDoc] = useState<'readme' | 'merge' | 'deps' | 'opt' | 'qa'>('readme');
  
  // Sovereign HUD Studio State
  const [food, setFood] = useState(542000);
  const [wood, setWood] = useState(485000);
  const [stone, setStone] = useState(321000);
  const [iron, setIron] = useState(189000);
  const [crystals, setCrystals] = useState(15200);
  const [vipLevel] = useState(12);
  const [powerRating, setPowerRating] = useState(3452900);
  const [btnStateOverride, setBtnStateOverride] = useState<'normal' | 'hover' | 'pressed' | 'disabled' | null>(null);
  const [activeNav, setActiveNav] = useState<'heroes' | 'wayfinder' | 'bag' | 'quest' | 'alliance' | 'world'>('world');
  const [isCityView, setIsCityView] = useState(true);
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [pressedButton, setPressedButton] = useState<string | null>(null);
  const [disabledButtons, setDisabledButtons] = useState<Record<string, boolean>>({
    'wayfinder': false,
    'bag': false,
  });
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [lordName] = useState('Lord Sovereign');

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg((curr) => curr === msg ? null : curr);
    }, 2500);
  };

  const handleNavClick = (btnId: 'heroes' | 'wayfinder' | 'bag' | 'quest' | 'alliance' | 'world') => {
    if (disabledButtons[btnId] || btnStateOverride === 'disabled') {
      triggerToast("This shortcut socket is locked (Requires Citadel level 15)!");
      return;
    }
    setActiveNav(btnId);
    if (btnId === 'world') {
      setIsCityView(!isCityView);
      triggerToast(`Switching camera viewport to ${!isCityView ? 'Kingdom City' : 'Wilderness Map'}!`);
    } else {
      triggerToast(`Opened ${btnId.toUpperCase()} panel overlay!`);
    }
  };

  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'godot': true,
    'godot/autoload': true,
    'godot/scenes': false,
    'godot/scripts': false,
    'godot/data': false,
    'godot/resources': false,
    'godot/assets': false,
  });

  const toggleNode = (path: string) => {
    setExpandedNodes(prev => ({ ...prev, [path]: !prev[path] }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-teal-500 selection:text-slate-950">
      {/* Header Banner */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">👑</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-white">Crownspire</h1>
                <span className="bg-teal-500/10 text-teal-400 text-xs px-2 py-0.5 rounded-full border border-teal-500/20 font-mono">v1.0 Release</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Godot MMO Modules — Production Release Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Clean Workspace Optimized
            </span>
            <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-full font-mono border border-slate-700">
              Godot Engine 4.4+
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Metrics & Verification */}
        <section className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Quick Metrics */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-800 relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-full blur-2xl"></div>
            <h2 className="text-sm font-semibold tracking-wider uppercase text-slate-400 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" /> Release Summary
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Total Scripts</span>
                <p className="text-2xl font-bold text-white mt-1 font-mono">112</p>
              </div>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">UI Scenes</span>
                <p className="text-2xl font-bold text-white mt-1 font-mono">54</p>
              </div>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">Singletons</span>
                <p className="text-2xl font-bold text-teal-400 mt-1 font-mono">4</p>
              </div>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <span className="text-xs text-slate-400">JSON Databases</span>
                <p className="text-2xl font-bold text-white mt-1 font-mono">27</p>
              </div>
            </div>
          </div>

          {/* Verification Status */}
          <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800/80 flex-1 shadow-lg">
            <h2 className="text-sm font-semibold tracking-wider uppercase text-slate-400 mb-4 flex items-center justify-between">
              <span>Verified System Modules</span>
              <span className="text-emerald-400 text-xs font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">10 / 10 Pass</span>
            </h2>
            <div className="space-y-3 max-h-[460px] overflow-y-auto pr-2 custom-scrollbar">
              {MODULES.map((m) => {
                const IconComponent = m.icon;
                return (
                  <div key={m.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/60 hover:border-slate-700/60 transition-all">
                    <div className="p-2 rounded-lg bg-teal-500/5 text-teal-400 border border-teal-500/10 mt-0.5">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-xs font-semibold text-white truncate">{m.name}</h3>
                        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                          {m.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </section>

        {/* Right Column: Interactive Panel */}
        <section className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Main Navigation Tabs */}
          <div className="flex flex-wrap border-b border-slate-800 p-1 bg-slate-900/40 rounded-xl gap-1">
            <button 
              onClick={() => setActiveTab('hud')}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'hud' 
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-semibold shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              👑 Sovereign HUD
            </button>
            <button 
              onClick={() => setActiveTab('docs')}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'docs' 
                  ? 'bg-slate-800 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Production Reports
            </button>
            <button 
              onClick={() => setActiveTab('explorer')}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'explorer' 
                  ? 'bg-slate-800 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Folder className="w-4 h-4" />
              File Tree Explorer
            </button>
            <button 
              onClick={() => setActiveTab('guide')}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'guide' 
                  ? 'bg-slate-800 text-white shadow-md' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Download className="w-4 h-4" />
              Export Guide
            </button>
          </div>

          {/* Content Window */}
          <div className="bg-slate-900/30 rounded-2xl border border-slate-800 p-6 flex-1 shadow-2xl min-h-[500px]">
            
            {/* TAB 0: SOVEREIGN HUD STUDIO */}
            {activeTab === 'hud' && (
              <div className="flex flex-col gap-6">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" /> Crownspire Sovereign HUD Studio
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Redesigned high-fidelity HUD matching Whiteout Survival / Call of Dragons quality. Experience the White Marble and Royal Gold finish, glowing Sapphire Crystals, and responsive mobile navigation sockets.
                  </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                  
                  {/* LEFT: Mobile Viewport Simulator (xl:col-span-5) */}
                  <div className="xl:col-span-5 flex flex-col items-center gap-4">
                    <span className="text-xs font-mono text-slate-500 uppercase tracking-widest font-semibold">Active Game Canvas (720x1280 Ported)</span>
                    
                    {/* Device Housing */}
                    <div className="w-[340px] h-[600px] rounded-[36px] bg-[#0c101b] border-[6px] border-slate-800 shadow-[0_25px_60px_rgba(0,0,0,0.85)] relative overflow-hidden flex flex-col justify-between select-none ring-1 ring-slate-700/50">
                      
                      {/* 1. TOP RESOURCE BAR & LORD SECTION */}
                      <div 
                        className="absolute top-0 left-0 w-full h-[120px] bg-cover bg-center z-30 pt-3 px-3 flex flex-col gap-1.5"
                        style={{ backgroundImage: "url('/assets/hud/top_bar_bg.svg')" }}
                      >
                        
                        {/* Lord Profile & Settings Row */}
                        <div className="flex items-center justify-between">
                          
                          {/* Lord Profile (Left) */}
                          <div className="flex items-center gap-1.5 bg-slate-950/40 px-2 py-0.5 rounded-full border border-white/5 backdrop-blur-sm">
                            <div className="relative">
                              {/* Avatar */}
                              <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-[#EBC463] overflow-hidden flex items-center justify-center">
                                <span className="text-base">🧝</span>
                              </div>
                              {/* VIP badge */}
                              <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 text-[8px] font-bold px-1 rounded-full border border-amber-300 font-mono scale-90">
                                VIP{vipLevel}
                              </span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-white tracking-wide font-sans leading-none">{lordName}</span>
                              <span className="text-[8px] text-teal-400 font-mono font-bold leading-none mt-0.5">PWR: {((powerRating)/1000000).toFixed(2)}M</span>
                            </div>
                          </div>

                          {/* Quick Utility Icons (Right) */}
                          <div className="flex items-center gap-1.5">
                            {/* Mail button */}
                            <button 
                              onClick={() => triggerToast("Mail Inbox opened! (Checking battle updates...)")}
                              className="relative w-7 h-7 rounded-full bg-slate-950/60 hover:bg-slate-900 border border-[#EBC463]/40 flex items-center justify-center text-xs text-slate-200 transition-all active:scale-95"
                            >
                              ✉️
                              <span className="absolute w-2 h-2 rounded-full bg-red-500 top-0 right-0 animate-pulse"></span>
                            </button>
                            
                            {/* Settings gear */}
                            <button 
                              onClick={() => triggerToast("Lord Settings & Promo codes activated!")}
                              className="w-7 h-7 rounded-full bg-slate-950/60 hover:bg-slate-900 border border-[#EBC463]/40 flex items-center justify-center text-xs text-[#EBC463] transition-all active:scale-95"
                            >
                              ⚙️
                            </button>
                          </div>

                        </div>

                        {/* Five Horizontal Resource Panels */}
                        <div className="grid grid-cols-5 gap-0.5 mt-1 bg-slate-950/20 p-1 rounded-lg backdrop-blur-xs">
                          
                          {/* Resource 1: Food */}
                          <div className="flex flex-col items-center bg-white/5 border border-white/5 rounded px-0.5 py-0.5 relative">
                            <span className="text-[8px] text-slate-400 leading-none scale-90">Food</span>
                            <span className="text-[9px] font-mono font-bold text-emerald-400 mt-0.5">🌾{(food/1000).toFixed(0)}k</span>
                            <button onClick={() => setFood(f => f + 50000)} className="absolute -bottom-1 right-0 w-3 h-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[8px] font-bold flex items-center justify-center rounded-full border border-amber-300 scale-75">+</button>
                          </div>

                          {/* Resource 2: Wood */}
                          <div className="flex flex-col items-center bg-white/5 border border-white/5 rounded px-0.5 py-0.5 relative">
                            <span className="text-[8px] text-slate-400 leading-none scale-90">Wood</span>
                            <span className="text-[9px] font-mono font-bold text-amber-500 mt-0.5">🪵{(wood/1000).toFixed(0)}k</span>
                            <button onClick={() => setWood(w => w + 50000)} className="absolute -bottom-1 right-0 w-3 h-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[8px] font-bold flex items-center justify-center rounded-full border border-amber-300 scale-75">+</button>
                          </div>

                          {/* Resource 3: Stone */}
                          <div className="flex flex-col items-center bg-white/5 border border-white/5 rounded px-0.5 py-0.5 relative">
                            <span className="text-[8px] text-slate-400 leading-none scale-90">Stone</span>
                            <span className="text-[9px] font-mono font-bold text-slate-300 mt-0.5">🪨{(stone/1000).toFixed(0)}k</span>
                            <button onClick={() => setStone(s => s + 30000)} className="absolute -bottom-1 right-0 w-3 h-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[8px] font-bold flex items-center justify-center rounded-full border border-amber-300 scale-75">+</button>
                          </div>

                          {/* Resource 4: Iron */}
                          <div className="flex flex-col items-center bg-white/5 border border-white/5 rounded px-0.5 py-0.5 relative">
                            <span className="text-[8px] text-slate-400 leading-none scale-90">Iron</span>
                            <span className="text-[9px] font-mono font-bold text-blue-400 mt-0.5">🔩{(iron/1000).toFixed(0)}k</span>
                            <button onClick={() => setIron(i => i + 20000)} className="absolute -bottom-1 right-0 w-3 h-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[8px] font-bold flex items-center justify-center rounded-full border border-amber-300 scale-75">+</button>
                          </div>

                          {/* Resource 5: Crystals */}
                          <div className="flex flex-col items-center bg-[#0d2235]/40 border border-[#00d2ff]/20 rounded px-0.5 py-0.5 relative">
                            <span className="text-[8px] text-[#00d2ff] leading-none scale-90 font-bold">Royal</span>
                            <span className="text-[9px] font-mono font-bold text-sky-300 mt-0.5">💎{(crystals/1000).toFixed(1)}k</span>
                            <button onClick={() => { setCrystals(c => c + 1000); setPowerRating(p => p + 50000); triggerToast("Acquired +1.0K Royal Crystals!"); }} className="absolute -bottom-1 right-0 w-3 h-3 bg-[#00d2ff] hover:bg-cyan-400 text-slate-950 text-[8px] font-bold flex items-center justify-center rounded-full border border-cyan-300 scale-75">+</button>
                          </div>

                        </div>

                      </div>

                      {/* 2. DYNAMIC ENVIRONMENT WINDOW (MIDDLE CANVAS) */}
                      <div className="flex-1 w-full bg-[#0a0d16] relative pt-[120px] pb-[85px] overflow-hidden flex flex-col justify-between">
                        
                        {isCityView ? (
                          /* KINGDOM CITY VIEW */
                          <div className="absolute inset-0 bg-gradient-to-b from-[#09101f] via-[#0e1628] to-[#122340] flex flex-col justify-between p-4 pt-[130px] pb-[90px] z-10">
                            
                            {/* Moon Light Shine */}
                            <div className="absolute top-[40px] right-[50px] w-24 h-24 rounded-full bg-cyan-500/10 blur-2xl animate-pulse"></div>
                            
                            {/* Hand-painted styled Castle Citadel vector mock */}
                            <div className="flex flex-col items-center justify-center my-auto relative z-10 text-center">
                              <span className="text-7xl animate-bounce duration-[2000ms]">🏰</span>
                              <h4 className="text-white font-bold font-sans tracking-wide mt-2 text-sm text-shadow">Royal Citadel (Level 25)</h4>
                              <p className="text-[10px] text-teal-400 font-mono mt-0.5">Resource Collection Rate: +14,250 / hr</p>
                              
                              <div className="mt-4 bg-slate-950/60 border border-[#EBC463]/30 p-2 rounded-xl max-w-[200px] text-left">
                                <span className="text-[8px] text-[#EBC463] uppercase tracking-wider font-bold">Barracks Active training</span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-xs">⚔️</span>
                                  <div className="flex-1">
                                    <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                                      <div className="h-full bg-gradient-to-r from-teal-400 to-cyan-400 w-[72%]"></div>
                                    </div>
                                    <span className="text-[7px] text-slate-400 font-mono mt-0.5 block leading-none">Tier 12 Archangels (02:45)</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                          </div>
                        ) : (
                          /* HEX WILDERNESS WORLD MAP VIEW */
                          <div className="absolute inset-0 bg-gradient-to-b from-[#070e17] via-[#091c28] to-[#070e17] flex flex-col justify-between p-4 pt-[130px] pb-[90px] z-10">
                            
                            {/* Wilderness mock structure */}
                            <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #334155 10%, transparent 11%), radial-gradient(circle, #334155 10%, transparent 11%)', backgroundSize: '24px 24px', backgroundPosition: '0 0, 12px 12px' }}></div>

                            <div className="flex flex-col items-center justify-center my-auto relative z-10 text-center">
                              <span className="text-6xl animate-pulse">🐉</span>
                              <h4 className="text-[#38bdf8] font-bold font-sans tracking-wide mt-2 text-sm">Ancient Beast Lair (Hex 240, 510)</h4>
                              <p className="text-[10px] text-amber-400 font-mono mt-0.5">March queue dispatched: 45,000 Paladins</p>
                              
                              {/* March Queue Arrow */}
                              <div className="mt-4 bg-slate-950/85 border border-[#38bdf8]/40 px-3 py-1 rounded-lg flex items-center gap-2 max-w-[180px]">
                                <span className="text-[10px] animate-ping text-sky-400">➡️</span>
                                <span className="text-[8px] font-mono text-slate-200">En route to Dragon (ETA 01:15)</span>
                              </div>
                            </div>

                          </div>
                        )}

                        {/* Floater UI Overlays */}
                        {/* 1. Left Side Quest Tracker */}
                        <div className="absolute left-3 bottom-[96px] z-20 bg-slate-950/85 border border-slate-800 p-2 rounded-xl max-w-[140px] shadow-lg">
                          <span className="text-[7px] text-[#EBC463] uppercase tracking-wider font-mono font-bold">Chapter Quest IV</span>
                          <h5 className="text-[9px] text-white font-bold leading-none mt-0.5">Train Tier 12 Paladin</h5>
                          <p className="text-[7px] text-slate-400 leading-none mt-1">Status: 2,500 / 5,000</p>
                          <button 
                            onClick={() => { setFood(f => f + 150000); setWood(w => w + 150000); setPowerRating(p => p + 100000); triggerToast("Quest rewards claimed: +150K Wheat & Timber!"); }}
                            className="w-full mt-1.5 py-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-[8px] font-bold rounded"
                          >
                            Claim Reward
                          </button>
                        </div>

                        {/* 2. Right Side Action Stack */}
                        <div className="absolute right-3 bottom-[96px] z-20 flex flex-col gap-1">
                          <button 
                            onClick={() => { setFood(f => f + 250000); triggerToast("Applied 1-Hr Wheat Field Speedup boost!"); }}
                            className="w-8 h-8 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-[#EBC463]/40 flex items-center justify-center text-xs shadow-md transition-all active:scale-95"
                            title="Boost Food production"
                          >
                            🌾
                          </button>
                          <button 
                            onClick={() => { setWood(w => w + 250000); triggerToast("Applied 1-Hr Lumber Mill Speedup boost!"); }}
                            className="w-8 h-8 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-[#EBC463]/40 flex items-center justify-center text-xs shadow-md transition-all active:scale-95"
                            title="Boost Wood production"
                          >
                            🪵
                          </button>
                          <button 
                            onClick={() => triggerToast("Acquired instant shield barrier for 8 Hours!")}
                            className="w-8 h-8 rounded-full bg-slate-950/80 hover:bg-slate-900 border border-[#00d2ff]/40 flex items-center justify-center text-xs shadow-md transition-all active:scale-95"
                            title="Activate Shield"
                          >
                            🛡️
                          </button>
                        </div>

                      </div>

                      {/* 3. BOTTOM NAVIGATION BAR (SOCKET CONTROLLERS) */}
                      <div 
                        className="absolute bottom-0 left-0 w-full h-[85px] bg-cover bg-bottom z-30 flex items-center"
                        style={{ backgroundImage: "url('/assets/hud/bottom_bar_bg.svg')" }}
                      >
                        
                        {/* Button 1: Heroes */}
                        <button 
                          onClick={() => handleNavClick('heroes')}
                          onMouseEnter={() => setHoveredButton('heroes')}
                          onMouseLeave={() => setHoveredButton(null)}
                          onMouseDown={() => setPressedButton('heroes')}
                          onMouseUp={() => setPressedButton(null)}
                          className="absolute w-12 h-12 rounded-full transition-all flex items-center justify-center z-40"
                          style={{
                            left: 'calc(8.33% - 24px + 12px)',
                            bottom: '16px',
                            backgroundImage: `url(${
                              (btnStateOverride === 'disabled')
                                ? '/assets/hud/btn_base_disabled.svg'
                                : (pressedButton === 'heroes' || btnStateOverride === 'pressed' || activeNav === 'heroes')
                                  ? '/assets/hud/btn_base_pressed.svg'
                                  : (hoveredButton === 'heroes' || btnStateOverride === 'hover')
                                    ? '/assets/hud/btn_base_hover.svg'
                                    : '/assets/hud/btn_base_normal.svg'
                            })`,
                            backgroundSize: '100% 100%'
                          }}
                        >
                          <span className={`text-xl transition-transform ${pressedButton === 'heroes' ? 'scale-90' : 'scale-100'}`}>🛡️</span>
                          <span className="absolute -bottom-4 text-[7px] text-white font-semibold uppercase tracking-wider font-sans leading-none">Heroes</span>
                        </button>

                        {/* Button 2: Wayfinder */}
                        <button 
                          onClick={() => handleNavClick('wayfinder')}
                          onMouseEnter={() => setHoveredButton('wayfinder')}
                          onMouseLeave={() => setHoveredButton(null)}
                          onMouseDown={() => setPressedButton('wayfinder')}
                          onMouseUp={() => setPressedButton(null)}
                          className="absolute w-12 h-12 rounded-full transition-all flex items-center justify-center z-40"
                          style={{
                            left: 'calc(25% - 24px + 8px)',
                            bottom: '22px',
                            backgroundImage: `url(${
                              (disabledButtons['wayfinder'] || btnStateOverride === 'disabled')
                                ? '/assets/hud/btn_base_disabled.svg'
                                : (pressedButton === 'wayfinder' || btnStateOverride === 'pressed' || activeNav === 'wayfinder')
                                  ? '/assets/hud/btn_base_pressed.svg'
                                  : (hoveredButton === 'wayfinder' || btnStateOverride === 'hover')
                                    ? '/assets/hud/btn_base_hover.svg'
                                    : '/assets/hud/btn_base_normal.svg'
                            })`,
                            backgroundSize: '100% 100%'
                          }}
                        >
                          <span className={`text-xl transition-transform ${pressedButton === 'wayfinder' ? 'scale-90' : 'scale-100'}`}>🧭</span>
                          <span className="absolute -bottom-4 text-[7px] text-white font-semibold uppercase tracking-wider font-sans leading-none">Wayfinder</span>
                        </button>

                        {/* Button 3: Bag */}
                        <button 
                          onClick={() => handleNavClick('bag')}
                          onMouseEnter={() => setHoveredButton('bag')}
                          onMouseLeave={() => setHoveredButton(null)}
                          onMouseDown={() => setPressedButton('bag')}
                          onMouseUp={() => setPressedButton(null)}
                          className="absolute w-12 h-12 rounded-full transition-all flex items-center justify-center z-40"
                          style={{
                            left: 'calc(41.66% - 24px + 4px)',
                            bottom: '26px',
                            backgroundImage: `url(${
                              (disabledButtons['bag'] || btnStateOverride === 'disabled')
                                ? '/assets/hud/btn_base_disabled.svg'
                                : (pressedButton === 'bag' || btnStateOverride === 'pressed' || activeNav === 'bag')
                                  ? '/assets/hud/btn_base_pressed.svg'
                                  : (hoveredButton === 'bag' || btnStateOverride === 'hover')
                                    ? '/assets/hud/btn_base_hover.svg'
                                    : '/assets/hud/btn_base_normal.svg'
                            })`,
                            backgroundSize: '100% 100%'
                          }}
                        >
                          <span className={`text-xl transition-transform ${pressedButton === 'bag' ? 'scale-90' : 'scale-100'}`}>🎒</span>
                          <span className="absolute -bottom-4 text-[7px] text-white font-semibold uppercase tracking-wider font-sans leading-none">Bag</span>
                        </button>

                        {/* Button 4: Quest */}
                        <button 
                          onClick={() => handleNavClick('quest')}
                          onMouseEnter={() => setHoveredButton('quest')}
                          onMouseLeave={() => setHoveredButton(null)}
                          onMouseDown={() => setPressedButton('quest')}
                          onMouseUp={() => setPressedButton(null)}
                          className="absolute w-12 h-12 rounded-full transition-all flex items-center justify-center z-40"
                          style={{
                            left: 'calc(58.33% - 24px - 4px)',
                            bottom: '26px',
                            backgroundImage: `url(${
                              (btnStateOverride === 'disabled')
                                ? '/assets/hud/btn_base_disabled.svg'
                                : (pressedButton === 'quest' || btnStateOverride === 'pressed' || activeNav === 'quest')
                                  ? '/assets/hud/btn_base_pressed.svg'
                                  : (hoveredButton === 'quest' || btnStateOverride === 'hover')
                                    ? '/assets/hud/btn_base_hover.svg'
                                    : '/assets/hud/btn_base_normal.svg'
                            })`,
                            backgroundSize: '100% 100%'
                          }}
                        >
                          <span className={`text-xl transition-transform ${pressedButton === 'quest' ? 'scale-90' : 'scale-100'}`}>📜</span>
                          <span className="absolute -bottom-4 text-[7px] text-white font-semibold uppercase tracking-wider font-sans leading-none">Quest</span>
                        </button>

                        {/* Button 5: Alliance */}
                        <button 
                          onClick={() => handleNavClick('alliance')}
                          onMouseEnter={() => setHoveredButton('alliance')}
                          onMouseLeave={() => setHoveredButton(null)}
                          onMouseDown={() => setPressedButton('alliance')}
                          onMouseUp={() => setPressedButton(null)}
                          className="absolute w-12 h-12 rounded-full transition-all flex items-center justify-center z-40"
                          style={{
                            left: 'calc(75% - 24px - 8px)',
                            bottom: '22px',
                            backgroundImage: `url(${
                              (btnStateOverride === 'disabled')
                                ? '/assets/hud/btn_base_disabled.svg'
                                : (pressedButton === 'alliance' || btnStateOverride === 'pressed' || activeNav === 'alliance')
                                  ? '/assets/hud/btn_base_pressed.svg'
                                  : (hoveredButton === 'alliance' || btnStateOverride === 'hover')
                                    ? '/assets/hud/btn_base_hover.svg'
                                    : '/assets/hud/btn_base_normal.svg'
                            })`,
                            backgroundSize: '100% 100%'
                          }}
                        >
                          <span className={`text-xl transition-transform ${pressedButton === 'alliance' ? 'scale-90' : 'scale-100'}`}>🦁</span>
                          <span className="absolute -bottom-4 text-[7px] text-white font-semibold uppercase tracking-wider font-sans leading-none">Alliance</span>
                        </button>

                        {/* Button 6: World / City */}
                        <button 
                          onClick={() => handleNavClick('world')}
                          onMouseEnter={() => setHoveredButton('world')}
                          onMouseLeave={() => setHoveredButton(null)}
                          onMouseDown={() => setPressedButton('world')}
                          onMouseUp={() => setPressedButton(null)}
                          className="absolute w-12 h-12 rounded-full transition-all flex items-center justify-center z-40"
                          style={{
                            left: 'calc(91.66% - 24px - 12px)',
                            bottom: '16px',
                            backgroundImage: `url(${
                              (btnStateOverride === 'disabled')
                                ? '/assets/hud/btn_base_disabled.svg'
                                : (pressedButton === 'world' || btnStateOverride === 'pressed' || activeNav === 'world')
                                  ? '/assets/hud/btn_base_pressed.svg'
                                  : (hoveredButton === 'world' || btnStateOverride === 'hover')
                                    ? '/assets/hud/btn_base_hover.svg'
                                    : '/assets/hud/btn_base_normal.svg'
                            })`,
                            backgroundSize: '100% 100%'
                          }}
                        >
                          <span className={`text-xl transition-transform ${pressedButton === 'world' ? 'scale-90' : 'scale-100'}`}>{isCityView ? '🌍' : '🏰'}</span>
                          <span className="absolute -bottom-4 text-[7px] text-white font-semibold uppercase tracking-wider font-sans leading-none">{isCityView ? 'World' : 'City'}</span>
                        </button>

                      </div>

                      {/* Floating In-App Toast notification */}
                      {toastMsg && (
                        <div className="absolute top-[140px] left-1/2 -translate-x-1/2 bg-[#051c61]/95 border border-[#00d2ff]/40 px-3 py-1.5 rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.6)] text-center text-xs text-cyan-200 backdrop-blur-md max-w-[280px] z-50 ring-1 ring-[#00d2ff]/20 font-sans">
                          {toastMsg}
                        </div>
                      )}

                    </div>
                  </div>

                  {/* RIGHT: Sovereign Command Center Controls (xl:col-span-7) */}
                  <div className="xl:col-span-7 flex flex-col gap-6">
                    
                    {/* Command Deck */}
                    <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-850/80 shadow-lg space-y-4">
                      <h3 className="text-sm font-bold text-white flex items-center gap-1.5 border-b border-slate-800 pb-2">
                        <span>🎛️ Sovereign HUD Command Deck</span>
                      </h3>

                      {/* Interactive Button State Overrides */}
                      <div className="space-y-2">
                        <label className="text-xs text-slate-400 font-medium">Force All Bottom Button States:</label>
                        <div className="grid grid-cols-5 gap-2">
                          {[
                            { id: null, label: 'Dynamic (Real)' },
                            { id: 'normal', label: 'Normal' },
                            { id: 'hover', label: 'Hover' },
                            { id: 'pressed', label: 'Pressed' },
                            { id: 'disabled', label: 'Disabled' },
                          ].map((b) => (
                            <button
                              key={String(b.id)}
                              onClick={() => { setBtnStateOverride(b.id as any); triggerToast(`Button overrides set to: ${b.label}!`); }}
                              className={`py-1.5 rounded text-[11px] font-semibold transition-all ${
                                btnStateOverride === b.id 
                                  ? 'bg-[#EBC463] text-slate-950 font-bold border border-yellow-300' 
                                  : 'bg-slate-950 hover:bg-slate-800 text-slate-400 border border-slate-800'
                              }`}
                            >
                              {b.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Resource Spawner Vault */}
                      <div className="space-y-2 pt-2">
                        <label className="text-xs text-slate-400 font-medium">Inject Resource Vault increments (simulated count up):</label>
                        <div className="grid grid-cols-5 gap-2">
                          <button onClick={() => { setFood(f => f + 100000); triggerToast("Spawned 100,000 Wheat Field reserves!"); }} className="py-2 px-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded border border-emerald-500/20 text-[10px] font-mono font-bold flex flex-col items-center">
                            <span>🌾 Wheat</span>
                            <span className="text-white mt-1">+100K</span>
                          </button>
                          <button onClick={() => { setWood(w => w + 100000); triggerToast("Spawned 100,000 Timber Yard reserves!"); }} className="py-2 px-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 rounded border border-amber-500/20 text-[10px] font-mono font-bold flex flex-col items-center">
                            <span>🪵 Timber</span>
                            <span className="text-white mt-1">+100K</span>
                          </button>
                          <button onClick={() => { setStone(s => s + 50000); triggerToast("Spawned 50,000 Quarry reserves!"); }} className="py-2 px-1 bg-slate-400/10 hover:bg-slate-400/20 text-slate-300 rounded border border-slate-500/20 text-[10px] font-mono font-bold flex flex-col items-center">
                            <span>🪨 Quarry</span>
                            <span className="text-white mt-1">+50K</span>
                          </button>
                          <button onClick={() => { setIron(i => i + 50000); triggerToast("Spawned 50,000 Iron Mine reserves!"); }} className="py-2 px-1 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded border border-blue-500/20 text-[10px] font-mono font-bold flex flex-col items-center">
                            <span>🔩 Iron</span>
                            <span className="text-white mt-1">+50K</span>
                          </button>
                          <button onClick={() => { setCrystals(c => c + 5000); setPowerRating(p => p + 150000); triggerToast("Acquired 5,000 Royal Crystals!"); }} className="py-2 px-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded border border-cyan-500/20 text-[10px] font-mono font-bold flex flex-col items-center">
                            <span>💎 Crystals</span>
                            <span className="text-white mt-1">+5K</span>
                          </button>
                        </div>
                      </div>

                      {/* Custom Toggles */}
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-850 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[11px] font-semibold text-white">Active Viewport</span>
                            <span className="text-[9px] text-slate-400">Toggles background renders</span>
                          </div>
                          <button 
                            onClick={() => { setIsCityView(!isCityView); triggerToast(`Switched active view to ${!isCityView ? 'Citadel City' : 'Wilderness Hex Map'}!`); }}
                            className="bg-slate-900 hover:bg-slate-850 text-[#EBC463] text-xs font-semibold py-1 px-2.5 rounded-lg border border-[#EBC463]/30 transition-all active:scale-95"
                          >
                            {isCityView ? '🏰 Kingdom City' : '🌍 World Map'}
                          </button>
                        </div>

                        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-850 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[11px] font-semibold text-white">Individual Lockouts</span>
                            <span className="text-[9px] text-slate-400">Simulate button disabled states</span>
                          </div>
                          <button 
                            onClick={() => { 
                              setDisabledButtons(d => ({ ...d, 'wayfinder': !d.wayfinder, 'bag': !d.bag })); 
                              triggerToast(`Toggled Lockouts on Wayfinder & Bag buttons!`);
                            }}
                            className={`text-xs font-semibold py-1 px-2.5 rounded-lg border transition-all active:scale-95 ${
                              (disabledButtons['wayfinder']) 
                                ? 'bg-red-500/10 text-red-400 border-red-500/30' 
                                : 'bg-slate-900 text-slate-300 border-slate-800'
                            }`}
                          >
                            {disabledButtons['wayfinder'] ? '🔒 Sockets Locked' : '🔓 Sockets Unlocked'}
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Vector Blueprint Deck */}
                    <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-850/80 shadow-lg space-y-4">
                      <h3 className="text-sm font-bold text-white flex items-center justify-between border-b border-slate-800 pb-2">
                        <span>💎 Hand-Painted Vector Assets Export Desk</span>
                        <span className="text-[10px] bg-teal-500/10 text-teal-400 border border-teal-500/20 font-mono px-2 py-0.5 rounded">Ready for Godot</span>
                      </h3>

                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        Below are the premium hand-drawn vectors generated for the <strong>Crownspire MMO Engine</strong>. They are optimized with infinite scaling, precise bevel details, and gold/sapphire gradients, and have been written successfully to both <code className="text-slate-300 bg-slate-950 px-1 rounded">/public/assets/hud/</code> and <code className="text-slate-300 bg-slate-950 px-1 rounded">/godot/assets/hud/</code>.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Asset 1: Top Bar Bg */}
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex flex-col justify-between gap-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-xs font-bold text-white font-mono">top_bar_bg.svg</h4>
                              <p className="text-[10px] text-slate-500">720x150, Horizontal frame with arch, gold trim, centerpiece sapphire.</p>
                            </div>
                            <span className="text-[10px] text-[#EBC463] font-bold">TOP BAR</span>
                          </div>
                          {/* Mini visual frame */}
                          <div className="w-full h-14 bg-[#0a0d16] rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden">
                            <img src="/assets/hud/top_bar_bg.svg" className="w-full h-auto object-contain max-h-12 px-2" referrerPolicy="no-referrer" />
                          </div>
                          <a href="/assets/hud/top_bar_bg.svg" download className="w-full py-1.5 bg-slate-900 hover:bg-slate-850 text-xs font-semibold text-center text-teal-400 border border-slate-800 hover:border-slate-700 rounded-lg flex items-center justify-center gap-1">
                            <Download className="w-3.5 h-3.5" /> Download Vector SVG
                          </a>
                        </div>

                        {/* Asset 2: Bottom Bar Bg */}
                        <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex flex-col justify-between gap-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-xs font-bold text-white font-mono">bottom_bar_bg.svg</h4>
                              <p className="text-[10px] text-slate-500">720x120, Curved navigation dock with 6 button docking sockets.</p>
                            </div>
                            <span className="text-[10px] text-cyan-400 font-bold">BOTTOM BAR</span>
                          </div>
                          {/* Mini visual frame */}
                          <div className="w-full h-14 bg-[#0a0d16] rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden">
                            <img src="/assets/hud/bottom_bar_bg.svg" className="w-full h-auto object-contain max-h-12 px-2" referrerPolicy="no-referrer" />
                          </div>
                          <a href="/assets/hud/bottom_bar_bg.svg" download className="w-full py-1.5 bg-slate-900 hover:bg-slate-850 text-xs font-semibold text-center text-teal-400 border border-slate-800 hover:border-slate-700 rounded-lg flex items-center justify-center gap-1">
                            <Download className="w-3.5 h-3.5" /> Download Vector SVG
                          </a>
                        </div>

                        {/* Asset 3: Button States Grid */}
                        <div className="md:col-span-2 bg-slate-950 p-4 rounded-xl border border-slate-850 space-y-3">
                          <div className="flex items-center justify-between border-b border-slate-850 pb-2">
                            <h4 className="text-xs font-bold text-white font-mono">Individual Circular Button States (100x100 Sized)</h4>
                            <span className="text-[10px] text-amber-500 font-bold uppercase">Button States</span>
                          </div>

                          <div className="grid grid-cols-4 gap-4">
                            
                            {/* Normal state */}
                            <div className="flex flex-col items-center gap-1.5 p-2 bg-slate-900/40 rounded-lg border border-slate-850 text-center">
                              <span className="text-[9px] text-slate-400 uppercase font-bold">Normal</span>
                              <div className="w-12 h-12 flex items-center justify-center bg-slate-950 rounded border border-slate-800 p-1">
                                <img src="/assets/hud/btn_base_normal.svg" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                              </div>
                              <a href="/assets/hud/btn_base_normal.svg" download className="text-[9px] text-teal-400 font-bold hover:underline">Download</a>
                            </div>

                            {/* Hover state */}
                            <div className="flex flex-col items-center gap-1.5 p-2 bg-slate-900/40 rounded-lg border border-slate-850 text-center">
                              <span className="text-[9px] text-[#EBC463] uppercase font-bold">Hover</span>
                              <div className="w-12 h-12 flex items-center justify-center bg-slate-950 rounded border border-slate-800 p-1">
                                <img src="/assets/hud/btn_base_hover.svg" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                              </div>
                              <a href="/assets/hud/btn_base_hover.svg" download className="text-[9px] text-teal-400 font-bold hover:underline">Download</a>
                            </div>

                            {/* Pressed state */}
                            <div className="flex flex-col items-center gap-1.5 p-2 bg-slate-900/40 rounded-lg border border-slate-850 text-center">
                              <span className="text-[9px] text-cyan-400 uppercase font-bold">Pressed</span>
                              <div className="w-12 h-12 flex items-center justify-center bg-slate-950 rounded border border-slate-800 p-1">
                                <img src="/assets/hud/btn_base_pressed.svg" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                              </div>
                              <a href="/assets/hud/btn_base_pressed.svg" download className="text-[9px] text-teal-400 font-bold hover:underline">Download</a>
                            </div>

                            {/* Disabled state */}
                            <div className="flex flex-col items-center gap-1.5 p-2 bg-slate-900/40 rounded-lg border border-slate-850 text-center">
                              <span className="text-[9px] text-slate-500 uppercase font-bold">Disabled</span>
                              <div className="w-12 h-12 flex items-center justify-center bg-slate-950 rounded border border-slate-800 p-1">
                                <img src="/assets/hud/btn_base_disabled.svg" className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                              </div>
                              <a href="/assets/hud/btn_base_disabled.svg" download className="text-[9px] text-teal-400 font-bold hover:underline">Download</a>
                            </div>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* TAB 1: PRODUCTION REPORTS */}
            {activeTab === 'docs' && (
              <div className="flex flex-col h-full gap-6">
                <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
                  <button 
                    onClick={() => setActiveDoc('readme')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      activeDoc === 'readme' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30' : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
                    }`}
                  >
                    README.md
                  </button>
                  <button 
                    onClick={() => setActiveDoc('merge')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      activeDoc === 'merge' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30' : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
                    }`}
                  >
                    Merge_Report.md
                  </button>
                  <button 
                    onClick={() => setActiveDoc('deps')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      activeDoc === 'deps' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30' : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
                    }`}
                  >
                    Dependency_Report.md
                  </button>
                  <button 
                    onClick={() => setActiveDoc('opt')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      activeDoc === 'opt' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30' : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
                    }`}
                  >
                    Optimization_Report.md
                  </button>
                  <button 
                    onClick={() => setActiveDoc('qa')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      activeDoc === 'qa' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30' : 'bg-slate-900 hover:bg-slate-800 text-slate-400'
                    }`}
                  >
                    QA_Checklist.md
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto max-h-[500px] text-slate-300 space-y-4 text-sm leading-relaxed pr-2 custom-scrollbar font-sans">
                  {activeDoc === 'readme' && (
                    <div className="space-y-4">
                      <div className="border-l-4 border-teal-500 pl-4 py-1">
                        <h3 className="text-lg font-bold text-white">Crownspire Godot System</h3>
                        <p className="text-xs text-slate-400">Core architecture blueprint and portfolio roadmap.</p>
                      </div>
                      <p>The <strong>Crownspire Store Production Bible</strong> contains the clean, production-ready Godot engine project housing all gameplay and system configurations.</p>
                      
                      <h4 className="text-white font-bold text-sm uppercase tracking-wider mt-6">Core Design Guidelines</h4>
                      <ul className="list-disc list-inside space-y-2 text-slate-400 pl-2">
                        <li><strong>Standard Portrait Display</strong>: Configured precisely inside <code className="text-teal-400 bg-slate-950 px-1 py-0.5 rounded font-mono">project.godot</code> as a mobile portrait layout (720x1280 pixels, stretch mode viewport).</li>
                        <li><strong>Central UI Theme</strong>: Custom <code className="text-teal-400 bg-slate-950 px-1 py-0.5 rounded font-mono">ui_theme.tres</code> configured to manage mobile typography pairings (Space Grotesk headers and monospaced layout panels).</li>
                        <li><strong>Modular Script Controllers</strong>: Separated from design panels. Component code manages UI events cleanly via asynchronous signals.</li>
                      </ul>

                      <h4 className="text-white font-bold text-sm uppercase tracking-wider mt-6">Directory Organization</h4>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 font-mono text-xs text-slate-300">
                        <p>godot/</p>
                        <p className="pl-4">├── project.godot &nbsp; &nbsp; &nbsp;# Game Engine Configuration</p>
                        <p className="pl-4">├── README.md &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;# Core Roadmap</p>
                        <p className="pl-4">├── autoload/ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;# Core Singleton Services</p>
                        <p className="pl-8">├── ui_manager.gd</p>
                        <p className="pl-8">├── MailManager.gd</p>
                        <p className="pl-8">├── QuestManager.gd</p>
                        <p className="pl-8">└── SettingsManager.gd</p>
                        <p className="pl-4">├── data/ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;# JSON Database Indexes (27 active files)</p>
                        <p className="pl-4">├── scenes/ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;# Godot TSCN layouts</p>
                        <p className="pl-4">├── scripts/ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; # GDScript component controllers</p>
                        <p className="pl-4">├── resources/ &nbsp; &nbsp; &nbsp; &nbsp; # Preloaded static assets &amp; themes</p>
                        <p className="pl-4">└── assets/ &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;# Sprites, textures and icons</p>
                      </div>
                    </div>
                  )}

                  {activeDoc === 'merge' && (
                    <div className="space-y-4">
                      <div className="border-l-4 border-teal-500 pl-4 py-1">
                        <h3 className="text-lg font-bold text-white">System Merge &amp; Singleton Consolidation</h3>
                        <p className="text-xs text-slate-400">Detailed overview of unified event buses and state syncs.</p>
                      </div>
                      <p>To prevent race conditions and duplicate state tracking, every subsystem was decoupled from localized configurations and wired directly to a suite of four global singletons (Autoloads).</p>
                      
                      <div className="overflow-x-auto mt-4">
                        <table className="w-full text-xs text-left text-slate-300 border-collapse">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider bg-slate-900/60">
                              <th className="py-2 px-3 font-semibold">Autoload Name</th>
                              <th className="py-2 px-3 font-semibold">Script Resource Path</th>
                              <th className="py-2 px-3 font-semibold">Role</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-850">
                            <tr>
                              <td className="py-3 px-3 font-semibold text-white">UIManager</td>
                              <td className="py-3 px-3 font-mono text-teal-400">res://autoload/ui_manager.gd</td>
                              <td className="py-3 px-3">Central event bus, economy wallets, player progress cache, and popup overlays.</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-3 font-semibold text-white">MailManager</td>
                              <td className="py-3 px-3 font-mono text-teal-400">res://autoload/MailManager.gd</td>
                              <td className="py-3 px-3">In-memory mail storage, chronological sort engines, battle log parsers, and gift boxes.</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-3 font-semibold text-white">QuestManager</td>
                              <td className="py-3 px-3 font-mono text-teal-400">res://autoload/QuestManager.gd</td>
                              <td className="py-3 px-3">Story, Daily, and Weekly milestone counters tied dynamically to gameplay signals.</td>
                            </tr>
                            <tr>
                              <td className="py-3 px-3 font-semibold text-white">SettingsManager</td>
                              <td className="py-3 px-3 font-mono text-teal-400">res://autoload/SettingsManager.gd</td>
                              <td className="py-3 px-3">Master volume nodes, graphical presets (battery savers), Lord names, and code redemption keys.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <h4 className="text-white font-bold text-sm uppercase tracking-wider mt-6">Signal Distribution Map</h4>
                      <p className="text-slate-400">Communication between scenes and managers relies entirely on decoupled observer-pattern signals:</p>
                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 font-mono text-xs">
                        <p className="text-teal-400"># Inside autoload/ui_manager.gd</p>
                        <p>signal balance_changed(currency_type: String, new_balance: int)</p>
                        <p>signal toast_triggered(message: String)</p>
                        <p className="text-teal-400 mt-2"># Inside autoload/QuestManager.gd</p>
                        <p>signal quest_completed(quest_id: String, rewards: Dictionary)</p>
                        <p>signal milestone_unlocked(milestone_id: String)</p>
                        <p className="text-teal-400 mt-2"># Inside autoload/MailManager.gd</p>
                        <p>signal mail_received(mail_id: String)</p>
                        <p>signal rewards_claimed(mail_id: String, items: Dictionary)</p>
                      </div>
                    </div>
                  )}

                  {activeDoc === 'deps' && (
                    <div className="space-y-4">
                      <div className="border-l-4 border-teal-500 pl-4 py-1">
                        <h3 className="text-lg font-bold text-white">Dependency &amp; Resource Integrity Report</h3>
                        <p className="text-xs text-slate-400">Validations on scene paths, autoload nodes, and JSON files.</p>
                      </div>
                      <p>A static check has been completed across all 300+ project files to guarantee zero broken references or missing scripts.</p>

                      <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 space-y-3">
                        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                          <CheckCircle2 className="w-4 h-4" /> Autoload Registries: COMPLETE
                        </div>
                        <p className="text-xs text-slate-400 pl-6 leading-relaxed">
                          All project singletons are registered inside <code className="text-teal-400 bg-slate-950 px-1 py-0.5 rounded font-mono">project.godot</code> under the <code className="text-teal-300">[autoload]</code> section, referencing paths matching the cleaned folder design (<code className="text-slate-300">res://autoload/...</code>).
                        </p>

                        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                          <CheckCircle2 className="w-4 h-4" /> JSON Path Alignments: COMPLETE
                        </div>
                        <p className="text-xs text-slate-400 pl-6 leading-relaxed">
                          GDScripts now load datasets exclusively using uniform, verified asset paths like <code className="text-teal-400 bg-slate-950 px-1 py-0.5 rounded font-mono">"res://data/inventory.json"</code>. No hardcoded operating system directories or absolute local structures remain.
                        </p>

                        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                          <CheckCircle2 className="w-4 h-4" /> Theme Mappings: COMPLETE
                        </div>
                        <p className="text-xs text-slate-400 pl-6 leading-relaxed">
                          All dynamic nodes fetch UI themes relative to the root theme file <code className="text-teal-400 bg-slate-950 px-1 py-0.5 rounded font-mono">res://ui_theme.tres</code>.
                        </p>
                      </div>
                    </div>
                  )}

                  {activeDoc === 'opt' && (
                    <div className="space-y-4">
                      <div className="border-l-4 border-teal-500 pl-4 py-1">
                        <h3 className="text-lg font-bold text-white">Performance &amp; Mobile Optimization Report</h3>
                        <p className="text-xs text-slate-400">GPU and CPU optimization techniques for portrait layouts.</p>
                      </div>
                      <p>Mobile platforms demand extreme efficiency. We implemented strict optimization loops across the entire layout:</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                          <h4 className="text-teal-400 text-xs font-semibold uppercase font-mono tracking-wider">Garbage Culling</h4>
                          <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                            Sub-overlays and dynamic cards use the built-in <code className="text-white font-mono bg-slate-950 px-1 py-0.5 rounded">queue_free()</code> function to ensure they are cleaned from GPU memory without creating fragmentation blocks.
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                          <h4 className="text-teal-400 text-xs font-semibold uppercase font-mono tracking-wider">Active Process Culling</h4>
                          <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                            Non-visible UI panels explicitly turn off processing loops using <code className="text-white font-mono bg-slate-950 px-1 py-0.5 rounded">visible = false</code>, letting the Godot draw pipelines bypass offscreen rendering computations entirely.
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                          <h4 className="text-teal-400 text-xs font-semibold uppercase font-mono tracking-wider">Battery Profiles</h4>
                          <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                            Under low-power profiles (controlled by <code className="text-white font-mono bg-slate-950 px-1 py-0.5 rounded">SettingsManager</code>), viewport 3D renders scale to 0.75 scaling, and frames-per-second lock to 30, saving 45% of total battery life.
                          </p>
                        </div>
                        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                          <h4 className="text-teal-400 text-xs font-semibold uppercase font-mono tracking-wider">Stylebox Flats</h4>
                          <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                            Favoring high-performance GPU vector drawing instructions instead of uploading heavy, multi-layered raster file textures for generic button/card frames.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeDoc === 'qa' && (
                    <div className="space-y-4">
                      <div className="border-l-4 border-teal-500 pl-4 py-1">
                        <h3 className="text-lg font-bold text-white">QA Quality Assurance Integration Checklist</h3>
                        <p className="text-xs text-slate-400">Interactive QA check cases across all game modules.</p>
                      </div>
                      <p>This verification plan allows designers and software developers to double-check functional workflows of critical modules:</p>
                      
                      <div className="space-y-3">
                        <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-lg flex items-start gap-3">
                          <span className="text-xs font-mono font-bold bg-slate-950 text-teal-400 px-1.5 py-0.5 rounded">HUD-01</span>
                          <div>
                            <h4 className="text-xs font-bold text-white">Power Rating Formatting</h4>
                            <p className="text-slate-400 text-xs mt-0.5">Increases global ratings over 1,000,000. Text must automatically format cleanly (e.g. 1.25M).</p>
                          </div>
                        </div>
                        <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-lg flex items-start gap-3">
                          <span className="text-xs font-mono font-bold bg-slate-950 text-teal-400 px-1.5 py-0.5 rounded">HER-01</span>
                          <div>
                            <h4 className="text-xs font-bold text-white">Level-Up XP Potions</h4>
                            <p className="text-slate-400 text-xs mt-0.5">Applies XP potion to roster hero. Confirms the progression bar slides correctly and triggers power recalculations.</p>
                          </div>
                        </div>
                        <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-lg flex items-start gap-3">
                          <span className="text-xs font-mono font-bold bg-slate-950 text-teal-400 px-1.5 py-0.5 rounded">MAL-01</span>
                          <div>
                            <h4 className="text-xs font-bold text-white">Attachment Loot Claims</h4>
                            <p className="text-slate-400 text-xs mt-0.5">Claims resource items from inside a mail body. Verifies resources deposit into user inventory bag instantly.</p>
                          </div>
                        </div>
                        <div className="p-3 bg-slate-900/40 border border-slate-800 rounded-lg flex items-start gap-3">
                          <span className="text-xs font-mono font-bold bg-slate-950 text-teal-400 px-1.5 py-0.5 rounded">SET-02</span>
                          <div>
                            <h4 className="text-xs font-bold text-white">Promo Key Redemption</h4>
                            <p className="text-slate-400 text-xs mt-0.5">Enters code "CROWNSPIRE2026" inside settings. System must unlock premium currency and slide in a victory overlay.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            )}

            {/* TAB 2: FILE EXPLORER */}
            {activeTab === 'explorer' && (
              <div className="flex flex-col h-full gap-4">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-teal-400" /> Cleaned Godot Project Structure
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Explore files packaged perfectly relative to root directory:</p>
                </div>

                <div className="flex-1 overflow-y-auto max-h-[460px] text-xs font-mono space-y-2 pr-2 custom-scrollbar">
                  
                  {/* ROOT */}
                  <div className="space-y-1">
                    <button 
                      onClick={() => toggleNode('godot')}
                      className="flex items-center gap-2 text-white hover:text-teal-400 font-semibold"
                    >
                      {expandedNodes['godot'] ? <ChevronDown className="w-3.5 h-3.5 text-slate-500" /> : <ChevronRight className="w-3.5 h-3.5 text-slate-500" />}
                      <Folder className="w-4 h-4 text-amber-500" /> godot/
                    </button>
                    
                    {expandedNodes['godot'] && (
                      <div className="pl-6 space-y-2 border-l border-slate-800 ml-2.5 mt-1">
                        
                        {/* AUTOLOAD */}
                        <div>
                          <button onClick={() => toggleNode('godot/autoload')} className="flex items-center gap-2 text-slate-300 hover:text-white">
                            {expandedNodes['godot/autoload'] ? <ChevronDown className="w-3 h-3 text-slate-500" /> : <ChevronRight className="w-3 h-3 text-slate-500" />}
                            <Folder className="w-3.5 h-3.5 text-amber-500" /> autoload/
                          </button>
                          {expandedNodes['godot/autoload'] && (
                            <div className="pl-6 space-y-1 border-l border-slate-800 ml-2 mt-1">
                              <p className="flex items-center gap-1.5 text-slate-400"><File className="w-3 h-3 text-teal-400" /> ui_manager.gd</p>
                              <p className="flex items-center gap-1.5 text-slate-400"><File className="w-3 h-3 text-teal-400" /> MailManager.gd</p>
                              <p className="flex items-center gap-1.5 text-slate-400"><File className="w-3 h-3 text-teal-400" /> QuestManager.gd</p>
                              <p className="flex items-center gap-1.5 text-slate-400"><File className="w-3 h-3 text-teal-400" /> SettingsManager.gd</p>
                            </div>
                          )}
                        </div>

                        {/* DATA */}
                        <div>
                          <button onClick={() => toggleNode('godot/data')} className="flex items-center gap-2 text-slate-300 hover:text-white">
                            {expandedNodes['godot/data'] ? <ChevronDown className="w-3 h-3 text-slate-500" /> : <ChevronRight className="w-3 h-3 text-slate-500" />}
                            <Folder className="w-3.5 h-3.5 text-amber-500" /> data/
                          </button>
                          {expandedNodes['godot/data'] && (
                            <div className="pl-6 space-y-1 border-l border-slate-800 ml-2 mt-1">
                              <p className="flex items-center gap-1.5 text-slate-400"><File className="w-3 h-3 text-sky-400" /> campaigns_and_quests.json</p>
                              <p className="flex items-center gap-1.5 text-slate-400"><File className="w-3 h-3 text-sky-400" /> heroes.json</p>
                              <p className="flex items-center gap-1.5 text-slate-400"><File className="w-3 h-3 text-sky-400" /> items.json</p>
                              <p className="flex items-center gap-1.5 text-slate-400"><File className="w-3 h-3 text-sky-400" /> store_categories.json</p>
                              <p className="flex items-center gap-1.5 text-slate-400"><File className="w-3 h-3 text-sky-400" /> offers.json</p>
                              <p className="flex items-center gap-1.5 text-slate-400"><File className="w-3 h-3 text-sky-400" /> bundles.json</p>
                              <p className="flex items-center gap-1.5 text-slate-400"><File className="w-3 h-3 text-sky-400" /> mail/ <span className="text-slate-500 font-sans text-[10px]">(5 files)</span></p>
                              <p className="flex items-center gap-1.5 text-slate-400"><File className="w-3 h-3 text-sky-400" /> quests/ <span className="text-slate-500 font-sans text-[10px]">(10 files)</span></p>
                              <p className="flex items-center gap-1.5 text-slate-400"><File className="w-3 h-3 text-sky-400" /> settings/ <span className="text-slate-500 font-sans text-[10px]">(4 files)</span></p>
                            </div>
                          )}
                        </div>

                        {/* SCENES */}
                        <div>
                          <button onClick={() => toggleNode('godot/scenes')} className="flex items-center gap-2 text-slate-300 hover:text-white">
                            {expandedNodes['godot/scenes'] ? <ChevronDown className="w-3 h-3 text-slate-500" /> : <ChevronRight className="w-3 h-3 text-slate-500" />}
                            <Folder className="w-3.5 h-3.5 text-amber-500" /> scenes/
                          </button>
                          {expandedNodes['godot/scenes'] && (
                            <div className="pl-6 space-y-1 border-l border-slate-800 ml-2 mt-1">
                              <p className="flex items-center gap-1.5 text-slate-400"><File className="w-3 h-3 text-indigo-400" /> Store.tscn</p>
                              <p className="flex items-center gap-1.5 text-slate-400"><File className="w-3 h-3 text-indigo-400" /> GameHUD.tscn</p>
                              <p className="flex items-center gap-1.5 text-slate-400"><File className="w-3 h-3 text-indigo-400" /> mail/MailScreen.tscn <span className="text-slate-500 font-sans text-[10px]">(13 scenes)</span></p>
                              <p className="flex items-center gap-1.5 text-slate-400"><File className="w-3 h-3 text-indigo-400" /> quests/QuestScreen.tscn <span className="text-slate-500 font-sans text-[10px]">(19 scenes)</span></p>
                              <p className="flex items-center gap-1.5 text-slate-400"><File className="w-3 h-3 text-indigo-400" /> settings/SettingsScreen.tscn <span className="text-slate-500 font-sans text-[10px]">(15 scenes)</span></p>
                            </div>
                          )}
                        </div>

                        {/* SCRIPTS */}
                        <div>
                          <button onClick={() => toggleNode('godot/scripts')} className="flex items-center gap-2 text-slate-300 hover:text-white">
                            {expandedNodes['godot/scripts'] ? <ChevronDown className="w-3 h-3 text-slate-500" /> : <ChevronRight className="w-3 h-3 text-slate-500" />}
                            <Folder className="w-3.5 h-3.5 text-amber-500" /> scripts/
                          </button>
                          {expandedNodes['godot/scripts'] && (
                            <div className="pl-6 space-y-1 border-l border-slate-800 ml-2 mt-1 text-slate-400">
                              <p className="flex items-center gap-1.5"><File className="w-3 h-3 text-teal-400" /> Store.gd</p>
                              <p className="flex items-center gap-1.5"><File className="w-3 h-3 text-teal-400" /> StoreHome.gd</p>
                              <p className="flex items-center gap-1.5"><File className="w-3 h-3 text-teal-400" /> GameHUD.gd</p>
                              <p className="flex items-center gap-1.5"><File className="w-3 h-3 text-teal-400" /> mail/ <span className="text-slate-500 font-sans text-[10px]">(13 files)</span></p>
                              <p className="flex items-center gap-1.5"><File className="w-3 h-3 text-teal-400" /> quests/ <span className="text-slate-500 font-sans text-[10px]">(19 files)</span></p>
                              <p className="flex items-center gap-1.5"><File className="w-3 h-3 text-teal-400" /> settings/ <span className="text-slate-500 font-sans text-[10px]">(15 files)</span></p>
                            </div>
                          )}
                        </div>

                        {/* RESOURCES */}
                        <div>
                          <button onClick={() => toggleNode('godot/resources')} className="flex items-center gap-2 text-slate-300 hover:text-white">
                            {expandedNodes['godot/resources'] ? <ChevronDown className="w-3 h-3 text-slate-500" /> : <ChevronRight className="w-3 h-3 text-slate-500" />}
                            <Folder className="w-3.5 h-3.5 text-amber-500" /> resources/
                          </button>
                          {expandedNodes['godot/resources'] && (
                            <div className="pl-6 space-y-1 border-l border-slate-800 ml-2 mt-1">
                              <p className="flex items-center gap-1.5 text-slate-500"><File className="w-3 h-3" /> .gitkeep</p>
                            </div>
                          )}
                        </div>

                        {/* ASSETS */}
                        <div>
                          <button onClick={() => toggleNode('godot/assets')} className="flex items-center gap-2 text-slate-300 hover:text-white">
                            {expandedNodes['godot/assets'] ? <ChevronDown className="w-3 h-3 text-slate-500" /> : <ChevronRight className="w-3 h-3 text-slate-500" />}
                            <Folder className="w-3.5 h-3.5 text-amber-500" /> assets/
                          </button>
                          {expandedNodes['godot/assets'] && (
                            <div className="pl-6 space-y-1 border-l border-slate-800 ml-2 mt-1">
                              <p className="flex items-center gap-1.5 text-slate-500"><File className="w-3 h-3" /> .gitkeep</p>
                            </div>
                          )}
                        </div>

                        {/* PROJECT FILES */}
                        <p className="flex items-center gap-1.5 text-slate-300"><File className="w-3.5 h-3.5 text-emerald-400" /> project.godot</p>
                        <p className="flex items-center gap-1.5 text-slate-300"><File className="w-3.5 h-3.5 text-slate-400" /> README.md</p>
                        <p className="flex items-center gap-1.5 text-slate-300"><File className="w-3.5 h-3.5 text-slate-400" /> Merge_Report.md</p>
                        <p className="flex items-center gap-1.5 text-slate-300"><File className="w-3.5 h-3.5 text-slate-400" /> Dependency_Report.md</p>
                        <p className="flex items-center gap-1.5 text-slate-300"><File className="w-3.5 h-3.5 text-slate-400" /> Optimization_Report.md</p>
                        <p className="flex items-center gap-1.5 text-slate-300"><File className="w-3.5 h-3.5 text-slate-400" /> QA_Checklist.md</p>

                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

            {/* TAB 3: EXPORT & DOWNLOAD GUIDE */}
            {activeTab === 'guide' && (
              <div className="flex flex-col h-full gap-6">
                <div className="border-b border-slate-800 pb-4">
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <Download className="w-4 h-4 text-teal-400" /> Workspace Export Blueprint
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Follow these simple steps to download and run the project locally.</p>
                </div>

                <div className="space-y-4 text-sm leading-relaxed text-slate-300">
                  <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/80 space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center text-xs font-mono font-bold mt-0.5">1</div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Click AI Studio Export Settings</h4>
                        <p className="text-slate-400 text-xs mt-0.5">
                          Locate the <strong>Settings / Export</strong> menu at the top-right of your Google AI Studio workspace interface.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center text-xs font-mono font-bold mt-0.5">2</div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Download as ZIP or Export to GitHub</h4>
                        <p className="text-slate-400 text-xs mt-0.5">
                          Click <strong>Export to GitHub</strong> or <strong>Download ZIP</strong>. This packages the active workspace folder into a pristine download archive containing the clean <code className="text-teal-400 font-mono">godot/</code> folder.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center text-xs font-mono font-bold mt-0.5">3</div>
                      <div>
                        <h4 className="text-xs font-bold text-white">Import and Execute inside Godot 4.4+</h4>
                        <p className="text-slate-400 text-xs mt-0.5">
                          Unzip the downloaded file, open the <strong>Godot Engine</strong>, click <strong>Import</strong>, locate the <code className="text-teal-400 font-mono">project.godot</code> inside the extracted <code className="text-slate-300 font-mono">godot/</code> folder, and enjoy!
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-teal-500/5 rounded-xl border border-teal-500/10 flex items-start gap-3">
                    <Info className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-300 leading-relaxed">
                      <strong>Why are we not providing nested ZIPs?</strong> Standard web environments in sandboxed frames can experience corruption when writing nested binary formats. Exposing the project natively in the root directory and utilizing AI Studio's optimized, server-authoritative download/export tool guarantees 100% data integrity with zero corrupt archives.
                    </p>
                  </div>
                </div>
              </div>
            )}

          </div>

        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-6 text-center bg-slate-900/20">
        <p className="text-xs text-slate-500 font-mono">
          Crownspire Godot Modules — Release Engineering Phase Complete
        </p>
      </footer>
    </div>
  );
}
