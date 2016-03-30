angular.module("app")
	.controller("ProfileCtrl", function($rootScope, $scope, pluginsModal, api) {
		$scope.page = {
			busy: true
		};

		$scope.setPlugin = function(plugin) {
			//TODO: check that this plugin is not installed
			$scope.page.profile.plugins.push(plugin);
			api.user.update({
				query: {email: $scope.user.email},
				data: {
					plugins: $scope.page.profile.plugins
				}
			}, function() {
				console.log("success");
			}, function() {
				console.log("FAIL");
			});
		};

		$scope.showStore = function() {
			pluginsModal.show($scope);
		};

		$scope.init = function() {
			$scope.page.busy = false;
			$scope.page.offline = false;

			$scope.page.profile = {
				plugins: $scope.user.plugins
			};
		};

		$scope.$watch("user", function() {
			if($scope.user) {
				$scope.init();
			}
		})
	});
