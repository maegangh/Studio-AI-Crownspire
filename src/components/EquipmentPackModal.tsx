import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Sparkles, Shield, Sword, Heart, Eye, Check, Gem, Info, Crown, Layers } from 'lucide-react';

interface EquipmentPackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EquipmentPackModal({ isOpen, onClose }: EquipmentPackModalProps) {
  const [activeTab, setActiveTab] = useState<'crystal_vanguard' | 'royal_regalia'>('crystal_vanguard');
  const [selectedEquipId, setSelectedEquipId] = useState<string>('crystal_sword');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

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
    }, 400);
  };

  const equipmentList = [
    {
      id: 'crystal_sword',
      name: 'Crystal Sword',
      category: 'Weapons',
      filename: 'crownspire_crystal_sword',
      description: 'A legendary masterwork weapon of Crownspire. Features a hand-painted blade carved from raw celestial violet crystal and an ornate white-gold guard socketed with royal purple energy cores.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradEquip" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEF" />
              <stop offset="30%" stopColor="#FAD480" />
              <stop offset="70%" stopColor="#C99427" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>
            
            <linearGradient id="crystalGradEquip" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#D2A3FF" />
              <stop offset="45%" stopColor="#9C4EFF" />
              <stop offset="55%" stopColor="#751FFF" />
              <stop offset="100%" stopColor="#4A059C" />
            </linearGradient>

            <linearGradient id="glowGradEquip" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#9F5EFF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.1" />
            </linearGradient>

            <filter id="glowFilterEquip" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="25" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* BACKDROP AURA */}
          <circle cx="512" cy="512" r="320" fill="#913BFF" opacity="0.15" filter="url(#glowFilterEquip)" />

          {/* ROTATED SWORD */}
          <g transform="translate(512, 512) rotate(45)">
            {/* Blade Glow Shadow */}
            <path d="M-22,-440 L0,-500 L22,-440 L18,0 L-18,0 Z" fill="#BD7FFF" opacity="0.45" filter="url(#glowFilterEquip)" />
            
            {/* Primary Crystal Blade */}
            <path d="M-18,-420 L0,-480 L18,-420 L15,0 L-15,0 Z" fill="url(#crystalGradEquip)" stroke="#ECD6FF" strokeWidth="2.5" />
            
            {/* Blade Shading (Left side darker) */}
            <path d="M-18,-420 L0,-480 L0,0 L-15,0 Z" fill="#4B059C" opacity="0.3" />
            <path d="M0,-480 L18,-420 L15,0 L0,0 Z" fill="#FFFFFF" opacity="0.15" />

            {/* Glowing Runes on Blade */}
            <g opacity="0.85" filter="url(#glowFilterEquip)">
              <line x1="0" y1="-120" x2="0" y2="-380" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />
              <polygon points="0,-330 -6,-310 6,-310" fill="#FFFFFF" />
              <polygon points="0,-250 -6,-230 6,-230" fill="#FFFFFF" />
              <polygon points="0,-170 -6,-150 6,-150" fill="#FFFFFF" />
            </g>

            {/* White-Gold Crossguard */}
            <path d="M-80,-10 C-80,20 -30,30 0,30 C30,30 80,20 80,-10 C60,-30 25,-20 0,-20 C-25,-20 -60,-30 -80,-10 Z" fill="url(#goldGradEquip)" stroke="#4A3402" strokeWidth="3" />
            <path d="M-60,-5 C-60,15 -20,22 0,22 C20,22 60,15 60,-5" fill="none" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.3" />

            {/* Guard Gem Socket */}
            <circle cx="0" cy="5" r="14" fill="url(#goldGradEquip)" stroke="#4A3402" strokeWidth="2" />
            <circle cx="0" cy="5" r="9" fill="#751FFF" />
            <circle cx="-3" cy="2" r="3" fill="#FFFFFF" opacity="0.8" />

            {/* Leather Grip */}
            <rect x="-12" y="30" width="24" height="120" rx="6" fill="#2E1454" stroke="url(#goldGradEquip)" strokeWidth="3" />
            {/* Grip Ribbing */}
            <path d="M-12,50 L12,58 M-12,75 L12,83 M-12,100 L12,108 M-12,125 L12,133" stroke="url(#goldGradEquip)" strokeWidth="2" />

            {/* White-Gold Crown Pommel */}
            <g transform="translate(0, 150)">
              <path d="M-22,0 L22,0 L30,30 L-30,30 Z" fill="url(#goldGradEquip)" stroke="#4A3402" strokeWidth="3" />
              <circle cx="0" cy="15" r="8" fill="#BD7FFF" stroke="#FFFFFF" strokeWidth="1" />
              <polygon points="0,-10 -6,0 6,0" fill="url(#goldGradEquip)" />
            </g>
          </g>

          {/* SPARKS */}
          <polygon points="512,120 516,150 536,154 516,158 512,188 508,158 488,154 508,150" fill="#FFFFFF" />
          <polygon points="260,320 264,335 279,339 264,343 260,358 256,343 241,339 256,335" fill="#E8C9FF" opacity="0.7" />
        </svg>
      )
    },
    {
      id: 'gold_helmet',
      name: 'White-Gold Helmet',
      category: 'Headwear',
      filename: 'crownspire_gold_helmet',
      description: 'The protective helm of the Crownspire Vanguard. Sculpted in white-gold with elegant facial guard carvings, purple crystal vision slits, and a flowing lavender plume.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradHelmet" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEF" />
              <stop offset="35%" stopColor="#FAD480" />
              <stop offset="70%" stopColor="#C99427" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>

            <linearGradient id="plumeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4A059C" />
              <stop offset="50%" stopColor="#9C4EFF" />
              <stop offset="100%" stopColor="#E6C6FF" />
            </linearGradient>

            <filter id="glowHelmet" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* BACKDROP GLOW */}
          <circle cx="512" cy="512" r="320" fill="#A86BFF" opacity="0.14" filter="url(#glowHelmet)" />

          {/* LAVENDER PLUME */}
          <path d="M512,320 C420,180 280,180 200,280 C280,320 340,320 460,360 Z" fill="url(#plumeGrad)" filter="url(#glowHelmet)" />
          <path d="M512,320 C420,180 280,180 200,280 C280,320 340,320 460,360 Z" fill="url(#plumeGrad)" />
          <path d="M512,320 C580,160 720,160 800,260 C720,300 660,300 540,350 Z" fill="url(#plumeGrad)" opacity="0.8" />

          {/* HELMET DOME / BASE */}
          <path d="M260,500 C260,320 360,260 512,260 C664,260 760,320 760,500 L740,640 L280,640 Z" fill="url(#goldGradHelmet)" stroke="#4A3402" strokeWidth="5" />

          {/* PLUME ANCHOR */}
          <path d="M480,260 L544,260 L512,200 Z" fill="#4B059C" stroke="url(#goldGradHelmet)" strokeWidth="3" />

          {/* FOREHEAD DIADEM CREST */}
          <path d="M512,280 L550,380 L512,420 L474,380 Z" fill="#9C4EFF" stroke="url(#goldGradHelmet)" strokeWidth="3.5" />
          <circle cx="512" cy="350" r="10" fill="#FFFFFF" opacity="0.8" filter="url(#glowHelmet)" />
          <circle cx="512" cy="350" r="5" fill="#FFFFFF" />

          {/* VISOR / EYE SLITS */}
          <path d="M320,480 Q512,420 704,480 L680,540 Q512,480 344,540 Z" fill="#1C053B" stroke="url(#goldGradHelmet)" strokeWidth="3" />
          
          {/* Glowing purple eyes inside visor */}
          <g filter="url(#glowHelmet)">
            <polygon points="380,500 450,490 440,515" fill="#C584FF" />
            <polygon points="644,500 574,490 584,515" fill="#C584FF" />
          </g>

          {/* NOSE BRIDGE / CHIN GUARD */}
          <path d="M512,430 L540,660 L512,760 L484,660 Z" fill="url(#goldGradHelmet)" stroke="#4A3402" strokeWidth="3" />
          <path d="M512,430 L512,760" stroke="#FFFFFF" strokeWidth="2" opacity="0.4" />

          {/* CHEEK GUARDS */}
          <path d="M280,580 L200,720 L270,760 L320,640 Z" fill="url(#goldGradHelmet)" stroke="#4A3402" strokeWidth="3" />
          <path d="M740,580 L820,720 L750,760 L700,640 Z" fill="url(#goldGradHelmet)" stroke="#4A3402" strokeWidth="3" />

          {/* DECORATIVE ENGRAVINGS */}
          <path d="M350,380 Q430,340 512,380" fill="none" stroke="#4A3402" strokeWidth="2" />
          <path d="M674,380 Q594,340 512,380" fill="none" stroke="#4A3402" strokeWidth="2" />
        </svg>
      )
    },
    {
      id: 'crystal_chest',
      name: 'Crystal Chest Armor',
      category: 'Chestwear',
      filename: 'crownspire_crystal_chest_armor',
      description: 'Sovereign heavy plate mail. Reinforced with thick white-gold pauldrons, curved side-guards, and a massive glowing royal crystal reactor at the chest.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradChest" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEF" />
              <stop offset="35%" stopColor="#FAD480" />
              <stop offset="70%" stopColor="#C99427" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>

            <linearGradient id="plateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2D114F" />
              <stop offset="100%" stopColor="#120423" />
            </linearGradient>

            <linearGradient id="crystalHeartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F7D3FF" />
              <stop offset="50%" stopColor="#A146FF" />
              <stop offset="100%" stopColor="#350075" />
            </linearGradient>

            <filter id="glowChest" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="24" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* BACKDROP AURA */}
          <circle cx="512" cy="512" r="320" fill="#9947FF" opacity="0.15" filter="url(#glowChest)" />

          {/* SHOULDER PAULDRONS (LEFT & RIGHT) */}
          <path d="M180,380 C180,240 320,240 360,340 C340,420 280,480 180,420 Z" fill="url(#goldGradChest)" stroke="#4A3402" strokeWidth="4" />
          <path d="M844,380 C844,240 704,240 664,340 C684,420 744,480 844,420 Z" fill="url(#goldGradChest)" stroke="#4A3402" strokeWidth="4" />

          {/* COWL / NECK GUARD */}
          <path d="M380,300 C380,300 450,250 512,250 C574,250 644,300 644,300 L590,360 L434,360 Z" fill="url(#goldGradChest)" stroke="#4A3402" strokeWidth="3" />

          {/* BREASTPLATE CHASSIS */}
          <path d="M280,380 L744,380 L700,740 L512,830 L324,740 Z" fill="url(#plateGrad)" stroke="url(#goldGradChest)" strokeWidth="6" />

          {/* SIDE EMBELLISHMENTS / RIBS */}
          <path d="M300,420 Q512,470 724,420" fill="none" stroke="url(#goldGradChest)" strokeWidth="3" />
          <path d="M310,540 Q512,590 714,540" fill="none" stroke="url(#goldGradChest)" strokeWidth="3" opacity="0.75" />
          <path d="M320,660 Q512,710 704,660" fill="none" stroke="url(#goldGradChest)" strokeWidth="3" opacity="0.5" />

          {/* CENTER REACTOR DIAMOND GEM */}
          <g transform="translate(512, 532)" filter="url(#glowChest)">
            <polygon points="0,-120 100,0 0,120 -100,0" fill="url(#crystalHeartGrad)" />
          </g>
          <g transform="translate(512, 532)">
            <polygon points="0,-120 100,0 0,120 -100,0" fill="url(#crystalHeartGrad)" stroke="#ECA8FF" strokeWidth="3" />
            {/* Crystal Shading */}
            <polygon points="0,-120 0,120 100,0" fill="#FFFFFF" opacity="0.12" />
            <polygon points="0,-120 0,120 -100,0" fill="#000000" opacity="0.2" />
          </g>

          {/* FOREGROUND CREST OVER GEM */}
          <g transform="translate(512, 532)">
            <path d="M-30,-30 L30,-30 L45,0 L30,30 L-30,30 L-45,0 Z" fill="url(#goldGradChest)" stroke="#4A3402" strokeWidth="2.5" />
            <polygon points="0,-15 -10,10 10,10" fill="#FFFFFF" />
            <circle cx="0" cy="0" r="8" fill="#5F16C4" />
          </g>
        </svg>
      )
    },
    {
      id: 'crystal_gauntlets',
      name: 'Crystal Gauntlets',
      category: 'Hands',
      filename: 'crownspire_crystal_gauntlets',
      description: 'Ornate armguards. Heavy white-gold knuckle guards and articulated finger plating, set with matching purple crystal gemstones for spell channeling.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradGauntlets" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEF" />
              <stop offset="35%" stopColor="#FAD480" />
              <stop offset="70%" stopColor="#C99427" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>

            <linearGradient id="crystalGemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ECC8FF" />
              <stop offset="50%" stopColor="#9C4EFF" />
              <stop offset="100%" stopColor="#31046E" />
            </linearGradient>

            <filter id="glowGauntlets" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* BACKDROP MAGIC GLOW */}
          <circle cx="512" cy="512" r="320" fill="#9946FF" opacity="0.14" filter="url(#glowGauntlets)" />

          {/* LEFT GAUNTLET (Slightly Angled) */}
          <g transform="translate(340, 512) rotate(-10)">
            {/* Wrist Forearm Plate */}
            <path d="M-60,180 L60,180 L80,30 L-80,30 Z" fill="#1C053B" stroke="url(#goldGradGauntlets)" strokeWidth="4" />
            {/* Forearm Engraving */}
            <path d="M-40,150 L40,150 L30,60 L-30,60 Z" fill="none" stroke="url(#goldGradGauntlets)" strokeWidth="2" />

            {/* Hand Guard Back Plate */}
            <path d="M-80,30 L80,30 L60,-90 L-60,-90 Z" fill="url(#goldGradGauntlets)" stroke="#4A3402" strokeWidth="4" />

            {/* Knuckle Spikes */}
            <polygon points="-50,-90 -30,-90 -40,-120" fill="url(#goldGradGauntlets)" stroke="#4A3402" strokeWidth="2" />
            <polygon points="-20,-90 0,-90 -10,-120" fill="url(#goldGradGauntlets)" stroke="#4A3402" strokeWidth="2" />
            <polygon points="10,-90 30,-90 20,-120" fill="url(#goldGradGauntlets)" stroke="#4A3402" strokeWidth="2" />
            <polygon points="40,-90 60,-90 50,-120" fill="url(#goldGradGauntlets)" stroke="#4A3402" strokeWidth="2" />

            {/* Articulated Metal Fingers */}
            <rect x="-48" y="-150" width="16" height="30" rx="3" fill="url(#goldGradGauntlets)" stroke="#4A3402" strokeWidth="2" />
            <rect x="-22" y="-160" width="16" height="40" rx="3" fill="url(#goldGradGauntlets)" stroke="#4A3402" strokeWidth="2" />
            <rect x="4" y="-155" width="16" height="35" rx="3" fill="url(#goldGradGauntlets)" stroke="#4A3402" strokeWidth="2" />
            <rect x="30" y="-140" width="16" height="25" rx="3" fill="url(#goldGradGauntlets)" stroke="#4A3402" strokeWidth="2" />

            {/* Hand Jewel Core */}
            <g transform="translate(0, -30)" filter="url(#glowGauntlets)">
              <polygon points="0,-40 30,0 0,40 -30,0" fill="url(#crystalGemGrad)" />
            </g>
            <g transform="translate(0, -30)">
              <polygon points="0,-40 30,0 0,40 -30,0" fill="url(#crystalGemGrad)" stroke="#FFFFFF" strokeWidth="1.5" />
              <polygon points="0,-40 0,40 30,0" fill="#FFFFFF" opacity="0.15" />
            </g>
          </g>

          {/* RIGHT GAUNTLET (Mirror Angle) */}
          <g transform="translate(684, 512) rotate(10)">
            {/* Wrist Forearm Plate */}
            <path d="M-60,180 L60,180 L80,30 L-80,30 Z" fill="#1C053B" stroke="url(#goldGradGauntlets)" strokeWidth="4" />
            {/* Forearm Engraving */}
            <path d="M-40,150 L40,150 L30,60 L-30,60 Z" fill="none" stroke="url(#goldGradGauntlets)" strokeWidth="2" />

            {/* Hand Guard Back Plate */}
            <path d="M-80,30 L80,30 L60,-90 L-60,-90 Z" fill="url(#goldGradGauntlets)" stroke="#4A3402" strokeWidth="4" />

            {/* Knuckle Spikes */}
            <polygon points="-50,-90 -30,-90 -40,-120" fill="url(#goldGradGauntlets)" stroke="#4A3402" strokeWidth="2" />
            <polygon points="-20,-90 0,-90 -10,-120" fill="url(#goldGradGauntlets)" stroke="#4A3402" strokeWidth="2" />
            <polygon points="10,-90 30,-90 20,-120" fill="url(#goldGradGauntlets)" stroke="#4A3402" strokeWidth="2" />
            <polygon points="40,-90 60,-90 50,-120" fill="url(#goldGradGauntlets)" stroke="#4A3402" strokeWidth="2" />

            {/* Articulated Metal Fingers */}
            <rect x="-48" y="-150" width="16" height="30" rx="3" fill="url(#goldGradGauntlets)" stroke="#4A3402" strokeWidth="2" />
            <rect x="-22" y="-160" width="16" height="40" rx="3" fill="url(#goldGradGauntlets)" stroke="#4A3402" strokeWidth="2" />
            <rect x="4" y="-155" width="16" height="35" rx="3" fill="url(#goldGradGauntlets)" stroke="#4A3402" strokeWidth="2" />
            <rect x="30" y="-140" width="16" height="25" rx="3" fill="url(#goldGradGauntlets)" stroke="#4A3402" strokeWidth="2" />

            {/* Hand Jewel Core */}
            <g transform="translate(0, -30)" filter="url(#glowGauntlets)">
              <polygon points="0,-40 30,0 0,40 -30,0" fill="url(#crystalGemGrad)" />
            </g>
            <g transform="translate(0, -30)">
              <polygon points="0,-40 30,0 0,40 -30,0" fill="url(#crystalGemGrad)" stroke="#FFFFFF" strokeWidth="1.5" />
              <polygon points="0,-40 0,40 30,0" fill="#FFFFFF" opacity="0.15" />
            </g>
          </g>
        </svg>
      )
    },
    {
      id: 'royal_boots',
      name: 'Royal Boots',
      category: 'Footwear',
      filename: 'crownspire_royal_boots',
      description: 'Sovereign battle boots. Heavily armored greaves forged of white-gold, complete with protective golden wings and radiant amethyst gems embedded into the kneeguards.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradBoots" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEF" />
              <stop offset="35%" stopColor="#FAD480" />
              <stop offset="70%" stopColor="#C99427" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>

            <linearGradient id="bootLeather" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#311454" />
              <stop offset="100%" stopColor="#120323" />
            </linearGradient>

            <filter id="glowBoots" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* BACKDROP AURA */}
          <circle cx="512" cy="512" r="320" fill="#9144FF" opacity="0.14" filter="url(#glowBoots)" />

          {/* LEFT BOOT */}
          <g transform="translate(360, 512)">
            {/* Armored Greave (Shin) */}
            <path d="M-50,-200 L50,-200 L40,60 L-40,60 Z" fill="url(#bootLeather)" stroke="url(#goldGradBoots)" strokeWidth="4" />
            
            {/* Wing Ornament (Greave flank) */}
            <path d="M-50,-100 C-120,-110 -180,-60 -170,10 C-120,0 -80,-20 -50,-50" fill="url(#goldGradBoots)" stroke="#4A3402" strokeWidth="2.5" />

            {/* Knee Guard Shield */}
            <path d="M-60,-200 L60,-200 L45,-280 L0,-310 L-45,-280 Z" fill="url(#goldGradBoots)" stroke="#4A3402" strokeWidth="3" />
            <circle cx="0" cy="-250" r="10" fill="#9F5EFF" stroke="#FFFFFF" strokeWidth="1" />

            {/* Ankle Plate */}
            <circle cx="0" cy="80" r="25" fill="url(#goldGradBoots)" stroke="#4A3402" strokeWidth="3" />
            <circle cx="0" cy="80" r="12" fill="#120323" />

            {/* Iron / Golden Sabaton (Foot) */}
            <path d="M-30,90 L30,90 L70,180 Q20,210 -40,180 Z" fill="url(#goldGradBoots)" stroke="#4A3402" strokeWidth="3" />
            <path d="M-40,180 L20,180 L0,90 Z" fill="#FFFFFF" opacity="0.12" />
          </g>

          {/* RIGHT BOOT */}
          <g transform="translate(664, 512) scale(-1, 1)">
            {/* Armored Greave (Shin) */}
            <path d="M-50,-200 L50,-200 L40,60 L-40,60 Z" fill="url(#bootLeather)" stroke="url(#goldGradBoots)" strokeWidth="4" />
            
            {/* Wing Ornament (Greave flank) */}
            <path d="M-50,-100 C-120,-110 -180,-60 -170,10 C-120,0 -80,-20 -50,-50" fill="url(#goldGradBoots)" stroke="#4A3402" strokeWidth="2.5" />

            {/* Knee Guard Shield */}
            <path d="M-60,-200 L60,-200 L45,-280 L0,-310 L-45,-280 Z" fill="url(#goldGradBoots)" stroke="#4A3402" strokeWidth="3" />
            <circle cx="0" cy="-250" r="10" fill="#9F5EFF" stroke="#FFFFFF" strokeWidth="1" />

            {/* Ankle Plate */}
            <circle cx="0" cy="80" r="25" fill="url(#goldGradBoots)" stroke="#4A3402" strokeWidth="3" />
            <circle cx="0" cy="80" r="12" fill="#120323" />

            {/* Iron / Golden Sabaton (Foot) */}
            <path d="M-30,90 L30,90 L70,180 Q20,210 -40,180 Z" fill="url(#goldGradBoots)" stroke="#4A3402" strokeWidth="3" />
            <path d="M-40,180 L20,180 L0,90 Z" fill="#FFFFFF" opacity="0.12" />
          </g>
        </svg>
      )
    },
    {
      id: 'ancient_crownmark',
      name: 'Ancient Crownmark Artifact',
      category: 'Crownmarks',
      filename: 'crownspire_crownmark_artifact',
      description: 'The Eye of Crownspire. A floating mystical white-gold solar crownmark with interlocking revolving runic orbits, supporting a glowing core of pure amethyst crystal element.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradCrownmark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEE2" />
              <stop offset="35%" stopColor="#FBD783" />
              <stop offset="70%" stopColor="#CA962B" />
              <stop offset="100%" stopColor="#7E5606" />
            </linearGradient>

            <linearGradient id="cosmicCore" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFC8FF" />
              <stop offset="55%" stopColor="#9E4EFF" />
              <stop offset="100%" stopColor="#1E004B" />
            </linearGradient>

            <filter id="glowCrownmark" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="25" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* BACKDROP NEBULA FLARE */}
          <circle cx="512" cy="512" r="290" fill="#AC5EFF" opacity="0.22" filter="url(#glowCrownmark)" />

          {/* ROTATING OUTER SOLAR RAYS */}
          <g transform="translate(512, 512)">
            <path d="M0,-300 L40,-120 L240,-180 L120,-40 L300,0 L120,40 L240,180 L40,120 L0,300 L-40,120 L-240,180 L-120,40 L-300,0 L-120,-40 L-240,-180 L-40,-120 Z" fill="url(#goldGradCrownmark)" stroke="#4A3402" strokeWidth="4" />
          </g>

          {/* DIAGONAL GYROSCOPIC ORBITS */}
          {/* Back half of orbits */}
          <g transform="translate(512, 512) rotate(35)">
            <ellipse cx="0" cy="0" rx="240" ry="60" fill="none" stroke="url(#goldGradCrownmark)" strokeWidth="12" opacity="0.6" />
            <circle cx="-190" cy="-35" r="14" fill="url(#goldGradCrownmark)" />
            <circle cx="-190" cy="-35" r="6" fill="#FFFFFF" />
          </g>
          
          <g transform="translate(512, 512) rotate(-35)">
            <ellipse cx="0" cy="0" rx="240" ry="60" fill="none" stroke="url(#goldGradCrownmark)" strokeWidth="12" opacity="0.6" />
            <circle cx="190" cy="35" r="14" fill="url(#goldGradCrownmark)" />
            <circle cx="190" cy="35" r="6" fill="#FFFFFF" />
          </g>

          {/* INTERMEDIATE INTRICATE RING WITH RUNES */}
          <circle cx="512" cy="512" r="150" fill="none" stroke="url(#goldGradCrownmark)" strokeWidth="14" />
          <circle cx="512" cy="512" r="130" fill="none" stroke="#23084C" strokeWidth="4" />
          {/* Runes / notches on ring */}
          <g transform="translate(512, 512)">
            <rect x="-6" y="-155" width="12" height="10" fill="#4A3402" />
            <rect x="-6" y="145" width="12" height="10" fill="#4A3402" />
            <rect x="145" y="-6" width="10" height="12" fill="#4A3402" />
            <rect x="-155" y="-6" width="10" height="12" fill="#4A3402" />
          </g>

          {/* SUSPENDED FLOATING COSMIC CRYSTAL CORE */}
          <circle cx="512" cy="512" r="90" fill="url(#cosmicCore)" stroke="#FFFFFF" strokeWidth="3.5" filter="url(#glowCrownmark)" />
          <circle cx="512" cy="512" r="90" fill="url(#cosmicCore)" stroke="#FFFFFF" strokeWidth="3.5" />
          
          {/* Shiny Lens Highlights on Orb */}
          <ellipse cx="475" cy="475" r="22" fill="#FFFFFF" opacity="0.5" filter="url(#glowCrownmark)" />
          <circle cx="470" cy="470" r="10" fill="#FFFFFF" opacity="0.8" />
          <circle cx="550" cy="550" r="8" fill="#FFFFFF" opacity="0.2" />

          {/* FOREGROUND RING OVERLAYS FOR DEPTH */}
          <g transform="translate(512, 512) rotate(35)">
            <path d="M-240,0 A240,60 0 0,0 240,0" fill="none" stroke="url(#goldGradCrownmark)" strokeWidth="12" />
          </g>
          <g transform="translate(512, 512) rotate(-35)">
            <path d="M-240,0 A240,60 0 0,0 240,0" fill="none" stroke="url(#goldGradCrownmark)" strokeWidth="12" />
          </g>

          {/* AMETHYST ORBIT GLOW PARTICLES */}
          <circle cx="280" cy="400" r="6" fill="#E8C9FF" filter="url(#glowCrownmark)" />
          <circle cx="750" cy="620" r="8" fill="#E8C9FF" filter="url(#glowCrownmark)" />
          <circle cx="620" cy="300" r="5" fill="#E8C9FF" filter="url(#glowCrownmark)" />
        </svg>
      )
    },
    {
      id: 'vanguard_frame_weapon',
      name: 'Vanguard Weapon Frame',
      category: 'UI Slot Frame',
      filename: 'crownspire_vanguard_frame_weapon',
      description: 'A premium, empty Weapon slot frame designed for the Vanguard set. Crafted with polished white-gold borders, a violet runic backdrop, and a subtle longsword watermark.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradFrameVW" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEF" />
              <stop offset="35%" stopColor="#FAD480" />
              <stop offset="70%" stopColor="#C99427" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>
            <linearGradient id="innerGridGradVW" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E0743" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#0B021A" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#020005" stopOpacity="0.95" />
            </linearGradient>
            <filter id="glowFrameVW" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#9F5EFF" opacity="0.12" filter="url(#glowFrameVW)" />

          <rect x="212" y="212" width="600" height="600" rx="80" fill="url(#innerGridGradVW)" stroke="url(#goldGradFrameVW)" strokeWidth="6" />
          
          <polygon points="512,320 678,416 678,608 512,704 346,608 346,416" fill="none" stroke="#9C4EFF" strokeWidth="2.5" opacity="0.25" />
          <circle cx="512" cy="512" r="120" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="10, 8" opacity="0.15" />

          {/* Sword/Weapon Silhouette Watermark */}
          <g transform="translate(512, 512) rotate(45)">
            <path d="M-6,-180 L0,-210 L6,-180 L5,40 L-5,40 Z" fill="#9C4EFF" opacity="0.18" />
            <path d="M-6,-180 L0,-210 L0,40 L-5,40 Z" fill="#751FFF" opacity="0.12" />
            <path d="M-25,40 C-25,50 -10,55 0,55 C10,55 25,50 25,40 Z" fill="#9C4EFF" opacity="0.22" />
            <rect x="-4" y="55" width="8" height="40" rx="2" fill="#9C4EFF" opacity="0.18" />
            <circle cx="0" cy="100" r="6" fill="#9C4EFF" opacity="0.22" />
          </g>

          {/* Intricate Corner Moldings */}
          <g transform="translate(512, 512)">
            <path d="M-300,-150 L-300,-300 L-150,-300" fill="none" stroke="url(#goldGradFrameVW)" strokeWidth="14" strokeLinecap="round" />
            <path d="M-300,-150 L-300,-300 L-150,-300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="-320,-320 -240,-320 -320,-240" fill="url(#goldGradFrameVW)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameVW)" />
            <circle cx="-280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />
            
            <path d="M300,-150 L300,-300 L150,-300" fill="none" stroke="url(#goldGradFrameVW)" strokeWidth="14" strokeLinecap="round" />
            <path d="M300,-150 L300,-300 L150,-300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="320,-320 240,-320 320,-240" fill="url(#goldGradFrameVW)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameVW)" />
            <circle cx="280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />

            <path d="M-300,150 L-300,300 L-150,300" fill="none" stroke="url(#goldGradFrameVW)" strokeWidth="14" strokeLinecap="round" />
            <path d="M-300,150 L-300,300 L-150,300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="-320,320 -240,320 -320,240" fill="url(#goldGradFrameVW)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameVW)" />
            <circle cx="-280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />

            <path d="M300,150 L300,300 L150,300" fill="none" stroke="url(#goldGradFrameVW)" strokeWidth="14" strokeLinecap="round" />
            <path d="M300,150 L300,300 L150,300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="320,320 240,320 320,240" fill="url(#goldGradFrameVW)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameVW)" />
            <circle cx="280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />
          </g>
          <rect x="190" y="190" width="644" height="644" rx="90" fill="none" stroke="url(#goldGradFrameVW)" strokeWidth="2" opacity="0.4" />
        </svg>
      )
    },
    {
      id: 'vanguard_frame_helmet',
      name: 'Vanguard Helmet Frame',
      category: 'UI Slot Frame',
      filename: 'crownspire_vanguard_frame_helmet',
      description: 'A matching empty Helmet slot frame for the Vanguard set. Featuring an exquisite white-gold border and a majestic guardian helmet silhouette at its center.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradFrameVH" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEF" />
              <stop offset="35%" stopColor="#FAD480" />
              <stop offset="70%" stopColor="#C99427" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>
            <linearGradient id="innerGridGradVH" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E0743" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#0B021A" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#020005" stopOpacity="0.95" />
            </linearGradient>
            <filter id="glowFrameVH" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#9F5EFF" opacity="0.12" filter="url(#glowFrameVH)" />

          <rect x="212" y="212" width="600" height="600" rx="80" fill="url(#innerGridGradVH)" stroke="url(#goldGradFrameVH)" strokeWidth="6" />
          
          <polygon points="512,320 678,416 678,608 512,704 346,608 346,416" fill="none" stroke="#9C4EFF" strokeWidth="2.5" opacity="0.25" />
          <circle cx="512" cy="512" r="120" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="10, 8" opacity="0.15" />

          {/* Helmet Silhouette Watermark */}
          <g transform="translate(512, 500)">
            <path d="M0,-80 C-40,-130 -80,-110 -110,-70 C-80,-60 -50,-50 0,-40 Z" fill="#9C4EFF" opacity="0.15" />
            <path d="M-70,0 C-70,-60 -40,-80 0,-80 C40,-80 70,-60 70,0 L65,50 L-65,50 Z" fill="#9C4EFF" opacity="0.18" />
            <path d="M-65,30 L-90,80 L-60,95 L-50,50 Z" fill="#9C4EFF" opacity="0.22" />
            <path d="M65,30 L90,80 L60,95 L50,50 Z" fill="#9C4EFF" opacity="0.22" />
            <path d="M0,-10 L10,60 L0,90 L-10,60 Z" fill="#751FFF" opacity="0.2" />
            <path d="M-50,-10 Q0,-30 50,-10 L45,10 Q0,-10 -45,10 Z" fill="#1C053B" opacity="0.3" />
          </g>

          {/* Intricate Corner Moldings */}
          <g transform="translate(512, 512)">
            <path d="M-300,-150 L-300,-300 L-150,-300" fill="none" stroke="url(#goldGradFrameVH)" strokeWidth="14" strokeLinecap="round" />
            <path d="M-300,-150 L-300,-300 L-150,-300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="-320,-320 -240,-320 -320,-240" fill="url(#goldGradFrameVH)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameVH)" />
            <circle cx="-280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />
            
            <path d="M300,-150 L300,-300 L150,-300" fill="none" stroke="url(#goldGradFrameVH)" strokeWidth="14" strokeLinecap="round" />
            <path d="M300,-150 L300,-300 L150,-300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="320,-320 240,-320 320,-240" fill="url(#goldGradFrameVH)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameVH)" />
            <circle cx="280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />

            <path d="M-300,150 L-300,300 L-150,300" fill="none" stroke="url(#goldGradFrameVH)" strokeWidth="14" strokeLinecap="round" />
            <path d="M-300,150 L-300,300 L-150,300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="-320,320 -240,320 -320,240" fill="url(#goldGradFrameVH)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameVH)" />
            <circle cx="-280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />

            <path d="M300,150 L300,300 L150,300" fill="none" stroke="url(#goldGradFrameVH)" strokeWidth="14" strokeLinecap="round" />
            <path d="M300,150 L300,300 L150,300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="320,320 240,320 320,240" fill="url(#goldGradFrameVH)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameVH)" />
            <circle cx="280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />
          </g>
          <rect x="190" y="190" width="644" height="644" rx="90" fill="none" stroke="url(#goldGradFrameVH)" strokeWidth="2" opacity="0.4" />
        </svg>
      )
    },
    {
      id: 'vanguard_frame_chest',
      name: 'Vanguard Chest Frame',
      category: 'UI Slot Frame',
      filename: 'crownspire_vanguard_frame_chest',
      description: 'A matching empty Chest Armor slot frame for the Vanguard set. Boasts beautiful royal purple and golden moldings around a faint plate-mail silhouette.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradFrameVC" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEF" />
              <stop offset="35%" stopColor="#FAD480" />
              <stop offset="70%" stopColor="#C99427" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>
            <linearGradient id="innerGridGradVC" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E0743" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#0B021A" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#020005" stopOpacity="0.95" />
            </linearGradient>
            <filter id="glowFrameVC" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#9F5EFF" opacity="0.12" filter="url(#glowFrameVC)" />

          <rect x="212" y="212" width="600" height="600" rx="80" fill="url(#innerGridGradVC)" stroke="url(#goldGradFrameVC)" strokeWidth="6" />
          
          <polygon points="512,320 678,416 678,608 512,704 346,608 346,416" fill="none" stroke="#9C4EFF" strokeWidth="2.5" opacity="0.25" />
          <circle cx="512" cy="512" r="120" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="10, 8" opacity="0.15" />

          {/* Chest Armor Silhouette Watermark */}
          <g transform="translate(512, 512)">
            <path d="M-100,-40 C-100,-90 -50,-90 -30,-50 C-40,-20 -60,0 -100,-20 Z" fill="#9C4EFF" opacity="0.18" />
            <path d="M100,-40 C100,-90 50,-90 30,-50 C40,-20 60,0 100,-20 Z" fill="#9C4EFF" opacity="0.18" />
            <path d="M-60,-40 L60,-40 L50,80 L0,110 L-50,80 Z" fill="#9C4EFF" opacity="0.15" />
            <path d="M-40,0 Q0,20 40,0" fill="none" stroke="#9C4EFF" strokeWidth="4" opacity="0.25" />
            <path d="M-35,40 Q0,60 35,40" fill="none" stroke="#9C4EFF" strokeWidth="4" opacity="0.2" />
            <polygon points="0,-15 20,5 0,25 -20,5" fill="#751FFF" opacity="0.3" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>

          {/* Intricate Corner Moldings */}
          <g transform="translate(512, 512)">
            <path d="M-300,-150 L-300,-300 L-150,-300" fill="none" stroke="url(#goldGradFrameVC)" strokeWidth="14" strokeLinecap="round" />
            <path d="M-300,-150 L-300,-300 L-150,-300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="-320,-320 -240,-320 -320,-240" fill="url(#goldGradFrameVC)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameVC)" />
            <circle cx="-280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />
            
            <path d="M300,-150 L300,-300 L150,-300" fill="none" stroke="url(#goldGradFrameVC)" strokeWidth="14" strokeLinecap="round" />
            <path d="M300,-150 L300,-300 L150,-300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="320,-320 240,-320 320,-240" fill="url(#goldGradFrameVC)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameVC)" />
            <circle cx="280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />

            <path d="M-300,150 L-300,300 L-150,300" fill="none" stroke="url(#goldGradFrameVC)" strokeWidth="14" strokeLinecap="round" />
            <path d="M-300,150 L-300,300 L-150,300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="-320,320 -240,320 -320,240" fill="url(#goldGradFrameVC)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameVC)" />
            <circle cx="-280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />

            <path d="M300,150 L300,300 L150,300" fill="none" stroke="url(#goldGradFrameVC)" strokeWidth="14" strokeLinecap="round" />
            <path d="M300,150 L300,300 L150,300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="320,320 240,320 320,240" fill="url(#goldGradFrameVC)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameVC)" />
            <circle cx="280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />
          </g>
          <rect x="190" y="190" width="644" height="644" rx="90" fill="none" stroke="url(#goldGradFrameVC)" strokeWidth="2" opacity="0.4" />
        </svg>
      )
    },
    {
      id: 'vanguard_frame_gauntlets',
      name: 'Vanguard Gauntlets Frame',
      category: 'UI Slot Frame',
      filename: 'crownspire_vanguard_frame_gauntlets',
      description: 'A matching empty Gauntlets slot frame for the Vanguard set. Framed with premium crystal-infused borders and an elegant glove emblem watermark.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradFrameVGau" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEF" />
              <stop offset="35%" stopColor="#FAD480" />
              <stop offset="70%" stopColor="#C99427" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>
            <linearGradient id="innerGridGradVGau" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E0743" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#0B021A" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#020005" stopOpacity="0.95" />
            </linearGradient>
            <filter id="glowFrameVGau" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#9F5EFF" opacity="0.12" filter="url(#glowFrameVGau)" />

          <rect x="212" y="212" width="600" height="600" rx="80" fill="url(#innerGridGradVGau)" stroke="url(#goldGradFrameVGau)" strokeWidth="6" />
          
          <polygon points="512,320 678,416 678,608 512,704 346,608 346,416" fill="none" stroke="#9C4EFF" strokeWidth="2.5" opacity="0.25" />
          <circle cx="512" cy="512" r="120" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="10, 8" opacity="0.15" />

          {/* Gauntlets Silhouette Watermark */}
          <g transform="translate(512, 512)">
            <g transform="translate(-45, 0) rotate(-15)">
              <path d="M-20,60 L20,60 L25,10 L-25,10 Z" fill="#9C4EFF" opacity="0.15" />
              <path d="M-25,10 L25,10 L20,-30 L-20,-30 Z" fill="#9C4EFF" opacity="0.2" />
              <rect x="-16" y="-50" width="6" height="18" rx="1" fill="#9C4EFF" opacity="0.18" />
              <rect x="-8" y="-55" width="6" height="22" rx="1" fill="#9C4EFF" opacity="0.18" />
              <rect x="0" y="-53" width="6" height="20" rx="1" fill="#9C4EFF" opacity="0.18" />
              <rect x="8" y="-46" width="6" height="14" rx="1" fill="#9C4EFF" opacity="0.18" />
            </g>
            <g transform="translate(45, 0) rotate(15) scale(-1, 1)">
              <path d="M-20,60 L20,60 L25,10 L-25,10 Z" fill="#9C4EFF" opacity="0.15" />
              <path d="M-25,10 L25,10 L20,-30 L-20,-30 Z" fill="#9C4EFF" opacity="0.2" />
              <rect x="-16" y="-50" width="6" height="18" rx="1" fill="#9C4EFF" opacity="0.18" />
              <rect x="-8" y="-55" width="6" height="22" rx="1" fill="#9C4EFF" opacity="0.18" />
              <rect x="0" y="-53" width="6" height="20" rx="1" fill="#9C4EFF" opacity="0.18" />
              <rect x="8" y="-46" width="6" height="14" rx="1" fill="#9C4EFF" opacity="0.18" />
            </g>
          </g>

          {/* Intricate Corner Moldings */}
          <g transform="translate(512, 512)">
            <path d="M-300,-150 L-300,-300 L-150,-300" fill="none" stroke="url(#goldGradFrameVGau)" strokeWidth="14" strokeLinecap="round" />
            <path d="M-300,-150 L-300,-300 L-150,-300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="-320,-320 -240,-320 -320,-240" fill="url(#goldGradFrameVGau)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameVGau)" />
            <circle cx="-280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />
            
            <path d="M300,-150 L300,-300 L150,-300" fill="none" stroke="url(#goldGradFrameVGau)" strokeWidth="14" strokeLinecap="round" />
            <path d="M300,-150 L300,-300 L150,-300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="320,-320 240,-320 320,-240" fill="url(#goldGradFrameVGau)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameVGau)" />
            <circle cx="280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />

            <path d="M-300,150 L-300,300 L-150,300" fill="none" stroke="url(#goldGradFrameVGau)" strokeWidth="14" strokeLinecap="round" />
            <path d="M-300,150 L-300,300 L-150,300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="-320,320 -240,320 -320,240" fill="url(#goldGradFrameVGau)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameVGau)" />
            <circle cx="-280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />

            <path d="M300,150 L300,300 L150,300" fill="none" stroke="url(#goldGradFrameVGau)" strokeWidth="14" strokeLinecap="round" />
            <path d="M300,150 L300,300 L150,300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="320,320 240,320 320,240" fill="url(#goldGradFrameVGau)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameVGau)" />
            <circle cx="280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />
          </g>
          <rect x="190" y="190" width="644" height="644" rx="90" fill="none" stroke="url(#goldGradFrameVGau)" strokeWidth="2" opacity="0.4" />
        </svg>
      )
    },
    {
      id: 'vanguard_frame_boots',
      name: 'Vanguard Boots Frame',
      category: 'UI Slot Frame',
      filename: 'crownspire_vanguard_frame_boots',
      description: 'A matching empty Boots slot frame for the Vanguard set. Adorned with white-gold trim accents and a subtle combat-boots outline in the center.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradFrameVBoo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEF" />
              <stop offset="35%" stopColor="#FAD480" />
              <stop offset="70%" stopColor="#C99427" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>
            <linearGradient id="innerGridGradVBoo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E0743" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#0B021A" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#020005" stopOpacity="0.95" />
            </linearGradient>
            <filter id="glowFrameVBoo" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#9F5EFF" opacity="0.12" filter="url(#glowFrameVBoo)" />

          <rect x="212" y="212" width="600" height="600" rx="80" fill="url(#innerGridGradVBoo)" stroke="url(#goldGradFrameVBoo)" strokeWidth="6" />
          
          <polygon points="512,320 678,416 678,608 512,704 346,608 346,416" fill="none" stroke="#9C4EFF" strokeWidth="2.5" opacity="0.25" />
          <circle cx="512" cy="512" r="120" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="10, 8" opacity="0.15" />

          {/* Boots Silhouette Watermark */}
          <g transform="translate(512, 512)">
            <g transform="translate(-45, 0)">
              <path d="M-15,-60 L15,-60 L12,20 L-12,20 Z" fill="#9C4EFF" opacity="0.15" stroke="#9C4EFF" strokeWidth="2" />
              <path d="M-18,-60 L18,-60 L14,-85 L0,-95 L-14,-85 Z" fill="#9C4EFF" opacity="0.22" />
              <circle cx="0" cy="25" r="8" fill="#9C4EFF" opacity="0.25" />
              <path d="M-10,28 L10,28 L22,55 Q5,65 -12,55 Z" fill="#9C4EFF" opacity="0.2" />
            </g>
            <g transform="translate(45, 0) scale(-1, 1)">
              <path d="M-15,-60 L15,-60 L12,20 L-12,20 Z" fill="#9C4EFF" opacity="0.15" stroke="#9C4EFF" strokeWidth="2" />
              <path d="M-18,-60 L18,-60 L14,-85 L0,-95 L-14,-85 Z" fill="#9C4EFF" opacity="0.22" />
              <circle cx="0" cy="25" r="8" fill="#9C4EFF" opacity="0.25" />
              <path d="M-10,28 L10,28 L22,55 Q5,65 -12,55 Z" fill="#9C4EFF" opacity="0.2" />
            </g>
          </g>

          {/* Intricate Corner Moldings */}
          <g transform="translate(512, 512)">
            <path d="M-300,-150 L-300,-300 L-150,-300" fill="none" stroke="url(#goldGradFrameVBoo)" strokeWidth="14" strokeLinecap="round" />
            <path d="M-300,-150 L-300,-300 L-150,-300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="-320,-320 -240,-320 -320,-240" fill="url(#goldGradFrameVBoo)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameVBoo)" />
            <circle cx="-280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />
            
            <path d="M300,-150 L300,-300 L150,-300" fill="none" stroke="url(#goldGradFrameVBoo)" strokeWidth="14" strokeLinecap="round" />
            <path d="M300,-150 L300,-300 L150,-300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="320,-320 240,-320 320,-240" fill="url(#goldGradFrameVBoo)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameVBoo)" />
            <circle cx="280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />

            <path d="M-300,150 L-300,300 L-150,300" fill="none" stroke="url(#goldGradFrameVBoo)" strokeWidth="14" strokeLinecap="round" />
            <path d="M-300,150 L-300,300 L-150,300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="-320,320 -240,320 -320,240" fill="url(#goldGradFrameVBoo)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameVBoo)" />
            <circle cx="-280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />

            <path d="M300,150 L300,300 L150,300" fill="none" stroke="url(#goldGradFrameVBoo)" strokeWidth="14" strokeLinecap="round" />
            <path d="M300,150 L300,300 L150,300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="320,320 240,320 320,240" fill="url(#goldGradFrameVBoo)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameVBoo)" />
            <circle cx="280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />
          </g>
          <rect x="190" y="190" width="644" height="644" rx="90" fill="none" stroke="url(#goldGradFrameVBoo)" strokeWidth="2" opacity="0.4" />
        </svg>
      )
    },
    {
      id: 'vanguard_frame_crownmark',
      name: 'Vanguard Crownmark Frame',
      category: 'UI Slot Frame',
      filename: 'crownspire_vanguard_frame_crownmark',
      description: 'A matching empty Crownmark slot frame for the Vanguard set. Hand-painted with revolving celestial orbits and a mystical runic core watermark.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradFrameVRel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEF" />
              <stop offset="35%" stopColor="#FAD480" />
              <stop offset="70%" stopColor="#C99427" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>
            <linearGradient id="innerGridGradVRel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E0743" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#0B021A" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#020005" stopOpacity="0.95" />
            </linearGradient>
            <filter id="glowFrameVRel" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#9F5EFF" opacity="0.12" filter="url(#glowFrameVRel)" />

          <rect x="212" y="212" width="600" height="600" rx="80" fill="url(#innerGridGradVRel)" stroke="url(#goldGradFrameVRel)" strokeWidth="6" />
          
          <polygon points="512,320 678,416 678,608 512,704 346,608 346,416" fill="none" stroke="#9C4EFF" strokeWidth="2.5" opacity="0.25" />
          <circle cx="512" cy="512" r="120" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="10, 8" opacity="0.15" />

          {/* Crownmark Silhouette Watermark */}
          <g transform="translate(512, 512)">
            <ellipse cx="0" cy="0" rx="80" ry="20" fill="none" stroke="#9C4EFF" strokeWidth="4" opacity="0.22" transform="rotate(35)" />
            <ellipse cx="0" cy="0" rx="80" ry="20" fill="none" stroke="#9C4EFF" strokeWidth="4" opacity="0.22" transform="rotate(-35)" />
            <circle cx="0" cy="0" r="30" fill="#751FFF" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.25" />
            <polygon points="0,-95 12,-45 -12,-45" fill="#9C4EFF" opacity="0.2" />
            <polygon points="0,95 12,45 -12,45" fill="#9C4EFF" opacity="0.2" />
            <polygon points="-95,0 -45,-12 -45,12" fill="#9C4EFF" opacity="0.2" />
            <polygon points="95,0 45,-12 45,12" fill="#9C4EFF" opacity="0.2" />
          </g>

          {/* Intricate Corner Moldings */}
          <g transform="translate(512, 512)">
            <path d="M-300,-150 L-300,-300 L-150,-300" fill="none" stroke="url(#goldGradFrameVRel)" strokeWidth="14" strokeLinecap="round" />
            <path d="M-300,-150 L-300,-300 L-150,-300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="-320,-320 -240,-320 -320,-240" fill="url(#goldGradFrameVRel)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameVRel)" />
            <circle cx="-280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />
            
            <path d="M300,-150 L300,-300 L150,-300" fill="none" stroke="url(#goldGradFrameVRel)" strokeWidth="14" strokeLinecap="round" />
            <path d="M300,-150 L300,-300 L150,-300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="320,-320 240,-320 320,-240" fill="url(#goldGradFrameVRel)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameVRel)" />
            <circle cx="280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />

            <path d="M-300,150 L-300,300 L-150,300" fill="none" stroke="url(#goldGradFrameVRel)" strokeWidth="14" strokeLinecap="round" />
            <path d="M-300,150 L-300,300 L-150,300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="-320,320 -240,320 -320,240" fill="url(#goldGradFrameVRel)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameVRel)" />
            <circle cx="-280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />

            <path d="M300,150 L300,300 L150,300" fill="none" stroke="url(#goldGradFrameVRel)" strokeWidth="14" strokeLinecap="round" />
            <path d="M300,150 L300,300 L150,300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="320,320 240,320 320,240" fill="url(#goldGradFrameVRel)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameVRel)" />
            <circle cx="280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />
          </g>
          <rect x="190" y="190" width="644" height="644" rx="90" fill="none" stroke="url(#goldGradFrameVRel)" strokeWidth="2" opacity="0.4" />
        </svg>
      )
    },
    {
      id: 'royal_crown',

      setId: 'royal_regalia',
      name: 'Royal Crown',
      category: 'Headwear',
      filename: 'crownspire_royal_crown',
      description: 'A gorgeous sovereign crown of heavy white-gold. Plated with intricate filigree arches, supporting floating purple violet crystal shards and a giant central diamond crystal element.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldCrown" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEF" />
              <stop offset="30%" stopColor="#FAD480" />
              <stop offset="75%" stopColor="#C99427" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>
            <linearGradient id="velvetCrown" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6317B8" />
              <stop offset="100%" stopColor="#250550" />
            </linearGradient>
            <filter id="glowCrown" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="24" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="320" fill="#913BFF" opacity="0.16" filter="url(#glowCrown)" />
          
          {/* Velvet Cap Inside Crown */}
          <path d="M260,560 C260,340 340,300 512,300 C684,300 764,340 764,560 Z" fill="url(#velvetCrown)" stroke="#4A3402" strokeWidth="3" />
          
          {/* Back Arches */}
          <path d="M320,400 Q512,240 704,400" fill="none" stroke="url(#goldCrown)" strokeWidth="14" />
          <path d="M512,300 L512,560" stroke="url(#goldCrown)" strokeWidth="10" opacity="0.5" />

          {/* Crown Base Band */}
          <path d="M220,580 Q512,510 804,580 L780,680 Q512,610 244,680 Z" fill="url(#goldCrown)" stroke="#4A3402" strokeWidth="5.5" />
          
          {/* Gemstones on Band */}
          <g transform="translate(0, -5)">
            <circle cx="310" cy="625" r="14" fill="#A146FF" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="512" cy="600" r="18" fill="#A146FF" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="714" cy="625" r="14" fill="#A146FF" stroke="#FFFFFF" strokeWidth="1.5" />
            <rect x="400" y="598" width="16" height="16" rx="4" fill="#FFD700" transform="rotate(45, 408, 606)" />
            <rect x="610" y="612" width="16" height="16" rx="4" fill="#FFD700" transform="rotate(45, 618, 620)" />
          </g>

          {/* Front Golden Spikes */}
          <path d="M260,560 L240,400 L320,480 L360,560 Z" fill="url(#goldCrown)" stroke="#4A3402" strokeWidth="3" />
          <circle cx="240" cy="400" r="10" fill="#ECA8FF" stroke="#FFFFFF" strokeWidth="1.5" />

          <path d="M764,560 L784,400 L704,480 L664,560 Z" fill="url(#goldCrown)" stroke="#4A3402" strokeWidth="3" />
          <circle cx="784" cy="400" r="10" fill="#ECA8FF" stroke="#FFFFFF" strokeWidth="1.5" />

          <path d="M512,530 L450,420 C420,320 480,260 512,200 C544,260 604,320 574,420 Z" fill="url(#goldCrown)" stroke="#4A3402" strokeWidth="4.5" />
          <circle cx="512" cy="200" r="15" fill="#FFFFFF" filter="url(#glowCrown)" />
          <circle cx="512" cy="200" r="8" fill="#FFFFFF" />

          {/* Large Central Amethyst Gem */}
          <g transform="translate(512, 420)" filter="url(#glowCrown)">
            <polygon points="0,-60 45,0 0,60 -45,0" fill="#B359FF" stroke="#FFFFFF" strokeWidth="2.5" />
          </g>
          <g transform="translate(512, 420)">
            <polygon points="0,-60 45,0 0,60 -45,0" fill="#B359FF" stroke="#FFFFFF" strokeWidth="2.5" />
            <polygon points="0,-60 0,60 45,0" fill="#FFFFFF" opacity="0.15" />
          </g>
        </svg>
      )
    },
    {
      id: 'royal_cloak',
      setId: 'royal_regalia',
      name: 'Royal Cloak',
      category: 'Cloaks',
      filename: 'crownspire_royal_cloak',
      description: 'An elegant, flowing ceremonial cape of royal purple velvet, with thick white-gold shoulder guards, embroidered runic gold borders, and floating crystal beads.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldCloak" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEF" />
              <stop offset="35%" stopColor="#FAD480" />
              <stop offset="70%" stopColor="#C99427" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>
            <linearGradient id="velvetCloak" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4A059C" />
              <stop offset="50%" stopColor="#7B29EC" />
              <stop offset="100%" stopColor="#2E0264" />
            </linearGradient>
            <filter id="glowCloak" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="320" fill="#913BFF" opacity="0.15" filter="url(#glowCloak)" />
          
          {/* The Flowing Cape Fabric */}
          <path d="M430,300 C300,320 200,480 180,820 C320,880 512,850 512,850 C512,850 704,880 844,820 C824,480 724,320 594,300 Z" fill="url(#velvetCloak)" stroke="#23044C" strokeWidth="5" />
          
          {/* Folding creases for 3D depth */}
          <path d="M430,300 C380,440 320,620 260,830" fill="none" stroke="#250250" strokeWidth="12" opacity="0.6" />
          <path d="M594,300 C644,440 704,620 764,830" fill="none" stroke="#250250" strokeWidth="12" opacity="0.6" />
          <path d="M512,300 C512,450 512,650 512,850" fill="none" stroke="#A86BFF" strokeWidth="6" opacity="0.25" />

          {/* Golden Runic Embroidery at Hemline */}
          <path d="M180,820 Q512,770 844,820" fill="none" stroke="url(#goldCloak)" strokeWidth="10" strokeLinecap="round" />
          <path d="M220,808 C350,770 420,790 512,790 C604,790 674,770 804,808" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.4" />

          {/* Heavy White-Gold Sovereign Collar / Epaulets */}
          <g transform="translate(512, 300)">
            {/* Left shoulder shield */}
            <path d="M-180,40 C-180,-60 -100,-100 -50,-50 C-60,10 -110,60 -180,40 Z" fill="url(#goldCloak)" stroke="#4A3402" strokeWidth="4" />
            <circle cx="-110" cy="-20" r="10" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="1" />
            
            {/* Right shoulder shield */}
            <path d="M180,40 C180,-60 100,-100 50,-50 C60,10 110,60 180,40 Z" fill="url(#goldCloak)" stroke="#4A3402" strokeWidth="4" />
            <circle cx="110" cy="-20" r="10" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="1" />

            {/* Central clasp chain */}
            <path d="M-50,-20 Q0,-40 50,-20" fill="none" stroke="url(#goldCloak)" strokeWidth="8" />
            <path d="M-50,-20 Q0,-40 50,-20" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.4" />
            
            {/* Center Royal Brooch */}
            <rect x="-30" y="-50" width="60" height="60" rx="15" fill="url(#goldCloak)" stroke="#4A3402" strokeWidth="3" />
            <polygon points="0,-40 25,0 0,40 -25,0" fill="#9C4EFF" filter="url(#glowCloak)" />
            <polygon points="0,-40 25,0 0,40 -25,0" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="1.5" />
            <circle cx="0" cy="0" r="6" fill="#FFFFFF" />
          </g>
        </svg>
      )
    },
    {
      id: 'sovereign_armor',
      setId: 'royal_regalia',
      name: 'Sovereign Armor',
      category: 'Chest Armor',
      filename: 'crownspire_sovereign_armor',
      description: 'An exquisite breastplate forged of polished white-gold and purple crystal panels, with majestic crown accents, wing-like pauldrons, and a glowing amethyst heart reactor.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradArmor" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEF" />
              <stop offset="35%" stopColor="#FAD480" />
              <stop offset="70%" stopColor="#C99427" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>
            <linearGradient id="plateGradArmor" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#310E64" />
              <stop offset="100%" stopColor="#150232" />
            </linearGradient>
            <filter id="glowArmor" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="320" fill="#913BFF" opacity="0.14" filter="url(#glowArmor)" />

          {/* Pauldrons (Shoulder Guards) */}
          <g transform="translate(512, 450)">
            {/* Left Wing Pauldron */}
            <path d="M-220,-160 C-360,-120 -380,20 -240,60 C-220,10 -180,-60 -220,-160 Z" fill="url(#goldGradArmor)" stroke="#4A3402" strokeWidth="4.5" />
            <path d="M-240,-130 C-320,-100 -330,0 -240,20" fill="none" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.3" />
            {/* Right Wing Pauldron */}
            <path d="M220,-160 C360,-120 380,20 240,60 C220,10 180,-60 220,-160 Z" fill="url(#goldGradArmor)" stroke="#4A3402" strokeWidth="4.5" />
            <path d="M240,-130 C320,-100 330,0 240,20" fill="none" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.3" />
          </g>

          {/* Main Chest Armor Body */}
          <path d="M340,360 L684,360 L634,740 L512,840 L390,740 Z" fill="url(#plateGradArmor)" stroke="url(#goldGradArmor)" strokeWidth="8" />

          {/* Abdominal Grille Plate Layers */}
          <path d="M380,560 Q512,500 644,560" fill="none" stroke="url(#goldGradArmor)" strokeWidth="6" />
          <path d="M394,640 Q512,580 630,640" fill="none" stroke="url(#goldGradArmor)" strokeWidth="6" />
          <path d="M410,720 Q512,660 614,720" fill="none" stroke="url(#goldGradArmor)" strokeWidth="6" />

          {/* Golden Royal Crest at Collar */}
          <g transform="translate(512, 400)">
            <path d="M-130,-40 L130,-40 L110,60 L-110,60 Z" fill="url(#goldGradArmor)" stroke="#4A3402" strokeWidth="4" />
            <polygon points="-60,30 60,30 80,-10 0,10 -80,-10" fill="#250C47" />
          </g>

          {/* Glowing Amethyst Heart Reactor Core */}
          <g transform="translate(512, 460)" filter="url(#glowArmor)">
            <polygon points="0,-45 35,0 0,45 -35,0" fill="#ECA8FF" />
            <polygon points="0,-45 35,0 0,45 -35,0" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2.5" />
          </g>
          <g transform="translate(512, 460)">
            <circle cx="0" cy="0" r="12" fill="#FFFFFF" />
          </g>

          {/* Side Flank Rivets */}
          <circle cx="370" cy="440" r="10" fill="url(#goldGradArmor)" stroke="#4A3402" strokeWidth="2" />
          <circle cx="654" cy="440" r="10" fill="url(#goldGradArmor)" stroke="#4A3402" strokeWidth="2" />
          <circle cx="380" cy="520" r="10" fill="url(#goldGradArmor)" stroke="#4A3402" strokeWidth="2" />
          <circle cx="644" cy="520" r="10" fill="url(#goldGradArmor)" stroke="#4A3402" strokeWidth="2" />
        </svg>
      )
    },
    {
      id: 'royal_gauntlets',
      setId: 'royal_regalia',
      name: 'Royal Gauntlets',
      category: 'Gauntlets',
      filename: 'crownspire_royal_gauntlets',
      description: 'Sovereign combat gauntlets with intricate gold plate finger articulations, golden wing braces, and embedded brilliant-cut purple crystal gems.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradGaunt" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEF" />
              <stop offset="35%" stopColor="#FAD480" />
              <stop offset="70%" stopColor="#C99427" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>
            <linearGradient id="metalGradGaunt" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#250A49" />
              <stop offset="100%" stopColor="#120325" />
            </linearGradient>
            <filter id="glowGaunt" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#9F5EFF" opacity="0.14" filter="url(#glowGaunt)" />

          {/* Left Gauntlet */}
          <g transform="translate(340, 512) rotate(-10)">
            <path d="M-80,180 L80,180 L110,60 L-110,60 Z" fill="url(#metalGradGaunt)" stroke="url(#goldGradGaunt)" strokeWidth="5.5" />
            <path d="M-110,60 L110,60 L70,-100 L-70,-100 Z" fill="url(#metalGradGaunt)" stroke="url(#goldGradGaunt)" strokeWidth="4.5" />
            <path d="M-110,60 C-150,0 -120,-60 -70,-100" fill="none" stroke="url(#goldGradGaunt)" strokeWidth="3" />
            <ellipse cx="0" cy="-20" rx="20" ry="28" fill="url(#goldGradGaunt)" stroke="#4A3402" strokeWidth="2" />
            <ellipse cx="0" cy="-20" rx="14" ry="22" fill="#9C4EFF" filter="url(#glowGaunt)" />
            <ellipse cx="0" cy="-20" rx="14" ry="22" fill="#9C4EFF" />
            <circle cx="-5" cy="-25" r="5" fill="#FFFFFF" opacity="0.7" />
            <path d="M-60,-100 L60,-100 L50,-150 L-50,-150 Z" fill="url(#goldGradGaunt)" stroke="#4A3402" strokeWidth="3" />
            <g transform="translate(0, -150)">
              <rect x="-45" y="-60" width="18" height="60" rx="8" fill="url(#goldGradGaunt)" stroke="#4A3402" strokeWidth="2" />
              <rect x="-22" y="-70" width="18" height="70" rx="8" fill="url(#goldGradGaunt)" stroke="#4A3402" strokeWidth="2" />
              <rect x="1" y="-68" width="18" height="68" rx="8" fill="url(#goldGradGaunt)" stroke="#4A3402" strokeWidth="2" />
              <rect x="24" y="-55" width="18" height="55" rx="8" fill="url(#goldGradGaunt)" stroke="#4A3402" strokeWidth="2" />
            </g>
          </g>

          {/* Right Gauntlet */}
          <g transform="translate(684, 512) rotate(10) scale(-1, 1)">
            <path d="M-80,180 L80,180 L110,60 L-110,60 Z" fill="url(#metalGradGaunt)" stroke="url(#goldGradGaunt)" strokeWidth="5.5" />
            <path d="M-110,60 L110,60 L70,-100 L-70,-100 Z" fill="url(#metalGradGaunt)" stroke="url(#goldGradGaunt)" strokeWidth="4.5" />
            <path d="M-110,60 C-150,0 -120,-60 -70,-100" fill="none" stroke="url(#goldGradGaunt)" strokeWidth="3" />
            <ellipse cx="0" cy="-20" rx="20" ry="28" fill="url(#goldGradGaunt)" stroke="#4A3402" strokeWidth="2" />
            <ellipse cx="0" cy="-20" rx="14" ry="22" fill="#9C4EFF" filter="url(#glowGaunt)" />
            <ellipse cx="0" cy="-20" rx="14" ry="22" fill="#9C4EFF" />
            <circle cx="-5" cy="-25" r="5" fill="#FFFFFF" opacity="0.7" />
            <path d="M-60,-100 L60,-100 L50,-150 L-50,-150 Z" fill="url(#goldGradGaunt)" stroke="#4A3402" strokeWidth="3" />
            <g transform="translate(0, -150)">
              <rect x="-45" y="-60" width="18" height="60" rx="8" fill="url(#goldGradGaunt)" stroke="#4A3402" strokeWidth="2" />
              <rect x="-22" y="-70" width="18" height="70" rx="8" fill="url(#goldGradGaunt)" stroke="#4A3402" strokeWidth="2" />
              <rect x="1" y="-68" width="18" height="68" rx="8" fill="url(#goldGradGaunt)" stroke="#4A3402" strokeWidth="2" />
              <rect x="24" y="-55" width="18" height="55" rx="8" fill="url(#goldGradGaunt)" stroke="#4A3402" strokeWidth="2" />
            </g>
          </g>
        </svg>
      )
    },
    {
      id: 'royal_boots_regalia',
      setId: 'royal_regalia',
      name: 'Royal Boots',
      category: 'Boots',
      filename: 'crownspire_royal_boots',
      description: 'Ornate battle boots featuring heavy white-gold greaves, protective golden crown spikes, velvet interior folds, and crystal-studded toe caps.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradBoots" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEF" />
              <stop offset="35%" stopColor="#FAD480" />
              <stop offset="70%" stopColor="#C99427" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>
            <linearGradient id="velvetGradBoots" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#310E64" />
              <stop offset="100%" stopColor="#150232" />
            </linearGradient>
            <filter id="glowBoots" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#9F5EFF" opacity="0.14" filter="url(#glowBoots)" />

          {/* Left Boot */}
          <g transform="translate(350, 512) rotate(-6)">
            <path d="M-60,-220 L60,-220 L45,20 L-45,20 Z" fill="url(#velvetGradBoots)" stroke="url(#goldGradBoots)" strokeWidth="5.5" />
            <path d="M0,-220 L0,20" stroke="url(#goldGradBoots)" strokeWidth="3" opacity="0.4" />
            <polygon points="0,-160 -25,-120 25,-120" fill="url(#goldGradBoots)" stroke="#4A3402" strokeWidth="2" />
            <path d="M-75,-215 C-40,-250 40,-250 75,-215 L50,-185 L-50,-185 Z" fill="url(#goldGradBoots)" stroke="#4A3402" strokeWidth="3" />
            <circle cx="0" cy="-240" r="10" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="1" />
            <path d="M-45,20 L45,20 L75,130 L-65,130 Z" fill="url(#goldGradBoots)" stroke="#4A3402" strokeWidth="4.5" />
            <path d="M-75,130 L-90,165 L75,165 L85,130 Z" fill="#1C0D32" stroke="url(#goldGradBoots)" strokeWidth="3.5" />
            <polygon points="45,130 75,130 60,105" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>

          {/* Right Boot */}
          <g transform="translate(674, 512) rotate(6) scale(-1, 1)">
            <path d="M-60,-220 L60,-220 L45,20 L-45,20 Z" fill="url(#velvetGradBoots)" stroke="url(#goldGradBoots)" strokeWidth="5.5" />
            <path d="M0,-220 L0,20" stroke="url(#goldGradBoots)" strokeWidth="3" opacity="0.4" />
            <polygon points="0,-160 -25,-120 25,-120" fill="url(#goldGradBoots)" stroke="#4A3402" strokeWidth="2" />
            <path d="M-75,-215 C-40,-250 40,-250 75,-215 L50,-185 L-50,-185 Z" fill="url(#goldGradBoots)" stroke="#4A3402" strokeWidth="3" />
            <circle cx="0" cy="-240" r="10" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="1" />
            <path d="M-45,20 L45,20 L75,130 L-65,130 Z" fill="url(#goldGradBoots)" stroke="#4A3402" strokeWidth="4.5" />
            <path d="M-75,130 L-90,165 L75,165 L85,130 Z" fill="#1C0D32" stroke="url(#goldGradBoots)" strokeWidth="3.5" />
            <polygon points="45,130 75,130 60,105" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>
        </svg>
      )
    },
    {
      id: 'crownspire_scepter',
      setId: 'royal_regalia',
      name: 'Crownspire Scepter',
      category: 'Weapons',
      filename: 'crownspire_royal_scepter',
      description: 'A legendary royal scepter of white-gold, with a beautifully sculpted crown top holding a massive glowing crystal sphere in a ring of floating energy orbits.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradScep" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEF" />
              <stop offset="35%" stopColor="#FAD480" />
              <stop offset="70%" stopColor="#C99427" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>
            <linearGradient id="crystalGradScep" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ECC8FF" />
              <stop offset="55%" stopColor="#8E3CFF" />
              <stop offset="100%" stopColor="#1E004B" />
            </linearGradient>
            <filter id="glowScep" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#9F5EFF" opacity="0.16" filter="url(#glowScep)" />

          {/* Scepter Staff Rod */}
          <g transform="translate(512, 512) rotate(35)">
            <rect x="-14" y="-300" width="28" height="600" rx="14" fill="#2D114F" stroke="url(#goldGradScep)" strokeWidth="5.5" />
            <path d="M-14,-150 L14,-140 M-14,-50 L14,-40 M-14,50 L14,60 M-14,150 L14,160" stroke="url(#goldGradScep)" strokeWidth="3.5" />
            
            <g transform="translate(0, 300)">
              <circle cx="0" cy="0" r="32" fill="url(#goldGradScep)" stroke="#4A3402" strokeWidth="4.5" />
              <polygon points="0,0 -12,25 12,25" fill="#8E3CFF" />
            </g>

            <g transform="translate(0, -320)">
              <rect x="-35" y="-10" width="70" height="40" rx="5" fill="url(#goldGradScep)" stroke="#4A3402" strokeWidth="4" />
              <path d="M-30,0 C-110,-20 -130,-120 -80,-180 C-70,-110 -60,-60 -30,0 Z" fill="url(#goldGradScep)" stroke="#4A3402" strokeWidth="3" />
              <path d="M30,0 C110,-20 130,-120 80,-180 C70,-110 60,-60 30,0 Z" fill="url(#goldGradScep)" stroke="#4A3402" strokeWidth="3" />
              
              <circle cx="0" cy="-110" r="75" fill="url(#crystalGradScep)" stroke="#FFFFFF" strokeWidth="3.5" filter="url(#glowScep)" />
              <circle cx="0" cy="-110" r="75" fill="url(#crystalGradScep)" stroke="#FFFFFF" strokeWidth="3.5" />
              <ellipse cx="-25" cy="-135" rx="20" ry="10" transform="rotate(-30, -25, -135)" fill="#FFFFFF" opacity="0.5" />
              
              <polygon points="0,-185 -15,-215 15,-215" fill="url(#goldGradScep)" stroke="#4A3402" strokeWidth="2.5" />
              <circle cx="0" cy="-225" r="10" fill="#FFFFFF" filter="url(#glowScep)" />
              <circle cx="0" cy="-225" r="5" fill="#FFFFFF" />

              <path d="M-105,-110 A105,35 0 0,0 105,-110" fill="none" stroke="url(#goldGradScep)" strokeWidth="6" opacity="0.8" />
              <path d="M-105,-110 A105,35 0 0,0 105,-110" fill="none" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.3" />
            </g>
          </g>
        </svg>
      )
    },
    {
      id: 'royal_slot_frame',
      setId: 'royal_regalia',
      name: 'Royal Equipment Frame',
      category: 'UI Slot Frame',
      filename: 'crownspire_royal_slot_frame',
      description: 'A premium, empty equipment slot frame crafted from royal white-gold molding and embedded with corner Amethyst crown insignias. Designed to showcase epic loot.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradFrame" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEF" />
              <stop offset="35%" stopColor="#FAD480" />
              <stop offset="70%" stopColor="#C99427" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>
            <linearGradient id="innerGridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E0743" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#0B021A" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#020005" stopOpacity="0.95" />
            </linearGradient>
            <filter id="glowFrame" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#9F5EFF" opacity="0.12" filter="url(#glowFrame)" />

          <rect x="212" y="212" width="600" height="600" rx="80" fill="url(#innerGridGrad)" stroke="url(#goldGradFrame)" strokeWidth="6" />
          
          <polygon points="512,320 678,416 678,608 512,704 346,608 346,416" fill="none" stroke="#9C4EFF" strokeWidth="2.5" opacity="0.25" />
          <circle cx="512" cy="512" r="120" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="10, 8" opacity="0.15" />

          <g transform="translate(512, 512)">
            <path d="M-300,-150 L-300,-300 L-150,-300" fill="none" stroke="url(#goldGradFrame)" strokeWidth="14" strokeLinecap="round" />
            <path d="M-300,-150 L-300,-300 L-150,-300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="-320,-320 -240,-320 -320,-240" fill="url(#goldGradFrame)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrame)" />
            <circle cx="-280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />
            
            <path d="M300,-150 L300,-300 L150,-300" fill="none" stroke="url(#goldGradFrame)" strokeWidth="14" strokeLinecap="round" />
            <path d="M300,-150 L300,-300 L150,-300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="320,-320 240,-320 320,-240" fill="url(#goldGradFrame)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrame)" />
            <circle cx="280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />

            <path d="M-300,150 L-300,300 L-150,300" fill="none" stroke="url(#goldGradFrame)" strokeWidth="14" strokeLinecap="round" />
            <path d="M-300,150 L-300,300 L-150,300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="-320,320 -240,320 -320,240" fill="url(#goldGradFrame)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrame)" />
            <circle cx="-280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />

            <path d="M300,150 L300,300 L150,300" fill="none" stroke="url(#goldGradFrame)" strokeWidth="14" strokeLinecap="round" />
            <path d="M300,150 L300,300 L150,300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="320,320 240,320 320,240" fill="url(#goldGradFrame)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrame)" />
            <circle cx="280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />
          </g>

          <rect x="190" y="190" width="644" height="644" rx="90" fill="none" stroke="url(#goldGradFrame)" strokeWidth="2" opacity="0.4" />
        </svg>
      )
    },
    {
      id: 'royal_frame_helmet',
      setId: 'royal_regalia',
      name: 'Royal Helmet Slot Frame',
      category: 'UI Slot Frame',
      filename: 'crownspire_royal_frame_helmet',
      description: 'A premium Royal Crown/Helmet slot frame with elegant sovereign crown corner insignias and a watermark silhouette of a monarch crown.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradFrameRH" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEF" />
              <stop offset="35%" stopColor="#FAD480" />
              <stop offset="70%" stopColor="#C99427" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>
            <linearGradient id="innerGridGradRH" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E0743" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#0B021A" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#020005" stopOpacity="0.95" />
            </linearGradient>
            <filter id="glowFrameRH" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#9F5EFF" opacity="0.12" filter="url(#glowFrameRH)" />

          <rect x="212" y="212" width="600" height="600" rx="80" fill="url(#innerGridGradRH)" stroke="url(#goldGradFrameRH)" strokeWidth="6" />
          
          <polygon points="512,320 678,416 678,608 512,704 346,608 346,416" fill="none" stroke="#9C4EFF" strokeWidth="2.5" opacity="0.25" />
          <circle cx="512" cy="512" r="120" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="10, 8" opacity="0.15" />

          {/* Royal Crown Watermark */}
          <g transform="translate(512, 512)">
            <path d="M-90,38 C-90,-42 -60,-62 2,-62 C64,-62 94,-42 94,38 Z" fill="#9C4EFF" opacity="0.1" />
            <path d="M-70,38 L-90,-12 L-40,8 L2,-52 L44,8 L94,-12 L74,38 Z" fill="#9C4EFF" opacity="0.16" stroke="#FFFFFF" strokeWidth="2" />
            <circle cx="2" cy="-62" r="6" fill="#FFFFFF" opacity="0.25" />
          </g>

          <g transform="translate(512, 512)">
            <path d="M-300,-150 L-300,-300 L-150,-300" fill="none" stroke="url(#goldGradFrameRH)" strokeWidth="14" strokeLinecap="round" />
            <path d="M-300,-150 L-300,-300 L-150,-300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="-320,-320 -240,-320 -320,-240" fill="url(#goldGradFrameRH)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameRH)" />
            <circle cx="-280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />
            
            <path d="M300,-150 L300,-300 L150,-300" fill="none" stroke="url(#goldGradFrameRH)" strokeWidth="14" strokeLinecap="round" />
            <path d="M300,-150 L300,-300 L150,-300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="320,-320 240,-320 320,-240" fill="url(#goldGradFrameRH)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameRH)" />
            <circle cx="280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />

            <path d="M-300,150 L-300,300 L-150,300" fill="none" stroke="url(#goldGradFrameRH)" strokeWidth="14" strokeLinecap="round" />
            <path d="M-300,150 L-300,300 L-150,300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="-320,320 -240,320 -320,240" fill="url(#goldGradFrameRH)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameRH)" />
            <circle cx="-280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />

            <path d="M300,150 L300,300 L150,300" fill="none" stroke="url(#goldGradFrameRH)" strokeWidth="14" strokeLinecap="round" />
            <path d="M300,150 L300,300 L150,300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="320,320 240,320 320,240" fill="url(#goldGradFrameRH)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameRH)" />
            <circle cx="280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />
          </g>
          <rect x="190" y="190" width="644" height="644" rx="90" fill="none" stroke="url(#goldGradFrameRH)" strokeWidth="2" opacity="0.4" />
        </svg>
      )
    },
    {
      id: 'royal_frame_cloak',
      setId: 'royal_regalia',
      name: 'Royal Cloak Slot Frame',
      category: 'UI Slot Frame',
      filename: 'crownspire_royal_frame_cloak',
      description: 'A premium Royal Cloak slot frame lined with white-gold filigree loops and a central crest representing a flowing royal cape.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradFrameRC" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEF" />
              <stop offset="35%" stopColor="#FAD480" />
              <stop offset="70%" stopColor="#C99427" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>
            <linearGradient id="innerGridGradRC" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E0743" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#0B021A" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#020005" stopOpacity="0.95" />
            </linearGradient>
            <filter id="glowFrameRC" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#9F5EFF" opacity="0.12" filter="url(#glowFrameRC)" />

          <rect x="212" y="212" width="600" height="600" rx="80" fill="url(#innerGridGradRC)" stroke="url(#goldGradFrameRC)" strokeWidth="6" />
          
          <polygon points="512,320 678,416 678,608 512,704 346,608 346,416" fill="none" stroke="#9C4EFF" strokeWidth="2.5" opacity="0.25" />
          <circle cx="512" cy="512" r="120" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="10, 8" opacity="0.15" />

          {/* Royal Cloak Watermark */}
          <g transform="translate(512, 512)">
            <path d="M-72,-82 L72,-82 L128,98 L-128,98 Z" fill="none" stroke="#9C4EFF" strokeWidth="8" opacity="0.14" />
            <circle cx="0" cy="-62" r="14" fill="#9C4EFF" opacity="0.2" />
            <path d="M-52,-82 C-52,-22 -32,68 0,98 C32,68 52,-22 52,-82" fill="none" stroke="#9C4EFF" strokeWidth="4" opacity="0.16" />
          </g>

          <g transform="translate(512, 512)">
            <path d="M-300,-150 L-300,-300 L-150,-300" fill="none" stroke="url(#goldGradFrameRC)" strokeWidth="14" strokeLinecap="round" />
            <path d="M-300,-150 L-300,-300 L-150,-300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="-320,-320 -240,-320 -320,-240" fill="url(#goldGradFrameRC)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameRC)" />
            <circle cx="-280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />
            
            <path d="M300,-150 L300,-300 L150,-300" fill="none" stroke="url(#goldGradFrameRC)" strokeWidth="14" strokeLinecap="round" />
            <path d="M300,-150 L300,-300 L150,-300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="320,-320 240,-320 320,-240" fill="url(#goldGradFrameRC)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameRC)" />
            <circle cx="280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />

            <path d="M-300,150 L-300,300 L-150,300" fill="none" stroke="url(#goldGradFrameRC)" strokeWidth="14" strokeLinecap="round" />
            <path d="M-300,150 L-300,300 L-150,300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="-320,320 -240,320 -320,240" fill="url(#goldGradFrameRC)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameRC)" />
            <circle cx="-280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />

            <path d="M300,150 L300,300 L150,300" fill="none" stroke="url(#goldGradFrameRC)" strokeWidth="14" strokeLinecap="round" />
            <path d="M300,150 L300,300 L150,300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="320,320 240,320 320,240" fill="url(#goldGradFrameRC)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameRC)" />
            <circle cx="280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />
          </g>
          <rect x="190" y="190" width="644" height="644" rx="90" fill="none" stroke="url(#goldGradFrameRC)" strokeWidth="2" opacity="0.4" />
        </svg>
      )
    },
    {
      id: 'royal_frame_chest',
      setId: 'royal_regalia',
      name: 'Royal Armor Slot Frame',
      category: 'UI Slot Frame',
      filename: 'crownspire_royal_frame_chest',
      description: 'A premium Sovereign Chest Armor slot frame crafted with thick royal purple velvet backings and an armored chest breastplate watermark.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradFrameRCh" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEF" />
              <stop offset="35%" stopColor="#FAD480" />
              <stop offset="70%" stopColor="#C99427" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>
            <linearGradient id="innerGridGradRCh" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E0743" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#0B021A" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#020005" stopOpacity="0.95" />
            </linearGradient>
            <filter id="glowFrameRCh" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#9F5EFF" opacity="0.12" filter="url(#glowFrameRCh)" />

          <rect x="212" y="212" width="600" height="600" rx="80" fill="url(#innerGridGradRCh)" stroke="url(#goldGradFrameRCh)" strokeWidth="6" />
          
          <polygon points="512,320 678,416 678,608 512,704 346,608 346,416" fill="none" stroke="#9C4EFF" strokeWidth="2.5" opacity="0.25" />
          <circle cx="512" cy="512" r="120" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="10, 8" opacity="0.15" />

          {/* Sovereign Chest Armor Watermark */}
          <g transform="translate(512, 512)">
            <path d="M-102,-102 L102,-102 L78,88 L0,138 L-78,88 Z" fill="none" stroke="#9C4EFF" strokeWidth="8" opacity="0.14" />
            <path d="M-62,-62 L62,-62" stroke="#9C4EFF" strokeWidth="6" opacity="0.16" />
            <circle cx="0" cy="18" r="30" fill="none" stroke="#FFFFFF" strokeWidth="5" opacity="0.18" />
          </g>

          <g transform="translate(512, 512)">
            <path d="M-300,-150 L-300,-300 L-150,-300" fill="none" stroke="url(#goldGradFrameRCh)" strokeWidth="14" strokeLinecap="round" />
            <path d="M-300,-150 L-300,-300 L-150,-300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="-320,-320 -240,-320 -320,-240" fill="url(#goldGradFrameRCh)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameRCh)" />
            <circle cx="-280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />
            
            <path d="M300,-150 L300,-300 L150,-300" fill="none" stroke="url(#goldGradFrameRCh)" strokeWidth="14" strokeLinecap="round" />
            <path d="M300,-150 L300,-300 L150,-300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="320,-320 240,-320 320,-240" fill="url(#goldGradFrameRCh)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameRCh)" />
            <circle cx="280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />

            <path d="M-300,150 L-300,300 L-150,300" fill="none" stroke="url(#goldGradFrameRCh)" strokeWidth="14" strokeLinecap="round" />
            <path d="M-300,150 L-300,300 L-150,300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="-320,320 -240,320 -320,240" fill="url(#goldGradFrameRCh)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameRCh)" />
            <circle cx="-280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />

            <path d="M300,150 L300,300 L150,300" fill="none" stroke="url(#goldGradFrameRCh)" strokeWidth="14" strokeLinecap="round" />
            <path d="M300,150 L300,300 L150,300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="320,320 240,320 320,240" fill="url(#goldGradFrameRCh)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameRCh)" />
            <circle cx="280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />
          </g>
          <rect x="190" y="190" width="644" height="644" rx="90" fill="none" stroke="url(#goldGradFrameRCh)" strokeWidth="2" opacity="0.4" />
        </svg>
      )
    },
    {
      id: 'royal_frame_gauntlets',
      setId: 'royal_regalia',
      name: 'Royal Gauntlets Slot Frame',
      category: 'UI Slot Frame',
      filename: 'crownspire_royal_frame_gauntlets',
      description: 'A premium Royal Gauntlets slot frame accented by glowing purple gemstones in each corner, enclosing a delicate fist guard silhouette.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradFrameRGa" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEF" />
              <stop offset="35%" stopColor="#FAD480" />
              <stop offset="70%" stopColor="#C99427" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>
            <linearGradient id="innerGridGradRGa" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E0743" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#0B021A" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#020005" stopOpacity="0.95" />
            </linearGradient>
            <filter id="glowFrameRGa" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#9F5EFF" opacity="0.12" filter="url(#glowFrameRGa)" />

          <rect x="212" y="212" width="600" height="600" rx="80" fill="url(#innerGridGradRGa)" stroke="url(#goldGradFrameRGa)" strokeWidth="6" />
          
          <polygon points="512,320 678,416 678,608 512,704 346,608 346,416" fill="none" stroke="#9C4EFF" strokeWidth="2.5" opacity="0.25" />
          <circle cx="512" cy="512" r="120" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="10, 8" opacity="0.15" />

          {/* Royal Gauntlets Watermark */}
          <g transform="translate(512, 512)">
            <g transform="translate(-45, 0) rotate(-15)">
              <path d="M-20,60 L20,60 L25,10 L-25,10 Z" fill="#9C4EFF" opacity="0.15" />
              <path d="M-25,10 L25,10 L20,-30 L-20,-30 Z" fill="#9C4EFF" opacity="0.18" />
            </g>
            <g transform="translate(45, 0) rotate(15) scale(-1, 1)">
              <path d="M-20,60 L20,60 L25,10 L-25,10 Z" fill="#9C4EFF" opacity="0.15" />
              <path d="M-25,10 L25,10 L20,-30 L-20,-30 Z" fill="#9C4EFF" opacity="0.18" />
            </g>
          </g>

          <g transform="translate(512, 512)">
            <path d="M-300,-150 L-300,-300 L-150,-300" fill="none" stroke="url(#goldGradFrameRGa)" strokeWidth="14" strokeLinecap="round" />
            <path d="M-300,-150 L-300,-300 L-150,-300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="-320,-320 -240,-320 -320,-240" fill="url(#goldGradFrameRGa)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameRGa)" />
            <circle cx="-280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />
            
            <path d="M300,-150 L300,-300 L150,-300" fill="none" stroke="url(#goldGradFrameRGa)" strokeWidth="14" strokeLinecap="round" />
            <path d="M300,-150 L300,-300 L150,-300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="320,-320 240,-320 320,-240" fill="url(#goldGradFrameRGa)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameRGa)" />
            <circle cx="280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />

            <path d="M-300,150 L-300,300 L-150,300" fill="none" stroke="url(#goldGradFrameRGa)" strokeWidth="14" strokeLinecap="round" />
            <path d="M-300,150 L-300,300 L-150,300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="-320,320 -240,320 -320,240" fill="url(#goldGradFrameRGa)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameRGa)" />
            <circle cx="-280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />

            <path d="M300,150 L300,300 L150,300" fill="none" stroke="url(#goldGradFrameRGa)" strokeWidth="14" strokeLinecap="round" />
            <path d="M300,150 L300,300 L150,300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="320,320 240,320 320,240" fill="url(#goldGradFrameRGa)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameRGa)" />
            <circle cx="280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />
          </g>
          <rect x="190" y="190" width="644" height="644" rx="90" fill="none" stroke="url(#goldGradFrameRGa)" strokeWidth="2" opacity="0.4" />
        </svg>
      )
    },
    {
      id: 'royal_frame_boots',
      setId: 'royal_regalia',
      name: 'Royal Boots Slot Frame',
      category: 'UI Slot Frame',
      filename: 'crownspire_royal_frame_boots',
      description: 'A premium Royal Boots slot frame featuring wing-tipped golden brackets and an integrated sabaton watermark design.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradFrameRBo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEF" />
              <stop offset="35%" stopColor="#FAD480" />
              <stop offset="70%" stopColor="#C99427" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>
            <linearGradient id="innerGridGradRBo" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E0743" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#0B021A" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#020005" stopOpacity="0.95" />
            </linearGradient>
            <filter id="glowFrameRBo" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#9F5EFF" opacity="0.12" filter="url(#glowFrameRBo)" />

          <rect x="212" y="212" width="600" height="600" rx="80" fill="url(#innerGridGradRBo)" stroke="url(#goldGradFrameRBo)" strokeWidth="6" />
          
          <polygon points="512,320 678,416 678,608 512,704 346,608 346,416" fill="none" stroke="#9C4EFF" strokeWidth="2.5" opacity="0.25" />
          <circle cx="512" cy="512" r="120" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="10, 8" opacity="0.15" />

          {/* Royal Boots Watermark */}
          <g transform="translate(512, 512)">
            <g transform="translate(-45, 0)">
              <path d="M-15,-60 L15,-60 L12,20 L-12,20 Z" fill="#9C4EFF" opacity="0.15" stroke="#9C4EFF" strokeWidth="2" />
              <circle cx="0" cy="25" r="8" fill="#9C4EFF" opacity="0.22" />
              <path d="M-10,28 L10,28 L22,55 Q5,65 -12,55 Z" fill="#9C4EFF" opacity="0.18" />
            </g>
            <g transform="translate(45, 0) scale(-1, 1)">
              <path d="M-15,-60 L15,-60 L12,20 L-12,20 Z" fill="#9C4EFF" opacity="0.15" stroke="#9C4EFF" strokeWidth="2" />
              <circle cx="0" cy="25" r="8" fill="#9C4EFF" opacity="0.22" />
              <path d="M-10,28 L10,28 L22,55 Q5,65 -12,55 Z" fill="#9C4EFF" opacity="0.18" />
            </g>
          </g>

          <g transform="translate(512, 512)">
            <path d="M-300,-150 L-300,-300 L-150,-300" fill="none" stroke="url(#goldGradFrameRBo)" strokeWidth="14" strokeLinecap="round" />
            <path d="M-300,-150 L-300,-300 L-150,-300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="-320,-320 -240,-320 -320,-240" fill="url(#goldGradFrameRBo)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameRBo)" />
            <circle cx="-280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />
            
            <path d="M300,-150 L300,-300 L150,-300" fill="none" stroke="url(#goldGradFrameRBo)" strokeWidth="14" strokeLinecap="round" />
            <path d="M300,-150 L300,-300 L150,-300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="320,-320 240,-320 320,-240" fill="url(#goldGradFrameRBo)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameRBo)" />
            <circle cx="280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />

            <path d="M-300,150 L-300,300 L-150,300" fill="none" stroke="url(#goldGradFrameRBo)" strokeWidth="14" strokeLinecap="round" />
            <path d="M-300,150 L-300,300 L-150,300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="-320,320 -240,320 -320,240" fill="url(#goldGradFrameRBo)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameRBo)" />
            <circle cx="-280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />

            <path d="M300,150 L300,300 L150,300" fill="none" stroke="url(#goldGradFrameRBo)" strokeWidth="14" strokeLinecap="round" />
            <path d="M300,150 L300,300 L150,300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="320,320 240,320 320,240" fill="url(#goldGradFrameRBo)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameRBo)" />
            <circle cx="280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />
          </g>
          <rect x="190" y="190" width="644" height="644" rx="90" fill="none" stroke="url(#goldGradFrameRBo)" strokeWidth="2" opacity="0.4" />
        </svg>
      )
    },
    {
      id: 'royal_frame_weapon',
      setId: 'royal_regalia',
      name: 'Royal Scepter Slot Frame',
      category: 'UI Slot Frame',
      filename: 'crownspire_royal_frame_weapon',
      description: 'A premium Scepter/Weapon slot frame featuring orbit rings, royal gold filigree overlays, and a matching mystical scepter watermark.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradFrameRWe" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEF" />
              <stop offset="35%" stopColor="#FAD480" />
              <stop offset="70%" stopColor="#C99427" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>
            <linearGradient id="innerGridGradRWe" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E0743" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#0B021A" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#020005" stopOpacity="0.95" />
            </linearGradient>
            <filter id="glowFrameRWe" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#9F5EFF" opacity="0.12" filter="url(#glowFrameRWe)" />

          <rect x="212" y="212" width="600" height="600" rx="80" fill="url(#innerGridGradRWe)" stroke="url(#goldGradFrameRWe)" strokeWidth="6" />
          
          <polygon points="512,320 678,416 678,608 512,704 346,608 346,416" fill="none" stroke="#9C4EFF" strokeWidth="2.5" opacity="0.25" />
          <circle cx="512" cy="512" r="120" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="10, 8" opacity="0.15" />

          {/* Royal Scepter/Weapon Watermark */}
          <g transform="translate(512, 512) rotate(35)">
            <line x1="0" y1="-220" x2="0" y2="220" stroke="#9C4EFF" strokeWidth="12" strokeLinecap="round" opacity="0.16" />
            <circle cx="0" cy="-220" r="30" fill="none" stroke="#FFFFFF" strokeWidth="6" opacity="0.22" />
            <circle cx="0" cy="220" r="18" fill="#9C4EFF" opacity="0.18" />
          </g>

          <g transform="translate(512, 512)">
            <path d="M-300,-150 L-300,-300 L-150,-300" fill="none" stroke="url(#goldGradFrameRWe)" strokeWidth="14" strokeLinecap="round" />
            <path d="M-300,-150 L-300,-300 L-150,-300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="-320,-320 -240,-320 -320,-240" fill="url(#goldGradFrameRWe)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameRWe)" />
            <circle cx="-280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />
            
            <path d="M300,-150 L300,-300 L150,-300" fill="none" stroke="url(#goldGradFrameRWe)" strokeWidth="14" strokeLinecap="round" />
            <path d="M300,-150 L300,-300 L150,-300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="320,-320 240,-320 320,-240" fill="url(#goldGradFrameRWe)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameRWe)" />
            <circle cx="280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />

            <path d="M-300,150 L-300,300 L-150,300" fill="none" stroke="url(#goldGradFrameRWe)" strokeWidth="14" strokeLinecap="round" />
            <path d="M-300,150 L-300,300 L-150,300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="-320,320 -240,320 -320,240" fill="url(#goldGradFrameRWe)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameRWe)" />
            <circle cx="-280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />

            <path d="M300,150 L300,300 L150,300" fill="none" stroke="url(#goldGradFrameRWe)" strokeWidth="14" strokeLinecap="round" />
            <path d="M300,150 L300,300 L150,300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="320,320 240,320 320,240" fill="url(#goldGradFrameRWe)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrameRWe)" />
            <circle cx="280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />
          </g>
          <rect x="190" y="190" width="644" height="644" rx="90" fill="none" stroke="url(#goldGradFrameRWe)" strokeWidth="2" opacity="0.4" />
        </svg>
      )
    },
    {
      id: 'royal_slot_frame',

      setId: 'royal_regalia',
      name: 'Royal Equipment Frame',
      category: 'UI Slot Frame',
      filename: 'crownspire_royal_slot_frame',
      description: 'A premium, empty equipment slot frame crafted from royal white-gold molding and embedded with corner Amethyst crown insignias. Designed to showcase epic loot.',
      svg: (id: string) => (
        <svg id={id} viewBox="0 0 1024 1024" className="w-full h-full bg-transparent" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="goldGradFrame" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFEEF" />
              <stop offset="35%" stopColor="#FAD480" />
              <stop offset="70%" stopColor="#C99427" />
              <stop offset="100%" stopColor="#8A610A" />
            </linearGradient>
            <linearGradient id="innerGridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E0743" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#0B021A" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#020005" stopOpacity="0.95" />
            </linearGradient>
            <filter id="glowFrame" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="22" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <circle cx="512" cy="512" r="300" fill="#9F5EFF" opacity="0.12" filter="url(#glowFrame)" />

          <rect x="212" y="212" width="600" height="600" rx="80" fill="url(#innerGridGrad)" stroke="url(#goldGradFrame)" strokeWidth="6" />
          
          <polygon points="512,320 678,416 678,608 512,704 346,608 346,416" fill="none" stroke="#9C4EFF" strokeWidth="2.5" opacity="0.25" />
          <circle cx="512" cy="512" r="120" fill="none" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="10, 8" opacity="0.15" />

          <g transform="translate(512, 512)">
            <path d="M-300,-150 L-300,-300 L-150,-300" fill="none" stroke="url(#goldGradFrame)" strokeWidth="14" strokeLinecap="round" />
            <path d="M-300,-150 L-300,-300 L-150,-300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="-320,-320 -240,-320 -320,-240" fill="url(#goldGradFrame)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrame)" />
            <circle cx="-280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />
            
            <path d="M300,-150 L300,-300 L150,-300" fill="none" stroke="url(#goldGradFrame)" strokeWidth="14" strokeLinecap="round" />
            <path d="M300,-150 L300,-300 L150,-300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="320,-320 240,-320 320,-240" fill="url(#goldGradFrame)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrame)" />
            <circle cx="280" cy="-280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />

            <path d="M-300,150 L-300,300 L-150,300" fill="none" stroke="url(#goldGradFrame)" strokeWidth="14" strokeLinecap="round" />
            <path d="M-300,150 L-300,300 L-150,300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="-320,320 -240,320 -320,240" fill="url(#goldGradFrame)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="-280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrame)" />
            <circle cx="-280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />

            <path d="M300,150 L300,300 L150,300" fill="none" stroke="url(#goldGradFrame)" strokeWidth="14" strokeLinecap="round" />
            <path d="M300,150 L300,300 L150,300" fill="none" stroke="#FFFFFF" strokeWidth="3" opacity="0.3" strokeLinecap="round" />
            <polygon points="320,320 240,320 320,240" fill="url(#goldGradFrame)" stroke="#4A3402" strokeWidth="2.5" />
            <circle cx="280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" filter="url(#glowFrame)" />
            <circle cx="280" cy="280" r="14" fill="#9C4EFF" stroke="#FFFFFF" strokeWidth="2" />
          </g>

          <rect x="190" y="190" width="644" height="644" rx="90" fill="none" stroke="url(#goldGradFrame)" strokeWidth="2" opacity="0.4" />
        </svg>
      )
    }
  ];

  const filteredEquipment = equipmentList.filter(equip => {
    if (activeTab === 'royal_regalia') {
      return equip.setId === 'royal_regalia';
    } else {
      return !equip.setId;
    }
  });

  const activeEquip = filteredEquipment.find(e => e.id === selectedEquipId) || filteredEquipment[0] || equipmentList[0];

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
            className="relative w-full max-w-5xl bg-[#0c0d12] border-2 border-amber-500/30 rounded-3xl shadow-[0_0_50px_rgba(212,167,71,0.25)] flex flex-col md:flex-row overflow-hidden max-h-[90vh]"
          >
            {/* Header Brand Overlay */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-purple-500 to-amber-500 z-10" />

            {/* Left Column: List of Equipments */}
            <div className="w-full md:w-2/5 border-b md:border-b-0 md:border-r border-zinc-900/60 p-5 flex flex-col max-h-[40vh] md:max-h-none overflow-y-auto">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <div>
                  <h2 className="text-sm font-serif font-black tracking-widest text-white uppercase leading-none">
                    Crownspire Armory
                  </h2>
                  <span className="text-[10px] text-amber-400 font-mono tracking-wider">HERO EQUIPMENT SET • 1024x1024 PNG</span>
                </div>
              </div>

              {/* Set Tabs Switcher */}
              <div className="flex gap-1.5 p-1 bg-zinc-950/80 rounded-xl mb-4 border border-zinc-900/80 shrink-0">
                <button
                  onClick={() => {
                    setActiveTab('crystal_vanguard');
                    setSelectedEquipId('crystal_sword');
                  }}
                  className={`flex-1 text-[10px] font-serif font-black uppercase tracking-wider py-2.5 px-2 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'crystal_vanguard'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/10 font-black'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
                  }`}
                >
                  <Shield className="w-3 h-3" />
                  Vanguard Set
                </button>
                <button
                  onClick={() => {
                    setActiveTab('royal_regalia');
                    setSelectedEquipId('royal_crown');
                  }}
                  className={`flex-1 text-[10px] font-serif font-black uppercase tracking-wider py-2.5 px-2 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === 'royal_regalia'
                      ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-black shadow-lg shadow-amber-500/10 font-black'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
                  }`}
                >
                  <Crown className="w-3 h-3" />
                  Royal Regalia
                </button>
              </div>

              <div className="space-y-1.5 flex-1 pr-1 overflow-y-auto max-h-[30vh] md:max-h-none">
                {filteredEquipment.map((equip) => {
                  const isSelected = selectedEquipId === equip.id;
                  return (
                    <button
                      key={equip.id}
                      onClick={() => setSelectedEquipId(equip.id)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-950/20 border-amber-500/50 text-white font-semibold shadow-inner'
                          : 'bg-zinc-950/20 border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg text-xs ${isSelected ? 'bg-amber-500/20 text-amber-300' : 'bg-zinc-900 text-zinc-500'}`}>
                        🛡️
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-serif leading-tight">{equip.name}</div>
                        <div className="text-[9px] font-mono text-zinc-500 truncate">{equip.filename}.png</div>
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
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-2xl border-4 border-dashed border-amber-500/25 bg-[#0e0e14] shadow-inner flex items-center justify-center p-4 group overflow-hidden">
                  {/* Grid checkerboard background indicating true transparency */}
                  <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
                    backgroundImage: 'radial-gradient(#3e1a6d 1.5px, transparent 1.5px), radial-gradient(#3e1a6d 1.5px, #0e0e14 1.5px)',
                    backgroundSize: '24px 24px',
                    backgroundPosition: '0 0, 12px 12px'
                  }} />

                  {/* Render Active SVG */}
                  <div className="w-full h-full relative z-10 transition-transform duration-300 hover:scale-105">
                    {activeEquip.svg('active_equip_svg')}
                  </div>
                </div>
              </div>

              {/* Bottom Metadata & Controls */}
              <div className="mt-4 border-t border-zinc-900/60 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                      {activeEquip.category}
                    </span>
                    <span className="text-[9px] font-mono text-zinc-500">1024 × 1024 • PNG</span>
                  </div>
                  <h3 className="text-sm font-serif font-bold text-white mb-1">{activeEquip.name}</h3>
                  <p className="text-[11px] text-zinc-400 leading-relaxed max-w-md">{activeEquip.description}</p>
                </div>

                <button
                  onClick={() => handleDownloadPNG('active_equip_svg', activeEquip.filename)}
                  disabled={downloadingId !== null}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 text-black font-serif font-extrabold text-xs tracking-wider cursor-pointer active:scale-97 transition-all shrink-0 shadow-lg shadow-amber-500/10"
                >
                  {downloadingId ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      EXPORTING...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-black stroke-[2.5]" />
                      DOWNLOAD PNG
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
