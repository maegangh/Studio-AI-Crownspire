# ==============================================================================
# Crownspire MMO Strategy Game - Alliance Members Controller
# Godot 4 / GDScript 2.0 Client-side alliance roster manager
# ==============================================================================

extends Control

# --- Signals ---
signal member_list_updated
signal add_log_requested(text, type)

# --- Onready Nodes ---
@onready var members_list: VBoxContainer = $Layout/Split/MembersSection/Scroll/List
@onready var applicants_list: VBoxContainer = $Layout/Split/ApplicantsSection/Scroll/List
@onready var sim_app_btn: Button = $Layout/Header/ActionBox/SimAppBtn
@onready var count_lbl: Label = $Layout/Header/CountLabel

# --- Internal references ---
var _alliance_scene: Control # Reference to the master Alliance node
var _state: Dictionary = {}

func _ready() -> void:
	# Attempt to bind to main scene on launch
	var parent = get_parent()
	while parent and not parent.has_method("_save_alliance_state"):
		parent = parent.get_parent()
	if parent:
		_alliance_scene = parent

## Initialize the roster view with the central alliance state
func init_view(state: Dictionary) -> void:
	_state = state
	_refresh_roster()

func _refresh_roster() -> void:
	_clear_container(members_list)
	_clear_container(applicants_list)
	
	if _state.is_empty():
		return
		
	var members = _state.get("members", [])
	var applicants = _state.get("applicants", [])
	var max_members = _state.get("max_members", 50)
	
	count_lbl.text = "Garrison Capacity: %d / %d Lords" % [members.size(), max_members]
	
	# Render Active Members
	for m_data in members:
		var card = _create_member_card(m_data)
		members_list.add_child(card)
		
	# Render Applicants
	if applicants.is_empty():
		var empty_lbl = Label.new()
		empty_lbl.text = "No pending enlist applications."
		empty_lbl.add_theme_color_override("font_color", Color(0.4, 0.45, 0.5, 1))
		empty_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		applicants_list.add_child(empty_lbl)
	else:
		for a_data in applicants:
			var card = _create_applicant_card(a_data)
			applicants_list.add_child(card)

func _create_member_card(m: Dictionary) -> PanelContainer:
	var card = PanelContainer.new()
	card.custom_minimum_size = Vector2(0, 75)
	
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.098, 0.117, 0.149, 1)
	style.border_width_left = 3
	
	# Color code ranks
	var rank = m.get("rank", "R1")
	match rank:
		"R5": style.border_color = Color(0.95, 0.75, 0.15, 1) # Gold
		"R4": style.border_color = Color(0.7, 0.3, 0.9, 1) # Purple
		"R3": style.border_color = Color(0.19, 0.48, 0.82, 1) # Blue
		"R2": style.border_color = Color(0.15, 0.68, 0.37, 1) # Green
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
	
	# Member Name & Details
	var vbox = VBoxContainer.new()
	vbox.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	hbox.add_child(vbox)
	
	var name_lbl = Label.new()
	var prefix = "[%s] " % rank
	name_lbl.text = prefix + m.get("name", "Unknown Lord")
	name_lbl.add_theme_font_size_override("font_size", 14)
	name_lbl.add_theme_color_override("font_color", Color(1, 1, 1, 1))
	vbox.add_child(name_lbl)
	
	var details_lbl = Label.new()
	var joined_date = Time.get_datetime_string_from_unix_time(m.get("joined_at", Time.get_unix_time_from_system() - 86400))
	details_lbl.text = "Combat Rating: %s CR | Joined: %s" % [_format_num(m.get("power", 100000)), joined_date.split("T")[0]]
	details_lbl.add_theme_font_size_override("font_size", 11)
	details_lbl.add_theme_color_override("font_color", Color(0.6, 0.65, 0.7, 1))
	vbox.add_child(details_lbl)
	
	# Actions (Promote, Demote, Kick) - only visible/accessible if player is R5/R4 and higher than target
	var actions_hbox = HBoxContainer.new()
	actions_hbox.alignment = BoxContainer.ALIGNMENT_CENTER
	actions_hbox.add_theme_constant_override("separation", 8)
	hbox.add_child(actions_hbox)
	
	# Only let player manipulate if they aren't manipulating themselves
	if m.get("name", "") != "Sovereign Maegan":
		var promote_btn = Button.new()
		promote_btn.text = "▲"
		promote_btn.custom_minimum_size = Vector2(30, 30)
		promote_btn.tooltip_text = "Promote member"
		promote_btn.pressed.connect(func(): _on_promote_pressed(m))
		actions_hbox.add_child(promote_btn)
		
		var demote_btn = Button.new()
		demote_btn.text = "▼"
		demote_btn.custom_minimum_size = Vector2(30, 30)
		demote_btn.tooltip_text = "Demote member"
		demote_btn.pressed.connect(func(): _on_demote_pressed(m))
		actions_hbox.add_child(demote_btn)
		
		var kick_btn = Button.new()
		kick_btn.text = "Kick"
		kick_btn.custom_minimum_size = Vector2(50, 30)
		kick_btn.tooltip_text = "Banish lord from alliance"
		kick_btn.add_theme_color_override("font_color", Color(1, 0.3, 0.3, 1))
		kick_btn.pressed.connect(func(): _on_kick_pressed(m))
		actions_hbox.add_child(kick_btn)
	else:
		var self_lbl = Label.new()
		self_lbl.text = "(Paramount Lord)"
		self_lbl.add_theme_font_size_override("font_size", 11)
		self_lbl.add_theme_color_override("font_color", Color(0.5, 0.55, 0.6, 1))
		actions_hbox.add_child(self_lbl)
		
	return card

