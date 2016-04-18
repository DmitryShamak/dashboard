angular.module("app")
	.directive("bookmark", function(api) {
		return {
			templateUrl: "/views/templates/bookmark.html",
			replace: true,
			scope: {bookmark: "="}, //@ string, = model, & method
			link: function(scope) {
				scope.userId = scope.$parent.getUserId();

				scope.toggleBookmark = function() {
					if(scope.bookmark.busy) {
						return;
					}

					scope.bookmark.busy = true;
					if(scope.bookmark.exists) {
						api.bookmarks.delete({
							user: scope.userId,
							feed: scope.bookmark._id
						}, function() {
							scope.bookmark.exists = false;
							scope.bookmark.busy = false;
						});
					} else {
						api.bookmarks.save({
							data: {
								user: scope.userId,
								feed: scope.bookmark._id
							}
						}, function() {
							scope.bookmark.exists = true;
							scope.bookmark.busy = false;
						});
					}
				};

				scope.checkBookmark = function() {
					scope.bookmark.busy = true;
					scope.bookmark.exists = false;

					api.bookmarks.get({
						user: scope.userId,
						feed: scope.bookmark._id
					}, function(res) {
						if(res.data.length) {
							scope.bookmark.exists = true;
						}
						scope.bookmark.busy = false;
					}, function(err) {
						scope.bookmark.busy = false;
					});
				};

				scope.init = function() {
					scope.$watch("bookmark", function() {
						if(scope.bookmark) {
							scope.checkBookmark();
						}
					});
				};

				scope.init();
			}
		}
	});