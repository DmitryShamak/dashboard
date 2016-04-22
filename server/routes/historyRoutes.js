var _ = require("lodash");
var Q = require("q");

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

        if(body.list && _.isArray(body.list)) {
            var promises = body.list.map(function(item) {
                return Q.promise(function(resolve, reject) {
                    db.save("history", item, function(err, result) {
                        if(err) {
                            return reject(err);
                        }

                        resolve(result);
                    });
                })
            });

            Q.all(promises).then(function(results) {
                res.send(JSON.stringify({
                    list: results
                }));
            });
        } else {
            db.save("history", body, function(err, item) {
                if(err) {
                    res.statusCode = 404;
                    res.statusMessage = 'Bad Data';
                    return res.send();
                }

                res.send(JSON.stringify(item));
            });
        }
    };

    return routes;
};