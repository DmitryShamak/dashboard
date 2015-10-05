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