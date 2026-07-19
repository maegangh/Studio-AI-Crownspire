# ==============================================================================
#                       CROWNSPIRE - GAME PRODUCTION SYSTEM                      
#                 MarchAmbientEffects.gd - Godot 4 Controller for                
#              Premium Mobile MMO Strategy World Map March Skins                 
# ==============================================================================
# Style: 2.5D Stylized Fantasy (similar to Whiteout Survival / Call of Dragons).
# Purpose: Manages high-performance visual effects for giant strategic mounts.
#
# HOW TO USE:
# 1. Place this script in "res://scripts/vfx/MarchAmbientEffects.gd".
# 2. Add as the script on your "MarchAmbientEffects" scene node.
# 3. Connect your March movement/velocity events to toggle 'is_moving'.
# ==============================================================================

extends Node2D
class_name MarchAmbientEffects

# --- Theme Enum Setup ---
enum MarchTheme {
	EMBER_GRIFFIN,   # Emberspire Griffin (Fire/Lava embers)
	FROST_WOLF,      # Frostfang Wolf (Ice/Glacier snow drift)
	ELDER_ELK,       # Elderwood Elk (Nature healing fireflies)
	STORM_EAGLE,     # Storm Eagle (Volt/Plasma crackling sparks)
	VOID_PANTHER     # Void Panther (Shadow/Abyss twilight fog)
}

# --- Quality Control for Mobile Performance ---
enum QualityMode {
	HIGH,
	MEDIUM,
	LOW_PERFORMANCE
}

# --- Exported Inspector Variables ---
@export var theme: MarchTheme = MarchTheme.EMBER_GRIFFIN:
	set(val):
		theme = val
		if is_node_ready():
			_apply_theme_config()

@export_range(0.1, 3.0, 0.05) var intensity: float = 1.0:
	set(val):
		intensity = val
		if is_node_ready():
			_update_particle_amounts()

@export_range(0.1, 2.5, 0.05) var effect_scale: float = 1.0:
	set(val):
		effect_scale = val
		scale = Vector2(effect_scale, effect_scale)

@export var is_moving: bool = false:
	set(val):
		is_moving = val
		if is_node_ready():
			_update_locomotion()

@export var mobile_quality: QualityMode = QualityMode.MEDIUM:
	set(val):
		mobile_quality = val
		if is_node_ready():
			_apply_quality_limits()

# --- Core Component References ---
@onready var glow_particles: CPUParticles2D = $GlowParticles
@onready var trail_particles: CPUParticles2D = $TrailParticles
@onready var footstep_particles: CPUParticles2D = $FootstepParticles
@onready var theme_particles: CPUParticles2D = $ThemeParticles
@onready var aura_pulse: Sprite2D = $AuraPulse
@onready var aura_pulse_anim: AnimationPlayer = $AuraPulse/AnimationPlayer
@onready var screen_notifier: VisibleOnScreenNotifier2D = $VisibleOnScreenNotifier2D

# --- High-Readability Contrast Color Tints at Zoom Distance ---
const THEME_DATA = {
	MarchTheme.EMBER_GRIFFIN: {
		"glow": Color(1.0, 0.35, 0.0, 0.8),    # Intense Lava Orange
		"trail": Color(1.0, 0.7, 0.1, 0.6),    # Sparks and Warm trailing embers
		"steps": Color(0.9, 0.2, 0.0, 0.45),   # Burnt lava footprints
		"theme": Color(1.0, 0.8, 0.2, 0.75),   # Floating volcanic sparks
		"aura": Color(1.0, 0.2, 0.0, 0.25)     # Warm heatwave halo
	},
	MarchTheme.FROST_WOLF: {
		"glow": Color(0.2, 0.6, 1.0, 0.75),    # Cryo Glacier Blue
		"trail": Color(0.6, 0.9, 1.0, 0.6),    # Silver frost clouds
		"steps": Color(0.1, 0.4, 0.9, 0.4),    # Ice crack footprints
		"theme": Color(0.8, 0.95, 1.0, 0.8),   # Sparkling snow crystals
		"aura": Color(0.1, 0.5, 1.0, 0.2)      # Cold frost aura
	},
	MarchTheme.ELDER_ELK: {
		"glow": Color(0.1, 0.85, 0.3, 0.7),    # Forest canopy green
		"trail": Color(0.5, 1.0, 0.4, 0.5),    # Emerald trail sweep
		"steps": Color(0.2, 0.7, 0.2, 0.4),    # Growth sprout footprints
		"theme": Color(0.95, 0.85, 0.25, 0.85),# Golden pollen fireflies
		"aura": Color(0.2, 0.8, 0.3, 0.18)     # Regenerative grove aura
	},
	MarchTheme.STORM_EAGLE: {
		"glow": Color(0.15, 0.3, 1.0, 0.85),   # Electric Blue Cobalt
		"trail": Color(0.5, 0.85, 1.0, 0.7),   # Plasma lightning trails
		"steps": Color(0.3, 0.2, 0.9, 0.5),    # Crackling discharge steps
		"theme": Color(0.8, 0.4, 1.0, 0.75),   # Violet lightning sparks
		"aura": Color(0.2, 0.3, 0.9, 0.25)     # Charged corona aura
	},
	MarchTheme.VOID_PANTHER: {
		"glow": Color(0.45, 0.0, 0.85, 0.8),   # Shadow Amethyst Purple
		"trail": Color(0.65, 0.1, 0.95, 0.55), # Void rift vapor cloud
		"steps": Color(0.2, 0.0, 0.4, 0.45),   # Darkness footfall tracks
		"theme": Color(0.1, 0.05, 0.2, 0.6),   # Drifting matte smoke particles
		"aura": Color(0.3, 0.0, 0.5, 0.3)      # Abyssal shadow rift aura
	}
}

