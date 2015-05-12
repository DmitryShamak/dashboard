var express = require("express");
var router = express.Router();
var promise = require("bluebird");
var fs = require("fs");
var less = require("less");
var renderer = require("../modules/renderer.js");

router.get("*", function (req, res, next) {
    var url = req.url = (req.url == "/") ? "/home" : req.url;

    if (url.indexOf("http") == -1) {
        url = "." + url;
    }

    fs.readFile(url, function (err, data) {
        if (err) {
            return next();
        }
        if(url.indexOf("style.css")) {
            res.setHeader('content-type', 'text/css');
        }

        res.status(200).end(data);
    });
});

var getTemplateData = function (template) {
    var responder = promise.pending();
    var url = "./private/data/" + template + ".json";

    fs.readFile(url, function (err, data) {
        if (err) {
            return responder.resolve({ data: {} });
        }
        data = data.toString();
        data = data.slice(1);

        var json = JSON.parse(data);

        responder.resolve({ data:  json });
    });

    return responder.promise;
};

var makeParse = function (arr) {
    var result = {};

    arr.forEach(function (item) {
        for (var key in item) {
            result[key] = item[key];
        }
    });

    return result;
};

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/:view', function (req, res, next) {
    promise.all([
           getTemplateData(req.params.view)
    ]).then(function (results) {
        res.data = makeParse(results);
        next();
    });
}, function (req, res, next) {
    res.data.user = req.user;
    renderer.renderTemplate(
        req.params.view, 
        res.data, 
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