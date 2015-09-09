require.config({
	paths: {
		// main dependencies
		'angular': '../bower_components/angularjs/angular',
		'ui-router': '../bower_components/angular-ui-router/release/angular-ui-router',
		'ui-bootstrap': '../bower_components/angular-bootstrap/ui-bootstrap-tpls',

		'domReady': '../bower_components/requirejs-domready/domReady',
		// for angular-ui-calendar
		'jquery': '../bower_components/jquery/dist/jquery.min',
		'moment': '../bower_components/moment/min/moment.min',
		//'ui-calendar': '../bower_components/angular-ui-calendar/src/calendar',
		'ui-calendar': './calendar_hacked',
		'full-calendar': '../bower_components/fullcalendar/dist/fullcalendar.min',
		
		// for opentok		
		'ng-tok': '../bower_components/opentok-angular/opentok-angular',
		'opentok-layout': '../bower_components/opentok-layout-js/opentok-layout',
		// defined by me

		'instructors-module': './instructors-module',
		'instructors-schedules-module': './instructors-schedules-module',
		'my-schedules-module': './my-schedules-module',
		'chat-module': './chat-module',

	},
	shim: {
		'angular': {
			'exports': 'angular'
		},
		'ui-router': {
			'deps': ['angular']
		},
		'ui-bootstrap': {
			'deps': ['angular']
		},
		'instructors-module': {
			'exports': 'instructors-module'
		},
		'instructors-schedules-module': {
			'exports': 'instructors-schedules-module'
		},
		'my-schedules-module': {
			'exports': 'my-schedules-module'
		},
		'ui-calendar': {
			'deps': ['angular']
		},
		'ng-tok': {
			'exports': 'ng-tok',
			'deps': ['angular']
		},
		'opentok-layout': {
			'exports': 'opentok-layout'
		},
	},
	map: {
	  '*': {
	    'css': '../bower_components/require-css/css' // or whatever the path to require-css is
	  }
	}
});

var dependencies = [
	'domReady',
	'angular',
	'app_module',
	'css!../bower_components/bootstrap/dist/css/bootstrap.css',
	'css!../bower_components/fullcalendar/dist/fullcalendar.css'
]

require( dependencies , function ( domReady, angular, app_module, bootstrap) {
	
	'use strict';
	domReady(function () {
		//This function is called once the DOM is ready.
		//It will be safe to query the DOM and manipulate
		//DOM nodes in this function.
		angular.bootstrap(document, ['app']);
	});

});