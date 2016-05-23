var _ = require("lodash");

module.exports = function(db) {
    var routes = {};

    routes.save = function(req, res) {
        var body = req.body;

        db.save("provider", body, function(err, data) {
            if(err) {
                res.statusCode = 404;
                res.statusMessage = 'Not found';
                return res.send();
            }

            res.send(JSON.stringify(data));
        });
    };

    routes.store = function (req, res) {
        db.find("provider", {available: true}, function (err, providers) {
            if (err) {
                res.statusCode = 404;
                res.statusMessage = 'Not found';
                return res.send();
            }

            //TODO: featured list
            var categories = [];
            _.forEach(providers, function(plugin, key) {
                var exists = _.find(categories, {'label': plugin.category});
                if(!exists) {
                    categories.push({
                        label: plugin.category
                    });
                }
            });

            res.send(JSON.stringify({
                categories: categories,
                data: providers
            }));
        });
    };

    routes.get = function (req, res) {
        var query = req.query.providers ? {
            _id: {$in: req.query.providers}
        } : req.query;

        db.find("provider", query, function (err, providers) {
            if (err) {
                res.statusCode = 404;
                res.statusMessage = 'Not found';
                return res.send();
            }

            res.send(JSON.stringify({
                data: providers
            }));
        });
    };

    routes.update = function(req, res) {
        var body = req.body;
        if(!body.query) {
            res.statusCode = 404;
            res.statusMessage = 'Bad Data';
            return res.send();
        }
        db.update("provider", body.query, body.data, function(err, provider) {
            if(err || !user) {
                res.statusCode = 404;
                res.statusMessage = 'Bad Data';
                return res.send();
            }

            res.send(JSON.stringify(provider));
        });
    };

    return routes;
};