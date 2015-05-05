var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var user = "DShamak";
var password = "mongolabpa33";
var table = "dashboard";
mongoose.connect('mongodb://'+user+':'+password+'@ds031872.mongolab.com:31872/'+table);

function validator (val) {
    return val;
}

var schema = new Schema({
    name: String,
    description: String,
    date: { type: Date, default: Date.now }
});

var Dashboard = mongoose.model('Dashboard', schema);

module.exports = Dashboard;