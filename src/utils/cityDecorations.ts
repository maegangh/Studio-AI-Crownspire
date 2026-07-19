export interface CityDecoration {
  id: string;
  type: 'waterfall' | 'river' | 'tree' | 'statue' | 'flower' | 'flowers' | 'banner';
  name: string;
  x: number;          // absolute X coordinate in the 1120px canvas
  y: number;          // absolute Y coordinate in the 720px canvas
  width: number;
  height: number;
  graphicUrl: string; // Unsplash graphic or illustration path
  emojiFallback: string;
  zIndex?: string;    // custom z-index class
  description?: string;
  extraStyles?: string; // arbitrary tailwind style adjustments
}

export const CITY_DECORATIONS: CityDecoration[] = [
  // WATERFALL (high mountain cliff cascade feeding the rivers)
  {
    id: 'decor-waterfall-main',
    type: 'waterfall',
    name: 'Sovereign Cascade',
    x: 370,
    y: -10,
    width: 60,
    height: 120,
    graphicUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=200',
    emojiFallback: '💦',
    zIndex: 'z-10',
    description: 'Thundering mist-fueled crystal waterfall cascading from outer peaks.',
    extraStyles: 'rounded-b-full border-b-2 border-cyan-400/30'
  },
  
  // RIVERS (winding blue river segments crossing the city)
  {
    id: 'decor-river-bend-1',
    type: 'river',
    name: 'Valerius Stream',
    x: 340,
    y: 110,
    width: 80,
    height: 160,
    graphicUrl: 'https://images.unsplash.com/photo-1508873696983-2df519f0397e?auto=format&fit=crop&q=80&w=200',
    emojiFallback: '🌊',
    zIndex: 'z-0',
    description: 'Fresh royal valley headwaters flowing down past the Citadel.'
  },
  {
    id: 'decor-river-bend-2',
    type: 'river',
    name: 'Misty Estuary',
    x: 180,
    y: 420,
    width: 150,
    height: 140,
    graphicUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=200',
    emojiFallback: '🌊',
    zIndex: 'z-0',
    description: 'Wide flowing channel running beneath the Elder bridge.'
  },

  // TREES (forest woodlands, sacred groves and blossom bushes)
  {
    id: 'tree-ancient-1',
    type: 'tree',
    name: 'Yggdrasil Sapling',
    x: 40,
    y: 190,
    width: 48,
    height: 48,
    graphicUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=150',
    emojiFallback: '🌳',
    zIndex: 'z-10',
    extraStyles: 'scale-110 sepia-[10%] hue-rotate-15'
  },
  {
    id: 'tree-citadel-left',
    type: 'tree',
    name: 'Gilded Pine',
    x: 410,
    y: 200,
    width: 42,
    height: 42,
    graphicUrl: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=150',
    emojiFallback: '🌲',
    zIndex: 'z-20'
  },
  {
    id: 'tree-citadel-right',
    type: 'tree',
    name: 'Gilded Pine',
    x: 660,
    y: 200,
    width: 42,
    height: 42,
    graphicUrl: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=150',
    emojiFallback: '🌲',
    zIndex: 'z-20'
  },
  {
    id: 'tree-woodland-lumber-1',
    type: 'tree',
    name: 'Highland Spruce',
    x: 850,
    y: 30,
    width: 45,
    height: 45,
    graphicUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=150',
    emojiFallback: '🌲',
    zIndex: 'z-10'
  },
  {
    id: 'tree-woodland-lumber-2',
    type: 'tree',
    name: 'Highland Spruce',
    x: 1040,
    y: 60,
    width: 42,
    height: 42,
    graphicUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=150',
    emojiFallback: '🌲',
    zIndex: 'z-10'
  },
  {
    id: 'tree-shrine-grove-1',
    type: 'tree',
    name: 'Eldritch Cherry',
    x: 820,
    y: 470,
    width: 40,
    height: 40,
    graphicUrl: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&q=80&w=150',
    emojiFallback: '🌸',
    zIndex: 'z-10',
    extraStyles: 'animate-pulse'
  },
  {
    id: 'tree-shrine-grove-2',
    type: 'tree',
    name: 'Eldritch Cherry',
    x: 1010,
    y: 450,
    width: 42,
    height: 42,
    graphicUrl: 'https://images.unsplash.com/photo-1528183429752-a97d0bf99b5a?auto=format&fit=crop&q=80&w=150',
    emojiFallback: '🌸',
    zIndex: 'z-10'
  },
  {
    id: 'tree-southern-ridge-1',
    type: 'tree',
    name: 'Deepwood Oak',
    x: 420,
    y: 475,
    width: 45,
    height: 45,
    graphicUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=150',
    emojiFallback: '🌳',
    zIndex: 'z-20'
  },
  {
    id: 'tree-southern-ridge-2',
    type: 'tree',
    name: 'Deepwood Oak',
    x: 640,
    y: 475,
    width: 45,
    height: 45,
    graphicUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&q=80&w=150',
    emojiFallback: '🌳',
    zIndex: 'z-20'
  },

  // STATUES (Sovereign monument and dragon guards)
  {
    id: 'decor-statue-heroic',
    type: 'statue',
    name: 'Statue of the Founder',
    x: 540,
    y: 410,
    width: 40,
    height: 60,
    graphicUrl: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=150',
    emojiFallback: '🗿',
    zIndex: 'z-20',
    description: 'Granite and gold memorial honoring High King Justin I.'
  },
  {
    id: 'decor-statue-dragon-l',
    type: 'statue',
    name: 'Sovereign Dragon (Left)',
    x: 390,
    y: 350,
    width: 32,
    height: 45,
    graphicUrl: 'https://images.unsplash.com/photo-1599727495394-4d20365778ef?auto=format&fit=crop&q=80&w=150',
    emojiFallback: '🐉',
    zIndex: 'z-20',
    description: 'Onyx gargoyle statue guarding western Citadel passage.'
  },
  {
    id: 'decor-statue-dragon-r',
    type: 'statue',
    name: 'Sovereign Dragon (Right)',
    x: 695,
    y: 350,
    width: 32,
    height: 45,
    graphicUrl: 'https://images.unsplash.com/photo-1599727495394-4d20365778ef?auto=format&fit=crop&q=80&w=150',
    emojiFallback: '🐉',
    zIndex: 'z-20',
    description: 'Onyx gargoyle statue guarding eastern Citadel passage.'
  },

  // FLOWERS (royal gardens and wild flowerbed patches)
  {
    id: 'decor-flowerbed-academy',
    type: 'flowers',
    name: 'Intellect Lily Garden',
    x: 230,
    y: 110,
    width: 30,
    height: 25,
    graphicUrl: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&q=80&w=100',
    emojiFallback: '🌸',
    zIndex: 'z-10',
    description: 'Sweet glowing blooms said to sharpen scholarly insights.'
  },
  {
    id: 'decor-flowerbed-citadel-l',
    type: 'flowers',
    name: 'Sovereign Rose Bed',
    x: 430,
    y: 280,
    width: 40,
    height: 25,
    graphicUrl: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&q=80&w=100',
    emojiFallback: '🌹',
    zIndex: 'z-20'
  },
  {
    id: 'decor-flowerbed-citadel-r',
    type: 'flowers',
    name: 'Sovereign Rose Bed',
    x: 650,
    y: 280,
    width: 40,
    height: 25,
    graphicUrl: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&q=80&w=100',
    emojiFallback: '🌹',
    zIndex: 'z-20'
  },
  {
    id: 'decor-flowerbed-shrine',
    type: 'flowers',
    name: 'Lotus Blossom Basin',
    x: 770,
    y: 475,
    width: 32,
    height: 25,
    graphicUrl: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&q=80&w=100',
    emojiFallback: '✨',
    zIndex: 'z-10'
  },

  // BANNERS (Royal flags and military standards)
  {
    id: 'decor-banner-citadel-l',
    type: 'banner',
    name: 'Crownspire Standard (L)',
    x: 445,
    y: 240,
    width: 16,
    height: 48,
    graphicUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=100',
    emojiFallback: '🚩',
    zIndex: 'z-40',
    description: 'Crimson-gold sovereign coat-of-arms banner.'
  },
  {
    id: 'decor-banner-citadel-r',
    type: 'banner',
    name: 'Crownspire Standard (R)',
    x: 655,
    y: 240,
    width: 16,
    height: 48,
    graphicUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=100',
    emojiFallback: '🚩',
    zIndex: 'z-40'
  },
  {
    id: 'decor-banner-barracks',
    type: 'banner',
    name: 'Warmonger Standard',
    x: 215,
    y: 390,
    width: 18,
    height: 52,
    graphicUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&q=80&w=100',
    emojiFallback: '⚔️',
    zIndex: 'z-30',
    description: 'Fierce battle Standard marking the recruits enlistment queue.'
  }
];
