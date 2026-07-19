extends PanelContainer

# ==========================================
# CROWNSPIRE CAMPAIGN CARD CONTROLLER
# ==========================================
# Handles visual display of a LiveOps seasonal campaign event.
# Incorporates dynamic milestone sliders and claimable chest overlays.

@onready var campaign_title: Label = %CampaignTitle
@onready var campaign_desc: Label = %CampaignDesc
@onready var points_label: Label = %PointsLabel
@onready var progress_bar: ProgressBar = %ProgressBar
@onready var chests_container: HBoxContainer = %ChestsContainer

var campaign_data: Dictionary = {}

func _ready() -> void:
	# Listen to global campaign progression updates
	UIManager.campaign_progress_updated.connect(_on_points_updated)

func init_campaign(data: Dictionary) -> void:
	campaign_data = data
	
	campaign_title.text = data.get("name", "Royal Crusade").to_upper()
	campaign_desc.text = data.get("description", "Complete tasks to earn points.")
	
	_update_milestones_display()

func _update_milestones_display() -> void:
	if campaign_data.is_empty():
		return
		
	var current_pts = campaign_data.get("current_points", 0)
	var milestones = campaign_data.get("milestones", [])
	
	# Determine maximum points to scale progress bar
	var max_points = 100
	if not milestones.is_empty():
		max_points = milestones[-1].get("points_required", 100)
		
	progress_bar.max_value = max_points
	progress_bar.value = current_pts
	
	points_label.text = "%d / %d MARKS" % [current_pts, max_points]
	
	# Populate chest nodes dynamically
	for child in chests_container.get_children():
		child.queue_free()
		
	for idx in range(milestones.size()):
		var milestone = milestones[idx]
		var req = milestone.get("points_required", 0)
		var claimed = milestone.get("claimed", false)
		
		# Create a modular chest button
		var btn := Button.new()
		btn.custom_minimum_size = Vector2(56, 56)
		btn.size_flags_vertical = Control.SIZE_SHRINK_CENTER
		
		# Stylize based on unlock progress
		if claimed:
			btn.text = "CLAIMED"
			btn.disabled = true
			btn.add_theme_color_override("font_color", Color(0.5, 0.5, 0.5))
		elif current_pts >= req:
			btn.text = "CLAIM\n(%d)" % req
			btn.disabled = false
			btn.add_theme_color_override("font_color", Color(1.0, 0.84, 0.0)) # Golden active text
			# Create a small flash animation using Tween
			_apply_glow_tween(btn)
		else:
			btn.text = "LOCKED\n(%d)" % req
			btn.disabled = true
			btn.add_theme_color_override("font_color", Color(0.6, 0.6, 0.7))
			
		btn.pressed.connect(func(): _on_chest_pressed(idx))
		chests_container.add_child(btn)

func _apply_glow_tween(node: Control) -> void:
	var tween = create_tween().set_loops()
	tween.tween_property(node, "modulate", Color(1.2, 1.2, 0.8), 0.6)
	tween.tween_property(node, "modulate", Color(1.0, 1.0, 1.0), 0.6)

func _on_points_updated(campaign_id: String, new_points: int) -> void:
	if campaign_data.get("id", "") == campaign_id:
		campaign_data["current_points"] = new_points
		_update_milestones_display()

func _on_chest_pressed(milestone_idx: int) -> void:
	var campaign_id = campaign_data.get("id", "")
	UIManager.claim_campaign_milestone(campaign_id, milestone_idx)
	
	# Sync updated data state and redraw
	for camp in UIManager.campaigns:
		if camp["id"] == campaign_id:
			campaign_data = camp
			break
	_update_milestones_display()
