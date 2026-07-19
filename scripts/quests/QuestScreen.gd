extends PanelContainer
class_name QuestScreen

# ==========================================
# CROWNSPIRE QUEST & PROGRESSION SCREEN COORDINATOR
# ==========================================

@onready var close_button: Button = %CloseButton if has_node("%CloseButton") else get_node_or_null("Margin/VBox/Header/CloseButton")
@onready var category_tabs: QuestCategoryTabs = %QuestCategoryTabs if has_node("%QuestCategoryTabs") else get_node_or_null("Margin/VBox/QuestCategoryTabs")
@onready var list_panel: QuestListPanel = %QuestListPanel if has_node("%QuestListPanel") else get_node_or_null("Margin/VBox/QuestListPanel")
@onready var detail_panel: QuestDetailPanel = %QuestDetailPanel if has_node("%QuestDetailPanel") else get_node_or_null("QuestDetailPanel")
@onready var claim_all_btn: Button = %ClaimAllButton if has_node("%ClaimAllButton") else get_node_or_null("Margin/VBox/Footer/ClaimAllButton")

# Search and Sorting
@onready var search_bar: LineEdit = %SearchBar if has_node("%SearchBar") else get_node_or_null("Margin/VBox/SearchHBox/SearchBar")
@onready var sort_btn: Button = %SortButton if has_node("%SortButton") else get_node_or_null("Margin/VBox/SearchHBox/SortButton")

# Activity chest trackers
@onready var activity_vbox: VBoxContainer = %ActivityVBox if has_node("%ActivityVBox") else get_node_or_null("Margin/VBox/ActivityVBox")
@onready var meter_bar: ProgressBar = %MeterProgressBar if has_node("%MeterProgressBar") else get_node_or_null("Margin/VBox/ActivityVBox/HBox/MeterProgressBar")
@onready var meter_points_lbl: Label = %MeterPointsLabel if has_node("%MeterPointsLabel") else get_node_or_null("Margin/VBox/ActivityVBox/HBox/MeterPointsLabel")
@onready var meter_title_lbl: Label = %MeterTitleLabel if has_node("%MeterTitleLabel") else get_node_or_null("Margin/VBox/ActivityVBox/HBox/MeterTitleLabel")
@onready var chests_container: Control = %ChestsContainer if has_node("%ChestsContainer") else get_node_or_null("Margin/VBox/ActivityVBox/HBox/MeterProgressBar/ChestsContainer")

# Filters
@onready var filter_all_btn: Button = %FilterAll if has_node("%FilterAll") else get_node_or_null("Margin/VBox/FilterHBox/FilterAll")
@onready var filter_comp_btn: Button = %FilterComp if has_node("%FilterComp") else get_node_or_null("Margin/VBox/FilterHBox/FilterComp")
@onready var filter_pinned_btn: Button = %FilterPinned if has_node("%FilterPinned") else get_node_or_null("Margin/VBox/FilterHBox/FilterPinned")

# Configuration states
var current_category: String = "main"
var current_filter: String = "all"
var search_text: String = ""
var active_sort_mode: String = "default"

func _ready() -> void:
	# Sizing layout setup (Matches standard Mail portrait 720x1280)
	custom_minimum_size = Vector2(720, 1280)
	pivot_offset = Vector2(360, 640)
	
	# Connect UI Signals
	if close_button:
		close_button.pressed.connect(_on_close_pressed)
	if category_tabs:
		category_tabs.category_selected.connect(_on_category_changed)
	if list_panel:
		list_panel.quest_selected_in_list.connect(_on_quest_opened)
		list_panel.quest_action_triggered.connect(_on_action_triggered)
	if claim_all_btn:
		claim_all_btn.pressed.connect(_on_claim_all_pressed)
		
	# Connect Search and Filters
	if search_bar:
		search_bar.text_changed.connect(_on_search_query_changed)
	if sort_btn:
		sort_btn.pressed.connect(_on_sort_toggled)
		
	_setup_filter_buttons()
	
	# Initialize Detail Panel to hidden
	if detail_panel:
		detail_panel.visible = false
		detail_panel.reward_claimed_successfully.connect(_on_detail_claim_successful)
		
	# Listen to QuestManager updates to update chest milestones
	if QuestManager:
		QuestManager.activity_points_changed.connect(_on_activity_points_changed)
		QuestManager.quest_list_updated.connect(_update_claim_all_button_state)
		
	# Initial rendering
	_update_views()
	_animate_entrance()

# --- INITIALIZERS AND ANIMATIONS ---

func _animate_entrance() -> void:
	scale = Vector2(0.9, 0.9)
	modulate.a = 0.0
	var tween = create_tween().set_parallel(true)
	tween.tween_property(self, "scale", Vector2(1.0, 1.0), 0.35).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tween.tween_property(self, "modulate:a", 1.0, 0.25)

