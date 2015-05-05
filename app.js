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
	console.log("/login");
    res.redirect('/');
});

app.get('/user_*', user.can('user'), function (req, res, next) {
    next();
});

app.use("", routes);


module.exports = app;
