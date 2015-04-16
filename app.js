var express = require("express");
var swig = require("swig");

var dashboardRouter = require("./routes/dashboardRouter.js");

var port = 1506;

var app = express();

app.use("/dashboard", dashboardRouter);

// This is where all the magic happens!
app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', './templates/');

// Swig will cache templates for you, but you can disable
// that and use Express's caching instead, if you like:
app.set('view cache', false);
// To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });
// NOTE: You should always cache templates in a production environment.
// Don't leave both of these to `false` in production!

app.get('/', function (req, res) {
  res.render('index', { /* template locals context */ });
});

var getTemplate = function(template, data) {
	swig.renderFile('./templates/' + template + '.html', data);
};

app.listen(port, function() {
	console.log("Application available on %s port", port);
});
