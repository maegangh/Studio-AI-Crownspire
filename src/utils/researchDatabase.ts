import { ResearchNode, ResourceCost, ResearchPrerequisite, ResearchBonus } from '../types';

interface RawNodeMeta {
  id: string;
  name: string;
  category: 'economy' | 'military' | 'development' | 'alliance' | 'hero';
  description: string;
  maxLevel: number;
  baseCost: ResourceCost;
  costScale: number;
  baseDurationSec: number;
  durationScale: number;
  prerequisites: ResearchPrerequisite[];
  bonuses: ResearchBonus[];
  iconName?: string;
}

// Low-volume metadata containing 100 rich and unique Crownspire research nodes.
// Designed with fantasy-lore descriptions fitting the high-magic medieval theme.
const RAW_RESEARCH_METADATA: RawNodeMeta[] = [
  // ======================================
  // 1. ECONOMY RESEARCH NODES (20 NODES)
  // ======================================
  {
    id: 'econ_food_prod_1',
    name: 'Citadel Irrigation I',
    category: 'economy',
    description: 'Establish standard stone aqueducts and sluice gates to double riverbed soil fertility.',
    maxLevel: 5,
    baseCost: { food: 150, wood: 100 },
    costScale: 1.45,
    baseDurationSec: 15,
    durationScale: 1.5,
    prerequisites: [],
    bonuses: [{ type: 'Food Production', valuePerLevel: 0.10, isPercentage: true }],
    iconName: 'Award'
  },
  {
    id: 'econ_food_prod_2',
    name: 'Citadel Irrigation II',
    category: 'economy',
    description: 'Draft steam-geared waterworks to carry continuous moisture to dry, high-altitude clay soil.',
    maxLevel: 5,
    baseCost: { food: 600, wood: 450, stone: 300 },
    costScale: 1.5,
    baseDurationSec: 45,
    durationScale: 1.5,
    prerequisites: [{ researchId: 'econ_food_prod_1', level: 3 }],
    bonuses: [{ type: 'Food Production', valuePerLevel: 0.15, isPercentage: true }],
    iconName: 'Award'
  },
  {
    id: 'econ_food_prod_3',
    name: 'Sovereign Hydro-Arable Fields',
    category: 'economy',
    description: 'Introduce magical subterranean moisture nodes that nourish wheat fields in dead winter.',
    maxLevel: 5,
    baseCost: { food: 2500, wood: 1800, stone: 1500, iron: 500 },
    costScale: 1.55,
    baseDurationSec: 120,
    durationScale: 1.6,
    prerequisites: [{ researchId: 'econ_food_prod_2', level: 4 }],
    bonuses: [{ type: 'Food Production', valuePerLevel: 0.25, isPercentage: true }],
    iconName: 'Sparkles'
  },
  {
    id: 'econ_wood_prod_1',
    name: 'Eldergrove Sawmills I',
    category: 'economy',
    description: 'Implement iron-toothed pulley saws to accelerate standard log timber refinement.',
    maxLevel: 5,
    baseCost: { food: 100, wood: 150 },
    costScale: 1.45,
    baseDurationSec: 15,
    durationScale: 1.5,
    prerequisites: [],
    bonuses: [{ type: 'Wood Production', valuePerLevel: 0.10, isPercentage: true }],
    iconName: 'Award'
  },
  {
    id: 'econ_wood_prod_2',
    name: 'Eldergrove Sawmills II',
    category: 'economy',
    description: 'Reorganize lumber stockpiles with overhead rail trolleys to eliminate manual log carrying.',
    maxLevel: 5,
    baseCost: { food: 450, wood: 600, stone: 300 },
    costScale: 1.5,
    baseDurationSec: 45,
    durationScale: 1.5,
    prerequisites: [{ researchId: 'econ_wood_prod_1', level: 3 }],
    bonuses: [{ type: 'Wood Production', valuePerLevel: 0.15, isPercentage: true }],
    iconName: 'Award'
  },
  {
    id: 'econ_wood_prod_3',
    name: 'Aether-Enchanted Forestry',
    category: 'economy',
    description: 'Apply growth-stimulating green wood-runes that cause felled giant conifers to rebuild within weeks.',
    maxLevel: 5,
    baseCost: { food: 1800, wood: 2500, stone: 1500, iron: 500 },
    costScale: 1.55,
    baseDurationSec: 120,
    durationScale: 1.6,
    prerequisites: [{ researchId: 'econ_wood_prod_2', level: 4 }],
    bonuses: [{ type: 'Wood Production', valuePerLevel: 0.25, isPercentage: true }],
    iconName: 'Sparkles'
  },
  {
    id: 'econ_stone_prod_1',
    name: 'Crownspire Quarrying I',
    category: 'economy',
    description: 'Leverage steel stone-cleaving wedges to break flawless marble blocks from high canyon cliffs.',
    maxLevel: 5,
    baseCost: { wood: 150, stone: 150 },
    costScale: 1.45,
    baseDurationSec: 20,
    durationScale: 1.5,
    prerequisites: [],
    bonuses: [{ type: 'Stone Production', valuePerLevel: 0.10, isPercentage: true }],
    iconName: 'Award'
  },
  {
    id: 'econ_stone_prod_2',
    name: 'Crownspire Quarrying II',
    category: 'economy',
    description: 'Deploy weighted crane lifts to hoist gargantuan rubble blocks from the deep bedrock pit of the crater.',
    maxLevel: 5,
    baseCost: { wood: 500, stone: 700, iron: 250 },
    costScale: 1.5,
    baseDurationSec: 50,
    durationScale: 1.5,
    prerequisites: [{ researchId: 'econ_stone_prod_1', level: 3 }],
    bonuses: [{ type: 'Stone Production', valuePerLevel: 0.15, isPercentage: true }],
    iconName: 'Award'
  },
  {
    id: 'econ_stone_prod_3',
    name: 'Demolition Runic Sigils',
    category: 'economy',
    description: 'Engrave micro-shattering runic syllables into heavy hammers so granite fragments under a single tap.',
    maxLevel: 5,
    baseCost: { food: 1500, wood: 1500, stone: 3000, iron: 800 },
    costScale: 1.55,
    baseDurationSec: 130,
    durationScale: 1.6,
    prerequisites: [{ researchId: 'econ_stone_prod_2', level: 4 }],
    bonuses: [{ type: 'Stone Production', valuePerLevel: 0.25, isPercentage: true }],
    iconName: 'Sparkles'
  },
  {
    id: 'econ_iron_prod_1',
    name: 'Deepground Metal Smelting I',
    category: 'economy',
    description: 'Inject high-pressure bellows draft tubes to reach stellar temperatures in charcoal iron ovens.',
    maxLevel: 5,
    baseCost: { wood: 200, stone: 200 },
    costScale: 1.45,
    baseDurationSec: 30,
    durationScale: 1.5,
    prerequisites: [],
    bonuses: [{ type: 'Iron Production', valuePerLevel: 0.10, isPercentage: true }],
    iconName: 'Award'
  },
  {
    id: 'econ_iron_prod_2',
    name: 'Deepground Metal Smelting II',
    category: 'economy',
    description: 'Integrate coal mixing furnaces to reduce carbon impurities and maximize heavy bullion cast yields.',
    maxLevel: 5,
    baseCost: { wood: 600, stone: 600, iron: 450 },
    costScale: 1.5,
    baseDurationSec: 60,
    durationScale: 1.5,
    prerequisites: [{ researchId: 'econ_iron_prod_1', level: 3 }],
    bonuses: [{ type: 'Iron Production', valuePerLevel: 0.15, isPercentage: true }],
    iconName: 'Award'
  },
  {
    id: 'econ_iron_prod_3',
    name: 'Elemental Ingot Purification',
    category: 'economy',
    description: 'Infuse white-hot lava ores with igneous core spirits to separate raw magnetic ores from granite slate.',
    maxLevel: 5,
    baseCost: { food: 1500, wood: 1500, stone: 2000, iron: 2500 },
    costScale: 1.55,
    baseDurationSec: 140,
    durationScale: 1.6,
    prerequisites: [{ researchId: 'econ_iron_prod_2', level: 4 }],
    bonuses: [{ type: 'Iron Production', valuePerLevel: 0.25, isPercentage: true }],
    iconName: 'Sparkles'
  },
  {
    id: 'econ_gather_food',
    name: 'Pony Express Grain Logistics',
    category: 'economy',
    description: 'Establish standard military grain waystations so pack mules can rest and offload wheat immediately.',
    maxLevel: 5,
    baseCost: { food: 200, wood: 100 },
    costScale: 1.4,
    baseDurationSec: 20,
    durationScale: 1.4,
    prerequisites: [],
    bonuses: [{ type: 'Gathering Speed', valuePerLevel: 0.05, isPercentage: true }],
    iconName: 'Compass'
  },
  {
    id: 'econ_gather_wood',
    name: 'Heavy-Duty Wagon Suspension',
    category: 'economy',
    description: 'Equip cargo wagons with reinforced iron-bound spring rails to survive giant forest ruts with heavy lumber.',
    maxLevel: 5,
    baseCost: { wood: 200, stone: 100 },
    costScale: 1.4,
    baseDurationSec: 20,
    durationScale: 1.4,
    prerequisites: [],
    bonuses: [{ type: 'Gathering Speed', valuePerLevel: 0.05, isPercentage: true }],
    iconName: 'Compass'
  },
  {
    id: 'econ_gather_stone',
    name: 'Caravan Guard Cartography',
    category: 'economy',
    description: 'Map out smooth mountain tracks that shave off hours from lumbering heavy quarry blocks.',
    maxLevel: 5,
    baseCost: { stone: 200, wood: 100 },
    costScale: 1.4,
    baseDurationSec: 20,
    durationScale: 1.4,
    prerequisites: [],
    bonuses: [{ type: 'Gathering Speed', valuePerLevel: 0.05, isPercentage: true }],
    iconName: 'Compass'
  },
  {
    id: 'econ_gather_iron',
    name: 'Reinforced Bed Cargo Holds',
    category: 'economy',
    description: 'Widen carriage wooden cargo platforms with side steel guard stakes to stack deep iron slag safely.',
    maxLevel: 5,
    baseCost: { stone: 100, iron: 150 },
    costScale: 1.4,
    baseDurationSec: 25,
    durationScale: 1.4,
    prerequisites: [],
    bonuses: [{ type: 'Gathering Speed', valuePerLevel: 0.05, isPercentage: true }],
    iconName: 'Compass'
  },
  {
    id: 'econ_gathering_speed',
    name: 'Toll-Road Caravan Permits',
    category: 'economy',
    description: 'Authorize high-speed sovereign road passes that allow trade merchants to bypass border tolls and skip gridlock.',
    maxLevel: 5,
    baseCost: { food: 500, wood: 500, stone: 500 },
    costScale: 1.5,
    baseDurationSec: 40,
    durationScale: 1.5,
    prerequisites: [{ researchId: 'econ_gather_food', level: 2 }, { researchId: 'econ_gather_wood', level: 2 }],
    bonuses: [{ type: 'Gathering Speed', valuePerLevel: 0.08, isPercentage: true }],
    iconName: 'Compass'
  },
  {
    id: 'econ_tax_efficiency',
    name: 'Crown Sovereignty Assizes',
    category: 'economy',
    description: 'Standardize tax weights, eliminating corrupted middleman tariffs across district checkpoints.',
    maxLevel: 5,
    baseCost: { food: 1000, wood: 1000, stone: 800 },
    costScale: 1.45,
    baseDurationSec: 60,
    durationScale: 1.5,
    prerequisites: [],
    bonuses: [{ type: 'Resource Cost Discount', valuePerLevel: 0.03, isPercentage: true }],
    iconName: 'Crown'
  },
  {
    id: 'econ_storage_preserv',
    name: 'Aetheric Granary Insulation',
    category: 'economy',
    description: 'Weave subtle salt-crystals and protective runes into granary walls to prevent rot from damp fall air.',
    maxLevel: 5,
    baseCost: { stone: 600, wood: 600 },
    costScale: 1.45,
    baseDurationSec: 35,
    durationScale: 1.4,
    prerequisites: [],
    bonuses: [{ type: 'Storage Capacity', valuePerLevel: 0.15, isPercentage: true }],
    iconName: 'Crown'
  },
  {
    id: 'econ_waste_reduction',
    name: 'Zero-Waste Harvest Mandates',
    category: 'economy',
    description: 'Enact municipal commands regarding total carcass and crop stalk usage to capture every single leaf.',
    maxLevel: 5,
    baseCost: { food: 1500, iron: 500 },
    costScale: 1.5,
    baseDurationSec: 80,
    durationScale: 1.5,
    prerequisites: [{ researchId: 'econ_tax_efficiency', level: 2 }],
    bonuses: [{ type: 'Food Production', valuePerLevel: 0.10, isPercentage: true }, { type: 'Wood Production', valuePerLevel: 0.10, isPercentage: true }],
    iconName: 'Award'
  },

  // ======================================
  // 2. MILITARY RESEARCH NODES (20 NODES)
  // ======================================
  {
    id: 'mil_inf_atk_1',
    name: 'Pike Wall Formations I',
    category: 'military',
    description: 'Train frontline foot soldiers to bind spears into nested walls, multiplying direct strike thrust energy.',
    maxLevel: 5,
    baseCost: { food: 200, iron: 100 },
    costScale: 1.5,
    baseDurationSec: 20,
    durationScale: 1.5,
    prerequisites: [],
    bonuses: [{ type: 'Infantry Attack', valuePerLevel: 0.08, isPercentage: true }],
    iconName: 'Sword'
  },
  {
    id: 'mil_inf_atk_2',
    name: 'Pike Wall Formations II',
    category: 'military',
    description: 'Deploy weighted carbonized ash spears that do not shatter when absorbing heavy cavalry impacts.',
    maxLevel: 5,
    baseCost: { food: 800, stone: 400, iron: 600 },
    costScale: 1.55,
    baseDurationSec: 60,
    durationScale: 1.5,
    prerequisites: [{ researchId: 'mil_inf_atk_1', level: 3 }],
    bonuses: [{ type: 'Infantry Attack', valuePerLevel: 0.12, isPercentage: true }],
    iconName: 'Sword'
  },
  {
    id: 'mil_inf_def_1',
    name: 'Heavy Iron Roundshields I',
    category: 'military',
    description: 'Cast standard iron shields with convex center bosses to easily deflect heavy arrow hails.',
    maxLevel: 5,
    baseCost: { wood: 150, iron: 150 },
    costScale: 1.5,
    baseDurationSec: 20,
    durationScale: 1.5,
    prerequisites: [],
    bonuses: [{ type: 'Infantry Defense', valuePerLevel: 0.08, isPercentage: true }],
    iconName: 'Shield'
  },
  {
    id: 'mil_inf_def_2',
    name: 'Heavy Iron Roundshields II',
    category: 'military',
    description: 'Reinforce defensive shield walls with locking brass side hinges to block heavy kinetic broadsides.',
    maxLevel: 5,
    baseCost: { wood: 500, stone: 400, iron: 800 },
    costScale: 1.55,
    baseDurationSec: 60,
    durationScale: 1.5,
    prerequisites: [{ researchId: 'mil_inf_def_1', level: 3 }],
    bonuses: [{ type: 'Infantry Defense', valuePerLevel: 0.12, isPercentage: true }],
    iconName: 'Shield'
  },
  {
    id: 'mil_inf_hp_1',
    name: 'Infantry Stature Training',
    category: 'military',
    description: 'Drill fresh conscripts in weighted sand running under burning daylight to harden vital stamina.',
    maxLevel: 5,
    baseCost: { food: 400, wood: 200 },
    costScale: 1.45,
    baseDurationSec: 30,
    durationScale: 1.4,
    prerequisites: [],
    bonuses: [{ type: 'Infantry Health', valuePerLevel: 0.06, isPercentage: true }],
    iconName: 'ShieldAlert'
  },
  {
    id: 'mil_mark_atk_1',
    name: 'Compound Composite Longbows I',
    category: 'military',
    description: 'Drape longbow frames in laminated horn and sinew bands to increase projectile pull velocity.',
    maxLevel: 5,
    baseCost: { food: 150, wood: 200 },
    costScale: 1.5,
    baseDurationSec: 20,
    durationScale: 1.5,
    prerequisites: [],
    bonuses: [{ type: 'Marksmen Attack', valuePerLevel: 0.08, isPercentage: true }],
    iconName: 'Sword'
  },
  {
    id: 'mil_mark_atk_2',
    name: 'Compound Composite Longbows II',
    category: 'military',
    description: 'Standardize narrow, armor-piercing iron bodkin tips to penetrate heavy enemy metal plate.',
    maxLevel: 5,
    baseCost: { food: 500, wood: 800, iron: 550 },
    costScale: 1.55,
    baseDurationSec: 65,
    durationScale: 1.5,
    prerequisites: [{ researchId: 'mil_mark_atk_1', level: 3 }],
    bonuses: [{ type: 'Marksmen Attack', valuePerLevel: 0.12, isPercentage: true }],
    iconName: 'Sword'
  },
  {
    id: 'mil_mark_def_1',
    name: 'Leather Brigandine Padding I',
    category: 'military',
    description: 'Stitch light metal plates inside supple elk leather vests to protect high-mobility elite archers.',
    maxLevel: 5,
    baseCost: { wood: 200, iron: 100 },
    costScale: 1.5,
    baseDurationSec: 20,
    durationScale: 1.5,
    prerequisites: [],
    bonuses: [{ type: 'Marksmen Defense', valuePerLevel: 0.08, isPercentage: true }],
    iconName: 'Shield'
  },
  {
    id: 'mil_mark_def_2',
    name: 'Leather Brigandine Padding II',
    category: 'military',
    description: 'Integrate custom-boiled heavy splinted thigh guards to block low sweeps by heavy charging infantry.',
    maxLevel: 5,
    baseCost: { wood: 700, stone: 300, iron: 700 },
    costScale: 1.55,
    baseDurationSec: 65,
    durationScale: 1.5,
    prerequisites: [{ researchId: 'mil_mark_def_1', level: 3 }],
    bonuses: [{ type: 'Marksmen Defense', valuePerLevel: 0.12, isPercentage: true }],
    iconName: 'Shield'
  },
  {
    id: 'mil_mark_hp_1',
    name: 'Marksmen Breathing Control',
    category: 'military',
    description: 'Instruct range-combat cohorts to sync arrows with stable heart rhythms, extending pulse limits.',
    maxLevel: 5,
    baseCost: { food: 350, wood: 250 },
    costScale: 1.45,
    baseDurationSec: 30,
    durationScale: 1.4,
    prerequisites: [],
    bonuses: [{ type: 'Marksmen Health', valuePerLevel: 0.06, isPercentage: true }],
    iconName: 'ShieldAlert'
  },
  {
    id: 'mil_cav_atk_1',
    name: 'Royal Lances & Shock Saddles I',
    category: 'military',
    description: 'Anchor heavy high-backed wooden war saddles, allowing full heavy lance strikes directly on horseback.',
    maxLevel: 5,
    baseCost: { food: 250, wood: 100, iron: 150 },
    costScale: 1.5,
    baseDurationSec: 25,
    durationScale: 1.5,
    prerequisites: [],
    bonuses: [{ type: 'Cavalry Attack', valuePerLevel: 0.08, isPercentage: true }],
    iconName: 'Sword'
  },
  {
    id: 'mil_cav_atk_2',
    name: 'Royal Lances & Shock Saddles II',
    category: 'military',
    description: 'Forge double-edged steel lance heads blessed in sanctuary light to punch right through tower walls.',
    maxLevel: 5,
    baseCost: { food: 1000, wood: 400, iron: 900 },
    costScale: 1.55,
    baseDurationSec: 75,
    durationScale: 1.5,
    prerequisites: [{ researchId: 'mil_cav_atk_1', level: 3 }],
    bonuses: [{ type: 'Cavalry Attack', valuePerLevel: 0.12, isPercentage: true }],
    iconName: 'Sword'
  },
  {
    id: 'mil_cav_def_1',
    name: 'Reinforced Steel Barding I',
    category: 'military',
    description: 'Drape equine shoulders in double-layered leather caparisons to stop light flying arrow storms.',
    maxLevel: 5,
    baseCost: { wood: 150, iron: 200 },
    costScale: 1.5,
    baseDurationSec: 25,
    durationScale: 1.5,
    prerequisites: [],
    bonuses: [{ type: 'Cavalry Defense', valuePerLevel: 0.08, isPercentage: true }],
    iconName: 'Shield'
  },
  {
    id: 'mil_cav_def_2',
    name: 'Reinforced Steel Barding II',
    category: 'military',
    description: 'Rig jointed steel plates fitted cleanly on destrier legs to safely ride over razor-sharp pike rows.',
    maxLevel: 5,
    baseCost: { wood: 500, stone: 300, iron: 1000 },
    costScale: 1.55,
    baseDurationSec: 75,
    durationScale: 1.5,
    prerequisites: [{ researchId: 'mil_cav_def_1', level: 3 }],
    bonuses: [{ type: 'Cavalry Defense', valuePerLevel: 0.12, isPercentage: true }],
    iconName: 'Shield'
  },
  {
    id: 'mil_cav_hp_1',
    name: 'Cavalry Steed Endurance',
    category: 'military',
    description: 'Breed noble stallion lines fed in mountain clover fields to boost standard life-force resilience.',
    maxLevel: 5,
    baseCost: { food: 500, wood: 200 },
    costScale: 1.45,
    baseDurationSec: 30,
    durationScale: 1.4,
    prerequisites: [],
    bonuses: [{ type: 'Cavalry Health', valuePerLevel: 0.06, isPercentage: true }],
    iconName: 'ShieldAlert'
  },
  {
    id: 'mil_march_cap_1',
    name: 'Supply Chain Quartermasters',
    category: 'military',
    description: 'Appoint administrative logisticians to calculate marching rations, swelling standard squadron size.',
    maxLevel: 5,
    baseCost: { food: 600, wood: 400 },
    costScale: 1.5,
    baseDurationSec: 40,
    durationScale: 1.5,
    prerequisites: [],
    bonuses: [{ type: 'March Capacity', valuePerLevel: 50, isPercentage: false }],
    iconName: 'Wind'
  },
  {
    id: 'mil_march_cap_2',
    name: 'Grand Campaign Caravan Lines',
    category: 'military',
    description: 'Double available campaign slots through nested high-wheel heavy carrier logistics arrays.',
    maxLevel: 5,
    baseCost: { food: 2000, wood: 1500, stone: 1000 },
    costScale: 1.55,
    baseDurationSec: 100,
    durationScale: 1.6,
    prerequisites: [{ researchId: 'mil_march_cap_1', level: 3 }],
    bonuses: [{ type: 'March Capacity', valuePerLevel: 150, isPercentage: false }],
    iconName: 'Wind'
  },
  {
    id: 'mil_scout_speed',
    name: 'Light-Saddle Outriders',
    category: 'military',
    description: 'Remove all non-essential iron weapons from scouts, allowing rapid swift map-probing rounds.',
    maxLevel: 5,
    baseCost: { food: 300, wood: 300 },
    costScale: 1.4,
    baseDurationSec: 25,
    durationScale: 1.4,
    prerequisites: [],
    bonuses: [{ type: 'Troop Speed', valuePerLevel: 0.05, isPercentage: true }],
    iconName: 'Compass'
  },
  {
    id: 'mil_overall_power',
    name: 'Crownspire Valor Doctrines',
    category: 'military',
    description: 'Enlist elite royal scholars to recite verses of the High Citadel, fueling universal soldier fury.',
    maxLevel: 5,
    baseCost: { food: 2000, stone: 1500, iron: 1500 },
    costScale: 1.6,
    baseDurationSec: 110,
    durationScale: 1.6,
    prerequisites: [{ researchId: 'mil_inf_atk_2', level: 2 }, { researchId: 'mil_mark_atk_2', level: 2 }, { researchId: 'mil_cav_atk_2', level: 2 }],
    bonuses: [{ type: 'Troop Attack', valuePerLevel: 0.05, isPercentage: true }, { type: 'Troop Defense', valuePerLevel: 0.05, isPercentage: true }],
    iconName: 'Crown'
  },
  {
    id: 'mil_tactician_shroud',
    name: 'Ambush Camouflage Drills',
    category: 'military',
    description: 'Instruct garrison watch guards to drape low outer walls in evergreen boughs and forest moss.',
    maxLevel: 5,
    baseCost: { wood: 500, stone: 500 },
    costScale: 1.45,
    baseDurationSec: 45,
    durationScale: 1.5,
    prerequisites: [],
    bonuses: [{ type: 'Troop Defense', valuePerLevel: 0.05, isPercentage: true }],
    iconName: 'ShieldAlert'
  },

  // ======================================
  // 3. DEVELOPMENT RESEARCH NODES (20 NODES)
  // ======================================
  {
    id: 'dev_const_speed_1',
    name: 'Runic Scaffold Engineering I',
    category: 'development',
    description: 'Draft interlocking spruce scaffolding that supports double concrete pouring loads.',
    maxLevel: 5,
    baseCost: { wood: 150, stone: 100 },
    costScale: 1.45,
    baseDurationSec: 15,
    durationScale: 1.5,
    prerequisites: [],
    bonuses: [{ type: 'Construction Speed', valuePerLevel: 0.05, isPercentage: true }],
    iconName: 'Hammer'
  },
  {
    id: 'dev_const_speed_2',
    name: 'Runic Scaffold Engineering II',
    category: 'development',
    description: 'Deploy leverage-balanced iron counterweights to haul heavy granite blocks up high levels.',
    maxLevel: 5,
    baseCost: { wood: 600, stone: 600, iron: 300 },
    costScale: 1.5,
    baseDurationSec: 45,
    durationScale: 1.5,
    prerequisites: [{ researchId: 'dev_const_speed_1', level: 3 }],
    bonuses: [{ type: 'Construction Speed', valuePerLevel: 0.08, isPercentage: true }],
    iconName: 'Hammer'
  },
  {
    id: 'dev_const_speed_3',
    name: 'Sub-Level Masonry Overhaul',
    category: 'development',
    description: 'Unfurl highly detailed pre-cut architectural blocks so buildings assemble block-by-block.',
    maxLevel: 5,
    baseCost: { wood: 2000, stone: 2500, iron: 1200 },
    costScale: 1.55,
    baseDurationSec: 120,
    durationScale: 1.6,
    prerequisites: [{ researchId: 'dev_const_speed_2', level: 4 }],
    bonuses: [{ type: 'Construction Speed', valuePerLevel: 0.12, isPercentage: true }],
    iconName: 'Sparkles'
  },
  {
    id: 'dev_res_speed_1',
    name: 'Grand Archive Scholasticism I',
    category: 'development',
    description: 'Introduce cross-referenced parchment scrolls, cutting library scanning times in half.',
    maxLevel: 5,
    baseCost: { food: 150, wood: 150 },
    costScale: 1.45,
    baseDurationSec: 15,
    durationScale: 1.5,
    prerequisites: [],
    bonuses: [{ type: 'Research Speed', valuePerLevel: 0.05, isPercentage: true }],
    iconName: 'Award'
  },
  {
    id: 'dev_res_speed_2',
    name: 'Grand Archive Scholasticism II',
    category: 'development',
    description: 'Authorize high-scholars access to the Inner Vaults to examine high ancient scroll files.',
    maxLevel: 5,
    baseCost: { food: 600, wood: 600, stone: 400 },
    costScale: 1.5,
    baseDurationSec: 50,
    durationScale: 1.5,
    prerequisites: [{ researchId: 'dev_res_speed_1', level: 3 }],
    bonuses: [{ type: 'Research Speed', valuePerLevel: 0.08, isPercentage: true }],
    iconName: 'Award'
  },
  {
    id: 'dev_res_speed_3',
    name: 'Aether Oracle Focus Lens',
    category: 'development',
    description: 'Suspend a hovering raw crystal magnifier above scholars to channel universal scientific ideas.',
    maxLevel: 5,
    baseCost: { food: 2000, wood: 2000, stone: 1500, iron: 1000 },
    costScale: 1.55,
    baseDurationSec: 130,
    durationScale: 1.6,
    prerequisites: [{ researchId: 'dev_res_speed_2', level: 4 }],
    bonuses: [{ type: 'Research Speed', valuePerLevel: 0.12, isPercentage: true }],
    iconName: 'Sparkles'
  },
  {
    id: 'dev_train_speed_1',
    name: 'Drill Sergeant Standardization I',
    category: 'development',
    description: 'Standardize commands to prevent confusion, shrinking the rookie training hours block.',
    maxLevel: 5,
    baseCost: { food: 200, wood: 100 },
    costScale: 1.45,
    baseDurationSec: 20,
    durationScale: 1.5,
    prerequisites: [],
    bonuses: [{ type: 'Training Speed', valuePerLevel: 0.05, isPercentage: true }],
    iconName: 'Hammer'
  },
  {
    id: 'dev_train_speed_2',
    name: 'Drill Sergeant Standardization II',
    category: 'development',
    description: 'Construct realistic wooden target dummies with spring shield arms to teach close-quarters dodge limits.',
    maxLevel: 5,
    baseCost: { food: 800, wood: 400, iron: 400 },
    costScale: 1.5,
    baseDurationSec: 50,
    durationScale: 1.5,
    prerequisites: [{ researchId: 'dev_train_speed_1', level: 3 }],
    bonuses: [{ type: 'Training Speed', valuePerLevel: 0.08, isPercentage: true }],
    iconName: 'Hammer'
  },
  {
    id: 'dev_train_speed_3',
    name: 'War Academy Call-To-Arms',
    category: 'development',
    description: 'Establish municipal draft centers that automatically fit raw farmers directly with pre-forged leather and swords.',
    maxLevel: 5,
    baseCost: { food: 2500, wood: 1500, stone: 1500, iron: 1200 },
    costScale: 1.55,
    baseDurationSec: 140,
    durationScale: 1.6,
    prerequisites: [{ researchId: 'dev_train_speed_2', level: 4 }],
    bonuses: [{ type: 'Training Speed', valuePerLevel: 0.12, isPercentage: true }],
    iconName: 'Sparkles'
  },
  {
    id: 'dev_heal_speed_1',
    name: 'Apothecary Ointment Reserves I',
    category: 'development',
    description: 'Boil high concentrations of swamp marigolds to extract rapid skin-knitting salve.',
    maxLevel: 5,
    baseCost: { food: 150, wood: 150 },
    costScale: 1.45,
    baseDurationSec: 20,
    durationScale: 1.5,
    prerequisites: [],
    bonuses: [{ type: 'Healing Speed', valuePerLevel: 0.08, isPercentage: true }],
    iconName: 'Award'
  },
  {
    id: 'dev_heal_speed_2',
    name: 'Apothecary Ointment Reserves II',
    category: 'development',
    description: 'Manufacture sterilizing silver-dust vapors to clear septic wounds in battlefield hospitals.',
    maxLevel: 5,
    baseCost: { food: 600, wood: 600, stone: 400 },
    costScale: 1.5,
    baseDurationSec: 50,
    durationScale: 1.5,
    prerequisites: [{ researchId: 'dev_heal_speed_1', level: 3 }],
    bonuses: [{ type: 'Healing Speed', valuePerLevel: 0.12, isPercentage: true }],
    iconName: 'Award'
  },
  {
    id: 'dev_heal_speed_3',
    name: 'Runic Sanctuary Infusions',
    category: 'development',
    description: 'Erect an arch of crystal quartz in medical halls to envelope recovering knights in raw life power.',
    maxLevel: 5,
    baseCost: { food: 2000, wood: 1500, stone: 1500, iron: 1000 },
    costScale: 1.55,
    baseDurationSec: 130,
    durationScale: 1.6,
    prerequisites: [{ researchId: 'dev_heal_speed_2', level: 4 }],
    bonuses: [{ type: 'Healing Speed', valuePerLevel: 0.20, isPercentage: true }],
    iconName: 'Sparkles'
  },
  {
    id: 'dev_house_capacity',
    name: 'Multi-Tier Citadel Tenements',
    category: 'development',
    description: 'Enforce narrow three-story building codes so twice as many housing blocks fit on a single platform street.',
    maxLevel: 5,
    baseCost: { wood: 500, stone: 500 },
    costScale: 1.45,
    baseDurationSec: 40,
    durationScale: 1.4,
    prerequisites: [],
    bonuses: [{ type: 'Population Max', valuePerLevel: 100, isPercentage: false }],
    iconName: 'Hammer'
  },
  {
    id: 'dev_store_food',
    name: 'Pest-Proof Underground Granary',
    category: 'development',
    description: 'Seal base granary vaults behind heavy double-latched iron trapdoors to lock out rats completely.',
    maxLevel: 5,
    baseCost: { stone: 300, wood: 300 },
    costScale: 1.4,
    baseDurationSec: 25,
    durationScale: 1.4,
    prerequisites: [],
    bonuses: [{ type: 'Storage Capacity', valuePerLevel: 0.20, isPercentage: true }],
    iconName: 'Crown'
  },
  {
    id: 'dev_store_wood',
    name: 'Dehumidified Timber Sheds',
    category: 'development',
    description: 'Install low charcoal furnace slots inside lumber stockpiles to dry giant cedar planks.',
    maxLevel: 5,
    baseCost: { stone: 300, wood: 300 },
    costScale: 1.4,
    baseDurationSec: 25,
    durationScale: 1.4,
    prerequisites: [],
    bonuses: [{ type: 'Storage Capacity', valuePerLevel: 0.20, isPercentage: true }],
    iconName: 'Crown'
  },
  {
    id: 'dev_store_stone',
    name: 'Reinforced Granite Yard Slots',
    category: 'development',
    description: 'Carve designated stack channels lined with wood cushions to hold massive slate blocks safely.',
    maxLevel: 5,
    baseCost: { stone: 400, wood: 200 },
    costScale: 1.4,
    baseDurationSec: 25,
    durationScale: 1.4,
    prerequisites: [],
    bonuses: [{ type: 'Storage Capacity', valuePerLevel: 0.20, isPercentage: true }],
    iconName: 'Crown'
  },
  {
    id: 'dev_store_iron',
    name: 'Coated Iron Vault Lining',
    category: 'development',
    description: 'Melt protective beeswax on storage lockers to prevent heavy metal ore oxidization.',
    maxLevel: 5,
    baseCost: { stone: 300, iron: 300 },
    costScale: 1.4,
    baseDurationSec: 30,
    durationScale: 1.4,
    prerequisites: [],
    bonuses: [{ type: 'Storage Capacity', valuePerLevel: 0.20, isPercentage: true }],
    iconName: 'Crown'
  },
  {
    id: 'dev_tax_bureaucracy',
    name: 'Revenue Office Standardization',
    category: 'development',
    description: 'Standardize tax books with ink scroll entries, squeezing more gold into state banks.',
    maxLevel: 5,
    baseCost: { food: 1000, wood: 1000 },
    costScale: 1.5,
    baseDurationSec: 50,
    durationScale: 1.5,
    prerequisites: [],
    bonuses: [{ type: 'Resource Cost Discount', valuePerLevel: 0.02, isPercentage: true }],
    iconName: 'Crown'
  },
  {
    id: 'dev_defense_walls',
    name: 'Bastion Perimeter Buttresses',
    category: 'development',
    description: 'Affix thick diagnostic triangular stone braces on outer fort corners to withstand projectile blows.',
    maxLevel: 5,
    baseCost: { stone: 1500, iron: 500 },
    costScale: 1.5,
    baseDurationSec: 90,
    durationScale: 1.5,
    prerequisites: [],
    bonuses: [{ type: 'Troop Defense', valuePerLevel: 0.05, isPercentage: true }],
    iconName: 'Shield'
  },
  {
    id: 'dev_scout_intelligence',
    name: 'Extended Spyglass Watchtowers',
    category: 'development',
    description: 'Grind precision convex ocular glass lenses to spot encroaching military columns miles away.',
    maxLevel: 5,
    baseCost: { wood: 800, stone: 800 },
    costScale: 1.45,
    baseDurationSec: 60,
    durationScale: 1.5,
    prerequisites: [],
    bonuses: [{ type: 'Troop Speed', valuePerLevel: 0.04, isPercentage: true }],
    iconName: 'Compass'
  },

  // ======================================
  // 4. ALLIANCE RESEARCH NODES (20 NODES)
  // ======================================
  {
    id: 'all_help_eff_1',
    name: 'Allied Envoy Protocols I',
    category: 'alliance',
    description: 'Open a permanent envoy desk inside the guild-hall, reducing allied cooperation lags.',
    maxLevel: 5,
    baseCost: { food: 200, wood: 200 },
    costScale: 1.4,
    baseDurationSec: 20,
    durationScale: 1.4,
    prerequisites: [],
    bonuses: [{ type: 'Alliance Help Efficiency', valuePerLevel: 0.05, isPercentage: true }],
    iconName: 'Award'
  },
  {
    id: 'all_help_eff_2',
    name: 'Allied Envoy Protocols II',
    category: 'alliance',
    description: 'Issue shared parchment registries, helping friendly builders sync work lines instantly.',
    maxLevel: 5,
    baseCost: { food: 800, wood: 800, stone: 500 },
    costScale: 1.45,
    baseDurationSec: 50,
    durationScale: 1.4,
    prerequisites: [{ researchId: 'all_help_eff_1', level: 3 }],
    bonuses: [{ type: 'Alliance Help Efficiency', valuePerLevel: 0.08, isPercentage: true }],
    iconName: 'Award'
  },
  {
    id: 'all_help_eff_3',
    name: 'Grand Citadel Help-Desk Delegacy',
    category: 'alliance',
    description: 'Dedicate an entire floor of the tower to incoming messenger pigeons from surrounding allies.',
    maxLevel: 5,
    baseCost: { food: 3000, wood: 3000, stone: 2000, iron: 1000 },
    costScale: 1.5,
    baseDurationSec: 120,
    durationScale: 1.5,
    prerequisites: [{ researchId: 'all_help_eff_2', level: 4 }],
    bonuses: [{ type: 'Alliance Help Efficiency', valuePerLevel: 0.12, isPercentage: true }],
    iconName: 'Sparkles'
  },
  {
    id: 'all_donation_eff_1',
    name: 'Guildmaster Trade Tollways I',
    category: 'alliance',
    description: 'Pave alliance-specific trade canals, boosting resource delivery rates to guild vaults.',
    maxLevel: 5,
    baseCost: { wood: 300, stone: 300 },
    costScale: 1.4,
    baseDurationSec: 25,
    durationScale: 1.4,
    prerequisites: [],
    bonuses: [{ type: 'Alliance Resource Donations', valuePerLevel: 0.10, isPercentage: true }],
    iconName: 'Award'
  },
  {
    id: 'all_donation_eff_2',
    name: 'Guildmaster Trade Tollways II',
    category: 'alliance',
    description: 'Deploy cargo wagons with double wood axle bands to reduce timber damage per delivery.',
    maxLevel: 5,
    baseCost: { wood: 1000, stone: 1000, iron: 400 },
    costScale: 1.45,
    baseDurationSec: 55,
    durationScale: 1.4,
    prerequisites: [{ researchId: 'all_donation_eff_1', level: 3 }],
    bonuses: [{ type: 'Alliance Resource Donations', valuePerLevel: 0.15, isPercentage: true }],
    iconName: 'Award'
  },
  {
    id: 'all_donation_eff_3',
    name: 'Tribute Convoy Escorts',
    category: 'alliance',
    description: 'Commission heavy armed spear-squads to ride side-by-side with trade caravan wagons.',
    maxLevel: 5,
    baseCost: { food: 2500, stone: 2500, iron: 2500 },
    costScale: 1.5,
    baseDurationSec: 130,
    durationScale: 1.5,
    prerequisites: [{ researchId: 'all_donation_eff_2', level: 4 }],
    bonuses: [{ type: 'Alliance Resource Donations', valuePerLevel: 0.25, isPercentage: true }],
    iconName: 'Sparkles'
  },
  {
    id: 'all_collab_science',
    name: 'Joint Scholastic Expeditions',
    category: 'alliance',
    description: 'Share raw archaeological field manuscripts with coalition scientists to unlock new studies.',
    maxLevel: 5,
    baseCost: { food: 800, wood: 800 },
    costScale: 1.45,
    baseDurationSec: 40,
    durationScale: 1.4,
    bonuses: [{ type: 'Research Speed', valuePerLevel: 0.05, isPercentage: true }],
    prerequisites: [],
    iconName: 'Crown'
  },
  {
    id: 'all_comm_speed',
    name: 'Aetheric Alliance Signal Towers',
    category: 'alliance',
    description: 'Build hilltop magic fire pots to transfer war details between towns instantly.',
    maxLevel: 5,
    baseCost: { wood: 500, stone: 500 },
    costScale: 1.4,
    baseDurationSec: 30,
    durationScale: 1.4,
    bonuses: [{ type: 'Troop Speed', valuePerLevel: 0.04, isPercentage: true }],
    prerequisites: [],
    iconName: 'Compass'
  },
  {
    id: 'all_def_support',
    name: 'Shield of the Vanguard Accord',
    category: 'alliance',
    description: 'Realign mutual protective defensive boundaries with friendly coalition border counts.',
    maxLevel: 5,
    baseCost: { stone: 600, iron: 300 },
    costScale: 1.45,
    baseDurationSec: 45,
    durationScale: 1.5,
    bonuses: [{ type: 'Troop Defense', valuePerLevel: 0.05, isPercentage: true }],
    prerequisites: [],
    iconName: 'Shield'
  },
  {
    id: 'all_atk_support',
    name: 'Blade of the Coalition Alliance',
    category: 'alliance',
    description: 'Establish shared weapon depots at border stations to arm alliance columns immediately.',
    maxLevel: 5,
    baseCost: { food: 600, iron: 400 },
    costScale: 1.45,
    baseDurationSec: 45,
    durationScale: 1.5,
    bonuses: [{ type: 'Troop Attack', valuePerLevel: 0.05, isPercentage: true }],
    prerequisites: [],
    iconName: 'Sword'
  },
  {
    id: 'all_loot_sharing',
    name: 'Coordinated Syndicate Spoils',
    category: 'alliance',
    description: 'Assign trade accountants to distribute raw raid scrap and resources from victory claims.',
    maxLevel: 5,
    baseCost: { food: 1000, wood: 1000 },
    costScale: 1.45,
    baseDurationSec: 50,
    durationScale: 1.4,
    bonuses: [{ type: 'Gathering Speed', valuePerLevel: 0.04, isPercentage: true }],
    prerequisites: [],
    iconName: 'Crown'
  },
  {
    id: 'all_rally_capacity',
    name: 'Assembly Horn Beacon Drills',
    category: 'alliance',
    description: 'Enact systemized assembly trumpets to pull multiple military heads into a single line quickly.',
    maxLevel: 5,
    baseCost: { food: 1500, wood: 1500 },
    costScale: 1.5,
    baseDurationSec: 80,
    durationScale: 1.5,
    bonuses: [{ type: 'March Capacity', valuePerLevel: 100, isPercentage: false }],
    prerequisites: [{ researchId: 'all_comm_speed', level: 2 }],
    iconName: 'Wind'
  },
  {
    id: 'all_camp_recovery',
    name: 'Campfire Rest Station Networks',
    category: 'alliance',
    description: 'Set up designated safe campfire points inside friendly territory maps for soldiers to recover.',
    maxLevel: 5,
    baseCost: { food: 800, wood: 800 },
    costScale: 1.4,
    baseDurationSec: 40,
    durationScale: 1.4,
    bonuses: [{ type: 'Healing Speed', valuePerLevel: 0.05, isPercentage: true }],
    prerequisites: [],
    iconName: 'Crown'
  },
  {
    id: 'all_march_reinforce',
    name: 'Fast-Response Liaison Cohorts',
    category: 'alliance',
    description: 'Pledge swift defense horse-riders that drop everything to rush to a besieged ally under warning fire.',
    maxLevel: 5,
    baseCost: { food: 1200, wood: 800, iron: 400 },
    costScale: 1.45,
    baseDurationSec: 60,
    durationScale: 1.4,
    bonuses: [{ type: 'Troop Speed', valuePerLevel: 0.08, isPercentage: true }],
    prerequisites: [],
    iconName: 'Compass'
  },
  {
    id: 'all_border_patrol',
    name: 'Coalition Bastion Cartography',
    category: 'alliance',
    description: 'Map border gaps to secure vulnerable mountain entries from flanking military hosts.',
    maxLevel: 5,
    baseCost: { stone: 1000, wood: 1000 },
    costScale: 1.4,
    baseDurationSec: 50,
    durationScale: 1.4,
    bonuses: [{ type: 'Troop Defense', valuePerLevel: 0.04, isPercentage: true }],
    prerequisites: [],
    iconName: 'Shield'
  },
  {
    id: 'all_resource_shuttle',
    name: 'Aerodynamic Carriage Fleets',
    category: 'alliance',
    description: 'Rig carriages with lightweight linen awnings to race assets safely under storm conditions.',
    maxLevel: 5,
    baseCost: { wood: 800, stone: 800 },
    costScale: 1.45,
    baseDurationSec: 45,
    durationScale: 1.4,
    bonuses: [{ type: 'Gathering Speed', valuePerLevel: 0.05, isPercentage: true }],
    prerequisites: [],
    iconName: 'Compass'
  },
  {
    id: 'all_merc_hiring',
    name: 'Alliance Contract Free-Companies',
    category: 'alliance',
    description: 'Draft master contract deals with regional sellswords to cut tavern hire values.',
    maxLevel: 5,
    baseCost: { food: 2000, iron: 800 },
    costScale: 1.5,
    baseDurationSec: 80,
    durationScale: 1.5,
    bonuses: [{ type: 'Resource Cost Discount', valuePerLevel: 0.03, isPercentage: true }],
    prerequisites: [],
    iconName: 'Crown'
  },
  {
    id: 'all_reconnaissance',
    name: 'Allied Scout Pigeon Relays',
    category: 'alliance',
    description: 'Sync scout birds with ally loops to coordinate tracking on mysterious rogue nodes.',
    maxLevel: 5,
    baseCost: { food: 800, wood: 800 },
    costScale: 1.4,
    baseDurationSec: 40,
    durationScale: 1.4,
    bonuses: [{ type: 'Troop Speed', valuePerLevel: 0.05, isPercentage: true }],
    prerequisites: [],
    iconName: 'Compass'
  },
  {
    id: 'all_war_room',
    name: 'Sovereign War Room Acoustics',
    category: 'alliance',
    description: 'Equip coalition maps with miniature carved stone units to draw dynamic attack coordinates.',
    maxLevel: 5,
    baseCost: { wood: 1500, stone: 1500, iron: 1000 },
    costScale: 1.55,
    baseDurationSec: 100,
    durationScale: 1.5,
    bonuses: [{ type: 'Troop Attack', valuePerLevel: 0.06, isPercentage: true }],
    prerequisites: [{ researchId: 'all_atk_support', level: 3 }],
    iconName: 'Sword'
  },
  {
    id: 'all_prestige_influence',
    name: 'Crown Seal Court Diplomatists',
    category: 'alliance',
    description: 'Politic with the central royal barony, multiplying the visual standing weight of your crest.',
    maxLevel: 5,
    baseCost: { food: 2500, stone: 2000 },
    costScale: 1.5,
    baseDurationSec: 90,
    durationScale: 1.5,
    bonuses: [{ type: 'Troop Defense', valuePerLevel: 0.05, isPercentage: true }],
    prerequisites: [],
    iconName: 'Crown'
  },

  // ======================================
  // 5. HERO RESEARCH NODES (20 NODES)
  // ======================================
  {
    id: 'hero_exp_gain_1',
    name: 'Commander Memoir Chronicles I',
    category: 'hero',
    description: 'Document historic tactical defenses of the Keep to inspire rookies during battlefield drills.',
    maxLevel: 5,
    baseCost: { food: 250, wood: 250 },
    costScale: 1.4,
    baseDurationSec: 25,
    durationScale: 1.4,
    prerequisites: [],
    bonuses: [{ type: 'Hero Experience', valuePerLevel: 0.08, isPercentage: true }],
    iconName: 'Award'
  },
  {
    id: 'hero_exp_gain_2',
    name: 'Commander Memoir Chronicles II',
    category: 'hero',
    description: 'Collect legendary parchment books regarding external war tactics and bind them cleanly in deep leather folders.',
    maxLevel: 5,
    baseCost: { food: 1000, wood: 1000, stone: 600 },
    costScale: 1.45,
    baseDurationSec: 60,
    durationScale: 1.4,
    prerequisites: [{ researchId: 'hero_exp_gain_1', level: 3 }],
    bonuses: [{ type: 'Hero Experience', valuePerLevel: 0.12, isPercentage: true }],
    iconName: 'Award'
  },
  {
    id: 'hero_exp_gain_3',
    name: 'Ancestral War Hero Reliquaries',
    category: 'hero',
    description: 'Retrieve historic crown flags carrying the direct blood of veteran kings to excite battle commanders.',
    maxLevel: 5,
    baseCost: { food: 4000, stone: 3000, iron: 1500 },
    costScale: 1.5,
    baseDurationSec: 140,
    durationScale: 1.5,
    prerequisites: [{ researchId: 'hero_exp_gain_2', level: 4 }],
    bonuses: [{ type: 'Hero Experience', valuePerLevel: 0.18, isPercentage: true }],
    iconName: 'Sparkles'
  },
  {
    id: 'hero_skill_pwr_1',
    name: 'Runic Armament Engravings I',
    category: 'hero',
    description: 'Trace subtle glowing white runes along sword hilt pins to multiply captain skill thrust speed.',
    maxLevel: 5,
    baseCost: { food: 300, iron: 150 },
    costScale: 1.45,
    baseDurationSec: 30,
    durationScale: 1.4,
    prerequisites: [],
    bonuses: [{ type: 'Hero Skill Power', valuePerLevel: 0.08, isPercentage: true }],
    iconName: 'Award'
  },
  {
    id: 'hero_skill_pwr_2',
    name: 'Runic Armament Engravings II',
    category: 'hero',
    description: 'Smelt precursor glass beads inside the weapons, echoing elemental critical strike energy.',
    maxLevel: 5,
    baseCost: { food: 1200, stone: 800, iron: 800 },
    costScale: 1.5,
    baseDurationSec: 70,
    durationScale: 1.4,
    prerequisites: [{ researchId: 'hero_skill_pwr_1', level: 3 }],
    bonuses: [{ type: 'Hero Skill Power', valuePerLevel: 0.12, isPercentage: true }],
    iconName: 'Sword'
  },
  {
    id: 'hero_skill_pwr_3',
    name: 'Precursor Core Infusion Runes',
    category: 'hero',
    description: 'Melt magical red fire gems into standard brass breastplates, shielding hero cores completely.',
    maxLevel: 5,
    baseCost: { food: 4000, stone: 4000, iron: 3000 },
    costScale: 1.55,
    baseDurationSec: 150,
    durationScale: 1.5,
    prerequisites: [{ researchId: 'hero_skill_pwr_2', level: 4 }],
    bonuses: [{ type: 'Hero Skill Power', valuePerLevel: 0.20, isPercentage: true }],
    iconName: 'Sparkles'
  },
  {
    id: 'hero_march_cap_1',
    name: 'Legendary Bannerman Pageant I',
    category: 'hero',
    description: 'Embroider high-visibility giant banners representing the hero class to draw massive local recruits.',
    maxLevel: 5,
    baseCost: { food: 500, wood: 500 },
    costScale: 1.45,
    baseDurationSec: 40,
    durationScale: 1.4,
    prerequisites: [],
    bonuses: [{ type: 'March Capacity', valuePerLevel: 100, isPercentage: false }],
    iconName: 'Wind'
  },
  {
    id: 'hero_march_cap_2',
    name: 'Legendary Bannerman Pageant II',
    category: 'hero',
    description: 'Mount silver war trumpets on carriage cabins, letting commanders direct double lines across deep sands.',
    maxLevel: 5,
    baseCost: { food: 2000, wood: 2000, stone: 1000 },
    costScale: 1.5,
    baseDurationSec: 90,
    durationScale: 1.5,
    prerequisites: [{ researchId: 'hero_march_cap_1', level: 3 }],
    bonuses: [{ type: 'March Capacity', valuePerLevel: 250, isPercentage: false }],
    iconName: 'Wind'
  },
  {
    id: 'hero_summon_discount',
    name: 'Tavern Guildmaster Brokerage',
    category: 'hero',
    description: 'Constitute an alliance trade charter inside the Grand Tavern, cutting total summoned command rates.',
    maxLevel: 5,
    baseCost: { food: 1000, stone: 800 },
    costScale: 1.5,
    baseDurationSec: 50,
    durationScale: 1.4,
    bonuses: [{ type: 'Resource Cost Discount', valuePerLevel: 0.04, isPercentage: true }],
    prerequisites: [],
    iconName: 'Crown'
  },
  {
    id: 'hero_stamina_regen',
    name: 'Vigor-Injecting Herbal Tonics',
    category: 'hero',
    description: 'Mix crushed wild ginger roots into the standard commander beer glasses, charging general stamina.',
    maxLevel: 5,
    baseCost: { food: 800, wood: 400 },
    costScale: 1.4,
    baseDurationSec: 35,
    durationScale: 1.4,
    bonuses: [{ type: 'Hero Experience', valuePerLevel: 0.06, isPercentage: true }],
    prerequisites: [],
    iconName: 'Crown'
  },
  {
    id: 'hero_ap_reserve',
    name: 'Military High-Command Commendations',
    category: 'hero',
    description: 'Enact system honors that keep professional field marshals focused on aggressive tactical patrols.',
    maxLevel: 5,
    baseCost: { food: 1500, wood: 1000 },
    costScale: 1.45,
    baseDurationSec: 60,
    durationScale: 1.4,
    bonuses: [{ type: 'Hero Experience', valuePerLevel: 0.10, isPercentage: true }],
    prerequisites: [],
    iconName: 'Award'
  },
  {
    id: 'hero_vanguard_atk',
    name: "Aldric's Frontline Directives",
    category: 'hero',
    description: 'Inscribe defense sword formulas of Master Captain Aldric directly onto frontline gear shields.',
    maxLevel: 5,
    baseCost: { food: 1200, iron: 600 },
    costScale: 1.5,
    baseDurationSec: 55,
    durationScale: 1.4,
    bonuses: [{ type: 'Infantry Attack', valuePerLevel: 0.06, isPercentage: true }],
    prerequisites: [],
    iconName: 'Sword'
  },
  {
    id: 'hero_ranger_atk',
    name: 'Eldergrove Arrow-Storm Sigils',
    category: 'hero',
    description: 'Bind tracking magical silk feathers to range shafts to guide arrows onto vital organic spots.',
    maxLevel: 5,
    baseCost: { wood: 1200, iron: 600 },
    costScale: 1.5,
    baseDurationSec: 55,
    durationScale: 1.4,
    bonuses: [{ type: 'Marksmen Attack', valuePerLevel: 0.06, isPercentage: true }],
    prerequisites: [],
    iconName: 'Sword'
  },
  {
    id: 'hero_knight_def',
    name: 'Cavalry Sovereign Banner-Guards',
    category: 'hero',
    description: 'Arrange elite protective armor riders around active field commanders to absorb high-risk flank strikes.',
    maxLevel: 5,
    baseCost: { stone: 1200, iron: 800 },
    costScale: 1.5,
    baseDurationSec: 55,
    durationScale: 1.4,
    bonuses: [{ type: 'Cavalry Defense', valuePerLevel: 0.06, isPercentage: true }],
    prerequisites: [],
    iconName: 'Shield'
  },
  {
    id: 'hero_critical_strike',
    name: 'Fatal-Vitals Combat Anatometrics',
    category: 'hero',
    description: 'Lecture commanders on the subtle weaknesses of beast necks, granting critical combat edge.',
    maxLevel: 5,
    baseCost: { food: 1500, stone: 1000 },
    costScale: 1.5,
    baseDurationSec: 70,
    durationScale: 1.5,
    bonuses: [{ type: 'Troop Attack', valuePerLevel: 0.05, isPercentage: true }],
    prerequisites: [],
    iconName: 'Sword'
  },
  {
    id: 'hero_governor_bonus',
    name: "Aron's Agrarian Treasury Seals",
    category: 'hero',
    description: 'Apply Governor Aron agricultural commands systemically, boosting general wheat production structures.',
    maxLevel: 5,
    baseCost: { food: 2000, wood: 1000 },
    costScale: 1.45,
    baseDurationSec: 50,
    durationScale: 1.4,
    bonuses: [{ type: 'Food Production', valuePerLevel: 0.08, isPercentage: true }],
    prerequisites: [],
    iconName: 'Crown'
  },
  {
    id: 'hero_garrison_shield',
    name: 'Fortification Ward-Stone Runes',
    category: 'hero',
    description: 'Carve colossal raw quartz guard plates, creating high magical dome auras when commanders rest inside.',
    maxLevel: 5,
    baseCost: { stone: 2000, iron: 1000 },
    costScale: 1.5,
    baseDurationSec: 85,
    durationScale: 1.5,
    bonuses: [{ type: 'Troop Defense', valuePerLevel: 0.06, isPercentage: true }],
    prerequisites: [],
    iconName: 'Shield'
  },
  {
    id: 'hero_dual_command',
    name: 'Adjutant Tactical Coordination',
    category: 'hero',
    description: 'Draft coordinate codes to couple command efforts, improving total combat power rating indicators.',
    maxLevel: 5,
    baseCost: { food: 3000, wood: 3000, iron: 1500 },
    costScale: 1.55,
    baseDurationSec: 110,
    durationScale: 1.5,
    bonuses: [{ type: 'Troop Attack', valuePerLevel: 0.05, isPercentage: true }, { type: 'Troop Defense', valuePerLevel: 0.05, isPercentage: true }],
    prerequisites: [{ researchId: 'hero_vanguard_atk', level: 3 }, { researchId: 'hero_ranger_atk', level: 3 }],
    iconName: 'Award'
  },
  {
    id: 'hero_ascension_luck',
    name: 'Aetheric Ley-Line Star Alignment',
    category: 'hero',
    description: 'Recite ancestral horoscopes before tactical drills, expanding maximum commander potentials.',
    maxLevel: 5,
    baseCost: { food: 2500, stone: 2500 },
    costScale: 1.45,
    baseDurationSec: 80,
    durationScale: 1.4,
    bonuses: [{ type: 'Hero Experience', valuePerLevel: 0.12, isPercentage: true }],
    prerequisites: [],
    iconName: 'Sparkles'
  },
  {
    id: 'hero_legendary_legacy',
    name: 'Crownspire Valor Archival Scrolls',
    category: 'hero',
    description: 'Record command records inside the eternal scroll cylinders of Crownspire, giving heroes grand weight.',
    maxLevel: 5,
    baseCost: { food: 5000, stone: 4000, iron: 3000 },
    costScale: 1.6,
    baseDurationSec: 160,
    durationScale: 1.6,
    bonuses: [{ type: 'Hero Skill Power', valuePerLevel: 0.20, isPercentage: true }, { type: 'Hero Experience', valuePerLevel: 0.20, isPercentage: true }],
    prerequisites: [{ researchId: 'hero_exp_gain_3', level: 2 }, { researchId: 'hero_skill_pwr_3', level: 2 }],
    iconName: 'Crown'
  }
];

