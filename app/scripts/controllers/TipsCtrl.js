angular.module("app")
	.controller("TipsCtrl", function($rootScope, $scope) {
		$scope.closeTip = function() {
			$scope.tip.visible = false;
		};

		$scope.init = function() {
			$scope.tip = {
				visible: false
			};

			//tests
			$scope.tip.visible = true;
			$scope.tip.title = "test_title";
			$scope.tip.body = "test_body";

			$scope.$watch("user.tips", function() {
				$scope.tip.active = $scope.user.tips
			})
		};

		if($scope.user) {
			return $scope.init();
		}
		$scope.$on('userConnect', function (event, data) {
			$scope.init();
		});
	});
