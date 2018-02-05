if (window.parent && window.parent.parent) {
	try {
		window.parent.parent._current_loaded_frame_src = window.location.hash.replace(/^#/, '');
	} catch (e) {
		
	}
}
