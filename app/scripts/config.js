function config($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    //$urlRouterProvider.otherwise("/404");

    jQuery.ajaxSetup({cache: true});

    $stateProvider
        .state('main', {
            url: "/",
            templateUrl: "/views/landing.html",
            data: {
                pageTitle: 'landing'
            },
            controller: "LandingCtrl"
        })
        .state('landing', {
          url: "/landing",
          templateUrl: "/views/landing.html",
          data: {
           pageTitle: 'landing'
          },
          controller: "LandingCtrl"
        })
        .state('connectaccount', {
            url: "/connectaccount",
            templateUrl: "/views/connect_account.html",
            data: {
                pageTitle: 'connect_account'
            },
            controller: "ConnectAccountCtrl"
        })
        .state('updates', {
            url: "/updates",
            templateUrl: "/views/application_updates.html",
            data: {
                pageTitle: 'updates'
            },
            controller: "ApplicationUpdatesCtrl"
        })
        .state('404', {
            url: "/404",
            templateUrl: "/views/404.html",
            data: {
                pageTitle: 'no_page'
            },
            controller: "404Ctrl"
        })
        .state('profile', {
            url: "/profile",
            templateUrl: "/views/profile.html",
            data: {
                pageTitle: 'profile'
            },
            controller: "ProfileCtrl"
        })
        .state('calendar', {
            url: "/calendar",
            templateUrl: "/views/calendar.html",
            data: {
                pageTitle: 'calendar'
            },
            controller: "CalendarCtrl"
        })
        .state('bookmarks', {
            url: "/bookmarks",
            templateUrl: "/views/bookmarks.html",
            data: {
                pageTitle: 'bookmarks'
            },
            controller: "BookmarksCtrl"
        })
        .state('voting', {
            url: "/voting",
            templateUrl: "/views/voting.html",
            data: {
                pageTitle: 'voting'
            },
            controller: "VotingCtrl"
        })
        .state('blank_page', {
            url: "/blank_page",
            templateUrl: "/views/blank_page.html",
            data: {
                pageTitle: 'blank_page'
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

    var defaultLang = "ru";
    var lang = "ru";//navigator.language || navigator.userLanguage;
    $rootScope.lang = (lang || defaultLang).slice(0, 2);

    $rootScope.setLanguage = function(lang) {
        var api = $injector.get('api');

        $rootScope.lang = lang || defaultLang;
        $rootScope.$broadcast('languageChange', $rootScope.lang);

        if($rootScope.user) {
            api.user.update({
                query: {email: $rootScope.user.email},
                data: {
                    lang: lang || defaultLang
                }
            });
        }
    };

    $rootScope.getLanguage = function() {
        return $rootScope.lang || defaultLang;
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
            $rootScope.$broadcast('userDisconnect');
            $rootScope.user = null;
            $rootScope.redirectToMainPage();
        });
    };

    var authOnly = function(state) {
        var states = ["profile", "calendar", "bookmarks", "voting"];

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
            $rootScope.lang = data.lang || $rootScope.lang;

            $rootScope.pending = false;

            $rootScope.feeds = {};

            $rootScope.$broadcast('userConnect');

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

    $rootScope.$on('$stateChangeStart', function(event, toState) {
        $rootScope.pageTitle = toState.data.pageTitle || "dashboard";
        $rootScope.checkAuthentication();
    });

    $(document).ready(function() {
        $rootScope.checkAuthentication();

        $("body").click(function(event) {
            $rootScope.$broadcast('clickEvent', event);
        });
    });
  });