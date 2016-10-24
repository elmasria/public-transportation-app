(function () {
	'use strict';

	angular.module('public-transportation-app')
	.directive('tripSchedule', [ tripScheduleDirective]);

	function tripScheduleDirective() {
		return {
			restrict:'E',
			replace: true,
			templateUrl: "./templates/trip-schedule.html",
		}
	}
}());