func _on_close_pressed() -> void:
	var tween = create_tween().set_parallel(true)
	tween.tween_property(self, "scale", Vector2(0.92, 0.92), 0.25).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN)
	tween.tween_property(self, "modulate:a", 0.0, 0.2)
	await tween.finished
	
	if Engine.has_singleton("UIManager"):
		var ui_mgr = Engine.get_singleton("UIManager")
		if ui_mgr.has_method("close_popup"):
			ui_mgr.close_popup(self)
			return
			
	queue_free()

# --- FILTERING, SEACH, SORT CO-ORDINATION ---

func _setup_filter_buttons() -> void:
	if filter_all_btn:
		filter_all_btn.pressed.connect(func(): _on_filter_changed("all", filter_all_btn))
	if filter_comp_btn:
		filter_comp_btn.pressed.connect(func(): _on_filter_changed("completed", filter_comp_btn))
	if filter_pinned_btn:
		filter_pinned_btn.pressed.connect(func(): _on_filter_changed("pinned", filter_pinned_btn))
		
	# Highlight "all" by default
	_highlight_filter_button(filter_all_btn)

func _on_filter_changed(filter_type: String, active_btn: Button) -> void:
	current_filter = filter_type
	_highlight_filter_button(active_btn)
	_update_list()

func _highlight_filter_button(active_btn: Button) -> void:
	var btns = [filter_all_btn, filter_comp_btn, filter_pinned_btn]
	for btn in btns:
		if btn:
			if btn == active_btn:
				btn.add_theme_color_override("font_color", Color(1.0, 0.85, 0.55, 1.0)) # Selected gold
				var sb = StyleBoxFlat.new()
				sb.bg_color = Color(0.15, 0.2, 0.3, 1.0)
				sb.corner_radius_top_left = 12
				sb.corner_radius_top_right = 12
				sb.corner_radius_bottom_right = 12
				sb.corner_radius_bottom_left = 12
				sb.border_width_bottom = 2
				sb.border_color = Color(1.0, 0.85, 0.55, 1.0)
				btn.add_theme_stylebox_override("normal", sb)
			else:
				btn.add_theme_color_override("font_color", Color(0.6, 0.65, 0.7, 1.0))
				var sb_empty = StyleBoxEmpty.new()
				btn.add_theme_stylebox_override("normal", sb_empty)

func _on_category_changed(category_id: String) -> void:
	current_category = category_id
	_update_views()

func _on_search_query_changed(new_text: String) -> void:
	search_text = new_text
	_update_list()

func _on_sort_toggled() -> void:
	if active_sort_mode == "default":
		active_sort_mode = "points"
		if sort_btn: sort_btn.text = "⇅ Sort: Points"
	elif active_sort_mode == "points":
		active_sort_mode = "pinned"
		if sort_btn: sort_btn.text = "⇅ Sort: Pinned"
	else:
		active_sort_mode = "default"
		if sort_btn: sort_btn.text = "⇅ Sort: Priority"
		
	_update_list()

# --- LAYOUT VIEWER UPDATES ---

func _update_views() -> void:
	# 1. Update list
	_update_list()
	
	# 2. Update claim all button state
	_update_claim_all_button_state()
	
	# 3. Update Activity bar visibility (Only show Daily slider on daily category, Weekly on weekly category)
	if activity_vbox:
		var has_points = (current_category == "daily" or current_category == "weekly")
		activity_vbox.visible = has_points
		if has_points and QuestManager:
			_on_activity_points_changed(QuestManager.daily_activity_points, QuestManager.weekly_activity_points)

func _update_list() -> void:
	if list_panel:
		list_panel.filter_and_render(current_category, current_filter, search_text, active_sort_mode)

func _update_claim_all_button_state() -> void:
	if not claim_all_btn or not QuestManager:
		return
		
	var claimable_count = QuestManager.get_unread_completed_quests_count(current_category)
	if claimable_count > 0:
		claim_all_btn.text = "⚡ CLAIM ALL (%d)" % claimable_count
		claim_all_btn.disabled = false
		
		# Glowing golden style
		var sb = StyleBoxFlat.new()
		sb.bg_color = Color(0.24, 0.44, 0.28, 1.0)
		sb.border_color = Color(0.4, 0.9, 0.5, 1.0)
		sb.border_width_top = 1
		sb.border_width_bottom = 1
		sb.corner_radius_top_left = 6
		sb.corner_radius_top_right = 6
		sb.corner_radius_bottom_right = 6
		sb.corner_radius_bottom_left = 6
		sb.shadow_color = Color(0.1, 0.8, 0.3, 0.15)
		sb.shadow_size = 10
		claim_all_btn.add_theme_stylebox_override("normal", sb)
	else:
		claim_all_btn.text = "⚡ CLAIM ALL"
		claim_all_btn.disabled = true
		
		var sb_empty = StyleBoxFlat.new()
		sb_empty.bg_color = Color(0.1, 0.12, 0.16, 0.8)
		sb_empty.corner_radius_top_left = 6
		sb_empty.corner_radius_top_right = 6
		sb_empty.corner_radius_bottom_right = 6
		sb_empty.corner_radius_bottom_left = 6
		claim_all_btn.add_theme_stylebox_override("disabled", sb_empty)

