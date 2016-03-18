angular.module("app")
	.controller("NavigationCtrl", function($scope) {

		$scope.navigation = {};
		var topLinks = {};
		topLinks.landing = {
			title: "Landing",
			state: "landing",
			icon: "fa-home"
		};
		topLinks.connectaccount = {
			title: "Connect Account",
			state: "connectaccount",
			icon: "fa-plus",
			hide: !!$scope.user
		};
		topLinks.signout = {
			title: "Sign Out",
			state: false,
			action: $scope.signout,
			icon: "fa-sign-out",
			hide: !$scope.user
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

		$scope.navigation.topLinks = topLinks;

		//var bottomLinks = {};
		//$scope.navigation.bottomLinks = bottomLinks;

		$scope.$watch("user", function() {
			topLinks.connectaccount.hide = !!$scope.user;
			topLinks.signout.hide = !$scope.user;
		});
	});