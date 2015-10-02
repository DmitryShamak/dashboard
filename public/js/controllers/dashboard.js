var Note = function(attrs) {
	var self = this;
	attrs = attrs || {};

	self._id = attrs._id;

	self.selected = !!attrs.selected;
	self.title = attrs.title || "";

	self.favorite = !!attrs.favorite;
	self.type = attrs.type || "other";
	self.priority = attrs.priority || 0;

	self.description = attrs.description || "";
	self.date = attrs.date || new Date().getTime();

	self.storage = attrs.storage || "note";
};

var dashboardCtrl = function($scope, $http) {
	$scope.board = [];
	$scope.links = [];
	$scope.backlog = null;
	$scope.activeLink;

	$scope.activeNote = null;
	$scope.pending = false;
	$scope.updateMode = false;

	$scope.orders = ["priority", "title", "type", "date"];
	$scope.noteOrder = $scope.orders[0];
	$scope.reverse = true;

	$scope.refresh = function() {
		$scope.getData($scope.activeLink.target);
	};

	$scope.getData = function(url) {
		$scope.showPreloader();
		$http.get(url)
			.success(function(data) {
				$scope.board = data;
			})
			.error(function(err) {
				err = err || "Connection problems. Service already know about this problem and working on it.";
				$scope.addToBackLog(err, "warning");
				$scope.board = [];
			})
			.finally($scope.hidePreloader);
	}

	$scope.showPreloader = function() {
		$scope.pending = true;
	};

	$scope.hidePreloader = function() {
		$scope.pending = false;
	};

	$scope.submit = function(data) {
		if($scope.updateMode) {
			$scope.post(
				{
					_id: data._id,
					upsert: new Note(data)
				}, "/update"
			);
		} else {
			$scope.post(new Note(data), "/add");
		}
	};

	$scope.moveNoteTo = function(storage) {
		var confirmCb;

		if($scope.activeNote) {
			confirmCb = function(data, cb) { $scope.post({_id: data._id}, "/" + storage, cb); }
			$scope.showConfirmationPopup("Please, confirm action `" + storage + "` .", null, confirmCb);
		} else {
			$scope.closeEdit();
		}
	};

	$scope.post = function(data, url, cb) {
		//TODO: validate data
		var canSubmit;
		canSubmit = !!data;

		if(!canSubmit) {
			return;
		}
		$scope.showPreloader();
		$http({
				url: url,
				method: 'POST',
				data: data,
				headers : {'Content-Type': 'application/json'} 
			})
			.success(function() {
				$scope.refresh();
				$scope.closeEdit();
			})
			.error(function(err) {
				err = err || "Connection problems. Please try again later.";
				$scope.addToBackLog(err, "warning");
			})
			.finally(function() {
				$scope.hidePreloader();
				if(cb) {
					cb();
				}
			});
	};

	$scope.getLinks = function() {
		var links = [{
				title: "Notes",
				target: "/board/note"
			}, {
				title: "Archive",
				target: "/board/archive"
			}, {
				title: "Trash",
				target: "/board/trash"
			}
		];

		return links;
	};

	$scope.getNoteTypes = function() {
		//TODO: get data from server
		var types = ["event", "meeting", "task", "bug"];

		return types;
	};

	$scope.getPriorityTitle = function(priority) {
		var priorities = ["low", "medium", "hight", "urgent"];
		priority = priority || 0;

		return priorities[priority];
	};

	$scope.getNotePriorities = function() {
		var priorities = [0, 1, 2, 3];

		return priorities;
	};

	$scope.stopBubbling = function(ev) {
		ev.bubbles = false;
		ev.stopPropagation();
		ev.preventDefault();
	};

	$scope.editNote = function(note, update) {
		$scope.updateMode = !!update;
		if(note) {
			$scope.clearActiveNote();
			$scope.selectNote(note);
		}
		if($scope.activeNote) {
			$scope.editing = true;
		}

		$scope.apply();
	};

	$scope.closeEdit = function(ev) {
		$scope.closeEdit();
		if(ev) {
			$scope.stopBubbling(ev);
		}
		$scope.refresh();
	}

	$scope.closeEdit = function() {
		$scope.clearActiveNote();
		$scope.editing = false;
		$scope.updateMode = false;
	};

	$scope.updateControlPanel = function() {
		//TODO: update control panel
	};

	$scope.clearActiveNote = function() {
		if($scope.activeNote) {
			$scope.activeNote.selected = null;
			$scope.activeNote = null;

			$scope.updateControlPanel();
			$scope.apply();
		}
	};
	$scope.setActiveNote = function(note) {
		if($scope.activeNote) {
			$scope.clearActiveNote();
		}
		$scope.activeNote = note;
		$scope.updateControlPanel();
	};

	$scope.selectNote = function(note, attrs) {
		if(!note.selected) {
			$scope.setActiveNote(note);
			note.selected = true;
		}

		$scope.apply();
	};

	$scope.setActiveLink = function(link) {
		if($scope.activeLink) {
			$scope.activeLink.active = false;
		}

		$scope.getData(link.target);
		$scope.activeLink = link;
		$scope.activeLink.active = true;

		$scope.apply();
	};

	$scope.apply = function() {
		if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
		    $scope.$apply();
		}
	};

	$scope.init = function() {
		$scope.links = $scope.getLinks();
		$scope.setActiveLink($scope.links[0]);

		$scope.refresh();
	};

	$scope.init();
};

module.exports = dashboardCtrl;