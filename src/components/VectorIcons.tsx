import React from 'react';

// HEROES - Spartan/Knight Helmet
export function HeroesIcon({ className = "w-8 h-8", active = false }) {
  const color = active ? "#c084fc" : "#ffffff";
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Plume / Crest */}
      <path d="M 32 4 L 35 12 L 32 16 L 29 12 Z" fill={color} />
      <path d="M 32 8 C 34 10, 36 12, 38 10 C 37 13, 35 15, 32 16 C 29 15, 27 13, 26 10 C 28 12, 30 10, 32 8 Z" fill={color} opacity="0.8" />
      
      {/* Helmet Shell */}
      <path d="M 16 32 C 16 18, 48 18, 48 32 C 48 40, 46 48, 44 52 L 38 46 L 32 50 L 26 46 L 20 52 C 18 48, 16 40, 16 32 Z" 
            stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      
      {/* Visor & Nose guard */}
      <path d="M 22 34 L 32 30 L 42 34 L 32 48 Z" stroke={color} strokeWidth="2.5" strokeLinejoin="round" fill="none" />
      <path d="M 32 30 L 32 48" stroke={color} strokeWidth="2" />
      
      {/* Eye cutouts */}
      <circle cx="27" cy="38" r="2" fill={color} />
      <circle cx="37" cy="38" r="2" fill={color} />

      {/* Decorative rivets */}
      <circle cx="32" cy="22" r="1" fill={color} />
      <circle cx="28" cy="24" r="1" fill={color} />
      <circle cx="36" cy="24" r="1" fill={color} />
    </svg>
  );
}

// WAYFINDER - Compass
export function WayfinderIcon({ className = "w-8 h-8", active = false }) {
  const color = active ? "#c084fc" : "#ffffff";
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer Ring with notches */}
      <circle cx="32" cy="32" r="24" stroke={color} strokeWidth="3" />
      <circle cx="32" cy="32" r="20" stroke={color} strokeWidth="1" strokeDasharray="4,4" opacity="0.6" />
      
      {/* Arrow tips (N, S, E, W marks) */}
      <path d="M 32 8 L 35 14 L 29 14 Z" fill={color} />
      <path d="M 32 56 L 35 50 L 29 50 Z" fill={color} />
      <path d="M 56 32 L 50 35 L 50 29 Z" fill={color} />
      <path d="M 8 32 L 14 35 L 14 29 Z" fill={color} />
      
      {/* Compass Needle (rotated) */}
      <g transform="rotate(45 32 32)">
        {/* North Pointer (Filled) */}
        <polygon points="32,12 37,32 32,29" fill={color} stroke={color} strokeWidth="1" />
        {/* South Pointer (Outline/Hollow) */}
        <polygon points="32,52 37,32 32,29" fill="none" stroke={color} strokeWidth="2" />
        <polygon points="32,52 27,32 32,29" fill="none" stroke={color} strokeWidth="2" />
        <polygon points="32,12 27,32 32,29" fill={color} opacity="0.6" />
      </g>
      
      {/* Center cap */}
      <circle cx="32" cy="32" r="3" fill="#120c24" stroke={color} strokeWidth="2" />
    </svg>
  );
}

// BAG - Backpack
export function BagIcon({ className = "w-8 h-8", active = false }) {
  const color = active ? "#c084fc" : "#ffffff";
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main Backpack shape */}
      <path d="M 20 22 C 20 18, 44 18, 44 22 L 46 50 C 46 54, 18 54, 18 50 Z" 
            stroke={color} strokeWidth="3" strokeLinejoin="round" fill="none" />
      
      {/* Top Handle */}
      <path d="M 27 18 C 27 12, 37 12, 37 18" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Side Pockets */}
      <rect x="12" y="32" width="6" height="14" rx="2" stroke={color} strokeWidth="2" fill="none" />
      <rect x="46" y="32" width="6" height="14" rx="2" stroke={color} strokeWidth="2" fill="none" />
      
      {/* Flap covering top */}
      <path d="M 22 22 L 42 22 L 39 36 C 36 40, 28 40, 25 36 Z" 
            fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" />
      
      {/* Buckle / Crest on Flap */}
      <path d="M 32 32 L 32 44" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <rect x="29" y="38" width="6" height="4" rx="1" fill={color} />
      
      {/* Cute mini plant/flower logo on bag */}
      <path d="M 32 25 L 35 28 L 32 31 L 29 28 Z" fill={color} />
    </svg>
  );
}

