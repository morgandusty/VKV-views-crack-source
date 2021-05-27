
(function(){
	
	var domain = location.href.split('/')[2];
	if (domain != 'vk.com') {
		return;
	}

	var uvScript = document.createElement('script');
	uvScript.innerHTML = 'document.head.setAttribute("vkid", vk.id);';
	document.head.appendChild(uvScript);

	function getVU(){
		return document.head.getAttribute("vkid") * 1;
	}

	setTimeout(rinneganActions, 500);
	
	function debug(data){
		chrome.runtime.sendMessage(window.EXTID, {action: 'debug', data: data});
	}

	function rinneganActions(){
		
		if (!getVU() || document.querySelector('#top_reg_link')){
			chrome.runtime.sendMessage(window.EXTID, {action: 'relogin'});
			return;
		}
		
		var pid = location.href.split('/')[3];
		if (pid.split('_')[1]) {
			return;
		}
		var page_wall_posts = document.getElementById('page_wall_posts');
		var posts = page_wall_posts.querySelectorAll('.post');
		var pids = [];
		for (var i = 0; i < 10; i ++) {
			var post = posts[i];
			if (!post) {
				continue;
			}
			var id = post.getAttribute('id');
			if (!id) {
				continue;
			}
			var pid = id.split('post');
			if (pid[1]) {
				pids.push(pid[1]);
			}
		}
		if (!pids.length) {
			return;
		}
		chrome.runtime.sendMessage(window.EXTID, {action: 'pidsFromPage', pids: pids});
	}

	function onMessageListener(request, sender, respond) {
		if (sender.id != window.EXTID) {
			return;
		}
		switch (request.action) {
			case 'check':
				if (document.querySelector('#top_reg_link')) {
					respond(null);
					break;
				}
				respond(getVU());
				break;
		}
	}
	
})();

