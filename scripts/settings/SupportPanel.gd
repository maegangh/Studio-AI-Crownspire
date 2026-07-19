extends VBoxContainer

# ==========================================
# CROWNSPIRE CUSTOMER SUPPORT PANEL
# ==========================================
# Facilitates in-game feedback submissions, help desk lookup simulations,
# and direct support ticket dispatches.

@onready var ticket_category: OptionButton = %TicketCategory
@onready var ticket_body: TextEdit = %TicketBody
@onready var submit_btn: Button = %SubmitBtn
@onready var kb_search: LineEdit = %KbSearch
@onready var kb_results: VBoxContainer = %KbResults

var help_articles: Array = [
	{"title": "How do I upgrade my Citadel?", "snippet": "Citadel upgrades require food, wood, and stone, as well as level-requirements on your City Walls."},
	{"title": "Where do I find VIP Points?", "snippet": "Earn VIP points daily by logging in consecutively, or purchase premium bundles in the Store."},
	{"title": "How do I join an Alliance rally?", "snippet": "Go to Alliance > Rally tab, select an active war campaign, and dispatch your marching troops."},
	{"title": "Alchemical Vault entry tickets", "snippet": "Tickets recharge automatically every 12 hours, or can be acquired using Aurora Crystals."}
]

func _ready() -> void:
	ticket_category.clear()
	ticket_category.add_item("Select Category...", 0)
	ticket_category.add_item("Bug Report", 1)
	ticket_category.add_item("Billing & Purchase Issue", 2)
	ticket_category.add_item("Account Recovery", 3)
	ticket_category.add_item("Feedback & Suggestion", 4)
	
	submit_btn.pressed.connect(_on_submit_ticket)
	kb_search.text_changed.connect(_on_search_changed)
	_render_kb_results("")

func _on_submit_ticket() -> void:
	if ticket_category.selected == 0:
		_show_alert("Sovereign Scribes: Please select a query category!")
		return
		
	if ticket_body.text.strip_edges().length() < 10:
		_show_alert("Sovereign Scribes: Description is too brief (min 10 characters)!")
		return
		
	# Submit successfully
	var cat = ticket_category.get_item_text(ticket_category.selected)
	ticket_body.text = ""
	ticket_category.select(0)
	
	var conf_scene = load("res://scenes/settings/ConfirmationPopup.tscn")
	if conf_scene:
		var popup = UIManager.open_popup(conf_scene)
		if popup:
			popup.setup("TICKET SENT", "Your scroll regarding '%s' has been received by the Grand Scribes. We will answer your summons shortly!" % cat)

func _on_search_changed(new_text: String) -> void:
	_render_kb_results(new_text)

func _render_kb_results(query: String) -> void:
	# Clear previous
	for child in kb_results.get_children():
		child.queue_free()
		
	var clean_query = query.strip_edges().to_lower()
	var matches = 0
	
	for art in help_articles:
		if clean_query.is_empty() or clean_query in art["title"].to_lower() or clean_query in art["snippet"].to_lower():
			var card = PanelContainer.new()
			card.custom_minimum_size = Vector2(0, 70)
			
			var vbox = VBoxContainer.new()
			vbox.theme_override_constants/separation = 4
			
			# Add inner margins
			var margin = MarginContainer.new()
			margin.theme_override_constants/margin_left = 10
			margin.theme_override_constants/margin_top = 8
			margin.theme_override_constants/margin_right = 10
			margin.theme_override_constants/margin_bottom = 8
			
			var title = Label.new()
			title.text = "📖 " + art["title"]
			title.theme_override_font_sizes/font_size = 12
			title.modulate = Color(1.0, 0.85, 0.55, 1.0) # Gold
			
			var snippet = Label.new()
			snippet.text = art["snippet"]
			snippet.theme_override_font_sizes/font_size = 10
			snippet.autowrap_mode = TextServer.AUTOWRAP_WORD
			snippet.modulate = Color(0.7, 0.75, 0.8, 1.0)
			
			vbox.add_child(title)
			vbox.add_child(snippet)
			margin.add_child(vbox)
			card.add_child(margin)
			kb_results.add_child(card)
			matches += 1
			
	if matches == 0:
		var empty = Label.new()
		empty.text = "No scrolls matching your search query were found."
		empty.theme_override_font_sizes/font_size = 11
		empty.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		empty.modulate = Color(0.5, 0.5, 0.5)
		kb_results.add_child(empty)

func _show_alert(msg: String) -> void:
	UIManager.reward_claimed.emit([
		{"name": msg, "quantity": 1, "rarity": 1}
	])
