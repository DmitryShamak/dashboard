var dbProvider = {};

var Profile = function(attrs) {
	var self = this;
	attrs = attrs || {};

	self.name = attrs.name || "Guest";
	self.secondName = attrs.secondName || "User";
	self.status = attrs.status || "online";
	self.image = attrs.image || "/public/img/defaultuser.jpg";

	self.fullName = self.name + " " + self.secondName;
};

var DataTmpl = function(attrs) {
	var self = this;
	attrs = attrs || {};

	self.selected = attrs.selected || false;
	self.title = attrs.title || "[no title]";

	self.favorite = attrs.favorite || randomFavorite();
	self.type = attrs.type || randomType();

	self.description = attrs.description || "[no description]";
	self.date = attrs.date || "[no date]";
	self.time = attrs.tile || "[no time]";
};
var randomType = function() {
	var type,
		random = Math.round(Math.random()*5);

	switch(random) {
		case 0:
			type = "meeting";
			break;
		case 1:
			type = "event";
			break;
		default:
			type = "other";
			break;
	}

	return type;
};
var randomFavorite = function() {
	var random = Math.random()*10;

	return (random > 8);
};


dbProvider.getData = function(type, callback) {
	var delay = Math.random() * 9999,
		length = Math.round(Math.random() * 20),
		i = 0,
		data = [];

	if(type == "profile") {
		data = new Profile();
	} else {
		for(i; i<length; i++) {
			data.push(new DataTmpl());
		}
	}

	setTimeout(function() {
		callback(null, data);
	}, delay);
};

module.exports = dbProvider;