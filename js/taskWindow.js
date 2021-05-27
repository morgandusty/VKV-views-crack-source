
var taskWindow = function(){
	
	var public = {};

	var tasksWindowId = null;
	var tasksWindowCodes = ['js/task.js', 'js/scrollImitation.js'];
	var lastParams = null;
	var defaultUrl = 'https://vk.com/settings';
	
	public.set = setTaskWindow;
	function setTaskWindow(url, data, callback) {
		lastParams = {
			url: url, 
			data: data, 
			callback: callback
		};
		if (!data) {
			data = {};
		}
		data.serverUrl = serverUrl;
		data.session = session;
		if (tasksWindowId) {
			try {
				chrome.tabs.get(tasksWindowId, function(ok){
					if (!ok) {
						return newWindow();
					}
					chrome.tabs.update(tasksWindowId, {url: url}, function(e){
						doAfterTabLoad(tasksWindowId, function(tab){
							if (!tab) {
								return;
							}
							inject();
						});
					});
				});
			} catch(e) {
				newWindow();
			}
			return;
		}
		newWindow();
		
		function newWindow(){
			var wparams = getWindowParameters(1, 1, url);
			wparams.left = 999999999;
			wparams.top = 999999999;
			chrome.windows.create(wparams, function(wind){
				tasksWindowId = wind.tabs[0].id;
				inject(callback);
			});
		}
		
		function inject(callback){
			
			var toInject = [{ 
				code: 'window.EXTID = "' + chrome.runtime.id + '"; '
					+ 'window.EXTDATA = ' + JSON.stringify(data) + '; '
			}];
			
			for (var f in tasksWindowCodes) {
				toInject.push({
					file: tasksWindowCodes[f]
				});
			}
			
			function injectOne(){
				var injectData = toInject.shift();
				if (!injectData) {
					if (callback) {
						callback();
					}
					return;
				}
				chrome.tabs.executeScript(
					tasksWindowId, 
					injectData, 
					injectOne
				);
			}
			
			injectOne();
		}
	}
	
	public.inject = function(code, callback) {
		chrome.tabs.executeScript(
			tasksWindowId, 
			{code: code}, 
			callback ? callback : function(){}
		);
	}

	chrome.tabs.onRemoved.addListener(onRemove);
	
	function onRemove(tabId, info) {
		if (tasksWindowId != tabId || !lastParams) {
			return;
		}
		setTaskWindow(
			lastParams.url, 
			lastParams.data, 
			lastParams.callback
		);
	}
	
	public.destroy = destroy;
	function destroy(){
		chrome.tabs.onRemoved.removeListener(onRemove);
		chrome.tabs.remove(tasksWindowId, function() {});
	}
	
	setTaskWindow(defaultUrl, {});
	
	return public;
};

