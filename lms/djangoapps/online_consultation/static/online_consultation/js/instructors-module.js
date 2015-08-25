'use strict';
define(['angular', 'ui-bootstrap'],function( angular, ui_bootstrap){

	angular.module("instructors-module", ['ui.bootstrap'])

	.service("InstructorsService", ["$q", "$http", function($q, $http){
		var urls = {
			instructors: "http://" + config.BASE_URL + "/api/consultation/v0/instructors/" + config.COURSE_ID
		};

		this.getInstructors = function(){
			return $http.get(urls.instructors);
		};

	}])

	.controller("InstructorsController", ["$scope", "$state", "InstructorsService", function($scope, $state, InstructorsService){

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
					if($scope.instructors[i]["username"]==username){
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

})
