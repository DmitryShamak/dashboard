angular.module("app")
    .filter('percent', function() {
        return function(input, total, dec) {
            var percent = total ? ( (input / total) * 100).toFixed(dec || 0) : 0;

            return percent + "%";
        };
    });