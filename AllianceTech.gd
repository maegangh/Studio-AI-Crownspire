# ==============================================================================
# Crownspire MMO Strategy Game - Alliance Technology & Donation System
# Godot 4 / GDScript 2.0 Client-side persistent research panel
# ==============================================================================

extends Control

# --- Signals ---
signal tech_updated
signal add_log_requested(text, type)

# --- Onready Nodes ---
@onready var tech_list_container: VBoxContainer = $Layout/Split/LeftSection/Scroll/List
@onready var detail_panel: PanelContainer = $Layout/Split/RightSection/DetailPanel
@onready var selected_tech_name: Label = $Layout/Split/RightSection/DetailPanel/Margin/VBox/Header/NameLabel
@onready var selected_tech_desc: Label = $Layout/Split/RightSection/DetailPanel/Margin/VBox/Header/DescLabel
@onready var tech_level_lbl: Label = $Layout/Split/RightSection/DetailPanel/Margin/VBox/Header/LevelLabel
@onready var progress_bar: ProgressBar = $Layout/Split/RightSection/DetailPanel/Margin/VBox/ProgressBox/Bar
@onready var progress_lbl: Label = $Layout/Split/RightSection/DetailPanel/Margin/VBox/ProgressBox/Label
@onready var active_buffs_lbl: Label = $Layout/Split/RightSection/DetailPanel/Margin/VBox/BuffsBox/Label

# --- Donation Station Buttons ---
@onready var donate_wood_btn: Button = $Layout/Split/RightSection/DetailPanel/Margin/VBox/DonateBox/Grid/DonateWood
@onready var donate_food_btn: Button = $Layout/Split/RightSection/DetailPanel/Margin/VBox/DonateBox/Grid/DonateFood
@onready var donate_stone_btn: Button = $Layout/Split/RightSection/DetailPanel/Margin/VBox/DonateBox/Grid/DonateStone
@onready var donate_iron_btn: Button = $Layout/Split/RightSection/DetailPanel/Margin/VBox/DonateBox/Grid/DonateIron
@onready var donate_gems_btn: Button = $Layout/Split/RightSection/DetailPanel/Margin/VBox/DonateBox/Grid/DonateGems

# --- Currency Top Bar ---
@onready var honor_pts_lbl: Label = $Layout/Header/HBox/HonorPointsLabel
@onready var guild_treasury_lbl: Label = $Layout/Header/HBox/TreasuryLabel

# --- Persistent State Config ---
const BAG_SAVE_PATH = "user://crownspire_bag_inventory_v1.save"

# --- Internal references ---
var _alliance_scene: Control
var _state: Dictionary = {}
var _selected_tech_id: String = ""
var _tech_database: Array = []

func _ready() -> void:
	var parent = get_parent()
	while parent and not parent.has_method("_save_alliance_state"):
		parent = parent.get_parent()
	if parent:
		_alliance_scene = parent
		
	# Connect donation buttons
	donate_wood_btn.pressed.connect(func(): _on_donate_pressed("wood"))
	donate_food_btn.pressed.connect(func(): _on_donate_pressed("food"))
	donate_stone_btn.pressed.connect(func(): _on_donate_pressed("stone"))
	donate_iron_btn.pressed.connect(func(): _on_donate_pressed("iron"))
	donate_gems_btn.pressed.connect(func(): _on_donate_pressed("gems"))

func init_view(state: Dictionary, tech_db: Array) -> void:
	_state = state
	_tech_database = tech_db
	
	if _selected_tech_id.is_empty() and not _tech_database.is_empty():
		_selected_tech_id = _tech_database[0].get("id")
		
	_refresh_tech_ui()

func _refresh_tech_ui() -> void:
	_update_currency_bar()
	_render_tech_list()
	_render_selected_tech_details()

func _update_currency_bar() -> void:
	var honor_points = _state.get("player_honor_points", 0)
	var treasury_points = _state.get("alliance_treasury", 0)
	honor_pts_lbl.text = "Personal Honor: 🏅 %d" % honor_points
	guild_treasury_lbl.text = "Guild Treasury: 🪙 %s" % _format_num(treasury_points)

