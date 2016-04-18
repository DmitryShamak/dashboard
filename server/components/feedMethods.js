var Q = require("q");
var request = require("request");
var db = require("../db.js");

var methods = {};

methods.callback = function(url, parser, deferred) {
    request({
        uri: url
    }, function(error, response, body) {
        var query = {};

        parser(query, body).then(function(res) {
            deferred.resolve(res);
        });
    });
};

module.exports = methods;
