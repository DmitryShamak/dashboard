(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var app = angular.module("app", ["ngMask"]);

var dashboardCtrl = require("./controllers/dashboard.js");
var loginDir = require("./directives/login.js");
var layoutDir = require("./directives/layout.js");
var boardControlDir = require("./directives/boardControl.js");
var backlogDir = require("./directives/backlog.js");
var boardNoteDir = require("./directives/boardNote.js");
var orderControlDir = require("./directives/orderControl.js");
var editNoteDir = require("./directives/editNote.js");
var confirmDir = require("./directives/confirm.js");
var notificationDir = require("./directives/notification.js");
var navLinkDir = require("./directives/navLink.js");

app.controller("dashboardCtrl", dashboardCtrl);
app.directive("login", loginDir);
app.directive("layout", layoutDir);
app.directive("boardControl", boardControlDir);
app.directive("backlog", backlogDir);
app.directive("boardNote", boardNoteDir);
app.directive("orderControl", orderControlDir);
app.directive("editNote", editNoteDir);
app.directive("confirm", confirmDir);
app.directive("notification", notificationDir);
app.directive("navigationLink", navLinkDir);
},{"./controllers/dashboard.js":2,"./directives/backlog.js":3,"./directives/boardControl.js":4,"./directives/boardNote.js":5,"./directives/confirm.js":6,"./directives/editNote.js":7,"./directives/layout.js":8,"./directives/login.js":9,"./directives/navLink.js":10,"./directives/notification.js":11,"./directives/orderControl.js":12}],2:[function(require,module,exports){
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
				$scope.addToBackLog(err, "error");
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
				$scope.addToBackLog(err, "error");
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
		$scope.clearActiveNote();
		$scope.editing = false;
		$scope.updateMode = false;

		if(ev) {
			$scope.stopBubbling(ev);
		}
		$scope.refresh();
	}

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

	$scope.logOut = function() {
		$scope.profile = null;
		$scope.logged = false;
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
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
var boardControl = function() {
	return {
		templateUrl: "/public/view/board_control.tmplt",
		replace: true,

		link: function(scope, elem, attrs) {
			
		}
	}
};

module.exports = boardControl;
},{}],5:[function(require,module,exports){
var boardNote = function() {
	return {
		templateUrl: "/public/view/note.tmplt",
		replace: true,

		link: function(scope, elem, attrs) {
			scope.selectedNotes = [];

			scope.setActiveNote = function(note) {
				scope.selectedNotes.push(note);

				scope.activeNote = note;
				scope.updateControlPanel();
			};

			scope.selectNote = function(note, attrs) {
				if(!note.selected) {
					scope.setActiveNote(note);
					note.selected = true;
				} else {
					scope.unselectNote(note);
				}

				scope.apply();
			};

			scope.unselectNote = function(note) {
				note.selected = false;
				scope.activeNote = scope.selectedNotes(scope.selectedNotes.length-1);

				scope.selectedNotes.splice(scope.selectedNotes.indexOf(note), 1);
				scope.updateControlPanel();

				scope.apply();
			};

			elem.bind("click", function() {
				scope.selectNote(scope.note, attrs);
			});
		}
	}
};

module.exports = boardNote;
},{}],6:[function(require,module,exports){
var confirmDir = function() {
	return {
		templateUrl: "/public/view/confirm.tmplt",
		replace: true,

		link: function(scope, elem, attrs) {
			scope.confirmation = {active: false};

			scope.showConfirmationPopup = function(text, cancelCb, confirmCb) {
				if(!cancelCb) {
					cancelCb = scope.hideConfirmationPopup;
				}

				if(confirmCb) {
					scope.confirmation = {
						onConfirm: function() {
							confirmCb(scope.activeNote, scope.hideConfirmationPopup);
						},
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
},{}],7:[function(require,module,exports){
var editNote = function() {
	return {
		templateUrl: "/public/view/edit_note.tmplt",
		replace: true
	}
};

module.exports = editNote;
},{}],8:[function(require,module,exports){
var layout = function() {
	return {
		templateUrl: "/public/view/dashboard.tmplt",
		replace: false
	}
};

module.exports = layout;
},{}],9:[function(require,module,exports){
var login = function() {
	return {
		templateUrl: "/public/view/login.tmplt",
		replace: false,

		link: function(scope, elem, attrs) {
			scope.profile = null;
			scope.logged = false;
			scope.passLevel = "low";
			scope.validLogData = false;

			scope.logIn = function() {
				scope.profile = {};
				scope.logged = true;
			};

			scope.toggleForm = function() {
				scope.form = {};
				scope.passLevel = "low";
				scope.registration = !scope.registration;
			};

			scope.getPasswordLevel = function() {
				var pass = scope.form.pass || "";

				var levels = ["low", "medium", "hight"],
					ind = 0,
					length = pass.length;

				if(length > 8 && length <= 16) {
					ind = 1;
				} else if(length > 16) {
					ind = 2;
				}

				scope.passLevel = levels[ind];
			};

			scope.confirmPass = function(confirm) {
				return scope.validLogData = scope.form.pass == confirm;
			};

			scope.validate = function(type, value) {
				scope.validLogData = !!scope.form.name && !!scope.form.pass;

				if(scope.registration) {
					scope.validLogData = scope.validLogData && scope.confirmPass(scope.form.cpass);
				}

				return false;
			};
		}
	}
};

module.exports = login;
},{}],10:[function(require,module,exports){
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
},{}],11:[function(require,module,exports){
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
},{}],12:[function(require,module,exports){
var orderControl = function() {
	return {
		templateUrl: "/public/view/order_control.tmplt",
		replace: false,

		link: function(scope, elem, attrs) {
			scope.toggleOrder = function() {
				
			};

			elem.bind("click", function() {
				//TODO: toggleOrder(order.type)
			});
		}
	}
};

module.exports = orderControl;
},{}]},{},[1,2,3,4,5,6,7,8,9,10,11,12]);
