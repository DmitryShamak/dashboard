(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var app = angular.module("app", ["ngMask"]);
var dashboardCtrl = require("./controllers/dashboard.js");
var boardNoteDir = require("./directives/boardNote.js");
var editNoteDir = require("./directives/editNote.js");
var confirmDir = require("./directives/confirm.js");
var notificationDir = require("./directives/notification.js");

app.controller("dashboardCtrl", dashboardCtrl);
app.directive("boardNote", boardNoteDir);
app.directive("editNote", editNoteDir);
app.directive("confirm", confirmDir);
app.directive("notification", notificationDir);
},{"./controllers/dashboard.js":2,"./directives/boardNote.js":3,"./directives/confirm.js":4,"./directives/editNote.js":5,"./directives/notification.js":6}],2:[function(require,module,exports){
var Note = function(attrs) {
	var self = this;
	attrs = attrs || {};

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
	$scope.activeNote = null;
	$scope.pending = false;
	$scope.updateMode = false;

	$scope.refresh = function() {
		$scope.showPreloader();
		$http.get("/board")
			.success(function(data) {
				$scope.board = data;
			})
			.error(function(err) {
				err = err || "Connection problems. Service already know about this problem and working on it.";
				$scope.showNotification(err, "warning");
				$scope.board = [];
			})
			.finally($scope.hidePreloader);
	};

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

	$scope.removeNote = function(data) {
		data = data || $scope.activeNote;
		var confirmCb;

		if(data) {
			confirmCb = function() { $scope.post({_id: data._id}, "/remove"); }
			$scope.showConfirmationPopup("Please, confirm deleting.", null, confirmCb);
		} else {
			$scope.closeEdit();
		}
	};

	$scope.post = function(data, url) {
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
				console.info(err);
				$scope.board = [];
			})
			.finally($scope.hidePreloader);
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
		var priorities = ["0", "1", "2", "3"];

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
		$scope.clearActiveNote();
		$scope.editing = false;
		$scope.updateMode = false;

		if(ev) {
			$scope.stopBubbling(ev);
		}
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

	$scope.apply = function() {
		if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
		    $scope.$apply();
		}
	};

	$scope.refresh();
};

module.exports = dashboardCtrl;
},{}],3:[function(require,module,exports){
var boardNote = function() {
	return {
		templateUrl: "/public/view/note.tmpl",
		replace: true,

		link: function(scope, elem, attrs) {
			elem.bind("click", function() {
				scope.selectNote(scope.note, attrs);
			});
			elem.bind("dblclick", function() {
				scope.editNote(scope.note, true);
			});
		}
	}
};

module.exports = boardNote;
},{}],4:[function(require,module,exports){
var confirmDir = function() {
	return {
		templateUrl: "/public/view/confirm.tmplt",
		replace: true,

		link: function(scope, elem, attrs) {
			scope.confirmation = {active: true};

			scope.showConfirmationPopup = function(text, cancelCb, confirmCb) {
				if(!cancelCb) {
					cancelCb = scope.hideConfirmationPopup;
				}

				if(confirmCb) {
					scope.confirmation = {
						onConfirm: confirmCb,
						onCancel: cancelCb,
						text: text,
						active: true 
					};
				}
			};

			scope.hideConfirmationPopup = function() {
				scope.confirmation = {
					onConfirm: null,
					onCancel: null,
					text: "",
					active: false
				};
			};
		}
	}
};

module.exports = confirmDir;
},{}],5:[function(require,module,exports){
var editNote = function() {
	return {
		templateUrl: "/public/view/edit_note.tmplt",
		replace: true
	}
};

module.exports = editNote;
},{}],6:[function(require,module,exports){
var notificationDir = function() {
	return {
		templateUrl: "/public/view/notification.tmplt",
		replace: true,

		link: function(scope, elem, attrs) {
			scope.notification = {type: "default", active: false, delay: 10000};

			scope.showNotification = function(text, type) {
				scope.notification.text = text;
				scope.notification.active = true;
				scope.notification.type = type || "default";

				if(scope.notification.timer) {
					clearTimeout(scope.notification.timer);
					scope.notification.timer = null;
				}

				scope.notification.timer = setTimeout(scope.hideNotification, scope.notification.delay)

				scope.apply();
			};

			scope.hideNotification = function() {
				scope.notification.text = "";
				scope.notification.active = false;
				scope.notification.type = "default";

				scope.apply();
			};
		}
	}
};

module.exports = notificationDir;
},{}]},{},[1,2,3,4,5,6]);
