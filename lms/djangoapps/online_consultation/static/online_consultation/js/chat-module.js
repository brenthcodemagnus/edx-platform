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

	.controller("ChatController", ["$scope", "$state", "$stateParams", function($scope, $state, $stateParams){
		
		var apiKey

		// two things we need to create a session
		var sessionId, token;

		var session;

		var initStateCredentials = function(){
			sessionId = $state.params['session_id'];
			token = $state.params['token'];

			console.log("Initialized state credentials with:");
			console.log("sessionId = ");
			console.log(sessionId);
			console.log("token = ");
			console.log(token);
		};

		// this function will check if there are passed credentials
		var checkStateCredentials = function(){
			// check if sessionId exists
			if(sessionId == "IS_MISSING" || !sessionId){
				alert("Missing sessionId");
				return;
			}

			// check if token exists
			if(token == "IS_MISSING" || !token){
				alert("Missing token");
				return;
			}			
			//pass for now
			return;
		};
		
		var initOpenTok = function(){
			// hard code our apiKey Note: this is slightly bad
			apiKey = 45327842;
			
			// initialize session			
			session = OT.initSession(apiKey, sessionId);
			
			session.connect(token, function(error) {
			    if (error) {
			    	console.log("Could not connect to session:");
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

			initStateCredentials();
			checkStateCredentials();
			initOpenTok();

		})();

	}])
})
