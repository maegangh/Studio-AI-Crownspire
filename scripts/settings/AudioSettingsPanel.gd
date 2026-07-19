extends VBoxContainer

# ==========================================
# CROWNSPIRE AUDIO SETTINGS PANEL
# ==========================================
# Controls master, music, sfx volume sliders, and UI sounds toggles.
# Real-time applies decibel updates via AudioServer.

@onready var master_slider: HSlider = %MasterSlider
@onready var master_percent: Label = %MasterPercent
@onready var music_slider: HSlider = %MusicSlider
@onready var music_percent: Label = %MusicPercent
@onready var sfx_slider: HSlider = %SfxSlider
@onready var sfx_percent: Label = %SfxPercent
@onready var ui_sounds_check: CheckButton = %UiSoundsCheck

func _ready() -> void:
	# Load current settings
	var audio_conf = SettingsManager.settings["audio"]
	master_slider.value = audio_conf["master_volume"]
	music_slider.value = audio_conf["music_volume"]
	sfx_slider.value = audio_conf["sfx_volume"]
	ui_sounds_check.button_pressed = audio_conf["ui_sounds"]
	
	_update_labels()
	
	# Connect signals
	master_slider.value_changed.connect(_on_master_changed)
	music_slider.value_changed.connect(_on_music_changed)
	sfx_slider.value_changed.connect(_on_sfx_changed)
	ui_sounds_check.toggled.connect(_on_ui_sounds_toggled)

func _update_labels() -> void:
	master_percent.text = "%d%%" % master_slider.value
	music_percent.text = "%d%%" % music_slider.value
	sfx_percent.text = "%d%%" % sfx_slider.value

func _on_master_changed(value: float) -> void:
	SettingsManager.settings["audio"]["master_volume"] = value
	_update_labels()
	SettingsManager.apply_audio_settings()
	SettingsManager.save_settings()

func _on_music_changed(value: float) -> void:
	SettingsManager.settings["audio"]["music_volume"] = value
	_update_labels()
	SettingsManager.apply_audio_settings()
	SettingsManager.save_settings()

func _on_sfx_changed(value: float) -> void:
	SettingsManager.settings["audio"]["sfx_volume"] = value
	_update_labels()
	SettingsManager.apply_audio_settings()
	SettingsManager.save_settings()

func _on_ui_sounds_toggled(pressed: bool) -> void:
	SettingsManager.settings["audio"]["ui_sounds"] = pressed
	SettingsManager.save_settings()
