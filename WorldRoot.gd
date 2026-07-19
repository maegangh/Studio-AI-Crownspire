# ==============================================================================
# Crownspire MMO - World Root & HUD Manager Script
# Godot 4.6 / GDScript 2.0 Responsive Mobile Overlay Controller & Action Dispatcher
# ==============================================================================

extends Node2D

@export_category("System Links")
@export var kingdom_manager: KingdomManager
@export var camera: MapCamera2D

@export_group("UI Overlay Elements")
@export var detail_panel: PanelContainer
@export var panel_title: Label
@export var panel_description: Label
@export var panel_action_button: Button

# Keep track of current selected target node
var _selected_target: Node2D = null

func _ready() -> void:
	print("[WorldRoot] Scene loaded. Connecting event signals...")
	
	# Close panel on start
	if detail_panel:
		detail_panel.visible = false
		
	# Connecting signal handlers
	if kingdom_manager:
		kingdom_manager.display_resource_panel.connect(_on_display_resource_panel)
		kingdom_manager.display_wildling_panel.connect(_on_display_wildling_panel)
		kingdom_manager.display_castle_panel.connect(_on_display_castle_panel)
		kingdom_manager.display_alliance_building_panel.connect(_on_display_alliance_building_panel)
		kingdom_manager.display_objective_panel.connect(_on_display_objective_panel)
	else:
		push_error("[WorldRoot] Fatal: KingdomManager path is not linked in Inspector!")
		
	if panel_action_button:
		panel_action_button.pressed.connect(_on_action_button_pressed)

func _on_display_resource_panel(node: ResourceNode) -> void:
	_selected_target = node
	if not detail_panel:
		return
		
	panel_title.text = "🌾 " + node.resource_type.capitalize() + " Deposit"
	panel_description.text = "Level: %d\nAvailable Supply: %s\nCoordinates: (%.1f, %.1f)" % [
		node.level, 
		_format_number(node.amount),
		node.global_position.x,
		node.global_position.y
	]
	
	panel_action_button.text = "DISPATCH GATHERERS"
	_show_panel()

func _process(_delta: float) -> void:
	if detail_panel and detail_panel.visible and is_instance_valid(_selected_target) and _selected_target is WildlingNode:
		_refresh_wildling_panel(_selected_target)

func _refresh_wildling_panel(node: WildlingNode) -> void:
	panel_title.text = "⚔️ Lvl %d %s [%s]" % [node.level, node.species, node.metadata.get("rarity", "Common")]
	
	var desc = ""
	desc += "Description: %s\n" % node.metadata.get("description", "Wildling patrolling the outer bounds of the realm.")
	desc += "Combat Rating: %s CR | Weakness: %s\n" % [
		_format_number(node.power_rating),
		str(node.metadata.get("troopWeakness", "N/A")).capitalize()
	]
	desc += "Stats: ⚔️%s HP:%s 🛡️%s ⚡Speed:%s\n" % [
		_format_number(node.metadata.get("attack", 200)),
		_format_number(node.metadata.get("health", 1500)),
		_format_number(node.metadata.get("defense", 100)),
		_format_number(node.metadata.get("speed", 100))
	]
	desc += "Stamina Cost: %d stamina\n" % int(node.metadata.get("staminaCost", 10))
	
	var reward_list = []
	if node.metadata.has("rewards") and node.metadata["rewards"].has("resources"):
		var res = node.metadata["rewards"]["resources"]
		for k in res.keys():
			var val = int(res[k])
			if val > 0:
				reward_list.append("%s %s" % [_format_number(val), k.capitalize()])
				
	if node.metadata.has("rewards") and node.metadata["rewards"].get("heroExperience", 0) > 0:
		reward_list.append("+%s Hero XP" % _format_number(int(node.metadata["rewards"]["heroExperience"])))
		
	if reward_list.size() > 0:
		desc += "Defeat Rewards: %s\n" % ", ".join(reward_list)
		
	desc += "Coordinates: (%.1f, %.1f)" % [node.global_position.x, node.global_position.y]
	
	if kingdom_manager and kingdom_manager.wildling_spawner:
		var pendings = kingdom_manager.wildling_spawner.get_pending_respawns()
		if pendings.size() > 0:
			desc += "\n\n⏳ Active Respawn Queue:\n"
			for item in pendings:
				desc += "- Lvl %d %s: Respawning in %ds\n" % [
					item["level"],
					item["species"],
					clampi(int(ceil(item["time_left"])), 1, 999)
				]
		else:
			desc += "\n\n🟢 World Spawns: All zones secure."
			
	panel_description.text = desc

