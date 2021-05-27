
$(function(){
	
	var body = $('body');
	var content = body.find('.content');
	var message = content.find('.message');
	var params = hashData();
	
	chrome.runtime.sendMessage({
		action: 'get.data',
		id: params.dataId
	}, init);
	
	function init(data){
		body.addClass(data.type);
		message.html(data.text);
		message.find('#donate').click(function(){
			chrome.runtime.sendMessage({
				action: 'donate'
			}, function() {
				window.close();
			});
		});
	}
	
    $('button').click(function(){
        window.close();
    });
	
});