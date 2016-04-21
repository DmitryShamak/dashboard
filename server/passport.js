var _conf = require("./_conf.js");
var oauthConfig = require("./oauth.js");
var passport = require("passport");
var LocalStategy = require("passport-local").Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var _ = require('lodash');

var db = require("./db.js");

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

        db.findOrCreate("user", {email: user.email}, user, done);
    }
));

module.exports = passport;