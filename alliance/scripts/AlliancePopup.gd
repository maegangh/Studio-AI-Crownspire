extends Control

# ==========================================
# CROWNSPIRE ALLIANCE POPUP MASTER CONTROLLER
# ==========================================
# Coordinates the subpanels (Overview/Research, Members, and Gifts).
# Automatically manages data sync and local saving.

@onready var title_lbl: Label = get_node_or_null("%AlliancePopupTitleLabel")
@onready var close_btn: Button = get_node_or_null("%AlliancePopupCloseButton")

# Tab Buttons
@onready var overview_tab_btn: Button = get_node_or_null("%OverviewTabButton")
@onready var members_tab_btn: Button = get_node_or_null("%MembersTabButton")
@onready var gifts_tab_btn: Button = get_node_or_null("%GiftsTabButton")

# Containers
@onready var detail_panel: Control = get_node_or_null("%AllianceDetailPanel")
@onready var list_scroll: ScrollContainer = get_node_or_null("%ListScrollContainer")
@onready var list_container: VBoxContainer = get_node_or_null("%AllianceListContainer")
@onready var empty_state_lbl: Label = get_node_or_null("%AllianceEmptyStateLabel")

# Packed Scenes Preloads
@export var member_item_scene: PackedScene = preload("res://alliance/scenes/AllianceMemberItem.tscn")
@export var gift_panel_scene: PackedScene = preload("res://alliance/scenes/AllianceGiftPanel.tscn")

# Datastores
var overview_data: Dictionary = {}
var members_db: Array = []
var research_db: Array = []
var gifts_db: Array = []

var current_tab: String = "overview"

func _ready() -> void:
	if close_btn:
		close_btn.pressed.connect(_on_close_pressed)
		
	# Tab button bindings
	if overview_tab_btn:
		overview_tab_btn.pressed.connect(func(): select_tab("overview"))
	if members_tab_btn:
		members_tab_btn.pressed.connect(func(): select_tab("members"))
	if gifts_tab_btn:
		gifts_tab_btn.pressed.connect(func(): select_tab("gifts"))

	# Initial database load
	_load_databases()
	
	# Open default view
	select_tab("overview")

func _load_databases() -> void:
	overview_data = _load_json_dict("res://alliance/data/alliance_overview.json")
	members_db = _load_json_array("res://alliance/data/alliance_members.json")
	research_db = _load_json_array("res://alliance/data/alliance_research.json")
	gifts_db = _load_json_array("res://alliance/data/alliance_gifts.json")

	# Connect fallback values if json is missing
	if overview_data.is_empty():
		overview_data = {
			"name": "Dawn Alliance", "tag": "DAWN", "leader": "Lord Aurelius",
			"power": 15420000, "member_count": 48, "max_members": 100, "fortress_level": 3,
			"towers_placed": 12, "max_towers": 20, "crystallite_cores": 1420
		}
	if members_db.is_empty():
		members_db = [{"name": "Lord Aurelius", "rank": "Leader", "power": 1254300, "is_online": true}]

func _load_json_dict(path: String) -> Dictionary:
	if not FileAccess.file_exists(path):
		return {}
	var file = FileAccess.open(path, FileAccess.READ)
	var content = file.get_as_text()
	file.close()
	var json = JSON.new()
	if json.parse(content) == OK:
		if typeof(json.data) == TYPE_DICTIONARY:
			return json.data
	return {}

func _load_json_array(path: String) -> Array:
	if not FileAccess.file_exists(path):
		return []
	var file = FileAccess.open(path, FileAccess.READ)
	var content = file.get_as_text()
	file.close()
	var json = JSON.new()
	if json.parse(content) == OK:
		if typeof(json.data) == TYPE_ARRAY:
			return json.data
	return []

