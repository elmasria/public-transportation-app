(function () {
	'use strict';

	angular.module('public-transportation-app')
	.directive('generateTripModal', [ modalDirective]);

	function modalDirective() {
		return {
			restrict:'E',
			replace: true,
			templateUrl: "./templates/generate-trip-modal.html",
		}
	}
}());