func _render_tech_list() -> void:
	_clear_container(tech_list_container)
	
	for tech in _tech_database:
		var tech_id = tech.get("id")
		var current_lvl = _get_tech_level(tech_id)
		var max_lvl = tech.get("maxLevel", 5)
		
		var item_btn = Button.new()
		item_btn.custom_minimum_size = Vector2(0, 55)
		item_btn.text = "  %s  (Lvl %d/%d)\n  Category: %s" % [tech.get("name"), current_lvl, max_lvl, tech.get("category")]
		item_btn.alignment = HORIZONTAL_ALIGNMENT_LEFT
		
		# Set different style if selected
		var style = StyleBoxFlat.new()
		if tech_id == _selected_tech_id:
			style.bg_color = Color(0.12, 0.22, 0.35, 1)
			style.border_width_left = 3
			style.border_color = Color(0.95, 0.75, 0.15, 1)
		else:
			style.bg_color = Color(0.098, 0.117, 0.149, 1)
			style.border_width_left = 1
			style.border_color = Color(0.18, 0.22, 0.28, 1)
			
		style.corner_radius_top_left = 4
		style.corner_radius_top_right = 4
		style.corner_radius_bottom_right = 4
		style.corner_radius_bottom_left = 4
		
		item_btn.add_theme_stylebox_override("normal", style)
		item_btn.add_theme_stylebox_override("hover", style)
		item_btn.add_theme_stylebox_override("pressed", style)
		item_btn.pressed.connect(func(): _on_tech_selected(tech_id))
		
		tech_list_container.add_child(item_btn)

func _render_selected_tech_details() -> void:
	var tech = _get_tech_by_id(_selected_tech_id)
	if tech.is_empty():
		detail_panel.visible = false
		return
		
	detail_panel.visible = true
	selected_tech_name.text = tech.get("name")
	selected_tech_desc.text = tech.get("description")
	
	var current_lvl = _get_tech_level(_selected_tech_id)
	var max_lvl = tech.get("maxLevel", 5)
	
	tech_level_lbl.text = "Rank Level: %d / %d" % [current_lvl, max_lvl]
	
	# Handle progress bar
	if current_lvl >= max_lvl:
		progress_bar.max_value = 1.0
		progress_bar.value = 1.0
		progress_lbl.text = "MAX LEVEL REACHED"
		active_buffs_lbl.text = "Permanent Buffs unlocked:\n" + _get_applied_buff_description(tech, current_lvl)
		_set_donation_buttons_disabled(true)
	else:
		var current_progress = _get_tech_progress(_selected_tech_id)
		var levels_meta = tech.get("levels", [])
		var target_points = 1000
		if current_lvl < levels_meta.size():
			var lvl_info = levels_meta[current_lvl]
			target_points = lvl_info.get("costs", {}).get("pointsRequired", 1000)
			
		progress_bar.max_value = float(target_points)
		progress_bar.value = float(current_progress)
		progress_lbl.text = "%d / %d Points to Level Up" % [current_progress, target_points]
		
		var buff_desc = "Current Active Buffs:\n"
		if current_lvl > 0:
			buff_desc += _get_applied_buff_description(tech, current_lvl)
		else:
			buff_desc += "No buffs unlocked yet."
			
		buff_desc += "\n\nNext Rank Upgrade Grants:\n" + _get_level_buff_description(tech, current_lvl + 1)
		active_buffs_lbl.text = buff_desc
		_set_donation_buttons_disabled(false)

func _get_applied_buff_description(tech: Dictionary, lvl: int) -> String:
	var levels_meta = tech.get("levels", [])
	var desc = ""
	for i in range(lvl):
		if i < levels_meta.size():
			var effects = levels_meta[i].get("effects", [])
			for eff in effects:
				desc += "- " + str(eff) + "\n"
	return desc

func _get_level_buff_description(tech: Dictionary, lvl: int) -> String:
	var levels_meta = tech.get("levels", [])
	var index = lvl - 1
	if index >= 0 and index < levels_meta.size():
		var effects = levels_meta[index].get("effects", [])
		var desc = ""
		for eff in effects:
			desc += "⚡ " + str(eff) + "\n"
		return desc
	return "No further buffs"

func _set_donation_buttons_disabled(disabled: bool) -> void:
	donate_wood_btn.disabled = disabled
	donate_food_btn.disabled = disabled
	donate_stone_btn.disabled = disabled
	donate_iron_btn.disabled = disabled
	donate_gems_btn.disabled = disabled

# ==============================================================================
# ACTIONS & LOGIC
# ==============================================================================

