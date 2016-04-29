angular.module("app")
	.controller("BookmarksCtrl", function($rootScope, $scope, api) {
		$scope.page = {};
		$scope.defaultImage = "https://s-media-cache-ak0.pinimg.com/564x/d1/82/7f/d1827fc0e2a7665e008fee66eebf7a56.jpg";

		$scope.deleteBookmark = function(bookmark, index) {
			bookmark.busy = true;
			api.bookmarks.delete({
				user: $scope.user._id,
				link: bookmark.link
			}, function() {
				bookmark.busy = false;

				$scope.bookmarks.splice(index, 1);
			});
		};

		$scope.getBookmarks = function() {
			$scope.page.busy = true;
			$scope.page.offline = false;

			api.bookmarks.get({
				user: $scope.user._id
			}, function(res) {
				$scope.bookmarks = res.data;
				$scope.page.busy = false;
			}, function() {
				$scope.page.busy = false;
				$scope.page.offline = true;
			});
		};

		$scope.init = function() {
			$scope.getBookmarks();
		};

		if($scope.user) {
			return $scope.init();
		}
		$scope.$on('userConnected', function (event, data) {
			$scope.init();
		});
	});
