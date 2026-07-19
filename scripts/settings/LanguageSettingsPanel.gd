extends VBoxContainer

# ==========================================
# CROWNSPIRE LANGUAGE SELECTION PANEL
# ==========================================
# Lists supported languages as stylized option nodes. Changes
# the active language in SettingsManager and triggers translation flags.

@onready var language_grid: GridContainer = %LanguageGrid

func _ready() -> void:
	_populate_languages()

func _populate_languages() -> void:
	# Clear children
	for child in language_grid.get_children():
		child.queue_free()
		
	var active_lang = SettingsManager.settings["language"]["current"]
	
	for lang in SettingsManager.supported_languages:
		var btn = Button.new()
		btn.text = "%s  %s" % [lang["flag"], lang["name"]]
		btn.custom_minimum_size = Vector2(260, 50)
		btn.alignment = HORIZONTAL_ALIGNMENT_LEFT
		btn.theme_override_font_sizes/font_size = 13
		
		# Stylize active vs inactive language
		if lang["code"] == active_lang:
			btn.modulate = Color(1.0, 0.85, 0.3, 1.0) # Active Gold
			btn.text += "  ✓"
		else:
			btn.modulate = Color(1, 1, 1, 0.8)
			
		btn.pressed.connect(func(): _select_language(lang["code"]))
		language_grid.add_child(btn)

func _select_language(code: String) -> void:
	SettingsManager.settings["language"]["current"] = code
	SettingsManager.save_settings()
	_populate_languages()
	
	# Prompt a temporary system notice
	UIManager.reward_claimed.emit([
		{"name": "Sovereign Dialect Aligned", "quantity": 1, "rarity": 1}
	])
