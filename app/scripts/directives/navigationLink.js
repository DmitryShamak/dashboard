angular.module("app")
    .directive("navigationLink", function() {
       return {
           templateUrl: "/views/common/navigation_link.html",
           scope: {link: "=navigationLink"}
       }
    })
    .directive("linkContent", function() {
        return {
            templateUrl: "/views/common/link_content.html",
            scope: {content: "=linkContent"},
            link: function(scope) {}
        }
    });