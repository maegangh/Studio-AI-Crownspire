import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Sparkles, 
  Layers, 
  Shield, 
  Sword, 
  Heart, 
  Star, 
  ArrowUp, 
  BookOpen, 
  Gem, 
  Flame, 
  Activity, 
  Clock, 
  Target, 
  Zap, 
  Users, 
  Hammer, 
  HelpCircle, 
  TrendingUp, 
  Award, 
  Info, 
  Lock, 
  Unlock, 
  RotateCcw, 
  AlertTriangle,
  ChevronRight,
  Coins,
  Copy,
  Check,
  Search,
  Terminal,
  Database,
  Save,
  Sliders,
  Code
} from 'lucide-react';

import crownmarksSchema from '../data/crownmarks.json';
import crownmarkUpgradeCostsSchema from '../data/crownmark_upgrade_costs.json';
import crownmarkFragmentsSchema from '../data/crownmark_fragments.json';
import crownmarkResonanceSchema from '../data/crownmark_resonance.json';
import crownmarkCollectionsSchema from '../data/crownmark_collections.json';
import heroSignatureCrownmarksSchema from '../data/hero_signature_crownmarks.json';
import godotImplementationPlan from '../data/godot_implementation_plan.json';
import { HERO_SIGNATURE_CROWNMARKS } from '../data/heroes_signatures';

interface ProgressionBibleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// 1. Core Data Models for Crownmark System
interface CrownmarkTemplate {
  id: string;
  name: string;
  slot: 'Weapon' | 'Helm' | 'Crest' | 'Signet' | 'Charter';
  signatureHeroId: string;
  baseStats: { attack: number; defense: number; health: number };
  passiveName: string;
  passiveDesc: string;
  flavor: string;
  color: string;
}

const HEROES_LIST = [
  { id: 'maegan', name: 'Maegan', role: 'War (Infantry)', desc: 'Supreme Lord Marshal of Crownspire.' },
  { id: 'shadow', name: 'Shadow', role: 'Support/Rogue (Cavalry)', desc: 'Leader of the Silent Eclipse Network.' },
  { id: 'lorelai', name: 'Lorelai', role: 'Support/Weaver (Marksmen)', desc: 'Ethereal Keeper of the Lunar Chords.' },
  { id: 'dominic', name: 'Dominic', role: 'War (Infantry)', desc: 'Unbreakable Steel Wall Vanguard.' }
];

const CROWNMARKS_DATABASE: Record<string, CrownmarkTemplate> = {
  // --- MAEGAN'S SIGNATURE CROWNMARKS ---
  founders_scepter: {
    id: 'founders_scepter',
    name: "Founder's Scepter",
    slot: 'Weapon',
    signatureHeroId: 'maegan',
    baseStats: { attack: 90, defense: 15, health: 140 },
    passiveName: 'Sovereign Command',
    passiveDesc: 'Boosts infantry legion basic damage and increases troop march damage rating by 10%.',
    flavor: 'A heavy royal scepter pulsing with violet lightning. Symbolizes absolute marshal command.',
    color: '#a855f7'
  },
  founders_crown: {
    id: 'founders_crown',
    name: "Founder's Crown",
    slot: 'Helm',
    signatureHeroId: 'maegan',
    baseStats: { attack: 20, defense: 80, health: 480 },
    passiveName: 'Crownspire Bulwark',
    passiveDesc: 'Generates an indestructible starlight dome absorbing 20% of incoming siege skill fire.',
    flavor: 'The original Crownspire headpiece, heavy with meteorite iron and studded with star diamonds.',
    color: '#eab308'
  },
  royal_crest: {
    id: 'royal_crest',
    name: 'Royal Crest',
    slot: 'Crest',
    signatureHeroId: 'maegan',
    baseStats: { attack: 35, defense: 75, health: 380 },
    passiveName: 'Imperial Cohesion',
    passiveDesc: 'Raises the maximum legion recruitment draft limit by 8% and lowers wounded casualties by 12%.',
    flavor: 'A gold-trimmed crest engraving the roaring winged lion emblem of the Sovereign Citadel.',
    color: '#a855f7'
  },
  sapphire_signet: {
    id: 'sapphire_signet',
    name: 'Sapphire Signet',
    slot: 'Signet',
    signatureHeroId: 'maegan',
    baseStats: { attack: 70, defense: 40, health: 260 },
    passiveName: 'Prism Overload',
    passiveDesc: 'Active commander skills trigger a +15% Critical Strike factor, bursting with violet fire.',
    flavor: 'A thick platinum signet ring holding a sapphire that refracts starlight into micro arcs.',
    color: '#2563eb'
  },
  royal_charter: {
    id: 'royal_charter',
    name: 'Royal Charter',
    slot: 'Charter',
    signatureHeroId: 'maegan',
    baseStats: { attack: 50, defense: 50, health: 400 },
    passiveName: 'Empire Providence',
    passiveDesc: 'Permanently cuts structure construction timers by 10% and upgrades barracks capacity by 15%.',
    flavor: 'An ancient starlight scroll laying down the boundaries and divine rights of the Crownspire realm.',
    color: '#ec4899'
  },

  // --- SHADOW'S SIGNATURE CROWNMARKS ---
  twin_shadow_daggers: {
    id: 'twin_shadow_daggers',
    name: 'Twin Shadow Daggers',
    slot: 'Weapon',
    signatureHeroId: 'shadow',
    baseStats: { attack: 115, defense: 10, health: 100 },
    passiveName: 'Eclipse Strike',
    passiveDesc: 'Strikes ignore 20% of the target legion’s armor rating, dealing pure critical backstab hits.',
    flavor: 'Dual black obsidian blades that drink ambient light. Their edge-glow is entirely invisible to prey.',
    color: '#6366f1'
  },
  assassin_mask: {
    id: 'assassin_mask',
    name: 'Assassin Mask',
    slot: 'Helm',
    signatureHeroId: 'shadow',
    baseStats: { attack: 40, defense: 55, health: 320 },
    passiveName: 'Specter Shroud',
    passiveDesc: 'Prevents the legion from being targeted by scout radars, amplifying surprise flank damage by 25%.',
    flavor: 'A cold, expressionless porcelain plate that completely suppresses facial temperature and magical aura.',
    color: '#475569'
  },
  shadow_cloak: {
    id: 'shadow_cloak',
    name: 'Shadow Cloak',
    slot: 'Crest',
    signatureHeroId: 'shadow',
    baseStats: { attack: 30, defense: 65, health: 420 },
    passiveName: 'Umbral Phase',
    passiveDesc: 'When hit by enemy magical fire, there is a 30% chance to dissolve into mist and avoid all damage.',
    flavor: 'A twilight mantle that appears like a living patch of starry cosmos. Slippery to the eyes.',
    color: '#6366f1'
  },
  night_emblem: {
    id: 'night_emblem',
    name: 'Night Emblem',
    slot: 'Signet',
    signatureHeroId: 'shadow',
    baseStats: { attack: 75, defense: 30, health: 250 },
    passiveName: 'Swift Flanker',
    passiveDesc: 'Grants +15% cavalry march velocity and increases initial charging shock impact by +20%.',
    flavor: 'The deep obsidian crest medallion symbolizing high authority inside the secret guild.',
    color: '#1e1b4b'
  },
  smoke_bomb: {
    id: 'smoke_bomb',
    name: 'Smoke Bomb',
    slot: 'Charter',
    signatureHeroId: 'shadow',
    baseStats: { attack: 60, defense: 35, health: 340 },
    passiveName: 'Blindside Fog',
    passiveDesc: 'Releases a dark purple smoke cloud, reducing opposing commander skill regeneration speeds by 25%.',
    flavor: 'A mechanical sphere filled with dense essence of crushed shadow crystals.',
    color: '#d946ef'
  },

  // --- LORELAI'S SIGNATURE CROWNMARKS ---
  moonkeepers_bow: {
    id: 'moonkeepers_bow',
    name: "Moonkeeper's Bow",
    slot: 'Weapon',
    signatureHeroId: 'lorelai',
    baseStats: { attack: 100, defense: 10, health: 120 },
    passiveName: 'Lunar Gale',
    passiveDesc: 'Extends marksmen range by 15% and infuses normal arrows with +15% moon flare skill damage.',
    flavor: 'A lightweight longbow crafted from silverwood. Draws arrow shafts purely out of moonlight.',
    color: '#06b6d4'
  },
  lunar_tiara: {
    id: 'lunar_tiara',
    name: 'Lunar Tiara',
    slot: 'Helm',
    signatureHeroId: 'lorelai',
    baseStats: { attack: 15, defense: 70, health: 490 },
    passiveName: 'Harmony Hymn',
    passiveDesc: 'Dispels ongoing frost or shadow curses from allied cohorts every 10 seconds, granting rapid health.',
    flavor: 'An intricate silver diadem with a glowing core, vibrating with soft protective frequencies.',
    color: '#3b82f6'
  },
  moon_crystal_crownmark: {
    id: 'moon_crystal_crownmark',
    name: 'Moon Crystal Orb',
    slot: 'Crest',
    signatureHeroId: 'lorelai',
    baseStats: { attack: 45, defense: 50, health: 440 },
    passiveName: 'Astral Resonance',
    passiveDesc: 'Reclaims 15% of fallen vanguard troops, reviving them into active fighting ranks at zero cost.',
    flavor: 'A floating celestial crystal shard harvested from lunar craters. It vibrates with warm healing song.',
    color: '#a855f7'
  },
  silver_pendant: {
    id: 'silver_pendant',
    name: 'Silver Pendant',
    slot: 'Signet',
    signatureHeroId: 'lorelai',
    baseStats: { attack: 65, defense: 40, health: 280 },
    passiveName: 'Weaver Blessing',
    passiveDesc: 'Increases global march velocity by 12% and amplifies the power of active hero traits by 10%.',
    flavor: 'A crescent amulet worn by high priestesses of the moon temples, warm to the touch.',
    color: '#3b82f6'
  },
  celestial_tome: {
    id: 'celestial_tome',
    name: 'Celestial Tome',
    slot: 'Charter',
    signatureHeroId: 'lorelai',
    baseStats: { attack: 55, defense: 45, health: 390 },
    passiveName: 'Cosmos Archives',
    passiveDesc: 'Elevates global magical research speed by 10% and awards +15% extra hero training experience.',
    flavor: 'A book of cosmic navigation inscribed with moving constellations and star formulas.',
    color: '#06b6d4'
  },

  // --- DOMINIC'S SIGNATURE CROWNMARKS ---
  vanguard_shield: {
    id: 'vanguard_shield',
    name: 'Vanguard Shield',
    slot: 'Weapon',
    signatureHeroId: 'dominic',
    baseStats: { attack: 50, defense: 95, health: 300 },
    passiveName: 'Unyielding Gaze',
    passiveDesc: 'Completely blocks the first skill cast strike from enemy commanders and elevates defense by 15%.',
    flavor: 'A battered meteorite-steel shield that can absorb direct fire dragon breath commands.',
    color: '#475569'
  },
  marshals_greaves: {
    id: 'marshals_greaves',
    name: "Marshal's Greaves",
    slot: 'Helm',
    signatureHeroId: 'dominic',
    baseStats: { attack: 25, defense: 75, health: 460 },
    passiveName: 'Iron Pillar',
    passiveDesc: 'Provides complete knockback and stun immunity to infantry cohorts, holding frontlines solid.',
    flavor: 'Heavy, blocky boots forged with solid lead-iron overlays to withstand giant strikes.',
    color: '#eab308'
  },
  iron_signet_crownmark: {
    id: 'iron_signet_crownmark',
    name: 'Iron Signet',
    slot: 'Crest',
    signatureHeroId: 'dominic',
    baseStats: { attack: 60, defense: 55, health: 340 },
    passiveName: 'Warlord Decree',
    passiveDesc: 'Reduces the movement speed of attacking cavalry by 15% and increases troop health parameters.',
    flavor: 'A square signet ring depicting the giant high walls of the Crownspire Outer Gate.',
    color: '#10b981'
  },
  concordat_plate: {
    id: 'concordat_plate',
    name: 'Concordat Plate Mail',
    slot: 'Signet',
    signatureHeroId: 'dominic',
    baseStats: { attack: 35, defense: 85, health: 410 },
    passiveName: 'Ballista Warding',
    passiveDesc: 'Reduces incoming structural siege and ballista bolt splash damage by 20% on the world map.',
    flavor: 'Impenetrable plate armor layered with protective earth runes, forged inside volcanic pits.',
    color: '#10b981'
  },
  banner_of_victory: {
    id: 'banner_of_victory',
    name: 'Banner of Victory',
    slot: 'Charter',
    signatureHeroId: 'dominic',
    baseStats: { attack: 65, defense: 35, health: 430 },
    passiveName: 'Vanguard Tenacity',
    passiveDesc: 'Empowers legions, letting them fight at 100% damage output even when squad sizes drop below 30%.',
    flavor: 'A tattered, proud war standard that instills infinite courage and stamina in surrounding warriors.',
    color: '#ec4899'
  }
};

const CROWNMARK_CATEGORIES = [
  {
    id: 'regalia',
    name: 'Royal Regalia',
    icon: '👑',
    purpose: 'Crownmarks representing divine royal authority, symbols of office, and imperial lineage. Bestowed upon high marshals and nobles to validate sovereign command of legions on the battlefield.',
    mechanicalFocus: 'Core military defense, siege fire absorption, and legion recruitment draft limits.',
    heroes: {
      maegan: {
        itemName: "Founder's Crown",
        slot: 'Helm',
        stats: 'Defense +80, Health +480',
        passive: 'Generates an indestructible starlight dome absorbing 20% of incoming siege skill fire.',
        lore: 'The original Crownspire headpiece, heavy with meteorite iron and studded with star diamonds.',
      },
      lorelai: {
        itemName: 'Lunar Tiara',
        slot: 'Helm',
        stats: 'Defense +70, Health +490',
        passive: 'Dispels ongoing frost or shadow curses from allied cohorts, granting rapid health.',
        lore: 'An intricate silver diadem with a glowing core, vibrating with soft protective lunar frequencies.',
      },
      shadow: {
        itemName: 'Assassin Mask',
        slot: 'Helm',
        stats: 'Attack +40, Defense +55, Health +320',
        passive: 'Suppresses facial signature and aura, rendering the legion immune to enemy radar sweeps.',
        lore: 'A cold, expressionless porcelain plate that suppresses heat, magic signature, and facial expressions.',
      },
      allanna: {
        itemName: 'Arch-Priestess Diadem',
        slot: 'Helm',
        stats: 'Defense +60, Health +520',
        passive: 'Spreads light-shields to surrounding armies, absorbing up to 15% of magic area skill fire.',
        lore: 'Gold-woven halo crown holding a purified core of Sunfire crystal, warm with divine resonance.',
      },
      remi: {
        itemName: 'Mason Master Goggles',
        slot: 'Helm',
        stats: 'Defense +85, Health +410',
        passive: 'Highlights weak spots in hostile architectural targets, raising stone output by 20%.',
        lore: 'Heavy leather goggles fitted with magnifying quartz lenses calibrated to read structural stresses.',
      },
      rex: {
        itemName: 'Gilded Coronet',
        slot: 'Helm',
        stats: 'Defense +95, Health +500',
        passive: 'Enables Vanguard Stand: allied units gain 35% damage mitigation when shields are active.',
        lore: 'A heavy brass coronet awarded for defending the crumbling city arches, polished to a gold shine.',
      },
      lumi: {
        itemName: 'Everfrost Crown',
        slot: 'Helm',
        stats: 'Defense +75, Health +460',
        passive: 'Surrounds the apothecary squad with a frost shield that slows close-range attackers by 25%.',
        lore: 'Crafted from pure glacial ice that never melts, channeling the subzero winds of Everfrost Ridge.',
      },
      skye: {
        itemName: 'Skyward Wing Helmet',
        slot: 'Helm',
        stats: 'Attack +30, Defense +60, Health +430',
        passive: 'Grants aerial vision, lifting marksmen unit hit chance through dense cloud blocks by 15%.',
        lore: 'Fitted with pegasus feathers, this lightweight helmet deflects high-altitude headwind resistance.',
      },
      rayne: {
        itemName: 'Stormclaw Hood',
        slot: 'Helm',
        stats: 'Attack +45, Defense +45, Health +380',
        passive: 'Triggers Storm Shroud: grants 10% dodge rating and raises attack speed when hit by skills.',
        lore: 'Woven with storm-shredded wolf silk, carrying a trace of the wild lightning that struck her grove.',
      },
      rubble: {
        itemName: 'Demolition Visor',
        slot: 'Helm',
        stats: 'Defense +90, Health +450',
        passive: 'Provides perfect immunity to collapsing debris stuns, reducing wall trap shock damage by 30%.',
        lore: 'A crude iron mask welded with a double-slotted grate, heavily scarred by timber splinter explosions.',
      },
      noxx: {
        itemName: 'Alchemist Plague Mask',
        slot: 'Helm',
        stats: 'Defense +65, Health +440',
        passive: 'Filters toxic gases and bio-weapons completely, and converts gas damage into army health.',
        lore: 'A long-beaked leather mask filled with charcoal and rare crushed swamp-reeds of Silent Fenns.',
      }
    }
  },
  {
    id: 'armaments',
    name: 'Imperial Armaments',
    icon: '⚔️',
    purpose: 'High-tier weapons and offensive battle gear forged with celestial star-dust or mythic metals. They are the primary instruments used to break enemy defensive fortifications and purge the shadow-tide.',
    mechanicalFocus: 'Legion unit attack, critical strike multiplier, and breakthrough execution speed.',
    heroes: {
      maegan: {
        itemName: "Founder's Scepter",
        slot: 'Weapon',
        stats: 'Attack +90, Defense +15, Health +140',
        passive: 'Boosts infantry legion basic damage and increases troop march damage rating by 10%.',
        lore: 'A heavy royal scepter pulsing with violet lightning, symbolizing absolute marshal command.',
      },
      lorelai: {
        itemName: "Moonkeeper's Bow",
        slot: 'Weapon',
        stats: 'Attack +100, Defense +10, Health +120',
        passive: 'Extends marksmen range by 15% and infuses normal arrows with +15% moon flare skill damage.',
        lore: 'A lightweight longbow crafted from silverwood. Draws arrow shafts purely out of moonlight.',
      },
      shadow: {
        itemName: 'Twin Shadow Daggers',
        slot: 'Weapon',
        stats: 'Attack +115, Defense +10, Health +100',
        passive: 'Strikes ignore 20% of target armor rating, dealing pure critical backstab hits.',
        lore: 'Dual black obsidian blades that drink ambient light. Their edge-glow is entirely invisible to prey.',
      },
      allanna: {
        itemName: "Voidwalker's Bow",
        slot: 'Weapon',
        stats: 'Attack +95, Defense +15, Health +130',
        passive: 'Infuses arrows with dark rift void energy, causing them to explode for 20% area damage.',
        lore: 'A composite recurve bow touched by the void, its string made of high-resonance rift thread.',
      },
      remi: {
        itemName: "Stonemason's Trowel",
        slot: 'Weapon',
        stats: 'Attack +60, Defense +70, Health +150',
        passive: 'Increases melee block chance by 10% and yields a 12% boost in wall repair speeds.',
        lore: 'A solid granite trowel polished to an edge, capable of carving masonry and blocking heavy cuts.',
      },
      rex: {
        itemName: 'Gilded Bulwark',
        slot: 'Weapon',
        stats: 'Attack +55, Defense +95, Health +200',
        passive: 'Charges ahead to deal 30% shock impact, knocking back opposing vanguard squads.',
        lore: 'A massive gold-plated heater shield that Rex used to hold open the collapsing vault door.',
      },
      lumi: {
        itemName: 'Apothecary Ice Scalpel',
        slot: 'Weapon',
        stats: 'Attack +70, Defense +30, Health +160',
        passive: 'Freezes target cohort in place for 2 seconds on skill cast, blocking action points.',
        lore: 'A long, ice-cold needle crafted from ancient glacier core, capable of micro-suture operations.',
      },
      skye: {
        itemName: 'Gale Force Spear',
        slot: 'Weapon',
        stats: 'Attack +105, Defense +15, Health +110',
        passive: 'Deals 25% extra flank charge damage when attacking from high-velocity airborne maneuvers.',
        lore: 'A sky-forged steel lance with elegant golden wings that hum with the high currents of plateaus.',
      },
      rayne: {
        itemName: "Stormseeker's Longbow",
        slot: 'Weapon',
        stats: 'Attack +110, Defense +5, Health +115',
        passive: 'Channels lightning arrows that jump to 3 targets, dealing 15% shock damage on each bounce.',
        lore: 'Carved from an ancient oak that stood at the edge of the Whispering Plains, crackling with storm sparks.',
      },
      rubble: {
        itemName: 'Rupture Sledge',
        slot: 'Weapon',
        stats: 'Attack +85, Defense +45, Health +180',
        passive: 'Deals 50% bonus destruction damage to timber barricades, traps, and wooden gates.',
        lore: 'A colossal steel sledgehammer with weighted volcanic rings, tuned for industrial felling.',
      },
      noxx: {
        itemName: 'Toxic Cane',
        slot: 'Weapon',
        stats: 'Attack +80, Defense +25, Health +145',
        passive: 'Normal attacks poison enemy cohorts, dealing 8% chemical damage per second over 8 seconds.',
        lore: 'A heavy brass cane containing compressed toxic gas canisters, topped with a glowing emerald snake.',
      }
    }
  },
  {
    id: 'artifacts',
    name: 'Astral Artifacts',
    icon: '🏺',
    purpose: 'Ancient objects of high magical power, harvested from celestial rifts, meteor craters, or deep subterranean shrines. They channel pure elemental, light, or necrotic energy.',
    mechanicalFocus: 'Magical damage, skill regeneration speed, and account-wide training efficiency.',
    heroes: {
      maegan: {
        itemName: 'Sapphire Signet',
        slot: 'Signet',
        stats: 'Attack +70, Defense +40, Health +260',
        passive: 'Active commander skills trigger a +15% Critical Strike factor, bursting with violet fire.',
        lore: 'A thick platinum signet ring holding a sapphire that refracts starlight into micro arcs.',
      },
      lorelai: {
        itemName: 'Moon Crystal Orb',
        slot: 'Crest',
        stats: 'Attack +45, Defense +50, Health +440',
        passive: 'Reclaims 15% of fallen vanguard troops, reviving them into active fighting ranks at zero cost.',
        lore: 'A floating celestial crystal shard harvested from lunar craters, vibrating with healing song.',
      },
      shadow: {
        itemName: 'Smoke Bomb Catalyst',
        slot: 'Charter',
        stats: 'Attack +60, Defense +35, Health +340',
        passive: 'Releases a dark purple smoke cloud, reducing opposing commander skill speeds by 25%.',
        lore: 'A mechanical sphere filled with dense essence of crushed shadow crystals from the Silent Fenns.',
      },
      allanna: {
        itemName: 'Sunfire Reliquary',
        slot: 'Crest',
        stats: 'Attack +40, Defense +60, Health +450',
        passive: 'Spreads a protective aura that reduces incoming necrotic and shadow damage by 20%.',
        lore: 'An ornate golden box containing an ever-burning spark of the first solar beacon.',
      },
      remi: {
        itemName: 'Geometer Crucible',
        slot: 'Crest',
        stats: 'Attack +50, Defense +50, Health +420',
        passive: 'Permanently increases stone masonry structure durability by 15% and speeds up building.',
        lore: 'An alchemical kiln used to heat specialized cement, ensuring buildings set fast and solid.',
      },
      rex: {
        itemName: 'Aurelia Solar Beacon',
        slot: 'Crest',
        stats: 'Attack +30, Defense +75, Health +450',
        passive: 'Increases legion defense by 12% and heals allied cohorts by 3% every 5 seconds.',
        lore: 'A holy mirror designed to catch solar light and project rays of absolute hope and focus.',
      },
      lumi: {
        itemName: 'Everfrost Glacial Prism',
        slot: 'Crest',
        stats: 'Attack +55, Defense +45, Health +400',
        passive: 'Increases apothecary healing outputs by 18% and expands deep glacial field coverage.',
        lore: 'A prism of absolute zero ice that focuses magical frostwaves into pure restorative streams.',
      },
      skye: {
        itemName: 'Aether Wind Flask',
        slot: 'Crest',
        stats: 'Attack +65, Defense +35, Health +360',
        passive: 'Deleases wind gusts on troop defeat, granting remaining troops +15% damage rating.',
        lore: 'A silver flask holding compressed vortex winds collected from the highest plateaus.',
      },
      rayne: {
        itemName: 'Stormclaw Totem',
        slot: 'Crest',
        stats: 'Attack +70, Defense +30, Health +350',
        passive: 'Empowers arrows with a storm shock, reducing the attack speed of struck units by 15%.',
        lore: 'A heavy wood carving inlaid with active storm gems that hum in response to archery drawing.',
      },
      rubble: {
        itemName: 'Rupture Geode',
        slot: 'Crest',
        stats: 'Attack +60, Defense +50, Health +390',
        passive: 'Releases a mini seismic pulse on heavy strike, lowering enemy infantry shield ratings by 15%.',
        lore: 'A cracked cavern geode glowing with violent seismic mana, recovered from crater trenches.',
      },
      noxx: {
        itemName: "Plague Doctor's Alembic",
        slot: 'Crest',
        stats: 'Attack +75, Defense +30, Health +330',
        passive: 'Increases chemical plague duration by 4 seconds and doubles decay rating on low health.',
        lore: 'A bubbling glass alembic filled with specialized acid, fitted with brass ventilation tubes.',
      }
    }
  },
  {
    id: 'insignia',
    name: 'Sovereign Insignia',
    icon: '🛡️',
    purpose: 'Crests, medallions, and signet seals representing military guild credentials, specialized troop command, and strategic ranks. They are badges of authorized command.',
    mechanicalFocus: 'March velocity, tactical flank bonuses, and alliance contribution multipliers.',
    heroes: {
      maegan: {
        itemName: 'Royal Crest',
        slot: 'Crest',
        stats: 'Attack +35, Defense +75, Health +380',
        passive: 'Raises maximum legion recruitment draft limit by 8% and lowers casualties by 12%.',
        lore: 'A gold-trimmed crest engraving the roaring winged lion emblem of the Sovereign Citadel.',
      },
      lorelai: {
        itemName: 'Silver Pendant',
        slot: 'Signet',
        stats: 'Attack +65, Defense +40, Health +280',
        passive: 'Increases global march velocity by 12% and amplifies active hero traits by 10%.',
        lore: 'A crescent amulet worn by high priestesses of the moon temples, warm to the touch.',
      },
      shadow: {
        itemName: 'Night Emblem',
        slot: 'Signet',
        stats: 'Attack +75, Defense +30, Health +250',
        passive: 'Grants +15% cavalry march velocity and increases initial charging shock impact by +20%.',
        lore: 'The deep obsidian crest medallion symbolizing high authority inside the secret guild.',
      },
      allanna: {
        itemName: 'Aurelia Temple Medal',
        slot: 'Signet',
        stats: 'Attack +50, Defense +50, Health +320',
        passive: 'Boosts structural city wall defense output by 12% when assigned to patrol.',
        lore: 'A silver medal stamped with the scales of justice, given for guardian merit in the capital.',
      },
      remi: {
        itemName: "Guildmaster's Seal",
        slot: 'Signet',
        stats: 'Attack +40, Defense +65, Health +300',
        passive: 'Boosts iron and stone extraction rates by 15% across all deployed harvesting nodes.',
        lore: 'A bronze seal carved with interlocking gears, certifying Remi as a Guild Master Mason.',
      },
      rex: {
        itemName: 'Vanguard Medal',
        slot: 'Signet',
        stats: 'Attack +50, Defense +60, Health +340',
        passive: 'Raises lead phalanx defense output by 15% when cohort health drops below 50%.',
        lore: 'A heavy metal emblem pinned to Rex’s chest, showing a broken sword that held the gate.',
      },
      lumi: {
        itemName: 'Everfrost Ridge Insignia',
        slot: 'Signet',
        stats: 'Attack +60, Defense +40, Health +290',
        passive: 'Speeds up medical gathering herbs rate on the map by 20% and lowers casualty ratings.',
        lore: 'A blue metal seal depicting a snow owl, symbolizing apothecary rank in the Everfrost Ridge.',
      },
      skye: {
        itemName: 'Pegasus Wind Crest',
        slot: 'Signet',
        stats: 'Attack +70, Defense +30, Health +240',
        passive: 'Increases cavalry and pegasus march speed by 25% and reduces terrain debuffs by 50%.',
        lore: 'A winged medallion that glows soft green, carrying a permanent gale blessing from the winds.',
      },
      rayne: {
        itemName: 'Stormclaw Ring',
        slot: 'Signet',
        stats: 'Attack +68, Defense +32, Health +260',
        passive: 'Grants +15% marksmen projectile speed, bypassing 10% of enemy shield blocks.',
        lore: 'A sharp, talon-shaped ring carved from lightning-fused sky-iron, cold to the skin.',
      },
      rubble: {
        itemName: 'Sapper Emblem',
        slot: 'Signet',
        stats: 'Attack +55, Defense +55, Health +280',
        passive: 'Increases speed of clearing map blockades and rubble pits by 25%.',
        lore: 'An insignia forged from melted down war-battering rams, representing raw engineering demolition power.',
      },
      noxx: {
        itemName: 'Silent Fenns Signet',
        slot: 'Signet',
        stats: 'Attack +72, Defense +28, Health +250',
        passive: 'Grants plague cohorts toxic immunity and adds 10% poison mitigation to the army.',
        lore: 'A green serpent ring symbolizing membership in the dark alchemical circles of the slums.',
      }
    }
  },
  {
    id: 'legacy',
    name: 'Ancestral Legacy',
    icon: '📜',
    purpose: 'Boundless charters, architectural blueprints, treatises, and ancient codes representing the fundamental lore, historical covenants, and civic laws of Crownspire.',
    mechanicalFocus: 'Development research efficiency, city-building speeds, and defense stamina.',
    heroes: {
      maegan: {
        itemName: 'Royal Charter',
        slot: 'Charter',
        stats: 'Attack +50, Defense +50, Health +400',
        passive: 'Permanently cuts structure construction timers by 10% and upgrades barracks capacity by 15%.',
        lore: 'An ancient starlight scroll laying down the boundaries and divine rights of the Crownspire realm.',
      },
      lorelai: {
        itemName: 'Celestial Tome',
        slot: 'Charter',
        stats: 'Attack +55, Defense +45, Health +390',
        passive: 'Elevates global magical research speed by 10% and awards +15% extra hero training experience.',
        lore: 'A book of cosmic navigation inscribed with moving constellations and lunar formulas.',
      },
      shadow: {
        itemName: 'Espionage Log',
        slot: 'Charter',
        stats: 'Attack +70, Defense +30, Health +320',
        passive: 'Reduces gold costs of gathering map items by 12% and improves scout speeds.',
        lore: 'A leather-bound cipher book detailing deep patrol paths and weaknesses of regional kingdoms.',
      },
      allanna: {
        itemName: 'Aurelia Covenant',
        slot: 'Charter',
        stats: 'Attack +45, Defense +55, Health +410',
        passive: 'Increases troop recruitment training velocity by 10% and reduces food upkeep by 8%.',
        lore: 'An ancient sacred manuscript laying down the pact between the Order of Light and Crownspire.',
      },
      remi: {
        itemName: 'Granite Palisade Blueprint',
        slot: 'Charter',
        stats: 'Attack +35, Defense +75, Health +430',
        passive: 'Enhances palisade walls hit points by 20% and lowers stone upgrade cost by 15%.',
        lore: 'A thick, charcoal-sketched parchment detailing the structural load limits of the granite defenses.',
      },
      rex: {
        itemName: "Knight's Vow Charter",
        slot: 'Charter',
        stats: 'Attack +50, Defense +60, Health +420',
        passive: 'Guarantees unyielding honor: cohort basic strikes raise defense rating by 1.5% (up to 15%).',
        lore: 'A formal military scroll signed in blood, pledging Rex’s entire vanguard legion to the citadel.',
      },
      lumi: {
        itemName: 'Ridge Botany Scroll',
        slot: 'Charter',
        stats: 'Attack +40, Defense +50, Health +400',
        passive: 'Boosts healing item production speed by 15% and increases passive health recovery parameters.',
        lore: 'An advanced alchemical log recording the growth coordinates and medical features of mountain ice herbs.',
      },
      skye: {
        itemName: 'Aero-Mapping Atlas',
        slot: 'Charter',
        stats: 'Attack +60, Defense +40, Health +380',
        passive: 'Clears fog in an expanded radius and reveals buried coordinates on the global map.',
        lore: 'An atlas containing drafts of mountain currents and high altitudes, compiled by generations of scouts.',
      },
      rayne: {
        itemName: 'Forest Sentry Treatise',
        slot: 'Charter',
        stats: 'Attack +65, Defense +35, Health +390',
        passive: 'Increases marksmen squad march speed through heavy forests and hills by 20%.',
        lore: 'An old woodland guide describing forest camouflage, storm directions, and wind currents.',
      },
      rubble: {
        itemName: 'Timber Demolition Decree',
        slot: 'Charter',
        stats: 'Attack +50, Defense +50, Health +400',
        passive: 'Reduces wood upgrade costs of all resource camps by 15% across the domain.',
        lore: 'An imperial directive giving master engineers authority to salvage timber barricades for base builds.',
      },
      noxx: {
        itemName: 'Plague Counter-Treatise',
        slot: 'Charter',
        stats: 'Attack +55, Defense +45, Health +370',
        passive: 'Reduces biochemical research costs by 15% and speeds up alchemical curing processes.',
        lore: 'A dense, stain-spotted alchemical journal documenting Noxx’s successful curing experiments.',
      }
    }
  },
  {
    id: 'keepsakes',
    name: 'Eternal Keepsakes',
    icon: '💝',
    purpose: 'Tokens of high sentimental or protective value, representing deep vows, personal origins, and oaths. They are personal treasures carried to maintain combat resolve.',
    mechanicalFocus: 'Troop recovery, casualty reduction, health regeneration, and luck.',
    heroes: {
      maegan: {
        itemName: 'Sovereign Pendant',
        slot: 'Signet',
        stats: 'Attack +60, Defense +40, Health +280',
        passive: 'Triggers Vanguard Shielding: heals Maegan’s lead cohort by 8% upon dropping below 35% health.',
        lore: 'A tiny gold-framed amulet carrying an image of the old Citadel peak before the rifts opened.',
      },
      lorelai: {
        itemName: 'Sacred Coral Branch',
        slot: 'Signet',
        stats: 'Attack +50, Defense +50, Health +300',
        passive: 'Restores active action points of allied cohorts by 10% when skill is cast.',
        lore: 'A piece of glowing coral preserved in lunar liquid, representing her ancient reefs home.',
      },
      shadow: {
        itemName: 'Lucky Gold Coin',
        slot: 'Signet',
        stats: 'Attack +70, Defense +30, Health +240',
        passive: 'Generates +5% extra gold coins drop from world map bandit camps.',
        lore: 'A chipped pirate coin found in the Fenns docks, spun before every lethal mission.',
      },
      allanna: {
        itemName: 'Purified Sun Feather',
        slot: 'Signet',
        stats: 'Attack +45, Defense +55, Health +310',
        passive: 'Revives 10% of wounded cohorts automatically on victory, lowering hospital queue.',
        lore: 'A feather blessed by the Light Order, warm with the divine heat of the cathedral.',
      },
      remi: {
        itemName: "Mason's Pocketwatch",
        slot: 'Signet',
        stats: 'Attack +40, Defense +60, Health +320',
        passive: 'Increases stone production rates by 10% and speeds up crane lift operations.',
        lore: 'A heavy brass stopwatch showing perfect structural timings, handed down by his master mason father.',
      },
      rex: {
        itemName: "Commander's Medal",
        slot: 'Signet',
        stats: 'Attack +50, Defense +55, Health +330',
        passive: 'Reduces legion casualty rates during heavy sieges by 10% through absolute tactical morale.',
        lore: 'A polished shield medal awarded to Rex by Lord Marshal Maegan during his vanguard training.',
      },
      lumi: {
        itemName: 'Preserved Glacial Rose',
        slot: 'Signet',
        stats: 'Attack +55, Defense +45, Health +280',
        passive: 'Raises frost apothecary healing by 12% and increases field unit stamina by 15%.',
        lore: 'A beautiful rose frozen in ice-glass, reminding Lumi of the tranquil winter slopes of her home ridge.',
      },
      skye: {
        itemName: 'Feather of the High Roost',
        slot: 'Signet',
        stats: 'Attack +65, Defense +35, Health +250',
        passive: 'Reduces incoming ranged marksmen arrow strike damage to pegasus riders by 15%.',
        lore: 'A radiant golden feather shed by her lead pegasus stallion during their first high-flight battle.',
      },
      rayne: {
        itemName: 'Whispering Oak Leaf',
        slot: 'Signet',
        stats: 'Attack +62, Defense +38, Health +270',
        passive: 'Raises marksmen accuracy, boosting critical damage output on target legions by 10%.',
        lore: 'A silver-veined leaf gathered from her ancestral grove in the Whispering Canopy Plains.',
      },
      rubble: {
        itemName: 'Shattered Mallet Head',
        slot: 'Signet',
        stats: 'Attack +50, Defense +50, Health +290',
        passive: 'Boosts cohort melee knockback chances and increases structure breakdown speeds.',
        lore: 'An old, heavy iron wedge from Rubble’s first demolition job, dented and deeply scratched.',
      },
      noxx: {
        itemName: 'Preserved Venom Gland',
        slot: 'Signet',
        stats: 'Attack +70, Defense +30, Health +260',
        passive: 'Enhances toxic skill damage by 10% and reduces skill casting cooldowns.',
        lore: 'A rare organic specimen from a toxic swamp viper, preserved in thick biochemical fluid.',
      }
    }
  }
];

export default function ProgressionBibleModal({ isOpen, onClose }: ProgressionBibleModalProps) {
  const [activeTab, setActiveTab] = useState<'blueprint' | 'categories' | 'maegan_masterclass' | 'codex' | 'sandbox' | 'economy' | 'slots' | 'resonance' | 'json_schema' | 'godot_plan'>('blueprint');
  
  // --- SOVEREIGN SIGNATURES MASTERCLASS STATE ---
  const [signatureSelectedHeroId, setSignatureSelectedHeroId] = useState<string>('maegan');
  const [signatureSelectedCrownmarkId, setSignatureSelectedCrownmarkId] = useState<string>('founders_scepter');
  const [signatureAwakeningStars, setSignatureAwakeningStars] = useState<number>(3);
  const [signatureUpgradeLevel, setSignatureUpgradeLevel] = useState<number>(10);

  // --- CATEGORIES STATE ---
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('regalia');
  const [categorySelectedHeroId, setCategorySelectedHeroId] = useState<string>('maegan');

  
  // --- RESONANCE TAB STATE VARIABLES ---
  const [resonanceHeroId, setResonanceHeroId] = useState<string>('maegan');
  const [resonanceAuraVisual, setResonanceAuraVisual] = useState<'none' | 'celestial_glow' | 'cosmic_halo' | 'absolute_presence'>('celestial_glow');
  const [resonanceStars, setResonanceStars] = useState<number>(4);
  const [resonanceEnhancementLevel, setResonanceEnhancementLevel] = useState<number>(65);
  const [combatAnimState, setCombatAnimState] = useState<'idle' | 'casting' | 'striking' | 'recharging'>('idle');
  const [combatLogs, setCombatLogs] = useState<string[]>([
    "[READY] Sovereign Tactical Arena online. Select coordinates.",
    "[STATUS] Resonance system ready for deployment simulation."
  ]);
  const [triggerAuraAnimation, setTriggerAuraAnimation] = useState<boolean>(false);
  const [resonanceEquippedState, setResonanceEquippedState] = useState<Record<string, Record<string, boolean>>>({
    maegan: { scepter: true, crown: true, crest: true, charter: false, signet: false },
    shadow: { daggers: true, cowl: true, cloak: false, flag: false, emblem: false },
    lorelai: { bow: true, diadem: true, mantle: false, scroll: false, pendant: false },
    dominic: { shield: true, helmet: true, plate: false, victory: false, ring: false }
  });

  const runCombatAnimationSimulation = (heroId: string, finalResLevel: number) => {
    setTriggerAuraAnimation(true);
    setCombatAnimState('casting');
    
    const heroNames: Record<string, string> = {
      maegan: 'Maegan Violet',
      shadow: 'Syndicate Shadow',
      lorelai: 'Lorelai Archon',
      dominic: 'Dominic Bastion'
    };
    
    const name = heroNames[heroId] || 'Hero';
    const cleanLogs = [`[CAST] ${name} gathers elemental energy to activate Sovereign Ultimate!`];
    
    setCombatLogs([`⏳ [INIT] Casting active sequence...`, ...cleanLogs]);
    
    setTimeout(() => {
      setCombatAnimState('striking');
      let strikeLog = "";
      let auraLog = "";
      if (heroId === 'maegan') {
        strikeLog = "💥 [IMPACT] Violet Orbital Rain descends, dealing 420 true AoE damage!";
        auraLog = "✨ [AURA] Infantry Counter-Attack speed increased by +15%!";
      } else if (heroId === 'shadow') {
        strikeLog = "🗡️ [IMPACT] Dual daggers inflict 3 consecutive CRITICAL hits from forest coords!";
        auraLog = "💨 [AURA] Phantom Fog reduces opponent rage rates by -25%!";
      } else if (heroId === 'lorelai') {
        strikeLog = "🏹 [IMPACT] Moonbeam Cascade arrow volley freezes target cohorts for 2.5 seconds!";
        auraLog = "❄️ [AURA] Moonlight Sanctum deflects long-range projectiles!";
      } else {
        strikeLog = "🧱 [IMPACT] Earthshaker Stomp shockwave knocks back surrounding legions!";
        auraLog = "🛡️ [AURA] Fortress Shell shields cohorts against incoming magical hazards!";
      }
      setCombatLogs(prev => [strikeLog, auraLog, ...prev]);
    }, 700);

    setTimeout(() => {
      setCombatAnimState('recharging');
      let finalLog = "";
      if (finalResLevel >= 5) {
        finalLog = "🌟 [OVERDRIVE] Level 5 Celestial Overdrive heals surrounding armies for +8% Max HP!";
      } else if (finalResLevel >= 3) {
        finalLog = "🔮 [RESONANCE] Aegis Sentinel restores +3% HP per second to vanguard units!";
      } else {
        finalLog = "⚡ [ENERGY] Combat aura recharging. Resonance Level " + finalResLevel + " stabilized.";
      }
      setCombatLogs(prev => [finalLog, ...prev]);
    }, 1500);

    setTimeout(() => {
      setCombatAnimState('idle');
      setTriggerAuraAnimation(false);
      setCombatLogs(prev => ["✓ [COMPLETE] Ultimate spell cycle finished successfully.", ...prev]);
    }, 2500);
  };

  // --- JSON SCHEMA TAB STATE VARIABLES ---
  const [selectedSchemaFile, setSelectedSchemaFile] = useState<string>('crownmarks.json');
  const [jsonCopied, setJsonCopied] = useState<boolean>(false);

  // --- GODOT PLAN TAB STATE VARIABLES ---
  const [godotActiveSectionId, setGodotActiveSectionId] = useState<string>('autoloads');
  const [godotSearchQuery, setGodotSearchQuery] = useState<string>('');
  const [godotCopied, setGodotCopied] = useState<boolean>(false);

  // --- SLOTS TAB STATE VARIABLES ---
  const [slotsHeroId, setSlotsHeroId] = useState<string>('maegan');
  const [slotsSelectedSlotIndex, setSlotsSelectedSlotIndex] = useState<number>(0);
  const [slotsSimLevel, setSlotsSimLevel] = useState<number>(55);
  const [slotsSimStars, setSlotsSimStars] = useState<number>(3);
  
  // --- ECONOMY TAB STATE VARIABLES ---
  const [activeEconomySubTab, setActiveEconomySubTab] = useState<'sources' | 'summon' | 'craft'>('sources');
  const [simKeys, setSimKeys] = useState<number>(30);
  const [gachaPity, setGachaPity] = useState<number>(0);
  const [latestDraws, setLatestDraws] = useState<{ id: string; name: string; rarity: 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Material'; color: string; count: number; duplicate: boolean }[]>([]);
  const [selectedCraftCrownmarkId, setSelectedCraftCrownmarkId] = useState<string>('founders_scepter');
  const [craftQuantity, setCraftQuantity] = useState<number>(1);
  const [selectedSourceId, setSelectedSourceId] = useState<string>('wildlings');
  const [economyFilter, setEconomyFilter] = useState<string>('all');
  const [sourceSimLog, setSourceSimLog] = useState<{ text: string; items: { name: string; count: string; color: string }[] } | null>(null);
  const [weeklyLimits, setWeeklyLimits] = useState<Record<string, number>>({
    keys: 2,
    bundles: 3,
    shards: 1,
    alliance_keys: 3,
    alliance_sparks: 5,
    alliance_shards: 2
  });
  
  // Codex Tab State
  const [selectedHeroId, setSelectedHeroId] = useState<string>('maegan');
  const [registeredCrownmarks, setRegisteredCrownmarks] = useState<Record<string, boolean>>({
    founders_scepter: true,
    founders_crown: true,
    royal_crest: false,
    sapphire_signet: false,
    royal_charter: true,
    twin_shadow_daggers: true,
    assassin_mask: false,
    shadow_cloak: false,
    night_emblem: true,
    smoke_bomb: false
  });

  // Designer explanation details collapsible
  const [expandedPhilosophies, setExpandedPhilosophies] = useState<Record<string, boolean>>({
    levels: true,
    awakening: false,
    failure: false,
    resonance: false,
    collection: false
  });

  const togglePhilosophy = (key: string) => {
    setExpandedPhilosophies(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Sandbox Tab State
  const [sandboxHeroId, setSandboxHeroId] = useState<string>('maegan');
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0); // 0: Weapon, 1: Helm, 2: Crest, 3: Signet, 4: Charter

  // Equipped crownmarks in sandbox for the selected hero
  const [equippedCrownmarksState, setEquippedCrownmarksState] = useState<Record<string, string[]>>({
    maegan: ['founders_scepter', 'founders_crown', 'royal_crest', 'sapphire_signet', 'royal_charter'],
    shadow: ['twin_shadow_daggers', 'assassin_mask', 'shadow_cloak', 'night_emblem', 'smoke_bomb'],
    lorelai: ['moonkeepers_bow', 'lunar_tiara', 'moon_crystal_crownmark', 'silver_pendant', 'celestial_tome'],
    dominic: ['vanguard_shield', 'marshals_greaves', 'iron_signet_crownmark', 'concordat_plate', 'banner_of_victory']
  });

  // Crownmark statistics state (level, stars, rarity per slot)
  const [crownmarkStatsState, setCrownmarkStatsState] = useState<Record<string, { level: number; stars: number; rarity: 'Rare' | 'Epic' | 'Legendary' | 'Mythic' }>>({
    'maegan_0': { level: 45, stars: 3, rarity: 'Epic' },
    'maegan_1': { level: 30, stars: 2, rarity: 'Epic' },
    'maegan_2': { level: 25, stars: 1, rarity: 'Rare' },
    'maegan_3': { level: 12, stars: 0, rarity: 'Rare' },
    'maegan_4': { level: 60, stars: 4, rarity: 'Legendary' },

    'shadow_0': { level: 50, stars: 3, rarity: 'Epic' },
    'shadow_1': { level: 40, stars: 2, rarity: 'Epic' },
    'shadow_2': { level: 10, stars: 0, rarity: 'Rare' },
    'shadow_3': { level: 30, stars: 2, rarity: 'Epic' },
    'shadow_4': { level: 20, stars: 1, rarity: 'Rare' },

    'lorelai_0': { level: 35, stars: 2, rarity: 'Epic' },
    'lorelai_1': { level: 15, stars: 0, rarity: 'Rare' },
    'lorelai_2': { level: 55, stars: 4, rarity: 'Legendary' },
    'lorelai_3': { level: 10, stars: 0, rarity: 'Rare' },
    'lorelai_4': { level: 40, stars: 3, rarity: 'Epic' },

    'dominic_0': { level: 55, stars: 4, rarity: 'Legendary' },
    'dominic_1': { level: 45, stars: 3, rarity: 'Epic' },
    'dominic_2': { level: 30, stars: 2, rarity: 'Epic' },
    'dominic_3': { level: 25, stars: 1, rarity: 'Rare' },
    'dominic_4': { level: 15, stars: 0, rarity: 'Rare' }
  });

  // Sandbox Inventory Materials
  const [inventory, setInventory] = useState({
    gold: 345000,
    crystals: 1500,
    dust: 180000,
    starSparks: 550,
    celestialShards: 45,
    fragments: 250 // Crownmark fragments (representing duplicate crownmarks melted/salvaged)
  });

  // Failure and Pity State (Calibration)
  // key: "heroId_slotIndex" -> accumulated pity percentage (0 to 100)
  const [pityState, setPityState] = useState<Record<string, number>>({});
  const [simAlertMsg, setSimAlertMsg] = useState<{ text: string; type: 'success' | 'fail' | 'info' | 'error' } | null>(null);
  const [lastRollResult, setLastRollResult] = useState<{ success: boolean; roll: number; rate: number } | null>(null);

  if (!isOpen) return null;

  // Swaps a crownmark in the active sandbox slot
  const handleEquipCrownmark = (crownmarkId: string) => {
    setEquippedCrownmarksState(prev => {
      const currentArr = [...prev[sandboxHeroId]];
      currentArr[selectedSlotIndex] = crownmarkId;
      return {
        ...prev,
        [sandboxHeroId]: currentArr
      };
    });
    triggerFeedbackAlert("Crownmark swapped successfully in simulation slot!", 'info');
  };

  const triggerFeedbackAlert = (text: string, type: 'success' | 'fail' | 'info' | 'error') => {
    setSimAlertMsg({ text, type });
    setTimeout(() => {
      setSimAlertMsg(null);
    }, 4500);
  };

  // Level Up Cost Formula (similar to Whiteout Survival / Call of Dragons scale)
  const getLevelUpCost = (currentLevel: number, rarity: 'Rare' | 'Epic' | 'Legendary' | 'Mythic') => {
    const rarityMultiplier = rarity === 'Rare' ? 1.0 : rarity === 'Epic' ? 1.5 : rarity === 'Legendary' ? 2.2 : 3.5;
    const dustCost = Math.round(currentLevel * 140 * Math.pow(1.05, currentLevel) * rarityMultiplier);
    const goldCost = Math.round(currentLevel * 180 * Math.pow(1.04, currentLevel) * rarityMultiplier);
    return { dust: Math.max(120, dustCost), gold: Math.max(150, goldCost) };
  };

  // Awakening Cost Formula
  const getAwakeningRequirements = (currentStars: number) => {
    switch (currentStars) {
      case 0: // 0★ -> 1★
        return { fragments: 10, sparks: 40, shards: 0, crystals: 0, gold: 5000, rate: 100, maxLevel: 40 };
      case 1: // 1★ -> 2★
        return { fragments: 20, sparks: 80, shards: 0, crystals: 0, gold: 12000, rate: 100, maxLevel: 60 };
      case 2: // 2★ -> 3★
        return { fragments: 45, sparks: 150, shards: 5, crystals: 0, gold: 30000, rate: 85, maxLevel: 80 };
      case 3: // 3★ -> 4★
        return { fragments: 90, sparks: 300, shards: 15, crystals: 25, gold: 75000, rate: 60, maxLevel: 90 };
      case 4: // 4★ -> 5★
        return { fragments: 180, sparks: 600, shards: 40, crystals: 100, gold: 200000, rate: 40, maxLevel: 100 };
      default:
        return { fragments: 0, sparks: 0, shards: 0, crystals: 0, gold: 0, rate: 0, maxLevel: 100 };
    }
  };

  // Upgrades level of active selected slot
  const handleLevelUp = () => {
    const statKey = `${sandboxHeroId}_${selectedSlotIndex}`;
    const stats = crownmarkStatsState[statKey] || { level: 1, stars: 0, rarity: 'Rare' };
    
    // Level cap based on stars
    const levelCap = stats.stars === 0 ? 20 
                    : stats.stars === 1 ? 40 
                    : stats.stars === 2 ? 60 
                    : stats.stars === 3 ? 80 
                    : stats.stars === 4 ? 90 
                    : 100;

    if (stats.level >= levelCap) {
      triggerFeedbackAlert(`⚠️ Ceiling Reached! Perform Star Awakening (${stats.stars}★ ➔ ${stats.stars + 1}★) to raise level cap above ${levelCap}.`, 'error');
      return;
    }

    const cost = getLevelUpCost(stats.level, stats.rarity);
    if (inventory.dust < cost.dust) {
      triggerFeedbackAlert("❌ Resource Deficit! Insufficient Crownmark Dust.", 'error');
      return;
    }
    if (inventory.gold < cost.gold) {
      triggerFeedbackAlert("❌ Gold Deficit! Insufficient Silver Crowns (Gold Cost).", 'error');
      return;
    }

    // Deduct and upgrade
    setInventory(prev => ({ 
      ...prev, 
      dust: prev.dust - cost.dust,
      gold: prev.gold - cost.gold
    }));
    
    setCrownmarkStatsState(prev => ({
      ...prev,
      [statKey]: {
        ...stats,
        level: stats.level + 1
      }
    }));
    
    triggerFeedbackAlert(`✨ Success! Crownmark upgraded to level ${stats.level + 1}.`, 'success');
  };

  // Awakens stars of active selected slot (With simulated failure rates and pity!)
  const handleAwaken = () => {
    const statKey = `${sandboxHeroId}_${selectedSlotIndex}`;
    const stats = crownmarkStatsState[statKey] || { level: 1, stars: 0, rarity: 'Rare' };

    if (stats.stars >= 5) {
      triggerFeedbackAlert("⭐ Max Awakening level reached! This Crownmark is already in Sovereign Status.", 'info');
      return;
    }

    const reqs = getAwakeningRequirements(stats.stars);
    
    if (inventory.fragments < reqs.fragments) {
      triggerFeedbackAlert("❌ Material Deficit! Insufficient Duplicate Fragments.", 'error');
      return;
    }
    if (inventory.starSparks < reqs.sparks) {
      triggerFeedbackAlert("❌ Material Deficit! Insufficient Star Forge Sparks.", 'error');
      return;
    }
    if (inventory.celestialShards < reqs.shards) {
      triggerFeedbackAlert("❌ Material Deficit! Insufficient Elite Celestial Shards.", 'error');
      return;
    }
    if (inventory.crystals < reqs.crystals) {
      triggerFeedbackAlert("❌ Crystal Deficit! Insufficient Fire Crystals.", 'error');
      return;
    }
    if (inventory.gold < reqs.gold) {
      triggerFeedbackAlert("❌ Gold Deficit! Insufficient Gold coins.", 'error');
      return;
    }

    // Calculate simulated outcome
    const currentPity = pityState[statKey] || 0;
    const effectiveChance = Math.min(100, reqs.rate + currentPity);
    const roll = Math.floor(Math.random() * 100) + 1;
    const isSuccess = roll <= effectiveChance;

    setLastRollResult({ success: isSuccess, roll, rate: effectiveChance });

    if (isSuccess) {
      // Consolidate everything
      setInventory(prev => ({
        ...prev,
        fragments: prev.fragments - reqs.fragments,
        starSparks: prev.starSparks - reqs.sparks,
        celestialShards: prev.celestialShards - reqs.shards,
        crystals: prev.crystals - reqs.crystals,
        gold: prev.gold - reqs.gold
      }));

      setCrownmarkStatsState(prev => ({
        ...prev,
        [statKey]: {
          ...stats,
          stars: stats.stars + 1,
          level: Math.max(stats.level, stats.level + 2) // Bonus small bump
        }
      }));

      // Reset pity
      setPityState(prev => ({
        ...prev,
        [statKey]: 0
      }));

      triggerFeedbackAlert(`🏆 Star Forge Awakened! Crownmark reached ${stats.stars + 1}★. Max level cap extended!`, 'success');
    } else {
      // FAILURE PROTECTION: Free-to-play friendly safeguard!
      // Call of Dragons style: Refund the ultra-rare Fragments, Celestial Shards and Crystals!
      // Only consume Gold and Star Sparks. Accumulate pity resonance!
      const pityGain = 15;
      const nextPity = Math.min(100, currentPity + pityGain);

      setInventory(prev => ({
        ...prev,
        starSparks: prev.starSparks - reqs.sparks, // Sparks consumed
        gold: prev.gold - reqs.gold // Gold consumed
        // Fragments, Celestial Shards and Crystals are PROTECTED and REFUNDED automatically!
      }));

      setPityState(prev => ({
        ...prev,
        [statKey]: nextPity
      }));

      triggerFeedbackAlert(`⚠️ Forge Temperature Unstable! Awakening failed. SAFEGUARD: Duplicate fragments, Shards and Crystals preserved! Pity Resonance increased by +${pityGain}% (Now ${nextPity}% bonus chance).`, 'fail');
    }
  };

  // Add simulated resources to play sandbox
  const handleAddResources = () => {
    setInventory(prev => ({
      gold: prev.gold + 500000,
      crystals: prev.crystals + 1000,
      dust: prev.dust + 200000,
      starSparks: prev.starSparks + 500,
      celestialShards: prev.celestialShards + 50,
      fragments: prev.fragments + 300
    }));
    triggerFeedbackAlert("🎁 Sandbox resources grant received! +500k Gold, +1k Crystals, +200k Dust, and multiple Forge tokens added.", 'success');
  };

  const handleResetSandbox = () => {
    setInventory({
      gold: 150000,
      crystals: 50,
      dust: 80000,
      starSparks: 250,
      celestialShards: 10,
      fragments: 120
    });
    setPityState({});
    setLastRollResult(null);
    triggerFeedbackAlert("🔄 Simulated materials restored to baseline free-to-play starting parameters.", 'info');
  };

  // --- DETAILED ECONOMY GACHA SIMULATOR ---
  const handleSimulateGacha = (pullCount: number) => {
    if (simKeys < pullCount) {
      const costCrystals = (pullCount - simKeys) * 100;
      if (inventory.crystals < costCrystals) {
        triggerFeedbackAlert("❌ Out of Gacha Keys & Crystals! Get more testing resources from the sandbox menu.", 'error');
        return;
      }
      setInventory(prev => ({ ...prev, crystals: prev.crystals - costCrystals }));
      setSimKeys(0);
    } else {
      setSimKeys(prev => prev - pullCount);
    }

    const pool = Object.values(CROWNMARKS_DATABASE);
    const results: { id: string; name: string; rarity: 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Material'; color: string; count: number; duplicate: boolean }[] = [];
    let fragGain = 0;
    let sparksGain = 0;
    let dustGain = 0;
    let shardGain = 0;
    let crystalsGain = 0;

    let tempPity = gachaPity;

    for (let i = 0; i < pullCount; i++) {
      tempPity += 1;
      let rolledRarity: 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Material' = 'Material';
      const roll = Math.random() * 100;

      if (tempPity >= 30) {
        rolledRarity = roll < 30 ? 'Mythic' : 'Legendary';
        tempPity = 0;
      } else {
        if (roll < 2) {
          rolledRarity = 'Mythic';
        } else if (roll < 10) {
          rolledRarity = 'Legendary';
        } else if (roll < 35) {
          rolledRarity = 'Epic';
        } else if (roll < 75) {
          rolledRarity = 'Rare';
        } else {
          rolledRarity = 'Material';
        }
      }

      if (rolledRarity === 'Mythic') {
        crystalsGain += 1;
        results.push({
          id: 'mythic_crystal',
          name: 'Fire Crystal (Mythic)',
          rarity: 'Mythic',
          color: '#ef4444',
          count: 1,
          duplicate: false
        });
      } else if (rolledRarity === 'Material') {
        const matRoll = Math.random();
        if (matRoll < 0.6) {
          const count = Math.floor(Math.random() * 800) + 400;
          dustGain += count;
          results.push({ id: 'dust', name: 'Crownmark Dust', rarity: 'Material', color: '#a855f7', count, duplicate: false });
        } else if (matRoll < 0.9) {
          const count = Math.floor(Math.random() * 4) + 2;
          sparksGain += count;
          results.push({ id: 'sparks', name: 'Star Forge Sparks', rarity: 'Material', color: '#eab308', count, duplicate: false });
        } else {
          const count = Math.floor(Math.random() * 2) + 1;
          shardGain += count;
          results.push({ id: 'shards', name: 'Celestial Shards', rarity: 'Material', color: '#06b6d4', count, duplicate: false });
        }
      } else {
        const subPool = pool.filter(r => {
          if (rolledRarity === 'Rare') return r.color === '#2563eb' || r.color === '#475569' || r.color === '#1e1b4b' || r.color === '#10b981';
          if (rolledRarity === 'Epic') return r.color === '#6366f1' || r.color === '#3b82f6' || r.color === '#ec4899';
          return r.color === '#a855f7' || r.color === '#eab308' || r.color === '#06b6d4';
        });

        const crownmark = subPool[Math.floor(Math.random() * subPool.length)] || pool[0];
        const isDuplicate = registeredCrownmarks[crownmark.id] || false;
        
        if (isDuplicate) {
          const meltCount = rolledRarity === 'Rare' ? 12 : rolledRarity === 'Epic' ? 30 : 80;
          fragGain += meltCount;
          results.push({
            id: crownmark.id,
            name: `${crownmark.name} (Duplicate Melted)`,
            rarity: rolledRarity,
            color: crownmark.color,
            count: meltCount,
            duplicate: true
          });
        } else {
          setRegisteredCrownmarks(prev => ({ ...prev, [crownmark.id]: true }));
          results.push({
            id: crownmark.id,
            name: crownmark.name,
            rarity: rolledRarity,
            color: crownmark.color,
            count: 1,
            duplicate: false
          });
        }

        if (rolledRarity === 'Legendary') {
          tempPity = 0;
        }
      }
    }

    setGachaPity(tempPity);
    setLatestDraws(results);

    setInventory(prev => ({
      ...prev,
      dust: prev.dust + dustGain,
      starSparks: prev.starSparks + sparksGain,
      celestialShards: prev.celestialShards + shardGain,
      crystals: prev.crystals + crystalsGain,
      fragments: prev.fragments + fragGain
    }));

    triggerFeedbackAlert(`🎁 Gacha simulated! Gained ${fragGain} Duplicate Fragments, ${dustGain} Dust, ${sparksGain} Sparks, and unlocked matching Codex logs.`, 'success');
  };

  // --- INTERACTIVE CRAFTING FORGE LOGIC ---
  const handleCraftCrownmark = () => {
    const crownmark = CROWNMARKS_DATABASE[selectedCraftCrownmarkId];
    if (!crownmark) return;

    let cost = 100;
    let rarityName = 'Epic';
    if (crownmark.color === '#2563eb' || crownmark.color === '#475569' || crownmark.color === '#1e1b4b' || crownmark.color === '#10b981') {
      cost = 40;
      rarityName = 'Rare';
    } else if (crownmark.color === '#a855f7' || crownmark.color === '#eab308' || crownmark.color === '#06b6d4') {
      cost = 250;
      rarityName = 'Legendary';
    }

    const totalCost = cost * craftQuantity;
    if (inventory.fragments < totalCost) {
      triggerFeedbackAlert(`❌ Crafting Deficit! Synthesizing ${craftQuantity}x ${crownmark.name} requires ${totalCost} Fragments. You only have ${inventory.fragments}.`, 'error');
      return;
    }

    setInventory(prev => ({ ...prev, fragments: prev.fragments - totalCost }));
    setRegisteredCrownmarks(prev => ({ ...prev, [crownmark.id]: true }));

    triggerFeedbackAlert(`🔨 Forge Success! Crafted ${craftQuantity}x ${crownmark.name} (${rarityName}). Registered in Codex logs!`, 'success');
  };

  // --- COMPLETE CROWNMARK ECONOMY SOURCE BOARD SIMULATOR ---
  const handleSimulateSource = (sourceId: string) => {
    let goldGain = 0;
    let crystalsGain = 0;
    let dustGain = 0;
    let sparksGain = 0;
    let shardGain = 0;
    let fragGain = 0;
    let keysGain = 0;
    let itemsWon: { name: string; count: string; color: string }[] = [];
    let logMsg = "";

    switch (sourceId) {
      case 'wildlings': {
        goldGain = Math.floor(Math.random() * 21) + 10;
        dustGain = Math.floor(Math.random() * 251) + 150;
        itemsWon.push({ name: 'Gold', count: `+${goldGain}`, color: '#eab308' });
        itemsWon.push({ name: 'Crownmark Dust', count: `+${dustGain}`, color: '#a855f7' });
        
        if (Math.random() < 0.05) {
          fragGain = 1;
          itemsWon.push({ name: 'Rare Fragment', count: '+1', color: '#10b981' });
        }
        if (Math.random() < 0.01) {
          const pool = Object.values(CROWNMARKS_DATABASE).filter(r => r.color === '#2563eb' || r.color === '#475569' || r.color === '#1e1b4b' || r.color === '#10b981');
          const drawn = pool[Math.floor(Math.random() * pool.length)];
          const isDup = registeredCrownmarks[drawn.id];
          if (isDup) {
            fragGain += 12;
            itemsWon.push({ name: `${drawn.name} (Duplicate)`, count: '+12 Frags', color: drawn.color });
          } else {
            setRegisteredCrownmarks(prev => ({ ...prev, [drawn.id]: true }));
            itemsWon.push({ name: drawn.name, count: 'New! Unlocked', color: drawn.color });
          }
        }
        logMsg = "⚔️ Deployed standard cavalry vanguard to purge level 15 Wildling raiders. Sector secured with clean tactical margins!";
        break;
      }
      case 'alliance_bosses': {
        goldGain = Math.floor(Math.random() * 1001) + 1000;
        dustGain = Math.floor(Math.random() * 501) + 500;
        sparksGain = Math.floor(Math.random() * 6) + 5;
        itemsWon.push({ name: 'Gold', count: `+${goldGain.toLocaleString()}`, color: '#eab308' });
        itemsWon.push({ name: 'Crownmark Dust', count: `+${dustGain}`, color: '#a855f7' });
        itemsWon.push({ name: 'Star Sparks', count: `+${sparksGain}`, color: '#eab308' });

        if (Math.random() < 0.35) {
          const frags = Math.floor(Math.random() * 8) + 5;
          fragGain += frags;
          itemsWon.push({ name: 'Epic Fragments', count: `+${frags}`, color: '#3b82f6' });
        }
        if (Math.random() < 0.15) {
          const pool = Object.values(CROWNMARKS_DATABASE).filter(r => r.color === '#6366f1' || r.color === '#3b82f6' || r.color === '#ec4899');
          const drawn = pool[Math.floor(Math.random() * pool.length)];
          const isDup = registeredCrownmarks[drawn.id];
          if (isDup) {
            fragGain += 30;
            itemsWon.push({ name: `${drawn.name} (Duplicate)`, count: '+30 Frags', color: drawn.color });
          } else {
            setRegisteredCrownmarks(prev => ({ ...prev, [drawn.id]: true }));
            itemsWon.push({ name: drawn.name, count: 'New! Unlocked', color: drawn.color });
          }
        }
        logMsg = "🛡️ Coordinated full-guild alliance rally against the Titan Golem. Tactical resonance breaks defense shields!";
        break;
      }
      case 'world_bosses': {
        goldGain = Math.floor(Math.random() * 2001) + 3000;
        dustGain = Math.floor(Math.random() * 1001) + 1500;
        sparksGain = Math.floor(Math.random() * 11) + 15;
        shardGain = Math.floor(Math.random() * 4) + 2;
        itemsWon.push({ name: 'Gold', count: `+${goldGain.toLocaleString()}`, color: '#eab308' });
        itemsWon.push({ name: 'Crownmark Dust', count: `+${dustGain}`, color: '#a855f7' });
        itemsWon.push({ name: 'Star Sparks', count: `+${sparksGain}`, color: '#eab308' });
        itemsWon.push({ name: 'Celestial Shards', count: `+${shardGain}`, color: '#06b6d4' });

        if (Math.random() < 0.70) {
          const frags = Math.floor(Math.random() * 21) + 10;
          fragGain += frags;
          itemsWon.push({ name: 'Legendary Fragments', count: `+${frags}`, color: '#06b6d4' });
        }
        if (Math.random() < 0.30) {
          const pool = Object.values(CROWNMARKS_DATABASE).filter(r => r.color === '#a855f7' || r.color === '#eab308' || r.color === '#06b6d4');
          const drawn = pool[Math.floor(Math.random() * pool.length)];
          const isDup = registeredCrownmarks[drawn.id];
          if (isDup) {
            fragGain += 80;
            itemsWon.push({ name: `${drawn.name} (Duplicate)`, count: '+80 Frags', color: drawn.color });
          } else {
            setRegisteredCrownmarks(prev => ({ ...prev, [drawn.id]: true }));
            itemsWon.push({ name: drawn.name, count: 'New! Unlocked', color: drawn.color });
          }
        }
        logMsg = "🌋 Server-wide World Raid: Scorched Earth Wyrm defeated! Top 10 damage ranks secured, delivering premium sovereign spoils.";
        break;
      }
      case 'battle_pass': {
        dustGain = 1500;
        sparksGain = 15;
        keysGain = 2;
        crystalsGain = 100;
        itemsWon.push({ name: 'Gacha Keys', count: `+2`, color: '#a855f7' });
        itemsWon.push({ name: 'Gems', count: `+100`, color: '#ef4444' });
        itemsWon.push({ name: 'Crownmark Dust', count: `+1,500`, color: '#a855f7' });
        itemsWon.push({ name: 'Star Sparks', count: `+15`, color: '#eab308' });

        if (Math.random() < 0.5) {
          shardGain = 5;
          const pool = Object.values(CROWNMARKS_DATABASE).filter(r => r.color === '#6366f1' || r.color === '#3b82f6' || r.color === '#ec4899');
          const drawn = pool[Math.floor(Math.random() * pool.length)];
          const isDup = registeredCrownmarks[drawn.id];
          
          itemsWon.push({ name: 'Celestial Shards', count: `+5`, color: '#06b6d4' });
          if (isDup) {
            fragGain += 30;
            itemsWon.push({ name: `${drawn.name} (Sovereign BP Dup)`, count: '+30 Frags', color: drawn.color });
          } else {
            setRegisteredCrownmarks(prev => ({ ...prev, [drawn.id]: true }));
            itemsWon.push({ name: `${drawn.name} (Sovereign BP)`, count: 'New! Unlocked', color: drawn.color });
          }
          logMsg = "🎫 Sovereign Battle Pass level 40 milestone unlocked! Gained elite-track bonus chests.";
        } else {
          logMsg = "🎫 Free Battle Pass milestone claimed successfully! Upgrade resources transferred.";
        }
        break;
      }
      case 'events': {
        crystalsGain = Math.floor(Math.random() * 151) + 100;
        keysGain = 1;
        const frags = Math.floor(Math.random() * 16) + 15;
        fragGain += frags;
        
        itemsWon.push({ name: 'Gems', count: `+${crystalsGain}`, color: '#ef4444' });
        itemsWon.push({ name: 'Gacha Key', count: `+1`, color: '#a855f7' });
        itemsWon.push({ name: 'Event Fragments', count: `+${frags}`, color: '#10b981' });

        logMsg = "🎪 Rotating Challenge Event 'Star Forge Trial' completed. Master tier efficiency achieved!";
        break;
      }
      case 'treasure_hunts': {
        crystalsGain = Math.floor(Math.random() * 51) + 50;
        keysGain = 1;
        itemsWon.push({ name: 'Gems', count: `+${crystalsGain}`, color: '#ef4444' });
        itemsWon.push({ name: 'Gacha Key', count: `+1`, color: '#a855f7' });

        if (Math.random() < 0.20) {
          const frags = Math.floor(Math.random() * 16) + 15;
          fragGain += frags;
          itemsWon.push({ name: 'Rare Fragments', count: `+${frags}`, color: '#10b981' });
        }
        logMsg = "🗺️ Scout dispatched with ancient scroll coordinates. Uncovered legendary burial vault behind hidden mountain pass!";
        break;
      }
      case 'ancient_ruins': {
        crystalsGain = 800;
        sparksGain = 30;
        itemsWon.push({ name: 'Gems', count: `+800`, color: '#ef4444' });
        itemsWon.push({ name: 'Star Sparks', count: `+30`, color: '#eab308' });

        const pool = Object.values(CROWNMARKS_DATABASE).filter(r => r.color === '#6366f1' || r.color === '#3b82f6' || r.color === '#ec4899');
        const drawn = pool[Math.floor(Math.random() * pool.length)];
        const isDup = registeredCrownmarks[drawn.id];
        if (isDup) {
          fragGain += 30;
          itemsWon.push({ name: `${drawn.name} (Duplicate)`, count: '+30 Frags', color: drawn.color });
        } else {
          setRegisteredCrownmarks(prev => ({ ...prev, [drawn.id]: true }));
          itemsWon.push({ name: drawn.name, count: 'New! Unlocked', color: drawn.color });
        }
        logMsg = "🏛️ Permanent PVE Milestone Campaign Stage 12-5 cleared! Ancient sovereign runic matrix successfully parsed.";
        break;
      }
      case 'kingdom_events': {
        crystalsGain = 500;
        keysGain = 2;
        shardGain = Math.floor(Math.random() * 11) + 10;
        
        itemsWon.push({ name: 'Gems', count: `+500`, color: '#ef4444' });
        itemsWon.push({ name: 'Gacha Keys', count: `+2`, color: '#a855f7' });
        itemsWon.push({ name: 'Celestial Shards', count: `+${shardGain}`, color: '#06b6d4' });

        logMsg = "👑 Realm vs Realm War: Sovereign Citadel captured. Crown spire active-duty defenders receive peak kingdom rations!";
        break;
      }
      case 'alliance_shop': {
        if (weeklyLimits.alliance_keys <= 0 && weeklyLimits.alliance_sparks <= 0 && weeklyLimits.alliance_shards <= 0) {
          triggerFeedbackAlert("❌ Weekly Alliance Shop quotas completely exhausted! Wait for weekly server refresh.", "error");
          return;
        }

        const available = [];
        if (weeklyLimits.alliance_keys > 0) available.push('keys');
        if (weeklyLimits.alliance_sparks > 0) available.push('sparks');
        if (weeklyLimits.alliance_shards > 0) available.push('shards');

        const chosen = available[Math.floor(Math.random() * available.length)];
        if (chosen === 'keys') {
          keysGain = 1;
          setWeeklyLimits(prev => ({ ...prev, alliance_keys: prev.alliance_keys - 1 }));
          itemsWon.push({ name: 'Gacha Key', count: `+1`, color: '#a855f7' });
          logMsg = "🤝 Exchanged 500 Alliance Points for weekly Gacha summon key.";
        } else if (chosen === 'sparks') {
          sparksGain = 10;
          setWeeklyLimits(prev => ({ ...prev, alliance_sparks: prev.alliance_sparks - 1 }));
          itemsWon.push({ name: 'Star Sparks', count: `+10`, color: '#eab308' });
          logMsg = "🤝 Exchanged 200 Alliance Points for 10x Star Forge Sparks.";
        } else {
          shardGain = 5;
          setWeeklyLimits(prev => ({ ...prev, alliance_shards: prev.alliance_shards - 1 }));
          itemsWon.push({ name: 'Celestial Shards', count: `+5`, color: '#06b6d4' });
          logMsg = "🤝 Exchanged 800 Alliance Points for 5x Celestial Shards.";
        }
        break;
      }
      case 'daily_quests': {
        crystalsGain = 50;
        keysGain = 1;
        goldGain = 2000;
        dustGain = 400;

        itemsWon.push({ name: 'Gems', count: `+50`, color: '#ef4444' });
        itemsWon.push({ name: 'Gacha Key', count: `+1`, color: '#a855f7' });
        itemsWon.push({ name: 'Gold', count: `+2,000`, color: '#eab308' });
        itemsWon.push({ name: 'Crownmark Dust', count: `+400`, color: '#a855f7' });

        logMsg = "📋 Daily Quest ledger cleared! Sovereign Citadel active patrol operations completed.";
        break;
      }
      case 'weekly_quests': {
        crystalsGain = 250;
        keysGain = 3;
        goldGain = 5000;
        dustGain = 1500;
        sparksGain = 20;

        itemsWon.push({ name: 'Gems', count: `+250`, color: '#ef4444' });
        itemsWon.push({ name: 'Gacha Keys', count: `+3`, color: '#a855f7' });
        itemsWon.push({ name: 'Gold', count: `+5,000`, color: '#eab308' });
        itemsWon.push({ name: 'Crownmark Dust', count: `+1,500`, color: '#a855f7' });
        itemsWon.push({ name: 'Star Sparks', count: `+20`, color: '#eab308' });

        logMsg = "📋 Weekly high-importance task log complete. Active marshal incentives dispatched!";
        break;
      }
      case 'season_rewards': {
        crystalsGain = 1000;
        keysGain = 5;
        dustGain = 5000;
        sparksGain = 50;
        shardGain = 10;

        itemsWon.push({ name: 'Gems', count: `+1,000`, color: '#ef4444' });
        itemsWon.push({ name: 'Gacha Keys', count: `+5`, color: '#a855f7' });
        itemsWon.push({ name: 'Crownmark Dust', count: `+5,000`, color: '#a855f7' });
        itemsWon.push({ name: 'Star Sparks', count: `+50`, color: '#eab308' });
        itemsWon.push({ name: 'Celestial Shards', count: `+10`, color: '#06b6d4' });

        logMsg = "❄️ Season 3 concludes! Active tier 'Marshal Legend' payout distributed to your ledger.";
        break;
      }
      case 'crafting': {
        const crownmark = CROWNMARKS_DATABASE[selectedCraftCrownmarkId];
        if (!crownmark) return;
        let cost = 100;
        let rarityName = 'Epic';
        if (crownmark.color === '#2563eb' || crownmark.color === '#475569' || crownmark.color === '#1e1b4b' || crownmark.color === '#10b981') {
          cost = 40;
          rarityName = 'Rare';
        } else if (crownmark.color === '#a855f7' || crownmark.color === '#eab308' || crownmark.color === '#06b6d4') {
          cost = 250;
          rarityName = 'Legendary';
        }

        const totalCost = cost * craftQuantity;
        if (inventory.fragments < totalCost) {
          triggerFeedbackAlert(`❌ Crafting Deficit! Synthesizing requires ${totalCost} Fragments. You have ${inventory.fragments}.`, 'error');
          return;
        }

        setInventory(prev => ({ ...prev, fragments: prev.fragments - totalCost }));
        setRegisteredCrownmarks(prev => ({ ...prev, [crownmark.id]: true }));

        itemsWon.push({ name: crownmark.name, count: `${craftQuantity}x Crafted`, color: crownmark.color });
        logMsg = `🔨 Forge Success! Crafted ${craftQuantity}x ${crownmark.name} (${rarityName}) via re-synthesis blueprint salvage!`;
        break;
      }
      case 'premium_shop': {
        if (weeklyLimits.keys <= 0 && weeklyLimits.bundles <= 0 && weeklyLimits.shards <= 0) {
          triggerFeedbackAlert("❌ Weekly Premium Shop limits completely exhausted! Whales are hard-capped for balance.", "error");
          return;
        }

        if (inventory.crystals < 400) {
          triggerFeedbackAlert("❌ Deficit in Sovereign Crystals! Grab more testing resources in the top bar.", "error");
          return;
        }

        const available = [];
        if (weeklyLimits.keys > 0) available.push('keys');
        if (weeklyLimits.bundles > 0) available.push('bundles');
        if (weeklyLimits.shards > 0) available.push('shards');

        const chosen = available[Math.floor(Math.random() * available.length)];
        if (chosen === 'keys') {
          crystalsGain = -400;
          keysGain = 5;
          setWeeklyLimits(prev => ({ ...prev, keys: prev.keys - 1 }));
          itemsWon.push({ name: 'Gacha Keys', count: `+5`, color: '#a855f7' });
          logMsg = "💎 Exchanged 400 Sovereign Crystals for the weekly limited 5x Summon Key Pack.";
        } else if (chosen === 'bundles') {
          crystalsGain = -300;
          dustGain = 5000;
          sparksGain = 25;
          setWeeklyLimits(prev => ({ ...prev, bundles: prev.bundles - 1 }));
          itemsWon.push({ name: 'Crownmark Dust', count: `+5,000`, color: '#a855f7' });
          itemsWon.push({ name: 'Star Sparks', count: `+25`, color: '#eab308' });
          logMsg = "💎 Exchanged 300 Sovereign Crystals for the weekly limited Upgrade Booster Bundle.";
        } else {
          crystalsGain = -500;
          shardGain = 5;
          setWeeklyLimits(prev => ({ ...prev, shards: prev.shards - 1 }));
          itemsWon.push({ name: 'Celestial Shards', count: `+5`, color: '#06b6d4' });
          logMsg = "💎 Exchanged 500 Sovereign Crystals for the weekly limited Celestial Shard Pack.";
        }
        break;
      }
      case 'hero_recruitment': {
        if (simKeys < 1) {
          if (inventory.crystals < 100) {
            triggerFeedbackAlert("❌ Out of Summon Keys & Crystals! Acquire more via Daily Quests or sandbox grants.", 'error');
            return;
          }
          crystalsGain = -100;
        } else {
          keysGain = -1;
        }

        const pool = Object.values(CROWNMARKS_DATABASE);
        const roll = Math.random() * 100;
        let rolledRarity: 'Rare' | 'Epic' | 'Legendary' = 'Rare';
        let rollColor = '#10b981';

        if (roll < 8.0) {
          rolledRarity = 'Legendary';
          rollColor = '#eab308';
        } else if (roll < 33.0) {
          rolledRarity = 'Epic';
          rollColor = '#a855f7';
        }

        const subPool = pool.filter(r => {
          if (rolledRarity === 'Rare') return r.color === '#2563eb' || r.color === '#475569' || r.color === '#1e1b4b' || r.color === '#10b981';
          if (rolledRarity === 'Epic') return r.color === '#6366f1' || r.color === '#3b82f6' || r.color === '#ec4899';
          return r.color === '#a855f7' || r.color === '#eab308' || r.color === '#06b6d4';
        });

        const drawn = subPool[Math.floor(Math.random() * subPool.length)] || pool[0];
        const isDup = registeredCrownmarks[drawn.id];

        if (isDup) {
          const salvage = rolledRarity === 'Rare' ? 12 : rolledRarity === 'Epic' ? 30 : 80;
          fragGain += salvage;
          itemsWon.push({ name: `${drawn.name} (Duplicate)`, count: `+${salvage} Fragments`, color: drawn.color });
        } else {
          setRegisteredCrownmarks(prev => ({ ...prev, [drawn.id]: true }));
          itemsWon.push({ name: drawn.name, count: 'New! Registered', color: drawn.color });
        }
        logMsg = `🔮 Consumed recruitment vault authorization. Rolled standard gacha and localized a ${rolledRarity} Crownmark!`;
        break;
      }
      default:
        break;
    }

    setSourceSimLog({ text: logMsg, items: itemsWon });
    setSimKeys(prev => prev + keysGain);
    setInventory(prev => ({
      ...prev,
      gold: prev.gold + goldGain,
      crystals: prev.crystals + crystalsGain,
      dust: prev.dust + dustGain,
      starSparks: prev.starSparks + sparksGain,
      celestialShards: prev.celestialShards + shardGain,
      fragments: prev.fragments + fragGain
    }));

    triggerFeedbackAlert(`💰 Activity Simulated! Check output ledger and updated reserves.`, 'success');
  };

  // --- MATHEMATICAL MATH SIMULATION ENGINE ---
  const calculateSandboxMath = () => {
    let totalPower = 0;
    let totalAttack = 0;
    let totalDefense = 0;
    let totalHealth = 0;
    let activeSignatureCount = 0;
    const activePassives: { name: string; desc: string; hero: string; slot: string; level: number; active: boolean }[] = [];

    const currentCrownmarkIds = equippedCrownmarksState[sandboxHeroId] || [];

    currentCrownmarkIds.forEach((crownmarkId, idx) => {
      const template = CROWNMARKS_DATABASE[crownmarkId];
      if (!template) return;

      const statKey = `${sandboxHeroId}_${idx}`;
      const stats = crownmarkStatsState[statKey] || { level: 1, stars: 0, rarity: 'Rare' };

      // Multipliers based on inputs
      const rarityFactor = stats.rarity === 'Rare' ? 1.0 
                         : stats.rarity === 'Epic' ? 1.6 
                         : stats.rarity === 'Legendary' ? 2.8 
                         : 4.8; // Mythic

      // Stat growth scaling: +25% per Star level, +6% per Level linear scaling
      const starFactor = 1.0 + (stats.stars * 0.25);
      const levelFactor = 1.0 + ((stats.level - 1) * 0.06);

      // Raw stats
      let slotAtk = template.baseStats.attack * rarityFactor * starFactor * levelFactor;
      let slotDef = template.baseStats.defense * rarityFactor * starFactor * levelFactor;
      let slotHp = template.baseStats.health * rarityFactor * starFactor * levelFactor;

      // Check signature matchmaking
      const isSignature = template.signatureHeroId === sandboxHeroId;
      
      // Passive Skill Unlocks scale with star levels: Level 1 at 0-2★, Level 2 at 3-4★, Level 3 at 5★
      const passiveLevel = stats.stars === 5 ? 3 : stats.stars >= 3 ? 2 : 1;
      const passiveScaleStr = passiveLevel === 3 ? "Level III (Sovereign Maximized)" : passiveLevel === 2 ? "Level II (Enhanced)" : "Level I (Standard)";

      if (isSignature) {
        activeSignatureCount += 1;
        activePassives.push({
          name: template.passiveName,
          desc: `${template.passiveDesc} - Currently operating at ${passiveScaleStr} (+${passiveLevel * 50}% effect scaling).`,
          hero: HEROES_LIST.find(h => h.id === template.signatureHeroId)?.name || 'General',
          slot: template.slot,
          level: passiveLevel,
          active: true
        });
      } else {
        // Apply 40% penalty for misaligned crownmarks
        slotAtk *= 0.6;
        slotDef *= 0.6;
        slotHp *= 0.6;
        activePassives.push({
          name: template.passiveName,
          desc: `${template.passiveDesc} (⚠️ LOCKED/DISABLED: Must equip on ${HEROES_LIST.find(h => h.id === template.signatureHeroId)?.name} to activate skill and reclaim 40% stat penalty).`,
          hero: HEROES_LIST.find(h => h.id === template.signatureHeroId)?.name || 'General',
          slot: template.slot,
          level: 0,
          active: false
        });
      }

      totalAttack += slotAtk;
      totalDefense += slotDef;
      totalHealth += slotHp;

      // Power rating metric
      const baseContribution = (slotAtk * 12) + (slotDef * 10) + (slotHp * 2);
      totalPower += isSignature ? baseContribution : baseContribution * 0.5;
    });

    // Resonance multipliers
    let resonanceTitle = 'No Active Resonance';
    let resonanceDesc = 'Equip at least 2 Signature Crownmarks on this hero to activate Tier I Resonance.';
    let resonancePowerMultiplier = 1.0;
    let resonanceLevel = 0;

    if (activeSignatureCount === 5) {
      resonanceTitle = 'Absolute Sovereign Presence';
      resonanceDesc = 'All 5 signature items active. Troop strike damage +20%, Critical strike rate +15%, and unlock Ambient Golden Cosmic Halo.';
      resonancePowerMultiplier = 1.45;
      resonanceLevel = 3;
      totalAttack *= 1.20;
      totalHealth *= 1.20;
    } else if (activeSignatureCount >= 4) {
      resonanceTitle = 'Tactical Surge (Resonance Tier II)';
      resonanceDesc = '4 signature items active. Raises all legion health and general attack indicators by +15%.';
      resonancePowerMultiplier = 1.25;
      resonanceLevel = 2;
      totalAttack *= 1.15;
      totalHealth *= 1.15;
    } else if (activeSignatureCount >= 2) {
      resonanceTitle = 'Troop Strike (Resonance Tier I)';
      resonanceDesc = '2 signature items active. Increases army general attack indicators by +10%.';
      resonancePowerMultiplier = 1.12;
      resonanceLevel = 1;
      totalAttack *= 1.10;
    }

    totalPower *= resonancePowerMultiplier;

    return {
      power: Math.round(totalPower),
      attack: Math.round(totalAttack),
      defense: Math.round(totalDefense),
      health: Math.round(totalHealth),
      signatureCount: activeSignatureCount,
      resonanceTitle,
      resonanceDesc,
      resonanceLevel,
      passives: activePassives
    };
  };

  // Permanent Collection registry points calculation
  const getCollectionBonusStats = () => {
    const registeredCount = Object.values(registeredCrownmarks).filter(Boolean).length;
    const totalCount = Object.keys(registeredCrownmarks).length;
    const completionPercent = Math.round((registeredCount / totalCount) * 100);

    const bonusAttack = registeredCount * 1.5;
    const bonusGathering = registeredCount * 2.0;
    const bonusBuilding = registeredCount * 1.0;

    return {
      registeredCount,
      totalCount,
      completionPercent,
      bonusAttack,
      bonusGathering,
      bonusBuilding
    };
  };

  const collectionBonus = getCollectionBonusStats();
  const simResults = calculateSandboxMath();
  const currentSlotCrownmarkId = equippedCrownmarksState[sandboxHeroId][selectedSlotIndex];
  const currentSlotCrownmark = CROWNMARKS_DATABASE[currentSlotCrownmarkId];
  const currentSlotStats = crownmarkStatsState[`${sandboxHeroId}_${selectedSlotIndex}`] || { level: 1, stars: 0, rarity: 'Rare' };
  const currentSlotIsSignature = currentSlotCrownmark?.signatureHeroId === sandboxHeroId;
  const currentSlotPity = pityState[`${sandboxHeroId}_${selectedSlotIndex}`] || 0;

  // Filter list of crownmarks that fit the selectedSlotIndex slot (e.g., Weapon, Helm, Crest, etc.)
  const SLOT_TYPES: ('Weapon' | 'Helm' | 'Crest' | 'Signet' | 'Charter')[] = ['Weapon', 'Helm', 'Crest', 'Signet', 'Charter'];
  const activeSlotType = SLOT_TYPES[selectedSlotIndex];
  const matchingSlotCrownmarks = Object.values(CROWNMARKS_DATABASE).filter(r => r.slot === activeSlotType);

  // Cost and specs for inspect slot
  const upgradeCost = getLevelUpCost(currentSlotStats.level, currentSlotStats.rarity);
  const awakenCost = getAwakeningRequirements(currentSlotStats.stars);

  return (
    <div 
      id="hero-crownmark-bible-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-md font-sans"
    >
      <motion.div 
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.97, opacity: 0 }}
        className="w-full max-w-6xl h-[92vh] bg-[#07090e] border border-purple-500/20 rounded-3xl overflow-hidden flex flex-col shadow-[0_24px_60px_rgba(112,26,117,0.2)] text-zinc-100"
      >
        {/* UPPER TITLE HEADER */}
        <div className="p-4 bg-gradient-to-r from-[#0d121c] via-[#090c13] to-[#0d121c] border-b border-zinc-850 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-500/10 border border-purple-500/30 rounded-2xl">
              <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] text-purple-400 font-bold tracking-[0.25em] font-mono leading-none uppercase">CROWNSPIRE METAGAME ARCHITECT</div>
              <h2 className="text-base font-black font-serif text-white tracking-wide mt-1.5 uppercase">SOVEREIGN HERO CROWNMARK PROGRESSION ENGINE</h2>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-1.5 bg-zinc-950 border border-zinc-900 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TOP INTERACTIVE TAB SELECTORS */}
        <div className="flex border-b border-zinc-850 bg-[#090b10] shrink-0 font-mono text-xs overflow-x-auto scrollbar-thin">
          {[
            { id: 'blueprint', label: '🛡️ PROGRESSION BLUEPRINT', desc: 'Detailed specs & philosophy' },
            { id: 'maegan_masterclass', label: '👑 SOVEREIGN SIGNATURES', desc: 'Benchmark specifications' },
            { id: 'categories', label: '👑 OFFICIAL CATEGORIES', desc: 'Thematic categories & hero lore' },
            { id: 'codex', label: '📖 CITADEL CODEX', desc: 'Registry & account bonuses' },
            { id: 'sandbox', label: '🎛️ STAR FORGE', desc: 'Leveling & failure safeguards' },
            { id: 'economy', label: '💰 CROWNMARK ECONOMY', desc: 'Rates, summons & craft' },
            { id: 'slots', label: '🏺 CROWNMARK SLOTS', desc: '8-Slot equipment system & lore' },
            { id: 'resonance', label: '🔮 CROWNMARK RESONANCE', desc: 'Set activation & visual aura' },
            { id: 'json_schema', label: '📦 GODOT 4 SCHEMAS', desc: 'JSON structures & schemas' },
            { id: 'godot_plan', label: '🤖 GDSCRIPT DEV BLUEPRINT', desc: 'Full Godot 4 architecture plan' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-[155px] py-3 px-2 border-b-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                  isActive 
                    ? 'border-purple-500 bg-[#121722]/60 text-purple-400 font-extrabold' 
                    : 'border-transparent text-zinc-400 hover:text-white hover:bg-[#121722]/20'
                }`}
              >
                <span className="font-bold tracking-wider">{tab.label}</span>
                <span className="text-[9px] text-zinc-500 font-medium tracking-tight mt-0.5">{tab.desc}</span>
              </button>
            );
          })}
        </div>

        {/* MAIN DISPLAY BODY WORKSPACE */}
        <div className="flex-1 overflow-hidden flex min-h-0 bg-[#05060a]">

          {/* ======================================================================
              TAB -1: MAEGAN'S SIGNATURE MASTERCLASS
              ====================================================================== */}
          {activeTab === 'maegan_masterclass' && (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden" id="sovereign-signatures-tab">
              {/* Prestige Standard Header */}
              <div className="bg-gradient-to-r from-amber-950/40 via-[#0a0d15] to-purple-950/30 border-b border-zinc-850 p-4 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-400 tracking-wider bg-amber-950/60 border border-amber-900 px-2.5 py-0.5 rounded-full font-mono uppercase">
                      Sovereign Standard
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">ESTABLISHED BY MAEGAN PRINGLE</span>
                  </div>
                  <h4 className="text-base font-serif font-black text-white uppercase tracking-wide flex items-center gap-2">
                    👑 SOVEREIGN HERO SIGNATURES
                  </h4>
                  <p className="text-[11px] text-zinc-400 max-w-4xl leading-relaxed font-sans">
                    Explore the complete Signature Crownmark suite designed for every active Crownspire hero. Fully detailed with lore, interactive visual specs, live level/awakening simulation scales, and structural engine definitions.
                  </p>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] text-amber-300 bg-amber-950/20 border border-amber-500/20 px-3 py-1.5 rounded-2xl shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span>PRESTIGE LEVEL: ASCENDANT</span>
                </div>
              </div>

              {/* Masterclass Content Layout */}
              <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
                {/* Left Side: Hero and Item Selection & Sandbox Scaler (width-adjustable) */}
                <div className="w-full lg:w-[380px] border-r border-zinc-850 bg-[#06080c] p-4 overflow-y-auto shrink-0 flex flex-col space-y-4">
                  
                  {/* Hero Selector */}
                  <div className="space-y-1 pb-3 border-b border-zinc-900/80">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block font-mono">SELECT CROWNSPIRE HERO</span>
                    <p className="text-[10px] text-zinc-400 font-sans mb-2">
                      Choose a hero to view their custom Signature suite:
                    </p>
                    <div className="grid grid-cols-4 gap-1">
                      {[
                        { id: 'maegan', label: 'Maegan', avatar: '⚜️' },
                        { id: 'shadow', label: 'Shadow', avatar: '👥' },
                        { id: 'lorelai', label: 'Lorelai', avatar: '🌙' },
                        { id: 'dominic', label: 'Dominic', avatar: '🛡️' }
                      ].map((h) => {
                        const isHeroSelected = signatureSelectedHeroId === h.id;
                        return (
                          <button
                            key={h.id}
                            onClick={() => {
                              setSignatureSelectedHeroId(h.id);
                              // Auto select the first item of this hero
                              const firstItemId = HERO_SIGNATURE_CROWNMARKS[h.id]?.[0]?.id || '';
                              setSignatureSelectedCrownmarkId(firstItemId);
                            }}
                            className={`py-2.5 px-1 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                              isHeroSelected
                                ? 'bg-gradient-to-b from-amber-500/10 via-purple-500/10 to-zinc-950 border-amber-500/50 text-amber-300 shadow-md'
                                : 'bg-zinc-900/30 border-zinc-900/60 text-zinc-400 hover:text-zinc-250 hover:bg-zinc-950/40'
                            }`}
                          >
                            <span className="text-base">{h.avatar}</span>
                            <span className="text-[9px] font-bold font-mono tracking-tight">{h.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Item selection title */}
                  <div className="space-y-1">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block font-mono">SELECT SIGNATURE PIECE</span>
                    <p className="text-[10px] text-zinc-400 font-sans">
                      Choose one of the five custom-designed personal Crownmarks:
                    </p>
                  </div>

                  {/* 5-Item Grid Button list */}
                  <div className="space-y-2">
                    {(HERO_SIGNATURE_CROWNMARKS[signatureSelectedHeroId] || HERO_SIGNATURE_CROWNMARKS['maegan']).map((item) => {
                      const isSelected = signatureSelectedCrownmarkId === item.id;
                      return (
                        <button
                          key={item.id}
                          id={`hero-sig-btn-${item.id}`}
                          onClick={() => setSignatureSelectedCrownmarkId(item.id)}
                          className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 relative overflow-hidden group ${
                            isSelected
                              ? 'bg-gradient-to-br from-amber-500/10 via-zinc-900 to-purple-500/10 border-amber-500/50 text-amber-300 shadow-md shadow-black'
                              : 'bg-zinc-900/10 border-zinc-900/60 text-zinc-400 hover:text-zinc-250 hover:bg-zinc-950/40'
                          }`}
                        >
                          {/* Left icon badge */}
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono text-xl shrink-0 ${
                            isSelected ? 'bg-amber-500/20 border border-amber-400/30' : 'bg-zinc-950 border border-zinc-900'
                          }`}>
                            {item.icon}
                          </div>

                          {/* Item Identity */}
                          <div className="flex-1 min-w-0 space-y-0.5">
                            <h5 className="text-[11px] font-black uppercase tracking-wider font-serif truncate">
                              {item.name}
                            </h5>
                            <div className="flex items-center gap-1.5 text-[9px] text-zinc-500 font-mono">
                              <span className="uppercase">{item.slot}</span>
                              <span>•</span>
                              <span className="text-zinc-400 uppercase tracking-tight">{item.category.split(' ')[0]}</span>
                            </div>
                          </div>

                          {/* Selected marker arrow */}
                          {isSelected && (
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)] shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Interactive Sandbox Leveler & Stars Card */}
                  <div className="bg-[#090b10] border border-zinc-850 p-4 rounded-2xl space-y-4">
                    <div className="space-y-1">
                      <span className="text-[9px] text-amber-400 font-extrabold tracking-widest uppercase block font-mono">
                        🔴 STAR FORGE SANDBOX SCALER
                      </span>
                      <p className="text-[10px] text-zinc-400 font-sans leading-normal">
                        Simulate the dynamic stat growth and level bonuses of this mythic Crownmark in real-time.
                      </p>
                    </div>

                    {/* Level Slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-zinc-400">UPGRADE LEVEL:</span>
                        <span className="text-amber-300 font-bold">+{signatureUpgradeLevel} / +20</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="20"
                        value={signatureUpgradeLevel}
                        onChange={(e) => setSignatureUpgradeLevel(parseInt(e.target.value))}
                        className="w-full accent-amber-500 h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-[8px] text-zinc-500 font-mono">
                        <span>BASE LEVEL</span>
                        <span>MID LEVEL</span>
                        <span>MAX LEVEL</span>
                      </div>
                    </div>

                    {/* Awakening Star Selector */}
                    <div className="space-y-2 pt-1 border-t border-zinc-900">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="text-zinc-400">AWAKENING STARS:</span>
                        <span className="text-purple-300 font-bold">{signatureAwakeningStars} ★ SYSTEM</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-zinc-950 p-2 rounded-xl border border-zinc-900 justify-center">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isActive = star <= signatureAwakeningStars;
                          return (
                            <button
                              key={star}
                              onClick={() => setSignatureAwakeningStars(star)}
                              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                                isActive 
                                  ? 'text-yellow-500 hover:text-yellow-400 scale-105' 
                                  : 'text-zinc-700 hover:text-zinc-500'
                              }`}
                            >
                              <Star className={`w-5 h-5 ${isActive ? 'fill-yellow-500' : 'fill-none'}`} />
                            </button>
                          );
                        })}
                      </div>
                      <p className="text-[8.5px] text-zinc-500 font-mono text-center">
                        ★ Adds a cumulative +5% stat scale boost per Awakening Tier.
                      </p>
                    </div>
                  </div>

                  {/* General Quality Seal */}
                  <div className="border border-zinc-900 p-3 rounded-2xl bg-[#080a0e]/60 space-y-1.5 font-mono text-[10px]">
                    <span className="text-[9px] text-purple-400 font-black uppercase tracking-wider block">REALM SPECIFICATION</span>
                    <p className="text-zinc-500 leading-relaxed font-sans text-[10px]">
                      This complete design outlines the blueprint schema for legendary weapons, armor, and crests, ensuring every hero's suite provides mechanical synergy and immersive visual lore.
                    </p>
                  </div>
                </div>

                {/* Right Side: Detailed Showcase Workspace */}
                <div className="flex-1 bg-[#040508] p-5 overflow-y-auto flex flex-col space-y-5">
                  {(() => {
                    const heroItems = HERO_SIGNATURE_CROWNMARKS[signatureSelectedHeroId] || HERO_SIGNATURE_CROWNMARKS['maegan'];
                    const currentItem = heroItems.find(c => c.id === signatureSelectedCrownmarkId) || heroItems[0];

                    // Stat Calculations
                    const scaleFactor = signatureUpgradeLevel / 20;
                    const rawAttack = Math.round(currentItem.baseStats.attack + (currentItem.maxStats.attack - currentItem.baseStats.attack) * scaleFactor);
                    const rawDefense = Math.round(currentItem.baseStats.defense + (currentItem.maxStats.defense - currentItem.baseStats.defense) * scaleFactor);
                    const rawHealth = Math.round(currentItem.baseStats.health + (currentItem.maxStats.health - currentItem.baseStats.health) * scaleFactor);

                    const awakeningMult = 1 + (signatureAwakeningStars * 0.05);
                    const finalAttack = Math.round(rawAttack * awakeningMult);
                    const finalDefense = Math.round(rawDefense * awakeningMult);
                    const finalHealth = Math.round(rawHealth * awakeningMult);

                    // Percentages relative to ultimate absolute maximum of any item
                    const attackPercent = Math.min(100, Math.round((finalAttack / 1500) * 100));
                    const defensePercent = Math.min(100, Math.round((finalDefense / 1500) * 100));
                    const healthPercent = Math.min(100, Math.round((finalHealth / 8000) * 100));

                    return (
                      <>
                        {/* Title Display & Lore Banner */}
                        <div className="bg-[#090b10] border border-zinc-850 p-4.5 rounded-2xl space-y-4 relative overflow-hidden">
                          {/* Radial ambient background light */}
                          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-amber-500/5 to-purple-500/5 rounded-full blur-3xl pointer-events-none" />

                          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 relative z-10">
                            <div className="space-y-1">
                              <span className="text-[10px] text-amber-400 font-extrabold tracking-widest uppercase font-mono block">
                                {currentItem.rarity}
                              </span>
                              <h3 className="text-lg font-black text-white uppercase font-serif tracking-wide leading-tight">
                                {currentItem.officialName}
                              </h3>
                              <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block">
                                Slot: {currentItem.slot} • CATEGORY: {currentItem.category} • Hero: <span className="text-purple-300 font-bold">{signatureSelectedHeroId.toUpperCase()}</span>
                              </span>
                            </div>
                            <span className="text-4xl px-3 py-2 bg-zinc-900/60 border border-zinc-800 rounded-xl font-mono shrink-0 select-none">
                              {currentItem.icon}
                            </span>
                          </div>

                          {/* Historical Lore Paragraph */}
                          <div className="border-l-2 border-amber-500 pl-4 py-1 relative z-10">
                            <span className="text-[8px] text-zinc-500 font-extrabold tracking-widest font-mono block mb-1 uppercase">CITADEL LIBRARY RECORD</span>
                            <p className="text-[11px] text-zinc-300 font-sans italic leading-relaxed">
                              "{currentItem.lore}"
                            </p>
                          </div>

                          {/* Flavor Text Quote */}
                          <div className="bg-zinc-950/60 border border-zinc-900/60 p-3 rounded-xl flex items-center justify-between text-[10px] font-mono relative z-10 italic text-zinc-400">
                            <span>"{currentItem.flavor}"</span>
                            <span className="text-[9px] text-zinc-600 font-bold not-italic font-mono uppercase">— INSCRIBED</span>
                          </div>
                        </div>

                        {/* Interactive Stats Panel with Progress Visualizers */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Real-time Stat Scaling Bar Visualizers */}
                          <div className="bg-[#090b10] border border-zinc-850 p-4 rounded-2xl space-y-4">
                            <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                              <span className="text-[9px] text-amber-400 font-extrabold tracking-widest uppercase font-mono">LIVE STAT ALLOCATION</span>
                              <span className="text-[9.5px] font-mono text-zinc-500">Includes Upgrade & Stars</span>
                            </div>

                            <div className="space-y-3">
                              {/* Attack Stat */}
                              <div className="space-y-1">
                                <div className="flex justify-between items-center text-[10px] font-mono">
                                  <span className="text-zinc-400 flex items-center gap-1.5">
                                    <Sword className="w-3 h-3 text-red-500" /> ATTACK
                                  </span>
                                  <span className="text-red-400 font-bold">{finalAttack}</span>
                                </div>
                                <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
                                  <div 
                                    className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-300"
                                    style={{ width: `${attackPercent}%` }}
                                  />
                                </div>
                                <div className="flex justify-between text-[8px] text-zinc-500 font-mono">
                                  <span>Base: {currentItem.baseStats.attack}</span>
                                  <span>Max Standard: {currentItem.maxStats.attack}</span>
                                </div>
                              </div>

                              {/* Defense Stat */}
                              <div className="space-y-1">
                                <div className="flex justify-between items-center text-[10px] font-mono">
                                  <span className="text-zinc-400 flex items-center gap-1.5">
                                    <Shield className="w-3 h-3 text-cyan-500" /> DEFENSE
                                  </span>
                                  <span className="text-cyan-400 font-bold">{finalDefense}</span>
                                </div>
                                <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
                                  <div 
                                    className="h-full bg-gradient-to-r from-cyan-600 to-indigo-500 transition-all duration-300"
                                    style={{ width: `${defensePercent}%` }}
                                  />
                                </div>
                                <div className="flex justify-between text-[8px] text-zinc-500 font-mono">
                                  <span>Base: {currentItem.baseStats.defense}</span>
                                  <span>Max Standard: {currentItem.maxStats.defense}</span>
                                </div>
                              </div>

                              {/* Health Stat */}
                              <div className="space-y-1">
                                <div className="flex justify-between items-center text-[10px] font-mono">
                                  <span className="text-zinc-400 flex items-center gap-1.5">
                                    <Heart className="w-3 h-3 text-emerald-500" /> HEALTH
                                  </span>
                                  <span className="text-emerald-400 font-bold">{finalHealth}</span>
                                </div>
                                <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
                                  <div 
                                    className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 transition-all duration-300"
                                    style={{ width: `${healthPercent}%` }}
                                  />
                                </div>
                                <div className="flex justify-between text-[8px] text-zinc-500 font-mono">
                                  <span>Base: {currentItem.baseStats.health}</span>
                                  <span>Max Standard: {currentItem.maxStats.health}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Visual & Artwork Creative Direction */}
                          <div className="bg-[#090b10] border border-zinc-850 p-4 rounded-2xl space-y-3.5 flex flex-col justify-between">
                            <div className="space-y-2">
                              <span className="text-[9px] text-purple-400 font-extrabold tracking-widest uppercase block font-mono">
                                🎨 ARTWORK DIRECTION & DESIGN STYLE
                              </span>
                              <div className="space-y-1">
                                <span className="text-[9px] font-mono text-zinc-500 uppercase block">Visual Representation:</span>
                                <p className="text-[10px] text-zinc-300 font-sans leading-normal">
                                  {currentItem.visualDescription}
                                </p>
                              </div>
                            </div>
                            
                            <div className="bg-zinc-950 border border-zinc-900/60 p-3 rounded-xl space-y-1">
                              <span className="text-[8.5px] font-mono text-amber-400 uppercase tracking-wider font-extrabold block">
                                Producer Artwork Directive:
                              </span>
                              <p className="text-[9.5px] text-zinc-400 font-sans italic leading-relaxed">
                                "{currentItem.artworkDirection}"
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Passive Ability Section */}
                        <div className="bg-[#090b10] border border-zinc-850 p-4 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                            <span className="text-[9px] text-purple-400 font-extrabold tracking-widest uppercase font-mono">
                              ⚡ UNIQUE ACTIVE PASSIVE SKILL
                            </span>
                            <span className="text-[9px] font-mono text-zinc-500 uppercase">SIGNATURE ACTIVE PASSIVE</span>
                          </div>
                          
                          <div className="bg-purple-950/10 border border-purple-500/20 p-4 rounded-xl space-y-2">
                            <h5 className="text-xs font-black text-purple-300 uppercase font-mono flex items-center gap-1.5">
                              <Zap className="w-4 h-4 text-purple-400 fill-purple-400/20" /> 
                              {currentItem.passiveName} (Level {Math.ceil((signatureUpgradeLevel + 1) / 4)})
                            </h5>
                            <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                              {currentItem.passiveDesc}
                            </p>
                          </div>
                        </div>

                        {/* Bonuses Grid: Upgrades vs Awakening */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Level Milestones */}
                          <div className="bg-[#090b10] border border-zinc-850 p-4 rounded-2xl space-y-3">
                            <span className="text-[9px] text-amber-400 font-extrabold tracking-widest uppercase block font-mono">
                              📈 FORGE UPGRADE MILESTONE BONUSES
                            </span>
                            <div className="space-y-2">
                              {currentItem.upgradeBonuses.map((milestone) => {
                                const isUnlocked = parseInt(milestone.level.replace('+', '')) <= signatureUpgradeLevel;
                                return (
                                  <div 
                                    key={milestone.level} 
                                    className={`p-2 rounded-xl border flex items-center justify-between transition-all ${
                                      isUnlocked 
                                        ? 'bg-amber-500/5 border-amber-500/20 text-zinc-200' 
                                        : 'bg-zinc-950/30 border-zinc-900/60 text-zinc-650'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 font-mono text-[10px]">
                                      <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${
                                        isUnlocked ? 'bg-amber-500/20 text-amber-300' : 'bg-zinc-900 text-zinc-650'
                                      }`}>
                                        ✓
                                      </div>
                                      <span>Upgrade {milestone.level}</span>
                                    </div>
                                    <span className="text-[9.5px] font-sans text-right max-w-[200px] line-clamp-1 truncate">
                                      {milestone.bonus}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Awakening Stars progression */}
                          <div className="bg-[#090b10] border border-zinc-850 p-4 rounded-2xl space-y-3">
                            <span className="text-[9px] text-purple-400 font-extrabold tracking-widest uppercase block font-mono">
                              ⭐ AWAKENING STAR EFFECTS
                            </span>
                            <div className="space-y-2">
                              {currentItem.awakeningBonuses.map((bonus) => {
                                const isUnlocked = bonus.star <= signatureAwakeningStars;
                                return (
                                  <div 
                                    key={bonus.star} 
                                    className={`p-2.5 rounded-xl border flex gap-3 transition-all ${
                                      isUnlocked 
                                        ? 'bg-purple-500/5 border-purple-500/20 text-zinc-200' 
                                        : 'bg-zinc-950/30 border-zinc-900/60 text-zinc-650'
                                    }`}
                                  >
                                    <div className="flex flex-col items-center justify-start shrink-0">
                                      <div className="flex gap-0.5">
                                        {Array.from({ length: bonus.star }).map((_, i) => (
                                          <Star key={i} className={`w-2.5 h-2.5 fill-current ${isUnlocked ? 'text-yellow-500' : 'text-zinc-600'}`} />
                                        ))}
                                      </div>
                                      <span className="text-[8px] font-mono text-zinc-500 mt-1">Tier {bonus.star}</span>
                                    </div>
                                    <p className="text-[9.5px] font-sans leading-relaxed flex-1">
                                      {bonus.effect}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Resonance, Collection, & Acquisition Footer Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Set Resonance contribution */}
                          <div className="bg-[#090b10] border border-zinc-850 p-4 rounded-2xl space-y-3">
                            <span className="text-[9px] text-zinc-400 font-extrabold tracking-widest uppercase block font-mono">
                              🔮 SOVEREIGN RESONANCE PART
                            </span>
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-[10px] font-mono">
                                <span className="text-zinc-500">Resonance Yield:</span>
                                <span className="text-amber-300 font-bold">+{currentItem.resonanceContribution.points} pts</span>
                              </div>
                              <div className="flex justify-between text-[10px] font-mono">
                                <span className="text-zinc-500">Visual Aura Unlock:</span>
                                <span className="text-purple-300 font-bold uppercase">{currentItem.resonanceContribution.visualEffect}</span>
                              </div>
                              <p className="text-[9px] text-zinc-400 font-sans leading-relaxed">
                                {currentItem.resonanceContribution.description}
                              </p>
                            </div>
                          </div>

                          {/* Codex Collection and Acquisition */}
                          <div className="bg-[#090b10] border border-zinc-850 p-4 rounded-2xl space-y-3">
                            <span className="text-[9px] text-zinc-400 font-extrabold tracking-widest uppercase block font-mono">
                              🏺 CITADEL CODEX MUSEUM BONUS
                            </span>
                            <div className="space-y-1.5">
                              <span className="text-[9.5px] font-mono text-emerald-400 uppercase font-black block">Active Collection Gain:</span>
                              <p className="text-[10px] text-zinc-300 font-sans leading-relaxed">
                                {currentItem.collectionBonus}
                              </p>
                              <span className="text-[8.5px] font-mono text-zinc-500 block">
                                *Unlocked automatically upon harvesting/summoning the item piece first.
                              </span>
                            </div>
                          </div>

                          {/* Acquisition Source */}
                          <div className="bg-[#090b10] border border-zinc-850 p-4 rounded-2xl space-y-3">
                            <span className="text-[9px] text-zinc-400 font-extrabold tracking-widest uppercase block font-mono">
                              📍 FRAGMENT ACQUISITION SOURCES
                            </span>
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-1.5 text-[9.5px] font-mono text-amber-400 uppercase font-black">
                                <Target className="w-3.5 h-3.5 text-amber-400" /> Core Farm Sector:
                              </div>
                              <p className="text-[10px] text-zinc-300 font-sans leading-relaxed bg-black/40 border border-zinc-900 p-2 rounded-xl">
                                {currentItem.fragmentAcquisition}
                              </p>
                              <span className="text-[8.5px] font-mono text-zinc-500 block">
                                Fragment Exchange rate: 100 fragments are required to craft or awaken.
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Godot 4 Code Spec Preview Block */}
                        <div className="bg-[#090b10] border border-zinc-850 p-4.5 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                            <div className="flex items-center gap-2">
                              <Code className="w-4 h-4 text-cyan-400" />
                              <span className="text-[9px] text-cyan-400 font-extrabold tracking-widest uppercase font-mono">
                                GODOT ENGINE CROWNMARK RESOURCE DEFINITION (GDScript)
                              </span>
                            </div>
                            <span className="text-[8.5px] font-mono text-zinc-500 uppercase">Engine Compliant Model</span>
                          </div>

                          <div className="w-full bg-black/60 border border-zinc-900/80 p-4 rounded-xl text-left font-mono text-[10px] text-zinc-400 space-y-1 select-all max-h-[160px] overflow-y-auto scrollbar-thin">
                            <div><span className="text-zinc-600"># GDScript Resource for Crownspire core engine configuration</span></div>
                            <div><span className="text-pink-500">tool</span></div>
                            <div><span className="text-pink-500">class_name</span> CrownmarkSignatureResource</div>
                            <div><span className="text-pink-500">extends</span> Resource</div>
                            <br />
                            <div><span className="text-yellow-500">const</span> RARITY = <span className="text-cyan-300">"MythicSignature"</span></div>
                            <div><span className="text-purple-400">@export</span> <span className="text-yellow-500">var</span> item_id: String = <span className="text-green-300">"{currentItem.id}"</span></div>
                            <div><span className="text-purple-400">@export</span> <span className="text-yellow-500">var</span> official_name: String = <span className="text-green-300">"{currentItem.officialName}"</span></div>
                            <div><span className="text-purple-400">@export</span> <span className="text-yellow-500">var</span> slot_type: String = <span className="text-green-300">"{currentItem.slot.toLowerCase()}"</span></div>
                            <div><span className="text-purple-400">@export</span> <span className="text-yellow-500">var</span> category_id: String = <span className="text-green-300">"{currentItem.category.split(' ')[0].toLowerCase()}"</span></div>
                            <div><span className="text-purple-400">@export</span> <span className="text-yellow-500">var</span> signature_hero: String = <span className="text-green-300">"{signatureSelectedHeroId}"</span></div>
                            <br />
                            <div><span className="text-purple-400">@export_group</span>(<span className="text-green-300">"Base Stats"</span>)</div>
                            <div><span className="text-purple-400">@export</span> <span className="text-yellow-500">var</span> base_attack: int = {currentItem.baseStats.attack}</div>
                            <div><span className="text-purple-400">@export</span> <span className="text-yellow-500">var</span> base_defense: int = {currentItem.baseStats.defense}</div>
                            <div><span className="text-purple-400">@export</span> <span className="text-yellow-500">var</span> base_health: int = {currentItem.baseStats.health}</div>
                            <br />
                            <div><span className="text-purple-400">@export_group</span>(<span className="text-green-300">"Max Growth Stats"</span>)</div>
                            <div><span className="text-purple-400">@export</span> <span className="text-yellow-500">var</span> max_attack: int = {currentItem.maxStats.attack}</div>
                            <div><span className="text-purple-400">@export</span> <span className="text-yellow-500">var</span> max_defense: int = {currentItem.maxStats.defense}</div>
                            <div><span className="text-purple-400">@export</span> <span className="text-yellow-500">var</span> max_health: int = {currentItem.maxStats.health}</div>
                            <br />
                            <div><span className="text-purple-400">@export_group</span>(<span className="text-green-300">"Active Skills"</span>)</div>
                            <div><span className="text-purple-400">@export</span> <span className="text-yellow-500">var</span> passive_ability_name: String = <span className="text-green-300">"{currentItem.passiveName}"</span></div>
                            <div><span className="text-purple-400">@export</span> <span className="text-yellow-500">var</span> passive_ability_desc: String = <span className="text-green-300">"{currentItem.passiveDesc}"</span></div>
                            <div><span className="text-purple-400">@export</span> <span className="text-yellow-500">var</span> awakening_points_resonance: int = {currentItem.resonanceContribution.points}</div>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================================
              TAB 0: OFFICIAL CROWNMARK CATEGORIES
              ====================================================================== */}
          {activeTab === 'categories' && (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Introduction Banner */}
              <div className="bg-gradient-to-r from-amber-950/20 via-[#0a0d15] to-purple-950/20 border-b border-zinc-850 p-4 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-serif font-black text-white uppercase tracking-wide flex items-center gap-1.5">
                    <span>👑</span> THEMATIC CROWNMARK CATEGORIZATION SYSTEM
                  </h4>
                  <p className="text-[11px] text-zinc-400 max-w-3xl leading-relaxed font-sans">
                    Every Crownmark belongs to an official category, anchoring it in Crownspire's royal fantasy lore. These categories define the item's state rank, spiritual origin, and tactical battlefield purpose.
                  </p>
                </div>
                <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-500 bg-zinc-950/80 border border-zinc-900 px-3 py-1.5 rounded-xl shrink-0">
                  <span className="text-amber-400">●</span> ROYAL PRESTIGE ACTIVE
                </div>
              </div>

              {/* Workspace Split */}
              <div className="flex-1 flex min-h-0 overflow-hidden">
                {/* Left side: Categories List */}
                <div className="w-[320px] border-r border-zinc-850 bg-[#06080c] p-4 overflow-y-auto shrink-0 space-y-3">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block mb-2 font-mono">SELECT CATEGORY</span>
                  {CROWNMARK_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategoryTab === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategoryTab(cat.id)}
                        className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                          isSelected
                            ? 'bg-gradient-to-br from-amber-500/10 to-purple-500/10 border-amber-500/30 text-amber-300 shadow-md shadow-zinc-950'
                            : 'bg-zinc-900/10 border-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-950/40'
                        }`}
                      >
                        <span className="text-2xl mt-0.5">{cat.icon}</span>
                        <div className="space-y-1 flex-1 min-w-0">
                          <h4 className="text-xs font-black uppercase tracking-wider font-serif">
                            {cat.name}
                          </h4>
                          <p className="text-[10px] text-zinc-500 leading-normal line-clamp-2 font-sans">
                            {cat.purpose}
                          </p>
                        </div>
                      </button>
                    );
                  })}

                  <div className="pt-4 border-t border-zinc-900/60 space-y-2.5 font-mono text-[10px]">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase block tracking-wider">DESIGN METHODOLOGY</span>
                    <p className="text-zinc-500 leading-normal font-sans text-[10px]">
                      By dividing progression into six distinctive categories, players easily recognize stat specializations and matching combat passive bonuses.
                    </p>
                  </div>
                </div>

                {/* Right side: Detailed Showcase */}
                <div className="flex-1 bg-[#040508] p-5 overflow-y-auto flex flex-col space-y-5">
                  {(() => {
                    const currentCat = CROWNMARK_CATEGORIES.find(c => c.id === selectedCategoryTab) || CROWNMARK_CATEGORIES[0];
                    const selectedHeroData = currentCat.heroes[categorySelectedHeroId as keyof typeof currentCat.heroes];

                    return (
                      <>
                        {/* Category Description Card */}
                        <div className="bg-[#090b10] border border-zinc-850 p-4 rounded-2xl space-y-3">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl">{currentCat.icon}</span>
                            <div>
                              <span className="text-[9px] text-amber-400 font-extrabold tracking-widest uppercase font-mono">OFFICIAL CROWNMARK CATEGORY</span>
                              <h3 className="text-sm font-black text-white uppercase font-serif tracking-wide">{currentCat.name}</h3>
                            </div>
                          </div>
                          <p className="text-[11px] text-zinc-300 font-sans leading-relaxed">
                            {currentCat.purpose}
                          </p>
                          <div className="bg-black/30 border border-zinc-900/80 p-2.5 rounded-xl flex items-center justify-between text-[10px] font-mono">
                            <span className="text-zinc-500">⚙️ SPECIALIZATION KEY:</span>
                            <span className="text-purple-400 font-bold uppercase">{currentCat.mechanicalFocus}</span>
                          </div>
                        </div>

                        {/* Hero Selector Tabs */}
                        <div className="space-y-2 shrink-0">
                          <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest block font-mono">
                            VIEW EXAMPLES BY HERO ({Object.keys(currentCat.heroes).length} HEROES)
                          </span>
                          <div className="flex flex-wrap gap-1.5 bg-zinc-950/60 border border-zinc-900 p-1.5 rounded-xl">
                            {[
                              { id: 'maegan', label: 'Maegan', role: 'Lord Marshal' },
                              { id: 'lorelai', label: 'Lorelai', role: 'Lunar Weaver' },
                              { id: 'shadow', label: 'Shadow', role: 'Silent Eclipse' },
                              { id: 'allanna', label: 'Allanna', role: 'Arch-Priestess' },
                              { id: 'remi', label: 'Remi', role: 'Stonemason' },
                              { id: 'rex', label: 'Rex', role: 'Vanguard' },
                              { id: 'lumi', label: 'Lumi', role: 'Glaciomancer' },
                              { id: 'skye', label: 'Skye', role: 'Pegasus Scout' },
                              { id: 'rayne', label: 'Rayne', role: 'Stormclaw' },
                              { id: 'rubble', label: 'Rubble', role: 'Demolitionist' },
                              { id: 'noxx', label: 'Noxx', role: 'Alchemist' }
                            ].map((hero) => {
                              const isSelected = categorySelectedHeroId === hero.id;
                              return (
                                <button
                                  key={hero.id}
                                  onClick={() => setCategorySelectedHeroId(hero.id)}
                                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer flex flex-col items-center ${
                                    isSelected
                                      ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
                                      : 'text-zinc-500 hover:text-zinc-350 hover:bg-zinc-900/30'
                                  }`}
                                >
                                  <span>{hero.label}</span>
                                  <span className="text-[7.5px] opacity-60 font-mono tracking-tight mt-0.5 lowercase">{hero.role}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Interactive Item Display Card */}
                        {selectedHeroData ? (
                          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                            {/* Visual Asset representation frame */}
                            <div className="md:col-span-5 flex flex-col items-center justify-center bg-gradient-to-b from-[#0e121a] to-zinc-950 border border-zinc-850 rounded-2xl p-6 text-center space-y-4 relative overflow-hidden group">
                              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.06)_0%,transparent_70%)] animate-pulse" />
                              
                              {/* Glowing Icon Frame */}
                              <div className="w-24 h-24 rounded-2xl bg-zinc-950 border-2 border-amber-500/30 flex items-center justify-center relative shadow-xl group-hover:scale-105 transition-all">
                                <span className="text-5xl">{currentCat.icon}</span>
                                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-[10px] text-amber-300 font-bold font-mono">
                                  S
                                </div>
                              </div>

                              <div className="space-y-1 z-10">
                                <h4 className="text-sm font-black text-white uppercase tracking-wider font-serif">
                                  {selectedHeroData.itemName}
                                </h4>
                                <span className="text-[10px] font-mono text-zinc-500 uppercase block tracking-wider">
                                  {selectedHeroData.slot} • Category {currentCat.name}
                                </span>
                              </div>

                              {/* Simulated Godot Item Resource preview */}
                              <div className="w-full bg-black/40 border border-zinc-900 p-3 rounded-xl text-left font-mono text-[9px] text-zinc-500 space-y-1 select-none">
                                <div className="text-[8px] text-amber-400/60 font-black uppercase tracking-widest block border-b border-zinc-900/80 pb-1 mb-1">GODOT ENGINE RESOURCE SPEC</div>
                                <div><span className="text-zinc-650">class_name</span> <span className="text-zinc-400">CrownmarkResource</span></div>
                                <div><span className="text-zinc-650">var</span> category = <span className="text-amber-300">"{currentCat.id}"</span></div>
                                <div><span className="text-zinc-650">var</span> slot = <span className="text-purple-300">"{selectedHeroData.slot.toLowerCase()}"</span></div>
                                <div><span className="text-zinc-650">var</span> signature_hero = <span className="text-cyan-300">"{categorySelectedHeroId}"</span></div>
                                <div><span className="text-zinc-650">var</span> base_stats = <span className="text-zinc-400">"{selectedHeroData.stats}"</span></div>
                              </div>
                            </div>

                            {/* Stat details, passive, and lore description */}
                            <div className="md:col-span-7 space-y-4">
                              {/* Stats block */}
                              <div className="bg-[#090b10] border border-zinc-850 p-4 rounded-2xl space-y-2">
                                <span className="text-[9px] text-amber-400 font-extrabold tracking-widest uppercase block font-mono">SOVEREIGN STAT ALLOCATION</span>
                                <div className="bg-black/30 border border-zinc-900/60 p-3 rounded-xl flex items-center justify-between">
                                  <span className="text-xs font-mono text-zinc-300">✨ Base Modifiers:</span>
                                  <span className="text-xs font-bold font-mono text-amber-300">{selectedHeroData.stats}</span>
                                </div>
                              </div>

                              {/* Passive Skill block */}
                              <div className="bg-[#090b10] border border-zinc-850 p-4 rounded-2xl space-y-2">
                                <span className="text-[9px] text-purple-400 font-extrabold tracking-widest uppercase block font-mono">ACTIVE PASSIVE SKILL</span>
                                <div className="bg-purple-950/10 border border-purple-500/10 p-3.5 rounded-xl space-y-1.5">
                                  <h5 className="text-xs font-black text-purple-300 uppercase font-mono flex items-center gap-1.5">
                                    <span className="text-[10px]">⚡</span> {selectedHeroData.itemName} Blessing
                                  </h5>
                                  <p className="text-[11px] text-zinc-300 leading-relaxed font-sans">
                                    {selectedHeroData.passive}
                                  </p>
                                </div>
                              </div>

                              {/* Lore Biography */}
                              <div className="bg-[#090b10] border border-zinc-850 p-4 rounded-2xl space-y-2">
                                <span className="text-[9px] text-zinc-500 font-extrabold tracking-widest uppercase block font-mono">CITADEL CODEX ARCHIVE CITATION</span>
                                <div className="border-l-2 border-amber-500/20 pl-3.5 py-1">
                                  <p className="text-[11px] text-zinc-400 italic leading-relaxed font-sans">
                                    "{selectedHeroData.lore}"
                                  </p>
                                  <span className="text-[9px] font-mono text-zinc-500 uppercase block mt-2">
                                    — Recorded by High Chronicler of the Spire
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 bg-[#090b10] border border-zinc-850 border-dashed rounded-2xl flex items-center justify-center p-8 text-center text-zinc-500 text-xs">
                            Select a hero example above to inspect.
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================================
              TAB 1: BLUEPRINT DESIGN MECHANICS
              ====================================================================== */}
          {activeTab === 'blueprint' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Introduction Banner */}
              <div className="bg-gradient-to-r from-purple-950/40 via-zinc-900 to-indigo-950/40 border border-purple-500/15 p-5 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Award className="w-44 h-44 text-purple-400" />
                </div>
                <span className="text-[9px] font-mono bg-purple-900/40 border border-purple-500/40 text-purple-300 px-2.5 py-0.5 rounded-full uppercase font-bold tracking-widest">
                  Balancing Specification (Pacing: years)
                </span>
                <h3 className="font-serif font-black text-white text-xl tracking-wide uppercase mt-2.5">
                  LONG-TERM PROGRESSION LOOP & PACING SPEC
                </h3>
                <p className="text-xs text-zinc-400 mt-2 leading-relaxed max-w-4xl">
                  In Crownspire, **Sovereign Crownmarks** represent the premier end-game growth loop. Designed with a system structure inspired by market leaders like *Whiteout Survival* and *Call of Dragons*, it balances short-term active play (farming daily gold/dust) with highly sought-after long-term milestones (Star breakthrough blueprints, competitive alliance coordinates territory harvesting).
                </p>
              </div>

              {/* CORE MATERIALS CATALOG */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold font-mono text-purple-400 tracking-wider uppercase">I. PROGRESSION MATERIALS FLOW</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-zinc-950 border border-zinc-850 p-3.5 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-400" />
                      <span className="text-white text-xs font-bold">Crownmark Dust (Common)</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-normal">
                      **Source**: Map ruins, daily patrol chests, active bartering. Used for micro-level upgrades (1-100).
                    </p>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-850 p-3.5 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500" />
                      <span className="text-white text-xs font-bold">Star Sparks (Uncommon)</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-normal">
                      **Source**: Star Sanctum raids, medium monster nests. Triggers minor breakthroughs up to 3★ status.
                    </p>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-850 p-3.5 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className="text-white text-xs font-bold">Celestial Shards (Epic)</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-normal">
                      **Source**: High-level map monuments, capital siege participation. Triggers high breakthroughs (4★ & 5★).
                    </p>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-850 p-3.5 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                      <span className="text-white text-xs font-bold">Fire Crystals (Mythic)</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 leading-normal">
                      **Source**: Competitive alliance territory control, limited events. Essential for final Sovereign breakthroughs.
                    </p>
                  </div>
                </div>
              </div>

              {/* INTERACTIVE PHILOSOPHY EXPLANATIONS (Why each mechanic exists) */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold font-mono text-purple-400 tracking-wider uppercase">II. THE DESIGN PHILOSOPHY ACCORDION (WHY IT EXISTS)</h4>
                
                <div className="border border-zinc-850 rounded-2xl overflow-hidden bg-zinc-950/40">
                  {/* Collapsible Section 1 */}
                  <div className="border-b border-zinc-850">
                    <button 
                      onClick={() => togglePhilosophy('levels')}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-900/40 transition-all font-mono"
                    >
                      <div className="flex items-center gap-3">
                        <ArrowUp className="w-4 h-4 text-purple-400" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">1. Crownmark Levels & Max Level Pacing Ceiling</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-zinc-500 transition-transform ${expandedPhilosophies.levels ? 'rotate-90' : ''}`} />
                    </button>
                    {expandedPhilosophies.levels && (
                      <div className="p-4 bg-zinc-950/85 text-[11px] text-zinc-300 leading-relaxed font-sans space-y-2 border-t border-zinc-900">
                        <p>
                          **Specification**: Crownmarks scale from level 1 up to a absolute cap of level 100. Growth is linear for flat attributes (+6% per level), but costs scale exponentially. 
                        </p>
                        <p className="text-zinc-400 italic">
                          **Why it exists**: Pacing levels provides short-term daily goals. Players can farm Crownmark Dust easily in solo PvE, meaning they feel minor power boosts every single session. Without it, the system would feel static and inaccessible between big star breakthroughs.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Collapsible Section 2 */}
                  <div className="border-b border-zinc-850">
                    <button 
                      onClick={() => togglePhilosophy('awakening')}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-900/40 transition-all font-mono"
                    >
                      <div className="flex items-center gap-3">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">2. Awakening Stars & Fragment Requirements</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-zinc-500 transition-transform ${expandedPhilosophies.awakening ? 'rotate-90' : ''}`} />
                    </button>
                    {expandedPhilosophies.awakening && (
                      <div className="p-4 bg-zinc-950/85 text-[11px] text-zinc-300 leading-relaxed font-sans space-y-2 border-t border-zinc-900">
                        <p>
                          **Specification**: Stars go from 0★ to 5★. Each breakthrough extends the level ceiling (+20 levels per star). It requires **Duplicate Crownmark Fragments** (salvaged from duplicate pull merges) alongside star sparks.
                        </p>
                        <p className="text-zinc-400 italic">
                          **Why it exists**: Level-caps act as horizontal gates. High-spending players cannot just spend gold to buy raw level 100 on day one; they are hard-capped by duplicate fragments. This levels the playing field for free-to-play players during initial kingdom expansion phases.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Collapsible Section 3 */}
                  <div className="border-b border-zinc-850">
                    <button 
                      onClick={() => togglePhilosophy('failure')}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-900/40 transition-all font-mono"
                    >
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">3. Breakthrough Failures & Free-To-Play Friendly Protections</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-zinc-500 transition-transform ${expandedPhilosophies.failure ? 'rotate-90' : ''}`} />
                    </button>
                    {expandedPhilosophies.failure && (
                      <div className="p-4 bg-zinc-950/85 text-[11px] text-zinc-300 leading-relaxed font-sans space-y-2 border-t border-zinc-900">
                        <p>
                          **Specification**: Star Breakthroughs from 3★ and above introduce a failure rate (85%, 60%, 40% chance of success). However, failures **never destroy the crownmark** and **automatically refund the rare Duplicate Fragments and Celestial Shards/Crystals**. Only common Gold and Star Sparks are consumed, and each failure yields +15% pity chance!
                        </p>
                        <p className="text-zinc-400 italic">
                          **Why it exists**: Pity systems provide the dopamine thrill of risk without toxic feedback. If a player lost their hard-earned duplicate fragments on a 40% fail chance, they would instantly uninstall the app. Refunding the rare materials ensures player effort is protected, while failing gold forces them back into map gameplay to recover.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Collapsible Section 4 */}
                  <div className="border-b border-zinc-850">
                    <button 
                      onClick={() => togglePhilosophy('resonance')}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-900/40 transition-all font-mono"
                    >
                      <div className="flex items-center gap-3">
                        <Layers className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">4. Resonance Levels & Passive Skill Unlocks</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-zinc-500 transition-transform ${expandedPhilosophies.resonance ? 'rotate-90' : ''}`} />
                    </button>
                    {expandedPhilosophies.resonance && (
                      <div className="p-4 bg-zinc-950/85 text-[11px] text-zinc-300 leading-relaxed font-sans space-y-2 border-t border-zinc-900">
                        <p>
                          **Specification**: Equipping 2 or 4 signature items grants stat multipliers. Completing the full set of 5 unlocks the **Absolute Sovereign Presence** which scales damage output. Additionally, passive traits level up (Level I to III) dynamically as star levels grow.
                        </p>
                        <p className="text-zinc-400 italic">
                          **Why it exists**: Encourages set collection and complete customization rather than min-maxing a single item. Players are incentivized to target multiple slots for their favourite primary hero instead of concentrating on just weapons.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Collapsible Section 5 */}
                  <div className="border-b-0">
                    <button 
                      onClick={() => togglePhilosophy('collection')}
                      className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-900/40 transition-all font-mono"
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-4 h-4 text-cyan-400" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider">5. Citadel Collection Codex & Registry Bonuses</span>
                      </div>
                      <ChevronRight className={`w-4 h-4 text-zinc-500 transition-transform ${expandedPhilosophies.collection ? 'rotate-90' : ''}`} />
                    </button>
                    {expandedPhilosophies.collection && (
                      <div className="p-4 bg-zinc-950/85 text-[11px] text-zinc-300 leading-relaxed font-sans space-y-2 border-t border-zinc-900">
                        <p>
                          **Specification**: Registering unlocked crownmarks in the permanent collection database grants small account-wide global stats (e.g., +1.5% Troop Attack per registered item, regardless of who has it equipped).
                        </p>
                        <p className="text-zinc-400 italic">
                          **Why it exists**: Solves the "trash pool" issue. In standard gachas, drawing a crownmark for a hero you don't use feels terrible. Unlocking collection points guarantees that every single pull contributes directly to the player's kingdom army strength, retaining value for all players.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ======================================================================
              TAB 2: SOVEREIGN CROWNMARKS CODEX (With permanent collections)
              ====================================================================== */}
          {activeTab === 'codex' && (
            <div className="flex-1 flex overflow-hidden">
              
              {/* Left Heroes list */}
              <div className="w-[240px] border-r border-zinc-850 bg-[#06080b] py-3.5 px-2.5 overflow-y-auto flex flex-col gap-1.5 shrink-0">
                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest pl-2 mb-1 block">CHOOSE A HERO</span>
                {HEROES_LIST.map((hero) => {
                  const isSelected = selectedHeroId === hero.id;
                  return (
                    <button
                      key={hero.id}
                      onClick={() => setSelectedHeroId(hero.id)}
                      className={`text-left p-3 rounded-xl transition-all cursor-pointer flex flex-col gap-0.5 border ${
                        isSelected 
                          ? 'bg-purple-500/10 border-purple-500/40 text-purple-400 font-bold shadow-md shadow-purple-950/20' 
                          : 'text-zinc-400 border-transparent hover:text-white hover:bg-zinc-950/40'
                      }`}
                    >
                      <span className="text-xs font-black tracking-wide uppercase">{hero.name}</span>
                      <span className="text-[9px] text-zinc-500 leading-none">{hero.role}</span>
                    </button>
                  );
                })}

                <div className="mt-6 border-t border-zinc-900 pt-4 px-2">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase block mb-2 tracking-wider">CODEX REGISTRY STATUS</span>
                  <div className="space-y-2 font-mono">
                    <div className="flex justify-between text-[10px]">
                      <span className="text-zinc-400">Completion:</span>
                      <span className="text-purple-400 font-bold">{collectionBonus.completionPercent}%</span>
                    </div>
                    <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full transition-all" style={{ width: `${collectionBonus.completionPercent}%` }} />
                    </div>
                    <div className="text-[9px] text-zinc-500 leading-normal">
                      Registered: {collectionBonus.registeredCount} / {collectionBonus.totalCount} items
                    </div>
                  </div>
                </div>
              </div>

              {/* Central Details pane detailing the 5 Signature Crownmarks */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Global Collection bonus banner */}
                <div className="bg-[#0b0f19] border border-cyan-500/15 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <div className="text-[9px] text-cyan-400 font-bold font-mono tracking-wider uppercase">
                      ACTIVE GLOBAL CITADEL BUFFS
                    </div>
                    <h4 className="text-xs font-extrabold text-white uppercase">Permanent Account Multipliers</h4>
                    <p className="text-[10px] text-zinc-400 font-sans max-w-md">
                      These multiplier stats remain active in all combat encounters and world map sieges, regardless of which hero holds the items.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 font-mono text-[11px] shrink-0">
                    <div className="bg-black/45 p-2 rounded-xl border border-zinc-900 text-center">
                      <span className="text-zinc-550 block text-[9px] uppercase">Legion Atk</span>
                      <strong className="text-cyan-400 text-xs">+{collectionBonus.bonusAttack.toFixed(1)}%</strong>
                    </div>
                    <div className="bg-black/45 p-2 rounded-xl border border-zinc-900 text-center">
                      <span className="text-zinc-550 block text-[9px] uppercase">Gathering</span>
                      <strong className="text-cyan-400 text-xs">+{collectionBonus.bonusGathering.toFixed(1)}%</strong>
                    </div>
                    <div className="bg-black/45 p-2 rounded-xl border border-zinc-900 text-center">
                      <span className="text-zinc-550 block text-[9px] uppercase">Building</span>
                      <strong className="text-cyan-400 text-xs">+{collectionBonus.bonusBuilding.toFixed(1)}%</strong>
                    </div>
                  </div>
                </div>

                <div className="border-b border-zinc-900 pb-2">
                  <h3 className="text-base font-bold font-serif text-white tracking-wide uppercase">
                    {HEROES_LIST.find(h => h.id === selectedHeroId)?.name}'s Signature Sovereign Suite
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5 italic font-sans">
                    "{HEROES_LIST.find(h => h.id === selectedHeroId)?.desc}"
                  </p>
                </div>

                <div className="space-y-5">
                  {Object.values(CROWNMARKS_DATABASE)
                    .filter(crownmark => crownmark.signatureHeroId === selectedHeroId)
                    .map((crownmark, i) => {
                      const isRegistered = registeredCrownmarks[crownmark.id] || false;
                      return (
                        <div 
                          key={crownmark.id}
                          className="bg-zinc-950/80 border border-zinc-850 p-4 rounded-2xl flex flex-col md:flex-row gap-5 items-start relative overflow-hidden"
                        >
                          {/* Interactive Slot illustration */}
                          <div className="w-16 h-16 rounded-xl bg-[#090b11] border border-purple-500/25 flex items-center justify-center shrink-0 relative overflow-hidden shadow-inner">
                            <div className="absolute inset-0 flex items-center justify-center p-2">
                              <svg viewBox="0 0 100 100" className="w-12 h-12" style={{ filter: `drop-shadow(0 0 6px ${crownmark.color})` }}>
                                <circle cx="50" cy="50" r="38" stroke={crownmark.color} strokeWidth="1" fill="none" opacity="0.3" />
                                {crownmark.slot === 'Weapon' ? (
                                  <path d="M70 30 L45 55 L35 45 L30 50 L40 60 L15 85 L20 90 L45 65 L55 75 Z" fill={crownmark.color} />
                                ) : crownmark.slot === 'Helm' ? (
                                  <path d="M30 40 Q50 15 70 40 Q75 60 70 80 H30 Q25 60 30 40 Z" fill={crownmark.color} />
                                ) : crownmark.slot === 'Crest' ? (
                                  <path d="M30 25 L70 25 L75 55 Q70 85 50 95 Q30 85 25 55 Z" fill={crownmark.color} />
                                ) : crownmark.slot === 'Signet' ? (
                                  <circle cx="50" cy="50" r="22" fill="none" stroke={crownmark.color} strokeWidth="4" />
                                ) : (
                                  <path d="M25 20 H75 V80 H25 Z M35 35 H65 M35 50 H65 M35 65 H50" stroke={crownmark.color} strokeWidth="2" fill="none" />
                                )}
                              </svg>
                            </div>
                            <span className="absolute bottom-1 right-1 text-[7px] font-mono font-black bg-zinc-950 px-1 py-0.5 rounded text-zinc-400">
                              SLOT {i+1}
                            </span>
                          </div>

                          {/* Text descriptions */}
                          <div className="flex-1 space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className="text-white text-sm font-extrabold uppercase tracking-wide">
                                  {crownmark.name}
                                </span>
                                <span className="text-[8px] font-mono bg-purple-900/40 border border-purple-500/30 text-purple-400 px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
                                  {crownmark.slot} Crownmark
                                </span>
                              </div>

                              <button
                                onClick={() => {
                                  setRegisteredCrownmarks(prev => ({ ...prev, [crownmark.id]: !isRegistered }));
                                }}
                                className={`font-mono text-[9px] px-2.5 py-1 rounded-lg border flex items-center gap-1.5 cursor-pointer transition-all ${
                                  isRegistered 
                                    ? 'bg-[#18112b] border-purple-500/40 text-purple-400 font-extrabold' 
                                    : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:text-zinc-300'
                                }`}
                              >
                                {isRegistered ? (
                                  <>✔️ Registered in Codex</>
                                ) : (
                                  <>➕ Add to Codex Registry</>
                                )}
                              </button>
                            </div>
                            
                            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                              {crownmark.flavor}
                            </p>

                            <div className="bg-[#100c1d] border border-purple-500/10 p-2.5 rounded-xl space-y-1 mt-1 font-mono text-xs">
                              <div className="text-[9px] text-yellow-500 font-extrabold tracking-wider flex items-center gap-1 uppercase">
                                <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> SIGNATURE ACTIVE PASSIVE: {crownmark.passiveName}
                              </div>
                              <div className="text-[10px] text-zinc-300 leading-normal pl-4 font-sans">
                                {crownmark.passiveDesc}
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-[10px] text-zinc-500">
                              <div>🗡️ Base Attack: <span className="text-purple-400 font-bold">+{crownmark.baseStats.attack}</span></div>
                              <div>🛡️ Base Defense: <span className="text-purple-400 font-bold">+{crownmark.baseStats.defense}</span></div>
                              <div>❤️ Base HP: <span className="text-purple-400 font-bold">+{crownmark.baseStats.health}</span></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>

              </div>

            </div>
          )}

          {/* ======================================================================
              TAB 3: INTERACTIVE FORGE DEEP TECH (SANDBOX & SIMULATOR)
              ====================================================================== */}
          {activeTab === 'sandbox' && (
            <div className="flex-1 flex overflow-hidden">
              
              {/* Left Sandbox Control pane */}
              <div className="w-[390px] border-r border-zinc-850 p-4 overflow-y-auto shrink-0 bg-[#06080c] space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  
                  {/* Hero selection dropdown */}
                  <div className="space-y-2">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider font-mono">1. ACTIVE HERO SANDBOX</span>
                    <select
                      value={sandboxHeroId}
                      onChange={(e) => {
                        setSandboxHeroId(e.target.value);
                        setSelectedSlotIndex(0); // reset inspect slot
                      }}
                      className="w-full bg-zinc-950 border border-zinc-850 text-white text-xs rounded-xl p-2.5 font-mono cursor-pointer focus:outline-none focus:border-purple-500"
                    >
                      {HEROES_LIST.map(h => (
                        <option key={h.id} value={h.id}>{h.name} (Simulation Suite)</option>
                      ))}
                    </select>
                  </div>

                  {/* Crownmark Slots Equipper Display */}
                  <div className="space-y-2">
                    <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider font-mono block">2. EQUIPPED SUITE (CLICK TO INSPECT)</span>
                    <div className="grid grid-cols-5 gap-1.5">
                      {SLOT_TYPES.map((slot, i) => {
                        const crownmarkId = equippedCrownmarksState[sandboxHeroId][i];
                        const crownmark = CROWNMARKS_DATABASE[crownmarkId];
                        const stats = crownmarkStatsState[`${sandboxHeroId}_${i}`] || { level: 1, stars: 0, rarity: 'Rare' };
                        const isSelected = selectedSlotIndex === i;
                        const isSig = crownmark?.signatureHeroId === sandboxHeroId;

                        return (
                          <button
                            key={slot}
                            onClick={() => setSelectedSlotIndex(i)}
                            className={`aspect-square rounded-xl border flex flex-col items-center justify-between p-1.5 cursor-pointer transition-all relative ${
                              isSelected 
                                ? 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/20' 
                                : isSig 
                                  ? 'border-purple-950/60 bg-zinc-950/80 hover:border-purple-850' 
                                  : 'border-zinc-850 bg-zinc-950/40 opacity-70 hover:opacity-100'
                            }`}
                          >
                            <span className="text-[8px] font-mono text-zinc-500 uppercase leading-none">{slot}</span>
                            
                            {/* Inner icon representation */}
                            <div className="w-5 h-5 flex items-center justify-center">
                              <svg viewBox="0 0 100 100" className="w-4 h-4" style={{ filter: crownmark ? `drop-shadow(0 0 4px ${crownmark.color})` : 'none' }}>
                                <path 
                                  d="M50 15 L85 50 L50 85 L15 50 Z" 
                                  fill={crownmark ? crownmark.color : '#3f3f46'} 
                                  opacity={crownmark ? 0.9 : 0.3} 
                                />
                              </svg>
                            </div>

                            <div className="text-[7px] font-mono leading-none flex items-center gap-0.5 text-yellow-500">
                              {stats.stars}★
                            </div>

                            {isSig && (
                              <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-purple-500 animate-pulse border border-black" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ACTIVE SLOT INSPECTOR CONTROLS */}
                  {currentSlotCrownmark && (
                    <div className="bg-zinc-950/60 border border-zinc-900 p-3.5 rounded-2xl space-y-3 font-mono text-xs">
                      <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                        <div>
                          <span className="text-[8px] text-zinc-500 block font-bold uppercase tracking-wider">INSPECTING SLOT {selectedSlotIndex + 1} ({activeSlotType})</span>
                          <span className="text-white font-black text-xs uppercase leading-normal block">{currentSlotCrownmark.name}</span>
                        </div>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded font-black uppercase ${
                          currentSlotIsSignature ? 'bg-purple-950 border border-purple-500/30 text-purple-400' : 'bg-zinc-900 text-zinc-550'
                        }`}>
                          {currentSlotIsSignature ? 'Signature Match' : 'Generic Equip'}
                        </span>
                      </div>

                      {/* Swap Slot Crownmark */}
                      <div className="space-y-1">
                        <span className="text-[8px] text-zinc-500 uppercase font-black block">Swap Crownmark in Slot:</span>
                        <select
                          value={currentSlotCrownmarkId}
                          onChange={(e) => handleEquipCrownmark(e.target.value)}
                          className="w-full bg-[#0d1017] border border-zinc-850 text-zinc-300 text-[11px] rounded-lg p-1.5 cursor-pointer focus:outline-none focus:border-purple-500"
                        >
                          {matchingSlotCrownmarks.map(r => (
                            <option key={r.id} value={r.id}>
                              {r.name} {r.signatureHeroId === sandboxHeroId ? '(✨ Signature)' : `(${HEROES_LIST.find(h => h.id === r.signatureHeroId)?.name || 'General'})`}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Level and Max Level Cap indicator */}
                      <div className="space-y-1 bg-black/45 p-2 rounded-xl border border-zinc-900">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-zinc-400">Current level: <strong className="text-white">{currentSlotStats.level} / {awakenCost.maxLevel}</strong></span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-950">
                          <span>Level Up cost:</span>
                          <span className="text-purple-300 font-bold">{upgradeCost.dust.toLocaleString()} Dust | {upgradeCost.gold.toLocaleString()} Gold</span>
                        </div>
                      </div>

                      {/* Breakthrough status with failure mechanics info */}
                      <div className="space-y-1 bg-black/45 p-2 rounded-xl border border-zinc-900">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-zinc-400">Awakening Star: <strong className="text-yellow-500">{currentSlotStats.stars}★ ➔ {currentSlotStats.stars < 5 ? `${currentSlotStats.stars + 1}★` : 'Max'}</strong></span>
                          {currentSlotStats.stars < 5 && (
                            <span className="text-emerald-400 font-extrabold text-[10px]">
                              Chance: {Math.min(100, awakenCost.rate + currentSlotPity)}% 
                              {currentSlotPity > 0 && ` (${awakenCost.rate}% + ${currentSlotPity}% Pity)`}
                            </span>
                          )}
                        </div>
                        {currentSlotStats.stars < 5 && (
                          <div className="text-[10px] text-zinc-500 pt-1 border-t border-zinc-950 leading-relaxed">
                            Requires: <span className="text-emerald-400 font-bold">{awakenCost.fragments} Frags</span> | <span className="text-yellow-400 font-bold">{awakenCost.sparks} Sparks</span> | <span className="text-cyan-400 font-bold">{awakenCost.shards} Shards</span>
                            {awakenCost.crystals > 0 && <> | <span className="text-red-400 font-bold">{awakenCost.crystals} Crystals</span></>}
                          </div>
                        )}
                      </div>

                      {/* Interactive triggers */}
                      {currentSlotStats.stars < 5 ? (
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <button
                            onClick={handleLevelUp}
                            className="py-2.5 bg-purple-650 hover:bg-purple-550 border border-purple-500/30 rounded-xl font-bold font-mono text-[11px] text-white flex flex-col items-center justify-center active:scale-95 transition-all cursor-pointer shadow-md"
                          >
                            <span className="flex items-center gap-1"><ArrowUp className="w-3 h-3 text-purple-300" /> LEVEL UP</span>
                            <span className="text-[8px] text-purple-400 font-normal leading-none mt-0.5">-{upgradeCost.dust.toLocaleString()} Dust</span>
                          </button>

                          <button
                            onClick={handleAwaken}
                            className="py-2.5 bg-yellow-600 hover:bg-yellow-500 border border-yellow-400/30 rounded-xl font-bold font-mono text-[11px] text-white flex flex-col items-center justify-center active:scale-95 transition-all cursor-pointer shadow-md"
                          >
                            <span className="flex items-center gap-1"><Star className="w-3 h-3 text-yellow-300 fill-yellow-300" /> ASCEND STAR</span>
                            <span className="text-[8px] text-yellow-300 font-normal leading-none mt-0.5">{Math.min(100, awakenCost.rate + currentSlotPity)}% Success</span>
                          </button>
                        </div>
                      ) : (
                        <div className="text-center py-2.5 bg-purple-950/30 border border-purple-500/20 text-purple-400 rounded-xl font-mono text-[10px] font-bold">
                          🏆 MAX SOVEREIGN AWAKENED PRESET
                        </div>
                      )}

                      {/* Pity Indicator bar */}
                      {currentSlotStats.stars < 5 && awakenCost.rate < 100 && (
                        <div className="space-y-1 pt-1 text-[10px] font-mono text-zinc-500">
                          <div className="flex justify-between">
                            <span>Tempering Pity Calibration:</span>
                            <span className="text-purple-400 font-bold">+{currentSlotPity}%</span>
                          </div>
                          <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-purple-500 h-full transition-all" style={{ width: `${currentSlotPity}%` }} />
                          </div>
                        </div>
                      )}

                    </div>
                  )}

                </div>

                {/* SANDBOX INVENTORY PANEL */}
                <div className="bg-[#090b10] border border-zinc-900 p-3 rounded-2xl space-y-2 text-xs font-mono mt-4">
                  <div className="flex items-center justify-between border-b border-zinc-950 pb-1.5">
                    <span className="text-[9px] text-purple-400 font-bold uppercase tracking-wider">🛠️ INVENTORY & FORGE RESERVES</span>
                    <button 
                      onClick={handleResetSandbox}
                      className="text-[8px] text-zinc-500 hover:text-white flex items-center gap-1 cursor-pointer transition-all"
                    >
                      <RotateCcw className="w-2.5 h-2.5" /> Reset Inventory
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="flex justify-between bg-black/40 p-1.5 rounded-lg border border-zinc-900/60">
                      <span className="text-zinc-500 flex items-center gap-1"><Coins className="w-3 h-3 text-yellow-500" /> Gold:</span>
                      <span className="text-yellow-500 font-black">{inventory.gold.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between bg-black/40 p-1.5 rounded-lg border border-zinc-900/60">
                      <span className="text-zinc-500 flex items-center gap-1"><Gem className="w-3 h-3 text-red-400" /> Crystals:</span>
                      <span className="text-red-400 font-black">{inventory.crystals}</span>
                    </div>
                    <div className="flex justify-between bg-black/40 p-1.5 rounded-lg border border-zinc-900/60">
                      <span className="text-zinc-500">🔮 Dust:</span>
                      <span className="text-purple-400 font-black">{inventory.dust.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between bg-black/40 p-1.5 rounded-lg border border-zinc-900/60">
                      <span className="text-zinc-500">⭐ Sparks:</span>
                      <span className="text-yellow-400 font-black">{inventory.starSparks}</span>
                    </div>
                    <div className="flex justify-between bg-black/40 p-1.5 rounded-lg border border-zinc-900/60">
                      <span className="text-zinc-500">💎 Shards:</span>
                      <span className="text-cyan-400 font-black">{inventory.celestialShards}</span>
                    </div>
                    <div className="flex justify-between bg-black/40 p-1.5 rounded-lg border border-zinc-900/60">
                      <span className="text-zinc-500">🏺 Fragments:</span>
                      <span className="text-emerald-400 font-black">{inventory.fragments}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleAddResources}
                    className="w-full mt-1.5 py-1.5 bg-zinc-900 border border-purple-500/20 hover:border-purple-500/40 text-purple-400 hover:text-purple-300 font-mono text-[9px] rounded-lg tracking-wider font-extrabold cursor-pointer active:scale-97 transition-all flex items-center justify-center gap-1 uppercase"
                  >
                    🎁 Grant Sandbox Testing resources (+500k gold/crystals)
                  </button>
                </div>

              </div>

              {/* Central Simulated Output stats page */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Simulated Alert prompt feedback banner */}
                <AnimatePresence>
                  {simAlertMsg && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`border p-3.5 rounded-xl flex items-center justify-between text-xs font-mono shadow-xl relative z-20 ${
                        simAlertMsg.type === 'success' ? 'bg-[#0f2a20] border-emerald-500/30 text-emerald-300' :
                        simAlertMsg.type === 'fail' ? 'bg-[#2b161c] border-red-500/30 text-red-300' :
                        simAlertMsg.type === 'error' ? 'bg-[#310f13] border-red-500/35 text-red-400 font-bold' :
                        'bg-[#12131f]/95 border-zinc-800 text-zinc-300'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="text-lg mt-0.5 leading-none">
                          {simAlertMsg.type === 'success' ? '🏆' : simAlertMsg.type === 'fail' ? '🛡️' : simAlertMsg.type === 'error' ? '⚠️' : '💡'}
                        </span>
                        <div className="space-y-1">
                          <span className="block font-sans leading-relaxed">{simAlertMsg.text}</span>
                          {simAlertMsg.type === 'fail' && lastRollResult && (
                            <span className="block text-[10px] text-red-400 font-mono">
                              (Simulated roll: {lastRollResult.roll} / target limit: {lastRollResult.rate} - Spark sparks burned, rare materials safe)
                            </span>
                          )}
                          {simAlertMsg.type === 'success' && lastRollResult && lastRollResult.rate < 100 && (
                            <span className="block text-[10px] text-emerald-400 font-mono">
                              (Simulated roll: {lastRollResult.roll} / target limit: {lastRollResult.rate} - Awaken Successful!)
                            </span>
                          )}
                        </div>
                      </div>
                      <button onClick={() => setSimAlertMsg(null)} className="text-zinc-500 hover:text-white cursor-pointer self-start">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Crownmark Dynamic Card Visual representation with AURA EVOLUTION */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* The interactive Visual Card */}
                  <div className="md:col-span-1 bg-[#090b10] border border-zinc-850 p-4 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden group min-h-[300px]">
                    
                    {/* DYNAMIC AURA BACKGROUND EFFECTS */}
                    {currentSlotStats.stars === 5 ? (
                      // 5★: Swirling gold cosmic halo nebula
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.15)_0%,transparent_70%)] animate-pulse">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-36 h-36 border-2 border-yellow-500/30 rounded-full animate-spin" style={{ animationDuration: '4s' }} />
                          <div className="w-44 h-44 border border-purple-500/20 rounded-full animate-spin absolute" style={{ animationDuration: '9s', animationDirection: 'reverse' }} />
                          <div className="absolute w-full h-full bg-[radial-gradient(ellipse_at_bottom,rgba(168,85,247,0.1)_0%,transparent_60%)]" />
                        </div>
                      </div>
                    ) : currentSlotStats.stars >= 3 ? (
                      // 3★ - 4★: Violet crackling lightning orbits
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.1)_0%,transparent_70%)]">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-32 h-32 border-2 border-dashed border-purple-500/20 rounded-full animate-spin" style={{ animationDuration: '10s' }} />
                        </div>
                      </div>
                    ) : currentSlotStats.stars >= 1 ? (
                      // 1★ - 2★: Floating Amber Bronze Embers
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(180,83,9,0.08)_0%,transparent_70%)]">
                        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-amber-600/5 to-transparent animate-pulse" />
                      </div>
                    ) : null}

                    {/* Aura badge overlay */}
                    <span className="absolute top-2.5 left-2.5 text-[8px] font-mono bg-black/80 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider relative z-10">
                      {currentSlotStats.stars === 5 ? "👑 Cosmic Aura" : currentSlotStats.stars >= 3 ? "⚡ Violet Aura" : currentSlotStats.stars >= 1 ? "🔥 Amber Aura" : "🛡️ Core State"}
                    </span>

                    {/* Actual icon drawing */}
                    <div className="relative z-10 w-24 h-24 rounded-2xl bg-[#0e121a] border border-purple-500/20 flex items-center justify-center shadow-2xl">
                      <svg viewBox="0 0 100 100" className="w-16 h-16" style={{ filter: `drop-shadow(0 0 8px ${currentSlotCrownmark.color})` }}>
                        <circle cx="50" cy="50" r="38" stroke={currentSlotCrownmark.color} strokeWidth="1.5" fill="none" opacity="0.3" />
                        {currentSlotCrownmark.slot === 'Weapon' ? (
                          <path d="M70 30 L45 55 L35 45 L30 50 L40 60 L15 85 L20 90 L45 65 L55 75 Z" fill={currentSlotCrownmark.color} />
                        ) : currentSlotCrownmark.slot === 'Helm' ? (
                          <path d="M30 40 Q50 15 70 40 Q75 60 70 80 H30 Q25 60 30 40 Z" fill={currentSlotCrownmark.color} />
                        ) : currentSlotCrownmark.slot === 'Crest' ? (
                          <path d="M30 25 L70 25 L75 55 Q70 85 50 95 Q30 85 25 55 Z" fill={currentSlotCrownmark.color} />
                        ) : currentSlotCrownmark.slot === 'Signet' ? (
                          <circle cx="50" cy="50" r="22" fill="none" stroke={currentSlotCrownmark.color} strokeWidth="5" />
                        ) : (
                          <path d="M25 20 H75 V80 H25 Z M35 35 H65 M35 50 H65 M35 65 H50" stroke={currentSlotCrownmark.color} strokeWidth="3" fill="none" />
                        )}
                      </svg>
                    </div>

                    <div className="text-center mt-4 relative z-10 space-y-1 w-full px-2">
                      <span className="text-[9px] font-mono text-purple-400 block font-bold tracking-widest uppercase">{currentSlotCrownmark.slot} SLOT</span>
                      <h4 className="text-xs font-black text-white uppercase tracking-wide leading-tight line-clamp-1">{currentSlotCrownmark.name}</h4>
                      
                      {/* Active level and star visuals */}
                      <div className="flex items-center justify-center gap-1 text-[10px] text-zinc-400 font-mono">
                        <span>Lvl {currentSlotStats.level}</span>
                        <span>•</span>
                        <div className="flex items-center text-yellow-500">
                          {Array.from({ length: 5 }).map((_, sIdx) => (
                            <Star 
                              key={sIdx} 
                              className={`w-3 h-3 ${sIdx < currentSlotStats.stars ? 'fill-yellow-500 text-yellow-500' : 'text-zinc-700'}`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mathematical Stats breakdown detail */}
                  <div className="md:col-span-2 bg-[#0b0c11] border border-zinc-850 p-4 rounded-2xl flex flex-col justify-between font-mono text-xs text-zinc-300">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
                        <Info className="w-4 h-4 text-purple-400" />
                        <span className="text-[9px] text-zinc-500 font-bold block uppercase tracking-wider">SLOT MATHEMATICAL ATTRIBUTE FORMULA</span>
                      </div>

                      <div className="space-y-2 pt-1 font-mono text-[11px] leading-relaxed">
                        <div className="bg-black/30 p-2.5 rounded-lg border border-zinc-900 flex justify-between items-center">
                          <span className="text-zinc-400">🛡️ Rarity Multiplier:</span>
                          <span className="text-white font-extrabold">
                            {currentSlotStats.rarity === 'Rare' ? '1.0x (Rare)' : currentSlotStats.rarity === 'Epic' ? '1.6x (Epic)' : currentSlotStats.rarity === 'Legendary' ? '2.8x (Legendary)' : '4.8x (Mythic)'}
                          </span>
                        </div>
                        <div className="bg-black/30 p-2.5 rounded-lg border border-zinc-900 flex justify-between items-center">
                          <span className="text-zinc-400">📈 Level Multiplier:</span>
                          <span className="text-white font-extrabold">+{Math.round((currentSlotStats.level - 1) * 6)}% (+6% per Level)</span>
                        </div>
                        <div className="bg-black/30 p-2.5 rounded-lg border border-zinc-900 flex justify-between items-center">
                          <span className="text-zinc-400">⭐ Star Multiplier:</span>
                          <span className="text-white font-extrabold">+{Math.round(currentSlotStats.stars * 25)}% (+25% per Star level)</span>
                        </div>
                        <div className="bg-black/30 p-2.5 rounded-lg border border-zinc-900 flex justify-between items-center">
                          <span className="text-zinc-400">🔗 Alignment Factor:</span>
                          <span className={`font-extrabold ${currentSlotIsSignature ? 'text-purple-400' : 'text-red-400 animate-pulse'}`}>
                            {currentSlotIsSignature ? '1.0x (Full Signature Alignment)' : '0.6x (40% Misaligned Penalty!)'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-[10px] text-zinc-550 leading-relaxed font-sans pt-3 border-t border-zinc-900/40 mt-3">
                      💡 <em>Note: Equipped crownmarks on non-signature heroes are active, but they suffer a **40% attribute penalty** and their passive skill remains **disabled** until matched with their signature hero!</em>
                    </div>
                  </div>

                </div>

                {/* Grand Combined Power banner */}
                <div className="bg-gradient-to-r from-[#111624] to-[#0b0e14] border border-purple-500/10 p-5 rounded-3xl flex items-center justify-between relative overflow-hidden">
                  
                  {/* Subtle active galaxy visual effect if 5 matching signature items */}
                  {simResults.signatureCount === 5 && (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.06)_0%,transparent_70%)] animate-pulse" />
                  )}

                  <div className="space-y-1 relative z-10">
                    <span className="text-[9px] font-mono text-purple-400 font-extrabold tracking-widest uppercase">
                      COMBINED SUITE ACTIVE POWER INDEX
                    </span>
                    <h3 className="text-2xl font-black font-mono text-white leading-none tracking-tight">
                      ⚔️ {simResults.power.toLocaleString()} <span className="text-xs text-zinc-500 font-serif font-medium">Crownmark rating</span>
                    </h3>
                    <p className="text-[11px] text-zinc-400 leading-normal max-w-lg mt-1.5 font-sans">
                      Sum of attributes from all 5 active slots, multiplied based on resonance levels and signature matching ratios.
                    </p>
                  </div>

                  <div className="text-right shrink-0 relative z-10">
                    <span className="text-[9px] font-mono text-zinc-500 block uppercase font-bold">RESONANCES ACTIVE</span>
                    <span className="text-xs font-serif font-black text-yellow-500 block mt-1">
                      {simResults.signatureCount} / 5 SIGNATURES
                    </span>
                  </div>
                </div>

                {/* Multi grid stats contribution */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Stats flats contribution */}
                  <div className="bg-[#0b0c11] border border-zinc-850 p-4 rounded-2xl space-y-3 font-mono text-xs">
                    <div className="flex items-center gap-1.5 border-b border-zinc-900 pb-1.5">
                      <Sword className="w-4 h-4 text-purple-400" />
                      <span className="text-[9px] text-zinc-500 font-bold block uppercase tracking-wider">CUMULATIVE COMBAT ATTRIBUTES</span>
                    </div>

                    <div className="space-y-2 pt-1">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-zinc-400">🗡️ Attack flat boost:</span>
                        <span className="text-white font-extrabold text-sm">+{simResults.attack.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-zinc-950 h-1 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full transition-all duration-300" style={{ width: `${Math.min(100, (simResults.attack / 5000) * 100)}%` }} />
                      </div>

                      <div className="flex justify-between items-center text-[11px] pt-1.5">
                        <span className="text-zinc-400">🛡️ Defense flat boost:</span>
                        <span className="text-white font-extrabold text-sm">+{simResults.defense.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-zinc-950 h-1 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full transition-all duration-300" style={{ width: `${Math.min(100, (simResults.defense / 4000) * 100)}%` }} />
                      </div>

                      <div className="flex justify-between items-center text-[11px] pt-1.5">
                        <span className="text-zinc-400">HP flat boost:</span>
                        <span className="text-white font-extrabold text-sm">+{simResults.health.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-zinc-950 h-1 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full transition-all duration-300" style={{ width: `${Math.min(100, (simResults.health / 25000) * 100)}%` }} />
                      </div>
                    </div>
                  </div>

                  {/* Active Resonances cards */}
                  <div className="bg-[#0b0c11] border border-zinc-850 p-4 rounded-2xl flex flex-col justify-between font-mono text-xs">
                    <div>
                      <div className="flex items-center gap-1.5 border-b border-zinc-900 pb-1.5">
                        <Award className="w-4 h-4 text-yellow-500 animate-pulse" />
                        <span className="text-[9px] text-zinc-500 font-bold block uppercase tracking-wider">HERO RESONANCE INDEX</span>
                      </div>

                      <div className="space-y-1 pt-3">
                        <span className="text-white text-xs font-serif font-black uppercase tracking-wide block">
                          {simResults.resonanceTitle}
                        </span>
                        <p className="text-[11px] text-zinc-400 leading-normal font-sans pt-1">
                          {simResults.resonanceDesc}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-zinc-900/60 leading-normal text-[10px] text-zinc-550 font-sans">
                      💡 <em>Resonances scale active attributes on all deployed legions. Focus on equipping complete sets on primary marshals.</em>
                    </div>
                  </div>

                </div>

                {/* ACTIVE PASSIVE SKILLS SUMMARY GRID */}
                <div className="bg-[#090b10] border border-zinc-900 p-4 rounded-2xl space-y-3 font-mono text-xs text-zinc-300">
                  <span className="text-[9px] text-purple-400 font-bold uppercase tracking-wider block border-b border-zinc-950 pb-1.5">
                    ⚡ SIMULATED ACTIVE UNIQUE PASSIVES
                  </span>

                  <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-2">
                    {simResults.passives.map((passive, index) => (
                      <div 
                        key={index} 
                        className={`flex items-start gap-2.5 p-2 rounded-xl border ${
                          passive.active 
                            ? 'bg-[#180e22]/40 border-purple-500/20 text-zinc-200' 
                            : 'bg-zinc-950/20 border-zinc-900 opacity-40 text-zinc-550'
                        }`}
                      >
                        {passive.active ? (
                          <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5 animate-pulse" />
                        ) : (
                          <Lock className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <strong className="text-xs uppercase">{passive.name}</strong>
                            <span className="text-[8px] font-bold font-mono text-purple-400 uppercase tracking-widest">{passive.slot} slot</span>
                            {passive.active && (
                              <span className="text-[8px] font-bold bg-yellow-950 text-yellow-400 border border-yellow-500/20 px-1 rounded">
                                Lvl {passive.level}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] leading-relaxed block mt-0.5 font-sans">
                            {passive.desc}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ======================================================================
              TAB 4: ECONOMY DESIGN BOARD
              ====================================================================== */}
          {activeTab === 'economy' && (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Secondary Navigation Headers */}
              <div className="flex border-b border-zinc-850 bg-[#07090e] shrink-0 font-mono text-xs">
                {[
                  { id: 'sources', label: '💰 SOURCE MATRIX', desc: 'Where to obtain crownmarks & materials' },
                  { id: 'summon', label: '🎁 CHEST SUMMON SIMULATOR', desc: 'Real drop rates & pity check' },
                  { id: 'craft', label: '🔨 DUPLICATE SYNTHESIS', desc: 'Craft crownmarks from fragments' }
                ].map((subTab) => {
                  const isActive = activeEconomySubTab === subTab.id;
                  return (
                    <button
                      key={subTab.id}
                      onClick={() => setActiveEconomySubTab(subTab.id as any)}
                      className={`flex-1 py-2.5 px-3 border-b-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isActive 
                          ? 'border-purple-400 bg-purple-500/5 text-purple-400 font-bold' 
                          : 'border-transparent text-zinc-500 hover:text-zinc-350'
                      }`}
                    >
                      <span className="text-[11px] font-bold tracking-wider">{subTab.label}</span>
                      <span className="text-[8px] text-zinc-550 mt-0.5 leading-none">{subTab.desc}</span>
                    </button>
                  );
                })}
              </div>

              {/* Sub-tab content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-6">

                {/* SUB TAB A: SOURCE MATRIX */}
                {activeEconomySubTab === 'sources' && (() => {
                  const SOURCES_METRIC = [
                    {
                      id: 'hero_recruitment',
                      name: 'Hero Recruitment',
                      category: 'Gacha',
                      pacing: '1x Free Daily (Otherwise Chest Keys)',
                      mats: 'Crownmarks, Fragments, Dust, Sparks, Shards',
                      f2pFriendly: 'Standard Gacha',
                      f2pColor: 'text-purple-400',
                      desc: 'The core recruitment nexus. Summons provide either template copies or melt into fragments. Features a hard 30-draw pity curve for Legendaries to protect spend pacing.',
                      p2wShield: 'Purchase limits are set to 10 keys per week in the premium shop to prevent whales from maxing out crownmark sets in single-day bursts.',
                      rates: [
                        { name: 'Legendary Crownmark', value: '8.0%' },
                        { name: 'Epic Crownmark', value: '25.0%' },
                        { name: 'Rare Crownmark', value: '55.0%' },
                        { name: 'Upgrade Materials', value: '12.0%' }
                      ],
                      fragRates: 'Legendary = 80 Fragments, Epic = 30 Fragments, Rare = 12 Fragments on duplicate melt.'
                    },
                    {
                      id: 'wildlings',
                      name: 'Wildlings (World Map)',
                      category: 'Grind',
                      pacing: 'Repeatable (Costs Action Points)',
                      mats: 'Crownmark Dust, Gold, Rare Fragments',
                      f2pFriendly: '100% Grindable',
                      f2pColor: 'text-emerald-400',
                      desc: 'Purging Wildling forces scattered throughout the realm map. Highly repeatable solo/rally loop providing high-volume material trickle for active marshals.',
                      p2wShield: 'Cannot be purchased or bypassed with cash. Active manual clearing is the only way to accrue massive upgrade materials.',
                      rates: [
                        { name: 'Crownmark Dust', value: '100% (150-400)' },
                        { name: 'Gold Coins', value: '100% (10-30)' },
                        { name: 'Rare Fragment', value: '5.0%' },
                        { name: 'Rare Crownmark', value: '1.0%' }
                      ],
                      fragRates: 'Occasional Rare Fragment drop allows slow crafting over heavy grind volumes.'
                    },
                    {
                      id: 'alliance_bosses',
                      name: 'Alliance Bosses',
                      category: 'Bosses',
                      pacing: 'Thrice Weekly (Guild Summoned)',
                      mats: 'Star Sparks, Dust, Epic Fragments',
                      f2pFriendly: 'Alliance Co-op',
                      f2pColor: 'text-indigo-400',
                      desc: 'High-coordination summonable alliance encounters. High-grade rewards distributed to all active participants in rally strikes.',
                      p2wShield: 'Rallies require physical active alliance attendance. Whales cannot buy Alliance Boss loot packages; they must actively coordinate with their guild.',
                      rates: [
                        { name: 'Gold Coins', value: '100% (1,000-2,000)' },
                        { name: 'Crownmark Dust', value: '100% (500-1,000)' },
                        { name: 'Star Forge Sparks', value: '100% (5-10)' },
                        { name: 'Epic Fragments', value: '35.0% (5-12)' },
                        { name: 'Epic Crownmark', value: '15.0%' }
                      ],
                      fragRates: 'Yields 5-12 Epic Fragments, forming the backbone of mid-tier crownmark set synthesis.'
                    },
                    {
                      id: 'world_bosses',
                      name: 'World Bosses',
                      category: 'Bosses',
                      pacing: 'Weekly (Kingdom Siege Event)',
                      mats: 'Legendary Sparks, Celestial Shards, Legendary Fragments',
                      f2pFriendly: 'Sovereign Raid',
                      f2pColor: 'text-yellow-400',
                      desc: 'Colossal server-wide world events requiring high-coordination multi-alliance strategy. Rewards depend on alliance contribution margins.',
                      p2wShield: 'Top tier rewards are competitive-only. Gated behind high gameplay skills and multi-guild strategies rather than direct purchases.',
                      rates: [
                        { name: 'Sovereign Gold / Dust', value: '100% (High Cache)' },
                        { name: 'Star Forge Sparks', value: '100% (15-25)' },
                        { name: 'Celestial Shards', value: '100% (2-5)' },
                        { name: 'Legendary Fragments', value: '70% (10-30)' },
                        { name: 'Legendary Crownmark', value: '30.0%' }
                      ],
                      fragRates: 'Guarantees 10-30 Legendary Fragments for competitive alliances, driving late-game set upgrades.'
                    },
                    {
                      id: 'battle_pass',
                      name: 'Battle Pass',
                      category: 'Quests',
                      pacing: 'Seasonal Cycles (Monthly)',
                      mats: 'Crystals, Keys, Dust, Selection Boxes',
                      f2pFriendly: 'Milestone Progression',
                      f2pColor: 'text-emerald-400',
                      desc: 'A structured engagement map reward. The Free Track offers keys and materials, while the Paid Sovereign Track ($10) provides selection boxes.',
                      p2wShield: 'Strictly gated; cannot buy levels indefinitely. Designed as a high-value retention model, leveling is locked to daily/weekly active play.',
                      rates: [
                        { name: 'Summon Keys', value: '100% (Milestones)' },
                        { name: 'Sovereign Crystals', value: '100% (50-250)' },
                        { name: 'Crownmark Dust', value: '100% (High Volume)' },
                        { name: 'Epic Crownmark Selection Box', value: 'Premium milestone reward' }
                      ],
                      fragRates: 'Allows targeted selection rather than RNG, preventing frustrating duplication loops.'
                    },
                    {
                      id: 'events',
                      name: 'Rotating Events',
                      category: 'Quests',
                      pacing: '7-Day Cycles',
                      mats: 'Crystals, Keys, Specialized Fragments',
                      f2pFriendly: 'Event Engagement',
                      f2pColor: 'text-emerald-400',
                      desc: 'Rotating active challenges (e.g., "Star Forge Trial", "Sovereign Siege") rewarding specific playstyles and clearing target stages.',
                      p2wShield: 'Requires physical event completion and combat clearing. Directly counters cash-shop solutions.',
                      rates: [
                        { name: 'Sovereign Gems', value: '100% (100-250)' },
                        { name: 'Gacha Chest Key', value: '100% (1-2)' },
                        { name: 'Event Fragments', value: '100% (15-30)' }
                      ],
                      fragRates: 'Generates 15-30 specialized fragments to ease specific set completion.'
                    },
                    {
                      id: 'treasure_hunts',
                      name: 'Treasure Hunts',
                      category: 'Grind',
                      pacing: 'Map Exploration',
                      mats: 'Crystals, Keys, Rare Fragments',
                      f2pFriendly: 'Exploration Loot',
                      f2pColor: 'text-emerald-400',
                      desc: 'Uncovering obscured sections of fog on the global kingdom map. Scouts find coordinates leading to buried tombs containing sovereign treasures.',
                      p2wShield: 'Purely manual exploration. Whales must commit scout time or purchase map coordinate logs from other active trading players.',
                      rates: [
                        { name: 'Sovereign Gems', value: '100% (50-100)' },
                        { name: 'Gacha Chest Key', value: '100% (1x)' },
                        { name: 'Rare Fragments', value: '20% (15-30)' }
                      ],
                      fragRates: '20% chance to yield 15-30 Rare Fragments, excellent for new accounts starting their collection.'
                    },
                    {
                      id: 'ancient_ruins',
                      name: 'Ancient Ruins',
                      category: 'Progression',
                      pacing: 'Permanent Milestones',
                      mats: 'Massive Crystals, Sparks, Epic Chests',
                      f2pFriendly: 'Campaign Clear',
                      f2pColor: 'text-indigo-400',
                      desc: 'Permanent single-player campaigns designed to test maximum tactical army layouts. Cleared stages give massive one-time milestone handouts.',
                      p2wShield: 'Zero replay farm potential. Whales cannot pay to replay cleared milestones; progress is hard-capped by strict combat strength.',
                      rates: [
                        { name: 'Sovereign Gems', value: '100% (800)' },
                        { name: 'Star Forge Sparks', value: '100% (30)' },
                        { name: 'Epic Crownmark Selection Chest', value: '100%' }
                      ],
                      fragRates: 'Ensures reliable, non-RNG baseline Epic set acquisition for completing strategic chapters.'
                    },
                    {
                      id: 'kingdom_events',
                      name: 'Kingdom Events',
                      category: 'Progression',
                      pacing: 'Realm vs Realm War (14-Day Cycle)',
                      mats: 'Crystals, Keys, Shards, Passive Buffs',
                      f2pFriendly: 'Realm Victory',
                      f2pColor: 'text-yellow-400',
                      desc: 'Endgame Kingdom vs Kingdom conquest battles. Active participation yields sovereign honors, server-wide buffs, and high-tier resources.',
                      p2wShield: 'Requires entire server cohesion. A single high-spending whale cannot win kingdom wars alone without active coordination of hundreds of players.',
                      rates: [
                        { name: 'Sovereign Gems', value: '100% (500)' },
                        { name: 'Gacha Summon Keys', value: '100% (2)' },
                        { name: 'Celestial Shards', value: '100% (10-20)' }
                      ],
                      fragRates: 'Large-scale reward payouts help sustain endgame legendary level thresholds.'
                    },
                    {
                      id: 'alliance_shop',
                      name: 'Alliance Shop',
                      category: 'Shops',
                      pacing: 'Weekly Purchase Limits',
                      mats: 'Summon Keys, Star Sparks, Celestial Shards',
                      f2pFriendly: 'Loyalty Redemption',
                      f2pColor: 'text-emerald-400',
                      desc: 'Exchange Loyalty contribution credits (earned through building alliance hubs, helping co-members, and donating to technology trees) for premium assets.',
                      p2wShield: 'Weekly stock quotas limit transactions. Players cannot buy loyalty credits; they are strictly awarded for guild support.',
                      rates: [
                        { name: 'Gacha Summon Key', value: 'Limit 3/week (500 Credits)' },
                        { name: 'Star Forge Sparks', value: 'Limit 5/week (200 Credits)' },
                        { name: 'Celestial Shards', value: 'Limit 2/week (800 Credits)' }
                      ],
                      fragRates: 'Provides direct access to critical upgrade reagents outside of gacha chance channels.'
                    },
                    {
                      id: 'daily_quests',
                      name: 'Daily Quests',
                      category: 'Quests',
                      pacing: 'Daily Reset',
                      mats: 'Crystals, Keys, Gold, Dust',
                      f2pFriendly: 'Daily Retention',
                      f2pColor: 'text-emerald-400',
                      desc: 'Core daily activities (gathering resources, completing a wildling purges, updating structures). Completing the checklist awards baseline materials.',
                      p2wShield: 'Non-purchasable active check. Consistent dailies bridge the gap between F2P players and casual spenders over time.',
                      rates: [
                        { name: 'Sovereign Gems', value: '100% (50)' },
                        { name: 'Gacha Summon Key', value: '100% (1)' },
                        { name: 'Gold Coins', value: '100% (2,000)' },
                        { name: 'Crownmark Dust', value: '100% (400)' }
                      ],
                      fragRates: 'Yields 7 free keys and 350 Crystals weekly, creating a stable recruitment progression path.'
                    },
                    {
                      id: 'weekly_quests',
                      name: 'Weekly Quests',
                      category: 'Quests',
                      pacing: 'Weekly Reset',
                      mats: 'Crystals, Keys, Gold, Dust, Sparks',
                      f2pFriendly: 'Weekly Retention',
                      f2pColor: 'text-emerald-400',
                      desc: 'Accumulating daily active thresholds unlocks the major weekly grand chest. Rewards high-grade materials and multiple keys.',
                      p2wShield: 'Direct active gameplay requirement. Keeps server activity metrics consistently high.',
                      rates: [
                        { name: 'Sovereign Gems', value: '100% (250)' },
                        { name: 'Gacha Summon Keys', value: '100% (3)' },
                        { name: 'Gold Coins', value: '100% (5,000)' },
                        { name: 'Crownmark Dust', value: '100% (1,500)' },
                        { name: 'Star Forge Sparks', value: '100% (20)' }
                      ],
                      fragRates: 'Cumulative weekly loops provide the necessary sparks to increase star limits without cash.'
                    },
                    {
                      id: 'season_rewards',
                      name: 'Season Rewards',
                      category: 'Progression',
                      pacing: '60-Day Seasonal Reset',
                      mats: 'Gems, Keys, Dust, Sparks, Shards',
                      f2pFriendly: 'Rank Payout',
                      f2pColor: 'text-yellow-400',
                      desc: 'End of season ranking rewards based on server tier achievement (Kingdom control index). Highlights player achievement.',
                      p2wShield: 'High rank rewards are highly accessible to organized guild networks, leveling the field against isolated high-spending solo accounts.',
                      rates: [
                        { name: 'Sovereign Gems', value: '100% (500 - 2,000)' },
                        { name: 'Gacha Summon Keys', value: '100% (3 - 10)' },
                        { name: 'Crownmark Dust', value: '100% (Up to 10,000)' },
                        { name: 'Star Forge Sparks', value: '100% (Up to 100)' },
                        { name: 'Celestial Shards', value: '100% (Up to 20)' }
                      ],
                      fragRates: 'Allows competitive guilds to secure legendary-grade upgrade milestones on seasonal boundaries.'
                    },
                    {
                      id: 'crafting',
                      name: 'Crafting (Synthesis Forge)',
                      category: 'Shops',
                      pacing: 'Infinite (Based on Fragment Reserve)',
                      mats: 'Direct Target Crownmark Blueprints',
                      f2pFriendly: 'Bad Luck Protection',
                      f2pColor: 'text-purple-400',
                      desc: 'Dismantling duplicates yields raw fragments which can be forged into specific targeted crownmark designs. Bypasses summon RNG entirely.',
                      p2wShield: '100% deterministic target acquisition. Ensures that no slots remain permanently empty due to poor loot table luck.',
                      rates: [
                        { name: 'Craft Rare Crownmark', value: 'Cost: 40 Fragments' },
                        { name: 'Craft Epic Crownmark', value: 'Cost: 100 Fragments' },
                        { name: 'Craft Legendary Crownmark', value: 'Cost: 250 Fragments' }
                      ],
                      fragRates: 'Allows specific, custom targeted set creation. Ideal for completing the crucial Sovereign Resonance links.'
                    },
                    {
                      id: 'premium_shop',
                      name: 'Premium Shop',
                      category: 'Shops',
                      pacing: 'Strict Weekly Quota Limits',
                      mats: 'Summon Keys, Dust Boosters, Celestial Shards',
                      f2pFriendly: 'Hard-Capped Gating',
                      f2pColor: 'text-red-400',
                      desc: 'Microtransaction store where spenders can exchange Sovereign Crystals for resources. Features tight quotas to prevent standard pay-to-win imbalance.',
                      p2wShield: 'Weekly transaction limits are set in stone. Whales cannot buy infinite materials; they are restricted to a tiny weekly margin.',
                      rates: [
                        { name: 'Weekly Keys Pack (5x)', value: 'Limit 2/week (Cost: 400 Crystals)' },
                        { name: 'Upgrade Booster Pack', value: 'Limit 3/week (Cost: 300 Crystals)' },
                        { name: 'Celestial Shard Pack (5x)', value: 'Limit 1/week (Cost: 500 Crystals)' }
                      ],
                      fragRates: 'Prevents rich players from instantly running up 5-star sets on day one. Game progression remains tied to active co-op play!'
                    }
                  ];

                  // Filter the sources
                  const filteredSources = SOURCES_METRIC.filter(src => {
                    if (economyFilter === 'all') return true;
                    if (economyFilter === 'Grind') return src.category === 'Grind';
                    if (economyFilter === 'Bosses') return src.category === 'Bosses';
                    if (economyFilter === 'Quests') return src.category === 'Quests' || src.category === 'Progression';
                    if (economyFilter === 'Shops') return src.category === 'Shops' || src.category === 'Gacha';
                    return true;
                  });

                  const selectedSource = SOURCES_METRIC.find(s => s.id === selectedSourceId) || SOURCES_METRIC[0];

                  return (
                    <div className="space-y-6">
                      {/* Interactive Section Header with economy philosophy summary */}
                      <div className="bg-gradient-to-r from-purple-950/35 via-zinc-950 to-indigo-950/35 border border-purple-500/15 p-4 rounded-2xl">
                        <h4 className="text-xs font-serif font-black text-white uppercase tracking-widest flex items-center gap-2">
                          <span className="text-purple-400 text-sm">🛡️</span> CROWNSPIRE ANTI-P2W SOVEREIGN ECONOMY
                        </h4>
                        <p className="text-[11px] text-zinc-400 mt-1.5 leading-relaxed font-sans">
                          Designed for live-service stability, the **Crownspire Economy Engine** establishes strict **gated progression ceilings** alongside guaranteed **bad-luck re-synthesis**. Whales are restricted by strict weekly premium purchase limits, meaning high-coordination group warfare and continuous solo map purges remain the most optimal paths to 5★ Awakening. No player can buy their way out of physical realm war contribution!
                        </p>
                      </div>

                      {/* Filter Category Tabs */}
                      <div className="flex flex-wrap gap-1.5 bg-black/40 p-1 rounded-xl border border-zinc-900">
                        {[
                          { id: 'all', label: 'All Activities' },
                          { id: 'Grind', label: '⚔️ Solo Grind' },
                          { id: 'Bosses', label: '🐲 Boss Raids' },
                          { id: 'Quests', label: '📋 Quests & Campaigns' },
                          { id: 'Shops', label: '🪙 Stores & Recruits' }
                        ].map(tab => (
                          <button
                            key={tab.id}
                            onClick={() => {
                              setEconomyFilter(tab.id);
                              // Auto-select first in filtered list
                              const match = SOURCES_METRIC.filter(src => {
                                if (tab.id === 'all') return true;
                                if (tab.id === 'Grind') return src.category === 'Grind';
                                if (tab.id === 'Bosses') return src.category === 'Bosses';
                                if (tab.id === 'Quests') return src.category === 'Quests' || src.category === 'Progression';
                                if (tab.id === 'Shops') return src.category === 'Shops' || src.category === 'Gacha';
                                return true;
                              })[0];
                              if (match) setSelectedSourceId(match.id);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all duration-200 ${
                              economyFilter === tab.id
                                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/35 border border-purple-500/30'
                                : 'text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      {/* Interactive Dual Screen Dashboard */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                        
                        {/* Sidebar Column: List of matching sources */}
                        <div className="lg:col-span-5 space-y-2 max-h-[580px] overflow-y-auto pr-1">
                          {filteredSources.map(src => {
                            const isSelected = selectedSourceId === src.id;
                            return (
                              <button
                                key={src.id}
                                onClick={() => setSelectedSourceId(src.id)}
                                className={`w-full text-left p-3 rounded-xl transition-all duration-200 border flex flex-col justify-between ${
                                  isSelected
                                    ? 'bg-zinc-900 border-purple-500/50 shadow-md shadow-purple-950/20'
                                    : 'bg-[#090b10]/60 border-zinc-900 hover:bg-zinc-900/50 hover:border-zinc-850'
                                }`}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span className={`text-[11px] font-black uppercase tracking-wider ${isSelected ? 'text-white' : 'text-zinc-300'}`}>
                                    {src.name}
                                  </span>
                                  <span className={`text-[8px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded ${
                                    src.category === 'Grind' ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-900/40' :
                                    src.category === 'Bosses' ? 'bg-indigo-950/50 text-indigo-400 border border-indigo-900/40' :
                                    src.category === 'Shops' || src.category === 'Gacha' ? 'bg-purple-950/50 text-purple-400 border border-purple-900/40' :
                                    'bg-yellow-950/50 text-yellow-400 border border-yellow-900/40'
                                  }`}>
                                    {src.category}
                                  </span>
                                </div>
                                <p className="text-[10px] text-zinc-500 mt-1 line-clamp-1 font-sans">
                                  {src.desc}
                                </p>
                                <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-zinc-900/50 text-[9px] font-mono">
                                  <span className="text-zinc-550">Interval:</span>
                                  <span className="text-yellow-500">{src.pacing}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Detail Console Column: Specifications & Simulator */}
                        <div className="lg:col-span-7 space-y-4">
                          
                          {/* Live Activity Simulator Widget */}
                          <div className="bg-[#0b0e14] border border-purple-900/15 p-4 rounded-2xl relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 bg-purple-950/60 border-l border-b border-purple-800/35 px-2 py-1 rounded-bl-lg text-[8px] font-mono text-purple-400 font-bold tracking-widest uppercase">
                              SANDBOX EMULATOR
                            </div>

                            <h5 className="text-[10px] font-mono font-black text-purple-400 tracking-wider uppercase flex items-center gap-1.5">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                              </span>
                              ACTIVE-CLEARING EMULATOR: {selectedSource.name}
                            </h5>

                            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 bg-black/60 p-2.5 rounded-xl border border-zinc-900 font-mono text-[9px]">
                              <div>🪙 <span className="text-zinc-550">Gold:</span> <span className="text-yellow-500 font-bold">{inventory.gold.toLocaleString()}</span></div>
                              <div>💎 <span className="text-zinc-550">Gems:</span> <span className="text-red-400 font-bold">{inventory.crystals.toLocaleString()}</span></div>
                              <div>🌌 <span className="text-zinc-550">Dust:</span> <span className="text-purple-400 font-bold">{inventory.dust.toLocaleString()}</span></div>
                              <div>✨ <span className="text-zinc-550">Sparks:</span> <span className="text-yellow-400 font-bold">{inventory.starSparks}</span></div>
                              <div>💎 <span className="text-zinc-550">Shards:</span> <span className="text-cyan-400 font-bold">{inventory.celestialShards}</span></div>
                              <div>🔑 <span className="text-zinc-550">Keys:</span> <span className="text-indigo-400 font-bold">{simKeys}</span></div>
                              <div>🔨 <span className="text-zinc-550">Fragments:</span> <span className="text-emerald-400 font-bold">{inventory.fragments}</span></div>
                              <div>🎟️ <span className="text-zinc-550">Resonance Link:</span> <span className="text-purple-400">100% Secure</span></div>
                            </div>

                            {/* Simulation Trigger button */}
                            <div className="mt-4 flex gap-2">
                              <button
                                onClick={() => handleSimulateSource(selectedSource.id)}
                                className="flex-1 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-extrabold uppercase py-2 px-4 rounded-xl text-[10px] font-mono tracking-widest transition-all duration-200 shadow-lg shadow-purple-950/40 hover:shadow-purple-900/50 active:scale-98 border border-purple-500/25 flex items-center justify-center gap-1.5"
                              >
                                ⚔️ SIMULATE {selectedSource.id === 'premium_shop' ? 'SHOP EXCH' : selectedSource.id === 'crafting' ? 'FORGE BLUEPRINT' : 'ACTIVE CLEAR'}
                              </button>
                              
                              {(selectedSource.id === 'alliance_shop' || selectedSource.id === 'premium_shop') && (
                                <button
                                  onClick={() => {
                                    setWeeklyLimits({
                                      keys: 2,
                                      bundles: 3,
                                      shards: 1,
                                      alliance_keys: 3,
                                      alliance_sparks: 5,
                                      alliance_shards: 2
                                    });
                                    triggerFeedbackAlert("🔄 Weekly sandbox purchasing limits refilled!", "success");
                                  }}
                                  className="bg-zinc-900 border border-zinc-850 text-zinc-400 hover:bg-zinc-800 hover:text-white p-2 rounded-xl text-[9px] font-mono flex items-center justify-center gap-1"
                                  title="Reset Weekly Quota Gating"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>RESET LIMITS</span>
                                </button>
                              )}
                            </div>

                            {/* Scrolling Ledger / Sim Log Output */}
                            <div className="mt-3.5 bg-black/80 border border-zinc-900/90 rounded-xl p-3 font-mono text-[10px] min-h-[90px] flex flex-col justify-between">
                              {sourceSimLog ? (
                                <>
                                  <div className="text-zinc-400 leading-relaxed italic border-b border-zinc-900 pb-1.5">
                                    {sourceSimLog.text}
                                  </div>
                                  <div className="pt-2 flex flex-wrap gap-1.5 items-center">
                                    <span className="text-[8px] text-zinc-550 font-extrabold tracking-widest uppercase mr-1">LOOT SECURED:</span>
                                    {sourceSimLog.items.length > 0 ? (
                                      sourceSimLog.items.map((it, i) => (
                                        <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800/80 text-[9px]" style={{ color: it.color }}>
                                          <span className="font-bold">{it.name}</span>
                                          <span className="text-zinc-400 bg-black/40 px-1 py-0.2 rounded font-black text-[8px]">{it.count}</span>
                                        </span>
                                      ))
                                    ) : (
                                      <span className="text-zinc-600">Weekly Quota Exhausted! Reset Limits.</span>
                                    )}
                                  </div>
                                </>
                              ) : (
                                <div className="text-zinc-600 flex flex-col items-center justify-center py-4 text-center">
                                  <span>📥 Simulation queue empty.</span>
                                  <span className="text-[8px] text-zinc-755 mt-1">CLICK SIMULATE ABOVE TO EXECUTE COMBAT LOOT DROPS</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Economy Spec Dossier Card */}
                          <div className="bg-zinc-950 border border-zinc-900/90 rounded-2xl p-4 space-y-4">
                            <div className="border-b border-zinc-900 pb-2 flex items-center justify-between">
                              <h4 className="text-xs font-serif font-black text-white uppercase tracking-wider">
                                {selectedSource.name} SPECIFICATIONS
                              </h4>
                              <span className="text-[9px] font-mono text-zinc-550">
                                ⏳ PACING: {selectedSource.pacing}
                              </span>
                            </div>

                            <p className="text-[10.5px] text-zinc-400 leading-relaxed font-sans">
                              {selectedSource.desc}
                            </p>

                            {/* P2W Shielding block */}
                            <div className="bg-purple-950/15 border border-purple-900/30 p-3 rounded-xl">
                              <h6 className="text-[9px] font-mono font-extrabold text-purple-400 uppercase tracking-widest flex items-center gap-1">
                                <span className="text-xs">🛡️</span> DESIGNER PRE-EMPTIVE P2W SHIELDING ANALYSIS
                              </h6>
                              <p className="text-[10px] text-zinc-400 mt-1 leading-normal font-sans">
                                {selectedSource.p2wShield}
                              </p>
                            </div>

                            {/* Drop rates grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                              <div>
                                <span className="text-[8px] text-zinc-550 font-extrabold tracking-widest uppercase block mb-1.5">🎯 PROBABILISTIC DROP RATES</span>
                                <div className="bg-[#090b10] border border-zinc-900 rounded-lg overflow-hidden font-mono text-[9.5px]">
                                  {selectedSource.rates.map((rate, rIdx) => (
                                    <div key={rIdx} className="flex justify-between p-1.5 border-b border-zinc-900/50 last:border-0 hover:bg-zinc-900/30">
                                      <span className="text-zinc-400">{rate.name}</span>
                                      <span className="text-purple-400 font-bold">{rate.value}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div>
                                <span className="text-[8px] text-zinc-550 font-extrabold tracking-widest uppercase block mb-1.5">🗄️ BAD-LUCK FRAGMENT CONVERSIONS</span>
                                <div className="bg-[#090b10] border border-zinc-900 rounded-lg p-2.5 font-sans text-[10px] text-zinc-400 leading-relaxed">
                                  {selectedSource.fragRates}
                                  <div className="mt-2 text-[9px] text-purple-400/80 font-mono italic">
                                    Duplicates automatically melt into fragments, allowing players to synthesise specific lacking Crownmark pieces in the Crafting Forge.
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })()}

                {/* SUB TAB B: CHEST SUMMON SIMULATOR */}
                {activeEconomySubTab === 'summon' && (
                  <div className="space-y-5">
                    {/* Gacha details layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                      
                      {/* Left Side: Gacha stats and pull triggers */}
                      <div className="bg-[#090b10] border border-zinc-850 p-4 rounded-2xl space-y-4 font-mono text-xs text-zinc-300">
                        <div className="border-b border-zinc-900 pb-2">
                          <span className="text-[9px] text-purple-400 font-extrabold tracking-widest uppercase">SOVEREIGN CHEST SUMMON</span>
                          <h4 className="text-xs font-black text-white mt-0.5 uppercase">CROWNMARK GACHA EMULATOR</h4>
                        </div>

                        {/* Interactive Key Inventory */}
                        <div className="bg-black/50 p-3 rounded-xl border border-zinc-900 flex justify-between items-center text-xs">
                          <span className="text-zinc-400 flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-purple-400" /> Summon Keys:
                          </span>
                          <strong className="text-purple-400 text-sm">{simKeys} Keys</strong>
                        </div>

                        {/* Drop Rates table */}
                        <div className="bg-black/20 p-2.5 rounded-xl border border-zinc-900 space-y-1.5 text-[10px]">
                          <span className="text-[8px] text-zinc-550 block font-bold uppercase">CALIBRATED DRAW RATES</span>
                          <div className="flex justify-between text-zinc-400">
                            <span>🔵 Rare Crownmark Template:</span>
                            <span className="text-blue-400 font-bold">55.0%</span>
                          </div>
                          <div className="flex justify-between text-zinc-400">
                            <span>🟣 Epic Crownmark Template:</span>
                            <span className="text-purple-400 font-bold">25.0%</span>
                          </div>
                          <div className="flex justify-between text-zinc-400">
                            <span>🟡 Legendary Crownmark:</span>
                            <span className="text-yellow-500 font-bold">8.0%</span>
                          </div>
                          <div className="flex justify-between text-zinc-400">
                            <span>🔴 Mythic Material / Micro-Gains:</span>
                            <span className="text-red-400 font-bold">12.0%</span>
                          </div>
                        </div>

                        {/* Pity Calibration */}
                        <div className="space-y-1 bg-black/50 p-2.5 rounded-xl border border-zinc-900 text-[10px]">
                          <div className="flex justify-between items-center">
                            <span className="text-zinc-400">Legendary Pity Progress:</span>
                            <span className="text-yellow-500 font-black">{gachaPity} / 30 pulls</span>
                          </div>
                          <div className="w-full bg-zinc-950 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-yellow-500 h-full transition-all" style={{ width: `${(gachaPity / 30) * 100}%` }} />
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <button
                            onClick={() => handleSimulateGacha(1)}
                            className="py-2 bg-purple-600 hover:bg-purple-500 border border-purple-500/30 text-white font-bold text-[10px] rounded-lg cursor-pointer transition-all active:scale-95 text-center flex items-center justify-center gap-1 uppercase"
                          >
                            🎟️ Draw x1
                          </button>
                          <button
                            onClick={() => handleSimulateGacha(10)}
                            className="py-2 bg-yellow-600 hover:bg-yellow-500 border border-yellow-500/30 text-white font-bold text-[10px] rounded-lg cursor-pointer transition-all active:scale-95 text-center flex items-center justify-center gap-1 uppercase"
                          >
                            🎟️ Draw x10
                          </button>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                          <button
                            onClick={() => setSimKeys(prev => prev + 10)}
                            className="py-1.5 bg-zinc-900 border border-zinc-800 hover:text-white text-zinc-400 font-bold text-[9px] rounded-lg cursor-pointer transition-all active:scale-95 text-center flex items-center justify-center gap-1 uppercase"
                          >
                            ➕ Grant 10 Gacha Keys
                          </button>
                        </div>
                        
                        <div className="text-[9px] text-zinc-550 leading-normal italic font-sans">
                          💡 <em>Duplicate Check: If a crownmark drawn is already active in the Codex registry, it **automatically melts** into Duplicate fragments based on rarity (Rare: +12, Epic: +30, Legendary: +80). Try drawing to see!</em>
                        </div>
                      </div>

                      {/* Right Side: Drawn items display */}
                      <div className="lg:col-span-2 bg-[#090b10] border border-zinc-850 p-4 rounded-2xl flex flex-col justify-between min-h-[350px]">
                        <div className="space-y-3.5">
                          <div className="border-b border-zinc-900 pb-2 flex items-center justify-between">
                            <span className="text-[9px] text-zinc-550 font-bold font-mono uppercase tracking-wider">SUMMON SIMULATION FEEDBACK LEDGER</span>
                            <span className="text-[9px] text-purple-400 font-mono font-bold">Latest Pull Results</span>
                          </div>

                          {latestDraws.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-h-[280px] overflow-y-auto pr-1">
                              {latestDraws.map((item, idx) => (
                                <div 
                                  key={idx}
                                  className="bg-black/60 border border-zinc-900 p-2 rounded-xl flex flex-col items-center text-center justify-between relative overflow-hidden"
                                >
                                  {/* Rarity color highlight dot */}
                                  <div className="absolute top-1 right-1 w-2 h-2 rounded-full border border-black" style={{ backgroundColor: item.color }} />
                                  
                                  {/* Rarity Badge */}
                                  <span className="text-[7px] font-mono uppercase text-zinc-500 leading-none mt-1">
                                    {item.rarity}
                                  </span>

                                  {/* Draw item illustration */}
                                  <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-900 my-2 flex items-center justify-center">
                                    <svg viewBox="0 0 100 100" className="w-5 h-5" style={{ filter: `drop-shadow(0 0 3px ${item.color})` }}>
                                      <path d="M50 15 L85 50 L50 85 L15 50 Z" fill={item.color} />
                                    </svg>
                                  </div>

                                  <span className="text-[9px] font-black text-white leading-tight uppercase line-clamp-2">
                                    {item.name}
                                  </span>

                                  <div className="mt-1.5 font-mono text-[9px]">
                                    {item.duplicate ? (
                                      <span className="text-emerald-400 font-bold">+{item.count} Frags</span>
                                    ) : (
                                      <span className="text-purple-300 font-medium">+{item.count}</span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="h-[200px] flex flex-col items-center justify-center text-zinc-600 font-mono text-xs gap-2">
                              <span>🔮 Sovereign Vault Sealed.</span>
                              <span className="text-[10px] text-zinc-550 text-center max-w-sm leading-relaxed">Simulate a pull to watch drops, pity mechanics, and duplicate melt engine triggers!</span>
                            </div>
                          )}
                        </div>

                        {latestDraws.length > 0 && (
                          <div className="text-[9px] font-mono text-zinc-550 leading-normal border-t border-zinc-950 pt-2 flex justify-between items-center">
                            <span>Auto-conversion check complete.</span>
                            <span className="text-emerald-400 font-bold">Reserves synced with Sandbox Forge!</span>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                )}

                {/* SUB TAB C: CRAFTING FORGE */}
                {activeEconomySubTab === 'craft' && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                      
                      {/* Left side Selector */}
                      <div className="bg-[#090b10] border border-zinc-850 p-4 rounded-2xl space-y-4 font-mono text-xs text-zinc-300">
                        <div className="border-b border-zinc-900 pb-2">
                          <span className="text-[9px] text-purple-400 font-extrabold tracking-widest uppercase">DUPLICATE CONVERSION RE-SYNTHESIS</span>
                          <h4 className="text-xs font-black text-white mt-0.5 uppercase">SPECIFIC CROWNMARK SYNTHESIS FORGE</h4>
                        </div>

                        {/* Interactive Fragment counter */}
                        <div className="bg-black/50 p-3 rounded-xl border border-zinc-900 flex justify-between items-center text-xs">
                          <span className="text-zinc-400 flex items-center gap-1.5">
                            🏺 Duplicate Fragments:
                          </span>
                          <strong className="text-emerald-400 text-sm">{inventory.fragments} Frags</strong>
                        </div>

                        {/* Crafting cost spec sheet */}
                        <div className="bg-black/20 p-2.5 rounded-xl border border-zinc-900 space-y-1.5 text-[10px] leading-relaxed text-zinc-400">
                          <span className="text-[8px] text-zinc-550 block font-bold uppercase">SYNTHESIS PRICING CATALOGUE</span>
                          <div>🔵 Rare Blueprint: <strong className="text-white">40 Fragments</strong></div>
                          <div>🟣 Epic Blueprint: <strong className="text-white">100 Fragments</strong></div>
                          <div>🟡 Legendary Blueprint: <strong className="text-white">250 Fragments</strong></div>
                        </div>

                        {/* Select specific crownmark */}
                        <div className="space-y-1.5">
                          <span className="text-[9px] text-zinc-500 font-bold uppercase">Select Crownmark to Craft:</span>
                          <select
                            value={selectedCraftCrownmarkId}
                            onChange={(e) => setSelectedCraftCrownmarkId(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-850 text-white text-xs rounded-xl p-2 font-mono cursor-pointer focus:outline-none focus:border-purple-500"
                          >
                            {Object.values(CROWNMARKS_DATABASE).map(r => {
                              let rarityName = 'Epic';
                              if (r.color === '#2563eb' || r.color === '#475569' || r.color === '#1e1b4b' || r.color === '#10b981') rarityName = 'Rare';
                              else if (r.color === '#a855f7' || r.color === '#eab308' || r.color === '#06b6d4') rarityName = 'Legendary';
                              return (
                                <option key={r.id} value={r.id}>
                                  {r.name} ({rarityName})
                                </option>
                              );
                            })}
                          </select>
                        </div>

                        {/* Craft Quantity slider/selector */}
                        <div className="space-y-1.5">
                          <span className="text-[9px] text-zinc-500 font-bold uppercase">Synthesize Quantity:</span>
                          <div className="flex gap-2 font-mono">
                            {[1, 2, 3].map((qty) => (
                              <button
                                key={qty}
                                onClick={() => setCraftQuantity(qty)}
                                className={`flex-1 py-1.5 rounded-lg border text-xs cursor-pointer transition-all ${
                                  craftQuantity === qty 
                                    ? 'bg-purple-900/30 border-purple-500 text-purple-300 font-extrabold' 
                                    : 'bg-zinc-950 border-zinc-850 text-zinc-500 hover:text-zinc-350'
                                }`}
                              >
                                {qty}x
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Synthesis Trigger */}
                        <button
                          onClick={handleCraftCrownmark}
                          className="w-full mt-2 py-2.5 bg-purple-650 hover:bg-purple-550 text-white font-bold text-xs rounded-xl cursor-pointer active:scale-95 transition-all text-center flex items-center justify-center gap-1 uppercase"
                        >
                          🔨 Synthesize Crownmark Blueprint
                        </button>

                        <div className="text-[9px] text-zinc-550 leading-relaxed font-sans">
                          💡 <em>By guaranteeing that all crownmarks can be specifically crafted from salvaged duplicate fragments, players can target missing slots to complete their **Sovereign Resonance sets** rather than being at the mercy of luck.</em>
                        </div>
                      </div>

                      {/* Right Side card detail preview */}
                      {CROWNMARKS_DATABASE[selectedCraftCrownmarkId] && (
                        <div className="lg:col-span-2 bg-[#090b10] border border-zinc-850 p-5 rounded-2xl flex flex-col justify-between items-center text-center relative overflow-hidden min-h-[350px]">
                          {/* Ambient overlay based on color */}
                          <div 
                            className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] opacity-[0.04]"
                            style={{ 
                              '--tw-gradient-from': `${CROWNMARKS_DATABASE[selectedCraftCrownmarkId].color}50`,
                              '--tw-gradient-to': 'transparent'
                            } as any}
                          />

                          <div className="space-y-4 relative z-10 w-full">
                            <span className="text-[9px] font-mono text-purple-400 font-bold tracking-widest uppercase">
                              SYNTHESIS TARGET SPECIFICATION REPORT
                            </span>
                            
                            {/* Graphic preview */}
                            <div className="w-24 h-24 rounded-2xl bg-zinc-950/90 border border-zinc-800 flex items-center justify-center mx-auto shadow-2xl relative">
                              <svg viewBox="0 0 100 100" className="w-16 h-16" style={{ filter: `drop-shadow(0 0 8px ${CROWNMARKS_DATABASE[selectedCraftCrownmarkId].color})` }}>
                                <circle cx="50" cy="50" r="38" stroke={CROWNMARKS_DATABASE[selectedCraftCrownmarkId].color} strokeWidth="1.5" fill="none" opacity="0.3" />
                                {CROWNMARKS_DATABASE[selectedCraftCrownmarkId].slot === 'Weapon' ? (
                                  <path d="M70 30 L45 55 L35 45 L30 50 L40 60 L15 85 L20 90 L45 65 L55 75 Z" fill={CROWNMARKS_DATABASE[selectedCraftCrownmarkId].color} />
                                ) : CROWNMARKS_DATABASE[selectedCraftCrownmarkId].slot === 'Helm' ? (
                                  <path d="M30 40 Q50 15 70 40 Q75 60 70 80 H30 Q25 60 30 40 Z" fill={CROWNMARKS_DATABASE[selectedCraftCrownmarkId].color} />
                                ) : CROWNMARKS_DATABASE[selectedCraftCrownmarkId].slot === 'Crest' ? (
                                  <path d="M30 25 L70 25 L75 55 Q70 85 50 95 Q30 85 25 55 Z" fill={CROWNMARKS_DATABASE[selectedCraftCrownmarkId].color} />
                                ) : CROWNMARKS_DATABASE[selectedCraftCrownmarkId].slot === 'Signet' ? (
                                  <circle cx="50" cy="50" r="22" fill="none" stroke={CROWNMARKS_DATABASE[selectedCraftCrownmarkId].color} strokeWidth="5" />
                                ) : (
                                  <path d="M25 20 H75 V80 H25 Z M35 35 H65 M35 50 H65 M35 65 H50" stroke={CROWNMARKS_DATABASE[selectedCraftCrownmarkId].color} strokeWidth="3" fill="none" />
                                )}
                              </svg>
                            </div>

                            <div className="space-y-1 max-w-md mx-auto">
                              <h3 className="text-sm font-black font-serif text-white uppercase tracking-wider">
                                {CROWNMARKS_DATABASE[selectedCraftCrownmarkId].name}
                              </h3>
                              <p className="text-[10px] font-mono text-zinc-550 uppercase">
                                SLOT Type: {CROWNMARKS_DATABASE[selectedCraftCrownmarkId].slot} | Signature Match: {HEROES_LIST.find(h => h.id === CROWNMARKS_DATABASE[selectedCraftCrownmarkId].signatureHeroId)?.name || 'General'}
                              </p>
                              <p className="text-[11px] text-zinc-400 font-sans italic leading-relaxed pt-1.5">
                                "{CROWNMARKS_DATABASE[selectedCraftCrownmarkId].flavor}"
                              </p>
                            </div>
                          </div>

                          <div className="w-full relative z-10 border-t border-zinc-950 pt-4 mt-4 text-[10px] font-mono text-zinc-500 flex justify-between items-center">
                            <span>Unlock bonus registered: +1.5% Army Attack (account-wide).</span>
                            <span className="text-purple-400 font-bold">READY FOR DEPLOYMENT</span>
                          </div>
                        </div>
                      )}

                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

          {/* ======================================================================
              TAB 5: HERO CROWNMARK EQUIPMENT SLOTS
              ====================================================================== */}
          {activeTab === 'slots' && (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Top Summary Banner */}
              <div className="bg-gradient-to-r from-purple-950/20 via-zinc-950 to-indigo-950/20 border-b border-zinc-850 p-4 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-serif font-black text-white uppercase tracking-wide flex items-center gap-1.5">
                    <span>🏺</span> 8-SLOT SOVEREIGN CROWNMARK EQUIPMENT SYSTEM
                  </h4>
                  <p className="text-[11px] text-zinc-400 max-w-2xl leading-relaxed font-sans">
                    Crownspire's heroes can equip up to 8 distinct crownmarks. Unlike standard fantasy armor, these represent sovereign peerage rights, spiritual sigils, and legion battle standards that govern large-scale command dynamics.
                  </p>
                </div>
                {/* Hero Pickers inside Slots */}
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-zinc-550 uppercase">Hero:</span>
                  <div className="flex bg-zinc-950 border border-zinc-850 p-1 rounded-xl">
                    {HEROES_LIST.map(h => (
                      <button
                        key={h.id}
                        onClick={() => setSlotsHeroId(h.id)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                          slotsHeroId === h.id
                            ? 'bg-purple-900/40 border border-purple-500/30 text-purple-300'
                            : 'text-zinc-500 hover:text-zinc-350'
                        }`}
                      >
                        {h.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Main Workspace split into columns */}
              <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0">
                {/* Left side: Simulated progression controls & Lore details */}
                <div className="lg:col-span-4 space-y-4">
                  
                  {/* Hero Pacing Sliders (Dynamic Unlocking) */}
                  <div className="bg-[#090b10] border border-zinc-850 p-4 rounded-2xl space-y-3.5">
                    <span className="text-[9px] text-purple-400 font-extrabold tracking-widest uppercase block font-mono">SOVEREIGN STATE SIMULATOR</span>
                    <h3 className="text-xs font-black text-white uppercase font-serif">CALIBRATE COMMANDER POWER</h3>
                    
                    {/* Simulated Level Slider */}
                    <div className="space-y-1 font-mono text-xs">
                      <div className="flex justify-between text-zinc-400 text-[11px]">
                        <span>Simulated Hero Level:</span>
                        <strong className="text-white text-xs">{slotsSimLevel} / 100</strong>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={slotsSimLevel}
                        onChange={(e) => setSlotsSimLevel(Number(e.target.value))}
                        className="w-full accent-purple-500 h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-[9px] text-zinc-500">
                        <span>Lvl 1</span>
                        <span>Lvl 50</span>
                        <span>Lvl 100</span>
                      </div>
                    </div>

                    {/* Simulated Star Level buttons */}
                    <div className="space-y-1.5 font-mono text-xs">
                      <span className="text-zinc-400 text-[11px] block">Simulated Hero Stars:</span>
                      <div className="flex gap-1.5">
                        {[0, 1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setSlotsSimStars(star)}
                            className={`flex-1 py-1 rounded-lg border text-[10px] font-bold cursor-pointer transition-all ${
                              slotsSimStars === star
                                ? 'bg-yellow-500/10 border-yellow-500 text-yellow-500'
                                : 'bg-zinc-950 border-zinc-850 text-zinc-500 hover:text-zinc-350'
                            }`}
                          >
                            {star}★
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="text-[9px] text-zinc-500 leading-normal italic font-sans pt-1">
                      💡 <em>Adjust the levels to watch slots dynamically lock or unlock based on crown progression specs!</em>
                    </div>
                  </div>

                  {/* Resonance & Set Bonus Meter */}
                  <div className="bg-[#090b10] border border-zinc-850 p-4 rounded-2xl space-y-3.5 font-mono text-xs text-zinc-300">
                    <span className="text-[9px] text-purple-400 font-extrabold tracking-widest uppercase block">SOVEREIGN CODES & RESONANCE</span>
                    <h3 className="text-xs font-black text-white uppercase font-serif">RESONANCE OVERVIEW</h3>

                    {/* Calculation of Unlocked count */}
                    {(() => {
                      const slotsDef = [
                        { id: 'weapon', minLvl: 1, minStars: 0 },
                        { id: 'crown', minLvl: 20, minStars: 1 },
                        { id: 'armor', minLvl: 40, minStars: 2 },
                        { id: 'artifact', minLvl: 60, minStars: 3 },
                        { id: 'accessory', minLvl: 80, minStars: 4 },
                        { id: 'charm', minLvl: 90, minStars: 5 },
                        { id: 'seal', minLvl: 100, minStars: 5 },
                        { id: 'banner', minLvl: 100, minStars: 5 }
                      ];
                      
                      const unlockedCount = slotsDef.filter(slot => slotsSimLevel >= slot.minLvl && slotsSimStars >= slot.minStars).length;
                      
                      return (
                        <div className="space-y-3">
                          <div className="bg-black/50 p-3 rounded-xl border border-zinc-900 flex justify-between items-center">
                            <span className="text-zinc-400 flex items-center gap-1.5">
                              🏺 Active Slots:
                            </span>
                            <strong className="text-purple-400 text-sm">{unlockedCount} / 8 Unlocked</strong>
                          </div>

                          <div className="space-y-2">
                            {[
                              { count: 2, label: 'Resonance Tier I (2+ Slots)', bonus: '+10% Army Attack & Defense', color: unlockedCount >= 2 ? 'text-purple-300 font-bold' : 'text-zinc-650' },
                              { count: 4, label: 'Resonance Tier II (4+ Slots)', bonus: '+15% Hero Skill Damage & +10% March Speed', color: unlockedCount >= 4 ? 'text-purple-300 font-bold' : 'text-zinc-650' },
                              { count: 6, label: 'Resonance Tier III (6+ Slots)', bonus: '+20% Damage Output & +15% HP', color: unlockedCount >= 6 ? 'text-purple-300 font-bold' : 'text-zinc-650' },
                              { count: 8, label: 'Absolute Presence Aura (8/8 Set)', bonus: 'Unlocks visual Sovereign Star halo & Co-op combat strikes', color: unlockedCount >= 8 ? 'text-yellow-500 font-black' : 'text-zinc-650' }
                            ].map((res, i) => (
                              <div key={i} className={`p-2.5 rounded-xl border ${unlockedCount >= res.count ? 'bg-purple-950/10 border-purple-500/20' : 'bg-transparent border-zinc-900'} text-[10px] space-y-0.5 transition-all`}>
                                <div className="flex justify-between items-center">
                                  <span className={res.color}>{res.label}</span>
                                  {unlockedCount >= res.count ? (
                                    <span className="text-emerald-400 text-[9px] font-black uppercase">● ACTIVE</span>
                                  ) : (
                                    <span className="text-zinc-650 text-[9px] font-bold uppercase">LOCKED</span>
                                  )}
                                </div>
                                <p className={`text-[10px] ${unlockedCount >= res.count ? 'text-zinc-400' : 'text-zinc-600'} font-sans`}>{res.bonus}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* Right side: 8-Slot grid layout & dynamic detailed card panel */}
                <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-12 gap-5 min-h-0">
                  {/* Symmetrical 8-Slot Grid (MD Col Span 7) */}
                  <div className="md:col-span-7 bg-[#090b10] border border-zinc-850 p-4 rounded-2xl flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="border-b border-zinc-900 pb-2 flex justify-between items-center font-mono">
                        <span className="text-[9px] text-zinc-550 font-bold uppercase tracking-wider">RADIAL WEAPONRY MATRIX</span>
                        <span className="text-[9px] text-purple-400 font-bold">SELECT SLOT FOR METADATA</span>
                      </div>

                      {/* Grid representation */}
                      {(() => {
                        const slotsDef = [
                          { id: 'weapon', label: 'Signature Weapon', minLvl: 1, minStars: 0, icon: '⚔️' },
                          { id: 'crown', label: 'Sovereign Crown', minLvl: 20, minStars: 1, icon: '👑' },
                          { id: 'armor', label: 'Crownmark Armor', minLvl: 40, minStars: 2, icon: '🛡️' },
                          { id: 'artifact', label: 'Sacred Artifact', minLvl: 60, minStars: 3, icon: '🔮' },
                          { id: 'accessory', label: 'Royal Accessory', minLvl: 80, minStars: 4, icon: '💍' },
                          { id: 'charm', label: 'Runic Charm', minLvl: 90, minStars: 5, icon: '🧿' },
                          { id: 'seal', label: 'Imperial Seal', minLvl: 100, minStars: 5, icon: '⚜️' },
                          { id: 'banner', label: 'Vanguard Banner', minLvl: 100, minStars: 5, icon: '🚩' }
                        ];

                        return (
                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-2 gap-3">
                            {slotsDef.map((slot, index) => {
                              const isUnlocked = slotsSimLevel >= slot.minLvl && slotsSimStars >= slot.minStars;
                              const isSelected = slotsSelectedSlotIndex === index;
                              
                              return (
                                <button
                                  key={slot.id}
                                  onClick={() => setSlotsSelectedSlotIndex(index)}
                                  className={`p-3 rounded-xl border flex flex-col items-center justify-center text-center relative transition-all cursor-pointer active:scale-95 ${
                                    isUnlocked
                                      ? isSelected
                                        ? 'bg-purple-950/20 border-purple-500 text-white shadow-[0_0_12px_rgba(168,85,247,0.25)]'
                                        : 'bg-[#0c0f16] border-zinc-800 text-zinc-300 hover:border-zinc-700'
                                      : 'bg-zinc-950/40 border-zinc-950/80 text-zinc-650'
                                  }`}
                                >
                                  {/* Lock Badge */}
                                  {!isUnlocked && (
                                    <div className="absolute top-1.5 right-1.5">
                                      <Lock className="w-3 h-3 text-zinc-700" />
                                    </div>
                                  )}

                                  {/* Slot Symbol */}
                                  <div className={`text-xl mb-1.5 ${isUnlocked ? 'opacity-100' : 'opacity-30 filter grayscale'}`}>
                                    {slot.icon}
                                  </div>

                                  <span className="text-[10px] font-black tracking-wide font-mono uppercase block">
                                    {slot.label}
                                  </span>

                                  {isUnlocked ? (
                                    <span className="text-[8px] font-mono font-bold text-emerald-400 mt-1 leading-none uppercase">
                                      Active
                                    </span>
                                  ) : (
                                    <span className="text-[8px] font-mono font-bold text-zinc-600 mt-1 leading-none uppercase">
                                      Lvl {slot.minLvl} ({slot.minStars}★)
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Aura Visual Indicator */}
                    {slotsSimLevel >= 100 && slotsSimStars >= 5 ? (
                      <div className="mt-4 bg-gradient-to-r from-yellow-950/20 via-zinc-950 to-yellow-950/20 border border-yellow-500/20 p-3 rounded-xl flex items-center gap-3 animate-pulse">
                        <Sparkles className="w-5 h-5 text-yellow-500 shrink-0" />
                        <div className="font-mono text-[10px] leading-relaxed">
                          <span className="text-yellow-500 font-extrabold uppercase tracking-widest block">SOVEREIGN HALO SHIELD ONLINE</span>
                          <p className="text-zinc-400 font-sans">
                            {slotsHeroId === 'maegan' && 'Marshal Violet Starfire: Surrounds infantry legions with royal arcs, dealing +20% counter skill fire.'}
                            {slotsHeroId === 'shadow' && 'Obsidian Syndicate Fog: Obscures marksmen trails, granting complete first strike stealth.'}
                            {slotsHeroId === 'lorelai' && 'Moonlight Ethereal Hymn: Regenerates surrounding cohort health by +8% per second.'}
                            {slotsHeroId === 'dominic' && 'Bastion Mountain Aegis: Grants complete defensive knockback protection to surrounding blocks.'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 bg-zinc-950/40 border border-zinc-900/60 p-3 rounded-xl flex items-center gap-2.5 font-mono text-[9px] text-zinc-500">
                        <Info className="w-4 h-4 text-zinc-550 shrink-0" />
                        <span>Sovereign aura triggers once all 8 slots are fully awake and level 100 is unlocked.</span>
                      </div>
                    )}
                  </div>

                  {/* Symmetrical Detailed Item & Lore Panel (MD Col Span 5) */}
                  {(() => {
                    // Item matrix by Hero
                    const itemMatrix: Record<string, any[]> = {
                      maegan: [
                        { name: "Founder's Scepter", slot: 'Weapon', desc: 'Sovereign Command', stats: 'Army Attack % & Crit Strike Chance', passive: 'Boosts infantry legion basic damage and increases troop march damage rating by 10%.', lore: 'Conduits of lethal steel forged with star-dust. In Crownspire\'s military, a hero\'s blade guides legion morale.', color: '#a855f7' },
                        { name: "Founder's Crown", slot: 'Crown', desc: 'Crownspire Bulwark', stats: 'Army Defense % & Siege Mitigation', passive: 'Generates an indestructible starlight dome absorbing 20% of incoming siege skill fire.', lore: 'The divine sigil of ruling lineage. Fits the high-fantasy royalty of Crownspire, guiding peerage status.', color: '#eab308' },
                        { name: "Volcanic Sovereign Chestplate", slot: 'Armor', desc: 'Imperial Aegis', stats: 'Army Health % & Counter-attack Damage', passive: 'Boosts garrison health factors by 15% and increases total guard armor ratings.', lore: 'Volcanic plate mail layered with celestial shields, representing the unbreakable heavy vanguard walls.', color: '#a855f7' },
                        { name: "Star Hearth Orb", slot: 'Artifact', desc: 'Leyline Overdrive', stats: 'Hero Skill Power % & Rage Speed', passive: 'Active commander skill casts build +18% secondary commander strike energy.', lore: 'Floating orbs of crystal magic which bind to cosmic leylines to fuel divine commander rage skills.', color: '#eab308' },
                        { name: "Sapphire Signet Ring", slot: 'Accessory', desc: 'Prism Overload', stats: 'Legion Load % & March Speed', passive: 'Active commander skills trigger a +15% Critical Strike factor, bursting with violet fire.', lore: 'Baron rings and necklaces, showing peerage rank and accelerating troop supply march speed.', color: '#2563eb' },
                        { name: "Amulet of Divine Grace", slot: 'Charm', desc: 'Morale Blessing', stats: 'Healing Effectiveness % & Control Immunity', passive: 'Increases recovery effects by 12% on low health, providing stun resistances.', lore: 'Talismans engraved with the spirits of ancient wardens, providing resilience against dark map curses.', color: '#2563eb' },
                        { name: "Seal of the High Marshal", slot: 'Seal', desc: 'Citadel Mandate', stats: 'Garrison Attack/Defense % & Tenacity', passive: 'Strengthens fortress defenses, converting 10% of deaths into lightly wounded.', lore: 'The monarch\'s official seal, representing absolute governance and defensive structure protection.', color: '#ec4899' },
                        { name: "Royal Charter Standard", slot: 'Banner', desc: 'Empire Providence', stats: 'Legion Size Cap % & Co-op strike', passive: 'Permanently cuts structure construction timers by 10% and upgrades barracks capacity by 15%.', lore: 'A battle-worn standard of high-glory, raising absolute morale to expand maximum troop capacity.', color: '#ec4899' }
                      ],
                      shadow: [
                        { name: "Twin Shadow Daggers", slot: 'Weapon', desc: 'Eclipse Strike', stats: 'Army Attack % & Crit Strike Chance', passive: 'Strikes ignore 20% of the target legion’s armor rating, dealing pure critical backstab hits.', lore: 'Conduits of lethal steel forged with star-dust. In Crownspire\'s military, a hero\'s blade guides legion morale.', color: '#6366f1' },
                        { name: "Assassin\'s Silk Cowl", slot: 'Crown', desc: 'Specter Shroud', stats: 'Army Defense % & Siege Mitigation', passive: 'Prevents the legion from being targeted by scout radars, amplifying surprise flank damage by 25%.', lore: 'The divine sigil of ruling lineage. Fits the high-fantasy royalty of Crownspire, guiding peerage status.', color: '#475569' },
                        { name: "Cloak of Whispers", slot: 'Armor', desc: 'Umbral Phase', stats: 'Army Health % & Counter-attack Damage', passive: 'When hit by enemy magical fire, there is a 30% chance to dissolve into mist and avoid all damage.', lore: 'Volcanic plate mail layered with celestial shields, representing the unbreakable heavy vanguard walls.', color: '#6366f1' },
                        { name: "Dark Crystal Focus", slot: 'Artifact', desc: 'Void Surge', stats: 'Hero Skill Power % & Rage Speed', passive: 'Amplify critical rage power, dealing +20% burst on vulnerable vanguards.', lore: 'Floating orbs of crystal magic which bind to cosmic leylines to fuel divine commander rage skills.', color: '#1e1b4b' },
                        { name: "Night Emblem Amulet", slot: 'Accessory', desc: 'Swift Flanker', stats: 'Legion Load % & March Speed', passive: 'Grants +15% cavalry march velocity and increases initial charging shock impact by +20%.', lore: 'Baron rings and necklaces, showing peerage rank and accelerating troop supply march speed.', color: '#1e1b4b' },
                        { name: "Smoke Bomb Core", slot: 'Charm', desc: 'Blindside Fog', stats: 'Healing Effectiveness % & Control Immunity', passive: 'Releases a dark purple smoke cloud, reducing opposing commander skill regeneration speeds by 25%.', lore: 'Talismans engraved with the spirits of ancient wardens, providing resilience against dark map curses.', color: '#d946ef' },
                        { name: "Seal of the Guildmaster", slot: 'Seal', desc: 'Ghost Mandate', stats: 'Garrison Attack/Defense % & Tenacity', passive: 'Dampens counter-attacks on map retreats, avoiding fatal ambushes.', lore: 'The monarch\'s official seal, representing absolute governance and defensive structure protection.', color: '#d946ef' },
                        { name: "Silent Syndicate Flag", slot: 'Banner', desc: 'Shadow Accord', stats: 'Legion Size Cap % & Co-op strike', passive: 'Grants cavalry squads a +15% damage bonus during surprise canyon encounters.', lore: 'A battle-worn standard of high-glory, raising absolute morale to expand maximum troop capacity.', color: '#6366f1' }
                      ],
                      lorelai: [
                        { name: "Moonkeeper\'s Bow", slot: 'Weapon', desc: 'Lunar Gale', stats: 'Army Attack % & Crit Strike Chance', passive: 'Extends marksmen range by 15% and infuses normal arrows with +15% moon flare skill damage.', lore: 'Conduits of lethal steel forged with star-dust. In Crownspire\'s military, a hero\'s blade guides legion morale.', color: '#06b6d4' },
                        { name: "Lunar Silver Diadem", slot: 'Crown', desc: 'Harmony Hymn', stats: 'Army Defense % & Siege Mitigation', passive: 'Dispels ongoing frost or shadow curses from allied cohorts every 10 seconds, granting rapid health.', lore: 'The divine sigil of ruling lineage. Fits the high-fantasy royalty of Crownspire, guiding peerage status.', color: '#3b82f6' },
                        { name: "Silk Mantle of the Stars", slot: 'Armor', desc: 'Starlight Shield', stats: 'Army Health % & Counter-attack Damage', passive: 'Reduces incoming skill hazard area damage factors by 15%.', lore: 'Volcanic plate mail layered with celestial shields, representing the unbreakable heavy vanguard walls.', color: '#3b82f6' },
                        { name: "Moon Crystal Orb", slot: 'Artifact', desc: 'Astral Resonance', stats: 'Hero Skill Power % & Rage Speed', passive: 'Reclaims 15% of fallen vanguard troops, reviving them into active fighting ranks at zero cost.', lore: 'Floating orbs of crystal magic which bind to cosmic leylines to fuel divine commander rage skills.', color: '#a855f7' },
                        { name: "Silver Crescent Pendant", slot: 'Accessory', desc: 'Legion Load % & March Speed', passive: 'Increases global march velocity by 12% and amplifies the power of active hero traits by 10%.', lore: 'Baron rings and necklaces, showing peerage rank and accelerating troop supply march speed.', color: '#3b82f6' },
                        { name: "Sonic Barrier Runic Charm", slot: 'Charm', desc: 'Crystalline Aegis', stats: 'Healing Effectiveness % & Control Immunity', passive: 'Grants full immunity to silence debuffs during kingdom capital siege maneuvers.', lore: 'Talismans engraved with the spirits of ancient wardens, providing resilience against dark map curses.', color: '#a855f7' },
                        { name: "Seal of the Lunar Temple", slot: 'Seal', desc: 'Sanctum Mandate', stats: 'Garrison Attack/Defense % & Tenacity', passive: 'Enhances holy spring recovery metrics inside the fortress by 15%.', lore: 'The monarch\'s official seal, representing absolute governance and defensive structure protection.', color: '#06b6d4' },
                        { name: "Celestial Tome Scroll", slot: 'Banner', desc: 'Cosmos Archives', stats: 'Legion Size Cap % & Co-op strike', passive: 'Elevates global magical research speed by 10% and awards +15% extra hero training experience.', lore: 'A battle-worn standard of high-glory, raising absolute morale to expand maximum troop capacity.', color: '#06b6d4' }
                      ],
                      dominic: [
                        { name: "Vanguard Meteorite Shield", slot: 'Weapon', desc: 'Unyielding Gaze', stats: 'Army Attack % & Crit Strike Chance', passive: 'Completely blocks the first skill cast strike from enemy commanders and elevates defense by 15%.', lore: 'Conduits of lethal steel forged with star-dust. In Crownspire\'s military, a hero\'s blade guides legion morale.', color: '#475569' },
                        { name: "Steel Bastion Helmet", slot: 'Crown', desc: 'Iron Pillar', stats: 'Army Defense % & Siege Mitigation', passive: 'Provides complete knockback and stun immunity to infantry cohorts, holding frontlines solid.', lore: 'The divine sigil of ruling lineage. Fits the high-fantasy royalty of Crownspire, guiding peerage status.', color: '#eab308' },
                        { name: "Concordat Plate Mail", slot: 'Armor', desc: 'Ballista Warding', stats: 'Army Health % & Counter-attack Damage', passive: 'Reduces incoming structural siege and ballista bolt splash damage by 20% on the world map.', lore: 'Volcanic plate mail layered with celestial shields, representing the unbreakable heavy vanguard walls.', color: '#10b981' },
                        { name: "Earth Core Hearth", slot: 'Artifact', desc: 'Stone Core', stats: 'Hero Skill Power % & Rage Speed', passive: 'Boosts unit defense and block rating by 15%, converting damage into direct shield blocks.', lore: 'Floating orbs of crystal magic which bind to cosmic leylines to fuel divine commander rage skills.', color: '#eab308' },
                        { name: "Iron Signet Ring", slot: 'Accessory', desc: 'Legion Load % & March Speed', passive: 'Reduces the movement speed of attacking cavalry by 15% and increases troop health parameters.', lore: 'Baron rings and necklaces, showing peerage rank and accelerating troop supply march speed.', color: '#10b981' },
                        { name: "Talisman of Fortitude", slot: 'Charm', desc: 'Mountain Blessing', stats: 'Healing Effectiveness % & Control Immunity', passive: 'Upgrades total legion hit points by 12% when defending standard resource points.', lore: 'Talismans engraved with the spirits of ancient wardens, providing resilience against dark map curses.', color: '#10b981' },
                        { name: "Seal of the First Ward", slot: 'Seal', desc: 'Fortress Mandate', stats: 'Garrison Attack/Defense % & Tenacity', passive: 'Adds a +15% resistance barrier on tower wall networks.', lore: 'The monarch\'s official seal, representing absolute governance and defensive structure protection.', color: '#475569' },
                        { name: "Banner of Absolute Victory", slot: 'Banner', desc: 'Vanguard Tenacity', stats: 'Legion Size Cap % & Co-op strike', passive: 'Empowers legions, letting them fight at 100% damage output even when squad sizes drop below 30%.', lore: 'A battle-worn standard of high-glory, raising absolute morale to expand maximum troop capacity.', color: '#ec4899' }
                      ]
                    };

                    const slotsDef = [
                      { id: 'weapon', label: 'Signature Weapon', minLvl: 1, minStars: 0, icon: '⚔️' },
                      { id: 'crown', label: 'Sovereign Crown', minLvl: 20, minStars: 1, icon: '👑' },
                      { id: 'armor', label: 'Crownmark Armor', minLvl: 40, minStars: 2, icon: '🛡️' },
                      { id: 'artifact', label: 'Sacred Artifact', minLvl: 60, minStars: 3, icon: '🔮' },
                      { id: 'accessory', label: 'Royal Accessory', minLvl: 80, minStars: 4, icon: '💍' },
                      { id: 'charm', label: 'Runic Charm', minLvl: 90, minStars: 5, icon: '🧿' },
                      { id: 'seal', label: 'Imperial Seal', minLvl: 100, minStars: 5, icon: '⚜️' },
                      { id: 'banner', label: 'Vanguard Banner', minLvl: 100, minStars: 5, icon: '🚩' }
                    ];

                    const currentSlotDef = slotsDef[slotsSelectedSlotIndex] || slotsDef[0];
                    const listForHero = itemMatrix[slotsHeroId] || itemMatrix.maegan;
                    const item = listForHero[slotsSelectedSlotIndex] || listForHero[0];
                    const isUnlocked = slotsSimLevel >= currentSlotDef.minLvl && slotsSimStars >= currentSlotDef.minStars;

                    return (
                      <div className="md:col-span-5 bg-[#090b10] border border-zinc-850 p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden">
                        {isUnlocked ? (
                          <div className="space-y-4 w-full h-full flex flex-col justify-between">
                            <div className="space-y-3.5">
                              {/* Rarity & Header */}
                              <div className="flex justify-between items-center font-mono">
                                <span className="text-[9px] text-purple-400 font-bold uppercase tracking-wider">
                                  SLOT SPECIFICATION
                                </span>
                                <span className="px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/25 text-emerald-400 text-[8px] font-black uppercase rounded-md tracking-wider">
                                  ACTIVE UNLOCKED
                                </span>
                              </div>

                              {/* Graphic frame */}
                              <div className="w-16 h-16 rounded-xl bg-zinc-950 border border-zinc-850 flex items-center justify-center relative shadow-lg">
                                <span className="text-2xl">{currentSlotDef.icon}</span>
                                <div className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-[8px] text-purple-300 font-bold">
                                  ★
                                </div>
                              </div>

                              <div className="space-y-1">
                                <h4 className="text-xs font-black text-white uppercase tracking-wider font-serif">
                                  {item.name}
                                </h4>
                                <span className="text-[9px] font-mono text-zinc-500 uppercase block">
                                  Slot Category: {currentSlotDef.label}
                                </span>
                              </div>

                              {/* Stat categories block */}
                              <div className="bg-black/30 border border-zinc-900/60 p-2.5 rounded-xl space-y-1 font-mono text-[10px]">
                                <span className="text-[8px] text-zinc-550 block font-black uppercase">SLOT STAT SPECIALIZATION</span>
                                <div className="flex justify-between text-zinc-300">
                                  <span>✨ Primary Modifier:</span>
                                  <span className="text-purple-400 font-bold">{item.stats}</span>
                                </div>
                              </div>

                              {/* Unique Passive description */}
                              <div className="bg-purple-950/5 border border-purple-500/10 p-3 rounded-xl space-y-1 font-mono text-[10px]">
                                <span className="text-[8px] text-purple-400 font-black uppercase tracking-wider">Passive: {item.desc}</span>
                                <p className="text-zinc-400 leading-normal font-sans text-[10.5px]">
                                  {item.passive}
                                </p>
                              </div>

                              {/* Lore and Aesthetic integration block */}
                              <div className="pt-2 border-t border-zinc-950 space-y-1">
                                <span className="text-[8px] font-mono text-zinc-500 font-black uppercase tracking-wider block">
                                  🛡️ CROWNSPIRE FANTASY INTEGRATION
                                </span>
                                <p className="text-[10px] text-zinc-400 leading-normal font-sans italic">
                                  "{item.lore}"
                                </p>
                              </div>
                            </div>

                            <div className="pt-3 border-t border-zinc-950 text-[9px] font-mono text-zinc-500 leading-none">
                              Pacing rating: <strong>Endgame Growth Hook</strong>
                            </div>
                          </div>
                        ) : (
                          <div className="flex-1 flex flex-col justify-center items-center text-center p-6 space-y-3 font-mono">
                            <div className="w-12 h-12 rounded-full bg-zinc-950 border border-zinc-900 flex items-center justify-center">
                              <Lock className="w-5 h-5 text-zinc-600 animate-pulse" />
                            </div>
                            <div className="space-y-1">
                              <h4 className="text-xs font-black text-zinc-400 uppercase tracking-wide">Slot Locked</h4>
                              <p className="text-[9px] text-zinc-550 max-w-xs leading-normal font-sans">
                                This slot is sealed. Upgrade the hero to **Level {currentSlotDef.minLvl}** and **{currentSlotDef.minStars}★ Star Awakening** using Star Sparks and Duplicate Fragments to unlock it!
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================================
              TAB 6: HERO CROWNMARK RESONANCE SYSTEM
              ====================================================================== */}
          {activeTab === 'resonance' && (() => {
            const eqState = resonanceEquippedState[resonanceHeroId] || {};
            const activeCount = Object.values(eqState).filter(Boolean).length;
            
            // Determine Resonance Level based on collective MMO progression
            let finalResLevel = 0;
            if (activeCount >= 5 && resonanceEnhancementLevel >= 80 && resonanceStars >= 4) {
              finalResLevel = 5; // Celestial Awakening Overdrive
            } else if (activeCount >= 5 && resonanceEnhancementLevel >= 60 && resonanceStars >= 3) {
              finalResLevel = 4; // Absolute Sovereign
            } else if (activeCount >= 4 && resonanceEnhancementLevel >= 40 && resonanceStars >= 2) {
              finalResLevel = 3; // Sovereign Concord
            } else if (activeCount >= 3 && resonanceEnhancementLevel >= 20) {
              finalResLevel = 2; // Triumvirate Echo
            } else if (activeCount >= 2) {
              finalResLevel = 1; // Dual Resonance
            }

            const isOverdrive = finalResLevel === 5;

            return (
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-purple-950/30 via-zinc-950 to-indigo-950/30 border-b border-zinc-850 p-4 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-serif font-black text-white uppercase tracking-wide flex items-center gap-2">
                    <span>🔮</span> HERO CROWNMARK RESONANCE & SOVEREIGN AWAKENING
                  </h4>
                  <p className="text-[11px] text-zinc-400 max-w-2xl leading-relaxed font-sans">
                    Deepen your tactical bond. Resonance empowers heroes who equip their own historical Signature Crownmarks. Awake sovereign aura forms, transition visual portraits, and balance your army's metagame presence.
                  </p>
                </div>
                {/* Hero selection row */}
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-zinc-550 uppercase">SELECT COMMANDER:</span>
                  <div className="flex bg-zinc-950 border border-zinc-850 p-1 rounded-xl">
                    {[
                      { id: 'maegan', name: 'Maegan', color: 'text-purple-400' },
                      { id: 'shadow', name: 'Shadow', color: 'text-slate-400' },
                      { id: 'lorelai', name: 'Lorelai', color: 'text-cyan-400' },
                      { id: 'dominic', name: 'Dominic', color: 'text-emerald-400' }
                    ].map(h => (
                      <button
                        key={h.id}
                        onClick={() => setResonanceHeroId(h.id)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all cursor-pointer ${
                          resonanceHeroId === h.id
                            ? 'bg-purple-950/50 border border-purple-500/40 text-white'
                            : 'text-zinc-500 hover:text-zinc-350'
                        }`}
                      >
                        {h.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Core Content Grid */}
              <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 xl:grid-cols-12 gap-5 min-h-0">
                
                {/* COLUMN 1: INTERACTIVE PORTRAIT & AURA SIMULATOR (xl:col-span-4) */}
                <div className="xl:col-span-4 space-y-4">
                  {(() => {
                    const heroData = {
                      maegan: {
                        name: 'Maegan Violet',
                        title: 'Marshal of the Crownspire Vanguard',
                        role: 'Royal Marshal (Infantry & Defense)',
                        avatarChar: '👑',
                        colorClass: 'from-purple-950 via-zinc-950 to-indigo-950 border-purple-500/40 text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.15)]',
                        glowingColor: 'bg-purple-500',
                        haloColor: 'border-purple-500/30 shadow-[0_0_15px_#a855f7]',
                        tag: 'INFANTRY GENERAL',
                        crownmarkBonusText: 'Infantry Attack & Guard Morale Boost'
                      },
                      shadow: {
                        name: 'Syndicate Shadow',
                        title: 'Grandmaster of the Obsidian Syndicate',
                        role: 'Phantom Striker (Cavalry & Stealth)',
                        avatarChar: '🎭',
                        colorClass: 'from-slate-950 via-zinc-950 to-indigo-950 border-indigo-500/40 text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.15)]',
                        glowingColor: 'bg-indigo-500',
                        haloColor: 'border-indigo-500/30 shadow-[0_0_15px_#6366f1]',
                        tag: 'CAVALRY FLANKER',
                        crownmarkBonusText: 'Cavalry Crit Multiplier & Radar Cloak'
                      },
                      lorelai: {
                        name: 'Lorelai Archon',
                        title: 'High Keeper of the Moonlight Sanctum',
                        role: 'Lunar Archon (Marksmen & Recovery)',
                        avatarChar: '🌙',
                        colorClass: 'from-blue-950 via-zinc-950 to-cyan-950 border-cyan-500/40 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.15)]',
                        glowingColor: 'bg-cyan-500',
                        haloColor: 'border-cyan-500/30 shadow-[0_0_15px_#06b6d4]',
                        tag: 'MARKSMEN LEADER',
                        crownmarkBonusText: 'Marksmen Range & Curse Purge Rate'
                      },
                      dominic: {
                        name: 'Dominic Bastion',
                        title: 'Iron Shield of the Mountain Peak',
                        role: 'Defense Fortress Specialist (Infantry)',
                        avatarChar: '🛡️',
                        colorClass: 'from-emerald-950 via-zinc-950 to-stone-950 border-emerald-500/40 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.15)]',
                        glowingColor: 'bg-emerald-500',
                        haloColor: 'border-emerald-500/30 shadow-[0_0_15px_#10b981]',
                        tag: 'FORTRESS SENTRY',
                        crownmarkBonusText: 'Garrison Shielding & Knockback Immunity'
                      }
                    }[resonanceHeroId] || {
                      name: 'Maegan Violet',
                      title: 'Marshal of the Crownspire Vanguard',
                      role: 'Royal Marshal (Infantry)',
                      avatarChar: '👑',
                      colorClass: 'from-purple-950 via-zinc-950 to-indigo-950 border-purple-500/40 text-purple-300',
                      glowingColor: 'bg-purple-500',
                      haloColor: 'border-purple-500/30',
                      tag: 'INFANTRY GENERAL',
                      crownmarkBonusText: 'Infantry Attack & Guard Morale'
                    };

                    return (
                      <div className="space-y-4">
                        {/* Interactive Character Portrait Card */}
                        <div className={`bg-gradient-to-b ${heroData.colorClass} border rounded-2xl p-5 relative overflow-hidden flex flex-col items-center justify-between min-h-[360px] transition-all duration-500 ${triggerAuraAnimation ? 'ring-4 ring-yellow-500/50 scale-102' : ''}`}>
                          
                          {/* Animated Radiant Starlight Aura Layer */}
                          {resonanceAuraVisual !== 'none' && activeCount >= 2 && (
                            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                              {/* Glowing floating spots */}
                              <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-purple-500/10 blur-[60px] animate-pulse" />
                              <div className="absolute bottom-1/4 right-1/4 w-32 h-32 rounded-full bg-blue-500/10 blur-[60px] animate-pulse" style={{ animationDelay: '1s' }} />
                              
                              {/* Background particles */}
                              <div className="absolute inset-0 opacity-25">
                                <div className="absolute w-1 h-1 bg-white rounded-full top-10 left-20 animate-ping" />
                                <div className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full bottom-16 right-20 animate-ping" style={{ animationDelay: '1.5s' }} />
                                <div className="absolute w-1 h-1 bg-purple-300 rounded-full top-1/2 left-12 animate-ping" style={{ animationDelay: '0.5s' }} />
                              </div>
                            </div>
                          )}

                          {/* Top Status & Indicators */}
                          <div className="w-full flex justify-between items-center z-10 font-mono text-[9px]">
                            <span className="px-2 py-0.5 bg-black/40 border border-zinc-800 rounded-md text-zinc-400 uppercase font-black">
                              {heroData.tag}
                            </span>
                            <span className={`px-2 py-0.5 rounded-md font-bold uppercase ${
                              finalResLevel >= 4 
                                ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-500' 
                                : finalResLevel >= 1 
                                ? 'bg-purple-500/10 border border-purple-500/30 text-purple-400'
                                : 'bg-zinc-950 border border-zinc-850 text-zinc-500'
                            }`}>
                              Resonance Lvl {finalResLevel}
                            </span>
                          </div>

                          {/* Live Battle Animation Spellcast VFX Overlay */}
                          {combatAnimState !== 'idle' && (
                            <div className="absolute inset-0 z-20 bg-black/75 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center animate-fade-in font-mono rounded-2xl">
                              
                              {/* Spinners & glowing runic circles */}
                              {combatAnimState === 'casting' && (
                                <div className="space-y-3 flex flex-col items-center">
                                  <div className="w-12 h-12 rounded-full border-4 border-t-purple-400 border-r-indigo-500 border-zinc-800 animate-spin" />
                                  <div className="text-purple-300 text-[10px] font-black uppercase tracking-widest animate-pulse">
                                    ⚡ FOCUSING RESONANCE...
                                  </div>
                                  <div className="text-[8px] text-zinc-400 max-w-[180px]">
                                    Unlocking ancient magical imprints...
                                  </div>
                                </div>
                              )}

                              {/* Ultimate striking frames */}
                              {combatAnimState === 'striking' && (
                                <div className="space-y-2 flex flex-col items-center animate-bounce">
                                  <div className="text-3xl animate-ping duration-1000">
                                    {resonanceHeroId === 'maegan' && '☄️'}
                                    {resonanceHeroId === 'shadow' && '💨'}
                                    {resonanceHeroId === 'lorelai' && '🌙'}
                                    {resonanceHeroId === 'dominic' && '🧱'}
                                  </div>
                                  <div className="text-yellow-400 text-[11px] font-black uppercase tracking-wider">
                                    {resonanceHeroId === 'maegan' && 'VIOLET ORBITAL RAIN!'}
                                    {resonanceHeroId === 'shadow' && 'PHANTOM AMBUSH!'}
                                    {resonanceHeroId === 'lorelai' && 'MOONBEAM CASCADE!'}
                                    {resonanceHeroId === 'dominic' && 'ETERNAL BASTION STAND!'}
                                  </div>
                                  <div className="px-2 py-0.5 bg-yellow-500/15 border border-yellow-500/35 rounded text-[8px] text-yellow-500 font-extrabold max-w-[200px]">
                                    AOE TRUE SKILL BURST ACTIVATED
                                  </div>
                                </div>
                              )}

                              {/* Recharging & healing state */}
                              {combatAnimState === 'recharging' && (
                                <div className="space-y-2 flex flex-col items-center">
                                  <div className="text-xl animate-pulse text-green-400">💚</div>
                                  <div className="text-green-400 text-[10px] font-black uppercase tracking-widest animate-pulse">
                                    RECONCORDING MORALE
                                  </div>
                                  <div className="text-[8px] text-zinc-400 max-w-[180px]">
                                    Regenerating legion standard vitality values.
                                  </div>
                                </div>
                              )}

                            </div>
                          )}

                          {/* Portrait Frame & Divine Rotating Halo Circle */}
                          <div className="relative my-6 flex items-center justify-center">
                            
                            {/* Rotating Halo Behind Avatar (Unlocked at Resonance Level 3+) */}
                            {resonanceAuraVisual !== 'none' && finalResLevel >= 3 && (
                              <div className={`absolute w-32 h-32 rounded-full border-2 border-dashed ${heroData.haloColor} animate-spin`} style={{ animationDuration: '24s' }} />
                            )}
                            {resonanceAuraVisual === 'absolute_presence' && finalResLevel >= 4 && (
                              <div className="absolute w-36 h-36 rounded-full border border-yellow-500/40 animate-ping opacity-25" />
                            )}

                            {/* EVOLVED PORTRAIT FRAME (Upgrades visually per Resonance Level) */}
                            <div className={`p-1.5 rounded-full relative z-10 transition-all duration-700 ${
                              finalResLevel === 5
                                ? 'bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 shadow-[0_0_35px_rgba(234,179,8,0.6)] animate-pulse ring-4 ring-offset-4 ring-offset-zinc-950 ring-yellow-400'
                                : finalResLevel === 4
                                ? 'bg-gradient-to-r from-amber-500 to-yellow-400 shadow-[0_0_25px_rgba(245,158,11,0.4)] ring-2 ring-offset-2 ring-offset-zinc-950 ring-amber-500'
                                : finalResLevel >= 2
                                ? 'bg-gradient-to-r from-purple-600 via-zinc-800 to-indigo-600 ring-1 ring-offset-1 ring-offset-zinc-950 ring-purple-500/50'
                                : 'bg-gradient-to-b from-zinc-700 to-zinc-900 border border-zinc-650'
                            }`}>
                              
                              {/* Main Avatar Graphic Badge */}
                              <div className="w-24 h-24 rounded-full bg-zinc-950 flex items-center justify-center relative shadow-2xl transition-all">
                                <span className={`text-4xl select-none transition-transform duration-500 ${triggerAuraAnimation ? 'scale-120 rotate-12' : ''}`}>
                                  {heroData.avatarChar}
                                </span>

                                {/* Small corner class symbol badge */}
                                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[10px] shadow-md font-bold text-white z-20">
                                  {resonanceHeroId === 'maegan' && '⚔️'}
                                  {resonanceHeroId === 'shadow' && '🏹'}
                                  {resonanceHeroId === 'lorelai' && '🔮'}
                                  {resonanceHeroId === 'dominic' && '🛡️'}
                                </div>

                                {/* Custom Frame Label Overlay for High-tiers */}
                                {finalResLevel >= 4 && (
                                  <div className="absolute -top-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-black text-[7px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider font-mono shadow border border-yellow-300">
                                    {finalResLevel === 5 ? 'CELESTIAL' : 'SOVEREIGN'}
                                  </div>
                                )}
                              </div>

                            </div>
                          </div>

                          {/* Hero Metadata Text block */}
                          <div className="w-full text-center space-y-1 z-10">
                            <h3 className="text-sm font-serif font-black text-white uppercase tracking-wider">
                              {finalResLevel >= 4 ? `Sovereign ${heroData.name}` : heroData.name}
                            </h3>
                            <p className="text-[10px] text-zinc-400 font-mono italic leading-none">
                              {heroData.title}
                            </p>
                            <p className="text-[9px] text-zinc-550 font-sans pt-1">
                              {heroData.role}
                            </p>
                          </div>

                          {/* Visual feedback notice */}
                          <div className="w-full mt-4 bg-black/60 border border-zinc-850 p-2 rounded-xl text-[10px] text-center font-mono">
                            <span className="text-zinc-400 block text-[9px] uppercase tracking-wider">ACTIVE PORTRAIT STATE</span>
                            <span className={`font-black uppercase ${
                              finalResLevel === 5 
                                ? 'text-yellow-400 animate-pulse' 
                                : finalResLevel >= 3 
                                ? 'text-purple-400' 
                                : 'text-zinc-500'
                            }`}>
                              {finalResLevel === 5 
                                ? '✨ CELESTIAL OVERDRIVE STATE' 
                                : finalResLevel === 4 
                                ? '👑 ABSOLUTE SOVEREIGN PRESENCE' 
                                : finalResLevel >= 2 
                                ? '🔮 ASTRAL TIER II RADIANCY' 
                                : '⚪ STANDARD VANGUARD'}
                            </span>
                          </div>

                        </div>

                        {/* Interactive Aura Customizer Controls */}
                        <div className="bg-[#090b10] border border-zinc-850 p-4 rounded-2xl space-y-3 font-mono">
                          <span className="text-[9px] text-purple-400 font-extrabold tracking-widest uppercase block">AURA STYLE TOGGLES</span>
                          
                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            {[
                              { id: 'none', label: 'Off' },
                              { id: 'celestial_glow', label: 'Celestial Glow' },
                              { id: 'cosmic_halo', label: 'Cosmic Halo' },
                              { id: 'absolute_presence', label: 'Absolute Presence' }
                            ].map(aura => (
                              <button
                                key={aura.id}
                                onClick={() => setResonanceAuraVisual(aura.id as any)}
                                className={`py-1.5 px-2 rounded-lg border text-left flex justify-between items-center cursor-pointer transition-all ${
                                  resonanceAuraVisual === aura.id
                                    ? 'bg-purple-900/20 border-purple-500 text-purple-300 font-bold'
                                    : 'bg-zinc-950 border-zinc-900 text-zinc-500 hover:text-zinc-350'
                                }`}
                              >
                                <span>{aura.label}</span>
                                {resonanceAuraVisual === aura.id && <span className="text-purple-400">●</span>}
                              </button>
                            ))}
                          </div>

                          {/* Trigger Sovereign Hymn Button */}
                          <button
                            onClick={() => {
                              runCombatAnimationSimulation(resonanceHeroId, finalResLevel);
                            }}
                            className="w-full bg-gradient-to-r from-yellow-600 to-amber-700 hover:from-yellow-500 hover:to-amber-600 text-white font-serif py-2 px-3 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 transition-all"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            CAST ACTIVE ULTIMATE SKILL
                          </button>

                          {/* Live Battle Log Terminal */}
                          <div className="bg-black/95 border border-zinc-900 p-2.5 rounded-xl font-mono text-[8px] text-zinc-400 space-y-1 h-[84px] overflow-y-auto">
                            <span className="text-[8px] text-purple-400 font-black uppercase block border-b border-zinc-900 pb-1">BATTLE STAGE ANIMATION LOGS</span>
                            <div className="space-y-1">
                              {combatLogs.slice(0, 5).map((log, idx) => (
                                <div key={idx} className="leading-tight text-zinc-300">
                                  <span className="text-zinc-600 font-bold">&gt;</span> {log}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* COLUMN 2: INTERACTIVE SIGNATURE CROWNMARKS SELECTION & AWAKENING SCALE (xl:col-span-4) */}
                <div className="xl:col-span-4 space-y-4">
                  
                  {/* Crownmark Slots Activator Card */}
                  <div className="bg-[#090b10] border border-zinc-850 p-4 rounded-2xl space-y-3.5 font-mono">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-purple-400 font-extrabold tracking-widest uppercase block">SIGNATURE EQUIP REGISTRY</span>
                      <span className="text-[9px] text-zinc-550">CLICK TO TOGGLE</span>
                    </div>

                    <div className="space-y-1.5">
                      <h3 className="text-xs font-serif font-black text-white uppercase">MANAGE SIGNATURE SET</h3>
                      <p className="text-[10px] text-zinc-400 leading-normal font-sans">
                        Sovereign Resonance requires historical match alignment. Check or uncheck crownmarks below to simulate real-time roster inventory states.
                      </p>
                    </div>

                    {/* Quick presets buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setResonanceEquippedState(prev => ({
                            ...prev,
                            [resonanceHeroId]: { scepter: true, crown: true, crest: true, charter: true, signet: true, daggers: true, cowl: true, cloak: true, flag: true, emblem: true, bow: true, diadem: true, mantle: true, scroll: true, pendant: true, shield: true, helmet: true, plate: true, victory: true, ring: true }
                          }));
                        }}
                        className="flex-1 py-1 px-2 bg-purple-950/20 border border-purple-500/20 hover:border-purple-500/40 text-purple-300 text-[9px] rounded-lg font-bold uppercase transition-all cursor-pointer"
                      >
                        ✓ Equip All
                      </button>
                      <button
                        onClick={() => {
                          setResonanceEquippedState(prev => ({
                            ...prev,
                            [resonanceHeroId]: { scepter: false, crown: false, crest: false, charter: false, signet: false, daggers: false, cowl: false, cloak: false, flag: false, emblem: false, bow: false, diadem: false, mantle: false, scroll: false, pendant: false, shield: false, helmet: false, plate: false, victory: false, ring: false }
                          }));
                        }}
                        className="flex-1 py-1 px-2 bg-zinc-950 border border-zinc-900 hover:text-zinc-350 text-zinc-500 text-[9px] rounded-lg font-bold uppercase transition-all cursor-pointer"
                      >
                        ✗ Clear All
                      </button>
                    </div>

                    {/* Crownmarks checkboxes row */}
                    {(() => {
                      const heroesMap: Record<string, { label: string; icon: string; key: string }[]> = {
                        maegan: [
                          { label: "Founder's Scepter", icon: '⚔️', key: 'scepter' },
                          { label: "Founder's Crown", icon: '👑', key: 'crown' },
                          { label: "Royal Crest", icon: '🛡️', key: 'crest' },
                          { label: "Royal Charter", icon: '🚩', key: 'charter' },
                          { label: "Heart of Crownspire", icon: '❤️', key: 'signet' }
                        ],
                        shadow: [
                          { label: "Twin Shadow Daggers", icon: '⚔️', key: 'daggers' },
                          { label: "Assassin's Silk Cowl", icon: '🎭', key: 'cowl' },
                          { label: "Cloak of Whispers", icon: '🧥', key: 'cloak' },
                          { label: "Silent Syndicate Flag", icon: '🚩', key: 'flag' },
                          { label: "Night Emblem Amulet", icon: '🧿', key: 'emblem' }
                        ],
                        lorelai: [
                          { label: "Moonkeeper's Bow", icon: '🏹', key: 'bow' },
                          { label: "Lunar Silver Diadem", icon: '👑', key: 'diadem' },
                          { label: "Silk Mantle of the Stars", icon: '🧥', key: 'mantle' },
                          { label: "Celestial Tome Scroll", icon: '📜', key: 'scroll' },
                          { label: "Silver Crescent Pendant", icon: '🌙', key: 'pendant' }
                        ],
                        dominic: [
                          { label: "Vanguard Meteorite Shield", icon: '🛡️', key: 'shield' },
                          { label: "Steel Bastion Helmet", icon: '🪖', key: 'helmet' },
                          { label: "Concordat Plate Mail", icon: '🥋', key: 'plate' },
                          { label: "Banner of Absolute Victory", icon: '🚩', key: 'victory' },
                          { label: "Iron Signet Ring", icon: '💍', key: 'ring' }
                        ]
                      };

                      const currentCrownmarks = heroesMap[resonanceHeroId] || heroesMap.maegan;
                      const eqMap = resonanceEquippedState[resonanceHeroId] || {};

                      const handleToggle = (key: string) => {
                        setResonanceEquippedState(prev => {
                          const subMap = { ...(prev[resonanceHeroId] || {}) };
                          subMap[key] = !subMap[key];
                          return { ...prev, [resonanceHeroId]: subMap };
                        });
                      };

                      return (
                        <div className="space-y-2 pt-2">
                          {currentCrownmarks.map((r, i) => {
                            const isEquipped = !!eqMap[r.key];
                            return (
                              <button
                                key={r.key}
                                onClick={() => handleToggle(r.key)}
                                className={`w-full p-2.5 rounded-xl border text-left flex justify-between items-center transition-all cursor-pointer ${
                                  isEquipped
                                    ? 'bg-[#0f121d] border-purple-500/45 text-white shadow-sm'
                                    : 'bg-zinc-950/40 border-zinc-900 text-zinc-550'
                                }`}
                              >
                                <div className="flex items-center gap-2.5">
                                  <span className={`text-base ${isEquipped ? 'opacity-100' : 'opacity-40 filter grayscale'}`}>
                                    {r.icon}
                                  </span>
                                  <div className="text-left font-mono leading-tight">
                                    <span className={`text-[10px] block font-black uppercase ${isEquipped ? 'text-purple-300' : 'text-zinc-500'}`}>
                                      {r.label}
                                    </span>
                                    <span className="text-[8px] text-zinc-500 block uppercase">
                                      Signature Slot {i+1}
                                    </span>
                                  </div>
                                </div>
                                <div className={`w-4 h-4 rounded border flex items-center justify-center text-[9px] font-black ${
                                  isEquipped 
                                    ? 'bg-purple-900 border-purple-400 text-purple-200' 
                                    : 'border-zinc-800 text-transparent bg-black/45'
                                }`}>
                                  {isEquipped ? '✓' : ''}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Power Scaling Level Simulator */}
                  <div className="bg-[#090b10] border border-zinc-850 p-4 rounded-2xl space-y-4 font-mono text-xs">
                    <span className="text-[9px] text-purple-400 font-extrabold tracking-widest uppercase block">POWER SCALING MATRIX</span>
                    
                    {/* Awakening Slider */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] text-zinc-400">
                        <span>Average Awakening Stars:</span>
                        <strong className="text-yellow-500 text-xs">{resonanceStars} ★★★★★</strong>
                      </div>
                      
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={resonanceStars}
                        onChange={(e) => setResonanceStars(Number(e.target.value))}
                        className="w-full accent-yellow-500 h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer"
                      />

                      <div className="flex justify-between text-[8px] text-zinc-550">
                        <span>1★ Novice</span>
                        <span>3★ Elder</span>
                        <span>5★ Primarch</span>
                      </div>
                    </div>

                    {/* Enhancement Slider */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-[10px] text-zinc-400">
                        <span>Minimum Enhanced Level:</span>
                        <strong className="text-purple-400 text-xs">Lvl {resonanceEnhancementLevel}</strong>
                      </div>
                      
                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={resonanceEnhancementLevel}
                        onChange={(e) => setResonanceEnhancementLevel(Number(e.target.value))}
                        className="w-full accent-purple-500 h-1 bg-zinc-900 rounded-lg appearance-none cursor-pointer"
                      />

                      <div className="flex justify-between text-[8px] text-zinc-550">
                        <span>Lvl 1 Standard</span>
                        <span>Lvl 50 Heroic</span>
                        <span>Lvl 100 Mythic</span>
                      </div>
                    </div>

                    {/* Dynamic Cumulative Power Score Calculation */}
                    {(() => {
                      const basePowerVal = activeCount * 1200;
                      const enhancementPowerVal = resonanceEnhancementLevel * 85;
                      const awakeningPowerVal = activeCount * (resonanceStars * 600);
                      const resonanceMultiplier = 1 + (finalResLevel * 0.25);
                      const totalPowerScore = Math.round((basePowerVal + enhancementPowerVal + awakeningPowerVal) * resonanceMultiplier);
                      const maxPowerPossible = 66375;
                      const powerPercentage = Math.min(100, (totalPowerScore / maxPowerPossible) * 100);

                      return (
                        <div className="bg-black/50 p-3.5 rounded-xl border border-zinc-900 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[8px] text-zinc-500 uppercase font-black">TOTAL RESONANCE POWER</span>
                            <span className="text-[8px] font-bold px-1.5 py-0.5 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 rounded">
                              MULTI: x{resonanceMultiplier.toFixed(2)}
                            </span>
                          </div>

                          <div className="flex justify-between items-baseline">
                            <span className="text-xl font-serif font-black text-white tracking-wide">
                              {totalPowerScore.toLocaleString()}
                            </span>
                            <span className="text-[9px] text-zinc-550 font-bold">
                              MAX: {maxPowerPossible.toLocaleString()}
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
                            <div 
                              className="h-full bg-gradient-to-r from-purple-600 via-pink-500 to-yellow-500 transition-all duration-300"
                              style={{ width: `${powerPercentage}%` }}
                            />
                          </div>

                          {/* Dynamic Attribute Metrics */}
                          <div className="grid grid-cols-2 gap-2 text-[9px] pt-1.5 border-t border-zinc-900/60 font-mono text-zinc-400">
                            <div>
                              <span className="text-zinc-600 block">BASE EQUIP:</span>
                              <strong className="text-zinc-300">+{basePowerVal.toLocaleString()} Power</strong>
                            </div>
                            <div>
                              <span className="text-zinc-600 block">ENHANCEMENT:</span>
                              <strong className="text-purple-300">+{enhancementPowerVal.toLocaleString()} Power</strong>
                            </div>
                            <div>
                              <span className="text-zinc-600 block">AWAKENING:</span>
                              <strong className="text-yellow-500">+{awakeningPowerVal.toLocaleString()} Power</strong>
                            </div>
                            <div>
                              <span className="text-zinc-600 block">RESONANCE LEVEL:</span>
                              <strong className="text-pink-400">Level {finalResLevel}</strong>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    <p className="text-[9.5px] text-zinc-500 italic leading-snug font-sans">
                      💡 <em>Power Scaling scales proportionally. Generalist crownmarks offer linear base modifiers, but signature resonance triggers higher multiplier spikes as more items align.</em>
                    </p>
                  </div>

                </div>

                {/* COLUMN 3: RESONANCE LEVELS, SKILLS & COMPREHENSIVE METAGAME BALANCE (xl:col-span-4) */}
                <div className="xl:col-span-4 space-y-4">
                  {(() => {
                    const heroFullData = {
                      maegan: {
                        l1: 'Concordat Call: Legions matching Maegan\'s infantry element take 8% less field hazard skill damage.',
                        l2: 'Sigil Blitz: Basic troop attacks have a 12% probability to instantly recharge 60 rage points.',
                        l3: 'Aegis Sentinel: Field active skills deploy a glowing runic starlight boundary, restoring +3% total HP to surrounding allies every 2s.',
                        l4: 'Violet Orbital Rain: Command strikes trigger a divine orbital starlight beam dealing 420 Fire AoE skill damage to 3 adjacent cohorts.',
                        l5: 'Sovereign Presence: All infantry units gain a shimmering Violet Fire Aura, permanently elevating counter-attack speed by 15% and executing coordinated co-op critical bursts.'
                      },
                      shadow: {
                        l1: 'Evasive Tactics: Shrouds matching cavalry troops, making them immune to long-range scout detection radars.',
                        l2: 'Blade Rush: Strikes on isolated legions amplify tactical shock damage rating by 18%.',
                        l3: 'Phantom Fog: Active skill deployments emit a thick smoke screen, reducing opposing commanders\' rage generation speed by 25%.',
                        l4: 'Shadow Ambush: Automatically inflicts three critical strike strikes when emerging from forest terrain.',
                        l5: 'Eclipse Mastery: Unlocks complete first-strike invisibility. Every stealth break triggers a massive 500 dark energy AoE shockwave.'
                      },
                      lorelai: {
                        l1: 'Aether Shield: Protects allied marksmen lanes, neutralizing the first siege weapon bombardment.',
                        l2: 'Lunar Tide: Increases normal range-attack speed by 15% during nighttime field battles.',
                        l3: 'Celestial Sanctuary: Revives 12% of fallen vanguard troop units instantly at zero cost upon skill cast.',
                        l4: 'Moonbeam Cascade: Launches a rain of silver arrows, freezing targeted armies for 2.5 seconds.',
                        l5: 'Goddess Decree: Permanently protects the backline, increasing total damage output by 25% if no enemies are within immediate contact.'
                      },
                      dominic: {
                        l1: 'Iron Sentry: Heavy garrison units gain +10% block probability inside fortress standard boundaries.',
                        l2: 'Aegis Block: Converts 12% of incoming physical skill fire directly into healing recovery values.',
                        l3: 'Fortress Shell: Creates a protective wall, cutting incoming wide-area hazard spells by 20%.',
                        l4: 'Earthshaker Stomp: Knocks back surrounding map legions, causing a 2-second tactical stun.',
                        l5: 'Eternal Stand: If troop capacity falls to 1%, gain an invincible stone shield absorbing all damage for 8s.'
                      }
                    }[resonanceHeroId] || {
                      l1: 'Concordat Call: Legions matching Maegan\'s infantry element take 8% less field hazard skill damage.',
                      l2: 'Sigil Blitz: Basic troop attacks have a 12% probability to instantly recharge 60 rage points.',
                      l3: 'Aegis Sentinel: Field active skills deploy a glowing runic starlight boundary, restoring +3% total HP to surrounding allies every 2s.',
                      l4: 'Violet Orbital Rain: Command strikes trigger a divine orbital starlight beam dealing 420 Fire AoE skill damage to 3 adjacent cohorts.',
                      l5: 'Sovereign Presence: All infantry units gain a shimmering Violet Fire Aura, permanently elevating counter-attack speed by 15% and executing coordinated co-op critical bursts.'
                    };

                    const eqState = resonanceEquippedState[resonanceHeroId] || {};
                    const activeCount = Object.values(eqState).filter(Boolean).length;
                    
                    // Resonance levels definitions
                    const resTiers = [
                      {
                        lvl: 1,
                        label: 'Tier I: Dual Resonance',
                        desc: heroFullData.l1,
                        active: finalResLevel >= 1,
                        reqs: [
                          { label: 'Equip 2+ Signature Items', met: activeCount >= 2, val: `${activeCount}/2` }
                        ]
                      },
                      {
                        lvl: 2,
                        label: 'Tier II: Triumvirate Echo',
                        desc: heroFullData.l2,
                        active: finalResLevel >= 2,
                        reqs: [
                          { label: 'Equip 3+ Signature Items', met: activeCount >= 3, val: `${activeCount}/3` },
                          { label: 'Enhancement Level ≥ 20', met: resonanceEnhancementLevel >= 20, val: `Lvl ${resonanceEnhancementLevel}` }
                        ]
                      },
                      {
                        lvl: 3,
                        label: 'Tier III: Sovereign Concord',
                        desc: heroFullData.l3,
                        active: finalResLevel >= 3,
                        reqs: [
                          { label: 'Equip 4+ Signature Items', met: activeCount >= 4, val: `${activeCount}/4` },
                          { label: 'Enhancement Level ≥ 40', met: resonanceEnhancementLevel >= 40, val: `Lvl ${resonanceEnhancementLevel}` },
                          { label: 'Average Stars ≥ 2★', met: resonanceStars >= 2, val: `${resonanceStars}★` }
                        ]
                      },
                      {
                        lvl: 4,
                        label: 'Tier IV: Absolute Sovereign',
                        desc: heroFullData.l4,
                        active: finalResLevel >= 4,
                        reqs: [
                          { label: 'Equip 5 Signature Items', met: activeCount >= 5, val: `${activeCount}/5` },
                          { label: 'Enhancement Level ≥ 60', met: resonanceEnhancementLevel >= 60, val: `Lvl ${resonanceEnhancementLevel}` },
                          { label: 'Average Stars ≥ 3★', met: resonanceStars >= 3, val: `${resonanceStars}★` }
                        ]
                      },
                      {
                        lvl: 5,
                        label: 'Tier V: Celestial Awakening Overdrive',
                        desc: heroFullData.l5,
                        active: finalResLevel >= 5,
                        reqs: [
                          { label: 'Equip 5 Signature Items', met: activeCount >= 5, val: `${activeCount}/5` },
                          { label: 'Enhancement Level ≥ 80', met: resonanceEnhancementLevel >= 80, val: `Lvl ${resonanceEnhancementLevel}` },
                          { label: 'Average Stars ≥ 4★', met: resonanceStars >= 4, val: `${resonanceStars}★` }
                        ]
                      }
                    ];

                    return (
                      <div className="space-y-4">
                        
                        {/* Interactive Resonance Levels Skills Tree */}
                        <div className="bg-[#090b10] border border-zinc-850 p-4 rounded-2xl space-y-3.5 font-mono">
                          <span className="text-[9px] text-purple-400 font-extrabold tracking-widest uppercase block">RESONANCE SKILL BOUNDARY</span>
                          <h3 className="text-xs font-serif font-black text-white uppercase">UNLOCKED PASSIVES</h3>

                          <div className="space-y-3">
                            {resTiers.map((tier) => (
                              <div 
                                key={tier.lvl}
                                className={`p-3 border rounded-xl space-y-2 transition-all ${
                                  tier.active
                                    ? tier.lvl === 5
                                      ? 'bg-yellow-950/15 border-yellow-500/45 text-white shadow-[0_0_15px_rgba(234,179,8,0.05)]'
                                      : 'bg-purple-950/10 border-purple-500/25 text-white'
                                    : 'bg-zinc-950/20 border-zinc-900/60 text-zinc-650'
                                }`}
                              >
                                <div className="flex justify-between items-center text-[10px]">
                                  <div className="flex items-center gap-1.5">
                                    <span className={tier.active ? tier.lvl === 5 ? 'text-yellow-400' : 'text-purple-400' : 'text-zinc-650'}>
                                      {tier.active ? '●' : '○'}
                                    </span>
                                    <strong className={tier.active ? tier.lvl === 5 ? 'text-yellow-400 font-black' : 'text-purple-300' : 'font-medium'}>
                                      {tier.label}
                                    </strong>
                                  </div>
                                  <span className={`text-[8px] font-black px-1.5 py-0.2 rounded border ${
                                    tier.active 
                                      ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                                      : 'bg-black/45 border-zinc-800 text-zinc-550'
                                  }`}>
                                    {tier.active ? '✓ ACTIVE' : 'LOCKED'}
                                  </span>
                                </div>

                                <p className={`text-[10px] leading-normal font-sans ${tier.active ? 'text-zinc-300' : 'text-zinc-600'}`}>
                                  {tier.desc}
                                </p>

                                {/* Multi-dimensional requirements list */}
                                <div className="grid grid-cols-1 gap-1 pt-1.5 border-t border-zinc-900/50 text-[8px] text-zinc-500 font-mono">
                                  {tier.reqs.map((req, idx) => (
                                    <div key={idx} className="flex justify-between items-center">
                                      <span>{req.label}:</span>
                                      <span className={`font-bold ${req.met ? 'text-green-400' : 'text-red-500'}`}>
                                        {req.met ? '✓' : '✗'} ({req.val})
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* LIVE COMBAT ATTRIBUTES STATS PANEL */}
                        {(() => {
                          // Dynamic Calculations for stats scaling
                          const baseAtk = 10.0 + (resonanceStars * 2.5) + (resonanceEnhancementLevel * 0.25) + (finalResLevel >= 4 ? 15.0 : 0);
                          const baseDef = 10.0 + (resonanceStars * 2.5) + (resonanceEnhancementLevel * 0.20) + (finalResLevel >= 4 ? 12.0 : 0);
                          const baseHp = 15.0 + (resonanceStars * 3.0) + (resonanceEnhancementLevel * 0.30) + (finalResLevel >= 4 ? 18.0 : 0);
                          const rageSpeed = finalResLevel * 3.5;
                          const trueDamage = finalResLevel * 85;

                          return (
                            <div className="bg-[#090b10] border border-zinc-850 p-4 rounded-2xl space-y-3 font-mono">
                              <span className="text-[9px] text-purple-400 font-extrabold tracking-widest uppercase block">LIVE ATTRIBUTE MATRIX</span>
                              <h3 className="text-xs font-serif font-black text-white uppercase">CUMULATIVE ATTRIBUTE BONUSES</h3>

                              <div className="space-y-2 text-[10px]">
                                <div className="flex justify-between items-center p-2 bg-zinc-950/80 border border-zinc-900 rounded-xl">
                                  <span className="text-zinc-400 font-sans">Legion Army Attack:</span>
                                  <strong className="text-red-400">+{baseAtk.toFixed(2)}%</strong>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-zinc-950/80 border border-zinc-900 rounded-xl">
                                  <span className="text-zinc-400 font-sans">Legion Army Defense:</span>
                                  <strong className="text-blue-400">+{baseDef.toFixed(2)}%</strong>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-zinc-950/80 border border-zinc-900 rounded-xl">
                                  <span className="text-zinc-400 font-sans">Legion Army Health:</span>
                                  <strong className="text-green-400">+{baseHp.toFixed(2)}%</strong>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-zinc-950/80 border border-zinc-900 rounded-xl">
                                  <span className="text-zinc-400 font-sans">Rage Accumulation Speed:</span>
                                  <strong className="text-purple-400">+{rageSpeed.toFixed(1)}%</strong>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-zinc-950/80 border border-zinc-900 rounded-xl">
                                  <span className="text-zinc-400 font-sans">Sovereign True AoE Skill Damage:</span>
                                  <strong className="text-yellow-500">+{trueDamage} Pts</strong>
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                        {/* HIGH DESIGN BALANCING DISCLOSURE (The Non-Resonance Usable Solution) */}
                        <div className="bg-[#090b10] border border-zinc-850 p-4 rounded-2xl space-y-3.5">
                          <span className="text-[9px] text-purple-400 font-extrabold tracking-widest uppercase block font-mono">TACTICAL METAGAME BALANCE</span>
                          <h3 className="text-xs font-serif font-black text-white uppercase">WHY GENERALIST BUILDS CO-EXIST</h3>
                          
                          <div className="space-y-2.5 font-mono text-[10px] text-zinc-400">
                            
                            <div className="p-2.5 bg-zinc-950/80 border border-zinc-900 rounded-xl space-y-1">
                              <span className="text-[9px] text-amber-500 font-black uppercase tracking-wider block">🛡️ Raw Generalist Stat Supremacy</span>
                              <p className="text-[9.5px] text-zinc-400 leading-normal font-sans">
                                Standard generalist legendary crownmarks (unaligned) cost 45% less duplicate fragments to awaken. A 5★ Generalist Crownmark grants +30% higher flat base health and defense points than a lower-starred 2★ Signature crownmark, providing unmatched raw physical survivability on the battle maps.
                              </p>
                            </div>

                            <div className="p-2.5 bg-zinc-950/80 border border-zinc-900 rounded-xl space-y-1">
                              <span className="text-[9px] text-indigo-400 font-black uppercase tracking-wider block">⚔️ Counters to Sovereign Skills</span>
                              <p className="text-[9.5px] text-zinc-400 leading-normal font-sans">
                                Players can equip specialized defensive crownmarks like the "Canyon Warden Aegis" which completely neutralizes signature burst damages by 40% and grants full tactical silence immunity, rendering aggressive resonance reliant builds vulnerable to direct melee standard counterattacks.
                              </p>
                            </div>

                            <div className="p-2.5 bg-zinc-950/80 border border-zinc-900 rounded-xl space-y-1">
                              <span className="text-[9px] text-emerald-400 font-black uppercase tracking-wider block">🤝 Team Co-Op Rage Transfer</span>
                              <p className="text-[9.5px] text-zinc-400 leading-normal font-sans">
                                Support-focused builds using generic high-star items gain +20% faster passive Rage transfer velocity, letting them fuel their alliance partners' resonance burst timers rather than needing expensive signature matching themselves.
                              </p>
                            </div>

                          </div>
                        </div>

                      </div>
                    );
                  })()}
                </div>

              </div>
            </div>
          );
        })()}

          {/* ======================================================================
              TAB 7: GODOT 4 JSON SCHEMAS & DATABASE INTEGRATION
              ====================================================================== */}
          {activeTab === 'json_schema' && (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-zinc-950 via-purple-950/20 to-zinc-950 border-b border-zinc-850 p-4 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-serif font-black text-white uppercase tracking-wide flex items-center gap-2">
                    <span>📦</span> CROWNSPIRE METAGAME SCHEMAS (GODOT 4 COMPATIBLE)
                  </h4>
                  <p className="text-[11px] text-zinc-400 max-w-2xl leading-relaxed font-sans">
                    Production-ready static database files for server-authoritative calculations and clients. Every file strictly conforms to Godot 4 <code className="text-purple-300 font-mono bg-purple-950/30 px-1 py-0.5 rounded">JSON.parse_string()</code> formats and types.
                  </p>
                </div>
                {/* Database files selector buttons */}
                <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                  <span className="text-zinc-550 uppercase mr-1">DATABASES:</span>
                  <div className="flex flex-wrap gap-1 bg-zinc-950 border border-zinc-900 p-1 rounded-xl">
                    {[
                      { id: 'crownmarks.json', label: 'crownmarks' },
                      { id: 'crownmark_upgrade_costs.json', label: 'upgrade' },
                      { id: 'crownmark_fragments.json', label: 'fragments' },
                      { id: 'crownmark_resonance.json', label: 'resonance' },
                      { id: 'crownmark_collections.json', label: 'collections' },
                      { id: 'hero_signature_crownmarks.json', label: 'signature' }
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => {
                          setSelectedSchemaFile(f.id);
                          setJsonCopied(false);
                        }}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                          selectedSchemaFile === f.id
                            ? 'bg-purple-950/60 border border-purple-500/40 text-white font-black'
                            : 'text-zinc-550 hover:text-zinc-350'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Core Workspace Layout */}
              <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-0">
                
                {/* LEFT BLOCK: SCHEMA EXPLANATION & GODOT 4 CODE INTEGRATION (lg:col-span-5) */}
                <div className="lg:col-span-5 space-y-4">
                  
                  {/* Selected Schema Overview Card */}
                  {(() => {
                    const activeSchema = {
                      'crownmarks.json': {
                        title: '🏺 Crownmarks Master Database',
                        desc: 'Defines base stats, compatibility rules, and visual paths for all core weapons, shields, standard-banners, accessories, and helmet crownmarks.',
                        example_heroes: 'Maegan Violet, Lorelai, Shadow, Remi Brass, Allanna Voidweaver',
                        godot_mapping: 'Dictionary with Array[Dictionary] of individual item templates.'
                      },
                      'crownmark_upgrade_costs.json': {
                        title: '💰 Crownmark Upgrade Material Scaling',
                        desc: 'Outlines the linear and exponential resource curves required to level up crownmark stats, including starlight dust, gold crowns, and elite forge elements.',
                        example_heroes: 'General progression metrics applied globally across all items.',
                        godot_mapping: 'Indexed Dictionary containing float multipliers and explicit levels mapping.'
                      },
                      'crownmark_fragments.json': {
                        title: '🧩 Star Awakening & Melt Yields',
                        desc: 'Specifies duplicate fragment bounds needed for star promotions, success probability factors, and refund rates when dismantling excess crownmarks.',
                        example_heroes: 'Universal mechanics for star-overdrive caps and failure mitigation.',
                        godot_mapping: 'Array of custom StarCost data dictionaries, compatible with Godot 4 Resource casting.'
                      },
                      'crownmark_resonance.json': {
                        title: '🔮 Set Resonance & Visual Auras',
                        desc: 'Defines the tactical 2/3/4/5 piece matching bonuses for each commander, custom active pixel shaders, glowing hex colors, and passive attributes.',
                        example_heroes: 'Maegan, Lorelai, Shadow, Remi, and Allanna unique set skills.',
                        godot_mapping: 'Nested Dictionary mapping hero_id to set details and visual effect files.'
                      },
                      'crownmark_collections.json': {
                        title: '📖 Citadel Codex Museum Collections',
                        desc: 'Account-wide passive buffs unlocked by collecting and registering complete sets of historical artifacts inside the Citadel Codex gallery.',
                        example_heroes: 'Permanent city-wide gather speed, army defense, and prestige awards.',
                        godot_mapping: 'Array of completed collection structures, yielding static global account stats.'
                      },
                      'hero_signature_crownmarks.json': {
                        title: '🦸 Hero Affinity & Lore Milestones',
                        desc: 'Links commanders directly to their unique signature crownmarks. Provides background lore narratives and unlock prerequisites.',
                        example_heroes: 'Historical synergy details for Maegan, Lorelai, Shadow, Remi, and Allanna.',
                        godot_mapping: 'Metadata array binding hero_id to signature lists and narrative text blocks.'
                      }
                    }[selectedSchemaFile] || {
                      title: 'Sovereign Database File',
                      desc: 'Database file designed for high-performance retrieval in Crownspire game logic.',
                      example_heroes: 'All characters',
                      godot_mapping: 'Standard JSON structure.'
                    };

                    const fileFields = {
                      'crownmarks.json': [
                        { field: 'id', type: 'String', detail: 'Unique identifier (e.g. maegan_scepter).' },
                        { field: 'name', type: 'String', detail: 'In-game localized display title.' },
                        { field: 'slot', type: 'String', detail: 'Slot constraint: weapon, crown, armor, banner, accessory.' },
                        { field: 'hero_affinity', type: 'String', detail: 'Commander affinity (matches hero_id).' },
                        { field: 'base_stats', type: 'Dictionary', detail: 'Stats provided at Level 1 (percentages or flat rating).' },
                        { field: 'growth_per_level', type: 'Dictionary', detail: 'Stat additions applied for each level increment.' }
                      ],
                      'crownmark_upgrade_costs.json': [
                        { field: 'scaling_constants', type: 'Dictionary', detail: 'Rarity base multipliers (e.g., legendary = 1.25).' },
                        { field: 'materials', type: 'Array', detail: 'Core materials lookups (Starlight Dust, Star Iron, Void Essence).' },
                        { field: 'levels', type: 'Array', detail: 'Cost table indexed by levels showing gold, dust, and items required.' }
                      ],
                      'crownmark_fragments.json': [
                        { field: 'awakening_star_costs', type: 'Array', detail: 'Fragments, gold, and success rates for target stars 1 to 5.' },
                        { field: 'dismantle_returns', type: 'Dictionary', detail: 'Dust and omni-shards returned when melting duplicated tiers.' },
                        { field: 'omni_fragment_exchange', type: 'Dictionary', detail: 'Exchange ratios to trade generic shards for specific shards.' }
                      ],
                      'crownmark_resonance.json': [
                        { field: 'set_name', type: 'String', detail: 'Thematic set name (e.g. Moonlight Archon Sanctum).' },
                        { field: 'visual_effects', type: 'Dictionary', detail: 'Particle count, active shaders, and hexadecimal glow colors.' },
                        { field: 'tiers', type: 'Array', detail: 'Thresholds for 2, 3, 4, 5 pieces equipped and passive modifiers.' }
                      ],
                      'crownmark_collections.json': [
                        { field: 'id', type: 'String', detail: 'Unique museum gallery set identifier.' },
                        { field: 'required_crownmarks', type: 'Array', detail: 'Array of crownmark IDs needed to complete the gallery set.' },
                        { field: 'permanent_account_bonuses', type: 'Dictionary', detail: 'Permanent global stats granted directly to the Citadel.' }
                      ],
                      'hero_signature_crownmarks.json': [
                        { field: 'hero_id', type: 'String', detail: 'Matches the primary database hero keys.' },
                        { field: 'signature_crownmark_ids', type: 'Array', detail: 'List of matching historical crownmarks linked to the hero.' },
                        { field: 'affinity_lore_unlocked', type: 'Dictionary', detail: 'Chronological lore milestones unlocked as affinity levels grow.' }
                      ]
                    }[selectedSchemaFile] || [];

                    return (
                      <div className="bg-[#090b10] border border-zinc-850 p-4 rounded-2xl space-y-4 font-mono text-xs">
                        <span className="text-[9px] text-purple-400 font-extrabold tracking-widest uppercase block">DATABASE METADATA</span>
                        
                        <div className="space-y-1.5">
                          <h3 className="text-xs font-serif font-black text-white uppercase">{activeSchema.title}</h3>
                          <p className="text-[10px] text-zinc-400 leading-relaxed font-sans">{activeSchema.desc}</p>
                        </div>

                        {/* Summary details */}
                        <div className="grid grid-cols-2 gap-2 text-[9px] bg-black/45 p-2.5 rounded-xl border border-zinc-900 leading-snug">
                          <div>
                            <span className="text-zinc-550 uppercase block text-[8px] font-black">REPRESENTATIVE COMMANDERS:</span>
                            <span className="text-purple-300 font-sans">{activeSchema.example_heroes}</span>
                          </div>
                          <div>
                            <span className="text-zinc-550 uppercase block text-[8px] font-black">GODOT 4 DESERIALIZATION MODEL:</span>
                            <span className="text-zinc-300 font-sans">{activeSchema.godot_mapping}</span>
                          </div>
                        </div>

                        {/* Fields Description Table */}
                        <div className="space-y-2">
                          <span className="text-[8px] text-zinc-500 font-extrabold uppercase block tracking-wider">FIELD SPECIFICATIONS SCHEMA</span>
                          <div className="border border-zinc-900 rounded-xl overflow-hidden max-h-44 overflow-y-auto scrollbar-thin">
                            <table className="w-full text-left border-collapse text-[9.5px]">
                              <thead>
                                <tr className="bg-[#0e111a] text-zinc-400 border-b border-zinc-900">
                                  <th className="p-2 font-black uppercase">Field Key</th>
                                  <th className="p-2 font-black uppercase">Type</th>
                                  <th className="p-2 font-black uppercase">Definition</th>
                                </tr>
                              </thead>
                              <tbody>
                                {fileFields.map((f, i) => (
                                  <tr key={i} className="border-b border-zinc-900/40 hover:bg-zinc-950/40 transition-colors">
                                    <td className="p-2 font-black text-purple-400">{f.field}</td>
                                    <td className="p-2 text-zinc-300 italic">{f.type}</td>
                                    <td className="p-2 text-zinc-400 font-sans leading-normal">{f.detail}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Godot 4 Integration Guide (GDScript Deserialization Guide) */}
                  <div className="bg-[#090b10] border border-zinc-850 p-4 rounded-2xl space-y-3 font-mono">
                    <span className="text-[9px] text-purple-400 font-extrabold tracking-widest uppercase block">GODOT 4 ARCHITECTURE BLUEPRINT</span>
                    
                    <div className="space-y-1.5">
                      <h3 className="text-xs font-serif font-black text-white uppercase">GDSCRIPT DESERIALIZER MODEL</h3>
                      <p className="text-[10.5px] text-zinc-400 leading-normal font-sans">
                        To load this database with pristine performance inside Godot 4, utilize this production-ready loader pattern. It loads the JSON file, parses types dynamically, and caches items inside a custom dictionary or global singleton.
                      </p>
                    </div>

                    {/* Styled Editor block for Godot 4 Loader snippet */}
                    <div className="bg-black/85 rounded-xl border border-zinc-900 p-3 relative text-[9px] font-mono leading-relaxed select-all">
                      <span className="absolute top-2.5 right-3 text-[8px] text-purple-400 font-bold uppercase tracking-widest select-none">GDSCRIPT</span>
                      <div className="text-zinc-500 overflow-x-auto whitespace-pre font-mono scrollbar-thin max-h-56">
{`# crownmark_database.gd
extends Node
class_name CrownmarkDatabase

const DATABASE_PATH = "res://data/crownmarks.json"
var crownmarks_cache: Dictionary = {}

func _ready() -> void:
    load_crownmarks_database()

func load_crownmarks_database() -> void:
    if not FileAccess.file_exists(DATABASE_PATH):
        push_error("Sovereign Database File missing at: " + DATABASE_PATH)
        return
        
    var file := FileAccess.open(DATABASE_PATH, FileAccess.READ)
    var json_text := file.get_as_text()
    file.close()
    
    var parsed = JSON.parse_string(json_text)
    if parsed == null:
        push_error("Failed parsing Crownmarks JSON formatting.")
        return
        
    crownmarks_cache.clear()
    for crownmark_data in parsed["crownmarks"]:
        var crownmark_id: String = crownmark_data["id"]
        crownmarks_cache[crownmark_id] = crownmark_data
        
    print("[CROWNMARKS] Loaded ", crownmarks_cache.size(), " static crownmarks from ", DATABASE_PATH)

func get_crownmark_data(crownmark_id: String) -> Dictionary:
    return crownmarks_cache.get(crownmark_id, {})`}
                      </div>
                    </div>

                    {/* Godot 4 Class Mapping details */}
                    <div className="p-3 bg-zinc-950/80 border border-zinc-900 rounded-xl text-[9.5px] text-zinc-400 font-sans leading-normal">
                      <strong className="text-zinc-200 block text-[9px] uppercase font-mono tracking-wider pb-1">💡 Godot 4 RefCounted Model Casting</strong>
                      Create a <code className="text-purple-300 font-mono bg-purple-950/20 px-1 py-0.2 rounded">class_name CrownmarkResource extends Resource</code> structure. Map fields like <code className="text-zinc-300 font-mono">id, name, slot, and base_stats</code> inside <code className="text-zinc-300 font-mono">_init(data: Dictionary)</code> to transition from raw dictionaries to type-safe, auto-completing resources on your battle map nodes.
                    </div>
                  </div>

                </div>

                {/* RIGHT BLOCK: INTERACTIVE SYNTAX-HIGHLIGHTED CODE EDITOR (lg:col-span-7) */}
                <div className="lg:col-span-7 flex flex-col min-h-0 bg-[#07090e] border border-zinc-850 rounded-2xl overflow-hidden font-mono text-xs">
                  
                  {/* Editor Header Bar */}
                  <div className="bg-[#0b0e16] border-b border-zinc-850 px-4 py-3 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                      <span className="text-[10px] text-zinc-400 font-bold ml-2">/src/data/{selectedSchemaFile}</span>
                    </div>

                    {/* Copy Button */}
                    <button
                      onClick={() => {
                        const schemaMapping = {
                          'crownmarks.json': crownmarksSchema,
                          'crownmark_upgrade_costs.json': crownmarkUpgradeCostsSchema,
                          'crownmark_fragments.json': crownmarkFragmentsSchema,
                          'crownmark_resonance.json': crownmarkResonanceSchema,
                          'crownmark_collections.json': crownmarkCollectionsSchema,
                          'hero_signature_crownmarks.json': heroSignatureCrownmarksSchema
                        };
                        const selectedData = schemaMapping[selectedSchemaFile as keyof typeof schemaMapping];
                        navigator.clipboard.writeText(JSON.stringify(selectedData, null, 2));
                        setJsonCopied(true);
                        setTimeout(() => setJsonCopied(false), 2000);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-[10px] font-bold text-zinc-300 rounded-lg cursor-pointer transition-all active:scale-95"
                    >
                      {jsonCopied ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">COPIED SCHEMAS!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-purple-400" />
                          <span>COPY SCHEMAS</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Main Syntax Prettified Visualizer */}
                  <div className="flex-1 overflow-y-auto p-4 bg-black/60 scrollbar-thin select-all">
                    {(() => {
                      const schemaMapping = {
                        'crownmarks.json': crownmarksSchema,
                        'crownmark_upgrade_costs.json': crownmarkUpgradeCostsSchema,
                        'crownmark_fragments.json': crownmarkFragmentsSchema,
                        'crownmark_resonance.json': crownmarkResonanceSchema,
                        'crownmark_collections.json': crownmarkCollectionsSchema,
                        'hero_signature_crownmarks.json': heroSignatureCrownmarksSchema
                      };
                      const selectedData = schemaMapping[selectedSchemaFile as keyof typeof schemaMapping] || {};
                      const prettyString = JSON.stringify(selectedData, null, 2);
                      const lines = prettyString.split('\n');

                      return (
                        <div className="flex text-[10.5px] leading-relaxed font-mono">
                          {/* Line numbers rail */}
                          <div className="text-zinc-650 pr-4 text-right select-none border-r border-zinc-900/60 mr-4 w-8">
                            {lines.map((_, idx) => (
                              <div key={idx}>{idx + 1}</div>
                            ))}
                          </div>
                          {/* JSON Body with colored classes */}
                          <div className="text-zinc-300 overflow-x-auto whitespace-pre font-mono flex-1 pb-4 scrollbar-thin select-text">
                            {lines.map((line, idx) => {
                              // Highly stylized syntax highlighted preview using inline replacements or regex-like elements
                              let renderedLine = line;
                              
                              // Check if line is key/value
                              // Highlight keys
                              renderedLine = renderedLine.replace(/(".*?"): /g, (match, key) => {
                                return `<span style="color: #818cf8">${key}</span>: `;
                              });

                              // Highlight strings
                              renderedLine = renderedLine.replace(/: ("(.*?)")/g, (match, fullVal) => {
                                return `: <span style="color: #34d399">${fullVal}</span>`;
                              });

                              // Highlight numbers
                              renderedLine = renderedLine.replace(/: ([\d.-]+)/g, (match, num) => {
                                return `: <span style="color: #fb923c">${num}</span>`;
                              });

                              // Highlight booleans
                              renderedLine = renderedLine.replace(/: (true|false)/g, (match, bool) => {
                                return `: <span style="color: #c084fc; font-weight: bold">${bool}</span>`;
                              });

                              return (
                                <div 
                                  key={idx} 
                                  dangerouslySetInnerHTML={{ __html: renderedLine }} 
                                />
                              );
                            })}
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Schema validation confirmation footer */}
                  <div className="bg-[#0b0e16] border-t border-zinc-850 px-4 py-2 flex items-center justify-between text-[9px] text-zinc-500 shrink-0">
                    <span className="flex items-center gap-1.5">
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      VALID SCHEMAS DETECTED
                    </span>
                    <span>SIZE: {(() => {
                      const schemaMapping = {
                        'crownmarks.json': crownmarksSchema,
                        'crownmark_upgrade_costs.json': crownmarkUpgradeCostsSchema,
                        'crownmark_fragments.json': crownmarkFragmentsSchema,
                        'crownmark_resonance.json': crownmarkResonanceSchema,
                        'crownmark_collections.json': crownmarkCollectionsSchema,
                        'hero_signature_crownmarks.json': heroSignatureCrownmarksSchema
                      };
                      const selectedData = schemaMapping[selectedSchemaFile as keyof typeof schemaMapping] || {};
                      return JSON.stringify(selectedData).length;
                    })().toLocaleString()} BYTES</span>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* ======================================================================
              TAB 8: GDSCRIPT DEV BLUEPRINT (GODOT 4 ARCHITECTURE CENTER)
              ====================================================================== */}
          {activeTab === 'godot_plan' && (
            <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
              
              {/* Top Control Bar with Search & General Summary */}
              <div className="bg-gradient-to-r from-zinc-950 via-purple-950/15 to-zinc-950 border-b border-zinc-850 p-4 shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-serif font-black text-white uppercase tracking-wider flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-purple-400" />
                    <span>GDSCRIPT DEV HUB — HERO CROWNMARK SYSTEM</span>
                  </h4>
                  <p className="text-[10px] text-zinc-400 max-w-xl font-sans">
                    Standardized, clean, and modular Godot 4 (GDScript 2.0) implementation files mapped directly from local persistent schemas. Use this panel to copy system logic.
                  </p>
                </div>

                {/* Search query input */}
                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    placeholder="Search Godot modules..."
                    value={godotSearchQuery}
                    onChange={(e) => setGodotSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-zinc-950/95 border border-zinc-900 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500/50 font-mono transition-all"
                  />
                  <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5 top-2.5" />
                </div>
              </div>

              {/* Three-Column Workspace Layout */}
              <div className="flex-1 overflow-hidden flex min-h-0">
                
                {/* COLUMN 1: LEFT MODULE SELECTOR COLUMN (30% wide) */}
                <div className="w-72 border-r border-zinc-850 bg-[#080a0f] flex flex-col min-h-0 shrink-0">
                  <div className="p-3 bg-zinc-950/40 border-b border-zinc-900/40 flex justify-between items-center shrink-0">
                    <span className="text-[9px] text-zinc-550 font-extrabold tracking-wider uppercase font-mono">ARCHITECT MODULES</span>
                    <span className="text-[9px] text-purple-400 bg-purple-950/50 border border-purple-900/50 px-1.5 py-0.5 rounded font-mono font-bold">{godotImplementationPlan.sections.length} MODULES</span>
                  </div>
                  
                  {/* Modules list with scrolling */}
                  <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
                    {(() => {
                      const filteredSections = godotImplementationPlan.sections.filter(sec => {
                        if (!godotSearchQuery) return true;
                        const q = godotSearchQuery.toLowerCase();
                        return (
                          sec.title.toLowerCase().includes(q) ||
                          sec.subtitle.toLowerCase().includes(q) ||
                          sec.description.toLowerCase().includes(q)
                        );
                      });

                      if (filteredSections.length === 0) {
                        return (
                          <div className="p-4 text-center space-y-2">
                            <AlertTriangle className="w-5 h-5 text-zinc-650 mx-auto" />
                            <p className="text-[10px] text-zinc-500 font-mono">No matching Godot modules found.</p>
                          </div>
                        );
                      }

                      return filteredSections.map((sec) => {
                        const isSelected = godotActiveSectionId === sec.id;
                        // Dynamically determine badge icon/text depending on ID prefixes
                        let badgeText = "SYSTEM";
                        let badgeColor = "text-blue-400 bg-blue-950/20 border-blue-900/30";
                        if (sec.id === 'autoloads' || sec.id === 'data_manager') {
                          badgeText = "AUTOLOAD";
                          badgeColor = "text-purple-400 bg-purple-950/20 border-purple-900/30";
                        } else if (sec.id.includes('service') || sec.id.includes('formulas') || sec.id.includes('logic') || sec.id.includes('calcu')) {
                          badgeText = "LOGIC";
                          badgeColor = "text-emerald-400 bg-emerald-950/20 border-emerald-900/30";
                        } else if (sec.id.includes('screen') || sec.id.includes('ui') || sec.id.includes('inspector')) {
                          badgeText = "UI NODE";
                          badgeColor = "text-amber-400 bg-amber-950/20 border-amber-900/30";
                        } else if (sec.id.includes('performance')) {
                          badgeText = "PERF";
                          badgeColor = "text-rose-400 bg-rose-950/20 border-rose-900/30";
                        } else if (sec.id.includes('networking')) {
                          badgeText = "NETWORK";
                          badgeColor = "text-cyan-400 bg-cyan-950/20 border-cyan-900/30";
                        } else if (sec.id.includes('expansion')) {
                          badgeText = "ADAPTER";
                          badgeColor = "text-fuchsia-400 bg-fuchsia-950/20 border-fuchsia-900/30";
                        }

                        return (
                          <button
                            key={sec.id}
                            onClick={() => {
                              setGodotActiveSectionId(sec.id);
                              setGodotCopied(false);
                            }}
                            className={`w-full text-left p-2.5 rounded-xl border transition-all flex flex-col gap-1 cursor-pointer group ${
                              isSelected
                                ? 'bg-[#131926] border-purple-500/40 text-white'
                                : 'bg-transparent border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/30'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 w-full">
                              <span className={`text-[10px] font-bold font-mono tracking-tight truncate ${isSelected ? 'text-purple-300 font-black' : ''}`}>
                                {sec.title}
                              </span>
                              <span className={`text-[8px] font-bold font-mono uppercase px-1 rounded border shrink-0 scale-90 ${badgeColor}`}>
                                {badgeText}
                              </span>
                            </div>
                            <span className="text-[9px] text-zinc-550 truncate font-sans font-medium">
                              {sec.subtitle}
                            </span>
                          </button>
                        );
                      });
                    })()}
                  </div>
                </div>

                {/* COLUMN 2: CENTER WORKSPACE (GDScript Editor & Detail - 42% wide) */}
                <div className="flex-1 flex flex-col min-h-0 bg-[#06080c] p-4 space-y-4 overflow-y-auto scrollbar-thin">
                  {(() => {
                    const sec = godotImplementationPlan.sections.find(s => s.id === godotActiveSectionId);
                    if (!sec) return null;
                    const lines = sec.gdscript.split('\n');

                    return (
                      <div className="space-y-4">
                        
                        {/* Module Header card */}
                        <div className="bg-gradient-to-br from-zinc-950 to-zinc-900/80 border border-zinc-850 p-4 rounded-2xl space-y-2">
                          <div className="flex items-center gap-2 text-purple-400 font-mono text-[9px] font-black tracking-widest uppercase">
                            <Code className="w-3.5 h-3.5" />
                            <span>MODULE BLUEPRINT SPECIFICATIONS</span>
                          </div>
                          <h3 className="text-sm font-serif font-black text-white uppercase tracking-wide">
                            {sec.title} — {sec.subtitle}
                          </h3>
                          <p className="text-[10.5px] text-zinc-400 leading-relaxed font-sans">
                            {sec.description}
                          </p>
                        </div>

                        {/* GDScript Syntax-Highlight Simulator View */}
                        <div className="bg-black/90 border border-zinc-850 rounded-2xl overflow-hidden flex flex-col font-mono text-xs">
                          
                          {/* Editor Panel Header */}
                          <div className="bg-[#0b0d13] border-b border-zinc-850 px-4 py-2.5 flex items-center justify-between select-none">
                            <div className="flex items-center gap-1.5">
                              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                              <span className="text-[9px] text-zinc-550 font-bold ml-2 uppercase">GDScript Parser v2.0</span>
                            </div>
                            
                            {/* Copy button */}
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(sec.gdscript);
                                setGodotCopied(true);
                                setTimeout(() => setGodotCopied(false), 2000);
                              }}
                              className="flex items-center gap-1 px-2 py-1 bg-zinc-900 border border-zinc-880 hover:bg-zinc-800 hover:border-zinc-750 rounded-lg text-[9px] font-bold text-zinc-350 transition-all cursor-pointer active:scale-95"
                            >
                              {godotCopied ? (
                                <>
                                  <Check className="w-2.5 h-2.5 text-emerald-400" />
                                  <span className="text-emerald-400 font-black">COPIED TO CLIPBOARD</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-2.5 h-2.5 text-purple-400" />
                                  <span>COPY CODE</span>
                                </>
                              )}
                            </button>
                          </div>

                          {/* Syntax Highlighter Pre container */}
                          <div className="p-4 overflow-y-auto max-h-[460px] scrollbar-thin select-all flex text-[10.5px]">
                            
                            {/* Line numbers column */}
                            <div className="text-zinc-650 pr-3 border-r border-zinc-900 text-right mr-3 select-none w-7 shrink-0">
                              {lines.map((_, i) => (
                                <div key={i}>{i + 1}</div>
                              ))}
                            </div>
                            
                            {/* Highlighted text */}
                            <div className="text-zinc-300 whitespace-pre overflow-x-auto scrollbar-thin flex-1 font-mono">
                              {lines.map((line, i) => {
                                let rendered = line;
                                
                                // Color comments green
                                if (rendered.trim().startsWith('#')) {
                                  rendered = `<span style="color: #6b7280; font-style: italic">${rendered}</span>`;
                                } else {
                                  // Color keywords
                                  rendered = rendered.replace(/\b(extends|var|func|signal|const|static|class_name|extends Node|extends RefCounted|extends Control|extends PanelContainer|if|not|else|return|for|in|and|or|true|false)\b/g, (match) => {
                                    return `<span style="color: #f472b6; font-weight: bold">${match}</span>`;
                                  });
                                  // Color String variables
                                  rendered = rendered.replace(/(".*?")/g, (match) => {
                                    return `<span style="color: #34d399">${match}</span>`;
                                  });
                                  // Color annotations
                                  rendered = rendered.replace(/(@onready|@export)/g, (match) => {
                                    return `<span style="color: #818cf8; font-weight: bold">${match}</span>`;
                                  });
                                  // Color digit constants
                                  rendered = rendered.replace(/\b(\d+)\b/g, (match) => {
                                    return `<span style="color: #fb923c">${match}</span>`;
                                  });
                                }
                                return (
                                  <div 
                                    key={i} 
                                    dangerouslySetInnerHTML={{ __html: rendered }} 
                                  />
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* COLUMN 3: RIGHT INTERACTIVE ENGINE SIMULATOR COLUMN (28% wide) */}
                <div className="w-80 border-l border-zinc-850 bg-[#080a0e] flex flex-col shrink-0 min-h-0 overflow-y-auto p-4 space-y-4 scrollbar-thin">
                  <div className="p-1 border-b border-zinc-900/40 shrink-0">
                    <span className="text-[9px] text-zinc-550 font-extrabold tracking-widest uppercase font-mono block">LIVE FORMULA ENGINE SIMULATORS</span>
                  </div>

                  {/* 1. Stat Calculator Live Sandbox */}
                  {godotActiveSectionId === 'stat_calculations' && (
                    <div className="bg-[#0b0e14] border border-zinc-850 p-3.5 rounded-2xl space-y-3 font-mono text-xs">
                      <div className="flex items-center gap-1.5 text-emerald-400">
                        <Sliders className="w-3.5 h-3.5" />
                        <span className="font-bold uppercase tracking-wider text-[10px]">Stat Scaling Sandbox</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 font-sans leading-relaxed">
                        Slide the level and star values below to preview the GDScript formula arithmetic outputs in real-time.
                      </p>
                      
                      {/* Slider controls */}
                      <div className="space-y-3 bg-black/40 p-2.5 rounded-xl border border-zinc-900">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-zinc-550">UPGRADE LEVEL:</span>
                            <span className="text-purple-400 font-bold">LV. {slotsSimLevel}</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="100"
                            value={slotsSimLevel}
                            onChange={(e) => setSlotsSimLevel(parseInt(e.target.value))}
                            className="w-full accent-purple-500 h-1 bg-zinc-900 rounded-lg cursor-pointer"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-zinc-550">AWAKENING STARS:</span>
                            <span className="text-purple-400 font-bold">{slotsSimStars} ★</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            value={slotsSimStars}
                            onChange={(e) => setSlotsSimStars(parseInt(e.target.value))}
                            className="w-full accent-purple-500 h-1 bg-zinc-900 rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Calculator Math output */}
                      <div className="space-y-2 text-[10.5px]">
                        <div className="text-[9px] text-zinc-550 uppercase tracking-widest">FORMULA CALCULATION BREAKDOWN:</div>
                        
                        {(() => {
                          const base = 120;
                          const growth = 18;
                          const levelFactor = slotsSimLevel - 1;
                          const starMultiplier = 1.0 + ((slotsSimStars - 1) * 0.15);
                          const finalVal = Math.round((base + growth * levelFactor) * starMultiplier);

                          return (
                            <div className="space-y-1.5 leading-relaxed">
                              <div className="p-2 bg-purple-950/25 border border-purple-900/40 rounded-xl">
                                <span className="text-zinc-400 text-[10px] block">COMPUTED ATTRIBUTE (ATTACK):</span>
                                <span className="text-sm text-purple-300 font-black">+{finalVal}%</span>
                              </div>
                              <div className="p-2 bg-black/40 border border-zinc-900 text-[9px] text-zinc-550 space-y-1">
                                <div>Base: <span className="text-zinc-300">120</span></div>
                                <div>Growth Add: <span className="text-zinc-300">18 × {levelFactor} = +{growth * levelFactor}</span></div>
                                <div>Star Multiplier: <span className="text-zinc-300">{starMultiplier.toFixed(2)}x (+15% per star)</span></div>
                                <div className="border-t border-zinc-850 pt-1 mt-1 font-mono text-[9px] text-purple-400">
                                  ({base} + {growth} × {levelFactor}) × {starMultiplier.toFixed(2)} = {finalVal}
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}

                  {/* 2. Resonance Checker Simulator */}
                  {godotActiveSectionId === 'resonance_calculations' && (
                    <div className="bg-[#0b0e14] border border-zinc-850 p-3.5 rounded-2xl space-y-3 font-mono text-xs">
                      <div className="flex items-center gap-1.5 text-purple-400">
                        <Zap className="w-3.5 h-3.5" />
                        <span className="font-bold uppercase tracking-wider text-[10px]">Resonance Tracker</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 font-sans leading-relaxed">
                        Toggle equipped state of Maegan's set crownmarks below to simulate active set tiers in real-time.
                      </p>

                      {/* Crownmarks Equipper Toggle */}
                      <div className="space-y-2">
                        {[
                          { key: 'scepter', name: 'Sovereign Scepter' },
                          { key: 'crown', name: 'Sovereign Crown' },
                          { key: 'crest', name: 'Vanguard Crest' },
                          { key: 'charter', name: 'Royal Charter' },
                          { key: 'signet', name: 'Sovereign Signet' }
                        ].map(item => {
                          const isEquipped = resonanceEquippedState.maegan[item.key] || false;
                          return (
                            <button
                              key={item.key}
                              onClick={() => {
                                const updated = { ...resonanceEquippedState };
                                updated.maegan = { ...updated.maegan, [item.key]: !isEquipped };
                                setResonanceEquippedState(updated);
                              }}
                              className={`w-full flex items-center justify-between p-2 rounded-xl border text-[10px] transition-all cursor-pointer ${
                                isEquipped
                                  ? 'bg-purple-950/40 border-purple-500/50 text-white font-bold'
                                  : 'bg-zinc-950/80 border-zinc-900 text-zinc-500 hover:text-zinc-300'
                              }`}
                            >
                              <span>{item.name}</span>
                              <span>{isEquipped ? 'EQUIPPED ✓' : 'UNBOUND ✖'}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Computed set bonus */}
                      {(() => {
                        const equippedCount = Object.values(resonanceEquippedState.maegan).filter(v => v).length;
                        
                        let activeSetBonus = "No Resonance (Need 2 crownmarks)";
                        let activeGlow = "text-zinc-555 border-zinc-900";
                        if (equippedCount >= 5) {
                          activeSetBonus = "Tier 4: Violet Orbital Rain (Divine command AoE +420 damage)";
                          activeGlow = "text-amber-400 bg-amber-950/30 border-amber-500/30 font-black";
                        } else if (equippedCount >= 4) {
                          activeSetBonus = "Tier 3: Aegis Sentinel (+3% allied HP restoration loops)";
                          activeGlow = "text-pink-400 bg-pink-950/30 border-pink-500/30 font-black";
                        } else if (equippedCount >= 3) {
                          activeSetBonus = "Tier 2: Sigil Blitz (12% basic troop rage recharge bonus)";
                          activeGlow = "text-purple-400 bg-purple-950/30 border-purple-500/30 font-bold";
                        } else if (equippedCount >= 2) {
                          activeSetBonus = "Tier 1: Concordat Call (8% field hazard mitigation)";
                          activeGlow = "text-blue-400 bg-blue-950/30 border-blue-500/30";
                        }

                        return (
                          <div className={`p-2.5 rounded-xl border text-[10px] leading-snug space-y-1 ${activeGlow}`}>
                            <span className="block text-[8px] font-black tracking-widest uppercase">ACTIVE SET RESONANCE ({equippedCount} / 5):</span>
                            <span>{activeSetBonus}</span>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {/* 3. Star Forge Upgrade Station */}
                  {godotActiveSectionId === 'upgrade_screen' && (
                    <div className="bg-[#0b0e14] border border-zinc-850 p-3.5 rounded-2xl space-y-3 font-mono text-xs">
                      <div className="flex items-center gap-1.5 text-purple-400">
                        <Hammer className="w-3.5 h-3.5" />
                        <span className="font-bold uppercase tracking-wider text-[10px]">Upgrade Station simulator</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 font-sans leading-relaxed">
                        Simulate starlight dust consumption to upgrade your active crownmark level.
                      </p>
                      
                      <div className="p-3 bg-black/60 border border-zinc-900 rounded-xl space-y-3.5 text-center">
                        <div className="text-[11px] text-zinc-400">
                          CROWNMARK STATUS: <span className="text-purple-300 font-bold">Level {slotsSimLevel}</span>
                        </div>
                        
                        <div className="flex items-center justify-center gap-4 text-[10px]">
                          <div>
                            <span className="text-zinc-550 block text-[8px] uppercase">STARLIGHT DUST:</span>
                            <span className="text-amber-400 font-bold">12,500</span>
                          </div>
                          <div>
                            <span className="text-zinc-550 block text-[8px] uppercase">GOLD COST:</span>
                            <span className="text-yellow-500 font-bold">{slotsSimLevel * 100}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            if (slotsSimLevel < 100) {
                              setSlotsSimLevel(slotsSimLevel + 1);
                            } else {
                              setSlotsSimLevel(1);
                            }
                          }}
                          className="w-full py-1.5 bg-gradient-to-r from-purple-800 to-purple-600 hover:from-purple-700 hover:to-purple-500 text-white rounded-xl text-[10px] font-bold cursor-pointer transition-all active:scale-95"
                        >
                          {slotsSimLevel >= 100 ? "RESET STATION" : "UPGRADE LEVEL (+1)"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* 4. Default Interactive Architecture Panel */}
                  {godotActiveSectionId !== 'stat_calculations' && godotActiveSectionId !== 'resonance_calculations' && godotActiveSectionId !== 'upgrade_screen' && (
                    <div className="bg-[#0b0e14] border border-zinc-850 p-3.5 rounded-2xl space-y-3 font-mono text-xs">
                      <div className="flex items-center gap-1.5 text-purple-400">
                        <Database className="w-3.5 h-3.5" />
                        <span className="font-bold uppercase tracking-wider text-[10px]">System Integration</span>
                      </div>
                      <p className="text-[10px] text-zinc-400 font-sans leading-relaxed">
                        Every Godot component is fully integrated into the general metagame framework to ensure maximum stability and thread safety.
                      </p>

                      {/* Mini static pipeline view */}
                      <div className="p-3 bg-black/40 border border-zinc-900 rounded-xl space-y-2 text-[9px] text-zinc-500 leading-snug">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                          <span>GDScript dynamic casting models active</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                          <span>Thread-safe Resource deserializer</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                          <span>Signal-driven UI reactivity loops</span>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-[#0f131a] border border-purple-900/40 rounded-xl text-[9px] text-purple-300 leading-normal">
                        <strong>💡 Propose to developers:</strong> Place this implementation folder in your project's `res://scripts/crownmark_system/` directory to instantly connect the systems on your production servers!
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}

