angular.module("app")
	.controller("NotificationCtrl", function($rootScope, $scope) {
		$scope.toggleNotificationsList = function() {
			$scope.notifications.active = !$scope.notifications.active;
		};

		var init = function() {
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
				action: $scope.toggleNotificationsList,
				value: 0
			};
		};

		$scope.$on('userConnected', function (event, data) {
			init();
		});

		$scope.$on('clickEvent', function (scopeEvent, $ev) {
			if($($ev.target).closest(".notifications-wrapper").length) {
				return;
			}
			$scope.notifications.active = false;
			$scope.apply($scope);
		});
	});
