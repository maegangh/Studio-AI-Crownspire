extends VBoxContainer

# ==========================================
# CROWNSPIRE CREDITS REEL PANEL
# ==========================================
# Handles visual rendering and smooth automatic scrolling of developer credits
# and licensing notices.

@onready var scroll_container: ScrollContainer = %ScrollContainer
@onready var credits_vbox: VBoxContainer = %CreditsVBox

var scroll_speed: float = 35.0 # Pixels per second
var auto_scroll: bool = true

func _ready() -> void:
	# Add some default credits
	_add_credit_group("EXECUTIVE LEADERSHIP", ["Lord Aurelius - Arch Duke", "Maegan Pringle - Sovereign Producer"])
	_add_credit_group("GAME ENGINE ARCHITECTS", ["Godot Engine Core Team", "Gemini AI - Forge Weaver"])
	_add_credit_group("ART & CREATIVE DIRECTION", ["Lady Seraphina - Chief Illustrator", "Valeria Swift - UI/UX Wizard"])
	_add_credit_group("DEVELOPMENT CITADEL", ["Garrick Ironfist - Lead Gameplay Programmer", "Eldrin Mage - Netcode Mage"])
	_add_credit_group("SOUNDSCAPE & SYMPHONIES", ["Sir Roderick - Grand Composer", "Talia Bowmaster - SFX Ranger"])
	_add_credit_group("SPECIAL THANKS", ["Every Lord and Lady of Crownspire", "Our Alpha Guild Backers", "Godot 4.4 Community"])

func _process(delta: float) -> void:
	if auto_scroll and scroll_container:
		var scroll_val = scroll_container.scroll_vertical
		scroll_container.scroll_vertical = scroll_val + int(scroll_speed * delta)
		
		# Reset scroll to bottom-top loops
		if scroll_container.scroll_vertical >= credits_vbox.size.y - scroll_container.size.y:
			scroll_container.scroll_vertical = 0

func _add_credit_group(title_str: String, members: Array) -> void:
	var spacer = Control.new()
	spacer.custom_minimum_size = Vector2(0, 16)
	credits_vbox.add_child(spacer)
	
	var title = Label.new()
	title.text = "✦ " + title_str + " ✦"
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title.theme_override_font_sizes/font_size = 13
	title.modulate = Color(1.0, 0.85, 0.55, 1.0) # Gold
	credits_vbox.add_child(title)
	
	for m in members:
		var name_lbl = Label.new()
		name_lbl.text = m
		name_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		name_lbl.theme_override_font_sizes/font_size = 11
		name_lbl.modulate = Color(0.8, 0.85, 0.9, 1.0) # Slate Silver
		credits_vbox.add_child(name_lbl)
