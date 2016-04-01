angular.module("app")
.controller("LandingCtrl", function($rootScope, $scope, api) {
		$scope.now = $scope.today().format("DD.MM.YYYY");
		$scope.page = {
			busy: true
		};

		$scope.getFeeds = function() {
			$scope.feeds = { busy: true };

			var feeds = _.filter($scope.user.plugins, {category: "scrappers"});
			var providers = feeds && feeds.map(function(feed) {
					return feed.label.toLowerCase()
				});

			api.feed.get({
				providers: providers
			}, function(res) {
				$scope.feeds.data = res;
				$scope.feeds.busy = false;
			})
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
				$scope.getFeeds();
			}
		});
		$scope.init();
	});
