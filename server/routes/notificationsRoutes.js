var _ = require("lodash");
var moment = require("moment");

module.exports = function(db) {
    var routes = {};

    routes.get = function (req, res) {
        var query = req.query;

        if(!query) {
            res.statusCode = 404;
            res.statusMessage = 'Bad Data';
            return res.send();
        }

        db.find("notification", query, function (err, data) {
            if (err && !data) {
                res.statusCode = 404;
                res.statusMessage = 'Not found';
                return res.send();
            }

            res.send(JSON.stringify({
                data: data
            }));
        });
    };

    routes.delete = function(req, res) {
        var query = req.query;

        if(!query) {
            res.statusCode = 404;
            res.statusMessage = 'Bad Data';
            return res.send();
        }

        db.delete("notification", query, function(err, notification) {
            if(err || !notification) {
                res.statusCode = 404;
                res.statusMessage = 'Bad Data';
                return res.send();
            }

            res.send(notification);
        });
    };

    routes.save = function(req, res) {
        var body = req.body;

        if(!body.data) {
            res.statusCode = 404;
            res.statusMessage = 'Bad Data';
            return res.send();
        }
        db.save("notification", body.data, function(err, notification) {
            if(err || !notification) {
                res.statusCode = 404;
                res.statusMessage = 'Bad Data';
                return res.send();
            }

            res.send(JSON.stringify(notification));
        });
    };

    routes.update = function(req, res) {
        var body = req.body;
        if(!body.query) {
            res.statusCode = 404;
            res.statusMessage = 'Bad Data';
            return res.send();
        }
        db.update("notification", body.query, body.data, function(err, notification) {
            if(err || !notification) {
                res.statusCode = 404;
                res.statusMessage = 'Bad Data';
                return res.send();
            }

            res.send(JSON.stringify(notification));
        });
    };

    return routes;
};