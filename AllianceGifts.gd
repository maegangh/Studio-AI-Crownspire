# ==============================================================================
# Crownspire MMO Strategy Game - Alliance Gifts Controller
# Godot 4 / GDScript 2.0 Client-side loot claim station
# ==============================================================================

extends Control

# --- Signals ---
signal gifts_updated
signal add_log_requested(text, type)

# --- Onready Nodes ---
@onready var gift_list: VBoxContainer = $Layout/Scroll/List
@onready var claim_all_btn: Button = $Layout/Header/HBox/ClaimAllBtn
@onready var sim_boss_btn: Button = $Layout/Header/HBox/SimBossBtn

# --- Persistent Config Save Location ---
const BAG_SAVE_PATH = "user://crownspire_bag_inventory_v1.save"

# --- Internal references ---
var _alliance_scene: Control
var _state: Dictionary = {}

func _ready() -> void:
	var parent = get_parent()
	while parent and not parent.has_method("_save_alliance_state"):
		parent = parent.get_parent()
	if parent:
		_alliance_scene = parent
		
	claim_all_btn.pressed.connect(_on_claim_all_pressed)
	sim_boss_btn.pressed.connect(_on_sim_boss_pressed)

func init_view(state: Dictionary) -> void:
	_state = state
	_refresh_gifts_ui()

func _refresh_gifts_ui() -> void:
	_clear_container(gift_list)
	
	var gifts = _state.get("gifts", [])
	if gifts.is_empty():
		claim_all_btn.disabled = true
		
		var center = CenterContainer.new()
		center.size_flags_vertical = Control.SIZE_EXPAND_FILL
		gift_list.add_child(center)
		
		var empty_lbl = Label.new()
		empty_lbl.text = "Your Alliance Gift vaults are current empty. Rally raids against World Bosses to secure loot!"
		empty_lbl.add_theme_color_override("font_color", Color(0.4, 0.45, 0.5, 1))
		center.add_child(empty_lbl)
	else:
		claim_all_btn.disabled = false
		for i in range(gifts.size()):
			var gift = gifts[i]
			var card = _create_gift_card(gift, i)
			gift_list.add_child(card)

func _create_gift_card(gift: Dictionary, index: int) -> PanelContainer:
	var card = PanelContainer.new()
	card.custom_minimum_size = Vector2(0, 70)
	
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.098, 0.117, 0.149, 1)
	style.border_width_left = 3
	
	var rarity = gift.get("rarity", "common")
	match rarity:
		"legendary": style.border_color = Color(0.95, 0.75, 0.15, 1) # Gold
		"epic": style.border_color = Color(0.7, 0.3, 0.9, 1) # Purple
		"rare": style.border_color = Color(0.19, 0.48, 0.82, 1) # Blue
		_: style.border_color = Color(0.5, 0.55, 0.6, 1) # Gray
		
	style.corner_radius_top_left = 6
	style.corner_radius_top_right = 6
	style.corner_radius_bottom_right = 6
	style.corner_radius_bottom_left = 6
	card.add_theme_stylebox_override("panel", style)
	
	var margin = MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 12)
	margin.add_theme_constant_override("margin_top", 8)
	margin.add_theme_constant_override("margin_right", 12)
	margin.add_theme_constant_override("margin_bottom", 8)
	card.add_child(margin)
	
	var hbox = HBoxContainer.new()
	margin.add_child(hbox)
	
	# Gift Icon representation (Left)
	var emoji_lbl = Label.new()
	emoji_lbl.add_theme_font_size_override("font_size", 24)
	emoji_lbl.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	hbox.add_child(emoji_lbl)
	
	match rarity:
		"legendary": emoji_lbl.text = "👑"
		"epic": emoji_lbl.text = "💎"
		"rare": emoji_lbl.text = "🔮"
		_: emoji_lbl.text = "📦"
		
	# Middle details column
	var vbox = VBoxContainer.new()
	vbox.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	hbox.add_child(vbox)
	
	var title_lbl = Label.new()
	title_lbl.text = gift.get("name", "Alliance Tribute")
	title_lbl.add_theme_color_override("font_color", Color(1, 1, 1, 1))
	title_lbl.add_theme_font_size_override("font_size", 13)
	vbox.add_child(title_lbl)
	
	var source_lbl = Label.new()
	source_lbl.text = "Acquired from: %s" % gift.get("source", "Guild Campaign")
	source_lbl.add_theme_color_override("font_color", Color(0.5, 0.55, 0.6, 1))
	source_lbl.add_theme_font_size_override("font_size", 11)
	vbox.add_child(source_lbl)
	
	# Action button
	var action_vbox = VBoxContainer.new()
	action_vbox.alignment = BoxContainer.ALIGNMENT_CENTER
	hbox.add_child(action_vbox)
	
	var claim_btn = Button.new()
	claim_btn.text = "Claim"
	claim_btn.custom_minimum_size = Vector2(80, 30)
	claim_btn.pressed.connect(func(): _on_claim_clicked(index))
	action_vbox.add_child(claim_btn)
	
	return card