func _on_display_wildling_panel(node: WildlingNode) -> void:
	_selected_target = node
	if not detail_panel:
		return
		
	_refresh_wildling_panel(node)
	panel_action_button.text = "LAUNCH EXPEDITION"
	_show_panel()

func _on_display_castle_panel(node: PlayerCastleNode) -> void:
	_selected_target = node
	if not detail_panel:
		return
		
	var prefix = "🏰 Own Citadel" if node.is_player_own else "🏰 Rival Citadel"
	panel_title.text = prefix + " (" + node.player_name + ")"
	panel_description.text = "Level: %d\nAlliance: [%s]\nPower: %s\nCoordinates: (%.1f, %.1f)" % [
		node.level,
		node.alliance_tag,
		_format_number(node.power),
		node.global_position.x,
		node.global_position.y
	]
	
	if node.is_player_own:
		panel_action_button.text = "MANAGE CITADEL"
	else:
		panel_action_button.text = "LAUNCH SIEGE"
	_show_panel()

func _on_display_alliance_building_panel(node: AllianceBuildingNode) -> void:
	_selected_target = node
	if not detail_panel:
		return
		
	panel_title.text = "🛡️ " + node.building_name
	panel_description.text = "Level: %d\nAlliance: [%s]\nStatus: %s\nCoordinates: (%.1f, %.1f)" % [
		node.level,
		node.alliance_tag,
		node.status,
		node.global_position.x,
		node.global_position.y
	]
	
	panel_action_button.text = "DEFEND STRUCTURE"
	_show_panel()

func _on_display_objective_panel(node: ObjectiveNode) -> void:
	_selected_target = node
	if not detail_panel:
		return
		
	var type_emoji := "🔮"
	match node.objective_type.to_lower():
		"kingdom_capital": type_emoji = "👑"
		"beast_lair": type_emoji = "🐉"
		"watchkeep": type_emoji = "🗼"
		"temple": type_emoji = "⛪"
		
	panel_title.text = type_emoji + " " + node.objective_name
	panel_description.text = "Type: %s\nLevel: %d\nOwner Alliance: %s\nCoordinates: (%.1f, %.1f)" % [
		node.objective_type.capitalize().replace("_", " "),
		node.level,
		"[%s]" % node.owner_id if node.owner_id != "" else "Neutral",
		node.global_position.x,
		node.global_position.y
	]
	
	panel_action_button.text = "MARCH TO OBJECTIVE"
	_show_panel()

# Input tracking for empty terrain clicks (avoid dragging triggers)
var _mouse_press_pos := Vector2.ZERO
var _clicked_empty_coords := Vector2.ZERO

func _unhandled_input(event: InputEvent) -> void:
	if event is InputEventMouseButton:
		if event.button_index == MOUSE_BUTTON_LEFT:
			if event.pressed:
				_mouse_press_pos = event.position
			else:
				if _mouse_press_pos.distance_to(event.position) < 8.0:
					var click_pos = get_global_mouse_position()
					_on_empty_map_clicked(click_pos)

func _on_empty_map_clicked(click_pos: Vector2) -> void:
	_selected_target = null
	_clicked_empty_coords = click_pos
	
	if not detail_panel:
		return
		
	var is_safe = kingdom_manager.is_teleport_position_safe(click_pos)
	panel_title.text = "📍 Coordinate Target"
	
	var terrain_desc = "Grid Coordinate Selected: (%.1f, %.1f)\n\n" % [click_pos.x, click_pos.y]
	if is_safe:
		terrain_desc += "Status: 🟢 SAFE AND VACANT\nTerrain is fully secure. Safe spacing buffer validated. Ready for immediate Citadel warp relocation."
		panel_action_button.text = "TELEPORT CITY HERE"
	else:
		terrain_desc += "Status: 🔴 BLOCKED / OBSTRUCTED\nCannot warp to these coordinates. Overlap detected with rivers, mountains, objectives or another player's castle."
		panel_action_button.text = "WARP TO NEAREST SAFE SPOT"
		
	panel_description.text = terrain_desc
	_show_panel()

