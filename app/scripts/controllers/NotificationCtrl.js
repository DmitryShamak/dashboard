angular.module("app")
	.controller("NotificationCtrl", function($rootScope, $scope, $filter, notificationParams, notificationGenerator, api) {
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

		$scope.updateLink = function() {
			$scope.notifications.link.value = $scope.notifications.list.length;
			$scope.notifications.link.inverted = !$scope.notifications.list.length;
			$scope.notifications.link.disabled = !$scope.notifications.list.length;
		};

		$scope.deleteNotification = function(data) {
			$scope.notifications.busy = true;
			api.notifications.delete({
				_id: data._id
			}, function() {
				$scope.notifications.busy = false;
				_.remove($scope.notifications.list, function(item) {
					return (item._id == data._id);
				});

				$scope.updateLink();
			});
		};

		$scope.updateNotification = function(data) {
			$scope.notifications.busy = true;
			api.notifications.update({
				query: {
					user: $scope.getUserId(),
					_id: data._id
				},
				data: {
					read: true
				}
			}, function() {
				$scope.notifications.busy = false;
			});
		};

		$scope.getNotifications = function() {
			if($scope.notifications.busy) {
				return;
			}

			$scope.notifications.busy = true;
			api.notifications.get({
				user: $scope.getUserId()
			}, function(res) {
				$scope.notifications.busy = false;
				if(res.data) {
					var list = _.isArray(res.data) ? res.data : [res.data];
					$scope.notifications.list = list.map(function(item) {
						return notificationGenerator(item, $scope.lang);
					});

					$scope.updateLink();

					if($scope.notifications.list.length) {
						var promises = $scope.notifications.list.filter(function(item) {
							return !item.read;
						}).map(function(item) {
							var type = item.type || "info";
							var notification = item;
							notification.icon = notificationParams.icon[type];

							return Q.promise(function(resolve, reject) {
								$scope.showNotification(notification);
								$scope.updateNotification(notification);

								setInterval(resolve, 5000);
							});
						});

						Q.all(promises);
					}
				}
			});
		};

		$scope.showNotification = function(notification) {
			if (!window.Notification || Notification.permission != "granted") {
				return $scope.notifications.offline = true;
			}

			new Notification(notification.title, notification);
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
				title: "notifications",
				state: false,
				icon: "fa-bell",
				invertIcon: "fa-bell-o",
				inverted: true,
				iconMode: true,
				action: $scope.toggleNotificationsList,
				value: 0
			};

			//todo: get user notifications
			$scope.getNotifications();
		};

		if($scope.user) {
			init();
		} else {
			$scope.$on('userConnect', function (event, data) {
				init();
			});
		}

		$scope.$on('userDisconnect', function (event, data) {
			if($scope.notifications) {
				$scope.notifications.hide = true;
			}
		});

		$scope.$on('clickEvent', function (scopeEvent, $ev) {
			if($($ev.target).closest(".notifications-wrapper").length) {
				return;
			}
			$scope.closeNotificationsList();

			$scope.apply($scope);
		});
	});
