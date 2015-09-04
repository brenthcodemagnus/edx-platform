'use strict';
var dependencies = [
	'angular',
	'ui-bootstrap',
	'jquery',
	'moment',
	'ui-calendar',
	'full-calendar'
];

define( dependencies ,function( angular ){
	
	angular.module("instructors-schedules-module", ['ui.bootstrap', 'ui.calendar'])

	.service("InstructorSchedulesService", ["$http", "$q", function($http, $q){
		// this function gets schedules created by
		// instructor (identified by username)
		// for this course

		var urls = {
			INSTRUCTOR_SCHEDULES: "http://" + config.BASE_URL + "/api/consultation/v0/"+config.COURSE_ID+"/schedules",
			API_URL: "http://" + config.BASE_URL + "/api/consultation/v0"
		};

		this.getInstructorSchedules = function(username){
			return $http.get(urls.INSTRUCTOR_SCHEDULES + "/" + username);
		};

		this.reserveSchedule = function(schedule_id){
			var url = urls.API_URL + "/schedules/" + schedule_id + "/reserve";
			return $http.post(url);
		};
	}])

	.controller("InstructorSchedulesController", ["$scope", "$stateParams", "$state", "InstructorSchedulesService", "$log", "uiCalendarConfig", function($scope, $stateParams, $state, InstructorSchedulesService, $log, uiCalendarConfig){
		
		var instructorUsername = $stateParams.username;
		console.log("username is: " + instructorUsername);
		
		$scope.events = [];

        $scope.availableSchedules = {
             color: '#A1D490',
             textColor: 'white',
             //editable: false,
             events: []
        };

        $scope.takenSchedules = {
             color: '#D4A190',
             textColor: 'white',
             //editable: false,
             events: []
        };

		$scope.eventSources = [$scope.availableSchedules/*, $scope.takenSchedules*/];

		$scope.alertEventOnClick = function(date, jsEvent, view){
			$log.log(date);
			$scope.changeView("agendaDay");
		};

		// reserveSchedule
		$scope.reserveSchedule = function(schedule, jsEvent, view){
			
			console.log("schedule is: ");
			console.log(schedule);
	        
			var response = confirm("Do you want to reserve to this schedule?");
			var schedule_id = schedule.schedule_id;

			if(response){
				//reserve the student for this course
				InstructorSchedulesService
					.reserveSchedule(schedule_id)
					.then(
						function(response){
							console.log(response);
							alert("Reservation successful");
						},
						function(error){
							console.log(error)
							alert("Reservation failed");
						}
					);
			}
	        //$scope.changeView("agendaDay", date);
		};

		/* config object */
		$scope.uiConfig = {
		    calendar:{
		        height: 450,
		        editable: true,
		        header:{
		            left: 'month basicWeek basicDay agendaWeek agendaDay',
		            center: 'title',
		            right: 'today prev,next'
		        },
		        //dayClick: $scope.alertEventOnClick,
		        eventClick: $scope.reserveSchedule,
		        eventDrop: $scope.alertOnDrop,
		        eventResize: $scope.alertOnResize
		    }
		};

        /* Change View */
        $scope.changeView = function(view, date) {
        	
        	var calendar = "mainCalendar";

            uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);

            // goto date if provided
            if(date){
            	$log.log("gotoDate:");
            	$log.log(date)
            	$log.log(date.start)
				uiCalendarConfig.calendars[calendar].fullCalendar('gotoDate', date.start);
            }
        };

		$scope.mapSchedulesToCalendar = function(schedules){
			var schedule,
				local_start_date,
				local_end_date;

			for(var i=0; i<schedules.length; i++){
				
				schedule = schedules[i];

				local_start_date = new Date(schedule['start_date']);
				local_end_date = new Date(schedule['end_date']);

				var formattedSchedule = {
					//title: "Schedule " + (i+1),
					schedule_id: schedule.id,
					start: local_start_date,
					end: local_end_date,
					stick: true
				};

				// if schedules is available, add to availableSchedules events
				if(!schedule.student){
					// available
					$scope.availableSchedules.events.push(formattedSchedule);
				}
				else{
					// don't push it
					//$scope.takenSchedules.events.push(formattedSchedule);

					// NOTE: and dont add $scope.takenSchedules into $scope.eventSources
				}
			};
		};

		$scope.getSchedules = function(username){
			InstructorSchedulesService
				.getInstructorSchedules(username)
				.then(
					function(response){
						console.log(response);
						
						$scope.schedules = response.data;

						$scope.mapSchedulesToCalendar($scope.schedules);
					},
					function(error){
						alert("Cannot fetch schedules");
						console.log(error)
					}
				);
		};

		// $scope.back = function(){
		// 	$scope.refresh();
		// 	$state.go("instructors");
		// };

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
