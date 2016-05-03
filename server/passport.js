var _conf = require("./_conf.js");
var oauthConfig = require("./oauth.js");
var passport = require("passport");
var LocalStategy = require("passport-local").Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var _ = require('lodash');

var db = require("./db.js");
var notificationGenerator = require("./components/notificationGenerator.js");

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new GoogleStrategy(oauthConfig.googleAuth,
    function(accessToken, refreshToken, profile, done) {
        var user = {
            id: profile.id,
            photo: profile.photos && profile.photos[0].value,
            provider: profile.provider,
            email: profile.emails[0].value,
            name: profile.displayName,
            token: accessToken
        };

        db.findOne("user", {email: user.email}, function(err, result) {
            if(err || !result) {
                return db.save("user", user, function(err, data) {
                    db.save("notification", notificationGenerator(data, "welcome"), function(error, notification) {
                        done(err, data);
                    });
                });
            }

            done(err, user);
        });
    }
));

module.exports = passport;