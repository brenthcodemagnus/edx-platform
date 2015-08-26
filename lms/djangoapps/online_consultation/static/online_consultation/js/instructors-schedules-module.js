'use strict';
define(['angular', 'ui-bootstrap'],function( angular, ui_bootstrap){
	
	angular.module("instructors-schedules-module", ['ui.bootstrap'])

	.service("InstructorSchedulesService", ["$http", "$q", function($http, $q){
		// this function gets schedules created by
		// instructor (identified by username)
		// for this course

		var urls = {
			INSTRUCTOR_SCHEDULES: "http://" + config.BASE_URL + "/api/consultation/v0/"+config.COURSE_ID+"/schedules"
		};

		this.getInstructorSchedules = function(username){
			return $http.get(urls.INSTRUCTOR_SCHEDULES + "/" + username);
		};
	}])

	.controller("InstructorSchedulesController", ["$scope", "$stateParams", "$state", "InstructorSchedulesService", function($scope, $stateParams, $state, InstructorSchedulesService){
		
		var instructorUsername = $stateParams.username;
		
		console.log("username is: " + instructorUsername);

		$scope.getSchedules = function(username){
			InstructorSchedulesService
				.getInstructorSchedules(username)
				.then(
					function(response){
						console.log(response);
						$scope.schedules = response.data;
					},
					function(error){
						alert("Cannot fetch schedules");
						console.log(error)
					}
				);
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
				$scope.getSchedules(instructorUsername);
			}
			else{
				$scope.back();
			}
		})();

	}])
})
