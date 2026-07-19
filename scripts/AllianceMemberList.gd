extends Control

# ==========================================
# CROWNSPIRE ALLIANCE MEMBER LIST PANEL
# ==========================================

@onready var scroll_container: ScrollContainer = $ScrollContainer
@onready var members_list: VBoxContainer = $ScrollContainer/List
@onready var count_label: Label = $HeaderBar/CountLabel
@onready var invite_btn: Button = $HeaderBar/BtnInvite

const MEMBER_CARD_SCENE = preload("res://scenes/AllianceMemberCard.tscn")
const INVITE_POPUP = preload("res://scenes/AllianceInvitePopup.tscn")

func _ready() -> void:
	if invite_btn:
		invite_btn.pressed.connect(_on_invite_pressed)
	refresh_panel()

func _get_master() -> Control:
	var parent = get_parent()
	while parent and not parent is AllianceScreen:
		parent = parent.get_parent()
	return parent

func refresh_panel() -> void:
	# Clear list
	for child in members_list.get_children():
		child.queue_free()
		
	var alliance = UIManager.get_player_alliance()
	if alliance.is_empty():
		return
		
	var members = alliance.get("members", []) as Array
	if count_label:
		count_label.text = "Roster: " + str(members.size()) + " / " + str(alliance.get("max_members", 100))
		
	# Sort members: Leader (4) -> Officers (3) -> Members (1-2)
	var sorted_members = members.duplicate()
	sorted_members.sort_custom(func(a, b):
		return int(a.get("rank", 1)) > int(b.get("rank", 1))
	)
	
	# Check player rank
	var player_rank = 1
	for m in members:
		if m["name"] == UIManager.player_name:
			player_rank = int(m.get("rank", 1))
			break
			
	for m_data in sorted_members:
		var card = MEMBER_CARD_SCENE.instantiate()
		members_list.add_child(card)
		if card.has_method("setup_card"):
			card.setup_card(m_data, player_rank)

func _on_invite_pressed() -> void:
	var master_screen = _get_master()
	if master_screen:
		master_screen.show_popup(INVITE_POPUP.instantiate())
