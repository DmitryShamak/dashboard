angular.module("app")
    .directive("navigationLink", function($rootScope) {
       return {
           templateUrl: "/views/common/navigation_link.html",
           scope: {link: "=navigationLink"},
           link: function(scope) {
               if(!scope.lang) {
                   scope.lang = $rootScope.lang;
               }

               scope.$on('languageChange', function (ev, lang) {
                   scope.lang = lang;
               });
           }
       }
    })
    .directive("linkContent", function($rootScope) {
        return {
            templateUrl: "/views/common/link_content.html",
            scope: {content: "=linkContent"},
            link: function(scope) {
                if(!scope.lang) {
                    scope.lang = $rootScope.lang;
                }

                scope.$on('languageChange', function (ev, lang) {
                    scope.lang = lang;
                });
            }
        }
    });