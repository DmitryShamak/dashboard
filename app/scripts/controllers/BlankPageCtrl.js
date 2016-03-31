angular.module("app")
	.controller("BlankPageCtrl", function($rootScope, $scope) {
		$scope.page = {};

		$scope.init = function() {
			$scope.page.busy = false;
			$scope.page.offline = false;
		};

		$scope.init();
	});
