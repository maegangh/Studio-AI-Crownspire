extends ScrollContainer

# ==========================================
# CROWNSPIRE STORE SUB-VIEW CONTROLLER
# ==========================================
# Main dynamic container representing active catalog pages.
# Instantiates ItemCards, BundleCards, FeaturedBanners, and FlashOffers.

@onready var content_layout: VBoxContainer = %ContentLayout
@onready var item_grid: GridContainer = %ItemGrid

@export var item_card_scene: PackedScene = preload("res://scenes/StoreItemCard.tscn")
@export var bundle_card_scene: PackedScene = preload("res://scenes/BundleCard.tscn")
@export var featured_banner_scene: PackedScene = preload("res://scenes/FeaturedBanner.tscn")
@export var limited_offer_scene: PackedScene = preload("res://scenes/LimitedOfferCard.tscn")

var active_category_id: String = "featured"

func _ready() -> void:
	load_category("featured")

func load_category(category_id: String) -> void:
	active_category_id = category_id
	
	# Clear previous contents
	for child in content_layout.get_children():
		# Preserve standard grid container but clear items inside
		if child == item_grid:
			for item_node in item_grid.get_children():
				item_node.queue_free()
		else:
			child.queue_free()
			
	item_grid.visible = false
	
	match category_id:
		"featured":
			_build_featured_page()
		"bundles":
			_build_bundles_page()
		"crystals":
			_build_direct_items_page("crystals", 2)
		"resources":
			_build_direct_items_page("resources", 2)

func _build_featured_page() -> void:
	# 1. FeaturedBanner (Top Slideshow)
	var banner = featured_banner_scene.instantiate()
	content_layout.add_child(banner)
	content_layout.move_child(banner, 0)
	
	# 2. Flash Limited Offers Headline Label
	var flash_label := Label.new()
	flash_label.text = "TEMPORAL FLASH SALES"
	flash_label.add_theme_color_override("font_color", Color(0.93, 0.26, 0.26)) # Danger Red
	flash_label.add_theme_font_size_override("font_size", 14)
	content_layout.add_child(flash_label)
	
	# 3. Flash Offers Horizontal Grid
	var flash_scroll := ScrollContainer.new()
	flash_scroll.custom_minimum_size = Vector2(0, 230)
	flash_scroll.vertical_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	var flash_hbox := HBoxContainer.new()
	flash_hbox.theme_override_constants/separation = 12
	flash_scroll.add_child(flash_hbox)
	content_layout.add_child(flash_scroll)
	
	var offers = UIManager.get_all_offers()
	for offer in offers:
		var card = limited_offer_scene.instantiate()
		flash_hbox.add_child(card)
		card.init_offer(offer)
		card.offer_pressed.connect(_on_item_selected)
		
	# 4. Special Bundles Headline Label
	var bundles_label := Label.new()
	bundles_label.text = "REGAL progression BUNDLES"
	bundles_label.add_theme_color_override("font_color", Color(1.0, 0.84, 0.0)) # Sovereign gold
	bundles_label.add_theme_font_size_override("font_size", 14)
	content_layout.add_child(bundles_label)
	
	# 5. Bundles Stack
	var bundles = UIManager.get_all_bundles()
	for bundle in bundles:
		var b_card = bundle_card_scene.instantiate()
		content_layout.add_child(b_card)
		b_card.init_bundle(bundle)
		b_card.bundle_pressed.connect(_on_item_selected)

func _build_bundles_page() -> void:
	var bundles_label := Label.new()
	bundles_label.text = "ALL ACTIVE PROMOTIONS"
	bundles_label.add_theme_color_override("font_color", Color(1.0, 0.84, 0.0))
	bundles_label.add_theme_font_size_override("font_size", 14)
	content_layout.add_child(bundles_label)
	
	var bundles = UIManager.get_all_bundles()
	for bundle in bundles:
		var b_card = bundle_card_scene.instantiate()
		content_layout.add_child(b_card)
		b_card.init_bundle(bundle)
		b_card.bundle_pressed.connect(_on_item_selected)

func _build_direct_items_page(category_id: String, columns_count: int) -> void:
	var title_label := Label.new()
	title_label.text = "%s PRODUCTS" % category_id.to_upper()
	title_label.add_theme_color_override("font_color", Color(0.0, 0.82, 1.0)) # Cyan
	title_label.add_theme_font_size_override("font_size", 14)
	content_layout.add_child(title_label)
	content_layout.move_child(title_label, 0)
	
	item_grid.columns = columns_count
	item_grid.visible = true
	
	# Reparent item grid to bottom of content stack
	content_layout.move_child(item_grid, content_layout.get_child_count() - 1)
	
	var items = UIManager.get_items_by_category(category_id)
	for item in items:
		var card = item_card_scene.instantiate()
		item_grid.add_child(card)
		card.init_card(item)
		card.card_pressed.connect(_on_item_selected)

func _on_item_selected(item_data: Dictionary) -> void:
	# Instantiate purchase confirmation popup via global layout manager
	var popup_scene = preload("res://scenes/PurchasePopup.tscn")
	var popup = UIManager.open_popup(popup_scene)
	if popup:
		var name_str = item_data.get("name", "Royal Loot")
		var desc_str = item_data.get("description", item_data.get("tag_line", ""))
		var icon_p = item_data.get("icon_path", item_data.get("icon", ""))
		var cost_curr = item_data.get("cost_currency", "royal_crystal")
		if item_data.has("cost_usd"):
			cost_curr = "usd"
		var cost_amt = item_data.get("cost_amount", item_data.get("cost_usd", 0.0))
		var rarity = item_data.get("rarity", 2)
		
		popup.init_popup(
			item_data["id"],
			name_str,
			desc_str,
			icon_p,
			cost_curr,
			cost_amt,
			rarity
		)
