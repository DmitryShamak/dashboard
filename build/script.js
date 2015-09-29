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
},{}],3:[function(require,module,exports){
var boardNote = function() {
	return {
		templateUrl: "/public/view/note.tmpl"
	}
};

module.exports = boardNote;
},{}]},{},[1,2]);
