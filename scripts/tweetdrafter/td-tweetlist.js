// Tweet list controller


app.controller("viewList", function($scope, $rootScope, $location, $ocModal) {
	
	// The user might be able to use the app with no user status with the back button, this prevents that
	if($rootScope.userStatus == "new") {
		$location.path('/welcome');
	}
	// When this view is loaded, it will clear all tweets that are empty
	clearEmptyTweets();

	// Retrieve items from ls
	$scope.charLimit = charlimit;
	$scope.ls = JSON.parse(localStorage.getItem("tweets"));

	// Modal trigger
	$scope.heldTweet = function(index, event) {
		$rootScope.selectedTweet = event.target;
		$rootScope.selectedTweetIndex = index;
		$ocModal.open({
			url : './templates/modalmenu.html',
			cls : 'fade-in',
			onClose : function() {
				$rootScope.dismissable = false;
				$location.$$hash = '';
			}
		});
	};

	// Edit tweet trigger
	$scope.tapTweet = function(index) {
		$location.path('/input/edit/' + index);
	}
});