extends PanelContainer

# ==========================================
# CROWNSPIRE SETTINGS OPTION ROW CONTROLLER
# ==========================================
# A reusable, modular list item representing different setting controls:
# - Toggles (CheckButton)
# - Dropdowns (OptionButton)
# - Action Buttons (Button)
# - Value Sliders (HSlider)

signal value_changed(option_key: String, new_value: Variant)
signal action_triggered(option_key: String)

@onready var option_label: Label = get_node_or_null("%OptionLabel")
@onready var check_btn: CheckButton = get_node_or_null("%CheckButton")
@onready var option_dropdown: OptionButton = get_node_or_null("%OptionDropdown")
@onready var action_btn: Button = get_node_or_null("%ActionButton")
@onready var value_slider: HSlider = get_node_or_null("%ValueSlider")
@onready var slider_val_lbl: Label = get_node_or_null("%SliderValueLabel")

var key: String = ""
var control_type: String = "toggle"

func _ready() -> void:
	# Wire up local signals
	if check_btn:
		check_btn.toggled.connect(_on_toggle_changed)
	if option_dropdown:
		option_dropdown.item_selected.connect(_on_dropdown_selected)
	if action_btn:
		action_btn.pressed.connect(_on_action_pressed)
	if value_slider:
		value_slider.value_changed.connect(_on_slider_value_changed)

func init_toggle(opt_key: String, label_text: String, default_val: bool) -> void:
	key = opt_key
	control_type = "toggle"
	
	if option_label:
		option_label.text = label_text
		
	# Manage visibility
	_set_node_visibility(check_btn, true)
	_set_node_visibility(option_dropdown, false)
	_set_node_visibility(action_btn, false)
	_set_node_visibility(value_slider, false)
	_set_node_visibility(slider_val_lbl, false)
	
	if check_btn:
		check_btn.button_pressed = default_val

func init_dropdown(opt_key: String, label_text: String, options: Array, default_code: String) -> void:
	key = opt_key
	control_type = "dropdown"
	
	if option_label:
		option_label.text = label_text
		
	# Manage visibility
	_set_node_visibility(check_btn, false)
	_set_node_visibility(option_dropdown, true)
	_set_node_visibility(action_btn, false)
	_set_node_visibility(value_slider, false)
	_set_node_visibility(slider_val_lbl, false)
	
	if option_dropdown:
		option_dropdown.clear()
		var select_idx = 0
		for i in range(options.size()):
			var opt = options[i]
			var opt_name = ""
			var opt_code = ""
			if typeof(opt) == TYPE_DICTIONARY:
				opt_name = opt.get("name", "")
				opt_code = opt.get("code", "")
				# Add flag prefix if available
				if opt.has("flag"):
					opt_name = opt.get("flag") + " " + opt_name
			else:
				opt_name = str(opt)
				opt_code = str(opt)
				
			option_dropdown.add_item(opt_name, i)
			option_dropdown.set_item_metadata(i, opt_code)
			
			if opt_code == default_code or opt_name == default_code:
				select_idx = i
				
		if option_dropdown.get_item_count() > 0:
			option_dropdown.select(select_idx)

func init_button(opt_key: String, label_text: String, btn_text: String) -> void:
	key = opt_key
	control_type = "button"
	
	if option_label:
		option_label.text = label_text
		
	# Manage visibility
	_set_node_visibility(check_btn, false)
	_set_node_visibility(option_dropdown, false)
	_set_node_visibility(action_btn, true)
	_set_node_visibility(value_slider, false)
	_set_node_visibility(slider_val_lbl, false)
	
	if action_btn:
		action_btn.text = btn_text

func init_slider(opt_key: String, label_text: String, min_val: float, max_val: float, current_val: float) -> void:
	key = opt_key
	control_type = "slider"
	
	if option_label:
		option_label.text = label_text
		
	# Manage visibility
	_set_node_visibility(check_btn, false)
	_set_node_visibility(option_dropdown, false)
	_set_node_visibility(action_btn, false)
	_set_node_visibility(value_slider, true)
	_set_node_visibility(slider_val_lbl, true)
	
	if value_slider:
		value_slider.min_value = min_val
		value_slider.max_value = max_val
		value_slider.value = current_val
	if slider_val_lbl:
		slider_val_lbl.text = "%d%%" % int(current_val)

func _set_node_visibility(node: Control, is_visible: bool) -> void:
	if node:
		node.visible = is_visible

func _on_toggle_changed(is_pressed: bool) -> void:
	value_changed.emit(key, is_pressed)

func _on_dropdown_selected(index: int) -> void:
	if option_dropdown:
		var code = option_dropdown.get_item_metadata(index)
		value_changed.emit(key, code)

func _on_slider_value_changed(val: float) -> void:
	if slider_val_lbl:
		slider_val_lbl.text = "%d%%" % int(val)
	value_changed.emit(key, val)

func _on_action_pressed() -> void:
	action_triggered.emit(key)
