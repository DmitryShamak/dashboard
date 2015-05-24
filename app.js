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
var port = 1505;

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({secret: 'dashboard'}));

app.use(myPassport.initialize());
app.use(myPassport.session());

app.post('/login', myPassport.authenticate('local', {failureRedirect: '/sign_in'}), function (req, res) {
    res.redirect('/');
});
//NEXT ADD VALIDATION
app.post('/signup', function(req, res) {
	if(!req.body && req.body.email && req.body.password && req.body.password == req.body.confirmpassword) {
		return showRedirectMessage(true, "Sign Up failed.", "/sign_up", res);
	}

	var f = function() {
		var responder = Promise.pending();
		req.body.role = "user";
		db.add("User", req.body, responder);

		return responder.promise;
	};
	f().then(function(results) { res.redirect("/");});
});

app.use("", dashboardRoutes);

var privateTemplates = ['/account/*', "/board*", "/create_project*", "/create_ticket*", "/dashboard*", "/edit_project*", "/ticket*"];
app.get(privateTemplates, user.can('user'), function (req, res, next) {
    next();
});

var showRedirectMessage = function(err, message, redirectUrl, res) {
	if(err) {
		res.setHeader("Content-Type", "text/html");
		return res.end("<h1 style='margin-top: 100px; text-align: center; color: #D33;'>"+message+"</h1><script>setTimeout(function() { window.location.href = '"+redirectUrl+"'; }, 1500);</script>");
	}

	res.setHeader("Content-Type", "text/html");
	res.end("<h1 style='margin-top: 100px; text-align: center;'>"+message+"</h1> <script>setTimeout(function() { window.location.href = '"+redirectUrl+"'; }, 1500);</script>");
};

app.use("", routes);

app.listen(port, function() {
	console.log("Application available on %s port", port);
});
