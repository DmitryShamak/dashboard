angular.module("app")
    .directive("appendDirective", function($compile) {
        return {
            scope: {directive: "=appendDirective"},
            link: function (scope, element, attrs) {
                angular.element(element).append($compile("<div " + scope.directive.attr + " parent='" + scope.directive.parent + "'></div>")(scope));
            }
        }
    });