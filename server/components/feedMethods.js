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

methods.parseString = function(text) {
    var result = text.replace(/[\s\t\v]/g, " ");

    return (result ? result.trim() : "");
};

module.exports = methods;
