var _ = require('lodash');
//mongoose
var mongoose = require("mongoose");
//connection
var user = {
    name: "dmitry",
    password: "sboardpa33"
};
var connection = mongoose.connection;
connection.once("open", function () {
    console.log('Mongoose connection success');
});
connection.on("error", function () {
    console.log('Mongoose  connection error');
});

mongoose.connect("mongodb://" + user.name + ":"+user.password+"@ds059145.mongolab.com:59145/sboard");

var collections = require("./components/collections")(mongoose);
var db = require("./components/controls")(collections);


module.exports = db;