angular.module("app")
	.controller("NavigationCtrl", function($scope, $interval) {

		$scope.navigation = {};
		var leftLinks = {};
		leftLinks.landing = {
			title: "landing",
			state: "landing",
			icon: "fa-home"
		};
		leftLinks.connectaccount = {
			title: "connect_account",
			state: "connectaccount",
			icon: "fa-plus",
			authProtected: true,
			authInvert: true,
			hide: !!$scope.user
		};
		leftLinks.profile = {
			title: "profile",
			state: "profile",
			icon: "fa-info",
			authProtected: true,
			hide: !$scope.user
		};
		leftLinks.bookmarks = {
			title: "bookmarks",
			state: "bookmarks",
			icon: "fa-bookmark",
			authProtected: true,
			hide: !$scope.user
		};
		leftLinks.calendar = {
			title: "calendar",
			state: "calendar",
			icon: "fa-calendar",
			authProtected: true,
			hide: !$scope.user
		};
		leftLinks.voting = {
			title: "voting",
			state: "voting",
			icon: "fa-bar-chart",
			authProtected: true,
			hide: !$scope.user
		};
		leftLinks.updates = {
			title: "updates",
			state: "updates",
			icon: "fa-info-circle"
		};
		$scope.navigation.leftLinks = leftLinks;

		var rightLinks = {};
		rightLinks.signout = {
			title: "sign_out",
			state: false,
			action: $scope.signout,
			iconMode: true,
			icon: "fa-sign-out",
			authProtected: true,
			hide: !$scope.user
		};
		$scope.navigation.rightLinks = rightLinks;

		$scope.goTop = function() {
			$(document).scrollTop(0);
		};

		$(document).on("scroll", function() {
			var scrollTop = $(this).scrollTop();
			var minHeight = 500;

			if(scrollTop > minHeight) {
				$(".go-top").removeClass("hidden");
			} else {
				$(".go-top").addClass("hidden");
			}
		});

		$scope.$watch("user", function() {
			_.filter(leftLinks, {authProtected: true}).forEach(function(item) {
				item.hide = item.authInvert ? !!$scope.user : !$scope.user;
			});
			_.filter(rightLinks, {authProtected: true}).forEach(function(item) {
				item.hide = item.authInvert ? !!$scope.user : !$scope.user;
			});

			if($scope.user) {
				var profileImage = $scope.user.photo ? $scope.user.photo.replace('?sz=50', "") : "/dist/imgs/gif/fun.gif";
				var img = new Image();
				img.src = profileImage;
				img.onload = function () {
					$scope.navigation.avatar = {
						'backgroundImage': 'url('+ profileImage + ')'
					};

					$scope.apply($scope);
				}
			}
		});
	});