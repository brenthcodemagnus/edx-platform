'use strict';
var dependencies = [
	'angular',
	'ui-bootstrap',
	'jquery',
	'moment',
	'ui-calendar',
	'full-calendar'
];

define( dependencies ,function( angular, uiBootstrap, jQuery, moment, uiCalendar, fullCalendar ){
	
	angular.module("my-schedules-module", ['ui.bootstrap', 'ui.calendar'])

	.service("MySchedulesService", ["$http", "$q", function($http, $q){

		var urls = {
			INSTRUCTOR_SCHEDULES: "http://" + config.BASE_URL + "/api/consultation/v0/"+config.COURSE_ID+"/schedules",
			POST_SCHEDULES: "http://" + config.BASE_URL + "/api/consultation/v0/schedules/"
		};

		this.getMySchedules = function(username, role){
			return $http.get(urls.INSTRUCTOR_SCHEDULES + "/" + username + "?role=" + role);
		};

		this.submitSchedule = function(schedule){
			// I need the course
			var course_id = config.COURSE_ID;

			schedule["course"] = course_id;

			return $http.post(urls.POST_SCHEDULES, schedule);
		};
	}])

	.controller("MySchedulesController", ["$scope", "$stateParams", "$state", "MySchedulesService", "$log", "uiCalendarConfig", "$timeout", function($scope, $stateParams, $state, MySchedulesService, $log, uiCalendarConfig, $timeout){
		
		var user = _getUser();

		console.log("role is:" + user.role);
		console.log("username is:" + user.username);

		$scope.states = ["initial", "changing", "submitting"];

		$scope.state = "initial";

		$scope.setState = function(state){
			if($scope.states.indexOf(state) != -1){
				$scope.state = state;
			}
			else{
				console.error("Invalid state: " + state);
				console.log("Available states are: ");
				console.log($scope.states);
			}
		};

		$scope.events = [];

        $scope.newSchedules = {
             color: '#D4D290',
             textColor: 'white',
             editable: true,
             events: []
        };

        $scope.availableSchedules = {
             color: '#A1D490',
             textColor: 'white',
             editable: false,
             events: []
        };

        $scope.takenSchedules = {
             color: '#D4A190',
             textColor: 'white',
             editable: false,
             events: []
        };

		$scope.eventSources = [$scope.availableSchedules, $scope.takenSchedules, $scope.newSchedules];

		$scope.alertEventOnClick = function(date, jsEvent, view){
			$log.log(date);
			$scope.changeView("agendaDay");
		};

		$scope.alertOnDrop = function(date, jsEvent, view){
			console.log("alertOnDrop event triggered");
			$log.log(date);
		};

		// view event on day view
		// affected by getView()
		$scope.viewEvent = function(date, jsEvent, view){
			
			$log.log(date);
	        
	        /* Change View */
	        $scope.changeView("agendaDay", date);
		};

		// this becomes true if time was changed
		$scope.needsAdjustment = false;

        $scope.alertEvent = function (event, jsEvent, ui, view) {
        	$scope.needsAdjustment = true;

        	console.log("event is: ");
        	console.log("From " + event.start.toString());
        	console.log("To " + event.end.toString())
        	// event is the event/schedule in fullCalendar world
        	// of which changes are not propagated to the scope
            $timeout(function() {
            	// this is our reference to scope event/schedule
                var sEvent =  findCalendarEvent(event); //$scope.newSchedule;
                sEvent.start = event.start;
                sEvent.end = event.end;
                // by making this dirty we tell uiCalendar to not send updates
                // to fullCalendar.
                sEvent.isDirty = true;
                console.log("sEvent is: ");
            	console.log("From " + sEvent.start.toString());
            	console.log("To " + sEvent.end.toString());
            });
        };

        function findCalendarEvent(event) {
            
            // iterate through all eventSources
            for (var i = 0;i < $scope.eventSources.length;i++){

        		// object containing an array of events
        		var eventSource = $scope.eventSources[i];
        		
        		// array containing events
        		var eventsArray = eventSource.events;

                for(var x = 0; x < eventsArray.length; x++){

            		var currentEvent = eventsArray [x];
            		
                    if (currentEvent._id === event._id) {
                            return currentEvent;
                    }
                }
            }
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
		        eventDragStop: $scope.alertEvent,
		        eventResizeStop: $scope.alertEvent
		    }
		};

		$scope.newSchedule = null;
		var newScheduleIndex = null;

        /* remove schedule */
        var removeSchedule = function(index) {
            $scope.newSchedules.events.splice(index,1);
        };

		// this function cancels the creation of schedule
		// deletes the schedule from array and from view
		// changes view back to month view if it isn't there
		$scope.cancelSchedule = function(){
			
			removeSchedule(newScheduleIndex);

			$scope.setState("initial");

			$scope.changeView("month");
		};

		function adjustTime(dateObj){
			return new Date(Date.parse(dateObj.toISOString()) - (moment().utcOffset() * 60)*1000).toISOString();
		};

		$scope.submitSchedule = function(){
			
			var schedule = $scope.newSchedule;

			var formattedData;

			if($scope.needsAdjustment){
				console.log("needs adjustment");
				formattedData = {
					start_date: adjustTime(schedule.start),
					end_date: adjustTime(schedule.end)
				};
			}
			else{
				console.log("doesn't need adjustment");
				formattedData = {
					start_date: schedule.start.toISOString(),
					end_date: schedule.end.toISOString()
				};
			}

			console.log(formattedData);

			MySchedulesService
				.submitSchedule(formattedData)
				.then(
					function(response){
						console.log(response);
						alert("Success!!! schedule submitted.")
					},
					function(error){
						console.log(error)
						alert("Cannot submit schedule");
					}
				);

		};

        /* add custom event*/
        $scope.createSchedule = function() {

        	// make the state to changing
        	$scope.setState("changing");

        	// add arbitrary event
            // get date today
            var date = new Date();
            //set hours to 9:00 am
            date.setHours(9);
            date.setMinutes(0);
            date.setSeconds(0);

            var start_date = moment(date),
            	
            // make the default time span to 1 hour
            	defaultTimeSpan = 1, //in hours

            	end_date = moment(date).add(defaultTimeSpan, "hours");

            console.log("The schedule to be created: ");
            console.log("From " + start_date.toString());
            console.log("To " + end_date.toString());
            

            $scope.newSchedule = {
            	start: start_date,
            	end: end_date,
            	stick: true
            }

            newScheduleIndex = $scope.newSchedules.events.push($scope.newSchedule) - 1;
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
