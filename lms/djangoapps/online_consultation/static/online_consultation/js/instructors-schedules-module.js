'use strict';
define(['angular', 'ui-bootstrap'],function( angular, ui_bootstrap){
	
	angular.module("instructors-schedules-module", ['ui.bootstrap'])

	.controller("InstructorSchedulesController", ["$scope", "$stateParams", "$state", function($scope, $stateParams, $state){
		
		var instructorUsername = $stateParams.username;
		
		console.log("username is: " + instructorUsername);

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
})
