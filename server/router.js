var _conf = require("./_conf.js");

var db = require("./db.js");

var user = require("./routes/userRoutes.js")(db);
var plugin = require("./routes/pluginRoutes.js")(db);
var feed = require("./routes/feedRoutes.js")(db);
var notes = require("./routes/notesRoutes.js")(db);

var passport = require("./passport.js");

function getUserAuth(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated() && req.user) {
        db.findOne("user", {email: req.user.email}, function(err, user) {
            if(user) {
                return res.status(200).send(JSON.stringify(user.toJSON()));
            }

            res.status(400).send(null);
        })
    } else {
        res.status(400).send(null);
    }
}

var router = function(app) {
    //USER
    app.post('/api/user', user.save);
    app.post('/api/authenticate', user.authenticate);
    app.put('/api/user', user.update);

    //Plugin
    app.get('/api/plugin', plugin.get);
    app.get('/api/store', plugin.store);
    app.post('/api/plugin', plugin.save);
    app.put('/api/plugin', plugin.update);

    //Feed
    app.get('/api/feed', feed.get);

    //Notes
    app.get('/api/notes', notes.get);
    app.post('/api/notes', notes.save);
    app.delete('/api/notes', notes.delete);

    app.all("/logout", function(req, res, next) {
        res.cookie("user", "", { expires: new Date(), path: '/'});
        req.logout();
        req.session.destroy();
        res.redirect("/landing");
    });

    //OAuth
    app.use(passport.initialize());
    app.use(passport.session());

    app.use("/api/auth", getUserAuth);

    app.get('/auth/google', passport.authenticate("google", {scope: ['profile', 'email']}));
    app.use('/auth/*', function(req, res, next) {
        console.log("USER", req.user);
        next();
    });

    app.get('/auth/google/callback', passport.authenticate("google", {
            successRedirect: "/landing",
            failureRedirect: "/error"
        })
    );
};

module.exports = router;

