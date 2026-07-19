extends PanelContainer

# ==========================================
# CROWNSPIRE HUD NOTIFICATION BADGE
# ==========================================
# Manages the visual state of a notification badge bubble.
# Automatically hides itself if the badge count is 0 or less.

@onready var count_label: Label = get_node_or_null("%CountLabel")

var count: int = 0

func _ready() -> void:
	update_badge(count)

func update_badge(new_count: int) -> void:
	count = new_count
	if count <= 0:
		visible = false
	else:
		visible = true
		if count_label:
			if count > 99:
				count_label.text = "99+"
			else:
				count_label.text = str(count)
