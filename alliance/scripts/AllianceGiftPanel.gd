extends PanelContainer

# ==========================================
# CROWNSPIRE ALLIANCE GIFT PANEL CONTROLLER
# ==========================================
# Displays a single alliance gift, its rewards, and manages the claim pipeline.

signal claim_requested(gift_id: String)

@onready var title_lbl: Label = get_node_or_null("%GiftTitleLabel")
@onready var desc_lbl: Label = get_node_or_null("%GiftDescLabel")
@onready var expires_lbl: Label = get_node_or_null("%ExpiresLabel")
@onready var claim_btn: Button = get_node_or_null("%ClaimGiftButton")
@onready var rewards_lbl: Label = get_node_or_null("%GiftRewardsLabel")

var gift_data: Dictionary = {}

func _ready() -> void:
	if claim_btn:
		claim_btn.pressed.connect(_on_claim_pressed)

func init_gift(data: Dictionary) -> void:
	gift_data = data
	
	if title_lbl:
		title_lbl.text = data.get("title", "Alliance Treasure Chest")
	if desc_lbl:
		desc_lbl.text = data.get("description", "A supportive reward shared by alliance actions.")
		
	# Format rewards nicely
	if rewards_lbl:
		var reward_list = data.get("rewards", [])
		var reward_texts = []
		for r in reward_list:
			var icon = r.get("icon", "🎁")
			var name_str = r.get("name", "Item")
			var qty = int(r.get("quantity", 1))
			reward_texts.append("%s %s x%d" % [icon, name_str, qty])
		rewards_lbl.text = "REWARDS: " + ", ".join(reward_texts)
		
	# Claimed status check
	var is_claimed = data.get("claimed", false)
	if claim_btn:
		if is_claimed:
			claim_btn.text = "CLAIMED"
			claim_btn.disabled = true
			claim_btn.modulate = Color(0.5, 0.5, 0.5)
		else:
			claim_btn.text = "CLAIM"
			claim_btn.disabled = false
			claim_btn.modulate = Color(1.0, 0.85, 0.1) # Golden claim look
			
	# Format expiration
	if expires_lbl:
		var secs = int(data.get("expires_in_secs", 86400))
		var hrs = secs / 3600
		if hrs > 24:
			expires_lbl.text = "Expires in %d days" % (hrs / 24)
		else:
			expires_lbl.text = "Expires in %dh" % hrs

func _on_claim_pressed() -> void:
	var gift_id = gift_data.get("id", "")
	claim_requested.emit(gift_id)
	
	# Local update response
	gift_data["claimed"] = true
	if claim_btn:
		claim_btn.text = "CLAIMED"
		claim_btn.disabled = true
		claim_btn.modulate = Color(0.5, 0.5, 0.5)
