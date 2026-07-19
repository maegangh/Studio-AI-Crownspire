extends Control

# ==========================================
# CROWNSPIRE HERO POPUP MASTER CONTROLLER
# ==========================================
# Acts as the primary module orchestrator. Integrates the scrollable selection menu, 
# search and category filters, favorite states, and detailed hero breakdown overlays.

@onready var title_lbl: Label = get_node_or_null("%HeroPopupTitleLabel")
@onready var close_btn: Button = get_node_or_null("%HeroPopupCloseButton")
@onready var tabs_container: HBoxContainer = get_node_or_null("%HeroTabsContainer")
@onready var list_container: VBoxContainer = get_node_or_null("%HeroListContainer")
@onready var search_input: LineEdit = get_node_or_null("%HeroSearchLineEdit")
@onready var detail_panel: Control = get_node_or_null("%HeroDetailPanel")
@onready var empty_lbl: Label = get_node_or_null("%HeroEmptyStateLabel")

@export var hero_item_scene: PackedScene = preload("res://heroes/scenes/HeroListItem.tscn")

# Datastores
var categories: Array = []
var heroes_db: Array = []
var skills_db: Array = []
var rarities_db: Array = []

var active_class: String = "all"
var search_query: String = ""
var selected_hero_id: String = ""

func _ready() -> void:
	if close_btn:
		close_btn.pressed.connect(_on_close_pressed)
	if search_input:
		search_input.text_changed.connect(_on_search_query_changed)
		
	if detail_panel:
		detail_panel.visible = false
		if detail_panel.has_signal("close_clicked"):
			detail_panel.connect("close_clicked", _on_detail_close_pressed)
		if detail_panel.has_signal("hero_data_updated"):
			detail_panel.connect("hero_data_updated", _on_hero_data_modified)
			
	# Load data
	_load_databases()
	
	# Connect to global notifications if UIManager is present
	var global_ui = get_node_or_null("/root/UIManager")
	if global_ui:
		if global_ui.has_signal("hero_levelled_up"):
			global_ui.connect("hero_levelled_up", _on_global_hero_update)
		if global_ui.has_signal("hero_ascended"):
			global_ui.connect("hero_ascended", _on_global_hero_update)
		if global_ui.has_signal("hero_skill_upgraded"):
			global_ui.connect("hero_skill_upgraded", _on_global_hero_update)
		if global_ui.has_signal("hero_favorite_toggled"):
			global_ui.connect("hero_favorite_toggled", _on_global_hero_favorite_changed)

	_setup_category_tabs()
	select_class_filter("all")

func _load_databases() -> void:
	categories = _load_json_file("res://heroes/data/hero_categories.json")
	rarities_db = _load_json_file("res://heroes/data/hero_rarities.json")
	
	var global_ui = get_node_or_null("/root/UIManager")
	if global_ui and "heroes" in global_ui:
		heroes_db = global_ui.heroes
		skills_db = global_ui.hero_skills
	else:
		# Standalone Fallback DB
		heroes_db = _load_json_file("res://heroes/data/heroes.json")
		skills_db = _load_json_file("res://heroes/data/hero_skills.json")

func _load_json_file(path: String) -> Array:
	if not FileAccess.file_exists(path):
		print_debug("Hero DB file missing: ", path)
		return []
		
	var file = FileAccess.open(path, FileAccess.READ)
	var content = file.get_as_text()
	file.close()
	
	var json = JSON.new()
	var error = json.parse(content)
	if error == OK:
		if typeof(json.data) == TYPE_ARRAY:
			return json.data
	else:
		print_debug("JSON Parse Error in ", path, " Line: ", json.get_error_line(), " - ", json.get_error_message())
	return []

func _setup_category_tabs() -> void:
	if not tabs_container:
		return
		
	# Clear existing
	for child in tabs_container.get_children():
		child.queue_free()
		
	# Create 'All' tab
	var btn_all = Button.new()
	btn_all.text = "👑 ALL HEROES"
	btn_all.name = "all"
	btn_all.custom_minimum_size = Vector2(120, 45)
	btn_all.pressed.connect(func(): select_class_filter("all"))
	tabs_container.add_child(btn_all)
	
	# Create category buttons
	for cat in categories:
		var btn = Button.new()
		var name_str = cat.get("name", "Class")
		btn.text = "%s %s" % [cat.get("icon", ""), name_str.to_upper()]
		btn.name = name_str.to_lower()
		btn.custom_minimum_size = Vector2(130, 45)
		btn.pressed.connect(func(): select_class_filter(name_str.to_lower()))
		tabs_container.add_child(btn)

