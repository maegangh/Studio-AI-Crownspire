extends PanelContainer

# ==========================================
# CROWNSPIRE HERO BIOGRAPHY/STORY CONTROLLER
# ==========================================
# Highlights background lore, historical descriptions, and unlockable chapters.

@onready var bio_desc_lbl: Label = %BioDescLabel
@onready var chapters_vbox: VBoxContainer = %ChaptersVBox

func load_biography(hero_id: String) -> void:
	var h = UIManager.get_hero(hero_id)
	if h.is_empty():
		return
		
	# Lore biography text
	bio_desc_lbl.text = h.get("biography", "An enigmatic soldier sworn to defend Crownspire against all threats.")
	
	# Clear chapters
	for child in chapters_vbox.get_children():
		child.queue_free()
		
	# Add story chapters
	var lvl = h["level"]
	var chapters = h.get("story_chapters", [])
	
	for idx in range(chapters.size()):
		var chap_title = chapters[idx]
		# Chapter unlocks: Chap 1 (Lvl 1), Chap 2 (Lvl 15), Chap 3 (Lvl 30)
		var req_lvl = 1
		if idx == 1: req_lvl = 15
		elif idx == 2: req_lvl = 30
		
		var unlocked = lvl >= req_lvl
		var row = create_chapter_row(chap_title, req_lvl, unlocked)
		chapters_vbox.add_child(row)

func create_chapter_row(title_str: String, req_lvl: int, unlocked: bool) -> PanelContainer:
	var row = PanelContainer.new()
	var row_sb = StyleBoxFlat.new()
	row_sb.bg_color = Color(0.04, 0.06, 0.1, 0.9)
	row_sb.border_width_left = 1
	row_sb.border_color = Color(1, 0.84, 0, 0.15) if unlocked else Color(1, 1, 1, 0.1)
	row_sb.corner_radius_top_left = 6
	row_sb.corner_radius_bottom_left = 6
	row.add_theme_stylebox_override("panel", row_sb)
	
	var margin = MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 12)
	margin.add_theme_constant_override("margin_top", 8)
	margin.add_theme_constant_override("margin_right", 12)
	margin.add_theme_constant_override("margin_bottom", 8)
	row.add_child(margin)
	
	var hbox = HBoxContainer.new()
	margin.add_child(hbox)
	
	var status_lbl = Label.new()
	status_lbl.text = "📖 " if unlocked else "🔒 "
	status_lbl.add_theme_font_size_override("font_size", 12)
	hbox.add_child(status_lbl)
	
	var title_lbl = Label.new()
	title_lbl.text = title_str.to_upper() if unlocked else "CHAPTER ENCRYPTED"
	title_lbl.add_theme_font_size_override("font_size", 10)
	title_lbl.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	
	if unlocked:
		title_lbl.add_theme_color_override("font_color", Color(1, 0.84, 0))
	else:
		title_lbl.add_theme_color_override("font_color", Color(1, 1, 1, 0.3))
		
	hbox.add_child(title_lbl)
	
	var req_lbl = Label.new()
	req_lbl.text = "UNLOCKED" if unlocked else "REQ LVL %d" % req_lvl
	req_lbl.add_theme_font_size_override("font_size", 9)
	
	if unlocked:
		req_lbl.add_theme_color_override("font_color", Color(0.2, 0.8, 0.5, 0.8))
	else:
		req_lbl.add_theme_color_override("font_color", Color(0.9, 0.2, 0.3, 0.7))
		
	hbox.add_child(req_lbl)
	
	return row
