function config($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $urlRouterProvider.otherwise("/landing");

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

    $rootScope.redirectToMainPage = function() {
        $state.go("landing");
    };

    $rootScope.apply = function(scope) {
      if (scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest') {
          scope.$apply();
      }
    };
  });