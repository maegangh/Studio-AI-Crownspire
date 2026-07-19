# ==============================================================================
#                       CROWNSPIRE - GAME PRODUCTION SYSTEM                      
#                 CastleAmbientEffects.gd - Godot 4 Controller for                
#              Premium Mobile MMO Strategy World Map Castle Skins                
# ==============================================================================
# Style: 2.5D Stylized Fantasy (similar to Whiteout Survival / Call of Dragons).
# Purpose: Manages beautiful visual layers for stationary capital fortresses.
#
# HOW TO USE:
# 1. Place this script in "res://scripts/vfx/CastleAmbientEffects.gd".
# 2. Attach it to your "CastleAmbientEffects" scene node.
# 3. Use is_equipped to trigger special entry/reveal bursts.
# ==============================================================================

extends Node2D
class_name CastleAmbientEffects

# --- Theme Enum Setup ---
enum CastleTheme {
	ROYAL_GILDED,    # Imperial White & Floating gold sparkles
	ICE_FROST,       # Frost Fortress Cryo glacier turquoise & falling snowflakes
	VOLCANO_MAGMA,   # Volcanic Ash-plates, embers & lava pulses
	NATURE_SYLVAN,   # Sylvan Woods leaf showers, fireflies & healing green wisps
	VOID_ABYSSAL,    # Abyssal Portal dark energy trailing & purple shadow mist
	CELESTIAL_DIVINE # Divine Crown radiant light rays & pristine sparkles
}

# --- Quality Control for Mobile Performance ---
enum QualityMode {
	HIGH,
	MEDIUM,
	LOW_PERFORMANCE
}

# --- Exported Inspector Variables ---
@export var theme: CastleTheme = CastleTheme.ROYAL_GILDED:
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

@export var mobile_quality: QualityMode = QualityMode.MEDIUM:
	set(val):
		mobile_quality = val
		if is_node_ready():
			_apply_quality_limits()

@export var is_equipped: bool = false:
	set(val):
		var old_val = is_equipped
		is_equipped = val
		if is_node_ready() and is_equipped and not old_val:
			_play_equip_burst()

# --- Core Component References ---
@onready var base_glow: GPUParticles2D = $BaseGlowParticles
@onready var ambient_particles: GPUParticles2D = $AmbientParticles
@onready var window_glow: GPUParticles2D = $WindowGlowParticles
@onready var shimmer_particles: GPUParticles2D = $ShimmerParticles
@onready var ground_aura: Sprite2D = $GroundAura
@onready var aura_anim: AnimationPlayer = $GroundAura/AnimationPlayer
@onready var equip_burst: GPUParticles2D = $EquipBurstParticles
@onready var screen_notifier: VisibleOnScreenNotifier2D = $VisibleOnScreenNotifier2D

# --- High-Readability Contrast Color Tints at Zoom Distance ---
const THEME_DATA = {
	CastleTheme.ROYAL_GILDED: {
		"glow": Color(1.0, 0.7, 0.0, 0.8),       # Celestial Gold
		"ambient": Color(1.0, 0.9, 0.4, 0.65),    # Golden sparkles
		"window": Color(1.0, 0.8, 0.2, 0.9),     # Bright majestic candle windows
		"shimmer": Color(1.0, 1.0, 0.8, 0.85),    # White gold shimmer
		"aura": Color(0.8, 0.5, 0.0, 0.35)       # Regal golden grounding
	},
	CastleTheme.ICE_FROST: {
		"glow": Color(0.15, 0.55, 0.9, 0.75),    # Glacial teal
		"ambient": Color(0.7, 0.9, 1.0, 0.6),    # Falling snowflake mist
		"window": Color(0.3, 0.8, 1.0, 0.85),    # Cyro-frozen torches
		"shimmer": Color(0.9, 1.0, 1.0, 0.8),     # Ice crystal reflection
		"aura": Color(0.05, 0.35, 0.8, 0.25)     # Cryo frost ring
	},
	CastleTheme.VOLCANO_MAGMA: {
		"glow": Color(0.95, 0.25, 0.0, 0.85),    # Raw sulfur lava
		"ambient": Color(1.0, 0.45, 0.1, 0.7),   # Rising ash sparks
		"window": Color(1.0, 0.3, 0.0, 1.0),     # Molten window glow
		"shimmer": Color(1.0, 0.6, 0.0, 0.8),    # Flame flicker pulses
		"aura": Color(0.7, 0.1, 0.0, 0.4)        # Igneous sulfur magma foundation
	},
	CastleTheme.NATURE_SYLVAN: {
		"glow": Color(0.1, 0.8, 0.25, 0.7),      # Core sylvan energy
		"ambient": Color(0.4, 1.0, 0.3, 0.55),   # Falling light leaves
		"window": Color(0.6, 0.9, 0.2, 0.85),    # Bio-luminescent spores
		"shimmer": Color(1.0, 0.85, 0.2, 0.8),   # Forest fireflies
		"aura": Color(0.15, 0.6, 0.2, 0.3)       # Great tree roots wisp
	},
	CastleTheme.VOID_ABYSSAL: {
		"glow": Color(0.4, 0.0, 0.8, 0.85),      # Nightmare void essence
		"ambient": Color(0.65, 0.1, 0.9, 0.6),   # Abyssal floating stars
		"window": Color(0.5, 0.0, 0.9, 0.9),     # Dark sorcerer ports
		"shimmer": Color(0.2, 0.0, 0.4, 0.7),    # Purple dark shadows
		"aura": Color(0.25, 0.0, 0.5, 0.35)      # Eclipse ground rupture ring
	},
	CastleTheme.CELESTIAL_DIVINE: {
		"glow": Color(0.95, 0.9, 1.0, 0.9),      # Pure platinum white
		"ambient": Color(0.8, 0.95, 1.0, 0.7),   # Stardust rain
		"window": Color(0.9, 0.95, 1.0, 0.95),   # Pearlescent rays
		"shimmer": Color(1.0, 1.0, 1.0, 0.9),    # Divine sunlit sparkle
		"aura": Color(0.5, 0.7, 1.0, 0.3)        # Starburst aura ring
	}
}

