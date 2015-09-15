'use strict';
var dependencies = [
	'angular',
	'ui-bootstrap',
	'ng-tok'
	// 'jquery',
	// 'moment',
	// 'ui-calendar',
	// 'full-calendar'
];

define( dependencies ,function( angular, uibootstrap, ngTok ){
	
	angular.module("chat-module", ['ui.bootstrap', 'opentok'])

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

	.controller("ChatController", ["$scope", "$state", "$stateParams", "OTSession", function($scope, $state, $stateParams, OTSession){
		
		var apiKey

		// two things we need to create a session
		var sessionId, token;

		var session;

		var missingCredentials = false;

		var initStateCredentials = function(){
			// get credentials from params
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
			if(!sessionId || !token){
				console.error("Either sessionId or token is null.");
				$state.go('mySchedules');
				missingCredentials = true;
				return;
			}
			else{
				//pass for now
				return;
			}
		};
		
		// var initOpenTok = function(){
		// 	// hard code our apiKey Note: this is slightly bad
		// 	apiKey = 45327842;
			
		// 	// initialize session			
		// 	session = OT.initSession(apiKey, sessionId);
			
		// 	session.connect(token, function(error) {
		// 	    if (error) {
		// 	    	console.log("Could not connect to session:");
		// 	        console.log(error.message);
		// 	    } else {
		// 	        console.log('connected to session');
		// 	        session.publish('myPublisherDiv', {width: 320, height: 240});
		// 	    }
		// 	});

		// 	session.on({
		// 		streamCreated: function(event) { 
		// 			session.subscribe(event.stream, 'subscribersDiv', {insertMode: 'append'}); 
		// 		}
		// 	});
		// };

		$scope.$on("otPublisherError", function(arg1, arg2){
			console.log(arg1);
			console.log(arg2);
				
		});

		var initOpenTok = function(){
			// hard code our apiKey Note: this is slightly bad
			apiKey = 45327842;

			$scope.publisherProps = {width: '100%', height: 400, insertMode: 'append'};
			$scope.subscriberProps = {width: '100%', height:400, insertMode: 'append'};

			OTSession.init(apiKey, sessionId, token, function(error, session) {
				// Here you can do things to the OpenTok session
				// The err is bubbled up from session.connect
			    if (error) {
			    	console.log("Could not connect to session:");
			        console.log(error.message);
			    } else {

			        console.log('connected to session');
			        
			  		// session.publish('myPublisherDiv', $scope.publisherProps);
					
					// session.on({
					// 	streamCreated: function(event) { 
					// 		session.subscribe(event.stream, 'subscribersDiv', $scope.subscriberProps);
					// 	}
					// });
			    }

		    });

		    $scope.streams = OTSession.streams;

		};
		// self invoking initialization function
		(function init(){

			initStateCredentials();
			checkStateCredentials();
			console.log("missingCredentials is: " + missingCredentials);
			if (missingCredentials == false)
				initOpenTok();

		})();

	}])
})
