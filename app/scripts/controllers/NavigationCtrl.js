angular.module("app")
	.controller("NavigationCtrl", function($scope) {

		$scope.navigation = {};
		var leftLinks = {};
		leftLinks.landing = {
			title: "Landing",
			state: "landing",
			icon: "fa-home"
		};
		leftLinks.connectaccount = {
			title: "Connect Account",
			state: "connectaccount",
			icon: "fa-plus",
			hide: !!$scope.user
		};
		//topLinks.page_2 = {
		//	title: "Page 2",
		//	state: "page_2",
		//	icon: "fa-info"
		//};
		//topLinks.page_3 = {
		//	title: "Page 3",
		//	state: "page_3",
		//	icon: "fa-info"
		//};
		$scope.navigation.leftLinks = leftLinks;

		var rightLinks = {};
		rightLinks.signout = {
			title: "Sign Out",
			state: false,
			action: $scope.signout,
			icon: "fa-sign-out",
			hide: !$scope.user
		};
		$scope.navigation.rightLinks = rightLinks;


		$scope.$watch("user", function() {
			leftLinks.connectaccount.hide = !!$scope.user;
			rightLinks.signout.hide = !$scope.user;
		});
	});