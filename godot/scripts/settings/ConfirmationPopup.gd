extends Panel

# ==========================================
# CROWNSPIRE DIALOGUE CONFIRMATION POPUP
# ==========================================
# Reusable popup overlay for warnings, announcements, terms notices,
# and redeem codes congratulatory receipts.

@onready var title_lbl: Label = %TitleLabel
@onready var body_lbl: Label = %BodyLabel
@onready var ok_btn: Button = %OkButton

func _ready() -> void:
	ok_btn.pressed.connect(_on_ok)

func setup(title_str: String, body_str: String) -> void:
	# Ensure nodes are ready
	if not is_inside_tree():
		await ready
	title_lbl.text = title_str.to_upper()
	body_lbl.text = body_str

func _on_ok() -> void:
	UIManager.close_popup(self)
