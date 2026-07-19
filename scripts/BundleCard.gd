extends PanelContainer

# ==========================================
# CROWNSPIRE PREMIUM BUNDLE CARD CONTROLLER
# ==========================================
# Highlights multi-item packages featuring value percentage badges (e.g. 1200% Value).
# Populates bundle items dynamically into a horizontal ribbon.

signal bundle_pressed(bundle_data: Dictionary)

@onready var title_label: Label = %BundleTitle
@onready var tagline_label: Label = %BundleTagline
@onready var multiplier_label: Label = %MultiplierLabel
@onready var buy_button: Button = %BuyButton
@onready var bg_texture: TextureRect = %BgTexture
@onready var items_container: HBoxContainer = %ItemsContainer

# Reuses the RewardSlot node for modular item displays
@export var item_slot_scene: PackedScene = preload("res://scenes/RewardSlot.tscn")

var bundle_data: Dictionary = {}

func _ready() -> void:
	buy_button.pressed.connect(_on_buy_pressed)

func init_bundle(data: Dictionary) -> void:
	bundle_data = data
	
	title_label.text = data.get("name", "Royal Gift Bundle")
	tagline_label.text = data.get("tag_line", "")
	multiplier_label.text = data.get("value_multiplier", "800% VALUE").to_upper()
	
	# Try loading background art if exists
	var bg_path = data.get("background_art", "")
	if not bg_path.is_empty() and ResourceLoader.exists(bg_path):
		bg_texture.texture = load(bg_path)
		
	# Populate items horizontal grid
	for child in items_container.get_children():
		child.queue_free()
		
	var items_list = data.get("items", [])
	for item in items_list:
		var slot = item_slot_scene.instantiate()
		items_container.add_child(slot)
		slot.setup_reward(
			item.get("name", ""),
			item.get("quantity", 1),
			item.get("rarity", 1),
			item.get("icon", "")
		)
		
	# Set price display
	var cost_usd = data.get("cost_usd", 4.99)
	buy_button.text = "ACQUIRE $%.2f" % cost_usd

func _on_buy_pressed() -> void:
	bundle_pressed.emit(bundle_data)
