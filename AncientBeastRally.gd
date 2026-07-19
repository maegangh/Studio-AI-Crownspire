# ==============================================================================
# Crownspire MMO - Ancient Beast Rally Window Script
# Godot 4.6 / GDScript 2.0 Royal White Marble UI Panel
# ==============================================================================

class_name AncientBeastRally
extends Control

signal rally_started()
signal rally_cancelled()
signal closed()

@onready var title_label: Label = $WhiteMarbleFrame/TitleBar/TitleLabel
@onready var leader_name_label: Label = $WhiteMarbleFrame/MainPanel/Header/LeaderLabel
@onready var timer_label: Label = $WhiteMarbleFrame/MainPanel/Header/TimerLabel
@onready var troop_count_label: Label = $WhiteMarbleFrame/MainPanel/Header/TroopCountLabel
@onready var member_list: VBoxContainer = $WhiteMarbleFrame/MainPanel/RosterSection/ScrollContainer/MemberList
@onready var join_button: Button = $WhiteMarbleFrame/ButtonTray/JoinButton
@onready var cancel_button: Button = $WhiteMarbleFrame/ButtonTray/CancelButton
@onready var close_button: Button = $WhiteMarbleFrame/TitleBar/CloseButton

var active_timer_seconds: float = 300.0 # 5 minutes default
var is_timer_active: bool = true
var is_joined: bool = false
var leader_name: String = ""
var current_troops: int = 450000
var max_troops: int = 2000000

func _ready() -> void:
	close_button.pressed.connect(_on_close_pressed)
	join_button.pressed.connect(_on_join_pressed)
	cancel_button.pressed.connect(_on_cancel_pressed)
	
	_update_roster_ui()

func _process(delta: float) -> void:
	if is_timer_active and active_timer_seconds > 0:
		active_timer_seconds -= delta
		_update_timer_label()
		if active_timer_seconds <= 0:
			is_timer_active = false
			_on_timer_expired()

func setup_rally(leader: String, duration: float, initial_troops: int, max_cap: int) -> void:
	leader_name = leader
	active_timer_seconds = duration
	current_troops = initial_troops
	max_troops = max_cap
	is_timer_active = true
	
	title_label.text = tr("ALLIANCE_RALLY")
	leader_name_label.text = tr("RALLY_LEADER") + ": " + leader_name
	
	_update_timer_label()
	_update_troop_count()

func _update_timer_label() -> void:
	var minutes = int(active_timer_seconds) / 60
	var seconds = int(active_timer_seconds) % 60
	timer_label.text = tr("RALLY_TIME_LEFT") + ": %02d:%02d" % [minutes, seconds]

func _update_troop_count() -> void:
	troop_count_label.text = tr("TOTAL_TROOPS") + ": " + str(current_troops) + " / " + str(max_troops)

func _update_roster_ui() -> void:
	# Clean roster lines
	for child in member_list.get_children():
		child.queue_free()
		
	# Populate with a default simulator roster list
	var mock_members = [
		{"name": leader_name if leader_name != "" else "Lord_Gideon", "troops": 250000, "is_leader": true},
		{"name": "Lady_Eldoria", "troops": 120000, "is_leader": false},
		{"name": "Sir_Galahad", "troops": 80000, "is_leader": false}
	]
	
	if is_joined:
		mock_members.append({"name": "You", "troops": 150000, "is_leader": false})
		
	for mem in mock_members:
		var line = HBoxContainer.new()
		line.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		
		var name_lbl = Label.new()
		name_lbl.text = mem.name
		if mem.is_leader:
			name_lbl.text += " [⭐ " + tr("LEADER") + "]"
			name_lbl.modulate = Color(1.0, 0.85, 0.2)
		name_lbl.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		
		var tr_lbl = Label.new()
		tr_lbl.text = str(mem.troops) + " " + tr("TROOPS_SHORT")
		
		line.add_child(name_lbl)
		line.add_child(tr_lbl)
		member_list.add_child(line)

func _on_join_pressed() -> void:
	if not is_joined:
		is_joined = true
		current_troops += 150000
		_update_troop_count()
		_update_roster_ui()
		emit_signal("rally_started")
		_show_popup_msg(tr("RALLY_JOINED_SUCCESS"))

func _on_cancel_pressed() -> void:
	if is_joined:
		is_joined = false
		current_troops -= 150000
		_update_troop_count()
		_update_roster_ui()
		emit_signal("rally_cancelled")
		_show_popup_msg(tr("RALLY_LEFT_SUCCESS"))
	else:
		emit_signal("rally_cancelled")
		queue_free()

func _on_close_pressed() -> void:
	emit_signal("closed")
	queue_free()

func _on_timer_expired() -> void:
	_show_popup_msg(tr("RALLY_LAUNCHED"))
	queue_free()

func _show_popup_msg(msg: String) -> void:
	print("Crownspire Rally: " + msg)
