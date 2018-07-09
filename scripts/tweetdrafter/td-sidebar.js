// Sidebar controller


app.controller("sidebar", function($scope, $mdSidenav, $rootScope, $location) {
	
	// Close on swipe left
	$scope.sidebarSwipeLeft = function() { 
		$mdSidenav('left').toggle();
	}
	$mdSidenav('left', true).then(function(instance) {
		instance.onClose(function() {
			$rootScope.dismissable = false;
		});
	});

	// Log Out
	$scope.logOut = function() {
		var prompt = confirm("If you log out, you will loose all your unsynced tweets. Are you sure?");
		if(prompt) {
			localStorage.removeItem("id");
			localStorage.removeItem("tweets");
			localStorage.removeItem("user");
			localStorage.setItem("userStatus", "new");
			$mdSidenav('left').close();
			$location.path('/welcome');
		}
	}

	// Log in or register
	$scope.logIn = function() {
		$mdSidenav('left').close();
		$location.path('/welcome');
	}
});