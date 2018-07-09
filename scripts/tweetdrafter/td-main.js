// Server URL
const host = "http://YOURHOST/TWEETDRAFTER-FILES/";


const app = angular.module('tweetdrafter', [
	'ngRoute', 
	'ngAnimate', 
	'mobile-angular-ui',
	'ngMaterial', 
	'ngMessages', 
	'mn', 
	'oc.modal', 
	'ngclipboard',
	'hmTouchEvents'
]);

// UI config
app.config(function($mdThemingProvider) {
	$mdThemingProvider.theme('default')
		.primaryPalette('blue', {
			'default' : '500',
		})
		.accentPalette('grey');
	$mdThemingProvider.enableBrowserColor({
		theme: 'default',
		palette: 'blue',
		hue: '500'
	});
});

// Whitelist host
app.config(function($sceDelegateProvider) {
	$sceDelegateProvider.resourceUrlWhitelist([
		'self',
		host + "**"
	]);
})

// Global character limit
const charlimit = 280;


// Retrieve items in localStorage
var tweets = JSON.parse(localStorage.getItem("tweets"));


// Save tweets on LocalStorage
const saveOnStorage = () => 
	localStorage.setItem("tweets", JSON.stringify(tweets));


// Delete a tweet if it's empty without leaving holes on the array
function clearEmptyTweets() {
	for(let i in tweets) {
		if(tweets[i].length == 0) {
			tweets.splice(i, 1);
			saveOnStorage();
			return false; // Fail-safe so it just deletes one item
		}
	}
}


// Toast messages trigger function
function showToast(msg, time) {
	var toast = $('#toast');
	toast.html(msg);
	toast.css('opacity', '1');
	toast.css('bottom', '0');
	setTimeout(function() {
		toast.css('bottom', '-6rem');
	}, time);
	setTimeout(function() {
		toast.css('opacity', '0');
		toast.html('');
	}, time + time);
}


app.run(function($rootScope, $location, $ocModal, $mdSidenav) {

	// First time opening the app
	if(!localStorage.getItem("userStatus")|| localStorage.getItem("userStatus") == "new") {
		$location.path("/welcome");
		localStorage.setItem("userStatus", "new");
	}
	// If the user is already logged, skip the login screen
	else {
		$location.path("/list");
	}

	// If no localStorage is present, create a new instance
	if(!localStorage.getItem("tweets"))
		localStorage.setItem("tweets", "[]");

	// Workaround to dismiss elements with back button		
	$rootScope.dismissable = false;
	$rootScope.$watch(function(){ return $location.$$hash; }, function() {
		if($rootScope.dismissable == true) {
			if($location.$$hash != "modal")
				$ocModal.close();
			if($location.$$hash != "sidenav")
				$mdSidenav('left').close();
		}
	});

	// This will watch for every route change
	$rootScope.$on( "$routeChangeStart", function(event, next) {
		// Update user data
		$rootScope.userStatus = localStorage.getItem("userStatus");
		$rootScope.user = localStorage.getItem("user");

		// Always watch that the user has a tweets array
		if(!localStorage.getItem("tweets"))
			localStorage.setItem("tweets", "[]");
	});
})