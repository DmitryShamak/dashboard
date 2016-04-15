angular.module("app")
.controller("LandingCtrl", function($rootScope, $scope, api, feedDetailsModal) {
		$scope.now = $scope.today().format("DD.MM.YYYY");
		$scope.page = {};
		$scope.defaultImage = "https://s-media-cache-ak0.pinimg.com/564x/d1/82/7f/d1827fc0e2a7665e008fee66eebf7a56.jpg";

		$scope.feeds = $scope.feedsBacklog || null;

		$scope.getFeeds = function() {
			$scope.feeds = {
				lastUpdate: moment().format("DD.MM.YY hh:mm a")
			};

			var feeds = _.filter($scope.user.plugins, {category: "scrappers"});
			var providers = feeds && feeds.map(function(feed) {
					return feed.label.toLowerCase().replace(/[\s\.]/g, "");
				});

			if(!$scope.feeds.busy) {
				$scope.feeds.busy = true;

				api.feed.get({
					userId: $scope.getUserId(),
					providers: providers
				}, function(res) {
					$scope.feeds.data = res.feeds;
					$scope.feeds.busy = false;

					$scope.feedContol.setData($scope.feeds);
				});
			}
		};

		$scope.toggleFeed = function(feed) {
			feed.active = !feed.active;
		};

		$scope.openFeed = feedDetailsModal.show;

		$scope.init = function() {
			$scope.page.busy = false;
			$scope.page.offline = false;

			if($scope.user) {
				$scope.getFeeds();
			}
		};

		$scope.$watch("user", function() {
			if($scope.user && !$scope.feeds) {
				$scope.getFeeds();
			}
		});
		$scope.init();
	});
