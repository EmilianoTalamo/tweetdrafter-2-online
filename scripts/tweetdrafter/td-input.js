// Input controller


app.controller("viewInput", function($scope, $routeParams) {

	// Focus on textarea
	$scope.$on('$routeChangeSuccess', function() {
		setTimeout(function() { // Without timeout it doesn't work
			$('#inputContent').focus();
			// Place cursor at the end
			$('textarea').prop('selectionStart', $('textarea').val().length);
			$('textarea').prop('selectionEnd', $('textarea').val().length);
		}, 66);
	});

	// Trigger char counter
	charcounter();

	// Get URL context
	var context = $routeParams.context;
	var tweetIndex;

	// Evaluate URL context
	switch(context) {
		// Add a new item
		case "new":
			tweets = JSON.parse(localStorage.getItem("tweets"));
			tweets.push(); // Add new item on array
			tweetIndex = tweets.length; // Get last array Index
			tweets[tweetIndex] = ""; // Fill it with empty text
			saveOnStorage(); // Save the reserved space for the tweet
			break;
		// Edit an existing item
		case "edit":
			tweetIndex = $routeParams.id; // Get the tweet position
			$scope.inputContent = tweets[tweetIndex]; // Get tweet content
			charcounter(); // Calculate char count
			break;
	}

	// Input event that triggers on every keystroke
	$scope.inputChange = function() {
		charcounter(); // Update char counter on every keystroke
		let text = $scope.inputContent;
		tweets[tweetIndex] = text; // Update tweet array
		saveOnStorage();
	}

	// Char counter
	function charcounter() {
		if($scope.inputContent == undefined)
			chars = "280";
		else
			chars = charlimit - $scope.inputContent.length;
		$scope.charCount = chars;
		if(chars < 0)
			$scope.charclass = true;
		else
			$scope.charclass = false;
	}
});