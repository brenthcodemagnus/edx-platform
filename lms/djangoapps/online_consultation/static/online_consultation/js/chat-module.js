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
		
		var apiKey;

		var sessionId;

		var session;

		$scope.session_id = $state.params['session_id'];
		
		$scope.initOpenTok = function(){
			apiKey = 45327842;
			sessionId = '2_MX40NTMyNzg0Mn5-MTQ0MTAyMzc3OTU2M35OZTdKdlU3cGJSVGYrNEVEandsenlnKzF-UH4';
			session = OT.initSession(apiKey, sessionId);

			var token = 'T1==cGFydG5lcl9pZD00NTMyNzg0MiZzaWc9Y2ZiMmE1OWRmZDQwOTZiN2U2YzM2MTQ3NmJhM2YzYjk3MWRlM2VjMDpyb2xlPXB1Ymxpc2hlciZzZXNzaW9uX2lkPTJfTVg0ME5UTXlOemcwTW41LU1UUTBNVEF5TXpjM09UVTJNMzVPWlRkS2RsVTNjR0pTVkdZck5FVkVhbmRzZW5sbkt6Ri1VSDQmY3JlYXRlX3RpbWU9MTQ0MTA5NTgyOCZub25jZT0wLjY5NzY1OTI5MTk3OTYxNTUmZXhwaXJlX3RpbWU9MTQ0MTE4MjIyOA==';
			session.connect(token, function(error) {
			    if (error) {
			        console.log(error.message);
			    } else {
			        console.log('connected to session');
			        session.publish('myPublisherDiv', {width: 320, height: 240});
			    }
			});

			session.on({
				streamCreated: function(event) { 
					session.subscribe(event.stream, 'subscribersDiv', {insertMode: 'append'}); 
				}
			});
		};

		// self invoking initialization function
		(function init(){
			console.log("session_id is: " + $scope.session_id);
			$scope.initOpenTok();

		})();

	}])
})
