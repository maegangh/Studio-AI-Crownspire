# 👑 Crownspire - March Skin GPUParticles2D Ambient Effects Integration Guide

Welcome, Sovereign Developer! Below are the exact file placement rules, texture specifications, scene setup steps, and performance instructions for implementing the **Crownspire Premium March Ambient Effects System** in Godot 4.

---

## 📂 Exact File Placement Map
Place the code and scene files exactly in the following directories of your Godot 4 project to prevent broken import paths:

| File Name | Absolute Godot Path | Purpose |
| :--- | :--- | :--- |
| **`MarchAmbientEffects.gd`** | `res://scripts/vfx/MarchAmbientEffects.gd` | Core GDScript controlling colors, states, and mobile performance. |
| **`MarchAmbientEffects_GPUParticles.tscn`** | `res://scenes/vfx/MarchAmbientEffects.tscn` | Godot Scene Node Tree configuring spatial structures and Animators. |
| **`glow_process_material.tres`** | `res://resources/vfx/glow_process_material.tres` | ParticleProcessMaterial defining spawn scale/speeds for glow clouds. |
| **`trail_process_material.tres`** | `res://resources/vfx/trail_process_material.tres` | ParticleProcessMaterial defining physical trail dragging dynamics. |
| **`footstep_process_material.tres`** | `res://resources/vfx/footstep_process_material.tres` | ParticleProcessMaterial defining ground footfall sparks. |
| **`theme_process_material.tres`** | `res://resources/vfx/theme_process_material.tres` | ParticleProcessMaterial defining theme-specific drifting elements. |

---

## 🎨 Texture Assets Requirements (`res://assets/vfx/`)
You need to place four standard 2D, low-resolution grayscale textures in your project directory at `res://assets/vfx/`. The particle materials and scene references will project or modulate these textures dynamically.

1. **`warm_halo.png` (64x64 px)**
   * *Description:* A soft, radial gradient circle fading smoothly from opaque solid white center to 100% transparent edge.
   * *Usage:* Assigned as the texture for `AuraPulse`.

2. **`glow_puff.png` (32x32 px)**
   * *Description:* A noisy, soft atmospheric dust cloud chunk with organic soft borders.
   * *Usage:* Assigned to the `GlowParticles` texture slot.

3. **`sparkle_star.png` (32x32 px)**
   * *Description:* A crisp, high-contrast four-point star or shard icon.
   * *Usage:* Assigned to `ThemeParticles` and `TrailParticles` textures to register flash.

4. **`footprint_shockwave.png` (32x32 px)**
   * *Description:* A thin, stylized circular outline ring radiating light outwards.
   * *Usage:* Assigned to the `FootstepParticles` texture to display energy impact ring on the terrain.

---

## 🏗️ Godot 4 Scene Node Tree
Ensure your `MarchAmbientEffects.tscn` has the exact structure, case, names, and links:

```text
MarchAmbientEffects (Node2D)  <-- MarchAmbientEffects.gd (Attached)
├── AuraPulse (Sprite2D)      <-- Texture: res://assets/vfx/warm_halo.png
│   └── AnimationPlayer       <-- Contains: Sub-Library with "pulse" loop animation
├── GlowParticles (GPUParticles2D)     <-- Material: res://resources/vfx/glow_process_material.tres
├── TrailParticles (GPUParticles2D)    <-- Material: res://resources/vfx/trail_process_material.tres
├── FootstepParticles (GPUParticles2D) <-- Material: res://resources/vfx/footstep_process_material.tres
├── ThemeParticles (GPUParticles2D)    <-- Material: res://resources/vfx/theme_process_material.tres
└── VisibleOnScreenNotifier2D          <-- Extents set to [-100, -100, 200, 200]
```

---

## ⚔️ Attachment & Integration Tutorial

To attach your brand-new FX system to any world-map march entity (such as a Griffin, Wolf, or Dragon):

1. **Open your March Unit scene** (e.g., `res://scenes/units/GriffinMarchSkin.tscn`).
2. Instance the `MarchAmbientEffects.tscn` scene as a joint child under your principal `Sprite2D` or `AnimatedSprite2D`:
   ```text
   GriffinMarchSkin (CharacterBody2D)
   ├── CharacterSprite (AnimatedSprite2D) <-- Ground contact offset pivot
   │   └── MarchAmbientEffects (Instanced Scene)
   └── CollisionShape2D
   ```
3. Connect your locomotion script. When your March starts moving towards coordinates, toggle the `is_moving` parameter:
   ```gdscript
   # In res://scripts/units/GriffinMarchSkin.gd
   @onready var vfx = $CharacterSprite/MarchAmbientEffects
   
   func set_target_destination(dest: Vector2) -> void:
       vfx.is_moving = true
       vfx.set_deferred("is_moving", true) # Safe thread toggly
   
   func stop_march() -> void:
       vfx.is_moving = false
   ```
4. Adjust theme directly in the Godot inspector. Choose `EMBER_GRIFFIN`, `FROST_WOLF`, `ELDER_ELK`, `STORM_EAGLE`, or `VOID_PANTHER` to watch colors and movement behavior instantly update!

---

## 📱 Mobile Optimizations Safeguards
* **Physics Limit:** By default, particles run with `fixed_fps = 30` and `interpolate = true` (fractional deltas enabled). This keeps animation looking beautifully smooth at 60Hz/120Hz while calculating physical updates only 30 times a second to save mobile processors.
* **Auto Screen Culling:** The `VisibleOnScreenNotifier2D` binds hook connections: when the march marches off the visible camera segment, the scripts pause and kill emission routines totally, preventing background power drainage.
