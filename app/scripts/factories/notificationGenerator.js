angular.module("app")
    .factory("notificationGenerator", function($filter, notificationParams) {
        var generate = function(options, lang) {
            var notification = options;
            notification.icon = notificationParams.icon[notification.type || "info"];

            _.forEach(notification, function(value, key) {
                switch(key) {
                    case "title":
                        notification[key] = $filter('translate')(value, lang);
                        break;
                    case "text":
                        notification[key] = $filter('translate')(value, lang);
                        break;
                }
            });

            notification.body = notification.text + (notification.value || "");

            return notification;
        };


        return generate;
    });