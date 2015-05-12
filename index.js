var app = require("./app.js");

var port = 1507;

app.listen(port, function() {
	console.log("Application available on %s port", port);
});