var _ = require("lodash");

module.exports = function(db) {
    var routes = {};

    routes.get = function (req, res) {
        var query = req.query;

        db.find("bookmark", query, function (err, data) {
            console.log(data);
            if (err || !data) {
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

        db.delete("bookmark", query, function(err, note) {
            if(err || !note) {
                res.statusCode = 404;
                res.statusMessage = 'Bad Data';
                return res.send();
            }

            res.send("done");
        });
    };

    routes.save = function(req, res) {
        var body = req.body;

        if(!body.data) {
            res.statusCode = 404;
            res.statusMessage = 'Bad Data';
            return res.send();
        }
        db.save("bookmark", body.data, function(err, notes) {
            if(err || !notes) {
                res.statusCode = 404;
                res.statusMessage = 'Bad Data';
                return res.send();
            }

            res.send(JSON.stringify(notes));
        });
    };

    return routes;
};