# ==============================================================================
# ACTIONS & DISPATCHES
# ==============================================================================

func _on_claim_clicked(index: int) -> void:
	var gifts = _state.get("gifts", [])
	if index < 0 or index >= gifts.size():
		return
		
	var gift = gifts[index]
	
	# Credit contents to player inventory bag
	_apply_gift_rewards(gift)
	
	# Remove gift from queue
	gifts.remove_at(index)
	_save_and_sync()
	
	_refresh_gifts_ui()
	add_log_requested.emit("Claimed [%s]! Supplies transferred to inventory vaults." % gift.get("name"), "success")

func _on_claim_all_pressed() -> void:
	var gifts = _state.get("gifts", [])
	if gifts.is_empty():
		return
		
	var count = gifts.size()
	for gift in gifts:
		_apply_gift_rewards(gift)
		
	gifts.clear()
	_save_and_sync()
	_refresh_gifts_ui()
	add_log_requested.emit("🎁 Claim All completed! Emptied %d tribute chests. All resources credited to your inventory bag!" % count, "success")

func _on_sim_boss_pressed() -> void:
	var bosses = [
		{"name": "Ember Frost Drake", "source": "Raid Guild Campaign Victory", "rarity": "legendary", "chest": "Triumph Sovereign Chest"},
		{"name": "Wildling Overlord", "source": "Alliance Border Skirmish Defeat", "rarity": "epic", "chest": "Slayer's Bounty Chest"},
		{"name": "Volcanic Slime King", "source": "Coordinated Guild Rally Campaign", "rarity": "rare", "chest": "Conqueror's Tribute Box"},
		{"name": "Wandering Deserter Captain", "source": "Wasteland Sweep Operation", "rarity": "common", "chest": "Common Scout Pouch"}
	]
	
	var b_info = bosses[randi() % bosses.size()]
	var gifts = _state.get("gifts", [])
	
	gifts.append({
		"name": b_info.get("chest"),
		"source": b_info.get("source"),
		"rarity": b_info.get("rarity"),
		"rewards": _generate_gift_loot(b_info.get("rarity"))
	})
	
	_save_and_sync()
	_refresh_gifts_ui()
	add_log_requested.emit("🏰 Global Guild Conquest Event! Defeated %s! Tribute chest added to vaults." % b_info.get("name"), "info")

# ==============================================================================
# LOOT ENGINES
# ==============================================================================

func _generate_gift_loot(rarity: String) -> Dictionary:
	var loot = {}
	match rarity:
		"legendary":
			loot["resource_food_100k"] = 3
			loot["resource_wood_100k"] = 3
			loot["resource_stone_50k"] = 2
			loot["resource_iron_25k"] = 2
			loot["statue_hero_shard"] = 1
		"epic":
			loot["resource_food_100k"] = 2
			loot["resource_wood_100k"] = 2
			loot["resource_stone_50k"] = 1
			loot["speedup_universal_5m"] = 10
		"rare":
			loot["resource_food_100k"] = 1
			loot["resource_wood_100k"] = 1
			loot["speedup_construction_1h"] = 1
		_:
			loot["resource_food_100k"] = 1
			loot["speedup_universal_5m"] = 4
	return loot

func _apply_gift_rewards(gift: Dictionary) -> void:
	var inventory = _load_inventory()
	var rewards = gift.get("rewards", {})
	
	for key in rewards.keys():
		var qty = rewards.get(key, 0)
		inventory[key] = inventory.get(key, 0) + qty
		
	_save_inventory(inventory)

# ==============================================================================
# PERSISTENCE HELPERS
# ==============================================================================

func _load_inventory() -> Dictionary:
	if not FileAccess.file_exists(BAG_SAVE_PATH):
		return {}
	var file = FileAccess.open(BAG_SAVE_PATH, FileAccess.READ)
	if not file:
		return {}
	var content = file.get_as_text()
	file.close()
	var json = JSON.new()
	if json.parse(content) == OK:
		var data = json.get_data()
		if typeof(data) == TYPE_DICTIONARY:
			return data
	return {}

func _save_inventory(inv: Dictionary) -> void:
	var file = FileAccess.open(BAG_SAVE_PATH, FileAccess.WRITE)
	if file:
		file.store_string(JSON.stringify(inv))
		file.close()

func _clear_container(container: Node) -> void:
	for child in container.get_children():
		child.queue_free()

func _save_and_sync() -> void:
	if _alliance_scene and _alliance_scene.has_method("_save_alliance_state"):
		_alliance_scene._save_alliance_state()
	gifts_updated.emit()
