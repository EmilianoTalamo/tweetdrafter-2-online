// Navbar controller


app.controller("navBar", function($scope, $rootScope, $location, $route, $routeParams, $mdSidenav, $window, $http) {
	

	// Get route path to determine which buttons include
	$rootScope.$on( "$routeChangeStart", function(event, next) {
		if(next.$$route === undefined)
			$rootScope.currentPath = '/';
		else
			$rootScope.currentPath = next.$$route.originalPath;
	});

	// Back button
	$scope.backBtn = function() {
		$window.history.back();
	}

	// Delete button
	$scope.deleteCurrent = function() {
		navigator.vibrate(10);
		if($routeParams.context == 'new')
			tweets.pop();
		else
			tweets.splice($routeParams.id, 1);
		saveOnStorage();
		$window.history.back();
	}

	// Cloud button
	$scope.goToCloud = function() {
		$location.path('/cloud');
	}


	// Open sidebar button
	$scope.toggleLeft = function() {
		$location.url('/list#sidenav');
		$rootScope.dismissable = true;
		$mdSidenav('left').toggle();
	}

	// Cloud download all button
	$scope.syncDownloadAll = function() {
		var id = localStorage.getItem("id");
		$scope.showSpinner = true;
		$http(
			{
				method : "POST",
				headers : {
					"Content-Type" : "application/json"
				},
				url : host + "scripts/syncDownloadAll.php",
				data : {
					'id' : id
				},
				timeout : 15000
			})
			.then(function(response) {			
				if(typeof response.data != "object") {
					showToast("You have no tweets uploaded", 3000);
				}
				else {
					tweets = JSON.parse(localStorage.getItem("tweets"));

					// These nested fors prevent duplicated tweets to be downloaded
					for(let content of response.data) {
						var matched = false;
						for(let i of tweets) {
							if(i == content[0])
							{
								matched = true;
								break;
							}
						}
						if(!matched) {
							tweets.push();
							let tweetIndex = tweets.length;
							tweets[tweetIndex] = content[0];
							saveOnStorage();
						}
						showToast("Your tweets have been downloaded", 5000);
					}
				}
				$scope.showSpinner = false;
			})
			.catch(function() {
				showToast("There was an error downloading your tweets", 5000);
				$scope.showSpinner = false;
			})
	}
});