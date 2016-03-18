function config($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    //$urlRouterProvider.otherwise("/404");

    jQuery.ajaxSetup({cache: true});

    $stateProvider
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
            url: "/page_1",
            templateUrl: "/views/blank_page.html",
            data: {
                pageTitle: 'Profile'
            },
            controller: "BlankPageCtrl"
        })
        .state('page_1', {
            url: "/page_1",
            templateUrl: "/views/blank_page.html",
            data: {
                pageTitle: 'Page 1'
            },
            controller: "BlankPageCtrl"
        })
        .state('page_2', {
            url: "/page_2",
            templateUrl: "/views/blank_page.html",
            data: {
                pageTitle: 'Page 2'
            },
            controller: "BlankPageCtrl"
        })
        .state('page_3', {
            url: "/page_3",
            templateUrl: "/views/blank_page.html",
            data: {
                pageTitle: 'Page 3'
            },
            controller: "BlankPageCtrl"
        });
}

angular
  .module('app')
  .config(config)
  .run(function($rootScope, $state, $injector, $location) {
    $rootScope.apply = function(scope) {
        if (scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest') {
            scope.$apply();
        }
    };

    $rootScope.signout = function() {
        var api = $injector.get('api');
        api.signout(function(res) {
            $rootScope.redirectToMainPage();
        });
    };

    $rootScope.checkAuthentication = function() {
        if($rootScope.user || $rootScope.pending) {
            return;
        }

        var api = $injector.get('api');
        $rootScope.pending = true;
        api.check_auth(function(res) {
            var state = $state.current.name || $location.path();
            $rootScope.user = res.data;
            $rootScope.pending = false;

            if(!state) {
                $state.go("profile");
            } else {
                $rootScope.apply($rootScope);
            }
        });
    };

    $rootScope.redirectToMainPage = function() {
        $state.go("landing");
    };

    $rootScope.$on('$stateChangeStart', function() {
        console.log($rootScope.user);
        $rootScope.checkAuthentication();
    });

    $(document).ready(function() {
        $rootScope.checkAuthentication();
    });
  });