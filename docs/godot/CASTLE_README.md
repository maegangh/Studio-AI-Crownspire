# 🏰 Crownspire - Castle Skin GPUParticles2D Ambient Effects Integration Guide

Welcome, Sovereign Creator! This integrates the stationary capital fortress and alliance center effects for **Crownspire premium castle skins**.

---

## 📂 Absolute Godot 4 File Structure
To maintain absolute compliance and prevent internal broken path links, place the code files exactly as follows:

| Final Asset File | Destination System Path | Description |
| :--- | :--- | :--- |
| **`CastleAmbientEffects.gd`** | `res://scripts/vfx/CastleAmbientEffects.gd` | Central GDScript controlling the presets, state toggles, and performance scales. |
| **`CastleAmbientEffects.tscn`** | `res://scenes/vfx/CastleAmbientEffects.tscn` | Assembled UI and Particle Node scene structure with components. |
| **`castle_glow_material.tres`** | `res://resources/vfx/castle_glow_material.tres` | ParticleProcessMaterial for the primary architectural base glow. |
| **`castle_ambient_material.tres`** | `res://resources/vfx/castle_ambient_material.tres` | ParticleProcessMaterial defining floating themed sparks and snowflakes. |
| **`castle_window_material.tres`** | `res://resources/vfx/castle_window_material.tres` | ParticleProcessMaterial defining glowing windows pulsing. |
| **`castle_shimmer_material.tres`** | `res://resources/vfx/castle_shimmer_material.tres` | ParticleProcessMaterial for banner shimmer, waving flags and flares. |
| **`castle_burst_material.tres`** | `res://resources/vfx/castle_burst_material.tres` | ParticleProcessMaterial detailing the high-intensity equip burst. |

---

## 🎨 Asset Textures Needed (`res://assets/vfx/`)
Save these light-weight, contrast grayscale images to modulate colors beautifully under high-altitude map zoom:

1. **`ground_aura_glow.png` (128x64 px)**
   * *Aesthetic:* A smooth elliptical radial gradient fading cleanly towards borders.
   * *Application:* Slot in the `GroundAura` sprite texture.

2. **`soft_ambient_puff.png` (32x32 px)**
   * *Aesthetic:* Fuzzy soft cloud dust particle.
   * *Application:* Assigned as the texture for `BaseGlowParticles`.

3. **`crystal_spark.png` (32x32 px)**
   * *Aesthetic:* A sharp, twinkling cross or diamond shard.
   * *Application:* Assigned to `AmbientParticles` and `ShimmerParticles`.

4. **`window_aperture.png` (16x16 px)**
   * *Aesthetic:* A micro square or arch matching castle fortress loops.
   * *Application:* Assigned to the particle texture slot on `WindowGlowParticles`.

---

## 🏗️ Exact Scene Node Tree Hierarchy
Validate your `CastleAmbientEffects.tscn` setup in Godot's Inspector panel:

```text
CastleAmbientEffects (Node2D)  <-- CastleAmbientEffects.gd
├── GroundAura (Sprite2D)      <-- Texture: res://assets/vfx/ground_aura_glow.png
│   └── AnimationPlayer        <-- Animates scale/opacity on "pulse" loop
├── BaseGlowParticles (GPUParticles2D)     <-- Material: res://resources/vfx/castle_glow_material.tres
├── AmbientParticles (GPUParticles2D)      <-- Material: res://resources/vfx/castle_ambient_material.tres
├── WindowGlowParticles (GPUParticles2D)   <-- Material: res://resources/vfx/castle_window_material.tres
├── ShimmerParticles (GPUParticles2D)      <-- Material: res://resources/vfx/castle_shimmer_material.tres
├── EquipBurstParticles (GPUParticles2D)   <-- Material: res://resources/vfx/castle_burst_material.tres
└── VisibleOnScreenNotifier2D              <-- Bounds set to [-150, -150, 300, 300]
```

---

## ⚔️ Attachment and Scripting Guide

Include this on any castle skin base:

1. **Open your Castle Capital scene** (`res://scenes/buildings/RoyalCapitalSkin.tscn`).
2. Instantiate `CastleAmbientEffects.tscn` as a child node under your main castle visual node:
   ```text
   RoyalCapitalSkin (StaticBody2D)
   ├── MainStructureSprite (Sprite2D)
   │   └── CastleAmbientEffects (Instanced Scene)
   └── BaseCollisionCircle
   ```
3. Control from your gameplay code using simple commands:
   ```gdscript
   # In res://scripts/buildings/RoyalCapitalSkin.gd
   @onready var vfx = $MainStructureSprite/CastleAmbientEffects
   
   func upgrade_castle() -> void:
       # Play dramatic, heavy particle blast on leveling up
       vfx.is_equipped = true
       
   func set_ambient_theme(theme_choice: int) -> void:
       vfx.theme = theme_choice
   ```

---

## 📱 Performance Configuration Strategy
* **Low-Power Mode:** In low-performance presets, `window_glow` and `shimmer` are safely terminated. Emitter amounts on `base_glow` and `ambient` scale down to keep rendering constraints strictly below **20 total active fragments**.
* **Fixed FPS Simulation:** Built-in calculation binds particle logic to 30 frame-ticks (`fixed_fps = 30`) while linear interpolation allows visual output to track seamlessly at 60Hz or 120Hz refresh rates. This drastically reduces CPU overdraw and saves player phone batteries.
