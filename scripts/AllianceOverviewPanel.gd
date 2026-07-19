extends Control

# ==========================================
# CROWNSPIRE ALLIANCE OVERVIEW PANEL
# ==========================================

@onready var banner_label: Label = $Card/Banner/Icon
@onready var banner_bg: Panel = $Card/Banner
@onready var name_label: Label = $Card/Info/Name
@onready var tag_label: Label = $Card/Info/Tag
@onready var leader_label: Label = $Card/Info/Leader
@onready var description_label: Label = $Card/Description/Label
@onready var power_val: Label = $Card/Stats/Grid/PowerVal
@onready var members_val: Label = $Card/Stats/Grid/MembersVal
@onready var cores_val: Label = $Card/Stats/Grid/CoresVal
@onready var fortress_val: Label = $Card/Stats/Grid/FortressVal

@onready var chat_btn: Button = $Card/Actions/BtnChat
@onready var members_btn: Button = $Card/Actions/BtnMembers
@onready var help_btn: Button = $Card/Actions/BtnHelp

func _ready() -> void:
	chat_btn.pressed.connect(func(): _get_master().switch_to_tab("chat"))
	members_btn.pressed.connect(func(): _get_master().switch_to_tab("members"))
	help_btn.pressed.connect(func(): _get_master().switch_to_tab("help"))
	
	refresh_panel()

func _get_master() -> Control:
	var parent = get_parent()
	while parent and not parent is AllianceScreen:
		parent = parent.get_parent()
	return parent

func refresh_panel() -> void:
	var alliance = UIManager.get_player_alliance()
	if alliance.is_empty():
		return
		
	if banner_label: banner_label.text = alliance.get("flag_symbol", "🛡️")
	if name_label: name_label.text = alliance.get("name", "Unaligned")
	if tag_label: tag_label.text = "[" + alliance.get("tag", "NONE") + "]"
	if leader_label: leader_label.text = "Leader: " + alliance.get("leader", "Unknown")
	if description_label: description_label.text = alliance.get("description", "")
	
	# Format power
	var power_int = int(alliance.get("power", 0))
	var power_str = ""
	if power_int >= 1000000:
		power_str = "%.2fM" % (float(power_int) / 1000000.0)
	elif power_int >= 1000:
		power_str = "%.1fK" % (float(power_int) / 1000.0)
	else:
		power_str = str(power_int)
		
	if power_val: power_val.text = power_str
	if members_val: members_val.text = str(alliance.get("member_count", 0)) + " / " + str(alliance.get("max_members", 100))
	if cores_val: cores_val.text = str(alliance.get("crystallite_cores", 0)) + " Cores"
	if fortress_val: fortress_val.text = "Lvl " + str(alliance.get("fortress_level", 1))
	
	# Update Help button badge count
	var help_reqs = alliance.get("help_requests", []) as Array
	if help_reqs.size() > 0:
		help_btn.text = "🤝 Give Help (" + str(help_reqs.size()) + ")"
	else:
		help_btn.text = "🤝 Give Help (0)"
