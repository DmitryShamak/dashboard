var scraper = require("./server/scraper");
var db = require("./server/db.js");
var moment = require("moment");
var _ = require("lodash");
var Q = require("q");

var collector = {};
var tickHours = 3;
var delay = moment.duration(tickHours, "hours").asMilliseconds();

collector.getProviders = function() {
    return Q.promise(function(res, rej) {
        db.find("provider", {available: true}, function(err, data) {
            if(err) {
                return rej(err);
            }
            var providers = data.map(function(provider) {
                return provider.name;
            });

            res(providers);
        });
    });
};

collector.collectFeeds = function(providers) {
    var promises = [];
    _.forEach(providers, function(provider) {
        if(scraper.providers[provider]) {
            promises.push(scraper.providers[provider].feeds(provider));
        }
    });

    return Q.promise(function(resolve, reject) {
        Q.all(promises).then(function(result) {
            resolve(result);
        });
    });
};

collector.saveFeeds = function(feeds) {
    //save feeds
    return Q.promise(function(resolve, reject) {
        var promises = [];
        _.forEach(feeds, function(feedGroup) {
            var feedsPr = feedGroup.content.map(function(feed) {
                feed.provider = feedGroup.provider;

                return Q.promise(function(res, rej) {
                    db.findOrCreate("feed", {
                        provider: feed.provider,
                        link: feed.link
                    }, feed, function(err, data) {
                        res({
                            status: err ? "err" : "saved"
                        })
                    });
                });
            });

            promises = promises.concat(feedsPr);
        });

        Q.all(promises).then(function(result) {
            resolve(result);
        });
    });
};

collector.onTick = function() {
    //get providers
    console.log("Start collecting", moment().local().format("DD/MM/YYYY hh:mm:ss a"));
    collector.getProviders()
        .then(collector.collectFeeds)
        .then(collector.saveFeeds)
        .then(function(result) {
            db.update("update", {target: "feed"}, {
                target: "feed",
                date: new Date()
            }, function(err, data) {
                if(err) {
                    return console.log("Error, on save update status");
                }

                console.log("Success, feeds collected! ", moment().local().format("DD/MM/YYYY hh:mm:ss a"));
                console.log("Next start on ", moment().local().add(tickHours, "hours").format("DD/MM/YYYY hh:mm:ss a"));
            })
        })
        .catch(function(err) {
            console.error("Error", err);
        });
};

collector.start = function() {
    collector.onTick();
    //on tick
    collector.interval = setInterval(collector.onTick, delay);
};

collector.stop = function() {
    clearInterval(collector.interval);
    collector.interval = null;
};

collector.start();