(function () {
	'use strict';

	angular.module('public-transportation-app').factory('toastService', ['constants', mainFunction]);

	function mainFunction(cnst) {
		var appToast = new Toast();
		appToast._init();
		return appToast;
	};

	var Toast = function() {
		var self = this;
		self.toast = "";
		self.message = "";
		self.time = 3000;
		self.animationType = "show";
	};

	Toast.prototype._init = function () {
		var self = this,
		toastMainDiv = $("<div>", {
			class: 'toast'
		}),
		toastSpan = $("<span>",{
			class: 'toast-span'
		});
		toastMainDiv.append(toastSpan);
		self.toast = toastMainDiv;
		return null;
	};

	Toast.prototype.show = function(message) {
		var self = this;
		self.toast.find('.toast-span').text(message);
		$('body').append(self.toast);
		self.toast.addClass(self.animationType);
		setTimeout(function(){
			self.toast.removeClass(self.animationType);
		}, self.time);
	};

}());