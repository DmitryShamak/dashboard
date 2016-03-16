angular.module("app")
	.controller("NavigationCtrl", function($scope) {

		$scope.navigation = {};
		var topLinks = {};
		topLinks.landing = {
			title: "Home",
			state: "landing",
			icon: "fa-home"
		};
		topLinks.page_1 = {
			title: "Page 1",
			state: "page_1",
			icon: "fa-info"
		};
		topLinks.page_2 = {
			title: "Page 2",
			state: "page_2",
			icon: "fa-info"
		};
		topLinks.page_3 = {
			title: "Page 3",
			state: "page_3",
			icon: "fa-info"
		};

		$scope.navigation.topLinks = topLinks;

		//var bottomLinks = {};
		//$scope.navigation.bottomLinks = bottomLinks;

		//update history link
	});