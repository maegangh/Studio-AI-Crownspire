extends Control

# ==========================================
# CROWNSPIRE ALLIANCE SETTINGS PANEL
# ==========================================

@onready var name_input: LineEdit = $Card/Form/NameInput
@onready var tag_input: LineEdit = $Card/Form/TagInput
@onready var desc_input: TextEdit = $Card/Form/DescInput
@onready var public_toggle: CheckButton = $Card/Form/PublicToggle

@onready var save_btn: Button = $Card/Actions/BtnSave
@onready var leave_btn: Button = $Card/Actions/BtnLeave
@onready var disband_btn: Button = $Card/Actions/BtnDisband

func _ready() -> void:
	save_btn.pressed.connect(_on_save_pressed)
	leave_btn.pressed.connect(_on_leave_pressed)
	disband_btn.pressed.connect(_on_disband_pressed)
	
	refresh_panel()

func refresh_panel() -> void:
	var alliance = UIManager.get_player_alliance()
	if alliance.is_empty():
		return
		
	# Populate existing values
	name_input.text = alliance.get("name", "")
	tag_input.text = alliance.get("tag", "")
	desc_input.text = alliance.get("description", "")
	public_toggle.button_pressed = alliance.get("is_public", true)
	
	# Validate user authority
	var player_rank = 1
	var members = alliance.get("members", []) as Array
	for m in members:
		if m["name"] == UIManager.player_name:
			player_rank = int(m.get("rank", 1))
			break
			
	# Disband is only for Leader (4)
	disband_btn.visible = (player_rank == 4)
	
	# Edit permissions (name, tag, public settings are for Officers (3) and Leader (4))
	var can_edit = (player_rank >= 3)
	name_input.editable = can_edit
	tag_input.editable = can_edit
	desc_input.editable = can_edit
	public_toggle.disabled = not can_edit
	save_btn.visible = can_edit

func _on_save_pressed() -> void:
	var alliance = UIManager.get_player_alliance()
	if alliance.is_empty(): return
	
	var old_name = alliance.get("name", "")
	var new_name = name_input.text.strip_edges()
	var new_tag = tag_input.text.strip_edges().to_upper()
	var new_desc = desc_input.text.strip_edges()
	
	if new_name == "" or new_tag == "":
		return
		
	alliance["name"] = new_name
	alliance["tag"] = new_tag
	alliance["description"] = new_desc
	alliance["is_public"] = public_toggle.button_pressed
	
	if old_name != new_name:
		UIManager.add_alliance_log("Alliance renamed from '" + old_name + "' to '" + new_name + "' by " + UIManager.player_name + ".")
	else:
		UIManager.add_alliance_log("Alliance parameters updated by " + UIManager.player_name + ".")
		
	UIManager.alliance_updated.emit()

func _on_leave_pressed() -> void:
	UIManager.leave_alliance()

func _on_disband_pressed() -> void:
	# Disband alliance: clean up DB, empty player's alliance ID
	var p_id = UIManager.player_alliance_id
	if p_id == "": return
	
	var all_db = UIManager.alliances_db as Array
	for i in range(all_db.size()):
		if all_db[i]["id"] == p_id:
			all_db.remove_at(i)
			break
			
	UIManager.player_alliance_id = ""
	UIManager.add_alliance_log("Alliance was disbanded.")
	UIManager.alliance_updated.emit()
