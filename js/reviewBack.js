


function review(callback) {
	
	var stepToReview = 5;
	
	chrome.storage.local.get(['needReview'], function(result) {
		var step = result.needReview;
		if (!step) {
			step = 1;
		}
		step = step * 1 + 1;
		if (step > stepToReview + 1) {
			return callback(false);
		}
		
		chrome.storage.local.set({needReview: step}, function() {
			if (step == stepToReview) {
				openReviewWindow();
				return callback(true);
			}
			callback(false);
		});
	});
	function openReviewWindow() {
		var wparams = getWindowParameters(460, 300, 'review.html');
		chrome.windows.create(wparams, function(wind){});
	}
}