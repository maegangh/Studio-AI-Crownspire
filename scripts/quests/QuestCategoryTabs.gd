extends ScrollContainer
class_name QuestCategoryTabs

# ==========================================
# CROWNSPIRE QUESTS CATEGORY TABS toggler
# ==========================================

signal category_selected(category_id: String)

@onready var tabs_container: HBoxContainer = %TabsContainer if has_node("%TabsContainer") else get_node_or_null("HBoxContainer")

# Mapping of button indices or names to category IDs
var categories_map: Dictionary = {
	"main": "🏰 Main Story",
	"daily": "☀️ Daily Activity",
	"weekly": "⏳ Weekly Trials",
	"alliance": "🛡️ Alliance",
	"hero": "🦁 Heroes",
	"wayfinder": "🧭 Wayfinder",
	"crystal_vault": "🌀 Crystal Vault",
	"intel": "🦅 Scout Intel",
	"event": "❄️ Events"
}

var active_category: String = "main"

func _ready() -> void:
	_setup_tabs()
	_update_badges()
	
	# Connect to QuestManager to auto update unread badge indicators
	if QuestManager:
		QuestManager.quest_list_updated.connect(_update_badges)

func _setup_tabs() -> void:
	if not tabs_container:
		return
		
	# Clear existing children if any
	for child in tabs_container.get_children():
		child.queue_free()
		
	# Create buttons for each category dynamically
	for cat_id in categories_map.keys():
		var btn = Button.new()
		btn.text = categories_map[cat_id]
		btn.custom_minimum_size = Vector2(130, 40)
		btn.size_flags_vertical = Control.SIZE_SHRINK_CENTER
		btn.flat = true
		btn.name = "Tab_" + cat_id
		
		# Stylize tab button base
		btn.add_theme_font_size_override("font_size", 12)
		btn.add_theme_color_override("font_color", Color(0.6, 0.65, 0.7, 1.0))
		btn.add_theme_color_override("font_focus_color", Color(1.0, 0.85, 0.55, 1.0))
		btn.add_theme_color_override("font_hover_color", Color(0.9, 0.95, 1.0, 1.0))
		btn.add_theme_color_override("font_pressed_color", Color(1.0, 0.85, 0.55, 1.0))
		
		# Store metadata
		btn.set_meta("category_id", cat_id)
		
		# Connect clicked signal
		btn.pressed.connect(func(): select_category(cat_id))
		
		# Add unread notification badge container to the button
		var badge_parent = Control.new()
		badge_parent.name = "BadgeAnchor"
		badge_parent.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		badge_parent.set_anchors_and_offsets_preset(Control.PRESET_TOP_RIGHT)
		btn.add_child(badge_parent)
		
		tabs_container.add_child(btn)
		
	# Highlight first active
	select_category(active_category, false)

func select_category(category_id: String, emit: bool = true) -> void:
	active_category = category_id
	
	if not tabs_container:
		return
		
	for btn in tabs_container.get_children():
		if btn is Button:
			var cat_id = btn.get_meta("category_id") as String
			if cat_id == category_id:
				btn.add_theme_color_override("font_color", Color(1.0, 0.85, 0.55, 1.0))
				_add_selected_styling(btn)
				
				# Smoothly scroll tab button into view inside the ScrollContainer
				_scroll_to_button(btn)
			else:
				btn.add_theme_color_override("font_color", Color(0.6, 0.65, 0.7, 1.0))
				_remove_selected_styling(btn)
				
	if emit:
		category_selected.emit(category_id)

func _scroll_to_button(btn: Button) -> void:
	var target_x = btn.position.x - (size.x / 2.0) + (btn.size.x / 2.0)
	var tween = create_tween()
	tween.tween_property(self, "scroll_horizontal", clamp(target_x, 0, get_v_scroll_bar().max_value), 0.25)\
		.set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)

func _add_selected_styling(btn: Button) -> void:
	var sb = StyleBoxFlat.new()
	sb.bg_color = Color(0.12, 0.15, 0.22, 1.0)
	sb.border_width_bottom = 2
	sb.border_color = Color(1.0, 0.85, 0.55, 1.0)
	sb.corner_radius_top_left = 6
	sb.corner_radius_top_right = 6
	btn.add_theme_stylebox_override("normal", sb)

func _remove_selected_styling(btn: Button) -> void:
	var sb_empty = StyleBoxEmpty.new()
	btn.add_theme_stylebox_override("normal", sb_empty)

func _update_badges() -> void:
	if not tabs_container or not QuestManager:
		return
		
	for btn in tabs_container.get_children():
		if btn is Button:
			var cat_id = btn.get_meta("category_id") as String
			var badge_anchor = btn.get_node_or_null("BadgeAnchor")
			if badge_anchor:
				# Check uncompleted but completed unclaimed quests count
				var count = QuestManager.get_unread_completed_quests_count(cat_id)
				
				# Clear old badges
				for child in badge_anchor.get_children():
					child.queue_free()
					
				if count > 0:
					var badge_scene = load("res://scenes/quests/QuestNotificationBadge.tscn")
					if badge_scene:
						var badge = badge_scene.instantiate()
						badge.scale = Vector2(0.8, 0.8)
						# Align offset
						badge.position = Vector2(-22, 4)
						badge_anchor.add_child(badge)
						if badge.has_node("CountLabel"):
							badge.get_node("CountLabel").text = str(count)
