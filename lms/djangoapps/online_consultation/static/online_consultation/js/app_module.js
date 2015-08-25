'use strict';
define(['angular','ui-router', 'ui-bootstrap', 'instructors-module' ],function(angular, ui_router, ui_bootstrap, instructors){

	var dependencies = [
		'ui.router',
		'ui.bootstrap',
		'instructors-module'
	]

	angular
		.module("app",  dependencies)

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
		})
		
		.controller("MainController", ["$scope", function($scope){
			$scope.title = "This is the title";

			$scope.content = "This is the content";
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
		

		
});
