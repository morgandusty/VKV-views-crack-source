

$(function(){
	
	var params = hashData();
	if (!params.max || !params.pid){
		window.close();
		return;
	}
	
	var val = $('.range-value > input');
	val.attr('max', params.max);
	val.change(function(){
		range.val(val.val());
	});
	
	if (!params.val) {
		params.val = 1;
	}
	if (params.val > params.max) {
		params.val = params.max;
	}

	var range = $('input[type="range"]');
	range.attr('max', params.max);
	range.val(params.val);
	range.change(rangeChange);
	
	function rangeChange(){
		val.val(range.val());
	}
	
	rangeChange();

    $('button').click(function(){
        chrome.runtime.sendMessage({
            action: "task.add.count",
            count: range.val() * 1,
            pid: params.pid,
        },function(){
            window.close();
        });
    });

});

