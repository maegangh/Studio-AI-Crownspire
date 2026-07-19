extends Control

# ==========================================
# CROWNSPIRE MAIL CATEGORY TABS CONTROLLER
# ==========================================

signal category_selected(category_id: String)

@onready var tab_all: Button = %TabAll
@onready var tab_system: Button = %TabSystem
@onready var tab_battle: Button = %TabBattle
@onready var tab_alliance: Button = %TabAlliance
@onready var tab_event: Button = %TabEvent

@onready var badge_all: Control = %BadgeAll
@onready var badge_system: Control = %BadgeSystem
@onready var badge_battle: Control = %BadgeBattle
@onready var badge_alliance: Control = %BadgeAlliance
@onready var badge_event: Control = %BadgeEvent

var active_category_id: String = "all"
var buttons_map := {}

func _ready() -> void:
	# Populate buttons map for streamlined highlighting
	buttons_map = {
		"all": tab_all,
		"system": tab_system,
		"battle": tab_battle,
		"alliance": tab_alliance,
		"event": tab_event
	}
	
	# Connect pressed events
	tab_all.pressed.connect(func(): _on_tab_pressed("all"))
	tab_system.pressed.connect(func(): _on_tab_pressed("system"))
	tab_battle.pressed.connect(func(): _on_tab_pressed("battle"))
	tab_alliance.pressed.connect(func(): _on_tab_pressed("alliance"))
	tab_event.pressed.connect(func(): _on_tab_pressed("event"))
	
	# Set default visual state
	_update_highlights()

func _on_tab_pressed(category_id: String) -> void:
	if active_category_id == category_id:
		return
		
	active_category_id = category_id
	_update_highlights()
	category_selected.emit(category_id)

func _update_highlights() -> void:
	for id in buttons_map:
		var btn = buttons_map[id] as Button
		if id == active_category_id:
			btn.modulate = Color(1.2, 1.1, 0.9, 1.0) # Warm gold glow highlight
			# Expand scale slightly for elegant tactile feel
			var tween = create_tween()
			tween.tween_property(btn, "custom_minimum_size:y", 52.0, 0.1)
		else:
			btn.modulate = Color(0.8, 0.8, 0.85, 0.8) # Cool slate-dimmed
			var tween = create_tween()
			tween.tween_property(btn, "custom_minimum_size:y", 46.0, 0.1)

# Fetches and draws unread counts for each category
func update_badges() -> void:
	_update_badge_visual(badge_all, MailManager.get_unread_count("all"))
	_update_badge_visual(badge_system, MailManager.get_unread_count("system"))
	_update_badge_visual(badge_battle, MailManager.get_unread_count("battle"))
	_update_badge_visual(badge_alliance, MailManager.get_unread_count("alliance"))
	_update_badge_visual(badge_event, MailManager.get_unread_count("event"))

func _update_badge_visual(badge: Control, count: int) -> void:
	if not badge:
		return
	if count > 0:
		badge.visible = true
		badge.set_badge_count(count)
	else:
		badge.visible = false
