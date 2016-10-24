(function () {
	'use strict';

	angular.module('public-transportation-app').controller('mainController', ['constants', '$rootScope' , 'httpService', 'toastService', mainFunction]);

	function mainFunction(cnst, $rootScope, httpService, toast) {

		var controller = this,
		hintMessage ={Station:"Select your station"};

		controller.noResults = true;
		controller.pageTitle = cnst.APP_TITLE;
		controller.worker = null;
		controller.newVersion = false;

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

		controller.formatTime =function (Unformateddate) {
			var d = new Date(Unformateddate);
			return controller._getCorrectTime(d.getHours()) + ":" + controller._getCorrectTime(d.getMinutes());
		};

		controller.formatPlural = function (num) {
			var val = num > 1? "steps" : "step";
			return val;
		};

		controller._getCorrectTime = function (hh) {
			hh = hh >= 10 ? hh : 0+""+hh;
			return hh;
		};

		controller.generateTrip = function () {
			var fromName = $rootScope.departureOptions.selectedOption.Station,
			fromLatitude = $rootScope.departureOptions.selectedOption.Latitude,
			fromLongitude = $rootScope.departureOptions.selectedOption.Longitude,
			toName = $rootScope.arrivalOptions.selectedOption.Station,
			toLongitude = $rootScope.arrivalOptions.selectedOption.Longitude,
			toLatitude = $rootScope.arrivalOptions.selectedOption.Latitude,
			currentDate = new Date(Date.now()),
			dateFormat = currentDate.getFullYear()+""+(currentDate.getMonth() + 1)+""+currentDate.getDate(),
			time = controller._getCorrectTime(currentDate.getHours())+""+controller._getCorrectTime(currentDate.getMinutes());

			if ($rootScope.departureOptions.selectedOption === hintMessage || $rootScope.arrivalOptions.selectedOption === hintMessage) {
				toast.show("Please enter your trip details");
			}else if(fromName === toName){
				toast.show("Please enter a Different stations");
			}else{
				var url = "https://api.tfl.gov.uk/Journey/JourneyResults/"+fromLatitude+","+fromLongitude+
				"/to/"+toLatitude+","+toLongitude+"?nationalSearch=true&date="+dateFormat+
				"&time="+time+"&timeIs=Departing&journeyPreference=LeastTime&fromName="+fromName+
				"&toName="+toName+"&walkingSpeed=Average&cyclePreference=None&alternativeCycle=False"+
				"&alternativeWalking=True&applyHtmlMarkup=False&useMultiModalCall=False&"+
				"walkingOptimization=False&app_id="+cnst.APP_ID+"&app_key="+cnst.APP_KEY;

				httpService.GetData(url).then(function(data){
					console.log(data);
					$rootScope.departureOptions.selectedOption = hintMessage;
					$rootScope.arrivalOptions.selectedOption = hintMessage;
					controller.tripPlan = data.journeys;
					controller.noResults = false;
					$('#newTripModal').modal('toggle');
				}).catch(function(error){
					toast.show(error);
				});
			}
		};

		controller._updateReady = function 	(worker) {
			/*notiy user for new version*/
			controller.newVersion = true;
			controller.worker = worker;

		};

		controller.refresh = function () {
			controller.worker.postMessage({action: 'skipWaiting'});
			controller.newVersion = false;
		};

		controller._trackInstalling = function (worker) {
			var mainController = this;
			worker.addEventListener('statechange', function () {
				if (worker.state === 'installed') {
					controller._updateReady(worker);
				}
			});
		};

		controller.init = function () {
			if (!navigator.serviceWorker) {
				toast.show("sw is not supported");
			} else {
				navigator.serviceWorker.register('/dist/sw.js').then(function (reg) {
					if (reg.waiting) {
						controller._updateReady(reg.waiting);
					}

					if (reg.installing) {
						controller._trackInstalling(reg.waiting);
					}

					reg.addEventListener('updatefound', function () {
						controller._trackInstalling(reg.installing);
					});

					var refreshing;
					navigator.serviceWorker.addEventListener('controllerchange', function () {
						if (refreshing) return;
						window.location.reload();
						refreshing = true;
					});
				}).catch(function (e) {
					toast.show("Registration failed!..");
					window.location.reload();
				});
			}
		};
		controller.init();
	}

}());