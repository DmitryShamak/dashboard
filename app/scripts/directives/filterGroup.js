angular.module("app")
    .directive("filterGroup", function($rootScope) {
        return {
            templateUrl: "/views/templates/filter_group.html",
            replace: true,
            scope: { filterGroup: "=", filterType: "@", callback: "=onSelect"},
            link: function (scope, element) {
                scope.onSelect = function(index, type) {
                    var prevActive = _.find(scope.filterGroup, {active: true});
                    if(prevActive)
                        prevActive.active = false;

                    scope.filterGroup[index].active = true;

                    scope.callback(index, type);
                };

                scope.init = function() {
                    var prevActive = _.find(scope.filterGroup, {active: true});
                    if(!prevActive)
                        scope.filterGroup[0].active = true;
                };

                scope.init();

                if(!scope.lang) {
                    scope.lang = $rootScope.lang;
                }

                scope.$on('languageChange', function (ev, lang) {
                    scope.lang = lang;
                });
            }
        }
    });