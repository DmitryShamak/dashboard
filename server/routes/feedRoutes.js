var _ = require("lodash");

var scrappers = require("../scrapper");

module.exports = function(db) {
    var routes = {};

    routes.get = function (req, res) {
        var query = req.query;
        var providers = req.query.providers;
        //TODO: add scrapper action
        //scrappers.onliner(callback);
        //make it with promises

        res.send(JSON.stringify({hello: "Wait till som day, please."}));
    };

    return routes;
};