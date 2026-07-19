extends ScrollContainer
class_name InventoryGrid

# ==========================================
# CROWNSPIRE INVENTORY GRID CONTROLLER
# ==========================================
# Manages dynamic slot listings, search parsing, sorting orders, and selections.

signal item_selected(item_id: String)

@onready var grid_container: GridContainer = $GridContainer

const SLOT_SCENE = preload("res://scenes/InventorySlot.tscn")

var active_category := "all"
var active_filter := "all"
var active_search := ""
var active_sort := "favorites"
var selected_item_id := ""

func _ready() -> void:
	UIManager.inventory_updated.connect(refresh_grid)
	refresh_grid()

func set_category(cat_id: String) -> void:
	active_category = cat_id
	refresh_grid()

func set_filter(filter_type: String) -> void:
	active_filter = filter_type
	refresh_grid()

func set_search(search_query: String) -> void:
	active_search = search_query
	refresh_grid()

func set_sort(sort_mode: String) -> void:
	active_sort = sort_mode
	refresh_grid()

func select_item(item_id: String) -> void:
	selected_item_id = item_id
	for slot in grid_container.get_children():
		if slot is InventorySlot:
			slot.set_selected_visual(slot.item_id == selected_item_id)
	item_selected.emit(item_id)

func refresh_grid() -> void:
	# Clear previous slots
	for child in grid_container.get_children():
		child.queue_free()
	
	# Fetch all inventory items
	var inventory = UIManager.player_inventory.duplicate(true)
	var filtered_items: Array = []
	
	for entry in inventory:
		var item_id = entry.get("item_id", "")
		var item_def = UIManager.get_item_definition(item_id)
		if item_def.is_empty():
			continue
		
		# 1. Category Filter
		if active_category != "all" and item_def.get("category_id", "") != active_category:
			continue
			
		# 2. Search Query Filter
		if active_search != "":
			var name = item_def.get("name", "").to_lower()
			var desc = item_def.get("description", "").to_lower()
			if not active_search in name and not active_search in desc:
				continue
				
		# 3. Filter Bar Filter (favorites, usable, locked)
		if active_filter == "favorites" and not entry.get("is_favorite", false):
			continue
		elif active_filter == "usable" and not item_def.get("can_use", false):
			continue
		elif active_filter == "locked" and not entry.get("is_locked", false):
			continue
			
		# Combine definition and inventory fields
		var complete_item = entry.duplicate()
		for key in item_def.keys():
			complete_item[key] = item_def[key]
		
		filtered_items.append(complete_item)
	
	# Sort filtered items
	_sort_items(filtered_items)
	
	# Instantiate Slots
	for item in filtered_items:
		var slot = SLOT_SCENE.instantiate() as InventorySlot
		grid_container.add_child(slot)
		
		slot.setup_slot(
			item["item_id"],
			item["quantity"],
			item.get("is_new", false),
			item.get("is_favorite", false),
			item.get("is_locked", false)
		)
		
		# Connect selection signal
		slot.slot_selected.connect(_on_slot_clicked)
		
		# Restore selection visual highlight
		slot.set_selected_visual(slot.item_id == selected_item_id)
	
	# Default selection on fill
	if selected_item_id == "" and filtered_items.size() > 0:
		_on_slot_clicked(filtered_items[0]["item_id"])
	elif filtered_items.size() == 0:
		item_selected.emit("")

func _on_slot_clicked(item_id: String) -> void:
	select_item(item_id)

func _sort_items(items_list: Array) -> void:
	match active_sort:
		"favorites":
			items_list.sort_custom(func(a, b):
				var fav_a = 1 if a.get("is_favorite", false) else 0
				var fav_b = 1 if b.get("is_favorite", false) else 0
				if fav_a != fav_b:
					return fav_a > fav_b
				return int(a.get("rarity", 1)) > int(b.get("rarity", 1))
			)
		"rarity":
			items_list.sort_custom(func(a, b):
				var rarity_a = int(a.get("rarity", 1))
				var rarity_b = int(b.get("rarity", 1))
				if rarity_a != rarity_b:
					return rarity_a > rarity_b
				return a.get("name", "") < b.get("name", "")
			)
		"quantity":
			items_list.sort_custom(func(a, b):
				var qty_a = int(a.get("quantity", 0))
				var qty_b = int(b.get("quantity", 0))
				if qty_a != qty_b:
					return qty_a > qty_b
				return a.get("name", "") < b.get("name", "")
			)
		"name":
			items_list.sort_custom(func(a, b):
				return a.get("name", "") < b.get("name", "")
			)
