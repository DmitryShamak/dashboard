(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var app = angular.module("app", ["ngMask"]);
var dashboardCtrl = require("./controllers/dashboard.js");
var boardNoteDir = require("./directives/boardNote.js");

app.controller("dashboardCtrl", dashboardCtrl);
app.directive("boardNote", boardNoteDir);
},{"./controllers/dashboard.js":2,"./directives/boardNote.js":3}],2:[function(require,module,exports){
var Note = function(attrs) {
	var self = this;
	attrs = attrs || {};

	self.selected = !!attrs.selected;
	self.title = attrs.title || "[no title]";

	self.favorite = !!attrs.favorite;
	self.type = attrs.type || "other";
	self.priority = attrs.priority || 0;

	self.description = attrs.description || "[no description]";
	self.date = attrs.date || new Date().getTime();
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
				console.info(err);
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
			$scope.update(data);
		} else {
			$scope.add(data);
		}
	}

	$scope.update = function(data) {
		//TODO
		$scope.closeEdit();
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
		$scope.showPreloader();
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
},{}]},{},[1,2,3]);
