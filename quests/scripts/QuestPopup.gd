extends Control

# ==========================================
# CROWNSPIRE QUEST POPUP MASTER CONTROLLER
# ==========================================
# Manages category filter tabs, quest list rendering, quest detail breakdowns,
# progress trackers, activity chest milestones, and bulk claim operations.

@onready var title_label: Label = get_node_or_null("%QuestTitleLabel")
@onready var close_button: Button = get_node_or_null("%QuestCloseButton")
@onready var tabs_container: HBoxContainer = get_node_or_null("%TabsContainer")
@onready var quest_list_container: VBoxContainer = get_node_or_null("%QuestListContainer")
@onready var detail_panel: Control = get_node_or_null("%QuestDetailPanel")
@onready var empty_state_label: Label = get_node_or_null("%EmptyStateLabel")

@onready var meter_bar: ProgressBar = get_node_or_null("%MeterProgressBar")
@onready var meter_points_lbl: Label = get_node_or_null("%MeterPointsLabel")
@onready var claim_all_button: Button = get_node_or_null("%ClaimAllButton")

@export var quest_item_scene: PackedScene = preload("res://quests/scenes/QuestListItem.tscn")

# In-memory Quest state databases
var categories: Array = []
var quests_db: Array = []
var rewards_db: Array = []

var active_category: String = "main"
var selected_quest_id: String = ""
var total_activity_points: int = 15 # Default/Current progress points

func _ready() -> void:
	if close_button:
		close_button.pressed.connect(_on_close_pressed)
	if claim_all_button:
		claim_all_button.pressed.connect(_on_claim_all_pressed)
		
	# Connect detailed callbacks
	if detail_panel:
		detail_panel.visible = false
		if detail_panel.has_signal("claim_clicked"):
			detail_panel.connect("claim_clicked", _on_detail_claim_pressed)
		if detail_panel.has_signal("close_clicked"):
			detail_panel.connect("close_clicked", _on_detail_close_pressed)

	# Load JSON databases
	_load_databases()
	
	# Initial Setup
	_setup_category_tabs()
	select_category("main")
	_update_activity_points_display()

func _load_databases() -> void:
	categories = _load_json_file("res://quests/data/quest_categories.json")
	rewards_db = _load_json_file("res://quests/data/quest_rewards.json")
	
	# Attempt integration with Central Autoload QuestManager if present
	var global_quest_mgr = get_node_or_null("/root/QuestManager")
	if global_quest_mgr and "quests_db" in global_quest_mgr:
		quests_db = global_quest_mgr.quests_db
		if "daily_activity_points" in global_quest_mgr:
			total_activity_points = global_quest_mgr.daily_activity_points
	else:
		quests_db = _load_json_file("res://quests/data/quests.json")

func _load_json_file(path: String) -> Array:
	if not FileAccess.file_exists(path):
		print_debug("Quest Database missing: ", path)
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
		
	for child in tabs_container.get_children():
		child.queue_free()
		
	for cat in categories:
		var btn = Button.new()
		btn.text = "%s %s" % [cat.get("icon", ""), cat.get("name", "Category").to_upper()]
		btn.name = cat.get("id", "cat")
		btn.custom_minimum_size = Vector2(140, 45)
		btn.pressed.connect(func(): select_category(cat.get("id")))
		tabs_container.add_child(btn)

func select_category(category_id: String) -> void:
	active_category = category_id
	
	# Update Title
	if title_label:
		title_label.text = category_id.to_upper() + " CAMPAIGN"
		
	# Highlight active button
	if tabs_container:
		for btn in tabs_container.get_children():
			if btn is Button:
				if btn.name == category_id:
					btn.modulate = Color(0.0, 0.82, 1.0) # Active Blue/Cyan Glow
				else:
					btn.modulate = Color(1, 1, 1)
					
	_populate_quest_list()

func _populate_quest_list() -> void:
	if not quest_list_container:
		return
		
	for child in quest_list_container.get_children():
		child.queue_free()
		
	var filtered_quests = _get_filtered_quests()
	
	if filtered_quests.is_empty():
		if empty_state_label:
			empty_state_label.text = "No quests active under " + active_category.capitalize() + "."
			empty_state_label.visible = true
	else:
		if empty_state_label:
			empty_state_label.visible = false
			
		for quest in filtered_quests:
			if not quest_item_scene:
				continue
				
			var item = quest_item_scene.instantiate()
			quest_list_container.add_child(item)
			item.init_item(quest)
			
			if item.has_signal("item_selected"):
				item.connect("item_selected", _on_quest_selected)
			if item.has_signal("pin_toggled"):
				item.connect("pin_toggled", _on_quest_pin_toggled)
			if item.has_signal("claim_clicked"):
				item.connect("claim_clicked", _on_quest_claimed)
				
	_update_claim_all_button_state()

