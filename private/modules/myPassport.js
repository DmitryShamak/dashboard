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

var getUser = function(email, password) {
	var responder = Promise.pending();
	db.findOne("User", {email: email, password: password}, responder);
	return responder.promise;
};

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
	function (username, password, done) {
		getUser(username, password).then(function(res) {
		    if(res) {
		        return done(null, res);
		    }	        

		    done(null, false);
		});

	}
));

module.exports = passport; 