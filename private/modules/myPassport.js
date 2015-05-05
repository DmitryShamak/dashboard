var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user, done) {
	done(null, user);
});
passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

var User = {firstName: 'Dmitry', lastName: 'Shamak', role: "user"};

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
	function (username, password, done) {
		console.log("LocalStrategy");
	    if(username === 'dmitry' && password === 'password') {
	        return done(null, User);
	    }	        

	    done(null, false);
	}
));

module.exports = passport; 