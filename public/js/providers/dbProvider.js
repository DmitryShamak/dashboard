var dbProvider = {};

dbProvider.getData = function(type, callback) {
	var delay = Math.random() * 999,
		data = {
			type: type
		};

	setTimeout(function() {
		callback(null, data);
	}, delay);
};

module.exports = dbProvider;