
var utils = {};

utils.time = function(){
	return (new Date).getTime();
};

utils.number = function(value, notHtml){
	var symbols = ['k','m','g','t','p','e','z','j','K','M','G','T','P','E','Z','J'];
	var clength = symbols.length;
	var lasts = symbols[symbols.length - 1];
	value = Math.floor(value);
	var title = utils.toDoted(value * 1) + '';
	value = utils.toFixed(value * 1) + '';
	var count = Math.floor(value.length / 3);
	if (value.length % 3 < 2) {
		count -= 1;
	}
	if (count > 0) {
		var endSymbols = '';
		
		var lastSymbolsCount = Math.floor(count / clength);
		for (var s = 0; s < lastSymbolsCount; s ++) {
			endSymbols += lasts;
		}
		
		value = value.slice(0, value.length - count * 3);
		endSymbols += symbols[(count % clength) - 1];
		
		if (notHtml) {
			return value + '' + endSymbols;
		}
		return '<span class="number" tooltip="'+title+'" >' 
			+ value + '<b class="symbols" >' + endSymbols + '</b></span>';
	}
	if (notHtml) {
		return value + '';
	}
	return '<span class="number" tooltip="'+title+'" >' + value + '</span>';
};

utils.toDoted = function(value, dot) {
	if (!dot) {
		dot = ' ';
	}
	value = utils.toFixed(value * 1) + '';
	var returnValue = [];
	while (value.length > 3) {
		var l = value.length;
		returnValue.unshift(value.substr(l - 3, 3));
		value = value.substr(0, l - 3);
	}
	returnValue.unshift(value);
	return returnValue.join(dot) + '';
}

utils.toFixed = function(x) {
	if (Math.abs(x) < 1.0) {
		var e = parseInt(x.toString().split('e-')[1]);
		if (e) {
			x *= Math.pow(10,e-1);
			x = '0.' + (new Array(e)).join('0') + x.toString().substring(2);
		}
	} else {
		var e = parseInt(x.toString().split('+')[1]);
		if (e > 20) {
			e -= 20;
			x /= Math.pow(10,e);
			x += (new Array(e+1)).join('0');
		}
	}
	return x + '';
};


function traceTime(e) {
    var t = Math.floor(e / 60);
    return t < 10 && (t = "0" + t), 
		(e %= 60) < 10 && (e = "0" + e), 
		t + ":" + e;
}

function getWindowParameters(e, t, n, o) {
    var a = {
        left: Math.floor(screen.width / 2 - e / 2),
        top: Math.floor(screen.height / 2 - t / 2),
        width: e,
        height: t,
        type: "popup"
    };
    if (null != n) {
        if (null != o) {
            var s = [];
            for (var i in o) s.push(i + "=" + o[i]);
            n += "#" + s.join("&")
        }
        a.url = n
    }
    return a
}


function doAfterTabLoad(tabId, callback){
	chrome.tabs.get(tabId, function(tab){
		if (!tab) {
			return callback(false);
		}
		if (tab.status != 'complete') {
			setTimeout(doAfterTabLoad, 100, tabId, callback);
			return;
		}
		callback(true);
	});
}
