var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var user = "DShamak";
var password = "mongolabpa33";
var table = "dashboard";
var url = 'mongodb://'+user+':'+password+'@ds031872.mongolab.com:31872/'+table;
mongoose.connect(url);

var db = mongoose.connection;
db.on('error', function (err) {
	console.log('connection error', err);
});
db.once("open", function() {
	console.log("DB was CONECTED");
});

function validator (val) {
    return val;
}

var userSchema = new Schema({
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    role: String,
    description: String,
    authdate: { type: Date, default: Date.now }
});
var ticketSchema = new Schema({
    name: String,
    status: Number,
    priority: Number,
    assignee: String,
    description: String,
    startdate: { type: Date, default: Date.now },
    updatedate: { type: Date, default: Date.now },
    project: String
});
var projectSchema = new Schema({
    name: String,
    priority: Number,
    status: Number,
    description: String,
    startdate: { type: Date, default: Date.now },
    endDate: { type: Date, default: Date.now }
});
var boardSchema = new Schema({
    ticket: Number
});

var Collections = {};
Collections.User = mongoose.model('User', userSchema);
Collections.Project = mongoose.model('Project', projectSchema);
Collections.Board = mongoose.model('Board', boardSchema);
Collections.Ticket = mongoose.model('Ticket', ticketSchema);

var db_control = {};
db_control.add = function(collection, data) {
	if(!Collections[collection]) return false;

	var val = new Collections[collection](data);
	val.save(function (err, res) {
		if (err) console.log(err);
		else console.log('Saved : ', res );
	});
};
db_control.findOne = function(collection, selector, promise) {
	if(!Collections[collection]) return promise.resolve(false);
	Collections[collection].findOne(selector, function(err, res) {
	  if (err) return promise.resolve(false);

	  promise.resolve(res);
	});
};
db_control.find = function(collection, selector, promise) {
    if(!Collections[collection]) return promise.resolve(false);
    Collections[collection].find(selector, function(err, res) {
      if (err) return promise.resolve(false);

      promise.resolve(res);
    });
};

module.exports = db_control;