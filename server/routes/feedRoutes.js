var _ = require("lodash");

module.exports = function(db) {
    var routes = {};

    routes.get = function (req, res) {
        var query = req.query;
        var providers = req.query.providers;
        //TODO: add scrapper action

        res.send(JSON.stringify({}));
    };

    return routes;
};