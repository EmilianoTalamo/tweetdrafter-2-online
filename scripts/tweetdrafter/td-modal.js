// Modal menu controller


app.controller("modalMenu", function($scope, $rootScope, $ocModal, $route, $location, $http) {

	$location.url('/list#modal');
	$rootScope.dismissable = true;
	// Get selected tweet
	$scope.tweetContent = tweets[$rootScope.selectedTweetIndex];
	$scope.clipboardContent = $scope.tweetContent;

	// vibration
	navigator.vibrate(30);

	// Tweet button
	$scope.btnTweet = function() { 
		$ocModal.close();
		window.open(encodeURI("http://twitter.com/home?status=" + tweets[$rootScope.selectedTweetIndex]), "_blank");
	}

	// Delete button
	$scope.btnDelete = function() {
		$('body').css('pointer-events', 'none');
		var element = $rootScope.selectedTweet;
		$(element).addClass("deletedTweet");
		tweets.splice($rootScope.selectedTweetIndex, 1);
		saveOnStorage();
		$ocModal.close();
		setTimeout(function() {
			$route.reload();
			$('body').css('pointer-events', 'all');
		}, 600);
	}

	// Copy success
	$scope.copySuccess = function(e) {
		e.clearSelection();
		showToast("Tweet copied successfully!", 3000);
	};

	// Upload button
	$scope.uploadStatus = "Upload";
	$scope.btnUpload = function() {
		var tweetToSend = $scope.tweetContent;
		// var tweetToSend = escape($scope.tweetContent);
		var userid = localStorage.getItem("id");
		$scope.uploadStatus = "Uploading"
		$scope.showUploadSpinner = true;
		$http( 
			{
				method : "GET",
				url : host + "scripts/uploadTweet.php",
				params : {
					'id' : userid, 
					'content' : tweetToSend
				},
				timeout : 20000
			})
			.catch(function() {
				$scope.uploadStatus = "Upload";
				$scope.showUploadSpinner = false;
				showToast("The tweet could not be uploaded, please check your connection", 4000);
			})
			.then(function(response) {
				$scope.uploadStatus = "Upload";
				$scope.showUploadSpinner = false;
				if(response.data == 0) {
					showToast("Tweet uploaded", 2000);
				}
				else {
					showToast("There was an error while uploading your tweet", 4000);
				}
			})
		
		
	}
});