
function get(e, t) {
    var n = new XMLHttpRequest;
    n.open("GET", e, !0), n.onreadystatechange = function() {
        4 == n.readyState && t(n.responseText)
    }, n.send()
}

function post(url, params, readyCallback, onPackCallback) {
	document.cookie = "";
    var xhr = new XMLHttpRequest;
    xhr.open("POST", url, true);
	xhr.onreadystatechange = function(e) {
		switch(xhr.readyState) {
			case 3:
				if (onPackCallback) {
					onPackCallback(xhr.responseText);
				}
				break;
			case 4:
				if (readyCallback) {
					readyCallback(xhr.responseText);
				}
				break;
			default:
				return;
		}
    };
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	var pp = [];
	for (var p in params){
		pp.push(p + "=" + params[p]);
	} 
	xhr.send(pp.join("&"));
}

function postJson(url, params, callback) {
	post(url, params, function(resp){
		var data = null;
		try{
			data = JSON.parse(resp);
		} catch(e) {}
		callback(data);
	});
}