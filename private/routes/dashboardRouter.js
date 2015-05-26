var express = require("express");
var router = express.Router();
var db = require("../modules/db.js");
var Promise = require("bluebird");
var request = require("request");
var $ = require("cheerio");
var myPassport = require("../modules/myPassport.js");

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

router.post('/login', function(req, res, next) {
	myPassport.authenticate('local', function(err, user, info) {
		if(err) { return res.status(404).send("server error, please reload page."); }
		if (!user) { res.end("email or password are wrong."); }
		req.logIn(user, function(err) {
	      if (err) { return res.status(404).send("server error, please reload page."); }
	      res.end(JSON.stringify({
	      	text: "Login succeeded.",
	      	redirect: "/"
	      }));
	    });
	})(req, res, next);
});

router.post('/signup', function(req, res) {
	if(!req.body && req.body.email && req.body.password && req.body.password == req.body.confirmpassword) {
		return res.end("Sign Up failed.");
	}

	db.checkUnique("User", {email: req.body.email}).then(function() { return db.add("User", req.body); })
	.then(function(results) { 
		showRedirectMessage(false, "Sign Up Done.", "/", res);
	}).catch(function(err) { 
		res.end("Email " + err);
	});
});

/*router.post('/*', function(req, res, next) {
	var data = {
		user: (req.user) ? req.user.firstname + " " + req.user.lastname : "Guest",
		action: getAction(req.url),
		target: req.body.name
	};
	db.addhistory(data).race(next);
});*/

router.get('/getnews', function(req, res) {
	request.get('http://tech.onliner.by/', function(error, response, body) {
		res.setHeader("Content-Type", "text/html");
		res.end($(body).find('.b-content-grid-1__col-1').html());
	});
});
router.get('/getuserlist', function(req, res) {
	db.find("User", {}).then(function(results) {
		res.send(results);
	});
});

router.post('/addproject', function(req, res) {
	if(!req.body && req.body.name) {
		return res.end("Project was NOT added.");
	}

	var projectAttrs = req.body;
	projectAttrs.priority = (projectAttrs.priority) ? projectAttrs.priority : 0;
	projectAttrs.status = (projectAttrs.status) ? projectAttrs.status : 0;

	
	db.checkUnique("Project", {name: req.body.name}).then(function() { return db.add("Project", req.body); })
	.then(function(results) { 
		showRedirectMessage(false, "Project was added successfuly.", "/dashboard", res);
	}).catch(function(err) { 
		res.end("Project " + err);
	});
});
router.post('/updateproject/:projectname', function(req, res) {
	if(!req.body || !req.params.projectname) {
		return res.end("Project was NOT updated.");
	}
	
	db.update("Project", {name: req.params.projectname}, req.body).then(function() { showRedirectMessage(false, "Project was updated successfuly.", "/board/"+req.params.projectname, res); });
});
router.post(['/removeproject/:projectname', '/removeproject/:projectname/:removetickets'], function(req, res) {
	if(!req.body || !req.params.projectname) {
		return res.end("Project was NOT removed.");
	}

	db.remove("Project", {name: req.params.projectname}).then(function() {
	 if(req.params.removetickets)
	 	return db.remove("Ticket", {project: req.params.projectname});
	 else return true;
	}).then(function() { 
		showRedirectMessage(false, "Project was removed successfuly.", "/dashboard/", res); 
	});
});
router.get('/getprojectslist', function(req, res) {
	db.find("Project", {}).then(function(results) {
		res.send(results);
	});
});
router.post('/addticket/:project', function(req, res) {
	if(!req.body || !req.body.name || !req.params.project) {
		return res.end("Ticket was NOT added.");
	}

	var ticketAttrs = req.body;
	ticketAttrs.reporter = req.user.firstname + " " + req.user.lastname;
	ticketAttrs.priority = (ticketAttrs.priority) ? ticketAttrs.priority : 0;
	ticketAttrs.status = (ticketAttrs.status) ? ticketAttrs.status : 0;
	ticketAttrs.project = req.params.project;
	ticketAttrs.assignee = (ticketAttrs.assignee) ? ticketAttrs.assignee : "No Assignee";
	
	db.checkUnique("Ticket", {name: req.body.name}).then(function() { return db.add("Ticket", ticketAttrs); })
	.then(function(results) { 
		showRedirectMessage(false, "Ticket was added successfuly.", "/board/"+req.params.project, res);
	}).catch(function(err) { 
		res.end("Ticket " + err);
	});
});
router.post('/updateticket/:ticketname', function(req, res) {
	if(!req.body || !req.params.ticketname) {
		return res.end("Ticket was NOT updated.");
	}

	var ticketAttrs = req.body;
	ticketAttrs.status = parseInt(ticketAttrs.status);
	ticketAttrs.status = (ticketAttrs.status) ? ticketAttrs.status : 0;
	
	db.update("Ticket", {name: req.params.ticketname}, ticketAttrs).then(function() { 
		showRedirectMessage(false, "Ticket was updated successfuly.", "/ticket/"+req.params.ticketname, res); 
	});
});
router.post('/addticketcomment/:ticketname', function(req, res) {
	if(!req.body || !req.params.ticketname || req.body.comment == "") {
		return res.end("{'error': 'true'}");
	}

	var comment;
	comment = req.body;
	comment.user = req.user.firstname + " " + req.user.lastname;
	comment.date = (new Date().getTime()).toString();
	
	db.push("Ticket", {name: req.params.ticketname}, comment).then(function() { res.end(JSON.stringify(comment)) });
});
router.get('/getstatuslist/:projectname', function(req, res) {
	if(!req.body || !req.params.projectname) {
		return res.end("wrong query");
	}
	
	db.findOne("Status", {project: req.params.projectname}).then(function(results) { res.end(JSON.stringify(results)); });
});
router.get(['/gettickets', "/gettickets/:id"], function(req, res) {
	var getTickets = function() {
		if(req.params.id) {
			return db.find("Ticket", {project: req.params.id});
		} else {
			return db.find("Ticket", {});
		}
	};
	getTickets().then(function(results) {
		res.send(results);
	});
});
router.post('/updatestatus/:projectname', function(req, res) {
	if(!req.body || !req.params.projectname) {
		return res.end("Status was NOT updated.");
	}

	var statusAttrs = statusAttrs.list = JSON.parse(req.body.list);
	db.update("Status", {project: req.params.projectname}, statusAttrs).then(function() {
		showRedirectMessage(false, "Status was updated successfuly.", "/ticket/"+req.params.projectname, res); 
	});
});
router.post('/removeticket/:ticketname', function(req, res) {
	if(!req.body || !req.params.ticketname) {
		return res.end("Ticket was NOT removed.");
	}

	db.remove("Ticket", {name: req.params.ticketname}).then(function() {
		showRedirectMessage(false, "Ticket was removed successfuly.", "/dashboard/", res); 
	});
});

var showRedirectMessage = function(err, message, redirectUrl, res) {
	res.setHeader("Content-Type", "text/html");
	res.end(JSON.stringify({ redirect: redirectUrl, text: message}));
};

module.exports = router;