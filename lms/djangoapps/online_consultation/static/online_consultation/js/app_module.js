'use strict';
define(['angular','ui-router', 'ui-bootstrap'],function(angular, ui_router, ui_bootstrap){

	angular
		.module("app", ['ui.router', 'ui.bootstrap'])
		
		.controller("MainController", ["$scope", function($scope){
			$scope.title = "This is the title";

			$scope.content = "This is the content";
		}])

		.service("InstructorsService", ["$q", "$http", function($q, $http){
			var urls = {
				instructors: "http://" + config.BASE_URL + "/api/consultation/v0/instructors/" + config.COURSE_ID
			};

			this.getInstructors = function(){
				return $http.get(urls.instructors);
			};

		}])

		.controller("InstructorsController", ["$scope", "$state", "InstructorsService", function($scope, $state, InstructorsService){
			// $scope.instructors = [
			// 	{
			// 		id: 1,
			// 		username: "brenthmiras"
			// 	},
			// 	{
			// 		id: 2,
			// 		username: "nferocious"
			// 	},
			// 	{
			// 		id: 3,
			// 		username: "rubberdont"
			// 	}
			// ];

			//$scope.instructors = [];

			$scope.placeholder_url = staticUrl("images/male-profile-placeholder.jpg");

			$scope.getInstructors = function(){
				InstructorsService
					.getInstructors()
					.then(
						function(response){
							console.log(response);
							$scope.instructors = response.data;
						},
						function(error){
							alert("Cannot fetch instructors");
							console.log(error)
						}
					);
			};

			$scope.usernameFilter = "";

			$scope.filterByUsername = function(username){
				$scope.usernameFilter = username;
			};

			/*
			This function checks whether the
			specified username is in the list of
			instructors.
			*/
			$scope.usernameExists = function(username){
				if($scope.instructors){
					for(var i=0; i<$scope.instructors.length; i++){
						if($scope.instructors[i]["fields"]["username"]==username){
							return true;
						}
					}
					
					return false;
				}
				else{
					return false;
				}
			};

			$scope.viewSchedules = function(username){
				$scope.filterByUsername(username);
				$state.go("instructors.schedules", {username:username});
			};

			$scope.noInstructors = function(){
				return $scope.instructors && $scope.instructors.length == 0;
			};

			$scope.refresh = function(){
				$scope.usernameFilter = "";
			};

			(function init(){
				$scope.getInstructors();
			})();

		}])

		.controller("InstructorSchedulesController", ["$scope", "$stateParams", "$state", function($scope, $stateParams, $state){
			
			var instructorUsername = $stateParams.username;
			
			console.log("username is: " + instructorUsername);
			
			// $scope.instructors = [
			// 	{
			// 		id: 1,
			// 		username: "brenthmiras"
			// 	},
			// 	{
			// 		id: 2,
			// 		username: "nferocious"
			// 	},
			// 	{
			// 		id: 3,
			// 		username: "rubberdont"
			// 	}
			// ];

			//$scope.instructors = [];

			//$scope.placeholder_url = staticUrl("images/male-profile-placeholder.jpg");

			$scope.getSchedules = function(){
				// InstructorsService
				// 	.getInstructors()
				// 	.then(
				// 		function(response){
				// 			console.log(response);
				// 			$scope.instructors = response.data;
				// 		},
				// 		function(error){
				// 			alert("Cannot fetch instructors");
				// 			console.log(error)
				// 		}
				// 	);
				$scope.schedules = [
					{
						id: 1,
						text: "sched1"
					},
					{
						id: 2,
						text: "sched2"
					},
					{
						id: 3,
						text: "sched3"
					}
				];
			};

			$scope.back = function(){
				$scope.refresh();
				$state.go("instructors");
			};

			$scope.noSchedules = function(){
				return $scope.schedules && $scope.schedules.length == 0;
			};

			(function init(){
				//check if username is valid
				if($scope.usernameExists(instructorUsername)){
					console.log("filterByUsername will be called");
					$scope.filterByUsername(instructorUsername);
					$scope.getSchedules();
				}
				else{
					$scope.back();
				}
			})();

		}])
		
		.config(function($stateProvider, $urlRouterProvider) {
		    //
		    // For any unmatched url, redirect to /state1
		    $urlRouterProvider.otherwise("/home");
		    //
		    // Now set up the states
		    $stateProvider
		        .state('home', {
		            url: "/home",
		            templateUrl: staticUrl("templates/home.html"),
		            controller: "MainController"
		        })
		        .state('instructors', {
		            url: "/instructors",
		            templateUrl: staticUrl("templates/instructors.html"),
		            controller: "InstructorsController"
		        })
		        .state('instructors.schedules', {
		            url: "/:username/schedules",
		            templateUrl: staticUrl("templates/instructor_schedules.html"),
		            controller: "InstructorSchedulesController"
		        })
		});
		
});
