require.config({
	paths: {
		'angular': '../angularjs/angular'
	},
	shim: {
		'angular': {
			'exports': 'angular'
		}
	}
});

require(['app_module', 'angular'], function (app_module, angular) {
	
	'use strict';

	angular.bootstrap(document, ['app']);

});