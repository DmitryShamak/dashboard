var login = function() {
	return {
		templateUrl: "/public/view/login.tmplt",
		replace: false,

		link: function(scope, elem, attrs) {
			scope.profile = null;
			scope.logged = false;
			scope.passLevel = "low";
			scope.validLogData = false;

			scope.logIn = function() {
				scope.profile = {};
				scope.logged = true;
			};

			scope.toggleForm = function() {
				scope.form = {};
				scope.passLevel = "low";
				scope.registration = !scope.registration;
			};

			scope.getPasswordLevel = function() {
				var pass = scope.form.pass || "";

				var levels = ["low", "medium", "hight"],
					ind = 0,
					length = pass.length;

				if(length > 8 && length <= 16) {
					ind = 1;
				} else if(length > 16) {
					ind = 2;
				}

				scope.passLevel = levels[ind];
			};

			scope.confirmPass = function(confirm) {
				return scope.validLogData = scope.form.pass == confirm;
			};

			scope.validate = function(type, value) {
				scope.validLogData = !!scope.form.name && !!scope.form.pass;

				if(scope.registration) {
					scope.validLogData = scope.validLogData && scope.confirmPass(scope.form.cpass);
				}

				return false;
			};
		}
	}
};

module.exports = login;