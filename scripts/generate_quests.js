import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const categories = [
  "Building",
  "Gathering",
  "Research",
  "Troops",
  "Heroes",
  "Monster Hunting",
  "Alliance"
];

const building_templates = [
  { action: "Reinforce", object: "Citadel Keep Spire", target: "Upgrade the Citadel Keep" },
  { action: "Ascend", object: "Vault Warehouse Vaults", target: "Upgrade the Vault Warehouse" },
  { action: "Calibrate", object: "Research Observatory Dome", target: "Construct or upgrade the research observatory" },
  { action: "Commission", object: "Imperial Consulate Offices", target: "Expand your diplomatic embassy" },
  { action: "Sanctify", object: "Cathedral Hospital Wards", target: "Upgrade the Sacred Hospital" },
  { action: "Fortify", object: "Sentry Tower Lookout", target: "Upgrade the Watchtower telescope" },
  { action: "Construct", object: "Equestrian Stable Stalls", target: "Upgrade your Cavalry Paddock" },
  { action: "Expand", object: "Timber Mill Saw Tracks", target: "Upgrade the Lumber Mill" },
  { action: "Terrace", object: "Slate Bedrock Excavators", target: "Upgrade the Slate Quarry" },
  { action: "Dredge", object: "Foundry Smelter Shafts", target: "Deepen the Deep-Iron mining entrances" },
];

const gathering_templates = [
  { action: "Harvest", object: "Lichen-Rich Cedar Logs", target: "Collect Wood from forests" },
  { action: "Excavate", object: "Dark Blue Slate Blocks", target: "Collect Slate from quarries" },
  { action: "Extract", object: "Smelted Iron Ore Clusters", target: "Collect Iron from deposits" },
  { action: "Siphon", object: "Amber Wheat Grain Bales", target: "Collect Food from farms" },
  { action: "Glean", object: "Ethereal Spirit Mana Dew", target: "Collect Spirit Essence" },
];

const research_templates = [
  { action: "Decrypt", object: "Sun-Rune Star Constellations", target: "Research Astrological alignments" },
  { action: "Formulate", object: "Glacial Freezing Alloys", target: "Research Frost-Wyrm defenses" },
  { action: "Analyse", object: "Basalt Lava Metallurgy", target: "Research volcanic heat resistance" },
  { action: "Codify", object: "Cavalry Charge Tactics", target: "Research equine tactical maneuvers" },
  { action: "Translate", object: "Ethereal Spell Scrolls", target: "Research hospital healing charts" },
];

const troops_templates = [
  { action: "Drill", object: "Vanguard Shield Cohorts", target: "Train heavy Ironclad Infantry" },
  { action: "Fletch", object: "Mint-Feather Marksmen Packs", target: "Train long-range Archers" },
  { action: "Halter", object: "Sovereign Crest Dragoons", target: "Train elite Cavalry" },
  { action: "Mobilize", object: "Garrison Town Guard Batallions", target: "Train defensive Sentinels" },
  { action: "Marshal", object: "Scout Pathfinder Outrunners", target: "Train wilderness Scouts" },
];

const heroes_templates = [
  { action: "Empower", object: "Warlord Command Talents", target: "Level up active Sovereign Commander" },
  { action: "Forge", object: "Sun-Flame Iron Plate Grips", target: "Upgrade blacksmith gear" },
  { action: "Equip", object: "Matriarch Dragon Eyes", target: "Socket draconic crownmarks on a hero" },
  { action: "Conduct", object: "Glade-Scout Training Drills", target: "Use training tickets to expand power" },
  { action: "Deploy", object: "Border Patrol Sweeps", target: "Complete a Hero Expedition march" },
];

const monster_templates = [
  { action: "Slay", object: "Volcanic Ember Hatchlings", target: "Defeat Ignis lizards on volcanic paths" },
  { action: "Smite", object: "Ancient Glacial Frost Wyrms", target: "Defeat skeletal ice dragons" },
  { action: "Purge", object: "Amethyst Slime Blobs", target: "Defeat forest quartz slimes" },
  { action: "Chase", object: "Cosmic Amethyst Stalkers", target: "Drive back void entities from rifts" },
  { action: "Raid", object: "Shadow Outlaw Outposts", target: "Sack level-appropriate deserter encampments" },
];

