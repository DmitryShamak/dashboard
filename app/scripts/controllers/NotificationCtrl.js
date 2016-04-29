angular.module("app")
	.controller("NotificationCtrl", function($scope, $rootScope) {
		$scope.init = function() {
			if(!$rootScope.notifications) {
				$scope.notifications = $rootScope.notifications = {};
			}

			$scope.notifications.busy = false;
			$scope.notifications.offline = false;

			$scope.notifications.link = {
				title: "Notifications",
				state: false,
				icon: "fa-bell",
				iconMode: true,
				action: function() {
					$scope.notifications.link.value++;
				},
				value: 0
			};
		};

		$scope.$on('userConnected', function (event, data) {
			$scope.init();
		});
	});
