require.config({
	paths: {
		'angular': '../bower_components/angularjs/angular',
		'ui-router': '../bower_components/angular-ui-router/release/angular-ui-router'
	},
	shim: {
		'angular': {
			'exports': 'angular'
		},
		'ui-router': {
			'exports': 'ui-router'
		}
	}
});

require(['app_module', 'angular'], function (app_module, angular) {
	
	'use strict';

	angular.bootstrap(document, ['app']);

});