func _get_filtered_quests() -> Array:
	var result = []
	for quest in quests_db:
		if quest.get("category_id") == active_category:
			result.append(quest)
	return result

func _update_activity_points_display() -> void:
	if meter_bar:
		meter_bar.max_value = 100
		meter_bar.value = total_activity_points
	if meter_points_lbl:
		meter_points_lbl.text = "%d / 100 Activity Points" % total_activity_points

func _update_claim_all_button_state() -> void:
	var can_claim_any = false
	for quest in _get_filtered_quests():
		var is_completed = quest.get("is_completed", false) or (quest.get("current_progress", 0) >= quest.get("target_progress", 1))
		var is_claimed = quest.get("is_claimed", false)
		if is_completed and not is_claimed:
			can_claim_any = true
			break
			
	if claim_all_button:
		claim_all_button.disabled = not can_claim_any

# --- INTERACTION PIPELINES ---

func _on_quest_selected(quest_data: Dictionary) -> void:
	selected_quest_id = quest_data.get("id", "")
	if detail_panel:
		detail_panel.visible = true
		if detail_panel.has_method("display_quest"):
			detail_panel.display_quest(quest_data)

func _on_quest_pin_toggled(quest_id: String, is_pinned: bool) -> void:
	# Update database entry
	for quest in quests_db:
		if quest.get("id") == quest_id:
			quest["is_pinned"] = is_pinned
			break
			
	# Sync with central QuestManager if available
	var global_quest_mgr = get_node_or_null("/root/QuestManager")
	if global_quest_mgr and global_quest_mgr.has_method("toggle_pin"):
		global_quest_mgr.toggle_pin(quest_id)

func _on_quest_claimed(quest_id: String) -> void:
	_perform_claim(quest_id)

func _on_detail_claim_pressed(quest_id: String) -> void:
	_perform_claim(quest_id)
	
	# Refresh detailed breakdown panel
	for quest in quests_db:
		if quest.get("id") == quest_id:
			if detail_panel and detail_panel.visible:
				detail_panel.display_quest(quest)
			break

func _perform_claim(quest_id: String) -> void:
	for quest in quests_db:
		if quest.get("id") == quest_id:
			if quest.get("is_claimed", false):
				return # Already claimed
				
			quest["is_claimed"] = true
			
			# Award points
			var points = quest.get("quest_points", 10)
			total_activity_points = clampi(total_activity_points + points, 0, 100)
			_update_activity_points_display()
			
			# Sync to UIManager / Inventory
			var rewards = quest.get("rewards", [])
			var global_ui = get_node_or_null("/root/UIManager")
			if global_ui and global_ui.has_method("_add_raw_currency"):
				for rew in rewards:
					var r_type = rew.get("type", "")
					var qty = rew.get("quantity", 0)
					global_ui._add_raw_currency(r_type, qty)
					
			# Sync to QuestManager if exists
			var global_quest_mgr = get_node_or_null("/root/QuestManager")
			if global_quest_mgr and global_quest_mgr.has_method("claim_quest_reward"):
				global_quest_mgr.claim_quest_reward(quest_id)
			break
			
	_populate_quest_list()

func _on_claim_all_pressed() -> void:
	# Claims all completed, unclaimed quests under the active category
	var filtered = _get_filtered_quests()
	var global_ui = get_node_or_null("/root/UIManager")
	
	for quest in filtered:
		var is_completed = quest.get("is_completed", false) or (quest.get("current_progress", 0) >= quest.get("target_progress", 1))
		var is_claimed = quest.get("is_claimed", false)
		
		if is_completed and not is_claimed:
			quest["is_claimed"] = true
			
			# Award Points
			var points = quest.get("quest_points", 10)
			total_activity_points = clampi(total_activity_points + points, 0, 100)
			
			# Credit currencies
			if global_ui and global_ui.has_method("_add_raw_currency"):
				var rewards = quest.get("rewards", [])
				for rew in rewards:
					var r_type = rew.get("type", "")
					var qty = rew.get("quantity", 0)
					global_ui._add_raw_currency(r_type, qty)
					
			# Sync to central QuestManager if exists
			var global_quest_mgr = get_node_or_null("/root/QuestManager")
			if global_quest_mgr and global_quest_mgr.has_method("claim_quest_reward"):
				global_quest_mgr.claim_quest_reward(quest.get("id"))
				
	_update_activity_points_display()
	_populate_quest_list()
	
	if detail_panel and detail_panel.visible:
		# Sync details view
		for quest in quests_db:
			if quest.get("id") == selected_quest_id:
				detail_panel.display_quest(quest)
				break

func _on_detail_close_pressed() -> void:
	if detail_panel:
		detail_panel.visible = false

func _on_close_pressed() -> void:
	queue_free()
