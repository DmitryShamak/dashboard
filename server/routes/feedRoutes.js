var _ = require("lodash");
var moment = require("moment");
var Q = require("q");

var scraper = require("../scraper");
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

        if(scraper.providers[body.provider]) {
            scraper.providers[body.provider].find({
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

        db.find("feed", {
            provider: { $in: query.providers }
        }, function (err, feeds) {
            if (err) {
                res.statusCode = 404;
                res.statusMessage = 'Not found';
                return res.send();
            }

            if(query.date) {
                feeds = feeds.filter(function(item) {
                    return (moment(query.date).isSame(moment(item.date), "day"));
                });
            }

            var promises = feeds.map(function(item) {
                var feedQuery = {
                    user: query.userId,
                    feed: item._id.toString()
                };

                return Q.promise(function(resolve, reject) {
                    db.findOne("history", feedQuery, function(err, success) {
                        //problems with overriding root item
                        var params = ["date", "link", "label", "image", "_id", "provider"];
                        var feed = {};
                        _.forEach(params, function(param) {
                            feed[param] = item[param]
                        });

                        if(success) {
                            feed.visited = true;
                        }

                        resolve(feed);
                    })
                });
            });

            Q.all(promises).then(function(result) {
                res.send(JSON.stringify({
                    feeds: result
                }));
            });
        });
    };

    return routes;
};