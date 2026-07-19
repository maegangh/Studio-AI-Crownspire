extends Control

# ==========================================
# CROWNSPIRE MAIL LIST PANEL CONTROLLER
# ==========================================

signal mail_selected(mail_data: Dictionary)

@onready var scroll_container: ScrollContainer = $ScrollContainer
@onready var list_container: VBoxContainer = $ScrollContainer/VBoxContainer

const CARD_SCENE = preload("res://scenes/mail/MailCard.tscn")

func populate_list(mails: Array) -> void:
	# Clear previous list
	for child in list_container.get_children():
		child.queue_free()
		
	# Instantiate and bind cards
	for i in range(mails.size()):
		var m_data = mails[i]
		var card = CARD_SCENE.instantiate()
		list_container.add_child(card)
		
		card.setup_card(m_data)
		card.card_pressed.connect(func(): mail_selected.emit(m_data))
		
		# Stagger card load entrance animations for highly polished cinematic rendering
		card.modulate.a = 0.0
		card.scale = Vector2(0.95, 0.95)
		var tween = create_tween().set_parallel(true)
		tween.tween_property(card, "modulate:a", 1.0, 0.15).set_delay(i * 0.03)
		tween.tween_property(card, "scale", Vector2.ONE, 0.15).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT).set_delay(i * 0.03)

# Instantly updates visual read state for a specific card on the list
func refresh_card_read_state(mail_id: String) -> void:
	for child in list_container.get_children():
		if child.has_method("get_mail_id") and child.get_mail_id() == mail_id:
			child.mark_as_read_visually()
			break
