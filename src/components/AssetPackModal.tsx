import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Sparkles, Layers, Eye, Check, Image as ImageIcon, Crown, Shield, Sword, Heart, Star, ArrowUp, BookOpen, Gem, Flame, Compass, Activity, Clock, Target, ShieldAlert, Footprints, Zap, Users, Hammer, Moon, Sun } from 'lucide-react';

interface AssetPackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AssetPackModal({ isOpen, onClose }: AssetPackModalProps) {
  const [selectedAssetId, setSelectedAssetId] = useState<string>('stat_row_panel');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'ui' | 'runes' | 'crystals' | 'totems' | 'sigils'>('ui');

  const getCategory = (id: string) => {
    if (id.endsWith('_rune')) return 'runes';
    if (id.endsWith('_crystal')) return 'crystals';
    if (id.endsWith('_totem')) return 'totems';
    if (id.endsWith('_sigil')) return 'sigils';
    return 'ui';
  };

  const handleTabChange = (tab: 'ui' | 'runes' | 'crystals' | 'totems' | 'sigils') => {
    setActiveTab(tab);
    if (tab === 'ui') {
      setSelectedAssetId('stat_row_panel');
    } else if (tab === 'runes') {
      setSelectedAssetId('attack_rune');
    } else if (tab === 'crystals') {
      setSelectedAssetId('attack_crystal');
    } else if (tab === 'totems') {
      setSelectedAssetId('moon_totem');
    } else if (tab === 'sigils') {
      setSelectedAssetId('moon_sigil');
    }
  };

