




function error(text){
	openMessageWindow(text, 'error');
}

function message(text){
	openMessageWindow(text, 'mess');
}

function openMessageWindow(text, type) {
	var tabId;
	var dataId = addData({
		text: text,
		type: type
	});
	
	var wparams = getWindowParameters(460, 260, 'mess.html', {dataId: dataId});
	chrome.windows.create(wparams, function(wind){});
}

function openRange(data){
	console.log(data);
	var wparams = getWindowParameters(460, 300, 'number.html', data);
	chrome.windows.create(wparams, function(wind){});
}