extends PanelContainer

# ==========================================
# CROWNSPIRE PLAYER PROFILE SCREEN
# ==========================================
# Governs the Lord Profile UI, linking statistics, achievements, name changes,
# and customization drawers for active titles, castle skins, and march decals.

@onready var close_btn: Button = %CloseButton
@onready var name_lbl: Label = %NameLabel
@onready var kingdom_lbl: Label = %KingdomLabel
@onready var power_lbl: Label = %PowerLabel
@onready var vip_lbl: Label = %VipLabel
@onready var alliance_lbl: Label = %AllianceLabel
@onready var id_lbl: Label = %IdLabel
@onready var portrait_fallback: Label = %PortraitFallback
@onready var frame_name_lbl: Label = %FrameNameLabel
@onready var title_lbl: Label = %TitleLabel

# Tab Buttons
@onready var stats_tab_btn: Button = %StatsTabBtn
@onready var ach_tab_btn: Button = %AchTabBtn
@onready var custom_tab_btn: Button = %CustomTabBtn

# Tab Containers
@onready var stats_scroll: ScrollContainer = %StatsScroll
@onready var stats_grid: GridContainer = %StatsGrid
@onready var ach_scroll: ScrollContainer = %AchScroll
@onready var ach_vbox: VBoxContainer = %AchVBox
@onready var custom_scroll: ScrollContainer = %CustomScroll

# Name Change controls
@onready var rename_btn: Button = %RenameBtn
@onready var rename_popup: Panel = %RenamePopup
@onready var new_name_input: LineEdit = %NewNameInput
@onready var rename_submit: Button = %RenameSubmit
@onready var rename_cancel: Button = %RenameCancel

# Customization controls
@onready var avatar_select: OptionButton = %AvatarSelect
@onready var frame_select: OptionButton = %FrameSelect
@onready var title_select: OptionButton = %TitleSelect
@onready var castle_select: OptionButton = %CastleSelect
@onready var march_select: OptionButton = %MarchSelect

func _ready() -> void:
	# Load current layout
	close_btn.pressed.connect(_on_close_pressed)
	stats_tab_btn.pressed.connect(func(): _switch_tab("stats"))
	ach_tab_btn.pressed.connect(func(): _switch_tab("achievements"))
	custom_tab_btn.pressed.connect(func(): _switch_tab("custom"))
	
	# Connect rename buttons
	rename_btn.pressed.connect(_on_open_rename)
	rename_submit.pressed.connect(_on_submit_rename)
	rename_cancel.pressed.connect(func(): rename_popup.visible = false)
	rename_popup.visible = false
	
	# Connect customization controls
	avatar_select.item_selected.connect(func(i): _on_custom_selected("avatar", avatar_select.get_item_text(i)))
	frame_select.item_selected.connect(func(i): _on_custom_selected("frame", frame_select.get_item_text(i)))
	title_select.item_selected.connect(func(i): _on_custom_selected("title", title_select.get_item_text(i)))
	castle_select.item_selected.connect(func(i): _on_custom_selected("castle", castle_select.get_item_text(i)))
	march_select.item_selected.connect(func(i): _on_custom_selected("march", march_select.get_item_text(i)))
	
	_load_customization_menus()
	_update_ruler_details()
	_populate_statistics()
	_populate_achievements()
	_switch_tab("stats")
	
	# Bind state change signals
	UIManager.currency_changed.connect(func(_p, _v): _update_ruler_details())
	SettingsManager.customization_updated.connect(func(_c, _i): _update_ruler_details())

func _on_close_pressed() -> void:
	UIManager.close_popup(self)

func _update_ruler_details() -> void:
	name_lbl.text = UIManager.player_name
	kingdom_lbl.text = "🏛️ KINGDOM OF DAWN #42"
	power_lbl.text = "PWR: %s" % _format_num(UIManager.power)
	vip_lbl.text = "VIP TIER %d" % UIManager.vip_level
	
	# Find Alliance
	var tag = "DAWN"
	alliance_lbl.text = "🛡️ DAWN CITADEL [%s]" % tag
	id_lbl.text = "PLAYER ID: CS-984251"
	
	# Customisation indicators
	var prof = SettingsManager.settings["profile"]
	portrait_fallback.text = prof["active_avatar"]
	frame_name_lbl.text = "Frame: " + prof["active_frame"]
	title_lbl.text = "Title: " + prof["active_title"]

func _load_customization_menus() -> void:
	var prof = SettingsManager.settings["profile"]
	
	_populate_select(avatar_select, prof["unlocked_avatars"], prof["active_avatar"])
	_populate_select(frame_select, prof["unlocked_frames"], prof["active_frame"])
	_populate_select(title_select, prof["unlocked_titles"], prof["active_title"])
	_populate_select(castle_select, prof["unlocked_castle_skins"], prof["active_castle_skin"])
	_populate_select(march_select, prof["unlocked_march_skins"], prof["active_march_skin"])

