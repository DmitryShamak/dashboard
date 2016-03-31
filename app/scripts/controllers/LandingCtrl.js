angular.module("app")
.controller("LandingCtrl", function($rootScope, $scope, api) {
		$scope.now = $scope.today().format("DD.MM.YYYY");
		$scope.page = {
			busy: true
		};

		$scope.init = function() {
			$scope.page.busy = false;
			$scope.page.offline = false;
		};

		$scope.init();
	});