func _on_action_button_pressed() -> void:
	if is_instance_valid(_selected_target):
		if _selected_target is PlayerCastleNode and _selected_target.is_player_own:
			_open_citadel_management_popup()
			return
			
		print("[WorldRoot] Launching active expedition toward node: ", _selected_target.name)
		if kingdom_manager:
			kingdom_manager.dispatch_march_to_node(_selected_target)
		_hide_panel()
	elif _clicked_empty_coords != Vector2.ZERO:
		if kingdom_manager:
			# relocates and solves if blocked
			var success = kingdom_manager.relocate_castle_to(_clicked_empty_coords)
			if success:
				var actual_spot = kingdom_manager.player_castle_position
				if camera:
					camera._target_position = actual_spot
				_spawn_toast("Citadel successfully relocated to (%.1f, %.1f)!" % [actual_spot.x, actual_spot.y])
			else:
				_spawn_toast("Relocation failed: blocked terrain.")
		_clicked_empty_coords = Vector2.ZERO
		_hide_panel()
	else:
		_hide_panel()

func _open_citadel_management_popup() -> void:
	if get_node_or_null("HUD/Control/CitadelPopup"):
		return
		
	var popup = PanelContainer.new()
	popup.name = "CitadelPopup"
	$HUD/Control.add_child(popup)
	
	# Center anchor layout
	popup.anchors_preset = Control.PRESET_CENTER
	popup.grow_horizontal = Control.GROW_DIRECTION_BOTH
	popup.grow_vertical = Control.GROW_DIRECTION_BOTH
	popup.custom_minimum_size = Vector2(420, 500)
	
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.08, 0.09, 0.14, 0.98) # Dark Cosmic Blue Slate
	style.border_width_left = 2
	style.border_width_top = 2
	style.border_width_right = 2
	style.border_width_bottom = 2
	style.border_color = Color(0.14, 0.72, 0.65, 0.6) # Glowing Teal Border
	style.corner_radius_top_left = 16
	style.corner_radius_top_right = 16
	style.corner_radius_bottom_left = 16
	style.corner_radius_bottom_right = 16
	style.shadow_color = Color(0, 0, 0, 0.65)
	style.shadow_size = 15
	popup.add_theme_stylebox_override("panel", style)
	
	var margin = MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 24)
	margin.add_theme_constant_override("margin_top", 24)
	margin.add_theme_constant_override("margin_right", 24)
	margin.add_theme_constant_override("margin_bottom", 24)
	popup.add_child(margin)
	
	var vbox = VBoxContainer.new()
	vbox.add_theme_constant_override("separation", 14)
	margin.add_child(vbox)
	
	# Title
	var title = Label.new()
	title.text = "👑 CITADEL WARP PORTAL"
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title.add_theme_font_size_override("font_size", 18)
	title.add_theme_color_override("font_color", Color(0.14, 0.72, 0.65))
	vbox.add_child(title)
	
	# Current location state
	var coords_lbl = Label.new()
	var current_pos = kingdom_manager.player_castle_position
	var current_kid = kingdom_manager._active_kingdom_id
	coords_lbl.text = "Current Sector: (%.1f, %.1f) | Realm #%d" % [current_pos.x, current_pos.y, current_kid]
	coords_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	coords_lbl.add_theme_font_size_override("font_size", 12)
	coords_lbl.add_theme_color_override("font_color", Color(0.6, 0.65, 0.7))
	vbox.add_child(coords_lbl)
	
	# Divider
	var div = ColorRect.new()
	div.custom_minimum_size = Vector2(0, 2)
	div.color = Color(0.2, 0.25, 0.3, 0.4)
	vbox.add_child(div)
	
	# 1. Random Teleport Button
	var r_btn = _create_teleport_row(
		"🌀 RANDOM TELEPORT", 
		"Warp your Citadel to a random safe coordinate in this Realm.", 
		func():
			var new_spot = kingdom_manager.perform_random_teleport()
			if new_spot != Vector2.ZERO:
				var success = kingdom_manager.relocate_castle_to(new_spot)
				if success:
					if camera: camera._target_position = new_spot
					_spawn_toast("Citadel successfully randomized!")
					popup.queue_free()
			else:
				_spawn_toast("Failed to resolve random spot.")
	)
	vbox.add_child(r_btn)
	
	# 2. Alliance Teleport Button
	var a_btn = _create_teleport_row(
		"🛡️ ALLIANCE FORTRESS WARP", 
		"Warp your Citadel close to active Alliance structures.", 
		func():
			var new_spot = kingdom_manager.perform_alliance_teleport()
			if new_spot != Vector2.ZERO:
				var success = kingdom_manager.relocate_castle_to(new_spot)
				if success:
					if camera: camera._target_position = new_spot
					_spawn_toast("Arrived at Alliance safe territory!")
					popup.queue_free()
			else:
				_spawn_toast("No Alliance structures detected.")
	)
	vbox.add_child(a_btn)
	
	# 3. Coordinate Warp (Advanced Teleport / City Relocation)
	var adv_box = VBoxContainer.new()
	adv_box.add_theme_constant_override("separation", 4)
	
	var adv_lbl = Label.new()
	adv_lbl.text = "🎯 COORDINATE RELOCATION"
	adv_lbl.add_theme_font_size_override("font_size", 12)
	adv_lbl.add_theme_color_override("font_color", Color(0.9, 0.75, 0.2))
	adv_box.add_child(adv_lbl)
	
	var input_row = HBoxContainer.new()
	input_row.add_theme_constant_override("separation", 10)
	
	var spin_x = SpinBox.new()
	spin_x.min_value = -1000
	spin_x.max_value = 1000
	spin_x.value = current_pos.x
	spin_x.prefix = "X: "
	spin_x.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	input_row.add_child(spin_x)
	
	var spin_y = SpinBox.new()
	spin_y.min_value = -1000
	spin_y.max_value = 1000
	spin_y.value = current_pos.y
	spin_y.prefix = "Y: "
	spin_y.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	input_row.add_child(spin_y)
	
	var go_btn = Button.new()
	go_btn.text = "WARP"
	go_btn.pressed.connect(func():
		var target_spot = Vector2(spin_x.value, spin_y.value)
		var success = kingdom_manager.relocate_castle_to(target_spot)
		if success:
			var actual_spot = kingdom_manager.player_castle_position
			if camera: camera._target_position = actual_spot
			_spawn_toast("Relocated to (%.1f, %.1f)!" % [actual_spot.x, actual_spot.y])
			popup.queue_free()
		else:
			_spawn_toast("Target is heavily blocked!")
	)
	input_row.add_child(go_btn)
	adv_box.add_child(input_row)
	vbox.add_child(adv_box)
	
	# 4. Realm Migration
	var mig_box = VBoxContainer.new()
	mig_box.add_theme_constant_override("separation", 4)
	
	var mig_lbl = Label.new()
	mig_lbl.text = "👑 REALM MIGRATION"
	mig_lbl.add_theme_font_size_override("font_size", 12)
	mig_lbl.add_theme_color_override("font_color", Color(0.8, 0.4, 0.9))
	mig_box.add_child(mig_lbl)
	
	var mig_row = HBoxContainer.new()
	mig_row.add_theme_constant_override("separation", 10)
	
	var realm_select = SpinBox.new()
	realm_select.min_value = 1
	realm_select.max_value = 100
	realm_select.value = current_kid + 1
	realm_select.prefix = "Realm: #"
	realm_select.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	mig_row.add_child(realm_select)
	
	var mig_btn = Button.new()
	mig_btn.text = "MIGRATE"
	mig_btn.pressed.connect(func():
		var target_realm = int(realm_select.value)
		_spawn_toast("Migrating to Realm #%d..." % target_realm)
		kingdom_manager.migrate_to_new_kingdom(target_realm)
		var new_spot = kingdom_manager.player_castle_position
		if camera:
			camera.position = new_spot
			camera._target_position = new_spot
		_spawn_toast("Welcome to Realm #%d!" % target_realm)
		popup.queue_free()
	)
	mig_row.add_child(mig_btn)
	mig_box.add_child(mig_row)
	vbox.add_child(mig_box)
	
	# Close button
	var close_btn = Button.new()
	close_btn.text = "CLOSE SYSTEM PORTAL"
	close_btn.pressed.connect(func():
		popup.queue_free()
	)
	vbox.add_child(close_btn)
	
	# Opening Animation
	popup.scale = Vector2(0.85, 0.85)
	popup.pivot_offset = Vector2(210, 250)
	popup.modulate.a = 0.0
	var tween = create_tween().set_parallel(true)
	tween.tween_property(popup, "scale", Vector2.ONE, 0.22).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tween.tween_property(popup, "modulate:a", 1.0, 0.18)

