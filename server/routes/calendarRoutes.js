var _ = require("lodash");

module.exports = function(db) {
    var routes = {};

    routes.get = function (req, res) {
        var query = req.query;
        db.find("calendar", query, function (err, data) {
            if (err) {
                res.statusCode = 404;
                res.statusMessage = 'Not found';
                return res.send();
            }

            res.send(JSON.stringify(plugin.toJSON(data)));
        });
    };

    routes.update = function(req, res) {
        var body = req.body;
        if(!body.query) {
            res.statusCode = 404;
            res.statusMessage = 'Bad Data';
            return res.send();
        }
        db.update("calendar", body.query, body.data, function(err, calendar) {
            if(err || !user) {
                res.statusCode = 404;
                res.statusMessage = 'Bad Data';
                return res.send();
            }

            res.send(JSON.stringify(calendar));
        });
    };

    return routes;
};