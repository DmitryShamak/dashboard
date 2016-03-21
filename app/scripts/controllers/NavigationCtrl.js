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


		$scope.$watch("user", function() {
			leftLinks.connectaccount.hide = !!$scope.user;
			leftLinks.profile.hide = !$scope.user;
			rightLinks.signout.hide = !$scope.user;

			if($scope.user) {
				var profileImage = $scope.user.photos.length ? $scope.user.photos[0].value.replace('?sz=50', "") : "/dist/imgs/gif/fun.gif";
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