var Note = function(attrs) {
	var self = this;
	attrs = attrs || {};

	self.selected = !!attrs.selected;
	self.title = attrs.title || "[no title]";

	self.favorite = !!attrs.favorite;
	self.type = attrs.type || "other";

	self.description = attrs.description || "[no description]";
	self.date = attrs.date || new Date().getTime();
};

var dashboardCtrl = function($scope, $http) {
	$scope.board = [];
	$scope.activeNote = null;

	$scope.refresh = function() {
		$http.get("/board")
			.success(function(data) {
				$scope.board = data;
			})
			.error(function(err) {
				console.info(err);
				$scope.board = [];
			});
	};

	$scope.add = function(data) {
		//TODO: validate data
		var canSubmit;

		if(data) {
			data = new Note(data);
		}
		canSubmit = !!data;

		if(!canSubmit) {
			return;
		}

		$http({
				url: '/add',
				method: 'POST',
				data: data,
				headers : {'Content-Type': 'application/json'} 
			})
			.success(function() {
				$scope.board.push(new Note(data));
				$scope.closeEdit();
			})
			.error(function(err) {
				console.info(err);
				$scope.board = [];
			});
	};

	$scope.getNoteTypes = function() {
		var types = ["event", "meeting", "task"];

		return types;
	};

	$scope.stopBubbling = function(ev) {
		ev.bubbles = false;
		ev.stopPropagation();
		ev.preventDefault();
	};

	$scope.editNote = function(note) {
		$scope.editing = true;
		$scope.activeNote = note;
	};

	$scope.closeEdit = function(ev) {
		$scope.activeNote = {};
		$scope.editing = false;

		if(ev) {
			$scope.stopBubbling(ev);
		}
	};

	$scope.refresh();
};

module.exports = dashboardCtrl;