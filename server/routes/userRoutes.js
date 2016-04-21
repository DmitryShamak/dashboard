var jwt = require("jsonwebtoken");
var JWT_SECRET = "oldmansecret";

module.exports = function(db) {
    var routes = {};

    routes.save = function(req, res) {
        var body = req.body;
        var user = body;
        user.token = jwt.sign(user, JWT_SECRET);

        db.save("user", user, function(err, data) {
            if(err) {
                res.statusCode = 404;
                res.statusMessage = 'Not found';
                return res.send();
            }

            res.send(JSON.stringify(data));
        });
    };

    routes.get = function(req, res) {
        var query = req.query;
        db.findOne("user", query, function(err, user) {
            if(err) {
                res.statusCode = 404;
                res.statusMessage = 'Not found';
                return res.send();
            }

            res.send(JSON.stringify(user));
        });
    };

    routes.authenticate = function(req, res) {
        var data = req.body;
        var query = {
            token: data.token
        };
        db.find("user", query, function(err, user) {
            if(err || !user) {
                res.statusCode = 404;
                res.statusMessage = 'Not found';
                return res.send();
            }

            res.send(JSON.stringify({
                _id: user._id,
                name: user.name
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
        db.update("user", body.query, body.data, function(err, user) {
            if(err || !user) {
                res.statusCode = 404;
                res.statusMessage = 'Bad Data';
                return res.send();
            }

            res.send(JSON.stringify(user));
        });
    };

    return routes;
};