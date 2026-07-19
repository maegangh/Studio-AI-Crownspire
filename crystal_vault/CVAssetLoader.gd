#============================================================================
# CVAssetLoader.gd - Crystal Vault Multi-Threaded Asset Loader (Godot 4.4 Autoload)
# Simulates asynchronous, non-blocking pre-caching of hefty battle boards/VFX.
#============================================================================
extends Node

signal asset_loaded(path: String, resource: Resource)
signal load_progress_updated(path: String, pct: float)
signal queue_empty

# Tracks current loading list
var _load_queue: Dictionary = {}

func _process(_delta: float) -> void:
	if _load_queue.is_empty():
		return
		
	var finished_keys: Array[String] = []
	
	# Check progress of all active threaded requests
	for path in _load_queue.keys():
		var progress: Array = []
		var status := ResourceLoader.load_threaded_get_status(path, progress)
		
		match status:
			ResourceLoader.THREAD_LOAD_IN_PROGRESS:
				var pct: float = progress[0] * 100.0
				load_progress_updated.emit(path, pct)
				
			ResourceLoader.THREAD_LOAD_LOADED:
				var resource := ResourceLoader.load_threaded_get(path)
				finished_keys.append(path)
				asset_loaded.emit(path, resource)
				print("[CVAssetLoader] Asset loaded via threads: %s" % path)
				
			ResourceLoader.THREAD_LOAD_FAILED, ResourceLoader.THREAD_LOAD_INVALID_RESOURCE:
				finished_keys.append(path)
				push_error("[CVAssetLoader] Asset thread loading failed for path: %s" % path)
				
	# Cleanup finished loads
	for key in finished_keys:
		_load_queue.erase(key)
		
	if _load_queue.is_empty():
		queue_empty.emit()

## Commences background compilation of a scene resource
func request_asset_async(path: String) -> void:
	if ResourceLoader.has_cached(path):
		var res := ResourceLoader.load(path)
		asset_loaded.emit(path, res)
		return
		
	if _load_queue.has(path):
		return # Already in progress
		
	var err := ResourceLoader.load_threaded_request(path, "", true)
	if err == OK:
		_load_queue[path] = true
		print("[CVAssetLoader] Commencing non-blocking load queue thread for: %s" % path)
	else:
		push_error("[CVAssetLoader] Threaded load request rejected with code: %d" % err)

## Checks if a target path is currently queued
func is_loading(path: String) -> bool:
	return _load_queue.has(path)
