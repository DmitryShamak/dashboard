var Q = require("q");
var request = require("request");
var db = require("../db.js");

var methods = {};

methods.compareContent = function(userId, feed, content) {
    return Q.promise(function(res, rej) {
        var promises = content.map(function(item) {
            return Q.promise(function(resolve, reject) {
                db.findOne("history", {
                    user: userId,
                    link: item.link
                }, function(err, success) {
                    if(success) {
                        item.visited = true;
                    }

                    resolve(item);
                })
            });
        });

        Q.all(promises).then(function(result) {
            feed.content = result;
            res(feed);
        });
    });
};

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
