var socketIo = require("socket.io");
var Sockets = {};

var spreadNotifications = function(socket, data) {
	var length = 0;
	for(var key in Sockets) {
		if(key != socket.id) Sockets[key].emit("showNotification", data);
		length++;
	}
	if(length > 10)
		console.log("Sockets are comming", length);
};

module.exports.emit = socketIo.emit;
module.exports.on = socketIo.on;
module.exports.init = function(server) {
	socketIo = socketIo(server);

	socketIo.on('connection', function(socket) {
	 	if(!Sockets[socket.id]) {
	 		Sockets[socket.id] = socket;
	 	}
	 	socket.on("spreadNotifications", function(data) {
	 		data.redirect = false;
	 		spreadNotifications(this, data);
	 	});
	 	socket.on("onuserdissconnect", function(socket) {
		 	delete Sockets[socket.id];
	 	});
		socket.on('disconnect', function() {});
	});
};