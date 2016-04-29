angular.module("app")
    .directive("notifications", function() {
        return {
            templateUrl: "/views/common/notifications.html",
            controller: "NotificationCtrl"
        }
    });