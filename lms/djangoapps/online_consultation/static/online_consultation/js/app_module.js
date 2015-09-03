'use strict';
define(['angular','ui-router', 'ui-bootstrap', 'instructors-module', 'instructors-schedules-module', 'my-schedules-module', 'chat-module' ],function(angular, ui_router, ui_bootstrap){

	var dependencies = [
		'ui.router',
		'ui.bootstrap',
		'instructors-module',
		'instructors-schedules-module',
		'my-schedules-module',
		'chat-module',
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
		        .state('mySchedules', {
		            url: "/myschedules",
		            templateUrl: staticUrl("templates/my_schedules.html"),
		            controller: "MySchedulesController"
		        })
		        .state('chat', {
		            url: "/chat",
		            templateUrl: staticUrl("templates/chat.html"),
		            controller: "ChatController",
		            params : {
		            	session_id: "IS_MISSING",
		            	token: "IS_MISSING"
		            }
		        })
		})

		.config(['$httpProvider', function($httpProvider) {
			var csrfToken = _getCSRFToken();

		    $httpProvider.defaults.headers.common['X-CSRFToken'] = csrfToken;
		}])
		
		.controller("MainController", ["$scope", function($scope){
			$scope.title = "This is the title";

			$scope.content = "This is the content";
		}])		
});
