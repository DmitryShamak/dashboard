angular.module("app")
	.factory("providerDetails", function(ngDialog) {
		var dialog = {};
		dialog.show = function(data, scope) {
			ngDialog.open({ 
				template: '/views/templates/providerDetails.html',
				className: "ngdialog ngdialog-theme-default provider-details-wrapper",
				controller: function($scope, $timeout) {
					$scope.provider = angular.copy(data);

					$scope.faker = function(data, callback) {
						var delay = Math.round(Math.random() * 1000);

						$timeout(function() {
							callback(null, data);
						}, delay);
					};

					$scope.addProvider = function() {
						data.owned = true;
						scope.appendProvider($scope.provider);
						$scope.closeThisDialog();
					};

					$scope.onCancel = function() {
						$scope.closeThisDialog();
					};
				}
			});
		};

		return dialog;
	});