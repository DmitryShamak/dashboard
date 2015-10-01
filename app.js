var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var db = require("./private/db.js");

var app = express();
var port = 8088,
	rootPath = __dirname;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.use("/", express.static(rootPath));
app.use("/public", express.static(path.join(rootPath,'public/')));

app.get("/board", function(req, res, next) {
	db.find({}, function(err, data) {
		if(err) {
			return res.end();
		}

		res.send(JSON.stringify(data));
	});
});

app.post("/add", function(req, res, next) {
	db.add(req.body, function(err) {
		return res.end(err || "200");
	});
});

app.post("/update", function(req, res, next) {
	db.update(req.body, function(err) {
		return res.end(err || "200");
	});
});

app.post("/remove", function(req, res, next) {
	db.remove(req.body, function(err) {
		return res.end(err || "200");
	});
});

app.listen(port, function() {
	console.info("Listen port %s", port);
})
