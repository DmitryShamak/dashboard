var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var user = "Dmitry",
	pass = "123";

var dbUrl = 'mongodb://' + user + ':' + pass + '@ds051883.mongolab.com:51883/dashboard';
mongoose.connect(dbUrl);
var db = mongoose.connection;

var NoteSch = new Schema({
    title: String,
	description: String,
	type: String,
	favorite: Boolean,
	date: Date
});
var Model = mongoose.model('Note', NoteSch);
var DB = {};

/**
	This functon find data in data base
	@param {Object} query //search params
	@param {Function} cb //callback function -> (err, data)
*/
DB.find = function(query, cb) {
	query = query || {};
	Model.find(query, cb);
};

/**
	This functon insert data to data base
	@param {Object} data
	@param {Function} cb //callback function -> (err)
*/
DB.add = function(data, cb) {
	var model = new Model(data);
	model.save(cb);
};

//TODO: [delete, update]

module.exports = DB;