  // Download high-resolution PNG by rendering SVG to Canvas
  const handleDownloadPNG = (svgId: string, filename: string) => {
    setDownloadingId(svgId);
    
    setTimeout(() => {
      const svgElement = document.getElementById(svgId) as unknown as SVGSVGElement | null;
      if (!svgElement) {
        setDownloadingId(null);
        return;
      }

      // Serialize the SVG XML
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const blobURL = window.URL.createObjectURL(svgBlob);
      
      const image = new Image();
      image.crossOrigin = 'anonymous';
      
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 1024;
        const context = canvas.getContext('2d');
        
        if (context) {
          // Clear with transparent background
          context.clearRect(0, 0, 1024, 1024);
          
          // Draw the image
          context.drawImage(image, 0, 0, 1024, 1024);
          
          // Export to PNG data URL
          const pngDataUrl = canvas.toDataURL('image/png');
          
          // Trigger download
          const downloadLink = document.createElement('a');
          downloadLink.href = pngDataUrl;
          downloadLink.download = `${filename}.png`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);
        }
        
        window.URL.revokeObjectURL(blobURL);
        setDownloadingId(null);
      };

      image.onerror = (e) => {
        console.error("Failed to load SVG into image", e);
        window.URL.revokeObjectURL(blobURL);
        setDownloadingId(null);
      };

      image.src = blobURL;
    }, 400); // Small timeout to ensure seamless animation and feedback
  };

  const assetList = [
    {
      id: 'stat_row_panel',
      name: 'Stat Row Panel',
      icon: Layers,
      filename: 'crownspire_stat_row_panel',
      description: 'Horizontal mobile game UI component panel container. Features an ornate white-gold double-filigree frame and royal purple background texture with a glass-like crystal violet overlay.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* White Gold Gradient */}
            <linearGradient id="goldGradPanel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF9E6" />
              <stop offset="25%" stopColor="#F5DC9A" />
              <stop offset="50%" stopColor="#D4A747" />
              <stop offset="75%" stopColor="#9E761D" />
              <stop offset="100%" stopColor="#E9D386" />
            </linearGradient>
            
            {/* Royal Purple Gradient */}
            <linearGradient id="purpleGradPanel" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2D1B4E" />
              <stop offset="50%" stopColor="#1C0D32" />
              <stop offset="100%" stopColor="#0D041A" />
            </linearGradient>

            {/* Inner Glass Violet Gradient */}
            <linearGradient id="innerGlassPanel" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#19062F" stopOpacity="0.95" />
              <stop offset="50%" stopColor="#240E3E" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#140428" stopOpacity="0.95" />
            </linearGradient>

            {/* Crystal Highlight */}
            <linearGradient id="crystalHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8A46FF" stopOpacity="0.4" />
              <stop offset="30%" stopColor="#C9ACFF" stopOpacity="0.1" />
              <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="100%" stopColor="#8A46FF" stopOpacity="0.3" />
            </linearGradient>

            {/* Soft Glow Filter */}
            <filter id="softGlowPanel" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="15" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* BACKGROUND GLOW */}
          <circle cx="512" cy="512" r="300" fill="#7834F5" opacity="0.15" filter="url(#softGlowPanel)" />

          {/* MAIN HORIZONTAL PANEL CONTAINER */}
          {/* Main Frame Shadow */}
          <rect x="80" y="340" width="864" height="344" rx="36" fill="#000000" opacity="0.6" filter="url(#softGlowPanel)" />

          {/* Outer Royal Purple Base */}
          <rect x="80" y="340" width="864" height="344" rx="36" fill="url(#purpleGradPanel)" stroke="url(#goldGradPanel)" strokeWidth="6" />

          {/* Inner Glossy Glass Insert */}
          <rect x="110" y="370" width="804" height="284" rx="22" fill="url(#innerGlassPanel)" stroke="#3E1A6D" strokeWidth="2" />
          
          {/* Crystal Sheen Texture */}
          <rect x="110" y="370" width="804" height="284" rx="22" fill="url(#crystalHighlight)" pointerEvents="none" />

          {/* ORNATE CORNER FILIGREE - TOP LEFT */}
          <g transform="translate(80, 340) scale(1.2)">
            <path d="M0,0 L35,0 C20,10 10,20 0,35 Z" fill="url(#goldGradPanel)" />
            <circle cx="10" cy="10" r="3.5" fill="#C9ACFF" />
            <path d="M5,15 C5,25 20,25 25,15" fill="none" stroke="url(#goldGradPanel)" strokeWidth="2" />
            <path d="M15,5 C25,5 25,20 15,25" fill="none" stroke="url(#goldGradPanel)" strokeWidth="2" />
          </g>

          {/* ORNATE CORNER FILIGREE - TOP RIGHT */}
          <g transform="translate(944, 340) scale(-1.2, 1.2)">
            <path d="M0,0 L35,0 C20,10 10,20 0,35 Z" fill="url(#goldGradPanel)" />
            <circle cx="10" cy="10" r="3.5" fill="#C9ACFF" />
            <path d="M5,15 C5,25 20,25 25,15" fill="none" stroke="url(#goldGradPanel)" strokeWidth="2" />
            <path d="M15,5 C25,5 25,20 15,25" fill="none" stroke="url(#goldGradPanel)" strokeWidth="2" />
          </g>

          {/* ORNATE CORNER FILIGREE - BOTTOM LEFT */}
          <g transform="translate(80, 684) scale(1.2, -1.2)">
            <path d="M0,0 L35,0 C20,10 10,20 0,35 Z" fill="url(#goldGradPanel)" />
            <circle cx="10" cy="10" r="3.5" fill="#C9ACFF" />
            <path d="M5,15 C5,25 20,25 25,15" fill="none" stroke="url(#goldGradPanel)" strokeWidth="2" />
            <path d="M15,5 C25,5 25,20 15,25" fill="none" stroke="url(#goldGradPanel)" strokeWidth="2" />
          </g>

          {/* ORNATE CORNER FILIGREE - BOTTOM RIGHT */}
          <g transform="translate(944, 684) scale(-1.2, -1.2)">
            <path d="M0,0 L35,0 C20,10 10,20 0,35 Z" fill="url(#goldGradPanel)" />
            <circle cx="10" cy="10" r="3.5" fill="#C9ACFF" />
            <path d="M5,15 C5,25 20,25 25,15" fill="none" stroke="url(#goldGradPanel)" strokeWidth="2" />
            <path d="M15,5 C25,5 25,20 15,25" fill="none" stroke="url(#goldGradPanel)" strokeWidth="2" />
          </g>

          {/* CENTER CREST ORNAMENT (Top & Bottom borders) */}
          <g transform="translate(512, 340)">
            <path d="M-80,0 L80,0 C60,18 40,25 0,30 C-40,25 -60,18 -80,0 Z" fill="url(#goldGradPanel)" />
            <path d="M-40,5 C-20,15 20,15 40,5" fill="none" stroke="#2D1B4E" strokeWidth="2" />
            <polygon points="0,5 -10,20 10,20" fill="#BD9CFF" />
          </g>
          
          <g transform="translate(512, 684) scale(1, -1)">
            <path d="M-80,0 L80,0 C60,18 40,25 0,30 C-40,25 -60,18 -80,0 Z" fill="url(#goldGradPanel)" />
            <path d="M-40,5 C-20,15 20,15 40,5" fill="none" stroke="#2D1B4E" strokeWidth="2" />
            <polygon points="0,5 -10,20 10,20" fill="#BD9CFF" />
          </g>

          {/* SIDE GEM STUDS */}
          <g transform="translate(100, 512)">
            <polygon points="-15,0 0,-15 15,0 0,15" fill="url(#goldGradPanel)" />
            <polygon points="-8,0 0,-8 8,0 0,8" fill="#B48DFF" />
            <circle cx="0" cy="0" r="3" fill="#FFFFFF" opacity="0.8" />
          </g>
          
          <g transform="translate(924, 512)">
            <polygon points="-15,0 0,-15 15,0 0,15" fill="url(#goldGradPanel)" />
            <polygon points="-8,0 0,-8 8,0 0,8" fill="#B48DFF" />
            <circle cx="0" cy="0" r="3" fill="#FFFFFF" opacity="0.8" />
          </g>

          {/* GLOSSY PANEL HIGHLIGHT SHINES */}
          <path d="M125,380 L899,380 L885,410 L139,410 Z" fill="#FFFFFF" opacity="0.08" />
          <path d="M140,610 L884,610 L870,640 L154,640 Z" fill="#FFFFFF" opacity="0.04" />
        </svg>
      )
    },
    {
      id: 'attack_icon',
      name: 'Attack Icon',
      icon: Sword,
      filename: 'crownspire_attack_icon',
      description: 'Symmetrical crossed crystal swords, designed with radiant violet blades, a heavy white-gold handguard, and crystal-set runic pommels.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradSwords" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEB" />
              <stop offset="35%" stopColor="#FAD889" />
              <stop offset="70%" stopColor="#C9982E" />
              <stop offset="100%" stopColor="#E0C677" />
            </linearGradient>
            
            <linearGradient id="bladeGradSwords" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#A871FF" />
              <stop offset="40%" stopColor="#E2C6FF" />
              <stop offset="60%" stopColor="#8735FF" />
              <stop offset="100%" stopColor="#4E149E" />
            </linearGradient>

            <linearGradient id="bladeGlowSwords" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#6C1EFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFCCFF" stopOpacity="0.2" />
            </linearGradient>

            <filter id="swordGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="20" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* BACKDROP MAGIC GLOW */}
          <circle cx="512" cy="512" r="300" fill="#9F5EFF" opacity="0.18" filter="url(#swordGlow)" />
          
          {/* ORNATE BACKGROUND SHIELD DESIGN */}
          <path d="M512,180 C580,240 700,240 720,380 C740,520 620,740 512,840 C404,740 284,520 304,380 C324,240 444,240 512,180 Z" fill="#1C0D32" stroke="url(#goldGradSwords)" strokeWidth="6" opacity="0.85" />
          <path d="M512,210 C560,260 660,260 680,380 C700,500 590,680 512,780 C434,680 324,500 344,380 C364,260 464,260 512,210 Z" fill="#110522" opacity="0.9" />

          {/* SWORD 1 - CROSSING LEFT-BOTTOM TO RIGHT-TOP */}
          <g transform="translate(512, 512) rotate(45)">
            {/* Blade Silhouette Glow */}
            <path d="M-15,-380 L0,-430 L15,-380 L15,0 L-15,0 Z" fill="#B98FFF" opacity="0.4" filter="url(#swordGlow)" />
            
            {/* Crystal Blade */}
            <path d="M-12,-370 L0,-415 L12,-370 L12,0 L-12,0 Z" fill="url(#bladeGradSwords)" stroke="#DDBFFF" strokeWidth="1.5" />
            
            {/* Blade Facet Left */}
            <path d="M-12,-370 L0,-415 L0,0 L-12,0 Z" fill="#6916DC" opacity="0.3" />
            {/* Blade Highlight Right */}
            <path d="M0,-415 L12,-370 L12,0 L0,0 Z" fill="#FFFFFF" opacity="0.15" />
            
            {/* White Gold Guard */}
            <path d="M-45,0 C-45,15 -15,25 0,25 C15,25 45,15 45,0 C35,-15 15,-10 0,-10 C-15,-10 -35,-15 -45,0 Z" fill="url(#goldGradSwords)" stroke="#533602" strokeWidth="2" />
            
            {/* Central Guard Gem */}
            <circle cx="0" cy="5" r="8" fill="#8735FF" stroke="#FFFFFF" strokeWidth="1" />
            <circle cx="-2" cy="3" r="2.5" fill="#FFFFFF" opacity="0.8" />

            {/* Hilt Grip */}
            <rect x="-8" y="25" width="16" height="75" rx="4" fill="#3D1D70" stroke="url(#goldGradSwords)" strokeWidth="1.5" />
            <line x1="-8" y1="40" x2="8" y2="40" stroke="url(#goldGradSwords)" strokeWidth="1" />
            <line x1="-8" y1="60" x2="8" y2="60" stroke="url(#goldGradSwords)" strokeWidth="1" />
            <line x1="-8" y1="80" x2="8" y2="80" stroke="url(#goldGradSwords)" strokeWidth="1" />

            {/* Pommel */}
            <circle cx="0" cy="110" r="14" fill="url(#goldGradSwords)" stroke="#533602" strokeWidth="2" />
            <polygon points="0,102 -8,110 0,118 8,110" fill="#9F5EFF" />
          </g>

          {/* SWORD 2 - CROSSING RIGHT-BOTTOM TO LEFT-TOP */}
          <g transform="translate(512, 512) rotate(-45)">
            {/* Blade Silhouette Glow */}
            <path d="M-15,-380 L0,-430 L15,-380 L15,0 L-15,0 Z" fill="#B98FFF" opacity="0.4" filter="url(#swordGlow)" />
            
            {/* Crystal Blade */}
            <path d="M-12,-370 L0,-415 L12,-370 L12,0 L-12,0 Z" fill="url(#bladeGradSwords)" stroke="#DDBFFF" strokeWidth="1.5" />
            
            {/* Blade Facet Left */}
            <path d="M-12,-370 L0,-415 L0,0 L-12,0 Z" fill="#6916DC" opacity="0.3" />
            {/* Blade Highlight Right */}
            <path d="M0,-415 L12,-370 L12,0 L0,0 Z" fill="#FFFFFF" opacity="0.15" />
            
            {/* White Gold Guard */}
            <path d="M-45,0 C-45,15 -15,25 0,25 C15,25 45,15 45,0 C35,-15 15,-10 0,-10 C-15,-10 -35,-15 -45,0 Z" fill="url(#goldGradSwords)" stroke="#533602" strokeWidth="2" />
            
            {/* Central Guard Gem */}
            <circle cx="0" cy="5" r="8" fill="#8735FF" stroke="#FFFFFF" strokeWidth="1" />
            <circle cx="-2" cy="3" r="2.5" fill="#FFFFFF" opacity="0.8" />

            {/* Hilt Grip */}
            <rect x="-8" y="25" width="16" height="75" rx="4" fill="#3D1D70" stroke="url(#goldGradSwords)" strokeWidth="1.5" />
            <line x1="-8" y1="40" x2="8" y2="40" stroke="url(#goldGradSwords)" strokeWidth="1" />
            <line x1="-8" y1="60" x2="8" y2="60" stroke="url(#goldGradSwords)" strokeWidth="1" />
            <line x1="-8" y1="80" x2="8" y2="80" stroke="url(#goldGradSwords)" strokeWidth="1" />

            {/* Pommel */}
            <circle cx="0" cy="110" r="14" fill="url(#goldGradSwords)" stroke="#533602" strokeWidth="2" />
            <polygon points="0,102 -8,110 0,118 8,110" fill="#9F5EFF" />
          </g>

          {/* SPARKLES AND SHINES */}
          <polygon points="512,140 518,170 548,176 518,182 512,212 506,182 476,176 506,170" fill="#FFFFFF" />
          <polygon points="340,320 344,340 364,344 344,348 340,368 336,348 316,344 336,340" fill="#E2C6FF" opacity="0.8" />
          <polygon points="684,320 688,340 708,344 688,348 684,368 680,348 660,344 680,340" fill="#E2C6FF" opacity="0.8" />
        </svg>
      )
    },
    {
      id: 'defense_icon',
      name: 'Defense Icon',
      icon: Shield,
      filename: 'crownspire_defense_icon',
      description: 'White-gold crystal shield. Structured with heavy, stylized golden protective frames and a massive glowing, facet-cut violet crystal core with central warding runes.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradShield" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFEE2" />
              <stop offset="30%" stopColor="#FAD480" />
              <stop offset="70%" stopColor="#C99427" />
              <stop offset="100%" stopColor="#966A10" />
            </linearGradient>
            
            <linearGradient id="gemGradShield" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4A7FF" />
              <stop offset="50%" stopColor="#893CFF" />
              <stop offset="100%" stopColor="#31056E" />
            </linearGradient>

            <filter id="shieldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="20" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* BACKDROP MAGICAL DEFLECTION GLOW */}
          <circle cx="512" cy="512" r="320" fill="#8E46FF" opacity="0.15" filter="url(#shieldGlow)" />
          
          {/* SECURE WHITE-GOLD OUTER SHIELD BASE */}
          <path d="M512,150 C650,150 780,200 800,420 C820,640 680,820 512,890 C344,820 204,640 224,420 C244,200 374,150 512,150 Z" fill="url(#goldGradShield)" stroke="#563B02" strokeWidth="6" />

          {/* INNER ROYAL PURPLE FRAME INSERT */}
          <path d="M512,185 C615,185 740,225 755,420 C770,610 650,770 512,835 C374,770 254,610 269,420 C284,225 409,185 512,185 Z" fill="#1B0934" stroke="#4B1F7E" strokeWidth="4" />

          {/* CENTER GEMSTONE SHIELD PLATING */}
          <path d="M512,230 C590,230 680,260 690,420 C700,570 610,700 512,750 C414,700 324,570 334,420 C344,260 434,230 512,230 Z" fill="url(#gemGradShield)" stroke="#742FFF" strokeWidth="3" />

          {/* CRYSTAL FACETS (Lines indicating 3D cut) */}
          <polygon points="512,230 512,420 690,420" fill="#FFFFFF" opacity="0.1" />
          <polygon points="512,420 512,750 610,700" fill="#000000" opacity="0.2" />
          <polygon points="512,230 512,420 334,420" fill="#000000" opacity="0.1" />
          <polygon points="512,420 512,750 414,700" fill="#FFFFFF" opacity="0.08" />

          {/* WHITE-GOLD EMBOSSED LION/CREST ON THE SHIELD CENTER */}
          <g transform="translate(512, 420)">
            {/* Radiant central crown symbol representing sovereign armor */}
            <path d="M-40,-30 L40,-30 L55,0 L35,30 L-35,30 L-55,0 Z" fill="url(#goldGradShield)" stroke="#533602" strokeWidth="2" />
            <polygon points="0,-45 -12,-15 12,-15" fill="#FFFFFF" />
            <circle cx="0" cy="0" r="12" fill="#3D127C" />
            <circle cx="-1.5" cy="-1.5" r="3" fill="#FFFFFF" opacity="0.9" />
            <path d="M-25,-10 C-15,-5 15,-5 25,-10" fill="none" stroke="url(#goldGradShield)" strokeWidth="1.5" />
          </g>

          {/* ORNATE GOLDEN spikes and rivets */}
          <circle cx="300" cy="300" r="8" fill="url(#goldGradShield)" stroke="#533602" strokeWidth="1" />
          <circle cx="724" cy="300" r="8" fill="url(#goldGradShield)" stroke="#533602" strokeWidth="1" />
          <circle cx="280" cy="500" r="8" fill="url(#goldGradShield)" stroke="#533602" strokeWidth="1" />
          <circle cx="744" cy="500" r="8" fill="url(#goldGradShield)" stroke="#533602" strokeWidth="1" />
          <circle cx="330" cy="670" r="8" fill="url(#goldGradShield)" stroke="#533602" strokeWidth="1" />
          <circle cx="694" cy="670" r="8" fill="url(#goldGradShield)" stroke="#533602" strokeWidth="1" />
        </svg>
      )
    },
    {
      id: 'health_icon',
      name: 'Health Icon',
      icon: Heart,
      filename: 'crownspire_health_icon',
      description: 'Glowing crystal heart representing ultimate health. Crafted of deep violet faceted crystal wrapped beautifully inside a pair of curved white-gold angel wing filigrees.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradHeart" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFEB" />
              <stop offset="30%" stopColor="#FAD889" />
              <stop offset="70%" stopColor="#C9982E" />
              <stop offset="100%" stopColor="#8F670F" />
            </linearGradient>

            <linearGradient id="crystalVioletHeart" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFC8FF" />
              <stop offset="40%" stopColor="#D28BFF" />
              <stop offset="75%" stopColor="#831DFF" />
              <stop offset="100%" stopColor="#3A008F" />
            </linearGradient>

            <filter id="heartGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="25" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* BACKDROP PULSING LIFE GLOW */}
          <circle cx="512" cy="512" r="300" fill="#E266FF" opacity="0.18" filter="url(#heartGlow)" />

          {/* EMBOSSED BACKGROUND WINGS IN GOLD */}
          <g transform="translate(512, 512)">
            {/* Wing Left */}
            <path d="M-80,-200 C-180,-250 -320,-180 -340,-20 C-350,100 -240,240 -60,180" fill="none" stroke="url(#goldGradHeart)" strokeWidth="12" strokeLinecap="round" />
            <path d="M-90,-150 C-170,-190 -280,-140 -290,-10 C-300,90 -210,180 -70,140" fill="none" stroke="url(#goldGradHeart)" strokeWidth="8" strokeLinecap="round" opacity="0.8" />
            
            {/* Wing Right */}
            <path d="M80,-200 C180,-250 320,-180 340,-20 C350,100 240,240 60,180" fill="none" stroke="url(#goldGradHeart)" strokeWidth="12" strokeLinecap="round" />
            <path d="M90,-150 C170,-190 280,-140 290,-10 C300,90 210,180 70,140" fill="none" stroke="url(#goldGradHeart)" strokeWidth="8" strokeLinecap="round" opacity="0.8" />
          </g>

          {/* CENTRAL FACETED CRYSTAL HEART */}
          <g transform="translate(512, 480)">
            {/* Main Heart Base */}
            <path d="M0,-140 C50,-240 220,-240 220,-80 C220,60 100,160 0,260 C-100,160 -220,60 -220,-80 C-220,-240 -50,-240 0,-140 Z" fill="url(#crystalVioletHeart)" stroke="#ECA8FF" strokeWidth="4" filter="url(#heartGlow)" />
            <path d="M0,-140 C50,-240 220,-240 220,-80 C220,60 100,160 0,260 C-100,160 -220,60 -220,-80 C-220,-240 -50,-240 0,-140 Z" fill="url(#crystalVioletHeart)" stroke="#ECA8FF" strokeWidth="4" />

            {/* Crystal Facets and Cuts */}
            <polygon points="0,-140 0,260 120,-10" fill="#FFFFFF" opacity="0.12" />
            <polygon points="0,-140 0,260 -120,-10" fill="#000000" opacity="0.2" />
            
            <polygon points="120,-10 220,-80 140,-120" fill="#FFFFFF" opacity="0.08" />
            <polygon points="-120,-10 -220,-80 -140,-120" fill="#000000" opacity="0.25" />
            
            <polygon points="0,-140 140,-120 0,-70" fill="#FFFFFF" opacity="0.18" />
            <polygon points="0,-140 -140,-120 0,-70" fill="#000000" opacity="0.1" />

            {/* Glowing speculums */}
            <ellipse cx="-80" cy="-110" rx="20" ry="10" transform="rotate(-30, -80, -110)" fill="#FFFFFF" opacity="0.4" />
            <circle cx="80" cy="-60" r="8" fill="#FFFFFF" opacity="0.3" />
          </g>

          {/* GOLD FILIGREE ARCH ON THE APEX */}
          <g transform="translate(512, 280)">
            <path d="M-50,0 Q0,-40 50,0 Q0,-10 -50,0 Z" fill="url(#goldGradHeart)" />
            <circle cx="0" cy="-25" r="8" fill="url(#goldGradHeart)" stroke="#533602" strokeWidth="1" />
            <circle cx="0" cy="-25" r="4" fill="#ECA8FF" />
          </g>
        </svg>
      )
    },
    {
      id: 'leadership_icon',
      name: 'Leadership Icon',
      icon: Crown,
      filename: 'crownspire_leadership_icon',
      description: 'Five-point imperial crown. Forged of white-gold and set with huge glowing purple crystals. Centered with an elegant purple velvet lining inside.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradCrown" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEE5" />
              <stop offset="25%" stopColor="#F9D178" />
              <stop offset="60%" stopColor="#C99124" />
              <stop offset="100%" stopColor="#DEBE6B" />
            </linearGradient>

            <linearGradient id="velvetCrown" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4A1E75" />
              <stop offset="100%" stopColor="#1E0734" />
            </linearGradient>

            <filter id="crownGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="20" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* BACKDROP ROYAL AURA */}
          <circle cx="512" cy="512" r="300" fill="#9946FF" opacity="0.15" filter="url(#crownGlow)" />

          {/* INNER VELVET CAP */}
          <path d="M260,600 C260,400 360,330 512,330 C664,330 760,400 760,600 Z" fill="url(#velvetCrown)" />

          {/* MAIN WHITE-GOLD CROWN STRUCTURE */}
          {/* Back Arches */}
          <path d="M300,550 C360,380 440,320 512,320 C584,320 660,380 720,550" fill="none" stroke="url(#goldGradCrown)" strokeWidth="12" />

          {/* Main front crown base plate with five peaks */}
          <path d="M220,620 L240,430 L350,520 L512,360 L674,520 L784,430 L804,620 Z" fill="url(#goldGradCrown)" stroke="#533602" strokeWidth="4" />

          {/* INNER CUTS & DETAIL PATHS */}
          <path d="M250,590 L260,470 L345,540 L512,410 L679,540 L764,470 L774,590 Z" fill="#1E0734" opacity="0.3" />

          {/* WHITE-GOLD BASE BAND */}
          <path d="M200,600 C200,600 320,660 512,660 C704,660 824,600 824,600 L810,650 C810,650 700,710 512,710 C324,710 214,650 214,650 Z" fill="url(#goldGradCrown)" stroke="#533602" strokeWidth="4" />

          {/* BAND GEM EMBELLISHMENTS */}
          <g transform="translate(512, 655)">
            {/* Center diamond violet gem */}
            <polygon points="0,-16 16,0 0,16 -16,0" fill="#B07CFF" stroke="#FFFFFF" strokeWidth="1.5" />
            <polygon points="0,-8 8,0 0,8 -8,0" fill="#FFFFFF" />
            
            {/* Left gem */}
            <polygon points="-120,-10 -105,0 -120,10 -135,0" fill="#9042FF" stroke="#FFFFFF" strokeWidth="1" />
            <polygon points="-220,-5 -210,0 -220,5 -230,0" fill="#B07CFF" stroke="#FFFFFF" strokeWidth="1" />

            {/* Right gem */}
            <polygon points="120,-10 135,0 120,10 105,0" fill="#9042FF" stroke="#FFFFFF" strokeWidth="1" />
            <polygon points="220,-5 230,0 220,5 210,0" fill="#B07CFF" stroke="#FFFFFF" strokeWidth="1" />
          </g>

          {/* PEAK CROWN GEMS */}
          {/* Center Peak Gem */}
          <g transform="translate(512, 360)">
            <circle cx="0" cy="0" r="18" fill="url(#goldGradCrown)" stroke="#533602" strokeWidth="2" />
            <polygon points="0,-24 14,-10 0,4 -14,-10" fill="#C19BFF" />
            <circle cx="0" cy="-10" r="4" fill="#FFFFFF" />
          </g>

          {/* Left Mid Peak Gem */}
          <g transform="translate(350, 520)">
            <circle cx="0" cy="0" r="14" fill="url(#goldGradCrown)" stroke="#533602" strokeWidth="2" />
            <polygon points="0,-18 10,-8 0,2 -10,-8" fill="#9F5EFF" />
          </g>

          {/* Right Mid Peak Gem */}
          <g transform="translate(674, 520)">
            <circle cx="0" cy="0" r="14" fill="url(#goldGradCrown)" stroke="#533602" strokeWidth="2" />
            <polygon points="0,-18 10,-8 0,2 -10,-8" fill="#9F5EFF" />
          </g>

          {/* Left Wing Peak Gem */}
          <g transform="translate(240, 430)">
            <circle cx="0" cy="0" r="12" fill="url(#goldGradCrown)" stroke="#533602" strokeWidth="2" />
            <polygon points="0,-15 8,-7 0,1 -8,-7" fill="#8735FF" />
          </g>

          {/* Right Wing Peak Gem */}
          <g transform="translate(784, 430)">
            <circle cx="0" cy="0" r="12" fill="url(#goldGradCrown)" stroke="#533602" strokeWidth="2" />
            <polygon points="0,-15 8,-7 0,1 -8,-7" fill="#8735FF" />
          </g>
        </svg>
      )
    },
    {
      id: 'power_icon',
      name: 'Power Icon',
      icon: Star,
      filename: 'crownspire_power_icon',
      description: 'Radiant 8-pointed star representing absolute army power. Features four extensive white-gold crystal spikes and an inner glowing, highly reflective crystal violet core.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradStar" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEE9" />
              <stop offset="35%" stopColor="#F9CD73" />
              <stop offset="70%" stopColor="#C98F22" />
              <stop offset="100%" stopColor="#8A610B" />
            </linearGradient>

            <linearGradient id="violetGradStar" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F2D3FF" />
              <stop offset="50%" stopColor="#9946FF" />
              <stop offset="100%" stopColor="#2E046B" />
            </linearGradient>

            <filter id="starGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="25" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* BACKDROP POWER BURST */}
          <circle cx="512" cy="512" r="280" fill="#BC83FF" opacity="0.2" filter="url(#starGlow)" />
          
          {/* EXPANSIVE INNER GLOW RAYS */}
          <path d="M512,180 L532,492 L844,512 L532,532 L512,844 L492,532 L180,512 L492,492 Z" fill="url(#violetGradStar)" opacity="0.5" filter="url(#starGlow)" />

          {/* MAIN WHITE-GOLD SPARKLE FRAME */}
          <path d="M512,120 L550,474 L904,512 L550,550 L512,904 L474,550 L120,512 L474,474 Z" fill="url(#goldGradStar)" stroke="#533602" strokeWidth="4" />

          {/* INNER FACET DETAIL LINES */}
          <polygon points="512,120 512,512 550,474" fill="#FFFFFF" opacity="0.25" />
          <polygon points="512,904 512,512 474,550" fill="#FFFFFF" opacity="0.15" />
          <polygon points="120,512 512,512 474,474" fill="#FFFFFF" opacity="0.2" />
          <polygon points="904,512 512,512 550,550" fill="#000000" opacity="0.2" />

          {/* INTERMEDIATE DIAGONAL CRYSTAL SPINES (4 shorter spikes) */}
          <g transform="translate(512, 512) rotate(45)">
            <path d="M0,-240 L18,-45 L240,0 L18,45 L0,240 L-18,45 L-240,0 L-18,-45 Z" fill="url(#violetGradStar)" stroke="#C98FFF" strokeWidth="3" />
            <polygon points="0,-240 0,0 18,-45" fill="#FFFFFF" opacity="0.2" />
            <polygon points="0,240 0,0 -18,45" fill="#000000" opacity="0.2" />
          </g>

          {/* HIGHLY GLOWING SPHERICAL CRYSTAL CORE */}
          <circle cx="512" cy="512" r="100" fill="url(#violetGradStar)" stroke="url(#goldGradStar)" strokeWidth="6" filter="url(#starGlow)" />
          <circle cx="512" cy="512" r="100" fill="url(#violetGradStar)" stroke="url(#goldGradStar)" strokeWidth="6" />

          {/* SPECULAR SHINES ON CORE */}
          <circle cx="472" cy="472" r="25" fill="#FFFFFF" opacity="0.45" filter="url(#starGlow)" />
          <circle cx="472" cy="472" r="12" fill="#FFFFFF" opacity="0.8" />
          <circle cx="545" cy="545" r="10" fill="#FFFFFF" opacity="0.2" />
        </svg>
      )
    },
    {
      id: 'level_icon',
      name: 'Level Icon',
      icon: ArrowUp,
      filename: 'crownspire_level_icon',
      description: 'Upward crystal arrow representing progression. Composed of nested chevrons of faceted purple crystal flanked by majestic white-gold wings.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradLevel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFEB" />
              <stop offset="30%" stopColor="#FAD889" />
              <stop offset="70%" stopColor="#C9982E" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>

            <linearGradient id="violetGradLevel" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#4A059B" />
              <stop offset="50%" stopColor="#8E3CFF" />
              <stop offset="100%" stopColor="#ECC4FF" />
            </linearGradient>

            <filter id="levelGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="20" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* BACKDROP UPWARD SPEED GLOW */}
          <circle cx="512" cy="512" r="300" fill="#A15EFF" opacity="0.14" filter="url(#levelGlow)" />
          
          {/* FLANKING WHITE-GOLD ASCENDING WINGS */}
          <g transform="translate(512, 540)">
            {/* Left Wing */}
            <path d="M-60,120 C-180,100 -280,-40 -260,-180 C-250,-240 -190,-300 -120,-320 C-140,-200 -100,-80 -60,0" fill="url(#goldGradLevel)" stroke="#533602" strokeWidth="4" />
            <path d="M-80,80 C-160,70 -220,-30 -210,-120 C-200,-160 -160,-200 -110,-220" fill="none" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.3" />

            {/* Right Wing */}
            <path d="M60,120 C180,100 280,-40 260,-180 C250,-240 190,-300 120,-320 C140,-200 100,-80 60,0" fill="url(#goldGradLevel)" stroke="#533602" strokeWidth="4" />
            <path d="M80,80 C160,70 220,-30 210,-120 C200,-160 160,-200 110,-220" fill="none" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.3" />
          </g>

          {/* DIADEM ORNAMENT AT BASE */}
          <path d="M412,660 L512,580 L612,660 L512,740 Z" fill="url(#goldGradLevel)" stroke="#533602" strokeWidth="3" />
          <circle cx="512" cy="660" r="12" fill="#8735FF" stroke="#FFFFFF" strokeWidth="1" />
          <circle cx="510" cy="658" r="3.5" fill="#FFFFFF" />

          {/* PRIMARY FACETED UPWARD CRYSTAL ARROWS */}
          {/* Lower Chevron */}
          <path d="M360,560 L512,380 L660,560 L512,470 Z" fill="url(#violetGradLevel)" stroke="#C38FFF" strokeWidth="3" />
          <polygon points="512,380 512,470 660,560" fill="#FFFFFF" opacity="0.1" />
          <polygon points="360,560 512,470 512,380" fill="#000000" opacity="0.2" />

          {/* Upper Chevron */}
          <path d="M380,420 L512,240 L644,420 L512,330 Z" fill="url(#violetGradLevel)" stroke="#ECA8FF" strokeWidth="3" filter="url(#levelGlow)" />
          <path d="M380,420 L512,240 L644,420 L512,330 Z" fill="url(#violetGradLevel)" stroke="#ECA8FF" strokeWidth="3" />
          <polygon points="512,240 512,330 644,420" fill="#FFFFFF" opacity="0.15" />
          <polygon points="380,420 512,330 512,240" fill="#000000" opacity="0.2" />

          {/* SPARKS ON THE TIP */}
          <polygon points="512,180 516,200 536,204 516,208 512,228 508,208 488,204 508,200" fill="#FFFFFF" />
        </svg>
      )
    },
    {
      id: 'hero_xp_icon',
      name: 'Hero XP Icon',
      icon: BookOpen,
      filename: 'crownspire_hero_xp_icon',
      description: 'Glowing spellbook representing hero experience. Richly bound in deep royal purple leather, lined with golden hinges, and embossed with a white-gold central seal.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradTome" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFEB" />
              <stop offset="25%" stopColor="#F9CF74" />
              <stop offset="65%" stopColor="#C98F22" />
              <stop offset="100%" stopColor="#8F6209" />
            </linearGradient>

            <linearGradient id="leatherGradTome" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3E1A69" />
              <stop offset="50%" stopColor="#250C47" />
              <stop offset="100%" stopColor="#100322" />
            </linearGradient>

            <linearGradient id="pageGlowTome" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F3D8FF" />
              <stop offset="50%" stopColor="#AA64FF" />
              <stop offset="100%" stopColor="#4A059B" />
            </linearGradient>

            <filter id="tomeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* BACKDROP MAGICAL KNOWLEDGE GLOW */}
          <circle cx="512" cy="512" r="300" fill="#BD72FF" opacity="0.16" filter="url(#tomeGlow)" />

          {/* SYMMETRICAL ANGLE CLOSED MEDIEVAL TOME */}
          {/* Main Book Shadow */}
          <rect x="230" y="230" width="564" height="604" rx="30" fill="#000000" opacity="0.5" filter="url(#tomeGlow)" />

          {/* Leather Book Cover Base */}
          <rect x="230" y="230" width="564" height="604" rx="30" fill="url(#leatherGradTome)" stroke="url(#goldGradTome)" strokeWidth="8" />

          {/* Gilded Book Page Edges (Visible on top, right, bottom) */}
          <rect x="250" y="250" width="524" height="564" rx="15" fill="none" stroke="#D19FFF" strokeWidth="2" opacity="0.3" />

          {/* CORNER REINFORCEMENTS (WHITE GOLD) */}
          {/* Top Left */}
          <path d="M230,310 L230,230 L310,230 Q270,270 230,310 Z" fill="url(#goldGradTome)" stroke="#533602" strokeWidth="2" />
          <circle cx="255" cy="255" r="4" fill="#100322" />
          
          {/* Top Right */}
          <path d="M794,310 L794,230 L714,230 Q754,270 794,310 Z" fill="url(#goldGradTome)" stroke="#533602" strokeWidth="2" />
          <circle cx="769" cy="255" r="4" fill="#100322" />

          {/* Bottom Left */}
          <path d="M230,754 L230,834 L310,834 Q270,794 230,754 Z" fill="url(#goldGradTome)" stroke="#533602" strokeWidth="2" />
          <circle cx="255" cy="809" r="4" fill="#100322" />

          {/* Bottom Right */}
          <path d="M794,754 L794,834 L714,834 Q754,794 794,754 Z" fill="url(#goldGradTome)" stroke="#533602" strokeWidth="2" />
          <circle cx="769" cy="809" r="4" fill="#100322" />

          {/* CENTRAL EMBOSSED SHIELD EMBLEM */}
          <g transform="translate(512, 532)">
            {/* Shield Outline */}
            <path d="M-120,-140 C-60,-140 0,-170 0,-170 C0,-170 60,-140 120,-140 C130,-40 60,80 0,150 C-60,80 -130,-40 -120,-140 Z" fill="url(#goldGradTome)" stroke="#533602" strokeWidth="3" />
            
            {/* Inner Shield Purple Surface */}
            <path d="M-95,-120 C-45,-120 0,-145 0,-145 C0,-145 45,-120 95,-120 C105,-40 50,60 0,115 C-50,60 -105,-40 -95,-120 Z" fill="#250C47" />

            {/* Glowing magic glyph in shield center */}
            <polygon points="0,-70 50,15 0,40 -50,15" fill="url(#pageGlowTome)" stroke="#FFFFFF" strokeWidth="1.5" filter="url(#tomeGlow)" />
            <polygon points="0,-70 50,15 0,40 -50,15" fill="url(#pageGlowTome)" stroke="#FFFFFF" strokeWidth="1.5" />
            
            {/* Specular on center rune */}
            <polygon points="0,-70 0,40 50,15" fill="#FFFFFF" opacity="0.3" />
            <circle cx="0" cy="-10" r="12" fill="#FFFFFF" opacity="0.8" filter="url(#tomeGlow)" />
            <circle cx="0" cy="-10" r="6" fill="#FFFFFF" />
          </g>

          {/* PAGE RIBBON MARKER (Gold) */}
          <path d="M480,230 L480,320 L512,350 L544,320 L544,230 Z" fill="url(#goldGradTome)" stroke="#533602" strokeWidth="2" />
        </svg>
      )
    },
    {
      id: 'ascension_icon',
      name: 'Ascension Icon',
      icon: Gem,
      filename: 'crownspire_ascension_icon',
      description: 'Ascension Crystal representing ultimate ranks. An exquisite vertical amethyst crystal cluster held inside rotating golden orbital rings with cosmic energy flares.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradAsc" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEE9" />
              <stop offset="30%" stopColor="#FAD889" />
              <stop offset="75%" stopColor="#C9982E" />
              <stop offset="100%" stopColor="#7D5707" />
            </linearGradient>

            <linearGradient id="violetGradAsc" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFC6FF" />
              <stop offset="35%" stopColor="#C97FFF" />
              <stop offset="70%" stopColor="#6C16EB" />
              <stop offset="100%" stopColor="#25006E" />
            </linearGradient>

            <filter id="ascGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="25" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* BACKDROP DEEP SPACE NEBULA */}
          <circle cx="512" cy="512" r="300" fill="#AB4EFF" opacity="0.22" filter="url(#ascGlow)" />

          {/* COSMIC DIAGONAL ORBITAL RINGS */}
          <g transform="translate(512, 512) rotate(-25)">
            {/* Outer Ring Back */}
            <ellipse cx="0" cy="0" rx="340" ry="70" fill="none" stroke="url(#goldGradAsc)" strokeWidth="16" opacity="0.5" />
            <ellipse cx="0" cy="0" rx="270" ry="50" fill="none" stroke="#D19CFF" strokeWidth="6" opacity="0.3" />
            
            {/* Little magical orbital satellite spheres */}
            <circle cx="-240" cy="-45" r="18" fill="url(#goldGradAsc)" stroke="#533602" strokeWidth="2" />
            <circle cx="-240" cy="-45" r="8" fill="#FFFFFF" />

            <circle cx="240" cy="45" r="18" fill="url(#goldGradAsc)" stroke="#533602" strokeWidth="2" />
            <circle cx="240" cy="45" r="8" fill="#FFFFFF" />
          </g>

          {/* PRIMARY ASCENSION VERTICAL CRYSTAL */}
          <g transform="translate(512, 512)">
            {/* Crystal Glow Shadow */}
            <polygon points="-80,-280 80,-280 140,-40 0,300 -140,-40" fill="#CC8EFF" opacity="0.4" filter="url(#ascGlow)" />

            {/* Giant Hexagonal Shard */}
            <polygon points="0,-320 100,-120 70,180 0,280 -70,180 -100,-120" fill="url(#violetGradAsc)" stroke="#ECCFFF" strokeWidth="4" />
            
            {/* Crystal Facet Lines (Cuts) */}
            <polygon points="0,-320 0,280 70,180" fill="#FFFFFF" opacity="0.12" />
            <polygon points="0,-320 0,280 -70,180" fill="#000000" opacity="0.25" />

            <polygon points="70,180 100,-120 0,-320" fill="#FFFFFF" opacity="0.06" />
            <polygon points="-70,180 -100,-120 0,-320" fill="#000000" opacity="0.15" />

            {/* Top apex highlight */}
            <polygon points="0,-320 30,-220 0,-180 -30,-220" fill="#FFFFFF" opacity="0.22" />

            {/* Core specs */}
            <ellipse cx="-40" cy="-100" rx="15" ry="50" transform="rotate(-15, -40, -100)" fill="#FFFFFF" opacity="0.25" filter="url(#ascGlow)" />
            <ellipse cx="-40" cy="-100" rx="5" ry="25" transform="rotate(-15, -40, -100)" fill="#FFFFFF" opacity="0.6" />
          </g>

          {/* FOREGROUND RING PARTS FOR INTERLOCKING EFFECT */}
          <g transform="translate(512, 512) rotate(-25)">
            {/* Front half of orbit ring overlays crystal */}
            <path d="M-340,0 A340,70 0 0,0 340,0" fill="none" stroke="url(#goldGradAsc)" strokeWidth="16" />
            <path d="M-270,0 A270,50 0 0,0 270,0" fill="none" stroke="#D19CFF" strokeWidth="6" />
          </g>

          {/* STARBURST FLARES */}
          <g transform="translate(512, 512)">
            <polygon points="0,-360 8,-330 38,-326 8,-322 0,-292 -8,-322 -38,-326 -8,-330" fill="#FFFFFF" />
            <polygon points="0,320 6,290 26,286 6,282 0,252 -6,282 -26,286 -6,290" fill="#FFFFFF" />
          </g>
        </svg>
      )
    },
    {
      id: 'physical_attack',
      name: 'Physical Attack Icon',
      icon: Sword,
      filename: 'crownspire_physical_attack_icon',
      description: 'Crossed heavy battleaxes of white-gold and purple crystal. Designed for physical offense, featuring dynamic physical impact sparks and robust handle wrapping.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradPhys" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEB" />
              <stop offset="35%" stopColor="#FAD889" />
              <stop offset="70%" stopColor="#C9982E" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>
            <linearGradient id="crystalGradPhys" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ECA8FF" />
              <stop offset="50%" stopColor="#9C4EFF" />
              <stop offset="100%" stopColor="#4A059C" />
            </linearGradient>
            <filter id="glowPhys" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#9F5EFF" opacity="0.14" filter="url(#glowPhys)" />
          {/* Back Shield Plate */}
          <path d="M512,200 L680,300 L620,700 L512,820 L404,700 L348,300 Z" fill="#1C0D32" stroke="url(#goldGradPhys)" strokeWidth="4" opacity="0.4" />
          
          {/* Axe 1 (Diagonal Left to Right) */}
          <g transform="translate(512, 512) rotate(-45)">
            <rect x="-10" y="-300" width="20" height="600" rx="10" fill="#2D114F" stroke="url(#goldGradPhys)" strokeWidth="3.5" />
            <path d="M-10,120 L10,120 M-10,180 L10,180 M-10,60 L10,60" stroke="url(#goldGradPhys)" strokeWidth="2.5" />
            {/* Axe Head */}
            <path d="M10,-240 C60,-240 120,-200 130,-140 C100,-100 40,-110 10,-130 Z" fill="url(#crystalGradPhys)" stroke="#ECCFFF" strokeWidth="3" />
            <path d="M-10,-240 C-60,-240 -120,-200 -130,-140 C-100,-100 -40,-110 -10,-130 Z" fill="url(#crystalGradPhys)" stroke="#ECCFFF" strokeWidth="3" />
            {/* Gold Accents on Axe Head */}
            <path d="M10,-210 Q60,-200 60,-150" fill="none" stroke="url(#goldGradPhys)" strokeWidth="3" />
            <path d="M-10,-210 Q-60,-200 -60,-150" fill="none" stroke="url(#goldGradPhys)" strokeWidth="3" />
            {/* Top Point */}
            <polygon points="0,-330 -15,-290 15,-290" fill="url(#goldGradPhys)" stroke="#4A3402" strokeWidth="2" />
          </g>

          {/* Axe 2 (Diagonal Right to Left) */}
          <g transform="translate(512, 512) rotate(45)">
            <rect x="-10" y="-300" width="20" height="600" rx="10" fill="#2D114F" stroke="url(#goldGradPhys)" strokeWidth="3.5" />
            <path d="M-10,120 L10,120 M-10,180 L10,180 M-10,60 L10,60" stroke="url(#goldGradPhys)" strokeWidth="2.5" />
            {/* Axe Head */}
            <path d="M10,-240 C60,-240 120,-200 130,-140 C100,-100 40,-110 10,-130 Z" fill="url(#crystalGradPhys)" stroke="#ECCFFF" strokeWidth="3" />
            <path d="M-10,-240 C-60,-240 -120,-200 -130,-140 C-100,-100 -40,-110 -10,-130 Z" fill="url(#crystalGradPhys)" stroke="#ECCFFF" strokeWidth="3" />
            {/* Gold Accents */}
            <path d="M10,-210 Q60,-200 60,-150" fill="none" stroke="url(#goldGradPhys)" strokeWidth="3" />
            <path d="M-10,-210 Q-60,-200 -60,-150" fill="none" stroke="url(#goldGradPhys)" strokeWidth="3" />
            {/* Top Point */}
            <polygon points="0,-330 -15,-290 15,-290" fill="url(#goldGradPhys)" stroke="#4A3402" strokeWidth="2" />
          </g>

          {/* Golden Center Skull/Lion Emblem */}
          <circle cx="512" cy="512" r="45" fill="url(#goldGradPhys)" stroke="#4A3402" strokeWidth="3" />
          <polygon points="512,485 532,525 492,525" fill="#1C0D32" />
          <circle cx="512" cy="512" r="15" fill="#8E3CFF" />
          <circle cx="510" cy="510" r="4" fill="#FFFFFF" />

          {/* Spark Flares */}
          <g transform="translate(512, 512)" filter="url(#glowPhys)">
            <polygon points="0,-160 5,-140 25,-135 5,-130 0,-110 -5,-130 -25,-135 -5,-140" fill="#FFFFFF" />
            <polygon points="120,80 125,100 145,105 125,110 120,130 115,110 95,105 115,100" fill="#ECCFFF" opacity="0.8" />
          </g>
        </svg>
      )
    },
    {
      id: 'magic_attack',
      name: 'Magic Attack Icon',
      icon: Flame,
      filename: 'crownspire_magic_attack_icon',
      description: 'An exquisite magic scepter made of white-gold, socketing a massive floating crystal orb that radiates magic arcs and purple energy sparkles.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradMagic" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEB" />
              <stop offset="35%" stopColor="#FAD889" />
              <stop offset="70%" stopColor="#C9982E" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>
            <linearGradient id="crystalGradMagic" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFC8FF" />
              <stop offset="50%" stopColor="#9E4EFF" />
              <stop offset="100%" stopColor="#1E004B" />
            </linearGradient>
            <filter id="glowMagic" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="24" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#9F5EFF" opacity="0.16" filter="url(#glowMagic)" />
          
          {/* Background Magic Runes Ring */}
          <circle cx="512" cy="512" r="220" fill="none" stroke="#6C16EB" strokeWidth="6" strokeDasharray="20, 10" opacity="0.5" />
          <circle cx="512" cy="512" r="180" fill="none" stroke="url(#goldGradMagic)" strokeWidth="3" opacity="0.3" />

          {/* The Staff Handle */}
          <rect x="492" y="380" width="40" height="480" rx="15" fill="#250C47" stroke="url(#goldGradMagic)" strokeWidth="5" />
          <path d="M492,440 L532,440 M492,540 L532,540 M492,640 L532,640 M492,740 L532,740" stroke="url(#goldGradMagic)" strokeWidth="3.5" />

          {/* Scepter Crown / Wings */}
          <g transform="translate(512, 360)">
            <path d="M-110,-90 C-110,30 -50,50 0,50 C50,50 110,30 110,-90 C80,-50 40,-40 0,-40 C-40,-40 -80,-50 -110,-90 Z" fill="url(#goldGradMagic)" stroke="#4A3402" strokeWidth="4" />
            {/* Left Fork wing */}
            <path d="M-110,-90 C-150,-180 -100,-250 -60,-240 C-80,-160 -80,-120 -110,-90 Z" fill="url(#goldGradMagic)" stroke="#4A3402" strokeWidth="3" />
            {/* Right Fork wing */}
            <path d="M110,-90 C150,-180 100,-250 60,-240 C80,-160 80,-120 110,-90 Z" fill="url(#goldGradMagic)" stroke="#4A3402" strokeWidth="3" />
          </g>

          {/* Giant Floating Central Magic Crystal Sphere */}
          <circle cx="512" cy="230" r="85" fill="url(#crystalGradMagic)" stroke="#FFFFFF" strokeWidth="3" filter="url(#glowMagic)" />
          <circle cx="512" cy="230" r="85" fill="url(#crystalGradMagic)" stroke="#FFFFFF" strokeWidth="3" />
          
          {/* Inner details / Shine */}
          <ellipse cx="482" cy="200" rx="20" ry="10" transform="rotate(-30, 482, 200)" fill="#FFFFFF" opacity="0.6" />
          <circle cx="542" cy="260" r="12" fill="#FFFFFF" opacity="0.2" />

          {/* Energy Arcs */}
          <path d="M380,230 Q450,210 512,145 M644,230 Q574,210 512,145" fill="none" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" filter="url(#glowMagic)" />
          <path d="M420,320 Q512,280 604,320" fill="none" stroke="#9C4EFF" strokeWidth="3" opacity="0.7" />

          {/* Magic Sparks */}
          <g transform="translate(512, 230)" filter="url(#glowMagic)">
            <polygon points="-160,-100 -140,-100 -150,-120" fill="#ECA8FF" />
            <polygon points="160,-100 140,-100 150,-120" fill="#ECA8FF" />
            <polygon points="0,-160 5,-130 25,-125 5,-120 0,-90 -5,-120 -25,-125 -5,-130" fill="#FFFFFF" />
          </g>
        </svg>
      )
    },
    {
      id: 'physical_defense',
      name: 'Physical Defense Icon',
      icon: Shield,
      filename: 'crownspire_physical_defense_icon',
      description: 'A fortified heavy Tower Shield constructed from layered white-gold plaques, containing iron trim and central purple crystal rivets to withstand direct impacts.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradPhysDef" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEB" />
              <stop offset="35%" stopColor="#FAD889" />
              <stop offset="70%" stopColor="#C9982E" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>
            <linearGradient id="ironGradPhysDef" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3E1D6D" />
              <stop offset="100%" stopColor="#1C0A32" />
            </linearGradient>
            <filter id="glowPhysDef" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#A86BFF" opacity="0.14" filter="url(#glowPhysDef)" />

          {/* Tower Shield Outer Base */}
          <path d="M260,200 L764,200 L714,640 L512,830 L310,640 Z" fill="url(#ironGradPhysDef)" stroke="url(#goldGradPhysDef)" strokeWidth="8" />

          {/* Shield Panels (Layered Plate look) */}
          <path d="M300,240 L724,240 L680,600 L512,760 L344,600 Z" fill="#250F47" stroke="url(#goldGradPhysDef)" strokeWidth="4.5" />
          
          {/* Vertical Golden Center Bar */}
          <path d="M472,240 L552,240 L552,760 L512,800 L472,760 Z" fill="url(#goldGradPhysDef)" stroke="#4A3402" strokeWidth="3.5" />
          
          {/* Symmetrical Boss Spike and Wing Reliefs */}
          <g transform="translate(512, 450)">
            <path d="M-150,-50 C-100,-80 -40,-30 0,-30 C40,-30 100,-80 150,-50 C110,10 50,20 0,20 C-50,20 -110,10 -150,-50 Z" fill="url(#goldGradPhysDef)" stroke="#4A3402" strokeWidth="3" />
            {/* Center Diamond Gem */}
            <polygon points="0,-60 45,0 0,60 -45,0" fill="#BD7FFF" stroke="#FFFFFF" strokeWidth="2.5" />
            <polygon points="0,-60 0,60 45,0" fill="#FFFFFF" opacity="0.15" />
            <circle cx="0" cy="0" r="10" fill="#FFFFFF" opacity="0.8" filter="url(#glowPhysDef)" />
            <circle cx="0" cy="0" r="5" fill="#FFFFFF" />
          </g>

          {/* Heavy Corner Rivets */}
          <circle cx="340" cy="280" r="14" fill="url(#goldGradPhysDef)" stroke="#4A3402" strokeWidth="2" />
          <circle cx="340" cy="280" r="7" fill="#8735FF" />
          <circle cx="684" cy="280" r="14" fill="url(#goldGradPhysDef)" stroke="#4A3402" strokeWidth="2" />
          <circle cx="684" cy="280" r="7" fill="#8735FF" />
          <circle cx="360" cy="560" r="14" fill="url(#goldGradPhysDef)" stroke="#4A3402" strokeWidth="2" />
          <circle cx="360" cy="560" r="7" fill="#8735FF" />
          <circle cx="664" cy="560" r="14" fill="url(#goldGradPhysDef)" stroke="#4A3402" strokeWidth="2" />
          <circle cx="664" cy="560" r="7" fill="#8735FF" />

          {/* Shimmer Shines */}
          <path d="M315,250 L450,250 L450,720 L330,600 Z" fill="#FFFFFF" opacity="0.06" />
        </svg>
      )
    },
    {
      id: 'magic_defense',
      name: 'Magic Defense Icon',
      icon: ShieldAlert,
      filename: 'crownspire_magic_defense_icon',
      description: 'A mystical white-gold warding mirror casting a protective hexagonal grid matrix, designed to block and absorb powerful magic spells.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradMagDef" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEB" />
              <stop offset="35%" stopColor="#FAD889" />
              <stop offset="70%" stopColor="#C9982E" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>
            <linearGradient id="shieldGradMagDef" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ECC8FF" />
              <stop offset="50%" stopColor="#8E3CFF" />
              <stop offset="100%" stopColor="#25006E" />
            </linearGradient>
            <filter id="glowMagDef" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="320" fill="#9F5EFF" opacity="0.18" filter="url(#glowMagDef)" />

          {/* Hexagonal Forcefield Grid in Background */}
          <g opacity="0.35" stroke="#BD7FFF" strokeWidth="2" fill="none">
            <polygon points="512,180 620,240 620,360 512,420 404,360 404,240" />
            <polygon points="620,240 728,300 728,420 620,480 512,420" />
            <polygon points="404,240 512,420 404,480 296,420 296,300" />
            <polygon points="512,420 620,480 620,600 512,660 404,600 404,480" />
            <polygon points="620,480 728,540 728,660 620,720 512,660" />
            <polygon points="404,480 512,660 404,720 296,660 296,540" />
          </g>

          {/* Ornate Warding Shield Frame (Mirror style) */}
          <circle cx="512" cy="512" r="210" fill="url(#shieldGradMagDef)" stroke="url(#goldGradMagDef)" strokeWidth="8.5" />
          
          {/* Inner reflective ring */}
          <circle cx="512" cy="512" r="170" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.35" />

          {/* Dynamic Arc Accents on Frame */}
          <g transform="translate(512, 512)">
            {/* Winged border guards */}
            <path d="M-210,0 C-210,-100 -150,-180 -80,-200 C-110,-150 -110,-50 -80,0 Z" fill="url(#goldGradMagDef)" stroke="#4A3402" strokeWidth="2.5" />
            <path d="M210,0 C210,-100 150,-180 80,-200 C110,-150 110,-50 80,0 Z" fill="url(#goldGradMagDef)" stroke="#4A3402" strokeWidth="2.5" />
            <path d="M-210,0 C-210,100 -150,180 -80,200 C-110,150 -110,50 -80,0 Z" fill="url(#goldGradMagDef)" stroke="#4A3402" strokeWidth="2.5" />
            <path d="M210,0 C210,100 150,180 80,200 C110,150 110,50 80,0 Z" fill="url(#goldGradMagDef)" stroke="#4A3402" strokeWidth="2.5" />
          </g>

          {/* Glowing central rune / Core */}
          <polygon points="512,380 592,512 512,644 432,512" fill="#FFFFFF" opacity="0.2" filter="url(#glowMagDef)" />
          <polygon points="512,410 572,512 512,614 452,512" fill="none" stroke="#FFFFFF" strokeWidth="4.5" />
          <circle cx="512" cy="512" r="18" fill="#FFFFFF" filter="url(#glowMagDef)" />
          <circle cx="512" cy="512" r="10" fill="#FFFFFF" />
        </svg>
      )
    },
    {
      id: 'march_speed',
      name: 'March Speed Icon',
      icon: Footprints,
      filename: 'crownspire_march_speed_icon',
      description: 'Armored combat boots forged in white-gold with majestic purple crystal wings, soaring over soft dynamic trails representing swift army marching speed.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradMarch" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEB" />
              <stop offset="35%" stopColor="#FAD889" />
              <stop offset="70%" stopColor="#C9982E" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>
            <linearGradient id="wingGradMarch" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ECC8FF" />
              <stop offset="60%" stopColor="#8E3CFF" />
              <stop offset="100%" stopColor="#31046E" />
            </linearGradient>
            <filter id="glowMarch" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="20" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#A86BFF" opacity="0.15" filter="url(#glowMarch)" />

          {/* Swooshing purple wind trails under the boot */}
          <path d="M180,720 Q320,600 560,660 T820,540" fill="none" stroke="#9C4EFF" strokeWidth="8" strokeLinecap="round" opacity="0.5" filter="url(#glowMarch)" />
          <path d="M220,760 Q380,660 580,700 T860,620" fill="none" stroke="url(#goldGradMarch)" strokeWidth="4" strokeLinecap="round" opacity="0.6" />

          {/* Armored Winged Boot */}
          <g transform="translate(512, 460) rotate(-15)">
            {/* Shin Guard */}
            <path d="M-60,-160 L40,-160 L30,40 L-40,40 Z" fill="#230A42" stroke="url(#goldGradMarch)" strokeWidth="4.5" />
            <path d="M-10,-120 L20,-120 L15,10 L-15,10 Z" fill="none" stroke="url(#goldGradMarch)" strokeWidth="2.5" />

            {/* Foot portion */}
            <path d="M-40,40 L30,40 L80,130 L-80,130 Z" fill="url(#goldGradMarch)" stroke="#4A3402" strokeWidth="4" />
            <path d="M-80,130 L-100,160 L80,160 L100,130 Z" fill="#1C0D32" stroke="url(#goldGradMarch)" strokeWidth="3" />

            {/* Giant Wing Attachment at Heel */}
            <g transform="translate(-50, 40) scale(1.1)">
              <path d="M0,0 C-80,-20 -150,-100 -180,-140 C-130,-110 -90,-80 0,-40" fill="url(#wingGradMarch)" stroke="#ECCFFF" strokeWidth="3" filter="url(#glowMarch)" />
              <path d="M0,0 C-80,-20 -150,-100 -180,-140 C-130,-110 -90,-80 0,-40" fill="url(#wingGradMarch)" stroke="#ECCFFF" strokeWidth="3" />
              {/* Additional Wing Layers */}
              <path d="M-20,-15 C-70,-35 -120,-85 -140,-110 C-105,-85 -75,-65 -20,-30" fill="url(#wingGradMarch)" stroke="#ECCFFF" strokeWidth="2" opacity="0.8" />
              <path d="M-40,-25 C-70,-45 -100,-75 -110,-90 C-85,-75 -65,-55 -40,-35" fill="url(#wingGradMarch)" stroke="#ECCFFF" strokeWidth="1.5" opacity="0.6" />
            </g>

            {/* Front Gem Stud */}
            <circle cx="20" cy="100" r="12" fill="url(#goldGradMarch)" stroke="#4A3402" strokeWidth="2" />
            <circle cx="20" cy="100" r="6" fill="#BD7FFF" />
          </g>

          {/* Speed sparkles */}
          <polygon points="740,320 744,335 759,339 744,343 740,358 736,343 721,339 736,335" fill="#FFFFFF" />
          <polygon points="280,300 283,310 293,313 283,316 280,326 277,316 267,313 277,310" fill="#ECCFFF" opacity="0.7" />
        </svg>
      )
    },
    {
      id: 'march_capacity',
      name: 'March Capacity Icon',
      icon: Users,
      filename: 'crownspire_march_capacity_icon',
      description: 'A grand war banner flown on a white-gold standard, embossed with the Crownspire emblem to represent increased troop dispatch capacity.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradCap" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEB" />
              <stop offset="35%" stopColor="#FAD889" />
              <stop offset="70%" stopColor="#C9982E" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>
            <linearGradient id="fabricGradCap" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3E1D6D" />
              <stop offset="60%" stopColor="#250A49" />
              <stop offset="100%" stopColor="#120325" />
            </linearGradient>
            <filter id="glowCap" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#BD72FF" opacity="0.14" filter="url(#glowCap)" />

          {/* The Flag Pole (White Gold) */}
          <rect x="496" y="160" width="32" height="720" rx="10" fill="url(#goldGradCap)" stroke="#4A3402" strokeWidth="4" />
          <circle cx="512" cy="150" r="28" fill="url(#goldGradCap)" stroke="#4A3402" strokeWidth="4.5" />
          {/* Top spearhead on flag pole */}
          <polygon points="512,80 492,125 532,125" fill="url(#goldGradCap)" stroke="#4A3402" strokeWidth="2.5" />

          {/* Symmetrical Floating Side Banners */}
          <g transform="translate(512, 180)">
            {/* Main left fabric draping */}
            <path d="M-16,40 L-260,40 C-240,160 -180,280 -16,360 Z" fill="url(#fabricGradCap)" stroke="url(#goldGradCap)" strokeWidth="5.5" />
            {/* Main right fabric draping */}
            <path d="M16,40 L260,40 C240,160 180,280 16,360 Z" fill="url(#fabricGradCap)" stroke="url(#goldGradCap)" strokeWidth="5.5" />

            {/* Inner left fabric accent */}
            <path d="M-36,70 L-200,70 C-180,150 -140,240 -36,290 Z" fill="#4B168C" opacity="0.55" />
            {/* Inner right fabric accent */}
            <path d="M36,70 L200,70 C180,150 140,240 36,290 Z" fill="#4B168C" opacity="0.55" />

            {/* Left gold fringe */}
            <path d="M-260,40 Q-230,180 -16,360" fill="none" stroke="url(#goldGradCap)" strokeWidth="3" opacity="0.5" />
            {/* Right gold fringe */}
            <path d="M260,40 Q230,180 16,360" fill="none" stroke="url(#goldGradCap)" strokeWidth="3" opacity="0.5" />

            {/* Embossed Crown Symbol in the Middle */}
            <g transform="translate(0, 140)" filter="url(#glowCap)">
              <rect x="-80" y="-30" width="160" height="80" rx="10" fill="#1C0D32" stroke="url(#goldGradCap)" strokeWidth="3.5" />
              <polygon points="-40,25 40,25 50,-10 25,10 0,-20 -25,10 -50,-10" fill="url(#goldGradCap)" stroke="#4A3402" strokeWidth="1.5" />
              <circle cx="0" cy="5" r="8" fill="#FFFFFF" />
            </g>
          </g>

          {/* Tassel hangers on banner */}
          <circle cx="280" cy="220" r="15" fill="url(#goldGradCap)" stroke="#4A3402" strokeWidth="3" />
          <path d="M280,235 L280,270" stroke="url(#goldGradCap)" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="744" cy="220" r="15" fill="url(#goldGradCap)" stroke="#4A3402" strokeWidth="3" />
          <path d="M744,235 L744,270" stroke="url(#goldGradCap)" strokeWidth="4.5" strokeLinecap="round" />
        </svg>
      )
    },
    {
      id: 'gathering_speed',
      name: 'Gathering Speed Icon',
      icon: Layers,
      filename: 'crownspire_gathering_speed_icon',
      description: 'Crossed golden sickle and heavy miners pickaxe, set with glowing purple crystal blades. Adorned with resource grain and gemstone sparks.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradGath" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEB" />
              <stop offset="35%" stopColor="#FAD889" />
              <stop offset="70%" stopColor="#C9982E" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>
            <linearGradient id="crystalGradGath" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FAD4FF" />
              <stop offset="50%" stopColor="#9C4EFF" />
              <stop offset="100%" stopColor="#3E0085" />
            </linearGradient>
            <filter id="glowGath" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#9F5EFF" opacity="0.14" filter="url(#glowGath)" />

          {/* Background wreath or sparkling foliage */}
          <path d="M340,680 C300,550 320,410 400,320 M684,680 C724,550 704,410 624,320" fill="none" stroke="url(#goldGradGath)" strokeWidth="4.5" strokeLinecap="round" opacity="0.4" />

          {/* Tool 1 - Golden Pickaxe (Diagonal Left to Right) */}
          <g transform="translate(512, 512) rotate(-35)">
            <rect x="-10" y="-280" width="20" height="560" rx="10" fill="#2E1254" stroke="url(#goldGradGath)" strokeWidth="3" />
            {/* Massive Double Curved Pickaxe Head */}
            <path d="M-140,-240 C-60,-270 60,-270 140,-240 L110,-200 C50,-220 -50,-220 -110,-200 Z" fill="url(#crystalGradGath)" stroke="#ECCFFF" strokeWidth="3" />
            <path d="M0,-240 L0,-275" stroke="url(#goldGradGath)" strokeWidth="3" />
            {/* Center connector bracket */}
            <rect x="-24" y="-250" width="48" height="40" rx="5" fill="url(#goldGradGath)" stroke="#4A3402" strokeWidth="2.5" />
          </g>

          {/* Tool 2 - Druidic Sickle (Diagonal Right to Left) */}
          <g transform="translate(512, 512) rotate(35)">
            <rect x="-8" y="-280" width="16" height="560" rx="8" fill="#2E1254" stroke="url(#goldGradGath)" strokeWidth="3" />
            {/* Highly curved sickle blade */}
            <path d="M8,-240 C100,-240 180,-160 160,-60 C120,-100 80,-140 8,-160 Z" fill="url(#crystalGradGath)" stroke="#ECCFFF" strokeWidth="3" />
            {/* Center bracket */}
            <rect x="-20" y="-250" width="40" height="35" rx="5" fill="url(#goldGradGath)" stroke="#4A3402" strokeWidth="2" />
          </g>

          {/* Radiant sparkling minerals around tools */}
          <g transform="translate(512, 512)" filter="url(#glowGath)">
            <polygon points="-120,40 -100,50 -110,30" fill="#FFFFFF" />
            <polygon points="120,40 100,50 110,30" fill="#FFFFFF" />
            {/* Central Diamond Crystal Lock */}
            <polygon points="0,-35 25,0 0,35 -25,0" fill="url(#goldGradGath)" stroke="#4A3402" strokeWidth="2.5" />
            <polygon points="0,-20 12,0 0,20 -12,0" fill="#8735FF" />
          </g>
        </svg>
      )
    },
    {
      id: 'healing_speed',
      name: 'Healing Speed Icon',
      icon: Activity,
      filename: 'crownspire_healing_speed_icon',
      description: 'An ornate glass vial framed in white-gold and filled with a sparkling purple medical nectar, featuring a shining health cross backdrop.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradHeal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEB" />
              <stop offset="35%" stopColor="#FAD889" />
              <stop offset="70%" stopColor="#C9982E" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>
            <linearGradient id="liquidGradHeal" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#1C053B" />
              <stop offset="45%" stopColor="#6C16EB" />
              <stop offset="85%" stopColor="#9C4EFF" />
              <stop offset="100%" stopColor="#ECCFFF" />
            </linearGradient>
            <filter id="glowHeal" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#8E3CFF" opacity="0.14" filter="url(#glowHeal)" />

          {/* Giant glowing medical cross background */}
          <g opacity="0.25" fill="#9C4EFF" filter="url(#glowHeal)">
            <rect x="442" y="212" width="140" height="600" rx="20" />
            <rect x="212" y="442" width="600" height="140" rx="20" />
          </g>
          <g opacity="0.2" fill="none" stroke="url(#goldGradHeal)" strokeWidth="6">
            <rect x="442" y="212" width="140" height="600" rx="20" />
            <rect x="212" y="442" width="600" height="140" rx="20" />
          </g>

          {/* Ornate Potion/Elixir Bottle */}
          {/* Bottle neck */}
          <rect x="462" y="240" width="100" height="100" fill="none" stroke="url(#goldGradHeal)" strokeWidth="8.5" />
          <path d="M442,240 L582,240" stroke="url(#goldGradHeal)" strokeWidth="12" strokeLinecap="round" />
          
          {/* Round glass flask body */}
          <circle cx="512" cy="520" r="190" fill="url(#liquidGradHeal)" stroke="url(#goldGradHeal)" strokeWidth="10" />

          {/* Glass Specular and Bubbles */}
          <path d="M370,420 A150,150 0 0,1 654,420" fill="none" stroke="#FFFFFF" strokeWidth="6" opacity="0.35" strokeLinecap="round" />
          <ellipse cx="440" cy="460" rx="30" ry="15" transform="rotate(-30, 440, 460)" fill="#FFFFFF" opacity="0.4" />
          
          {/* Glowing Bubbles */}
          <circle cx="480" cy="540" r="14" fill="#FFFFFF" opacity="0.3" filter="url(#glowHeal)" />
          <circle cx="550" cy="500" r="10" fill="#FFFFFF" opacity="0.4" />
          <circle cx="512" cy="580" r="8" fill="#FFFFFF" opacity="0.5" />
          <circle cx="450" cy="590" r="12" fill="#FFFFFF" opacity="0.2" />

          {/* Golden wings flanking the bottle */}
          <g transform="translate(512, 520)">
            <path d="M-190,-40 C-240,-120 -300,-110 -310,-40 C-260,-40 -220,-30 -190,-40" fill="url(#goldGradHeal)" stroke="#4A3402" strokeWidth="3.5" />
            <path d="M190,-40 C240,-120 300,-110 310,-40 C260,-40 220,-30 190,-40" fill="url(#goldGradHeal)" stroke="#4A3402" strokeWidth="3.5" />
          </g>
        </svg>
      )
    },
    {
      id: 'training_speed',
      name: 'Training Speed Icon',
      icon: Target,
      filename: 'crownspire_training_speed_icon',
      description: 'A grand white-gold military practice target socketed with crossed cadet blades, promoting rapid elite troop recruitment and combat training.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradTrain" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEB" />
              <stop offset="35%" stopColor="#FAD889" />
              <stop offset="70%" stopColor="#C9982E" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>
            <linearGradient id="targetRed" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C38FFF" />
              <stop offset="100%" stopColor="#4A059B" />
            </linearGradient>
            <filter id="glowTrain" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#9F5EFF" opacity="0.15" filter="url(#glowTrain)" />

          {/* Crossed cadet training swords in the background */}
          <g transform="translate(512, 512) rotate(45)">
            <rect x="-10" y="-280" width="20" height="560" rx="8" fill="#1C053B" stroke="url(#goldGradTrain)" strokeWidth="3" />
            <path d="M-40,-180 L40,-180 L0,-240 Z" fill="url(#goldGradTrain)" stroke="#4A3402" strokeWidth="2" />
          </g>
          <g transform="translate(512, 512) rotate(-45)">
            <rect x="-10" y="-280" width="20" height="560" rx="8" fill="#1C053B" stroke="url(#goldGradTrain)" strokeWidth="3" />
            <path d="M-40,-180 L40,-180 L0,-240 Z" fill="url(#goldGradTrain)" stroke="#4A3402" strokeWidth="2" />
          </g>

          {/* Layered Round Target Guard (White Gold) */}
          <circle cx="512" cy="512" r="210" fill="url(#goldGradTrain)" stroke="#4A3402" strokeWidth="6" />
          
          {/* Target Ring 1 */}
          <circle cx="512" cy="512" r="160" fill="url(#targetRed)" stroke="url(#goldGradTrain)" strokeWidth="3.5" />
          
          {/* Target Ring 2 */}
          <circle cx="512" cy="512" r="110" fill="#1A0436" stroke="url(#goldGradTrain)" strokeWidth="3" />

          {/* Target Center Bulls-eye Gem */}
          <circle cx="512" cy="512" r="60" fill="url(#goldGradTrain)" stroke="#4A3402" strokeWidth="3" />
          <polygon points="512,472 546,532 478,532" fill="#8E3CFF" filter="url(#glowTrain)" />
          <polygon points="512,472 546,532 478,532" fill="#8E3CFF" />
          <circle cx="512" cy="512" r="14" fill="#FFFFFF" />

          {/* Impact sparks */}
          <g transform="translate(512, 512)" filter="url(#glowTrain)">
            <polygon points="-100,-100 -80,-95 -95,-115" fill="#FFFFFF" />
            <polygon points="100,100 80,95 95,115" fill="#FFFFFF" />
          </g>
        </svg>
      )
    },
    {
      id: 'research_speed',
      name: 'Research Speed Icon',
      icon: Compass,
      filename: 'crownspire_research_speed_icon',
      description: 'A floating celestial astrolabe revolving around a giant glowing runic purple core, enabling rapid technological and scientific progression.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradRes" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEB" />
              <stop offset="35%" stopColor="#FAD889" />
              <stop offset="70%" stopColor="#C9982E" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>
            <linearGradient id="orbGradRes" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFCCFF" />
              <stop offset="55%" stopColor="#8E3CFF" />
              <stop offset="100%" stopColor="#1E004B" />
            </linearGradient>
            <filter id="glowRes" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="24" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#9F5EFF" opacity="0.16" filter="url(#glowRes)" />

          {/* Open spellbook/scroll behind the astrolabe */}
          <g transform="translate(512, 600) scale(1.15)">
            <path d="M-180,60 C-100,10 -30,40 0,60 C30,40 100,10 180,60 L140,-40 C80,-80 30,-50 0,-30 C-30,-50 -80,-80 -140,-40 Z" fill="#250C47" stroke="url(#goldGradRes)" strokeWidth="3" opacity="0.7" />
          </g>

          {/* Concentric rotating brass/gold rings */}
          <circle cx="512" cy="460" r="230" fill="none" stroke="url(#goldGradRes)" strokeWidth="12" />
          <circle cx="512" cy="460" r="180" fill="none" stroke="url(#goldGradRes)" strokeWidth="5.5" strokeDasharray="30, 15" opacity="0.75" />
          <circle cx="512" cy="460" r="140" fill="none" stroke="#6C16EB" strokeWidth="4.5" />

          {/* Measuring compass legs overlay (Astrolabe needle) */}
          <g transform="translate(512, 460) rotate(45)">
            <polygon points="-12,-160 12,-160 6,160 -6,160" fill="url(#goldGradRes)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="22" fill="url(#goldGradRes)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="12" fill="#8E3CFF" />
          </g>

          {/* Outer measuring ticks */}
          <g transform="translate(512, 460)">
            <line x1="0" y1="-230" x2="0" y2="-210" stroke="url(#goldGradRes)" strokeWidth="4" />
            <line x1="0" y1="230" x2="0" y2="210" stroke="url(#goldGradRes)" strokeWidth="4" />
            <line x1="-230" y1="0" x2="-210" y2="0" stroke="url(#goldGradRes)" strokeWidth="4" />
            <line x1="230" y1="0" x2="210" y2="0" stroke="url(#goldGradRes)" strokeWidth="4" />
          </g>

          {/* Glowing central crystal core */}
          <circle cx="512" cy="460" r="80" fill="url(#orbGradRes)" stroke="#FFFFFF" strokeWidth="3" filter="url(#glowRes)" opacity="0.4" />
          <circle cx="512" cy="460" r="50" fill="url(#orbGradRes)" stroke="#FFFFFF" strokeWidth="2.5" />

          {/* Floating magic runes */}
          <polygon points="320,380 340,380 330,360" fill="#ECA8FF" filter="url(#glowRes)" />
          <polygon points="700,380 680,380 690,360" fill="#ECA8FF" filter="url(#glowRes)" />
        </svg>
      )
    },
    {
      id: 'construction_speed',
      name: 'Construction Speed Icon',
      icon: Hammer,
      filename: 'crownspire_construction_speed_icon',
      description: 'A heavy master builder\'s hammer with a solid purple crystal head, shown finalizing the crenellated defense towers of a white-gold fortress wall.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradConst" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEB" />
              <stop offset="35%" stopColor="#FAD889" />
              <stop offset="70%" stopColor="#C9982E" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>
            <linearGradient id="crystalGradConst" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ECC8FF" />
              <stop offset="50%" stopColor="#9C4EFF" />
              <stop offset="100%" stopColor="#2E046B" />
            </linearGradient>
            <filter id="glowConst" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#A86BFF" opacity="0.14" filter="url(#glowConst)" />

          {/* Castle Wall / Fortress Backdrop */}
          <g transform="translate(512, 600)">
            {/* Base wall */}
            <path d="M-240,160 L240,160 L240,40 L160,40 L160,0 L80,0 L80,40 L-80,40 L-80,0 L-160,0 L-160,40 L-240,40 Z" fill="#250C47" stroke="url(#goldGradConst)" strokeWidth="5.5" />
            {/* Masonry joint lines */}
            <path d="M-160,90 L240,90 M-80,90 L-80,160 M80,90 L80,160 M0,40 L0,90" stroke="url(#goldGradConst)" strokeWidth="3" opacity="0.5" />
          </g>

          {/* Diagonal Heavy Builder\'s Hammer */}
          <g transform="translate(512, 440) rotate(-30)">
            {/* Hammer shaft */}
            <rect x="-12" y="-120" width="24" height="420" rx="10" fill="#2E1254" stroke="url(#goldGradConst)" strokeWidth="3.5" />
            <path d="M-12,40 L12,40 M-12,120 L12,120 M-12,200 L12,200" stroke="url(#goldGradConst)" strokeWidth="2.5" />

            {/* Massive Double-Sided Crystal Hammer Head */}
            <path d="M-110,-120 L110,-120 L90,-50 L-90,-50 Z" fill="url(#crystalGradConst)" stroke="#ECCFFF" strokeWidth="4.5" />
            <path d="M-90,-120 L-90,-50 M90,-120 L90,-50" stroke="#ECCFFF" strokeWidth="2.5" opacity="0.5" />
            <path d="M-110,-120 L-130,-85 L-110,-50 Z" fill="url(#goldGradConst)" stroke="#4A3402" strokeWidth="2" />
            <path d="M110,-120 L130,-85 L110,-50 Z" fill="url(#goldGradConst)" stroke="#4A3402" strokeWidth="2" />

            {/* Center bracket */}
            <rect x="-28" y="-135" width="56" height="100" rx="6" fill="url(#goldGradConst)" stroke="#4A3402" strokeWidth="3" />
            <circle cx="0" cy="-85" r="10" fill="#8735FF" />
          </g>

          {/* Construction dust and spark rings */}
          <circle cx="512" cy="512" r="220" fill="none" stroke="url(#goldGradConst)" strokeWidth="2.5" strokeDasharray="15, 15" opacity="0.3" />
          <g transform="translate(512, 512)" filter="url(#glowConst)">
            <polygon points="-160,-20 -150,-15 -155,-35" fill="#FFFFFF" />
            <polygon points="140,-120 150,-115 145,-135" fill="#FFFFFF" />
          </g>
        </svg>
      )
    },
    {
      id: 'attack_rune',
      name: 'Arcane Attack Rune',
      icon: Sword,
      filename: 'crownspire_attack_rune',
      description: 'A premium, ultra-detailed white-gold engraved battle rune with a dark basalt core, pulsing with heavy purple crystal energy and crossed sovereign broadswords.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradAttack" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FAD889" />
              <stop offset="70%" stopColor="#C9982E" />
              <stop offset="100%" stopColor="#6E4A00" />
            </linearGradient>
            <linearGradient id="purpleGradAttack" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E0B0FF" />
              <stop offset="50%" stopColor="#9A4BFF" />
              <stop offset="100%" stopColor="#2A005E" />
            </linearGradient>
            <linearGradient id="basaltGradAttack" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#25133A" />
              <stop offset="50%" stopColor="#120621" />
              <stop offset="100%" stopColor="#05010B" />
            </linearGradient>
            <filter id="glowAttack" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="24" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="320" fill="#9C4EFF" opacity="0.12" filter="url(#glowAttack)" />
          
          {/* Main Octagonal Runestone Tablet */}
          <polygon points="512,140 775,249 884,512 775,775 512,884 249,775 140,512 249,249" fill="url(#basaltGradAttack)" stroke="url(#goldGradAttack)" strokeWidth="8" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.7))" />
          
          {/* Inner Glowing Runic Ring */}
          <polygon points="512,180 745,277 844,512 745,747 512,844 277,747 180,512 277,277" fill="none" stroke="#7E3AFF" strokeWidth="3" opacity="0.4" />
          <polygon points="512,200 725,289 824,512 725,735 512,824 289,735 200,512 289,289" fill="none" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="12, 10" opacity="0.6" />

          {/* White-Gold Ornate Edge Brackets */}
          <g transform="translate(512, 512)">
            {/* Top-Left Bracket */}
            <path d="M-230,-230 L-200,-250 L-140,-200 L-200,-140 Z" fill="url(#goldGradAttack)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-190" cy="-190" r="12" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowAttack)" />
            
            {/* Top-Right Bracket */}
            <path d="M230,-230 L200,-250 L140,-200 L200,-140 Z" fill="url(#goldGradAttack)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="190" cy="-190" r="12" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowAttack)" />

            {/* Bottom-Left Bracket */}
            <path d="M-230,230 L-200,250 L-140,200 L-200,140 Z" fill="url(#goldGradAttack)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-190" cy="190" r="12" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowAttack)" />

            {/* Bottom-Right Bracket */}
            <path d="M230,230 L200,250 L140,200 L200,140 Z" fill="url(#goldGradAttack)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="190" cy="190" r="12" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowAttack)" />
          </g>

          {/* Crossed White-Gold Broadswords */}
          <g transform="translate(512, 512) scale(1.15)">
            {/* Sword 1: Bottom-Left to Top-Right */}
            <g transform="rotate(-45)">
              <path d="M-10,130 L10,130 L6,-110 L0,-140 L-6,-110 Z" fill="url(#goldGradAttack)" stroke="#301E03" strokeWidth="2.5" />
              <path d="M-2,-110 L2,-110 L1,120 L-1,120 Z" fill="#FFFFFF" opacity="0.6" />
              {/* Guard */}
              <path d="M-30,120 L30,120 L25,105 L-25,105 Z" fill="url(#goldGradAttack)" stroke="#301E03" strokeWidth="2" />
              {/* Pommel */}
              <circle cx="0" cy="140" r="10" fill="url(#goldGradAttack)" stroke="#301E03" strokeWidth="2" />
              <circle cx="0" cy="140" r="5" fill="#A855F7" />
            </g>
            {/* Sword 2: Bottom-Right to Top-Left */}
            <g transform="rotate(45)">
              <path d="M-10,130 L10,130 L6,-110 L0,-140 L-6,-110 Z" fill="url(#goldGradAttack)" stroke="#301E03" strokeWidth="2.5" />
              <path d="M-2,-110 L2,-110 L1,120 L-1,120 Z" fill="#FFFFFF" opacity="0.6" />
              {/* Guard */}
              <path d="M-30,120 L30,120 L25,105 L-25,105 Z" fill="url(#goldGradAttack)" stroke="#301E03" strokeWidth="2" />
              {/* Pommel */}
              <circle cx="0" cy="140" r="10" fill="url(#goldGradAttack)" stroke="#301E03" strokeWidth="2" />
              <circle cx="0" cy="140" r="5" fill="#A855F7" />
            </g>
          </g>

          {/* Central Amethyst Power Core */}
          <g transform="translate(512, 512)" filter="url(#glowAttack)">
            <polygon points="0,-95 45,-15 30,80 -30,80 -45,-15" fill="url(#purpleGradAttack)" stroke="#FFFEEF" strokeWidth="3" />
            <polygon points="0,-95 0,80 30,80 45,-15" fill="#FFFFFF" opacity="0.25" />
            <polygon points="0,-95 -15,-15 -30,80 0,80" fill="#1A003B" opacity="0.3" />
          </g>

          {/* Glowing Purple Arcane Sparkles */}
          <circle cx="512" cy="512" r="16" fill="#FFFFFF" filter="url(#glowAttack)" />
          <polygon points="512,410 520,430 540,430 522,442 528,462 512,448 496,462 502,442 484,430 504,430" fill="#FFFFFF" filter="url(#glowAttack)" />
          <polygon points="350,580 355,590 365,590 357,596 360,606 350,599 340,606 343,596 335,590 345,590" fill="#ECA8FF" />
          <polygon points="670,580 675,590 685,590 677,596 680,606 670,599 660,606 663,596 655,590 665,590" fill="#ECA8FF" />
        </svg>
      )
    },
    {
      id: 'defense_rune',
      name: 'Arcane Defense Rune',
      icon: Shield,
      filename: 'crownspire_defense_rune',
      description: 'A premium, highly-detailed white-gold shield rune with heavy castle bastions and glowing purple protection rings.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradDefense" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FAD889" />
              <stop offset="70%" stopColor="#C9982E" />
              <stop offset="100%" stopColor="#6E4A00" />
            </linearGradient>
            <linearGradient id="purpleGradDefense" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5D0FF" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#3B008C" />
            </linearGradient>
            <linearGradient id="basaltGradDefense" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#25133A" />
              <stop offset="50%" stopColor="#120621" />
              <stop offset="100%" stopColor="#05010B" />
            </linearGradient>
            <filter id="glowDefense" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="24" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="320" fill="#9C4EFF" opacity="0.12" filter="url(#glowDefense)" />
          
          {/* Main Octagonal Runestone Tablet */}
          <polygon points="512,140 775,249 884,512 775,775 512,884 249,775 140,512 249,249" fill="url(#basaltGradDefense)" stroke="url(#goldGradDefense)" strokeWidth="8" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.7))" />
          
          {/* Inner Ring */}
          <polygon points="512,180 745,277 844,512 745,747 512,844 277,747 180,512 277,277" fill="none" stroke="#7E3AFF" strokeWidth="3" opacity="0.4" />
          <polygon points="512,200 725,289 824,512 725,735 512,824 289,735 200,512 289,289" fill="none" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="12, 10" opacity="0.6" />

          {/* White-Gold Ornate Edge Brackets */}
          <g transform="translate(512, 512)">
            <path d="M-230,-230 L-200,-250 L-140,-200 L-200,-140 Z" fill="url(#goldGradDefense)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-190" cy="-190" r="12" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowDefense)" />
            
            <path d="M230,-230 L200,-250 L140,-200 L200,-140 Z" fill="url(#goldGradDefense)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="190" cy="-190" r="12" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowDefense)" />

            <path d="M-230,230 L-200,250 L-140,200 L-200,140 Z" fill="url(#goldGradDefense)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-190" cy="190" r="12" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowDefense)" />

            <path d="M230,230 L200,250 L140,200 L200,140 Z" fill="url(#goldGradDefense)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="190" cy="190" r="12" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowDefense)" />
          </g>

          {/* Heavy Castle Bastions Backdrop */}
          <g transform="translate(512, 450) scale(1.1)">
            {/* Castle Wall */}
            <path d="M-140,60 L140,60 L140,0 L110,0 L110,-30 L80,-30 L80,0 L50,0 L50,-30 L20,-30 L20,0 L-20,0 L-20,-30 L-50,-30 L-50,0 L-80,0 L-80,-30 L-110,-30 L-110,0 L-140,0 Z" fill="#2E1854" stroke="url(#goldGradDefense)" strokeWidth="3" opacity="0.8" />
            {/* Masonry joint lines */}
            <path d="M-100,30 L100,30 M-50,30 L-50,60 M50,30 L50,60" stroke="url(#goldGradDefense)" strokeWidth="1.5" opacity="0.4" />
          </g>

          {/* Massive Fortress Shield in White-Gold and Glowing Amethyst */}
          <g transform="translate(512, 512) scale(1.15)">
            {/* Shield Outer frame */}
            <path d="M-80,-100 L80,-100 Q80,20 0,110 Q-80,20 -80,-100 Z" fill="url(#basaltGradDefense)" stroke="url(#goldGradDefense)" strokeWidth="8.5" filter="drop-shadow(0 10px 20px rgba(0,0,0,0.5))" />
            
            {/* Inner Shield Body */}
            <path d="M-65,-85 L65,-85 Q65,15 0,95 Q-65,15 -65,-85 Z" fill="url(#purpleGradDefense)" opacity="0.9" />

            {/* Glowing Shield Runes */}
            <path d="M-35,-40 L35,-40 M0,-75 L0,65" stroke="#FFFFFF" strokeWidth="4.5" strokeLinecap="round" opacity="0.95" filter="url(#glowDefense)" />
            <circle cx="0" cy="-40" r="12" fill="#FFFFFF" filter="url(#glowDefense)" />
            <circle cx="0" cy="-40" r="7" fill="#A855F7" />
          </g>

          {/* Protection Shockwaves / Orbit Rings */}
          <circle cx="512" cy="512" r="210" fill="none" stroke="#D8B4FE" strokeWidth="2" strokeDasharray="8, 20" opacity="0.4" />
        </svg>
      )
    },
    {
      id: 'health_rune',
      name: 'Arcane Health Rune',
      icon: Heart,
      filename: 'crownspire_health_rune',
      description: 'A premium, highly-detailed white-gold health rune featuring a pulsing purple crystal heart enveloped in white-gold life-vines.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradHealth" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FAD889" />
              <stop offset="70%" stopColor="#C9982E" />
              <stop offset="100%" stopColor="#6E4A00" />
            </linearGradient>
            <linearGradient id="purpleGradHealth" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE3FF" />
              <stop offset="50%" stopColor="#D946EF" />
              <stop offset="100%" stopColor="#4A044E" />
            </linearGradient>
            <linearGradient id="basaltGradHealth" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#25133A" />
              <stop offset="50%" stopColor="#120621" />
              <stop offset="100%" stopColor="#05010B" />
            </linearGradient>
            <filter id="glowHealth" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="24" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="320" fill="#9C4EFF" opacity="0.12" filter="url(#glowHealth)" />
          
          {/* Main Octagonal Runestone Tablet */}
          <polygon points="512,140 775,249 884,512 775,775 512,884 249,775 140,512 249,249" fill="url(#basaltGradHealth)" stroke="url(#goldGradHealth)" strokeWidth="8" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.7))" />
          
          {/* Inner Ring */}
          <polygon points="512,180 745,277 844,512 745,747 512,844 277,747 180,512 277,277" fill="none" stroke="#7E3AFF" strokeWidth="3" opacity="0.4" />
          <polygon points="512,200 725,289 824,512 725,735 512,824 289,735 200,512 289,289" fill="none" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="12, 10" opacity="0.6" />

          {/* White-Gold Ornate Edge Brackets */}
          <g transform="translate(512, 512)">
            <path d="M-230,-230 L-200,-250 L-140,-200 L-200,-140 Z" fill="url(#goldGradHealth)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-190" cy="-190" r="12" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowHealth)" />
            
            <path d="M230,-230 L200,-250 L140,-200 L200,-140 Z" fill="url(#goldGradHealth)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="190" cy="-190" r="12" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowHealth)" />

            <path d="M-230,230 L-200,250 L-140,200 L-200,140 Z" fill="url(#goldGradHealth)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-190" cy="190" r="12" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowHealth)" />

            <path d="M230,230 L200,250 L140,200 L200,140 Z" fill="url(#goldGradHealth)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="190" cy="190" r="12" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowHealth)" />
          </g>

          {/* Floating White-Gold Life Branches */}
          <g transform="translate(512, 512) scale(1.1)">
            <path d="M-110,60 Q-80,-60 -30,-40 Q0,-20 0,-100" fill="none" stroke="url(#goldGradHealth)" strokeWidth="6.5" strokeLinecap="round" opacity="0.8" />
            <path d="M110,60 Q80,-60 30,-40 Q0,-20 0,-100" fill="none" stroke="url(#goldGradHealth)" strokeWidth="6.5" strokeLinecap="round" opacity="0.8" />
            
            {/* Small leaves */}
            <path d="M-75,0 Q-90,-15 -100,-5 Q-85,15 -75,0 Z" fill="url(#goldGradHealth)" stroke="#3D2502" strokeWidth="1.5" />
            <path d="M75,0 Q90,-15 100,-5 Q85,15 75,0 Z" fill="url(#goldGradHealth)" stroke="#3D2502" strokeWidth="1.5" />
          </g>

          {/* Pulsing 3D Amethyst Heart Core */}
          <g transform="translate(512, 512) scale(1.2)">
            <path d="M0,80 C-70,30 -105,-40 -52.5,-80 C-17.5,-100 0,-50 0,-50 C0,-50 17.5,-100 52.5,-80 C105,-40 70,30 0,80 Z" fill="url(#purpleGradHealth)" stroke="#FFFEEF" strokeWidth="3.5" filter="url(#glowHealth)" />
            {/* Facet Highlights */}
            <path d="M0,80 L0,-50 L-52.5,-80 Z" fill="#FFFFFF" opacity="0.22" />
            <path d="M0,80 L52.5,-80 L0,-50 Z" fill="#1A003B" opacity="0.25" />
          </g>

          {/* Healing sparkles */}
          <circle cx="512" cy="460" r="10" fill="#FFFFFF" filter="url(#glowHealth)" />
          <circle cx="430" cy="530" r="6" fill="#F0ABFC" filter="url(#glowHealth)" />
          <circle cx="594" cy="530" r="6" fill="#F0ABFC" filter="url(#glowHealth)" />
        </svg>
      )
    },
    {
      id: 'leadership_rune',
      name: 'Arcane Leadership Rune',
      icon: Crown,
      filename: 'crownspire_leadership_rune',
      description: 'A premium, highly-detailed white-gold monarch crown rune embedded with deep purple crystalline jewel accents and celestial rays.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradLead" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FAD889" />
              <stop offset="70%" stopColor="#C9982E" />
              <stop offset="100%" stopColor="#6E4A00" />
            </linearGradient>
            <linearGradient id="purpleGradLead" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE3FF" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#2E046B" />
            </linearGradient>
            <linearGradient id="basaltGradLead" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#25133A" />
              <stop offset="50%" stopColor="#120621" />
              <stop offset="100%" stopColor="#05010B" />
            </linearGradient>
            <filter id="glowLead" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="24" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="320" fill="#9C4EFF" opacity="0.12" filter="url(#glowLead)" />
          
          {/* Main Octagonal Runestone Tablet */}
          <polygon points="512,140 775,249 884,512 775,775 512,884 249,775 140,512 249,249" fill="url(#basaltGradLead)" stroke="url(#goldGradLead)" strokeWidth="8" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.7))" />
          
          {/* Inner Ring */}
          <polygon points="512,180 745,277 844,512 745,747 512,844 277,747 180,512 277,277" fill="none" stroke="#7E3AFF" strokeWidth="3" opacity="0.4" />
          <polygon points="512,200 725,289 824,512 725,735 512,824 289,735 200,512 289,289" fill="none" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="12, 10" opacity="0.6" />

          {/* White-Gold Ornate Edge Brackets */}
          <g transform="translate(512, 512)">
            <path d="M-230,-230 L-200,-250 L-140,-200 L-200,-140 Z" fill="url(#goldGradLead)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-190" cy="-190" r="12" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowLead)" />
            
            <path d="M230,-230 L200,-250 L140,-200 L200,-140 Z" fill="url(#goldGradLead)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="190" cy="-190" r="12" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowLead)" />

            <path d="M-230,230 L-200,250 L-140,200 L-200,140 Z" fill="url(#goldGradLead)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-190" cy="190" r="12" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowLead)" />

            <path d="M230,230 L200,250 L140,200 L200,140 Z" fill="url(#goldGradLead)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="190" cy="190" r="12" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowLead)" />
          </g>

          {/* Imperial Sovereign Crown */}
          <g transform="translate(512, 512) scale(1.15)">
            {/* Crown Base Rim */}
            <path d="M-110,60 L110,60 L100,30 L-100,30 Z" fill="url(#goldGradLead)" stroke="#3A2301" strokeWidth="3.5" />
            <circle cx="-70" cy="45" r="5" fill="#D946EF" />
            <circle cx="0" cy="45" r="7" fill="#C084FC" />
            <circle cx="70" cy="45" r="5" fill="#D946EF" />
            
            {/* Crown Spikes */}
            {/* Center Peak */}
            <path d="M-20,30 L0,-70 L20,30 Z" fill="url(#goldGradLead)" stroke="#3A2301" strokeWidth="3.5" />
            <circle cx="0" cy="-75" r="10" fill="url(#purpleGradLead)" stroke="#FFFFFF" strokeWidth="1.5" filter="url(#glowLead)" />
            
            {/* Left Peak */}
            <path d="M-75,30 L-60,-35 L-25,30 Z" fill="url(#goldGradLead)" stroke="#3A2301" strokeWidth="3.5" />
            <circle cx="-60" cy="-40" r="7.5" fill="url(#purpleGradLead)" stroke="#FFFFFF" strokeWidth="1" filter="url(#glowLead)" />

            {/* Right Peak */}
            <path d="M75,30 L60,-35 L25,30 Z" fill="url(#goldGradLead)" stroke="#3A2301" strokeWidth="3.5" />
            <circle cx="60" cy="-40" r="7.5" fill="url(#purpleGradLead)" stroke="#FFFFFF" strokeWidth="1" filter="url(#glowLead)" />

            {/* Velvet Cap Overlay */}
            <path d="M-100,30 C-100,-20 -50,-30 0,-30 C50,-30 100,-20 100,30 Z" fill="#2E1253" opacity="0.5" />
          </g>

          {/* Majestic Celestial Rays */}
          <g transform="translate(512, 512)" opacity="0.35">
            <line x1="0" y1="-180" x2="0" y2="-130" stroke="url(#goldGradLead)" strokeWidth="3" />
            <line x1="180" y1="0" x2="130" y2="0" stroke="url(#goldGradLead)" strokeWidth="3" />
            <line x1="0" y1="180" x2="0" y2="130" stroke="url(#goldGradLead)" strokeWidth="3" />
            <line x1="-180" y1="0" x2="-130" y2="0" stroke="url(#goldGradLead)" strokeWidth="3" />
          </g>
        </svg>
      )
    },
    {
      id: 'gather_rune',
      name: 'Arcane Gather Rune',
      icon: Compass,
      filename: 'crownspire_gather_rune',
      description: 'A premium, highly-detailed white-gold resource gathering rune with crossed tool shafts and a glowing purple amethyst cluster.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradGather" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FAD889" />
              <stop offset="70%" stopColor="#C9982E" />
              <stop offset="100%" stopColor="#6E4A00" />
            </linearGradient>
            <linearGradient id="purpleGradGather" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ECC8FF" />
              <stop offset="50%" stopColor="#9035FF" />
              <stop offset="100%" stopColor="#2E046B" />
            </linearGradient>
            <linearGradient id="basaltGradGather" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#25133A" />
              <stop offset="50%" stopColor="#120621" />
              <stop offset="100%" stopColor="#05010B" />
            </linearGradient>
            <filter id="glowGather" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="24" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="320" fill="#9C4EFF" opacity="0.12" filter="url(#glowGather)" />
          
          {/* Main Octagonal Runestone Tablet */}
          <polygon points="512,140 775,249 884,512 775,775 512,884 249,775 140,512 249,249" fill="url(#basaltGradGather)" stroke="url(#goldGradGather)" strokeWidth="8" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.7))" />
          
          {/* Inner Ring */}
          <polygon points="512,180 745,277 844,512 745,747 512,844 277,747 180,512 277,277" fill="none" stroke="#7E3AFF" strokeWidth="3" opacity="0.4" />
          <polygon points="512,200 725,289 824,512 725,735 512,824 289,735 200,512 289,289" fill="none" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="12, 10" opacity="0.6" />

          {/* White-Gold Ornate Edge Brackets */}
          <g transform="translate(512, 512)">
            <path d="M-230,-230 L-200,-250 L-140,-200 L-200,-140 Z" fill="url(#goldGradGather)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-190" cy="-190" r="12" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowGather)" />
            
            <path d="M230,-230 L200,-250 L140,-200 L200,-140 Z" fill="url(#goldGradGather)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="190" cy="-190" r="12" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowGather)" />

            <path d="M-230,230 L-200,250 L-140,200 L-200,140 Z" fill="url(#goldGradGather)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-190" cy="190" r="12" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowGather)" />

            <path d="M230,230 L200,250 L140,200 L200,140 Z" fill="url(#goldGradGather)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="190" cy="190" r="12" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowGather)" />
          </g>

          {/* Crossed Gathering Tools (Pickaxe and Sickle) */}
          <g transform="translate(512, 512) scale(1.15)">
            {/* Pickaxe Shaft (Diagonal Left-to-Right) */}
            <g transform="rotate(-30)">
              <rect x="-6" y="-100" width="12" height="200" rx="4" fill="#3D1C63" stroke="url(#goldGradGather)" strokeWidth="2" />
              {/* Pickaxe head */}
              <path d="M-60,-95 Q0,-120 60,-95 L50,-105 Q0,-135 -50,-105 Z" fill="url(#goldGradGather)" stroke="#3A2301" strokeWidth="2" />
            </g>
            
            {/* Sickle Shaft (Diagonal Right-to-Left) */}
            <g transform="rotate(30)">
              <rect x="-6" y="-80" width="12" height="160" rx="4" fill="#3D1C63" stroke="url(#goldGradGather)" strokeWidth="2" />
              {/* Sickle Curved blade */}
              <path d="M-6,-65 C-6,-115 -76,-115 -76,-75 C-76,-45 -46,-45 -46,-65" fill="none" stroke="url(#goldGradGather)" strokeWidth="10" strokeLinecap="round" />
            </g>
          </g>

          {/* Amethyst Mineral/Crystal Cluster at the intersection */}
          <g transform="translate(512, 530)" filter="url(#glowGather)">
            <polygon points="-25,10 0,-40 25,10 Z" fill="url(#purpleGradGather)" stroke="#FFF" strokeWidth="1.5" />
            <polygon points="-10,25 15,-15 35,25 Z" fill="url(#purpleGradGather)" stroke="#FFF" strokeWidth="1.5" />
            <polygon points="-35,30 -15,-5 5,30 Z" fill="url(#purpleGradGather)" stroke="#FFF" strokeWidth="1.5" />
          </g>
          
          {/* Wheat sheaves wrapping */}
          <g transform="translate(512, 512) scale(1.1)">
            <path d="M-90,60 Q-110,-20 -70,-50" fill="none" stroke="url(#goldGradGather)" strokeWidth="3" strokeLinecap="round" strokeDasharray="6, 6" />
            <path d="M90,60 Q110,-20 70,-50" fill="none" stroke="url(#goldGradGather)" strokeWidth="3" strokeLinecap="round" strokeDasharray="6, 6" />
          </g>
        </svg>
      )
    },
    {
      id: 'research_rune',
      name: 'Arcane Research Rune',
      icon: BookOpen,
      filename: 'crownspire_research_rune',
      description: 'A premium, highly-detailed white-gold grimoire/spellbook rune enclosed in rotating violet orbital atomic rings.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradResRune" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FAD889" />
              <stop offset="70%" stopColor="#C9982E" />
              <stop offset="100%" stopColor="#6E4A00" />
            </linearGradient>
            <linearGradient id="purpleGradResRune" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFCCFF" />
              <stop offset="50%" stopColor="#8A46FF" />
              <stop offset="100%" stopColor="#1C0447" />
            </linearGradient>
            <linearGradient id="basaltGradResRune" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#25133A" />
              <stop offset="50%" stopColor="#120621" />
              <stop offset="100%" stopColor="#05010B" />
            </linearGradient>
            <filter id="glowResRune" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="24" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="320" fill="#9C4EFF" opacity="0.12" filter="url(#glowResRune)" />
          
          {/* Main Octagonal Runestone Tablet */}
          <polygon points="512,140 775,249 884,512 775,775 512,884 249,775 140,512 249,249" fill="url(#basaltGradResRune)" stroke="url(#goldGradResRune)" strokeWidth="8" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.7))" />
          
          {/* Inner Ring */}
          <polygon points="512,180 745,277 844,512 745,747 512,844 277,747 180,512 277,277" fill="none" stroke="#7E3AFF" strokeWidth="3" opacity="0.4" />
          <polygon points="512,200 725,289 824,512 725,735 512,824 289,735 200,512 289,289" fill="none" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="12, 10" opacity="0.6" />

          {/* White-Gold Ornate Edge Brackets */}
          <g transform="translate(512, 512)">
            <path d="M-230,-230 L-200,-250 L-140,-200 L-200,-140 Z" fill="url(#goldGradResRune)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-190" cy="-190" r="12" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowResRune)" />
            
            <path d="M230,-230 L200,-250 L140,-200 L200,-140 Z" fill="url(#goldGradResRune)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="190" cy="-190" r="12" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowResRune)" />

            <path d="M-230,230 L-200,250 L-140,200 L-200,140 Z" fill="url(#goldGradResRune)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-190" cy="190" r="12" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowResRune)" />

            <path d="M230,230 L200,250 L140,200 L200,140 Z" fill="url(#goldGradResRune)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="190" cy="190" r="12" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowResRune)" />
          </g>

          {/* Magic Spellbook/Grimoire (Open Pages) */}
          <g transform="translate(512, 512) scale(1.15)">
            {/* Book cover outline */}
            <path d="M-110,65 L110,65 L120,-45 L-120,-45 Z" fill="#220B3D" stroke="url(#goldGradResRune)" strokeWidth="4.5" />
            
            {/* Left Page */}
            <path d="M-105,50 C-70,30 -40,40 -5,50 L-5,-50 C-40,-55 -70,-50 -105,-40 Z" fill="#FFFEEB" stroke="#3A2301" strokeWidth="2" />
            
            {/* Right Page */}
            <path d="M105,50 C70,30 40,40 5,50 L5,-50 C40,-55 70,-50 105,-40 Z" fill="#FFFEEB" stroke="#3A2301" strokeWidth="2" />

            {/* Glowing magic glyphs on pages */}
            <path d="M-80,-20 L-30,-20 M-80,0 L-40,0 M-80,20 L-50,20" stroke="#8E3CFF" strokeWidth="2.5" opacity="0.65" />
            <path d="M80,-20 L30,-20 M80,0 L40,0 M80,20 L50,20" stroke="#8E3CFF" strokeWidth="2.5" opacity="0.65" />
          </g>

          {/* Floating Orb / Solar Rings Overlay */}
          <g transform="translate(512, 480)">
            <ellipse cx="0" cy="0" rx="140" ry="40" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="10, 10" transform="rotate(-15)" filter="url(#glowResRune)" />
            <ellipse cx="0" cy="0" rx="140" ry="40" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="10, 10" transform="rotate(15)" filter="url(#glowResRune)" />
            <circle cx="0" cy="0" r="35" fill="url(#purpleGradResRune)" stroke="#FFFFFF" strokeWidth="2.5" filter="url(#glowResRune)" />
            <circle cx="0" cy="0" r="15" fill="#FFFFFF" />
          </g>
        </svg>
      )
    },
    {
      id: 'construction_rune',
      name: 'Arcane Construction Rune',
      icon: Hammer,
      filename: 'crownspire_construction_rune',
      description: 'A premium, highly-detailed white-gold citadel spire rune with crossed mason hammers and intense glowing purple light shafts.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradConstRune" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FAD889" />
              <stop offset="70%" stopColor="#C9982E" />
              <stop offset="100%" stopColor="#6E4A00" />
            </linearGradient>
            <linearGradient id="purpleGradConstRune" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE5FF" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#30016B" />
            </linearGradient>
            <linearGradient id="basaltGradConstRune" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#25133A" />
              <stop offset="50%" stopColor="#120621" />
              <stop offset="100%" stopColor="#05010B" />
            </linearGradient>
            <filter id="glowConstRune" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="24" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="320" fill="#9C4EFF" opacity="0.12" filter="url(#glowConstRune)" />
          
          {/* Main Octagonal Runestone Tablet */}
          <polygon points="512,140 775,249 884,512 775,775 512,884 249,775 140,512 249,249" fill="url(#basaltGradConstRune)" stroke="url(#goldGradConstRune)" strokeWidth="8" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.7))" />
          
          {/* Inner Ring */}
          <polygon points="512,180 745,277 844,512 745,747 512,844 277,747 180,512 277,277" fill="none" stroke="#7E3AFF" strokeWidth="3" opacity="0.4" />
          <polygon points="512,200 725,289 824,512 725,735 512,824 289,735 200,512 289,289" fill="none" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="12, 10" opacity="0.6" />

          {/* White-Gold Ornate Edge Brackets */}
          <g transform="translate(512, 512)">
            <path d="M-230,-230 L-200,-250 L-140,-200 L-200,-140 Z" fill="url(#goldGradConstRune)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-190" cy="-190" r="12" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowConstRune)" />
            
            <path d="M230,-230 L200,-250 L140,-200 L200,-140 Z" fill="url(#goldGradConstRune)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="190" cy="-190" r="12" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowConstRune)" />

            <path d="M-230,230 L-200,250 L-140,200 L-200,140 Z" fill="url(#goldGradConstRune)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-190" cy="190" r="12" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowConstRune)" />

            <path d="M230,230 L200,250 L140,200 L200,140 Z" fill="url(#goldGradConstRune)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="190" cy="190" r="12" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowConstRune)" />
          </g>

          {/* Crossed Heavy Masonry Hammers behind Spire */}
          <g transform="translate(512, 512) scale(1.15)">
            <g transform="rotate(-40)">
              <rect x="-6" y="-80" width="12" height="160" rx="4" fill="#250C47" stroke="url(#goldGradConstRune)" strokeWidth="1.5" />
              <rect x="-24" y="-85" width="48" height="30" rx="4" fill="url(#goldGradConstRune)" stroke="#3A2301" strokeWidth="2" />
            </g>
            <g transform="rotate(40)">
              <rect x="-6" y="-80" width="12" height="160" rx="4" fill="#250C47" stroke="url(#goldGradConstRune)" strokeWidth="1.5" />
              <rect x="-24" y="-85" width="48" height="30" rx="4" fill="url(#goldGradConstRune)" stroke="#3A2301" strokeWidth="2" />
            </g>
          </g>

          {/* Citadel / Wizard Spire Keep Tower */}
          <g transform="translate(512, 512) scale(1.1)">
            {/* Spire Base Tower */}
            <path d="M-50,110 L50,110 L40,0 L-40,0 Z" fill="#250C47" stroke="url(#goldGradConstRune)" strokeWidth="4.5" />
            
            {/* Mid Crenellations */}
            <rect x="-46" y="-15" width="92" height="15" rx="2" fill="url(#goldGradConstRune)" stroke="#3A2301" strokeWidth="2" />
            
            {/* High Cone Spire */}
            <path d="M-30,-15 L0,-120 L30,-15 Z" fill="url(#goldGradConstRune)" stroke="#3A2301" strokeWidth="3" />
            
            {/* Glowing purple arched window */}
            <path d="M-15,40 C-15,10 15,10 15,40 L15,80 L-15,80 Z" fill="url(#purpleGradConstRune)" filter="url(#glowConstRune)" />
          </g>

          {/* Sky-ward shooting energy laser from spire */}
          <polygon points="502,150 522,150 514,360 510,360" fill="#FFFFFF" filter="url(#glowConstRune)" />
          <line x1="512" y1="120" x2="512" y2="390" stroke="url(#purpleGradConstRune)" strokeWidth="10" strokeLinecap="round" opacity="0.6" filter="url(#glowConstRune)" />
        </svg>
      )
    },
    {
      id: 'training_rune',
      name: 'Arcane Training Rune',
      icon: Zap,
      filename: 'crownspire_training_rune',
      description: 'A premium, highly-detailed white-gold combat gauntlet rune clutching a glowing purple lightning bolt, representing fast military training.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradTrainRune" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FAD889" />
              <stop offset="70%" stopColor="#C9982E" />
              <stop offset="100%" stopColor="#6E4A00" />
            </linearGradient>
            <linearGradient id="purpleGradTrainRune" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FCD34D" stopOpacity="0" />
              <stop offset="50%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#4C1D95" />
            </linearGradient>
            <linearGradient id="lightningGradRune" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#ECC8FF" />
              <stop offset="100%" stopColor="#8E3CFF" />
            </linearGradient>
            <linearGradient id="basaltGradTrainRune" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#25133A" />
              <stop offset="50%" stopColor="#120621" />
              <stop offset="100%" stopColor="#05010B" />
            </linearGradient>
            <filter id="glowTrainRune" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="24" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="320" fill="#9C4EFF" opacity="0.12" filter="url(#glowTrainRune)" />
          
          {/* Main Octagonal Runestone Tablet */}
          <polygon points="512,140 775,249 884,512 775,775 512,884 249,775 140,512 249,249" fill="url(#basaltGradTrainRune)" stroke="url(#goldGradTrainRune)" strokeWidth="8" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.7))" />
          
          {/* Inner Ring */}
          <polygon points="512,180 745,277 844,512 745,747 512,844 277,747 180,512 277,277" fill="none" stroke="#7E3AFF" strokeWidth="3" opacity="0.4" />
          <polygon points="512,200 725,289 824,512 725,735 512,824 289,735 200,512 289,289" fill="none" stroke="#A855F7" strokeWidth="1.5" strokeDasharray="12, 10" opacity="0.6" />

          {/* White-Gold Ornate Edge Brackets */}
          <g transform="translate(512, 512)">
            <path d="M-230,-230 L-200,-250 L-140,-200 L-200,-140 Z" fill="url(#goldGradTrainRune)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-190" cy="-190" r="12" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowTrainRune)" />
            
            <path d="M230,-230 L200,-250 L140,-200 L200,-140 Z" fill="url(#goldGradTrainRune)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="190" cy="-190" r="12" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowTrainRune)" />

            <path d="M-230,230 L-200,250 L-140,200 L-200,140 Z" fill="url(#goldGradTrainRune)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-190" cy="190" r="12" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowTrainRune)" />

            <path d="M230,230 L200,250 L140,200 L200,140 Z" fill="url(#goldGradTrainRune)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="190" cy="190" r="12" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowTrainRune)" />
          </g>

          {/* Golden Wings flanking the core */}
          <g transform="translate(512, 512) scale(1.1)">
            <path d="M-110,30 C-140,-30 -80,-80 -40,-60 C-50,-30 -80,10 -110,30 Z" fill="url(#goldGradTrainRune)" stroke="#3A2301" strokeWidth="2" opacity="0.85" />
            <path d="M110,30 C140,-30 80,-80 40,-60 C50,-30 80,10 110,30 Z" fill="url(#goldGradTrainRune)" stroke="#3A2301" strokeWidth="2" opacity="0.85" />
          </g>

          {/* Glowing Purple Lightning Bolt */}
          <polygon points="512,280 572,440 502,440 542,680 442,480 522,480" fill="url(#lightningGradRune)" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowTrainRune)" />

          {/* Armored Fist / Gauntlet clutching the lightning bolt */}
          <g transform="translate(512, 540) scale(1.15)">
            {/* Gauntlet forearm */}
            <path d="M-25,50 L25,50 L35,10 L-35,10 Z" fill="url(#goldGradTrainRune)" stroke="#3A2301" strokeWidth="3" />
            {/* Guard knuckles */}
            <path d="M-30,10 L30,10 L25,-15 L-25,-15 Z" fill="url(#goldGradTrainRune)" stroke="#3A2301" strokeWidth="3" />
            {/* Purple wrist core */}
            <circle cx="0" cy="30" r="8" fill="#FFFFFF" filter="url(#glowTrainRune)" />
          </g>
        </svg>
      )
    },
    {
      id: 'attack_crystal',
      name: 'Vanguard Soul Crystal',
      icon: Sword,
      filename: 'crownspire_attack_crystal',
      description: 'A premium, ultra-polished 3D assault crystal. Features a towering white-gold-rimmed basalt crucible holding a jagged, multi-faceted crimson-purple crystal shard that crackles with raw battle energy.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradAttackCryst" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FDE047" />
              <stop offset="70%" stopColor="#CA8A04" />
              <stop offset="100%" stopColor="#713F12" />
            </linearGradient>
            <linearGradient id="purpleGradAttackCryst" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5D0FF" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#3B0764" />
            </linearGradient>
            <linearGradient id="basaltGradAttackCryst" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B0764" />
              <stop offset="50%" stopColor="#120224" />
              <stop offset="100%" stopColor="#030008" />
            </linearGradient>
            <filter id="glowAttackCryst" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="32" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#A855F7" opacity="0.15" filter="url(#glowAttackCryst)" />
          
          {/* Base Pedestal Crucible */}
          <g transform="translate(512, 700)" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.65))">
            <path d="M-140,20 L140,20 L110,90 L-110,90 Z" fill="url(#basaltGradAttackCryst)" stroke="url(#goldGradAttackCryst)" strokeWidth="6.5" />
            <path d="M-120,-30 L120,-30 L140,20 L-140,20 Z" fill="url(#basaltGradAttackCryst)" stroke="url(#goldGradAttackCryst)" strokeWidth="6.5" />
            <path d="M-80,-60 L80,-60 L120,-30 L-120,-30 Z" fill="none" stroke="url(#goldGradAttackCryst)" strokeWidth="4" />
            
            {/* Claws grasping the crystal */}
            <path d="M-120,-30 Q-150,-120 -80,-140 Q-90,-80 -90,-30" fill="url(#goldGradAttackCryst)" stroke="#451a03" strokeWidth="2" />
            <path d="M120,-30 Q150,-120 80,-140 Q90,-80 90,-30" fill="url(#goldGradAttackCryst)" stroke="#451a03" strokeWidth="2" />
          </g>

          {/* Majestic Jagged Crystal Body */}
          <g transform="translate(512, 420) scale(1.15)" filter="drop-shadow(0 10px 20px rgba(110,22,235,0.4))">
            {/* Main Crystal Core */}
            <polygon points="0,-210 80,-40 50,160 -50,160 -80,-40" fill="url(#purpleGradAttackCryst)" stroke="#FFF" strokeWidth="2.5" />
            {/* Facet Cuts */}
            <polygon points="0,-210 0,160 50,160 80,-40" fill="#FFFFFF" opacity="0.22" />
            <polygon points="0,-210 0,160 -50,160 -80,-40" fill="#1e1b4b" opacity="0.3" />
            
            {/* Auxiliary side crystals */}
            <polygon points="-80,-40 -120,-10 -90,80 -50,110" fill="url(#purpleGradAttackCryst)" opacity="0.8" stroke="url(#goldGradAttackCryst)" strokeWidth="1.5" />
            <polygon points="80,-40 120,-10 90,80 50,110" fill="url(#purpleGradAttackCryst)" opacity="0.8" stroke="url(#goldGradAttackCryst)" strokeWidth="1.5" />
          </g>

          {/* Runic glowing core band */}
          <g transform="translate(512, 450)" filter="url(#glowAttackCryst)">
            <ellipse cx="0" cy="0" rx="150" ry="30" fill="none" stroke="#FFFFFF" strokeWidth="5" strokeDasharray="15, 20" opacity="0.8" transform="rotate(-15)" />
            <ellipse cx="0" cy="0" rx="150" ry="30" fill="none" stroke="#F472B6" strokeWidth="3" transform="rotate(-15)" />
          </g>
          
          {/* Sparkles */}
          <circle cx="512" cy="300" r="16" fill="#FFFFFF" filter="url(#glowAttackCryst)" />
          <path d="M512,270 L516,296 L542,300 L516,304 L512,330 L508,304 L482,300 L508,296 Z" fill="#FFFFFF" />
        </svg>
      )
    },
    {
      id: 'defense_crystal',
      name: 'Bastion Soul Crystal',
      icon: Shield,
      filename: 'crownspire_defense_crystal',
      description: 'A premium, ultra-polished 3D protection crystal. Centered around a massive, heavy diamond-cut crystal barrier nestled within an impenetrable white-gold fortress tower brace.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradDefCryst" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FDE047" />
              <stop offset="70%" stopColor="#CA8A04" />
              <stop offset="100%" stopColor="#713F12" />
            </linearGradient>
            <linearGradient id="purpleGradDefCryst" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E879F9" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#581C87" />
            </linearGradient>
            <linearGradient id="basaltGradDefCryst" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
            <filter id="glowDefCryst" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="32" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#D8B4FE" opacity="0.1" filter="url(#glowDefCryst)" />
          
          {/* Heavy Base Fortress Wall */}
          <g transform="translate(512, 720)" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.7))">
            <path d="M-180,0 L180,0 L140,80 L-140,80 Z" fill="url(#basaltGradDefCryst)" stroke="url(#goldGradDefCryst)" strokeWidth="7" />
            {/* Bastions */}
            <path d="M-190,-40 L-140,-40 L-140,0 L-190,0 Z" fill="url(#goldGradDefCryst)" stroke="#451a03" strokeWidth="2.5" />
            <path d="M140,-40 L190,-40 L190,0 L140,0 Z" fill="url(#goldGradDefCryst)" stroke="#451a03" strokeWidth="2.5" />
            <path d="M-40,-30 L40,-30 L30,0 L-30,0 Z" fill="url(#goldGradDefCryst)" stroke="#451a03" strokeWidth="2.5" />
          </g>

          {/* Massive Barrier Crystal Block */}
          <g transform="translate(512, 430) scale(1.1)" filter="drop-shadow(0 10px 20px rgba(110,22,235,0.3))">
            {/* Faceted Shield Crystal Shape */}
            <polygon points="0,-180 120,-80 100,120 0,190 -100,120 -120,-80" fill="url(#purpleGradDefCryst)" stroke="#FFF" strokeWidth="3" />
            {/* Highlights and 3D cutlines */}
            <polygon points="0,-180 0,190 100,120 120,-80" fill="#FFFFFF" opacity="0.25" />
            <polygon points="0,-180 -120,-80 -100,120 0,190" fill="#3B0764" opacity="0.35" />
            
            {/* Embedded glowing protective rune */}
            <path d="M-40,-20 L40,-20 M0,-50 L0,100" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" filter="url(#glowDefCryst)" />
            <circle cx="0" cy="-20" r="14" fill="#FFFFFF" filter="url(#glowDefCryst)" />
            <circle cx="0" cy="-20" r="7" fill="#A855F7" />
          </g>

          {/* Protective Violet Dome Ring */}
          <circle cx="512" cy="460" r="230" fill="none" stroke="#F472B6" strokeWidth="2" strokeDasharray="10, 15" opacity="0.5" filter="url(#glowDefCryst)" />
        </svg>
      )
    },
    {
      id: 'health_crystal',
      name: 'Vitality Soul Crystal',
      icon: Heart,
      filename: 'crownspire_health_crystal',
      description: 'A premium, ultra-polished 3D lifeforce crystal. Features a pulsing, heart-shaped crystal core resting in a delicate white-gold scrollwork cage, emitting warm purple aura rings.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradHealthCryst" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FDE047" />
              <stop offset="70%" stopColor="#CA8A04" />
              <stop offset="100%" stopColor="#713F12" />
            </linearGradient>
            <linearGradient id="purpleGradHealthCryst" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFD3FF" />
              <stop offset="50%" stopColor="#EC4899" />
              <stop offset="100%" stopColor="#701A75" />
            </linearGradient>
            <linearGradient id="basaltGradHealthCryst" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4A044E" />
              <stop offset="100%" stopColor="#120015" />
            </linearGradient>
            <filter id="glowHealthCryst" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="32" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#EC4899" opacity="0.12" filter="url(#glowHealthCryst)" />
          
          {/* Base Ornate Swirl Pedestal */}
          <g transform="translate(512, 710)" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.6))">
            <path d="M-110,10 L110,10 L80,70 L-80,70 Z" fill="url(#basaltGradHealthCryst)" stroke="url(#goldGradHealthCryst)" strokeWidth="6" />
            
            {/* Healing vines sweeping up */}
            <path d="M-80,10 Q-150,-80 -90,-160 Q-70,-110 -60,10" fill="url(#goldGradHealthCryst)" stroke="#451a03" strokeWidth="2.5" />
            <path d="M80,10 Q150,-80 90,-160 Q70,-110 60,10" fill="url(#goldGradHealthCryst)" stroke="#451a03" strokeWidth="2.5" />
            <circle cx="-110" cy="-100" r="10" fill="#EC4899" filter="url(#glowHealthCryst)" />
            <circle cx="110" cy="-100" r="10" fill="#EC4899" filter="url(#glowHealthCryst)" />
          </g>

          {/* Heart Crystal Body */}
          <g transform="translate(512, 440) scale(1.15)" filter="drop-shadow(0 10px 20px rgba(236,72,153,0.35))">
            <path d="M0,135 C-90,60 -130,-50 -65,-110 C-25,-140 0,-70 0,-70 C0,-70 25,-140 65,-110 C130,-50 90,60 0,135 Z" fill="url(#purpleGradHealthCryst)" stroke="#FFFFFF" strokeWidth="3" />
            {/* Highlights */}
            <path d="M0,135 L0,-70 C0,-70 25,-140 65,-110 C130,-50 90,60 0,135 Z" fill="#FFFFFF" opacity="0.25" />
            <path d="M0,135 L0,-70 C0,-70 -25,-140 -65,-110 C-130,-50 -90,60 0,135 Z" fill="#4D0754" opacity="0.3" />
          </g>

          {/* Ambient Sparkles */}
          <circle cx="512" cy="380" r="12" fill="#FFFFFF" filter="url(#glowHealthCryst)" />
          <circle cx="410" cy="460" r="7" fill="#F87171" filter="url(#glowHealthCryst)" />
          <circle cx="614" cy="460" r="7" fill="#F87171" filter="url(#glowHealthCryst)" />
        </svg>
      )
    },
    {
      id: 'leadership_crystal',
      name: 'Sovereign Soul Crystal',
      icon: Crown,
      filename: 'crownspire_leadership_crystal',
      description: 'A premium, ultra-polished 3D commander crystal. A crown-like crystalline cluster with five major spires, mounted on an imperial white-gold chassis adorned with royal violet jewels.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradLeadCryst" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FDE047" />
              <stop offset="70%" stopColor="#CA8A04" />
              <stop offset="100%" stopColor="#713F12" />
            </linearGradient>
            <linearGradient id="purpleGradLeadCryst" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE5FF" />
              <stop offset="50%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#581C87" />
            </linearGradient>
            <linearGradient id="basaltGradLeadCryst" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2e1065" />
              <stop offset="100%" stopColor="#0a001a" />
            </linearGradient>
            <filter id="glowLeadCryst" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="32" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#C084FC" opacity="0.12" filter="url(#glowLeadCryst)" />
          
          {/* Imperial Crown Base */}
          <g transform="translate(512, 690)" filter="drop-shadow(0 15px 25px rgba(0,0,0,0.65))">
            <path d="M-150,15 L150,15 L130,75 L-130,75 Z" fill="url(#basaltGradLeadCryst)" stroke="url(#goldGradLeadCryst)" strokeWidth="6.5" />
            <rect x="-110" y="30" width="220" height="15" rx="5" fill="url(#goldGradLeadCryst)" stroke="#451a03" strokeWidth="1.5" />
            
            {/* Inlaid Gems */}
            <circle cx="-60" cy="37" r="6" fill="#A855F7" />
            <circle cx="0" cy="37" r="8" fill="#F472B6" filter="url(#glowLeadCryst)" />
            <circle cx="60" cy="37" r="6" fill="#A855F7" />
            
            {/* Left and Right Sceptre Columns */}
            <path d="M-140,15 L-130,-40 L-110,15 Z" fill="url(#goldGradLeadCryst)" stroke="#451a03" strokeWidth="1.5" />
            <path d="M140,15 L130,-40 L110,15 Z" fill="url(#goldGradLeadCryst)" stroke="#451a03" strokeWidth="1.5" />
          </g>

          {/* 5-Peak Crystalline Cluster */}
          <g transform="translate(512, 430) scale(1.1)" filter="drop-shadow(0 10px 20px rgba(168,85,247,0.4))">
            {/* Center Peak */}
            <polygon points="0,-190 40,-40 25,120 -25,120 -40,-40" fill="url(#purpleGradLeadCryst)" stroke="#FFFFFF" strokeWidth="2.5" />
            <polygon points="0,-190 0,120 25,120 40,-40" fill="#FFFFFF" opacity="0.25" />
            
            {/* Mid Left Peak */}
            <polygon points="-55,-130 -20,-10 -35,120 -70,120 -80,-10" fill="url(#purpleGradLeadCryst)" opacity="0.9" stroke="url(#goldGradLeadCryst)" strokeWidth="1.5" transform="rotate(-15 -55 40)" />
            {/* Mid Right Peak */}
            <polygon points="55,-130 20,-10 35,120 70,120 80,-10" fill="url(#purpleGradLeadCryst)" opacity="0.9" stroke="url(#goldGradLeadCryst)" strokeWidth="1.5" transform="rotate(15 55 40)" />

            {/* Far Left Spire */}
            <polygon points="-105,-70 -80,20 -90,120 -115,120 -125,20" fill="url(#purpleGradLeadCryst)" opacity="0.75" stroke="url(#goldGradLeadCryst)" strokeWidth="1" transform="rotate(-30 -105 40)" />
            {/* Far Right Spire */}
            <polygon points="105,-70 80,20 90,120 115,120 125,20" fill="url(#purpleGradLeadCryst)" opacity="0.75" stroke="url(#goldGradLeadCryst)" strokeWidth="1" transform="rotate(30 105 40)" />
          </g>

          {/* Sparkles on Spire points */}
          <circle cx="512" cy="220" r="10" fill="#FFFFFF" filter="url(#glowLeadCryst)" />
          <circle cx="420" cy="290" r="6" fill="#FDF4FF" filter="url(#glowLeadCryst)" />
          <circle cx="604" cy="290" r="6" fill="#FDF4FF" filter="url(#glowLeadCryst)" />
        </svg>
      )
    },
    {
      id: 'universal_crystal',
      name: 'Astral Soul Crystal',
      icon: Sparkles,
      filename: 'crownspire_universal_crystal',
      description: 'A premium, ultra-polished 3D cosmic crystal. A floating star-dodecahedron crystal core rotating inside two concentric white-gold cosmic rings, pulsing with pure, multi-layered violet magic.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradUnivCryst" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FDE047" />
              <stop offset="70%" stopColor="#CA8A04" />
              <stop offset="100%" stopColor="#713F12" />
            </linearGradient>
            <linearGradient id="purpleGradUnivCryst" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#E879F9" />
              <stop offset="70%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#1E1B4B" />
            </linearGradient>
            <filter id="glowUnivCryst" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="32" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="320" fill="#C084FC" opacity="0.15" filter="url(#glowUnivCryst)" />
          
          {/* Concentric White-Gold Orbit Rings */}
          <g transform="translate(512, 512)">
            <ellipse cx="0" cy="0" rx="310" ry="120" fill="none" stroke="url(#goldGradUnivCryst)" strokeWidth="10" transform="rotate(-25)" />
            <ellipse cx="0" cy="0" rx="270" ry="80" fill="none" stroke="url(#goldGradUnivCryst)" strokeWidth="4" strokeDasharray="15, 15" transform="rotate(25)" />
            
            {/* Glowing orbital nodes */}
            <circle cx="210" cy="-90" r="16" fill="#F472B6" stroke="#FFF" strokeWidth="2.5" filter="url(#glowUnivCryst)" />
            <circle cx="-210" cy="90" r="16" fill="#A855F7" stroke="#FFF" strokeWidth="2.5" filter="url(#glowUnivCryst)" />
          </g>

          {/* Floating Star-Dodecahedron Core */}
          <g transform="translate(512, 512) scale(1.2)" filter="drop-shadow(0 0 30px rgba(168,85,247,0.6))">
            {/* Star geometry composed of polished facets */}
            {/* Center block */}
            <polygon points="0,-100 30,-30 100,-30 45,15 70,80 0,40 -70,80 -45,15 -100,-30 -30,-30" fill="url(#purpleGradUnivCryst)" stroke="#FFFFFF" strokeWidth="3" />
            <polygon points="0,-100 0,40 70,80 45,15 100,-30 30,-30" fill="#FFFFFF" opacity="0.25" />
            <polygon points="0,-100 -30,-30 -100,-30 -45,15 -70,80 0,40" fill="#2E1065" opacity="0.35" />
            
            {/* Inner jewel facets */}
            <polygon points="0,-50 15,-10 45,-10 20,10 30,40 0,20 -30,40 -20,10 -45,-10 -15,-10" fill="#FFFFFF" opacity="0.3" />
          </g>

          {/* Outer floating power runic nodes */}
          <g transform="translate(512, 512)">
            <circle cx="0" cy="-280" r="12" fill="#FFFFFF" filter="url(#glowUnivCryst)" />
            <circle cx="0" cy="280" r="12" fill="#FFFFFF" filter="url(#glowUnivCryst)" />
          </g>
        </svg>
      )
    },
    {
      id: 'moon_totem',
      name: 'Totem of the Lunar Veil',
      icon: Moon,
      filename: 'crownspire_moon_totem',
      description: 'An ancient, highly polished 3D obsidian monolith. Features flowing white-gold lunar filigree clutching a glowing violet crescent moon core, perfect for passive hero progression.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradMoonTot" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FDE047" />
              <stop offset="70%" stopColor="#CA8A04" />
              <stop offset="100%" stopColor="#713F12" />
            </linearGradient>
            <linearGradient id="purpleGradMoonTot" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E9D5FF" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#4A044E" />
            </linearGradient>
            <linearGradient id="basaltGradMoonTot" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E1B4B" />
              <stop offset="50%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#020617" />
            </linearGradient>
            <filter id="glowMoonTot" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="32" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#C084FC" opacity="0.1" filter="url(#glowMoonTot)" />
          
          {/* Monolith base pedestal */}
          <g transform="translate(512, 730)" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.8))">
            <polygon points="-160,0 160,0 120,70 -120,70" fill="url(#basaltGradMoonTot)" stroke="url(#goldGradMoonTot)" strokeWidth="6.5" />
            <polygon points="-120,-30 120,-30 140,0 -140,0" fill="url(#basaltGradMoonTot)" stroke="url(#goldGradMoonTot)" strokeWidth="4.5" />
          </g>

          {/* Heavy Stone Monolith Body */}
          <g transform="translate(512, 420)" filter="drop-shadow(0 10px 20px rgba(0,0,0,0.5))">
            {/* Tapered pillar shape */}
            <polygon points="-70,-220 70,-220 100,280 -100,280" fill="url(#basaltGradMoonTot)" stroke="url(#goldGradMoonTot)" strokeWidth="6" />
            
            {/* Center dividing engraving */}
            <line x1="0" y1="-210" x2="0" y2="270" stroke="url(#goldGradMoonTot)" strokeWidth="3.5" opacity="0.3" />
            
            {/* Side Gold Relief Panels */}
            <polygon points="-58,-200 -45,-200 -65,260 -85,260" fill="url(#goldGradMoonTot)" opacity="0.8" />
            <polygon points="58,-200 45,-200 65,260 85,260" fill="url(#goldGradMoonTot)" opacity="0.8" />
          </g>

          {/* Glowing Violet Crescent Moon Embedded Core */}
          <g transform="translate(512, 400) scale(1.15)" filter="url(#glowMoonTot)">
            <path d="M-40,-50 C25,-50 60,-15 50,40 C45,65 20,80 -10,80 C-45,80 -70,50 -60,10 C-55,25 -30,40 0,35 C30,30 35,0 10,-25 C0,-35 -20,-40 -40,-50 Z" fill="url(#purpleGradMoonTot)" stroke="#FFFFFF" strokeWidth="2.5" />
            
            {/* Star indicators */}
            <circle cx="20" cy="-35" r="5" fill="#FFFFFF" filter="url(#glowMoonTot)" />
            <circle cx="-35" cy="55" r="4" fill="#FFFFFF" filter="url(#glowMoonTot)" />
          </g>

          {/* Celestial lunar orbiting lines */}
          <ellipse cx="512" cy="400" rx="160" ry="50" fill="none" stroke="#D8B4FE" strokeWidth="2" strokeDasharray="8, 12" transform="rotate(-15 512 400)" />
        </svg>
      )
    },
    {
      id: 'sun_totem',
      name: 'Totem of the Solar Flare',
      icon: Sun,
      filename: 'crownspire_sun_totem',
      description: 'An ancient, highly polished 3D solar monolith. Centered around a blazing white-gold sunburst wheel with a deep purple core that projects intense heatwaves.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradSunTot" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FDE047" />
              <stop offset="70%" stopColor="#CA8A04" />
              <stop offset="100%" stopColor="#713F12" />
            </linearGradient>
            <linearGradient id="purpleGradSunTot" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE4E6" />
              <stop offset="50%" stopColor="#E11D48" />
              <stop offset="100%" stopColor="#4C0519" />
            </linearGradient>
            <linearGradient id="basaltGradSunTot" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#450a0a" />
              <stop offset="100%" stopColor="#020000" />
            </linearGradient>
            <filter id="glowSunTot" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="32" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#FDA4AF" opacity="0.12" filter="url(#glowSunTot)" />
          
          {/* Monolith base pedestal */}
          <g transform="translate(512, 730)" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.8))">
            <polygon points="-160,0 160,0 120,70 -120,70" fill="url(#basaltGradSunTot)" stroke="url(#goldGradSunTot)" strokeWidth="6.5" />
            <polygon points="-120,-30 120,-30 140,0 -140,0" fill="url(#basaltGradSunTot)" stroke="url(#goldGradSunTot)" strokeWidth="4.5" />
          </g>

          {/* Heavy Monolith Pillar */}
          <g transform="translate(512, 420)">
            <polygon points="-65,-210 65,-210 95,280 -95,280" fill="url(#basaltGradSunTot)" stroke="url(#goldGradSunTot)" strokeWidth="6" />
          </g>

          {/* Blazing White-Gold Sunburst Core */}
          <g transform="translate(512, 380) scale(1.15)" filter="url(#glowSunTot)">
            {/* Outer flame rays */}
            <path d="M0,-80 L15,-30 L65,-65 L30,-15 L80,0 L25,15 L65,65 L15,30 L0,80 L-15,30 L-65,65 L-25,15 L-80,0 L-30,-15 L-65,-65 L-15,-30 Z" fill="url(#goldGradSunTot)" stroke="#713F12" strokeWidth="2" />
            
            {/* Inner burning crystal core */}
            <circle cx="0" cy="0" r="35" fill="url(#purpleGradSunTot)" stroke="#FFFFFF" strokeWidth="3" />
            {/* Facet star cut inside */}
            <polygon points="0,-25 7,-7 25,0 7,7 0,25 -7,7 -25,0 -7,-7" fill="#FFFFFF" opacity="0.6" />
          </g>
          
          {/* Flaring solar hoops */}
          <circle cx="512" cy="380" r="130" fill="none" stroke="url(#goldGradSunTot)" strokeWidth="1.5" opacity="0.4" />
        </svg>
      )
    },
    {
      id: 'storm_totem',
      name: 'Totem of the Tempest Apex',
      icon: Zap,
      filename: 'crownspire_storm_totem',
      description: 'An ancient, highly polished 3D lightning spire. A rugged, jagged stone column bound by heavy gold brace bands, with violent electric arcs leaping from a pulsing violet core.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradStormTot" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FDE047" />
              <stop offset="70%" stopColor="#CA8A04" />
              <stop offset="100%" stopColor="#713F12" />
            </linearGradient>
            <linearGradient id="purpleGradStormTot" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#C084FC" />
              <stop offset="100%" stopColor="#3B0764" />
            </linearGradient>
            <linearGradient id="basaltGradStormTot" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="100%" stopColor="#020208" />
            </linearGradient>
            <filter id="glowStormTot" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="32" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#A855F7" opacity="0.12" filter="url(#glowStormTot)" />
          
          {/* Monolith base pedestal */}
          <g transform="translate(512, 730)" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.8))">
            <polygon points="-160,0 160,0 120,70 -120,70" fill="url(#basaltGradStormTot)" stroke="url(#goldGradStormTot)" strokeWidth="6.5" />
            <polygon points="-120,-30 120,-30 140,0 -140,0" fill="url(#basaltGradStormTot)" stroke="url(#goldGradStormTot)" strokeWidth="4.5" />
          </g>

          {/* Jagged, Zig-zag Lightning Pillar */}
          <g transform="translate(512, 420)" filter="drop-shadow(0 10px 20px rgba(0,0,0,0.5))">
            {/* Jagged column contour */}
            <polygon points="-40,-230 40,-230 80,-120 40,-60 90,60 100,280 -100,280 -90,60 -40,-60 -80,-120" fill="url(#basaltGradStormTot)" stroke="url(#goldGradStormTot)" strokeWidth="6" />
            
            {/* Bracing Gold Bands */}
            <polygon points="-58,-130 58,-130 65,-100 -65,-100" fill="url(#goldGradStormTot)" stroke="#451a03" strokeWidth="2.5" />
            <polygon points="-75,100 75,100 82,130 -82,130" fill="url(#goldGradStormTot)" stroke="#451a03" strokeWidth="2.5" />
          </g>

          {/* Crackling Purple Lightning Bolt Core */}
          <g transform="translate(512, 380) scale(1.15)" filter="url(#glowStormTot)">
            <polygon points="-20,-110 30,-20 -20,-20 15,90 -45,-10 5,-10" fill="url(#purpleGradStormTot)" stroke="#FFFFFF" strokeWidth="3" />
          </g>

          {/* Electric Arcs jumping around column */}
          <g transform="translate(512, 420)" filter="url(#glowStormTot)">
            <path d="M-150,0 Q-100,-80 -120,-150" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
            <path d="M150,50 Q100,-30 120,-100" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
          </g>
        </svg>
      )
    },
    {
      id: 'earth_totem',
      name: 'Totem of the Tectonic Core',
      icon: Compass,
      filename: 'crownspire_earth_totem',
      description: 'An ancient, highly polished 3D earth monolith. Built of layered tectonic basalt blocks braced with heavy white-gold columns, holding massive, raw purple quartz geode clusters.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradEarthTot" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FDE047" />
              <stop offset="70%" stopColor="#CA8A04" />
              <stop offset="100%" stopColor="#713F12" />
            </linearGradient>
            <linearGradient id="purpleGradEarthTot" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E9D5FF" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#2E046B" />
            </linearGradient>
            <linearGradient id="basaltGradEarthTot" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e152a" />
              <stop offset="50%" stopColor="#0c0714" />
              <stop offset="100%" stopColor="#030107" />
            </linearGradient>
            <filter id="glowEarthTot" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="32" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#9035FF" opacity="0.1" filter="url(#glowEarthTot)" />
          
          {/* Heavy Monolith Tectonic Body */}
          <g transform="translate(512, 450) scale(1.15)" filter="drop-shadow(0 20px 35px rgba(0,0,0,0.8))">
            {/* Broad multi-layered basalt pillar */}
            <polygon points="-80,-150 80,-150 110,240 -110,240" fill="url(#basaltGradEarthTot)" stroke="url(#goldGradEarthTot)" strokeWidth="6" />
            
            {/* Horizontal geologic strata joints */}
            <line x1="-88" y1="-50" x2="88" y2="-50" stroke="url(#goldGradEarthTot)" strokeWidth="3" opacity="0.5" />
            <line x1="-96" y1="80" x2="96" y2="80" stroke="url(#goldGradEarthTot)" strokeWidth="3" opacity="0.5" />
            
            {/* Heavy white-gold support side pillars */}
            <path d="M-110,240 L-95,-100 L-75,-100 L-85,240 Z" fill="url(#goldGradEarthTot)" stroke="#3a2202" strokeWidth="2" />
            <path d="M110,240 L95,-100 L75,-100 L85,240 Z" fill="url(#goldGradEarthTot)" stroke="#3a2202" strokeWidth="2" />

            {/* Earth rune carved in basalt */}
            <polygon points="-30,30 30,30 0,-10" fill="none" stroke="#A855F7" strokeWidth="4.5" strokeLinejoin="round" opacity="0.8" filter="url(#glowEarthTot)" />
            <line x1="0" y1="-10" x2="0" y2="60" stroke="#A855F7" strokeWidth="4.5" filter="url(#glowEarthTot)" />
          </g>

          {/* Raw Purple Geode Crystals busting out of the sides */}
          <g transform="translate(512, 450) scale(1.15)" filter="url(#glowEarthTot)">
            <polygon points="-90,-30 -140,-50 -110,20 -85,-10" fill="url(#purpleGradEarthTot)" stroke="#FFFFFF" strokeWidth="1.5" />
            <polygon points="90,-30 140,-50 110,20 85,-10" fill="url(#purpleGradEarthTot)" stroke="#FFFFFF" strokeWidth="1.5" />
            <polygon points="-100,100 -150,110 -110,140 -80,120" fill="url(#purpleGradEarthTot)" stroke="#FFFFFF" strokeWidth="1.5" />
            <polygon points="100,100 150,110 110,140 80,120" fill="url(#purpleGradEarthTot)" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>
        </svg>
      )
    },
    {
      id: 'shadow_totem',
      name: 'Totem of the Abyssal Gaze',
      icon: Eye,
      filename: 'crownspire_shadow_totem',
      description: 'An ancient, highly polished 3D void monolith. Features a split stone obelisk floating on an ethereal purple nebula, bound by white-gold phantom wings.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradShadowTot" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FDE047" />
              <stop offset="70%" stopColor="#CA8A04" />
              <stop offset="100%" stopColor="#713F12" />
            </linearGradient>
            <linearGradient id="purpleGradShadowTot" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F472B6" />
              <stop offset="50%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#1E1B4B" />
            </linearGradient>
            <linearGradient id="basaltGradShadowTot" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f051c" />
              <stop offset="100%" stopColor="#010003" />
            </linearGradient>
            <filter id="glowShadowTot" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="32" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#7C3AED" opacity="0.12" filter="url(#glowShadowTot)" />
          
          {/* Base Pedestal */}
          <g transform="translate(512, 730)" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.85))">
            <polygon points="-160,0 160,0 120,70 -120,70" fill="url(#basaltGradShadowTot)" stroke="url(#goldGradShadowTot)" strokeWidth="6.5" />
          </g>

          {/* Split Obelisk Column */}
          <g transform="translate(512, 420)" filter="drop-shadow(0 10px 25px rgba(0,0,0,0.6))">
            {/* Left Column Half */}
            <polygon points="-70,-220 -15,-220 -20,280 -100,280" fill="url(#basaltGradShadowTot)" stroke="url(#goldGradShadowTot)" strokeWidth="5.5" />
            {/* Right Column Half */}
            <polygon points="15,-220 70,-220 100,280 20,280" fill="url(#basaltGradShadowTot)" stroke="url(#goldGradShadowTot)" strokeWidth="5.5" />
          </g>

          {/* Floating Astral Void Orb in Middle Gap */}
          <g transform="translate(512, 400)" filter="url(#glowShadowTot)">
            {/* Glowing Ethereal Eye or Sphere */}
            <circle cx="0" cy="0" r="45" fill="url(#purpleGradShadowTot)" stroke="#FFFFFF" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="15" fill="#FFFFFF" />
            
            {/* Sweeping wings cradling the central eye */}
            <path d="M-90,-10 C-110,-60 -50,-80 -30,-60 C-40,-30 -70,10 -90,-10 Z" fill="url(#goldGradShadowTot)" stroke="#3c1e02" strokeWidth="1.5" />
            <path d="M90,-10 C110,-60 50,-80 30,-60 C40,-30 70,10 90,-10 Z" fill="url(#goldGradShadowTot)" stroke="#3c1e02" strokeWidth="1.5" />
          </g>
          
          {/* Ethereal shadow fog ribbons wrapping around */}
          <path d="M380,450 Q450,490 512,470 Q580,450 640,510" fill="none" stroke="#C084FC" strokeWidth="2.5" opacity="0.4" strokeDasharray="5, 8" filter="url(#glowShadowTot)" />
        </svg>
      )
    },
    {
      id: 'crystal_totem',
      name: 'Totem of the Leyline Conduit',
      icon: Gem,
      filename: 'crownspire_crystal_totem',
      description: 'An ancient, highly polished 3D magic monolith. A majestic monument made of raw glowing amethyst pillars woven together by spiraling white-gold filigree chains.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradCrystTot" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FDE047" />
              <stop offset="70%" stopColor="#CA8A04" />
              <stop offset="100%" stopColor="#713F12" />
            </linearGradient>
            <linearGradient id="purpleGradCrystTot" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#D946EF" />
              <stop offset="100%" stopColor="#4A044E" />
            </linearGradient>
            <linearGradient id="basaltGradCrystTot" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2e0430" />
              <stop offset="100%" stopColor="#0a000b" />
            </linearGradient>
            <filter id="glowCrystTot" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="32" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#D946EF" opacity="0.12" filter="url(#glowCrystTot)" />
          
          {/* Base Pedestal */}
          <g transform="translate(512, 730)" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.8))">
            <polygon points="-160,0 160,0 120,70 -120,70" fill="url(#basaltGradCrystTot)" stroke="url(#goldGradCrystTot)" strokeWidth="6.5" />
          </g>

          {/* Majestic Amethyst Pillars Bundle */}
          <g transform="translate(512, 450) scale(1.15)" filter="drop-shadow(0 10px 20px rgba(217,70,239,0.35))">
            {/* Center giant crystal spire */}
            <polygon points="0,-210 35,-60 25,160 -25,160 -35,-60" fill="url(#purpleGradCrystTot)" stroke="#FFFFFF" strokeWidth="2.5" />
            <polygon points="0,-210 0,160 25,160 35,-60" fill="#FFFFFF" opacity="0.25" />
            
            {/* Left secondary spire */}
            <polygon points="-40,-130 -10,-20 -20,160 -55,160 -65,-20" fill="url(#purpleGradCrystTot)" stroke="url(#goldGradCrystTot)" strokeWidth="1.5" />
            {/* Right secondary spire */}
            <polygon points="40,-130 10,-20 20,160 55,160 65,-20" fill="url(#purpleGradCrystTot)" stroke="url(#goldGradCrystTot)" strokeWidth="1.5" />
            
            {/* Spiraling white-gold filigree lock bands */}
            <path d="M-60,110 Q0,80 60,110" fill="none" stroke="url(#goldGradCrystTot)" strokeWidth="5.5" strokeLinecap="round" />
            <path d="M-50,10 Q0,-20 50,10" fill="none" stroke="url(#goldGradCrystTot)" strokeWidth="5.5" strokeLinecap="round" />
            <path d="M-40,-80 Q0,-110 40,-80" fill="none" stroke="url(#goldGradCrystTot)" strokeWidth="4" strokeLinecap="round" />
          </g>
          
          {/* Leyline aura glowing core stars */}
          <circle cx="512" cy="210" r="12" fill="#FFFFFF" filter="url(#glowCrystTot)" />
          <circle cx="430" cy="300" r="6" fill="#F472B6" filter="url(#glowCrystTot)" />
          <circle cx="594" cy="300" r="6" fill="#F472B6" filter="url(#glowCrystTot)" />
        </svg>
      )
    },
    {
      id: 'moon_sigil',
      name: 'Sigil of the Silver Crescent',
      icon: Moon,
      filename: 'crownspire_moon_sigil',
      description: 'A premium, hand-painted 3D celestial emblem. Features a heavy white-gold circular frame with a glowing amethyst crescent moon and stars inlaid on a deep basalt plate.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradMoonSig" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FDE047" />
              <stop offset="70%" stopColor="#CA8A04" />
              <stop offset="100%" stopColor="#713F12" />
            </linearGradient>
            <linearGradient id="purpleGradMoonSig" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E9D5FF" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#3B0764" />
            </linearGradient>
            <linearGradient id="basaltGradMoonSig" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E1B4B" />
              <stop offset="100%" stopColor="#030008" />
            </linearGradient>
            <filter id="glowMoonSig" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="32" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#A855F7" opacity="0.12" filter="url(#glowMoonSig)" />
          
          {/* Main Shield Circular Plate */}
          <g transform="translate(512, 512) scale(1.15)" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.7))">
            {/* Outer White-Gold ornate ring frame */}
            <circle cx="0" cy="0" r="230" fill="url(#basaltGradMoonSig)" stroke="url(#goldGradMoonSig)" strokeWidth="12" />
            {/* Inner Filigree Ring */}
            <circle cx="0" cy="0" r="200" fill="none" stroke="url(#goldGradMoonSig)" strokeWidth="3.5" strokeDasharray="10, 12" />
            
            {/* White-Gold Edge studs */}
            <circle cx="0" cy="-215" r="8" fill="url(#goldGradMoonSig)" />
            <circle cx="215" cy="0" r="8" fill="url(#goldGradMoonSig)" />
            <circle cx="0" cy="215" r="8" fill="url(#goldGradMoonSig)" />
            <circle cx="-215" cy="0" r="8" fill="url(#goldGradMoonSig)" />
            
            {/* Inner glowing crescent moon and stars */}
            <g transform="scale(1.1)" filter="url(#glowMoonSig)">
              <path d="M-25,-35 C25,-35 45,-10 40,30 C35,50 15,65 -10,65 C-35,65 -55,40 -45,10 C-41,20 -20,30 5,25 C25,20 28,0 10,-18 C0,-25 -15,-28 -25,-35 Z" fill="url(#purpleGradMoonSig)" stroke="#FFFFFF" strokeWidth="2" />
              
              <circle cx="25" cy="-25" r="4" fill="#FFFFFF" />
              <polygon points="-30,40 -27,43 -24,40 -27,37" fill="#FFFFFF" />
            </g>
          </g>
        </svg>
      )
    },
    {
      id: 'sun_sigil',
      name: 'Sigil of the Radiant Dawn',
      icon: Sun,
      filename: 'crownspire_sun_sigil',
      description: 'A premium, hand-painted 3D solar emblem. A circular gold disc with radiating flame-scrolls and a central burning purple-gold sunburst inlay.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradSunSig" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FDE047" />
              <stop offset="70%" stopColor="#CA8A04" />
              <stop offset="100%" stopColor="#713F12" />
            </linearGradient>
            <linearGradient id="purpleGradSunSig" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE4E6" />
              <stop offset="50%" stopColor="#F43F5E" />
              <stop offset="100%" stopColor="#4C0519" />
            </linearGradient>
            <linearGradient id="basaltGradSunSig" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#310808" />
              <stop offset="100%" stopColor="#030000" />
            </linearGradient>
            <filter id="glowSunSig" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="32" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#FB7185" opacity="0.12" filter="url(#glowSunSig)" />
          
          {/* Main Shield Circular Plate */}
          <g transform="translate(512, 512) scale(1.15)" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.7))">
            {/* Outer ornate gear-like frame */}
            <circle cx="0" cy="0" r="230" fill="url(#basaltGradSunSig)" stroke="url(#goldGradSunSig)" strokeWidth="12" />
            <circle cx="0" cy="0" r="200" fill="none" stroke="url(#goldGradSunSig)" strokeWidth="3.5" strokeDasharray="10, 12" />
            
            {/* Radiating Flame Sunburst */}
            <g transform="scale(1.1)" filter="url(#glowSunSig)">
              <path d="M0,-55 L10,-20 L45,-45 L20,-10 L55,0 L20,10 L45,45 L10,20 L0,55 L-10,20 L-45,45 L-20,10 L-55,0 L-20,-10 L-45,-45 L-10,-20 Z" fill="url(#purpleGradSunSig)" stroke="#FFFFFF" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="16" fill="url(#goldGradSunSig)" />
            </g>
          </g>
        </svg>
      )
    },
    {
      id: 'crown_sigil',
      name: 'Sigil of Sovereign Reign',
      icon: Crown,
      filename: 'crownspire_crown_sigil',
      description: 'A premium, hand-painted 3D royal emblem. A shield-shaped crest featuring a heavily detailed white-gold monarch crown inlaid with pulsing violet gemstones.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradCrownSig" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FDE047" />
              <stop offset="70%" stopColor="#CA8A04" />
              <stop offset="100%" stopColor="#713F12" />
            </linearGradient>
            <linearGradient id="purpleGradCrownSig" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE5FF" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#30016B" />
            </linearGradient>
            <linearGradient id="basaltGradCrownSig" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e0b36" />
              <stop offset="100%" stopColor="#020005" />
            </linearGradient>
            <filter id="glowCrownSig" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="32" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#C084FC" opacity="0.12" filter="url(#glowCrownSig)" />
          
          {/* Shield Crest */}
          <g transform="translate(512, 512) scale(1.15)" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.7))">
            {/* Elegant shield outline */}
            <path d="M-180,-190 L180,-190 L180,10 C180,120 0,220 0,220 C0,220 -180,120 -180,10 Z" fill="url(#basaltGradCrownSig)" stroke="url(#goldGradCrownSig)" strokeWidth="12" />
            <path d="M-150,-160 L150,-160 L150,10 C150,100 0,185 0,185 C0,185 -150,100 -150,10 Z" fill="none" stroke="url(#goldGradCrownSig)" strokeWidth="3" strokeDasharray="8, 10" />
            
            {/* Embossed Monarch Crown */}
            <g transform="translate(0, -10) scale(0.9)" filter="url(#glowCrownSig)">
              {/* Crown Base */}
              <path d="M-110,60 L110,60 L95,35 L-95,35 Z" fill="url(#goldGradCrownSig)" stroke="#3a1e02" strokeWidth="2.5" />
              <circle cx="-50" cy="48" r="5" fill="#E879F9" />
              <circle cx="0" cy="48" r="7" fill="#FFFFFF" />
              <circle cx="50" cy="48" r="5" fill="#E879F9" />
              
              {/* Peaks */}
              <path d="M-20,35 L0,-60 L20,35 Z" fill="url(#goldGradCrownSig)" stroke="#3a1e02" strokeWidth="2.5" />
              <circle cx="0" cy="-65" r="9" fill="url(#purpleGradCrownSig)" stroke="#FFF" strokeWidth="1.5" />

              <path d="M-75,35 L-60,-25 L-25,35 Z" fill="url(#goldGradCrownSig)" stroke="#3a1e02" strokeWidth="2.5" />
              <circle cx="-60" cy="-30" r="7.5" fill="url(#purpleGradCrownSig)" stroke="#FFF" strokeWidth="1.5" />

              <path d="M75,35 L60,-25 L25,35 Z" fill="url(#goldGradCrownSig)" stroke="#3a1e02" strokeWidth="2.5" />
              <circle cx="60" cy="-30" r="7.5" fill="url(#purpleGradCrownSig)" stroke="#FFF" strokeWidth="1.5" />
            </g>
          </g>
        </svg>
      )
    },
    {
      id: 'valor_sigil',
      name: 'Sigil of the Undying Blade',
      icon: Sword,
      filename: 'crownspire_valor_sigil',
      description: 'A premium, hand-painted 3D warrior emblem. A sharp diamond-shaped sigil displaying a central glowing broadsword embedded into a violet gem, accented by angel-like white-gold wings.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradValorSig" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FDE047" />
              <stop offset="70%" stopColor="#CA8A04" />
              <stop offset="100%" stopColor="#713F12" />
            </linearGradient>
            <linearGradient id="purpleGradValorSig" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E9D5FF" />
              <stop offset="50%" stopColor="#A855F7" />
              <stop offset="100%" stopColor="#310808" />
            </linearGradient>
            <linearGradient id="basaltGradValorSig" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1C0D32" />
              <stop offset="100%" stopColor="#020005" />
            </linearGradient>
            <filter id="glowValorSig" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="32" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#A855F7" opacity="0.12" filter="url(#glowValorSig)" />
          
          {/* Diamond Sigil Plate */}
          <g transform="translate(512, 512) scale(1.15)" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.7))">
            {/* Outer sharp diamond frame */}
            <polygon points="0,-220 180,0 0,220 -180,0" fill="url(#basaltGradValorSig)" stroke="url(#goldGradValorSig)" strokeWidth="12" />
            <polygon points="0,-185 150,0 0,185 -150,0" fill="none" stroke="url(#goldGradValorSig)" strokeWidth="3" strokeDasharray="8, 10" />
            
            {/* Wing details on the sides */}
            <path d="M-150,0 Q-180,-80 -100,-110 Q-120,-45 -140,0" fill="url(#goldGradValorSig)" opacity="0.8" stroke="#3a1e02" strokeWidth="1" />
            <path d="M150,0 Q180,-80 100,-110 Q120,-45 140,0" fill="url(#goldGradValorSig)" opacity="0.8" stroke="#3a1e02" strokeWidth="1" />

            {/* Glowing Sword Inlay */}
            <g transform="scale(0.9)" filter="url(#glowValorSig)">
              {/* Blade */}
              <path d="M-10,95 L10,95 L6,-110 L0,-140 L-6,-110 Z" fill="#FFFFFF" stroke="#CA8A04" strokeWidth="2.5" />
              {/* Guard */}
              <path d="M-30,85 L30,85 L25,70 L-25,70 Z" fill="url(#goldGradValorSig)" stroke="#3a1e02" strokeWidth="2" />
              {/* Central gemstone */}
              <circle cx="0" cy="78" r="7.5" fill="url(#purpleGradValorSig)" filter="url(#glowValorSig)" />
            </g>
          </g>
        </svg>
      )
    },
    {
      id: 'wisdom_sigil',
      name: 'Sigil of the Arcane Tome',
      icon: BookOpen,
      filename: 'crownspire_wisdom_sigil',
      description: 'A premium, hand-painted 3D sage emblem. An oval scrollwork frame holding a glowing, open spellbook inlaid with violet arcane scripts and surrounded by laurel branches.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradWisdomSig" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FDE047" />
              <stop offset="70%" stopColor="#CA8A04" />
              <stop offset="100%" stopColor="#713F12" />
            </linearGradient>
            <linearGradient id="purpleGradWisdomSig" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFCCFF" />
              <stop offset="50%" stopColor="#9333EA" />
              <stop offset="100%" stopColor="#30016B" />
            </linearGradient>
            <linearGradient id="basaltGradWisdomSig" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1a0733" />
              <stop offset="100%" stopColor="#010003" />
            </linearGradient>
            <filter id="glowWisdomSig" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="32" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#9333EA" opacity="0.12" filter="url(#glowWisdomSig)" />
          
          {/* Oval Shield Badge */}
          <g transform="translate(512, 512) scale(1.15)" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.7))">
            {/* Outer ornate Oval Frame */}
            <ellipse cx="0" cy="0" rx="200" ry="225" fill="url(#basaltGradWisdomSig)" stroke="url(#goldGradWisdomSig)" strokeWidth="12" />
            <ellipse cx="0" cy="0" rx="175" ry="195" fill="none" stroke="url(#goldGradWisdomSig)" strokeWidth="3.5" strokeDasharray="10, 10" />
            
            {/* Laurel wreaths wrapping left & right inside */}
            <path d="M-150,80 Q-170,0 -120,-80" fill="none" stroke="url(#goldGradWisdomSig)" strokeWidth="3" opacity="0.65" />
            <path d="M150,80 Q170,0 120,-80" fill="none" stroke="url(#goldGradWisdomSig)" strokeWidth="3" opacity="0.65" />

            {/* Glowing Spellbook Inlay */}
            <g transform="scale(0.85) translate(0, -10)" filter="url(#glowWisdomSig)">
              {/* Backing leather cover */}
              <path d="M-105,60 L105,60 L115,-40 L-115,-40 Z" fill="#250C47" stroke="url(#goldGradWisdomSig)" strokeWidth="4.5" />
              
              {/* Pages */}
              <path d="M-100,45 C-65,25 -35,35 -5,45 L-5,-45 C-35,-50 -65,-45 -100,-35 Z" fill="#FFFEE0" stroke="#451a03" strokeWidth="2" />
              <path d="M100,45 C65,25 35,35 5,45 L5,-45 C35,-50 65,-45 100,-35 Z" fill="#FFFEE0" stroke="#451a03" strokeWidth="2" />

              {/* Glowing Violet arcane symbols on pages */}
              <path d="M-75,-15 L-35,-15 M-75,5 L-40,5 M-75,25 L-45,25" stroke="#9333EA" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />
              <path d="M75,-15 L35,-15 M75,5 L40,5 M75,25 L45,25" stroke="#9333EA" strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />
            </g>
          </g>
        </svg>
      )
    },
    {
      id: 'shadow_sigil',
      name: 'Sigil of the Eclipse Eye',
      icon: Eye,
      filename: 'crownspire_shadow_sigil',
      description: 'A premium, hand-painted 3D rogue emblem. A sharp hexagonal badge with a stylized glowing third-eye or cosmic eclipse symbol of dark crystal violet, framed by gold blades.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradShadowSig" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#FDE047" />
              <stop offset="70%" stopColor="#CA8A04" />
              <stop offset="100%" stopColor="#713F12" />
            </linearGradient>
            <linearGradient id="purpleGradShadowSig" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5D0FF" />
              <stop offset="50%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <linearGradient id="basaltGradShadowSig" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0a0314" />
              <stop offset="100%" stopColor="#000000" />
            </linearGradient>
            <filter id="glowShadowSig" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="32" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#7C3AED" opacity="0.12" filter="url(#glowShadowSig)" />
          
          {/* Hexagonal Badge Shield */}
          <g transform="translate(512, 512) scale(1.15)" filter="drop-shadow(0 15px 30px rgba(0,0,0,0.75))">
            {/* Outer Hexagon frame */}
            <polygon points="0,-220 185,-110 185,110 0,220 -185,110 -185,-110" fill="url(#basaltGradShadowSig)" stroke="url(#goldGradShadowSig)" strokeWidth="12" />
            <polygon points="0,-185 155,-90 155,90 0,185 -155,90 -155,-90" fill="none" stroke="url(#goldGradShadowSig)" strokeWidth="3" strokeDasharray="10, 8" />
            
            {/* Central Eclipse / Cosmic Eye */}
            <g transform="scale(0.9)" filter="url(#glowShadowSig)">
              {/* Outer eclipse corona */}
              <circle cx="0" cy="0" r="75" fill="url(#purpleGradShadowSig)" stroke="#FFFFFF" strokeWidth="2.5" />
              {/* Dark moon transit overlay blocking part of the sun */}
              <circle cx="-15" cy="-10" r="65" fill="#010103" />
              {/* Centered purple pupil shining through */}
              <ellipse cx="0" cy="0" rx="35" ry="12" fill="#FFFFFF" filter="url(#glowShadowSig)" transform="rotate(-15)" />
              <circle cx="0" cy="0" r="10" fill="#D8B4FE" />
            </g>
          </g>
        </svg>
      )
    }
  ];

  const activeAsset = assetList.find(a => a.id === selectedAssetId) || assetList[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          {/* Main Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 180 }}
            className="relative w-full max-w-5xl bg-[#0c0d12] border-2 border-purple-900/40 rounded-3xl shadow-[0_0_50px_rgba(110,22,235,0.25)] flex flex-col md:flex-row overflow-hidden max-h-[90vh]"
          >
            {/* Header / Brand Overlay */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-amber-400 to-purple-600 z-10" />

            {/* Left Column: List of Assets */}
            <div className="w-full md:w-2/5 border-b md:border-b-0 md:border-r border-zinc-900/60 p-5 flex flex-col max-h-[40vh] md:max-h-none overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <div>
                  <h2 className="text-sm font-serif font-black tracking-widest text-white uppercase leading-none">
                    Crownspire UI Pack
                  </h2>
                  <span className="text-[10px] text-purple-400 font-mono tracking-wider">PREMIUM FANTASY UI • 1024x1024 PNG</span>
                </div>
              </div>

              {/* Category Tab Switcher */}
              <div className="flex flex-wrap gap-1.5 border-b border-zinc-900/60 pb-3 mb-3">
                <button
                  onClick={() => handleTabChange('ui')}
                  className={`py-1.5 px-2.5 rounded-lg text-[9px] font-serif font-black uppercase tracking-wider text-center border transition-all cursor-pointer ${
                    activeTab === 'ui'
                      ? 'bg-purple-900/30 border-purple-500/50 text-purple-300'
                      : 'bg-transparent border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Core UI
                </button>
                <button
                  onClick={() => handleTabChange('runes')}
                  className={`py-1.5 px-2.5 rounded-lg text-[9px] font-serif font-black uppercase tracking-wider text-center border transition-all cursor-pointer ${
                    activeTab === 'runes'
                      ? 'bg-purple-900/30 border-purple-500/50 text-purple-300'
                      : 'bg-transparent border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Runes
                </button>
                <button
                  onClick={() => handleTabChange('crystals')}
                  className={`py-1.5 px-2.5 rounded-lg text-[9px] font-serif font-black uppercase tracking-wider text-center border transition-all cursor-pointer ${
                    activeTab === 'crystals'
                      ? 'bg-purple-900/30 border-purple-500/50 text-purple-300'
                      : 'bg-transparent border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Crystals
                </button>
                <button
                  onClick={() => handleTabChange('totems')}
                  className={`py-1.5 px-2.5 rounded-lg text-[9px] font-serif font-black uppercase tracking-wider text-center border transition-all cursor-pointer ${
                    activeTab === 'totems'
                      ? 'bg-purple-900/30 border-purple-500/50 text-purple-300'
                      : 'bg-transparent border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Totems
                </button>
                <button
                  onClick={() => handleTabChange('sigils')}
                  className={`py-1.5 px-2.5 rounded-lg text-[9px] font-serif font-black uppercase tracking-wider text-center border transition-all cursor-pointer ${
                    activeTab === 'sigils'
                      ? 'bg-purple-900/30 border-purple-500/50 text-purple-300'
                      : 'bg-transparent border-transparent text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Sigils
                </button>
              </div>

              <div className="space-y-1.5 flex-1 pr-1">
                {assetList
                  .filter((asset) => getCategory(asset.id) === activeTab)
                  .map((asset) => {
                    const Icon = asset.icon;
                    const isSelected = selectedAssetId === asset.id;
                    return (
                      <button
                        key={asset.id}
                        onClick={() => setSelectedAssetId(asset.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-purple-950/45 border-purple-500/50 text-white font-semibold shadow-inner'
                            : 'bg-zinc-950/20 border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-purple-500/20 text-purple-300' : 'bg-zinc-900 text-zinc-500'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-serif leading-tight">{asset.name}</div>
                          <div className="text-[9px] font-mono text-zinc-500 truncate">{asset.filename}.png</div>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>

            {/* Right Column: Active Asset Preview and Export Actions */}
            <div className="w-full md:w-3/5 p-6 flex flex-col bg-[#09090d] relative overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white bg-zinc-900/55 p-2 rounded-full border border-zinc-800 hover:border-zinc-700 cursor-pointer active:scale-95 transition-all z-20"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex-1 flex flex-col items-center justify-center p-4">
                {/* 1024x1024 Transparent Interactive Canvas Frame */}
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-2xl border-4 border-dashed border-purple-900/25 bg-[#0e0e14] shadow-inner flex items-center justify-center p-4 group overflow-hidden">
                  {/* Grid checkerboard background indicating true transparency */}
                  <div className="absolute inset-0 opacity-15" style={{
                    backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px), radial-gradient(#ffffff 1px, #0e0e14 1px)',
                    backgroundSize: '20px 20px',
                    backgroundPosition: '0 0, 10px 10px'
                  }} />

                  {/* Active Render */}
                  <div className="relative w-full h-full z-10 transition-transform duration-500 group-hover:scale-105 flex items-center justify-center">
                    {activeAsset.svg(`preview-${activeAsset.id}`)}
                  </div>
                  
                  {/* High Definition Watermark Badge */}
                  <span className="absolute bottom-3 right-3 text-[8px] font-mono tracking-widest text-purple-400 bg-purple-950/70 px-2 py-0.5 rounded border border-purple-800/30 z-20 uppercase">
                    1024 x 1024 UHD
                  </span>
                </div>

                {/* Invisible SVG element specifically rendered for high-res serializer (strictly 1024x1024 for correct aspect exports) */}
                <div className="hidden">
                  {assetList.map(a => (
                    <div key={`export-wrapper-${a.id}`}>
                      {a.svg(`export-${a.id}`)}
                    </div>
                  ))}
                </div>
              </div>

              {/* Asset Information Block */}
              <div className="bg-[#0e0f15] border border-purple-950/50 rounded-2xl p-4 mt-4">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <h3 className="text-sm font-serif font-bold text-amber-500">{activeAsset.name} Asset</h3>
                  <div className="flex gap-1.5 text-[9px] font-mono font-bold">
                    <span className="bg-emerald-950/60 text-emerald-400 px-2 py-0.5 rounded border border-emerald-900/30">TRANSPARENT PNG</span>
                    <span className="bg-purple-950/60 text-purple-400 px-2 py-0.5 rounded border border-purple-900/30">STYLIZED 3D</span>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-400 font-mono tracking-wide leading-relaxed">
                  {activeAsset.description}
                </p>

                {/* Export Action Controller */}
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleDownloadPNG(`export-${activeAsset.id}`, activeAsset.filename)}
                    disabled={downloadingId !== null}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-serif font-extrabold text-xs tracking-wider uppercase py-3 rounded-xl shadow-[0_4px_15px_rgba(110,22,235,0.3)] hover:shadow-[0_4px_20px_rgba(110,22,235,0.45)] disabled:opacity-50 cursor-pointer transition-all active:scale-98"
                  >
                    {downloadingId === `export-${activeAsset.id}` ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span>Rendering UHD PNG...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>Download 1024x1024 Transparent PNG</span>
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      // Trigger download for ALL assets in the active tab
                      let delay = 0;
                      assetList
                        .filter((asset) => getCategory(asset.id) === activeTab)
                        .forEach((asset) => {
                          setTimeout(() => {
                            handleDownloadPNG(`export-${asset.id}`, asset.filename);
                          }, delay);
                          delay += 1000; // 1s stagger to prevent browser lockups
                        });
                    }}
                    className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-serif font-black text-[10px] tracking-wider uppercase px-4 py-3 rounded-xl border border-zinc-800 hover:border-zinc-700 cursor-pointer transition-all active:scale-95"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>
                      Download {
                        activeTab === 'ui' ? 'Core UI (20)' :
                        activeTab === 'runes' ? 'Arcane Runes (8)' :
                        activeTab === 'crystals' ? 'Soul Crystals (5)' :
                        activeTab === 'totems' ? 'Ancient Totems (6)' :
                        'Moon Sigils (6)'
                      } Pack
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
