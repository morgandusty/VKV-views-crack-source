

$(function(){
	var stars = new Stars();
	$('.review-stars').html(stars);
	
	$('button').hide();
	$('.review-stars').click(function(){
		$('button').show();
	});
	
	
    $('button').click(function(){
		if (stars.getStars() >= 4) {
			window.open('https://goo.gl/RnVdeu', '_blank');
		}
        window.close();
    });

});

function Stars() {
	
	var el = $('<span/>');
	var size = 64;
	var width = size * 5;
	
	el.css('background-image', 'url(img/stars.png)');
	el.css('display', 'block');
	el.css('margin', 'auto');
	el.css('width', width + 'px');
	el.css('height', size + 'px');
	el.css('position', 'relative');
	
	var over = el.clone();
	over.css('position', 'absolute');
	over.css('top', '0px');
	over.css('left', '0px');
	var selected = over.clone();
	
	over.css('transition', 'opacity .5s');
	el.css('cursor', 'pointer');
	
	el.css('background-position', '0px -' + (size * 2) + 'px');
	over.css('background-position', '0px -' + (size * 1) + 'px');
	selected.css('background-position', '0px 0px');
	
	el.append(selected);
	el.append(over);
	
	var overStars = 3;
	var selectedStars = 3;
	var oldOverStars = -1;
	var oldStars = -1;
	
	function drawStars() {
		if (overStars != oldOverStars) {
			oldOverStars = overStars;
			over.css('width', (size * overStars) + 'px');
		}
		if (selectedStars != oldStars) {
			oldStars = selectedStars;
			selected.css('width', (size * selectedStars) + 'px');
		}
	}
	
	el.mouseenter(function(e){
		over.css('opacity', 1);
	});
	el.mouseleave(function(e){
		over.css('opacity', 0);
	});
	
	el.mousemove(function(e){
		overStars = Math.ceil(e.offsetX / size);
		drawStars();
	});
	el.click(function(e){
		selectedStars = overStars;
		drawStars();
	});
	drawStars();
	
	el.getStars = function(){
		return selectedStars;
	};
	
	return el;
}