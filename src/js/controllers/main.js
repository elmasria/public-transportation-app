(function () {
	'use strict';

	angular.module('public-transportation-app').controller('mainController', ['constants', '$rootScope' , 'httpService', mainFunction]);

	function mainFunction(cnst, $rootScope, httpService) {

		var controller = this,
		hintMessage ={Station:"Select your station"};

		controller.pageTitle = cnst.APP_TITLE;
		$rootScope.departureOptions = {
			availableOptions: [hintMessage],
			selectedOption: hintMessage
		};
		$rootScope.arrivalOptions = {
			availableOptions: [hintMessage],
			selectedOption: hintMessage
		};
		httpService.GetData('./data/stations.json').then(function(data){
			$rootScope.departureOptions.availableOptions = $rootScope.departureOptions.availableOptions.concat(data);
			$rootScope.arrivalOptions.availableOptions = $rootScope.arrivalOptions.availableOptions.concat(data);
		});
		controller.generateTrip = function () {
			$('#newTripModal').modal('toggle');
		}
	}
}());