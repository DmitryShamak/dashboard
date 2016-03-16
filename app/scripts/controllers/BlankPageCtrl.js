angular.module("app")
	.controller("BlankPageCtrl", function($rootScope, $scope) {
		$scope.pageParams = {};

		$scope.init = function() {
			$scope.pageParams.busy = false;
			$scope.pageParams.offline = false;
		};

		$scope.init();
	});
