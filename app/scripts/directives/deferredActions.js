angular.module("app")
    .directive("deferredActions", function() {
        return {
            templateUrl: "/views/common/deferred_actions.html",
            controller: "DeferredActionsCtrl"
        }
    });