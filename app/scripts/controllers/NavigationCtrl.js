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
			hide: !!$scope.user
		};
		leftLinks.profile = {
			title: "Profile",
			state: "profile",
			icon: "fa-info",
			hide: !$scope.user
		};
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
			leftLinks.connectaccount.hide = !!$scope.user;
			leftLinks.profile.hide = !$scope.user;
			rightLinks.signout.hide = !$scope.user;

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