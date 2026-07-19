export interface CityBuildingLayout {
  id: string;
  name: string;
  imagePath: string;
  x: number;      // absolute X coordinate in the 1120px canvas
  y: number;      // absolute Y coordinate in the 720px canvas
  width: number;
  height: number;
  zIndex?: string;
}

export const CITY_LAYOUTS: CityBuildingLayout[] = [
  {
    id: 'castle',
    name: 'Citadel',
    imagePath: '/assets/buildings/citadel.png',
    x: 440,
    y: 270,
    width: 240,
    height: 180,
    zIndex: 'z-30'
  },
  {
    id: 'warehouse',
    name: 'Warehouse',
    imagePath: '/assets/buildings/warehouse.png',
    x: 495,
    y: 100,
    width: 130,
    height: 110,
    zIndex: 'z-10'
  },
  {
    id: 'academy',
    name: 'Research Hall',
    imagePath: '/assets/buildings/academy.png',
    x: 260,
    y: 150,
    width: 130,
    height: 110,
    zIndex: 'z-20'
  },
  {
    id: 'embassy',
    name: 'Embassy',
    imagePath: '/assets/buildings/embassy.png',
    x: 730,
    y: 150,
    width: 130,
    height: 110,
    zIndex: 'z-20'
  },
  {
    id: 'hall_of_heroes',
    name: 'Hall of Heroes',
    imagePath: '/assets/buildings/hall_of_heroes.png',
    x: 870,
    y: 190,
    width: 130,
    height: 110,
    zIndex: 'z-20'
  },
  {
    id: 'trading_post',
    name: 'Trading Post',
    imagePath: '/assets/buildings/trading_post.png',
    x: 120,
    y: 190,
    width: 130,
    height: 110,
    zIndex: 'z-20'
  },
  {
    id: 'farm',
    name: 'Farm',
    imagePath: '/assets/buildings/farm.png',
    x: 100,
    y: 550,
    width: 130,
    height: 110,
    zIndex: 'z-10'
  },
  {
    id: 'lumber_mill',
    name: 'Lumber Mill',
    imagePath: '/assets/buildings/lumber_mill.png',
    x: 340,
    y: 550,
    width: 130,
    height: 110,
    zIndex: 'z-10'
  },
  {
    id: 'quarry',
    name: 'Quarry',
    imagePath: '/assets/buildings/quarry.png',
    x: 650,
    y: 550,
    width: 130,
    height: 110,
    zIndex: 'z-20'
  },
  {
    id: 'iron_mine',
    name: 'Iron Mine',
    imagePath: '/assets/buildings/iron_mine.png',
    x: 890,
    y: 550,
    width: 130,
    height: 110,
    zIndex: 'z-20'
  },
  {
    id: 'hospital',
    name: 'Hospital',
    imagePath: '/assets/buildings/hospital.png',
    x: 120,
    y: 450,
    width: 130,
    height: 110,
    zIndex: 'z-20'
  },
  {
    id: 'sanctuary',
    name: 'Sanctuary',
    imagePath: '/assets/buildings/sanctuary.png',
    x: 870,
    y: 450,
    width: 130,
    height: 110,
    zIndex: 'z-20'
  },
  {
    id: 'infantry_barracks',
    name: 'Infantry Barracks',
    imagePath: '/assets/buildings/infantry_barracks.png',
    x: 180,
    y: 310,
    width: 135,
    height: 115,
    zIndex: 'z-20'
  },
  {
    id: 'marksmen_camp',
    name: 'Marksmen Camp',
    imagePath: '/assets/buildings/marksmen_camp.png',
    x: 300,
    y: 410,
    width: 135,
    height: 115,
    zIndex: 'z-20'
  },
  {
    id: 'cavalry_stable',
    name: 'Cavalry Stable',
    imagePath: '/assets/buildings/cavalry_stable.png',
    x: 805,
    y: 310,
    width: 135,
    height: 115,
    zIndex: 'z-20'
  },
  {
    id: 'watchtower',
    name: 'Watchtower',
    imagePath: '/assets/buildings/watchtower.png',
    x: 685,
    y: 410,
    width: 135,
    height: 115,
    zIndex: 'z-20'
  },
  {
    id: 'crystal_vault',
    name: 'Crystal Vault',
    imagePath: '/assets/buildings/shrine.png',
    x: 495,
    y: 520,
    width: 135,
    height: 115,
    zIndex: 'z-30'
  }
];
