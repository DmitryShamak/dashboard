var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require("./db.js");
var Promise = require("bluebird");

passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
	function (username, password, done) {
		db.findOne("User", {email: username, password: password}).then(function(res) {
		    if(res) {
		        return done(null, res);
		    }	        

		    done(null, false);
		});

	}
));

module.exports = passport; 