var app = angular.module("app", ["ngMask"]);
var dashboardCtrl = require("./controllers/dashboard.js");
var boardNoteDir = require("./directives/boardNote.js");
var orderControlDir = require("./directives/orderControl.js");
var editNoteDir = require("./directives/editNote.js");
var confirmDir = require("./directives/confirm.js");
var notificationDir = require("./directives/notification.js");
var navLinkDir = require("./directives/navLink.js");

app.controller("dashboardCtrl", dashboardCtrl);
app.directive("boardNote", boardNoteDir);
app.directive("orderControl", orderControlDir);
app.directive("editNote", editNoteDir);
app.directive("confirm", confirmDir);
app.directive("notification", notificationDir);
app.directive("navigationLink", navLinkDir);