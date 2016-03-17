angular.module("app")
	.controller("404Ctrl", function($rootScope, $scope) {
		$scope.pageParams = {};

		$scope.init = function() {
			$scope.pageParams.busy = false;
			$scope.pageParams.offline = false;
		};

		$scope.init();
	});
