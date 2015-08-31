'use strict';
var dependencies = [
	'angular',
	'ui-bootstrap',
	// 'jquery',
	// 'moment',
	// 'ui-calendar',
	// 'full-calendar'
];

define( dependencies ,function( angular ){
	
	angular.module("chat-module", ['ui.bootstrap'])

	// .service("InstructorSchedulesService", ["$http", "$q", function($http, $q){
	// 	// this function gets schedules created by
	// 	// instructor (identified by username)
	// 	// for this course

	// 	var urls = {
	// 		INSTRUCTOR_SCHEDULES: "http://" + config.BASE_URL + "/api/consultation/v0/"+config.COURSE_ID+"/schedules",
	// 		API_URL: "http://" + config.BASE_URL + "/api/consultation/v0"
	// 	};

	// 	this.getInstructorSchedules = function(username){
	// 		return $http.get(urls.INSTRUCTOR_SCHEDULES + "/" + username);
	// 	};

	// 	this.reserveSchedule = function(schedule_id){
	// 		var url = urls.API_URL + "/schedules/" + schedule_id + "/reserve";
	// 		return $http.post(url);
	// 	};
	// }])

	.controller("ChatController", ["$scope", "$state", function($scope, $state){

		$scope.session_id = $state.params['session_id'];

		// self invoking initialization function
		(function init(){
			console.log("session_id is: " + $scope.session_id);
		})();

	}])
})
