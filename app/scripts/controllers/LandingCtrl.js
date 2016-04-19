angular.module("app")
.controller("LandingCtrl", function($rootScope, $scope, api, feedDetailsModal) {
		$scope.now = $scope.today().format("DD.MM.YYYY");
		$scope.page = {};
		$scope.defaultImage = "https://s-media-cache-ak0.pinimg.com/564x/d1/82/7f/d1827fc0e2a7665e008fee66eebf7a56.jpg";

		$scope.setUpdateDate = function() {
			var format = "DD.MM.YY hh:mm a";
			var date = moment();
			$scope.feeds.lastUpdate = {
				date: moment().toDate(),
				label: moment().format(format)
			};
		};

		$scope.checkUpdates = function() {
			if(!$scope.user.providers.length) {
				return $scope.setUpdateDate();
			}

			if(!$scope.feeds || !$scope.feeds.lastUpdate) {
				return $scope.getFeeds();
			}

			api.updates.get({
				target: "feed",
				date: $scope.feeds.lastUpdate.date
			}, function(res) {
				if(res && res.hasUpdates) {
					return $scope.getFeeds();
				}
				$scope.setUpdateDate();
			})
		};

		$scope.addToHistory = function(feed) {
			if(feed.visited) {
				return;
			}

			api.history.save({
				user: $scope.getUserId(),
				feed: feed._id
			}, function() {
				feed.visited = true;
			});
		};

		$scope.getFeeds = function() {
			if(!$scope.feeds.busy) {
				$scope.feeds.data = null;
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

						$scope.setUpdateDate();
						$scope.feeds.data = groups;
						$scope.feeds.busy = false;
					});
				})
			}
		};

		$scope.toggleGroup = function(feed) {
			feed.active = !feed.active;
		};

		$scope.openFeed = function(provider, content, index) {
			$scope.addToHistory(content[index]);
			feedDetailsModal.show(provider, content, index);
		};

		$scope.init = function() {
			$scope.page.busy = false;
			$scope.page.offline = false;

			if($scope.user) {
				if(!$scope.user.providers.length) {
					return;
				}

				$scope.checkUpdates();
			}
		};

		$scope.$watch("user", function() {
			$scope.init();
		});
	});
