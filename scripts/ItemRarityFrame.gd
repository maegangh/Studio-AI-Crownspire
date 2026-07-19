extends PanelContainer
class_name ItemRarityFrame

# ==========================================
# CROWNSPIRE ALCHEMICAL RARITY FRAME
# ==========================================
# Adapts color border, backing, and glow based on item rarity (1-5).

const COLOR_COMMON = Color(0.35, 0.38, 0.45, 1.0)       # Muted Steel
const COLOR_UNCOMMON = Color(0.12, 0.65, 0.32, 1.0)     # Emerald Glow
const COLOR_RARE = Color(0.14, 0.52, 0.90, 1.0)         # Royal Sapphire
const COLOR_EPIC = Color(0.58, 0.20, 0.88, 1.0)         # Arcane Amethyst
const COLOR_LEGENDARY = Color(0.92, 0.60, 0.08, 1.0)    # Celestial Gold

func set_rarity(rarity: int) -> void:
	var color := COLOR_COMMON
	match rarity:
		2: color = COLOR_UNCOMMON
		3: color = COLOR_RARE
		4: color = COLOR_EPIC
		5: color = COLOR_LEGENDARY
	
	# Apply styling via custom properties or override styles
	var style: StyleBoxFlat = get_theme_stylebox("panel").duplicate() as StyleBoxFlat
	if style:
		style.border_color = color
		style.shadow_color = Color(color.r, color.g, color.b, 0.25)
		add_theme_stylebox_override("panel", style)
