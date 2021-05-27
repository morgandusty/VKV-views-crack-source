
var Connect = function(url, port, loginData, onLogin, onDisconnect) {
	
	var PAUSE = 200;
	
	var opts = {
		secure: true,
		transports: ['websocket', 'polling']
	};
	var socket = io.connect(url + ':' + port, opts);
	
	var emit = socket.emit;
	
	var nextSendTime = 0;
	
	socket.emit = function(cmd, data) {
		var now = (new Date()).getTime();
		if (now >= nextSendTime) {
			nextSendTime = now + PAUSE;
			emit.bind(socket)(cmd, data);
			return;
		}
		setTimeout(function(){
			emit.bind(socket)(cmd, data);
		}, ( nextSendTime - now ));
		nextSendTime += PAUSE;
	}
	
	socket.on('connect', function(){
		console.log('server connected');
		socket.get('login', loginData, onLogin);
	});
	socket.on('disconnect', function(){
		console.log('server disconnect');
		if (onDisconnect) {
			onDisconnect();
		}
		socket.close();
	});
	
	var getListenerCallbacks = {};
	var callbackId = 0;
	socket.get = function(command, params, callback, notWait){
		if (typeof params == 'function') {
			notWait = callback;
			callback = params;
			params = {};
		} else if (!params) {
			params = {};
		}
		if (typeof callback != 'function') {
			callback = function(){};
		}
		callbackId ++;
		var key = 'c' + callbackId;
		if (callbackId > 1000) {
			callbackId = 0;
		}
		params.callback = key;
		socket.once(key, function(data){
			var callbacks = getListenerCallbacks[command];
			if (callbacks) {
				for (var c in callbacks) {
					callbacks[c](data);
				}
			}
			
			callback(data);
		});
		socket.emit(command, params);
	};
	
	
	socket.addGetListener = function(command, callback){
		if (!getListenerCallbacks[command]) {
			getListenerCallbacks[command] = [];
		}
		getListenerCallbacks[command].push(callback);
	};
	
	return socket;
}

