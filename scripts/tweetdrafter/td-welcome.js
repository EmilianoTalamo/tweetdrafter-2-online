app.controller("welcome", function($scope, $rootScope, $location, $http, $q) {
	var action;
	var cancelRequest = $q.defer();

	// Form regex
	var regex = new RegExp(/^([a-z]|[0-9])+$/i);
	$scope.formRegex = regex;

	// Open login / register modal
	function triggerForm() {
		$scope.formErrorTrigger = false; // Hide any error messages

		// Animation
		$('#formOverlay').css('bottom', '0');
		$('#overlayBg').css('opacity', '0.3');
		$('#overlayBg').css('pointer-events', 'all');
	}


	// Close login / register modal
	$scope.untriggerForm = function untriggerForm() {
		cancelRequest.resolve(); // Cancel pending request if any
		$scope.formErrorTrigger = false; // Hide any error messages
		$scope.form.$setPristine(); // Set form back to pristine

		// Animation
		$('#formOverlay').css('bottom', '-320px');
		$('#overlayBg').css('opacity', '0');
		$('#overlayBg').css('pointer-events', 'none');

		$scope.password = ""; // Reset password field
		cancelRequest = $q.defer(); // Create a new instance of the AJAX timeout promise
	}


	// Login button push
	$scope.loginLogin = function() {
		$scope.formTitle = "Login";
		action = "login";
		$scope.submitText = $scope.formTitle;
		$scope.formTarget = host + "login.php";
		triggerForm();
	}


	// Register button push
	$scope.loginRegister = function() {
		$scope.formTitle = "Register";
		action = "register"
		$scope.submitText = $scope.formTitle;
		$scope.formTarget = host + "register.php";
		triggerForm();
	}


	// Offline button push
	$scope.loginSkip = function() {
		localStorage.setItem("userStatus", "offline");
		$location.path("/list");
	}


	// Form submit
	$scope.submitform = function() {
		// Disable login button
		$scope.disableFormBtn = true;

		// Trim fields
		let username = $scope.username.trim();
		let password = $scope.password.trim();

		// User selected login
		if(action == "login")
		{
			$scope.submitText = "Connecting...";
			$http( 
				{
					method : "POST",
					url : host + "scripts/login.php",
					data : {
						'username' : username, 
						'password' : password,
					},
					timeout : cancelRequest.promise // Abort request whenever this promise is triggered
				})
				.catch(function() {
					$scope.formErrorTrigger = true;
					$scope.errorMessage = "Connection error.";
					$scope.disableFormBtn = false;
					$scope.submitText = "Login";
				})
				.then(function(response) {
					$scope.disableFormBtn = false;
					if(response.data.status == "2") {
						$scope.formErrorTrigger = true;
						$scope.errorMessage = "There was an error.";
					}
					else if(response.data.status == "1") {
						$scope.formErrorTrigger = true;
						$scope.errorMessage = "Wrong username or password.";
					}
					// Login successful
					else {
						// Get user data and save it to localStorage
						localStorage.setItem("user", response.data.username);
						localStorage.setItem("id", response.data.id);
						localStorage.setItem("userStatus", "online");
						// Get tweets and save them
						if(response.data.tweets.length > 0) {
							tweets = JSON.parse(localStorage.getItem("tweets"));
							for(let content of response.data.tweets) {
								tweets.push();
								let tweetIndex = tweets.length;
								tweets[tweetIndex] = content[0];
								saveOnStorage();
							}
						}
						// Redirect to the app
						$location.path("/list");
					}

					$scope.submitText = "Login";
					$scope.disableFormBtn = false;
				});
		}

		// User selected register
		else {

			// Change button state
			$scope.submitText = "Please wait...";

			$http( 
				{
					method : "POST",
					url : host + "scripts/register.php",
					data : {
						'username' : username, 
						'password' : password,
					},
					timeout : cancelRequest.promise // Abort request whenever this promise is triggered
				})
				.catch(function() {
					$scope.formErrorTrigger = true;
					$scope.errorMessage = "Conection error.";
					$scope.disableFormBtn = false;
					$scope.submitText = "Register";
				})
				.then(function(response) {
					$scope.disableFormBtn = false;
					// Duplicated username
					if(response.data.status == "1") {
						$scope.formErrorTrigger = true;
						$scope.errorMessage = "Duplicate username.";
					}
					// Register successful
					else if(response.data.status == "0"){
						// If the user was using the app in offline mode, and he decides to register, all his tweets will remain.
						if(localStorage.getItem("userStatus") != "offline") {
							localStorage.setItem("tweets", "[]");
						}
						// Change user status to "online", where new features are enabled in the app
						localStorage.setItem("userStatus", "online");
						// Save the username
						localStorage.setItem("user", response.data.username);
						// Set the assigned user ID
						localStorage.setItem("id", response.data.id);
						// Redirect to app
						$location.path("/list");
					}
					// Unknown error (wrong data sent by the server or error number 2)
					else {
						$scope.formErrorTrigger = true;
						$scope.errorMessage = "Registration error.";
					}
					$scope.submitText = "Register";
					$scope.disableFormBtn = false;
				});	
		}
	}
});