var express = require('express');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var routes = require("./private/routes/router.js");
var myPassport = require("./private/modules/myPassport.js");
var user = require("./private/modules/roles.js");
var db = require("./private/modules/db.js");
var Promise = require("bluebird");

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
//NEXT ADD VALIDATION
app.post('/signup', function(req, res) {
	if(!req.body && req.body.email && req.body.password) { //NEXT check for unique
		return showRedirectMessage(true, "Sign Up failed.", "/sign_up", res);
	}
	db.add("User", req.body);//NEXT check for successful adding
});
app.post('/addproject', function(req, res) {
	if(!req.body && req.body.name) { //NEXT check for unique
		return showRedirectMessage(true, "Project was NOT added.", "/user_create_project", res);
	}
	//ADDING default values to project
	var projectAttrs = req.body;
	projectAttrs.priority = 0;
	projectAttrs.status = 0;
	db.add("Project", req.body);//NEXT check for successful adding
	showRedirectMessage(false, "Project was added successfuly.", "/user_dashboard", res);
});
app.get('/getprojectslist', function(req, res) {
	var getProjectsList = function() {
		var responder = Promise.pending();
		db.find("Project", {}, responder);
		return responder.promise;
	};
	getProjectsList().then(function(results) {
		console.log("RESULTS", results);
		res.send(results);
	});
});
app.post('/addticket/:project', function(req, res) {
	if(!req.body || !req.body.name || !req.params.project) { //NEXT check for unique
		return showRedirectMessage(true, "Ticket was NOT added.", "/user_board/"+req.params.project, res);
	}
	//ADDING default values to project
	var ticketAttrs = req.body;
	ticketAttrs.priority = 0;
	ticketAttrs.status = 0;
	ticketAttrs.project = req.params.project;
	ticketAttrs.assignee = "false";
	db.add("Ticket", req.body);//NEXT check for successful adding
	showRedirectMessage(false, "Ticket was added successfuly.", "/user_board/"+req.params.project, res);
});
app.post('/updateticket/:ticketname', function(req, res) {
	if(!req.body || !req.body.name || !req.params.ticketname) {
		return showRedirectMessage(true, "Ticket was NOT update.", "/user_ticket/"+req.params.ticketname, res);
	}
	//ADDING default values to project
	var ticketAttrs = req.body;
	db.update("Ticket", {name: req.params.ticketname}, ticketAttrs);//NEXT check for successful update
	showRedirectMessage(false, "Ticket was updated successfuly.", "/user_ticket/"+req.params.ticketname, res);
});
app.get(['/gettickets', "/gettickets/:id"], function(req, res) {
	var getTickets = function() {
		var responder = Promise.pending();
		if(req.params.id) db.find("Ticket", {project: req.params.id}, responder);
		else db.find("Ticket", {}, responder);

		return responder.promise;
	};
	getTickets().then(function(results) {
		var getStatus = function(status_id) { //NEXT change to get status title from db
	        var status = "To Do";
	        switch(status_id) {
	            case 0:
	                status = "To Do";
	                break;
	            case 1:
	                status = "In Progress";
	                break;
	            case 2:
	                status = "Done";
	                break;
	        };

	        return status;
	    };
	    var filterTickets = function(arr) {
	        var res = [];
	        var filter = {};

	        for(var i=0; i<arr.length; i++) {
	            var status = arr[i].status;
	            if(!filter[status]) {
	                filter[status] = {
	                    status: getStatus(status),
	                    tickets: []
	                };
	            }

	            filter[status].tickets.push(arr[i]);
	        }

	        for(var key in filter) {
	            res.push(filter[key]);
	        }

	        return res;
	    };
		res.send(filterTickets(results));
	});
});

app.get('/user_*', user.can('user'), function (req, res, next) {
    next();
});

var showRedirectMessage = function(err, message, redirectUrl, res) {
	if(err) {
		res.setHeader("Content-Type", "text/html");
		return res.end("<h1 style='text-align: center; color: #D33;>"+message+"</h1><script>setTimeout(function() { window.location.href = '"+redirectUrl+"'; }, 3000);</script>");
	}

	res.setHeader("Content-Type", "text/html");
	res.end("<h1 style='text-align: center;'>"+message+"</h1> <script>setTimeout(function() { window.location.href = '"+redirectUrl+"'; }, 5000);</script>");
};

app.use("", routes);


module.exports = app;
