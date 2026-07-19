extends Control

# ==========================================
# CROWNSPIRE MAIL POPUP MASTER CONTROLLER
# ==========================================
# Manages the mailbox tabs, message list population,
# unread states, bulk actions, and detail panels.

@onready var title_label: Label = get_node_or_null("%MailTitleLabel")
@onready var close_button: Button = get_node_or_null("%MailCloseButton")
@onready var tabs_container: HBoxContainer = get_node_or_null("%TabsContainer")
@onready var mail_list_container: VBoxContainer = get_node_or_null("%MailListContainer")
@onready var detail_panel: Control = get_node_or_null("%MailDetailPanel")
@onready var empty_state_label: Label = get_node_or_null("%EmptyStateLabel")
@onready var unread_stats_label: Label = get_node_or_null("%UnreadStatsLabel")

@onready var claim_all_button: Button = get_node_or_null("%ClaimAllButton")
@onready var delete_all_button: Button = get_node_or_null("%DeleteAllButton")

@export var mail_item_scene: PackedScene = preload("res://mail/scenes/MailListItem.tscn")

# Local in-memory mail state database
var categories: Array = []
var mails_db: Array = []

var active_category: String = "all"
var selected_mail_id: String = ""

func _ready() -> void:
	if close_button:
		close_button.pressed.connect(_on_close_pressed)
	if claim_all_button:
		claim_all_button.pressed.connect(_on_claim_all_pressed)
	if delete_all_button:
		delete_all_button.pressed.connect(_on_delete_all_pressed)
		
	# Connect detail actions
	if detail_panel:
		detail_panel.visible = false
		if detail_panel.has_signal("claim_clicked"):
			detail_panel.connect("claim_clicked", _on_detail_claim_pressed)
		if detail_panel.has_signal("delete_clicked"):
			detail_panel.connect("delete_clicked", _on_detail_delete_pressed)
		if detail_panel.has_signal("close_clicked"):
			detail_panel.connect("close_clicked", _on_detail_close_pressed)

	# Load local JSON databases
	_load_databases()
	
	# Render elements
	_setup_category_tabs()
	select_category("all")
	_update_stats_display()

func _load_databases() -> void:
	categories = _load_json_file("res://mail/data/mail_categories.json")
	
	# Attempt fallback to central database if the global MailManager autoload is available
	var global_mail_mgr = get_node_or_null("/root/MailManager")
	if global_mail_mgr and "mails_db" in global_mail_mgr:
		mails_db = global_mail_mgr.mails_db
	else:
		mails_db = _load_json_file("res://mail/data/sample_mail.json")

func _load_json_file(path: String) -> Array:
	if not FileAccess.file_exists(path):
		print_debug("Mail Database missing: ", path)
		return []
		
	var file = FileAccess.open(path, FileAccess.READ)
	var content = file.get_as_text()
	file.close()
	
	var json = JSON.new()
	var error = json.parse(content)
	if error == OK:
		if typeof(json.data) == TYPE_ARRAY:
			return json.data
	else:
		print_debug("JSON Parse Error in ", path, " Line: ", json.get_error_line(), " - ", json.get_error_message())
	return []

func _setup_category_tabs() -> void:
	if not tabs_container:
		return
		
	# Clear layout placeholders
	for child in tabs_container.get_children():
		child.queue_free()
		
	for cat in categories:
		var btn = Button.new()
		var unread = _get_unread_count_by_category(cat.get("id"))
		btn.text = "%s %s" % [cat.get("icon", ""), cat.get("name", "Category").to_upper()]
		btn.name = cat.get("id", "cat")
		btn.custom_minimum_size = Vector2(140, 45)
		btn.pressed.connect(func(): select_category(cat.get("id")))
		tabs_container.add_child(btn)

func select_category(category_id: String) -> void:
	active_category = category_id
	
	# Update Title
	if title_label:
		title_label.text = category_id.to_upper() + " INBOX"
		
	# Highlight active button
	if tabs_container:
		for btn in tabs_container.get_children():
			if btn is Button:
				if btn.name == category_id:
					btn.modulate = Color(0.0, 0.82, 1.0) # Active Blue Glow
				else:
					btn.modulate = Color(1, 1, 1)
					
	_populate_mail_list()
	_update_stats_display()

func _populate_mail_list() -> void:
	if not mail_list_container:
		return
		
	# Clear layout list
	for child in mail_list_container.get_children():
		child.queue_free()
		
	var filtered_mails = _get_filtered_mails()
	
	if filtered_mails.is_empty():
		if empty_state_label:
			empty_state_label.text = "No mail items found in " + active_category.capitalize() + "."
			empty_state_label.visible = true
	else:
		if empty_state_label:
			empty_state_label.visible = false
			
		for mail in filtered_mails:
			if not mail_item_scene:
				continue
				
			var card = mail_item_scene.instantiate()
			mail_list_container.add_child(card)
			card.init_item(mail)
			
			if card.has_signal("item_selected"):
				card.connect("item_selected", _on_mail_selected)

func _get_filtered_mails() -> Array:
	var result = []
	for mail in mails_db:
		if active_category == "all" or mail.get("category_id") == active_category:
			result.append(mail)
	return result

func _get_unread_count_by_category(category_id: String) -> int:
	var count = 0
	for mail in mails_db:
		if not mail.get("read", false):
			if category_id == "all" or mail.get("category_id") == category_id:
				count += 1
	return count

