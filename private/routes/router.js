var express = require("express");
var router = express.Router();
var Promise = require("bluebird");
var fs = require("fs");
var less = require("less");
var renderer = require("../modules/renderer.js");
var db = require("../modules/db.js");
var mime = require("mime");
var path = require("path");

router.get("*", function (req, res, next) {
    var url = req.url = (req.url == "/") ? "/home" : req.url;

    if (url.indexOf("http") == -1) {
        url = "." + url;
    }

    fs.readFile(url, function (err, data) {
        if (err) {
            return next();
        }
        res.setHeader('content-type', mime.lookup(url));
        res.send(data);
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
    var collection = getCollectionName(template);
    var selector = id ? { name: id } : {};

    if(id) return db.findOne(collection, selector);
    else return db.find(collection, selector);
};

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get(['/:view', '/:view/:id'], function (req, res, next) {
    getTemplateData(req.params.view, req.params.id)
    .then(function (results) {
        req.data = {obj: results};
        next();
    });
}, function (req, res, next) {
    req.data.obj = req.data.obj;
    req.data.user = req.user ? req.user : false;
    if(req.params.id) req.data.obj.name = req.params.id;
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
});

module.exports = router;