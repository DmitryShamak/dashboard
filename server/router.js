var _conf = require("./_conf.js");

var db = require("./db.js");

var user = require("./routes/userRoutes.js")(db);
var provider = require("./routes/providerRoutes.js")(db);
var feed = require("./routes/feedRoutes.js")(db);
var update = require("./routes/updateRoutes.js")(db);
var notes = require("./routes/notesRoutes.js")(db);
var bookmarks = require("./routes/bookmarksRoutes.js")(db);
var history = require("./routes/historyRoutes.js")(db);
var notifications = require("./routes/notificationsRoutes.js")(db);
var voting = require("./routes/votingRoutes.js")(db);
var vote = require("./routes/voteRoutes.js")(db);

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

    //Provider
    app.get('/api/provider', provider.get);
    app.get('/api/store', provider.store);
    app.post('/api/provider', provider.save);
    app.put('/api/provider', provider.update);

    //Updates
    app.get('/api/updates', update.get);

    //Feed
    app.get('/api/feed', feed.get);
    app.post('/api/feed', feed.find);

    //Notes
    app.get('/api/notes', notes.get);
    app.post('/api/notes', notes.save);
    app.delete('/api/notes', notes.delete);

    //notifications
    app.get('/api/notifications', notifications.get);
    app.post('/api/notifications', notifications.save);
    app.delete('/api/notifications', notifications.delete);
    app.put('/api/notifications', notifications.update);

    //voting
    app.get('/api/voting', voting.get);
    app.post('/api/voting', voting.save);
    app.delete('/api/voting', voting.delete);
    app.put('/api/voting', voting.update);

    //vote
    app.get('/api/vote', vote.get);
    app.post('/api/vote', vote.save);
    app.delete('/api/vote', vote.delete);
    app.put('/api/vote', vote.update);

    //Bookmarks
    app.get('/api/bookmarks', bookmarks.get);
    app.post('/api/bookmarks', bookmarks.save);
    app.delete('/api/bookmarks', bookmarks.delete);

    //History
    app.post('/api/history', history.save);

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
        next();
    });

    app.get('/auth/google/callback', passport.authenticate("google", {
            successRedirect: "/landing",
            failureRedirect: "/error"
        })
    );
};

module.exports = router;

