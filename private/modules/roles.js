var ConnectRoles = require('connect-roles');

var user = new ConnectRoles({
    failureHandler: function (req, res, action) {
        var accept = req.headers.accept || '';
        res.redirect("/");
    }
});

user.use('user', function (req) {
    if(req.user && req.user.role === "user") {
        return true;
    }
});

module.exports = user;