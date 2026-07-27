extends PanelContainer

# ==============================================================================
# CROWNSPIRE - SOVEREIGN ASCENSION STARTER OFFER POPUP
# ==============================================================================
# Displays data-driven starter offer details for:
# 1. First-Week Permanent Secondary Construction Queue ($4.99 USD)
# 2. Legendary Hero Starter Pack ($4.99 USD)

signal offer_requested(offer_id: String)
signal offer_closed()

var current_offer_id: String = ""
var offer_config: Dictionary = {}

var title_lbl: Label
var subtitle_lbl: Label
var desc_lbl: Label
var highlights_container: VBoxContainer
var rewards_container: HBoxContainer
var price_btn: Button
var post_intro_lbl: Label
var close_btn: Button

func _init() -> void:
	name = "SovereignAscensionOfferPopup"

func setup_offer(offer_id: String, config_dict: Dictionary) -> void:
	current_offer_id = offer_id
	offer_config = config_dict
	_build_ui()
	_update_offer_display()

func _build_ui() -> void:
	# Clear existing children
	for c in get_children():
		c.queue_free()
		
	custom_minimum_size = Vector2(460, 520)
	
	# Main Stylebox
	var bg_style = StyleBoxFlat.new()
	bg_style.bg_color = Color(0.08, 0.10, 0.14, 0.98)
	bg_style.set_corner_radius_all(12)
	bg_style.border_width_left = 2
	bg_style.border_width_top = 2
	bg_style.border_width_right = 2
	bg_style.border_width_bottom = 2
	bg_style.border_color = Color(0.95, 0.75, 0.15, 0.8) # Sol-Gold Accent
	bg_style.shadow_color = Color(0, 0, 0, 0.6)
	bg_style.shadow_size = 16
	add_theme_stylebox_override("panel", bg_style)
	
	var margin = MarginContainer.new()
	margin.add_theme_constant_override("margin_left", 20)
	margin.add_theme_constant_override("margin_right", 20)
	margin.add_theme_constant_override("margin_top", 18)
	margin.add_theme_constant_override("margin_bottom", 18)
	add_child(margin)
	
	var main_vbox = VBoxContainer.new()
	main_vbox.add_theme_constant_override("separation", 12)
	margin.add_child(main_vbox)
	
	# Header Bar
	var top_hbar = HBoxContainer.new()
	
	var badge = PanelContainer.new()
	var b_style = StyleBoxFlat.new()
	b_style.bg_color = Color(0.95, 0.55, 0.1, 0.85) # Amber Gold
	b_style.set_corner_radius_all(4)
	badge.add_theme_stylebox_override("panel", b_style)
	var badge_lbl = Label.new()
	badge_lbl.text = " ⚡ EXCLUSIVE FIRST-WEEK OFFER "
	badge_lbl.add_theme_font_size_override("font_size", 11)
	badge_lbl.add_theme_color_override("font_color", Color(1, 1, 1))
	badge.add_child(badge_lbl)
	top_hbar.add_child(badge)
	
	var spacer = Control.new()
	spacer.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	top_hbar.add_child(spacer)
	
	close_btn = Button.new()
	close_btn.text = " ✕ "
	close_btn.focus_mode = Control.FOCUS_NONE
	close_btn.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	close_btn.pressed.connect(_on_close_pressed)
	top_hbar.add_child(close_btn)
	
	main_vbox.add_child(top_hbar)
	
	# Title & Subtitle
	title_lbl = Label.new()
	title_lbl.add_theme_font_size_override("font_size", 20)
	title_lbl.add_theme_color_override("font_color", Color(0.98, 0.88, 0.4))
	title_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	main_vbox.add_child(title_lbl)
	
	subtitle_lbl = Label.new()
	subtitle_lbl.add_theme_font_size_override("font_size", 12)
	subtitle_lbl.add_theme_color_override("font_color", Color(0.7, 0.8, 0.9))
	subtitle_lbl.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	main_vbox.add_child(subtitle_lbl)
	
	desc_lbl = Label.new()
	desc_lbl.add_theme_font_size_override("font_size", 12)
	desc_lbl.add_theme_color_override("font_color", Color(0.85, 0.88, 0.92))
	desc_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	main_vbox.add_child(desc_lbl)
	
	# Separator
	var hsep1 = HSeparator.new()
	main_vbox.add_child(hsep1)
	
	# Highlights Box
	var hl_lbl = Label.new()
	hl_lbl.text = "PACKAGE HIGHLIGHTS:"
	hl_lbl.add_theme_font_size_override("font_size", 12)
	hl_lbl.add_theme_color_override("font_color", Color(0.9, 0.7, 0.2))
	main_vbox.add_child(hl_lbl)
	
	highlights_container = VBoxContainer.new()
	highlights_container.add_theme_constant_override("separation", 4)
	main_vbox.add_child(highlights_container)
	
	# Separator
	var hsep2 = HSeparator.new()
	main_vbox.add_child(hsep2)
	
	# Bonus Rewards Box
	var rew_lbl = Label.new()
	rew_lbl.text = "INCLUDED BONUS SUPPLIES:"
	rew_lbl.add_theme_font_size_override("font_size", 12)
	rew_lbl.add_theme_color_override("font_color", Color(0.3, 0.85, 0.4))
	main_vbox.add_child(rew_lbl)
	
	rewards_container = HBoxContainer.new()
	rewards_container.add_theme_constant_override("separation", 8)
	main_vbox.add_child(rewards_container)
	
	# Post-introductory metadata note
	post_intro_lbl = Label.new()
	post_intro_lbl.add_theme_font_size_override("font_size", 10)
	post_intro_lbl.add_theme_color_override("font_color", Color(0.6, 0.65, 0.7))
	post_intro_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	main_vbox.add_child(post_intro_lbl)
	
	# Footer Purchase Button
	price_btn = Button.new()
	price_btn.custom_minimum_size = Vector2(0, 44)
	price_btn.focus_mode = Control.FOCUS_NONE
	price_btn.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	
	var btn_style = StyleBoxFlat.new()
	btn_style.bg_color = Color(0.18, 0.62, 0.28, 1) # Emerald Green
	btn_style.set_corner_radius_all(6)
	price_btn.add_theme_stylebox_override("normal", btn_style)
	price_btn.add_theme_color_override("font_color", Color(1, 1, 1))
	price_btn.add_theme_font_size_override("font_size", 15)
	price_btn.pressed.connect(_on_purchase_pressed)
	main_vbox.add_child(price_btn)

	if OS.is_debug_build():
		var dbg_btn = Button.new()
		dbg_btn.text = "🛠️ [DEBUG ONLY] SIMULATE TRUSTED CONFIRMATION"
		dbg_btn.custom_minimum_size = Vector2(0, 28)
		dbg_btn.focus_mode = Control.FOCUS_NONE
		dbg_btn.add_theme_font_size_override("font_size", 10)
		var dbg_style = StyleBoxFlat.new()
		dbg_style.bg_color = Color(0.7, 0.4, 0.1, 0.9)
		dbg_style.set_corner_radius_all(4)
		dbg_btn.add_theme_stylebox_override("normal", dbg_style)
		dbg_btn.pressed.connect(func():
			var settings_mgr = get_node_or_null("/root/SettingsManager")
			if settings_mgr and settings_mgr.has_method("debug_simulate_purchase_confirmation"):
				settings_mgr.debug_simulate_purchase_confirmation(current_offer_id)
			queue_free()
		)
		main_vbox.add_child(dbg_btn)

