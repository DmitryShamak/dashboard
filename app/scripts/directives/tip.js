angular.module("app")
	.directive("tip", function() {
		return {
			templateUrl: "/views/common/tip.html",
			controller: "TipsCtrl",
			replace: true
		}
	});