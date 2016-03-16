angular.module("app")
	.controller("ConnectAccountCtrl", function($rootScope, $scope) {
		$scope.page = {
			noAccount: false
		};

		$scope.init = function() {
			$scope.pageParams.busy = true;
			$scope.pageParams.offline = false;
		};
	});
