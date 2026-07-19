extends PanelContainer

# ==========================================
# CROWNSPIRE TAB NAVIGATION BAR CONTROLLER
# ==========================================
# Manages horizontal or scrollable lists of shop categories.
# Instantiates ShopCategoryButtons dynamically from database.

signal tab_changed(category_id: String)

@export var category_button_scene: PackedScene = preload("res://scenes/ShopCategoryButton.tscn")

@onready var tabs_container: HBoxContainer = %TabsContainer

var active_tab_id: String = ""
var buttons_dict: Dictionary = {} # Maps category_id string -> ShopCategoryButton node

func _ready() -> void:
	# Populate categories from global database
	populate_tabs(UIManager.get_categories())

func populate_tabs(categories: Array) -> void:
	# Clear existing children first
	for child in tabs_container.get_children():
		child.queue_free()
	buttons_dict.clear()
	
	if categories.is_empty():
		return
		
	# Sort by priority
	var sorted_categories = categories.duplicate()
	sorted_categories.sort_custom(func(a, b): return a.get("priority", 99) < b.get("priority", 99))
	
	for cat in sorted_categories:
		var cat_id = cat.get("id", "")
		var cat_name = cat.get("name", "")
		var cat_icon = cat.get("icon", "")
		
		var btn = category_button_scene.instantiate()
		tabs_container.add_child(btn)
		
		# Setup button parameters
		btn.category_id = cat_id
		btn.category_name = cat_name
		if not cat_icon.is_empty():
			btn.icon_texture = load(cat_icon)
			
		btn.category_selected.connect(_on_category_button_pressed)
		buttons_dict[cat_id] = btn
		
	# Select first tab by default
	if not sorted_categories.is_empty():
		var first_id = sorted_categories[0].get("id", "")
		select_tab(first_id, false) # Silent default select

func select_tab(category_id: String, emit: bool = true) -> void:
	if category_id == active_tab_id:
		return
		
	# De-select previous
	if buttons_dict.has(active_tab_id):
		buttons_dict[active_tab_id].is_selected = false
		
	active_tab_id = category_id
	
	# Select new
	if buttons_dict.has(active_tab_id):
		buttons_dict[active_tab_id].is_selected = true
		
	if emit:
		tab_changed.emit(active_tab_id)

func set_tab_badge(category_id: String, visible: bool) -> void:
	if buttons_dict.has(category_id):
		buttons_dict[category_id].show_badge = visible

func _on_category_button_pressed(category_id: String) -> void:
	select_tab(category_id, true)
