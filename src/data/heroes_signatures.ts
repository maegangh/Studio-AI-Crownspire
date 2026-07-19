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

export interface HeroSignatureCrownmark {
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

export const HERO_SIGNATURE_CROWNMARKS: Record<string, HeroSignatureCrownmark[]> = {
  maegan: [
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
  ],
  shadow: [
    {
      id: 'twin_shadow_daggers',
      name: "Twin Shadow Daggers",
      officialName: "Twin Eclipse Blades of the First Shadow",
      slot: "Weapon",
      category: "Imperial Armaments (⚔️)",
      icon: "⚔️",
      rarity: "Mythic Signature (Ascendant)",
      rarityColor: "from-indigo-600 via-purple-600 to-zinc-800",
      visualDescription: "Sleek, double-edged obsidian daggers whose borders hum with a faint, light-drinking purple aura. The grips are wrapped in dark silk woven with shadow thread, culminating in a cold steel ring at the pommel.",
      artworkDirection: "Dynamic low-angle action shot of the blades crossed, one reflecting a sliver of violet starlight and the other completely black, casting a small gravitational bend on the surrounding dust particles.",
      baseStats: { attack: 115, defense: 10, health: 100 },
      maxStats: { attack: 1450, defense: 180, health: 1600 },
      passiveName: "Eclipse Strike",
      passiveDesc: "Strikes ignore 20% of the target legion’s armor rating, dealing pure critical backstab hits. Every 3rd critical strike places an 'Eclipse Mark' that detonates after 3 seconds, dealing 150% rogue damage.",
      upgradeBonuses: [
        { level: "+5", bonus: "Attack +12% physical armor-piercing bonus" },
        { level: "+10", bonus: "Critical Damage multiplier +8%" },
        { level: "+15", bonus: "Rogue movement rating +5% in stealth" },
        { level: "+20", bonus: "Unlocks [Eclipse Resonance]: Detonating an Eclipse Mark spreads it to one adjacent cohort" }
      ],
      awakeningBonuses: [
        { star: 1, effect: "Eclipse Strike armor bypass increased from 20% to 25%." },
        { star: 2, effect: "Increases base attack of this Crownmark by a permanent +15%." },
        { star: 3, effect: "Gives Shadow's cavalry units a permanent +10% charge damage bonus." },
        { star: 4, effect: "Reduces the trigger of Eclipse Mark detonation countdown by 1.0s." },
        { star: 5, effect: "[Abyssal Executioner]: When target health falls below 30%, Eclipse Mark detonation damage is tripled (450%)." }
      ],
      resonanceContribution: {
        points: 250,
        visualEffect: "Silent Veil",
        description: "Contributes 250 points to the Eclipse Covenant Resonance. Unlocks the 'Silent Veil' visual effect, leaving small vaporous purple footsteps on the world map."
      },
      fragmentAcquisition: "Infiltration Missions (Sovereign Level 8+) or purchased with Silent Shards in the Rogue Guild Repository.",
      collectionBonus: "Citadel Codex Entry Bonus: Permanent +2.5% Cavalry Attack and +3% scout movement speed.",
      lore: "Forged from blackened obsidian glass retrieved from the cold craters of the Dark Moon, these dual blades absorb and completely dissipate ambient light. They were held by the first master of the Eclipse Network to execute quietus on corrupted high archons.",
      flavor: "Justice is loudest when it is completely silent. Let their armor protect them from the wind, not from the night."
    },
    {
      id: 'assassin_mask',
      name: "Assassin Mask",
      officialName: "Porcelain Gaze of the Silent Specter",
      slot: "Helm",
      category: "Royal Regalia (👑)",
      icon: "👑",
      rarity: "Mythic Signature (Ascendant)",
      rarityColor: "from-indigo-600 via-purple-600 to-zinc-800",
      visualDescription: "An elegant, expressionless, hand-carved white porcelain plate mask with hollow eyes glowing with cold violet energy. Intricate black ink tattoos run along the cheekbones, indicating high espionage rank.",
      artworkDirection: "Close-up, high-contrast portrait of the mask. The porcelain surface shows subtle hairline fractures reflecting cold light. One eye glows with a piercing violet flame that slightly casts light onto the mask's right half.",
      baseStats: { attack: 40, defense: 55, health: 320 },
      maxStats: { attack: 480, defense: 850, health: 4800 },
      passiveName: "Specter Shroud",
      passiveDesc: "Prevents the legion from being targeted by scout radars, amplifying surprise flank damage by 25%. Reduces threat level inside territory by 40%.",
      upgradeBonuses: [
        { level: "+5", bonus: "Defense +10% stealth reinforcement scale" },
        { level: "+10", bonus: "Legion Health +8% survival increment" },
        { level: "+15", bonus: "Rampart Scout detection bypass rating +15%" },
        { level: "+20", bonus: "Unlocks [Specter Echo]: Getting detected grants +30% defense for 5 seconds to aid escape" }
      ],
      awakeningBonuses: [
        { star: 1, effect: "Specter Shroud surprise flank damage amplification raised from 25% to 30%." },
        { star: 2, effect: "Increases base health stat of this Crownmark by a permanent +15%." },
        { star: 3, effect: "Allied rogue units gain +10% skill damage mitigation." },
        { star: 4, effect: "Reduces cooldown of stealth activation by 4.0 seconds." },
        { star: 5, effect: "[Ghost Marshal]: When attacking from stealth, Shadow's vanguard cavalry units gain temporary physical immunity for 3 seconds." }
      ],
      resonanceContribution: {
        points: 250,
        visualEffect: "Faceless Gaze",
        description: "Contributes 250 points to the Eclipse Covenant Resonance. Unlocks the 'Faceless Gaze' avatar mask border overlay for in-game profiles."
      },
      fragmentAcquisition: "Citadel High Bounty Hunts: The Faceless Assassin, or exchanged for 50 Shadow Crests in the Alliance Depot.",
      collectionBonus: "Citadel Codex Entry Bonus: Permanent +2.0% scout range and +3.0% defense to all cavalry legions.",
      lore: "Worn by the legendary infiltrator Kaelen during the quiet infiltration of the Whispering Spires. The mask is said to hold the suppressed breath of a thousand ghosts, completely silencing the wearer’s heartbeat.",
      flavor: "Fear has no face, no pulse, and no mercy. We are the shadows that look back."
    },
    {
      id: 'shadow_cloak',
      name: "Shadow Cloak",
      officialName: "Sovereign Mantle of the Shrouded Cosmos",
      slot: "Crest",
      category: "Eternal Keepsakes (💝)",
      icon: "💝",
      rarity: "Mythic Signature (Ascendant)",
      rarityColor: "from-indigo-600 via-purple-600 to-zinc-800",
      visualDescription: "A high-collared flowing dark cape that flows and shifts as if composed of active starry night skies. Constellations slowly drift along the fabric, and the borders are secured by dark silver plates in the shape of raven wings.",
      artworkDirection: "Isometric view focusing on the shoulder armor plates. The star-field within the fabric has a real parallax depth, with stars twinkling and nebulae swirling softly under a cold key-light.",
      baseStats: { attack: 30, defense: 65, health: 420 },
      maxStats: { attack: 380, defense: 950, health: 5800 },
      passiveName: "Umbral Phase",
      passiveDesc: "When hit by enemy magical fire, there is a 30% chance to dissolve into mist and avoid all damage. Upon phasing, increases active dodge rate by 15% for 4 seconds.",
      upgradeBonuses: [
        { level: "+5", bonus: "Legion Defense +8% physical armor protection" },
        { level: "+10", bonus: "Phase trigger probability increased by +5%" },
        { level: "+15", bonus: "Debuff resistance scale +10%" },
        { level: "+20", bonus: "Unlocks [Phase Burst]: Phasing releases an umbral wave, slowing surrounding enemies by 25%" }
      ],
      awakeningBonuses: [
        { star: 1, effect: "Umbral Phase trigger probability is upgraded from 30% to 35%." },
        { star: 2, effect: "Increases base defense stat of this Crownmark by +15%." },
        { star: 3, effect: "Grants Shadow's cavalry units +10% magic evasion." },
        { star: 4, effect: "Reduces damage taken after phasing by an additional 12% for 3 seconds." },
        { star: 5, effect: "[Dimensional Slip]: If a killing blow is received, instantly triggers Umbral Phase with 100% chance, rendering the legion invulnerable for 2 seconds (180s cooldown)." }
      ],
      resonanceContribution: {
        points: 250,
        visualEffect: "Cosmic Displacement",
        description: "Contributes 250 points to the Eclipse Covenant Resonance. Unlocks the 'Cosmic Displacement' visual shimmering trail when changing directions on the field."
      },
      fragmentAcquisition: "Alliance Level 10 Guild War reward boxes or premium high-prestige gacha.",
      collectionBonus: "Citadel Codex Entry Bonus: Permanent +2.5% global army health and +3% gathering speed.",
      lore: "The supreme sign of office inside the Eclipse Network, woven from lunar-thread and star-dusted velvet. Legend says it was dipped in the pools of the Whispering Canopy, capturing a physical pocket of the void.",
      flavor: "You strike where I was, but never where I am. The void is my shield."
    },
    {
      id: 'night_emblem',
      name: "Night Emblem",
      officialName: "Sovereign Signet of the Silent Dawn",
      slot: "Signet",
      category: "Sovereign Insignia (🛡️)",
      icon: "🛡️",
      rarity: "Mythic Signature (Ascendant)",
      rarityColor: "from-indigo-600 via-purple-600 to-zinc-800",
      visualDescription: "A heavy onyx and gold signet ring with a carving of a crescent moon cutting a rising sun. Underneath, a sharp needle of pure titanium is hidden, designed to administer sleeping draughts.",
      artworkDirection: "Macro shot of a finger wearing the onyx signet ring while signing a rolled parchment scroll in dark purple ink. The wax seal glows with residual magical power.",
      baseStats: { attack: 75, defense: 30, health: 250 },
      maxStats: { attack: 1120, defense: 420, health: 3500 },
      passiveName: "Swift Flanker",
      passiveDesc: "Grants +15% cavalry march velocity and increases initial charging shock impact by +20%. If attacking an enemy from behind, increases critical chance by 10%.",
      upgradeBonuses: [
        { level: "+5", bonus: "Cavalry Attack +10% raw bonus" },
        { level: "+10", bonus: "Legion March speed +8% on grass/desert" },
        { level: "+15", bonus: "Charge impact stun chance +5%" },
        { level: "+20", bonus: "Unlocks [Flank Momentum]: Flank attacks generate +2 Action Points per second" }
      ],
      awakeningBonuses: [
        { star: 1, effect: "Cavalry march speed bonus increased from 15% to 18%." },
        { star: 2, effect: "Increases base attack stat of this Crownmark by +15%." },
        { star: 3, effect: "Gives cavalry units +10% armor penetration when flanking." },
        { star: 4, effect: "Extends Flank Momentum Action Point generation duration to 5 seconds." },
        { star: 5, effect: "[Terror Charge]: The initial charge shock impact inflicts 'Fear' on the target squad, reducing their attack speed by 30% for 4 seconds." }
      ],
      resonanceContribution: {
        points: 250,
        visualEffect: "Shadow Warpath",
        description: "Contributes 250 points to the Eclipse Covenant Resonance. Unlocks 'Shadow Warpath' map footprints with dark twilight vapor trails."
      },
      fragmentAcquisition: "Weekly League Tournament top tier rewards or Abyssal Raid Chests.",
      collectionBonus: "Citadel Codex Entry Bonus: Permanent +2.5% global army movement speed and +4% trade income.",
      lore: "Worn by the master spy who discovered the treason of the Duke of Valen. It represents the ultimate authority to command the secret informants, cutthroats, and cavalry scouts stationed throughout the seven provinces.",
      flavor: "They look to the front for the standard, but we strike from behind where there is only silence."
    },
    {
      id: 'smoke_bomb',
      name: "Smoke Bomb",
      officialName: "Espionage Cipher of the Silent Hand",
      slot: "Charter",
      category: "Ancestral Legacy (📜)",
      icon: "📜",
      rarity: "Mythic Signature (Ascendant)",
      rarityColor: "from-indigo-600 via-purple-600 to-zinc-800",
      visualDescription: "A compact, leather-bound journal bound with iron gears that require a specific magic combination to unlock. The pages are composed of dark star-silk, displaying fluctuating runes that rewrite themselves daily.",
      artworkDirection: "Isometric study shot of the cipher book lying half-open. Floating luminous letters hover above the pages, projecting miniature holographic structures of regional fortresses.",
      baseStats: { attack: 60, defense: 35, health: 340 },
      maxStats: { attack: 920, defense: 540, health: 4900 },
      passiveName: "Blindside Fog",
      passiveDesc: "Releases a dark purple smoke cloud, reducing opposing commander skill speeds by 25%. Also reduces enemy defense by 10% inside the cloud.",
      upgradeBonuses: [
        { level: "+5", bonus: "Scout movement speed +12%" },
        { level: "+10", bonus: "Hostile commander skill speed penalty raised to -28%" },
        { level: "+15", bonus: "Legion Gold harvesting efficiency +10%" },
        { level: "+20", bonus: "Unlocks [Poison Dust]: The fog inflicts 10% chemical poison damage per second" }
      ],
      awakeningBonuses: [
        { star: 1, effect: "Blindside Fog radius expanded by 20%." },
        { star: 2, effect: "Increases base defense stat of this Crownmark by +15%." },
        { star: 3, effect: "Reduces the gold cost of scouting and bounty missions by 15%." },
        { star: 4, effect: "Extends fog active duration by 3 seconds." },
        { star: 5, effect: "[Total Blackout]: Blindside Fog silences enemy active skills completely for the first 3 seconds of combat." }
      ],
      resonanceContribution: {
        points: 250,
        visualEffect: "Silent Herald",
        description: "Contributes 250 points to the Eclipse Covenant Resonance. Unlocks the 'Silent Herald' profile title decoration."
      },
      fragmentAcquisition: "Epic Quest 'The Shadow Network' completion reward, or high-tier Black Market trades.",
      collectionBonus: "Citadel Codex Entry Bonus: Permanent +4.0% global research speed and +3.0% training speed.",
      lore: "The legendary codebook of the Spire's black operations. It holds the true identities, safehouse layouts, and communication algorithms of every shadow cell operating beyond the Citadel's visible borders.",
      flavor: "He who controls information has won the battle before the first arrow is notched."
    }
  ],
  lorelai: [
    {
      id: 'moonkeepers_bow',
      name: "Moonkeeper's Bow",
      officialName: "Astral Chord Longbow of the Stars",
      slot: "Weapon",
      category: "Imperial Armaments (⚔️)",
      icon: "⚔️",
      rarity: "Mythic Signature (Ascendant)",
      rarityColor: "from-teal-500 via-blue-500 to-indigo-600",
      visualDescription: "A high, elegant silver longbow that glows with soft teal and white light. It has no physical string; instead, a glowing blue laser-like wire runs from tip to tip, creating translucent, starlight arrow shafts upon draw.",
      artworkDirection: "Slightly dynamic shot of the bow being drawn by invisible hands, the starlight string vibrating into visual light waves like sound frequencies. Floating musical notes surround the shaft.",
      baseStats: { attack: 100, defense: 10, health: 120 },
      maxStats: { attack: 1380, defense: 150, health: 1850 },
      passiveName: "Lunar Gale",
      passiveDesc: "Extends marksmen range by 15% and infuses normal arrows with +15% moon flare skill damage. Every 4th shot shoots a triple-spread arrow barrage.",
      upgradeBonuses: [
        { level: "+5", bonus: "Marksmen Attack +10% raw scale" },
        { level: "+10", bonus: "Range bonus increased to 18% total" },
        { level: "+15", bonus: "Critical shot accuracy +6%" },
        { level: "+20", bonus: "Unlocks [Vibrating Pitch]: Triples-spread arrow barrage now slows struck targets by 20%" }
      ],
      awakeningBonuses: [
        { star: 1, effect: "Lunar Gale marksmen range expansion increased from 15% to 20%." },
        { star: 2, effect: "Increases base attack of this Crownmark by a permanent +15%." },
        { star: 3, effect: "Adds 8% magical critical rate to Lorelai's marksmen cohorts." },
        { star: 4, effect: "Bridges skill damage: +10% skill damage of all supporting heroes." },
        { star: 5, effect: "[Moonlight Serenade]: Normal attacks have a 15% chance to trigger an instant Moon Flare skill cast at zero action points." }
      ],
      resonanceContribution: {
        points: 250,
        visualEffect: "Lunar Crest",
        description: "Contributes 250 points to the Lunar Symphony Resonance score. Unlocks 'Lunar Crest' aura around marksmen units in battle."
      },
      fragmentAcquisition: "Defeat the Lunar Spectre Boss in the Whispering Canopy Raid, or craft at the Star Forge.",
      collectionBonus: "Citadel Codex Entry Bonus: Permanent +2.5% Marksmen Attack and +5% troop gathering velocity.",
      lore: "Crafted by the ancient wood-weavers of the Whispering Canopy, this longbow was kissed by the Lunar Goddess herself. Its silverwood limbs are flexible as water but strong as dragon-bone, strung with a vibrating chord of pure lunar light.",
      flavor: "The moon does not strike in anger; it strikes in absolute harmony with the stars."
    },
    {
      id: 'lunar_tiara',
      name: "Lunar Tiara",
      officialName: "Silver Tiara of the Moon Temples",
      slot: "Helm",
      category: "Royal Regalia (👑)",
      icon: "👑",
      rarity: "Mythic Signature (Ascendant)",
      rarityColor: "from-teal-500 via-blue-500 to-indigo-600",
      visualDescription: "An intricate, thin silver crown decorated with fine crescents and vines, featuring a floating teardrop sapphire at the center of the forehead that rotates and pulses with soft aquatic light.",
      artworkDirection: "Elegant frontal shot focusing on the central teardrop sapphire. The crystal casts soft silver light beams that illuminate the surrounding metallic filigree like moonlight reflecting on water.",
      baseStats: { attack: 15, defense: 70, health: 490 },
      maxStats: { attack: 240, defense: 1080, health: 6800 },
      passiveName: "Harmony Hymn",
      passiveDesc: "Dispels ongoing frost or shadow curses from allied cohorts every 10 seconds, granting rapid health. Heals surrounding armies by 5% of their missing health upon cleanse.",
      upgradeBonuses: [
        { level: "+5", bonus: "Legion Health +10% raw scale" },
        { level: "+10", bonus: "Defense +10% base modifier" },
        { level: "+15", bonus: "Curse Cleansing frequency reduced to 8s" },
        { level: "+20", bonus: "Unlocks [Hymn of Fortitude]: Cleansing a curse grants +15% defense rating for 4 seconds" }
      ],
      awakeningBonuses: [
        { star: 1, effect: "Harmony Hymn heal rating raised from 5% to 8% of missing health." },
        { star: 2, effect: "Increases base health stat of this Crownmark by +20%." },
        { star: 3, effect: "Allied marksmen units gain a permanent +12% health boost." },
        { star: 4, effect: "Shortens the duration of incoming stun effects by 25%." },
        { star: 5, effect: "[Divine Aegis]: Cleanse triggers a temporary starlight barrier absorbing 10% of maximum HP damage for 5 seconds." }
      ],
      resonanceContribution: {
        points: 250,
        visualEffect: "Glow Halo",
        description: "Contributes 250 points to the Lunar Symphony Resonance score. Unlocks the 'Glow Halo' around Lorelai's head in tactical battles."
      },
      fragmentAcquisition: "Campaign Achievement: Unlocked after chapter 15-5 star completions or high-tier Temple Store exchange.",
      collectionBonus: "Citadel Codex Entry Bonus: Permanent +3.0% city wall durability and +4.0% barracks training velocity.",
      lore: "Given to Lorelai when she became the head Keeper of the Lunar Chords. It holds a sacred moonstone that hums with the soft protective songs of the first Priestess, shielding the wearer’s mind from shadow corruption.",
      flavor: "Through the darkest night, the melody of the goddess shields those who walk in her song."
    },
    {
      id: 'moon_crystal_crownmark',
      name: "Moon Crystal Orb",
      officialName: "Moon Crystal Orb of Astral Harmony",
      slot: "Crest",
      category: "Astral Artifacts (🏺)",
      icon: "🏺",
      rarity: "Mythic Signature (Ascendant)",
      rarityColor: "from-teal-500 via-blue-500 to-indigo-600",
      visualDescription: "A heavy, spinning sphere of pure translucent selenite, surrounded by floating rings of white-gold and silver that spin in opposite directions. The core is warm, glowing with moving stellar gas.",
      artworkDirection: "Macro shot of the floating orb, capturing the detailed stellar maps drifting inside the selenite crystal. Glowing violet gravitational dust circles the orb.",
      baseStats: { attack: 45, defense: 50, health: 440 },
      maxStats: { attack: 680, defense: 740, health: 5900 },
      passiveName: "Astral Resonance",
      passiveDesc: "Reclaims 15% of fallen vanguard troops, reviving them into active fighting ranks at zero cost. Reclaimed units gain +10% damage for 5 seconds.",
      upgradeBonuses: [
        { level: "+5", bonus: "Healing recovery power +10%" },
        { level: "+10", bonus: "Reclaim rate increased to 18% total" },
        { level: "+15", bonus: "Skill Action Point cost reduced by 8%" },
        { level: "+20", bonus: "Unlocks [Astral Infusion]: Reclaimed troops have 30% chance to cast a minor moon bolt" }
      ],
      awakeningBonuses: [
        { star: 1, effect: "Astral Resonance troop reclaim rating raised from 15% to 20%." },
        { star: 2, effect: "Increases base defense stat of this Crownmark by +15%." },
        { star: 3, effect: "Boosts commander magical damage output by +12%." },
        { star: 4, effect: "Action Point cost reduction further increased to 12%." },
        { star: 5, effect: "[Resurrection Chords]: Revives 1 deceased commander or elite troop squad upon battle start at half HP (once per battle)." }
      ],
      resonanceContribution: {
        points: 250,
        visualEffect: "Gravitational Orbit",
        description: "Contributes 250 points to the Lunar Symphony Resonance score. Unlocks rotating starlight particles around Lorelai's active armies."
      },
      fragmentAcquisition: "Guild Raid Boss: The Void Archon or VIP Shop exchange.",
      collectionBonus: "Citadel Codex Entry Bonus: Permanent +2.0% global army critical rate and +4.0% apothecary healing efficiency.",
      lore: "A relic fallen from the white moon itself during the First Eclipse. This floating, perfectly spherical crystal carries an intense gravity-reversing aura, allowing weavers to reconstruct physical matter through high-frequency sound waves.",
      flavor: "Death is but a brief pause in the grand symphony. Let the chords play on!"
    },
    {
      id: 'silver_pendant',
      name: "Silver Pendant",
      officialName: "Silver Pendant of the Lunar Weaver",
      slot: "Signet",
      category: "Sovereign Insignia (🛡️)",
      icon: "🛡️",
      rarity: "Mythic Signature (Ascendant)",
      rarityColor: "from-teal-500 via-blue-500 to-indigo-600",
      visualDescription: "A complex, multi-layered silver pendant featuring a central crescent moon clutching a brilliant star sapphire. The metallic arms of the pendant rotate in sync with the real-world moon phases.",
      artworkDirection: "Product-style macro shot from an angle. Refined light glints off the polished silver surface, with soft light casting a crescent shadow onto the background cloth.",
      baseStats: { attack: 65, defense: 40, health: 280 },
      maxStats: { attack: 980, defense: 620, health: 4100 },
      passiveName: "Weaver Blessing",
      passiveDesc: "Increases global march velocity by 12% and amplifies active hero traits by 10%. Boosts allied marksmen movement speed by an additional 8%.",
      upgradeBonuses: [
        { level: "+5", bonus: "March Speed +8% global" },
        { level: "+10", bonus: "Hero trait amplification raised to 15%" },
        { level: "+15", bonus: "Ranged cohort breakthrough rating +6%" },
        { level: "+20", bonus: "Unlocks [Quickstep Chord]: March speed is doubled for the first 5 seconds after exiting a city" }
      ],
      awakeningBonuses: [
        { star: 1, effect: "Weaver Blessing global march velocity increase raised to 15%." },
        { star: 2, effect: "Increases base attack stat of this Crownmark by +15%." },
        { star: 3, effect: "Gives allied marksmen cohorts +10% critical damage." },
        { star: 4, effect: "Reduces terrain speed penalties (forest, swamp) by 30%." },
        { star: 5, effect: "[Weaving Swiftness]: Activates 'Wind-Rider': allows allied marksmen to fire while moving at 50% basic damage output." }
      ],
      resonanceContribution: {
        points: 250,
        visualEffect: "Lunar Stride",
        description: "Contributes 250 points to the Lunar Symphony Resonance score. Unlocks silver dust footprints when marching on the world map."
      },
      fragmentAcquisition: "Whispering Canopy Side-Quests and high-tier Campaign milestone rewards.",
      collectionBonus: "Citadel Codex Entry Bonus: Permanent +3.0% global march speed and +4.0% wood extraction speed.",
      lore: "Passed down through generations of Weavers of the Whispering Canopy. The amulet tracks the celestial movements of the moons and stars, shifting its silver weight in alignment with cosmic ley-lines.",
      flavor: "We do not follow paths; we weave them out of moonlight and stardust."
    },
    {
      id: 'celestial_tome',
      name: "Celestial Tome",
      officialName: "Celestial Tome of the Constellations",
      slot: "Charter",
      category: "Ancestral Legacy (📜)",
      icon: "📜",
      rarity: "Mythic Signature (Ascendant)",
      rarityColor: "from-teal-500 via-blue-500 to-indigo-600",
      visualDescription: "A large, ancient leather-bound book wrapped in glowing brass bindings. Its pages are composed of deep blue velvet, displaying moving, holographic-like constellations that drift on touch.",
      artworkDirection: "An overhead shot of the open book on an astronomer's desk. Constellations like the Winged Lion and Silver Dragon hover slightly above the pages, casting starry dust onto old navigation charts.",
      baseStats: { attack: 55, defense: 45, health: 390 },
      maxStats: { attack: 850, defense: 680, health: 5600 },
      passiveName: "Cosmos Archives",
      passiveDesc: "Elevates global magical research speed by 10% and awards +15% extra hero training experience. Also reduces gold cost of all military research by 8%.",
      upgradeBonuses: [
        { level: "+5", bonus: "Research speed +5% global scale" },
        { level: "+10", bonus: "Hero experience bonus raised to 20%" },
        { level: "+15", bonus: "Alchemical gold research efficiency +8%" },
        { level: "+20", bonus: "Unlocks [Astrological Favor]: Increases critical research success rating by 15%" }
      ],
      awakeningBonuses: [
        { star: 1, effect: "Research speed discount increased to 12% total." },
        { star: 2, effect: "Increases base defense stat of this Crownmark by +15%." },
        { star: 3, effect: "Reduces the material cost of all tech upgrades (food, wood, stone) by 10%." },
        { star: 4, effect: "Saves 10% of research time by returning instant speedup credits." },
        { star: 5, effect: "[Star Alignment]: All technology research structures operate at +20% speed when Lorelai is stationed as Chief Scholar." }
      ],
      resonanceContribution: {
        points: 250,
        visualEffect: "Star Scholar",
        description: "Contributes 250 points to the Lunar Symphony Resonance score. Unlocks the 'Star Scholar' avatar border decoration."
      },
      fragmentAcquisition: "Sovereign Citadel Library research challenges or VIP level 10 rewards.",
      collectionBonus: "Citadel Codex Entry Bonus: Permanent +5.0% tech research velocity and +3.0% gold production.",
      lore: "The celestial library's most guarded scroll-book, recording the alignments, orbits, and magical coordinate formulas of the seven stars of Crownspire. It was written in stellar ink that never fades.",
      flavor: "The answers to our struggles are not written on the ground, but in the eternal dance of the stars."
    }
  ],
  dominic: [
    {
      id: 'vanguard_shield',
      name: "Vanguard Shield",
      officialName: "Steel Wall Vanguard Bulwark",
      slot: "Weapon",
      category: "Imperial Armaments (⚔️)",
      icon: "⚔️",
      rarity: "Mythic Signature (Ascendant)",
      rarityColor: "from-slate-600 via-zinc-700 to-amber-700",
      visualDescription: "A massive, rectangular tower shield composed of meteorite steel and layered gold-bronze plaques. Deep grooves and ancient earth runes are etched on its surface, and heavy spike points emerge from the base.",
      artworkDirection: "Low-angle dramatic shot of the shield planted firmly in a battlefield of cracked stones. Small embers and orange sparks drift past, catching the steel reflection under a heavy twilight key-light.",
      baseStats: { attack: 50, defense: 95, health: 300 },
      maxStats: { attack: 680, defense: 1420, health: 4800 },
      passiveName: "Unyielding Gaze",
      passiveDesc: "Completely blocks the first skill cast strike from enemy commanders and elevates defense by 15%. Every block releases a seismic shockwave dealing 80% physical damage.",
      upgradeBonuses: [
        { level: "+5", bonus: "Defense +12% heavy armor bonus" },
        { level: "+10", bonus: "Infantry Block Rating +8% efficiency" },
        { level: "+15", bonus: "Shockwave damage rating +15%" },
        { level: "+20", bonus: "Unlocks [Iron Ground]: Standing still for 5s grants +15% damage mitigation" }
      ],
      awakeningBonuses: [
        { star: 1, effect: "Unyielding Gaze defense boost raised from 15% to 18%." },
        { star: 2, effect: "Increases base defense of this Crownmark by a permanent +15%." },
        { star: 3, effect: "Gives allied infantry units a permanent +12% block multiplier." },
        { star: 4, effect: "Unyielding Gaze now blocks the first 2 enemy active skills instead of 1." },
        { star: 5, effect: "[Sovereign Bastion]: When shield is active, blocks all flanking backstab damage completely, reflecting 15% back." }
      ],
      resonanceContribution: {
        points: 250,
        visualEffect: "Iron Shell",
        description: "Contributes 250 points to the Stone Guard Resonance score. Unlocks the 'Iron Shell' visual protective bubble around Dominic's squad in battle."
      },
      fragmentAcquisition: "Sovereign Defense Chapter completions (18-10+) or purchased with Guard Crests at the Citadel Garrison.",
      collectionBonus: "Citadel Codex Entry Bonus: Permanent +2.5% Infantry Defense and +4% city wall reconstruction speed.",
      lore: "Forged inside the volcanic pits of the Iron Mountains, this massive tower shield was used by High Vanguard Dominic during the catastrophic breach of the Outer Wall. Its face is scarred by direct dragon-fire.",
      flavor: "Let them send their dragons, their titans, and their shadows. This shield shall not yield a single inch."
    },
    {
      id: 'marshals_greaves',
      name: "Marshal's Greaves",
      officialName: "Iron Greaves of the Citadel Wall",
      slot: "Helm",
      category: "Royal Regalia (👑)",
      icon: "👑",
      rarity: "Mythic Signature (Ascendant)",
      rarityColor: "from-slate-600 via-zinc-700 to-amber-700",
      visualDescription: "Heavy, layered plate greaves and boots wrapped in dark iron coils and reinforced with solid steel rivets. The boots feature broad, wedge-like soles designed to anchor the wearer deep into solid stone.",
      artworkDirection: "Ground-level close-up shot of the heavy greaves stomping onto the earth, cracking the ground and sending small pebbles flying. Deep dust clouds swirl in the background.",
      baseStats: { attack: 25, defense: 75, health: 460 },
      maxStats: { attack: 380, defense: 1120, health: 6500 },
      passiveName: "Iron Pillar",
      passiveDesc: "Provides complete CC, knockback, and stun immunity to infantry cohorts, holding frontlines solid. Increases legion crowd-control resistance by 25%.",
      upgradeBonuses: [
        { level: "+5", bonus: "Defense +10% raw scale" },
        { level: "+10", bonus: "Legion Health +8% vitality increment" },
        { level: "+15", bonus: "Crowd Control resistance +10%" },
        { level: "+20", bonus: "Unlocks [Anchored Resolve]: When anchored, increases counter-attack damage by 20%" }
      ],
      awakeningBonuses: [
        { star: 1, effect: "Stun immunity is extended to surrounding allied commander cohorts within 2 hexes." },
        { star: 2, effect: "Increases base health stat of this Crownmark by a permanent +15%." },
        { star: 3, effect: "Adds +10% defense to Dominic's primary shield phalanx." },
        { star: 4, effect: "Anchored Resolve triggers with 30% lower setup time requirements." },
        { star: 5, effect: "[Earth Pillar]: Stomping triggers a localized earthquake, slowing all surrounding enemy cavalry units by 40% for 5 seconds." }
      ],
      resonanceContribution: {
        points: 250,
        visualEffect: "Earthquake Ripple",
        description: "Contributes 250 points to the Stone Guard Resonance score. Unlocks ground-cracking ripple rings on Dominic's squad in strategic battle mode."
      },
      fragmentAcquisition: "Alliance Level 12 Guild Boss or VIP Arena shop.",
      collectionBonus: "Citadel Codex Entry Bonus: Permanent +3.0% infantry cohort health and +5% city defense parameters.",
      lore: "Crafted from raw iron blocks mined during the First Foundation. Dominic wore these heavy greaves during the long 40-day march to the Iron Bastion, surviving multiple landslide assaults and giant strikes.",
      flavor: "The ground is ours. Where we plant our feet, there the empire begins."
    },
    {
      id: 'iron_signet_crownmark',
      name: "Iron Signet",
      officialName: "Insignia Medal of the Iron Gate",
      slot: "Crest",
      category: "Sovereign Insignia (🛡️)",
      icon: "🛡️",
      rarity: "Mythic Signature (Ascendant)",
      rarityColor: "from-slate-600 via-zinc-700 to-amber-700",
      visualDescription: "A heavy, square iron crest medallion featuring high-relief carvings of the massive stone outer gate of Crownspire. Dark green enamel trims the border, depicting protective ivy vines.",
      artworkDirection: "Close-up shot of the emblem pinned to a weathered leather mantle. The metal is scratched and covered in soot, but the polished green border catches a bright highlight.",
      baseStats: { attack: 60, defense: 55, health: 340 },
      maxStats: { attack: 920, defense: 840, health: 4900 },
      passiveName: "Warlord Decree",
      passiveDesc: "Reduces the movement speed of attacking cavalry by 15% and increases troop health parameters by 10%.",
      upgradeBonuses: [
        { level: "+5", bonus: "Cavalry slowdown efficiency increased to 18%" },
        { level: "+10", bonus: "Legion health parameter raised to 12%" },
        { level: "+15", bonus: "Siege defense speed +10%" },
        { level: "+20", bonus: "Unlocks [Defiance Stance]: Cav reduction radius increased by +1 hex" }
      ],
      awakeningBonuses: [
        { star: 1, effect: "Cavalry movement speed penalty raised from 15% to 20%." },
        { star: 2, effect: "Increases base attack stat of this Crownmark by +15%." },
        { star: 3, effect: "Infantry units gain +10% damage bonus against cavalry cohorts." },
        { star: 4, effect: "Reduces the cavalry charge damage taken by Dominic's cohorts by 25%." },
        { star: 5, effect: "[Garrison Master]: Dominic's cohorts gain a massive +25% defense when stationed inside cities, fortresses, or resource flags." }
      ],
      resonanceContribution: {
        points: 250,
        visualEffect: "Iron Citadel Aura",
        description: "Contributes 250 points to the Stone Guard Resonance score. Unlocks the 'Iron Citadel' visual profile card border for players."
      },
      fragmentAcquisition: "Guild Tournament Rank S Chest rewards or Campaign Milestone completion.",
      collectionBonus: "Citadel Codex Entry Bonus: Permanent +3.0% structural fortress defense and +5% troop hospital size limits.",
      lore: "Issued to the defenders of the Seven Arches during the Battle of the Great Gate. It represents the ultimate dedication to territorial security, ensuring allied guards maintain high morale under sieges.",
      flavor: "They shall spend their cavalry against our gates, only to find they have charged into a wall of solid stone."
    },
    {
      id: 'concordat_plate',
      name: "Concordat Plate Mail",
      officialName: "Concordat Plate Mail of Volcanic Earth",
      slot: "Signet",
      category: "Astral Artifacts (🏺)",
      icon: "🏺",
      rarity: "Mythic Signature (Ascendant)",
      rarityColor: "from-slate-600 via-zinc-700 to-amber-700",
      visualDescription: "A dark steel breastplate with heavy, interlocking plates glowing with dull magma-like orange veins along the carvings. A heavy collar plate shields the neck from incoming ballista shards.",
      artworkDirection: "Angled view of the breastplate, with bright molten orange lines running through the steel cracks. Light rises from below, highlighting the physical depth and thickness of the plating.",
      baseStats: { attack: 35, defense: 85, health: 410 },
      maxStats: { attack: 520, defense: 1240, health: 5800 },
      passiveName: "Ballista Warding",
      passiveDesc: "Reduces incoming structural siege and ballista bolt splash damage by 20% on the world map. Restores 3% army health when hit by long-range siege skills.",
      upgradeBonuses: [
        { level: "+5", bonus: "Defense +10% volcanic armor multiplier" },
        { level: "+10", bonus: "Siege damage reduction raised to 25%" },
        { level: "+15", bonus: "Legion Health +8% vitality scale" },
        { level: "+20", bonus: "Unlocks [Magma Shield]: Takes 15% less skill damage from siege ballistas" }
      ],
      awakeningBonuses: [
        { star: 1, effect: "Ballista splash damage mitigation increased from 20% to 25%." },
        { star: 2, effect: "Increases base defense stat of this Crownmark by a permanent +15%." },
        { star: 3, effect: "Allied vanguard infantry units gain a permanent +10% armor rating." },
        { star: 4, effect: "Heal rating on siege skill hit upgraded to 5% of maximum HP." },
        { star: 5, effect: "[Volcanic Aegis]: Triggers 'Eruption Shroud': when legion falls below 35% health, releases a magma burst dealing 200% magic fire damage and blinding attackers for 3 seconds." }
      ],
      resonanceContribution: {
        points: 250,
        visualEffect: "Volcanic Aura",
        description: "Contributes 250 points to the Stone Guard Resonance score. Unlocks red hot magma particles around commander squads on the map."
      },
      fragmentAcquisition: "Defeat Chapter 22 Boss Gorgoroth or VIP Store high-tier crates.",
      collectionBonus: "Citadel Codex Entry Bonus: Permanent +2.5% global army defense and +4.0% brick/stone mining speeds.",
      lore: "The legendary armor forged during the Treaty of Union between humans and masonry clans. Infused with rich volcanic earth mana, it acts as a walking fortress, absorbing heavy physical and magical splash fire.",
      flavor: "The fire of the volcano forged our covenant, and the earth itself shall rise to protect it."
    },
    {
      id: 'banner_of_victory',
      name: "Banner of Victory",
      officialName: "Banner of Victory and Vanguard Resolve",
      slot: "Charter",
      category: "Ancestral Legacy (📜)",
      icon: "📜",
      rarity: "Mythic Signature (Ascendant)",
      rarityColor: "from-slate-600 via-zinc-700 to-amber-700",
      visualDescription: "A large, tattered silk banner in deep royal crimson, supported by a heavy obsidian flagpole capped with a brass lion head. Gold-gilded wings frame the edges of the cloth.",
      artworkDirection: "Dynamic wide shot of the crimson banner waving proudly against a smoky, war-torn orange sky. The fabric is torn but glowing with bright gold runes representing unyielding resolve.",
      baseStats: { attack: 65, defense: 35, health: 430 },
      maxStats: { attack: 980, defense: 580, health: 6200 },
      passiveName: "Vanguard Tenacity",
      passiveDesc: "Empowers legions, letting them fight at 100% damage output even when squad sizes drop below 30%. Also raises troop defense by +10% at low health.",
      upgradeBonuses: [
        { level: "+5", bonus: "Legion Attack +8% under low health" },
        { level: "+10", bonus: "Barracks recruitment speed +10%" },
        { level: "+15", bonus: "Alliance Rally Health +8% increment" },
        { level: "+20", bonus: "Unlocks [Tenacious Aura]: Surrounding allied cohorts gain +10% defense when Dominic is below 50% health" }
      ],
      awakeningBonuses: [
        { star: 1, effect: "Vanguard Tenacity low health defense bonus upgraded to 15%." },
        { star: 2, effect: "Increases base health stat of this Crownmark by a permanent +20%." },
        { star: 3, effect: "Speeds up garrison reinforcement movement velocity by 20%." },
        { star: 4, effect: "Reduces wounded troop casualty recovery costs in hospitals by 15%." },
        { star: 5, effect: "[Unbroken Command]: While Maegan and Dominic are rallied in the same alliance battle group, both gain a permanent +10% damage bonus." }
      ],
      resonanceContribution: {
        points: 250,
        visualEffect: "Vanguard Trail",
        description: "Contributes 250 points to the Stone Guard Resonance score. Unlocks red rose footprint trails when marching on the map."
      },
      fragmentAcquisition: "Sovereign Epic Quest 'The Wall Stands' completion or High Arena Shop.",
      collectionBonus: "Citadel Codex Entry Bonus: Permanent +5.0% global healing speed and +3.0% march speed during defensive campaigns.",
      lore: "The supreme battle standard of the first Vanguard Legion. Stained with blood and scorched by wars, it was never allowed to touch the ground during three centuries of defensive combat.",
      flavor: "Keep the banner high, brothers! A soldier of the Spire does not falter while the lion roars!"
    }
  ]
};
