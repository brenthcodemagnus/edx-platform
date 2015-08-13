'use strict';
define(['angular','ui-router'],function(angular, ui_router){

	angular
		.module("app", ['ui.router'])
		
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

		.controller("InstructorsController", ["$scope", "InstructorsService", function($scope, InstructorsService){
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

			$scope.noInstructors = function(){
				return $scope.instructors && $scope.instructors.length == 0;
			};

			(function init(){
				$scope.getInstructors();
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
		});
		
});
