function config($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    //$urlRouterProvider.otherwise("/404");

    jQuery.ajaxSetup({cache: true});

    $stateProvider
        .state('main', {
            url: "/",
            templateUrl: "/views/landing.html",
            data: {
                pageTitle: 'Landing'
            },
            controller: "LandingCtrl"
        })
        .state('landing', {
          url: "/landing",
          templateUrl: "/views/landing.html",
          data: {
           pageTitle: 'Landing'
          },
          controller: "LandingCtrl"
        })
        .state('connectaccount', {
            url: "/connectaccount",
            templateUrl: "/views/connect_account.html",
            data: {
                pageTitle: 'Connect Account'
            },
            controller: "ConnectAccountCtrl"
        })
        .state('404', {
            url: "/404",
            templateUrl: "/views/404.html",
            data: {
                pageTitle: 'No Page'
            },
            controller: "404Ctrl"
        })
        .state('profile', {
            url: "/profile",
            templateUrl: "/views/profile.html",
            data: {
                pageTitle: 'Profile'
            },
            controller: "ProfileCtrl"
        })
        .state('calendar', {
            url: "/calendar",
            templateUrl: "/views/calendar.html",
            data: {
                pageTitle: 'Calendar'
            },
            controller: "CalendarCtrl"
        })
        .state('bookmarks', {
            url: "/bookmarks",
            templateUrl: "/views/bookmarks.html",
            data: {
                pageTitle: 'Bookmarks'
            },
            controller: "BookmarksCtrl"
        })
        .state('blank_page', {
            url: "/blank_page",
            templateUrl: "/views/blank_page.html",
            data: {
                pageTitle: 'Blank Page'
            },
            controller: "BlankPageCtrl"
        });
}

angular
  .module('app')
  .config(config)
  .run(function($rootScope, $state, $injector, $location) {
    $rootScope.today = function() {
        var today = moment();
        return today;
    };

    $rootScope.apply = function(scope) {
        if (scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest') {
            scope.$apply();
        }
    };

    $rootScope.getUserId = function() {
      return $rootScope.user._id;
    };

    $rootScope.signout = function() {
        var api = $injector.get('api');
        api.signout(function(res) {
            $rootScope.user = null;
            $rootScope.redirectToMainPage();
        });
    };

    var authOnly = function(state) {
        var states = ["profile", "calendar"];

        return (~states.indexOf(state));
    };

    $rootScope.checkAuthentication = function() {
        if($rootScope.user || $rootScope.pending) {
            return true;
        }

        var api = $injector.get('api');
        $rootScope.pending = true;
        api.check_auth(function(err, data) {
            var state = $state.current.name || $location.path().replace(/^\//, "");

            if(err) {
                return (authOnly(state) ? $state.go("landing") : true);
            }

            $rootScope.user = data;
            $rootScope.pending = false;

            if(!state) {
                $state.go("profile");
            } else {
                $rootScope.apply($rootScope);
            }
        });
        return false;
    };

    $rootScope.redirectToMainPage = function() {
        $state.go("landing");
    };

    //Feeds
    $rootScope.feedsBacklog = null;
    $rootScope.feedContol = {
        setData: function(data) {
            $rootScope.feedsBacklog = data;
        }
    };

    $rootScope.$on('$stateChangeStart', function() {
        $rootScope.checkAuthentication();
    });

    $(document).ready(function() {
        $rootScope.checkAuthentication();
    });
  });