var mongoose = require("mongoose");

var user = "DShamak";
var password = "mongolabpa33";
var id = "";
var table = "dashboard";

mongoose.connect('mongodb://'+user+':'+password+'@ds037087.mongolab.com:37087/'+table);
var mongo;

function validator (val) {
    return val;
}

var schema = new Schema({
    title:  String,
    author: String,
    body:   String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
        votes: Number,
        favs:  Number
    },

    validate: validator
});

var Dashboard = mongoose.model('Dashboard', schema);

module.exports.Dashboard = Dashboard;