# --- DYNAMIC ACTIVITY POINTS CHES GRID ENGINE ---

func _on_activity_points_changed(daily_pts: int, weekly_pts: int) -> void:
	if not meter_bar or not meter_points_lbl or not QuestManager:
		return
		
	var is_daily = (current_category == "daily")
	var current_pts = daily_pts if is_daily else weekly_pts
	var max_points = 100 if is_daily else 500
	var milestone_type = "daily_activity" if is_daily else "weekly_activity"
	
	if meter_title_lbl:
		meter_title_lbl.text = "☀️ DAILY CHEST GOAL" if is_daily else "⏳ WEEKLY TRIALS MILESTONES"
		
	meter_bar.max_value = max_points
	meter_bar.value = current_pts
	meter_points_lbl.text = "%d / %d PTS" % [current_pts, max_points]
	
	# Fetch activity milestones configurations
	var milestones = QuestManager.get_activity_milestones(milestone_type)
	
	# Update or build chest buttons along the slider bar dynamically
	if chests_container:
		# Clear old icons
		for child in chests_container.get_children():
			child.queue_free()
			
		for i in range(milestones.size()):
			var ms = milestones[i]
			var req = int(ms.get("points_required", 20))
			var claimed = ms.get("claimed", false)
			
			# Calculate anchor position along progress bar width
			var ratio = float(req) / float(max_points)
			var anchor_x = meter_bar.size.x * ratio - 15.0 # Center chest
			
			var chest_btn = Button.new()
			chest_btn.name = "Chest_" + str(i)
			chest_btn.custom_minimum_size = Vector2(34, 34)
			chest_btn.flat = true
			chest_btn.position = Vector2(anchor_x, -5.0) # Floating over track
			
			# Add beautiful, contextual chest items tooltip / details on hover
			var loot_summary = ""
			for r in ms.get("rewards", []):
				loot_summary += "%s x%d\n" % [r.get("name", ""), int(r.get("quantity", 1))]
			chest_btn.tooltip_text = "Loot Chest (Requires %d Pts):\n%s" % [req, loot_summary]
			
			# Stylize icons
			if claimed:
				chest_btn.text = "📦" # Opened empty box
				chest_btn.modulate = Color(0.5, 0.5, 0.5, 0.8)
			elif current_pts >= req:
				chest_btn.text = "🎁" # Unlocked ready-to-claim box
				chest_btn.modulate = Color(1.0, 0.9, 0.4, 1.0)
				_add_chest_bounce_animation(chest_btn) # Bounce to draw attention
			else:
				chest_btn.text = "🔒" # Locked box
				chest_btn.modulate = Color(0.6, 0.7, 0.85, 1.0)
				
			# Click behavior to claim
			chest_btn.pressed.connect(func(): _on_chest_milestone_pressed(milestone_type, i))
			
			chests_container.add_child(chest_btn)

func _add_chest_bounce_animation(btn: Button) -> void:
	btn.pivot_offset = btn.custom_minimum_size / 2.0
	var tween = btn.create_tween().set_loops()
	tween.tween_property(btn, "scale", Vector2(1.2, 1.2), 0.6).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN_OUT)
	tween.tween_property(btn, "scale", Vector2(0.9, 0.9), 0.6).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN_OUT)

func _on_chest_milestone_pressed(type_str: String, idx: int) -> void:
	if QuestManager:
		var rewards = QuestManager.claim_activity_milestone(type_str, idx)
		if not rewards.is_empty():
			# Instantly redraw chest indicators
			_on_activity_points_changed(QuestManager.daily_activity_points, QuestManager.weekly_activity_points)

# --- OVERLAYS AND CHILD CALLS ---

func _on_quest_opened(quest_id: String) -> void:
	if detail_panel:
		detail_panel.open_for_quest(quest_id)

func _on_action_triggered(quest_id: String, action_label: String) -> void:
	print("[Crownspire Quests] External action launched: ", quest_id, " (", action_label, ")")
	# Closes screen and lets UIManager route the user if needed
	_on_close_pressed()

func _on_detail_claim_successful(_quest_id: String) -> void:
	# Refreshes the scroll list
	_update_views()

func _on_claim_all_pressed() -> void:
	if not QuestManager:
		return
		
	var rewards = QuestManager.claim_all_completed_rewards(current_category)
	if not rewards.is_empty():
		_update_views()
