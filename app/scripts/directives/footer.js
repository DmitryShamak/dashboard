angular.module("app")
	.directive("footer", function() {
		return {
			templateUrl: "/views/footer.html",
			controller: "FooterCtrl",
			replace: true
		}
	});