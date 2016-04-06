angular.module("app")
.controller("LandingCtrl", function($rootScope, $scope, api) {
		$scope.now = $scope.today().format("DD.MM.YYYY");
		$scope.page = {
			busy: true
		};

		$scope.getFeeds = function() {
			$scope.feeds = {};

			var feeds = _.filter($scope.user.plugins, {category: "scrappers"});
			var providers = feeds && feeds.map(function(feed) {
					return feed.label.toLowerCase()
				});

			if(!$scope.feeds.busy) {
				$scope.feeds.busy = true;

				api.feed.get({
					providers: providers
				}, function(res) {
					$scope.feeds.data = res.feeds;
					$scope.feeds.busy = false;
				});
			}
		};

		$scope.toggleFeed = function(feed) {
			feed.active = !feed.active;
		};

		$scope.init = function() {
			$scope.page.busy = false;
			$scope.page.offline = false;

			if($scope.user) {
				$scope.getFeeds();
			}
		};

		$scope.$watch("user", function() {
			if($scope.user) {
				$scope.getFeeds();
			}
		});
		$scope.init();
	});
