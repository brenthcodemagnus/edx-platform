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

		this.startSchedule = function(schedule_id, role){
			var action = role == "instructor" ? "start" : "join"

			return $http.post(urls.POST_SCHEDULES + schedule_id + "/" + action);
		};
	}])

	.controller("MySchedulesController", ["$scope", "$stateParams", "$state", "MySchedulesService", "$log", "uiCalendarConfig", "$timeout", function($scope, $stateParams, $state, MySchedulesService, $log, uiCalendarConfig, $timeout){
		
		var user = _getUser();

		$scope.isInstructor = user.role == "instructor";

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
		$scope.eventClick = function(date, jsEvent, view){

			// clicking a schedule in
			// initial state will start it
			if( $scope.state == "initial" ){
		        // get the schedule_id
		        var schedule_id = date.schedule_id;

		        $scope.startSchedule(schedule_id);
			}

			// clicking a schedule while editting
			// i.e. dragging and dropping a schedule
			// to be submitted
			// will view it in week view
			else if( $scope.state == "changing" ){
				console.log("Changing to:");
				console.log(date.start);
				$scope.changeView("agendaDay", date.start);
			}

			// not finished with this part yet
			else{
				console.error("not finished with this part yet");
			}

		};

		var isValidRole = function(role){
			if(role == "instructor"){
				return true;
			}
			if(role == "student"){
				return true;
			}
			return false;
		};

		$scope.startSchedule = function(schedule_id){

			var response = confirm("Start this schedule?");

			if(response){
					if(isValidRole(user.role)){
						MySchedulesService
							.startSchedule(schedule_id, user.role)
							.then(
								function(response){
									console.log(response);
									console.log("Successfully started schedule");

									// redirect to chat view with credentials
									var credentials = response.data;

									$state.go("chat", credentials);
								},
								function(error){
									console.log(error);
									console.error("Cannot start schedule");
								}
							);
					}
					else{
						console.log("invalid role");
					}
					
			}

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
		            left: 'month agendaWeek agendaDay',
		            center: 'title',
		            right: 'today prev,next'
		        },
		        //dayClick: $scope.alertEventOnClick,
		        eventClick: $scope.eventClick,
		        eventDragStop: $scope.alertEvent,
		        eventResizeStop: $scope.alertEvent
		    }
		};

		$scope.newSchedule = null;
		var newScheduleIndex = null;

		var findIndexByScheduleId = function( _id, eventsArray){
			var index;

			for(var i=0; i<eventsArray.length; i++){
				if(eventsArray[i]['_id'] == _id ){
					return i;
				}
			}

			return -1;
		};

        /* remove schedule */
        var removeSchedule = function(index) {
            $scope.newSchedules.events.splice(index,1);
        };

        // this function sort of transfers a new schedule
        // to available schedules but actually, it doesnt
        // this just makes it appear as if
        var transferCreatedSchedule = function(schedule, id){

        	// first remove schedule from newSchedules
        	var index = findIndexByScheduleId(schedule['_id'], $scope.newSchedules.events);

        	if(index != -1){
        		//before removing, save a copy
        		var schedule = angular.copy(schedule);

        		// remove it
        		removeSchedule(index);

        		console.log("schedule was removed");
        		console.log(schedule);
        		
        		//add to available schedules
        		$scope.availableSchedules.events.push({
        			schedule_id: id,
        			start: schedule.start,
	            	end: schedule.end,
	            	stick: true
        		});

        		console.log($scope.availableSchedules.events);
        	}
        	else{
        		console.error("nothing to move");
        	}
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
						console.log("transfer schedule");

						var scheduleID = response.data.schedule_id;
						
						transferCreatedSchedule(schedule, scheduleID);

						$scope.setState("initial");

						$scope.changeView("month");

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
				uiCalendarConfig.calendars[calendar].fullCalendar('gotoDate', date);
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
