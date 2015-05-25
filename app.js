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

var app = express();
var server;
var io = require("socket.io")(server);
var globalSocket;
io.on('connection', function(socket) {
	globalSocket = socket; 
	console.log("Socket connected");
});
var port = 1505;
var getAction = function(url) {
	var action = "unknown",
		i = 0,
		actions = ["add", "update", "delete", "remove", "get", "set", "signup"];
	while(i < actions.length) {
		if(url.indexOf(actions[i])) {
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

app.post('/login', myPassport.authenticate('local', {failureRedirect: '/sign_in'}), function (req, res) {
    showRedirectMessage(false, "Login succeeded.", "/", res)
});
//NEXT ADD VALIDATION
app.post('/signup', function(req, res) {
	if(!req.body && req.body.email && req.body.password && req.body.password == req.body.confirmpassword) {
		return res.end("Sign Up failed.");
	}

	var testUnique = function() {
		var responder = Promise.pending();
		db.checkUnique("User", {email: req.body.email}, responder);
		return responder.promise;
	};
	var f = function() {
		var responder = Promise.pending();
		req.body.role = "user";
		db.add("User", req.body, responder);
		return responder.promise;
	};
	testUnique().then(function() { return f(); })
	.then(function(results) { 
		showRedirectMessage(false, "Sign Up Done.", "/", res);
	}).catch(function(err) { 
		res.end("Email " + err);
	});
});

app.post('/*', function(req, res, next) {
	var data = {
		user: (req.user) ? req.user.firstname + " " + req.user.lastname : "Guest",
		action: getAction(req.url),
		target: req.body.name
	};
	var f = function() {
		var responder = Promise.pending();
		db.addhistory(data, responder);
		return responder.promise;
	};
	f().then( function() { 
		if(globalSocket) globalSocket.emit("showNotification", data);
		next();
	});
});

app.use("", dashboardRoutes);

var privateTemplates = ['/account/*', "/board*", "/create_project*", "/create_ticket*", "/dashboard*", "/edit_project*", "/ticket*"];
app.get(privateTemplates, user.can('user'), function (req, res, next) {
    next();
});

var showRedirectMessage = function(err, message, redirectUrl, res) {
	res.setHeader("Content-Type", "text/html");
	res.end("<span " + (redirectUrl ? "action='redirect' target='"+redirectUrl+"'" : "") + "'>" +message+"</span>");
};

app.use("", routes);

server = app.listen(port, function() {
	console.log("Application available on %s port", port);
});
