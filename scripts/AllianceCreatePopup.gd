extends Control

# ==========================================
# CROWNSPIRE ALLIANCE CREATION POPUP
# ==========================================

signal closed()

@onready var popup: Panel = $Popup
@onready var close_btn: Button = $Popup/BtnClose
@onready var create_btn: Button = $Popup/BtnCreate

@onready var name_input: LineEdit = $Popup/NameInput
@onready var tag_input: LineEdit = $Popup/TagInput
@onready var flag_options: OptionButton = $Popup/FlagOptions
@onready var cost_lbl: Label = $Popup/CostLabel

# Dynamic Field References
var desc_input: LineEdit
var lang_options: OptionButton
var join_options: OptionButton
var power_input: LineEdit

func _ready() -> void:
	close_btn.pressed.connect(_on_close_pressed)
	create_btn.pressed.connect(_on_create_pressed)
	
	# Resize popup dynamically to accommodate advanced creation fields
	popup.custom_minimum_size = Vector2(460, 685)
	popup.size = Vector2(460, 685)
	
	# Reposition existing fields to compact the spacing
	$Popup/LblName.offset_top = 70
	name_input.offset_top = 95
	name_input.offset_bottom = 130
	
	$Popup/LblTag.offset_top = 140
	tag_input.offset_top = 165
	tag_input.offset_bottom = 200
	
	$Popup/LblFlag.offset_top = 210
	flag_options.offset_top = 235
	flag_options.offset_bottom = 270
	
	# Create and style Description Input
	var lbl_desc = Label.new()
	lbl_desc.text = "📜 Alliance Declaration / Motto"
	lbl_desc.offset_left = 30
	lbl_desc.offset_top = 280
	lbl_desc.add_theme_font_size_override("font_size", 13)
	lbl_desc.add_theme_color_override("font_color", Color("#b0c4d9"))
	popup.add_child(lbl_desc)
	
	desc_input = LineEdit.new()
	desc_input.placeholder_text = "E.g., We fight as one under the spires."
	desc_input.offset_left = 30
	desc_input.offset_right = 430
	desc_input.offset_top = 305
	desc_input.offset_bottom = 340
	desc_input.add_theme_font_size_override("font_size", 13)
	popup.add_child(desc_input)
	
	# Create and style Language Options
	var lbl_lang = Label.new()
	lbl_lang.text = "🌐 Primary Language"
	lbl_lang.offset_left = 30
	lbl_lang.offset_top = 350
	lbl_lang.add_theme_font_size_override("font_size", 13)
	lbl_lang.add_theme_color_override("font_color", Color("#b0c4d9"))
	popup.add_child(lbl_lang)
	
	lang_options = OptionButton.new()
	lang_options.offset_left = 30
	lang_options.offset_right = 430
	lang_options.offset_top = 375
	lang_options.offset_bottom = 410
	lang_options.add_item("🌐 English", 0)
	lang_options.add_item("🌐 German (Deutsch)", 1)
	lang_options.add_item("🌐 French (Français)", 2)
	lang_options.add_item("🌐 Spanish (Español)", 3)
	lang_options.add_item("🌐 Russian (Русский)", 4)
	lang_options.add_item("🌐 Chinese (中文)", 5)
	lang_options.add_item("🌐 Japanese (日本語)", 6)
	lang_options.selected = 0
	lang_options.add_theme_font_size_override("font_size", 13)
	popup.add_child(lang_options)
	
	# Create and style Auto-Join Selection
	var lbl_join = Label.new()
	lbl_join.text = "🛡️ Admission Type"
	lbl_join.offset_left = 30
	lbl_join.offset_top = 420
	lbl_join.add_theme_font_size_override("font_size", 13)
	lbl_join.add_theme_color_override("font_color", Color("#b0c4d9"))
	popup.add_child(lbl_join)
	
	join_options = OptionButton.new()
	join_options.offset_left = 30
	join_options.offset_right = 430
	join_options.offset_top = 445
	join_options.offset_bottom = 480
	join_options.add_item("🔓 Auto-Join (Open Entry)", 0)
	join_options.add_item("🔒 Approval Required (Applications)", 1)
	join_options.selected = 0
	join_options.add_theme_font_size_override("font_size", 13)
	popup.add_child(join_options)
	
	# Create and style Minimum Power Requirement
	var lbl_power = Label.new()
	lbl_power.text = "⚡ Minimum Power Requirement"
	lbl_power.offset_left = 30
	lbl_power.offset_top = 490
	lbl_power.add_theme_font_size_override("font_size", 13)
	lbl_power.add_theme_color_override("font_color", Color("#b0c4d9"))
	popup.add_child(lbl_power)
	
	power_input = LineEdit.new()
	power_input.text = "10000"
	power_input.placeholder_text = "E.g., 50000"
	power_input.offset_left = 30
	power_input.offset_right = 430
	power_input.offset_top = 515
	power_input.offset_bottom = 550
	power_input.add_theme_font_size_override("font_size", 13)
	power_input.text_changed.connect(func(new_text: String):
		var clean = ""
		for i in range(new_text.length()):
			if new_text[i].is_numeric():
				clean += new_text[i]
		if clean != new_text:
			power_input.text = clean
			power_input.caret_column = clean.length()
	)
	popup.add_child(power_input)
	
	# Re-align cost and actions to the very bottom
	cost_lbl.offset_top = -105
	cost_lbl.offset_bottom = -75
	$Popup/Actions.offset_top = -65
	$Popup/Actions.offset_bottom = -15

	# Populate Flag Emojis
	if flag_options:
		flag_options.clear()
		flag_options.add_item("🛡️ Shield Warden", 0)
		flag_options.add_item("👑 Imperial Crown", 1)
		flag_options.add_item("⚔️ Crossed Swords", 2)
		flag_options.add_item("🏹 Hunter's Bow", 3)
		flag_options.add_item("🦁 Solar Lion", 4)
		flag_options.add_item("🦅 Sky Eagle", 5)
		flag_options.add_item("🐉 Core Dragon", 6)
		flag_options.add_item("☀️ Radiant Sun", 7)
		flag_options.add_item("❄️ Glacial Crest", 8)
		flag_options.add_item("⚡ Storm Call", 9)
		flag_options.selected = 0
		
	# Core cost reporting
	var balance = UIManager.get_resource_value("royal_crystal")
	cost_lbl.text = "Creation Fee: 500 💎 (Owns: %d 💎)" % balance
	create_btn.disabled = (balance < 500)

