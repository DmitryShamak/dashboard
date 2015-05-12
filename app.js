var express = require('express');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var routes = require("./private/routes/router.js");
var myPassport = require("./private/modules/myPassport.js");
var user = require("./private/modules/roles.js");
var db = require("./private/modules/db.js");

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({secret: 'dashboard'}));

app.use(myPassport.initialize());
app.use(myPassport.session());

app.post('/login', myPassport.authenticate('local', {failureRedirect: '/sign_in'}), function (req, res) {
    res.redirect('/');
});
app.post('/signup', function(req, res) {
	if(!req.body && req.body.email && req.body.password) {
		res.setHeader("Content-Type", "text/html");
		return res.end("<h1 style='text-align: center; color: #D33;>Sign Up was failed.</h1><script>setTimeout(function() { window.location.href = '/sign_up'; }, 3000);</script>");
	}
	db.add("User", req.body);
	res.setHeader("Content-Type", "text/html");
	res.end("<h1 style='text-align: center;'>Sign Up was successful.</h1> <script>setTimeout(function() { window.location.href = '/'; }, 5000);</script>");
});

app.get('/user_*', user.can('user'), function (req, res, next) {
    next();
});

app.use("", routes);


module.exports = app;
