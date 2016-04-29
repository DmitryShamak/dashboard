angular.module("app")
	.controller("NotificationCtrl", function($rootScope, $scope, notificationParams) {
		$scope.toggleNotificationsList = function() {
			if(!window.Notification) {
				return $scope.notifications.unvailable = true;
			}

			if (Notification.permission != "granted") {
				return Notification.requestPermission(function (status) {
					if (Notification.permission !== status) {
						Notification.permission = status;
						$scope.notifications.offline = false;
					} else {
						return $scope.notifications.offline = true;
					}

					$scope.notifications.active = !$scope.notifications.active;
				});
			}

			$scope.notifications.active = !$scope.notifications.active;
		};

		$scope.addNotification = function(title, options, delay) {
			if (!window.Notification || Notification.permission != "granted") {
				return $scope.notifications.offline = true;
			}

			if(!$scope.notifications.list) {
				$scope.notifications.list = [];
			}

			var notification = new Notification(title, options);

			//todo: show delayed notifications with promise chain
			$scope.notifications.list.push({
				tag: options.tag,
				title: title,
				body: options.body,
				data: options.date || moment().toDate(),
				notification: notification
			});
		};

		$scope.closeNotificationsList = function() {
			$scope.notifications.active = false;
		};

		var init = function() {
			if(!$rootScope.notifications) {
				$scope.notifications = $rootScope.notifications = {};
			}

			if(!window.Notification) {
				return $scope.notifications.unvailable = true;
			}

			$scope.notifications.busy = false;

			$scope.notifications.link = {
				title: "Notifications",
				state: false,
				icon: "fa-bell",
				iconMode: true,
				action: $scope.toggleNotificationsList,
				value: 0
			};

			//todo: get user notifications
			$scope.addNotification("Welcome", {
				body: "Hi, there!",
				data: 'I like peas.',
				icon: notificationParams.icon.info,
				tag: "info"
			});
		};

		$scope.$on('userConnected', function (event, data) {
			init();
		});

		$scope.$on('clickEvent', function (scopeEvent, $ev) {
			if($($ev.target).closest(".notifications-wrapper").length) {
				return;
			}
			$scope.closeNotificationsList();

			$scope.apply($scope);
		});
	});
