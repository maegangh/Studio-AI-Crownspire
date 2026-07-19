export interface StatBlock {
  attack: number;
  defense: number;
  health: number;
}

export interface MilestoneBonus {
  level: string;
  bonus: string;
}

export interface AwakeningStar {
  star: number;
  effect: string;
}

export interface MaeganSignatureCrownmark {
  id: string;
  name: string;
  officialName: string;
  slot: string;
  category: string;
  icon: string;
  rarity: string;
  rarityColor: string;
  visualDescription: string;
  artworkDirection: string;
  baseStats: StatBlock;
  maxStats: StatBlock;
  passiveName: string;
  passiveDesc: string;
  upgradeBonuses: MilestoneBonus[];
  awakeningBonuses: AwakeningStar[];
  resonanceContribution: {
    points: number;
    visualEffect: string;
    description: string;
  };
  fragmentAcquisition: string;
  collectionBonus: string;
  lore: string;
  flavor: string;
}

export const MAEGAN_SIGNATURE_CROWNMARKS: MaeganSignatureCrownmark[] = [
  {
    id: 'founders_scepter',
    name: "Founder's Scepter",
    officialName: "Sovereign Scepter of the First Marshal",
    slot: "Weapon",
    category: "Imperial Armaments (⚔️)",
    icon: "⚔️",
    rarity: "Mythic Signature (Ascendant)",
    rarityColor: "from-amber-600 via-red-600 to-purple-600",
    visualDescription: "A heavy, masterfully crafted royal marshal rod forged from celestial star-iron, capped with an orbital violet crystal cluster. Intricate gold filigree in the likeness of roaring winged lions traces up the grip, crackling with subtle currents of violet lightning.",
    artworkDirection: "Frontal, dynamic 45-degree angle. High-contrast 3D render highlighting the central violet crystal pulsing with plasma-like starlight energy. The metallic surface reflects warm gold and cold Damascus steel textures under a key light. The background is a soft, deep-space nebulous navy blue with floating stellar dust.",
    baseStats: { attack: 90, defense: 15, health: 140 },
    maxStats: { attack: 1240, defense: 280, health: 1950 },
    passiveName: "Sovereign Command",
    passiveDesc: "Boosts infantry legion basic damage by 15% and increases troop march damage rating by 10%. Additionally, every 4th skill cast triggers an imperial shockwave that stuns front-row targets for 1.5 seconds.",
    upgradeBonuses: [
      { level: "+5", bonus: "Attack +10% raw bonus modifier" },
      { level: "+10", bonus: "Infantry Pierce +5% armor-bypass efficiency" },
      { level: "+15", bonus: "Legion Damage Mitigation +3% in active combat" },
      { level: "+20", bonus: "Unlocks [Shockwave Radius Expansion]: +25% area of effect" }
    ],
    awakeningBonuses: [
      { star: 1, effect: "Sovereign Command basic damage boost raised from 15% to 18%." },
      { star: 2, effect: "Increases base attack stat of this Crownmark by a permanent +15%." },
      { star: 3, effect: "Adds 5% defense pierce directly to Maegan's lead infantry cohort." },
      { star: 4, effect: "Reduces shockwave skill counter trigger requirement from 4th cast to 3rd cast." },
      { star: 5, effect: "[Ascendant Marshal]: Sovereign Command damage boost is doubled (36%) when legion health remains above 75%." }
    ],
    resonanceContribution: {
      points: 250,
      visualEffect: "Marshal's Aura",
      description: "Contributes 250 points to the Citadel Sovereign Resonance score. At 3 set pieces, unlocks the 'Marshal's Aura' visual overlay, generating floating crown-gold dust particles around the commander."
    },
    fragmentAcquisition: "Weekly Guild Raid Boss: Gorgoroth the Spire-Breaker, or synthesized in the Forge with 50 Sovereign Star-Iron Shards.",
    collectionBonus: "Citadel Codex Entry Bonus: Permanent +2.0% global army attack power and +4.0% campaign gold drop rate.",
    lore: "Forged during the Dawn Age of Foundations by Corin Violet, the first Marshal of the Spire. It was held aloft during the Siege of the Pale Gates to coordinate the legendary shield-wall of humans, elves, and masons, turning back the shadow-tide.",
    flavor: "Let them run, let them hide, but they shall never break the line where the Scepter points."
  },
  {
    id: 'founders_crown',
    name: "Founder's Crown",
    officialName: "Great Crown of the Eternal Spire",
    slot: "Helm",
    category: "Royal Regalia (👑)",
    icon: "👑",
    rarity: "Mythic Signature (Ascendant)",
    rarityColor: "from-amber-600 via-red-600 to-purple-600",
    visualDescription: "A towering, solemn crown forged from deep-subterranean meteorite iron and encrusted with brilliant, raw star diamonds. Its seven distinct spires mirror the majestic architectural silhouette of the Citadel towers, surrounded by a perpetual starlight dome hovering above the brow.",
    artworkDirection: "Direct, dramatic head-on portrait. A warm, glowing key light radiates from the crown's central diamonds, casting long, sharp gothic shadows. Intricate Norse-gothic scrolls and relief runes are visible along the ancient blackened iron band.",
    baseStats: { attack: 20, defense: 80, health: 480 },
    maxStats: { attack: 320, defense: 1150, health: 6400 },
    passiveName: "Crownspire Bulwark",
    passiveDesc: "Generates an indestructible starlight dome absorbing 20% of incoming enemy siege skill fire and magical projectile damage, converting absorbed kinetic force into commander action points.",
    upgradeBonuses: [
      { level: "+5", bonus: "Defense +12% base reinforcement scale" },
      { level: "+10", bonus: "Legion Health +10% vitality increment" },
      { level: "+15", bonus: "Siege Skill Damage Reduction +5%" },
      { level: "+20", bonus: "Unlocks [Bulwark Renewal]: Regenerates 5% of starlight dome shield HP every 10 seconds" }
    ],
    awakeningBonuses: [
      { star: 1, effect: "Starlight dome projectile absorption coefficient is upgraded to 25%." },
      { star: 2, effect: "Increases base health stat of this Crownmark by a permanent +20%." },
      { star: 3, effect: "Allied marksmen stationed inside the dome gain +10% defense modifier." },
      { star: 4, effect: "Extends starlight dome active duration by 3 seconds." },
      { star: 5, effect: "[Celestial Aegis]: Starlight dome now reflects 15% of all absorbed projectile damage back to the source squad." }
    ],
    resonanceContribution: {
      points: 250,
      visualEffect: "Aegis Crown Ring",
      description: "Contributes 250 points to the Citadel Sovereign Resonance score. At 4 set pieces, unlocks the 'Aegis Crown Ring' visual overlay, adding a rotating gold halo around the unit base in tactical battles."
    },
    fragmentAcquisition: "Campaign Milestone Reward: Defeat Chapter 20-5 (The Crownspire Ascent) or purchased from the high-prestige Alliance Shop.",
    collectionBonus: "Citadel Codex Entry Bonus: Permanent +3.0% structural city wall defense and +5.0% troop casualty healing speed.",
    lore: "Symbolizing absolute sovereign control over the seven valleys of the Spire, this crown was locked away in the Deep Crypts after the Great Cataclysm, waiting for an heir of pure bloodline to re-awaken its dormant star crystals.",
    flavor: "A heavy brow bears the burden of seven kingdoms, but a true sovereign never bends."
  },
  {
    id: 'royal_crest',
    name: "Royal Crest",
    officialName: "Imperial Crest of the Winged Lion",
    slot: "Crest",
    category: "Sovereign Insignia (🛡️)",
    icon: "🛡️",
    rarity: "Mythic Signature (Ascendant)",
    rarityColor: "from-amber-600 via-red-600 to-purple-600",
    visualDescription: "A high-relief, hand-hammered brass and gold-gilded medallion depicting the roaring Winged Lion emblem of Crownspire. The lion's claws clutch a solid silver thunderbolt, while the outer rims are layered with crimson enamel and rubies.",
    artworkDirection: "Slightly angled side-profile. Focuses on the physical weight and weathered texture of the hammered gold-brass plate and the individual feathers of the lion's wings. Strong backlight from a warm campfire source, emphasizing the ruby reflections.",
    baseStats: { attack: 35, defense: 75, health: 380 },
    maxStats: { attack: 490, defense: 920, health: 5200 },
    passiveName: "Imperial Cohesion",
    passiveDesc: "Raises maximum legion recruitment draft limit by 8% and lowers battle casualties by 12% by converting fatalities into wounded personnel destined for high-efficiency apothecary tents.",
    upgradeBonuses: [
      { level: "+5", bonus: "Legion March Speed +8% on all terrains" },
      { level: "+10", bonus: "Legion Casualty-to-Wounded conversion rating +5%" },
      { level: "+15", bonus: "Alliance Rally Attack multiplier +5%" },
      { level: "+20", bonus: "Unlocks [Lions Call]: Grants +10% attack to reinforcement squads joining Maegan's active rally" }
    ],
    awakeningBonuses: [
      { star: 1, effect: "Legion casualty conversion rating increased from 12% to 15%." },
      { star: 2, effect: "Boosts maximum legion draft limit further to 12% total capacity." },
      { star: 3, effect: "Increases rally mobilization and reinforcement movement speed by +15%." },
      { star: 4, effect: "Raises retreat and repositioning speed by 20% to prevent legion wipes." },
      { star: 5, effect: "[Unifying Presence]: Grants all surrounding guild alliance members +2% troop defense in co-op world raids." }
    ],
    resonanceContribution: {
      points: 250,
      visualEffect: "Winged Lion Warpath",
      description: "Contributes 250 points to the Citadel Sovereign Resonance score. Unlocks the 'Winged Lion Warpath' world map trail, painting Maegan's troop trail with golden claw footprints."
    },
    fragmentAcquisition: "Sovereign Alliance Campaign Rank S Chests, or unlocked via Gold Gacha Summon drops (0.5% premium rate).",
    collectionBonus: "Citadel Codex Entry Bonus: Unlocks the 'Founders of the Vanguard' collection set bonus: Permanent +2.5% global army defense.",
    lore: "Originally pinned to the breastplate of High General Alistair, Maegan's grandfather, during the legendary defense of the Iron Bastion. It is a physical vow of military excellence, stained by years of soot and victories.",
    flavor: "The lion does not sleep when wolves circle the flock. Stand firm, legions!"
  },
  {
    id: 'sapphire_signet',
    name: "Sapphire Signet",
    officialName: "Sapphire Star-Map Ring of the Spire",
    slot: "Signet",
    category: "Astral Artifacts (🏺)",
    icon: "🏺",
    rarity: "Mythic Signature (Ascendant)",
    rarityColor: "from-amber-600 via-red-600 to-purple-600",
    visualDescription: "A massive signet ring composed of pure white-gold and heavy platinum bands, holding a flawless cabochon sapphire. Deep within the stone's crystalline depth, tiny miniature galactic systems shift and rotate, projecting laser-like starlight coordinates.",
    artworkDirection: "Extreme macro product shot focusing on the sapphire lens. Radiant blue and purple starlight beams cast rotating star-chart coordinates across a dark slate background, with tiny floating specks of dust catching the magical light.",
    baseStats: { attack: 70, defense: 40, health: 260 },
    maxStats: { attack: 1050, defense: 580, health: 3800 },
    passiveName: "Prism Overload",
    passiveDesc: "Active commander skills trigger a +15% Critical Strike factor for 6 seconds, bursting with violet cosmic fire that inflicts 120% area magic damage to adjacent enemy squads.",
    upgradeBonuses: [
      { level: "+5", bonus: "Critical Strike Damage +15% multiplier" },
      { level: "+10", bonus: "Active Skill Action Point cost reduced by 5%" },
      { level: "+15", bonus: "Elemental and Magic Spell damage output +8%" },
      { level: "+20", bonus: "Unlocks [Echoing Burst]: Violet cosmic fire has a 20% chance to cast twice" }
    ],
    awakeningBonuses: [
      { star: 1, effect: "Critical Strike factor bonus upgraded to 20%." },
      { star: 2, effect: "Increases Action Point regeneration rate by a permanent +10%." },
      { star: 3, effect: "Violet cosmic fire explosion damage scales up to 150%." },
      { star: 4, effect: "Extends active Critical Strike buff duration from 6 to 8 seconds." },
      { star: 5, effect: "[Supernova Spark]: Scoring an active skill critical strike instantly refunds 15% of the skill's action point cost." }
    ],
    resonanceContribution: {
      points: 250,
      visualEffect: "Astral Runes",
      description: "Contributes 250 points to the Citadel Sovereign Resonance score. Unlocks custom purple magical casting runes that rotate around Maegan's squads when executing special skills."
    },
    fragmentAcquisition: "Abyssal Gate Challenge Level 12 (Void Incursion), or elite tier rewards in the VIP Arena Shop.",
    collectionBonus: "Citadel Codex Entry Bonus: Permanent +3.0% magical and elemental damage output, and +4.0% hero exp training multipliers.",
    lore: "Discovered in the glowing crater of a fallen celestial star that struck the Whispering Canopy. Guild artisans tried to fracture it, but the gem resisted all hammer blows, acknowledging only the touch of royal starlight blood.",
    flavor: "The stars have written their judgment in deep sapphire. The enemy's fate is sealed."
  },
  {
    id: 'royal_charter',
    name: "Royal Charter",
    officialName: "Founding Covenant Scroll of Crownspire",
    slot: "Charter",
    category: "Ancestral Legacy (📜)",
    icon: "📜",
    rarity: "Mythic Signature (Ascendant)",
    rarityColor: "from-amber-600 via-red-600 to-purple-600",
    visualDescription: "A perfectly preserved scroll of cosmic star-silk, wrapped around two gold-capped obsidian scroll rods. Written in shimmering silver ink, the legal text pulses with warm light whenever an imperial heir stands nearby.",
    artworkDirection: "High-angle isometric shot of the partially unrolled scroll on a rustic wooden study table. The written characters glow intensely with a cool fluorescent blue neon light, highlighting the organic texture of the star-silk parchment.",
    baseStats: { attack: 50, defense: 50, health: 400 },
    maxStats: { attack: 750, defense: 750, health: 5500 },
    passiveName: "Empire Providence",
    passiveDesc: "Permanently cuts kingdom structure construction timers by 10% and upgrades legion barracks maximum recruitment training capacity by 15%.",
    upgradeBonuses: [
      { level: "+5", bonus: "City structure construction speed +5% global scale" },
      { level: "+10", bonus: "Legion unit training speed +10% speedup modifier" },
      { level: "+15", bonus: "Gold mine extraction speed +12% income generation" },
      { level: "+20", bonus: "Unlocks [Civic Prosperity]: Increases wood and stone base production rates by 5%" }
    ],
    awakeningBonuses: [
      { star: 1, effect: "Construction timer discount scales up to 12% total reduction." },
      { star: 2, effect: "Barracks legion training capacity upgraded to 20%." },
      { star: 3, effect: "Reduces the gold cost of all military research and upgrades by 10%." },
      { star: 4, effect: "Resource gathering map expeditions return 15% faster." },
      { star: 5, effect: "[Sovereign Covenant]: While Maegan is assigned as Governor of the Citadel, all defense troops receive +10% combat stats in friendly territory." }
    ],
    resonanceContribution: {
      points: 250,
      visualEffect: "Golden Laurel Frame",
      description: "Contributes 250 points to the Citadel Sovereign Resonance score. Unlocks the 'Golden Laurel Frame' overlay for the player's primary profile portrait, signaling imperial authority."
    },
    fragmentAcquisition: "Reward from the 'Spire Reconstitution' Epic Quest Chain, or exchanged in the Royal Library for 100 General Mythic Fragments.",
    collectionBonus: "Citadel Codex Entry Bonus: Permanent +5.0% city gold income generation and +5.0% military world march velocity.",
    lore: "The original constitutional agreement signed by the seven founding lords of the Alliance. It contains the sacred treaties, land charters, and laws that unified the realm of Crownspire under one glorious banner.",
    flavor: "Words written in starlight cannot be erased by sword, fire, or time."
  }
];
