var fs = require("fs");
var swig = require("swig");

swig.setDefaults({ cache: false });

var renderTemplate = function (temp, data, callback) {
    var tempFile = temp + ".html";

    data = (data) ? data : {};

    fs.exists("./private/templates/" + tempFile, function(exists) {
    	if(!exists) {
    	    return callback("404", null);
    	}

    	var template = swig.compileFile('./private/templates/index.html');

        data.template = tempFile;

    	template = template(data);

    	callback(null, template);
    });
};

module.exports.renderTemplate = renderTemplate;