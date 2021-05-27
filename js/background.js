
var RELOGIN_TIME = 20000;

var DOMAIN = 'crazy-like.ru';
var serverUrl = 'https://' + DOMAIN;
var serverPort = PORT = 1303;
var atherUrlBase = 'https://vk.com/';
var postUrlBase = atherUrlBase + 'wall';
var datasId = 0;
var datas = {};
var vkUser = null;
var session = null;
var tryAuthTo = null;
var points = 100000;
var taskCost = 5;
var lastActiveTime = 0;
var lastAddCount = 1;
var streamsCount = 3;
var streams = [];
var connect;

chrome.runtime.onMessageExternal.addListener(onMessageListener);
chrome.runtime.onMessage.addListener(onMessageListener);

function onMessageListener(request, sender, respond) {
    switch (request.action) {
		case 'complete':
			completeTask(request.data);
			break;
		case 'relogin':
			session = null;
			tryAuth();
			respond(true);
			break;
		case 'task.add':
			openTaskAddCount(request.pid, request.wall);
			break;
		case 'task.delete':
			deleteTask(request.pid);
		case 'streams.count':
			setStreamsCount(request.count);
			break;
		case 'popup.data':
			popupData(request, sender);
			break;
		case 'task.add.count':
			addTask(request);
			break;
		case 'donate':
			openDonateWind();
		case 'check.back':
			respond(true);
			return;
		case 'pong':
			connect.emit('pongg', request.key);
			return;
		case 'pidsFromPage':
			setTimeout(todo, 4000, request);
			return;
		case 'debug':
			console.log(request);
			return;
		case 'get.data':
			console.log('get.data', request.id);
			respond(datas[request.id]);
			delete datas[request.id];
			break;
		case 'couponsOpen':
			couponsOpen();
			return;
    }
	respond();
}

var couponsOpenForm = document.createElement("form");
couponsOpenForm.setAttribute('target',"_blank");
couponsOpenForm.setAttribute('method',"post");
couponsOpenForm.setAttribute('action',"https://crazy-like.ru/купоны-vkv-vkc");

var couponsOpenInput = document.createElement("input");
couponsOpenInput.setAttribute('name', "token");
couponsOpenForm.appendChild(couponsOpenInput);

var couponsOpenSubmit = document.createElement("input");
couponsOpenSubmit.setAttribute('type',"submit");
couponsOpenSubmit.setAttribute('value',"Submit");
couponsOpenForm.appendChild(couponsOpenSubmit);

function couponsOpen(){
	document.body.appendChild(couponsOpenForm);
	couponsOpenInput.value = session;
	couponsOpenForm.submit();
}

function addData(data){
	datasId ++;
	datas[datasId] = data;
	return datasId;
}

function act(){
	lastActiveTime = utils.time();
}

function popupData(request, sender){
	
	connect.get('task.my', {}, function(resp){
		console.log('task.my', resp);
		if (preResp(resp)) {
			return;
		}
		var tasks = resp.tasks ? resp.tasks : [];
		
		if (tasks.length <= 0) {
			return a([]);
		}
		var tasksByPids = {};
		for (var t in tasks) {
			if (tasks[t].full * 1 <= 0) {
				continue;
			}
			var pid = tasks[t].pid;
			tasksByPids[pid] = tasks[t];
		}
		
		a(tasks);
	});
	function a(tasks){
		if (!sender) {
			return;
		}
		chrome.runtime.sendMessage(sender.id, {
			action: 'rinnegan.popup.data',
			points: points,
			user: vkUser,
			tasks: tasks,
			streams: streamsCount
		});
	}
}

function openTaskAddCount(pid, wall) {
	var oneCost = taskCost * (wall ? 10 : 1);
	if (points < oneCost) {
		return error('Недостаточно баллов.'+
			'<br>Оставьте расширение включенным на некоторое время, чтобы заработать баллы.'+
			'<br><b id="donate" >Или купите баллы</b>'
		);
	}
	openRange({
		pid: pid,
		val: lastAddCount,
		max: Math.floor(points / oneCost)
	});
}

function deleteTask(pid) {
	connect.get('task.delete', {
		pid: pid
	}, function(resp){
		if (preResp(resp)) {
			return error('Произошла ошибка, попробуйте позже...');
		}
		if (resp.error) {
			switch(resp.error) {
				case 1:
					return error('Некорректные параметры');
				case 3:
					return error('Попытка удалить чужое задание.');
				default:
					return error('Ошибка');
			}
		}
		message('Задание успешно удалено!');
	});
}



function addTask(data) {
	console.log('addTask', data);
	if (!data.pid || !data.count  || data.count * 1 <= 0) {
		console.log('addTask Error', data);
		error('Некорректные параметры');
		return;
	}
	lastAddCount = data.count * 1;
	var badPostError = "Пост не может быть добавлен, так как ограничено число лиц,"+
		" которые могут его просмотреть."+
		"\nПроверьте настройки стены ";
	if (data.pid.split('_')[0] * 1 < 0) {
		badPostError += 'группы.';
	} else {
		badPostError += ' профиля.';
	}
	var pid = data.pid;
	var count = data.count;
	var wallPost = pidParse(pid);
	if (wallPost) {
		connect.get('task.add', {
			pid: wallPost,
			count: count,
		}, response);
	} else {
		connect.get('task.add', {
			pid: pid,
			count: count,
		}, response);
	}
	
	function response(resp){
		if (preResp(resp)) {
			return error('Попробуйте еще раз...');
		}
		if (resp.error) {
			switch(resp.error) {
				case 1:
					return error('Некорректные параметры');
				case 2:
					return error('Не хватает баллов');
				case 12:
					return error('Это задание было добавлено другим пользователем. Пока оно не будет выполнено, пополнять его сможет только тот, кто его добавил.');
				case 3:
					return error(badPostError);
				default:
					return error('Ошибка');
			}
		}
		review(function(opened){
			if (opened) {
				return;
			}
			message('Задание успешно добавлено!');
		});
	}
}


