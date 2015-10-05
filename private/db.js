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
	priority: Number,
	date: Date,
	storage: String
});
var NoteModel = mongoose.model('Note', NoteSch);
var DB = {};

/**
	This functon find data in data base
	@param {Object} query //search params
	@param {Function} cb //callback function -> (err, data)
*/
DB.find = function(query, cb) {
	query = query || {storage: "note"};
	NoteModel.find(query, cb);
};

/**
	This functon insert data to data base
	@param {Object} data
	@param {Function} cb //callback function -> (err)
*/
DB.add = function(data, cb) {
	var model = new NoteModel(data);
	model.save(cb);
};

DB.update = function(data, cb) {
	NoteModel.update({_id: data._id}, data.upsert, {upsert: true}, cb);
};

DB.remove = function(data, cb) {
	NoteModel.remove({_id: data._id}, cb);
};

DB.archive = function(data, cb) {
	//TODO: get note -> add to archive -> remove note
	//NoteModel.remove({_id: data._id}, cb);
	cb();
};

//TODO: [delete, update]

module.exports = DB;