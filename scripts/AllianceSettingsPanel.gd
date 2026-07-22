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

# Dynamic Extra Settings Fields
var lang_options: OptionButton
var power_input: LineEdit

func _ready() -> void:
	save_btn.pressed.connect(_on_save_pressed)
	leave_btn.pressed.connect(_on_leave_pressed)
	disband_btn.pressed.connect(_on_disband_pressed)
	
	# Dynamically setup and append Language selector
	var form = $Card/Form
	
	var lbl_lang = Label.new()
	lbl_lang.text = "🌐 Primary Language"
	lbl_lang.add_theme_color_override("font_color", Color("#b0c4d9"))
	lbl_lang.add_theme_font_size_override("font_size", 14)
	form.add_child(lbl_lang)
	
	lang_options = OptionButton.new()
	lang_options.add_item("English", 0)
	lang_options.add_item("German", 1)
	lang_options.add_item("French", 2)
	lang_options.add_item("Spanish", 3)
	lang_options.add_item("Russian", 4)
	lang_options.add_item("Chinese", 5)
	lang_options.add_item("Japanese", 6)
	form.add_child(lang_options)
	
	# Dynamically setup and append Minimum Power requirement
	var lbl_power = Label.new()
	lbl_power.text = "⚡ Minimum Power Requirement"
	lbl_power.add_theme_color_override("font_color", Color("#b0c4d9"))
	lbl_power.add_theme_font_size_override("font_size", 14)
	form.add_child(lbl_power)
	
	power_input = LineEdit.new()
	power_input.text_changed.connect(func(new_text: String):
		var clean = ""
		for i in range(new_text.length()):
			if new_text[i].is_numeric():
				clean += new_text[i]
		if clean != new_text:
			power_input.text = clean
			power_input.caret_column = clean.length()
	)
	form.add_child(power_input)
	
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
	
	# Populate Language selection
	var alliance_lang = alliance.get("language", "English")
	var lang_idx = 0
	for i in range(lang_options.item_count):
		if lang_options.get_item_text(i) == alliance_lang:
			lang_idx = i
			break
	lang_options.selected = lang_idx
	
	# Populate Power requirement
	power_input.text = str(alliance.get("min_power", 10000))
	
	# Validate user authority
	var player_rank = 1
	var members = alliance.get("members", []) as Array
	for m in members:
		if m["name"] == UIManager.player_name:
			player_rank = int(m.get("rank", 1))
			break
			
	# Disband is only for Leader (5)
	disband_btn.visible = (player_rank == 5)
	
	# Edit permissions (name, tag, public settings are routed through permission manager)
	var can_edit = UIManager.permission_manager.has_permission(player_rank, "edit_settings")
	name_input.editable = can_edit
	tag_input.editable = can_edit
	desc_input.editable = can_edit
	public_toggle.disabled = not can_edit
	lang_options.disabled = not can_edit
	power_input.editable = can_edit
	save_btn.visible = can_edit

func _on_save_pressed() -> void:
	var alliance = UIManager.get_player_alliance()
	if alliance.is_empty(): return
	
	var old_name = alliance.get("name", "")
	var new_name = name_input.text.strip_edges()
	var new_tag = tag_input.text.strip_edges().to_upper()
	var new_desc = desc_input.text.strip_edges()
	
	if new_name == "" or new_tag == "":
		UIManager.show_error("Name and Tag cannot be empty!")
		return
		
	alliance["name"] = new_name
	alliance["tag"] = new_tag
	alliance["description"] = new_desc
	alliance["is_public"] = public_toggle.button_pressed
	alliance["language"] = lang_options.get_item_text(lang_options.selected)
	alliance["min_power"] = int(power_input.text)
	
	if old_name != new_name:
		UIManager.add_alliance_log("Alliance renamed from '" + old_name + "' to '" + new_name + "' by " + UIManager.player_name + ".")
	else:
		UIManager.add_alliance_log("Alliance parameters updated by " + UIManager.player_name + ".")
		
	UIManager._save_alliance_databases()
	UIManager.alliance_updated.emit()
	UIManager.show_success("Alliance settings saved successfully!")

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
	UIManager._save_alliance_databases()
	UIManager.alliance_updated.emit()
