var express = require('express');
var path = require('path');

var routes = require("./private/routes/defaultRouter.js");

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));

//ROUTES
app.use("", routes);

module.exports = app;
