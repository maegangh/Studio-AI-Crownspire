extends PanelContainer

# ==========================================
# CROWNSPIRE PLAYER PROFILE PANEL CONTROLLER
# ==========================================
# Displays comprehensive player achievements, power metrics, VIP ratings,
# guild/alliance tags, and handles interactive actions like copying IDs.

signal edit_profile_requested()
signal change_avatar_requested()

@onready var avatar_lbl: Label = get_node_or_null("%AvatarLabel")
@onready var name_lbl: Label = get_node_or_null("%PlayerNameLabel")
@onready var vip_lbl: Label = get_node_or_null("%VipLevelLabel")
@onready var id_lbl: Label = get_node_or_null("%PlayerIdLabel")
@onready var power_lbl: Label = get_node_or_null("%PowerValueLabel")
@onready var alliance_lbl: Label = get_node_or_null("%AllianceValueLabel")
@onready var skin_lbl: Label = get_node_or_null("%CastleSkinLabel")

@onready var copy_id_btn: Button = get_node_or_null("%CopyIdButton")
@onready var change_avatar_btn: Button = get_node_or_null("%ChangeAvatarButton")
@onready var edit_name_btn: Button = get_node_or_null("%EditNameButton")

var active_profile: Dictionary = {}

func _ready() -> void:
	if copy_id_btn:
		copy_id_btn.pressed.connect(_on_copy_id_pressed)
	if change_avatar_btn:
		change_avatar_btn.pressed.connect(_on_change_avatar_pressed)
	if edit_name_btn:
		edit_name_btn.pressed.connect(_on_edit_name_pressed)

func display_profile(profile_data: Dictionary) -> void:
	active_profile = profile_data
	
	if name_lbl:
		name_lbl.text = profile_data.get("name", "Unknown Commander")
		
	if id_lbl:
		id_lbl.text = "ID: " + profile_data.get("player_id", "CS-000000")
		
	if vip_lbl:
		var vip = int(profile_data.get("vip_level", 1))
		vip_lbl.text = "VIP %d" % vip
		# VIP gold coloring effect
		vip_lbl.modulate = Color(1.0, 0.85, 0.1)
		
	if power_lbl:
		power_lbl.text = "⚔️ %s" % _format_number(int(profile_data.get("power", 0)))
		
	if alliance_lbl:
		var tag = profile_data.get("alliance_tag", "")
		var a_name = profile_data.get("alliance_name", "")
		if tag != "":
			alliance_lbl.text = "[%s] %s" % [tag, a_name]
		else:
			alliance_lbl.text = a_name if a_name != "" else "No Alliance"
			
	if avatar_lbl:
		avatar_lbl.text = profile_data.get("avatar_emoji", "🧙")
		
	if skin_lbl:
		skin_lbl.text = "🏰 Skin: " + profile_data.get("castle_skin", "Default Citadel")

func _format_number(val: int) -> String:
	if val >= 1000000:
		return "%.2fM" % (val / 1000000.0)
	elif val >= 1000:
		return "%.1fK" % (val / 1000.0)
	return str(val)

func _on_copy_id_pressed() -> void:
	var player_id = active_profile.get("player_id", "")
	DisplayServer.clipboard_set(player_id)
	
	if copy_id_btn:
		var prev_text = copy_id_btn.text
		copy_id_btn.text = "COPIED ✔"
		copy_id_btn.disabled = true
		
		var timer = get_tree().create_timer(1.5)
		timer.timeout.connect(func():
			if copy_id_btn:
				copy_id_btn.text = prev_text
				copy_id_btn.disabled = false
		)
		
	# Connect to global notification toaster if UIManager is present
	var global_ui = get_node_or_null("/root/UIManager")
	if global_ui and global_ui.has_method("show_toast"):
		global_ui.show_toast("Player ID copied to clipboard!")

func _on_change_avatar_pressed() -> void:
	change_avatar_requested.emit()
	
	# Simulate cycle through emojis
	var emojis = ["🧙", "🦁", "🧝", "🛡️", "👑", "🏹", "🐲", "🔮"]
	var cur_emoji = active_profile.get("avatar_emoji", "🧙")
	var next_idx = (emojis.find(cur_emoji) + 1) % emojis.size()
	var next_emoji = emojis[next_idx]
	
	active_profile["avatar_emoji"] = next_emoji
	if avatar_lbl:
		avatar_lbl.text = next_emoji
		
	var global_ui = get_node_or_null("/root/UIManager")
	if global_ui and global_ui.has_method("show_toast"):
		global_ui.show_toast("Avatar updated successfully!")

func _on_edit_name_pressed() -> void:
	edit_profile_requested.emit()
	# Interactive prompt simulator or show toast
	var global_ui = get_node_or_null("/root/UIManager")
	if global_ui and global_ui.has_method("show_toast"):
		global_ui.show_toast("Name Editing requires Citadel Level 5.")
