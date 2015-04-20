var fs = require("fs");
var swig = require("swig");

swig.setDefaults({ cache: false });

var renderTemplate = function (temp, res, data) {
    var tempFile = temp + ".html";

    data = (data) ? data : {};

    fs.exists("./private/templates/" + tempFile, function(exists) {
    	if(!exists) {
    		return res.send(swig.compileFile('./private/templates/error.html')());
    	}

    	var template = swig.compileFile('./private/templates/index.html');

        data.content = tempFile;

    	template = template(data);

    	res.send(template);
    });
};

module.exports.renderTemplate = renderTemplate;