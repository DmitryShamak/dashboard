angular.module("app")
	.controller("ProfileCtrl", function($rootScope, $scope, pluginsModal, api) {
		$scope.page = {
			busy: true
		};

		$scope.setPluginsUpdate = function(onError) {
			$scope.page.pending = true;
			api.user.update({
				query: {email: $scope.user.email},
				data: {
					plugins: $scope.page.profile.plugins
				}
			}, function() {
				$scope.page.busy = false;
			}, function(err) {
				$scope.page.busy = false;
				onError();
			});
		};

		$scope.setPlugin = function(plugin) {
			//TODO: check that this plugin is not installed
			$scope.page.profile.plugins.push(plugin);
			$scope.setPluginsUpdate();
		};

		$scope.removePlugin = function(index) {
			var backup = $scope.page.profile.plugins.splice(index, 1);
			$scope.setPluginsUpdate(function() {
				$scope.page.profile.plugins.splice(index, 0, backup[0]);
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
