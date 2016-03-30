angular.module("app")
    //.config(['$resourceProvider', function($resourceProvider) {
    //    // Don't strip trailing slashes from calculated URLs
    //    $resourceProvider.defaults.stripTrailingSlashes = false;
    //}])
    .factory("api", function($resource, $window, $http) {
        var api = {};
        api.serverUrl = "http://localhost:3337";
        /*
        * User [add, get, find, update]
        * scoreboard [add, get, update, delete]
        * */
        api.login = $resource(api.serverUrl + "/api/login");
        api.signout = function(callback) {
            var url = api.serverUrl + "/logout";
            $http({
                method: 'GET',
                url: url
            }).then(callback);
        };
        api.check_auth = function(callback) {
            var url = api.serverUrl + "/api/auth";
            $http({
                method: 'GET',
                url: url
            }).then(function(res) {
                if(res.status != 200) {
                    return callback(res.statusText, null);
                }

                callback(null, res.data);
            }).catch(function(res) {
                callback(res.statusText, null)
            });
        };
        api.auth = function(provider) {
            var url = api.serverUrl + "/auth/" + provider.type;
            $window.location.href = url;
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