extends Control
class_name InventorySortMenu

# ==========================================
# CROWNSPIRE INVENTORY SORT MENU CONTROLLER
# ==========================================
# Dispatches sorting preferences to the Bag Grid view.

signal sort_selected(sort_mode: String)

@onready var option_btn: OptionButton = $OptionButton

func _ready() -> void:
	option_btn.clear()
	option_btn.add_item("⭐ Favorites First", 0)
	option_btn.add_item("💎 Rarity (High - Low)", 1)
	option_btn.add_item("📦 Quantity (High - Low)", 2)
	option_btn.add_item("🔤 Alphabetical (A - Z)", 3)
	
	option_btn.item_selected.connect(_on_sort_selected)

func _on_sort_selected(index: int) -> void:
	var mode := "favorites"
	match index:
		0: mode = "favorites"
		1: mode = "rarity"
		2: mode = "quantity"
		3: mode = "name"
	
	sort_selected.emit(mode)
