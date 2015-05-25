var io = require("socket.io");
var Sockets = [];
var spreadNotifications = function(socket, data) {
	console.log(Sockets.length);
	if(Sockets.length) {
		for(var key in Sockets) {
			if(key != Sockets.indexOf(socket)) Sockets[key].emit("showNotification", data);
		}
	}
};

io.on('connection', function(socket) {
 	if(Sockets.indexOf(socket) == -1) {
 		Sockets.push(socket);
 	}
 	socket.on("spreadNotifications", function(data) {
 		spreadNotifications(this, data);
 	})
	socket.on('disconnect', function(socket) {
	 	Sockets.splice(Sockets.indexOf(socket), 1);
	});
});

module.exports.init = function(server) {
	io = io(server);
};