func _ready() -> void:
	_setup_culling_connections()
	_init_systems()
	_apply_theme_config()
	_apply_quality_limits()
	
	if aura_anim and aura_anim.has_animation("pulse"):
		aura_anim.play("pulse")

func _init_systems() -> void:
	for p in [base_glow, ambient_particles, window_glow, shimmer_particles, equip_burst]:
		if p:
			p.local_coords = false
			p.preprocess = 0.8 # Pre-simulated for stationary visual perfection

func _setup_culling_connections() -> void:
	if screen_notifier:
		screen_notifier.screen_entered.connect(_on_screen_entered)
		screen_notifier.screen_exited.connect(_on_screen_exited)

# --- Dedicated Castle Presets Setup ---
func setup_royal_gilded() -> void:
	theme = CastleTheme.ROYAL_GILDED

func setup_ice_frost() -> void:
	theme = CastleTheme.ICE_FROST

func setup_volcano_magma() -> void:
	theme = CastleTheme.VOLCANO_MAGMA

func setup_nature_sylvan() -> void:
	theme = CastleTheme.NATURE_SYLVAN

func setup_void_abyssal() -> void:
	theme = CastleTheme.VOID_ABYSSAL

func setup_celestial_divine() -> void:
	theme = CastleTheme.CELESTIAL_DIVINE

# --- Helpers Configuration Mutators ---
func _apply_theme_config() -> void:
	var cfg = THEME_DATA[theme]
	
	# Color Tints Configuration
	if base_glow: base_glow.self_modulate = cfg["glow"]
	if ambient_particles: ambient_particles.self_modulate = cfg["ambient"]
	if window_glow: window_glow.self_modulate = cfg["window"]
	if shimmer_particles: shimmer_particles.self_modulate = cfg["shimmer"]
	if ground_aura: ground_aura.self_modulate = cfg["aura"]
	if equip_burst: equip_burst.self_modulate = cfg["shimmer"]
	
	# Theme-specific environmental gravity vectors and accelerations
	match theme:
		CastleTheme.ROYAL_GILDED:
			ambient_particles.process_material.set("gravity", Vector3(0, -50, 0))
		CastleTheme.ICE_FROST:
			ambient_particles.process_material.set("gravity", Vector3(15, 60, 0)) # Chilled wind snow drift
		CastleTheme.VOLCANO_MAGMA:
			ambient_particles.process_material.set("gravity", Vector3(0, -110, 0)) # Fast embers
		CastleTheme.NATURE_SYLVAN:
			ambient_particles.process_material.set("gravity", Vector3(-5, -20, 0)) # Spores float and leaves fall
		CastleTheme.VOID_ABYSSAL:
			ambient_particles.process_material.set("gravity", Vector3(0, -10, 0)) # Heavy smoke curls
		CastleTheme.CELESTIAL_DIVINE:
			ambient_particles.process_material.set("gravity", Vector3(0, -35, 0)) # Star rain

func _apply_quality_limits() -> void:
	var cap_mult = 1.0
	match mobile_quality:
		QualityMode.HIGH:
			cap_mult = 1.4
			processing_mode = PROCESS_MODE_INHERIT
		QualityMode.MEDIUM:
			cap_mult = 1.0
			processing_mode = PROCESS_MODE_INHERIT
		QualityMode.LOW_PERFORMANCE:
			cap_mult = 0.4
			if shimmer_particles: shimmer_particles.emitting = false
			if window_glow: window_glow.emitting = false

	_update_particle_amounts(cap_mult)

func _update_particle_amounts(mult: float = 1.0) -> void:
	var t_intensity = intensity * mult
	
	if base_glow:
		base_glow.amount = clamp(int(15 * t_intensity), 1, 20)
	if ambient_particles:
		ambient_particles.amount = clamp(int(18 * t_intensity), 1, 25)
	if window_glow and mobile_quality != QualityMode.LOW_PERFORMANCE:
		window_glow.amount = clamp(int(10 * t_intensity), 1, 15)
	if shimmer_particles and mobile_quality != QualityMode.LOW_PERFORMANCE:
		shimmer_particles.amount = clamp(int(12 * t_intensity), 1, 18)

func _play_equip_burst() -> void:
	if equip_burst and not equip_burst.emitting:
		equip_burst.one_shot = true
		equip_burst.emitting = true

# --- Automatic Screen-Space Performance Culling ---
func _on_screen_entered() -> void:
	set_process(true)
	if base_glow: base_glow.emitting = true
	if ambient_particles: ambient_particles.emitting = true
	if window_glow and mobile_quality != QualityMode.LOW_PERFORMANCE:
		window_glow.emitting = true
	if shimmer_particles and mobile_quality != QualityMode.LOW_PERFORMANCE:
		shimmer_particles.emitting = true

func _on_screen_exited() -> void:
	set_process(false)
	for p in [base_glow, ambient_particles, window_glow, shimmer_particles, equip_burst]:
		if p:
			p.emitting = false
