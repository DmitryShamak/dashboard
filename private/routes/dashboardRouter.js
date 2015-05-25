var express = require("express");
var router = express.Router();
var db = require("../modules/db.js");
var Promise = require("bluebird");
var request = require("request");
var $ = require("cheerio");

router.get('/getnews', function(req, res) {
	request.get('http://tech.onliner.by/', function(error, response, body) {
		res.setHeader("Content-Type", "text/html");
		res.end($(body).find('.b-content-grid-1__col-1').html());
	});
});
router.get('/getuserlist', function(req, res) {
	var f = function() {
		var responder = Promise.pending();
		db.find("User", {}, responder);
		return responder.promise;
	};
	f().then(function(results) {
		res.send(results);
	});
});

router.post('/addproject', function(req, res) {
	if(!req.body && req.body.name) { //NEXT check for unique
		return res.end("Project was NOT added.");
	}

	var testUnique = function() {
		var responder = Promise.pending();
		db.checkUnique("Project", {name: req.body.name}, responder);
		return responder.promise;
	};
	var f = function() {
		var responder = Promise.pending();
		
		var projectAttrs = req.body;
		//ADDING default values to project
		projectAttrs.priority = (projectAttrs.priority) ? projectAttrs.priority : 0;
		projectAttrs.status = (projectAttrs.status) ? projectAttrs.status : 0;
		db.add("Project", req.body, responder);

		return responder.promise;
	};
	
	testUnique().then(function() { return f(); })
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

	var f = function() {
		var responder = Promise.pending();
		
		var projectAttrs = req.body;
		db.update("Project", {name: req.params.projectname}, projectAttrs, responder);//NEXT check for successful update

		return responder.promise;
	};
	
	f().then(function() { showRedirectMessage(false, "Project was updated successfuly.", "/board/"+req.params.projectname, res); });
});
router.post(['/removeproject/:projectname', '/removeproject/:projectname/:removetickets'], function(req, res) {
	if(!req.body || !req.params.projectname) {
		return res.end("Project was NOT removed.");
	}
	var f = function() {
		var responder = Promise.pending();
		
		db.remove("Project", {name: req.params.projectname}, responder);

		return responder.promise;
	};
	var f2 = function() {
		var responder = Promise.pending();
		
		if(req.params.removetickets)db.remove("Ticket", {project: req.params.projectname}, responder);
		else responder.resolve(true);

		return responder.promise;
	};
	f().then(function() { return f2();}).then(function() { showRedirectMessage(false, "Project was removed successfuly.", "/dashboard/", res); });
});
router.get('/getprojectslist', function(req, res) {
	var getProjectsList = function() {
		var responder = Promise.pending();
		db.find("Project", {}, responder);
		return responder.promise;
	};
	getProjectsList().then(function(results) {
		res.send(results);
	});
});
router.post('/addticket/:project', function(req, res) {
	if(!req.body || !req.body.name || !req.params.project) {
		return res.end("Ticket was NOT added.");
	}

	var testUnique = function() {
		var responder = Promise.pending();
		db.checkUnique("Ticket", {name: req.body.name}, responder);
		return responder.promise;
	};
	var f = function() {
		var responder = Promise.pending();
		
		//ADDING default values to project
		var ticketAttrs = req.body;
		ticketAttrs.reporter = req.user.firstname + " " + req.user.lastname;
		ticketAttrs.priority = (ticketAttrs.priority) ? ticketAttrs.priority : 0;
		ticketAttrs.status = (ticketAttrs.status) ? ticketAttrs.status : 0;
		ticketAttrs.project = req.params.project;
		ticketAttrs.assignee = (ticketAttrs.assignee) ? ticketAttrs.assignee : "No Assignee";
		db.add("Ticket", req.body, responder);

		return responder.promise;
	};
	
	testUnique().then(function() { return f(); })
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

	var f = function() {
		var responder = Promise.pending();
		
		var ticketAttrs = req.body;
		ticketAttrs.status = parseInt(ticketAttrs.status);
		ticketAttrs.status = (ticketAttrs.status) ? ticketAttrs.status : 0;
		db.update("Ticket", {name: req.params.ticketname}, ticketAttrs, responder);//NEXT check for successful update

		return responder.promise;
	};
	
	f().then(function() { showRedirectMessage(false, "Ticket was updated successfuly.", "/ticket/"+req.params.ticketname, res); });
});
router.post('/addticketcomment/:ticketname', function(req, res) {
	if(!req.body || !req.params.ticketname || req.body.comment == "") {
		return res.end("{'error': 'true'}");
	}

	var comment;

	var f = function() {
		var responder = Promise.pending();
		
		comment = req.body;
		comment.user = req.user.firstname + " " + req.user.lastname;
		comment.date = (new Date().getTime()).toString();
		db.push("Ticket", {name: req.params.ticketname}, comment, responder);

		return responder.promise;
	};
	
	f().then(function() { res.end(JSON.stringify(comment)) });
});
router.get('/getstatuslist/:projectname', function(req, res) {
	if(!req.body || !req.params.projectname) {
		return res.end("wrong query");
	}

	var f = function() {
		var responder = Promise.pending();

		db.findOne("Status", {project: req.params.projectname}, responder);//NEXT check for successful update

		return responder.promise;
	};
	
	f().then(function(results) { res.end(JSON.stringify(results)); });
});
router.get(['/gettickets', "/gettickets/:id"], function(req, res) {
	var getTickets = function() {
		var responder = Promise.pending();

		if(req.params.id) db.find("Ticket", {project: req.params.id}, responder);
		else db.find("Ticket", {}, responder);

		return responder.promise;
	};
	getTickets().then(function(results) {
		res.send(results);
	});
});
router.post('/updatestatus/:projectname', function(req, res) {
	if(!req.body || !req.params.projectname) {
		return res.end("Status was NOT updated.");
	}

	var f = function() {
		var responder = Promise.pending();
		
		var statusAttrs = req.body;
		statusAttrs.list = JSON.parse(statusAttrs.list);
		db.update("Status", {project: req.params.projectname}, statusAttrs, responder);//NEXT check for successful update

		return responder.promise;
	};
	
	f().then(function() { showRedirectMessage(false, "Status was updated successfuly.", "/ticket/"+req.params.projectname, res); });
});
router.post('/removeticket/:ticketname', function(req, res) {
	if(!req.body || !req.params.ticketname) {
		return res.end("Ticket was NOT removed.");
	}

	var f = function() {
		var responder = Promise.pending();
		
		db.remove("Ticket", {name: req.params.ticketname}, responder);//NEXT check for successful removed

		return responder.promise;
	};
	f().then(function() { showRedirectMessage(false, "Ticket was removed successfuly.", "/dashboard/", res); });
});

var showRedirectMessage = function(err, message, redirectUrl, res) {
	res.setHeader("Content-Type", "text/html");
	res.end("<span " + (redirectUrl ? "action='redirect' target='"+redirectUrl+"'" : "") + "'>" +message+"</span>");
};

module.exports = router;