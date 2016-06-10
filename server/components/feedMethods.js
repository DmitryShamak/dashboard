var Q = require("q");
var _ = require('lodash');
var request = require("request");
var db = require("../db.js");

var methods = {};

methods.callback = function(urls, parser, deferred) {
    if(_.isArray(urls)) {
        var promises = urls.map(function(url) {
            return Q.promise(function(res, rej) {
                request({
                    uri: url
                }, function(error, response, body) {
                    res(body);
                });
            });
        });

        Q.all(promises).then(function(data) {
            var query = {};

            parser(query, data).then(function(res) {
                deferred.resolve(res);
            });
        });
    } else {
        request({
            uri: urls
        }, function(error, response, body) {
            var query = {};

            parser(query, body).then(function(res) {
                deferred.resolve(res);
            });
        });
    }
};

methods.parseString = function(text) {
    var result = text.replace(/[\s\t\v]/g, " ");

    return (result ? result.trim() : "");
};

module.exports = methods;
