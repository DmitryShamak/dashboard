var app = angular.module("app", ["ngMask"]);
var dashboardCtrl = require("./controllers/dashboard.js");
var boardNoteDir = require("./directives/boardNote.js");

app.controller("dashboardCtrl", dashboardCtrl);
app.directive("boardNote", boardNoteDir);