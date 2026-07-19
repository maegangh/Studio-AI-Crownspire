import React, { useState, useRef, useEffect } from 'react';
import { Resources, ResourceRates } from '../types';
import { formatNum } from '../gameData';
import { Search, Star, Settings, Plus, Minus, Compass } from 'lucide-react';
import worldMap from '../assets/images/world-map-clean3.png';
import AncientBeastLairModal from './AncientBeastLairModal';

interface WorldMapTabProps {
  resources: Resources;
  rates: ResourceRates;
  upkeeps: number;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onAddResources?: (gains: Partial<Resources>) => void;
  addLog?: (message: string, type?: 'info' | 'success' | 'warning' | 'combat') => void;
}

interface MapNode {
  id: string;
  name: string;
  type: 'city' | 'resource' | 'boss' | 'portal' | 'fortress' | 'lair';
  icon: string;
  x: number;
  y: number;
  details: string;
  beast_id?: string;
  level?: number;
}

const mapNodes: MapNode[] = [
  {
    id: 'player_city',
    name: 'Crownspire Keep',
    type: 'city',
    icon: '🏰',
    x: 720,
    y: 1080,
    details: 'Your kingdom city. Upgrade, defend, and expand your dominion.'
  },
  {
    id: 'wheat_cache',
    name: 'Golden Harvest',
    type: 'resource',
    icon: '🌾',
    x: 980,
    y: 820,
    details: 'Food resource node.'
  },
  {
    id: 'iron_vein',
    name: 'Deep Iron Vein',
    type: 'resource',
    icon: '⛓️',
    x: 1320,
    y: 1180,
    details: 'Iron resource node.'
  },
  {
    id: 'dragon_roost',
    name: 'Dragon Roost',
    type: 'boss',
    icon: '🐉',
    x: 1650,
    y: 760,
    details: 'A dangerous monster boss. Rally with allies.'
  },
  {
    id: 'shadow_portal',
    name: 'Shadow Rift',
    type: 'portal',
    icon: '🌀',
    x: 1120,
    y: 1620,
    details: 'Realm event portal.'
  },
  {
    id: 'frost_keep',
    name: 'Frost Fortress',
    type: 'fortress',
    icon: '🏯',
    x: 1750,
    y: 1540,
    details: 'Alliance fortress location.'
  },
  {
    id: 'lair_wolf_1',
    name: 'Northern Wolf Den',
    type: 'lair',
    icon: '🐺',
    x: 840,
    y: 320,
    details: 'An ancient frost cavern. Scout or rally with your alliance to defeat the Dire Wolf Alpha!',
    beast_id: 'dire_wolf_alpha',
    level: 3
  },
  {
    id: 'lair_spider_1',
    name: 'Weeping Crystal Gorge',
    type: 'lair',
    icon: '🕷️',
    x: 420,
    y: 680,
    details: 'A silk-draped crystal cave. Scout or rally with your alliance to defeat the Crystal Spider Queen!',
    beast_id: 'crystal_spider_queen',
    level: 12
  },
  {
    id: 'lair_bear_1',
    name: 'High Crag Cavern',
    type: 'lair',
    icon: '🐻',
    x: 1380,
    y: 480,
    details: 'A thermal cavern filled with geothermal mists. Scout or rally with your alliance to defeat the Great Cave Bear!',
    beast_id: 'great_cave_bear',
    level: 8
  },
  {
    id: 'lair_troll_1',
    name: 'Ironroots Stronghold',
    type: 'lair',
    icon: '👹',
    x: 1620,
    y: 920,
    details: 'An iron-reinforced subterranean fortress. Scout or rally with your alliance to defeat the Stone Troll Chieftain!',
    beast_id: 'stone_troll_chieftain',
    level: 18
  },
  {
    id: 'lair_dragon_1',
    name: 'Sovereign Dragon Vault',
    type: 'lair',
    icon: '🐉',
    x: 980,
    y: 880,
    details: 'The ultimate molten chasm of pure dragon power. Scout or rally with your alliance to defeat the Ancient Crystal Dragon!',
    beast_id: 'ancient_crystal_dragon',
    level: 30
  },
  {
    id: 'lair_wolf_2',
    name: 'Ashen Fangs Den',
    type: 'lair',
    icon: '🐺',
    x: 1150,
    y: 150,
    details: 'A level 5 Dire Wolf Alpha den inside deep volcanic rocks. Gather allies!',
    beast_id: 'dire_wolf_alpha',
    level: 5
  }
];