// QUEST - Scroll
export function QuestIcon({ className = "w-8 h-8", active = false }) {
  const color = active ? "#c084fc" : "#ffffff";
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Scroll Roll (Top) */}
      <path d="M 16 18 C 16 13, 26 13, 26 18 C 26 21, 16 21, 16 18 Z" stroke={color} strokeWidth="2.5" fill="none" />
      <path d="M 26 18 L 48 18 C 52 18, 52 14, 48 14 L 20 14" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Scroll Sheet Body */}
      <path d="M 18 19 L 18 42 C 18 46, 22 46, 26 42" stroke={color} strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <path d="M 48 18 L 48 44" stroke={color} strokeWidth="2.5" />
      
      {/* Scroll Roll (Bottom) */}
      <path d="M 48 44 C 48 49, 38 49, 38 44 C 38 41, 48 41, 48 44 Z" stroke={color} strokeWidth="2.5" fill="none" />
      <path d="M 38 44 L 16 44 C 12 44, 12 40, 16 40 L 44 40" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Mini Crest / Seal on Scroll */}
      <polygon points="32,24 36,28 32,32 28,28" fill={color} />
      <path d="M 32 32 L 32 38 L 35 36" stroke={color} strokeWidth="1.5" />
      
      {/* Writing lines mockup */}
      <line x1="22" y1="21" x2="38" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <line x1="22" y1="36" x2="30" y2="36" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}

// ALLIANCE - Shield and Sword
export function AllianceIcon({ className = "w-8 h-8", active = false }) {
  const color = active ? "#c084fc" : "#ffffff";
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Shield Contour */}
      <path d="M 16 16 L 32 12 L 48 16 C 48 34, 44 46, 32 54 C 20 46, 16 34, 16 16 Z" 
            stroke={color} strokeWidth="3" strokeLinejoin="round" fill="none" />
      
      {/* Inner border line */}
      <path d="M 20 19 L 32 16 L 44 19 C 44 32, 40 42, 32 49 C 24 42, 20 32, 20 19 Z" 
            stroke={color} strokeWidth="1" opacity="0.5" />

      {/* Symmetrical Sprout / Leaves emblem on top of shield */}
      <path d="M 32 6 L 35 11 L 32 13 L 29 11 Z" fill={color} />
      <path d="M 28 8 Q 30 11 32 11 Q 34 11 36 8" stroke={color} strokeWidth="1.5" fill="none" />

      {/* Sword down the center */}
      {/* Blade */}
      <path d="M 31 16 L 33 16 L 33 36 L 32 40 L 31 36 Z" fill={color} />
      {/* Guard */}
      <path d="M 26 36 L 38 36" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Grip & Pommel */}
      <line x1="32" y1="36" x2="32" y2="44" stroke={color} strokeWidth="2.5" />
      <circle cx="32" cy="45" r="2.5" fill={color} />
    </svg>
  );
}