func _ready() -> void:
	_setup_culling_connections()
	_init_systems()
	_apply_theme_config()
	_apply_quality_limits()
	_update_locomotion()
	
	if aura_pulse_anim and aura_pulse_anim.has_animation("pulse"):
		aura_pulse_anim.play("pulse")

func _init_systems() -> void:
	for p in [glow_particles, trail_particles, footstep_particles, theme_particles]:
		if p:
			# Non-local coordinates let particles trail majestically in world space
			p.local_coords = false
			p.preprocess = 0.5 # Warm up the simulation so they don't pop-spawn in

func _setup_culling_connections() -> void:
	if screen_notifier:
		screen_notifier.screen_entered.connect(_on_screen_entered)
		screen_notifier.screen_exited.connect(_on_screen_exited)

# --- Dedicated Theme Initializers ---
func setup_emberspire_griffin() -> void:
	theme = MarchTheme.EMBER_GRIFFIN
	
func setup_frostfang_wolf() -> void:
	theme = MarchTheme.FROST_WOLF
	
func setup_elderwood_elk() -> void:
	theme = MarchTheme.ELDER_ELK
	
func setup_storm_eagle() -> void:
	theme = MarchTheme.STORM_EAGLE
	
func setup_void_panther() -> void:
	theme = MarchTheme.VOID_PANTHER

# --- Helper Configuration Mutators ---
func _apply_theme_config() -> void:
	var cfg = THEME_DATA[theme]
	
	# Color Tints Configuration
	if glow_particles: glow_particles.color = cfg["glow"]
	if trail_particles: trail_particles.color = cfg["trail"]
	if footstep_particles: footstep_particles.color = cfg["steps"]
	if theme_particles: theme_particles.color = cfg["theme"]
	if aura_pulse: aura_pulse.self_modulate = cfg["aura"]
	
	# Unique directional & movement behaviors for specific thematic classes
	match theme:
		MarchTheme.EMBER_GRIFFIN:
			theme_particles.gravity = Vector2(0, -150) # Sparks drift straight upwards
			theme_particles.radial_accel_min = 10.0
			theme_particles.radial_accel_max = 30.0
		MarchTheme.FROST_WOLF:
			theme_particles.gravity = Vector2(30, 40)   # Lazy sideways blowing snow
			theme_particles.radial_accel_min = -10.0
			theme_particles.radial_accel_max = 10.0
		MarchTheme.ELDER_ELK:
			theme_particles.gravity = Vector2(0, -25)   # Healing gold fireflies hover
			theme_particles.radial_accel_min = -20.0
			theme_particles.radial_accel_max = 20.0
		MarchTheme.STORM_EAGLE:
			theme_particles.gravity = Vector2(0, 0)     # Clinging atmospheric volts
			theme_particles.radial_accel_min = 70.0
			theme_particles.radial_accel_max = 120.0
		MarchTheme.VOID_PANTHER:
			theme_particles.gravity = Vector2(-25, -15) # Smoke pulling behind the unit
			theme_particles.radial_accel_min = -30.0
			theme_particles.radial_accel_max = -5.0

func _apply_quality_limits() -> void:
	# Enforce mobile budgets. High-end devices simulate more particles.
	# Low-end devices strictly cap them to prevent CPU choke.
	var cap_mult = 1.0
	match mobile_quality:
		QualityMode.HIGH:
			cap_mult = 1.4
			processing_mode = PROCESS_MODE_INHERIT
		QualityMode.MEDIUM:
			cap_mult = 1.0
			processing_mode = PROCESS_MODE_INHERIT
		QualityMode.LOW_PERFORMANCE:
			cap_mult = 0.4 # Reduces count below 15 particles per system
			# Disable less visible trails completely on ancient mobile processors
			if trail_particles: trail_particles.emitting = false
			if footstep_particles: footstep_particles.emitting = false
			
	_update_particle_amounts(cap_mult)

func _update_particle_amounts(mult: float = 1.0) -> void:
	var total_intensity = intensity * mult
	
	if glow_particles:
		# Keep each system tightly budgeted to around 10-20 particles
		glow_particles.amount = clamp(int(15 * total_intensity), 1, 20)
	if trail_particles and mobile_quality != QualityMode.LOW_PERFORMANCE:
		trail_particles.amount = clamp(int(18 * total_intensity), 1, 20)
	if theme_particles:
		theme_particles.amount = clamp(int(10 * total_intensity), 1, 15)
	if footstep_particles and mobile_quality != QualityMode.LOW_PERFORMANCE:
		footstep_particles.amount = clamp(int(8 * total_intensity), 1, 12)

func _update_locomotion() -> void:
	var is_visible = screen_notifier == null or screen_notifier.is_on_screen()
	
	if is_moving and is_visible:
		if trail_particles and mobile_quality != QualityMode.LOW_PERFORMANCE:
			trail_particles.emitting = true
		if footstep_particles and mobile_quality != QualityMode.LOW_PERFORMANCE:
			footstep_particles.emitting = true
		if glow_particles:
			glow_particles.speed_scale = 1.5
	else:
		if trail_particles:
			trail_particles.emitting = false
		if footstep_particles:
			footstep_particles.emitting = false
		if glow_particles:
			glow_particles.speed_scale = 1.0

# --- Automatic Dynamic Visible Screen Culling ---
func _on_screen_entered() -> void:
	set_process(true)
	if glow_particles: glow_particles.emitting = true
	if theme_particles: theme_particles.emitting = true
	_update_locomotion()

func _on_screen_exited() -> void:
	# Completely halt script execution and disable emission to save player battery
	set_process(false)
	for p in [glow_particles, trail_particles, footstep_particles, theme_particles]:
		if p:
			p.emitting = false