export default function WorldMapTab({
  resources,
  rates,
  upkeeps,
  activeTab,
  setActiveTab,
  onAddResources,
  addLog
}: WorldMapTabProps) {
  const [zoom, setZoom] = useState(0.34);
  const [pan, setPan] = useState({ x: -265, y: -210 });
  const [isDragging, setIsDragging] = useState(false);
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
  const [activeLairNode, setActiveLairNode] = useState<MapNode | null>(null);

  const dragStart = useRef({ x: 0, y: 0 });
  const dragDistance = useRef(0);

  const mapSize = 2400;

  const canvasBgRef = useRef<HTMLCanvasElement | null>(null);
  const canvasFgRef = useRef<HTMLCanvasElement | null>(null);
  const zoomRef = useRef(zoom);
  const panRef = useRef(pan);
  const pushRippleRef = useRef<((x: number, y: number) => void) | null>(null);

  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);

  useEffect(() => {
    panRef.current = pan;
  }, [pan]);

  useEffect(() => {
    const canvasBg = canvasBgRef.current;
    const canvasFg = canvasFgRef.current;
    if (!canvasBg || !canvasFg) return;

    const ctxBg = canvasBg.getContext('2d');
    const ctxFg = canvasFg.getContext('2d');
    if (!ctxBg || !ctxFg) return;

    let frameId: number;
    const particles: any[] = [];
    const maxParticles = 280;

    // Pre-populate particles so map is already filled with atmospheric life on mount
    for (let i = 0; i < 90; i++) {
      const sourceNode = mapNodes[Math.floor(Math.random() * mapNodes.length)];
      let pX = sourceNode.x + (Math.random() - 0.5) * 80;
      let pY = sourceNode.y + (Math.random() - 0.5) * 80;
      
      let pType = 'dust';
      let pColor = '#fbbf24';
      let vx = (Math.random() - 0.5) * 0.4;
      let vy = -0.3 - Math.random() * 0.6;
      let scale = 1.5 + Math.random() * 2.5;
      let maxLife = 100 + Math.random() * 150;

      if (sourceNode.type === 'city') {
        pColor = '#c084fc';
      } else if (sourceNode.type === 'boss') {
        pType = 'ember';
        pColor = `hsl(${15 + Math.random() * 20}, 100%, ${50 + Math.random() * 25}%)`;
        vy = -0.4 - Math.random() * 1.0;
        scale = 2 + Math.random() * 3.5;
      } else if (sourceNode.type === 'portal') {
        pType = 'void';
        pColor = '#a855f7';
        const angleStart = Math.random() * Math.PI * 2;
        const radius = 20 + Math.random() * 40;
        pX = sourceNode.x + Math.cos(angleStart) * radius;
        pY = sourceNode.y + Math.sin(angleStart) * radius;
        vx = -Math.cos(angleStart) * 0.35 - Math.sin(angleStart) * 0.35;
        vy = -Math.sin(angleStart) * 0.35 + Math.cos(angleStart) * 0.35;
        scale = 1 + Math.random() * 2;
        maxLife = 80 + Math.random() * 60;
      } else if (sourceNode.type === 'fortress') {
        pType = 'frost';
        pColor = '#a5f3fc';
        vy = 0.2 + Math.random() * 0.4;
      }

      particles.push({
        x: pX,
        y: pY,
        vx,
        vy,
        scale,
        alpha: Math.random(),
        life: Math.floor(Math.random() * maxLife * 0.8),
        maxLife,
        color: pColor,
        type: pType,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.02
      });
    }

    // Pre-populate some leaves
    for (let i = 0; i < 25; i++) {
      particles.push({
        x: 400 + Math.random() * 1400,
        y: 500 + Math.random() * 900,
        vx: 0.3 + Math.random() * 0.5,
        vy: 0.2 + Math.random() * 0.4,
        scale: 2 + Math.random() * 3.5,
        alpha: Math.random(),
        life: Math.floor(Math.random() * 150),
        maxLife: 150 + Math.random() * 150,
        color: `hsl(${95 + Math.random() * 30}, 85%, ${30 + Math.random() * 15}%)`,
        type: 'leaf',
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.04
      });
    }

    // Expose pushing helper to ref
    pushRippleRef.current = (mx: number, my: number) => {
      // Spawn ripple groups for authentic layered water echo
      particles.push({
        x: mx,
        y: my,
        vx: 0,
        vy: 0,
        scale: 2,
        alpha: 0.9,
        life: 0,
        maxLife: 140,
        color: 'rgba(56, 189, 248, 0.75)',
        type: 'ripple',
        angle: 0,
        spin: 0
      });
      setTimeout(() => {
        if (canvasBgRef.current) {
          particles.push({
            x: mx,
            y: my,
            vx: 0,
            vy: 0,
            scale: 1.5,
            alpha: 0.6,
            life: 0,
            maxLife: 150,
            color: 'rgba(56, 189, 248, 0.45)',
            type: 'ripple',
            angle: 0,
            spin: 0
          });
        }
      }, 200);
    };

    const resizeCanvases = () => {
      const rect = canvasBg.parentElement?.getBoundingClientRect();
      if (rect) {
        canvasBg.width = rect.width;
        canvasBg.height = rect.height;
        canvasFg.width = rect.width;
        canvasFg.height = rect.height;
      }
    };
    resizeCanvases();
    window.addEventListener('resize', resizeCanvases);

    const updateAndDraw = () => {
      const zoomVal = zoomRef.current;
      const panVal = panRef.current;
      const time = Date.now();
      const w = canvasBg.width;
      const h = canvasBg.height;

      ctxBg.clearRect(0, 0, w, h);
      ctxFg.clearRect(0, 0, w, h);

      // 1. DRAW RADIAL HEARTH/LIGHT SOURCE GLOWS ON BACKGROUND (LIGHTING)
      mapNodes.forEach(node => {
        const vx = node.x * zoomVal + panVal.x;
        const vy = node.y * zoomVal + panVal.y;
        
        if (vx >= -200 && vx <= w + 200 && vy >= -200 && vy <= h + 200) {
          let glowColor = 'rgba(251, 191, 36, 0.12)';
          let glowSize = 130 * zoomVal;
          
          if (node.type === 'city') {
            glowColor = 'rgba(168, 85, 247, 0.20)';
            glowSize = 240 * zoomVal;
          } else if (node.type === 'boss') {
            const p = 0.85 + Math.sin(time * 0.003) * 0.15;
            glowColor = `rgba(239, 68, 68, ${0.22 * p})`;
            glowSize = 190 * zoomVal * p;
          } else if (node.type === 'portal') {
            const p = 0.9 + Math.sin(time * 0.004) * 0.1;
            glowColor = `rgba(147, 51, 234, ${0.28 * p})`;
            glowSize = 170 * zoomVal * p;
          } else if (node.type === 'fortress') {
            glowColor = 'rgba(56, 189, 248, 0.16)';
            glowSize = 160 * zoomVal;
          }
          
          const grad = ctxBg.createRadialGradient(vx, vy, 0, vx, vy, glowSize);
          grad.addColorStop(0, glowColor);
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          
          ctxBg.fillStyle = grad;
          ctxBg.beginPath();
          ctxBg.arc(vx, vy, glowSize, 0, Math.PI * 2);
          ctxBg.fill();
        }
      });

      // 2. SPAWN NEW DUSTS/EMBERS/FROST/LEAVES
      if (particles.length < maxParticles && Math.random() < 0.45) {
        const sourceNode = mapNodes[Math.floor(Math.random() * mapNodes.length)];
        let pType = 'dust';
        let pColor = '#fbbf24';
        let pX = sourceNode.x + (Math.random() - 0.5) * 50;
        let pY = sourceNode.y + (Math.random() - 0.5) * 50;
        let vx = (Math.random() - 0.5) * 0.4;
        let vy = -0.3 - Math.random() * 0.8;
        let scale = 1.5 + Math.random() * 2.5;
        let maxLife = 100 + Math.random() * 150;

        if (sourceNode.type === 'city') {
          pColor = '#c084fc';
          vy = -0.2 - Math.random() * 0.5;
        } else if (sourceNode.type === 'boss') {
          pType = 'ember';
          pColor = `hsl(${15 + Math.random() * 20}, 100%, ${50 + Math.random() * 25}%)`;
          vy = -0.4 - Math.random() * 1.0;
          scale = 2 + Math.random() * 3.5;
        } else if (sourceNode.type === 'portal') {
          pType = 'void';
          pColor = '#a855f7';
          const angleStart = Math.random() * Math.PI * 2;
          const radius = 25 + Math.random() * 35;
          pX = sourceNode.x + Math.cos(angleStart) * radius;
          pY = sourceNode.y + Math.sin(angleStart) * radius;
          vx = -Math.cos(angleStart) * 0.35 - Math.sin(angleStart) * 0.35;
          vy = -Math.sin(angleStart) * 0.35 + Math.cos(angleStart) * 0.35;
          scale = 1 + Math.random() * 2;
          maxLife = 70 + Math.random() * 50;
        } else if (sourceNode.type === 'fortress') {
          pType = 'frost';
          pColor = '#a5f3fc';
          vy = 0.2 + Math.random() * 0.5;
          vx = (Math.random() - 0.5) * 0.4;
          scale = 1.5 + Math.random() * 3;
        } else if (sourceNode.id === 'wheat_cache') {
          pColor = '#fbbf24';
        } else if (sourceNode.id === 'iron_vein') {
          pColor = '#e2e8f0';
          scale = 2 + Math.random() * 2;
        }

        particles.push({
          x: pX,
          y: pY,
          vx,
          vy,
          scale,
          alpha: 1,
          life: 0,
          maxLife,
          color: pColor,
          type: pType,
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.02
        });
      }

      // Spawn falling leaves (forest zone drift)
      if (particles.length < maxParticles && Math.random() < 0.12) {
        particles.push({
          x: 400 + Math.random() * 1400,
          y: 500 + Math.random() * 900,
          vx: 0.25 + Math.random() * 0.5,
          vy: 0.15 + Math.random() * 0.4,
          scale: 2 + Math.random() * 3.5,
          alpha: 1,
          life: 0,
          maxLife: 160 + Math.random() * 180,
          color: `hsl(${95 + Math.random() * 35}, 85%, ${30 + Math.random() * 15}%)`,
          type: 'leaf',
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.03
        });
      }

      // Spawn random tranquil ripples
      if (particles.length < maxParticles && Math.random() < 0.03) {
        particles.push({
          x: 100 + Math.random() * 2200,
          y: 100 + Math.random() * 2200,
          vx: 0,
          vy: 0,
          scale: 4,
          alpha: 0.5,
          life: 0,
          maxLife: 150 + Math.random() * 100,
          color: 'rgba(56, 189, 248, 0.45)',
          type: 'ripple',
          angle: 0,
          spin: 0
        });
      }

      // Spawn scrolling fog wisps (FOG EDGES)
      if (particles.length < maxParticles && Math.random() < 0.04) {
        let fx = 0, fy = 0;
        if (Math.random() < 0.5) {
          fx = Math.random() < 0.5 ? Math.random() * 450 : 1950 + Math.random() * 450;
          fy = Math.random() * 2400;
        } else {
          fx = Math.random() * 2400;
          fy = Math.random() < 0.5 ? Math.random() * 450 : 1950 + Math.random() * 450;
        }
        particles.push({
          x: fx,
          y: fy,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.1,
          scale: 160 + Math.random() * 120,
          alpha: 0.01 + Math.random() * 0.04,
          life: 0,
          maxLife: 350 + Math.random() * 250,
          color: 'rgba(215, 225, 240, 0.08)',
          type: 'fog',
          angle: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 0.001
        });
      }

      // Update and Draw particles across the dual canvases (layering)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;

        if (p.type === 'leaf') {
          p.x += p.vx + Math.sin(time * 0.003 + p.life * 0.06) * 0.25;
          p.y += p.vy;
          p.angle += p.spin;
        } else if (p.type === 'ripple') {
          p.scale += 0.22 * zoomVal;
          p.alpha = Math.max(0, 0.8 * (1 - p.life / p.maxLife));
        } else if (p.type === 'void') {
          p.x += p.vx;
          p.y += p.vy;
          p.alpha = Math.max(0, 1 - p.life / p.maxLife);
        } else {
          p.x += p.vx;
          p.y += p.vy;
          p.alpha = Math.max(0, 1 - p.life / p.maxLife);
        }

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        const vx = p.x * zoomVal + panVal.x;
        const vy = p.y * zoomVal + panVal.y;
        const pSize = p.scale * zoomVal;

        // Visual frustum culling
        if (vx >= -pSize && vx <= w + pSize && vy >= -pSize && vy <= h + pSize) {
          if (p.type === 'ripple') {
            // Draw on background canvas (beneath nodes)
            ctxBg.save();
            ctxBg.globalAlpha = p.alpha;
            ctxBg.strokeStyle = p.color;
            ctxBg.lineWidth = 1.2 * zoomVal;
            ctxBg.beginPath();
            ctxBg.arc(vx, vy, pSize, 0, Math.PI * 2);
            ctxBg.stroke();

            if (p.life > 12) {
              ctxBg.strokeStyle = 'rgba(56, 189, 248, 0.15)';
              ctxBg.beginPath();
              ctxBg.arc(vx, vy, Math.max(0, pSize - 10 * zoomVal), 0, Math.PI * 2);
              ctxBg.stroke();
            }
            ctxBg.restore();
          } else {
            // Draw on foreground canvas (floating above nodes)
            ctxFg.save();
            ctxFg.globalAlpha = p.alpha;

            if (p.type === 'leaf') {
              ctxFg.translate(vx, vy);
              ctxFg.rotate(p.angle);
              ctxFg.fillStyle = p.color;
              ctxFg.beginPath();
              ctxFg.ellipse(0, 0, pSize, pSize / 2, 0, 0, Math.PI * 2);
              ctxFg.fill();
              
              ctxFg.strokeStyle = 'rgba(0,0,0,0.12)';
              ctxFg.lineWidth = 0.5 * zoomVal;
              ctxFg.beginPath();
              ctxFg.moveTo(-pSize, 0);
              ctxFg.lineTo(pSize, 0);
              ctxFg.stroke();
            } else if (p.type === 'fog') {
              const grad = ctxFg.createRadialGradient(vx, vy, 0, vx, vy, pSize);
              grad.addColorStop(0, 'rgba(11, 16, 27, 0.12)');
              grad.addColorStop(0.5, 'rgba(15, 23, 42, 0.04)');
              grad.addColorStop(1, 'rgba(0,0,0,0)');
              
              ctxFg.fillStyle = grad;
              ctxFg.beginPath();
              ctxFg.arc(vx, vy, pSize, 0, Math.PI * 2);
              ctxFg.fill();
            } else {
              ctxFg.shadowBlur = 4 * zoomVal;
              ctxFg.shadowColor = p.color;
              ctxFg.fillStyle = p.color;
              ctxFg.beginPath();

              if (p.type === 'ember') {
                ctxFg.rect(vx - pSize/2, vy - pSize/2, pSize, pSize);
              } else {
                ctxFg.arc(vx, vy, pSize, 0, Math.PI * 2);
              }
              ctxFg.fill();
            }
            ctxFg.restore();
          }
        }
      }

      // 3. DRAW TACTICAL GRID AND MAP LABELS ON BACKGROUND CANVAS (MAP READABILITY)
      if (zoomVal >= 0.28) {
        ctxBg.save();
        const gridOpacity = Math.min(0.06, (zoomVal - 0.28) * 0.18);
        ctxBg.strokeStyle = `rgba(217, 119, 6, ${gridOpacity})`;
        ctxBg.fillStyle = `rgba(217, 119, 6, ${gridOpacity * 1.6})`;
        ctxBg.lineWidth = 0.5;
        ctxBg.font = `${Math.max(10, 11 * zoomVal)}px monospace`;

        const step = 200;
        for (let x = step; x < mapSize; x += step) {
          const vx = x * zoomVal + panVal.x;
          if (vx >= 0 && vx <= w) {
            ctxBg.beginPath();
            ctxBg.moveTo(vx, 0);
            ctxBg.lineTo(vx, h);
            ctxBg.stroke();
            ctxBg.fillText(`${x}`, vx + 4, 18);
          }
        }
        for (let y = step; y < mapSize; y += step) {
          const vy = y * zoomVal + panVal.y;
          if (vy >= 0 && vy <= h) {
            ctxBg.beginPath();
            ctxBg.moveTo(0, vy);
            ctxBg.lineTo(w, vy);
            ctxBg.stroke();
            ctxBg.fillText(`${y}`, 6, vy - 4);
          }
        }
        ctxBg.restore();
      }

      frameId = requestAnimationFrame(updateAndDraw);
    };

    updateAndDraw();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', resizeCanvases);
    };
  }, []);


  const netFoodRate = rates.food - upkeeps;

  const resetMapView = () => {
    setZoom(0.34);
    setPan({ x: -265, y: -210 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;

    setIsDragging(true);
    dragDistance.current = 0;
    dragStart.current = {
      x: e.clientX - pan.x,
      y: e.clientY - pan.y
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    dragDistance.current += Math.abs(e.movementX) + Math.abs(e.movementY);
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();

    const zoomFactor = e.deltaY < 0 ? 1.06 : 0.94;
    setZoom((z) => Math.max(0.22, Math.min(1.35, z * zoomFactor)));
  };

  const handleMapClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    if (dragDistance.current > 12) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const zoomVal = zoomRef.current;
    const panVal = panRef.current;

    const mapX = (clickX - panVal.x) / zoomVal;
    const mapY = (clickY - panVal.y) / zoomVal;

    if (pushRippleRef.current) {
      pushRippleRef.current(mapX, mapY);
    }
  };

  const handleNodeAction = () => {
    if (!selectedNode) return;

    if (selectedNode.type === 'resource' && selectedNode.id === 'wheat_cache') {
      onAddResources?.({ food: 1200 });
      addLog?.('Harvest complete. Food returned to Crownspire vaults.', 'success');
    }

    if (selectedNode.type === 'resource' && selectedNode.id === 'iron_vein') {
      onAddResources?.({ iron: 350 });
      addLog?.('Iron extracted and sent to your vaults.', 'success');
    }

    if (selectedNode.type === 'boss') {
      addLog?.('Combat march deployed toward Dragon Roost.', 'combat');
    }

    if (selectedNode.type === 'lair') {
      setActiveLairNode(selectedNode);
    }

    setSelectedNode(null);
  };

  return (
    <div className="w-full h-screen max-w-md mx-auto bg-[#05070d] text-slate-200 overflow-hidden flex flex-col font-sans select-none border-x border-[#1b2436] shadow-2xl relative">
      <header className="bg-[#070a12]/95 border-b border-amber-500/20 px-4 pt-3 pb-3 z-50 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[10px] text-amber-400 font-black tracking-[0.25em] uppercase">
              Crownspire
            </div>
            <h1 className="text-lg font-black font-serif tracking-widest text-amber-300">
              👑 CROWNSPIRE
            </h1>
          </div>

          <div className="flex items-center gap-3 text-zinc-400">
            <Search className="w-4 h-4 hover:text-white cursor-pointer" />
            <Star className="w-4 h-4 hover:text-white cursor-pointer" />
            <Settings className="w-4 h-4 hover:text-white cursor-pointer" />
          </div>
        </div>

        <div className="grid grid-cols-5 gap-1 text-[10px] text-center font-mono">
          {[
            {
              icon: '🌾',
              value: resources.food,
              rate: netFoodRate,
              color: netFoodRate < 0 ? 'text-rose-400' : 'text-emerald-400'
            },
            {
              icon: '🪵',
              value: resources.wood,
              rate: rates.wood,
              color: 'text-emerald-400'
            },
            {
              icon: '🪨',
              value: resources.stone,
              rate: rates.stone,
              color: 'text-emerald-400'
            },
            {
              icon: '⛓️',
              value: resources.iron,
              rate: rates.iron,
              color: 'text-emerald-400'
            },
            {
              icon: '🪙',
              value: resources.valor,
              rate: null,
              color: 'text-amber-400'
            }
          ].map((res, index) => (
            <div
              key={index}
              className="bg-[#0b1020] border border-[#1b2b48] rounded-xl py-1.5 flex flex-col items-center"
            >
              <span>{res.icon}</span>
              <span className="font-black text-zinc-100">{formatNum(res.value)}</span>
              {res.rate !== null && (
                <span className={`text-[8px] font-bold ${res.color}`}>
                  {res.rate >= 0 ? '+' : ''}
                  {res.rate.toFixed(1)}/s
                </span>
              )}
            </div>
          ))}
        </div>
      </header>

      <div
        className={`flex-1 relative overflow-hidden bg-black border-b border-amber-500/20 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onClick={handleMapClick}
      >
        {/* Background Canvas: Renders tactical grid, coordinate markers, node halos, and water ripples */}
        <canvas
          ref={canvasBgRef}
          className="absolute inset-0 pointer-events-none z-10"
        />

        <div
          className="absolute shadow-[inset_0_0_160px_rgba(0,0,0,0.75)]"
          style={{
            width: `${mapSize}px`,
            height: `${mapSize}px`,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            willChange: 'transform',
            backgroundImage: `url(${worldMap})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-black/5 pointer-events-none" />

          {mapNodes.map((node) => {
            const selected = selectedNode?.id === node.id;
            const isCity = node.type === 'city';
            const isBoss = node.type === 'boss';
            const isPortal = node.type === 'portal';
            const isFortress = node.type === 'fortress';
            const isResource = node.type === 'resource';
            const isLair = node.type === 'lair';

            return (
              <React.Fragment key={node.id}>
                {/* 3D Drop Shadow Pedestal beneath each node to anchor it with depth on terrain */}
                <div
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y + (isCity ? 28 : isBoss ? 20 : isLair ? 24 : 14)}px`,
                    width: `${isCity ? 110 : isBoss ? 80 : isLair ? 96 : 64}px`,
                    height: `${isCity ? 20 : isBoss ? 14 : isLair ? 16 : 10}px`
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/55 blur-md pointer-events-none z-10 transition-all duration-300"
                />

                {/* Ambient underglow rings/magical energy borders */}
                {isCity && (
                  <div
                    style={{ left: `${node.x}px`, top: `${node.y}px` }}
                    className="absolute w-36 h-36 border border-purple-500/20 rounded-full animate-[spin_35s_linear_infinite] pointer-events-none -translate-x-1/2 -translate-y-1/2 z-10"
                  >
                    <div className="w-full h-full border-dashed border border-purple-400/10 rounded-full scale-90" />
                  </div>
                )}

                {isBoss && (
                  <div
                    style={{
                      left: `${node.x}px`,
                      top: `${node.y}px`,
                    }}
                    className="absolute w-24 h-24 border border-red-500/20 bg-red-600/5 rounded-full animate-pulse pointer-events-none -translate-x-1/2 -translate-y-1/2 z-10"
                  />
                )}

                {isLair && (
                  <div
                    style={{ left: `${node.x}px`, top: `${node.y}px` }}
                    className="absolute w-28 h-28 border border-purple-500/20 bg-purple-950/10 rounded-full animate-pulse pointer-events-none -translate-x-1/2 -translate-y-1/2 z-10"
                  >
                    <div className="w-full h-full border border-dashed border-amber-500/15 rounded-full scale-90 animate-[spin_40s_linear_infinite]" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] animate-bounce">💎</div>
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 text-[9px] animate-bounce delay-100">💎</div>
                  </div>
                )}

                {isPortal && (
                  <div
                    style={{
                      left: `${node.x}px`,
                      top: `${node.y}px`,
                    }}
                    className="absolute w-20 h-20 border-2 border-indigo-600/20 border-t-indigo-400/60 rounded-full animate-spin pointer-events-none -translate-x-1/2 -translate-y-1/2 z-10"
                  />
                )}

                {isResource && (
                  <div
                    style={{
                      left: `${node.x}px`,
                      top: `${node.y}px`,
                    }}
                    className="absolute w-16 h-16 bg-amber-500/5 rounded-full blur-md animate-pulse pointer-events-none -translate-x-1/2 -translate-y-1/2 z-10"
                  />
                )}

                {isFortress && (
                  <div
                    style={{ left: `${node.x}px`, top: `${node.y}px` }}
                    className="absolute w-24 h-24 border border-sky-400/20 rounded-full animate-[spin_45s_linear_infinite] pointer-events-none -translate-x-1/2 -translate-y-1/2 z-10"
                  >
                    <div className="w-full h-full border border-sky-300/10 scale-95 rotate-45" />
                  </div>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node);
                  }}
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`
                  }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full flex flex-col items-center justify-center transition-all duration-300 z-20 ${
                    isCity
                      ? 'w-28 h-28 bg-gradient-to-b from-purple-900/80 to-purple-950/95 border-x-2 border-t-2 border-b-6 border-purple-400 shadow-[0_4px_25px_rgba(168,85,247,0.4)] active:border-b-2 active:translate-y-[-46%]'
                      : isBoss
                        ? 'w-20 h-20 bg-gradient-to-b from-red-900/80 to-red-950/95 border-x-2 border-t-2 border-b-6 border-red-500 shadow-[0_4px_20px_rgba(239,68,68,0.35)] active:border-b-2 active:translate-y-[-46%]'
                        : isLair
                          ? 'w-24 h-24 bg-gradient-to-b from-amber-950/90 via-slate-900/95 to-slate-950/98 border-x-2 border-t-2 border-b-6 border-amber-600 shadow-[0_4px_30px_rgba(245,158,11,0.55)] active:border-b-2 active:translate-y-[-46%]'
                          : 'w-16 h-16 bg-gradient-to-b from-[#09152a]/95 to-[#040a15]/98 border-x border-t border-b-4 border-[#2c4e85] shadow-[0_4px_15px_rgba(0,0,0,0.5)] active:border-b active:translate-y-[-48%]'
                  } ${
                    selected
                      ? 'ring-4 ring-amber-400 scale-110 z-45 shadow-[0_0_35px_rgba(251,191,36,0.5)]'
                      : 'hover:ring-2 hover:ring-zinc-200 hover:-translate-y-[54%] hover:scale-105'
                  }`}
                >
                  <span className={isCity ? 'text-5xl' : 'text-3xl'}>
                    {node.icon}
                  </span>

                  {zoom >= 0.3 && (
                    <span className="mt-1.5 max-w-[140px] truncate rounded-lg bg-slate-950/90 border border-slate-800/80 px-2.5 py-0.5 text-[11px] font-black text-slate-100 shadow-md">
                      {node.name}
                    </span>
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </div>

        {/* Foreground Canvas: Renders windblown forest leaves, volcanic embers, void portals, and weather fogs */}
        <canvas
          ref={canvasFgRef}
          className="absolute inset-0 pointer-events-none z-30"
        />

        <div className="absolute left-3 top-28 z-40 flex flex-col gap-2">
          {['🎯', '👤', '⏳', '📌', '📦'].map((icon) => (
            <button
              key={icon}
              className="w-9 h-9 rounded-full bg-[#070a12]/95 border border-[#1f355a] text-sm shadow-xl hover:border-amber-400"
            >
              {icon}
            </button>
          ))}
        </div>

        <div className="absolute right-3 top-28 z-40 flex flex-col items-center gap-2 bg-[#070a12]/95 border border-[#1f355a] rounded-2xl p-2 shadow-xl">
          <button
            onClick={() => setZoom((z) => Math.min(1.35, z + 0.1))}
            className="text-zinc-300 hover:text-white"
          >
            <Plus className="w-4 h-4" />
          </button>

          <div className="relative h-24 w-1 rounded-full bg-zinc-800">
            <div
              className="absolute left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-amber-400"
              style={{
                bottom: `${((zoom - 0.22) / 1.13) * 100}%`
              }}
            />
          </div>

          <button
            onClick={() => setZoom((z) => Math.max(0.22, z - 0.1))}
            className="text-zinc-300 hover:text-white"
          >
            <Minus className="w-4 h-4" />
          </button>

          <button onClick={resetMapView} className="text-amber-400 hover:text-amber-300">
            <Compass className="w-4 h-4" />
          </button>
        </div>

        {selectedNode && (
          <div className="absolute left-4 right-4 bottom-4 z-50 rounded-2xl border border-amber-400/40 bg-[#070a12]/95 p-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-amber-300">
                {selectedNode.icon} {selectedNode.name}
              </h2>

              <button
                onClick={() => setSelectedNode(null)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="mt-2 text-xs text-zinc-300">{selectedNode.details}</p>

            <button
              onClick={handleNodeAction}
              className="mt-3 w-full rounded-xl bg-gradient-to-r from-amber-600 to-amber-400 py-2 text-[11px] font-black uppercase tracking-wider text-black active:scale-95"
            >
              {selectedNode.type === 'resource'
                ? 'Gather Resources'
                : selectedNode.type === 'boss'
                  ? 'Deploy March'
                  : selectedNode.type === 'city'
                    ? 'Enter City'
                    : selectedNode.type === 'lair'
                      ? 'Open Ancient Lair'
                      : 'Open Location'}
            </button>
          </div>
        )}

        {activeLairNode && (
          <AncientBeastLairModal
            lairNode={activeLairNode}
            onClose={() => setActiveLairNode(null)}
            onAddResources={onAddResources}
            addLog={addLog}
          />
        )}
      </div>

      <footer className="h-16 bg-[#070a12]/95 border-t border-[#1b2436] grid grid-cols-6 shrink-0">
        {[
          { id: 'city', name: 'City', icon: '🏰' },
          { id: 'quests', name: 'Quests', icon: '📜' },
          { id: 'campaign', name: 'Campaign', icon: '⚔️' },
          { id: 'alliance', name: 'Alliance', icon: '🛡️' },
          { id: 'inventory', name: 'Inventory', icon: '📦' },
          { id: 'map', name: 'World', icon: '🧭' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center gap-0.5 border-t-2 text-[10px] ${
              activeTab === tab.id
                ? 'border-amber-400 text-amber-400 bg-amber-500/5 font-black'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <span className="text-base">{tab.icon}</span>
            <span>{tab.name}</span>
          </button>
        ))}
      </footer>
    </div>
  );
}