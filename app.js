var express = require("express");
var fs = require("fs");

var port = 8088;
var app = express();
app.use("/", express.static(__dirname + '/'));
app.use("/public", express.static(__dirname + '/public/'));


app.listen(port, function() {
	console.info("Listen port %s", port);
})