func _update_offer_display() -> void:
	if offer_config.is_empty(): return
	
	title_lbl.text = offer_config.get("title", "Special Sovereign Offer")
	subtitle_lbl.text = offer_config.get("subtitle", "First-Week Exclusive")
	desc_lbl.text = offer_config.get("desc", "")
	
	# Highlights
	for c in highlights_container.get_children(): c.queue_free()
	var h_list = offer_config.get("highlights", []) as Array
	for h in h_list:
		var hl_item = Label.new()
		hl_item.text = "  ✓ " + str(h)
		hl_item.add_theme_font_size_override("font_size", 11)
		hl_item.add_theme_color_override("font_color", Color(0.9, 0.95, 1.0))
		highlights_container.add_child(hl_item)
		
	# Rewards
	for c in rewards_container.get_children(): c.queue_free()
	var rew_list = offer_config.get("bonus_rewards", []) as Array
	for r in rew_list:
		var slot = PanelContainer.new()
		var slot_style = StyleBoxFlat.new()
		slot_style.bg_color = Color(0.12, 0.15, 0.2, 0.9)
		slot_style.set_corner_radius_all(6)
		slot.add_theme_stylebox_override("panel", slot_style)
		slot.custom_minimum_size = Vector2(75, 55)
		
		var s_vbox = VBoxContainer.new()
		s_vbox.alignment = BoxContainer.ALIGNMENT_CENTER
		slot.add_child(s_vbox)
		
		var icon_l = Label.new()
		icon_l.text = r.get("icon", "📦") + " x" + str(r.get("amount", 1))
		icon_l.add_theme_font_size_override("font_size", 11)
		icon_l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		s_vbox.add_child(icon_l)
		
		var name_l = Label.new()
		name_l.text = r.get("name", "Reward")
		name_l.add_theme_font_size_override("font_size", 9)
		name_l.add_theme_color_override("font_color", Color(0.7, 0.75, 0.8))
		name_l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		s_vbox.add_child(name_l)
		
		rewards_container.add_child(slot)
		
	# Price metadata
	var intro_price = offer_config.get("introductory_price_usd", offer_config.get("price_usd", 4.99))
	price_btn.text = "UNLOCK FOR $%.2f USD" % intro_price
	
	if current_offer_id == "first_week_permanent_construction_queue":
		post_intro_lbl.text = "Note: First-week introductory rate $4.99 USD for Permanent unlock. Normal post-week options: $4.99 for 30-day pass OR $9.99 for Permanent."
	else:
		post_intro_lbl.text = "Note: One-time introductory new-player offer. Limit 1 per account."

func _on_purchase_pressed() -> void:
	var settings_mgr = get_node_or_null("/root/SettingsManager")
	if settings_mgr:
		settings_mgr.request_purchase(current_offer_id)
		
	offer_requested.emit(current_offer_id)
	queue_free()

func _on_close_pressed() -> void:
	offer_closed.emit()
	queue_free()
