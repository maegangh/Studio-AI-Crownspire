extends Control

# ==========================================
# CROWNSPIRE MAIN STORE CONTROLLER (ROOT NODE)
# ==========================================
# Central manager holding Resource HUD rails, tab navigation, and main scrolls.
# Receives category selection events, and spawns Congratulations Claim dialogs.

@onready var title_label: Label = %StoreTitleLabel
@onready var close_button: TextureButton = %StoreCloseButton
@onready var tab_bar: PanelContainer = %TabBar
@onready var store_home: ScrollContainer = %StoreHome
@onready var anim_player: AnimationPlayer = $AnimationPlayer

@export var reward_popup_scene: PackedScene = preload("res://scenes/RewardPopup.tscn")

func _ready() -> void:
	close_button.pressed.connect(_on_close_pressed)
	tab_bar.tab_changed.connect(_on_tab_changed)
	
	# Listen to congratulations claims to automatically celebrate purchases
	UIManager.reward_claimed.connect(_on_rewards_acquired)
	
	# Intro entrance transition
	if anim_player and anim_player.has_animation("enter_swipe"):
		anim_player.play("enter_swipe")

func switch_to_category(category_id: String) -> void:
	if tab_bar:
		tab_bar.select_tab(category_id, true)

func _on_tab_changed(category_id: String) -> void:
	if store_home:
		store_home.load_category(category_id)
		
	# Update top header text based on visual category design
	match category_id:
		"featured":
			title_label.text = "IMPERIAL TREASURES"
		"bundles":
			title_label.text = "WAR CHEST SPECIALS"
		"crystals":
			title_label.text = "CRYSTAL GEODE VAULT"
		"resources":
			title_label.text = "ALLIANCE EXCHANGE"

func _on_rewards_acquired(items_list: Array[Dictionary]) -> void:
	# Instantiate and initialize reward celebration modal popup
	var popup = UIManager.open_popup(reward_popup_scene)
	if popup:
		popup.init_rewards(items_list)

func _on_close_pressed() -> void:
	if anim_player and anim_player.has_animation("exit_swipe"):
		anim_player.play("exit_swipe")
		await anim_player.animation_finished
	# Cleanly exit the store (e.g. queue_free or yield back to main world)
	queue_free()
