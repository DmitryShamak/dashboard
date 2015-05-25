var express = require("express");
var router = express.Router();
var Promise = require("bluebird");
var fs = require("fs");
var less = require("less");
var renderer = require("../modules/renderer.js");
var db = require("../modules/db.js");
var mime = require("mime");

router.get("*", function (req, res, next) {
    var url = req.url = (req.url == "/") ? "/home" : req.url;

    if (url.indexOf("http") == -1) {
        url = "." + url;
    }

    fs.readFile(url, function (err, data) {
        if (err) {
            return next();
        }

        res.end(data);
    });
});

var getCollectionName = function(template) {
    var collection = "Project";

    switch(template) {
        case "ticket":
            collection = "Ticket";
            break;
    }

    return collection;
};

var getTemplateData = function (template, id) {
    var responder = Promise.pending();
    var collection = getCollectionName(template);
    var selector = id ? { name: id } : {};

    //get db data 
    if(id) db.findOne(collection, selector, responder);
    else db.find(collection, selector, responder);

    return responder.promise;
};

var makeParse = function (arr) {
    var result = {};

    arr.forEach(function (item) {
        for (var key in item) {
            result[key] = item[key];
        }
    });

    return {data: result};
};

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get(['/:view', '/:view/:id'], function (req, res, next) {
    Promise.all([
           getTemplateData(req.params.view, req.params.id)
    ]).then(function (results) {
        req.data = makeParse(results);
        next();
    });
}, function (req, res, next) {
    req.data.user = req.user;
    if(req.params.id) req.data.data.id = req.params.id;
    renderer.renderTemplate(
        req.params.view, 
        req.data, 
        function (err, template) {
            if (err) {
                return next();
            }

            res.status(200).end(template);
        }
    );
}, function (req, res, next) {
    renderer.renderTemplate("error", null, function (err, template) {
        res.status(200).end(template);
        next();
    });
});

module.exports = router;