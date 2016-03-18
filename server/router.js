var _conf = require("./_conf.js");

var db = require("./db.js");

var user = require("./routes/userRoutes.js")(db);

var passport = require("./passport.js");

function getUserAuth(req, res, next) {
    // if user is authenticated in the session, carry on
    console.log("AUTH", req.user);
    if (req.isAuthenticated() && req.user) {
        res.status(200).send(JSON.stringify(req.user));
    } else {
        res.status(400).send(null);
    }
}

var router = function(app) {
    app.post('/api/user', user.save);
    app.post('/api/authenticate', user.authenticate);
    app.put('/api/user', user.update);

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

