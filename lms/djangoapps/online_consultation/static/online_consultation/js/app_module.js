'use strict';
define(['angular','ui-router'],function(angular, ui_router){

	angular
		.module("app", ['ui.router'])
		
		.controller("MainController", ["$scope", function($scope){
			$scope.title = "This is the title";

			$scope.content = "This is the content";
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
		        .state('about', {
		            url: "/about",
		            templateUrl: staticUrl("templates/about.html")
		        })
		});
		
});
