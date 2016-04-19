angular.module("app")
.controller("LandingCtrl", function($rootScope, $scope, api, feedDetailsModal) {
		$scope.now = $scope.today().format("DD.MM.YYYY");
		$scope.page = {};
		$scope.defaultImage = "https://s-media-cache-ak0.pinimg.com/564x/d1/82/7f/d1827fc0e2a7665e008fee66eebf7a56.jpg";

		$scope.getFeeds = function() {
			if(!$scope.user.providers.length) {
				return;
			}

			$scope.feeds = {
				lastUpdate: moment().format("DD.MM.YY hh:mm a")
			};

			if(!$scope.feeds.busy) {
				$scope.feeds.busy = true;

				api.provider.get({
					providers: $scope.user.providers
				}, function(providers) {
					api.feed.get({
						userId: $scope.getUserId(),
						providers: providers.data.map(function(item) {return item.name}),
						date: moment().toDate()
					}, function(res) {
						var groups = [];

						_.forEach(res.feeds, function(feed) {
							var group = _.find(groups, {provider: feed.provider});
							if(!group) {
								return groups.push({
									provider: feed.provider,
									label: feed.provider,
									content: [feed]
								})
							}

							group.content.push(feed);
						});

						$scope.feeds.data = groups;
						$scope.feeds.busy = false;
					});
				})
			}
		};

		$scope.toggleGroup = function(feed) {
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
