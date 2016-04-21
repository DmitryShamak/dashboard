angular.module("app")
	.factory("feedDetailsModal", function(ngDialog) {
		var dialog = {};
		dialog.show = function(group, index, parentScope) {
			ngDialog.open({ 
				template: '/views/templates/feedDetails.html',
				className: 'ngdialog-theme-default feed-details-modal',
				controller: function($scope, api) {
					$scope.modal = {};
					$scope.defaultImage = "https://s-media-cache-ak0.pinimg.com/564x/d1/82/7f/d1827fc0e2a7665e008fee66eebf7a56.jpg";
					$scope.feeds = group.content;
					$scope.feedIndex = index;
					$scope.provider = group.provider;

					$scope.getCurrentFeed = function() {
						$scope.modal.control = {
							next: $scope.feedIndex < ($scope.feeds.length - 1),
							prev: $scope.feedIndex > 0
						};

						if($scope.modal.control.next) {
							$scope.modal.nextFeedLable = $scope.feeds[$scope.feedIndex + 1].label;
						}
						if($scope.modal.control.prev) {
							$scope.modal.prevFeedLable = $scope.feeds[$scope.feedIndex - 1].label;
						}

						$scope.feed = $scope.feeds[$scope.feedIndex];

						parentScope.addToHistory(group, $scope.feed);

						$scope.getFeedDescription();
					};

					$scope.switchFeed = function(dir) {
						if($scope.modal.busy) {
							return;
						}

						var newIndex = $scope.feedIndex + dir;

						if(newIndex >= 0 && newIndex < $scope.feeds.length) {
							$scope.feedIndex = newIndex;
							$scope.getCurrentFeed();
						}
					};

					$scope.getFeedDescription = function() {
						$scope.modal.busy = true;
						$scope.modal.offline = false;

						api.feed.save({
							provider: $scope.provider,
							url: $scope.feed.link
						}, function(res) {
							$scope.feed.details = res.data;
							$scope.modal.busy = false;
						}, function(err) {
							$scope.modal.busy = false;
							$scope.modal.offline = true;
						});
					};

					$scope.init = function() {
						$scope.getCurrentFeed();
					};

					$scope.init();
				} 
			});
		};

		return dialog;
	});