func select_class_filter(class_id: String) -> void:
	active_class = class_id.to_lower()
	
	# Update Title or UI tab styling
	if title_lbl:
		if active_class == "all":
			title_lbl.text = "SOVEREIGN HALL OF HEROES"
		else:
			title_lbl.text = active_class.to_upper() + " BATTALIONS"
			
	if tabs_container:
		for btn in tabs_container.get_children():
			if btn is Button:
				if btn.name.to_lower() == active_class:
					btn.modulate = Color(0.0, 0.85, 1.0) # Active Cyan Hue
				else:
					btn.modulate = Color(1, 1, 1, 1)
					
	_populate_hero_list()

func _populate_hero_list() -> void:
	if not list_container:
		return
		
	for child in list_container.get_children():
		child.queue_free()
		
	var filtered = _get_filtered_heroes()
	
	if filtered.is_empty():
		if empty_lbl:
			empty_lbl.text = "No heroes match current filter criteria."
			empty_lbl.visible = true
	else:
		if empty_lbl:
			empty_lbl.visible = false
			
		for hero in filtered:
			if not hero_item_scene:
				continue
				
			var card = hero_item_scene.instantiate()
			list_container.add_child(card)
			card.init_item(hero)
			
			if card.has_signal("hero_selected"):
				card.connect("hero_selected", _on_hero_card_selected)
			if card.has_signal("favorite_toggled"):
				card.connect("favorite_toggled", _on_hero_favorite_toggled)

func _get_filtered_heroes() -> Array:
	var result = []
	for h in heroes_db:
		# Check class filter
		var h_class = h.get("class", "Defender").to_lower()
		if active_class != "all" and h_class != active_class:
			continue
			
		# Check search query
		if search_query != "":
			var h_name = h.get("name", "").to_lower()
			var h_title = h.get("title", "").to_lower()
			if not search_query in h_name and not search_query in h_title:
				continue
				
		result.append(h)
		
	# Sort: Favorites first, then level desc, then unlocked first
	result.sort_custom(func(a, b):
		var fav_a = a.get("favorite", false)
		var fav_b = b.get("favorite", false)
		if fav_a != fav_b:
			return fav_a # true (favorite) first
			
		var unl_a = a.get("unlocked", true)
		var unl_b = b.get("unlocked", true)
		if unl_a != unl_b:
			return unl_a # unlocked first
			
		var p_a = int(a.get("power", 0))
		var p_b = int(b.get("power", 0))
		return p_a > p_b
	)
	
	return result

func _on_search_query_changed(new_text: String) -> void:
	search_query = new_text.strip_edges().to_lower()
	_populate_hero_list()

# --- CARD INTERACTIONS ---

func _on_hero_card_selected(hero: Dictionary) -> void:
	selected_hero_id = hero.get("id", "")
	if detail_panel:
		detail_panel.visible = true
		if detail_panel.has_method("display_hero"):
			detail_panel.display_hero(hero, skills_db)

func _on_hero_favorite_toggled(hero_id: String, is_fav: bool) -> void:
	var global_ui = get_node_or_null("/root/UIManager")
	if global_ui and global_ui.has_method("toggle_hero_favorite"):
		global_ui.toggle_hero_favorite(hero_id)
	else:
		# Sync local datastore
		for h in heroes_db:
			if h.get("id") == hero_id:
				h["favorite"] = is_fav
				break
				
	_populate_hero_list()

func _on_hero_data_modified(updated_hero: Dictionary) -> void:
	# Keep master listing in sync
	var h_id = updated_hero.get("id", "")
	for i in range(heroes_db.size()):
		if heroes_db[i].get("id") == h_id:
			heroes_db[i] = updated_hero
			break
			
	_populate_hero_list()

# --- DETAIL MANAGEMENT ---

func _on_detail_close_pressed() -> void:
	if detail_panel:
		detail_panel.visible = false

# --- GLOBAL CALLBACKS ---

func _on_global_hero_update(hero_id: String, _extra = null, _extra2 = null) -> void:
	# Reload DB pointers from global cache
	var global_ui = get_node_or_null("/root/UIManager")
	if global_ui and "heroes" in global_ui:
		heroes_db = global_ui.heroes
		skills_db = global_ui.hero_skills
		
	_populate_hero_list()
	
	# Refresh detailed breakdown panel if focused
	if detail_panel and detail_panel.visible and selected_hero_id == hero_id:
		for h in heroes_db:
			if h.get("id") == hero_id:
				detail_panel.display_hero(h, skills_db)
				break

func _on_global_hero_favorite_changed(hero_id: String, is_favorite: bool) -> void:
	for h in heroes_db:
		if h.get("id") == hero_id:
			h["favorite"] = is_favorite
			break
	_populate_hero_list()

func _on_close_pressed() -> void:
	queue_free()
