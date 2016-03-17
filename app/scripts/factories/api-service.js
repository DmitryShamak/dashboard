angular.module("app")
    //.config(['$resourceProvider', function($resourceProvider) {
    //    // Don't strip trailing slashes from calculated URLs
    //    $resourceProvider.defaults.stripTrailingSlashes = false;
    //}])
    .factory("api", function($resource, $window) {
        var api = {};
        api.serverUrl = "http://localhost:3337";
        /*
        * User [add, get, find, update]
        * scoreboard [add, get, update, delete]
        * */
        api.login = $resource(api.serverUrl + "/api/login");
        api.auth = function(provider) {
            var path = api.serverUrl + "/auth/" + provider.type;
            $window.location.href = path;
        };
        api.user = $resource(api.serverUrl + "/api/user", null, {
            'update': { method:'PUT' }
        });
        api.authenticate = $resource(api.serverUrl + "/api/authenticate");
        api.scoreboard = $resource(api.serverUrl + "/api/scoreboard/:key", null, {
            'update': { method:'PUT' }
        });
        api.source = $resource(api.serverUrl + "/api/source", null, {
            'update': { method:'PUT' }
        });
        api.search = $resource(api.serverUrl + "/api/search");

        return api;
    });