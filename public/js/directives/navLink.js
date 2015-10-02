var navLink = function() {
	return {
		templateUrl: "/public/view/nav_link.tmplt",
		replace: true,

		link: function(scope, elem, attrs) {
			scope.onLinkClick = function() {
				scope.setActiveLink(scope.link);
			};

			elem.bind("click", function() {
				scope.onLinkClick();
			});
		}
	}
};

module.exports = navLink;