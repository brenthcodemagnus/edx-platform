require.config({
	paths: {
		'angular': '../bower_components/angularjs/angular',
		'ui-router': '../bower_components/angular-ui-router/release/angular-ui-router',
		'ui-bootstrap': '../bower_components/angular-bootstrap/ui-bootstrap-tpls',
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
		}
	}
});

require(['angular','app_module'], function (angular, app_module) {
	
	'use strict';

	angular.bootstrap(document, ['app']);

});