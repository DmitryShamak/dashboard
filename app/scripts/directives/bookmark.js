angular.module("app")
	.directive("bookmark", function(api) {
		return {
			templateUrl: "/views/templates/bookmark.html",
			replace: true,
			scope: {bookmark: "="}, //@ string, = model, & method
			link: function(scope) {
				scope.toggleBookmark = function() {
					if(scope.bookmark.busy) {
						return;
					}

					scope.bookmark.busy = true;
					if(scope.bookmark.exists) {
						api.bookmarks.delete({
							user: scope.$parent.user._id,
							link: scope.bookmark.link
						}, function() {
							scope.bookmark.exists = false;
							scope.bookmark.busy = false;
						});
					} else {
						api.bookmarks.save({
							data: {
								user: scope.$parent.user._id,
								label: scope.bookmark.label,
								link: scope.bookmark.link,
								image: scope.bookmark.image,
								provider: scope.$parent.provider
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
						user: scope.$parent.user._id,
						link: scope.bookmark.link
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