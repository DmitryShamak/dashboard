var app = require("./app.js");

var port = 1506;

app.listen(port, function() {
	console.log("Application available on %s port", port);
});