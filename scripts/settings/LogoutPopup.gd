extends Panel

# ==========================================
# CROWNSPIRE SECURITY LOGOUT POPUP
# ==========================================
# Prevents accidental logouts with security checkpoints. Tapping
# confirm re-initializes the game state.

@onready var cancel_btn: Button = %CancelButton
@onready var confirm_btn: Button = %ConfirmButton

func _ready() -> void:
	cancel_btn.pressed.connect(_on_cancel)
	confirm_btn.pressed.connect(_on_confirm)

func _on_cancel() -> void:
	UIManager.close_popup(self)

func _on_confirm() -> void:
	# Simulate logging out and returning to main city reload
	UIManager.close_popup(self)
	
	# Prompt a temporary notification
	UIManager.reward_claimed.emit([
		{"name": "Profile Safely Locked", "quantity": 1, "rarity": 2}
	])
	
	# Reload player state (equivalent to re-logging)
	UIManager.load_player_state()
