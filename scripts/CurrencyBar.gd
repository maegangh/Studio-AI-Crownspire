@tool
extends MarginContainer

# ==========================================
# CROWNSPIRE CURRENCY BAR CONTROLLER
# ==========================================
# Reusable UI component displaying currency balance.
# Connects dynamically to UIManager to handle auto-updates with numeric animation.

@export_enum("royal_crystal", "aurora_crystal", "gold", "alliance_honor") var currency_type: String = "royal_crystal":
	set(val):
		currency_type = val
		_update_visual_style()

@onready var icon_rect: TextureRect = %IconRect
@onready var label_amount: Label = %LabelAmount
@onready var add_button: TextureButton = %AddButton
@onready var anim_player: AnimationPlayer = $AnimationPlayer

var current_val: float = 0.0
var target_val: float = 0.0
var lerp_speed: float = 8.0

func _ready() -> void:
	_update_visual_style()
	
	if not Engine.is_editor_hint():
		# Connect to global economy manager updates
		UIManager.currency_changed.connect(_on_currency_updated)
		_sync_with_current_balance()
		add_button.pressed.connect(_on_add_button_pressed)

func _process(delta: float) -> void:
	if not Engine.is_editor_hint() and current_val != target_val:
		current_val = lerp(current_val, target_val, lerp_speed * delta)
		if abs(current_val - target_val) < 1.0:
			current_val = target_val
		label_amount.text = String.num_int64(int(current_val)).lpad(0, "") # Format as integer string

func _sync_with_current_balance() -> void:
	match currency_type:
		"royal_crystal":
			target_val = UIManager.royal_crystals
		"aurora_crystal":
			target_val = UIManager.aurora_crystals
		"gold":
			target_val = UIManager.gold
		"alliance_honor":
			target_val = UIManager.alliance_honor
	current_val = target_val
	label_amount.text = String.num_int64(int(current_val))

func _update_visual_style() -> void:
	if not is_inside_tree():
		return
		
	# Update Icon & Hover hints based on currency design sheet
	match currency_type:
		"royal_crystal":
			if icon_rect: icon_rect.texture = load("res://assets/ui/icons/hud_royal_crystal.png")
			self.tooltip_text = "Royal Crystals (Premium Crystal Magic)"
		"aurora_crystal":
			if icon_rect: icon_rect.texture = load("res://assets/ui/icons/hud_aurora_crystal.png")
			self.tooltip_text = "Aurora Crystals (Event / Seasonal)"
		"gold":
			if icon_rect: icon_rect.texture = load("res://assets/ui/icons/hud_gold.png")
			self.tooltip_text = "Sovereign Gold Reserves"
		"alliance_honor":
			if icon_rect: icon_rect.texture = load("res://assets/ui/icons/hud_alliance.png")
			self.tooltip_text = "Alliance Honor Points"

func _on_currency_updated(type: String, new_amount: float) -> void:
	if type == currency_type:
		target_val = new_amount
		if anim_player and anim_player.has_animation("pulse_update"):
			anim_player.play("pulse_update")

func _on_add_button_pressed() -> void:
	# Signal parent store to focus on appropriate shop category
	var store = get_tree().current_scene
	if store and store.has_method("switch_to_category"):
		match currency_type:
			"royal_crystal", "aurora_crystal":
				store.switch_to_category("crystals")
			"alliance_honor", "gold":
				store.switch_to_category("resources")