// MAP - Active Hex Badge
export function MapHexBadge({ className = "w-16 h-16" }) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Glow & Gradient definitions */}
        <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d8b4fe" />
          <stop offset="50%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        
        <linearGradient id="landscapeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f3e8ff" />
          <stop offset="60%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#3b0764" />
        </linearGradient>

        <filter id="hexGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer Crown Motif on top of the hex */}
      <g transform="translate(40, 11)" filter="url(#hexGlow)">
        <path d="M -8 0 L -4 4 L 0 0 L 4 4 L 8 0 L 5 8 L -5 8 Z" fill="#d8b4fe" />
        <circle cx="0" cy="-3" r="1.5" fill="#fff" />
      </g>

      {/* Glowing Outer Hexagonal Frame */}
      <g filter="url(#hexGlow)">
        <polygon points="40,16 68,30 68,60 40,74 12,60 12,30" stroke="url(#hexGrad)" strokeWidth="3" fill="#0f0926" />
      </g>

      {/* Landscape Area inside the Hex */}
      <clipPath id="hexClip">
        <polygon points="40,19 65,32 65,57 40,70 15,57 15,32" />
      </clipPath>

      <g clipPath="url(#hexClip)">
        {/* Sky gradient background */}
        <rect x="10" y="15" width="60" height="60" fill="url(#landscapeGrad)" />

        {/* Crescent Moon / Shining Star */}
        <circle cx="26" cy="32" r="3.5" fill="#fff" opacity="0.9" />
        <path d="M 25 25 L 27 28 L 30 29 L 27 30 L 26 33 L 25 30 L 22 29 L 25 28 Z" fill="#fff" opacity="0.8" />

        {/* Back Mountains */}
        <polygon points="10,60 28,42 46,60" fill="#6b21a8" opacity="0.7" />
        <polygon points="30,60 52,35 70,60" fill="#581c87" />

        {/* Tall Tower silhouette */}
        <rect x="42" y="32" width="6" height="24" fill="#1e1b4b" />
        <polygon points="41,32 45,22 49,32" fill="#1e1b4b" />
        <rect x="44" y="38" width="2" height="4" fill="#a78bfa" /> {/* lit window */}

        {/* Foreground terrain / ground */}
        <path d="M 12 55 Q 32 48 45 55 T 68 52 L 68 80 L 12 80 Z" fill="#120c24" />
      </g>

      {/* Inner border inset to define the bezel */}
      <polygon points="40,19 65,32 65,57 40,70 15,57 15,32" stroke="#d8b4fe" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

// CITY - Active Hex Badge
export function CityHexBadge({ className = "w-16 h-16" }) {
  return (
    <svg viewBox="0 0 80 80" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="hexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d8b4fe" />
          <stop offset="50%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>

        <linearGradient id="landscapeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f3e8ff" />
          <stop offset="60%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#3b0764" />
        </linearGradient>

        <filter id="hexGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Crown decoration on top */}
      <g transform="translate(40, 11)" filter="url(#hexGlow)">
        <path d="M -8 0 L -4 4 L 0 0 L 4 4 L 8 0 L 5 8 L -5 8 Z" fill="#d8b4fe" />
        <circle cx="0" cy="-3" r="1.5" fill="#fff" />
      </g>

      {/* Glowing Outer Hexagonal Frame */}
      <g filter="url(#hexGlow)">
        <polygon points="40,16 68,30 68,60 40,74 12,60 12,30" stroke="url(#hexGrad)" strokeWidth="3" fill="#0f0926" />
      </g>

      {/* Castle skyline clip */}
      <clipPath id="hexClipCity">
        <polygon points="40,19 65,32 65,57 40,70 15,57 15,32" />
      </clipPath>

      <g clipPath="url(#hexClipCity)">
        {/* Background gradient */}
        <rect x="10" y="15" width="60" height="60" fill="url(#landscapeGrad)" />

        {/* Castle Spires Drawing */}
        {/* Left Spire */}
        <rect x="22" y="38" width="6" height="25" fill="#312e81" />
        <polygon points="20,38 25,28 30,38" fill="#1e1b4b" />

        {/* Right Spire */}
        <rect x="52" y="38" width="6" height="25" fill="#312e81" />
        <polygon points="50,38 55,28 60,38" fill="#1e1b4b" />

        {/* Center Citadel tower */}
        <rect x="34" y="30" width="12" height="35" fill="#1e1b4b" />
        <polygon points="32,30 40,18 48,30" fill="#4c1d95" />
        
        {/* Portal arch */}
        <path d="M 37 65 A 3 3 0 0 1 43 65 L 43 70 L 37 70 Z" fill="#a78bfa" />

        {/* Windows and accents */}
        <circle cx="40" cy="36" r="1.5" fill="#fef08a" />
        <line x1="15" y1="58" x2="65" y2="58" stroke="#000" strokeWidth="2" />
      </g>

      {/* Inner border decoration */}
      <polygon points="40,19 65,32 65,57 40,70 15,57 15,32" stroke="#d8b4fe" strokeWidth="1" opacity="0.5" />
    </svg>
  );
}
