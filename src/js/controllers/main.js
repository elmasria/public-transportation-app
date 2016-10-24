(function () {
	'use strict';

	angular.module('public-transportation-app').controller('mainController', ['$scope','constants', '$rootScope' , 'httpService', 'toastService', 'indexDB', mainFunction]);

	function mainFunction($scope, cnst, $rootScope, httpService, toast, indexDB) {

		var controller = this,
		hintMessage ={Station:"Select your station"};

		controller.pageTitle = cnst.APP_TITLE;
		controller.noResults = true;
		controller.worker = null;
		controller.footerMessge = false;
		controller.offline = false;

		$rootScope.departureOptions = {
			availableOptions: [hintMessage],
			selectedOption: hintMessage
		};

		$rootScope.arrivalOptions = {
			availableOptions: [hintMessage],
			selectedOption: hintMessage
		};

		controller._getCorrectTime = function (hh) {
			hh = hh >= 10 ? hh : 0+""+hh;
			return hh;
		};


		controller._updateReady = function 	(worker) {
			/*notiy user for new version*/
			controller.btnRefresh = true;
			controller.footerMessge = true;
			controller.worker = worker;
			controller.message = 'New version Available';
			$scope.$apply();

		};

		controller._trackInstalling = function (worker) {
			var mainController = this;
			worker.addEventListener('statechange', function () {
				if (worker.state === 'installed') {
					controller._updateReady(worker);
				}
			});
		};


		controller._updateIndicator = function() {
			if (!navigator.onLine) {
				controller.offlineMessage();
				$scope.$apply();
			}else{
				controller.offline = false;
				controller.dismiss();
			}
		};

		controller.init = function () {
			if (!navigator.serviceWorker) {
				toast.show("sw is not supported");
			} else {
				navigator.serviceWorker.register('/public-transportation-app/dist/sw.js',  {scope: '/public-transportation-app/dist/'}).then(function (reg) {
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
					// /window.location.reload();
				});
			}
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
					var newTrip = data;
					newTrip.createdDate = new Date(Date.now());
					newTrip.tripID = data.journeys[0].startDateTime;
					indexDB._addTrip(newTrip);
				}).catch(function(error){
					toast.show(error);
				});
			}
		};

		controller.refresh = function () {
			controller.worker.postMessage({action: 'skipWaiting'});
			controller.footerMessge = false;
		};

		controller.dismiss = function () {
			controller.footerMessge = false;
			$scope.$apply();
		};

		controller.offlineMessage = function (){
			controller.offline = true;
			controller.footerMessge = true;
			controller.btnRefresh = false;
			controller.message = 'No Internet Connection';
		};

		controller.formatTime =function (Unformateddate) {
			var d = new Date(Unformateddate);
			return controller._getCorrectTime(d.getHours()) + ":" + controller._getCorrectTime(d.getMinutes());
		};

		controller.formatPlural = function (num) {
			var val = num > 1? "steps" : "step";
			return val;
		};

		if (navigator.onLine) {
			httpService.GetData('./data/stations.json').then(function(data){
				$rootScope.departureOptions.availableOptions = $rootScope.departureOptions.availableOptions.concat(data);
				$rootScope.arrivalOptions.availableOptions = $rootScope.arrivalOptions.availableOptions.concat(data);
			}).catch(function() {
				controller.offline = false;
				controller.dismiss();
			});
		}else{
			controller.offlineMessage();
		}

		indexDB.getLocalTrip().then(function (trip) {
			console.log(trip);
			if (trip.length > 0) {
				controller.noResults = false;
				controller.tripPlan = trip[0].journeys;
				$scope.$apply();
			}
		});

		controller.init();

		window.addEventListener('online', controller._updateIndicator);
		window.addEventListener('offline', controller._updateIndicator);
	}

}());