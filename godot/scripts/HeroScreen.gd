extends PanelContainer

# ==========================================
# CROWNSPIRE HERO SCREEN CONTROLLER
# ==========================================
# Orchestrates the primary view, connecting list panels with dynamic tabs
# and modal action feedback.

@onready var close_btn: Button = %CloseBtn
@onready var list_panel: Control = %HeroListPanel
@onready var detail_panel: Control = %HeroDetailPanel

var selected_hero_id: String = ""

func _ready() -> void:
	close_btn.pressed.connect(_on_close_pressed)
	
	# Connect list actions to detail triggers
	list_panel.hero_card_clicked.connect(_on_hero_selected)
	detail_panel.hero_state_changed.connect(_on_hero_state_changed)
	
	# Initialize list with first hero unlocked
	var all_heroes = UIManager.get_heroes()
	if all_heroes.size() > 0:
		# Prefer first unlocked hero
		var init_id = all_heroes[0]["id"]
		for h in all_heroes:
			if h.get("unlocked", false):
				init_id = h["id"]
				break
		selected_hero_id = init_id
		
	# Initial loading
	list_panel.load_heroes_list(selected_hero_id)
	detail_panel.load_hero_details(selected_hero_id)
	
	# Custom entrance slide in
	modulate.a = 0.0
	position.y += 40
	var tween = create_tween()
	tween.set_parallel(true)
	tween.tween_property(self, "modulate:a", 1.0, 0.3)
	tween.tween_property(self, "position:y", position.y - 40, 0.3).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)

func _on_hero_selected(hero_id: String) -> void:
	selected_hero_id = hero_id
	detail_panel.load_hero_details(selected_hero_id)

func _on_hero_state_changed() -> void:
	# Keep list items updated with latest power / elixirs levels / favorites
	list_panel.load_heroes_list(selected_hero_id)

func _on_close_pressed() -> void:
	var tween = create_tween()
	tween.set_parallel(true)
	tween.tween_property(self, "modulate:a", 0.0, 0.25)
	tween.tween_property(self, "position:y", position.y + 40, 0.25)
	tween.chain().perform(func(): UIManager.close_popup(self))
