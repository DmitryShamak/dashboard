angular.module("app")
    .filter('date', function() {
        return function(input, format) {
            return moment(input).format(format);
        };
    });