/**
 * Builds standard, fully evaluated ResearchNode definitions.
 * This is perfect for export to JSON systems (e.g. Godot engine parseable)
 * since it evaluates the mathematical curves and outputs exact literal arrays!
 */
export const CROWNSPIRE_RESEARCH_DATABASE: ResearchNode[] = RAW_RESEARCH_METADATA.map((raw) => {
  const researchCost: { [level: number]: ResourceCost } = {};
  const researchTimeSec: { [level: number]: number } = {};

  for (let lvl = 1; lvl <= raw.maxLevel; lvl++) {
    const costMultiplier = Math.pow(raw.costScale, lvl - 1);
    const costItem: ResourceCost = {};

    if (raw.baseCost.food) costItem.food = Math.round(raw.baseCost.food * costMultiplier);
    if (raw.baseCost.wood) costItem.wood = Math.round(raw.baseCost.wood * costMultiplier);
    if (raw.baseCost.stone) costItem.stone = Math.round(raw.baseCost.stone * costMultiplier);
    if (raw.baseCost.iron) costItem.iron = Math.round(raw.baseCost.iron * costMultiplier);
    if (raw.baseCost.valor) costItem.valor = Math.round(raw.baseCost.valor * costMultiplier);

    researchCost[lvl] = costItem;
    researchTimeSec[lvl] = Math.round(raw.baseDurationSec * Math.pow(raw.durationScale, lvl - 1));
  }

  return {
    id: raw.id,
    name: raw.name,
    category: raw.category,
    description: raw.description,
    maxLevel: raw.maxLevel,
    researchCost,
    researchTimeSec,
    prerequisites: raw.prerequisites,
    bonuses: raw.bonuses,
    iconName: raw.iconName
  };
});

