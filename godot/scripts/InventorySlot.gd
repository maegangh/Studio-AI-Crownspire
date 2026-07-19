extends Button
class_name InventorySlot

# ==========================================
# CROWNSPIRE INVENTORY SLOT CONTROLLER
# ==========================================
# Represents a single item in the grid, displaying its rarity, stack size, and markers.

signal slot_selected(item_id: String)

@onready var icon_label: Label = $IconLabel
@onready var qty_label: Label = $QtyLabel
@onready var fav_marker: Label = $FavMarker
@onready var lock_marker: Label = $LockMarker
@onready var rarity_frame: ItemRarityFrame = $ItemRarityFrame
@onready var badge_anchor: Control = $BadgeAnchor

var item_id := ""
var quantity := 0
var is_new := false
var is_favorite := false
var is_locked := false

func setup_slot(p_item_id: String, p_qty: int, p_is_new: bool, p_is_fav: bool, p_is_locked: bool) -> void:
	item_id = p_item_id
	quantity = p_qty
	is_new = p_is_new
	is_favorite = p_is_fav
	is_locked = p_is_locked
	
	var item_def = UIManager.get_item_definition(item_id)
	if item_def.is_empty():
		return
	
	# Icon Representation (Fallback to Emoji for beautiful cross-platform display)
	icon_label.text = item_def.get("icon_emoji", "📦")
	
	# Quantity formatting
	if quantity > 1:
		qty_label.text = "x" + str(quantity)
		qty_label.show()
	else:
		qty_label.hide()
		
	# Markers
	fav_marker.visible = is_favorite
	lock_marker.visible = is_locked
	
	# Rarity styling
	var rarity = int(item_def.get("rarity", 1))
	rarity_frame.set_rarity(rarity)
	
	# Badge handling (new item notification)
	for child in badge_anchor.get_children():
		child.queue_free()
	if is_new:
		var badge_scene = load("res://scenes/ItemNotificationBadge.tscn")
		if badge_scene:
			var badge = badge_scene.instantiate()
			badge_anchor.add_child(badge)

func _pressed() -> void:
	# Unmark "new" when clicked
	if is_new:
		is_new = false
		for child in badge_anchor.get_children():
			child.queue_free()
		# Update state inside global inventory
		for entry in UIManager.player_inventory:
			if entry["item_id"] == item_id:
				entry["is_new"] = false
				break
	
	slot_selected.emit(item_id)
	play_click_effect()

func set_selected_visual(selected: bool) -> void:
	var style: StyleBoxFlat = get_theme_stylebox("normal").duplicate() as StyleBoxFlat
	if style:
		style.bg_color = Color(0.18, 0.24, 0.35, 0.6) if selected else Color(0.1, 0.12, 0.18, 0.0)
		add_theme_stylebox_override("normal", style)

func play_click_effect() -> void:
	var tween = create_tween()
	tween.tween_property(self, "scale", Vector2(0.95, 0.95), 0.05)
	tween.tween_property(self, "scale", Vector2(1.0, 1.0), 0.05)
