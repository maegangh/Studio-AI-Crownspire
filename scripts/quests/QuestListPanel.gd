extends ScrollContainer
class_name QuestListPanel

# ==========================================
# CROWNSPIRE QUEST SCROLL LIST PANEL
# ==========================================

signal quest_selected_in_list(quest_id: String)
signal quest_action_triggered(quest_id: String, action_label: String)

@onready var cards_container: VBoxContainer = %CardsContainer if has_node("%CardsContainer") else get_node_or_null("VBoxContainer")

const CARD_SCENE_PATH = "res://scenes/quests/QuestCard.tscn"

# Stagger animate configurations
@export var animate_entrance: bool = true
@export var stagger_delay: float = 0.05
@export var entrance_slide_offset: float = 40.0

var active_category: String = "main"
var active_filter: String = "all"
var search_query: String = ""
var sort_mode: String = "default"

func _ready() -> void:
	# Connect to QuestManager updates so the list refreshes automatically when states change
	if QuestManager:
		QuestManager.quest_list_updated.connect(refresh_list)

func filter_and_render(category_id: String, filter_type: String, search: String, sort: String) -> void:
	active_category = category_id
	active_filter = filter_type
	search_query = search
	sort_mode = sort
	refresh_list()

func refresh_list() -> void:
	if not cards_container:
		return
		
	# Clear previous cards
	for child in cards_container.get_children():
		child.queue_free()
		
	if not QuestManager:
		return
		
	# Fetch filtered list of quests from Manager query engine
	var quests = QuestManager.get_filtered_quests(active_category, active_filter, search_query, sort_mode)
	
	# Show empty state in screen controller if no quests match
	var screen = _get_parent_screen()
	if screen and screen.has_node("%QuestEmptyState"):
		screen.get_node("%QuestEmptyState").visible = quests.is_empty()
		
	# Instantiate cards
	var card_scene = load(CARD_SCENE_PATH) as PackedScene
	if not card_scene:
		push_error("[Crownspire QuestListPanel] QuestCard.tscn could not be loaded!")
		return
		
	var idx = 0
	for q_data in quests:
		var card = card_scene.instantiate() as QuestCard
		cards_container.add_child(card)
		card.populate_card(q_data)
		
		# Connect card signals
		card.quest_selected.connect(_on_quest_selected)
		card.quest_action_pressed.connect(_on_quest_action)
		
		# Stagger entrance animations
		if animate_entrance:
			card.modulate.a = 0.0
			card.position.y += entrance_slide_offset
			
			var tween = create_tween().set_parallel(true)
			tween.tween_property(card, "modulate:a", 1.0, 0.35)\
				.set_delay(idx * stagger_delay)\
				.set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)
			tween.tween_property(card, "position:y", card.position.y - entrance_slide_offset, 0.35)\
				.set_delay(idx * stagger_delay)\
				.set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)
				
		idx += 1

func _on_quest_selected(quest_id: String) -> void:
	quest_selected_in_list.emit(quest_id)

func _on_quest_action(quest_id: String, action_label: String) -> void:
	quest_action_triggered.emit(quest_id, action_label)

func _get_parent_screen() -> Node:
	var p = get_parent()
	while p != null:
		if p.name == "QuestScreen" or p.has_node("%QuestEmptyState"):
			return p
		p = p.get_parent()
	return null
