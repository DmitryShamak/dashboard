angular.module("app")
	.controller("LandingCtrl", function($rootScope, $scope, $interval, $state, api) {
		$scope.pageParams = {};

		$scope.init = function() {
			$scope.pageParams.busy = true;
			$scope.pageParams.offline = false;
		};
	});
