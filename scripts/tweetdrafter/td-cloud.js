// Cloud sync controller
app.controller("cloudList", function($scope, $rootScope, $http, $route) {
	
	// VAS A TENER QUE TRAER LOS TWEETS CON ID PARA SABER CUAL BORRAR
	$scope.showCloudFill = true;
	$scope.showCloudSpinner = true;

	let id = localStorage.getItem("id");

	$http( 
		{
			method : "GET",
			url : host + "scripts/fetchTweets.php",
			params : {
				'id' : id
			},
			timeout : 30000
		})
		.catch(function() {
			$scope.showCloudSpinner = false;
			$scope.showCloudMessage = true;
			$scope.cloudMessage = "There was an error retrieving your tweets, please check your connection";
		})
		.then(function(response) {

			if(response.data == "1") {
				$scope.showCloudSpinner = false;
				$scope.showCloudMessage = true;
				$scope.cloudMessage = "You have no tweets uploaded"
			}
			else {
				// Generate array for ng-repeat
				var cloud = [];
				for(let i of response.data) {
					cloud.push({
						"id" : i.ID,
						"content" : i.CONTENT
					})
				}
				$scope.cloud = cloud;
				$scope.showCloudFill = false;
			}		
		})
		
		// For cloud delete, it will take the ID of the tweet inside the DB
		$scope.cloudDelete = function(id) {
			$http( 
				{
					method : "GET",
					url : host + "scripts/deleteTweet.php",
					params : {
						'userid' : localStorage.getItem("id"),
						'tweetid' : id
					},
					timeout : 30000
				})
				.catch(function() {
					showToast("Tweet not deleted, please check your connection.", 5000);
				})
				.then(function(response) {
					if(response.data == 0) {
						showToast("Tweet deleted successfully", 2000);
						$route.reload();
					}
					else {
						showToast("There was an error while deleting the tweet", 3000);
						$route.reload();
					}
				});
		}

		// For Cloud copy, it will the the position of the tweet of the downloaded array (the copy is made locally, no query to the server required)
		$scope.cloudCopy = function(index) {
			tweets = JSON.parse(localStorage.getItem("tweets"));
			let tweetToAdd = $scope.cloud[index].content;

			// Prevent duplicated tweets
			let matched = false;
			for(let i of tweets) {
				if(i == tweetToAdd)
				{
					matched = true;
					break;
				}
			}
			if(matched) {
				showToast("The selected tweet is already downloaded", 3000);
			}
			else {
				tweets.push();
				tweets[tweets.length] = tweetToAdd;
				saveOnStorage();
				showToast("The tweet has been downloaded", 3000);
			}
		}

	
});