func select_tab(tab_name: String) -> void:
	current_tab = tab_name.to_lower()
	
	# Visual tab state active colours
	var active_color = Color(0.0, 0.85, 1.0) # Bright cyan
	var normal_color = Color(1, 1, 1, 1)
	
	if overview_tab_btn:
		overview_tab_btn.modulate = active_color if current_tab == "overview" else normal_color
	if members_tab_btn:
		members_tab_btn.modulate = active_color if current_tab == "members" else normal_color
	if gifts_tab_btn:
		gifts_tab_btn.modulate = active_color if current_tab == "gifts" else normal_color
		
	# Tab switching visibility logic
	if current_tab == "overview":
		if detail_panel:
			detail_panel.visible = true
			if detail_panel.has_method("display_alliance"):
				detail_panel.display_alliance(overview_data, research_db)
		if list_scroll:
			list_scroll.visible = false
		if empty_state_lbl:
			empty_state_lbl.visible = false
			
	elif current_tab == "members":
		if detail_panel:
			detail_panel.visible = false
		if list_scroll:
			list_scroll.visible = true
		_populate_members_list()
		
	elif current_tab == "gifts":
		if detail_panel:
			detail_panel.visible = false
		if list_scroll:
			list_scroll.visible = true
		_populate_gifts_list()

func _populate_members_list() -> void:
	if not list_container:
		return
		
	for child in list_container.get_children():
		child.queue_free()
		
	if members_db.is_empty():
		if empty_state_lbl:
			empty_state_lbl.text = "No alliance members found."
			empty_state_lbl.visible = true
		return
		
	if empty_state_lbl:
		empty_state_lbl.visible = false
		
	# Sort: Leader first, then Officers, then Veterans, then power descending
	var sorted_members = members_db.duplicate()
	sorted_members.sort_custom(func(a, b):
		var rank_to_weight = func(rank_val):
			var r = str(rank_val).to_lower()
			if r == "4" or r == "leader": return 10
			if r == "3" or r == "officer": return 8
			if r == "2" or r == "veteran": return 5
			return 1
		var w_a = rank_to_weight(a.get("rank"))
		var w_b = rank_to_weight(b.get("rank"))
		if w_a != w_b:
			return w_a > w_b
		return int(a.get("power", 0)) > int(b.get("power", 0))
	)
	
	for member in sorted_members:
		if not member_item_scene:
			continue
			
		var card = member_item_scene.instantiate()
		list_container.add_child(card)
		card.init_item(member)
		
		if card.has_signal("help_pressed"):
			card.connect("help_pressed", _on_member_help_requested)

func _populate_gifts_list() -> void:
	if not list_container:
		return
		
	for child in list_container.get_children():
		child.queue_free()
		
	if gifts_db.is_empty():
		if empty_state_lbl:
			empty_state_lbl.text = "No unclaimed or active gifts."
			empty_state_lbl.visible = true
		return
		
	if empty_state_lbl:
		empty_state_lbl.visible = false
		
	# Show unclaimed gifts first, then claimed
	var sorted_gifts = gifts_db.duplicate()
	sorted_gifts.sort_custom(func(a, b):
		var claim_a = a.get("claimed", false)
		var claim_b = b.get("claimed", false)
		if claim_a != claim_b:
			return not claim_a # unclaimed first (not false = true)
		return int(a.get("rarity", 1)) > int(b.get("rarity", 1))
	)
	
	for gift in sorted_gifts:
		if not gift_panel_scene:
			continue
			
		var row = gift_panel_scene.instantiate()
		list_container.add_child(row)
		row.init_gift(gift)
		
		if row.has_signal("claim_requested"):
			row.connect("claim_requested", _on_gift_claimed)

func _on_member_help_requested(member_name: String) -> void:
	# Action placeholder response
	var toast = get_node_or_null("/root/UIManager")
	if toast and toast.has_method("show_toast"):
		toast.show_toast("Assisted member %s! Contributed to timers." % member_name)
	else:
		print("Sent assistance request to %s!" % member_name)

func _on_gift_claimed(gift_id: String) -> void:
	# Update local dataset
	for g in gifts_db:
		if g.get("id") == gift_id:
			g["claimed"] = true
			break
			
	var toast = get_node_or_null("/root/UIManager")
	if toast and toast.has_method("show_toast"):
		toast.show_toast("Alliance Gift claimed successfully!")

func _on_close_pressed() -> void:
	# Fade out popup or remove
	var tween = create_tween()
	tween.tween_property(self, "modulate:a", 0.0, 0.2)
	tween.tween_callback(queue_free)
