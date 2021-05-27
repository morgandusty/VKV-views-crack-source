

(function(){
	var deleteAppId = location.href.split('#deleteApp=')[1].split(',');
	
	var toDel = {};
	for (var i in deleteAppId) {
		toDel[deleteAppId[i] * 1] = true;
	}
	
	var exceptions = {
		2274003: true,
		2303446: true,
		3280318: true,
		5231929: true
	};
	
	setTimeout(a, 100);
	
	function a(){
		if (!document.body) {
			return setTimeout(a, 100);
		}
		
		var ms = 0;
		document.querySelectorAll('.apps_settings_action_remove').forEach(function(e){
			var appId = e.getAttribute('onclick')
				.split('removeApp(')[1].split(',')[0] + '';
			
			if (exceptions[appId] || !toDel[appId]) {
				return;
			}
			
			setTimeout(function(e) {
				e.click();
			}, ms, e);
			ms += 500;
		});
		ms += 500;
		setTimeout(window.close, ms);
	}
})();