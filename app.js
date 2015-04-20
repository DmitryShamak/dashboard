var express = require('express');
var path = require('path');

var routes = require("./private/routes/defaultRouter.js");

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.static(path.join(__dirname, './public')));

//ROUTES
app.use("", routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


module.exports = app;
