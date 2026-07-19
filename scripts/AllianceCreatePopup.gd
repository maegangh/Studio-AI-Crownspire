extends Control

# ==========================================
# CROWNSPIRE ALLIANCE CREATION POPUP
# ==========================================

signal closed()

@onready var close_btn: Button = $Popup/BtnClose
@onready var create_btn: Button = $Popup/BtnCreate

@onready var name_input: LineEdit = $Popup/NameInput
@onready var tag_input: LineEdit = $Popup/TagInput
@onready var flag_options: OptionButton = $Popup/FlagOptions
@onready var cost_lbl: Label = $Popup/CostLabel

func _ready() -> void:
	close_btn.pressed.connect(_on_close_pressed)
	create_btn.pressed.connect(_on_create_pressed)
	
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
		return
		
	var emojis = ["🛡️", "👑", "⚔️", "🏹", "🦁", "🦅", "🐉", "☀️", "❄️", "⚡"]
	var selected_emoji = emojis[flag_options.selected]
	
	var balance = UIManager.get_resource_value("royal_crystal")
	if balance >= 500:
		# Deduct fee
		var success = UIManager.create_alliance(name_str, tag_str, selected_emoji)
		if success:
			# Deduct gold/royal crystals in manager
			_on_close_pressed()
