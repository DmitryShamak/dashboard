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

        res.status(200).end(data);
    });
});

var getStyle = function () {
    var responder = promise.pending();

    fs.readFile('./public/styles/style.less', function (err, data) {
        if (err) {
            console.log("No styles");
            return responder.resolve({ style: "" });
        }

        less.render(data.toString(), function (e, output) {
            responder.resolve({ style: output.css });
        });
    });

    return responder.promise;
};

var getTemplateData = function (template) {
    var responder = promise.pending();

    console.log(template);

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

router.get('/:view', function (req, res, next) {
    promise.all([
           getStyle(),
           getTemplateData(req.params.view)
    ]).then(function (results) {
        res.data = makeParse(results);

        next();
    });
}, function (req, res, next) {
    renderer.renderTemplate(req.params.view, res.data, function (err, template) {
        if (err) {
            return next();
        }

        res.status(200).end(template);
    });
}, function (req, res, next) {
    renderer.renderTemplate("error", null, function (err, template) {
        res.status(200).end(template);
    });
});

module.exports = router;