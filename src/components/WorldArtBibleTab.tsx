import React, { useState } from 'react';
import { 
  Sparkles, 
  Palette, 
  Layers, 
  Compass, 
  BookOpen, 
  CheckCircle2, 
  Eye, 
  Flame, 
  Sun, 
  Map, 
  Search, 
  Copy, 
  Check, 
  AlertTriangle, 
  Info,
  ShieldAlert,
  Sliders,
  TreePine,
  Mountain,
  Droplet,
  Zap,
  Hammer
} from 'lucide-react';

interface ColorPalette {
  name: string;
  colors: { hex: string; role: string }[];
  reason: string;
}

interface BiomeDetail {
  terrain: string;
  vegetation: string;
  lighting: string;
  weather: string;
  fog: string;
  music: string;
  rocks: string;
  trees: string;
  flowers: string;
  water: string;
  wildlife: string;
  ruins: string;
  resources: string;
  identity: string;
  feeling: string;
}

export default function WorldArtBibleTab() {
  const [activeSection, setActiveSection] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  
  // Interactive rendering mockup state
  const [selectedSimBiome, setSelectedSimBiome] = useState<string>('Royal Plains');
  const [selectedSimTime, setSelectedSimTime] = useState<string>('Morning');
  const [selectedSimWeather, setSelectedSimWeather] = useState<string>('Clear');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(text);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  // Sections data
  const sections = [
    {
      id: 1,
      title: "1. World Identity",
      icon: Compass,
      tagline: "Atmosphere, Emotional Tone, and civilization framework",
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <p>
            The world of <strong>Crownspire</strong> is designed as a living, breathing tapestry where royal majesty, ancient mysteries, and dynamic forces collide. Our goal is to craft a premium, high-contrast, stylized environment that balances high-end stylized realism with hand-painted textures, Pixar-like readability, and Disney's cohesive color harmony.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2 text-amber-400">Atmosphere & Tone</h4>
              <p className="text-xs">
                <strong>Emotional Tone:</strong> Awe-inspiring, timeless, pristine, but laced with ancient melancholia. The player must feel both the security of the royal crown and the curiosity of the forgotten wilderness.
              </p>
              <p className="text-xs mt-2">
                <strong>Atmospheric Key:</strong> Deep volumetric layers, dramatic low-angle ambient lighting, and subtle particle glows. The environment must never look static; wind-blown grass, floating spores, and drifting mist bring it to life.
              </p>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-2 text-purple-400">Civilization & Technology</h4>
              <p className="text-xs">
                <strong>Civilization Level:</strong> High Sovereign Fantasy. Think gilded starlight spires, white marble masonry, heavy brass gears, and celestial canals. This is a universe that once mastered star-forging but now reconstructs itself on the remains of the past.
              </p>
              <p className="text-xs mt-2">
                <strong>Fantasy Level:</strong> Extremely active but structured. Magic is not volatile, chaotic dust—it is a physical medium that forms crystals, fuels ancient floating pillars, and grows neon-lit sacred groves.
              </p>
            </div>
          </div>

          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-teal-400">Artistic Justification of Key Pillars</h4>
            <ul className="space-y-2 text-xs list-disc pl-5">
              <li>
                <strong>Royal & Handcrafted:</strong> We use clean white marble, gold gilding, and pristine stone masonry to represent human kingdoms. This creates high-contrast structures against the natural, deep-colored landscape, reinforcing the struggle between light civilization and untamed magical wilderness.
              </li>
              <li>
                <strong>Living & Beautiful:</strong> Flora is oversized, stylized, and slightly expressive. Leaves are chunky with hand-painted specular maps to maximize visual reading from high-angle isometric perspectives.
              </li>
              <li>
                <strong>Ancient & Melancholy:</strong> Natural formations are heavily weathered. Mountains are jagged but smoothed by celestial tides; ancient roads are cracked with grass pushing up through the stone seams, implying an age of lost prosperity.
              </li>
            </ul>
          </div>

          <div className="p-4 bg-amber-500/5 rounded-xl border border-amber-500/10 text-xs">
            <p className="text-amber-300 font-semibold mb-1">Director's Note on Scale & Camera Perspective:</p>
            <p>
              Operating at a high-angle 3/4 isometric perspective means we must prioritize silhouettes. Tree clusters must group into readable green volumes; cliffs must present clean vertical facets with strong horizontal lip highlights; paths must guide the player's eye directly to centers of interest. Avoid microscopic noise.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "2. World History Through Environment",
      icon: BookOpen,
      tagline: "Environmental storytelling and silent historical guides",
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <p>
            In Crownspire, players should learn about the world’s history through its physical geography rather than wall-to-wall dialogue text boxes. Every broken column, moss-covered arch, and cracked brick must speak of ancient empires, legendary sieges, and magical cataclysms.
          </p>

          <div className="space-y-4">
            <div className="border-l-2 border-amber-500 pl-4 space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider">The Strata of Ruins</h4>
              <p className="text-xs">
                We categorize historical environment storytelling into three distinct historical eras, each possessing a separate material language:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
                <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800">
                  <span className="text-xs font-bold text-amber-300">1. Starlight Precursors</span>
                  <p className="text-[11px] text-slate-400 mt-1">Deep obsidian rock, floating geometric monoliths, and neon indigo rune channels. Perfectly preserved, defying decay.</p>
                </div>
                <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800">
                  <span className="text-xs font-bold text-slate-300">2. Fallen Old Empire</span>
                  <p className="text-[11px] text-slate-400 mt-1">Cracked granite arches, collapsed aqueducts, and weathered marble gargoyles overgrown by creeping vines and sacred ivy.</p>
                </div>
                <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-800">
                  <span className="text-xs font-bold text-[#b91c1c]">3. The Shadow Siege Era</span>
                  <p className="text-[11px] text-slate-400 mt-1">Scorched earth, twisted iron barbs, cratered hillsides, and basalt battlements marked by fossilized ash and siege scars.</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-teal-400">Silent Historical Indicators</h4>
              <div className="space-y-2 text-xs">
                <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                  <strong className="text-white block mb-1">Ancient Roads & Broken Bridges</strong>
                  <p>Our main paved roads feature heavy, worn paving slabs. Where bridges are collapsed, temporary wooden scaffolding and rope rigging installed by scouts are present, showing the world's survival struggle. Paths split and wind around ancient impact craters left by meteor magic.</p>
                </div>
                <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                  <strong className="text-white block mb-1">Watchtowers, Statues & Monuments</strong>
                  <p>Imperial monuments are never fully intact. A statue of an ancient sovereign will have its head separated, sitting partially buried in wild flowers, providing a perfect natural habitat for forest critters. Watchtowers are hollowed out, their roofs caved-in, now serving as nesting grounds for giant eagles.</p>
                </div>
                <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                  <strong className="text-white block mb-1">Battlefields & Sacred Groves</strong>
                  <p>Old battlegrounds feature giant titan swords rusted and fused into basalt rock cliffs. Surrounding grass is unnaturally dark or mutated into amber colors due to residual magic. In sacred groves, stone shrines emit soft light-burst particles, maintaining a circle of green grass even during sub-zero winters.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      title: "3. Color Script",
      icon: Palette,
      tagline: "Exhaustive seasonal, diurnal, and regional palettes",
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <p>
            Color is our primary tool for guiding emotional focus and dividing biomes. Below is the official color script for Crownspire. Colors must be strictly sampled from these hex codes to ensure absolute visual harmony.
          </p>

          {/* Color Palettes List */}
          <div className="space-y-4">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-amber-500">Seasons & Diurnal Cycles</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorPaletteCard 
                name="Spring Morning" 
                colors={[
                  { hex: "#85a973", role: "Fresh Meadow Grass" },
                  { hex: "#d8b4fe", role: "Bloomed Heather Flower" },
                  { hex: "#fef08a", role: "Warm Sun Rays" },
                  { hex: "#1e293b", role: "Distant Hill Shadows" }
                ]}
                reason="Conveys rebirth and safety. Highly saturated greens paired with soft lavender and pale gold to mimic clear morning dew."
                onCopy={copyToClipboard}
              />
              <ColorPaletteCard 
                name="Autumn Midday" 
                colors={[
                  { hex: "#ea580c", role: "Fallen Maple Foliage" },
                  { hex: "#ca8a04", role: "Dry Grass Silt" },
                  { hex: "#7c2d12", role: "Wet Clay Paths" },
                  { hex: "#0f172a", role: "Crisp Sky Shadows" }
                ]}
                reason="Warm, rich, and nostalgic. Deep rusty oranges and amber golds contrast with dark damp earth to show harvest abundance."
                onCopy={copyToClipboard}
              />
              <ColorPaletteCard 
                name="Winter Sunset" 
                colors={[
                  { hex: "#f1f5f9", role: "Powder Snow Highlight" },
                  { hex: "#93c5fd", role: "Glacial Ice Shadow" },
                  { hex: "#db2777", role: "Deep Sky Sunset Pink" },
                  { hex: "#312e81", role: "Sub-zero Mountain Cliffs" }
                ]}
                reason="Striking contrast. Pure slate-blue winter cold paired with vibrant celestial magenta and deep oceanic indigo."
                onCopy={copyToClipboard}
              />
              <ColorPaletteCard 
                name="Magical Sacred Locations" 
                colors={[
                  { hex: "#111827", role: "Sacred Soil Obsidian" },
                  { hex: "#22d3ee", role: "Active Mana Shrines" },
                  { hex: "#818cf8", role: "Floating Monolith Glow" },
                  { hex: "#4c1d95", role: "Spiritual Twilight Sky" }
                ]}
                reason="Ethereal cosmic mystery. Deep dark ground templates punctuated by highly glowing cyan, soft indigo, and stellar violet."
                onCopy={copyToClipboard}
              />
            </div>

            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-purple-500 mt-6">Biome & Territory Palettes</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ColorPaletteCard 
                name="Corrupted Lands" 
                colors={[
                  { hex: "#1e1b4b", role: "Necrotic Soil" },
                  { hex: "#a21caf", role: "Toxic Flora Spores" },
                  { hex: "#10b981", role: "Acidic Pools" },
                  { hex: "#030712", role: "Abyssal Atmosphere" }
                ]}
                reason="Violent discord. Deep shadow-soaked indigo ground paired with glowing toxic magenta mushrooms and bubbling viridian acid wells."
                onCopy={copyToClipboard}
              />
              <ColorPaletteCard 
                name="Royal Sovereign Lands" 
                colors={[
                  { hex: "#fafafa", role: "Prone White Marble" },
                  { hex: "#eab308", role: "Royal Gilt Trim" },
                  { hex: "#3b82f6", role: "Sovereign Blue Drapes" },
                  { hex: "#166534", role: "Manicured Palace Shrub" }
                ]}
                reason="Order, law, and high premium craftsmanship. Gleaming white facades trimmed in precious metals and draped in noble indigo-blue."
                onCopy={copyToClipboard}
              />
            </div>
          </div>

          {copiedColor && (
            <div className="fixed bottom-6 right-6 bg-teal-500 text-slate-950 font-bold px-4 py-2 rounded-lg shadow-xl text-xs flex items-center gap-2 z-50 animate-bounce">
              <Check className="w-4 h-4" /> Copied {copiedColor} to clipboard!
            </div>
          )}
        </div>
      )
    },
    {
      id: 4,
      title: "4. Terrain Bible",
      icon: Map,
      tagline: "Shape language, texture blending, and placement parameters",
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <p>
            Terrain serves as the canvas for all gameplay assets. It must have strict detail levels: clean open spaces where armies march, and rich textured details around mountains, forests, and resources.
          </p>

          <div className="space-y-4">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-teal-400 mb-2">Primary Terrain Types</h4>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-amber-400 font-bold block">Grass & Dark Grass</span>
                  <p>Chunky, stylized grass blades clumped in gentle wave patterns. Avoid individual blade noise. Use a clean radial gradient blending system where central open terrain has low texture frequency, while borders near trees fade into dark, moss-flecked forest ground.</p>
                </div>
                <div>
                  <span className="text-amber-400 font-bold block">Paved Royal Roads vs. Ancient Trails</span>
                  <p><strong>Royal Roads:</strong> Made of large, interlocked white marble stones with gold-flecked mortar. Highly ordered, clean borders, minimal wear.<br /><strong>Ancient Trails:</strong> Cracked paving stones with thick grass sprouting from seams. Borders are irregular, crumbling into the dirt.</p>
                </div>
                <div>
                  <span className="text-amber-400 font-bold block">Dirt, Mud & Swamp Ground</span>
                  <p>Soft-brown clay colors with highly reflective puddles. Mud has wavy, layered ridges showing wagon-wheel tracks. Swamps feature dark purple-green muck with thick, glowing, algae-rimmed liquid beds.</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-purple-400 mb-2">Blending & Wear Mechanics</h4>
              <ul className="space-y-2 text-xs list-disc pl-5">
                <li>
                  <strong>Contrast-Based Alpha Blending:</strong> Terrain transitions (e.g. snow-to-rock, dirt-to-grass) must use custom height-blend maps rather than soft linear gradients. Snow should sit inside rock crevices first before covering the stone tops.
                </li>
                <li>
                  <strong>Natural wear representation:</strong> Heavy player traffic areas, such as surrounding castle gates, must automatically blend from rich green grass into dry, packed brown dirt. This communicates a sense of activity and presence.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      title: "5. Biome Bible",
      icon: Sliders,
      tagline: "Atmospheric profiles for every region",
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <p>
            Crownspire is composed of distinct biomes, each designed with a unique environmental profile. When an army marches from one biome to another, the transition must feel immediately distinct through terrain changes, vegetation types, lighting temp, and fog density.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            {['Royal Plains', 'Ancient Forest', 'Dark Forest', 'Crystal Forest', 'Sacred Valley', 'Golden Meadows', 'Snow Mountains', 'Volcanic Highlands', 'Whispering Marsh'].map(biome => (
              <button 
                key={biome}
                onClick={() => setSelectedSimBiome(biome)}
                className={`p-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                  selectedSimBiome === biome 
                    ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500 text-white shadow-md' 
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <span>{selectedSimBiome === biome ? '📍 ' : '🌲 '} {biome}</span>
              </button>
            ))}
          </div>

          <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h4 className="font-bold text-white uppercase text-xs tracking-wider text-amber-400">Biome Art Specification: {selectedSimBiome}</h4>
              <span className="text-[10px] font-mono bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20 font-bold">AAA Grade</span>
            </div>

            <BiomeSpecs biome={selectedSimBiome} />
          </div>
        </div>
      )
    },
    {
      id: 6,
      title: "6. Environment Asset Library",
      icon: TreePine,
      tagline: "Vegetation, stone, landmarks, and decorative props",
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <p>
            Our asset library relies on distinct silhouettes and materials to guarantee isometric readability. Below is the technical specification for all environmental props:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-emerald-400">Vegetation Library</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <strong>Sovereign Oak (Large):</strong> Chunky, cloud-like leaf volumes. Leaf clusters are modeled as contiguous spheres painted with a custom light gradient (bright amber-green at tops, fading to deep violet-blue underneath).
                </li>
                <li>
                  <strong>Everfrost Pines:</strong> Stiff, cone silhouettes with thick, layered snow blankets. Snow has highly saturated sky-blue shadows to mimic real glacier ice refraction.
                </li>
                <li>
                  <strong>Whispering Canopy Bushes:</strong> Rounded, low-lying bushes with large star-shaped flowers that open and close in gentle idle loops.
                </li>
              </ul>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-cyan-400">Rock & Crystal Formations</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <strong>Granite Slabs:</strong> Blocky, angular, possessing stark 45-degree hand-painted edge highlights. Rocks feature flat, planar tops with subtle moss patches to catch sunlight.
                </li>
                <li>
                  <strong>Mana Crystals:</strong> Translucent shards with high refraction. They emit custom lens flares and feature internal dust particles floating in the crystal core.
                </li>
                <li>
                  <strong>Volcanic basalt columns:</strong> Hexagonal structures clustered vertically. Features glowing magma seams in between joints.
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 space-y-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-purple-400">Interactive Props & Shrines</h4>
            <p className="text-xs">
              <strong>Wayfinder Obelisks:</strong> Segmented stone pillars with a central levitating orb. When inactive, the stone is dark slate grey; when tapped, the segments spin, lighting up with cyan runes and directing a light beam into the sky.
            </p>
            <p className="text-xs">
              <strong>Alliance Boundary Shrines:</strong> Highly polished gold statues representing the Winged Lion of Crownspire. They project a golden network grid on the ground, clearly defining alliance territory boundaries.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 7,
      title: "7. World Generation Rules",
      icon: Map,
      tagline: "Procedural layouts, biomes, and territorial balance",
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <p>
            The Crownspire world map is generated procedurally, but must look hand-crafted. We use a multi-pass noise algorithm combined with strict density and proximity rules to guarantee clean layouts.
          </p>

          <div className="space-y-4">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-amber-500 mb-2">Procedural Layer Pass</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center text-xs">
                <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
                  <span className="font-mono font-bold text-amber-400">Pass 1: Continental</span>
                  <p className="text-[10px] text-slate-400 mt-1">Defines main landmasses, mountain chains, and deep ocean lakes using Simplex Noise.</p>
                </div>
                <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
                  <span className="font-mono font-bold text-purple-400">Pass 2: Biomes</span>
                  <p className="text-[10px] text-slate-400 mt-1">Applies heat/moisture maps to distribute biomes (e.g. desert near volcanic peaks).</p>
                </div>
                <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
                  <span className="font-mono font-bold text-blue-400">Pass 3: Networks</span>
                  <p className="text-[10px] text-slate-400 mt-1">Carves primary rivers and lays down historical paved roads connecting player zones.</p>
                </div>
                <div className="bg-slate-950/60 p-2 rounded border border-slate-800">
                  <span className="font-mono font-bold text-teal-400">Pass 4: Clutter</span>
                  <p className="text-[10px] text-slate-400 mt-1">Clusters resources, trees, and small rocks based on distance field algorithms.</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-white uppercase text-xs tracking-wider text-teal-400">Natural Clumping & Avoidance Rules</h4>
              <p>
                <strong>The 1-2-3 Cluster Rule:</strong> Forest assets must never be placed uniformly. They must spawn in tight clusters of three (1 large primary oak, 2 companion bushes/shrubbery) followed by clear green negative spaces. This avoids the visual noise of scattered, repetitive sprites.
              </p>
              <p>
                <strong>Player Territory Protection:</strong> To ensure high combat visibility, a 6x6 hex radius surrounding any active player castle is completely cleared of tall trees and heavy cliffs. It is replaced by manicured sovereign grass tiles, letting players inspect army march formations easily.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 8,
      title: "8. Landmark Design",
      icon: Mountain,
      tagline: "Iconic historical wonders and tectonic structures",
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <p>
            Landmarks act as visual anchors on the world map. Players use them for spatial orientation, alliance rally gatherings, and strategic territory control.
          </p>

          <div className="space-y-4">
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex gap-4">
              <span className="text-4xl">🏛️</span>
              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">The Crownspire Arch</h4>
                <p className="text-xs text-slate-300 mt-1">
                  A colossal levitating golden ring forged from meteorite star-dust, hovering between two jagged mountain peaks. It serves as the primary gateway to elite, high-level resources. Its golden glow intensifies when active, casting sweeping volumetric sunshafts down into the valley.
                </p>
              </div>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex gap-4">
              <span className="text-4xl">🌲</span>
              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-purple-400">The Everbloom Sentinel</h4>
                <p className="text-xs text-slate-300 mt-1">
                  A massive, ancient tree towering over the Sacred Valley biome. Its bioluminescent violet foliage spreads across 5 full hex tiles, constantly shedding glowing pollen particles. The surrounding ground is covered in dense moon crystals, forming a glowing barrier of protective magic.
                </p>
              </div>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex gap-4">
              <span className="text-4xl">💀</span>
              <div>
                <h4 className="font-bold text-white text-xs uppercase tracking-wider text-red-500">The Dragon Remains (Sovereign Ravine)</h4>
                <p className="text-xs text-slate-300 mt-1">
                  The fossilized skeletal remains of the ancient Star-Breaker Dragon, winding through a massive canyon. Its ribs form natural stone arches that player legions must march through. Red magma veins pulse through the bones, illuminating the terrain with constant heat glow.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 9,
      title: "9. Lighting Bible",
      icon: Sun,
      tagline: "Shadow maps, volumetric atmosphere, and diurnal shifts",
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <p>
            Lighting is the most powerful tool to convey time of day and geographic mood. Because Crownspire uses a 3/4 isometric viewpoint, shadows must be strictly standardized to avoid confusing overlapping profiles.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-amber-400">Standard Diurnal Lighting Matrix</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <strong>Morning:</strong> Sun Angle is 45° from Top-Left. Ambient temperature is warm golden-white (#fef08a), shadows are soft, elongated, colored with saturated dark indigo to convey fresh dawn humidity.
                </li>
                <li>
                  <strong>Midday:</strong> Sun Angle is 85° (almost vertical). Ambient light is high-intensity, crisp white (#fafafa), shadows are tight, dark grey, sitting directly underneath trees and buildings to maximize spatial readability.
                </li>
                <li>
                  <strong>Sunset:</strong> Sun Angle is 30° from Top-Right. Ambient lighting is a dramatic blend of amber (#f97316) and deep magenta. Shadows are extremely long, soft-edged, coloring the terrain with orange-purple transitions.
                </li>
              </ul>
            </div>

            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-2">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-indigo-400">Atmospheric & Volumetric Lighting</h4>
              <p className="text-xs">
                <strong>God Rays (Volumetric Sunshafts):</strong> Implemented via custom particle projections filtering through tree leaves and landmark gaps. They should always lean toward the current sun angle.
              </p>
              <p className="text-xs mt-2">
                <strong>Sub-Surface Scattering (SSS):</strong> Foliage, flags, and crystal tips must possess a subtle rim-light shader to simulate light passing through translucent materials, highlighting details even in heavy shadow.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 10,
      title: "10. Material Library",
      icon: Hammer,
      tagline: "Technical texture values and aging standards",
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <p>
            To achieve a premium AAA stylized look, materials must react dynamically to light. Hand-painted albedo textures are combined with precise rough/metallic maps to define surfaces:
          </p>

          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <span className="font-bold text-white block">White Marble</span>
                <p className="text-[11px] text-slate-400 mt-1">Roughness: 0.15 (Slightly glossy). Soft blue subsurface scattering. Edge Wear: Light, clean vertical gold cracks in crevices.</p>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <span className="font-bold text-white block">Sovereign Gold</span>
                <p className="text-[11px] text-slate-400 mt-1">Roughness: 0.22 (Highly metallic). Golden ambient reflections. No corrosion, but possesses hand-painted dark iron oxidation in seams.</p>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <span className="font-bold text-white block">Ancient Oak Wood</span>
                <p className="text-[11px] text-slate-400 mt-1">Roughness: 0.85 (Rough, matte). Heavy weathering, deep horizontal fiber grooves, moss clumps, and hand-painted grey edges.</p>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <span className="font-bold text-white block">Mana Crystals</span>
                <p className="text-[11px] text-slate-400 mt-1">Roughness: 0.05 (Mirror glossy). Internal stardust refractive parallax. High emissive value that pulses gently.</p>
              </div>
            </div>

            <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80">
              <h4 className="font-bold text-white text-xs uppercase tracking-wider text-purple-400 mb-2">Weathering & Aging Philosophy</h4>
              <p className="text-xs">
                Nothing in the environment must look sterile or newly vacuum-formed. Natural materials should feel heavy and solid:
              </p>
              <ul className="space-y-1 text-xs list-disc pl-5 mt-2">
                <li><strong>Stone:</strong> Stone borders must feature beveled, irregular hand-carved edges. Crevices contain dark moss or stardust silt.</li>
                <li><strong>Metal:</strong> Polished iron and steel should have localized specular highlights showing small nicks and battle scars.</li>
                <li><strong>Liquid:</strong> River water features a stylized foaming border where it collides with rock obstacles, emphasizing flow force.</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 11,
      title: "11. Magic Language",
      icon: Flame,
      tagline: "Visual FX coding and elemental classification",
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <p>
            Magic is not just a spell—it is an atmospheric element that leaves lasting physical marks on the landscape. We classify magic into four highly distinct visual languages:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                <span className="font-bold text-teal-400 text-xs block mb-1">🌟 Holy / Lunar Magic</span>
                <p className="text-xs">
                  <strong>Palette:</strong> Warm Gold (#f59e0b) and Ethereal Cyan (#06b6d4).
                  <br /><strong>Vibe:</strong> High geometric shapes, perfect concentric circles, floating light runes, clean white light sunshafts, and soft feather-like dust particles.
                </p>
              </div>
              <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                <span className="font-bold text-indigo-400 text-xs block mb-1">🔮 Arcane Magic</span>
                <p className="text-xs">
                  <strong>Palette:</strong> Deep Indigo (#6366f1) and Neon Violet (#c084fc).
                  <br /><strong>Vibe:</strong> Exploding stardust clusters, levitating crystal fragments, cosmic smoke trails, and warping space distortions (subtle refractive ripples around active hubs).
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                <span className="font-bold text-emerald-400 text-xs block mb-1">🌿 Nature / Life Magic</span>
                <p className="text-xs">
                  <strong>Palette:</strong> Bright Emerald (#10b981) and Soft Sage Green.
                  <br /><strong>Vibe:</strong> Growing vine loops, expanding clover patterns on the ground, floating glowing dandelion spores, and warm emerald rings radiating outward.
                </p>
              </div>
              <div className="bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                <span className="font-bold text-red-500 text-xs block mb-1">💀 Necrotic / Dark Magic</span>
                <p className="text-xs">
                  <strong>Palette:</strong> Poison Magenta (#d946ef) and Shadow Black.
                  <br /><strong>Vibe:</strong> Jagged basalt spikes emerging from soil, swirling dark vortex smoke, ash sparks rising upward, and decaying rot boundaries.
                </p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 12,
      title: "12. Visual Hierarchy",
      icon: Eye,
      tagline: "Gameplay readability and priority tiers",
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <p>
            In a high-intensity mobile strategy game, players must make tactical decisions in milliseconds. The screen must never feel cluttered. We enforce a strict visual priority scale:
          </p>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-amber-500 mb-2">Priority Hierarchy Tier Matrix</h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2 border-b border-slate-800 pb-2">
                <span className="bg-red-500/20 text-red-400 font-bold px-1.5 py-0.5 rounded font-mono">TIER 1 (Critical)</span>
                <div>
                  <strong className="text-white block">Active Legions, Combat FX, Enemy Castles</strong>
                  <p className="text-slate-400 mt-0.5">Must possess highly saturated color accents, sharp silhouettes, custom outline glows, and high-frequency animation loops.</p>
                </div>
              </div>
              <div className="flex items-start gap-2 border-b border-slate-800 pb-2">
                <span className="bg-yellow-500/20 text-yellow-400 font-bold px-1.5 py-0.5 rounded font-mono">TIER 2 (High)</span>
                <div>
                  <strong className="text-white block">Alliance Fortresses, Core Gates, Resource Nodes</strong>
                  <p className="text-slate-400 mt-0.5">Framed by structural highlights, emitting gentle smoke/dust particles, accompanied by visible gameplay labels.</p>
                </div>
              </div>
              <div className="flex items-start gap-2 border-b border-slate-800 pb-2">
                <span className="bg-blue-500/20 text-blue-400 font-bold px-1.5 py-0.5 rounded font-mono">TIER 3 (Medium)</span>
                <div>
                  <strong className="text-white block">Paved Roads, River Bridges, Interactive Shrines</strong>
                  <p className="text-slate-400 mt-0.5">High-contrast borders relative to primary terrain but completely static until activated by user tap.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="bg-slate-800 text-slate-400 font-bold px-1.5 py-0.5 rounded font-mono">TIER 4 (Low)</span>
                <div>
                  <strong className="text-white block">Forest Clutter, Background Cliffs, Background Water</strong>
                  <p className="text-slate-400 mt-0.5">Heavily desaturated, low specular reflections, simplified geometry, and zero active animations unless interacting with wind waves.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 13,
      title: "13. Technical Standards",
      icon: Hammer,
      tagline: "Orthographic camera, sprite scaling, pivot points, and mobile optimization",
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <p>
            To deploy flawlessly on mobile platforms (Android/iOS) while maintaining AAA visual fidelity, every environment artist must strictly adhere to our technical configuration standards:
          </p>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-4 font-mono text-xs text-slate-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-bold text-white uppercase text-[10px] tracking-wider text-teal-400 mb-2">Camera Specs</h4>
                <ul className="space-y-1">
                  <li>• Orthographic Camera Mode</li>
                  <li>• Tilt Angle: Strictly 30 degrees</li>
                  <li>• Rotation Angle: 45 degrees (perfect 3/4)</li>
                  <li>• FOV/Size: Dynamic based on screen width</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white uppercase text-[10px] tracking-wider text-purple-400 mb-2">Sprite & Scale Standards</h4>
                <ul className="space-y-1">
                  <li>• Standard Hex Tile: Width 256px, Height 128px</li>
                  <li>• Pivot Points: Center of Hex Base (NOT model center)</li>
                  <li>• Light Source Direction: Left to Right (-1, -1, -0.5)</li>
                  <li>• Shadow Projection Angle: 45° to the right</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-800 pt-3">
              <h4 className="font-bold text-white uppercase text-[10px] tracking-wider text-amber-500 mb-2">Mobile Draw Call Optimizations</h4>
              <ul className="space-y-2">
                <li>
                  <strong>1. Static Asset Batching:</strong> All non-interactive trees, mountains, and grass patches must automatically pack into a single mesh instance chunk per sector, reducing draw calls by up to 80%.
                </li>
                <li>
                  <strong>2. Texture Atlasing:</strong> Biome flora must share a single 2048x2048 hand-painted albedo/roughness atlas. Avoid loading individual materials.
                </li>
                <li>
                  <strong>3. LoD Framework:</strong> 
                  <br />- LoD 0 (Close-up zoom): High poly + active wind vertex swaying + volumetric god-rays.
                  <br />- LoD 1 (Standard gameplay): Wind physics disabled, flat shadow projections.
                  <br />- LoD 2 (Max zoom-out): Rendered as flat card sprites with pre-baked lighting.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 14,
      title: "14. Art Direction Rules",
      icon: CheckCircle2,
      tagline: "Do's, Don'ts, and final review checklists",
      content: (
        <div className="space-y-6 text-sm text-slate-300 leading-relaxed">
          <p>
            To maintain perfect cohesion across our art team and external partners, we use a rigid set of rules and checklists. Every environment piece must undergo this review process before final integration.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-xl space-y-2">
              <h4 className="font-bold text-emerald-400 text-xs uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> DO
              </h4>
              <ul className="space-y-1 text-xs list-disc pl-5 text-slate-300">
                <li>Keep outlines clean and readable from a high distance.</li>
                <li>Use hand-painted highlights on all upward-facing surfaces.</li>
                <li>Incorporate warm golden light/cool blue shadow contrast rules.</li>
                <li>Ensure assets possess clear bases where they meet the soil.</li>
                <li>Blend terrain textures with contrast heightmaps, not gradients.</li>
              </ul>
            </div>

            <div className="bg-red-950/20 border border-red-500/30 p-4 rounded-xl space-y-2">
              <h4 className="font-bold text-red-400 text-xs uppercase tracking-wider flex items-center gap-1">
                <ShieldAlert className="w-4 h-4" /> DON'T
              </h4>
              <ul className="space-y-1 text-xs list-disc pl-5 text-slate-300">
                <li>Do not use photo-realistic textures or scan data.</li>
                <li>Do not add microscopic clutter (leaves, small pebbles) on marching paths.</li>
                <li>Do not overlap multiple light colors (keep daylight cohesive).</li>
                <li>Do not create flat vertical cliff walls; always bevel and step.</li>
                <li>Do not use absolute black (#000000) for shadows; use rich indigos.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider text-teal-400">Environment Approval Checklist</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 bg-slate-900/50 p-2 rounded border border-slate-800">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded border-slate-800 bg-slate-950 text-teal-500 focus:ring-0 cursor-not-allowed" disabled />
                <div>
                  <strong>Silhouette Legibility Test:</strong> Asset must remain clearly identifiable when colored entirely black and viewed against a bright sky background.
                </div>
              </div>
              <div className="flex items-start gap-2 bg-slate-900/50 p-2 rounded border border-slate-800">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded border-slate-800 bg-slate-950 text-teal-500 focus:ring-0 cursor-not-allowed" disabled />
                <div>
                  <strong>Color Constancy Verification:</strong> Asset must maintain its color identity when shifted across Morning, Midday, Sunset, and Night lighting rigs.
                </div>
              </div>
              <div className="flex items-start gap-2 bg-slate-900/50 p-2 rounded border border-slate-800">
                <input type="checkbox" defaultChecked className="mt-0.5 rounded border-slate-800 bg-slate-950 text-teal-500 focus:ring-0 cursor-not-allowed" disabled />
                <div>
                  <strong>Pivot Point & Sorting Integrity:</strong> Pivot point sits precisely at the base center, preventing sprite flickering and rendering sorting errors when armies march by.
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const filteredSections = sections.filter(sec => 
    sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sec.tagline.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      
      {/* Top Title Bar */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Palette className="w-5 h-5 text-purple-500" /> Crownspire Master World Art Bible
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Official Lead Environment Art Direction specification guide for the AAA isometric MMO strategy game.
            </p>
          </div>
          
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search Art Bible..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 w-[240px]"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Hand Section Selector (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-2 bg-slate-950/40 p-3 rounded-2xl border border-slate-900">
          <span className="text-[10px] font-mono font-semibold text-slate-500 uppercase tracking-widest px-2 mb-1">Bible Indexes ({filteredSections.length})</span>
          <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredSections.map((sec, idx) => {
              const SecIcon = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    // find index of original section
                    const originalIdx = sections.findIndex(s => s.id === sec.id);
                    setActiveSection(originalIdx);
                  }}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left group ${
                    sections[activeSection].id === sec.id
                      ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/40 text-white'
                      : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg border mt-0.5 transition-colors ${
                    sections[activeSection].id === sec.id
                      ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                      : 'bg-slate-900/80 border-slate-800 text-slate-500 group-hover:text-slate-300'
                  }`}>
                    <SecIcon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-bold truncate">{sec.title}</h3>
                    <p className="text-[10px] text-slate-500 mt-0.5 truncate leading-none">{sec.tagline}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Interactive Live Environment Visualizer Mock */}
          <div className="border-t border-slate-900 pt-3 mt-2">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest px-2 mb-2 block">🎨 Interactive Render Canvas</span>
            
            <div className="bg-slate-950/90 rounded-xl border border-slate-800 p-3 space-y-3 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-300">Biome Preview</span>
                <span className="text-[9px] font-mono text-teal-400">720p HD</span>
              </div>

              {/* Render Canvas Box */}
              <div className="aspect-video w-full rounded-lg bg-slate-900 relative overflow-hidden border border-slate-800 flex flex-col justify-between p-2">
                {/* Background color representing biome */}
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #a78bfa 10%, transparent 11%)', backgroundSize: '16px 16px' }}></div>
                
                {/* Render colored floor card */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {selectedSimBiome === 'Royal Plains' && <div className="text-4xl">🌾🏰🌾</div>}
                  {selectedSimBiome === 'Ancient Forest' && <div className="text-4xl">🌲🗿🌲</div>}
                  {selectedSimBiome === 'Dark Forest' && <div className="text-4xl">💀🏚️💀</div>}
                  {selectedSimBiome === 'Crystal Forest' && <div className="text-4xl">💎🔮💎</div>}
                  {selectedSimBiome === 'Sacred Valley' && <div className="text-4xl">🌟🌿🌟</div>}
                  {selectedSimBiome === 'Golden Meadows' && <div className="text-4xl">🌻🌾🌻</div>}
                  {selectedSimBiome === 'Snow Mountains' && <div className="text-4xl">❄️🏔️❄️</div>}
                  {selectedSimBiome === 'Volcanic Highlands' && <div className="text-4xl">🌋🔥🌋</div>}
                  {selectedSimBiome === 'Whispering Marsh' && <div className="text-4xl">🐸🐊🐸</div>}
                </div>

                <div className="z-10 bg-slate-950/80 backdrop-blur-sm border border-slate-800 rounded px-1.5 py-0.5 text-[8px] font-mono text-slate-400 self-start">
                  Preset: {selectedSimBiome} ({selectedSimTime})
                </div>

                <div className="z-10 flex items-center justify-between mt-auto">
                  <span className="text-[8px] text-slate-500 font-mono">Shader compilation: OK</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  </div>
                </div>
              </div>

              {/* Interactive Controllers */}
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <label className="text-slate-500 block mb-1">Time of Day</label>
                  <select 
                    value={selectedSimTime}
                    onChange={(e) => setSelectedSimTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none"
                  >
                    <option>Morning</option>
                    <option>Midday</option>
                    <option>Sunset</option>
                    <option>Night</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Atmosphere</label>
                  <select 
                    value={selectedSimWeather}
                    onChange={(e) => setSelectedSimWeather(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none"
                  >
                    <option>Clear</option>
                    <option>Mist & Fog</option>
                    <option>Storm / Rain</option>
                    <option>Celestial Fire</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Hand Bible Page Container (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-slate-900/40 border border-slate-800 p-6 rounded-2xl shadow-xl min-h-[500px]">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-4">
            <span className="text-xl">📖</span>
            <div>
              <h3 className="text-md font-bold text-white">
                {sections[activeSection].title}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {sections[activeSection].tagline}
              </p>
            </div>
          </div>

          {/* Section Render Content */}
          <div className="animate-fadeIn">
            {sections[activeSection].content}
          </div>
        </div>

      </div>

    </div>
  );
}

// Sub-component: Color Palette Card
interface ColorPaletteCardProps {
  name: string;
  colors: { hex: string; role: string }[];
  reason: string;
  onCopy: (text: string) => void;
}

function ColorPaletteCard({ name, colors, reason, onCopy }: ColorPaletteCardProps) {
  return (
    <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3 shadow-md">
      <div className="flex items-center justify-between border-b border-slate-900 pb-2">
        <h5 className="font-bold text-white text-xs tracking-wide">{name}</h5>
        <span className="text-[9px] text-slate-500 font-mono">Click to copy</span>
      </div>
      
      {/* Colors Swatches */}
      <div className="grid grid-cols-4 gap-1.5">
        {colors.map((c, i) => (
          <button
            key={i}
            onClick={() => onCopy(c.hex)}
            className="flex flex-col items-center justify-center p-1.5 rounded bg-slate-900 border border-slate-800 hover:border-slate-700 active:scale-95 transition-all text-center group"
          >
            <div 
              className="w-full h-8 rounded border border-white/10 shadow-sm relative"
              style={{ backgroundColor: c.hex }}
            >
              <span className="absolute inset-0 flex items-center justify-center text-[8px] font-mono text-slate-950 opacity-0 group-hover:opacity-100 bg-white/40 font-bold transition-all">COPY</span>
            </div>
            <span className="text-[9px] font-mono text-slate-300 mt-1 font-bold">{c.hex}</span>
            <span className="text-[7.5px] text-slate-500 truncate w-full mt-0.5 leading-none">{c.role}</span>
          </button>
        ))}
      </div>

      <p className="text-[11px] text-slate-400 italic leading-snug">
        <strong>Justification:</strong> {reason}
      </p>
    </div>
  );
}

// Sub-component: Biome Specs Details
function BiomeSpecs({ biome }: { biome: string }) {
  const specs: Record<string, BiomeDetail> = {
    'Royal Plains': {
      terrain: 'Fine groomed green sod grass (#85a973) fading smoothly into clean paved roads.',
      vegetation: 'Massive Sovereign Oaks with golden leaf margins, trimmed hedges, and manicured flower beds.',
      lighting: 'Bright, pristine top-left sun angles to maximize troop marching silhouettes.',
      weather: 'Warm clear skies, drift clouds, and floating golden dust-motes.',
      fog: 'Very thin, low-altitude mist that sits only inside deep defensive trenches.',
      music: 'Noble brass instruments, military horns, and majestic classical string orchestras.',
      rocks: 'Smooth marble stones, golden boundary columns, and manicured granite blocks.',
      trees: 'Sovereign Oaks, Silver Birch trees with bright green canopies, and sculpted boxwood hedges.',
      flowers: 'Sovereign Lilies (#d8b4fe) and Golden Marigolds blooming along royal paths.',
      water: 'Prismatic, light-blue crystalline rivers with foaming waterfalls.',
      wildlife: 'Noble white eagles, pegasus horses, and golden majestic stags.',
      ruins: 'Partially overgrown white marble monuments, pristine broken arches, and golden gates.',
      resources: 'Wheat field nodes, high-density gold mines, and granite deposits.',
      identity: 'Order, sovereign peace, high-end defensive structures, and civilization safety.',
      feeling: 'A majestic feeling of absolute security under the gaze of the sovereign citadel.'
    },
    'Ancient Forest': {
      terrain: 'Rich damp dirt roads (#7c2d12) covered in orange pine-needles and soft lichen.',
      vegetation: 'Elder Redwoods, massive hollow oaks, mossy vines, and ancient glowing roots.',
      lighting: 'Dappled sunbeams filtering through dense branch structures (volumetric sunshafts).',
      weather: 'Soft forest drizzle and gentle, wind-swept falling maple leaves.',
      fog: 'Medium, amber-tinted fog that swirls around mossy tree trunks.',
      music: 'Soft flutes, acoustic woodwind melodies, and mysterious ancient harps.',
      rocks: 'Colossal mossy boulders, cracked granite monoliths, and ancient stone markers.',
      trees: 'Elder Redwoods, Whispering Canopy Maples, and massive gnarled cypress trees.',
      flowers: 'Lunar Orchids (#06b6d4) glowing softly in the dark underbrush.',
      water: 'Deep green, calm streams covered in water lilies and floating moss.',
      wildlife: 'Ancient wood owls, giant forest bears, and camouflaged shadow panthers.',
      ruins: 'Forgotten stone aqueducts, collapsed columns, and moss-covered waystones.',
      resources: 'Heavy redwood timber patches, iron mineral veins, and herbal gathers.',
      identity: 'Primal nature, centuries of growth, ancient history, and forest deepness.',
      feeling: 'A deep sense of ancient presence watching your army from the dark foliage.'
    },
    'Dark Forest': {
      terrain: 'Charred soil (#111827), basalt gravel, and necrotic black sludge.',
      vegetation: 'Twisted, leafless thorn trees, black brambles, and toxic purple mushrooms.',
      lighting: 'Dim subzero ambient light, high-contrast purple-indigo shadow silhouettes.',
      weather: 'Constant dark ash-fall, howling cold winds, and micro-lightning storms.',
      fog: 'Thick, poison-tinted purple fog reducing visibility to close-range cells.',
      music: 'Low bass cellos, dissonant chords, and hollow, unsettling wind echoes.',
      rocks: 'Sharp, jagged basalt spires and razor-sharp dark obsidian columns.',
      trees: 'Screaming Bramble Willows, twisted ironwood pines, and skeletal white ashes.',
      flowers: 'Toxic Nightshade bells glowing with sick magenta spores (#d946ef).',
      water: 'Bubbling purple acidic bog pools and heavy black necrotic streams.',
      wildlife: 'Corrupted direwolves, toxic marsh-rats, and skeletal phantom crows.',
      ruins: 'Shattered castle battlements, broken execution posts, and iron cages.',
      resources: 'Toxic sulfur patches, obsidian quarries, and rotten wood nodes.',
      identity: 'Corruption, decay, dangerous enemy territory, and high combat risk.',
      feeling: 'A chilling sensation that the land itself wants to consume your legions.'
    },
    'Crystal Forest': {
      terrain: 'Indigo-tinted sand (#1e1b4b), crystalline dust, and violet moss.',
      vegetation: 'Translucent crystal pines, glowing blue fern branches, and stardust grass.',
      lighting: 'Prismatic, glowing ambient light refracted into neon violet and sapphire arcs.',
      weather: 'Floating stardust cosmic clouds and gentle crystal spore rain.',
      fog: 'Soft, neon blue haze that pulsates in sync with the biome crystals.',
      music: 'Ethereal synth chimes, cosmic humming choirs, and crystal resonant tones.',
      rocks: 'Towering amethyst geodes, quartz prisms, and glowing sapphire outcroppings.',
      trees: 'Crystalline Spire Pines, Prism Oaks, and weeping starlight willows.',
      flowers: 'Mana Orchids that release warm starlight bursts when tapped.',
      water: 'Pure glowing indigo pools with high magical refraction and mirror reflections.',
      wildlife: 'Stardust unicorns, glowing mana moths, and celestial crystal foxes.',
      ruins: 'Levitating starlight obelisks, precursor rune-pillars, and floating libraries.',
      resources: 'High-yield mana crystal nodes, gem piles, and rare meteorite iron.',
      identity: 'Arcane high fantasy, precursor cosmic secrets, and intense magic density.',
      feeling: 'A sense of wandering through a celestial dream filled with boundless magic.'
    },
    'Sacred Valley': {
      terrain: 'Pure white stone pathways flanked by emerald clover and mint grass.',
      vegetation: 'Blown white sakura trees, silverwood pines, and glowing life trees.',
      lighting: 'Bright, holy solar shafts (rim-lighting on all leaf structures).',
      weather: 'Gentle golden petal drift and pleasant warm solar winds.',
      fog: 'Light, comforting white mist that sparkles with stardust.',
      music: 'Holy church choirs, silver bells, and majestic, hopeful cellos.',
      rocks: 'Smooth white marble slabs, polished soapstones, and glowing rune-rocks.',
      trees: 'Weeping Silverwoods, White Sakura trees, and Sacred Life Palms.',
      flowers: 'Sunfire Blossoms (#eab308) that warm the air with divine heat.',
      water: 'Sacred thermal lakes flowing with golden, healing thermal vapor.',
      wildlife: 'Pegasus herds, pure-white doves, and luminous lake turtles.',
      ruins: 'Intact sun-temple shrines, grand ivory arches, and white marble steps.',
      resources: 'Divine elixir springs, marble quarries, and golden crop nodes.',
      identity: 'Divine purity, healing energy, alliance sanctuary, and spiritual focus.',
      feeling: 'A state of absolute peace and invincibility under the protection of the gods.'
    },
    'Golden Meadows': {
      terrain: 'Warm amber silt soil covered in knee-high golden marigold fields.',
      vegetation: 'Large sunflower crops, weeping orange willows, and ripe amber orchards.',
      lighting: 'Glorious sunset-orange ambient wash, long cinematic shadows.',
      weather: 'Warm lazy summer breeze, floating dandelion seeds, and fireflies.',
      fog: 'Soft golden dust-mist that settles over the fields at night.',
      music: 'Joyful acoustic guitars, country fiddles, and warm, upbeat flutes.',
      rocks: 'Yellow sandstone columns, smooth orange pebbles, and dry river stones.',
      trees: 'Sun-warmed Willows, Golden Apple orchards, and massive wheat stacks.',
      flowers: 'Sunflowers, golden meadow-cups, and orange-tip dandelions.',
      water: 'Calm, clear-water streams reflecting the golden orange sunset.',
      wildlife: 'Golden honeybees, meadow rabbits, and fleet-footed orange deer.',
      ruins: 'Rustic wooden watermills, ancient stone farmsteads, and wooden bridges.',
      resources: 'Massive wheat farms, gold-dust rivers, and copper mineral nodes.',
      identity: 'Harvest warmth, abundance, rustic peace, and limitless farm lands.',
      feeling: 'A peaceful, heartwarming summer evening that fills you with calm resolve.'
    },
    'Snow Mountains': {
      terrain: 'Pristine powder snow drifts covering deep glacial sub-ice layers.',
      vegetation: 'Sub-zero frozen pine needles, frozen bark bushes, and ice lichens.',
      lighting: 'High-contrast, blinding white daylight paired with deep sky-blue shadows.',
      weather: 'Fierce mountain blizzards, swirling ice storms, and falling snow sheets.',
      fog: 'Thick, cold white mist that settles inside deep glacial canyons.',
      music: 'Deep low brass, heavy battle percussion, and dramatic epic strings.',
      rocks: 'Colossal jagged grey granite peaks covered in frozen waterfalls.',
      trees: 'Everfrost Pines, Glacial Cedars, and sub-zero frozen birch trees.',
      flowers: 'Everfrost Glacial Roses frozen inside crystal-clear ice casing.',
      water: 'Frozen, slippery ice sheets covering deep-blue subglacial lakes.',
      wildlife: 'Giant snow owls, sabertooth cats, and heavy snow leopards.',
      ruins: 'Buried stone fortresses, frozen watchtowers, and shattered stone bridges.',
      resources: 'Rich iron veins, heavy granite rock deposits, and silver ores.',
      identity: 'Sub-zero survival, majestic peaks, dangerous steep heights, and cold.',
      feeling: 'An epic, challenging mountain climb where survival is earned stone by stone.'
    },
    'Volcanic Highlands': {
      terrain: 'Cracked, hot black basalt rock with glowing magma veins flowing beneath.',
      vegetation: 'Scorched dark brambles, ash-bushes, and fire-resistant moss.',
      lighting: 'Intense red magma glow casting high-contrast, fiery orange highlights.',
      weather: 'Hot sulfur smoke drift, ash clouds, and falling magma embers.',
      fog: 'Thick, hot black volcanic smoke with high sulfur particle density.',
      music: 'Heavy metal drums, volcanic rumbling sub-bass, and war chants.',
      rocks: 'Jagged hexagonal basalt columns, active magma vents, and fire geodes.',
      trees: 'Charred, skeletal ironwoods, and obsidian-covered stone trunks.',
      flowers: 'Magma Lilies that spark with fire particles when legions pass.',
      water: 'Slow-flowing, high-viscosity magma canals and boiling sulfur wells.',
      wildlife: 'Lava beetles, fire lizards, and volcanic stone golems.',
      ruins: 'Volcanic forge towers, molten steel gates, and ancient fire temples.',
      resources: 'Premium volcanic steel mines, sulfur deposits, and magma geodes.',
      identity: 'Extreme heat, industrial forging, volcanic war bases, and energy.',
      feeling: 'A hot, intense battlefield where metal is forged and power is contested.'
    },
    'Whispering Marsh': {
      terrain: 'Damp purple-green mossy silt soil covered in stagnant water puddles.',
      vegetation: 'Weeping cypress trees draped in heavy moss, glowing marsh-weed.',
      lighting: 'Dim twilight-green ambient glow, soft warm firefly highlights.',
      weather: 'Damp warm marsh-humidity and gentle, rolling swamp fog.',
      fog: 'Thick, glowing green bioluminescent mist that hugs the water surface.',
      music: 'Hypnotic hand-drums, tribal wooden pipes, and marsh-toad calls.',
      rocks: 'Slippery, moss-covered mud stones and hollow petrified logs.',
      trees: 'Ancient Mossy Cypress, petrified weeping willows, and marsh-mangroves.',
      flowers: 'Bioluminescent lily pads that float and glow soft blue-green.',
      water: 'Stagnant green marshways filled with glowing swamp algae.',
      wildlife: 'Giant marsh frogs, toxic swamp vipers, and glowing firefly swarms.',
      ruins: 'Collapsed wooden docks, forgotten tribal shrines, and marsh temples.',
      resources: 'Heavy bog timber, rare toxic herbs, and copper mineral silt.',
      identity: 'Tribal secrets, bio-diversity, dangerous swamp paths, and fog.',
      feeling: 'A mysterious, wet trek through hidden marshlands where secrets hover.'
    }
  };

  const b = specs[biome] || specs['Royal Plains'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-300 text-xs">
      
      {/* Col 1: High Level Profile */}
      <div className="space-y-3">
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
          <span className="font-bold text-teal-400 uppercase tracking-wider block mb-1">Visual Identity Profile</span>
          <p className="text-slate-300">{b.identity}</p>
        </div>
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
          <span className="font-bold text-purple-400 uppercase tracking-wider block mb-1">Exploration Mood & Feeling</span>
          <p className="text-slate-300 italic">"{b.feeling}"</p>
        </div>
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
          <span className="font-bold text-amber-500 uppercase tracking-wider block mb-1">Terrain Foundation</span>
          <p className="text-slate-300">{b.terrain}</p>
        </div>
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
          <span className="font-bold text-blue-400 uppercase tracking-wider block mb-1">Lighting Configuration</span>
          <p className="text-slate-300">{b.lighting}</p>
        </div>
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
          <span className="font-bold text-[#b91c1c] uppercase tracking-wider block mb-1">Resource Node Placement</span>
          <p className="text-slate-300">{b.resources}</p>
        </div>
      </div>

      {/* Col 2: Flora, Fauna, Audio */}
      <div className="space-y-3">
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
          <span className="font-bold text-emerald-400 uppercase tracking-wider block mb-1">Vegetation & Trees</span>
          <p className="text-slate-300">{b.vegetation}</p>
          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-900 text-[10px]">
            <div><strong>Primary Trees:</strong> {b.trees}</div>
            <div><strong>Primary Flowers:</strong> {b.flowers}</div>
          </div>
        </div>
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
          <span className="font-bold text-cyan-400 uppercase tracking-wider block mb-1">Rocks & Water Structures</span>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div><strong>Rock formations:</strong> {b.rocks}</div>
            <div><strong>Water features:</strong> {b.water}</div>
          </div>
        </div>
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
          <span className="font-bold text-orange-400 uppercase tracking-wider block mb-1">Atmospheric Weather & Fog</span>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div><strong>Weather preset:</strong> {b.weather}</div>
            <div><strong>Fog factor:</strong> {b.fog}</div>
          </div>
        </div>
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
          <span className="font-bold text-pink-400 uppercase tracking-wider block mb-1">Audio & Wildlife Presence</span>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div><strong>Music orchestration:</strong> {b.music}</div>
            <div><strong>Local fauna species:</strong> {b.wildlife}</div>
          </div>
        </div>
      </div>

    </div>
  );
}
