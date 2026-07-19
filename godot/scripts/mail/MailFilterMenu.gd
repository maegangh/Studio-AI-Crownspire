extends Control

# ==========================================
# CROWNSPIRE MAIL FILTER & SORT MENU
# ==========================================

signal filter_selected(filter_type: String)
signal sort_selected(sort_mode: String)

@onready var filter_btn: Button = %FilterButton
@onready var sort_btn: Button = %SortButton

@onready var filter_panel: PanelContainer = %FilterOptionsPanel
@onready var sort_panel: PanelContainer = %SortOptionsPanel

# Filter Options
@onready var opt_all: Button = %FilterAll
@onready var opt_unread: Button = %FilterUnread
@onready var opt_rewards: Button = %FilterRewards
@onready var opt_wins: Button = %FilterWins
@onready var opt_losses: Button = %FilterLosses

# Sort Options
@onready var sort_newest: Button = %SortNewest
@onready var sort_oldest: Button = %SortOldest
@onready var sort_expiring: Button = %SortExpiring

var current_filter: String = "all"
var current_sort: String = "newest"

func _ready() -> void:
	# Toggle panels
	filter_btn.pressed.connect(_on_filter_btn_pressed)
	sort_btn.pressed.connect(_on_sort_btn_pressed)
	
	# Connect Filter Options
	opt_all.pressed.connect(func(): _select_filter("all", "All Inbox"))
	opt_unread.pressed.connect(func(): _select_filter("unread", "Unread Only"))
	opt_rewards.pressed.connect(func(): _select_filter("rewards", "Rewards Only"))
	opt_wins.pressed.connect(func(): _select_filter("battle_wins", "Combat Wins"))
	opt_losses.pressed.connect(func(): _select_filter("battle_losses", "Combat Losses"))
	
	# Connect Sort Options
	sort_newest.pressed.connect(func(): _select_sort("newest", "Newest Date"))
	sort_oldest.pressed.connect(func(): _select_sort("oldest", "Oldest Date"))
	sort_expiring.pressed.connect(func(): _select_sort("expiring", "Expiring Soon"))
	
	# Close menus by default
	filter_panel.visible = false
	sort_panel.visible = false

func _on_filter_btn_pressed() -> void:
	filter_panel.visible = !filter_panel.visible
	sort_panel.visible = false # Mutually exclusive

func _on_sort_btn_pressed() -> void:
	sort_panel.visible = !sort_panel.visible
	filter_panel.visible = false

func _select_filter(filter_type: String, label_text: String) -> void:
	current_filter = filter_type
	filter_btn.text = "🔍 " + label_text
	filter_panel.visible = false
	filter_selected.emit(filter_type)

func _select_sort(sort_mode: String, label_text: String) -> void:
	current_sort = sort_mode
	sort_btn.text = "⇅ " + label_text
	sort_panel.visible = false
	sort_selected.emit(sort_mode)

# Safe close when clicking outside
func _input(event: InputEvent) -> void:
	if event is InputEventMouseButton and event.pressed:
		var local_mouse_pos = get_local_mouse_position()
		# Close if clicked away
		if filter_panel.visible and not filter_panel.get_rect().has_point(local_mouse_pos) and not filter_btn.get_rect().has_point(local_mouse_pos):
			filter_panel.visible = false
		if sort_panel.visible and not sort_panel.get_rect().has_point(local_mouse_pos) and not sort_btn.get_rect().has_point(local_mouse_pos):
			sort_panel.visible = false
