extends PanelContainer
class_name ItemDetailPanel

# ==========================================
# CROWNSPIRE ITEM DETAIL PANEL CONTROLLER
# ==========================================
# Illustrates active items, details alchemical parameters, and binds action buttons.

signal use_pressed(item_id: String)
signal use_multiple_pressed(item_id: String)

@onready var icon_label: Label = $Margin/VBox/HeaderHBox/IconContainer/LargeIcon
@onready var icon_panel: PanelContainer = $Margin/VBox/HeaderHBox/IconContainer
@onready var name_label: Label = $Margin/VBox/HeaderHBox/TitleVBox/ItemName
@onready var r_frame: ItemRarityFrame = $Margin/VBox/HeaderHBox/IconContainer/ItemRarityFrame

@onready var category_label: Label = $Margin/VBox/HeaderHBox/TitleVBox/CategoryText
@onready var qty_label: Label = $Margin/VBox/StatsVBox/QtyBox/QtyValue
@onready var desc_label: Label = $Margin/VBox/DescriptionText

@onready var btn_use_one: Button = %BtnUseOne
@onready var btn_use_multi: Button = %BtnUseMulti
@onready var btn_fav: Button = %BtnFav
@onready var btn_lock: Button = %BtnLock
@onready var btn_sell: Button = %BtnSell

var current_item_id := ""

func _ready() -> void:
	btn_use_one.pressed.connect(_on_use_one_pressed)
	btn_use_multi.pressed.connect(_on_use_multi_pressed)
	btn_fav.pressed.connect(_on_fav_toggle)
	btn_lock.pressed.connect(_on_lock_toggle)
	btn_sell.pressed.connect(_on_sell_pressed)
	
	clear_panel()

func clear_panel() -> void:
	current_item_id = ""
	visible = false

func display_item(item_id: String) -> void:
	if item_id == "":
		clear_panel()
		return
	
	current_item_id = item_id
	visible = true
	
	var item_def = UIManager.get_item_definition(item_id)
	if item_def.is_empty():
		return
	
	# Transition fade-in effect
	modulate.a = 0.3
	var tween = create_tween()
	tween.tween_property(self, "modulate:a", 1.0, 0.15)
	
	# Icon & Name Setup
	icon_label.text = item_def.get("icon_emoji", "📦")
	name_label.text = item_def.get("name", "Unknown Item")
	
	var category_id = item_def.get("category_id", "General")
	category_label.text = category_id.replace("_", " ").capitalize()
	
	# Description
	desc_label.text = item_def.get("description", "")
	
	# Quantity Owned
	var quantity = UIManager.get_item_quantity(item_id)
	qty_label.text = str(quantity)
	
	# Rarity
	var rarity = int(item_def.get("rarity", 1))
	r_frame.set_rarity(rarity)
	
	# Stylize title text color based on rarity
	var colors = [
		Color(0.85, 0.88, 0.92), # Common (Silver/Grey)
		Color(0.2, 0.9, 0.4),    # Uncommon (Emerald)
		Color(0.2, 0.6, 1.0),    # Rare (Sapphire)
		Color(0.75, 0.35, 1.0),  # Epic (Amethyst)
		Color(1.0, 0.84, 0.0)    # Legendary (Royal Amber)
	]
	name_label.add_theme_color_override("font_color", colors[clampi(rarity - 1, 0, 4)])
	
	# Actions usability configuration
	var can_use = item_def.get("can_use", false)
	btn_use_one.disabled = not can_use or quantity <= 0
	btn_use_multi.disabled = not can_use or quantity <= 1
	
	# Favorite and Lock statuses
	_update_markers_visuals()

func _update_markers_visuals() -> void:
	# Find item in player inventory list to extract status
	var is_fav := false
	var is_locked := false
	for entry in UIManager.player_inventory:
		if entry["item_id"] == current_item_id:
			is_fav = entry.get("is_favorite", false)
			is_locked = entry.get("is_locked", false)
			break
			
	btn_fav.text = "⭐ Unfavorite" if is_fav else "⭐ Favorite"
	btn_lock.text = "🔓 Unlock" if is_locked else "🔒 Lock"

func _on_use_one_pressed() -> void:
	if current_item_id != "":
		use_pressed.emit(current_item_id)

func _on_use_multi_pressed() -> void:
	if current_item_id != "":
		use_multiple_pressed.emit(current_item_id)

func _on_fav_toggle() -> void:
	for entry in UIManager.player_inventory:
		if entry["item_id"] == current_item_id:
			entry["is_favorite"] = not entry.get("is_favorite", false)
			break
	UIManager.inventory_updated.emit()
	UIManager.save_player_state()
	_update_markers_visuals()

func _on_lock_toggle() -> void:
	for entry in UIManager.player_inventory:
		if entry["item_id"] == current_item_id:
			entry["is_locked"] = not entry.get("is_locked", false)
			break
	UIManager.inventory_updated.emit()
	UIManager.save_player_state()
	_update_markers_visuals()

func _on_sell_pressed() -> void:
	# Sell future support placeholder
	print("[Crownspire Inventory] Sell feature triggered for item: ", current_item_id)
