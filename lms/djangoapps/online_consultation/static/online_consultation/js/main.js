require.config({
	paths: {
		// main dependencies
		'angular': '../bower_components/angularjs/angular',
		'ui-router': '../bower_components/angular-ui-router/release/angular-ui-router',
		'ui-bootstrap': '../bower_components/angular-bootstrap/ui-bootstrap-tpls',

		// defined by me

		'instructors-module': './instructors-module',
		'instructors-schedules-module': './instructors-schedules-module',
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
	},
	map: {
	  '*': {
	    'css': '../bower_components/require-css/css' // or whatever the path to require-css is
	  }
	}
});

require(['angular','app_module', 'css!../bower_components/bootstrap/dist/css/bootstrap.css'], function (angular, app_module, bootstrap) {
	
	'use strict';

	angular.bootstrap(document, ['app']);

});