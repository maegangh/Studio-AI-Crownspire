extends Control
class_name BagScreen

# ==========================================
# CROWNSPIRE BAG & INVENTORY MASTER MANAGER
# ==========================================
# Orchestrates Category Tabs, Filter Bars, Search Fields, Sort menus, Grids, Detail Panels,
# and activates interactive modals for quantity selections, use prompts, and chest openings.

signal closed()

@onready var close_btn: Button = %CloseButton
@onready var category_tabs: BagCategoryTabs = %CategoryTabs
@onready var search_bar: InventorySearchBar = %SearchBar
@onready var sort_menu: InventorySortMenu = %SortMenu
@onready var filter_bar: InventoryFilterBar = %FilterBar
@onready var inventory_grid: InventoryGrid = %InventoryGrid
@onready var detail_panel: ItemDetailPanel = %DetailPanel

# Popup Anchors
@onready var modal_overlay: ColorRect = $ModalOverlay
@onready var popup_anchor: Control = $PopupAnchor

const QUANTITY_POPUP_SCENE = preload("res://scenes/ItemQuantityPopup.tscn")
const CHEST_POPUP_SCENE = preload("res://scenes/ChestOpeningPopup.tscn")
const USE_CONFIRM_SCENE = preload("res://scenes/ItemUsePopup.tscn")

func _ready() -> void:
	# UI Event connections
	close_btn.pressed.connect(_on_close_pressed)
	category_tabs.category_selected.connect(_on_category_changed)
	search_bar.search_text_changed.connect(_on_search_changed)
	sort_menu.sort_selected.connect(_on_sort_changed)
	filter_bar.filter_selected.connect(_on_filter_changed)
	inventory_grid.item_selected.connect(_on_item_selected_in_grid)
	
	detail_panel.use_pressed.connect(_on_use_item_triggered)
	detail_panel.use_multiple_pressed.connect(_on_use_multiple_triggered)
	
	modal_overlay.visible = false
	
	# Initial display slide-in animation
	_play_slide_in()

func _on_close_pressed() -> void:
	_play_slide_out()

func _on_category_changed(category_id: String) -> void:
	inventory_grid.set_category(category_id)

func _on_search_changed(query: String) -> void:
	inventory_grid.set_search(query)

func _on_sort_changed(sort_mode: String) -> void:
	inventory_grid.set_sort(sort_mode)

func _on_filter_changed(filter_type: String) -> void:
	inventory_grid.set_filter(filter_type)

func _on_item_selected_in_grid(item_id: String) -> void:
	detail_panel.display_item(item_id)

# --- ITEM USAGE & REVELATIONS ---

func _on_use_item_triggered(item_id: String) -> void:
	_execute_use(item_id, 1)

func _on_use_multiple_triggered(item_id: String) -> void:
	# Show quantity slider popup
	modal_overlay.show()
	var qty_pop = QUANTITY_POPUP_SCENE.instantiate() as ItemQuantityPopup
	popup_anchor.add_child(qty_pop)
	qty_pop.setup_popup(item_id)
	
	qty_pop.quantity_confirmed.connect(func(id, qty):
		modal_overlay.hide()
		_execute_use(id, qty)
	)
	qty_pop.cancelled.connect(func():
		modal_overlay.hide()
	)

func _execute_use(item_id: String, quantity: int) -> void:
	var item_def = UIManager.get_item_definition(item_id)
	if item_def.is_empty():
		return
	
	var cat = item_def.get("category_id", "")
	
	# 1. Chests get dedicated ritual opening animation
	if cat == "chests":
		modal_overlay.show()
		var chest_pop = CHEST_POPUP_SCENE.instantiate() as ChestOpeningPopup
		popup_anchor.add_child(chest_pop)
		chest_pop.start_opening(item_id, quantity)
		
		chest_pop.opening_completed.connect(func(rewards):
			modal_overlay.hide()
			# Trigger notification banner or celebrate!
			if UIManager.has_method("notify_rewards_claimed"):
				UIManager.call("notify_rewards_claimed", rewards)
		)
		
	# 2. Valuable items get confirm modals first
	elif item_def.get("rarity", 1) >= 4:
		modal_overlay.show()
		var confirm_pop = USE_CONFIRM_SCENE.instantiate() as ItemUsePopup
		popup_anchor.add_child(confirm_pop)
		confirm_pop.setup_confirmation(item_id)
		
		confirm_pop.use_confirmed.connect(func(id):
			modal_overlay.hide()
			var success = UIManager.use_inventory_item(id, quantity)
			if success:
				_show_success_toast(item_def.get("name", ""), quantity)
		)
		confirm_pop.cancelled.connect(func():
			modal_overlay.hide()
		)
		
	# 3. Simple resources/consumables/XP potions get used instantly
	else:
		var success = UIManager.use_inventory_item(item_id, quantity)
		if success:
			_show_success_toast(item_def.get("name", ""), quantity)

func _show_success_toast(item_name: String, quantity: int) -> void:
	print("[Crownspire Bag] Successfully consumed: ", quantity, "x ", item_name)
	# Trigger system-wide notification if NotificationManager exists
	if has_node("/root/NotificationManager"):
		var notification_mgr = get_node("/root/NotificationManager")
		if notification_mgr.has_method("show_toast"):
			notification_mgr.call("show_toast", "Used %d x %s" % [quantity, item_name])

# --- TRANSITION ANIMATIONS ---

func _play_slide_in() -> void:
	position.x = 720 # Slide in from right side
	modulate.a = 0.0
	var tween = create_tween().set_parallel(true)
	tween.tween_property(self, "position:x", 0, 0.35).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)
	tween.tween_property(self, "modulate:a", 1.0, 0.25)

func _play_slide_out() -> void:
	var tween = create_tween().set_parallel(true)
	tween.tween_property(self, "position:x", 720, 0.3).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_IN)
	tween.tween_property(self, "modulate:a", 0.0, 0.25)
	tween.chain().tween_callback(func():
		closed.emit()
		hide()
	)
