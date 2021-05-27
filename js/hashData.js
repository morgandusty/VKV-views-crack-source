

function hashData(){
	var data = {};
	var hash = location.href.split('#')[1];
	if (!hash) {
		return data;
	}
	hash = hash.split('&');
	for (var h in hash) {
		var hh = hash[h].split('=');
		data[hh[0]] = hh[1];
	}
	return data;
}