var boardControl = function() {
	return {
		templateUrl: "/public/view/board_control.tmplt",
		replace: true,

		link: function(scope, elem, attrs) {
			scope.addToBackLog = function(err) {
				if(!scope.backlog) {
					scope.backlog = [];
				}
				scope.backlog.push(err);
			};
		}
	}
};

module.exports = boardControl;