angular.module("app")
	.controller("PluginCtrl", function($rootScope, $scope, $stateParams) {
		$scope.page = {};

		$scope.init = function() {
			$scope.page.busy = false;
			$scope.page.offline = false;

			console.log($stateParams);
		};

		$scope.init();
	});
