# ==========================================
# CROWNSPIRE ALLIANCE PERMISSION MANAGER
# ==========================================
extends RefCounted

var ui_manager

# Standardized Ranks Enum (R1 to R5)
enum Rank {
	RECRUIT = 1,
	MEMBER = 2,
	VETERAN = 3,
	OFFICER = 4,
	LEADER = 5
}

func get_rank_name(rank_int: int) -> String:
	match rank_int:
		Rank.LEADER: return "Leader"
		Rank.OFFICER: return "Officer"
		Rank.VETERAN: return "Veteran"
		Rank.MEMBER: return "Member"
		Rank.RECRUIT: return "Recruit"
		_: return "Recruit"

func get_rank_icon_and_name(rank_int: int) -> String:
	match rank_int:
		Rank.LEADER: return "👑 R5 Leader"
		Rank.OFFICER: return "🛡️ R4 Officer"
		Rank.VETERAN: return "⭐ R3 Veteran"
		Rank.MEMBER: return "⚔️ R2 Member"
		Rank.RECRUIT: return "👤 R1 Recruit"
		_: return "👤 R1 Recruit"

func get_rank_color(rank_int: int) -> Color:
	match rank_int:
		Rank.LEADER: return Color("#ffd700") # Gold
		Rank.OFFICER: return Color("#3bf7ad") # Green-cyan
		Rank.VETERAN: return Color("#3a9bf2") # Blue
		Rank.MEMBER: return Color("#a3c2e0") # Silver-blue
		Rank.RECRUIT: return Color("#c4d1db") # Light grey
		_: return Color("#c4d1db")

func has_permission(player_rank: int, permission: String) -> bool:
	match permission.to_lower():
		"invite":
			return player_rank >= Rank.VETERAN # R3 Veteran and above
		"accept_applications", "reject_applications":
			return player_rank >= Rank.OFFICER # R4 Officer and above
		"kick_members":
			return player_rank >= Rank.OFFICER # R4 Officer and above
		"promote", "demote":
			return player_rank >= Rank.OFFICER # R4 Officer and above
		"send_mail":
			return player_rank >= Rank.OFFICER # R4 Officer and above
		"edit_settings":
			return player_rank >= Rank.OFFICER # R4 Officer and above
		"start_research":
			return player_rank >= Rank.VETERAN # R3 Veteran and above
		"spend_resources":
			return player_rank >= Rank.OFFICER # R4 Officer and above
		"purchase_shop":
			return player_rank >= Rank.RECRUIT # Everyone
		"hq_placement":
			return player_rank >= Rank.OFFICER # R4 Officer and above
		"banner_placement":
			return player_rank >= Rank.OFFICER # R4 Officer and above
		"strategic_building":
			return player_rank >= Rank.OFFICER # R4 Officer and above
		_:
			return false
