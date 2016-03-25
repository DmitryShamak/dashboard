angular.module("app")
	.factory("pluginDetails", function(ngDialog) {
		var dialog = {};
		dialog.show = function(data, scope) {
			ngDialog.open({ 
				template: '/views/templates/pluginDetails.html',
				className: "ngdialog ngdialog-theme-default plugin-details-wrapper",
				controller: function($scope, $timeout) {
					$scope.plugin = angular.copy(data);

					$scope.faker = function(data, callback) {
						var delay = Math.round(Math.random() * 1000);

						$timeout(function() {
							callback(null, data);
						}, delay);
					};

					$scope.installPlugin = function() {
						$scope.pending = true;
						$scope.faker($scope.plugin, function(err, data) {
							$scope.pending = false;
							//TODO: catch and show error
							if(err) {
								return err;
							}

							//TODO: set new plugin to user account
							scope.setPlugin(data);
							$scope.closeThisDialog();
						});
					};

					$scope.onCancel = function() {
						$scope.closeThisDialog();
					};
				}
			});
		};

		return dialog;
	});