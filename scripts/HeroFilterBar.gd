extends PanelContainer

# ==========================================
# CROWNSPIRE HERO FILTER BAR CONTROLLER
# ==========================================
# Coordinates keyword searching and class selection triggers.

signal filter_changed(selected_class: String, search_query: String)

@onready var search_input: LineEdit = %SearchInput
@onready var filter_option: OptionButton = %ClassFilterOption

var current_class: String = "ALL"
var current_search: String = ""

func _ready() -> void:
	search_input.text_changed.connect(_on_search_changed)
	
	# Set up OptionButton categories
	filter_option.clear()
	filter_option.add_item("🛡️ ALL CLASSES")
	filter_option.add_item("🛡️ DEFENDER")
	filter_option.add_item("🏹 MARKSMAN")
	filter_option.add_item("⏳ CHRONOMANCER")
	filter_option.add_item("⚔️ WARRIOR")
	
	filter_option.item_selected.connect(_on_class_selected)

func _on_search_changed(new_text: String) -> void:
	current_search = new_text.strip_edges()
	filter_changed.emit(current_class, current_search)

func _on_class_selected(index: int) -> void:
	match index:
		0: current_class = "ALL"
		1: current_class = "Defender"
		2: current_class = "Marksman"
		3: current_class = "Chronomancer"
		4: current_class = "Warrior"
	filter_changed.emit(current_class, current_search)

func reset() -> void:
	search_input.text = ""
	filter_option.selected = 0
	current_class = "ALL"
	current_search = ""
	filter_changed.emit(current_class, current_search)
