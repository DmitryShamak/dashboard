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

        db.find("vote", query, function (err, data) {
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

        db.delete("vote", query, function(err, data) {
            if(err || !data) {
                res.statusCode = 404;
                res.statusMessage = 'Bad Data';
                return res.send();
            }

            res.send(data);
        });
    };

    routes.save = function(req, res) {
        var body = req.body;

        if(!body.data) {
            res.statusCode = 404;
            res.statusMessage = 'Bad Data';
            return res.send();
        }
        db.save("vote", body.data, function(err, data) {
            if(err || !data) {
                res.statusCode = 404;
                res.statusMessage = 'Bad Data';
                return res.send();
            }

            res.send(JSON.stringify(data));
        });
    };

    routes.update = function(req, res) {
        var body = req.body;
        if(!body.query) {
            res.statusCode = 404;
            res.statusMessage = 'Bad Data';
            return res.send();
        }
        db.update("vote", body.query, body.data, function(err, data) {
            if(err || !data) {
                res.statusCode = 404;
                res.statusMessage = 'Bad Data';
                return res.send();
            }

            res.send(JSON.stringify(data));
        });
    };

    return routes;
};