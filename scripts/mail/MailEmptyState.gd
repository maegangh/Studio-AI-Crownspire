extends Control

# ==========================================
# CROWNSPIRE MAIL EMPTY STATE CONTROLLER
# ==========================================

@onready var icon_label: Label = $CenterContainer/VBoxContainer/IconLabel
@onready var title_label: Label = $CenterContainer/VBoxContainer/TitleLabel
@onready var desc_label: Label = $CenterContainer/VBoxContainer/DescLabel

func set_state_description(category_id: String, filter_type: String, search_query: String) -> void:
	if search_query != "":
		icon_label.text = "🔍"
		title_label.text = "No Scrolls Found"
		desc_label.text = "Our scholars searched the library but found no correspondence matching:\n\"%s\"" % search_query
		return
		
	if filter_type == "unread":
		icon_label.text = "📨"
		title_label.text = "No Unread Mail"
		desc_label.text = "You are all caught up! There are no unread dispatches in this category."
		return
		
	if filter_type == "rewards":
		icon_label.text = "🎁"
		title_label.text = "No Unclaimed Rewards"
		desc_label.text = "All tournament chests and system care packages have been successfully claimed."
		return
		
	# Category specific empty state messaging
	match category_id:
		"system":
			icon_label.text = "⚙️"
			title_label.text = "Inbox Quiet"
			desc_label.text = "The Citadel High Council has issued no official system announcements today."
		"battle":
			icon_label.text = "🛡️"
			title_label.text = "Peaceful Borders"
			desc_label.text = "Your legions are safe in their barracks. No combat reports or scouting drafts logged."
		"alliance":
			icon_label.text = "🤝"
			title_label.text = "No Alliance Bulletins"
			desc_label.text = "No rally declarations or alliance distributions have been routed to your Citadel."
		"event":
			icon_label.text = "🏆"
			title_label.text = "No Tournament Logs"
			desc_label.text = "No tournament placements or live-ops event distributions are currently active."
		_:
			icon_label.text = "📭"
			title_label.text = "Citadel Inbox Empty"
			desc_label.text = "Your mail scrolls are clear. Return to building your empire!"
