
var Ulogin = (function(){
	var public = {};
	var currentLoginCallback;
	
	chrome.runtime.onMessage.addListener(onMessageListener);

	function onMessageListener(e, t, n) {
		switch (e.method) {
			case 'uloginSid':
				if (currentLoginCallback) {
					currentLoginCallback(e.sid);
				}
				currentLoginCallback = null;
				break;
		}
	}
	
	var bigInt = 9999999;
	
	public.login = function(domain, port, soc, callback){
		currentLoginCallback = callback;
		var url = 'https://ulogin.ru/auth.php?name='
			+ soc + '&window=1&lang=ru&fields=first_name,last_name,photo'
			+ '&force_fields=&popup_css=&host=' + domain + '&optional=' 
			+ '&redirect_uri=&verify=&callback=&screen=' 
			+ screen.width + 'x' + screen.height
			+ '&url=&providers=' + soc + '&hidden=&m=0&page=https://' 
			+ domain + '&icons_32=&icons_16=&theme=flat&client=&version=3';
		
		chrome.windows.create({
			url: url,
			width: 1, height: 1, top: bigInt, left: bigInt,
			focused: true, type: 'popup',
		}, function(window){
			
		});
	};
	
	
	return public;
})();