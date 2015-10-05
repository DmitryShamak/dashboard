var Info = function(attrs) {
	var self = this;
	self.text = attrs.text;
	self.type = attrs.type || "";
};

var backlog = function() {
	return {
		templateUrl: "/public/view/backlog.tmplt",
		replace: true,

		link: function(scope, elem, attrs) {
			scope.backlogVisible = false;

			scope.toggleBacklog = function(state) {
				scope.backlogVisible = !!state;

				if(!scope.backlogVisible && scope.backlog && !scope.backlog.length) {
					scope.backlog = null;
				}
			};

			scope.addToBackLog = function(text, type) {
				if(!scope.backlog) {
					scope.backlog = [];
				}
				scope.backlog.push(new Info({text: text, type: type}));
			};

			scope.removeItem = function(item) {
				scope.backlog.splice(scope.backlog.indexOf(item), 1);

				scope.apply();
			};

			scope.showBackLog = function() {
				scope.toggleBacklog(true);
			};

			scope.clearBackLog = function(err) {
				scope.backlog = null;
				scope.toggleBacklog(false);
			};
		}
	}
};

module.exports = backlog;