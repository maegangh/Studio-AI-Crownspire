extends Control

# ==========================================
# CROWNSPIRE ALLIANCE GIFT PANEL
# ==========================================

@onready var list_container: VBoxContainer = $ScrollContainer/List
@onready var stats_lbl: Label = $HeaderBar/StatsLabel

func _ready() -> void:
	refresh_panel()

func refresh_panel() -> void:
	for child in list_container.get_children():
		child.queue_free()
		
	var alliance = UIManager.get_player_alliance()
	if alliance.is_empty():
		stats_lbl.text = "No gifts available."
		return
		
	var gifts = alliance.get("gifts", []) as Array
	
	# Filter unclaimed vs claimed
	var unclaimed_count = 0
	for g in gifts:
		if not g.get("claimed", false):
			unclaimed_count += 1
			
	if stats_lbl:
		stats_lbl.text = "Available Amber Loot Chests: " + str(unclaimed_count)
		
	for gift in gifts:
		_build_gift_row(gift)

func _build_gift_row(gift: Dictionary) -> void:
	var row = PanelContainer.new()
	row.custom_minimum_size = Vector2(0, 100)
	
	# Determine styling color based on rarity
	var rarity = int(gift.get("rarity", 1))
	var border_color = "#327bb0" # Standard
	match rarity:
		3: border_color = "#3bf7ad" # Epic (Emerald Green)
		4: border_color = "#ffd700" # Legendary (Gold)
		
	var style_box = StyleBoxFlat.new()
	style_box.bg_color = Color(0.04, 0.1, 0.15, 0.7)
	style_box.border_width_left = 2
	style_box.border_width_top = 2
	style_box.border_width_right = 2
	style_box.border_width_bottom = 2
	style_box.border_color = Color(border_color)
	style_box.corner_radius_top_left = 12
	style_box.corner_radius_top_right = 12
	style_box.corner_radius_bottom_right = 12
	style_box.corner_radius_bottom_left = 12
	row.add_theme_stylebox_override("panel", style_box)
	
	var margin_con = MarginContainer.new()
	margin_con.add_theme_constant_override("margin_left", 15)
	margin_con.add_theme_constant_override("margin_right", 15)
	margin_con.add_theme_constant_override("margin_top", 10)
	margin_con.add_theme_constant_override("margin_bottom", 10)
	row.add_child(margin_con)
	
	var h_layout = HBoxContainer.new()
	h_layout.add_theme_constant_override("separation", 15)
	margin_con.add_child(h_layout)
	
	# Chest Icon
	var icon_lbl = Label.new()
	icon_lbl.text = "🎁" if not gift.get("claimed", false) else "📦"
	icon_lbl.add_theme_font_size_override("font_size", 38)
	icon_lbl.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	h_layout.add_child(icon_lbl)
	
	# Info text
	var v_layout = VBoxContainer.new()
	v_layout.size_flags_horizontal = SIZE_EXPAND_FILL
	v_layout.alignment = BoxContainer.ALIGNMENT_CENTER
	h_layout.add_child(v_layout)
	
	var title_lbl = Label.new()
	title_lbl.text = gift.get("title", "")
	title_lbl.add_theme_font_size_override("font_size", 16)
	v_layout.add_child(title_lbl)
	
	var desc_lbl = Label.new()
	desc_lbl.text = gift.get("description", "")
	desc_lbl.add_theme_colors_override("font_color", Color("#a0b0c0"))
	desc_lbl.add_theme_font_size_override("font_size", 12)
	desc_lbl.autowrap_mode = TextServer.AUTOWRAP_WORD
	v_layout.add_child(desc_lbl)
	
	# List of small rewards inside
	var rewards_lbl = Label.new()
	var rew_text = "Contains: "
	var rews = gift.get("rewards", []) as Array
	for i in range(rews.size()):
		var r = rews[i]
		rew_text += str(r["quantity"]) + "x " + r["name"]
		if i < rews.size() - 1:
			rew_text += ", "
	rewards_lbl.text = rew_text
	rewards_lbl.add_theme_colors_override("font_color", Color("#80c0ff"))
	rewards_lbl.add_theme_font_size_override("font_size", 11)
	v_layout.add_child(rewards_lbl)
	
	# Action button
	var btn = Button.new()
	btn.custom_minimum_size = Vector2(90, 40)
	btn.size_flags_vertical = SIZE_SHRINK_CENTER
	
	if gift.get("claimed", false):
		btn.text = "Claimed"
		btn.disabled = true
	else:
		btn.text = "Claim"
		btn.pressed.connect(func(): _on_claim_pressed(gift))
		
	h_layout.add_child(btn)
	
	list_container.add_child(row)

func _on_claim_pressed(gift: Dictionary) -> void:
	UIManager.claim_alliance_gift(gift["id"])