func _update_stats_display() -> void:
	var total_unread = _get_unread_count_by_category("all")
	if unread_stats_label:
		unread_stats_label.text = "Citadel Inbox: %d Unread Messages" % total_unread
		
	# Update category tab badges (updating texts dynamically)
	if tabs_container:
		for btn in tabs_container.get_children():
			if btn is Button:
				var cat_id = btn.name
				var unread_count = _get_unread_count_by_category(cat_id)
				var cat_data = null
				for c in categories:
					if c.get("id") == cat_id:
						cat_data = c
						break
				if cat_data:
					if unread_count > 0:
						btn.text = "%s %s (%d)" % [cat_data.get("icon", ""), cat_data.get("name", "").to_upper(), unread_count]
					else:
						btn.text = "%s %s" % [cat_data.get("icon", ""), cat_data.get("name", "").to_upper()]

	# Manage bulk buttons states
	var has_unclaimed = false
	var has_mails = false
	for mail in _get_filtered_mails():
		has_mails = true
		if mail.get("attachments", []).size() > 0 and not mail.get("claimed", false):
			has_unclaimed = true
			
	if claim_all_button:
		claim_all_button.disabled = not has_unclaimed
	if delete_all_button:
		delete_all_button.disabled = not has_mails

# --- INTERACTION LISTENERS ---

func _on_mail_selected(mail_data: Dictionary) -> void:
	selected_mail_id = mail_data.get("id", "")
	
	# Mark as Read
	for mail in mails_db:
		if mail.get("id") == selected_mail_id:
			mail["read"] = true
			break
			
	# Update details panel
	if detail_panel:
		detail_panel.visible = true
		if detail_panel.has_method("display_mail"):
			detail_panel.display_mail(mail_data)
			
	_populate_mail_list()
	_update_stats_display()
	
	# Push notification updates if global managers exist
	var global_mail_mgr = get_node_or_null("/root/MailManager")
	if global_mail_mgr and global_mail_mgr.has_method("mark_as_read"):
		global_mail_mgr.mark_as_read(selected_mail_id)

func _on_detail_claim_pressed(mail_id: String) -> void:
	# Update data status
	for mail in mails_db:
		if mail.get("id") == mail_id:
			mail["claimed"] = true
			mail["read"] = true
			
			# Dispatch items to player inventory/currency if exists
			var attachments = mail.get("attachments", [])
			var global_ui = get_node_or_null("/root/UIManager")
			if global_ui:
				for att in attachments:
					var item_type = att.get("type", "")
					var qty = att.get("quantity", 0)
					if global_ui.has_method("_add_raw_currency"):
						global_ui._add_raw_currency(item_type, qty)
			break
			
	if detail_panel and detail_panel.visible:
		# Find the updated mail representation and refresh view
		for mail in mails_db:
			if mail.get("id") == mail_id:
				detail_panel.display_mail(mail)
				break
				
	_populate_mail_list()
	_update_stats_display()

func _on_detail_delete_pressed(mail_id: String) -> void:
	# Delete mail
	var index_to_remove = -1
	for i in range(mails_db.size()):
		if mails_db[i].get("id") == mail_id:
			index_to_remove = i
			break
			
	if index_to_remove != -1:
		mails_db.remove_at(index_to_remove)
		
	# Hide detail panel if deleting active
	if selected_mail_id == mail_id:
		selected_mail_id = ""
		if detail_panel:
			detail_panel.visible = false
			
	_populate_mail_list()
	_update_stats_display()

func _on_detail_close_pressed() -> void:
	if detail_panel:
		detail_panel.visible = false

func _on_claim_all_pressed() -> void:
	# Loop and claim rewards
	var global_ui = get_node_or_null("/root/UIManager")
	for mail in mails_db:
		if active_category == "all" or mail.get("category_id") == active_category:
			if mail.get("attachments", []).size() > 0 and not mail.get("claimed", false):
				mail["claimed"] = true
				mail["read"] = true
				
				# Credit accounts
				if global_ui:
					var attachments = mail.get("attachments", [])
					for att in attachments:
						var item_type = att.get("type", "")
						var qty = att.get("quantity", 0)
						if global_ui.has_method("_add_raw_currency"):
							global_ui._add_raw_currency(item_type, qty)
							
	if detail_panel and detail_panel.visible:
		# Update active if loaded
		for mail in mails_db:
			if mail.get("id") == selected_mail_id:
				detail_panel.display_mail(mail)
				break
				
	_populate_mail_list()
	_update_stats_display()

func _on_delete_all_pressed() -> void:
	# Clean list of active category
	var remaining = []
	for mail in mails_db:
		var has_attachments = mail.get("attachments", []).size() > 0
		var claimed = mail.get("claimed", false)
		# Only allow deleting read mails or mails with no un-claimed attachments
		if active_category != "all" and mail.get("category_id") != active_category:
			remaining.append(mail)
		elif has_attachments and not claimed:
			# Preserve mails with unclaimed attachments
			remaining.append(mail)
			
	mails_db = remaining
	selected_mail_id = ""
	if detail_panel:
		detail_panel.visible = false
		
	_populate_mail_list()
	_update_stats_display()

func _on_close_pressed() -> void:
	queue_free()