func _create_applicant_card(a: Dictionary) -> PanelContainer:
	var card = PanelContainer.new()
	card.custom_minimum_size = Vector2(0, 65)
	
	var style = StyleBoxFlat.new()
	style.bg_color = Color(0.08, 0.1, 0.12, 1)
	style.border_width_left = 3
	style.border_color = Color(0.95, 0.75, 0.15, 1)
	style.corner_radius_top_left = 6
	style.corner_radius_top_right = 6
	style.corner_radius_bottom_right = 6
	style.corner_radius_bottom_left = 6
	card.add_theme_stylebox_override("panel", style)
	
	var margin = MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 12)
	margin.add_theme_constant_override("margin_top", 6)
	margin.add_theme_constant_override("margin_right", 12)
	margin.add_theme_constant_override("margin_bottom", 6)
	card.add_child(margin)
	
	var hbox = HBoxContainer.new()
	margin.add_child(hbox)
	
	var vbox = VBoxContainer.new()
	vbox.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	hbox.add_child(vbox)
	
	var name_lbl = Label.new()
	name_lbl.text = a.get("name", "Applicant Lord") + " (" + _format_num(a.get("power", 50000)) + " CR)"
	name_lbl.add_theme_font_size_override("font_size", 13)
	vbox.add_child(name_lbl)
	
	var msg_lbl = Label.new()
	msg_lbl.text = "\"%s\"" % a.get("message", "Requesting defensive shield coverage.")
	msg_lbl.add_theme_font_size_override("font_size", 11)
	msg_lbl.add_theme_color_override("font_color", Color(0.5, 0.55, 0.6, 1))
	vbox.add_child(msg_lbl)
	
	var action_box = HBoxContainer.new()
	action_box.alignment = BoxContainer.ALIGNMENT_CENTER
	action_box.add_theme_constant_override("separation", 6)
	hbox.add_child(action_box)
	
	var approve_btn = Button.new()
	approve_btn.text = "Approve"
	approve_btn.custom_minimum_size = Vector2(70, 28)
	approve_btn.pressed.connect(func(): _on_approve_applicant(a))
	action_box.add_child(approve_btn)
	
	var decline_btn = Button.new()
	decline_btn.text = "Decline"
	decline_btn.custom_minimum_size = Vector2(70, 28)
	decline_btn.pressed.connect(func(): _on_decline_applicant(a))
	action_box.add_child(decline_btn)
	
	return card

# ==============================================================================
# BUTTON INTERACTIONS
# ==============================================================================

func _on_promote_pressed(m: Dictionary) -> void:
	var rank = m.get("rank", "R1")
	var new_rank = ""
	match rank:
		"R1": new_rank = "R2"
		"R2": new_rank = "R3"
		"R3": new_rank = "R4"
		"R4":
			add_log_requested.emit("Lord Paramount (R5) is unique and cannot be shared. Relinquish throne to delegate R5.", "warning")
			return
		_: return
		
	m["rank"] = new_rank
	_save_and_sync()
	add_log_requested.emit("Promoted %s to rank %s!" % [m.get("name"), new_rank], "success")
	_refresh_roster()