const alliance_templates = [
  { action: "Donate", object: "Pure Slate-Ores to Vaults", target: "Contribute resources to alliance tech" },
  { action: "Support", object: "Consular Construction Queues", target: "Click Help on alliance requests" },
  { action: "Rally", object: "Sovereign Dragon Roost Strikes", target: "Join alliance combat rally groups" },
  { action: "Distribute", object: "Pegasus Diplomatic Pouches", target: "Send trade caravans to aligned keeps" },
  { action: "Assist", object: "Sanctuary Hospital Cleasings", target: "Send assistance to allied outposts" },
];

const subTitleAdjectives = [
  "Imperial", "Sovereign", "Celestial", "Abyssal", "Gothic", "Eldritch", "Volcanic", 
  "Glacial", "Ethereal", "Runic", "Vanguard", "Obsidian", "Amethyst", "Amber"
];

const quests = [];

for (let i = 1; i <= 500; i++) {
  const categoryIndex = (i - 1) % categories.length;
  const category = categories[categoryIndex];
  
  let baseTemplate;
  if (category === "Building") baseTemplate = building_templates[(i - 1) % building_templates.length];
  else if (category === "Gathering") baseTemplate = gathering_templates[(i - 1) % gathering_templates.length];
  else if (category === "Research") baseTemplate = research_templates[(i - 1) % research_templates.length];
  else if (category === "Troops") baseTemplate = troops_templates[(i - 1) % troops_templates.length];
  else if (category === "Heroes") baseTemplate = heroes_templates[(i - 1) % heroes_templates.length];
  else if (category === "Monster Hunting") baseTemplate = monster_templates[(i - 1) % monster_templates.length];
  else baseTemplate = alliance_templates[(i - 1) % alliance_templates.length];

  const adjective = subTitleAdjectives[(i * 3 + 7) % subTitleAdjectives.length];
  const levelNum = ((i * 7) % 39) + 1;
  const countNeeded = ((i * 13) % 45) + 5;

  const id = `daily_quest_${String(i).padStart(3, '0')}`;
  const title = `${baseTemplate.action} ${adjective} ${baseTemplate.object}`;
  const description = `The Crownspire council decrees: we must direct resources to ${baseTemplate.target.toLowerCase()} to secure our borders and expand our overall campaign footprint.`;
  
  let objective = "";
  if (category === "Building") objective = `${baseTemplate.target} to Level ${levelNum}`;
  else if (category === "Gathering") objective = `${baseTemplate.target} (Target: ${countNeeded * 100} units)`;
  else if (category === "Research") objective = `${baseTemplate.target} (Tier ${Math.min(5, Math.ceil(levelNum / 8))})`;
  else if (category === "Troops") objective = `${baseTemplate.target} (Train ${countNeeded * 5} recruits)`;
  else if (category === "Heroes") objective = `${baseTemplate.target} (Level or train up to power margin)`;
  else if (category === "Monster Hunting") objective = `${baseTemplate.target} (Clear count: ${Math.ceil(countNeeded / 10)})`;
  else objective = `${baseTemplate.target} (Count: ${Math.ceil(countNeeded / 8)} completed operations)`;

  // Reward generation based on indices
  const woodAmt = 1000 + ((i * 144) % 9000);
  const slateAmt = 1000 + ((i * 256) % 9000);
  const ironAmt = 500 + ((i * 123) % 4500);
  const foodAmt = 1500 + ((i * 333) % 12000);
  const valorAmt = 50 + ((i * 12) % 450);

  const rewards = {
    wood: woodAmt,
    slate: slateAmt,
    iron: ironAmt,
    food: foodAmt,
    valor: valorAmt
  };

  quests.push({
    id,
    category,
    title,
    description,
    objective,
    rewards
  });
}

const outputPath = path.join(__dirname, '../docs/CROWNSPIRE_DAILY_QUESTS_500.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(quests, null, 2), 'utf-8');
console.log(`Successfully generated 500 quests in ${outputPath}`);
