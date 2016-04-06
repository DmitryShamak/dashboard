var _ = require("lodash");
var Q = require("q");

var scrapper = require("../scrapper");
var textCutter = require("../components/textCutter");

module.exports = function(db) {
    var routes = {};

    routes.get = function (req, res) {
        var query = req.query;
        var providers = req.query.providers;

        if(!_.isArray(providers)) {
            providers = [providers];
        }

        var promises = [];
        _.forEach(providers, function(provider) {
            if(scrapper[provider]) {
                promises.push(scrapper[provider]())
            }
        });

        Q.all(promises).then(function(result) {
            _.forEach(result, function(feed) {
                _.forEach(feed.content, function(item) {
                    item.description = textCutter(item.description);
                });
            });

            res.send(JSON.stringify({feeds: result}));
        });
    };

    return routes;
};