angular.module("app")
	.controller("ApplicationUpdatesCtrl", function($rootScope, $scope, updatesContent) {
		$scope.page = {};

		$scope.init = function() {
			$scope.page.busy = false;
			$scope.page.offline = false;

			$scope.updates = updatesContent;
		};

		$scope.init();
	});
