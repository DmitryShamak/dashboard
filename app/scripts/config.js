function config($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $urlRouterProvider
        .otherwise("/404");

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

    $rootScope.signout = function() {
        var api = $injector.get('api');
        api.signout(function(res) {
            $rootScope.user = null;
            $rootScope.redirectToMainPage();
        });
    };

    $rootScope.checkAuthentication = function() {
        if($rootScope.user || $rootScope.pending) {
            return true;
        }

        var api = $injector.get('api');
        $rootScope.pending = true;
        api.check_auth(function(res) {
            var state = $state.current.name || $location.path();
            $rootScope.user = res.data;
            $rootScope.pending = false;
            console.log($rootScope.user);

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

    $rootScope.$on('$stateChangeStart', function() {
        $rootScope.checkAuthentication();
    });

    $(document).ready(function() {
        $rootScope.checkAuthentication();
    });
  });