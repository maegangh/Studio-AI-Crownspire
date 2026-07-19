extends PanelContainer

# ==========================================
# CROWNSPIRE HERO SORT MENU CONTROLLER
# ==========================================
# Manages sort parameters including Power, Level, Rarity, and Favorite weights.

signal sort_changed(sort_by: String, descending: bool)

@onready var sort_option: OptionButton = %SortOption
@onready var direction_btn: Button = %DirectionBtn

var current_sort: String = "POWER"
var is_descending: bool = true

func _ready() -> void:
	# Add sorting keys
	sort_option.clear()
	sort_option.add_item("⚡ SORT BY POWER")
	sort_option.add_item("📈 SORT BY LEVEL")
	sort_option.add_item("★ SORT BY RARITY")
	sort_option.add_item("❤️ SORT BY FAVORITES")
	
	sort_option.item_selected.connect(_on_sort_selected)
	direction_btn.pressed.connect(_on_direction_toggled)
	_update_direction_button()

func _on_sort_selected(index: int) -> void:
	match index:
		0: current_sort = "POWER"
		1: current_sort = "LEVEL"
		2: current_sort = "RARITY"
		3: current_sort = "FAVORITE"
	sort_changed.emit(current_sort, is_descending)

func _on_direction_toggled() -> void:
	is_descending = not is_descending
	_update_direction_button()
	sort_changed.emit(current_sort, is_descending)

func _update_direction_button() -> void:
	if is_descending:
		direction_btn.text = "▼ DESC"
	else:
		direction_btn.text = "▲ ASC"
