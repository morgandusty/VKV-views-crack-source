
(function(){
	
	var first = 2;
	var next = 0;
	var pos = 0;
	var speed = 30;
	var elsToScroll = [];
	
	var scrollHeight = Math.max(
		document.body.scrollHeight, document.documentElement.scrollHeight,
		document.body.offsetHeight, document.documentElement.offsetHeight,
		document.body.clientHeight, document.documentElement.clientHeight
	);
	
	
	document.querySelectorAll('.post').forEach(function(el){
		elsToScroll.push(el.getBoundingClientRect());
	});
	
	console.log('elsToScroll count', elsToScroll.length);
	
	setInterval(step, 50);
	
	function step(){
		var y = window.pageYOffset || document.documentElement.scrollTop;
		if (y < pos - speed) {
			scrollBy(0, speed);
		} else if (y > pos + speed) {
			scrollBy(0, -speed);
		}
		
		if (next > 0) {
			next --;
			return;
		}
		newPos();
	};
	
	function newPos(){
		if (elsToScroll.length <= 0 || first > 0) {
			first --;
			next = 20 + Math.round(Math.random() * 100);
			pos = Math.round(Math.random() * scrollHeight / speed) * speed;
			return;
		}
		var elToScroll = elsToScroll.shift();
		next = 100 + Math.round(Math.random() * 120);
		pos = elToScroll.y - 50 - Math.round(Math.random() * 50);
	}
	
})();