func _on_tech_selected(tech_id: String) -> void:
	_selected_tech_id = tech_id
	_refresh_tech_ui()

func _on_donate_pressed(res_type: String) -> void:
	var inventory = _load_inventory()
	
	# Define costs and awards
	var cost_key = ""
	var cost_qty = 0
	var points_granted = 0
	var honor_granted = 0
	var treasury_granted = 0
	
	match res_type:
		"wood":
			cost_key = "resource_wood_100k"
			cost_qty = 1
			points_granted = 100
			honor_granted = 50
			treasury_granted = 200
		"food":
			cost_key = "resource_food_100k"
			cost_qty = 1
			points_granted = 100
			honor_granted = 50
			treasury_granted = 200
		"stone":
			cost_key = "resource_stone_50k"
			cost_qty = 1
			points_granted = 150
			honor_granted = 75
			treasury_granted = 350
		"iron":
			cost_key = "resource_iron_25k"
			cost_qty = 1
			points_granted = 200
			honor_granted = 100
			treasury_granted = 500
		"gems":
			cost_key = "resource_diamond_1000"
			cost_qty = 1
			points_granted = 500
			honor_granted = 250
			treasury_granted = 1500
			
	var current_qty = inventory.get(cost_key, 0)
	if current_qty < cost_qty:
		add_log_requested.emit("Insufficient cargo in your personal inventory bags! Cannot complete donation. Open packs in Bag first.", "warning")
		return
		
	# Deduct from personal inventory
	inventory[cost_key] = current_qty - cost_qty
	_save_inventory(inventory)
	
	# Credit Player and Alliance Points
	_state["player_honor_points"] = _state.get("player_honor_points", 0) + honor_granted
	_state["alliance_treasury"] = _state.get("alliance_treasury", 0) + treasury_granted
	
	# Apply points to Technology
	var tech_progress = _get_tech_progress_dict()
	var current_pts = tech_progress.get(_selected_tech_id, 0)
	var current_lvl = _get_tech_level(_selected_tech_id)
	
	var tech_meta = _get_tech_by_id(_selected_tech_id)
	var levels_meta = tech_meta.get("levels", [])
	var target_points = 1000
	if current_lvl < levels_meta.size():
		target_points = levels_meta[current_lvl].get("costs", {}).get("pointsRequired", 1000)
		
	var new_pts = current_pts + points_granted
	
	if new_pts >= target_points:
		# Level Up!
		var tech_levels = _get_tech_levels_dict()
		var new_lvl = clamp(current_lvl + 1, 0, tech_meta.get("maxLevel", 5))
		tech_levels[_selected_tech_id] = new_lvl
		tech_progress[_selected_tech_id] = 0 # reset excess points or clamp
		
		add_log_requested.emit("⭐ Dynamic Guild Event! Alliance Research [%s] advanced to Level %d! Active buffs upgraded." % [tech_meta.get("name"), new_lvl], "success")
	else:
		tech_progress[_selected_tech_id] = new_pts
		add_log_requested.emit("Donated materials! Contributed +%d points to research, earned 🏅%d Honor." % [points_granted, honor_granted], "success")
		
	_save_and_sync()
	_refresh_tech_ui()

# ==============================================================================
# DATABASE RETRIEVALS & STORAGE HELPERS
# ==============================================================================

func _get_tech_by_id(tech_id: String) -> Dictionary:
	for t in _tech_database:
		if t.get("id") == tech_id:
			return t
	return {}

func _get_tech_levels_dict() -> Dictionary:
	if not _state.has("tech_levels"):
		_state["tech_levels"] = {}
	return _state["tech_levels"]

func _get_tech_progress_dict() -> Dictionary:
	if not _state.has("tech_progress"):
		_state["tech_progress"] = {}
	return _state["tech_progress"]

func _get_tech_level(tech_id: String) -> int:
	var lvls = _get_tech_levels_dict()
	# Check if research exists in JSON default setup
	return lvls.get(tech_id, 1)

func _get_tech_progress(tech_id: String) -> int:
	var progress = _get_tech_progress_dict()
	return progress.get(tech_id, 0)

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
	tech_updated.emit()

func _format_num(num: int) -> String:
	if num >= 1000000:
		return "%.1fM" % (num / 1000000.0)
	elif num >= 1000:
		return "%.1fk" % (num / 1000.0)
	return str(num)
