angular.module("app")
.controller("LandingCtrl", function($rootScope, $scope, api) {
		$scope.now = $scope.today().format("DD.MM.YYYY");
		$scope.page = {
			busy: true
		};

		$scope.faker = function() {
			var feeds = _.filter($scope.user.plugins, {category: "scrappers"});
			$scope.feeds = feeds;
		};

		$scope.toggleFeed = function(feed) {
			feed.active = !feed.active;
		};

		$scope.init = function() {
			$scope.page.busy = false;
			$scope.page.offline = false;
		};

		$scope.$watch("user", function() {
			if($scope.user) {
				$scope.faker();
			}
		});
		$scope.init();
	});
