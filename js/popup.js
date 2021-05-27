

$(function(){
	
	var streemsDescr = 'Чем больше потоков, тем быстрее накапливаются баллы';
	var MAX_STREAMS = 7;
	
	var body = $('body');
	var mainWrapp = $('<div/>');
	var loadingEl = $('<img src="img/loading.gif" />');
	
	body.append(loadingEl);
	body.append(mainWrapp);
	mainWrapp.hide();
	
	// HEAD
	var head = $('<div class="head" />');
	var user = $('<div class="user" ><div id="vk_groups" /></div>');
	
	
	var points = $('<div class="points" >Баллы: </div>');
	var pointsCount = $('<span class="count" />');
	var pointsBuy = $('<span class="add" />');
	var couponsBtn = $('<span class="add coupons" />')
		.text('купоны')
		.attr('title', 'Применяй и создавай купоны с бесплатными баллами.');
	var pointsSubt = $('<p class="sub-text" >'
		+'Держи расширение включенным, и получай баллы.'
		+'<br>Если баллы не набираются, значит нет активных заданий от других пользователей.'
		+'<br>Один просмотр стоит 5 баллов.'
		+'<br>' + streemsDescr + '.</p>');
	
	points.append(pointsCount);
	points.append(pointsBuy);
	points.append(couponsBtn);
	points.append('<br><b>+500 баллов раз в сутки бонусом!</b>');
	points.append('<br><b>+1000 баллов новым пользователям!</b>');
	
	head.append(user);
	head.append(points);
	head.append(pointsSubt);
	
	pointsBuy.click(function(){
		chrome.runtime.sendMessage({
			action: 'donate'
		}, function() {});
	});
	
	couponsBtn.click(function(){
		chrome.runtime.sendMessage({
			action: 'couponsOpen'
		}, function() {});
	});
	
	// CONTENT
	
	
	var range = $('<input type="range" />');
	range.attr('max', MAX_STREAMS);
	range.change(rangeChange);
	
	var rangeWrapp = $('<div class="block" title="' + streemsDescr + '" ></div>');
	rangeWrapp.css('text-align', 'center');
	rangeWrapp.append(range);
	
	var content = $('<div class="content" />');
	var streemsTitle = $('<div class="block title" title="' + streemsDescr + '" >Потоки</div>');
	var tasksTitle = $('<div class="block title" >Твои задания</div>');
	var tasksCount = $('<span class="count" />');
	var tasksWrapper = $('<div class="tasks" ></div>');
	
	tasksTitle.append(tasksCount);
	
	content.append(streemsTitle);
	content.append(rangeWrapp);
	content.append(tasksTitle);
	content.append(tasksWrapper);
	
	// mainWrapp APPENDS
	mainWrapp.append(head);
	mainWrapp.append(content);
	
	
	chrome.runtime.onMessage.addListener(onMessageListener);
	chrome.runtime.sendMessage({
		action: 'popup.data'
	}, function() {});
	
	function onMessageListener(request, sender, respond) {
		switch (request.action) {
			case 'rinnegan.popup.data':
				fill(request);
				break;
		}
	}
	
	function rangeChange(){
		var count = range.val() * 1;
		if (count === undefined) {
			count = 3;
		}
		drawRangeValue(count);
		chrome.runtime.sendMessage({
			action: 'streams.count',
			count: count
		}, function() {});
	}
	
	function drawRangeValue(val){
		if (val === undefined) {
			val = 3;
		}
		range.val(val);
		streemsTitle.html('Потоки ('+val+')');
	}
	
	function fill(data){
		
		if (!data.user) {
			window.close();
			return;
		}
		VK.Widgets.Group("vk_groups", {mode: 1}, data.user.uid * -1);
		
		drawRangeValue(data.streams);
		pointsCount.html(utils.toDoted(data.points));
		
		tasksCount.html(' (' + data.tasks.length + ')');
		for (var t in data.tasks) {
			if (data.tasks[t].full * 1 <= 0) {
				continue;
			}
			taskDraw(data.tasks[t]);
		}
		
		
		loadingEl.remove();
		mainWrapp.show();
	}
	
	function taskDraw(data) {
		
		var pid = data.pid;
		var wall = pid.split('_')[1];
		var hr = 'vk.com/' + (wall ? 'wall' : '') + pid;
		
		var el = $('<div class="task" ></div>');
		
		var wrapp = $('<div class="wrapp" ></div>');
		var name = $('<a class="name" target="_blank" >' + hr + '</a>');
		var closBtn = $('<span class="close-btn"  ></span>');
		name.attr('href', 'https://' + hr);
		
		var progressWrapp = $('<div class="progress-wrapp" ></div>');
		var progress = $('<progress/>');
		var progressText = $('<div>' + utils.toDoted(data.full - data.count) 
			+ ' / ' + utils.toDoted(data.full) + '</div>');
		progress.attr('max', data.full);
		progress.val(data.full - data.count);
		
		
		progressWrapp.append(progress);
		progressWrapp.append(progressText);
		
		wrapp.append(name);
		wrapp.append(progressWrapp);
		wrapp.append(closBtn);
		
		el.append(wrapp);
		
		closBtn.click(function(){
			chrome.runtime.sendMessage({
				action: 'task.delete',
				pid: data.pid
			}, function() {
				window.close();
			});
		});
		
		tasksWrapper.append(el);
	}
	
	
});