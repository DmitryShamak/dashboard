angular.module("app")
	.controller("TipsCtrl", function($rootScope, $scope, $timeout) {
		$scope.tips = {
			active: false,
			list: []
		};

		$rootScope.addTip = function(tip) {
			if(!$scope.tips.active) {
				return;
			}

			tip.visible = true;

			$scope.tips.list.push(tip);
		};

		$scope.init = function() {
			$scope.tips.active = $scope.user.tips;

			$scope.$watch("user.tips", function() {
				$scope.tips.active = $scope.user.tips;
			});
		};

		if($scope.user) {
			return $scope.init();
		}
		$scope.$on('userConnect', function (event, data) {
			$scope.init();
		});
	});
