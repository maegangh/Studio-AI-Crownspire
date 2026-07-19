extends PanelContainer

# ==========================================
# CROWNSPIRE MAIN FEATURED CAROUSEL BANNER
# ==========================================
# Animated banner sitting at the top of the store, displaying seasonal promos.
# Cycles through featured bundles automatically.

@onready var title_label: Label = %BannerTitle
@onready var desc_label: Label = %BannerDesc
@onready var badge_label: Label = %BadgeLabel
@onready var cta_button: Button = %CTAButton
@onready var dot_container: HBoxContainer = %DotContainer
@onready var anim_player: AnimationPlayer = $AnimationPlayer

var featured_items: Array = []
var current_slide_index: int = 0
var slide_timer: float = 0.0
@export var auto_slide_time: float = 5.0

func _ready() -> void:
	cta_button.pressed.connect(_on_cta_pressed)
	_load_featured_data()

func _process(delta: float) -> void:
	if featured_items.size() > 1:
		slide_timer += delta
		if slide_timer >= auto_slide_time:
			slide_timer = 0.0
			_next_slide()

func _load_featured_data() -> void:
	# Pull only featured active items from global bundles list
	var all_bundles = UIManager.get_all_bundles()
	featured_items.clear()
	for b in all_bundles:
		if b.get("is_featured", false):
			featured_items.append(b)
			
	if featured_items.is_empty():
		visible = false
		return
		
	visible = true
	_setup_dots()
	_display_slide(0)

func _setup_dots() -> void:
	for child in dot_container.get_children():
		child.queue_free()
		
	for i in featured_items.size():
		var dot = ColorRect.new()
		dot.custom_minimum_size = Vector2(8, 8)
		dot.color = Color(0.35, 0.43, 0.53) # Inactive gray
		dot_container.add_child(dot)

func _display_slide(index: int) -> void:
	if index < 0 or index >= featured_items.size():
		return
		
	current_slide_index = index
	var bundle = featured_items[index]
	
	title_label.text = bundle.get("name", "").to_upper()
	desc_label.text = bundle.get("tag_line", "")
	badge_label.text = bundle.get("badge_text", "HOT OFFER").to_upper()
	cta_button.text = "VIEW OFFER ($%.2f)" % bundle.get("cost_usd", 0.99)
	
	# Update dots visual
	for i in dot_container.get_child_count():
		var dot = dot_container.get_child(i) as ColorRect
		if i == current_slide_index:
			dot.color = Color(1.0, 0.84, 0.0) # Active Gold
		else:
			dot.color = Color(0.35, 0.43, 0.53) # Inactive Slate
			
	# Play transition animation
	if anim_player and anim_player.has_animation("slide_transition"):
		anim_player.play("slide_transition")

func _next_slide() -> void:
	var next_idx = (current_slide_index + 1) % featured_items.size()
	_display_slide(next_idx)

func _on_cta_pressed() -> void:
	if featured_items.is_empty():
		return
		
	var active_bundle = featured_items[current_slide_index]
	
	# Instantiate purchase popup for the bundle
	var popup_scene = preload("res://scenes/PurchasePopup.tscn")
	var popup = UIManager.open_popup(popup_scene)
	if popup:
		popup.init_popup(
			active_bundle["id"],
			active_bundle["name"],
			active_bundle["tag_line"],
			"", # No single icon path for bundle card
			"usd",
			active_bundle["cost_usd"],
			active_bundle.get("rarity", 4)
		)
