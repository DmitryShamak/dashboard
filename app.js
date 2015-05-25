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
var io = require("socket.io");

var app = express();
var server,
	Sockets = [];
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
	      showRedirectMessage(false, "Login succeeded.", "/", res);
	    });
	})(req, res, next);
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

var server = app.listen(port, function() {
	console.log("Application available on %s port", port);
});

io = io(server);

var spreadNotifications = function(socket, data) {
	console.log(Sockets.length);
	if(Sockets.length) {
		for(var key in Sockets) {
			if(key != Sockets.indexOf(socket)) Sockets[key].emit("showNotification", data);
		}
	}
};

io.on('connection', function(socket) {
 	if(Sockets.indexOf(socket) == -1) {
 		Sockets.push(socket);
 	}
 	socket.on("spreadNotifications", function(data) {
 		spreadNotifications(this, data);
 	})
	socket.on('disconnect', function(socket) {
	 	//Sockets.splice(Sockets.indexOf(socket), 1);
	});
});

