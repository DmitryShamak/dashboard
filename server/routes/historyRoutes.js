var _ = require("lodash");

module.exports = function(db) {
    var routes = {};

    routes.get = function (req, res) {
        var query = req.query;

        db.find("history", query, function (err, data) {
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

    routes.save = function(req, res) {
        var body = req.body;

        if(!body) {
            res.statusCode = 404;
            res.statusMessage = 'Bad Data';
            return res.send();
        }

        db.save("history", body, function(err, item) {
            if(err) {
                res.statusCode = 404;
                res.statusMessage = 'Bad Data';
                return res.send();
            }

            res.send(JSON.stringify(item));
        });
    };

    return routes;
};