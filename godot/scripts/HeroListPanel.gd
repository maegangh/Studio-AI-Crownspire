extends PanelContainer

# ==========================================
# CROWNSPIRE HERO LIST GRID CONTROLLER
# ==========================================
# Handles layout rendering of hero grid items, applying filters and sorting
# constraints dynamically based on state change signals.

signal hero_card_clicked(hero_id: String)

@export var hero_card_scene: PackedScene = preload("res://scenes/HeroCard.tscn")

@onready var grid_container: GridContainer = %GridContainer
@onready var filter_bar: Control = %HeroFilterBar
@onready var sort_menu: Control = %HeroSortMenu

var active_filters = {
	"class": "ALL",
	"search": ""
}
var active_sort = {
	"by": "POWER",
	"descending": true
}

var current_selected_id: String = ""

func _ready() -> void:
	# Connect to filter and sort subcomponent signals
	filter_bar.filter_changed.connect(_on_filter_changed)
	sort_menu.sort_changed.connect(_on_sort_changed)

func load_heroes_list(selected_id: String = "") -> void:
	current_selected_id = selected_id
	
	# Clean out previous children
	for child in grid_container.get_children():
		child.queue_free()
		
	var all_heroes = UIManager.get_heroes()
	var processed_heroes: Array = []
	
	# 1. Apply Class and Search Filters
	for h in all_heroes:
		var match_class = active_filters["class"] == "ALL" or h.get("class", "").to_lower() == active_filters["class"].to_lower()
		var match_search = active_filters["search"] == "" or h["name"].to_lower().contains(active_filters["search"].to_lower()) or h.get("title", "").to_lower().contains(active_filters["search"].to_lower())
		
		if match_class and match_search:
			processed_heroes.append(h)
			
	# 2. Apply Sorting Parameters
	processed_heroes.sort_custom(func(a, b):
		# Locked heroes always weigh lower than unlocked ones
		var unlocked_a = a.get("unlocked", false)
		var unlocked_b = b.get("unlocked", false)
		if unlocked_a != unlocked_b:
			return unlocked_a # True first
			
		var val_a = 0
		var val_b = 0
		
		match active_sort["by"]:
			"LEVEL":
				val_a = a["level"]
				val_b = b["level"]
			"RARITY":
				val_a = a.get("rarity_stars", 3)
				val_b = b.get("rarity_stars", 3)
			"FAVORITE":
				val_a = 1 if a.get("favorite", false) else 0
				val_b = 1 if b.get("favorite", false) else 0
			_: # Default to POWER
				val_a = a["power"]
				val_b = b["power"]
				
		if val_a == val_b:
			# Fallback tie-breaker: ID string
			return a["id"] < b["id"]
			
		if active_sort["descending"]:
			return val_a > val_b
		else:
			return val_a < val_b
	)
	
	# 3. Instantiate Cards
	for h_data in processed_heroes:
		if hero_card_scene:
			var card = hero_card_scene.instantiate()
			grid_container.add_child(card)
			card.setup(h_data)
			card.set_selected(h_data["id"] == current_selected_id)
			card.hero_selected.connect(_on_card_selected)

func update_selection(selected_id: String) -> void:
	current_selected_id = selected_id
	for card in grid_container.get_children():
		if "hero_id" in card:
			card.set_selected(card.hero_id == current_selected_id)

func _on_filter_changed(selected_class: String, search_query: String) -> void:
	active_filters["class"] = selected_class
	active_filters["search"] = search_query
	load_heroes_list(current_selected_id)

func _on_sort_changed(sort_by: String, descending: bool) -> void:
	active_sort["by"] = sort_by
	active_sort["descending"] = descending
	load_heroes_list(current_selected_id)

func _on_card_selected(hero_id: String) -> void:
	hero_card_clicked.emit(hero_id)
	update_selection(hero_id)
