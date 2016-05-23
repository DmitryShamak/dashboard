angular.module("app")
.controller("LandingCtrl", function($rootScope, $scope, api, websocket, dateRanges, feedStatuses, feedDetailsModal, landingContent) {
		$scope.now = $scope.today().format("DD.MM.YYYY");
		$scope.page = {};
		$scope.dateRanges = dateRanges;
		$scope.feedStatuses = feedStatuses;
		$scope.landingContent = landingContent;

		$scope.defaultImage = "https://s-media-cache-ak0.pinimg.com/564x/d1/82/7f/d1827fc0e2a7665e008fee66eebf7a56.jpg";

		$scope.toggleFilterEdit = function() {
			$scope.filterEdit = !$scope.filterEdit;
		};

		$scope.setFilter = function(index, type) {
			var activeList = type === "status" ? $scope.feedStatuses : $scope.dateRanges;

			if(!$scope.feeds.filter) {
				$scope.feeds.filter = {};
			}

			$scope.feeds.filter[type] = activeList[index];
			$scope.filterEdit = false;

			$scope.getFeeds();
		};

		$scope.setUpdateDate = function() {
			$scope.now = $scope.today().format("DD.MM.YYYY");

			var format = "DD.MM.YY hh:mm a";
			var date = moment();
			$scope.feeds.lastUpdate = {
				date: moment().toDate(),
				label: moment().format(format)
			};

			$scope.canRefresh = false;
		};

		$scope.checkUpdates = function() {
			if(!$scope.user.providers.length) {
				return $scope.setUpdateDate();
			}

			if(!$scope.feeds || !$scope.feeds.data || !$scope.feeds.lastUpdate) {
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

		$scope.addToHistory = function(group, feed) {
			if(feed.visited) {
				return;
			}

			api.history.save({
				user: $scope.getUserId(),
				feed: feed._id
			}, function() {
				feed.visited = true;
				group.unreadCount--;
			});
		};

		$scope.markAllAsRead = function(group, data) {
			if($scope.feeds.busy) {
				return;
			}

			var list = data.filter(function(item){
				return !item.visited;
			}).map(function(item) {
				return {
					user: $scope.getUserId(),
					feed: item._id
				}
			});

			group.busy = true;
			api.history.save({
				list: list
			}, function(result) {
				group.busy = false;
				_.forEach(data, function(feed) {
					feed.visited = true;
				});
				group.unreadCount = 0;
			});

			$scope.toggleGroup(group);
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
						date: moment().toDate(),
						range: $scope.feeds.filter.range.value,
						status: $scope.feeds.filter.status.value
					}, function(res) {
						var groups = [];

						_.forEach(res.feeds, function(feed) {
							var group = _.find(groups, {provider: feed.provider});
							if(!group) {
								return groups.push({
									provider: feed.provider,
									label: feed.provider,
									content: [feed],
									unreadCount: (res.feeds.filter(function(item) {return (feed.provider === item.provider && !item.visited)})).length
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

		$scope.openFeed = function(group, index) {
			feedDetailsModal.show(group, index, $scope);
		};

		$scope.init = function() {
			$scope.page.busy = false;
			$scope.page.offline = false;

			if($scope.user) {
				if(!$scope.user.providers.length) {
					return;
				}

				//todo: get user last range and status
				$scope.feeds.busy = false;

				if(!$scope.feeds.filter) {
					$scope.setFilter(0, "status");
					$scope.setFilter(0, "range");
				}

				$scope.socket = websocket.init($scope);

				return $scope.checkUpdates();
			}

			if($scope.user) {
				return $scope.init();
			}
			$scope.$on('userConnect', function () {
				$scope.init();
			});
		};

		$scope.init();
	});