func _on_demote_pressed(m: Dictionary) -> void:
	var rank = m.get("rank", "R1")
	var new_rank = ""
	match rank:
		"R4": new_rank = "R3"
		"R3": new_rank = "R2"
		"R2": new_rank = "R1"
		"R1":
			add_log_requested.emit("%s is already at the lowest initiate rank." % m.get("name"), "warning")
			return
		_: return
		
	m["rank"] = new_rank
	_save_and_sync()
	add_log_requested.emit("Demoted %s to rank %s." % [m.get("name"), new_rank], "info")
	_refresh_roster()

func _on_kick_pressed(m: Dictionary) -> void:
	var members = _state.get("members", [])
	for i in range(members.size()):
		if members[i].get("name") == m.get("name"):
			members.remove_at(i)
			break
	_state["member_count"] = members.size()
	_save_and_sync()
	add_log_requested.emit("Banished %s from the alliance garrison." % m.get("name"), "warning")
	_refresh_roster()

func _on_approve_applicant(a: Dictionary) -> void:
	var members = _state.get("members", [])
	var max_members = _state.get("max_members", 50)
	if members.size() >= max_members:
		add_log_requested.emit("Garrison limit reached. Upgrade Fortress or level up to host more lords.", "warning")
		return
		
	# Add member
	var new_member = {
		"name": a.get("name"),
		"power": a.get("power", 50000),
		"rank": "R1",
		"joined_at": Time.get_unix_time_from_system()
	}
	members.append(new_member)
	
	# Remove applicant
	var applicants = _state.get("applicants", [])
	for i in range(applicants.size()):
		if applicants[i].get("name") == a.get("name"):
			applicants.remove_at(i)
			break
			
	_state["member_count"] = members.size()
	_save_and_sync()
	add_log_requested.emit("Enlisted %s into the guild roster! Alliance combat power reinforced." % a.get("name"), "success")
	_refresh_roster()

func _on_decline_applicant(a: Dictionary) -> void:
	var applicants = _state.get("applicants", [])
	for i in range(applicants.size()):
		if applicants[i].get("name") == a.get("name"):
			applicants.remove_at(i)
			break
	_save_and_sync()
	add_log_requested.emit("Declined application from %s." % a.get("name"), "info")
	_refresh_roster()

func _on_sim_app_pressed() -> void:
	var names = ["Lord Brandon", "Lady Helen", "Vassal Gwydion", "Baron Oakhaven", "Commander Stark", "Sovereign Freya", "Lady Elspeth", "Sir Cedric"]
	var msgs = [
		"Active shield daily. Expanding keep borders.",
		"Seeking strong trade partners for slate extraction.",
		"Heavy Cavalry division fully ready to bolster rally camps.",
		"Former officer of Crimson Pact. Loyal builder.",
		"Looking for shelter from Volcanic Drake raids.",
		"Can donate 200k Wood daily to support Fortress project."
	]
	
	var rand_name = names[randi() % names.size()] + " #" + str(randi() % 900 + 100)
	var rand_msg = msgs[randi() % msgs.size()]
	var rand_power = randi_range(60000, 450000)
	
	# Verify not duplicate
	var applicants = _state.get("applicants", [])
	for app in applicants:
		if app.get("name") == rand_name:
			return
			
	applicants.append({
		"name": rand_name,
		"message": rand_msg,
		"power": rand_power
	})
	
	_save_and_sync()
	add_log_requested.emit("A new lord (%s, %s CR) has requested alliance shelter!" % [rand_name, _format_num(rand_power)], "info")
	_refresh_roster()

# ==============================================================================
# STORAGE & HELPERS
# ==============================================================================

func _clear_container(container: Node) -> void:
	for child in container.get_children():
		child.queue_free()

func _save_and_sync() -> void:
	if _alliance_scene and _alliance_scene.has_method("_save_alliance_state"):
		_alliance_scene._save_alliance_state()
	member_list_updated.emit()

func _format_num(num: int) -> String:
	if num >= 1000000:
		return "%.1fM" % (num / 1000000.0)
	elif num >= 1000:
		return "%.1fk" % (num / 1000.0)
	return str(num)
