var express = require('express');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var routes = require("./private/routes/router.js");
var dashboardRoutes = require("./private/routes/dashboardRouter.js");
var myPassport = require("./private/modules/myPassport.js");
var user = require("./private/modules/roles.js");
var db = require("./private/modules/db.js");
var Promise = require("bluebird");
var io = require("./private/modules/socket.js");

var app = express();
var server;
var port = 1508;

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'dashboard'}));
app.use(myPassport.initialize());
app.use(myPassport.session());
app.use(express.static("/socket.io"));

var privateTemplates = ['/account/*', "/board*", "/create_project*", "/create_ticket*", "/dashboard*", "/edit_project*", "/ticket*"];
app.get(privateTemplates, user.can('user'), function (req, res, next) {
    next();
});

app.use("", dashboardRoutes);


app.use("", routes);

server = app.listen(port, function() {
	console.log("Application available on %s port", port);
});

io.init(server);