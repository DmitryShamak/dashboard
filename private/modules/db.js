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

var userSchema = new Schema({
    firstname: String, lastname: String, email: String, password: String, role: String, description: String, 
    authdate: { type: Date, default: Date.now }
});
var ticketSchema = new Schema({ name: String, status: Number, priority: Number, assignee: String, description: String, project: String,
    comments: Object, startdate: { type: Date, default: Date.now }, updatedate: { type: Date, default: Date.now }
});
var projectSchema = new Schema({
    name: String, priority: Number, status: Number, description: String, key: String, 
    startdate: { type: Date, default: Date.now }, endDate: { type: Date, default: Date.now }
});
var boardSchema = new Schema({
    ticket: Number
});
var statusSchema = new Schema({
    project: String, list: Object
});

var Collections = {};
Collections.User = mongoose.model('User', userSchema);
Collections.Project = mongoose.model('Project', projectSchema);
Collections.Board = mongoose.model('Board', boardSchema);
Collections.Ticket = mongoose.model('Ticket', ticketSchema);
Collections.Status = mongoose.model('Status', statusSchema);

var db_control = {};
db_control.add = function(collection, data, promise) {
	if(!Collections[collection]) return promise.resolve({});

	var val = new Collections[collection](data);
	val.save(function (err, res) {
		if (err) return promise.resolve({});

        promise.resolve(res);
	});
};
db_control.update = function(collection, query, data, promise) { //NEXT add callback
    if(!Collections[collection]) return promise.resolve({});
            console.log(data);
    Collections[collection].update(query, data, { upsert: true }, function (err, res) {
        if (err) return promise.resolve({});

        promise.resolve(res);
    });
};
db_control.remove = function(collection, query, promise) { //NEXT add callback
    if(!Collections[collection]) return promise.resolve({});

    Collections[collection].remove(query, function (err, res) {
        if (err) return promise.resolve({});

        promise.resolve(res);
    });
};
db_control.findOne = function(collection, selector, promise) {
	if(!Collections[collection]) return promise.resolve({});

	Collections[collection].findOne(selector, function(err, res) {
	  if (err) return promise.resolve({});

	  promise.resolve(res);
	});
};
db_control.find = function(collection, selector, promise) {
    if(!Collections[collection]) return promise.resolve({});

    Collections[collection].find(selector, function(err, res) {
      if (err) return promise.resolve({});

      promise.resolve(res);
    });
};

module.exports = db_control;