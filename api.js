'use strict';
var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");

var app = express();
var port = 3336,
    rootPath = __dirname;

var staticRoot = path.join(rootPath);


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use("/", express.static(staticRoot));

app.all('/*', function(req, res) {
    res.sendfile('index.html');
});

var server = app.listen(port, function() {
    console.log("Server available on [%s] port", port);
});