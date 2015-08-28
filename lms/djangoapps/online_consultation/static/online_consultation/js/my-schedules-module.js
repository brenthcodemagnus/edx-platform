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
	
	angular.module("my-schedules-module", ['ui.bootstrap', 'ui.calendar'])

	.service("MySchedulesService", ["$http", "$q", function($http, $q){

		var urls = {
			INSTRUCTOR_SCHEDULES: "http://" + config.BASE_URL + "/api/consultation/v0/"+config.COURSE_ID+"/schedules"
		};

		this.getMySchedules = function(username, role){
			return $http.get(urls.INSTRUCTOR_SCHEDULES + "/" + username + "?role=" + role);
		};
	}])

	.controller("MySchedulesController", ["$scope", "$stateParams", "$state", "MySchedulesService", "$log", "uiCalendarConfig", function($scope, $stateParams, $state, MySchedulesService, $log, uiCalendarConfig){
		
		var user = _getUser();

		console.log("role is:" + user.role);
		console.log("username is:" + user.username);
				

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

		$scope.eventSources = [$scope.availableSchedules];

		$scope.alertEventOnClick = function(date, jsEvent, view){
			$log.log(date);
			$scope.changeView("agendaDay");
		};

		// view event on day view
		$scope.viewEvent = function(date, jsEvent, view){
			
			$log.log(date);
	        
	        /* Change View */
	        $scope.changeView("agendaDay", date);
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
		        eventClick: $scope.viewEvent,
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
					start: local_start_date,
					end: local_end_date,
					stick: true
				};

				// if schedules is available, add to availableSchedules events
				if(!schedule.student){
					//available
					$scope.availableSchedules.events.push(formattedSchedule);
				}
				else{
					$scope.takenSchedules.events.push(formattedSchedule);	
				}
			};
		};

		$scope.getSchedules = function(username, role){
			
			MySchedulesService
				.getMySchedules(username, role)
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

		$scope.noSchedules = function(){
			return $scope.schedules && $scope.schedules.length == 0;
		};

		(function init(){
			$scope.getSchedules(user.username, user.role);
		})();

	}])
})
