angular.module("app")
	.controller("ProfileCtrl", function($rootScope, $scope, pluginsModal) {
		$scope.page = {};
		$scope.page.profile = {};
		//fake data initializing
		$scope.page.profile.plugins = [];

		$scope.setPlugin = function(plugin) {
			//TODO: check that this plugin is not installed
			$scope.page.profile.plugins.push(plugin);
		};

		$scope.showStore = function() {
			pluginsModal.show($scope);
		};

		$scope.init = function() {
			$scope.page.busy = false;
			$scope.page.offline = false;
		};

		$scope.init();
	});
