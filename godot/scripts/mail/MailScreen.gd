extends Control
class_name MailScreen

# ==========================================
# CROWNSPIRE MAIL SCREEN CONTROLLER
# ==========================================

@onready var close_btn: Button = %CloseButton
@onready var category_tabs: Control = %MailCategoryTabs
@onready var search_bar: Control = %MailSearchBar
@onready var filter_menu: Control = %MailFilterMenu
@onready var list_panel: Control = %MailListPanel
@onready var detail_panel: Control = %MailDetailPanel
@onready var empty_state: Control = %MailEmptyState

@onready var claim_all_btn: Button = %ClaimAllButton
@onready var delete_read_btn: Button = %DeleteReadButton
@onready var stats_unread_label: Label = %StatsUnreadLabel

@onready var anim_player: AnimationPlayer = $AnimationPlayer

var current_category: String = "all"
var current_filter: String = "all"
var current_search: String = ""
var current_sort: String = "newest"

func _ready() -> void:
	# Initialize the core data engine
	MailManager.initialize_manager()
	
	# Connect local button events
	close_btn.pressed.connect(_on_close_pressed)
	claim_all_btn.pressed.connect(_on_claim_all_pressed)
	delete_read_btn.pressed.connect(_on_delete_read_pressed)
	
	# Connect sub-component events
	category_tabs.category_selected.connect(_on_category_changed)
	search_bar.search_text_changed.connect(_on_search_changed)
	filter_menu.filter_selected.connect(_on_filter_changed)
	filter_menu.sort_selected.connect(_on_sort_changed)
	list_panel.mail_selected.connect(_on_mail_card_clicked)
	
	# Hide detail panel initially
	detail_panel.visible = false
	detail_panel.mail_action_triggered.connect(_on_detail_action_triggered)
	
	# Initial UI population
	_refresh_mail_inbox()
	_update_category_unread_badges()
	
	# Play entering slide/fade-in animation
	if anim_player and anim_player.has_animation("open_bounce"):
		anim_player.play("open_bounce")

func _refresh_mail_inbox() -> void:
	# Fetch sorted, filtered list from data manager
	var mails = MailManager.get_filtered_mails(current_category, current_filter, current_search, current_sort)
	
	# Setup empty state visibility
	if mails.is_empty():
		list_panel.visible = false
		empty_state.visible = true
		empty_state.set_state_description(current_category, current_filter, current_search)
	else:
		list_panel.visible = true
		empty_state.visible = false
		list_panel.populate_list(mails)
		
	# Update inbox unread stats label
	var total_unread = MailManager.get_unread_count("all")
	var category_unread = MailManager.get_unread_count(current_category)
	
	if current_category == "all":
		stats_unread_label.text = "Citadel Inbox: %d Unread Messages" % total_unread
	else:
		var cat_name = current_category.capitalize() + " Mail"
		if current_category == "battle": cat_name = "Battle Reports"
		stats_unread_label.text = "%s: %d Unread" % [cat_name, category_unread]
		
	# Enable/Disable bulk operation buttons dynamically
	_update_bulk_buttons_state()

func _update_category_unread_badges() -> void:
	# Ask sub-component category tabs to fetch and draw unread counts for each category
	category_tabs.update_badges()

func _update_bulk_buttons_state() -> void:
	var current_mails = MailManager.get_mails_by_category(current_category)
	
	var has_unclaimed = false
	var has_read_deleteable = false
	
	for m in current_mails:
		if m.get("attachments", []).size() > 0 and not m.get("claimed", false):
			has_unclaimed = true
		var has_attachments = m.get("attachments", []).size() > 0
		var claimed = m.get("claimed", false)
		if m.get("read", false) and (not has_attachments or claimed):
			has_read_deleteable = true
			
	claim_all_btn.disabled = not has_unclaimed
	delete_read_btn.disabled = not has_read_deleteable

# --- SUB-COMPONENT CALLBACKS ---

func _on_category_changed(category_id: String) -> void:
	current_category = category_id
	_refresh_mail_inbox()
	_update_category_unread_badges()
	# Auto close detail panel on category tab change
	_close_detail_panel()

func _on_search_changed(query: String) -> void:
	current_search = query
	_refresh_mail_inbox()

func _on_filter_changed(filter_type: String) -> void:
	current_filter = filter_type
	_refresh_mail_inbox()

func _on_sort_changed(sort_mode: String) -> void:
	current_sort = sort_mode
	_refresh_mail_inbox()

func _on_mail_card_clicked(mail_data: Dictionary) -> void:
	# Mark as read in DB
	MailManager.mark_as_read(mail_data["id"])
	
	# Update local counts
	_update_category_unread_badges()
	_update_bulk_buttons_state()
	
	# Show detail panel overlay
	detail_panel.display_mail(mail_data)
	detail_panel.visible = true
	
	# Trigger card item to update its read visual state instantly
	list_panel.refresh_card_read_state(mail_data["id"])

# --- POPUP & DETAIL ACTION CALLBACKS ---

func _on_detail_action_triggered(action_name: String, mail_id: String) -> void:
	match action_name:
		"close":
			_close_detail_panel()
		"delete":
			# Confirm deletion
			_show_delete_popup(mail_id)
		"claim":
			_process_claim_single(mail_id)

func _close_detail_panel() -> void:
	detail_panel.visible = false
	_refresh_mail_inbox()

func _process_claim_single(mail_id: String) -> void:
	var claimed_rewards = MailManager.claim_mail_rewards(mail_id)
	if claimed_rewards.size() > 0:
		# Trigger the AAA celebratory reward popup
		_show_reward_popup(claimed_rewards)
		
	_refresh_mail_inbox()
	_update_category_unread_badges()
	_close_detail_panel()

# --- BULK ACTIONS ---

func _on_claim_all_pressed() -> void:
	var claimed_rewards = MailManager.claim_all_available_rewards(current_category)
	if claimed_rewards.size() > 0:
		# Play celebratory rewards animation popup
		_show_reward_popup(claimed_rewards)
		
	_refresh_mail_inbox()
	_update_category_unread_badges()
	_close_detail_panel()

func _on_delete_read_pressed() -> void:
	# Instantiates a confirmation popup
	var delete_popup_scene = preload("res://scenes/mail/MailDeletePopup.tscn")
	var popup = delete_popup_scene.instantiate()
	add_child(popup)
	popup.setup_for_bulk(current_category, func():
		MailManager.delete_all_read_in_category(current_category)
		_refresh_mail_inbox()
		_update_category_unread_badges()
		_close_detail_panel()
	)

func _show_delete_popup(mail_id: String) -> void:
	var delete_popup_scene = preload("res://scenes/mail/MailDeletePopup.tscn")
	var popup = delete_popup_scene.instantiate()
	add_child(popup)
	popup.setup_for_single(mail_id, func():
		MailManager.delete_mail(mail_id)
		_refresh_mail_inbox()
		_update_category_unread_badges()
		_close_detail_panel()
	)

func _show_reward_popup(rewards: Array) -> void:
	var reward_popup_scene = preload("res://scenes/mail/MailRewardPopup.tscn")
	var popup = reward_popup_scene.instantiate()
	add_child(popup)
	popup.display_rewards(rewards)

func _on_close_pressed() -> void:
	# Close this fullpopup using global manager
	if anim_player and anim_player.has_animation("close_fade"):
		anim_player.play("close_fade")
		await anim_player.animation_finished
	UIManager.close_popup(self)
