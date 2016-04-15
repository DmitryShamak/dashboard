var _ = require("lodash");
var Q = require("q");

var scrapper = require("../scrapper");
var textCutter = require("../components/textCutter");

module.exports = function(db) {
    var routes = {};

    routes.find = function (req, res) {
        var body = req.body;

        if(!body) {
            res.statusCode = 404;
            res.statusMessage = 'Bad Data';
            return res.send();
        }

        if(scrapper[body.provider]) {
            scrapper[body.provider].find({
                url: body.url
            }, function(err, data) {
                if(err) {
                    res.statusCode = 404;
                    res.statusMessage = 'Request error.';
                    return res.send();
                }

                data.description = data.description.map(function(text) {
                    return textCutter(text);
                });

                res.send(JSON.stringify({data: data}));
            });
        }
    };

    routes.get = function (req, res) {
        var query = req.query;
        var providers = req.query.providers;

        var userId = query.userId;

        if(!_.isArray(providers)) {
            providers = [providers];
        }

        var promises = [];
        _.forEach(providers, function(provider) {
            if(scrapper[provider]) {
                promises.push(scrapper[provider].feeds(userId, provider));
            }
        });

        Q.all(promises).then(function(result) {
            res.send(JSON.stringify({feeds: result}));
        });
    };

    return routes;
};