// Flat dictionary for fast lookups
export const RESEARCH_BY_ID: { [id: string]: ResearchNode } = CROWNSPIRE_RESEARCH_DATABASE.reduce(
  (acc: { [id: string]: ResearchNode }, node) => {
    acc[node.id] = node;
    return acc;
  },
  {}
);

/**
 * Calculates the total aggregate bonus value for a given bonus type
 * based on the active research levels of the sovereign state.
 */
export function getResearchBonus(
  levels: { [id: string]: number } | undefined,
  bonusType: string
): number {
  if (!levels) return 0;
  let total = 0;
  
  for (const node of CROWNSPIRE_RESEARCH_DATABASE) {
    const currentLvl = levels[node.id] || 0;
    if (currentLvl > 0) {
      // Find matches for bonusType
      node.bonuses.forEach((b) => {
        if (b.type === bonusType) {
          total += currentLvl * b.valuePerLevel;
        }
      });
    }
  }
  return total;
}

/**
 * Checks whether a given research node is unlocked based on research prerequisites and academy level.
 */
export function isResearchUnlocked(
  node: ResearchNode,
  levels: { [id: string]: number } | undefined,
  academyLevel: number
): { unlocked: boolean; reason?: string } {
  // Prerequisite Academy levels mapped loosely by node ID prefixes or tier indices
  let requiredAcademyLvl = 1;
  const isTier2 = node.id.endsWith('_2');
  const isTier3 = node.id.endsWith('_3') || node.id.includes('overall') || node.id.includes('legacy') || node.id.includes('dual');
  
  if (isTier3) {
    requiredAcademyLvl = 10;
  } else if (isTier2) {
    requiredAcademyLvl = 5;
  }
  
  if (academyLevel < requiredAcademyLvl) {
    return {
      unlocked: false,
      reason: `Requires Academy level ${requiredAcademyLvl}`
    };
  }

  if (node.prerequisites && levels) {
    for (const prereq of node.prerequisites) {
      const currentLevel = levels[prereq.researchId] || 0;
      if (currentLevel < prereq.level) {
        const requiredNode = RESEARCH_BY_ID[prereq.researchId];
        const reqName = requiredNode ? requiredNode.name : prereq.researchId;
        return {
          unlocked: false,
          reason: `Requires ${reqName} Level ${prereq.level}`
        };
      }
    }
  }

  return { unlocked: true };
}
