var navLink = function() {
	return {
		templateUrl: "/public/view/nav_link.tmplt",
		replace: true,

		link: function(scope, elem, attrs) {
			scope.onLinkClick = function() {
				scope.getData(scope.link.target);
				scope.link.active = true;
			};

			elem.bind("click", function() {
				scope.onLinkClick();
			});
		}
	}
};

module.exports = navLink;