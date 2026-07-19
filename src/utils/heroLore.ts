import { HeroLore } from '../types';

export const HERO_LORE_DATABASE: Record<string, HeroLore> = {
  maegan: {
    origin: "Capital Realm of Crownspire",
    biography: "Raised on the high battlements of the Inner Capital, Maegan rose from a swordguard recruit to Supreme Lord Marshal of Crownspire. She singlehandedly repulsed the shadow tide during the Siege of the East Gate, cementing her legend of defensive dominance.",
    personality: "Duty-bound, unyielding, and iron-hearted. Her absolute presence on the battlefield acts as a beacon of unmoving resolution for flanking legion cohorts.",
    relationships: "Stalwart mentor to the young Commander Rex; works in constant, tense professional cooperation with rogue shadow-blade Shadow.",
    quote: "The fortress is not built of polished granite, but of the bones of our resolved defenders.",
    recruitment: "Formally pledged her life and her legion's ancient iron standard to the High Sovereign upon the successful reclamation of the crown heights."
  },
  lorelai: {
    origin: "Shattered Reefs Coasts",
    biography: "An ancient elven singer from the coral palaces, Lorelai can weave her ocean-attuned mana through the strings of her celestial harp. Her mystical melodies are said to stop fatal hemorrhaging and soothe battlefield trauma.",
    personality: "Enigmatic, graceful, and deeply empathetic. She often speaks in high-tempo oceanic metaphors, constantly searching for world-harmony.",
    relationships: "Maintains a close poetic partnership with Aria, and shares a deep tactical fast-travel rivalry with Skye.",
    quote: "Even the loudest war storms must bend to the tranquil current of a silent chorus.",
    recruitment: "Traveled to Crownspire to seek aid when pirate drakes invaded her sacred coral shoals, sealing an alliance of blood and song."
  },
  myshla: {
    origin: "Ironvein Chasm",
    biography: "An esteemed Geomancer of the deep earth who communicates directly with crystalline ores. She spearheaded the architectural fortification of Crownspire's innermost subterranean vaults.",
    personality: "Patient, quiet, and ancient-minded. She possesses a slow but unstoppable tectonic wrath when her deep mines are disturbed.",
    relationships: "Maintains a professional disdain for Volkan's chaotic explosive works; deeply respects Remi's architectural masonry.",
    quote: "True steel is refined slow and silent under a million tons of continental pressure.",
    recruitment: "Pledged her geode hammer to Crownspire's base after signing a historic mineral pact with the Lord Marshal."
  },
  shadow: {
    origin: "Silent Fenns Slums",
    biography: "A legendary cutthroat assassin who has spent his life navigating the misty, toxic marshland slums. He is Crownspire's premier spec-ops asset, neutralizing high-value targets in silence.",
    personality: "Pragmatic, cynical, and highly secretive. He operates on logical utility alone, unconcerned with concepts of personal honor.",
    relationships: "Maintains a close, back-and-forth espionage rivalry with Skye; works under high mutual suspicion with Heaven.",
    quote: "They only realize the blade exists when they are already sliding into the dark.",
    recruitment: "Recruited out of a smoke-filled tavern cell in the base, exchanging his lethal talents for a clean slate and full royal pardon."
  },
  rayne: {
    origin: "Whispering Canopy Plains",
    biography: "Born during a thunderclaw storm, Rayne is a skirmishing ranger capable of channeling storm-winds through her compound longbow. She spent decades guarding the outer woodland border.",
    personality: "Fierce, impulsive, and sharp-tongued. She values action over dialogue and has little patience for courtly protocols.",
    relationships: "Deeply bonded with her scout partner Skye; highly suspicious of Noxx's biochemical plague methods.",
    quote: "A storm doesn't offer explanations. Neither do my arrows.",
    recruitment: "Joined the battle after Sovereign soldiers defended her ancestral grove from an elite shadow vanguard raid."
  },
  rex: {
    origin: "Gilded Grasslands Outposts",
    biography: "A bold young vanguard captain who fought his way up from the outer defense outposts. Equipped with massive gilded shields and a resolute heart, he leads crucial heavy-armor breakthroughs.",
    personality: "Enthusiastic, honorable, and fiercely loyal. He strives everyday to live up to the highest ideals of knightly chivalry.",
    relationships: "Deeply admires and studies under the Lord Marshal Maegan; training partner and rival of Dominic.",
    quote: "My shield stands for those who cannot stand! We do not yield an inch!",
    recruitment: "Awarded a permanent post in the Sovereign vanguard after blocking a collapsing fortress archway so citizens could flee."
  },
  lumi: {
    origin: "Everfrost Ridge Clans",
    biography: "A frosty glaciomancer and field apothecary from the blizzard terrains, capable of freezing open wounds while locking enemy lines in thick ice grids.",
    personality: "Cool, analytical, and meticulously precise. She possesses an air of absolute calm under the most intense enemy barrages.",
    relationships: "Maintains a sisterly connection with Allanna, and relies on Dominic's phalanx walls to secure her advanced healing field tents.",
    quote: "Winter does not weep for the fallen; it merely preserves their memory.",
    recruitment: "Signed a mutual defense treaty with Crownspire to protect her high glacier peaks from the Arch-Lich's warmongers."
  },
  heaven: {
    origin: "Aurelia Palace Square",
    biography: "A high Templar knight of the Order of Light, she wields a sacred celestial lance capable of summoning orbital solar rays to incinerate demonic corruption.",
    personality: "Devout, serene, and charismatic. She holds a near-religious faith in the eventual victory of the light.",
    relationships: "Actively strives to redeem Demon's dark soul; closely consults with Faith on spiritual texts.",
    quote: "By the light, all shadows shall be cast out. Be comforted, the Dawn has arrived.",
    recruitment: "Sent by the High Order of Aurelia to guide and support Crownspire's Sovereign forces during the pitch-black rifts."
  },
  demon: {
    origin: "Ashfire Crater Depths",
    biography: "A rogue infernal beast lord who broke free from the demonic chains of the lower volcanic rifts. Wields a colossal obsidian broadsword that leaks flowing brimstone.",
    personality: "Aggressive, volatile, and deeply brooding. He constantly battles his inner destructive rages.",
    relationships: "Stands under heavy constant surveillance by Heaven; has a unspoken combat brotherhood with Volkan.",
    quote: "My fire will consume their rotting worlds, even if I have to burn with it.",
    recruitment: "Captured in the brimstone canyons and pardoned under a blood-covenant, swearing to redirect his wrath entirely at the undead."
  },
  allanna: {
    origin: "Aurelia Cathedral Hill",
    biography: "An arch-priestess who spent her youth preserving sacred scripts. She brings unparalleled light shielding to Crownspire's defensive squads.",
    personality: "Compassionate, gentle, and softly spoken. She acts as a comforting mother-figure to the wounded base soldiers.",
    relationships: "Sisterly companion to Lumi, and highly cooperative with Faith in managing base spiritual morale.",
    quote: "Let the light form an impenetrable wall, shielding all who seek refuge.",
    recruitment: "Left her quiet sanctuary when the cathedral bells rang, realizing that the front lines needed salvation more than empty shrines."
  },
  savannah: {
    origin: "Gilded Grasslands",
    biography: "A legendary equestrian gatherer and scout, capable of navigating vast open plains to locate essential granaries and structural rich glades.",
    personality: "Cheerfully optimistic, nature-loving, and deeply observant. She finds joy in simple field harvests and open skies.",
    relationships: "Works closely with Remi to secure raw build materials; values the weather warnings of Skye.",
    quote: "A rich harvest feeds the soul of the legion. Let us clear the glades safely.",
    recruitment: "Offered her grand harvesting networks and steed scouts to Crownspire in exchange for protecting her agrarian homelands."
  },
  aria: {
    origin: "Shattered Reefs Isle",
    biography: "A bardic virtuoso who uses sonic resonance to coordinate legion volleys, turning battlefield sounds into structured weapons of war.",
    personality: "Animated, eccentric, and highly passionate about acoustic theory. She is easily distracted by nice tunes.",
    relationships: "Artistic partner to Lorelai; close friend and training companion of Maegan.",
    quote: "The beat of the march is the pulse of victory. Keep the rhythm high!",
    recruitment: "Signed onto the sovereign roster after using her sonic spells to singlehandedly save a convoy of royal merchant ships."
  },
  dominic: {
    origin: "Sovereign Frontier Bastions",
    biography: "A veteran heavy shieldguard who has spent forty years holding the outer rim bastions. He is the vanguard's chief tactician for phalanx deployments.",
    personality: "Sardonic, gritty, and fiercely protective of young soldiers. He speaks with a raspy voice from breathing ashfire soot.",
    relationships: "Grizzled trainer to Captain Rex; works closely with Lumi to protect back-row spellcasting units.",
    quote: "Stay tight, shields locked! No draft of wind gets through this wall!",
    recruitment: "Voluntarily left retirement when the first volcanic rifts opened, returning to lead his surviving comrades in the vanguard."
  },
  skye: {
    origin: "Skyward Plateau Peaks",
    biography: "A daring pegasus scout captain who commands the winds of high plateaus, providing flawless battlefield intelligence and precision gale strikes.",
    personality: "Bold, adventurous, and fiercely independent. She is happiest when sailing high over the storm clouds.",
    relationships: "Fast-travel rival to Lorelai; trusted scouting associate of Shadow and Rayne.",
    quote: "From the clouds, we see the end of their plans before they even write them.",
    recruitment: "Swore an oath to the Sovereign after saving her pegasus roost from a vicious airborne harpy swarm."
  },
  noxx: {
    origin: "Silent Fenns Crypts",
    biography: "An outcast plague doctor and alchemist who spent decades researching necrotic toxic clouds in order to engineer potent counter-toxins.",
    personality: "Cold, curious, and socially detached. He looks at life through a lens of chemical equations and physical decay.",
    relationships: "Highly distrusted by Rayne; maintains a technical alchemy correspondence with Lumi.",
    quote: "A controlled rot can preserve the body. Let me dissolve their toxic vanguard.",
    recruitment: "Offered his specialized biochemical field services to Crownspire to obtain rare volcanic ashes for his research."
  },
  remi: {
    origin: "Ironvein Stone Citadels",
    biography: "A master structural stone mason who can erect complex granite watchtowers and reinforced palisade walls in a matter of hours.",
    personality: "No-nonsense, hardworking, and deeply practical. He has zero respect for lazy workers or sub-par bricklaying.",
    relationships: "Collaborative building partner with Savannah; close geological friend to Geomancer Myshla.",
    quote: "If the foundation is weak, your golden throne will collapse into the mud anyway.",
    recruitment: "Drafted into service by direct imperial commission to fortify the base's outer castle stone rings."
  },
  faith: {
    origin: "Aurelia Celestial Reliquary",
    biography: "A royal royal astrologer and visual high-priestess who reads celestial routes to predict enemy march trajectories.",
    personality: "Mystical, quiet, and deeply philosophical. She tends to speak in riddle-like cosmic equations.",
    relationships: "Provides celestial readings of luck to Heaven; works closely with Allanna's temple guard.",
    quote: "The stars do not lie. They merely outline the path you must summon the strength to walk.",
    recruitment: "Assigned by the High Oracle to Crownspire to serve as the chief cosmic navigator for the campaign expeditions."
  },
  volkan: {
    origin: "Ashfire Sulfur Peaks",
    biography: "A dwarf demolitionist and master smith who loves the smell of sulfur and black powder. He custom-forges the vanguard's siege rams.",
    personality: "Loud, boisterous, and highly competitive. He is obsessed with designing larger explosions.",
    relationships: "Maintains a competitive smithing rivalry with Myshla; drinking buddy to Demon.",
    quote: "Why negotiate when we can just pack forty pounds of powder under the gate?",
    recruitment: "Signed onto the army list after a high-stakes tavern bet which he gladly lost to Lord Marshal Maegan."
  },
  huarung: {
    origin: "Gilded Grasslands Steppes",
    biography: "An elite blind archer who hunts by sensing vibration waves in the earth, capable of hitting flying targets through thick leaves.",
    personality: "Serene, patient, and deeply attuned to the natural resonance of the grasslands.",
    relationships: "Has high combat synergy with Rayne; silent friend to Geomancer Myshla.",
    quote: "Eyes can be deceived by shadows. The earth always tells the absolute truth.",
    recruitment: "Joined the Vanguard after the Lord Marshal saved his remote grasslands monastery from a surprise goblin raid."
  },
  violet: {
    origin: "Silent Fenns Outlaw Dens",
    biography: "A deadly dual-blade skirmisher who formerly led a massive mercenary network, specializing in viper poisons and high-agility ambush strikes.",
    personality: "Clever, manipulative, and fiercely protective of her mercenary crew.",
    relationships: "Former ally in shadow networks to Shadow; works under tight inspection of Marshal Maegan.",
    quote: "Loyalty is expensive, but my poison is swift and entirely free of charge.",
    recruitment: "Traded her outlaw crown for official military status to secure a safe enclave for her surviving swamp scouts."
  },
  sebastian: {
    origin: "Capital Trade Guilds",
    biography: "A suave high-society trade diplomat who manages Crownspire's logistics. He uses tactical wealth and trade caravans to supply military excursions.",
    personality: "Charismatic, calculating, and exceptionally well-dressed. He views war as a series of balance sheets.",
    relationships: "Business partner to Savannah; regular chess opponent of young Commander Rex.",
    quote: "A well-oiled coin can slide open heavier doors than any iron battering ram.",
    recruitment: "Appointed by the Royal Treasury to optimize supply chains and manage the base's economic resource yields."
  },
  josh: {
    origin: "Capital Vanguard Garrison",
    biography: "An experienced frontline infantry lieutenant who survived five campaigns against Malakar's elite crypt wights.",
    personality: "Pragmatic, down-to-earth, and a fatherly figure to young foot soldiers. He values simple, reliable drill maneuvers.",
    relationships: "Combat brother of Paul and Sebastian; deeply respects Dominic's veteran guidelines.",
    quote: "Keep your spears leveled and your eyes on the captain. We go home together.",
    recruitment: "Promoted to the elite vanguard after successfully leading a rear-guard action during the Battle of Black Streams."
  },
  paul: {
    origin: "Sovereign Field Garrison",
    biography: "A veteran master-at-arms who specializes in drilling recruits, transforming raw timber gatherers into professional heavy legionaries.",
    personality: "Gruff, loud, but possesses a heart of gold. He does not tolerate loose gear or sloppy formations.",
    relationships: "Training partner to Josh and Tony; values Remi's highly fortified camp designs.",
    quote: "Sweat in training saves pints of blood in battle! Pick up those shields!",
    recruitment: "Assigned by imperial decree to organize the barracks and manage active training queues for the Sovereign."
  },
  tony: {
    origin: "Capital Outer Ring Farms",
    biography: "A sturdy vanguard recruiter who survived a zombie attack in his village, subsequently vowing to enlist every able-bodied soldier in the realm.",
    personality: "Garrulous, highly persuasive, and possesses infectious energy. He never takes 'no' for an answer.",
    relationships: "Works under the logistics guidance of Sebastian; regular recruit partner to Chase.",
    quote: "There is a spear waiting for your hand, friend. Join us, and write your lineage in gold!",
    recruitment: "Joined the main castle base staff to coordinate regional recruitment drives and bolster frontline cohorts."
  },
  chase: {
    origin: "Gilded Grasslands Border",
    biography: "A fast-operating cavalry lieutenant who pioneered light-saddle courier tactics to relay orders across active battle maps.",
    personality: "Restless, highly energetic, and obsessed with horse-breeding. He cannot sit still for five minutes.",
    relationships: "Regular riding companion to Savannah; coordinates fast messages with scout captain Skye.",
    quote: "In war, a late message is just a nicely written obituary. We ride like the wind!",
    recruitment: "Recruited into the core staff during the great grasslands chase, where he outran three packs of lupine alphas to deliver retreat orders."
  },
  everest: {
    origin: "Everfrost Ridge Base",
    biography: "A giant mountaineer who formerly served as an ice-mine guard, wielding a heavy frost-axe carved from ancient blue glaciers.",
    personality: "Quiet, stoic, and loves cold drinks. He rarely speaks, preferring to let his huge axe do the negotiation.",
    relationships: "Deeply loyal to Commander Lumi; training rival of Volkan.",
    quote: "Like the high ice cliffs... we do not break.",
    recruitment: "Followed Lumi to the Capital, swearing his immense strength to the sovereign throne in exchange for winter gear."
  },
  jayden: {
    origin: "Capital Royal Cadets",
    biography: "A young, ambitious nobleman who graduated at the top of the Royal War College, specializing in classical heavy cavalry formations.",
    personality: "Chivalrous, slightly arrogant, but highly capable. He is eager to prove his worth on the battlefield.",
    relationships: "Strives to impress Marshal Maegan; friendly rival of Captain Rex.",
    quote: "A perfectly timed charge can shatter even the thickest block of dark infantry.",
    recruitment: "Enlisted in the active campaign roster to restore his family's honor and secure lands in the newly conquered regions."
  },
  karlie: {
    origin: "Capital Medical Academy",
    biography: "A quick-witted frontline chirurgeon who pioneered rapid sterile bandage techniques under hot arrow fire.",
    personality: "Pragmatic, high-stress tolerant, and deeply compassionate. She has no fear of blood or imposing commanders.",
    relationships: "Works under Lumi's field apothecary guidelines; close personal friend of Makenzi.",
    quote: "My needle is as sharp as any blade, but it stitches lives back together instead of slicing them.",
    recruitment: "Joined the vanguard medical corps to ensure that the common foot soldiers had access to proper therapeutic aid."
  },
  makenzi: {
    origin: "Shattered Reefs Isles",
    biography: "A skilled nautical navigator who maps the swift maritime rifts, ensuring expedition supply ships arrive ahead of schedule.",
    personality: "Sharp, witty, and deeply superstitious. She reads weather patterns in the behavior of sea gulls.",
    relationships: "Chief navigator to Admiral Lorelai; regular supply partner to Sebastian.",
    quote: "The tides don't care about your military plans. You either read the currents, or you sink.",
    recruitment: "Pledged her charting maps to Crownspire after Lorelai saved her merchant vessel from pirate drakes."
  },
  jazzy: {
    origin: "Aurelia Temple Choir",
    biography: "A talented acoustic ritualist who plays sacred bronze bells to disrupt the mental control of undead necromancers.",
    personality: "Joyful, highly musical, and carries a child-like wonder into dark battlefields.",
    relationships: "Works under the guidance of Aria and Allanna; close friend to recruitment partner Tony.",
    quote: "Listen to the holy bronze ring! The dark shadows cannot stand this pure frequency!",
    recruitment: "Volunteered for frontline duty when she realized her bell-resonance could actively dispel Malakar's toxic mist grids."
  },
  jose: {
    origin: "Ironvein Mines",
    biography: "A veteran dwarf sapper who spent thirty years digging tunnels under enemy fortress walls, mapping subterranean blast grids.",
    personality: "Grumbling, highly experienced, and has an encyclopedic knowledge of rock stability and soil mechanics.",
    relationships: "Deeply respects Myshla's geological commands; regular card-playing partner of master smith Volkan.",
    quote: "Why climb the high walls when we can just drop the foundation five feet into the earth?",
    recruitment: "Enlisted in the Sovereign army list to secure government pensions for his retired stone-quarrying guild."
  },
  lindsey: {
    origin: "Capital Botanical Glades",
    biography: "An expert herbalist who brews special stamina tonics from forest roots, boosting the march velocities of long columns.",
    personality: "Gentle, nature-obsessed, and constantly cataloging new leaves in her leather notebook.",
    relationships: "Works closely with Savannah to discover rich glades; supplies rare roots to apothecary Lumi.",
    quote: "Nature provides the remedy for every long road. Take a sip of this willow tea.",
    recruitment: "Offered her botanical services after the Sovereign cured her forest botanical nursery from necrotic rot."
  },
  lisa: {
    origin: "Capital Logistics Guild",
    biography: "An incredibly efficient inventory clerk who manages the weapon molds and armory stockpiles of Crownspire.",
    personality: "Slightly obsessive, highly organized, and insists on perfect bookkeeping for every arrow and iron ingot.",
    relationships: "Right-hand manager to Sebastian; regular check-up partner of structural mason Remi.",
    quote: "If your ledger is short five iron plates, your front rank is short five shields. Mind the details!",
    recruitment: "Hired by the Master of Logistics to reform the base's bloated armory inventories and speed up unit training."
  },
  dana: {
    origin: "Sovereign Border Escorts",
    biography: "A veteran caravan guard who has successfully escorted eighty resource shipments through hostile monster-dense territories.",
    personality: "Watchful, suspicious, and possesses a dry, dark humor. She expects an ambush behind every boulder.",
    relationships: "Works under Savannah's gathering columns; regular scout partner of skirmisher Chase.",
    quote: "Keep the draft animals moving. If we stop to look at the nice view, we become the view.",
    recruitment: "Joined the active campaign roster after her caravan was saved by a timely vanguard charge led by Captain Rex."
  },
  jamie: {
    origin: "Gilded Grasslands Ranched Borders",
    biography: "A rough-and-tumble beast tamer who manages the heavy draft oxen and siege horses used to pull Crownspire's war machines.",
    personality: "Blunt, animal-loving, and has a loud booming laugh. He prefers the company of horses to noble lords.",
    relationships: "Supplies heavy war horses to Jayden and Chase; coordinates feed grain with Savannah.",
    quote: "Treat an ox with respect, and he'll pull your siege ram through twenty miles of thick mire.",
    recruitment: "Enlisted when his stables were protected by Sovereign scouts, offering his grand steer collection to the Lord Marshal."
  },
  gizem: {
    origin: "Aurelia Starry Arch-Decks",
    biography: "A foreign stellar scholar who uses mechanical astrolabes to calculate precise long-range archery trajectories and wind shifts.",
    personality: "Intellectual, scholarly, and easily exasperated by unscientific soldiers.",
    relationships: "Academic apprentice to astrologer Faith; coordinates wind calculations with Skye.",
    quote: "Wind velocity: three knots east. Arrow arc: twelve degrees. Release now, and hit their captain's eye.",
    recruitment: "Joined the academic vanguard to recover ancient astronomical scrolls lost in the wildwood ruins."
  },
  ivy: {
    origin: "Whispering Canopy Glades",
    biography: "A young ranger who communicates with forest birds, utilizing them as a rapid aerial reconnaissance network.",
    personality: "Shy, gentle, and deeply bonded to her pet falcon named Aero.",
    relationships: "Works under ranger Rayne's border scout lines; close friend of Lindsey.",
    quote: "Aero says there are forty heavy goblins hiding in the tall brush. Ready your bows.",
    recruitment: "Pledged her falcon eyes to Crownspire after a field medic saved her wounded falcon from a lupine trap."
  },
  brady: {
    origin: "Sovereign Heavy Forges",
    biography: "A giant apprentice blacksmith who handles the high-temperature coal smithing, forging heavy standard plate armor.",
    personality: "Humble, extremely strong, and slightly clumsy when not holding a smithing hammer.",
    relationships: "Under-apprentice to Volkan; supplies custom steel breastplates to Dominic and Rex.",
    quote: "Each strike of the hammer drives the light into the iron. This shield will not pierce.",
    recruitment: "Volunteered for the campaign following a decree requesting skilled steel workers to repair front-line vanguard armor."
  },
  byank: {
    origin: "Silent Fenns Swamps",
    biography: "A swamp-dwelling tracker who specializes in navigating deep bogs and setting rope traps to slow enemy infantry.",
    personality: "Quirky, soft-spoken, and possesses an incredible sense of direction in the darkest forests.",
    relationships: "Works under scout captain Shadow; guides gathering columns led by Savannah.",
    quote: "Step where I step. If you step to the left, the bog-mire will swallow you whole.",
    recruitment: "Joined the army to earn solid gold coins to rebuild his swamp fishing settlement after the demon rifts cleared."
  },
  catron: {
    origin: "Capital Shield Guard",
    biography: "An elite shield maiden who served as an inner palace guard before volunteering for frontline battle duty.",
    personality: "Proud, professional, and holds herself to the highest standard of formal military posture.",
    relationships: "Deeply values Maegan's defensive doctrines; training companion to captain Rex.",
    quote: "A palace guard protects the king; a vanguard guard protects the future of the entire realm.",
    recruitment: "Transferred from the palace ceremonial staff to the active Sovereign vanguard by personal request to fight on the border."
  },
  jas: {
    origin: "capital",
    biography: "A veteran quartermaster officer who manages the grain silos and base bakery, guaranteeing the castle garrison is well fed.",
    personality: "Practical, motherly, and absolutely refuses to let any food resources go to waste.",
    relationships: "Coordinated grain supplies with Savannah; manages inventory alongside Lisa.",
    quote: "A soldier has a spear in his hand, but his courage lives in his stomach. Fresh bread is ready!",
    recruitment: "Swore loyalty to Crownspire to help feeding the refugees fleeing from Arch-Lich Malakar's raiders."
  },
  jack: {
    origin: "Capital City Guard",
    biography: "A sturdy street sergeant who kept peace in the Capital's lower docks for twenty years before joining the legion.",
    personality: "Street-smart, gruff, and possesses an endless collection of colorful urban stories.",
    relationships: "Works under logistics guidance of Sebastian; old drinking partner of Dominic.",
    quote: "War is just a massive street brawl, only the clubs have steel spikes. Keep your head down.",
    recruitment: "Enlisted during the emergency mobilization when undead raiders breached the lower city walls."
  },
  laura: {
    origin: "Capital Horse Stables",
    biography: "A veteran equestrienne who grooms and breeds the swift war chargers utilized by Crownspire's elite cavalry columns.",
    personality: "Patient, horse-obsessed, and has a magical touch that calms even the wildest, most aggressive beasts.",
    relationships: "Supplies swift charging mounts to Jayden and Chase; coordinates feed scales with jas.",
    quote: "A warhorse is your mirror. If you are afraid, he will bolt. If you are resolute, he will charge a wall of lances.",
    recruitment: "Offered her family horse-breeding services to the Sovereign vanguard in exchange for secure border grazing rights."
  },
  may: {
    origin: "Capital Weaving Guild",
    biography: "A talented sail-weaver and banner maker who patterns the grand gilded flags that inspire the vanguard's marches.",
    personality: "Creative, meticulous, and deeply patriotic, finding pride in seeing her gilded banners flying on high towers.",
    relationships: "Works under logistics officer Sebastian; close friend of alchemist Lindsey.",
    quote: "A flag is not just silk and threads; it's the visual heart of our sovereign nation.",
    recruitment: "Commissioned by Crownspire's High Chancellor to design and sew the official Sovereign war standards."
  },
  pam: {
    origin: "Gilded Grasslands Granaries",
    biography: "A veteran farm manager who optimized grain storage techniques, reducing storage spoil rates under high weather moisture.",
    personality: "No-nonsense, motherly, and has a terrifying scowl for anyone who wastes clean water or grain.",
    relationships: "Works under food-gathering direction of Savannah; coordinates kitchen rations with jas.",
    quote: "To win a war of shields, you must first win the war of grain silos. Seal those leaks!",
    recruitment: "Joined the base base staff to protect the region's agricultural reserve archives from being burned."
  },
  rass: {
    origin: "Ironvein Chasm Mines",
    biography: "A giant ore-loader who can carry three hundred pounds of iron ore on his broad shoulders without breaking a sweat.",
    personality: "Good-natured, simple, and possesses immense, unmatched brute physical strength.",
    relationships: "Works under Earth Shaper Myshla; regular heavy lifting partner of master builders Remi and Jose.",
    quote: "Rass carry the heavy rocks. Rass make sure fortress walls are thick and tall.",
    recruitment: "Recruited out of the Ironvein quarry pits when miners were attacked by cave dwellers, wielding a pickaxe to clear the threat."
  },
  rubble: {
    origin: "Sovereign Stonemasons Guild",
    biography: "A structural demolitionist who specializes in felling enemy wooden palisade traps during campaign siege operations.",
    personality: "Cheerful, destructive, and loves the sound of heavy beams snapping under tension.",
    relationships: "Works under architectural mason Remi; coordinates siege explosives with Volkan.",
    quote: "What took them three weeks to build, I can drop in three minutes. Give me the hammer!",
    recruitment: "Joined the army vanguard to clear the timber rubble following the initial sulfur crater explosions."
  },
  tisha: {
    origin: "Aurelia Cathedral Archives",
    biography: "A meticulous scribe who maps out troop casualty records, helping field apothicaries deploy cures to high-loss cohorts.",
    personality: "Quiet, studious, and highly academic, finding comfort in rows of historical ledgers.",
    relationships: "Assists astrologer Faith in cataloging scrolls; supplies medical logs to Karlie.",
    quote: "A documented army is an army that learns. Every injury listed is a tactical lesson saved.",
    recruitment: "Sent from the Aurelia libraries to ensure Crownspire's military history and victories are properly recorded."
  },
  buzz: {
    origin: "Capital Outer Ring Woods",
    biography: "A legendary logger who wields a massive double-bitted felling axe, responsible for clearing forest blockades during skirmishes.",
    personality: "Jovial, loves a high-stakes woodcutting contest, and has an infectious laugh that echoes in the glades.",
    relationships: "Supplies timber to master builder Remi; coordinates outer border patrols with Rayne.",
    quote: "No forest is too dense, no wall of timber too thick. Just watch for falling trunks!",
    recruitment: "Joined the core gathering roster when undead raiders targeted his logging camps, pledging his axe to the Sovereign."
  },
  yunus: {
    origin: "Aurelia Palace Guard",
    biography: "A master spear-instructor who drill-trained two generations of Crownspire's premier phalanx guards.",
    personality: "Disciplined, articulate, and possesses immaculate aristocratic posture. He is key to unit training speeds.",
    relationships: "Drills recruits alongside Paul and Tony; old training sparring rival of Dominic.",
    quote: "The tip of your lance must be an extension of your own breath. Perfect posture, perfect strike.",
    recruitment: "Assigned by the High Sovereign's personal war advisor to optimize barracks training and lance drills."
  },
  anelia: {
    origin: "Shattered Reefs Waters",
    biography: "An elite spear-fisherwoman who maps deep-water currents, coordinating naval blockades to secure vital harbor channels.",
    personality: "Agile, sharp, and has a keen sense of oceanic weather. She is highly competitive with other sailors.",
    relationships: "Nautical assistant to Lorelai; regular supply partner to navigator Makenzi.",
    quote: "The sea has no mercy for sloppy sailors. Lock your oars and secure the nets!",
    recruitment: "Signed onto the navy list after her fishing fleet helped save an imperial shipping vessel from ocean drakes."
  },
  larfides: {
    origin: "Capital Royal Library",
    biography: "An ancient, eccentric scholar of historic battles who provides the Lord Marshal with invaluable strategic military archives.",
    personality: "Absent-minded, deeply academic, and constantly rummaging through dusty scrolls during active meetings.",
    relationships: "Primary historical advisor to Maegan; academic mentor to gizem.",
    quote: "History does not repeat itself, but it certainly rhymes in the way the arrows fly.",
    recruitment: "Swore custom research oaths to Crownspire to preserve ancient records from being looted or burned by the Arch-Lich."
  }
};
