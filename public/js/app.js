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