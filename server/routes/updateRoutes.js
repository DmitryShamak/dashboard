var _ = require("lodash");
var moment = require("moment");
var Q = require("q");

module.exports = function(db) {
    var routes = {};

    routes.get = function (req, res) {
        var query = req.query; //target & date

        db.findOne("update", {
            target: query.target
        }, function(err, data) {
            var hasUpdates;
            if(err) {
                hasUpdates = false;
            } else {
                hasUpdates = !!data && moment(data.date).isAfter(moment(query.date));
            }

            res.send(JSON.stringify({
                hasUpdates: hasUpdates
            }));
        });
    };

    return routes;
};