(function () {

	'use strict';

	angular.module('public-transportation-app').config(['$routeProvider', configuration]);

	function configuration($routeProvider) {

		$routeProvider.when('/', {

			templateUrl: './templates/new-trip.html'

		}).when('/trip', {

			templateUrl: './templates/new-trip.html'

		}).when('/404', {

			templateUrl: './templates/404.html'

		}).otherwise({

			redirectTo: '/404'

		});

	}

}());