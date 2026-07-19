extends Control

# ==========================================
# CROWNSPIRE STOREPOPUP MASTER CONTROLLER
# ==========================================
# Manages category tabs, dynamic product grids, resource displays,
# and integrates seamlessly with confirmation dialogs.

@onready var title_label: Label = get_node_or_null("%StoreTitleLabel")
@onready var close_button: Button = get_node_or_null("%StoreCloseButton")
@onready var tabs_container: HBoxContainer = get_node_or_null("%TabsContainer")
@onready var item_grid: GridContainer = get_node_or_null("%ItemGrid")
@onready var gold_label: Label = get_node_or_null("%GoldLabel")
@onready var crystals_label: Label = get_node_or_null("%CrystalsLabel")

@export var item_card_scene: PackedScene = preload("res://store/scenes/StoreItemCard.tscn")
@export var purchase_popup_scene: PackedScene = preload("res://store/scenes/PurchasePopup.tscn")

# Store static databases loaded from local JSON
var categories: Array = []
var store_items: Array = []
var bundles: Array = []
var offers: Array = []

var active_category: String = "featured"

func _ready() -> void:
	# Connect close button
	if close_button:
		close_button.pressed.connect(_on_close_pressed)
		
	# Load data from local JSON database paths
	_load_databases()
	
	# Populate Tab bar buttons
	_setup_category_tabs()
	
	# Initialize view showing featured elements
	select_category("featured")
	
	# Update user visual currency trackers
	_update_currency_displays()
	
	# Listen to transactions completed if UIManager is available
	var global_ui = get_node_or_null("/root/UIManager")
	if global_ui and global_ui.has_signal("purchase_completed"):
		global_ui.connect("purchase_completed", _on_purchase_completed)

func _load_databases() -> void:
	categories = _load_json_file("res://store/data/store_categories.json")
	store_items = _load_json_file("res://store/data/store_items.json")
	bundles = _load_json_file("res://store/data/bundles.json")
	offers = _load_json_file("res://store/data/offers.json")

func _load_json_file(path: String) -> Array:
	if not FileAccess.file_exists(path):
		print_debug("Store Database missing: ", path)
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
		
	# Clear design placeholders
	for child in tabs_container.get_children():
		child.queue_free()
		
	for cat in categories:
		var btn = Button.new()
		btn.text = cat.get("name", "Category").to_upper()
		btn.name = cat.get("id", "cat")
		btn.custom_minimum_size = Vector2(120, 45)
		btn.add_theme_color_override("font_hover_color", Color(0.0, 0.82, 1.0))
		btn.pressed.connect(func(): select_category(cat.get("id")))
		tabs_container.add_child(btn)

func select_category(category_id: String) -> void:
	active_category = category_id
	
	if title_label:
		title_label.text = category_id.to_upper() + " COLLECTION"
		
	# Style active tabs visually
	if tabs_container:
		for btn in tabs_container.get_children():
			if btn is Button:
				if btn.name == category_id:
					btn.modulate = Color(0.0, 0.82, 1.0) # Active Cyan Glow
				else:
					btn.modulate = Color(1, 1, 1)
					
	_populate_store_grid()

func _populate_store_grid() -> void:
	if not item_grid:
		return
		
	# Clear current cards
	for child in item_grid.get_children():
		child.queue_free()
		
	match active_category:
		"featured":
			# Load both discounted offers and best sellers
			for offer in offers:
				_instantiate_card(offer, "offer")
			for item in store_items:
				if item.get("is_best_seller", false):
					_instantiate_card(item, "item")
		"crystals":
			for item in store_items:
				if item.get("category") == "crystals":
					_instantiate_card(item, "item")
		"packs":
			for bundle in bundles:
				_instantiate_card(bundle, "bundle")
		"alliance":
			for item in store_items:
				if item.get("category") == "alliance":
					_instantiate_card(item, "item")

func _instantiate_card(data: Dictionary, item_type: String) -> void:
	if not item_card_scene:
		return
		
	var card = item_card_scene.instantiate()
	item_grid.add_child(card)
	
	# Structure clean common layout
	var formatted_data = {
		"id": data.get("id", ""),
		"name": data.get("name", "Royal Treasury"),
		"type": item_type,
		"cost_amount": data.get("cost_amount", 0.0),
		"cost_currency": data.get("cost_currency", "USD"),
		"bonus_percent": data.get("bonus_percent", 0),
		"is_best_seller": data.get("is_best_seller", false),
		"discount_percent": data.get("discount_percent", 0),
		"description": data.get("description", "Premium progression support pack.")
	}
	
	card.init_card(formatted_data)
	card.card_pressed.connect(_on_card_selected)

func _on_card_selected(card_data: Dictionary) -> void:
	if not purchase_popup_scene:
		return
		
	# Launch confirmation Dialog Overlay
	var popup = purchase_popup_scene.instantiate()
	add_child(popup)
	popup.init_popup(
		card_data.get("id", ""),
		card_data.get("name", ""),
		card_data.get("description", ""),
		card_data.get("cost_currency", ""),
		card_data.get("cost_amount", 0.0)
	)

func _update_currency_displays() -> void:
	# Attempt dynamic sync from central state if exists
	var gold_amount := 125000
	var crystal_amount := 150
	
	var global_ui = get_node_or_null("/root/UIManager")
	if global_ui and "player_gold" in global_ui:
		gold_amount = global_ui.player_gold
	if global_ui and "player_crystals" in global_ui:
		crystal_amount = global_ui.player_crystals
		
	if gold_label:
		gold_label.text = String.num_int64(gold_amount)
	if crystals_label:
		crystals_label.text = String.num_int64(crystal_amount)

func _on_purchase_completed(item_id: String, success: bool, message: String) -> void:
	# Re-sync totals to layout
	_update_currency_displays()

func _on_close_pressed() -> void:
	# Standard screen dismissal transition or queue free
	queue_free()
