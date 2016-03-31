var _ = require("lodash");

module.exports = function(db) {
    var routes = {};

    routes.save = function(req, res) {
        var body = req.body;

        db.save("plugin", body, function(err, data) {
            if(err) {
                res.statusCode = 404;
                res.statusMessage = 'Not found';
                return res.send();
            }

            res.send(JSON.stringify(data));
        });
    };

    routes.store = function (req, res) {
        db.find("plugin", {}, function (err, plugin) {
            if (err) {
                res.statusCode = 404;
                res.statusMessage = 'Not found';
                return res.send();
            }

            var plugins = plugin ? plugin : [];
            //TODO: featured list
            var categories = [];
            _.forEach(plugins, function(plugin, key) {
                var exists = _.find(categories, {'label': plugin.category});
                if(!exists) {
                    categories.push({
                        label: plugin.category
                    });
                }
            });

            res.send(JSON.stringify({
                categories: categories,
                data: plugins
            }));
        });
    };

    routes.get = function (req, res) {
        var query = req.query;
        db.find("plugin", query, function (err, plugin) {
            if (err) {
                res.statusCode = 404;
                res.statusMessage = 'Not found';
                return res.send();
            }

            res.send(JSON.stringify(plugin.toJSON()));
        });
    };

    routes.update = function(req, res) {
        var body = req.body;
        if(!body.query) {
            res.statusCode = 404;
            res.statusMessage = 'Bad Data';
            return res.send();
        }
        db.update("plugin", body.query, body.data, function(err, plugin) {
            if(err || !user) {
                res.statusCode = 404;
                res.statusMessage = 'Bad Data';
                return res.send();
            }

            res.send(JSON.stringify(plugin));
        });
    };

    return routes;
};