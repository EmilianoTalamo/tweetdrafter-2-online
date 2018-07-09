// App routing
app.config(function($routeProvider) {
	$routeProvider
	// Home
	.when("/list", {
		templateUrl : "./templates/tweetlist.html",
		reloadOnSearch: false
	})
	// New tweet
	.when("/input/:context", {
		templateUrl : "./templates/inputpage.html",
		reloadOnSearch: false
	})
	// Edit tweet
	.when("/input/:context/:id", {
		templateUrl : "./templates/inputpage.html",
		reloadOnSearch: false
	})
	// Login screen
	.when("/welcome", {
		templateUrl : "./templates/welcome.html",
		reloadOnSearch: false
	})
	// Sync screen
	.when("/cloud", {
		templateUrl : "./templates/cloud.html",
		reloadOnSearch: false
	})
	// Default failsafe
	.otherwise({
		redirectTo: '/welcome'
	});
});