func _on_close_pressed() -> void:
	closed.emit()
	queue_free()

func _on_create_pressed() -> void:
	var name_str = name_input.text.strip_edges()
	var tag_str = tag_input.text.strip_edges().to_upper()
	
	if name_str == "" or tag_str == "":
		UIManager.show_error("Alliance Name and Tag cannot be empty!")
		return
		
	if name_str.length() < 3:
		UIManager.show_error("Alliance Name must be at least 3 characters!")
		return
		
	if tag_str.length() < 3 or tag_str.length() > 4:
		UIManager.show_error("Tag must be 3 or 4 letters!")
		return
		
	var emojis = ["🛡️", "👑", "⚔️", "🏹", "🦁", "🦅", "🐉", "☀️", "❄️", "⚡"]
	var selected_emoji = emojis[flag_options.selected]
	
	var desc_str = desc_input.text.strip_edges()
	var is_pub = (join_options.selected == 0)
	var min_p = int(power_input.text)
	var lang_str = lang_options.get_item_text(lang_options.selected).replace("🌐 ", "")
	
	var balance = UIManager.get_resource_value("royal_crystal")
	if balance >= 500:
		var success = UIManager.create_alliance(
			name_str, 
			tag_str, 
			selected_emoji, 
			desc_str, 
			"#112233", 
			"#ffffff", 
			is_pub, 
			min_p, 
			lang_str
		)
		if success:
			_on_close_pressed()
