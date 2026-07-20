extends Node

# CityImageLoader: Handles safe loading of building artwork with premium fallbacks
# for missing files to avoid checkerboards or empty spaces.

const BUILDINGS_ART_DIR = "res://assets/buildings/"

# Dynamic fallback image generator
static func load_building_image(b_id: String) -> Texture2D:
	var clean_id = b_id.to_lower().strip_edges()
	var path = BUILDINGS_ART_DIR + clean_id + ".png"
	
	if ResourceLoader.exists(path):
		var tex = load(path)
		if tex is Texture2D:
			return tex
			
	# Fallbacks for known aliases
	var alias_path = ""
	if clean_id == "research_hall" or clean_id == "academy":
		alias_path = BUILDINGS_ART_DIR + "academy.png"
	elif clean_id == "citadel_keep" or clean_id == "citadel":
		alias_path = BUILDINGS_ART_DIR + "citadel.png"
	elif clean_id == "infantry_barracks" or clean_id == "barracks":
		alias_path = BUILDINGS_ART_DIR + "barracks.png"
		
	if alias_path != "" and ResourceLoader.exists(alias_path):
		var tex = load(alias_path)
		if tex is Texture2D:
			return tex
			
	return null

# Generates an elegant, high-contrast, gold-trimmed circular fallback texture
# containing a stylized unicode symbol appropriate for the building category.
static func get_fallback_image(b_id: String) -> Texture2D:
	var img = Image.create(128, 128, false, Image.FORMAT_RGBA8)
	
	# Determine background color based on category
	var bg_color = Color(0.06, 0.15, 0.28) # Default dark blue
	
	match b_id:
		"citadel_keep", "citadel":
			bg_color = Color(0.18, 0.08, 0.3) # Purple royal
		"research_hall", "academy":
			bg_color = Color(0.05, 0.22, 0.2) # Emerald teal
		"infantry_barracks", "barracks", "marksmen_camp", "cavalry_stable":
			bg_color = Color(0.25, 0.05, 0.05) # Crimson battle
		"farm":
			bg_color = Color(0.25, 0.2, 0.05) # Warm gold-amber
		"lumber_mill":
			bg_color = Color(0.18, 0.12, 0.06) # Brown timber
		"quarry":
			bg_color = Color(0.15, 0.15, 0.15) # Slate granite
		"iron_mine":
			bg_color = Color(0.1, 0.12, 0.15) # Dark iron
		"warehouse", "trading_post":
			bg_color = Color(0.2, 0.15, 0.25) # Commerce mauve
		"hospital", "sanctuary":
			bg_color = Color(0.05, 0.2, 0.1) # Healing jade
		"watchtower":
			bg_color = Color(0.1, 0.2, 0.3) # Watch blue
			
	# Fill image with transparent first
	img.fill(Color(0,0,0,0))
	
	# Draw a beautiful circle with gold border
	for y in range(128):
		for x in range(128):
			var dist = Vector2(x - 64, y - 64).length()
			if dist < 60:
				if dist >= 57:
					img.set_pixel(x, y, Color(0.85, 0.65, 0.13)) # Gold border
				else:
					img.set_pixel(x, y, bg_color)
					
	return ImageTexture.create_from_image(img)

# Returns a text or unicode symbol corresponding to the building's identity
static func get_fallback_symbol(b_id: String) -> String:
	match b_id:
		"citadel_keep", "citadel":
			return "🏰"
		"research_hall", "academy":
			return "📜"
		"infantry_barracks", "barracks", "marksmen_camp", "cavalry_stable":
			return "🛡️"
		"farm":
			return "🌾"
		"lumber_mill":
			return "🪵"
		"quarry":
			return "🪨"
		"iron_mine":
			return "⛓️"
		"warehouse", "trading_post":
			return "🪙"
		"hospital", "sanctuary":
			return "💖"
		"watchtower":
			return "🏹"
		_:
			return "🏠"
