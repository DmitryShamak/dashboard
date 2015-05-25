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
var port = 1507;

var getAction = function(url) {
	var action = "unknown",
		i = 0,
		actions = ["add", "update", "delete", "remove", "get", "set", "signup"];
	while(i < actions.length) {
		if(url.indexOf(actions[i]) != -1) {
			action = actions[i];
			break;
		}
		i++;
	}
	return action;
};

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret: 'dashboard'}));
app.use(myPassport.initialize());
app.use(myPassport.session());
app.use(express.static("/socket.io"));

app.post('/login', function(req, res, next) {
	myPassport.authenticate('local', function(err, user, info) {
		if(err) { return res.end("server error, please reload page."); }
		if (!user) { res.end("email or password are wrong."); }
		req.logIn(user, function(err) {
	      if (err) { return res.end("server error, please reload page."); }
	      res.end(JSON.stringify({
	      	text: "Login succeeded.",
	      	redirect: "/"
	      }));
	    });
	})(req, res, next);
});

var privateTemplates = ['/account/*', "/board*", "/create_project*", "/create_ticket*", "/dashboard*", "/edit_project*", "/ticket*"];
app.get(privateTemplates, user.can('user'), function (req, res, next) {
    next();
});

app.use("", dashboardRoutes);


app.use("", routes);

var server = app.listen(port, function() {
	console.log("Application available on %s port", port);
});

io.init(server);