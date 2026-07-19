extends VBoxContainer

# ==========================================
# CROWNSPIRE FLOATING ACTION BUTTONS
# ==========================================
# Handles visual display of lateral quick actions (Store, VIP Portal, Settings).

@export var store_scene: PackedScene = preload("res://scenes/Store.tscn")

@onready var vip_btn: Button = $VipBtn
@onready var shop_btn: Button = $ShopBtn
@onready var settings_btn: Button = $SettingsBtn

func _ready() -> void:
	vip_btn.pressed.connect(_on_vip_pressed)
	shop_btn.pressed.connect(_on_shop_pressed)
	settings_btn.pressed.connect(_on_settings_pressed)
	_update_vip_display()
	UIManager.currency_changed.connect(func(_p, _v): _update_vip_display())

func _update_vip_display() -> void:
	vip_btn.text = "VIP\n%d" % UIManager.vip_level

func _on_vip_pressed() -> void:
	# Simulates upgrading VIP rank by giving VIP points
	UIManager.vip_points += 500
	if UIManager.vip_points >= UIManager.vip_level * 1000:
		UIManager.vip_points -= UIManager.vip_level * 1000
		UIManager.vip_level += 1
		UIManager.reward_claimed.emit([
			{"name": "VIP Rank Ascension", "quantity": 1, "rarity": 3}
		])
	else:
		# Alert points gain
		UIManager.reward_claimed.emit([
			{"name": "VIP Prestige Favors", "quantity": 500, "rarity": 2}
		])

func _on_shop_pressed() -> void:
	if store_scene:
		# Since UIManager has popup_stack, let's open it using open_popup!
		UIManager.open_popup(store_scene)

func _on_settings_pressed() -> void:
	var settings_scene = preload("res://scenes/settings/SettingsScreen.tscn")
	if settings_scene:
		UIManager.open_popup(settings_scene)
