var _ = require("lodash");

module.exports = function(db) {
    var routes = {};

    routes.get = function (req, res) {
        var query = req.query;

        db.find("note", query, function (err, data) {
            if (err && !data) {
                res.statusCode = 404;
                res.statusMessage = 'Not found';
                return res.send();
            }

            res.send(JSON.stringify({
                data: data.map(function(item) {
                    return {
                        date: item.date,
                        text: item.text
                    }
                })
            }));
        });
    };

    routes.save = function(req, res) {
        var body = req.body;

        if(!body.data) {
            res.statusCode = 404;
            res.statusMessage = 'Bad Data';
            return res.send();
        }
        db.save("note", body.data, function(err, calendar) {
            if(err || !calendar) {
                res.statusCode = 404;
                res.statusMessage = 'Bad Data';
                return res.send();
            }

            res.send(JSON.stringify(calendar));
        });
    };

    return routes;
};