extends Control

# ==========================================
# CROWNSPIRE ALLIANCE TERRITORY PANEL
# ==========================================

@onready var fortress_lvl_lbl: Label = $Card/FortressGroup/LvlLabel
@onready var fortress_status_lbl: Label = $Card/FortressGroup/StatusLabel
@onready var towers_placed_lbl: Label = $Card/TowersGroup/PlacedLabel
@onready var cores_deposit_lbl: Label = $Card/CoresGroup/DepositLabel

@onready var btn_manage_fortress: Button = $Card/Actions/BtnFortress
@onready var btn_manage_towers: Button = $Card/Actions/BtnTowers
@onready var coordinates_list: ItemList = $Card/CoordinatesList

const BUILDINGS_POPUP = preload("res://scenes/AllianceBuildingsPanel.tscn")

func _ready() -> void:
	btn_manage_fortress.pressed.connect(func(): _open_buildings_view("bld_fortress"))
	btn_manage_towers.pressed.connect(func(): _open_buildings_view("bld_tower"))
	
	refresh_panel()

func _get_master() -> Control:
	var parent = get_parent()
	while parent and not parent is AllianceScreen:
		parent = parent.get_parent()
	return parent

func refresh_panel() -> void:
	var alliance = UIManager.get_player_alliance()
	if alliance.is_empty(): return
	
	if fortress_lvl_lbl:
		fortress_lvl_lbl.text = "🏰 Alliance Fortress: Level " + str(alliance.get("fortress_level", 1))
	if fortress_status_lbl:
		fortress_status_lbl.text = "Status: Operational (100% Core Energy)"
		
	var towers_placed = int(alliance.get("towers_placed", 0))
	var max_towers = int(alliance.get("max_towers", 20))
	if towers_placed_lbl:
		towers_placed_lbl.text = "🗼 Towers Placed: " + str(towers_placed) + " / " + str(max_towers)
		
	if cores_deposit_lbl:
		cores_deposit_lbl.text = "🔮 Crystallite Core Vault: " + str(alliance.get("crystallite_cores", 0)) + " Cores"
		
	# Populate coordinate vectors
	if coordinates_list:
		coordinates_list.clear()
		coordinates_list.add_item("📍 Fortress Core (X: 350, Y: 420) - BOUNDARY CENTRE")
		for i in range(1, towers_placed + 1):
			coordinates_list.add_item("📍 Tower Node #%d (X: %d, Y: %d) - PROTECTED" % [i, 350 + (i * 15), 420 - (i * 8)])

func _open_buildings_view(bld_id: String) -> void:
	var master_screen = _get_master()
	if master_screen:
		var popup = BUILDINGS_POPUP.instantiate()
		master_screen.show_popup(popup)
		if popup.has_method("focus_building"):
			popup.focus_building(bld_id)
