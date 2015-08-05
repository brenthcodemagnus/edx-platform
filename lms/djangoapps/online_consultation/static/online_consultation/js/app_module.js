'use strict';
define(['angular'],function(angular){

	angular
		.module("app", [])
		.controller("MainController", ["$scope", function($scope){
			$scope.title = "This is the title";

			$scope.content = "This is the content";
		}])
		
});