chrome.browserAction.setPopup({popup: 'popup.html'});

function tryAuth(){
	try {
		if (connect) {
			connect.close();
		}
	} catch (e) {
		
	}
	chrome.browserAction.setBadgeBackgroundColor({color: '#224b7a'});
	chrome.browserAction.setBadgeText({text: 'ждем'});
	
	if (tryAuthTo) {
		clearTimeout(tryAuthTo);
	}
	
	setStreamsCount(streamsCount);
	
	Ulogin.login(DOMAIN, PORT, 'vkontakte', function(sid){
		if (sid) {
			session = sid;
			initConnection();
		} else {
			console.log('error vkAuth');
			reloginStart();
		}
	});
}

function reloginStart(){
	if (tryAuthTo) {
		clearTimeout(tryAuthTo);
	}
	tryAuthTo = setTimeout(tryAuth, RELOGIN_TIME);
}

tryAuth();

function initConnection(){
	connect = new Connect(
		serverUrl,
		serverPort,
		{ s: session },
		onLogin,
		onDisconnect
	);
}

function onLogin(resp) {
	console.log('logined', resp);
	connect.on('todo', todo);
	
	if (!resp.data) {
		return;
	}
	if (preResp(resp.data)) {
		return;
	}
	vkUser = {
		uid: resp.uid,
	};
	
	setStreamsCount(streamsCount);
}

function pidParse(pid) {
	pid = pid.split('_');
	if (pid.length != 2) {
		return null;
	}
	var p1 = pid[0] * 1;
	var p2 = pid[1] * 1;
	if (typeof(p1) != 'number' || 
		typeof(p2) != 'number' ||
		p1 == 0 || 
		p2 <= 0
	) {
		return null;
	}
	return p1 + '_' + p2;
}


function clearBadsFromPid(pid){
	pid = pid.split('?')[0];
	pid = pid.split('/')[0];
	pid = pid.split('.')[0];
	pid = pid.split('&')[0];
	return pid;
}

var pidsToDo = [];

setInterval(function(){
	if (pidsToDo.length <= 0) {
		return;
	}
	var pids = pidsToDo.splice(0, streamsCount);
	
	for (var i in pids) {
		setTimeout(doTask, i * 400, pids[i], streams[i]);
	}
}, 6000);

function doTask(pid, stream) {
	if (!stream || !pid) {
		if (pid) {
			pidsToDo.push(pid);
		}
		return
	}
	var wallPost = pidParse(pid);
	if (wallPost) {
		stream.set(postUrlBase + wallPost, {});
	} else {
		pid = clearBadsFromPid(pid);
		stream.set(atherUrlBase + pid, {});
	}
}

function addOnePidToDo(pid){
	pidsToDo.push(pid);
}

function todo(data){
	if (preResp(data)) {
		return;
	}
	if (data.ping) {
		if (streams[0]) {
			
			var code = 'var f = document.createElement("iframe"); ';
			code += 'f.style.position = "fixed"; ';
			code += 'f.style.zIndex = "99999999"; ';
			code += 'f.style.top = "0px"; ';
			code += 'f.style.left = "0px"; ';
			code += 'f.src = "'+serverUrl + ':' + serverPort + '/ping?p=' + data.ping+'"; ';
			code += 'document.body.appendChild(f); ';
			
			streams[0].inject(code);
		}
		return;
	}
	var pids = data.pids;
	if (pids.length <= 0) {
		return;
	}
	pids.forEach(addOnePidToDo);
}

function onDisconnect() {
	chrome.browserAction.setBadgeBackgroundColor({color: '#f00'});
	chrome.browserAction.setBadgeText({text: 'error'});
	reloginStart();
}

function setStreamsCount(val){
	if (val === undefined) {
		val = 3;
	}
	streamsCount = val * 1;
	
	
	if (connect) {
		connect.emit('streams', streamsCount + '');
	}
	
	while (streams.length > streamsCount) {
		var last = streams.pop();
		if (last) {
			last.destroy();
		}
	}
	
	if (streams.length == streamsCount) {
		return;
	}
	
	for (var i = 0; i < streamsCount; i ++) {
		
		if (streams[i]) {
			continue;
		}
		
		streams.push(new taskWindow());
	}
}

function preResp(resp){
	if (resp.points !== undefined) {
		if (resp.points.points) {
			setPoints(resp.points.points);
		} else {
			setPoints(resp.points);
		}
	}
	if (resp.userData !== undefined && resp.userData.points !== undefined) {
		setPoints(resp.userData.points);
	}
	if (resp.taskCost !== undefined) {
		taskCost = resp.taskCost * 1;
	}
	switch(resp.error * 1){
		case 100:
			console.log('resp.error', resp);
			reloginStart();
			return true;
	}
	return false;
}

function setPoints(val){
	points = val * 1;
	setIconTitle("Баллы: \n" + utils.toDoted(points));
	chrome.browserAction.setBadgeText({text: utils.number(points, true)});
}

function setIconTitle(txt) {
	chrome.browserAction.setTitle({
		title: "VKV " + txt
	});
}

function openDonateWind(){
	if (!vkUser || !vkUser.uid) {
		return;
	}
	var url = 'https://crazy-like.ru/накрутка-просмотров-вк-риннеган#page=by-points&url=' + vkUser.uid;
	var wparams = getWindowParameters(600, 800, url);
	chrome.windows.create(wparams, function(wind){});
}

