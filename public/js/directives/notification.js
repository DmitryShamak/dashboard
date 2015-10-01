var notificationDir = function() {
	return {
		templateUrl: "/public/view/notification.tmplt",
		replace: true,

		link: function(scope, elem, attrs) {
			scope.notification = {type: "default", active: false, delay: 10000};

			scope.showNotification = function(text, type) {
				scope.notification.text = text;
				scope.notification.active = true;
				scope.notification.type = type || "default";

				if(scope.notification.timer) {
					clearTimeout(scope.notification.timer);
					scope.notification.timer = null;
				}

				scope.notification.timer = setTimeout(scope.hideNotification, scope.notification.delay)

				scope.apply();
			};

			scope.hideNotification = function() {
				scope.notification.text = "";
				scope.notification.active = false;
				scope.notification.type = "default";

				scope.apply();
			};
		}
	}
};

module.exports = notificationDir;