func _create_teleport_row(btn_title: String, btn_desc: String, pressed_callback: Callable) -> VBoxContainer:
	var container = VBoxContainer.new()
	container.add_theme_constant_override("separation", 2)
	
	var btn = Button.new()
	btn.text = btn_title
	btn.alignment = HORIZONTAL_ALIGNMENT_LEFT
	btn.pressed.connect(pressed_callback)
	container.add_child(btn)
	
	var desc = Label.new()
	desc.text = btn_desc
	desc.add_theme_font_size_override("font_size", 10)
	desc.add_theme_color_override("font_color", Color(0.5, 0.55, 0.6))
	desc.autowrap_mode = TextServer.AUTOWRAP_WORD
	container.add_child(desc)
	
	return container

func _spawn_toast(message: String) -> void:
	print("[WorldRoot Toast] ", message)
	var toast = Label.new()
	toast.text = "✨ " + message
	toast.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	toast.add_theme_font_size_override("font_size", 14)
	toast.add_theme_color_override("font_color", Color.WHITE)
	
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.1, 0.1, 0.15, 0.9)
	style.corner_radius_top_left = 8
	style.corner_radius_top_right = 8
	style.corner_radius_bottom_left = 8
	style.corner_radius_bottom_right = 8
	style.content_margin_left = 16
	style.content_margin_right = 16
	style.content_margin_top = 8
	style.content_margin_bottom = 8
	
	var panel = PanelContainer.new()
	panel.add_theme_stylebox_override("panel", style)
	panel.add_child(toast)
	$HUD/Control.add_child(panel)
	
	panel.anchors_preset = Control.PRESET_CENTER_TOP
	panel.grow_horizontal = Control.GROW_DIRECTION_BOTH
	panel.position.y = 80
	
	var tween = create_tween()
	panel.modulate.a = 0.0
	tween.tween_property(panel, "modulate:a", 1.0, 0.2)
	tween.tween_interval(1.8)
	tween.tween_property(panel, "modulate:a", 0.0, 0.3)
	tween.tween_callback(panel.queue_free)

func _show_panel() -> void:
	if not detail_panel:
		return
	detail_panel.visible = true
	# Elegant slide-up animation for mobile HUD immersion
	var target_y = get_viewport_rect().size.y - detail_panel.size.y - 16.0
	detail_panel.global_position.y = get_viewport_rect().size.y
	
	var tween = create_tween()
	tween.set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)
	tween.tween_property(detail_panel, "global_position:y", target_y, 0.25)

func _hide_panel() -> void:
	if detail_panel:
		detail_panel.visible = false

# Utility number formatting (e.g. 100K, 1.2M)
func _format_number(num: int) -> String:
	if num >= 1000000:
		return "%.1fM" % (num / 1000000.0)
	elif num >= 1000:
		return "%.1fK" % (num / 1000.0)
	return str(num)
