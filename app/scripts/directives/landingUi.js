angular.module("app")
	.directive("invitationUi", function() {
		return {
			templateUrl: "/views/templates/invitation.html",
			replace: true
		}
	})
	.directive("personalUi", function() {
		return {
			templateUrl: "/views/templates/personal.html",
			replace: true
		}
	});