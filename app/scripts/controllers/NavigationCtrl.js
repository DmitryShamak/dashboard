angular.module("app")
	.controller("NavigationCtrl", function($scope, $interval) {

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
			authProtected: true,
			authInvert: true,
			hide: !!$scope.user
		};
		leftLinks.profile = {
			title: "Profile",
			state: "profile",
			icon: "fa-info",
			authProtected: true,
			hide: !$scope.user
		};
		leftLinks.bookmarks = {
			title: "Bookmarks",
			state: "bookmarks",
			icon: "fa-bookmark",
			authProtected: true,
			hide: !$scope.user
		};
		leftLinks.calendar = {
			title: "Calendar",
			state: "calendar",
			icon: "fa-calendar",
			authProtected: true,
			hide: !$scope.user
		};
		leftLinks.notification = {
			title: "Notifications",
			state: false,
			icon: "fa-bell",
			iconMode: true,
			action: function() {
				leftLinks.notification.value++;
			},
			value: 0,
			authProtected: true,
			hide: !$scope.user
		};
		leftLinks.delay = {
			title: "Delay Action",
			state: false,
			iconMode: true,
			action: function() {},
			icon: "fa-clock-o",
			authProtected: true,
			hide: !$scope.user
		};
		$scope.navigation.leftLinks = leftLinks;

		var rightLinks = {};
		rightLinks.signout = {
			title: "Sign Out",
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
			var delay = 2000;

			if(scrollTop > minHeight) {
				$(".go-top").removeClass("hidden");

				if(!$scope.flashInterval) {
					$scope.flashInterval = $interval(function() {
						$(".go-top").toggleClass("flash");
					}, delay);
				}
			} else {
				$interval.cancel($scope.flashInterval);
				$scope.flashInterval = null;
				$(".go-top").removeClass("flash").addClass("hidden");
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