func _populate_select(select: OptionButton, items: Array, active_item: String) -> void:
	select.clear()
	for i in range(items.size()):
		select.add_item(items[i], i)
		if items[i] == active_item:
			select.select(i)

func _switch_tab(tab_name: String) -> void:
	# Tab button highlights
	stats_tab_btn.modulate = Color(1.0, 0.85, 0.3) if tab_name == "stats" else Color(1, 1, 1, 0.6)
	ach_tab_btn.modulate = Color(1.0, 0.85, 0.3) if tab_name == "achievements" else Color(1, 1, 1, 0.6)
	custom_tab_btn.modulate = Color(1.0, 0.85, 0.3) if tab_name == "custom" else Color(1, 1, 1, 0.6)
	
	stats_scroll.visible = tab_name == "stats"
	ach_scroll.visible = tab_name == "achievements"
	custom_scroll.visible = tab_name == "custom"

func _populate_statistics() -> void:
	for child in stats_grid.get_children():
		child.queue_free()
		
	for s in SettingsManager.player_statistics:
		# Name Label
		var label_n = Label.new()
		label_n.text = s["name"]
		label_n.theme_override_font_sizes/font_size = 11
		label_n.modulate = Color(0.7, 0.75, 0.8)
		
		# Value Label
		var label_v = Label.new()
		label_v.text = s["value"]
		label_v.theme_override_font_sizes/font_size = 11
		label_v.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
		label_v.modulate = Color(1, 1, 1)
		
		stats_grid.add_child(label_n)
		stats_grid.add_child(label_v)

func _populate_achievements() -> void:
	for child in ach_vbox.get_children():
		child.queue_free()
		
	for a in SettingsManager.achievements:
		var panel = PanelContainer.new()
		panel.custom_minimum_size = Vector2(0, 60)
		
		var margin = MarginContainer.new()
		margin.theme_override_constants/margin_left = 10
		margin.theme_override_constants/margin_top = 6
		margin.theme_override_constants/margin_right = 10
		margin.theme_override_constants/margin_bottom = 6
		
		var hbox = HBoxContainer.new()
		hbox.theme_override_constants/separation = 10
		
		# Status Emoji
		var icon = Label.new()
		icon.text = "🏆" if a["completed"] else "⏳"
		icon.theme_override_font_sizes/font_size = 18
		icon.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		
		var vbox = VBoxContainer.new()
		vbox.size_flags_horizontal = SIZE_EXPAND_FILL
		vbox.theme_override_constants/separation = 2
		
		var title = Label.new()
		title.text = a["name"]
		title.theme_override_font_sizes/font_size = 11
		title.modulate = Color(1.0, 0.85, 0.55) # Gold
		
		var desc = Label.new()
		desc.text = a["desc"]
		desc.theme_override_font_sizes/font_size = 9
		desc.modulate = Color(0.6, 0.65, 0.7)
		
		vbox.add_child(title)
		vbox.add_child(desc)
		
		var r_lbl = Label.new()
		r_lbl.text = "Reward:\n" + a["reward"]
		r_lbl.theme_override_font_sizes/font_size = 8
		r_lbl.modulate = Color(0.4, 0.9, 0.65) if a["completed"] else Color(0.5, 0.5, 0.5)
		
		var p_lbl = Label.new()
		p_lbl.text = a["progress"]
		p_lbl.theme_override_font_sizes/font_size = 10
		p_lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		p_lbl.modulate = Color(1, 1, 1) if a["completed"] else Color(0.6, 0.65, 0.7)
		
		hbox.add_child(icon)
		hbox.add_child(vbox)
		hbox.add_child(r_lbl)
		hbox.add_child(p_lbl)
		
		margin.add_child(hbox)
		panel.add_child(margin)
		ach_vbox.add_child(panel)

func _on_custom_selected(category: String, item_id: String) -> void:
	SettingsManager.update_customization(category, item_id)

func _on_open_rename() -> void:
	new_name_input.text = UIManager.player_name
	rename_popup.visible = true

func _on_submit_rename() -> void:
	var name_text = new_name_input.text.strip_edges()
	var res = SettingsManager.change_player_name(name_text)
	if res["success"]:
		rename_popup.visible = false
		_update_ruler_details()
		_show_notif(res["message"], true)
	else:
		_show_notif(res["message"], false)

func _show_notif(msg: String, is_success: bool) -> void:
	UIManager.reward_claimed.emit([
		{"name": msg, "quantity": 1, "rarity": 3 if is_success else 1}
	])

func _format_num(val: float) -> String:
	if val >= 1000000.0:
		return "%.2fM" % (val / 1000000.0)
	elif val >= 1000.0:
		return "%.1fK" % (val / 1000.0)
	return String.num_int64(int(val))
