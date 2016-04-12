var config = {};

var dev = true;
var url = "http://dashboard-61580.onmodulus.net";

config.port = dev ? 3337 : process.env.PORT;
config.clientUrl = dev ? ("http://localhost:" + config.port) : url;
config.serverUrl = dev ? ("http://localhost:" + config.port) : url;

module.exports = config;